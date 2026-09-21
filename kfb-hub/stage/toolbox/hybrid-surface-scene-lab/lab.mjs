import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {createRgbBrushTexture} from '../rgb-triplanar-palette-lab/kfb-rgb-triplanar.v1.js';
import {prepareHybridObject,setHybridMode,setHybridParams,hybridStats} from './hybrid-surface.v1.js';

const WORLD_PIN='bc1441eb8ff9a2df0e15e778b44b73f97eb63d76';
const ACTOR_PIN='bdaea0648f27c0f16e0a737bfba237eb54dd4cbb';
const WORLD_BASE='https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@'+WORLD_PIN+'/tools/world_atlas/source/';
const ACTOR_RAW='https://raw.githubusercontent.com/georg-doc/kayfabizarro/'+ACTOR_PIN+'/';
const ACTOR_CDN='https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@'+ACTOR_PIN+'/';
const enc=p=>p.split('/').map(encodeURIComponent).join('/');
const raw=p=>ACTOR_RAW+enc(p);

const SOURCES={
  room:{
    kitLab:{path:'tools/world_atlas/source/lib/kit-lab.js',blob:'964d4187665f1786067ff5917de80df5f086fc91',pin:WORLD_PIN},
    recipe:{path:'tools/world_atlas/source/scenes/dungeon-promo.js',blob:'2d2ba81b35d2277553470582ae93b30f6ec197ac',pin:WORLD_PIN,id:'CQ-S1_KAYKIT_DUNGEON_PROMO'},
    pack:'KayKit Dungeon 1.1 FREE'
  },
  actors:{
    legacy:{label:'Legacy Orc A · Rig_Legacy',path:'media/3D_Assets/KayKit Legacy/Orc Warband - legacy/characters/gltf/character_orcA.gltf',blob:'e74b886fa5f88c15cd300899cccf0e344be11ec5c',adapter:'direct',rig:'Rig_Legacy',height:2.18,x:0},
    medium:{label:'ActionFigure · Rig_Medium',path:'media/3D_Assets/KayKit_Mystery_Series6/6 - December 2023 - Action Figure/character/gltf/ActionFigure.glb',blob:'4785276defdb929cb397954eb74b76aecb84486b',adapter:'direct',rig:'Rig_Medium',height:2.25,x:4},
    gothgirl:{label:'GothGirl · Rig_Medium',path:'media/3D_Assets/KayKit_Mystery_Series6/GothGirl/characters/GothGirl.glb',blob:'b56f67e4ddb7db95ff54fef526148a49289f3915',adapter:'direct',rig:'Rig_Medium',height:2.23,x:8},
    frizzlebob:{label:'FrizzleBob · Driver Graft',adapter:'graft',rig:'Rig_Medium',height:2.23,x:12,module:'tools/KFB-ToolBox/kfb-rigs-embed-v3/frizzlegraft-v1/graft-mount.v1.js',moduleBlob:'a84b2c92a00f7764088c4916030327eb04a91c5c',contract:'tools/KFB-ToolBox/kfb-rigs-embed-v3/contracts/kfb-pet-graft-driver.v4.json',contractBlob:'f202a1c2f1670ab6045176af6621c94041124e76'},
    large:{label:'Black Knight · Rig_Large',path:'media/3D_Assets/KayKit_Mystery_Series6/3 - September 2024 - Black Knight/characters/BlackKnight.glb',blob:'ce20440309951a9d85d246b6ff6b0fa399f6c9d8',adapter:'direct',rig:'Rig_Large',height:3.15,x:16}
  }
};

