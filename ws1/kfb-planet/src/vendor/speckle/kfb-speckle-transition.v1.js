// KFB Speckle Transition v1 · kfb.speckle-transition/1 · das eine Sprenkel-Modul für Farbübergänge (V-403, Audit SPECKLE_TRANSITION_AUDIT_R1 §4)
// Besitzer WS1 (Look-Slice). Vendorbar: nur three als Abhängigkeit, kein React, kein Store, keine Fenster-Listener. Bühnen, Zonen, Biome, Strecke und
// Dioramen holen ihre Übergänge hier; keinen eigenen Verlauf und keinen zweiten Sprenkel-Shader daneben bauen. „Weich überblenden“ heißt Sprenkel-Band,
// nie Farbverlauf (V-011, präzisiert V-341 und L2-G12).
// Inhalt:
//   createSpeckle(opts)     { seed, cell_m = 1,1, space = 'world-xz' | 'world-3d', look = 'intent' | 's1', preset } → Instanz mit Seed je Zone
//                           (Versatz + Zelle ±11 %, Donor speckleSeed) und Warp 0,34 (Donor), damit Nachbarzonen nie dasselbe Muster zeigen.
//   .patch(material, {layers})  ≤ 3 Ebenen, onBeforeCompile an <color_fragment> (vorhandenes onBeforeCompile wird verkettet, Clay-Material zuerst),
//                           customProgramCacheKey je Ebenen-Satz. Ebene = { weight: 'aSW.x', color, cellScale, rim, space?, bidir?, micro?, name? }.
//   .setColors(c)           Farben über Uniforms, ohne Neu-Kompilieren (Array nach Index oder Objekt nach Ebenen-Name/Index).
//   .dispose()              hängt alle Materialien wieder ab (alte Hooks zurück, needsUpdate); GPU-Programme gehören dem Material.
//   weights.band / .zone / .depthBelowRim   Gewichte statisch je Vertex backen (SPEC_EDGE_RUBBLE: live nur, wo sich etwas ändert), mit wandernder
//                           Einsatzlinie (Donor scholle.ts: Wobble), damit die erste/letzte Sprenkel-Reihe nie als Linie liest.
//   PRESETS                 track↔ground 2,8 m · diorama↔ground 3–8 m ab footprint · biome↔biome 6–12 m · rim/scholle (3D nach Tiefe) · built.
//   vegetation              Haken für die nest()-Gruppenregel (Lab grounding.ts): Bewuchs dünnt über das Band aus, kleiner und seltener, bis keiner mehr da ist.
// Herkunft: GLSL byte-gleich aus gh/sync/lab-snapshot-2026-10-11 @64ae61fe7, Lab S1 „Scheiben-Sprenkel“ (src/clay/kfb-speckle.ts +
// src/island/r2d/top-material.ts), Georg 09.10. „so nehmen … Tune später“; Nachfolger von Joyride-kfbBlend und Insel-kfbLayer. Blöcke unten mit
// ═══ DONOR … ═══ markiert; dort nur TypeScript-Typen entfernt. Neu ist die Hülle (createSpeckle, patch, weights, PRESETS) und die WS1-Erweiterung.
// Absicht (TRANSITION_INTENT_R1, Georg 17.10.): Flächen laufen wie Flüssigkeiten/Farben gesprenkelt ineinander, in beide Richtungen (Erdflecken ins
// Gras, Grasbüschel in die Erde), Bewuchs dünnt aus, viele Größen, unregelmäßige Formen statt Scheiben, kein erkennbares Konstruktionsmuster.
// S1 ist technische Basis, nicht visuelles Ziel. Dafür die WS1-Erweiterung (eigener GLSL-Block, nie im Donor-Text): Formverzerrung (zwei feinere
// Warp-Oktaven + flächentreue Streckung je Seed), zwei Richtungen (große Ebene als Differenz zweier Scheibenfelder mit eigener Quantil-Tabelle, kleine
// Ebenen spiegelbildlich, so dass B-Tropfen in A und A-Tropfen in B hinauslaufen, statt die Minderheit zu Ringen aufzustechen), Variante ohne
// Mikro-Punkte (built). look = 's1' schaltet alles ab und zeigt den Donor-Stand (A/B-Bild). Sichtprüfung bisher nur am JS-Zwilling (Node, ohne
// Browser); das Bild im Spiel (Prüfkameras, blinder Kritiker) steht aus.
// Uniform-Budget: je Quantil-Tabelle 64 Floats (Donor-Vertrag `uniform float uSpeckleK[64]`); 2D zweiseitig = 128 wie Donor-patchSpeckle, mit 3D-Ebene 192.
// Abnahme (V-403, Audit §4): 1 keine harte Kante, keine Linie/Geisterlinie/gestrichelter Rand an allen Prüfkameras (Übersicht, J17-Chase, Laufhöhe
// 0,9 H), keine gerade Isolinie über 1 m · 2 kleinste sichtbare Stufe ≥ 3 px (LOD voll ab ~6,7 px, weg ab ~2,9 px) · 3 kein gleiches Muster nebeneinander
// (Seed je Zone), kein Raster · 4 weltfest und deterministisch · 5 Gewichte gebacken, ≤ 3 Ebenen, keine zusätzlichen Draw Calls, ≥ 30 fps (V-370/V-115)
// · 6 Diorama-Ring ΔE ≤ 0,05 zur edgePalette auf der Terrain-Seite der Naht (G12) · blinder Kritiker: „Konstruktionsmuster zu sehen?“ → nein.
// Einheiten: J17-Meter. Eine Lab-Einheit ≈ 1,46 m (RACE_W); Lab-Zelle 1,6 Einheiten ≈ 1,1 × 1,46 → Startwert cell_m 1,1 (Georg tunt).
import * as THREE from 'three'

export const SCHEMA = 'kfb.speckle-transition/1'
export const MODULE = 'kfb-speckle-transition.v1'

// ═══ DONOR D1 · tools/KFB-ToolBox/_inbox/KFB Island Worldbuilder Lab/src/clay/kfb-speckle.ts · gh/sync/lab-snapshot-2026-10-11 @64ae61fe7 · Z. 7–79 ═══
// JS-Teil (Z. 7–41): nur TypeScript-Typen entfernt. GLSL KFB_SPECKLE_GLSL (Z. 43–79): byte-gleich.
/** quantile table: k such that coverage{F > k} ≈ w, sampled from the same field (64 steps, w = 0 … 1) */
export const SPECKLE_STEPS = 64;

const fract = (v) => v - Math.floor(v);
const h3 = (x, y) => [
  fract(Math.sin(x * 127.1 + y * 311.7) * 43758.5453),
  fract(Math.sin(x * 269.5 + y * 183.3) * 43758.5453),
  fract(Math.sin(x * 419.2 + y * 371.9) * 43758.5453),
];

