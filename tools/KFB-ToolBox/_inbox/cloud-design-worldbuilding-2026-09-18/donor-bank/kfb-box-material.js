// ============================================================================
// kfb-box-material.js — Material-System für die KFB-Voxel-Box-Sprache
// ----------------------------------------------------------------------------
// ENTSCHEIDUNG (2026-07-25, nach Review): der Look kommt aus MATERIALIEN im Shader,
// nicht aus kleinteiligen Foto-Texturen. Aus dem Textur-Ordner bleibt genau eines
// übrig, weil es getestet ist: die edge-Kachel als KANTEN-FASSUNG (edge3 default).
// Alles andere — Karton, Ton, Filz, Stein, Papier — ist prozedural in Welt-Koordinaten:
// wiederholt nie, skaliert mit der Welt statt mit der Fläche, kostet keine Downloads.
//
// Ein Shader, sechs Materialien, eine Story-Palette. Die Kanten-Fassung liegt auf
// ALLEN Materialien → verschiedene Boxen bleiben sichtbar dieselbe Welt.
//
// Instanz-Attribute:  aKfb = vec4(uvScaleY, bright, sat, grain) · aMat = float(0..5)
// Vertrag: docs/TEXTUR_KONZEPT_voxel.md · WebGL / three 0.160.
// ============================================================================

import { loadIndex, getTexture, hash32 } from './asset-index.js';

export const MATERIALS = ['karton', 'ton', 'filz', 'stein', 'papier', 'glatt'];
export const matId = (name) => Math.max(0, MATERIALS.indexOf(name));

export function rnd(...parts) { return (hash32(parts.join(':')) % 100000) / 100000; }

/** Laedt nur noch die Kanten-Kacheln + Korn (+ Wasser/Ziegel auf Anfrage). */
export async function loadKfbTextures(THREE, which = ['edge', 'noise']) {
  await loadIndex();
  const L = new THREE.TextureLoader();
  L.crossOrigin = 'anonymous';
  const load = (url, srgb) => new Promise((res) => {
    L.load(url, (t) => {
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
      t.anisotropy = 8;
      res(t);
    }, undefined, () => res(null));
  });
  const out = {};
  if (which.includes('edge')) {
    const set = getTexture('edge');
    out.edge = await Promise.all(set.maps.map((m) => load(m.url, true)));
    out.edgeIds = set.maps.map((m) => m.id);
  }
  if (which.includes('noise')) out.noise = await load(getTexture('noise').url, false);
  if (which.includes('brick')) {
    const b = getTexture('brick');
    out.brick = { map: await load(b.urls.brick_diffuse, true) };
  }
  if (which.includes('water')) {
    const w = getTexture('water');
    const [map, nrm] = await Promise.all([load(w.urls.water, true), load(w.urls.waternormals, false)]);
    out.water = { map, normalMap: nrm };
  }
  return out;
}

