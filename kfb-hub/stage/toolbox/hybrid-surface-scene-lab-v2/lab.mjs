import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {prepareHybridV2Object,setHybridV2Mode,setHybridV2Params,hybridV2Stats} from './hybrid-surface.v2.js';

const V1_RUNTIME_PIN='15f2f1714d62b606033b8624964e481c6d99d59f';
const BRUSH_DONOR_URL='https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@'+V1_RUNTIME_PIN+'/kfb-hub/stage/toolbox/rgb-triplanar-palette-lab/kfb-rgb-triplanar.v1.js';
const {createRgbBrushTexture}=await import(BRUSH_DONOR_URL);

const WORLD_PIN='bc1441eb8ff9a2df0e15e778b44b73f97eb63d76';
const ACTOR_PIN='bdaea0648f27c0f16e0a737bfba237eb54dd4cbb';
const WORLD_BASE='https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@'+WORLD_PIN+'/tools/world_atlas/source/';
const ACTOR_RAW='https://raw.githubusercontent.com/georg-doc/kayfabizarro/'+ACTOR_PIN+'/';
const ACTOR_CDN='https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@'+ACTOR_PIN+'/';
const enc=p=>p.split('/').map(encodeURIComponent).join('/');
const raw=p=>ACTOR_RAW+enc(p);

const CAST_Z=16;
const SOURCES={
  room:{
    kitLab:{path:'tools/world_atlas/source/lib/kit-lab.js',blob:'964d4187665f1786067ff5917de80df5f086fc91',pin:WORLD_PIN},
    recipe:{path:'tools/world_atlas/source/scenes/dungeon-promo.js',blob:'2d2ba81b35d2277553470582ae93b30f6ec197ac',pin:WORLD_PIN,id:'CQ-S1_KAYKIT_DUNGEON_PROMO'},
    pack:'KayKit Dungeon 1.1 FREE'
  },
  actors:{
    legacy:{
      label:'Legacy Orc A · Rig_Legacy',
      path:'media/3D_Assets/KayKit Legacy/Orc Warband - legacy/characters/gltf/character_orcA.gltf',
      blob:'e74b886fa5f88c15cd300899cccf0e344be11ec5c',adapter:'direct',rig:'Rig_Legacy',x:0,
      headProxy:'^character_orcAHead$'
    },
    medium:{
      label:'ActionFigure · Rig_Medium',
      path:'media/3D_Assets/KayKit_Mystery_Series6/6 - December 2023 - Action Figure/character/gltf/ActionFigure.glb',
      blob:'4785276defdb929cb397954eb74b76aecb84486b',adapter:'direct',rig:'Rig_Medium',x:4,
      headProxy:'^ActionFigure_Head_[0-9]+$'
    },
    gothgirl:{
      label:'GothGirl · Rig_Medium',
      path:'media/3D_Assets/KayKit_Mystery_Series6/GothGirl/characters/GothGirl.glb',
      blob:'b56f67e4ddb7db95ff54fef526148a49289f3915',adapter:'direct',rig:'Rig_Medium',x:8,
      headProxy:'^GothGirl_Head$'
    },
    frizzlebob:{
      label:'FrizzleBob · Driver Graft',
      adapter:'graft',rig:'Rig_Medium',x:12,headProxy:'^Driver_Head$',
      module:'tools/KFB-ToolBox/kfb-rigs-embed-v3/frizzlegraft-v1/graft-mount.v1.js',
      moduleBlob:'a84b2c92a00f7764088c4916030327eb04a91c5c',
      contract:'tools/KFB-ToolBox/kfb-rigs-embed-v3/contracts/kfb-pet-graft-driver.v4.json',
      contractBlob:'f202a1c2f1670ab6045176af6621c94041124e76'
    },
    large:{
      label:'Black Knight · Rig_Large',
      path:'media/3D_Assets/KayKit_Mystery_Series6/3 - September 2024 - Black Knight/characters/BlackKnight.glb',
      blob:'ce20440309951a9d85d246b6ff6b0fa399f6c9d8',adapter:'direct',rig:'Rig_Large',x:16,
      headProxy:'^BlackKnight_Head$'
    }
  }
};

const stage=document.getElementById('stage');
const statusEl=document.getElementById('status');
const measureEl=document.getElementById('measurements');

const scene=new THREE.Scene();
scene.background=new THREE.Color(0x242522);
scene.fog=new THREE.Fog(0x242522,32,58);

