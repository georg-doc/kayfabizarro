/* KFB Free Roam · Platformer Hub POC v0 — Einstieg.
   Ein Renderer, ein Loop, ein Bewegungs-Besitzer, ein Aktor-Mixer. */
import * as THREE from 'three';
import { buildWorld } from './world.js';
import { Player } from './physics.js';
import { CameraRig } from './camera-rig.js';
import { candidates, arcPoints } from './assist.js';
import { mountActor, flatRoster } from './actors.js';
import { Hud } from './hud.js';
import { Fx, Sfx } from './fx.js';
import { loadLog } from './sources.js';
import { textureFolds } from './loader.js';

const NS = 'kfb.free-roam.platformer-poc.v0';
const save = (k, v) => { try { localStorage.setItem(NS + '.' + k, JSON.stringify(v)); } catch (e) { /* privater Modus */ } };
const load = (k, d) => { try { const v = localStorage.getItem(NS + '.' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } };

const json = (p) => fetch(p).then((r) => { if (!r.ok) throw new Error(p + ' → ' + r.status); return r.json(); });

boot().catch((e) => {
  console.error(e);
  document.getElementById('hud').innerHTML =
    `<div class="fatal"><b>Boot failed</b><span>${e.message}</span></div>`;
});

async function boot() {
  const canvas = document.getElementById('view');
  const hudRoot = document.getElementById('hud');

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x9ec7d8);
  const camera = new THREE.PerspectiveCamera(46, 1, 0.1, 4000);

  const hemi = new THREE.HemisphereLight(0xdff0ff, 0x6b6250, 1.35);
  const sun = new THREE.DirectionalLight(0xfff2dc, 2.1);
  sun.position.set(-18, 26, 14);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.bias = -0.0008;
  scene.add(hemi, sun, sun.target);

  const hudOpts = {};
  const hud = new Hud(hudRoot, hudOpts);

  hud.setLoading('reading pack index and level data…');
  const [packIndex, level, portals, roster] = await Promise.all([
    json('data/pack-index.json'), json('data/level.json'), json('data/hub-portals.json'), json('data/actors.json')
  ]);

  hud.setLoading('building the island from GitHub source refs…');
  const world = await buildWorld(scene, level, packIndex, portals);
  const cell = world.cell;
  scene.fog = new THREE.Fog(0x9ec7d8, 40 * cell, 120 * cell);

  const player = new Player(world, level.tuning);
  player.height = 1.05 * cell;
  const spawn = world.byId.get(level.spawn.platform);
  player.spawnAt(spawn, level.spawn.offset);

  const rig = new CameraRig(camera, canvas, cell);
  rig.dist = load('cam.dist', 7 * cell);
  rig.pitch = load('cam.pitch', 0.42);
  rig.yaw = player.yaw + Math.PI;

  const fx = new Fx(scene, cell);
  const sfx = new Sfx();

  const state = {
    mode: load('mode', 'chill'),
    preset: load('preset', 'KFB_TRAVEL'),
    assist: load('assist', 'on'),
    rate: 1,
    actorId: load('actor', 'platformer-character'),
    collected: new Set(load('collected', [])),
    best: null, alts: [], actor: null, busy: false, fps: 0
  };

  for (const pk of world.pickups) if (state.collected.has(pk.id)) { pk.taken = true; pk.node.visible = false; }

  const list = flatRoster(roster);
  const actorCtx = {
    scene, camera, cell, height: player.height,
    pins: roster.pins, animLib: roster.animLib,
    sets: ['MovementBasic', 'MovementAdvanced', 'General']
  };

  async function selectActor(def) {
    if (state.busy) return;
    state.busy = true;
    hud.setLoading(`mounting ${def.name}…`);
    hud.loading.classList.remove('gone');
    try {
      const next = await mountActor(def, actorCtx);
      if (state.actor) state.actor.dispose();          // genau ein Aktor lebt
      state.actor = next;
      state.actorId = def.id;
      save('actor', def.id);
      hud.setActors(list, def.id, selectActor);
      hud.setClips(next.clipNames, '');
    } catch (e) {
      console.error('actor mount failed', def.id, e);
      hud.setLoading(`could not mount ${def.name}: ${e.message}`);
      await new Promise((r) => setTimeout(r, 2200));
    }
    hud.loading.classList.add('gone');
    state.busy = false;
  }

  Object.assign(hudOpts, {
    getMode: () => state.mode,
    onMode(m) {
      state.mode = m; save('mode', m);
      hud.setMode(m);
      player.assist = null;
      state.best = null;
      fx.showTarget(null);
    },
    onManualClip(n) { state.actor?.setManual(n); },
    onRate(v) { state.rate = v; if (state.actor?.pres) state.actor.pres.rate = v; },
    onPreset(p) { state.preset = p; save('preset', p); },
    onAssist(a) { state.assist = a; save('assist', a); }
  });
  hud.setMode(state.mode);
  hud.preset.value = state.preset;
  hud.assistSel.value = state.assist;
  hud.setActors(list, state.actorId, selectActor);

  await selectActor(list.find((a) => a.id === state.actorId) || list[0]);
  hud.setLoading(false);

  /* ---------- Eingabe ---------- */
  const keys = new Set();
  const isTyping = (e) => /input|select|textarea/i.test(e.target.tagName);
  addEventListener('keydown', (e) => {
    if (isTyping(e)) return;
    const k = e.key.toLowerCase();
    if (k === ' ') { e.preventDefault(); player.requestJump(); }
    if (k === 'f') rig.recenter(player);
    if (k === 'r') player.rescue('manual');
    if (k === 'g') player.playEmote('wave');
    if (k === 'l') hud.toggle(hud.lab, hud.actorPanel);
    if (k === 'enter') enterPortal();
    if (k === 'm') hudOpts.onMode(state.mode === 'chill' ? 'game' : 'chill');
    keys.add(k);
    if (e.ctrlKey) keys.add('control');
  });
  addEventListener('keyup', (e) => { keys.delete(e.key.toLowerCase()); if (!e.ctrlKey) keys.delete('control'); });
  addEventListener('blur', () => keys.clear());
  canvas.addEventListener('pointerdown', () => sfx.ensure());

  function enterPortal() {
    const p = player.ground;
    if (!p?.portal) return;
    player.events.push({ type: 'portal', id: p.portal.id });
    window.open(p.portal.url, '_blank', 'noopener');
  }

  /* ---------- Sprungplanung: der einzige Unterschied zwischen den Modi ---------- */
  function planJump() {
    if (state.mode !== 'chill' || state.assist === 'off') return { kind: 'manual' };
    const cands = candidates(player, world);
    const best = cands[0];
    if (!best || best.score < 0.28) return { kind: 'manual' };
    return { kind: 'assisted', v0: best.plan.v0.clone(), time: best.plan.time, target: best.platform.id };
  }

  /* ---------- Loop ---------- */
  const clock = new THREE.Clock();
  let acc = 0, frames = 0;

  function frame() {
    requestAnimationFrame(frame);
    const dt = Math.min(0.05, clock.getDelta());
    const t = clock.elapsedTime;

    resize();

    const fwd = (keys.has('w') ? 1 : 0) - (keys.has('s') ? 1 : 0);
    const turnKey = (keys.has('a') ? 1 : 0) - (keys.has('d') ? 1 : 0);
    const strafeKey = (keys.has('e') ? 1 : 0) - (keys.has('q') ? 1 : 0);
    player.input = {
      fwd,
      turn: state.preset === 'KFB_TRAVEL' ? -turnKey : 0,
      strafe: state.preset === 'KFB_TRAVEL' ? strafeKey : strafeKey - turnKey,
      run: keys.has('shift'),
      duck: keys.has('control') || keys.has('c')
    };

    player.useLastSafe = state.mode === 'chill';
    player.update(dt, { mode: state.mode, preset: state.preset, cameraYaw: rig.forwardYaw, planJump });

    /* Ziel-Hervorhebung nur im Chill-Modus und nur am Boden — ein Ring mitten im Flug
       behauptet eine Wahl, die es nicht mehr gibt. */
    if (state.mode === 'chill' && state.assist !== 'off' && player.grounded) {
      const c = candidates(player, world);
      state.best = c[0] || null;
      state.alts = c.slice(1, 3);
      fx.showTarget(state.best, state.alts, state.best ? arcPoints(player, state.best.plan) : null);
    } else {
      state.best = null; state.alts = [];
      fx.showTarget(null);
    }

    for (const e of player.events) {
      sfx.event(e);
      if (e.type === 'land' || e.type === 'bounce') fx.puff(player.pos);
      if (e.type === 'pickup') {
        const pk = world.pickups.find((p) => p.id === e.id);
        if (pk) { fx.sparkle(pk.pos); state.collected.add(pk.id); save('collected', [...state.collected]); }
      }
      if (e.type === 'rescue') fx.puff(player.pos);
    }
    player.events.length = 0;

    /* Flow Hop: nach der Landung das nächste plausible Ziel vorschlagen — vorschlagen,
       nicht springen. Autoplay wäre kein Spiel. */
    if (state.assist === 'flow' && state.best && player.grounded && player.state === 'IDLE' && player.stateTime > 1.1) {
      fx.showTarget(state.best, state.alts, arcPoints(player, state.best.plan));
    }

    state.actor?.apply(player, actorCtx);
    state.actor?.update(dt, { ...actorCtx, camera }, player);

    rig.update(dt, player);
    world.update(t);
    fx.update(dt, camera);

    sun.position.set(player.pos.x - 18 * cell, player.pos.y + 26 * cell, player.pos.z + 14 * cell);
    sun.target.position.copy(player.pos);
    const span = 22 * cell;
    Object.assign(sun.shadow.camera, { left: -span, right: span, top: span, bottom: -span, near: 1, far: 90 * cell });
    sun.shadow.camera.updateProjectionMatrix();

    hud.placeLabels(world, camera, canvas);
    const onPortal = player.grounded && player.ground?.portal ? player.ground.portal : null;
    hud.setPrompt(onPortal);

    frames++; acc += dt;
    if (acc > 0.35) { state.fps = Math.round(frames / acc); frames = 0; acc = 0; updateLab(); }

    renderer.render(scene, camera);
  }

  function updateLab() {
    const info = state.actor?.info?.() || {};
    const coins = world.pickups.filter((p) => p.taken).length;
    hud.setScore(state.mode === 'game'
      ? `<b>${coins}</b>/${world.pickups.length} pickups · checkpoint <b>${player.checkpoint?.id || '—'}</b> · falls ${player.stats.falls}`
      : `<b>${coins}</b>/${world.pickups.length} pickups · jumps ${player.stats.jumps} (${player.stats.assisted} assisted)`);
    if (hud.lab.classList.contains('hidden')) return;
    const loaded = [...loadLog.values()];
    hud.setLab([
      ['Actor', `${state.actor?.def.name || '—'}`],
      ['Adapter', info.mode || '—'],
      ['Semantic state', player.state],
      ['Actual clip', info.clip || '—'],
      ['Track binding', info.bound != null ? `${Math.round(info.bound * 100)} % avg` : 'n/a'],
      ['Scale fit', info.fit ? `measured ${info.fit.measured} → ×${info.fit.scale}` : '—'],
      ['Horizontal speed', `${player.speed.toFixed(2)} u/s (run ${player.t.run.toFixed(1)})`],
      ['Grounded', player.grounded ? `yes · ${player.ground?.id}` : 'airborne'],
      ['Assist target', player.assist ? player.assist.target : state.best ? `${state.best.platform.id} (score ${state.best.score.toFixed(2)})` : '—'],
      ['Target parts', state.best ? `align ${state.best.parts.align} · dist ${state.best.parts.dist} · drop ${state.best.parts.drop}` : '—'],
      ['Mode', state.mode === 'chill' ? `Chill (${state.assist})` : 'KFB Game'],
      ['Cell size (measured)', `${cell.toFixed(3)} u`],
      ['Sources loaded', `${loaded.filter((l) => l.ok).length} ok · ${loaded.filter((l) => !l.ok).length} failed`],
      ['Texture folds', `${textureFolds.seen} → ${textureFolds.unique}`],
      ['FPS', String(state.fps)],
      ['Notes', (state.actor?.notes || []).join('<br>') || '—']
    ]);
  }

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (canvas.width !== w * renderer.getPixelRatio() || canvas.height !== h * renderer.getPixelRatio()) {
      renderer.setSize(w, h, false);
      camera.aspect = w / Math.max(1, h);
      camera.updateProjectionMatrix();
    }
  }

  addEventListener('beforeunload', () => { save('cam.dist', rig.dist); save('cam.pitch', rig.pitch); });

  /* Für Tests und Belege greifbar — kein verstecktes Innenleben. */
  window.KFB_POC = { world, player, rig, state, fx, hud, loadLog, textureFolds, level, roster, candidates, arcPoints };

  frame();
}
