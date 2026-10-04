// Card-Hex Ascent · Integrator (the only file that wires owners together).
// START → PLAY → ASCEND → COMBAT → … → FINALE → RESULT → RESTART (no page reload).
import * as THREE from 'three';
import { createSkydome } from 'https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@e95f7291cae15f5f0d5f441a5ddd6fecc4e0243c/travel/travel-v16/terrain-v16/skydome-shader.js';
import { SupportGraph } from './support.mjs';
import { PlayerController, turnToward } from './player.mjs';
import { buildSupports, CARDS, INCREMENTS, cardDims } from './route.mjs';
import { Level } from './level.mjs';
import { loadSrc, loadGLTF, instanceSkinned, instanceStatic, cleanClip, nodeNames, PIN, SRC, loadLog } from './sources.mjs';
import { ActorAnimator } from './anim.mjs';
import { CombatDirector, WEAPONS } from './combat.mjs';
import { ConsequenceFx } from './fx.mjs';
import { AudioTransport } from './audio.mjs';
import { FollowCamera, Input } from './camera.mjs';
import { Hud } from './hud.mjs';
import { installHarness } from './harness.mjs';

export const BUILD = { id: 'card-hex-ascent', increment: new URLSearchParams(location.search).get('inc') || 'S1', version: '0.1.0' };
const INC = INCREMENTS[BUILD.increment] ? BUILD.increment : 'S1';
const SEED = +(new URLSearchParams(location.search).get('seed') || 20261004);
const MUSIC = { url: 'https://raw.githubusercontent.com/georg-doc/kayfabizarro/c7e7dd085528af10d2c00a7349f295cb7cfa4233/media/3D_Assets/Sounds/KFB%20RoadTrip%20JukeBox%20v2/Cartoon%20Chase%20_%20Capers%20Bed%203%20min.mp3',
  label: 'Cartoon Chase / Capers Bed', status: 'humanReview positive (jukebox.json PR #352)' };
const STORE = 'kfb.cardHexAscent.v1';

// ---------------------------------------------------------------- renderer / scene / camera
const stage = document.getElementById('stage');
const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
stage.append(renderer.domElement);
const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0xe9c99a, 60, 210);
const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 1200);
scene.add(new THREE.HemisphereLight(0xf5edda, 0x4a3a30, 1.05)); // lower than the lab: Hex palette textures clip at 1.9
const sun = new THREE.DirectionalLight(0xffefd1, 1.55); sun.position.set(-10, 22, -8); sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048); Object.assign(sun.shadow.camera, { left: -22, right: 22, top: 22, bottom: -22, near: 1, far: 90 }); sun.shadow.bias = -0.0005;
scene.add(sun, sun.target);
const fill = new THREE.DirectionalLight(0xaedbd5, 0.45); fill.position.set(8, 6, 10); scene.add(fill);
let sky = null; try { sky = createSkydome({ THREE, radius: 600 }); scene.add(sky.group); } catch (e) { console.warn('skydome', e); }
function resize() { const w = stage.clientWidth || innerWidth, h = stage.clientHeight || innerHeight; renderer.setSize(w, h, false); camera.aspect = w / Math.max(1, h); camera.updateProjectionMatrix(); }
addEventListener('resize', resize); resize();

const hud = new Hud(document.getElementById('hud'));
const input = new Input(renderer.domElement);
const follow = new FollowCamera(camera, renderer.domElement);
const audio = new AudioTransport({ musicUrl: MUSIC.url, musicLabel: MUSIC.label, musicStatus: MUSIC.status }); audio.listener = camera;
const fx = new ConsequenceFx(scene);
const graph = new SupportGraph(); buildSupports(graph, INC);
const level = new Level(scene, graph, INC, SEED);

const run = {
  state: 'BOOT', simT: 0, inc: INC, seed: SEED, time: 0, coins: 0, kos: 0, weapons: ['blaster'], weapon: 'blaster', checkpoint: 'card0', cleared: new Set(),
  zoneLabel: 'Card 0 · Spawn', objective: 'Shoot the practice die, then climb the Hex route', result: null, errors: [], degraded: [], fps: 0, frame: 0,
};
const timers = []; // simulation-time scheduler (deterministic under harness stepping)
function later(sec, fn) { timers.push({ at: run.simT + sec, fn }); }
let player, ctrl, playerActor, combat, clips, models = {}, coinTpl = null, dieTpl = null; const coins = []; const enemySpawns = [];

