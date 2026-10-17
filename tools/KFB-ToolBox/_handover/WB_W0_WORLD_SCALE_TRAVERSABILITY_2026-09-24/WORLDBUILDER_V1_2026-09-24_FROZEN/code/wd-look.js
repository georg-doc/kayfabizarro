/* KFB WorldDesign Lab v1 · Look-System (Oberfläche)
   Brief-Korrektur §3–§5. Ein Look ist ein Bündel Uniforms — mehrere Looks laufen deshalb
   GLEICHZEITIG auf demselben Asset in verschiedenen Vergleichsfeldern.

   Verfahren, in einem Shader-Einschub (`onBeforeCompile`) in die VORHANDENEN Materialien, ohne
   sie zu ersetzen — `SOURCE` bleibt dadurch verlustfrei:

   · triplanare Projektion in Weltkoordinaten, Mischschärfe regelbar (dieselbe gemeinsame
     Oberfläche über Figur, Möbel, Architektur, unabhängig von den UVs der Packs);
   · Makroquelle wahlweise BITMAP (generierte, konstruktiv periodische Kachel oder ein Satz aus
     `media/3D_Assets/Textures/`) oder PROZEDURAL (fbm in Weltkoordinaten, „Ton");
   · stochastische Doppelprobe gegen sichtbare Wiederholung;
   · Farbeinfluss getrennt von Wertmodulation: `colour = 0` erhält die Quellfarbe fast
     vollständig, hohe Werte gehen in Richtung der stärkeren RGB-Palette der Referenz;
   · Korn als NORMALEN-Störung (Zentraldifferenzen eines Weltraum-Rauschens) — es verändert die
     Lichtantwort, nicht nur die Farbe;
   · Rauheit aus Makro + Vorspannung + Streuung, aber mit GLANZERHALT: was in der Quelle glatt
     ist (Haar, Rüstung, Politur), darf glatt bleiben. Kein globaler Matt-Klemmer. */

import * as THREE from 'three';

const TEXROOT = 'https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/Textures/';

/* Repo-Textursätze als ALTERNATIVE Makroquelle (CC0-Web-Satz, Benennung laut dessen README). */
export const SETS = [
  ['TON', ['Clay001', 'Clay002', 'Clay004', 'clay_floor_001', 'GlazedTerracotta002']],
  ['PAPIER', ['Paper001', 'Paper002', 'Paper003', 'Paper005']],
  ['KARTON', ['Cardboard001', 'Cardboard004', 'CardboardSet001', 'Chipboard007']],
  ['FILZ / STOFF', ['Fabric030', 'Fabric048', 'Fabric069', 'Carpet016', 'rough_linen', 'hessian_230', 'velour_velvet']],
  ['STEIN', ['Rock064', 'rock_wall_16', 'marble_rock_02', 'PavingStones150', 'whitewashed_brick', 'dry_river_pebbles']],
  ['PUTZ / BETON', ['Plaster001', 'PaintedPlaster009', 'Concrete024', 'chipped_concrete']],
  ['BODEN', ['Ground026', 'Ground049A', 'Ground051', 'Ground087', 'forest_ground_05']],
  ['HOLZ', ['Wood036', 'Planks039', 'WoodFloor044', 'WoodSiding013']]
];

export const KEYS = ['macro', 'scale', 'contrast', 'blend', 'stoch', 'colour', 'tint', 'sat',
  'proc', 'grain', 'grainScale', 'bump', 'roughInfl', 'roughBias', 'roughVar', 'gloss', 'pal', 'palSpread', 'palHue',
  'cel', 'celBands', 'celSoft', 'wobble', 'morph', 'morphSpeed', 'celBreak', 'normTint', 'roughTint'];

