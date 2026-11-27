/* SecPlus Quest — voice answers (speech recognition).
 * Uses the browser's built-in SpeechRecognition (Chrome, Edge, Safari on iPhone/Mac).
 * Nothing is recorded or stored by the app. Listening only starts after the app
 * finishes speaking, so it doesn't hear its own voice.
 *
 * VoiceIn.parse(transcript, choices) turns what you said into:
 *   { pick: 0-5 }  an answer choice ("B", "bee", "option C", "two", or the answer's words)
 *   { cmd: "repeat" | "next" | "explain" | "stop" | "skip" }
 *   null           didn't understand */

window.VoiceIn = (function () {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  let rec = null, token = 0, blocked = false;

  const supported = () => !!SR;

  function stop() {
    token++;
    if (rec) { try { rec.onresult = rec.onend = rec.onerror = null; rec.abort(); } catch (e) {} rec = null; }
  }

  // Spoken words that mean a letter or position.
  const WORDS = {
    0: ["a", "ay", "eh", "hey", "alpha", "one", "1", "first"],
    1: ["b", "be", "bee", "bea", "bravo", "two", "to", "too", "2", "second"],
    2: ["c", "see", "sea", "si", "cee", "charlie", "three", "3", "third"],
    3: ["d", "dee", "de", "delta", "four", "for", "4", "fourth"],
    4: ["e", "echo", "five", "5", "fifth"],
    5: ["f", "foxtrot", "six", "6", "sixth"],
  };
  const LOOKUP = {};
  Object.keys(WORDS).forEach((i) => WORDS[i].forEach((w) => (LOOKUP[w] = Number(i))));
  const FILLER = /^(?:(?:um+|uh+|ok(?:ay)?|so|i think(?: it'?s)?|i'?ll (?:go with|say|pick)|i (?:say|pick|choose)|my answer is|the answer is|answer|it'?s|its|is|it is|letter|option|choice|number|the)\s+)+/;
  const norm = (s) => String(s).toLowerCase().replace(/[^a-z0-9' ]/g, " ").replace(/\s+/g, " ").trim();
  const STOP = new Set("the a an of to and or for in on is it be by with that this which what from as at are".split(" "));
  const words = (s) => norm(s).split(" ").filter((w) => w && !STOP.has(w));

  function parse(transcript, choices) {
    let t = norm(transcript);
    if (!t) return null;
    const n = choices.length;
    // "B", "bee", "option C", "I think it's D", "two", "the second one"
    const core = t.replace(FILLER, "").replace(/\s+(one|please|final answer)$/, "").trim();
    if (core in LOOKUP && LOOKUP[core] < n) return { pick: LOOKUP[core] };
    const tagged = t.match(/\b(?:letter|option|choice|answer|number)\s+([a-z0-9]+)\b/);
    if (tagged && tagged[1] in LOOKUP && LOOKUP[tagged[1]] < n) return { pick: LOOKUP[tagged[1]] };
    // "B. Firewall" style: a letter followed by the choice text
    const lead = core.split(" ")[0];
    if (lead in LOOKUP && LOOKUP[lead] < n && core.split(" ").length > 1) {
      const rest = core.split(" ").slice(1).join(" ");
      if (overlap(rest, choices[LOOKUP[lead]]) >= 0.5) return { pick: LOOKUP[lead] };
    }
    // Short commands ("repeat", "next", "why") — checked after letters so an answer is never mistaken for one.
    if (t.split(" ").length <= 5) {
      if (/\b(repeat|again|say that again|read (it|that) again|what was (it|that)|come again)\b/.test(t)) return { cmd: "repeat" };
      if (/\b(next|continue|keep going|go on|move on|next question)\b/.test(t)) return { cmd: "next" };
      if (/\b(explain|why)\b/.test(t)) return { cmd: "explain" };
      if (/\b(stop listening|stop|quit|pause)\b/.test(t)) return { cmd: "stop" };
      if (/\b(i don'?t know|no idea|skip|skip it|pass on this)\b/.test(t)) return { cmd: "skip" };
    }
    // Said the answer itself ("public key infrastructure", "the firewall")
    let best = -1, bestS = 0, second = 0;
    choices.forEach((c, i) => {
      const s = norm(c) === core ? 2 : overlap(t, c);
      if (s > bestS) { second = bestS; bestS = s; best = i; } else if (s > second) second = s;
    });
    if (best >= 0 && bestS >= 0.6 && bestS - second >= 0.25) return { pick: best };
    return null;
  }
  // Share of the choice's key words that the speaker said.
  function overlap(said, choice) {
    const c = words(choice), s = new Set(words(said));
    if (!c.length) return 0;
    return c.filter((w) => s.has(w) || s.has(w.replace(/s$/, ""))).length / c.length;
  }

  /* Listen once. opts.onHeard(alternatives[]) gets every transcript the engine offers.
   * opts.onEnd(reason) runs if nothing usable was heard: "no-speech", "not-allowed", "error". */
  function listen(opts) {
    stop();
    if (!SR) { opts.onEnd && opts.onEnd("unsupported"); return; }
    const my = ++token;
    const r = new SR();
    rec = r;
    r.lang = "en-US"; r.continuous = false; r.interimResults = false; r.maxAlternatives = 5;
    let got = false;
    r.onstart = () => { if (my === token) opts.onStart && opts.onStart(); };
    r.onresult = (e) => {
      if (my !== token) return;
      got = true;
      const res = e.results[e.results.length - 1], alts = [];
      for (let i = 0; i < res.length; i++) alts.push(res[i].transcript);
      opts.onHeard(alts);
    };
    r.onerror = (e) => {
      if (my !== token) return;
      if (e.error === "not-allowed" || e.error === "service-not-allowed") blocked = true;
      got = true; // handled here
      opts.onEnd && opts.onEnd(e.error === "no-speech" || e.error === "aborted" ? "no-speech" : e.error === "not-allowed" || e.error === "service-not-allowed" ? "not-allowed" : "error");
    };
    r.onend = () => {
      if (my !== token) return;
      rec = null;
      if (!got) opts.onEnd && opts.onEnd("no-speech");
    };
    try { r.start(); blocked = false; } catch (e) { opts.onEnd && opts.onEnd("not-allowed"); }
  }

  return { supported, listen, stop, parse, get blocked() { return blocked; }, get listening() { return !!rec; } };
})();
