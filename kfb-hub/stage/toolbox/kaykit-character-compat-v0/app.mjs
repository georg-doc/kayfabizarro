import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const MATRIX_URL = '/skills/chat/workflows/KAYKIT_CHARACTER_COMPAT_V0_2026-09-20/SOURCE_MATRIX.json';

const el = {
  stage: document.querySelector('#stage'),
  list: document.querySelector('#sourceList'),
  details: document.querySelector('#details'),
  assetPath: document.querySelector('#assetPath'),
  integration: document.querySelector('#integration'),
  nextGate: document.querySelector('#nextGate'),
  loadstate: document.querySelector('#loadstate'),
  buildInfo: document.querySelector('#buildInfo'),
  meshCount: document.querySelector('#meshCount'),
  skinCount: document.querySelector('#skinCount'),
  boneCount: document.querySelector('#boneCount'),
  spin: document.querySelector('#spinToggle'),
  bounds: document.querySelector('#boundsToggle'),
  fit: document.querySelector('#fitBtn')
};

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(34, 1, 0.001, 10000);
camera.position.set(3, 2.4, 4);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
el.stage.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.screenSpacePanning = true;
controls.target.set(0, 0.7, 0);

scene.add(new THREE.HemisphereLight(0xfff5dc, 0x201c19, 2.4));
const key = new THREE.DirectionalLight(0xffead1, 3.2);
key.position.set(4, 7, 5);
key.castShadow = true;
scene.add(key);
const rim = new THREE.DirectionalLight(0xb9c9ff, 1.1);
rim.position.set(-5, 3, -4);
scene.add(rim);

const floor = new THREE.Mesh(
  new THREE.CircleGeometry(5, 64),
  new THREE.ShadowMaterial({ color: 0x000000, opacity: 0.22 })
);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
floor.position.y = -0.001;
scene.add(floor);

const holder = new THREE.Group();
scene.add(holder);

const loader = new GLTFLoader();
let current = null;
let currentRow = null;
let helper = null;
let frame = null;
let loadToken = 0;

function resize() {
  const w = Math.max(1, el.stage.clientWidth);
  const h = Math.max(1, el.stage.clientHeight);
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}
new ResizeObserver(resize).observe(el.stage);
resize();

function message(title, body, show = true) {
  el.loadstate.querySelector('strong').textContent = title;
  el.loadstate.querySelector('span').textContent = body;
  el.loadstate.classList.toggle('show', show);
}

function clearObject() {
  if (helper) {
    scene.remove(helper);
    helper.geometry?.dispose?.();
    helper.material?.dispose?.();
    helper = null;
  }
  if (current) {
    holder.remove(current);
    current.traverse((o) => {
      if (o.isMesh) {
        o.geometry?.dispose?.();
        const mats = Array.isArray(o.material) ? o.material : [o.material];
        for (const m of mats) m?.dispose?.();
      }
    });
    current = null;
  }
  holder.position.set(0, 0, 0);
  holder.rotation.set(0, 0, 0);
  frame = null;
  setMetrics(null);
}

function setMetrics(stats) {
  el.meshCount.textContent = stats ? stats.meshes : '—';
  el.skinCount.textContent = stats ? stats.skinned : '—';
  el.boneCount.textContent = stats ? stats.bones : '—';
}

function objectStats(root) {
  const stats = { meshes: 0, skinned: 0, bones: 0 };
  root.traverse((o) => {
    if (o.isMesh) stats.meshes++;
    if (o.isSkinnedMesh) stats.skinned++;
    if (o.isBone) stats.bones++;
    if (o.isMesh) {
      o.castShadow = true;
      o.receiveShadow = true;
    }
  });
  return stats;
}

function stageObject(root) {
  current = root;
  holder.add(root);
  root.updateMatrixWorld(true);

  let box = new THREE.Box3().setFromObject(root);
  if (box.isEmpty()) throw new Error('Loaded source has no measurable bounds.');

  const center = box.getCenter(new THREE.Vector3());
  holder.position.set(-center.x, -box.min.y, -center.z);
  holder.updateMatrixWorld(true);

  box = new THREE.Box3().setFromObject(holder);
  const stagedCenter = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());
  const radius = Math.max(size.length() * 0.5, 0.001);

  frame = { box, center: stagedCenter, size, radius };
  setMetrics(objectStats(root));
  updateBounds();
  fitCamera('three');
}

