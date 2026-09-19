/* Die Seite. Ein Renderer, eine Kamera, ein Turm, drei Modi.

   Reihenfolge beim Start: Packs lesen → Kernteile messen → Gitter aus der Messung →
   Rezept rechnen → bauen. Erst danach darf jemand spielen. Ein Turm, dessen Sprungweiten
   auf geschätzten Maßen stehen, ist kein Turm, sondern eine Hoffnung. */
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { readPack } from '../../KFB_Hex_Baukasten_S0/src/inventory.js';
import { warm, measured, assignRole, moduleMetrics, deriveRockClasses, isRockish, isDeckTile, biomeOf }
  from '../../KFB_Hex_Baukasten_S0/src/kit.js';
import { Sunlight } from '../../KFB_Free_Roam_Platformer_v1/src/lighting.js';
import { planTower, relink, jumpModel, recipe, cellWorld } from './tower.js';
import { buildTower, buildArcs, selectionRing } from './build.js';
import { Player } from './player.js';

const $ = (s) => document.querySelector(s);
const el = (t, a = {}, kids = []) => {
  const n = document.createElement(t);
  for (const [k, v] of Object.entries(a)) {
    if (k === 'class') n.className = v; else if (k === 'html') n.innerHTML = v;
    else if (k.startsWith('on')) n[k] = v; else n.setAttribute(k, v);
  }
  for (const c of [].concat(kids)) n.append(c);
  return n;
};
const say = (t) => { $('#bootmsg').innerHTML = t; };

const S = { mode: 'editor', sel: null, gen: { bands: 10, size: 7, twist: 112, double: true, deco: true } };

/* ── Szene ──────────────────────────────────────────────────────────────────────────── */
const canvas = $('#view');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x120e18);
scene.fog = new THREE.Fog(0x120e18, 60, 220);
const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 600);
camera.position.set(22, 18, 24);

/* Eine Kamera für alle Modi: frei orbitierend, Zoom auf den Cursor. Im Spiel wandert nur
   ihr Ziel mit dem Spieler mit — die Blickrichtung bleibt die, die der Spieler gewählt hat. */
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.zoomToCursor = true;
controls.maxPolarAngle = Math.PI * 0.495;
controls.target.set(0, 2, 0);

const light = new Sunlight(scene, { cell: 2, maxDistance: 120 });
const stage = new THREE.Group();
scene.add(stage);
const gltfLoader = new GLTFLoader();

let player = null, tower = null, kit = null, metrics = null, model = null, cfg = null;
let arcs = null, ring = null, built = null;

function resize() {
  const w = canvas.clientWidth, h = canvas.clientHeight;
  if (canvas.width !== Math.round(w * renderer.getPixelRatio()) || canvas.height !== Math.round(h * renderer.getPixelRatio())) {
    renderer.setSize(w, h, false);
    camera.aspect = w / Math.max(1, h);
    camera.updateProjectionMatrix();
  }
}
let prevT = performance.now();
function tick() {
  requestAnimationFrame(tick);
  const now = performance.now();
  const dt = Math.min(0.05, (now - prevT) / 1000);
  prevT = now;
  resize();
  if (player && S.mode !== 'editor') {
    const before = player.pos.clone();
    player.update(dt, camera);
    const d = player.pos.clone().sub(before);
    controls.target.add(d).lerp(player.pos.clone().setY(player.pos.y + 1.2), 0.12);
    camera.position.add(d);
  }
  controls.update();
  light.fit(camera);
  renderer.render(scene, camera);
}
tick();

/* ── Start ──────────────────────────────────────────────────────────────────────────── */
boot().catch((e) => { console.error(e); say(`<b style="color:#f0765a">${e.message}</b>`); });

