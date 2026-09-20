import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { clone as cloneSkeleton } from 'three/addons/utils/SkeletonUtils.js';

const PIN='bdaea0648f27c0f16e0a737bfba237eb54dd4cbb';
const RAW='https://raw.githubusercontent.com/georg-doc/kayfabizarro/'+PIN+'/';
const CDN='https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@'+PIN+'/';
const enc=p=>p.split('/').map(encodeURIComponent).join('/');
const raw=p=>RAW+enc(p);

const PATHS={
  medium:{
    general:'media/3D_Assets/KayKit_Character_Animations_1.1/Animations/gltf/Rig_Medium/Rig_Medium_General.glb',
    movement:'media/3D_Assets/KayKit_Character_Animations_1.1/Animations/gltf/Rig_Medium/Rig_Medium_MovementBasic.glb'
  },
  large:{
    general:'media/3D_Assets/KayKit_Character_Animations_1.1/Animations/gltf/Rig_Large/Rig_Large_General.glb',
    movement:'media/3D_Assets/KayKit_Character_Animations_1.1/Animations/gltf/Rig_Large/Rig_Large_MovementBasic.glb'
  }
};

const ACTORS={
  frizzlebob:{
    id:'frizzlebob',label:'FrizzleBob · Driver Graft',rig:'Rig_Medium',family:'medium',adapter:'graft',
    host:'media/3D_Assets/KayKit_Mystery_Series6/2 - August 2023 - Driver/character/gltf/Driver.glb',
    attachment:'Existing graft weapon owner retained; no forced weapon in locomotion proof.'
  },
  gothgirl:{
    id:'gothgirl',label:'GothGirl',rig:'Rig_Medium',family:'medium',adapter:'direct',
    model:'media/3D_Assets/KayKit_Mystery_Series6/GothGirl/characters/GothGirl.glb',
    attachment:'Proposal: GothGirl_Microphone.gltf → handslot.r · source pinned · visual attachment gate open.'
  },
  blackknight:{
    id:'blackknight',label:'Black Knight',rig:'Rig_Large',family:'large',adapter:'direct',
    model:'media/3D_Assets/KayKit_Mystery_Series6/3 - September 2024 - Black Knight/characters/BlackKnight.glb',
    attachment:'Proposal: Sword_Large → handslot.r · Shield_Large → handslot.l · measured shield push 0.55 · visual gate open.'
  }
};

const stage=document.getElementById('stage');
const actorSel=document.getElementById('actor');
const rigPill=document.getElementById('rigPill');
const statusPill=document.getElementById('statusPill');
const sourceFacts=document.getElementById('sourceFacts');
const sourceSel=document.getElementById('sourceClip');
const targetSel=document.getElementById('targetClip');
const syncFoot=document.getElementById('syncFoot');
const fade=document.getElementById('fade');
const fadeOut=document.getElementById('fadeOut');
const desiredSpeed=document.getElementById('desiredSpeed');
const speedOut=document.getElementById('speedOut');
const speedMatch=document.getElementById('speedMatch');
const hysteresis=document.getElementById('hysteresis');
const metrics=document.getElementById('metrics');
const rows=document.getElementById('rows');
const attachment=document.getElementById('attachment');

const scene=new THREE.Scene();
scene.background=new THREE.Color(0x172027);
const camera=new THREE.PerspectiveCamera(34,1,.02,120);
camera.position.set(6,3.2,8);
const renderer=new THREE.WebGLRenderer({antialias:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));
renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.shadowMap.enabled=true;
stage.prepend(renderer.domElement);

scene.add(new THREE.HemisphereLight(0xe2edf4,0x3c4347,1.45));
const sun=new THREE.DirectionalLight(0xffefd4,2.2);sun.position.set(5,8,6);sun.castShadow=true;scene.add(sun);
const ground=new THREE.Mesh(new THREE.PlaneGeometry(30,18),new THREE.MeshStandardMaterial({color:0x252e33,roughness:.96}));
ground.rotation.x=-Math.PI/2;ground.receiveShadow=true;scene.add(ground);
const grid=new THREE.GridHelper(30,60,0x66777d,0x344148);grid.position.y=.003;scene.add(grid);
const divider=new THREE.Mesh(new THREE.BoxGeometry(.018,.012,10),new THREE.MeshBasicMaterial({color:0x607078}));divider.position.y=.01;scene.add(divider);
const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.target.set(0,1.2,0);controls.maxPolarAngle=Math.PI*.49;

