/* KFB WorldBuilder v1 · Host
   Ein Planet, ein Picker, ein Anfasser (edit-layer.js), eine Höhenwahrheit (planet.heightAt).
   Kamera: EIN Parameter `alt` (0 Boden … 1 Orbit) fährt Abstand, Neigung und Kamera-Oben
   gemeinsam — der Flug Orbit ⇄ Boden ist deshalb eine einzige stetige Bewegung, keine Stufen. */

import * as THREE from 'three';
import * as LOOK from './wd-look.js';
import { createInk } from './wd-ink.js';
import * as REG from './wd-registry.js';
import { mountAsset } from './wd-donors.js';
import { makePlanet, applyGroundLook, removeGroundLook, GROUND_LOOK, URL_SCULPT, PIN_WB2, R, DEF as PLANET_DEF, latLonToDir } from './wb1-planet.js';
import { makeSky } from './wb1-sky.js';
import { loadBuildings, buildView, placeOnPlanet, VIEWS, frameAt } from './wb1-buildings.js';
import { makeActor, ACTOR } from './wb1-actor.js';

const URL_EDIT = 'https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@' + PIN_WB2 + '/tools/KFB-ToolBox/lib/edit-layer.js';
const STORAGE_KEY = 'kfb-wb1-planet-01';
const FONT = "'JetBrains Mono',ui-monospace,monospace";
const MONO = '400 11px/1.45 ' + FONT;
const INK = '#e7dfd0', GOLD = '#ffd9a0', RED = '#ff9a86', OK = '#a8d59a', DIM = 'rgba(231,223,208,.58)';
const LINE = 'rgba(231,223,208,.16)', BG = '#17151d', BG2 = '#1d1a24';
const PROPS = window.__wbProps || {};

const mk = (tag, css, text) => { const el = document.createElement(tag); if (css) el.style.cssText = css; if (text != null) el.textContent = text; return el; };
const CHIP = (on) => 'font:' + MONO + ';font-size:10px;padding:5px 8px;cursor:pointer;background:' + (on ? 'rgba(255,217,160,.12)' : 'rgba(255,255,255,.04)') + ';border:1px solid ' + (on ? GOLD : LINE) + ';color:' + (on ? GOLD : INK);
const smooth = (t) => t * t * (3 - 2 * t);
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

/* ---------- Gerüst ---------- */
const panel = mk('div', 'position:fixed;z-index:30;box-sizing:border-box;background:' + BG + ';color:' + INK + ';font:' + MONO + ';overflow:auto;padding:10px;display:flex;flex-direction:column;gap:8px;border-right:1px solid ' + LINE);
const stage = mk('div', 'position:fixed;z-index:0;overflow:hidden;background:#0c0a12');
const canvas = mk('canvas', 'display:block;width:100%;height:100%;touch-action:none;outline:none');
canvas.tabIndex = 0;
stage.appendChild(canvas);
const status = mk('div', 'position:absolute;left:10px;right:10px;bottom:10px;font:' + MONO + ';color:' + INK + ';pointer-events:none;display:flex;gap:8px;flex-wrap:wrap;align-items:flex-end');
const statusTxt = mk('div', 'background:rgba(23,21,29,.84);border:1px solid ' + LINE + ';padding:5px 8px;max-width:100%');
const hudTxt = mk('div', 'background:rgba(23,21,29,.84);border:1px solid ' + LINE + ';padding:5px 8px;color:' + GOLD + ';margin-left:auto');
status.append(statusTxt, hudTxt);
stage.appendChild(status);
const objmenu = mk('div', 'position:absolute;z-index:10;display:flex;gap:3px;padding:3px;background:#14130fee;border:1px solid #4a4433;transform:translate(-50%,0)');
objmenu.hidden = true;
for (const [m, t, tip] of [['translate', '✥', 'Move (g)'], ['rotate', '⟳', 'Rotate (r)'], ['scale-down', '−', 'Smaller ×0.8'], ['scale-up', '+', 'Larger ×1.25'], ['floor', '⬓', 'Drop onto the planet surface'], ['space', '⊹', 'World / local axes'], ['close', '✕', 'Clear selection (Esc)']]) {
  const b = mk('button', 'width:28px;height:28px;padding:0;font:13px/1 ' + FONT + ';cursor:pointer;background:#2a261d;color:' + INK + ';border:1px solid #554d3d', t);
  b.dataset.m = m; b.title = tip; objmenu.appendChild(b);
}
stage.appendChild(objmenu);
document.body.append(stage, panel);
const say = (t, kind) => { statusTxt.textContent = t; statusTxt.style.color = kind === 'bad' ? RED : kind === 'ok' ? OK : INK; };

function layout() {
  const w = innerWidth, h = innerHeight, narrow = w < 760;
  if (narrow) {
    const ph = Math.round(h * 0.44);
    Object.assign(panel.style, { left: '0', right: '0', top: (h - ph) + 'px', bottom: '0', width: 'auto', borderRight: 'none', borderTop: '1px solid ' + LINE });
    Object.assign(stage.style, { left: '0', right: '0', top: '0', bottom: ph + 'px' });
  } else {
    const pw = Math.min(340, Math.max(280, w * 0.26));
    Object.assign(panel.style, { left: '0', top: '0', bottom: '0', width: pw + 'px', right: 'auto', borderTop: 'none', borderRight: '1px solid ' + LINE });
    Object.assign(stage.style, { left: pw + 'px', right: '0', top: '0', bottom: '0' });
  }
  requestAnimationFrame(resize);
}

/* ---------- Donor-Protokoll (jede Zeile sichtbar) ---------- */
const DONORS = [];
const donorBox = mk('div', 'display:flex;flex-direction:column;gap:2px;font-size:10px;line-height:1.4');
function log(line, bad) {
  DONORS.push({ line, bad: !!bad });
  console.info('[wb1]', line);
  const r = mk('div', 'color:' + (bad || /FAIL|NOT |nicht/i.test(line) ? RED : INK) + ';word-break:break-word', (bad || /FAIL/i.test(line) ? '✗ ' : '✓ ') + line);
  donorBox.appendChild(r);
  if (DONORS.length < 40) say(line);
}