async function boot() {
  say('reading pack index…');
  const [hex, builder] = await Promise.all([readPack('hex'), readPack('builder')]);

  /* Geladen wird nur, woraus wirklich gebaut wird: Hex-Kacheln beider Packs und Natur.
     Gebäude bleiben im Bestand und laden LAZY — gesetzt wird genau eines, auf dem Zielband.
     Sie eager mitzumessen kostete 93 Modelle und beim kalten Start rund 45 Sekunden für ein
     einziges Teil (derselbe Befund wie im Baukasten: nicht messen, was der Generator nie
     anfasst). */
  const CORE = /^tiles(?!\/square)|nature/;
  const all = [...hex.parts, ...builder.parts];
  const core = all.filter((p) => CORE.test(p.family)).filter((p) => !/square/.test(p.family));
  say(`measuring ${core.length} parts…`);
  await warm(core, (i, n) => say(`measuring ${i}/${n} parts…`));
  /* Ungemessene Teile bleiben mit size = null im Bestand — sie tragen ihre Rolle aus der
     Pack-Ordnung und fallen aus jeder Auswahl, die ein Maß braucht. */
  const recs = all.map((p) => measured.get(p.path) || { ...p, size: null, foot: null });

  /* Das Gitter kommt aus den Kacheln des Hexagon-Packs allein — das Builder Pack stellt die
     Mehrheit und würde sonst die Referenz bestimmen (Befund aus dem Baukasten). */
  const hexTiles = recs.filter((r) => r.size && r.pack === 'hex' && (r.family || '').toLowerCase().startsWith('tiles'));
  metrics = moduleMetrics(hexTiles.length ? hexTiles : recs);
  const fits = (r) => Math.abs(r.size[0] - metrics.W) < metrics.W * 0.12
                   && Math.abs(r.size[2] - metrics.H) < metrics.H * 0.12;
  for (const r of recs) {
    r.role = assignRole(r, metrics);
    if (r.size && (r.role === 'module' || r.role === 'padding') && !fits(r) && r.foot > metrics.W * 0.88) r.offGrid = true;
  }  deriveRockClasses(recs.filter((r) => isRockish(r)));
  kit = buildKit(recs);

  say('reading movement config…');
  cfg = await (await fetch(new URL('../../KFB_Free_Roam_Platformer_POC_v0/data/movement-config.json', import.meta.url))).json();
  model = jumpModel(cfg);

  player = new Player(scene, cfg, model);
  player.height = metrics.step * 2.2;
  player.bind(canvas);

  await rebuild(true);
  $('#boot').classList.add('gone');
  wire();
  player.mountCarl(gltfLoader).then(() => panelSelection());
}

/* Kit: dieselben Regeln wie im Baukasten, nur die Rollen, die ein Turm braucht. */
function buildKit(recs) {
  const deck = [...new Map(recs.filter((r) => r.size && !r.offGrid && isDeckTile(r)).map((r) => [r.base, r])).values()];
  const biomes = new Map();
  for (const r of deck) {
    const k = r.pack + ':' + biomeOf(r.base);
    if (!biomes.has(k)) biomes.set(k, []);
    biomes.get(k).push(r);
  }
  const rocks = { A: [], B: [], C: [] };
  for (const r of recs) if (r.rock) rocks[r.rock].push(r);
  return {
    biomes: [...biomes.entries()].map(([k, v]) => ({ key: k, pack: v[0].pack, tiles: v }))
      .sort((x, y) => y.tiles.length - x.tiles.length),
    modules: deck,
    nature: recs.filter((r) => r.role === 'nature' && !r.rock && r.foot && r.foot < metrics.W * 0.8),
    landmarks: recs.filter((r) => r.role === 'landmark'),
    rocks,
  };
}

function chooseBiome(seed) {
  const pool = kit.biomes;
  if (!pool.length) return null;
  const h = Math.abs([...String(seed)].reduce((a, c) => (a * 31 + c.charCodeAt(0)) | 0, 7));
  const chosen = pool[h % pool.length];
  const base = [...chosen.tiles].sort((x, y) => x.base.length - y.base.length)[0];
  return { key: chosen.key, base,
           detail: chosen.tiles.filter((t) => /detail|variant|alt/i.test(t.base)),
           transition: chosen.tiles.filter((t) => /transition/i.test(t.base)) };
}

