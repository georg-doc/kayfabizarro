import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { clone as cloneSkeleton } from 'three/addons/utils/SkeletonUtils.js';

const PIN='29c7500b39d20945f4f8e73fb02fef91a055b02c';
const ROOT='https://raw.githubusercontent.com/georg-doc/kayfabizarro/'+PIN+'/';
const ACTOR='media/3D_Assets/KayKit_Mystery_Series6/6 - December 2023 - Action Figure/character/gltf/ActionFigure.glb';
const MOVEMENT='media/3D_Assets/KayKit_Character_Animations_1.1/Animations/gltf/Rig_Medium/Rig_Medium_MovementBasic.glb';
const CLIPS=['Walking_A','Walking_B','Walking_C','Running_A','Running_B'];
const ROOT_MOTION=/^(root|hips)$/i;
const FOOT_RE=/foot/i;
const FOOT_EXCLUDE=/target|pole|ik/i;
const raw=(p)=>ROOT+p.split('/').map(encodeURIComponent).join('/');

const stage=document.getElementById('stage');
const metricsEl=document.getElementById('metrics');
const rowsEl=document.getElementById('clipRows');
const sourceSel=document.getElementById('sourceClip');
const targetSel=document.getElementById('targetClip');
const previewSel=document.getElementById('previewClip');
const syncFoot=document.getElementById('syncFoot');
const fade=document.getElementById('fade');
const fadeOut=document.getElementById('fadeOut');
const speed=document.getElementById('speed');
const speedOut=document.getElementById('speedOut');
const speedMatch=document.getElementById('speedMatch');
const warp=document.getElementById('warp');
const manualRate=document.getElementById('manualRate');
const manualRateOut=document.getElementById('manualRateOut');

const scene=new THREE.Scene();
scene.background=new THREE.Color(0x182126);
const camera=new THREE.PerspectiveCamera(36,1,.01,100);
camera.position.set(5.2,3.2,7.2);
const renderer=new THREE.WebGLRenderer({antialias:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));
renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.shadowMap.enabled=true;
stage.prepend(renderer.domElement);

scene.add(new THREE.HemisphereLight(0xdce8f2,0x384149,1.45));
const sun=new THREE.DirectionalLight(0xfff0d6,2.2); sun.position.set(4,7,5); sun.castShadow=true; scene.add(sun);
const ground=new THREE.Mesh(new THREE.PlaneGeometry(20,12),new THREE.MeshStandardMaterial({color:0x242d32,roughness:.95}));
ground.rotation.x=-Math.PI/2; ground.receiveShadow=true; scene.add(ground);
const grid=new THREE.GridHelper(20,40,0x6c7c82,0x354147); grid.position.y=.003; scene.add(grid);
const divider=new THREE.Mesh(new THREE.BoxGeometry(.02,.015,7),new THREE.MeshBasicMaterial({color:0x607078}));
divider.position.set(0,.012,0); scene.add(divider);

const controls=new OrbitControls(camera,renderer.domElement);
controls.target.set(0,1.05,0); controls.enableDamping=true; controls.maxPolarAngle=Math.PI*.49;

function resize(){
  const r=stage.getBoundingClientRect();
  renderer.setSize(Math.max(1,r.width),Math.max(1,r.height),false);
  camera.aspect=Math.max(.2,r.width/Math.max(1,r.height));
  camera.updateProjectionMatrix();
}
addEventListener('resize',resize); resize();

