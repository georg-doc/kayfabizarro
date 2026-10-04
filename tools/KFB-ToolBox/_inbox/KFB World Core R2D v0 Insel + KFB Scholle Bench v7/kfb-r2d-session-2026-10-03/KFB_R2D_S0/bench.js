/* KFB World Core R2D · S0 Quellen-Bank (02.10.2026)
 * Brief: skills/chat/workflows/KFB_WORLD_CORE_R2D_2026-10-02/BRIEF_CLAUDE_DESIGN_R2C_TO_CONTINUOUS_ISLANDS.md @ 14a1c55 (PR #328)
 * Schritt 1 (Quellen prüfen) und Schritt 2 (Material und Form isolieren). Nichts hier ist R2D-Gestaltung.
 * Alle Module kommen über jsDelivr am Pin, alle Daten über raw am Pin. Kein Asset liegt lokal.
 * Ein Renderer für alle Bühnen (Projektregel 5); R2C live läuft optional in seinem eigenen Owner (boot()). */
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { GTAOPass } from 'three/addons/postprocessing/GTAOPass.js';

export const PIN = {
  brief: '14a1c55bbf2748d67cfd673d5d0df73bf3f7b082', r2c: '927a1b4bd2d1de6cf0479414e2e8ac1cb9d6509f', ssot: '589fa4fe6a3d5a950cf8a82bcf480b8e6326e711',
  asset: '378b209355b13304e3cff656ec0806ca5b89df28', track: '64d8597c3dad1dc9814c794d4a566d589e1e1a25', b2: '69c9c7f54cb1c048105f5aa822593c8976727959', b2test: '99a390d3b828fc132528a65e3cff52d165299990' };
const REPO = 'georg-doc/kayfabizarro';
const enc = p => p.split('/').map(encodeURIComponent).join('/');
export const RAW = (c, p) => `https://raw.githubusercontent.com/${REPO}/${c}/${enc(p)}`;
export const JSD = (c, p) => `https://cdn.jsdelivr.net/gh/${REPO}@${c}/${enc(p)}`;
export const BLOB = (c, p) => `https://github.com/${REPO}/blob/${c}/${enc(p)}`;
export const TREE = (c, p) => `https://github.com/${REPO}/tree/${c}/${enc(p)}`;
export const PR = n => `https://github.com/${REPO}/pull/${n}`;
export const DIR = {
  brief: 'skills/chat/workflows/KFB_WORLD_CORE_R2D_2026-10-02/',
  r2c: 'tools/KFB-ToolBox/_inbox/KFB World Core R2C · Hex-Archipel Katalog/WORLD_CORE_R2C_2026-10-01/',
  k1: 'tools/KFB-ToolBox/_inbox/KFB Knet-Katalog K1 + Hirnwelt Claymation Reference/KFB_K1_H0_CODEBASE_2026-09-29/',
  ssot: 'tools/KFB-ToolBox/docs/',
  track: 'skills/chat/workflows/KFB_TRACK_CORE_SLICE_2026-09-26/',
  b2: 'tools/KFB-ToolBox/worldbuilder/world-corridor-01/procedural-building-b2/',
  wi: 'tools/KFB-ToolBox/_inbox/KFB_WORLD_INTEGRATION_01_CLAUDE_DESIGN_SESSION_CUT_2026-09-25_r2/',
  hex: 'media/3D_Assets/KayKit_Medieval_Hexagon_Pack_1.0_FREE/Assets/gltf/',
  tex: 'media/3D_Assets/Textures/clay_floor_001/' };
export const CLAY_FLOOR = ['diffuse', 'normal', 'roughness', 'ao'].map(k => ({ k, path: DIR.tex + 'clay_floor_001_' + k + '.jpg', bytesBrief: { diffuse: 115628, normal: 72654, roughness: 121553, ao: 66066 }[k] }));