async function rebuild(replan) {
  const seed = $('#seed').value.trim() || 'B1';
  if (replan || !tower) {
    tower = planTower({ seed, bands: S.gen.bands, size: S.gen.size, twist: S.gen.twist,
                        allowDouble: S.gen.double, metrics, model });
  } else {
    relink(tower);
  }
  kit.biome = chooseBiome(seed);
  stage.clear();
  built = await buildTower(tower, kit, { deco: S.gen.deco });
  stage.add(built.root);
  arcs = buildArcs(tower);
  stage.add(arcs);
  arcs.visible = S.mode === 'editor';
  if (ring) { ring.removeFromParent(); ring = null; }
  if (S.sel != null && tower.bands[S.sel]) select(S.sel);
  player.place(tower);
  player.frozen = S.mode === 'editor';
  player.mode = S.mode === 'play' ? 'play' : 'chill';
  if (S.mode === 'editor') frameTower(); else frameOnPlayer();
  panelBuild(); panelClimb(); panelSelection(); hint();
}

function frameTower() {
  const box = new THREE.Box3().setFromObject(stage);
  if (box.isEmpty()) return;
  const sph = box.getBoundingSphere(new THREE.Sphere());
  /* Einpassen über die Bildkugel, nicht über einen Daumenfaktor: der erste Wurf schnitt bei
     jedem Seitenverhältnis das unterste Band ab. */
  const vFov = THREE.MathUtils.degToRad(camera.fov);
  const hFov = 2 * Math.atan(Math.tan(vFov / 2) * camera.aspect);
  const d = sph.radius / Math.sin(Math.min(vFov, hFov) / 2) * 1.08;
  controls.target.copy(sph.center);
  camera.position.copy(sph.center).add(new THREE.Vector3(0.62, 0.42, 0.66).normalize().multiplyScalar(d));
  camera.far = d * 6; camera.updateProjectionMatrix();
  scene.fog.near = d * 0.7; scene.fog.far = d * 3.4;
}
function frameOnPlayer() {
  const p = player.pos.clone();
  controls.target.copy(p).add(new THREE.Vector3(0, 1.2, 0));
  camera.position.copy(p).add(new THREE.Vector3(cfg.camera.distance * 0.7, cfg.camera.height, cfg.camera.distance * 0.7));
}
function topView() {
  const box = new THREE.Box3().setFromObject(stage);
  const c = box.getCenter(new THREE.Vector3());
  const r = Math.max(box.getSize(new THREE.Vector3()).x, box.getSize(new THREE.Vector3()).z);
  controls.target.copy(c);
  camera.position.set(c.x + 0.01, c.y + r * 1.5, c.z);
}

/* ── Leiste ─────────────────────────────────────────────────────────────────────────── */
function slider(label, key, min, max, step, fmt) {
  const out = el('span', { class: 'val' }, String(fmt ? fmt(S.gen[key]) : S.gen[key]));
  const inp = el('input', { type: 'range', min, max, step, value: S.gen[key], class: 'grow',
    oninput: (e) => { S.gen[key] = +e.target.value; out.textContent = fmt ? fmt(S.gen[key]) : S.gen[key]; },
    onchange: () => rebuild(true) });
  return el('div', { class: 'row' }, [el('label', { class: 'sl' }, label), inp, out]);
}
function toggle(label, key) {
  return el('button', { 'aria-pressed': String(!!S.gen[key]),
    onclick: (e) => { S.gen[key] = !S.gen[key]; e.target.setAttribute('aria-pressed', String(S.gen[key])); rebuild(false); } }, label);
}

