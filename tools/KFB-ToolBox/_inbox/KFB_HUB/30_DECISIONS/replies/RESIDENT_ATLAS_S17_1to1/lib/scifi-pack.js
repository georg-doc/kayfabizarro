/* KFB · RESIDENT-SCIFI-01 · Quaternius Ultimate Space Kit (Kandidat, S12)
   Vier Familien als Residents, je drei Träger: Astronaut (43 Knochen, 18 Clips), Mech (13 Knochen,
   17 Clips, keine Arme im Skelett), Raumschiff (statisch, 0 Clips). EIN Träger je Figur besitzt Ort,
   Kurs und Höhe; der Modus bestimmt nur Aussehen und Clip. Schrittlängen aus MEASURED (modefamily.js,
   gemessen 2026-09-19) — die Clips stehen auf der Stelle, das Tempo kommt vom Träger.
   Bühne: Raumstation (Base_Large + Connector + GeodesicDome, zwei Außenmodule), Alienbäume, Felsen,
   Planeten. Requisiten im Pack-Maßstab 1; die ganze Welt wird auf figureH skaliert. */
import * as THREE from 'three';
import { loadAsset, instance } from './atlas.js';
import { MEASURED } from './modefamily.js';

export const SCHEMA = 'kfb.resident-scifi-module/1';
const D2R = Math.PI / 180;
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const smooth = (x) => { x = clamp(x, 0, 1); return x * x * (3 - 2 * x); };
const f3 = (x) => +x.toFixed(3);
const wrap = (a) => Math.atan2(Math.sin(a), Math.cos(a));
const lerpA = (a, b, t) => a + wrap(b - a) * t;

export const MODES = [['astronaut', 'Astronaut'], ['mech', 'Mech'], ['spaceship', 'Raumschiff']];
export const ACTIONS = [
  ['idle', 'Stehen'], ['walk', 'Rundgang · gehen'], ['run', 'Rundgang · rennen'], ['wave', 'Winken'],
  ['cheer', 'Jubeln'], ['dance', 'Tanzen'], ['jump', 'Springen'], ['no', 'Kopfschütteln'], ['hit', 'Schlag / Kick']
];
/* Rollen → Clipname je Träger. Astronaut hat kein Dance → Yes (steht so im Snapshot). */
const ROLES = {
  astronaut: { idle: 'Idle', walk: 'Walk', run: 'Run', wave: 'Wave', cheer: 'Yes', dance: 'Yes', jump: 'Jump', no: 'No', hit: 'Punch' },
  mech: { idle: 'Idle', walk: 'Walk', run: 'Run', wave: 'Hello', cheer: 'Yes', dance: 'Dance', jump: 'Jump', no: 'No', hit: 'Kick' }
};
const SPEED = {
  astronaut: { walk: MEASURED.astronaut.stride.walk.groundSpeed, run: MEASURED.astronaut.stride.run.groundSpeed },
  mech: { walk: MEASURED.mech.stride.walk.groundSpeed, run: MEASURED.mech.stride.run.groundSpeed }
};

