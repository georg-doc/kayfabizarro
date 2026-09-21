/* Platformer Kit Atlas S0 — Inventar, Rendering, Messung.

   Ein Renderer. Ein Loader (src/loader.js, mit Textur-Faltung). Eine Messung
   (src/atlas/measure.js). Die Kacheln werden mit demselben Renderer in einem
   Capture-Durchgang je Bild gefüllt, der Detail-Viewer läuft im selben RAF.

   Kein Audio, keine Komposition, keine Hub-Labels — das ist GATE A. */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { instance, loadGltf, textureFolds } from '../loader.js';
import { raw, loadLog } from '../sources.js';
import { measureAsset, deriveGridFacts, deriveNeighbours, familyOf, familyRank, DIR_KEYS, OPPOSITE } from './measure.js';

const $ = (s) => document.querySelector(s);
const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };
const fmt = (n) => (n == null ? '—' : (Math.round(n * 1000) / 1000).toFixed(3));
const v3 = (a) => a.map((n) => fmt(n)).join('  ');

const state = {
  pack: null, entries: [], records: new Map(), failures: new Map(),
  selected: null, family: 'all', tab: 'grid', onlyPlatforms: false,
  overlays: { axes: true, box: true, walk: true, joins: true, grid: true },
  gridFacts: null, neighbours: null,
};

/* ---------- Renderer, Szenen ---------- */
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, preserveDrawingBuffer: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = false;
$('#viewer').appendChild(renderer.domElement);
renderer.domElement.style.cssText = 'display:block;width:100%;height:100%';
let curSize = [0, 0];
function setSize(w, h) {
  if (curSize[0] === w && curSize[1] === h) return;
  renderer.setSize(w, h, false); curSize = [w, h];
}

function lit(scene, bg) {
  scene.background = new THREE.Color(bg);
  const hemi = new THREE.HemisphereLight(0xffffff, 0x8f8878, 1.05);
  const dir = new THREE.DirectionalLight(0xfff6e6, 1.5);
  dir.position.set(3, 5, 2.5);
  const fill = new THREE.DirectionalLight(0xdfe9f2, 0.5);
  fill.position.set(-3, 1.5, -2);
  scene.add(hemi, dir, fill);
  return scene;
}
const thumbScene = lit(new THREE.Scene(), 0xf2ece0);
const thumbCam = new THREE.PerspectiveCamera(32, 1, 0.01, 200);
const thumbHolder = new THREE.Group(); thumbScene.add(thumbHolder);

const viewScene = lit(new THREE.Scene(), 0xeee7d9);
const viewCam = new THREE.PerspectiveCamera(35, 1, 0.01, 500);
const viewHolder = new THREE.Group(); viewScene.add(viewHolder);
const overlayHolder = new THREE.Group(); viewScene.add(overlayHolder);
const gridHelper = new THREE.GridHelper(20, 10, 0xb9ad96, 0xd6cdb9);
viewScene.add(gridHelper);
const controls = new OrbitControls(viewCam, renderer.domElement);
controls.enableDamping = true; controls.dampingFactor = 0.08;

/* ---------- Kacheln ---------- */
const captureQueue = [];
const cards = new Map();

/* Distanz aus dem Öffnungswinkel rechnen, nicht als Faktor raten: bei fov 32° braucht
   eine Kugel vom Radius r mindestens r / sin(fov/2) ≈ 3,63·r. cam.aspect muss vorher
   stehen, sonst schneidet die schmalere Achse an. */
function frameCam(cam, box, margin = 1.15) {
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const r = Math.max(size.length() / 2, 0.25);
  const vHalf = THREE.MathUtils.degToRad(cam.fov) / 2;
  const hHalf = Math.atan(Math.tan(vHalf) * cam.aspect);
  const dist = (r / Math.sin(Math.min(vHalf, hHalf))) * margin;
  const d = new THREE.Vector3(1, 0.72, 1.15).normalize().multiplyScalar(dist);
  cam.position.copy(center).add(d);
  cam.near = Math.max(r / 100, 0.01); cam.far = dist + r * 10;
  cam.updateProjectionMatrix();
  cam.lookAt(center);
  return center;
}

