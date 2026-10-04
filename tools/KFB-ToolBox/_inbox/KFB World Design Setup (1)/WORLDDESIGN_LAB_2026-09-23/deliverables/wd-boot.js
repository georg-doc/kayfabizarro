/* KFB WorldDesign Lab v1 · Host (dritte Fassung · Bedienung als Ebenen-Stapel)
   Die Frage an der Bank ist nicht „was passiert, wenn ich hier schiebe?", sondern „welche
   Ebene tut was, in welchem Feld?". Deshalb:
   · EIN Feld ist aktiv — anklickbar im Bild und im Feldwähler, im Bild mit Goldrand markiert.
   · Die Oberfläche ist ein STAPEL von sieben Ebenen (Makro · Farbe · Ton · Korn · Relief ·
     Rauheit · Glanz). Jede Ebene: an/aus, EIN Stärkeregler, ein Satz Details, und ein Auge, das
     den Kanal zeigt, in dem diese Ebene wirkt (Albedo · Normale · Rauheit).
   · „Was unterscheidet die Felder?" ist eine eigene Wahl: PRESETS · TEXTUREN · STÄRKE. Bei
     TEXTUREN und STÄRKE bearbeitet man EINEN Look, und die Felder zeigen dieselbe Einstellung
     mit je einer anderen Textur bzw. einer anderen Stärke.
   · Kein Bedienfeld überlagert das Bild: alle Flächen sind angedockt, die Leinwand wird kleiner,
     nicht zugedeckt; unter 900 px docken die Schubladen unter das Bild. */

import * as THREE from 'three';
import * as REG from './wd-registry.js';
import * as LOOK from './wd-look.js';
import * as MACRO from './wd-macro.js';
import * as LIGHT from './wd-light.js';
import * as TERRAIN from './wd-terrain.js';
import * as VOX from './wd-voxel.js';
import * as SKY from './wd-sky.js';
import * as INKM from './wd-ink.js';
import { makeView } from './wd-view.js';
import {
  CHARACTERS, STRUKTUR, WELT, NATUR, NATUR_PLUS, PLANT_LAB, TREATS_SLOTS, OWNERS, BEFUNDE, packReps, mountAsset, SourceRequired
} from './wd-donors.js';

const FONT = "'JetBrains Mono',ui-monospace,monospace";
const MONO = '400 11px/1.45 ' + FONT;
const INK = '#e7dfd0', GOLD = '#ffd9a0', RED = '#ff9a86', DIM = 'rgba(231,223,208,.55)';
const LINE = 'rgba(231,223,208,.16)', BG = '#17151d', BG2 = '#1d1a24';
const TOP = 44, BOT = 24;

const mk = (tag, css, text) => {
  const el = document.createElement(tag);
  if (css) el.style.cssText = css;
  if (text != null) el.textContent = text;
  return el;
};
const BTN = 'font:' + MONO + ';color:' + INK + ';background:rgba(255,255,255,.04);border:1px solid ' + LINE +
  ';padding:5px 8px;cursor:pointer;text-align:left';
const CHIP = (on) => 'font:' + MONO + ';font-size:10px;padding:4px 7px;cursor:pointer;background:' +
  (on ? 'rgba(255,217,160,.1)' : 'rgba(255,255,255,.04)') + ';border:1px solid ' + (on ? GOLD : LINE) + ';color:' + (on ? GOLD : INK);
const SVG_EYE = '<svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M1.5 8s2.5-4.5 6.5-4.5S14.5 8 14.5 8 12 12.5 8 12.5 1.5 8 1.5 8z"/><circle cx="8" cy="8" r="2"/></svg>';

/* ---------- Gerüst ---------- */
const stageBox = mk('div', 'position:fixed;z-index:0;overflow:hidden');
const canvas = mk('canvas', 'display:block;width:100%;height:100%;background:#131119;touch-action:none');
stageBox.appendChild(canvas);
const topbar = mk('div', 'position:fixed;left:0;right:0;top:0;height:' + TOP + 'px;z-index:40;display:flex;' +
  'align-items:center;gap:6px;padding:0 10px;box-sizing:border-box;background:' + BG + ';border-bottom:1px solid ' + LINE + ';font:' + MONO);
const statusbar = mk('div', 'position:fixed;left:0;right:0;bottom:0;height:' + BOT + 'px;z-index:40;display:flex;' +
  'align-items:center;gap:10px;padding:0 10px;box-sizing:border-box;background:' + BG + ';border-top:1px solid ' + LINE +
  ';font:' + MONO + ';color:' + INK + ';white-space:nowrap;overflow:hidden');
const drawer = (css) => mk('div', 'position:fixed;z-index:39;box-sizing:border-box;background:' + BG + ';overflow:auto;font:' + MONO +
  ';color:' + INK + ';padding:8px;display:none;flex-direction:column;gap:6px;' + (css || ''));
const rail = drawer();
const evid = drawer();
const tagLayer = mk('div', 'position:fixed;z-index:20;pointer-events:none;overflow:hidden');
document.body.append(stageBox, topbar, statusbar, rail, evid, tagLayer);

window.addEventListener('error', (e) => {
  const t = e.target;
  if (!t || t === window || !t.tagName) return;
  const line = 'Ressource nicht geladen: <' + t.tagName.toLowerCase() + '> ' + (t.src || t.href || '(ohne URL)');
  if (!BEFUNDE.includes(line)) BEFUNDE.push(line);
}, true);

const statusEl = mk('div', 'opacity:.72;overflow:hidden;text-overflow:ellipsis;flex:1');
const countEl = mk('div', 'opacity:.55;white-space:nowrap');
statusbar.append(statusEl, countEl);
const say = (t) => { statusEl.textContent = t; };

function iconBtn(svg, label) {
  const b = mk('button', 'width:30px;height:30px;flex:0 0 auto;padding:0;display:grid;place-items:center;cursor:pointer;' +
    'background:rgba(255,255,255,.04);border:1px solid ' + LINE + ';color:' + INK);
  b.innerHTML = svg;
  b.title = label;
  b.setAttribute('aria-label', label);
  return b;
}
const btnRail = iconBtn('<svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 4h12M2 8h12M2 12h12"/></svg>', 'Paletten an/aus');
const btnEvid = iconBtn('<svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="3" y="2" width="10" height="12"/><path d="M5.5 5.5h5M5.5 8h5M5.5 10.5h3"/></svg>', 'Belegtafel an/aus');
const title = mk('div', 'font:600 11px/1.4 ' + FONT + ';letter-spacing:.12em;text-transform:uppercase;color:' + GOLD +
  ';white-space:nowrap', 'KFB WorldDesign Lab');
const modeBox = mk('div', 'display:flex;gap:4px;flex:0 0 auto');
const chanBox = mk('div', 'display:flex;gap:3px;flex:0 1 auto;overflow:hidden');
const viewBox = mk('div', 'display:flex;gap:3px;flex:0 0 auto');
const inkBox = mk('div', 'display:flex;gap:3px;flex:0 0 auto');
const spacer = mk('div', 'flex:1');
topbar.append(title, modeBox, viewBox, chanBox, inkBox, spacer, btnRail);
/* Anfasser: Schublade in der Höhe (schmal, unten) bzw. Breite (breit, rechts) ziehen */
const grip = mk('div', 'position:fixed;z-index:41;display:none;touch-action:none;background:' + BG);
const gripBar = mk('div', 'position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);background:rgba(231,223,208,.35);border-radius:2px');
grip.appendChild(gripBar);
document.body.appendChild(grip);

/* ---------- Zustand ---------- */
const FIELD_PRESETS = ['SOURCE', 'DEREK', 'NORMALEN-LOOK', 'RAUHEITS-LOOK'];
/* McCloud: Hintergrund trägt die Welt, Mittelgrund die Handlung, Vordergrund die Figur — je
   Ebene ein eigener Look; das Gelände ist eine vierte, eigene Ebene. */
