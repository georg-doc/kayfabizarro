// KFB · Cartoon-Paletten-Generator (Farbharmonie-Modell R1, WS0 15.10.2026, V-293)
//
// Abhängigkeitsfrei, ES-Modul, deterministisch (Seed). Rechnet in OKLCH, gamut-mappt nach sRGB
// (Buntheit wird bei gleicher Helligkeit und gleichem Farbton gesenkt, bis die Farbe darstellbar ist).
//
// Das Modell ist aus den drei Joyride-J17-Welten (track-look.v5.js WORLDS + Lab palettes.ts PALETTES)
// gemessen. Kurzform (Details README.md):
//   1. Drei Farbtöne tragen eine Welt: BODEN g (60 %), STRANG s (immer warm, ~±90° zu g), WAHRZEICHEN t (~180° zu g,
//      Bonbon-Band Violett–Magenta–Rot). Laub ist Natur-Grün, außer der Boden ist selbst grün/türkis: dann Herbst-Orange.
//      Himmel = Laub + 90°. Stamm/Erde = Laub − 105°. Pad = Gelb. Fahrbahn = Schiefer (V-102, fest).
//   2. Helligkeit folgt dem Gamut-Cusp des Farbtons, aber zur Mitte gestaucht (Pop-L = 0,37 + 0,5·cuspL):
//      Gelb hell, Violett/Blau tiefer, nie dunkel. Leiter: Creme 0,93 · Himmel 0,82 · Pop 0,62–0,85 · Boden 0,59–0,66 ·
//      Erde/Stamm 0,47–0,68 · Fahrbahn 0,41.
//   3. Buntheit in vier Stufen mit Deckel: Pop ≤ 0,195 (≈ 90 % des Möglichen), Feld ≤ 0,14, Ruhe ~0,07, Neutral ~0,03.
//      Nie Neon: absolute Obergrenze 0,195, auch wenn sRGB mehr hergibt (Magenta/Violett bleiben bei ~0,16).

// ------------------------------------------------------------------ Farbrechnung
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const wrap = h => ((h % 360) + 360) % 360;
/** signierter kürzester Winkel a − b in (−180, 180] */
export const dHue = (a, b) => { let d = wrap(a - b); if (d > 180) d -= 360; return d; };
const toLin = u => (u <= 0.04045 ? u / 12.92 : Math.pow((u + 0.055) / 1.055, 2.4));
const toSrgb = u => (u <= 0.0031308 ? u * 12.92 : 1.055 * Math.pow(u, 1 / 2.4) - 0.055);

export function hexToOklab(hex) {
  const n = parseInt(String(hex).replace('#', ''), 16);
  const R = toLin(((n >> 16) & 255) / 255), G = toLin(((n >> 8) & 255) / 255), B = toLin((n & 255) / 255);
  const l = Math.cbrt(0.4122214708 * R + 0.5363325363 * G + 0.0514459929 * B);
  const m = Math.cbrt(0.2119034982 * R + 0.6806995451 * G + 0.1073969566 * B);
  const s = Math.cbrt(0.0883024619 * R + 0.2817188376 * G + 0.6299787005 * B);
  return [0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s, 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s, 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s];
}
export function hexToOklch(hex) { const [L, a, b] = hexToOklab(hex); return { L, C: Math.hypot(a, b), h: wrap(Math.atan2(b, a) * 180 / Math.PI) }; }
function oklchToLinRgb(L, C, h) {
  const r = h * Math.PI / 180, a = Math.cos(r) * C, b = Math.sin(r) * C;
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3, m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3, s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s, -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s, -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s];
}
const inGamut = (L, C, h) => oklchToLinRgb(L, C, h).every(v => v >= -1e-5 && v <= 1 + 1e-5);
/** größte darstellbare Buntheit bei (L, h) in sRGB */
export function maxChroma(L, h) { let lo = 0, hi = 0.4; for (let i = 0; i < 24; i++) { const mid = (lo + hi) / 2; if (inGamut(L, mid, h)) lo = mid; else hi = mid; } return lo; }
const CUSP = new Map();
/** Gamut-Spitze (cusp) des Farbtons: die Helligkeit, bei der der Ton am buntesten sein kann */
export function cusp(h) {
  const k = Math.round(wrap(h)) % 360; if (CUSP.has(k)) return CUSP.get(k);
  let best = { L: 0.5, C: 0 }; for (let L = 0.2; L <= 0.99; L += 0.0025) { const c = maxChroma(L, k); if (c > best.C) best = { L, C: c }; }
  CUSP.set(k, best); return best;
}
/** OKLCH → #hex mit Gamut-Mapping (Buntheit runter, L und h bleiben) */
export function oklchToHex(L, C, h) {
  L = clamp(L, 0, 1); const c = Math.min(Math.max(0, C), maxChroma(L, h));
  const q = oklchToLinRgb(L, c, h).map(v => Math.round(clamp(toSrgb(clamp(v, 0, 1)), 0, 1) * 255));
  return '#' + q.map(v => v.toString(16).padStart(2, '0')).join('');
}
/** ΔE in OKLab (euklidisch; 0,02 ≈ eben sichtbar, 0,05 = deutlich, 0,10 = andere Farbe) */
export function deltaE(a, b) { const p = hexToOklab(a), q = hexToOklab(b); return Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]); }

