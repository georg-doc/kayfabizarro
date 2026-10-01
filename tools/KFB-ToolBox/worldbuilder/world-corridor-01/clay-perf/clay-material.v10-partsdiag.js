/* WC1 Clay Parts diagnostic derivative.
 * Exact clay-material.v10.js source plus five diagnostic feature gates.
 * Defaults = 1 preserve the original v10 path. This file is evidence-only and not a new Clay owner.
 */
/* clay-material v10 (K2, 28.09.) — wie v9, zwei Änderungen: die alte Handspurkarte (v2) ist je Material schaltbar,
 *   und die großen Druckwellen (uClayMacro, dieselbe v2-Karte in 1/7 Frequenz) folgen diesem Schalter. Gemessen in K2: Macro
 *   zog die Spachtel-Querriefen der v2-Karte auf 30–70 m auf, Hügel lasen als Holzmaserung, der Strang bekam dunkle Querstreifen.
 *   Erste Fassung ohne die zweite Änderung wurde nur in K2 geladen.
 * Änderung 1:
 *   (profile.legacy: 1 an, 0 aus, fehlt = global uClayLegacyStroke). Grund: die Fahrbahn behält ihr Straßenprofil von
 *   T2 21:30 (Georg: »das einzig Gute«), alle anderen Massen laufen auf den Werkzeugen. */
/* clay-material v9 (K2, 28.09.) — Georg 27.09.: »Übergänge unsauber, hart geschnitten« + »mehr Variationen und Stärkegrade/Größen«.
 *   · Druckfacetten laufen zum Zellrand auf null aus (uClayFacetSoft). v8 kippte jede Zelle als Ganzes: harte, gerade Kanten, dunkle Scherben.
 *   · Sechseck-Kachelung: Mischung breiter (uClayHexK, v8 = 3), Drehung je Zelle begrenzt (uClayHexRot, v8 = volle Drehung) und einem
 *     langsamen Richtungsfeld folgend (uClayHexFlow): Nachbarzellen liegen fast gleich, die Naht fällt nicht mehr als Kante auf.
 *   · Werkzeuge einzeln (clay-relief.v3): je Werkzeug Stärke k, Größe s (× Handmaß), Abdeckung c; Werkzeugzonen statt Gleichverteilung.
 *     Je Material über profile.tools, live über uClayToolGain. uClayLegacyStroke blendet die v2-Handspurkarte (0 = aus).
 *   · Prüfansichten uClayDebug: 2 Kachelzellen · 3 Facetten · 4 Werkzeugzonen.
 * Alles andere wie v8. v8 bleibt unverändert für T3, H0, K1, K7. */
/* clay-material v8 — v8 (27.09.): Handmaß. Handspuren, Feinkorn und Fingerabdrücke haben eine feste Weltgröße (uClayHand,
 *   Voreinstellung 0,5 = Figurprofil), nicht mehr den Maßstab des Profils: auf Gelände waren die Fächer und Abdrücke
 *   2–6× zu groß und lasen als Rillenfelder (Pixelaufnahme K1). Profilmaßstab steuert weiter Druckwellen, Facetten,
 *   Kerben, Risse, Druckstellen. Druckstellen und Kerben größer als eine Fingerkuppe werden flacher statt tiefer.
 */
/* clay-material v7 — v7: Entfernungsbänder nach Pixelaufnahme H0 um ×2,5 verschoben (nah bis ≈ 4 Einheiten vor der
 *   Figur, vorher nie erreicht) · Haarrisse brechen ab statt als Netz zu lesen · Druckstellen streuen stärker in der Größe.
 *   Profile aus clay-profiles.v2.
 * clay-material v6 — v6: wie v5, Bezeichner »patch« (in GLSL ES 3 reserviert) umbenannt.
 * clay-material v5 — v5 (27.09.): Profile je Asset-Klasse (clay-profiles.v1), Detail nach Entfernung,
 * Sechseck-Kachelung ohne sichtbare Wiederholung, drei neue Spuren. Sonst wie v4.
 *   · Entfernung: Weltgröße eines Pixels px = |fwidth(P)|. Nah (Fingerabdrücke, Haarrisse) blendet ab
 *     px/Maßstab 0,0035–0,011 aus, Mittel (Kerben) ab 0,03–0,09. Fern bleiben Druckstellen, Facetten, Farbunruhe.
 *     Jede Spur blendet zusätzlich aus, sobald sie schmaler als ein Pixel wird: kein Flimmern.
 *   · Sechseck-Kachelung (Heitz & Neyret 2018 / Mikkelsen 2022): drei Lesungen je Punkt, jede Zelle
 *     eigene Drehung und Lage, Mischung mit Varianzausgleich; textureGrad gegen Nähte an den Zellgrenzen.
 *   · Kerben vom Modellierholz: kurze Rinne mit aufgeworfener Lippe, entlang der Fläche, Enden laufen aus.
 *   · Haarrisse: Zellgrenzen eines verrauschten 3D-Voronoi, nur in Flecken, nur nah, dunkler Strich.
 *   · Druckstellen vom Anfassen: flache ovale Mulde mit Rand, glatter (Hautfett), Fingerabdruck darin verstärkt.
 *   · Farbunruhe: tieffrequente Helligkeit ±Mottle, wirkt in jeder Entfernung.
 * Neue globale Regler: uClayGouge, uClayCrack, uClayDent, uClayMottle, uClayLodK, uClayHandMix, uClayDebug (1 = Entfernungsbänder färben).
 *
 * clay-material v4 — v4: Maßstab je Material (scale) + Streuung je Objekt über claySeed. Sonst wie v3. */