/* ---------- Renderer / Szene / Kamera ---------- */
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5));
renderer.outputColorSpace = THREE.SRGBColorSpace;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(48, 1, 0.01, 320);
let ink = null;
function resize() {
  const w = Math.max(2, stage.clientWidth), h = Math.max(2, stage.clientHeight);
  renderer.setSize(w, h, false);
  camera.aspect = w / h; camera.updateProjectionMatrix();
  if (ink) ink.setSize(w, h);
}
addEventListener('resize', layout);

/* ---------- Zustand ---------- */
const UI = {
  sculpt: 'off', radius: 3, strength: 0.12, placing: null, walk: false, ink: PROPS.ink ?? true, look: true,
  tile: PROPS.tile === 'GENERATOR' ? 'gen' : 'ref', view: 'elastic', palSeed: 20260924, eyes: true, snap: false, gizmoSpace: 'local',
  open: { donors: true, cam: true, terrain: true, objects: true, sky: true, buildings: true, actor: true, surface: false, save: true }
};
const keys = { f: false, b: false, l: false, r: false, run: false };
let S = null, planet = null, sky = null, EDIT = null, look = null, actor = null, B = null, bView = null;
const buildingRoot = new THREE.Group(); buildingRoot.name = 'content:buildings';
const objRoot = new THREE.Group(); objRoot.name = 'content:objects';
scene.add(buildingRoot, objRoot);
/* Hürth an seiner echten Stelle auf der Erdvorlage (50,873° N · 6,870° O). Bei R 400 m ist 1° ≈ 7 m:
   die Figur startet 40 m östlich des Blocks (≈ Böhmen), sicher auf Land. */
const HUERTH = { lat: 50.873, lon: 6.870 };
const VILLAGE_DIR = latLonToDir(HUERTH.lat, HUERTH.lon);
function offsetDir(base, eastM, northM) {
  const F = frameAt(base);
  return F.up.clone().multiplyScalar(R).addScaledVector(F.e, eastM).addScaledVector(F.n, northM).normalize();
}
const START_DIR = offsetDir(VILLAGE_DIR, 40, -4);
const START_FWD = frameAt(START_DIR).n.toArray();
const objs = new Map();
let objN = 0;

/* ---------- Kamera: ein Parameter ---------- */
const cam = { f: START_DIR.clone(), F: new THREE.Vector3(0, 0, -1), alt: PROPS.start === 'GROUND' ? 0 : 1, enabled: true, tw: null, yawOff: 0 };
const GROUND_D = 7, ORBIT_D = R * 3.1;
const _S = new THREE.Vector3(), target = new THREE.Vector3(), _a = new THREE.Vector3(), _b = new THREE.Vector3();
function camApply() {
  const up = cam.f;
  cam.F.addScaledVector(up, -cam.F.dot(up));
  if (cam.F.lengthSq() < 1e-8) cam.F.copy(frameAt(up).n);
  cam.F.normalize();
  planet.surface(up, _S);
  const s = smooth(cam.alt), d = GROUND_D * Math.pow(ORBIT_D / GROUND_D, cam.alt);
  const pitch = 0.3 + (Math.PI / 2 - 0.3) * s;
  target.copy(_S).addScaledVector(up, 1.0 * (1 - s));
  camera.position.copy(target).addScaledVector(up, Math.sin(pitch) * d).addScaledVector(cam.F, -Math.cos(pitch) * d);
  const cl = camera.position.length(), gh = R + planet.groundAt(camera.position) + 0.35;
  if (cl < gh) camera.position.multiplyScalar(gh / cl);
  camera.up.copy(up).multiplyScalar(1 - s).addScaledVector(cam.F, s).normalize();
  camera.lookAt(target);
  const near = clamp(d * 0.012, 0.06, 12), far = camera.position.length() + R * 1.6;
  if (Math.abs(camera.near - near) > 1e-3 || Math.abs(camera.far - far) > 1) { camera.near = near; camera.far = far; camera.updateProjectionMatrix(); }
}
function flyTo(a1, dur = 2.6) { cam.tw = { a0: cam.alt, a1, t: 0, dur }; }
let drag = null;
canvas.addEventListener('contextmenu', (e) => e.preventDefault());
function camDown(e) {
  if (!cam.enabled || !planet) return;
  drag = { x: e.clientX, y: e.clientY, btn: e.button, shift: e.shiftKey };
}
function camMove(e) {
  if (!drag || !cam.enabled) return;
  const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
  drag.x = e.clientX; drag.y = e.clientY;
  cam.tw = null;
  if (drag.btn === 2 || drag.shift || UI.walk) {
    if (UI.walk) cam.yawOff -= dx * 0.006; else cam.F.applyAxisAngle(cam.f, -dx * 0.006);
    cam.alt = clamp(cam.alt + dy * 0.0025, 0, 1);
    return;
  }
  const d = GROUND_D * Math.pow(ORBIT_D / GROUND_D, cam.alt);
  const k = (d * 0.85 + 0.15) / Math.max(200, canvas.clientHeight) / R * 1.25;
  _a.crossVectors(cam.f, cam.F).normalize();                   // Drehachse: Fokus Richtung F
  const right = _b.crossVectors(cam.F, cam.f).normalize();
  const axR = new THREE.Vector3().crossVectors(cam.f, right).normalize();
  const q = new THREE.Quaternion().setFromAxisAngle(_a, dy * k).multiply(new THREE.Quaternion().setFromAxisAngle(axR, -dx * k));
  cam.f.applyQuaternion(q).normalize();
  cam.F.applyQuaternion(q);
}
function camUp() { drag = null; }
function onWheel(e) {
  e.preventDefault();
  if (UI.sculpt !== 'off') {
    UI.radius = clamp(UI.radius * Math.exp(-e.deltaY * 0.0015), 0.45, 30);
    paint.radius && paint.radius();
    showBrush(lastBrushHit);
    return;
  }
  cam.tw = null;
  cam.alt = clamp(cam.alt + e.deltaY * 0.0011, 0, 1);
}

