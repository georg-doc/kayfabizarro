import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { createBodenLesung } from '../globe-v13/boden-lesung.js';

// Town v2 fixes only the two broken foundations from v1: movement handoff and scale.
// Travel remains renderer / terrain / camera / movement owner. Town only changes the existing
// carpet parameters, reads its pose and presents grounded actors/assets on the baked mesh.

const ASSET_PIN = 'f2875849e7111dcd5963b2ec4dc3279b3090065f';
const RAW_ROOT = `https://raw.githubusercontent.com/georg-doc/kayfabizarro/${ASSET_PIN}/`;
const ASSETS = Object.freeze({
  player: 'media/3D_Assets/KayKit_Mystery_Series6/11 - May 2025 - Hiker/characters/Hiker.glb',
  caveman: 'media/3D_Assets/KayKit_Mystery_Series6/8 - February 2025 - Caveman/characters/Caveman.glb',
  king: 'media/3D_Assets/KayKit_Mystery_Series6/10 - April 2024 - Paladin/characters/gltf/Paladin.glb',
  walk: 'media/3D_Assets/KayKit_Character_Animations_1.1/Animations/gltf/Rig_Medium/Rig_Medium_MovementBasic.glb',
  general: 'media/3D_Assets/KayKit_Character_Animations_1.1/Animations/gltf/Rig_Medium/Rig_Medium_General.glb',
  castle: 'media/3D_Assets/KayKit_Medieval_Hexagon_Pack_1.0_FREE/Assets/gltf/buildings/blue/building_castle_blue.gltf',
  mine: 'media/3D_Assets/KayKit_Medieval_Hexagon_Pack_1.0_FREE/Assets/gltf/buildings/green/building_mine_green.gltf',
  rockA: 'media/3D_Assets/KayKit_Forest_Nature_Pack_1.0_FREE/Assets/gltf/Rock_2_G_Color1.gltf',
  rockB: 'media/3D_Assets/KayKit_Forest_Nature_Pack_1.0_FREE/Assets/gltf/Rock_1_P_Color1.gltf',
  campfireBase: 'media/3D_Assets/KayKit_Mystery_Series6/8 - February 2025 - Caveman/assets/gltf/Campfire_Base.gltf',
  campfireLogs: 'media/3D_Assets/KayKit_Mystery_Series6/8 - February 2025 - Caveman/assets/gltf/Campfire_Logs.gltf',
});

const GLOBE_RADIUS = 5;
const CHARACTER_HEIGHT = 0.15;
const MEDIEVAL_NATIVE_CASTLE_HEIGHT = 3.97920560836792;
const MEDIEVAL_FACTOR = (CHARACTER_HEIGHT * 4) / MEDIEVAL_NATIVE_CASTLE_HEIGHT;
const FOREST_TREE_MEDIAN = 5.54;
const FOREST_FACTOR = (CHARACTER_HEIGHT * 2) / FOREST_TREE_MEDIAN;

const SCALE = Object.freeze({
  characterHeight: CHARACTER_HEIGHT,
  medievalFactor: MEDIEVAL_FACTOR,
  forestFactor: FOREST_FACTOR,
  campfireHeight: CHARACTER_HEIGHT * 0.22,
});

const GROUND_MODE = Object.freeze({
  hoverHeight: 0.002,
  boostHeight: 0.002,
  minSpeed: 0,
  maxSpeed: CHARACTER_HEIGHT * 0.95,
  absMaxSpeed: CHARACTER_HEIGHT * 1.05,
  accel: CHARACTER_HEIGHT * 4.0,
  brakeDecel: CHARACTER_HEIGHT * 8.0,
  coastDecel: CHARACTER_HEIGHT * 5.5,
  maxBank: 0,
  driftMinSpeed: 99,
  driftTurnThreshold: 99,
  cliffMax: 0,
  altRiseLerp: 12,
  altFallLerp: 12,
});

const INTERACT_RADIUS = CHARACTER_HEIGHT * 2.1;

function raw(path) {
  return RAW_ROOT + path.split('/').map((part) => encodeURIComponent(part)).join('/');
}

function waitForGlobe(timeoutMs = 15000) {
  return new Promise((resolve, reject) => {
    const started = performance.now();
    const tick = () => {
      if (window.__globe && window.__globe.scene && window.__globe.carpet && window.__globe.globe) {
        resolve(window.__globe); return;
      }
      if (performance.now() - started > timeoutMs) {
        reject(new Error('Travel runtime did not expose window.__globe'));
        return;
      }
      setTimeout(tick, 50);
    };
    tick();
  });
}