function renderThumb(job) {
  const { node, canvas } = job;
  thumbHolder.clear(); thumbHolder.add(node);
  const box = new THREE.Box3().setFromObject(node);
  thumbCam.aspect = 1; thumbCam.updateProjectionMatrix();
  frameCam(thumbCam, box);
  const px = 320;
  setSize(px, px);
  renderer.render(thumbScene, thumbCam);
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(renderer.domElement, 0, 0, canvas.width, canvas.height);
  thumbHolder.clear();
  curSize = [0, 0]; // Viewer-Pass muss die Größe neu setzen
}

/* ---------- Overlays im Detail-Viewer ---------- */
function buildOverlays(rec, node) {
  overlayHolder.clear();
  if (!rec) return;
  const min = new THREE.Vector3(...rec.min), max = new THREE.Vector3(...rec.max);
  const size = new THREE.Vector3(...rec.size);
  const center = new THREE.Vector3(...rec.center);

  if (state.overlays.box) {
    const box3 = new THREE.Box3(min, max);
    const helper = new THREE.Box3Helper(box3, 0x22201c);
    helper.material.transparent = true; helper.material.opacity = 0.5;
    overlayHolder.add(helper);
  }
  if (state.overlays.axes) {
    const ax = new THREE.AxesHelper(Math.max(size.length() * 0.45, 0.4));
    overlayHolder.add(ax);
  }
  if (state.overlays.walk && rec.walkable) {
    const w = rec.walkable;
    const g = new THREE.PlaneGeometry(Math.max(w.w, 0.02), Math.max(w.d, 0.02));
    const m = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ color: 0x3f7d3a, transparent: true, opacity: 0.35, side: THREE.DoubleSide, depthWrite: false }));
    m.rotation.x = -Math.PI / 2;
    m.position.set((w.minX + w.maxX) / 2, w.y + 0.004, (w.minZ + w.maxZ) / 2);
    overlayHolder.add(m);
    const ring = new THREE.Mesh(new THREE.RingGeometry(0.02, 0.05, 16), new THREE.MeshBasicMaterial({ color: 0x1f5c1a }));
    ring.rotation.x = -Math.PI / 2; ring.position.set(0, w.y + 0.01, 0);
    overlayHolder.add(ring);
  }
  if (state.overlays.joins) {
    for (const k of DIR_KEYS) {
      const s = rec.sides[k];
      if (s.kind === 'PARTIAL' && s.ratio < 0.4) continue;
      const color = s.kind === 'OPEN' ? 0xc2331f : s.kind === 'WALL' ? 0x3f7d3a : s.kind === 'EDGE' ? 0x2f6ea8 : 0xc2761f;
      const onX = k === 'px' || k === 'nx';
      const g = new THREE.PlaneGeometry(onX ? size.z : size.x, size.y);
      const m = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ color, transparent: true, opacity: s.kind === 'OPEN' ? 0.32 : 0.18, side: THREE.DoubleSide, depthWrite: false }));
      m.position.set(center.x, center.y, center.z);
      if (k === 'px') { m.position.x = max.x + 0.006; m.rotation.y = Math.PI / 2; }
      if (k === 'nx') { m.position.x = min.x - 0.006; m.rotation.y = -Math.PI / 2; }
      if (k === 'pz') { m.position.z = max.z + 0.006; }
      if (k === 'nz') { m.position.z = min.z - 0.006; m.rotation.y = Math.PI; }
      overlayHolder.add(m);
    }
  }
  gridHelper.visible = state.overlays.grid;
  gridHelper.position.y = rec.bottomY;
  const step = state.gridFacts?.gridStepX?.value || 1;
  gridHelper.scale.setScalar(step / 2);
}

/* ---------- Laden + Messen ---------- */
/* Der Loader erwartet den Repo-Pfad; pack-index.json speichert relativ zum Pack-Ordner. */
const full = (p) => state.pack.root + p;

async function measureOne(entry) {
  const card = cards.get(entry.name);
  card?.classList.add('busy');
  try {
    const gltf = await loadGltf(full(entry.path), state.pack.commit);
    const rec = measureAsset(entry.name, entry.path, gltf);
    rec.url = raw(state.pack.commit, full(entry.path));
    rec.loadMs = loadLog.get(full(entry.path))?.ms ?? null;
    state.records.set(entry.name, rec);
    fillCard(entry.name, rec);
    const node = await instance(full(entry.path), state.pack.commit);
    captureQueue.push({ node, canvas: card.querySelector('canvas') });
  } catch (e) {
    state.failures.set(entry.name, e.message || String(e));
    card?.classList.add('failed');
    const st = card?.querySelector('.st');
    if (st) { st.textContent = 'LOAD FAILED'; st.className = 'st bad'; }
  } finally {
    card?.classList.remove('busy');
    progress();
  }
}

