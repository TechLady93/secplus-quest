/* SecPlus Quest — PBQ engine: renders and grades performance-based questions.
 * Works with touch, mouse and keyboard (dropdowns, checkboxes, ↑/↓ buttons, no drag needed). */
window.PBQ_UI = (function () {
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const okVal = (ans, v) => (Array.isArray(ans) ? ans.includes(v) : ans === v);

  // Fresh attempt state: shuffled option orders + empty answers.
  function newAttempt(p) {
    const st = { answers: {}, opts: {}, submitted: false };
    p.tasks.forEach((t, i) => {
      if (t.t === "select" || t.t === "multi") st.opts[i] = shuffle(t.options);
      if (t.t === "order") { let o = shuffle(t.items); if (o.join("|") === t.items.join("|")) o = o.slice(1).concat(o[0]); st.answers[i] = o; }
      if (t.t === "multi") st.answers[i] = [];
      if (t.t === "row") st.answers[i] = {};
    });
    return st;
  }

  function grade(p, st) {
    let earned = 0, total = 0;
    const per = p.tasks.map((t, i) => {
      const a = st.answers[i];
      if (t.t === "select") { total++; const ok = okVal(t.answer, a); if (ok) earned++; return { ok, pts: ok ? 1 : 0, max: 1 }; }
      if (t.t === "row") { let e = 0; const f = t.fields.map((fd) => { const ok = okVal(fd.answer, (a || {})[fd.name]); if (ok) e++; return ok; }); total += t.fields.length; earned += e; return { ok: e === t.fields.length, fields: f, pts: e, max: t.fields.length }; }
      if (t.t === "order") { const pos = (a || []).map((x, k) => x === t.items[k]); const e = pos.filter(Boolean).length; total += t.items.length; earned += e; return { ok: e === t.items.length, pos, pts: e, max: t.items.length }; }
      if (t.t === "multi") { const sel = a || []; const right = sel.filter((x) => t.answers.includes(x)).length; const wrong = sel.length - right; const e = Math.max(0, right - wrong); total += t.answers.length; earned += e; return { ok: right === t.answers.length && wrong === 0, pts: e, max: t.answers.length }; }
      return { ok: false, pts: 0, max: 0 };
    });
    return { earned, total, pct: total ? earned / total : 0, per };
  }

  function complete(p, st) {
    return p.tasks.every((t, i) => {
      const a = st.answers[i];
      if (t.t === "select") return !!a;
      if (t.t === "row") return t.fields.every((fd) => (a || {})[fd.name]);
      if (t.t === "multi") return (a || []).length === t.answers.length;
      return true;
    });
  }

  function exhibitHtml(x) {
    if (!x) return "";
    if (x.kind === "log") return `<pre class="exhibit">${x.lines.map(esc).join("\n")}</pre>`;
    if (x.kind === "text") return `<pre class="exhibit">${esc(x.text)}</pre>`;
    if (x.kind === "table") return `<div class="exhibit" style="overflow:auto"><table><tr>${x.head.map((h) => `<th>${esc(h)}</th>`).join("")}</tr>${x.rows.map((r) => `<tr>${r.map((c) => `<td>${esc(c)}</td>`).join("")}</tr>`).join("")}</table></div>`;
    return "";
  }

  // mode: "practice" (shows feedback after submit) or "exam" (no feedback until the exam is graded)
  function render(el, p, st, opts) {
    opts = opts || {};
    const show = st.submitted && opts.mode !== "exam-live";
    const g = show ? grade(p, st) : null;
    const sel = (name, options, value, ok, i, f) => `<select class="pbq-sel ${show ? (ok ? "ok" : "no") : ""}" data-i="${i}" ${f ? `data-f="${esc(f)}"` : ""} ${show ? "disabled" : ""} aria-label="${esc(name)}">
        <option value="">— ${esc(name)} —</option>${options.map((o) => `<option ${o === value ? "selected" : ""}>${esc(o)}</option>`).join("")}</select>`;
    el.innerHTML = `
      <div class="row spread"><span class="tag">PBQ · ${esc(p.kind)} · ${esc(p.o)}</span>${opts.readBtn ? `<button class="btn sm ghost" data-pbq-read>🔊 Read</button>` : ""}</div>
      <h2 style="margin:10px 0 6px">${esc(p.title)}</h2>
      <p>${esc(p.scenario)}</p>
      ${exhibitHtml(p.exhibit)}
      <div class="pbq-tasks">${p.tasks.map((t, i) => {
        const a = st.answers[i], r = g && g.per[i];
        let body = "";
        if (t.t === "select") body = sel("choose", st.opts[i] || t.options, a, r && r.ok, i);
        if (t.t === "row") body = `<div class="pbq-row">${t.fields.map((fd, k) => `<label class="small muted">${esc(fd.name)}${sel(fd.name, fd.options, (a || {})[fd.name], r && r.fields[k], i, fd.name)}</label>`).join("")}</div>`;
        if (t.t === "multi") body = `<div class="pbq-multi">${(st.opts[i] || t.options).map((o) => {
            const on = (a || []).includes(o), cls = show ? (t.answers.includes(o) ? "ok" : on ? "no" : "") : on ? "on" : "";
            return `<label class="pbq-check ${cls}"><input type="checkbox" data-i="${i}" value="${esc(o)}" ${on ? "checked" : ""} ${show ? "disabled" : ""}> ${esc(o)}</label>`; }).join("")}</div>`;
        if (t.t === "order") body = `<ol class="pbq-order">${(a || []).map((x, k) => `<li class="${show ? (r.pos[k] ? "ok" : "no") : ""}"><span>${esc(x)}</span>${show ? "" : `<span class="row" style="gap:4px"><button class="btn sm ghost" data-up="${i}:${k}" ${k === 0 ? "disabled" : ""} aria-label="Move up">↑</button><button class="btn sm ghost" data-down="${i}:${k}" ${k === a.length - 1 ? "disabled" : ""} aria-label="Move down">↓</button></span>`}</li>`).join("")}</ol>`;
        let fb = "";
        if (show) {
          const correct = t.t === "select" ? (Array.isArray(t.answer) ? t.answer.join(" / ") : t.answer)
            : t.t === "row" ? t.fields.map((fd) => fd.name + ": " + (Array.isArray(fd.answer) ? fd.answer.join(" or ") : fd.answer)).join(" · ")
            : t.t === "multi" ? t.answers.join(" + ") : t.items.map((x, k) => (k + 1) + ". " + x).join("  ");
          fb = `<div class="small" style="margin-top:6px">${r.ok ? "✅" : "❌"} <b>${esc(correct)}</b>${t.why ? `<div class="muted">${esc(t.why)}</div>` : ""}</div>`;
        }
        return `<div class="pbq-task ${show ? (r.ok ? "ok" : "no") : ""}"><div class="pbq-label">${esc(t.label)}</div>${body}${fb}</div>`;
      }).join("")}</div>
      ${show ? `<div class="explain ${g.pct >= 0.8 ? "" : "bad"}"><b>Score: ${g.earned}/${g.total} (${Math.round(g.pct * 100)}%)</b> ${g.pct === 1 ? "Perfect!" : g.pct >= 0.8 ? "Exam-ready." : "Review the ❌ parts above."}</div>` : ""}`;

    // wiring
    el.querySelectorAll("select.pbq-sel").forEach((s) => (s.onchange = () => {
      const i = Number(s.dataset.i), f = s.dataset.f;
      if (f) { st.answers[i] = st.answers[i] || {}; st.answers[i][f] = s.value; } else st.answers[i] = s.value;
      if (opts.onChange) opts.onChange();
    }));
    el.querySelectorAll('input[type=checkbox]').forEach((c) => (c.onchange = () => {
      const i = Number(c.dataset.i), t = p.tasks[i];
      let a = st.answers[i] || [];
      a = c.checked ? a.concat(c.value) : a.filter((x) => x !== c.value);
      if (a.length > t.answers.length) { a = a.slice(1); }
      st.answers[i] = a; render(el, p, st, opts); if (opts.onChange) opts.onChange();
    }));
    const move = (spec, d) => { const [i, k] = spec.split(":").map(Number); const a = st.answers[i]; const j = k + d; if (j < 0 || j >= a.length) return; [a[k], a[j]] = [a[j], a[k]]; render(el, p, st, opts); if (opts.onChange) opts.onChange(); };
    el.querySelectorAll("[data-up]").forEach((b) => (b.onclick = () => move(b.dataset.up, -1)));
    el.querySelectorAll("[data-down]").forEach((b) => (b.onclick = () => move(b.dataset.down, 1)));
    const rb = el.querySelector("[data-pbq-read]");
    if (rb && window.TTS) rb.onclick = () => TTS.say([p.title + ". " + p.scenario].concat(p.tasks.map((t) => t.label)));
  }

  return { newAttempt, grade, complete, render };
})();