/** JS twin of kfbDiskField (GLSL below), used only for calibration */
function diskField(x, y, seed) {
  x += 0.18 * Math.sin(y * 1.7 + seed); y += 0.18 * Math.cos(x * 1.9 + seed);
  const bx = Math.floor(x), by = Math.floor(y);
  let F = -1e9;
  for (let j = -1; j <= 1; j++) for (let i = -1; i <= 1; i++) {
    const cx = bx + i, cy = by + j, h = h3(cx + seed, cy + seed), h2 = h3(cx + seed + 7.3, cy + seed + 7.3);
    const px = cx + 0.15 + 0.7 * h[0], py = cy + 0.15 + 0.7 * h[1], r = 0.28 + 0.32 * h[2], ht = 0.45 + 0.55 * h2[0];
    F = Math.max(F, ht * (1 - Math.hypot(x - px, y - py) / r));
  }
  return F;
}

/** k(w) for w = i / (STEPS − 1); coverage of {F > k} is w */
export function speckleThresholds(samples = 40000) {
  const v = [];
  for (let n = 0; n < samples; n++) v.push(diskField(fract(Math.sin(n * 12.9898) * 43758.5453) * 97.0, fract(Math.sin(n * 78.233) * 43758.5453) * 97.0, 17.0));
  v.sort((a, b) => a - b);
  const k = [];
  for (let i = 0; i < SPECKLE_STEPS; i++) {
    const w = i / (SPECKLE_STEPS - 1);
    k.push(v[Math.min(v.length - 1, Math.max(0, Math.round((1 - w) * (v.length - 1))))]);
  }
  return k;
}

export const KFB_SPECKLE_GLSL = /* glsl */ `
uniform float uSpeckleK[${SPECKLE_STEPS}];
vec3 kfbH3(vec2 p){ vec3 q = vec3(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)), dot(p, vec2(419.2, 371.9))); return fract(sin(q) * 43758.5453); }
float kfbDiskField(vec2 x, float seed){
  x += 0.18 * vec2(sin(x.y * 1.7 + seed), cos(x.x * 1.9 + seed));
  vec2 b = floor(x); float F = -1e9;
  for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
    vec2 c = b + vec2(float(i), float(j)); vec3 h = kfbH3(c + seed); float ht = 0.45 + 0.55 * kfbH3(c + seed + 7.3).x;
    vec2 p = c + 0.15 + 0.7 * h.xy; float r = 0.28 + 0.32 * h.z;
    F = max(F, ht * (1.0 - length(x - p) / r)); }
  return F; }
float kfbSpeckleK(float w){ float t = clamp(w, 0.0, 1.0) * ${SPECKLE_STEPS - 1}.0; int i = int(floor(t)); int j = min(i + 1, ${SPECKLE_STEPS - 1});
  return mix(uSpeckleK[i], uSpeckleK[j], fract(t)); }
/** one level: mask 0..1 (anti-aliased hard clay edge), rim 0..1 for the slight edge darkening */
// 2026-10-10 (Stufe 1): no early return before fwidth(): derivatives in divergent control flow are undefined and drew
// dashed rim lines along the w = 0.001 / 0.999 isolines. Field and derivatives on every path, w selects afterwards.
float kfbSpeckle(vec2 su, float cell, float seed, float w, out float rim){
  float F = kfbDiskField(su / cell, seed); float k = kfbSpeckleK(w); float fw = max(fwidth(F), 1e-4);
  float r = 1.0 - smoothstep(fw, 4.0 * fw + 0.03, abs(F - k)), m = smoothstep(k - fw, k + fw, F);
  bool solid = w <= 0.001 || w >= 0.999; rim = solid ? 0.0 : r; return w <= 0.001 ? 0.0 : w >= 0.999 ? 1.0 : m; }
/** pixel size of one cell of this level: > 1 means the level is still drawable */
float kfbSpeckleLod(vec2 su, float cell){ vec2 g = fwidth(su / cell); return clamp((0.35 - max(g.x, g.y)) / 0.2, 0.0, 1.0); }
/** three sizes outward + micro dots near the camera, drops of the base back in two sizes. The rim is taken from the
 *  final mask only (1–2 px at the visible edge), so hidden disks never draw ghost outlines. Small levels thin out with
 *  w^1.5 so the outermost dots get sparse instead of ending on a line. */
float kfbSpeckleLayer(vec2 p, float cell, float w, out float rim){
  float r; float w15 = w * sqrt(w), v = 1.0 - w, v15 = v * sqrt(v);
  float a = kfbSpeckle(p, cell, 17.0, w, r);
  float m = kfbSpeckle(p + 13.1, cell * 0.42, 29.0, smoothstep(0.0, 0.95, w15) * 0.5, r);
  float s = kfbSpeckle(p + 27.7, cell * 0.2, 41.0, smoothstep(0.0, 0.7, w15) * 0.32, r);
  float u = kfbSpeckle(p + 51.9, cell * 0.09, 53.0, smoothstep(0.0, 0.6, w15) * 0.22, r) * kfbSpeckleLod(p, cell * 0.09);
  float b = kfbSpeckle(p + 41.3, cell * 0.36, 67.0, smoothstep(0.0, 0.95, v15) * 0.42, r);
  float b2 = kfbSpeckle(p + 63.7, cell * 0.16, 79.0, smoothstep(0.0, 0.8, v15) * 0.25, r) * kfbSpeckleLod(p, cell * 0.16);
  float sel = max(max(a, m), max(s, u)) * (1.0 - max(b, b2));
  sel = w <= 0.001 ? 0.0 : w >= 0.999 ? 1.0 : sel;
  rim = clamp(fwidth(sel) * 0.9, 0.0, 1.0); return sel; }
`;

// ═══ DONOR D2 · tools/KFB-ToolBox/_inbox/KFB Island Worldbuilder Lab/src/island/r2d/top-material.ts · gh/sync/lab-snapshot-2026-10-11 @64ae61fe7 · Z. 9–14, 16–17, 19–31, 44–45, 78–142 ═══
// SPECKLE_CELL ist die Lab-Zelle (Lab-Einheiten), nur für speckleSeed; WS1 rechnet in J17-Metern (zoneSeed unten).
// HOSKINS_H3, WARP_GLSL, SPECKLE3_GLSL: byte-gleich. JS-Teile: nur TypeScript-Typen entfernt.
/** S1 cell in K2: ¼ MC = 1.6 (Steuerung F4) */
export const SPECKLE_CELL = 1.6;

const HOSKINS_H3 = 'vec3 kfbH3(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973)); p3 += dot(p3, p3.yxz + 33.33); return fract((p3.xxy + p3.yzz) * p3.zyx); }';
export const SPECKLE_GLSL_NOSIN = KFB_SPECKLE_GLSL.replace(/vec3 kfbH3\(vec2 p\)\{[^\n]*\}/, HOSKINS_H3);
if (SPECKLE_GLSL_NOSIN === KFB_SPECKLE_GLSL) throw new Error('[r2d] kfbH3 not found in KFB_SPECKLE_GLSL');

let K = null;
export const speckleK = () => (K ??= speckleThresholds());

/** Lauf 03 (MEDIUM): drops are clay blobs, not perfect circle decals: the lookup position is warped by a slow value noise
 *  (a third of a cell); each island has its own offset and cell size (uSO, uTCell), so the two islands never show the
 *  same pattern. Own sine-free hash. */
