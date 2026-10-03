/* KFB · O1 Organ-Inseln · organ-islands.v7 (03.10.) — wie v6, Attraktionen neu nach BRIEF_ORGAN_ATTRAKTIONEN.md (v6-Attraktionen G1/C1/E1 = FAIL, bleiben dort):
 *  · E2 Darm: Fahrt durch den Dickdarm als Tunnel-Strecke entlang der gemessenen Colon-Mittellinie (Caecum → Rektum → Anus).
 *  · Tunnel aus vielen Stücken: Ein-/Austritt und Kragen je zusammenhängendem Tunnelzug, nicht je Stück.
 *  · G2 Hirn: Spirale um die Hirnoberfläche + gewundener Tunnel Stirn → Chiasma → Sehrinde. Präfix hang_ = Hangstraße: Schnitt nur 3 Lagen hoch (Schlucht 12).
 *  · Wandmantel: um Tunnel-Schnittkugeln im Organ mindestens 7 m Knetwand (Befund E2: Löcher in der dünnen Darmwand); nur tief im Organ.
 *  · Portal ohne Scherben: bleibt jenseits der Röhre < 6 m Wand, wird die Röhre dorthin geöffnet (Befund G2: Splitter am Tunnelausgang).
 *  · C2 Herz: Fahrt durch die Herzkammern auf dem Weg des Blutes, Kammerpunkte aus gemessenen Gefäßansätzen.
 * KFB · O1 Organ-Inseln · organ-islands.v6 (03.10.) — wie v5, dazu (Georg 03.10.: Harnleiter sticht durch den Track):
 *  · Prüfung Durchdringung über den ganzen Querschnitt: 5 Punkte über Fahrbahn + Bande (Breite aus prm + SIDE_EXTENT 4,32 m) × Unterseite und
 *    Bandenkopf, gegen das Organfeld UND die glatte Harnleiter-Röhre (Abstand zur Mittellinie − RT). Befund: v3–v5 prüften nur die Mittellinie
 *    gegen das Feld mit 1,5 m; der 23 m breite Track lief am Rand durch die Röhre (r 5,6 m), die Zählung blieb 0.
 *  · Attraktion Niere: Varianten (Drehsinn × Rinnen-Lage) werden kompiliert, geprüft und nach Querschnitt-Treffern gewählt.
 * KFB · O1 Organ-Inseln · organ-islands.v5 (03.10.) — wie v4, dazu (Georg 03.10. nachts):
 *  · Tunnellicht: warme Punktlichter ohne Schatten unter dem Scheitel jedes Tunnel-Stücks. Gemessen v4: Fahrbahn innen rgb 9/41/65, gelbe
 *    Randlinie 82/103/36 — drinnen kam nur Himmelslicht an. Track Core führt kein Tunnellicht; das hier ist eigene Naht.
 *  · Harnleiter: glatte Röhre (TubeGeometry, r = RT) über der Feldröhre. Gemessen v4: Feldröhre r 3,5 mm bei Raster 2,5 mm, nach dem Kneten
 *    1,8–2,9 mm um die Mittellinie — Rasterstufen, keine Form. Die Feldröhre bleibt (Hohlkehle, Teilfeld, Durchdringungsprüfung).
 * KFB · O1 Organ-Inseln · organ-islands.v4 (03.10.) — wie v3, dazu (Georg 03.10. abends):
 *  · Tunnel in Knete: das Röhrennetz aus buildTrack wird nicht gezeichnet; die Röhre ist der Schnitt im Knet-Organ selbst, an jedem Portal ein
 *    Knetwulst (Torus) in der Organfarbe. Stück bleibt Track-Core-Tunnel (Checks, Licht).
 *  · Linke Niere: Schlucht statt Tunnel (Schnitt nach oben offen, Stück ohne Tunnel, Präfix schlucht_).
 *  · Niere 95° gekippt: Blase steht etwa auf Nierenhöhe, die Rinne läuft unter den Harnleitern zur Blase.
 *  · Chill&Fun-Hilfen nur als Track-Core-Daten (drive/skin/markings, vom Core vorgesehen): Booster-Zone vor jedem Sprung (markings MAG,
 *    drive assist fx boost), Flug zero_g, Landung magnet_catch, Blasen-Bumper = Landung mit skin buoy + fx bounce (landing_dip ausgenommen).
 *    fx boost ist ein neuer Name für die Laufzeit; bounce, magnet_catch, zero_g stehen im Core-Kommentar.
 * KFB · O1 Organ-Inseln · organ-islands.v3 (03.10.) — wie v2, dazu (Georg 03.10.):
 *  · Harnleiter als Röhre r 3,5 mm entlang der im Bake gemessenen Mittellinie (v2: 2-Zellen-Hülle zerriss beim Kneten), Harnröhre entfällt.
 *  · Herz Knetgrad 2; Lungengefäße nur außerhalb der Herzhülle ausgeschnitten (v2: Löcher in den Vorhöfen).
 *  · Farbe je Ecke aus 7 Rasterproben gemischt (v2: Treppenflecken), Furchendunkel bei Organen höchstens 0,3 (v2: große Mulden schwarz).
 *  · Schnitt nur an den geplanten Tunnel-Stücken; jede andere Berührung zählt als Durchdringung (v2 schnitt überall, die Prüfung war blind).
 *  · Niere um 60° gekippt (Blase nach außen) und als Probe eine Attraktion nur aus Track-Core-Stücken: boot(canvas, { only: 'niere' }).
 * KFB · O1 Organ-Inseln · organ-islands.v2 (02.10.) — Wegwurf der eigenen Straßen, Docks und Platten aus v1 (Georg 02.10.: »keine eigene
 * Straßen und Tracks bauen/erfinden … das muss alles mit unseren KFB tracks, Versatzstücken und Baukasten-Logik gebaut werden«, »alle Organe
 * ohne Bodenfläche … frei schwebende Organe«). v1 bleibt als Stand.
 * Vier frei schwebende Organe (Hirn H0, Herz, Darm, Niere/Harnleiter/Blase) in anatomischer Lage. Verbunden und durchfahren nur vom Track Core v0.12.
 * Kopiert, je Herkunft:
 *  · Strecke: cosmos-route.v1 Z. 24–68 — into/way/mid/headTo, Skydrive (SPIRAL 360/60/45 + MAG 60 + KICKER + AIR + LANDING), Looping
 *    (fahrschule), Hero-Sprung (WIDTH_STEP HERO), Tunnel-Preset gotthard auf dem Inselstück, Heimweg wie BLOCKS.home. Werte unverändert.
 *  · Strecke zeichnen: hex-island.v5 buildBridges Z. 469–492 (paint, buildTrack contact, Tunnel-Material) und buildStrang Z. 456–468.
 *  · Hex-Insel: Kacheln aus hx0-catalog.v1, Unterbau buildBody aus hex-island.v5 Z. 330–360, Maß S = 37,86 (HX0).
 *  · Gelände-Farbe und Wasser: H0 brain-world.v8 paintTerrain / applyWater (Hüllfläche − Wasserstand). Surface Nets: island-grammar.v4.
 *  · Knete K2 und Himmel SKY3 wie hex-island.v5 / env-host.v3.
 * NAHT (eigene Arbeit, eine Stelle): das Organ wird entlang der kompilierten Track-Core-Stützstellen ausgeschnitten (Kugelkette, Radius 13 m
 * um 4 m über dem Deck), damit der Tunnel aus dem Baukasten durch das Organ führt und die Portale offen sind. Die Strecke selbst kommt
 * unverändert aus compileRecipe. Wasser und Bewohner meiden den Schnitt. */
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { hexMetrics, hexToWorld, neighbor, rotDeg } from '../vendor-hex/hex-grid.js';
import * as TC from '../vendor-j15/lab-track/core/track-core.v012.mjs';
import { buildTrack } from '../vendor-j15/lab-track/core/stream-to-three.v5.mjs';
import { softenGeometry } from '../vendor-ra15/lib/clay/clay-soften.v1.js';
import { makeClayRelief } from '../lab-clay/clay-relief.v2.js';
import { makeToolReliefs } from '../lab-clay/clay-relief.v5.js';
import * as C from '../lab-clay/clay-material.v10.js';
import { TOOLMIX } from '../lab-clay/clay-toolmix.v1.js';
import { AXES } from '../lab-hex/cosmos-route.v1.js';
import { createEnvironmentHost } from '../lab-sky/env-host.v3.js';
import * as CF from '../lab-sky/cloud-family.v1.js';

const here = f => new URL(f, import.meta.url).href;
const PIN = '2ff8b350beefe02912bbff6eeeead3882e583d08';
const RAWK = p => 'https://raw.githubusercontent.com/georg-doc/kayfabizarro/' + PIN + '/' + p.split('/').map(encodeURIComponent).join('/');
const rawC = (c, p) => `https://raw.githubusercontent.com/georg-doc/kayfabizarro/${c}/${p.split('/').map(encodeURIComponent).join('/')}`;
const MS = 'media/3D_Assets/KayKit_Mystery_Series6/', ANIM = 'media/3D_Assets/KayKit_Character_Animations_1.1/Animations/gltf/';
const DEG = Math.PI / 180, r4 = x => Math.round(x * 1e4) / 1e4, clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const hash = n => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
const smin = (a, b, k) => { const h = clamp(0.5 + 0.5 * (b - a) / k, 0, 1); return b + (a - b) * h - k * h * (1 - h); };
const smax = (a, b, k) => -smin(-a, -b, k);
const V3 = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
const tick = () => new Promise(r => { if (document.visibilityState === 'visible') setTimeout(r, 0); else { const c = new MessageChannel(); c.port1.onmessage = () => r(); c.port2.postMessage(0); } });

const ROAD_HW = 3.6, ROAD_LIFT = 1.0125, FIG_K = 0.47 / 0.25 * 2.25;   // Weltmaß: H0 HW 0,4 u = 1,6 mm × 2,25; Deck +0,45 mm × 2,25; Figur in m je Modelleinheit
const S_HEX = 37.86, RING = 1500, DOCK_L = 120, RUN = 60;
const TUN = { color: '#ffc27a', intensity: 260 };   // v5 Tunnellicht, an der Fahrbahn im Tunnel abgeglichen
const WORLD = { roadStreet: '#566680', strang: '#ef5a22', trunk: '#8a5a3a', hill: '#7b5bb8' };   // WORLDS.canyon (hex-island.v5)
const RC = { track: '#5d6f86', line: '#e2d0bc', water: '#5983ac', pad: '#e2d0bc' };   // H0 C

const LOBE = {}; [[1, 2, 3, 4, 5, 6, 7], 'frontal', [8, 9, 10, 11, 12, 13, 14, 15], 'parietal', [16, 17], 'occipital', [18, 19, 20, 21, 22, 23, 24, 25, 26, 27], 'temporal', [28, 29, 30, 31], 'limbic', [32, 33, 34, 35], 'insula', [40], 'cerebellum', [41, 42, 43, 44, 45, 46], 'stem']
  .forEach((v, i, a) => { if (i % 2 === 0) v.forEach(id => { LOBE[id] = a[i + 1]; }); });
const HIRN = { frontal: '#eaa39c', parietal: '#e79e98', occipital: '#e59b9a', temporal: '#e8a49a', limbic: '#e3a4a0', insula: '#e6a698', cerebellum: '#e4999a', stem: '#e7b3a3' };   // PALETTES.hirn (H0)

/* Inseln. face = lokale Richtung, die zur Hex-Insel zeigt. base = Grundlage (Darm: vorn nach oben, Niere: hinten nach oben). */
export const ISLANDS = [
  { id: 'hirn', short: 'Hirn', name: 'Hirnwelt H0', loci: 'Ratio · Wissen · Erinnerung', mm: 2.25, ang: 72, y: 165, knet: 2, hullMM: 5, water: 2.2, axis: [0, 0, 1], view: [-1, 0.2, 0.25],
    note: 'H0-Bake (BodyParts3D, 44 Netze), frei schwebend, der Hirnstamm hängt als Stiel. Track-Core-Tunnel von der Stirn bis zum Hinterhaupt.', deep: '#b8686d',
    cast: [['Lorekeeper', MS + '1 - July 2025 - Lorekeeper/Lorekeeper.glb', 'Medium'], ['Witch', MS + '5 - November 2024 - Witch/characters/Witch.glb', 'Medium'], ['Goth Girl', MS + 'GothGirl/characters/GothGirl.glb', 'Medium']] },
  { id: 'herz', short: 'Herz', name: 'Herz-Insel', loci: 'Gefühl · Puls · Bindung', mm: 2.25, ang: 144, y: 105, knet: 2, deepMax: 0.3, hullMM: 4.5, water: 1.4, axis: [1, 0, 0], view: [0.3, 0.15, 1],
    note: 'Herzwand, Aorta und Hohlvenen (M0, BodyParts3D), frei schwebend. Kranzgefäße als Rinnen mit Wasser, Lungengefäße weggelassen. Track-Core-Tunnel quer durch die Kammern.',
    deep: '#8e3443', pal: { 1: '#d4605a', 2: '#ef5a22', 3: '#ef5a22', 4: '#ef5a22', 5: '#5983ac', 6: '#5983ac', 7: '#8b68c7', 8: '#eaa39c', 9: '#f2b632', 10: '#f2b632', 11: '#f2b632', 12: '#f2b632' },
    cast: [['Cleric', MS + '3 - September 2025 - Cleric/Cleric.glb', 'Medium'], ['Clown', MS + '11 - May 2024 - Clown/characters/Clown.glb', 'Medium'], ['Farmer A', MS + '12 - June 2026 - Farmers/Farmer_A.glb', 'Medium']] },
  { id: 'darm', short: 'Darm', name: 'Darm-Insel', loci: 'Bauchgefühl · Verarbeitung · Umwandlung', mm: 1.6, ang: 216, y: 70, knet: 2, deepMax: 0.15, hullMM: 6, water: 2.0, axis: [1, 0, 0], view: [0.3, 0.1, 1],
    note: 'Dünndarm, Dickdarm, Rektum, Appendix (BodyParts3D), frei schwebend in anatomischer Lage. Track-Core-Tunnel quer durch das Darmpaket.',
    deep: '#9b5b4c', pal: { 1: '#f2b632', 2: '#f0a27c', 3: '#e8a49a', 4: '#cdc666', 5: '#a582d9', 6: '#ef5a22' },
    cast: [['Orc Brute', MS + '2 - August 2025 - Orc Brute/OrcBrute.glb', 'Large'], ['Caveman', MS + '8 - February 2025 - Caveman/characters/Caveman.glb', 'Medium'], ['Monstrosity', MS + '4 - October 2025 - Monstrosity/Monstrosity.glb', 'Large']] },
  { id: 'niere', short: 'Niere', name: 'Nieren-Insel', loci: 'Filtern · Klären · Abfließen', mm: 1.6, ang: 288, y: 300, knet: 1, hullMM: 6, water: 1.6, axis: [1, 0, 0], view: [0.2, 0.1, 1], deepMax: 0.3, tilt: 95,
    note: 'Nieren, Harnleiter, Blase (BodyParts3D), frei schwebend, um 95° gekippt, Blase etwa auf Nierenhöhe und nach außen. Harnleiter als Röhren entlang der gemessenen Mittellinie. Track-Core-Tunnel durch beide Nieren.',
    deep: '#6e5a3a', pal: { 1: '#c4675d', 2: '#c4675d', 3: '#e8a49a', 4: '#e8a49a', 5: '#eaa39c', 6: '#e8a49a' },
    cast: [['Toy Soldier', MS + '6 - December 2025 - Toy Soldier/ToySoldier.glb', 'Medium'], ['Farmer B', MS + '12 - June 2026 - Farmers/Farmer_B.glb', 'Medium'], ['Ultra Turbo Hero Man', MS + 'UltraTurboHeroMan/characters/UltraTurboHeroMan.glb', 'Medium']] }
];
const CUT_R = 15, CUT_UP = 4;   // v7: 13 → 15 m (Befund E2: Knetwand der Röhre schnitt den Bandenstrang, Reichweite am Bandenkopf nur 0,9 m)   // NAHT: Schnitt um die Track-Core-Stützstellen (m)

/* ---------- Raster ---------- */
function samp(G, x, y, z) {
  const { V, nx, ny, nz, h, o } = G;
  let fx = (x - o[0]) / h, fy = (y - o[1]) / h, fz = (z - o[2]) / h;
  fx = fx < 0 ? 0 : fx > nx - 1.001 ? nx - 1.001 : fx; fy = fy < 0 ? 0 : fy > ny - 1.001 ? ny - 1.001 : fy; fz = fz < 0 ? 0 : fz > nz - 1.001 ? nz - 1.001 : fz;
  const i = fx | 0, j = fy | 0, k = fz | 0, u = fx - i, v = fy - j, w = fz - k, sy = nx, sz = nx * ny, q = i + nx * (j + ny * k);
  const c00 = V[q] + (V[q + 1] - V[q]) * u, c10 = V[q + sy] + (V[q + sy + 1] - V[q + sy]) * u, c01 = V[q + sz] + (V[q + sz + 1] - V[q + sz]) * u, c11 = V[q + sy + sz] + (V[q + sy + sz + 1] - V[q + sy + sz]) * u;
  return (c00 + (c10 - c00) * v) * (1 - w) + (c01 + (c11 - c01) * v) * w;
}
function grad(G, x, y, z, out = V3()) { const e = G.h * 0.5; return out.set(samp(G, x + e, y, z) - samp(G, x - e, y, z), samp(G, x, y + e, z) - samp(G, x, y - e, z), samp(G, x, y, z + e) - samp(G, x, y, z - e)).multiplyScalar(1 / (2 * e)); }
function blurG(G, r, passes) {
  if (!r || !passes) return G;
  const { nx, ny, nz } = G; let A = Float32Array.from(G.V), B = new Float32Array(A.length); const w = 1 / (2 * r + 1);
  const line = (src, dst, o, st, n) => { let s = 0; for (let t = -r; t <= r; t++) s += src[o + clamp(t, 0, n - 1) * st];
    for (let t = 0; t < n; t++) { dst[o + t * st] = s * w; s += src[o + Math.min(n - 1, t + r + 1) * st] - src[o + Math.max(0, t - r) * st]; } };
  for (let p = 0; p < passes; p++) {
    for (let k = 0; k < nz; k++) for (let j = 0; j < ny; j++) line(A, B, nx * (j + ny * k), 1, nx); [A, B] = [B, A];
    for (let k = 0; k < nz; k++) for (let i = 0; i < nx; i++) line(A, B, i + nx * ny * k, nx, ny); [A, B] = [B, A];
    for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) line(A, B, i + nx * j, nx * ny, nz); [A, B] = [B, A];
  }
  return { ...G, V: A };
}
function carve(G, cuts, rC) {   // v7: Schnittkugeln im Light-Raster erneut setzen (Befund C2 Light: Minimum-Mischung schloss die Röhre an den Banden)
  const { V, nx, ny, nz, h, o } = G; for (const c of cuts) { const r = c.r || rC, rr = Math.ceil(r / h) + 1, ci = Math.round((c.x - o[0]) / h), cj = Math.round((c.y - o[1]) / h), ck = Math.round((c.z - o[2]) / h);
    for (let k = Math.max(0, ck - rr); k <= Math.min(nz - 1, ck + rr); k++) for (let j = Math.max(0, cj - rr); j <= Math.min(ny - 1, cj + rr); j++) for (let i = Math.max(0, ci - rr); i <= Math.min(nx - 1, ci + rr); i++) {
      const v = r - Math.hypot(o[0] + i * h - c.x, o[1] + j * h - c.y, o[2] + k * h - c.z), q = i + nx * (j + ny * k); if (v > V[q]) V[q] = v; } } return G; }
function down2(G, keep = 0) {   // keep > 0: Anteil Minimum statt Mittel (v7: dünne Wände an Portalen bleiben im Light-Raster stehen)
  const { V, nx, ny, nz, h, o } = G, mx = Math.ceil(nx / 2), my = Math.ceil(ny / 2), mz = Math.ceil(nz / 2), W = new Float32Array(mx * my * mz);
  for (let k = 0; k < mz; k++) for (let j = 0; j < my; j++) for (let i = 0; i < mx; i++) { let s = 0, m = 1e9;
    for (let c = 0; c < 8; c++) { const v = V[Math.min(nx - 1, 2 * i + (c & 1)) + nx * (Math.min(ny - 1, 2 * j + ((c >> 1) & 1)) + ny * Math.min(nz - 1, 2 * k + (c >> 2)))]; s += v; if (v < m) m = v; }
    W[i + mx * (j + my * k)] = keep ? (1 - keep) * s / 8 + keep * m : s / 8; }
  return { V: W, nx: mx, ny: my, nz: mz, h: h * 2, o: o.map(x => x + h / 2) };
}
const shiftG = (G, d) => { const V = new Float32Array(G.V.length); for (let i = 0; i < V.length; i++) V[i] = G.V[i] + d; return { ...G, V }; };
function closeBorder(G) {   // Rand immer außen, damit die Fläche geschlossen bleibt
  const { V, nx, ny, nz, h } = G;
  for (let k = 0; k < nz; k++) for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) { const d = Math.min(i, j, k, nx - 1 - i, ny - 1 - j, nz - 1 - k) * h, q = i + nx * (j + ny * k); V[q] = Math.max(V[q], 1.5 * h - d); }
  return G;
}

/* Surface Nets — island-grammar.v4 (I4) surfaceNets, Werte aus dem Raster statt aus f(x,y,z), Projektion/Normale trilinear */
function surfaceNets(G, proj = 1) {
  const { V, nx, ny, nz, h } = G, [x0, y0, z0] = G.o, id = (i, j, k) => i + nx * (j + ny * k), f = (x, y, z) => samp(G, x, y, z);
  const cx = nx - 1, cy = ny - 1, cz = nz - 1, CI = new Int32Array(cx * cy * cz).fill(-1), cid = (i, j, k) => i + cx * (j + cy * k);
  const OFF = [[0, 0, 0], [1, 0, 0], [0, 1, 0], [1, 1, 0], [0, 0, 1], [1, 0, 1], [0, 1, 1], [1, 1, 1]], EDGES = [];
  for (let b = 0; b < 8; b++) for (const bit of [1, 2, 4]) if (!(b & bit)) EDGES.push([b, b | bit]);
  const val = new Float32Array(8), pos = [];
  for (let k = 0; k < cz; k++) for (let j = 0; j < cy; j++) for (let i = 0; i < cx; i++) {
    let m = 0;
    for (let b = 0; b < 8; b++) { const o = OFF[b], v = V[id(i + o[0], j + o[1], k + o[2])]; val[b] = v; if (v < 0) m |= 1 << b; }
    if (m === 0 || m === 255) continue;
    let sx = 0, sy = 0, sz = 0, n = 0;
    for (const [a, b] of EDGES) { const va = val[a], vb = val[b]; if ((va < 0) === (vb < 0)) continue;
      const t = va / (va - vb), A = OFF[a], B = OFF[b]; sx += A[0] + (B[0] - A[0]) * t; sy += A[1] + (B[1] - A[1]) * t; sz += A[2] + (B[2] - A[2]) * t; n++; }
    CI[cid(i, j, k)] = pos.length / 3; pos.push(x0 + (i + sx / n) * h, y0 + (j + sy / n) * h, z0 + (k + sz / n) * h);
  }
  const quads = [], q = (a, b, c, d) => { if (a >= 0 && b >= 0 && c >= 0 && d >= 0) quads.push(a, b, c, d); };
  for (let k = 1; k < cz; k++) for (let j = 1; j < cy; j++) for (let i = 0; i < cx; i++)
    if ((V[id(i, j, k)] < 0) !== (V[id(i + 1, j, k)] < 0)) q(CI[cid(i, j - 1, k - 1)], CI[cid(i, j, k - 1)], CI[cid(i, j, k)], CI[cid(i, j - 1, k)]);
  for (let k = 1; k < cz; k++) for (let j = 0; j < cy; j++) for (let i = 1; i < cx; i++)
    if ((V[id(i, j, k)] < 0) !== (V[id(i, j + 1, k)] < 0)) q(CI[cid(i - 1, j, k - 1)], CI[cid(i, j, k - 1)], CI[cid(i, j, k)], CI[cid(i - 1, j, k)]);
  for (let k = 0; k < cz; k++) for (let j = 1; j < cy; j++) for (let i = 1; i < cx; i++)
    if ((V[id(i, j, k)] < 0) !== (V[id(i, j, k + 1)] < 0)) q(CI[cid(i - 1, j - 1, k)], CI[cid(i, j - 1, k)], CI[cid(i, j, k)], CI[cid(i - 1, j, k)]);
  const P = new Float32Array(pos), Nn = new Float32Array(pos.length), e = h * 0.35;
  for (let v = 0; v < P.length; v += 3) {
    let x = P[v], y = P[v + 1], z = P[v + 2], gx = 0, gy = 1, gz = 0;
    for (let it = 0; it <= proj; it++) {
      gx = (f(x + e, y, z) - f(x - e, y, z)) / (2 * e); gy = (f(x, y + e, z) - f(x, y - e, z)) / (2 * e); gz = (f(x, y, z + e) - f(x, y, z - e)) / (2 * e);
      if (it === proj) break;
      const d = f(x, y, z), g2 = gx * gx + gy * gy + gz * gz || 1; let s = d / g2; const sl = Math.abs(s) * Math.sqrt(g2);
      if (sl > h * 0.7) s *= (h * 0.7) / sl; x -= gx * s; y -= gy * s; z -= gz * s;
    }
    const gl = Math.hypot(gx, gy, gz) || 1; P[v] = x; P[v + 1] = y; P[v + 2] = z; Nn[v] = gx / gl; Nn[v + 1] = gy / gl; Nn[v + 2] = gz / gl;
  }
  const idx = [], d2 = (a, b) => { const dx = P[a * 3] - P[b * 3], dy = P[a * 3 + 1] - P[b * 3 + 1], dz = P[a * 3 + 2] - P[b * 3 + 2]; return dx * dx + dy * dy + dz * dz; };
  for (let t = 0; t < quads.length; t += 4) {
    let a = quads[t], b = quads[t + 1], c = quads[t + 2], d = quads[t + 3];
    const ux = P[b * 3] - P[a * 3], uy = P[b * 3 + 1] - P[a * 3 + 1], uz = P[b * 3 + 2] - P[a * 3 + 2], vx = P[c * 3] - P[a * 3], vy = P[c * 3 + 1] - P[a * 3 + 1], vz = P[c * 3 + 2] - P[a * 3 + 2];
    const tx = uy * vz - uz * vy, ty = uz * vx - ux * vz, tz = ux * vy - uy * vx;
    const nx_ = Nn[a * 3] + Nn[b * 3] + Nn[c * 3] + Nn[d * 3], ny_ = Nn[a * 3 + 1] + Nn[b * 3 + 1] + Nn[c * 3 + 1] + Nn[d * 3 + 1], nz_ = Nn[a * 3 + 2] + Nn[b * 3 + 2] + Nn[c * 3 + 2] + Nn[d * 3 + 2];
    if (tx * nx_ + ty * ny_ + tz * nz_ < 0) { const tmp = b; b = d; d = tmp; }
    if (d2(a, c) < d2(b, d)) idx.push(a, b, c, a, c, d); else idx.push(a, b, d, b, c, d);
  }
  return { P, N: Nn, idx };
}
const toGeo = (P, N, idx) => { let bad = 0; const badV = []; for (let i = 0; i < N.length; i += 3) { const l = Math.hypot(N[i], N[i + 1], N[i + 2]); if (!(l > 1e-6) || !isFinite(l)) { N[i] = N[i + 1] = N[i + 2] = 0; badV.push(i / 3); bad++; } else if (Math.abs(l - 1) > 1e-3) { N[i] /= l; N[i + 1] /= l; N[i + 2] /= l; } if (!isFinite(P[i] + P[i + 1] + P[i + 2])) { P[i] = P[i + 1] = P[i + 2] = 0; bad++; } }   /* v7 Befund C2: Splitter am SVC-Portal ohne Raycast-Treffer = Ecke mit Normale 0/NaN, im Shader verschoben */
  if (badV.length) { /* v7 Befund C2 Portal 2: Ecken mit Feldgradient 0 (abgeflacht durch die Vorzeichen-Sperre) bekamen (0,1,0) → wie Himmel beleuchtet, lasen als Loch. Jetzt Flächennormale der anliegenden Dreiecke. */
    const isBad = new Uint8Array(N.length / 3); badV.forEach(v => isBad[v] = 1);
    for (let t = 0; t < idx.length; t += 3) { const a = idx[t], b = idx[t + 1], c = idx[t + 2]; if (!isBad[a] && !isBad[b] && !isBad[c]) continue;
      const ux = P[b * 3] - P[a * 3], uy = P[b * 3 + 1] - P[a * 3 + 1], uz = P[b * 3 + 2] - P[a * 3 + 2], vx = P[c * 3] - P[a * 3], vy = P[c * 3 + 1] - P[a * 3 + 1], vz = P[c * 3 + 2] - P[a * 3 + 2], nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
      for (const v of [a, b, c]) if (isBad[v]) { N[v * 3] += nx; N[v * 3 + 1] += ny; N[v * 3 + 2] += nz; } }
    for (const v of badV) { const l = Math.hypot(N[v * 3], N[v * 3 + 1], N[v * 3 + 2]) || 1; N[v * 3] /= l; N[v * 3 + 1] /= l; N[v * 3 + 2] /= l; } }
  if (bad) toGeo.bad = (toGeo.bad || 0) + bad; const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(P, 3)); g.setAttribute('normal', new THREE.BufferAttribute(N, 3));
  g.setIndex(P.length / 3 > 65535 ? new THREE.Uint32BufferAttribute(idx, 1) : new THREE.Uint16BufferAttribute(idx, 1)); return g; };

