import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {createSurfaceAdapter,logicalPose,surfaceRing,frameDiagnostics} from './surface-core.mjs';
import {RECIPE,SOURCE_MAIN_SHA,P1_ACCEPTED_RUNTIME,HEX_SOURCE_ROOT,stableRecipeFingerprint} from './recipe.mjs';
import {hexMetrics,hexToWorld,buildNetwork,solveHexTile} from 'https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@64b06628402c14d52a3bf976473214b7e86d697e/tools/KFB-ToolBox/_inbox/KFB%20Hex%20Assets%20Worldbuilding%20(WIP%20Exporte%20WS1)/kfb-hex-worldbuilder-corpus_2026-09-22/modules/hexrealm/lib/hex-grid.js';
import {WHACKMAN_DUSK_CANDIDATE} from 'https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@a48729460c28edc2ae95abbfcdef66fe52a84f50/tools/KFB-ToolBox/world-building-preflight/environment-profile/profile-core.mjs';

const $=(id)=>document.getElementById(id);
const canvas=$('view');
const renderer=new THREE.WebGLRenderer({canvas,antialias:true,preserveDrawingBuffer:true});
renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));
renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.toneMapping=THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure=WHACKMAN_DUSK_CANDIDATE.exposure;
renderer.shadowMap.enabled=true;
renderer.shadowMap.type=THREE.PCFSoftShadowMap;

const scene=new THREE.Scene();
scene.background=new THREE.Color(WHACKMAN_DUSK_CANDIDATE.background);
scene.fog=new THREE.FogExp2(WHACKMAN_DUSK_CANDIDATE.background,WHACKMAN_DUSK_CANDIDATE.fog.density);
const camera=new THREE.PerspectiveCamera(38,1,.03,160);
const controls=new OrbitControls(camera,canvas); controls.enableDamping=true;

const hemi=new THREE.HemisphereLight(WHACKMAN_DUSK_CANDIDATE.world.hemiSky,WHACKMAN_DUSK_CANDIDATE.world.hemiGround,WHACKMAN_DUSK_CANDIDATE.world.hemiIntensity);
const key=new THREE.DirectionalLight(WHACKMAN_DUSK_CANDIDATE.world.keyColor,WHACKMAN_DUSK_CANDIDATE.world.keyIntensity);
key.position.set(-6,10,7); key.castShadow=true;
const fill=new THREE.DirectionalLight(WHACKMAN_DUSK_CANDIDATE.world.fillColor,WHACKMAN_DUSK_CANDIDATE.world.fillIntensity);
fill.position.set(5,6,-7);
scene.add(hemi,key,fill);

const sourceGroup=new THREE.Group(); sourceGroup.name='SOURCE_PROP_ISOLATION'; scene.add(sourceGroup);
const integratedGroup=new THREE.Group(); integratedGroup.name='P2_SURFACE_RECIPE'; integratedGroup.visible=false; scene.add(integratedGroup);
const loader=new GLTFLoader();
const ROOT=`https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@${SOURCE_MAIN_SHA}/${HEX_SOURCE_ROOT}`;
const ASSET={target:`${ROOT}decoration/props/target.gltf`,grass:`${ROOT}tiles/base/hex_grass.gltf`,roadA:`${ROOT}tiles/roads/hex_road_A.gltf`,roadM:`${ROOT}tiles/roads/hex_road_M.gltf`};

let targetSource=null;
let tileTemplates=new Map();
let sourceIsolationRendered=false;
let sourceFrames=0;
let activeSurface=null;
let activeAdapter=null;
let activeFrame=null;
let fxLine=null;
let fxT=999;
let consoleErrors=0;
const errors=[];
const pageStarted=performance.now();

window.addEventListener('error',e=>{consoleErrors++;errors.push(String(e.error||e.message));updateReport();});
window.addEventListener('unhandledrejection',e=>{consoleErrors++;errors.push(String(e.reason));updateReport();});