/* ---------- Schritt 1 · Quellen ---------- */
export const SOURCES = [
  { id: 'r2c', n: 1, name: 'World Core R2C · Hex-Archipel Katalog', role: 'Ausgangspunkt. Karte, Atlas-UI, Weltgraph, Seed, Biome, Paletten, Strecke. Sichtbar als KayKit-Hexkacheln.', pin: PIN.r2c, link: TREE(PIN.r2c, DIR.r2c),
    files: ['START_HERE.md', 'docs/RETURN.md', 'docs/HANDOVER_WSA.md', 'KFB World Core R2C · Hex-Archipel Katalog.dc.html', 'lab-world/hex-archipel.r2c.js', 'golden/facade-ab-01.js', 'pictures/r2c-01.jpg'].map(f => ({ f, c: PIN.r2c, p: DIR.r2c + f })) },
  { id: 'ssot', n: 2, name: 'Claymation Style SSOT + Golden Matrix', role: 'Regelwerk für den Knet-Look. K1/H0 v8 ist das Sollbild, K2/v10 darf nur mit Bildgleichheit ersetzen.', pin: PIN.ssot, pr: 301, link: BLOB(PIN.ssot, DIR.ssot + 'KFB_CLAYMATION_STYLE_SSOT.md'),
    files: ['KFB_CLAYMATION_STYLE_SSOT.md', 'KFB_CLAY_GOLDEN_SAMPLE_MATRIX.md'].map(f => ({ f, c: PIN.ssot, p: DIR.ssot + f })) },
  { id: 'k1h0', n: 3, name: 'K1/H0 · Golden-Terrain und Hirnwelt', role: 'Sollbild für Gelände. H0-Totale und H0-Nahsicht, dazu der v8-Knet-Shader und die Vorstufe.', pin: PIN.r2c, link: TREE(PIN.r2c, DIR.k1),
    files: ['KFB Hirnwelt H0.dc.html', 'KFB Knet-Katalog K1.dc.html', 'lab-brain/brain-world.v8.js', 'lab-clay/clay-material.v8.js', 'lab-clay/clay-soften.v1.js', 'screenshots/05-h0-totale.png', 'screenshots/07-h0-gelaende-nah.png'].map(f => ({ f, c: PIN.r2c, p: DIR.k1 + f })) },
  { id: 'track', n: 4, name: 'Track Core · einziger Fahrbahn-Owner', role: 'Fahrbahn, Breiten, Übergänge, Anschlüsse. Generator und Rezepte; KayKit liefert hier keine Straße.', pin: PIN.track, pr: 219, link: TREE(PIN.track, DIR.track),
    files: ['START_HERE.md', 'W0_2026-09-27/TRACK_CORE_CONTRACT_v0.md', 'BUILDER_2026-09-27/track-core.mjs', 'BUILDER_2026-09-27/stream-to-three.mjs', 'BUILDER_2026-09-27/presets.json'].map(f => ({ f, c: PIN.track, p: DIR.track + f })) },
  { id: 'b2', n: 5, name: 'WorldBuilder B2 · echter Fassaden-Owner', role: 'Gebäude laufen über buildCityLayer() mit kfb-facade-rule-v1. Keine Fassadenkopie.', pin: PIN.b2, pr: 323, link: TREE(PIN.b2, DIR.b2),
    files: [...['B2_EXISTING_FACADE_OWNER_CONTRACT.md', 'RETURN.md', 'SOURCE.json'].map(f => ({ f, c: PIN.b2, p: DIR.b2 + f })), { f: 'wd1-city.js (Owner)', c: PIN.b2, p: DIR.wi + 'wd1-city.js' }] },
  { id: 'p2', n: 6, name: 'Environment P2 · prozedurale Props', role: 'Nur Formhinweis. Stümpfe und Pilze sind TUNE und werden in R2D nicht eingesetzt.', pin: null, pr: 316, link: PR(316), files: [] },
  { id: 'clay', n: 7, name: 'clay_floor_001 · Textursatz', role: 'Vier eigenständige Bilddateien im Texturkatalog. Vergleichskandidat, kein freigegebener Look.', pin: PIN.asset, link: TREE(PIN.asset, DIR.tex),
    files: [...CLAY_FLOOR.map(t => ({ f: 'clay_floor_001_' + t.k + '.jpg', c: PIN.asset, p: t.path, expect: t.bytesBrief })), { f: 'registry/…/textures.json', c: PIN.r2c, p: 'registry/assets/v1/packs/textures.json' }] },
  { id: 'brief', n: 0, name: 'R2D-Briefing', role: 'Dieser Auftrag. Draft, nicht gemergt.', pin: PIN.brief, pr: 328, link: BLOB(PIN.brief, DIR.brief + 'BRIEF_CLAUDE_DESIGN_R2C_TO_CONTINUOUS_ISLANDS.md'),
    files: [{ f: 'BRIEF_CLAUDE_DESIGN_R2C_TO_CONTINUOUS_ISLANDS.md', c: PIN.brief, p: DIR.brief + 'BRIEF_CLAUDE_DESIGN_R2C_TO_CONTINUOUS_ISLANDS.md' }] } ];

export async function checkFile(c, p) {
  const t0 = performance.now();
  try { const r = await fetch(RAW(c, p), { cache: 'no-store' }); const b = r.ok ? await r.arrayBuffer() : null;
    return { status: r.status, bytes: b ? b.byteLength : 0, ms: Math.round(performance.now() - t0), text: b && /\.(md|html|js|mjs|json)$/.test(p) ? new TextDecoder().decode(b.slice(0, 200000)) : null };
  } catch (e) { return { status: 0, bytes: 0, ms: Math.round(performance.now() - t0), err: String(e.message || e) }; } }
export async function checkPR(n) {
  try { const r = await fetch(`https://api.github.com/repos/${REPO}/pulls/${n}`); if (!r.ok) return { status: r.status };
    const j = await r.json(); return { status: 200, state: j.state, draft: j.draft, merged: !!j.merged_at, title: j.title, head: j.head && j.head.sha, ref: j.head && j.head.ref };
  } catch (e) { return { status: 0, err: String(e.message || e) }; } }

