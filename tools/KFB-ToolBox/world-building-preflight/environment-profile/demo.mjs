import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { collectTris } from 'https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@fa5275ff2d881461f57bcfcaac45e4155e2862d9/tools/world_atlas/source/lib/dungeon-grid.js';
import { measureFlame } from 'https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@fa5275ff2d881461f57bcfcaac45e4155e2862d9/tools/world_atlas/source/lib/dungeon-light.js';
import { createEnvironmentRig } from './environment-rig.mjs';
import { MATERIAL_PROFILE_SOURCE, MATERIAL_PROFILE_MATTE, applyMaterialProfile } from './material-profile.mjs';
import { SOURCE_MAIN_SHA } from './profile-core.mjs';

const ROOT = `https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@${SOURCE_MAIN_SHA}/media/3D_Assets/KayKit_Dungeon_Pack_1.1_FREE%202/Assets/gltf/`;
const ASSET = Object.freeze({ torch: `${ROOT}torch_mounted.gltf`, wall: `${ROOT}wall.gltf` });
const $ = (id) => document.getElementById(id);
const canvas = $('view');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(36, 1, 0.05, 120);
camera.position.set(5.8, 4.6, 7.2);
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.target.set(0, 1.1, 0);

const rig = createEnvironmentRig({ scene, renderer });
rig.setVisible(false);
const loader = new GLTFLoader();
const sourceGroup = new THREE.Group(); sourceGroup.name = 'SOURCE_OBJECT_ISOLATION'; scene.add(sourceGroup);
const environmentGroup = new THREE.Group(); environmentGroup.name = 'ENVIRONMENT_PROFILE_PROOF'; environmentGroup.visible = false; scene.add(environmentGroup);

let sourceTorch = null;
let environmentMaterialRoot = environmentGroup;
let currentMode = 'SOURCE';
let envMode = 'DUSK';
let materialRef = MATERIAL_PROFILE_SOURCE;
let sourceIsolationRendered = false;
let consoleErrors = 0;
let flameLocal = null;
const errors = [];

window.addEventListener('error', (event) => { consoleErrors++; errors.push(String(event.error || event.message)); updateReport(); });
window.addEventListener('unhandledrejection', (event) => { consoleErrors++; errors.push(String(event.reason)); updateReport(); });

function cloneModel(root) {
  const clone = root.clone(true);
  clone.traverse((o) => {
    if (o.isMesh) {
      o.castShadow = true;
      o.receiveShadow = true;
      if (Array.isArray(o.material)) o.material = o.material.map((m) => m.clone());
      else if (o.material) o.material = o.material.clone();
    }
  });
  return clone;
}

function normalize(root, target = 2.2) {
  root.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(root);
  const size = box.getSize(new THREE.Vector3());
  const scale = target / Math.max(size.x, size.y, size.z, 1e-5);
  root.scale.setScalar(scale);
  root.updateMatrixWorld(true);
  const box2 = new THREE.Box3().setFromObject(root);
  const center = box2.getCenter(new THREE.Vector3());
  root.position.x -= center.x;
  root.position.z -= center.z;
  root.position.y -= box2.min.y;
  root.updateMatrixWorld(true);
  return scale;
}

function flameWorldFor(object, local) {
  const v = new THREE.Vector3(local[0], local[1], local[2]);
  return object.localToWorld(v);
}

