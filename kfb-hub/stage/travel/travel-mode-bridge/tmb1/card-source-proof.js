import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { createCardCarrier } from '../../terrain-planets-v1/card-carrier.js';

const TMB0_HEAD = '048499315581d2b9916a4d3fcbaba5f3adef719c';
const CARRIER_BLOB = '2eef4db5aa38fffc8e9c23457815e3be12fc3bd8';
const KAYFAB_PIN = '852f9d2cd1be228898316b205063855c95308c9a';
const ART_BLOB = '36da589c1227dc796097d71bd0fd30a539905b1f';
const ASSET_BASE = `https://raw.githubusercontent.com/georg-doc/kayfabizarro/${KAYFAB_PIN}/media/kfb/`;
const ART_URL = ASSET_BASE + 'KayfaBizarro_Card_Backside_01_lowrez.png';

const stateEl = document.querySelector('#proof-state');
const canvas = document.querySelector('#view');
const report = {
  schema: 'kfb.travel-mode-bridge.tmb1-card-source-proof/0.1',
  revision: 'TMB1-CARD-ONLY-01',
  tmb0Head: TMB0_HEAD,
  donor: {
    path: 'travel/terrain-planets-v1/card-carrier.js',
    blob: CARRIER_BLOB,
    nativeWidth: 3.0,
  },
  artwork: {
    url: ART_URL,
    blob: ART_BLOB,
  },
  phase: 'CARD_ONLY',
  sourceObjectVisible: false,
  runtimeErrors: [],
};
window.__TMB1_PROOF__ = report;

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

async function preflightArtwork() {
  const response = await fetch(ART_URL, { cache: 'no-store' });
  if (!response.ok) throw new Error(`card artwork HTTP ${response.status}`);
  const blob = await response.blob();
  if (!blob.size) throw new Error('card artwork empty response');
  return blob.size;
}

async function main() {
  let artworkBytes = 0;
  try {
    artworkBytes = await preflightArtwork();
  } catch (error) {
    fail(error.message);
    return;
  }

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.localClippingEnabled = true;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xdfe7ea);

  const camera = new THREE.PerspectiveCamera(36, 1, 0.01, 100);
  camera.position.set(4.4, 3.0, 4.8);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 0, 0);
  controls.enableDamping = true;
  controls.minDistance = 2.5;
  controls.maxDistance = 9;
  controls.update();

  const hemi = new THREE.HemisphereLight(0xffffff, 0x667078, 2.0);
  scene.add(hemi);
  const key = new THREE.DirectionalLight(0xffffff, 2.8);
  key.position.set(3, 5, 4);
  scene.add(key);

  // Exact donor construction: native width 3.0, no width override, no rebuilt card geometry.
  const carrier = createCardCarrier({ THREE, assetBase: ASSET_BASE });
  scene.add(carrier.group);

  const carrierState = {
    position: new THREE.Vector3(0, 0, 0),
    quaternion: new THREE.Quaternion(),
    speed: 0.34,
    bank: 0,
    pitchTilt: 0,
    boosting: false,
    climbIn: 0,
  };

  if (typeof carrier.setCalm === 'function') carrier.setCalm(0);

  report.artwork.bytes = artworkBytes;
  report.sourceObjectVisible = true;
  report.runtime = {
    carrierName: carrier.name,
    nativeScale: [carrier.group.scale.x, carrier.group.scale.y, carrier.group.scale.z],
    passengerCount: carrier.seat.children.length,
    syntheticStateOnly: true,
  };
  stateEl.textContent =
    `SOURCE OBJECT · exact card-carrier.js blob ${CARRIER_BLOB.slice(0, 8)}… · native width 3.0 · passenger none · drag to inspect`;

  const clock = new THREE.Clock();

  function resize() {
    const width = Math.max(1, canvas.clientWidth);
    const height = Math.max(1, canvas.clientHeight);
    const pixelRatio = renderer.getPixelRatio();
    const needResize = canvas.width !== Math.floor(width * pixelRatio) || canvas.height !== Math.floor(height * pixelRatio);
    if (needResize) {
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }
  }

  function frame() {
    const dt = Math.min(clock.getDelta(), 1 / 20);
    resize();
    carrier.sync(carrierState, dt, null);
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

main().catch((error) => fail(error.message || String(error)));
