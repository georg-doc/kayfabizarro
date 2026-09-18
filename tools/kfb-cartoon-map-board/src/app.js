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
const selName = document.querySelector('#selName');
const selText = document.querySelector('#selText');

const OPENPLANET_API = 'https://download.openplanetdata.com/files?category=boundaries&subcategory=countries&limit=-1';
const OPENPLANET_BASE = 'https://download.openplanetdata.com';
const KFB_INK_URL = 'https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@main/skills/kfb-ink-canon.js';
const KAYKIT_BASE = 'https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/KayKit_BoardGameBits_1.0_FREE/Assets/gltf/';

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
let loadedCount = 0;
let failedCount = 0;
let selectedFiles = [];
const countries = [];
const pickMeshes = [];
const tokenHolders = [];
const clock = new THREE.Clock();

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

function makePaperTexture(base = '#d8c6a6', line = '#ffffff') {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const x = c.getContext('2d');
  x.fillStyle = base;
  x.fillRect(0,0,256,256);
  const im = x.getImageData(0,0,256,256);
  for (let i=0;i<im.data.length;i+=4) {
    const n = (Math.random() - 0.5) * 15;
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
    const y = Math.random()*256;
    x.moveTo(-10,y);
    x.bezierCurveTo(60,y+(Math.random()-.5)*9,180,y+(Math.random()-.5)*9,270,y);
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
function ringToProjected(coords) {
  const a = coords.map(p=>project(p[0],p[1]));
  if (a.length>1) {
    const f=a[0], l=a[a.length-1];
    if (Math.abs(f.x-l.x)<1e-8 && Math.abs(f.z-l.z)<1e-8) a.pop();
  }
  return simplifyRDP(a, a.length>1500 ? 0.10 : a.length>500 ? 0.065 : 0.035);
}
function pointSegDist(p,a,b) {
  const dx=b.x-a.x, dz=b.z-a.z;
  if (!dx && !dz) return Math.hypot(p.x-a.x,p.z-a.z);
  let t=((p.x-a.x)*dx+(p.z-a.z)*dz)/(dx*dx+dz*dz);
  t=Math.max(0,Math.min(1,t));
  return Math.hypot(p.x-(a.x+t*dx),p.z-(a.z+t*dz));
}
function simplifyRDP(points,eps) {
  if (points.length<6) return points;
  let max=0, idx=0;
  const a=points[0], b=points[points.length-1];
  for (let i=1;i<points.length-1;i++) {
    const d=pointSegDist(points[i],a,b);
    if (d>max) { max=d; idx=i; }
  }
  if (max>eps) {
    const left=simplifyRDP(points.slice(0,idx+1),eps);
    const right=simplifyRDP(points.slice(idx),eps);
    return left.slice(0,-1).concat(right);
  }
  return [a,b];
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
  const area = polygonArea2D(points);
  const winding = Math.sign(area) || 1;
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

  const polygons=[];
  for (const geom of geoms) {
    for (const poly of normalizeGeometryInput(geom)) {
      if (!poly?.[0] || !withinEuropeCentroid(poly[0])) continue;
      const outer=ringToProjected(poly[0]);
      if (outer.length<3) continue;
      const holes=(poly.slice(1)||[]).filter(r=>r?.length>3).map(ringToProjected).filter(r=>r.length>=3);
      polygons.push({outer,holes});
    }
  }
  if (!polygons.length) return null;

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
  topM