function progress() {
  const done = state.records.size + state.failures.size;
  const n = state.entries.length;
  $('#prog').innerHTML = `<b>${done}</b>/${n} vermessen` +
    (state.failures.size ? ` · <em class="bad">${state.failures.size} Fehler</em>` : '') +
    ` · Texturen ${textureFolds.unique}/${textureFolds.seen}`;
  if (done === n) {
    state.gridFacts = deriveGridFacts([...state.records.values()]);
    state.neighbours = deriveNeighbours([...state.records.values()]);
    $('#prog').innerHTML += ' · <b>GATE A vollständig</b>';
    renderFacts();
    renderTable();
    if (state.selected) select(state.selected);
  }
}

async function runQueue(concurrency = 4) {
  const queue = [...state.entries];
  const worker = async () => { while (queue.length) await measureOne(queue.shift()); };
  await Promise.all(Array.from({ length: concurrency }, worker));
}

/* ---------- Kartengitter ---------- */
function buildGrid() {
  const host = $('#grid'); host.innerHTML = '';
  const byFamily = new Map();
  for (const e of state.entries) {
    const f = e.family;
    if (!byFamily.has(f)) byFamily.set(f, []);
    byFamily.get(f).push(e);
  }
  const fams = [...byFamily.keys()].sort((a, b) => familyRank(a) - familyRank(b) || a.localeCompare(b));
  for (const f of fams) {
    const sec = el('section', 'fam');
    sec.dataset.family = f;
    const h = el('h2');
    h.appendChild(el('span', null, f));
    h.appendChild(el('em', null, `${byFamily.get(f).length} Teile`));
    sec.appendChild(h);
    const row = el('div', 'cards');
    for (const e of byFamily.get(f)) {
      const c = el('article', 'card');
      c.dataset.name = e.name;
      const cv = el('canvas'); cv.width = 320; cv.height = 320;
      c.appendChild(cv);
      c.appendChild(el('h3', null, e.name));
      c.appendChild(el('p', 'st', 'wartet'));
      c.appendChild(el('p', 'dim', '—'));
      c.addEventListener('click', () => select(e.name));
      row.appendChild(c);
      cards.set(e.name, c);
    }
    sec.appendChild(row);
    host.appendChild(sec);
  }
}

function fillCard(name, rec) {
  const c = cards.get(name); if (!c) return;
  const st = c.querySelector('.st');
  st.textContent = rec.role + (rec.roleMismatch ? ' ⚠' : '');
  st.className = 'st role r-' + rec.role + (rec.roleMismatch ? ' warn' : '');
  c.querySelector('.dim').textContent =
    `${fmt(rec.size[0])} × ${fmt(rec.size[1])} × ${fmt(rec.size[2])}` +
    (rec.walkable ? ` · top ${fmt(rec.walkable.y)}` : '') +
    (rec.clips.length ? ` · ${rec.clips.length} clips` : '');
  c.dataset.platform = rec.role !== 'PROP' ? '1' : '0';
  applyFilter();
}

function applyFilter() {
  for (const [name, c] of cards) {
    const rec = state.records.get(name);
    const famOk = state.family === 'all' || c.closest('.fam')?.dataset.family === state.family;
    const platOk = !state.onlyPlatforms || (rec ? rec.role !== 'PROP' : true);
    c.hidden = !(famOk && platOk);
  }
  for (const sec of document.querySelectorAll('.fam')) {
    sec.hidden = ![...sec.querySelectorAll('.card')].some((c) => !c.hidden);
  }
}

/* ---------- Detail ---------- */
let viewerNode = null;
async function select(name) {
  state.selected = name;
  for (const [n, c] of cards) c.classList.toggle('on', n === name);
  const rec = state.records.get(name);
  const entry = state.entries.find((e) => e.name === name);
  $('#dname').textContent = name;
  $('#dpath').textContent = full(entry.path);
  $('#dlink').href = rec?.url || raw(state.pack.commit, full(entry.path));
  renderDetail(rec);
  if (!rec) return;
  viewHolder.clear();
  if (viewerNode) viewerNode = null;
  viewerNode = await instance(full(entry.path), state.pack.commit);
  viewHolder.add(viewerNode);
  const box = new THREE.Box3().setFromObject(viewerNode);
  const center = frameCam(viewCam, box, 1.25);
  controls.target.copy(center); controls.update();
  buildOverlays(rec, viewerNode);
}

