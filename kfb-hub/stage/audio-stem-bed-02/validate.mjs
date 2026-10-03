import fs from 'node:fs';import path from 'node:path';
const here=path.dirname(new URL(import.meta.url).pathname),root=path.resolve(here,'../../..'),spec=JSON.parse(fs.readFileSync(path.join(here,'SOURCE.json'),'utf8')),checks=[];
const check=(n,o,d=null)=>{checks.push({name:n,ok:!!o,detail:d});if(!o)throw new Error(n+': '+JSON.stringify(d))};
try{
 check('build R2',spec.build==='AUDIO-STEM-BED-02-R2',spec.build);
 check('five donors',spec.donors.length===5);
 check('one stem-certified donor',spec.donors.filter(d=>d.runtimePolicy==='stem-certified').map(d=>d.id).join(',')==='neutral',spec.donors.map(d=>[d.id,d.runtimePolicy]));
 check('four master-safe donors',spec.donors.filter(d=>d.runtimePolicy==='master-safe').length===4,spec.donors.map(d=>[d.id,d.runtimePolicy]));
 check('50 source stems retained',spec.donors.reduce((n,d)=>n+d.stems.length,0)===50);
 for(const d of spec.donors){
   const mp=path.join(root,'media/3D_Assets/Sounds/KFB RoadTrip JukeBox v2',d.master.file);check(d.id+' master exists',fs.existsSync(mp),mp);if(fs.existsSync(mp))check(d.id+' master size',fs.statSync(mp).size===d.master.size,{actual:fs.statSync(mp).size,expected:d.master.size});
   for(const s of d.stems){const p=path.join(root,'media/3D_Assets/Sounds/KFB RoadTrip JukeBox v2',d.stemDir,s[1]);check(d.id+' '+s[0]+' exists',fs.existsSync(p),p);if(fs.existsSync(p))check(d.id+' '+s[0]+' size',fs.statSync(p).size===s[3],{actual:fs.statSync(p).size,expected:s[3]})}
 }
 console.log(JSON.stringify({status:'PASS',checks:checks.length,checks},null,2));
}catch(e){console.error(JSON.stringify({status:'FAIL',checks,failure:String(e.stack||e)},null,2));process.exit(1)}