export function mulberry32(seed) {
  let a = (seed >>> 0) ^ 0x9e3779b9;   // Seed mischen (murmur3-Finalizer): Nachbar-Seeds ≠ Nachbar-Farben
  a ^= a >>> 16; a = Math.imul(a, 0x85ebca6b); a ^= a >>> 13; a = Math.imul(a, 0xc2b2ae35); a ^= a >>> 16; a = (a >>> 0) || 1;
  return () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

// ------------------------------------------------------------------ Modell-Konstanten (aus J17 gemessen)
export const MODEL = {
  version: 'kfb-cartoon-palette/1',
  // Farbton-Bänder
  warmBand: [0, 90], warmCentre: 45, warmPull: 0.30,       // Strang: immer warm, 30 % zur Orange-Mitte gezogen
  candyCentre: 350, candyPull: 0.40, monoDist: 35,         // Wahrzeichen: 40 % zum Bonbon-Zentrum; < 35° am Strang → monochrom (Canyon)
  greenGround: [105, 215],                                  // Boden grün/türkis → Herbstlaub
  warmGround: [340, 110],                                   // warme Böden (Rot–Orange–Gelb) ruhiger: C ≤ 0,11 (wie Bucht-Sand)
  strandBand: [65, 110],                                    // Boden gelb/sand → heller Strand-Boden (Bucht)
  leafGreen: 143, leafAutumn: 66, leafSplit: 5,             // Laubtöne; hell/dunkel ±5° (hell Richtung Gelb)
  skyFromLeaf: 90, trunkFromLeaf: -105, strandHillFromSky: -30, waterTisch: 247, bloomMix: 0.75,
  padHue: 92, padMinGap: 20,
  // Helligkeit (L) und Buntheit (C) je Rolle
  L: {
    pop: [0.37, 0.50],          // L = a + b · cuspL(h)  (Strang)
    tower: [0.44, 0.30],
    ground: [0.55, 0.12],       // Tisch-Boden
    strandGround: 0.87,
    sky: [0.55, 0.33],
    cream: 0.93, path: 0.93, sandTisch: 0.90,
    earth: [0.68, 0.61, 0.52], earthAutumn: [0.47, 0.42, 0.35],   // Herbstlaub (hell, Pop) → Stamm/Erde = dunkles Gegengewicht
    waterTisch: 0.59, waterStrand: 0.76,
    greenLeafBelowGround: 0.06, strandLeafBelowGround: 0.13,
  },
  C: { popMax: 0.195, popRel: 0.92, towerMax: 0.17, towerRel: 0.90, groundMax: 0.14, groundWarmMax: 0.11, groundRel: 0.85, strandGround: 0.11,
    leafMax: 0.175, leafRel: 0.85, sky: 0.068, water: 0.066, waterStrand: 0.11, cream: 0.028, path: 0.042, sand: 0.03,
    earth: 0.10, earthMono: 0.155, bloom: 0.12, hillStrand: 0.095, padRel: 0.92 },
  road: { track: '#3d4a60', streetDL: 0.10 },   // V-102 / V-174 fest
  // Leitern und Varianten
  ladder: { lightDL: 0.07, lightC: 0.95, darkDL: -0.09, darkC: 1.0 },
  variant: { dunkelDL: -0.17, dunkelC: 0.85, sattDL: 0.06, sattYellowDL: 0.06, sattC: 1.15 },
};

// Harmonie-Schemata: Winkel von Strang und Wahrzeichen zum Boden (Seite des Strangs wählt die Warm-Regel)
export const SCHEMES = {
  joyride:   { label: 'Joyride (Quadrat-Teil)', strang: 90, tower: 180 },   // aus J17 gemessen
  komplementaer: { label: 'Komplementär', strang: 180, tower: 150, candyPull: 0.2 },
  split:     { label: 'Split-Komplementär', strang: 150, tower: 210, candyPull: 0.2 },
  triade:    { label: 'Triade', strang: 120, tower: 240, candyPull: 0.2 },
  analog:    { label: 'Analog', strang: 40, tower: -40, candyPull: 0.2 },   // Wahrzeichen auf der anderen Seite des Bodens
};
const SCHEME_WEIGHTS = [['joyride', 4], ['komplementaer', 2], ['split', 2], ['triade', 2], ['analog', 1]];

// ------------------------------------------------------------------ Bausteine
const inBand = (h, [a, b]) => { h = wrap(h); return a <= b ? h >= a && h <= b : h >= a || h <= b; };
const bandDist = (h, [a, b]) => inBand(h, [a, b]) ? 0 : Math.min(Math.abs(dHue(h, a)), Math.abs(dHue(h, b)));
const lin2 = ([a, b], x) => a + b * x;
const yellowness = h => Math.max(0, 1 - Math.abs(dHue(h, 95)) / 35);   // 1 bei Gelb, 0 ab ±35°

/** eine Farbe aus Zielwerten: C gedeckelt auf rel · maxC(L,h) und absolut */
function tone(L, Cwant, h, rel = 1) { L = clamp(L, 0.05, 0.98); const C = Math.min(Cwant, rel * maxChroma(L, h)); return { L, C, h: wrap(h) }; }
const hexOf = t => oklchToHex(t.L, t.C, t.h);
const shift = (t, dL, cMul = 1, dh = 0) => tone(t.L + dL, t.C * cMul, t.h + dh);

/** Drei-Ton-Leiter [hell, mitte, dunkel] (ENV_ROLES-Form) */
export function ladderOf(t) { const k = MODEL.ladder; return [hexOf(shift(t, k.lightDL, k.lightC)), hexOf(t), hexOf(shift(t, k.darkDL, k.darkC))]; }
/** dunkle und satte Variante einer Akzentfarbe */
export function variantsOf(t) {
  const v = MODEL.variant;
  const dunkel = tone(t.L + v.dunkelDL, t.C * v.dunkelC, t.h);
  const sL = t.L + v.sattDL + v.sattYellowDL * yellowness(t.h);
  const satt = tone(sL, t.C * v.sattC, t.h, 0.97);
  return { dunkel: hexOf(dunkel), satt: hexOf(satt) };
}

// ------------------------------------------------------------------ Kern
/**
 * Baut die Palette aus Farbtönen. hues: { g } Pflicht; s, t, leaf optional (Vorgaben). opts: scheme, jitter (rng),
 * mood {dL, cMul}, fixed { role: '#hex' } (Vorgabefarben exakt übernehmen).
 */
function build(hues, opts = {}) {
  const M = MODEL, scheme = SCHEMES[opts.scheme] ?? SCHEMES.joyride, jit = opts.jitter ?? (() => 0);
  const mood = { dL: 0, cMul: 1, ...(opts.mood || {}) };
  const g = wrap(hues.g);
  const strand = inBand(g, M.strandBand);

  // Strang: g ± Schema-Winkel, die wärmere Seite, dann zur Orange-Mitte gezogen
  let s = hues.s;
  if (s == null) {
    const c1 = wrap(g + scheme.strang), c2 = wrap(g - scheme.strang);
    const d1 = bandDist(c1, M.warmBand), d2 = bandDist(c2, M.warmBand);
    const c = d1 < d2 || (d1 === d2 && Math.abs(dHue(c1, M.warmCentre)) <= Math.abs(dHue(c2, M.warmCentre))) ? c1 : c2;
    s = wrap(c + M.warmPull * dHue(M.warmCentre, c) + jit());
    hues._side = c === c1 ? 1 : -1;
  }
  // Wahrzeichen: Schema-Winkel auf der Seite des Strangs, zum Bonbon-Zentrum gezogen; zu nah am Strang → monochrom
  let t = hues.t, mono = false;
  if (t == null) {
    const side = hues._side ?? 1, j = jit();
    const cp = scheme.candyPull ?? M.candyPull, pull = raw => wrap(raw + cp * dHue(M.candyCentre, raw) + j);
    t = pull(wrap(g + side * scheme.tower));
    if (Math.abs(dHue(t, s)) < M.monoDist) t = pull(wrap(g - side * scheme.tower));   // andere Seite versuchen (bei 180° dieselbe)
    if (Math.abs(dHue(t, s)) < M.monoDist) { t = s; mono = true; }                   // sonst monochrom (Canyon)
  } else mono = Math.abs(dHue(t, s)) < 8;
  // Laub: Grün, außer der Boden ist grün/türkis → Herbst-Orange (vom Strang weggeschoben, wenn zu nah)
  let leafH = hues.leaf, autumn = false;
  if (leafH == null) {
    autumn = inBand(g, M.greenGround);
    leafH = autumn ? M.leafAutumn : M.leafGreen;
    if (autumn && Math.abs(dHue(leafH, s)) < 12) leafH = wrap(s - 12 * Math.sign(dHue(s, leafH) || 1));
    leafH = wrap(leafH + jit());
  } else autumn = !inBand(leafH, [100, 170]);
  const skyH = wrap(leafH + M.skyFromLeaf);
  const trunkH = wrap(leafH + M.trunkFromLeaf);
  // Pad: Gelb, mindestens 20° vom Strang weg
  let padH = M.padHue; if (Math.abs(dHue(padH, s)) < M.padMinGap) padH = wrap(s + M.padMinGap * (dHue(padH, s) >= 0 ? 1 : -1));

  const L = M.L, C = M.C, cm = mood.cMul, dl = mood.dL;
  // Boden-Familie
  const ground = strand ? tone(L.strandGround + dl, C.strandGround * cm, g, 0.75) : tone(lin2(L.ground, cusp(g).L) + dl, (inBand(g, M.warmGround) ? C.groundWarmMax : C.groundMax) * cm, g, C.groundRel);
  const top2 = shift(ground, 0.045, 0.93, 1);
  let hillLight, hillDark, rim, under0;
  const sky = tone(lin2(L.sky, cusp(skyH).L) + dl * 0.5, C.sky * cm, skyH);
  if (strand) {   // heller Boden: die Hügel tragen den kühlen Partner (Bucht: Aqua-Dünen)
    const hh = wrap(skyH + M.strandHillFromSky);
    hillLight = tone(ground.L - 0.11, C.hillStrand * cm, hh); hillDark = tone(ground.L - 0.18, C.hillStrand * cm, hh + 6);
    rim = tone(ground.L - 0.06, ground.C + 0.007, g - 3); under0 = tone(ground.L - 0.11, ground.C, g - 11);
  } else {
    hillLight = shift(ground, 0.065, 0.92, 1); hillDark = shift(ground, -0.055, 1.0, -1);
    rim = hillDark; under0 = shift(ground, -0.14, 0.92);
  }
  // Strang, Wahrzeichen
  const strang = tone(lin2(L.pop, cusp(s).L) + dl, C.popMax * cm, s, C.popRel);
  const tower0 = mono ? strang : tone(lin2(L.tower, cusp(t).L) + dl, C.towerMax * cm, t, C.towerRel);
  const tower1 = mono ? tone(strang.L + 0.02, 0.16 * cm, s + 6, C.popRel) : shift(tower0, 0.07, 0.93, 1);
  // Laub
  const leafPopL = lin2(L.pop, cusp(leafH).L);
  const leafL = autumn ? leafPopL : Math.min(leafPopL, ground.L - (strand ? L.strandLeafBelowGround : L.greenLeafBelowGround));
  const tLeaf = d => sign => tone(leafL + d, C.leafMax * cm, leafH + sign * M.leafSplit * Math.sign(dHue(100, leafH) || 1), C.leafRel);
  const leafLight = tLeaf(0.035)(1), leafDark = tLeaf(-0.035)(-1);
  const leafMid = tone(leafL, C.leafMax * cm, leafH, C.leafRel);
  // Blüte: helle Bonbon-Mischung aus Wahrzeichen und Strang (75 % zum Strang); auf Herbstlaub = Wahrzeichen-Ton;
  // monochromes Wahrzeichen → Limette (Echo des Pads)
  const bloom = mono ? tone(0.81 + dl, C.bloom * cm, padH + 15)
    : autumn ? tower0
    : tone(0.80 + dl, C.bloom * cm, t + M.bloomMix * dHue(s, t));
  // Erde / Stamm
  const eC = (mono ? C.earthMono : C.earth) * cm;
  const earth = (autumn ? L.earthAutumn : L.earth).map((l, i) => tone(l + dl, eC * [1, 0.97, 0.85][i], trunkH - 3 * i));
  const trunk = mono ? tone(earth[2].L - 0.01, eC * 0.5, trunkH + 10) : earth[0];
  // Creme, Wasser, Fahrbahn, Pad
  const cloud = tone(L.cream + dl * 0.3, C.cream, 80), path = tone(L.path + dl * 0.3, C.path, 84);
  const sand = strand ? tone(ground.L + 0.06, 0.07, g + 2) : tone(L.sandTisch + dl * 0.3, C.sand, 80);
  const rock = mono ? sand : tower1;
  // Wasser: Tisch-Welt = Taubenblau (fest ~247°, nah an der Fahrbahn); Strand-Welt = Lagune im Ton der Dünen
  const water = strand ? tone(L.waterStrand + dl, C.waterStrand * cm, hillDark.h - 2) : tone(L.waterTisch + dl, C.water * cm, M.waterTisch);
  const roadTrackT = hexToOklch(M.road.track), roadTrack = tone(roadTrackT.L, roadTrackT.C, roadTrackT.h), roadStreet = shift(roadTrack, M.road.streetDL, 1.12);
  const pad = tone(cusp(padH).L - 0.01, 0.2, padH, C.padRel);

  const T = { sky, top: ground, top2, hillLight, hillDark, sand, rim, under0, earth1: earth[0], earth2: earth[1], earth3: earth[2], rock, tower0, tower1,
    leafLight, leafDark, leafMid, bloom, trunk, cloud, water, path, roadStreet, roadTrack, strang, pad };
  const hex = Object.fromEntries(Object.entries(T).map(([k, v]) => [k, hexOf(v)]));
  for (const [k, v] of Object.entries(opts.fixed || {})) if (hex[k]) { hex[k] = v; T[k] = hexToOklch(v); }
  if (opts.fixed?.tower0 && mono) hex.strang = hex.strang;   // Vorgabe bleibt Vorgabe

  const roles = {   // J17 / palettes.ts-Form
    sky: hex.sky, top: hex.top, top2: hex.top2, hill: [hex.hillLight, hex.hillDark], sand: hex.sand, rim: hex.rim,
    under: [hex.under0, hex.earth1, hex.earth2, hex.earth3], rock: hex.rock, tower: [hex.tower0, hex.tower1],
    leaf: [hex.leafDark, hex.leafLight, hex.bloom], trunk: hex.trunk, cloud: hex.cloud, water: hex.water, path: hex.path,
    roadStreet: hex.roadStreet, roadTrack: hex.roadTrack, strang: hex.strang, pad: hex.pad,
  };
  // ENV_ROLES-Form: drei Töne je Rolle
  const grassT = tone(ground.L + 0.02, ground.C * 0.85, g + 0.25 * dHue(M.leafGreen, g));
  const envRoles = {
    ground: [hex.top2, hex.top, hexOf(strand ? rim : hillDark)], grass: ladderOf(grassT), stone: ladderOf(tone(earth[1].L, earth[1].C * 0.55, earth[1].h)),
    bark: ladderOf(T.trunk), leaf: [hex.leafLight, hexOf(leafMid), hex.leafDark], bloom: ladderOf(T.bloom), water: ladderOf(T.water),
    accent: ladderOf(T.strang), sand: ladderOf(T.sand), paved: ladderOf(T.path), earth: [hex.earth1, hex.earth2, hex.earth3],
    asphalt: ladderOf(roadTrack), landmark: ladderOf(T.tower0), sky: ladderOf(T.sky),
  };
  const variants = Object.fromEntries(['strang', 'tower0', 'pad', 'bloom', 'leafMid', 'top'].map(k => [k === 'tower0' ? 'tower' : k === 'leafMid' ? 'leaf' : k === 'top' ? 'ground' : k, { mitte: hex[k] ?? hexOf(T[k]), ...variantsOf(T[k]) }]));
  return {
    schema: MODEL.version, scheme: opts.scheme ?? 'joyride', seed: opts.seed ?? 0,
    hues: { ground: +g.toFixed(1), strang: +wrap(s).toFixed(1), tower: +wrap(t).toFixed(1), leaf: +leafH.toFixed(1), sky: +skyH.toFixed(1), trunk: +trunkH.toFixed(1), pad: +padH.toFixed(1) },
    mode: { boden: strand ? 'strand' : 'tisch', wahrzeichen: mono ? 'monochrom' : 'eigen', laub: autumn ? 'herbst' : 'gruen' },
    mood, roles, flat: hex, envRoles, variants,
  };
}

// ------------------------------------------------------------------ öffentliche API
const pickScheme = rng => { const tot = SCHEME_WEIGHTS.reduce((a, [, w]) => a + w, 0); let r = rng() * tot; for (const [k, w] of SCHEME_WEIGHTS) { if ((r -= w) < 0) return k; } return 'joyride'; };

/** Palette aus einem Boden-Farbton. seed = 0 → exakt die Regel (kein Würfel-Rauschen). */
export function fromHue(h, seed = 0, scheme) {
  const rng = mulberry32(seed || 1);
  const sc = scheme ?? (seed ? pickScheme(rng) : 'joyride');
  const jitter = seed ? () => (rng() - 0.5) * 12 : () => 0;
  const mood = seed ? { dL: +((rng() - 0.5) * 0.04).toFixed(3), cMul: +(0.92 + rng() * 0.16).toFixed(3) } : { dL: 0, cMul: 1 };
  return { ...build({ g: h }, { scheme: sc, jitter, mood, seed }), source: { type: 'hue', h } };
}

/** zufällige Palette (Seed → reproduzierbar) */
export function random(seed) { const rng = mulberry32((seed | 0) || 1); return { ...fromHue(rng() * 360, (seed | 0) || 1), source: { type: 'random', seed } }; }

/**
 * Palette aus 1–3 Vorgabefarben. Jede Farbe wird der Rolle zugeordnet, die am besten passt
 * (Boden, Strang, Wahrzeichen, Laub); die Vorgaben bleiben exakt, der Rest folgt der Regel.
 */
export function fromColors(colors, seed = 0, scheme) {
  const cs = colors.slice(0, 3).map(c => ({ hex: c, ...hexToOklch(c) }));
  let best = null;
  for (let gi = 0; gi < cs.length; gi++) {
    const base = build({ g: cs[gi].h }, { scheme: scheme ?? 'joyride' });
    const rest = cs.filter((_, i) => i !== gi);
    const slots = ['strang', 'tower0', 'leafMid'];
    const perms = rest.length === 2 ? [[0, 1], [1, 0], [0, 2], [2, 0], [1, 2], [2, 1]] : rest.length === 1 ? [[0], [1], [2]] : [[]];
    for (const p of perms) {
      const fixed = { top: cs[gi].hex }, hues = { g: cs[gi].h };
      let cost = deltaE(cs[gi].hex, base.flat.top);
      rest.forEach((c, i) => { const slot = slots[p[i]]; fixed[slot] = c.hex; hues[slot === 'strang' ? 's' : slot === 'tower0' ? 't' : 'leaf'] = c.h; cost += deltaE(c.hex, base.flat[slot]); });
      if (!best || cost < best.cost) best = { cost, fixed, hues };
    }
  }
  const out = build(best.hues, { scheme: scheme ?? 'joyride', fixed: best.fixed, seed });
  return { ...out, source: { type: 'colors', colors, assigned: best.fixed } };
}

/** Story-Modes V-292 (Website): dunkel / satt */
export const STORY_MODES = {
  tragic: { label: 'Tragic', dunkel: '#34576b', satt: '#3e6a83' },
  comic: { label: 'Comic', dunkel: '#5e6f33', satt: '#7a8d4a' },
  absurd: { label: 'Absurd', dunkel: '#b8901c', satt: '#e9c14a' },
  heroic: { label: 'Heroic', dunkel: '#b35e22', satt: '#d97c3a' },
  mystical: { label: 'Mystical', dunkel: '#5b4470', satt: '#6b4e7d' },
  forbidden: { label: 'Forbidden', dunkel: '#8f3a60', satt: '#a64670' },
};
/**
 * Spiel-Palette aus einem Story-Mode: Farbton der Website-Farbe wird Boden-Farbton (60 % der Welt tragen die Stimmung),
 * Helligkeit und Buntheit kommen aus der J17-Leiter (nicht aus der dunklen Website-Farbe). Die Website-Farben bleiben
 * als storyDunkel / storySatt im Ergebnis (Schrift, Linien, UI).
 */
export function fromStoryMode(id, seed = 0, scheme) {
  const m = STORY_MODES[id]; if (!m) throw new Error('Story-Mode unbekannt: ' + id);
  const h = (hexToOklch(m.dunkel).h + hexToOklch(m.satt).h) / 2;
  const p = fromHue(h, seed, scheme ?? 'joyride');
  return { ...p, source: { type: 'storyMode', id, label: m.label, hue: +h.toFixed(1), storyDunkel: m.dunkel, storySatt: m.satt } };
}

/** Analyse einer Rollen-Palette (J17-/palettes.ts-Form): OKLCH je Rolle, Winkel zum Boden, Stufen */
export function analyse(p) {
  const flat = {};
  const add = (k, v) => { if (Array.isArray(v)) v.forEach((x, i) => add(k + i, x)); else if (typeof v === 'string' && v[0] === '#') flat[k] = v; };
  for (const [k, v] of Object.entries(p.roles ?? p)) add(k, v);
  const g = hexToOklch(flat.top ?? flat.table ?? Object.values(flat)[0]).h;
  const tier = c => c >= 0.145 ? 'pop' : c >= 0.09 ? 'feld' : c >= 0.05 ? 'ruhe' : 'neutral';
  const step = L => L >= 0.86 ? 'creme' : L >= 0.74 ? 'hell' : L >= 0.56 ? 'mitte' : 'dunkel';
  const rows = Object.fromEntries(Object.entries(flat).map(([k, hex]) => { const o = hexToOklch(hex); const cu = cusp(o.h);
    return [k, { hex, L: +o.L.toFixed(3), C: +o.C.toFixed(3), h: +o.h.toFixed(1), dhGround: +dHue(o.h, g).toFixed(1), relC: +(o.C / Math.max(1e-6, maxChroma(o.L, o.h))).toFixed(2), cuspL: +cu.L.toFixed(2), stufe: step(o.L), buntheit: tier(o.C) }]; }));
  return { groundHue: +g.toFixed(1), rows };
}