function kv(host, k, v, cls) {
  const r = el('div', 'kv' + (cls ? ' ' + cls : ''));
  r.appendChild(el('span', null, k));
  const b = el('b'); b.textContent = v; r.appendChild(b);
  host.appendChild(r);
}

function renderDetail(rec) {
  const host = $('#dbody'); host.innerHTML = '';
  if (!rec) {
    host.appendChild(el('p', 'note', state.failures.get(state.selected)
      ? 'Laden fehlgeschlagen: ' + state.failures.get(state.selected)
      : 'noch nicht vermessen'));
    return;
  }
  const g1 = el('div', 'block');
  g1.appendChild(el('h4', null, 'Rolle (gemessen)'));
  kv(g1, 'abgeleitet', rec.role);
  kv(g1, 'Dateiname sagt', rec.nameHint || '—', rec.roleMismatch ? 'warn' : '');
  const why = el('p', 'note', rec.roleReason); g1.appendChild(why);
  host.appendChild(g1);

  const g2 = el('div', 'block');
  g2.appendChild(el('h4', null, 'Maße'));
  kv(g2, 'size  x y z', v3(rec.size));
  kv(g2, 'min', v3(rec.min));
  kv(g2, 'max', v3(rec.max));
  kv(g2, 'bottom Y', fmt(rec.bottomY));
  kv(g2, 'top Y', fmt(rec.topY));
  kv(g2, 'Grundriss', fmt(rec.footprintArea));
  kv(g2, 'Pivot in Box', `x ${fmt(rec.pivot.inBoxX)} · y ${fmt(rec.pivot.inBoxY)} · z ${fmt(rec.pivot.inBoxZ)}`);
  kv(g2, 'Pivot-Lage', (rec.pivot.atBottom ? 'auf der Unterkante' : 'NICHT auf der Unterkante') +
    (rec.pivot.centeredXZ ? ', xz zentriert' : ', xz versetzt'));
  host.appendChild(g2);

  const g3 = el('div', 'block');
  g3.appendChild(el('h4', null, 'Lauffläche (Normalen-Probe, nicht maxY)'));
  if (rec.walkable) {
    kv(g3, 'Ebene Y', fmt(rec.walkable.y) + (rec.walkable.isBoxTop ? '  = box top' : '  ≠ box top'));
    kv(g3, 'Fläche', fmt(rec.walkable.area) + `  (${Math.round(rec.walkable.coverage * 100)} % vom Grundriss)`);
    kv(g3, 'Ausdehnung', `${fmt(rec.walkable.w)} × ${fmt(rec.walkable.d)}`);
    kv(g3, 'xz-Grenzen', `x ${fmt(rec.walkable.minX)}…${fmt(rec.walkable.maxX)} · z ${fmt(rec.walkable.minZ)}…${fmt(rec.walkable.maxZ)}`);
  } else kv(g3, 'Ebene', 'keine waagerechte Deckfläche gefunden');
  if (rec.upPlanes.length > 1) {
    const list = el('p', 'note', 'weitere Ebenen nach oben: ' +
      rec.upPlanes.slice(1, 4).map((p) => `Y ${fmt(p.y)} (A ${fmt(p.area)})`).join(' · '));
    g3.appendChild(list);
  }
  kv(g3, 'Unterseite', `${rec.bottomClosure.kind}  ratio ${fmt(rec.bottomClosure.ratio)}`);
  host.appendChild(g3);

  const g4 = el('div', 'block');
  g4.appendChild(el('h4', null, 'Seiten: offen, Wand oder Außenkante'));
  for (const k of DIR_KEYS) {
    const s = rec.sides[k];
    kv(g4, s.label, `${s.kind}  flach ${fmt(s.ratio)} · zugewandt ${fmt(s.facingRatio)}`,
      s.kind === 'OPEN' ? 'join' : s.kind === 'EDGE' ? 'edge' : s.kind === 'WALL' ? 'wall' : '');
  }
  kv(g4, 'Signatur', rec.sideSignature);
  kv(g4, '90°-Varianten', String(rec.distinctRotations));
  g4.appendChild(el('p', 'note', 'OPEN = dort steht gar keine Geometrie; die Seite muss ein Nachbar oder ein Wandpaneel decken, sonst schaut man in die Insel. WALL = planflache Haut in der Zellkante. EDGE = profilierte Außenkante mit Überhang, darf frei stehen.'));
  host.appendChild(g4);

  if (state.neighbours?.has(rec.name)) {
    const g5 = el('div', 'block');
    g5.appendChild(el('h4', null, 'Passende Nachbarn je offener Seite'));
    const per = state.neighbours.get(rec.name);
    for (const k of DIR_KEYS) {
      const list = per[k];
      kv(g5, rec.sides[k].label, list == null ? '— (geschlossen)' : `${list.length} Teile`);
    }
    const all = new Set(); for (const k of DIR_KEYS) (per[k] || []).forEach((n) => all.add(n));
    if (all.size) g5.appendChild(el('p', 'note', [...all].slice(0, 14).join(' · ') + (all.size > 14 ? ' …' : '')));
    host.appendChild(g5);
  }

  const g6 = el('div', 'block');
  g6.appendChild(el('h4', null, 'Aufbau'));
  kv(g6, 'Meshes / Dreiecke', `${rec.meshes} / ${rec.triangles}`);
  kv(g6, 'Nodes', String(rec.nodeCount));
  kv(g6, 'skinned', rec.skinned ? `ja (${rec.skinnedTriangles} Dreiecke in Ruhepose)` : 'nein');
  kv(g6, 'Clips', rec.clips.length ? String(rec.clips.length) : 'keine');
  if (rec.clips.length) g6.appendChild(el('p', 'note', rec.clips.map((c) => `${c.name} ${fmt(c.duration)}s`).join(' · ')));
  for (const m of rec.materials) kv(g6, 'Material', `${m.name} · ${m.type}${m.color ? ' · ' + m.color : ''}${m.maps.length ? ' · ' + m.maps.join(' ') : ''}`);
  g6.appendChild(el('p', 'note', 'Nodes: ' + rec.nodes.join(' · ')));
  kv(g6, 'Ladezeit', rec.loadMs != null ? rec.loadMs + ' ms' : '—');
  host.appendChild(g6);
}

