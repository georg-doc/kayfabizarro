import fs from 'node:fs';import path from 'node:path';
const root=path.resolve(path.dirname(new URL(import.meta.url).pathname),'../..');
const catalog=JSON.parse(fs.readFileSync(path.join(root,'media/3D_Assets/Sounds/jukebox.json'),'utf8'));
const sound=JSON.parse(fs.readFileSync(path.join(root,'tools/KFB-Audio-Site/soundscape-source.json'),'utf8'));const snapshot=JSON.parse(fs.readFileSync(path.join(root,'tools/KFB-Audio-Site/catalog.snapshot.json'),'utf8'));
const lock=JSON.parse(fs.readFileSync(path.join(root,'tools/KFB-Audio-Site/source-lock.json'),'utf8'));
const interaction=JSON.parse(fs.readFileSync(path.join(root,'tools/KFB-Audio-Site/music-interaction-states.json'),'utf8'));
const siteJs=fs.readFileSync(path.join(root,'tools/KFB-Audio-Site/audio-site.js'),'utf8');
const promptPack=fs.readFileSync(path.join(root,'tools/KFB-Audio-Site/prompts/KFB_MUSIC_CONTEXT_STYLES_BCD_v1.md'),'utf8');
const checks=[];const check=(n,o,d=null)=>{checks.push({name:n,ok:!!o,detail:d});if(!o)throw new Error(n+': '+JSON.stringify(d))};
try{
 check('catalog version',catalog.version==='2.0.0',catalog.version);check('site snapshot matches canonical catalog',JSON.stringify(snapshot)===JSON.stringify(catalog));
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
 check('music context schema',interaction.schema==='kfb.audio.music-context/1.0',interaction.schema);
 check('music context owner preserved',interaction.owner==='KFB Audio & Soundscape Baseline v1',interaction.owner);
 check('three B/C/D states',JSON.stringify(Object.keys(interaction.states))===JSON.stringify(['B','C','D']),Object.keys(interaction.states));
 check('default state C',interaction.defaultState==='C',interaction.defaultState);
 check('existing semantic roles preserved',JSON.stringify(interaction.semanticBuses)===JSON.stringify(['VOICE','UI','PLAYER_CRITICAL','WORLD_SFX','DIEGETIC_MUSIC','SCORE','LOCAL_AMBIENCE','GLOBAL_BED']),interaction.semanticBuses);
 check('TTS ducking remains separate',interaction.ducking.separateFromMusicContextState===true&&interaction.ducking.musicTimelineContinues===true,interaction.ducking);
 check('AudioContext owns transition clock',interaction.transitions.clockOwner==='AudioContext.currentTime',interaction.transitions.clockOwner);
 check('complete transition matrix',Object.keys(interaction.transitions.matrixSeconds).length===6,interaction.transitions.matrixSeconds);
 check('future stems unavailable',interaction.stemContract.availability==='FUTURE_NOT_AVAILABLE',interaction.stemContract.availability);
 check('no placeholder stem audio',Array.isArray(interaction.stemContract.audioFiles)&&interaction.stemContract.audioFiles.length===0,interaction.stemContract.audioFiles);
 for(const [id,state] of Object.entries(interaction.states)){
  for(const key of ['energy','density','transientRestraint','percussionRestraint','speechSpaceBias'])check(id+' '+key+' normalized',state.targets[key]>=0&&state.targets[key]<=1,state.targets[key]);
  check(id+' music gain finite',Number.isFinite(state.targets.musicGainDb),state.targets.musicGainDb);
  check(id+' crossfade positive',state.targets.crossfadeSeconds>0,state.targets.crossfadeSeconds);
  check(id+' BPM range valid',state.tempo.bpmMin>0&&state.tempo.bpmMax>=state.tempo.bpmMin,state.tempo);
  check(id+' prompt pack exact',state.promptReference.path==='tools/KFB-Audio-Site/prompts/KFB_MUSIC_CONTEXT_STYLES_BCD_v1.md',state.promptReference.path);
  check(id+' future stem slots metadata only',Object.keys(state.futureStemTargets).length===interaction.stemContract.slots.length,state.futureStemTargets);
 }
 check('D triplet dialogue metadata',interaction.states.D.tempo.tripletFriendly===true&&interaction.states.D.tempo.dialogueFit==='statement / response / reframe',interaction.states.D.tempo);
 check('D strongest speech-space bias',interaction.states.D.targets.speechSpaceBias>interaction.states.B.targets.speechSpaceBias&&interaction.states.D.targets.speechSpaceBias>interaction.states.C.targets.speechSpaceBias,interaction.states.D.targets.speechSpaceBias);
 check('World/Billboard integration prepared only',interaction.worldIntegration.status==='PREPARED_NOT_INTEGRATED'&&interaction.worldIntegration.billboardHints.length===3,interaction.worldIntegration);
 check('external adapter contract',interaction.adapter.method.includes('window.KFBAudioSite.musicContext.setState')&&interaction.adapter.inboundEvent==='kfb:music-context',interaction.adapter);
 check('one AudioContext constructor site-wide',(siteJs.match(/new Context\(\)/g)||[]).length===1,(siteJs.match(/new Context\(\)/g)||[]).length);
 check('no interval audio clock',!siteJs.includes('setInterval('));
 check('12 authored B/C/D prompts',(promptPack.match(/^## /gm)||[]).length===12,(promptPack.match(/^## /gm)||[]).length);
 check('Base Style B present',promptPack.includes('KFB Base Style B · Downtown Groove Ecology'));
 check('Cozy Style C present',promptPack.includes('KFB Cozy Style C · Base'));
 check('Conversation Style D present',promptPack.includes('KFB Conversation Style D · Base'));
 console.log(JSON.stringify({status:'PASS',checks:checks.length,catalogTracks:catalog.tracks.length,roadTrip:road.length,stemFamilies:road.filter(t=>t.stems).length,interactionStates:Object.keys(interaction.states).length,promptEntries:(promptPack.match(/^## /gm)||[]).length,sourceRef:lock.sourceRef},null,2));
}catch(e){console.error(JSON.stringify({status:'FAIL',checks,failure:String(e.stack||e)},null,2));process.exit(1)}
