import * as THREE from 'three';
import { buildDom } from '../../../KFB-ToolBox/_inbox/KFB Cologne Race Option C-2/lab-v9/cologne-world.v1.js';
import { deformPoint } from '../../src/style/cartoon-city.js';

const SOURCE_PIN='6fb02674ea4344169778c0ae9e76b2543f1d78f9';
const FIELD_ID='cartoon-city.js#deformPoint:GLOBAL_LANDMARK_ROOT_V1';
const TESS_SOURCE='WB-D2 wd1-landmark.js#tessellateY';
const SOURCE_OSM='way/4532022';
const SOURCE_HEIGHT_M=157.38;
const SOURCE_DONOR='tools/img2threejs/prototypes/koelner-dom/v0.2/index.html';

const PROFILES=Object.freeze({
  elastic:{
    label:'CURRENT_ELASTIC_NO_TWIST',
    bendX:.022,bendZ:.016,leanX:.025,leanZ:-.012,taper:.095,twistDeg:0
  },
  lowBuilding:{
    label:'COLOGNE_BUILDING_ELASTIC_LOW_REFERENCE',
    bendX:.022,bendZ:.016,leanX:.025,leanZ:-.012,taper:.095,twistDeg:2.6
  },
  hero:{
    label:'ELASTIC_TORSION_HERO_DEFAULT',
    bendX:.022,bendZ:.016,leanX:.025,leanZ:-.012,taper:.095,twistDeg:9.5
  },
  cityGrotesque:{
    label:'CITY_GROTESQUE_STRONG_REFERENCE',
    bendX:.022,bendZ:.016,leanX:.025,leanZ:-.012,taper:.095,twistDeg:11
  },
  landmarkEvidence:{
    label:'CURRENT_LANDMARK_ELASTIC_EVIDENCE',
    bendX:.022,bendZ:.016,leanX:.025,leanZ:-.012,taper:.095,twistDeg:13.2
  }
});

const neutralMat=()=>new THREE.MeshStandardMaterial({
  color:0xc7c0b6,roughness:1,metalness:0,flatShading:false
});

function neutralize(root){
  const mat=neutralMat();
  root.traverse(o=>{
    if(!o.isMesh)return;
    o.material=mat;
    o.castShadow=false;
    o.receiveShadow=false;
  });
}

function meshStats(root){
  let meshes=0,vertices=0,triangles=0,roofMeshes=0,bodyMeshes=0;
  root.traverse(o=>{
    if(!o.isMesh)return;
    meshes++;
    const p=o.geometry.getAttribute('position');
    vertices+=p?.count||0;
    triangles+=o.geometry.index?o.geometry.index.count/3:(p?.count||0)/3;
    if(String(o.name).startsWith('roof-'))roofMeshes++;
    else bodyMeshes++;
  });
  return {meshes,vertices,triangles:Math.round(triangles),roofMeshes,bodyMeshes};
}

// Exact helper grammar from the current WB-D2 LandmarkElastic donor:
// tall Box/Cone/Cylinder meshes receive ~1.5 donor-unit vertical bands before deformation.
function tessellateY(root){
  let replaced=0,maxHeightSegments=0;
  root.traverse(o=>{
    if(!o.isMesh)return;
    const g=o.geometry,p=g.parameters||{};
    const seg=h=>Math.max(2,Math.ceil(h/1.5));
    let n=null;
    if(g.type==='BoxGeometry'&&p.height>3){
      const hs=seg(p.height);maxHeightSegments=Math.max(maxHeightSegments,hs);
      n=new THREE.BoxGeometry(p.width,p.height,p.depth,1,hs,1);
    }else if(g.type==='ConeGeometry'&&p.height>3){
      const hs=seg(p.height);maxHeightSegments=Math.max(maxHeightSegments,hs);
      n=new THREE.ConeGeometry(p.radius,p.height,p.radialSegments,hs,p.openEnded);
    }else if(g.type==='CylinderGeometry'&&p.height>3){
      const hs=seg(p.height);maxHeightSegments=Math.max(maxHeightSegments,hs);
      n=new THREE.CylinderGeometry(p.radiusTop,p.radiusBottom,p.height,p.radialSegments,hs,p.openEnded,p.thetaStart,p.thetaLength);
    }
    if(n){g.dispose();o.geometry=n;replaced++;}
    o.geometry.userData.lookTorsionBase=o.geometry.attributes.position.array.slice();
  });
  return {method:TESS_SOURCE,replacedMeshes:replaced,maxHeightSegments,verticalBandDonorUnits:1.5};
}

