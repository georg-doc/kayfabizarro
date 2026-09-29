import maplibregl from 'https://cdn.jsdelivr.net/npm/maplibre-gl@6.11.2/dist/maplibre-gl.mjs';
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/loaders/GLTFLoader.js';

const DONOR_URL='https://raw.githubusercontent.com/georg-doc/kayfabizarro/10a7fdce6b3a1ae22504ade71b7dbec5f25e0ff0/media/3D_Assets/KayKit_Mystery_Series6/6%20-%20December%202023%20-%20Action%20Figure/character/gltf/ActionFigure.glb';
const START={lng:6.867,lat:50.877};
const status=document.querySelector('#status');
const donorCanvas=document.querySelector('#donor');
const mapEl=document.querySelector('#map');
const donorBtn=document.querySelector('#donorBtn');
const worldBtn=document.querySelector('#worldBtn');

let donorGLTF=null;
let donorMixer=null;
let donorClock=new THREE.Clock();

const donorRenderer=new THREE.WebGLRenderer({canvas:donorCanvas,antialias:true,alpha:false});
donorRenderer.setPixelRatio(Math.min(devicePixelRatio,2));
donorRenderer.outputColorSpace=THREE.SRGBColorSpace;
const donorScene=new THREE.Scene();
donorScene.background=new THREE.Color(0x17191b);
const donorCamera=new THREE.PerspectiveCamera(32,1,.01,100);
donorCamera.position.set(1.7,1.25,3.3);
donorCamera.lookAt(0,0.9,0);
donorScene.add(new THREE.HemisphereLight(0xffffff,0x333333,2.0));
const donorKey=new THREE.DirectionalLight(0xffffff,2.5); donorKey.position.set(3,4,2); donorScene.add(donorKey);
const donorRoot=new THREE.Group(); donorScene.add(donorRoot);

function fitDonor(obj){
  const box=new THREE.Box3().setFromObject(obj), size=new THREE.Vector3(), center=new THREE.Vector3();
  box.getSize(size); box.getCenter(center);
  const s=1.55/Math.max(size.y,.001);
  obj.scale.setScalar(s);
  obj.position.sub(center.multiplyScalar(s));
  obj.position.y+=size.y*s*.5;
}
function playPreferred(gltf,mixer,wanted){
  if(!gltf?.animations?.length) return null;
  const lower=wanted.toLowerCase();
  const clip=gltf.animations.find(c=>c.name.toLowerCase().includes(lower))||gltf.animations[0];
  mixer.stopAllAction();
  mixer.clipAction(clip).reset().play();
  return clip.name;
}
function resizeDonor(){
  const w=innerWidth,h=innerHeight;
  donorRenderer.setSize(w,h,false);
  donorCamera.aspect=w/h; donorCamera.updateProjectionMatrix();
}
function renderDonor(){
  requestAnimationFrame(renderDonor);
  const dt=donorClock.getDelta();
  donorMixer?.update(dt);
  donorRenderer.render(donorScene,donorCamera);
}
resizeDonor(); addEventListener('resize',resizeDonor); renderDonor();

new GLTFLoader().load(DONOR_URL,g=>{
  donorGLTF=g;
  const obj=g.scene;
  fitDonor(obj);
  donorRoot.add(obj);
  donorMixer=new THREE.AnimationMixer(obj);
  const clip=playPreferred(g,donorMixer,'idle');
  status.textContent='SOURCE DONOR · KayKit ActionFigure.glb · '+(clip?('clip: '+clip):'no embedded clip');
},undefined,e=>{
  status.textContent='DONOR LOAD FAIL · '+e.message;
});

const map=new maplibregl.Map({
  container:'map',
  style:'https://demotiles.maplibre.org/style.json',
  center:[START.lng,START.lat],
  zoom:14.2,
  pitch:67,
  bearing:-18,
  antialias:true,
  maxPitch:85
});
map.addControl(new maplibregl.NavigationControl({visualizePitch:true}),'top-right');

let actor={lng:START.lng,lat:START.lat,heading:0,speed:0};
const keys=new Set();
addEventListener('keydown',e=>{ if(['KeyW','KeyA','KeyS','KeyD','ShiftLeft','ShiftRight'].includes(e.code)){keys.add(e.code);e.preventDefault();}});
addEventListener('keyup',e=>keys.delete(e.code));
addEventListener('blur',()=>keys.clear());