// ---------------------------------------------------------------- boot
async function boot() {
  try {
    hud.loading('loading KayKit actors, Blender-Duel ranged set, Hex families, Cards…');
    const [hero, soldier, mech, aBasic, aGeneral, aAdv, aRanged, blaster, rifle, minigun] = await Promise.all(
      ['hero', 'soldier', 'mech', 'animBasic', 'animGeneral', 'animAdvanced', 'animRanged', 'blaster', 'rifle', 'minigun'].map(loadSrc));
    models = { hero, soldier, mech, blaster, rifle, minigun };
    const names = nodeNames(hero.scene);
    clips = {};
    for (const [g, opt] of [[aBasic, {}], [aGeneral, {}], [aAdv, { zeroHipsXZ: true }], [aRanged, {}]])
      for (const c of g.animations) clips[c.name] = cleanClip(c, names, /^Dodge/.test(c.name) ? { zeroHipsXZ: true } : opt);
    dieTpl = await loadGLTF(PIN.duel, 'skills/chat/workflows/RESIDENT_GUNFIGHT_DUEL_01_BLENDER_2026-10-04/KFB_Die_Arena_KFB.glb').catch(e => { run.degraded.push('die: ' + e.message); return null; });
    coinTpl = await new (await import('three/addons/loaders/GLTFLoader.js')).GLTFLoader().loadAsync(new URL('../../assets/4a/Coin.glb', import.meta.url).href).catch(e => { run.degraded.push('coin: ' + e.message); return null; });
    await fx.boot().catch(e => run.degraded.push('fx: ' + e.message));
    await level.build(p => hud.loading('building Card-Hex route… ' + Math.round(p * 100) + '%'));
    if (level.errors.length) run.degraded.push(...level.errors.map(e => 'level: ' + e));
    combat = new CombatDirector({ scene, graph, fx, audio, seed: SEED });
    buildPlayer();
    buildEnemies();
    run.state = 'READY'; hud.ready(INC); hud.loading('ready · ' + INC + ' · seed ' + SEED);
    window.__ascent.ready = true; document.body.dataset.ready = '1';
  } catch (e) { run.state = 'BOOT_FAILED'; run.errors.push(String(e.stack || e)); hud.loading('boot failed: ' + e.message); console.error(e); }
}

