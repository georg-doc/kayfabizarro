import fs from 'node:fs';import path from 'node:path';
const here=path.dirname(new URL(import.meta.url).pathname),root=path.resolve(here,'../../..'),spec=JSON.parse(fs.readFileSync(path.join(here,'SOURCE.json'),'utf8')),checks=[];
const check=(n,o,d=null)=>{checks.push({name:n,ok:!!o,detail:d});if(!o)throw new Error(n+': '+JSON.stringify(d))};
try{
  check('build R1',spec.build==='AUDIO-STEM-BED-02-R1',spec.build);
  check('five donors',spec.donors.length===5,spec.donors.map(d=>d.id));
  check('total 50 runtime stems',spec.donors.reduce((n,d)=>n+d.stems.length,0)===50,spec.donors.map(d=>[d.id,d.stems.length]));
  for(const d of spec.donors){
    const mp=path.join(root,'media/3D_Assets/Sounds/KFB RoadTrip JukeBox v2',d.master.file);
    check(d.id+' master exists',fs.existsSync(mp),mp);
    if(fs.existsSync(mp))check(d.id+' master size',fs.statSync(mp).size===d.master.size,{actual:fs.statSync(mp).size,expected:d.master.size});
    check(d.id+' defaults neutral',Object.values(d.defaults).every(v=>v===0),d.defaults);
    const roles=new Set(),files=new Set();
    for(const s of d.stems){
      check(d.id+' role unique '+s[0],!roles.has(s[0]),s[0]);roles.add(s[0]);
      check(d.id+' file unique '+s[1],!files.has(s[1]),s[1]);files.add(s[1]);
      const p=path.join(root,'media/3D_Assets/Sounds/KFB RoadTrip JukeBox v2',d.stemDir,s[1]);
      check(d.id+' '+s[0]+' exists',fs.existsSync(p),p);
      if(fs.existsSync(p))check(d.id+' '+s[0]+' size',fs.statSync(p).size===s[3],{actual:fs.statSync(p).size,expected:s[3]});
    }
  }
  check('sunshine restores two residuals',spec.donors.find(d=>d.id==='sunshine').stems.filter(s=>s[4]==='residual').length===2);
  check('grief restores two residuals',spec.donors.find(d=>d.id==='grief').stems.filter(s=>s[4]==='residual').length===2);
  check('boss restores two residuals',spec.donors.find(d=>d.id==='boss').stems.filter(s=>s[4]==='residual').length===2);
  console.log(JSON.stringify({status:'PASS',checks:checks.length,checks},null,2));
}catch(e){console.error(JSON.stringify({status:'FAIL',checks,failure:String(e.stack||e)},null,2));process.exit(1)}