/* ---------- Tabelle ---------- */
function renderTable() {
  const recs = [...state.records.values()].sort((a, b) =>
    familyRank(a.family) - familyRank(b.family) || a.name.localeCompare(b.name));
  const cols = ['Asset', 'Familie', 'Rolle', 'Name sagt', 'size x', 'size y', 'size z', 'bottom Y', 'top Y',
    'walk Y', 'Deckung', '+X', '−X', '+Z', '−Z', 'Unterseite', 'Dreiecke', 'Clips'];
  const t = el('table');
  const thead = el('thead'); const tr = el('tr');
  for (const c of cols) tr.appendChild(el('th', null, c));
  thead.appendChild(tr); t.appendChild(thead);
  const tb = el('tbody');
  for (const r of recs) {
    const row = el('tr');
    row.addEventListener('click', () => { setTab('grid'); select(r.name); });
    const cells = [r.name, r.family, r.role + (r.roleMismatch ? ' ⚠' : ''), r.nameHint || '—',
      fmt(r.size[0]), fmt(r.size[1]), fmt(r.size[2]), fmt(r.bottomY), fmt(r.topY),
      r.walkable ? fmt(r.walkable.y) : '—', r.walkable ? Math.round(r.walkable.coverage * 100) + ' %' : '—',
      r.sides.px.kind, r.sides.nx.kind, r.sides.pz.kind, r.sides.nz.kind,
      r.bottomClosure.kind, String(r.triangles), r.clips.length ? String(r.clips.length) : '—'];
    cells.forEach((v, i) => {
      const td = el('td', null, v);
      if (i === 0) td.className = 'strong';
      if (['JOIN', 'WALL', 'EDGE', 'OPEN', 'CLOSED', 'PARTIAL'].includes(v)) td.className = 'tag-' + v;
      row.appendChild(td);
    });
    tb.appendChild(row);
  }
  t.appendChild(tb);
  $('#table').innerHTML = '';
  $('#table').appendChild(t);
}

