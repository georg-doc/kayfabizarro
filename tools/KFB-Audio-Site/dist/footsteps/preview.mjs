import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {measureClip} from './vendor/locomotion-profiles.v1.js';
import {entries,ContactTimeline} from './contact-core.mjs';
import {createFootstepAudio} from './audio.mjs?v=0.7.6';
import {makeSoles,measureSoleContacts} from './sole-contacts.mjs?v=0.7.6';
const $=id=>document.getElementById(id);
let host,audio,scene,renderer,camera,controls,actor,mixer,feet,active,profiles={},clips={},mode='idle',figure='Medium',playing=false,lastTime=null,loops=0,epoch=0,jump=null,recording=null,demo=null,initPromise,audioPromise;
const timeline=new ContactTimeline(),events=[],actions=[],frameGaps=[],models={};
let generation=0,soles,origin=0,visualPhase=0;
const avSamples=[];
const outputTime=()=>{if(!host)return 0;const s=host.ctx.getOutputTimestamp?.();return s?.contextTime>0?s.contextTime+(performance.now()-s.performanceTime)/1000:host.ctx.currentTime-(host.ctx.baseLatency||0)-(host.ctx.outputLatency||0);};
const status=s=>$('footStatus').textContent=s;
const log=(action)=>{actions.push({action,time:host?.ctx.currentTime??null,playing,mode,figure,surface:$('footSurface').value,rate:Number($('footTempo').value)});if(actions.length>300)actions.shift();renderMetrics();};
function download(blob,name){const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1500);}
function clean(root,c){const names=new Set();root.traverse(n=>names.add(n.name));return new THREE.AnimationClip(c.name,c.duration,c.tracks.filter(t=>names.has(THREE.PropertyBinding.parseTrackName(t.name).nodeName)).map(t=>t.clone()));}
function setMode(next){
 if(!mixer)return;const name={idle:'Idle_A',walk:'Walking_A',run:'Running_A',air:'Jump_Idle',land:'Jump_Land'}[next],clip=clips[name];if(!clip)throw Error('Missing real clip '+name);
 mixer.stopAllAction();mode=next;loops=0;epoch++;active=mixer.clipAction(clip);active.reset().setEffectiveWeight(1).setEffectiveTimeScale(Number($('footTempo').value)).play();active.setLoop(next==='land'?THREE.LoopOnce:THREE.LoopRepeat,Infinity);active.clampWhenFinished=true;mixer.update(0);
 origin=(host?.ctx.currentTime??0)+.28;visualPhase=0;timeline.previous=0;timeline.owner=name+':'+epoch;lastTime=host?.ctx.currentTime??null;
 if(audio){audio.stop();if(playing)audio.arm();}
 if(next==='idle'&&soles&&scene?.userData.floor)scene.userData.floor.position.y=Math.min(soles.height('l'),soles.height('r'))-.03;
 $('footsteps').dataset.gait=mode;
}
function selectFigure(){
 if(mixer){mixer.stopAllAction();mixer.uncacheRoot(actor);scene.remove(actor);}
 figure=$('footFigure').value;const data=models[figure];actor=data.model.scene;scene.add(actor);mixer=new THREE.AnimationMixer(actor);
 mixer.addEventListener('loop',e=>{if(e.action===active)loops+=e.loopDelta;});
 const bones=[];actor.traverse(n=>{if(n.isBone)bones.push(n);});feet={l:bones.find(n=>/^foot\.?l$/i.test(n.name)),r:bones.find(n=>/^foot\.?r$/i.test(n.name))};const hips=bones.find(n=>/^hips$/i.test(n.name));
 if(!feet.l||!feet.r||!hips)throw Error('Unresolved native foot bones');
 clips={};profiles={};for(const c of [...data.general.animations,...data.movement.animations])clips[c.name]=clean(actor,c);
 const saved=[];actor.traverse(n=>saved.push({n,p:n.position.clone(),q:n.quaternion.clone(),s:n.scale.clone()}));soles=makeSoles(THREE,actor);
 for(const name of ['Walking_A','Running_A']){mixer.stopAllAction();const clip=clips[name],measured=measureSoleContacts(THREE,{mixer,clip,actor,soles});
 profiles[name]={...measured,qualifiedCadenceSpm:measured.entries.length/clip.duration*60};
 for(const x of saved){x.n.position.copy(x.p);x.n.quaternion.copy(x.q);x.n.scale.copy(x.s);}}
 jump=null;timeline.grounded=true;
 $('footJump').disabled=!audio||!clips.Jump_Idle||!clips.Jump_Land;
 $('footJump').textContent=clips.Jump_Idle?'Hop · support landing':'Hop unavailable · native Large source';
 setMode(playing?$('footGait').value:'idle');
 actor.updateMatrixWorld(true);const box=new THREE.Box3().setFromObject(actor),size=box.getSize(new THREE.Vector3()),center=box.getCenter(new THREE.Vector3());
 const distance=Math.max(size.y,size.x)*2.05;controls.target.copy(center);camera.position.copy(center).add(new THREE.Vector3(distance*.6,distance*.2,distance));camera.lookAt(center);controls.update();
}
function cue(c,now){if(!c||!audio)return;const p=feet[c.foot==='r'?'r':'l'].getWorldPosition(new THREE.Vector3());
 const result=audio.play({...c,epoch,renderedAt:null,gait:mode,figure,footPosition:p.toArray(),grounded:timeline.grounded});if(result)events.push(result);if(events.length>3000)events.shift();
 $('footLast').textContent=c.kind+' · '+c.foot+' · '+c.surface;
}
function snapshot(){
 const ds=events.map(e=>e.onsetEstimateErrorMs).sort((a,b)=>a-b),rs=avSamples.map(e=>Math.abs(e.avErrorMs)).sort((a,b)=>a-b);
 const duplicate=events.filter((e,i)=>events.slice(0,i).some(p=>p.key===e.key)).length,rate=Number($('footTempo').value),focus=window.KFBAudioSite?.musicContext.getSnapshot();
 return {revision:'0.7.6-sole-contact-r3',playing,mode,figure,rate,surface:$('footSurface').value,hostContexts:window.KFBAudioSite?.audioContextsCreated,clock:'existing AudioContext output timestamp / native clip sampled from shared origin',bus:'PLAYER_CRITICAL',profiles,decode:audio?.metrics||[],audioState:audio?.state()||null,counts:{events:events.length,steps:events.filter(e=>e.kind==='footstep').length,landings:events.filter(e=>e.kind==='land').length,duplicateKeys:duplicate,suppressed:timeline.suppressed},cadenceStepsPerSecond:profiles[active?.getClip().name]?.qualifiedCadenceSpm/60*rate||0,sourceOnsetEstimateMs:{max:ds.at(-1)||0},renderedSoleToEstimatedOnsetMs:{max:rs.at(-1)||0,p95:rs[Math.floor(rs.length*.95)]||0},avSamples,outputLagMs:host?(host.ctx.currentTime-outputTime())*1000:0,frameGapMsMax:Math.max(0,...frameGaps),musicFocus:focus,events,actions,cues:timeline.packet(),limits:'Soles measured from rendered skinned vertices; source-onset estimate (not an acoustic measurement); device queue compensated via output timestamp. Acoustic speaker latency not independently recorded.'};
}
function renderMetrics(){const s=snapshot();$('footMetrics').textContent=(playing?'Playing':'Stopped')+' · '+figure+' · '+mode+' · '+s.cadenceStepsPerSecond.toFixed(2)+' steps/s · '+s.counts.steps+' steps · '+s.counts.duplicateKeys+' duplicates · '+(s.hostContexts??0)+' AudioContext';$('footDiagnostics').textContent=JSON.stringify(s,null,2);}
function stop(stopMedia=true){playing=false;demo=null;jump=null;if(actor)actor.position.y=0;timeline.previous=null;timeline.grounded=true;audio?.stop();setMode('idle');if(recording)stopRecording();if(stopMedia)for(const media of $('footsteps').querySelectorAll('video,audio'))media.pause();$('footStop').disabled=false;$('footPlay').disabled=false;status('Stopped · live audio and footstep media stopped');renderMetrics();}
function frame(){
 requestAnimationFrame(frame);if(!renderer)return;controls.update();
 const now=host?.ctx.currentTime??0,dt=lastTime==null?0:Math.max(0,now-lastTime);lastTime=host?now:null;
 if(playing&&host&&dt>0){
  frameGaps.push(dt*1000);if(frameGaps.length>2000)frameGaps.shift();
  if(demo){const stage=Math.floor((now-demo.start)/4);if(stage!==demo.stage){demo.stage=stage;
   if(stage>=4){stop();status('16 s proof complete · clip and measurements ready');}
   else {$('footSurface').value=['wood','carpet-wood','foley-carpet','digital-wood'][stage];log('fixture surface');}
  }}
  if(playing){
   if(dt>.1){timeline.previous=null;status('Long frame: stale contacts discarded');}
   const rate=Number($('footTempo').value),visibleTime=outputTime(),duration=active.getClip().duration;
   actor.position.y=0;visualPhase=Math.max(0,(visibleTime-origin)*rate/duration);active.time=(visualPhase%1)*duration;mixer.update(0);actor.updateMatrixWorld(true);
   if(mode==='walk'){actor.position.y=-Math.min(soles.height('l'),soles.height('r'));actor.updateMatrixWorld(true);}
   if(jump){const u=Math.min(1,(now-jump.start)/.9);actor.position.y=4*.65*u*(1-u);
    if(u>=1){actor.position.y=0;cue(timeline.support(true,now,$('footSurface').value),now);jump=null;setMode('land');}
   }
   const futureTime=now+.18,phase=Math.max(0,(futureTime-origin)*rate/duration),points=profiles[active.getClip().name]?.entries||[];
   for(const c of timeline.advance({owner:active.getClip().name+':'+epoch,phase,duration:duration/rate,time:futureTime,points,moving:(mode==='walk'||mode==='run')&&!jump&&dt<=.1,surfaceAt:()=>$('footSurface').value}))cue(c,now);
   for(const e of events){if(e.epoch!==epoch||e.renderedAt!=null||e.time>visibleTime||e.kind!=='footstep')continue;
    e.renderedAt=visibleTime;const p=points.find(p=>p.foot===e.foot),height=soles.height(e.foot);
    const supportY=mode==='walk'?0:p.floorY;avSamples.push({foot:e.foot,figure,mode,contact:e.time,estimatedOnset:e.estimatedOnsetAt,rendered:visibleTime,avErrorMs:(visibleTime-e.estimatedOnsetAt)*1000,soleY:height,floorY:supportY,soleClearance:height-supportY});if(avSamples.length>3000)avSamples.shift();
    $('footLast').textContent='CONTACT '+e.foot.toUpperCase()+' · '+e.surface+' · sole '+((height-supportY)*1000).toFixed(1)+' mm';
   }
   if(points.length)scene.userData.floor.position.y=mode==='walk'?-.03:Math.min(...points.map(p=>p.floorY))-.03;
   if(mode==='land'&&visualPhase>=1)setMode($('footGait').value);
  }
 }
 const colors={sand:0xbca67c,stone:0x92908d,wood:0x957054,'wet-clay':0x927b68};scene.userData.floor.material.color.setHex(colors[$('footSurface').value]);renderer.render(scene,camera);
 if(recording){const {canvas,draw}=recording;draw.drawImage(renderer.domElement,0,0,640,420);draw.fillStyle='#242329';draw.fillRect(0,420,640,60);draw.fillStyle='#f1e7d8';draw.font='16px sans-serif';draw.fillText('R3 · '+figure+' · '+mode+' · '+$('footSurface').value+' · ×'+$('footTempo').value,16,444);draw.fillText($('footMetrics').textContent.slice(0,90),16,468);if(now-recording.started>=30)stopRecording();}
 if(host&&Math.floor(now*4)!==Math.floor((now-dt)*4))renderMetrics();
}
async function init(){
 if(initPromise)return initPromise;
 initPromise=(async()=>{
 status('Loading original KayKit figures and measuring real walk/run contacts…');
 const loader=new GLTFLoader(),base=new URL('./assets/',import.meta.url);
 for(const name of ['Medium','Large']){
 const files=name==='Medium'?['Mannequin_Medium.glb','General.glb','MovementBasic.glb']:['Mannequin_Large.glb','Rig_Large_General.glb','Rig_Large_MovementBasic.glb'];
 const [model,general,movement]=await Promise.all(files.map(f=>loader.loadAsync(new URL(f,base).href)));models[name]={model,general,movement};}
 scene=new THREE.Scene();scene.background=new THREE.Color(0x242329);scene.add(new THREE.HemisphereLight(0xffffff,0x76655b,2));const light=new THREE.DirectionalLight(0xffe8ce,3);light.position.set(3,5,2);scene.add(light);
 const floor=new THREE.Mesh(new THREE.BoxGeometry(4,.06,4),new THREE.MeshStandardMaterial({roughness:1}));floor.position.y=-.04;scene.add(floor);scene.userData.floor=floor;
 renderer=new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});renderer.setPixelRatio(Math.min(2,devicePixelRatio));renderer.setSize(640,420);renderer.domElement.setAttribute('aria-label','Original KayKit figure and contact-driven footsteps');$('footCanvas').append(renderer.domElement);
 camera=new THREE.PerspectiveCamera(38,640/420,.01,100);camera.position.set(2.5,1.9,3.5);controls=new OrbitControls(camera,renderer.domElement);controls.target.set(0,.9,0);
 selectFigure();frame();status('Original '+figure+' figure isolated · silent');renderMetrics();
 })().catch(e=>{initPromise=null;throw e;});return initPromise;
}
async function enableAudio(p){
 host=await(p||window.KFBAudioSite.resume());
 if(!audioPromise)audioPromise=(async()=>{const s=await(await fetch(new URL('./sources.json',import.meta.url))).json(),i=await(await fetch(new URL('./imported-sources.json',import.meta.url))).json();audio=await createFootstepAudio({audioContext:host.ctx,destination:host.buses.PLAYER_CRITICAL,rows:[...s.rows,...s.r2Rows,...i.rows]});})().catch(e=>{audioPromise=null;throw e;});
 await audioPromise;lastTime=host.ctx.currentTime;$('footRecord').disabled=false;$('footJump').disabled=!clips.Jump_Idle||!clips.Jump_Land;
}
function startRecording(){
 if(recording)return;audio.setCaptureDelay(host.ctx.currentTime-outputTime());
 const canvas=document.createElement('canvas');canvas.width=640;canvas.height=480;const draw=canvas.getContext('2d'),video=canvas.captureStream(60),stream=new MediaStream([...video.getVideoTracks(),...audio.capture.stream.getAudioTracks()]),chunks=[];
 const mime=MediaRecorder.isTypeSupported('video/webm;codecs=vp8,opus')?'video/webm;codecs=vp8,opus':'video/webm',rec=new MediaRecorder(stream,{mimeType:mime});
 recording={rec,canvas,draw,started:host.ctx.currentTime};rec.ondataavailable=e=>{if(e.data.size)chunks.push(e.data);};rec.onstop=()=>{const blob=new Blob(chunks,{type:mime}),a=$('footClipDownload');$('footVideo').src=URL.createObjectURL(blob);$('footVideo').hidden=false;a.href=$('footVideo').src;a.download='kfb-footsteps-contact-fix.webm';a.hidden=false;for(const t of video.getTracks())t.stop();status('Audible preview recording ready');};rec.start(100);$('footRecord').textContent='Finish recording';
}
function stopRecording(){if(!recording)return;recording.rec.stop();recording=null;$('footRecord').textContent='Record / finish clip';}
export async function command(action,arg){
 if(action==='stop'){generation++;stop();log('stop');return;}
 if(action==='reset'){generation++;stop();timeline.reset();events.length=0;actions.length=0;frameGaps.length=0;log('reset');return;}
 if(action==='export'){download(new Blob([JSON.stringify(snapshot(),null,2)],{type:'application/json'}),'kfb-footsteps-contact-fix-evidence.json');return;}
 const request=generation;
 if(action==='play'||action==='demo'||action==='creak')$('footStop').disabled=false;
 await init();
 if(request!==generation)return;
 if(action==='inspect'){stop();status('Original '+figure+' source isolated · audio off');}
 if(action==='play'||action==='demo'){
  const video=$('footVideo');if(!video.paused){video.dataset.pauseByLive='1';video.pause();}
  await enableAudio(arg);if(request!==generation)return;playing=true;timeline.reset();setMode($('footGait').value);$('footStop').disabled=false;status('Playing soft, contact-derived steps');
  if(action==='demo'){events.length=0;avSamples.length=0;frameGaps.length=0;$('footGait').value='walk';setMode('walk');demo={start:host.ctx.currentTime,stage:-1};startRecording();}
 }
 if(action==='change'){demo=null;
  if(arg==='footFigure'){audio?.stop();selectFigure();}
  if(arg==='footGait'){audio?.stop();jump=null;actor.position.y=0;timeline.reset();setMode(playing?$('footGait').value:'idle');}
  if(arg==='footTempo'||arg==='footSurface'){audio?.stop();timeline.reset();setMode(playing?$('footGait').value:'idle');}
  status((playing?'Playing':'Ready')+' · '+$('footSurface').value+' · '+figure);
 }
 if(action==='jump'&&playing&&!jump&&clips.Jump_Idle&&clips.Jump_Land){jump={start:host.ctx.currentTime};timeline.support(false,jump.start,$('footSurface').value);setMode('air');}
 if(action==='record'&&audio)recording?stopRecording():startRecording();
 if(action==='creak'){await enableAudio(arg);if(request!==generation)return;audio.arm();const accent=audio.play({kind:'creak',surface:'creak',time:host.ctx.currentTime+.03,key:'manual-creak:'+host.ctx.currentTime});if(accent)events.push(accent);status('Knarren · einzelner Akzent, kein Schritt');}
 log(action+(typeof arg==='string'?':'+arg:''));
}
document.addEventListener('visibilitychange',()=>{if(document.hidden){generation++;stop();renderMetrics();}});
document.addEventListener('click',e=>{const target=e.target.closest('[data-view]');if(target&&target.dataset.view!=='mix'){generation++;stop();}});
window.addEventListener('pagehide',()=>audio?.stop());


// A single live/proof owner, including native media pause/end/seek events.
window.KFBFootstepSession?.dispose?.();window.KFBFootstepSession={dispose(){generation++;stop();audio?.dispose();}};
for(const name of ['play','pause','ended','seeking'])$('footVideo').addEventListener(name,()=>{if(name==='pause'&&$('footVideo').dataset.pauseByLive){delete $('footVideo').dataset.pauseByLive;return;}generation++;stop(false);});
const channel=typeof BroadcastChannel==='function'?new BroadcastChannel('kfb-footstep-owner'):null;
channel?.addEventListener('message',()=>{generation++;stop();});
$('footPlay').addEventListener('click',()=>channel?.postMessage('stop-other-footstep-preview'));