export const WARP_GLSL = `
float kfbWH(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * 0.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
float kfbVN(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(kfbWH(i), kfbWH(i + vec2(1.0, 0.0)), f.x), mix(kfbWH(i + vec2(0.0, 1.0)), kfbWH(i + vec2(1.0, 1.0)), f.x), f.y); }
vec2 kfbWarp2(vec2 p, float cell){ vec2 q = p / (cell * 0.8); return p + cell * 0.34 * vec2(kfbVN(q) - 0.5, kfbVN(q + 19.7) - 0.5); }
vec3 kfbWarp3(vec3 p, float cell){ vec3 q = p / (cell * 0.8); return p + cell * 0.34 * vec3(kfbVN(q.yz) - 0.5, kfbVN(q.xz + 17.3) - 0.5, kfbVN(q.xy + 31.1) - 0.5); }
// one warp offset per pixel, shared by all layers (budget: a warp per layer cost the frame rate)
vec3 kfbWarpV3(vec3 p, float cell){ vec3 q = p / (cell * 0.8); return cell * 0.34 * vec3(kfbVN(q.yz) - 0.5, kfbVN(q.xz + 17.3) - 0.5, kfbVN(q.xy + 31.1) - 0.5); }
vec2 kfbWarpV2(vec2 p, float cell){ vec2 q = p / (cell * 0.8); return cell * 0.34 * vec2(kfbVN(q) - 0.5, kfbVN(q + 19.7) - 0.5); }
`;

/** per-island speckle offset and cell size from the seed */
export const speckleSeed = (seed) => ({ off: new THREE.Vector3(((seed * 13.7) % 997) + 0.37, ((seed * 7.1) % 991) + 0.61, ((seed * 3.3) % 983) + 0.83), cell: SPECKLE_CELL * (0.9 + 0.22 * ((seed * 0.618034) % 1)) });

/*
 * 3D variant of the S1 disk field for steep surfaces (Scholle under the rim): spheres in 3D cells instead of disks in a
 * 2D grid, so the drops stay round on any face orientation, without projection streaks or a seam around the island.
 * Same levels, cells and weights as kfbSpeckleLayer; its own quantile table (the 3D field has another distribution).
 */
function h3js(x, y, z) {
  let p = [x * 0.1031 % 1, y * 0.103 % 1, z * 0.0973 % 1].map((v) => v - Math.floor(v));
  const d = p[0] * (p[1] + 33.33) + p[1] * (p[0] + 33.33) + p[2] * (p[2] + 33.33);
  p = p.map((v) => v + d);
  const f = (v) => v - Math.floor(v);
  return [f((p[0] + p[1]) * p[2]), f((p[0] + p[2]) * p[1]), f((p[1] + p[2]) * p[0]), f((p[2] + p[0]) * p[2] * 1.37)];
}
function diskField3(x, y, z, seed) {
  const bx = Math.floor(x), by = Math.floor(y), bz = Math.floor(z);
  let F = -1e9;
  for (let k = -1; k <= 1; k++) for (let j = -1; j <= 1; j++) for (let i = -1; i <= 1; i++) {
    const cx = bx + i, cy = by + j, cz = bz + k, h = h3js(cx + seed, cy + seed, cz + seed), h2 = h3js(cx + seed + 7.3, cy + seed + 7.3, cz + seed + 7.3);
    const px = cx + 0.15 + 0.7 * h[0], py = cy + 0.15 + 0.7 * h[1], pz = cz + 0.15 + 0.7 * h[2], r = 0.28 + 0.32 * h[3], ht = 0.45 + 0.55 * h2[0];
    F = Math.max(F, ht * (1 - Math.hypot(x - px, y - py, z - pz) / r));
  }
  return F;
}
let K3 = null;
export function speckleK3(samples = 30000) {
  if (K3) return K3;
  const v = [], R = (n) => { const s = Math.sin(n * 12.9898) * 43758.5453; return s - Math.floor(s); };
  for (let n = 0; n < samples; n++) v.push(diskField3(R(n) * 61, R(n + 0.5) * 61, R(n + 0.25) * 61, 17));
  v.sort((a, b) => a - b);
  const STEPS = 64;
  K3 = [...Array(STEPS).keys()].map((i) => v[Math.min(v.length - 1, Math.max(0, Math.round((1 - i / (STEPS - 1)) * (v.length - 1))))]);
  return K3;
}
// sphere radii 0.28–0.60 = S1 disk radii 1:1 (larger radii made bigger, ring-shaped drops at the lip)
export const SPECKLE3_GLSL = /* glsl */ `
uniform float uSpeckleK3[64];
vec4 kfbH4(vec3 q){ vec3 p3 = fract(q * vec3(0.1031, 0.1030, 0.0973)); p3 += dot(p3, p3.yxz + 33.33);
  return vec4(fract((p3.xxy + p3.yzz) * p3.zyx), fract((p3.z + p3.x) * p3.z * 1.37)); }
float kfbDiskField3(vec3 x, float seed){ vec3 b = floor(x); float F = -1e9;
  for (int k = -1; k <= 1; k++) for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
    vec3 c = b + vec3(float(i), float(j), float(k)); vec4 h = kfbH4(c + seed); float ht = 0.45 + 0.55 * kfbH4(c + seed + 7.3).x;
    vec3 p = c + 0.15 + 0.7 * h.xyz; float r = 0.28 + 0.32 * h.w; F = max(F, ht * (1.0 - length(x - p) / r)); }
  return F; }
float kfbSpeckleK3(float w){ float t = clamp(w, 0.0, 1.0) * 63.0; int i = int(floor(t)); int j = min(i + 1, 63); return mix(uSpeckleK3[i], uSpeckleK3[j], fract(t)); }
// No early returns before fwidth(): derivatives in divergent control flow are undefined and drew a dashed rim line along
// the w = 0.999 isoline. Field and derivatives are evaluated on every path; w only selects afterwards.
float kfbSpeckle3(vec3 su, float cell, float seed, float w){
  float F = kfbDiskField3(su / cell, seed); float k = kfbSpeckleK3(w); float fw = max(fwidth(F), 1e-4);
  float m = smoothstep(k - fw, k + fw, F);
  return w <= 0.001 ? 0.0 : w >= 0.999 ? 1.0 : m; }
// the quantile table comes from 30 k JS samples: its extreme end (w → 1) is not the true field minimum, which left tiny
// holes along the onset line. The top 4 % of w count as solid, so holes start inside the reliable part of the table.
/** pixel size of one cell (3D twin of kfbSpeckleLod): fine levels fade once a cell gets smaller than a few pixels */
float kfbSpeckleLod3(vec3 p, float cell){ vec3 g = fwidth(p / cell); return clamp((0.35 - max(g.x, max(g.y, g.z))) / 0.2, 0.0, 1.0); }
float kfbSpeckleLayer3(vec3 p, float cell, float w0, out float rim){
  float w = clamp(w0 / 0.96, 0.0, 1.0), w15 = w * sqrt(w), v = 1.0 - w, v15 = v * sqrt(v);
  float a = kfbSpeckle3(p, cell, 17.0, w);
  float m = kfbSpeckle3(p + 13.1, cell * 0.42, 29.0, smoothstep(0.0, 0.95, w15) * 0.5);
  float s = kfbSpeckle3(p + 27.7, cell * 0.2, 41.0, smoothstep(0.0, 0.7, w15) * 0.32);
  float u = kfbSpeckle3(p + 51.9, cell * 0.09, 53.0, smoothstep(0.0, 0.6, w15) * 0.22) * kfbSpeckleLod3(p, cell * 0.09);
  float b = kfbSpeckle3(p + 41.3, cell * 0.36, 67.0, smoothstep(0.0, 0.95, v15) * 0.42);
  float b2 = kfbSpeckle3(p + 63.7, cell * 0.16, 79.0, smoothstep(0.0, 0.8, v15) * 0.25) * kfbSpeckleLod3(p, cell * 0.16);
  float sel = max(max(a, m), max(s, u)) * (1.0 - max(b, b2));   // all six S1 levels (micro dots, small drop-backs)
  sel = w <= 0.001 ? 0.0 : w >= 0.999 ? 1.0 : sel;
  rim = clamp(fwidth(sel) * 0.9, 0.0, 1.0); return sel; }
`;
// ═══ DONOR ENDE ═══