function makeActor(model, weaponKey) {
  const root = new THREE.Group(); const body = instanceSkinned(model); root.add(body);
  body.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; o.frustumCulled = false; } });
  const weapon = weaponKey ? instanceStatic(models[weaponKey]) : null;
  weapon?.traverse(o => { if (o.isMesh) o.castShadow = true; });
  const anim = new ActorAnimator(body, clips, { weapon, weaponKind: weaponKey });
  scene.add(root); return { root, body, anim };
}
function buildPlayer() {
  const c0 = CARDS[0];
  const a = makeActor(models.hero, 'blaster'); playerActor = a;
  ctrl = new PlayerController(graph, { spawn: { x: c0.x, y: c0.top, z: c0.z - 1.5 }, yaw: 0 });
  player = combat.addActor({ id: 'player', team: 'player', root: a.root, anim: a.anim, weapon: 'blaster', hp: 8 });
  player.invulnerable = () => ctrl.dodgeT > 0.08;
  ctrl.obstacles = () => combat.actors.filter(a => a !== player && a.alive && a.root.visible).map(a => ({ x: a.root.position.x, z: a.root.position.z, y: a.root.position.y, r: a.kind === 'mech' ? 0.7 : 0.45 }));
  a.root.position.set(ctrl.pos.x, ctrl.pos.y, ctrl.pos.z);
  follow.yaw = Math.PI; follow.snap();
}
const ENCOUNTERS = {
  card0: [{ kind: 'die', dx: 1.7, dz: 2.6, hp: 2 }],
  card1: [{ kind: 'soldier', weapon: 'blaster', dx: 1.5, dz: 2.9, hp: 11, dodge: 0.35 }],
  card2: [{ kind: 'soldier', weapon: 'rifle', dx: -4.5, dz: 2.6, hp: 6, dodge: 0.25 }, { kind: 'soldier', weapon: 'rifle', dx: 4.0, dz: 3.0, hp: 6, dodge: 0.25 },
    { kind: 'soldier', weapon: 'rifle', perch: 'P2.0', hp: 4, dodge: 0 }],
  card3: [{ kind: 'mech', weapon: 'minigun', dx: 2, dz: 2.4, hp: 20, dodge: 0 }, { kind: 'soldier', weapon: 'blaster', dx: -4.5, dz: 1.2, hp: 6, dodge: 0.3 }],
};
function buildEnemies() {
  let i = 0;
  for (const c of CARDS) {
    if (!INCREMENTS[INC].cards.includes(c.id)) continue;
    for (const e of ENCOUNTERS[c.id] ?? []) {
      const sup = e.perch ? graph.get(e.perch) : graph.get(c.id);
      const pos = e.perch ? new THREE.Vector3(sup.x, sup.top, sup.z) : new THREE.Vector3(c.x + e.dx, c.top, c.z + e.dz);
      let a;
      if (e.kind === 'die') {
        const root = new THREE.Group(); if (dieTpl) { const d = instanceStatic(dieTpl); d.scale.setScalar(2.2); d.position.y = 0.35; d.traverse(o => { if (o.isMesh) o.castShadow = true; }); root.add(d); }
        scene.add(root); a = { root, anim: dummyAnim(), body: root };
      } else a = makeActor(models[e.kind], e.weapon);
      a.root.position.copy(pos); a.root.rotation.y = Math.PI; // face the approaching player (−Z)
      const actor = combat.addActor({ id: `${c.id}-${e.kind}-${i++}`, team: 'enemy', root: a.root, anim: a.anim, weapon: e.kind === 'die' ? null : e.weapon, hp: e.hp, card: c.id, support: sup });
      actor.dodgeChance = e.dodge ?? 0; actor.kind = e.kind; actor.spawn = { pos: pos.clone(), hp: e.hp }; actor.body = a.body;
      enemySpawns.push(actor);
    }
  }
}
function dummyAnim() { return { play() { return null; }, stop() {}, isPlaying() { return false; }, progress() { return 0; }, muzzleWorld() { return false; }, update() {}, actions: new Map(), clips: {} }; }

