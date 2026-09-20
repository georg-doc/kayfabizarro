import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const $ = (id) => document.getElementById(id);
const EMBED_BASE = new URL('../../KFB-ToolBox/kfb-rigs-embed-v3/', import.meta.url).href;
const RAW_3D = 'https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/';
const DRIVER_PATH = 'KayKit_Mystery_Series6/2 - August 2023 - Driver/character/gltf/Driver.glb';

let renderer = null;
let scene = null;
let camera = null;
let controls = null;
let clock = null;
let currentHandle = null;
let dynamicRoot = null;
let renderLoop = 0;
let loadToken = 0;

const encodePath = (path) => String(path || '').split('/').map(encodeURIComponent).join('/');
const raw3d = (path) => RAW_3D + encodePath(path);

async function fetchJson(url) {
  const response = await fetch(url, { cache:'no-store' });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${url}`);
  return response.json();
}

function disposeObject(root) {
  if (!root?.traverse) return;
  root.traverse((node) => {
    if (node.geometry?.dispose) node.geometry.dispose();
    for (const material of [].concat(node.material || [])) {
      if (!material) continue;
      for (const value of Object.values(material)) if (value?.isTexture && value.dispose) value.dispose();
      material.dispose?.();
    }
  });
}

function ensureScene() {
  const canvas = $('resourcePreviewCanvas');
  if (!renderer) {
    renderer = new THREE.WebGLRenderer({ canvas, antialias:true, alpha:true, preserveDrawingBuffer:true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xe7e1d4);
    camera = new THREE.PerspectiveCamera(38, 1, 0.01, 1000);
    camera.position.set(3.5, 2.6, 4.5);
    controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    const hemi = new THREE.HemisphereLight(0xffffff, 0x6f675a, 1.45);
    const key = new THREE.DirectionalLight(0xffffff, 2.0); key.position.set(4, 7, 5);
    const fill = new THREE.DirectionalLight(0xfff0d0, 0.75); fill.position.set(-4, 2, -3);
    scene.add(hemi, key, fill);
    dynamicRoot = new THREE.Group(); dynamicRoot.name = 'librarian-rig-preview'; scene.add(dynamicRoot);
    clock = new THREE.Clock();
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const width = Math.max(2, Math.round(rect.width || 520)), height = Math.max(2, Math.round(rect.height || 360));
      renderer.setSize(width, height, false); camera.aspect = width / height; camera.updateProjectionMatrix();
    };
    new ResizeObserver(resize).observe(canvas); resize();
  }
  if (!renderLoop) {
    const frame = () => {
      renderLoop = requestAnimationFrame(frame);
      if (!$('resourcePreviewWrap') || $('resourcePreviewWrap').hidden) return;
      const dt = Math.min(clock.getDelta(), 0.05);
      try { currentHandle?.update?.(dt, camera); } catch { /* owner runtime errors surface during load; frame stays resilient */ }
      controls?.update(); renderer?.render(scene, camera);
    };
    frame();
  }
}

function clearScene() {
  loadToken += 1;
  try { currentHandle?.dispose?.(); } catch { /* cleanup best effort */ }
  currentHandle = null;
  if (dynamicRoot) {
    for (const child of [...dynamicRoot.children]) { child.removeFromParent(); disposeObject(child); }
  }
  $('resourcePreviewWrap').hidden = true;
  $('resourcePreviewStatus').textContent = 'Idle';
  $('resourcePreviewNote').textContent = '';
}

function fitObject(object) {
  if (!object) return;
  object.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(object);
  if (box.isEmpty()) return;
  const sphere = box.getBoundingSphere(new THREE.Sphere());
  const radius = Math.max(sphere.radius, 0.25);
  const distance = radius / Math.sin(THREE.MathUtils.degToRad(camera.fov * 0.5)) * 1.25;
  const dir = new THREE.Vector3(1.05, 0.72, 1.2).normalize();
  camera.position.copy(sphere.center).addScaledVector(dir, distance);
  camera.near = Math.max(0.005, distance / 1000); camera.far = Math.max(100, distance * 12); camera.updateProjectionMatrix();
  controls.target.copy(sphere.center); controls.update();
}

async function importOwner(path) { return import(new URL(path, EMBED_BASE).href); }

async function previewCarl(row, config, token) {
  $('resourcePreviewTitle').textContent = 'CapsuleCarl · owner rig preview';
  const [{ mountCarl }, { toPets1 }, { faceMods }] = await Promise.all([
    importOwner('lab-v6/carlrig-mount.v1.js'), importOwner('lab-v6/carl-contract.v1.js'), importOwner('frizzlegraft-v1/graft-mount.v1.js'),
  ]);
  if (token !== loadToken) return;
  const pet = toPets1(config).pets[0];
  const handle = await mountCarl({ THREE, loader:new GLTFLoader(), scene:dynamicRoot, mods:await faceMods(), pet });
  if (token !== loadToken) { handle.dispose?.(); return; }
  currentHandle = handle;
  fitObject(handle.group);
  $('resourcePreviewStatus').textContent = 'Loaded · owner runtime';
  $('resourcePreviewNote').textContent = 'Exact kfb.carl.rig/6 config rendered through mountCarl(). This is the Rigging Lab reader, not a body-only approximation.';
}

async function previewGraft(row, config, token) {
  $('resourcePreviewTitle').textContent = 'FrizzleBob Driver Graft · owner rig preview';
  const { mountGraft, pickGraftPet } = await importOwner('frizzlegraft-v1/graft-mount.v1.js');
  if (token !== loadToken) return;
  const pet = pickGraftPet(config);
  if (!pet) throw new Error('No Graft pet entry found in selected kfb.pets/1 config');
  const handle = await mountGraft({ THREE, loader:new GLTFLoader(), parent:dynamicRoot, pet, lib:config, camera, animation:'own', log:()=>{} });
  if (token !== loadToken) { handle.dispose?.(); return; }
  currentHandle = handle;
  fitObject(handle.root || handle.figure);
  $('resourcePreviewStatus').textContent = 'Loaded · owner runtime';
  $('resourcePreviewNote').textContent = 'Exact kfb.pets/1 Graft config rendered through mountGraft(). Body, graft, face and owner animation path come from the ToolBox reader.';
}

async function loadModel(path) {
  const gltf = await new GLTFLoader().loadAsync(raw3d(path));
  return gltf.scene || gltf.scenes?.[0];
}

async function previewVehicle(row, config, token) {
  $('resourcePreviewTitle').textContent = 'Vehicle rig · component placement preview';
  const root = new THREE.Group(); dynamicRoot.add(root);
  const parts = [];
  const primary = config.fahrzeug?.on && config.fahrzeug?.path ? config.fahrzeug.path : config.wannenrig?.tub;
  if (primary) {
    const vehicle = await loadModel(primary);
    if (token !== loadToken) return;
    if (config.fahrzeug?.path === primary) vehicle.scale.setScalar(Number(config.fahrzeug.s || 1));
    root.add(vehicle); parts.push(vehicle);
  }
  const driver = await loadModel(DRIVER_PATH);
  if (token !== loadToken) return;
  const pose = config.aufsetzen || {};
  driver.scale.setScalar(Number(pose.s || 1));
  driver.position.set(Number(pose.x || 0), Number(pose.y || 0), Number(pose.z || 0));
  driver.rotation.y = THREE.MathUtils.degToRad(Number(pose.rot || 0));
  root.add(driver); parts.push(driver);
  if (config.wannenrig?.jOn && config.wannenrig?.jet) {
    const jet = await loadModel(config.wannenrig.jet);
    if (token !== loadToken) return;
    jet.scale.setScalar(Number(config.wannenrig.jSize || 1));
    jet.position.set(Number(config.wannenrig.jX || 0), Number(config.wannenrig.jY || 0), Number(config.wannenrig.jZ || 0));
    root.add(jet); parts.push(jet);
  }
  currentHandle = { root, update(){}, dispose(){ root.removeFromParent(); disposeObject(root); } };
  fitObject(root);
  $('resourcePreviewStatus').textContent = parts.length ? 'Loaded · partial composition' : 'No previewable components';
  $('resourcePreviewNote').textContent = 'Truth boundary: this shows referenced vehicle/tub/jet plus saved Driver placement. The ToolBox cut/base/cockpit fabrication has no standalone owner preview adapter yet and is not reproduced here.';
}

export function canPreviewRig(row) {
  return !!row && (row.schema === 'kfb.carl.rig/6' || (row.schema === 'kfb.pets/1' && (row.actorRefs || []).includes('frizzlebob-driver-graft')) || row.kind === 'vehicle-rig');
}

export async function previewRigResource(row) {
  clearScene();
  if (!canPreviewRig(row)) return false;
  ensureScene();
  $('resourcePreviewWrap').hidden = false;
  $('resourcePreviewStatus').textContent = 'Loading…';
  $('resourcePreviewNote').textContent = '';
  const token = loadToken;
  try {
    const source = row.source?.rawPinned || row.source?.rawLatest;
    if (!source) throw new Error('No source JSON URL on resource');
    const config = await fetchJson(source);
    if (token !== loadToken) return false;
    if (row.schema === 'kfb.carl.rig/6') await previewCarl(row, config, token);
    else if (row.schema === 'kfb.pets/1') await previewGraft(row, config, token);
    else await previewVehicle(row, config, token);
    return true;
  } catch (error) {
    if (token !== loadToken) return false;
    $('resourcePreviewStatus').textContent = 'Preview failed';
    $('resourcePreviewNote').textContent = error.message;
    return false;
  }
}

export function clearRigPreview() { clearScene(); }