const camera=new THREE.PerspectiveCamera(31,1,.03,140);
const renderer=new THREE.WebGLRenderer({antialias:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));
renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.shadowMap.enabled=true;
renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.toneMapping=THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure=1.04;
renderer.domElement.className='webgl';
stage.appendChild(renderer.domElement);

const controls=new OrbitControls(camera,renderer.domElement);
controls.enableDamping=true;
controls.maxPolarAngle=Math.PI*.49;
controls.minDistance=3;
controls.maxDistance=65;

scene.add(new THREE.HemisphereLight(0xfff2df,0x3e4042,1.22));
const key=new THREE.DirectionalLight(0xffe3bd,1.85);
key.position.set(12,22,17);
key.castShadow=true;
key.shadow.mapSize.set(2048,2048);
key.shadow.camera.left=-28;key.shadow.camera.right=28;key.shadow.camera.top=28;key.shadow.camera.bottom=-28;
scene.add(key);
const cool=new THREE.DirectionalLight(0xb4c9df,.48);
cool.position.set(-15,8,-10);
scene.add(cool);
for(const [x,z] of [[3,1],[14,2],[1,10]]){
  const p=new THREE.PointLight(0xffa13c,6.8,10,2);
  p.position.set(x,3.0,z);
  scene.add(p);
}

const brush=createRgbBrushTexture(THREE,{seed:0x4b4642,size:256});
brush.canvas.id='hybridV2MaskCanvas';
document.getElementById('maskMount').appendChild(brush.canvas);

const envGroup=new THREE.Group();
envGroup.name='EXACT_DUNGEON_ENVIRONMENT_V2';
scene.add(envGroup);

const actorGroup=new THREE.Group();
actorGroup.name='EXACT_ACTOR_CAST_V2';
scene.add(actorGroup);

const actorLoader=new GLTFLoader();
const prepared={environment:[],actors:[]};
const actorHandles={};
let roomRoot=null,castFloor=null;
let currentLook='hybrid';
let currentView='integrated';
let isolatedActor='legacy';
let strength=.62;
let macroFactor=.72;
let grainStrength=.52;
let roughnessStrength=.58;
let error=null;
let scaleCalibration=null;

function resize(){
  const r=stage.getBoundingClientRect();
  renderer.setSize(Math.max(1,r.width),Math.max(1,r.height),false);
  camera.aspect=Math.max(.2,r.width/Math.max(1,r.height));
  camera.updateProjectionMatrix();
}
addEventListener('resize',resize);
resize();

function median(values){
  const a=[...values].sort((x,y)=>x-y);
  return a.length%2?a[(a.length-1)/2]:(a[a.length/2-1]+a[a.length/2])/2;
}

function boxSize(box){
  const v=box.getSize(new THREE.Vector3());
  return [v.x,v.y,v.z];
}

function headMetricFromSize([x,y,z]){
  return Math.cbrt(Math.max(x,1e-6)*Math.max(y,1e-6)*Math.max(z,1e-6));
}

function measureHeadProxy(root,spec){
  root.updateMatrixWorld(true);
  const re=new RegExp(spec.headProxy,'i');
  const box=new THREE.Box3().makeEmpty();
  const names=[];
  root.traverse(node=>{
    if(!re.test(node.name||''))return;
    names.push(node.name);
    node.updateMatrixWorld(true);
    box.expandByObject(node,true);
  });
  if(!names.length||box.isEmpty())throw new Error(spec.label+' head proxy not found: '+spec.headProxy);
  const size=boxSize(box);
  return {pattern:spec.headProxy,names,size,metric:headMetricFromSize(size)};
}

function measureWhole(root){
  root.updateMatrixWorld(true);
  const box=new THREE.Box3().setFromObject(root,true);
  return {box,size:boxSize(box),height:box.getSize(new THREE.Vector3()).y};
}

function placeScaledActor(handle,targetHeadMetric){
  const {root,spec,headRaw}=handle;
  root.position.set(0,0,0);
  root.scale.setScalar(1);
  root.updateMatrixWorld(true);

  const scaleFactor=targetHeadMetric/headRaw.metric;
  root.scale.setScalar(scaleFactor);
  root.updateMatrixWorld(true);

  const whole=measureWhole(root);
  const center=whole.box.getCenter(new THREE.Vector3());
  root.position.set(spec.x-center.x,-whole.box.min.y,CAST_Z-center.z);
  root.updateMatrixWorld(true);

  const scaledHead=measureHeadProxy(root,spec);
  const finalWhole=measureWhole(root);

  handle.scaleReport={
    scaleFactor,
    headRaw,
    targetHeadMetric,
    headScaled:{...scaledHead},
    rawTotalHeight:handle.rawWhole.height,
    scaledTotalHeight:finalWhole.height
  };
}