/* KFB Knet-Material v3 — v3: große Flächen (Rolle ohne Quellmaterial, Schalter proc) bekommen
 * ein vollprozedurales Relief statt der Stempelkarte. Georg 26.09.: »die Texturen sind viel zu
 * unnatürlich und repetitiv … für Carl & Modelle passt es«. Befund an den großen Flächen: die
 * Fächer-Stempel lesen als wiederkehrende Einzelformen, die Voronoi-Falten als Netz. Referenz 05
 * zeigt stattdessen fließende Schlieren (parallele Kratzer entlang gebogener Linien), weite weiche
 * Druckwellen und wenige, abreißende Grate — alles ohne erkennbare Einheit.
 *   · Schlieren  = Höhenlinien eines verzerrten Rauschfeldes φ, cos(φ·K): bleiben parallel,
 *                  biegen sich mit dem Feld, reißen über eine Maske ab, blenden fern aus (fwidth)
 *   · Druckwellen = verzerrtes fbm
 *   · Grate      = eine einzelne Höhenlinie eines zweiten Feldes, nur in Teilgebieten
 * Nichts davon hat eine Periode. Modelle (Quellmaterial) laufen unverändert über v2.
 *
 * KFB Knet-Material v2 — macht aus einem beliebigen Material Knete, ohne UVs anzufassen.
 *
 * Neu in v2 (Georg 26.09.: »Problem sind die repetitiven Muster«):
 *   · Saat je Objekt (Attribut claySeed): gleich große Ziegel, geklonte Fahrbahnstücke und
 *     Kopien teilen sich nicht mehr dieselbe Musterlage. Befund in v1: jeder 2,16-m-Ziegel trug
 *     exakt dasselbe Relief, weil der Objektraum aller Ziegel identisch ist.
 *   · Druckfacetten: 3D-Voronoi im Objektraum, jede Zelle eine leicht gekippte, platte Fläche,
 *     an einem Teil der Zellgrenzen eine Falte. Rein prozedural, wiederholt sich nie.
 *     Verfahren nach joebinns/clay (MIT, Unity ShaderGraph): »Voronoi noise is used to flatten
 *     normals, creating a handcrafted look«. Kein Code übernommen, nur das Verfahren.
 *   · Fingerabdrücke aus einer echten Aufnahme (cgbookcase Fingerprints 01, via joebinns/clay):
 *     Dellen im Relief und etwas weniger Rauheit, wo Haut die Knete berührt hat (»natural oils«).
 *
 * Schicht »Asset Calibration« aus WORLD_COLOR_LIGHTING_COHESION: das Asset behält Form und
 * Grundfarbe, das Material liefert Relief, Rauheit, Sheen und optional die Palette.
 *
 * Relief: dreiachsig im OBJEKTRAUM projiziert (Ruhelage), damit es auf bewegten Teilen klebt.
 * Die Dichte folgt der Weltgröße (Länge von modelMatrix[0]), ein hochskaliertes Kenney-Stück
 * bekommt also dieselben Fingerspuren wie ein kleines. Gegen Wiederholung wird jede Achse zweimal
 * gelesen (gedreht, versetzt, anders skaliert) und über ein tieffrequentes Rauschen überblendet.
 *
 * Gelernt aus Claybound PR #62: eine vorhandene Normal-Map wird nie per setScalar gesetzt,
 * sondern genau einmal multipliziert — sonst geht der Y-Flip von GLTFLoader verloren.
 */

import { PROFILES } from '../baseline-source/lab-clay/clay-profiles.v2.js';
export { PROFILES };
export const TOOL_ORDER = ['fan', 'smear', 'crease', 'dent', 'thumb', 'roll'];

export const PALETTES = {
  // gemessen an ref/claybound (Median 24 px), dazu die Materialwerte aus PR #7
  claybound: {
    ground: '#ef5a22', ground2: '#e8743a', track: '#5d6f86', trackLine: '#e2d0bc',
    wall: '#5983ac', roof: '#ef5a22', accent: '#f2b632', cloud: '#e2d0bc',
    knetbar: '#8b68c7', knetbarCap: '#a582d9', leaf: '#1f7a3e', lime: '#cdc666',
    car: '#ef5a22', far: '#f0a27c', sky: '#96bede'
  },
  // gemessene Option-C-Tafeln (lab-v9/option-c-style.v1.js)
  optionc: {
    ground: '#d8956b', ground2: '#c88869', track: '#279797', trackLine: '#fdd37b',
    wall: '#d5c8b2', roof: '#d76974', accent: '#fdd37b', cloud: '#fddb88',
    knetbar: '#b86384', knetbarCap: '#c8657b', leaf: '#57a59b', lime: '#fde892',
    car: '#fb3233', far: '#f6b888', sky: '#88243c'
  }
};
export const PALETTE_ORDER = ['ground', 'track', 'wall', 'roof', 'accent', 'cloud', 'leaf', 'car'];

export function makeClayUniforms(THREE, reliefTex) {
  return {
    uClayRelief: { value: reliefTex },
    uClayOn: { value: 1 },
    uClayTile: { value: 1.6 },      // Weltgröße einer Kachel der Handspuren
    uClayStroke: { value: 0.55 },   // Stärke der Handspuren
    uClayGrain: { value: 0.16 },
    uClayMacro: { value: 0.5 },     // große, weiche Druckstellen (dieselbe Karte, 1/7 Frequenz)
    uClayPal: { value: Array.from({ length: 8 }, () => new THREE.Color()) },
    uClayPalN: { value: 0 },
    uClayPalMix: { value: 0 },
    uClayPrint: { value: null },     // Gradientkarte der Fingerabdrücke (RG) + Maske (B)
    uClayPrintOn: { value: 0 },
    uClayPrintTile: { value: 4.5 },
    uClayPrintK: { value: 0.35 },
    uClayOil: { value: 0.22 },
    uClayFacet: { value: 0.14 },     // Kippung der Druckfacetten
    uClayFacetSize: { value: 0.65 }, // Weltgröße einer Facette
    uClayCrease: { value: 0.6 },
    uClayProcStri: { value: 1.0 },
    uClayProcSmear: { value: 1.0 },
    uClayProcLine: { value: 1.0 },
    uClayProcK: { value: 300.0 },
    uClayGouge: { value: 1.0 },      // Kerben (global)
    uClayCrack: { value: 1.0 },      // Haarrisse (global)
    uClayDent: { value: 1.0 },       // Druckstellen (global)
    uClayMottle: { value: 0.05 },    // Farbunruhe ± Helligkeit
    uClayLodK: { value: 1.0 },
    uClayHand: { value: 0.5 },       // Handmaß (Welt): Größe von Fingerspuren, Feinkorn, Abdrücken — gleich für alle Profile       // > 1: Detail blendet früher aus
    uClayHandMix: { value: 0.0 },    // 0 Handmaß · 1 Objektmaß (braucht objSize)
    uClayDebug: { value: 0.0 },      // 1 Entfernungsbänder · 2 Kachelzellen · 3 Facetten · 4 Werkzeugzonen
    uClayHexK: { value: 1.6 }, uClayHexRot: { value: 0.12 }, uClayHexFlow: { value: 1.0 }, uClayFacetSoft: { value: 0.32 },
    uClayToolA: { value: reliefTex }, uClayToolB: { value: reliefTex }, uClayToolC: { value: reliefTex },
    uClayToolOn: { value: 0 }, uClayLegacyStroke: { value: 1 }, uClayZone: { value: 6.0 }, uClayToolGain: { value: [1, 1, 1, 1, 1, 1] },
    // WC1 diagnostic-only feature switches. Defaults preserve v10 pixels.
    uClayPerfRelief: { value: 1 }, uClayPerfMarks: { value: 1 }, uClayPerfPrint: { value: 1 },
    uClayPerfFacet: { value: 1 }, uClayPerfMottle: { value: 1 },
    // Global Clay Lite: off by default. One packed shared texture, source colour stays authoritative.
    uClayLiteTex: { value: reliefTex }, uClayLiteOn: { value: 0 },
    uClayLiteScale: { value: 0.62 }, uClayLiteBump: { value: 0.42 },
    uClayLiteColor: { value: 0.22 }, uClayLiteRough: { value: 0.55 },
    // WorldDesign Lab Derek RGB core: one shared tile; palette comes from source colour.
    uDerekTex: { value: reliefTex }, uDerekOn: { value: 0 },
    uDerekScale: { value: 0.32 }, uDerekBlend: { value: 6.0 },
    uDerekSpread: { value: 0.32 }, uDerekHue: { value: 0.14 }, uDerekRoughBias: { value: 0.10 }
  };
}

