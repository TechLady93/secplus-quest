/* SecPlus Quest — text-to-speech.
 * Engine 1: the browser's built-in Web Speech API (free, works offline, no setup).
 * Engine 2: ElevenLabs (natural voice). The user's API key is stored ONLY in this
 *           browser's localStorage and is sent only to api.elevenlabs.io.
 * Generated ElevenLabs audio is cached in the browser so each line is paid for once. */

window.TTS = (function () {
  const CACHE_NAME = "secplus-quest-tts-v1";
  const memCache = new Map();
  let audioEl = null;
  let speakToken = 0;

  function settings() {
    return window.App ? window.App.settings() : {};
  }

  function stop() {
    speakToken++;
    try { window.speechSynthesis && window.speechSynthesis.cancel(); } catch (e) {}
    if (audioEl) { audioEl.pause(); audioEl.src = ""; audioEl = null; }
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

  function speakBrowser(text, token) {
    return new Promise(function (resolve) {
      if (!("speechSynthesis" in window)) return resolve();
      const s = settings();
      const u = new SpeechSynthesisUtterance(prep(text));
      u.rate = Number(s.rate || 1);
      const voices = window.speechSynthesis.getVoices();
      if (s.browserVoice) {
        const v = voices.find(function (x) { return x.name === s.browserVoice; });
        if (v) u.voice = v;
      }
      u.onend = u.onerror = function () { resolve(); };
      if (token !== speakToken) return resolve();
      window.speechSynthesis.speak(u);
    });
  }

  async function elevenAudioUrl(text) {
    const s = settings();
    const voice = s.elVoice || "21m00Tcm4TlvDq8ikWAM";
    const model = s.elModel || "eleven_flash_v2_5";
    const key = window.hashText(voice + "|" + model + "|" + text);
    if (memCache.has(key)) return memCache.get(key);

    const cacheUrl = "https://tts-cache.secplus-quest/" + key;
    let cache = null;
    try { cache = await caches.open(CACHE_NAME); } catch (e) {}
    if (cache) {
      const hit = await cache.match(cacheUrl);
      if (hit) {
        const url = URL.createObjectURL(await hit.blob());
        memCache.set(key, url);
        return url;
      }
    }

    const res = await fetch(
      "https://api.elevenlabs.io/v1/text-to-speech/" + encodeURIComponent(voice) + "?output_format=mp3_44100_64",
      {
        method: "POST",
        headers: { "xi-api-key": s.elKey, "Content-Type": "application/json", Accept: "audio/mpeg" },
        body: JSON.stringify({ text: prep(text), model_id: model }),
      }
    );
    if (!res.ok) {
      let msg = "ElevenLabs error " + res.status;
      try { const j = await res.json(); if (j.detail) msg += ": " + (j.detail.message || JSON.stringify(j.detail)); } catch (e) {}
      throw new Error(msg);
    }
    const blob = await res.blob();
    if (cache) { try { await cache.put(cacheUrl, new Response(blob, { headers: { "Content-Type": "audio/mpeg" } })); } catch (e) {} }
    const url = URL.createObjectURL(blob);
    memCache.set(key, url);
    return url;
  }

  function playUrl(url, token) {
    return new Promise(function (resolve) {
      if (token !== speakToken) return resolve();
      audioEl = new Audio(url);
      audioEl.playbackRate = Number(settings().rate || 1);
      audioEl.onended = audioEl.onerror = function () { resolve(); };
      audioEl.play().catch(function () { resolve(); });
    });
  }

  // Speak a list of text chunks in order. Resolves when done or interrupted.
  async function say(chunks) {
    stop();
    const token = speakToken;
    const list = Array.isArray(chunks) ? chunks : [chunks];
    const s = settings();
    const useEleven = s.engine === "eleven" && s.elKey;
    for (const text of list) {
      if (token !== speakToken) return false;
      if (!text) continue;
      if (useEleven) {
        try {
          const url = await elevenAudioUrl(text);
          await playUrl(url, token);
          continue;
        } catch (err) {
          if (window.App) window.App.toast("🔇 " + err.message + " — using built-in voice.");
        }
      }
      await speakBrowser(text, token);
    }
    return token === speakToken;
  }

  function isSpeaking() {
    return (audioEl && !audioEl.paused) || (window.speechSynthesis && window.speechSynthesis.speaking);
  }

  async function clearCache() {
    memCache.clear();
    try { await caches.delete(CACHE_NAME); } catch (e) {}
  }

  async function listElevenVoices(apiKey) {
    const res = await fetch("https://api.elevenlabs.io/v1/voices", { headers: { "xi-api-key": apiKey } });
    if (!res.ok) throw new Error("Could not load voices (" + res.status + "). Check your API key.");
    const j = await res.json();
    return (j.voices || []).map(function (v) { return { id: v.voice_id, name: v.name }; });
  }

  return { say: say, stop: stop, isSpeaking: isSpeaking, clearCache: clearCache, listElevenVoices: listElevenVoices };
})();
