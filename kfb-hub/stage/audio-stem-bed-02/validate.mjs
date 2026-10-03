import fs from 'node:fs';import path from 'node:path';
const here=path.dirname(new URL(import.meta.url).pathname);
const root=path.resolve(here,'../../..');
const spec=JSON.parse(fs.readFileSync(path.join(here,'SOURCE.json'),'utf8'));
const checks=[];
const check=(n,o,d=null)=>{checks.push({name:n,ok:!!o,detail:d});if(!o)throw new Error(n+': '+JSON.stringify(d));};
try{
  check('build',spec.build==='AUDIO-STEM-BED-02-v0.1',spec.build);
  check('five donors',spec.donors.length===5,spec.donors.map(d=>d.id));
  for(const d of spec.donors){
    check(d.id+' no vocal stems',d.stems.every(s=>!/vocals/i.test(s[0])),d.stems.map(s=>s[0]));
    check(d.id+' stem count',d.stems.length>=8,d.stems.length);
    for(const s of d.stems){
      const p=path.join(root,'media/3D_Assets/Sounds/KFB RoadTrip JukeBox v2',d.stemDir,s[1]);
      check(d.id+' '+s[0]+' exists',fs.existsSync(p),p);
      if(fs.existsSync(p))check(d.id+' '+s[0]+' size',fs.statSync(p).size===s[3],{actual:fs.statSync(p).size,expected:s[3]});
    }
  }
  console.log(JSON.stringify({status:'PASS',checks:checks.length,checks},null,2));
}catch(e){
  console.error(JSON.stringify({status:'FAIL',checks,failure:String(e.stack||e)},null,2));
  process.exit(1);
}