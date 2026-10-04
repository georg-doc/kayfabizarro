import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const RAW_ROOT = 'https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/';
const ASSETS = Object.freeze({
  player: 'media/3D_Assets/KayKit_Mystery_Series6/11 - May 2025 - Hiker/characters/Hiker.glb',
  caveman: 'media/3D_Assets/KayKit_Mystery_Series6/8 - February 2025 - Caveman/characters/Caveman.glb',
  king: 'media/3D_Assets/KayKit_Mystery_Series6/10 - April 2024 - Paladin/characters/gltf/Paladin.glb',
  walk: 'media/3D_Assets/KayKit_Character_Animations_1.1/Animations/gltf/Rig_Medium/Rig_Medium_MovementBasic.glb',
  general: 'media/3D_Assets/KayKit_Character_Animations_1.1/Animations/gltf/Rig_Medium/Rig_Medium_General.glb',
  castle: 'media/3D_Assets/KayKit_Medieval_Hexagon_Pack_1.0_FREE/Assets/gltf/buildings/blue/building_castle_blue.gltf',
  mine: 'media/3D_Assets/KayKit_Medieval_Hexagon_Pack_1.0_FREE/Assets/gltf/buildings/green/building_mine_green.gltf',
  pathStone: 'media/3D_Assets/KayKit_Medieval_Hexagon_Pack_1.0_FREE/Assets/gltf/decoration/props/resource_stone.gltf',
  rockA: 'media/3D_Assets/KayKit_Forest_Nature_Pack_1.0_FREE/Assets/gltf/Rock_2_G_Color1.gltf',
  rockB: 'media/3D_Assets/KayKit_Forest_Nature_Pack_1.0_FREE/Assets/gltf/Rock_1_P_Color1.gltf',
  campfireBase: 'media/3D_Assets/KayKit_Mystery_Series6/8 - February 2025 - Caveman/assets/gltf/Campfire_Base.gltf',
  campfireLogs: 'media/3D_Assets/KayKit_Mystery_Series6/8 - February 2025 - Caveman/assets/gltf/Campfire_Logs.gltf',
});

const GROUND_MODE = Object.freeze({
  hoverHeight: 0.004,
  boostHeight: 0.004,
  minSpeed: 0,
  maxSpeed: 0.16,
  absMaxSpeed: 0.22,
  accel: 0.42,
  brakeDecel: 1.3,
  coastDecel: 0.72,
  maxBank: 0.035,
  driftMinSpeed: 99,
  cliffMax: 0,
  altRiseLerp: 12,
  altFallLerp: 12,
});

const INTERACT_RADIUS = 0.28;
const PLAYER_HEIGHT = 0.17;
const NPC_HEIGHT = 0.17;

function raw(path) {
  return RAW_ROOT + path.split('/').map((part) => encodeURIComponent(part)).join('/');
}

