import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { createPhysics, STEP } from '../../free-roam/site/physics.js';
import { createDriveIntent } from '../../free-roam/site/drive-intent.mjs';
import {
  buildBuildingMesh,
  buildPolygonMesh,
  buildRoadMesh,
  buildSidewalkMesh,
  classifyDriveSurface,
  createSoundFacts,
  resolveCityStart,
  validateCityScene
} from './city-geometry.mjs';
import { buildStyledBuildingMesh } from './city-style.mjs';
import {
  createDeformer,
  FALLBACK_PROFILE,
  SCHEMA as DEFORMER_SCHEMA
} from 'https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@f30b719a8c9da3e9ac90d4d9628c0691d676d1e9/tools/KFB-ToolBox/_inbox/KFB%20Cartoon%20Vehicle%20Deformer%20Lab%20v2/WSA_Vehicles_v2_2026-09-18/lab-v7/vehicle-cartoon-deformer.v2.js';

const $ = id => document.getElementById(id);
const keys = new Set();
const removers = [];
const on = (target, event, handler, options) => {
  target.addEventListener(event, handler, options);
  removers.push(() => target.removeEventListener(event, handler, options));
};
const setLoading = message => { $('loading').textContent = message; };

const query = new URLSearchParams(location.search);
setLoading('Lade den festgeschriebenen Stadtausschnitt …');
const recipeUrl = new URL('../city-drive-recipe.json', import.meta.url);
const recipe = await fetch(recipeUrl).then(response => {
  if (!response.ok) throw new Error(`Rezept konnte nicht geladen werden (${response.status})`);
  return response.json();
});
const requestedCity = query.get('city') || recipe.defaultCity;
const cityConfig = recipe.cities[requestedCity] || recipe.cities[recipe.defaultCity];
const lookName = ['cartoon', 'grotesque'].includes(query.get('look')) ? query.get('look') : recipe.defaultLook;
const style = await fetch(recipe.style.url, { cache: 'force-cache' }).then(response => {
  if (!response.ok) throw new Error(`Stadtstil konnte nicht geladen werden (${response.status})`);
  return response.json();
});
const city = validateCityScene(await fetch(cityConfig.url, { cache: 'force-cache' }).then(response => {
  if (!response.ok) throw new Error(`Stadtdaten konnten nicht geladen werden (${response.status})`);
  return response.json();
}), cityConfig.id);

const cityLabel = cityConfig.label;
document.title = `KFB · ${cityLabel} City Drive`;
$('city-title-long').textContent = `${cityLabel} · ${lookName === 'grotesque' ? 'groteske' : 'cartoon'} Fahrprobe`;
$('city-title-short').textContent = cityLabel;
$('view').setAttribute('aria-label', `Befahrbarer ${cityLabel}-Ausschnitt`);
$('gate-title').innerHTML = `Eine erste Runde<br>durch ${cityLabel}.`;
$('city-select').value = city.id;
$('look-select').value = lookName;

setLoading('Baue Straßen, Gehwege und Häuser …');
const roadData = buildRoadMesh(city);
const sidewalkData = buildSidewalkMesh(city);
const landData = buildPolygonMesh(city.surfaces.landuse, { y: -0.075 });
const buildingData = buildBuildingMesh(city);
const styledBuildingData = buildStyledBuildingMesh(city, style, lookName);
if (!roadData.indices.length || !buildingData.indices.length) throw new Error('Der Stadt-Export enthält keine nutzbaren Kontaktflächen');

const renderer = new THREE.WebGLRenderer({
  canvas: $('view'),
  antialias: true,
  preserveDrawingBuffer: new URLSearchParams(location.search).has('qa')
});
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.08;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x86b8c4);
scene.fog = new THREE.Fog(0x86b8c4, 210, 720);
scene.add(new THREE.HemisphereLight(0xfff4dc, 0x334958, 2.25));
const sun = new THREE.DirectionalLight(0xffe4b8, 2.4);
sun.position.set(-170, 260, -210);
sun.target.position.set(0, 0, 0);
scene.add(sun, sun.target);

