import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { instance, loadClips, PIN } from '/tools/resident_atlas_s6/lib/atlas.js';
import { RESIDENTS } from '/tools/resident_atlas_s6/data/cast.js';
import { EncounterBeatBus, createEncounterHost } from '/tools/resident_atlas/life/encounter-bus.js';
import { createMotionBeatAdapter, createChatterBeatAdapter, createResidentOfferProvider } from '/tools/resident_atlas/life/npc-life-01.adapters.js';

const $ = (q) => document.querySelector(q);
const canvas = $('#scene');
const status = $('#status');
const beatEl = $('#beat');
const sourceEl = $('#source-status');
const chatterEl = $('#chatter-line');
const offerEl = $('#offer-status');
const motionEl = $('#motion-status');
const logEl = $('#event-log');
const acceptBtn = $('#accept');
const declineBtn = $('#decline');

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x181b22);
scene.fog = new THREE.Fog(0x181b22, 14, 28);
const camera = new THREE.PerspectiveCamera(35, 1, 0.05, 100);
camera.position.set(0, 3.5, 10.5);
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.outputColorSpace = THREE.SRGBColorSpace;
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 1.5, 0);
controls.enableDamping = true;
controls.minDistance = 5;
controls.maxDistance = 18;

scene.add(new THREE.HemisphereLight(0xcfe6ff, 0x342d2a, 2.1));
const key = new THREE.DirectionalLight(0xffffff, 2.8);
key.position.set(5, 8, 6); key.castShadow = true; scene.add(key);
const floor = new THREE.Mesh(new THREE.CircleGeometry(7.2, 64), new THREE.MeshStandardMaterial({ color: 0x4b5560, roughness: 0.94, metalness: 0 }));
floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);

const residents = new Map();
const recipeById = new Map(RESIDENTS.map(r => [r.residentId, r]));
const clipEntries = await loadClips('Rig_Medium', ['General', 'MovementBasic']);
const clipByName = new Map(clipEntries.map(x => [x.name, x.clip]));
const clipNames = [...clipByName.keys()];

function addLog(text, cls='') {
  const row = document.createElement('div');
  row.className = cls;
  row.textContent = text;
  logEl.prepend(row);
  while (logEl.children.length > 14) logEl.lastChild.remove();
}

async function loadResident(residentId) {
  const recipe = recipeById.get(residentId);
  if (!recipe) throw new Error(`Resident recipe missing: ${residentId}`);
  const root = await instance(recipe.actor.a, recipe.actor.commit || PIN.assets);
  root.name = `npc-life-source:${residentId}`;
  root.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  scene.add(root);
  const box = new THREE.Box3().setFromObject(root, true);
  root.position.y -= box.min.y;
  const mixer = new THREE.AnimationMixer(root);
  residents.set(residentId, { id: residentId, recipe, root, mixer, action: null, startX: 0, encounterX: 0 });
  return residents.get(residentId);
}

const goth = await loadResident('goth-girl');
const soldier = await loadResident('toy-soldier');

const offerProvider = createResidentOfferProvider({ residentRecipes: RESIDENTS });
const toyOffer = offerProvider({ actorId: 'toy-soldier' });
let offerObject = null;
if (toyOffer?.assetPath) {
  offerObject = await instance(toyOffer.assetPath, PIN.assets);
  offerObject.name = 'npc-life-offer:toy-soldier-present';
  offerObject.scale.setScalar(0.42);
  offerObject.visible = false;
  scene.add(offerObject);
  const b = new THREE.Box3().setFromObject(offerObject, true);
  offerObject.position.y -= b.min.y;
}

sourceEl.textContent = `Resident source: ${PIN.assets.slice(0,8)} · Motion source: ${PIN.anims.slice(0,8)} · ${clipNames.length} General+MovementBasic clips`;