const WLAYERS = [['VORDERGRUND', 'fg', 'Figuren (mit Waffen etc.)'], ['MITTELGRUND', 'mg', 'Props, Interaktions-Assets'], ['HINTERGRUND', 'bg', 'Gebäude, grosse Natur'], ['GELÄNDE', 'terrain', 'Boden']];
const WDEF = { fg: 'DEREK · CHARAKTER', mg: 'DEREK · PROP', bg: 'DEREK', terrain: 'TERRAIN · COMBINED REF' };
const VARY = {
  pal: ['RGB-Palette', [0.35, 0.7, 1]],
  palSpread: ['Paletten-Spreizung', [0.2, 0.45, 0.8]],
  palHue: ['Farbton-Drift', [0, 0.3, 0.7]],
  macro: ['Makro-Stärke', [0.3, 0.6, 1]],
  colour: ['Farbeinfluss', [0, 0.4, 0.9]],
  grain: ['Korn', [0.25, 0.7, 1.3]],
  grainScale: ['Korn-Dichte', [4, 7, 16]],
  bump: ['Relief', [0.2, 0.6, 1.2]],
  scale: ['Makro-Skala', [0.25, 0.6, 1.5]],
  proc: ['Ton-Anteil', [0, 0.5, 1]],
  gloss: ['Glanzerhalt', [0, 0.5, 1]]
};
const CHANNELS = [['BILD', 0], ['ALBEDO', 1], ['NORMALE', 2], ['RAUHEIT', 3]];
const LAYERS = [
  { id: 'palette', name: 'RGB-Palette (Derek)', key: 'pal', ch: 1, what: 'R/G/B der Kachel wählen je Material zwischen drei Farben aus der Quellfarbe', more: ['palSpread', 'palHue', 'scale', 'blend'] },
  { id: 'makro', name: 'Makro-Textur', key: 'macro', ch: 1, what: 'wie stark die Kachel die Oberfläche moduliert', more: ['scale', 'blend', 'stoch', 'contrast'] },
  { id: 'farbe', name: 'Farbe der Textur', key: 'colour', ch: 1, what: '0 = Quellfarbe bleibt · 1 = Texturfarbe übernimmt', more: ['tint', 'sat'] },
  { id: 'ton', name: 'Ton / Prozedural', key: 'proc', ch: 1, what: 'ersetzt die Kachel stufenweise durch Weltraum-Rauschen', more: [] },
  { id: 'korn', name: 'Korn', key: 'grain', ch: 2, what: 'feine Normalen-Störung · ändert das Licht, nicht die Farbe', more: ['grainScale'] },
  { id: 'relief', name: 'Relief', key: 'bump', ch: 2, what: 'Normalmap der Kachel', more: [] },
  { id: 'rauheit', name: 'Rauheit', key: 'roughInfl', ch: 3, what: 'Rauheit aus der Kachel', more: ['roughBias', 'roughVar'] },
  { id: 'glanz', name: 'Glanzerhalt', key: 'gloss', ch: 3, what: 'schützt, was in der Quelle glatt ist', more: [] },
  { id: 'cel', name: 'Cel-Shading', key: 'cel', ch: 0, what: 'direktes Licht in weiche Stufen · Schattenseite bleibt lesbar', more: ['celBands', 'celSoft'] },
  { id: 'morph', name: 'Morph · Farbflächen', key: 'morph', ch: 1, what: 'die Kachel fliesst langsam · Farb- und Schattenflächen wandern (Derek)', more: ['morphSpeed', 'celBreak'] },
  { id: 'kanal', name: 'Kanal als Look', key: 'normTint', ch: 2, what: 'Pastell der Normalen-Ansicht als Farbe · Rauheit als Grauton', more: ['roughTint'] },
  { id: 'wobble', name: 'Wobble · Geometrie', key: 'wobble', ch: 0, what: 'Ecken zittern in 8-fps-Stufen (Owner-Formel) · für Derek AUS lassen', more: [] }
];
const PDEF = Object.fromEntries(LOOK.PARAMS.map((p) => [p[0], p]));

const light = { ...LIGHT.DEF };
const S = {
  mode: 'bench', railOpen: true, evidOpen: false,
  axis: 'presets', vary: 'macro',
  fieldPresets: [...FIELD_PRESETS],
  fieldTex: [null, { src: 'genrgb' }, { src: 'ref' }, { src: 'gen' }],
  target: 1, openLayer: null, texFam: 'TON', single: false, wlayer: 'fg', worldPresets: { ...WDEF }, sky: 'watercolor',
  sheetH: +(localStorage.getItem('wd-sheetH') || 0), railW: +(localStorage.getItem('wd-railW') || 0),
  open: { axis: true, stack: true, tex: false, gen: false, ink: false, sky: false, licht: false, fx: false, ansicht: false, asset: false, json: false, beleg: false },
  grid: false, tags: true, names: false, move: true, terrain: true, selfShadow: false,
  ground: 'natur', story: 2, storyAmt: 0, cycle: false, cycleSec: 8, ink: true, inkP: { ...INKM.DEF, ...LOOK.INK_DEREK },
  macro: { ...MACRO.DEF },
  asset: null, assetLabel: '—', tab: 'chars', pack: null
};
let looks = [];
let master = LOOK.makeLook(LOOK.PRESETS.COMBINED);
let worldLooks = {};
let worldNodes = [];
let gen = null, genMaps = null, genRgb = null, genRgbMaps = null, mixers = [], records = [], terrain = null, voxel = null;
const nameTags = [];
let busy = false;

const view = makeView(canvas, light);
const { camera } = view;

/* ---------- Layout ---------- */
function layout() {
  const w = window.innerWidth, h = window.innerHeight;
  const narrow = w < 900;
  S.narrow = narrow;
  evid.style.display = 'none';
  let cLeft = 0, cRight = 0, cBot = BOT;
  const GR = 14;
  if (narrow) {
    const maxH = h - TOP - BOT - 120;
    const sheet = Math.round(Math.max(120, Math.min(maxH, S.sheetH || h * 0.42)));
    rail.style.display = S.railOpen ? 'flex' : 'none';
    Object.assign(rail.style, { left: '0px', right: '0px', width: 'auto', top: (h - BOT - sheet + GR) + 'px',
      bottom: BOT + 'px', borderTop: 'none', borderLeft: 'none', borderRight: 'none' });
    Object.assign(grip.style, { display: S.railOpen ? 'block' : 'none', left: '0px', right: '0px', width: 'auto', height: GR + 'px',
      top: (h - BOT - sheet) + 'px', bottom: 'auto', cursor: 'ns-resize', borderTop: '1px solid ' + LINE, borderLeft: 'none' });
    Object.assign(gripBar.style, { width: '42px', height: '4px' });
    if (S.railOpen) cBot = BOT + sheet;
  } else {
    const rw = S.railOpen ? Math.round(Math.max(260, Math.min(w * 0.6, S.railW || Math.min(360, w * 0.28)))) : 0;
    rail.style.display = S.railOpen ? 'flex' : 'none';
    Object.assign(rail.style, { right: '0px', left: 'auto', top: TOP + 'px', bottom: BOT + 'px', width: (rw - GR) + 'px',
      borderLeft: 'none', borderTop: 'none', borderRight: 'none' });
    Object.assign(grip.style, { display: S.railOpen ? 'block' : 'none', right: (rw - GR) + 'px', left: 'auto', width: GR + 'px', height: 'auto',
      top: TOP + 'px', bottom: BOT + 'px', cursor: 'ew-resize', borderLeft: '1px solid ' + LINE, borderTop: 'none' });
    Object.assign(gripBar.style, { width: '4px', height: '42px' });
    cRight = rw;
  }
  const box = { top: TOP + 'px', bottom: cBot + 'px', left: cLeft + 'px', right: cRight + 'px' };
  Object.assign(stageBox.style, box);
  Object.assign(tagLayer.style, box);
  chanBox.style.display = w < 640 ? 'none' : 'flex';
  title.style.display = w < 520 ? 'none' : 'block';
  btnRail.style.color = S.railOpen ? GOLD : INK;
  btnRail.style.borderColor = S.railOpen ? GOLD : LINE;
  requestAnimationFrame(() => { view.resize(); view.buildFX(); paintTags(); });
}
btnRail.onclick = () => { S.railOpen = !S.railOpen; layout(); };
let gripDrag = null;
grip.addEventListener('pointerdown', (e) => { grip.setPointerCapture(e.pointerId); gripDrag = { x: e.clientX, y: e.clientY, h: parseFloat(rail.style.top), w: rail.getBoundingClientRect().width + 14 }; });
grip.addEventListener('pointermove', (e) => {
  if (!gripDrag) return;
  if (S.narrow) S.sheetH = window.innerHeight - BOT - (gripDrag.h - 14 + (e.clientY - gripDrag.y));
  else S.railW = gripDrag.w - (e.clientX - gripDrag.x);
  layout();
});
grip.addEventListener('pointerup', () => { gripDrag = null; localStorage.setItem('wd-sheetH', String(Math.round(S.sheetH || 0))); localStorage.setItem('wd-railW', String(Math.round(S.railW || 0))); });
window.addEventListener('resize', layout);

/* ---------- Felder: Namen in der Ecke, aktives Feld als Goldrand AUF der Feldkante ---------- */
const slotTags = [];
function fieldName(i) {
  if (S.mode === 'world') return 'WORLD SCENE';
  if (i === 0) return 'SOURCE';
  if (S.axis === 'presets') return S.fieldPresets[i];
  if (S.axis === 'texturen') { const t = S.fieldTex[i]; return { gen: 'GENERATOR', genrgb: 'GENERATOR RGB', ref: 'REFERENZ RGB' }[t.src] || t.set; }
  return VARY[S.vary][0] + ' ' + VARY[S.vary][1][i - 1];
}
function paintTags() {
  for (const t of slotTags) t.remove();
  slotTags.length = 0;
  const w = tagLayer.clientWidth, h = tagLayer.clientHeight;
  view.slotRects().forEach((r) => {
    const i = r.index;
    const sw = 100 / r.cols, sh = 100 / r.rows;
    const x = r.col * sw, y = r.row * sh;
    const active = S.mode === 'bench' && i === S.target;
    if (S.mode === 'bench' && r.cols > 1) {
      const frame = mk('div', 'position:absolute;left:' + x + '%;top:' + y + '%;width:' + sw + '%;height:' + sh + '%;' +
        'box-sizing:border-box;border:1px solid ' + (active ? GOLD : 'rgba(231,223,208,.08)'));
      tagLayer.appendChild(frame);
      slotTags.push(frame);
    }
    if (!S.tags) return;
    const el = mk('div', 'position:absolute;left:calc(' + x + '% + 5px);top:calc(' + y + '% + 4px);font:600 9px/1.3 ' + FONT +
      ';letter-spacing:.12em;color:' + (active ? '#131119' : GOLD) + ';background:' + (active ? GOLD : 'rgba(19,17,26,.72)') +
      ';padding:2px 5px;white-space:nowrap', fieldName(i) + (active ? ' · AKTIV' : ''));
    tagLayer.appendChild(el);
    slotTags.push(el);
  });
}
/* Feld im Bild anklicken = aktiv setzen (nur ein Klick, kein Orbit-Zug) */
let downAt = null;
canvas.addEventListener('pointerdown', (e) => { downAt = [e.clientX, e.clientY]; });
canvas.addEventListener('pointerup', (e) => {
  if (!downAt || S.mode !== 'bench' || S.single) return;
  const moved = Math.hypot(e.clientX - downAt[0], e.clientY - downAt[1]);
  downAt = null;
  if (moved > 4) return;
  const r = canvas.getBoundingClientRect();
  const col = e.clientX - r.left > r.width / 2 ? 1 : 0;
  const row = e.clientY - r.top > r.height / 2 ? 1 : 0;
  const i = row * 2 + col;
  if (i !== S.target && i < view.slots.length) { S.target = i; paintTags(); paintRail(); say('aktives Feld: ' + fieldName(i)); }
});