function cloneScene(root){
  const c=root.clone(true);
  c.traverse(o=>{if(o.isMesh){o.geometry=o.geometry?.clone?.()||o.geometry;o.material=Array.isArray(o.material)?o.material.map(m=>m.clone()):o.material?.clone();o.castShadow=true;o.receiveShadow=true;}});
  return c;
}
function normaliseProp(root,targetHeight=2.2){
  root.updateMatrixWorld(true);
  const box=new THREE.Box3().setFromObject(root); const size=box.getSize(new THREE.Vector3());
  const s=targetHeight/Math.max(size.y,1e-5); root.scale.setScalar(s); root.updateMatrixWorld(true);
  const b2=new THREE.Box3().setFromObject(root); const center=b2.getCenter(new THREE.Vector3());
  root.position.x-=center.x; root.position.z-=center.z; root.position.y-=b2.min.y; root.updateMatrixWorld(true);
}
function vec(a){return new THREE.Vector3(a[0],a[1],a[2]);}
function applyFrame(obj,f,yawDeg=0){
  obj.position.copy(vec(f.position));
  const basis=new THREE.Matrix4().makeBasis(vec(f.tangentU),vec(f.normal),vec(f.tangentV));
  const q=new THREE.Quaternion().setFromRotationMatrix(basis);
  const yaw=new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0),THREE.MathUtils.degToRad(yawDeg));
  obj.quaternion.copy(q.multiply(yaw));
}
function clearGroup(g){while(g.children.length){const o=g.children[0];g.remove(o);o.traverse?.(x=>{x.geometry?.dispose?.(); if(Array.isArray(x.material))x.material.forEach(m=>m.dispose?.()); else x.material?.dispose?.();});}}
function frameCamera(f,distance=8){
  const p=vec(f.position), n=vec(f.normal), u=vec(f.tangentU), v=vec(f.tangentV);
  controls.target.copy(p).addScaledVector(n,.3);
  camera.position.copy(p).addScaledVector(n,distance*.72).addScaledVector(u,distance*.72).addScaledVector(v,distance*.38);
  camera.near=.03;camera.far=180;camera.updateProjectionMatrix();controls.update();
}

async function loadSourceObject(){
  $('status').textContent='LOADING REAL PROP SOURCE…';
  const gltf=await loader.loadAsync(ASSET.target);
  targetSource=gltf.scene; targetSource.name='REAL_SOURCE · target.gltf';
  normaliseProp(targetSource,2.4); sourceGroup.add(targetSource);
  const srcHemi=new THREE.HemisphereLight(0xdcd6ff,0x2a2140,1.35); const srcKey=new THREE.DirectionalLight(0xfff3e0,2.0); srcKey.position.set(-3,5,4);
  sourceGroup.add(srcHemi,srcKey);
  camera.position.set(4,3.2,5.5);controls.target.set(0,1.1,0);controls.update();
  $('asset-proof').textContent='REAL SOURCE · target.gltf · blob 67a0cf5… · KayKit Medieval Hexagon Pack';
  $('status').textContent='SOURCE PROP READY · ISOLATION FIRST';
}

async function loadTileTemplates(){
  const entries=[['hex_grass',ASSET.grass],['hex_road_A',ASSET.roadA],['hex_road_M',ASSET.roadM]];
  for(const [id,url] of entries){ const gltf=await loader.loadAsync(url); tileTemplates.set(id,gltf.scene); }
}

function verifyHexOwner(){
  const chain=[[-1,0],[0,0],[1,0]];
  const net=buildNetwork([{id:'wb1-p2-road',cells:chain}]);
  const expected=new Map(RECIPE.cells.slice(0,3).map(c=>[`${c.col},${c.row}`,c]));
  for(const [key,c] of expected){
    const wanted=net.mask.get(key); const solved=solveHexTile(wanted,'road');
    if(!solved || solved.name!==c.tile || solved.rot!==c.rotation) throw new Error(`Hex owner mismatch ${key}: ${JSON.stringify(solved)} expected ${c.tile}@${c.rotation}`);
  }
}

