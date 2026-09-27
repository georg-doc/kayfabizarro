import * as THREE from 'three';
import { deformPoint } from './cartoon-city.js';

const SOURCE_PIN='6fb02674ea4344169778c0ae9e76b2543f1d78f9';
const NORMALIZED_BLOB='14d3f09da6e14fb7f5dc9478f78be9f876bffab9';
const FIELD_ID='cartoon-city.js#deformPoint:GLOBAL_SOURCE_MASS_V2';
const SOURCE_OSM='way/23574173';
const SOURCE_HEIGHT_M=46.5;
const VERTICAL_STEPS=24;

// Exact cached normalized.json footprint for way/23574173 @ NORMALIZED_BLOB.
// Closing point is omitted here; all 18 unique source points are preserved.
const SOURCE_FOOTPRINT_WORLD=Object.freeze([
  [-622.191,-179.837],[-608.31,-178.245],[-610.372,-160.311],[-610.884,-160.367],
  [-611.024,-159.153],[-624.225,-160.667],[-629.317,-161.257],[-636.577,-162.081],
  [-645.191,-163.072],[-654.569,-164.152],[-659.872,-164.753],[-658.995,-172.423],
  [-657.845,-182.453],[-657.676,-183.911],[-652.374,-183.299],[-643.669,-182.297],
  [-634.424,-181.239],[-627.122,-180.404]
].map(([x,z])=>Object.freeze({x,z})));

const cx=SOURCE_FOOTPRINT_WORLD.reduce((a,p)=>a+p.x,0)/SOURCE_FOOTPRINT_WORLD.length;
const cz=SOURCE_FOOTPRINT_WORLD.reduce((a,p)=>a+p.z,0)/SOURCE_FOOTPRINT_WORLD.length;
const RING=Object.freeze(SOURCE_FOOTPRINT_WORLD.map(p=>Object.freeze({x:p.x-cx,z:p.z-cz})));

const PROFILES=Object.freeze({
  source:{label:'SOURCE',bendX:0,bendZ:0,leanX:0,leanZ:0,taper:0,twistDeg:0},
  elastic:{label:'CURRENT_ELASTIC_NO_TWIST',bendX:.022,bendZ:.016,leanX:.025,leanZ:-.012,taper:.095,twistDeg:0},
  lowBuilding:{label:'COLOGNE_BUILDING_ELASTIC_LOW_REFERENCE',bendX:.022,bendZ:.016,leanX:.025,leanZ:-.012,taper:.095,twistDeg:2.6},
  hero:{label:'ELASTIC_TORSION_HERO_DEFAULT',bendX:.022,bendZ:.016,leanX:.025,leanZ:-.012,taper:.095,twistDeg:9.5},
  cityGrotesque:{label:'CITY_GROTESQUE_STRONG_REFERENCE',bendX:.022,bendZ:.016,leanX:.025,leanZ:-.012,taper:.095,twistDeg:11},
  landmarkEvidence:{label:'CURRENT_LANDMARK_ELASTIC_EVIDENCE',bendX:.022,bendZ:.016,leanX:.025,leanZ:-.012,taper:.095,twistDeg:13.2}
});

function sourceGeometry(){
  const n=RING.length,pos=[],idx=[];
  for(let s=0;s<=VERTICAL_STEPS;s++){
    const y=SOURCE_HEIGHT_M*s/VERTICAL_STEPS;
    for(const q of RING)pos.push(q.x,y,q.z);
  }
  for(let s=0;s<VERTICAL_STEPS;s++)for(let i=0;i<n;i++){
    const j=(i+1)%n,a=s*n+i,b=s*n+j,c=(s+1)*n+j,d=(s+1)*n+i;
    idx.push(a,b,d,b,c,d);
  }
  const contour=RING.map(q=>new THREE.Vector2(q.x,q.z));
  const top=VERTICAL_STEPS*n;
  const tris=THREE.ShapeUtils.triangulateShape(contour,[]);
  for(const t of tris){
    idx.push(top+t[0],top+t[1],top+t[2]);
    idx.push(t[2],t[1],t[0]);
  }
  const g=new THREE.BufferGeometry();
  g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));
  g.setIndex(idx);
  g.computeVertexNormals();
  g.userData.sourceBase=g.attributes.position.array.slice();
  g.userData.topology={
    verticalSteps:VERTICAL_STEPS,ringVertices:n,
    sharedTopRingIndices:true,roofBoundaryUsesSideRing:true,
    roofAndBodySameIndexedMesh:true,topTriangles:tris.length,bottomTriangles:tris.length
  };
  return g;
}