let layerReady=false;
let actorMixer=null;
let actorGLTF=null;
let lastT=performance.now();

map.on('load',()=>{
  map.addSource('terrain-dem',{type:'raster-dem',url:'https://tiles.mapterhorn.com/tilejson.json'});
  map.setTerrain({source:'terrain-dem',exaggeration:1.25});
  map.addLayer({
    id:'kfb-actionfigure',
    type:'custom',
    renderingMode:'3d',
    onAdd(m,gl){
      this.camera=new THREE.Camera();
      this.scene=new THREE.Scene();
      this.renderer=new THREE.WebGLRenderer({canvas:m.getCanvas(),context:gl,antialias:true});
      this.renderer.autoClear=false;
      this.scene.add(new THREE.HemisphereLight(0xffffff,0x5a6470,2.0));
      const sun=new THREE.DirectionalLight(0xffffff,2.4); sun.position.set(30,80,50); this.scene.add(sun);
      this.root=new THREE.Group(); this.scene.add(this.root);
      new GLTFLoader().load(DONOR_URL,g=>{
        actorGLTF=g;
        const obj=g.scene;
        const box=new THREE.Box3().setFromObject(obj),size=new THREE.Vector3(); box.getSize(size);
        const targetMeters=1.72, scale=targetMeters/Math.max(size.y,.001);
        obj.scale.setScalar(scale);
        obj.rotation.x=Math.PI/2;
        this.root.add(obj);
        actorMixer=new THREE.AnimationMixer(obj);
        actorClipName=playPreferred(g,actorMixer,'idle',actorClipName);
        layerReady=true;
        status.textContent='MAPLIBRE WORLD OWNER · terrain + map camera + same ActionFigure donor · WASD / Shift';
      });
    },
    render(gl,args){
      const elevation=map.queryTerrainElevation([actor.lng,actor.lat],{exaggerated:true})||0;
      const mc=maplibregl.MercatorCoordinate.fromLngLat([actor.lng,actor.lat],elevation);
      const meter=mc.meterInMercatorCoordinateUnits();
      const transform=new THREE.Matrix4()
        .makeTranslation(mc.x,mc.y,mc.z)
        .scale(new THREE.Vector3(meter,-meter,meter))
        .multiply(new THREE.Matrix4().makeRotationZ(actor.heading));
      const proj=new THREE.Matrix4().fromArray(args.defaultProjectionData.mainMatrix);
      this.camera.projectionMatrix=proj.multiply(transform);
      this.renderer.resetState();
      this.renderer.render(this.scene,this.camera);
      map.triggerRepaint();
    }
  });
});

function tick(t){
  requestAnimationFrame(tick);
  const dt=Math.min((t-lastT)/1000,.05); lastT=t;
  if(!layerReady) return;
  const turn=(keys.has('KeyA')?1:0)-(keys.has('KeyD')?1:0);
  actor.heading+=turn*dt*2.2;
  const forward=(keys.has('KeyW')?1:0)-(keys.has('KeyS')?1:0);
  const run=keys.has('ShiftLeft')||keys.has('ShiftRight');
  actor.speed=forward*(run?4.8:2.7);
  if(actor.speed){
    const meters=actor.speed*dt;
    const dLat=(meters*Math.cos(actor.heading))/111320;
    const dLng=(meters*Math.sin(actor.heading))/(111320*Math.cos(actor.lat*Math.PI/180));
    actor.lat+=dLat; actor.lng+=dLng;
    actorClipName=playPreferred(actorGLTF,actorMixer,run?'run':'walk',actorClipName);
    map.setCenter([actor.lng,actor.lat]);
  } else {
    actorClipName=playPreferred(actorGLTF,actorMixer,'idle',actorClipName);
  }
  actorMixer?.update(dt);
}
requestAnimationFrame(tick);

function show(which){
  const donor=which==='donor';
  donorCanvas.style.display=donor?'block':'none';
  mapEl.style.display=donor?'none':'block';
  donorBtn.setAttribute('aria-pressed',String(donor));
  worldBtn.setAttribute('aria-pressed',String(!donor));
  if(!donor) setTimeout(()=>map.resize(),0);
}
donorBtn.onclick=()=>show('donor');
worldBtn.onclick=()=>show('world');