// ---------------------------------------------------------------- start / restart / result
function start() {
  if (run.state !== 'READY') return;
  hud.hideStart(); run.state = 'PLAY'; audio.unlock().catch(e => run.degraded.push('audio: ' + e.message));
  lockPointer();
  hud.message('Card 0 · shoot the practice die (click / F), then jump to the Hex route', 3.5);
}
function restart() {
  timers.length = 0;
  for (const c of coins) scene.remove(c.mesh); coins.length = 0;
  combat.reset(); fx.clear(); for (const k of Object.keys(fx.counts)) fx.counts[k] = 0; audio.counts = {};
  for (const a of enemySpawns) if (a.kind === 'die') a.root.children[0]?.rotation.set(0, 0, 0);
  const c0 = CARDS[0]; ctrl.reset({ x: c0.x, y: c0.top, z: c0.z - 1.5 }, 0); ctrl.stats = { jumps: 0, assisted: 0, doubles: 0, longs: 0, landings: 0, rescues: 0 };
  player.hp = player.maxHp; player.alive = true; player.hitT = 0; player.anim.stop(null, 0.05);
  ctrl.seal = null; run.time = 0; run.coins = 0; run.kos = 0; run.weapons = ['blaster']; setWeapon('blaster'); run.checkpoint = 'card0'; run.cleared = new Set(); run.result = null; run.finishing = false;
  run.zoneLabel = 'Card 0 · Spawn'; run.objective = 'Shoot the practice die, then climb the Hex route';
  hud.hideResult(); run.state = 'PLAY'; follow.yaw = Math.PI; follow.snap(); run.restarts = (run.restarts || 0) + 1;
  hud.message('Restart · seed ' + SEED, 1.5);
}
function finish() {
  run.state = 'RESULT';
  const L = combat.ledgerTotals, acc = L.shots ? Math.round(100 * L.hits / Math.max(1, L.shots)) : 0;
  const t = Math.floor(run.time);
  run.result = { increment: INC, seed: SEED, seconds: +run.time.toFixed(1), coins: run.coins, defeats: L.defeats, shots: L.shots, hits: L.hits, accuracy: acc, dodges: L.dodges, playerHits: L.playerHits, kos: run.kos, ...ctrl.stats, completedAt: new Date().toISOString() };
  const key = run.harness ? STORE + '.harness' : STORE; // harness-driven runs never overwrite the human record
  try { const prev = JSON.parse(localStorage.getItem(key) || '{}'); const best = prev.best && prev.best.seconds < run.result.seconds ? prev.best : run.result;
    localStorage.setItem(key, JSON.stringify({ seed: SEED, checkpoint: run.checkpoint, completion: INC, last: run.result, best, runs: (prev.runs || 0) + 1 })); } catch (e) { run.degraded.push('storage'); }
  hud.result([['Time', Math.floor(t / 60) + ':' + String(t % 60).padStart(2, '0')], ['Coins', run.coins], ['Enemies defeated', L.defeats], ['Shots / hits', `${L.shots} / ${L.hits} (${acc} %)`],
    ['Dodges (you / enemies)', `${L.dodges} / ${L.enemyDodges || 0}`], ['Jumps (assisted / double / long)', `${ctrl.stats.jumps} (${ctrl.stats.assisted} / ${ctrl.stats.doubles} / ${ctrl.stats.longs})`], ['Rescues', ctrl.stats.rescues], ['Knock-outs', run.kos]],
    INC === 'S3' ? 'Card-Hex Ascent complete' : `Increment ${INC} complete`);
  document.exitPointerLock?.();
}
// result after the reward has landed (coins magnet to the player), at most 3.5 s
function finishWhenRewarded(waited = 0) { later(0.5, () => { if (run.state !== 'PLAY') return; if (coins.length && waited < 3.0) finishWhenRewarded(waited + 0.5); else finish(); }); }
function setWeapon(w) {
  if (!run.weapons.includes(w)) return; run.weapon = w; player.weapon = w;
  const wr = instanceStatic(models[w]); wr.traverse(o => { if (o.isMesh) o.castShadow = true; }); player.anim.mountWeapon(wr, w);
}