function paramsFor(profile){
  return {
    bendX:profile.bendX,bendZ:profile.bendZ,leanX:profile.leanX,leanZ:profile.leanZ,
    taper:profile.taper,twist:THREE.MathUtils.degToRad(profile.twistDeg),
    stackOffsets:[{x:0,z:0}]
  };
}
const frame={minY:0,h:SOURCE_HEIGHT_M,cx:0,cz:0};

function applyProfile(variant,profile){
  const pos=variant.mesh.geometry.attributes.position;
  const base=variant.mesh.geometry.userData.sourceBase;
  const p=paramsFor(profile);
  for(let i=0;i<pos.count;i++){
    const a={x:base[i*3],y:base[i*3+1],z:base[i*3+2]};
    const q=deformPoint(a,frame,p);
    pos.setXYZ(i,q.x,q.y,q.z);
  }
  pos.needsUpdate=true;
  variant.mesh.geometry.computeVertexNormals();
  variant.mesh.geometry.computeBoundingBox();
  variant.mesh.geometry.computeBoundingSphere();
  variant.profile={...profile};
  updateGuides(variant);
}

function updateGuides(variant){
  const pos=variant.mesh.geometry.attributes.position,n=RING.length,line=[];
  const push=(a,b)=>line.push(pos.getX(a),pos.getY(a),pos.getZ(a),pos.getX(b),pos.getY(b),pos.getZ(b));
  for(let s=0;s<=VERTICAL_STEPS;s+=3){
    for(let i=0;i<n;i++)push(s*n+i,s*n+(i+1)%n);
  }
  for(let i=0;i<n;i+=3)for(let s=0;s<VERTICAL_STEPS;s++)push(s*n+i,(s+1)*n+i);
  variant.guides.geometry.setAttribute('position',new THREE.Float32BufferAttribute(line,3));
  variant.guides.geometry.computeBoundingSphere();
}

function buildVariant(profile){
  const g=sourceGeometry();
  const mesh=new THREE.Mesh(g,new THREE.MeshStandardMaterial({color:0xc7c0b6,roughness:.96,metalness:0,side:THREE.DoubleSide}));
  mesh.castShadow=false;mesh.receiveShadow=false;
  const guides=new THREE.LineSegments(new THREE.BufferGeometry(),new THREE.LineBasicMaterial({color:0x6c665e,transparent:true,opacity:.34}));
  const root=new THREE.Group();root.add(mesh,guides);
  const v={root,mesh,guides,profile:null};
  applyProfile(v,profile);
  return v;
}

function baseAnchorError(profile){
  const p=paramsFor(profile);
  return Math.max(...RING.map(a=>{
    const q=deformPoint({x:a.x,y:0,z:a.z},frame,p);
    return Math.hypot(q.x-a.x,q.y,q.z-a.z);
  }));
}
function topRotationProbe(profile){
  const p=paramsFor(profile),a={x:RING[0].x,y:SOURCE_HEIGHT_M,z:RING[0].z};
  const q=deformPoint(a,frame,p);
  return Math.hypot(q.x-a.x,q.z-a.z);
}

const source=buildVariant(PROFILES.source);
const elastic=buildVariant(PROFILES.elastic);
const torsion=buildVariant(PROFILES.hero);
let activeTwist=PROFILES.hero.twistDeg,cameraSkew=false,view='oblique',geometryRevision=1;

const panels=[
  makePanel(document.querySelector('#source'),source),
  makePanel(document.querySelector('#elastic'),elastic),
  makePanel(document.querySelector('#torsion'),torsion)
];

function makePanel(canvas,variant){
  const renderer=new THREE.WebGLRenderer({canvas,antialias:true});
  renderer.setPixelRatio(Math.min(2,window.devicePixelRatio||1));
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.shadowMap.enabled=false;
  const scene=new THREE.Scene();scene.background=new THREE.Color(0xd5d0c8);
  scene.add(new THREE.HemisphereLight(0xffffff,0x777069,2.1));
  const key=new THREE.DirectionalLight(0xffffff,2.25);key.position.set(70,100,60);scene.add(key);
  const ground=new THREE.Mesh(new THREE.PlaneGeometry(120,120),new THREE.MeshStandardMaterial({color:0xb8b2a9,roughness:1}));
  ground.rotation.x=-Math.PI/2;ground.position.y=-.03;scene.add(ground);
  scene.add(variant.root);
  const camera=new THREE.PerspectiveCamera(34,1,.1,600);
  const render=()=>renderer.render(scene,camera);
  const resize=()=>{const r=canvas.getBoundingClientRect();renderer.setSize(Math.max(1,r.width),Math.max(1,r.height),false);camera.aspect=Math.max(1,r.width)/Math.max(1,r.height);camera.updateProjectionMatrix();render();};
  new ResizeObserver(resize).observe(canvas);
  return {renderer,scene,camera,render,isWebGL2:renderer.capabilities.isWebGL2};
}

