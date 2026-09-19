import * as THREE from 'three';
import { createGlobe } from '/travel/wip/travel_globe_wsa/globe-v13/globe.js';
import {
  setTerrainZones,
  terrainZoneCount,
  rawDisplacementAt,
  surfaceAltitudeAt
} from '/travel/wip/travel_globe_wsa/globe-v13/terrain-surface.js';
import { compileTrackCorridorZones } from './track-corridor-zones.mjs';
import { sampleTerrain, setKontinentHook } from '/travel/wip/travel_globe_wsa/globe-v13/simplex-noise.js';
import { setBiome } from '/travel/wip/travel_globe_wsa/globe-v13/globe-biome.js';
import { weltAusId, weltHaken } from '/travel/wip/travel_globe_wsa/globe-v13/welt-id.js';
import { erdeZuschlag } from '/travel/wip/travel_globe_wsa/globe-v13/erde-maske.js';
import { getSkyPreset, paintRadialSky, buildLightRig } from '/travel/wip/travel_globe_wsa/globe-v13/sky-presets.js';

const WORLD_ID='W1-anti_rules_toolkit-default-E0-D0-M-18';
const TRAVEL_BASE='8614282aab2ced43bb5dda9fcf7abadf9768100a';
const TINYSKIES_PIN='2659a5cc987d7e4a4c5aa7e79c86a1626ad75df6';
const RADIUS=5;
const SEGMENTS=256;
const ROAD_HALF_WORLD=.16;
const SHOULDER_WORLD=.30;
const ROUTE_SAMPLES=45;
const ROUTE_SPAN=.62;

const mount=document.querySelector('#view');
const status=document.querySelector('#status');
const metrics=document.querySelector('#metrics');

function fibonacciDirections(count=420){
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
function tangentFrame(n){
  const helper=Math.abs(n.y)<.86?new THREE.Vector3(0,1,0):new THREE.Vector3(1,0,0);
  const ex=new THREE.Vector3().crossVectors(helper,n).normalize();
  const ev=new THREE.Vector3().crossVectors(n,ex).normalize();
  return {ex,ev};
}
function dirAt(anchor,tangent,ang){
  return anchor.clone().multiplyScalar(Math.cos(ang))
    .addScaledVector(tangent,Math.sin(ang)).normalize();
}
function routeCandidate(anchor,tangent,seed,terrainType){
  const pts=[]; let land=0,minE=Infinity,maxE=-Infinity;
  for(let i=0;i<ROUTE_SAMPLES;i++){
    const u=i/(ROUTE_SAMPLES-1);
    const a=(u-.5)*ROUTE_SPAN;
    const n=dirAt(anchor,tangent,a);
    const t=sampleTerrain(seed,terrainType,n.x,n.y,n.z);
    if(t.isLand)land++;
    minE=Math.min(minE,t.elevation);maxE=Math.max(maxE,t.elevation);
    pts.push({n,t,u});
  }
  return {pts,landFraction:land/ROUTE_SAMPLES,elevationRange:maxE-minE};
}
function chooseRoute(seed,terrainType){
  let best=null;
  for(const anchor of fibonacciDirections()){
    const center=sampleTerrain(seed,terrainType,anchor.x,anchor.y,anchor.z);
    if(!center.isLand||center.elevation<.22||center.elevation>.72)continue;
    const {ex,ev}=tangentFrame(anchor);
    for(let k=0;k<14;k++){
      const a=(k/14)*Math.PI;
      const tangent=ex.clone().multiplyScalar(Math.cos(a)).addScaledVector(ev,Math.sin(a)).normalize();
      const c=routeCandidate(anchor,tangent,seed,terrainType);
      const score=c.landFraction*3+Math.min(.7,c.elevationRange);
      if((!best||score>best.score)&&c.landFraction>.96)best={...c,anchor:anchor.clone(),tangent,score};
    }
  }
  if(!best)throw new Error('No suitable all-land Travel route found');
  return best;
}
function smoothHeights(src,passes=4){
  let a=src.slice();
  for(let p=0;p<passes;p++){
    const b=a.slice();
    for(let i=1;i<a.length-1;i++)b[i]=(a[i-1]+a[i]*2+a[i+1])/4;
    a=b;
  }
  return a;
}
function compareGeometry(a,b){
  const A=a.mesh.geometry.attributes.position,B=b.mesh.geometry.attributes.position;
  let changed=0,maxDelta=0,sum=0;
  for(let i=0;i<Math.min(A.count,B.count);i++){
    const d=Math.hypot(A.getX(i)-B.getX(i),A.getY(i)-B.getY(i),A.getZ(i)-B.getZ(i));
    if(d>1e-6){changed++;sum+=d;maxDelta=Math.max(maxDelta,d);}
  }
  return {vertices:Math.min(A.count,B.count),changedVertices:changed,changedFraction:changed/Math.min(A.count,B.count),maxDelta,meanChangedDelta:changed?sum/changed:0};
}
function buildRoad(routePoints,seed,terrainType){
  const pos=[],idx=[],left=[],right=[];
  for(let i=0;i<routePoints.length;i++){
    const p=routePoints[i];
    const prev=routePoints[Math.max(0,i-1)].n;
    const next=routePoints[Math.min(routePoints.length-1,i+1)].n;
    const forward=next.clone().sub(prev).projectOnPlane(p.n).normalize();
    const side=new THREE.Vector3().crossVectors(forward,p.n).normalize();
    const w=ROAD_HALF_WORLD/RADIUS;
    const l=p.n.clone().multiplyScalar(Math.cos(w)).addScaledVector(side,Math.sin(w)).normalize();
    const r=p.n.clone().multiplyScalar(Math.cos(w)).addScaledVector(side,-Math.sin(w)).normalize();
    const la=surfaceAltitudeAt(seed,terrainType,l.x,l.y,l.z);
    const ra=surfaceAltitudeAt(seed,terrainType,r.x,r.y,r.z);
    const lp=l.clone().multiplyScalar(RADIUS+la+.012);
    const rp=r.clone().multiplyScalar(RADIUS+ra+.012);
    left.push(lp.clone());right.push(rp.clone());
    pos.push(lp.x,lp.y,lp.z,rp.x,rp.y,rp.z);
    if(i<routePoints.length-1){
      const a=i*2,b=a+1,c=a+3,d=a+2;
      idx.push(a,b,c,a,c,d);
    }
  }
  const g=new THREE.BufferGeometry();
  g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));
  g.setIndex(idx);g.computeVertexNormals();
  const road=new THREE.Mesh(g,new THREE.MeshStandardMaterial({color:0x26262a,roughness:.9,metalness:0,side:THREE.DoubleSide}));
  road.name='TC-01 visual Track ribbon';

  const edgeMat=new THREE.LineBasicMaterial({color:0xe8dfc5,transparent:true,opacity:.94});
  const lGeo=new THREE.BufferGeometry().setFromPoints(left);
  const rGeo=new THREE.BufferGeometry().setFromPoints(right);
  const lLine=new THREE.Line(lGeo,edgeMat),rLine=new THREE.Line(rGeo,edgeMat);
  lLine.name='TC-01 left edge';rLine.name='TC-01 right edge';

  const group=new THREE.Group();group.add(road,lLine,rLine);
  return {group,road,left,right};
}

