import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import DriverCA2 from './driver-ca2.mjs';
import {TrailFx} from './kfb-fx-trails.mjs';
import {SpriteFx} from './kfb-fx-sprites.mjs';
import {buildAtlas} from './kfb-combat-atlas.mjs';
import {sweptSegmentVsCapsule,insideActiveWindow,AttackLedger,motionEnvelope} from './contact.v1.js';
import {createSkydome} from 'https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@e95f7291cae15f5f0d5f441a5ddd6fecc4e0243c/travel/travel-v16/terrain-v16/skydome-shader.js';

const MODEL_PIN='378b209355b13304e3cff656ec0806ca5b89df28';
const ANIM_PIN='11d7df978c63b9e375707bd8d9431b4c8358cda8';
const AXE_PIN='378b209355b13304e3cff656ec0806ca5b89df28';
const MODEL_PATH='media/3D_Assets/KayKit_Skeletons/characters/gltf/Skeleton_Warrior.glb';
const ANIM_PATH='media/3D_Assets/KayKit_Character_Animations_1.1/Animations/gltf/Rig_Medium/Rig_Medium_CombatMelee.glb';
const AXE_PATH='media/3D_Assets/KayKit_Skeletons/assets/gltf/Skeleton_Axe.gltf';
const AXE_HILT=new THREE.Vector3(0,-0.2508419454097748,0);
const AXE_TIP=new THREE.Vector3(0,1.0012037754058838,0);
const AXE_LATERAL=0.4942930340766907;
const SKELETON_REST_HEIGHT=2.59046;
const ARENA_TARGET_HEIGHT=1.02;
const SKELETON_SCALE=ARENA_TARGET_HEIGHT/SKELETON_REST_HEIGHT;
const RAW='https://raw.githubusercontent.com/georg-doc/kayfabizarro/';
const raw=(pin,path)=>RAW+pin+'/'+path.split('/').map(encodeURIComponent).join('/');
const rootMotion=/^(root|hips)$/i;
const stage=document.getElementById('stage'),statusEl=document.getElementById('status'),factsEl=document.getElementById('facts');
const scene=new THREE.Scene();
const camera=new THREE.PerspectiveCamera(30,1,.02,90);
camera.position.set(0,2.05,8.6);camera.lookAt(0,1.05,0);
const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false});
renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.setPixelRatio(Math.min(devicePixelRatio,2));stage.append(renderer.domElement);
scene.add(new THREE.HemisphereLight(0xf5edda,0x342d2a,2.0));
const key=new THREE.DirectionalLight(0xffefd1,2.35);key.position.set(-3,7,5);scene.add(key);
const fill=new THREE.DirectionalLight(0xaedbd5,.9);fill.position.set(5,3,2);scene.add(fill);
const sky=createSkydome({THREE,nearRadius:17,farRadius:26});scene.add(sky.root);
const baseline=new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-4,0,0),new THREE.Vector3(4,0,0)]),new THREE.LineBasicMaterial({color:0x5e5348,transparent:true,opacity:.55}));scene.add(baseline);
const debug=new THREE.Group();scene.add(debug);
const fxRoot=new THREE.Group();scene.add(fxRoot);
const trails=new TrailFx(THREE,fxRoot,{cap:8,maxPts:36});
const atlas=buildAtlas(THREE,null,128);
const sprites=new SpriteFx(THREE,fxRoot,{atlas:{tex:atlas.texture,cols:atlas.cols,rows:atlas.rows,cells:atlas.cells},cap:24});
const loader=new GLTFLoader();

let skeletonRoot=null,skeletonFigure=null,skeletonMixer=null,skeletonAction=null,axeRoot=null,axeIso=null,handBone=null;
let driver=null,driverHurt=null,attackClip=null,samples=[],markers=null,contactMeasurement=null;
let mode='weapon',running=false,paused=false,slow=.25,previousSegment=null,ledger=null,attackSerial=0,missMode=false,targetBase=null;
let hitEvent=null,damageIntent=0,vfxCount=0,sfxDispatchCount=0,hitReactStartedAt=null;
let sweepLine=null,hurtMesh=null,markerGroup=new THREE.Group();debug.add(markerGroup);
let bladeTrail=null,lastTrailTip=null,error=null,ready=false;

