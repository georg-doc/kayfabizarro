import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { buildFrizzleBeeMovementDonor, F1_DONOR_REV } from './mech-bee-profile.js';

// Character/animation comparison lab for WB0 Ground.
// The Ground controller remains the sole movement writer; this module owns only the visible player
// body + AnimationMixer presentation. Root/Hips translation is measured for cadence and then stripped.
const CHARACTER_PIN = '10a7fdce6b3a1ae22504ade71b7dbec5f25e0ff0';
const RAW_ROOT = `https://raw.githubusercontent.com/georg-doc/kayfabizarro/${CHARACTER_PIN}/`;
const ROOT_MOTION_NODE = /^(root|hips)$/i;

const PROFILES = Object.freeze({
  actionFigure: {
    id: 'actionFigure',
    label: 'ActionFigure · Medium',
    rig: 'Rig_Medium',
    body: 'media/3D_Assets/KayKit_Mystery_Series6/6 - December 2023 - Action Figure/character/gltf/ActionFigure.glb',
    animationSets: ['General', 'MovementBasic', 'MovementAdvanced'],
  },
  monstrosity: {
    id: 'monstrosity',
    label: 'Monstrosity · Large',
    rig: 'Rig_Large',
    body: 'media/3D_Assets/KayKit_Mystery_Series6/4 - October 2025 - Monstrosity/Monstrosity.glb',
    animationSets: ['General', 'MovementBasic', 'MovementAdvanced'],
  },
  legacyWarband: {
    id: 'legacyWarband',
    label: 'Legacy · Orc Warband',
    rig: 'Legacy_1.2',
    body: 'media/3D_Assets/KayKit Legacy/Orc Warband - legacy/characters/gltf/character_orcA.gltf',
    animation: 'media/3D_Assets/KayKit Legacy/KayKit Character Animations 1.2 - legacy/Animations/gltf/KayKit_AnimatedCharacter_v1.2.glb',
  },
  frizzleBeeMech: {
    id: 'frizzleBeeMech',
    label: 'FrizzleBob · Bee Mech',
    rig: 'Quaternius_Bee_Mech_F1S5',
    kind: 'mech',
    donor: 'KFB-Stunt-Car-Race · Frankenstein F1-S5 · frizzle_mech_bee',
  },
});

function raw(path) {
  return RAW_ROOT + path.split('/').map((p) => encodeURIComponent(p)).join('/');
}

function waitForWb0(timeoutMs = 15000) {
  return new Promise((resolve, reject) => {
    const t0 = performance.now();
    const tick = () => {
      if (window.__wb0 && window.__globe && window.__globe.scene) return resolve(window.__wb0);
      if (performance.now() - t0 > timeoutMs) return reject(new Error('Movement Lab timed out waiting for WB0'));
      setTimeout(tick, 40);
    };
    tick();
  });
}

function visibleSize(object) {
  object.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(object);
  return { box, size: box.getSize(new THREE.Vector3()) };
}

function normalizeHeight(object, targetHeight) {
  object.scale.setScalar(1);
  object.position.set(0, 0, 0);
  const before = visibleSize(object);
  const nativeHeight = before.size.y;
  if (nativeHeight > 1e-6) object.scale.multiplyScalar(targetHeight / nativeHeight);
  object.updateMatrixWorld(true);
  const after = visibleSize(object);
  object.position.y -= after.box.min.y;
  object.updateMatrixWorld(true);
  return {
    nativeHeight,
    worldHeight: visibleSize(object).size.y,
    targetHeight,
    worldScale: object.scale.x,
  };
}

function worldLambert(root) {
  root.traverse((node) => {
    if (!node.isMesh || !node.material) return;
    const convert = (src) => {
      if (!src) return src;
      const mat = new THREE.MeshLambertMaterial({
        color: src.color ? src.color.clone() : new THREE.Color(0xffffff),
        map: src.map || null,
        transparent: !!src.transparent,
        opacity: src.opacity == null ? 1 : src.opacity,
        alphaTest: src.alphaTest || 0,
        side: src.side,
        vertexColors: !!src.vertexColors,
      });
      mat.name = `${src.name || 'material'} · Movement Lab world-lambert`;
      return mat;
    };
    node.material = Array.isArray(node.material) ? node.material.map(convert) : convert(node.material);
    node.castShadow = true;
    node.receiveShadow = true;
  });
}

