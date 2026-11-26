// Validates PBQ data: answers exist in options, perfect answers score 100%, ids unique.
const fs=require("fs"),vm=require("vm"),path=require("path");const w={};w.window=w;vm.createContext(w);
const root=path.join(__dirname,"..");
for(const f of ["js/meta.js","data/pbq.js","js/pbq.js"])vm.runInContext(fs.readFileSync(path.join(root,f),"utf8"),w);
let bad=0;const ids=new Set();const P=w.PBQS;
for(const p of P){ if(ids.has(p.id)){console.log("dup",p.id);bad++} ids.add(p.id);
 if(!w.OBJECTIVES[p.o]){console.log("bad objective",p.id,p.o);bad++}
 const st={answers:{},opts:{},submitted:true};
 p.tasks.forEach((t,i)=>{
  const chk=(ans,opts,lbl)=>{for(const a of [].concat(ans)) if(!opts.includes(a)){console.log("answer not in options",p.id,lbl,a);bad++}};
  if(t.t==="select"){chk(t.answer,t.options,t.label);st.answers[i]=[].concat(t.answer)[0]}
  else if(t.t==="row"){st.answers[i]={};t.fields.forEach(fd=>{chk(fd.answer,fd.options,fd.name);st.answers[i][fd.name]=[].concat(fd.answer)[0]})}
  else if(t.t==="multi"){chk(t.answers,t.options,t.label);st.answers[i]=t.answers.slice()}
  else if(t.t==="order"){if(new Set(t.items).size!==t.items.length){console.log("dup order item",p.id);bad++} st.answers[i]=t.items.slice()}
  else {console.log("unknown type",p.id,t.t);bad++}
 });
 const g=w.PBQ_UI.grade(p,st); if(g.pct!==1){console.log("perfect answers not 100%",p.id);bad++}
}
const types={};P.forEach(p=>p.tasks.forEach(t=>types[t.t]=(types[t.t]||0)+1));
console.log(P.length+" PBQs; task types "+JSON.stringify(types));
if(bad){console.log("✗ "+bad+" problems");process.exit(1)} else console.log("✓ PBQs are valid");
