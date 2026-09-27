/* clay-material v4 — v4: Maßstab je Material (scale) + Streuung je Objekt über claySeed. Sonst wie v3. */
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
    uClayProcK: { value: 300.0 }
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
/* zwei Lesungen, zweite gedreht (37°), skaliert und versetzt; Gradient zurückgedreht */
vec4 clayTap(vec2 uv){
  vec4 a = (texture2D(uClayRelief, uv) * 255.0 - 128.0) / 127.0;
  const float c = 0.7986, s = 0.6018;
  vec2 ub = mat2(c, s, -s, c) * uv * 1.27 + vec2(0.371, 0.719);
  vec4 b = (texture2D(uClayRelief, ub) * 255.0 - 128.0) / 127.0;
  mat2 back = mat2(c, -s, s, c);
  b.xy = back * b.xy; b.zw = back * b.zw;
  float m = smoothstep(0.40, 0.60, clayVN(uv * 1.9 + 7.3));
  return mix(a, b, m);
}
vec3 clayPrintTap(vec2 uv){
  vec4 a = texture2D(uClayPrint, uv);
  const float c = 0.4226, s = 0.9063;
  vec2 ub = mat2(c, s, -s, c) * uv * 0.83 + vec2(0.53, 0.21);
  vec4 b = texture2D(uClayPrint, ub);
  vec2 ga = (a.xy * 255.0 - 128.0) / 127.0, gb = mat2(c, -s, s, c) * ((b.xy * 255.0 - 128.0) / 127.0);
  float m = smoothstep(0.42, 0.58, clayVN(uv * 2.3 + 3.1));
  return vec3(mix(ga, gb, m), mix(a.z, b.z, m));
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
  float vs = uClayS * (0.8 + 0.4 * fract(vClaySeed.x * 7.13 + vClaySeed.z));   // Maßstab je Material, gestreut je Objekt
  vec3 p = P / (uClayTile * vs);
  vec3 w = pow(abs(n0), vec3(4.0)); w /= (w.x + w.y + w.z);
  vec3 g = vec3(0.0);
  vec4 t;
  // X-Ebene: u = z, v = y · Y-Ebene: u = x, v = z · Z-Ebene: u = x, v = y
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
  if (w.x > 0.01) { t = clayTap(p.zy);        g += w.x * vec3(0.0, t.y, t.x) * uClayStroke + w.x * vec3(0.0, t.w, t.z) * uClayGrain;
                    t = clayTap(p.zy * 0.143 + 0.5); g += w.x * vec3(0.0, t.y, t.x) * uClayMacro; }
  if (w.y > 0.01) { t = clayTap(p.xz);        g += w.y * vec3(t.x, 0.0, t.y) * uClayStroke + w.y * vec3(t.z, 0.0, t.w) * uClayGrain;
                    t = clayTap(p.xz * 0.143 + 0.5); g += w.y * vec3(t.x, 0.0, t.y) * uClayMacro; }
  if (w.z > 0.01) { t = clayTap(p.xy);        g += w.z * vec3(t.x, t.y, 0.0) * uClayStroke + w.z * vec3(t.z, t.w, 0.0) * uClayGrain;
                    t = clayTap(p.xy * 0.143 + 0.5); g += w.z * vec3(t.x, t.y, 0.0) * uClayMacro; }
#endif
  // Fingerabdrücke
  float oil = 0.0;
  if (uClayPrintOn > 0.5) {
    vec3 pp = P / (uClayPrintTile * vs); vec3 f;
#ifdef CLAY_PROC
    float uClayPrintK = uClayPrintK * 0.3 * smoothstep(0.55, 0.75, clayVN(P.xy * 0.9 + P.z * 0.7 + 13.0));   // große Flächen: nur vereinzelt
#endif
    if (w.x > 0.01) { f = clayPrintTap(pp.zy); g += w.x * vec3(0.0, f.y, f.x) * uClayPrintK; oil += w.x * f.z; }
    if (w.y > 0.01) { f = clayPrintTap(pp.xz); g += w.y * vec3(f.x, 0.0, f.y) * uClayPrintK; oil += w.y * f.z; }
    if (w.z > 0.01) { f = clayPrintTap(pp.xy); g += w.z * vec3(f.x, f.y, 0.0) * uClayPrintK; oil += w.z * f.z; }
  }
  // Druckfacetten + Falten (Gradient im Objektraum, direkt analytisch)
#ifndef CLAY_PROC
  if (uClayFacet > 0.0 || uClayCrease > 0.0) {
    vec3 x = P / (uClayFacetSize * vs);
    x += 0.35 * (clayH3(floor(x * 0.5) + 3.0) - 0.5) + 0.25 * vec3(clayVN(x.xy * 0.7), clayVN(x.yz * 0.7 + 4.0), clayVN(x.zx * 0.7 + 9.0));   // ungleich große Zellen
    vec3 c1, c2, p1, p2; clayVoro(x, c1, c2, p1, p2);
    vec3 tilt = clayH3(c1 + 17.0) * 2.0 - 1.0;
    float press = smoothstep(0.25, 0.75, clayH3(c1 + 5.0).x);        // nicht jede Zelle ist gedrückt
    g += tilt * uClayFacet * press;
    vec3 dir = normalize(p2 - p1);
    float e = dot(x - 0.5 * (p1 + p2), dir);                          // < 0 in Zelle 1, 0 auf der Grenze
    float pick = step(0.6, clayH3(c1 + c2).y) * smoothstep(0.3, 0.6, clayVN(x.xy * 1.3 + x.z));   // Falten reißen ab                       // nur ein Teil der Grenzen faltet
    float wv = 0.045, fw = fwidth(e);
    float aa = clamp(wv / max(fw * 3.0, 1e-5) - 0.6, 0.0, 1.0);       // fern: weg statt flimmern
    float G1 = exp(-(e * e) / (wv * wv)), eb = e + 1.7 * wv, G2 = exp(-(eb * eb) / (1.4 * wv * 1.4 * wv));
    float dh = (2.0 * e / (wv * wv)) * G1 - 0.55 * (2.0 * eb / (1.96 * wv * wv)) * G2;   // d/de von (−G1 + 0,55·G2)
    g += dir * dh * wv * uClayCrease * pick * aa * (0.6 + 0.4 * press);
  }
#endif
  g *= uClayK;
  g -= n0 * dot(g, n0);
  roughnessFactor = clamp(roughnessFactor * (1.0 - uClayOil * smoothstep(0.35, 0.8, oil) * uClayPrintOn), 0.3, 1.0);
  vec3 dN = normalize(n0 - g) - n0;
  vec3 dV = (viewMatrix * vec4(mat3(modelMatrix) * dN / sc, 0.0)).xyz;
  normal = normalize(normal + dV * faceDirection);
}
`;

/**
 * Baut ein Knet-Material. `src` darf ein vorhandenes (glTF-)Material sein; übernommen werden
 * Farbe, Farbkarte, Vertexfarben, Normal-Map. `role` wählt Rauheit und Relief:
 *   'world'   Rauheit 0,98, volles Relief  (Quelle: Claybound Terrain)
 *   'knetbar' Rauheit 0,55, Relief 0,5     (Quelle: Claybound PR #7)
 *   'soft'    Rauheit 0,9,  Relief 0,7     (Figuren, Wolken)
 */
export function makeClayMaterial(THREE, U, { src = null, color = null, role = 'world', palMap = false, reliefK = null, side = null, proc = null, scale = 1 } = {}) {
  const useProc = proc ?? !src;
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
  m.userData.clay = { role, K, S, palMap };
  m.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, U, { uClayK: K, uClayS: S });
    sh.vertexShader = VERT_DECL + sh.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\n vClayP = position; vClayN = normal; vClaySeed = claySeed;');
    sh.fragmentShader = (palMap ? '#define CLAY_PALMAP\n' : '') + (useProc ? '#define CLAY_PROC\n' : '') + 'uniform float uClayS;\n' + FRAG_DECL + sh.fragmentShader
      .replace('#include <color_fragment>', '#include <color_fragment>\n' + FRAG_PALETTE)
      .replace('#include <normal_fragment_maps>', '#include <normal_fragment_maps>\n' + FRAG_NORMAL);
  };
  m.customProgramCacheKey = () => 'kfb-clay-v4' + (palMap ? '-pal' : '') + (useProc ? '-proc' : '');
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
