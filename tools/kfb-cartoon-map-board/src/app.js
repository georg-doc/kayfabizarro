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
  m.castShadow =