function surfaceBase(id,adapter){
  let mesh;
  const mat=new THREE.MeshStandardMaterial({color:0x342f3c,roughness:.95,metalness:0,side:THREE.DoubleSide,transparent:true,opacity:.78});
  if(id==='FLAT'){
    mesh=new THREE.Mesh(new THREE.PlaneGeometry(22,22,20,20),mat);mesh.rotation.x=-Math.PI/2;mesh.position.y=-.015;
  }else if(id==='SPHERE'){
    mesh=new THREE.Mesh(new THREE.SphereGeometry(adapter.radius,64,40),mat);
  }else{
    mesh=new THREE.Mesh(new THREE.TorusGeometry(adapter.majorRadius,adapter.minorRadius,40,96),mat);
  }
  mesh.receiveShadow=true; mesh.name=`${id}_TECH_SURFACE`;
  return mesh;
}

function cellLogical(cell){
  const m=hexMetrics([RECIPE.measuredHexSize[0],0,RECIPE.measuredHexSize[1]]);
  const [x,,z]=hexToWorld(cell.col,cell.row,m); return [x,z];
}

function routeSamples(points,stepsPerSegment=14){
  const out=[];
  for(let i=0;i<points.length-1;i++){
    const a=points[i],b=points[i+1];
    for(let s=0;s<stepsPerSegment;s++){const t=s/stepsPerSegment;out.push([a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t]);}
  }
  out.push([...points.at(-1)]); return out;
}

function buildRoute(adapter){
  const pts=routeSamples(RECIPE.route.points).map(p=>vec(logicalPose(adapter,p,.08).position));
  const curve=new THREE.CatmullRomCurve3(pts,false,'centripetal',.4);
  const mesh=new THREE.Mesh(new THREE.TubeGeometry(curve,Math.max(32,pts.length),.055,8,false),new THREE.MeshBasicMaterial({color:0xf0b56a,toneMapped:false}));
  mesh.name='SAME_LOGICAL_ROUTE'; return mesh;
}

function buildFx(adapter){
  const geom=new THREE.BufferGeometry().setFromPoints(surfaceRing(adapter,RECIPE.surfaceFx.center,.02,80,.13).map(vec));
  const line=new THREE.LineLoop(geom,new THREE.LineBasicMaterial({color:0xff715b,transparent:true,opacity:.95,toneMapped:false}));
  line.visible=false;line.name='SAME_SURFACE_FX_EVENT';return line;
}

function buildIntegrated(id){
  clearGroup(integratedGroup); integratedGroup.visible=true; sourceGroup.visible=false;
  activeSurface=id; activeAdapter=createSurfaceAdapter(id); activeFrame=logicalPose(activeAdapter,[0,0],0);
  integratedGroup.add(surfaceBase(id,activeAdapter));
  for(const cell of RECIPE.cells){
    const tpl=tileTemplates.get(cell.tile); if(!tpl) throw new Error('missing tile template '+cell.tile);
    const obj=cloneScene(tpl); obj.name=`CELL ${cell.id} · ${cell.tile}`;
    applyFrame(obj,logicalPose(activeAdapter,cellLogical(cell),.025),cell.rotation);
    integratedGroup.add(obj);
  }
  const propWrap=new THREE.Group(); const prop=cloneScene(targetSource); normaliseProp(prop,1.35); propWrap.add(prop); propWrap.name='SAME_REAL_PROP · target.gltf';
  applyFrame(propWrap,logicalPose(activeAdapter,RECIPE.prop.logical,.04),RECIPE.prop.yawDeg); integratedGroup.add(propWrap);
  integratedGroup.add(buildRoute(activeAdapter));
  fxLine=buildFx(activeAdapter); integratedGroup.add(fxLine); fxT=999;
  frameCamera(activeFrame,id==='TORUS'?8.5:7.8);
  $('status').textContent=`SURFACE ${id} · SAME RECIPE`;
  updateReport();
}