const stage=document.getElementById('stage'),statusEl=document.getElementById('status');
const scene=new THREE.Scene();scene.background=new THREE.Color(0x222321);scene.fog=new THREE.Fog(0x222321,31,54);
const camera=new THREE.PerspectiveCamera(31,1,.03,120);
const renderer=new THREE.WebGLRenderer({antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;renderer.domElement.className='webgl';stage.appendChild(renderer.domElement);
const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.maxPolarAngle=Math.PI*.49;controls.minDistance=8;controls.maxDistance=55;

scene.add(new THREE.HemisphereLight(0xfff3df,0x413e45,1.28));
const key=new THREE.DirectionalLight(0xffe1b5,2.0);key.position.set(12,22,17);key.castShadow=true;key.shadow.mapSize.set(2048,2048);key.shadow.camera.left=-28;key.shadow.camera.right=28;key.shadow.camera.top=28;key.shadow.camera.bottom=-28;scene.add(key);
const cool=new THREE.DirectionalLight(0xaec8e8,.55);cool.position.set(-15,8,-10);scene.add(cool);
for(const [x,z] of [[3,1],[14,2],[1,10]]){const p=new THREE.PointLight(0xffa13c,8,10,2);p.position.set(x,3.0,z);scene.add(p)}

const brush=createRgbBrushTexture(THREE,{seed:0x4b4642,size:256});
brush.canvas.id='hybridMaskCanvas';document.getElementById('maskMount').appendChild(brush.canvas);

const envGroup=new THREE.Group();envGroup.name='EXACT_DUNGEON_ENVIRONMENT';scene.add(envGroup);
const actorGroup=new THREE.Group();actorGroup.name='EXACT_ACTOR_CAST';scene.add(actorGroup);
const actorLoader=new GLTFLoader();
const prepared={environment:[],actors:[]};
const actorHandles={};
let roomRoot=null,castFloor=null,currentLook='hybrid',currentView='integrated',strength=.34,scaleMul=.70,error=null;

function resize(){const r=stage.getBoundingClientRect();renderer.setSize(Math.max(1,r.width),Math.max(1,r.height),false);camera.aspect=Math.max(.2,r.width/Math.max(1,r.height));camera.updateProjectionMatrix()}
addEventListener('resize',resize);resize();

function groundAndScale(root,targetHeight,x,z){
  root.scale.setScalar(1);root.position.set(0,0,0);root.updateMatrixWorld(true);
  let box=new THREE.Box3().setFromObject(root),size=box.getSize(new THREE.Vector3());
  const s=targetHeight/Math.max(size.y,.001);root.scale.setScalar(s);root.updateMatrixWorld(true);
  box=new THREE.Box3().setFromObject(root);const center=box.getCenter(new THREE.Vector3());
  root.position.set(x-center.x,-box.min.y,z-center.z);root.updateMatrixWorld(true);
  return{s,height:box.getSize(new THREE.Vector3()).y};
}

function setView(view){
  currentView=view;
  if(view==='room'){
    roomRoot.visible=true;castFloor.visible=false;actorGroup.visible=false;
    camera.position.set(25,16,25);controls.target.set(8,2.1,6.1);
  }else if(view==='cast'){
    roomRoot.visible=false;castFloor.visible=true;actorGroup.visible=true;
    camera.position.set(8,6.2,27);controls.target.set(8,1.35,16);
  }else{
    roomRoot.visible=true;castFloor.visible=true;actorGroup.visible=true;
    camera.position.set(26,15.5,33);controls.target.set(8,2.2,7.5);
  }
  controls.update();
  for(const b of document.querySelectorAll('[data-view]'))b.classList.toggle('active',b.dataset.view===view);
}
function setLook(look){
  currentLook=look;const on=look==='hybrid';
  for(const p of [...prepared.environment,...prepared.actors])setHybridMode(p,on);
  for(const b of document.querySelectorAll('[data-look]'))b.classList.toggle('active',b.dataset.look===look);
  updateStatus();
}
function updateParams(){
  for(const p of prepared.environment)setHybridParams(p,{scale:.18*scaleMul,strength,matte:.84});
  for(const p of prepared.actors)setHybridParams(p,{scale:.48*scaleMul,strength,matte:.80});
  updateStatus();
}
function groupStats(list){const stats=list.map(hybridStats);return{groups:stats.length,meshes:stats.reduce((a,b)=>a+b.meshes,0),materials:stats.reduce((a,b)=>a+b.materials,0),compiled:stats.reduce((a,b)=>a+b.compiled,0),decorated:stats.reduce((a,b)=>a+b.decorated,0),preserved:stats.reduce((a,b)=>a+b.preserved,0),mapsPreserved:stats.reduce((a,b)=>a+b.mapsPreserved,0),colorsPreserved:stats.reduce((a,b)=>a+b.colorsPreserved,0),textureUuids:[...new Set(stats.flatMap(s=>s.textureUuids))],projections:[...new Set(stats.flatMap(s=>s.projections))]}}
function updateStatus(){
  if(!roomRoot)return;
  const e=groupStats(prepared.environment),a=groupStats(prepared.actors);
  statusEl.className='';
  statusEl.innerHTML='<strong>'+currentLook.toUpperCase()+' · '+currentView+'</strong><br>Dungeon '+(roomRoot.userData.placementCount||0)+' placements · 5 exact actors<br>shared texture '+(e.textureUuids[0]||a.textureUuids[0]||'—').slice(0,8)+' · env WORLD / actors OBJECT<br>overlay '+strength.toFixed(2)+' · pattern '+scaleMul.toFixed(2)+'×';
}
function roomSourceCount(root){let meshes=0,maps=0;root.traverse(n=>{if(!n.isMesh)return;meshes++;for(const m of (Array.isArray(n.material)?n.material:[n.material]))if(m?.map)maps++});return{meshes,maps}}

async function buildEnvironment(){
  const [{buildScene},{scene:recipe}]=await Promise.all([
    import(WORLD_BASE+'lib/kit-lab.js'),
    import(WORLD_BASE+'scenes/dungeon-promo.js')
  ]);
  roomRoot=await buildScene(recipe.placements,(d,n)=>{statusEl.textContent='Loading exact Dungeon '+d+'/'+n+'…'});
  roomRoot.name='WORLD_ATLAS_DUNGEON_PROMO_EXACT';
  roomRoot.userData.recipeId=recipe.id;roomRoot.userData.placementCount=recipe.placements.length;envGroup.add(roomRoot);
  castFloor=await buildScene([0,4,8,12,16].map(x=>({a:'dungeon:floor_tile_large',p:[x,0,16]})));
  castFloor.name='CAST_FLOOR_EXACT_DUNGEON_TILES';castFloor.userData.placementCount=5;envGroup.add(castFloor);
  prepared.environment.push(
    prepareHybridObject(THREE,roomRoot,{texture:brush.texture,projection:'world',scale:.18*scaleMul,strength,matte:.84}),
    prepareHybridObject(THREE,castFloor,{texture:brush.texture,projection:'world',scale:.18*scaleMul,strength,matte:.84})
  );
  roomRoot.userData.sourceFacts=roomSourceCount(roomRoot);
}

async function loadDirect(id,spec){
  const gltf=await actorLoader.loadAsync(raw(spec.path));const root=gltf.scene;root.name=spec.label;
  groundAndScale(root,spec.height,spec.x,16);actorGroup.add(root);
  const prep=prepareHybridObject(THREE,root,{texture:brush.texture,projection:'object',scale:.48*scaleMul,strength,matte:.80});
  prepared.actors.push(prep);actorHandles[id]={id,spec,root,prep,adapter:'direct'};return actorHandles[id];
}
let graftModule=null,graftContract=null;
async function loadFrizzleBob(id,spec){
  if(!graftModule)graftModule=await import(ACTOR_CDN+spec.module);
  if(!graftContract)graftContract=await fetch(ACTOR_CDN+spec.contract).then(r=>{if(!r.ok)throw Error('graft contract '+r.status);return r.json()});
  const holder=new THREE.Group();holder.name=spec.label;actorGroup.add(holder);
  const pet=graftModule.pickGraftPet(graftContract,'graft-driver');
  const handle=await graftModule.mountGraft({THREE,loader:actorLoader,parent:holder,pet,lib:graftContract,camera,animation:'host',poseOverClip:false,override:{graft:{weapon:{on:false}},pose:{on:false}}});
  groundAndScale(holder,spec.height,spec.x,16);
  const prep=prepareHybridObject(THREE,holder,{texture:brush.texture,projection:'object',scale:.48*scaleMul,strength,matte:.80});
  prepared.actors.push(prep);actorHandles[id]={id,spec,root:holder,prep,adapter:'graft',update:dt=>handle.update(dt,camera),dispose:()=>handle.dispose()};return actorHandles[id];
}
async function buildActors(){
  for(const [id,spec] of Object.entries(SOURCES.actors)){
    statusEl.textContent='Loading exact actor · '+spec.label+'…';
    if(spec.adapter==='graft')await loadFrizzleBob(id,spec);else await loadDirect(id,spec);
  }
}

function actorSnapshot(){return Object.fromEntries(Object.entries(actorHandles).map(([id,h])=>{let meshes=0,skinned=0,maps=0;h.root.traverse(n=>{if(!n.isMesh)return;meshes++;if(n.isSkinnedMesh)skinned++;for(const m of (Array.isArray(n.material)?n.material:[n.material]))if(m?.map)maps++});return[id,{label:h.spec.label,path:h.spec.path||null,rig:h.spec.rig,adapter:h.adapter,blob:h.spec.blob||null,meshes,skinned,maps,height:h.spec.height}]}))}

window.__KFB_HYBRID_SCENE__={
  version:'0.1-candidate',build:'KFB-HYBRID-SURFACE-SCENE-01',ready:false,error:null,
  sourcePins:{world:WORLD_PIN,actors:ACTOR_PIN},
  sources:SOURCES,
  setLook,setView,
  setStrength:v=>{strength=THREE.MathUtils.clamp(Number(v),0,.75);document.getElementById('strength').value=String(strength);document.getElementById('strengthOut').textContent=strength.toFixed(2);updateParams()},
  setScale:v=>{scaleMul=THREE.MathUtils.clamp(Number(v),.45,1.6);document.getElementById('scale').value=String(scaleMul);document.getElementById('scaleOut').textContent=scaleMul<.8?'XL':scaleMul<1.15?'L':'M';updateParams()},
  snapshot:()=>({
    ready:window.__KFB_HYBRID_SCENE__.ready,error,look:currentLook,view:currentView,strength,scaleMul,
    sharedTexture:{uuid:brush.texture.uuid,size:brush.size,seed:brush.seed},
    environment:groupStats(prepared.environment),actors:groupStats(prepared.actors),
    room:{recipeId:roomRoot?.userData.recipeId||null,placements:roomRoot?.userData.placementCount||0,sourceFacts:roomRoot?.userData.sourceFacts||null,kitLab:SOURCES.room.kitLab,recipe:SOURCES.room.recipe},
    cast:actorSnapshot(),
    ownership:{toolbox:'material compatibility candidate',worldAtlas:'Dungeon room owner retained',residentActorOwners:'retained',consumerRuntime:'unchanged',physics:'unchanged',registry:'read-only'},
    projectionContract:{staticEnvironment:'world',movingActors:'object'}
  })
};

for(const b of document.querySelectorAll('[data-view]'))b.onclick=()=>setView(b.dataset.view);
for(const b of document.querySelectorAll('[data-look]'))b.onclick=()=>setLook(b.dataset.look);
document.getElementById('strength').oninput=e=>{strength=Number(e.target.value);document.getElementById('strengthOut').textContent=strength.toFixed(2);updateParams()};
document.getElementById('scale').oninput=e=>{scaleMul=Number(e.target.value);document.getElementById('scaleOut').textContent=scaleMul<.8?'XL':scaleMul<1.15?'L':'M';updateParams()};

const clock=new THREE.Clock();renderer.setAnimationLoop(()=>{
  const dt=Math.min(.05,clock.getDelta());for(const h of Object.values(actorHandles))h.update?.(dt);
  controls.update();renderer.render(scene,camera);
});

try{
  await buildEnvironment();await buildActors();setView('integrated');setLook('hybrid');
  await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
  window.__KFB_HYBRID_SCENE__.ready=true;updateStatus();
}catch(e){
  error=String(e?.stack||e);window.__KFB_HYBRID_SCENE__.error=error;statusEl.className='error';statusEl.textContent='SOURCE ASSET FAILED · '+error;console.error(e);
}
