import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {assembleLegacy,replaceHead,playClip} from 'https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@44d595bc60259f4a74da7043df13582f1b5ccd89/tools/KFB-ToolBox/legacy-rpg-rigging/lib/legacy-rig-adapter.v1.js';
import {buildLegacyFaceHost,measureLegacyEyeCandidates,setLegacySourceEyeVisibility} from 'https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@44d595bc60259f4a74da7043df13582f1b5ccd89/tools/KFB-ToolBox/legacy-rpg-rigging/lib/legacy-facehost.v1.js';
import {makeLegacyEyeProfile,mountLegacyEyeProfile} from '../lib/legacy-eye-adapter.v1.js';

const $=(q)=>document.querySelector(q);
const loader=new GLTFLoader();
const state={
  catalog:null,seed:null,selectedId:null,sourceSeen:new Set(),profiles:{},
  sourceNode:null,actor:null,headPart:null,faceHost:null,eyes:null,mixer:null,
  scene:null,camera:null,renderer:null,controls:null,clock:new THREE.Clock()
};

const url=(revision,path)=>encodeURI(`https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@${revision}/${path}`);
const sourceUrl=(path)=>url(state.catalog.source.partsRevision,path);
const rigUrl=()=>url(state.catalog.source.rigRevision,state.catalog.source.rigPath);
const actorById=(id)=>state.catalog.actors.find((a)=>a.id===id);
const bodyById=(id)=>state.catalog.bodies[id];

function setLoading(on,text='Loading exact source…'){const el=$('#loading');el.hidden=!on;el.textContent=text;}
function setMode(mode,actor){
  document.documentElement.dataset.legacyEyeMode=mode;
  document.documentElement.dataset.legacyEyeHead=actor?.id||'';
  $('#stageMode').textContent=mode.toUpperCase();
  $('#stageObject').textContent=actor?.label||'—';
}
function updateProgress(){
  const n=Object.keys(state.profiles).length;
  $('#progress').textContent=`${n}/${state.catalog?.headCount||17} mounted`;
}
function renderRoster(){
  const root=$('#headList');
  root.innerHTML=state.catalog.actors.map((a)=>{
    const p=state.profiles[a.id];
    const cls=[a.id===state.selectedId?'active':'',p?'mounted':'',p?.status?.includes('HUMAN_REQUIRED')?'human':''].filter(Boolean).join(' ');
    const status=p?(p.status.includes('HUMAN_REQUIRED')?'HUMAN REQUIRED':'AUTO CANDIDATE'):(state.sourceSeen.has(a.id)?'SOURCE SEEN':'UNREVIEWED');
    return `<button class="legacy-head ${cls}" data-head="${a.id}"><strong>${a.label}</strong><span class="state">${status}</span><small>${a.kind} · host ${a.hostBodyId}</small></button>`;
  }).join('');
}
function renderReport(actor,extra={}){
  const p=state.profiles[actor?.id];
  $('#headTitle').textContent=actor?.label||'—';
  $('#sourcePath').textContent=actor?.sourcePath||'—';
  $('#measurementStatus').textContent=p?.sourceFace?.status||extra.measurement||'—';
  $('#profileStatus').textContent=p?.status||'—';
  $('#cleanupStatus').textContent=extra.cleanup??(p?.sourceFace?.sourceEyeCleanupVisuallyAccepted?'visually accepted':'not visually accepted');
  $('#report').textContent=JSON.stringify(p||extra,null,2);
  renderRoster();updateProgress();
}

function initThree(){
  const host=$('#stage');
  const scene=new THREE.Scene();scene.background=new THREE.Color(0x10100f);
  scene.add(new THREE.HemisphereLight(0xffffff,0x42382d,2.1));
  const key=new THREE.DirectionalLight(0xffffff,2.2);key.position.set(3,5,4);scene.add(key);
  const fill=new THREE.DirectionalLight(0xb9c7ff,1.0);fill.position.set(-4,2,2);scene.add(fill);
  const camera=new THREE.PerspectiveCamera(34,1,.01,100);
  const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.outputColorSpace=THREE.SRGBColorSpace;host.prepend(renderer.domElement);
  const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.enablePan=false;
  state.scene=scene;state.camera=camera;state.renderer=renderer;state.controls=controls;
  const resize=()=>{const r=host.getBoundingClientRect();renderer.setSize(Math.max(1,r.width),Math.max(1,r.height),false);camera.aspect=Math.max(1,r.width)/Math.max(1,r.height);camera.updateProjectionMatrix();};
  new ResizeObserver(resize).observe(host);resize();
  const loop=()=>{requestAnimationFrame(loop);const dt=Math.min(.05,state.clock.getDelta());state.mixer?.update(dt);state.eyes?.update(dt);controls.update();renderer.render(scene,camera);};loop();
}

