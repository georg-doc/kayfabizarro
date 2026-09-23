import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { createCardCarrier } from '../../terrain-planets-v1/card-carrier.js';
import { PoseRig, PRESETS } from './donors/pose-rig.v1.js';

const CARRIER_BLOB = '2eef4db5aa38fffc8e9c23457815e3be12fc3bd8';
const CARD_ART_PIN = '852f9d2cd1be228898316b205063855c95308c9a';
const CARD_ART_BLOB = '36da589c1227dc796097d71bd0fd30a539905b1f';
const CARD_ASSET_BASE = `https://raw.githubusercontent.com/georg-doc/kayfabizarro/${CARD_ART_PIN}/media/kfb/`;
const CARD_ART_URL = CARD_ASSET_BASE + 'KayfaBizarro_Card_Backside_01_lowrez.png';

const CHARACTER_PIN = '10a7fdce6b3a1ae22504ade71b7dbec5f25e0ff0';
const ACTOR_BLOB = '4785276defdb929cb397954eb74b76aecb84486b';
const ACTOR_PATH = 'media/3D_Assets/KayKit_Mystery_Series6/6 - December 2023 - Action Figure/character/gltf/ActionFigure.glb';
const RAW_ROOT = `https://raw.githubusercontent.com/georg-doc/kayfabizarro/${CHARACTER_PIN}/`;
const raw = (p) => RAW_ROOT + p.split('/').map(encodeURIComponent).join('/');
const ACTOR_URL = raw(ACTOR_PATH);

const POSE_RIG_SOURCE_COMMIT = 'd81c0ddc4607ef427501a43726cfeafa9c82b694';
const POSE_RIG_BLOB = 'a418fe550d66afea51dd95cf3229a13a343e1957';
const POSE_RIG_SOURCE_PATH = 'skills/KFB PetStudio/KFB FrankenStein Studio 16/KFB-v16/petstudio-v9/studio-v13/pose-rig.v1.js';
const SURF_PRESET = Object.freeze({ ...PRESETS.surf });

const CARD_NATIVE_WIDTH = 3.0;
const CARD_NATIVE_DEPTH = 3.0 * 447 / 800;
const CARD_WORLD_WIDTH = 0.075;
const TRAVEL_CARD_GROUP_SCALE = CARD_WORLD_WIDTH / CARD_NATIVE_WIDTH;
const GROUND_BODY_HEIGHT = 0.022;
const ACTIONFIGURE_NATIVE_HEIGHT = 2.3222826966;
const ACTOR_SCALE = (GROUND_BODY_HEIGHT / TRAVEL_CARD_GROUP_SCALE) / ACTIONFIGURE_NATIVE_HEIGHT;
const MOUNT_YAW = Math.PI;
const FOOT_NODE = /^foot|toe/i;
const FOOT_EXCLUDE = /target|pole|ik/i;

const canvas = document.querySelector('#view');
const stateEl = document.querySelector('#proof-state');

const report = {
  schema: 'kfb.travel-mode-bridge.tmb1-surf-presentation-proof/0.1',
  revision: 'TMB1-SURF-S33-01',
  phase: 'SURF_PRESENTATION_CANDIDATE',
  sources: {
    carrier: {
      path: 'travel/terrain-planets-v1/card-carrier.js',
      blob: CARRIER_BLOB,
    },
    cardArtwork: {
      commit: CARD_ART_PIN,
      blob: CARD_ART_BLOB,
      url: CARD_ART_URL,
    },
    actor: {
      commit: CHARACTER_PIN,
      path: ACTOR_PATH,
      blob: ACTOR_BLOB,
      rigFamily: 'Rig_Medium',
      url: ACTOR_URL,
    },
    poseRig: {
      repository: 'georg-doc/kayfabizarro',
      commit: POSE_RIG_SOURCE_COMMIT,
      path: POSE_RIG_SOURCE_PATH,
      blob: POSE_RIG_BLOB,
      localSnapshot: './donors/pose-rig.v1.js',
    },
  },
  neutralBaseline: {
    actorScale: ACTOR_SCALE,
    groundBodyHeight: GROUND_BODY_HEIGHT,
    neutralFootprintRadius: 0.115821,
    neutralFootprintWidth: 0.218341,
    neutralFootprintDepth: 0.14988,
  },
  surfPreset: { ...SURF_PRESET },
  sourceObjectVisible: false,
  runtimeErrors: [],
};
window.__TMB1_SURF_PROOF__ = report;

window.addEventListener('error', (event) => {
  report.runtimeErrors.push(String(event.message || event.error || 'window error'));
});
window.addEventListener('unhandledrejection', (event) => {
  report.runtimeErrors.push(String(event.reason && event.reason.message || event.reason || 'unhandled rejection'));
});

function fail(message, label = 'SOURCE ASSET FAILED') {
  report.sourceObjectVisible = false;
  report.runtimeErrors.push(message);
  stateEl.dataset.state = 'fail';
  stateEl.textContent = `${label} · ${message}`;
}