const VERT_DECL = /* glsl */`
attribute vec3 claySeed;
varying vec3 vClayP;
varying vec3 vClayN;
varying vec3 vClaySeed;
`;
const FRAG_DECL = /* glsl */`
uniform mat4 modelMatrix;
uniform sampler2D uClayRelief;
uniform float uClayOn, uClayTile, uClayStroke, uClayGrain, uClayMacro, uClayK;
uniform vec3 uClayPal[8];
uniform int uClayPalN;
uniform float uClayPalMix;
uniform sampler2D uClayPrint;
uniform float uClayPrintOn, uClayPrintTile, uClayPrintK, uClayOil, uClayFacet, uClayFacetSize, uClayCrease;
uniform float uClayProcStri, uClayProcSmear, uClayProcLine, uClayProcK;
uniform float uClayGouge, uClayCrack, uClayDent, uClayMottle, uClayLodK, uClayHandMix, uClayDebug, uClayObj, uClayHand;
uniform vec4 uClayMk, uClayLy;   // Mk: Kerben, Risse, Druckstellen, Abdrücke · Ly: Handspuren, Korn, Facetten, Falten
uniform vec3 uClayMsz;           // Zellgröße Kerbe, Riss, Druckstelle (Welt)
uniform float uClayHexK, uClayHexRot, uClayHexFlow, uClayFacetSoft, uClayToolOn, uClayLegacyStroke, uClayZone;
uniform float uClayToolGain[6], uClayTK[6], uClayTS[6], uClayTC[6], uClayLeg;
uniform float uClayPerfRelief, uClayPerfMarks, uClayPerfPrint, uClayPerfFacet, uClayPerfMottle;
uniform sampler2D uClayLiteTex;
uniform float uClayLiteOn, uClayLiteScale, uClayLiteBump, uClayLiteColor, uClayLiteRough;
uniform sampler2D uDerekTex;
uniform float uDerekOn, uDerekScale, uDerekBlend, uDerekSpread, uDerekHue, uDerekRoughBias;
uniform sampler2D uClayToolA, uClayToolB, uClayToolC;

vec3 kfbDerekHue(vec3 c, float a){
  mat3 toY = mat3(0.299, 0.596, 0.211, 0.587, -0.274, -0.523, 0.114, -0.322, 0.312);
  mat3 toR = mat3(1.0, 1.0, 1.0, 0.956, -0.272, -1.106, 0.621, -0.647, 1.703);
  vec3 y = toY * c;
  float cs = cos(a), sn = sin(a);
  y.yz = vec2(y.y * cs - y.z * sn, y.y * sn + y.z * cs);
  return max(toR * y, 0.0);
}
varying vec3 vClayP;
varying vec3 vClayN;
varying vec3 vClaySeed;

vec3 clayH3(vec3 p){
  p = vec3(dot(p, vec3(127.1, 311.7, 74.7)), dot(p, vec3(269.5, 183.3, 246.1)), dot(p, vec3(113.5, 271.9, 124.6)));
  return fract(sin(p) * 43758.5453123);
}
/* Voronoi: nächste und zweitnächste Zelle, mit Lage der Kerne */
void clayVoro(vec3 x, out vec3 c1, out vec3 c2, out vec3 p1, out vec3 p2){
  vec3 b = floor(x); float d1 = 1e9, d2 = 1e9;
  c1 = c2 = b; p1 = p2 = b;
  for (int k = -1; k <= 1; k++) for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
    vec3 c = b + vec3(float(i), float(j), float(k));
    vec3 q = c + 0.15 + 0.7 * clayH3(c);
    vec3 r = q - x; float d = dot(r, r);
    if (d < d1) { d2 = d1; c2 = c1; p2 = p1; d1 = d; c1 = c; p1 = q; }
    else if (d < d2) { d2 = d; c2 = c; p2 = q; }
  }
}

float clayHash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float clayVN(vec2 p){
  vec2 i = floor(p), f = fract(p); vec2 u = f*f*(3.0-2.0*f);
  return mix(mix(clayHash(i), clayHash(i+vec2(1,0)), u.x), mix(clayHash(i+vec2(0,1)), clayHash(i+vec2(1,1)), u.x), u.y);
}
/* Sechseck-Kachelung: drei Lesungen, je Gitterpunkt eigene Drehung und Lage, Gradient zurückgedreht */
vec2 clayRot(vec2 v, float a){ float c = cos(a), s = sin(a); return vec2(c * v.x - s * v.y, s * v.x + c * v.y); }
void clayHexGrid(vec2 uv, out vec2 v1, out vec2 v2, out vec2 v3, out vec3 W){
  vec2 st = mat2(1.0, -0.57735027, 0.0, 1.15470054) * (uv * 2.2);
  vec2 bb = floor(st); vec3 f = vec3(fract(st), 0.0); f.z = 1.0 - f.x - f.y;
  if (f.z > 0.0) { W = vec3(f.z, f.y, f.x); v1 = bb; v2 = bb + vec2(0.0, 1.0); v3 = bb + vec2(1.0, 0.0); }
  else { W = vec3(-f.z, 1.0 - f.y, 1.0 - f.x); v1 = bb + vec2(1.0); v2 = bb + vec2(1.0, 0.0); v3 = bb + vec2(0.0, 1.0); }
  W = pow(W, vec3(uClayHexK)); W /= (W.x + W.y + W.z);
}
float clayHexAng(vec2 v, float salt){ vec3 r = clayH3(vec3(v, salt)); return 6.2832 * (uClayHexFlow * clayVN(v * 0.21 + salt) + (r.x - 0.5) * uClayHexRot); }
vec4 clayHexOneT(sampler2D tx, vec2 uv, vec2 v, vec2 dx, vec2 dy, float salt){
  vec3 r = clayH3(vec3(v, salt)); float a = clayHexAng(v, salt);
  vec4 t = (textureGrad(tx, clayRot(uv, a) + r.yz, clayRot(dx, a), clayRot(dy, a)) * 255.0 - 128.0) / 127.0;
  t.xy = clayRot(t.xy, -a); t.zw = clayRot(t.zw, -a); return t;
}
vec4 clayTapTG(sampler2D tx, vec2 uv, vec2 dx, vec2 dy, float salt){
  vec2 v1, v2, v3; vec3 W; clayHexGrid(uv, v1, v2, v3, W);
  vec4 s = clayHexOneT(tx, uv, v1, dx, dy, salt) * W.x + clayHexOneT(tx, uv, v2, dx, dy, salt) * W.y + clayHexOneT(tx, uv, v3, dx, dy, salt) * W.z;
  return s * min(1.5, inversesqrt(dot(W, W)));
}
vec4 clayTap(vec2 uv){ return clayTapTG(uClayRelief, uv, dFdx(uv), dFdy(uv), 3.7); }
vec2 clayToolTap(int ti, vec2 uv, vec2 dx, vec2 dy){
  vec4 t; float salt = 5.3 + float(ti) * 1.7;
  if (ti < 2) t = clayTapTG(uClayToolA, uv, dx, dy, salt); else if (ti < 4) t = clayTapTG(uClayToolB, uv, dx, dy, salt); else t = clayTapTG(uClayToolC, uv, dx, dy, salt);
  return (ti == 0 || ti == 2 || ti == 4) ? t.xy : t.zw;
}
vec3 clayPrintOne(vec2 uv, vec2 v, vec2 dx, vec2 dy){
  vec3 r = clayH3(vec3(v, 9.1)); float a = clayHexAng(v, 9.1);
  vec4 t = textureGrad(uClayPrint, clayRot(uv, a) + r.yz, clayRot(dx, a), clayRot(dy, a));
  return vec3(clayRot((t.xy * 255.0 - 128.0) / 127.0, -a), t.z);
}
vec3 clayPrintTap(vec2 uv){
  vec2 dx = dFdx(uv), dy = dFdy(uv), v1, v2, v3; vec3 W; clayHexGrid(uv * 0.8, v1, v2, v3, W);
  vec3 s = clayPrintOne(uv, v1, dx, dy) * W.x + clayPrintOne(uv, v2, dx, dy) * W.y + clayPrintOne(uv, v3, dx, dy) * W.z;
  return vec3(s.xy * min(1.5, inversesqrt(dot(W, W))), s.z);
}
/* Kerben: kurze Rinne entlang der Fläche mit Lippe, 8 Nachbarzellen; x in Zellen, pxc = Pixel in Zellen */
vec3 clayGouge(vec3 x, vec3 n0, float dens, float pxc, out float cav){
  vec3 b = floor(x - 0.5), g = vec3(0.0); cav = 0.0;
  for (int k = 0; k < 2; k++) for (int j = 0; j < 2; j++) for (int i = 0; i < 2; i++) {
    vec3 c = b + vec3(float(i), float(j), float(k));
    vec3 r = clayH3(c + 23.0); if (r.x > dens) continue;
    vec3 o = c + 0.3 + 0.4 * clayH3(c + 41.0);
    vec3 t = clayH3(c + 59.0) * 2.0 - 1.0; t -= n0 * dot(t, n0); float tl = length(t); if (tl < 0.1) continue; t /= tl;
    float L = 0.16 + 0.16 * r.y, wd = 0.03 + 0.025 * r.z;
    vec3 q = x - o; float al = dot(q, t), sl = clamp(al, -L, L);
    vec3 dv = q - t * sl; dv -= n0 * dot(dv, n0); float d = length(dv) + 1e-5;
    float e = al / L, taper = clamp(1.0 - e * e, 0.0, 1.0) * smoothstep(-1.0, -0.55, e);   // Holz setzt an, schiebt, hebt ab
    float aa = clamp(wd / max(pxc * 1.5, 1e-5) - 0.5, 0.0, 1.0);
    float z = d / wd, G1 = exp(-z * z), z2 = (d - 1.8 * wd) / (0.9 * wd), G2 = exp(-z2 * z2);
    float dH = 0.022 * (2.0 * z / wd * G1 - 0.35 * 2.0 * z2 / (0.9 * wd) * G2);
    g += (dv / d) * dH * taper * aa;
    cav = max(cav, G1 * taper * aa);
  }
  return g;
}
/* Druckstellen: ovale Mulde mit Rand */
vec3 clayDentF(vec3 x, vec3 n0, float dens, out float inside){
  vec3 b = floor(x - 0.5), g = vec3(0.0); inside = 0.0;
  for (int k = 0; k < 2; k++) for (int j = 0; j < 2; j++) for (int i = 0; i < 2; i++) {
    vec3 c = b + vec3(float(i), float(j), float(k));
    vec3 r = clayH3(c + 71.0); if (r.x > dens) continue;
    vec3 o = c + 0.3 + 0.4 * clayH3(c + 83.0);
    vec3 a = clayH3(c + 97.0) * 2.0 - 1.0; a -= n0 * dot(a, n0); float al = length(a); if (al < 0.1) continue; a /= al;
    float R = 0.12 + 0.24 * r.y * r.y, Ra = R * (1.15 + 0.4 * r.z);
    vec3 q = x - o; q -= n0 * dot(q, n0);
    float qa = dot(q, a); vec3 qv = q - a * qa;
    float r2 = qa * qa / (Ra * Ra) + dot(qv, qv) / (R * R); if (r2 > 1.7) continue;
    vec3 gr2 = 2.0 * qa / (Ra * Ra) * a + 2.0 * qv / (R * R);
    float D = 0.05 * (0.6 + 0.8 * r.z), dH = r2 < 1.0 ? 2.0 * D * (1.0 - r2) : 0.0;
    float rr = sqrt(r2) + 1e-5, zr = (rr - 1.05) / 0.12, H2 = 0.22 * D * exp(-zr * zr);
    dH += H2 * (-2.0 * zr / 0.12) / (2.0 * rr);
    g += gr2 * dH; if (r2 < 1.0) inside = max(inside, 1.0 - r2);
  }
  return g;
}
/* Haarrisse: Grenzen eines verrauschten Voronoi, nur ein Teil; gibt Strich (0..1) zurück */
float clayCrackF(vec3 x, float pxc, out vec3 gc){
  gc = vec3(0.0);
  x += 0.18 * vec3(clayVN(x.xy * 3.1), clayVN(x.yz * 3.1 + 2.0), clayVN(x.zx * 3.1 + 5.0));
  vec3 c1, c2, p1, p2; clayVoro(x, c1, c2, p1, p2);
  vec3 dir = normalize(p2 - p1); float e = dot(x - 0.5 * (p1 + p2), dir);
  float pick = step(0.72, clayH3(c1 + c2 + 11.0).x) * smoothstep(0.45, 0.6, clayVN(x.xy * 2.3 + x.z * 1.7 + 8.0));   // wenige Grenzen, und die reißen ab
  const float wv = 0.022; float aa = clamp(wv / max(pxc * 1.2, 1e-5) - 0.4, 0.0, 1.0);
  float inl = step(abs(e), wv) * pick * aa;
  gc = dir * sign(e) * (0.01 / wv) * inl;
  return max(0.0, 1.0 - abs(e) / wv) * pick * aa;
}
vec3 clayOk(vec3 c){
  float l = 0.4122214708*c.r + 0.5363325363*c.g + 0.0514459929*c.b;
  float m = 0.2119034982*c.r + 0.6806995451*c.g + 0.1073969566*c.b;
  float s = 0.0883024619*c.r + 0.2817188376*c.g + 0.6299787005*c.b;
  l = pow(max(l,0.0), 1.0/3.0); m = pow(max(m,0.0), 1.0/3.0); s = pow(max(s,0.0), 1.0/3.0);
  return vec3(0.2104542553*l + 0.7936177850*m - 0.0040720468*s,
              1.9779984951*l - 2.4285922050*m + 0.4505937099*s,
              0.0259040371*l + 0.7827717662*m - 0.8086757660*s);
}
float clayFbm(vec2 p){ float a = 0.5, s = 0.0; for (int i = 0; i < 3; i++) { s += a * clayVN(p); p = p * 2.03 + 17.1; a *= 0.5; } return s / 0.875; }
/* Fingerzüge: dünn besetzte Streifenbündel. Jede Zelle eines gejitterten Gitters trägt (oder nicht)
   einen Zug mit eigener Richtung, Länge und Rillenphase; Gewicht anisotrop (lang entlang des Zugs).
   Ersetzt in v3b die Höhenlinien cos(φ·K): die schlossen sich zu Ringen und lasen als Holzmaserung. */
float clayDrags(vec2 u){
  const float S = 0.5;
  vec2 b = floor(u / S); float h = 0.0;
  for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
    vec2 c = b + vec2(float(i), float(j));
    vec3 r = clayH3(vec3(c, 7.0));
    if (r.z < 0.42) continue;                                   // nicht jede Zelle wurde berührt
    vec2 o = (c + 0.2 + 0.6 * r.xy) * S;
    float a = r.x * 6.2832 + 0.9 * r.y;
    vec2 t = vec2(cos(a), sin(a)), n = vec2(-t.y, t.x);
    vec2 d = u - o;
    float along = dot(d, t), across = dot(d, n);
    float len = S * (0.3 + 0.5 * r.y), wid = S * (0.06 + 0.09 * r.x);
    across += 1.6 * along * along / S * (r.x - 0.5);           // leicht gebogen, Drehung aus dem Handgelenk
    float wgt = exp(-(along * along) / (len * len) - (across * across) / (wid * wid));
    float groove = 0.5 + 0.5 * cos(across * uClayProcK * (0.8 + 0.5 * r.x) + r.y * 40.0);
    float sw = wgt * wgt;                                          // härterer Rand: der Finger setzt auf und hebt ab
    h += sw * (groove * groove - 0.35) + 0.25 * sw * sw;
  }
  return h;
}
/* Höhe in Metern auf einer Projektionsebene, u in Metern */
float clayProcH(vec2 u, float fade){
  vec2 w = u + 0.55 * vec2(clayFbm(u * 0.45 + 1.7), clayFbm(u * 0.45 + 8.3));
  float smear = clayFbm(w * 1.1);
  float stri = clayDrags(u + 0.08 * vec2(clayVN(u * 3.0), clayVN(u * 3.0 + 5.0)));
  float mS = 1.0, dash = 1.0;
  float iso = clayFbm(w * 0.8 + 31.0);
  float dl = (iso - 0.47) / 0.007;
  float lip = exp(-dl * dl) * smoothstep(0.52, 0.72, clayFbm(u * 0.9 + 41.0));
  float lipB = exp(-((dl + 2.2) * (dl + 2.2)) * 0.5);                               // flache Mulde neben dem Grat
  return uClayProcSmear * 0.04 * smear
       + uClayProcStri * 0.0036 * stri * mS * dash * fade
       + uClayProcLine * (0.0022 * lip - 0.0009 * lipB * lip);
}
vec3 clayProcGrad(vec2 u, float fade){
  const float e = 0.0025;
  float h0 = clayProcH(u, fade);
  return vec3((clayProcH(u + vec2(e, 0.0), fade) - h0) / e, (clayProcH(u + vec2(0.0, e), fade) - h0) / e, h0);
}
`;

