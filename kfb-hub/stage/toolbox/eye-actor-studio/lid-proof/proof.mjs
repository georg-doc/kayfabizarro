import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {buildFaceHost} from '../../../../../tools/KFB-ToolBox/kfb-rigs-embed-v3/frizzlegraft-v1/facehost.v1.js';
import {EyeRig} from '../../../../../tools/KFB-ToolBox/kfb-rigs-embed-v3/petstudio-v9/studio-v12/pet-eye-rig.v6.js';
import {buildUpperLidVolumeGeometry,UPPER_LID_SCHEMA} from '../../../../../tools/KFB-ToolBox/eye-actor-studio-v1/upper-lid-volume.v1.mjs';

const $=s=>document.querySelector(s);
const stage=$('#stage'),canvas=$('#view'),status=$('#status'),metrics=$('#metrics'),title=$('#title');

const scene=new THREE.Scene();scene.background=new THREE.Color('#d9dfdc');
const renderer=new THREE.WebGLRenderer({canvas,antialias:true});
renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.8));
renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.shadowMap.enabled=true;
renderer.shadowMap.type=THREE.PCFSoftShadowMap;

const camera=new THREE.PerspectiveCamera(34,1,.01,100);
const controls=new OrbitControls(camera,canvas);controls.enableDamping=true;

scene.add(new THREE.HemisphereLight(0xfffbef,0x5a5f5b,1.5));
const key=new THREE.DirectionalLight(0xffdfbf,2.8);key.position.set(-3,5,5);key.castShadow=true;scene.add(key);
const fill=new THREE.DirectionalLight(0xc9d9ee,.8);fill.position.set(4,2,4);scene.add(fill);
const rim=new THREE.DirectionalLight(0xfff3df,.75);rim.position.set(0,4,-4);scene.add(rim);

const root=new THREE.Group();scene.add(root);
const loader=new GLTFLoader();

let faceHost=null,rig=null,eye=null,lid=null,lidMat=null,currentView='front';
let eyeWorld=new THREE.Vector3(),eyeRadius=.3;
const params={cover:.16,slant:0,curve:0,thickness:.24,roundness:.72,bulge:.42};

const VARIANTS={
  reference:{label:'Reference open',patch:{cover:.16,slant:0,curve:0,thickness:.24,roundness:.72,bulge:.42}},
  cover:{label:'More cover',patch:{cover:.52,slant:0,curve:0,thickness:.25,roundness:.72,bulge:.42}},
  slant:{label:'Slant',patch:{cover:.22,slant:.58,curve:0,thickness:.24,roundness:.72,bulge:.42}},
  concave:{label:'Concave',patch:{cover:.20,slant:0,curve:-.72,thickness:.24,roundness:.72,bulge:.42}},
  convex:{label:'Convex',patch:{cover:.20,slant:0,curve:.72,thickness:.24,roundness:.72,bulge:.42}}
};

function resize(){
  const r=stage.getBoundingClientRect();if(r.width<1||r.height<1)return;
  renderer.setSize(r.width,r.height,false);camera.aspect=r.width/r.height;camera.updateProjectionMatrix();
}
new ResizeObserver(resize).observe(stage);

function normalizeFigure(figure,targetHeight=3.2){
  figure.updateMatrixWorld(true);
  let box=new THREE.Box3().setFromObject(figure);
  const size=box.getSize(new THREE.Vector3());
  const k=targetHeight/Math.max(.001,size.y);
  figure.scale.setScalar(k);figure.updateMatrixWorld(true);
  box=new THREE.Box3().setFromObject(figure);
  const c=box.getCenter(new THREE.Vector3());
  figure.position.x-=c.x;figure.position.z-=c.z;figure.position.y-=box.min.y;
  figure.updateMatrixWorld(true);
}

function setView(v=currentView){
  currentView=v;
  if(window.__KFB_UPPER_LID_PROOF__)window.__KFB_UPPER_LID_PROOF__.view=currentView;
  document.documentElement.dataset.kfbUpperLidView=currentView;
  eye.getWorldPosition(eyeWorld);
  const r=eyeRadius*4.5;
  const dir={
    front:new THREE.Vector3(0,.05,1),
    three:new THREE.Vector3(1,.32,1.2),
    side:new THREE.Vector3(1,.05,.06)
  }[v]||new THREE.Vector3(0,.05,1);
  controls.target.copy(eyeWorld);
  camera.position.copy(eyeWorld).add(dir.normalize().multiplyScalar(r));
  camera.near=.01;camera.far=50;camera.updateProjectionMatrix();controls.update();
}

