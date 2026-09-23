import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const CHARACTER_PIN = '10a7fdce6b3a1ae22504ade71b7dbec5f25e0ff0';
const ACTOR_BLOB = '4785276defdb929cb397954eb74b76aecb84486b';
const ACTOR_PATH = 'media/3D_Assets/KayKit_Mystery_Series6/6 - December 2023 - Action Figure/character/gltf/ActionFigure.glb';
const RIG_FAMILY = 'Rig_Medium';
const RAW_ROOT = `https://raw.githubusercontent.com/georg-doc/kayfabizarro/${CHARACTER_PIN}/`;
const raw = (path) => RAW_ROOT + path.split('/').map(encodeURIComponent).join('/');
const ACTOR_URL = raw(ACTOR_PATH);

const canvas = document.querySelector('#view');
const stateEl = document.querySelector('#proof-state');
const report = {
  schema: 'kfb.travel-mode-bridge.tmb1-actor-source-proof/0.1',
  revision: 'TMB1-ACTOR-ONLY-01',
  phase: 'ACTOR_ONLY',
  source: {
    repository: 'georg-doc/kayfabizarro',
    commit: CHARACTER_PIN,
    path: ACTOR_PATH,
    blob: ACTOR_BLOB,
    rigFamily: RIG_FAMILY,
    url: ACTOR_URL,
  },
  sourceObjectVisible: false,
  runtimeErrors: [],
};
window.__TMB1_ACTOR_PROOF__ = report;

window.addEventListener('error', (event) => {
  report.runtimeErrors.push(String(event.message || event.error || 'window error'));
});
window.addEventListener('unhandledrejection', (event) => {
  report.runtimeErrors.push(String(event.reason && event.reason.message || event.reason || 'unhandled rejection'));
});

function fail(message) {
  report.sourceObjectVisible = false;
  report.runtimeErrors.push(message);
  stateEl.dataset.state = 'fail';
  stateEl.textContent = `SOURCE ASSET FAILED · ${message}`;
}

async function preflightActor() {
  const response = await fetch(ACTOR_URL, { cache: 'no-store' });
  if (!response.ok) throw new Error(`ActionFigure HTTP ${response.status}`);
  const blob = await response.blob();
  if (!blob.size) throw new Error('ActionFigure empty response');
  return blob.size;
}

function vector3Array(v) {
  return [v.x, v.y, v.z].map((n) => +n.toFixed(6));
}
function eulerArray(e) {
  return [e.x, e.y, e.z].map((n) => +n.toFixed(6));
}

async function main() {
  let sourceBytes = 0;
  try {
    sourceBytes = await preflightActor();
  } catch (error) {
    fail(error.message);
    return;
  }

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xe5e8e5);

  const camera = new THREE.PerspectiveCamera(34, 1, 0.01, 100);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  const hemi = new THREE.HemisphereLight(0xffffff, 0x69736f, 2.25);
  scene.add(hemi);
  const key = new THREE.DirectionalLight(0xffffff, 3.0);
  key.position.set(4, 6, 5);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xd9e8ff, 1.1);
  fill.position.set(-4, 3, 2);
  scene.add(fill);

  const loader = new GLTFLoader();
  let gltf;
  try {
    gltf = await loader.loadAsync(ACTOR_URL);
  } catch (error) {
    fail(`ActionFigure GLB load failed · ${error.message || error}`);
    return;
  }

  const actor = gltf.scene;
  actor.name = actor.name || 'ActionFigure-source';

  let skinnedMeshes = 0;
  let bones = 0;
  const boneNames = [];
  actor.traverse((node) => {
    if (node.isSkinnedMesh) skinnedMeshes += 1;
    if (node.isBone) {
      bones += 1;
      if (boneNames.length < 24) boneNames.push(node.name || '(unnamed)');
    }
  });
  if (!skinnedMeshes || !bones) {
    fail(`ActionFigure rig missing · skinnedMeshes=${skinnedMeshes} bones=${bones}`);
    return;
  }

  // Keep source-root scale and rotation untouched. Center/ground only through an outer display wrapper.
  const sourceTransform = {
    position: vector3Array(actor.position),
    scale: vector3Array(actor.scale),
    rotation: eulerArray(actor.rotation),
  };

  const displayRoot = new THREE.Group();
  displayRoot.name = 'source-proof-display-wrapper';
  displayRoot.add(actor);
  scene.add(displayRoot);

  actor.updateMatrixWorld(true);
  const sourceBox = new THREE.Box3().setFromObject(actor);
  const sourceSize = sourceBox.getSize(new THREE.Vector3());
  const sourceCenter = sourceBox.getCenter(new THREE.Vector3());
  displayRoot.position.set(-sourceCenter.x, -sourceBox.min.y, -sourceCenter.z);
  displayRoot.updateMatrixWorld(true);

  const framedBox = new THREE.Box3().setFromObject(displayRoot);
  const framedSize = framedBox.getSize(new THREE.Vector3());
  const height = Math.max(framedSize.y, 0.01);
  const radius = Math.max(framedSize.x, framedSize.y, framedSize.z, 0.01);

  controls.target.set(0, height * 0.46, 0);
  camera.position.set(height * 0.62, height * 0.58, Math.max(height * 1.55, radius * 1.45));
  controls.minDistance = height * 0.65;
  controls.maxDistance = height * 4.5;
  controls.update();

  report.source.bytes = sourceBytes;
  report.sourceObjectVisible = true;
  report.runtime = {
    rootName: actor.name,
    sourceTransform,
    displayOffset: vector3Array(displayRoot.position),
    sourceBounds: {
      min: vector3Array(sourceBox.min),
      max: vector3Array(sourceBox.max),
      size: vector3Array(sourceSize),
    },
    framedBounds: {
      min: vector3Array(framedBox.min),
      max: vector3Array(framedBox.max),
      size: vector3Array(framedSize),
    },
    skinnedMeshes,
    bones,
    boneNames,
    embeddedClips: gltf.animations.map((clip) => clip.name),
    animationMixerCreated: false,
    rootMotionApplied: false,
    cardCarrierPresent: false,
    passengerMounted: false,
  };

  stateEl.textContent =
    `SOURCE OBJECT · ActionFigure.glb blob ${ACTOR_BLOB.slice(0, 8)}… · ${RIG_FAMILY} · ${bones} bones · no card · drag to inspect`;

  function resize() {
    const width = Math.max(1, canvas.clientWidth);
    const heightPx = Math.max(1, canvas.clientHeight);
    const pixelRatio = renderer.getPixelRatio();
    const needResize =
      canvas.width !== Math.floor(width * pixelRatio) ||
      canvas.height !== Math.floor(heightPx * pixelRatio);
    if (needResize) {
      renderer.setSize(width, heightPx, false);
      camera.aspect = width / heightPx;
      camera.updateProjectionMatrix();
    }
  }

  function frame() {
    resize();
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

main().catch((error) => fail(error.message || String(error)));