const world=weltAusId(WORLD_ID);
if(!world)throw new Error('Travel world id failed');
const seed=world.seed,terrainType=world.typ;
setKontinentHook(weltHaken(world,erdeZuschlag));
setBiome({on:true,seed,baseType:terrainType,strength:1,sharp:4.5});
setTerrainZones([]);

const preset=getSkyPreset('day');
const renderer=new THREE.WebGLRenderer({antialias:true});
renderer.setPixelRatio(Math.min(devicePixelRatio||1,2));
renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.setSize(innerWidth,innerHeight,false);
mount.appendChild(renderer.domElement);

const scene=new THREE.Scene();
scene.background=paintRadialSky(THREE,preset);
scene.fog=new THREE.Fog(preset.fogColor,preset.fogNear*2.2,preset.fogFar*3.5);
buildLightRig(THREE,scene,preset);

const camera=new THREE.PerspectiveCamera(38,innerWidth/innerHeight,.05,100);
camera.position.set(0,1.2,26);camera.lookAt(0,0,0);

const route=chooseRoute(seed,terrainType);
const raw=route.pts.map(p=>rawDisplacementAt(seed,terrainType,p.n.x,p.n.y,p.n.z));
const smooth=smoothHeights(raw,5);
const target=smooth.map((h,i)=>{
  const u=i/(smooth.length-1);
  const authored=.032*Math.sin(u*Math.PI*2-.7)+.018*Math.sin(u*Math.PI*4+.5);
  return Math.max(.024,h+authored);
});
const corridorPoints=route.pts.map((p,i)=>({n:p.n,height:target[i]}));

const baseGlobe=createGlobe({
  THREE,radius:RADIUS,segments:SEGMENTS,seed,terrainType,biomeTint:.34,
  atmosphereGlow:preset.atmosphereGlow,rimColor:preset.rimColor,cloudOpacity:preset.cloudOpacity,
  oceanShallow:preset.oceanShallow,oceanDeep:preset.oceanDeep,oceanFoam:preset.oceanFoam
});
baseGlobe.group.position.x=-6.2;scene.add(baseGlobe.group);