function rootLocalBounds(root){
  root.updateMatrixWorld(true);
  const inv=root.matrixWorld.clone().invert();
  const out=new THREE.Box3();
  const b=new THREE.Box3();
  root.traverse(m=>{
    if(!m.isMesh)return;
    m.geometry.computeBoundingBox();
    const M=inv.clone().multiply(m.matrixWorld);
    b.copy(m.geometry.boundingBox).applyMatrix4(M);
    out.union(b);
  });
  return out;
}

function restore(root){
  root.traverse(m=>{
    if(!m.isMesh)return;
    const base=m.geometry.userData.lookTorsionBase;
    if(!base)return;
    const pos=m.geometry.attributes.position;
    for(let i=0;i<pos.count;i++)pos.setXYZ(i,base[i*3],base[i*3+1],base[i*3+2]);
    pos.needsUpdate=true;
  });
}

function paramsFor(profile){
  return {
    bendX:profile.bendX,bendZ:profile.bendZ,
    leanX:profile.leanX,leanZ:profile.leanZ,
    taper:profile.taper,
    twist:THREE.MathUtils.degToRad(profile.twistDeg),
    stackOffsets:[{x:0,z:0}]
  };
}

function applyField(root,profile,bounds){
  restore(root);
  root.updateMatrixWorld(true);
  const inv=root.matrixWorld.clone().invert();
  const frame={
    minY:bounds.min.y,
    h:Math.max(1e-6,bounds.max.y-bounds.min.y),
    cx:(bounds.min.x+bounds.max.x)/2,
    cz:(bounds.min.z+bounds.max.z)/2
  };
  const p=paramsFor(profile);
  const v=new THREE.Vector3();
  let deformedMeshes=0,roofMeshes=0,bodyMeshes=0;
  root.traverse(m=>{
    if(!m.isMesh)return;
    const base=m.geometry.userData.lookTorsionBase;
    if(!base)return;
    const M=inv.clone().multiply(m.matrixWorld),Mi=M.clone().invert();
    const pos=m.geometry.attributes.position;
    for(let i=0;i<pos.count;i++){
      v.fromArray(base,i*3).applyMatrix4(M);
      const q=deformPoint({x:v.x,y:v.y,z:v.z},frame,p);
      v.set(q.x,q.y,q.z).applyMatrix4(Mi);
      pos.setXYZ(i,v.x,v.y,v.z);
    }
    pos.needsUpdate=true;
    m.geometry.computeVertexNormals();
    m.geometry.computeBoundingBox();
    m.geometry.computeBoundingSphere();
    deformedMeshes++;
    if(String(m.name).startsWith('roof-'))roofMeshes++;else bodyMeshes++;
  });
  return {field:FIELD_ID,deformedMeshes,roofMeshes,bodyMeshes,frame,profile:{...profile}};
}

function baseAnchorError(profile,bounds){
  const f={
    minY:bounds.min.y,
    h:Math.max(1e-6,bounds.max.y-bounds.min.y),
    cx:(bounds.min.x+bounds.max.x)/2,
    cz:(bounds.min.z+bounds.max.z)/2
  };
  const p=paramsFor(profile);
  const probes=[
    {x:bounds.min.x,y:bounds.min.y,z:bounds.min.z},
    {x:bounds.max.x,y:bounds.min.y,z:bounds.min.z},
    {x:bounds.min.x,y:bounds.min.y,z:bounds.max.z},
    {x:bounds.max.x,y:bounds.min.y,z:bounds.max.z}
  ];
  return Math.max(...probes.map(a=>{
    const q=deformPoint(a,f,p);
    return Math.hypot(q.x-a.x,q.y-a.y,q.z-a.z);
  }));
}