function calibrateActorScale(){
  const mediumIds=['medium','gothgirl','frizzlebob'];
  const target=median(mediumIds.map(id=>actorHandles[id].headRaw.metric));
  for(const handle of Object.values(actorHandles))placeScaledActor(handle,target);

  const mediumHeights=mediumIds.map(id=>actorHandles[id].scaleReport.scaledTotalHeight);
  scaleCalibration={
    rule:'median Rig_Medium source-head metric; all cast roots scale to the same head metric',
    metric:'cube-root of exact matched head-mesh bounding-box volume',
    targetHeadMetric:target,
    mediumMedianHeight:median(mediumHeights),
    actors:Object.fromEntries(Object.entries(actorHandles).map(([id,h])=>[id,h.scaleReport]))
  };
}

function prepareActorSurfaces(){
  for(const [id,h] of Object.entries(actorHandles)){
    const sf=h.scaleReport.scaleFactor;
    const prep=prepareHybridV2Object(THREE,h.root,{
      texture:brush.texture,
      projection:'object',
      macroScale:.18*sf*macroFactor,
      grainScale:6.5*sf,
      strength,
      grainStrength,
      roughnessStrength
    });
    h.prep=prep;
    prepared.actors.push(prep);
  }
}

function frameObjects(objects,dir=[1,.58,1],pad=1.28){
  const box=new THREE.Box3().makeEmpty();
  for(const o of objects)if(o?.visible!==false)box.expandByObject(o,true);
  if(box.isEmpty())return;
  const size=box.getSize(new THREE.Vector3());
  const center=box.getCenter(new THREE.Vector3());
  const aspect=Math.max(.25,camera.aspect||1);
  const vfov=THREE.MathUtils.degToRad(camera.fov);
  const hfov=2*Math.atan(Math.tan(vfov/2)*aspect);
  const distV=size.y/(2*Math.tan(vfov/2));
  const distH=size.x/(2*Math.tan(hfov/2));
  const dist=Math.max(distV,distH,size.z*.72)*pad;
  const d=new THREE.Vector3(...dir).normalize();
  camera.position.copy(center).addScaledVector(d,dist);
  camera.near=Math.max(.02,dist/100);
  camera.far=Math.max(140,dist*8);
  camera.updateProjectionMatrix();
  controls.target.copy(center);
  controls.update();
}

function showAllActors(on=true){
  for(const h of Object.values(actorHandles))h.root.visible=on;
}

function setView(view){
  currentView=view;
  if(!roomRoot)return;

  if(view==='room'){
    roomRoot.visible=true;castFloor.visible=false;actorGroup.visible=false;showAllActors(true);
    frameObjects([roomRoot],[1,.62,1],1.18);
  }else if(view==='cast'){
    roomRoot.visible=false;castFloor.visible=true;actorGroup.visible=true;showAllActors(true);
    frameObjects([actorGroup,castFloor],[0,.15,1],1.12);
  }else if(view==='actor'){
    roomRoot.visible=false;castFloor.visible=true;actorGroup.visible=true;
    showAllActors(false);
    const h=actorHandles[isolatedActor];
    if(h)h.root.visible=true;
    frameObjects(h?[h.root,castFloor]:[castFloor],[0,.12,1],1.28);
  }else if(view==='seam'){
    roomRoot.visible=true;castFloor.visible=false;actorGroup.visible=false;showAllActors(true);
    camera.position.set(13.2,4.7,12.0);
    controls.target.set(8.0,1.05,6.5);
    camera.near=.03;camera.far=140;camera.updateProjectionMatrix();controls.update();
  }else{
    roomRoot.visible=true;castFloor.visible=true;actorGroup.visible=true;showAllActors(true);
    frameObjects([roomRoot,actorGroup,castFloor],[1,.58,1],1.20);
  }

  for(const b of document.querySelectorAll('[data-view]'))b.classList.toggle('active',b.dataset.view===view);
  updateStatus();
}