function nodeNames(root){const s=new Set();root.traverse(n=>{if(n.name)s.add(n.name)});return s}
function trackInfo(track){try{return THREE.PropertyBinding.parseTrackName(track.name)}catch{return null}}
function controllerOwnedClip(root,clip){
  const names=nodeNames(root),tracks=[];
  for(const source of clip.tracks||[]){
    const p=trackInfo(source);
    if(!p||!p.nodeName||!names.has(p.nodeName))continue;
    if(p.propertyName==='position'&&ROOT_MOTION.test(p.nodeName))continue;
    tracks.push(source.clone());
  }
  return new THREE.AnimationClip(clip.name,clip.duration,tracks,clip.blendMode);
}
function snapshotTransforms(root){
  const rows=[]; root.traverse(n=>rows.push({n,p:n.position.clone(),q:n.quaternion.clone(),s:n.scale.clone()}));
  return()=>{for(const r of rows){r.n.position.copy(r.p);r.n.quaternion.copy(r.q);r.n.scale.copy(r.s)}root.updateMatrixWorld(true)}
}
function findFeet(root){
  const found=[]; root.traverse(n=>{if(n.name&&FOOT_RE.test(n.name)&&!FOOT_EXCLUDE.test(n.name))found.push(n)});
  const left=found.find(n=>/\.l$|left/i.test(n.name))||found.slice().sort((a,b)=>a.position.x-b.position.x)[0];
  const right=found.find(n=>/\.r$|right/i.test(n.name))||found.find(n=>n!==left)||null;
  return {left,right,all:found};
}
function median(values){
  const a=values.filter(Number.isFinite).slice().sort((x,y)=>x-y);
  if(!a.length)return 0;
  const m=Math.floor(a.length/2);return a.length%2?a[m]:(a[m-1]+a[m])/2;
}
function wrap01(v){v%=1;return v<0?v+1:v}
function phaseDistance(a,b){const d=Math.abs(wrap01(a)-wrap01(b));return Math.min(d,1-d)}
function intervals(mask){
  const out=[]; let start=-1;
  for(let i=0;i<mask.length;i++){
    if(mask[i]&&start<0)start=i;
    if((!mask[i]||i===mask.length-1)&&start>=0){
      const end=mask[i]?i:i-1; out.push([start,end]); start=-1;
    }
  }
  return out;
}
function measureClip(root,clip,actorHeight){
  const feet=findFeet(root);
  if(!feet.left||!feet.right)throw new Error('Rig_Medium foot nodes not resolved');
  const restore=snapshotTransforms(root);
  const mixer=new THREE.AnimationMixer(root),action=mixer.clipAction(clip,root);
  const N=240, samples={left:[],right:[]}, inv=new THREE.Matrix4(), world=new THREE.Vector3(), local=new THREE.Vector3();
  try{
    action.reset().play();
    for(let i=0;i<=N;i++){
      const phase=i/N; mixer.setTime(clip.duration*phase); root.updateMatrixWorld(true); inv.copy(root.matrixWorld).invert();
      for(const side of ['left','right']){
        feet[side].getWorldPosition(world); local.copy(world).applyMatrix4(inv);
        samples[side].push({phase,t:clip.duration*phase,x:local.x,y:local.y,z:local.z});
      }
    }
  }finally{
    mixer.stopAllAction(); try{mixer.uncacheClip(clip)}catch{} restore();
  }
  const ranges={x:0,z:0};
  for(const axis of ['x','z']){
    const vals=[...samples.left,...samples.right].map(p=>p[axis]); ranges[axis]=Math.max(...vals)-Math.min(...vals);
  }
  const axis=ranges.z>=ranges.x?'z':'x';
  const sideProfiles={};
  const speedSamples=[];
  for(const side of ['left','right']){
    const pts=samples[side], ys=pts.map(p=>p.y), minY=Math.min(...ys), maxY=Math.max(...ys);
    const threshold=minY+Math.max(actorHeight*.012,(maxY-minY)*.22);
    const mask=pts.map(p=>p.y<=threshold);
    const spans=intervals(mask).filter(([a,b])=>b-a>=2);
    const contacts=spans.map(([a,b])=>{
      let best=a;
      for(let i=a+1;i<=b;i++)if(pts[i].y<pts[best].y)best=i;
      return {phase:pts[best].phase,start:pts[a].phase,end:pts[b].phase,minY:pts[best].y};
    });
    for(let i=1;i<pts.length;i++){
      if(mask[i]&&mask[i-1]){
        const dt=pts[i].t-pts[i-1].t;
        if(dt>1e-6)speedSamples.push(-(pts[i][axis]-pts[i-1][axis])/dt);
      }
    }
    sideProfiles[side]={minY,maxY,threshold,mask,spans,contacts,points:pts};
  }
  let refSpeed=median(speedSamples);
  if(Math.abs(refSpeed)<1e-5)refSpeed=0;
  let maxSlip=0;
  for(const side of ['left','right']){
    const p=sideProfiles[side];
    for(const [a,b] of p.spans){
      const comp=[];
      for(let i=a;i<=b;i++)comp.push(p.points[i][axis]+refSpeed*p.points[i].t);
      if(comp.length>1)maxSlip=Math.max(maxSlip,Math.max(...comp)-Math.min(...comp));
    }
  }
  const planarExcursions=['left','right'].map(side=>{
    const pts=sideProfiles[side].points; let best=0;
    for(let i=0;i<pts.length;i+=4)for(let j=i+4;j<pts.length;j+=4)best=Math.max(best,Math.hypot(pts[i].x-pts[j].x,pts[i].z-pts[j].z));
    return best;
  });
  const footCycle=(planarExcursions[0]+planarExcursions[1])/2;
  return {
    name:clip.name,duration:clip.duration,axis,axisRange:ranges[axis],referenceSpeed:refSpeed,
    referenceSpeedAbs:Math.abs(refSpeed),maxSlip,slipBody:actorHeight?maxSlip/actorHeight:0,footCycle,
    left:{contacts:sideProfiles.left.contacts,planted:sideProfiles.left.spans.map(([a,b])=>[samples.left[a].phase,samples.left[b].phase])},
    right:{contacts:sideProfiles.right.contacts,planted:sideProfiles.right.spans.map(([a,b])=>[samples.right[a].phase,samples.right[b].phase])}
  };
}
function contactPhase(profile,side){
  const list=profile?.[side]?.contacts||[];
  if(!list.length)return 0;
  return list.slice().sort((a,b)=>phaseDistance(a.phase,.25)-phaseDistance(b.phase,.25))[0].phase;
}
function rateFor(profile,desired){
  if(!profile?.referenceSpeedAbs||profile.referenceSpeedAbs<1e-4)return 1;
  return THREE.MathUtils.clamp(desired/profile.referenceSpeedAbs,.45,1.8);
}
function fmt(v,n=2){return Number.isFinite(v)?Number(v).toFixed(n):'—'}
function pct(v){return fmt(wrap01(v)*100,0)+'%'}

