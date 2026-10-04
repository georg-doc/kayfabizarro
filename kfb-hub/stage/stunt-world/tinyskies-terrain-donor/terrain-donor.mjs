import * as THREE from 'three';
import { createGlobe } from '/travel/wip/travel_globe_wsa/globe-v13/globe.js';
import { setTerrainZones, terrainZoneCount, rawDisplacementAt } from '/travel/wip/travel_globe_wsa/globe-v13/terrain-surface.js';
import { sampleTerrain, setKontinentHook } from '/travel/wip/travel_globe_wsa/globe-v13/simplex-noise.js';
import { setBiome } from '/travel/wip/travel_globe_wsa/globe-v13/globe-biome.js';
import { weltAusId, weltHaken } from '/travel/wip/travel_globe_wsa/globe-v13/welt-id.js';
import { erdeZuschlag } from '/travel/wip/travel_globe_wsa/globe-v13/erde-maske.js';
import { getSkyPreset, paintRadialSky, buildLightRig } from '/travel/wip/travel_globe_wsa/globe-v13/sky-presets.js';

const WORLD_ID = 'W1-anti_rules_toolkit-default-E0-D0-M-18';
const TRAVEL_HEAD = '8614282aab2ced43bb5dda9fcf7abadf9768100a';
const TINYSKIES_PIN = '2659a5cc987d7e4a4c5aa7e79c86a1626ad75df6';
const RADIUS = 5;
const SEGMENTS = 256;

const mount = document.querySelector('#view');
const status = document.querySelector('#status');
const metrics = document.querySelector('#metrics');

function fibonacciDirections(count=900){
  const out=[];
  const ga=Math.PI*(3-Math.sqrt(5));
  for(let i=0;i<count;i++){
    const y=1-(i/(count-1))*2;
    const r=Math.sqrt(Math.max(0,1-y*y));
    const t=ga*i;
    out.push(new THREE.Vector3(Math.cos(t)*r,y,Math.sin(t)*r));
  }
  return out;
}

function chooseLandSite(seed, terrainType){
  let best=null;
  for(const n of fibonacciDirections()){
    const t=sampleTerrain(seed,terrainType,n.x,n.y,n.z);
    if(!t.isLand) continue;
    // Prefer a visible hillside rather than a snow summit or a flat coast.
    const targetBand = 1-Math.min(1,Math.abs(t.elevation-0.48)/0.48);
    const score=targetBand + t.elevation*0.12;
    if(!best || score>best.score) best={n:n.clone(),terrain:t,score};
  }
  if(!best) throw new Error('No land site found for donor proof');
  return best;
}

function tangentFrame(n){
  const helper=Math.abs(n.y)<0.86?new THREE.Vector3(0,1,0):new THREE.Vector3(1,0,0);
  const ex=new THREE.Vector3().crossVectors(helper,n).normalize();
  const ev=new THREE.Vector3().crossVectors(n,ex).normalize();
  return {ex,ev};
}

function compareGeometry(a,b){
  const A=a.mesh.geometry.attributes.position;
  const B=b.mesh.geometry.attributes.position;
  const n=Math.min(A.count,B.count);
  let changed=0,maxDelta=0,sum=0;
  for(let i=0;i<n;i++){
    const dx=A.getX(i)-B.getX(i);
    const dy=A.getY(i)-B.getY(i);
    const dz=A.getZ(i)-B.getZ(i);
    const d=Math.hypot(dx,dy,dz);
    if(d>1e-6){changed++;sum+=d;maxDelta=Math.max(maxDelta,d);}
  }
  return {
    vertices:n,
    changedVertices:changed,
    changedFraction:n?changed/n:0,
    maxDelta,
    meanChangedDelta:changed?sum/changed:0
  };
}

const world=weltAusId(WORLD_ID);
if(!world) throw new Error('Current Travel world id did not resolve');
const seed=world.seed;
const terrainType=world.typ;

setKontinentHook(weltHaken(world,erdeZuschlag));
setBiome({on:true,seed,baseType:terrainType,strength:1,sharp:4.5});

const preset=getSkyPreset('day');
const renderer=new THREE.WebGLRenderer({antialias:true});
renderer.setPixelRatio(Math.min(devicePixelRatio||1,2));
renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.setSize(innerWidth,innerHeight,false);
mount.appendChild(renderer.domElement);

const scene=new THREE.Scene();
scene.background=paintRadialSky(THREE,preset);
scene.fog=new THREE.Fog(preset.fogColor,preset.fogNear*2.2,preset.fogFar*3.4);
buildLightRig(THREE,scene,preset);

const camera=new THREE.PerspectiveCamera(38,innerWidth/innerHeight,0.05,100);
camera.position.set(0,1.2,26);
camera.lookAt(0,0,0);

const site=chooseLandSite(seed,terrainType);
const {ex,ev}=tangentFrame(site.n);
const rawHeight=rawDisplacementAt(seed,terrainType,site.n.x,site.n.y,site.n.z);