const camera = new THREE.PerspectiveCamera(58, 1, 0.05, 1500);
const clip = city.frame.clipRectM;
const start = resolveCityStart(city, cityConfig.start);
const groundSupport = {
  width: clip.maxX - clip.minX,
  depth: clip.maxZ - clip.minZ,
  centerX: (clip.minX + clip.maxX) / 2,
  centerZ: (clip.minZ + clip.maxZ) / 2,
  topY: -0.11,
  thickness: 0.2
};
const fixture = {
  scale: 1,
  frameQ: new THREE.Quaternion(),
  surfaces: [
    {
      id: 'island',
      shape: 'box',
      kind: 'terrain',
      road: true,
      p: [groundSupport.centerX, groundSupport.topY - groundSupport.thickness / 2, groundSupport.centerZ],
      size: [groundSupport.width, groundSupport.thickness, groundSupport.depth]
    },
    { id: 'city-roads', shape: 'gltf', kind: 'terrain', road: true, p: [0, 0, 0] },
    { id: 'city-buildings', shape: 'gltf', kind: 'building', road: false, p: [0, 0, 0] }
  ],
  start,
  diagnostics: {
    sourceRoads: roadData.stats.sourceRoads,
    roadTriangles: roadData.stats.triangles,
    sourceBuildings: buildingData.stats.sourceBuildings,
    buildingTriangles: buildingData.stats.triangles,
    clipRectM: clip,
    groundSupport: 'FULL_OSM_CLIP_URBAN_GROUND'
  },
  toWorld(value) {
    if (Array.isArray(value)) return new THREE.Vector3(value[0], value[1], value[2]);
    return new THREE.Vector3(value.x, value.y, value.z);
  },
  toLocal(value) { return new THREE.Vector3(value.x, value.y, value.z); },
  inBounds(point, purpose) {
    const margin = purpose === 'safe' ? 3 : 16;
    return point[0] >= clip.minX - margin && point[0] <= clip.maxX + margin
      && point[2] >= clip.minZ - margin && point[2] <= clip.maxZ + margin
      && point[1] >= -25 && point[1] <= 80;
  },
  upError() { return 0; }
};

function geometryFrom(data) {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(data.vertices, 3));
  geometry.setIndex(new THREE.BufferAttribute(data.indices, 1));
  if (data.colors) geometry.setAttribute('color', new THREE.BufferAttribute(data.colors, 3));
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
  return geometry;
}

const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(groundSupport.width, groundSupport.depth),
  new THREE.MeshStandardMaterial({ color: style.palette.green, roughness: 1 })
);
ground.rotation.x = -Math.PI / 2;
ground.position.set(groundSupport.centerX, groundSupport.topY, groundSupport.centerZ);
scene.add(ground);
const land = new THREE.Mesh(
  geometryFrom(landData),
  new THREE.MeshStandardMaterial({ color: style.palette.greenDark, roughness: 1, polygonOffset: true, polygonOffsetFactor: 1 })
);
scene.add(land);
const sidewalks = new THREE.Mesh(
  geometryFrom(sidewalkData),
  new THREE.MeshStandardMaterial({ color: style.palette.sidewalk, roughness: 0.96 })
);
scene.add(sidewalks);
const roads = new THREE.Mesh(
  geometryFrom(roadData),
  new THREE.MeshStandardMaterial({ color: style.palette.road, roughness: 0.91, metalness: 0.04 })
);
scene.add(roads);
const buildings = new THREE.Mesh(
  geometryFrom(styledBuildingData),
  new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.92, flatShading: true })
);
scene.add(buildings);

const anchors = new Map(city.anchors.map(anchor => [anchor.id, anchor]));
const markerMaterial = new THREE.MeshStandardMaterial({ color: 0xf0c74b, emissive: 0x503600, roughness: 0.7 });
for (const anchor of city.anchors) {
  if (anchor.id === start.anchorId) continue;
  const marker = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.9, 2.2, 10), markerMaterial);
  marker.position.set(anchor.local.x, 1.1, anchor.local.z);
  marker.userData.anchorId = anchor.id;
  scene.add(marker);
}