function nameTag(node, text) {
  const el = mk('div', 'position:absolute;transform:translate(-50%,6px);white-space:nowrap;font:' + MONO +
    ';color:' + INK + ';background:rgba(23,21,29,.86);border:1px solid ' + LINE + ';padding:1px 5px;font-size:10px;display:none', text);
  tagLayer.appendChild(el);
  nameTags.push({ el, node });
}
const v3 = new THREE.Vector3(), bx = new THREE.Box3();
function placeNameTags() {
  const w = tagLayer.clientWidth, h = tagLayer.clientHeight;
  for (const L of nameTags) {
    if (!S.names || S.mode !== 'world') { L.el.style.display = 'none'; continue; }
    bx.setFromObject(L.node);
    if (!isFinite(bx.min.y)) { L.el.style.display = 'none'; continue; }
    bx.getCenter(v3);
    v3.y = bx.min.y;
    v3.project(camera);
    const vis = v3.z < 1;
    L.el.style.display = vis ? 'block' : 'none';
    if (!vis) continue;
    L.el.style.left = ((v3.x * 0.5 + 0.5) * w) + 'px';
    L.el.style.top = ((-v3.y * 0.5 + 0.5) * h) + 'px';
  }
}

/* ---------- Texturen ---------- */
function regenerate(reseed) {
  if (reseed) S.macro.seed = Math.floor(Math.random() * 99999999);
  gen = MACRO.generate(S.macro);
  genMaps = LOOK.genSet(gen);
  genRgb = MACRO.generate({ ...S.macro, rgb: true });
  genRgbMaps = LOOK.genSet(genRgb, true);
  for (const l of allLooks()) { if (l.p.src === 'gen') l.maps(genMaps); if (l.p.src === 'genrgb') l.maps(genRgbMaps); }
  paintGenPreview();
}
async function mapsFor(l) {
  if (l.p.src === 'set') l.maps(await LOOK.repoSet(l.p.set));
  else if (l.p.src === 'ref') l.maps(await LOOK.refSet());
  else if (l.p.src === 'genrgb') l.maps(genRgbMaps);
  else l.maps(genMaps);
}
const allLooks = () => [...looks, master, ...Object.values(worldLooks)];

/* Felder aus dem Master ableiten (Achsen TEXTUREN / STÄRKE) */
async function deriveFields() {
  if (S.axis === 'presets' || S.mode !== 'bench') return;
  for (let i = 1; i < looks.length; i++) {
    const l = looks[i];
    l.setAll(master.p);
    l.p.on = true;
    if (S.axis === 'texturen') { l.p.src = S.fieldTex[i].src; l.p.set = S.fieldTex[i].set || l.p.set; }
    else { l.p.src = master.p.src; l.p.set = master.p.set; l.set(S.vary, VARY[S.vary][1][i - 1]); }
    await mapsFor(l);
    LOOK.apply(view.slots[i].group, l);
  }
}
/* Welcher Look nimmt die Regler an? */
function editLook() {
  if (S.mode === 'world') return worldLooks[S.wlayer] || null;
  if (S.axis === 'presets') return S.target > 0 ? looks[S.target] : null;
  return master;
}
function setParam(k, v) {
  const L = editLook();
  if (!L) return;
  L.set(k, v);
  if (L.p.on === false) { L.p.on = true; reapply(); }
  if (S.mode === 'bench' && S.axis !== 'presets') {
    for (let i = 1; i < looks.length; i++) if (!(S.axis === 'staerke' && k === S.vary)) looks[i].set(k, v);
  }
}
function reapply() {
  if (S.mode === 'world') {
    for (const wn of worldNodes) LOOK.apply(wn.node, worldLooks[wn.layer]);
    if (terrain && !terrain.voxel && terrain.mesh) LOOK.apply(terrain.mesh, worldLooks.terrain);
    return;
  }
  view.slots.forEach((s, i) => { if (looks[i]) LOOK.apply(s.group, looks[i]); });
}
async function setTexture(src, set) {
  const L = editLook();
  if (S.mode === 'bench' && S.axis === 'texturen') {
    if (S.target === 0) { say('SOURCE ist die Referenz — erst ein Vergleichsfeld wählen'); return; }
    S.fieldTex[S.target] = { src, set };
    await deriveFields();
  } else if (L) {
    L.p.src = src;
    if (set) L.p.set = set;
    L.p.on = true;
    say('lade ' + (set || { gen: 'Generator', genrgb: 'Generator RGB', ref: 'Referenz RGB' }[src]) + ' …');
    await mapsFor(L);
    if (S.mode === 'bench' && S.axis === 'staerke') await deriveFields();
    else reapply();
  } else { say('SOURCE ist die Referenz — erst ein Vergleichsfeld wählen'); return; }
  paintTags(); paintRail();
  say('Textur ' + (set || { gen: 'Generator', genrgb: 'Generator RGB', ref: 'Referenz RGB' }[src]) + ' → ' + (S.mode === 'world' ? 'ganze Szene' : S.axis === 'staerke' ? 'alle Vergleichsfelder' : fieldName(S.target)));
}

/* ---------- Bühne ---------- */
function clearSlots() {
  for (const s of view.slots) {
    for (const c of [...s.group.children]) {
      s.group.remove(c);
      c.traverse((n) => { if (n.isMesh && n.geometry) n.geometry.dispose(); });
    }
  }
  mixers = [];
  terrain = null;
  for (const t of nameTags) t.el.remove();
  nameTags.length = 0;
}
function drop(node, x, z, y = 0) {
  bx.setFromObject(node);
  const s = bx.getSize(new THREE.Vector3());
  node.position.x += x - bx.min.x;
  node.position.y += y - bx.min.y;
  node.position.z += z - (bx.min.z + bx.max.z) / 2;
  return { w: s.x, h: s.y, d: s.z };
}
function counts() {
  countEl.textContent = records.filter((x) => x.status === 'SICHTBAR').length + '/' + records.length + ' sichtbar';
}
function record(entry, r, extra) {
  records.push({ label: entry.label, status: 'SICHTBAR', reason: '', facts: { ...r.facts, ...extra } });
  counts();
}
function fail(entry, e) {
  records.push({
    label: entry.label, status: e instanceof SourceRequired ? 'SOURCE_REQUIRED' : 'LADEN FEHLGESCHLAGEN',
    reason: e.message, facts: { path: entry.slug ? 'shard packs/' + entry.slug + '.json' : '—', rev: '—', owner: '—', size: [] }
  });
  counts();
  console.warn('[wd]', entry.label, e);
}
/* Eigenschatten: die Schattenkarte eines einzelnen harten Richtungslichts rastert Haar und Kopf
   als dunkle Polygone auf Brust und Gesicht und lässt am Hals eine Lichtnaht durch (gemessen an
   GothGirl: mit receiveShadow aus verschwinden beide). Das KayKit-Original hat keinen solchen
   Eigenschatten. Deshalb: Spender WERFEN Schatten (auf Gelände/Boden), empfangen ihn aber nur,
   wenn man es ausdrücklich einschaltet. */
function selfShadow(node) {
  node.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = !!S.selfShadow; } });
}
function animate(node, r) {
  selfShadow(node);
  if (!S.move) return;
  if (r.update) mixers.push({ update: r.update });
  else if (r.clips && r.clips.length) {
    const m = new THREE.AnimationMixer(node);
    const c = r.clips.find((x) => /idle|wave|stand/i.test(x.name)) || r.clips[0];
    m.clipAction(c).play();
    mixers.push({ update: (dt) => m.update(dt) });
  }
}

async function loadBench(entry) {
  if (busy) return;
  busy = true;
  S.mode = 'bench';
  S.asset = entry;
  S.assetLabel = entry.label;
  records = [];
  light.glow = false;
  view.setSlots([0, 1, 2, 3].map(fieldName));
  if (!gen) regenerate(false);
  if (!looks.length) looks = S.fieldPresets.map((n) => LOOK.makeLook(LOOK.PRESETS[n] || {}));
  for (const l of looks) await mapsFor(l);
  await mapsFor(master);
  clearSlots();
  let box = null;
  for (let i = 0; i < view.slots.length; i++) {
    say('Bank · ' + entry.label + ' · Feld ' + (i + 1) + '/4 …');
    try {
      const r = await entry.mount();
      view.slots[i].group.add(r.node);
      drop(r.node, 0, 0);
      animate(r.node, r);
      if (i === 0) { record(entry, r); box = new THREE.Box3().setFromObject(r.node); }
    } catch (e) { if (i === 0) fail(entry, e); }
  }
  view.grid(S.grid);
  view.setSolo(S.single ? S.target : -1);
  await applySky();
  applyExclusions();
  if (box) view.frame(box, 1.12);
  await deriveFields();
  reapply();
  paintMode(); paintTags(); paintRail();
  busy = false;
  say('MATERIAL BENCH · ' + entry.label + ' · Feld anklicken = aktiv · Ziehen = Orbit');
}

