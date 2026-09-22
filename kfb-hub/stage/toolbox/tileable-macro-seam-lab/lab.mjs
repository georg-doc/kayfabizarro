import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {createTileableRgbBrushTexture,edgeContinuity,makeTiledPreview} from './tileable-rgb-brush.v1.js';

const V1_RUNTIME='15f2f1714d62b606033b8624964e481c6d99d59f';
const FROZEN_V2='7cbad52b55fb9ec2300aa4b25ca92b0997ce448a';
const WORLD_PIN='bc1441eb8ff9a2df0e15e778b44b73f97eb63d76';
const ACTOR_PIN='bdaea0648f27c0f16e0a737bfba237eb54dd4cbb';

const oldBrushUrl='https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@'+V1_RUNTIME+'/kfb-hub/stage/toolbox/rgb-triplanar-palette-lab/kfb-rgb-triplanar.v1.js';
const v2MaterialUrl='https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@'+FROZEN_V2+'/kfb-hub/stage/toolbox/hybrid-surface-scene-lab-v2/hybrid-surface.v2.js';
const worldBase='https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@'+WORLD_PIN+'/tools/world_atlas/source/';
const actorRaw='https://raw.githubusercontent.com/georg-doc/kayfabizarro/'+ACTOR_PIN+'/';
const actorCdn='https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@'+ACTOR_PIN+'/';
const enc=p=>p.split('/').map(encodeURIComponent).join('/');
const raw=p=>actorRaw+enc(p);

const [{createRgbBrushTexture},{prepareHybridV2Object,setHybridV2Mode}]=await Promise.all([
  import(oldBrushUrl),
  import(v2MaterialUrl)
]);

const stage=document.getElementById('stage');
const statusEl=document.getElementById('status');
const scene=new THREE.Scene();
scene.background=new THREE.Color(0x222321);
scene.fog=new THREE.Fog(0x222321,28,52);

const camera=new THREE.PerspectiveCamera(31,1,.03,120);
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
controls.maxDistance=50;

scene.add(new THREE.HemisphereLight(0xfff2df,0x404143,1.2));
const key=new THREE.DirectionalLight(0xffdfb3,1.9);
key.position.set(12,20,14);key.castShadow=true;key.shadow.mapSize.set(2048,2048);
key.shadow.camera.left=-25;key.shadow.camera.right=25;key.shadow.camera.top=25;key.shadow.camera.bottom=-25;
scene.add(key);
const fill=new THREE.DirectionalLight(0xb3cae3,.48);fill.position.set(-12,7,-8);scene.add(fill);
for(const [x,z] of [[3,1],[14,2],[1,10]]){const p=new THREE.PointLight(0xffa13c,6.5,10,2);p.position.set(x,3,z);scene.add(p)}

const oldBrush=createRgbBrushTexture(THREE,{seed:0x4b4642,size:256});
const tileBrush=createTileableRgbBrushTexture(THREE,{seed:0x4b4642,size:256});
const oldMetric=edgeContinuity(oldBrush.canvas);
const newMetric=edgeContinuity(tileBrush.canvas);

const oldPreview=makeTiledPreview(oldBrush.canvas,2);
const newPreview=makeTiledPreview(tileBrush.canvas,2);
oldPreview.id='oldPreviewCanvas';newPreview.id='newPreviewCanvas';
document.getElementById('oldMount').appendChild(oldPreview);
document.getElementById('newMount').appendChild(newPreview);
document.getElementById('metric').innerHTML=
  'edge/local ratio X · old <b>'+oldMetric.seamXRatio.toFixed(2)+'</b> → tile <b>'+newMetric.seamXRatio.toFixed(2)+'</b><br>'+
  'edge/local ratio Y · old <b>'+oldMetric.seamYRatio.toFixed(2)+'</b> → tile <b>'+newMetric.seamYRatio.toFixed(2)+'</b>';

const envGroup=new THREE.Group();scene.add(envGroup);
const actorGroup=new THREE.Group();scene.add(actorGroup);
const prepared=[];
const actorHandles={};
const loader=new GLTFLoader();
let roomRoot=null,currentLook='tileable',currentView='seam',error=null;

function resize(){
  const r=stage.getBoundingClientRect();
  renderer.setSize(Math.max(1,r.width),Math.max(1,r.height),false);
  camera.aspect=Math.max(.25,r.width/Math.max(1,r.height));camera.updateProjectionMatrix();
}
addEventListener('resize',resize);resize();

function asMats(mat){return Array.isArray(mat)?mat:[mat]}