/* ---------- Sculpt (WB2-Bedienung, Kugelpunkte) ---------- */
const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
let stroke = null, strokePid = null, lastBrushHit = null;
const brush = new THREE.Mesh(new THREE.RingGeometry(0.93, 1.0, 64), new THREE.MeshBasicMaterial({ color: 0xffd27a, transparent: true, opacity: 0.95, side: THREE.DoubleSide, depthTest: false }));
brush.visible = false; brush.renderOrder = 60; brush.userData.kfbSkip = true;
scene.add(brush);
function rayFrom(e) {
  const r = canvas.getBoundingClientRect();
  ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
  ray.setFromCamera(ndc, camera);
  return ray.ray;
}
function showBrush(p) {
  if (!p || UI.sculpt === 'off') { brush.visible = false; return; }
  brush.visible = true;
  const n = p.clone().normalize();
  brush.position.copy(p).addScaledVector(n, 0.06);
  brush.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), n);
  brush.scale.setScalar(UI.radius);
}
function sculptPoint(p) {
  const onR = p.clone().normalize().multiplyScalar(R);
  if (!planet.ops.add(stroke, onR, S.pointSpacing(stroke.radius, 0.82))) return;
  planet.dab(stroke.mode, onR, stroke.radius, stroke.strength);
}
canvas.addEventListener('pointerdown', (e) => {
  if (UI.sculpt === 'off' || !planet) return;
  const p = planet.hit(rayFrom(e));
  if (!p || e.button !== 0) return;
  e.preventDefault(); e.stopImmediatePropagation();
  strokePid = e.pointerId;
  try { canvas.setPointerCapture(e.pointerId); } catch { /* */ }
  stroke = S.makeStroke(UI.sculpt, UI.radius, UI.strength);
  sculptPoint(p);
}, { capture: true });
canvas.addEventListener('pointermove', (e) => {
  if (UI.sculpt === 'off' || !planet) return;
  const p = planet.hit(rayFrom(e));
  lastBrushHit = p; showBrush(p);
  if (strokePid === e.pointerId && stroke && p) { e.preventDefault(); e.stopImmediatePropagation(); sculptPoint(p); }
}, { capture: true });
function endStroke(e, cancel) {
  if (strokePid !== e.pointerId) return;
  e.preventDefault(); e.stopImmediatePropagation();
  try { canvas.releasePointerCapture(e.pointerId); } catch { /* */ }
  if (cancel) planet.rebuild(false);
  else if (stroke && stroke.points.length) {
    planet.params.sculpt.strokes.push(stroke);
    say(stroke.mode + ' sculpt stroke · ' + stroke.points.length + ' dabs · radius ' + stroke.radius.toFixed(2), 'ok');
  }
  stroke = null; strokePid = null;
  afterTerrain();
}
canvas.addEventListener('pointerup', (e) => endStroke(e, false), { capture: true });
canvas.addEventListener('pointercancel', (e) => endStroke(e, true), { capture: true });
canvas.addEventListener('pointerleave', () => { if (strokePid == null) brush.visible = false; });
function afterTerrain() {
  if (B && bView) placeOnPlanet(buildingRoot, bView, B, planet, VILLAGE_DIR);
  paint.terrain && paint.terrain();
}
function setSculpt(m) {
  UI.sculpt = m === 'raise' || m === 'lower' ? m : 'off';
  UI.placing = null;
  if (EDIT) { if (UI.sculpt === 'off') EDIT.setOn(true); else { EDIT.clear(); EDIT.setOn(false); } }
  brush.visible = false;
  repaint();
  say(UI.sculpt === 'off' ? 'object edit · click an object to select' : UI.sculpt + ' brush · drag on the planet · mouse wheel = radius', 'ok');
}