setLoading('Verbinde die vorhandene Free-Roam-Fahrphysik …');
const physics = await createPhysics(fixture);
physics.addMesh('city-roads', roadData.vertices, roadData.indices);
physics.addMesh('city-buildings', buildingData.vertices, buildingData.indices);
Object.assign(physics.params, { steerMax: 0.55, steerFalloff: 0.045, steerEase: 0.22, brake: 90, coast: 3 });
// The accepted donor's original course starts at yaw 0 and therefore creates its
// body without applying a custom start heading. Its public reset seam does apply
// fixture.start.yaw, so the city receiver uses that seam once after contact import.
physics.reset('receiver-start-heading');
const intent = createDriveIntent();
let current = physics.snapshot();
let previous = current;
let lastDriveInput = { throttle: 0, steer: 0, brake: false, drift: false, boost: false, hop: false };
let surface = classifyDriveSurface(city, current.position);
let soundFacts = createSoundFacts({ physical: current, signedForwardSpeed: 0, driveInput: lastDriveInput, road: surface.road });

const vehicleRoot = new THREE.Group();
scene.add(vehicleRoot);
const shell = new THREE.Group();
vehicleRoot.add(shell);
const wheelPivots = [];
for (const [x, z] of [[-0.85, 1], [0.85, 1], [-0.85, -1], [0.85, -1]]) {
  const pivot = new THREE.Group();
  const wheel = new THREE.Mesh(
    new THREE.CylinderGeometry(0.42, 0.42, 0.24, 16),
    new THREE.MeshStandardMaterial({ color: 0x18262d, roughness: 0.82 })
  );
  wheel.rotation.z = Math.PI / 2;
  pivot.position.set(x, -0.4, z);
  pivot.add(wheel);
  vehicleRoot.add(pivot);
  wheelPivots.push({ pivot, wheel });
}

const vehicleUrl = `https://raw.githubusercontent.com/${recipe.vehicle.repository}/${recipe.vehicle.commit}/${recipe.vehicle.path.split('/').map(encodeURIComponent).join('/')}`;
const loadedVehicle = await new GLTFLoader().loadAsync(vehicleUrl);
const model = loadedVehicle.scene;
let bounds = new THREE.Box3().setFromObject(model);
const size = bounds.getSize(new THREE.Vector3());
model.scale.multiplyScalar(2.8 / Math.max(size.x, size.z));
model.updateMatrixWorld(true);
bounds = new THREE.Box3().setFromObject(model);
const center = bounds.getCenter(new THREE.Vector3());
model.position.x -= center.x;
model.position.z -= center.z;
model.position.y -= bounds.min.y + 0.35;
model.traverse(node => {
  if (/wheel/i.test(node.name) || node.name === 'character') node.visible = false;
});
shell.add(model);

// C0 remains the sole owner of movement, contact and recovery. The v2 deformer only
// reparents the visible shell and wheel pivots below presentation groups and consumes
// bounded signals from that accepted physical state.
const vehicleDeformer = createDeformer(THREE, {
  group: vehicleRoot,
  body: shell,
  wheels: wheelPivots.map(({ pivot }) => ({ steer: pivot })),
  frame: { height: Math.max(1, bounds.getSize(new THREE.Vector3()).y) }
}, {
  profile: {
    ...FALLBACK_PROFILE,
    id: 'KFB_OSM_CITY_CHILL_LIGHT',
    squashAmount: 0.024,
    pitchResponse: 3.2,
    rollResponse: 4.2,
    driftYawResponse: 7,
    impactResponse: 0.06,
    landingSquash: 0.075
  }
});

const orbit = new OrbitControls(camera, $('view'));
orbit.enabled = false;
orbit.enableDamping = false;
orbit.enablePan = false;
orbit.rotateSpeed = -0.8;
orbit.minDistance = 4;
orbit.maxDistance = 250;
orbit.minPolarAngle = 0.08;
orbit.maxPolarAngle = Math.PI / 2 - 0.05;
orbit.mouseButtons.LEFT = THREE.MOUSE.ROTATE;
orbit.mouseButtons.RIGHT = THREE.MOUSE.ROTATE;

let paused = true;
let disposed = false;
let accumulator = 0;
let lastTime = performance.now();
let frameId = 0;
let orbitOn = false;
let phase = 'NEUTRAL';
let wheelAngle = 0;
let sampleCounter = 0;
let lastDeformerSpeed = 0;
let lastDeformerEventId = current.events.at(-1)?.id || null;