function setPreparedTexture(prep,texture){
  for(const rec of prep.records){
    for(const m of asMats(rec.hybrid)){
      const h=m?.userData?.kfbHybridV2;
      if(!h)continue;
      h.sharedTextureUuid=texture.uuid;
      h.uniforms.uKfbSurfaceTex.value=texture;
    }
  }
}

function groundScaled(root,scale,x,z){
  root.scale.setScalar(scale);
  root.position.set(0,0,0);
  root.updateMatrixWorld(true);
  const box=new THREE.Box3().setFromObject(root,true);
  const center=box.getCenter(new THREE.Vector3());
  root.position.set(x-center.x,-box.min.y,z-center.z);
  root.updateMatrixWorld(true);
}

function frame(objects,dir=[1,.58,1],pad=1.2){
  const box=new THREE.Box3().makeEmpty();
  for(const o of objects)if(o?.visible!==false)box.expandByObject(o,true);
  if(box.isEmpty())return;
  const size=box.getSize(new THREE.Vector3()),center=box.getCenter(new THREE.Vector3());
  const vfov=THREE.MathUtils.degToRad(camera.fov);
  const hfov=2*Math.atan(Math.tan(vfov/2)*Math.max(.25,camera.aspect));
  const dist=Math.max(size.y/(2*Math.tan(vfov/2)),size.x/(2*Math.tan(hfov/2)),size.z*.72)*pad;
  const d=new THREE.Vector3(...dir).normalize();
  camera.position.copy(center).addScaledVector(d,dist);
  camera.near=Math.max(.02,dist/100);camera.far=Math.max(120,dist*8);camera.updateProjectionMatrix();
  controls.target.copy(center);controls.update();
}

function setView(view){
  currentView=view;
  if(view==='seam'){
    roomRoot.visible=true;actorGroup.visible=false;
    camera.position.set(13.2,4.7,12.0);
    controls.target.set(8.0,1.05,6.5);
    camera.near=.03;camera.far=120;camera.updateProjectionMatrix();controls.update();
  }else{
    roomRoot.visible=true;actorGroup.visible=true;
    frame([roomRoot,actorGroup],[1,.55,1],1.2);
  }
  for(const b of document.querySelectorAll('[data-view]'))b.classList.toggle('active',b.dataset.view===view);
  updateStatus();
}

function setLook(look){
  currentLook=look;
  if(look==='original'){
    for(const p of prepared)setHybridV2Mode(p,false);
  }else{
    const texture=look==='old'?oldBrush.texture:tileBrush.texture;
    for(const p of prepared){setPreparedTexture(p,texture);setHybridV2Mode(p,true)}
  }
  for(const b of document.querySelectorAll('[data-look]'))b.classList.toggle('active',b.dataset.look===look);
  updateStatus();
}

function surfaceStats(){
  const uuids=new Set();let decorated=0;
  for(const p of prepared)for(const rec of p.records)for(const m of asMats(rec.hybrid)){
    const h=m?.userData?.kfbHybridV2;if(!h)continue;decorated++;uuids.add(h.sharedTextureUuid);
  }
  return{decorated,textureUuids:[...uuids]};
}

function updateStatus(){
  if(!roomRoot)return;
  const s=surfaceStats();
  statusEl.className='';
  statusEl.innerHTML='<strong>'+currentLook.toUpperCase()+' · '+currentView.toUpperCase()+'</strong>'+
    '<br>exact Dungeon + GothGirl + FrizzleBob'+
    '<br>shared macro textures in active hybrid: '+s.textureUuids.length+
    '<br>old seam ratio '+oldMetric.seamXRatio.toFixed(2)+'/'+oldMetric.seamYRatio.toFixed(2)+
    ' · tile '+newMetric.seamXRatio.toFixed(2)+'/'+newMetric.seamYRatio.toFixed(2);
}

async function buildRoom(){
  const [{buildScene},{scene:recipe}]=await Promise.all([
    import(worldBase+'lib/kit-lab.js'),
    import(worldBase+'scenes/dungeon-promo.js')
  ]);
  roomRoot=await buildScene(recipe.placements,(d,n)=>{statusEl.textContent='Loading exact Dungeon '+d+'/'+n+'…'});
  roomRoot.name='WORLD_ATLAS_DUNGEON_PROMO_SEAM_PROOF';
  roomRoot.userData.recipeId=recipe.id;
  roomRoot.userData.placementCount=recipe.placements.length;
  envGroup.add(roomRoot);
  const prep=prepareHybridV2Object(THREE,roomRoot,{
    texture:tileBrush.texture,projection:'world',
    macroScale:.07*.72,grainScale:3.2,
    strength:.62,grainStrength:.52,roughnessStrength:.58
  });
  prepared.push(prep);
}