/* ---------- Objekte (Registry → mountAsset → ein Anfasser) ---------- */
const CATALOG = [
  /* Nativer Massstab (Meter) — nichts wird eingepasst; die gemessene Grösse steht im Protokoll */
  { id: 'house', label: 'House', slug: 'tiny-treats-homely-house-1-0-free', pats: [/^house$/i, /^house/i, /house/i] },
  { id: 'tree', label: 'Tree', slug: 'kaykit-forest-nature-pack-1-0-free', pats: [/^Tree_1_A_Color1$/i, /^Tree_1/i, /^Tree_/i, /tree/i] },
  /* Fels = WB2-Boulder (Rock_3_E_Color1). Das Quaternius-Paket hat nur Kiesel und Wegplatten, keinen Fels. */
  { id: 'rock', label: 'Rock', slug: 'kaykit-forest-nature-pack-1-0-free', pats: [/^Rock_3_E_Color1$/i, /^Rock_3/i, /^Rock_/i] },
  { id: 'pebble', label: 'Pebble', slug: 'rocks-pebbles-path-tiles-by-quaternius', pats: [/^Pebble Round/i, /^Pebble/i] },
  { id: 'lamp', label: 'Lamp', slug: 'tiny-treats-pretty-park-1-0-free', pats: [/^street_lantern$/i, /lantern/i, /lamp/i] }
];
const resolved = new Map();
async function resolveCat(c) {
  if (!resolved.has(c.id)) resolved.set(c.id, REG.pick(c.slug, ...c.pats).then((a) => {
    if (!a) throw new Error('registry ' + c.slug + ': no name match');
    log('registry · ' + c.label + ' → ' + a.path.split('/').pop() + ' @' + String(REG.revOf(a)).slice(0, 8) + ' (packs/' + c.slug + '.json)');
    return a;
  }).catch((e) => { resolved.delete(c.id); throw e; }));
  return resolved.get(c.id);
}
const recordOf = (n) => { const id = n && n.userData && n.userData.sceneObjectId; return id && objs.has(id) ? objs.get(id).rec : null; };
function writeRec(root) {
  const o = objs.get(root.userData.sceneObjectId);
  if (!o) return;
  o.rec.transform = {
    position: root.position.toArray().map((v) => +v.toFixed(5)),
    quaternion: root.quaternion.toArray().map((v) => +v.toFixed(6)),
    scale: root.scale.toArray().map((v) => +v.toFixed(4))
  };
}
async function addObject(rec) {
  const c = CATALOG.find((x) => x.id === rec.catalog);
  if (!c) throw new Error('unknown catalog id ' + rec.catalog);
  const a = await resolveCat(c);
  const r = await mountAsset(a);
  const model = r.node;
  model.updateMatrixWorld(true);
  const bx = new THREE.Box3().setFromObject(model), sz = bx.getSize(new THREE.Vector3());
  if (!c.sized) { c.sized = true; log('object · ' + c.label + ' native size ' + sz.toArray().map((v) => v.toFixed(2)).join(' × ') + ' m'); }
  const cx = (bx.min.x + bx.max.x) / 2, cz = (bx.min.z + bx.max.z) / 2;
  model.position.x -= cx; model.position.z -= cz; model.position.y -= bx.min.y;
  model.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  const root = new THREE.Group();
  root.name = rec.name; root.userData.sceneObjectId = rec.id;
  root.add(model);
  rec.source = { slug: c.slug, path: a.path, commit: REG.revOf(a) };
  const T = rec.transform || {};
  if (T.dir) {
    const dir = new THREE.Vector3().fromArray(T.dir).normalize(), F = frameAt(dir);
    const m4 = new THREE.Matrix4().makeBasis(F.e, F.up, F.n.clone().negate());
    root.quaternion.setFromRotationMatrix(m4).multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), T.yaw || 0));
    planet.surface(dir, root.position);
    root.scale.setScalar(T.scale || 1);
  } else {
    root.position.fromArray(T.position || [0, R, 0]);
    root.quaternion.fromArray(T.quaternion || [0, 0, 0, 1]);
    root.scale.fromArray(T.scale || [1, 1, 1]);
  }
  objRoot.add(root);
  objs.set(rec.id, { rec, root });
  writeRec(root);
  const num = parseInt(String(rec.id).split('-').pop(), 10);
  if (Number.isFinite(num)) objN = Math.max(objN, num);
  return root;
}
function dropRoots(list) {
  const out = [];
  const up = new THREE.Vector3();
  for (const root of list) {
    const dir = root.position.clone().normalize();
    up.set(0, 1, 0).applyQuaternion(root.quaternion);
    root.quaternion.premultiply(new THREE.Quaternion().setFromUnitVectors(up.normalize(), dir));
    const before = root.position.length();
    planet.surface(dir, root.position);
    root.updateMatrixWorld(true);
    writeRec(root);
    out.push(root.name + ': dropped ' + (root.position.length() - before).toFixed(3) + ' onto planet surface (radial, upright)');
  }
  return out;
}
function removeSelected() {
  const sel = EDIT ? EDIT.selection : [];
  if (!sel.length) { say('nothing selected'); return; }
  for (const r of sel) { objRoot.remove(r); objs.delete(r.userData.sceneObjectId); }
  EDIT.clear();
  say('removed ' + sel.length + ' object(s)', 'ok');
  repaint();
}

/* ---------- Speichern / Laden ---------- */
function sceneDoc() {
  for (const { root } of objs.values()) writeRec(root);
  return {
    format: 'kfb-worldbuilder-scene', version: 1, id: 'wb1-planet-01', savedAt: new Date().toISOString(),
    planet: { radius: R, seed: planet.params.seed, height: planet.params.height, macroScale: planet.params.macroScale, detail: planet.params.detail, sculpt: JSON.parse(JSON.stringify(planet.params.sculpt)) },
    sky: { time: sky ? sky.S.time : 'day', rain: sky ? sky.S.rain : false, cycle: sky ? sky.S.cycle : false, mood: sky ? sky.S.mood : 'verdant' },
    buildings: { view: UI.view, palette: UI.palSeed ? { kind: 'cologne-harmonic', seed: UI.palSeed } : { kind: 'KFB_WONKY_90S_CLAY_V1' }, villageDir: VILLAGE_DIR.toArray().map((n) => +n.toFixed(5)) },
    actor: actor ? actor.doc() : null,
    surface: { ink: UI.ink, look: UI.look, tile: UI.tile },
    objects: [...objs.values()].map((o) => o.rec),
    sources: {
      terrainSculpt: 'tools/KFB-ToolBox/worldbuilder/wb2-terrain-sculpt-01/terrain-sculpt.js@' + PIN_WB2,
      sceneEdit: 'tools/KFB-ToolBox/lib/edit-layer.js@' + PIN_WB2,
      noise: 'ZyFou/ProceduralTerrains@f58a8ddb81d1fbb526a41282a9a7e9c05c2d2070 (MIT, via WB2 subset)'
    }
  };
}
function save() {
  const d = sceneDoc();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(d));
  say('saved · ' + d.objects.length + ' objects · ' + d.planet.sculpt.strokes.length + ' sculpt strokes · ' + d.savedAt, 'ok');
  repaint();
}
async function applyDoc(d) {
  if (!d || d.format !== 'kfb-worldbuilder-scene' || d.id !== 'wb1-planet-01') throw new Error('unexpected scene document');
  EDIT && EDIT.clear();
  const p = d.planet || {};
  Object.assign(planet.params, { seed: p.seed ?? PLANET_DEF.seed, height: p.height ?? PLANET_DEF.height, macroScale: p.macroScale ?? PLANET_DEF.macroScale, detail: p.detail ?? PLANET_DEF.detail, sculpt: p.sculpt || { strokes: [] } });
  planet.ops.ensure(planet.params);
  planet.rebuild(true);
  if (sky && d.sky) { sky.setTime(d.sky.time || 'day'); sky.setRain(!!d.sky.rain); if (d.sky.cycle) sky.setCycle(true); sky.setMood(d.sky.mood || 'verdant'); }
  if (d.surface) { UI.ink = d.surface.ink !== false; UI.look = d.surface.look !== false; UI.tile = d.surface.tile || 'ref'; await applyLook(); }
  if (d.buildings) { UI.view = d.buildings.view || 'elastic'; UI.palSeed = d.buildings.palette && d.buildings.palette.seed ? d.buildings.palette.seed : 0; rebuildBuildings(); }
  for (const { root } of objs.values()) objRoot.remove(root);
  objs.clear();
  objN = 0;
  for (const rec of d.objects || []) { try { await addObject(JSON.parse(JSON.stringify(rec))); } catch (e) { log('object ' + rec.id + ' · FAILED · ' + e.message, true); } }
  if (actor && d.actor && d.actor.dir) { actor.setPose(d.actor.dir, d.actor.forward); UI.eyes = d.actor.eyes !== false; actor.setEyesVisible(UI.eyes); }
  afterTerrain();
  repaint();
}
async function loadSaved() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) { say('no saved scene found', 'bad'); return; }
  try { const d = JSON.parse(raw); await applyDoc(d); say('saved scene loaded · ' + (d.savedAt || '') + ' · keep editing', 'ok'); }
  catch (e) { say('load failed · ' + e.message, 'bad'); }
}
const at = (e, n) => offsetDir(START_DIR, e, n).toArray().map((v) => +v.toFixed(6));
const DEFAULT_OBJECTS = [
  { id: 'house-1', catalog: 'house', name: 'House', transform: { dir: at(-9, 10), yaw: 2.6 } },
  { id: 'tree-2', catalog: 'tree', name: 'Tree', transform: { dir: at(8, 12), yaw: 0.4 } },
  { id: 'tree-3', catalog: 'tree', name: 'Tree', transform: { dir: at(-15, -4), yaw: 1.9 } },
  { id: 'rock-4', catalog: 'rock', name: 'Rock', transform: { dir: at(4, 4), yaw: 0.9 } },
  { id: 'lamp-5', catalog: 'lamp', name: 'Lamp', transform: { dir: at(-2.5, 5), yaw: 0 } }
];
async function resetScene() {
  await applyDoc({ format: 'kfb-worldbuilder-scene', id: 'wb1-planet-01', planet: { ...PLANET_DEF, sculpt: { strokes: [] } }, sky: { time: 'day', mood: 'verdant' }, surface: { ink: UI.ink, look: true, tile: UI.tile }, buildings: { view: 'elastic', palette: { seed: 20260924 } }, objects: DEFAULT_OBJECTS, actor: { dir: START_DIR.toArray(), forward: START_FWD, eyes: true } });
  say('fixture reset (local save untouched)', 'ok');
}