// ---------------------------------------------------------------- per-frame
let lastT = performance.now(), fpsAcc = 0, fpsN = 0;
function targetFor() {
  // soft lock: alive enemy closest to the camera-forward ray within 40°, else nearest in the active encounter
  const f = follow.forward(); let best = null, bs = 1e9;
  for (const e of combat.actors) {
    if (e.team !== 'enemy' || !e.alive) continue;
    if (!e.active && e.card !== ctrl.support?.card) continue; // only the current Card's targets (no cross-map sniping)
    const dx = e.root.position.x - ctrl.pos.x, dz = e.root.position.z - ctrl.pos.z, d = Math.hypot(dx, dz); if (d > 32) continue;
    const ang = Math.acos(Math.max(-1, Math.min(1, (dx * f.x + dz * f.z) / (d || 1))));
    const s = ang < 0.7 ? ang * 10 + d * 0.1 : (e.active ? 20 + d : 1e9);
    if (s < bs) { bs = s; best = e; }
  }
  return best;
}
function tick() {
  requestAnimationFrame(tick);
  const now = performance.now(); let dt = Math.min(1 / 30, (now - lastT) / 1000); lastT = now;
  if (window.__ascent.fixedDt) dt = window.__ascent.fixedDt;
  fpsAcc += dt; fpsN++; if (fpsAcc > 0.5) { run.fps = +(fpsN / fpsAcc).toFixed(1); fpsAcc = 0; fpsN = 0; }
  step(dt);
  renderer.render(scene, camera);
  run.drawCalls = renderer.info.render.calls; run.triangles = renderer.info.render.triangles; run.frame++;
}
function step(dt) {
  run.simT += dt;
  for (let i = timers.length - 1; i >= 0; i--) if (timers[i].at <= run.simT) { const t = timers.splice(i, 1)[0]; try { t.fn(); } catch (e) { run.errors.push(String(e)); } }
  const inp = input.read();
  if (inp.restart && combat && (run.state === 'PLAY' || run.state === 'RESULT')) restart();
  if (inp.music) audio.toggleMusic();
  if (run.state === 'PLAY' && ctrl) {
    run.time += dt;
    if (inp.mode) { ctrl.mode = ctrl.mode === 'chill' ? 'game' : 'chill'; hud.message(ctrl.mode === 'chill' ? 'Chill & Fun assist ON' : 'Game mode · no assist', 1.6); }
    if (inp.weapon1) setWeapon('blaster'); if (inp.weapon2) { if (run.weapons.includes('rifle')) setWeapon('rifle'); else hud.message('Rifle unlocks after the Blaster Duel', 1.6); }
    // ---- combat input (movement → aim → fire → movement recovery)
    const W = WEAPONS[player.weapon];
    const shooting = player.anim.isPlaying(W.shoot) && player.anim.progress(W.shoot) < 0.7;
    const raising = player.queued != null;
    if ((inp.fire || inp.fireEdge) && player.alive && player.hitT <= 0) {
      const tgt = targetFor() ?? aimPoint();
      if (combat.requestFire(player, tgt) && player.queued) player.queued.target = tgt;
    }
    player.aimButton = inp.aim;
    if (inp.aim && !player.anim.isPlaying(W.aim) && !shooting) player.anim.play(W.aim, { mode: 'clamp', fade: 0.12, from: W.aimFrom * clips[W.aim].duration, timeScale: 1.6 });
    ctrl.locked = !player.alive || shooting || raising || player.hitT > 0;
    if (player.wantYaw != null && (shooting || raising || inp.aim)) ctrl.face(player.wantYaw, 16 * dt);
    // ---- movement owner
    const intent = follow.intent(inp.x, inp.z);
    ctrl.update(dt, { x: intent.x, z: intent.z, sprint: inp.sprint, walk: inp.walk, jump: inp.jump, dodge: inp.dodge }, run.time);
    if (ctrl.speed > 0.6 && player.anim.isPlaying(W.aim) && !shooting && !raising && !inp.aim) player.anim.stop(W.aim, 0.2);
    for (const e of ctrl.drainEvents()) onPlayerEvent(e);
    level.showTarget(ctrl.mode === 'chill' ? ctrl.preview : null, run.time);
    playerActor.root.position.set(ctrl.pos.x, ctrl.pos.y, ctrl.pos.z); playerActor.root.rotation.y = ctrl.yaw;
    // ---- combat owner
    combat.update(dt, player);
    for (const e of combat.drainEvents()) onCombatEvent(e);
    tickCoins(dt);
    tickDead(dt);
  }
  // ---- presentation
  if (playerActor) playerActor.anim.update(dt, ctrl.grounded ? horizSpeed() : 0);
  if (combat) for (const a of combat.actors) if (a !== player && a.anim.update) a.anim.update(dt, a.moveSpeed ?? 0);
  if (ctrl) follow.update(dt, ctrl.pos);
  if (sky) { sky.follow(camera); sky.update(dt); }
  if (ctrl) { sun.position.set(ctrl.pos.x - 10, ctrl.pos.y + 22, ctrl.pos.z - 8); sun.target.position.set(ctrl.pos.x, ctrl.pos.y, ctrl.pos.z); }
  fx.step(dt, camera); audio.step(dt);
  if (ctrl && combat) hud.update(dt, { zoneLabel: run.zoneLabel, objective: run.objective, hp: player.hp, maxHp: player.maxHp, weaponLabel: WEAPONS[player.weapon].label, weapons: run.weapons.length,
    coins: run.coins, time: run.time, mode: ctrl.mode, inEncounter: !!(combat.encounter && !combat.encounter.cleared), locked: !!targetFor() });
  input.endFrame();
}
function horizSpeed() { return ctrl.locked ? 0 : Math.hypot(ctrl.vel.x, ctrl.vel.z); }
function aimPoint() { const f = follow.forward(); return new THREE.Vector3(ctrl.pos.x + f.x * 20, ctrl.pos.y + 1.2, ctrl.pos.z + f.z * 20); }