async function preflight(url, label) {
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) throw new Error(`${label} HTTP ${response.status}`);
  const blob = await response.blob();
  if (!blob.size) throw new Error(`${label} empty response`);
  return blob.size;
}

function round(n, digits = 6) {
  return +Number(n).toFixed(digits);
}
function vec(v) {
  return [round(v.x), round(v.y), round(v.z)];
}
function mean(list, key) {
  return list.length ? list.reduce((sum, row) => sum + row[key], 0) / list.length : 0;
}

function measureFeet(actor) {
  actor.updateMatrixWorld(true);

  const footBones = new Set();
  actor.traverse((node) => {
    if (node.isBone && node.name && FOOT_NODE.test(node.name) && !FOOT_EXCLUDE.test(node.name)) footBones.add(node);
  });
  if (!footBones.size) throw new Error('no foot/toe bones found');

  const points = [];
  const v = new THREE.Vector3();

  actor.traverse((mesh) => {
    if (!mesh.isSkinnedMesh || !mesh.geometry || !mesh.skeleton) return;
    const geometry = mesh.geometry;
    const skinIndex = geometry.attributes.skinIndex;
    const skinWeight = geometry.attributes.skinWeight;
    const bones = mesh.skeleton.bones;
    if (!skinIndex || !skinWeight || !bones) return;

    for (let i = 0; i < geometry.attributes.position.count; i++) {
      let bestBone = -1;
      let bestWeight = -1;
      for (let j = 0; j < 4; j++) {
        const weight = skinWeight.getComponent(i, j);
        if (weight > bestWeight) {
          bestWeight = weight;
          bestBone = skinIndex.getComponent(i, j);
        }
      }
      const bone = bones[bestBone];
      if (!bone || !footBones.has(bone)) continue;

      mesh.getVertexPosition(i, v);
      mesh.localToWorld(v);
      points.push({
        x: v.x,
        y: v.y,
        z: v.z,
        side: /l$|left/i.test(bone.name) ? 'l' : 'r',
      });
    }
  });

  if (!points.length) throw new Error('no foot-weighted vertices found');

  const center = new THREE.Vector3(
    mean(points, 'x'),
    0,
    mean(points, 'z'),
  );

  let minX = Infinity, maxX = -Infinity;
  let minZ = Infinity, maxZ = -Infinity;
  let contactLowestY = Infinity;
  let radius = 0;
  for (const point of points) {
    minX = Math.min(minX, point.x);
    maxX = Math.max(maxX, point.x);
    minZ = Math.min(minZ, point.z);
    maxZ = Math.max(maxZ, point.z);
    contactLowestY = Math.min(contactLowestY, point.y);
    radius = Math.max(radius, Math.hypot(point.x - center.x, point.z - center.z));
  }

  const left = points.filter((p) => p.side === 'l');
  const right = points.filter((p) => p.side === 'r');
  const meanL = { x: mean(left, 'x'), z: mean(left, 'z') };
  const meanR = { x: mean(right, 'x'), z: mean(right, 'z') };

  const width = maxX - minX;
  const depth = maxZ - minZ;

  return {
    footBoneNames: [...footBones].map((bone) => bone.name),
    points: points.length,
    center,
    contactLowestY,
    width,
    depth,
    radius,
    leftMean: meanL,
    rightMean: meanR,
    staggerZ: meanL.z - meanR.z,
    lateralGap: Math.abs(meanL.x - meanR.x),
    insideCard: width <= CARD_NATIVE_WIDTH && depth <= CARD_NATIVE_DEPTH,
  };
}