try {
  const r = await fetch('/kfb-hub/stage/toolbox/kaykit-motion-lab-v1/MEASURED_ACTOR_PROFILES.json', {cache:'no-store'});
  if (r.ok) {
    const profile = await r.json();
    const gg = profile?.actors?.gothgirl;
    if (gg) sourceEl.textContent += ` · MotionProfile GothGirl ${gg.availableCount}/${gg.availableCount}`;
  }
} catch {}

function playMotion({ actorId, clip, beat }) {
  const actor = residents.get(actorId);
  if (!actor) return;
  const sourceClip = clipByName.get(clip);
  if (!sourceClip) return;
  const action = actor.mixer.clipAction(sourceClip);
  if (actor.action && actor.action !== action) actor.action.fadeOut(0.12);
  action.reset().fadeIn(0.12).play();
  actor.action = action;
  motionEl.textContent = `${actor.recipe.name}: ${clip} ← ${beat}`;
  addLog(`motion · ${actor.recipe.name} · ${beat} → ${clip}`,'motion');
}

const motionAdapter = createMotionBeatAdapter({ availableFor: (id) => residents.has(id) ? clipNames : [], play: playMotion });
const chatterAdapter = createChatterBeatAdapter({
  phrases: window.OW_PHRASES,
  profileFor: () => 'townsfolk',
  rng: () => 0.17,
  showLine({speakerId,line,field,beat}) {
    const name = residents.get(speakerId)?.recipe?.name || speakerId;
    chatterEl.textContent = `${name}: “${line}”`;
    addLog(`text · ${name} · ${beat}/${field} → ${line}`,'text');
  }
});

const bus = new EncounterBeatBus();
let scenario = 'residents';
let host = null;

function configurePositions(mode) {
  goth.root.visible = mode !== 'soldier-source' && mode !== 'player';
  soldier.root.visible = mode !== 'goth-source';
  if (mode === 'goth-source') {
    goth.root.position.x = 0; goth.root.rotation.y = 0;
  } else if (mode === 'soldier-source') {
    soldier.root.position.x = 0; soldier.root.rotation.y = 0;
  } else if (mode === 'player') {
    soldier.startX = -3.8; soldier.encounterX = -0.75;
    soldier.root.position.x = soldier.startX; soldier.root.rotation.y = Math.PI/2;
  } else {
    soldier.startX = -4.0; soldier.encounterX = -1.45;
    goth.root.position.x = 1.45; goth.root.rotation.y = -Math.PI/2;
    soldier.root.position.x = soldier.startX; soldier.root.rotation.y = Math.PI/2;
  }
  if (offerObject) offerObject.visible = false;
}

function movementDriver({beat, progress}) {
  if (!host?.isActive) return;
  if (beat === 'approach') soldier.root.position.x = THREE.MathUtils.lerp(soldier.startX, soldier.encounterX, progress);
  if (beat === 'leave') soldier.root.position.x = THREE.MathUtils.lerp(soldier.encounterX, soldier.startX, progress);
  if (offerObject?.visible) {
    const targetX = scenario === 'residents' ? goth.root.position.x : 0.6;
    offerObject.position.x = (soldier.root.position.x + targetX) * 0.5;
    offerObject.position.z = 0.35;
  }
}

function buildHost() {
  return createEncounterHost({
    bus,
    offerProvider,
    movement: movementDriver,
    durations: { approach: 1.5, greet: 1.0, offer: 1.2, react: 1.3, accept: 0.8, decline: 0.8, leave: 1.5 }
  });
}

bus.subscribe((event) => {
  beatEl.textContent = event.beat;
  addLog(`beat · ${event.encounterId} · ${event.beat}`,'beat');
  motionAdapter(event);
  chatterAdapter(event);
  if (event.beat === 'offer') {
    if (event.offer?.assetPath && offerObject) {
      offerObject.visible = true;
      offerEl.textContent = `offer ref · ${event.offer.sourceResidentId}/${event.offer.sourcePropId} · gift/reward owner`;
      addLog(`offer · ${event.offer.sourcePropId} · source-backed, no inventory mutation`,'offer');
    } else offerEl.textContent = 'offer ref · none';
  }
  if (event.beat === 'react') {
    acceptBtn.disabled = false; declineBtn.disabled = false;
  }
  if (event.beat === 'accept') {
    offerEl.textContent = 'decision · accept event emitted · inventory untouched by encounter host';
    if (offerObject) offerObject.position.x += scenario === 'residents' ? 0.8 : 1.0;
  }
  if (event.beat === 'decline') offerEl.textContent = 'decision · decline event emitted · offer stays reward-owned';
  if (event.beat === 'leave') {
    acceptBtn.disabled = true; declineBtn.disabled = true;
    setTimeout(() => { if (offerObject) offerObject.visible = false; }, 700);
  }
});