function panelBuild() {
  const host = $('#build'); host.innerHTML = '';
  host.append(slider('Bands', 'bands', 4, 16, 1));
  host.append(slider('Size', 'size', 3, 12, 1));
  host.append(slider('Twist', 'twist', 40, 180, 2, (v) => v + '°'));
  const t = toggle('Double jump', 'double');
  t.onclick = (e) => { S.gen.double = !S.gen.double; e.target.setAttribute('aria-pressed', String(S.gen.double)); rebuild(true); };
  host.append(el('div', { class: 'row' }, [t, toggle('Scenery', 'deco'),
    el('button', { onclick: () => rebuild(true) }, 'Rebuild'),
    el('button', { onclick: exportRecipe }, 'Recipe')]));
  const s = tower.summary;
  host.append(el('div', {}, [
    kv('grid', `${metrics.W.toFixed(2)} × ${metrics.H.toFixed(2)} · step ${metrics.step.toFixed(2)}`),
    kv('reach', `${(model.single(0).dist).toFixed(1)} / ${(model.double(0).dist).toFixed(1)} u · ${(model.single(0).dist / metrics.W).toFixed(1)} tiles`),
    kv('climb', `${s.levels} steps · ${s.height.toFixed(1)} u`),
    kv('cells', `${s.cells} on ${s.bands} bands`),
    kv('start → goal', s.reachable ? 'reachable' : `${s.far} gap(s) too far`),
  ]));
}

function kv(k, v) { return el('div', { class: 'kv' }, [el('span', {}, k), el('b', {}, String(v))]); }

function panelClimb() {
  const host = $('#climb'); host.innerHTML = '';
  const list = el('div', { class: 'steplist' });
  for (const b of tower.bands) {
    const l = b.link;
    const cls = l ? l.cls : 'start';
    const row = el('div', { class: 'step' + (S.sel === b.i ? ' on' : ''), onclick: () => select(b.i) }, [
      el('i', {}, String(b.i).padStart(2, '0')),
      el('span', {}, l ? `+${l.dh.toFixed(1)} u · gap ${l.gap.toFixed(1)} / ${l.room.toFixed(1)}` : 'start band'),
      el('span', { class: 'cls ' + cls }, cls),
    ]);
    list.append(row);
  }
  host.append(list);
  if (tower.rejects.length) {
    host.append(el('p', { class: 'note' },
      `${tower.rejects.length} placement(s) rejected and pulled in — measured gap was over the reach.`));
  }
  host.append(el('p', { class: 'note' },
    `Reach is computed from impulse ${model.v}, gravity ${model.g}, run ${model.run} and the measured tile, at ${Math.round(0.82 * 100)}% safety.`));
}

function panelSelection() {
  const host = $('#sel'); host.innerHTML = '';
  if (S.mode !== 'editor') { host.append(el('p', { class: 'note' }, 'Switch to Editor to move bands.')); return; }
  if (S.sel == null) { host.append(el('p', { class: 'note' }, 'Click a band in the scene or a row under Climb.')); return; }
  const b = tower.bands[S.sel];
  const step = (label, fn) => el('button', { onclick: () => { fn(); apply(); } }, label);
  const apply = async () => { relink(tower); await rebuild(false); };
  host.append(el('div', { class: 'row' }, [
    el('label', { class: 'sl' }, `band ${String(b.i).padStart(2, '0')} · ${b.role}`),
  ]));
  host.append(el('div', { class: 'row' }, [
    el('label', { class: 'sl grow' }, 'height'),
    step('−', () => { b.level--; }), step('+', () => { b.level++; }),
    el('label', { class: 'sl grow' }, 'reach'),
    step('in', () => moveBand(b, -0.6)), step('out', () => moveBand(b, 0.6)),
  ]));
  host.append(el('div', { class: 'row' }, [
    el('label', { class: 'sl grow' }, 'swing'),
    step('↺', () => swingBand(b, -8)), step('↻', () => swingBand(b, 8)),
    step('drop band', () => { if (tower.bands.length > 2) tower.bands.splice(b.i, 1); S.sel = null; }),
  ]));
  host.append(el('p', { class: 'note' }, b.link
    ? `gap ${b.link.gap.toFixed(2)} u of ${b.link.room.toFixed(2)} allowed · rise ${b.link.dh.toFixed(2)} u · ${b.link.cls}`
    : 'start band — nothing to jump from.'));
  host.append(el('p', { class: 'note' }, 'Actor: ' + player.actor));
}

/* Ein Band verschieben heißt: seinen Abstand zum VORGÄNGER ändern. Alles Folgende wandert
   mit, sonst reißt der Editor mit jedem Klick eine Lücke weiter hinten auf. */
