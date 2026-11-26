// Validates the question bank: run with `node tools/validate.js`
const fs = require("fs"), path = require("path"), vm = require("vm");
const root = path.join(__dirname, "..");
const ctx = { window: {} }; ctx.window.window = ctx.window; vm.createContext(ctx.window);
for (const f of ["js/meta.js", "data/d1.js", "data/d2.js", "data/d3.js", "data/d4.js", "data/d5.js", "data/net.js", "data/m1.js", "data/m2.js", "data/m3.js", "data/m4.js", "data/m5.js", "data/cs.js"])
  vm.runInContext(fs.readFileSync(path.join(root, f), "utf8"), ctx.window, { filename: f });
const { QBANK, OBJECTIVES, DOMAINS } = ctx.window;
let errors = 0; const ids = new Set(), texts = new Set(); const byObj = {}, byDom = {};
const err = (m) => { errors++; console.error("✗ " + m); };
for (const q of QBANK) {
  if (ids.has(q.id)) err("duplicate id " + q.id + ": " + q.q); ids.add(q.id);
  if (texts.has(q.q.toLowerCase())) err("duplicate question: " + q.q); texts.add(q.q.toLowerCase());
  if (!OBJECTIVES[q.o]) err("unknown objective " + q.o);
  if (!Array.isArray(q.a) || q.a.length !== 4) err(q.id + " must have 4 choices");
  if (new Set(q.a.map((x) => x.toLowerCase())).size !== q.a.length) err(q.id + " has duplicate choices");
  if (!(q.c >= 0 && q.c < q.a.length)) err(q.id + " bad correct index");
  if (!q.e || q.e.length < 40) err(q.id + " explanation too short");
  byObj[q.o] = (byObj[q.o] || 0) + 1; byDom[q.d] = (byDom[q.d] || 0) + 1;
}
for (const o of Object.keys(OBJECTIVES)) if (!byObj[o]) err("objective " + o + " has no questions");
console.log("Questions:", QBANK.length, "| course sections:", ctx.window.SECTIONS.length);
for (const d of DOMAINS) console.log(`  ${d.icon} ${d.name}: ${byDom[d.id] || 0}`);
console.log(errors ? `\n${errors} problem(s) found` : "\n✓ Question bank is valid");
process.exit(errors ? 1 : 0);
