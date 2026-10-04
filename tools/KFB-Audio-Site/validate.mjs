import fs from 'node:fs';import path from 'node:path';
const root=path.resolve(path.dirname(new URL(import.meta.url).pathname),'../..');
const catalog=JSON.parse(fs.readFileSync(path.join(root,'media/3D_Assets/Sounds/jukebox.json'),'utf8'));
const sound=JSON.parse(fs.readFileSync(path.join(root,'tools/KFB-Audio-Site/soundscape-source.json'),'utf8'));
const checks=[];const check=(n,o,d=null)=>{checks.push({name:n,ok:!!o,detail:d});if(!o)throw new Error(n+': '+JSON.stringify(d))};
try{
 check('catalog version',catalog.version==='2.0.0',catalog.version);
 check('tracks >= 52',catalog.tracks.length>=52,catalog.tracks.length);
 const ids=new Set(),files=new Set();
 for(const t of catalog.tracks){
  check('id unique '+t.id,!ids.has(t.id),t.id);ids.add(t.id);
  check('file unique '+t.id,!files.has(t.file),t.file);files.add(t.file);
  const p=path.join(root,t.file);check('master exists '+t.id,fs.existsSync(p),t.file);
  if(t.stems){const d=path.join(root,t.stems.dir);check('stem dir exists '+t.id,fs.existsSync(d),t.stems.dir);check('stem policy '+t.id,['source-only','certified'].includes(t.stems.policy),t.stems.policy)}
 }
 const road=catalog.tracks.filter(t=>t.collection==='roadtrip-v2');
 check('42 RoadTrip masters',road.length===42,road.length);
 check('12 stem families',road.filter(t=>t.stems).length===12,road.filter(t=>t.stems).length);
 check('Cyclical certified',catalog.tracks.find(t=>t.title==='Cyclical Warmth')?.stems?.policy==='certified');
 check('Beetle sibling primary',catalog.tracks.find(t=>t.title==='Beetle-Wrestling Entrance')?.family==='beetle-wrestling-entrance');
 check('Beetle 01 alternate',catalog.tracks.find(t=>t.title==='Beetle-Wrestling Entrance 01')?.variantOf==='roadtrip-v2-beetle-wrestling-entrance');
 for(const s of sound.available)check('soundscape source '+s.id,fs.existsSync(path.join(root,s.file)),s.file);
 check('rain explicitly missing',sound.missing.some(x=>x.id==='rain-bank'&&x.status==='SOURCE_REQUIRED'));
 console.log(JSON.stringify({status:'PASS',checks:checks.length,tracks:catalog.tracks.length,roadTrip:road.length,stemFamilies:road.filter(t=>t.stems).length},null,2));
}catch(e){console.error(JSON.stringify({status:'FAIL',checks,failure:String(e.stack||e)},null,2));process.exit(1)}