const GLSL_LIB = [
  'float kfbHash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }',
  'float kfbNoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);',
  '  return mix(mix(kfbHash(i), kfbHash(i+vec2(1,0)), f.x), mix(kfbHash(i+vec2(0,1)), kfbHash(i+vec2(1,1)), f.x), f.y); }',
  'float kfbFbm(vec2 p){ return kfbNoise(p) * 0.6 + kfbNoise(p * 2.6 + 11.3) * 0.28 + kfbNoise(p * 5.9 + 31.7) * 0.12; }',
  // Prozedurale Basis-Materialien. Jedes gibt einen MULTIPLIKATOR zurueck (um 1.0),
  // nie eine Farbe — die Farbe kommt immer aus der Story-Palette.
  'vec3 kfbMaterial(float id, vec3 p, vec3 n) {',
  '  float m1 = kfbFbm(p.xz * 0.30 + p.y * 0.10);',
  '  float m2 = kfbFbm(p.xz * 1.45 + 5.0);',
  '  vec3 c = vec3(1.0);',
  '  if (id < 0.5) {',                       // KARTON — Wellfaser, warm, leicht wolkig
  '    float fib = kfbNoise(vec2(p.x * 0.5, p.z * 7.0 + p.y * 7.0));',
  '    c *= 0.93 + m1 * 0.15;',
  '    c *= 0.975 + fib * 0.05;',
  '  } else if (id < 1.5) {',                // TON — weiche Knet-Blasen, Daumendruck
  '    c *= 0.90 + smoothstep(0.15, 0.9, m1) * 0.21;',
  '    c *= 0.985 + m2 * 0.03;',
  '  } else if (id < 2.5) {',                // FILZ — feiner Flor, matt, entsaettigt
  '    c *= 0.94 + m2 * 0.10;',
  '    c *= 0.97 + m1 * 0.06;',
  '  } else if (id < 3.5) {',                // STEIN — grobe Flecken mit dunklen Fugen
  '    float seam = smoothstep(0.42, 0.52, kfbFbm(p.xz * 0.75 + p.y * 0.4));',
  '    c *= 0.88 + m1 * 0.2;',
  '    c *= mix(0.84, 1.0, seam);',
  '  } else if (id < 4.5) {',                // PAPIER — fast flach, lange Striche
  '    c *= 0.965 + kfbNoise(vec2(p.x * 0.22, p.z * 2.6)) * 0.07;',
  '  }',                                     // GLATT (5) — nichts, reine Palette
  '  c *= 1.0 + max(n.y, 0.0) * 0.045;',     // Oberseiten minimal heller = gebaut, nicht gerendert
  '  return c;',
  '}',
  // PROZEDURALE KANTEN-FASSUNG — das Prinzip von edge3, aber gerechnet statt gekachelt:
  // eine weiche Fuge am Zellenrand, deren Breite und Deckkraft aus einem WELT-Rauschen
  // kommt. Dadurch ist keine Fläche wie die andere und nichts wiederholt sich.
  'float kfbFrame(vec2 cellUv, vec3 wp, float width) {',
  '  if (width <= 0.001) return 0.0;',
  '  float w = width * (0.55 + 1.05 * kfbFbm(wp.xz * 0.55 + wp.y * 0.35));',   // organische Breite
  '  vec2 f = min(cellUv, vec2(1.0) - cellUv);',
  '  float d = min(f.x, f.y);',
  '  float band = 1.0 - smoothstep(w * 0.3, w, d);',
  '  band *= 0.45 + 0.85 * kfbFbm(wp.xz * 2.3 + wp.y * 1.7);',                 // organisches Ausfransen
  // ENTSCHEIDEND gegen das Raster: die Fassung erscheint FLECKENWEISE. Ganze Bereiche
  // haben gar keine Fuge, andere eine kräftige — sonst liest jede Zelle als Kachel.
  '  band *= smoothstep(0.28, 0.66, kfbFbm(wp.xz * 0.3 + wp.y * 0.12));',
  '  return clamp(band, 0.0, 1.0);',
  '}',
  // Streifige Seitenflaechen aus DEMSELBEN Rauschen — fuer hohe Strukturen ohne Fugenraster.
  'float kfbStripe(vec3 wp, vec3 n) {',
  '  float side = 1.0 - abs(n.y);',
  '  float warp = kfbFbm(wp.xz * 0.8 + wp.y * 0.15) * 2.4;',
  '  float s = sin(wp.y * 5.5 + warp * 3.1) * 0.5 + 0.5;',
  '  s = mix(s, kfbNoise(vec2(wp.x + wp.z, wp.y * 3.0)), 0.35);',
  '  return side * s;',
  '}',
  // STOCHASTISCHES SAMPLING (Inigo Quilez / Heitz-Deliot-Prinzip): pro virtueller Kachel
  // ein zufaelliger Versatz, 2x2 ueberblendet. Damit verschwindet die Wiederholung einer
  // echten Foto-Textur, ohne dass wir Muster von Hand bauen. amount 0 = klassisch gekachelt.
  'vec2 kfbHash2(vec2 p){ return fract(sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453); }',
  'vec3 kfbStoch(sampler2D tex, vec2 x, float amount) {',
  '  if (amount < 0.001) return texture2D(tex, x).rgb;',
  '  vec2 p = floor(x), f = fract(x);',
  '  vec2 w = f * f * (3.0 - 2.0 * f);',
  '  vec3 c = vec3(0.0); float sum = 0.0;',
  '  for (int j = 0; j < 2; j++) {',
  '    for (int i = 0; i < 2; i++) {',
  '      vec2 o = vec2(float(i), float(j));',
  '      float we = (i == 0 ? 1.0 - w.x : w.x) * (j == 0 ? 1.0 - w.y : w.y);',
  '      vec2 off = kfbHash2(p + o) * 6.0 * amount;',   // freier Versatz, nicht nur eine halbe Kachel
  '      c += we * texture2D(tex, x + off).rgb;',
  '      sum += we;',
  '    }',
  '  }',
  '  c /= max(sum, 1e-4);',
  '  return mix(c, smoothstep(vec3(0.02), vec3(0.98), c), 0.4 * amount);',   // Kontrast zurueckholen
  '}',
  'vec3 kfbStochTri(sampler2D t, vec3 p, vec3 n, float s, float amount) {',
  '  vec3 w = abs(n); w = w / max(w.x + w.y + w.z, 1e-4);',
  '  return kfbStoch(t, p.zy * s, amount) * w.x + kfbStoch(t, p.xz * s, amount) * w.y + kfbStoch(t, p.xy * s, amount) * w.z;',
  '}',
  // Weiche Wert-Baender: kein harter Cartoon-Sprung, sondern gemalte Stufen.
  'float kfbBands(float l, float bands, float amount) {',
  '  float x = l * bands, f = fract(x);',
  '  float stepped = (floor(x) + smoothstep(0.28, 0.72, f)) / bands;',
  '  return mix(l, stepped, amount);',
  '}',
].join('\n');