// ═══ WS1-ERWEITERUNG (V-403 / TRANSITION_INTENT_R1) · kein Donor-Code, nutzt nur Donor-Funktionen ═══
// Quantil-Tabelle der zweiseitigen großen Ebene: D = F(x) − F(x + 71,3) mit zwei Seeds (17, 23), gleiche Methode und Stichprobe wie speckleThresholds
// (JS-Zwilling diskField; der Shader rechnet mit dem Hoskins-Hash wie im Donor, die Verteilung ist dieselbe). F und G sind gleich verteilt, also ist die
// Tabelle punktsymmetrisch: k(w) ≈ −k(1 − w). Erdflecken im Gras und Grasflecken in der Erde haben dieselbe Form und dünnen gleich aus.
export function speckleBiThresholds(samples = 40000) {
  const v = []
  for (let n = 0; n < samples; n++) {
    const x = fract(Math.sin(n * 12.9898) * 43758.5453) * 97.0, y = fract(Math.sin(n * 78.233) * 43758.5453) * 97.0
    v.push(diskField(x, y, 17.0) - diskField(x + 71.3, y + 71.3, 23.0))
  }
  v.sort((a, b) => a - b)
  return [...Array(SPECKLE_STEPS).keys()].map((i) => v[Math.min(v.length - 1, Math.max(0, Math.round((1 - i / (SPECKLE_STEPS - 1)) * (v.length - 1))))])
}
let KB = null
export const speckleBiK = () => (KB ??= speckleBiThresholds())

// Formverzerrung gegen Scheiben: zwei feinere Warp-Oktaven (0,45 und 0,21 Zelle, Donor-kfbWarpV2/V3) auf die Donor-Warp (0,34 bei 0,8 Zelle). Große
// Flecken werden zu Klecksen mit Buchten, mittlere zu gezogenen Tropfen; Fläche bleibt im Mittel erhalten (Deckung = w bleibt). Dazu im Wrapper eine
// flächentreue Streckung (det = 1) je Seed: Flecken „gezogen“, Richtung je Zone anders. Eine Verzerrung je Pixel für alle Ebenen (Budget wie Donor).
export const WS1_SHAPE_GLSL = /* glsl */ `
vec2 kfbWs1Shape2(vec2 p, float cell){ return kfbWarpV2(p + 3.7, cell * 0.45) + kfbWarpV2(p + 11.3, cell * 0.21); }
vec3 kfbWs1Shape3(vec3 p, float cell){ return kfbWarpV3(p + 3.7, cell * 0.45) + kfbWarpV3(p + 11.3, cell * 0.21); }
`
// Zwei Richtungen (große Ebene): Differenz zweier unabhängiger Scheibenfelder. B-Flecken in A sind Kuppen von F, A-Flecken in B Kuppen von G, beide
// gleich geformt (Donor: A in B nur als Zwickel zwischen den Scheiben, deshalb lief es nur in eine Richtung). Die Ränder sind Ovale statt Kreise.
// fwidth vor jeder Auswahl (Donor-Regel 2026-10-10, sonst gestrichelte Randlinien an den Isolinien w = 0,001 / 0,999).
export const WS1_BI_GLSL = /* glsl */ `
uniform float uSpBiK[64]; uniform float uSpMix;
float kfbWs1BiK(float w){ float t = clamp(w, 0.0, 1.0) * 63.0; int i = int(floor(t)); int j = min(i + 1, 63); return mix(uSpBiK[i], uSpBiK[j], fract(t)); }
float kfbWs1SpeckleBi(vec2 su, float cell, float w){
  vec2 x = su / cell; float D = kfbDiskField(x, 17.0) - kfbDiskField(x + 71.3, 23.0); float k = kfbWs1BiK(w); float fw = max(fwidth(D), 1e-4);
  float m = smoothstep(k - fw, k + fw, D);
  return w <= 0.001 ? 0.0 : w >= 0.999 ? 1.0 : m; }
`
// Ebenen-Sätze, fest beim Kompilieren (keine Verzweigung um fwidth):
//   bi = false: Donor-kfbSpeckleLayer 1:1 (Größen, Seeds, Gewichte); micro = false lässt Mikro-Punkte und kleine Rücktropfen weg (Preset built).
//     bi = false, micro = true ergibt exakt den Donor-Text von kfbSpeckleLayer (Test prüft das); dann ruft patch() direkt die Donor-Funktion.
//   bi = true: große Ebene zweiseitig (kfbWs1SpeckleBi), kleine Ebenen spiegelbildlich: B-Tropfen (0,42 / 0,2 / 0,09 Zelle) laufen in A hinaus,
//     A-Tropfen (0,36 / 0,18 / 0,09) in B. Ihre Dichte ist ein Buckel zur jeweils fernen Seite hin (cB = mix · 6,75 · w · (1 − w)², cA gespiegelt,
//     zum Bandende sanft auf 0). Im Donor stachen die Rücktropfen gerade die wenigen B-Flecken auf (Ringe/Krapfen = „Kreise“); hier nicht.
//     uSpMix (Standard 0,3) regelt die Menge kleiner Tropfen ohne Neu-Kompilieren; mehr wird schnell Rausch-Gesprenkel (verboten).
export const ws1LayerGLSL = (name, bi, micro) => (bi ? `float ${name}(vec2 p, float cell, float w, out float rim){
  float r; float v = 1.0 - w;
  float cB = uSpMix * 6.75 * w * v * v * smoothstep(0.0, 0.3, w), cA = uSpMix * 6.75 * v * w * w * smoothstep(0.0, 0.3, v);
  float a = kfbWs1SpeckleBi(p, cell, w);
  float m = kfbSpeckle(p + 13.1, cell * 0.42, 29.0, cB * 0.5, r);
  float s = kfbSpeckle(p + 27.7, cell * 0.2, 41.0, cB * 0.32, r);
  float u = ${micro ? 'kfbSpeckle(p + 51.9, cell * 0.09, 53.0, cB * 0.22, r) * kfbSpeckleLod(p, cell * 0.09)' : '0.0'};
  float b = kfbSpeckle(p + 41.3, cell * 0.36, 67.0, cA * 0.5, r);
  float b1 = kfbSpeckle(p + 33.9, cell * 0.18, 71.0, cA * 0.32, r);
  float b2 = ${micro ? 'kfbSpeckle(p + 63.7, cell * 0.09, 79.0, cA * 0.22, r) * kfbSpeckleLod(p, cell * 0.09)' : '0.0'};
  float sel = max(max(a, m), max(s, u)) * (1.0 - max(max(b, b1), b2));
  sel = w <= 0.001 ? 0.0 : w >= 0.999 ? 1.0 : sel;
  rim = clamp(fwidth(sel) * 0.9, 0.0, 1.0); return sel; }` : `float ${name}(vec2 p, float cell, float w, out float rim){
  float r; float w15 = w * sqrt(w), v = 1.0 - w, v15 = v * sqrt(v);
  float a = kfbSpeckle(p, cell, 17.0, w, r);
  float m = kfbSpeckle(p + 13.1, cell * 0.42, 29.0, smoothstep(0.0, 0.95, w15) * 0.5, r);
  float s = kfbSpeckle(p + 27.7, cell * 0.2, 41.0, smoothstep(0.0, 0.7, w15) * 0.32, r);
  float u = ${micro ? 'kfbSpeckle(p + 51.9, cell * 0.09, 53.0, smoothstep(0.0, 0.6, w15) * 0.22, r) * kfbSpeckleLod(p, cell * 0.09)' : '0.0'};
  float b = kfbSpeckle(p + 41.3, cell * 0.36, 67.0, smoothstep(0.0, 0.95, v15) * 0.42, r);
  float b2 = ${micro ? 'kfbSpeckle(p + 63.7, cell * 0.16, 79.0, smoothstep(0.0, 0.8, v15) * 0.25, r) * kfbSpeckleLod(p, cell * 0.16)' : '0.0'};
  float sel = max(max(a, m), max(s, u)) * (1.0 - max(b, b2));
  sel = w <= 0.001 ? 0.0 : w >= 0.999 ? 1.0 : sel;
  rim = clamp(fwidth(sel) * 0.9, 0.0, 1.0); return sel; }`)