/* ---------- Oberfläche / Gebäude ---------- */
async function applyLook() {
  if (!planet) return;
  if (UI.look) { const lab = await applyGroundLook([planet.mesh, planet.patch], look, UI.tile); say('ground look · ' + lab + ' · triplanar RGB palette + macro + cel', 'ok'); }
  else removeGroundLook([planet.mesh, planet.patch]);
  if (ink) ink.setEnabled(UI.ink);
}
function rebuildBuildings() {
  if (!B) return;
  bView = buildView(B, UI.view, UI.palSeed);
  placeOnPlanet(buildingRoot, bView, B, planet, VILLAGE_DIR);
  say('buildings · ' + VIEWS.find((v) => v[1] === UI.view)[0] + ' · ' + bView.items.length + ' Hürth buildings · palette ' + (bView.palette.seed ? 'harmonic seed ' + bView.palette.seed + ' (' + bView.palette.scheme + ')' : bView.palette.kind), 'ok');
}

/* ---------- Panel ---------- */
const paint = {};
function section(title, key, badge) {
  const wrap = mk('div', 'display:flex;flex-direction:column;border:1px solid ' + LINE + ';background:rgba(255,255,255,.015)');
  const head = mk('button', 'font:600 9px/1.4 ' + FONT + ';letter-spacing:.14em;text-transform:uppercase;color:' + GOLD + ';background:none;border:none;padding:7px 8px;cursor:pointer;display:flex;gap:6px;align-items:center;width:100%;text-align:left');
  head.innerHTML = '<span style="flex:1">' + title + '</span>' + (badge ? '<span style="color:' + DIM + ';letter-spacing:.04em;text-transform:none;font-weight:400">' + badge + '</span>' : '') + '<span>' + (UI.open[key] ? '–' : '+') + '</span>';
  const body = mk('div', 'display:' + (UI.open[key] ? 'flex' : 'none') + ';flex-direction:column;gap:6px;padding:0 8px 9px');
  head.onclick = () => { UI.open[key] = !UI.open[key]; repaint(); };
  wrap.append(head, body);
  panel.appendChild(wrap);
  return body;
}
const note = (p, t) => { const n = mk('div', 'font-size:10px;color:' + DIM + ';line-height:1.45', t); p.appendChild(n); return n; };
function chips(p, items, isOn, pick) {
  const box = mk('div', 'display:flex;flex-wrap:wrap;gap:4px');
  for (const it of items) { const b = mk('button', CHIP(isOn(it)), Array.isArray(it) ? it[0] : it); b.onclick = () => pick(it); box.appendChild(b); }
  p.appendChild(box);
  return box;
}
function slider(p, label, min, max, step, val, onIn, fmt = (v) => v.toFixed(2)) {
  const row = mk('div', 'display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.3fr) 40px;gap:6px;align-items:center');
  const inp = mk('input', 'width:100%;margin:0;accent-color:' + GOLD);
  inp.type = 'range'; inp.min = min; inp.max = max; inp.step = step; inp.value = val;
  const num = mk('div', 'font-size:10px;text-align:right;color:' + GOLD, fmt(+val));
  inp.oninput = () => { num.textContent = fmt(+inp.value); onIn(+inp.value); };
  row.append(mk('div', 'font-size:10px;opacity:.85', label), inp, num);
  p.appendChild(row);
  return { inp, num };
}
function repaint() {
  const keep = panel.scrollTop;
  panel.textContent = '';
  const title = mk('div', 'display:flex;flex-direction:column;gap:2px;padding:2px 2px 4px');
  title.append(mk('div', 'font:600 12px/1.3 ' + FONT + ';letter-spacing:.12em;color:' + GOLD, 'KFB WORLDBUILDER v1'), mk('div', 'font-size:10px;color:' + DIM, 'planet · terrain · objects · sky · walk'));
  panel.appendChild(title);

  let b = section('View · camera', 'cam', cam.alt > 0.5 ? 'orbit' : 'ground');
  chips(b, [['↓ FLY TO GROUND', 0], ['↑ FLY TO ORBIT', 1]], (it) => Math.round(cam.alt) === it[1], (it) => { flyTo(it[1]); say('continuous flight · alt ' + cam.alt.toFixed(2) + ' → ' + it[1], 'ok'); });
  const altS = slider(b, 'Altitude', 0, 1, 0.001, cam.alt, (v) => { cam.tw = null; cam.alt = v; }, (v) => (v > 0.5 ? 'orbit ' : 'ground ') + v.toFixed(2));
  paint.alt = () => { altS.inp.value = cam.alt; altS.num.textContent = (cam.alt > 0.5 ? 'orbit ' : 'ground ') + cam.alt.toFixed(2); };
  note(b, 'Drag = move over the planet · right-drag / shift-drag = turn + altitude · wheel = altitude. One parameter drives distance, tilt and camera-up together.');

  b = section('Terrain · sculpt', 'terrain', planet ? planet.params.sculpt.strokes.length + ' strokes' : '');
  chips(b, [['OBJECT EDIT', 'off'], ['RAISE', 'raise'], ['LOWER', 'lower']], (it) => UI.sculpt === it[1], (it) => setSculpt(it[1]));
  const rS = slider(b, 'Brush radius m (wheel)', 0.45, 30, 0.05, UI.radius, (v) => { UI.radius = v; showBrush(lastBrushHit); });
  paint.radius = () => { rS.inp.value = UI.radius; rS.num.textContent = UI.radius.toFixed(2); };
  slider(b, 'Strength / dab m', 0.01, 1.5, 0.01, UI.strength, (v) => { UI.strength = v; });
  const row = chips(b, [['UNDO STROKE', 'undo'], ['CLEAR SCULPT', 'clear']], () => false, (it) => {
    const st = planet.params.sculpt.strokes;
    if (!st.length) { say(it[1] === 'undo' ? 'no sculpt stroke to undo' : 'sculpt layer already clear'); return; }
    if (it[1] === 'undo') st.pop(); else st.length = 0;
    planet.rebuild(false); afterTerrain(); repaint();
    say(it[1] === 'undo' ? 'last sculpt stroke undone' : 'sculpt layer cleared · procedural base restored', 'ok');
  });
  row.appendChild(mk('span', 'font-size:10px;color:' + DIM + ';align-self:center', planet ? planet.params.sculpt.strokes.length + ' strokes' : ''));
  paint.terrain = () => { if (row.lastChild) row.lastChild.textContent = planet.params.sculpt.strokes.length + ' strokes'; };
  const seedRow = mk('div', 'display:flex;gap:6px;align-items:center');
  const seedIn = mk('input', 'width:90px;font:' + MONO + ';background:' + BG2 + ';color:' + INK + ';border:1px solid ' + LINE + ';padding:4px');
  seedIn.type = 'number'; seedIn.setAttribute('value', String(planet ? planet.params.seed : PLANET_DEF.seed)); seedIn.value = String(planet ? planet.params.seed : PLANET_DEF.seed);
  const regen = mk('button', CHIP(false), 'REGENERATE BASE');
  regen.onclick = () => { planet.setParams({ seed: Math.trunc(+seedIn.value) || 1 }); afterTerrain(); say('base regenerated from seed ' + planet.params.seed + ' · sculpt strokes kept', 'ok'); };
  seedRow.append(mk('span', 'font-size:10px', 'Seed'), seedIn, regen);
  b.appendChild(seedRow);
  note(b, 'finalHeight = baseHeight(seed) + sculptDelta, along the sphere normal. Base = stylised-Earth template + WB2 terrain (seed · 2.6 · 3.2 · 0.55). Soft C2 falloff (WB2 brushWeight). Metres throughout.');

  b = section('Objects', 'objects', objs.size + ' placed');
  chips(b, CATALOG.map((c) => [c.label.toUpperCase(), c.id]), (it) => UI.placing === it[1], (it) => {
    if (UI.sculpt !== 'off') setSculpt('off');
    UI.placing = UI.placing === it[1] ? null : it[1];
    repaint();
    say(UI.placing ? 'click on the planet to place a ' + it[0].toLowerCase() : 'placing off');
  });
  chips(b, [['REMOVE SELECTED', 'rm'], [UI.snap ? 'SNAP ON' : 'SNAP OFF', 'snap']], (it) => it[1] === 'snap' && UI.snap, (it) => {
    if (it[1] === 'rm') removeSelected();
    else { UI.snap = !UI.snap; EDIT.setSnap(UI.snap); repaint(); }
  });
  const pick = EDIT && EDIT.node ? recordOf(EDIT.node) : null;
  note(b, pick ? 'selected: ' + pick.name + ' · ' + (pick.source ? pick.source.path.split('/').pop() : '') + ' · ' + EDIT.mode + ' · ' + UI.gizmoSpace + ' axes' : 'Click an object to select. Menu: ✥ move · ⟳ rotate · −/+ size · ⬓ drop · ⊹ axes · ✕ close · S = free scale gizmo.');

  b = section('Sky · weather · mood', 'sky', sky ? sky.label : '');
  if (sky) {
    chips(b, [['DAY', 'day'], ['EVENING', 'evening'], ['NIGHT', 'night']], (it) => !sky.S.cycle && sky.S.time === it[1], (it) => { sky.setTime(it[1]); repaint(); say('sky · ' + it[0] + ' (tinyskies preset)', 'ok'); });
    chips(b, [['RAIN', 'rain'], ['DAY CYCLE', 'cycle']], (it) => (it[1] === 'rain' ? sky.S.rain : sky.S.cycle), (it) => {
      if (it[1] === 'rain') sky.setRain(!sky.S.rain); else sky.setCycle(!sky.S.cycle);
      repaint();
    });
    note(b, 'World mood (hue only — saturation and lightness stay the source values):');
    chips(b, sky.STIMMUNGEN.map((m) => [m.name.toUpperCase(), m.id]), (it) => sky.S.mood === it[1], (it) => { const m = sky.setMood(it[1]); repaint(); say('mood · ' + m.name + ' · ' + m.was, 'ok'); });
  } else note(b, 'loading TinySkies modules …');

  b = section('Buildings · view', 'buildings', (VIEWS.find((v) => v[1] === UI.view) || [''])[0].split(' ')[0]);
  chips(b, VIEWS, (it) => UI.view === it[1], (it) => { UI.view = it[1]; rebuildBuildings(); repaint(); });
  if (UI.view === 'elastic') {
    chips(b, [['HARMONIC ' + (UI.palSeed || '—'), 'h'], ['↻ NEW SEED', 'n'], ['V2 FIXED', 'v2']], (it) => (it[1] === 'h' && UI.palSeed) || (it[1] === 'v2' && !UI.palSeed), (it) => {
      if (it[1] === 'n') UI.palSeed = (Math.random() * 0x7fffffff) | 0;
      else if (it[1] === 'v2') UI.palSeed = 0;
      else if (!UI.palSeed) UI.palSeed = 20260924;
      rebuildBuildings(); repaint();
    });
  }
  note(b, B ? B.chosen.length + ' real Hürth buildings (huerth-v0) · V2 geometry · open, not touched: roof lids, curb wedges, shadow banding.' : 'loading OSM + city donors …');

  b = section('Character · walk', 'actor', actor ? ACTOR.label : 'loading');
  chips(b, [[UI.walk ? 'WALKING · ESC TO STOP' : 'WALK (WASD)', 'walk'], [UI.eyes ? 'EYES ON' : 'EYES OFF', 'eyes']], (it) => (it[1] === 'walk' ? UI.walk : UI.eyes), (it) => {
    if (it[1] === 'walk') setWalk(!UI.walk);
    else { UI.eyes = !UI.eyes; actor && actor.setEyesVisible(UI.eyes); repaint(); }
  });
  note(b, actor ? 'W/S walk · A/D turn · Shift run · drag = look around. ' + actor.eyeState : 'loading GothGirl, clips and EyeRig …');

  b = section('Surface', 'surface', UI.look ? (UI.tile === 'ref' ? 'ref tile' : 'generator') : 'source');
  chips(b, [['INK', 'ink'], ['GROUND LOOK', 'look'], ['TILE REF', 'ref'], ['TILE GENERATOR', 'gen']], (it) => (it[1] === 'ink' ? UI.ink : it[1] === 'look' ? UI.look : UI.look && UI.tile === it[1]), async (it) => {
    if (it[1] === 'ink') UI.ink = !UI.ink;
    else if (it[1] === 'look') UI.look = !UI.look;
    else { UI.tile = it[1]; UI.look = true; }
    await applyLook(); repaint();
  });
  note(b, 'wd-look: triplanar RGB palette (Derek) + macro tile + cel · wd-ink: KFB ink outline (thin in light, thick in shadow).');

  b = section('Scene document', 'save', localStorage.getItem(STORAGE_KEY) ? 'save found' : 'no save');
  chips(b, [['SAVE', 's'], ['LOAD SAVE', 'l'], ['RESET FIXTURE', 'r'], ['COPY JSON', 'c']], () => false, async (it) => {
    if (it[1] === 's') save();
    else if (it[1] === 'l') await loadSaved();
    else if (it[1] === 'r') await resetScene();
    else { const t = JSON.stringify(sceneDoc(), null, 2); try { await navigator.clipboard.writeText(t); say('scene JSON copied', 'ok'); } catch { docBox.textContent = t; docBox.style.display = 'block'; } }
  });
  const docBox = mk('pre', 'display:none;max-height:180px;overflow:auto;white-space:pre-wrap;font-size:9.5px;background:' + BG2 + ';border:1px solid ' + LINE + ';padding:6px;margin:0');
  b.appendChild(docBox);
  note(b, 'Stores source references + transforms + sculpt strokes only (no asset bytes). localStorage key ' + STORAGE_KEY + '.');

  b = section('Donors · loaded', 'donors', DONORS.length + ' lines');
  b.appendChild(donorBox);
  panel.scrollTop = keep;
}

