import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const KFB_PIN='a6b9220a0b42d50a9de9804fad22e84dde2c322c';
const RAW='https://raw.githubusercontent.com/georg-doc/kayfabizarro/'+KFB_PIN+'/media/3D_Assets/KayKit_BoardGameBits_1.0_FREE/Assets/gltf/';
const donors={
  stand:{file:'playerstand_red.gltf',target:2.3},
  card:{file:'playercard_knight_red.gltf',target:3.2},
  d20:{file:'D20_red.gltf',target:2.5}
};
const states={
  stand:{loaded:false,error:null},
  card:{loaded:false,error:null},
  d20:{loaded:false,error:null},
  external:{ready:false,error:null,lastRoll:null}
};
const scenes={};
let cardArtMaterials=[];
let cardHighlight=false;
let spinD20=true;

function setStatus(id,text,ok=false){
  const el=document.querySelector('#status-'+id);
  if(!el)return;
  el.textContent=text;
  if(ok)el.style.color='#9ee3b8';
}

function makeScene(id){
  const host=document.querySelector('#view-'+id);
  const canvas=document.createElement('canvas');
  host.prepend(canvas);
  const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true});
  renderer.setPixelRatio(Math.min(devicePixelRatio,2));
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.shadowMap.enabled=true;
  renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(34,1,.02,100);
  camera.position.set(3.6,2.7,5.4);
  const controls=new OrbitControls(camera,canvas);
  controls.enableDamping=true;
  controls.dampingFactor=.08;
  controls.minDistance=2.2;
  controls.maxDistance=11;
  controls.target.set(0,1,0);
  scene.add(new THREE.HemisphereLight(0xfff4dd,0x332c3b,2.2));
  const key=new THREE.DirectionalLight(0xffe8cd,3.1);
  key.position.set(-4,7,5);
  key.castShadow=true;
  scene.add(key);
  const rim=new THREE.DirectionalLight(0x8bb4ff,1.0);
  rim.position.set(5,3,-4);
  scene.add(rim);
  const floor=new THREE.Mesh(
    new THREE.CircleGeometry(3.6,64),
    new THREE.MeshStandardMaterial({color:0x29232e,roughness:1,transparent:true,opacity:.88})
  );
  floor.rotation.x=-Math.PI/2;
  floor.position.y=-.01;
  floor.receiveShadow=true;
  scene.add(floor);
  scenes[id]={host,canvas,renderer,scene,camera,controls,object:null,baseCamera:camera.position.clone(),baseTarget:controls.target.clone()};
  resizeOne(id);
  return scenes[id];
}

function resizeOne(id){
  const s=scenes[id];
  if(!s)return;
  const r=s.host.getBoundingClientRect();
  const w=Math.max(1,Math.floor(r.width)),h=Math.max(1,Math.floor(r.height));
  s.renderer.setSize(w,h,false);
  s.camera.aspect=w/h;
  s.camera.updateProjectionMatrix();
}

function normalizeObject(obj,target){
  obj.updateMatrixWorld(true);
  let box=new THREE.Box3().setFromObject(obj);
  const size=box.getSize(new THREE.Vector3());
  const scale=target/Math.max(size.x,size.y,size.z,.0001);
  obj.scale.multiplyScalar(scale);
  obj.updateMatrixWorld(true);
  box=new THREE.Box3().setFromObject(obj);
  const center=box.getCenter(new THREE.Vector3());
  obj.position.x-=center.x;
  obj.position.z-=center.z;
  obj.position.y-=box.min.y;
  obj.updateMatrixWorld(true);
  return new THREE.Box3().setFromObject(obj);
}

async function loadDonor(id){
  const s=makeScene(id);
  const cfg=donors[id];
  const loader=new GLTFLoader();
  try{
    const gltf=await loader.loadAsync(RAW+cfg.file);
    const obj=gltf.scene;
    obj.traverse(o=>{
      if(o.isMesh){
        o.castShadow=true;
        o.receiveShadow=true;
        if(id==='card' && /knight/i.test(o.material?.name||'')) cardArtMaterials.push(o.material);
      }
    });
    const box=normalizeObject(obj,cfg.target);
    s.scene.add(obj);
    s.object=obj;
    const size=box.getSize(new THREE.Vector3());
    const h=size.y;
    s.controls.target.set(0,Math.max(.45,h*.48),0);
    s.camera.position.set(Math.max(2.5,size.x*2.0),Math.max(1.9,h*1.25),Math.max(3.8,size.z*4.5+3.0));
    s.baseCamera=s.camera.position.clone();
    s.baseTarget=s.controls.target.clone();
    s.controls.update();
    states[id].loaded=true;
    setStatus(id,'loaded exact '+cfg.file+' · '+size.x.toFixed(2)+'×'+size.y.toFixed(2)+'×'+size.z.toFixed(2),true);
  }catch(err){
    states[id].error=String(err?.message||err);
    setStatus(id,'ERROR · '+states[id].error);
  }
}