/* WORLD SCENE · gemischte Testszene auf natürlichem Gelände, EIN Look über alles */
/* Reihenfolge = Tiefe: Vordergrund vorn, Hintergrund hinten (McCloud-Staffelung im Raum) */
const WORLD_LIST = () => [
  ...[0, 1, 2, 6, 3, 4, 5].map((i) => ({ e: CHARACTERS[i], layer: 'fg' })),
  { e: CHARACTERS[7], layer: 'mg' },
  ...[TREATS_SLOTS[1], TREATS_SLOTS[5], TREATS_SLOTS[9], ...packReps([['kaykit-furniture-bits-1-0-free', 'KayKit Furniture']]),
    WELT[8], NATUR_PLUS[3], NATUR_PLUS[4], NATUR_PLUS[8], PLANT_LAB[0], PLANT_LAB[1], PLANT_LAB[2]].map((e) => ({ e, layer: 'mg' })),
  ...[STRUKTUR[1], STRUKTUR[4], STRUKTUR[7], WELT[4], NATUR[0], NATUR[1], NATUR[3], NATUR_PLUS[0], NATUR_PLUS[1],
    NATUR_PLUS[2], NATUR_PLUS[5], NATUR_PLUS[7]].map((e) => ({ e, layer: 'bg' }))
];
async function loadWorld() {
  if (busy) return;
  busy = true;
  S.mode = 'world';
  records = [];
  light.glow = true;
  view.setSlots(['WORLD SCENE']);
  if (!gen) regenerate(false);
  if (!Object.keys(worldLooks).length) {
    for (const [, k] of WLAYERS) { worldLooks[k] = LOOK.makeLook(LOOK.PRESETS[S.worldPresets[k]] || {}); worldLooks[k].p.on = true; }
  }
  for (const k in worldLooks) await mapsFor(worldLooks[k]);
  worldNodes = [];
  clearSlots();
  paintMode(); paintTags(); paintRail();
  const list = WORLD_LIST();
  const placed = [];
  let x = 0, z = 0, depth = 0, i = 0, lastLayer = null;
  for (const { e, layer } of list) {
    i++;
    if (lastLayer && layer !== lastLayer) { x = 0; z -= depth + 3.2; depth = 0; }
    lastLayer = layer;
    say('WORLD SCENE · ' + e.label + ' … (' + i + '/' + list.length + ')');
    try {
      const r = await e.mount();
      view.slots[0].group.add(r.node);
      const g = drop(r.node, x, z);
      animate(r.node, r);
      nameTag(r.node, e.label);
      record(e, r, { ebene: layer });
      worldNodes.push({ node: r.node, layer });
      placed.push({ node: r.node, x: x + g.w / 2, z, r: Math.max(g.w, g.d) * 0.7 + 0.4 });
      x += g.w * 1.25 + 0.9;
      depth = Math.max(depth, g.d);
      if (x > 13) { x = 0; z -= depth + 2.2; depth = 0; }
    } catch (err) { fail(e, err); }
  }
  const group = view.slots[0].group;
  const box = new THREE.Box3().setFromObject(group);
  voxel = null;
  if (S.ground !== 'aus' && isFinite(box.min.x)) {
    /* Gelände unter die Spender: jede Standfläche bekommt ihre lokale Geländehöhe (ganzzahlig,
       damit sie auch im Voxel-Modus genau auf einer Säulenkrone liegt) */
    const pads = placed.map((p) => ({ x: p.x, z: p.z, r: p.r, h: 0 }));
    const probe = TERRAIN.makeTerrain(box, []);
    for (const p of pads) p.h = Math.round(probe.heightAt(p.x, p.z) * 0.6);
    probe.mesh.geometry.dispose();
    terrain = TERRAIN.makeTerrain(box, pads);
    if (S.ground === 'voxel') {
      try {
        const c = box.getCenter(new THREE.Vector3());
        voxel = await VOX.makeVoxel(terrain.heightAt, { cx: c.x, cz: c.z, W: terrain.size[0] * 0.8, D: terrain.size[1] * 0.8 }, { mode: S.story });
        group.add(voxel.mesh);
        terrain.mesh.geometry.dispose();
        const hA = terrain.heightAt;
        terrain = { heightAt: (x, z) => Math.round(hA(x, z)), size: terrain.size, mesh: voxel.mesh, voxel: true };
      } catch (e) {
        BEFUNDE.push('Voxel-Owner nicht ladbar: ' + e.message.slice(0, 90));
        say('Voxel-Owner nicht ladbar — natürliches Gelände stattdessen');
        group.add(terrain.mesh);
      }
    } else group.add(terrain.mesh);
    placed.forEach((p, k) => { p.node.position.y += pads[k].h; });
  }
  view.grid(S.grid && S.ground === 'aus');
  await applySky();
  applyExclusions();
  const all = new THREE.Box3().setFromObject(group);
  const focus = box.clone().expandByScalar(2);
  view.frame(focus, 0.72, [0.35, 0.5, 1]);
  /* Fackelpool (sechs) über die Fläche der Spender verteilen */
  const pts = [];
  const cols = 3, rows = 2;
  for (let r0 = 0; r0 < rows; r0++) for (let c0 = 0; c0 < cols; c0++) {
    const px = box.min.x + (box.max.x - box.min.x) * ((c0 + 0.5) / cols);
    const pz = box.min.z + (box.max.z - box.min.z) * ((r0 + 0.5) / rows);
    const py = (terrain ? terrain.heightAt(px, pz) : 0) + 2.6;
    pts.push(new THREE.Vector3(px, py, pz));
  }
  view.slots[0].rig.placeWorld(all, pts);
  reapply();
  paintRail();
  busy = false;
  const ok = records.filter((r) => r.status === 'SICHTBAR').length;
  say('WORLD SCENE · ' + ok + '/' + list.length + ' sichtbar · Gelände ' + (voxel ? voxel.label : terrain ? 'natürlich' : 'aus') + ' · je Ebene ein Look (VG · MG · HG · Gelände)');
}

/* Himmel je Feld · Tusche-Ausschlüsse (Himmel immer, Voxel-Säulen wie beim Owner) */
async function applySky() {
  const stops = voxel && voxel.stops;
  for (let i = 0; i < view.slots.length; i++) {
    try {
      const sky = await SKY.makeSky(view.slots[i].scene, S.sky, { story: S.story, stops });
      view.setSky(i, sky);
    } catch (e) {
      view.setSky(i, null);
      const line = 'Himmel ' + S.sky + ' nicht ladbar: ' + e.message.slice(0, 80);
      if (!BEFUNDE.includes(line)) BEFUNDE.push(line);
    }
  }
}
function applyExclusions() {
  view.slots.forEach((s, i) => view.setInkExcluded(i, [s.sky && s.sky.group, i === 0 && voxel ? voxel.mesh : null].filter(Boolean)));
  view.setInkParams({ ...S.inkP, ...(voxel && S.mode === 'world' ? { ink: voxel.ink } : {}) });
  view.setInkOn(S.ink);
  /* SOURCE bleibt unverändert — auch ohne Tusche */
  view.slots.forEach((s, i) => { s.noInk = S.mode === 'bench' && i === 0; });
}

function setMode(m) {
  if (m === 'bench') loadBench(S.asset || CHARACTERS[1]);
  else loadWorld();
}
function paintMode() {
  modeBox.textContent = '';
  for (const [lab, id] of [['BANK', 'bench'], ['WELT', 'world']]) {
    const b = mk('button', CHIP(S.mode === id) + ';letter-spacing:.1em;padding:5px 9px', lab);
    b.title = id === 'bench' ? 'MATERIAL BENCH · ein Asset, vier Felder' : 'WORLD SCENE · alle Familien auf Gelände, ein Look';
    b.onclick = () => { if (S.mode !== id && !busy) setMode(id); };
    modeBox.appendChild(b);
  }
  viewBox.textContent = '';
  if (S.mode === 'bench') {
    for (const [lab, one, tip] of [['1', true, 'Einzelansicht · aktives Feld gross'], ['4', false, '4er-Raster · synchron']]) {
      const b = mk('button', CHIP(S.single === one) + ';min-width:26px;text-align:center', lab);
      b.title = tip;
      b.onclick = () => { S.single = one; view.setSolo(one ? S.target : -1); paintMode(); paintTags(); say(tip); };
      viewBox.appendChild(b);
    }
  }
  inkBox.textContent = '';
  const ib = mk('button', CHIP(S.ink), 'TUSCHE');
  ib.title = 'KFB Ink Outline an/aus';
  ib.onclick = () => { S.ink = !S.ink; view.setInkOn(S.ink); paintMode(); paintRail(); say('Tusche ' + (S.ink ? 'an' : 'aus')); };
  inkBox.appendChild(ib);
  chanBox.textContent = '';
  for (const [lab, v] of CHANNELS) {
    const b = mk('button', CHIP(LOOK.DEBUG.value === v), lab);
    b.title = 'Kanal-Ansicht: zeigt, was die Ebenen in diesem Kanal tun';
    b.onclick = () => setChannel(v);
    chanBox.appendChild(b);
  }
}
function setChannel(v) {
  LOOK.DEBUG.value = v;
  reapply();
  paintMode(); paintRail();
  say('Kanal: ' + CHANNELS.find((c) => c[1] === v)[0] + (v ? ' · Licht und Farbe der Szene ausgeblendet' : ''));
}

