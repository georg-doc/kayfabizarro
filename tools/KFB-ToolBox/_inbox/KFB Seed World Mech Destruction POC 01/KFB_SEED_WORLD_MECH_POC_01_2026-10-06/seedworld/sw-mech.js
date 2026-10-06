/* KFB Seed World · POC 01 · the real KayKit Combat Mech in third-person flight
   RESEARCH PLAYGROUND · NOT WORLD STUDIO · NOT COMBAT ARENA · not Travel's flight owner.
   Two switchable sources (both real, both pinned):
   A · Flight Family 01 gate 1 · KFB_FLIGHT_SELF_01_CombatMech_RigMedium.glb + its flight clips (georg-doc-patch-3 @ b7f6013)
   B · Resident Atlas presentation · CombatMech.glb (Rig_Medium, 23 joints) @ 2c92dd13, legs Jump_Idle + torso
       Running_HoldingRifle (chest subtree), pose frozen at 0.25 s, wings WingLeft/WingRight 38° out (cast.js S16b),
       clips from KayKit Character Animations 1.1 @ aa16a777.
   Weapon: CombatMech_Minigun.gltf @ 2c92dd13 on the hand slot with identity; CombatMech_Minigun_Barrel spins.
   Exactly one owner of the player transform: this module. Weapons only push impulses through impulse(). */

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { createWeaponFX } from './sw-fx.js';
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js';

const enc = (p) => p.split('/').map(encodeURIComponent).join('/');
const url = (s) => 'https://cdn.jsdelivr.net/gh/' + (s.repo || 'georg-doc/kayfabizarro') + '@' + s.commit + '/' + enc(s.path);
const CM_PIN = '2c92dd13cbc379ad3a6028144b8976bb3d6a840d', ANIM_PIN = 'aa16a777a970f23d3f11fb3c23dc40718b04fa88';
const CM = 'media/3D_Assets/KayKit_Mystery_Series6/1 - July 2024 - Combat Mech/';
const ANIM = 'media/3D_Assets/KayKit_Character_Animations_1.1/Animations/gltf/Rig_Medium/';
/* Locomotion ladder (ToolBox Animation Lab, measured on Rig_Medium @ b97b5ac5). roles: [clip, nativeSpeed = worldSpeed / actorScale, loop].
   World speed on the mech = nativeSpeed × body scale, so the feet stay planted at playback rate 1. */
export const LOCO = {
  commit: 'b97b5ac55df2724fae623992433685583eece51e', sets: ['General', 'MovementBasic', 'MovementAdvanced'].map((s) => ANIM + 'Rig_Medium_' + s + '.glb'),
  profile: 'tools/KFB-ToolBox/_inbox/KFB ToolBox Production-01-1/KFB_TOOLBOX_CLAUDE_DESIGN_SESSION_CUT_2026-09-25_r2/data/kfb-locomotion-profiles.Rig_Medium.frizzlebob-earrig-v5.consumer.json',
  actorScale: 0.9473,
  roles: { idle: ['Idle_A', 0, true], walk: ['Walking_A', 0.6576, true], run: ['Running_A', 3.1773, true], sprint: ['Running_B', 3.8803, true], back: ['Walking_Backwards', 0.7263, true], strafeL: ['Running_Strafe_Left', 3.3062, true], strafeR: ['Running_Strafe_Right', 3.3537, true], jStart: ['Jump_Start', 0, false], jAir: ['Jump_Idle', 0, true], jLand: ['Jump_Land', 0, false] },
  fades: { 'idle>walk': 0.25, 'walk>idle': 0.3, 'walk>run': 0.2, 'run>sprint': 0.15, 'sprint>run': 0.2, 'run>walk': 0.25, '*>jStart': 0.08, 'jStart>jAir': 0.1, 'jAir>jLand': 0.05, 'jLand>idle': 0.15, 'jLand>walk': 0.15 },
  sync: ['walk', 'run', 'sprint'], strafeTravel: Math.atan2(0.867, 0.498), jStartOff: 0.2, jLandOff: 0.15
};
export const SOURCES = {
  flight: { key: 'flight', label: 'A · Flight Family 01 gate 1', mech: { commit: 'b7f6013bf00d0661ae943e69e7c3dfde38abcebd', branch: 'georg-doc-patch-3', path: 'skills/chat/workflows/KFB_FLIGHT_ANIMATION_FAMILY_01_2026-10-04/RETURN_GATE1/KFB_FLIGHT_SELF_01_CombatMech_RigMedium.glb' }, mount: ['mountr', 'handslotr'] },
  atlas: { key: 'atlas', label: 'B · Resident Atlas CombatMech.glb', mech: { commit: CM_PIN, branch: 'main', path: CM + 'characters/CombatMech.glb' },
    clips: [{ commit: ANIM_PIN, path: ANIM + 'Rig_Medium_MovementBasic.glb', clip: 'Jump_Idle' }, { commit: ANIM_PIN, path: ANIM + 'Rig_Medium_MovementAdvanced.glb', clip: 'Running_HoldingRifle' }, { commit: ANIM_PIN, path: ANIM + 'Rig_Medium_General.glb', clip: null, fallback: true }], mount: ['handslotr', 'handslot.r'] }
};
export const GUN_SRC = { commit: CM_PIN, branch: 'main', path: CM + 'assets/gltf/CombatMech_Minigun.gltf' };

const F = { G: 24, jumpV: 8, jumpDelay: 0.133, walkResp: 7, airResp: 1.2, noLand: 0.6, dbl: 0.3, gait: 1, speed: 20, boost: 2.6, response: 2.4, vResp: 2.0, look: 0.0024, pitchMax: 1.3, turnRate: 2.1, turnSmooth: 8, climb: 14, back: 0.6, follow: 2.5, faceToAim: 6, fireRate: 18, spinUp: 0.16, tracer: 170, range: 220, aimM: 90, PITCH: 0.5, BANK: 0.65, TURN: 4, EASE: 5 };
export const WCAPS = { rounds: 96, rockets: 24 };
const shortest = (a) => a - 2 * Math.PI * Math.round(a / (2 * Math.PI));
const clamp = THREE.MathUtils.clamp;