/* ---------- Provenienz: woraus R2C sein Bodenmaterial macht ---------- */
const KAY_PARTS = ['tiles/base/hex_grass', 'tiles/base/hex_grass_bottom', 'tiles/base/hex_grass_sloped_high', 'tiles/base/hex_water',
  ...['mountain_A', 'mountain_B', 'mountain_C', 'mountain_A_grass', 'mountain_B_grass_trees', 'mountain_C_grass', 'hills_A', 'hills_A_trees', 'hills_B_trees', 'hills_C',
    'hill_single_A', 'hill_single_B', 'hill_single_C', 'trees_A_small', 'trees_A_medium', 'trees_B_medium', 'trees_B_large', 'tree_single_A', 'tree_single_B',
    'rock_single_A', 'rock_single_B', 'rock_single_C', 'rock_single_D', 'rock_single_E'].map(n => 'decoration/nature/' + n),
  'buildings/red/building_castle_red', 'buildings/blue/building_church_blue', 'buildings/yellow/building_mine_yellow', 'buildings/green/building_windmill_green'];
export async function probeProvenance() {
  const out = { parts: [], r2cMentions: null, registry: null, mainHexGrass: null };
  const rows = await Promise.all(KAY_PARTS.map(async p => { try { const r = await fetch(RAW(PIN.asset, DIR.hex + p + '.gltf')); if (!r.ok) return { p, status: r.status };
    const j = await r.json(); return { p, status: 200, mats: (j.materials || []).map(m => m.name), imgs: (j.images || []).map(i => i.uri) }; } catch (e) { return { p, status: 0, err: e.message }; } }));
  out.parts = rows;
  try { const j = await (await fetch('https://raw.githubusercontent.com/' + REPO + '/main/' + DIR.hex + 'tiles/base/hex_grass.gltf')).json(); out.mainHexGrass = { mats: j.materials.map(m => m.name), imgs: (j.images || []).map(i => i.uri) }; } catch (e) { out.mainHexGrass = { err: e.message }; }
  const r2cFiles = ['docs/RETURN.md', 'docs/HANDOVER_WSA.md', 'docs/CHANGELOG.md', 'docs/HOUSEKEEPING.md', 'docs/FACADE-AB-01_RETURN.md', 'START_HERE.md', 'lab-world/hex-archipel.r2c.js', 'KFB World Core R2C · Hex-Archipel Katalog.dc.html'];
  out.r2cMentions = await Promise.all(r2cFiles.map(async f => { const t = await (await fetch(RAW(PIN.r2c, DIR.r2c + f))).text(); return { f, bytes: t.length, hits: (t.match(/clay_floor/g) || []).length }; }));
  try { const j = await (await fetch(RAW(PIN.r2c, 'registry/assets/v1/packs/textures.json'))).json(); const all = [];
    const walk = o => { if (!o || typeof o !== 'object') return; if (Array.isArray(o)) return o.forEach(walk); if (o.collectionPath === 'clay_floor_001' && o.path) { const m = JSON.stringify(o).match(/"rawPinned":"([^"]+)"/); all.push({ name: o.name, path: o.path, rawPinned: m ? m[1] : null }); return; } Object.values(o).forEach(walk); };
    walk(j); out.registry = all; } catch (e) { out.registry = { err: e.message }; }
  return out; }

/* ---------- Module am Pin ----------
 * Quelltext über jsDelivr (Rückfall raw), relative Importe rekursiv auf Blob-Module desselben Pins umgeschrieben,
 * 'three' bleibt bloß und löst über die Import-Map auf. Grund: jsDelivr liefert Dateien dieses Repos sporadisch mit 403
 * (Befund aus KFB_Hex_Scenelet_Review_v0/engine.js). Nur Spezifizierer werden ersetzt, sonst Byte für Byte.
 * Nebeneffekt, gewollt: '?r=2' und ohne Query sind dieselbe Modulinstanz. */
export const MODLOG = [];
const BL = new Map();
async function blobMod(c, path) { const clean = path.split('?')[0], key = c + '|' + clean; if (BL.has(key)) return BL.get(key);
  const p = (async () => { let r = await fetch(JSD(c, clean)), via = 'jsdelivr'; if (!r.ok) { const s0 = r.status; r = await fetch(RAW(c, clean)); via = 'raw (jsDelivr ' + s0 + ')'; }
    if (!r.ok) throw new Error(r.status + ' ' + clean);
    let src = await r.text(); const dir = clean.replace(/[^/]+$/, '');
    // nur echte Import-Anweisungen (Zeilenanfang), keine Kommentare: stream-to-three.mjs zitiert sich selbst im Kopfkommentar
    const specs = [...new Set([...src.matchAll(/^\s*(?:import|export)\b[^;'"]*?(?:from\s*)?['"](\.{1,2}\/[^'"]+)['"]/gm), ...src.matchAll(/\bimport\(\s*['"](\.{1,2}\/[^'"]+)['"]\s*\)/g)].map(m => m[1]))];
    for (const s of specs) { const tgt = decodeURIComponent(new URL(s.split('?')[0], 'https://x/' + dir).pathname.slice(1)); if (tgt === clean) continue; const u = await blobMod(c, tgt); src = src.split("'" + s + "'").join("'" + u + "'").split('"' + s + '"').join('"' + u + '"'); }
    MODLOG.push({ pin: c.slice(0, 7), path: clean, via, bytes: src.length });
    return URL.createObjectURL(new Blob([src], { type: 'text/javascript' })); })();
  BL.set(key, p); return p; }
export const importPinned = async (c, path) => import(await blobMod(c, path));
let M = null;
async function mods() { if (M) return M;
  const r = f => importPinned(PIN.r2c, DIR.r2c + f);
  const [V8, SOFT, REL, V10, FIT, FAB, TC, ST] = await Promise.all([
    r('golden/k1/lab-clay/clay-material.v8.js'), r('golden/k1/lab-clay/clay-soften.v1.js'), r('golden/k1/lab-clay/clay-relief.v2.js'),
    r('lab-clay/clay-material.v10.js'), r('lab-world/shadow-fit.v1.js'), r('golden/facade-ab-01.js'),
    importPinned(PIN.track, DIR.track + 'BUILDER_2026-09-27/track-core.mjs'), importPinned(PIN.track, DIR.track + 'BUILDER_2026-09-27/stream-to-three.mjs')]);
  M = { V8, SOFT, REL, V10, FIT, FAB, TC, ST }; return M; }

const DAY = { sun: '#fff4e6', sunI: 2.9, el: 32, az: -38, hemiS: '#d6e8f6', hemiG: '#d9a27a', hemiI: 0.95, sky: '#96bede' };  // K1 MOODS.day, wie FACADE-A/B-01
const AP = 10 * Math.sqrt(3) / 2;   // R2C: S = 10, AP = S·√3/2 — KayKit-Kachel im R2C-Weltmaß
const PRINT = JSD(PIN.r2c, 'tools/KFB-ToolBox/_inbox/KFB_CLAYMATION_H0_HIRNWELT_2026-09-27/external/Fingerprints01_3K.png');
const PAL_BURG = { grass: '#7cba48', grass2: '#6aa83c', paved: '#e8dcc6', sand: '#e3c98f', rock: '#9b6b4a', lip: '#5f9a38', hill: '#6fae40', water: '#5aa6d6' };   // r2c.js PAL.burg
const LEAF_BURG = '#2a8a45';
export const VARIANTS = [
  { k: 'source', n: '1 · Quelle unverändert', d: 'KayKit-Material hexagons_medieval, Atlas-PNG, keine Vorstufe.' },
  { k: 'golden', n: '2 · H0/K1-Golden (v8)', d: 'softenGeometry → seedGeometry → clay-material.v8, Profil terrainFg, Quellmaterial mit Atlas.' },
  { k: 'r2c', n: '3 · R2C/K2-Weg (v10)', d: 'Atlas je Ecke gelesen, Farbklasse auf Palette »burg«, clay-material.v10 Parität, terrainFg.' },
  { k: 'floor', n: '4 · clay_floor_001', d: 'MeshStandardMaterial mit den vier Karten, Kastenprojektion in Weltmetern.' }];
export const VIEWS = [['nah', 'Nah 4 m'], ['lauf', 'Laufhöhe 1,7 m'], ['mittel', 'Mittel 32 m'], ['fern', 'Fern 90 m']];

const dataTex = (renderer, d, size) => { const t = new THREE.DataTexture(d, size, size, THREE.RGBAFormat); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.magFilter = THREE.LinearFilter; t.minFilter = THREE.LinearMipmapLinearFilter; t.generateMipmaps = true; t.anisotropy = renderer.capabilities.getMaxAnisotropy(); t.needsUpdate = true; return t; };
const triCount = g => (g.index ? g.index.count : g.attributes.position.count) / 3;

function boxUV(g, T) {   // Kastenprojektion: je Dreieck die dominante Normalenachse, Weltmeter / T
  const P = g.attributes.position, n = P.count, uv = new Float32Array(n * 2), a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3(), nn = new THREE.Vector3();
  for (let i = 0; i < n; i += 3) { a.fromBufferAttribute(P, i); b.fromBufferAttribute(P, i + 1); c.fromBufferAttribute(P, i + 2); nn.subVectors(c, b).cross(a.clone().sub(b)); const ax = Math.abs(nn.x), ay = Math.abs(nn.y), az = Math.abs(nn.z);
    for (let k = 0; k < 3; k++) { const x = P.getX(i + k), y = P.getY(i + k), z = P.getZ(i + k); const [u, v] = ay >= ax && ay >= az ? [x, z] : ax >= az ? [z, y] : [x, y]; uv[(i + k) * 2] = u / T; uv[(i + k) * 2 + 1] = v / T; } }
  g.setAttribute('uv', new THREE.BufferAttribute(uv, 2)); return g; }

/* R2C bakeKay() für eine Kachel, Zeile für Zeile aus hex-archipel.r2c.js @927a1b4 (nur Beleg, kein neuer Owner) */
function r2cSampler(map) { const im = map && map.image; if (!im) return () => [0.6, 0.6, 0.6]; const cv = document.createElement('canvas'); cv.width = im.width; cv.height = im.height; const x = cv.getContext('2d', { willReadFrequently: true }); x.drawImage(im, 0, 0);
  const D = x.getImageData(0, 0, cv.width, cv.height).data, Wd = cv.width, Ht = cv.height;
  return (u, v) => { const px = Math.min(Wd - 1, Math.floor((((u % 1) + 1) % 1) * Wd)), py = Math.min(Ht - 1, Math.floor((((v % 1) + 1) % 1) * Ht)), i = (py * Wd + px) * 4; return [D[i] / 255, D[i + 1] / 255, D[i + 2] / 255]; }; }
const slotOf = (r, g, b) => { const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, d = mx - mn, s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1)); let h = 0;
  if (d) { h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h *= 60; if (h < 0) h += 360; }
  if (l > 0.86 && s < 0.3) return 'snow'; if (s < 0.16) return 'stone'; if (h >= 185 && h <= 255) return 'water'; if (h >= 82 && h < 185) return 'leaf'; if (h >= 45 && h < 82) return 'grass'; if (h >= 24 && h < 45 && l > 0.6) return 'sand'; return 'dirt'; };
function r2cBake(geo, map) { const col = hex => { const c = new THREE.Color(hex); return [c.r, c.g, c.b]; }, lerp = (a, b, t) => a + (b - a) * t, mixc = (a, b, t) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)], mulc = (a, k) => [a[0] * k, a[1] * k, a[2] * k], clamp = (x, a, b) => Math.min(b, Math.max(a, x));
  const pal = PAL_BURG, SC2 = { grass: col(pal.grass), dirt: col(pal.rock), stone: mixc(col('#c9c1b4'), col(pal.rock), 0.12), leaf: col(LEAF_BURG), water: col(pal.water), sand: col(pal.sand), snow: col('#f4efe6') };
  const sample = r2cSampler(map), g = geo.clone(), uv = g.attributes.uv, n = g.attributes.position.count, cl = new Float32Array(n * 3), sl = new Array(n), Ls = new Float32Array(n), sum = {}, cnt = {}, slots = {};
  for (let i = 0; i < n; i++) { const [r, gg, b] = uv ? sample(uv.getX(i), uv.getY(i)) : [0.6, 0.6, 0.6], c = slotOf(r, gg, b), Lm = 0.2126 * r + 0.7152 * gg + 0.0722 * b; sl[i] = c; Ls[i] = Lm; sum[c] = (sum[c] || 0) + Lm; cnt[c] = (cnt[c] || 0) + 1; }
  for (let i = 0; i < n; i++) { cl.set(mulc(SC2[sl[i]], clamp(Ls[i] / (sum[sl[i]] / cnt[sl[i]] || 1), 0.72, 1.18)), i * 3); slots[sl[i]] = (slots[sl[i]] || 0) + 1; }
  g.setAttribute('color', new THREE.BufferAttribute(cl, 3)); if (uv) g.deleteAttribute('uv'); return { geo: g, slots }; }

