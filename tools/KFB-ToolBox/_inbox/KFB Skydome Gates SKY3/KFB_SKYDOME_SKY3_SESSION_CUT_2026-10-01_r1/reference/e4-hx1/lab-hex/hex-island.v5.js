/* KFB · HX1 Sky · hex-island.v5 (01.10.) — Kopie von hex-island.v2.js (HX1) mit sechs Haken für den EnvironmentHost (SKY1 E4): Himmel/Nebel/Hintergrund/Tageszeit/Wetter/Schale nur noch über lab-sky/env-host.v1,
 *   Wolken = Clay-Familie aus dem Jarlan-Donor (lab-sky/cloud-family.v1) statt Kugel-Haufen, Lens Flare/Regen nach dem Composer, eigener localStorage-Schlüssel. Terrain, Track Core, Race, Bewegung, Spielkamera: unverändert v2.
 *   v2 bleibt unberührt. */
/* KFB · HX1 · Hex-Kosmos v2 (30.09.) — Kopie von hex-island.v1.js (HX0) plus: Kosmos nach R1A (Burg Mitte, drei Decks außen,
 *   eine geschlossene Joyride-Route über die Hex-Wegkacheln und durch den Rinnstein), Skydome aus travel-v16 (S15 lib/sky),
 *   Deck liegt auf den Kacheln (deckDepth 0,6 auf der Insel). HX0 bleibt unverändert.
 * Stand HX0 (Bühne und Weltdokument):
 * Owner-Grenzen: Kacheln/Kanten = hex-grid.js (Corpus 22.09., unverändert) · Brücke = Track Core v0.12 (vendor-j15, unverändert,
 * compileRecipe + runChecks) · Band = band-module.js (Resident Atlas S15, unverändert) · Knetform = clay-soften.v1 mit den Profilen
 * aus S15 clay-k1 · Material = K2 (clay-material.v10 + clay-relief.v5 + clay-toolmix.v1, Weltmaß wie clay-tools.v1).
 * Maßstab (abgeleitet, nicht gesetzt): Wegbreite der Hex-Straße = Track Core WIDTHS.STANDARD. Die Wegbreite wird an hex_road_A
 *   gemessen (Draufsicht, Farbe der Wegmitte gegen die Wiese). S = 14,4 m / gemessene Wegbreite. (Georg 30.09.: Hex größer,
 *   Wegbreite = Trackbreite; der Track führt als Dirt-Track über die Insel.)
 * Knetform wie S15 clay-k1 (clay-soften.v1, Profile je Klasse), je Netz ≤ 4000 △. Abweichung von S15: Kacheln werden auch gerundet
 *   (Georg 30.09.: »abgerundete Ecken«), Oberkante bleibt auf dem Millimeter. Farben und Strang-Sprache aus Joyride (T4/J15).
 * Figurmaß: Gitarrist (Rig_Medium) wird auf 1,85 m gebracht = ActionFigure Rig_Medium in J14.
 * Weltdokument: kfb.hex-world/1 (Vorschlag aus NEXT_FIVE §4), Inseln + Objekte + Sockel + Links. Undo als Dokument-Stände. */
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { TransformControls } from 'three/addons/controls/TransformControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { hexMetrics, hexToWorld, worldToHex, neighbor, TILE_EDGES, rotKinds, rotDeg } from '../vendor-hex/hex-grid.js';
import * as TC from '../vendor-j15/lab-track/core/track-core.v012.mjs';
import { buildTrack } from '../vendor-j15/lab-track/core/stream-to-three.v5.mjs';
import { mountBandModule } from '../vendor-ra15/lib/band-module.js';
import { softenGeometry } from '../vendor-ra15/lib/clay/clay-soften.v1.js';
import { makeClayRelief } from '../lab-clay/clay-relief.v2.js';
import { makeToolReliefs } from '../lab-clay/clay-relief.v5.js';
import * as C from '../lab-clay/clay-material.v10.js';
import { TOOLMIX } from '../lab-clay/clay-toolmix.v1.js';
import { cosmosIslands, cosmosRecipe } from './cosmos-route.v1.js';
import { createEnvironmentHost } from '../lab-sky/env-host.v1.js';
import * as CF from '../lab-sky/cloud-family.v1.js';

const here = f => new URL(f, import.meta.url).href;
const REPO = 'georg-doc/kayfabizarro';
const raw = (c, p) => `https://raw.githubusercontent.com/${REPO}/${c}/${p.split('/').map(encodeURIComponent).join('/')}`;
const DEG = Math.PI / 180, r4 = x => Math.round(x * 1e4) / 1e4;
export const SCHEMA = 'kfb.hex-world/1';
const REV = 'hx1.r1';
const BAND_KEY = 'scene|orc-band';
/* S15 clay-k1 PROF (Knetform je Klasse), unverändert übernommen */
/* Gebäude: »fein« = K1-Profil vehicle.soften aus clay-profiles.v2 (für kleinteilige KayKit-Autos gesetzt, in H0 abgenommen):
   feines Netz zuerst (maxEdge 0,03), dann wirkt Taubin nur an den Kanten. Mit S15 house (iters 3, lump 0,006, 1 Stufe)
   schmolzen die Zinnen von building_castle_blue: ihre Kanten sind kürzer als maxEdge 0,18 und wurden nie geteilt. */
const FORM = { leicht: { ...C.PROFILES.vehicle.soften, maxLevels: 3 }, k1: { iters: 3, lump: 0.006, maxLevels: 1 } };
/* Befund 30.09. (Bild): beide Stufen runden die Zinnen (0,1 Kacheleinheiten) weg — Laplace-Glättung frisst jedes Merkmal,
   das kleiner ist als ihr Wirkweg. Vorgabe darum: Gebäude ohne Knetform, Knete nur über das K2-Material. */
let HOUSE_FORM = 'aus';
const K1 = { prop: { iters: 4, lump: 0.01 }, get house() { return FORM[HOUSE_FORM]; }, road: { maxEdge: 0.16, iters: 4, lump: 0.01 },
  nature: { maxLevels: 0, iters: 1, lump: 0.06 }, flat: { maxEdge: 0.16, iters: 2, lump: 0 } };
const QUIET = { print: 0.3, dent: 0, gouge: 0, crack: 0, stroke: 1, facet: 0.9, crease: 0.5 };
const prof = (key, scale, k, over = {}) => { const p = { ...C.PROFILES[key], ...over }; p.scale = (scale ?? p.scale) * k; p.gougeSize *= k; p.crackSize *= k; p.dentSize *= k; return p; };
const WK = 3; // Weltfaktor wie K2/T3 (Handmaß 1,5 m)
const LOOK = {
  tile: { ...prof('terrainFg', 1.1, WK, { print: 0, dent: 0, gouge: 0, crack: 0, stroke: 0.9, facet: 0.8, crease: 0.4 }), tools: TOOLMIX.terrain },
  building: { ...prof('house', 0.6, WK, QUIET), tools: TOOLMIX.house },
  nature: { ...prof('nature', 0.6, WK, { ...QUIET, dent: 0 }), tools: TOOLMIX.nature },
  prop: { ...prof('prop', null, WK, QUIET), tools: TOOLMIX.vehicle },
  track: { ...prof('house', 0.6, WK, QUIET), tools: TOOLMIX.strang },
  figure: { ...C.PROFILES.figure, legacy: 0, dent: 0, gouge: 0, crack: 0 },
  water: { ...prof('water', null, WK) },
  earth: { ...prof('terrainFg', 1.1, WK, { print: 0, dent: 0.3, gouge: 0.2, crack: 0.2, stroke: 1, facet: 1, crease: 0.6 }), tools: TOOLMIX.rock },
  cloud: { ...prof('cloud', null, WK, QUIET), tools: TOOLMIX.cloud }
};
const kindOf = (role, name) => {
  if (role === 'tile' || role === 'square') return 'flat';
  if (/dead|bare|branch|twig|trunk|stick|stump|fence|flag|banner/.test(name)) return 'thin';
  if (role === 'nature') return 'nature';
  if (role === 'building') return 'house';
  return 'prop';
};
const edgeKinds = (base, turns) => { const k = TILE_EDGES[base.replace(/_waterless$/, '')]; return k ? rotKinds(k, turns) : null; };
/* Farben aus Joyride: WORLDS aus vendor-j15/lab-track/track-look.v5.js (J15, T4), Werte 1:1 abgeschrieben, weil das Modul
   eine ganze Bühne bootet. Zuordnung KayKit → Welt nach Farbton je Klasse (Tabelle MAPS), Helligkeit bleibt als Schattierung. */
export const WORLDS = {
  canyon: { name: 'Canyon', sky: '#96bede', roadStreet: '#566680', roadTrack: '#3d4a60', strang: '#ef5a22', table: '#8b68c7', hill: ['#a582d9', '#7b5bb8'],
    tower: ['#ef5a22', '#e8743a'], leaf: ['#1f7a3e', '#2f8a45', '#cdc666'], trunk: '#8a5a3a', rock: '#e2d0bc', cloud: '#e2d0bc', pad: '#f2b632', kart: ['#f2b632', '#5983ac', '#e2d0bc'] },
  bucht: { name: 'Bucht', sky: '#8fd6ec', roadStreet: '#5f7f9a', roadTrack: '#3e5d7c', strang: '#f2708a', table: '#f0cf7e', hill: ['#5cc3bf', '#46adb2'],
    tower: ['#9a6fd0', '#b08ae0'], leaf: ['#8fcf45', '#5fb84a', '#f7a1c4'], trunk: '#c9895a', rock: '#9a6fd0', cloud: '#fff4e2', pad: '#f7d23c', kart: ['#f7d23c', '#9a6fd0', '#fff4e2'] },
  otown: { name: 'O-Town', sky: '#a8d8b9', roadStreet: '#6a6e8f', roadTrack: '#4a4d6e', strang: '#e9b53b', table: '#3aa596', hill: ['#2f8f83', '#4cb5a5'],
    tower: ['#c9508f', '#e0679f'], leaf: ['#f08a2c', '#f5b041', '#c9508f'], trunk: '#6b4a8a', rock: '#e0679f', cloud: '#f3ead8', pad: '#fff06a', kart: ['#fff06a', '#6b4a8a', '#f08a2c'] }
};
const hex2rgb = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
function rgb2hsl(r, g, b) { r /= 255; g /= 255; b /= 255; const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, d = mx - mn; if (!d) return [0, 0, l];
  const s = d / (1 - Math.abs(2 * l - 1)); let h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h *= 60; if (h < 0) h += 360; return [h, s, l]; }
function hsl2rgb(h, s, l) { const c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs((h / 60) % 2 - 1)), m = l - c / 2;
  const [r, g, b] = h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x]; return [(r + m) * 255, (g + m) * 255, (b + m) * 255]; }
/* Klasse der KayKit-Farbe → Rolle der Welt, je Gruppe (Gelände, Bau, Natur) */
const MAPS = {
  world:  { grey: 'rock', light: 'cloud', green: ['hill', 0], greenDark: ['hill', 1], blue: 'table', sand: 'rock', brown: 'trunk', red: ['tower', 0], purple: ['tower', 1] },
  house:  { grey: 'rock', light: 'cloud', green: ['leaf', 1], greenDark: ['leaf', 0], blue: ['tower', 1], sand: 'rock', brown: 'trunk', red: ['tower', 0], purple: ['tower', 1] },
  nature: { grey: 'rock', light: 'cloud', green: ['leaf', 1], greenDark: ['leaf', 0], blue: 'table', sand: 'rock', brown: 'trunk', red: ['leaf', 2], purple: ['leaf', 2] }
};
/* Grenze Gelb/Grün aus der gemessenen Wiesenfarbe von hex_road_A (KayKit-Gras ist gelbgrün), nicht gesetzt */
let HUE_G0 = 65;
const classOf = (h, s, l) => s < 0.16 ? (l > 0.72 ? 'light' : 'grey') : h >= HUE_G0 && h < 170 ? (l < 0.36 ? 'greenDark' : 'green') : h >= 170 && h < 255 ? 'blue'
  : h >= 255 && h < 330 ? 'purple' : h >= 20 && h < HUE_G0 ? (l >= 0.55 ? 'sand' : 'brown') : 'red';