function clearStage(){
  state.eyes?.dispose?.();state.eyes=null;
  state.faceHost?.dispose?.();state.faceHost=null;
  state.mixer?.stopAllAction?.();state.mixer=null;
  if(state.sourceNode?.parent)state.sourceNode.removeFromParent();state.sourceNode=null;
  if(state.actor?.root?.parent)state.actor.root.removeFromParent();state.actor=null;state.headPart=null;
}
function frame(root){
  root.updateMatrixWorld(true);
  const box=new THREE.Box3().setFromObject(root);if(box.isEmpty())return;
  const size=box.getSize(new THREE.Vector3()),center=box.getCenter(new THREE.Vector3()),r=Math.max(size.x,size.y,size.z)||1;
  state.controls.target.copy(center);state.camera.position.copy(center).add(new THREE.Vector3(0,.18,1).normalize().multiplyScalar(r*2.8));
  state.camera.near=Math.max(.01,r/100);state.camera.far=Math.max(50,r*30);state.camera.updateProjectionMatrix();state.controls.update();
}
function normalizeRoot(root,{scaleTo=2.25}={}){
  root.updateMatrixWorld(true);let box=new THREE.Box3().setFromObject(root);if(box.isEmpty())return;
  const size=box.getSize(new THREE.Vector3()),center=box.getCenter(new THREE.Vector3()),max=Math.max(size.x,size.y,size.z)||1;
  root.position.x-=center.x;root.position.z-=center.z;root.position.y-=box.min.y;
  if(scaleTo){const k=scaleTo/max;root.scale.multiplyScalar(k);}
  root.updateMatrixWorld(true);
}

async function sourceIsolate(id=state.selectedId){
  const actor=actorById(id);if(!actor)throw new Error('unknown Legacy head '+id);
  state.selectedId=id;clearStage();setLoading(true);setMode('loading',actor);renderRoster();
  try{
    const gltf=await loader.loadAsync(sourceUrl(actor.sourcePath));
    const src=gltf.scene.clone(true);src.updateMatrixWorld(true);
    let root=src;
    if(actor.kind==='embedded'){
      const head=src.getObjectByName(actor.sourceNode);if(!head)throw new Error('embedded head node missing: '+actor.sourceNode);
      const world=head.matrixWorld.clone();head.removeFromParent();head.matrixAutoUpdate=false;head.matrix.copy(world);head.matrixWorldNeedsUpdate=true;
      const group=new THREE.Group();group.name='source-isolate:'+actor.id;group.add(head);root=group;
    }
    normalizeRoot(root);state.scene.add(root);state.sourceNode=root;frame(root);
    state.sourceSeen.add(actor.id);setMode('source',actor);
    document.documentElement.dataset.legacyEyeSourceSeen='true';
    renderReport(actor,{sourceIsolation:true,sourcePath:actor.sourcePath,sourceNode:actor.sourceNode||null});
    return {id:actor.id,label:actor.label,sourcePath:actor.sourcePath,kind:actor.kind};
  }catch(err){
    setMode('error',actor);renderReport(actor,{error:err.message});throw err;
  }finally{setLoading(false);}
}