async function loadSource() {
  $('status').textContent = 'LOADING REAL SOURCE OBJECT…';
  const torchGLTF = await loader.loadAsync(ASSET.torch);
  sourceTorch = torchGLTF.scene;
  sourceTorch.name = 'REAL_SOURCE · torch_mounted.gltf';
  normalize(sourceTorch, 2.8);
  applyMaterialProfile(sourceTorch, MATERIAL_PROFILE_SOURCE);
  sourceGroup.add(sourceTorch);
  const tris = collectTris(sourceTorch);
  flameLocal = measureFlame(tris);
  $('asset-proof').textContent = `REAL SOURCE · torch_mounted.gltf · blob 39d1f2a… · ${tris.length} tris · flame measured`;

  const srcHemi = new THREE.HemisphereLight(0xdcd6ff, 0x2a2140, 2.0);
  const srcKey = new THREE.DirectionalLight(0xfff3e0, 2.2);
  srcKey.position.set(-3, 6, 5);
  sourceGroup.add(srcHemi, srcKey);
  frameSource();
  $('status').textContent = 'SOURCE OBJECT READY · ISOLATION FIRST';
}

function frameSource() {
  const box = new THREE.Box3().setFromObject(sourceTorch || sourceGroup);
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());
  const r = Math.max(size.x, size.y, size.z, 1);
  controls.target.copy(center);
  camera.position.set(center.x + r * 1.8, center.y + r * 1.0, center.z + r * 2.4);
  camera.near = Math.max(0.02, r / 100); camera.far = r * 30; camera.updateProjectionMatrix();
}

async function buildEnvironment() {
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(12, 9), new THREE.MeshStandardMaterial({ color: 0x5b5861, roughness: 0.9, metalness: 0 }));
  floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; floor.name = 'simple-ground'; environmentGroup.add(floor);

  const wallGLTF = await loader.loadAsync(ASSET.wall);
  const wallSource = wallGLTF.scene;
  normalize(wallSource, 4.0);
  const wall = cloneModel(wallSource);
  wall.position.set(0, 0, -3.2);
  environmentGroup.add(wall);

  const torchRoots = [];
  const placements = [
    [-4.2, 1.0, -2.45], [-2.55, 1.0, -2.45], [-0.9, 1.0, -2.45],
    [0.9, 1.0, -2.45], [2.55, 1.0, -2.45], [4.2, 1.0, -2.45]
  ];
  const sourcePoints = [];
  for (let i = 0; i < placements.length; i++) {
    const torch = cloneModel(sourceTorch);
    torch.name = `real-torch-${i + 1}`;
    torch.position.set(...placements[i]);
    environmentGroup.add(torch);
    torchRoots.push(torch);
    torch.updateMatrixWorld(true);
    sourcePoints.push(flameWorldFor(torch, flameLocal));
  }
  environmentGroup.userData.torches = torchRoots;
  rig.setTorchSources(sourcePoints);
  rig.setFocus(new THREE.Vector3(0, 1.1, 0.2));
  applyMaterialProfile(environmentMaterialRoot, MATERIAL_PROFILE_SOURCE);
}

function setProof(next) {
  currentMode = next === 'ENVIRONMENT' ? 'ENVIRONMENT' : 'SOURCE';
  const integrated = currentMode === 'ENVIRONMENT';
  sourceGroup.visible = !integrated;
  environmentGroup.visible = integrated;
  rig.setVisible(integrated);
  $('source-btn').dataset.active = String(!integrated);
  $('env-btn').dataset.active = String(integrated);
  $('env-controls').disabled = !integrated;
  if (!integrated) {
    applyMaterialProfile(sourceTorch, MATERIAL_PROFILE_SOURCE);
    scene.fog = null;
    scene.background = new THREE.Color(0x201c28);
    renderer.toneMapping = THREE.NoToneMapping;
    renderer.toneMappingExposure = 1;
    frameSource();
  } else {
    rig.setEnvironment(envMode);
    rig.setTorchEnabled($('torch-toggle').checked);
    rig.setLocalVisibility($('local').value);
    applyMaterialProfile(environmentMaterialRoot, materialRef);
    controls.target.set(0, 1.05, -0.4);
    camera.position.set(7.2, 5.2, 8.8);
  }
  updateReport();
}