const FRAG_PALETTE = /* glsl */`
#ifdef CLAY_PALMAP
if (uClayPalMix > 0.0) {
  vec3 lab = clayOk(diffuseColor.rgb);
  float chroma = length(lab.yz);
  bool neutral = chroma < 0.035 && (lab.x < 0.32 || lab.x > 0.93);
  if (!neutral) {
    float best = 1e9; vec3 bc = diffuseColor.rgb;
    for (int i = 0; i < 8; i++) {
      if (i >= uClayPalN) break;
      vec3 d = clayOk(uClayPal[i]) - lab; d.x *= 0.6;
      float e = dot(d, d);
      if (e < best) { best = e; bc = uClayPal[i]; }
    }
    diffuseColor.rgb = mix(diffuseColor.rgb, bc, uClayPalMix);
  }
}
#endif
`;

const FRAG_NORMAL = /* glsl */`
if (uClayOn > 0.5 && uClayK > 0.0) {
  float sc = length(modelMatrix[0].xyz);
  vec3 n0 = normalize(vClayN);
  vec3 P = vClayP * sc + vClaySeed * 37.0;   // Weltmaß, am Objekt, je Objekt versetzt
  if (uDerekOn > 0.5) {
    vec3 wd = pow(abs(n0), vec3(uDerekBlend)); wd /= max(wd.x + wd.y + wd.z, 1e-5);
    vec3 Pd = vClayP * sc;
    vec3 dx = texture2D(uDerekTex, Pd.zy * uDerekScale).rgb;
    vec3 dy = texture2D(uDerekTex, Pd.xz * uDerekScale).rgb;
    vec3 dz = texture2D(uDerekTex, Pd.xy * uDerekScale).rgb;
    vec3 mask = max(dx * wd.x + dy * wd.y + dz * wd.z, 0.0);
    mask /= max(mask.r + mask.g + mask.b, 1e-3);
    vec3 src = diffuseColor.rgb;
    vec3 c1 = src;
    vec3 c2 = kfbDerekHue(src * (1.0 - uDerekSpread * 0.7), uDerekHue * 1.6);
    vec3 c3 = min(kfbDerekHue(src * (1.0 + uDerekSpread)
      + uDerekSpread * 0.16 * (normalize(src + 0.02) * 0.6 + 0.4), -uDerekHue * 1.6), 1.0);
    diffuseColor.rgb = mask.r * c1 + mask.g * c2 + mask.b * c3;
    roughnessFactor = clamp(roughnessFactor + uDerekRoughBias, 0.04, 1.0);
  } else if (uClayLiteOn > 0.5) {
    vec3 wl = pow(abs(n0), vec3(4.0)); wl /= max(wl.x + wl.y + wl.z, 1e-5);
    vec4 lx = texture2D(uClayLiteTex, P.zy * uClayLiteScale);
    vec4 ly = texture2D(uClayLiteTex, P.xz * uClayLiteScale);
    vec4 lz = texture2D(uClayLiteTex, P.xy * uClayLiteScale);
    vec4 lt = lx * wl.x + ly * wl.y + lz * wl.z;
    vec2 gx = lx.rg * 2.0 - 1.0, gy = ly.rg * 2.0 - 1.0, gz = lz.rg * 2.0 - 1.0;
    vec3 gl = wl.x * vec3(0.0, gx.y, gx.x)
            + wl.y * vec3(gy.x, 0.0, gy.y)
            + wl.z * vec3(gz.x, gz.y, 0.0);
    gl -= n0 * dot(gl, n0);
    vec3 dNl = normalize(n0 - gl * uClayLiteBump) - n0;
    vec3 dVl = (viewMatrix * vec4(mat3(modelMatrix) * dNl / sc, 0.0)).xyz;
    normal = normalize(normal + dVl * faceDirection);
    roughnessFactor = clamp(mix(roughnessFactor, lt.b, uClayLiteRough), 0.25, 1.0);
    diffuseColor.rgb *= clamp(1.0 + ((lt.a - 0.5) * 2.0) * uClayLiteColor, 0.72, 1.28);
  } else {
  float hand = uClayObj > 0.0 ? mix(1.0, uClayObj / 1.2, uClayHandMix) : 1.0;
  float jit = 0.8 + 0.4 * fract(vClaySeed.x * 7.13 + vClaySeed.z);
  float vs = uClayS * hand * jit;                 // Maßstab je Material, gestreut je Objekt
  float vh = uClayHand * (0.9 + 0.2 * jit);       // Handmaß: Finger sind überall gleich groß
  float px = length(fwidth(P)) * 0.7 * uClayLodK;                                     // Welteinheiten je Pixel
  float lodNear = 1.0 - smoothstep(0.009, 0.028, px / vs), lodMid = 1.0 - smoothstep(0.075, 0.22, px / vs);
  vec3 p = P / (uClayTile * vh), pm = P / (uClayTile * vs);
  float cav = 0.0, crackL = 0.0, dentIn = 0.0, facetDbg = 0.0;
  vec3 w = pow(abs(n0), vec3(4.0)); w /= (w.x + w.y + w.z);
  vec3 g = vec3(0.0);
  vec4 t;
  // X-Ebene: u = z, v = y · Y-Ebene: u = x, v = z · Z-Ebene: u = x, v = y
  if (uClayPerfRelief > 0.5) {
#ifdef CLAY_PROC
  {
    vec2 ud = w.x > w.y && w.x > w.z ? P.zy : (w.y > w.z ? P.xz : P.xy);
    float fade = 1.0 - smoothstep(0.9, 2.6, length(fwidth(ud)) * uClayProcK * 0.35);
    vec3 q;
    if (w.x > 0.01) { q = clayProcGrad(P.zy, fade); g += w.x * vec3(0.0, q.y, q.x); }
    if (w.y > 0.01) { q = clayProcGrad(P.xz, fade); g += w.y * vec3(q.x, 0.0, q.y); }
    if (w.z > 0.01) { q = clayProcGrad(P.xy, fade); g += w.z * vec3(q.x, q.y, 0.0); }
  }
  { vec4 tg;
    if (w.x > 0.01) { tg = clayTap(p.zy * 2.0); g += w.x * vec3(0.0, tg.w, tg.z) * uClayGrain * 0.6; }
    if (w.y > 0.01) { tg = clayTap(p.xz * 2.0); g += w.y * vec3(tg.z, 0.0, tg.w) * uClayGrain * 0.6; }
    if (w.z > 0.01) { tg = clayTap(p.xy * 2.0); g += w.z * vec3(tg.z, tg.w, 0.0) * uClayGrain * 0.6; }
  }
#else
  float legK = uClayLeg >= 0.0 ? uClayLeg : uClayLegacyStroke, kM = uClayMacro * legK;
  float kS = uClayStroke * uClayLy.x * legK, kG = uClayGrain * uClayLy.y;
  if (w.x > 0.01) { t = clayTap(p.zy);        g += w.x * vec3(0.0, t.y, t.x) * kS + w.x * vec3(0.0, t.w, t.z) * kG;
                    t = clayTap(pm.zy * 0.143 + 0.5); g += w.x * vec3(0.0, t.y, t.x) * kM; }
  if (w.y > 0.01) { t = clayTap(p.xz);        g += w.y * vec3(t.x, 0.0, t.y) * kS + w.y * vec3(t.z, 0.0, t.w) * kG;
                    t = clayTap(pm.xz * 0.143 + 0.5); g += w.y * vec3(t.x, 0.0, t.y) * kM; }
  if (w.z > 0.01) { t = clayTap(p.xy);        g += w.z * vec3(t.x, t.y, 0.0) * kS + w.z * vec3(t.z, t.w, 0.0) * kG;
                    t = clayTap(pm.xy * 0.143 + 0.5); g += w.z * vec3(t.x, t.y, 0.0) * kM; }
#endif
  }
  // Werkzeuge einzeln, in Zonen (v9)
  float zoneDbg = 0.0; vec3 zoneCol = vec3(0.0);
  if (uClayToolOn > 0.5) {
    vec3 dPx = dFdx(P), dPy = dFdy(P);
    for (int ti = 0; ti < 6; ti++) {
      float kk = uClayTK[ti] * uClayToolGain[ti]; if (kk <= 0.0) continue;
      float cov = uClayTC[ti], sz = uClayTile * vh * uClayTS[ti];
      vec2 zq = vec2(P.x + 0.61 * P.y, P.z - 0.37 * P.y) / (uClayZone * max(0.5, uClayTS[ti])) + float(ti) * 7.31 + vClaySeed.xy * 13.0;
      float zm = cov >= 0.999 ? 1.0 : smoothstep(1.0 - cov - 0.09, 1.0 - cov + 0.09, clayFbm(zq));
      if (zm <= 0.001) continue;
      vec3 pt = P / sz, ax = dPx / sz, ay = dPy / sz; vec2 q;
      float kz = kk * zm;
      if (w.x > 0.01) { q = clayToolTap(ti, pt.zy, ax.zy, ay.zy); g += w.x * vec3(0.0, q.y, q.x) * kz; }
      if (w.y > 0.01) { q = clayToolTap(ti, pt.xz, ax.xz, ay.xz); g += w.y * vec3(q.x, 0.0, q.y) * kz; }
      if (w.z > 0.01) { q = clayToolTap(ti, pt.xy, ax.xy, ay.xy); g += w.z * vec3(q.x, q.y, 0.0) * kz; }
      if (zm > zoneDbg) { zoneDbg = zm; zoneCol = 0.5 + 0.5 * cos(6.2832 * (float(ti) / 6.0 + vec3(0.0, 0.33, 0.67))); }
    }
  }
  // Druckstellen (vor den Abdrücken: in der Mulde sind sie kräftiger)
  float oilD = 0.0;
  if (uClayPerfMarks > 0.5 && uClayDent > 0.0 && uClayMk.z > 0.0) { g += clayDentF(P / (uClayMsz.z * vs), n0, uClayMk.z, dentIn) * uClayDent * clamp(uClayHand * 1.2 / (uClayMsz.z * vs), 0.25, 1.0); oilD = dentIn; }
  // Kerben (mittel und nah)
  if (uClayPerfMarks > 0.5 && uClayGouge > 0.0 && uClayMk.x > 0.0 && lodMid > 0.0) { float S = uClayMsz.x * vs; g += clayGouge(P / S, n0, uClayMk.x, px / S, cav) * uClayGouge * lodMid * clamp(uClayHand * 0.8 / S, 0.3, 1.0); cav *= lodMid; }
  // Haarrisse (nur nah, nur in Flecken)
  if (uClayPerfMarks > 0.5 && uClayCrack > 0.0 && uClayMk.y > 0.0 && lodNear > 0.0) {
    float S = uClayMsz.y * vs;
    float crPatch = smoothstep(1.0 - uClayMk.y, 1.0 - uClayMk.y + 0.18, clayVN(P.xz / (S * 5.0) + P.y / (S * 7.0) + 3.3));
    if (crPatch > 0.0) { vec3 gc; crackL = clayCrackF(P / S, px / S, gc) * crPatch * lodNear; g += gc * crPatch * lodNear * uClayCrack; crackL *= uClayCrack; }
  }
  // Fingerabdrücke
  float oil = 0.0;
  if (uClayPerfPrint > 0.5 && uClayPrintOn > 0.5) {
    vec3 pp = P / (uClayPrintTile * vh); vec3 f;
#ifdef CLAY_PROC
    float uClayPrintK = uClayPrintK * 0.3 * smoothstep(0.55, 0.75, clayVN(P.xy * 0.9 + P.z * 0.7 + 13.0));   // große Flächen: nur vereinzelt
#endif
    float kP = uClayPrintK * uClayMk.w * (1.0 + 1.5 * dentIn);
    if (w.x > 0.01) { f = clayPrintTap(pp.zy); g += w.x * vec3(0.0, f.y, f.x) * kP; oil += w.x * f.z; }
    if (w.y > 0.01) { f = clayPrintTap(pp.xz); g += w.y * vec3(f.x, 0.0, f.y) * kP; oil += w.y * f.z; }
    if (w.z > 0.01) { f = clayPrintTap(pp.xy); g += w.z * vec3(f.x, f.y, 0.0) * kP; oil += w.z * f.z; }
  }
  // Druckfacetten + Falten (Gradient im Objektraum, direkt analytisch)
#ifndef CLAY_PROC
  if (uClayPerfFacet > 0.5 && (uClayFacet * uClayLy.z > 0.0 || uClayCrease * uClayLy.w > 0.0)) {
    vec3 x = P / (uClayFacetSize * vs);
    x += 0.35 * (clayH3(floor(x * 0.5) + 3.0) - 0.5) + 0.25 * vec3(clayVN(x.xy * 0.7), clayVN(x.yz * 0.7 + 4.0), clayVN(x.zx * 0.7 + 9.0));   // ungleich große Zellen
    vec3 c1, c2, p1, p2; clayVoro(x, c1, c2, p1, p2);
    vec3 tilt = clayH3(c1 + 17.0) * 2.0 - 1.0;
    float press = smoothstep(0.25, 0.75, clayH3(c1 + 5.0).x);        // nicht jede Zelle ist gedrückt
    vec3 dir = normalize(p2 - p1);
    float e = dot(x - 0.5 * (p1 + p2), dir);                          // < 0 in Zelle 1, 0 auf der Grenze
    float soft = uClayFacetSoft > 0.0 ? smoothstep(0.0, uClayFacetSoft, -e) : 1.0;   // v9: Kippung läuft zur Grenze aus
    g += tilt * uClayFacet * uClayLy.z * press * soft;
    facetDbg = press * soft;
    float pick = step(0.6, clayH3(c1 + c2).y) * smoothstep(0.3, 0.6, clayVN(x.xy * 1.3 + x.z));   // Falten reißen ab                       // nur ein Teil der Grenzen faltet
    float wv = 0.045, fw = fwidth(e);
    float aa = clamp(wv / max(fw * 3.0, 1e-5) - 0.6, 0.0, 1.0);       // fern: weg statt flimmern
    float G1 = exp(-(e * e) / (wv * wv)), eb = e + 1.7 * wv, G2 = exp(-(eb * eb) / (1.4 * wv * 1.4 * wv));
    float dh = (2.0 * e / (wv * wv)) * G1 - 0.55 * (2.0 * eb / (1.96 * wv * wv)) * G2;   // d/de von (−G1 + 0,55·G2)
    g += dir * dh * wv * uClayCrease * uClayLy.w * pick * aa * (0.6 + 0.4 * press);
  }
#endif
  g *= uClayK;
  g -= n0 * dot(g, n0);
  roughnessFactor = clamp(roughnessFactor * (1.0 - uClayOil * smoothstep(0.35, 0.8, oil) * uClayPrintOn) * (1.0 - 0.25 * cav) * (1.0 - 0.3 * oilD * uClayDent), 0.3, 1.0);
  if (uClayPerfMottle > 0.5 && abs(uClayMottle) > 0.00001) {
    float mo = clayFbm(P.xz * 0.37 / vs + P.y * 0.21 / vs + 5.0);
    diffuseColor.rgb *= (1.0 + uClayMottle * (mo - 0.5) * 2.0);
  }
  diffuseColor.rgb *= (1.0 - 0.12 * cav) * (1.0 - 0.45 * clamp(crackL, 0.0, 1.0));
  if (uClayDebug > 3.5) diffuseColor.rgb = mix(vec3(0.85), zoneCol, zoneDbg);
  else if (uClayDebug > 2.5) diffuseColor.rgb = mix(vec3(0.82, 0.82, 0.86), vec3(0.9, 0.25, 0.3), facetDbg);
  else if (uClayDebug > 1.5) { vec2 hv1, hv2, hv3; vec3 hW; vec2 huv = w.y > w.x && w.y > w.z ? p.xz : (w.x > w.z ? p.zy : p.xy); clayHexGrid(huv, hv1, hv2, hv3, hW);
    diffuseColor.rgb = clayH3(vec3(hv1, 1.0)) * hW.x + clayH3(vec3(hv2, 1.0)) * hW.y + clayH3(vec3(hv3, 1.0)) * hW.z; }
  else if (uClayDebug > 0.5) diffuseColor.rgb = mix(vec3(0.25, 0.4, 0.95), mix(vec3(1.0, 0.82, 0.15), vec3(0.95, 0.22, 0.2), lodNear), lodMid);
  vec3 dN = normalize(n0 - g) - n0;
  vec3 dV = (viewMatrix * vec4(mat3(modelMatrix) * dN / sc, 0.0)).xyz;
  normal = normalize(normal + dV * faceDirection);
  }
}
`;