const corridorZones=compileTrackCorridorZones({
  THREE,
  routePoints:route.pts,
  heights:target,
  globeRadius:RADIUS,
  halfWidthWorld:ROAD_HALF_WORLD,
  shoulderWorld:SHOULDER_WORLD,
  maxGrade:.34
});
setTerrainZones(corridorZones);
const corridorCount=terrainZoneCount();
const corridorGlobe=createGlobe({
  THREE,radius:RADIUS,segments:SEGMENTS,seed,terrainType,biomeTint:.34,
  atmosphereGlow:preset.atmosphereGlow,rimColor:preset.rimColor,cloudOpacity:preset.cloudOpacity,
  oceanShallow:preset.oceanShallow,oceanDeep:preset.oceanDeep,oceanFoam:preset.oceanFoam
});
corridorGlobe.group.position.x=6.2;scene.add(corridorGlobe.group);

const road=buildRoad(route.pts,seed,terrainType);
road.group.position.x=6.2;scene.add(road.group);

const geometryDelta=compareGeometry(baseGlobe,corridorGlobe);
const centerChecks=corridorPoints.map((p,i)=>{
  const actual=surfaceAltitudeAt(seed,terrainType,p.n.x,p.n.y,p.n.z);
  const rawHeight=raw[i];
  return {
    i,target:p.height,actual,raw:rawHeight,
    error:Math.abs(actual-p.height),
    changed:Math.abs(actual-rawHeight)
  };
});
const maxCenterError=Math.max(...centerChecks.map(x=>x.error));
const maxCenterDelta=Math.max(...centerChecks.map(x=>x.changed));
const changedCenterSamples=centerChecks.filter(x=>x.changed>.005).length;

// Clean shared owner after baking. The already-built proof geometry stays unchanged.
setTerrainZones([]);

const mid=route.pts[(route.pts.length/2)|0].n;
const viewQ=new THREE.Quaternion().setFromUnitVectors(mid,new THREE.Vector3(0,0,1));
let yaw=0,pitch=0;
function orient(){
  const qUser=new THREE.Quaternion().setFromEuler(new THREE.Euler(pitch,yaw,0,'YXZ'));
  const q=qUser.multiply(viewQ.clone());
  baseGlobe.group.quaternion.copy(q);
  corridorGlobe.group.quaternion.copy(q);
  road.group.quaternion.copy(q);
}
orient();

renderer.render(scene,camera);
const sourceProbe=typeof corridorGlobe.quellenProbe==='function'?corridorGlobe.quellenProbe():null;

window.__KFB_TC01__={
  ready:true,
  id:'kfb-travel-track-terrain-corridor-tc01',
  owner:'georg-doc/KFB-Travel-Globe',
  travelBase:TRAVEL_BASE,
  tinySkiesPin:TINYSKIES_PIN,
  worldId:WORLD_ID,
  seed,terrainType,
  route:{samples:route.pts.length,spanRad:ROUTE_SPAN,landFraction:route.landFraction,elevationRange:route.elevationRange},
  corridor:{
    count:corridorCount,
    mode:'EMBEDDED_VIA_EXISTING_TERRAIN_ZONES',
    halfWidthWorld:ROAD_HALF_WORLD,
    shoulderWorld:SHOULDER_WORLD,
    points:corridorPoints.length,
    zones:corridorZones.length,
    maxCenterError,
    maxCenterDelta,
    changedCenterSamples
  },
  geometryDelta,
  baseReport:baseGlobe.report(),
  corridorReport:corridorGlobe.report(),
  sourceProbe,
  noVoxelRuntime:true,
  noRacePhysics:true
};

status.textContent='TC-01 · ONE TRAVEL TERRAIN OWNER · EMBEDDED SPHERICAL TRACK CORRIDOR';
metrics.textContent=
  `${geometryDelta.changedVertices.toLocaleString()} / ${geometryDelta.vertices.toLocaleString()} Globe vertices reshaped · `+
  `max Δ ${geometryDelta.maxDelta.toFixed(3)} · route center error ${maxCenterError.toFixed(4)}`;

let drag=false,lastX=0,lastY=0;
renderer.domElement.addEventListener('pointerdown',e=>{drag=true;lastX=e.clientX;lastY=e.clientY;renderer.domElement.setPointerCapture?.(e.pointerId)});
renderer.domElement.addEventListener('pointerup',()=>drag=false);
renderer.domElement.addEventListener('pointercancel',()=>drag=false);
renderer.domElement.addEventListener('pointermove',e=>{
  if(!drag)return;
  yaw+=(e.clientX-lastX)*.005;
  pitch=Math.max(-1.1,Math.min(1.1,pitch+(e.clientY-lastY)*.004));
  lastX=e.clientX;lastY=e.clientY;orient();
});
renderer.domElement.addEventListener('wheel',e=>{
  e.preventDefault();
  camera.position.z=Math.max(20,Math.min(38,camera.position.z*Math.exp(e.deltaY*.001)));
},{passive:false});

addEventListener('resize',()=>{
  renderer.setSize(innerWidth,innerHeight,false);
  camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();
});

let last=performance.now();
function frame(now){
  const dt=Math.min(.05,(now-last)/1000||0);last=now;
  baseGlobe.update(dt);corridorGlobe.update(dt);
  renderer.render(scene,camera);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