/**
 * Ein Box-Material für die Voxel-Sprache.
 * opts: { edgeMap, grainMap, grain, edgeStrength, bands, bandAmount,
 *         photoMap, photoStrength, photoScale, roughness }
 */
export function makeVariedBoxMaterial(THREE, opts = {}) {
  const {
    edgeMap = null, map = null, grainMap = null, grain = 0.2, edgeStrength = 0.8,
    bands = 4, bandAmount = 0.45, photoMap = null, photoStrength = 0, photoScale = 0.25,
    roughness = 0.9, metalness = 0, flatShading = false,
  } = opts;
  const mat = new THREE.MeshStandardMaterial({ roughness, metalness, flatShading });
  const U = mat.userData.kfb = {
    uKfbEdge: { value: edgeMap || map }, uKfbGrainMap: { value: grainMap },
    uKfbEdgeStr: { value: (edgeMap || map) ? edgeStrength : 0 }, uKfbGrain: { value: grain },
    uKfbBands: { value: bands }, uKfbBandAmt: { value: bandAmount },
    uKfbPhoto: { value: photoMap }, uKfbPhotoStr: { value: photoMap ? photoStrength : 0 },
    uKfbPhotoScale: { value: photoScale },
    uKfbSeam: { value: opts.seam ?? 0.38 },       // prozedurale Fuge/Fassung: Tiefe
    uKfbSeamW: { value: opts.seamWidth ?? 0.09 }, // Breite (0 = keine Fuge)
    uKfbStripe: { value: opts.stripe ?? 0.22 },   // streifige Seitenflaechen
    uKfbHatch: { value: opts.hatch ?? 0 },        // Tusche-Schraffur auf steilen Flaechen
    uKfbWobble: { value: opts.wobble ?? 0 },      // Boiling-Lines: Vertex-Zittern
    uKfbTime: { value: 0 },
    uKfbStoch: { value: opts.stochastic ?? 0.85 },   // 0 = gekachelt, 1 = voll gebrochen
    uKfbSeamWhite: { value: opts.seamWhite ?? 0 },   // 0 = dunkle Fuge, 1 = weisse Kante
    // MOVING FLOOR (Vertrag wie terrain-v10/voxel-terrain.js): Saeulen heben und senken sich.
    // uKfbZone = (x, z, radius, ramp) daempft die Bewegung ueber einer Zone auf 0 — die Welle
    // "bricht" am Ufer, statt in die Card Zone hineinzulaufen.
    uKfbAmp: { value: opts.motionAmp ?? 0 },
    uKfbFlow: { value: opts.flow ?? 0 },             // 0 = Dancefloor (Phase aus Ort-Hash) · 1 = Flow (Welle)
    uKfbZone: { value: new THREE.Vector4(0, 0, 0, 1) },
    uKfbFluid: { value: opts.fluid ?? 0 },           // 0 aus · 1 fluessig · 2 gas · 3 fest
  };
  mat.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, U);
    shader.vertexShader = shader.vertexShader
      .replace('void main() {', [
        'uniform float uKfbWobble, uKfbTime, uKfbAmp, uKfbFlow;',
        'uniform vec4 uKfbZone;',
        'attribute vec4 aKfb;', 'attribute float aMat;', 'attribute vec3 aStack;',
        'varying vec4 vKfb;', 'varying float vMat;', 'varying vec3 vStack;',
        'varying vec2 vKfbUv;', 'varying vec3 vKfbW;', 'varying vec3 vKfbN;', 'varying vec3 vKfbId;',
        'void main() {',
      ].join('\n'))
      .replace('#include <begin_vertex>', [
        '#include <begin_vertex>',
        'vKfb = aKfb; vMat = aMat; vStack = aStack;',
        // GANZE Wiederholungen der Kanten-Kachel: nichts wird angeschnitten (keine Streifen).
        'vKfbUv = uv * vec2(1.0, max(floor(aKfb.x + 0.5), 1.0));',
        'vKfbW = (modelMatrix * instanceMatrix * vec4(transformed, 1.0)).xyz;',
        'vKfbN = normalize(mat3(instanceMatrix) * normal);',
        'vKfbId = floor((modelMatrix * instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz + 0.5);',
        // Dancefloor: Hub aus Zeit + Phase. Phase entweder pro Saeule (Zufall) oder aus dem Ort
        // (dann laeuft eine Welle durch). Ueber der Zone ist der Hub 0 — dazwischen rampt er auf.
        'if (uKfbAmp > 0.0001) {',
        '  vec3 io = (modelMatrix * instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz;',
        '  float rnd = fract(sin(dot(floor(io.xz + 0.5), vec2(12.9898, 78.233))) * 43758.5453);',
        '  float ph = mix(rnd * 6.2831, (io.x + io.z) * 0.16, uKfbFlow);',
        '  float m = sin(uKfbTime * 1.5 + ph) * 0.5 + 0.5;',
        '  m = smoothstep(0.08, 0.92, m) - 0.5;',
        '  float d = length(io.xz - uKfbZone.xy);',
        '  float damp = smoothstep(uKfbZone.z, uKfbZone.z + max(uKfbZone.w, 0.001), d);',
        '  transformed.y += m * uKfbAmp * damp;',
        '  vKfbW = (modelMatrix * instanceMatrix * vec4(transformed, 1.0)).xyz;',
        '}',
        // Boiling Lines: die Ecken zittern in 8-fps-Stufen — handgezeichnet statt CAD.
        'if (uKfbWobble > 0.0001) {',
        '  float st = floor(uKfbTime * 8.0);',
        '  vec3 w = vec3(sin(dot(vKfbW.xyz, vec3(12.9, 78.2, 37.7)) + st * 1.7),',
        '                sin(dot(vKfbW.xyz, vec3(39.3, 11.1, 83.1)) + st * 2.3),',
        '                sin(dot(vKfbW.xyz, vec3(73.1, 52.7, 19.4)) + st * 3.1));',
        '  transformed += w * uKfbWobble;',
        '  vKfbW = (modelMatrix * instanceMatrix * vec4(transformed, 1.0)).xyz;',
        '}',
      ].join('\n'))
      .replace('#include <project_vertex>', '#include <project_vertex>');
    shader.fragmentShader = shader.fragmentShader
      .replace('void main() {', [
        'uniform sampler2D uKfbEdge, uKfbGrainMap, uKfbPhoto;',
        'uniform float uKfbEdgeStr, uKfbGrain, uKfbBands, uKfbBandAmt, uKfbPhotoStr, uKfbPhotoScale;',
        'uniform float uKfbSeam, uKfbSeamW, uKfbStripe, uKfbHatch, uKfbStoch, uKfbSeamWhite;',
        'uniform float uKfbFluid, uKfbTime;',
        'varying vec4 vKfb;', 'varying float vMat;', 'varying vec3 vStack;',
        'varying vec2 vKfbUv;', 'varying vec3 vKfbW;', 'varying vec3 vKfbN;', 'varying vec3 vKfbId;',
        GLSL_LIB,
        'vec3 kfbTri(sampler2D t, vec3 p, vec3 n, float s) {',
        '  vec3 w = abs(n); w = w / max(w.x + w.y + w.z, 1e-4);',
        '  return texture2D(t, p.zy * s).rgb * w.x + texture2D(t, p.xz * s).rgb * w.y + texture2D(t, p.xy * s).rgb * w.z;',
        '}',
        'void main() {',
      ].join('\n'))
      .replace('#include <color_fragment>', [
        '#include <color_fragment>',
        '{',
        '  diffuseColor.rgb *= kfbMaterial(vMat, vKfbW, vKfbN);',    // Basis-Material
        '  {',                                                       // prozedurale Fassung + Streifen
        // SAEULEN-KOPPLUNG (aStack = vec3(stackId, cellIndex, stackHeight)): mehrere einzelne
        // Wuerfel uebereinander teilen sich EINE Fassung ueber die volle Hoehe, statt jede Zelle
        // einzeln zu rahmen. Dadurch liest ein 1-3-Stapel als Saeule statt als Stapel.
        '    float kSh = max(vStack.z, 1.0);',
        '    bool kSide = abs(vKfbN.y) < 0.5 && kSh > 1.5;',
        '    vec2 cellUv = fract(vKfbUv);',
        '    if (kSide) cellUv.y = (vStack.y + cellUv.y) / kSh;',
        '    float fr = kfbFrame(cellUv, vKfbW, uKfbSeamW);',
        '    fr *= mix(1.0, 0.55, max(vKfbN.y, 0.0));',
        // Klare Kante: gleichmaessige Breite, kein Rauschen — so liest sie als gebautes
        // Stilmittel (edge3-Prinzip) statt als Schmutz.
        '    vec2 fe = min(cellUv, vec2(1.0) - cellUv);',
        '    float crisp = 1.0 - smoothstep(uKfbSeamW * 0.45, uKfbSeamW, min(fe.x, fe.y));',
        '    float seamMask = mix(fr, crisp, uKfbSeamWhite);',
        '    diffuseColor.rgb = mix(diffuseColor.rgb * (1.0 - seamMask * uKfbSeam),',
        '                           mix(diffuseColor.rgb, vec3(0.97, 0.96, 0.93), seamMask * uKfbSeam),',
        '                           uKfbSeamWhite);',
        '    if (uKfbHatch > 0.001) {',
        // Schraffur: schraege Tusche-Striche, dichter je steiler und je dunkler die Wand.
        '      float steep = 1.0 - abs(vKfbN.y);',
        '      float warp = kfbFbm(vKfbW.xz * 1.1 + vKfbW.y * 0.5) * 1.8;',
        '      float h = sin((vKfbW.y * 9.0 + (vKfbW.x + vKfbW.z) * 5.0) + warp * 4.0);',
        '      float lum = dot(diffuseColor.rgb, vec3(0.299, 0.587, 0.114));',
        '      float dens = smoothstep(0.62, 0.12, lum) * steep;',
        '      diffuseColor.rgb *= 1.0 - smoothstep(0.25, 0.95, h) * dens * uKfbHatch;',
        '    }',
        '    if (uKfbStripe > 0.001) {',
        '      diffuseColor.rgb *= 1.0 - (kfbStripe(vKfbW, vKfbN) - 0.5) * uKfbStripe;',
        '    }',
        '  }',
        '  if (uKfbEdgeStr > 0.001) {',                              // optionale PNG-Fassung (edge3)
        // edge3 als BEVEL-MASKE: dunkel auslaufende Raender runden die harte 90-Grad-Kante
        // optisch ab. Rotation in 90-Grad-Schritten pro Voxel (hash der Voxel-Id) — die
        // Vignette ist rotationsinvariant, deshalb bricht das die Wiederholung ohne Naht.
        '    float eSh = max(vStack.z, 1.0);',
        '    bool eSide = abs(vKfbN.y) < 0.5 && eSh > 1.5;',
        '    vec2 fu = fract(vKfbUv);',
        '    if (eSide) fu.y = (vStack.y + fu.y) / eSh;',
        // Seed pro INSTANZ + Flaechen-Achse: konstant ueber die ganze Flaeche, dreht mit dem Wuerfel mit.
        // Gekoppelte Saeulenseiten seeden aus der stackId, sonst bricht die Fassung an jeder Zellfuge.
        '    vec3 axis = step(vec3(0.5), abs(vKfbN));',
        '    vec3 seedv = eSide ? vec3(vStack.x, 0.0, vStack.x * 0.37) + axis * 7.3 : vKfbId + axis * 7.3;',
        '    float rr = fract(sin(dot(seedv, vec3(12.9898, 78.233, 37.719))) * 43758.5453);',
        '    if (eSide) rr = 0.9;',                                    // Seiten nie 90 Grad drehen: sonst laeuft die Saeule quer
        '    if (rr < 0.25) fu = vec2(fu.y, 1.0 - fu.x);',
        '    else if (rr < 0.5) fu = vec2(1.0 - fu.x, 1.0 - fu.y);',
        '    else if (rr < 0.75) fu = vec2(1.0 - fu.y, fu.x);',
        '    vec3 e = texture2D(uKfbEdge, fu).rgb;',
        '    e = mix(vec3(dot(e, vec3(0.299, 0.587, 0.114))), e, 0.5);',
        '    diffuseColor.rgb *= mix(vec3(1.0), e * 1.32, uKfbEdgeStr);',
        '  }',
        '  if (uKfbPhotoStr > 0.001) {',                             // optionaler Foto-Fleck-Layer
        '    vec3 ph = kfbStochTri(uKfbPhoto, vKfbW, vKfbN, uKfbPhotoScale, uKfbStoch);',
        '    float pl = dot(ph, vec3(0.299, 0.587, 0.114));',
        '    ph = mix(vec3(pl), ph, 0.55);',                                    // Materialfarbe raus, Struktur bleibt
        // Struktur normalisiert (damit die Palette die Farbe bestimmt), aber ein Rest
        // Eigenwert bleibt — sonst sehen Papier und Stein gleich hell aus.
        '    vec3 phN = ph / max(pl, 0.15) * 0.95;',
        '    vec3 phMix = mix(phN, ph * 1.45, 0.72);',
        // Lokalen Kontrast anheben — genau der macht Struktur UND ihre Wiederholung sichtbar.
        '    phMix = (phMix - vec3(0.85)) * 1.7 + vec3(0.85);',
        '    diffuseColor.rgb *= mix(vec3(1.0), phMix, uKfbPhotoStr);',
        '  }',
        '  diffuseColor.rgb *= vKfb.y;',
        // FLUID: Wasser/Oel/Saeure/Bubblegum ist FARBE, kein Level (Brief §3). Das Muster laeuft
        // im Material, damit der Graben lebt, ohne dass eine Wasserfläche eingezogen wird.
        '  if (uKfbFluid > 0.5) {',
        '    float w;',
        '    if (uKfbFluid < 1.5) w = kfbFbm(vKfbW.xz * 0.34 + vec2(uKfbTime * 0.22, -uKfbTime * 0.16));',
        '    else if (uKfbFluid < 2.5) w = kfbFbm(vKfbW.xz * 0.16 + vec2(-uKfbTime * 0.45, uKfbTime * 0.3));',
        '    else w = kfbFbm(vKfbW.xz * 0.85);',
        '    diffuseColor.rgb *= 0.84 + w * 0.42;',
        '    diffuseColor.rgb += vec3(0.07, 0.06, 0.04) * smoothstep(0.6, 0.95, w) * max(vKfbN.y, 0.0);',
        '  }',
        '  float lum0 = max(dot(diffuseColor.rgb, vec3(0.299, 0.587, 0.114)), 1e-4);',
        '  diffuseColor.rgb = mix(vec3(lum0), diffuseColor.rgb, vKfb.z);',
        '  if (uKfbGrain > 0.001) {',
        '    float g = texture2D(uKfbGrainMap, vKfbW.xz * 0.07).r;',
        '    diffuseColor.rgb *= 1.0 + (g - 0.5) * uKfbGrain * (0.5 + vKfb.w);',
        '  }',
        '  if (uKfbBandAmt > 0.001) {',
        '    float l = max(dot(diffuseColor.rgb, vec3(0.299, 0.587, 0.114)), 1e-4);',
        '    diffuseColor.rgb *= kfbBands(l, uKfbBands, uKfbBandAmt) / l;',
        '  }',
        '}',
      ].join('\n'));
  };
  return mat;
}