function clearInput() {
  keys.clear();
  intent.reset();
  accumulator = 0;
  document.querySelectorAll('[data-key]').forEach(button => { button.dataset.on = 'false'; });
}
function setPause(value) {
  paused = Boolean(value);
  clearInput();
  $('pause').textContent = paused ? 'Weiter' : 'Pause';
  lastTime = performance.now();
}
function reset() {
  clearInput();
  physics.reset('manual');
  current = physics.snapshot();
  previous = current;
  lastDeformerSpeed = signedSpeed(current);
  lastDeformerEventId = current.events.at(-1)?.id || null;
  vehicleDeformer.reset();
  surface = classifyDriveSurface(city, current.position);
  placeVehicle(1, true);
}
function request() {
  return {
    forward: keys.has('KeyW') || keys.has('ArrowUp'),
    backward: keys.has('KeyS') || keys.has('ArrowDown'),
    left: keys.has('KeyA') || keys.has('ArrowLeft'),
    right: keys.has('KeyD') || keys.has('ArrowRight'),
    driftLeft: keys.has('KeyQ'),
    driftRight: keys.has('KeyE'),
    boost: keys.has('ShiftLeft') || keys.has('ShiftRight'),
    brake: keys.has('KeyB'),
    hop: keys.has('Space')
  };
}
function signedSpeed(sample) {
  const rotation = new THREE.Quaternion(sample.rotation.x, sample.rotation.y, sample.rotation.z, sample.rotation.w);
  const forward = new THREE.Vector3(0, 0, 1).applyQuaternion(rotation);
  return forward.dot(new THREE.Vector3(sample.velocity.x, sample.velocity.y, sample.velocity.z));
}
function simulateStep() {
  const speed = signedSpeed(current);
  const input = intent.step(request(), speed, STEP, current.contacts.filter(Boolean).length);
  phase = input.phase;
  lastDriveInput = { ...input };
  previous = current;
  current = physics.step(input);
  const nextSpeed = signedSpeed(current);
  const speedNorm = THREE.MathUtils.clamp(Math.abs(nextSpeed) / physics.params.maxSpeed, 0, 1);
  const longAccel = THREE.MathUtils.clamp((nextSpeed - lastDeformerSpeed) / (STEP * 18), -1, 1);
  const steerLoad = THREE.MathUtils.clamp(-current.steer / physics.params.steerMax, -1, 1) * speedNorm;
  const driftSignal = lastDriveInput.drift
    ? THREE.MathUtils.clamp(steerLoad * 1.35 || Math.sign(lastDriveInput.steer), -1, 1)
    : 0;
  vehicleDeformer.setSignals({ speed: speedNorm, longAccel, lateral: steerLoad, bank: 0, drift: driftSignal });
  lastDeformerSpeed = nextSpeed;
  const latestEvent = current.events.at(-1);
  if (latestEvent?.id !== lastDeformerEventId) {
    if (latestEvent?.type === 'landing') {
      vehicleDeformer.landing({ strength: THREE.MathUtils.clamp(Math.abs(latestEvent.vertical || 0) / 7, 0.25, 1) });
    }
    lastDeformerEventId = latestEvent?.id || null;
  }
  sampleCounter += 1;
  if (sampleCounter % 12 === 0 || current.events.at(-1)?.id !== previous.events.at(-1)?.id) {
    surface = classifyDriveSurface(city, current.position);
  }
  soundFacts = createSoundFacts({
    physical: current,
    signedForwardSpeed: signedSpeed(current),
    driveInput: lastDriveInput,
    road: surface.road
  });
}

const look = new THREE.Vector3();
const eye = new THREE.Vector3();
function placeVehicle(alpha, snap = false) {
  const position = new THREE.Vector3().copy(previous.position).lerp(current.position, alpha);
  const rotation = new THREE.Quaternion().copy(previous.rotation).slerp(new THREE.Quaternion().copy(current.rotation), alpha);
  vehicleRoot.position.copy(position);
  vehicleRoot.quaternion.copy(rotation);
  for (let index = 0; index < wheelPivots.length; index += 1) {
    const wheel = wheelPivots[index];
    wheel.pivot.position.y = -(previous.wheelLengths[index] + (current.wheelLengths[index] - previous.wheelLengths[index]) * alpha);
    wheel.pivot.rotation.y = index < 2 ? current.steer : 0;
    wheel.wheel.rotation.x = wheelAngle;
  }
  const forward = new THREE.Vector3(0, 0, 1).applyQuaternion(rotation);
  const focus = position.clone().add(new THREE.Vector3(0, 1.15, 0));
  if (orbitOn) {
    const delta = focus.clone().sub(orbit.target);
    camera.position.add(delta);
    orbit.target.copy(focus);
    orbit.update();
  } else {
    const desired = focus.clone().addScaledVector(forward, -8.2).add(new THREE.Vector3(0, 4.2, 0));
    const clearance = physics.cameraClearance(focus, desired);
    const full = desired.distanceTo(focus);
    if (clearance.blocked && full > 0) desired.copy(focus.clone().lerp(desired, Math.max(0.18, clearance.distance / full)));
    eye.copy(desired);
    look.copy(focus).addScaledVector(forward, 2.6);
    if (snap) camera.position.copy(eye); else camera.position.lerp(eye, 0.15);
    camera.lookAt(look);
    orbit.target.copy(focus);
  }
}