function waitForGlobe(timeoutMs = 15000) {
  return new Promise((resolve, reject) => {
    const started = performance.now();
    const tick = () => {
      if (window.__globe && window.__globe.scene && window.__globe.carpet) return resolve(window.__globe);
      if (performance.now() - started > timeoutMs) return reject(new Error('Travel runtime did not expose window.__globe'));
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
    <div class="town-mode">KFB TOWN · FOUNDING SLICE</div>
    <div class="town-status">Loading Caveman Mine ↔ King Castle…</div>
    <div class="town-bubble" hidden></div>
    <div class="town-prompt" hidden><kbd>I</kbd><span></span></div>`;
  const style = document.createElement('style');
  style.textContent = `
    #kfb-town-hud{position:absolute;inset:0;z-index:90;pointer-events:none;font-family:"Baloo 2",system-ui,sans-serif;color:#efe6d0}
    #kfb-town-hud .town-mode{position:absolute;left:14px;top:14px;padding:5px 9px;border:1px solid rgba(239,230,208,.35);background:rgba(10,16,32,.68);font:700 10px/1.3 "Special Elite",monospace;letter-spacing:.12em}
    #kfb-town-hud .town-status{position:absolute;left:14px;top:48px;max-width:min(520px,72vw);padding:5px 9px;background:rgba(10,16,32,.58);font-size:11px;opacity:.9}
    #kfb-town-hud .town-prompt{position:absolute;left:50%;bottom:24px;transform:translateX(-50%);display:flex;gap:9px;align-items:center;padding:9px 13px;border-radius:6px;background:rgba(18,18,16,.84);box-shadow:0 6px 24px rgba(0,0,0,.28);font-size:16px;font-weight:800}
    #kfb-town-hud .town-prompt[hidden],#kfb-town-hud .town-bubble[hidden]{display:none}
    #kfb-town-hud kbd{display:inline-grid;place-items:center;min-width:29px;height:29px;padding:0 7px;border:1px solid #efe6d0;border-bottom-width:3px;border-radius:5px;background:#efe6d0;color:#1f1a14;font:800 16px/1 "Baloo 2",sans-serif}
    #kfb-town-hud .town-bubble{position:absolute;left:50%;bottom:78px;transform:translateX(-50%);max-width:min(520px,82vw);padding:10px 14px;border-radius:8px;background:#efe6d0;color:#1f1a14;box-shadow:0 7px 28px rgba(0,0,0,.25);font-size:15px;font-weight:700;text-align:center}
    @media(max-width:700px){#kfb-town-hud .town-status{display:none}#kfb-town-hud .town-prompt{bottom:13px;font-size:14px}}
  `;
  document.head.appendChild(style);
  host.appendChild(root);
  return {
    root,
    status: root.querySelector('.town-status'),
    prompt: root.querySelector('.town-prompt'),
    promptText: root.querySelector('.town-prompt span'),
    bubble: root.querySelector('.town-bubble'),
  };
}

function basisAt(THREE, n) {
  const up = n.clone().normalize();
  const worldUp = new THREE.Vector3(0, 1, 0);
  const east = new THREE.Vector3().crossVectors(worldUp, up);
  if (east.lengthSq() < 1e-7) east.crossVectors(new THREE.Vector3(1, 0, 0), up);
  east.normalize();
  const north = new THREE.Vector3().crossVectors(up, east).normalize();
  return { up, east, north };
}

function offsetDirection(THREE, base, eastAmount = 0, northAmount = 0) {
  const b = basisAt(THREE, base);
  return base.clone().addScaledVector(b.east, eastAmount).addScaledVector(b.north, northAmount).normalize();
}

function fitHeight(THREE, object, targetHeight) {
  object.updateMatrixWorld(true);
  let box = new THREE.Box3().setFromObject(object);
  const size = box.getSize(new THREE.Vector3());
  if (size.y > 1e-6) object.scale.multiplyScalar(targetHeight / size.y);
  object.updateMatrixWorld(true);
  box = new THREE.Box3().setFromObject(object);
  object.position.y -= box.min.y;
  object.updateMatrixWorld(true);
  return object;
}

async function main() {
  const g = await waitForGlobe();
  const { THREE, scene, carpet, globe, lighting } = g;
  const loader = new GLTFLoader();
  const hud = createTownHud();
  const ray = new THREE.Raycaster();
  const radialY = new THREE.Vector3(0, 1, 0);
  const unitScale = new THREE.Vector3();
  const playerFrame = new THREE.Matrix4();
  const playerPos = new THREE.Vector3();
  const playerQuat = new THREE.Quaternion();

  const spawnQ = carpet.state.qPosition.clone();
  const spawnDir = carpet.worldPos().clone().normalize();

  const mineDir = offsetDirection(THREE, spawnDir, -0.15, 0.025);
  const cavemanDir = offsetDirection(THREE, spawnDir, -0.115, 0.005);
  const castleDir = offsetDirection(THREE, spawnDir, 0.15, 0.035);
  const kingDir = offsetDirection(THREE, spawnDir, 0.115, 0.005);

  function groundHit(direction) {
    const n = direction.clone().normalize();
    ray.set(n.clone().multiplyScalar(8.5), n.clone().negate());
    const hits = ray.intersectObject(globe.mesh, true);
    if (hits.length) return hits[0].point.clone();
    return n.multiplyScalar(carpet.worldPos().length());
  }

  function makeAnchor(direction, name, lift = 0.002) {
    const n = direction.clone().normalize();
    const a = new THREE.Group();
    a.name = name;
    a.position.copy(groundHit(n)).addScaledVector(n, lift);
    a.quaternion.setFromUnitVectors(radialY, n);
    scene.add(a);
    return a;
  }

  async function loadAsset(path, direction, targetHeight, opts = {}) {
    const gltf = await loader.loadAsync(raw(path));
    const model = gltf.scene;
    model.name = opts.name || model.name || path.split('/').pop();
    fitHeight(THREE, model, targetHeight);
    model.rotation.y = opts.yaw || 0;
    model.traverse((o) => {
      if (!o.isMesh) return;
      o.castShadow = opts.castShadow !== false;
      o.receiveShadow = opts.receiveShadow !== false;
    });
    const anchor = makeAnchor(direction, (opts.name || 'town-asset') + '-anchor', opts.lift ?? 0.002);
    anchor.add(model);
    if (lighting && lighting.register) lighting.register(anchor);
    return { anchor, model, gltf };
  }

  try { if (g.tuerme && g.tuerme.setEnabled) g.tuerme.setEnabled(false); } catch (_) {}
  try { if (g.marken && g.marken.setEnabled) g.marken.setEnabled(false); } catch (_) {}
  try { if (g.dice && g.dice.setVisible) g.dice.setVisible(false); } catch (_) {}
  try {
    if (g.teppiche && g.teppiche.params) {
      g.teppiche.params.on = false;
      if (g.teppiche.neubau) g.teppiche.neubau();
    }
  } catch (_) {}
  try { if (g.sky && g.sky.group) g.sky.group.visible = false; } catch (_) {}
  try { if (g.trail && g.trail.group) g.trail.group.visible = false; } catch (_) {}

  const savedMotion = {};
  for (const key of Object.keys(GROUND_MODE)) savedMotion[key] = carpet.params[key];
  Object.assign(carpet.params, GROUND_MODE);
  carpet.setSpeedFloor(0);

  try { if (g.intro && g.intro.active) g.intro.skip(); } catch (_) {}
  setTimeout(() => { try { if (g.intro && g.intro.active) g.intro.skip(); } catch (_) {} }, 80);

  const startGround = groundHit(spawnDir);
  const globeRadius = 5;
  const startAltitude = Math.max(0, startGround.length() - globeRadius) + GROUND_MODE.hoverHeight;
  let groundHandoffUntil = 0;
  const enterGroundMode = () => {
    groundHandoffUntil = performance.now() + 3000;
    carpet.setSpeedFloor(0);
    carpet.setSpeed(0);
    carpet.teleportTo(spawnQ, Math.PI / 2, startAltitude, 0);
    if (g.controls) g.controls.enabled = true;
    if (g.avatar) g.avatar.visible = false;
  };
  const waitIntro = () => {
    if (!g.intro || !g.intro.active) return enterGroundMode();
    setTimeout(waitIntro, 50);
  };
  waitIntro();

  hud.status.textContent = 'Loading real KayKit Mine, Castle and residents…';

  const [mine, castle, caveman, king, player] = await Promise.all([
    loadAsset(ASSETS.mine, mineDir, 0.30, { name: 'Caveman Mine', yaw: Math.PI * 0.50 }),
    loadAsset(ASSETS.castle, castleDir, 0.62, { name: 'King Castle', yaw: -Math.PI * 0.50 }),
    loadAsset(ASSETS.caveman, cavemanDir, NPC_HEIGHT, { name: 'Caveman', yaw: Math.PI * 0.50 }),
    loadAsset(ASSETS.king, kingDir, NPC_HEIGHT, { name: 'King Kayfabian · Paladin body', yaw: -Math.PI * 0.50 }),
    loadAsset(ASSETS.player, spawnDir, PLAYER_HEIGHT, { name: 'Player · Hiker', yaw: Math.PI }),
  ]);

  const playerAnchor = player.anchor;
  const playerVisual = player.model;
  playerAnchor.position.set(0, 0, 0);
  playerAnchor.quaternion.identity();

  const habitatJobs = [
    loadAsset(ASSETS.rockA, offsetDirection(THREE, mineDir, -0.020, -0.012), 0.22, { name: 'Mine rock left', yaw: 0.3 }),
    loadAsset(ASSETS.rockB, offsetDirection(THREE, mineDir, 0.018, -0.018), 0.20, { name: 'Mine rock back', yaw: -0.25 }),
    loadAsset(ASSETS.campfireBase, offsetDirection(THREE, cavemanDir, -0.012, 0.020), 0.030, { name: 'Campfire base', yaw: 0.2 }),
    loadAsset(ASSETS.campfireLogs, offsetDirection(THREE, cavemanDir, -0.012, 0.020), 0.026, { name: 'Campfire logs', yaw: 0.2, lift: 0.006 }),
  ];

  for (let i = -4; i <= 4; i++) {
    const t = i / 5;
    const d = offsetDirection(THREE, spawnDir, t * 0.105, -0.010 + Math.sin(i * 1.7) * 0.006);
    habitatJobs.push(loadAsset(ASSETS.pathStone, d, 0.018, { name: 'Path stone ' + (i + 5), yaw: i * 0.33, lift: 0.001 }));
  }
  Promise.allSettled(habitatJobs).then(() => {
    hud.status.textContent = 'Founding Slice · Hiker player · Caveman Mine · King Castle · [I] interact';
  });

  let mixer = null, idleAction = null, walkAction = null, moving = false;
  try {
    const [basic, general] = await Promise.all([loader.loadAsync(raw(ASSETS.walk)), loader.loadAsync(raw(ASSETS.general))]);
    const walkClip = basic.animations.find((c) => c.name === 'Walking_A');
    const idleClip = general.animations.find((c) => c.name === 'Idle_A');
    if (walkClip && idleClip) {
      mixer = new THREE.AnimationMixer(playerVisual);
      idleAction = mixer.clipAction(idleClip); walkAction = mixer.clipAction(walkClip);
      idleAction.play(); walkAction.play(); walkAction.enabled = true; walkAction.setEffectiveWeight(0);
    }
  } catch (e) {
    console.warn('[town] player animation pack unavailable; locomotion remains functional', e);
  }

  const npcs = [
    { id: 'caveman', name: 'Caveman', position: caveman.anchor.position, line: "Mine's open. Castle's uphill." },
    { id: 'king-kayfabian', name: 'King Kayfabian', position: king.anchor.position, line: 'Welcome. The road is yours.' },
  ];
  let nearest = null;
  let bubbleTimer = 0;

  function updateNearest() {
    const p = carpet.worldPos();
    let best = null, bestD = Infinity;
    for (const npc of npcs) {
      const d = p.distanceTo(npc.position);
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
      detail: { npcId: nearest.id, npcName: nearest.name, source, slice: 'founding-caveman-king-v1' },
    }));
    return true;
  }

  addEventListener('keydown', (e) => {
    if (e.repeat) return;
    if (e.code === 'KeyI') interact('I');
    if (e.code === 'KeyF') interact('F');
  });

  const clock = new THREE.Clock();
  function presentationFrame() {
    requestAnimationFrame(presentationFrame);
    const dt = Math.min(0.05, clock.getDelta());

    if (performance.now() < groundHandoffUntil) {
      carpet.setSpeedFloor(0);
      carpet.setSpeed(0);
    }

    playerFrame.copy(carpet.matrix());
    playerFrame.decompose(playerPos, playerQuat, unitScale);
    playerAnchor.position.copy(playerPos);
    playerAnchor.quaternion.copy(playerQuat);
    playerVisual.rotation.y = Math.PI;

    const nowMoving = carpet.state.speed > 0.018;
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
      if (moving) walkAction.timeScale = Math.max(0.65, Math.min(1.7, carpet.state.speed / 0.10));
      mixer.update(dt);
    }

    updateNearest();
    if (bubbleTimer > 0) {
      bubbleTimer -= dt;
      if (bubbleTimer <= 0) hud.bubble.hidden = true;
    }
  }
  presentationFrame();

  window.__town = {
    schema: 'kfb.town.founding.v1',
    status: 'IMPLEMENTATION_UNTESTED_BROWSER',
    assets: ASSETS,
    player: { id: 'hiker', anchor: playerAnchor, model: playerVisual },
    residents: npcs,
    places: { mine: mine.anchor, castle: castle.anchor },
    interact,
    groundMode: GROUND_MODE,
    restoreTravelMotion() {
      Object.assign(carpet.params, savedMotion);
      carpet.setSpeedFloor(carpet.params.minSpeed);
    },
  };

  hud.status.textContent = 'Founding Slice ready · W/A/S/D walk · [I] interact · F compatibility';
  console.info('[town] Founding Slice mounted on Travel runtime', window.__town);
}

main().catch((error) => {
  console.error('[town] Founding Slice failed', error);
  const hud = createTownHud();
  hud.status.textContent = 'Town start failed · ' + (error && error.message ? error.message : String(error));
});