/** Boxgeometrie mit den Instanz-Attributen (Basis auf y=0). */
export function makeBoxGeometry(THREE, count, cell = 1) {
  const g = new THREE.BoxGeometry(cell, 1, cell);
  g.translate(0, 0.5, 0);
  g.setAttribute('aKfb', new THREE.InstancedBufferAttribute(new Float32Array(count * 4), 4));
  g.setAttribute('aMat', new THREE.InstancedBufferAttribute(new Float32Array(count), 1));
  // aStack = (stackId, cellIndex, stackHeight) — Default (0,0,1) = jede Zelle fuer sich.
  const st = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) st[i * 3 + 2] = 1;
  g.setAttribute('aStack', new THREE.InstancedBufferAttribute(st, 3));
  return g;
}

/** Variation einer Instanz — Werte, nie Orientierung. field = Orts-Rauschen (gekoppelt). */
export function writeVariation(geo, i, seed, opts = {}) {
  const { variation = 1, heightCells = 1, brightRange = 0.32, satRange = 0.2, field = null, mat = 0, stack = null } = opts;
  const a = geo.getAttribute('aKfb'), am = geo.getAttribute('aMat'), as = geo.getAttribute('aStack');
  if (as) {
    as.setXYZ(i, stack ? stack.id : 0, stack ? stack.index : 0, stack ? Math.max(1, stack.height) : 1);
    as.needsUpdate = true;
  }
  const rb = field != null ? field : rnd(seed, i, 'b');
  const rs = field != null ? 1 - field : rnd(seed, i, 's');
  const bright = 1 - variation * brightRange * 0.5 + variation * brightRange * rb;
  const sat = 1 - variation * satRange * 0.5 + variation * satRange * rs;
  a.setXYZW(i, Math.max(1, heightCells), bright, Math.max(0, sat), variation ? rnd(seed, i, 'g') : 0.5);
  am.setX(i, mat);
  a.needsUpdate = am.needsUpdate = true;
}

/** Story-Palette (3 Stops) → Instanz-Tint über die Höhen-Rampe. */
export function tintFor(THREE, stops, t, seed, i, opts = {}) {
  const { jitter = 0.04, variation = 1, strength = 1 } = opts;
  const a = t < 0.5 ? stops[0] : stops[1], b = t < 0.5 ? stops[1] : stops[2];
  const k = t < 0.5 ? t * 2 : (t - 0.5) * 2;
  const c = new THREE.Color(a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k);
  if (variation && jitter) c.offsetHSL((rnd(seed, i, 'hue') - 0.5) * jitter * variation, 0, 0);
  if (strength < 1) c.lerp(new THREE.Color(0.74, 0.7, 0.63), 1 - strength);
  return c;
}

export default { MATERIALS, matId, loadKfbTextures, makeVariedBoxMaterial, makeBoxGeometry, writeVariation, tintFor, rnd };