/* ---------- Bausteine der Palette ---------- */
function section(titel, key, badge) {
  const wrap = mk('div', 'display:flex;flex-direction:column;border:1px solid ' + LINE + ';background:rgba(255,255,255,.015)');
  const head = mk('button', 'font:600 9px/1.4 ' + FONT + ';letter-spacing:.14em;text-transform:uppercase;color:' + GOLD +
    ';background:none;border:none;padding:7px 8px;cursor:pointer;display:flex;gap:6px;align-items:center;width:100%;text-align:left');
  const set = () => {
    head.innerHTML = '<span style="flex:1">' + titel + '</span>' + (badge ? '<span style="color:' + DIM + ';letter-spacing:.04em;text-transform:none;font-weight:400">' + badge + '</span>' : '') +
      '<span>' + (S.open[key] ? '–' : '+') + '</span>';
  };
  set();
  const body = mk('div', 'display:' + (S.open[key] ? 'flex' : 'none') + ';flex-direction:column;gap:5px;padding:0 8px 8px');
  head.onclick = () => { S.open[key] = !S.open[key]; body.style.display = S.open[key] ? 'flex' : 'none'; set(); };
  wrap.append(head, body);
  rail.appendChild(wrap);
  return body;
}
const note = (parent, t) => { const n = mk('div', 'font-size:10px;color:' + DIM + ';line-height:1.45', t); parent.appendChild(n); return n; };
function chips(parent, items, isOn, onPick) {
  const box = mk('div', 'display:flex;flex-wrap:wrap;gap:3px');
  parent.appendChild(box);
  items.forEach((it, i) => {
    const lab = Array.isArray(it) ? it[0] : it;
    const b = mk('button', CHIP(isOn(it, i)), lab);
    b.onclick = () => onPick(it, i);
    box.appendChild(b);
  });
  return box;
}
function slider(parent, label, min, max, step, val, onIn, off) {
  const row = mk('div', 'display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.25fr) 36px;gap:6px;align-items:center;' +
    (off ? 'opacity:.4' : ''));
  const lab = mk('div', 'font-size:10px;color:' + INK + ';opacity:.8;overflow:hidden;text-overflow:ellipsis;white-space:nowrap', label);
  lab.title = label;
  const inp = mk('input', 'width:100%;margin:0;accent-color:' + GOLD);
  inp.type = 'range'; inp.min = min; inp.max = max; inp.step = step; inp.value = val;
  const num = mk('div', 'font-size:10px;text-align:right;color:' + GOLD, fmt(val));
  inp.oninput = () => { const v = parseFloat(inp.value); num.textContent = fmt(v); onIn(v); };
  row.append(lab, inp, num);
  parent.appendChild(row);
  return inp;
}
const fmt = (v) => (Math.abs(v) >= 100 ? String(Math.round(v)) : String(Math.round(v * 100) / 100));

/* ---------- Palette ---------- */
function paintRail() {
  const keep = rail.scrollTop;
  rail.textContent = '';
  if (S.mode === 'bench') paintAxis();
  else paintWorldHead();
  paintStack();
  paintInk();
  paintTextures();
  paintSky();
  paintStory();
  paintLight();
  paintFX();
  paintView();
  if (S.mode === 'bench') paintAssets();
  paintJSON();
  paintBeleg();
  rail.scrollTop = keep;
}
function paintInk() {
  const b = section('Tusche · KFB Ink Outline', 'ink', S.ink ? 'an' : 'aus');
  btn(b, 'Tusche: ' + (S.ink ? 'an' : 'aus'), S.ink, () => { S.ink = !S.ink; view.setInkOn(S.ink); paintMode(); paintRail(); }, 'Sobel über Tiefe + Normalen · derselbe Stift für alles');
  chips(b, [['DEREK', 'derek'], ['OWNER-DEFAULT', 'owner'], ['RUHIG', 'calm']], () => false, (it) => {
    S.inkP = { ...INKM.DEF, ...(it[1] === 'derek' ? LOOK.INK_DEREK : it[1] === 'calm' ? { thin: 1.0, thick: 1.6, wobble: 0, strength: 0.7 } : {}) };
    view.setInkParams(S.inkP); paintRail();
  });
  for (const [k, lab, min, max, step] of INKM.PARAMS) slider(b, lab, min, max, step, S.inkP[k], (v) => { S.inkP[k] = v; view.setInkParams({ [k]: v }); });
  note(b, 'KFB-Schattenlogik: Licht = dünne Linie, Schatten = dicke Linie (Breite aus der Bildhelligkeit). Wobble, Aussetzer und Schattenlogik sind DELTA zum Owner kfb-ink-outline.js. SOURCE bleibt ohne Tusche.');
}
/* Story-Palette über alle Looks · Stopps aus dem Voxel-Owner (tintFor bei t = 0 / 0,5 / 1) */
async function applyStory() {
  try {
    const { M, WC } = await VOX.owner();
    const stops = WC.STORY_PALETTES[S.story].c;
    const at = (t) => M.tintFor(THREE, stops, t, 1, 0, { variation: 0, strength: 1 });
    LOOK.STORY.uStory0.value.copy(at(0.02));
    LOOK.STORY.uStory1.value.copy(at(0.5));
    LOOK.STORY.uStory2.value.copy(at(0.98));
    LOOK.STORY.uStoryAmt.value = S.storyAmt;
  } catch (e) {
    const line = 'Story-Palette nicht ladbar: ' + e.message.slice(0, 80);
    if (!BEFUNDE.includes(line)) BEFUNDE.push(line);
  }
}
function paintStory() {
  const b = section('Story-Palette · alle Looks', 'story', S.storyAmt > 0 ? VOX.MODE_LABELS[S.story] : 'aus');
  chips(b, VOX.MODE_LABELS, (it, i) => S.story === i, async (it, i) => { S.story = i; if (!S.storyAmt) S.storyAmt = 0.5; await applyStory(); paintRail(); say('Story-Palette ' + it); });
  slider(b, 'Stärke', 0, 1, 0.01, S.storyAmt, (v) => { S.storyAmt = v; LOOK.STORY.uStoryAmt.value = v; });
  note(b, 'Verlauf dunkel → Mitte → hell auf die Owner-Stopps aus world-context.js. Wirkt auf jedes Feld ausser SOURCE; das Voxel-Gelände hat die Palette ohnehin.');
}
/* Tageszeit-Zyklus · tinyskies Tag → Abend → Nacht, Licht folgt mit */
const CYCLE = [['tiny:day', 1.0], ['tiny:evening', 0.78], ['tiny:night', 0.5]];
let cycleT = 0;
function setCycle(on) {
  S.cycle = on;
  clearInterval(cycleT);
  if (!on) return;
  let k = Math.max(0, CYCLE.findIndex((c) => c[0] === S.sky));
  const step = async () => {
    const [mode, ex] = CYCLE[k % CYCLE.length];
    S.sky = mode;
    light.exposure = ex * (light.profile === 'whackman' ? LIGHT.DEF.exposure : 1);
    LIGHT.applyRenderer(view.renderer, light);
    await applySky(); applyExclusions();
    say('Tageszeit: ' + ['Tag', 'Abend', 'Nacht'][k % CYCLE.length]);
    k++;
  };
  step();
  cycleT = setInterval(step, S.cycleSec * 1000);
}
function paintSky() {
  const b = section('Himmel', 'sky', (SKY.MODES.find((m) => m[1] === S.sky) || ['?'])[0]);
  chips(b, SKY.MODES, (it) => S.sky === it[1], async (it) => { setCycle(false); S.sky = it[1]; await applySky(); applyExclusions(); paintRail(); say('Himmel: ' + it[0]); });
  btn(b, 'Tageszeit-Zyklus: ' + (S.cycle ? 'läuft' : 'aus'), S.cycle, () => { setCycle(!S.cycle); paintRail(); }, 'tinyskies Tag → Abend → Nacht · Belichtung folgt');
  slider(b, 'Sekunden je Tageszeit', 3, 30, 1, S.cycleSec, (v) => { S.cycleSec = v; if (S.cycle) setCycle(true); });
  note(b, 'REALISTISCH braucht Tonemapping (Licht WHACKMAN) · AQUARELL = Owner-Rezept rollercoaster-v11 · TINYSKIES = Bildschirm-Backdrop wie in der Quelle.');
}
function paintBeleg() {
  const b = section('Beleg', 'beleg', records.filter((r) => r.status === 'SICHTBAR').length + '/' + records.length);
  if (!S.open.beleg) return;
  renderEvid();
  b.append(btnJson, evidBody);
  evidBody.style.maxHeight = '50vh';
}

