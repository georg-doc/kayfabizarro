import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

const canvas = document.querySelector('#view');
const stage = document.querySelector('#stage');
const loading = document.querySelector('#loading');
const loadingTitle = document.querySelector('#loadingTitle');
const loadingText = document.querySelector('#loadingText');
const diag = document.querySelector('#diag');
const selKicker = document.querySelector('#selKicker');
const selName = document.querySelector('#selName');
const selText = document.querySelector('#selText');
const hoverNote = document.querySelector('#hoverNote');
const focusBtn = document.querySelector('#focusBtn');
const storyBtn = document.querySelector('#storyBtn');

const OPENPLANET_API = 'https://download.openplanetdata.com/files?category=boundaries&subcategory=countries&limit=-1';
const OPENPLANET_BASE = 'https://download.openplanetdata.com';
const KFB_INK_URL = 'https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@main/skills/kfb-ink-canon.js';
const KAYKIT_REPO_PATH = '/media/3D_Assets/KayKit_BoardGameBits_1.0_FREE/Assets/gltf/';
const KAYKIT_RAW_BASE = 'https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/KayKit_BoardGameBits_1.0_FREE/Assets/gltf/';
const KAYKIT_BASE = location.hostname === 'kayfabizarro.pages.dev' ? KAYKIT_REPO_PATH : KAYKIT_RAW_BASE;
const KFB_MAP_BUILD = 'p0.2-r7-solid-country-tiles';

const CORE_CODES = [
  'IS','IE','GB','PT','ES','FR','BE','NL','LU','DE','DK','NO','SE','FI','CH','AT','IT',
  'CZ','PL','SK','HU','SI','HR','BA','RS','RO','BG','GR','AL','ME','MK','TR','CY','MT',
  'EE','LV','LT','BY','MD','UA'
];
const EUROPE_BBOX = { minLon:-25, maxLon:42, minLat:34, maxLat:72 };
const CENTER = { lon:10, lat:51 };
const MAP_SCALE = 4.05;
const BOARD_W = 188;
const BOARD_H = 166;
const BOARD_DEPTH = 2.35;
const BOARD_TOP = BOARD_DEPTH;
const PIECE_DEPTH = 0.9;
const BASE_INK_WIDTH = 0.25;
const LABEL_MIN_AREA = 18;

const palette = [
  0xe7b6a7, 0xf0d37c, 0xa8c9a7, 0x91bed1, 0xc8acd7,
  0xd7b99c, 0xa9d7ca, 0xe3a9ba, 0xb8c8e6, 0xc9d58d
];

let inkColor = new THREE.Color(0x17131b);
let inkCanonStatus = 'adapter only';
let inkScale = 1;
let heightScale = 1;
let exploded = false;
let labelsVisible = true;
let tokensVisible = true;
let selected = null;
let hovered = null;
let storyCursor = -1;
let storyManifest = null;
let markerSpecs = [];
let loadedCount = 0;
let failedCount = 0;
let selectedFiles = [];
let cameraTween = false;
const countries = [];
const pickMeshes = [];
const tokenHolders = [];
const markerRecords = [];
const clock = new THREE.Clock();
const cameraGoalPos = new THREE.Vector3();
const cameraGoalTarget = new THREE.Vector3();

window.__KFB_MAP_BOARD_READY__ = false;
window.__KFB_MAP_BOARD_ERROR__ = null;
window.__KFB_MAP_BOARD_PHASE__ = 'init';
let bootPhase = 'init';

function setBootPhase(phase, detail='') {
  bootPhase=phase;
  window.__KFB_MAP_BOARD_PHASE__=phase;
  stage.dataset.bootPhase=phase;
  if (detail) loadingText.textContent=detail;
}

const renderer = new THREE.WebGLRenderer({ canvas, antialias:true, alpha:false });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.03;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x2b2533);
scene.fog = new THREE.Fog(0x2b2533, 175, 370);

const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 1000);
camera.position.set(35, 128, 155);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.065;
controls.minDistance = 55;
controls.maxDistance = 300;
controls.maxPolarAngle = Math.PI * 0.47;
controls.target.set(0, 4, -5);

const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(1,1);
labelRenderer.domElement.className = 'label-layer';
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.inset = '0';
labelRenderer.domElement.style.pointerEvents = 'none';
labelRenderer.domElement.style.zIndex = '5';
stage.appendChild(labelRenderer.domElement);

scene.add(new THREE.HemisphereLight(0xfff5dd, 0x413b50, 1.9));
const key = new THREE.DirectionalLight(0xfff0d4, 4.1);
key.position.set(-80, 120, -95);
key.castShadow = true;
key.shadow.mapSize.set(2048, 2048);
key.shadow.camera.left = -130;
key.shadow.camera.right = 130;
key.shadow.camera.top = 115;
key.shadow.camera.bottom = -115;
key.shadow.bias = -0.00015;
scene.add(key);

const rim = new THREE.DirectionalLight(0x83a8d6, 0.8);
rim.position.set(110, 60, 90);
scene.add(rim);

const root = new THREE.Group();
scene.add(root);