function createTownHud() {
  const host = document.getElementById('tv-hud') || document.getElementById('tv-stage') || document.body;
  const root = document.createElement('div');
  root.id = 'kfb-town-hud';
  root.innerHTML = `
    <div class="town-mode">KFB TOWN · MOVEMENT + SCALE FIX</div>
    <div class="town-status">Starting real Travel ground mode…</div>
    <div class="town-debug"></div>
    <div class="town-bubble" hidden></div>
    <div class="town-prompt" hidden><kbd>I</kbd><span></span></div>`;
  const style = document.createElement('style');
  style.textContent = `
    #kfb-town-hud{position:absolute;inset:0;z-index:90;pointer-events:none;font-family:"Baloo 2",system-ui,sans-serif;color:#efe6d0}
    #kfb-town-hud .town-mode{position:absolute;left:14px;top:14px;padding:5px 9px;border:1px solid rgba(239,230,208,.35);background:rgba(10,16,32,.72);font:700 10px/1.3 "Special Elite",monospace;letter-spacing:.12em}
    #kfb-town-hud .town-status{position:absolute;left:14px;top:48px;max-width:min(620px,76vw);padding:5px 9px;background:rgba(10,16,32,.62);font-size:11px}
    #kfb-town-hud .town-debug{position:absolute;left:14px;top:78px;padding:4px 8px;background:rgba(10,16,32,.50);font:10px/1.35 monospace;opacity:.86}
    #kfb-town-hud .town-prompt{position:absolute;left:50%;bottom:24px;transform:translateX(-50%);display:flex;gap:9px;align-items:center;padding:9px 13px;border-radius:6px;background:rgba(18,18,16,.86);box-shadow:0 6px 24px rgba(0,0,0,.28);font-size:16px;font-weight:800}
    #kfb-town-hud .town-prompt[hidden],#kfb-town-hud .town-bubble[hidden]{display:none}
    #kfb-town-hud kbd{display:inline-grid;place-items:center;min-width:29px;height:29px;padding:0 7px;border:1px solid #efe6d0;border-bottom-width:3px;border-radius:5px;background:#efe6d0;color:#1f1a14;font:800 16px/1 "Baloo 2",sans-serif}
    #kfb-town-hud .town-bubble{position:absolute;left:50%;bottom:78px;transform:translateX(-50%);max-width:min(520px,82vw);padding:10px 14px;border-radius:8px;background:#efe6d0;color:#1f1a14;box-shadow:0 7px 28px rgba(0,0,0,.25);font-size:15px;font-weight:700;text-align:center}
    @media(max-width:700px){#kfb-town-hud .town-status,#kfb-town-hud .town-debug{display:none}#kfb-town-hud .town-prompt{bottom:13px;font-size:14px}}
  `;
  document.head.appendChild(style);
  host.appendChild(root);
  return {
    root,
    status: root.querySelector('.town-status'),
    debug: root.querySelector('.town-debug'),
    prompt: root.querySelector('.town-prompt'),
    promptText: root.querySelector('.town-prompt span'),
    bubble: root.querySelector('.town-bubble'),
  };
}

function basisAt(THREE, n) {
  const up = n.clone().normalize();
  const east = new THREE.Vector3().crossVectors(new THREE.Vector3(0, 1, 0), up);
  if (east.lengthSq() < 1e-7) east.crossVectors(new THREE.Vector3(1, 0, 0), up);
  east.normalize();
  const north = new THREE.Vector3().crossVectors(up, east).normalize();
  return { up, east, north };
}

function offsetDirection(THREE, base, eastAmount = 0, northAmount = 0) {
  const b = basisAt(THREE, base);
  return base.clone().addScaledVector(b.east, eastAmount).addScaledVector(b.north, northAmount).normalize();
}

function nativeHeight(THREE, object) {
  object.updateMatrixWorld(true);
  return new THREE.Box3().setFromObject(object).getSize(new THREE.Vector3()).y;
}

function groundObject(THREE, object) {
  object.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(object);
  object.position.y -= box.min.y;
  object.updateMatrixWorld(true);
}

function normalizeCharacter(THREE, object) {
  const h = nativeHeight(THREE, object);
  if (h > 1e-6) object.scale.multiplyScalar(CHARACTER_HEIGHT / h);
  groundObject(THREE, object);
  return h;
}

function applyFamilyScale(THREE, object, factor) {
  const h = nativeHeight(THREE, object);
  object.scale.multiplyScalar(factor);
  groundObject(THREE, object);
  return h;
}

