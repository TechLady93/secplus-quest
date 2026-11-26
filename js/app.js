/* SecPlus Quest — app engine.
 * Plain JavaScript, no build step. All progress is stored in localStorage. */
(function () {
  "use strict";

  // ---------- Storage ----------
  const APP_VERSION = "1.3.2";
  const STATE_KEY = "spq-state-v1";
  const SETTINGS_KEY = "spq-settings-v1";
  const LETTERS = ["A", "B", "C", "D", "E", "F"];
  const BOX_DAYS = [0, 1, 2, 4, 7, 15]; // Leitner spaced-repetition intervals
  const DAY = 86400000;

  function load(key, fallback) {
    try { const v = JSON.parse(localStorage.getItem(key)); return v && typeof v === "object" ? Object.assign({}, fallback, v) : fallback; }
    catch (e) { return fallback; }
  }
  function save(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {} }

  const defaultState = () => ({ xp: 0, q: {}, exams: [], streakDays: 0, lastDay: null, today: { date: null, n: 0 }, bestCombo: 0, badges: [] });
  const defaultSettings = {
    engine: "browser", elKey: "", elVoice: "bIHbv24MWmeRgasZH58o", elModel: "eleven_flash_v2_5",
    rate: 1, browserVoice: "", autoRead: "off", dailyGoal: 30, audioPause: 6, practiceSize: 10, elVoices: [],
  };
  let state = load(STATE_KEY, defaultState());
  let settings = load(SETTINGS_KEY, defaultSettings);
  // Migrate earlier default voices (Rachel, Bella) to the current default (Will) unless the user picked a voice.
  if (settings.elVoice === "21m00Tcm4TlvDq8ikWAM" || (settings.elVoice === "hpp4J3VqNfWAUOO0d1Us" && !settings.pickedVoice)) settings.elVoice = defaultSettings.elVoice;
  if (!settings.migratedEngine) {
    settings.migratedEngine = true;
    if (settings.elKey && /^sk_|^[0-9a-f]{32}$/i.test(String(settings.elKey).trim()) && settings.engine === "browser") settings.engine = "eleven";
    save(SETTINGS_KEY, settings);
  }
  const persist = () => save(STATE_KEY, state);

  // ---------- Helpers ----------
  const $app = document.getElementById("app");
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const shuffle = (arr) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const pct = (n) => Math.round(n * 100);
  const todayStr = () => new Date().toISOString().slice(0, 10);
  const byId = {};
  QBANK.forEach((q) => (byId[q.id] = q));
  const secQs = QBANK.filter((q) => q.d > 0);

  function toast(msg) {
    const t = document.getElementById("toast");
    t.textContent = msg; t.classList.add("show");
    clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove("show"), 2600);
  }

  // Build a playable instance with shuffled choices.
  function inst(q) {
    const order = shuffle(q.a.map((_, i) => i));
    return { q, order, correct: order.indexOf(q.c), picked: null, flagged: false };
  }

  // ---------- Progress & mastery ----------
  function rec(id) { return state.q[id] || { box: 0, seen: 0, right: 0, wrong: 0, last: 0 }; }
  function record(id, ok) {
    const r = rec(id);
    r.seen++; r.last = Date.now();
    if (ok) { r.right++; r.box = Math.min(r.box + 1, 5); } else { r.wrong++; r.box = 0; }
    state.q[id] = r;
    // daily + streak
    const t = todayStr();
    if (state.today.date !== t) {
      const y = new Date(Date.now() - DAY).toISOString().slice(0, 10);
      state.streakDays = state.lastDay === y ? state.streakDays + 1 : state.lastDay === t ? state.streakDays : 1;
      state.today = { date: t, n: 0 };
    }
    state.lastDay = t;
    state.today.n++;
    persist();
  }
  function addXP(n) {
    const before = rankFor(state.xp);
    state.xp += n; persist();
    const after = rankFor(state.xp);
    if (after.title !== before.title) toast(after.badge + " Rank up! You're now a " + after.title + "!");
  }
  function rankFor(xp) { let r = RANKS[0]; RANKS.forEach((x) => { if (xp >= x.xp) r = x; }); return r; }
  function nextRank(xp) { return RANKS.find((x) => x.xp > xp); }

  // Mastery: a question counts fully once it has climbed to box 3+.
  function mastery(qs) {
    if (!qs.length) return 0;
    let s = 0; qs.forEach((q) => (s += Math.min(rec(q.id).box, 3) / 3));
    return s / qs.length;
  }
  function accuracy(qs) {
    let r = 0, n = 0; qs.forEach((q) => { const x = rec(q.id); r += x.right; n += x.right + x.wrong; });
    return n ? r / n : null;
  }
  const qsDomain = (d) => QBANK.filter((q) => q.d === d);
  const qsObj = (o) => QBANK.filter((q) => q.o === o);
  function readiness() {
    let s = 0; DOMAINS.filter((d) => d.weight).forEach((d) => (s += d.weight * mastery(qsDomain(d.id)))); return s;
  }
  function weakQueue(pool) {
    const now = Date.now();
    return pool
      .filter((q) => { const r = rec(q.id); return r.seen > 0 && (r.box === 0 || now - r.last >= BOX_DAYS[r.box] * DAY); })
      .sort((a, b) => rec(a.id).box - rec(b.id).box || rec(a.id).last - rec(b.id).last);
  }
  // Prefer unseen and weak questions when building a practice set.
  function smartPick(pool, n) {
    const scored = shuffle(pool).map((q) => { const r = rec(q.id); return { q, s: r.seen === 0 ? 0 : r.box + 1 + Math.random() }; });
    return scored.sort((a, b) => a.s - b.s).slice(0, n).map((x) => x.q);
  }

  // ---------- Voice ----------
  function questionSpeech(it, num) {
    const parts = [(num ? "Question " + num + ". " : "") + it.q.q];
    it.order.forEach((ci, i) => parts.push(LETTERS[i] + ". " + it.q.a[ci]));
    return parts;
  }
  function answerSpeech(it) {
    return ["The correct answer is " + LETTERS[it.correct] + ". " + it.q.a[it.q.c] + ".", it.q.e];
  }

  // ---------- Router ----------
  let view = null, session = null, timerId = null;
  function go(v, data) {
    TTS.stop(); clearInterval(timerId); timerId = null;
    view = v; window.scrollTo(0, 0);
    VIEWS[v](data);
  }
  function topbar(extra) {
    const r = rankFor(state.xp);
    return `<div class="topbar">
      <div class="brand" data-go="home" tabindex="0"><img src="assets/logo.svg" alt="" width="26" height="26" style="vertical-align:-6px;margin-right:6px">SecPlus <span>Quest</span></div>
      <div class="row">${extra || ""}
        <span class="chip gold" title="Experience points">${r.badge} ${state.xp} XP</span>
        <span class="chip" title="Daily streak">🔥 ${state.streakDays}</span>
        <button class="btn sm ghost" data-go="settings" aria-label="Settings">⚙️</button>
      </div></div>`;
  }
  $app.addEventListener("click", (e) => {
    const g = e.target.closest("[data-go]");
    if (g) { e.preventDefault(); const arg = g.dataset.arg; go(g.dataset.go, arg !== undefined ? arg : undefined); }
  });
  $app.addEventListener("keydown", (e) => {
    if ((e.key === "Enter" || e.key === " ") && e.target.matches(".card.click,.brand")) { e.preventDefault(); e.target.click(); }
  });

  const VIEWS = {};

  // ---------- Home ----------
  VIEWS.home = function () {
    const r = rankFor(state.xp), nr = nextRank(state.xp);
    const prog = nr ? (state.xp - r.xp) / (nr.xp - r.xp) : 1;
    const ready = readiness();
    const t = state.today.date === todayStr() ? state.today.n : 0;
    const weakN = weakQueue(secQs).length;
    const last = state.exams[state.exams.length - 1];
    $app.innerHTML = topbar() + `
      <div class="card hero">
        <div class="row spread">
          <div class="row"><div class="rank">${r.badge}</div>
            <div><div class="muted small">Current rank</div><h2 style="margin:0">${r.title}</h2></div></div>
          <div style="text-align:right"><div class="muted small">Exam readiness</div>
            <div style="font-size:1.8rem;font-weight:800;color:${ready >= 0.8 ? "var(--green)" : "var(--gold)"}">${pct(ready)}%</div></div>
        </div>
        <div style="margin-top:12px" class="small muted">${nr ? `${nr.xp - state.xp} XP to ${nr.badge} ${nr.title}` : "Max rank reached. Go book that exam! 👑"}</div>
        <div class="bar gold" style="margin-top:6px"><i style="width:${pct(prog)}%"></i></div>
        <div class="row spread small" style="margin-top:12px">
          <span>🎯 Today: <b>${t}</b> / ${settings.dailyGoal} questions</span>
          <span class="muted">${last ? `Last exam: <b>${last.scaled}</b> ${last.scaled >= EXAM.passScaled ? "✅" : "❌"}` : "No practice exams yet"}</span>
        </div>
        <div class="bar" style="margin-top:6px"><i style="width:${Math.min(100, pct(t / settings.dailyGoal))}%"></i></div>
      </div>

      <h2 style="margin-top:22px">Choose your mission</h2>
      <div class="grid grid-2">
        <div class="card click mode" data-go="course" tabindex="0" style="grid-column:1/-1;border-color:#145e57"><div class="ico">🧭</div><div><h3>Course Path ${nextNode() ? `<span class="chip teal">Next: ${esc(nextNode().label)}</span>` : `<span class="chip gold">Complete! 👑</span>`}</h3><p class="muted small">Work through all ${SECTIONS.length} sections in course order, one topic at a time, with a review checkpoint after every objective. ${pct(pathProgress())}% complete.</p></div></div>
        <div class="card click mode" data-go="examIntro" tabindex="0"><div class="ico">🐉</div><div><h3>Boss Battle: Practice Exam</h3><p class="muted small">${EXAM.questions} questions, ${EXAM.minutes} minutes, weighted like the real SY0-701. Scored on the 100–900 scale.</p></div></div>
        <div class="card click mode" data-go="weak" tabindex="0"><div class="ico">🎯</div><div><h3>Weak Spots ${weakN ? `<span class="chip gold">${weakN} due</span>` : ""}</h3><p class="muted small">Spaced repetition. Questions you missed come back until you've mastered them.</p></div></div>
        <div class="card click mode" data-go="audioSetup" tabindex="0"><div class="ico">🎧</div><div><h3>Audio Study (hands-free)</h3><p class="muted small">Reads each question and choices, pauses so you can think, then reads the answer and why it's right.</p></div></div>
        <div class="card click mode" data-go="lightning" tabindex="0"><div class="ico">⚡</div><div><h3>Lightning Round</h3><p class="muted small">15 questions, 20 seconds each. Build combos for bonus XP.</p></div></div>
        <div class="card click mode" data-go="flashSetup" tabindex="0"><div class="ico">🃏</div><div><h3>Flashcards</h3><p class="muted small">Flip cards to see the answer and explanation. Rate yourself honestly.</p></div></div>
        <div class="card click mode" data-go="stats" tabindex="0"><div class="ico">📊</div><div><h3>My Stats</h3><p class="muted small">Mastery by objective, exam history, and where to focus next.</p></div></div>
      </div>

      <h2 style="margin-top:22px">Practice by domain</h2>
      <div class="grid grid-2">${DOMAINS.map((d) => {
        const qs = qsDomain(d.id), m = mastery(qs);
        return `<div class="card click" data-go="domain" data-arg="${d.id}" tabindex="0" style="border-left:4px solid ${d.color}">
          <div class="row spread"><h3 style="margin:0">${d.icon} ${d.bonus ? "" : d.id + ".0 "}${esc(d.name)}</h3>
          <span class="tag">${d.weight ? pct(d.weight) + "% of exam" : "bonus"}</span></div>
          <div class="small muted" style="margin:6px 0">${qs.length} questions · ${pct(m)}% mastered</div>
          <div class="bar"><i style="width:${pct(m)}%"></i></div></div>`;
      }).join("")}</div>
      <p class="small muted" style="margin-top:22px">Tip: press <span class="kbd">1</span>–<span class="kbd">4</span> to answer, <span class="kbd">Enter</span> for next, and <span class="kbd">R</span> to read aloud.</p>`;
  };

  // ---------- Course Path (follows the course section order) ----------
  // Path = each objective's course sections in order, then an objective review checkpoint
  // that drills the core bank questions for that objective.
  const PATH = (function () {
    const nodes = [], seen = new Set();
    SECTIONS.forEach((s, i) => {
      nodes.push({ key: s.key, o: s.o, label: s.o + " " + s.t, qs: QBANK.filter((q) => q.sec === s.key) });
      const next = SECTIONS[i + 1];
      if ((!next || next.o !== s.o) && !seen.has(s.o)) {
        seen.add(s.o);
        const core = QBANK.filter((q) => q.o === s.o && !q.sec);
        if (core.length) nodes.push({ key: "review-" + s.o, o: s.o, label: s.o + " Checkpoint", review: true, qs: core });
      }
    });
    return nodes;
  })();
  const nodeDone = (n) => mastery(n.qs) >= 0.67 || (accuracy(n.qs) !== null && accuracy(n.qs) >= 0.8 && n.qs.every((q) => rec(q.id).seen > 0));
  function nextNode() { return PATH.find((n) => !nodeDone(n)); }
  function pathProgress() { return PATH.filter(nodeDone).length / PATH.length; }
  function startNode(n) {
    const qs = n.review ? smartPick(n.qs, Math.min(15, n.qs.length)) : shuffle(n.qs);
    startPractice((n.review ? "🏁 " : "🧭 ") + n.label, qs, { node: n.key });
  }

  VIEWS.course = function () {
    const nx = nextNode();
    let lastD = null;
    $app.innerHTML = topbar() + `<button class="btn sm ghost" data-go="home">← Back</button>
      <h1 style="margin-top:12px">🧭 Course Path</h1>
      <p class="muted">Study one section at a time, in the same order as the course notes. A section counts as done once you've answered all of it with 80%+ accuracy. Every objective ends with a 🏁 checkpoint that mixes in the core question bank.</p>
      <div class="bar gold" style="margin:6px 0 14px"><i style="width:${pct(pathProgress())}%"></i></div>
      ${nx ? `<button class="btn primary" id="cont" style="margin-bottom:16px">▶ Continue: ${esc(nx.label)}</button>` : `<div class="card" style="margin-bottom:16px">👑 You've completed the whole path. Take a 🐉 Boss Battle!</div>`}
      <div class="grid">${PATH.map((n, i) => {
        const d = Number(n.o[0]); let head = "";
        if (d !== lastD) { lastD = d; const D = DOMAINS.find((x) => x.id === d); head = `<h2 style="margin:14px 0 4px">${D.icon} ${d}.0 ${esc(D.name)}</h2>`; }
        const done = nodeDone(n), m = mastery(n.qs), isNext = nx && nx.key === n.key;
        return head + `<div class="card click" data-node="${i}" tabindex="0" style="padding:12px 14px;${isNext ? "border-color:var(--teal)" : ""}${n.review ? ";background:#13224a" : ""}">
          <div class="row spread"><div>${done ? "✅" : isNext ? "▶️" : n.review ? "🏁" : "⬜"} <b>${esc(n.label)}</b></div>
          <span class="small muted">${n.qs.length} Q · ${pct(m)}%</span></div></div>`;
      }).join("")}</div>`;
    const c = $app.querySelector("#cont"); if (c) c.onclick = () => startNode(nx);
    $app.querySelectorAll("[data-node]").forEach((el) => (el.onclick = () => startNode(PATH[Number(el.dataset.node)])));
  };

  // ---------- Domain ----------
  VIEWS.domain = function (id) {
    const d = DOMAINS.find((x) => String(x.id) === String(id));
    const objs = Object.keys(OBJECTIVES).filter((o) => (d.id === 0 ? o.startsWith("N") : o.startsWith(d.id + ".")));
    const qs = qsDomain(d.id);
    $app.innerHTML = topbar() + `
      <button class="btn sm ghost" data-go="home">← Back</button>
      <h1 style="margin-top:12px">${d.icon} ${esc(d.name)}</h1>
      <p class="muted">${qs.length} questions · ${pct(mastery(qs))}% mastered${accuracy(qs) !== null ? ` · ${pct(accuracy(qs))}% accuracy` : ""}</p>
      <div class="row" style="margin-bottom:16px">
        <button class="btn primary" id="all">▶ Practice ${Math.min(settings.practiceSize, qs.length)} from this domain</button>
        <button class="btn" id="every">Every question (${qs.length})</button>
      </div>
      <div class="grid">${objs.map((o) => {
        const oq = qsObj(o), m = mastery(oq), acc = accuracy(oq);
        return `<div class="card click" data-obj="${o}" tabindex="0">
          <div class="row spread"><div><span class="tag">${o}</span> <b>${esc(OBJECTIVES[o])}</b></div>
          <span class="small muted">${oq.length} Q${acc !== null ? ` · ${pct(acc)}% acc` : ""}</span></div>
          <div class="bar" style="margin-top:8px"><i style="width:${pct(m)}%"></i></div></div>`;
      }).join("")}</div>`;
    $app.querySelector("#all").onclick = () => startPractice(d.icon + " " + d.name, smartPick(qs, settings.practiceSize));
    $app.querySelector("#every").onclick = () => startPractice(d.icon + " " + d.name + " (all)", shuffle(qs));
    $app.querySelectorAll("[data-obj]").forEach((el) => {
      el.onclick = () => { const o = el.dataset.obj; startPractice(o + " " + OBJECTIVES[o], smartPick(qsObj(o), settings.practiceSize)); };
    });
  };

  // ---------- Practice quiz (instant feedback) ----------
  function startPractice(title, qs, opts) {
    if (!qs.length) { toast("Nothing here yet. Nice work! 🎉"); return go("home"); }
    session = Object.assign({ type: "practice", title, items: qs.map(inst), i: 0, right: 0, combo: 0, xp: 0, timed: 0 }, opts || {});
    go("quiz");
  }
  VIEWS.quiz = function () {
    const s = session, it = s.items[s.i], n = s.items.length, answered = it.picked !== null;
    const ok = answered && it.picked === it.correct;
    $app.innerHTML = topbar(s.timed ? `<span class="chip timer" id="tmr">⏱ ${s.timed}s</span>` : "") + `
      <div class="qhead"><div><b>${esc(s.title)}</b></div>
        <div class="row small muted"><span>${s.i + 1} / ${n}</span><span>✅ ${s.right}</span>${s.combo >= 2 ? `<span class="chip gold">🔥 x${s.combo}</span>` : ""}</div></div>
      <div class="bar" style="margin-bottom:14px"><i style="width:${pct(s.i / n)}%"></i></div>
      <div class="card ${answered && !ok ? "shake" : ""}">
        <div class="row spread"><span class="tag">${it.q.o} · ${esc(it.q.t)}</span>
          <button class="btn sm ghost" id="readQ" title="Read question aloud (R)">🔊 Read</button></div>
        <div class="question">${esc(it.q.q)}</div>
        <div class="choices">${it.order.map((ci, i) => {
          let cls = "choice";
          if (answered) { if (i === it.correct) cls += " correct"; else if (i === it.picked) cls += " wrong"; }
          return `<button class="${cls}" data-i="${i}" ${answered ? "disabled" : ""}><span class="key">${LETTERS[i]}</span><span>${esc(it.q.a[ci])}</span></button>`;
        }).join("")}</div>
        ${answered ? `<div class="explain ${ok ? "" : "bad"}">
          <div class="row spread"><h3>${ok ? "✅ Correct!" : it.picked === -1 ? "⏰ Time's up!" : "❌ Not quite."} ${s.lastXP ? `<span class="xp-pop">+${s.lastXP} XP</span>` : ""}</h3>
            <button class="btn sm ghost" id="readE">🔊 Explain it to me</button></div>
          <p><b>Answer: ${LETTERS[it.correct]}. ${esc(it.q.a[it.q.c])}</b></p><p>${esc(it.q.e)}</p></div>` : ""}
      </div>
      <div class="footer-actions">
        <button class="btn ghost" data-go="home">✖ Quit</button>
        ${answered ? `<button class="btn primary" id="next">${s.i + 1 < n ? "Next →" : "See results 🏁"}</button>` : ""}
      </div>`;

    $app.querySelectorAll(".choice").forEach((b) => (b.onclick = () => answer(Number(b.dataset.i))));
    $app.querySelector("#readQ").onclick = () => TTS.say(questionSpeech(it));
    const re = $app.querySelector("#readE"); if (re) re.onclick = () => TTS.say(answerSpeech(it));
    const nx = $app.querySelector("#next"); if (nx) { nx.onclick = nextQ; nx.focus(); }

    if (!answered) {
      if (settings.autoRead !== "off") TTS.say(questionSpeech(it));
      if (s.timed) startQTimer();
    } else if (settings.autoRead === "all" && !s.spokeAnswer) {
      s.spokeAnswer = true; TTS.say(answerSpeech(it));
    }
  };
  function startQTimer() {
    let left = session.timed;
    clearInterval(timerId);
    timerId = setInterval(() => {
      left--;
      const el = document.getElementById("tmr");
      if (el) { el.textContent = "⏱ " + left + "s"; el.classList.toggle("low", left <= 5); }
      if (left <= 0) { clearInterval(timerId); answer(-1); }
    }, 1000);
  }
  function answer(i) {
    const s = session, it = s.items[s.i];
    if (it.picked !== null) return;
    clearInterval(timerId); TTS.stop();
    it.picked = i; s.spokeAnswer = false;
    const ok = i === it.correct;
    record(it.q.id, ok);
    let xp = 0;
    if (ok) {
      s.right++; s.combo++;
      xp = 10 + (s.combo >= 3 ? Math.min(s.combo, 10) : 0) + (s.timed ? 5 : 0);
      state.bestCombo = Math.max(state.bestCombo || 0, s.combo);
    } else { s.combo = 0; xp = 2; } // effort still counts
    s.xp += xp; s.lastXP = xp; addXP(xp);
    VIEWS.quiz();
  }
  function nextQ() {
    TTS.stop(); session.lastXP = 0;
    if (session.i + 1 < session.items.length) { session.i++; VIEWS.quiz(); }
    else go("results");
  }

  VIEWS.results = function () {
    const s = session, n = s.items.length, score = s.right / n;
    const missed = s.items.filter((it) => it.picked !== it.correct);
    $app.innerHTML = topbar() + `
      <div class="card hero" style="text-align:center">
        <div class="muted">${esc(s.title)}</div>
        <div class="score-ring ${score >= 0.8 ? "pass" : "fail"}">${pct(score)}%</div>
        <p>${s.right} of ${n} correct · <span class="xp-pop">+${s.xp} XP</span></p>
        <p class="muted">${score >= 0.9 ? "Outstanding. This topic is locking in! 🔒" : score >= 0.8 ? "Exam-ready pace. Keep it up! 💪" : score >= 0.6 ? "Getting there. Review the misses below. 📚" : "Tough set. Read the explanations, then try again. You've got this. 🙏🏾"}</p>
        <div class="row" style="justify-content:center">
          ${missed.length ? `<button class="btn gold" id="retry">Retry the ${missed.length} I missed</button>` : ""}
          ${s.node && nextNode() ? `<button class="btn primary" id="nextNode">${nextNode().key === s.node ? "Try this section again" : "Next: " + esc(nextNode().label)} →</button>` : ""}
          ${s.node ? `<button class="btn" data-go="course">Course Path</button>` : `<button class="btn primary" data-go="home">Back to missions</button>`}</div>
      </div>
      ${missed.length ? `<h2 style="margin-top:20px">Review your misses</h2>` + missed.map(reviewCard).join("") : ""}`;
    const rt = $app.querySelector("#retry");
    if (rt) rt.onclick = () => startPractice("Retry: " + s.title, shuffle(missed.map((x) => x.q)), { node: s.node });
    const nn = $app.querySelector("#nextNode"); if (nn) nn.onclick = () => startNode(nextNode());
    bindReviewReads(missed);
  };
  function reviewCard(it, idx) {
    return `<div class="card" style="margin-top:10px">
      <div class="row spread"><span class="tag">${it.q.o} · ${esc(it.q.t)}</span><button class="btn sm ghost" data-read="${idx}">🔊</button></div>
      <p style="margin-top:8px"><b>${esc(it.q.q)}</b></p>
      ${it.picked !== null && it.picked >= 0 && it.picked !== it.correct ? `<p class="small" style="color:var(--red)">Your answer: ${esc(it.q.a[it.order[it.picked]])}</p>` : it.picked === null || it.picked < 0 ? `<p class="small muted">Not answered</p>` : ""}
      <p class="small" style="color:var(--green)">Correct: ${esc(it.q.a[it.q.c])}</p>
      <p class="small muted">${esc(it.q.e)}</p></div>`;
  }
  function bindReviewReads(list) {
    $app.querySelectorAll("[data-read]").forEach((b) => (b.onclick = () => {
      const it = list[Number(b.dataset.read)]; TTS.say([it.q.q].concat(answerSpeech(it)));
    }));
  }

  // ---------- Weak spots / Lightning ----------
  VIEWS.weak = function () {
    const q = weakQueue(QBANK);
    if (!q.length) {
      const anySeen = Object.keys(state.q).length;
      $app.innerHTML = topbar() + `<div class="card hero" style="text-align:center"><div style="font-size:3rem">🎯</div>
        <h2>${anySeen ? "No weak spots due right now!" : "No weak spots yet"}</h2>
        <p class="muted">${anySeen ? "Questions you miss show up here. Mastered ones come back on a schedule (1, 2, 4, 7, then 15 days) so they stick." : "Play some practice rounds first. Every question you miss lands here for review."}</p>
        <button class="btn primary" data-go="home">Back to missions</button></div>`;
      return;
    }
    startPractice("🎯 Weak Spots", q.slice(0, 15));
  };
  VIEWS.lightning = function () { startPractice("⚡ Lightning Round", smartPick(secQs, 15), { timed: 20 }); };

  // ---------- Practice exam ----------
  VIEWS.examIntro = function () {
    $app.innerHTML = topbar() + `<button class="btn sm ghost" data-go="home">← Back</button>
      <div class="card hero" style="margin-top:12px">
        <h1>🐉 Boss Battle: Practice Exam</h1>
        <p>${EXAM.questions} questions · ${EXAM.minutes} minutes · domains weighted like ${esc(EXAM.name)}:</p>
        <ul class="small">${DOMAINS.filter((d) => d.weight).map((d) => `<li>${d.icon} ${d.id}.0 ${esc(d.name)}: ${pct(d.weight)}% (~${Math.round(d.weight * EXAM.questions)} questions)</li>`).join("")}</ul>
        <p class="muted small">Like the real exam, you won't see answers until you submit. You can flag questions and jump around. Your estimated score uses the 100–900 scale with ${EXAM.passScaled} to pass. It's a straight-line estimate: CompTIA's real scaling isn't published, so aim for 85%+ here to give yourself a cushion.</p>
        <div class="row"><button class="btn gold" id="go">Start the exam</button>
        <button class="btn" id="short">Quick 30-question version</button></div>
      </div>`;
    $app.querySelector("#go").onclick = () => startExam(EXAM.questions, EXAM.minutes);
    $app.querySelector("#short").onclick = () => startExam(30, 30);
  };
  function startExam(total, minutes) {
    let picks = [];
    const ds = DOMAINS.filter((d) => d.weight);
    ds.forEach((d) => { picks = picks.concat(smartPickExam(qsDomain(d.id), Math.round(d.weight * total))); });
    picks = shuffle(picks).slice(0, total);
    session = { type: "exam", title: "Practice Exam", items: picks.map(inst), i: 0, ends: Date.now() + minutes * 60000, minutes };
    go("exam");
  }
  function smartPickExam(pool, n) { return shuffle(pool).slice(0, n); }
  VIEWS.exam = function () {
    const s = session, it = s.items[s.i], n = s.items.length;
    const done = s.items.filter((x) => x.picked !== null).length;
    $app.innerHTML = topbar(`<span class="chip timer" id="etmr"></span>`) + `
      <div class="qhead"><b>🐉 Practice Exam</b><span class="small muted">Answered ${done} / ${n}</span></div>
      <div class="card">
        <div class="row spread"><span class="small muted">Question ${s.i + 1} of ${n}</span>
          <div class="row"><button class="btn sm ghost" id="readQ">🔊 Read</button>
          <button class="btn sm ${it.flagged ? "gold" : "ghost"}" id="flag">${it.flagged ? "🚩 Flagged" : "🏳️ Flag"}</button></div></div>
        <div class="question">${esc(it.q.q)}</div>
        <div class="choices">${it.order.map((ci, i) => `<button class="choice ${it.picked === i ? "selected" : ""}" data-i="${i}"><span class="key">${LETTERS[i]}</span><span>${esc(it.q.a[ci])}</span></button>`).join("")}</div>
      </div>
      <div class="footer-actions">
        <button class="btn" id="prev" ${s.i === 0 ? "disabled" : ""}>← Prev</button>
        <button class="btn gold" id="submit">Submit exam</button>
        <button class="btn primary" id="next" ${s.i + 1 >= n ? "disabled" : ""}>Next →</button>
      </div>
      <div class="card" style="margin-top:14px"><div class="small muted" style="margin-bottom:8px">Question navigator (🚩 = flagged)</div>
        <div class="navgrid">${s.items.map((x, i) => `<button data-j="${i}" class="${x.picked !== null ? "answered" : ""} ${x.flagged ? "flag" : ""} ${i === s.i ? "cur" : ""}">${i + 1}</button>`).join("")}</div></div>`;
    $app.querySelectorAll(".choice").forEach((b) => (b.onclick = () => { it.picked = Number(b.dataset.i); VIEWS.exam(); }));
    $app.querySelectorAll("[data-j]").forEach((b) => (b.onclick = () => { s.i = Number(b.dataset.j); TTS.stop(); VIEWS.exam(); }));
    $app.querySelector("#prev").onclick = () => { s.i--; TTS.stop(); VIEWS.exam(); };
    $app.querySelector("#next").onclick = () => { s.i++; TTS.stop(); VIEWS.exam(); };
    $app.querySelector("#flag").onclick = () => { it.flagged = !it.flagged; VIEWS.exam(); };
    $app.querySelector("#readQ").onclick = () => TTS.say(questionSpeech(it, s.i + 1));
    $app.querySelector("#submit").onclick = () => {
      const left = n - s.items.filter((x) => x.picked !== null).length;
      if (!confirmInline(left)) return;
      finishExam();
    };
    tickExam();
    if (!timerId) timerId = setInterval(tickExam, 1000);
  };
  // Inline two-step confirm (no browser dialogs).
  function confirmInline(unanswered) {
    const b = $app.querySelector("#submit");
    if (b.dataset.armed) return true;
    b.dataset.armed = "1";
    b.textContent = unanswered ? `Submit with ${unanswered} unanswered? Tap again` : "Tap again to submit";
    return false;
  }
  function tickExam() {
    if (!session || session.type !== "exam") return;
    const left = Math.max(0, session.ends - Date.now());
    const el = document.getElementById("etmr");
    if (el) {
      const m = Math.floor(left / 60000), sec = Math.floor((left % 60000) / 1000);
      el.textContent = "⏱ " + m + ":" + String(sec).padStart(2, "0");
      el.classList.toggle("low", left < 5 * 60000);
    }
    if (left <= 0) { toast("⏰ Time's up! Submitting your exam."); finishExam(); }
  }
  function finishExam() {
    clearInterval(timerId); timerId = null; TTS.stop();
    const s = session, n = s.items.length;
    let right = 0; const byD = {};
    s.items.forEach((it) => {
      const ok = it.picked === it.correct;
      if (it.picked !== null) record(it.q.id, ok);
      if (ok) right++;
      byD[it.q.d] = byD[it.q.d] || { r: 0, n: 0 }; byD[it.q.d].n++; if (ok) byD[it.q.d].r++;
    });
    const p = right / n, scaled = Math.round(100 + 800 * p);
    const xp = right * 8 + (scaled >= EXAM.passScaled ? 150 : 25);
    addXP(xp);
    state.exams.push({ date: new Date().toISOString(), n, right, scaled, byD });
    persist();
    session.result = { right, p, scaled, byD, xp };
    view = "examResults"; VIEWS.examResults();
  }
  VIEWS.examResults = function () {
    const s = session, r = s.result, pass = r.scaled >= EXAM.passScaled;
    const missed = s.items.filter((it) => it.picked !== it.correct);
    $app.innerHTML = topbar() + `
      <div class="card hero" style="text-align:center">
        <div class="muted">Estimated score</div>
        <div class="score-ring ${pass ? "pass" : "fail"}">${r.scaled}</div>
        <h2>${pass ? "🏆 PASS! The dragon is down!" : "Not yet. The dragon survives… for now."}</h2>
        <p>${r.right} / ${s.items.length} correct (${pct(r.p)}%) · <span class="xp-pop">+${r.xp} XP</span></p>
        <table style="max-width:520px;margin:10px auto"><tr><th>Domain</th><th>Score</th></tr>
          ${DOMAINS.filter((d) => r.byD[d.id]).map((d) => { const x = r.byD[d.id]; const v = x.r / x.n; return `<tr><td>${d.icon} ${d.id}.0 ${esc(d.name)}</td><td style="color:${v >= 0.8 ? "var(--green)" : v >= 0.65 ? "var(--gold)" : "var(--red)"}"><b>${pct(v)}%</b> (${x.r}/${x.n})</td></tr>`; }).join("")}
        </table>
        <div class="row" style="justify-content:center">
          ${missed.length ? `<button class="btn gold" id="retry">Drill the ${missed.length} I missed</button>` : ""}
          <button class="btn primary" data-go="home">Back to missions</button></div>
      </div>
      ${missed.length ? `<h2 style="margin-top:20px">Answer review</h2>` + missed.map(reviewCard).join("") : ""}`;
    const rt = $app.querySelector("#retry");
    if (rt) rt.onclick = () => startPractice("Exam misses", shuffle(missed.map((x) => x.q)));
    bindReviewReads(missed);
  };

  // ---------- Flashcards ----------
  VIEWS.flashSetup = function () { scopePicker("🃏 Flashcards", (qs, label) => { session = { type: "flash", title: label, items: shuffle(qs).map(inst), i: 0, flipped: false, known: 0 }; go("flash"); }); };
  VIEWS.flash = function () {
    const s = session, it = s.items[s.i], n = s.items.length;
    $app.innerHTML = topbar() + `
      <div class="qhead"><b>${esc(s.title)}</b><span class="small muted">${s.i + 1} / ${n} · knew ${s.known}</span></div>
      <div class="card flash" id="card" tabindex="0" aria-label="Flashcard. Press space to flip.">
        <span class="tag" style="align-self:center">${it.q.o} · ${esc(it.q.t)}</span>
        ${!s.flipped ? `<p class="big" style="margin-top:14px">${esc(it.q.q)}</p><p class="muted small">Think of your answer, then tap to flip</p>`
          : `<p class="big" style="color:var(--green);margin-top:14px">${esc(it.q.a[it.q.c])}</p><p class="small muted" style="max-width:640px;margin:0 auto">${esc(it.q.e)}</p>`}
      </div>
      <div class="footer-actions">
        <button class="btn ghost" data-go="home">✖ Quit</button>
        <button class="btn sm ghost" id="read">🔊 Read</button>
        ${s.flipped ? `<div class="row"><button class="btn" id="no">😕 Didn't know</button><button class="btn primary" id="yes">😎 Knew it</button></div>` : `<button class="btn primary" id="flip">Flip ↻</button>`}
      </div>`;
    const flip = () => { s.flipped = true; VIEWS.flash(); if (settings.autoRead === "all") TTS.say(answerSpeech(it)); };
    $app.querySelector("#card").onclick = () => { if (!s.flipped) flip(); };
    const f = $app.querySelector("#flip"); if (f) f.onclick = flip;
    $app.querySelector("#read").onclick = () => TTS.say(s.flipped ? answerSpeech(it) : [it.q.q]);
    const rate = (ok) => {
      record(it.q.id, ok); addXP(ok ? 5 : 1); if (ok) s.known++;
      s.flipped = false; TTS.stop();
      if (s.i + 1 < n) { s.i++; VIEWS.flash(); } else { toast(`Deck done! You knew ${s.known} of ${n}.`); go("home"); }
    };
    const y = $app.querySelector("#yes"); if (y) y.onclick = () => rate(true);
    const no = $app.querySelector("#no"); if (no) no.onclick = () => rate(false);
    if (!s.flipped && settings.autoRead !== "off") TTS.say([it.q.q]);
  };

  // Shared scope picker (domain/objective/weak)
  function scopePicker(title, onStart) {
    const opts = [["all", "All Security+ domains", secQs]]
      .concat(DOMAINS.map((d) => ["d" + d.id, d.icon + " " + (d.bonus ? "" : d.id + ".0 ") + d.name, qsDomain(d.id)]))
      .concat(Object.keys(OBJECTIVES).map((o) => ["o" + o, "  " + o + " " + OBJECTIVES[o], qsObj(o)]))
      .concat([["weak", "🎯 My weak spots", weakQueue(QBANK)]])
      .filter((x) => x[2].length);
    $app.innerHTML = topbar() + `<button class="btn sm ghost" data-go="home">← Back</button>
      <div class="card" style="margin-top:12px"><h1>${title}</h1>
        <label class="field">What do you want to study?
          <select id="scope">${opts.map((o) => `<option value="${o[0]}">${esc(o[1])} (${o[2].length})</option>`).join("")}</select></label>
        <div id="extra"></div>
        <button class="btn primary" id="start">Start ▶</button></div>`;
    const extra = $app.querySelector("#extra");
    if (onStart.extra) extra.innerHTML = onStart.extra;
    $app.querySelector("#start").onclick = () => {
      const o = opts.find((x) => x[0] === $app.querySelector("#scope").value);
      onStart(o[2], o[1].trim());
    };
  }

  // ---------- Audio (hands-free) mode ----------
  const audioStart = function (qs, label) {
    const pause = Number(($app.querySelector("#pause") || {}).value || settings.audioPause);
    settings.audioPause = pause; save(SETTINGS_KEY, settings);
    session = { type: "audio", title: label, items: shuffle(qs).map(inst), i: 0, playing: true, phase: "q" };
    go("audio");
  };
  audioStart.extra = `<label class="field">Thinking time before the answer: <b><span id="pv">${settings.audioPause}</span> seconds</b>
    <input type="range" id="pause" min="2" max="20" value="${settings.audioPause}" oninput="document.getElementById('pv').textContent=this.value"></label>
    <p class="small muted">Hands-free mode reads the question and the choices, waits, then reads the correct answer and the explanation. Great for the car, the gym, or chores. Keep this tab open.</p>`;
  VIEWS.audioSetup = function () { scopePicker("🎧 Audio Study", audioStart); };
  VIEWS.audio = function () {
    const s = session, it = s.items[s.i], n = s.items.length;
    $app.innerHTML = topbar() + `
      <div class="qhead"><b>🎧 ${esc(s.title)}</b><span class="small muted">${s.i + 1} / ${n}</span></div>
      <div class="card">
        <span class="tag">${it.q.o} · ${esc(it.q.t)}</span>
        <div class="question">${esc(it.q.q)}</div>
        <div class="choices">${it.order.map((ci, i) => `<div class="choice ${s.phase === "a" && i === it.correct ? "correct" : ""}"><span class="key">${LETTERS[i]}</span><span>${esc(it.q.a[ci])}</span></div>`).join("")}</div>
        ${s.phase === "a" ? `<div class="explain"><p><b>Answer: ${LETTERS[it.correct]}</b></p><p>${esc(it.q.e)}</p></div>` : `<p class="muted small" style="margin-top:12px" id="think"></p>`}
      </div>
      <div class="footer-actions">
        <button class="btn ghost" data-go="home">✖ Stop</button>
        <div class="row"><button class="btn" id="prev" ${s.i === 0 ? "disabled" : ""}>⏮</button>
        <button class="btn primary" id="pp">${s.playing ? "⏸ Pause" : "▶ Play"}</button>
        <button class="btn" id="nxt">⏭</button></div>
      </div>`;
    $app.querySelector("#pp").onclick = () => { s.playing = !s.playing; if (!s.playing) TTS.stop(); VIEWS.audio(); };
    $app.querySelector("#nxt").onclick = () => audioMove(1);
    $app.querySelector("#prev").onclick = () => audioMove(-1);
    if (s.playing) runAudio();
  };
  function audioMove(d) {
    TTS.stop(); clearTimeout(session.wait);
    session.i = Math.max(0, Math.min(session.items.length - 1, session.i + d));
    session.phase = "q"; VIEWS.audio();
  }
  async function runAudio() {
    const s = session, idx = s.i, it = s.items[idx];
    const alive = () => view === "audio" && session === s && s.i === idx && s.playing;
    if (s.phase === "q") {
      const finished = await TTS.say(questionSpeech(it, idx + 1));
      if (!finished || !alive()) return;
      let left = settings.audioPause;
      await new Promise((res) => {
        const tick = () => {
          const el = document.getElementById("think");
          if (el) el.textContent = "🤔 Thinking time… " + left + "s";
          if (left-- <= 0 || !alive()) return res();
          s.wait = setTimeout(tick, 1000);
        };
        tick();
      });
      if (!alive()) return;
      s.phase = "a"; VIEWS.audio(); return;
    }
    const finished = await TTS.say(answerSpeech(it));
    if (!finished || !alive()) return;
    addXP(3);
    await new Promise((r) => (s.wait = setTimeout(r, 1200)));
    if (!alive()) return;
    if (s.i + 1 < s.items.length) { s.i++; s.phase = "q"; VIEWS.audio(); }
    else { TTS.say(["That's the end of this set. Great studying!"]); s.playing = false; VIEWS.audio(); }
  }

  // ---------- Stats ----------
  VIEWS.stats = function () {
    const seen = Object.keys(state.q).length;
    const acc = accuracy(QBANK);
    const objRows = Object.keys(OBJECTIVES).map((o) => ({ o, m: mastery(qsObj(o)), a: accuracy(qsObj(o)), n: qsObj(o).length }));
    const focus = objRows.filter((x) => !x.o.startsWith("N")).sort((a, b) => a.m - b.m).slice(0, 5);
    $app.innerHTML = topbar() + `<button class="btn sm ghost" data-go="home">← Back</button>
      <h1 style="margin-top:12px">📊 My Stats</h1>
      <div class="grid grid-3">
        <div class="card"><div class="muted small">Questions seen</div><h2>${seen} / ${QBANK.length}</h2></div>
        <div class="card"><div class="muted small">Overall accuracy</div><h2>${acc === null ? "—" : pct(acc) + "%"}</h2></div>
        <div class="card"><div class="muted small">Readiness</div><h2>${pct(readiness())}%</h2></div>
        <div class="card"><div class="muted small">Best combo</div><h2>🔥 ${state.bestCombo || 0}</h2></div>
      </div>
      <h2 style="margin-top:20px">Focus next</h2>
      <div class="grid">${focus.map((x) => `<div class="card click" data-o="${x.o}" tabindex="0"><span class="tag">${x.o}</span> ${esc(OBJECTIVES[x.o])} <span class="small muted">· ${pct(x.m)}% mastered</span></div>`).join("")}</div>
      <h2 style="margin-top:20px">Practice exam history</h2>
      ${state.exams.length ? `<table><tr><th>Date</th><th>Score</th><th>Result</th></tr>${state.exams.slice().reverse().map((e) => `<tr><td>${new Date(e.date).toLocaleDateString()}</td><td>${e.scaled} (${e.right}/${e.n})</td><td>${e.scaled >= EXAM.passScaled ? "✅ Pass" : "❌"}</td></tr>`).join("")}</table>` : `<p class="muted">No practice exams yet. Take on the 🐉 Boss Battle when you're ready.</p>`}
      <h2 style="margin-top:20px">Mastery by objective</h2>
      <table><tr><th>Objective</th><th class="hide-sm">Questions</th><th>Accuracy</th><th>Mastery</th></tr>
      ${objRows.map((x) => `<tr><td><span class="tag">${x.o}</span> <span class="small">${esc(OBJECTIVES[x.o])}</span></td><td class="hide-sm">${x.n}</td><td>${x.a === null ? "—" : pct(x.a) + "%"}</td><td style="min-width:90px"><div class="bar"><i style="width:${pct(x.m)}%"></i></div></td></tr>`).join("")}</table>`;
    $app.querySelectorAll("[data-o]").forEach((el) => (el.onclick = () => { const o = el.dataset.o; startPractice(o + " " + OBJECTIVES[o], smartPick(qsObj(o), settings.practiceSize)); }));
  };

  // ---------- Settings ----------
  VIEWS.settings = function () {
    const voices = browserVoices();
    const elVoices = Array.isArray(settings.elVoices) && settings.elVoices.length ? settings.elVoices : [{ id: TTS.DEFAULT_VOICE, name: "Will: Relaxed Optimist" }];
    if (!elVoices.some((v) => v.id === settings.elVoice)) elVoices.unshift({ id: settings.elVoice, name: "Custom voice (" + settings.elVoice + ")" });
    $app.innerHTML = topbar() + `<button class="btn sm ghost" data-go="home">← Back</button>
      <h1 style="margin-top:12px">⚙️ Settings</h1>
      <div class="card"><h2>🔊 Voice</h2>
        <div id="elStatus" class="explain" style="margin:0 0 14px"></div>
        <label class="field">Voice engine
          <select id="engine"><option value="browser">Built-in device voice (free)</option><option value="eleven">ElevenLabs (natural voice, uses your API key)</option></select></label>
        <label class="field">Read aloud automatically
          <select id="autoRead"><option value="off">Off (tap 🔊 when you want it)</option><option value="q">Read each question</option><option value="all">Read questions and explanations</option></select></label>
        <label class="field">Speaking speed: <b><span id="rv">${settings.rate}</span>x</b>
          <input type="range" id="rate" min="0.6" max="1.6" step="0.1" value="${settings.rate}"></label>
        <label class="field">Built-in voice
          <select id="bv">${browserVoiceOptions(voices)}</select></label>
        <hr><h3>ElevenLabs</h3>
        <p class="small muted">On elevenlabs.io go to <b>Developers → API Keys → Create Key</b>. Give it <b>Text to Speech: Access</b> and <b>Voices: Read</b>, then copy the key that starts with <span class="mono">sk_</span>. It's only shown once, and it's <i>not</i> the "Key ID". Paste it below. It's saved <b>only in this browser</b> and sent only to ElevenLabs. Audio is cached after the first play, so replays don't use credits.</p>
        <label class="field">API key
          <div class="row" style="flex-wrap:nowrap"><input type="password" id="elKey" value="${esc(settings.elKey)}" placeholder="sk_..." autocomplete="off" spellcheck="false">
          <button class="btn sm ghost" id="showKey" type="button">Show</button></div></label>
        <label class="field">Voice
          <select id="elVoice">${elVoices.map((v) => `<option value="${esc(v.id)}" ${v.id === settings.elVoice ? "selected" : ""}>${esc(v.name)}</option>`).join("")}</select></label>
        <div class="row"><button class="btn sm" id="loadVoices">↻ Load my ElevenLabs voices</button>
          <select id="elModel" style="width:auto"><option value="eleven_flash_v2_5">Flash v2.5 (fast, cheaper)</option><option value="eleven_multilingual_v2">Multilingual v2 (richest quality)</option><option value="eleven_turbo_v2_5">Turbo v2.5</option></select></div>
        <details style="margin-top:10px"><summary class="small muted">Advanced: use a voice ID</summary>
          <label class="field" style="margin-top:8px">Voice ID (from ElevenLabs → Voices → ⋯ → Copy voice ID)
            <div class="row" style="flex-wrap:nowrap"><input type="text" id="voiceId" placeholder="e.g. bIHbv24MWmeRgasZH58o" spellcheck="false"><button class="btn sm" id="useVoiceId" type="button">Use</button></div></label></details>
        <div class="row" style="margin-top:12px"><button class="btn primary" id="test">▶ Test voice</button><button class="btn sm ghost" id="clr">Clear audio cache</button></div>
      </div>
      <div class="card" style="margin-top:14px"><h2>🎯 Study</h2>
        <label class="field">Daily goal (questions) <input type="number" id="goal" min="5" max="300" value="${settings.dailyGoal}"></label>
        <label class="field">Questions per practice round <input type="number" id="psize" min="5" max="50" value="${settings.practiceSize}"></label>
      </div>
      <div class="card" style="margin-top:14px"><h2>💾 Progress</h2>
        <p class="small muted">Progress and settings live in this browser. Export to move progress to another device.</p>
        <div class="row"><button class="btn sm" id="exp">Export progress</button>
        <label class="btn sm">Import progress<input type="file" id="imp" accept="application/json" hidden></label>
        <button class="btn sm ghost" id="reset" style="color:var(--red)">Reset all progress</button></div>
      </div>
      <p class="small muted" style="margin-top:16px">${QBANK.length} questions loaded · v${APP_VERSION} · SecPlus Quest is an independent study tool, not affiliated with CompTIA.</p>`;
    const $ = (id) => $app.querySelector("#" + id);
    $("engine").value = settings.engine; $("autoRead").value = settings.autoRead; $("elModel").value = settings.elModel;
    const saveS = () => save(SETTINGS_KEY, settings);

    // Status line: always tells you exactly what the voice will do and why.
    function renderStatus(extra) {
      const box = $("elStatus"); if (!box) return;
      const prob = settings.elKey ? TTS.keyProblem(settings.elKey) : "";
      const vName = (($("elVoice").selectedOptions[0] || {}).textContent || "").trim();
      let html, bad = false;
      if (extra) { html = extra.html; bad = extra.bad; }
      else if (settings.elKey && prob) { html = "⚠️ " + esc(prob); bad = true; }
      else if (settings.engine !== "eleven") html = settings.elKey && !prob ? "🔈 Using your <b>device voice</b>. Your ElevenLabs key is saved; switch <b>Voice engine</b> to ElevenLabs to use it." : "🔈 Using your <b>device voice</b> (free). Add an ElevenLabs key below for a natural voice.";
      else if (!settings.elKey) { html = "⚠️ ElevenLabs is selected, but there's no API key yet. Paste it below. Until then, your device voice is used."; bad = true; }
      else if (prob) { html = "⚠️ " + esc(prob); bad = true; }
      else html = `✅ <b>ElevenLabs</b> is on · Voice: <b>${esc(vName)}</b> · Key ending <span class="mono">…${esc(settings.elKey.slice(-4))}</span>. Tap <b>▶ Test voice</b> to confirm.`;
      box.className = "explain" + (bad ? " bad" : ""); box.innerHTML = `<div class="small">${html}</div>`;
    }

    async function loadVoices(quiet) {
      const prob = TTS.keyProblem(settings.elKey);
      if (prob) { renderStatus({ html: "⚠️ " + esc(prob), bad: true }); return; }
      $("loadVoices").disabled = true; $("loadVoices").textContent = "Loading…";
      try {
        const vs = (await TTS.listElevenVoices(settings.elKey)).sort((a, b) => a.name.localeCompare(b.name));
        settings.elVoices = vs; saveS();
        if (!vs.some((v) => v.id === settings.elVoice)) vs.unshift({ id: settings.elVoice, name: "Current voice (" + settings.elVoice + ")" });
        $("elVoice").innerHTML = vs.map((v) => `<option value="${esc(v.id)}" ${v.id === settings.elVoice ? "selected" : ""}>${esc(v.name)}</option>`).join("");
        renderStatus();
        if (!quiet) toast("Loaded " + settings.elVoices.length + " ElevenLabs voices ✅");
      } catch (err) {
        renderStatus({ html: "⚠️ Couldn't load voices: " + esc(err.message), bad: true });
      } finally { $("loadVoices").disabled = false; $("loadVoices").textContent = "↻ Load my ElevenLabs voices"; }
    }

    $("engine").onchange = (e) => { settings.engine = e.target.value; saveS(); renderStatus(); };
    $("autoRead").onchange = (e) => { settings.autoRead = e.target.value; saveS(); };
    $("rate").oninput = (e) => { settings.rate = Number(e.target.value); $("rv").textContent = settings.rate; saveS(); };
    $("bv").onchange = (e) => { settings.browserVoice = e.target.value; saveS(); };
    // Save the key on every keystroke/paste (not only on blur), and switch to ElevenLabs automatically.
    let keyTimer = null;
    $("elKey").oninput = (e) => {
      const before = settings.elKey;
      settings.elKey = e.target.value.trim(); saveS();
      clearTimeout(keyTimer);
      keyTimer = setTimeout(() => {
        const prob = settings.elKey ? TTS.keyProblem(settings.elKey) : "";
        if (settings.elKey && !prob && settings.elKey !== before) {
          settings.engine = "eleven"; $("engine").value = "eleven"; saveS();
          TTS.clearCache().catch(() => {});
          loadVoices(true);
        }
        renderStatus();
      }, 350);
    };
    $("showKey").onclick = () => { const i = $("elKey"); const show = i.type === "password"; i.type = show ? "text" : "password"; $("showKey").textContent = show ? "Hide" : "Show"; };
    $("elVoice").onchange = (e) => { settings.elVoice = e.target.value; settings.pickedVoice = true; saveS(); renderStatus(); };
    $("useVoiceId").onclick = () => {
      const id = $("voiceId").value.trim();
      if (!/^[A-Za-z0-9]{10,40}$/.test(id)) { toast("That doesn't look like an ElevenLabs voice ID."); return; }
      settings.elVoice = id; settings.pickedVoice = true; saveS();
      if (![...$("elVoice").options].some((o) => o.value === id)) $("elVoice").insertAdjacentHTML("afterbegin", `<option value="${esc(id)}">Custom voice (${esc(id)})</option>`);
      $("elVoice").value = id; renderStatus(); toast("Voice set ✅ Tap ▶ Test voice");
    };
    $("elModel").onchange = (e) => { settings.elModel = e.target.value; saveS(); };
    $("goal").onchange = (e) => { settings.dailyGoal = Math.max(5, Number(e.target.value) || 30); saveS(); };
    $("psize").onchange = (e) => { settings.practiceSize = Math.min(50, Math.max(5, Number(e.target.value) || 10)); saveS(); };
    $("loadVoices").onclick = () => loadVoices(false);
    $("test").onclick = async () => {
      const line = "Welcome to SecPlus Quest. The CIA triad stands for confidentiality, integrity, and availability. Let's go pass Security Plus!";
      if (settings.engine !== "eleven") { renderStatus(); TTS.say([line]); return; }
      $("test").disabled = true; $("test").textContent = "⏳ Generating…";
      const r = await TTS.testEleven(line);
      $("test").disabled = false; $("test").textContent = "▶ Test voice";
      if (r.ok) renderStatus({ html: `✅ <b>ElevenLabs is working!</b> That was <b>${esc((($("elVoice").selectedOptions[0] || {}).textContent || "").trim())}</b>. You're all set.` });
      else renderStatus({ html: "⚠️ " + esc(r.message), bad: true });
    };
    renderStatus();
    $("clr").onclick = async () => { await TTS.clearCache(); toast("Audio cache cleared"); };
    $("exp").onclick = () => {
      const blob = new Blob([JSON.stringify(state)], { type: "application/json" });
      const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "secplus-quest-progress.json"; a.click();
    };
    $("imp").onchange = (e) => {
      const f = e.target.files[0]; if (!f) return;
      f.text().then((t) => { const j = JSON.parse(t); if (!j.q) throw new Error(); state = Object.assign(defaultState(), j); persist(); toast("Progress imported ✅"); go("home"); })
        .catch(() => toast("That file doesn't look like SecPlus Quest progress."));
    };
    $("reset").onclick = (e) => {
      if (!e.target.dataset.armed) { e.target.dataset.armed = "1"; e.target.textContent = "Tap again to erase everything"; return; }
      state = defaultState(); persist(); toast("Progress reset"); go("home");
    };
  };
  function browserVoices() { return ("speechSynthesis" in window ? speechSynthesis.getVoices() : []).filter((v) => /^en/i.test(v.lang)); }
  function browserVoiceOptions(voices) {
    return `<option value="">Default</option>` + voices.map((v) => `<option ${v.name === settings.browserVoice ? "selected" : ""}>${esc(v.name)}</option>`).join("");
  }
  if ("speechSynthesis" in window) speechSynthesis.onvoiceschanged = () => {
    const sel = view === "settings" && document.getElementById("bv");
    if (sel) sel.innerHTML = browserVoiceOptions(browserVoices());
  };

  // ---------- Keyboard ----------
  document.addEventListener("keydown", (e) => {
    if (e.target.matches("input,select,textarea") || e.metaKey || e.ctrlKey || e.altKey) return;
    const k = e.key.toLowerCase();
    if (view === "quiz") {
      const it = session.items[session.i];
      if (/^[1-6]$/.test(k) && it.picked === null && Number(k) <= it.order.length) answer(Number(k) - 1);
      else if (k === "enter" && it.picked !== null) { e.preventDefault(); nextQ(); }
      else if (k === "r") TTS.say(it.picked === null ? questionSpeech(it) : answerSpeech(it));
    } else if (view === "exam") {
      const it = session.items[session.i];
      if (/^[1-6]$/.test(k) && Number(k) <= it.order.length) { it.picked = Number(k) - 1; VIEWS.exam(); }
      else if (k === "arrowright" && session.i + 1 < session.items.length) { session.i++; VIEWS.exam(); }
      else if (k === "arrowleft" && session.i > 0) { session.i--; VIEWS.exam(); }
      else if (k === "f") { it.flagged = !it.flagged; VIEWS.exam(); }
    } else if (view === "flash" && (k === " " || k === "enter") && !session.flipped) { e.preventDefault(); session.flipped = true; VIEWS.flash(); }
  });

  window.App = { settings: () => settings, toast, go };
  go("home");
})();