const loader=new GLTFLoader();
let profiles={}, clips={}, actorHeight=0, lanes=[], ready=false, error=null;

function normalizeActor(root){
  root.position.set(0,0,0); root.scale.setScalar(1); root.updateMatrixWorld(true);
  const box=new THREE.Box3().setFromObject(root), size=box.getSize(new THREE.Vector3());
  root.position.y-=box.min.y; root.updateMatrixWorld(true);
  return size.y;
}
function makeMarker(color){
  const m=new THREE.Mesh(new THREE.SphereGeometry(.035,14,10),new THREE.MeshBasicMaterial({color}));
  scene.add(m);return m;
}
function makeLane(sourceRoot,x){
  const root=cloneSkeleton(sourceRoot); root.position.x=x; scene.add(root);
  root.traverse(n=>{if(n.isMesh){n.castShadow=true;n.receiveShadow=true}});
  const mixer=new THREE.AnimationMixer(root),feet=findFeet(root);
  return {
    root,mixer,feet,
    markers:{left:makeMarker(0x55c7e8),right:makeMarker(0xe6b35b)},
    current:null,currentName:null
  };
}
function resetLane(lane,name,phase=0,rate=1){
  lane.mixer.stopAllAction();
  const action=lane.mixer.clipAction(clips[name],lane.root);
  action.enabled=true; action.setEffectiveWeight(1); action.setEffectiveTimeScale(rate); action.setLoop(THREE.LoopRepeat,Infinity);
  action.reset(); action.time=clips[name].duration*wrap01(phase); action.play();
  lane.current=action; lane.currentName=name; return action;
}
function transitionLane(lane,from,to,side,mode,fadeSec,doWarp,fromRate,toRate){
  const fromPhase=contactPhase(profiles[from],side);
  const toPhase=mode==='sync'?contactPhase(profiles[to],side):0;
  const source=resetLane(lane,from,fromPhase,fromRate);
  const target=lane.mixer.clipAction(clips[to],lane.root);
  target.enabled=true; target.setEffectiveWeight(1); target.setEffectiveTimeScale(toRate); target.setLoop(THREE.LoopRepeat,Infinity);
  target.reset(); target.time=clips[to].duration*toPhase; target.play();
  source.crossFadeTo(target,fadeSec,doWarp);
  lane.current=target; lane.currentName=to;
  return {fromPhase,toPhase,fromRate,toRate};
}
function updateMarkers(lane){
  for(const side of ['left','right']){
    const foot=lane.feet[side]; if(!foot)continue;
    foot.getWorldPosition(lane.markers[side].position);
  }
}
function fillSelect(el,selected){
  el.innerHTML='';
  for(const name of CLIPS){const o=document.createElement('option');o.value=name;o.textContent=name;el.appendChild(o)}
  el.value=selected;
}
function renderProfiles(){
  rowsEl.innerHTML='';
  for(const name of CLIPS){
    const p=profiles[name],tr=document.createElement('tr');
    const lc=p.left.contacts[0]?.phase??0, rc=p.right.contacts[0]?.phase??0;
    tr.innerHTML='<td>'+name+'</td><td>'+fmt(p.duration,3)+'</td><td>'+p.axis.toUpperCase()+'</td><td>'+pct(lc)+'</td><td>'+pct(rc)+'</td><td>'+fmt(p.referenceSpeedAbs,3)+'</td><td>'+fmt(p.slipBody*100,1)+'% body</td>';
    rowsEl.appendChild(tr);
  }
}
function summary(extra=''){
  const source=profiles[sourceSel.value],target=profiles[targetSel.value],desired=Number(speed.value);
  const sr=speedMatch.checked?rateFor(source,desired):Number(manualRate.value);
  const tr=speedMatch.checked?rateFor(target,desired):Number(manualRate.value);
  metricsEl.textContent=[
    'SOURCE PIN '+PIN.slice(0,12),
    'actor height '+fmt(actorHeight,3),
    '5/5 requested clips loaded + measured',
    '',
    sourceSel.value+' ref '+fmt(source.referenceSpeedAbs,3)+' u/s · rate '+fmt(sr,2),
    targetSel.value+' ref '+fmt(target.referenceSpeedAbs,3)+' u/s · rate '+fmt(tr,2),
    'sync '+syncFoot.value.toUpperCase()+' · fade '+fmt(Number(fade.value),2)+'s · warp '+(warp.checked?'ON':'OFF'),
    '',
    'AUTO METRICS ARE CANDIDATE EVIDENCE',
    'approved playback ranges remain HUMAN/visual OPEN',
    extra
  ].join('\n');
}
function configure(){
  const source=profiles[sourceSel.value],target=profiles[targetSel.value],desired=Number(speed.value);
  const sourceRate=speedMatch.checked?rateFor(source,desired):Number(manualRate.value);
  const targetRate=speedMatch.checked?rateFor(target,desired):Number(manualRate.value);
  return {sourceRate,targetRate,fade:Number(fade.value),side:syncFoot.value,warp:warp.checked};
}
function playSource(){
  if(!ready)return;
  const c=configure(),phase=contactPhase(profiles[sourceSel.value],c.side);
  resetLane(lanes[0],sourceSel.value,phase,c.sourceRate); resetLane(lanes[1],sourceSel.value,phase,c.sourceRate);
  summary('Both lanes reset at source '+c.side+' contact '+pct(phase));
}
function runTransition(){
  if(!ready)return;
  const c=configure(),a=transitionLane(lanes[0],sourceSel.value,targetSel.value,c.side,'naive',c.fade,c.warp,c.sourceRate,c.targetRate);
  const b=transitionLane(lanes[1],sourceSel.value,targetSel.value,c.side,'sync',c.fade,c.warp,c.sourceRate,c.targetRate);
  summary('A target '+pct(a.toPhase)+' · B target '+pct(b.toPhase)+' · source '+pct(a.fromPhase));
}
function preview(){
  if(!ready)return;
  const rate=Number(manualRate.value),name=previewSel.value;
  resetLane(lanes[0],name,0,rate); resetLane(lanes[1],name,.5,rate);
  summary('Preview '+name+' @ '+fmt(rate,2)+'× · lanes offset 50% for gait inspection');
}
function exportProfiles(){
  if(!ready)return;
  const payload={
    schema:'kfb.motion-profile-candidate/0.1',status:'MEASURED_AUTO_CANDIDATE',sourcePin:PIN,
    actor:'ActionFigure · Rig_Medium',clips:Object.fromEntries(CLIPS.map(n=>[n,profiles[n]])),
    humanApproval:{playbackRateRanges:false,transitionFeel:false},
    consumerBoundary:'No movement/physics ownership'
  };
  const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}));
  a.download='kcl-m1-motion-profiles-candidate.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);
}
fade.oninput=()=>{fadeOut.textContent=Number(fade.value).toFixed(2);if(ready)summary()};
speed.oninput=()=>{speedOut.textContent=Number(speed.value).toFixed(2);if(ready)summary()};
manualRate.oninput=()=>{manualRateOut.textContent=Number(manualRate.value).toFixed(2);if(ready&&!speedMatch.checked)summary()};
for(const el of [sourceSel,targetSel,syncFoot,speedMatch,warp])el.onchange=()=>ready&&summary();
document.getElementById('playSource').onclick=playSource;
document.getElementById('transition').onclick=runTransition;
document.getElementById('preview').onclick=preview;
document.getElementById('export').onclick=exportProfiles;

