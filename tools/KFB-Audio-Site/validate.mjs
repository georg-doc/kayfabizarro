import fs from 'node:fs';import path from 'node:path';
const root=path.resolve(path.dirname(new URL(import.meta.url).pathname),'../..');
const catalog=JSON.parse(fs.readFileSync(path.join(root,'media/3D_Assets/Sounds/jukebox.json'),'utf8'));
const snapshot=JSON.parse(fs.readFileSync(path.join(root,'tools/KFB-Audio-Site/catalog.snapshot.json'),'utf8'));
const sound=JSON.parse(fs.readFileSync(path.join(root,'tools/KFB-Audio-Site/soundscape-source.json'),'utf8'));
const intake=JSON.parse(fs.readFileSync(path.join(root,'tools/KFB-Audio-Site/source-intake.v1.json'),'utf8'));
const lock=JSON.parse(fs.readFileSync(path.join(root,'tools/KFB-Audio-Site/source-lock.json'),'utf8'));
const sfxlib=JSON.parse(fs.readFileSync(path.join(root,'tools/KFB-Audio-Site/sfx-library.snapshot.json'),'utf8'));
const checks=[];const check=(n,o,d=null)=>{checks.push({name:n,ok:!!o,detail:d});if(!o)throw new Error(n+': '+JSON.stringify(d))};
try{
 check('catalog snapshot matches',JSON.stringify(catalog)===JSON.stringify(snapshot));
 check('69 tracks',catalog.tracks.length===69,catalog.tracks.length);
 const road=catalog.tracks.filter(t=>t.collection==='roadtrip-v2');check('59 RoadTrip',road.length===59,road.length);check('29 stem families',road.filter(t=>t.stems).length===29,road.filter(t=>t.stems).length);
 const rain=catalog.tracks.find(t=>t.id==='roadtrip-v2-rain-percussion-beetle-ring');check('rain texture exists',!!rain);check('rain texture 107 BPM',rain?.bpm===107,rain?.bpm);check('rain texture source-only stems',rain?.stems?.policy==='source-only',rain?.stems);check('rain texture not auto-radio',rain?.autoRadio?.eligible===false,rain?.autoRadio);
 check('lock 59 masters',lock.roadTripV2.masters.length===59,lock.roadTripV2.masters.length);check('lock 29 stems',lock.roadTripV2.stemFamilies.length===29,lock.roadTripV2.stemFamilies.length);
 check('17 Eleven tests',intake.elevenLabs.length===17,intake.elevenLabs.length);check('17 locked tests',(lock.intakeCandidates||[]).length===17,(lock.intakeCandidates||[]).length);
 const locked=new Map((lock.intakeCandidates||[]).map(x=>[x.path,x]));for(const x of intake.elevenLabs){check('candidate locked '+x.id,locked.get(x.file)?.sha===x.sha,{file:x.file,sha:x.sha,locked:locked.get(x.file)?.sha})}
 check('no Eleven accepted',intake.elevenLabs.every(x=>x.accepted===false));
 check('old prompt feedback TUNE',intake.feedback.oldPromptBank==='HUMAN_TUNE',intake.feedback);
 check('ambient stem families downloaded',['Utopia Ambient Bed','Dystopia Ambient Bed','Protopia Ambient Bed'].every(title=>catalog.tracks.find(t=>t.title===title)?.stems?.policy==='source-only'));
 check('six palette masters human-positive',["Soul / R&B Ambient Bed","Piano / Chamber Minimal Bed","Cinematic / Epic-but-Playable Bed","Cartoon Chase / Capers Bed","Folk / Acoustic / Storybook Bed","Metaphysical / Cosmic Ambient Bed"].every(title=>catalog.tracks.find(t=>t.title===title)?.humanReview?.status==='positive'));
 check('six palette stems downloaded',["Soul / R&B Ambient Bed","Piano / Chamber Minimal Bed","Cinematic / Epic-but-Playable Bed","Cartoon Chase / Capers Bed","Folk / Acoustic / Storybook Bed","Metaphysical / Cosmic Ambient Bed"].every(title=>catalog.tracks.find(t=>t.title===title)?.stems?.policy==='source-only'));
 check('rain still source-required',sound.missing.some(x=>x.id==='rain-bank'&&x.status==='SOURCE_REQUIRED'));
 check('SFX library schema',sfxlib.schema==='kfb.audio-sfx-library/1.0',sfxlib.schema);
 check('SFX library source locked',/^main@[0-9a-f]{40}$/.test(sfxlib.source?.ref||''),sfxlib.source);
 check('SFX library tree complete',sfxlib.source?.truncated===false,sfxlib.source);
 check('SFX library 1704 audio files',sfxlib.assets.length===1704,sfxlib.assets.length);
 check('SFX library total self-consistent',sfxlib.totals?.audioFiles===sfxlib.assets.length,sfxlib.totals);
 check('SFX library unique paths',new Set(sfxlib.assets.map(x=>x.path)).size===sfxlib.assets.length);
 check('SFX library role contract',["VOICE","UI","PLAYER_CRITICAL","WORLD_SFX","DIEGETIC_MUSIC","SCORE","LOCAL_AMBIENCE","GLOBAL_BED"].every(x=>sfxlib.taxonomy?.semanticRoles?.includes(x)),sfxlib.taxonomy?.semanticRoles);
 check('SFX interface aliases 100/100',sfxlib.lineageChecks?.interfaceRootVsKenneyNested?.exactBlobAliases===100,sfxlib.lineageChecks?.interfaceRootVsKenneyNested);
 check('SFX classic aliases 80/80',sfxlib.lineageChecks?.classicArcadeSmallVsComplete?.exactBlobAliases===80,sfxlib.lineageChecks?.classicArcadeSmallVsComplete);
 check('SFX gaps preserved',["tyre-friction","rain-thunder","crowd-venue","city-traffic","workshop-machinery"].every(id=>sfxlib.knownGaps?.some(x=>x.id===id)),sfxlib.knownGaps);
 console.log(JSON.stringify({status:'PASS',checks:checks.length,tracks:catalog.tracks.length,roadTrip:road.length,stemFamilies:road.filter(t=>t.stems).length,elevenTests:intake.elevenLabs.length},null,2));
}catch(e){console.error(JSON.stringify({status:'FAIL',checks,failure:String(e.stack||e)},null,2));process.exit(1)}