function buildVariant(kind,profile){
  const built=buildDom(THREE,{x:0,z:0});
  const root=built.group;
  const exactStats=meshStats(root);
  neutralize(root);
  if(kind==='source'){
    return {kind,built,root,exactStats,stats:meshStats(root),tess:null,bounds:rootLocalBounds(root),field:null};
  }
  const tess=tessellateY(root);
  const bounds=rootLocalBounds(root);
  const field=applyField(root,profile,bounds);
  return {kind,built,root,exactStats,stats:meshStats(root),tess,bounds,field};
}

const source=buildVariant('source',null);
const elastic=buildVariant('elastic',PROFILES.elastic);
const torsion=buildVariant('torsion',PROFILES.hero);

const sourceBounds=rootLocalBounds(source.root);
const sourceCenter=sourceBounds.getCenter(new THREE.Vector3());
const sourceSize=sourceBounds.getSize(new THREE.Vector3());
const target=new THREE.Vector3(sourceCenter.x,sourceBounds.min.y+sourceSize.y*.47,sourceCenter.z);
const distance=Math.max(sourceSize.y*2.20,sourceSize.length()*1.45);

const panels=[
  makePanel(document.querySelector('#source'),source),
  makePanel(document.querySelector('#elastic'),elastic),
  makePanel(document.querySelector('#torsion'),torsion)
];

let activeTwist=PROFILES.hero.twistDeg;
let cameraSkew=false;
let view='oblique';
let geometryRevision=1;

function makePanel(canvas,variant){
  const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false});
  renderer.setPixelRatio(Math.min(2,window.devicePixelRatio||1));
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.shadowMap.enabled=false;
  const scene=new THREE.Scene();
  scene.background=new THREE.Color(0xd5d0c8);
  const hemi=new THREE.HemisphereLight(0xffffff,0x7e776e,2.05);
  scene.add(hemi);
  const key=new THREE.DirectionalLight(0xffffff,2.15);
  key.position.set(170,250,120);
  key.castShadow=false;
  scene.add(key);
  const ground=new THREE.Mesh(
    new THREE.PlaneGeometry(360,360),
    new THREE.MeshStandardMaterial({color:0xb9b3aa,roughness:1,metalness:0})
  );
  ground.rotation.x=-Math.PI/2;
  ground.position.y=sourceBounds.min.y-.05;
  ground.receiveShadow=false;
  scene.add(ground);
  scene.add(variant.root);
  const camera=new THREE.PerspectiveCamera(34,1,.1,1800);
  const resize=()=>{
    const r=canvas.getBoundingClientRect();
    renderer.setSize(Math.max(1,Math.floor(r.width)),Math.max(1,Math.floor(r.height)),false);
    camera.aspect=Math.max(1,r.width)/Math.max(1,r.height);
    camera.updateProjectionMatrix();
    render();
  };
  const render=()=>renderer.render(scene,camera);
  new ResizeObserver(resize).observe(canvas);
  return {canvas,renderer,scene,camera,variant,resize,render,isWebGL2:renderer.capabilities.isWebGL2};
}

function applyCamera(){
  const poses={
    oblique:new THREE.Vector3(.62,.31,.72),
    front:new THREE.Vector3(0,.22,1),
    side:new THREE.Vector3(1,.22,0)
  };
  const d=poses[view]||poses.oblique;
  const len=Math.hypot(d.x,d.y,d.z);
  panels.forEach(({camera,render})=>{
    camera.position.set(target.x+d.x/len*distance,target.y+d.y/len*distance,target.z+d.z/len*distance);
    camera.filmOffset=cameraSkew?8.5:0;
    camera.lookAt(target);
    camera.updateProjectionMatrix();
    render();
  });
}

function setTorsion(deg){
  const d=Number(deg);
  const p={...PROFILES.hero,twistDeg:d,label:
    d===2.6?PROFILES.lowBuilding.label:
    d===11?PROFILES.cityGrotesque.label:
    d===13.2?PROFILES.landmarkEvidence.label:PROFILES.hero.label
  };
  torsion.field=applyField(torsion.root,p,torsion.bounds);
  activeTwist=d;
  geometryRevision++;
  updateMeta();
  panels[2].render();
}

function setSkew(on){
  cameraSkew=Boolean(on);
  document.querySelector('#skew').textContent=cameraSkew?'CAMERA SKEW ON':'CAMERA SKEW OFF';
  document.querySelector('#skew').classList.toggle('active',cameraSkew);
  applyCamera();
}