async function boot(){
  try{
    const [bodyGltf,motionGltf]=await Promise.all([loader.loadAsync(raw(ACTOR)),loader.loadAsync(raw(MOVEMENT))]);
    const measurementRoot=cloneSkeleton(bodyGltf.scene);
    actorHeight=normalizeActor(measurementRoot);
    const available=new Map((motionGltf.animations||[]).map(c=>[c.name,c]));
    const missing=CLIPS.filter(n=>!available.has(n)); if(missing.length)throw new Error('Missing clips: '+missing.join(', '));
    for(const name of CLIPS){
      clips[name]=controllerOwnedClip(measurementRoot,available.get(name));
      profiles[name]=measureClip(measurementRoot,clips[name],actorHeight);
    }
    scene.remove(measurementRoot);
    const visualRoot=bodyGltf.scene; normalizeActor(visualRoot);
    lanes=[makeLane(visualRoot,-1.35),makeLane(visualRoot,1.35)];
    fillSelect(sourceSel,'Walking_A'); fillSelect(targetSel,'Running_A'); fillSelect(previewSel,'Walking_A');
    renderProfiles(); ready=true; playSource(); summary('Ready · source actor and animation pack loaded from pinned commit');
    window.__KFB_KCL_M1__.ready=true;
  }catch(e){
    error=String(e?.stack||e);metricsEl.textContent='ERROR\n'+error;metricsEl.className='err';
    window.__KFB_KCL_M1__.error=error;
  }
}
window.__KFB_KCL_M1__={
  version:'0.1-candidate',ready:false,error:null,
  source:{pin:PIN,actor:ACTOR,animation:MOVEMENT},
  snapshot:()=>({
    ready,error,clipNames:CLIPS,profiles,
    config:ready?{source:sourceSel.value,target:targetSel.value,syncFoot:syncFoot.value,fade:Number(fade.value),desiredSpeed:Number(speed.value),speedMatch:speedMatch.checked,warp:warp.checked}:null,
    ownership:{movementPhysics:'consumer',mixer:'bench-only-one-per-lane',registry:'read-only'}
  })
};

const clock=new THREE.Clock();
renderer.setAnimationLoop(()=>{
  const dt=Math.min(.05,clock.getDelta());
  for(const lane of lanes){lane.mixer.update(dt);updateMarkers(lane)}
  controls.update();renderer.render(scene,camera);
});
boot();