function showSource(mode) {
  if (host?.isActive) return;
  chatterEl.textContent = 'Source isolate · exact Resident Atlas actor; no encounter running.';
  offerEl.textContent = 'offer · inactive'; motionEl.textContent = 'motion · source pose only'; beatEl.textContent = 'source';
  configurePositions(mode);
  addLog(`source isolate · ${mode === 'goth-source' ? 'Goth Girl' : 'Toy Soldier'}`,'source');
}

function startEncounter(kind) {
  if (host?.isActive) return;
  scenario = kind;
  configurePositions(kind === 'player' ? 'player' : 'residents');
  chatterEl.textContent = 'ChatterBox donor waiting for speaking beat.';
  offerEl.textContent = 'offer ref · chosen independently at offer beat';
  motionEl.textContent = 'motion · chosen independently per compatible clip';
  logEl.innerHTML = '';
  host = buildHost();
  const result = host.start({
    actorId:'toy-soldier',
    targetId: kind === 'player' ? 'player' : 'goth-girl',
    targetKind: kind === 'player' ? 'player' : 'resident',
    relationship:'neutral',
    context:{ location:'npc-life-01-review', combatLocked:false }
  });
  status.textContent = result.ok ? `${kind === 'player' ? 'Resident → Player' : 'Resident ↔ Resident'} · ${result.encounterId}` : `Blocked · ${result.reason}`;
}

$('#source-goth').addEventListener('click', () => showSource('goth-source'));
$('#source-soldier').addEventListener('click', () => showSource('soldier-source'));
$('#residents').addEventListener('click', () => startEncounter('residents'));
$('#player').addEventListener('click', () => startEncounter('player'));
acceptBtn.addEventListener('click', () => { if (host?.choose('accept')) { acceptBtn.disabled=true; declineBtn.disabled=true; addLog('input · accept selected (host emits at decision beat)','input'); } });
declineBtn.addEventListener('click', () => { if (host?.choose('decline')) { acceptBtn.disabled=true; declineBtn.disabled=true; addLog('input · decline selected (host emits at decision beat)','input'); } });

function resize() {
  const w=canvas.clientWidth, h=canvas.clientHeight;
  if (canvas.width !== Math.floor(w*renderer.getPixelRatio()) || canvas.height !== Math.floor(h*renderer.getPixelRatio())) {
    renderer.setSize(w,h,false); camera.aspect=w/h; camera.updateProjectionMatrix();
  }
}

const clock = new THREE.Clock();
function frame() {
  requestAnimationFrame(frame);
  resize();
  const dt=Math.min(0.05,clock.getDelta());
  for (const r of residents.values()) r.mixer.update(dt);
  host?.update(dt);
  controls.update();
  renderer.render(scene,camera);
}

const urlMode = new URLSearchParams(location.search).get('mode');
if (urlMode === 'goth-source') showSource('goth-source');
else if (urlMode === 'soldier-source') showSource('soldier-source');
else if (urlMode === 'player') startEncounter('player');
else {
  showSource('goth-source');
  status.textContent = 'Source isolate first · then run an encounter';
}

window.__NPC_LIFE_01__ = {
  slice:'NPC-LIFE-01', build:'v1',
  pins:{assets:PIN.assets,anims:PIN.anims},
  get activeBeat(){return host?.current?.beat || null;},
  get loadedResidents(){return [...residents.keys()];},
  clipCount:clipNames.length
};
frame();