function setIsolatedActor(id){
  if(!actorHandles[id])throw new Error('unknown actor '+id);
  isolatedActor=id;
  document.getElementById('actorSelect').value=id;
  if(currentView==='actor')setView('actor');
}

function setLook(look){
  currentLook=look;
  const on=look==='hybrid';
  for(const p of [...prepared.environment,...prepared.actors])setHybridV2Mode(p,on);
  for(const b of document.querySelectorAll('[data-look]'))b.classList.toggle('active',b.dataset.look===look);
  updateStatus();
}

function updateParams(){
  for(const p of prepared.environment)setHybridV2Params(p,{
    macroScale:.07*macroFactor,
    grainScale:3.2,
    strength,grainStrength,roughnessStrength
  });

  for(const h of Object.values(actorHandles)){
    if(!h.prep)continue;
    const sf=h.scaleReport.scaleFactor;
    setHybridV2Params(h.prep,{
      macroScale:.18*sf*macroFactor,
      grainScale:6.5*sf,
      strength,grainStrength,roughnessStrength
    });
  }
  updateStatus();
}

function groupStats(list){
  const stats=list.map(hybridV2Stats);
  return {
    groups:stats.length,
    meshes:stats.reduce((a,b)=>a+b.meshes,0),
    materials:stats.reduce((a,b)=>a+b.materials,0),
    compiled:stats.reduce((a,b)=>a+b.compiled,0),
    visibleMaterials:stats.reduce((a,b)=>a+b.visibleMaterials,0),
    visibleCompiled:stats.reduce((a,b)=>a+b.visibleCompiled,0),
    decorated:stats.reduce((a,b)=>a+b.decorated,0),
    preserved:stats.reduce((a,b)=>a+b.preserved,0),
    mapsPreserved:stats.reduce((a,b)=>a+b.mapsPreserved,0),
    colorsPreserved:stats.reduce((a,b)=>a+b.colorsPreserved,0),
    roughnessPreserved:stats.reduce((a,b)=>a+b.roughnessPreserved,0),
    metalnessPreserved:stats.reduce((a,b)=>a+b.metalnessPreserved,0),
    textureUuids:[...new Set(stats.flatMap(s=>s.textureUuids))],
    projections:[...new Set(stats.flatMap(s=>s.projections))],
    sourceRoughness:stats.flatMap(s=>s.sourceRoughness),
    hybridBaseRoughness:stats.flatMap(s=>s.hybridBaseRoughness)
  };
}

function roomSourceCount(root){
  let meshes=0,maps=0;
  root.traverse(n=>{
    if(!n.isMesh)return;
    meshes++;
    for(const m of (Array.isArray(n.material)?n.material:[n.material]))if(m?.map)maps++;
  });
  return {meshes,maps};
}

function fmt(v,n=3){return Number.isFinite(v)?v.toFixed(n):'—'}

function updateMeasurements(){
  if(!scaleCalibration)return;
  const rows=Object.entries(actorHandles).map(([id,h])=>{
    const r=h.scaleReport;
    return '<div><b>'+h.spec.label+'</b><span>head '+r.headRaw.size.map(v=>fmt(v,2)).join('×')+
      ' · scale '+fmt(r.scaleFactor,3)+' · height '+fmt(r.scaledTotalHeight,2)+'</span></div>';
  }).join('');
  measureEl.innerHTML='<strong>HEAD-SIZE CALIBRATION</strong>'+rows;
}

function updateStatus(){
  if(!roomRoot)return;
  const e=groupStats(prepared.environment),a=groupStats(prepared.actors);
  const legacy=actorHandles.legacy?.scaleReport?.scaledTotalHeight;
  const med=scaleCalibration?.mediumMedianHeight;
  statusEl.className='';
  statusEl.innerHTML='<strong>'+currentLook.toUpperCase()+' · '+currentView.toUpperCase()+'</strong>'+
    '<br>one texture '+(e.textureUuids[0]||a.textureUuids[0]||'—').slice(0,8)+' · macro + 3D clay grain'+
    '<br>source roughness preserved '+(e.roughnessPreserved+a.roughnessPreserved)+'/'+(e.decorated+a.decorated)+
    '<br>Legacy '+fmt(legacy,2)+' vs Medium median '+fmt(med,2);
}