function resize(){const r=stage.getBoundingClientRect();renderer.setSize(Math.max(1,r.width),Math.max(1,r.height),false);camera.aspect=Math.max(.2,r.width/Math.max(1,r.height));camera.updateProjectionMatrix()}
addEventListener('resize',resize);resize();

const loader=new GLTFLoader();
const ROOT_MOTION=/^(root|hips)$/i;
const FOOT_RE=/foot/i;
const FOOT_EXCLUDE=/target|pole|ik/i;
let lanes=[],clips={},profiles={},available=[],currentActor=null,currentSemantic='idle',loadToken=0,error=null,sourceReport=null;

function nodeNames(root){const s=new Set();root.traverse(n=>{if(n.name)s.add(n.name)});return s}
function trackInfo(track){try{return THREE.PropertyBinding.parseTrackName(track.name)}catch{return null}}
function cleanClip(root,clip){
  const names=nodeNames(root),tracks=[];
  for(const src of clip.tracks||[]){
    const p=trackInfo(src);
    if(!p||!p.nodeName||!names.has(p.nodeName))continue;
    if(p.propertyName==='position'&&ROOT_MOTION.test(p.nodeName))continue;
    tracks.push(src.clone());
  }
  return new THREE.AnimationClip(clip.name,clip.duration,tracks,clip.blendMode);
}
function snapshotTransforms(root){
  const saved=[];root.traverse(n=>saved.push({n,p:n.position.clone(),q:n.quaternion.clone(),s:n.scale.clone()}));
  return()=>{for(const x of saved){x.n.position.copy(x.p);x.n.quaternion.copy(x.q);x.n.scale.copy(x.s)}root.updateMatrixWorld(true)}
}
function findFeet(root){
  const all=[];root.traverse(n=>{if(n.name&&FOOT_RE.test(n.name)&&!FOOT_EXCLUDE.test(n.name))all.push(n)});
  const left=all.find(n=>/\.l$|left/i.test(n.name))||all.slice().sort((a,b)=>a.position.x-b.position.x)[0]||null;
  const right=all.find(n=>/\.r$|right/i.test(n.name))||all.find(n=>n!==left)||null;
  return{left,right,all};
}
function median(v){const a=v.filter(Number.isFinite).slice().sort((x,y)=>x-y);if(!a.length)return 0;const m=Math.floor(a.length/2);return a.length%2?a[m]:(a[m-1]+a[m])/2}
function wrap01(v){v%=1;return v<0?v+1:v}
function phaseDistance(a,b){const d=Math.abs(wrap01(a)-wrap01(b));return Math.min(d,1-d)}
function intervals(mask){
  const out=[];let start=-1;
  for(let i=0;i<mask.length;i++){
    if(mask[i]&&start<0)start=i;
    if((!mask[i]||i===mask.length-1)&&start>=0){const end=mask[i]?i:i-1;out.push([start,end]);start=-1}
  }
  return out;
}
function measureClip(root,clip,height){
  const feet=findFeet(root);if(!feet.left||!feet.right)throw Error('foot bones unresolved');
  const restore=snapshotTransforms(root),mixer=new THREE.AnimationMixer(root),action=mixer.clipAction(clip,root);
  const N=240,samples={left:[],right:[]},inv=new THREE.Matrix4(),world=new THREE.Vector3(),local=new THREE.Vector3();
  try{
    action.reset().play();
    for(let i=0;i<=N;i++){
      const phase=i/N;mixer.setTime(clip.duration*phase);root.updateMatrixWorld(true);inv.copy(root.matrixWorld).invert();
      for(const side of ['left','right']){
        feet[side].getWorldPosition(world);local.copy(world).applyMatrix4(inv);
        samples[side].push({phase,t:clip.duration*phase,x:local.x,y:local.y,z:local.z});
      }
    }
  }finally{mixer.stopAllAction();try{mixer.uncacheClip(clip)}catch{}restore()}
  const range={x:0,z:0};
  for(const axis of ['x','z']){const vals=[...samples.left,...samples.right].map(p=>p[axis]);range[axis]=Math.max(...vals)-Math.min(...vals)}
  const axis=range.z>=range.x?'z':'x',sideData={},speedSamples=[];
  for(const side of ['left','right']){
    const pts=samples[side],ys=pts.map(p=>p.y),minY=Math.min(...ys),maxY=Math.max(...ys);
    const threshold=minY+Math.max(height*.012,(maxY-minY)*.22);
    const mask=pts.map(p=>p.y<=threshold),spans=intervals(mask).filter(([a,b])=>b-a>=2);
    const contacts=spans.map(([a,b])=>{let best=a;for(let i=a+1;i<=b;i++)if(pts[i].y<pts[best].y)best=i;return{phase:pts[best].phase,start:pts[a].phase,end:pts[b].phase}});
    for(let i=1;i<pts.length;i++)if(mask[i]&&mask[i-1]){const dt=pts[i].t-pts[i-1].t;if(dt>1e-6)speedSamples.push(-(pts[i][axis]-pts[i-1][axis])/dt)}
    sideData[side]={pts,spans,contacts};
  }
  const referenceSpeed=median(speedSamples);
  let maxSlip=0;
  for(const side of ['left','right'])for(const [a,b] of sideData[side].spans){
    const comp=[];for(let i=a;i<=b;i++)comp.push(sideData[side].pts[i][axis]+referenceSpeed*sideData[side].pts[i].t);
    if(comp.length>1)maxSlip=Math.max(maxSlip,Math.max(...comp)-Math.min(...comp));
  }
  return{
    name:clip.name,duration:clip.duration,axis,referenceSpeed,referenceSpeedAbs:Math.abs(referenceSpeed),
    maxSlip,slipBody:height?maxSlip/height:0,
    left:{contacts:sideData.left.contacts,planted:sideData.left.spans.map(([a,b])=>[samples.left[a].phase,samples.left[b].phase])},
    right:{contacts:sideData.right.contacts,planted:sideData.right.spans.map(([a,b])=>[samples.right[a].phase,samples.right[b].phase])}
  };
}
function primaryContact(profile,side){
  const list=profile?.[side]?.contacts||[];if(!list.length)return 0;
  return list.slice().sort((a,b)=>phaseDistance(a.phase,.25)-phaseDistance(b.phase,.25))[0].phase;
}
function rateFor(name){
  if(!speedMatch.checked)return 1;
  const p=profiles[name],d=Number(desiredSpeed.value);
  if(!p?.referenceSpeedAbs||p.referenceSpeedAbs<1e-4)return 1;
  return THREE.MathUtils.clamp(d/p.referenceSpeedAbs,.45,1.8);
}
function makeMarker(color){const m=new THREE.Mesh(new THREE.SphereGeometry(.035,12,8),new THREE.MeshBasicMaterial({color}));scene.add(m);return m}
function laneShell(x){
  const holder=new THREE.Group();holder.position.x=x;scene.add(holder);
  return{holder,figure:null,mixer:null,extra:null,dispose:null,current:null,currentName:null,feet:null,markers:{left:makeMarker(0x55c7e8),right:makeMarker(0xe6b35b)}};
}
function clearLanes(){
  for(const lane of lanes){
    try{lane.mixer?.stopAllAction()}catch{}
    try{lane.dispose?.()}catch{}
    scene.remove(lane.holder,lane.markers.left,lane.markers.right);
  }
  lanes=[];clips={};profiles={};available=[];sourceReport=null;
}
function actorHeight(root){const b=new THREE.Box3().setFromObject(root),s=b.getSize(new THREE.Vector3());return s.y}
function groundHolder(holder){holder.updateMatrixWorld(true);const b=new THREE.Box3().setFromObject(holder);if(Number.isFinite(b.min.y))holder.position.y-=b.min.y;holder.updateMatrixWorld(true)}
function fitCamera(){
  const box=new THREE.Box3();
  for(const lane of lanes)box.expandByObject(lane.holder);
  const size=box.getSize(new THREE.Vector3()),center=box.getCenter(new THREE.Vector3());
  if(!Number.isFinite(size.y)||size.y<=0)return;
  const radius=Math.max(size.x,size.y,size.z)*.72;
  controls.target.copy(center);camera.position.set(center.x+radius*1.15,center.y+radius*.55,center.z+radius*1.7);camera.near=Math.max(.01,radius/100);camera.far=Math.max(100,radius*30);camera.updateProjectionMatrix();controls.update();
}
async function loadLibrary(family){
  const p=PATHS[family];
  const [g,m]=await Promise.all([loader.loadAsync(raw(p.general)),loader.loadAsync(raw(p.movement))]);
  const map=new Map();
  for(const c of [...(g.animations||[]),...(m.animations||[])])if(!map.has(c.name))map.set(c.name,c);
  return{map,general:g.animations?.map(c=>c.name)||[],movement:m.animations?.map(c=>c.name)||[]};
}
async function loadDirectLane(config,x,baseScene=null){
  const lane=laneShell(x);
  const fig=baseScene?cloneSkeleton(baseScene):(await loader.loadAsync(raw(config.model))).scene;
  lane.figure=fig;lane.holder.add(fig);groundHolder(lane.holder);fig.traverse(n=>{if(n.isMesh){n.castShadow=true;n.receiveShadow=true}});
  lane.mixer=new THREE.AnimationMixer(fig);lane.feet=findFeet(fig);lane.dispose=()=>{};
  return lane;
}
let graftModule=null,graftContract=null;
async function ensureGraft(){
  if(!graftModule)graftModule=await import(CDN+'tools/KFB-ToolBox/kfb-rigs-embed-v3/frizzlegraft-v1/graft-mount.v1.js');
  if(!graftContract)graftContract=await fetch(CDN+'tools/KFB-ToolBox/kfb-rigs-embed-v3/contracts/kfb-pet-graft-driver.v4.json').then(r=>{if(!r.ok)throw Error('graft contract '+r.status);return r.json()});
}
async function loadGraftLane(config,x){
  await ensureGraft();
  const lane=laneShell(x),pet=graftModule.pickGraftPet(graftContract,'graft-driver');
  const graft=await graftModule.mountGraft({
    THREE,loader,parent:lane.holder,pet,lib:graftContract,camera,animation:'host',poseOverClip:false,
    override:{graft:{weapon:{on:false}},pose:{on:false}}
  });
  lane.figure=graft.figure;lane.mixer=new THREE.AnimationMixer(graft.figure);lane.extra=(dt)=>graft.update(dt,camera);lane.dispose=()=>graft.dispose();lane.feet=findFeet(graft.figure);
  groundHolder(lane.holder);return lane;
}
function setSelect(el,names,preferred){
  el.innerHTML='';for(const n of names){const o=document.createElement('option');o.value=n;o.textContent=n+(n==='Running_B'?' · HOLD':'');el.appendChild(o)}
  if(names.includes(preferred))el.value=preferred;
}
function status(text,ok=false){statusPill.textContent=text;statusPill.className='pill '+(ok?'ok':'open')}
function fmt(v,n=3){return Number.isFinite(v)?Number(v).toFixed(n):'—'}
function pct(v){return Number.isFinite(v)?Math.round(v*100)+'%':'—'}
function renderMetrics(){
  rows.innerHTML='';
  const names=['Walking_A','Walking_B','Walking_C','Running_A','Running_B'].filter(n=>profiles[n]);
  for(const n of names){
    const p=profiles[n],tr=document.createElement('tr');if(n==='Running_B')tr.className='hold';
    tr.innerHTML='<td>'+n+(n==='Running_B'?' HOLD':'')+'</td><td>'+fmt(p.duration,3)+'</td><td>'+fmt(p.referenceSpeedAbs,3)+'</td><td>'+fmt(p.slipBody*100,1)+'%</td><td>'+pct(primaryContact(p,'left'))+' / '+pct(primaryContact(p,'right'))+'</td>';
    rows.appendChild(tr);
  }
  const walk=profiles.Walking_A,run=profiles.Running_A;
  metrics.textContent=[
    'actor '+currentActor.label,
    'rig '+currentActor.rig,
    'available clips '+available.length,
    'measured locomotion '+names.length,
    '',
    'Walking_A ref '+fmt(walk?.referenceSpeedAbs),
    'Running_A ref '+fmt(run?.referenceSpeedAbs),
    'Running_B '+(profiles.Running_B?'AUTO METRIC · HOLD':'not available'),
    '',
    'numbers are actor-specific candidates',
    'human playback range / speed bands remain OPEN'
  ].join('\n');
}
function renderSourceFacts(lib){
  rigPill.textContent=currentActor.rig;
  sourceFacts.textContent=[
    currentActor.adapter==='graft'?'adapter mountGraft(animation:host)':'adapter direct GLB',
    'General '+lib.general.length+' clips',
    'MovementBasic '+lib.movement.length+' clips',
    currentActor.family==='large'?'Large measured independently · no Medium profile reuse':'Medium family · remeasured on this actor'
  ].join('\n');
  attachment.textContent=currentActor.attachment;
}
function stopLane(lane){lane.mixer.stopAllAction();lane.current=null;lane.currentName=null}
function playLane(lane,name,phase=0,rate=1){
  stopLane(lane);const clip=clips[name];if(!clip)throw Error('clip unavailable '+name);
  const a=lane.mixer.clipAction(clip,lane.figure);a.enabled=true;a.setEffectiveWeight(1);a.setEffectiveTimeScale(rate);a.setLoop(THREE.LoopRepeat,Infinity);a.reset();a.time=clip.duration*wrap01(phase);a.play();lane.current=a;lane.currentName=name;return a;
}
function transitionLane(lane,from,to,mode,side){
  const fadeSec=Number(fade.value),doWarp=document.getElementById('warp').checked;
  const sourcePhase=(profiles[from]&&/Walking|Running/.test(from))?primaryContact(profiles[from],side):0;
  const targetPhase=(mode==='sync'&&profiles[to]&&/Walking|Running/.test(to))?primaryContact(profiles[to],side):0;
  const a=playLane(lane,from,sourcePhase,rateFor(from));
  const b=lane.mixer.clipAction(clips[to],lane.figure);b.enabled=true;b.setEffectiveWeight(1);b.setEffectiveTimeScale(rateFor(to));b.setLoop(THREE.LoopRepeat,Infinity);b.reset();b.time=clips[to].duration*targetPhase;b.play();a.crossFadeTo(b,fadeSec,doWarp);lane.current=b;lane.currentName=to;
  return{sourcePhase,targetPhase,sourceRate:rateFor(from),targetRate:rateFor(to)};
}
function runAB(){
  if(lanes.length!==2)return;
  const from=sourceSel.value,to=targetSel.value,side=syncFoot.value;
  const a=transitionLane(lanes[0],from,to,'naive',side),b=transitionLane(lanes[1],from,to,'sync',side);
  metrics.textContent+='\n\nA target '+pct(a.targetPhase)+' · B target '+pct(b.targetPhase)+' · source '+pct(a.sourcePhase)+'\nrates '+fmt(a.sourceRate,2)+' → '+fmt(a.targetRate,2);
}
function playSource(){
  const n=sourceSel.value,phase=profiles[n]?primaryContact(profiles[n],syncFoot.value):0,rate=rateFor(n);
  for(const lane of lanes)playLane(lane,n,phase,rate);
}
function semanticName(s){
  const candidates=s==='idle'?['Idle_A','Idle_B']:s==='walk'?['Walking_A','Walking_B','Walking_C']:['Running_A'];
  return candidates.find(n=>clips[n])||null;
}
function goSemantic(next){
  const target=semanticName(next);if(!target)return;
  const from=semanticName(currentSemantic)||target;
  if(currentSemantic===next){for(const lane of lanes)playLane(lane,target,0,rateFor(target));return}
  const locomotion=(currentSemantic==='walk'&&next==='run')||(currentSemantic==='run'&&next==='walk');
  for(let i=0;i<lanes.length;i++)transitionLane(lanes[i],from,target,locomotion?(i===0?'naive':'sync'):'naive',syncFoot.value);
  currentSemantic=next;
}
function speedBandProposal(){
  const w=profiles.Walking_A?.referenceSpeedAbs,r=profiles.Running_A?.referenceSpeedAbs,d=Number(desiredSpeed.value);
  if(!w||!r)return'idle';
  const idleExit=w*.25,idleEnter=w*.15,runEnter=(w+r)/2,runExit=runEnter*.82;
  if(!hysteresis.checked)return d<idleExit?'idle':d<runEnter?'walk':'run';
  if(currentSemantic==='idle')return d>idleExit?'walk':'idle';
  if(currentSemantic==='walk'){if(d<idleEnter)return'idle';if(d>runEnter)return'run';return'walk'}
  if(currentSemantic==='run')return d<runExit?'walk':'run';
  return'walk';
}
function updateMarkers(lane){for(const side of ['left','right'])if(lane.feet?.[side])lane.feet[side].getWorldPosition(lane.markers[side].position)}
async function loadActor(id){
  const token=++loadToken;error=null;status('loading');clearLanes();currentActor=ACTORS[id];currentSemantic='idle';attachment.textContent='';sourceFacts.textContent='';metrics.textContent='Loading exact actor + '+currentActor.rig+' libraries…';
  try{
    const lib=await loadLibrary(currentActor.family);if(token!==loadToken)return;
    if(currentActor.adapter==='graft'){
      lanes=[await loadGraftLane(currentActor,-1.55),await loadGraftLane(currentActor,1.55)];
    }else{
      const base=(await loader.loadAsync(raw(currentActor.model))).scene;
      lanes=[await loadDirectLane(currentActor,-1.55,base),await loadDirectLane(currentActor,1.55,base)];
    }
    if(token!==loadToken){clearLanes();return}
    const names=nodeNames(lanes[0].figure);
    available=[...lib.map.keys()].filter(n=>{
      const c=lib.map.get(n);return (c.tracks||[]).some(t=>{const p=trackInfo(t);return p?.nodeName&&names.has(p.nodeName)})
    });
    clips={};
    for(const n of available)clips[n]=cleanClip(lanes[0].figure,lib.map.get(n));
    const h=actorHeight(lanes[0].figure);
    profiles={};
    for(const n of ['Walking_A','Walking_B','Walking_C','Running_A','Running_B'])if(clips[n]){
      try{profiles[n]=measureClip(lanes[0].figure,clips[n],h)}catch(e){console.warn('[measure]',n,e)}
    }
    const options=['Idle_A','Idle_B','Walking_A','Walking_B','Walking_C','Running_A','Running_B'].filter(n=>clips[n]);
    setSelect(sourceSel,options,clips.Walking_A?'Walking_A':options[0]);
    setSelect(targetSel,options,clips.Running_A?'Running_A':options.at(-1));
    renderSourceFacts(lib);renderMetrics();fitCamera();status('ready',true);goSemantic('idle');
    sourceReport={general:lib.general,movement:lib.movement};
    window.__KFB_TOOLBOX_MOTION_LAB__.ready=true;
  }catch(e){
    error=String(e?.stack||e);status('error');metrics.textContent='ERROR\n'+error;window.__KFB_TOOLBOX_MOTION_LAB__.error=error;
  }
}