async function mountCandidate(id=state.selectedId){
  const actor=actorById(id);if(!actor)throw new Error('unknown Legacy head '+id);
  if(!state.sourceSeen.has(actor.id))throw new Error('source isolate required before EyeRig mount: '+actor.id);
  state.selectedId=id;clearStage();setLoading(true,'Assembling Rig_Legacy + measuring head…');setMode('assembling',actor);renderRoster();
  try{
    const hostBody=bodyById(actor.hostBodyId);if(!hostBody)throw new Error('host body missing: '+actor.hostBodyId);
    const assembled=await assembleLegacy({THREE,loader,rigUrl:rigUrl(),partsUrl:sourceUrl(hostBody.path),catalogCharacter:hostBody});
    state.actor=assembled;state.scene.add(assembled.root);normalizeRoot(assembled.root,{scaleTo:null});
    let headPart=assembled.parts.Head?.node;
    if(actor.kind==='asset'){
      const repl=await replaceHead({loader,character:assembled,headUrl:sourceUrl(actor.assetPath)});
      headPart=repl.headPart;
    }
    for(const extra of assembled.extras||[])if(extra.bone==='Head')extra.node.visible=false;
    assembled.root.updateMatrixWorld(true);state.headPart=headPart;

    const faceHost=buildLegacyFaceHost({THREE,figure:assembled.root,headBone:assembled.headBone,headPart});
    if(faceHost.status!=='OK')throw new Error(faceHost.reason||'LegacyFaceHost unsupported');
    state.faceHost=faceHost;
    const measurement=measureLegacyEyeCandidates({THREE,headPart,faceHost});
    const profile=makeLegacyEyeProfile({actor,catalog:state.catalog,seed:state.seed,faceHost,measurement});
    profile.evidence.sourceIsolationPassed=true;

    let cleanupCount=0;
    if(measurement.status==='MEASURED_CANDIDATE'){
      cleanupCount=setLegacySourceEyeVisibility(headPart,false);
      profile.sourceFace.runtimeHiddenBlackMaterials=cleanupCount;
    }else{
      profile.sourceFace.runtimeHiddenBlackMaterials=0;
      profile.sourceFace.runtimeCleanupSkipped='measurement not safe enough for automatic source-eye hiding';
    }

    const eyes=mountLegacyEyeProfile({THREE,faceHost,profile});state.eyes=eyes;
    profile.evidence.automatedMountPassed=!!eyes.eyeFrame();
    if(!profile.evidence.automatedMountPassed)throw new Error('EyeRig eyeFrame missing after mount');

    state.mixer=new THREE.AnimationMixer(assembled.root);playClip(assembled,state.mixer,'Idle');
    state.profiles[actor.id]=profile;frame(assembled.root);setMode('mounted',actor);
    document.documentElement.dataset.legacyEyeProfileStatus=profile.status;
    document.documentElement.dataset.legacyEyeMeasurementStatus=measurement.status;
    document.documentElement.dataset.legacyEyeMounted='true';
    renderReport(actor,{cleanup:measurement.status==='MEASURED_CANDIDATE'?('runtime clone hidden materials: '+cleanupCount):'preserved · HUMAN_REQUIRED'});
    return {actorId:actor.id,profile,measurement,eyeReport:eyes.report(),cleanupCount};
  }catch(err){
    document.documentElement.dataset.legacyEyeMounted='false';setMode('error',actor);renderReport(actor,{error:err.message});throw err;
  }finally{setLoading(false);}
}

function select(id){state.selectedId=id;renderRoster();return sourceIsolate(id);}
function nextUnmounted(){return state.catalog.actors.find((a)=>!state.profiles[a.id])||null;}

async function boot(){
  const [catalog,seed]=await Promise.all([
    fetch('../data/rig-legacy-heads.v0.json').then(r=>{if(!r.ok)throw new Error('legacy catalog '+r.status);return r.json();}),
    fetch('../data/rig-legacy-default.v0.json').then(r=>{if(!r.ok)throw new Error('legacy seed '+r.status);return r.json();})
  ]);
  state.catalog=catalog;state.seed=seed;state.selectedId=catalog.actors[0].id;
  initThree();renderRoster();updateProgress();
  $('#headList').onclick=(e)=>{const b=e.target.closest('[data-head]');if(b)select(b.dataset.head).catch(console.error);};
  $('#sourceBtn').onclick=()=>sourceIsolate().catch(console.error);
  $('#mountBtn').onclick=()=>mountCandidate().catch(console.error);
  $('#nextBtn').onclick=()=>{const a=nextUnmounted();if(a)select(a.id).catch(console.error);};
  $('#blinkBtn').onclick=()=>state.eyes?.blinkNow();
  window.__KLR_EYE_BATCH__={
    source:sourceIsolate,
    mount:mountCandidate,
    select,
    profiles:()=>JSON.parse(JSON.stringify(state.profiles)),
    report:()=>({
      rigClass:'Rig_Legacy',
      selectedId:state.selectedId,
      sourceSeen:[...state.sourceSeen],
      mounted:Object.keys(state.profiles),
      profiles:JSON.parse(JSON.stringify(state.profiles)),
      mode:document.documentElement.dataset.legacyEyeMode||null
    })
  };
  $('#bootBadge').textContent='READY';$('#bootBadge').className='badge ok';
  await sourceIsolate(state.selectedId);
}

boot().catch((err)=>{$('#bootBadge').textContent='BOOT FAIL';$('#report').textContent=err.stack||err.message;console.error(err);});
