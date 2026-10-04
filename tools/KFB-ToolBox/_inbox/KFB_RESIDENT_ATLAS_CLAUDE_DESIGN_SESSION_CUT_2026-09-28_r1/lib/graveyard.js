/* KFB · RESIDENT-GRAVEYARD-01 · Dancing Skeletons (Kandidat, S11)
   Friedhofs-Diorama aus KayKit Halloween Bits (63 Modelle, ein Pin), vier KayKit-Skelette,
   EINE Uhr. Pro Phrase: Tanztakte, dann eine Lücke — die Skelette zerfallen (Death-Clip),
   Knochen aus dem Pack fliegen weg, und zum Taktanfang setzen sie sich wieder zusammen.
   · Tanz: KFB Motion Library Rig_Medium (gepinnt), Zeit je Bild GESETZT (scrubbar).
   · Zerfall: KayKit Rig_Medium Death_A/B. Zusammensetzen: derselbe Clip rückwärts (Standard)
     oder Spawn_Ground.
   · Taumeln: stepWalker() aus resident-collide.js — Skelette wandern in einer Tanzzone,
     prallen an Requisiten und aneinander ab, Neigung aus dem Stoß.
   · Layout in Einheiten der GEMESSENEN Skeletthöhe H; Requisiten im Pack-Maßstab 1. */
import * as THREE from 'three';
import { PropertyBinding } from 'three';
import { loadAsset, instance, loadClips } from './atlas.js';
import { makeWalker, stepWalker, rng } from './resident-collide.js';

export const SCHEMA = 'kfb.resident-graveyard-module/1';
const D2R = Math.PI / 180;
const mod = (a, n) => ((a % n) + n) % n;
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const smooth = (x) => { x = clamp(x, 0, 1); return x * x * (3 - 2 * x); };
const f3 = (x) => +x.toFixed(3);
const HAB = /^(floor|fence|path|tree|crypt|arch)/;