/* 1 · Was unterscheidet die Felder? */
function paintAxis() {
  const b = section('Felder · was wird verglichen?', 'axis', fieldName(S.target));
  chips(b, [['PRESETS', 'presets'], ['TEXTUREN', 'texturen'], ['STÄRKE', 'staerke']], (it) => S.axis === it[1], async (it) => {
    if (S.axis === it[1]) return;
    if (it[1] !== 'presets') {
      const from = looks[S.target > 0 ? S.target : 3];
      master = LOOK.makeLook(from.state());
      master.p.on = true;
      await mapsFor(master);
    } else {
      looks = S.fieldPresets.map((n) => LOOK.makeLook(LOOK.PRESETS[n] || {}));
      for (const l of looks) await mapsFor(l);
    }
    S.axis = it[1];
    if (S.target === 0) S.target = 3;
    await deriveFields();
    reapply();
    view.slots.forEach((s, i) => view.renameSlot(i, fieldName(i)));
    paintTags(); paintRail();
    say('Vergleich: ' + it[0]);
  });
  note(b, {
    presets: 'Jedes Feld trägt ein eigenes Preset. Die Regler unten gelten NUR für das aktive Feld.',
    texturen: 'Ein Look, drei Texturen. Regler gelten für alle drei Felder; Textur-Klick setzt die Textur des AKTIVEN Feldes.',
    staerke: 'Ein Look, eine Textur, EIN Regler in drei Stufen. Alle anderen Regler gelten für alle Felder.'
  }[S.axis]);
  if (S.axis === 'staerke') {
    chips(b, Object.entries(VARY).map(([k, v]) => [v[0], k]), (it) => S.vary === it[1], async (it) => {
      S.vary = it[1];
      await deriveFields();
      view.slots.forEach((s, i) => view.renameSlot(i, fieldName(i)));
      paintTags(); paintRail();
    });
  }
  /* Feldwähler als Abbild des Bildes */
  const grid = mk('div', 'display:grid;grid-template-columns:1fr 1fr;gap:3px;margin-top:2px');
  b.appendChild(grid);
  for (let i = 0; i < 4; i++) {
    const on = S.target === i;
    const c = mk('button', CHIP(on) + ';text-align:left;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;padding:6px 7px');
    c.textContent = (i === 0 ? '◇ ' : '') + fieldName(i);
    c.title = i === 0 ? 'SOURCE ist die unveränderte Referenz' : 'Feld aktiv setzen';
    c.onclick = () => { S.target = i; if (S.single) view.setSolo(i); paintTags(); paintRail(); };
    grid.appendChild(c);
  }
  if (S.axis === 'presets' && S.target > 0) {
    note(b, 'Preset für ' + fieldName(S.target) + ':');
    chips(b, Object.keys(LOOK.PRESETS).filter((n) => n !== 'SOURCE'), (n) => S.fieldPresets[S.target] === n, async (name) => {
      S.fieldPresets[S.target] = name;
      const l = looks[S.target];
      l.setAll(LOOK.PRESETS[name]);
      l.p.on = true;
      await mapsFor(l);
      LOOK.apply(view.slots[S.target].group, l);
      view.renameSlot(S.target, name);
      paintTags(); paintRail();
    });
  }
}
function paintWorldHead() {
  const b = section('Weltszene · Bildebenen (McCloud)', 'axis', (WLAYERS.find((l) => l[1] === S.wlayer) || [''])[0]);
  note(b, 'Je Bildebene ein eigener Look. Die Regler unten gelten für die gewählte Ebene.');
  const lg = mk('div', 'display:grid;grid-template-columns:1fr 1fr;gap:3px');
  b.appendChild(lg);
  for (const [lab, k, sub] of WLAYERS) {
    const on = S.wlayer === k;
    const c = mk('button', CHIP(on) + ';text-align:left;padding:5px 7px');
    c.innerHTML = '<div>' + lab + '</div><div style="font-size:9.5px;color:' + DIM + '">' + sub + ' · ' + S.worldPresets[k] + '</div>';
    c.onclick = () => { S.wlayer = k; paintRail(); };
    lg.appendChild(c);
  }
  note(b, 'Preset für ' + (WLAYERS.find((l) => l[1] === S.wlayer) || [''])[0] + ':');
  chips(b, Object.keys(LOOK.PRESETS).filter((n) => n !== 'SOURCE'), (n) => S.worldPresets[S.wlayer] === n, async (name) => {
    S.worldPresets[S.wlayer] = name;
    const l = worldLooks[S.wlayer];
    l.setAll(LOOK.PRESETS[name]); l.p.on = true;
    await mapsFor(l);
    reapply(); paintRail();
  });
  if (S.ground === 'voxel' && S.wlayer === 'terrain') note(b, 'Voxel-Gelände trägt das Owner-Material der Voxel Zone S2 — die Gelände-Ebene wirkt nur auf NATÜRLICH.');
  note(b, 'Gelände:');
  chips(b, [['NATÜRLICH', 'natur'], ['VOXEL', 'voxel'], ['AUS', 'aus']], (it) => S.ground === it[1], (it) => { S.ground = it[1]; loadWorld(); });
  if (S.ground === 'voxel') {
    note(b, 'Story-Palette (Voxel Zone S2 · world-context.js):');
    chips(b, VOX.MODE_LABELS, (it, i) => S.story === i, (it, i) => { S.story = i; loadWorld(); });
  }
  btn(b, '← zurück zur Bank', false, () => loadBench(S.asset || CHARACTERS[1]));
}
function btn(parent, text, on, fn, sub) {
  const b = mk('button', BTN + ';width:100%' + (on ? ';color:' + GOLD + ';border-color:' + GOLD : ''));
  b.innerHTML = '<div>' + text + '</div>' + (sub ? '<div style="color:' + DIM + ';font-size:10px">' + sub + '</div>' : '');
  b.onclick = fn;
  parent.appendChild(b);
  return b;
}

/* 2 · Oberfläche als Ebenen-Stapel */
function paintStack() {
  const L = editLook();
  const target = S.mode === 'world' ? (WLAYERS.find((l) => l[1] === S.wlayer) || [''])[0] : S.axis === 'presets' ? fieldName(S.target) : 'alle Vergleichsfelder';
  const b = section('Oberfläche · Ebenen', 'stack', target);
  if (!L) {
    note(b, 'SOURCE ist die unveränderte Referenz und nimmt keine Regler an. Ein anderes Feld anklicken — im Bild oder oben im Feldwähler.');
    return;
  }
  for (const Ly of LAYERS) {
    const val = L.p[Ly.key];
    const on = val > 0.0001;
    const varied = S.mode === 'bench' && S.axis === 'staerke' && S.vary === Ly.key;
    const row = mk('div', 'display:flex;flex-direction:column;gap:4px;border-top:1px solid ' + LINE + ';padding-top:5px');
    const head = mk('div', 'display:grid;grid-template-columns:18px minmax(0,1fr) 22px 20px;gap:5px;align-items:center');
    const tog = mk('button', 'width:16px;height:16px;padding:0;cursor:pointer;border:1px solid ' + (on ? GOLD : LINE) +
      ';background:' + (on ? GOLD : 'transparent'));
    tog.title = on ? 'Ebene aus' : 'Ebene an';
    tog.onclick = () => {
      if (on) { L.p['_' + Ly.key] = val; setParam(Ly.key, 0); }
      else setParam(Ly.key, L.p['_' + Ly.key] || PDEF[Ly.key][3] * 0.5);
      paintRail();
    };
    const nm = mk('div', 'min-width:0');
    nm.innerHTML = '<div style="font-size:11px;color:' + (on ? INK : DIM) + '">' + Ly.name + (varied ? ' <span style="color:' + GOLD + '">· variiert</span>' : '') + '</div>' +
      '<div style="font-size:9.5px;color:' + DIM + ';line-height:1.35">' + Ly.what + '</div>';
    const eye = mk('button', 'width:22px;height:22px;padding:0;display:grid;place-items:center;cursor:pointer;background:none;border:1px solid ' +
      (LOOK.DEBUG.value === Ly.ch ? GOLD : LINE) + ';color:' + (LOOK.DEBUG.value === Ly.ch ? GOLD : INK));
    eye.innerHTML = SVG_EYE;
    eye.title = 'Kanal zeigen, in dem diese Ebene wirkt: ' + CHANNELS[Ly.ch][0];
    eye.onclick = () => setChannel(LOOK.DEBUG.value === Ly.ch ? 0 : Ly.ch);
    if (!Ly.ch) eye.style.visibility = 'hidden';
    const more = mk('button', 'width:20px;height:22px;padding:0;cursor:pointer;background:none;border:none;color:' + (Ly.more.length ? INK : 'transparent'),
      S.openLayer === Ly.id ? '▾' : '▸');
    more.onclick = () => { if (!Ly.more.length) return; S.openLayer = S.openLayer === Ly.id ? null : Ly.id; paintRail(); };
    head.append(tog, nm, eye, more);
    row.appendChild(head);
    const P = PDEF[Ly.key];
    if (!varied) slider(row, 'Stärke', P[2], P[3], P[4], val, (v) => setParam(Ly.key, v), !on);
    else note(row, 'Stufen ' + VARY[S.vary][1].join(' · ') + ' — steht in den Feldnamen');
    if (S.openLayer === Ly.id) {
      for (const k of Ly.more) {
        const q = PDEF[k];
        if (S.mode === 'bench' && S.axis === 'staerke' && S.vary === k) { note(row, q[1] + ': variiert'); continue; }
        slider(row, q[1], q[2], q[3], q[4], L.p[k], (v) => setParam(k, v));
      }
    }
    b.appendChild(row);
  }
}