// traversal semantic state → native KayKit jump chain presentation
function onPlayerEvent(e) {
  const A = player.anim;
  switch (e.type) {
    case 'anticipate': A.play('Jump_Start', { mode: 'once', fade: 0.06, from: 0.12, timeScale: 1.7 }); break;
    case 'takeoff': audio.play('locomotion.jump', { at: playerActor.root.position }); if (!A.isPlaying('Jump_Start')) A.play('Jump_Start', { mode: 'once', fade: 0.05, from: 0.2, timeScale: 1.8 });
      later(0.16, () => { if (!ctrl.grounded) A.play('Jump_Idle', { mode: 'loop', fade: 0.18 }); }); break;
    case 'leaveEdge': A.play('Jump_Idle', { mode: 'loop', fade: 0.2 }); break;
    case 'double': A.play('Jump_Start', { mode: 'once', fade: 0.05, from: 0.25, timeScale: 2.2 }); audio.play('locomotion.jump', { at: playerActor.root.position });
      later(0.14, () => { if (!ctrl.grounded) A.play('Jump_Idle', { mode: 'loop', fade: 0.15 }); }); break;
    case 'land': {
      A.play('Jump_Land', { mode: 'once', fade: 0.06, timeScale: 1.25 });
      later(0.26, () => { if (ctrl.grounded && ctrl.speed > 0.8) A.stop('Jump_Land', 0.15); });
      audio.play('locomotion.land', { at: playerActor.root.position }); fx.land(new THREE.Vector3(ctrl.pos.x, ctrl.pos.y + 0.05, ctrl.pos.z), e.jump?.kind === 'double' ? 1.3 : 1);
      onSupport(e.support); break;
    }
    case 'dodge': { const f = { x: Math.sin(ctrl.yaw), z: Math.cos(ctrl.yaw) }; const dot = f.x * e.dir.x + f.z * e.dir.z, cr = f.x * e.dir.z - f.z * e.dir.x;
      A.play(dot > 0.5 ? 'Dodge_Forward' : dot < -0.5 ? 'Dodge_Backward' : cr > 0 ? 'Dodge_Right' : 'Dodge_Left', { mode: 'once', fade: 0.05 }); break; }
    case 'rescueStart': hud.message('Rescue · back to the last safe platform', 1.4); break;
    case 'needsRunUp': hud.message('Too far from a standstill · take a run-up for the long jump', 1.6); break;
    case 'sealed': hud.message('Finish the Card fight first', 1.2); break;
    case 'rescued': A.stop(null, 0.1); follow.snap(); break;
  }
}
function onSupport(id) {
  const s = graph.get(id); if (!s) return;
  if (s.card) {
    const c = CARDS.find(k => k.id === s.card); run.zoneLabel = c.label; run.checkpoint = c.id;
    const armed = combat.enemiesOf(c.id).some(e => e.alive && e.weapon);
    if (c.id === INCREMENTS[INC].finale && !armed && run.state === 'PLAY' && !run.finishing) { run.cleared.add(c.id); run.finishing = true; finishWhenRewarded(); } // never a dead end on the finale card
    if (c.id !== 'card0' && c.id !== 'card1' && INC !== 'S1' && !run.weapons.includes('rifle')) { run.weapons.push('rifle'); hud.message('Rifle unlocked (press 2)', 2.5); } // fallback if the duel was skipped in Game mode
    if (!run.cleared.has(c.id) && armed) {
      combat.startEncounter(c.id); ctrl.seal = c.id;
      run.objective = { card1: 'Win the Blaster duel', card2: 'Clear the Rifle squad (one is up on the pillar)', card3: 'Take down the Minigun mech' }[c.id] ?? 'Clear the Card';
      hud.message(c.label + ' · fight!', 2);
    }
    else if (c.id === 'card0') run.objective = 'Shoot the practice die, then climb the Hex route';
    else run.objective = 'Card clear · continue upward';
  } else {
    const z = { A: 'Hex Zone A · Medieval Hexagon', B: 'Hex Zone B · Medieval Builder', C: 'Hex Zone C · Snow Biome' }[s.zone];
    if (z) { run.zoneLabel = z; run.objective = 'Climb · Space jumps to the highlighted target (again in air = double)'; }
  }
}
function onCombatEvent(e) {
  switch (e.type) {
    case 'defeat': {
      const t = combat.actors.find(a => a.id === e.target);
      if (t) { const card = graph.get(t.card); let at = t.root.position.clone();
        if (card && !graph.contains(card, at.x, at.z, 0.5)) { const lp = graph.landingPoint(card, at.x, at.z, 1.2); at = new THREE.Vector3(lp.x, card.top, lp.z); } // perch reward lands on the Card
        spawnCoin(at.add(new THREE.Vector3(0, 0.9, 0)), t.kind === 'mech' ? 5 : 1); }
      if (t?.kind === 'die') { run.objective = 'Practice done · jump to the Hex route ahead'; hud.message('Nice shot · the Hex route is ahead', 2); }
      break;
    }
    case 'encounterClear': {
      run.cleared.add(e.card); if (ctrl.seal === e.card) ctrl.seal = null;
      player.hp = player.maxHp; // refill after a won Card
      if (e.card === 'card1' && !run.weapons.includes('rifle') && INC !== 'S1') { run.weapons.push('rifle'); hud.message('Blaster Duel won · Rifle unlocked (press 2)', 3); }
      else hud.message('Card clear!', 2);
      run.objective = 'Card clear · continue upward';
      if (e.card === INCREMENTS[INC].finale && !run.finishing) { run.finishing = true; finishWhenRewarded(); }
      break;
    }
    case 'playerHit': player.anim.play('kfb_reaction_hit_front_small_a', { mode: 'once', fade: 0.05 }); break;
    case 'playerDown': run.kos++; hud.message('Knocked out · back to ' + run.checkpoint, 2); player.downAt = run.time; break;
  }
}
function tickDead(dt) {
  if (!player.alive && player.downAt != null && run.time - player.downAt > 1.8) {
    const c = CARDS.find(k => k.id === run.checkpoint); ctrl.reset({ x: c.x, y: c.top, z: c.z - cardDims(c).hd + 1.2 }, 0);
    player.alive = true; player.hp = player.maxHp; player.downAt = null; player.anim.stop(null, 0.1); follow.snap();
  }
}
function spawnCoin(pos, value) {
  if (!coinTpl) { run.coins += value; return; }
  const m = instanceStatic(coinTpl); m.scale.setScalar(1.4); m.position.copy(pos); scene.add(m); coins.push({ mesh: m, value, t: 0 });
}
function tickCoins(dt) {
  for (const c of coins) {
    c.t += dt; c.mesh.rotation.y += dt * 3; c.mesh.position.y += Math.sin(c.t * 4) * dt * 0.2;
    const tp = new THREE.Vector3(ctrl.pos.x, ctrl.pos.y + 0.9, ctrl.pos.z); let d = c.mesh.position.distanceTo(tp);
    if (c.t > 0.6 && d < 9) { c.mesh.position.lerp(tp, 1 - Math.exp(-dt * 6)); d = c.mesh.position.distanceTo(tp); } // reward magnet
    if (d < 1.5 || c.t > 12) { if (d < 1.5) { run.coins += c.value; fx.reward(c.mesh.position); audio.play('pickup.coin', { at: c.mesh.position }); combat.ledgerTotals.rewards++; combat.emit('reward', { value: c.value }); } c.dead = true; scene.remove(c.mesh); }
  }
  for (let i = coins.length - 1; i >= 0; i--) if (coins[i].dead) coins.splice(i, 1);
}

// ---------------------------------------------------------------- wiring
document.getElementById('hz-go').addEventListener('click', start);
document.getElementById('hz-again').addEventListener('click', () => { restart(); lockPointer(); });
renderer.domElement.addEventListener('click', () => { if (run.state === 'PLAY' && document.pointerLockElement !== renderer.domElement) lockPointer(); });
function lockPointer() { try { const p = renderer.domElement.requestPointerLock?.(); p?.catch?.(() => {}); } catch (e) { /* harness / iframe without gesture */ } }
// Deterministic stepping for the harness (rAF pauses in hidden tabs).
function advance(seconds, dt = 1 / 60) { const n = Math.round(seconds / dt); for (let i = 0; i < n; i++) step(dt); renderer.render(scene, camera); run.drawCalls = renderer.info.render.calls; run.triangles = renderer.info.render.triangles; return n; }
window.__ascent = { ready: false };
installHarness({ THREE, run, get ctrl() { return ctrl; }, get player() { return player; }, get combat() { return combat; }, graph, level, fx, audio, follow, input, camera, renderer, scene, start, restart, finish, step, advance, BUILD, INC, SEED, PIN, SRC, loadLog, CARDS, setWeapon, targetFor });
boot(); requestAnimationFrame(tick);
