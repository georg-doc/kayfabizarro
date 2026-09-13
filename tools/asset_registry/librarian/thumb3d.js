import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const cache = new Map();
const queue = [];
let running = false;

function disposeScene(root) {
  root?.traverse((obj) => {
    obj.geometry?.dispose?.();
    for (const material of (Array.isArray(obj.material) ? obj.material : [obj.material]).filter(Boolean)) {
      for (const value of Object.values(material)) if (value?.isTexture) value.dispose?.();
      material.dispose?.();
    }
  });
}

async function renderThumb(record) {
  const canvas = document.createElement('canvas');
  canvas.width = 360;
  canvas.height = 240;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, preserveDrawingBuffer: true });
  renderer.setSize(360, 240, false);
  renderer.setPixelRatio(1);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xeee7da);
  const camera = new THREE.PerspectiveCamera(38, 360 / 240, 0.01, 5000);
  scene.add(new THREE.HemisphereLight(0xffffff, 0x777777, 2.3));
  const key = new THREE.DirectionalLight(0xffffff, 2.0);
  key.position.set(4, 7, 3);
  scene.add(key);

  let root;
  try {
    const gltf = await new GLTFLoader().loadAsync(record.source?.rawPinned || record.source?.rawLatest);
    root = gltf.scene;
    scene.add(root);
    const sphere = new THREE.Box3().setFromObject(root).getBoundingSphere(new THREE.Sphere());
    const radius = Math.max(sphere.radius, 0.01);
    const fov = THREE.MathUtils.degToRad(camera.fov);
    const distance = (radius / Math.sin(fov / 2)) * 1.2;
    camera.position.copy(sphere.center).add(new THREE.Vector3(1, 0.58, 1).normalize().multiplyScalar(distance));
    camera.near = Math.max(radius / 100, 0.001);
    camera.far = Math.max(distance + radius * 10, 100);
    camera.lookAt(sphere.center);
    camera.updateProjectionMatrix();
    renderer.render(scene, camera);
    return canvas.toDataURL('image/jpeg', 0.84);
  } finally {
    if (root) {
      scene.remove(root);
      disposeScene(root);
    }
    renderer.dispose();
    renderer.forceContextLoss?.();
  }
}

async function pump() {
  if (running || !queue.length) return;
  running = true;
  while (queue.length) {
    const { record, target, resolve } = queue.shift();
    let value = null;
    try { value = await renderThumb(record); } catch { value = null; }
    cache.set(record.assetId, value);
    if (target.isConnected) applyThumb(target, value);
    resolve(value);
  }
  running = false;
}

function applyThumb(target, dataUrl) {
  target.replaceChildren();
  if (dataUrl) {
    const img = document.createElement('img');
    img.alt = '';
    img.src = dataUrl;
    target.append(img);
  } else {
    const span = document.createElement('span');
    span.className = 'thumb-label';
    span.textContent = '3D';
    target.append(span);
  }
}

function enqueue(record, target) {
  if (cache.has(record.assetId)) {
    applyThumb(target, cache.get(record.assetId));
    return;
  }
  if (target.dataset.thumbQueued === '1') return;
  target.dataset.thumbQueued = '1';
  const loading = document.createElement('span');
  loading.className = 'thumb-loading';
  loading.textContent = '3D preview';
  target.replaceChildren(loading);
  new Promise((resolve) => queue.push({ record, target, resolve })).finally(() => { delete target.dataset.thumbQueued; });
  pump();
}

const observer = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (!entry.isIntersecting) continue;
    observer.unobserve(entry.target);
    const record = entry.target.__kfbRecord;
    if (record) enqueue(record, entry.target);
  }
}, { rootMargin: '180px 0px' });

export function attach3DThumbnail(record, target) {
  const supported = record.kind === 'model-3d' && ['glb', 'gltf'].includes(record.format);
  if (!supported) return false;
  target.__kfbRecord = record;
  observer.observe(target);
  return true;
}