function moveBand(b, d) {
  if (b.i === 0) return;
  const prev = tower.bands[b.i - 1];
  const a = Math.atan2(b.cz - prev.cz, b.cx - prev.cx);
  shiftFrom(b.i, Math.cos(a) * d, Math.sin(a) * d);
}
function swingBand(b, deg) {
  if (b.i === 0) return;
  const prev = tower.bands[b.i - 1];
  const r = Math.hypot(b.cx - prev.cx, b.cz - prev.cz);
  const a = Math.atan2(b.cz - prev.cz, b.cx - prev.cx) + deg * Math.PI / 180;
  shiftFrom(b.i, prev.cx + Math.cos(a) * r - b.cx, prev.cz + Math.sin(a) * r - b.cz);
}
function shiftFrom(i, dx, dz) {
  for (let j = i; j < tower.bands.length; j++) { tower.bands[j].cx += dx; tower.bands[j].cz += dz; }
}

function select(i) {
  S.sel = i;
  if (ring) ring.removeFromParent();
  const b = tower.bands[i];
  if (!b) return;
  ring = selectionRing(b, tower);
  stage.add(ring);
  panelClimb(); panelSelection();
  if (S.mode === 'editor') {
    const p = new THREE.Vector3(b.cx, b.level * tower.step, b.cz);
    controls.target.lerp(p, 0.9);
  }
}

function exportRecipe() {
  const blob = new Blob([JSON.stringify(recipe(tower), null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `babel-hex-${tower.seed}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
}

function hint() {
  const h = $('#hint');
  if (S.mode === 'editor') h.textContent = 'Editor · click a band, move it, watch the climb list.';
  else if (S.mode === 'chill') h.textContent = 'Chill & Fun · you cannot step off a band, and a jump towards the next one always lands.';
  else h.textContent = 'Play · real physics. Miss and you fall back to the last band you stood on.';
}

/* ── Bedienung ──────────────────────────────────────────────────────────────────────── */
function wire() {
  $('#roll').onclick = () => {
    $('#seed').value = Math.random().toString(36).slice(2, 6).toUpperCase();
    rebuild(true);
  };
  $('#seed').onchange = () => rebuild(true);
  $('#panel').onclick = (e) => {
    const on = $('#app').classList.toggle('panel');
    e.currentTarget.setAttribute('aria-pressed', String(on));
  };
  $('#clean').onclick = () => $('#app').classList.add('clean');
  $('#exitClean').onclick = () => $('#app').classList.remove('clean');
  $('#top').onclick = topView;
  addEventListener('keydown', (e) => { if (e.key === 'Escape') $('#app').classList.remove('clean'); });
  for (const btn of $('#modes').querySelectorAll('button')) {
    btn.onclick = () => setMode(btn.dataset.mode);
  }
  canvas.addEventListener('pointerdown', onPick);
  addEventListener('resize', resize);
}

function setMode(mode) {
  S.mode = mode;
  for (const btn of $('#modes').querySelectorAll('button')) btn.setAttribute('aria-pressed', String(btn.dataset.mode === mode));
  arcs.visible = mode === 'editor';
  player.frozen = mode === 'editor';
  player.mode = mode === 'play' ? 'play' : 'chill';
  if (mode === 'editor') { frameTower(); }
  else { player.place(tower); frameOnPlayer(); }
  if (ring) ring.visible = mode === 'editor';
  panelSelection(); hint();
}

const ray = new THREE.Raycaster();
function onPick(e) {
  if (S.mode !== 'editor' || e.button !== 0) return;
  const r = canvas.getBoundingClientRect();
  const p = new THREE.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
  ray.setFromCamera(p, camera);
  const hits = ray.intersectObject(built.root, true);
  for (const h of hits) {
    let o = h.object;
    while (o && o.userData.band === undefined) o = o.parent;
    if (o) { select(o.userData.band); return; }
  }
}

window.BABEL = { S, scene, camera, controls, get tower() { return tower; }, get player() { return player; },
                 get kit() { return kit; }, get metrics() { return metrics; },
                 rebuild, recipe: () => recipe(tower) };
