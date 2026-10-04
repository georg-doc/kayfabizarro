import fs from 'node:fs';import path from 'node:path';
const root=path.resolve(path.dirname(new URL(import.meta.url).pathname),'../..');
const catalog=JSON.parse(fs.readFileSync(path.join(root,'media/3D_Assets/Sounds/jukebox.json'),'utf8'));
const sound=JSON.parse(fs.readFileSync(path.join(root,'tools/KFB-Audio-Site/soundscape-source.json'),'utf8'));
const lock=JSON.parse(fs.readFileSync(path.join(root,'tools/KFB-Audio-Site/source-lock.json'),'utf8'));
const checks=[];const check=(n,o,d=null)=>{checks.push({name:n,ok:!!o,detail:d});if(!o)throw new Error(n+': '+JSON.stringify(d))};
try{
 check('catalog version',catalog.version==='2.0.0',catalog.version);
 check('54 catalog tracks',catalog.tracks.length===54,catalog.tracks.length);
 const ids=new Set(),files=new Set();for(const t of catalog.tracks){check('id unique '+t.id,!ids.has(t.id),t.id);ids.add(t.id);check('file unique '+t.id,!files.has(t.file),t.file);files.add(t.file)}
 const road=catalog.tracks.filter(t=>t.collection==='roadtrip-v2'),lockMasters=new Map(lock.roadTripV2.masters.map(x=>[x.path,x])),lockStems=new Map(lock.roadTripV2.stemFamilies.map(x=>[x.path,x]));
 check('44 RoadTrip masters',road.length===44,road.length);check('source lock 44 masters',lockMasters.size===44,lockMasters.size);
 check('14 catalog stem families',road.filter(t=>t.stems).length===14,road.filter(t=>t.stems).length);check('source lock 14 stem families',lockStems.size===14,lockStems.size);
 for(const t of road){check('locked master '+t.id,lockMasters.has(t.file),t.file);check('master sha '+t.id,lockMasters.get(t.file)?.sha===t.source?.sha,{lock:lockMasters.get(t.file)?.sha,catalog:t.source?.sha});if(t.stems){check('locked stems '+t.id,lockStems.has(t.stems.dir),t.stems.dir);check('stem tree sha '+t.id,lockStems.get(t.stems.dir)?.treeSha===t.stems.treeSha,{lock:lockStems.get(t.stems.dir)?.treeSha,catalog:t.stems.treeSha});check('stem policy '+t.id,['source-only','certified'].includes(t.stems.policy),t.stems.policy)}}
 check('Cyclical certified',catalog.tracks.find(t=>t.title==='Cyclical Warmth')?.stems?.policy==='certified');
 check('Beetle siblings',catalog.tracks.find(t=>t.title==='Beetle-Wrestling Entrance 01')?.variantOf==='roadtrip-v2-beetle-wrestling-entrance');
 const lockedSound=new Map(lock.soundscape.map(x=>[x.path,x]));for(const s of sound.available)check('locked soundscape '+s.id,lockedSound.has(s.file),s.file);
 check('rain explicitly missing',sound.missing.some(x=>x.id==='rain-bank'&&x.status==='SOURCE_REQUIRED'));
 console.log(JSON.stringify({status:'PASS',checks:checks.length,catalogTracks:catalog.tracks.length,roadTrip:road.length,stemFamilies:road.filter(t=>t.stems).length,sourceRef:lock.sourceRef},null,2));
}catch(e){console.error(JSON.stringify({status:'FAIL',checks,failure:String(e.stack||e)},null,2));process.exit(1)}
