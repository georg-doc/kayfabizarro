import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {measureClip} from './vendor/locomotion-profiles.v1.js';
import {entries,ContactTimeline} from './contact-core.mjs';
import {createFootstepAudio} from './audio.mjs';
const $=id=>document.getElementById(id);
let host,audio,scene,renderer,camera,controls,actor,mixer,feet,active,profiles={},clips={},mode='idle',figure='Medium',playing=false,lastTime=null,loops=0,epoch=0,jump=null,recording=null,demo=null,initPromise,audioPromise;
const timeline=new ContactTimeline(),events=[],actions=[],frameGaps=[],models={};
const status=s=>$('footStatus').textContent=s;
const log=(action)=>{actions.push({action,time:host?.ctx.currentTime??null,playing,mode,figure,surface:$('footSurface').value,rate:Number($('footTempo').value)});if(actions.length>300)actions.shift();renderMetrics();};
function download(blob,name){const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1500);}
function clean(root,c){const names=new Set();root.traverse(n=>names.add(n.name));return new THREE.AnimationClip(c.name,c.duration,c.tracks.filter(t=>{const p=THREE.PropertyBinding.parseTrackName(t.name);return names.has(p.nodeName)&&!(p.propertyName==='position'&&/^(root|hips|root_motion)$/i.test(p.nodeName));}).map(t=>t.clone()));}
function setMode(next){
 if(!mixer)return;const name={idle:'Idle_A',walk:'Walking_A',run:'Running_A',air:'Jump_Idle',land:'Jump_Land'}[next],clip=clips[name];if(!clip)throw Error('Missing real clip '+name);
 mixer.stopAllAction();mode=next;loops=0;epoch++;active=mixer.clipAction(clip);active.reset().setEffectiveWeight(1).setEffectiveTimeScale(Number($('footTempo').value)).play();active.setLoop(next==='land'?THREE.LoopOnce:THREE.LoopRepeat,Infinity);active.clampWhenFinished=true;mixer.update(0);
 timeline.previous=0;timeline.owner=name+':'+epoch;lastTime=host?.ctx.currentTime??null;
 $('footsteps').dataset.gait=mode;
}
function selectFigure(){
 if(mixer){mixer.stopAllAction();mixer.uncacheRoot(actor);scene.remove(actor);}
 figure=$('footFigure').value;const data=models[figure];actor=data.model.scene;scene.add(actor);mixer=new THREE.AnimationMixer(actor);
 mixer.addEventListener('loop',e=>{if(e.action===active)loops+=e.loopDelta;});
 const bones=[];actor.traverse(n=>{if(n.isBone)bones.push(n);});feet={l:bones.find(n=>/^foot\.?l$/i.test(n.name)),r:bones.find(n=>/^foot\.?r$/i.test(n.name))};const hips=bones.find(n=>/^hips$/i.test(n.name));
 if(!feet.l||!feet.r||!hips)throw Error('Unresolved native foot bones');
 clips={};profiles={};for(const c of [...data.general.animations,...data.movement.animations])clips[c.name]=clean(actor,c);
 const saved=[];actor.traverse(n=>saved.push({n,p:n.position.clone(),q:n.quaternion.clone(),s:n.scale.clone()}));
 for(const name of ['Walking_A','Running_A']){mixer.stopAllAction();const clip=clips[name],measured=measureClip(THREE,{mixer,clip,space:actor,feet,hips,fwd:new THREE.Vector3(0,0,1),side:new THREE.Vector3(1,0,0)}),points=entries(measured,{duration:clip.duration});
 profiles[name]={clip:name,duration:clip.duration,...measured,entries:points,qualifiedCadenceSpm:points.length/clip.duration*60};
 for(const x of saved){x.n.position.copy(x.p);x.n.quaternion.copy(x.q);x.n.scale.copy(x.s);}}
 setMode(playing?$('footGait').value:'idle');
 actor.updateMatrixWorld(true);const box=new THREE.Box3().setFromObject(actor),size=box.getSize(new THREE.Vector3()),center=box.getCenter(new THREE.Vector3());
 const distance=Math.max(size.y,size.x)*2.05;controls.target.copy(center);camera.position.copy(center).add(new THREE.Vector3(distance*.6,distance*.2,distance));camera.lookAt(center);controls.update();
}
function cue(c,now){if(!c||!audio)return;const p=feet[c.foot==='r'?'r':'l'].getWorldPosition(new THREE.Vector3());
 const result=audio.play({...c,renderedAt:now,gait:mode,figure,footPosition:p.toArray(),grounded:timeline.grounded});if(result)events.push(result);if(events.length>3000)events.shift();
 $('footLast').textContent=c.kind+' · '+c.foot+' · '+c.surface;
}
function snapshot(){
 const ds=events.map(e=>e.driftMs).sort((a,b)=>a-b),rs=events.map(e=>e.renderToScheduleMs+e.attackMs).sort((a,b)=>a-b);
 const duplicate=events.filter((e,i)=>events.slice(0,i).some(p=>p.key===e.key)).length,rate=Number($('footTempo').value),focus=window.KFBAudioSite?.musicContext.getSnapshot();
 return {revision:'0.7.3-footsteps-r2-v430',playing,mode,figure,rate,surface:$('footSurface').value,hostContexts:window.KFBAudioSite?.audioContextsCreated,clock:'injected AudioContext.currentTime → AnimationMixer action.time + loop count',bus:'PLAYER_CRITICAL',profiles,decode:audio?.metrics||[],counts:{events:events.length,steps:events.filter(e=>e.kind==='footstep').length,landings:events.filter(e=>e.kind==='land').length,duplicateKeys:duplicate,suppressed:timeline.suppressed},cadenceStepsPerSecond:profiles[active?.getClip().name]?.qualifiedCadenceSpm/60*rate||0,contactToScheduleMs:{max:ds.at(-1)||0,p95:ds[Math.floor(ds.length*.95)]||0},visibleContactToAttackEndMs:{max:rs.at(-1)||0,p95:rs[Math.floor(rs.length*.95)]||0},frameGapMsMax:Math.max(0,...frameGaps),musicFocus:focus,events,actions,cues:timeline.packet(),limits:'Visible contact = sampled plant rendered this frame; 10 ms fade-end estimate, not physical speaker/output latency. Synthetic support only. No human acceptance.'};
}
function renderMetrics(){const s=snapshot();$('footMetrics').textContent=(playing?'Playing':'Stopped')+' · '+figure+' · '+mode+' · '+s.cadenceStepsPerSecond.toFixed(2)+' steps/s · '+s.counts.steps+' steps · '+s.counts.duplicateKeys+' duplicates · '+(s.hostContexts??0)+' AudioContext';$('footDiagnostics').textContent=JSON.stringify(s,null,2);}
function stop(){playing=false;demo=null;jump=null;if(actor)actor.position.y=0;timeline.previous=null;timeline.grounded=true;audio?.stop();setMode('idle');if(recording)stopRecording();$('footStop').disabled=true;$('footPlay').disabled=false;status('Stopped · no queued footsteps');renderMetrics();}
function frame(){
 requestAnimationFrame(frame);if(!renderer)return;controls.update();
 const now=host?.ctx.currentTime??0,dt=lastTime==null?0:Math.max(0,now-lastTime);lastTime=host?now:null;
 if(playing&&host&&dt>0){
  frameGaps.push(dt*1000);if(frameGaps.length>2000)frameGaps.shift();
  if(demo){const stage=Math.floor((now-demo.start)/4);if(stage!==demo.stage){demo.stage=stage;
   if(stage>=4){stop();status('16 s proof complete · clip and measurements ready');}
   else {$('footSurface').value=['sand','stone','wood','wet-clay'][stage];log('fixture surface');}
  }}
  if(playing){
   if(dt>.1){timeline.previous=null;status('Long frame: stale contacts discarded');}
   const rate=Number($('footTempo').value);active.setEffectiveTimeScale(rate);mixer.update(dt);actor.updateMatrixWorld(true);
   const duration=active.getClip().duration,phase=loops+active.time/duration;
   if(jump){const u=Math.min(1,(now-jump.start)/.9);actor.position.y=4*.65*u*(1-u);
    if(u>=1){actor.position.y=0;cue(timeline.support(true,now,$('footSurface').value),now);jump=null;setMode('land');}
   }
   for(const c of timeline.advance({owner:active.getClip().name+':'+epoch,phase,duration:duration/rate,time:now,points:profiles[active.getClip().name]?.entries||[],moving:(mode==='walk'||mode==='run')&&!jump&&dt<=.1,surfaceAt:()=>$('footSurface').value}))cue(c,now);
   if(mode==='land'&&active.time>=duration)setMode($('footGait').value);
  }
 }
 const colors={sand:0xbca67c,stone:0x92908d,wood:0x957054,'wet-clay':0x927b68};scene.userData.floor.material.color.setHex(colors[$('footSurface').value]);renderer.render(scene,camera);
 if(recording){const {canvas,draw}=recording;draw.drawImage(renderer.domElement,0,0,640,420);draw.fillStyle='#242329';draw.fillRect(0,420,640,60);draw.fillStyle='#f1e7d8';draw.font='16px sans-serif';draw.fillText('R2 · '+figure+' · '+mode+' · '+$('footSurface').value+' · ×'+$('footTempo').value,16,444);draw.fillText($('footMetrics').textContent.slice(0,90),16,468);}
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
 if(!audioPromise)audioPromise=(async()=>{const s=await(await fetch(new URL('./sources.json',import.meta.url))).json();audio=await createFootstepAudio({audioContext:host.ctx,destination:host.buses.PLAYER_CRITICAL,rows:[...s.rows,...s.r2Rows]});})().catch(e=>{audioPromise=null;throw e;});
 await audioPromise;lastTime=host.ctx.currentTime;$('footRecord').disabled=false;$('footJump').disabled=false;
}
function startRecording(){
 if(recording)return;
 const canvas=document.createElement('canvas');canvas.width=640;canvas.height=480;const draw=canvas.getContext('2d'),video=canvas.captureStream(60),stream=new MediaStream([...video.getVideoTracks(),...audio.capture.stream.getAudioTracks()]),chunks=[];
 const mime=MediaRecorder.isTypeSupported('video/webm;codecs=vp8,opus')?'video/webm;codecs=vp8,opus':'video/webm',rec=new MediaRecorder(stream,{mimeType:mime});
 recording={rec,canvas,draw};rec.ondataavailable=e=>{if(e.data.size)chunks.push(e.data);};rec.onstop=()=>{const blob=new Blob(chunks,{type:mime}),a=$('footClipDownload');$('footVideo').src=URL.createObjectURL(blob);$('footVideo').hidden=false;a.href=$('footVideo').src;a.download='kfb-footsteps-r2.webm';a.hidden=false;for(const t of video.getTracks())t.stop();status('Audible preview recording ready');};rec.start(100);$('footRecord').textContent='Finish recording';
}
function stopRecording(){if(!recording)return;recording.rec.stop();recording=null;$('footRecord').textContent='Record / finish clip';}
export async function command(action,arg){
 if(action==='stop'){stop();log('stop');return;}
 if(action==='reset'){stop();timeline.reset();events.length=0;actions.length=0;frameGaps.length=0;log('reset');return;}
 if(action==='export'){download(new Blob([JSON.stringify(snapshot(),null,2)],{type:'application/json'}),'kfb-footsteps-r2-evidence.json');return;}
 await init();
 if(action==='inspect'){stop();status('Original '+figure+' source isolated · audio off');}
 if(action==='play'||action==='demo'){
  await enableAudio(arg);playing=true;timeline.reset();setMode($('footGait').value);$('footStop').disabled=false;status('Playing soft, contact-derived steps');
  if(action==='demo'){events.length=0;frameGaps.length=0;$('footGait').value='walk';setMode('walk');demo={start:host.ctx.currentTime,stage:-1};startRecording();}
 }
 if(action==='change'){demo=null;
  if(arg==='footFigure'){audio?.stop();selectFigure();}
  if(arg==='footGait'){audio?.stop();jump=null;actor.position.y=0;timeline.reset();setMode(playing?$('footGait').value:'idle');}
  if(arg==='footTempo'){timeline.previous=null;lastTime=host?.ctx.currentTime??null;}
  status((playing?'Playing':'Ready')+' · '+$('footSurface').value+' · '+figure);
 }
 if(action==='jump'&&playing&&!jump){jump={start:host.ctx.currentTime};timeline.support(false,jump.start,$('footSurface').value);setMode('air');}
 if(action==='record'&&audio)recording?stopRecording():startRecording();
 log(action+(typeof arg==='string'?':'+arg:''));
}
document.addEventListener('visibilitychange',()=>{if(document.hidden){stop();renderMetrics();}});
window.addEventListener('pagehide',()=>audio?.stop());