/* ---------- Felder je Organ ---------- */
const fetchBuf = async u => { const r = await fetch(u); if (!r.ok) throw new Error(u.split('/').pop() + ' ' + r.status); return r.arrayBuffer(); };
async function loadBake(organ) {
  const J = await (await fetch(here('bake/' + organ + '.json'))).json(), [nx, ny, nz] = J.dims, N = nx * ny * nz, F = {};
  for (const [k, f] of Object.entries(J.fields)) { const a = new Int8Array(await fetchBuf(here('bake/' + f.file))), V = new Float32Array(N); for (let i = 0; i < N; i++) V[i] = a[i] * J.unit; F[k] = { V, nx, ny, nz, o: J.origin, h: J.cell }; }
  const reg = new Uint8Array(await fetchBuf(here('bake/' + J.region)));
  const regionAt = (x, y, z) => { const i = clamp(Math.round((x - J.origin[0]) / J.cell), 0, nx - 1), j = clamp(Math.round((y - J.origin[1]) / J.cell), 0, ny - 1), k = clamp(Math.round((z - J.origin[2]) / J.cell), 0, nz - 1); return reg[i + nx * (j + ny * k)]; };
  return { J, F, regionAt };
}
async function brainField(h) {   // H0-Bake unverändert (brain-world.v1.bin), Würfelkugel N = 160
  const N = 160, VV = (N + 1) * (N + 1), NV = 6 * VV, buf = await fetchBuf(here('../lab-brain/brain-world.v1.bin'));
  const R0 = new Float32Array(buf, 0, NV), ID = new Uint8Array(buf, NV * 4, NV);
  const faceAx = f => { const k = f >> 1, s = (f & 1) ? -1 : 1; return [k, s, (k + 1) % 3, (k + 2) % 3]; };
  const dirOf = (f, a, b) => { const [k, s, i, j] = faceAx(f), p = [0, 0, 0]; p[k] = s; p[i] = Math.tan((-1 + 2 * a / N) * Math.PI / 4); p[j] = Math.tan((-1 + 2 * b / N) * Math.PI / 4); const l = Math.hypot(p[0], p[1], p[2]); return [p[0] / l, p[1] / l, p[2] / l]; };
  const locate = (x, y, z) => { const ax = Math.abs(x), ay = Math.abs(y), az = Math.abs(z), k = ax > ay ? (ax > az ? 0 : 2) : (ay > az ? 1 : 2), d = [x, y, z], f = k * 2 + (d[k] < 0 ? 1 : 0), [, s, i, j] = faceAx(f), dd = s * d[k];
    return [f, (Math.atan(d[i] / dd) * 4 / Math.PI + 1) / 2 * N, (Math.atan(d[j] / dd) * 4 / Math.PI + 1) / 2 * N]; };
  const gi = (f, a, b) => f * VV + b * (N + 1) + a;
  const Rof = (x, y, z) => { const [f, gx, gy] = locate(x, y, z), a0 = clamp(Math.floor(gx), 0, N - 1), b0 = clamp(Math.floor(gy), 0, N - 1), fx = clamp(gx - a0, 0, 1), fy = clamp(gy - b0, 0, 1);
    return (R0[gi(f, a0, b0)] * (1 - fx) + R0[gi(f, a0 + 1, b0)] * fx) * (1 - fy) + (R0[gi(f, a0, b0 + 1)] * (1 - fx) + R0[gi(f, a0 + 1, b0 + 1)] * fx) * fy; };
  const regionAt = (x, y, z) => { const [f, gx, gy] = locate(x, y, z), a = Math.round(gx), b = Math.round(gy);
    for (let r = 0; r < 5; r++) for (let da = -r; da <= r; da++) for (let db = -r; db <= r; db++) { const v = ID[gi(f, clamp(a + da, 0, N), clamp(b + db, 0, N))]; if (v) return v; } return 41; };
  const lo = [1e9, 1e9, 1e9], hi = [-1e9, -1e9, -1e9];
  for (let f = 0; f < 6; f++) for (let b = 0; b <= N; b += 2) for (let a = 0; a <= N; a += 2) { const d = dirOf(f, a, b), R = R0[gi(f, a, b)]; for (let q = 0; q < 3; q++) { lo[q] = Math.min(lo[q], d[q] * R); hi[q] = Math.max(hi[q], d[q] * R); } }
  const o = lo.map(x => Math.floor((x - 6) / h) * h), nx = Math.ceil((hi[0] + 6 - o[0]) / h) + 1, ny = Math.ceil((hi[1] + 6 - o[1]) / h) + 1, nz = Math.ceil((hi[2] + 6 - o[2]) / h) + 1, V = new Float32Array(nx * ny * nz);
  for (let k = 0; k < nz; k++) { const z = o[2] + k * h; for (let j = 0; j < ny; j++) { const y = o[1] + j * h; for (let i = 0; i < nx; i++) { const x = o[0] + i * h, r = Math.hypot(x, y, z); V[i + nx * (j + ny * k)] = r < 1e-3 ? -60 : r - Rof(x, y, z); } } }
  return { G: { V, nx, ny, nz, o, h }, regionAt, src: 'lab-brain/brain-world.v1.bin (H0)' };
}
async function organField(spec) {
  if (spec.id === 'hirn') return brainField(1.25);
  const B = await loadBake(spec.id), J = B.J;
  if (spec.id === 'herz') {   // Kranzgefäße als Rinne: 1,2 mm um das Gefäß aus der Wand genommen (weich)
    const W = B.F.wand, K = B.F.kor, Pm = B.F.pulm, V = new Float32Array(W.V.length), Wb = blurG(W, Math.round(6 / W.h), 3);   // Lungengefäße schließen die Wand; ausgeschnitten nur, wo sie aus der Herzhülle ragen
    for (let i = 0; i < V.length; i++) { const f = smax(W.V[i], -(K.V[i] - 1.2), 1.0); V[i] = Wb.V[i] > -2 ? smax(f, -(Pm.V[i] + 0.8), 2.0) : f; }   // Befund 03.10.: bei +2 blieben Gefäßstümpfe frei schwebend stehen; die Öffnungen vorn bleiben auch dann → sie kommen nicht vom Schnitt (Sinus transversus zwischen Gefäßen und Vorhöfen)
    return { G: { ...W, V }, regionAt: B.regionAt, src: 'lab-organ/bake/herz.* (aus lab-med/heart-bp3d.v2)', J };
  }
  if (spec.id === 'darm') return { G: { ...B.F.all, V: Float32Array.from(B.F.all.V) }, regionAt: B.regionAt, src: 'lab-organ/bake/darm.*', J };
  /* Niere: frei schwebend, Niere ∪ Harnleiter-Röhre ∪ Blase (weich vereinigt). Röhre r 3,5 mm um die Mittellinie aus dem Bake (eine Stützstelle je Scheibe). */
  const Gn = B.F.niere, Gb = B.F.blase, { nx, ny, nz, h, o } = Gn, V = new Float32Array(Gn.V.length), RT = 3.5;
  const smooth = L => { let A = L; for (let pass = 0; pass < 4; pass++) A = A.map((p, i) => { if (i < 1 || i > A.length - 2) return p; const q = V3(); let n = 0; for (let d = -4; d <= 4; d++) { const k = clamp(i + d, 0, A.length - 1); q.add(A[k]); n++; } return q.multiplyScalar(1 / n); }); return A; };
  const lines = [J.ureterLines.right, J.ureterLines.left].map(L => smooth(L.map(p => V3(...p))));   // v4c: geglättet, Abgang als Bogen
  const segsAt = lines.map(L => { const m = new Map(); L.forEach((p, i) => { if (i + 1 < L.length) { const j = Math.round((p.y - o[1]) / h); for (let d = -3; d <= 3; d++) { const k = j + d; if (!m.has(k)) m.set(k, []); m.get(k).push(i); } } }); return m; });
  const tubeD = (x, y, z, j) => { let m = 1e9; lines.forEach((L, li) => { const ss = segsAt[li].get(j); if (!ss) return; for (const i of ss) { const a = L[i], b = L[i + 1], dx = b.x - a.x, dy = b.y - a.y, dz = b.z - a.z, t = clamp(((x - a.x) * dx + (y - a.y) * dy + (z - a.z) * dz) / (dx * dx + dy * dy + dz * dz || 1), 0, 1);
    m = Math.min(m, Math.hypot(x - a.x - dx * t, y - a.y - dy * t, z - a.z - dz * t)); } }); return m - RT; };
  for (let k = 0; k < nz; k++) { const z = o[2] + k * h; for (let j = 0; j < ny; j++) { const y = o[1] + j * h; for (let i = 0; i < nx; i++) { const q = i + nx * (j + ny * k); V[q] = smin(smin(Gn.V[q], tubeD(o[0] + i * h, y, z, j), 9), Gb.V[q], 6);   /* v4c: Hohlkehle 9 mm am Abgang */ } } }
  const cen = (G, test) => { const sm = [0, 0, 0, 0]; for (let k = 0; k < nz; k++) for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) { const q = i + nx * (j + ny * k); if (G.V[q] < 0 && test(o[0] + i * h, o[1] + j * h, o[2] + k * h)) { sm[0] += o[0] + i * h; sm[1] += o[1] + j * h; sm[2] += o[2] + k * h; sm[3]++; } } return sm.slice(0, 3).map(v => v / sm[3]); };
  const KR = cen(Gn, (x, y, z) => B.regionAt(x, y, z) === 1), KL = cen(Gn, (x, y, z) => B.regionAt(x, y, z) === 2), BL = cen(Gb, () => true);
  let rB = 0; for (let k = 0; k < nz; k++) for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) if (Gb.V[i + nx * (j + ny * k)] < 0) rB = Math.max(rB, Math.hypot(o[0] + i * h - BL[0], o[1] + j * h - BL[1], o[2] + k * h - BL[2]));
  const regionAt = (x, y, z) => { const dn = samp(Gn, x, y, z), db = samp(Gb, x, y, z), dt = tubeD(x, y, z, clamp(Math.round((y - o[1]) / h), 0, ny - 1)); if (dn <= db && dn <= dt) { const r = B.regionAt(x, y, z); return r === 1 || r === 2 ? r : ((x - KR[0]) ** 2 + (y - KR[1]) ** 2 + (z - KR[2]) ** 2 < (x - KL[0]) ** 2 + (y - KL[1]) ** 2 + (z - KL[2]) ** 2 ? 1 : 2); } return db <= dt ? 5 : 3; };   // v4c: nächstes Teilfeld; im Nierenfeld nur Niere (Befund: Harnleiter-Netz reicht ins Nierenbecken → helle Rechtecke an der Schlucht)
  return { G: { ...Gn, V }, regionAt, src: 'lab-organ/bake/niere.* (Harnleiter als Röhre)', J, lines, RT, measured: { KR: KR.map(r4), KL: KL.map(r4), BL: BL.map(r4), rBlase: r4(rB) }, through: [KR, KL], parts: { Gn, Gb, KR: V3(...KR), KL: V3(...KL), BL: V3(...BL), rB } };
}

/* v7 Colon-Mittellinie (gemessen): Zellen Region 4 (Colon) nach Winkel um ihren Schwerpunkt in der Frontalebene (x, y), ab dem Caecum
   (−130°) im Uhrzeigersinn bis zum Sigmoid, dann Rektum (5) nach Höhe y. Geglättet, auf 4 mm gleichmäßig. Lage: im Kegel 35° um anterior die Richtung
   »oben« mit der kleinsten Höchststeigung entlang der Linie. */
function colonLine(FD) {
  const G = FD.G, h = G.h, C4 = [], C5 = [];
  for (let k = 0; k < G.nz; k++) for (let j = 0; j < G.ny; j++) for (let i = 0; i < G.nx; i++) { if (G.V[i + G.nx * (j + G.ny * k)] >= 0) continue; const x = G.o[0] + i * h, y = G.o[1] + j * h, z = G.o[2] + k * h, r = FD.regionAt(x, y, z); if (r === 4) C4.push([x, y, z]); else if (r === 5) C5.push([x, y, z]); }
  const cen = A => { const c = [0, 0, 0]; A.forEach(p => { c[0] += p[0] / A.length; c[1] += p[1] / A.length; c[2] += p[2] / A.length; }); return c; };
  const cc = cen(C4), bins = new Map(), BW = 6;
  for (const p of C4) { const a = Math.atan2(p[1] - cc[1], p[0] - cc[0]) / DEG, t = ((((-130 - a) % 360) + 360) % 360), b = Math.floor(t / BW); if (!bins.has(b)) bins.set(b, []); bins.get(b).push(p); }
  let P = []; for (const b of [...bins.keys()].sort((x, y) => x - y)) { const B = bins.get(b); if (B.length >= 60 && b * BW <= 335) P.push(cen(B)); }
  const top5 = Math.max(...C5.map(p => p[1])), rb = new Map(); for (const p of C5) { const b = Math.floor((top5 - p[1]) / 8); if (!rb.has(b)) rb.set(b, []); rb.get(b).push(p); }
  for (const b of [...rb.keys()].sort((x, y) => x - y)) if (rb.get(b).length > 40) P.push(cen(rb.get(b)));
  for (let pass = 0; pass < 3; pass++) P = P.map((p, i) => i === 0 || i === P.length - 1 ? p : p.map((v, k) => (P[i - 1][k] + 2 * v + P[i + 1][k]) / 4));
  let pts = [V3(...P[0])]; for (let i = 1; i < P.length; i++) { const a = V3(...P[i - 1]), b = V3(...P[i]), n = Math.max(1, Math.round(a.distanceTo(b) / 4)); for (let m = 1; m <= n; m++) pts.push(a.clone().lerp(b, m / n)); }
  for (let pass = 0; pass < 4; pass++) pts = pts.map((p, i) => { if (i < 2 || i > pts.length - 3) return p; const q = V3(); for (let d = -2; d <= 2; d++) q.add(pts[i + d]); return q.multiplyScalar(0.2); });
  const gv = V3(); for (let it = 0; it < 6; it++) { pts = pts.map((p, i) => { const t = pts[Math.min(pts.length - 1, i + 2)].clone().sub(pts[Math.max(0, i - 2)]).normalize(); grad(G, p.x, p.y, p.z, gv); gv.addScaledVector(t, -gv.dot(t)); return p.clone().addScaledVector(gv, -0.8); });   // auf die Mittelachse: quer zur Linie gegen den Feldgradienten
    pts = pts.map((p, i) => i < 1 || i > pts.length - 2 ? p : pts[i - 1].clone().add(p).add(p).add(pts[i + 1]).multiplyScalar(0.25)); }
  const ev = u => { let mg = 0; for (let i = 3; i < pts.length - 3; i++) { const d = pts[i + 3].clone().sub(pts[i - 3]), dh = d.dot(u), hz = Math.sqrt(Math.max(1e-9, d.lengthSq() - dh * dh)); mg = Math.max(mg, Math.abs(dh / hz)); } return mg; };
  let best = { u: V3(0, 0, 1), mg: ev(V3(0, 0, 1)) };
  for (let th = 5; th <= 35; th += 5) for (let ph = 0; ph < 360; ph += 15) { const u = V3(Math.sin(th * DEG) * Math.cos(ph * DEG), Math.sin(th * DEG) * Math.sin(ph * DEG), Math.cos(th * DEG)), mg = ev(u); if (mg < best.mg) best = { u, mg, th, ph }; }
  let len = 0; for (let i = 1; i < pts.length; i++) len += pts[i].distanceTo(pts[i - 1]);
  return { pts, up: best.u, maxGrade: best.mg, th: best.th || 0, ph: best.ph || 0, len, n4: C4.length, n5: C5.length };
}

/* v7 C2 Herz: Kammerpunkte und Blutweg aus den gemessenen Gefäßansätzen (Bake hat nur die Herzwand, Kammern geflutet). Ansatz = Mittel der
   Gefäßzellen mit Nachbar Herzwand. Vorhof R = Mitte SVC-/IVC-Ansatz, Vorhof L = Ansatz Vv. pulmonales, Kammern = zwischen Truncus- bzw. Aortenansatz
   und Herzspitze (weitester Wandpunkt von der Basis), jeder Punkt ins Volumen gezogen (need mm Wand um die Röhre). Lage: Richtung »oben« mit der
   kleinsten Höchststeigung entlang beider Röhren (Aorta ascendens und SVC stehen sonst senkrecht). */
function heartLine(FD, need, o = {}) {
  const G = FD.G, RA_ = (x, y, z) => FD.regionAt(x, y, z), cells = {};
  for (let k = 1; k < G.nz - 1; k++) for (let j = 1; j < G.ny - 1; j++) for (let i = 1; i < G.nx - 1; i++) { const q = i + G.nx * (j + G.ny * k); if (G.V[q] >= 0) continue; const x = G.o[0] + i * G.h, y = G.o[1] + j * G.h, z = G.o[2] + k * G.h, r = RA_(x, y, z); (cells[r] = cells[r] || []).push(V3(x, y, z)); }
  const cen = A => A.reduce((a, p) => a.add(p), V3()).multiplyScalar(1 / A.length), H1 = cen(cells[1]);
  const root = r => { const A = (cells[r] || []).filter(p => [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]].some(d => RA_(p.x + d[0] * G.h, p.y + d[1] * G.h, p.z + d[2] * G.h) === 1)); return A.length ? cen(A) : null; };
  const far = (r, ref) => { const A = [...(cells[r] || [])].sort((a, b) => b.distanceTo(ref) - a.distanceTo(ref)); return A.length ? cen(A.slice(0, Math.max(5, Math.ceil(A.length * 0.06)))) : null; };
  const R = { svc: root(5), ivc: root(6), pa: root(7), pv: root(8), ao: root(2) }, base = cen(Object.values(R).filter(Boolean));
  let apex = H1; for (const p of cells[1]) if (p.distanceTo(base) > apex.distanceTo(base)) apex = p;
  const deepen = p => { const q = p.clone(), g = V3(); for (let it = 0; it < 80 && samp(G, q.x, q.y, q.z) > -need; it++) { grad(G, q.x, q.y, q.z, g); q.addScaledVector(g.normalize(), -G.h * 0.5); } return q; };
  const outAt = (pL, dL) => { const p = pL.clone(); for (let t = 0; t < 160; t += 0.5) { p.copy(pL).addScaledVector(dL, t); if (samp(G, p.x, p.y, p.z) > need * 1.6) return p; } return p; };
  const ctrl = (o = {}) => { const fK = o.fk ?? 0.5, RAp = deepen(R.svc.clone().lerp(R.ivc || R.svc, o.rav ?? 0.5)), LAp = deepen(R.pv); let RVp = deepen(R.pa.clone().lerp(apex, o.fkr ?? fK)), LVp = deepen(R.ao.clone().lerp(apex, fK));
  for (let it = 0; it < 20 && RVp.distanceTo(LVp) < need * 2.6; it++) { const d = RVp.clone().sub(LVp).normalize(); RVp = deepen(RVp.addScaledVector(d, G.h)); LVp = deepen(LVp.addScaledVector(d, -G.h)); }   // Septum: Röhren getrennt halten
  const svcFar = far(5, H1), paC = cen(cells[7].filter(p => p.distanceTo(R.pa) < (o.paR ?? 40))), aoTop = deepen(far(2, H1)), archHi = cells[3] ? cen([...cells[3]].sort((a, b) => b.y - a.y).slice(0, Math.max(5, Math.ceil(cells[3].length * 0.06)))) : aoTop.clone(), arch = deepen(archHi), archEnd = deepen(far(3, aoTop) || arch), pvOut = cen(cells[8]);
  const dSvc = R.svc.clone().sub(svcFar).normalize(), dPa = paC.clone().sub(R.pa).normalize(), dPv = R.pv.clone().sub(pvOut).normalize(), dAr = archEnd.clone().sub(arch).normalize();
  const away = arch.clone().sub(aoTop).normalize().add(arch.clone().sub(R.pa).normalize()).normalize();   /* Befund tunnel_shell: Bogenende lief am Truncus vorbei → Ausfahrt am Bogenscheitel, vom Truncus weg */
  const awayAo = R.pa.clone().sub(arch).normalize(), dPaX = dPa.clone().multiplyScalar(o.paK ?? 0.25).addScaledVector(awayAo, 1 - (o.paK ?? 0.25)).normalize();   /* Befund tunnel_shell r14 × l14: Ausfahrten Truncus und Bogen lagen nebeneinander → Truncus weg vom Bogen (anterior), Bogen entlang der Bogentangente zur Aorta descendens (posterior) */   /* Georg 03.10.: rechter Tunnel endet vor dem Aortenbogen → Ausfahrt aus dem Truncus-Ansatz, von der Aorta weg */
  /* Befund tunnel_shell r14 × l13 (unabhängig vom Maß): der Truncus liegt unter dem Aortenbogen → rechter Tunnel verlässt das Herz schon im
     Ausflusstrakt der rechten Kammer (Infundibulum, halbwegs zum Truncus-Ansatz), nach vorn weg von der linken Kammer. */
  const RVOT = deepen(RVp.clone().lerp(R.pa, o.rvot ?? 0.5)), dRV = RVp.clone().sub(LVp).normalize().addScaledVector(R.pa.clone().sub(RVp).normalize(), 0.5).normalize();
  /* Kehre in der Kammer als Halbkreis (Befund inner_edge_fold »LV 51 m«: Einstrom → Ausstrom knickt an der Spitze mit r ≈ 5 m). Ebene aus Einstrom-
     richtung und Querabstand zum Ausstrom, Scheitel = Kammerpunkt, Radius o.ru (m → mm über need/(CUT_R+4)). */
  const mmPer = (CUT_R + 4) / need, uTurn = (Pin, Pk, Pout) => { const din = Pk.clone().sub(Pin).normalize(), lat = Pout.clone().sub(Pin); lat.addScaledVector(din, -lat.dot(din)); if (lat.length() < 1e-6) return [Pk]; lat.normalize(); const Ru = (o.ru ?? 24) / mmPer, Cu = Pk.clone().addScaledVector(din, -Ru);
    const out = []; for (let k = 0; k <= 6; k++) { const th = Math.PI * k / 6; out.push(Cu.clone().addScaledVector(lat, -Ru * Math.cos(th)).addScaledVector(din, Ru * Math.sin(th))); } return out; };
  const RVs = o.u2 ? uTurn(RAp, RVp, R.pa) : [RVp];
  const c1 = [outAt(R.svc, dSvc.clone().negate()), R.svc, RAp, ...RVs, RVOT, outAt(RVOT, dRV)], dAsc = aoTop.clone().sub(R.ao).normalize();
  const dArX = dAr.clone().addScaledVector(V3(0, 1, 0).applyQuaternion(new THREE.Quaternion()), 0).normalize();
  const dLine = arch.clone().sub(R.ao).normalize(), dArL = dArX.clone().lerp(dLine, o.ex ?? 0.6).normalize();   /* Befund fold l13: Ausfahrt der Bogentangente nach zu eng → Richtung zwischen Bogentangente und Linie Aortenwurzel → Bogen */
  const LVs = o.u2 ? uTurn(LAp, LVp, R.ao) : [LVp];   /* Variante u2: Einstrom- und Ausstromseite der linken Kammer getrennt → weite Kehre statt Knick an der Spitze */
  const c2 = o.arch ? [outAt(R.pv, dPv.clone().negate()), LAp, ...LVs, R.ao, ...(o.noTop ? [] : [aoTop]), arch, outAt(arch, dArL)] : [outAt(R.pv, dPv.clone().negate()), LAp, ...LVs, R.ao, aoTop, outAt(aoTop, dAsc)];   /* Befund inner_edge_fold l13: Bogen enger als die Bahn → Ausfahrt oben aus der Aorta ascendens (Variante arch: durch den Bogen) */
  const lumen = r => { let m = 0; for (const p of cells[r] || []) m = Math.max(m, -samp(G, p.x, p.y, p.z)); return m; };
  return { c1, c2, RAp, RVp, LAp, LVp }; };
  const C0 = ctrl(), S = [C0.c1, C0.c2].map(c => new THREE.CatmullRomCurve3(c, false, 'centripetal').getPoints(160));
  const ev = u => { let mg = 0; for (const P of S) for (let i = 4; i < P.length - 4; i++) { const d = P[i + 4].clone().sub(P[i - 4]), dh = d.dot(u), hz = Math.sqrt(Math.max(1e-9, d.lengthSq() - dh * dh)); mg = Math.max(mg, Math.abs(dh / hz)); } return mg; };
  let best = { u: V3(0, 1, 0), mg: ev(V3(0, 1, 0)) }; for (let th = 0; th <= 180; th += 10) for (let ph = 0; ph < 360; ph += 15) { const u = V3(Math.sin(th * DEG) * Math.cos(ph * DEG), Math.cos(th * DEG), Math.sin(th * DEG) * Math.sin(ph * DEG)), mg = ev(u); if (mg < best.mg) best = { u, mg }; if (th === 0) break; }
  return { ctrl, c1: C0.c1, c2: C0.c2, up: best.u, maxGrade: best.mg, R, apex, H1, RAp: C0.RAp, RVp: C0.RVp, LAp: C0.LAp, LVp: C0.LVp, cells, lumen: (() => { const lu = r => { let m = 0; for (const p of cells[r] || []) m = Math.max(m, -samp(G, p.x, p.y, p.z)); return m; }; return { svc: lu(5), pa: lu(7), pv: lu(8), ao: lu(2), arch: lu(3) }; })() };
}

/* v7 Inseln im Netz entfernen (Befund C2 Hero: freies Dreieck am SVC-Portal). Zusammenhang über gemeinsame Ecken; Teile unter minTris oder
   unter frac × größtes Teil fallen weg. Gibt den gefilterten Index und die Zahl der entfernten Teile zurück. */
function dropIslands(idx, nV, minTris = 200, frac = 0.002) {
  const par = new Int32Array(nV); for (let i = 0; i < nV; i++) par[i] = i; const f = x => { while (par[x] !== x) { par[x] = par[par[x]]; x = par[x]; } return x; };
  for (let t = 0; t < idx.length; t += 3) { const a = f(idx[t]), b = f(idx[t + 1]), c = f(idx[t + 2]); par[b] = a; par[f(c)] = a; }
  const cnt = new Map(); for (let t = 0; t < idx.length; t += 3) { const r = f(idx[t]); cnt.set(r, (cnt.get(r) || 0) + 1); }
  const big = Math.max(...cnt.values()), lim = Math.max(minTris, big * frac), out = []; let gone = 0; for (const [, n] of cnt) if (n < lim) gone++;
  for (let t = 0; t < idx.length; t += 3) if (cnt.get(f(idx[t])) >= lim) out.push(idx[t], idx[t + 1], idx[t + 2]);
  return { idx: out, gone };
}