function setWalk(on) {
  UI.walk = !!on && !!actor;
  if (UI.walk) {
    if (UI.sculpt !== 'off') setSculpt('off');
    EDIT && EDIT.clear();
    cam.yawOff = 0;
    flyTo(0.03, 2.8);
    canvas.focus();
    say('walk · W/S walk · A/D turn · Shift run · Esc stops', 'ok');
  } else { for (const k in keys) keys[k] = false; say('walk off'); }
  repaint();
}
const KEYMAP = { KeyW: 'f', ArrowUp: 'f', KeyS: 'b', ArrowDown: 'b', KeyA: 'l', ArrowLeft: 'l', KeyD: 'r', ArrowRight: 'r' };
addEventListener('keydown', (e) => {
  if (/INPUT|TEXTAREA/.test(document.activeElement && document.activeElement.tagName)) return;
  if (UI.walk) {
    if (KEYMAP[e.code]) { keys[KEYMAP[e.code]] = true; e.preventDefault(); }
    if (e.key === 'Shift') keys.run = true;
    if (e.key === 'Escape') setWalk(false);
    return;
  }
  if (e.key === 'Escape') { if (UI.sculpt !== 'off') setSculpt('off'); else if (UI.placing) { UI.placing = null; repaint(); } else EDIT && EDIT.clear(); return; }
  if (!EDIT || UI.sculpt !== 'off') return;
  if (e.key === 'g') EDIT.setMode('translate');
  if (e.key === 'r') EDIT.setMode('rotate');
  if (e.key === 's') EDIT.setMode('scale');
});
addEventListener('keyup', (e) => {
  if (KEYMAP[e.code]) keys[KEYMAP[e.code]] = false;
  if (e.key === 'Shift') keys.run = false;
});