/* ---------- Fakten ---------- */
function renderFacts() {
  const f = state.gridFacts; if (!f) return;
  const host = $('#facts'); host.innerHTML = '';
  const recs = [...state.records.values()];
  const mismatches = recs.filter((r) => r.roleMismatch);
  const noWalk = recs.filter((r) => r.role !== 'PROP' && !r.walkable);
  const allOpen = recs.filter((r) => r.role === 'CENTER');
  const panels = recs.filter((r) => r.role?.startsWith('PANEL'));
  const openBottom = recs.filter((r) => r.family.startsWith('Modular Platforms') && r.bottomClosure.kind === 'OPEN');

  const b1 = el('div', 'fblock');
  b1.appendChild(el('h4', null, 'Raster, aus den Plattformteilen erschlossen'));
  kv(b1, 'Rasterschritt X', f.gridStepX ? `${fmt(f.gridStepX.value)}  (${f.gridStepX.count}/${f.platformCount} Teile, ${f.gridStepX.distinct} verschiedene Werte)` : '—');
  kv(b1, 'Rasterschritt Z', f.gridStepZ ? `${fmt(f.gridStepZ.value)}  (${f.gridStepZ.count}/${f.platformCount})` : '—');
  kv(b1, 'Modulhöhe Single Height', f.singleHeight ? `${fmt(f.singleHeight.value)}  (${f.singleHeight.count} Teile)` : '—');
  kv(b1, 'Modulhöhe 3D', f.tallHeight ? `${fmt(f.tallHeight.value)}  (${f.tallHeight.count} Teile)` : '—');
  kv(b1, 'Deckel (Höhe ≈ 0)', f.lids.length ? f.lids.map((l) => `${l.name} → ${fmt(l.height)}`).join(' · ') : 'keine', f.lids.length ? 'warn' : '');
  host.appendChild(b1);

  const b2 = el('div', 'fblock');
  b2.appendChild(el('h4', null, 'Zellklassen (gleicher Querschnitt = beliebig aneinandersetzbar)'));
  for (const c of f.cellClasses.slice(0, 12)) kv(b2, c.cell, `${c.pieces.length} Teile · ${c.pieces.slice(0, 6).join(', ')}${c.pieces.length > 6 ? ' …' : ''}`);
  host.appendChild(b2);

  const b3 = el('div', 'fblock');
  b3.appendChild(el('h4', null, 'Befunde, die die Grammatik bindet'));
  kv(b3, 'Teile mit Lauffläche', String(recs.filter((r) => r.walkable && r.role !== 'PROP').length));
  kv(b3, 'CENTER — vier Seiten ohne Geometrie', `${allOpen.length} · ${allOpen.map((r) => r.name).slice(0, 8).join(', ')}`, allOpen.length ? 'warn' : '');
  kv(b3, 'Paneele (eine Dimension ≈ 0)', `${panels.length} · ${panels.map((r) => `${r.name} [${r.role.replace('PANEL_', '')}]`).join(', ')}`);
  kv(b3, 'offene Unterseite', `${openBottom.length} · ${openBottom.map((r) => r.name).slice(0, 8).join(', ')}`, openBottom.length ? 'warn' : '');
  kv(b3, 'Plattformteil ohne waagerechte Deckfläche', noWalk.length ? noWalk.map((r) => r.name).join(', ') : 'keines');
  kv(b3, 'Rolle ≠ Dateiname', mismatches.length ? mismatches.map((r) => `${r.name} (${r.nameHint}→${r.role})`).join(', ') : 'keines', mismatches.length ? 'warn' : '');
  kv(b3, 'Ladefehler', state.failures.size ? [...state.failures.keys()].join(', ') : 'keine');
  host.appendChild(b3);

  const b4 = el('div', 'fblock');
  b4.appendChild(el('h4', null, 'Konsequenz für die Rekonstruktion (S1)'));
  const p = el('p', 'note');
  p.textContent =
    'Eine OPEN-Seite hat keine Geometrie — ein Center-Teil ist im Kit nur Deckel und Boden. Steht es am Inselrand, sieht man in die Insel hinein; genau das ist der Befund am verworfenen Project Island. ' +
    'Jeder Inselrand braucht deshalb ein Teil mit geschlossener Seite in Blickrichtung (SIDE/CORNER/SINGLE) oder ein Wandpaneel aus der 3D-Familie. ' +
    'Große, hohe Inseln werden im Kit als Kiste gebaut: Deckelpaneele oben, Wandpaneele an den Flanken, Bodenplatte unten — nicht als Stapel massiver Würfel. ' +
    'Der Rasterschritt oben ist das horizontale Maß, die Modulhöhen sind der vertikale Schritt. Requisiten stehen auf der gemessenen Laufflächen-Ebene, nicht auf maxY.';
  b4.appendChild(p);
  host.appendChild(b4);
}