function flashTexture() {
  const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d');
  const r = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  r.addColorStop(0, 'rgba(255,255,230,1)'); r.addColorStop(0.25, 'rgba(255,214,110,0.95)'); r.addColorStop(0.6, 'rgba(255,140,40,0.35)'); r.addColorStop(1, 'rgba(255,120,30,0)');
  g.fillStyle = r; g.fillRect(0, 0, 128, 128); g.globalCompositeOperation = 'lighter'; g.strokeStyle = 'rgba(255,240,200,0.9)'; g.lineWidth = 6;
  for (let i = 0; i < 4; i++) { const a = (i * Math.PI) / 4; g.beginPath(); g.moveTo(64 - Math.cos(a) * 60, 64 - Math.sin(a) * 60); g.lineTo(64 + Math.cos(a) * 60, 64 + Math.sin(a) * 60); g.stroke(); }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

export async function loadSources(onProgress) {
  const loader = new GLTFLoader(), out = { gun: null, flight: null, atlas: null, errors: [] };
  const L = (s) => loader.loadAsync(url(s));
  const step = (n) => onProgress && onProgress(n);
  try { out.gun = await L(GUN_SRC); step('Minigun'); } catch (e) { out.errors.push('gun: ' + e.message); }
  try { out.flight = await L(SOURCES.flight.mech); step('Flight Family mech'); } catch (e) { out.errors.push('flight: ' + e.message); }
  try {
    const [cm, basic, adv] = await Promise.all([L(SOURCES.atlas.mech), L(SOURCES.atlas.clips[0]), L(SOURCES.atlas.clips[1])]);
    let legs = basic.animations.find((c) => c.name === 'Jump_Idle'), arms = adv.animations.find((c) => c.name === 'Running_HoldingRifle');
    if (!legs || !arms) { const gen = await L(SOURCES.atlas.clips[2]); const all = [...basic.animations, ...adv.animations, ...gen.animations]; legs = legs || all.find((c) => c.name === 'Jump_Idle'); arms = arms || all.find((c) => c.name === 'Running_HoldingRifle'); }
    out.atlas = { gltf: cm, legs, arms }; step('Atlas mech + clips');
  } catch (e) { out.errors.push('atlas: ' + e.message); }
  try {
    const sets = await Promise.all(LOCO.sets.map((p) => L({ commit: LOCO.commit, path: p })));
    const all = sets.flatMap((g) => g.animations), clips = {}, missing = [];
    for (const [r, [name]] of Object.entries(LOCO.roles)) { const c = all.find((x) => x.name === name); if (c) clips[r] = c; else missing.push(name); }
    // pin check: Atlas pose uses Jump_Idle @ aa16a777, the ladder was measured @ b97b5ac5
    let samePin = null; const a = out.atlas && out.atlas.legs, b = clips.jAir;
    if (a && b) samePin = a.tracks.length === b.tracks.length && a.tracks.every((t, i) => t.name === b.tracks[i].name && t.values.length === b.tracks[i].values.length && t.values.every((v, j) => Math.abs(v - b.tracks[i].values[j]) < 1e-6));
    out.loco = { clips, missing, samePin, rifle: all.find((x) => x.name === 'Running_HoldingRifle') || null }; step('locomotion ladder');
  } catch (e) { out.errors.push('loco: ' + e.message); }
  return out;
}

function buildActor(kind, src, gunG, height, scene, loco) {
  const g = kind === 'atlas' ? src.gltf : src;
  const raw = new THREE.Box3().setFromObject(g.scene).getSize(new THREE.Vector3()), scale = height / raw.y;
  const holder = new THREE.Group(); holder.name = 'combat-mech:' + kind; holder.visible = false;
  const kick = new THREE.Group(); holder.add(kick);
  const body = SkeletonUtils.clone(g.scene); body.scale.setScalar(scale); body.rotation.y = Math.PI;
  body.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.frustumCulled = false; } });
  kick.add(body);
  let mount = null; for (const n of SOURCES[kind].mount) { mount = body.getObjectByName(n); if (mount) break; }
  const gun = gunG.scene.clone(true); gun.traverse((o) => { if (o.isMesh) o.castShadow = true; }); (mount || body).add(gun);
  const barrel = gun.getObjectByName('CombatMech_Minigun_Barrel');
  const mixer = new THREE.AnimationMixer(body), act = {};
  // chest = common ancestor of both arm chains (cast.js: mask 'torso'); shared by the Atlas pose and the armed ground layer
  const la = body.getObjectByName('upperarml'), ra = body.getObjectByName('upperarmr'), anc = new Set();
  for (let o = la; o; o = o.parent) anc.add(o);
  let chest = ra; while (chest && !anc.has(chest)) chest = chest.parent;
  const torso = new Set(); if (chest) chest.traverse((o) => torso.add(o.name));
  const boneOf = (t) => t.name.split('.')[0];
  let wings = [];
  if (kind === 'flight') {
    for (const c of g.animations) { const a = mixer.clipAction(c); if (!/roll_reaction|brake_recover|land_prepare/.test(c.name)) { a.play(); a.setEffectiveWeight(0); } act[c.name] = a; }
    const b = act.flight_brake_recover; if (b) { b.loop = THREE.LoopOnce; b.clampWhenFinished = false; }
  } else {
    const legs = new THREE.AnimationClip('legs:Jump_Idle', src.legs.duration, src.legs.tracks.filter((t) => !torso.has(boneOf(t))));
    const arms = new THREE.AnimationClip('torso:Running_HoldingRifle', src.arms.duration, src.arms.tracks.filter((t) => torso.has(boneOf(t))));
    for (const c of [legs, arms]) { const a = mixer.clipAction(c); a.play(); a.time = 0.25; a.timeScale = 0; act[c.name] = a; }
    mixer.update(0);
    for (const [n, d] of [['CombatMech_WingLeft', -38], ['CombatMech_WingRight', 38]]) { const w = body.getObjectByName(n); if (w) { w.userData.base = w.rotation.y; w.rotation.y += (d * Math.PI) / 180; wings.push({ w, d }); } }
    act.__chest = chest ? chest.name : null; act.__torso = torso.size;
  }
  const L = { act: {}, w: {}, cur: 'idle', fade: 0.2, bones: '0/0', rifle: null };
  if (loco) {
    const have = new Set(), bn = (t) => t.name.split('.')[0]; body.traverse((o) => have.add(o.name));
    // armed ground layer: legs/hips/spine from the ladder, chest subtree (arms, gun hand, head) from Running_HoldingRifle
    const armed = !!loco.rifle && torso.size > 0;
    for (const [r, c] of Object.entries(loco.clips)) {
      if (r === 'run') { const bs = [...new Set(c.tracks.map(bn))]; L.bones = bs.filter((b) => have.has(b)).length + '/' + bs.length; }
      const a = mixer.clipAction(new THREE.AnimationClip('loco:' + r, c.duration, c.tracks.filter((t) => have.has(bn(t)) && !(armed && torso.has(bn(t))))));
      if (!LOCO.roles[r][2]) { a.loop = THREE.LoopOnce; a.clampWhenFinished = true; }
      a.play(); a.setEffectiveWeight(0); L.act[r] = a; L.w[r] = r === 'idle' ? 1 : 0;
    }
    if (armed) { L.rifle = mixer.clipAction(new THREE.AnimationClip('loco:armed-torso', loco.rifle.duration, loco.rifle.tracks.filter((t) => torso.has(bn(t)) && have.has(bn(t))))); L.rifle.play(); L.rifle.timeScale = 0; L.rifle.time = 0.25; L.rifle.setEffectiveWeight(0); }
  }
  scene.add(holder);
  holder.updateMatrixWorld(true);
  // barrel axis in gun space (the barrel spins about its own z); sign = towards the barrel centre, i.e. out of the muzzle
  const gunAxis = new THREE.Vector3(0, 0, 1), gunBase = gun.quaternion.clone();
  if (barrel) {
    const qb = barrel.getWorldQuaternion(new THREE.Quaternion()), qg = gun.getWorldQuaternion(new THREE.Quaternion());
    gunAxis.set(0, 0, 1).applyQuaternion(qb).applyQuaternion(qg.invert()).normalize();
    const c = gun.worldToLocal(new THREE.Box3().setFromObject(barrel).getCenter(new THREE.Vector3()));
    if (c.dot(gunAxis) < 0) gunAxis.negate();
  }
  let barrelLen = 0.6 * scale;
  if (barrel) { const s = new THREE.Box3().setFromObject(barrel).getSize(new THREE.Vector3()); barrelLen = Math.max(s.x, s.y, s.z) * 0.55; }
  return { kind, holder, kick, body, gun, barrel, mixer, act, wings, loco: L, gunAxis, gunBase, axisChecked: false, scale, raw, barrelLen, mountName: mount ? mount.name : null, clips: kind === 'flight' ? g.animations.map((c) => c.name) : Object.keys(act).filter((k) => !k.startsWith('__')) };
}