async function main() {
  const g = await waitForGlobe();
  const { THREE, scene, carpet, globe, lighting } = g;
  const loader = new GLTFLoader();
  const hud = createTownHud();
  const radialY = new THREE.Vector3(0, 1, 0);
  const unitScale = new THREE.Vector3();
  const playerFrame = new THREE.Matrix4();
  const playerPos = new THREE.Vector3();
  const playerQuat = new THREE.Quaternion();

  const bodenLeser = createBodenLesung({ THREE, mesh: globe.mesh, radius: GLOBE_RADIUS });
  const groundRadius = (n) => bodenLeser.radiusAt(n.clone().normalize()) || GLOBE_RADIUS;
  const groundPoint = (n, lift = 0) => n.clone().normalize().multiplyScalar(groundRadius(n) + lift);

  const spawnQ = carpet.state.qPosition.clone();
  const spawnDir = carpet.worldPos().clone().normalize();
  const mineDir = offsetDirection(THREE, spawnDir, -0.14, 0.020);
  const cavemanDir = offsetDirection(THREE, spawnDir, -0.105, 0.000);
  const castleDir = offsetDirection(THREE, spawnDir, 0.14, 0.025);
  const kingDir = offsetDirection(THREE, spawnDir, 0.105, 0.000);

  function makeAnchor(direction, name, lift = 0.001) {
    const n = direction.clone().normalize();
    const a = new THREE.Group();
    a.name = name;
    a.position.copy(groundPoint(n, lift));
    a.quaternion.setFromUnitVectors(radialY, n);
    scene.add(a);
    return a;
  }

  async function loadCharacter(path, direction, name, yaw = 0) {
    const gltf = await loader.loadAsync(raw(path));
    const model = gltf.scene;
    model.name = name;
    const native = normalizeCharacter(THREE, model);
    model.rotation.y = yaw;
    model.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
    const anchor = makeAnchor(direction, name + '-anchor');
    anchor.add(model);
    if (lighting && lighting.register) lighting.register(anchor);
    return { anchor, model, gltf, native, worldHeight: nativeHeight(THREE, model) };
  }

  async function loadFamilyAsset(path, direction, name, factor, yaw = 0, lift = 0.001) {
    const gltf = await loader.loadAsync(raw(path));
    const model = gltf.scene;
    model.name = name;
    const native = applyFamilyScale(THREE, model, factor);
    model.rotation.y = yaw;
    model.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
    const anchor = makeAnchor(direction, name + '-anchor', lift);
    anchor.add(model);
    if (lighting && lighting.register) lighting.register(anchor);
    return { anchor, model, gltf, native, worldHeight: nativeHeight(THREE, model) };
  }

  async function loadFitHeight(path, direction, name, targetHeight, yaw = 0, lift = 0.001) {
    const gltf = await loader.loadAsync(raw(path));
    const model = gltf.scene;
    model.name = name;
    const native = nativeHeight(THREE, model);
    if (native > 1e-6) model.scale.multiplyScalar(targetHeight / native);
    groundObject(THREE, model);
    model.rotation.y = yaw;
    model.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
    const anchor = makeAnchor(direction, name + '-anchor', lift);
    anchor.add(model);
    if (lighting && lighting.register) lighting.register(anchor);
    return { anchor, model, gltf, native, worldHeight: nativeHeight(THREE, model) };
  }

  try { if (g.tuerme && g.tuerme.setEnabled) g.tuerme.setEnabled(false); } catch (_) {}
  try { if (g.marken && g.marken.setEnabled) g.marken.setEnabled(false); } catch (_) {}
  try { if (g.dice && g.dice.setVisible) g.dice.setVisible(false); } catch (_) {}
  try { if (g.teppiche && g.teppiche.params) { g.teppiche.params.on = false; if (g.teppiche.neubau) g.teppiche.neubau(); } } catch (_) {}
  try { if (g.sky && g.sky.group) g.sky.group.visible = false; } catch (_) {}
  try { if (g.trail && g.trail.group) g.trail.group.visible = false; } catch (_) {}
  try { if (g.look) { g.look.setMode('look'); g.look.center(); } } catch (_) {}
  try { if (g.setCamDist) g.setCamDist(0.52); } catch (_) {}

  const savedMotion = {};
  for (const key of Object.keys(GROUND_MODE)) savedMotion[key] = carpet.params[key];
  Object.assign(carpet.params, GROUND_MODE);
  carpet.setSpeedFloor(0);

  try { if (g.intro && g.intro.active) g.intro.skip(); } catch (_) {}
  setTimeout(() => { try { if (g.intro && g.intro.active) g.intro.skip(); } catch (_) {} }, 80);

  let launchNeutralizeUntil = 0;
  let launchNeutralized = false;
  function enterGroundMode() {
    const surfaceR = groundRadius(spawnDir);
    const altitude = Math.max(0, surfaceR - GLOBE_RADIUS) + GROUND_MODE.hoverHeight;
    Object.assign(carpet.params, GROUND_MODE);
    carpet.setSpeedFloor(0);
    carpet.setSpeed(0);
    carpet.teleportTo(spawnQ, Math.PI / 2, altitude, 0);
    if (g.controls) g.controls.enabled = true;
    if (g.avatar) g.avatar.visible = false;
    launchNeutralizeUntil = performance.now() + 3200;
    launchNeutralized = false;
  }
  (function waitIntro() {
    if (!g.intro || !g.intro.active) { enterGroundMode(); return; }
    setTimeout(waitIntro, 50);
  })();

  hud.status.textContent = 'Loading scale-calibrated KayKit actors and habitats…';
  const [mine, castle, caveman, king, player] = await Promise.all([
    loadFamilyAsset(ASSETS.mine, mineDir, 'Caveman Mine', MEDIEVAL_FACTOR, Math.PI * 0.50),
    loadFamilyAsset(ASSETS.castle, castleDir, 'King Castle', MEDIEVAL_FACTOR, -Math.PI * 0.50),
    loadCharacter(ASSETS.caveman, cavemanDir, 'Caveman', Math.PI * 0.50),
    loadCharacter(ASSETS.king, kingDir, 'King Kayfabian · Paladin body', -Math.PI * 0.50),
    loadCharacter(ASSETS.player, spawnDir, 'Player · Hiker', Math.PI),
  ]);

  const playerAnchor = player.anchor;
  const playerVisual = player.model;
  playerAnchor.position.set(0, 0, 0);
  playerAnchor.quaternion.identity();

  const habitatJobs = [
    loadFamilyAsset(ASSETS.rockA, offsetDirection(THREE, mineDir, -0.022, -0.012), 'Mine rock left', FOREST_FACTOR, 0.3),
    loadFamilyAsset(ASSETS.rockB, offsetDirection(THREE, mineDir, 0.020, -0.018), 'Mine rock back', FOREST_FACTOR, -0.25),
    loadFitHeight(ASSETS.campfireBase, offsetDirection(THREE, cavemanDir, -0.014, 0.020), 'Campfire base', SCALE.campfireHeight, 0.2),
    loadFitHeight(ASSETS.campfireLogs, offsetDirection(THREE, cavemanDir, -0.014, 0.020), 'Campfire logs', SCALE.campfireHeight * 0.82, 0.2, 0.004),
  ];
  Promise.allSettled(habitatJobs);

  let mixer = null, idleAction = null, walkAction = null, moving = false;
  try {
    const [basic, general] = await Promise.all([loader.loadAsync(raw(ASSETS.walk)), loader.loadAsync(raw(ASSETS.general))]);
    const walkClip = basic.animations.find((c) => c.name === 'Walking_A');
    const idleClip = general.animations.find((c) => c.name === 'Idle_A');
    if (walkClip && idleClip) {
      mixer = new THREE.AnimationMixer(playerVisual);
      idleAction = mixer.clipAction(idleClip);
      walkAction = mixer.clipAction(walkClip);
      idleAction.play();
      walkAction.play();
      walkAction.enabled = true;
      walkAction.setEffectiveWeight(0);
    }
  } catch (e) {
    console.warn('[town] animation pack unavailable; movement itself remains independent', e);
  }

  const npcs = [
    { id: 'caveman', name: 'Caveman', anchor: caveman.anchor, line: "Mine's open. Castle's uphill." },
    { id: 'king-kayfabian', name: 'King Kayfabian', anchor: king.anchor, line: 'Welcome. The road is yours.' },
  ];
  let nearest = null;
  let bubbleTimer = 0;
  const keysSeen = new Set();

  function updateNearest() {
    const p = playerAnchor.position;
    let best = null, bestD = Infinity;
    for (const npc of npcs) {
      const d = p.distanceTo(npc.anchor.position);
      if (d < bestD) { bestD = d; best = npc; }
    }
    nearest = bestD <= INTERACT_RADIUS ? best : null;
    hud.prompt.hidden = !nearest;
    if (nearest) hud.promptText.textContent = 'Talk to ' + nearest.name;
  }

  function interact(source) {
    updateNearest();
    if (!nearest) return false;
    hud.bubble.textContent = nearest.name + ': “' + nearest.line + '”';
    hud.bubble.hidden = false;
    bubbleTimer = 4.0;
    window.dispatchEvent(new CustomEvent('kfb-town-interact', {
      detail: { npcId: nearest.id, npcName: nearest.name, source, slice: 'founding-movement-scale-v2' },
    }));
    return true;
  }

  addEventListener('keydown', (e) => {
    keysSeen.add(e.code);
    if (e.repeat) return;
    if (e.code === 'KeyI') interact('I');
    if (e.code === 'KeyF') interact('F');
  });
  addEventListener('keyup', (e) => keysSeen.delete(e.code));
  addEventListener('blur', () => keysSeen.clear());

  const clock = new THREE.Clock();
  function presentationFrame() {
    requestAnimationFrame(presentationFrame);
    const dt = Math.min(0.05, clock.getDelta());

    if (launchNeutralizeUntil) {
      carpet.setSpeedFloor(0);
      if (performance.now() >= launchNeutralizeUntil && !launchNeutralized) {
        carpet.setSpeedFloor(0);
        launchNeutralized = true;
        launchNeutralizeUntil = 0;
      }
    }

    playerFrame.copy(carpet.matrix());
    playerFrame.decompose(playerPos, playerQuat, unitScale);
    const n = carpet.worldPos().clone().normalize();
    playerAnchor.position.copy(groundPoint(n, 0.001));
    playerAnchor.quaternion.copy(playerQuat);
    playerVisual.rotation.y = Math.PI;

    const nowMoving = carpet.state.speed > CHARACTER_HEIGHT * 0.05;
    if (mixer && idleAction && walkAction) {
      if (nowMoving !== moving) {
        moving = nowMoving;
        if (moving) {
          walkAction.reset().play();
          walkAction.setEffectiveWeight(1);
          idleAction.crossFadeTo(walkAction, 0.16, false);
        } else {
          idleAction.reset().play();
          idleAction.setEffectiveWeight(1);
          walkAction.crossFadeTo(idleAction, 0.16, false);
        }
      }
      if (moving) walkAction.timeScale = Math.max(0.65, Math.min(1.55, carpet.state.speed / (CHARACTER_HEIGHT * 0.82)));
      mixer.update(dt);
    }

    updateNearest();
    if (bubbleTimer > 0) {
      bubbleTimer -= dt;
      if (bubbleTimer <= 0) hud.bubble.hidden = true;
    }

    const activeKeys = ['KeyW','KeyA','KeyS','KeyD'].filter((k) => keysSeen.has(k)).map((k) => k.slice(3)).join('') || '—';
    hud.debug.textContent = `keys ${activeKeys} · speed ${carpet.state.speed.toFixed(3)} · floor ${carpet.speedFloor.toFixed(3)} · figure ${CHARACTER_HEIGHT.toFixed(3)}u`;
  }
  presentationFrame();

  const scaleReport = {
    characterHeight: CHARACTER_HEIGHT,
    medievalFactor: +MEDIEVAL_FACTOR.toFixed(6),
    forestFactor: +FOREST_FACTOR.toFixed(6),
    hiker: +player.worldHeight.toFixed(4),
    caveman: +caveman.worldHeight.toFixed(4),
    king: +king.worldHeight.toFixed(4),
    mine: +mine.worldHeight.toFixed(4),
    castle: +castle.worldHeight.toFixed(4),
  };

  window.__town = {
    schema: 'kfb.town.founding.v2',
    status: 'IMPLEMENTATION_UNTESTED_BROWSER',
    assetPin: ASSET_PIN,
    assets: ASSETS,
    scale: SCALE,
    scaleReport,
    groundMode: GROUND_MODE,
    player: { id: 'hiker', anchor: playerAnchor, model: playerVisual },
    residents: npcs,
    places: { mine: mine.anchor, castle: castle.anchor },
    interact,
    restoreTravelMotion() {
      Object.assign(carpet.params, savedMotion);
      carpet.setSpeedFloor(carpet.params.minSpeed);
    },
  };

  hud.status.textContent = 'Fix v2 · click world · W forward · A/D turn · S brake · [I] interact';
  console.info('[town] movement/scale fix mounted', window.__town);
}

main().catch((error) => {
  console.error('[town] movement/scale fix failed', error);
  const hud = createTownHud();
  hud.status.textContent = 'Town start failed · ' + (error && error.message ? error.message : String(error));
});