async function buildEnvironment(){
  const [{buildScene},{scene:recipe}]=await Promise.all([
    import(WORLD_BASE+'lib/kit-lab.js'),
    import(WORLD_BASE+'scenes/dungeon-promo.js')
  ]);

  roomRoot=await buildScene(recipe.placements,(d,n)=>{statusEl.textContent='Loading exact Dungeon '+d+'/'+n+'…'});
  roomRoot.name='WORLD_ATLAS_DUNGEON_PROMO_EXACT_V2';
  roomRoot.userData.recipeId=recipe.id;
  roomRoot.userData.placementCount=recipe.placements.length;
  envGroup.add(roomRoot);

  castFloor=await buildScene([0,4,8,12,16].map(x=>({a:'dungeon:floor_tile_large',p:[x,0,CAST_Z]})));
  castFloor.name='CAST_FLOOR_EXACT_DUNGEON_TILES_V2';
  castFloor.userData.placementCount=5;
  envGroup.add(castFloor);

  prepared.environment.push(
    prepareHybridV2Object(THREE,roomRoot,{
      texture:brush.texture,projection:'world',macroScale:.07*macroFactor,grainScale:3.2,
      strength,grainStrength,roughnessStrength
    }),
    prepareHybridV2Object(THREE,castFloor,{
      texture:brush.texture,projection:'world',macroScale:.07*macroFactor,grainScale:3.2,
      strength,grainStrength,roughnessStrength
    })
  );

  roomRoot.userData.sourceFacts=roomSourceCount(roomRoot);
}

async function loadDirect(id,spec){
  const gltf=await actorLoader.loadAsync(raw(spec.path));
  const root=gltf.scene;
  root.name=spec.label;
  root.position.set(0,0,0);
  root.scale.setScalar(1);
  actorGroup.add(root);
  root.updateMatrixWorld(true);

  const headRaw=measureHeadProxy(root,spec);
  const rawWhole=measureWhole(root);
  actorHandles[id]={id,spec,root,adapter:'direct',headRaw,rawWhole};
  return actorHandles[id];
}

let graftModule=null,graftContract=null;
async function loadFrizzleBob(id,spec){
  if(!graftModule)graftModule=await import(ACTOR_CDN+spec.module);
  if(!graftContract)graftContract=await fetch(ACTOR_CDN+spec.contract).then(r=>{
    if(!r.ok)throw Error('graft contract '+r.status);
    return r.json();
  });

  const holder=new THREE.Group();
  holder.name=spec.label;
  actorGroup.add(holder);

  const pet=graftModule.pickGraftPet(graftContract,'graft-driver');
  const handle=await graftModule.mountGraft({
    THREE,loader:actorLoader,parent:holder,pet,lib:graftContract,camera,
    animation:'host',poseOverClip:false,
    override:{graft:{weapon:{on:false}},pose:{on:false}}
  });

  holder.position.set(0,0,0);
  holder.scale.setScalar(1);
  holder.updateMatrixWorld(true);

  const headRaw=measureHeadProxy(holder,spec);
  const rawWhole=measureWhole(holder);
  actorHandles[id]={
    id,spec,root:holder,adapter:'graft',headRaw,rawWhole,
    update:dt=>handle.update(dt,camera),
    dispose:()=>handle.dispose()
  };
  return actorHandles[id];
}

async function buildActors(){
  for(const [id,spec] of Object.entries(SOURCES.actors)){
    statusEl.textContent='Loading exact actor · '+spec.label+'…';
    if(spec.adapter==='graft')await loadFrizzleBob(id,spec);
    else await loadDirect(id,spec);
  }

  calibrateActorScale();
  prepareActorSurfaces();
  updateMeasurements();

  const select=document.getElementById('actorSelect');
  select.innerHTML=Object.entries(SOURCES.actors).map(([id,s])=>'<option value="'+id+'">'+s.label+'</option>').join('');
  select.value=isolatedActor;
}

function actorSnapshot(){
  return Object.fromEntries(Object.entries(actorHandles).map(([id,h])=>{
    let meshes=0,skinned=0,maps=0;
    h.root.traverse(n=>{
      if(!n.isMesh)return;
      meshes++;
      if(n.isSkinnedMesh)skinned++;
      for(const m of (Array.isArray(n.material)?n.material:[n.material]))if(m?.map)maps++;
    });
    return [id,{
      label:h.spec.label,path:h.spec.path||null,rig:h.spec.rig,adapter:h.adapter,blob:h.spec.blob||null,
      meshes,skinned,maps,
      headProxy:h.spec.headProxy,
      scaleReport:h.scaleReport
    }];
  }));
}

