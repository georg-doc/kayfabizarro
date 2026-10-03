import fs from 'node:fs';
import path from 'node:path';

const here=path.dirname(new URL(import.meta.url).pathname);
const root=path.resolve(here,'../../..');
const spec=JSON.parse(fs.readFileSync(path.join(here,'SOURCE.json'),'utf8'));
const checks=[];
const check=(name,ok,detail=null)=>{checks.push({name,ok:!!ok,detail});if(!ok)throw new Error(name+': '+JSON.stringify(detail));};

try{
  check('build marker',spec.build==='AUDIO-ARRANGE-01-DONOR-BENCH-v0.2',spec.build);
  check('branch-only status',spec.publicStage===false);
  check('bpm normalized',spec.bpm===76,spec.bpm);
  check('4/4',spec.beatsPerBar===4);
  check('64 bars',spec.totalBars===64);
  check('two masters',spec.masters.length===2,spec.masters.map(x=>x.id));
  check('eight stems',spec.stems.length===8,spec.stems.map(x=>x.id));
  check('eight sections',spec.sections.length===8,spec.sections);
  check('section coverage',spec.sections[0].fromBar===0&&spec.sections.at(-1).toBar===64);
  for(const item of [...spec.masters,...spec.stems]){
    const p=path.join(root,item.path);
    check(item.id+' exists',fs.existsSync(p),item.path);
    const stat=fs.statSync(p);
    check(item.id+' byte size exact',stat.size===item.size,{actual:stat.size,expected:item.size});
  }
  console.log(JSON.stringify({status:'PASS',checks:checks.length,checks},null,2));
}catch(e){
  console.error(JSON.stringify({status:'FAIL',checks,failure:String(e.stack||e)},null,2));
  process.exit(1);
}