// ═══ WS1-ERWEITERUNG ENDE ═══

// ═══ WS1-HÜLLE ═══
const clamp01 = (v) => Math.min(1, Math.max(0, v))
const sstep = (a, b, x) => { const t = clamp01((x - a) / (b - a)); return t * t * (3 - 2 * t) }
const gf = (v) => Number(v).toFixed(6) // GLSL-Float-Literal

/** Zelle in J17-Metern (V-403-Startwert) und Umrechnung Lab → J17 */
export const CELL_M = 1.1
export const LAB_UNIT_M = 1.46
/** Looks: 'intent' = Georgs Absicht (Standard), 's1' = Donor-Stand ohne WS1-Erweiterung (A/B) */
export const LOOKS = Object.freeze({
  intent: Object.freeze({ shape: 1, stretch: 1.15, bidir: true, mix: 0.3 }),
  s1: Object.freeze({ shape: 0, stretch: 1, bidir: false, mix: 0.3 }),
})

/** Seed aus Zahl oder Zonen-/Bühnen-Name (FNV-1a), deterministisch */
export function seedOf(id) {
  if (typeof id === 'number' && Number.isFinite(id)) return id
  let h = 0x811c9dc5
  for (const ch of String(id)) { h ^= ch.codePointAt(0); h = Math.imul(h, 0x01000193) >>> 0 }
  return (h % 100003) + 1
}
/** Seed je Zone in J17-Metern: Donor-speckleSeed (Versatz, Zelle × 0,9 … 1,12 = ±11 %), Zelle von Lab-1,6 auf cell_m umgerechnet */
export function zoneSeed(seed, cell_m = CELL_M) {
  const s = seedOf(seed), d = speckleSeed(s)
  return { seed: s, off: d.off, cell: cell_m * (d.cell / SPECKLE_CELL), angle: fract(s * 0.381966) * Math.PI }
}
// flächentreue Streckung (det = 1) um den Seed-Winkel, als mat2-Spalten in einem vec4
const stretchVec = (s, angle) => {
  const c = Math.cos(angle), n = Math.sin(angle), a = c * c * s + (n * n) / s, b = c * n * (s - 1 / s), d = n * n * s + (c * c) / s
  return new THREE.Vector4(a, b, b, d)
}

/** Presets (Audit §4, V-403). Bänder in Metern; ⚠ status PROPOSED = noch kein Georg-Urteil. Wobble siehe weights. */
export const PRESETS = Object.freeze({
  'track↔ground': Object.freeze({ alias: 'track-ground', cell_m: 1.1, space: 'world-xz', bake: 'band', band: Object.freeze({ inner: 0.6, outer: 3.4 }), layer: Object.freeze({ cellScale: 1, rim: 0.1 }),
    colors: 'shoulder/sand über ground (V-305-Rollen); distFn = Abstand zum Straßen- bzw. Bahnrand', src: 'R2D v0 island.js:146–153 (hw+0,6 … hw+3,4 = 2,8 m), Joyride', status: 'Quelle' }),
  'diorama↔ground': Object.freeze({ alias: 'diorama-ground', cell_m: 1.1, space: 'world-xz', bake: 'band', band: Object.freeze({ inner: 0.5, outer: 6 }), bandRange_m: Object.freeze([3, 8]), layer: Object.freeze({ cellScale: 1, rim: 0.1 }),
    colors: 'Ebene = Ring (dominante edgePalette-/Boden-Rolle der Bühne, ΔE ≤ 0,05 an der Naht), Grundfarbe = Zonenboden; distFn = Abstand zum footprint', src: 'V-403, WS0_TO_WS1:25', status: 'Startwert V-403' }),
  'biome↔biome': Object.freeze({ alias: 'biome-biome', cell_m: 1.1, space: 'world-xz', bake: 'zone', zone: Object.freeze({ band_m: 9 }), bandRange_m: Object.freeze([6, 12]), layer: Object.freeze({ cellScale: 1, rim: 0.1 }),
    colors: 'Ebene = ground-Rolle von Biom B, Grundfarbe = ground-Rolle von Biom A', src: 'Audit §4', status: 'PROPOSED' }),
  'rim/scholle': Object.freeze({ alias: 'rim-scholle', cell_m: 1.1, space: 'world-3d', bake: 'depthBelowRim', depth: Object.freeze({ solid_m: 1.75, band_m: 3.8 }), layer: Object.freeze({ cellScale: 1, rim: 0.1 }),
    colors: 'Ebene = grass (Kante), Grundfarbe = earth', src: 'Lab scholle.ts:340–351 (voll 1,2, Ende ≈ 3 + 0,01·Dm Lab-Einheiten, × 1,46)', status: 'Quelle, umgerechnet' }),
  built: Object.freeze({ alias: 'built', cell_m: 1.7, space: 'world-xz', bake: null, layer: Object.freeze({ cellScale: 1, rim: 0.1, micro: false, bidir: false }),
    colors: 'Belag A über Belag B (ersetzt kfbBlend in neuem Code)', src: 'Joyride Fahrbahn Zelle 1,7 (track-look.v5.js:76)', status: 'PROPOSED' }),
})
/** Preset nach Name oder ASCII-Alias ('diorama-ground' …) */
export function presetOf(name) {
  if (!name) return null
  if (PRESETS[name]) return PRESETS[name]
  for (const k of Object.keys(PRESETS)) if (PRESETS[k].alias === name) return PRESETS[k]
  throw new Error(`[speckle] unbekanntes Preset '${name}' (${Object.keys(PRESETS).join(', ')})`)
}

