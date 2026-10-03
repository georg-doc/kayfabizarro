import fs from 'node:fs';import path from 'node:path';
const here=path.dirname(new URL(import.meta.url).pathname),root=path.resolve(here,'../../..'),spec=JSON.parse(fs.readFileSync(path.join(here,'SOURCE.json'),'utf8'));
const checks=[];const check=(n,o,d=null)=>{checks.push({name:n,ok:!!o,detail:d});if(!o)throw new Error(n+': '+JSON.stringify(d));};
try{
 check('build',spec.build==='AUDIO-STEM-BED-01-v0.1',spec.build);check('one donor',spec.donor?.id==='cyclical-warmth-76');check('76 BPM',spec.donor.bpm===76);check('8 stems',spec.donor.stems.length===8);
 for(const f of [spec.donor.master,...spec.donor.stems]){const p=path.join(root,f.path);const id=f.id||'master';check(id+' exists',fs.existsSync(p),f.path);if(fs.existsSync(p))check(id+' size',fs.statSync(p).size===f.size,{actual:fs.statSync(p).size,expected:f.size});}
 console.log(JSON.stringify({status:'PASS',checks:checks.length,checks},null,2));
}catch(e){console.error(JSON.stringify({status:'FAIL',checks,failure:String(e.stack||e)},null,2));process.exit(1);}