function anchorDistance(id) {
  const anchor = anchors.get(id);
  return anchor ? Math.hypot(current.position.x - anchor.local.x, current.position.z - anchor.local.z) : null;
}
const snapshot = () => ({
  id: `osm-city-drive-c1-deformer-${city.id}-${lookName}`,
  ready: true,
  paused,
  phase,
  sourcePins: {
    cityCommit: cityConfig.commit,
    cityBlob: cityConfig.blob,
    styleCommit: recipe.style.commit,
    styleBlob: recipe.style.blob,
    freeRoamMerge: recipe.driveDonor.implementationMerge,
    freeRoamTestedSource: recipe.driveDonor.testedSource,
    vehicleCommit: recipe.vehicle.commit
  },
  presentation: {
    schema: DEFORMER_SCHEMA,
    sourceCommit: recipe.vehiclePresentation.commit,
    sourcePath: recipe.vehiclePresentation.path,
    physicalOwner: 'FREE_ROAM_C0',
    collisionGeometryDeformed: false,
    signals: vehicleDeformer.signals,
    readout: vehicleDeformer.readout
  },
  city: {
    id: city.id,
    label: cityLabel,
    look: lookName,
    visualGeometry: styledBuildingData.stats,
    status: city.status,
    attribution: city.source.attribution,
    diagnostics: fixture.diagnostics,
    start,
    driveSurface: {
      onMappedRoad: surface.onMappedRoad,
      sourceId: surface.road.sourceId,
      name: surface.road.tags?.name || null,
      class: surface.road.class,
      surface: surface.road.tags?.surface || null
    },
    nearestRoad: surface.nearest ? {
      sourceId: surface.nearest.road.sourceId,
      name: surface.nearest.road.tags?.name || null,
      class: surface.nearest.road.class,
      surface: surface.nearest.road.tags?.surface || null,
      distanceM: surface.nearest.distanceM
    } : null,
    anchorDistancesM: {
      intersection: anchorDistance('intersection-test'),
      roadTerrainSeam: anchorDistance('road-terrain-seam'),
      huerthJoin: anchorDistance('huerth-corridor-join'),
      ehrenfeldJoin: anchorDistance('ehrenfeld-corridor-join')
    },
    corridor: city.corridor ? {
      routePhysicalLengthM: city.corridor.routePhysicalLengthM,
      halfWidthM: city.corridor.halfWidthM,
      routePoints: Array.isArray(city.corridor.route) ? city.corridor.route.length : 0,
      joinCount: Array.isArray(city.corridor.joins) ? city.corridor.joins.length : 0,
      landmarkPlacementModes: city.landmarkPlacementSocket?.placementModes || []
    } : null
  },
  physical: physics.snapshot(),
  signedForwardSpeed: signedSpeed(current),
  driveInput: { ...lastDriveInput },
  intent: intent.snapshot(),
  soundFacts,
  audio: recipe.audioBoundary,
  runtimeConsumer: 'STANDALONE_CITY_DRIVE_NOT_TRAVEL_HOST'
});

function resize() {
  renderer.setSize(innerWidth, innerHeight, false);
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
}
on(window, 'resize', resize);
resize();
placeVehicle(1, true);