const BUILTIN_ATTR = new Set(['position', 'normal', 'uv'])
const OFF2 = [31.7, 57.3, 83.9], OFF3 = [13.9, 47.3, 91.7] // Versatz je Ebene (Donor TOP_LAYERS 31,7/57,3; Scholle 13,9/47,3/91,7)
function parseWeight(wt, i) {
  if (typeof wt === 'number') { if (!Number.isFinite(wt)) throw new Error(`[speckle] Ebene ${i}: weight ist keine Zahl`); return { expr: gf(clamp01(wt)), attr: null, vec: false } }
  const m = /^([A-Za-z_]\w*)(?:\.([xyzw]))?$/.exec(String(wt))
  if (!m) throw new Error(`[speckle] Ebene ${i}: weight '${wt}' muss ein Attribut sein ('aSW.x' oder 'aW')`)
  return { expr: m[0], attr: m[1], comp: m[2] || null, vec: !!m[2] }
}
const toColor = (c) => (c instanceof THREE.Color ? c.clone() : new THREE.Color(c ?? '#ff00ff'))

/**
 * Sprenkel-Instanz für eine Zone/Bühne. seed: Zahl oder Name (je Zone eigener Seed!). look 'intent' (Standard) oder 's1'; shape/stretch/bidir
 * überschreiben den Look; mix = Menge kleiner Tropfen im zweiseitigen Modus (Uniform uSpMix). preset: Name aus PRESETS (setzt cell_m, space und Ebenen-Vorgaben).
 */