export const PARAMS = [
  ['macro', 'Macro Strength', 0, 1, 0.01, 'makro'],
  ['scale', 'Macro Scale', 0.05, 4, 0.01, 'makro'],
  ['contrast', 'Macro Contrast', 0.2, 2.6, 0.01, 'makro'],
  ['blend', 'Triplanar Blend Sharpness', 1, 12, 0.1, 'makro'],
  ['stoch', 'Stochastic Amount', 0, 1, 0.01, 'makro'],
  ['colour', 'Colour Influence', 0, 1, 0.01, 'makro'],
  ['tint', 'Tint (Helligkeit)', 0.5, 1.5, 0.01, 'makro'],
  ['sat', 'Saturation', 0, 1.8, 0.01, 'makro'],
  ['proc', 'Procedural / Clay Mix', 0, 1, 0.01, 'korn'],
  ['grain', 'Grain Strength', 0, 1.6, 0.01, 'korn'],
  ['grainScale', 'Grain Scale', 1, 60, 0.5, 'korn'],
  ['bump', 'Normal / Bump Strength', 0, 1.5, 0.01, 'korn'],
  ['roughInfl', 'Roughness from Macro', 0, 1, 0.01, 'rauheit'],
  ['roughBias', 'Roughness Bias', -0.3, 0.45, 0.01, 'rauheit'],
  ['roughVar', 'Roughness Variation', 0, 0.6, 0.01, 'rauheit'],
  ['gloss', 'Source Gloss Preservation', 0, 1, 0.01, 'rauheit'],
  ['pal', 'RGB-Palette', 0, 1, 0.01, 'palette'],
  ['palSpread', 'Palette Spreizung (hell/dunkel)', 0, 1, 0.01, 'palette'],
  ['palHue', 'Palette Farbton-Drift', -1, 1, 0.01, 'palette'],
  ['cel', 'Cel-Shading', 0, 1, 0.01, 'stil'],
  ['celBands', 'Cel-Stufen', 2, 6, 1, 'stil'],
  ['celSoft', 'Cel-Weichheit', 0.01, 0.5, 0.01, 'stil'],
  ['wobble', 'Wobble (Boiling Surface)', 0, 0.03, 0.0005, 'stil'],
  ['morph', 'Morph der Farbflächen', 0, 1.5, 0.01, 'stil'],
  ['morphSpeed', 'Morph-Tempo', 0, 2, 0.01, 'stil'],
  ['celBreak', 'Schattenkante aus Textur', 0, 1, 0.01, 'stil'],
  ['normTint', 'Normalen-Farbe', 0, 1, 0.01, 'stil'],
  ['roughTint', 'Rauheits-Ton', 0, 1, 0.01, 'stil']
];

const BASE = {
  on: true, src: 'gen', set: 'Clay002',
  macro: 0.8, scale: 0.6, contrast: 1.25, blend: 4, stoch: 0.6, colour: 0.3, tint: 1, sat: 1,
  proc: 0, grain: 0.5, grainScale: 7, bump: 0.6, roughInfl: 0.6, roughBias: 0.05, roughVar: 0.15, gloss: 0.6,
  pal: 0, palSpread: 0.6, palHue: 0.22,
  cel: 0, celBands: 3, celSoft: 0.12, wobble: 0, morph: 0, morphSpeed: 0.5, celBreak: 0, normTint: 0, roughTint: 0
};

/* Kanal-Ansicht: 0 Bild · 1 Albedo · 2 Normale · 3 Rauheit. EIN geteiltes Uniform-Objekt, damit
   alle Looks (und damit alle Felder) gleichzeitig umschalten. */
export const DEBUG = { value: 0 };
export const TIME = { value: 0 };
/* Story-Palette (Voxel Zone S2 · world-context.js STORY_PALETTES) als Verlaufsabbildung über ALLE
   Looks: dunkel → Mitte → hell auf drei Owner-Stopps. Globale Uniforms, eine Einstellung für alles. */
export const STORY = {
  uStoryAmt: { value: 0 },
  uStory0: { value: new THREE.Color(0x2a2140) },
  uStory1: { value: new THREE.Color(0x9a7fb0) },
  uStory2: { value: new THREE.Color(0xffe4c8) }
};