/* ---------- Takt ---------- */
let last = performance.now(), lastFrame = 0, t0 = performance.now(), frameN = 0;
const focusP = new THREE.Vector3();
function frame() {
  const now = performance.now();
  const dt = Math.min(0.05, Math.max(0, (now - last) / 1000));
  last = now; lastFrame = now;
  if (!planet) return;
  if (cam.tw) {
    cam.tw.t += dt;
    const u = Math.min(1, cam.tw.t / cam.tw.dur);
    cam.alt = cam.tw.a0 + (cam.tw.a1 - cam.tw.a0) * ease(u);
    if (u >= 1) cam.tw = null;
  }
  if (actor) {
    actor.update(dt, UI.walk ? keys : {});
    if (UI.walk) {
      const k = 1 - Math.exp(-dt * 6);
      cam.f.lerp(actor.st.dir, k).normalize();
      _b.copy(actor.st.fwd).applyAxisAngle(actor.st.dir, cam.yawOff);
      cam.F.lerp(_b, k);
    }
  }
  planet.updateLod(cam.f, cam.alt);
  camApply();
  if (paint.alt && (cam.tw || drag || (++frameN % 15 === 0))) paint.alt();
  focusP.copy(_S);
  if (sky) sky.update(dt, camera, focusP, cam.f);
  planet.updateHalo(camera);
  LOOK.TIME.value = (now - t0) / 1000;
  if (EDIT) EDIT.follow();
  if (UI.ink && ink) ink.render((now - t0) / 1000);
  else renderer.render(scene, camera);
  if (sky) sky.overlay(renderer);
  hudTxt.textContent = (cam.alt > 0.5 ? 'ORBIT ' : 'GROUND ') + cam.alt.toFixed(2) + (sky ? ' · ' + sky.label : '') + (UI.walk ? ' · WALK' : '') + (UI.sculpt !== 'off' ? ' · ' + UI.sculpt.toUpperCase() + ' r ' + UI.radius.toFixed(2) : '') + (UI.placing ? ' · PLACE ' + UI.placing.toUpperCase() : '');
}
function loop() { frame(); requestAnimationFrame(loop); }
setInterval(() => { if (performance.now() - lastFrame > 250) frame(); }, 100);