const focusRingMat = new THREE.MeshBasicMaterial({
  color:inkColor, transparent:true, opacity:0.82, depthWrite:false, toneMapped:false, side:THREE.DoubleSide
});
function makeFocusRingGeometry(segments=72) {
  const verts=[], idx=[];
  for(let i=0;i<segments;i++){
    const a=i/segments*Math.PI*2;
    const wobble=Math.sin(a*3+0.7)*0.16+Math.sin(a*7+1.9)*0.07;
    const half=0.11*(1+0.18*Math.sin(a*5+0.4));
    const r=3.8+wobble;
    const co=Math.cos(a), si=Math.sin(a);
    verts.push(co*(r+half),0,si*(r+half),co*(r-half),0,si*(r-half));
  }
  for(let i=0;i<segments;i++){
    const j=(i+1)%segments;
    const a=i*2,b=i*2+1,c=j*2,d=j*2+1;
    idx.push(a,b,c,b,d,c);
  }
  const g=new THREE.BufferGeometry();
  g.setAttribute('position',new THREE.Float32BufferAttribute(verts,3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}
const focusRing = new THREE.Mesh(makeFocusRingGeometry(),focusRingMat);
focusRing.visible = false;

function makePaperTexture(base = '#d8c6a6', line = '#ffffff') {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const x = c.getContext('2d');
  let paperSeed = hashString(base+'|'+line+'|kfb-paper-v1');
  const rnd = () => {
    paperSeed ^= paperSeed << 13;
    paperSeed ^= paperSeed >>> 17;
    paperSeed ^= paperSeed << 5;
    return (paperSeed >>> 0) / 4294967295;
  };
  x.fillStyle = base;
  x.fillRect(0,0,256,256);
  const im = x.getImageData(0,0,256,256);
  for (let i=0;i<im.data.length;i+=4) {
    const n = (rnd() - 0.5) * 15;
    im.data[i] = Math.max(0, Math.min(255, im.data[i] + n));
    im.data[i+1] = Math.max(0, Math.min(255, im.data[i+1] + n));
    im.data[i+2] = Math.max(0, Math.min(255, im.data[i+2] + n));
  }
  x.putImageData(im,0,0);
  x.globalAlpha = 0.08;
  x.strokeStyle = line;
  x.lineWidth = 1;
  for (let i=0;i<90;i++) {
    x.beginPath();
    const y = rnd()*256;
    x.moveTo(-10,y);
    x.bezierCurveTo(60,y+(rnd()-.5)*9,180,y+(rnd()-.5)*9,270,y);
    x.stroke();
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(4,3);
  t.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  return t;
}

const boardTexture = makePaperTexture('#72bcca','#e9ffff');
const countryTexture = makePaperTexture('#eee1c7','#ffffff');

function roundedRectShape(w,h,r) {
  const s = new THREE.Shape();
  const x=-w/2, y=-h/2;
  s.moveTo(x+r,y);
  s.lineTo(x+w-r,y);
  s.quadraticCurveTo(x+w,y,x+w,y+r);
  s.lineTo(x+w,y+h-r);
  s.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
  s.lineTo(x+r,y+h);
  s.quadraticCurveTo(x,y+h,x,y+h-r);
  s.lineTo(x,y+r);
  s.quadraticCurveTo(x,y,x+r,y);
  return s;
}

function createBoard() {
  const g = new THREE.ExtrudeGeometry(roundedRectShape(BOARD_W,BOARD_H,8), {
    depth: BOARD_DEPTH, bevelEnabled:true, bevelSize:1.1, bevelThickness:0.8, bevelSegments:3, curveSegments:5
  });
  g.rotateX(-Math.PI/2);
  const top = new THREE.MeshStandardMaterial({
    color:0xa6d6d7, map:boardTexture, roughness:0.98, metalness:0, side:THREE.DoubleSide
  });
  const side = new THREE.MeshStandardMaterial({
    color:0x536b76, roughness:0.96, metalness:0
  });
  const m = new THREE.Mesh(g,[top,side]);
  m.receiveShadow = true;
  m.castShadow = true;
  m.position.y = -0.02;
  root.add(m);

  const under = new THREE.Mesh(
    new THREE.CylinderGeometry(96,104,4.5,8,1,false,Math.PI/8),
    new THREE.MeshStandardMaterial({color:0x45384d,roughness:1})
  );
  under.scale.z = 0.76;
  under.position.y = -3.8;
  under.rotation.y = Math.PI/8;
  under.receiveShadow = true;
  root.add(under);
}
createBoard();

function hashString(s) {
  let h = 2166136261 >>> 0;
  for (let i=0;i<s.length;i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h,16777619);
  }
  return h >>> 0;
}
function seeded01(seed, n=0) {
  let x = (seed + Math.imul(n+1, 0x9e3779b1)) >>> 0;
  x ^= x << 13; x ^= x >>> 17; x ^= x << 5;
  return (x >>> 0) / 4294967295;
}
function project(lon,lat) {
  const cos = Math.cos(CENTER.lat * Math.PI/180);
  return {
    x:(lon-CENTER.lon)*cos*MAP_SCALE,
    z:-(lat-CENTER.lat)*MAP_SCALE,
    lon, lat
  };
}
function withinEuropeCentroid(coords) {
  let lon=0,lat=0,n=0;
  for (const p of coords) { lon += p[0]; lat += p[1]; n++; }
  if (!n) return false;
  lon/=n; lat/=n;
  return lon>=EUROPE_BBOX.minLon && lon<=EUROPE_BBOX.maxLon && lat>=EUROPE_BBOX.minLat && lat<=EUROPE_BBOX.maxLat;
}
function sampleRing(coords,maxPoints=480) {
  if (coords.length<=maxPoints) return coords;
  const step=Math.ceil(coords.length/maxPoints);
  const sampled=[];
  for(let i=0;i<coords.length;i+=step) sampled.push(coords[i]);
  const last=coords[coords.length-1];
  if(sampled[sampled.length-1]!==last) sampled.push(last);
  return sampled;
}
function ringToProjected(coords) {
  // Closed geographic rings are sampled in source order. Treating them as an
  // open RDP polyline can introduce a false closing chord across long countries.
  const sampled=sampleRing(coords);
  const a=sampled.map(p=>project(p[0],p[1]));
  if(a.length>1){
    const first=a[0],last=a[a.length-1];
    if(Math.abs(first.x-last.x)<1e-8 && Math.abs(first.z-last.z)<1e-8) a.pop();
  }
  return a;
}
function polygonArea2D(points) {
  let a=0;
  for (let i=0;i<points.length;i++) {
    const p=points[i], q=points[(i+1)%points.length];
    a += p.x*q.z-q.x*p.z;
  }
  return a/2;
}
function centroid2D(points) {
  let a=0,cx=0,cz=0;
  for (let i=0;i<points.length;i++) {
    const p=points[i],q=points[(i+1)%points.length];
    const cross=p.x*q.z-q.x*p.z;
    a+=cross; cx+=(p.x+q.x)*cross; cz+=(p.z+q.z)*cross;
  }
  if (Math.abs(a)<1e-6) {
    return points.reduce((s,p)=>({x:s.x+p.x/points.length,z:s.z+p.z/points.length}),{x:0,z:0});
  }
  return {x:cx/(3*a),z:cz/(3*a)};
}
function makeShape(outer,holes) {
  const s = new THREE.Shape();
  outer.forEach((p,i)=>i ? s.lineTo(p.x,-p.z) : s.moveTo(p.x,-p.z));
  s.closePath();
  for (const ring of holes) {
    const h = new THREE.Path();
    ring.forEach((p,i)=>i ? h.lineTo(p.x,-p.z) : h.moveTo(p.x,-p.z));
    h.closePath();
    s.holes.push(h);
  }
  return s;
}
function normalizeGeometryInput(g) {
  if (!g) return [];
  if (g.type==='Polygon') return [g.coordinates];
  if (g.type==='MultiPolygon') return g.coordinates;
  return [];
}

function makeInkRibbonGeometry(points, y, width, seed, centroid, hole=false) {
  if (points.length<3) return null;
  const verts=[];
  const idx=[];
  const se = new THREE.Vector2(0.70710678,0.70710678);
  for (let i=0;i<points.length;i++) {
    const prev=points[(i-1+points.length)%points.length];
    const p=points[i];
    const next=points[(i+1)%points.length];
    let tx=next.x-prev.x, tz=next.z-prev.z;
    const tl=Math.hypot(tx,tz)||1; tx/=tl; tz/=tl;
    let nx=-tz, nz=tx;
    const radial=(p.x-centroid.x)*nx+(p.z-centroid.z)*nz;
    if ((!hole && radial<0) || (hole && radial>0)) { nx=-nx; nz=-nz; }

    const wobble = (
      Math.sin(i*0.47 + seed*0.013) * 0.55 +
      Math.sin(i*0.137 + seed*0.021) * 0.45
    ) * width * 0.20;
    const sx=p.x+nx*wobble, sz=p.z+nz*wobble;
    const shadow=Math.max(0,nx*se.x+nz*se.y);
    const feather=0.86 + 0.13*Math.sin(i*0.61+seed*0.07) + (hole?0:shadow*0.72);
    const half=width*0.5*Math.max(0.52,feather);
    verts.push(sx+nx*half,y,sz+nz*half,sx-nx*half,y,sz-nz*half);
  }
  const n=points.length;
  for (let i=0;i<n;i++) {
    const j=(i+1)%n;
    const a=i*2,b=i*2+1,c=j*2,d=j*2+1;
    idx.push(a,b,c,b,d,c);
  }
  const g=new THREE.BufferGeometry();
  g.setAttribute('position',new THREE.Float32BufferAttribute(verts,3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

function addCountryFromGeoJSON(code, name, geojson) {
  const geoms=[];
  if (geojson.type==='FeatureCollection') {
    for (const f of geojson.features || []) geoms.push(f.geometry);
  } else if (geojson.type==='Feature') geoms.push(geojson.geometry);
  else geoms.push(geojson);

  const candidates=[];
  for (const geom of geoms) {
    for (const poly of normalizeGeometryInput(geom)) {
      if (!poly?.[0] || !withinEuropeCentroid(poly[0])) continue;
      const outer=ringToProjected(poly[0]);
      if (outer.length<3) continue;
      const area=Math.abs(polygonArea2D(outer));
      if(area<0.004) continue;
      // A board-game country is a solid physical tile. OSM interior rings
      // (lakes/enclaves/complex relation holes) belong to a later water/detail
      // presentation layer instead of cutting or inking the coarse Europe piece.
      const holes=[];
      candidates.push({outer,holes,area});
    }
  }
  if (!candidates.length) return null;
  candidates.sort((a,b)=>b.area-a.area);
  const largestArea=candidates[0].area;
  const polygons=candidates
    .filter((p,i)=>i===0 || p.area>=Math.max(0.018,largestArea*0.00035))
    .slice(0,24)
    .map(({outer,holes})=>({outer,holes}));

  const seed=hashString(code);
  const group=new THREE.Group();
  group.position.y=BOARD_TOP+0.06;
  group.userData.code=code;
  group.userData.name=name;

  const allOuter=polygons.map(p=>p.outer);
  const largest=allOuter.slice().sort((a,b)=>Math.abs(polygonArea2D(b))-Math.abs(polygonArea2D(a)))[0];
  const centroid=centroid2D(largest);
  const totalArea=allOuter.reduce((s,r)=>s+Math.abs(polygonArea2D(r)),0);

  const color=palette[seed%palette.length];
  const topMat=new THREE.MeshStandardMaterial({
    color, map:countryTexture, roughness:0.98, metalness:0, side:THREE.DoubleSide
  });
  topMat.emissive=new THREE.Color(0x000000);
  const sideColor=new THREE.Color(color).multiplyScalar(0.60);
  const sideMat=new THREE.MeshStandardMaterial({color:sideColor,roughness:1,metalness:0});

  const inkMat=new THREE.MeshBasicMaterial({color:inkColor,side:THREE.DoubleSide,depthWrite:false,toneMapped:false});
  const rec={code,name,group,centroid,totalArea,polygons,topMat,sideMat,inkMat,inkMeshes:[],meshes:[],label:null,seed,markers:[]};

  for (const poly of polygons) {
    const shape=makeShape(poly.outer,poly.holes);
    const geom=new THREE.ExtrudeGeometry(shape,{
      depth:PIECE_DEPTH,bevelEnabled:true,bevelSize:0.035,bevelThickness:0.045,bevelSegments:1,curveSegments:2
    });
    geom.rotateX(-Math.PI/2);
    const mesh=new THREE.Mesh(geom,[topMat,sideMat]);
    mesh.castShadow=true;
    mesh.receiveShadow=true;
    mesh.userData.country=rec;
    group.add(mesh);
    rec.meshes.push(mesh);
    pickMeshes.push(mesh);
  }

  buildCountryInk(rec);

  if (totalArea>LABEL_MIN_AREA) {
    const el=document.createElement('div');
    el.className='country-label';
    el.textContent=name.toUpperCase();
    const label=new CSS2DObject(el);
    label.position.set(centroid.x,PIECE_DEPTH+0.22,centroid.z);
    group.add(label);
    rec.label=label;
  }

  root.add(group);
  countries.push(rec);
  return rec;
}

function buildCountryInk(rec) {
  for (const m of rec.inkMeshes) {
    rec.group.remove(m);
    m.geometry.dispose();
  }
  rec.inkMeshes.length=0;
  for (const poly of rec.polygons) {
    const rings=[{pts:poly.outer,hole:false},...poly.holes.map(pts=>({pts,hole:true}))];
    for (const r of rings) {
      const g=makeInkRibbonGeometry(
        r.pts, PIECE_DEPTH+0.055, BASE_INK_WIDTH*inkScale*(r.hole?0.72:1),
        rec.seed, rec.centroid, r.hole
      );
      if (!g) continue;
      const m=new THREE.Mesh(g,rec.inkMat);
      m.renderOrder=8;
      rec.group.add(m);
      rec.inkMeshes.push(m);
    }
  }
}

function fileUrl(f) {
  return OPENPLANET_BASE+'/'+f.remote_path+'/'+f.remote_version+'/'+f.remote_filename;
}
async function fetchJson(url,{timeoutMs=12000,retries=1,cache='force-cache'}={}) {
  let lastError=null;
  for(let attempt=0;attempt<=retries;attempt++){
    const ctrl=new AbortController();
    const timer=setTimeout(()=>ctrl.abort(new Error('timeout '+timeoutMs+'ms')),timeoutMs);
    try{
      const res=await fetch(url,{mode:'cors',cache,signal:ctrl.signal});
      if(!res.ok) throw new Error('HTTP '+res.status);
      return await res.json();
    }catch(err){
      lastError=err;
      if(attempt<retries) await new Promise(resolve=>setTimeout(resolve,250*(attempt+1)));
    }finally{
      clearTimeout(timer);
    }
  }
  throw new Error('fetchJson failed: '+url+' · '+String(lastError?.message||lastError));
}
async function mapLimit(items,limit,fn) {
  let cursor=0;
  const workers=Array.from({length:Math.min(limit,items.length)},async()=>{
    while (cursor<items.length) {
      const i=cursor++;
      await fn(items[i],i);
    }
  });
  await Promise.all(workers);
}

async function resolveBoundaryFiles() {
  setBootPhase('boundary-catalogue','Reading the OpenPlanetData OSM-boundary catalogue…');
  const data=await fetchJson(OPENPLANET_API,{timeoutMs:12000,retries:1,cache:'no-store'});
  const files=(data.files || []).filter(f =>
    f.remote_version==='v2' && f.extension==='geojson' && !f.deprecated
  );
  const byCode=new Map();
  for (const f of files) {
    const code=String(f.entity||'').toUpperCase();
    if (!byCode.has(code)) byCode.set(code,f);
  }
  return CORE_CODES.map(code=>byCode.get(code)).filter(Boolean);
}

async function loadBoundaries() {
  selectedFiles=await resolveBoundaryFiles();
  setBootPhase('boundaries','Cutting Europe into puzzle pieces…');
  loadingTitle.textContent='Cutting Europe into puzzle pieces…';
  await mapLimit(selectedFiles,8,async(f)=>{
    const code=String(f.entity).toUpperCase();
    try {
      loadingText.textContent='Loading '+code+' · '+(loadedCount+failedCount+1)+' / '+selectedFiles.length;
      const timeoutMs=code==='NO' ? 30000 : code==='FI' ? 16000 : 10000;
      const data=await fetchJson(fileUrl(f),{timeoutMs,retries:1});
      const feature=data.features?.[0];
      const name=f.name || feature?.properties?.name || code;
      const rec=addCountryFromGeoJSON(code,name,data);
      if (rec) loadedCount++; else failedCount++;
    } catch (err) {
      failedCount++;
      console.warn('Boundary failed',code,err);
    }
    updateDiag();
  });
}

function updateDiag(extra='') {
  diag.textContent=
    'countries '+loadedCount+'/'+selectedFiles.length+
    ' · failed '+failedCount+
    ' · ink '+inkCanonStatus+
    ' · KayKit '+tokenHolders.length+'/'+(markerSpecs.length||5)+
    (extra ? ' · '+extra : '');
}

function applyTargets() {
  for (const rec of countries) {
    let ox=0,oz=0;
    if (exploded) {
      const len=Math.hypot(rec.centroid.x,rec.centroid.z)||1;
      const spread=5.0 + seeded01(rec.seed,4)*4.2;
      ox=rec.centroid.x/len*spread;
      oz=rec.centroid.z/len*spread;
    }
    rec.targetX=ox;
    rec.targetZ=oz;
    rec.targetY=BOARD_TOP+0.06+(selected===rec ? 1.6 : 0)+(exploded ? seeded01(rec.seed,7)*0.55 : 0);
  }
}
function updateHighlights() {
  for (const rec of countries) {
    if (rec===selected) rec.topMat.emissive.setHex(0x1d1207);
    else if (rec===hovered) rec.topMat.emissive.setHex(0x0c0b07);
    else rec.topMat.emissive.setHex(0x000000);
  }
}

function setFocusRing(rec) {
  if (focusRing.parent) focusRing.parent.remove(focusRing);
  if (!rec) {
    focusRing.visible=false;
    return;
  }
  const scale=THREE.MathUtils.clamp(Math.sqrt(Math.max(1,rec.totalArea))/19,0.68,1.45);
  focusRing.position.set(rec.centroid.x,PIECE_DEPTH+0.19,rec.centroid.z);
  focusRing.userData.baseScale=scale;
  focusRing.scale.setScalar(scale);
  focusRing.visible=true;
  rec.group.add(focusRing);
}

function clearStoryActive() {
  for (const m of markerRecords) m.labelEl?.classList.remove('active');
}

function selectCountry(rec,{fromStory=false}={}) {
  selected=rec;
  focusBtn.disabled=!selected;
  if (!fromStory) clearStoryActive();
  if (selected) {
    selKicker.textContent='SELECTED COUNTRY TILE';
    selName.textContent=selected.name+' · '+selected.code;
    selText.textContent='Independent 3D tile. FOCUS frames it; EXPLODE separates it while attached story markers stay registered to the same geography.';
  } else {
    selKicker.textContent='SELECT A COUNTRY TILE';
    selName.textContent='Europe · Board View';
    selText.textContent='Orbit, zoom and click a country. The map is built as independent 3D puzzle pieces with hand-inked border ribbons and real KayKit board-game markers.';
  }
  setFocusRing(selected);
  updateHighlights();
  applyTargets();
}

function queueCamera(position,target) {
  cameraGoalPos.copy(position);
  cameraGoalTarget.copy(target);
  cameraTween=true;
}

function focusCountry(rec) {
  if (!rec) return;
  document.querySelectorAll('[data-camera]').forEach(b=>b.classList.remove('active'));
  const x=rec.centroid.x+(rec.targetX||0);
  const z=rec.centroid.z+(rec.targetZ||0);
  const reach=THREE.MathUtils.clamp(Math.sqrt(Math.max(1,rec.totalArea))*2.0,26,62);
  queueCamera(
    new THREE.Vector3(x+reach*0.58, Math.max(30,reach*0.84), z+reach),
    new THREE.Vector3(x, BOARD_TOP+4.2, z)
  );
}

const gltfLoader=new GLTFLoader();
const FALLBACK_MARKERS=[
  {id:'berlin-actor',label:'BERLIN',countryCode:'DE',lon:13.405,lat:52.52,asset:'meeple_red.gltf',height:4.8,title:'Actor Anchor',body:'A map node can carry a resident, character or speaker.'},
  {id:'paris-card',label:'PARIS',countryCode:'FR',lon:2.3522,lat:48.8566,asset:'pawn_A_blue.gltf',height:4.6,title:'Card Anchor',body:'Reserved for later KFB CardBuilder / PDF-card placement.'},
  {id:'rome-event',label:'ROME',countryCode:'IT',lon:12.4964,lat:41.9028,asset:'flag_A_yellow.gltf',height:5.4,title:'Event Anchor',body:'Events can be staged as physical board-game objects.'},
  {id:'warsaw-evidence',label:'WARSAW',countryCode:'PL',lon:21.0122,lat:52.2297,asset:'token_green.gltf',height:3.4,title:'Evidence Token',body:'A compact token can represent a contextual evidence point.'},
  {id:'london-location',label:'LONDON',countryCode:'GB',lon:-0.1276,lat:51.5072,asset:'building_blue.gltf',height:4.7,title:'Location Prop',body:'A place can receive a real KayKit prop while the map remains editable.'}
];

async function loadStoryManifest() {
  try {
    storyManifest=await fetchJson('./data/story-demo.v1.json',{timeoutMs:6000,retries:0,cache:'no-store'});
    markerSpecs=(storyManifest.stories||[]).filter(s=>s.asset && s.countryCode);
    if (!markerSpecs.length) throw new Error('story manifest has no markers');
  } catch (err) {
    console.warn('Story manifest fallback',err);
    markerSpecs=FALLBACK_MARKERS;
  }
}

function loadGltf(url,timeoutMs=12000) {
  return new Promise((resolve,reject)=>{
    let settled=false;
    const timer=setTimeout(()=>{
      if(settled) return;
      settled=true;
      reject(new Error('GLTF timeout '+timeoutMs+'ms · '+url));
    },timeoutMs);
    gltfLoader.load(
      url,
      gltf=>{
        if(settled) return;
        settled=true;
        clearTimeout(timer);
        resolve(gltf);
      },
      undefined,
      err=>{
        if(settled) return;
        settled=true;
        clearTimeout(timer);
        reject(err);
      }
    );
  });
}
async function addKayKitMarkers() {
  for (const spec of markerSpecs) {
    try {
      const gltf=await loadGltf(KAYKIT_BASE+spec.asset);
      const obj=gltf.scene;
      obj.traverse(o=>{
        if (o.isMesh) {
          o.castShadow=true;
          o.receiveShadow=true;
        }
      });
      let box=new THREE.Box3().setFromObject(obj);
      const size=box.getSize(new THREE.Vector3());
      const targetSize=Number(spec.size ?? spec.height ?? 4);
      const longest=Math.max(size.x,size.y,size.z,0.001);
      const scale=targetSize/longest;
      obj.scale.multiplyScalar(scale);
      box=new THREE.Box3().setFromObject(obj);
      const scaledSize=box.getSize(new THREE.Vector3());
      obj.position.y-=box.min.y;

      const rec=countries.find(c=>c.code===spec.countryCode);
      if (!rec) throw new Error('country '+spec.countryCode+' unavailable');

      const holder=new THREE.Group();
      const p=project(spec.lon,spec.lat);
      holder.position.set(p.x,PIECE_DEPTH+0.12,p.z);
      holder.scale.y=1/heightScale;
      holder.userData.extent=Math.max(scaledSize.x,scaledSize.y,scaledSize.z);
      holder.userData.visualHeight=scaledSize.y;
      holder.add(obj);

      const el=document.createElement('div');
      el.className='story-label';
      el.textContent=spec.label;
      const lab=new CSS2DObject(el);
      lab.position.set(0,Math.max(1.5,scaledSize.y+0.72),0);
      holder.add(lab);

      rec.group.add(holder);
      rec.markers.push(holder);
      tokenHolders.push(holder);
      markerRecords.push({spec,holder,labelEl:el,country:rec});
      updateDiag();
    } catch (err) {
      console.warn('KayKit marker failed',spec.asset,err);
    }
  }
}

function activateStory(index) {
  if (!markerRecords.length) return;
  storyCursor=((index%markerRecords.length)+markerRecords.length)%markerRecords.length;
  clearStoryActive();
  document.querySelectorAll('[data-camera]').forEach(b=>b.classList.remove('active'));
  const mark=markerRecords[storyCursor];
  mark.labelEl?.classList.add('active');
  selectCountry(mark.country,{fromStory:true});
  selKicker.textContent='STORY FOCUS · '+mark.spec.label;
  selName.textContent=mark.spec.title || mark.spec.label;
  selText.textContent=mark.spec.body || 'Data-driven content anchor on the geographic board.';
  const wp=new THREE.Vector3();
  mark.holder.getWorldPosition(wp);
  const extent=mark.holder.userData.extent||Number(mark.spec.size??mark.spec.height??4);
  const reach=Math.max(22,extent*5.3);
  queueCamera(
    new THREE.Vector3(wp.x+reach*0.72, Math.max(24,16+extent*2.1), wp.z+reach),
    new THREE.Vector3(wp.x, BOARD_TOP+PIECE_DEPTH+Math.max(1.8,mark.holder.userData.visualHeight||2), wp.z)
  );
}

async function loadInkCanon() {
  try {
    setBootPhase('ink-canon','Loading KFB ink capability…');
    const canon=await Promise.race([
      import(KFB_INK_URL),
      new Promise((_,reject)=>setTimeout(()=>reject(new Error('KFB ink import timeout')),8000))
    ]);
    const version=canon.INK_CANON_VERSION;
    if (version>=2 && typeof canon.measureInk==='function') {
      inkCanonStatus='canon v'+version+' + map BAND adapter';
      if (canon.INK_COLOR!==undefined) {
        try {
          inkColor=new THREE.Color(canon.INK_COLOR);
          focusRingMat.color.copy(inkColor);
        } catch {}
      }
    } else {
      inkCanonStatus='capability mismatch';
    }
  } catch (err) {
    inkCanonStatus='canon unavailable; adapter black';
    console.warn('KFB Ink Canon import failed',err);
  }
}

function setCamera(name) {
  document.querySelectorAll('[data-camera]').forEach(b=>b.classList.toggle('active',b.dataset.camera===name));
  const presets={
    hero:{p:[35,128,155],t:[0,4,-5]},
    top:{p:[0,225,0.1],t:[0,0,0]},
    low:{p:[22,54,160],t:[0,7,-8]}
  };
  const v=presets[name]||presets.hero;
  queueCamera(new THREE.Vector3().fromArray(v.p),new THREE.Vector3().fromArray(v.t));
}
document.querySelectorAll('[data-camera]').forEach(b=>b.addEventListener('click',()=>setCamera(b.dataset.camera)));
focusBtn.addEventListener('click',()=>focusCountry(selected));
storyBtn.addEventListener('click',()=>activateStory(storyCursor+1));
controls.addEventListener('start',()=>{cameraTween=false;});
document.querySelector('#explodeBtn').addEventListener('click',e=>{
  exploded=!exploded;
  e.currentTarget.classList.toggle('active',exploded);
  e.currentTarget.textContent=exploded?'RECOMBINE':'EXPLODE';
  applyTargets();
});
document.querySelector('#labelsBtn').addEventListener('click',e=>{
  labelsVisible=!labelsVisible;
  e.currentTarget.classList.toggle('active',labelsVisible);
  for (const rec of countries) if (rec.label) rec.label.visible=labelsVisible;
});
document.querySelector('#tokensBtn').addEventListener('click',e=>{
  tokensVisible=!tokensVisible;
  e.currentTarget.classList.toggle('active',tokensVisible);
  tokenHolders.forEach(t=>t.visible=tokensVisible);
});
document.querySelector('#inkSlider').addEventListener('input',e=>{
  inkScale=Number(e.target.value);
  for (const rec of countries) buildCountryInk(rec);
});
document.querySelector('#heightSlider').addEventListener('input',e=>{
  heightScale=Number(e.target.value);
  for (const rec of countries) rec.group.scale.y=heightScale;
  for (const holder of tokenHolders) holder.scale.y=1/heightScale;
});

const raycaster=new THREE.Raycaster();
const pointer=new THREE.Vector2();
let down=null;
canvas.addEventListener('pointerdown',e=>{down={x:e.clientX,y:e.clientY};});
canvas.addEventListener('pointermove',e=>{
  const r=canvas.getBoundingClientRect();
  pointer.x=((e.clientX-r.left)/r.width)*2-1;
  pointer.y=-((e.clientY-r.top)/r.height)*2+1;
  raycaster.setFromCamera(pointer,camera);
  const hit=raycaster.intersectObjects(pickMeshes,false)[0];
  const next=hit?.object?.userData?.country || null;
  if (next!==hovered) {
    hovered=next;
    updateHighlights();
  }
  if (hovered) {
    hoverNote.textContent=hovered.name.toUpperCase();
    hoverNote.style.display='block';
    hoverNote.style.left=(e.clientX-r.left+12)+'px';
    hoverNote.style.top=(e.clientY-r.top+12)+'px';
    canvas.style.cursor='pointer';
  } else {
    hoverNote.style.display='none';
    canvas.style.cursor='grab';
  }
});
canvas.addEventListener('pointerleave',()=>{
  hovered=null;
  hoverNote.style.display='none';
  canvas.style.cursor='grab';
  updateHighlights();
});
canvas.addEventListener('pointerup',e=>{
  if (!down || Math.hypot(e.clientX-down.x,e.clientY-down.y)>5) { down=null; return; }
  down=null;
  const r=canvas.getBoundingClientRect();
  pointer.x=((e.clientX-r.left)/r.width)*2-1;
  pointer.y=-((e.clientY-r.top)/r.height)*2+1;
  raycaster.setFromCamera(pointer,camera);
  const hit=raycaster.intersectObjects(pickMeshes,false)[0];
  selectCountry(hit?.object?.userData?.country || null);
});

function reportState() {
  return {
    slice:'P0.2',
    build:KFB_MAP_BUILD,
    ready:window.__KFB_MAP_BOARD_READY__===true,
    phase:bootPhase,
    countriesLoaded:loadedCount,
    countriesExpected:selectedFiles.length,
    countriesFailed:failedCount,
    countryCodes:countries.map(c=>c.code),
    markersLoaded:markerRecords.length,
    markersExpected:markerSpecs.length,
    selected:selected?.code||null,
    exploded,
    labelsVisible,
    tokensVisible,
    inkCanonStatus,
    storyId:storyCursor>=0 ? markerRecords[storyCursor]?.spec?.id || null : null
  };
}

window.KFBMapBoard = {
  report:reportState,
  select(code){
    const rec=countries.find(c=>c.code===String(code||'').toUpperCase())||null;
    selectCountry(rec);
    return reportState();
  },
  focus(code){
    const rec=countries.find(c=>c.code===String(code||'').toUpperCase())||selected;
    if(rec){selectCountry(rec);focusCountry(rec);}
    return reportState();
  },
  nextStory(){
    activateStory(storyCursor+1);
    return reportState();
  },
  setExploded(value){
    exploded=!!value;
    const btn=document.querySelector('#explodeBtn');
    btn?.classList.toggle('active',exploded);
    if(btn) btn.textContent=exploded?'RECOMBINE':'EXPLODE';
    applyTargets();
    return reportState();
  }
};

function resize() {
  const w=stage.clientWidth,h=stage.clientHeight;
  renderer.setSize(w,h,false);
  labelRenderer.setSize(w,h);
  camera.aspect=w/Math.max(1,h);
  camera.updateProjectionMatrix();
}
addEventListener('resize',resize);
resize();

function animate() {
  requestAnimationFrame(animate);
  const dt=Math.min(0.05,clock.getDelta());
  const k=1-Math.pow(0.0005,dt);
  for (const rec of countries) {
    rec.group.position.x=THREE.MathUtils.lerp(rec.group.position.x,rec.targetX||0,k);
    rec.group.position.z=THREE.MathUtils.lerp(rec.group.position.z,rec.targetZ||0,k);
    rec.group.position.y=THREE.MathUtils.lerp(rec.group.position.y,rec.targetY||BOARD_TOP+0.06,k);
  }
  tokenHolders.forEach((t,i)=>{
    t.rotation.y+=dt*(0.10+i*0.012);
  });
  if (focusRing.visible) {
    const base=focusRing.userData.baseScale||1;
    const pulse=base*(1+Math.sin(clock.elapsedTime*2.4)*0.035);
    focusRing.scale.setScalar(pulse);
  }
  if (cameraTween) {
    const ck=1-Math.pow(0.0012,dt);
    camera.position.lerp(cameraGoalPos,ck);
    controls.target.lerp(cameraGoalTarget,ck);
    if (camera.position.distanceTo(cameraGoalPos)<0.08 && controls.target.distanceTo(cameraGoalTarget)<0.05) {
      camera.position.copy(cameraGoalPos);
      controls.target.copy(cameraGoalTarget);
      cameraTween=false;
    }
  }
  controls.update();
  renderer.render(scene,camera);
  labelRenderer.render(scene,camera);
}
animate();

async function boot() {
  const watchdog=setTimeout(()=>{
    if(window.__KFB_MAP_BOARD_READY__||window.__KFB_MAP_BOARD_ERROR__) return;
    window.__KFB_MAP_BOARD_ERROR__='Boot watchdog expired at phase '+bootPhase;
    setBootPhase('watchdog-error',window.__KFB_MAP_BOARD_ERROR__);
  },105000);
  try {
    await loadInkCanon();
    updateDiag('boundary catalogue pending');
    await loadBoundaries();
    if (!loadedCount) throw new Error('No OSM-derived country boundary loaded.');
    applyTargets();
    setBootPhase('story-manifest','Loading story-anchor manifest…');
    await loadStoryManifest();
    setBootPhase('kaykit-markers','Loading actual Board Game Bits from the KFB repository mirror…');
    loadingTitle.textContent='Placing KayKit story tokens…';
    await addKayKitMarkers();
    storyBtn.disabled=!markerRecords.length;
    setBootPhase('ready','P0.2 story focus ready');
    updateDiag('P0.2 story focus ready');
    window.__KFB_MAP_BOARD_READY__=true;
    clearTimeout(watchdog);
    loading.classList.add('hidden');
    setTimeout(()=>loading.style.display='none',450);
  } catch (err) {
    clearTimeout(watchdog);
    console.error(err);
    window.__KFB_MAP_BOARD_ERROR__=String(err?.stack||err);
    setBootPhase('boot-error',String(err?.message||err));
    loadingTitle.textContent='Board boot stopped';
    updateDiag('boot error');
  }
}
boot();