export const PRESETS = {
  'SOURCE': { on: false },
  'RGB TRIPLANAR': { ...BASE, macro: 0.95, scale: 0.5, contrast: 1.35, colour: 0.72, proc: 0, grain: 0.18, bump: 0.55, roughInfl: 0.7, gloss: 0.45 },
  'PROCEDURAL / CLAY': { ...BASE, macro: 0.75, scale: 0.75, contrast: 1.2, colour: 0.1, proc: 1, grain: 0.9, grainScale: 7, bump: 0.2, roughInfl: 0.55, roughBias: 0.1, roughVar: 0.2, gloss: 0.5 },
  'COMBINED': { ...BASE, macro: 0.82, scale: 0.6, contrast: 1.3, colour: 0.34, proc: 0.45, grain: 0.68, grainScale: 7, bump: 0.7, roughInfl: 0.65, roughBias: 0.06, roughVar: 0.16, gloss: 0.6 },
  'PAPER': { ...BASE, src: 'set', set: 'Paper002', macro: 0.55, scale: 1.4, colour: 0.12, proc: 0.15, grain: 0.42, grainScale: 12, bump: 0.5, roughInfl: 0.6, roughBias: 0.08, gloss: 0.6 },
  'CARDBOARD': { ...BASE, src: 'set', set: 'CardboardSet001', macro: 0.68, scale: 0.85, colour: 0.32, proc: 0.1, grain: 0.5, grainScale: 8, bump: 0.7, roughInfl: 0.72, roughBias: 0.08, gloss: 0.5 },
  'FELT': { ...BASE, src: 'set', set: 'Fabric048', macro: 0.6, scale: 1.2, colour: 0.18, proc: 0.2, grain: 0.95, grainScale: 16, bump: 0.55, roughInfl: 0.78, roughBias: 0.14, gloss: 0.32 },
  'STONE': { ...BASE, src: 'set', set: 'rock_wall_16', macro: 0.78, scale: 0.45, contrast: 1.4, colour: 0.38, proc: 0.15, grain: 0.85, grainScale: 6, bump: 0.85, roughInfl: 0.8, roughVar: 0.24, gloss: 0.45 },
  'STRONG RGB': { ...BASE, src: 'set', set: 'Ground049A', macro: 1, scale: 0.4, contrast: 1.6, colour: 1, proc: 0, grain: 0.5, grainScale: 7, bump: 0.6, roughInfl: 0.85, roughVar: 0.22, gloss: 0.35, sat: 1.1 },
  /* Derek-Verfahren (r/TechnicalArtist, „Star Sine Signal"): EINE gemalte RGB-Kachel, triplanar
     auf xy/xz/yz, OHNE Unterschied zwischen den Ebenen — R, G und B werden je Material durch drei
     Palettenfarben ersetzt. Hier kommen die drei Farben aus der Quellfarbe selbst (Basis ·
     dunkler+Drift · heller+Gegendrift), damit KayKit-Paletten-Atlanten ohne Handarbeit mitlaufen.
     Die Kachel moduliert keinen Wert mehr (macro 0) — sie WÄHLT nur zwischen drei Farben. */
  'DEREK · RGB-GENERATOR': { ...BASE, src: 'genrgb', macro: 0, colour: 0, proc: 0, pal: 1, palSpread: 0.6, palHue: 0.22, scale: 1.4, stoch: 0.4, blend: 4, grain: 0, bump: 0, roughInfl: 0, roughBias: 0.04, roughVar: 0, gloss: 0.7 },
  'DEREK · REFERENZ-KACHEL': { ...BASE, src: 'ref', macro: 0, colour: 0, proc: 0, pal: 1, palSpread: 0.6, palHue: 0.22, scale: 1.4, stoch: 0.4, blend: 4, grain: 0, bump: 0, roughInfl: 0, roughBias: 0.04, roughVar: 0, gloss: 0.7 },
  'DEREK + KORN': { ...BASE, src: 'genrgb', macro: 0.35, contrast: 1, colour: 0, proc: 0, pal: 1, palSpread: 0.6, palHue: 0.22, scale: 1.4, stoch: 0.4, grain: 0.6, grainScale: 7, bump: 0, roughInfl: 0.3, gloss: 0.6 }
};