export async function makeBench(onNote = () => {}) {
  const t0 = performance.now(); onNote('Module am Pin laden (jsDelivr) …');
  const { V8, SOFT, REL, V10, FIT, FAB, TC, ST } = await mods();
  const W = 640, H = 480, info = { errors: [], variants: {}, donor: null, loadMs: 0 };
  const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(1); renderer.setSize(W, H, false); renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap; renderer.info.autoReset = false;
  const camera = new THREE.PerspectiveCamera(34, W / H, 0.05, 800);
  onNote('Relief, Fingerabdrücke, Karten …');
  const rel11 = REL.makeClayRelief({ size: 1024, seed: 11 }), rel31 = REL.makeClayRelief({ size: 1024, seed: 31 });
  let print = null; try { print = await V8.makePrintTexture(THREE, PRINT, 2048); } catch (e) { info.errors.push('Fingerabdrücke: ' + e.message); }
  const tex8 = dataTex(renderer, rel11.data, rel11.size), U8 = V8.makeClayUniforms(THREE, tex8); if (print) { U8.uClayPrint.value = print; U8.uClayPrintOn.value = 1; } else U8.uClayPrint.value = tex8;
  const tex10 = dataTex(renderer, rel31.data, rel31.size), U10 = V10.makeClayUniforms(THREE, tex10);
  U10.uClayToolOn.value = 0; U10.uClayLegacyStroke.value = 1; U10.uClayHexK.value = 3; U10.uClayHexRot.value = 1; U10.uClayHexFlow.value = 0; U10.uClayFacetSoft.value = 0;
  if (print) { U10.uClayPrint.value = print; U10.uClayPrintOn.value = 1; } else U10.uClayPrint.value = tex10;
  U10.uClayHand.value = 0.5; U10.uClayTile.value = 1.6; U10.uClayPrintTile.value = 4.5;
  const tl = new THREE.TextureLoader(), maps = {};
  await Promise.all(CLAY_FLOOR.map(t => tl.loadAsync(RAW(PIN.asset, t.path)).then(x => { x.wrapS = x.wrapT = THREE.RepeatWrapping; x.anisotropy = renderer.capabilities.getMaxAnisotropy(); x.colorSpace = t.k === 'diffuse' ? THREE.SRGBColorSpace : THREE.NoColorSpace; maps[t.k] = x; info['map_' + t.k] = x.image.width + '×' + x.image.height; }).catch(e => info.errors.push('clay_floor_001 ' + t.k + ': ' + e.message))));
  // Tisch wie K1 / FACADE-A/B-01
  const TABLE = { ...V8.PROFILES.terrainBg, scale: 1.6, dent: 0.12, dentSize: 1.4, gouge: 0.1, gougeSize: 1.2 };
  let tg = new THREE.BoxGeometry(34, 0.8, 26, 68, 2, 52); tg.translate(0, -0.4, 0); tg = SOFT.softenGeometry(THREE, tg, { maxLevels: 0, iters: 14, lambda: 0.55, mu: -0.57, lump: 0.0015, lumpFreq: 1.1 }).geometry; tg.computeVertexNormals(); V8.seedGeometry(THREE, tg, 3);
  const tableMat = V8.makeClayMaterial(THREE, U8, { src: new THREE.MeshStandardMaterial({ color: '#e2d0bc' }), profile: TABLE });
  const r2cMat = (() => { const m = V10.makeClayMaterial(THREE, U10, { src: new THREE.MeshStandardMaterial({ color: '#ffffff', vertexColors: true, side: THREE.DoubleSide }), profile: { ...V10.PROFILES.terrainFg, legacy: 1 } });
    m.side = THREE.DoubleSide; const ob = m.onBeforeCompile, ck = m.customProgramCacheKey;
    m.onBeforeCompile = (sh, r) => { ob(sh, r); sh.fragmentShader = sh.fragmentShader.replace('if (uClayPrintOn > 0.5) {', 'if (uClayPrintOn > 0.5 && lodNear > 0.0) {'); };
    m.customProgramCacheKey = () => ck() + '-r2a-par'; return m; })();
  const floorMat = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 1, metalness: 0 });
  let floorMode = 'all', floorT = 2;
  const applyFloor = () => { const m = floorMat, F = floorMode; m.map = F === 'all' || F === 'diffuse' ? maps.diffuse : F === 'rough' ? maps.roughness : F === 'ao' ? maps.ao : null;
    m.color.set(F === 'all' || F === 'diffuse' || F === 'rough' || F === 'ao' ? '#ffffff' : '#bdbdbd');
    m.normalMap = F === 'all' || F === 'normal' ? maps.normal : null; m.roughnessMap = F === 'all' ? maps.roughness : null; m.aoMap = F === 'all' ? maps.ao : null; m.needsUpdate = true; };
  applyFloor();

  const mkStage = () => { const scene = new THREE.Scene(); scene.background = new THREE.Color(DAY.sky);
    const sun = new THREE.DirectionalLight(DAY.sun, DAY.sunI); sun.castShadow = true; sun.shadow.mapSize.set(4096, 4096); scene.add(sun, sun.target);
    scene.add(new THREE.HemisphereLight(DAY.hemiS, DAY.hemiG, DAY.hemiI)); const fill = new THREE.DirectionalLight('#ffe6d6', DAY.sunI * 0.15); scene.add(fill);
    const el = THREE.MathUtils.degToRad(DAY.el), az = THREE.MathUtils.degToRad(DAY.az); sun.position.set(Math.sin(az) * Math.cos(el) * 60, Math.sin(el) * 60, Math.cos(az) * Math.cos(el) * 60); fill.position.copy(sun.position).multiplyScalar(-1).setY(20);
    const lightDir = sun.position.clone().normalize();
    const c = new EffectComposer(renderer, new THREE.WebGLRenderTarget(W, H, { samples: 4, type: THREE.HalfFloatType })); c.setSize(W, H); c.addPass(new RenderPass(scene, camera));
    try { const ao = new GTAOPass(scene, camera, W, H); ao.updateGtaoMaterial({ radius: 0.45, distanceExponent: 1.4, thickness: 1.2, scale: 1.0, samples: 16 }); ao.updatePdMaterial({ lumaPhi: 10, depthPhi: 2, normalPhi: 3, radius: 6, rings: 2, samples: 16 }); ao.blendIntensity = 0.9; c.addPass(ao); } catch (e) { info.errors.push('AO: ' + e.message); }
    c.addPass(new OutputPass()); return { scene, sun, lightDir, composer: c, content: new THREE.Group() }; };
  const ST4 = Object.fromEntries(VARIANTS.map(v => { const s = mkStage(); const t = new THREE.Mesh(tg, tableMat); t.receiveShadow = true; s.scene.add(t, s.content); return [v.k, s]; }));

  let hb = new THREE.Box3(), donorName = null;
  const loader = new GLTFLoader();
  async function setDonor(name) { if (donorName === name) return; onNote('Spender ' + name + ' laden (raw @' + PIN.asset.slice(0, 7) + ') …');
    const gl = await loader.loadAsync(RAW(PIN.asset, DIR.hex + 'tiles/base/' + name + '.gltf')); gl.scene.updateMatrixWorld(true);
    const parts = []; gl.scene.traverse(o => { if (!o.isMesh) return; let g = o.geometry.clone(); g.applyMatrix4(o.matrixWorld); if (!g.attributes.normal) g.computeVertexNormals(); g.scale(AP, AP, AP); parts.push({ geo: g, mat: o.material }); });
    const box = new THREE.Box3(); parts.forEach(p => { p.geo.computeBoundingBox(); box.union(p.geo.boundingBox); });
    const off = new THREE.Vector3(-(box.min.x + box.max.x) / 2, -box.min.y, -(box.min.z + box.max.z) / 2); parts.forEach(p => p.geo.translate(off.x, off.y, off.z));
    hb = box.clone().translate(off);
    const json = gl.parser.json, D = { name, pin: PIN.asset, url: RAW(PIN.asset, DIR.hex + 'tiles/base/' + name + '.gltf'), mats: (json.materials || []).map(m => m.name), imgs: (json.images || []).map(i => i.uri), srcTris: Math.round(parts.reduce((a, p) => a + triCount(p.geo), 0)), size: hb.getSize(new THREE.Vector3()).toArray().map(v => +v.toFixed(2)), scale: +AP.toFixed(3) };
    for (const v of VARIANTS) { const S = ST4[v.k]; S.content.traverse(o => { if (o.isMesh && o.userData.own) o.geometry.dispose(); }); S.content.clear(); }
    const ts = performance.now(); let gTris = 0, rTris = 0, slots = {};
    parts.forEach((p, i) => {
      const add = (k, g, m) => { const me = new THREE.Mesh(g, m); me.castShadow = me.receiveShadow = true; me.userData.own = true; ST4[k].content.add(me); };
      add('source', p.geo.clone(), p.mat);
      let g = SOFT.softenGeometry(THREE, p.geo, {}).geometry; g = V8.seedGeometry(THREE, g.clone(), 101 + i) || g; gTris += triCount(g);
      add('golden', g, V8.makeClayMaterial(THREE, U8, { src: p.mat, profile: V8.PROFILES.terrainFg }));
      const ni = p.geo.index ? p.geo.toNonIndexed() : p.geo.clone(); const bk = r2cBake(ni, p.mat.map); Object.entries(bk.slots).forEach(([k, n]) => slots[k] = (slots[k] || 0) + n);
      const rg = V10.seedGeometry(THREE, bk.geo, 7 * 100000 + i) || bk.geo; rTris += triCount(rg); add('r2c', rg, r2cMat);
      add('floor', boxUV(ni.clone(), floorT), floorMat); });
    D.goldenTris = Math.round(gTris); D.r2cTris = Math.round(rTris); D.softMs = Math.round(performance.now() - ts); D.r2cSlots = slots; info.donor = D; donorName = name; }
  const reUV = () => { ST4.floor.content.traverse(o => { if (o.isMesh) boxUV(o.geometry, floorT); }); };

  const dirAz = new THREE.Vector3(0.25, 0, 1).normalize();
  let view = 'nah';
  const setView = id => { view = id; const top = hb.max.y, R = hb.max.x;
    if (id === 'lauf') { camera.position.set(R * 0.1, top + 1.7, hb.max.z * 0.82); camera.lookAt(-R * 0.25, top + 0.4, hb.min.z * 0.7); return; }
    const diag = hb.getSize(new THREE.Vector3()).length();
    const V = { nah: { t: new THREE.Vector3(0, top, hb.max.z * 0.9), d: 4, el: 30 }, mittel: { t: new THREE.Vector3(0, top * 0.5, 0), d: Math.max(32, diag * 1.45), el: 30 }, fern: { t: new THREE.Vector3(0, top * 0.5, 0), d: 90, el: 30 } }[id] || { t: new THREE.Vector3(), d: 30, el: 30 };
    const el = THREE.MathUtils.degToRad(V.el), dir = dirAz.clone().multiplyScalar(Math.cos(el)).setY(Math.sin(el)); camera.position.copy(V.t).addScaledVector(dir, V.d); camera.lookAt(V.t); };
  const gl = renderer.getContext(), px = new Uint8Array(4);
  const renderInto = (k, cv) => { const S = ST4[k], sb = hb.clone().expandByScalar(1); const fit = FIT.fitShadow(renderer, S.sun, S.lightDir, sb, { pad: 1.08 });
    renderer.info.reset(); const a = performance.now(); S.composer.render(); gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px);
    const r = { frameMs: +(performance.now() - a).toFixed(1), tris: renderer.info.render.triangles, calls: renderer.info.render.calls, shadow: '±' + fit.r + ' m · Texel ' + (fit.texel * 1000).toFixed(1) + ' mm' };
    if (cv) { cv.width = W; cv.height = H; cv.getContext('2d').drawImage(renderer.domElement, 0, 0); } info.variants[k] = r; return r; };
  const compareAll = cvs => { const out = {}; try { out.r2c = FAB.compare(cvs.source, cvs.golden, cvs.r2c); out.floor = FAB.compare(cvs.source, cvs.golden, cvs.floor); out.source = FAB.compare(cvs.source, cvs.golden, cvs.source); } catch (e) { out.err = e.message; } info.compare = out; return out; };

  /* Track-Core-Stück: die ersten zwei Stücke des Builder-Presets »sandbox«, unverändert durch compileRecipe → buildTrack */
  const trackStage = mkStage(); let trackInfo = null;
  async function buildTrackPiece() { if (trackInfo) return trackInfo; onNote('Track Core compileRecipe …');
    const presets = await (await fetch(RAW(PIN.track, DIR.track + 'BUILDER_2026-09-27/presets.json'))).json(), sb = presets.sandbox;
    const recipe = { ...sb, pieces: sb.pieces.slice(0, 2) }, a = performance.now(), stream = TC.compileRecipe(recipe), ms = performance.now() - a;
    let checks = []; try { checks = TC.runChecks(stream).results; } catch (e) { checks = [{ id: 'checks', pass: false, note: e.message }]; }
    const grp = ST.buildTrack(THREE, stream); grp.traverse(o => { if (o.isMesh) { o.castShadow = o.receiveShadow = true; } }); trackStage.content.add(grp); trackStage.scene.add(trackStage.content);
    const bb = new THREE.Box3().setFromObject(grp); let tris = 0; grp.traverse(o => { if (o.isMesh) tris += triCount(o.geometry); });
    trackInfo = { core: TC.CORE_VERSION, recipe: recipe.pieces.map(p => p.id + ' ' + p.type + (p.length ? ' ' + p.length + ' m' : '') + (p.turn ? ' ' + p.turn + '° r' + p.radius : '')), samples: stream.samples.length, ms: +ms.toFixed(1), checks: checks.length, fails: checks.filter(c => c.pass === false).map(c => c.id), tris: Math.round(tris), box: bb, fingerprint: stream.fingerprint || null, widthClass: recipe.defaults && recipe.defaults.widthClass };
    return trackInfo; }
  const renderTrack = (cv, id = 'ueber') => { const bb = trackInfo.box, c = bb.getCenter(new THREE.Vector3()), r = bb.getSize(new THREE.Vector3()).length() / 2;
    if (id === 'fahr') { camera.position.set(0, 1.4, 4); camera.lookAt(0, 1.0, 40); }
    else if (id === 'kante') { camera.position.set(-12, 2.2, 30); camera.lookAt(0, 0, 30); }
    else { const el = THREE.MathUtils.degToRad(40), dir = new THREE.Vector3(-0.6, 0, -0.35).normalize().multiplyScalar(Math.cos(el)).setY(Math.sin(el)); camera.position.copy(c).addScaledVector(dir, r * 3.2); camera.lookAt(c); }
    const fit = FIT.fitShadow(renderer, trackStage.sun, trackStage.lightDir, bb.clone().expandByScalar(2), { pad: 1.05 });
    renderer.info.reset(); trackStage.composer.render(); cv.width = W; cv.height = H; cv.getContext('2d').drawImage(renderer.domElement, 0, 0); return { calls: renderer.info.render.calls, tris: renderer.info.render.triangles }; };

  await setDonor('hex_grass'); info.loadMs = Math.round(performance.now() - t0); onNote('bereit');
  return { info, W, H, VARIANTS, VIEWS, setDonor, setView, renderInto, compareAll, buildTrackPiece, renderTrack,
    setFloorMode(m) { floorMode = m; applyFloor(); }, setFloorT(t) { floorT = t; reUV(); }, get floorT() { return floorT; }, get view() { return view; },
    capabilities: { maxTex: renderer.capabilities.maxTextureSize, renderer: (() => { try { const d = gl.getExtension('WEBGL_debug_renderer_info'); return d ? gl.getParameter(d.UNMASKED_RENDERER_WEBGL) : 'n/a'; } catch (e) { return 'n/a'; } })() } };
}

/* R2C live im eigenen Owner (boot aus hex-archipel.r2c.js am Pin) — optional, eigener WebGL-Kontext */
export async function bootR2C(canvas, labelHost, onNote) { const mod = await importPinned(PIN.r2c, DIR.r2c + 'lab-world/hex-archipel.r2c.js'); return mod.boot(canvas, labelHost, onNote, {}); }