function triggerFx(){if(!activeAdapter||!fxLine)return;fxT=0;fxLine.visible=true;}
function updateFx(dt){
  if(!fxLine||!activeAdapter||fxT>RECIPE.surfaceFx.life)return;
  fxT+=dt; const life=Math.min(1,fxT/RECIPE.surfaceFx.life); if(life>=1){fxLine.visible=false;return;}
  const radius=.2+fxT*RECIPE.surfaceFx.phaseRate*.72;
  const pts=surfaceRing(activeAdapter,RECIPE.surfaceFx.center,radius,80,.13).map(vec);
  fxLine.geometry.dispose();fxLine.geometry=new THREE.BufferGeometry().setFromPoints(pts);
  fxLine.material.opacity=(1-life)*(1-life);
}

function snapshot(){
  const diag=activeFrame?frameDiagnostics(activeFrame):null;
  return {
    schema:'kfb.surface-adapter-proof/1',
    proof:activeSurface?'SURFACE':'SOURCE',sourceIsolationRendered,consoleErrors,errors:[...errors],activeSurface,
    recipeId:RECIPE.id,recipeFingerprint:stableRecipeFingerprint(RECIPE),cellCount:RECIPE.cells.length,
    cellIdentities:RECIPE.cells.map(c=>`${c.tile}@${c.rotation}`),routeData:JSON.stringify(RECIPE.route.points),
    propIdentity:RECIPE.prop.identity,environmentProfileRef:RECIPE.environmentProfileRef,surfaceFxType:RECIPE.surfaceFx.type,
    centerFrame:diag,sourceMainSha:SOURCE_MAIN_SHA,p1AcceptedRuntime:P1_ACCEPTED_RUNTIME
  };
}
function updateReport(){
  const s=snapshot();
  $('report').textContent=[
    `proof=${s.proof}`,
    `surface=${s.activeSurface||'SOURCE'}`,
    `recipe=${s.recipeId}`,
    `cells=${s.cellCount}`,
    `env=${RECIPE.environmentProfileRef.split(':').at(-1)}`,
    `consoleErrors=${s.consoleErrors}`,
    activeFrame?`frame handed=${s.centerFrame.handedness} · n=${s.centerFrame.normalLength.toFixed(3)}`:'sourceIsolation pending'
  ].join(' · ');
}

$('surface').addEventListener('change',e=>{if(e.target.value)buildIntegrated(e.target.value);});
$('fx').addEventListener('click',triggerFx);

function resize(){
  const w=canvas.clientWidth,h=canvas.clientHeight,dpr=Math.min(devicePixelRatio||1,1.5);
  if(canvas.width!==Math.floor(w*dpr)||canvas.height!==Math.floor(h*dpr))renderer.setSize(w,h,false);
  camera.aspect=w/Math.max(1,h);camera.updateProjectionMatrix();
}
let last=performance.now();
function tick(now){
  resize();controls.update();const dt=Math.min(.05,(now-last)/1000);last=now;updateFx(dt);renderer.render(scene,camera);
  if(!sourceIsolationRendered&&targetSource&&sourceGroup.visible){sourceFrames++;if(sourceFrames>=3){sourceIsolationRendered=true;$('surface').disabled=false;$('status').textContent='SOURCE OBJECT RENDERED · SURFACE PROOF UNLOCKED';updateReport();}}
  requestAnimationFrame(tick);
}

window.__WB1_P2={snapshot,setSurface:(id)=>{if(!sourceIsolationRendered)throw new Error('source proof not unlocked');$('surface').value=id;buildIntegrated(id);},triggerFx,screenshot:()=>canvas.toDataURL('image/png')};

try{
  verifyHexOwner();
  await loadSourceObject();
  await loadTileTemplates();
  updateReport();requestAnimationFrame(tick);
}catch(error){
  consoleErrors++;errors.push(String(error?.stack||error));$('status').textContent=`FAIL LOUDLY · ${error.message||error}`;$('report').textContent=errors.join('\n');console.error(error);
}