export function createMech({ scene, camera, canvas, assets, hooks, height = 2.6, onState }) {
  const actors = {};
  if (assets.flight && assets.gun) actors.flight = buildActor('flight', assets.flight, assets.gun, height, scene, assets.loco);
  if (assets.atlas && assets.gun) actors.atlas = buildActor('atlas', assets.atlas, assets.gun, height, scene, assets.loco);
  let cur = actors.flight || actors.atlas;
  const flash = flashTexture();
  const muzzle = new THREE.Sprite(new THREE.SpriteMaterial({ map: flash, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, toneMapped: false }));
  muzzle.visible = false; muzzle.renderOrder = 30;
  const tracers = new THREE.InstancedMesh(new THREE.BoxGeometry(0.08, 0.08, 3.2), new THREE.MeshBasicMaterial({ color: '#ffd36b', blending: THREE.AdditiveBlending, transparent: true, depthWrite: false, toneMapped: false }), WCAPS.rounds);
  tracers.count = 0; tracers.frustumCulled = false;
  const rkBody = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.11, 0.13, 1.0, 10).rotateX(Math.PI / 2), new THREE.MeshStandardMaterial({ color: '#f2efe6', roughness: 0.6 }), WCAPS.rockets);
  const rkNose = new THREE.InstancedMesh(new THREE.ConeGeometry(0.13, 0.36, 10).rotateX(Math.PI / 2), new THREE.MeshStandardMaterial({ color: '#d9542c', roughness: 0.6 }), WCAPS.rockets);
  const rkFlame = new THREE.InstancedMesh(new THREE.SphereGeometry(0.22, 10, 8), new THREE.MeshBasicMaterial({ color: '#ffcf70', toneMapped: false }), WCAPS.rockets);
  [rkBody, rkNose, rkFlame].forEach((m) => { m.count = 0; m.frustumCulled = false; });
  scene.add(muzzle, rkBody, rkNose, rkFlame);
  const fx = createWeaponFX({ scene, camera, groundAt: hooks.ground });
  for (const a of Object.values(actors)) { a.heat = []; if (a.barrel) a.barrel.traverse((o) => { if (o.isMesh && o.material && o.material.emissive) { o.material = o.material.clone(); a.heat.push(o.material); } }); }
  let heat = 0, burst = 0, flashT = 0, smokeAcc = 0; const UPV = new THREE.Vector3(0, 1, 0), ejR = new THREE.Vector3(), ejU = new THREE.Vector3();

  const camOff = new THREE.Vector3();
  const pos = new THREE.Vector3(0, 40, 0), vel = new THREE.Vector3(), move = new THREE.Vector3(), imp = new THREE.Vector3();
  const heading = new THREE.Quaternion(), smooth = new THREE.Quaternion(), qBody = new THREE.Quaternion();
  const fwd = new THREE.Vector3(), right = new THREE.Vector3(), tmp = new THREE.Vector3(), tmp2 = new THREE.Vector3();
  const look = { yaw: 0, pitch: 0 }, steer = { yaw: 0, pitch: 0, roll: 0 }, keys = new Set(), euler = new THREE.Euler(0, 0, 0, 'YXZ');
  const k = height / 3;
  let active = false, locked = false, fallback = false, paused = false, trigger = false, spin = 0, spinAngle = 0, fireAcc = 0, t = 0;
  let face = 0, turnCmd = 0, zoom = 1, weapon = 'gun', fireLatch = false, scriptTrig = false, scriptDrive = false; const mouse = { l: false, r: false };
  let rocketMode = 'straight', rocketCd = 0, side = 1, kickAmt = 0, boostAmt = 0, aimAmt = 0, prevS = 0, brakeT = -1, shake = 0;
  const stats = { shots: 0, hits: 0, rockets: 0, roundsPeak: 0, rocketsPeak: 0 };
  // locomotion: flight | walk | air (jump). mBlend 1 = flight pose, 0 = ground ladder
  let mode = 'flight', mBlend = 1, noLand = 0, jumpT = 0, launched = false, landT = -1, lastSpace = -9, walkOn = false, combat = false, gait = 'idle', yawOff = 0;
  const rounds = Array.from({ length: WCAPS.rounds }, () => ({ on: false, p: new THREE.Vector3(), d: new THREE.Vector3(), travelled: 0 }));
  const rockets = Array.from({ length: WCAPS.rockets }, () => ({ on: false, p: new THREE.Vector3(), d: new THREE.Vector3(), v: 0, vel: new THREE.Vector3(), aim: new THREE.Vector3(), age: 0, trail: 0, homing: false }));

  function setHeading() { heading.setFromEuler(euler.set(look.pitch, look.yaw, 0, 'YXZ')); }
  function useSource(kind) {
    if (!actors[kind]) return false;
    for (const a of Object.values(actors)) a.holder.visible = false;
    cur = actors[kind]; cur.holder.visible = active; emit(); return true;
  }
  function start(at, yaw = 0) {
    if (at) pos.copy(at); vel.set(0, 0, 0);
    look.yaw = yaw; look.pitch = -0.15; setHeading(); smooth.copy(heading); face = yaw; turnCmd = 0; camOff.set(0, 0, 0);
    Object.assign(steer, { yaw: look.yaw, pitch: 0, roll: 0 });
    mode = 'flight'; mBlend = 1; noLand = 0.3; landT = -1; yawOff = 0;
    cur.holder.visible = true; active = true; paused = false;
    emit();
  }
  function stop() { if (!active) return; active = false; combat = false; trigger = false; fireLatch = false; scriptTrig = false; mouse.l = mouse.r = false; keys.clear(); if (document.pointerLockElement === canvas) document.exitPointerLock(); cur.holder.visible = false; muzzle.visible = false; emit(); }
  function impulse(v) { imp.add(v); }
  function hasLoco() { return !!(cur && cur.loco.act.idle); }
  function takeOff() { if (mode === 'flight') return; mode = 'flight'; vel.y = Math.max(vel.y, F.climb * 0.7); pos.y = Math.max(pos.y, hooks.ground(pos.x, pos.z) + 0.35); noLand = F.noLand; landT = -1; yawOff = 0; emit(); }
  function jump() { if (mode !== 'walk') return; mode = 'air'; jumpT = 0; launched = false; landT = -1; emit(); }
  function setCombat(v) {
    combat = v; if (v) face = look.yaw;
    if (v && !locked && !fallback) { try { const p = canvas.requestPointerLock(); if (p && p.catch) p.catch(() => (fallback = true)); } catch (er) { fallback = true; } }
    if (!v && document.pointerLockElement === canvas && !mouse.l && !mouse.r) document.exitPointerLock();
    emit();
  }
  /* one key press (not repeat); shared by the keyboard and the test script */
  function press(code) {
    const now = performance.now() / 1000;
    if (code === 'Space') { const dbl = now - lastSpace <= F.dbl; if (mode === 'walk') dbl ? takeOff() : jump(); else if (mode === 'air' && dbl) takeOff(); lastSpace = now; }
    else if (code === 'ArrowUp') takeOff();
    else if (code === 'Digit2') fireRocket();
    else if (code === 'KeyF') fireLatch = !fireLatch;
    else if (code === 'KeyX') fireRocket();
    else if (code === 'KeyT') toggleRockets();
    else if (code === 'KeyC') { walkOn = !walkOn; emit(); }
    else if (code === 'Tab') setCombat(!combat);
  }

  /* WoW-style mouse: LMB drag orbits the camera only (360°), RMB drag steers (facing follows the camera), both = run forward.
     Pointer lock only while a button is held (hides the cursor in a real tab); in a frame that blocks it, movementX still drives the drag. */
  const onLock = () => { locked = document.pointerLockElement === canvas; if (!locked && combat && !fallback) combat = false; emit(); };
  const onLockErr = () => { fallback = true; emit(); };
  const onMove = (e) => {
    if (!active) return;
    if (typeof e.buttons === 'number') { mouse.l = !!(e.buttons & 1); mouse.r = !!(e.buttons & 2); }
    if (!(mouse.l || mouse.r || combat)) return;
    if (Math.abs(e.movementX) > 250 || Math.abs(e.movementY) > 250) return; // Chrome reports a jump on lock/unlock
    look.yaw -= e.movementX * F.look; look.pitch = clamp(look.pitch - e.movementY * F.look, -F.pitchMax, F.pitchMax); setHeading();
    if (mouse.r || combat) face = look.yaw;
  };
  const onDown = (e) => {
    if (!active) return;
    if (e.button === 0) mouse.l = true; else if (e.button === 2) mouse.r = true; else return;
    e.preventDefault(); const ae = document.activeElement; if (ae && ae !== canvas && ae.blur) ae.blur(); window.focus(); canvas.focus();
    if (!locked && !fallback) { try { const p = canvas.requestPointerLock(); if (p && p.catch) p.catch(() => (fallback = true)); } catch (er) { fallback = true; } }
  };
  const onUp = (e) => {
    if (e.button === 0) mouse.l = false; else if (e.button === 2) mouse.r = false;
    if (!combat && !mouse.l && !mouse.r && document.pointerLockElement === canvas) document.exitPointerLock();
  };
  const onCtx = (e) => { if (active) e.preventDefault(); };
  const onWheel = (e) => { if (!active) return; e.preventDefault(); zoom = clamp(zoom * (e.deltaY > 0 ? 1.1 : 1 / 1.1), 0.55, 2.8); };
  const KEYS = ['KeyW', 'KeyA', 'KeyS', 'KeyD', 'KeyQ', 'KeyE', 'Space', 'ShiftLeft', 'ShiftRight', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'PageUp', 'PageDown', 'Digit1', 'Digit2'];
  const onKey = (e) => {
    if (!active) return;
    const down = e.type === 'keydown';
    // macOS swallows keyup for every key released while Cmd is held (Cmd+Shift+4 …) → drop everything instead of sticking
    if (e.metaKey || e.code === 'MetaLeft' || e.code === 'MetaRight') { keys.clear(); fireLatch = false; return; }
    if (down && e.code === 'Escape') { stop(); return; }
    if (e.code === 'Tab') e.preventDefault();
    if (down && !e.repeat) press(e.code);
    if (!KEYS.includes(e.code)) return;
    e.preventDefault(); if (down) keys.add(e.code); else keys.delete(e.code);
  };
  const onBlur = () => { keys.clear(); fireLatch = false; mouse.l = mouse.r = false; };
  const onVis = () => { if (document.hidden) onBlur(); };
  document.addEventListener('pointerlockchange', onLock); document.addEventListener('pointerlockerror', onLockErr);
  document.addEventListener('mousemove', onMove); canvas.addEventListener('mousedown', onDown); window.addEventListener('mouseup', onUp);
  canvas.addEventListener('contextmenu', onCtx); canvas.addEventListener('wheel', onWheel, { passive: false });
  window.addEventListener('keydown', onKey); window.addEventListener('keyup', onKey); window.addEventListener('blur', onBlur); document.addEventListener('visibilitychange', onVis);

  let lastEmit = 0;
  function emit() { onState && onState({ active, locked, fallback, paused, speed: Math.hypot(vel.x, vel.z), alt: pos.y - hooks.ground(pos.x, pos.z), spin, shots: stats.shots, rockets: stats.rockets, rocketMode, rocketReady: rocketCd <= 0, firing: trigger && spin > 0.7, weapon, mode, combat, walkOn, role: cur && cur.loco ? cur.loco.cur : null, focus: document.hasFocus(), steering: mouse.r, orbiting: mouse.l && !mouse.r, source: cur ? cur.kind : null, sources: Object.keys(actors) }); }

  /* ---------- minigun ---------- */
  const muzzleW = new THREE.Vector3(), aimP = new THREE.Vector3(), camF = new THREE.Vector3(), dirW = new THREE.Vector3(), gQ = new THREE.Quaternion(), pQ = new THREE.Quaternion(), dQ = new THREE.Quaternion(), IDQ = new THREE.Quaternion(), gAx = new THREE.Vector3(), gP = new THREE.Vector3(), camArm = new THREE.Vector3();
  function gunDir(out) { cur.gun.getWorldQuaternion(gQ); return out.copy(cur.gunAxis).applyQuaternion(gQ); }
  function muzzlePoint(out) { if (cur.barrel) cur.barrel.getWorldPosition(out); else cur.gun.getWorldPosition(out); return out.addScaledVector(gunDir(gAx), cur.barrelLen); }
  /* on the ground the hand pose comes from a rifle clip, so the Minigun is re-aimed at the crosshair (blended in with the ground layer) */
  function aimGun() {
    const g = cur.gun; g.quaternion.copy(cur.gunBase);
    if (mBlend >= 1 || !g.parent) return;
    g.parent.getWorldQuaternion(pQ); gQ.copy(pQ).multiply(cur.gunBase);
    gAx.copy(cur.gunAxis).applyQuaternion(gQ);
    g.getWorldPosition(gP); camera.getWorldDirection(camF); dirW.copy(camera.position).addScaledVector(camF, 80).sub(gP).normalize();
    dQ.setFromUnitVectors(gAx, dirW); dQ.slerpQuaternions(IDQ, dQ, 1 - mBlend);
    g.quaternion.copy(pQ.invert().multiply(dQ.multiply(gQ)));
    g.updateMatrixWorld(true);
  }
  function aimPoint(far) { camera.getWorldDirection(camF); const h = hooks.raycast(camera.position, camF, far); return h ? h.point.clone() : camera.position.clone().addScaledVector(camF, F.aimM); }
  function fire() {
    aimP.copy(aimPoint(F.range)); cur.holder.updateMatrixWorld(true); muzzlePoint(muzzleW);
    dirW.subVectors(aimP, muzzleW).normalize(); dirW.x += (Math.random() - 0.5) * 0.02; dirW.y += (Math.random() - 0.5) * 0.02; dirW.z += (Math.random() - 0.5) * 0.02; dirW.normalize();
    let r = rounds.find((x) => !x.on); if (!r) { r = rounds.reduce((a, b) => (a.travelled > b.travelled ? a : b)); }
    r.on = true; r.p.copy(muzzleW); r.d.copy(dirW); r.travelled = 0;
    stats.shots++; shake = Math.min(0.3, shake + 0.05); kickAmt = Math.min(0.6, kickAmt + 0.08);
    impulse(tmp.copy(dirW).multiplyScalar(-0.012));
    hooks.muzzle && hooks.muzzle(muzzleW);
    fx.muzzleLight(muzzleW); flashT = 0.045;
    ejR.set(1, 0, 0).applyQuaternion(qBody); ejU.set(0, 1, 0).applyQuaternion(qBody);
    fx.eject(tmp.copy(muzzleW).addScaledVector(dirW, -cur.barrelLen * 1.6), ejR, ejU, vel);
  }
  /* ---------- rockets: straight (inherits shooter velocity) or homing ---------- */
  function toggleRockets() { rocketMode = rocketMode === 'straight' ? 'homing' : 'straight'; emit(); }
  function fireRocket() {
    if (rocketCd > 0 || !active) return; rocketCd = 0.5;
    const aim = aimPoint(480);
    for (let n = 0; n < 2; n++) {
      side = -side;
      const r = rockets.find((x) => !x.on) || rockets.reduce((a, b) => (a.age > b.age ? a : b));
      const bone = cur.body.getObjectByName(side < 0 ? 'upperarml' : 'upperarmr') || cur.body; bone.getWorldPosition(r.p); r.p.y += 0.3 * height;
      r.d.subVectors(aim, r.p).normalize(); r.homing = rocketMode === 'homing';
      if (r.homing) { const rg = tmp2.crossVectors(r.d, THREE.Object3D.DEFAULT_UP).normalize(); r.d.addScaledVector(THREE.Object3D.DEFAULT_UP, 0.5).addScaledVector(rg, side * 0.4).normalize(); r.v = 26; }
      else r.v = 55;
      r.vel.copy(vel); r.aim.copy(aim); r.age = n * -0.07; r.trail = 0; r.on = true; stats.rockets++;
    }
    shake = Math.min(1.2, shake + 0.45); kickAmt = 1;
    camera.getWorldDirection(camF); impulse(tmp.copy(camF).setY(0).normalize().multiplyScalar(-1.4).add(tmp2.set(0, 0.6, 0)));
    emit();
  }
  const M4 = new THREE.Matrix4(), Q = new THREE.Quaternion(), S = new THREE.Vector3(), Z = new THREE.Vector3(0, 0, 1), rq = new THREE.Vector3(), step3 = new THREE.Vector3();
  function stepWeapons(dt) {
    rocketCd = Math.max(0, rocketCd - dt);
    let nr = 0;
    for (const r of rockets) {
      if (!r.on) continue;
      r.age += dt; if (r.age < 0) { r.p.addScaledVector(vel, dt); continue; }
      if (r.homing) { r.v = Math.min(115, r.v + 130 * dt); rq.subVectors(r.aim, r.p).normalize(); r.d.lerp(rq, 1 - Math.exp(-(r.age < 0.25 ? 2.5 : 7) * dt)).normalize(); step3.copy(r.d).multiplyScalar(r.v * dt); }
      else { r.v = Math.min(125, r.v + 95 * dt); step3.copy(r.d).multiplyScalar(r.v).addScaledVector(r.vel, Math.exp(-r.age * 2)).multiplyScalar(dt); }
      const len = step3.length(), dir = tmp.copy(step3).normalize();
      const h = hooks.raycast(r.p, dir, len);
      if (h) { hooks.rocket(h.point, dir.clone(), h); r.on = false; continue; }
      r.p.add(step3);
      if (r.age > 4.5) { hooks.rocket(r.p.clone(), dir.clone(), null); r.on = false; continue; }
      r.trail += dt; if (r.trail > 0.02) { r.trail = 0; hooks.trail(tmp2.copy(r.p).addScaledVector(dir, -0.7), true); }
      nr++;
    }
    stats.rocketsPeak = Math.max(stats.rocketsPeak, nr);
    let n = 0; for (const r of rockets) { if (!r.on || r.age < 0) continue; Q.setFromUnitVectors(Z, r.d); M4.compose(r.p, Q, S.set(1, 1, 1)); rkBody.setMatrixAt(n, M4); tmp.copy(r.p).addScaledVector(r.d, 0.62); M4.compose(tmp, Q, S); rkNose.setMatrixAt(n, M4); tmp.copy(r.p).addScaledVector(r.d, -0.62); M4.compose(tmp, Q, S.setScalar(0.45 + Math.random() * 0.3)); rkFlame.setMatrixAt(n, M4); fx.flare(tmp, tmp2.copy(r.d).negate(), 1.4 + Math.random() * 0.9, 0.55 + Math.random() * 0.2, 1); n++; }
    rkBody.count = rkNose.count = rkFlame.count = n; rkBody.instanceMatrix.needsUpdate = rkNose.instanceMatrix.needsUpdate = rkFlame.instanceMatrix.needsUpdate = true;
    let nb = 0;
    for (const r of rounds) {
      if (!r.on) continue;
      const st = F.tracer * dt, h = hooks.raycast(r.p, r.d, st);
      if (h) { stats.hits++; fx.impact(h.point, h.normal && h.normal.isVector3 ? h.normal : UPV, r.d, h.kind === 'terrain' ? 3 : 6); hooks.bullet(h, r.p.clone(), r.d.clone()); r.on = false; continue; }
      r.p.addScaledVector(r.d, st); r.travelled += st; if (r.travelled > F.range) { r.on = false; continue; }
      fx.tracer(r.p, r.d, Math.min(7.5, r.travelled + 0.5), 0.34 + Math.random() * 0.08, 1.2); fx.dot(r.p, 0.75, 0.85); nb++;
    }
    stats.roundsPeak = Math.max(stats.roundsPeak, nb);
  }

  /* ---------- per frame ---------- */
  const W = {};
  function tick(dt) {
    dt = clamp(dt, 0, 0.05); t += dt;
    fx.begin(dt);
    stepWeapons(dt);
    if (!active) { for (const a of Object.values(actors)) a.mixer.update(0); fx.end(); return; }
    // keyup never arrives once focus has left this document (other window, parent frame, Cmd-shortcut) → nothing may stay held
    if (!document.hasFocus() && !scriptDrive) { keys.clear(); fireLatch = false; mouse.l = mouse.r = false; }
    const K = (c) => (keys.has(c) ? 1 : 0);
    burst = Math.max(0, burst - dt);
    // weapons are hold-to-fire action keys (1 Minigun, 2 Rockets); in the combat camera LMB/RMB fire as well
    const gunKey = keys.has('Digit1') || (combat && mouse.l), rkKey = keys.has('Digit2') || (combat && mouse.r);
    trigger = scriptTrig || fireLatch || burst > 0 || gunKey;
    if (gunKey) weapon = 'gun';
    if (rkKey) { weapon = 'rocket'; fireRocket(); }
    noLand = Math.max(0, noLand - dt);
    // turning: A/D (and ←/→) turn the mech; with RMB held A/D strafe instead (WoW). Input is smoothed, not the result (tinyskies TURN_INPUT_SMOOTH 8).
    // The combat camera behaves like a held RMB (facing = camera, A/D strafe) without the buttons steering.
    const rmb = !combat && mouse.r, lmb = !combat && mouse.l, steerM = combat || rmb;
    const turnIn = (steerM ? 0 : K('KeyA') - K('KeyD')) + K('ArrowLeft') - K('ArrowRight');
    turnCmd += (clamp(turnIn, -1, 1) * F.turnRate - turnCmd) * (1 - Math.exp(-F.turnSmooth * dt));
    const dYaw = turnCmd * dt; face += dYaw; if (!lmb) look.yaw += dYaw;
    if (steerM) face = look.yaw;
    const fwdIn = clamp(K('KeyW') - K('KeyS') + (rmb && lmb ? 1 : 0), -1, 1);
    const strafeIn = clamp(K('KeyE') - K('KeyQ') + (steerM ? K('KeyD') - K('KeyA') : 0), -1, 1);
    if (trigger && !rmb && !lmb) face += shortest(look.yaw - face) * (1 - Math.exp(-F.faceToAim * dt));
    setHeading();
    smooth.slerp(heading, 1 - Math.exp(-40 * dt));
    fwd.set(-Math.sin(face), 0, -Math.cos(face)); right.set(Math.cos(face), 0, -Math.sin(face));
    const sprintK = keys.has('ShiftLeft') || keys.has('ShiftRight');
    const vy = K('ArrowUp') + K('PageUp') + K('Space') - K('ArrowDown') - K('PageDown');
    let boosting = false;
    if (mode === 'flight') {
      move.set(0, 0, 0).addScaledVector(fwd, fwdIn * (fwdIn < 0 ? F.back : 1)).addScaledVector(right, strafeIn);
      if (move.lengthSq() > 1) move.normalize();
      boosting = sprintK && (move.lengthSq() > 0 || vy !== 0);
      move.multiplyScalar(F.speed * (boosting ? F.boost : 1)); move.y = clamp(vy, -1, 1) * F.climb * (boosting ? 1.6 : 1);
      const dh = Math.exp(-F.response * dt), dv = Math.exp(-F.vResp * dt);
      vel.x = move.x + (vel.x - move.x) * dh; vel.z = move.z + (vel.z - move.z) * dh; vel.y = move.y + (vel.y - move.y) * dv;
      vel.add(imp); imp.set(0, 0, 0);
      pos.addScaledVector(vel, dt);
      const g = hooks.ground(pos.x, pos.z);
      if (pos.y < g + 0.3) { pos.y = g + 0.3; if (vel.y < 0) vel.y = 0; }
      pos.y = Math.min(pos.y, g + 260);
      // touching the ground ends the flight (terrain only; rooftops are on the backlog)
      if (hasLoco() && noLand <= 0 && vy <= 0 && pos.y <= g + 0.31) { mode = 'walk'; pos.y = g; vel.y = 0; landT = 0; emit(); }
    } else groundStep(dt, fwdIn, strafeIn, sprintK);
    // collisions: coarse building bounds, promoted cells
    const c = tmp.copy(pos).setY(pos.y + height * 0.5), push = hooks.collide(c, height * 0.55);
    if (mode !== 'flight') push.y = 0;
    if (push.lengthSq() > 0) { pos.add(push); const n = push.clone().normalize(), vn = vel.dot(n); if (vn < 0) vel.addScaledVector(n, -vn); }

    const level = Math.hypot(vel.x, vel.z), gr = mode !== 'flight';
    mBlend = clamp(mBlend + (gr && hasLoco() ? -1 : 1) * dt / 0.25, 0, 1);
    const turn = shortest(face + (gr ? yawOff : 0) - steer.yaw) * (1 - Math.exp(-(gr ? 10 : F.TURN) * dt)); steer.yaw += turn;
    const rate = dt > 0 ? turn / dt : 0, ease = 1 - Math.exp(-F.EASE * dt);
    if (gr) { steer.pitch += (-kickAmt * 0.04 - steer.pitch) * ease; steer.roll += (clamp(rate * level * 0.012, -0.12, 0.12) - steer.roll) * ease; }
    else {
      steer.pitch += (clamp(Math.atan2(vel.y, Math.max(level, 2)), -F.PITCH, F.PITCH) * 0.45 - kickAmt * 0.08 - steer.pitch) * ease;
      steer.roll += (clamp(rate * level * 0.05 - (vel.dot(right) / F.speed) * 0.25, -F.BANK, F.BANK) - steer.roll) * ease;
    }
    qBody.setFromEuler(euler.set(steer.pitch, steer.yaw, steer.roll, 'YXZ'));
    kickAmt *= Math.exp(-7 * dt);
    const bob = Math.sin(t * 2.1) * 0.09 * k * (1 - Math.min(1, level / F.speed)) * mBlend;
    for (const a of Object.values(actors)) { a.holder.position.copy(pos); a.holder.position.y += bob; a.holder.quaternion.copy(qBody); a.kick.position.set(0, 0, kickAmt * 0.12 * k); }

    const s = clamp(level / F.speed, 0, 1);
    boostAmt += ((boosting ? 1 : 0) - boostAmt) * (1 - Math.exp(-6 * dt)); aimAmt += ((trigger ? 1 : 0) - aimAmt) * (1 - Math.exp(-8 * dt));
    if (cur.kind === 'flight') {
      const cl = clamp(vel.y / (F.speed * 0.8), -1, 1), b = clamp(steer.roll / F.BANK, -1, 1);
      if (prevS > 0.6 && s < 0.25 && brakeT < 0) { brakeT = 0; cur.act.flight_brake_recover && cur.act.flight_brake_recover.reset().play(); }
      prevS = s * 0.1 + prevS * 0.9;
      let wb = 0; if (brakeT >= 0) { brakeT += dt; wb = Math.max(0, 1 - brakeT / 1.17) * 0.8; if (brakeT > 1.17) { brakeT = -1; cur.act.flight_brake_recover && cur.act.flight_brake_recover.stop(); } }
      const ov = { flight_boost: boostAmt * 0.9, flight_climb: Math.max(cl, 0) * 0.7, flight_dive: Math.max(-cl, 0) * 0.7, flight_bank_left: Math.max(b, 0) * 0.8, flight_bank_right: Math.max(-b, 0) * 0.8, flight_aim: aimAmt * 0.55, flight_brake_recover: wb };
      const sum = Object.values(ov).reduce((a, v) => a + v, 0), share = Math.min(0.9, sum);
      W.flight_idle_hover = (1 - s) * (1 - share); W.flight_cruise = s * (1 - share); for (const n in ov) W[n] = sum > 0 ? (ov[n] / sum) * share : 0;
      for (const n in W) if (cur.act[n]) cur.act[n].setEffectiveWeight(W[n] * mBlend);
    } else {
      for (const n of ['legs:Jump_Idle', 'torso:Running_HoldingRifle']) if (cur.act[n]) cur.act[n].setEffectiveWeight(mBlend);
      for (const { w, d } of cur.wings) w.rotation.y = w.userData.base + ((d + Math.sign(d) * (Math.sin(t * 7) * 3 + boostAmt * 10)) * mBlend * Math.PI) / 180;
    }
    stepLoco(dt, level);
    cur.mixer.update(dt);
    cur.holder.updateMatrixWorld(true);
    // sanity: in the flight pose the barrel must point roughly forward; flip a mis-detected axis once
    if (!cur.axisChecked && mode === 'flight' && mBlend >= 1) { cur.axisChecked = true; if (gunDir(gAx).dot(tmp.set(0, 0, -1).applyQuaternion(qBody)) < -0.3) cur.gunAxis.negate(); }
    aimGun();
    spin = clamp(spin + (trigger ? 1 : -0.6) * dt / F.spinUp, 0, 1); spinAngle += spin * spin * 40 * dt;
    for (const a of Object.values(actors)) if (a.barrel) a.barrel.rotation.z = spinAngle;
    if (trigger && spin > 0.7) { fireAcc += dt; while (fireAcc > 1 / F.fireRate) { fireAcc -= 1 / F.fireRate; fire(); } } else fireAcc = 0;
    const firing = trigger && spin > 0.7;
    flashT = Math.max(0, flashT - dt);
    muzzle.visible = firing && flashT > 0;
    if (muzzle.visible) {
      cur.holder.updateMatrixWorld(true); muzzlePoint(muzzle.position); const sc = (0.5 + Math.random() * 0.45) * k * 1.2; muzzle.scale.set(sc, sc, 1); muzzle.material.rotation = Math.random() * 6.3;
      const md = gunDir(tmp);
      fx.flare(muzzle.position, md, (0.55 + Math.random() * 0.55) * k * 1.4, (0.32 + Math.random() * 0.18) * k * 1.4, 1);
      fx.flare(muzzle.position, md, (0.25 + Math.random() * 0.2) * k * 1.4, (0.7 + Math.random() * 0.3) * k * 1.4, 0.7);
      fx.dot(muzzle.position, (0.9 + Math.random() * 0.6) * k * 1.4, 1);
    }
    heat = clamp(heat + (firing ? 0.32 : -0.22) * dt, 0, 1);
    for (const a of Object.values(actors)) for (const m of a.heat) m.emissive.setRGB(1, 0.32, 0.06).multiplyScalar(heat * heat * 2.2);
    if (!firing && heat > 0.18) { smokeAcc += dt; if (smokeAcc > 0.12 - heat * 0.05) { smokeAcc = 0; cur.holder.updateMatrixWorld(true); hooks.trail(muzzlePoint(tmp2), false); } }

    // spring arm: the boom keeps its direction in the camera frame and only shortens on occlusion, so the mech holds its screen position.
    // Hits closer than 0.3 m are ignored (the pivot can sit inside a building's coarse ray bounds).
    const pivot = tmp2.copy(pos).add(tmp.set(0, height * 0.62, 0));
    const arm = camArm.set(0.42 * height, (0.75 * height + 0.6) * Math.sqrt(zoom) * (0.6 + 0.4 * mBlend), (2.9 * height + 2.6) * zoom).applyQuaternion(smooth);
    // the coarse building bounds over-report by ~2 m, so the boom never collapses below 70 % (wall see-through is preferred to a camera on the shoulder)
    let armLen = arm.length(); arm.divideScalar(armLen); const armFull = armLen;
    const blk = hooks.raycast(pivot, arm, armLen + 0.5);
    if (blk && blk.t > 0.3) armLen = Math.max(0.7 * armFull, Math.min(armLen, blk.t - 0.5));
    const camT = pivot.clone().addScaledVector(arm, armLen);
    const gc = hooks.ground(camT.x, camT.z) + 0.8; if (camT.y < gc) camT.y = gc;
    // follow rigidly in the mech's frame (no positional lag → the mech can't slide out of view at speed); only the offset is smoothed
    camT.sub(pivot);
    if (!camOff.lengthSq()) camOff.copy(camT);
    camOff.lerp(camT, 1 - Math.exp(-(camT.lengthSq() < camOff.lengthSq() ? 30 : 8) * dt));
    camera.position.copy(pivot).add(camOff);
    camera.quaternion.copy(smooth);
    shake *= Math.exp(-10 * dt);
    const s2 = Math.max(shake, hooks.shake ? hooks.shake() : 0);
    if (s2 > 0.01) camera.position.add(tmp.set(Math.sin(t * 41) + Math.sin(t * 23.7) * 0.6, Math.sin(t * 37.3) + Math.sin(t * 19.1) * 0.6, 0).multiplyScalar(0.05 * s2 * k).applyQuaternion(smooth));
    fx.end();
    const now = performance.now(); if (now - lastEmit > 200) { lastEmit = now; emit(); }
  }

  /* ground: WASD picks a ladder role by input angle; strafe/back clips travel diagonally, so the body yaws by the difference */
  function groundStep(dt, fwdIn, strafeIn, sprintK) {
    const has = fwdIn !== 0 || strafeIn !== 0, ia = has ? Math.atan2(-strafeIn, fwdIn) : 0, A = Math.abs(ia), sg = Math.sign(ia) || 1;
    let off = 0, vT = 0; gait = 'idle';
    if (has) {
      if (A <= 0.61) { gait = walkOn ? 'walk' : sprintK ? 'sprint' : 'run'; off = ia; }
      else if (A <= 2.18) { gait = sg > 0 ? 'strafeL' : 'strafeR'; off = ia - sg * LOCO.strafeTravel; }
      else { gait = 'back'; off = ia - sg * Math.PI; }
      vT = LOCO.roles[gait][1] * cur.scale * F.gait;
    }
    yawOff += (off - yawOff) * (1 - Math.exp(-10 * dt));
    const ty = face + ia, dh = Math.exp(-(mode === 'air' ? F.airResp : F.walkResp) * dt);
    move.set(-Math.sin(ty) * vT, 0, -Math.cos(ty) * vT);
    vel.x = move.x + (vel.x - move.x) * dh + imp.x; vel.z = move.z + (vel.z - move.z) * dh + imp.z; imp.set(0, 0, 0);
    if (mode === 'air') {
      jumpT += dt;
      if (!launched && jumpT >= F.jumpDelay) { launched = true; vel.y = F.jumpV; }
      if (launched) vel.y -= F.G * dt;
      pos.addScaledVector(vel, dt);
      const g = hooks.ground(pos.x, pos.z);
      if (!launched) pos.y = g;
      else if (pos.y <= g && vel.y <= 0) { pos.y = g; vel.y = 0; mode = 'walk'; landT = 0; emit(); }
    } else { vel.y = 0; pos.x += vel.x * dt; pos.z += vel.z * dt; pos.y = hooks.ground(pos.x, pos.z); if (landT >= 0) landT += dt; }
  }
  /* role choice + weight fades from the ladder JSON; playback rate couples to ground speed */
  function stepLoco(dt, level) {
    const L = cur.loco; if (!L.act.idle) return;
    const dur = (r) => (L.act[r] ? L.act[r].getClip().duration : 0.5), sp = level / cur.scale;
    let role = L.cur, rate = 1;
    if (mode === 'air') role = jumpT < dur('jStart') - LOCO.jStartOff - 0.02 ? 'jStart' : 'jAir';
    else if (mode === 'walk') {
      if (landT >= 0 && landT < (gait === 'idle' ? dur('jLand') - LOCO.jLandOff - 0.05 : 0.22)) role = 'jLand';
      else {
        landT = -1;
        const fw = gait === 'idle' || gait === 'walk' || gait === 'run' || gait === 'sprint';
        if (sp < 0.25) role = 'idle';
        else if (!fw) role = gait;
        else role = gait === 'sprint' && sp > 3.55 ? 'sprint' : sp > 1.6 ? 'run' : 'walk';
        const nat = LOCO.roles[role][1]; if (nat > 0) rate = clamp(sp / nat, 0.6, role === 'walk' ? 1.35 : 1.25);
      }
    }
    if (role !== L.cur && L.act[role]) {
      const A = L.act[role], P = L.act[L.cur];
      L.fade = LOCO.fades[L.cur + '>' + role] ?? LOCO.fades['*>' + role] ?? 0.2;
      if (LOCO.sync.includes(L.cur) && LOCO.sync.includes(role)) A.time = (P.time / P.getClip().duration) * A.getClip().duration;
      else if (role === 'jStart') { A.reset(); A.time = LOCO.jStartOff; }
      else if (role === 'jLand') { A.reset(); A.time = LOCO.jLandOff; }
      else if (!LOCO.roles[role][2]) A.reset();
      L.cur = role;
    }
    let sum = 0;
    for (const r in L.act) { const on = r === L.cur; L.w[r] = clamp(L.w[r] + (on ? 1 : -1) * dt / L.fade, 0, 1); if (on) L.act[r].timeScale = rate; sum += L.w[r]; }
    for (const r in L.act) L.act[r].setEffectiveWeight((L.w[r] / (sum || 1)) * (1 - mBlend));
    if (L.rifle) { const A = L.act[L.cur], mv = LOCO.roles[L.cur][1] > 0; L.rifle.time = mv ? (A.time / A.getClip().duration) * L.rifle.getClip().duration : 0.25; L.rifle.setEffectiveWeight(1 - mBlend); }
  }

  /* scripted input for tests / bench (same code path as the mouse) */
  const script = {
    keys, mouse, set trigger(v) { scriptTrig = v; trigger = v; }, get trigger() { return trigger; },
    aim(yaw, pitch) { look.yaw = yaw; face = yaw; look.pitch = clamp(pitch, -F.pitchMax, F.pitchMax); setHeading(); smooth.copy(heading); },
    aimAt(p) { const d = tmp.copy(p).sub(camera.position); look.yaw = Math.atan2(-d.x, -d.z); face = look.yaw; look.pitch = Math.atan2(d.y, Math.hypot(d.x, d.z)); setHeading(); },
    press, set driving(v) { scriptDrive = !!v; },
    teleport(p, yaw = look.yaw) { pos.copy(p); vel.set(0, 0, 0); mode = 'flight'; mBlend = 1; noLand = 0.3; landT = -1; yawOff = 0; look.yaw = yaw; face = yaw; turnCmd = 0; camOff.set(0, 0, 0); setHeading(); smooth.copy(heading); steer.yaw = yaw; camera.position.copy(p).add(tmp.set(0, 3, 9).applyQuaternion(heading)); },
    rocket: () => { rocketCd = 0; fireRocket(); }
  };
  return {
    get active() { return active; }, get weapon() { return weapon; }, get mode() { return mode; }, get role() { return cur && cur.loco.cur; }, get combat() { return combat; },
    debug: () => ({ mode, role: cur && cur.loco.cur, gait, mBlend: +mBlend.toFixed(2), combat, bones: cur && cur.loco.bones, armed: !!(cur && cur.loco.rifle), gunAxis: cur && cur.gunAxis.toArray().map((v) => +v.toFixed(2)), gunAimDot: cur ? +gunDir(new THREE.Vector3()).dot(camera.getWorldDirection(new THREE.Vector3())).toFixed(3) : null, lookYaw: +look.yaw.toFixed(3), face: +face.toFixed(3), turnCmd: +turnCmd.toFixed(3), steerYaw: +steer.yaw.toFixed(3), mouse: { ...mouse }, keys: [...keys], locked, fallback }), get position() { return pos; }, get velocity() { return vel; }, get source() { return cur && cur.kind; }, get rocketMode() { return rocketMode; },
    actors, start, stop, tick, impulse, useSource, toggleRockets, fireRocket, stats, script, height,
    roundsActive: () => rounds.filter((r) => r.on).length, rocketsActive: () => rockets.filter((r) => r.on).length,
    dispose() {
      stop();
      document.removeEventListener('pointerlockchange', onLock); document.removeEventListener('pointerlockerror', onLockErr);
      document.removeEventListener('mousemove', onMove); canvas.removeEventListener('mousedown', onDown); window.removeEventListener('mouseup', onUp);
      canvas.removeEventListener('contextmenu', onCtx); canvas.removeEventListener('wheel', onWheel); window.removeEventListener('keydown', onKey); window.removeEventListener('keyup', onKey); window.removeEventListener('blur', onBlur); document.removeEventListener('visibilitychange', onVis);
    }
  };
}