function setView(v){
  view=v;
  document.querySelectorAll('[data-view]').forEach(b=>b.classList.toggle('active',b.dataset.view===view));
  applyCamera();
}

function f(n,d=2){return Number(n).toFixed(d);}
function updateMeta(){
  const a=document.querySelector('#source-meta');
  const b=document.querySelector('#elastic-meta');
  const c=document.querySelector('#torsion-meta');
  a.textContent=`way/4532022 · ${SOURCE_HEIGHT_M} m · ${source.stats.meshes} meshes · source geometry untouched`;
  b.textContent=`bend/lean/taper · twist 0° · ${elastic.tess.maxHeightSegments} max vertical segments · base error ${f(baseAnchorError(PROFILES.elastic,elastic.bounds),6)} m`;
  c.textContent=`twist ${f(activeTwist,1)}° cumulative · same bend/lean/taper field · roof + body share field · base error ${f(baseAnchorError({...PROFILES.hero,twistDeg:activeTwist},torsion.bounds),6)} m`;
}

document.querySelectorAll('[data-torsion]').forEach(btn=>btn.addEventListener('click',()=>{
  document.querySelectorAll('[data-torsion]').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  setTorsion(Number(btn.dataset.torsion));
}));
document.querySelector('#skew').addEventListener('click',()=>setSkew(!cameraSkew));
document.querySelectorAll('[data-view]').forEach(btn=>btn.addEventListener('click',()=>setView(btn.dataset.view)));

updateMeta();
applyCamera();

function report(){
  const cp={...PROFILES.hero,twistDeg:activeTwist};
  return {
    schema:'kfb.look-torsion-01/1.0-candidate',
    owner:'OSM City Lab presentation / KFB ToolBox authoring',
    source:{
      repo:'georg-doc/kayfabizarro',commit:SOURCE_PIN,
      osm:SOURCE_OSM,heightM:SOURCE_HEIGHT_M,donor:SOURCE_DONOR,
      implementation:'tools/KFB-ToolBox/_inbox/KFB Cologne Race Option C-2/lab-v9/cologne-world.v1.js#buildDom',
      geometryExactInA:true,materialTreatment:'NEUTRAL_REVIEW_OVERRIDE_ONLY'
    },
    panels:['SOURCE','CURRENT_ELASTIC_IDEA','ELASTIC_PLUS_TORSION'],
    sameSourceObjectFamily:true,
    profiles:{
      bTwistDeg:0,
      lowBuildingReferenceDeg:2.6,
      cHeroDefaultDeg:9.5,
      cityGrotesqueStrongReferenceDeg:11,
      currentLandmarkEvidenceDeg:13.2,
      activeCTwistDeg:activeTwist
    },
    deformation:{
      field:FIELD_ID,
      heightDependent:true,
      cumulativeTwist:true,
      bendLeanTaper:true,
      sharedRoofBodyFinalField:true,
      stackOffsets:false,
      elastic:elastic.field,
      torsion:torsion.field
    },
    segmentation:{
      donor:TESS_SOURCE,
      elastic:elastic.tess,
      torsion:torsion.tess
    },
    anchors:{
      elasticBaseErrorM:baseAnchorError(PROFILES.elastic,elastic.bounds),
      torsionBaseErrorM:baseAnchorError(cp,torsion.bounds)
    },
    geometry:{
      source:source.stats,elastic:elastic.stats,torsion:torsion.stats,
      roofMeshesInTorsionField:torsion.field.roofMeshes,
      bodyMeshesInTorsionField:torsion.field.bodyMeshes
    },
    review:{
      neutralSimpleLighting:true,
      shadows:false,
      cameraSkew,
      cameraSkewIsPresentationOnly:true,
      view,
      geometryRevision
    },
    webgl2:Object.fromEntries(panels.map((p,i)=>[['source','elastic','torsion'][i],p.isWebGL2])),
    protected:{huerthR2Edited:false,huerthR2RuntimeImported:false,collisionOwnerChanged:false}
  };
}

window.__KFB_LOOK_TORSION_01__=Object.freeze({report,setTorsion,setSkew,setView});