window.__KFB_HYBRID_V2__={
  version:'0.2-candidate',
  build:'KFB-HYBRID-SURFACE-SCENE-02',
  ready:false,error:null,
  sourcePins:{world:WORLD_PIN,actors:ACTOR_PIN,brushDonor:V1_RUNTIME_PIN},
  brushDonorUrl:BRUSH_DONOR_URL,
  sources:SOURCES,
  setLook,setView,setIsolatedActor,
  setStrength:v=>{
    strength=THREE.MathUtils.clamp(Number(v),0,.9);
    document.getElementById('strength').value=String(strength);
    document.getElementById('strengthOut').textContent=strength.toFixed(2);
    updateParams();
  },
  setMacro:v=>{
    macroFactor=THREE.MathUtils.clamp(Number(v),.35,1.3);
    document.getElementById('macro').value=String(macroFactor);
    document.getElementById('macroOut').textContent=macroFactor<.6?'XXL':macroFactor<.85?'XL':'L';
    updateParams();
  },
  setGrain:v=>{
    grainStrength=THREE.MathUtils.clamp(Number(v),0,1);
    document.getElementById('grain').value=String(grainStrength);
    document.getElementById('grainOut').textContent=grainStrength.toFixed(2);
    updateParams();
  },
  snapshot:()=>({
    ready:window.__KFB_HYBRID_V2__.ready,error,
    sourcePins:{world:WORLD_PIN,actors:ACTOR_PIN,brushDonor:V1_RUNTIME_PIN},
    look:currentLook,view:currentView,isolatedActor,
    strength,macroFactor,grainStrength,roughnessStrength,
    sharedTexture:{uuid:brush.texture.uuid,size:brush.size,seed:brush.seed},
    environment:groupStats(prepared.environment),
    actors:groupStats(prepared.actors),
    room:{
      recipeId:roomRoot?.userData.recipeId||null,
      placements:roomRoot?.userData.placementCount||0,
      sourceFacts:roomRoot?.userData.sourceFacts||null,
      kitLab:SOURCES.room.kitLab,recipe:SOURCES.room.recipe
    },
    cast:actorSnapshot(),
    scaleCalibration,
    surfaceContract:{
      textureCount:1,
      macro:'shared RGB brush texture, soft triplanar',
      grain:'procedural 3D FBM; no second texture and no projection seam',
      sourceBaseColorMap:'preserved',
      sourceRoughnessMetalness:'preserved at material base; modulated only in shader',
      staticEnvironmentProjection:'world',
      movingActorProjection:'object'
    },
    ownership:{
      toolbox:'material compatibility candidate',
      worldAtlas:'Dungeon room owner retained',
      residentActorOwners:'retained',
      consumerRuntime:'unchanged',
      physics:'unchanged',
      registry:'read-only'
    }
  })
};

for(const b of document.querySelectorAll('[data-view]'))b.onclick=()=>setView(b.dataset.view);
for(const b of document.querySelectorAll('[data-look]'))b.onclick=()=>setLook(b.dataset.look);
document.getElementById('actorSelect').onchange=e=>setIsolatedActor(e.target.value);
document.getElementById('strength').oninput=e=>{
  strength=Number(e.target.value);
  document.getElementById('strengthOut').textContent=strength.toFixed(2);
  updateParams();
};
document.getElementById('macro').oninput=e=>{
  macroFactor=Number(e.target.value);
  document.getElementById('macroOut').textContent=macroFactor<.6?'XXL':macroFactor<.85?'XL':'L';
  updateParams();
};
document.getElementById('grain').oninput=e=>{
  grainStrength=Number(e.target.value);
  document.getElementById('grainOut').textContent=grainStrength.toFixed(2);
  updateParams();
};

const clock=new THREE.Clock();
renderer.setAnimationLoop(()=>{
  const dt=Math.min(.05,clock.getDelta());
  for(const h of Object.values(actorHandles))h.update?.(dt);
  controls.update();
  renderer.render(scene,camera);
});

try{
  await buildEnvironment();
  await buildActors();
  setView('integrated');
  setLook('hybrid');
  await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
  window.__KFB_HYBRID_V2__.ready=true;
  updateStatus();
}catch(e){
  error=String(e?.stack||e);
  window.__KFB_HYBRID_V2__.error=error;
  statusEl.className='error';
  statusEl.textContent='SOURCE / MEASUREMENT FAILED · '+error;
  console.error(e);
}