export async function createScifiPack({ V, def, figureH = 2.3, onProgress, onEvent = () => {} }) {
  if (!def || def.schema !== SCHEMA) throw new Error('scifi schema mismatch');
  const PK = def.pack, C = PK.commit, P0 = PK.root;
  const envPath = (n) => P0 + 'Environment/GLTF/' + n + '.gltf';
  const sceneryNames = [...new Set([...def.station, ...def.trees, ...def.rocks, ...def.sky].map((r) => r.name))];
  const castPaths = def.cast.flatMap((c) => [c.astronaut, c.mech, c.spaceship].map((p) => P0 + p));
  const all = [...castPaths, ...sceneryNames.map(envPath)];
  let done = 0;
  const models = new Map(), fails = [];
  const pool = async (items, n, fn) => { let i = 0; await Promise.all(Array.from({ length: n }, async () => { while (i < items.length) await fn(items[i++]); })); };
  await pool(all, 6, async (path) => {
    try {
      const g = await loadAsset(path, C);
      const box = new THREE.Box3().setFromObject(g.scene), size = box.getSize(new THREE.Vector3());
      let tris = 0; g.scene.traverse((o) => { if (o.isMesh) { const gi = o.geometry; tris += (gi.index ? gi.index.count : gi.attributes.position.count) / 3; } });
      models.set(path, { path, name: path.split('/').pop().replace('.gltf', ''), box, size, tris, clips: g.animations.map((a) => a.name), anims: g.animations });
    } catch (e) { fails.push({ path, why: e.message }); }
    onProgress && onProgress(++done, all.length, path.split('/').pop());
  });

  /* ---------- Welt ---------- */
  const k = figureH / MEASURED.astronaut.height;
  const world = new THREE.Group(); world.name = 'resident-module:' + def.id; world.scale.setScalar(k);
  const ground = new THREE.Group(); ground.name = 'outpost';
  const stage = new THREE.Group(); stage.name = 'residents';
  const skyG = new THREE.Group(); skyG.name = 'sky-planets';
  world.add(ground, stage, skyG);
  const nodes = new Map(), placed = [], missing = [];
  let seq = 0;
  async function put(r, layer, parent) {
    const path = envPath(r.name), m = models.get(path);
    if (!m) { missing.push(r.name); return null; }
    const n = await instance(path, C);
    const g = new THREE.Group(); g.name = 'sf.' + layer + '.' + r.name + '.' + (seq++);
    g.add(n);
    g.position.set(r.p[0], r.p.length === 3 ? r.p[1] : 0, r.p.length === 3 ? r.p[2] : r.p[1]);
    g.rotation.y = (r.ry || 0) * D2R;
    if (r.s) g.scale.setScalar(r.s);
    g.userData.entry = { id: g.name, scope: 'requisite', kind: 'prop', role: (r.role || r.name) + ' · Quaternius Space Kit', a: path, layer };
    parent.add(g); nodes.set(g.name, g);
    placed.push({ id: g.name, name: r.name, layer, p: r.p.map(f3), ry: r.ry || 0, s: r.s || 1, size: m.size.toArray().map(f3), node: g });
    return g;
  }
  for (const r of def.station) await put(r, 'hab', ground);
  for (const r of def.trees) await put(r, 'tree', ground);
  for (const r of def.rocks) await put(r, 'deco', ground);
  for (const r of def.sky) await put(r, 'sky', skyG);
  const planets = placed.filter((r) => r.layer === 'sky');

  /* ---------- Residents ---------- */
  const L = def.loop, O = def.orbit;
  const ell = (th) => new THREE.Vector3(L.c[0] + L.rx * Math.cos(th), 0, L.c[1] + L.rz * Math.sin(th));
  const ellD = (th) => Math.hypot(L.rx * Math.sin(th), L.rz * Math.cos(th));
  /* Vorwärts ist +Z (modefamily: PoleTarget-vs-Knie, drei Leser). rotation.y = atan2(dx, dz). */
  const headOf = (dx, dz) => Math.atan2(dx, dz);
  const perf = [];
  for (const [i, c] of def.cast.entries()) {
    const anchor = new THREE.Group(); anchor.name = 'sf.resident.' + c.id;
    anchor.userData.entry = { id: anchor.name, scope: 'requisite', kind: 'performer', performer: c.id, role: 'Resident · ' + c.label, a: P0 + c.astronaut };
    stage.add(anchor); nodes.set(anchor.name, anchor);
    const vis = {};
    for (const mode of ['astronaut', 'mech']) {
      const m = models.get(P0 + c[mode]);
      if (!m) { vis[mode] = null; continue; }
      const root = await instance(P0 + c[mode], C);
      root.name = mode + '.' + c.id;
      root.traverse((o) => { if (o.isMesh) o.frustumCulled = false; if (o.isMesh && /pistol/i.test(o.name)) o.visible = false; });
      const mixer = new THREE.AnimationMixer(root), actions = new Map();
      for (const a of m.anims) actions.set(a.name, mixer.clipAction(a));
      vis[mode] = { root, mixer, actions, clip: null, path: m.path, clips: m.clips };
      anchor.add(root);
    }
    const ms = models.get(P0 + c.spaceship);
    if (ms) {
      const inner = await instance(P0 + c.spaceship, C);
      const root = new THREE.Group(); root.name = 'spaceship.' + c.id;
      const lift = -ms.box.min.y + 0.05;
      inner.position.y = lift; root.add(inner);
      vis.spaceship = { root, inner, lift, path: ms.path, size: ms.size.toArray().map(f3) };
      anchor.add(root);
    } else vis.spaceship = null;
    for (const m in vis) if (vis[m]) vis[m].root.visible = m === 'astronaut';
    const th = (c.theta ?? 90) * D2R, p0 = ell(th);
    const outward = headOf(p0.x - L.c[0], p0.z - L.c[1]);
    perf.push({ id: c.id, label: c.label, def: c, i, anchor, vis, mode: 'astronaut', swap: null, air: 0, delay: 0,
      theta: th, theta0: th, head: outward, orbit: 0, r: O.r0 + O.dr * i, alt: O.alt0 + O.dalt * i, airPos: new THREE.Vector3(), airHead: 0, playing: null });
  }

  /* ---------- Zustand ---------- */
  const T = { mode: 'astronaut', action: 'idle', playing: true, time: 0, dirty: true };
  const listeners = new Set();
  const changed = () => { for (const f of listeners) f(); };
  let savedBg = null;
  const gp = new THREE.Vector3();

  function play(P, role) {
    const v = P.vis[P.mode];
    if (!v || !v.actions) return;
    const name = ROLES[P.mode][role] || 'Idle';
    if (v.clip === name) return;
    const next = v.actions.get(name) || v.actions.get('Idle');
    const prev = v.clip && v.actions.get(v.clip);
    next.reset().setEffectiveWeight(1).play();
    if (prev && prev !== next) prev.crossFadeTo(next, 0.25, false);
    v.clip = name;
  }
  function squash(root, s, sy) { root.scale.set(s, sy, s); }

  function step(dt) {
    const run = T.action === 'run', tour = T.action === 'walk' || run;
    for (const P of perf) {
      /* 1 · Modus: Schiff landet zuerst, dann Tausch; sonst Tausch, dann Start */
      if (P.mode !== T.mode && !P.swap) {
        if (P.mode === 'spaceship' && P.air > 0) {
          const was = P.air; P.air = Math.max(0, P.air - dt / O.climb);
          if (was > 0 && P.air === 0) onEvent('landing', P.anchor.getWorldPosition(gp));
        } else if (P.delay > 0) P.delay -= dt;
        else P.swap = { t: 0, to: T.mode, from: P.mode };
      }
      if (P.swap) {
        const OUT = 0.2, IN = 0.42, s = P.swap;
        s.t += dt;
        const old = P.vis[s.from], neu = P.vis[s.to];
        if (s.t < OUT) { const e = s.t / OUT; if (old) squash(old.root, 1 + 0.25 * e - 1.2 * e * e, 1 - 0.95 * e); }
        else {
          if (P.mode !== s.to) {
            if (old) { old.root.visible = false; squash(old.root, 1, 1); if (old.clip) { old.actions.get(old.clip).stop(); old.clip = null; } }
            if (neu) neu.root.visible = true;
            P.mode = s.to;
            onEvent('landing', P.anchor.getWorldPosition(gp));
          }
          const e = clamp((s.t - OUT) / IN, 0, 1), el = 1 - Math.pow(1 - e, 3) * Math.cos(e * 7.5) * (1 - e * 0.3);
          if (neu) squash(neu.root, clamp(el, 0.02, 1.4), clamp(1 + (el - 1) * 1.6, 0.02, 1.6));
          if (s.t >= OUT + IN) { if (neu) squash(neu.root, 1, 1); P.swap = null; if (P.mode === 'spaceship') { const w = P.anchor.position; P.orbit = Math.atan2(w.z - O.c[1], w.x - O.c[0]); onEvent('boost', P.anchor.getWorldPosition(gp)); } }
        }
      }
      if (P.mode === 'spaceship' && T.mode === 'spaceship' && !P.swap) P.air = Math.min(1, P.air + dt / O.climb);

      /* 2 · Boden: Rundgang auf der Ellipse, Tempo = gemessenes Clip-Tempo des Trägers */
      const walker = P.mode !== 'spaceship';
      const moving = walker && tour && !P.swap && P.air === 0;
      if (moving) P.theta += (SPEED[P.mode][run ? 'run' : 'walk'] * dt) / ellD(P.theta);
      const g = ell(P.theta);
      const tgt = moving ? headOf(-L.rx * Math.sin(P.theta), L.rz * Math.cos(P.theta)) : headOf(g.x - L.c[0], g.z - L.c[1]);
      P.head = lerpA(P.head, tgt, 1 - Math.exp(-dt * (moving ? 10 : 3.5)));

      /* 3 · Luft: je Schiff eigener Radius und eigene Höhe, gleiches Bahntempo */
      if (P.air > 0 || P.mode === 'spaceship') P.orbit += (O.v * dt) / P.r;
      const bob = Math.sin(T.time * 1.7 + P.i * 1.3) * 0.35;
      P.airPos.set(O.c[0] + P.r * Math.cos(P.orbit), P.alt + bob, O.c[1] + P.r * Math.sin(P.orbit));
      P.airHead = headOf(-Math.sin(P.orbit), Math.cos(P.orbit));
      const e = smooth(P.air);
      P.anchor.position.lerpVectors(g, P.airPos, e);
      P.anchor.rotation.set(0, lerpA(P.head, P.airHead, e), 0);
      if (P.vis.spaceship) {
        const sr = P.vis.spaceship.root;
        sr.rotation.z = -O.bank * e + Math.sin(T.time * 2.3 + P.i) * 0.04 * e;
        sr.rotation.x = -0.18 * Math.sin(Math.PI * e) * (T.mode === 'spaceship' ? 1 : -1);
      }
      P.anchor.userData.groundable = walker && !P.swap && e === 0;
      P.anchor.userData.baseY = P.anchor.position.y;

      /* 4 · Clip */
      if (walker) play(P, moving ? (run ? 'run' : 'walk') : tour ? 'idle' : T.action);
      const v = P.vis[P.mode];
      if (v && v.mixer) v.mixer.update(dt);
    }
  }

  function snapshotPerf() {
    return perf.map((P) => ({ id: P.id, label: P.label, mode: P.mode, clip: P.vis[P.mode] && P.vis[P.mode].clip, air: f3(P.air), swapping: !!P.swap,
      pos: P.anchor.position.toArray().map(f3), astronaut: P.vis.astronaut && P.vis.astronaut.path, mech: P.vis.mech && P.vis.mech.path, spaceship: P.vis.spaceship && P.vis.spaceship.path,
      clips: { astronaut: P.vis.astronaut ? P.vis.astronaut.clips.length : 0, mech: P.vis.mech ? P.vis.mech.clips.length : 0 }, ship: P.vis.spaceship ? P.vis.spaceship.size : null }));
  }

  step(0);
  return {
    def, world, nodes, perf, k,
    get playing() { return T.playing; },
    get mode() { return T.mode; },
    get action() { return T.action; },
    onChange(f) { listeners.add(f); },
    attach() { savedBg = V.scene.background; V.scene.background = new THREE.Color(0x1b1430); V.scene.add(world); step(0); },
    detach() { V.scene.remove(world); if (savedBg !== null) V.scene.background = savedBg; },
    post(dt) { dt = Math.min(dt || 0, 0.1); if (!T.playing) dt = 0; T.time += dt; step(dt); for (const r of planets) r.node.rotation.y += dt * 0.08; },
    toggle() { T.playing = !T.playing; changed(); },
    play() { T.playing = true; changed(); },
    pause() { T.playing = false; changed(); },
    seekFrac() {},
    now() { return { time: T.time, dur: 0, playing: T.playing, mode: T.mode, action: T.action }; },
    setMode(m) {
      if (!MODES.some(([x]) => x === m) || m === T.mode) return;
      T.mode = m; for (const P of perf) P.delay = P.i * 0.18; if (!T.playing) T.playing = true; changed();
    },
    setAction(a) { if (!ACTIONS.some(([x]) => x === a)) return; T.action = a; changed(); },
    home() { for (const P of perf) P.theta = P.theta0; T.action = 'idle'; step(0); changed(); },
    view(kind) {
      if (kind === 'top') V.frame(world, [0, 1, 0.02], 0.9);
      else if (T.mode === 'spaceship') V.frame(world, [0.3, 0.42, 1], 0.95);
      else V.frame(ground, [0.35, 0.5, 1], 0.78);
    },
    setLayers(on) {
      stage.visible = on.actor !== false;
      for (const r of placed) r.node.visible = r.layer === 'hab' ? on.hab !== false : r.layer === 'sky' ? on.opt !== false : on.prop !== false;
    },
    performerOf(o) { while (o) { if (o.userData && o.userData.entry && o.userData.entry.performer) return o.userData.entry.performer; o = o.parent; } return null; },
    snapshot() {
      return {
        mode: T.mode, action: T.action, playing: T.playing, k: f3(k), files: all.length, models: models.size, fails, missing,
        placed: placed.length, layers: placed.reduce((a, r) => ((a[r.layer] = (a[r.layer] || 0) + 1), a), {}),
        perf: snapshotPerf(),
        sizes: [...models.values()].filter((m) => !/Characters/.test(m.path)).map((m) => ({ name: m.name, size: m.size.toArray().map(f3), tris: m.tris | 0 })),
        roles: ROLES, speed: SPEED
      };
    },
    moduleDoc() {
      const s = this.snapshot();
      return { schema: SCHEMA, id: def.id, status: def.status, pack: { id: PK.id, root: PK.root, commit: PK.commit, handoff: PK.handoff, files: s.files, loaded: s.models, fails: s.fails },
        measured: { k: s.k, figureH, astronautH: MEASURED.astronaut.height, mechH: MEASURED.mech.height, speed: SPEED, sizes: s.sizes },
        loop: def.loop, orbit: def.orbit, roles: ROLES,
        placements: placed.map((r) => ({ name: r.name, layer: r.layer, p: r.p, ry: r.ry, s: r.s })), cast: s.perf };
    }
  };
}