export async function createGraveyard({ V, def, onProgress }) {
  if (!def || def.schema !== SCHEMA) throw new Error('graveyard schema mismatch');
  const PK = def.pack;
  const total = (PK.glb || []).length + PK.gltf.length + def.cast.length + 3;
  let done = 0;
  const prog = (x) => onProgress && onProgress(++done, total, x);
  const pool = async (items, n, fn) => { let i = 0; await Promise.all(Array.from({ length: n }, async () => { while (i < items.length) await fn(items[i++]); })); };

  /* ---------- Pack laden und messen ---------- */
  const list = [
    ...(PK.glb || []).map((n) => ({ name: n, fmt: 'glb', path: PK.root + 'Assets/glb/' + n + '.glb' })),
    ...PK.gltf.map((n) => ({ name: n, fmt: 'gltf', path: PK.root + 'Assets/gltf/' + n + '.gltf' }))
  ];
  const models = new Map(), fails = [];
  /* Erst EIN Modell allein: parallel gestartete Lader teilen sich sonst die noch nicht geladene
     Atlas-Textur, und die ersten acht Modelle blieben schwarz (S11-Befund). */
  const warm = list.splice(0, 1);
  const loadOne = async (m) => {
    try {
      const g = await loadAsset(m.path, PK.commit);
      m.box = new THREE.Box3().setFromObject(g.scene);
      m.size = m.box.getSize(new THREE.Vector3());
      let tris = 0, meshes = 0;
      g.scene.traverse((o) => { if (o.isMesh) { meshes++; const gi = o.geometry; tris += (gi.index ? gi.index.count : gi.attributes.position.count) / 3; } });
      m.tris = tris; m.meshes = meshes;
      models.set(m.name + '@' + m.fmt, m);
    } catch (e) { fails.push({ name: m.name, fmt: m.fmt, why: e.message }); }
    prog(m.name);
  };
  for (const m of warm) await loadOne(m);
  await pool(list, 8, loadOne);
  list.unshift(...warm);
  let goodMap = null, repaired = 0;
  for (const m of models.values()) (await loadAsset(m.path, PK.commit)).scene.traverse((o) => { if (!goodMap && o.isMesh && o.material.map && o.material.map.image) goodMap = o.material.map; });
  for (const m of models.values()) (await loadAsset(m.path, PK.commit)).scene.traverse((o) => { if (o.isMesh && o.material.map && !o.material.map.image && goodMap) { o.material.map = goodMap; o.material.needsUpdate = true; repaired++; } });
  const get = (n) => models.get(n + '@gltf') || models.get(n + '@glb') || null;
  const dupA = models.get('gravemarker_A@glb'), dupB = models.get('gravemarker_A@gltf');
  const duplicate = dupA && dupB ? { glb: dupA.size.toArray().map(f3), gltf: dupB.size.toArray().map(f3), same: dupA.size.distanceTo(dupB.size) < 1e-4 && dupA.tris === dupB.tris, trisGlb: dupA.tris, trisGltf: dupB.tris } : null;

  /* ---------- Clips ---------- */
  const ML = def.motionLibrary;
  const mlg = await loadAsset(ML.root + ML.file, ML.commit);
  const dances = new Map(mlg.animations.map((c) => [c.name, c]));
  prog('motion library');
  const shared = await loadClips('Rig_Medium');
  const byName = (n) => (shared.find((c) => c.name === n) || {}).clip || null;
  const deathA = byName(def.collapse.clip), deathB = byName(def.collapse.alt), spawn = byName('Spawn_Ground');
  if (!deathA) throw new Error('Death-Clip ' + def.collapse.clip + ' fehlt in der geteilten Bibliothek');
  prog('death clips');

  /* ---------- Welt ---------- */
  const world = new THREE.Group(); world.name = 'resident-module:' + def.id;
  const diorama = new THREE.Group(); diorama.name = 'diorama';
  const stage = new THREE.Group(); stage.name = 'dancers';
  const debrisG = new THREE.Group(); debrisG.name = 'debris';
  const inventory = new THREE.Group(); inventory.name = 'inventory'; inventory.visible = false;
  world.add(diorama, stage, debrisG, inventory);
  const nodes = new Map();
  const shadow = (o) => o.traverse((x) => { if (x.isMesh) { x.castShadow = true; x.receiveShadow = true; } });

  /* ---------- Skelette ---------- */
  const perf = [];
  let H = 0;
  for (const [i, c] of def.cast.entries()) {
    let actor;
    try { actor = await instance(c.path, PK.commit); }
    catch (e) { fails.push({ name: c.id, fmt: 'cast', why: e.message }); prog(c.id); if (c.optional) continue; throw e; }
    actor.name = 'actor.' + c.id;
    shadow(actor);
    if (!H) H = new THREE.Box3().setFromObject(actor).getSize(new THREE.Vector3()).y;
    const anchor = new THREE.Group(); anchor.name = 'anchor.' + c.id;
    const push = new THREE.Group(); push.name = 'push.' + c.id;
    push.add(actor); anchor.add(push); stage.add(anchor);
    anchor.userData.entry = { id: anchor.name, scope: 'requisite', kind: 'performer', performer: c.id, role: 'Tänzer · ' + c.label, a: c.path };
    nodes.set(anchor.name, anchor);
    const bones = new Map(); actor.traverse((o) => { if (o.isBone) bones.set(o.name, o); });
    const mixer = new THREE.AnimationMixer(actor);
    const bindOf = (clip) => { let b = 0; for (const t of clip.tracks) if (PropertyBinding.findNode(actor, PropertyBinding.parseTrackName(t.name).nodeName)) b++; return { bound: b, of: clip.tracks.length }; };
    const P = { id: c.id, i, def: c, label: c.label, anchor, push, actor, bones, mixer, actions: new Map(), bindOf, bind: {}, death: (i % 2 && deathB) ? deathB : deathA, offset: [0, 0.5, 0.25, 0.75][i % 4], heading: c.heading || 0, faced: c.heading || 0, walker: null, debris: [] };
    P.act = (clip) => { if (!P.actions.has(clip)) { const a = mixer.clipAction(clip); a.play(); a.timeScale = 0; a.setEffectiveWeight(0); P.actions.set(clip, a); } return P.actions.get(clip); };
    P.bind.death = bindOf(P.death);
    perf.push(P);
    prog(c.id);
  }
  if (!perf.length) throw new Error('kein Skelett geladen');
  if (!(H > 0.2)) H = 2.3;

  /* ---------- Diorama · gemessen, in Einheiten von H ---------- */
  const placed = [], obstacles = [], missing = new Set(), standIns = new Map(), reserved = [], solids = [], collisions = [], gates = [];
  const R = rng(1031);
  /* Ersatz nur innerhalb des Packs und nur für Kleinteile; Architektur bekommt einen reservierten Platz */
  const FALLBACK = { grave_A: 'gravestone', grave_B: 'gravemarker_B', grave_A_destroyed: 'gravestone', gravemarker_A: 'gravemarker_B', bone_A: 'skull', bone_B: 'skull', bone_C: 'ribcage', coffin: 'shrine', fence_pillar: 'pillar', fence_pillar_broken: 'post', fence_broken: 'post', fence: 'post' };
  const RESERVE = { crypt: [0.95, 0.75, 0.8], bench_decorated: [0.75, 0.35, 0.3], coffin_decorated: [0.35, 0.22, 0.8], arch_gate: [0.2, 0.9, 0.9], fence_gate: [0.12, 0.45, 0.6] };
  function reserve(name, x, z, ry, dimsH) {
    const [w, h, d] = dimsH.map((k) => k * H);
    const g = new THREE.Group(); g.name = 'reserved.' + name + '.' + reserved.length;
    const box = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), new THREE.MeshBasicMaterial({ color: 0xf0b37e, transparent: true, opacity: 0.08, depthWrite: false }));
    box.position.y = h / 2;
    const edges = new THREE.LineSegments(new THREE.EdgesGeometry(box.geometry), new THREE.LineBasicMaterial({ color: 0xf0b37e }));
    edges.position.y = h / 2;
    const cv = document.createElement('canvas'); cv.width = 512; cv.height = 128;
    const cx = cv.getContext('2d'); cx.fillStyle = '#f0b37e'; cx.font = '600 44px ui-monospace,monospace'; cx.textAlign = 'center'; cx.fillText(name, 256, 56); cx.font = '32px ui-monospace,monospace'; cx.fillText('reserviert · glb defekt', 256, 104);
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(cv), transparent: true, depthTest: false })); sp.raycast = () => {};
    const sw = Math.min(1.2 * H, Math.max(0.8 * H, w * 0.9)); sp.scale.set(sw, sw / 4, 1); sp.position.y = h + sw / 8 + 0.05 * H; sp.renderOrder = 6;
    g.add(box, edges, sp); g.position.set(x, 0, z); g.rotation.y = ry * D2R;
    g.userData.entry = { id: g.name, scope: 'requisite', kind: 'prop', role: 'Reservierter Platz · ' + name + ' (Datei in PR #279 defekt)', a: PK.root + 'Assets/glb/' + name + '.glb', layer: 'hab' };
    diorama.add(g); nodes.set(g.name, g);
    reserved.push({ name, p: [f3(x), f3(z)], ry: f3(ry), dims: [w, h, d].map(f3) });
    placed.push({ id: g.name, name, fmt: 'reserved', node: g, layer: 'hab', p: [f3(x), f3(z)], ry, size: [w, h, d].map(f3) });
    return g;
  }
  async function put(name, x, z, ry = 0, o = {}) {
    let m = get(name);
    if (!m) {
      missing.add(name);
      if (!o.noStandIn && FALLBACK[name] && get(FALLBACK[name])) { standIns.set(name, FALLBACK[name]); return put(FALLBACK[name], x, z, ry, { ...o, standInFor: name }); }
      if (RESERVE[name]) return reserve(name, x, z, ry, RESERVE[name]);
      return null;
    }
    const sc = o.s ?? 1;
    const layerPre = o.layer || (HAB.test(name) ? 'hab' : 'prop');
    const c = Math.abs(Math.cos(ry * D2R)), sn = Math.abs(Math.sin(ry * D2R));
    const hw = (m.size.x * c + m.size.z * sn) * sc / 2, hd = (m.size.x * sn + m.size.z * c) * sc / 2;
    const cx0 = (m.box.min.x + m.box.max.x) / 2 * sc, cz0 = (m.box.min.z + m.box.max.z) / 2 * sc;
    const fx = x + cx0 * Math.cos(ry * D2R) + cz0 * Math.sin(ry * D2R), fz = z - cx0 * Math.sin(ry * D2R) + cz0 * Math.cos(ry * D2R);
    const fp = { x0: fx - hw, x1: fx + hw, z0: fz - hd, z1: fz + hd };
    if (layerPre === 'prop' || /^(crypt|shrine|plaque|pillar)/.test(name)) {
      const hit = solids.find((q) => Math.min(fp.x1, q.fp.x1) - Math.max(fp.x0, q.fp.x0) > 0.08 && Math.min(fp.z1, q.fp.z1) - Math.max(fp.z0, q.fp.z0) > 0.08);
      if (hit) { collisions.push(name + ' ↔ ' + hit.name); return null; }
    }
    const obj = await instance(m.path, PK.commit);
    shadow(obj);
    /* Torflügel sind eigene Knoten mit dem Scharnier im Knoten-Ursprung (arch_gate_left bei x +1,5, Blatt bis x 0) */
    if (/gate/.test(name)) obj.traverse((q) => { if (/_(left|right)$/.test(q.name)) gates.push({ node: q, sign: /left$/.test(q.name) ? -1 : 1, of: name }); });
    const s = sc;
    obj.scale.setScalar(s);
    const ref = o.yRef ?? (o.floor ? m.box.max.y : m.box.min.y);
    obj.position.y = -ref * s + (o.lift || 0);
    const g = new THREE.Group(); g.name = 'hb.' + name + '.' + placed.length;
    g.add(obj); g.position.set(x, 0, z); g.rotation.y = ry * D2R;
    const layer = o.layer || (HAB.test(name) ? 'hab' : 'prop');
    g.userData.entry = { id: g.name, scope: 'requisite', kind: 'prop', role: 'HalloweenBits · ' + name + ' · ' + m.fmt + (o.standInFor ? ' · Ersatz für ' + o.standInFor : ''), a: m.path, layer };
    (o.parent || diorama).add(g);
    const rec = { id: g.name, name, fmt: m.fmt, node: g, layer, p: [f3(x), f3(z)], ry, size: [m.size.x * s, m.size.y * s, m.size.z * s].map(f3) };
    if (o.obstacle) { rec.r = f3((o.r ?? 0.5 * Math.max(rec.size[0], rec.size[2])) * (o.rk ?? 0.85)); obstacles.push({ id: g.name, name, r: rec.r, center: [x, z] }); }
    placed.push(rec); nodes.set(g.name, g);
    if (layerPre === 'prop' || /^(crypt|shrine|plaque|pillar)/.test(name)) solids.push({ name, fp });
    return g;
  }
  /* Nachbau von sample.png (KayKit Halloween Bits). Positionen aus dem Bild abgelesen: Isometrie
     mit +x nach rechts unten, +z nach links unten; ein Zaunfeld = eine Bodenplatte = 4 Einheiten.
     Die Ecke der Einfriedung (Pfeiler links vorn am Tor-Zaun) ist der Ursprung. Zaun: Lauf 1 entlang z
     (x = 0, z 0 … −12), Lauf 2 entlang x (z = 0, x 0 … 20, Bogentor 8 … 12), Lauf 3 entlang z
     (x = 20, z 0 … −8, kaputt). Gruft hinten Mitte-rechts mit der Tür nach +z. */
  const M = 4;
  const layout = { H: f3(H), tile: M };
  const jobs = [];
  const J = (...a) => jobs.push(put(...a));
  const fl = get('floor_dirt');
  const FY = fl ? fl.box.max.y : 0.03;
  /* Boden: Hauptfläche x −4 … 24, z −24 … 4, vorn ausgefranst; Grab-Platte bei (2, 6) */
  const cells = [];
  for (let x = -4; x < 24; x += M) for (let z = -24; z < 4; z += M) cells.push([x + 2, z + 2]);
  for (let x = -4; x < 20; x += M) cells.push([x + 2, 6]);
  for (const x of [4, 12]) cells.push([x + 2, 10]);
  for (const [cx, cz] of cells) {
    if ((cx === -2 && cz === -22) || (cx === 22 && cz === -22) || (cx === 22 && cz === 2)) continue;
    const grave = cx === 2 && cz === 6;
    J(grave ? 'floor_dirt_grave' : 'floor_dirt', cx, cz, 0, { yRef: FY, layer: 'hab' });
  }
  for (const [x, z] of [[-3, 9], [1, 9], [9, 9], [17, 9], [3, 13], [11, 13], [13, 13], [21, 5], [23, 1], [-5, -3], [-5, 1], [25, -9], [25, -13], [-1, -25], [9, -25], [11, -25], [21, -25]]) J('floor_dirt_small', x, z, 0, { yRef: FY, layer: 'hab' });
  /* Zaun */
  const fe = get('fence');
  if (fe) layout.fence = { len: f3(fe.size.x), h: f3(fe.size.y), hOverH: f3(fe.size.y / H) };
  const F = (name, x, z, ry) => J(name, x, z, ry, { layer: 'hab' });
  /* Lauf 1 · x = 0, z 0 … −12 */
  F('fence_broken', 0, -2, 90); F('fence', 0, -6, 90); F('fence', 0, -10, 90);
  for (const z of [0, -4, -12]) F('fence_pillar', 0, z, 0);
  F('fence_pillar', 0, -7.72, 0); F('fence_pillar', 0, -8.28, 0);
  /* Lauf 2 · z = 0, x 0 … 20, Bogentor 8 … 12 */
  F('fence', 2, 0, 0); F('fence', 6, 0, 0); F('arch_gate', 10, 0, 0); F('fence', 14, 0, 0); F('fence', 18, 0, 0);
  for (const x of [4, 16]) F('fence_pillar', x, 0, 0);
  F('fence_pillar', 19.72, 0, 0); F('fence_pillar', 20.28, 0, 0);
  /* Lauf 3 · x = 20, z 0 … −8, zerfallen */
  F('fence', 20, -2, 90); F('fence_pillar', 20, -4, 0); F('fence_seperate_broken', 20, -6, 90); F('fence_pillar_broken', 20, -8, 0);
  /* Gruft */
  const cr = get('crypt');
  const cryptX = 10, cryptZ = -16.2;
  J('crypt', cryptX, cryptZ, 0, { layer: 'hab' });
  layout.crypt = { x: cryptX, z: cryptZ, w: cr ? f3(cr.size.x) : null, d: cr ? f3(cr.size.z) : null };
  /* Pflaster: vom Tor zur Gruft, innen breit, außen ausfransend */
  const pn = ['path_A', 'path_B', 'path_C', 'path_D'];
  const cob = [
    [10, -1.4], [8.2, -1.8], [11.8, -2], [9.2, -3.4], [11, -3.8], [12.8, -3.6], [7.4, -3.6], [10.2, -5.4], [8.4, -5.6], [12, -5.8], [13.8, -5.4],
    [9.4, -7.4], [11.2, -7.6], [13, -7.6], [7.6, -7.2], [10.4, -9.4], [12.2, -9.6], [8.6, -9.2], [14, -9.4], [10.2, -11.2], [8.4, -11], [11.8, -11.4],
    [5.8, -5.2], [6.4, -8.6], [4.4, -8.8], [5, -10.6], [3.2, -10.4],
    [10, 1.6], [8.4, 2.2], [11.4, 2.6], [9.6, 3.8], [7.2, 4.2], [8.2, 5.8], [5.8, 5.2], [6.6, 7.2], [4.6, 7]
  ];
  cob.forEach(([x, z], k) => J(pn[k % 4], x, z, 90 * ((k * 7) % 4), { yRef: 0, lift: FY + 0.005, layer: 'hab' }));
  /* Innen · links: Andachtsplatte mit zwei Bänken, Grab, Kürbisse */
  J('plaque_candles', 2.8, -5.6, 0);
  J('bench', 2.6, -3.1, 0); J('bench', 5.1, -5.8, 90);
  J('grave_B', 3.6, -10.4, 0);
  J('pumpkin_orange_jackolantern', 1.6, -11.2, 20); J('pumpkin_orange_small', 0.9, -10.1, 0);
  J('tree_dead_large', 1.8, -1.2, 10);
  J('shrine_candles', 5.4, -12.8, 0);
  /* Innen · rechts: Gräber, Sarg mit Knochen, Säule, Bank mit Schädelkerze */
  J('gravestone', 12.6, -11.3, 0); J('tree_dead_medium', 13.9, -12.6, 0);
  J('shrine', 15.4, -14.8, 0); J('plaque', 15.2, -10.8, 0); J('coffin_decorated', 17.2, -12.8, 0);
  J('bench_decorated', 15.6, -5, 0); J('gravestone', 14.8, -7.6, 0); J('bone_A', 16.9, -5.2, 30);
  /* Außen · links vorn: Sarg, Schädel, offenes Grab, Laterne, Galgen mit Laterne, Kürbisse, Kreuz */
  J('coffin', -0.4, 5.4, 90); J('skull', 0.9, 3.4, 20); J('lantern_standing', 1.2, 8.4, 0);
  J('post_lantern', 6.8, 4.4, 0);
  J('pumpkin_orange_jackolantern', 6.4, 2.6, -20); J('pumpkin_orange_small', 5, 3.4, 0);
  J('gravemarker_A', 2.4, 2.4, 10);
  /* Außen · rechts vorn: Kürbisse, Kreuze, Knochen, Bank, kleine Tanne */
  J('pumpkin_yellow_jackolantern', 16.2, 2.8, -10); J('pumpkin_orange', 15.2, 3.6, 0); J('pumpkin_yellow_small', 16.4, 4.2, 0);
  J('gravemarker_A', 17.8, 2.6, -8); J('gravemarker_B', 19.1, 2.2, 12); J('bone_B', 20, 2.4, 60);
  J('bench', 22, 1, 90); J('tree_pine_yellow_small', 22.2, -6.6, 0);
  /* Außen · rechts hinten: Kreuz, Kürbisse, kahle Bäume */
  J('gravemarker_B', 21.2, -14.4, 0); J('pumpkin_orange_small', 21.8, -13.4, 0); J('tree_dead_small', 22, -16.4, 0);
  J('pumpkin_orange_jackolantern', 17.6, -18.6, 0); J('pumpkin_orange_small', 16.4, -17.8, 0); J('tree_dead_medium', 18, -20.8, 0);
  /* Bäume · Hintergrund */
  J('tree_pine_yellow_small', -2.4, -7.2, 0);
  J('tree_pine_orange_large', -1.4, -16.2, 0); J('tree_pine_orange_medium', -3, -13.8, 20); J('tree_pine_orange_small', 0.2, -14.2, 50);
  J('tree_dead_large', 1.6, -15.8, 40); J('tree_pine_yellow_medium', 0.8, -19.4, 0); J('tree_dead_medium', 0.6, -22, 90);
  J('tree_pine_yellow_large', 12.6, -21.8, 0); J('tree_pine_orange_medium', 12.2, -18.4, 0); J('tree_pine_orange_small', 14.6, -18.8, 30);
  const zone = { min: [0.9, -11.4], max: [19.1, -0.9] };
  layout.zone = zone;
  await Promise.all(jobs);
  for (const r of placed) {
    if (r.layer !== 'prop' || r.r || /^(path|floor|bone|skull$|candle)/.test(r.name)) continue;
    const [x, z] = r.p;
    if (x < zone.min[0] - 1 || x > zone.max[0] + 1 || z < zone.min[1] - 1 || z > zone.max[1] + 1) continue;
    r.r = f3(0.42 * Math.max(r.size[0], r.size[2]));
    obstacles.push({ id: r.id, name: r.name, r: r.r, center: [x, z] });
  }
  prog('diorama');

  /* ---------- Licht · Mond + Kürbisse ---------- */
  const lights = new THREE.Group(); lights.name = 'graveyard-lights'; world.add(lights);
  const W = 28;
  const moon = new THREE.DirectionalLight(0xa9bcff, 0.9); moon.position.set(-0.6 * W, 1.4 * W, 0.4 * W); moon.target.position.set(0, 0, 0); lights.add(moon.target); lights.add(moon);
  for (const [x, z, y] of [[6.4, 2.6, 0.5], [1.6, -11.2, 0.5], [16.2, 2.8, 0.5], [6.8, 5.8, 2.4], [15.6, -5, 1.6], [17.6, -18.6, 0.5]]) {
    const pl = new THREE.PointLight(0xff8a2a, 9, 7, 1.6); pl.position.set(x, y, z); lights.add(pl);
  }

  /* ---------- Taumel-Läufer ---------- */
  const WK = def.walker;
  for (const P of perf) P.walker = makeWalker({ id: P.id, x: P.def.start[0], z: P.def.start[1], heading: P.heading, speed: WK.speedH * H, r: WK.rH * H, wander: WK.wander, turnJitter: WK.turnJitter, recoil: WK.recoil, knock: WK.knockH * H, lean: WK.lean });
  const walkers = perf.map((P) => P.walker);
  const wrnd = rng(77);

  /* ---------- Knochen aus dem Pack ---------- */
  const DEB = [['bone_A', 0.2], ['bone_B', 0.2], ['bone_C', 0.18], ['skull', 0.2], ['ribcage', 0.28]];
  const debNames = DEB.filter(([n]) => get(n));
  for (const P of perf) for (const [name, frac] of (debNames.length >= 2 ? debNames : [['skull', 0.2], ['ribcage', 0.28], ['skull', 0.16]])) {
    const m = get(name); if (!m) continue;
    const obj = await instance(m.path, PK.commit); shadow(obj);
    const s = (frac * H) / Math.max(m.size.x, m.size.y, m.size.z, 1e-3);
    obj.scale.setScalar(s); obj.position.y = -m.box.min.y * s;
    const g = new THREE.Group(); g.name = 'debris.' + P.id + '.' + name; g.add(obj); g.visible = false; debrisG.add(g);
    P.debris.push({ name, g, s: f3(s) });
  }

  /* ---------- Uhr ---------- */
  const T = { gate: 0, gateTo: 0, time: 0, playing: false, ix: 0, audio: null, audioName: null, rise: def.collapse.rise, collide: true, debris: true, set: 'diorama', bpm: null, phase: null };
  const tr = () => def.tracks[T.ix];
  const bpm = () => T.bpm ?? tr().bpm, phase = () => T.phase ?? tr().phaseSec;
  const G = () => { const t = tr(), spb = 60 / bpm(), L = (t.danceBars + t.gapBars) * 4; return { spb, L, gs: t.danceBars * 4, rs: L - 4 }; };
  const dur = () => (T.audio && isFinite(T.audio.duration) ? T.audio.duration : 4 * G().L * G().spb + phase());
  const listeners = new Set();
  const changed = () => { for (const f of listeners) f(); };
  const phrase = { k: 0, p: 0, bar: 1, part: 'Tanz' };

  function evaluate(dt) {
    const g = G();
    const bp = (T.time - phase()) / g.spb;
    const k = Math.floor(bp / g.L), p = mod(bp, g.L);
    phrase.k = k; phrase.p = p; phrase.bar = Math.floor(p / 4) + 1;
    phrase.part = p < g.gs ? 'Tanz' : p < g.rs ? 'Zerfall' : 'Zusammensetzen';
    const dancing = p >= 0.5 && p < g.gs;
    if (dt > 0 && dancing) {
      const obs = T.collide ? obstacles : [];
      for (const w of walkers) stepWalker(w, dt, { obstacles: obs, walkers: T.collide ? walkers : [], bounds: zone, rnd: wrnd });
    }
    for (const P of perf) {
      const w = P.walker;
      const roster = tr().roster;
      const dn = roster[mod(P.i + k, roster.length)];
      const dclip = dances.get(dn) || dances.get(roster[0]);
      if (!P.bind[dn] && dclip) P.bind[dn] = P.bindOf(dclip);
      const dA = dclip ? P.act(dclip) : null, xA = P.act(P.death), sA = spawn && T.rise === 'Spawn_Ground' ? P.act(spawn) : null;
      const dD = P.death.duration - 1e-3;
      for (const a of P.actions.values()) a.setEffectiveWeight(0);
      const gs = g.gs + P.offset;
      let wd = 1, wx = 0, ws = 0, xt = 0, st = 0;
      if (p < 0.5) { wd = smooth(p / 0.5); if (sA) { ws = 1 - wd; st = spawn.duration - 1e-3; } else { wx = 1 - wd; xt = 0; } }
      else if (p >= gs) {
        const q = p - gs;
        if (p < g.rs) { wx = smooth(q / 0.35); wd = 1 - wx; xt = Math.min(q * g.spb, dD); }
        else {
          const r = clamp((p - g.rs) / (g.L - g.rs), 0, 1);
          wd = 0;
          if (sA) { const b = smooth((p - g.rs) / 0.5); wx = 1 - b; ws = b; xt = dD; st = r * (spawn.duration - 1e-3); }
          else { wx = 1; xt = dD * (1 - r * r); }
        }
      }
      if (dA) { dA.time = mod(T.time + P.i * 1.7, dclip.duration); dA.setEffectiveWeight(wd); }
      xA.time = xt; xA.setEffectiveWeight(wx);
      if (sA) { sA.time = st; sA.setEffectiveWeight(ws); }
      P.mixer.update(0);
      P.now = { dance: dn, wd: f3(wd), wx: f3(wx), ws: f3(ws) };
      /* Platz, Blick, Taumel */
      P.anchor.position.set(w.x, 0, w.z);
      if (dancing && dt > 0) { const d = mod(w.heading - P.faced + 180, 360) - 180; P.faced += d * Math.min(1, dt * 4); }
      P.anchor.rotation.y = P.faced * D2R;
      const T2 = Math.hypot(w.lean[0], w.lean[1]);
      if (T2 > 0.05) { const ax = new THREE.Vector3(w.lean[1], 0, -w.lean[0]).normalize().applyAxisAngle(new THREE.Vector3(0, 1, 0), -P.faced * D2R); P.push.quaternion.setFromAxisAngle(ax, T2 * D2R); }
      else P.push.quaternion.identity();
      /* Knochen: fliegen beim Zerfall weg, beim Zusammensetzen zurück */
      const out = smooth((p - (gs + 0.6)) / 1.2), back = p >= g.rs ? smooth((p - g.rs) / ((g.L - g.rs) * 0.75)) : 0;
      const u = p >= gs ? out * (1 - back) : 0;
      const rr = rng(1000 + P.i * 97 + mod(k, 64) * 7);
      for (const d of P.debris) {
        const a = rr() * Math.PI * 2, rad = (0.35 + rr() * 0.5) * H, spin = (rr() - 0.5) * 8;
        d.g.visible = T.debris && u > 0.01;
        if (!d.g.visible) continue;
        const tx = w.x + Math.cos(a) * rad, tz = w.z + Math.sin(a) * rad;
        d.g.position.set(w.x + (tx - w.x) * u, (1 - u) * 0.55 * H + Math.sin(Math.PI * u) * 0.5 * H, w.z + (tz - w.z) * u);
        d.g.rotation.set(spin * u, a + spin * u * 0.5, spin * 0.3 * u);
      }
    }
  }

  /* ---------- Inventar · alle Modelle im Raster ---------- */
  let invBuilt = false;
  async function buildInventory() {
    if (invBuilt) return; invBuilt = true;
    const all = [...models.values()].sort((a, b) => a.name.localeCompare(b.name) || a.fmt.localeCompare(b.fmt));
    const cell = Math.min(3 * H, Math.max(...all.map((m) => Math.max(m.size.x, m.size.z))) * 0.55 + 0.5 * H);
    const cols = 9;
    for (const [i, m] of all.entries()) {
      const obj = await instance(m.path, PK.commit); shadow(obj);
      obj.position.y = -m.box.min.y;
      const g = new THREE.Group(); g.name = 'inv.' + m.name + '.' + m.fmt;
      const col = i % cols, row = Math.floor(i / cols);
      g.position.set((col - (cols - 1) / 2) * cell, 0, row * cell);
      g.add(obj);
      g.userData.entry = { id: g.name, scope: 'requisite', kind: 'prop', role: 'Inventar · ' + m.name + ' · ' + m.fmt + ' · ' + m.size.toArray().map((x) => x.toFixed(2)).join(' × '), a: m.path };
      const cv = document.createElement('canvas'); cv.width = 512; cv.height = 96;
      const cx = cv.getContext('2d'); cx.fillStyle = m.fmt === 'glb' ? '#f0b37e' : '#cfd6c4'; cx.font = '600 40px ui-monospace,monospace'; cx.textAlign = 'center';
      cx.fillText(m.name + (m.fmt === 'glb' ? ' ·glb' : ''), 256, 60);
      const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(cv), depthTest: false, transparent: true }));
      sp.scale.set(cell * 0.9, cell * 0.17, 1); sp.position.set(0, -0.02, cell * 0.42); sp.renderOrder = 5;
      sp.raycast = () => {};
      g.add(sp);
      inventory.add(g); nodes.set(g.name, g);
    }
    inventory.position.z = -Math.floor((all.length - 1) / cols) * cell / 2;
  }

  /* ---------- Schnittstelle ---------- */
  let savedBg = null;
  const api = {
    def, world, nodes, perf, H,
    get playing() { return T.playing; },
    get tracks() { return def.tracks; },
    get set() { return T.set; },
    onChange(f) { listeners.add(f); },
    attach() { savedBg = V.scene.background; V.scene.background = new THREE.Color(0x17131f); V.scene.add(world); evaluate(0); },
    detach() { this.pause(); V.scene.remove(world); if (savedBg !== null) V.scene.background = savedBg; },
    post(dt) {
      if (T.gate !== T.gateTo) { T.gate += Math.sign(T.gateTo - T.gate) * Math.min(Math.abs(T.gateTo - T.gate), (dt || 0.05) * 0.8); const e = smooth(T.gate); for (const g of gates) g.node.rotation.y = g.sign * e * 100 * D2R; }
      if (T.set !== 'diorama') return;
      if (T.playing) { if (T.audio) T.time = T.audio.currentTime; else T.time = mod(T.time + dt, dur()); }
      evaluate(T.playing ? dt : 0);
    },
    toggle() { T.playing ? this.pause() : this.play(); },
    play() { T.playing = true; if (T.audio) { T.audio.currentTime = T.time; T.audio.play().catch(() => {}); } changed(); },
    pause() { T.playing = false; if (T.audio) T.audio.pause(); changed(); },
    seekFrac(f) { T.time = clamp(f, 0, 1) * dur(); if (T.audio) T.audio.currentTime = T.time; evaluate(0); },
    seekBar(bar) { T.time = phase() + (Math.floor(T.time / (G().L * G().spb)) * G().L + (bar - 1) * 4) * G().spb; if (T.audio) T.audio.currentTime = T.time; evaluate(0); },
    now() { const g = G(), bp = (T.time - phase()) / g.spb; return { time: T.time, dur: dur(), playing: T.playing, bar: Math.floor(mod(bp, g.L) / 4) + 1, beat: Math.floor(mod(bp, 4)) + 1, phrase: phrase.k + 1, part: phrase.part, bars: g.L / 4 }; },
    setTrack(i) { T.ix = clamp(i | 0, 0, def.tracks.length - 1); T.bpm = null; T.phase = null; T.time = 0; for (const P of perf) { P.walker.x = P.def.start[0]; P.walker.z = P.def.start[1]; } evaluate(0); changed(); },
    setBpm(v) { if (v > 30 && v < 260) { T.bpm = +v; evaluate(0); changed(); } },
    setPhase(v) { if (isFinite(v)) { T.phase = +v; evaluate(0); changed(); } },
    setRise(m) { T.rise = m === 'Spawn_Ground' && spawn ? 'Spawn_Ground' : 'reverse'; evaluate(0); changed(); },
    setGate(open) { T.gateTo = open ? 1 : 0; changed(); },
    setCollide(on) { T.collide = !!on; changed(); },
    setDebris(on) { T.debris = !!on; evaluate(0); changed(); },
    async setSet(s) {
      T.set = s === 'inventory' ? 'inventory' : 'diorama';
      if (T.set === 'inventory') { this.pause(); await buildInventory(); }
      inventory.visible = T.set === 'inventory';
      diorama.visible = stage.visible = debrisG.visible = lights.visible = T.set === 'diorama';
      changed();
    },
    loadAudio(file) {
      if (T.audio) { T.audio.pause(); URL.revokeObjectURL(T.audio.src); }
      T.audio = new Audio(URL.createObjectURL(file)); T.audioName = file.name;
      T.audio.addEventListener('loadedmetadata', changed);
      T.pause && 0; this.pause(); T.time = 0; changed();
    },
    view(k) {
      const target = T.set === 'inventory' ? inventory : diorama;
      if (k === 'top') V.frame(target, [0, 1, 0.02], 1.0);
      else V.frame(target, T.set === 'inventory' ? [0, 0.8, 1] : [1, 1.02, 1], T.set === 'inventory' ? 1.0 : 0.8);
    },
    setLayers(on) {
      stage.visible = on.actor && T.set === 'diorama';
      for (const r of placed) r.node.visible = r.layer === 'hab' ? on.hab : on.prop;
      debrisG.visible = on.prop && T.set === 'diorama';
    },
    performerOf(o) { while (o) { if (o.userData && o.userData.entry && o.userData.entry.performer) return o.userData.entry.performer; o = o.parent; } return null; },
    snapshot() {
      const g = G();
      return {
        track: tr(), ix: T.ix, bpm: bpm(), phase: phase(), gateOpen: T.gateTo === 1, gates: gates.length, rise: T.rise, spawnAvailable: !!spawn, collide: T.collide, debris: T.debris, set: T.set, audio: T.audioName,
        now: this.now(), shape: { L: g.L, gs: g.gs, rs: g.rs },
        perf: perf.map((P) => ({ id: P.id, label: P.label, path: P.def.path, death: P.death.name, bind: P.bind, now: P.now, bumps: P.walker.bumps, offset: P.offset })),
        models: models.size, files: list.length, fails, missing: [...missing], standIns: [...standIns].map(([a, b]) => a + '→' + b), reserved, collisions, repaired, duplicate, layout, obstacles: obstacles.map((o) => ({ name: o.name, r: o.r })),
        placed: placed.length, unused: [...new Set([...models.values()].map((m) => m.name))].filter((n) => !placed.some((p) => p.name === n) && !DEB.some((d) => d[0] === n)),
        sizes: [...models.values()].sort((a, b) => a.name.localeCompare(b.name)).map((m) => ({ name: m.name, fmt: m.fmt, size: m.size.toArray().map(f3), tris: m.tris, overH: f3(m.size.y / H) }))
      };
    },
    moduleDoc() {
      const s = this.snapshot();
      return { schema: SCHEMA, id: def.id, status: def.status, pack: { root: PK.root, commit: PK.commit, files: s.files, loaded: s.models, fails: s.fails, duplicate: s.duplicate }, measured: { H: s.layout.H, layout: s.layout, sizes: s.sizes }, placements: placed.map((r) => ({ name: r.name, fmt: r.fmt, p: r.p, ry: r.ry, layer: r.layer, r: r.r })), cast: s.perf, tracks: def.tracks, tracksNote: def.tracksNote, rise: s.rise };
    }
  };
  return api;
}
