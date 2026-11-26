/* SecPlus Quest — text-to-speech.
 * Engine 1: the browser's built-in Web Speech API (free, works offline, no setup).
 * Engine 2: ElevenLabs (natural voice). The user's API key is stored ONLY in this
 *           browser's localStorage and is sent only to api.elevenlabs.io.
 * Generated ElevenLabs audio is cached in the browser so each line is paid for once.
 *
 * Design rules:
 *  - Never fail silently. Every ElevenLabs failure is explained in plain English
 *    (TTS.lastStatus + a toast), then the built-in voice takes over.
 *  - One reusable <audio> element, unlocked on the first tap, so mobile browsers
 *    (iPhone Safari especially) allow playback after the network request finishes. */

window.TTS = (function () {
  const CACHE_NAME = "secplus-quest-tts-v1";
  const DEFAULT_VOICE = "bIHbv24MWmeRgasZH58o"; // Will: Relaxed Optimist (built-in on every account)
  const memCache = new Map();
  let speakToken = 0;
  let lastStatus = { engine: null, ok: null, message: "" };

  // ---- Single shared audio element, unlocked on first user gesture ----
  const audioEl = new Audio();
  audioEl.preload = "auto";
  let unlocked = false;
  function unlock() {
    if (unlocked) return;
    unlocked = true;
    try {
      // Play a tiny silent WAV inside the user's tap so later programmatic plays are allowed.
      const silent = "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=";
      audioEl.src = silent;
      const p = audioEl.play();
      if (p) p.catch(() => { unlocked = false; });
    } catch (e) { unlocked = false; }
    try { if ("speechSynthesis" in window) window.speechSynthesis.getVoices(); } catch (e) {}
  }
  ["pointerdown", "keydown", "touchstart"].forEach((ev) => document.addEventListener(ev, unlock, { capture: true, passive: true }));

  function settings() { return window.App ? window.App.settings() : {}; }
  function toast(m) { if (window.App) window.App.toast(m); }

  function stop() {
    speakToken++;
    try { window.speechSynthesis && window.speechSynthesis.cancel(); } catch (e) {}
    try { audioEl.pause(); } catch (e) {}
  }

  // Clean text for speech: expand a few acronyms/symbols that engines mangle.
  function prep(text) {
    return String(text)
      .replace(/\bSY0-701\b/g, "S Y zero seven oh one")
      .replace(/\b802\.1X\b/gi, "eight oh two dot one X")
      .replace(/\b802\.11/g, "eight oh two dot eleven ")
      .replace(/\/(\d{1,3})\b/g, " slash $1")
      .replace(/→/g, " then ")
      .replace(/&/g, " and ")
      .replace(/\s+/g, " ")
      .trim();
  }

  // ---- Key checks & friendly errors ----
  const KEY_ID_MSG = "That's the Key ID, not the API key. On ElevenLabs, create a new key and copy the value that starts with 'sk_' (it's only shown once, right when you create it).";
  function keyProblem(key) {
    const k = String(key || "").trim();
    if (!k) return "No ElevenLabs API key yet. Paste it in ⚙️ Settings.";
    if (k.startsWith("sk_")) return k.length >= 20 ? "" : "That key looks cut off. Copy the whole key that starts with 'sk_'.";
    if (/^[0-9a-f]{32}$/i.test(k)) return ""; // older-style ElevenLabs keys (32 hex characters) still work
    if (/^[0-9a-f]{40,}$/i.test(k)) return KEY_ID_MSG;
    return "ElevenLabs API keys start with 'sk_'. Double-check that you copied the whole key.";
    return "";
  }
  function friendly(status, detail) {
    const code = String((detail && (detail.code || detail.status)) || "");
    const msg = String((detail && detail.message) || (typeof detail === "string" ? detail : ""));
    if (/key id used/i.test(msg)) return KEY_ID_MSG;
    if (/missing_permissions/i.test(code) || /permission/i.test(msg)) {
      const which = /voices_read/i.test(msg) ? "Voices → Read" : /text_to_speech/i.test(msg) ? "Text to Speech → Access" : "the needed permission";
      return "Your ElevenLabs key is missing a permission. Turn on " + which + " for this key at elevenlabs.io → Developers → API Keys → ⋯ → Edit.";
    }
    if (status === 429 || /quota|credits|limit/i.test(code + msg)) return "Out of ElevenLabs credits (or rate-limited) for now, so the built-in voice is being used.";
    if (status === 401 || /invalid_api_key|unauthor/i.test(code + msg)) return "ElevenLabs rejected the API key. Make sure you pasted the full key that starts with 'sk_'.";
    if (status === 404 || /voice_not_found/i.test(code + msg)) return "That ElevenLabs voice wasn't found on your account. Pick another voice in ⚙️ Settings.";
    return "ElevenLabs error " + status + (msg ? ": " + msg : "");
  }

  async function readError(res) {
    try { const j = await res.json(); return j.detail || j; } catch (e) { return null; }
  }

  async function elevenAudioUrl(text) {
    const s = settings();
    const problem = keyProblem(s.elKey);
    if (problem) throw new Error(problem);
    const voice = s.elVoice || DEFAULT_VOICE;
    const model = s.elModel || "eleven_flash_v2_5";
    const key = window.hashText(voice + "|" + model + "|" + text);
    if (memCache.has(key)) return memCache.get(key);

    const cacheUrl = "https://tts-cache.secplus-quest/" + key;
    let cache = null;
    try { cache = await caches.open(CACHE_NAME); } catch (e) {}
    if (cache) {
      try {
        const hit = await cache.match(cacheUrl);
        if (hit) { const url = URL.createObjectURL(await hit.blob()); memCache.set(key, url); return url; }
      } catch (e) {}
    }

    let res;
    try {
      res = await fetch(
        "https://api.elevenlabs.io/v1/text-to-speech/" + encodeURIComponent(voice) + "?output_format=mp3_44100_64",
        { method: "POST", headers: { "xi-api-key": s.elKey.trim(), "Content-Type": "application/json", Accept: "audio/mpeg" },
          body: JSON.stringify({ text: prep(text), model_id: model }) }
      );
    } catch (e) {
      throw new Error("Couldn't reach ElevenLabs. Check your internet connection.");
    }
    if (!res.ok) throw new Error(friendly(res.status, await readError(res)));
    const blob = await res.blob();
    if (cache) { try { await cache.put(cacheUrl, new Response(blob, { headers: { "Content-Type": "audio/mpeg" } })); } catch (e) {} }
    const url = URL.createObjectURL(blob);
    memCache.set(key, url);
    return url;
  }

  function playUrl(url, token) {
    return new Promise(function (resolve, reject) {
      if (token !== speakToken) return resolve();
      audioEl.onended = () => resolve();
      audioEl.onerror = () => reject(new Error("The browser couldn't play the ElevenLabs audio."));
      audioEl.src = url;
      audioEl.playbackRate = Number(settings().rate || 1);
      const p = audioEl.play();
      if (p) p.catch((e) => {
        if (token !== speakToken) return resolve(); // interrupted on purpose
        reject(new Error("Your browser blocked the audio. Tap anywhere on the page, then try again."));
      });
    });
  }

  function speakBrowser(text, token) {
    return new Promise(function (resolve) {
      if (!("speechSynthesis" in window) || token !== speakToken) return resolve();
      const s = settings();
      const u = new SpeechSynthesisUtterance(prep(text));
      u.rate = Number(s.rate || 1);
      const v = s.browserVoice && window.speechSynthesis.getVoices().find((x) => x.name === s.browserVoice);
      if (v) u.voice = v;
      u.onend = u.onerror = () => resolve();
      window.speechSynthesis.speak(u);
    });
  }

  // Speak a list of text chunks in order. Resolves true if it finished (not interrupted).
  async function say(chunks) {
    stop();
    const token = speakToken;
    const list = (Array.isArray(chunks) ? chunks : [chunks]).filter(Boolean);
    let useEleven = settings().engine === "eleven";
    for (const text of list) {
      if (token !== speakToken) return false;
      if (useEleven) {
        try {
          const url = await elevenAudioUrl(text);
          if (token !== speakToken) return false;
          await playUrl(url, token);
          lastStatus = { engine: "eleven", ok: true, message: "" };
          continue;
        } catch (err) {
          lastStatus = { engine: "eleven", ok: false, message: err.message };
          toast("🔇 " + err.message);
          useEleven = false; // don't keep hitting the API for the rest of this read-out
        }
      } else {
        lastStatus = { engine: "browser", ok: true, message: "" };
      }
      await speakBrowser(text, token);
    }
    return token === speakToken;
  }

  // Settings "Test" button: tries ElevenLabs only and reports exactly what happened.
  async function testEleven(text) {
    stop();
    const token = speakToken;
    try {
      const url = await elevenAudioUrl(text);
      await playUrl(url, token);
      lastStatus = { engine: "eleven", ok: true, message: "" };
      return { ok: true };
    } catch (err) {
      lastStatus = { engine: "eleven", ok: false, message: err.message };
      return { ok: false, message: err.message };
    }
  }

  // Fetch and cache a line ahead of time so the next segment starts without a gap (ElevenLabs only).
  function prefetch(text) {
    const s = settings();
    if (s.engine !== "eleven" || keyProblem(s.elKey)) return;
    elevenAudioUrl(text).catch(() => {});
  }

  function isSpeaking() {
    return !audioEl.paused || (window.speechSynthesis && window.speechSynthesis.speaking);
  }

  async function clearCache() {
    memCache.clear();
    try { await caches.delete(CACHE_NAME); } catch (e) {}
  }

  async function listElevenVoices(apiKey) {
    const problem = keyProblem(apiKey);
    if (problem) throw new Error(problem);
    let res;
    try { res = await fetch("https://api.elevenlabs.io/v1/voices", { headers: { "xi-api-key": String(apiKey).trim() } }); }
    catch (e) { throw new Error("Couldn't reach ElevenLabs. Check your internet connection."); }
    if (!res.ok) throw new Error(friendly(res.status, await readError(res)));
    const j = await res.json();
    return (j.voices || []).map((v) => ({ id: v.voice_id, name: v.name }));
  }

  return {
    say, stop, prefetch, isSpeaking, clearCache, listElevenVoices, testEleven, keyProblem, DEFAULT_VOICE,
    get lastStatus() { return lastStatus; },
  };
})();