function fitCamera(view = 'three') {
  if (!frame) return;
  const { center, radius } = frame;
  const dirs = {
    front: new THREE.Vector3(0, 0.16, 1),
    three: new THREE.Vector3(0.78, 0.34, 1),
    side: new THREE.Vector3(1, 0.18, 0),
    back: new THREE.Vector3(0, 0.16, -1)
  };
  const dir = (dirs[view] || dirs.three).normalize();
  const distance = Math.max(radius * 2.8, 0.4);
  camera.position.copy(center).addScaledVector(dir, distance);
  camera.near = Math.max(distance / 1000, 0.001);
  camera.far = Math.max(distance * 100, 50);
  camera.updateProjectionMatrix();
  controls.target.copy(center);
  controls.update();
}

function updateBounds() {
  if (helper) {
    scene.remove(helper);
    helper.geometry?.dispose?.();
    helper.material?.dispose?.();
    helper = null;
  }
  if (el.bounds.checked && current) {
    helper = new THREE.BoxHelper(holder, 0xb8361f);
    scene.add(helper);
  }
}

function setDetails(row) {
  const values = [
    row.status || '—',
    [row.kind, row.actorClass].filter(Boolean).join(' · ') || '—',
    row.rigFamily || '—',
    row.isolation || '—'
  ];
  const dds = el.details.querySelectorAll('dd');
  values.forEach((v, i) => { if (dds[i]) dds[i].textContent = v; });
  el.assetPath.textContent = row.assetPath || 'NO VERIFIED 3D SOURCE';
  el.integration.textContent = row.integration || '—';
  el.nextGate.textContent = row.nextGate || '—';
}

function selectButton(id) {
  el.list.querySelectorAll('.source').forEach((b) => {
    b.setAttribute('aria-pressed', String(b.dataset.id === id));
  });
}

async function loadSource(row) {
  const token = ++loadToken;
  currentRow = row;
  selectButton(row.id);
  setDetails(row);
  clearObject();

  if (!row.assetUrl) {
    message('SOURCE REQUIRED', 'No 3D model is loaded for this entry. KCC-0 intentionally refuses placeholder or substitute geometry.');
    return;
  }

  message('Loading source object', row.assetPath);
  try {
    const gltf = await loader.loadAsync(row.assetUrl);
    if (token !== loadToken) return;
    stageObject(gltf.scene);
    const clips = gltf.animations?.length || 0;
    message(row.label, 'Donor loaded in isolation · embedded clips: ' + clips, false);
  } catch (error) {
    if (token !== loadToken) return;
    console.error(error);
    message('LOAD FAILED — NO FALLBACK', String(error?.message || error));
  }
}

function renderList(rows) {
  el.list.replaceChildren();
  rows.forEach((row) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'source' + (row.assetUrl ? '' : ' blocked');
    button.dataset.id = row.id;
    button.setAttribute('aria-pressed', 'false');

    const name = document.createElement('div');
    name.className = 'name';
    name.textContent = row.label;

    const meta = document.createElement('div');
    meta.className = 'meta';
    meta.textContent = [row.rigFamily, row.kind, row.status].filter(Boolean).join(' · ');

    button.append(name, meta);
    button.addEventListener('click', () => loadSource(row));
    el.list.appendChild(button);
  });
}

async function boot() {
  try {
    const response = await fetch(MATRIX_URL, { cache: 'no-store' });
    if (!response.ok) throw new Error('Source matrix HTTP ' + response.status);
    const matrix = await response.json();
    if (!Array.isArray(matrix.sources) || matrix.sources.length === 0) {
      throw new Error('Source matrix contains no sources.');
    }
    if (matrix.noPlaceholderPolicy !== true) {
      throw new Error('noPlaceholderPolicy must be true.');
    }

    renderList(matrix.sources);
    el.buildInfo.textContent =
      matrix.schema + ' · base ' + String(matrix.baseCommit).slice(0, 8) +
      ' · ' + matrix.sources.length + ' source entries · no-placeholder=true';

    const first = matrix.sources.find((x) => x.id === 'goth-girl' && x.assetUrl)
      || matrix.sources.find((x) => x.assetUrl)
      || matrix.sources[0];
    await loadSource(first);
  } catch (error) {
    console.error(error);
    message('SOURCE MATRIX FAILED', String(error?.message || error));
    el.buildInfo.textContent = 'KCC-0 boot failed';
  }
}

document.querySelectorAll('[data-view]').forEach((b) => {
  b.addEventListener('click', () => fitCamera(b.dataset.view));
});
el.fit.addEventListener('click', () => fitCamera('three'));
el.bounds.addEventListener('change', updateBounds);

const clock = new THREE.Clock();
function tick() {
  requestAnimationFrame(tick);
  const dt = Math.min(clock.getDelta(), 0.05);
  if (el.spin.checked && current) holder.rotation.y += dt * 0.55;
  if (helper) helper.update();
  controls.update();
  renderer.render(scene, camera);
}
tick();
boot();