function nodeNames(root) {
  const names = new Set();
  root.traverse((node) => { if (node.name) names.add(node.name); });
  return names;
}

function trackInfo(track) {
  try { return THREE.PropertyBinding.parseTrackName(track.name); }
  catch (_) { return null; }
}

function compatibility(root, clip) {
  const names = nodeNames(root);
  let total = 0, matched = 0;
  for (const track of clip.tracks || []) {
    const parsed = trackInfo(track);
    if (!parsed || !parsed.nodeName) continue;
    total++;
    if (names.has(parsed.nodeName)) matched++;
  }
  return { total, matched, ratio: total ? matched / total : 0 };
}

function rootPlanarTravel(clip) {
  let travel = 0;
  for (const track of clip.tracks || []) {
    const parsed = trackInfo(track);
    if (!parsed || parsed.propertyName !== 'position' || !ROOT_MOTION_NODE.test(parsed.nodeName)) continue;
    const values = track.values;
    const stride = typeof track.getValueSize === 'function' ? track.getValueSize() : 3;
    if (!values || stride !== 3 || values.length < 6) continue;
    const x0 = values[0], z0 = values[2];
    for (let i = 0; i < values.length; i += 3) {
      travel = Math.max(travel, Math.hypot(values[i] - x0, values[i + 2] - z0));
    }
  }
  return travel;
}

function controllerOwnedClip(root, clip) {
  const names = nodeNames(root);
  const tracks = [];
  for (const source of clip.tracks || []) {
    const parsed = trackInfo(source);
    if (!parsed || !parsed.nodeName || !names.has(parsed.nodeName)) continue;
    if (parsed.propertyName === 'position' && ROOT_MOTION_NODE.test(parsed.nodeName)) continue;
    tracks.push(source.clone());
  }
  return new THREE.AnimationClip(clip.name, clip.duration, tracks, clip.blendMode);
}

function makeEntry(root, clip, set, worldScale = 1) {
  const compat = compatibility(root, clip);
  if (compat.matched < 3 || compat.ratio < 0.55) return null;
  const cleaned = controllerOwnedClip(root, clip);
  if (!cleaned.tracks.length) return null;
  const rootTravelSource = rootPlanarTravel(clip);
  const rootTravelWorld = rootTravelSource * Math.abs(worldScale || 1);
  return {
    key: `${set}::${clip.name}`,
    name: clip.name,
    set,
    clip: cleaned,
    compatibility: compat,
    rootTravelSource,
    rootTravelWorld,
    rootSpeedWorld: clip.duration > 1e-6 ? rootTravelWorld / clip.duration : 0,
  };
}

function choose(entries, exactNames, fallbackRe) {
  for (const name of exactNames) {
    const hit = entries.find((entry) => entry.name === name);
    if (hit) return hit;
  }
  return entries.find((entry) => fallbackRe.test(entry.name)) || null;
}

function autoMap(entries) {
  return {
    idle: choose(entries, ['Idle_A', 'Idle'], /^Idle/i),
    walk: choose(entries, ['Walking_A', 'Walk'], /Walk/i),
    run: choose(entries, ['Running_A', 'Run'], /Run/i),
    jump: choose(entries, ['Jump_Full_Short', 'Jump_Full_Long', 'Jump'], /^Jump/i),
  };
}

function clearGroup(group) {
  for (const child of [...group.children]) group.remove(child);
}

function ensureVisualRoot(playerRoot) {
  let visual = playerRoot.getObjectByName('WB0 Player Visual');
  if (visual) return visual;
  visual = new THREE.Group();
  visual.name = 'WB0 Player Visual';
  const old = [...playerRoot.children];
  for (const child of old) { playerRoot.remove(child); visual.add(child); }
  playerRoot.add(visual);
  return visual;
}