async function main() {
  let actorBytes = 0;
  let artBytes = 0;
  try {
    [actorBytes, artBytes] = await Promise.all([
      preflight(ACTOR_URL, 'ActionFigure'),
      preflight(CARD_ART_URL, 'card artwork'),
    ]);
  } catch (error) {
    fail(error.message);
    return;
  }

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.localClippingEnabled = true;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xdce4e3);

  const camera = new THREE.PerspectiveCamera(34, 1, 0.01, 100);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  scene.add(new THREE.HemisphereLight(0xffffff, 0x65706e, 2.0));
  const key = new THREE.DirectionalLight(0xffffff, 2.8);
  key.position.set(4, 6, 5);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xdfeaff, 0.9);
  fill.position.set(-4, 3, 1);
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
  actor.scale.setScalar(ACTOR_SCALE);
  actor.updateMatrixWorld(true);

  const poseRig = new PoseRig({
    THREE,
    root: actor,
    figure: actor,
    fb: null,
    log: () => {},
  });
  const buildReport = poseRig.build();
  if (!buildReport || buildReport.status !== 'OK') {
    fail(`S33 PoseRig unsupported · ${JSON.stringify(buildReport)}`, 'POSE DONOR FAILED');
    return;
  }
  poseRig.set({ on:true, preset:'surf', weight:1, jig:false });
  poseRig.apply();
  actor.updateMatrixWorld(true);
  const poseReport = poseRig.report();

  if (!poseReport || poseReport.status !== 'OK' || poseReport.preset !== 'surf') {
    fail(`S33 Surf preset did not apply · ${JSON.stringify(poseReport)}`, 'POSE DONOR FAILED');
    return;
  }

  let measurement;
  try {
    measurement = measureFeet(actor);
  } catch (error) {
    fail(error.message, 'SURF MEASURE FAILED');
    return;
  }
  if (!measurement.insideCard) {
    fail(
      `Surf footprint exceeds card · ${measurement.width.toFixed(4)} × ${measurement.depth.toFixed(4)}`,
      'SURF MEASURE FAILED'
    );
    return;
  }

  const carrier = createCardCarrier({ THREE, assetBase: CARD_ASSET_BASE });
  scene.add(carrier.group);

  const seatLift = -measurement.contactLowestY;
  carrier.setSeatFootprint(measurement.radius);
  carrier.setSeatLift(seatLift);
  carrier.setCalm(0);
  carrier.setLectern(0);

  const facingRoot = new THREE.Group();
  facingRoot.name = 'TMB1 Surf facing wrapper';
  facingRoot.rotation.y = MOUNT_YAW;

  const centerRoot = new THREE.Group();
  centerRoot.name = 'TMB1 Surf measured foot-center wrapper';
  centerRoot.position.set(-measurement.center.x, 0, -measurement.center.z);

  carrier.seat.add(facingRoot);
  facingRoot.add(centerRoot);
  centerRoot.add(actor);
  carrier.applyClip(actor);

  const carrierState = {
    position: new THREE.Vector3(0, 0, 0),
    quaternion: new THREE.Quaternion(),
    speed: 0.30,
    bank: 0,
    pitchTilt: 0,
    boosting: false,
    climbIn: 0,
  };

  for (let i = 0; i < 8; i++) carrier.sync(carrierState, 1 / 60, null);
  carrier.group.updateMatrixWorld(true);

  const mountedBox = new THREE.Box3().setFromObject(carrier.group);
  const mountedSize = mountedBox.getSize(new THREE.Vector3());
  const mountedCenter = mountedBox.getCenter(new THREE.Vector3());
  const radius = Math.max(mountedSize.x, mountedSize.y, mountedSize.z, 0.1);

  controls.target.copy(mountedCenter);
  camera.position.set(
    mountedCenter.x + radius * 1.18,
    mountedCenter.y + radius * 0.74,
    mountedCenter.z + radius * 1.48
  );
  controls.minDistance = radius * 0.65;
  controls.maxDistance = radius * 5;
  controls.update();

  const equivalentWorldHeight = ACTIONFIGURE_NATIVE_HEIGHT * ACTOR_SCALE * TRAVEL_CARD_GROUP_SCALE;

  report.sources.actor.bytes = actorBytes;
  report.sources.cardArtwork.bytes = artBytes;
  report.poseRig = {
    donorBlob: POSE_RIG_BLOB,
    build: buildReport,
    report: poseReport,
    preset: { ...SURF_PRESET },
  };
  report.measurement = {
    footBoneNames: measurement.footBoneNames,
    footPoints: measurement.points,
    footCenter: vec(measurement.center),
    footprintWidth: round(measurement.width),
    footprintDepth: round(measurement.depth),
    footprintRadius: round(measurement.radius),
    contactLowestY: round(measurement.contactLowestY),
    staggerZ: round(measurement.staggerZ),
    lateralGap: round(measurement.lateralGap),
    insideCard: measurement.insideCard,
  };
  report.mount = {
    actorScale: ACTOR_SCALE,
    actorEquivalentWorldHeight: equivalentWorldHeight,
    seatFootprint: measurement.radius,
    seatLift,
    mountYaw: MOUNT_YAW,
    mountYawDegrees: 180,
    sourceForwardAxis: '+Z',
    carrierForwardAxis: '-Z',
    centerWrapperPosition: vec(centerRoot.position),
    sourceRootPosition: vec(actor.position),
    sourceRootRotation: [round(actor.rotation.x), round(actor.rotation.y), round(actor.rotation.z)],
    parentedUnderCarrierSeat: actor.parent === centerRoot && centerRoot.parent === facingRoot && facingRoot.parent === carrier.seat,
    clipOwner: 'card-carrier',
  };
  report.runtime = {
    carrierName: carrier.name,
    seatPlanted: carrier.seatPlanted,
    animationMixerCreated: false,
    rootMotionApplied: false,
    movementOwnerCreated: false,
    surfPoseApplied: true,
    transitionImplemented: false,
    mountedBoundsSize: vec(mountedSize),
  };
  report.sourceObjectVisible = true;

  stateEl.textContent =
    `S33 SURF · hip ${SURF_PRESET.hip}° · knee ${SURF_PRESET.knee}° · spread ${SURF_PRESET.spread}° · stagger ${SURF_PRESET.stagger}° · measured seat r ${measurement.radius.toFixed(4)}`;

  const clock = new THREE.Clock();

  function resize() {
    const width = Math.max(1, canvas.clientWidth);
    const height = Math.max(1, canvas.clientHeight);
    const pixelRatio = renderer.getPixelRatio();
    const needResize =
      canvas.width !== Math.floor(width * pixelRatio) ||
      canvas.height !== Math.floor(height * pixelRatio);
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