/* DEREK · aus Post + Referenzbild abgelesen (nicht gemessen):
   · Post: EINE gemalte RGB-Kachel, identisch auf xy/xz/yz projiziert, keine Sonderbehandlung je
     Ebene → Standard-Triplanar, KEIN stochastisches Brechen (er kachelt einfach).
   · Post: je Material drei Farbvariablen ersetzen R/G/B → Palette voll, Kachel moduliert nichts.
   · Bild: Wand/Boden/Stuhl je in EINER Farbfamilie mit nahen Tönen (Orange→Gelb→Braun) →
     geringe Spreizung, kleine Farbton-Drift. Pinselstriche gross gegen die Objekte (~Kachel pro
     1–2 m) → kleine Skala. Licht in wenigen weichen Stufen → Cel mässig.
   · Bild: dicke, schwarze, unruhige Tusche → Tusche an, Breite ~2,2, leichter Wobble.
   Terrain-Look = Georgs Befund 22.09. (COMBINED + Referenzkachel „super für terrain"). */
export const DEREK = { ...BASE, src: 'ref', macro: 0, colour: 0, proc: 0, pal: 1, palSpread: 0.32, palHue: 0.14, scale: 0.32, stoch: 0, blend: 6, grain: 0, bump: 0, roughInfl: 0, roughBias: 0.1, roughVar: 0, gloss: 0.35, cel: 0.55, celBands: 3, celSoft: 0.14, wobble: 0, morph: 0.35, morphSpeed: 0.5, celBreak: 0.55 };
PRESETS['DEREK'] = DEREK;
PRESETS['DEREK · CHARAKTER'] = { ...DEREK, pal: 0.45, palSpread: 0.18, palHue: 0.06, scale: 0.9, gloss: 0.85, cel: 0.45 };
PRESETS['DEREK · PROP'] = { ...DEREK, pal: 0.75, palSpread: 0.26, palHue: 0.1, scale: 0.55, gloss: 0.6 };
PRESETS['TERRAIN · COMBINED REF'] = { ...PRESETS['COMBINED'], src: 'ref' };
PRESETS['CEL PUR'] = { ...BASE, macro: 0, colour: 0, proc: 0, pal: 0, grain: 0, bump: 0, roughInfl: 0, gloss: 1, cel: 1, celBands: 3, celSoft: 0.06, morph: 0, celBreak: 0 };
/* Derek-Tusche aus dem Bild: dick, schwarz, im Schatten deutlich dicker, leichtes Wabern */
export const INK_DEREK = { strength: 1, thin: 2.6, thick: 6.2, lightLo: 0.05, lightHi: 0.42, wobble: 0.9, wobbleSpeed: 0.6, gap: 0.08, grain: 0.3, normalEdge: 0.9, ink: 0x120d0b };
PRESETS['NORMALEN-LOOK'] = { ...BASE, macro: 0, colour: 0, proc: 0, pal: 0, grain: 0, bump: 0, roughInfl: 0, gloss: 0.8, normTint: 0.85, cel: 0.35, celBands: 3, celSoft: 0.2 };
PRESETS['RAUHEITS-LOOK'] = { ...BASE, src: 'ref', macro: 0.6, colour: 0, proc: 0.3, pal: 0, grain: 0.4, grainScale: 7, bump: 0.3, roughInfl: 0.8, roughVar: 0.3, gloss: 0.3, roughTint: 0.8, cel: 0.3 };
export const REF_URL = './textures/derek-rgb-ref.png';