function resize(){const r=stage.getBoundingClientRect();renderer.setSize(Math.max(1,r.width),Math.max(1,r.height),false);camera.aspect=Math.max(.25,r.width/Math.max(1,r.height));camera.updateProjectionMatrix()}addEventListener('resize',resize);resize();
function nodeNames(root){const s=new Set();root.traverse(n=>{if(n.name)s.add(n.name)});return s}
function cleanClip(root,src){
 const names=nodeNames(root),tracks=[];
 for(const tr of src.tracks||[]){let p=null;try{p=THREE.PropertyBinding.parseTrackName(tr.name)}catch{}if(!p?.nodeName||!names.has(p.nodeName))continue;if(p.propertyName==='position'&&rootMotion.test(p.nodeName))continue;tracks.push(tr.clone())}
 return new THREE.AnimationClip(src.name,src.duration,tracks,src.blendMode);
}
function visibleBounds(root){
 const box=new THREE.Box3(),v=new THREE.Vector3();let points=0;root.updateMatrixWorld(true);
 root.traverse(n=>{if(!n.visible||(!n.isMesh&&!n.isSkinnedMesh)||!n.geometry?.attributes?.position)return;const a=n.geometry.attributes.position,step=Math.max(1,Math.floor(a.count/2200));for(let i=0;i<a.count;i+=step){v.fromBufferAttribute(a,i);if(n.isSkinnedMesh&&n.applyBoneTransform)n.applyBoneTransform(i,v);v.applyMatrix4(n.matrixWorld);box.expandByPoint(v);points++}});
 return {box,min:box.min.clone(),max:box.max.clone(),size:box.getSize(new THREE.Vector3()),center:box.getCenter(new THREE.Vector3()),points};
}
function groundRoot(root,measureRoot=root){const b=visibleBounds(measureRoot);root.position.y-=b.min.y;root.updateMatrixWorld(true);return visibleBounds(measureRoot)}
function findRightHand(root){
 const hits=[];root.traverse(n=>{if(n.isBone&&/handslot.?r|hand.?slot.?right/i.test(n.name||''))hits.push(n)});
 return hits[0]||null;
}
function segmentWorld(){skeletonRoot.updateMatrixWorld(true);return{root:axeRoot.localToWorld(AXE_HILT.clone()),tip:axeRoot.localToWorld(AXE_TIP.clone())}}
function vec(v){return{x:v.x,y:v.y,z:v.z}}
function setSkeletonClip(name,loop=false){
 if(!attackClip)return null;skeletonMixer.stopAllAction();const src=name==='Melee_1H_Attack_Chop'?attackClip:null;if(!src)return null;
 const c=cleanClip(skeletonFigure,src),a=skeletonMixer.clipAction(c,skeletonFigure);a.reset();a.enabled=true;a.setEffectiveWeight(1);a.setLoop(loop?THREE.LoopRepeat:THREE.LoopOnce,loop?Infinity:1);a.clampWhenFinished=!loop;a.play();skeletonAction=a;return a;
}
async function loadSkeleton(){
 const g=await loader.loadAsync(raw(MODEL_PIN,MODEL_PATH));skeletonRoot=g.scene;skeletonFigure=g.scene;skeletonRoot.scale.setScalar(SKELETON_SCALE);skeletonRoot.rotation.y=Math.PI/2;skeletonRoot.position.x=-1.35;scene.add(skeletonRoot);groundRoot(skeletonRoot,skeletonFigure);
 const a=await loader.loadAsync(raw(ANIM_PIN,ANIM_PATH));attackClip=(a.animations||[]).find(c=>c.name==='Melee_1H_Attack_Chop');if(!attackClip)throw Error('MISSING_ASSET: Melee_1H_Attack_Chop');
 skeletonMixer=new THREE.AnimationMixer(skeletonFigure);
 const w=await loader.loadAsync(raw(AXE_PIN,AXE_PATH));axeRoot=w.scene;handBone=findRightHand(skeletonFigure);if(!handBone)throw Error('MISSING_ASSET: hands lot right');
 axeRoot.position.set(0,0,0);axeRoot.quaternion.identity();axeRoot.scale.set(1,1,1);handBone.add(axeRoot);
 axeIso=w.scene.clone(true);axeIso.position.set(0,.55,0);axeIso.rotation.set(0,0,0);scene.add(axeIso);
}
async function loadDriver(){
 driver=new DriverCA2();await driver.init({three:THREE,gltfLoader:loader,camera,log:()=>{}});driver.mount(scene);await driver.ready;
 driver.root.rotation.y=-Math.PI/2;driver.root.position.set(0,0,0);groundRoot(driver.root,driver.figure);
 driver.play('Idle');
}
function sampleAttack(){
 const action=setSkeletonClip('Melee_1H_Attack_Chop',false),n=121,out=[];action.paused=true;
 for(let i=0;i<n;i++){const t=attackClip.duration*i/(n-1);skeletonMixer.setTime(t);action.time=t;skeletonRoot.updateMatrixWorld(true);const s=segmentWorld();out.push({time:t,root:vec(s.root),tip:vec(s.tip)})}
 action.paused=false;skeletonMixer.stopAllAction();samples=out;return out;
}
function deriveHurtAndPlaceTarget(){
 driver.play('Idle');driver.mixer.setTime(0);driver.root.position.x=0;driver.root.position.z=0;driver.root.updateMatrixWorld(true);
 let b=visibleBounds(driver.figure),h=b.size.y;
 const hurtRadius=Math.max(.09,Math.min(b.size.x,b.size.z)*.32);
 const axisA=new THREE.Vector3(b.center.x,b.min.y+h*.24,b.center.z),axisB=new THREE.Vector3(b.center.x,b.min.y+h*.76,b.center.z);
 const midY=(axisA.y+axisB.y)/2;
 const env=motionEnvelope(samples,.35);const active=samples.filter(s=>{const p=s.time/attackClip.duration;return p>=env.activeStart&&p<=env.activeEnd});
 let best=null;
 for(const s of active){for(const f of [.5,.65,.8,.92,1]){const p=new THREE.Vector3().lerpVectors(new THREE.Vector3(s.root.x,s.root.y,s.root.z),new THREE.Vector3(s.tip.x,s.tip.y,s.tip.z),f);const score=p.x-Math.abs(p.y-midY)*1.6;if(!best||score>best.score)best={score,p,s}}}
 if(!best)throw Error('no active weapon sample');
 driver.root.position.x+=best.p.x-axisA.x;driver.root.position.z+=best.p.z-axisA.z;driver.root.updateMatrixWorld(true);
 b=visibleBounds(driver.figure);h=b.size.y;
 const a=new THREE.Vector3(b.center.x,b.min.y+h*.24,b.center.z),bb=new THREE.Vector3(b.center.x,b.min.y+h*.76,b.center.z);
 driverHurt={a:vec(a),b:vec(bb),radius:hurtRadius,bounds:b};targetBase=driver.root.position.clone();
 const weaponRadius=AXE_LATERAL*SKELETON_SCALE;
 let first=null;
 for(let i=1;i<samples.length;i++){
   const p=samples[i].time/attackClip.duration;if(p<env.activeStart||p>env.activeEnd)continue;
   const q=sweptSegmentVsCapsule(samples[i-1],samples[i],driverHurt,{weaponRadius,hurtRadius,steps:8});
   if(q.hit){first={...q,normalized:p,index:i};break}
 }
 if(!first)throw Error('measured sweep does not contact measured target capsule');
 const span=Math.max(.001,env.activeEnd-env.activeStart);
 markers={anticipation:Math.max(0,env.activeStart-span*.75),activeStart:env.activeStart,nominalContact:first.normalized,activeEnd:env.activeEnd,recoveryStart:env.activeEnd,recoveryEnd:1,peak:env.peak,peakSpeed:env.peakSpeed};
 contactMeasurement=first;
 return{weaponRadius,hurtRadius,bounds:b};
}
function refreshHurtFromCurrentDriver(){
 driver.root.updateMatrixWorld(true);const b=visibleBounds(driver.figure),h=b.size.y;
 const a=new THREE.Vector3(b.center.x,b.min.y+h*.24,b.center.z),bb=new THREE.Vector3(b.center.x,b.min.y+h*.76,b.center.z);
 driverHurt={a:vec(a),b:vec(bb),radius:driverHurt?.radius||Math.max(.09,Math.min(b.size.x,b.size.z)*.32),bounds:b};
}
function setMiss(on){
 missMode=!!on;if(!targetBase)return snapshot();driver.root.position.copy(targetBase);if(missMode)driver.root.position.z+=2.5;
 refreshHurtFromCurrentDriver();buildDebug();applyDebugVisibility();const b=document.getElementById('miss');if(b){b.classList.toggle('active',missMode);b.textContent=missMode?'Miss offset ON':'Force miss'}renderFacts();return snapshot();
}
function clearDebug(){
 if(sweepLine){sweepLine.removeFromParent();sweepLine.geometry.dispose();sweepLine.material.dispose();sweepLine=null}
 if(hurtMesh){hurtMesh.removeFromParent();hurtMesh.geometry.dispose();hurtMesh.material.dispose();hurtMesh=null}
 markerGroup.clear();
}
function buildDebug(){
 clearDebug();
 const active=samples.filter(s=>insideActiveWindow(s.time/attackClip.duration,[markers.activeStart,markers.activeEnd]));
 sweepLine=new THREE.Line(new THREE.BufferGeometry().setFromPoints(active.map(s=>new THREE.Vector3(s.tip.x,s.tip.y,s.tip.z))),new THREE.LineBasicMaterial({color:0xb8361f,transparent:true,opacity:.78}));debug.add(sweepLine);
 const a=new THREE.Vector3(driverHurt.a.x,driverHurt.a.y,driverHurt.a.z),b=new THREE.Vector3(driverHurt.b.x,driverHurt.b.y,driverHurt.b.z),len=a.distanceTo(b);
 hurtMesh=new THREE.Mesh(new THREE.CapsuleGeometry(driverHurt.radius,len,4,8),new THREE.MeshBasicMaterial({color:0x2f7a72,wireframe:true,transparent:true,opacity:.45}));hurtMesh.position.copy(a).add(b).multiplyScalar(.5);debug.add(hurtMesh);
 for(const [key,p] of [['activeStart',markers.activeStart],['nominalContact',markers.nominalContact],['activeEnd',markers.activeEnd]]){
   const i=Math.max(0,Math.min(samples.length-1,Math.round(p*(samples.length-1)))),pt=new THREE.Vector3(samples[i].tip.x,samples[i].tip.y,samples[i].tip.z);
   const m=new THREE.Mesh(new THREE.SphereGeometry(key==='nominalContact'?.055:.035,12,8),new THREE.MeshBasicMaterial({color:key==='nominalContact'?0xb8361f:0x8a6a16}));m.position.copy(pt);m.userData.marker=key;markerGroup.add(m);
 }
}
function applyDebugVisibility(){markerGroup.visible=document.getElementById('showMarkers').checked;if(hurtMesh)hurtMesh.visible=document.getElementById('showHurt').checked;if(sweepLine)sweepLine.visible=document.getElementById('showSweep').checked}
function viewForMode(){
 if(mode==='weapon'){camera.position.set(2.55,1.3,4.4);camera.lookAt(0,.65,0)}
 else{camera.position.set(0,1.65,7.1);camera.lookAt(0,1.0,0)}
}
function setMode(next){
 if(!['weapon','mount','attack'].includes(next))return;mode=next;running=false;paused=false;hitEvent=null;previousSegment=null;
 axeIso.visible=next==='weapon';skeletonRoot.visible=next!=='weapon';driver.root.visible=next==='attack';debug.visible=next==='attack';
 if(next==='mount'){skeletonMixer.stopAllAction();driver.play('Idle')}
 if(next==='attack'){scrubTo(0)}
 document.querySelectorAll('[data-mode]').forEach(b=>b.classList.toggle('active',b.dataset.mode===next));viewForMode();renderFacts();return snapshot();
}
function resetEventCounters(){hitEvent=null;damageIntent=0;vfxCount=0;sfxDispatchCount=0;hitReactStartedAt=null;ledger=new AttackLedger('ca204-'+(++attackSerial));}
function replay(){
 if(mode!=='attack')setMode('attack');resetEventCounters();driver.play('Idle');driver.mixer.setTime(0);
 const a=setSkeletonClip('Melee_1H_Attack_Chop',false);a.paused=false;skeletonMixer.setTime(0);a.time=0;running=true;paused=false;previousSegment=segmentWorld();
 if(bladeTrail)trails.release(bladeTrail);bladeTrail=trails.start({color:0x1f1a14,width:.06,life:.24});lastTrailTip=null;document.getElementById('scrub').value='0';renderFacts();return snapshot();
}
function scrubTo(p){
 p=Math.max(0,Math.min(1,+p||0));running=false;paused=true;driver.play('Idle');driver.mixer.setTime(0);
 const a=setSkeletonClip('Melee_1H_Attack_Chop',false);a.paused=true;const t=attackClip.duration*p;skeletonMixer.setTime(t);a.time=t;skeletonRoot.updateMatrixWorld(true);document.getElementById('scrub').value=String(p);renderFacts();return snapshot();
}
function confirmHit(q,normalized){
 const event=ledger.confirm('frizzlebob-driver',q,{normalized,damageIntent:1,vfxCue:'melee.hit.kfb-splat',sfxCue:'confirm.hit'});
 if(!event)return;
 hitEvent=event;damageIntent++;vfxCount++;sfxDispatchCount++;hitReactStartedAt=normalized;
 const p=new THREE.Vector3(q.contactPoint.x,q.contactPoint.y,q.contactPoint.z);
 sprites.emit('splat',p,{color:0xb8361f,size:.36,life:.22,grow:.38,op:.95,pop:true,seed:11});
 driver.play('HitReact',{loop:false});
}
function tickAttack(dt){
 if(!running||paused||!skeletonAction)return;
 skeletonMixer.update(dt*slow);driver.update(dt*slow,camera);skeletonRoot.updateMatrixWorld(true);driver.root.updateMatrixWorld(true);
 const normalized=Math.min(1,skeletonAction.time/attackClip.duration),seg=segmentWorld();
 document.getElementById('scrub').value=String(normalized);
 if(insideActiveWindow(normalized,[markers.activeStart,markers.activeEnd])){
   if(bladeTrail&&(!lastTrailTip||lastTrailTip.distanceTo(seg.tip)>.018)){trails.feed(bladeTrail,seg.tip,dt*slow);lastTrailTip=seg.tip.clone()}
   if(previousSegment&&!ledger.consumed('frizzlebob-driver')){
     const q=sweptSegmentVsCapsule({root:vec(previousSegment.root),tip:vec(previousSegment.tip)},{root:vec(seg.root),tip:vec(seg.tip)},driverHurt,{weaponRadius:AXE_LATERAL*SKELETON_SCALE,hurtRadius:driverHurt.radius,steps:4});
     if(q.hit)confirmHit(q,normalized);
   }
 }
 previousSegment=seg;
 if(normalized>=.999){running=false;if(bladeTrail){trails.release(bladeTrail);bladeTrail=null}skeletonMixer.stopAllAction();driver.play('Idle');renderFacts()}
}
function snapshot(){
 return{ready,error,mode,running,paused,slow,source:{modelPin:MODEL_PIN,animationPin:ANIM_PIN,axePin:AXE_PIN,driverRuntimePin:'bdad1806842d733e6217457fe81cd8b6259569e0',skydomePin:'e95f7291cae15f5f0d5f441a5ddd6fecc4e0243c'},
  actor:{skeletonMixer:skeletonMixer?1:0,driverMixer:driver?.mixer?1:0,handBone:handBone?.name||null,weaponLocal:{position:axeRoot?[axeRoot.position.x,axeRoot.position.y,axeRoot.position.z]:null,quaternion:axeRoot?[axeRoot.quaternion.x,axeRoot.quaternion.y,axeRoot.quaternion.z,axeRoot.quaternion.w]:null},skeletonScale:SKELETON_SCALE},
  markers,missMode,targetOffsetZ:missMode?2.5:0,contactMeasurement:contactMeasurement?{normalized:contactMeasurement.normalized,point:contactMeasurement.contactPoint,distance:contactMeasurement.distance}:null,
  hitEvent,counters:{damageIntent,vfx:vfxCount,sfxDispatch:sfxDispatchCount},hitReactStartedAt,
  sfx:{confirmedCue:'confirm.hit',bodyImpactCue:null,acousticAcceptance:'PENDING'},scope:{arenaRuntimeMutated:false,currentPr5PunchMappingPreserved:true,cardBodyRebuilt:false,skydomeDonorReused:true}};
}
function renderFacts(){
 const s=snapshot(),m=s.markers||{};
 statusEl.textContent=error?'ERROR · '+error:(ready?(hitEvent?'CONFIRMED CONTACT · damage/VFX/SFX dispatch = 1':'ready · '+mode):'loading exact sources…');
 factsEl.textContent=[
  'Skeleton Warrior · Rig_Medium · 1 mixer',
  'Axe socket '+(handBone?.name||'…')+' · local transform IDENTITY',
  'clip Melee_1H_Attack_Chop · '+(attackClip?attackClip.duration.toFixed(4):'…')+' s',
  m.activeStart!=null?'active '+m.activeStart.toFixed(4)+' → '+m.activeEnd.toFixed(4)+' · contact '+m.nominalContact.toFixed(4):'markers measuring…',
  driverHurt?'hurt radius '+driverHurt.radius.toFixed(4)+' · weapon radius '+(AXE_LATERAL*SKELETON_SCALE).toFixed(4):'',
  hitEvent?'event melee.hit @ '+hitEvent.normalized.toFixed(4)+' · damage '+damageIntent+' · vfx '+vfxCount+' · sfx '+sfxDispatchCount:'no confirmed hit dispatched',
  'SFX confirm.hit · body/flesh impact role MISSING · acoustic gate pending',
  'Card body: not rebuilt in isolated lab; productive Arena remains owner.'
 ].filter(Boolean).join('\n');
}
async function boot(){
 try{
  await loadSkeleton();await loadDriver();sampleAttack();deriveHurtAndPlaceTarget();buildDebug();applyDebugVisibility();ready=true;
  setMode('weapon');renderFacts();window.__KFB_CA204__.ready=true;
 }catch(e){error=e?.message||String(e);window.__KFB_CA204__.error=error;statusEl.textContent='ERROR · '+error;console.error(e)}
}
document.getElementById('modes').onclick=e=>{const b=e.target.closest('[data-mode]');if(b)setMode(b.dataset.mode)};
document.getElementById('play').onclick=()=>replay();
document.getElementById('pause').onclick=()=>{paused=!paused;document.getElementById('pause').classList.toggle('active',paused);renderFacts()};
document.getElementById('miss').onclick=()=>setMiss(!missMode);
document.getElementById('slow').onclick=()=>{slow=slow===.25?1:.25;document.getElementById('slow').textContent=slow===.25?'Slow ×0.25':'Speed ×1';renderFacts()};
document.getElementById('scrub').oninput=e=>{if(mode!=='attack')setMode('attack');scrubTo(e.target.value)};
for(const id of ['showMarkers','showHurt','showSweep'])document.getElementById(id).onchange=applyDebugVisibility;
window.__KFB_CA204__={ready:false,error:null,snapshot,setMode,replay,scrub:scrubTo,setMiss};
const clock=new THREE.Clock();renderer.setAnimationLoop(()=>{const dt=Math.min(.05,clock.getDelta());tickAttack(dt);trails.step(dt,camera);sprites.step(dt,camera);sky.update?.(dt,{position:camera.position});renderer.render(scene,camera)});
boot();