export function createSpeckle({ seed = 0, cell_m, space, look = 'intent', shape, stretch, bidir, mix, preset } = {}) {
  const P = presetOf(preset), L0 = LOOKS[look]
  if (!L0) throw new Error(`[speckle] unbekannter look '${look}'`)
  const cfg = { cell_m: cell_m ?? P?.cell_m ?? CELL_M, space: space ?? P?.space ?? 'world-xz', shape: shape ?? L0.shape, stretch: stretch ?? L0.stretch, bidir: bidir ?? L0.bidir, mix: mix ?? L0.mix }
  if (cfg.space !== 'world-xz' && cfg.space !== 'world-3d') throw new Error(`[speckle] space '${cfg.space}' (world-xz | world-3d; track-su: TODO)`)
  const zone = zoneSeed(seed, cfg.cell_m)
  const handles = []

  function patch(material, { layers = [], key: extraKey = '' } = {}) {
    if (!material || typeof material.onBeforeCompile !== 'function') throw new Error('[speckle] patch braucht ein three-Material')
    if (material.userData?.kfbSpeckle) throw new Error('[speckle] Material ist schon gesprenkelt (ein patch je Material)')
    if (!layers.length || layers.length > 3) throw new Error(`[speckle] 1–3 Ebenen je Material, nicht ${layers.length}`)
    const notes = []
    const Ls = layers.map((l, i) => {
      const d = { ...(P?.layer || {}), ...l }, w = parseWeight(d.weight, i), sp = d.space ?? cfg.space
      let bi = d.bidir ?? cfg.bidir
      if (sp === 'world-3d' && bi) { bi = false; notes.push(`Ebene ${i}: bidir in world-3d noch nicht (TODO), Donor-3D-Ebene`) }
      if (sp === 'world-3d' && d.micro === false) notes.push(`Ebene ${i}: micro:false in world-3d noch nicht (TODO)`)
      return { i, name: d.name ?? String(i), w, space: sp, bi, micro: d.micro ?? true, color: toColor(d.color), cellScale: d.cellScale ?? 1, rim: d.rim ?? 0.1 }
    })
    // Attribute: mit Komponente als vec4 (WebGL füllt kürzere Puffer auf), ohne als float
    const attrs = new Map()
    for (const L of Ls) if (L.w.attr && !BUILTIN_ATTR.has(L.w.attr)) attrs.set(L.w.attr, attrs.get(L.w.attr) || L.w.vec)
    for (const L of Ls) if (L.w.attr && attrs.get(L.w.attr) && !L.w.vec) L.w.expr = L.w.attr + '.x'
    const has2 = Ls.some((L) => L.space === 'world-xz'), has3 = Ls.some((L) => L.space === 'world-3d'), hasBi = Ls.some((L) => L.bi), useShape = cfg.shape > 0
    const variants = new Map()
    for (const L of Ls) if (L.space === 'world-xz') {
      L.fn = !L.bi && L.micro ? 'kfbSpeckleLayer' : `kfbWs1Layer${L.bi ? 'B' : 'S'}${L.micro ? 'M' : 'N'}`
      if (L.fn !== 'kfbSpeckleLayer') variants.set(L.fn, ws1LayerGLSL(L.fn, L.bi, L.micro))
    } else L.fn = 'kfbSpeckleLayer3'
    const key = 'kfb-speckle-v1|' + Ls.map((L) => `${L.space}:${L.w.expr}:${L.fn}`).join(',') + (useShape ? '|shape' : '') + [...attrs].map(([a, v]) => `|${a}${v ? '4' : '1'}`).join('') + (extraKey ? '|' + extraKey : '')

    const U = {
      uSpeckleK: { value: speckleK() }, uSpCell: { value: zone.cell }, uSpOff: { value: zone.off.clone() },
      uSpStretch: { value: stretchVec(cfg.stretch, zone.angle) }, uSpShape: { value: cfg.shape },
    }
    if (has3) U.uSpeckleK3 = { value: speckleK3() }
    if (hasBi) { U.uSpBiK = { value: speckleBiK() }; U.uSpMix = { value: cfg.mix } }
    for (const L of Ls) { U['uSpC' + L.i] = { value: L.color }; U['uSpL' + L.i] = { value: new THREE.Vector2(L.cellScale, L.rim) } }

    const C = ['x', 'y', 'z'], wv = [0, 1, 2].map((j) => (Ls[j] ? Ls[j].w.expr : '0.0'))
    const vDecl = 'uniform vec3 uSpOff; varying vec3 vSpWP; varying vec3 vSpW;\n' + [...attrs].map(([a, v]) => `attribute ${v ? 'vec4' : 'float'} ${a};\n`).join('')
    const vBody = `
{ vec4 kfbSpP = vec4(position, 1.0);
#ifdef USE_INSTANCING
  kfbSpP = instanceMatrix * kfbSpP;
#endif
  vSpWP = (modelMatrix * kfbSpP).xyz + uSpOff; vSpW = vec3(${wv.join(', ')}); }`
    const fDecl = 'uniform float uSpCell; uniform vec4 uSpStretch; uniform float uSpShape; varying vec3 vSpWP; varying vec3 vSpW;\n'
      + Ls.map((L) => `uniform vec3 uSpC${L.i}; uniform vec2 uSpL${L.i};\n`).join('')
    const lib = SPECKLE_GLSL_NOSIN + (has3 ? SPECKLE3_GLSL : '') + WARP_GLSL + (useShape ? WS1_SHAPE_GLSL : '') + (hasBi ? WS1_BI_GLSL : '') + [...variants.values()].join('\n') + '\n'
    let body = '\n{ // kfb.speckle-transition/1 (V-403)\n'
    if (has2) body += `  vec2 kfbSpQ = mat2(uSpStretch.xy, uSpStretch.zw) * vSpWP.xz;\n  vec2 kfbSpW2 = kfbWarpV2(kfbSpQ, uSpCell)${useShape ? ' + uSpShape * kfbWs1Shape2(kfbSpQ, uSpCell)' : ''};\n`
    if (has3) body += `  vec3 kfbSpW3 = kfbWarpV3(vSpWP, uSpCell)${useShape ? ' + uSpShape * kfbWs1Shape3(vSpWP, uSpCell)' : ''};\n`
    for (const L of Ls) {
      const n = L.i, p = L.space === 'world-xz' ? `kfbSpQ + ${gf(OFF2[n])} + kfbSpW2 * uSpL${n}.x` : `vSpWP + ${gf(OFF3[n])} + kfbSpW3 * uSpL${n}.x`
      body += `  float kfbSpR${n}; float kfbSpA${n} = ${L.fn}(${p}, uSpCell * uSpL${n}.x, vSpW.${C[n]}, kfbSpR${n});\n`
      body += `  diffuseColor.rgb = mix(diffuseColor.rgb, uSpC${n}, kfbSpA${n}) * (1.0 - uSpL${n}.y * kfbSpR${n});\n`
    }
    body += '}\n'

    const prevOBC = material.onBeforeCompile, prevKey = material.customProgramCacheKey
    const ownOBC = Object.prototype.hasOwnProperty.call(material, 'onBeforeCompile'), ownKey = Object.prototype.hasOwnProperty.call(material, 'customProgramCacheKey')
    material.onBeforeCompile = function (sh, r) {
      prevOBC.call(this, sh, r)
      if (!sh.vertexShader.includes('#include <begin_vertex>')) throw new Error('[speckle] Vertex-Shader ohne <begin_vertex>')
      if (!sh.fragmentShader.includes('#include <color_fragment>')) throw new Error('[speckle] Fragment-Shader ohne <color_fragment>')
      if (sh.fragmentShader.includes('float kfbDiskField(')) throw new Error('[speckle] Shader enthält schon S1-Sprenkel (Donor-patchSpeckle?)')
      Object.assign(sh.uniforms, U)
      sh.vertexShader = vDecl + sh.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>' + vBody)
      sh.fragmentShader = fDecl + lib + sh.fragmentShader.replace('#include <color_fragment>', '#include <color_fragment>' + body)
    }
    material.customProgramCacheKey = function () { return prevKey.call(this) + '|' + key }
    material.userData.kfbSpeckle = { schema: SCHEMA, key, seed: zone.seed }
    material.needsUpdate = true

    const byName = (c) => {
      if (Array.isArray(c)) return c.map((v, i) => [i, v])
      return Object.entries(c || {}).map(([k, v]) => [Ls.find((L) => L.name === k)?.i ?? (/^\d+$/.test(k) ? Number(k) : -1), v])
    }
    const h = {
      material, key, uniforms: U, notes, layers: Ls.map((L) => ({ name: L.name, space: L.space, bidir: L.bi, micro: L.micro, fn: L.fn, weight: L.w.expr })),
      setColors(c) { for (const [i, v] of byName(c)) if (v != null && U['uSpC' + i]) U['uSpC' + i].value.copy(toColor(v)); return h },
      setLayer(i, { cellScale, rim } = {}) { const u = U['uSpL' + i]; if (u) { if (cellScale != null) u.value.x = cellScale; if (rim != null) u.value.y = rim } return h },
      dispose() {
        if (ownOBC) material.onBeforeCompile = prevOBC; else delete material.onBeforeCompile
        if (ownKey) material.customProgramCacheKey = prevKey; else delete material.customProgramCacheKey
        delete material.userData.kfbSpeckle
        material.needsUpdate = true
        const k = handles.indexOf(h); if (k >= 0) handles.splice(k, 1)
      },
    }
    handles.push(h)
    return h
  }

  const sp = {
    schema: SCHEMA, seed: zone.seed, zone, config: Object.freeze({ ...cfg }), preset: P,
    patch,
    /** Farben aller gepatchten Materialien (Array nach Index oder Objekt nach Ebenen-Name/Index), ohne Neu-Kompilieren */
    setColors(c) { for (const h of handles) h.setColors(c); return sp },
    /** Gewichte nach dem Preset der Instanz backen: band → arg = distFn, zone → arg = { zoneOf, zoneId }, depthBelowRim → arg ignoriert */
    bake(geom, arg, opts = {}) {
      if (!P?.bake) throw new Error('[speckle] Instanz ohne Preset mit Gewichts-Bäcker')
      if (P.bake === 'band') return weights.band(geom, arg, { ...P.band, seed: zone.seed, ...opts })
      if (P.bake === 'zone') return weights.zone(geom, arg.zoneOf, arg.zoneId, { ...P.zone, seed: zone.seed, ...opts })
      return weights.depthBelowRim(geom, { ...P.depth, seed: zone.seed, ...opts })
    },
    handles,
    dispose() { for (const h of [...handles]) h.dispose() },
  }
  return sp
}