const COMMON = `
uniform sampler2D uMap, uNrm, uRgh;
uniform float uHasMap, uHasNrm, uHasRgh;
uniform float uMacro, uScale, uContrast, uBlend, uStoch, uColour, uTint, uSat;
uniform float uProc, uGrain, uGrainScale, uBump, uRoughInfl, uRoughBias, uRoughVar, uGloss, uDebug;
uniform float uPal, uPalSpread, uPalHue, uCel, uCelBands, uCelSoft, uMorph, uMorphSpeed, uCelBreak, uTime, uNormTint, uRoughTint, uStoryAmt;
uniform vec3 uStory0, uStory1, uStory2;
vec3 kfbHue(vec3 c, float a){
  const mat3 toY = mat3(0.299, 0.596, 0.211, 0.587, -0.274, -0.523, 0.114, -0.322, 0.312);
  const mat3 toR = mat3(1.0, 1.0, 1.0, 0.956, -0.272, -1.106, 0.621, -0.647, 1.703);
  vec3 y = toY * c;
  float cs = cos(a), sn = sin(a);
  y.yz = vec2(y.y * cs - y.z * sn, y.y * sn + y.z * cs);
  return max(toR * y, 0.0);
}
varying vec3 vWPosM, vWNrmM;

vec2 kfbH2(vec2 p){
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return fract(sin(p) * 43758.5453) - 0.5;
}
float kfbH1(vec3 p){ return fract(sin(dot(p, vec3(12.9898, 78.233, 37.719))) * 43758.5453); }
float kfbN(vec3 p){
  vec3 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(kfbH1(i), kfbH1(i+vec3(1,0,0)), f.x), mix(kfbH1(i+vec3(0,1,0)), kfbH1(i+vec3(1,1,0)), f.x), f.y),
             mix(mix(kfbH1(i+vec3(0,0,1)), kfbH1(i+vec3(1,0,1)), f.x), mix(kfbH1(i+vec3(0,1,1)), kfbH1(i+vec3(1,1,1)), f.x), f.y), f.z);
}
float kfbFbm(vec3 p){
  return kfbN(p) * 0.55 + kfbN(p * 2.07) * 0.28 + kfbN(p * 4.31) * 0.17;
}
vec3 kfbStoch(sampler2D t, vec2 uv){
  if (uStoch < 0.01) return texture2D(t, uv).rgb;
  vec2 o1 = kfbH2(floor(uv)) * uStoch;
  vec2 o2 = kfbH2(floor(uv + 0.5) + 17.3) * uStoch;
  float w = smoothstep(0.35, 0.65, kfbN(vec3(uv * 0.7, 0.0)));
  return mix(texture2D(t, uv + o1).rgb, texture2D(t, uv + o2).rgb, w);
}
vec3 kfbTri(sampler2D t, vec3 wp0, vec3 wn){
  /* Morph: die Kachel fliesst langsam in sich (weiche Domänenverzerrung in Weltkoordinaten) —
     Farbflächen und die daran hängenden Schattenkanten wandern, ohne Stufen oder Zellen */
  vec3 wp = wp0;
  if (uMorph > 0.001) {
    float mt = uTime * uMorphSpeed * 0.35;
    vec3 q = wp0 * uScale * 0.9;
    wp += (vec3(kfbN(q + vec3(mt, 0.0, 0.0)), kfbN(q + vec3(11.3, mt, 0.0)), kfbN(q + vec3(0.0, 23.7, mt))) - 0.5) * uMorph / max(uScale, 0.05);
  }
  vec3 b = pow(abs(wn), vec3(uBlend));
  b /= max(1e-4, b.x + b.y + b.z);
  return kfbStoch(t, wp.zy * uScale) * b.x + kfbStoch(t, wp.xz * uScale) * b.y + kfbStoch(t, wp.xy * uScale) * b.z;
}
`;