function mapRGB(r, g, b, W, group, cls) {
  if (!W) return [r, g, b];
  const [h, s, l] = rgb2hsl(r, g, b), role = MAPS[group][cls || classOf(h, s, l)], tgt = Array.isArray(role) ? W[role[0]][role[1]] : W[role];
  const [th, ts, tl] = rgb2hsl(...hex2rgb(tgt));
  return hsl2rgb(th, ts, Math.min(0.95, Math.max(0.05, tl + (l - 0.5) * 0.55)));
}
const symmetry = k => { if (!k) return null; for (let n = 1; n <= 6; n++) if (rotKinds(k, n) === k) return n; return 6; };

/* ---------- Weltdokument ---------- */
function canon(v) {
  if (Array.isArray(v)) return v.map(canon);
  if (v && typeof v === 'object') { const o = {}; for (const k of Object.keys(v).sort()) if (v[k] !== undefined) o[k] = canon(v[k]); return o; }
  return typeof v === 'number' ? r4(v) : v;
}
export const serialize = doc => JSON.stringify(canon(doc), null, 1);

/* Kosmos: Inseln aus cosmos-route.v1 (Lage, Höhe, Durchfahrt), Zellen hier: Ring r um die Mitte, Wegkacheln hex_road_A entlang der
   Durchfahrt (Kanten {d, d+3} = turns d mod 3), übrige Zellen Wiese mit Stufen aus der Saat. Wegzellen bleiben 0. */
function cosmosDoc(M, neighbor) {
  const isl0 = cosmosIslands(M.W), rec = cosmosRecipe(M.W, isl0, { roadLift: M.lift }), { ends, ...recipe } = rec;
  const rnd = s => { let a = s | 0; return () => { a = (a + 0x6D2B79F5) | 0; let x = Math.imul(a ^ (a >>> 15), 1 | a); x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x; return ((x ^ (x >>> 14)) >>> 0) / 4294967296; }; };
  const islands = isl0.map(I => {
    const R = rnd(I.id.charCodeAt(0) * 131), cells = new Map(), put = (c, r, v) => cells.set(c + ',' + r, { c, r, tile: 'hexagon|hex_grass', turns: 0, ...v });
    const ring = [[0, 0]]; for (let k = 0; k < I.r; k++) { const next = []; for (const [c, r] of ring) for (let d = 0; d < 6; d++) next.push(neighbor(c, r, d)); for (const p of next) if (!ring.some(q => q[0] === p[0] && q[1] === p[1])) ring.push(p); }
    ring.forEach(([c, r]) => put(c, r, {}));
    const road = [[0, 0]]; for (const d of [I.d % 6, (I.d + 3) % 6]) { let p = [0, 0]; for (let k = 0; k < I.r; k++) { p = neighbor(p[0], p[1], d); road.push(p); } }
    const onRoad = new Set(road.map(p => p.join(',')));
    for (const [c, r] of road) put(c, r, { tile: 'hexagon|hex_road_A', turns: I.d % 3 });
    for (const [k, v] of cells) if (!onRoad.has(k)) { const near = [0, 1, 2, 3, 4, 5].some(d => onRoad.has(neighbor(v.c, v.r, d).join(','))); v.h = near ? (R() < 0.35 ? 1 : 0) : (R() < 0.45 ? 2 : 1); if (I.feature === 'tunnel' && near) v.h = 2; }
    const ends = [[road[I.r], I.d % 6], [road[road.length - 1], (I.d + 3) % 6]].map(([p, d]) => [p[0], p[1], d]);
    return { id: I.id, name: I.name, deck: I.deck, origin: [r4(I.c[0]), r4(I.y - M.lift - M.roadTop), r4(I.c[1])], cells: [...cells.values()], roadEnds: ends, feature: I.feature || null };
  });
  const K = islands[0], free = K.cells.filter(c => c.h && c.tile === 'hexagon|hex_grass'), A = islands[1], aFree = A.cells.filter(c => !c.h && c.tile === 'hexagon|hex_grass');
  return { schema: SCHEMA, id: 'HX1-KOSMOS', title: 'Kosmos · Burg und drei Decks',
    units: { unit: 'm', scale: M.S, hexW: M.W, hexH: M.H, rule: 'Wegbreite hex_road_A = Track Core WIDTHS.STANDARD (14,4 m)' },
    islands, route: { core: 'kfb.track-core/0.12', recipe, template: 'KFB World Core R1A · Tor 1 Cosmos Maquette (Layout, Werte gesetzt)' },
    objects: [
      { id: 'o1', key: 'hexagon|building_castle_blue', island: 'K', cell: [free[0].c, free[0].r], p: null, ry: 0, s: 1, snap: 'hex', grund: 'King Kayfabians Burg, Mitte des Kosmos, auf der Stufe neben Start/Ziel' },
      { id: 'o2', key: BAND_KEY, island: 'A', cell: [(aFree[0] || A.cells[0]).c, (aFree[0] || A.cells[0]).r], p: null, ry: 0, s: 1, snap: 'hex', grund: 'Band spielt an der Strecke auf Utopia' }] };
}