function rebuildLid(){
  if(!eye)return;
  const old=lid?.geometry;
  const geo=buildUpperLidVolumeGeometry(THREE,{radius:eyeRadius,...params});
  if(!lid){
    lid=new THREE.Mesh(geo,lidMat);
    lid.name='KFB Upper Lid Volume Proof';
    lid.userData.kfbUpperLidProof=true;
    lid.castShadow=true;lid.receiveShadow=true;
    eye.add(lid);
  }else{
    lid.geometry=geo;
    old?.dispose?.();
  }
  applyDebug();
  const u=geo.userData;
  metrics.textContent='closed volume · margin '+u.marginThickness.toFixed(4)+' · cover '+params.cover.toFixed(2)+' · slant '+params.slant.toFixed(2)+' · curve '+params.curve.toFixed(2);
  window.__KFB_UPPER_LID_PROOF__={
    ready:true,
    host:'Mannequin_Medium.glb',
    eyeOwner:'EyeRig v6',
    oldShellsHidden:true,
    visibleEyes:1,
    upperLids:1,
    lowerLids:0,
    schema:u.schema,
    closedVolume:u.closedVolume,
    realOcclusionMargin:u.realOcclusionMargin,
    marginThickness:u.marginThickness,
    params:{...params},
    view:currentView
  };
}

function applyVariant(id){
  const v=VARIANTS[id]||VARIANTS.reference;
  Object.assign(params,v.patch);
  $('#cover').value=params.cover;
  $('#thickness').value=params.thickness;
  $('#roundness').value=params.roundness;
  $('#bulge').value=params.bulge;
  title.textContent=v.label;
  rebuildLid();
}

function applyDebug(){
  if(!lid||!lidMat)return;
  const d=$('#debug').value;
  lidMat.transparent=d==='translucent';
  lidMat.opacity=d==='translucent'?.54:1;
  lidMat.depthWrite=d!=='translucent';
  lidMat.wireframe=d==='wire';
  lidMat.needsUpdate=true;
}

async function boot(){
  status.textContent='Loading exact Mannequin Medium…';
  const gltf=await loader.loadAsync('/media/3D_Assets/KayKit_Character_Animations_1.1/Mannequin Character/characters/Mannequin_Medium.glb');
  const figure=gltf.scene;figure.name='Mannequin Medium · exact source';root.add(figure);
  normalizeFigure(figure);

  faceHost=buildFaceHost({THREE,figure,log:m=>console.log('[FaceHost]',m)});
  if(faceHost?.status!=='OK')throw Error('FaceHost failed');

  const ch=faceHost.faceCtx();
  ch.o=ch.o||{};
  ch.o.makeMat=o=>new THREE.MeshStandardMaterial({color:o.color,roughness:o.roughness??.85,metalness:0});

  rig=new EyeRig(ch,{
    anchor:{dx:.34,dy:.02,ring:.27,track:.11},
    baseColor:0xf5f5f5,
    pupilSize:.38,gloss:.30,lidFit:.90,
    life:{on:false,wander:0,tremor:0}
  });
  rig.build();

  eye=rig.eyes[0];
  const other=rig.eyes[1];
  if(other)other.visible=false;

  // Exact v6 eyeball + pupil stay. Old v6 shell lids are only hidden.
  eye._up.visible=false;
  eye._lo.visible=false;
  eyeRadius=rig._R;

  lidMat=eye._up.material.clone();
  lidMat.roughness=.84;
  lidMat.metalness=0;
  lidMat.side=THREE.FrontSide;
  lidMat.needsUpdate=true;

  applyVariant('reference');
  setView('front');

  document.documentElement.dataset.kfbUpperLidReady='yes';
  status.textContent='REAL HOST + REAL EYERIG V6 EYE + 1 VOLUMETRIC UPPER LID';
}

$('#variant').onchange=e=>applyVariant(e.target.value);
for(const b of document.querySelectorAll('[data-view]'))b.onclick=()=>setView(b.dataset.view);
$('#debug').onchange=applyDebug;
for(const id of ['cover','thickness','roundness','bulge']){
  $('#'+id).oninput=e=>{params[id]=+e.target.value;title.textContent='Custom';rebuildLid();};
}

boot().catch(e=>{
  console.error(e);status.textContent='ERROR · '+e.message;status.style.color='#9b3329';
  document.documentElement.dataset.kfbUpperLidReady='error';
});

const clock=new THREE.Clock();
renderer.setAnimationLoop(()=>{
  const dt=Math.min(.05,clock.getDelta());
  rig?.update?.(dt);
  controls.update();
  renderer.render(scene,camera);
  if(window.__KFB_UPPER_LID_PROOF__)window.__KFB_UPPER_LID_PROOF__.view=currentView;
});