function updateReport() {
  const snap = rig.snapshot();
  $('report').textContent = [
    `proof=${currentMode}`,
    `sourceIsolationRendered=${sourceIsolationRendered}`,
    `environment=${envMode}`,
    `torches=${snap.sourceCount}`,
    `activePool=${snap.activePool}/${snap.poolMax}`,
    `local=${Number($('local').value || 0).toFixed(2)}`,
    `fog=${integratedFog()}`,
    `material=${materialRef}`,
    `consoleErrors=${consoleErrors}`
  ].join(' · ');
}
function integratedFog() { return scene.fog?.isFogExp2 ? `FogExp2:${scene.fog.density.toFixed(3)}` : 'none'; }

$('source-btn').addEventListener('click', () => setProof('SOURCE'));
$('env-btn').addEventListener('click', () => { if (sourceIsolationRendered) setProof('ENVIRONMENT'); });
$('environment').addEventListener('change', (e) => { envMode = e.target.value; rig.setEnvironment(envMode); updateReport(); });
$('torch-toggle').addEventListener('change', (e) => { rig.setTorchEnabled(e.target.checked); updateReport(); });
$('local').addEventListener('input', (e) => { rig.setLocalVisibility(e.target.value); updateReport(); });
$('material').addEventListener('change', (e) => {
  materialRef = e.target.value === 'MATTE' ? MATERIAL_PROFILE_MATTE : MATERIAL_PROFILE_SOURCE;
  applyMaterialProfile(environmentMaterialRoot, materialRef);
  updateReport();
});

function resize() {
  const w = canvas.clientWidth, h = canvas.clientHeight;
  const dprW = Math.floor(w * Math.min(devicePixelRatio || 1, 1.5));
  const dprH = Math.floor(h * Math.min(devicePixelRatio || 1, 1.5));
  if (canvas.width !== dprW || canvas.height !== dprH) renderer.setSize(w, h, false);
  camera.aspect = w / Math.max(h, 1); camera.updateProjectionMatrix();
}

let frameCount = 0;
function tick(ms) {
  resize();
  controls.update();
  if (currentMode === 'ENVIRONMENT') rig.update(ms * 0.001);
  renderer.render(scene, camera);
  frameCount++;
  if (!sourceIsolationRendered && sourceTorch && currentMode === 'SOURCE' && frameCount > 2) {
    sourceIsolationRendered = true;
    $('env-btn').disabled = false;
    $('status').textContent = 'SOURCE OBJECT RENDERED · ENVIRONMENT PROOF UNLOCKED';
    updateReport();
  }
  requestAnimationFrame(tick);
}

window.__WB1_P1 = {
  schema: 'kfb.environment-profile/1',
  sourceMainSha: SOURCE_MAIN_SHA,
  get sourceIsolationRendered() { return sourceIsolationRendered; },
  get consoleErrors() { return consoleErrors; },
  get errors() { return [...errors]; },
  snapshot: () => ({ ...rig.snapshot(), proof: currentMode, sourceIsolationRendered, consoleErrors, materialRef, flameLocal }),
  setProof,
  setEnvironment: (value) => { envMode = value === 'DAY' ? 'DAY' : 'DUSK'; $('environment').value = envMode; rig.setEnvironment(envMode); },
  setLocalVisibility: (value) => { $('local').value = value; rig.setLocalVisibility(value); },
  setMaterial: (value) => { materialRef = value === MATERIAL_PROFILE_MATTE ? MATERIAL_PROFILE_MATTE : MATERIAL_PROFILE_SOURCE; applyMaterialProfile(environmentMaterialRoot, materialRef); },
  screenshot: () => canvas.toDataURL('image/png')
};

try {
  await loadSource();
  await buildEnvironment();
  setProof('SOURCE');
  requestAnimationFrame(tick);
} catch (error) {
  consoleErrors++;
  errors.push(String(error?.stack || error));
  $('status').textContent = `FAIL LOUDLY · ${error.message || error}`;
  $('report').textContent = errors.join('\n');
  console.error(error);
}