function applyCamera(){
  const poses={oblique:[.72,.42,.78],front:[0,.30,1],side:[1,.30,0]};
  const d=poses[view],L=Math.hypot(...d),dist=102,target=new THREE.Vector3(0,22,0);
  panels.forEach(p=>{p.camera.position.set(d[0]/L*dist,target.y+d[1]/L*dist,d[2]/L*dist);p.camera.filmOffset=cameraSkew?7.5:0;p.camera.lookAt(target);p.camera.updateProjectionMatrix();p.render();});
}
function profileAt(deg){
  const d=Number(deg);
  const label=d===2.6?PROFILES.lowBuilding.label:d===11?PROFILES.cityGrotesque.label:d===13.2?PROFILES.landmarkEvidence.label:PROFILES.hero.label;
  return {...PROFILES.hero,twistDeg:d,label};
}
function setTorsion(deg){
  activeTwist=Number(deg);
  applyProfile(torsion,profileAt(activeTwist));
  geometryRevision++;updateMeta();panels[2].render();
}
function setSkew(on){cameraSkew=Boolean(on);document.querySelector('#skew').textContent=cameraSkew?'CAMERA SKEW ON':'CAMERA SKEW OFF';document.querySelector('#skew').classList.toggle('active',cameraSkew);applyCamera();}
function setView(v){view=v;document.querySelectorAll('[data-view]').forEach(b=>b.classList.toggle('active',b.dataset.view===view));applyCamera();}
function f(n,d=2){return Number(n).toFixed(d);}
function updateMeta(){
  document.querySelector('#source-meta').textContent=`way/23574173 · 46.5 m · exact 18-point cached footprint · 24 vertical steps`;
  document.querySelector('#elastic-meta').textContent=`bend/lean/taper · twist 0° · shared indexed roof/body ring · base error ${f(baseAnchorError(PROFILES.elastic),6)} m`;
  document.querySelector('#torsion-meta').textContent=`twist ${f(activeTwist,1)}° cumulative · top probe Δ ${f(topRotationProbe(profileAt(activeTwist)),2)} m · base error ${f(baseAnchorError(profileAt(activeTwist)),6)} m`;
}
document.querySelectorAll('[data-torsion]').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('[data-torsion]').forEach(b=>b.classList.remove('active'));btn.classList.add('active');setTorsion(btn.dataset.torsion);}));
document.querySelector('#skew').addEventListener('click',()=>setSkew(!cameraSkew));
document.querySelectorAll('[data-view]').forEach(btn=>btn.addEventListener('click',()=>setView(btn.dataset.view)));
updateMeta();applyCamera();

function report(){
  const p=profileAt(activeTwist),topology=torsion.mesh.geometry.userData.topology;
  return {
    schema:'kfb.look-torsion-01/1.1-candidate',
    owner:'OSM City Lab presentation / KFB ToolBox authoring',
    source:{
      repo:'georg-doc/kayfabizarro',commit:SOURCE_PIN,
      normalizedBlob:NORMALIZED_BLOB,osm:SOURCE_OSM,heightM:SOURCE_HEIGHT_M,
      representation:'CACHED_OSM_FOOTPRINT_EXTRUSION',
      footprintPoints:RING.length,worldCenter:{x:cx,z:cz},
      geometryExactInA:true,sourceRuntimeFetch:false
    },
    panels:['SOURCE','CURRENT_ELASTIC_IDEA','ELASTIC_PLUS_TORSION'],
    sameSourceObjectFamily:true,
    profiles:{bTwistDeg:0,lowBuildingReferenceDeg:2.6,cHeroDefaultDeg:9.5,cityGrotesqueStrongReferenceDeg:11,currentLandmarkEvidenceDeg:13.2,activeCTwistDeg:activeTwist},
    deformation:{field:FIELD_ID,heightDependent:true,cumulativeTwist:true,bendLeanTaper:true,sharedRoofBodyFinalField:true,elastic:{...PROFILES.elastic},torsion:p},
    topology:{...topology,segmentHeightM:SOURCE_HEIGHT_M/VERTICAL_STEPS},
    anchors:{elasticBaseErrorM:baseAnchorError(PROFILES.elastic),torsionBaseErrorM:baseAnchorError(p)},
    read:{activeTopProbeDisplacementM:topRotationProbe(p),segmentGuides:true},
    review:{neutralSimpleLighting:true,shadows:false,cameraSkew,cameraSkewIsPresentationOnly:true,view,geometryRevision},
    webgl2:Object.fromEntries(panels.map((p,i)=>[['source','elastic','torsion'][i],p.isWebGL2])),
    protected:{huerthR2Edited:false,huerthR2RuntimeImported:false,collisionOwnerChanged:false}
  };
}
window.__KFB_LOOK_TORSION_01__=Object.freeze({report,setTorsion,setSkew,setView});
