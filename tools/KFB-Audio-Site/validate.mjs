import fs from 'node:fs';import path from 'node:path';
const root=path.resolve(path.dirname(new URL(import.meta.url).pathname),'../..');
const catalog=JSON.parse(fs.readFileSync(path.join(root,'media/3D_Assets/Sounds/jukebox.json'),'utf8'));
const snapshot=JSON.parse(fs.readFileSync(path.join(root,'tools/KFB-Audio-Site/catalog.snapshot.json'),'utf8'));
const sound=JSON.parse(fs.readFileSync(path.join(root,'tools/KFB-Audio-Site/soundscape-source.json'),'utf8'));
const intake=JSON.parse(fs.readFileSync(path.join(root,'tools/KFB-Audio-Site/source-intake.v1.json'),'utf8'));
const lock=JSON.parse(fs.readFileSync(path.join(root,'tools/KFB-Audio-Site/source-lock.json'),'utf8'));
const checks=[];const check=(n,o,d=null)=>{checks.push({name:n,ok:!!o,detail:d});if(!o)throw new Error(n+': '+JSON.stringify(d))};
try{
 check('catalog snapshot matches',JSON.stringify(catalog)===JSON.stringify(snapshot));
 check('60 tracks',catalog.tracks.length===60,catalog.tracks.length);
 const road=catalog.tracks.filter(t=>t.collection==='roadtrip-v2');check('50 RoadTrip',road.length===50,road.length);check('20 stem families',road.filter(t=>t.stems).length===20,road.filter(t=>t.stems).length);
 const rain=catalog.tracks.find(t=>t.id==='roadtrip-v2-rain-percussion-beetle-ring');check('rain texture exists',!!rain);check('rain texture 107 BPM',rain?.bpm===107,rain?.bpm);check('rain texture source-only stems',rain?.stems?.policy==='source-only',rain?.stems);check('rain texture not auto-radio',rain?.autoRadio?.eligible===false,rain?.autoRadio);
 check('lock 50 masters',lock.roadTripV2.masters.length===50,lock.roadTripV2.masters.length);check('lock 20 stems',lock.roadTripV2.stemFamilies.length===20,lock.roadTripV2.stemFamilies.length);
 check('17 Eleven tests',intake.elevenLabs.length===17,intake.elevenLabs.length);check('17 locked tests',(lock.intakeCandidates||[]).length===17,(lock.intakeCandidates||[]).length);
 const locked=new Map((lock.intakeCandidates||[]).map(x=>[x.path,x]));for(const x of intake.elevenLabs){check('candidate locked '+x.id,locked.get(x.file)?.sha===x.sha,{file:x.file,sha:x.sha,locked:locked.get(x.file)?.sha})}
 check('no Eleven accepted',intake.elevenLabs.every(x=>x.accepted===false));
 check('old prompt feedback TUNE',intake.feedback.oldPromptBank==='HUMAN_TUNE',intake.feedback);
 check('rain still source-required',sound.missing.some(x=>x.id==='rain-bank'&&x.status==='SOURCE_REQUIRED'));
 console.log(JSON.stringify({status:'PASS',checks:checks.length,tracks:catalog.tracks.length,roadTrip:road.length,stemFamilies:road.filter(t=>t.stems).length,elevenTests:intake.elevenLabs.length},null,2));
}catch(e){console.error(JSON.stringify({status:'FAIL',checks,failure:String(e.stack||e)},null,2));process.exit(1)}