export async function boot(canvas, { onNote = () => {}, onState = () => {}, menuEl = null } = {}) {
  const info = { fps: 0, tris: 0, calls: 0, errors: [], ms: {} };
  const t0 = performance.now();
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance', preserveDrawingBuffer: true });
  renderer.setPixelRatio(Math.min(1.5, window.devicePixelRatio || 1));
  renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap; renderer.info.autoReset = false;
  const scene = new THREE.Scene(); scene.background = new THREE.Color('#a8d8b9');
  const camera = new THREE.PerspectiveCamera(36, 16 / 9, 1, 30000);
  const controls = new OrbitControls(camera, canvas); controls.enableDamping = true; controls.dampingFactor = 0.08; controls.maxPolarAngle = Math.PI * 0.49;
  const tc = new TransformControls(camera, canvas); tc.setSize(0.8); scene.add(tc.getHelper ? tc.getHelper() : tc);
  tc.addEventListener('dragging-changed', e => { controls.enabled = !e.value; if (!e.value) endDrag(); });

  const sun = new THREE.DirectionalLight('#fff4e6', 2.9); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.2;
  Object.assign(sun.shadow.camera, { left: -110, right: 110, top: 110, bottom: -110, near: 10, far: 520 });
  const hemi = new THREE.HemisphereLight('#eef4fa', '#9a8a78', 1.05); scene.add(sun, sun.target, hemi);
  const back = new THREE.DirectionalLight('#ffe6d6', 0.6); back.position.set(120, 80, -90); scene.add(back);

  /* ---- K2-Knete wie clay-tools.v1 ---- */
  onNote('Knete wird angerührt …');
  const tex = d => { const t = new THREE.DataTexture(d, 1024, 1024, THREE.RGBAFormat); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.magFilter = THREE.LinearFilter; t.minFilter = THREE.LinearMipmapLinearFilter; t.generateMipmaps = true; t.anisotropy = renderer.capabilities.getMaxAnisotropy(); t.needsUpdate = true; return t; };
  let ts = performance.now();
  const rel = makeClayRelief({ size: 1024, seed: 31 }); const relT = tex(rel.data);
  const tools = await makeToolReliefs({ size: 1024, seed: 41 });
  const U = C.makeClayUniforms(THREE, relT);
  [U.uClayToolA.value, U.uClayToolB.value, U.uClayToolC.value] = tools.maps.map(tex);
  U.uClayToolOn.value = 1; U.uClayLegacyStroke.value = 0; U.uClayMottle.value = 0.04;
  let printT = null; try { printT = await C.makePrintTexture(THREE, here('../ref/clay-joebinns/Fingerprints01_3K.png'), 2048); } catch (e) { info.errors.push('Fingerabdrücke: ' + e.message); }
  U.uClayPrint.value = printT || relT; U.uClayPrintOn.value = printT ? 1 : 0;
  U.uClayHand.value = 0.5 * WK; U.uClayTile.value = 1.6 * WK; U.uClayPrintTile.value = 4.5 * WK; U.uClayMacro.value = 0.5; U.uClayLodK.value = 0.6; U.uClayStroke.value = 0.7;
  info.ms.clay = Math.round(performance.now() - ts);
  const matCache = new Map(), recolour = [], atlas = new Map();
  let W = WORLDS.canyon, worldKey = 'canyon';
  const groupOf = look => look === 'nature' ? 'nature' : look === 'building' || look === 'prop' ? 'house' : 'world';
  const paintAtlas = a => { const cx = a.cv.getContext('2d', { willReadFrequently: true }); cx.clearRect(0, 0, a.cv.width, a.cv.height); cx.drawImage(a.img, 0, 0);
    if (W) { const id = cx.getImageData(0, 0, a.cv.width, a.cv.height), d = id.data, memo = new Map();
      for (let i = 0; i < d.length; i += 4) { const k = (d[i] << 16) | (d[i + 1] << 8) | d[i + 2]; let o = memo.get(k); if (!o) { o = mapRGB(d[i], d[i + 1], d[i + 2], W, a.group); memo.set(k, o); } d[i] = o[0]; d[i + 1] = o[1]; d[i + 2] = o[2]; }
      cx.putImageData(id, 0, 0); }
    a.tex.needsUpdate = true; };
  const worldTex = (map, group) => { const img = map.image; if (!img || !img.width) return map; const key = img; let per = atlas.get(key); if (!per) atlas.set(key, per = {});
    if (!per[group]) { const cv = document.createElement('canvas'); cv.width = img.width; cv.height = img.height; const tex = new THREE.CanvasTexture(cv);
      for (const k of ['flipY', 'colorSpace', 'wrapS', 'wrapT', 'magFilter', 'minFilter', 'channel']) tex[k] = map[k]; per[group] = { img, cv, tex, group }; paintAtlas(per[group]); }
    return per[group].tex; };
  const setColour = m => { const c = m.userData.c0; if (!c) return; const o = mapRGB(...c, W, m.userData.group); m.color.setRGB(o[0] / 255, o[1] / 255, o[2] / 255, THREE.SRGBColorSpace); };
  const clayMat = (src, look, o = {}) => { const k = src.uuid + '|' + look; if (!matCache.has(k)) { const m = C.makeClayMaterial(THREE, U, { src, profile: LOOK[look] }); if (look === 'figure') m.userData.clay.K.value = 0.35;
      if (!o.raw && look !== 'figure' && look !== 'track') { m.userData.group = groupOf(look);
        if (src.map) m.map = worldTex(src.map, m.userData.group);
        else { const c = src.color.clone().convertLinearToSRGB(); m.userData.c0 = [c.r * 255, c.g * 255, c.b * 255]; recolour.push(m); setColour(m); } }
      matCache.set(k, m); } return matCache.get(k); };
  const applyWorld = key => { worldKey = WORLDS[key] ? key : 'kaykit'; W = WORLDS[key] || null; recolour.forEach(setColour); for (const per of atlas.values()) for (const a of Object.values(per)) paintAtlas(a);
    const sky = W ? W.sky : '#a8d8b9'; if (!env) { scene.background = new THREE.Color(sky); scene.fog = new THREE.Fog(sky, 5000, 16000); }
    if (skyDome && !env) { const c = new THREE.Color(sky); skyDome.setPalette([c.clone().multiplyScalar(0.62).toArray(), c.toArray(), c.clone().lerp(new THREE.Color('#fff4e2'), 0.55).toArray()]); } };
  let skyDome = null, env = null, cf = null, cloudMat = null, cloudsBuilt = false, cloudCount = 12, ambL = null;

  /* ---- Katalog ---- */
  onNote('Katalog …');
  const cat = await (await fetch(here('hx0-catalog.v1.json'))).json();
  const byKey = new Map(cat.entries.map(e => [e.key, e]));
  byKey.set(BAND_KEY, { key: BAND_KEY, pack: 'resident', packId: 'resident-atlas-s15', base: 'The KayfaBizarros · Orc Band', role: 'resident',
    path: 'vendor-ra15/data/resident-band-module-01.json', commit: 'S15 Session Cut 2026-09-30 r1 (lokal)', family: 'Resident Atlas S15 · Band' });

  /* ---- Laden + Knetform ---- */
  const loader = new GLTFLoader(), gltfCache = new Map(), softCache = new Map();
  const loadGLTF = e => { if (!gltfCache.has(e.key)) gltfCache.set(e.key, loader.loadAsync(raw(e.commit, e.path))); return gltfCache.get(e.key); };
  /* NAHT (eigene Ergänzung, kein Donor): Knetform je BAUTEIL statt je Netz. KayKit-Hexgebäude sind EIN Netz aus vielen Teilen
     (building_castle_blue: 1 Netz, 178 Teile, gemessen). clay-soften.v1 misst Beulen an der Größe des ganzen Netzes und glättet
     alles gemeinsam → Fahnen (0,014 dick) wanderten vom Mast, Zinnen schmolzen. Regeln aus S15 clay-k1, je Teil angewandt:
     dünn (min/max < 0,12, S15-Schwelle) → Form bleibt · klein (Diagonale < 12 % des Netzes, Setzung) → nur 1 Taubin-Schritt, keine Beule ·
     sonst die Klassen-Vorstufe (K1-Profil). Unterkante je Teil bleibt (S15 keepEdge), Beule wird am Teil gemessen. */
  const PART = { thin: 0.12, small: 0.12 }, partStats = { thin: 0, small: 0, full: 0, parts: 0 };
  function softenParts(geom, opt, keepTop) {
    const P = geom.attributes.position, n = P.count, idx = geom.index ? geom.index.array : null, tc = idx ? idx.length : n, vi = t => idx ? idx[t] : t;
    const q = 1e4, key = i => Math.round(P.getX(i) * q) + ',' + Math.round(P.getY(i) * q) + ',' + Math.round(P.getZ(i) * q);
    const ids = new Map(), par = [], vid = new Int32Array(n), f = x => { while (par[x] !== x) x = par[x] = par[par[x]]; return x; };
    for (let i = 0; i < n; i++) { const k = key(i); let j = ids.get(k); if (j === undefined) { j = par.length; ids.set(k, j); par.push(j); } vid[i] = j; }
    for (let t = 0; t < tc; t += 3) { const a = f(vid[vi(t)]); par[f(vid[vi(t + 1)])] = a; par[f(vid[vi(t + 2)])] = a; }
    const tris = new Map(); for (let t = 0; t < tc; t += 3) { const r = f(vid[vi(t)]); if (!tris.has(r)) tris.set(r, []); tris.get(r).push(t); }
    geom.computeBoundingBox(); const diag = geom.boundingBox.getSize(new THREE.Vector3()).length(), total = tc / 3, names = ['position', 'normal', 'uv'].filter(a => geom.attributes[a]);
    const out = [];
    for (const list of tris.values()) {
      const map = new Map(), ix = [], at = Object.fromEntries(names.map(a => [a, []]));
      for (const t of list) for (let k = 0; k < 3; k++) { const v = vi(t + k); let m = map.get(v); if (m === undefined) { m = map.size; map.set(v, m); for (const a of names) { const A = geom.attributes[a]; for (let c = 0; c < A.itemSize; c++) at[a].push(A.array[v * A.itemSize + c]); } } ix.push(m); }
      let g = new THREE.BufferGeometry(); for (const a of names) g.setAttribute(a, new THREE.Float32BufferAttribute(at[a], geom.attributes[a].itemSize)); g.setIndex(ix);
      g.computeBoundingBox(); const s = g.boundingBox.getSize(new THREE.Vector3()), mn = Math.min(s.x, s.y, s.z), mx = Math.max(s.x, s.y, s.z), d = s.length();
      partStats.parts++;
      if (mx > 0 && mn / mx < PART.thin) partStats.thin++;
      else { const small = d < PART.small * diag, o = small ? { maxLevels: 0, iters: 1, lump: 0 } : { ...opt, maxTris: Math.max(64, Math.round(60000 * list.length / total)) };
        small ? partStats.small++ : partStats.full++;
        try { const r = softenGeometry(THREE, g, o); if (r.geometry && !r.skipped) { const b0 = g.boundingBox, s2 = r.geometry; s2.computeBoundingBox(); const dy = keepTop ? b0.max.y - s2.boundingBox.max.y : b0.min.y - s2.boundingBox.min.y; if (Math.abs(dy) > 1e-6) s2.translate(0, dy, 0); g = s2; } } catch (e) { info.errors.push('Knetform Teil: ' + e.message); } }
      for (const a of Object.keys(g.attributes)) if (!names.includes(a)) g.deleteAttribute(a);
      if (!g.attributes.normal) g.computeVertexNormals(); if (!g.index) g.setIndex([...Array(g.attributes.position.count).keys()]);
      out.push(g);
    }
    const m = out.length === 1 ? out[0] : mergeGeometries(out, false); if (!m) throw new Error('mergeGeometries'); m.computeBoundingBox(); m.computeBoundingSphere(); return m;
  }
  const soft = (geom, kind, keepTop) => {
    const ck = geom.uuid + '|' + kind; if (softCache.has(ck)) return softCache.get(ck);
    let g = geom;
    if (kind === 'house' && HOUSE_FORM === 'aus') { softCache.set(ck, g); return g; }
    if (kind !== 'thin') { try { g = softenParts(geom, Object.assign({ maxLevels: 2 }, K1[kind] || K1.prop), keepTop); } catch (e) { info.errors.push('Knetform: ' + e.message); } }
    if (g !== geom) { geom.computeBoundingBox(); g.computeBoundingBox(); const d = keepTop ? geom.boundingBox.max.y - g.boundingBox.max.y : geom.boundingBox.min.y - g.boundingBox.min.y; if (Math.abs(d) > 1e-6) g.translate(0, d, 0); g.computeBoundingBox(); g.computeBoundingSphere(); }
    softCache.set(ck, g); return g;
  };
  const look = { clay: true, form: true, body: true };
  let sideUV = null, sideY = () => null;   // Lage → UV der Seitenwand von hex_grass (gleiches Prisma im Pack)
  const qk = (x, y, z) => Math.round(x * 1000) + ',' + Math.round(y * 1000) + ',' + Math.round(z * 1000);
  const fixSide = (geom) => { if (!sideUV || !geom.attributes.uv || !geom.attributes.normal) return 0; const P = geom.attributes.position, Nn = geom.attributes.normal, UV = geom.attributes.uv; let n = 0;
    for (let i = 0; i < P.count; i++) { if (Math.abs(Nn.getY(i)) > 0.3) continue; const ak = Math.round(Math.atan2(Nn.getZ(i), Nn.getX(i)) * 10), uv = sideUV.get(qk(P.getX(i), P.getY(i), P.getZ(i)) + '|' + ak) || sideY(ak, P.getY(i)); if (uv) { UV.setXY(i, uv[0], uv[1]); n++; } }
    if (n) UV.needsUpdate = true; return n; };
  let seedN = 1;
  const prepMeshes = (root, role, name) => {
    const kind = kindOf(role, name), lk = role === 'square' ? 'tile' : (LOOK[role] ? role : 'prop');
    root.traverse(o => {
      if (!o.isMesh) return; o.castShadow = o.receiveShadow = true;
      const ms = [].concat(o.material), sd = seedN++;
      const src0 = o.geometry;
      if (role === 'tile' && /^hex_(road|river)/.test(name)) { const gc = src0.clone(); info.sideFix = (info.sideFix || 0) + fixSide(gc); o.geometry = gc; }
      const g0 = C.seedGeometry(THREE, o.geometry.clone(), sd);
      const g1 = o.isSkinnedMesh ? g0 : C.seedGeometry(THREE, soft(o.geometry, kind, role === 'tile' || role === 'square').clone(), sd);
      o.userData.lk = { g0, g1, m0: o.material, m1: Array.isArray(o.material) ? ms.map(m => clayMat(m, lk)) : clayMat(o.material, lk) };
      applyLook(o);
    });
  };
  const applyLook = o => { const L = o.userData.lk; if (!L) return; o.geometry = look.form ? L.g1 : L.g0; o.material = look.clay ? L.m1 : L.m0; };

  /* Wegbreite an hex_road_A (Weg O–W laut TILE_EDGES 'sggsgg'): Draufsicht orthografisch, ungeleuchtet (nur Atlasfarbe),
     Querschnitt entlang z bei x = ±0,45. Klasse je Pixel = näher an der Farbe der Wegmitte oder an der Wiese bei z = 0,8. */
  function measureRoad(src, H) {
    const N = 800, ext = 1.3, rt = new THREE.WebGLRenderTarget(N, N), sc = new THREE.Scene(), r = src.clone(true);
    r.traverse(o => { if (o.isMesh) { const m0 = [].concat(o.material)[0]; o.material = new THREE.MeshBasicMaterial({ map: m0.map || null, color: m0.map ? 0xffffff : m0.color }); } });
    sc.add(r); const cam = new THREE.OrthographicCamera(-ext, ext, ext, -ext, 0.01, 50); cam.position.set(0, 10, 0); cam.up.set(0, 0, -1); cam.lookAt(0, 0, 0);
    renderer.setRenderTarget(rt); renderer.render(sc, cam); const px = new Uint8Array(N * N * 4); renderer.readRenderTargetPixels(rt, 0, 0, N, N, px); renderer.setRenderTarget(null); rt.dispose();
    const at = (x, z) => { const i = Math.min(N - 1, Math.max(0, Math.floor((x + ext) / (2 * ext) * N))), j = Math.min(N - 1, Math.max(0, Math.floor((ext - z) / (2 * ext) * N))), k = (j * N + i) * 4; return [px[k], px[k + 1], px[k + 2]]; };
    const avg = (pts) => pts.map(([x, z]) => at(x, z)).reduce((a, c) => a.map((v, i) => v + c[i] / pts.length), [0, 0, 0]);
    const road = avg([[0.3, 0], [-0.3, 0], [0.6, 0], [-0.6, 0]]), grass = avg([[0.3, 0.8], [-0.3, 0.8], [0.3, -0.8], [-0.3, -0.8]]);
    const d2 = (a, b) => (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2, pz = 2 * ext / N, widths = [];
    for (const x of [0.45, -0.45, 0.7, -0.7]) { let lo = 0, hi = 0;
      for (let z = 0; z < H / 2; z += pz) { if (d2(at(x, z), road) < d2(at(x, z), grass)) hi = z; else break; }
      for (let z = 0; z > -H / 2; z -= pz) { if (d2(at(x, z), road) < d2(at(x, z), grass)) lo = z; else break; }
      widths.push(hi - lo + pz); }
    widths.sort((a, b) => a - b); const w = (widths[1] + widths[2]) / 2;
    return { w: r4(w), spread: r4(widths[3] - widths[0]), px: r4(pz), samples: widths.map(r4), roadRGB: road.map(v => Math.round(v)), grassRGB: grass.map(v => Math.round(v)) };
  }
  /* ---- Maß: an hex_grass gemessen ---- */
  onNote('Kachel messen …');
  const grass = await loadGLTF(byKey.get('hexagon|hex_grass'));
  const gb = new THREE.Box3().setFromObject(grass.scene);
  sideUV = new Map(); grass.scene.traverse(o => { if (!o.isMesh || !o.geometry.attributes.uv) return; const g = o.geometry, P = g.attributes.position, Nn = g.attributes.normal, UV = g.attributes.uv;
    for (let i = 0; i < P.count; i++) if (Math.abs(Nn.getY(i)) <= 0.3) sideUV.set(qk(P.getX(i), P.getY(i), P.getZ(i)) + '|' + Math.round(Math.atan2(Nn.getZ(i), Nn.getX(i)) * 10), [UV.getX(i), UV.getY(i)]); });
  const sideByA = new Map(); for (const [k, uv] of sideUV) { const [p, a] = k.split('|'), y = +p.split(',')[1] / 1000; if (!sideByA.has(a)) sideByA.set(a, []); sideByA.get(a).push([y, uv]); }
  sideY = (a, y) => { const L = sideByA.get(String(a)); if (!L) return null; let b = L[0]; for (const e of L) if (Math.abs(e[0] - y) < Math.abs(b[0] - y)) b = e; return b[1]; };
  const W0 = gb.max.x - gb.min.x, H0 = gb.max.z - gb.min.z, D0 = gb.max.y - gb.min.y;
  const roadScene = (await loadGLTF(byKey.get('hexagon|hex_road_A'))).scene, RW = measureRoad(roadScene, H0);
  RW.grassHue = r4(rgb2hsl(...RW.grassRGB)[0]); RW.roadHue = r4(rgb2hsl(...RW.roadRGB)[0]); HUE_G0 = Math.min(65, (RW.grassHue + RW.roadHue) / 2);
  { roadScene.updateMatrixWorld(true); const rc = new THREE.Raycaster(new THREE.Vector3(0.3, 10, 0), new THREE.Vector3(0, -1, 0)); const h = rc.intersectObject(roadScene, true)[0]; RW.surfaceY = h ? r4(h.point.y) : 0; }
  const S = TC.WIDTHS.STANDARD / RW.w;
  const rb = new THREE.Box3().setFromObject(roadScene);
  const M = { S, W: W0 * S, H: H0 * S, depth: D0 * S, top: gb.max.y * S, road: RW, roadTop: rb.max.y * S, lift: 0.6, measured: { w: r4(W0), h: r4(H0), d: r4(D0), top: r4(gb.max.y) } };
  { const hb = new THREE.Box3().setFromObject((await loadGLTF(byKey.get('hexagon|building_home_A_blue'))).scene); M.houseU = r4(hb.max.y - hb.min.y); M.houseH = M.houseU * S; }
  { const bb = new THREE.Box3().setFromObject((await loadGLTF(byKey.get('hexagon|hex_grass_bottom'))).scene); M.bottomU = r4(bb.max.y - bb.min.y); M.stepU = M.bottomU > 0.2 ? M.bottomU : D0; M.step = M.stepU * S; }
  const LEVELS = 3;   // Georg 30.09.: drei Stufen (0, 1, 2)
  let figK = 0.5;   // Setzung: Figur halb so hoch wie building_home_A (Diorama-Maß), Georg entscheidet
  const hm = hexMetrics([M.W, 0, M.H]);
  const Rc = M.H / 2;
  /* Schwebende Inseln wie R1A Cosmos Maquette (Georg 30.09.), aber nur aus Hex-Kacheln: oben die Kacheln, darunter ein Unterbau
     aus Knete, der dem Hex-Umriss der Insel folgt (Randkanten der Zellmenge), in Stufen einzieht und in eine außermittige
     Spitze mit Nebenzapfen läuft. Form je Insel aus ihrer Saat, wiederholbar. Kein Wasser, kein Tisch: Himmel der Welt. */
  const noise1 = (x, s) => { const i = Math.floor(x), f = x - i, h = n => { const v = Math.sin((n + s * 17.31) * 127.1) * 43758.5453; return v - Math.floor(v); }; const u = f * f * (3 - 2 * f); return h(i) * (1 - u) + h(i + 1) * u; };
  function outlineOf(isl) {
    const has = new Set(isl.cells.map(c => `${c.c},${c.r}`)), key = p => `${Math.round(p.x * 100)},${Math.round(p.z * 100)}`, segs = new Map();
    for (const c of isl.cells) { const w = cellWorld(isl, c.c, c.r);
      for (let d = 0; d < 6; d++) { const [nc, nr] = neighbor(c.c, c.r, d); if (has.has(`${nc},${nr}`)) continue;
        const a0 = (d * 60 - 30) * DEG, a1 = (d * 60 + 30) * DEG, p0 = new THREE.Vector3(w.x + Math.cos(a0) * Rc, 0, w.z + Math.sin(a0) * Rc), p1 = new THREE.Vector3(w.x + Math.cos(a1) * Rc, 0, w.z + Math.sin(a1) * Rc);
        segs.set(key(p0), { p0, p1 }); } }
    if (!segs.size) return [];
    const loop = []; let cur = segs.values().next().value; const start = key(cur.p0);
    for (let n = 0; n < segs.size + 1; n++) { loop.push(cur.p0); const nx = segs.get(key(cur.p1)); if (!nx || key(cur.p1) === start) break; cur = nx; }
    return loop;
  }
  const resample = (loop, N) => { const L = [0]; for (let i = 1; i <= loop.length; i++) L.push(L[i - 1] + loop[i - 1].distanceTo(loop[i % loop.length])); const T = L[L.length - 1], out = [];
    for (let k = 0, j = 0; k < N; k++) { const s = k / N * T; while (L[j + 1] < s) j++; const u = (s - L[j]) / (L[j + 1] - L[j]); out.push(loop[j].clone().lerp(loop[(j + 1) % loop.length], u)); } return out; };
  const bodies = new Map(), shade = (h, k) => '#' + new THREE.Color(h).multiplyScalar(k).getHexString();
  /* Unterbau v2 (Georg 30.09.: »Basis wie zuvor, nur sauber im KFB-Claymation-Stil«). Jede Masse ist ein geschlossener Körper:
     Schichten = ExtrudeGeometry des Hex-Umrisses mit Fase (runde Kanten), nach unten kleiner und zur Spitze versetzt; Spitze =
     gestauchte Kugel; zwei Nebenzapfen = Kugeln. Gebaut in Kacheleinheiten, damit clay-soften.v1 (K1) im KayKit-Maß greift. */
  function buildBody(isl) {
    const sig = isl.cells.map(c => c.c + ',' + c.r).sort().join(';') + '|' + JSON.stringify(isl.body || {}) + worldKey;
    const old = bodies.get(isl.id); if (old && old.sig === sig) return; if (old) world.remove(old.g);
    const loop = outlineOf(isl); if (loop.length < 3) return;
    const B = { bands: 4, depth: 1.05, tip: [0.2, 0.1], seed: isl.id.charCodeAt(0) * 7, ...(isl.body || {}) }, u = 1 / S;
    const c = loop.reduce((s, p) => s.add(p), new THREE.Vector3()).multiplyScalar(1 / loop.length);
    const Rm = loop.reduce((s, p) => s + Math.hypot(p.x - c.x, p.z - c.z), 0) / loop.length * u, D = Rm * B.depth;
    const ring = resample(loop, 60).map(p => new THREE.Vector2((p.x - c.x) * u, (p.z - c.z) * u));
    const yTop = isl.origin[1] + M.top - M.depth + 0.25 * S * 0.1;   // 2,5 % der Kachel in die Kacheln hinein: keine Fuge
    const earth = W ? W.trunk : '#8b5a3c', lip = W ? W.hill[1] : '#7a9a3a';
    const cols = [lip, earth, shade(earth, 0.84), shade(earth, 0.7), shade(earth, 0.6)];
    const g = new THREE.Group(), sd = B.seed, info = { tris: 0 };
    const add = (geo, col, soft = true) => { let gg = geo; if (soft) { try { const r = softenGeometry(THREE, geo, { maxEdge: 0.28, maxLevels: 2, iters: 3, lump: 0.016, maxTris: 16000, seed: sd }); if (r.geometry) gg = r.geometry; } catch (e) {} }
      gg.computeVertexNormals(); C.seedGeometry(THREE, gg, 300 + sd + g.children.length);
      const m = new THREE.Mesh(gg, clayMat(new THREE.MeshStandardMaterial({ color: col }), 'earth', { raw: true })); m.material.color.set(col);
      m.scale.setScalar(S); m.position.set(c.x, yTop, c.z); m.castShadow = m.receiveShadow = true; g.add(m); info.tris += (gg.index ? gg.index.count : gg.attributes.position.count) / 3; };
    const tip = new THREE.Vector2(B.tip[0] * Rm, B.tip[1] * Rm);
    let y = 0;
    for (let k = 0; k <= B.bands; k++) {
      const t0 = k / (B.bands + 1), s = k === 0 ? 0.985 : Math.pow(1 - t0, 0.7) * 0.97, h = k === 0 ? 0.14 : D * (0.16 + 0.05 * noise1(k * 2.3, sd)), bev = Math.min(0.16, h * 0.35);
      const off = tip.clone().multiplyScalar(Math.pow(t0, 1.3));
      const pts = ring.map((p, i) => { const a = i / ring.length * 6.2832, w = 1 + (k ? 0.06 : 0.01) * (noise1(a * 3 + k * 1.7, sd) - 0.5) + (k ? 0.03 : 0) * (noise1(a * 9 + k, sd + 4) - 0.5); return p.clone().multiplyScalar(s * w).add(off); });
      const geo = new THREE.ExtrudeGeometry(new THREE.Shape(pts), { depth: Math.max(0.02, h - 2 * bev), bevelEnabled: true, bevelThickness: bev, bevelSize: bev * 0.9, bevelSegments: 4, curveSegments: 1 });
      geo.rotateX(Math.PI / 2); geo.translate(0, -y - bev, 0); add(geo, cols[Math.min(k, cols.length - 1)]);
      y += h * (k ? 0.82 : 0.9);
    }
    { const s = Math.pow(1 - B.bands / (B.bands + 1), 0.7), r = Rm * s * 0.78, geo = new THREE.SphereGeometry(r, 36, 24); geo.scale(1, 1.25, 1);
      const off = tip.clone(); geo.translate(off.x, -y - r * 0.55, off.y); add(geo, cols[cols.length - 1]); }
    for (let z = 0; z < 2; z++) { const a = (noise1(z * 3.1, sd) + z * 0.5) * 6.2832, rr = Rm * (0.42 + 0.1 * noise1(z * 5, sd + 1)), r = Rm * (0.14 + 0.05 * noise1(z * 7, sd + 2));
      const geo = new THREE.SphereGeometry(r, 28, 18); geo.scale(1, 1.5, 1); geo.translate(Math.cos(a) * rr, -D * (0.42 + 0.12 * z), Math.sin(a) * rr); add(geo, cols[2 + z]); }
    world.add(g); bodies.set(isl.id, { sig, g, info: { rim: r4(Rm * S), depth: r4(D * S), tris: info.tris } });
  }
  /* Wolken: Kugel-in-Kugel (Georg: behalten), Knete Klasse Wolke */
  const clouds = new THREE.Group(); scene.add(clouds);
  function buildClouds() {   // v5: Clay-Wolkenfamilie aus dem Jarlan-Donor (lab-sky/cloud-family.v1), kein Kugel-Haufen mehr
    cloudsBuilt = true; if (!cf) return;
    const b = new THREE.Box3(); for (const isl of doc.islands) b.expandByPoint(new THREE.Vector3(...isl.origin));
    const c = b.getCenter(new THREE.Vector3()), span = b.getSize(new THREE.Vector3()).length() + 4 * M.W;
    cf.set(CF.scatterClouds({ n: cloudCount, center: [c.x, c.y, c.z], radius: span * 0.72, rMin: 0.62, yRange: [-2.5 * M.W, 3.5 * M.W], scale: [M.W * 2.2, M.W * 4.5], seed: 5, spacing: 0.55 }));
  }

  /* ---- Szene-Zustand ---- */
  let doc = null, stateCache = null;
  const tiles = new Map(), objs = new Map(), groundMeshes = [], pickables = [];
  const world = new THREE.Group(); scene.add(world);
  let bridge = null, bridgeSig = '', bridgeInfo = null, routeStream = null;
  const island = id => doc.islands.find(i => i.id === id);
  const cellWorld = (isl, c, r) => { const p = hexToWorld(c, r, hm); return new THREE.Vector3(isl.origin[0] + p[0], isl.origin[1] + M.top, isl.origin[2] + p[2]); };

  const reg = (root, hx) => { root.userData.hx = hx; root.traverse(o => { if (o.isMesh) { o.userData.hxRoot = root; pickables.push(o); if (hx.type === 'tile') groundMeshes.push(o); } }); };
  const unreg = root => { root.traverse(o => { if (!o.isMesh) return; let i = pickables.indexOf(o); if (i >= 0) pickables.splice(i, 1); i = groundMeshes.indexOf(o); if (i >= 0) groundMeshes.splice(i, 1); }); };

  /* Stufe h: die Kachel steht h × Stufenmaß höher, darunter h Säulenstücke hex_grass_bottom (so baut der Hersteller Terrassen) */
  async function makeTile(isl, cell) {
    const e = byKey.get(cell.tile); if (!e) throw new Error('Kachel fehlt im Katalog: ' + cell.tile);
    const g = await loadGLTF(e), root = new THREE.Group(), top = g.scene.clone(true); prepMeshes(top, e.role, e.base);
    const h = Math.max(0, Math.min(LEVELS - 1, cell.h || 0)); top.position.y = h * M.stepU; root.add(top);
    if (h) { const bt = byKey.get('hexagon|hex_grass_bottom'), bg = await loadGLTF(bt);
      for (let k = 0; k < h; k++) { const b = bg.scene.clone(true); prepMeshes(b, 'tile', bt.base); b.position.y = k * M.stepU; root.add(b); } }
    const p = cellWorld(isl, cell.c, cell.r); root.position.set(p.x, isl.origin[1], p.z); root.rotation.y = rotDeg(cell.turns) * DEG; root.scale.setScalar(S);
    world.add(root); reg(root, { type: 'tile', island: isl.id, c: cell.c, r: cell.r }); return root;
  }
  let bandDef = null, bandScale = null;
  async function makeObj(o) {
    const e = byKey.get(o.key); if (!e) throw new Error('Objekt fehlt im Katalog: ' + o.key);
    let root, band = null;
    if (o.key === BAND_KEY) {
      bandDef = bandDef || await (await fetch(here('../' + e.path))).json();
      band = await mountBandModule(bandDef, { onProgress: (n, N, l) => onNote(`Band ${n}/${N} · ${l}`) });
      root = new THREE.Group(); root.add(band.root);
      band.root.traverse(m => { if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; m.frustumCulled = false; } });
      prepMeshes(band.root, 'figure', 'band');
      if (!bandScale) { band.update(0); band.root.updateMatrixWorld(true); const gb2 = new THREE.Box3().setFromObject(band.perf.guitarist.actor, true);
        info.bandGuitarH = r4(gb2.max.y - gb2.min.y); bandScale = figK * M.houseH / info.bandGuitarH; }
      band.place({ position: [0, 0, 0], rotationYDeg: 0, scale: bandScale });
    } else {
      const g = await loadGLTF(e); root = g.scene.clone(true); prepMeshes(root, e.role, e.base);
    }
    root.userData.band = band; world.add(root); reg(root, { type: 'obj', id: o.id }); placeObj(root, o); return root;
  }
  const placeObj = (root, o) => { if (!o.p && o.cell) { const w = cellWorld(island(o.island), o.cell[0], o.cell[1]); o.p = [r4(w.x), 0, r4(w.z)]; o.floor = true; } root.position.fromArray(o.p); root.rotation.set(0, (o.ry || 0) * DEG, 0); root.scale.setScalar(o.key === BAND_KEY ? (o.s || 1) : S * (o.s || 1)); root.updateMatrixWorld(true); };

  let syncing = Promise.resolve();
  const sync = () => (syncing = syncing.then(syncNow).catch(e => { info.errors.push(e.message); console.error(e); }));
  async function syncNow() {
    const want = new Map();
    for (const isl of doc.islands) for (const c of isl.cells) want.set(`${isl.id}:${c.c},${c.r}`, { isl, c });
    for (const [k, t] of tiles) { const w = want.get(k); if (!w || w.c.tile !== t.tile || (w.c.h || 0) !== t.h) { unreg(t.root); world.remove(t.root); tiles.delete(k); if (sel && sel.root === t.root) select(null); } }
    for (const [k, { isl, c }] of want) {
      const t = tiles.get(k);
      if (t) { t.root.rotation.y = rotDeg(c.turns) * DEG; t.turns = c.turns; }
      else { onNote('Kachel ' + c.tile.split('|')[1]); const root = await makeTile(isl, c); tiles.set(k, { root, tile: c.tile, turns: c.turns, h: c.h || 0 }); }
    }
    const ids = new Set(doc.objects.map(o => o.id));
    for (const [id, x] of objs) { const o = doc.objects.find(q => q.id === id); if (!ids.has(id) || o.key !== x.key) { unreg(x.root); world.remove(x.root); x.root.userData.band?.dispose(); objs.delete(id); if (sel && sel.root === x.root) select(null); } }
    for (const o of doc.objects) { const x = objs.get(o.id); if (x) placeObj(x.root, o); else { onNote('Objekt ' + (byKey.get(o.key)?.base || o.key)); objs.set(o.id, { root: await makeObj(o), key: o.key }); } }
    if (look.body) for (const isl of doc.islands) buildBody(isl);
    for (const [id, bd] of bodies) if (!look.body || !island(id)) { world.remove(bd.g); bodies.delete(id); }
    if (!cloudsBuilt) buildClouds();
    buildBridges();
    world.updateMatrixWorld(true);
    for (const o of doc.objects) if (o.floor) { const x = objs.get(o.id); if (x) { floorOf(x.root); o.p = x.root.position.toArray().map(r4); delete o.floor; } }
    { const b = new THREE.Box3().setFromObject(world), c = b.getCenter(new THREE.Vector3()), r = b.getSize(new THREE.Vector3()).length() / 2 + 10;
      Object.assign(sun.shadow.camera, { left: -r, right: r, top: r, bottom: -r, near: 1, far: r * 4 }); sun.shadow.camera.updateProjectionMatrix();
      sun.target.position.copy(c); sun.position.copy(c).add(new THREE.Vector3(-0.45, 0.75, 0.55).multiplyScalar(r * 1.6)); }
    gates(); emit();
  }

  /* ---- Brücke: Rezept aus den Sockeln, kompiliert und geprüft vom Track Core ---- */
  /* Look-Schicht (nur Farbe, Kontaktgeometrie unverändert). Brücke: Fahrbahn roadStreet, alles andere EIN Strang (T3 »Ein Guss«).
     Insel: Dirt = gemessene Wegfarbe der Hex-Straße, durch dieselbe Weltzuordnung. Gewicht = 1 − Bandenhöhe. */
  function paintWorld(st) {
    const n = c => c.map(v => v / 255), dirtRGB = mapRGB(...M.road.roadRGB, W, 'world', 'sand');
    const road = n(dirtRGB), dark = road.map(v => v * 0.8), under = road.map(v => v * 0.62);
    const sR = W && n(hex2rgb(W.roadStreet)), sS = W && n(hex2rgb(W.strang)), sD = W && sS.map(v => v * 0.82);
    for (const q of st.samples) {
      if (!q.paint) continue;
      if (W) q.paint = { ...q.paint, road: sR, shoulder: sS, barrier_side: sS, barrier_cap: sS, underside: sD };
      const w = 1 - Math.max(q.prm.barrierVisL ?? 1, q.prm.barrierVisR ?? 1); if (w <= 0) continue;
      const mix = (a, b) => a.map((v, i) => v + (b[i] - v) * w);
      q.paint = { ...q.paint, road: mix(q.paint.road, road), shoulder: mix(q.paint.shoulder, dark), barrier_side: mix(q.paint.barrier_side, dark), barrier_cap: mix(q.paint.barrier_cap, dark), underside: mix(q.paint.underside, under) };
    }
  }
  /* Strang-Sprache aus T3: Wulst über jeder Bande (runde Kante statt Kasten). Stützen entfallen: die Inseln schweben, es gibt keinen Boden.
     Nur Präsentation; Lage aus den Stream-Slots (TC.profileSlots), nichts neu gelöst. */
  const strangSrc = new THREE.MeshStandardMaterial({ color: '#ef5a22' });
  function buildStrang(st) {
    const g = new THREE.Group(), mat = clayMat(strangSrc, 'track', { raw: true }); mat.color.set(W ? W.strang : '#b86b4a');
    const S0 = st.samples, V = a => new THREE.Vector3(a[0], a[1], a[2]), rT = TC.PROFILE_DEFAULTS.barrierT * 0.62;
    const add = geo => { C.seedGeometry(THREE, geo, 700 + g.children.length); const m = new THREE.Mesh(geo, mat); m.castShadow = m.receiveShadow = true; g.add(m); };
    for (const side of [0, 1]) { const runs = []; let cur = null;
      S0.forEach((q, i) => { if (i % 6 && i !== S0.length - 1) return; const vis = side ? q.prm.barrierVisR : q.prm.barrierVisL;
        if (vis > 0.35 && q.R && q.U) { const sl = TC.profileSlots(q.prm), a = sl[side ? 10 : 3], b = sl[side ? 11 : 2], x = (a[0] + b[0]) / 2, y = Math.max(a[1], b[1]);
          (cur = cur || []).push(V(q.p).addScaledVector(V(q.R), x).addScaledVector(V(q.U), y + rT * 0.25)); } else if (cur) { runs.push(cur); cur = null; } });
      if (cur) runs.push(cur);
      for (const pts of runs) if (pts.length > 3) { add(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), Math.ceil(pts.length * 1.5), rT, 12, false));
        for (const e of [pts[0], pts[pts.length - 1]]) add(new THREE.SphereGeometry(rT, 18, 12).translate(e.x, e.y, e.z)); } }
    return g;
  }
  function buildBridges() {
    const recs = doc.route ? [doc.route.recipe] : [], sig = JSON.stringify(recs) + worldKey;
    if (sig === bridgeSig) return; bridgeSig = sig;
    if (bridge) { unreg(bridge); world.remove(bridge); }
    bridge = new THREE.Group(); bridgeInfo = [];
    for (const R of recs) {
      const t = performance.now(); let st, ch;
      try { st = TC.compileRecipe(R); ch = TC.runChecks(st); } catch (e) { bridgeInfo.push({ id: R.id, error: e.message }); continue; }
      paintWorld(st);
      /* Auf der Insel fährt man auf den ORIGINAL-KayKit-Wegkacheln (Georg 30.09.). Die Route läuft trotzdem über die Insel
         (Fahrfläche, Checks, Fingerprint vom Core); gezeichnet wird nur der Brückenteil ab Inselkante. */
      routeStream = st;
      const shown = st;   // Georg 30.09.: durchgehend ein Design, auch auf der Insel (liegt auf den Wegkacheln)
      const g = buildTrack(THREE, shown, clayMat(new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.9 }), 'track'), { contact: true });
      const tunMat = clayMat(new THREE.MeshStandardMaterial({ color: W ? W.rock : '#d8c6b0' }), 'earth', { raw: true }); tunMat.color.set(W ? W.rock : '#d8c6b0'); tunMat.side = THREE.DoubleSide;
      g.traverse(o => { if (o.isMesh) { o.castShadow = o.receiveShadow = true; C.seedGeometry(THREE, o.geometry, 900); o.geometry.computeBoundingBox(); if (o.material !== g.children[0]?.material && !o.geometry.attributes.color) o.material = tunMat; } });
      bridge.add(g); bridge.add(buildStrang(shown));
      const S0 = st.samples, L = S0[S0.length - 1].s;
      bridgeInfo.push({ id: R.id, core: TC.CORE_VERSION, fingerprint: st.fingerprint, samples: S0.length, length: r4(L), pass: ch.pass,
        fails: ch.results.filter(r => !r.pass).map(r => ({ id: r.id, severity: r.severity, value: r.value })), peak: r4(Math.max(...S0.map(q => q.p[1]))), ms: Math.round(performance.now() - t), recipe: R });
    }
    world.add(bridge); bridge.traverse(o => { if (o.isMesh) { groundMeshes.push(o); o.userData.hxRoot = bridge; pickables.push(o); } }); bridge.userData.hx = { type: 'track' };
  }

  /* ---- Gates ---- */
  const ray = new THREE.Raycaster(), down = new THREE.Vector3(0, -1, 0);
  const surfaceAt = (x, z, skip) => { ray.set(new THREE.Vector3(x, 3000, z), down); ray.far = 6000; const h = ray.intersectObjects(groundMeshes, false).find(i => !skip || i.object.userData.hxRoot !== skip); return h ? h.point.y : null; };
  const objBox = root => new THREE.Box3().setFromObject(root, !root.userData.band);
  let G = null;
  function gates() {
    const t = performance.now();
    const edges = { bad: [], unknown: 0, open: 0, checked: 0 };
    for (const isl of doc.islands) {
      const at = new Map(isl.cells.map(c => [`${c.c},${c.r}`, c]));
      for (const c of isl.cells) {
        const k = edgeKinds(c.tile.split('|')[1], c.turns); if (!k) { edges.unknown++; continue; }
        for (let d = 0; d < 6; d++) {
          const [nc, nr] = neighbor(c.c, c.r, d), n = at.get(`${nc},${nr}`);
          if (!n) { if (k[d] === 's' && !(isl.roadEnds || []).some(e => e[0] === c.c && e[1] === c.r && e[2] === d)) edges.bad.push({ island: isl.id, c: c.c, r: c.r, d, why: 'Straße endet am Inselrand ohne Sockel' }); continue; }
          if (d > 2) continue; const nk = edgeKinds(n.tile.split('|')[1], n.turns); if (!nk) continue;
          edges.checked++;
          if ((n.h || 0) !== (c.h || 0)) { if (k[d] !== 'g' || nk[(d + 3) % 6] !== 'g') edges.bad.push({ island: isl.id, c: c.c, r: c.r, d, why: `Stufe ${c.h || 0}→${n.h || 0} an ${k[d]}/${nk[(d + 3) % 6]}-Kante (Weg oder Wasser über Stufe)` }); continue; }
          if (k[d] !== nk[(d + 3) % 6]) edges.bad.push({ island: isl.id, c: c.c, r: c.r, d, why: `${k[d]} trifft ${nk[(d + 3) % 6]}` });
        }
      }
    }
    const ground = [], hits = [];
    const list = [...objs.entries()].map(([id, x]) => ({ id, root: x.root, band: !!x.root.userData.band, box: objBox(x.root) }));
    for (const o of list) {
      const c = o.box.getCenter(new THREE.Vector3()), y = surfaceAt(c.x, c.z);
      const foot = o.band ? o.root.position.y : o.box.min.y;
      const d = y == null ? null : foot - y;
      ground.push({ id: o.id, d: d == null ? null : r4(d), state: d == null ? 'ohne Fläche' : d > 0.05 ? 'schwebt' : d < -0.05 ? 'steckt' : 'ok' });
    }
    for (let i = 0; i < list.length; i++) for (let j = i + 1; j < list.length; j++) {
      const a = list[i].box.clone().expandByScalar(-0.05), b = list[j].box.clone().expandByScalar(-0.05);
      if (a.intersectsBox(b)) { const I = a.clone().intersect(b).getSize(new THREE.Vector3()); hits.push({ a: list[i].id, b: list[j].id, overlap: [r4(I.x), r4(I.y), r4(I.z)] }); }
    }
    G = { edges, ground, hits, ms: Math.round(performance.now() - t) };
    drawEdgeMarks();
    return G;
  }
  const edgeMarks = new THREE.Group(); scene.add(edgeMarks);
  function drawEdgeMarks() {
    edgeMarks.clear();
    for (const b of G.edges.bad) {
      const isl = island(b.island), c = cellWorld(isl, b.c, b.r).add(new THREE.Vector3(0, (isl.cells.find(q => q.c === b.c && q.r === b.r)?.h || 0) * M.step, 0)), a0 = (b.d * 60 - 30) * DEG, a1 = (b.d * 60 + 30) * DEG;
      const p0 = new THREE.Vector3(c.x + Math.cos(a0) * Rc, c.y + 0.4, c.z + Math.sin(a0) * Rc), p1 = new THREE.Vector3(c.x + Math.cos(a1) * Rc, c.y + 0.4, c.z + Math.sin(a1) * Rc);
      const m = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, p0.distanceTo(p1), 8), new THREE.MeshBasicMaterial({ color: '#a33d3d' }));
      m.position.copy(p0).lerp(p1, 0.5); m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), p1.clone().sub(p0).normalize()); edgeMarks.add(m);
    }
  }

  /* ---- Auswahl, Menü, Undo ---- */
  let sel = null; // { type, root, id?, key? }
  const undo = [], redo = [];
  const snapshot = () => JSON.stringify(doc);
  const commit = (before) => { undo.push(before); if (undo.length > 120) undo.shift(); redo.length = 0; sync(); };
  const change = fn => { const b = snapshot(); fn(); commit(b); };
  const opts = { snap: 'hex', grid: false, space: 'world', mode: 'translate' };
  function select(hit) {
    sel = hit; tc.detach();
    if (sel && sel.type === 'obj') { tc.attach(sel.root); tc.setMode(opts.mode); tc.setSpace(opts.space === 'world' ? 'world' : 'local'); }
    if (menuEl) menuEl.hidden = !sel;
    emit();
  }
  const selDoc = () => sel?.type === 'obj' ? doc.objects.find(o => o.id === sel.id) : sel?.type === 'tile' ? island(sel.island).cells.find(c => c.c === sel.c && c.r === sel.r) : null;
  const snapPos = (v, root) => {
    if (opts.snap === 'hex') {
      let best = null; for (const isl of doc.islands) { const [c, r] = worldToHex(v.x - isl.origin[0], v.z - isl.origin[2], hm), p = cellWorld(isl, c, r), d = p.distanceToSquared(new THREE.Vector3(v.x, p.y, v.z)); if (!best || d < best.d) best = { d, p }; }
      if (best) { v.x = best.p.x; v.z = best.p.z; }
    } else if (opts.snap === 'grid') { v.x = Math.round(v.x); v.z = Math.round(v.z); }
    return v;
  };
  const floorOf = (root, o) => { root.updateMatrixWorld(true); const b = objBox(root), c = b.getCenter(new THREE.Vector3()), y = surfaceAt(c.x, c.z); if (y == null) return; root.position.y += y - (root.userData.band ? root.position.y : b.min.y); };
  function endDrag() {
    if (!sel || sel.type !== 'obj') return; const o = selDoc(), r = sel.root;
    if (opts.mode === 'translate') { snapPos(r.position, r); floorOf(r, o); }
    if (opts.mode === 'rotate') { r.rotation.set(0, Math.round(r.rotation.y / DEG / 15) * 15 * DEG, 0); }
    const base = o.key === BAND_KEY ? 1 : S;
    change(() => { o.p = r.position.toArray().map(r4); o.ry = r4(r.rotation.y / DEG); o.s = r4(r.scale.x / base); o.snap = opts.snap; });
  }
  tc.addEventListener('objectChange', () => { if (!sel?.root) return; if (opts.mode === 'rotate') sel.root.rotation.set(0, sel.root.rotation.y, 0); if (opts.mode === 'scale') { const s = sel.root.scale.x; sel.root.scale.setScalar(s); } });

  let nextId = 1; const newId = () => { while (doc.objects.some(o => o.id === 'o' + nextId)) nextId++; return 'o' + nextId++; };
  const menu = act => {
    if (act === 'close') return select(null);
    if (act === 'undo') return doUndo(); if (act === 'redo') return doRedo();
    if (['translate', 'rotate', 'scale'].includes(act)) { opts.mode = act; tc.setMode(act); return emit(); }
    if (act === 'space') { opts.space = opts.space === 'world' ? 'local' : 'world'; tc.setSpace(opts.space); return emit(); }
    if (act === 'grid') { opts.grid = !opts.grid; gridHelper.visible = opts.grid; return emit(); }
    if (['snap-hex', 'snap-grid', 'snap-free'].includes(act)) { opts.snap = act.slice(5); return emit(); }
    if (act === 'focus') return focus();
    if (!sel) return;
    if (sel.type === 'tile') {
      if (act === 'rot60' || act === 'rot-60') change(() => { const c = selDoc(); c.turns = (c.turns + (act === 'rot60' ? 1 : 5)) % 6; });
      if (act === 'up' || act === 'down') change(() => { const c = selDoc(); c.h = Math.max(0, Math.min(LEVELS - 1, (c.h || 0) + (act === 'up' ? 1 : -1))); });
      if (act === 'delete') change(() => { const isl = island(sel.island); isl.cells = isl.cells.filter(c => !(c.c === sel.c && c.r === sel.r)); });
      return;
    }
    const o = selDoc();
    if (act === 'floor') { floorOf(sel.root, o); change(() => { o.p = sel.root.position.toArray().map(r4); }); }
    if (act === 'rot60' || act === 'rot-60') change(() => { o.ry = r4(((o.ry || 0) + (act === 'rot60' ? 60 : -60) + 540) % 360 - 180); });
    if (act === 'dup') change(() => { const n = { ...JSON.parse(JSON.stringify(o)), id: newId() }; n.p = [n.p[0] + 3, n.p[1], n.p[2] + 3]; doc.objects.push(n); });
    if (act === 'delete') { const id = o.id; select(null); change(() => { doc.objects = doc.objects.filter(q => q.id !== id); }); }
  };
  function doUndo() { if (!undo.length) return; redo.push(snapshot()); doc = JSON.parse(undo.pop()); sync(); }
  function doRedo() { if (!redo.length) return; undo.push(snapshot()); doc = JSON.parse(redo.pop()); sync(); }
  function focus() { const b = sel ? new THREE.Box3().setFromObject(sel.root) : new THREE.Box3().setFromObject(world); const c = b.getCenter(new THREE.Vector3()), r = Math.max(8, b.getSize(new THREE.Vector3()).length() * 0.9);
    const d = camera.position.clone().sub(controls.target).normalize(); controls.target.copy(c); camera.position.copy(c).addScaledVector(d, r * 1.6); }

  /* ---- Platzieren aus der Suche ---- */
  let placing = null; // { key, entry, ghost }
  async function startPlace(key) {
    cancelPlace(); const e = byKey.get(key); if (!e) return;
    if (sel && sel.type === 'tile' && (e.role === 'tile' || e.role === 'square')) { change(() => { selDoc().tile = key; }); return; }
    placing = { key, entry: e, ghost: null }; emit();
    try { if (key === BAND_KEY) { placing.ghost = hexMarker(); } else { const g = await loadGLTF(e); const root = g.scene.clone(true); prepMeshes(root, e.role, e.base); root.scale.setScalar(S); placing.ghost = root; }
      if (placing && placing.key === key) scene.add(placing.ghost); } catch (err) { info.errors.push(err.message); cancelPlace(); }
  }
  const hexMarker = () => { const m = new THREE.Mesh(new THREE.CylinderGeometry(Rc * 0.96, Rc * 0.96, 0.6, 6), new THREE.MeshBasicMaterial({ color: '#1f2022', transparent: true, opacity: 0.18 })); m.rotation.y = Math.PI / 6; return m; };
  function cancelPlace() { if (placing?.ghost) scene.remove(placing.ghost); placing = null; emit(); }
  const ndc = new THREE.Vector2();
  const hitAt = (ev, list) => { const r = canvas.getBoundingClientRect(); ndc.set(((ev.clientX - r.left) / r.width) * 2 - 1, -((ev.clientY - r.top) / r.height) * 2 + 1); ray.setFromCamera(ndc, camera); ray.far = 3000; return ray.intersectObjects(list, false)[0] || null; };
  const planeHit = ev => { const r = canvas.getBoundingClientRect(); ndc.set(((ev.clientX - r.left) / r.width) * 2 - 1, -((ev.clientY - r.top) / r.height) * 2 + 1); ray.setFromCamera(ndc, camera); const p = new THREE.Vector3(); return ray.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0, 1, 0), -M.top), p) ? p : null; };
  function tileTarget(p) { let best = null; for (const isl of doc.islands) { const [c, r] = worldToHex(p.x - isl.origin[0], p.z - isl.origin[2], hm), w = cellWorld(isl, c, r); const d = w.distanceTo(new THREE.Vector3(p.x, w.y, p.z)) + Math.hypot(p.x - isl.origin[0], p.z - isl.origin[2]) * 0.01;
      const near = isl.cells.some(q => Math.abs(q.c - c) <= 2 && Math.abs(q.r - r) <= 2); if (near && (!best || d < best.d)) best = { d, isl, c, r, w }; } return best; }
  function movePlace(ev) {
    if (!placing?.ghost) return;
    const tileMode = placing.entry.role === 'tile' || placing.entry.role === 'square';
    const h = tileMode ? null : hitAt(ev, groundMeshes), p = h ? h.point : planeHit(ev); if (!p) return;
    if (tileMode) { const t = tileTarget(p); if (!t) return; placing.ghost.position.set(t.w.x, M.top - 0.01 + (placing.ghost.isMesh ? 0 : 0), t.w.z); placing.target = t; }
    else { const v = snapPos(p.clone()); v.y = surfaceAt(v.x, v.z) ?? p.y; placing.ghost.position.copy(v); if (placing.ghost.isMesh) placing.ghost.position.y += 0.3; placing.target = v; }
  }
  function dropPlace() {
    const P = placing; if (!P?.target) return;
    if (P.entry.role === 'tile' || P.entry.role === 'square') {
      const t = P.target; change(() => { const isl = island(t.isl.id), ex = isl.cells.find(q => q.c === t.c && q.r === t.r); if (ex) ex.tile = P.key; else isl.cells.push({ c: t.c, r: t.r, tile: P.key, turns: 0 }); });
      return; // bleibt im Platzieren: mehrere Kacheln hintereinander, Esc beendet
    }
    const v = P.target.clone(), id = newId(), isl = tileTarget(v);
    change(() => { doc.objects.push({ id, key: P.key, island: isl ? isl.isl.id : null, p: [r4(v.x), r4(v.y), r4(v.z)], ry: 0, s: 1, snap: opts.snap, grund: '' }); });
    cancelPlace();
    syncing.then(() => { const x = objs.get(id); if (x) { floorOf(x.root); const o = doc.objects.find(q => q.id === id); o.p = x.root.position.toArray().map(r4); placeObj(x.root, o); gates(); select({ type: 'obj', id, root: x.root, key: o.key }); } });
  }

  /* ---- Zeiger ---- */
  let down0 = null;
  canvas.addEventListener('pointermove', ev => movePlace(ev));
  canvas.addEventListener('pointerdown', ev => { down0 = { x: ev.clientX, y: ev.clientY, axis: tc.axis }; });
  canvas.addEventListener('pointerup', ev => {
    if (!down0) return; const moved = Math.hypot(ev.clientX - down0.x, ev.clientY - down0.y) > 4, axis = down0.axis; down0 = null;
    if (moved || axis || ev.button !== 0) return;
    if (placing) return dropPlace();
    const h = hitAt(ev, pickables); if (!h) return select(null);
    const root = h.object.userData.hxRoot, hx = root?.userData.hx; if (!hx) return select(null);
    if (hx.type === 'obj') select({ type: 'obj', id: hx.id, root, key: doc.objects.find(o => o.id === hx.id)?.key });
    else if (hx.type === 'tile') select({ type: 'tile', island: hx.island, c: hx.c, r: hx.r, root });
    else select({ type: 'track', root });
  });
  const onKey = ev => {
    if (/INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName || '')) return;
    const k = ev.key.toLowerCase();
    if (k === 'escape') { if (placing) cancelPlace(); else select(null); }
    else if ((ev.ctrlKey || ev.metaKey) && k === 'z') { ev.preventDefault(); ev.shiftKey ? doRedo() : doUndo(); }
    else if (k === 'g') menu('translate'); else if (k === 'r') menu(sel?.type === 'tile' ? 'rot60' : 'rotate'); else if (k === 's' && !ev.ctrlKey) menu('scale');
    else if (k === '+' || k === 'pageup') menu('up'); else if (k === '-' || k === 'pagedown') menu('down');
    else if (k === 'f') menu('focus'); else if (k === 'delete' || k === 'backspace') menu('delete');
  };
  window.addEventListener('keydown', onKey);

  /* ---- Raster, Kamera ---- */
  const gridHelper = new THREE.GridHelper(1600, 160, '#5c6065', '#8a8f95'); gridHelper.position.y = M.top + 0.03; gridHelper.material.transparent = true; gridHelper.material.opacity = 0.12; gridHelper.visible = false; scene.add(gridHelper);
  const isleC = id => { const i = island(id); return i ? new THREE.Vector3(...i.origin) : new THREE.Vector3(); };
  const at = id => { const J = routeStream?.joints || [], j = J.find(x => x.piece === id), q = j && routeStream.samples[j.index]; return q ? new THREE.Vector3(...q.p) : new THREE.Vector3(); };
  const isleShot = id => () => { const i = isleC(id), W2 = M.W; return [[i.x + W2 * 2.6, i.y + W2 * 2.4, i.z + W2 * 3.2], [i.x, i.y + M.top, i.z]]; };
  const shots = {
    uebersicht: () => { const b = new THREE.Box3(); doc.islands.forEach(i => b.expandByPoint(new THREE.Vector3(...i.origin))); const c = b.getCenter(new THREE.Vector3()), d = b.getSize(new THREE.Vector3()).length() + 6 * M.W;
      return [[c.x + d * 0.15, c.y + d * 0.62, c.z + d * 0.9], [c.x, c.y, c.z]]; },
    seite: () => { const b = new THREE.Box3(); doc.islands.forEach(i => b.expandByPoint(new THREE.Vector3(...i.origin))); const c = b.getCenter(new THREE.Vector3()), d = b.getSize(new THREE.Vector3()).length() + 6 * M.W; return [[c.x, c.y + M.W * 0.4, c.z + d * 1.05], [c.x, c.y, c.z]]; },
    burg: isleShot('K'), A: isleShot('A'), B: isleShot('B'), C: isleShot('C'),
    loop: () => { const p = at('ab_loop'); return [[p.x + 140, p.y + 70, p.z + 160], [p.x, p.y + 30, p.z]]; },
    sky: () => { const p = at('ka_sky'); return [[p.x + 220, p.y + 120, p.z + 220], [p.x, p.y + 20, p.z]]; },
    band: () => { const o = doc.objects.find(q => q.key === BAND_KEY); const p = o?.p || [0, 0, 0]; const H = M.houseH * figK; return [[p[0] + H * 2.2, p[1] + H * 1.0, p[2] + H * 2.4], [p[0], p[1] + H * 0.45, p[2]]]; }
  };
  const shot = id => { const [p, t] = (shots[id] || shots.uebersicht)(); camera.position.fromArray(p); controls.target.fromArray(t); controls.update(); };

  /* ---- Render ---- */
  /* v5 · EIN EnvironmentHost (lab-sky/env-host.v1). Das Licht-Rig bleibt das von HX1 (sun, hemi, back): Adapter skaliert die Preset-Intensitäten auf die K2-Abstimmung (Day = 2,9 / 1,05 / 0,6 wie HX1 v2);
     sun2, fill, fill2, amb, petFill sind abgekoppelte Platzhalter (HX1 hat sie nicht). Nebel, Hintergrund, Tageszeit, Wetter, Schale: nur der Host schreibt. */
  try {
    const sc = (l, k) => ({ color: l.color, groundColor: l.groundColor, position: l.position, target: l.target, get intensity() { return l.intensity / k; }, set intensity(v) { l.intensity = v * k; } }), dm = () => ({ color: new THREE.Color(), intensity: 0 });
    /* Befund Nacht (Bild): ohne Umgebungslicht fallen Inseln, Strecke und Wolken zu schwarzen Scherenschnitten. Ambient = echtes Licht der Preset-Zeile amb, aber nur im Maß, in dem die Sonne fehlt: (1 − Tagesgewicht) · 3,2 (K2-Knete schluckt viel Licht) — Day bleibt der HX1-Stand. */
    ambL = new THREE.AmbientLight(0x7088bb, 0); scene.add(ambL); const ambA = { color: ambL.color, get intensity() { return ambL.intensity; }, set intensity(v) { ambL.intensity = v * 3.2 * (1 - (env ? Math.min(1, Math.max(0, (env.dn.preset.sunIntensity - 1.25) / 3.75)) : 1)); } };
    const rig = { sun: sc(sun, 2.9 / 5.0), hemi: sc(hemi, 1.05 / 1.75), back: sc(back, 0.6 / 1.5), sun2: dm(), fill: dm(), fill2: dm(), amb: ambA, petFill: dm() };
    env = await createEnvironmentHost({ THREE, renderer, scene, camera, lights: rig, radius: 20000, fogScale: 333, minutes: 2, onNote }); await env.setShell('travel');
    try { const d = await CF.loadDonor(THREE), fam = CF.buildFamily(THREE, d.lobes, { count: 6, seed: 1 }); cloudMat = CF.makeCloudMaterial(THREE, U); cf = CF.createCloudField({ THREE, family: fam, material: cloudMat, parent: clouds }); info.cloud = { sha: d.inventory.sha, from: d.inventory.from, totals: fam.totals, bakeMs: 0 }; }
    catch (e) { info.errors.push('Wolken: ' + e.message); }
    applyWorld(worldKey);
  } catch (e) { info.errors.push('Himmel: ' + e.message); }
  const composer = new EffectComposer(renderer); composer.addPass(new RenderPass(scene, camera));
  let ao = null; try { const { GTAOPass } = await import('three/addons/postprocessing/GTAOPass.js'); ao = new GTAOPass(scene, camera, 2, 2);
    ao.updateGtaoMaterial({ radius: 1.2, distanceExponent: 1.4, thickness: 2.0, scale: 1.0, samples: 16 }); ao.updatePdMaterial({ lumaPhi: 10, depthPhi: 2, normalPhi: 3, radius: 6, rings: 2, samples: 16 }); ao.blendIntensity = 0.8; composer.addPass(ao); } catch (e) { info.errors.push('AO: ' + e.message); }
  composer.addPass(new OutputPass());
  const resize = () => { const w = canvas.clientWidth || 800, h = canvas.clientHeight || 450; renderer.setSize(w, h, false); composer.setSize(w, h); camera.aspect = w / h; camera.updateProjectionMatrix(); };
  const ro = new ResizeObserver(resize); ro.observe(canvas); resize();
  const _v = new THREE.Vector3();
  let lastT = performance.now(); let raf = 0, frames = 0, fT = performance.now(); const clock0 = performance.now();
  const loop = () => {
    raf = requestAnimationFrame(loop); controls.update();
    const beat = (performance.now() - clock0) / 1000 * (bandDef?.song?.bpm ?? 100) / 60;
    for (const [, x] of objs) x.root.userData.band?.update(beat);
    const nowT = performance.now(), dtE = Math.min(0.1, (nowT - lastT) / 1000); lastT = nowT;
    if (env) { env.update(dtE); if (cf) { cf.update(camera); cloudMat.color.copy(env.cloudColor); } }
    renderer.info.reset(); composer.render(); env && env.after(); frames++;
    if (menuEl && sel && !menuEl.hidden) { const b = new THREE.Box3().setFromObject(sel.root); _v.set((b.min.x + b.max.x) / 2, b.max.y, (b.min.z + b.max.z) / 2).project(camera);
      const r = canvas.getBoundingClientRect(); menuEl.style.left = ((_v.x + 1) / 2 * r.width) + 'px'; menuEl.style.top = Math.max(8, (1 - _v.y) / 2 * r.height - 56) + 'px'; }
    const n = performance.now(); if (n - fT > 1000) { info.fps = Math.round(frames * 1000 / (n - fT)); info.tris = renderer.info.render.triangles; info.calls = renderer.info.render.calls; frames = 0; fT = n; emit(true); }
  };

  /* ---- Zustand nach außen ---- */
  function emit(perfOnly) {
    const o = selDoc(), e = sel?.type === 'obj' ? byKey.get(sel.key) : sel?.type === 'tile' ? byKey.get(o?.tile) : null;
    const k = sel?.type === 'tile' && o ? edgeKinds(o.tile.split('|')[1], o.turns) : null;
    const st = {
      perf: { fps: info.fps, tris: info.tris, calls: info.calls, geoms: renderer.info.memory.geometries, textures: renderer.info.memory.textures },
      sel: sel ? { type: sel.type, id: sel.id, island: sel.island, cell: sel.type === 'tile' ? [sel.c, sel.r] : null, key: e?.key, base: e?.base, pack: e?.pack, role: e?.role, path: e?.path, commit: e?.commit, family: e?.family,
        turns: o?.turns, h: o?.h || 0, edges: k, sym: symmetry(k), p: o?.p, ry: o?.ry, s: o?.s, grund: o?.grund ?? null } : null,
      gates: G, bridge: bridgeInfo, placing: placing ? { key: placing.key, base: placing.entry.base, role: placing.entry.role } : null,
      opts: { ...opts }, look: { ...look, ao: !!ao?.enabled, world: worldKey, houseForm: HOUSE_FORM }, undo: undo.length, redo: redo.length,
      counts: doc ? { islands: doc.islands.length, cells: doc.islands.reduce((a, i) => a + i.cells.length, 0), objects: doc.objects.length } : null,
      measure: { S: r4(S), hexW: r4(M.W), hexH: r4(M.H), depth: r4(M.depth), tile: M.measured, road: M.road, bandScale: bandScale && r4(bandScale), guitarH: info.bandGuitarH, figK, houseH: r4(M.houseH), figH: bandScale && r4(bandScale * info.bandGuitarH), step: r4(M.step), stepU: M.stepU, parts: { ...partStats }, sideFix: info.sideFix || 0, bottomU: M.bottomU, levels: LEVELS, bodies: [...bodies].map(([id, b]) => ({ id, ...b.info })) }, errors: info.errors.slice(-4)
    };
    if (perfOnly && stateCache) { stateCache.perf = st.perf; onState({ ...stateCache }); return; }
    stateCache = st; onState(st);
  }

  /* ---- Import / Export ---- */
  const usedAssets = d => { const keys = new Set([...d.islands.flatMap(i => i.cells.map(c => c.tile)), ...d.objects.map(o => o.key)]);
    return [...keys].sort().map(k => { const e = byKey.get(k); return { key: k, path: e?.path ?? null, commit: e?.commit ?? null }; }); };
  const exportText = () => serialize({ ...doc, assets: usedAssets(doc), bridges: (bridgeInfo || []).map(b => ({ id: b.id, core: b.core, fingerprint: b.fingerprint, length: b.length })), exportedBy: 'HX1 hex-island.v5' });
  function importText(t) {
    const d = JSON.parse(t); if (d.schema !== SCHEMA) throw new Error('Schema ' + d.schema + ' statt ' + SCHEMA);
    delete d.assets; delete d.bridges; delete d.exportedBy;
    const miss = [...d.islands.flatMap(i => i.cells.map(c => c.tile)), ...d.objects.map(o => o.key)].filter(k => !byKey.has(k));
    if (miss.length) throw new Error('Unbekannte Teile: ' + [...new Set(miss)].join(', '));
    change(() => { doc = d; }); return syncing;
  }
  async function roundTrip() {
    await syncing; const a = exportText(); const keep = snapshot();
    doc = JSON.parse(a); delete doc.assets; delete doc.bridges; delete doc.exportedBy; bridgeSig = ''; await sync(); await syncing;
    const b = exportText(); const same = a === b; if (!same) doc = JSON.parse(keep);
    return { same, bytes: a.length, diffAt: same ? null : [...a].findIndex((ch, i) => ch !== b[i]) };
  }

  /* ---- Start ---- */
  doc = JSON.parse(serialize(cosmosDoc(M, neighbor)));   // kanonisch ab dem ersten Stand: gerundete Zahlen = gleicher Track-Fingerprint nach Import
  const saved = localStorage.getItem('kfb.hx1sky.doc');
  if (saved) { try { const d = JSON.parse(saved); if (d.schema === SCHEMA && d.route && d.id === 'HX1-KOSMOS' && d.rev === REV) doc = JSON.parse(serialize(d)); } catch (e) {} }
  doc.presentation = doc.presentation || { world: 'canyon' };
  applyWorld(doc.presentation.world);
  doc.rev = REV;
  const saveLocal = () => { try { localStorage.setItem('kfb.hx1sky.doc', JSON.stringify(doc)); } catch (e) {} };
  const _sync = sync;
  await _sync(); await syncing;
  info.ms.boot = Math.round(performance.now() - t0);
  shot('uebersicht'); loop(); onNote('');
  const persist = setInterval(saveLocal, 2000);

  const search = (q, f = {}) => {
    const words = (q || '').toLowerCase().split(/\s+/).filter(Boolean);
    return [...byKey.values()].filter(e => (!f.role || (f.role === 'tile' ? (e.role === 'tile' || e.role === 'square') : e.role === f.role)) && (!f.pack || e.pack === f.pack)
      && words.every(w => (e.base + ' ' + e.family + ' ' + e.pack + ' ' + e.role).toLowerCase().includes(w))).slice(0, 80)
      .map(e => ({ key: e.key, base: e.base, pack: e.pack, role: e.role, family: e.family, edges: e.role === 'tile' ? (TILE_EDGES[e.base.replace(/_waterless$/, '')] || null) : null }));
  };
  return {
    info, M, search, startPlace, cancelPlace, menu, shot, exportText, importText, roundTrip, gates: () => { gates(); emit(); return G; },
    setGrund: t => { const o = selDoc(); if (o && sel.type === 'obj') { o.grund = t; emit(); } },
    setFigure: k => { figK = k; if (info.bandGuitarH) { bandScale = figK * M.houseH / info.bandGuitarH; for (const [, x] of objs) x.root.userData.band?.place({ position: [0, 0, 0], rotationYDeg: 0, scale: bandScale }); world.updateMatrixWorld(true); gates(); emit(); } },
    setHouseForm: v => { HOUSE_FORM = v; softCache.clear(); for (const k of [...tiles.keys()]) { const x = tiles.get(k); unreg(x.root); world.remove(x.root); tiles.delete(k); } for (const [id, x] of objs) { if (x.root.userData.band) continue; unreg(x.root); world.remove(x.root); objs.delete(id); } partStats.thin = partStats.small = partStats.full = partStats.parts = 0; sync(); },
    setWorld: key => { doc.presentation = { ...(doc.presentation || {}), world: key }; applyWorld(key); sync(); },
    worlds: Object.fromEntries(Object.entries(WORLDS).map(([k, v]) => [k, v.name])),
    setLook: (k, v) => { if (k === 'ao') { if (ao) ao.enabled = v; } else if (k === 'body') { look.body = v; sync(); } else { look[k] = v; scene.traverse(o => o.isMesh && applyLook(o)); if (k === 'form') { world.updateMatrixWorld(true); gates(); } } emit(); },
    reset: () => { change(() => { doc = JSON.parse(serialize(cosmosDoc(M, neighbor))); doc.rev = REV; doc.presentation = { world: worldKey }; }); },
    get doc() { return doc; }, camera, controls,
    get env() { return env; }, get scene() { return scene; }, get renderer() { return renderer; }, get cloudField() { return cf; }, get cloudCount() { return cloudCount; },
    setCloudCount: n => { cloudCount = n; cloudsBuilt = false; buildClouds(); },
    /* Messung: dieselbe Kamera, gesamte HX1-Szene (Inseln, Strecke, Himmel, AO), n Wolken. Delta gegen 0 Wolken = Beitrag der Wolken. */
    async measureClouds(counts = [0, 4, 12, 24], N = 24, reps = 3, mo = null) {   // Median über reps Durchläufe, Reihenfolge je Durchlauf rotiert (Frame-Zeit der Vorschau schwankt ±30 %)
      const runs = []; for (let r = 0; r < reps; r++) { const o = counts.slice(r % counts.length).concat(counts.slice(0, r % counts.length)); runs.push(await this.measureOnce(o, N, mo)); await new Promise(q => setTimeout(q, 60)); }
      return counts.map(c => { const rs = runs.map(x => x.find(y => y.want === c)).sort((a, b) => a.ms - b.ms); const m = rs[Math.floor(rs.length / 2)]; return { ...m, msAll: rs.map(x => x.ms).join(' · ') }; });
    },
    async measureOnce(counts, N, mo) {
      const gl = renderer.getContext(), rows = []; const keep = cloudCount;
      for (const c of counts) {
        cloudCount = c; cloudsBuilt = false; buildClouds(); if (mo && cf) cf.group.children.forEach(m => m.material = mo); if (env) env.update(1 / 60); for (let i = 0; i < 6; i++) { cf && cf.update(camera); renderer.info.reset(); composer.render(); env && env.after(); }
        gl.finish(); const t0 = performance.now(); let tris = 0, calls = 0;
        for (let i = 0; i < N; i++) { cf && cf.update(camera); renderer.info.reset(); composer.render(); env && env.after(); tris = renderer.info.render.triangles; calls = renderer.info.render.calls; } gl.finish();
        const mats = new Set(); scene.traverse(o => o.material && [].concat(o.material).forEach(m => mats.add(m)));
        rows.push({ want: c, clouds: cf ? cf.count : 0, tris, calls, materials: mats.size, ms: Math.round((performance.now() - t0) / N * 100) / 100, cloudTris: cf ? cf.last.tris : 0, cloudCalls: cf ? cf.last.calls : 0, lod: cf ? cf.lodCounts.join('/') : '–' });
      }
      cloudCount = keep; cloudsBuilt = false; buildClouds(); return rows;
    },
    dispose() { cancelAnimationFrame(raf); clearInterval(persist); saveLocal(); window.removeEventListener('keydown', onKey); ro.disconnect(); controls.dispose(); tc.dispose(); env && env.dispose(); cf && cf.dispose(); ambL && ambL.removeFromParent(); renderer.dispose(); }
  };
}