/**
 * Baut ein Knet-Material. `src` darf ein vorhandenes (glTF-)Material sein; übernommen werden
 * Farbe, Farbkarte, Vertexfarben, Normal-Map. `role` wählt Rauheit und Relief:
 *   'world'   Rauheit 0,98, volles Relief  (Quelle: Claybound Terrain)
 *   'knetbar' Rauheit 0,55, Relief 0,5     (Quelle: Claybound PR #7)
 *   'soft'    Rauheit 0,9,  Relief 0,7     (Figuren, Wolken)
 */
export function makeClayMaterial(THREE, U, { src = null, color = null, role = null, palMap = false, reliefK = null, side = null, proc = null, scale = null, profile = null, objSize = 0 } = {}) {
  const PF = (typeof profile === 'string' ? PROFILES[profile] : profile) || PROFILES.default;
  role = role ?? PF.role; scale = scale ?? PF.scale;
  const useProc = proc ?? false;
  const R = { world: [0.98, 1.0, 0.12], knetbar: [0.55, 0.45, 0.3], soft: [0.9, 0.7, 0.18] }[role] || [0.95, 1, 0.12];
  const m = new THREE.MeshPhysicalMaterial({ roughness: R[0], metalness: 0 });
  m.sheen = R[2]; m.sheenRoughness = 0.85; m.sheenColor = new THREE.Color('#fff1e0');
  if (src) {
    if (src.color) m.color.copy(src.color);
    if (src.map) m.map = src.map;
    m.vertexColors = !!src.vertexColors;
    if (src.normalMap) {
      m.normalMap = src.normalMap;
      m.normalScale.copy(src.normalScale).multiplyScalar(0.45); // multiplizieren, nie setScalar
    }
    m.transparent = !!src.transparent; m.opacity = src.opacity ?? 1; m.alphaTest = src.alphaTest || 0;
    m.side = src.side;
    m.name = 'clay:' + (src.name || '');
  }
  if (color) m.color.set(color);
  if (side != null) m.side = side;
  const K = { value: reliefK ?? R[1] }, S = { value: scale };
  const Mk = { value: new THREE.Vector4() }, Ly = { value: new THREE.Vector4() }, Msz = { value: new THREE.Vector3() }, Obj = { value: objSize };
  const LG = { value: PF.legacy ?? -1 };
  const TK = { value: [0, 0, 0, 0, 0, 0] }, TS = { value: [1, 1, 1, 1, 1, 1] }, TC = { value: [1, 1, 1, 1, 1, 1] };
  const setT = tools => { TOOL_ORDER.forEach((n, i) => { const t = tools?.[n]; TK.value[i] = t ? (t.k ?? 1) : 0; TS.value[i] = t ? (t.s ?? 1) : 1; TC.value[i] = t ? (t.c ?? 1) : 1; }); };
  setT(PF.tools);
  const setP = pf => { Mk.value.set(pf.gouge, pf.crack, pf.dent, pf.print); Ly.value.set(pf.stroke, pf.grain, pf.facet, pf.crease); Msz.value.set(pf.gougeSize, pf.crackSize, pf.dentSize); };
  setP(PF);
  m.userData.clay = { role, K, S, palMap, profile: typeof profile === 'string' ? profile : 'default', Mk, Ly, Msz, Obj, setProfile: pf => { setP(typeof pf === 'string' ? PROFILES[pf] : pf); S.value = (typeof pf === 'string' ? PROFILES[pf] : pf).scale; }, setTools: setT, TK, TS, TC, LG };
  m.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, U, { uClayK: K, uClayS: S, uClayMk: Mk, uClayLy: Ly, uClayMsz: Msz, uClayObj: Obj, uClayTK: TK, uClayTS: TS, uClayTC: TC, uClayLeg: LG });
    sh.vertexShader = VERT_DECL + sh.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\n vClayP = position; vClayN = normal; vClaySeed = claySeed;');
    sh.fragmentShader = (palMap ? '#define CLAY_PALMAP\n' : '') + (useProc ? '#define CLAY_PROC\n' : '') + 'uniform float uClayS;\n' + FRAG_DECL + sh.fragmentShader
      .replace('#include <color_fragment>', '#include <color_fragment>\n' + FRAG_PALETTE)
      .replace('#include <normal_fragment_maps>', '#include <normal_fragment_maps>\n' + FRAG_NORMAL);
  };
  m.customProgramCacheKey = () => 'kfb-clay-v10' + (palMap ? '-pal' : '') + (useProc ? '-proc' : '');
  return m;
}

