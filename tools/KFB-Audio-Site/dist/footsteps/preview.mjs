import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {measureClip} from './vendor/locomotion-profiles.v1.js';
import {entries,ContactTimeline} from './contact-core.mjs';
import {createFootstepAudio} from './audio.mjs';
const $=id=>document.getElementById(id),root=$('footsteps');
let host,audio,scene,renderer,camera,controls,actor,mixer,feet,clips={},profiles={},active,mode='idle',phase=0,lastTime=null,jump=null,recording=null,demo=null,epoch=0;
const timeline=new ContactTimeline(),events=[],frameGaps=[];
function status(s){$('footStatus').textContent=s;}
function download(blob,name){const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1500);}
function surfaceAt(foot){const selected=$('footSurface').value;if(selected!=='seam')return selected;const p=feet[foot].getWorldPosition(new THREE.Vector3());return p.x<0?'grass':'gravel';}
function clean(root,c){const names=new Set();root.traverse(n=>names.add(n.name));return new THREE.AnimationClip(c.name,c.duration,c.tracks.filter(t=>{const p=THREE.PropertyBinding.parseTrackName(t.name);return names.has(p.nodeName)&&!(p.propertyName==='position'&&/^(root|hips|root_motion)$/i.test(p.nodeName));}).map(t=>t.clone()));}
function setMode(next){
  if(!mixer)return;const name={idle:'Idle_A',walk:'Walking_A',run:'Running_A',air:'Jump_Idle',land:'Jump_Land'}[next],clip=clips[name];if(!clip)throw Error(`Real clip missing: ${name}`);
  const old=active,oldPhase=phase%1;mode=next;active=mixer.clipAction(clip);active.reset().setEffectiveWeight(1).play();active.setLoop(next==='land'?THREE.LoopOnce:THREE.LoopRepeat,Infinity);active.clampWhenFinished=true;
  if(next==='walk'||next==='run'){active.time=oldPhase*clip.duration;phase=oldPhase;}else phase=0;
  if(old&&old!==active){old.fadeOut(.16);active.fadeIn(.16);}epoch++;timeline.previous=phase;timeline.owner=`${name}:${epoch}`;
  root.dataset.gait=next;
}
function cue(c){if(!c)return;const result=audio.play({...c,gait:mode,grounded:timeline.grounded});if(result)events.push(result);if(events.length>3000)events.shift();$('footLast').textContent=`${c.kind} · ${c.foot} · ${c.surface}`;}
function snapshot(){const ds=events.map(e=>e.driftMs).sort((a,b)=>a-b),onsets=events.map(e=>e.onsetDriftMs).sort((a,b)=>a-b);const duplicate=events.filter((e,i)=>events.slice(0,i).some(p=>p.key===e.key)).length;return {revision:'0.7.2-footstep-v389',hostContexts:window.KFBAudioSite?.audioContextsCreated,clock:'injected AudioContext.currentTime',bus:'PLAYER_CRITICAL',mode,surface:$('footSurface').value,profiles,decode:audio?.metrics||[],counts:{events:events.length,steps:events.filter(e=>e.kind==='footstep').length,landings:events.filter(e=>e.kind==='land').length,duplicateKeys:duplicate,suppressed:timeline.suppressed},contactToScheduleMs:{max:ds.at(-1)||0,p95:ds[Math.floor(ds.length*.95)]||0},contactToSourceOnsetMs:{max:onsets.at(-1)||0,p95:onsets[Math.floor(onsets.length*.95)]||0},frameGapMsMax:Math.max(0,...frameGaps),events,cues:timeline.packet(),scope:'Synthetic support fixture; no World writes; landing from support, not clip. No human acceptance.'};}
function renderMetrics(){const s=snapshot(),focus=window.KFBAudioSite?.musicContext.getSnapshot();s.musicFocus=focus?{state:focus.state,voiceActive:focus.voiceActive,effectiveBusGainDb:focus.effectiveBusGainDb,playerCriticalGain:host?.buses.PLAYER_CRITICAL.gain.value}:null;$('footMetrics').textContent=`${s.counts.steps} steps · ${s.counts.landings} landings · ${s.counts.duplicateKeys} duplicate keys · drift p95 ${s.contactToScheduleMs.p95.toFixed(1)} ms · max ${s.contactToScheduleMs.max.toFixed(1)} ms · ${s.hostContexts} AudioContext`;$('footDiagnostics').textContent=JSON.stringify(s,null,2);}
function frame(){requestAnimationFrame(frame);if(!renderer)return;controls.update();
  if(host){const now=host.ctx.currentTime,dt=lastTime==null?0:Math.max(0,now-lastTime);lastTime=now;if(dt>0&&dt<2)frameGaps.push(dt*1000);if(frameGaps.length>2000)frameGaps.shift();
    if(demo){const elapsed=now-demo.start;const stage=Math.floor(elapsed/3);if(stage!==demo.stage){demo.stage=stage;if(stage>=8){demo=null;setMode('idle');status('24 s fixture complete · download evidence');if(recording)stopRecording();}else{const plan=[['walk','grass'],['walk','concrete'],['walk','gravel'],['run','grass'],['run','gravel'],['idle','concrete'],['walk','seam'],['idle','grass']][stage];$('footSurface').value=plan[1];setMode(plan[0]);if(stage===7)startJump();}}}
    if(jump){const t=now-jump.start,u=Math.min(1,t/jump.duration);actor.position.y=4*jump.height*u*(1-u);if(u>=1){actor.position.y=0;cue(timeline.support(true,jump.start+jump.duration,surfaceAt('l')));jump=null;setMode('land');}else timeline.support(false,now,surfaceAt('l'));}
    if(active){const duration=active.getClip().duration,previousPhase=phase;phase+=dt/duration;mixer.update(dt);actor.updateMatrixWorld(true);
      const moving=(mode==='walk'||mode==='run')&&!jump;const pts=profiles[active.getClip().name]?.entries||[];
      // The source clip phase is the sole cadence source. One selected owner during blends.
      for(const c of timeline.advance({owner:`${active.getClip().name}:${epoch}`,phase,duration,time:now,points:pts,moving,surfaceAt}))cue(c);
      if(mode==='land'&&phase>=1)setMode('idle');
      if(dt>.25)status('Background gap: stale contacts dropped; resume without backlog');
    }
    if(recording&&now-recording.started>=26)stopRecording();
    if(Math.floor(now*4)!==Math.floor((now-dt)*4))renderMetrics();
  }
  const colors={grass:0x789169,concrete:0x9b9891,gravel:0x8f7861,seam:0x789169};scene.userData.floor.material.color.setHex(colors[$('footSurface').value]);renderer.render(scene,camera);
}
function startJump(){if(!host||jump)return;jump={start:host.ctx.currentTime,duration:.9,height:.65};timeline.support(false,jump.start,surfaceAt('l'));setMode('air');}
async function init(){
  $('footLoad').disabled=true;status('Loading pinned Rig_Medium and measuring native contacts…');
  const loader=new GLTFLoader(),base=new URL('./assets/',import.meta.url);
  const [model,general,movement]=await Promise.all(['Mannequin_Medium.glb','General.glb','MovementBasic.glb'].map(f=>loader.loadAsync(new URL(f,base).href)));
  actor=model.scene;actor.updateMatrixWorld(true);mixer=new THREE.AnimationMixer(actor);const bones=[];actor.traverse(n=>{if(n.isBone)bones.push(n);});feet={l:bones.find(n=>/^foot\.?l$/i.test(n.name)),r:bones.find(n=>/^foot\.?r$/i.test(n.name))};const hips=bones.find(n=>/^hips$/i.test(n.name));if(!feet.l||!feet.r||!hips)throw Error(`Rig bones unresolved: ${bones.map(n=>n.name).join(',')}`);
  for(const c of [...general.animations,...movement.animations])clips[c.name]=clean(actor,c);
  const saved=[];actor.traverse(n=>saved.push({n,p:n.position.clone(),q:n.quaternion.clone(),s:n.scale.clone()}));
  for(const name of ['Walking_A','Running_A']){mixer.stopAllAction();const clip=clips[name];if(!clip)throw Error(`Missing ${name}`);const measured=measureClip(THREE,{mixer,clip,space:actor,feet,hips,fwd:new THREE.Vector3(0,0,1),side:new THREE.Vector3(1,0,0)});const qualified=entries(measured,{duration:clip.duration});profiles[name]={clip:name,duration:clip.duration,...measured,entries:qualified,qualification:'Stable plant >=70 ms; wrapped intervals joined; raw measurement retained',qualifiedCadenceSpm:qualified.length/clip.duration*60};for(const x of saved){x.n.position.copy(x.p);x.n.quaternion.copy(x.q);x.n.scale.copy(x.s);}}
  mixer.stopAllAction();scene=new THREE.Scene();scene.background=new THREE.Color(0x242329);scene.add(new THREE.HemisphereLight(0xffffff,0x76655b,2));const light=new THREE.DirectionalLight(0xffe8ce,3);light.position.set(3,5,2);scene.add(light);scene.add(actor);
  const floor=new THREE.Mesh(new THREE.BoxGeometry(4,.06,4),new THREE.MeshStandardMaterial({color:0x789169,roughness:1}));floor.position.y=-.04;scene.add(floor);scene.userData.floor=floor;
  const seam=new THREE.Mesh(new THREE.BoxGeometry(2,.065,4),new THREE.MeshStandardMaterial({color:0x8f7861,roughness:1}));seam.position.set(1,-.04,0);scene.add(seam);seam.visible=false;$('footSurface').addEventListener('change',()=>seam.visible=$('footSurface').value==='seam');
  renderer=new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});renderer.setPixelRatio(Math.min(2,devicePixelRatio));renderer.setSize(640,420);renderer.domElement.setAttribute('aria-label','Source-backed KayKit Mannequin Medium motion preview');$('footCanvas').append(renderer.domElement);
  camera=new THREE.PerspectiveCamera(38,640/420,.01,100);camera.position.set(2.5,1.9,3.5);controls=new OrbitControls(camera,renderer.domElement);controls.target.set(0,.9,0);setMode('idle');
  $('footAudio').disabled=false;status('Isolated source: Mannequin_Medium / Rig_Medium. Audio OFF. Inspect before enabling.');renderMetrics();frame();
  window.KFBFootstepProof={snapshot};
}
async function enableAudio(){host=await window.KFBAudioSite.resume();const sources=await (await fetch(new URL('./sources.json',import.meta.url))).json();audio=await createFootstepAudio({audioContext:host.ctx,destination:host.buses.PLAYER_CRITICAL,rows:sources.rows});lastTime=host.ctx.currentTime;for(const e of root.querySelectorAll('[data-foot-mode],#footJump,#footDemo,#footRecord,#footReset'))e.disabled=false;$('footAudio').disabled=true;status('15 existing files decoded · soft treatment · shared PLAYER_CRITICAL bus');renderMetrics();}
function startRecording(){if(!audio||recording)return;const canvas=renderer.domElement.captureStream(30),stream=new MediaStream([...canvas.getVideoTracks(),...audio.capture.stream.getAudioTracks()]);const chunks=[],mime=MediaRecorder.isTypeSupported('video/webm;codecs=vp8,opus')?'video/webm;codecs=vp8,opus':'video/webm';const rec=new MediaRecorder(stream,{mimeType:mime});recording={rec,started:host.ctx.currentTime,stream};rec.ondataavailable=e=>{if(e.data.size)chunks.push(e.data);};rec.onstop=()=>{const blob=new Blob(chunks,{type:mime});$('footVideo').src=URL.createObjectURL(blob);$('footVideo').hidden=false;const a=$('footClipDownload');a.href=$('footVideo').src;a.download='kfb-footstep-v389.webm';a.hidden=false;status('Audible motion clip ready · existing processed SFX only');for(const t of canvas.getVideoTracks())t.stop();};rec.start(100);$('footRecord').textContent='Stop recording';}
function stopRecording(){if(!recording)return;recording.rec.stop();recording=null;$('footRecord').textContent='Record audible clip';}
function guard(fn){return async()=>{try{await fn();}catch(e){status(`BLOCKED: ${e.message}`);console.error(e);$('footLoad').disabled=false;}};}
$('footLoad').onclick=guard(init);$('footAudio').onclick=guard(enableAudio);for(const b of root.querySelectorAll('[data-foot-mode]'))b.onclick=()=>{demo=null;setMode(b.dataset.footMode);};$('footJump').onclick=startJump;
$('footReset').onclick=()=>{audio.stop();timeline.reset();events.length=0;frameGaps.length=0;setMode('idle');renderMetrics();};
$('footDemo').onclick=()=>{timeline.reset();events.length=0;frameGaps.length=0;demo={start:host.ctx.currentTime,stage:-1};status('24 s fixture: three surfaces, walk/run, idle, seam, support landing');};
$('footRecord').onclick=()=>recording?stopRecording():startRecording();$('footExport').onclick=()=>download(new Blob([JSON.stringify(snapshot(),null,2)],{type:'application/json'}),'kfb-footstep-v389-evidence.json');
document.addEventListener('visibilitychange',()=>{if(document.hidden&&host){audio?.stop();lastTime=null;timeline.previous=null;}});
window.addEventListener('pagehide',()=>audio?.stop());