setTerrainZones([]);
const baseGlobe=createGlobe({
  THREE,radius:RADIUS,segments:SEGMENTS,seed,terrainType,
  biomeTint:.34,
  atmosphereGlow:preset.atmosphereGlow,
  rimColor:preset.rimColor,
  cloudOpacity:preset.cloudOpacity,
  oceanShallow:preset.oceanShallow,
  oceanDeep:preset.oceanDeep,
  oceanFoam:preset.oceanFoam
});
baseGlobe.group.position.x=-6.2;
scene.add(baseGlobe.group);

const zoneRecipe={
  n:{x:site.n.x,y:site.n.y,z:site.n.z},
  radius:.20,
  ramp:.16,
  height:rawHeight+.055,
  tiltU:.024,
  tiltV:-.012,
  ex:{x:ex.x,y:ex.y,z:ex.z},
  ev:{x:ev.x,y:ev.y,z:ev.z}
};
setTerrainZones([zoneRecipe]);
const configuredZoneCount=terrainZoneCount();
const zonedGlobe=createGlobe({
  THREE,radius:RADIUS,segments:SEGMENTS,seed,terrainType,
  biomeTint:.34,
  atmosphereGlow:preset.atmosphereGlow,
  rimColor:preset.rimColor,
  cloudOpacity:preset.cloudOpacity,
  oceanShallow:preset.oceanShallow,
  oceanDeep:preset.oceanDeep,
  oceanFoam:preset.oceanFoam
});
zonedGlobe.group.position.x=6.2;
scene.add(zonedGlobe.group);

// Leave the shared Travel terrain owner clean after baking the isolated proof pair.
setTerrainZones([]);

const viewQ=new THREE.Quaternion().setFromUnitVectors(site.n,new THREE.Vector3(0,0,1));
let yaw=0,pitch=0;
function applyOrientation(){
  const qUser=new THREE.Quaternion().setFromEuler(new THREE.Euler(pitch,yaw,0,'YXZ'));
  const q=qUser.multiply(viewQ.clone());
  baseGlobe.group.quaternion.copy(q);
  zonedGlobe.group.quaternion.copy(q);
}
applyOrientation();

const geometryDelta=compareGeometry(baseGlobe,zonedGlobe);

// Compile the exact current Travel material once before asking its built-in source probe.
// The probe inspects the compiled shader, so querying it before the first render is not evidence.
renderer.render(scene,camera);
const sourceProbe=typeof baseGlobe.quellenProbe==='function'?baseGlobe.quellenProbe():null;

window.__KFB_TERRAIN_DONOR__={
  ready:true,
  owner:'georg-doc/KFB-Travel-Globe',
  travelHead:TRAVEL_HEAD,
  tinySkiesPin:TINYSKIES_PIN,
  worldId:WORLD_ID,
  seed,
  terrainType,
  baseReport:baseGlobe.report(),
  zonedReport:zonedGlobe.report(),
  sourceProbe,
  zone:{configuredCount:configuredZoneCount,recipe:zoneRecipe,siteElevation:site.terrain.elevation,rawHeight},
  geometryDelta,
  noVoxelRuntime:true,
  runtimeImports:[
    'travel/globe-v13/globe.js',
    'travel/globe-v13/terrain-surface.js',
    'travel/globe-v13/simplex-noise.js',
    'travel/globe-v13/globe-biome.js',
    'travel/globe-v13/sky-presets.js'
  ]
};

status.textContent='CURRENT TRAVEL GLOBE · TINYSKIES-DERIVED DONOR · NO TRACK';
metrics.textContent=
  `${baseGlobe.report().vertices.toLocaleString()} verts each · `+
  `${geometryDelta.changedVertices.toLocaleString()} verts changed by existing Travel terrain zone · `+
  `max radial delta ${geometryDelta.maxDelta.toFixed(3)}`;

let drag=false,lastX=0,lastY=0;
renderer.domElement.addEventListener('pointerdown',e=>{drag=true;lastX=e.clientX;lastY=e.clientY;renderer.domElement.setPointerCapture?.(e.pointerId);});
renderer.domElement.addEventListener('pointerup',()=>drag=false);
renderer.domElement.addEventListener('pointercancel',()=>drag=false);
renderer.domElement.addEventListener('pointermove',e=>{
  if(!drag)return;
  yaw+=(e.clientX-lastX)*.005;
  pitch=Math.max(-1.1,Math.min(1.1,pitch+(e.clientY-lastY)*.004));
  lastX=e.clientX;lastY=e.clientY;applyOrientation();
});
renderer.domElement.addEventListener('wheel',e=>{
  e.preventDefault();
  camera.position.z=Math.max(20,Math.min(38,camera.position.z*Math.exp(e.deltaY*.001)));
},{passive:false});

addEventListener('resize',()=>{
  renderer.setSize(innerWidth,innerHeight,false);
  camera.aspect=innerWidth/innerHeight;
  camera.updateProjectionMatrix();
});

let last=performance.now();
function frame(now){
  const dt=Math.min(.05,(now-last)/1000||0);last=now;
  baseGlobe.update(dt);
  zonedGlobe.update(dt);
  renderer.render(scene,camera);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