/* 3 · Textur-Atelier: Kacheln sehen statt Namen lesen */
const genPrev = mk('div', 'display:flex;flex-wrap:wrap;gap:6px;align-items:flex-start');
function paintGenPreview() {
  genPrev.textContent = '';
  if (!gen) return;
  const mkc = (src) => {
    const c = mk('canvas', 'width:72px;height:72px;border:1px solid ' + LINE + ';flex:0 0 auto');
    c.width = c.height = 72;
    c.getContext('2d').drawImage(src, 0, 0, 72, 72);
    return c;
  };
  const cap = mk('div', 'flex:1 1 100%;font-size:9.5px;color:' + DIM,
    '1 Kachel · 2×2 Wiederholung · Naht ' + MACRO.seamError(gen.diffuse) + '/255 (0 = exakt periodisch)');
  genPrev.append(mkc(gen.diffuse), mkc(MACRO.repeatPreview(gen.diffuse, 2, 144)), cap);
}
function currentTex() {
  if (S.mode === 'bench' && S.axis === 'texturen') return S.target > 0 ? S.fieldTex[S.target] : null;
  const L = editLook();
  return L ? { src: L.p.src, set: L.p.set } : null;
}
function paintTextures() {
  const cur = currentTex();
  const who = S.mode === 'world' ? 'ganze Szene' : S.axis === 'staerke' ? 'alle Felder' : fieldName(S.target);
  const b = section('Textur · nahtlose Kacheln', 'tex', who);
  const TH = 'https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/Textures/';
  const sw = mk('div', 'display:grid;grid-template-columns:repeat(auto-fill,minmax(52px,1fr));gap:4px');
  b.appendChild(sw);
  const tile = (label, on, fill, fn) => {
    const t = mk('button', 'position:relative;aspect-ratio:1;padding:0;cursor:pointer;overflow:hidden;background:' + BG2 +
      ';border:' + (on ? '2px solid ' + GOLD : '1px solid ' + LINE));
    fill(t);
    const cap = mk('div', 'position:absolute;left:0;right:0;bottom:0;font:9px/1.2 ' + FONT + ';color:' + INK +
      ';background:rgba(19,17,26,.78);padding:1px 2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis', label);
    t.appendChild(cap);
    t.title = label;
    t.onclick = fn;
    sw.appendChild(t);
  };
  tile('GENERATOR', cur && cur.src === 'gen', (t) => {
    if (!gen) return;
    const c = mk('canvas', 'width:100%;height:100%;display:block');
    c.width = c.height = 64;
    c.getContext('2d').drawImage(MACRO.repeatPreview(gen.diffuse, 2, 128), 0, 0, 64, 64);
    t.appendChild(c);
  }, () => setTexture('gen'));
  tile('GENERATOR RGB', cur && cur.src === 'genrgb', (t) => {
    if (!genRgb) return;
    const c = mk('canvas', 'width:100%;height:100%;display:block');
    c.width = c.height = 64;
    c.getContext('2d').drawImage(MACRO.repeatPreview(genRgb.diffuse, 2, 128), 0, 0, 64, 64);
    t.appendChild(c);
  }, () => setTexture('genrgb'));
  tile('REFERENZ RGB', cur && cur.src === 'ref', (t) => {
    const img = mk('img', 'width:100%;height:100%;object-fit:cover;display:block');
    img.alt = 'Referenz RGB';
    img.src = LOOK.REF_URL;
    t.appendChild(img);
  }, () => setTexture('ref'));
  const fam = LOOK.SETS.find((f) => f[0] === S.texFam) || LOOK.SETS[0];
  for (const s of fam[1]) {
    tile(s, cur && cur.src === 'set' && cur.set === s, (t) => {
      const img = mk('img', 'width:100%;height:100%;object-fit:cover;display:block');
      img.loading = 'lazy';
      img.alt = s;
      img.src = TH + encodeURIComponent(s) + '/' + encodeURIComponent(s + '_diffuse') + '.jpg';
      t.appendChild(img);
    }, () => setTexture('set', s));
  }
  chips(b, LOOK.SETS.map((f) => f[0]), (f) => f === S.texFam, (f) => { S.texFam = f; paintRail(); });
  note(b, 'Repo-Sätze: media/3D_Assets/Textures (CC0, 1K). Generator: konstruktiv periodisch, siehe unten.');
  const g = section('Generator · Kachel bauen', 'gen', 'Seed ' + S.macro.seed);
  g.appendChild(genPrev);
  paintGenPreview();
  btn(g, '↻ neuer Seed', false, () => { regenerate(true); paintRail(); });
  for (const [k, lab, min, max, step] of MACRO.PARAMS) {
    if (k === 'seed') continue;
    slider(g, lab, min, max, step, S.macro[k], (v) => {
      S.macro[k] = v;
      clearTimeout(regenerate._t);
      regenerate._t = setTimeout(() => regenerate(false), 90);
    });
  }
}

/* 4 · Licht */
function paintLight() {
  const b = section('Licht', 'licht', light.profile === 'whackman' ? 'WHACKMAN' : 'BASELINE');
  chips(b, ['BASELINE', 'WHACKMAN'], (it) => (it === 'WHACKMAN') === (light.profile === 'whackman'), (it) => setProfile(it));
  note(b, light.profile === 'whackman'
    ? 'Dämmerung aus wm-boot/gate-b: kaltes schwaches Weltlicht, Stimmung aus dem Fackelpool. Bank: 2 Fackeln, Welt: 6.'
    : 'Neutrales Prüfstandlicht (kit-lab). Zeigt die Quellfarben wie im KayKit-Original.');
  for (const [k, lab, min, max, step] of LIGHT.PARAMS) {
    slider(b, lab, min, max, step, light[k], (v) => {
      light[k] = v;
      for (const s of view.slots) s.rig.refresh();
      LIGHT.applyRenderer(view.renderer, light);
    });
  }
}
function setProfile(it) {
  light.profile = it === 'WHACKMAN' ? 'whackman' : 'baseline';
  Object.assign(light, it === 'WHACKMAN' ? LIGHT.WHACKMAN : LIGHT.BASELINE);
  for (const s of view.slots) s.rig.refresh();
  LIGHT.applyRenderer(view.renderer, light);
  paintRail();
  say('Licht: ' + it);
}

/* 5 · PostFX */
function paintFX() {
  const b = section('PostFX', 'fx', (view.fx.bloom ? 'Bloom' : '') + (view.fx.grade ? ' Grade' : '') || 'aus');
  if (view.slots.length > 1) { note(b, 'Nur in der WELT-Ansicht (ein Feld). Vier Composer nebeneinander wären Rechenzeit ohne Erkenntnis.'); return; }
  if (S.ink) note(b, 'Solange die Tusche an ist, laufen Bloom/Grade nicht — die Tusche macht Tonemapping selbst (Owner-Befund: sonst doppelt, ~11 % zu dunkel).');
  btn(b, 'Selective Bloom: ' + (view.fx.bloom ? 'an' : 'aus'), view.fx.bloom, () => { view.fx.bloom = !view.fx.bloom; paintRail(); }, 'nur getaggte Emission (Fackelglut)');
  slider(b, 'Bloom Strength', 0, 3, 0.01, view.fx.strength, (v) => { view.fx.strength = v; });
  slider(b, 'Bloom Threshold', 0, 1, 0.01, view.fx.threshold, (v) => { view.fx.threshold = v; });
  btn(b, 'Grade: ' + (view.fx.grade ? 'an' : 'aus'), view.fx.grade, () => { view.fx.grade = !view.fx.grade; paintRail(); }, 'kein .cube im Repo · echtes LUT ist SOURCE_REQUIRED');
  slider(b, 'Grade Intensity', 0, 1, 0.01, view.fx.gradeAmt, (v) => { view.fx.gradeAmt = v; });
}

/* 6 · Ansicht */
function paintView() {
  const b = section('Ansicht', 'ansicht');
  btn(b, 'Messraster: ' + (S.grid ? 'an' : 'aus'), S.grid, () => { S.grid = !S.grid; view.grid(S.grid && !(S.mode === 'world' && terrain)); paintRail(); });
  btn(b, 'Feldnamen: ' + (S.tags ? 'an' : 'aus'), S.tags, () => { S.tags = !S.tags; paintTags(); paintRail(); });
  btn(b, 'Spendernamen: ' + (S.names ? 'an' : 'aus'), S.names, () => { S.names = !S.names; paintRail(); }, 'nur Weltszene, unter der Standfläche');
  btn(b, 'Eigenschatten: ' + (S.selfShadow ? 'an' : 'aus'), S.selfShadow, () => {
    S.selfShadow = !S.selfShadow;
    for (const s of view.slots) for (const c of s.group.children) if (c.name !== 'terrain:lab') selfShadow(c);
    paintRail();
  }, 'aus = wie KayKit-Original · an = harte Schattenkarte auf den Figuren');
  btn(b, 'Eigene Clips: ' + (S.move ? 'an' : 'aus'), S.move, () => { S.move = !S.move; if (!S.move) mixers = []; paintRail(); });
  btn(b, 'Kamera zurücksetzen', false, () => {
    const g = view.slots[0] && view.slots[0].group;
    if (!g) return;
    view.frame(new THREE.Box3().setFromObject(g), S.mode === 'bench' ? 1.05 : 0.9, S.mode === 'bench' ? undefined : [0.4, 0.7, 1]);
  });
}

/* 7 · Asset (sekundär) */
const TABS = [['CHARAKTERE', 'chars'], ['KAYKIT', 'kaykit'], ['TINY TREATS', 'treats'],
  ['STRUKTUR', 'struktur'], ['WELT/RACE', 'welt'], ['NATUR', 'natur']];
const SLOTS_MAP = { chars: CHARACTERS, struktur: STRUKTUR, welt: WELT, natur: [...NATUR, ...NATUR_PLUS, ...PLANT_LAB] };
let packAssets = [];
function paintAssets() {
  const b = section('Asset für die Bank', 'asset', S.assetLabel);
  chips(b, TABS.map((t) => t[0]), (it) => TABS.find((t) => t[1] === S.tab)[0] === it, (it) => {
    S.tab = TABS.find((t) => t[0] === it)[1];
    S.pack = null;
    paintRail();
  });
  const list = mk('div', 'display:flex;flex-direction:column;gap:3px;max-height:36vh;overflow:auto');
  b.appendChild(list);
  const pick = (entry) => loadBench(entry);
  const slots = SLOTS_MAP[S.tab];
  const item = (text, on, sub, fn, bad) => {
    const x = btn(list, text, on, fn, sub);
    if (bad) x.style.color = RED;
    return x;
  };
  if (slots) {
    for (const e of slots) {
      const r = records.find((x) => x.label === e.label);
      item(e.label, S.assetLabel === e.label, e.slug || '', () => pick(e), r && r.status !== 'SICHTBAR').title = e.note || '';
    }
    return;
  }
  const fam = S.tab === 'kaykit' ? REG.KAYKIT : REG.TREATS;
  if (!S.pack) {
    if (S.tab === 'treats') for (const e of TREATS_SLOTS) item('· ' + e.label, S.assetLabel === e.label, e.slug, () => pick(e));
    for (const [slug, lab] of fam) {
      item(lab, false, slug, async () => {
        S.pack = slug;
        try {
          packAssets = await REG.models(slug);
          paintRail();
          if (packAssets.length) pick({ id: slug, label: lab + ' · ' + packAssets[0].name, slug, mount: () => mountAsset(packAssets[0]) });
        } catch (e) { say('REGISTRY-FEHLER · ' + e.message); S.pack = null; }
      });
    }
    return;
  }
  item('← Pakete', true, '', () => { S.pack = null; packAssets = []; paintRail(); });
  for (const a of packAssets.slice(0, 300)) {
    item(a.name, S.assetLabel.endsWith(a.name), a.format + ' · ' + Math.round((a.sizeBytes || 0) / 1024) + ' kB',
      () => pick({ id: a.assetId, label: a.name, slug: S.pack, mount: () => mountAsset(a) }));
  }
}