/* v6 Querschnitt-Prüfung (eigene Naht). skip = Stücke, die das Organ durchfahren dürfen. clear in m. */
function crossHits(stream, B, { skip = /^(tunnel|schlucht|hang)_/, clear = 1.0, step = 2 } = {}) {
  const S = stream.samples, J = stream.joints || [], pa = []; for (let k = 0; k < J.length; k++) { const e = k + 1 < J.length ? J[k + 1].index : S.length; for (let i = J[k].index; i < e; i++) pa[i] = J[k].piece; }
  const M = B.root.matrixWorld.clone(), inv = M.clone().invert(), mm = B.spec.mm, FD = B.FD, G = B.G0, v = V3(), Ls = FD.lines || [];
  const lo = G.o, hi = [G.o[0] + G.nx * G.h, G.o[1] + G.ny * G.h, G.o[2] + G.nz * G.h];
  const uD = (x, y, z) => { let m = 1e9; for (const L of Ls) for (let i = 0; i + 1 < L.length; i++) { const a = L[i], b = L[i + 1], dx = b.x - a.x, dy = b.y - a.y, dz = b.z - a.z, t = clamp(((x - a.x) * dx + (y - a.y) * dy + (z - a.z) * dz) / (dx * dx + dy * dy + dz * dz || 1), 0, 1);
    const d = Math.hypot(x - a.x - dx * t, y - a.y - dy * t, z - a.z - dz * t); if (d < m) m = d; } return m - FD.RT; };
  const out = { n: 0, uret: 0, organ: 0, minUret: 1e9, minOrgan: 1e9, byPiece: {} };
  for (let i = 0; i < S.length; i += step) { const pc = pa[i] || ''; if (skip.test(pc)) continue; const q = S[i]; if (!q.R || !q.U) continue;
    const hw = ((q.prm && q.prm.width) || TC.WIDTHS.STANDARD) / 2 + TC.SIDE_EXTENT, pad = (hw + 20) / mm;
    v.set(q.p[0], q.p[1], q.p[2]).applyMatrix4(inv); if (v.x < lo[0] - pad || v.y < lo[1] - pad || v.z < lo[2] - pad || v.x > hi[0] + pad || v.y > hi[1] + pad || v.z > hi[2] + pad) continue;
    let hO = false, hU = false;
    for (const a of [-1, -0.5, 0, 0.5, 1]) for (const hh of [-0.6, TC.PROFILE_DEFAULTS.barrierH]) {
      v.set(q.p[0] + q.R[0] * a * hw + q.U[0] * hh, q.p[1] + q.R[1] * a * hw + q.U[1] * hh, q.p[2] + q.R[2] * a * hw + q.U[2] * hh).applyMatrix4(inv);
      const inG = v.x > lo[0] && v.y > lo[1] && v.z > lo[2] && v.x < hi[0] && v.y < hi[1] && v.z < hi[2];
      if (inG) { const dO = samp(G, v.x, v.y, v.z) * mm; if (dO < out.minOrgan) out.minOrgan = dO; if (dO < clear) hO = true; }
      if (Ls.length) { const du = uD(v.x, v.y, v.z) * mm; if (du < out.minUret) out.minUret = du; if (du < clear) hU = true; } }
    if (hO || hU) { out.n++; if (hU) out.uret++; if (hO) out.organ++; out.byPiece[pc] = (out.byPiece[pc] || 0) + 1; } }
  out.minUret = r4(out.minUret); out.minOrgan = r4(out.minOrgan); return out; }