function resetView(id){
  const s=scenes[id]; if(!s)return;
  s.camera.position.copy(s.baseCamera);
  s.controls.target.copy(s.baseTarget);
  s.controls.update();
}

document.querySelectorAll('[data-reset]').forEach(b=>b.addEventListener('click',()=>resetView(b.dataset.reset)));

document.querySelector('#artFace').addEventListener('click',e=>{
  cardHighlight=!cardHighlight;
  for(const m of cardArtMaterials){
    if(!m.userData.kfbOriginalEmissive)m.userData.kfbOriginalEmissive=m.emissive?.clone?.()||new THREE.Color(0);
    if(m.emissive){
      if(cardHighlight){m.emissive.set(0x704018);m.emissiveIntensity=.75;}
      else{m.emissive.copy(m.userData.kfbOriginalEmissive);m.emissiveIntensity=1;}
      m.needsUpdate=true;
    }
  }
  e.currentTarget.textContent=cardHighlight?'ART FACE: HIGHLIGHTED':'HIGHLIGHT ART FACE';
});

document.querySelector('#spinD20').addEventListener('click',e=>{
  spinD20=!spinD20;
  e.currentTarget.textContent='AUTO SPIN: '+(spinD20?'ON':'OFF');
});

async function initExternalDice(){
  const button=document.querySelector('#rollD10');
  try{
    const mod=await import('https://esm.sh/@3d-dice/dice-box-threejs@0.0.12?bundle');
    const DiceBox=mod.default;
    const box=new DiceBox('#external-dice-stage',{
      sounds:false,
      shadows:true,
      theme_surface:'green-felt',
      theme_colorset:'white',
      theme_texture:'',
      theme_material:'plastic',
      gravity_multiplier:260,
      baseScale:34,
      strength:1.15
    });
    await box.initialize();
    states.external.ready=true;
    setStatus('external','ready · exact package 0.0.12 · click ROLL D10',true);
    button.disabled=false;
    const roll=async()=>{
      button.disabled=true;
      try{
        const result=await box.roll('1d10');
        states.external.lastRoll=result;
        const value=Array.isArray(result)?result?.[0]?.value ?? result?.[0]?.result?.[0]?.value : result?.value;
        setStatus('external','D10 settled'+(value!=null?' · result '+value:'')+' · Cannon physics donor',true);
        return result;
      }catch(err){
        states.external.error=String(err?.message||err);
        setStatus('external','ROLL ERROR · '+states.external.error);
        throw err;
      }finally{button.disabled=false;}
    };
    button.addEventListener('click',()=>roll().catch(()=>{}));
    window.__KFB_T1_ROLL_D10__=roll;
  }catch(err){
    states.external.error=String(err?.message||err);
    setStatus('external','DONOR LOAD ERROR · '+states.external.error);
  }
}

window.KFBStorytellingT1={
  report(){return JSON.parse(JSON.stringify({
    build:'storytelling-maps-t1-r1',
    kaykitPin:KFB_PIN,
    diceDonor:'3d-dice/dice-box-threejs@6945e0068eae27f22acd26debdb70f6ef2fd6063',
    stand:states.stand,
    card:states.card,
    d20:states.d20,
    external:states.external,
    ready:states.stand.loaded&&states.card.loaded&&states.d20.loaded&&states.external.ready
  }));},
  async rollD10(){
    if(!window.__KFB_T1_ROLL_D10__)throw new Error('external dice donor not ready');
    return window.__KFB_T1_ROLL_D10__();
  }
};

await Promise.all([loadDonor('stand'),loadDonor('card'),loadDonor('d20'),initExternalDice()]);

function loop(){
  requestAnimationFrame(loop);
  if(spinD20&&scenes.d20?.object)scenes.d20.object.rotation.y+=.004;
  for(const s of Object.values(scenes)){
    s.controls.update();
    s.renderer.render(s.scene,s.camera);
  }
}
loop();

addEventListener('resize',()=>Object.keys(scenes).forEach(resizeOne));