/* 8 · Look-JSON */
function paintJSON() {
  const b = section('Look speichern / laden', 'json');
  btn(b, 'Look-JSON kopieren', false, () => copy(lookJSON(), 'Look-JSON kopiert'));
  const ta = mk('textarea', 'width:100%;box-sizing:border-box;height:70px;font:' + MONO + ';font-size:10px;color:' + INK +
    ';background:' + BG2 + ';border:1px solid ' + LINE);
  ta.placeholder = 'Look-JSON einsetzen …';
  b.appendChild(ta);
  btn(b, 'Übernehmen', false, async () => {
    try {
      const j = JSON.parse(ta.value);
      if (j.makroGenerator) { S.macro = { ...S.macro, ...j.makroGenerator }; regenerate(false); }
      if (j.licht) Object.assign(light, j.licht);
      if (j.postfx) Object.assign(view.fx, j.postfx);
      if (j.vergleich) { S.axis = j.vergleich.achse || S.axis; S.vary = j.vergleich.variiert || S.vary; if (j.vergleich.texturen) S.fieldTex = j.vergleich.texturen; }
      if (j.master) { master.setAll(j.master); await mapsFor(master); }
      if (Array.isArray(j.felder)) {
        for (let i = 0; i < Math.min(j.felder.length, looks.length); i++) {
          looks[i].setAll(j.felder[i]);
          await mapsFor(looks[i]);
        }
      }
      await deriveFields();
      reapply();
      for (const s of view.slots) s.rig.refresh();
      LIGHT.applyRenderer(view.renderer, light);
      paintTags(); paintRail();
      say('Look-JSON übernommen');
    } catch (e) { say('Look-JSON ungültig: ' + e.message); }
  });
}
function lookJSON() {
  return JSON.stringify({
    schema: 'kfb.worlddesign-look/2', stand: new Date().toISOString(),
    asset: S.assetLabel, modus: S.mode,
    vergleich: { achse: S.axis, variiert: S.vary, texturen: S.fieldTex },
    makroGenerator: S.macro,
    master: master.state(),
    felder: looks.map((l, i) => ({ feld: fieldName(i), ...l.state() })),
    welt: Object.fromEntries(Object.entries(worldLooks).map(([k, l]) => [k, { preset: S.worldPresets[k], ...l.state() }])),
    tusche: { an: S.ink, ...S.inkP }, himmel: S.sky,
    licht: { ...light },
    postfx: { bloom: view.fx.bloom, strength: view.fx.strength, threshold: view.fx.threshold, grade: view.fx.grade, gradeAmt: view.fx.gradeAmt, lut: 'SOURCE_REQUIRED · kein .cube im Repo' }
  }, null, 2);
}
async function copy(txt, msg) {
  try { await navigator.clipboard.writeText(txt); say(msg); }
  catch { evidBody.textContent = txt; S.open.beleg = true; S.railOpen = true; layout(); paintRail(); evidBody.textContent = txt; say('Clipboard gesperrt — Text steht im Abschnitt Beleg'); }
}

/* ---------- Belegtafel ---------- */
const evidBody = mk('div', 'overflow:auto;white-space:pre-wrap;font-size:10px;line-height:1.5;word-break:break-word;' +
  'border:1px solid ' + LINE + ';padding:7px;background:rgba(0,0,0,.28);flex:1');
const btnJson = mk('button', BTN, 'Beleg-JSON kopieren');
evid.append(mk('div', 'font:600 9px/1.4 ' + FONT + ';letter-spacing:.14em;text-transform:uppercase;color:' + GOLD, 'Beleg'), btnJson, evidBody);
btnJson.onclick = () => copy(JSON.stringify({
  stand: new Date().toISOString(), look: JSON.parse(lookJSON()), befunde: BEFUNDE,
  eintraege: records.map((r) => ({ label: r.label, status: r.status, reason: r.reason, ...r.facts })),
  owners: OWNERS.map(([was, wo, wie]) => ({ was, wo, wie }))
}, null, 2), 'Beleg-JSON kopiert');

function renderEvid() {
  const A = ['KFB WORLDDESIGN LAB v1', ''];
  A.push('Modus: ' + (S.mode === 'bench' ? 'BANK · Vergleich ' + S.axis.toUpperCase() + (S.axis === 'staerke' ? ' (' + VARY[S.vary][0] + ')' : '') : 'WELT · Gelände ' + (terrain ? 'an' : 'aus')));
  if (S.mode === 'bench') A.push('Felder: ' + [0, 1, 2, 3].map(fieldName).join(' | ') + ' · aktiv ' + fieldName(S.target));
  A.push('Licht: ' + light.profile.toUpperCase() + ' · Kanal ' + CHANNELS.find((c) => c[1] === LOOK.DEBUG.value)[0]);
  if (gen) A.push('Generator: Seed ' + S.macro.seed + ' · Naht ' + MACRO.seamError(gen.diffuse) + '/255');
  A.push('');
  for (const r of records) {
    if (r.status !== 'SICHTBAR') { A.push('   [' + r.status + '] ' + r.label, '     ' + r.reason, ''); continue; }
    const f = r.facts;
    A.push('   ' + r.label, '     ' + f.path, '     rev ' + String(f.rev).slice(0, 10) + (f.shard ? ' · ' + f.shard : ''));
    const bits = [];
    if (f.size && f.size.length) bits.push('bbox ' + f.size.join('×'));
    if (f.bones) bits.push(f.bones + ' bones');
    if (f.clips && f.clips.length) bits.push(f.clips.length + ' clips');
    if (f.augen) bits.push('Augen: ' + f.augen);
    if (f.mund) bits.push(f.mund);
    if (bits.length) A.push('     ' + bits.join(' · '));
    if (f.rigProbe) for (const p of f.rigProbe) A.push('     Rig-Bindung ' + p);
    A.push('     → ' + f.owner, '');
  }
  if (voxel) A.push('   Gelände · ' + voxel.label + ' · Owner kfb-box-material.js · Säulenhöhen aus wd-terrain.js', '');
  else if (terrain) A.push('   Gelände · Laborgeometrie (wd-terrain.js), kein Paketasset · ' + terrain.size.map(Math.round).join('×') + ' m', '');
  A.push('── Eigentümer (aufgerufen, nicht nachgebaut)');
  for (const [was, wo, wie] of OWNERS) A.push('   ' + was, '     ' + wo, '     → ' + wie);
  A.push('', '── MISSING_DELTA');
  A.push('   Mehrfeld-Rendering + PostFX-Composer · Makro-Generator · Grade statt LUT · organisches Gelände');
  A.push('', '── Befund GothGirl-Brust/Hals');
  A.push('   dunkle Fläche = Eigenschatten der Schattenkarte (Haar/Kopf), Lichtnaht am Hals = Versatz derselben.');
  A.push('   Gemessen: receiveShadow aus ⇒ beides weg. Vorgabe jetzt: Spender werfen, empfangen nicht.');
  if (BEFUNDE.length) { A.push('', '── Umgebungsbefunde'); for (const b of BEFUNDE) A.push('   ' + b); }
  evidBody.textContent = A.join('\n');
}

/* ---------- Props aus dem DC ---------- */
let lastProps = '';
setInterval(() => {
  const P = window.__wdProps || {};
  const key = [P.modus, P.licht, P.raster, P.bewegung, P.feldnamen].join('|');
  if (key === lastProps) return;
  const first = !lastProps;
  lastProps = key;
  if (P.raster != null) { S.grid = !!P.raster; view.grid(S.grid && !(S.mode === 'world' && terrain)); }
  if (P.bewegung != null) S.move = !!P.bewegung;
  if (P.feldnamen != null) { S.tags = !!P.feldnamen; paintTags(); }
  if (P.licht && (P.licht === 'WHACKMAN') !== (light.profile === 'whackman')) setProfile(P.licht);
  const want = P.modus === 'WORLD SCENE' ? 'world' : 'bench';
  if (!first && want !== S.mode && !busy) setMode(want);
  else if (!busy) paintRail();
}, 300);

/* ---------- Takt ---------- */
let last = performance.now();
view.setTick(() => {
  const now = performance.now();
  const dt = Math.min(0.05, Math.max(0, (now - last) / 1000));
  last = now;
  for (const m of mixers) { try { m.update(dt); } catch { /* ein Rig darf nicht den Takt reissen */ } }
  for (const s of view.slots) s.rig.update(now / 1000);
  LOOK.TIME.value = now / 1000;
  placeNameTags();
});

/* ---------- Start ---------- */
LIGHT.applyRenderer(view.renderer, light);
paintMode();
layout();
regenerate(false);
renderEvid();
loadBench(CHARACTERS[1]);
window.__wd = { view, S, get looks() { return looks; }, get master() { return master; }, light, MACRO, LOOK, records: () => records, loadWorld, loadBench, TREATS_SLOTS, CHARACTERS, setChannel };