function patch(mat, U) {
  mat.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, U);
    shader.vertexShader = 'varying vec3 vWPosM;\nvarying vec3 vWNrmM;\nuniform float uWobble, uTime;\n' + shader.vertexShader
      .replace('#include <begin_vertex>', `#include <begin_vertex>
  if (uWobble > 0.00001) {
    float kst = floor(uTime * 8.0);
    vec3 kw = (modelMatrix * vec4(transformed, 1.0)).xyz;
    transformed += vec3(sin(dot(kw, vec3(12.9, 78.2, 37.7)) + kst * 1.7),
                        sin(dot(kw, vec3(39.3, 11.1, 83.1)) + kst * 2.3),
                        sin(dot(kw, vec3(73.1, 52.7, 19.4)) + kst * 3.1)) * uWobble;
  }`)
      .replace('#include <project_vertex>',
        '#include <project_vertex>\n  vWPosM = (modelMatrix * vec4(transformed, 1.0)).xyz;\n' +
        '  vWNrmM = normalize(mat3(modelMatrix) * objectNormal);');
    shader.fragmentShader = COMMON + shader.fragmentShader
      .replace('#include <map_fragment>', `#include <map_fragment>
  vec3 kfbSrc = diffuseColor.rgb;
  vec3 kfbBmp = uHasMap > 0.5 ? kfbTri(uMap, vWPosM, vWNrmM) : vec3(0.5);
  float kfbP = kfbFbm(vWPosM * uScale * 1.6);
  vec3 kfbPro = vec3(kfbP * 0.75 + 0.25);
  vec3 kfbTex = mix(kfbBmp, kfbPro, uProc);
  float kfbLum = dot(kfbTex, vec3(0.299, 0.587, 0.114));
  float kfbVal = clamp((kfbLum - 0.5) * uContrast + 0.5, 0.0, 1.0);
  vec3 kfbMod = diffuseColor.rgb * (0.45 + kfbVal * 1.1);
  vec3 kfbSurf = mix(kfbMod, kfbTex * (0.6 + kfbVal * 0.8), uColour);
  vec3 kfbOut = mix(diffuseColor.rgb, kfbSurf, uMacro) * uTint;
  float kfbGray = dot(kfbOut, vec3(0.299, 0.587, 0.114));
  diffuseColor.rgb = mix(vec3(kfbGray), kfbOut, uSat);
  if (uPal > 0.001 && uHasMap > 0.5) {
    vec3 w = max(kfbBmp, 0.0);
    w /= max(w.r + w.g + w.b, 1e-3);
    vec3 c1 = kfbSrc;
    /* Dunkle Quellfarben (Haar, Stiefel) tragen fast keinen Farbton — deshalb additiver Anteil,
       sonst wäre die Palette dort unsichtbar. */
    vec3 c2 = kfbHue(kfbSrc * (1.0 - uPalSpread * 0.7), uPalHue * 1.6);
    vec3 c3 = min(kfbHue(kfbSrc * (1.0 + uPalSpread) + uPalSpread * 0.16 * (normalize(kfbSrc + 0.02) * 0.6 + 0.4), -uPalHue * 1.6), 1.0);
    vec3 kfbPc = w.r * c1 + w.g * c2 + w.b * c3;
    float kfbPg = dot(kfbPc, vec3(0.299, 0.587, 0.114));
    kfbPc = mix(vec3(kfbPg), kfbPc, uSat) * uTint;
    diffuseColor.rgb = mix(diffuseColor.rgb, kfbPc * mix(vec3(1.0), diffuseColor.rgb / max(kfbSrc, 1e-3), clamp(uMacro, 0.0, 1.0)), uPal);
  }`)
      .replace('#include <roughnessmap_fragment>', `#include <roughnessmap_fragment>
  float kfbOR = roughnessFactor;
  float kfbMR = uHasRgh > 0.5 ? kfbTri(uRgh, vWPosM, vWNrmM).r : 0.9;
  kfbMR = mix(kfbMR, 0.85 + kfbFbm(vWPosM * uScale * 2.0) * 0.15, uProc);
  float kfbRN = kfbN(vWPosM * max(0.5, uGrainScale * 0.25));
  float kfbNR = clamp(mix(kfbOR, kfbMR, uRoughInfl * uMacro) + uRoughBias * uMacro
                      + (kfbRN - 0.5) * uRoughVar * uMacro, 0.04, 1.0);
  roughnessFactor = mix(kfbNR, kfbOR, clamp(uGloss * (1.0 - kfbOR), 0.0, 1.0));`)
      .replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps>
  if (uGrain * uMacro > 0.001) {
    vec3 gp = vWPosM * uGrainScale;
    float e = 0.55, g0 = kfbN(gp);
    vec3 gr = vec3(kfbN(gp + vec3(e,0,0)) - g0, kfbN(gp + vec3(0,e,0)) - g0, kfbN(gp + vec3(0,0,e)) - g0);
    normal = normalize(normal + gr * uGrain * uMacro * 2.4);
  }
  if (uHasNrm > 0.5 && uBump * uMacro > 0.001) {
    vec3 mn = kfbTri(uNrm, vWPosM, vWNrmM) * 2.0 - 1.0;
    normal = normalize(normal + mn * uBump * uMacro);
  }
  /* Kanal-Ansicht als LOOK (Georg 23.09.): die dezenten Pastelltöne der Normalen- bzw. Grautöne der
     Rauheits-Ansicht als Albedo — WELT-Normale, damit die Farbe beim Orbit nicht mitwandert; Licht bleibt. */
  if (uNormTint > 0.001) {
    vec3 kn = normalize(vWNrmM) * 0.5 + 0.5;
    kn = mix(vec3(dot(kn, vec3(0.3333))), kn, 0.75) * 0.95;
    diffuseColor.rgb = mix(diffuseColor.rgb, kn * mix(1.0, dot(diffuseColor.rgb, vec3(0.3333)) * 1.6 + 0.4, 0.35), uNormTint);
  }
  if (uStoryAmt > 0.001) {
    float sl = dot(diffuseColor.rgb, vec3(0.299, 0.587, 0.114));
    vec3 sr = sl < 0.5 ? mix(uStory0, uStory1, sl * 2.0) : mix(uStory1, uStory2, sl * 2.0 - 1.0);
    diffuseColor.rgb = mix(diffuseColor.rgb, sr, uStoryAmt);
  }
  if (uRoughTint > 0.001) diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.35 + roughnessFactor * 0.55) * mix(vec3(1.0), diffuseColor.rgb * 1.4 + 0.3, 0.25), uRoughTint);`)
      .replace('#include <lights_fragment_end>', `#include <lights_fragment_end>
  if (uCel > 0.001) {
    vec3 kc = max(diffuseColor.rgb, vec3(1e-3));
    float kIn = dot(reflectedLight.directDiffuse / kc, vec3(0.3333));
    float kx = kIn / 1.6 * uCelBands + (dot(kfbBmp, vec3(0.3333)) - 0.5) * uCelBreak * 1.6;
    float kq = (floor(kx) + smoothstep(0.5 - uCelSoft, 0.5 + uCelSoft, fract(kx))) / uCelBands * 1.6;
    reflectedLight.directDiffuse *= mix(1.0, kq / max(kIn, 1e-3), uCel);
    float kSp = dot(reflectedLight.directSpecular, vec3(0.3333));
    reflectedLight.directSpecular = mix(reflectedLight.directSpecular, vec3(smoothstep(0.18, 0.22, kSp)) * 0.6, uCel);
  }`)
      .replace('#include <dithering_fragment>', `#include <dithering_fragment>
  if (uDebug > 0.5) {
    if (uDebug < 1.5) gl_FragColor = vec4(pow(max(diffuseColor.rgb, 0.0), vec3(1.0 / 2.2)), 1.0);
    else if (uDebug < 2.5) gl_FragColor = vec4(normal * 0.5 + 0.5, 1.0);
    else gl_FragColor = vec4(vec3(roughnessFactor), 1.0);
  }`);
  };
  mat.customProgramCacheKey = () => 'kfb-look';
  mat.needsUpdate = true;
}

let lookN = 0;
export function makeLook(init = {}) {
  const p = { ...BASE, ...init };
  const U = {
    uMap: { value: null }, uNrm: { value: null }, uRgh: { value: null },
    uHasMap: { value: 0 }, uHasNrm: { value: 0 }, uHasRgh: { value: 0 },
    uDebug: DEBUG, uTime: TIME, ...STORY
  };
  for (const k of KEYS) U['u' + k[0].toUpperCase() + k.slice(1)] = { value: p[k] };
  const id = ++lookN;
  const look = {
    id, p, U,
    set(k, v) { p[k] = v; const u = U['u' + k[0].toUpperCase() + k.slice(1)]; if (u) u.value = v; },
    setAll(o) { for (const k of KEYS) if (o[k] != null) look.set(k, o[k]); if (o.src) p.src = o.src; if (o.set) p.set = o.set; if (o.on != null) p.on = o.on; },
    maps(m) {
      U.uMap.value = m.map || null; U.uHasMap.value = m.map ? 1 : 0;
      U.uNrm.value = m.normalMap || null; U.uHasNrm.value = m.normalMap ? 1 : 0;
      U.uRgh.value = m.roughMap || null; U.uHasRgh.value = m.roughMap ? 1 : 0;
    },
    state() { return { ...p }; }
  };
  return look;
}

/* Anwenden: Quellmaterial bleibt in userData, damit SOURCE verlustfrei ist. */
/* Neutraler Look: alle Stärken 0 ⇒ der Einschub ist mathematisch die Identität. Er wird NUR in
   der Kanal-Ansicht auf das SOURCE-Feld gelegt, damit auch die Quelle ihre Kanäle zeigen kann.
   In der Bildansicht bekommt SOURCE sein unberührtes Originalmaterial. */
let IDENTITY = null;
function identity() {
  if (!IDENTITY) IDENTITY = makeLook({ macro: 0, colour: 0, proc: 0, grain: 0, bump: 0, roughInfl: 0, roughBias: 0, roughVar: 0, gloss: 1, tint: 1, sat: 1, pal: 0, cel: 0, wobble: 0, morph: 0, celBreak: 0 });
  return IDENTITY;
}

export function apply(root, look0) {
  let n = 0;
  const look = (!look0 || look0.p.on === false) ? (DEBUG.value > 0 ? identity() : null) : look0;
  root.traverse((o) => {
    if (!o.isMesh || !o.material || o.userData.kfbSkip) return;
    if (!o.userData.kfbSrcMat) o.userData.kfbSrcMat = o.material;
    const src = o.userData.kfbSrcMat;
    if (!look) { o.material = src; return; }
    const list = Array.isArray(src) ? src : [src];
    const out = list.map((m) => {
      if (!m || !(m.isMeshStandardMaterial || m.isMeshPhysicalMaterial)) return m;
      const key = 'kfbMat' + look.id;
      if (o.userData[key]) return o.userData[key];
      const c = m.clone();
      patch(c, look.U);
      o.userData[key] = c;
      n++;
      return c;
    });
    o.material = Array.isArray(src) ? out : out[0];
  });
  return n;
}

/* ---------- Texturen ---------- */
const loader = new THREE.TextureLoader();
const cache = new Map();
function repoTex(set, kind, srgb) {
  const url = TEXROOT + encodeURIComponent(set) + '/' + encodeURIComponent(set + '_' + kind) + '.jpg';
  if (!cache.has(url)) {
    cache.set(url, loader.loadAsync(url).then((t) => {
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
      t.anisotropy = 4;
      return t;
    }));
  }
  return cache.get(url);
}
export async function repoSet(set) {
  const [map, normalMap, roughMap] = await Promise.all([
    repoTex(set, 'diffuse', true),
    repoTex(set, 'normal', false).catch(() => null),
    repoTex(set, 'roughness', false).catch(() => null)
  ]);
  return { map, normalMap, roughMap, label: 'Repo-Satz ' + set };
}
export function genSet(gen, mask = false) {
  const t = (c, srgb) => {
    const tx = new THREE.CanvasTexture(c);
    tx.wrapS = tx.wrapT = THREE.RepeatWrapping;
    tx.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
    tx.anisotropy = 4;
    return tx;
  };
  /* Maske = Daten, keine Farbe: ohne sRGB-Dekodierung, sonst verschieben sich die Kanalgewichte */
  return { map: t(gen.diffuse, !mask), normalMap: t(gen.normal, false), roughMap: t(gen.rough, false), label: mask ? 'Generator RGB' : 'Generator' };
}
let refP = null;
export function refSet() {
  if (!refP) refP = loader.loadAsync(REF_URL).then((t) => {
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.colorSpace = THREE.NoColorSpace;
    t.anisotropy = 4;
    return { map: t, normalMap: null, roughMap: null, label: 'Referenz-Kachel' };
  });
  return refP;
}