/* ---------- Bühne ---------- */
export async function boot(canvas, { onNote = () => {}, onState = () => {}, only = null } = {}) {
  const ONLY = only;
  const info = { fps: 0, tris: 0, calls: 0, errors: [], ms: {} };
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance', preserveDrawingBuffer: true });
  renderer.setPixelRatio(Math.min(1.5, window.devicePixelRatio || 1));
  renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap; renderer.info.autoReset = false;
  const scene = new THREE.Scene(); scene.background = new THREE.Color('#96bede');
  const camera = new THREE.PerspectiveCamera(36, 16 / 9, 1, 30000);
  const controls = new OrbitControls(camera, canvas); controls.enableDamping = true; controls.dampingFactor = 0.08;
  camera.position.set(-2900, 1900, 2900); controls.target.set(0, 100, 0); controls.update();
  const sun = new THREE.DirectionalLight('#fff4e6', 2.9); sun.castShadow = true; sun.shadow.mapSize.set(4096, 4096); sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.6;
  const hemi = new THREE.HemisphereLight('#eef4fa', '#9a8a78', 1.05), back = new THREE.DirectionalLight('#ffe6d6', 0.6); back.position.set(1200, 800, -900);
  scene.add(sun, sun.target, hemi, back);

  /* K2-Knete wie hex-island.v5 */
  onNote('Knete wird angerührt …');
  const tex = d => { const t = new THREE.DataTexture(d, 1024, 1024, THREE.RGBAFormat); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.magFilter = THREE.LinearFilter; t.minFilter = THREE.LinearMipmapLinearFilter; t.generateMipmaps = true; t.anisotropy = renderer.capabilities.getMaxAnisotropy(); t.needsUpdate = true; return t; };
  const rel = makeClayRelief({ size: 1024, seed: 31 }), relT = tex(rel.data), tools = await makeToolReliefs({ size: 1024, seed: 41 });
  const U = C.makeClayUniforms(THREE, relT);
  [U.uClayToolA.value, U.uClayToolB.value, U.uClayToolC.value] = tools.maps.map(tex);
  U.uClayToolOn.value = 1; U.uClayLegacyStroke.value = 0; U.uClayMottle.value = 0.04;
  let printT = null; try { printT = await C.makePrintTexture(THREE, here('../ref/clay-joebinns/Fingerprints01_3K.png'), 2048); } catch (e) { info.errors.push('Fingerabdrücke: ' + e.message); }
  U.uClayPrint.value = printT || relT; U.uClayPrintOn.value = printT ? 1 : 0;
  const WK = 3; U.uClayHand.value = 0.5 * WK; U.uClayTile.value = 1.6 * WK; U.uClayPrintTile.value = 4.5 * WK; U.uClayMacro.value = 0.5; U.uClayLodK.value = 0.6; U.uClayStroke.value = 0.7;
  const QUIET = { print: 0.3, dent: 0, gouge: 0, crack: 0, stroke: 1, facet: 0.9, crease: 0.5 };
  const prof = (key, scale, kk, over = {}) => { const p = { ...C.PROFILES[key], ...over }; p.scale = (scale ?? p.scale) * kk; p.gougeSize *= kk; p.crackSize *= kk; p.dentSize *= kk; return p; };
  const LOOK = {
    organ: { ...prof('terrainFg', 1.1, WK, { print: 0.35, dent: 0.5, gouge: 0.5, crack: 0.4, stroke: 0.9, facet: 0.85, crease: 0.5 }), tools: TOOLMIX.terrain },
    organQuiet: { ...prof('terrainFg', 1.1, WK, { print: 0.15, dent: 0, gouge: 0, crack: 0, stroke: 0.4, facet: 0.5, crease: 0.3 }) },   // v4: ohne Werkzeug-Relief (Befund 03.10.: Kreis-Artefakte auf den Nieren)
    tile: { ...prof('terrainFg', 1.1, WK, { print: 0, dent: 0, gouge: 0, crack: 0, stroke: 0.9, facet: 0.8, crease: 0.4 }), tools: TOOLMIX.terrain },
    road: { ...prof('house', 0.6, WK, QUIET), tools: TOOLMIX.strang },
    track: { ...prof('house', 0.6, WK, QUIET), tools: TOOLMIX.strang },
    figure: { ...C.PROFILES.figure, legacy: 0, dent: 0, gouge: 0, crack: 0 },
    water: { ...prof('water', null, WK) },
    earth: { ...prof('terrainFg', 1.1, WK, { print: 0, dent: 0.3, gouge: 0.2, crack: 0.2, stroke: 1, facet: 1, crease: 0.6 }), tools: TOOLMIX.rock }
  };
  const matCache = new Map();
  const clayMat = (src, look) => { const k = src.uuid + '|' + look; if (!matCache.has(k)) { const m = C.makeClayMaterial(THREE, U, { src, profile: LOOK[look] }); if (look === 'figure') m.userData.clay.K.value = 0.35; matCache.set(k, m); } return matCache.get(k); };
  const colMat = (color, look) => { const m = clayMat(new THREE.MeshStandardMaterial({ color }), look); m.color.set(color); return m; };
  const vcMat = look => clayMat(new THREE.MeshStandardMaterial({ color: '#ffffff', vertexColors: true, roughness: 0.9 }), look);
  const seed = (g, s) => { C.seedGeometry(THREE, g, s); return g; };
  const mesh = (g, m, s) => { seed(g, s); const o = new THREE.Mesh(g, m); o.castShadow = o.receiveShadow = true; return o; };

  /* Himmel: env-host.v3, Licht-Rig aus hex-island.v5 als Adapter */
  let env = null, cf = null, cloudMat = null;
  const cloudsG = new THREE.Group(); scene.add(cloudsG);
  try {
    const sc = (l, kk) => ({ color: l.color, groundColor: l.groundColor, position: l.position, target: l.target, get intensity() { return l.intensity / kk; }, set intensity(v) { l.intensity = v * kk; } }), dm = () => ({ color: new THREE.Color(), intensity: 0 });
    const ambL = new THREE.AmbientLight(0x7088bb, 0); scene.add(ambL);
    const ambA = { color: ambL.color, get intensity() { return ambL.intensity; }, set intensity(v) { ambL.intensity = v * 3.2 * (1 - (env ? clamp((env.dn.preset.sunIntensity - 1.25) / 3.75, 0, 1) : 1)); } };
    const rig = { sun: sc(sun, 2.9 / 5.0), hemi: sc(hemi, 1.05 / 1.75), back: sc(back, 0.6 / 1.5), sun2: dm(), fill: dm(), fill2: dm(), amb: ambA, petFill: dm() };
    onNote('Himmel (SKY3) …');
    env = await createEnvironmentHost({ THREE, renderer, scene, camera, lights: rig, radius: 20000, fogScale: 333, minutes: 2, onNote }); await env.setShell('travel');
    try { const d = await CF.loadDonor(THREE), fam = CF.buildFamily(THREE, d.lobes, { count: 6, seed: 1 }); cloudMat = CF.makeCloudMaterial(THREE, U); cf = CF.createCloudField({ THREE, family: fam, material: cloudMat, parent: cloudsG }); }
    catch (e) { info.errors.push('Wolken: ' + e.message); }
  } catch (e) { info.errors.push('Himmel: ' + e.message); console.error(e); }

  const loader = new GLTFLoader(), gltfCache = new Map();
  const loadG = url => { if (!gltfCache.has(url)) gltfCache.set(url, loader.loadAsync(url)); return gltfCache.get(url); };
  const world = new THREE.Group(); scene.add(world);

  /* ---------- Hex-Insel (Hub) ---------- */
  onNote('Hex-Insel …');
  const cat = await (await fetch(here('../lab-hex/hx0-catalog.v1.json'))).json(), byKey = new Map(cat.entries.map(e => [e.key, e]));
  const eG = byKey.get('hexagon|hex_grass'), eR = byKey.get('hexagon|hex_road_A');
  const [gG, gR] = await Promise.all([eG, eR].map(e => loadG(rawC(e.commit, e.path))));
  const gb = new THREE.Box3().setFromObject(gG.scene), gsz = gb.getSize(V3()), rb = new THREE.Box3().setFromObject(gR.scene);
  const HM = { S: S_HEX, W: gsz.x * S_HEX, H: gsz.z * S_HEX, depth: gsz.y * S_HEX, top: gb.max.y * S_HEX, roadTop: rb.max.y * S_HEX, lift: 0.6, measured: { w: r4(gsz.x), h: r4(gsz.z), d: r4(gsz.y) } };
  const hm = hexMetrics([HM.W, 0, HM.H]);
  const HUB = { id: 'hub', name: 'Hex-Insel', c: [RING - 330, 0], y: 120, r: 1 };   // auf dem Ring zwischen Niere und Hirn: die Runde kreuzt sich nicht

  /* Insellage: Kreis um die Hex-Insel, Dock zeigt zur Mitte */
  const islands = ISLANDS.filter(s => !ONLY || s.id === ONLY).map(s => ONLY === 'darm' ? { ...s, mm: 2.6 } : ONLY === 'herz' ? { ...s, mm: 3.6 } : s).map(s => ({ spec: s, Cw: V3(Math.cos(s.ang * DEG) * RING, s.y, Math.sin(s.ang * DEG) * RING) }));
  const T2 = psi => [-Math.sin(psi * DEG), Math.cos(psi * DEG)];
  const psiOf = (tx, tz) => Math.atan2(-tx, tz) / DEG;

  /* ---------- Organ-Inseln ---------- */
  const castLoads = [];
  const rigClips = {};
  const clipsFor = async rig => { if (rigClips[rig]) return rigClips[rig];
    const gen = await loadG(RAWK(ANIM + 'Rig_' + rig + '/Rig_' + rig + '_General.glb'));
    const clean = c => new THREE.AnimationClip(c.name, c.duration, c.tracks.filter(t => { const node = t.name.slice(0, t.name.lastIndexOf('.')), pr = t.name.slice(t.name.lastIndexOf('.') + 1); return pr !== 'scale' && (pr !== 'position' || /^(root|hips|pelvis)$/i.test(node)); }));
    const all = gen.animations.map(clean); return (rigClips[rig] = { idle: all.find(c => c.name === 'Idle_A') || all[0], idle2: all.find(c => c.name === 'Idle_B') }); };
  const mixers = [];
  const orient = (obj, p, up, fwd) => { const f = fwd.clone().addScaledVector(up, -fwd.dot(up)).normalize(), x = up.clone().cross(f); obj.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(x, up, f)); obj.position.copy(p); };
  const footed = (src, scale) => { src.updateMatrixWorld(true); const box = new THREE.Box3().setFromObject(src), wrap = new THREE.Group(), mid = new THREE.Group(); mid.add(src);
    src.position.set(-(box.min.x + box.max.x) / 2, -box.min.y, -(box.min.z + box.max.z) / 2); mid.scale.setScalar(scale); wrap.add(mid); return wrap; };

  /* Phase 1: Feld, Lage, Tunnelachse. Die Achse liegt tangential auf dem Ring; Innen-Abschnitte entlang der Achse am Rohfeld gemessen. */
  async function prepIsland(I) {
    const s = I.spec, t0 = performance.now(); onNote(`${s.name}: Feld …`); await tick();
    const FD = await organField(s); closeBorder(FD.G);
    const G0 = FD.G, h = G0.h;
    let cs = [0, 0, 0, 0]; for (let kk = 0; kk < G0.nz; kk += 2) for (let j = 0; j < G0.ny; j += 2) for (let i = 0; i < G0.nx; i += 2) if (G0.V[i + G0.nx * (j + G0.ny * kk)] < 0) { cs[0] += G0.o[0] + i * h; cs[1] += G0.o[1] + j * h; cs[2] += G0.o[2] + kk * h; cs[3]++; }
    const cL = V3(cs[0] / cs[3], cs[1] / cs[3], cs[2] / cs[3]);
    const p0 = FD.through ? V3(...FD.through[0]).add(V3(...FD.through[1])).multiplyScalar(0.5) : cL.clone();
    const aL = V3(...s.axis).normalize(), a = s.ang * DEG, tW = V3(-Math.sin(a), 0, Math.cos(a)), toHub = V3(-Math.cos(a), 0, -Math.sin(a));
    const yaw = Math.atan2(aL.x, aL.z) - Math.atan2(tW.x, tW.z); let q = new THREE.Quaternion().setFromAxisAngle(V3(0, 1, 0), -yaw);
    const colon = s.id === 'darm' && ONLY === 'darm' ? colonLine(FD) : s.id === 'herz' && ONLY === 'herz' ? heartLine(FD, (CUT_R + 4) / s.mm) : null;
    if (colon) { const qP = new THREE.Quaternion().setFromUnitVectors(colon.up.clone().normalize(), V3(0, 1, 0)), a2 = aL.clone().applyQuaternion(qP).setY(0).normalize();   // v7 E2: Darm liegt so, dass die Colon-Linie die kleinste Höchststeigung hat
      q = new THREE.Quaternion().setFromAxisAngle(V3(0, 1, 0), -(Math.atan2(a2.x, a2.z) - Math.atan2(tW.x, tW.z))).multiply(qP); }
    if (s.tilt && FD.parts) { const mk = sg => new THREE.Quaternion().setFromAxisAngle(V3(0, 1, 0), -yaw).multiply(new THREE.Quaternion().setFromAxisAngle(aL, sg * s.tilt * DEG));
      const dirB = qq => FD.parts.BL.clone().sub(p0).applyQuaternion(qq).setY(0).normalize(); q = mk(1); if (dirB(q).dot(toHub) > 0) q = mk(-1); }
    const Pw = V3(Math.cos(a) * RING, s.y, Math.sin(a) * RING);
    const root = new THREE.Group(); root.quaternion.copy(q); root.scale.setScalar(s.mm); root.position.copy(Pw).sub(p0.clone().applyQuaternion(q).multiplyScalar(s.mm)); world.add(root); root.updateMatrixWorld(true);
    const upL = V3(0, 1, 0).applyQuaternion(q.clone().invert());
    const ext = Math.hypot(G0.nx, G0.ny, G0.nz) * h / 2, ivs = []; let cur = null;
    for (let t = -ext; t <= ext; t += h * 0.5) { const p = p0.clone().addScaledVector(aL, t), ins = samp(G0, p.x, p.y, p.z) < 0; if (ins && !cur) cur = [t, t]; if (ins) cur[1] = t; if (!ins && cur && t - cur[1] > 12 / s.mm) { ivs.push(cur); cur = null; } }
    if (cur) ivs.push(cur);
    const iv = []; for (const v of ivs) { if (iv.length && (v[0] - iv[iv.length - 1][1]) * s.mm < 60) iv[iv.length - 1][1] = v[1]; else iv.push([...v]); }
    if (!iv.length) { info.errors.push(s.name + ': Tunnelachse trifft das Organ nicht'); iv.push([-20, 20]); }
    const segs = iv.map(([u0, u1]) => [r4(u0 * s.mm - 12), r4(u1 * s.mm + 12)]);
    const D0 = Pw.clone().addScaledVector(tW, segs[0][0]), D1 = Pw.clone().addScaledVector(tW, segs[segs.length - 1][1]);
    return { id: s.id, spec: s, I: { spec: s, Cw: cL.clone().applyMatrix4(root.matrixWorld) }, root, q, upL, cL, p0, FD, G0, h, segs, colon, src: FD.src, measured: FD.measured || null,
      dock: { D0, D1, tW, toHub, psi: psiOf(tW.x, tW.z), y: s.y, Pw }, tiers: {}, figs: [], spots: { hero: [], light: [] }, ms: Math.round(performance.now() - t0) };
  }
  /* Phase 2: Schnitt entlang der Strecke (NAHT), Kneten, Hero/Light, Wasser, Bewohner */
  async function meshIsland(B, cuts) {
    const s = B.spec, t0 = performance.now(), G0 = B.G0, h = B.h, FD = B.FD, upL = B.upL, cL = B.cL, rC = CUT_R / s.mm;
    onNote(`${s.name}: Tunnel und Knete …`); await tick();
    const Gc = { ...G0, V: Float32Array.from(G0.V) }, { nx, ny, nz, o } = Gc, rr = Math.ceil(rC * 1.6 / h) + 1;
    /* v7 Mündung (Befund Georg C2: Tunneleingang an der Hohlvene unsauber, Lücken). Ursache: Portal = erster Berührpunkt der Schnittröhre; bei
       schrägem Eintritt in ein Gefäßende liegt er am Rand, der Kragen ist dort halb abgeschnitten (nur nahe G0) → gezackte Lippe, Spalt. Jetzt: an jedem
       Portal eine Knetröhre (Kapsel r = Röhre + Wand) vom Portal 0,8 r nach außen, weich mit dem Organ vereinigt; Schnitt und Kragen laufen durch
       diese Mündung. Gilt für alle Tunnel in v7. */
    const qiM = B.q.clone().invert(), invM = B.root.matrixWorld.clone().invert(), wallM = Math.max(7 / s.mm, 3.2 * h), Lout = rC * 0.8;
    const PM = (B.portals || []).map((p, i) => { const c = p.p.clone().applyMatrix4(invM), t = p.T.clone().applyQuaternion(qiM).normalize(), out = i % 2 === 0 ? t.clone().negate() : t.clone(); return { c, out, e: c.clone().addScaledVector(out, Lout) }; });
    for (const P of PM) { const Rs = rC + wallM, ext = Math.ceil((Rs + Lout + wallM) / h) + 1, ci = Math.round((P.c.x - o[0]) / h), cj = Math.round((P.c.y - o[1]) / h), ck = Math.round((P.c.z - o[2]) / h);
      for (let k = Math.max(0, ck - ext); k <= Math.min(nz - 1, ck + ext); k++) for (let j = Math.max(0, cj - ext); j <= Math.min(ny - 1, cj + ext); j++) for (let i = Math.max(0, ci - ext); i <= Math.min(nx - 1, ci + ext); i++) {
        const x = o[0] + i * h, y = o[1] + j * h, z = o[2] + k * h, ax = x - P.c.x, ay = y - P.c.y, az = z - P.c.z, a = ax * P.out.x + ay * P.out.y + az * P.out.z, d = Math.max(Math.hypot(ax - a * P.out.x, ay - a * P.out.y, az - a * P.out.z) - Rs, a - Lout, -a - Lout), qq = i + nx * (j + ny * k);   /* Zylinder mit flachem Ende (Befund: Kapsel-Halbkugel stand 26 m vor dem Schnitt und verschloss die Mündung) */
        Gc.V[qq] = smin(Gc.V[qq], d, wallM * 0.8); } }
    const Gs = { ...Gc, V: Float32Array.from(Gc.V) };   // Feld mit Mündungen, ungeschnitten (für den Kragen)
    PM.forEach(P => { const q = P.c.clone().addScaledVector(P.out, -rC * 1.5); P.reg = FD.regionAt(q.x, q.y, q.z); });   /* Mündung trägt die Farbe des Gefäßes, in das sie führt (Befund: Kapsel außerhalb des Bakes las fremde Region → hell) */
    const mouthReg = (x, y, z) => { for (const P of PM) { const ax = x - P.c.x, ay = y - P.c.y, az = z - P.c.z, a = ax * P.out.x + ay * P.out.y + az * P.out.z; if (a < -rC * 0.2 || a > Lout + wallM * 1.5) continue; if (Math.hypot(ax - a * P.out.x, ay - a * P.out.y, az - a * P.out.z) < rC + wallM * 2.2) return P.reg; } return 0; };
    /* v7 Wandmantel (Befund E2: Löcher, wo die Schnittröhre bis an die dünne Darmwand reichte): um jede Tunnel-Schnittkugel im Organ zuerst eine
       Kugel r + 7 m ins Organ vereinigen, dann schneiden → überall mindestens 7 m Knetwand um die Röhre; wo das Organ dicker ist, ändert sich nichts. */
    { const wl = Math.max(7 / s.mm, 3.2 * h), rw = rC + wl, rs = Math.ceil(rw / h) + 1;   /* v7: Mantel ≥ 1,6 Light-Zellen (Befund C2 Light: 7-m-Wand dünner als eine Light-Zelle → Blattwand mit Kante am SVC-Eingang) */
      for (const c of cuts) { if (!c.sleeve) continue; const ci = Math.round((c.x - o[0]) / h), cj = Math.round((c.y - o[1]) / h), ck = Math.round((c.z - o[2]) / h), R2 = (c.r || rC) + wl;
        for (let k = Math.max(0, ck - rs); k <= Math.min(nz - 1, ck + rs); k++) for (let j = Math.max(0, cj - rs); j <= Math.min(ny - 1, cj + rs); j++) for (let i = Math.max(0, ci - rs); i <= Math.min(nx - 1, ci + rs); i++) {
          const dx = o[0] + i * h - c.x, dy = o[1] + j * h - c.y, dz = o[2] + k * h - c.z, qq = i + nx * (j + ny * k), v = Math.sqrt(dx * dx + dy * dy + dz * dz) - R2; if (v < Gc.V[qq]) Gc.V[qq] = smin(Gc.V[qq], v, wl * 0.6); } } }
    /* v7 Portal ohne Scherben (Befund G2 Light: Splitter am Tunnelausgang bei streifendem Austritt): wo jenseits der Röhre weniger als 6 m Wand
       bliebe, wird die Röhre in diese Richtung geöffnet (Zusatzkugel) → Einschnitt statt Splitterwand. Geprüft gegen das ummantelte Feld. */
    { const T6 = 6 / s.mm, extra = [];
      for (const c of cuts) { if (!c.t || s.id !== 'hirn') continue; const r0 = c.r || rC, a0 = Math.abs(c.t.y) < 0.9 ? V3(0, 1, 0) : V3(1, 0, 0), e1 = a0.clone().cross(c.t).normalize(), e2 = c.t.clone().cross(e1).normalize();
        for (let m = 0; m < 8; m++) { const d = e1.clone().multiplyScalar(Math.cos(m * Math.PI / 4)).addScaledVector(e2, Math.sin(m * Math.PI / 4)), pin = c.clone().addScaledVector(d, r0 * 1.05), pout = c.clone().addScaledVector(d, r0 + T6);
          if (samp(Gc, pin.x, pin.y, pin.z) < 0 && samp(Gc, pout.x, pout.y, pout.z) >= 0) { const x2 = c.clone().addScaledVector(d, r0 * 0.9); x2.r = r0 * 0.9; extra.push(x2); } } }
      cuts.push(...extra); B.windows = extra.length; }
    for (const c of cuts) { const ci = Math.round((c.x - o[0]) / h), cj = Math.round((c.y - o[1]) / h), ck = Math.round((c.z - o[2]) / h);
      for (let k = Math.max(0, ck - rr); k <= Math.min(nz - 1, ck + rr); k++) for (let j = Math.max(0, cj - rr); j <= Math.min(ny - 1, cj + rr); j++) for (let i = Math.max(0, ci - rr); i <= Math.min(nx - 1, ci + rr); i++) {
        const dx = o[0] + i * h - c.x, dy = o[1] + j * h - c.y, dz = o[2] + k * h - c.z, qq = i + nx * (j + ny * k), v = (c.r || rC) - Math.sqrt(dx * dx + dy * dy + dz * dz); if (v > Gc.V[qq]) Gc.V[qq] = v; } }
    /* v4b Portale im Feld (Befund 03.10.: Torus- und Röhren-Netze daneben ließen Spalten, Schattenränder, Clipping). Kragen = Torus um die Tunnelachse
       am gemessenen Ein-/Austritt, Röhrenradius ≥ 1,4 Zellen, weich mit dem Organ vereinigt → eine Fläche, wird mitgeknetet. */
    const inv0 = B.root.matrixWorld.clone().invert(), qi = B.q.clone().invert(), PT = PM.map(P => ({ c: P.e.clone(), t: P.out.clone() }));
    const rt = Math.max(3.2 / s.mm, 1.4 * h), Rk = rC + rt * 0.55, kS = rt * 0.8;
    for (const P0 of PT) { const ext = Math.ceil((Rk + rt * 2) / h) + 1, ci = Math.round((P0.c.x - o[0]) / h), cj = Math.round((P0.c.y - o[1]) / h), ck = Math.round((P0.c.z - o[2]) / h);
      for (let k = Math.max(0, ck - ext); k <= Math.min(nz - 1, ck + ext); k++) for (let j = Math.max(0, cj - ext); j <= Math.min(ny - 1, cj + ext); j++) for (let i = Math.max(0, ci - ext); i <= Math.min(nx - 1, ci + ext); i++) {
        const dx = o[0] + i * h - P0.c.x, dy = o[1] + j * h - P0.c.y, dz = o[2] + k * h - P0.c.z, a = dx * P0.t.x + dy * P0.t.y + dz * P0.t.z, rx = dx - a * P0.t.x, ry = dy - a * P0.t.y, rz = dz - a * P0.t.z;
        const qq = i + nx * (j + ny * k), tor = smax(Math.hypot(Math.hypot(rx, ry, rz) - Rk, a) - rt, Gs.V[qq] - rt * 1.2, rt * 0.5); Gc.V[qq] = smin(Gc.V[qq], tor, kS); } }   // v4c: Kragen nur nahe der Organwand (Befund: streifender Austritt → Kragen stand als Henkel über)
    closeBorder(Gc);
    const overCol = (x, y, z, r) => { for (const c of cuts) { if (!c.col) continue; const dx = x - c.x, dy = y - c.y, dz = z - c.z, a = dx * upL.x + dy * upL.y + dz * upL.z; if (a > 0 && Math.hypot(dx - a * upL.x, dy - a * upL.y, dz - a * upL.z) < r) return true; } return false; };   // v6: Wasser der Hülle schwebte über der Schlucht (Fissur-Becken)
    const nearCut = (x, y, z, r, tunOnly) => { const r2 = r * r; for (const c of cuts) { if (tunOnly && c.hang) continue; const dx = x - c.x, dy = y - c.y, dz = z - c.z; if (dx * dx + dy * dy + dz * dz < r2) return true; } return false; };
    const GT = blurG(Gc, 1, s.knet), GH = blurG(G0, Math.max(1, Math.round(s.hullMM / h)), 3);
    /* v7 Befund C2 Hero: dreieckiges Loch in der SVC-Wand = dünne Wand am Portal, vom Kneten (blur) weggeschmolzen. Nahe der Tunnel-Schnitte darf
       das Kneten keine Knete wegnehmen: GT = min(geknetet, ungeknetet). */
    for (let q = 0; q < GT.V.length; q++) if (Gc.V[q] < 0 && GT.V[q] >= 0) GT.V[q] = Gc.V[q];   /* v7 Befund C2 Portal 2/4: Kneten machte dünne Gefäßwände zu Löchern → wo innen war, bleibt innen (Vorzeichen bleibt) */
    { const rr2 = Math.ceil(rC * 2.6 / h) + 1; for (const c of cuts) { if (c.hang || c.col) continue; const ci = Math.round((c.x - o[0]) / h), cj = Math.round((c.y - o[1]) / h), ck = Math.round((c.z - o[2]) / h);
      for (let k = Math.max(0, ck - rr2); k <= Math.min(nz - 1, ck + rr2); k++) for (let j = Math.max(0, cj - rr2); j <= Math.min(ny - 1, cj + rr2); j++) for (let i = Math.max(0, ci - rr2); i <= Math.min(nx - 1, ci + rr2); i++) { const qq = i + nx * (j + ny * k); if (Gc.V[qq] < GT.V[qq]) GT.V[qq] = Gc.V[qq]; } } }
    const TIERS = { hero: { GT, GH, GW: down2(GH), cell: h }, light: { GT: carve(down2(GT, cuts.some(c => c.t) ? 0.5 : 0), cuts, rC), GH: down2(GH), GW: down2(down2(GH)), cell: h * 2 } };
    for (const [tk, TT] of Object.entries(TIERS)) {
      onNote(`${s.name}: ${tk === 'hero' ? 'Hero' : 'Light'} wird geknetet …`); await tick();
      const tt = performance.now(), g = new THREE.Group(); g.visible = tk === tierNow; B.root.add(g);
      const SN = surfaceNets(TT.GT, 1), M = SN.P.length / 3, P = SN.P, Nn = SN.N, depth = new Float32Array(M), col = new Float32Array(M * 3);
      const deep = new THREE.Color(s.deep), cc = new THREE.Color(), cache = {}, cs7 = TT.cell, O7 = [[0, 0, 0], [1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]];
      const colOf = id => cache[id] || (cache[id] = new THREE.Color(s.id === 'hirn' ? HIRN[LOBE[id] || 'stem'] : (s.pal[id] || s.pal[1] || '#e2d0bc')));
      for (let i = 0; i < M; i++) { const x = P[i * 3], y = P[i * 3 + 1], z = P[i * 3 + 2], d = -samp(TT.GH, x, y, z); depth[i] = d;   // H0 paintTerrain: d > 0 Furche
        let id = 0, nw = 0; cc.setRGB(0, 0, 0); for (const [ox, oy, oz] of O7) { const px = x + ox * cs7, py = y + oy * cs7, pz = z + oz * cs7; if ((ox || oy || oz) && samp(TT.GT, px, py, pz) > 0) continue; const r = mouthReg(px, py, pz) || FD.regionAt(px, py, pz); if (!ox && !oy && !oz) id = r; cc.add(colOf(r)); nw++; } cc.multiplyScalar(1 / nw).offsetHSL(0, 0, (hash(id) - 0.5) * 0.08);   // v3: 7 Proben gemischt
        cc.lerp(deep, clamp((d - 0.4) / 4.5, 0, s.deepMax ?? 0.75));
        if (PT.length) { let lin = false, col2 = false; for (const P0 of PT) { const dx = x - P0.c.x, dy = y - P0.c.y, dz = z - P0.c.z, a = dx * P0.t.x + dy * P0.t.y + dz * P0.t.z, rr2 = Math.hypot(dx - a * P0.t.x, dy - a * P0.t.y, dz - a * P0.t.z); if (Math.hypot(rr2 - Rk, a) < rt * 1.6) col2 = true; }
          if (!col2 && nearCut(x, y, z, rC * 1.2, true)) lin = true; if (lin) cc.multiplyScalar(0.62); else if (col2) cc.multiplyScalar(0.86); } if (d < -1.2) cc.offsetHSL(0, 0, clamp((-d - 1.2) / 10, 0, 0.06));
        col[i * 3] = cc.r; col[i * 3 + 1] = cc.g; col[i * 3 + 2] = cc.b; }
      { const out = [], lim = (TT.cell * 3.5) ** 2, A = V3(), Bv = V3(), Cv = V3(), fn = V3(), e1 = V3(), e2 = V3(); let flap = 0;   /* v7 Befund C2: Rückseiten-Lappen am Portal (Dreieck gegen die Eckennormalen gedreht oder über 3,5 Zellen lang) */
        for (let t = 0; t < SN.idx.length; t += 3) { const a = SN.idx[t], b = SN.idx[t + 1], c = SN.idx[t + 2]; A.fromArray(P, a * 3); Bv.fromArray(P, b * 3); Cv.fromArray(P, c * 3);
          const l2 = Math.max(A.distanceToSquared(Bv), Bv.distanceToSquared(Cv), Cv.distanceToSquared(A)); fn.crossVectors(e1.subVectors(Bv, A), e2.subVectors(Cv, A)); const fl = fn.length();
          const vn = Nn[a * 3] + Nn[b * 3] + Nn[c * 3], vy = Nn[a * 3 + 1] + Nn[b * 3 + 1] + Nn[c * 3 + 1], vz = Nn[a * 3 + 2] + Nn[b * 3 + 2] + Nn[c * 3 + 2], dt = fl > 1e-12 ? (fn.x * vn + fn.y * vy + fn.z * vz) / fl / (Math.hypot(vn, vy, vz) || 1) : 1;
          if (dt < 0) { out.push(a, c, b); flap++; } else out.push(a, b, c); }   /* Befund C2 Portal 2 (Prüfung mit Override-Material: FrontSide → schwarze Löcher, DoubleSide → keine): Surface Nets dreht an einzelligen Wänden die Windung; Dreieck gegen seine Eckennormalen → Windung umkehren statt wegwerfen */
        SN.idx = out; if (flap) console.log('[v7] Windung gedreht', s.id, tk, flap); }
      const DI = dropIslands(SN.idx, M, 200, 0.02);   /* Befund Prüfer C2: Teile 300 und 248 △ (Truncus-Rest) schwebten frei über der Strecke; Grenze 200 △ ließ sie stehen → 2 % des größten Teils */ SN.idx = DI.idx; B.islandsDropped = (B.islandsDropped || 0) + DI.gone; if (DI.gone) console.log('[v7] Inseln entfernt', s.id, tk, DI.gone);
      const tg = toGeo(P, Nn, SN.idx); tg.setAttribute('color', new THREE.BufferAttribute(col, 3));
      g.add(mesh(tg, vcMat(s.look || 'organ'), 11 + s.ang));
      if (FD.lines) { const ut = new THREE.Color(s.pal[3] || '#e8a49a'), Gn = FD.parts.Gn, Gb = FD.parts.Gb;   // v5: glatte Harnleiter-Röhre
        for (const Lr of FD.lines) { const ok = Lr.map(p => samp(Gn, p.x, p.y, p.z) > -FD.RT && samp(Gb, p.x, p.y, p.z) > -FD.RT && !nearCut(p.x, p.y, p.z, rC * 1.1));
          let best = [0, -1], a = -1; ok.forEach((v, i) => { if (v && a < 0) a = i; if ((!v || i === ok.length - 1) && a >= 0) { const e = v ? i : i - 1; if (e - a > best[1] - best[0]) best = [a, e]; a = -1; } });
          const i0 = Math.max(0, best[0] - 2), i1 = Math.min(Lr.length - 1, best[1] + 2); if (i1 - i0 < 4) continue;   // Enden 2 Stützstellen in Niere und Blase
          const pts = Lr.slice(i0, i1 + 1), tube = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), pts.length, FD.RT, tk === 'hero' ? 14 : 10, false);
          const cl = new Float32Array(tube.attributes.position.count * 3); for (let k = 0; k < cl.length; k += 3) { cl[k] = ut.r; cl[k + 1] = ut.g; cl[k + 2] = ut.b; }
          tube.setAttribute('color', new THREE.BufferAttribute(cl, 3)); const um = mesh(tube, vcMat(s.look || 'organ'), 13 + s.ang); um.name = 'harnleiter'; g.add(um); } }
      const WS = surfaceNets(shiftG(TT.GW, s.water), 1), wi = [];   // Wasser nur nach oben, nicht im Tunnel
      for (let t = 0; t < WS.idx.length; t += 3) { let d = 0, cx = 0, cy = 0, cz = 0; for (let e = 0; e < 3; e++) { const v = WS.idx[t + e]; d += WS.N[v * 3] * upL.x + WS.N[v * 3 + 1] * upL.y + WS.N[v * 3 + 2] * upL.z; cx += WS.P[v * 3]; cy += WS.P[v * 3 + 1]; cz += WS.P[v * 3 + 2]; }
        const vIn = e => { const v = WS.idx[t + e]; return nearCut(WS.P[v * 3], WS.P[v * 3 + 1], WS.P[v * 3 + 2], rC * 2.2); };
        if (d / 3 > 0.3 && !nearCut(cx / 3, cy / 3, cz / 3, rC * 1.8) && !vIn(0) && !vIn(1) && !vIn(2) && !overCol(cx / 3, cy / 3, cz / 3, rC * 1.8) && samp(TT.GT, cx / 3, cy / 3, cz / 3) < TT.cell * 2) wi.push(WS.idx[t], WS.idx[t + 1], WS.idx[t + 2]); }   /* v7 Befund C2: Wasserdreieck der Hülle schwebte im SVC-Portal → alle Ecken prüfen, Wasser nur nahe der geschnittenen Fläche */
      { const DW = dropIslands(wi, WS.P.length / 3, 6, 0); wi.length = 0; wi.push(...DW.idx); }
      const water = mesh(toGeo(WS.P, WS.N, wi), colMat(RC.water, 'water'), 9 + s.ang); water.castShadow = false; g.add(water);
      const nup = i => Nn[i * 3] * upL.x + Nn[i * 3 + 1] * upL.y + Nn[i * 3 + 2] * upL.z;
      B.tiers[tk] = { g, TT, SN: { P, N: Nn, M, depth }, nup, ms: Math.round(performance.now() - tt), cell: TT.cell, tris: { terrain: SN.idx.length / 3, water: wi.length / 3 }, verts: M };
    }
    const spotsFor = T => { const P = T.SN.P, cand = [], clr = rC + 6 / s.mm;
      for (let i = 0; i < T.SN.M; i += 2) { if (T.nup(i) < 0.88 || T.SN.depth[i] > s.water - 0.35) continue; if (nearCut(P[i * 3], P[i * 3 + 1], P[i * 3 + 2], clr)) continue; cand.push(i); }
      const pick = []; if (!cand.length) return pick; let first = cand[0], bh = -1e9; for (const i of cand) { const hh = (P[i * 3] - cL.x) * upL.x + (P[i * 3 + 1] - cL.y) * upL.y + (P[i * 3 + 2] - cL.z) * upL.z; if (hh > bh) { bh = hh; first = i; } } pick.push(first);
      while (pick.length < s.cast.length) { let bi = -1, bd = -1; for (const i of cand) { let m = 1e18; for (const j of pick) m = Math.min(m, (P[i * 3] - P[j * 3]) ** 2 + (P[i * 3 + 1] - P[j * 3 + 1]) ** 2 + (P[i * 3 + 2] - P[j * 3 + 2]) ** 2); if (m > bd) { bd = m; bi = i; } } if (bi < 0) break; pick.push(bi); }
      return pick.map(i => V3(P[i * 3], P[i * 3 + 1], P[i * 3 + 2])); };
    B.spots = { hero: spotsFor(B.tiers.hero), light: spotsFor(B.tiers.light) }; B.cuts = cuts;
    s.cast.forEach(([n, p, rig], ci) => castLoads.push((async () => {
      try { const [gl, clips] = await Promise.all([loadG(RAWK(p)), clipsFor(rig)]); const sc = gl.scene;
        sc.traverse(o2 => { if (!o2.isMesh) return; o2.castShadow = o2.receiveShadow = true; o2.frustumCulled = false; const conv = m => clayMat(m, 'figure'); o2.material = Array.isArray(o2.material) ? o2.material.map(conv) : conv(o2.material); if (!o2.isSkinnedMesh) o2.geometry = seed(o2.geometry.clone(), 900 + ci); else seed(o2.geometry, 900 + ci); });
        const w = footed(sc, FIG_K / s.mm), mixer = new THREE.AnimationMixer(sc), ac = mixer.clipAction(ci === 2 && clips.idle2 ? clips.idle2 : clips.idle); ac.play(); ac.time = hash(ci * 3 + s.ang) * 3; mixers.push(mixer);
        B.root.add(w); const fig = { n, obj: w, ci, yaw: hash(ci * 7 + s.ang) * 6.28 }; B.figs.push(fig); placeFig(B, fig, tierNow);
      } catch (e) { info.errors.push(n + ': ' + e.message); } })()));
    B.ms += Math.round(performance.now() - t0);
  }
  const tangentOf = (n, yaw) => { const ref = Math.abs(n.y) < 0.9 ? V3(0, 1, 0) : V3(1, 0, 0); return ref.clone().cross(n).normalize().applyAxisAngle(n, yaw); };
  function placeFig(isl, fig, tk) { const p = isl.spots[tk][fig.ci]; fig.obj.visible = !!p; if (!p) return; orient(fig.obj, p.clone().addScaledVector(isl.upL, -0.05 / isl.spec.mm), isl.upL, tangentOf(isl.upL, fig.yaw)); }

  let tierNow = 'hero';
  const built = [];
  for (const I of islands) { try { built.push(await prepIsland(I)); } catch (e) { console.error(e); info.errors.push(I.spec.name + ': ' + e.message); } }

  /* ---------- Hex-Insel bauen (Kacheln + Unterbau aus hex-island.v5) ---------- */
  /* Achse der Durchfahrt wie cosmos-route.v1: Hex-Achse nächst der Winkelhalbierenden aus Anflug und Abflug */
  const firstD = built[0]?.dock, lastD = built[built.length - 1]?.dock;
  { const vi = lastD ? [HUB.c[0] - lastD.D1.x, HUB.c[1] - lastD.D1.z] : [1, 0], vo = firstD ? [firstD.D0.x - HUB.c[0], firstD.D0.z - HUB.c[1]] : [1, 0], nrm = v => { const l = Math.hypot(...v) || 1; return [v[0] / l, v[1] / l]; };
    const a = nrm(vi), b = nrm(vo), dx = a[0] + b[0], dz = a[1] + b[1]; let best = 0, bd = -2; AXES.forEach((psi, d) => { const t = T2(psi), v = (t[0] * dx + t[1] * dz) / (Math.hypot(dx, dz) || 1); if (v > bd) { bd = v; best = d; } }); HUB.d = best; }
  HUB.psi = AXES[HUB.d]; { const t = T2(HUB.psi), hh = (HUB.r + 0.5) * HM.W; HUB.t = t; HUB.E = [HUB.c[0] - t[0] * hh, HUB.y, HUB.c[1] - t[1] * hh]; HUB.X = [HUB.c[0] + t[0] * hh, HUB.y, HUB.c[1] + t[1] * hh]; HUB.L = (2 * HUB.r + 1) * HM.W; }
  const hubG = new THREE.Group(); hubG.position.set(HUB.c[0], 0, HUB.c[1]); world.add(hubG);
  if (!ONLY) { const origin = [0, HUB.y - HM.lift - HM.roadTop, 0], cells = [{ c: 0, r: 0 }]; for (let d = 0; d < 6; d++) { const [c, r] = neighbor(0, 0, d); cells.push({ c, r, d }); }
    const prep = (src) => { const root = src.clone(true); root.traverse(o => { if (!o.isMesh) return; o.castShadow = o.receiveShadow = true; const conv = m => clayMat(m, 'tile'); o.material = Array.isArray(o.material) ? o.material.map(conv) : conv(o.material); o.geometry = seed(o.geometry.clone(), 600 + o.id); }); return root; };
    for (const cell of cells) { const road = cell.d == null || cell.d === HUB.d || cell.d === (HUB.d + 3) % 6, tile = prep((road ? gR : gG).scene), p = hexToWorld(cell.c, cell.r, hm);
      tile.position.set(origin[0] + p[0], origin[1], origin[2] + p[2]); tile.rotation.y = road ? rotDeg(HUB.d % 3) * DEG : 0; tile.scale.setScalar(S_HEX); hubG.add(tile); }
    /* Unterbau v2 — buildBody aus hex-island.v5 (Umriss, Schichten mit Fase, Spitze, zwei Zapfen), Farben WORLDS.canyon */
    const Rc = HM.H / 2, has = new Set(cells.map(c => `${c.c},${c.r}`)), key = p => `${Math.round(p.x * 100)},${Math.round(p.z * 100)}`, segs = new Map();
    for (const c of cells) { const pw = hexToWorld(c.c, c.r, hm); for (let d = 0; d < 6; d++) { const [nc, nr] = neighbor(c.c, c.r, d); if (has.has(`${nc},${nr}`)) continue;
      const a0 = (d * 60 - 30) * DEG, a1 = (d * 60 + 30) * DEG; segs.set(key(V3(pw[0] + Math.cos(a0) * Rc, 0, pw[2] + Math.sin(a0) * Rc)), { p0: V3(pw[0] + Math.cos(a0) * Rc, 0, pw[2] + Math.sin(a0) * Rc), p1: V3(pw[0] + Math.cos(a1) * Rc, 0, pw[2] + Math.sin(a1) * Rc) }); } }
    const loop = []; let cur = segs.values().next().value; const start = key(cur.p0); for (let n = 0; n < segs.size + 1; n++) { loop.push(cur.p0); const nx = segs.get(key(cur.p1)); if (!nx || key(cur.p1) === start) break; cur = nx; }
    const noise1 = (x, sd) => { const i = Math.floor(x), f = x - i, hh = n => { const v = Math.sin((n + sd * 17.31) * 127.1) * 43758.5453; return v - Math.floor(v); }; const u = f * f * (3 - 2 * f); return hh(i) * (1 - u) + hh(i + 1) * u; };
    const resample = (lp, N) => { const L = [0]; for (let i = 1; i <= lp.length; i++) L.push(L[i - 1] + lp[i - 1].distanceTo(lp[i % lp.length])); const Tt = L[L.length - 1], o2 = []; for (let kk = 0, j = 0; kk < N; kk++) { const ss = kk / N * Tt; while (L[j + 1] < ss) j++; const u = (ss - L[j]) / (L[j + 1] - L[j]); o2.push(lp[j].clone().lerp(lp[(j + 1) % lp.length], u)); } return o2; };
    const shade = (hx, kk) => '#' + new THREE.Color(hx).multiplyScalar(kk).getHexString();
    const B = { bands: 4, depth: 1.05, tip: [0.2, 0.1], seed: 'K'.charCodeAt(0) * 7 }, u = 1 / S_HEX, c = loop.reduce((ss, p) => ss.add(p), V3()).multiplyScalar(1 / loop.length);
    const Rm = loop.reduce((ss, p) => ss + Math.hypot(p.x - c.x, p.z - c.z), 0) / loop.length * u, D = Rm * B.depth, ring = resample(loop, 60).map(p => new THREE.Vector2((p.x - c.x) * u, (p.z - c.z) * u));
    const yTop = origin[1] + HM.top - HM.depth + 0.25 * S_HEX * 0.1, cols = [WORLD.hill, WORLD.trunk, shade(WORLD.trunk, 0.84), shade(WORLD.trunk, 0.7), shade(WORLD.trunk, 0.6)], sd = B.seed;
    const add = (geo, col) => { let gg = geo; try { const r = softenGeometry(THREE, geo, { maxEdge: 0.28, maxLevels: 2, iters: 3, lump: 0.016, maxTris: 16000, seed: sd }); if (r.geometry) gg = r.geometry; } catch (e) {}
      gg.computeVertexNormals(); const m = mesh(gg, colMat(col, 'earth'), 300 + sd + hubG.children.length); m.scale.setScalar(S_HEX); m.position.set(c.x, yTop, c.z); hubG.add(m); };
    const tip = new THREE.Vector2(B.tip[0] * Rm, B.tip[1] * Rm); let y = 0;
    for (let kk = 0; kk <= B.bands; kk++) { const t0 = kk / (B.bands + 1), sc = kk === 0 ? 0.985 : Math.pow(1 - t0, 0.7) * 0.97, hh = kk === 0 ? 0.14 : D * (0.16 + 0.05 * noise1(kk * 2.3, sd)), bev = Math.min(0.16, hh * 0.35), off = tip.clone().multiplyScalar(Math.pow(t0, 1.3));
      const pts = ring.map((p, i) => { const a = i / ring.length * 6.2832, w = 1 + (kk ? 0.06 : 0.01) * (noise1(a * 3 + kk * 1.7, sd) - 0.5) + (kk ? 0.03 : 0) * (noise1(a * 9 + kk, sd + 4) - 0.5); return p.clone().multiplyScalar(sc * w).add(off); });
      const geo = new THREE.ExtrudeGeometry(new THREE.Shape(pts), { depth: Math.max(0.02, hh - 2 * bev), bevelEnabled: true, bevelThickness: bev, bevelSize: bev * 0.9, bevelSegments: 4, curveSegments: 1 }); geo.rotateX(Math.PI / 2); geo.translate(0, -y - bev, 0); add(geo, cols[Math.min(kk, cols.length - 1)]); y += hh * (kk ? 0.82 : 0.9); }
    { const sc = Math.pow(1 - B.bands / (B.bands + 1), 0.7), r = Rm * sc * 0.78, geo = new THREE.SphereGeometry(r, 36, 24); geo.scale(1, 1.25, 1); geo.translate(tip.x, -y - r * 0.55, tip.y); add(geo, cols[cols.length - 1]); }
    for (let z = 0; z < 2; z++) { const a = (noise1(z * 3.1, sd) + z * 0.5) * 6.2832, rr = Rm * (0.42 + 0.1 * noise1(z * 5, sd + 1)), r = Rm * (0.14 + 0.05 * noise1(z * 7, sd + 2)), geo = new THREE.SphereGeometry(r, 28, 18); geo.scale(1, 1.5, 1); geo.translate(Math.cos(a) * rr, -D * (0.42 + 0.12 * z), Math.sin(a) * rr); add(geo, cols[2 + z]); }
  }

  /* ---------- Strecke: Hex → Hirn → Herz → Darm → Niere → Hex, nur Track-Core-Stücke (Rezeptmuster cosmos-route.v1) ---------- */
  onNote('Strecke (Track Core v0.12) …');
  const P3 = p => [r4(p.x ?? p[0]), r4(p.y ?? p[1]), r4(p.z ?? p[2])];
  const thin = { deckDepth: { to: 0.6, zone: [0.9, 1] } }, thick = { deckDepth: { to: 2.25, zone: [0, 0.12] } };   // cosmos-route.v1 Z. 25
  const RUNM = 120;
  const ST = [{ id: 'HX', E: P3(HUB.E), X: P3(HUB.X), psi: r4(HUB.psi), t: HUB.t, pieces: [{ id: 'isle_HX', type: 'STRAIGHT', length: r4(HUB.L), markings: 'STREET', tags: ['hx_isle'] }] }]
    .concat(built.map(B => { const d = B.dock, pcs = [];
      B.segs.forEach((sg, k) => { if (k) pcs.push({ id: B.id + '_luft' + k, type: 'STRAIGHT', length: r4(sg[0] - B.segs[k - 1][1]), markings: 'TRACK', tunnel: null });
        pcs.push({ id: 'tunnel_' + B.id + (k ? '_' + k : ''), type: 'STRAIGHT', length: r4(sg[1] - sg[0]), markings: 'TRACK', tunnel: { preset: 'gotthard' }, tags: ['organ', B.id] }); });
      return { id: B.id, E: P3(d.D0), X: P3(d.D1), psi: r4(d.psi), t: [d.tW.x, d.tW.z], pieces: pcs }; }));
  ST.forEach(e => { e.A = P3([e.E[0] - e.t[0] * RUNM, e.E[1], e.E[2] - e.t[1] * RUNM]); });
  /* cosmos-route.v1 Z. 36–42, Anlauf RUNM statt 3 Hex */
  const into = (e, id) => [{ id, type: 'CONNECT', to: { p: e.A, headingDeg: e.psi, grade: 0 }, stretch: 1.6, markings: 'TRACK' }, { id: id + '_run', type: 'STRAIGHT', length: RUNM, params: thin, markings: 'STREET' }];
  const way = (id, p, psi, extra = {}) => ({ id, type: 'CONNECT', to: { p: P3(p), headingDeg: r4(psi), grade: 0 }, stretch: 1, markings: 'TRACK', ...extra });
  const mid = (a, b, f, dy = 0, out = 0) => { const x = a[0] + (b[0] - a[0]) * f, z = a[2] + (b[2] - a[2]) * f, l = Math.hypot(x, z) || 1; return [x + x / l * out, a[1] + (b[1] - a[1]) * f + dy, z + z / l * out]; };
  const headTo = (a, b) => Math.atan2(-(b[0] - a[0]), b[2] - a[2]) / DEG;
  /* Versatzstücke, Werte aus cosmos-route.v1 Z. 46–64 */
  const BLOCK = {
    sky: id => [{ id: id + '_sky', type: 'SPIRAL', turn: 360, radius: 60, rise: 45, riseEase: 'ramp', riseBlend: 0.3, bankDeg: 0, tags: ['skydrive'] }, { id: id + '_ridge', type: 'STRAIGHT', length: 60, markings: 'MAG', tags: ['skydrive'] },
      { id: id + '_kick', type: 'KICKER', length: 30, lipHeight: 2, lipDeg: 10, tags: ['skydrive'] }, { id: id + '_air', type: 'AIR', gap: 50, drop: 10, tags: ['skydrive'] }, { id: id + '_land', type: 'LANDING', length: 60, drop: 20, tags: ['skydrive'] }],
    loop: id => [{ id: id + '_loop_in', type: 'STRAIGHT', length: 16, markings: 'MAG', drive: { mode: 'locked' }, params: { sideL: { to: 0.45 }, sideR: { to: 0.45 }, deckDepth: { to: 1 } } },
      { id: id + '_loop', type: 'LOOP', height: 60, side: 1, drive: { mode: 'locked' } }, { id: id + '_loop_out', type: 'STRAIGHT', length: 20, markings: 'TRACK', params: { sideL: { to: 1 }, sideR: { to: 1 }, deckDepth: { to: 2.25 } } }],
    hero: id => [{ id: id + '_wide', type: 'WIDTH_STEP', widthTo: 'HERO', markings: 'MAG', drive: { mode: 'assist', fx: ['boost'] }, tags: ['booster'] }, { id: id + '_kick', type: 'KICKER', length: 40, lipHeight: 6, lipDeg: 20 },
      { id: id + '_air', type: 'AIR', gap: 42, drop: 0 }, { id: id + '_land', type: 'LANDING', length: 40, drop: 6 }, { id: id + '_narrow', type: 'WIDTH_STEP', widthTo: 'STANDARD' }]
  };
  const LEGS = [['sky', 0.25, 30, 90], ['loop', 0.4, 0, 150], ['hero', 0.35, -10, 150], ['sky', 0.25, 30, 90], [null, 0.45, 20, 110]];   // f, dy, out wie cosmos K→A, A→B, B→C, (K→A), C→K
  const pieces = [];
  ST.forEach((S, k) => { const N2 = ST[(k + 1) % ST.length], [blk, f, dy, out] = LEGS[k], id = S.id + '_' + N2.id;
    pieces.push(...S.pieces); const w = mid(S.X, N2.A, f, dy, out); pieces.push(way(id + '_out', w, headTo(w, N2.A), { params: thick, tunnel: null }));
    if (blk) pieces.push(...BLOCK[blk](id));
    if (k < ST.length - 1) pieces.push(...into(N2, id + '_in'));
    else { const [h1] = into(N2, id + '_home'); pieces.push(h1, { id: id + '_home_run', type: 'CONNECT', to: { p: N2.E, headingDeg: N2.psi, grade: 0 }, stretch: 1, params: thin, markings: 'STREET' }); } });
  /* Attraktion Niere (Probe): nur Track-Core-Stücke. Nierentunnel R (innen → außen) → Kurve zur Blase → Nierensturz (KICKER + AIR + LANDING,
     AIR ballistisch: 85 m weit, 80 m tief bei 26 m/s) → Rinne außen am Harnleiter R → Bumper-Spirale 1½ Runden um die Blase, steigend →
     Katapult hinauf → Nierentunnel L (außen → innen) → zwischen den Nieren zurück zum Start. Punkte gemessen (Nierenschwerpunkte, Tunnelstrecken am
     Nierenfeld, Blasenschwerpunkt und -radius). Drehsinn der Spirale: beide gerechnet, gewählt wird der mit Mitte auf der Blase. */
  let NL = null;
  const niereLoop = (B, turnSg, opt = {}) => { const M2 = B.root.matrixWorld, pt = B.FD.parts, mm = B.spec.mm, aL = V3(...B.spec.axis).normalize(), tW = B.dock.tW.clone(), back = tW.clone().negate();
    const W3 = v => v.clone().applyMatrix4(M2), iv = c => { let t0 = 0, t1 = 0; for (let t = 0; t > -200; t -= 0.5) { const p = c.clone().addScaledVector(aL, t); if (samp(pt.Gn, p.x, p.y, p.z) >= 0) { t0 = t; break; } } for (let t = 0; t < 200; t += 0.5) { const p = c.clone().addScaledVector(aL, t); if (samp(pt.Gn, p.x, p.y, p.z) >= 0) { t1 = t; break; } } return [t0, t1]; };
    const cR0 = pt.KR.clone().addScaledVector(B.upL, 8), cL0 = pt.KL.clone().addScaledVector(B.upL, 8), cm = cR0.clone().add(cL0).multiplyScalar(0.5);
    const cR = cm.clone().addScaledVector(aL, cR0.clone().sub(cm).dot(aL)), cLk = cm.clone().addScaledVector(aL, cL0.clone().sub(cm).dot(aL));   // beide Tunnel auf EINER Achse (wie v2 p0): Befund bank_rate 1,57 °/m im S-Bogen zwischen versetzten Tunnelachsen   // 8 mm über dem Schwerpunkt: Rückweg zwischen den Nieren läuft über dem Nierenbecken (Befund: 11 Stützstellen am Harnleiter-Abgang)
    const [r0, r1] = iv(cR), [l0, l1] = iv(cLk), KRw = W3(cR), KLw = W3(cLk), Bw = W3(pt.BL), Pw = B.dock.Pw;
    const R_in = KRw.clone().addScaledVector(tW, r1 * mm + 12), R_out = KRw.clone().addScaledVector(tW, r0 * mm - 12), L_in = KLw.clone().addScaledVector(tW, l1 * mm + 12), L_out = KLw.clone().addScaledVector(tW, l0 * mm - 12);
    const dB = Bw.clone().sub(Pw).setY(0).normalize(), psiBk = psiOf(back.x, back.z), psiB = psiOf(dB.x, dB.z);
    const Rs = pt.rB * mm + (opt.off ?? 75),   // Befund 03.10.: +45 m streifte mit 23 Stützstellen das Organ
      KICK = { length: 30, lipHeight: 2, lipDeg: 10 }, AIR = { gap: 60, drop: 40 }, LAND = { length: 90, drop: 50 };   // v4: kürzerer Sturz (Blase höher); AIR ballistisch 60 m / 40 m bei 26 m/s   // Befund landing_dip: 60/20 und 100/60 bildeten nach 80 m Fall eine Mulde (Einflug ~62° steil, Hermite schießt unter das Ende)
    const Q1 = R_out.clone().addScaledVector(back, 100).addScaledVector(dB, 100).setY(KRw.y - 4);   // v4: Sturz außen an der rechten Niere vorbei Richtung Blase   // Befund bank_rate: 40/40 = Kurve r ≈ 40 m
    const psiT = psiOf(tW.x, tW.z), ys = Q1.y - AIR.drop - LAND.drop - 16 + (opt.dy || 0), PS = Bw.clone().addScaledVector(dB, Rs).setY(ys),   // Spirale beginnt am fernen Punkt der Blase, Richtung +tW (Befund 03.10.: Start seitlich verlangte eine Kehre; Blase nur 390 m von den Nieren)
      H = Math.max(20, Math.min(KLw.y - 8 - ys, 2 * Math.PI * Rs * 0.15) * (opt.hk ?? 1));
    const AL = L_in.clone().addScaledVector(tW, 70).setY(KLw.y), HR = r4(Math.min(40, L_out.clone().setY(0).distanceTo(R_in.clone().setY(0)) * 0.4));
    const pcs = [{ id: 'tunnel_niereR', type: 'STRAIGHT', length: r4(R_in.clone().setY(0).distanceTo(R_out.clone().setY(0))), markings: 'TRACK', tunnel: { preset: 'gotthard' }, tags: ['organ', 'niere'] },
      way('n_kurve', Q1, psiB, { stretch: 1.2, tunnel: null }),
      { id: 'n_sturz_boost', type: 'STRAIGHT', length: 60, markings: 'MAG', drive: { mode: 'assist', fx: ['boost'] }, tags: ['booster'] },
      { id: 'n_sturz_kick', type: 'KICKER', ...KICK, tags: ['sturz'] }, { id: 'n_sturz_air', type: 'AIR', ...AIR, drive: { mode: 'assist', fx: ['zero_g'] }, tags: ['sturz'] }, { id: 'n_sturz_land', type: 'LANDING', ...LAND, drive: { mode: 'assist', fx: ['magnet_catch'] }, tags: ['sturz'] },
      way('n_rinne', PS.clone().addScaledVector(tW, -100).setY(ys + 16), psiT, { stretch: 1.2 }),
      { id: 'n_bumper_kick', type: 'KICKER', length: 20, lipHeight: 1.5, lipDeg: 8, tags: ['bumper'] }, { id: 'n_bumper_air', type: 'AIR', gap: 30, drop: 6, drive: { mode: 'assist', fx: ['zero_g'] }, tags: ['bumper'] },
      { id: 'n_bumper_land', type: 'LANDING', length: 50, drop: 10, skin: 'buoy', drive: { mode: 'assist', fx: ['bounce'] }, tags: ['bumper'] },
      { id: 'n_bumper', type: 'SPIRAL', turn: turnSg * 360, radius: r4(Rs), rise: r4(H), riseEase: 'ramp', riseBlend: 0.3, bankDeg: 0, tags: ['bumper'] },
      way('n_katapult', AL, psiBk, { stretch: 1.4, drive: { mode: 'assist', fx: ['boost'] }, markings: 'MAG' }), { id: 'n_katapult_run', type: 'STRAIGHT', length: 70, params: thin, markings: 'STREET' },
      { id: 'schlucht_niereL', type: 'STRAIGHT', length: r4(L_in.clone().setY(0).distanceTo(L_out.clone().setY(0))), markings: 'TRACK', tunnel: null, tags: ['organ', 'niere', 'schlucht'] },
      way('n_home', R_in.clone().addScaledVector(back, -HR), psiBk, { stretch: 1, tunnel: null }), { id: 'n_home_run', type: 'CONNECT', to: { p: P3(R_in), headingDeg: r4(psiBk), grade: 0 }, stretch: 1, markings: 'TRACK' }];   // wie cosmos-route.v1 Z. 67: zwei CONNECT, der letzte endet exakt auf dem Start
    return { pieces: pcs, start: { p: P3(R_in), headingDeg: r4(psiBk) }, Bw, Rs, H, segs: [[r0 * mm - 12, r1 * mm + 12], [l0 * mm - 12, l1 * mm + 12]] }; };
  if (ONLY === 'niere' && built[0]) {
    /* v6: Varianten in Reihenfolge der Abweichung vom v5-Stand (Rs-Zuschlag m, Höhenversatz der Spirale m, Hub-Faktor); genommen wird die erste
       mit Spirale auf der Blase (Abweichung < 20 m), ohne Check-Fehler und ohne Querschnitt-Treffer. Befund v5: n_bumper kreuzt den Harnleiter (24 Stützstellen). */
    const VAR = [[75, 0, 1], [75, 0, 0.6], [75, -15, 1], [75, 15, 1], [75, -30, 1], [100, 0, 1], [100, -15, 1], [75, 30, 1], [100, -30, 1], [75, -45, 1], [125, -30, 1], [100, 30, 1]];
    let best = null, tried = [];
    for (const [off, dy, hk] of VAR) { for (const sg of [1, -1]) { const L = niereLoop(built[0], sg, { off, dy, hk }); try { const st2 = TC.compileRecipe({ schema: 'kfb.route-recipe/0.1-draft', id: 'O1_NIERE_N1', closed: true, start: L.start, defaults: { widthClass: 'STANDARD', markings: 'STREET', profile: { deckDepth: 0.6 } }, pieces: L.pieces });
      const j = st2.joints, a = j.findIndex(x => x.piece === 'n_bumper'), i0 = j[a].index, i1 = j[a + 1].index; let dm = 0, n = 0; for (let i = i0; i < i1; i += 10) { dm += Math.hypot(st2.samples[i].p[0] - L.Bw.x, st2.samples[i].p[2] - L.Bw.z); n++; }
      const err = Math.abs(dm / n - L.Rs), xh = crossHits(st2, built[0]), ce = (TC.runChecks(st2).results || []).filter(c => !c.pass && c.severity === 'error').map(c => c.id);
      const sc = (err < 20 ? 0 : 1e4) + ce.length * 1e3 + xh.n * 10 + err * 0.01, rec = { L, err, sg, off, dy, hk, xh: xh.n, minUret: xh.minUret, ce, sc };
      tried.push({ sg, off, dy, hk, err: r4(err), xh: xh.n, minUret: xh.minUret, ce: ce.join(',') }); if (!best || sc < best.sc) best = rec; } catch (e) { tried.push({ sg, off, dy, hk, fail: e.message }); } }
      if (best && best.sc < 1) break; }
    console.log('[N1 v6] Wahl', best && JSON.stringify({ sg: best.sg, off: best.off, dy: best.dy, hk: best.hk, err: r4(best.err), xh: best.xh, minUret: best.minUret, ce: best.ce, n: tried.length }));
    if (best) { NL = best.L; NL.side = best.sg; NL.err = r4(best.err); NL.pick = { off: best.off, dy: best.dy, hk: best.hk, minUret: best.minUret, tried: tried.length }; pieces.length = 0; pieces.push(...NL.pieces); built[0].segs = NL.segs; }
    else info.errors.push('Niere: keine Variante kompiliert');
  }

  /* v6 Attraktion Hirn (G1), nur Track-Core-Stücke: Schlucht durch die Fissura longitudinalis (Stirn → Hinterhaupt) → Booster → Gedankensprung
     (KICKER + AIR + LANDING) hinter dem Hinterhaupt → Abfahrt + Kehre (HAIRPIN_180) → unter dem Kleinhirn zur Hirnstamm-Spirale (2 Runden abwärts
     um die Medulla) → Anlauf unter dem Stirnhirn → Gedanken-Wendel (2½ Runden aufwärts vor der Stirn) → zurück in die Schlucht.
     Gemessen am H0-Feld (lokal mm: x links, y kranial, z anterior): Scheitelprofil neben der Mittellinie (x ±15 mm), Kleinhirn-Unterkante,
     Hirnstamm unterhalb des Kleinhirns (Achse, Radius, Spitze). Drehsinn der Stücke aus einem Probe-Kompilat (sideOfTurn), nicht angenommen. */
  const sideOfTurn = (() => { try { const t = TC.compileRecipe({ schema: 'kfb.route-recipe/0.1-draft', id: 'probe', closed: false, start: { p: [0, 0, 0], headingDeg: 0 }, defaults: { widthClass: 'STANDARD', markings: 'STREET' }, pieces: [{ id: 'p', type: 'SPIRAL', turn: 90, radius: 50, rise: 0 }] });
    const e = t.samples[t.samples.length - 1].p; return Math.sign(-e[0]) || 1; } catch (e) { info.errors.push('Drehsinn-Probe: ' + e.message); return 1; } })();   // Rechts bei Kurs 0 = (−1, 0, 0)
  const v2o = o => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, v && v.isVector3 ? P3(v) : v]));
  const Rt = psi => V3(-Math.cos(psi * DEG), 0, -Math.sin(psi * DEG));
  const hirnMeasure = B => { const G = B.G0, h = G.h, F = B.FD, top = (x, z) => { for (let y = G.o[1] + (G.ny - 1) * h; y > G.o[1]; y -= 0.5) if (samp(G, x, y, z) < 0) return y; return null; };
    const prof = []; for (let z = G.o[2]; z <= G.o[2] + (G.nz - 1) * h; z += 1) { const a = top(15, z), b = top(-15, z); prof.push([z, a == null || b == null ? null : Math.min(a, b)]); }
    const crown = Math.max(...prof.map(p => p[1] ?? -1e9)); let cblBot = 1e9, zMax = -1e9; const stemC = [];
    for (let k = 0; k < G.nz; k++) for (let j = 0; j < G.ny; j++) for (let i = 0; i < G.nx; i++) if (G.V[i + G.nx * (j + G.ny * k)] < 0) zMax = Math.max(zMax, G.o[2] + k * h);
    for (let k = 0; k < G.nz; k++) for (let j = 0; j < G.ny; j++) { const y = G.o[1] + j * h; if (y > -40) continue; for (let i = 0; i < G.nx; i++) { if (G.V[i + G.nx * (j + G.ny * k)] >= 0) continue; const x = G.o[0] + i * h, z = G.o[2] + k * h, r = F.regionAt(x, y, z); if (r === 40) cblBot = Math.min(cblBot, y); else if (r >= 41 && r <= 46) stemC.push([x, y, z]); } }
    const below = stemC.filter(p => p[1] < cblBot - 2), ax = [0, 0]; below.forEach(p => { ax[0] += p[0] / below.length; ax[1] += p[2] / below.length; });
    return { prof, crown, cblBot, zMax, stem: { x: ax[0], z: ax[1], r: below.length ? Math.max(...below.map(p => Math.hypot(p[0] - ax[0], p[2] - ax[1]))) : 12, bot: below.length ? Math.min(...below.map(p => p[1])) : cblBot - 20, n: below.length } }; };
  const hirnLoop = (B, M, o = {}) => { const mm = B.spec.mm, M2 = B.root.matrixWorld, W = (x, y, z) => V3(x, y, z).applyMatrix4(M2), tW = B.dock.tW.clone().setY(0).normalize(), back = tW.clone().negate();
    const s = o.side ?? 1, yC = M.crown - (o.depth ?? 19), psiA = psiOf(tW.x, tW.z), psiP = psiOf(back.x, back.z), L = Rt(psiA), tsg = -s * sideOfTurn;
    let zB = null, zF = null; for (const [z, yt] of M.prof) if (yt != null && yt > yC) { if (zB == null) zB = z; zF = z; }
    const S0 = W(0, yC, zF + 14 / mm), S1 = W(0, yC, zB - 8 / mm), lenC = S0.distanceTo(S1);
    const ySp = W(0, M.cblBot, 0).y - (o.cblGap ?? 16), Ax = W(M.stem.x, 0, M.stem.z), Rs = M.stem.r * mm + TC.WIDTHS.STANDARD / 2 + TC.SIDE_EXTENT + (o.sm ?? 8), SD = o.sd ?? 50;
    const Esp = Ax.clone().addScaledVector(L, s * Rs).setY(ySp).add(o.dEsp || V3());   // Eintritt Kurs anterior, Mitte = Stammachse
    const RH = o.rh ?? 120, hw = TC.WIDTHS.STANDARD / 2 + TC.SIDE_EXTENT, cF = W(0, 0, M.zMax).sub(W(0, 0, 0)).dot(tW) + RH + hw + (o.hm ?? 15),   // Wendel-Mitte so weit vor der Stirn, dass der hinterste Kreispunkt frei bleibt
      X = W(0, 0, 0).setY(S0.y).addScaledVector(tW, cF), yIn = ySp - SD + (o.climb ?? 40), RISE = S0.y - yIn;
    const Ehx = X.clone().addScaledVector(L, 2 * s * RH).setY(yIn).add(o.dEhx || V3());   // 2½ Runden: Austritt gegenüber, auf der Schluchtachse, Kurs posterior
    const ramp = { riseEase: 'ramp', riseBlend: 0.3 };
    const pcs = [{ id: 'schlucht_fissur', type: 'STRAIGHT', length: r4(lenC), markings: 'TRACK', tunnel: null, tags: ['organ', 'hirn', 'schlucht'] },
      { id: 'g_boost', type: 'STRAIGHT', length: 60, markings: 'MAG', drive: { mode: 'assist', fx: ['boost'] }, tags: ['booster'] },
      { id: 'g_sprung_kick', type: 'KICKER', length: 30, lipHeight: 2, lipDeg: 10, tags: ['sprung'] }, { id: 'g_sprung_air', type: 'AIR', gap: o.gap ?? 85, drop: o.drop ?? 80, drive: { mode: 'assist', fx: ['zero_g'] }, tags: ['sprung'] },
      { id: 'g_sprung_land', type: 'LANDING', length: 110, drop: 85, drive: { mode: 'assist', fx: ['magnet_catch'] }, tags: ['sprung'] },
      { id: 'g_abfahrt', type: 'STRAIGHT', length: 160, rise: -30, ...ramp },
      { id: 'g_kehre', type: 'HAIRPIN_180', dir: tsg, radius: o.rk ?? 90, rise: -50, ...ramp, bankDeg: 0 },
      way('g_unterzug', Esp, psiA, { stretch: 1.2, tunnel: null }),
      { id: 'g_stamm', type: 'SPIRAL', turn: tsg * 720, radius: r4(Rs), rise: -SD, ...ramp, bankDeg: 0, tags: ['stamm'] },
      way('g_anlauf', Ehx, psiA, { stretch: 1.2, markings: 'MAG', drive: { mode: 'assist', fx: ['boost'] }, tunnel: null }),
      { id: 'g_wendel', type: 'SPIRAL', turn: tsg * 900, radius: RH, rise: r4(RISE), ...ramp, bankDeg: 0, tags: ['wendel'] },
      { id: 'g_home', type: 'CONNECT', to: { p: P3(S0), headingDeg: r4(psiP), grade: 0 }, stretch: 1, params: thin, markings: 'TRACK' }];   // Befund closure: profile diff 1,6 m — nach Sprung und Landung ist das Deck wieder 2,25 m, Start 0,6 m (wie n_katapult_run)
    return { pieces: pcs, start: { p: P3(S0), headingDeg: r4(psiP) }, Rs, H: RISE, RH, Ax, X, segs: [[0, r4(lenC)]], recipeId: 'O1_HIRN_G1', geo: { yC: r4(yC), crown: r4(M.crown), zB: r4(zB), zF: r4(zF), cblBot: r4(M.cblBot), stem: { x: r4(M.stem.x), z: r4(M.stem.z), r: r4(M.stem.r), bot: r4(M.stem.bot), n: M.stem.n }, lenC: r4(lenC), ySp: r4(ySp) } }; };
  if (ONLY === 'hirn-g1' && built[0]) {   // v6 G1 (FAIL nach Brief), nur noch in v6 aktiv
    const M = hirnMeasure(built[0]); console.log('[G1] Messung', JSON.stringify({ crown: M.crown, cblBot: M.cblBot, stem: M.stem, sideOfTurn }));
    const VAR = [{}, { hm: 30 }, { rh: 140 }, { cblGap: 24 }, { sm: 14 }, { depth: 15 }, { rh: 140, hm: 30, sm: 14 }, { cblGap: 24, sm: 14, rk: 110 }, { depth: 23 }];
    let best = null; const tried = [];
    for (const v of VAR) { for (const side of [1, -1]) { const o = { ...v, side }; try {
        /* Spiralen mit Einlauf-Klothoide (ease r/2): Mitte und Austritt liegen nicht am Idealkreis. Ein Kompilat messen, Eintritt um die Abweichung
           verschieben, neu kompilieren (Eintrittskurs und -steigung fest → die Spirale verschiebt sich starr). */
        const cmp = L => TC.compileRecipe({ schema: 'kfb.route-recipe/0.1-draft', id: L.recipeId, closed: true, start: L.start, defaults: { widthClass: 'STANDARD', markings: 'STREET', profile: { deckDepth: 0.6 } }, pieces: L.pieces });
        const span = (st, id) => { const j = st.joints, a = j.findIndex(x => x.piece === id); return [j[a].index, a + 1 < j.length ? j[a + 1].index : st.samples.length]; };
        const L0 = hirnLoop(built[0], M, o), s0 = cmp(L0), [a0, b0] = span(s0, 'g_stamm'), cS = V3(); for (let i = a0; i < b0; i++) cS.add(V3(...s0.samples[i].p)); cS.multiplyScalar(1 / (b0 - a0));
        const [, bW] = span(s0, 'g_wendel'), eW = V3(...s0.samples[Math.min(bW, s0.samples.length - 1)].p);
        o.dEsp = V3(L0.Ax.x - cS.x, 0, L0.Ax.z - cS.z); o.dEhx = L0.X.clone().sub(eW); o.dEhx.y = 0;
        const L = hirnLoop(built[0], M, o), st2 = cmp(L);
        const xh = crossHits(st2, built[0], { clear: 3 }), ce = (TC.runChecks(st2).results || []).filter(c => !c.pass && c.severity === 'error').map(c => c.id + ':' + c.value + (c.note ? ' ' + c.note : '')), sc = ce.length * 1e3 + xh.n;
        tried.push({ ...v, side, corr: [r4(o.dEsp.length()), r4(o.dEhx.length())], xh: xh.n, by: xh.byPiece, ce: ce.join(',') }); if (!best || sc < best.sc) best = { L, o, sc, xh, ce }; } catch (e) { tried.push({ ...o, fail: e.message }); } }
      if (best && best.sc === 0) break; }
    console.log('[G1] Varianten', JSON.stringify(tried));
    if (best) { NL = best.L; NL.side = best.o.side; NL.err = 0; NL.pick = { ...best.o, xh: best.xh.n, ce: best.ce.join(','), tried: tried.length }; NL.Bw = null; pieces.length = 0; pieces.push(...NL.pieces); built[0].segs = NL.segs; console.log('[G1] Wahl', JSON.stringify(NL.pick), JSON.stringify(NL.geo)); }
    else info.errors.push('Hirn: keine Variante kompiliert · ' + JSON.stringify(tried.slice(0, 2)));
  }

  /* v6 Attraktion Herz (C1), nur Track-Core-Stücke: Kammer-Tunnel (O1-Achse, gemessen in prepIsland) → EKG-Strecke (CREST/DIP als P, Q, R, S, T)
     → Aorten-Looping (BLOCK.loop) → Kehre abwärts → Herzspitzen-Wirbel (2 Runden um die Spitze, abwärts) → Rückweg → Katapult-Kehre aufwärts mit
     Booster → zurück in den Tunnel. Gemessen: Herzspitze = tiefster Punkt der Herzwand (Welt), Breite der Wand bis Wirbel-Oberkante. Spiralen und
     Kehren mit Klothoide: ein Kompilat messen, Eintritt verschieben, neu kompilieren (wie G1). */
  const herzMeasure = B => { const G = B.G0, h = G.h, M2 = B.root.matrixWorld, P = [], v = V3();
    for (let k = 0; k < G.nz; k += 2) for (let j = 0; j < G.ny; j += 2) for (let i = 0; i < G.nx; i += 2) if (G.V[i + G.nx * (j + G.ny * k)] < 0) { v.set(G.o[0] + i * h, G.o[1] + j * h, G.o[2] + k * h).applyMatrix4(M2); P.push([v.x, v.y, v.z]); }
    let ap = P[0]; for (const p of P) if (p[1] < ap[1]) ap = p; return { P, apex: V3(...ap), yMax: Math.max(...P.map(p => p[1])) }; };
  const herzLoop = (B, H, o = {}) => { const tW = B.dock.tW.clone().setY(0).normalize(), psiT = psiOf(tW.x, tW.z), psiB = psiOf(-tW.x, -tW.z), L = Rt(psiT), LB = Rt(psiB), s = o.side ?? 1, tsg = -s * sideOfTurn;
    const S0 = B.dock.D0.clone(), S1 = B.dock.D1.clone(), lenT = S0.distanceTo(S1), hw = TC.WIDTHS.STANDARD / 2 + TC.SIDE_EXTENT;
    const top = H.apex.y + (o.wrap ?? 25), SD = o.sd ?? 50; let rr = 0; for (const p of H.P) if (p[1] < top + 8) rr = Math.max(rr, Math.hypot(p[0] - H.apex.x, p[2] - H.apex.z));
    const Rs = Math.max(40, rr + hw + (o.sm ?? 6)), Ax = H.apex.clone().setY(0);
    const Esp = Ax.clone().addScaledVector(LB, s * Rs).setY(top).add(o.dEsp || V3());
    const r2 = o.r2 ?? 80, Aout = S0.clone().addScaledVector(tW, -(o.back ?? 140)), rise2 = Math.min(70, (S0.y - (top - SD)) * 0.45);
    const B2 = Aout.clone().addScaledVector(LB, s * 2 * r2).setY(S0.y - rise2).add(o.dB2 || V3());   // Kehre 2: Austritt auf der Tunnelachse hinter dem Start
    const ramp = { riseEase: 'ramp', riseBlend: 0.3 }, ekg = t => ({ tags: ['ekg', t] }), drop1 = Math.min(60, (S0.y - top) * 0.5);
    const pcs = [{ id: 'tunnel_herz', type: 'STRAIGHT', length: r4(lenT), markings: 'TRACK', tunnel: { preset: 'gotthard' }, tags: ['organ', 'herz'] },
      { id: 'h_aus', type: 'STRAIGHT', length: 30, markings: 'TRACK', tunnel: null },   // Befund: ohne tunnel: null erbte die EKG-Strecke das Tunnel-Preset (tunnel_morph, tunnel_shell im Looping)
      { id: 'h_ekg_p', type: 'CREST', height: 4, length: 60, ...ekg('P') }, { id: 'h_ekg_pq', type: 'STRAIGHT', length: 15, ...ekg('PQ') },
      { id: 'h_ekg_q', type: 'DIP', height: 1.5, length: 36, ...ekg('Q') }, { id: 'h_ekg_qr', type: 'STRAIGHT', length: 8, ...ekg('QR') }, { id: 'h_ekg_r', type: 'CREST', height: o.rH ?? 14, length: 100, drive: { mode: 'assist', fx: ['boost'] }, markings: 'MAG', ...ekg('R') },
      { id: 'h_ekg_rs', type: 'STRAIGHT', length: 10, ...ekg('RS') }, { id: 'h_ekg_s', type: 'DIP', height: 4, length: 56, ...ekg('S') }, { id: 'h_ekg_st', type: 'STRAIGHT', length: 25, ...ekg('ST') },
      { id: 'h_ekg_t', type: 'CREST', height: 7, length: 80, ...ekg('T') }, { id: 'h_ekg_tp', type: 'STRAIGHT', length: 40, ...ekg('TP') },
      ...BLOCK.loop('h'),
      { id: 'h_kehre', type: 'HAIRPIN_180', dir: tsg, radius: o.r1 ?? 80, rise: r4(-drop1), ...ramp, bankDeg: 0 },
      way('h_abstieg', Esp, psiB, { stretch: 1.2, tunnel: null }),
      { id: 'h_wirbel', type: 'SPIRAL', turn: tsg * 720, radius: r4(Rs), rise: -SD, ...ramp, bankDeg: 0, tags: ['wirbel'] },
      way('h_rueck', B2, psiB, { stretch: 1.2, tunnel: null }),
      { id: 'h_katapult', type: 'HAIRPIN_180', dir: tsg, radius: r2, rise: r4(rise2), ...ramp, bankDeg: 0, markings: 'MAG', drive: { mode: 'assist', fx: ['boost'] }, tags: ['katapult'] },
      { id: 'h_home', type: 'CONNECT', to: { p: P3(S0), headingDeg: r4(psiT), grade: 0 }, stretch: 1, params: thin, markings: 'TRACK' }];
    return { pieces: pcs, start: { p: P3(S0), headingDeg: r4(psiT) }, Rs, H: rise2, Ax, Aout, segs: [[0, r4(lenT)]], recipeId: 'O1_HERZ_C1', geo: { apex: P3(H.apex), Rs: r4(Rs), top: r4(top), lenT: r4(lenT) } }; };
  if (ONLY === 'herz-c1' && built[0]) {   // v6 C1 (FAIL nach Brief), nur noch in v6 aktiv
    const H = herzMeasure(built[0]); console.log('[C1] Messung', JSON.stringify({ apex: P3(H.apex), yMax: r4(H.yMax), n: H.P.length, D0: P3(built[0].dock.D0), D1: P3(built[0].dock.D1) }));
    const VAR = [{ wrap: 10 }, { wrap: 0 }, {}, { wrap: 10, sm: 14 }, { wrap: 10, back: 200 }, { wrap: 10, r1: 110, r2: 110 }, { wrap: -20 }, { wrap: 0, sm: 14, back: 200, r2: 110 }, { wrap: 10, rH: 10 }];
    const cmp = L => TC.compileRecipe({ schema: 'kfb.route-recipe/0.1-draft', id: L.recipeId, closed: true, start: L.start, defaults: { widthClass: 'STANDARD', markings: 'STREET', profile: { deckDepth: 0.6 } }, pieces: L.pieces });
    const span = (st, id) => { const j = st.joints, a = j.findIndex(x => x.piece === id); return [j[a].index, a + 1 < j.length ? j[a + 1].index : st.samples.length]; };
    let best = null; const tried = [];
    for (const v of VAR) { for (const side of [1, -1]) { const o = { ...v, side }; try {
        const L0 = herzLoop(built[0], H, o), s0 = cmp(L0), [a0, b0] = span(s0, 'h_wirbel'), cS = V3(); for (let i = a0; i < b0; i++) cS.add(V3(...s0.samples[i].p)); cS.multiplyScalar(1 / (b0 - a0));
        const [, bK] = span(s0, 'h_katapult'), eK = V3(...s0.samples[Math.min(bK, s0.samples.length - 1)].p);
        o.dEsp = V3(L0.Ax.x - cS.x, 0, L0.Ax.z - cS.z); o.dB2 = L0.Aout.clone().sub(eK); o.dB2.y = 0;
        const L = herzLoop(built[0], H, o), st2 = cmp(L), xh = crossHits(st2, built[0], { skip: /^tunnel_/ }), ce = (TC.runChecks(st2).results || []).filter(c => !c.pass && c.severity === 'error').map(c => c.id + ':' + c.value + (c.note ? ' ' + c.note : '')), sc = ce.length * 1e3 + xh.n;
        tried.push({ ...v, side, corr: [r4(o.dEsp.length()), r4(o.dB2.length())], xh: xh.n, by: xh.byPiece, ce: ce.join(',') }); if (!best || sc < best.sc) best = { L, o, sc, xh, ce }; } catch (e) { tried.push({ ...v, side, fail: e.message }); } }
      if (best && best.sc === 0) break; }
    console.log('[C1] Varianten', JSON.stringify(tried));
    if (best) { NL = best.L; NL.side = best.o.side; NL.err = 0; NL.pick = { ...v2o(best.o), xh: best.xh.n, ce: best.ce.join(','), tried: tried.length }; pieces.length = 0; pieces.push(...NL.pieces); built[0].segs = NL.segs; console.log('[C1] Wahl', JSON.stringify(NL.pick), JSON.stringify(NL.geo)); }
    else info.errors.push('Herz: keine Variante kompiliert · ' + JSON.stringify(tried.slice(0, 2)));
  }

  /* v6 Attraktion Darm (E1), nur Track-Core-Stücke: Verdauungs-Tunnel (O1-Achse) → Peristaltik-Slalom (3 × OFFSET_S) → Booster → Darmsprung
     (KICKER + AIR + LANDING wie N1 v4) → Kehre abwärts → Rektum-Spirale (2 Runden abwärts um das Rektum) → Rückweg → Katapult-Kehre aufwärts
     mit Booster → zurück in den Tunnel. Gemessen: Rektum = Zellen Region 5 (Achse, Unterkante), Breite des Darmpakets bis Spiral-Oberkante. */
  const darmMeasure = B => { const G = B.G0, h = G.h, M2 = B.root.matrixWorld, P = [], R5 = [], v = V3();
    for (let k = 0; k < G.nz; k += 2) for (let j = 0; j < G.ny; j += 2) for (let i = 0; i < G.nx; i += 2) if (G.V[i + G.nx * (j + G.ny * k)] < 0) { const x = G.o[0] + i * h, y = G.o[1] + j * h, z = G.o[2] + k * h; v.set(x, y, z).applyMatrix4(M2); const p = [v.x, v.y, v.z]; P.push(p); if (B.FD.regionAt(x, y, z) === 5) R5.push(p); }
    const c = [0, 0]; R5.forEach(p => { c[0] += p[0] / R5.length; c[1] += p[2] / R5.length; }); let bot = 1e9; for (const p of R5) bot = Math.min(bot, p[1]);
    return { P, ax: V3(c[0], 0, c[1]), bot, n: R5.length }; };
  const darmLoop = (B, D, o = {}) => { const tW = B.dock.tW.clone().setY(0).normalize(), psiT = psiOf(tW.x, tW.z), psiB = psiOf(-tW.x, -tW.z), LB = Rt(psiB), s = o.side ?? 1, tsg = -s * sideOfTurn;
    const pre = o.pre ?? 25, S0 = B.dock.D0.clone().addScaledVector(tW, -pre), lenT = S0.distanceTo(B.dock.D1), hw = TC.WIDTHS.STANDARD / 2 + TC.SIDE_EXTENT;   // Befund: d_home streifte 12 m vor dem Portal die Flanke → Tunnel 25 m früher
    const tun = [{ id: 'tunnel_darm', type: 'STRAIGHT', length: r4(lenT), markings: 'TRACK', tunnel: { preset: 'gotthard' }, tags: ['organ', 'darm'] }];   // ein Stück: die O1-Lücke zwischen den Abschnitten (Mittellinie frei) berührt mit dem Querschnitt 40× das Paket
    const top = D.bot + (o.wrap ?? 30), SD = o.sd ?? 50; let rr = 0; for (const p of D.P) if (p[1] < top + 8) rr = Math.max(rr, Math.hypot(p[0] - D.ax.x, p[2] - D.ax.z));
    const Rs = Math.max(40, rr + hw + (o.sm ?? 6)), Ax = D.ax.clone();
    const Esp = Ax.clone().addScaledVector(LB, s * Rs).setY(top).add(o.dEsp || V3());
    const r2 = o.r2 ?? 80, Aout = S0.clone().addScaledVector(tW, -(o.back ?? 140)), rise2 = Math.min(70, Math.max(10, (S0.y - (top - SD)) * 0.45));
    const B2 = Aout.clone().addScaledVector(LB, s * 2 * r2).setY(S0.y - rise2).add(o.dB2 || V3());
    const ramp = { riseEase: 'ramp', riseBlend: 0.3 }, yJ = S0.y + 2 - 40 - 50, drop1 = clamp((yJ - top) * 0.5, -40, 60), sh = o.sl ?? 24, pe = { tags: ['peristaltik'] };
    const pcs = [...tun,
      { id: 'd_aus', type: 'STRAIGHT', length: 30, markings: 'TRACK', tunnel: null },
      { id: 'd_slalom1', type: 'OFFSET_S', length: 120, shift: sh, ...pe }, { id: 'd_slalom2', type: 'OFFSET_S', length: 140, shift: -2 * sh, ...pe }, { id: 'd_slalom3', type: 'OFFSET_S', length: 120, shift: sh, ...pe },
      { id: 'd_boost', type: 'STRAIGHT', length: 50, markings: 'MAG', drive: { mode: 'assist', fx: ['boost'] }, tags: ['booster'] },
      { id: 'd_sprung_kick', type: 'KICKER', length: 30, lipHeight: 2, lipDeg: 10, tags: ['sprung'] }, { id: 'd_sprung_air', type: 'AIR', gap: 60, drop: 40, drive: { mode: 'assist', fx: ['zero_g'] }, tags: ['sprung'] },
      { id: 'd_sprung_land', type: 'LANDING', length: 90, drop: 50, drive: { mode: 'assist', fx: ['magnet_catch'] }, tags: ['sprung'] },
      { id: 'd_kehre', type: 'HAIRPIN_180', dir: tsg, radius: o.r1 ?? 80, rise: r4(-drop1), ...ramp, bankDeg: 0 },
      way('d_abstieg', Esp, psiB, { stretch: 1.2, tunnel: null }),
      { id: 'd_rektum', type: 'SPIRAL', turn: tsg * 720, radius: r4(Rs), rise: -SD, ...ramp, bankDeg: 0, tags: ['rektum'] },
      way('d_rueck', B2, psiB, { stretch: 1.2, tunnel: null }),
      { id: 'd_katapult', type: 'HAIRPIN_180', dir: tsg, radius: r2, rise: r4(rise2), ...ramp, bankDeg: 0, markings: 'MAG', drive: { mode: 'assist', fx: ['boost'] }, tags: ['katapult'] },
      { id: 'd_home', type: 'CONNECT', to: { p: P3(S0), headingDeg: r4(psiT), grade: 0 }, stretch: 1, params: thin, markings: 'TRACK' }];
    return { pieces: pcs, start: { p: P3(S0), headingDeg: r4(psiT) }, Rs, H: rise2, Ax, Aout, segs: B.segs.map(x => [...x]), recipeId: 'O1_DARM_E1', geo: { rektum: P3(D.ax), bot: r4(D.bot), n: D.n, Rs: r4(Rs), top: r4(top), lenT: r4(lenT) } }; };
  if (ONLY === 'darm-e1' && built[0]) {   // v6 E1 (FAIL nach Brief), nur noch in v6 aktiv
    const D = darmMeasure(built[0]); console.log('[E1] Messung', JSON.stringify({ rektum: P3(D.ax), bot: r4(D.bot), n: D.n, D0: P3(built[0].dock.D0), D1: P3(built[0].dock.D1), segs: built[0].segs }));
    const VAR = [{}, { wrap: 15 }, { sm: 14 }, { back: 200 }, { r1: 110, r2: 110 }, { sl: 16 }, { wrap: 0, sm: 14 }, { sm: 14, back: 200, r2: 110 }, { wrap: -20 }];
    const cmp = L => TC.compileRecipe({ schema: 'kfb.route-recipe/0.1-draft', id: L.recipeId, closed: true, start: L.start, defaults: { widthClass: 'STANDARD', markings: 'STREET', profile: { deckDepth: 0.6 } }, pieces: L.pieces });
    const span = (st, id) => { const j = st.joints, a = j.findIndex(x => x.piece === id); return [j[a].index, a + 1 < j.length ? j[a + 1].index : st.samples.length]; };
    let best = null; const tried = [];
    for (const v of VAR) { for (const side of [1, -1]) { const o = { ...v, side }; try {
        const L0 = darmLoop(built[0], D, o), s0 = cmp(L0), [a0, b0] = span(s0, 'd_rektum'), cS = V3(); for (let i = a0; i < b0; i++) cS.add(V3(...s0.samples[i].p)); cS.multiplyScalar(1 / (b0 - a0));
        const [, bK] = span(s0, 'd_katapult'), eK = V3(...s0.samples[Math.min(bK, s0.samples.length - 1)].p);
        o.dEsp = V3(L0.Ax.x - cS.x, 0, L0.Ax.z - cS.z); o.dB2 = L0.Aout.clone().sub(eK); o.dB2.y = 0;
        const L = darmLoop(built[0], D, o), st2 = cmp(L), xh = crossHits(st2, built[0], { skip: /^tunnel_/ }), ce = (TC.runChecks(st2).results || []).filter(c => !c.pass && c.severity === 'error').map(c => c.id + ':' + c.value + (c.note ? ' ' + c.note : '')), sc = ce.length * 1e3 + xh.n;
        tried.push({ ...v, side, corr: [r4(o.dEsp.length()), r4(o.dB2.length())], xh: xh.n, by: xh.byPiece, ce: ce.join(',') }); if (!best || sc < best.sc) best = { L, o, sc, xh, ce }; } catch (e) { tried.push({ ...v, side, fail: e.message }); } }
      if (best && best.sc === 0) break; }
    console.log('[E1] Varianten', JSON.stringify(tried));
    if (best) { NL = best.L; NL.side = best.o.side; NL.err = 0; NL.pick = { ...v2o(best.o), xh: best.xh.n, ce: best.ce.join(','), tried: tried.length }; pieces.length = 0; pieces.push(...NL.pieces); built[0].segs = NL.segs; console.log('[E1] Wahl', JSON.stringify(NL.pick), JSON.stringify(NL.geo)); }
    else info.errors.push('Darm: keine Variante kompiliert · ' + JSON.stringify(tried.slice(0, 2)));
  }

  /* v7 Attraktion Darm (E2) nach BRIEF_ORGAN_ATTRAKTIONEN.md: »Fahrt durch den Dickdarm als Tunnel-Strecke«. Deck 4 m unter der gemessenen
     Colon-Mittellinie (die Schnittröhre CUT_UP sitzt auf der Achse), Stützpunkte alle ~45 m, Kurs und Steigung aus der Linie, CONNECT-Stücke.
     Caecum → ascendens → Flexura dextra → transversum → Flexura sinistra → descendens → sigmoideum → Rektum → Anus. Rückweg außen um das Paket.
     Booster/Assist bewusst nicht (Brief: später, falls die Physik nicht passt). */
  if (ONLY === 'darm' && built[0] && built[0].colon) {
    const B = built[0], CL = B.colon, M2 = B.root.matrixWorld, inv = M2.clone().invert(), dk = CL.pts.map(p => p.clone().applyMatrix4(M2)).map(p => p.setY(p.y - CUT_UP));
    const sA = [0]; for (let i = 1; i < dk.length; i++) sA.push(sA[i - 1] + dk[i].distanceTo(dk[i - 1]));
    const tanAt = i => dk[Math.min(dk.length - 1, i + 3)].clone().sub(dk[Math.max(0, i - 3)]).normalize(), hd = T => psiOf(T.x, T.z), gr = T => T.y / (Math.hypot(T.x, T.z) || 1e-6);
    const Cw = B.I.Cw.clone(); let Rb = 0; { const G = B.G0, v = V3(); for (let k = 0; k < G.nz; k += 3) for (let j = 0; j < G.ny; j += 3) for (let i = 0; i < G.nx; i += 3) if (G.V[i + G.nx * (j + G.ny * k)] < 0) { v.set(G.o[0] + i * G.h, G.o[1] + j * G.h, G.o[2] + k * G.h).applyMatrix4(M2); Rb = Math.max(Rb, Math.hypot(v.x - Cw.x, v.z - Cw.z)); } }
    const build = (o = {}) => { const step = o.step ?? 45, wp = []; for (let i = 0, next = 0; i < dk.length; i++) if (sA[i] >= next || i === dk.length - 1) { wp.push(i); next = sA[i] + step; }
      if (sA[dk.length - 1] - sA[wp[wp.length - 2]] < step * 0.5) wp.splice(wp.length - 2, 1);
      const T0 = tanAt(wp[0]), Tn = tanAt(wp[wp.length - 1]), h0 = T0.clone().setY(0).normalize(), hn = Tn.clone().setY(0).normalize();
      const outAt = (p0, d) => { const p = p0.clone(), v = V3(); for (let t = 0; t < 600; t += 4) { p.copy(p0).addScaledVector(d, t); v.copy(p).applyMatrix4(inv); if (samp(B.G0, v.x, v.y, v.z) * B.spec.mm > 30) return p.addScaledVector(d, o.lead ?? 50); } return p; };   // bis 30 m außerhalb des Pakets, dann Anlauf
      const A0 = outAt(dk[wp[0]], h0.clone().negate()), Eo = outAt(dk[wp[wp.length - 1]], hn); A0.y = dk[wp[0]].y; Eo.y = dk[wp[wp.length - 1]].y;
      const psi0 = hd(h0), pcs = [{ id: 'e_anfahrt', type: 'STRAIGHT', length: 30, markings: 'TRACK' }];
      wp.forEach((i, k) => { const T = tanAt(i); pcs.push({ id: 'tunnel_darm_' + k, type: 'CONNECT', to: { p: P3(dk[i]), headingDeg: r4(hd(T)), grade: r4(gr(T)) }, stretch: 1, markings: 'TRACK', tunnel: { preset: 'gotthard' }, tags: ['organ', 'darm', k ? 'colon' : 'caecum'] }); });
      pcs.push({ id: 'tunnel_darm_anus', type: 'CONNECT', to: { p: P3(Eo), headingDeg: r4(hd(hn)), grade: 0 }, stretch: 1, markings: 'TRACK', tunnel: { preset: 'gotthard' }, tags: ['organ', 'darm', 'rektum'] });
      const ang = p => Math.atan2(p.z - Cw.z, p.x - Cw.x), aE = ang(Eo), aA = ang(A0), dir = o.dir ?? 1; let sw = dir > 0 ? aA - aE : aE - aA; sw = ((sw % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI); if (sw < 0.6) sw += 2 * Math.PI;
      const Rr = Rb + (o.margin ?? 70), n = o.n ?? 3;
      for (let m = 1; m <= n; m++) { const f = m / (n + 1), a = aE + dir * sw * f, p = V3(Cw.x + Math.cos(a) * Rr, Eo.y + (A0.y - Eo.y) * f, Cw.z + Math.sin(a) * Rr), tx = -Math.sin(a) * dir, tz = Math.cos(a) * dir;
        pcs.push({ id: 'e_rueck_' + m, type: 'CONNECT', to: { p: P3(p), headingDeg: r4(psiOf(tx, tz)), grade: r4((A0.y - Eo.y) / (sw * Rr)) }, stretch: 1, markings: 'TRACK', tunnel: null }); }
      const A00 = A0.clone().addScaledVector(h0, -30); pcs.push({ id: 'e_home', type: 'CONNECT', to: { p: P3(A00), headingDeg: r4(psi0), grade: 0 }, stretch: 1, params: thin, markings: 'TRACK', tunnel: null, bankDeg: 0 });   // Befund closure U 2e-4: Start auf einer Geraden, Ende ohne Querneigung
      const start = { p: P3(A00), headingDeg: r4(psi0) };
      return { pieces: pcs, start, Rs: r4(Rr), H: r4(CL.maxGrade), segs: [[0, r4(sA[dk.length - 1])]], recipeId: 'O1_DARM_E2', geo: { colonMM: r4(CL.len), maxGrade: r4(CL.maxGrade), up: P3(CL.up), th: CL.th, ph: CL.ph, wp: wp.length, Rb: r4(Rb), n4: CL.n4, n5: CL.n5 } }; };
    console.log('[E2] Linie', JSON.stringify({ len: r4(CL.len), maxGrade: r4(CL.maxGrade), th: CL.th, ph: CL.ph, pts: CL.pts.length, Rb: r4(Rb) }));
    const cmp = L => TC.compileRecipe({ schema: 'kfb.route-recipe/0.1-draft', id: L.recipeId, closed: true, start: L.start, defaults: { widthClass: 'STANDARD', markings: 'STREET', profile: { deckDepth: 0.6 } }, pieces: L.pieces });
    const wall = st => { let n = 0, m = 0; const v = V3(), J = st.joints; for (let k = 0; k < J.length; k++) { if (!/^tunnel_darm/.test(J[k].piece)) continue; const e = k + 1 < J.length ? J[k + 1].index : st.samples.length; for (let i = J[k].index; i < e; i += 4) { const q = st.samples[i]; v.set(q.p[0] + q.U[0] * CUT_UP, q.p[1] + q.U[1] * CUT_UP, q.p[2] + q.U[2] * CUT_UP).applyMatrix4(inv); m++; if (samp(B.G0, v.x, v.y, v.z) * B.spec.mm > -(CUT_R + 2) && !/_(0|anus)$/.test(J[k].piece)) n++; } } return { n, m }; };   // Loch: Schnittröhre (r 13 m) reicht bis 2 m an die Darmwand; Ein-/Ausfahrt ausgenommen
    const VAR = [{}, { dir: -1 }, { step: 35 }, { step: 35, dir: -1 }, { margin: 110 }, { margin: 110, dir: -1 }, { step: 60 }, { step: 60, dir: -1 }, { n: 4, margin: 110 }, { n: 4, margin: 110, dir: -1 }];
    let best = null; const tried = [];
    for (const o of VAR) { try { const L = build(o), st2 = cmp(L), xh = crossHits(st2, B), ce = (TC.runChecks(st2).results || []).filter(c => !c.pass && c.severity === 'error').map(c => c.id + ':' + c.value + (c.note ? ' ' + c.note : '')), wl = wall(st2), sc = ce.length * 1e3 + xh.n * 10 + wl.n;
        tried.push({ ...o, xh: xh.n, by: xh.byPiece, wall: wl.n + '/' + wl.m, ce: ce.join(',') }); if (!best || sc < best.sc) best = { L, o, sc, xh, ce, wl }; if (!ce.length && !xh.n && !wl.n) break; } catch (e) { tried.push({ ...o, fail: e.message }); } }
    console.log('[E2] Varianten', JSON.stringify(tried));
    if (best) { NL = best.L; NL.side = best.o.dir ?? 1; NL.err = 0; NL.pick = { ...best.o, xh: best.xh.n, wall: best.wl.n + '/' + best.wl.m, ce: best.ce.join(','), tried: tried.length }; pieces.length = 0; pieces.push(...NL.pieces); built[0].segs = NL.segs; console.log('[E2] Wahl', JSON.stringify(NL.pick), JSON.stringify(NL.geo)); }
    else info.errors.push('Darm E2: keine Variante kompiliert · ' + JSON.stringify(tried.slice(0, 2)));
  }

  /* v7 Attraktion Hirn (G2) nach BRIEF_ORGAN_ATTRAKTIONEN.md (Georg 03.10. abends präzisiert): Spirale kreisförmig um die Hirnoberfläche +
     leicht gewundene Tunnelstrecke Frontalhirn → Sehrinde, metaphorisch entlang Sehnerv, Chiasma, Tractus opticus und Sehstrahlung.
     Gemessen am H0-Feld (lokal mm: x links, y kranial, z anterior): Chiasma = Oberflächenzellen Region 46, Sehrinde = Region 16/17, Stirnpol und
     Hinterhauptpol je Höhe aus dem Feld, Hülle (blurG wie Hero) je Höhe und Richtung für die Spirale. Tunnel 10 mm über dem Chiasma (Röhre bleibt in
     der Hirnbasis). Spirale steigt vom Hinterhaupt-Ausgang 2¼ Runden zur Stirn hinauf (oberste Runde nahe dem Scheitel), Abfahrt weit vor der Stirn zurück in den Sehnerv-Tunnel. */
  if (ONLY === 'hirn' && built[0]) {
    const B = built[0], mm = B.spec.mm, M2 = B.root.matrixWorld, inv = M2.clone().invert(), G = B.G0, GH = blurG(G, Math.max(1, Math.round(B.spec.hullMM / B.h)), 3), W = v => v.clone().applyMatrix4(M2);
    const surfC = ids => { const c = V3(); let n = 0; for (let k = 0; k < G.nz; k++) for (let j = 0; j < G.ny; j++) for (let i = 0; i < G.nx; i++) { const q = i + G.nx * (j + G.ny * k); if (Math.abs(G.V[q]) > 1.5) continue; const x = G.o[0] + i * G.h, y = G.o[1] + j * G.h, z = G.o[2] + k * G.h; if (ids.includes(B.FD.regionAt(x, y, z))) { c.x += x; c.y += y; c.z += z; n++; } } return n ? c.multiplyScalar(1 / n) : null; };
    const CHI = surfC([46]) || V3(0, -23, 26), OCC = { 1: surfC([17]) || V3(21, -24, -74), [-1]: surfC([16]) || V3(-21, -24, -74) };
    const poleZ = (x, y, sg) => { for (let t = 140; t > -140; t -= 0.5) { const z = sg * t; if (samp(G, x, y, z) < 0) return z; } return 0; };
    const rimAt = (y, ph) => { const d = V3(Math.sin(ph), 0, Math.cos(ph)); for (let t = 160; t > 0; t -= 0.5) if (samp(GH, d.x * t, y, d.z * t) < 0) return t; return null; };
    const hd = T => psiOf(T.x, T.z), gr = T => T.y / (Math.hypot(T.x, T.z) || 1e-6);
    const wpc = (id, p, T, x = {}) => ({ id, type: 'CONNECT', to: { p: P3(p), headingDeg: r4(hd(T)), grade: r4(gr(T)) }, stretch: 1, markings: 'TRACK', tunnel: null, ...x });
    const resample = (P, step) => { const out = [P[0]], sA = [0]; for (let i = 1; i < P.length; i++) sA.push(sA[i - 1] + P[i].distanceTo(P[i - 1])); for (let i = 1, nx2 = step; i < P.length; i++) if (sA[i] >= nx2 || i === P.length - 1) { out.push(P[i]); nx2 = sA[i] + step; } if (out.length > 2 && out[out.length - 1].distanceTo(out[out.length - 2]) < step * 0.5) out.splice(out.length - 2, 1); return out; };
    const tanP = (P, i) => P[Math.min(P.length - 1, i + 1)].clone().sub(P[Math.max(0, i - 1)]).normalize();
    const outAt = (pL, dL) => { const p = pL.clone(); for (let t = 0; t < 120; t += 0.5) { p.copy(pL).addScaledVector(dL, t); if (samp(G, p.x, p.y, p.z) * mm > 30) return p; } return p; };
    const build = (o = {}) => { const s2 = o.side ?? 1, dirS = o.dir ?? 1, yEnt = o.yEnt ?? -8, yC = CHI.y + (o.cAbove ?? 10), Oc = OCC[s2], yExit = Math.max(Oc.y + 14, -14), yT = o.yT ?? 46, del = (o.del ?? 55) * DEG, inset = o.inset ?? 2;
      /* Tunnel: Stirnpol (Sehnerv) → Chiasma → Tractus (seitlich) → Sehstrahlung → Sehrinde (Hinterhauptpol) */
      const Pin = V3(0, yEnt, poleZ(0, yEnt, 1) - 12), Pc = V3(CHI.x, yC, CHI.z), Pl = V3(s2 * (o.lx ?? 22), yC + 3, -8), Pr = V3(s2 * (o.rx ?? 30), (yC + yExit) / 2 + 2, -42), Po = V3(s2 * 12, yExit, poleZ(s2 * 12, yExit, -1) + 12);
      const curve = new THREE.CatmullRomCurve3([Pin, Pc, Pl, Pr, Po], false, 'centripetal'), tl = curve.getPoints(160);
      const t0 = tl[1].clone().sub(tl[0]).normalize(), t1 = tl[tl.length - 1].clone().sub(tl[tl.length - 2]).normalize();
      const Ain = outAt(Pin, t0.clone().negate()), Aout = outAt(Po, t1);
      const tunL = [Ain, ...tl, Aout].map(p => { const w = W(p); w.y -= CUT_UP; return w; }), tunW = resample(tunL, o.step ?? 40);
      /* Spirale um die Hülle: vom Hinterhaupt (φ = π + dirS·δ) mit dirS herum zur Stirn (φ = −dirS·δ), 1 Runde + Rest, Höhe linear */
      const phS = Math.PI + dirS * del, phE = -dirS * del; let sw = ((phE - phS) * dirS) % (2 * Math.PI); if (sw < 0) sw += 2 * Math.PI; sw += 2 * Math.PI * (o.k ?? 2);
      const ySp0 = yExit + (o.y0 ?? 2), spL = []; for (let m = 0; m <= Math.ceil(sw / (2 * DEG)); m++) { const f = m / Math.ceil(sw / (2 * DEG)), ph = phS + dirS * sw * f, y = ySp0 + (yT - ySp0) * f, t = rimAt(y, ph); if (t == null) throw new Error('Hülle y ' + r4(y)); spL.push(W(V3(Math.sin(ph) * (t - inset), y, Math.cos(ph) * (t - inset)))); }
      let sp = spL; for (let pass = 0; pass < 3; pass++) sp = sp.map((p, i) => i === 0 || i === sp.length - 1 ? p : sp[i - 1].clone().add(p).add(p).add(sp[i + 1]).multiplyScalar(0.25));
      const spW = resample(sp, o.step ?? 45);
      const hIn = tanP(tunW, 0).setY(0).normalize(), A00 = tunW[0].clone().addScaledVector(hIn, -(o.lead ?? 90));
      const pcs = [{ id: 'g_anfahrt', type: 'STRAIGHT', length: 30, markings: 'TRACK' }];   // Befund tunnel_shell: Röhrenanfang und Schlussstück am Rundenstoß, s nicht umlaufend gezählt
      tunW.forEach((p, i) => { if (i) pcs.push(wpc('tunnel_hirn_' + i, p, tanP(tunW, i), { tunnel: { preset: 'gotthard' }, tags: ['organ', 'hirn', i < tunW.length * 0.25 ? 'sehnerv' : i < tunW.length * 0.45 ? 'chiasma' : i < tunW.length * 0.65 ? 'tractus' : 'sehstrahlung'] })); });
      spW.forEach((p, i) => pcs.push(wpc(i ? 'hang_hirn_spirale_' + i : 'hang_hirn_auffahrt', p, tanP(spW, i), { tags: ['spirale'] })));   // Auffahrt endet in der Hangstraße → ebenfalls hang_
      /* Abfahrt: vom Spiralende (Stirnseite, Kurs um die Stirn) weit vor die Stirn hinaus, dort quer zur Mitte, dann Bogen in den Sehnerv-Tunnel.
         Befund: Punkt dicht vor dem Pol + Kehre ließ die Abfahrt durch den Stirnlappen laufen (139 Treffer). */
      const yEw = W(V3(0, yEnt, 0)).y, yTw = W(V3(0, yT, 0)).y, F1 = W(V3(-dirS * (o.f1x ?? 27), 0, poleZ(0, yEnt, 1) + (o.f1z ?? 90))); F1.y = yTw - (yTw - yEw) * 0.6;
      const lx = W(V3(1, 0, 0)).sub(W(V3(0, 0, 0))).setY(0).normalize();
      const sE = spW[spW.length - 1], TE = tanP(spW, spW.length - 1), radW = W(V3(Math.sin(phE), 0, Math.cos(phE))).sub(W(V3(0, 0, 0))).setY(0).normalize();
      const F0 = sE.clone().addScaledVector(TE.clone().setY(0).normalize(), o.f0 ?? 70).addScaledVector(radW, o.f0o ?? 35); F0.y = sE.y - (sE.y - F1.y) * 0.25;   // Abgang aus der Hangstraße nach außen
      pcs.push(wpc('hang_hirn_abgang', F0, F0.clone().sub(sE).normalize()), wpc('g_stirn_hinaus', F1, lx.clone().multiplyScalar(dirS).setY(-0.1)), { id: 'g_home', type: 'CONNECT', to: { p: P3(A00), headingDeg: r4(hd(hIn)), grade: 0 }, stretch: 1, params: thin, markings: 'TRACK', tunnel: null, bankDeg: 0 });
      return { pieces: pcs, start: { p: P3(A00), headingDeg: r4(hd(hIn)) }, Rs: 0, H: r4((yT - ySp0) * mm), segs: [], recipeId: 'O1_HIRN_G2',
        geo: { chiasma: P3(CHI), sehrinde: P3(Oc), yEnt, yC: r4(yC), yExit: r4(yExit), yT, spiralTurns: r4(sw / (2 * Math.PI)), tunnelWp: tunW.length, spiralWp: spW.length } }; };
    const cmp = L => TC.compileRecipe({ schema: 'kfb.route-recipe/0.1-draft', id: L.recipeId, closed: true, start: L.start, defaults: { widthClass: 'STANDARD', markings: 'STREET', profile: { deckDepth: 0.6 } }, pieces: L.pieces });
    const embed = st => { const v = V3(), J = st.joints; let dmax = 0, fmax = 0, n = 0, br = 0; for (let k = 0; k < J.length; k++) { const id = J[k].piece, e = k + 1 < J.length ? J[k + 1].index : st.samples.length; for (let i = J[k].index; i < e; i += 3) { const q = st.samples[i]; if (/^hang_/.test(id)) { v.set(...q.p).applyMatrix4(inv); const d = samp(GH, v.x, v.y, v.z) * mm; dmax = Math.max(dmax, -d); fmax = Math.max(fmax, d); n++; } else if (/^tunnel_hirn_/.test(id) && !/_(1|2)$/.test(id)) { v.set(q.p[0] + q.U[0] * CUT_UP, q.p[1] + q.U[1] * CUT_UP, q.p[2] + q.U[2] * CUT_UP).applyMatrix4(inv); if (samp(G, v.x, v.y, v.z) * mm > -(CUT_R + 2)) br++; } } } return { tief: r4(dmax), hoch: r4(fmax), n, roehreAnWand: br }; };
    const VAR = [{ cAbove: 13, f1x: 40, f1z: 160 }, { cAbove: 13, f1x: 50, f1z: 200 }, { cAbove: 13, f1x: 40, f1z: 160, yT: 40 }, { cAbove: 13, f1x: 40, f1z: 160, f0: 100, f0o: 50 }, { cAbove: 13, f1x: 40, f1z: 120, k: 1, yT: 30 }, { cAbove: 13, f1x: 40, f1z: 160, dir: -1, side: -1 }];
    let best = null; const tried = [];
    for (const o of VAR) { try { const L = build(o), st2 = cmp(L), xh = crossHits(st2, B, { clear: 3 }), ce = (TC.runChecks(st2).results || []).filter(c => !c.pass && c.severity === 'error').map(c => c.id + ':' + c.value + (c.note ? ' ' + c.note : '')), em = embed(st2), sc = ce.length * 1e3 + xh.n * 10 + Math.max(0, em.tief - 15) + Math.max(0, em.hoch - 15);
        let fw = null; { const J = st2.joints; st2.samples.forEach((q, i) => { if (q.law !== 'guide' || Math.abs(q.kappa) < 1e-6) return; const m = 1 / Math.abs(q.kappa) - 11.6; if (!fw || m < fw.m) { let k = 0; while (k + 1 < J.length && J[k + 1].index <= i) k++; fw = { m: r4(m), piece: J[k].piece }; } }); }
        tried.push({ ...o, xh: xh.n, by: xh.byPiece, em, fold: fw, ce: ce.join(',') }); if (!best || sc < best.sc) best = { L, o, sc, xh, ce, em }; if (sc === 0) break; } catch (e) { tried.push({ ...o, fail: e.message }); } }
    console.log('[G2] Varianten', JSON.stringify(tried));
    if (best) { NL = best.L; NL.side = best.o.dir ?? 1; NL.err = 0; NL.pick = { ...best.o, xh: best.xh.n, em: best.em, ce: best.ce.join(','), tried: tried.length }; pieces.length = 0; pieces.push(...NL.pieces); built[0].segs = []; console.log('[G2] Wahl', JSON.stringify(NL.pick), JSON.stringify(NL.geo)); }
    else info.errors.push('Hirn G2: keine Variante kompiliert · ' + JSON.stringify(tried.slice(0, 2)));
  }

  /* v7 Attraktion Herz (C2) nach BRIEF_ORGAN_ATTRAKTIONEN.md: »Fahrt durch die Herzkammern als Tunnel-Strecke«, Weg des Blutes (Georg 03.10.):
     V. cava superior → rechter Vorhof → rechte Kammer → Truncus pulmonalis → außen (Lunge) → Vv. pulmonales → linker Vorhof → linke Kammer → Aorta
     ascendens → Arcus → außen zurück. Das Bake kennt nur die Herzwand (Kammern geflutet); Kammerpunkte aus den gemessenen Gefäßansätzen: Ansatz =
     Mittel der Gefäßzellen mit Nachbar Herzwand; Vorhof R = Mitte zwischen SVC- und IVC-Ansatz, Vorhof L = Ansatz Vv. pulmonales, Kammer R / L =
     zwischen Truncus- bzw. Aortenansatz und Herzspitze (weitester Wandpunkt von der Basis); jeder Punkt ins Volumen gezogen, bis 13 m Wand um die Röhre. */
  if (ONLY === 'herz' && built[0]) {
    const B = built[0], mm = B.spec.mm, M2 = B.root.matrixWorld, G = B.G0, W = v => v.clone().applyMatrix4(M2), RA_ = (x, y, z) => B.FD.regionAt(x, y, z);
    const HL = B.colon, cells = HL.cells, R = HL.R, apex = HL.apex, H1 = HL.H1;
    const hd = T => psiOf(T.x, T.z), gr = T => T.y / (Math.hypot(T.x, T.z) || 1e-6), tanP = (P, i) => P[Math.min(P.length - 1, i + 1)].clone().sub(P[Math.max(0, i - 1)]).normalize();
    const resample = (P, step) => { const out = [P[0]], sA = [0]; for (let i = 1; i < P.length; i++) sA.push(sA[i - 1] + P[i].distanceTo(P[i - 1])); for (let i = 1, n2 = step; i < P.length; i++) if (sA[i] >= n2 || i === P.length - 1) { out.push(P[i]); n2 = sA[i] + step; } if (out.length > 2 && out[out.length - 1].distanceTo(out[out.length - 2]) < step * 0.9) out.splice(out.length - 2, 1); return out; };   /* Befund fold l13: kurzes Schlussstück mit Kursknick */
    const wpc = (id, p, T, x = {}) => ({ id, type: 'CONNECT', to: { p: P3(p), headingDeg: r4(hd(T)), grade: r4(gr(T)) }, stretch: 1, markings: 'TRACK', tunnel: null, ...x });
    const build = (o = {}) => { const CC = HL.ctrl(o), RAp = CC.RAp, RVp = CC.RVp, LAp = CC.LAp, LVp = CC.LVp;
      const raw = ctrl => { let pts = new THREE.CatmullRomCurve3(ctrl, false, 'centripetal').getPoints(240).map(p => { const w = W(p); w.y -= CUT_UP; return w; });
        for (let pass = 0; pass < (o.sm ?? (o.u2 ? 8 : 40)); pass++) pts = pts.map((p, i) => i < 2 || i > pts.length - 3 ? p : pts[i - 2].clone().add(pts[i - 1]).add(p).add(pts[i + 1]).add(pts[i + 2]).multiplyScalar(0.2));
        /* nur enge Stellen nachglätten: Umkreisradius über ±k Punkte (≈ 2 × 12 m), unter Rmin zum Mittel der Nachbarn ziehen; Enden fest */
        const Rmin = o.rmin ?? 34; for (let it = 0; it < 300; it++) { let moved = 0; for (let i = 6; i < pts.length - 6; i++) { const a = pts[i - 5], b = pts[i], c = pts[i + 5], ab = a.distanceTo(b), bc = b.distanceTo(c), ca = c.distanceTo(a), ar = b.clone().sub(a).cross(c.clone().sub(a)).length() / 2, Rc = ar > 1e-6 ? ab * bc * ca / (4 * ar) : 1e9;
          if (Rc < Rmin) { b.lerp(pts[i - 1].clone().add(pts[i + 1]).multiplyScalar(0.5), 0.35); moved++; } } if (!moved) break; }
        return pts; };   /* Befund inner_edge_fold: Kammerknicke enger als 12 m → glätten, Enden fest */
      const P1 = raw(CC.c1), P2 = raw(CC.c2), Dm = o.dm ?? 42;
      /* Befund tunnel_shell: Truncus pulmonalis und Aorta liegen anatomisch aneinander, die Röhren (r 15 m) überlappten um 9,5 m. Beide Linien dort
         auseinanderschieben, bis die Mitten Dm auseinander sind (gemessen je Iteration), danach glätten; die Wandmantel-Regel hält die Gefäßwand. */
      let dmin = 1e9; for (let it = 0; it < (o.rit ?? 0); it++) { dmin = 1e9; const m1 = P1.map(() => V3()), m2 = P2.map(() => V3());
        for (let i = 2; i < P1.length - 2; i++) for (let j = 2; j < P2.length - 2; j++) { const d = P1[i].distanceTo(P2[j]); if (d < dmin) dmin = d; if (d < Dm) { const n = P1[i].clone().sub(P2[j]).normalize().multiplyScalar((Dm - d) * 0.25); m1[i].add(n); m2[j].sub(n); } }
        P1.forEach((p, i) => p.add(m1[i])); P2.forEach((p, j) => p.add(m2[j]));
        for (const P of [P1, P2]) for (let i = 2; i < P.length - 2; i++) P[i].lerp(P[i - 1].clone().add(P[i + 1]).multiplyScalar(0.5), 0.5); if (dmin >= Dm) break; }
      let near = { d: 1e9 }; for (let i = 0; i < P1.length; i += 2) for (let j = 0; j < P2.length; j += 2) { const dd = P1[i].distanceTo(P2[j]); if (dd < near.d) near = { d: r4(dd), f1: r4(i / P1.length), f2: r4(j / P2.length) }; }
      const tube = (pts, id, tags) => resample(pts, o.step ?? 35).map((p, i, A) => ({ p, T: tanP(A, i), id: id + i, tags }));
      const T1 = tube(P1, 'tunnel_herz_r', ['organ', 'herz', 'rechts']), T2 = tube(P2, 'tunnel_herz_l', ['organ', 'herz', 'links']);
      const Cw = W(H1); let Rb = 0; for (const p of cells[1]) Rb = Math.max(Rb, Math.hypot(W(p).x - Cw.x, W(p).z - Cw.z)); Rb = Math.min(Rb, 400);
      const arc = (a, b, id, dir, Tend) => { const aa = Math.atan2(a.z - Cw.z, a.x - Cw.x), ab = Math.atan2(b.z - Cw.z, b.x - Cw.x);
        if (Tend && o.auto !== 0) dir = Math.sign(-Math.sin(ab) * Tend.x + Math.cos(ab) * Tend.z) || dir;   /* Befund fold h_einflug0: Bogen lief gegen den Zielkurs → Drehsinn aus der Zieltangente */ let sw = dir > 0 ? ab - aa : aa - ab; sw = ((sw % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI); if (sw < 0.5) sw += 2 * Math.PI; const out = [], Rr = Rb + (o.margin ?? 80), n = Math.max(2, Math.round(sw / 1.1));
        for (let m = 1; m <= n; m++) { const f = m / (n + 1), an = aa + dir * sw * f, p = V3(Cw.x + Math.cos(an) * Rr, a.y + (b.y - a.y) * f, Cw.z + Math.sin(an) * Rr); out.push(wpc(id + m, p, V3(-Math.sin(an) * dir, (b.y - a.y) / (sw * Rr), Math.cos(an) * dir))); }
        if (/koerper/.test(id) && o.mid) { const lastP = V3(...out[out.length - 1].to.p), M = lastP.clone().lerp(b, 0.5), dM = b.clone().sub(lastP).normalize(); out.push(wpc(id + 'an', M, dM)); } return out; };   /* Befund fold h_einflug: Kreistangente gegen Zielkurs in einem Stück → Zwischenpunkt mit Richtung zum Ziel */
      const h0 = T1[0].T.clone().setY(0).normalize(), A00 = T1[0].p.clone().addScaledVector(h0, -(o.lead ?? 60));
      const pcs = [{ id: 'h_anfahrt', type: 'STRAIGHT', length: 30, markings: 'TRACK' }];
      T1.forEach(w => pcs.push(wpc(w.id, w.p, w.T, { tunnel: { preset: 'gotthard' }, tags: w.tags })));
      const e1 = T1[T1.length - 1], X1 = e1.p.clone().addScaledVector(e1.T.clone().setY(0).normalize(), o.lo ?? 70), e2 = T2[0], X2 = e2.p.clone().addScaledVector(e2.T.clone().setY(0).normalize(), -(o.lo ?? 70)); X1.y = e1.p.y; X2.y = e2.p.y;   // Befund inner_edge_fold an l0: Bogen kam quer in den Lungenvenen-Eingang
      pcs.push(wpc('h_lunge_aus', X1, e1.T.clone().setY(0)), ...arc(X1, X2, 'h_lunge_', o.d1 ?? 1, e2.T.clone().setY(0).normalize()), wpc('h_lunge_ein', X2, e2.T.clone().setY(0)));
      if (o.hp) { /* Kehre in der linken Kammer als Track-Core-HAIRPIN_180 (Befund: gezeichnete Kehre knickte mit r ≈ 5 m). Lage: Stützpunkt am nächsten
           zum gemessenen Kammerpunkt; Drehsinn zur Ausstromseite; Ende per Probe-Kompilat (Querversatz D, Vorlauf F); weiter ab dem ersten Punkt vor dem Ende. */
        const LVw = W(LVp); LVw.y -= CUT_UP; let k1 = 0; T2.forEach((w, i) => { if (w.p.distanceTo(LVw) < T2[k1].p.distanceTo(LVw)) k1 = i; });
        const rH = o.hpr ?? 16, hp = (() => { try { const t = TC.compileRecipe({ schema: 'kfb.route-recipe/0.1-draft', id: 'hp', closed: false, start: { p: [0, 0, 0], headingDeg: 0 }, defaults: { widthClass: 'STANDARD', markings: 'STREET' }, pieces: [{ id: 'h', type: 'HAIRPIN_180', dir: 1, radius: rH, rise: 0 }] }), e = t.samples[t.samples.length - 1].p; return { D: Math.abs(e[0]), F: e[2] }; } catch (e) { return { D: 2 * rH, F: 0 }; } })();
        const A = T2[k1], fwd = A.T.clone().setY(0).normalize(), Rr = Rt(hd(fwd)), out = (T2[Math.min(T2.length - 1, k1 + 3)].p.clone().sub(A.p)).setY(0), latS = Math.sign(out.dot(Rr)) || 1, dir = latS * sideOfTurn;
        const end = A.p.clone().addScaledVector(Rr, latS * hp.D).addScaledVector(fwd, hp.F); let k2 = T2.length - 1; for (let i = k1 + 1; i < T2.length; i++) if (T2[i].p.clone().sub(end).dot(fwd) < -(o.hpg ?? 40)) { k2 = i; break; }
        T2.slice(0, k1 + 1).forEach((w, i) => pcs.push(wpc(w.id, w.p, i === k1 ? w.T.clone().setY(0) : w.T, { tunnel: { preset: 'gotthard' }, tags: w.tags })));   /* Befund tangent_kink 71 °/m an der Kehre: Einlauf mit Steigung, Kehre beginnt waagrecht → Einlauf waagrecht */
        pcs.push({ id: 'tunnel_herz_lkehre', type: 'HAIRPIN_180', dir, radius: rH, rise: 0, bankDeg: 0, markings: 'TRACK', tunnel: { preset: 'gotthard' }, tags: ['organ', 'herz', 'links', 'kammer-kehre'] });
        const AoW = W(R.ao); AoW.y -= CUT_UP; let kA = k2; T2.forEach((w, i) => { if (i >= k2 && w.p.distanceTo(AoW) < T2[kA].p.distanceTo(AoW)) kA = i; });
        /* NAHT: Ein- und Ausstrom der linken Kammer liegen anatomisch nebeneinander (Mitral- und Aortenklappe). Die Kammer ist EIN Raum: der Ausstrom bis
           zur Aortenwurzel wird geschnitten (Präfix tunnel_), trägt aber keine eigene Track-Core-Röhre (tunnel: null) → tunnel_shell zählt nur die Röhre des Einstroms. */
        T2.slice(k2).forEach((w, i) => pcs.push(wpc(w.id, w.p, w.T, { tunnel: k2 + i <= kA ? null : { preset: 'gotthard' }, tags: w.tags.concat(k2 + i <= kA ? ['ausstrom'] : []) }))); }
      else T2.forEach(w => pcs.push(wpc(w.id, w.p, w.T, { tunnel: { preset: 'gotthard' }, tags: w.tags })));
      const S0 = A00.clone().addScaledVector(h0, -30), X0 = S0.clone().addScaledVector(h0, -(o.lin ?? 160)), Y0 = X0.clone().addScaledVector(h0, -(o.lin2 ?? 260)); Y0.y = X0.y;
      if (o.tan) { const Rr = Rb + (o.margin ?? 80), pp = V3(-h0.z, 0, h0.x), cand = [1, -1].map(sg => Cw.clone().addScaledVector(pp, sg * Rr)).sort((a, b) => S0.clone().sub(b).dot(h0) - S0.clone().sub(a).dot(h0))[0], back = S0.clone().sub(cand).dot(h0);   /* Befund fold h_einflug0: Rückweg endet am Kreispunkt, dessen Tangente der Startkurs ist; dann S-Kurve auf die Startlinie */
        if (back > 320) { Y0.copy(cand).setY(X0.y); X0.copy(S0).addScaledVector(h0, -(back - (o.sl ?? 280))); X0.y = S0.y; } }   /* Einflug: Schnitt der Startlinie (rückwärts) mit dem Umfahrungskreis */   /* Befund fold h_einflug: Kreisbogen kam quer → Bogen endet weiter hinten (Y0), dann Gerade Y0 → X0 → Start */
      pcs.push(...arc(T2[T2.length - 1].p, Y0, 'h_koerper_', o.d2 ?? 1, h0), wpc('h_einflug0', Y0, h0.clone()), wpc('h_einflug', X0, h0.clone()), { id: 'h_home', type: 'CONNECT', to: { p: P3(S0), headingDeg: r4(hd(h0)), grade: 0 }, stretch: 1, params: thin, markings: 'TRACK', tunnel: null, bankDeg: 0 });   // Befund closure 30 m
      const named = { LA: LAp, LV: LVp, Ao: R.ao, AoTop: HL.ctrl(o).c2[HL.ctrl(o).c2.length - 3], RV: RVp, RA: RAp }, nearName = p => { let bn = '', bd = 1e9; for (const [k, v] of Object.entries(named)) { const w = W(v); w.y -= CUT_UP; const d = w.distanceTo(p); if (d < bd) { bd = d; bn = k; } } return bn + ' ' + Math.round(bd) + ' m'; };
      const wpNear = id => { const m = id.match(/^tunnel_herz_([rl])(\d+)$/); if (!m) return null; const T = m[1] === 'r' ? T1 : T2, w = T[+m[2]]; return w ? nearName(w.p) : null; };
      return { wpNear, pieces: pcs, start: { p: P3(S0), headingDeg: r4(hd(h0)) }, Rs: 0, H: 0, segs: [], recipeId: 'O1_HERZ_C2',
        geo: { svc: P3(R.svc), ivc: R.ivc && P3(R.ivc), pa: P3(R.pa), pv: P3(R.pv), ao: P3(R.ao), apex: P3(apex), RA: P3(RAp), RV: P3(RVp), LA: P3(LAp), LV: P3(LVp), up: P3(HL.up), maxGrade: r4(HL.maxGrade), near, lumenMM: Object.fromEntries(Object.entries(HL.lumen).map(([k, v]) => [k, r4(v)])), abstand: r4(dmin), t1: T1.length, t2: T2.length } }; };
    const cmp = L => TC.compileRecipe({ schema: 'kfb.route-recipe/0.1-draft', id: L.recipeId, closed: true, start: L.start, defaults: { widthClass: 'STANDARD', markings: 'STREET', profile: { deckDepth: 0.6 } }, pieces: L.pieces });
    const V0 = { d2: -1, lead: 120, margin: 160, rav: 0.8, arch: 1, ex: 0.85, lin2: 260 }, VAR = [{ ...V0, hp: 1, hpr: 20, tan: 1, margin: 300 }, { ...V0, hp: 1, hpr: 20, tan: 1, margin: 380 }];   /* 03.10. alle Checks grün mit der ersten */   /* bester Stand nach 20 Läufen, siehe CHANGELOG (12/13) */
    let best = null; const tried = [];
    const pieceOf = (st, i) => { const J = st.joints; let k = 0; while (k + 1 < J.length && J[k + 1].index <= i) k++; return J[k].piece; };
    for (const o of VAR) { try { const L = build(o), st2 = cmp(L), xh = crossHits(st2, B, { clear: 1 }), ce = (TC.runChecks(st2).results || []).filter(c => !c.pass && c.severity === 'error').map(c => c.id + ':' + c.value + (c.note ? ' ' + c.note : '')), sc = ce.length * 1e3 + xh.n * 10;
        const fold = {}; st2.samples.forEach((q, i) => { if (q.law === 'guide' && Math.abs(q.kappa) > 1e-6 && 1 / Math.abs(q.kappa) - 11.6 < 0.5) { const p = pieceOf(st2, i); fold[p] = (fold[p] || 0) + 1; } });
        const atS = ce.join(' ').match(/s (\d+(?:\.\d+)?)/g) || [], where = atS.slice(0, 4).map(t => { const sv = +t.slice(2); const i = st2.samples.findIndex(q => q.s >= sv); return i >= 0 ? pieceOf(st2, i) : '?'; });
        const foldAt = Object.fromEntries(Object.keys(fold).map(k => [k, L.wpNear(k) || '']));
        const shellAt = ce.filter(x => /tunnel_shell|self_clearance/.test(x)).map(x => (x.match(/s (\d+(?:\.\d+)?)/g) || []).map(t => { const sv = +t.slice(2), i = st2.samples.findIndex(q => q.s >= sv); return i >= 0 ? pieceOf(st2, i) : '?'; }).join('×'));
        const kinkAt = ce.filter(x => /tangent_kink/.test(x)).map(x => { const m = x.match(/s (\d+(?:\.\d+)?)/); if (!m) return '?'; const i = st2.samples.findIndex(q => q.s >= +m[1]); return i >= 0 ? pieceOf(st2, i) : '?'; });
        const foldAt2 = Object.keys(fold); tried.push({ ...o, xh: xh.n, fold, foldAt2, shellAt, kinkAt, ce: ce.map(x => x.split(':')[0]).join(',') }); if (!best || sc < best.sc) best = { L, o, sc, xh, ce }; if (sc === 0) break; } catch (e) { tried.push({ ...o, fail: e.message }); } }
    console.log('[C2] Varianten', JSON.stringify(tried));
    if (best) { NL = best.L; NL.side = 1; NL.err = 0; NL.pick = { ...best.o, xh: best.xh.n, ce: best.ce.join(','), tried: tried.length }; pieces.length = 0; pieces.push(...NL.pieces); built[0].segs = []; console.log('[C2] Wahl', JSON.stringify(NL.pick), JSON.stringify(NL.geo)); console.log('[C2] Stoß', JSON.stringify(best.ce.filter(x => /tunnel_shell|self_clearance/.test(x)).map(x => { const m = x.match(/s (\d+(?:\.\d+)?)/g) || []; return m.map(t => { const sv = +t.slice(2), st = cmp(NL), i = st.samples.findIndex(q => q.s >= sv); return i >= 0 ? pieceOf(st, i) : '?'; }); }))); }
    else info.errors.push('Herz C2: keine Variante kompiliert · ' + JSON.stringify(tried.slice(0, 2)));
  }
  const recipe = { schema: 'kfb.route-recipe/0.1-draft', id: NL ? (NL.recipeId || 'O1_NIERE_N1') : 'O1_ORGAN_RING_v3', closed: true, start: NL ? NL.start : { p: ST[0].E, headingDeg: ST[0].psi }, defaults: { widthClass: 'STANDARD', markings: 'STREET', profile: { deckDepth: 0.6 } }, pieces };
  let stream = null; const trackInfo = { core: TC.CORE_VERSION, recipe: recipe.id, pieces: pieces.length };
  try {
    const t0 = performance.now(); stream = TC.compileRecipe(recipe); const chR = TC.runChecks(stream), ch = chR.results || []; trackInfo.ms = Math.round(performance.now() - t0);
    const errs = ch.filter(c => !c.pass && c.severity === 'error'), warns = ch.filter(c => !c.pass && c.severity !== 'error');
    let L = 0; const S0 = stream.samples; for (let i = 1; i < S0.length; i++) L += Math.hypot(S0[i].p[0] - S0[i - 1].p[0], S0[i].p[1] - S0[i - 1].p[1], S0[i].p[2] - S0[i - 1].p[2]);
    Object.assign(trackInfo, { pass: errs.length === 0, errors: errs.map(c => c.id + (c.note ? ' · ' + c.note : '')), warnings: warns.map(c => c.id), checks: ch.length, length: Math.round(L), samples: S0.length, fingerprint: stream.fingerprint || null, tunnelM: Math.round(built.reduce((a, B) => a + B.segs.reduce((b, sg) => b + sg[1] - sg[0], 0), 0)) });
    const n = c => [parseInt(c.slice(1, 3), 16) / 255, parseInt(c.slice(3, 5), 16) / 255, parseInt(c.slice(5, 7), 16) / 255], sR = n(WORLD.roadStreet), sS = n(WORLD.strang), sD = sS.map(v => v * 0.82);
    for (const q of S0) if (q.paint) q.paint = { ...q.paint, road: sR, shoulder: sS, barrier_side: sS, barrier_cap: sS, underside: sD };   // hex-island.v5 paintWorld, Welt canyon
    const tg = buildTrack(THREE, stream, clayMat(new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.9 }), 'track'), { contact: true });
    const tunMat = colMat('#e2d0bc', 'earth'); tunMat.side = THREE.DoubleSide;   // hex-island.v5 Z. 483–484
    tg.traverse(o => { if (o.isMesh) { o.castShadow = o.receiveShadow = true; seed(o.geometry, 900); if (o.material !== tg.children[0]?.material) { o.material = tunMat; o.visible = false; } } });
    { const mk = tg.children[1]; if (mk?.isMesh) { const mm2 = clayMat(new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.9 }), 'track'); mm2.polygonOffset = true; mm2.polygonOffsetFactor = -2; mm2.polygonOffsetUnits = -4; mk.material = mm2; mk.castShadow = false; } }   // v4d: Querstreifen 3 cm über der Fahrbahn flackerten (Tiefenkonflikt bei near 1 m); eigener Versatz, kein Eigenschatten
    // v4: Röhre aus buildTrack nie zeichnen (Befund 03.10.: Röhre hat Vertexfarben und blieb sichtbar)
    for (const q of S0) q.prm = q.prm || {};
    world.add(tg);
    /* buildStrang — hex-island.v5 Z. 456–468 */
    const strang = new THREE.Group(), smat = colMat(WORLD.strang, 'track'), Vv = a2 => V3(a2[0], a2[1], a2[2]), rT = TC.PROFILE_DEFAULTS.barrierT * 0.62;
    const addS = geo => { seed(geo, 700 + strang.children.length); const m = new THREE.Mesh(geo, smat); m.castShadow = m.receiveShadow = true; strang.add(m); };
    for (const side of [0, 1]) { const runs = []; let cur = null;
      S0.forEach((q, i) => { if (i % (q.tunnel ? 2 : 6) && i !== S0.length - 1) return; const vis = side ? q.prm.barrierVisR : q.prm.barrierVisL;
        if (vis > 0.35 && q.R && q.U) { const sl = TC.profileSlots(q.prm), a2 = sl[side ? 10 : 3], b2 = sl[side ? 11 : 2], x = (a2[0] + b2[0]) / 2, y = Math.max(a2[1], b2[1]);
          (cur = cur || []).push(Vv(q.p).addScaledVector(Vv(q.R), x).addScaledVector(Vv(q.U), y + rT * 0.25)); } else if (cur) { runs.push(cur); cur = null; } });
      if (cur) runs.push(cur);
      for (const pts of runs) if (pts.length > 3) { addS(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), Math.ceil(pts.length * 1.5), rT, 12, false));
        for (const e of [pts[0], pts[pts.length - 1]]) addS(new THREE.SphereGeometry(rT, 18, 12).translate(e.x, e.y, e.z)); } }
    world.add(strang);
    trackInfo.tris = 0; [tg, strang].forEach(gg => gg.traverse(o => { if (o.isMesh) trackInfo.tris += (o.geometry.index ? o.geometry.index.count : o.geometry.attributes.position.count) / 3; }));
  } catch (e) { trackInfo.error = e.message; info.errors.push('Strecke: ' + e.message); console.error(e); }

  const pieceAt = []; if (stream) { const J2 = stream.joints || []; for (let k = 0; k < J2.length; k++) { const e = k + 1 < J2.length ? J2[k + 1].index : stream.samples.length; for (let i = J2[k].index; i < e; i++) pieceAt[i] = J2[k].piece; } }
  /* v4b Tunnel-Ausbau (eigene Naht): Ein- und Austritt je Tunnel-Stück am ungeschnittenen Organfeld gemessen; Kragen und Futter entstehen im Feld
     (meshIsland), keine eigenen Netze. Schlucht ohne Kragen. */
  if (stream) { const J2 = stream.joints || [], S2 = stream.samples;
    const runs = []; J2.forEach((j, k) => { if (!/^tunnel_/.test(j.piece)) return; const e = (k + 1 < J2.length ? J2[k + 1].index : S2.length) - 1, B = built.find(b => j.piece.includes(b.id)); if (!B) return;
      const last = runs[runs.length - 1]; if (last && last.B === B && last.e + 1 >= j.index) { last.e = e; return; } runs.push({ B, index: j.index, e, piece: j.piece }); });   // v7: ein Zug aus vielen Tunnel-Stücken = ein Ein- und ein Austritt
    runs.forEach(j => { const e = j.e, B = j.B;
      const inv = B.root.matrixWorld.clone().invert(), v = V3(), cpt = i => { const q = S2[i]; return V3(...q.p).addScaledVector(V3(...q.U), CUT_UP); };
      const rC0 = CUT_R / B.spec.mm, inside = i => { v.copy(cpt(i)).applyMatrix4(inv); return samp(B.G0, v.x, v.y, v.z) < rC0 * 0.9; };   // v4c: Röhre berührt das Organ
      let ie = -1, ix = -1; for (let i = j.index; i <= e; i++) if (inside(i)) { if (ie < 0) ie = i; ix = i; }
      if (ie < 0) return; B.portals = B.portals || []; { const ext = CUT_R * 0.8 + CUT_R * 2; let a2 = ie, b2 = ix; while (a2 > 0 && S2[ie].s - S2[a2].s < ext) a2--; while (b2 < S2.length - 1 && S2[b2].s - S2[ix].s < ext) b2++;   /* Befund: Mündung blieb zu, weil der Schnitt am Zugende aufhörte → in die Nachbarstücke hinein */ (B.cutSpan = B.cutSpan || []).push([a2, b2]); }   // v7: Schnitt reicht durch die Mündung (0,8 r) hinaus
      for (const i of [ie, ix]) B.portals.push({ p: cpt(i), T: V3(...S2[i].T), piece: j.piece }); }); }
  /* v5 Tunnellicht: warme Punktlichter ohne Schatten, 70 % der Tunnelhöhe über dem Deck, höchstens 8 im ganzen Kosmos */
  const tunLights = []; if (stream) { const J3 = stream.joints || [], S3 = stream.samples, spans = [];
    J3.forEach((j, k) => { if (/^tunnel_/.test(j.piece)) spans.push([j.index, (k + 1 < J3.length ? J3[k + 1].index : S3.length) - 1]); });
    const total = spans.reduce((a, [i, e]) => a + (S3[e].s - S3[i].s), 0), step = total > 600 ? Math.max(70, total / 28) : Math.max(24, total / 8);   // v7: lange Tunnelzüge (E2 1,9 km) je ~70 m ein Licht, höchstens 28 (v5: 8 → 240 m Abstand, Röhre blauschwarz)
    for (const [i, e] of spans) { const L0 = S3[i].s, L1 = S3[e].s, n = Math.max(1, Math.round((L1 - L0) / step));
      for (let m = 0; m < n; m++) { const sT = L0 + (m + 0.5) * (L1 - L0) / n; let ii = i; while (ii < e && S3[ii].s < sT) ii++; const q = S3[ii], hT = (q.tunnel ? q.tunnel.h : 12) * 0.7;
        const pl = new THREE.PointLight(TUN.color, TUN.intensity, Math.max(30, step * 1.4), 2); pl.position.set(q.p[0] + q.U[0] * hT, q.p[1] + q.U[1] * hT, q.p[2] + q.U[2] * hT); scene.add(pl); tunLights.push(pl); } } }
  /* Phase 2 je Insel: Schnitt entlang der kompilierten Stützstellen (jede 4. ≈ 2 m), dann Kneten */
  for (const B of built) { const inv = B.root.matrixWorld.clone().invert(), cuts = [], rC = CUT_R / B.spec.mm, v = V3();
    if (stream) for (let i = 0; i < stream.samples.length; i += 4) { const q0 = stream.samples[i], pc = pieceAt[i] || ''; const inSpan = (B.cutSpan || []).some(([a, b]) => i >= a && i <= b); if (!q0.U || (!/^(tunnel|schlucht|hang)_/.test(pc) && !inSpan)) continue; if (/^tunnel_/.test(pc) && !inSpan) continue;   /* v7: Mündung — Schnitt auch im Anlaufstück vor dem ersten Tunnel-Stück */
      const lv = /^schlucht_/.test(pc) ? 12 : /^hang_/.test(pc) && !inSpan ? 2 : 1;   // Schlucht: Säule aus Kugeln nach oben, oben breiter
      for (let k = 0; k < lv; k++) { const up = CUT_UP + k * 11; v.set(q0.p[0] + q0.U[0] * up, q0.p[1] + q0.U[1] * up, q0.p[2] + q0.U[2] * up).applyMatrix4(inv); if (samp(B.G0, v.x, v.y, v.z) < rC * (/^tunnel_/.test(pc) || inSpan ? 3.2 : 2)) { const c = v.clone(); c.r = rC * (1 + 0.05 * k); c.col = lv > 1; c.sleeve = (/^tunnel_/.test(pc) || inSpan) && samp(B.G0, v.x, v.y, v.z) < -rC * 0.5; c.hang = /^hang_/.test(pc) && !inSpan; if (/^tunnel_/.test(pc) || inSpan) c.t = V3(...q0.T).applyQuaternion(B.q.clone().invert()).normalize(); cuts.push(c); } } }
    try { await meshIsland(B, cuts); } catch (e) { console.error(e); info.errors.push(B.spec.name + ': ' + e.message); } }
  built.forEach(B => { const T = B.tiers.hero; let m = 0; if (T) { const P = T.SN.P; for (let i = 0; i < T.SN.M; i += 11) m = Math.max(m, V3(P[i * 3], P[i * 3 + 1], P[i * 3 + 2]).applyMatrix4(B.root.matrixWorld).distanceTo(B.I.Cw)); } B.rW0 = m || 200; });

  /* Prüfung Durchdringung (v6): ganzer Querschnitt gegen Organfeld und Harnleiter-Röhre, siehe crossHits. v3-Zählung bleibt als hitsV3 daneben. */
  if (stream) for (const B of built) { B.cross = crossHits(stream, B, { clear: B.id === 'hirn' ? 3 : 1 }); /* Hirnfeld ist radial (r − R(Richtung)), überschätzt den Abstand an schrägen Flanken → 3 m */ console.log('[N1 v6] Querschnitt', B.id, JSON.stringify(B.cross)); }
  if (stream) for (const B of built) { const inv = B.root.matrixWorld.clone().invert(), v = V3(); let n = 0, first = null;
    for (let i = 0; i < stream.samples.length; i += 2) { if (/^(tunnel|schlucht)_/.test(pieceAt[i])) continue; const q0 = stream.samples[i]; if (Math.hypot(q0.p[0] - B.I.Cw.x, q0.p[2] - B.I.Cw.z) > B.rW0 + 60) continue; v.set(...q0.p).applyMatrix4(inv); if (samp(B.G0, v.x, v.y, v.z) * B.spec.mm < 1.5) { n++; if (!first) first = pieceAt[i]; } }
    B.hitsV3 = { n, first }; B.hits = { n: B.cross.n, first: Object.keys(B.cross.byPiece)[0] || null, uret: B.cross.uret, minUret: B.cross.minUret }; }
  if (NL) Object.assign(trackInfo, { attraktion: { spirale: NL.side, abweichung: NL.err, radius: r4(NL.Rs), hub: r4(NL.H), wahl: NL.pick, geo: NL.geo || null } });
  /* Wolken um den Kosmos */
  if (cf) try { cf.set(CF.scatterClouds({ n: 16, center: [0, 80, 0], radius: RING * 1.6, rMin: 0.55, yRange: [-420, -180], scale: [160, 320], seed: 7, spacing: 0.55 })); } catch (e) { info.errors.push('Wolken setzen: ' + e.message); }

  /* ---------- Beschriftung ---------- */
  const layer = document.createElement('div'); Object.assign(layer.style, { position: 'absolute', inset: '0', pointerEvents: 'none', overflow: 'hidden', zIndex: 2 }); canvas.parentElement.appendChild(layer);
  const labels = [];
  const mkLabel = (title, sub, posFn, kind) => { const el = document.createElement('div');
    Object.assign(el.style, { position: 'absolute', left: '0', top: '0', transform: 'translate(-50%,-100%)', background: kind === 'dock' ? '#1f2022' : '#efece6', color: kind === 'dock' ? '#f6f4ef' : '#1f2022', border: '1px solid ' + (kind === 'dock' ? '#1f2022' : '#c9c5bc'), borderRadius: '6px', padding: '4px 8px', whiteSpace: 'nowrap', fontFamily: "'Space Grotesk',system-ui,sans-serif", lineHeight: '1.25', boxShadow: '0 4px 16px rgba(31,32,34,.12)', transition: 'opacity .15s' });
    el.innerHTML = '<div style="font-weight:600;font-size:12px"></div><div style="font:10.5px/1.3 \'IBM Plex Mono\',monospace;opacity:.75"></div>'; el.children[0].textContent = title; el.children[1].textContent = sub; layer.appendChild(el); labels.push({ el, posFn, kind }); };
  for (const B of built) { const topW = (() => { const T = B.tiers.hero, P = T.SN.P; let m = -1e9; for (let i = 0; i < T.SN.M; i += 7) m = Math.max(m, P[i * 3] * 0 + V3(P[i * 3], P[i * 3 + 1], P[i * 3 + 2]).applyMatrix4(B.root.matrixWorld).y); return m; })();
    B.topW = topW; mkLabel(B.spec.name, B.spec.loci, () => V3(B.I.Cw.x, topW + 40, B.I.Cw.z), 'isle'); }
  mkLabel('Hex-Insel', '7 Kacheln · KayKit', () => V3(HUB.c[0], HUB.y + 60, HUB.c[1]), 'isle');
  let showLabels = false;

  /* ---------- Nachbearbeitung ---------- */
  const composer = new EffectComposer(renderer, new THREE.WebGLRenderTarget(800, 450, { type: THREE.HalfFloatType, samples: 4 })); composer.addPass(new RenderPass(scene, camera));   // v4d: Composer mit MSAA, sonst kommt antialias nicht an und dünne Streifen flimmern
  let ao = null; try { const { GTAOPass } = await import('three/addons/postprocessing/GTAOPass.js'); ao = new GTAOPass(scene, camera, 2, 2); ao.updateGtaoMaterial({ radius: 6, distanceExponent: 1.4, thickness: 6, scale: 1, samples: 16 }); ao.blendIntensity = 0.8; ao.enabled = false; composer.addPass(ao); } catch (e) { info.errors.push('AO: ' + e.message); }
  composer.addPass(new OutputPass());
  const resize = () => { const w = canvas.clientWidth || 800, h = canvas.clientHeight || 450; renderer.setSize(w, h, false); composer.setSize(w, h); camera.aspect = w / h; camera.updateProjectionMatrix(); };
  const ro = new ResizeObserver(resize); ro.observe(canvas); resize();

  /* ---------- Kamera ---------- */
  let sel = ONLY || 'kosmos', cam = 'tq', fly = null; const chase = { s: 0, pos: V3(), look: V3(), init: false };
  const islandOf = id => built.find(b => b.id === id);
  const radiusW = B => { const T = B.tiers.hero, P = T.SN.P; let m = 0; for (let i = 0; i < T.SN.M; i += 11) m = Math.max(m, V3(P[i * 3], P[i * 3 + 1], P[i * 3 + 2]).applyMatrix4(B.root.matrixWorld).distanceTo(B.I.Cw)); return m; };
  built.forEach(B => { B.rW = radiusW(B); });
  const shotFor = (id, view) => {
    if (id === 'kosmos' || !islandOf(id)) { if (view === 'top') return { p: V3(0, 5200, 1), t: V3(0, 80, 0), r: RING * 1.6 }; return { p: V3(-2900, 1900, 2900), t: V3(0, 80, 0), r: RING * 1.6 }; }
    const B = islandOf(id), c = B.I.Cw.clone(), Dd = B.rW * 3.0, d = B.dock;
    if (view === 'top') return { p: c.clone().add(V3(0, Dd * 1.5, 1)), t: c, r: B.rW * 1.2 };
    if (view === 'dock') return { p: d.D0.clone().addScaledVector(d.tW, -150).addScaledVector(d.toHub, 45).add(V3(0, 28, 0)), t: d.D0.clone().addScaledVector(d.tW, 40).add(V3(0, 6, 0)), r: B.rW * 1.2 };
    const dir = V3(...B.spec.view).normalize().applyQuaternion(B.q); dir.y = Math.max(dir.y, 0.2); dir.normalize();
    return { p: c.clone().addScaledVector(dir, Dd).add(V3(0, Dd * 0.25, 0)), t: c.clone(), r: B.rW * 1.2 };
  };
  const shadowFocus = { c: V3(0, 80, 0), r: RING * 1.6 };
  const go = (instant = false) => {
    if (cam === 'ride') { controls.enabled = false; chase.init = false; return; }
    controls.enabled = true; camera.up.set(0, 1, 0);
    const sh = shotFor(sel, cam === 'spin' ? 'tq' : cam); shadowFocus.c.copy(sh.t); shadowFocus.r = sh.r;
    controls.autoRotate = cam === 'spin'; controls.autoRotateSpeed = 0.7;
    if (instant) { camera.position.copy(sh.p); controls.target.copy(sh.t); controls.update(); fly = null; }
    else fly = { p0: camera.position.clone(), t0: controls.target.clone(), p: sh.p, t: sh.t, k: 0 };
  };
  go(true);
  const kick = () => { if (document.visibilityState !== 'visible') { if (fly) { camera.position.copy(fly.p); controls.target.copy(fly.t); fly = null; controls.update(); } frame(1 / 60); } };   // verdeckte Vorschau: rAF steht, Bild trotzdem neu
  const setTier = tk => { tierNow = tk; for (const B of built) { for (const [k2, T] of Object.entries(B.tiers)) T.g.visible = k2 === tk; B.figs.forEach(f => placeFig(B, f, tk)); } };

  /* ---------- Schleife ---------- */
  let alive = true, raf = 0, last = performance.now(), acc = 0, frames = 0, measuring = false, sunDir = V3(0.5, 0.8, 0.3).normalize(), sunWritten = V3();
  const S0 = stream ? stream.samples : null, sCum = S0 ? (() => { const a = new Float32Array(S0.length); for (let i = 1; i < S0.length; i++) a[i] = a[i - 1] + Math.hypot(S0[i].p[0] - S0[i - 1].p[0], S0[i].p[1] - S0[i - 1].p[1], S0[i].p[2] - S0[i - 1].p[2]); return a; })() : null;
  const sampleAt = s => { const L = sCum[sCum.length - 1]; s = ((s % L) + L) % L; let lo = 0, hi = sCum.length - 1; while (hi - lo > 1) { const m = (lo + hi) >> 1; if (sCum[m] <= s) lo = m; else hi = m; } return S0[lo]; };
  const placeSun = () => { if (!sun.position.equals(sunWritten)) sunDir.copy(sun.position).sub(sun.target.position).normalize();
    const r = shadowFocus.r; sun.target.position.copy(shadowFocus.c); sun.position.copy(shadowFocus.c).addScaledVector(sunDir, r * 3); sunWritten.copy(sun.position);
    const sc = sun.shadow.camera; if (sc.right !== r) { sc.left = -r; sc.right = r; sc.top = r; sc.bottom = -r; sc.near = r * 0.5; sc.far = r * 6; sc.updateProjectionMatrix(); } };
  const tmpV = V3();
  const updLabels = () => { const w = canvas.clientWidth, h = canvas.clientHeight;
    for (const L of labels) { const p = L.posFn(), v = tmpV.copy(p).project(camera), dist = camera.position.distanceTo(p);
      const vis = showLabels && cam !== 'ride' && v.z < 1 && Math.abs(v.x) < 1.05 && Math.abs(v.y) < 1.05 && (L.kind !== 'dock' || dist < 2600);
      L.el.style.opacity = vis ? '1' : '0'; if (vis) L.el.style.transform = `translate(${((v.x + 1) / 2 * w).toFixed(1)}px,${((1 - v.y) / 2 * h).toFixed(1)}px) translate(-50%,-100%)`; } };
  const frame = dt => {
    mixers.forEach(m => m.update(dt));
    if (cam === 'ride' && S0) { chase.s += dt * 42; const q = sampleAt(chase.s), T = V3(...q.T), Uu = V3(...q.U), p = V3(...q.p);
      const want = p.clone().addScaledVector(T, -16).addScaledVector(Uu, 6.5), look = p.clone().addScaledVector(T, 24).addScaledVector(Uu, 2), kk = chase.init ? 1 - Math.exp(-dt * 4) : 1; chase.init = true;
      chase.pos.lerp(want, kk); chase.look.lerp(look, kk); camera.position.copy(chase.pos); camera.up.lerp(Uu, kk).normalize(); camera.lookAt(chase.look); shadowFocus.c.copy(p); shadowFocus.r = 260; }
    else { if (fly) { fly.k = Math.min(1, fly.k + dt / 1.6); const e = fly.k * fly.k * (3 - 2 * fly.k); camera.position.lerpVectors(fly.p0, fly.p, e); controls.target.lerpVectors(fly.t0, fly.t, e); if (fly.k >= 1) fly = null; } controls.update(); }
    if (env) { env.update(dt); if (cf) { cf.update(camera); cloudMat.color.copy(env.cloudColor); } }
    placeSun(); updLabels();
    renderer.info.reset(); composer.render(); env && env.after();
  };
  const loop = () => { if (!alive) return; raf = requestAnimationFrame(loop); if (measuring) return; const now = performance.now(), dt = Math.min(0.1, (now - last) / 1000); last = now;
    acc += dt; frames++; if (acc > 0.7) { info.fps = Math.round(frames / acc); acc = 0; frames = 0; emit(); }
    frame(dt); info.tris = renderer.info.render.triangles; info.calls = renderer.info.render.calls; };

  let measureRows = null;
  const islandInfo = B => ({ id: B.id, name: B.spec.name, short: B.spec.short, loci: B.spec.loci, note: B.spec.note, src: B.src, mm: B.spec.mm, cast: B.spec.cast.map(c => c[0]), figs: B.figs.length, ms: B.ms, measured: B.measured,
    tunnel: { segs: B.segs.map(g2 => [Math.round(g2[0]), Math.round(g2[1])]), len: Math.round(B.segs.reduce((a2, g2) => a2 + g2[1] - g2[0], 0)), y: B.spec.y, cuts: B.cuts ? B.cuts.length : 0 }, hits: B.hits ?? null,
    tiers: Object.fromEntries(Object.entries(B.tiers).map(([k2, T]) => [k2, { cell: T.cell, verts: T.verts, ms: T.ms, tris: Math.round(T.tris.terrain + T.tris.water), terrain: T.tris.terrain, water: T.tris.water, spots: (B.spots[k2] || []).length }])) });
  const emit = () => onState({ sel, cam, tier: tierNow, labels: showLabels, ao: !!ao?.enabled, perf: { fps: info.fps, tris: info.tris, calls: info.calls }, islands: built.map(islandInfo), track: trackInfo,
    hub: { W: r4(HM.W), H: r4(HM.H), S: S_HEX, d: HUB.d, psi: HUB.psi, measured: HM.measured }, probe: env ? env.probe() : null, measure: measureRows, errors: info.errors.slice(0, 12), measuring });
  onNote(''); loop(); emit();
  Promise.all(castLoads).then(() => emit());

  return {
    info, built, scene, camera, renderer, stream, recipe, tunLights,
    setIsland(id) { sel = id; if (cam === 'ride') cam = 'tq'; go(); kick(); emit(); },
    setCam(v) { cam = v; if (v === 'ride' && S0) { const B = islandOf(sel); if (B) { let bi = 0, bd = 1e18; S0.forEach((q, i) => { if (i % 20) return; const d = (q.p[0] - B.dock.D0.x) ** 2 + (q.p[2] - B.dock.D0.z) ** 2; if (d < bd) { bd = d; bi = i; } }); chase.s = sCum[bi] - 300; } } go(); kick(); emit(); },
    setTier(tk) { setTier(tk); kick(); emit(); },
    look(p, t) { cam = 'free'; controls.enabled = true; controls.autoRotate = false; fly = null; camera.up.set(0, 1, 0); camera.position.set(...p); controls.target.set(...t); controls.update(); kick(); emit(); },   // v7: Prüfansicht (z. B. Portale)
    portalViews(dist = 70) { const out = []; for (const B of built) (B.portals || []).forEach((P, i) => { const ent = i % 2 === 0, d = P.T.clone().multiplyScalar(ent ? -1 : 1), p = P.p.clone().addScaledVector(d, dist); p.y += dist * 0.25; out.push({ id: B.id, i, piece: P.piece, p: P3(p), t: P3(P.p) }); }); return out; },
    setTime(t) { env && env.setTime(t); kick(); kick(); emit(); },
    setLabels(v) { showLabels = v; emit(); },
    setAO(v) { if (ao) ao.enabled = v; emit(); },
    async measure() {   // je Insel × Fassung: dieselbe 3/4-Kamera, 8 Bilder warm, 24 Bilder mit gl.finish
      if (measuring) return; measuring = true; emit(); const gl = renderer.getContext(), keep = { sel, cam, tier: tierNow }, rows = [];
      const shoot = async (id, tk) => { setTier(tk); sel = id; cam = 'tq'; go(true); for (let i = 0; i < 8; i++) { frame(1 / 60); await tick(); }
        gl.finish(); const t0 = performance.now(); let tris = 0, calls = 0; for (let i = 0; i < 24; i++) { frame(1 / 60); gl.finish(); tris = renderer.info.render.triangles; calls = renderer.info.render.calls; }
        rows.push({ id, tier: tk, ms: Math.round((performance.now() - t0) / 24 * 100) / 100, tris, calls }); };
      try { for (const B of built) for (const tk of ['hero', 'light']) await shoot(B.id, tk); for (const tk of ['hero', 'light']) await shoot('kosmos', tk); }
      catch (e) { info.errors.push('Messung: ' + e.message); }
      measureRows = rows; setTier(keep.tier); sel = keep.sel; cam = keep.cam; go(true); measuring = false; last = performance.now(); emit(); return rows; },
    dispose() { alive = false; cancelAnimationFrame(raf); ro.disconnect(); layer.remove(); controls.dispose(); env && env.dispose && env.dispose(); renderer.dispose(); }
  };
}