/* ---------- Export ---------- */
function exportJson() {
  const recs = [...state.records.values()];
  const payload = {
    schema: 'kfb.platformer-poc.asset-atlas/1',
    gate: 'A · Asset Atlas S0',
    generated: new Date().toISOString(),
    pack: state.pack.pack, packId: state.pack.packId,
    repo: state.pack.repo, root: state.pack.root, commit: state.pack.commit,
    method: {
      triangles: 'Weltraum-Dreiecke je Mesh, skinned ausgenommen',
      normalTolerance: 0.985, planeTolerance: 0.02, yBucket: 0.01,
      walkable: 'größte nach oben zeigende waagerechte Ebene (nicht maxY)',
      side: 'zugewandte Fläche / Querschnitt < .02 → OPEN; flache Fläche in der Box-Ebene ≥ .85 → WALL; zugewandt ≥ .3 → EDGE',
    },
    counts: { entries: state.entries.length, measured: recs.length, failed: state.failures.size },
    gridFacts: state.gridFacts,
    failures: Object.fromEntries(state.failures),
    neighbours: state.neighbours ? Object.fromEntries(state.neighbours) : null,
    assets: recs,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'platformer-kit-atlas.json';
  a.click();
  URL.revokeObjectURL(a.href);
}

/* ---------- Tabs, Filter ---------- */
function setTab(t) {
  state.tab = t;
  for (const b of document.querySelectorAll('#tabs button')) b.classList.toggle('on', b.dataset.tab === t);
  $('#grid').hidden = t !== 'grid';
  $('#table').hidden = t !== 'table';
  $('#facts').hidden = t !== 'facts';
  $('#detail').classList.toggle('wide', t !== 'grid');
}

function wireUi() {
  $('#tabs').addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) setTab(b.dataset.tab); });
  $('#export').addEventListener('click', exportJson);
  $('#famsel').addEventListener('change', (e) => { state.family = e.target.value; applyFilter(); });
  $('#onlyplat').addEventListener('change', (e) => { state.onlyPlatforms = e.target.checked; applyFilter(); });
  for (const cb of document.querySelectorAll('[data-overlay]')) {
    cb.addEventListener('change', () => {
      state.overlays[cb.dataset.overlay] = cb.checked;
      if (state.selected) buildOverlays(state.records.get(state.selected), viewerNode);
    });
  }
}

/* ---------- Start ---------- */
async function boot() {
  const idx = await fetch('data/pack-index.json').then((r) => r.json());
  state.pack = idx;
  state.entries = Object.entries(idx.files)
    .map(([name, path]) => ({ name, path, family: familyOf(path) }))
    .sort((a, b) => familyRank(a.family) - familyRank(b.family) || a.name.localeCompare(b.name));
  $('#packname').textContent = idx.pack;
  $('#packmeta').textContent = `${state.entries.length} glTF · ${idx.repo} @ ${idx.commit.slice(0, 7)}`;
  $('#prevlink1').href = raw(idx.commit, idx.root + 'Preview.jpg');
  $('#prevlink2').href = raw(idx.commit, idx.root + 'Preview2.jpg');

  const fams = [...new Set(state.entries.map((e) => e.family))].sort((a, b) => familyRank(a) - familyRank(b));
  for (const f of fams) {
    const o = el('option', null, f); o.value = f; $('#famsel').appendChild(o);
  }
  buildGrid();
  wireUi();
  setTab('grid');
  progress();
  frame();
  window.__atlas = state; // Probe-Haken für tests/probe.js und Messabfragen
  runQueue(4).then(() => { if (!state.selected) select('Cube_Grass_Center'); });
}

function frame() {
  requestAnimationFrame(frame);
  if (captureQueue.length) renderThumb(captureQueue.shift());
  const host = $('#viewer');
  const w = host.clientWidth, h = host.clientHeight;
  if (w < 4 || h < 4) return;
  if (viewCam.aspect !== w / h) { viewCam.aspect = w / h; viewCam.updateProjectionMatrix(); }
  setSize(w, h);
  controls.update();
  renderer.render(viewScene, viewCam);
}

boot().catch((e) => {
  document.body.insertAdjacentHTML('afterbegin',
    `<div class="fatal"><b>Boot fehlgeschlagen</b><span>${e.message}</span></div>`);
  console.error(e);
});