actorSel.onchange=()=>{window.__KFB_TOOLBOX_MOTION_LAB__.ready=false;loadActor(actorSel.value)};
fade.oninput=()=>fadeOut.textContent=Number(fade.value).toFixed(2);
desiredSpeed.oninput=()=>speedOut.textContent=Number(desiredSpeed.value).toFixed(2);
document.getElementById('transition').onclick=runAB;
document.getElementById('playSource').onclick=playSource;
document.getElementById('applyAuto').onclick=()=>goSemantic(speedBandProposal());
for(const b of document.querySelectorAll('[data-state]'))b.onclick=()=>goSemantic(b.dataset.state);

window.__KFB_TOOLBOX_MOTION_LAB__={
  version:'0.1-candidate',
  ready:false,error:null,
  sourcePin:PIN,
  selectActor:async(id)=>{if(!ACTORS[id])throw Error('unknown actor '+id);actorSel.value=id;window.__KFB_TOOLBOX_MOTION_LAB__.ready=false;await loadActor(id)},
  runAB,
  snapshot:()=>({
    ready:window.__KFB_TOOLBOX_MOTION_LAB__.ready,error,
    actor:currentActor?.id||null,label:currentActor?.label||null,rig:currentActor?.rig||null,adapter:currentActor?.adapter||null,
    available:[...available],profiles:JSON.parse(JSON.stringify(profiles)),sourceReport,
    semantic:currentSemantic,
    transition:{source:sourceSel.value,target:targetSel.value,foot:syncFoot.value,fade:Number(fade.value),warp:document.getElementById('warp').checked,desiredSpeed:Number(desiredSpeed.value),speedMatch:speedMatch.checked,hysteresis:hysteresis.checked},
    ownership:{movementPhysics:'consumer',mixer:'one-per-visual-host',registry:'read-only',face:currentActor?.id==='frizzlebob'?'graft-reader':'external-owner'},
    attachmentProposal:currentActor?.attachment||null
  })
};

const clock=new THREE.Clock();
renderer.setAnimationLoop(()=>{
  const dt=Math.min(.05,clock.getDelta());
  for(const lane of lanes){lane.mixer?.update(dt);lane.extra?.(dt);updateMarkers(lane)}
  controls.update();renderer.render(scene,camera);
});
loadActor('frizzlebob');
