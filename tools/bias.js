// Lists questions whose correct answer is a giveaway (much longer than every distractor).
// Usage: node tools/bias.js [ratio] [filePrefix]
const fs=require("fs"),vm=require("vm"),path=require("path");const w={};w.window=w;vm.createContext(w);
const root=path.join(__dirname,"..");
for(const f of ["js/meta.js","data/d1.js","data/d2.js","data/d3.js","data/d4.js","data/d5.js","data/net.js","data/m1.js","data/m2.js","data/m3.js","data/m4.js","data/m5.js"])vm.runInContext(fs.readFileSync(path.join(root,f),"utf8"),w);
const ratio=Number(process.argv[2]||1.4), only=process.argv[3]||"";
let n=0,tot=0;for(const q of w.QBANK){ if(only && !q.o.startsWith(only)) continue; if(process.argv[4]==="sec" && !q.sec) continue; tot++;
 const L=q.a.map(x=>x.length);const o=Math.max(...L.filter((_,i)=>i!==q.c));
 const flag=L[q.c]>o*ratio || q.a.some((x,i)=>i!==q.c && /^Only |^Nothing|^None of|never |always /i.test(x));
 if(flag){n++; if(process.argv[5]) console.log(JSON.stringify(q.a[q.c])+"\n    x "+q.a.filter((_,i)=>i!==q.c).join(" | "));}}
console.log(`flagged ${n} of ${tot}`);