function createUi() {
  const host = document.getElementById('wb0-root');
  const wrap = document.createElement('div');
  wrap.className = 'wb0-movement-lab';
  wrap.innerHTML = `
    <div class="wb0-move-title">GROUND MOVEMENT LAB</div>
    <div class="wb0-move-buttons">
      <button data-profile="actionFigure">ActionFigure</button>
      <button data-profile="monstrosity">Monstrosity</button>
      <button data-profile="legacyWarband">Legacy Warband</button>
      <button data-profile="frizzleBeeMech">FrizzleBee Mech</button>
    </div>
    <div class="wb0-move-controls">W/S move · A/D turn · Q/E strafe · Shift run · Space jump · RMB look · Wheel zoom</div>
    <div class="wb0-move-row"><button data-auto class="active">AUTO</button><select data-clip><option>loading clips…</option></select><button data-replay>Replay</button></div>
    <div class="wb0-move-status" data-move-status>Preparing character lab…</div>`;
  const style = document.createElement('style');
  style.textContent = `
    .wb0-movement-lab{position:absolute;left:14px;top:58px;z-index:125;width:min(455px,calc(100vw - 28px));pointer-events:auto;background:rgba(10,16,28,.88);backdrop-filter:blur(9px);border:1px solid rgba(244,234,215,.22);border-radius:9px;padding:9px;color:#f4ead7;box-shadow:0 8px 28px rgba(0,0,0,.24);font-family:"Baloo 2",system-ui,sans-serif}
    .wb0-move-title{font:700 10px/1.2 "Special Elite",monospace;letter-spacing:.08em;color:#d8b25b;margin-bottom:6px}.wb0-move-buttons,.wb0-move-row{display:flex;gap:5px;flex-wrap:wrap}.wb0-movement-lab button,.wb0-movement-lab select{border:1px solid rgba(244,234,215,.28);background:#263448;color:#f4ead7;border-radius:5px;padding:5px 7px;font:700 10px/1 "Baloo 2",sans-serif}.wb0-movement-lab button{cursor:pointer}.wb0-movement-lab button.active{background:#c76b42;border-color:#e6a47e}.wb0-move-controls{font:10px/1.35 monospace;opacity:.78;margin:6px 0}.wb0-move-row select{flex:1 1 170px;min-width:0}.wb0-move-status{font:10px/1.35 monospace;opacity:.88;margin-top:6px;white-space:pre-wrap}
    @media(max-width:760px){.wb0-movement-lab{top:58px;width:calc(100% - 28px)}}`;
  document.head.appendChild(style);
  host.appendChild(wrap);
  return {
    wrap,
    profileButtons: [...wrap.querySelectorAll('[data-profile]')],
    auto: wrap.querySelector('[data-auto]'),
    clip: wrap.querySelector('[data-clip]'),
    replay: wrap.querySelector('[data-replay]'),
    status: wrap.querySelector('[data-move-status]'),
  };
}