async function loadGothGirl(){
  const path='media/3D_Assets/KayKit_Mystery_Series6/GothGirl/characters/GothGirl.glb';
  const gltf=await loader.loadAsync(raw(path));
  const root=gltf.scene;root.name='GothGirl · exact';
  actorGroup.add(root);groundScaled(root,0.9205969171294165,7.0,7.3);
  const prep=prepareHybridV2Object(THREE,root,{
    texture:tileBrush.texture,projection:'object',
    macroScale:.18*.9205969171294165*.72,grainScale:6.5*.9205969171294165,
    strength:.62,grainStrength:.52,roughnessStrength:.58
  });
  prepared.push(prep);actorHandles.gothgirl={root,prep,path};
}

let graftHandle=null;
async function loadFrizzleBob(){
  const modulePath='tools/KFB-ToolBox/kfb-rigs-embed-v3/frizzlegraft-v1/graft-mount.v1.js';
  const contractPath='tools/KFB-ToolBox/kfb-rigs-embed-v3/contracts/kfb-pet-graft-driver.v4.json';
  const mod=await import(actorCdn+modulePath);
  const contract=await fetch(actorCdn+contractPath).then(r=>{if(!r.ok)throw Error('graft contract '+r.status);return r.json()});
  const root=new THREE.Group();root.name='FrizzleBob · Driver Graft · exact';actorGroup.add(root);
  const pet=mod.pickGraftPet(contract,'graft-driver');
  graftHandle=await mod.mountGraft({
    THREE,loader,parent:root,pet,lib:contract,camera,
    animation:'host',poseOverClip:false,override:{graft:{weapon:{on:false}},pose:{on:false}}
  });
  groundScaled(root,1.0444884938968744,10.5,7.3);
  const prep=prepareHybridV2Object(THREE,root,{
    texture:tileBrush.texture,projection:'object',
    macroScale:.18*1.0444884938968744*.72,grainScale:6.5*1.0444884938968744,
    strength:.62,grainStrength:.52,roughnessStrength:.58
  });
  prepared.push(prep);actorHandles.frizzlebob={root,prep,modulePath,contractPath};
}

window.__KFB_TILEABLE_SEAM__={
  build:'KFB-TILEABLE-MACRO-SEAM-01',ready:false,error:null,
  pins:{world:WORLD_PIN,actors:ACTOR_PIN,v1Brush:V1_RUNTIME,frozenV2:FROZEN_V2},
  setLook,setView,
  snapshot:()=>({
    ready:window.__KFB_TILEABLE_SEAM__.ready,error,look:currentLook,view:currentView,
    oldMetric,newMetric,
    textures:{old:oldBrush.texture.uuid,tileable:tileBrush.texture.uuid,active:surfaceStats().textureUuids},
    room:{recipeId:roomRoot?.userData.recipeId||null,placements:roomRoot?.userData.placementCount||0},
    actors:{
      gothgirl:{path:actorHandles.gothgirl?.path||null},
      frizzlebob:{module:actorHandles.frizzlebob?.modulePath||null,contract:actorHandles.frizzlebob?.contractPath||null}
    },
    contract:{onlyChange:'macro texture generator',v2MaterialPin:FROZEN_V2,sourceMaterials:'unchanged',grain:'unchanged',headScaleFactors:'reused measured factors',consumers:'unchanged'}
  })
};

for(const b of document.querySelectorAll('[data-view]'))b.onclick=()=>setView(b.dataset.view);
for(const b of document.querySelectorAll('[data-look]'))b.onclick=()=>setLook(b.dataset.look);

const clock=new THREE.Clock();
renderer.setAnimationLoop(()=>{
  const dt=Math.min(.05,clock.getDelta());
  graftHandle?.update?.(dt,camera);
  controls.update();renderer.render(scene,camera);
});

try{
  await buildRoom();
  await loadGothGirl();
  await loadFrizzleBob();
  setLook('tileable');
  setView('seam');
  await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
  window.__KFB_TILEABLE_SEAM__.ready=true;
  updateStatus();
}catch(e){
  error=String(e?.stack||e);
  window.__KFB_TILEABLE_SEAM__.error=error;
  statusEl.className='error';statusEl.textContent='SOURCE FAILED · '+error;console.error(e);
}