function frame(time) {
  if (disposed) return;
  const delta = Math.min(0.1, Math.max(0, (time - lastTime) / 1000));
  lastTime = time;
  if (!paused) {
    accumulator += delta;
    let steps = 0;
    while (accumulator >= STEP && steps++ < 6) {
      simulateStep();
      accumulator -= STEP;
    }
    if (steps >= 6) accumulator = 0;
    wheelAngle = (wheelAngle + signedSpeed(current) * delta / 0.42) % (Math.PI * 2);
  }
  placeVehicle(paused ? 1 : Math.max(0, accumulator / STEP));
  vehicleDeformer.update(paused ? 0 : delta);
  renderer.render(scene, camera);
  const speedKmh = Math.abs(signedSpeed(current) * 3.6);
  $('speed').textContent = speedKmh.toFixed(0);
  $('phase').textContent = paused ? 'PAUSE' : phase;
  const roadName = surface.road.tags?.name || surface.road.class || 'Freifläche';
  $('status').textContent = `${roadName} · ${current.contacts.filter(Boolean).length}/4 Radkontakte · Kreuzung ${anchorDistance('intersection-test').toFixed(0)} m`;
  $('sound-status').textContent = soundFacts.tireSqueal
    ? 'Klangfakt: Reifenquietschen'
    : soundFacts.airborne ? 'Klangfakt: in der Luft' : `Klangfakt: ${soundFacts.roadSurface}`;
  if ($('facts-panel').open) $('facts').textContent = JSON.stringify(snapshot(), null, 2);
  frameId = requestAnimationFrame(frame);
}

const ignoreKey = event => event.target instanceof Element && Boolean(event.target.closest('input,select,textarea,button,a,summary'));
on(window, 'keydown', event => {
  if (ignoreKey(event)) return;
  if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.code)) event.preventDefault();
  if (event.repeat) return;
  if (event.code === 'KeyR') { reset(); return; }
  if (event.code === 'Escape') { setPause(!paused); return; }
  if (!paused) keys.add(event.code);
});
on(window, 'keyup', event => keys.delete(event.code));
on(window, 'blur', () => setPause(true));
on(document, 'visibilitychange', () => { if (document.hidden) setPause(true); });
for (const button of document.querySelectorAll('[data-key]')) {
  on(button, 'pointerdown', event => {
    event.preventDefault();
    if (paused) return;
    button.setPointerCapture(event.pointerId);
    keys.add(button.dataset.key);
    button.dataset.on = 'true';
  });
  for (const event of ['pointerup', 'pointercancel', 'lostpointercapture']) {
    on(button, event, () => {
      keys.delete(button.dataset.key);
      button.dataset.on = 'false';
    });
  }
}
$('pause').onclick = () => { setPause(!paused); $('view').focus(); };
$('reset').onclick = () => { reset(); $('view').focus(); };
$('camera').onclick = () => {
  orbitOn = !orbitOn;
  orbit.enabled = orbitOn;
  $('camera').textContent = orbitOn ? 'Folgekamera' : 'Freie Kamera';
  $('view').focus();
};
function changePresentation() {
  const next = new URL(location.href);
  next.searchParams.set('city', $('city-select').value);
  next.searchParams.set('look', $('look-select').value);
  location.assign(next);
}
$('city-select').onchange = changePresentation;
$('look-select').onchange = changePresentation;
$('start').onclick = () => {
  $('gate').hidden = true;
  setPause(false);
  $('view').focus();
};

function dispose() {
  if (disposed) return;
  disposed = true;
  cancelAnimationFrame(frameId);
  clearInput();
  removers.forEach(remove => remove());
  orbit.dispose();
  vehicleDeformer.dispose();
  physics.dispose();
  const geometries = new Set();
  const materials = new Set();
  const textures = new Set();
  scene.traverse(node => {
    if (node.geometry) geometries.add(node.geometry);
    for (const material of [].concat(node.material || [])) {
      materials.add(material);
      Object.values(material).filter(value => value?.isTexture).forEach(texture => textures.add(texture));
    }
  });
  geometries.forEach(geometry => geometry.dispose());
  materials.forEach(material => material.dispose());
  textures.forEach(texture => texture.dispose());
  renderer.dispose();
}
on(window, 'pagehide', dispose);

window.__OSM_CITY_DRIVE__ = { snapshot, dispose };
setLoading(`${cityLabel}: ${roadData.stats.sourceRoads} Straßen und ${buildingData.stats.sourceBuildings} Gebäude sind bereit.`);
$('start').disabled = false;
window.__OSM_CITY_DRIVE_READY__ = true;
frameId = requestAnimationFrame(frame);