async function main() {
  const wb0 = await waitForWb0();
  const scene = window.__globe.scene;
  const playerRoot = scene.getObjectByName('WB0 Ground Player');
  if (!playerRoot) throw new Error('WB0 Ground Player root not found');
  const visualRoot = ensureVisualRoot(playerRoot);
  const loader = new GLTFLoader();
  const ui = createUi();
  const cache = new Map();
  let active = null;
  let currentAction = null;
  let currentKey = null;
  let auto = true;
  let manualKey = null;
  let cadenceScale = 1;

  const bodyHeight = Number(wb0.report && wb0.report().bodyHeight) || 0.022;
  const baseGroundSpeed = wb0.ground.params.speed;

  async function loadModern(def) {
    const bodyGltf = await loader.loadAsync(raw(def.body));
    const body = bodyGltf.scene;
    body.name = `${def.label} · body`;
    worldLambert(body);
    const measure = normalizeHeight(body, bodyHeight);
    const entries = [];
    for (const set of def.animationSets) {
      const path = `media/3D_Assets/KayKit_Character_Animations_1.1/Animations/gltf/${def.rig}/${def.rig}_${set}.glb`;
      const source = await loader.loadAsync(raw(path));
      for (const clip of source.animations || []) {
        const entry = makeEntry(body, clip, set, measure.worldScale);
        if (entry) entries.push(entry);
      }
    }
    for (const clip of bodyGltf.animations || []) {
      const entry = makeEntry(body, clip, 'Body', measure.worldScale);
      if (entry && !entries.some((e) => e.key === entry.key)) entries.push(entry);
    }
    if (!entries.length) throw new Error(`${def.label}: no compatible animation tracks found`);
    return {
      def, model: body, actionRoot: body, mixer: new THREE.AnimationMixer(body), entries,
      auto: autoMap(entries), measure, fallback: false, speedMul: 1, locomotionHeight: bodyHeight,
      status: `${entries.length} compatible clips · ${def.rig} · source pin ${CHARACTER_PIN.slice(0, 8)}`,
    };
  }

  async function loadLegacy(def) {
    const warbandGltf = await loader.loadAsync(raw(def.body));
    const warband = warbandGltf.scene;
    warband.name = 'Legacy Orc A · direct compatibility probe';
    const legacy = await loader.loadAsync(raw(def.animation));
    const warbandMeasure = normalizeHeight(warband, bodyHeight);
    const direct = [];
    for (const clip of legacy.animations || []) {
      const entry = makeEntry(warband, clip, 'Legacy1.2', warbandMeasure.worldScale);
      if (entry) direct.push(entry);
    }
    const directAuto = autoMap(direct);
    const directUsable = direct.length > 0 && directAuto.walk && directAuto.run && directAuto.jump;

    if (directUsable) {
      worldLambert(warband);
      return {
        def, model: warband, actionRoot: warband, mixer: new THREE.AnimationMixer(warband), entries: direct,
        auto: directAuto, measure: warbandMeasure, fallback: false, speedMul: 1, locomotionHeight: bodyHeight,
        status: `Warband direct binding PASS · ${direct.length}/${(legacy.animations || []).length} compatible clips`,
      };
    }

    const donorModel = legacy.scene;
    donorModel.name = 'Legacy 1.2 · embedded animated fallback';
    worldLambert(donorModel);
    const measure = normalizeHeight(donorModel, bodyHeight);
    const entries = [];
    for (const clip of legacy.animations || []) {
      const entry = makeEntry(donorModel, clip, 'Legacy1.2', measure.worldScale);
      if (entry) entries.push(entry);
    }
    if (!entries.length) throw new Error('Legacy 1.2 animated donor contains no bindable clips');
    return {
      def, model: donorModel, actionRoot: donorModel, mixer: new THREE.AnimationMixer(donorModel), entries,
      auto: autoMap(entries), measure, fallback: true, speedMul: 1, locomotionHeight: bodyHeight,
      status: `Warband direct binding ${direct.length}/${(legacy.animations || []).length} → animated Legacy donor fallback · ${entries.length} clips`,
    };
  }

  async function loadMech(def) {
    const donor = await buildFrizzleBeeMovementDonor({ loader, bodyHeight });
    worldLambert(donor.model);
    const entries = [];
    for (const clip of donor.animations) {
      const entry = makeEntry(donor.animationRoot, clip, 'QuaterniusBee', donor.animationScale);
      if (entry) entries.push(entry);
    }
    if (!entries.length) throw new Error('FrizzleBob Bee Mech: no compatible embedded movement clips found');
    const auto = autoMap(entries);
    if (!auto.idle || !auto.walk || !auto.run || !auto.jump) {
      throw new Error(`FrizzleBob Bee Mech missing locomotion clips: ${['idle','walk','run','jump'].filter((k) => !auto[k]).join(', ')}`);
    }
    return {
      def,
      model: donor.model,
      actionRoot: donor.animationRoot,
      mixer: new THREE.AnimationMixer(donor.animationRoot),
      entries,
      auto,
      measure: { targetHeight: donor.targetHeight, worldHeight: donor.targetHeight, worldScale: donor.animationScale },
      fallback: false,
      speedMul: donor.speedMul,
      locomotionHeight: donor.targetHeight,
      donorReport: donor.report,
      status: `F1-S5 donor · ${entries.length} embedded Bee clips · speed ${donor.speedMul.toFixed(2)}× · shell/driver/cockpit composite`,
    };
  }

  async function loadProfile(id) {
    if (cache.has(id)) return cache.get(id);
    const def = PROFILES[id];
    if (!def) throw new Error(`Unknown movement profile: ${id}`);
    ui.status.textContent = `Loading ${def.label}…`;
    const runtime = def.kind === 'mech' ? await loadMech(def)
      : def.rig === 'Legacy_1.2' ? await loadLegacy(def)
      : await loadModern(def);
    cache.set(id, runtime);
    return runtime;
  }

  function fillClipMenu(runtime) {
    ui.clip.innerHTML = '';
    for (const entry of runtime.entries) {
      const option = document.createElement('option');
      option.value = entry.key;
      option.textContent = `${entry.set} · ${entry.name}`;
      ui.clip.appendChild(option);
    }
    const first = runtime.auto.idle || runtime.entries[0];
    if (first) ui.clip.value = first.key;
  }

  function stopCurrent(fade = 0.12) {
    if (!currentAction) return;
    try { currentAction.fadeOut(fade); } catch (_) { currentAction.stop(); }
    currentAction = null;
    currentKey = null;
  }

  function playEntry(entry, { oneShot = false, force = false } = {}) {
    if (!active || !entry) return;
    if (!force && currentKey === entry.key) return;
    const previous = currentAction;
    const action = active.mixer.clipAction(entry.clip, active.actionRoot || active.model);
    action.enabled = true;
    action.reset();
    action.setEffectiveTimeScale(1);
    action.clampWhenFinished = !!oneShot;
    action.setLoop(oneShot ? THREE.LoopOnce : THREE.LoopRepeat, oneShot ? 1 : Infinity);
    action.fadeIn(0.12).play();
    if (previous && previous !== action) previous.fadeOut(0.12);
    currentAction = action;
    currentKey = entry.key;
    ui.clip.value = entry.key;
  }

  function autoEntry(state) {
    if (!active) return null;
    if (!state.onGround) return active.auto.jump || active.auto.walk || active.auto.idle;
    if (state.moving && state.running) return active.auto.run || active.auto.walk || active.auto.idle;
    if (state.moving) return active.auto.walk || active.auto.run || active.auto.idle;
    return active.auto.idle || active.entries[0];
  }

  function cadenceFor(entry, state) {
    if (!entry || !auto) return 1;
    if (!state.onGround) {
      const p = wb0.ground.params;
      const airTime = p.gravity > 1e-8 ? (2 * p.jumpSpeed / p.gravity) : entry.clip.duration;
      return THREE.MathUtils.clamp(entry.clip.duration / Math.max(0.1, airTime), 0.6, 1.8);
    }
    if (!state.moving) return 1;
    const strideUnit = active?.locomotionHeight || bodyHeight;
    const fallbackCycleDistance = strideUnit * (state.running ? 1.05 : 0.62);
    const cycleDistance = entry.rootTravelWorld > strideUnit * 0.08 ? entry.rootTravelWorld : fallbackCycleDistance;
    const sourceWorldSpeed = cycleDistance / Math.max(0.05, entry.clip.duration);
    return THREE.MathUtils.clamp(state.speed / Math.max(strideUnit * 0.05, sourceWorldSpeed), 0.5, 2.2);
  }

  function updatePresentation(dt, state) {
    if (!active) return;
    let entry = active.entries.find((item) => item.key === currentKey) || null;
    if (auto) {
      entry = autoEntry(state);
      playEntry(entry, { oneShot: !state.onGround && entry === active.auto.jump });
      cadenceScale = cadenceFor(entry, state);
      if (currentAction) currentAction.setEffectiveTimeScale(cadenceScale);
    } else {
      cadenceScale = 1;
      if (currentAction) currentAction.setEffectiveTimeScale(1);
    }
    active.mixer.update(dt);
    const activeEntry = active.entries.find((item) => item.key === currentKey);
    const strideUnit = active.locomotionHeight || bodyHeight;
    const stride = activeEntry && activeEntry.rootTravelWorld > strideUnit * 0.08
      ? `root ${(activeEntry.rootTravelWorld / strideUnit).toFixed(2)} body` : 'fallback stride';
    const speedTag = active.speedMul && Math.abs(active.speedMul - 1) > 0.01 ? ` · move ${active.speedMul.toFixed(2)}×` : '';
    ui.status.textContent = `${active.def.label}\n${active.status}\nstate ${state.onGround ? (state.moving ? (state.running ? 'RUN' : 'WALK') : 'IDLE') : 'JUMP'} · clip ${activeEntry ? activeEntry.name : '—'} · cadence ${cadenceScale.toFixed(2)}× · ${stride}${speedTag}${active.fallback ? '\nLEGACY: Warband mesh was not directly rig-compatible; showing the actual animated legacy donor.' : ''}`;
  }

  async function activate(id, persist = true) {
    const runtime = await loadProfile(id);
    stopCurrent(0.05);
    if (active && active.model.parent === visualRoot) visualRoot.remove(active.model);
    clearGroup(visualRoot);
    visualRoot.add(runtime.model);
    active = runtime;
    wb0.ground.params.speed = baseGroundSpeed * (runtime.speedMul || 1);
    currentAction = null; currentKey = null; manualKey = null; auto = true; cadenceScale = 1;
    fillClipMenu(runtime);
    ui.auto.classList.add('active');
    ui.profileButtons.forEach((button) => button.classList.toggle('active', button.dataset.profile === id));
    const first = autoEntry(wb0.ground.state);
    playEntry(first, { oneShot: !wb0.ground.state.onGround && first === runtime.auto.jump, force: true });
    wb0.recipe.base.groundCharacterProfile = id;
    if (persist && wb0.save) wb0.save();
    ui.status.textContent = `${runtime.def.label}\n${runtime.status}`;
  }

  ui.profileButtons.forEach((button) => {
    button.onclick = () => activate(button.dataset.profile).catch((error) => { ui.status.textContent = `LOAD FAILED · ${error.message}`; });
  });
  ui.auto.onclick = () => {
    auto = true; manualKey = null; ui.auto.classList.add('active');
    const entry = autoEntry(wb0.ground.state); playEntry(entry, { force: true, oneShot: !wb0.ground.state.onGround && entry === active?.auto.jump });
  };
  ui.clip.onchange = () => {
    if (!active) return;
    auto = false; ui.auto.classList.remove('active'); manualKey = ui.clip.value;
    playEntry(active.entries.find((entry) => entry.key === manualKey), { force: true });
  };
  ui.replay.onclick = () => {
    if (!active) return;
    const entry = active.entries.find((item) => item.key === (manualKey || currentKey));
    playEntry(entry, { force: true });
  };

  wb0.ground.setPresentationUpdater(updatePresentation);
  wb0.movementLab = {
    profiles: PROFILES,
    assetPin: CHARACTER_PIN,
    mechDonorPin: F1_DONOR_REV,
    get activeProfile() { return active && active.def.id; },
    get auto() { return auto; },
    activate,
    report() {
      return active ? {
        profile: active.def.id,
        rig: active.def.rig,
        clips: active.entries.length,
        fallback: active.fallback,
        cadenceScale,
        speedMul: active.speedMul || 1,
        donorReport: active.donorReport || null,
        auto: Object.fromEntries(Object.entries(active.auto).map(([k, v]) => [k, v && v.name])),
        rootTravelWorld: Object.fromEntries(Object.entries(active.auto).map(([k, v]) => [k, v && v.rootTravelWorld || 0])),
      } : { profile: null };
    },
  };

  const saved = wb0.recipe.base.groundCharacterProfile;
  const initial = PROFILES[saved] ? saved : 'actionFigure';
  await activate(initial, false);
  console.info('[wb0 movement-lab]', wb0.movementLab.report());
}

main().catch((error) => {
  console.warn('[wb0 movement-lab]', error);
  const status = document.querySelector('[data-move-status]');
  if (status) status.textContent = `Movement Lab failed · ${error.message}`;
});