/* ---------- Start ---------- */
async function boot() {
  layout(); repaint();
  say('loading WB2 terrain-sculpt …');
  S = await import(URL_SCULPT);
  log('WB2 sculpt @' + PIN_WB2.slice(0, 8) + ' loaded (brushWeight · makeStroke · pointSpacing · ' + S.SCULPT_FALLOFF + ')');
  const EL = await import(URL_EDIT);
  log('edit-layer @' + PIN_WB2.slice(0, 8) + ' loaded (makeEditLayer · one picker · one TransformControls)');
  say('loading the Earth template …');
  planet = await makePlanet({ S, log });
  scene.add(planet.mesh, planet.patch, planet.sea, planet.halo);
  look = LOOK.makeLook(GROUND_LOOK);
  log('wd-look · ground preset TERRAIN · COMBINED REF + RGB palette + cel · wd-macro generator ready');
  await applyLook();
  ink = createInk({ renderer, scene, camera });
  log('wd-ink · KFB ink outline (Sobel depth+normal · light thin / shadow thick)');
  resize();
  const viewer = { camera, scene, controls: cam };
  EDIT = EL.makeEditLayer(viewer, canvas, {
    getRoot: () => objRoot, recordOf, menu: objmenu, gridStep: 0.05, angleStep: 15,
    onPick: () => repaint(),
    onChange: (nodes) => { for (const n of nodes) writeRec(n); },
    onMenu: (a) => {
      if (a === 'floor') { const r = dropRoots(EDIT.selection); say(r.length ? r.join(' · ') : 'nothing selected', r.length ? 'ok' : ''); }
      if (a === 'space') { UI.gizmoSpace = UI.gizmoSpace === 'world' ? 'local' : 'world'; EDIT.gizmo.setSpace(UI.gizmoSpace); say('gizmo axes · ' + UI.gizmoSpace, 'ok'); repaint(); }
    }
  });
  EDIT.gizmo.setSpace(UI.gizmoSpace);
  EDIT.gizmo.setSize(0.8);
  EDIT.setSnap(UI.snap);
  EDIT.setOn(true);
  EDIT.addClaim((r) => {
    if (!UI.placing) return false;
    const p = planet.hit(r.ray);
    if (!p) return true;
    const c = CATALOG.find((x) => x.id === UI.placing);
    const id = c.id + '-' + (++objN);
    addObject({ id, catalog: c.id, name: c.label, transform: { dir: p.toArray(), yaw: Math.random() * Math.PI * 2 } })
      .then((root) => { EDIT.select(root); repaint(); say(c.label + ' placed · ' + id + ' · drag the gizmo, ⬓ drops it back onto the surface', 'ok'); })
      .catch((e) => say('place failed · ' + e.message, 'bad'));
    return true;
  });
  canvas.addEventListener('pointerdown', camDown);
  addEventListener('pointermove', camMove);
  addEventListener('pointerup', camUp);
  canvas.addEventListener('wheel', onWheel, { passive: false });
  requestAnimationFrame(loop);
  try {
    sky = await makeSky({ scene, renderer, planet, log });
    ink.setExcluded([...sky.excluded, planet.halo, brush, EDIT.helper]);
    log('light-budget · ' + sky.report().split('  ·  ').slice(0, 2).join(' · '));
  } catch (e) { log('TinySkies · FAILED · ' + e.message, true); ink.setExcluded([planet.halo, brush, EDIT.helper]); }
  repaint();
  const jobs = [
    loadBuildings(log).then((L) => { B = L; rebuildBuildings(); }).catch((e) => log('buildings · FAILED · ' + e.message, true)),
    makeActor({ scene, planet, camera, log }).then((a) => { actor = a; a.setPose(START_DIR.toArray(), START_FWD); }).catch((e) => log('actor · FAILED · ' + e.message, true)),
    (async () => { for (const rec of DEFAULT_OBJECTS) { try { await addObject(JSON.parse(JSON.stringify(rec))); } catch (e) { log('object ' + rec.catalog + ' · FAILED · ' + e.message, true); } } })()
  ];
  await Promise.all(jobs);
  repaint();
  say(localStorage.getItem(STORAGE_KEY) ? 'ready · a saved scene exists — LOAD SAVE restores it' : 'ready · ' + (cam.alt > 0.5 ? 'FLY TO GROUND' : 'FLY TO ORBIT') + ' for the continuous flight', 'ok');
}
boot().catch((e) => { console.error(e); say('BOOT FAILED · ' + e.message, 'bad'); log('boot · FAILED · ' + e.message, true); });
window.__wb = { get planet() { return planet; }, get sky() { return sky; }, get actor() { return actor; }, get EDIT() { return EDIT; }, cam, UI, objs, flyTo, save, loadSaved, sceneDoc, renderer, scene, camera, DONORS, setWalk, keys };