// ── Gewichts-Bäcker (statisch je Vertex) ──
// Wobble (Donor scholle.ts:346–349): Einsatz- und Endlinie wandern langsam (Wertrauschen, Maßstab scale_m), damit die ersten vollen Flecken und die
// letzten Punkte nie auf einer Linie liegen (Abnahme: keine gerade Isolinie über 1 m). Werte in Metern, nur nach außen (wie Donor). false = aus.
export const WOBBLE = Object.freeze({ inner: 1.0, outer: 1.5, scale_m: 10 })
const wh = (x, y) => { const a = fract(x * 0.1031), b = fract(y * 0.1031), c = a; const d = a * (b + 33.33) + b * (c + 33.33) + c * (a + 33.33); return fract((a + d + b + d) * (c + d)) }
/** Wertrauschen 0..1 (JS, sinusfrei), deterministisch */
export function valueNoise(x, y) {
  const ix = Math.floor(x), iy = Math.floor(y); let fx = x - ix, fy = y - iy
  fx = fx * fx * (3 - 2 * fx); fy = fy * fy * (3 - 2 * fy)
  const a = wh(ix, iy), b = wh(ix + 1, iy), c = wh(ix, iy + 1), d = wh(ix + 1, iy + 1)
  return a + (b - a) * fx + (c - a) * fy + (a - b - c + d) * fx * fy
}
const wobbleAt = (wob, x, z, seed) => {
  if (!wob) return [0, 0]
  const s = (seed % 997) * 0.731, k = 1 / (wob.scale_m || 10)
  return [wob.inner * valueNoise(x * k + s, z * k + 3.1), wob.outer * valueNoise(x * k * 0.58 + 5 + s, z * k * 0.58 - s)]
}
function target(geom, { attr = 'aSW', channel = 0, itemSize = 3 } = {}) {
  const n = geom.getAttribute('position').count
  let a = geom.getAttribute(attr)
  if (!a || a.itemSize !== itemSize || a.count !== n) { a = new THREE.BufferAttribute(new Float32Array(n * itemSize), itemSize); geom.setAttribute(attr, a) }
  if (channel < 0 || channel >= itemSize) throw new Error(`[speckle] channel ${channel} außerhalb itemSize ${itemSize}`)
  return a
}
function eachWorld(geom, matrix, fn) {
  const P = geom.getAttribute('position'), v = new THREE.Vector3()
  for (let i = 0; i < P.count; i++) { v.fromBufferAttribute(P, i); if (matrix) v.applyMatrix4(matrix); fn(i, v.x, v.y, v.z) }
}
const put = (a, i, channel, w) => { a.array[i * a.itemSize + channel] = w }

export const weights = Object.freeze({
  /** Band an einer Kante: w = 1 − smoothstep(inner, outer, d), d = distFn(x, y, z, i) in Metern (Welt, falls matrix). w = 1 innen = Ebenenfarbe. */
  band(geom, distFn, { inner = 0, outer = 3, attr, channel = 0, itemSize, matrix, wobble = WOBBLE, seed = 0 } = {}) {
    const a = target(geom, { attr, channel, itemSize }), out = new Float32Array(a.count)
    eachWorld(geom, matrix, (i, x, y, z) => {
      const [wi, wo] = wobbleAt(wobble, x, z, seed), i0 = inner + wi, o0 = Math.max(outer + wo, i0 + 1e-3)
      const w = 1 - sstep(i0, o0, distFn(x, y, z, i)); out[i] = w; put(a, i, channel, w)
    })
    a.needsUpdate = true
    return out
  },
  /** Biom ↔ Biom: Anteil der Zone zoneId in einer Scheibe (Ø band_m, 64 Vogel-Punkte) um den Vertex, geglättet; zoneOf(x, z) → Zonen-Id.
   *  Außerhalb des Bands exakt 0 bzw. 1. Wobble verschiebt den Messpunkt (± 0,25 band_m), damit die Grenze nie als gerade Linie liest. */
  zone(geom, zoneOf, zoneId, { band_m = 9, samples = 64, attr, channel = 0, itemSize, matrix, wobble = WOBBLE, seed = 0 } = {}) {
    const a = target(geom, { attr, channel, itemSize }), out = new Float32Array(a.count), R = band_m / 2
    const S = [...Array(samples).keys()].map((k) => { const r = R * Math.sqrt((k + 0.5) / samples), t = k * 2.399963229728653; return [r * Math.cos(t), r * Math.sin(t)] })
    eachWorld(geom, matrix, (i, x, y, z) => {
      let cx = x, cz = z
      if (wobble) { const k = 1 / (wobble.scale_m || 10), s = (seed % 997) * 0.731; cx += 0.25 * band_m * (2 * valueNoise(x * k + s, z * k) - 1); cz += 0.25 * band_m * (2 * valueNoise(x * k - 7.7, z * k + s) - 1) }
      let c = 0
      for (const [dx, dz] of S) if (zoneOf(cx + dx, cz + dz) === zoneId) c++
      const f = c / samples, w = f * f * (3 - 2 * f); out[i] = w; put(a, i, channel, w)
    })
    a.needsUpdate = true
    return out
  },
  /** Rand/Scholle: Gras läuft über die Kante in die Erde. dd = rimY − y; voll bis solid_m, Sprenkel über band_m (Donor scholle.ts:340–351).
   *  rimY: Zahl oder (x, z) → Höhe der Kante; Standard = höchster Punkt der Geometrie. Ebene mit space 'world-3d' verwenden. */
  depthBelowRim(geom, { band_m = 3.8, solid_m = 1.75, rimY, attr, channel = 0, itemSize, matrix, wobble = WOBBLE, seed = 0 } = {}) {
    const a = target(geom, { attr, channel, itemSize }), out = new Float32Array(a.count)
    let top = -Infinity
    if (rimY == null) eachWorld(geom, matrix, (i, x, y) => { if (y > top) top = y })
    const rim = typeof rimY === 'function' ? rimY : () => (rimY ?? top)
    eachWorld(geom, matrix, (i, x, y, z) => {
      const [wi, wo] = wobbleAt(wobble, x, z, seed), i0 = solid_m + wi, o0 = Math.max(solid_m + band_m + wo, i0 + 1e-3)
      const w = 1 - sstep(i0, o0, rim(x, z) - y); out[i] = w; put(a, i, channel, w)
    })
    a.needsUpdate = true
    return out
  },
})

// ── Bewuchs-Haken (TRANSITION_INTENT_R1: Bewuchs dünnt über die Zone aus, Gruppenregel nest() aus Lab environment/grounding.ts) ──
// Kein eigener Regelsatz: nest() bleibt, wie es ist; der Haken skaliert nur seine Eingaben bzw. dünnt seine Ausgabe nach dem gebackenen Gewicht w
// (w = Anteil der Gegenseite, z. B. Erde). Büschel laufen bis w ≈ end in die Erde hinein (zweite Richtung), werden kleiner und seltener.
export const vegetation = Object.freeze({
  /** Dichte 0..1 des Bewuchses bei Gewicht w der Gegenseite */
  density: (w, { end = 0.92, gamma = 1.5 } = {}) => (1 - sstep(0, end, clamp01(w))) ** gamma,
  /** Eingaben für nest(R, sx, sz, dir, spread, reach, big, count) an der Quelle: weniger, kleinere Teile; null = hier keine Gruppe */
  nestParams(p, w, opts) {
    const d = vegetation.density(w, opts)
    if (d < 0.05) return null
    return { ...p, count: Math.max(1, Math.round(p.count * d)), big: p.big * (0.55 + 0.45 * d), reach: p.reach * (0.7 + 0.3 * d) }
  },
  /** Ausgabe von nest() ausdünnen: Teil bleibt mit Wahrscheinlichkeit density(wAt(x, z)), Größe schrumpft mit; R = Zufall der Gruppe (deterministisch) */
  thin(bits, wAt, R, opts) {
    const out = []
    for (const b of bits) { const d = vegetation.density(wAt(b.x, b.z), opts); if (d > 0 && R() < d) out.push({ ...b, size: b.size * (0.55 + 0.45 * d) }) }
    return out
  },
})