/** Palette in die gemeinsamen Uniforms legen; mix 0 = Originalfarben des Assets. */
export function setPalette(THREE, U, pal, mix) {
  const cols = PALETTE_ORDER.map(k => pal[k]).filter(Boolean);
  cols.forEach((c, i) => U.uClayPal.value[i].set(c));
  U.uClayPalN.value = cols.length;
  U.uClayPalMix.value = mix;
}

/** Jede Instanz bekommt ihre eigene Musterlage. Geteilte Geometrie wird dafür geklont. */
export function seedGeometry(THREE, geom, seed) {
  const g = geom;
  const n = g.attributes.position.count, a = new Float32Array(n * 3);
  const r = [Math.sin(seed * 12.9898) * 43758.5453, Math.sin(seed * 78.233) * 12345.678, Math.sin(seed * 39.425) * 24634.6345].map(v => v - Math.floor(v));
  for (let i = 0; i < n; i++) { a[i * 3] = r[0]; a[i * 3 + 1] = r[1]; a[i * 3 + 2] = r[2]; }
  g.setAttribute('claySeed', new THREE.BufferAttribute(a, 3));
  return g;
}

/** Fingerabdruck-Aufnahme → Gradientkarte (RG) + Maske (B). Hell = Abdruck = Delle. */
export async function makePrintTexture(THREE, url, size = 2048) {
  const img = await new Promise((res, rej) => { const i = new Image(); i.crossOrigin = 'anonymous'; i.onload = () => res(i); i.onerror = rej; i.src = url; });
  const cv = document.createElement('canvas'); cv.width = cv.height = size;
  const cx = cv.getContext('2d', { willReadFrequently: true }); cx.drawImage(img, 0, 0, size, size);
  const px = cx.getImageData(0, 0, size, size).data, N = size;
  const H = new Float32Array(N * N);
  for (let i = 0; i < N * N; i++) H[i] = -(px[i * 4] * 0.2126 + px[i * 4 + 1] * 0.7152 + px[i * 4 + 2] * 0.0722) / 255;
  const id = (x, y) => (((y % N) + N) % N) * N + (((x % N) + N) % N);
  const gx = new Float32Array(N * N), gy = new Float32Array(N * N), smp = [];
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    const i = y * N + x;
    gx[i] = (H[id(x + 1, y)] - H[id(x - 1, y)]) * 0.5; gy[i] = (H[id(x, y + 1)] - H[id(x, y - 1)]) * 0.5;
    if ((i & 127) === 0) smp.push(Math.max(Math.abs(gx[i]), Math.abs(gy[i])));
  }
  smp.sort((a, b) => a - b);
  const sc = 127 / (smp[Math.floor(smp.length * 0.99)] || 1);
  const out = new Uint8Array(N * N * 4);
  for (let i = 0; i < N * N; i++) {
    out[i * 4] = Math.max(0, Math.min(255, Math.round(128 + gx[i] * sc)));
    out[i * 4 + 1] = Math.max(0, Math.min(255, Math.round(128 + gy[i] * sc)));
    out[i * 4 + 2] = Math.round(-H[i] * 255); out[i * 4 + 3] = 255;
  }
  const t = new THREE.DataTexture(out, N, N, THREE.RGBAFormat);
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.minFilter = THREE.LinearMipmapLinearFilter; t.magFilter = THREE.LinearFilter;
  t.generateMipmaps = true; t.needsUpdate = true;
  return t;
}
