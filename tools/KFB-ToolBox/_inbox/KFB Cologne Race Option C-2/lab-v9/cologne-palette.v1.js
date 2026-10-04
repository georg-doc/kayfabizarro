// KFB Cologne Race · Farbpaletten
//
// Eine Palette ist ab hier ein DATENSATZ, kein Satz Literale im Code. Die
// gemessene Option-C-Palette (option-c-style.v1.js) bleibt der ANKER: sie liefert
// fuer jede Rolle Helligkeit, Buntheit und den Farbwinkel relativ zu ihrer Familie.
// Eine erzeugte Palette dreht die FAMILIEN auf ein Harmonieschema, behaelt aber
// Helligkeit und Buntheit der Messung — deshalb bleibt der Kontrast erhalten und
// die Welt liest sich wie Option C, nur in einem anderen Ton.
//
// Rechnung in OKLCH, nicht in HSL. In HSL springt die wahrgenommene Helligkeit
// beim Drehen des Farbwinkels (Gelb hell, Blau dunkel bei gleichem L) — genau das
// zerstoert Lesbarkeit. In OKLab ist L wahrnehmungsgleich, also traegt eine
// gedrehte Palette dieselben Kontraste wie die gemessene.
//
// JSON ist der Vertrag: export/import, ein Feld je Rolle, Zonen benannt. Damit
// kann ein spaeterer KFB Track/Zone Editor dieselben Dateien schreiben, und ein
// Karten- oder Zonen-Seed erzeugt reproduzierbar dieselbe Palette.

import { C, BUILDING_TONES, ROOF_TONES } from './option-c-style.v1.js';

export const PALETTE_SCHEMA = 'kfb-palette/v1';

// --------------------------------------------------------------- Farbrechnung
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const srgbToLin = u => (u <= 0.04045 ? u / 12.92 : Math.pow((u + 0.055) / 1.055, 2.4));
const linToSrgb = u => (u <= 0.0031308 ? u * 12.92 : 1.055 * Math.pow(u, 1 / 2.4) - 0.055);

function rgbToOklab(r, g, b) {
  const R = srgbToLin(r), G = srgbToLin(g), B = srgbToLin(b);
  const l = Math.cbrt(0.4122214708 * R + 0.5363325363 * G + 0.0514459929 * B);
  const m = Math.cbrt(0.2119034982 * R + 0.6806995451 * G + 0.1073969566 * B);
  const s = Math.cbrt(0.0883024619 * R + 0.2817188376 * G + 0.6299787005 * B);
  return [
    0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s
  ];
}

function oklabToRgb(L, a, bb) {
  const l3 = L + 0.3963377774 * a + 0.2158037573 * bb;
  const m3 = L - 0.1055613458 * a - 0.0638541728 * bb;
  const s3 = L - 0.0894841775 * a - 1.2914855480 * bb;
  const l = l3 * l3 * l3, m = m3 * m3 * m3, s = s3 * s3 * s3;
  return [
    linToSrgb(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    linToSrgb(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    linToSrgb(-0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s)
  ];
}

export function numToOklch(num) {
  const r = ((num >> 16) & 255) / 255, g = ((num >> 8) & 255) / 255, b = (num & 255) / 255;
  const [L, a, bb] = rgbToOklab(r, g, b);
  return { L, C: Math.hypot(a, bb), h: (Math.atan2(bb, a) * 180 / Math.PI + 360) % 360 };
}

// Rueckweg mit Gamut-Ruecknahme: die Buntheit wird gesenkt, bis die Farbe in sRGB
// liegt. Helligkeit und Winkel bleiben — sie tragen Kontrast und Identitaet.
export function oklchToNum(L, Ch, h) {
  const rad = h * Math.PI / 180;
  let c = Math.max(0, Ch);
  let rgb = null;
  for (let i = 0; i < 26; i++) {
    rgb = oklabToRgb(clamp(L, 0, 1), Math.cos(rad) * c, Math.sin(rad) * c);
    if (rgb.every(v => v >= -0.002 && v <= 1.002)) break;
    c *= 0.9;
  }
  const q = rgb.map(v => Math.round(clamp(v, 0, 1) * 255));
  return (q[0] << 16) | (q[1] << 8) | q[2];
}

export const numToHex = v => '#' + (v >>> 0).toString(16).padStart(6, '0');
export const hexToNum = s => parseInt(String(s).replace('#', ''), 16) >>> 0;
const oklchToHex = (L, c, h) => numToHex(oklchToNum(L, c, h));

function mulberry32(seed) {
  let a = (seed >>> 0) || 1;
  return function () {
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ------------------------------------------------------------------- Zonen
// Eine Zone ist eine Farbfamilie der Welt. Sie haelt ihre Rollen zusammen und
// bekommt EINEN Platz im Harmonieschema — dadurch bleibt Fahrbahn Fahrbahn und
// Bauwerk Bauwerk, egal welcher Grundton gewuerfelt wird.
export const ZONES = {
  surface:   { label: 'Fahrbahn',   anchor: 0, roles: ['bed', 'bedDark', 'bedLight', 'bedFar'] },
  water:     { label: 'Wasser',     anchor: 0, roles: ['water', 'waterDeep', 'waterFoam'] },
  structure: { label: 'Bauwerk',    anchor: 1, roles: ['shoulder', 'shoulderHi', 'shoulderLo', 'structure', 'structureLo'] },
  sky:       { label: 'Himmel',     anchor: 2, roles: ['skyHighDay', 'skyMidDay', 'skyLowDay', 'skyHighDusk', 'skyMidDusk', 'skyLowDusk', 'sun', 'deep'] },
  markings:  { label: 'Markierung', anchor: 3, roles: ['lineYellow', 'lineOuter', 'lineGold', 'lineOrange', 'lineCream'] },
  accent:    { label: 'Akzent',     anchor: 3, roles: ['hot', 'hotSoft', 'gold', 'magenta', 'coral'] },
  city:      { label: 'Stadt',      anchor: 1, roles: [] }   // BUILDING_TONES / ROOF_TONES
};

// Harmonieschemata als Winkelabstaende zum Grundton. Vier Plaetze, weil die Welt
// vier Familien fuehrt: Fahrbahn, Bauwerk, Himmel, Akzent.
export const SCHEMES = {
  analog:        [0, 26, -32, 54],
  komplementaer: [0, 176, 22, -158],
  triade:        [0, 118, -124, 34],
  split:         [0, 152, -148, 26],
  tetrade:       [0, 88, 178, -92]
};

// Der Anker: die gemessene Palette, in OKLCH zerlegt, EINMAL beim Laden des
// Moduls — bevor applyPalette irgendetwas ueberschreibt.
const ROLE_NAMES = Object.values(ZONES).flatMap(z => z.roles);
const ANCHOR = {};
for (const r of ROLE_NAMES) ANCHOR[r] = numToOklch(C[r]);
const ANCHOR_BUILDING = BUILDING_TONES.map(numToOklch);
const ANCHOR_ROOF = ROOF_TONES.map(numToOklch);
const ANCHOR_NUMS = {};
for (const r of ROLE_NAMES) ANCHOR_NUMS[r] = C[r];
const ANCHOR_BUILDING_NUMS = BUILDING_TONES.slice();
const ANCHOR_ROOF_NUMS = ROOF_TONES.slice();

const dAngle = (a, b) => { let d = (a - b) % 360; if (d > 180) d -= 360; if (d < -180) d += 360; return d; };

// ------------------------------------------------------------- Erzeugung
export function makePalette(seed, opts = {}) {
  seed = (seed | 0) || 1;
  if (opts.measured) return measuredPalette();

  const rng = mulberry32(seed);
  const schemeNames = Object.keys(SCHEMES);
  const scheme = opts.scheme && SCHEMES[opts.scheme] ? opts.scheme : schemeNames[Math.floor(rng() * schemeNames.length)];
  const anchors = SCHEMES[scheme];
  const baseHue = opts.baseHueDeg != null ? opts.baseHueDeg : rng() * 360;
  // Stimmung: Buntheit und Helligkeit wandern gemeinsam, nicht je Rolle. Eine
  // Palette ist EINE Entscheidung, kein Rauschen auf 30 Werten.
  const chromaMood = +(0.84 + rng() * 0.40).toFixed(3);
  const lightMood = +(-0.035 + rng() * 0.07).toFixed(3);

  const zoneHue = {};
  for (const [key, z] of Object.entries(ZONES)) {
    zoneHue[key] = (baseHue + anchors[z.anchor] + (rng() - 0.5) * 10 + 360) % 360;
  }
  // Markierungen sind Verkehrszeichen, keine freie Farbwahl. Georgs Vorgabe:
  // Mittelstreifen gelb, Aussenstreifen orange-gelb. Die Familie darf wandern,
  // aber nur im Band Gelb..Orange um den gemessenen Gelbton: nach warm 30 Grad,
  // nach kalt nur 12 — sonst steht eine grüne oder blaue Linie auf der Strasse
  // und niemand liest sie als Fahrbahnmarkierung.
  const markAnchor = ANCHOR.lineYellow.h;
  zoneHue.markings = (markAnchor + clamp(dAngle(zoneHue.markings, markAnchor), -30, 12) + 360) % 360;

  const roles = {};
  const lch = {};
  for (const [key, z] of Object.entries(ZONES)) {
    if (!z.roles.length) continue;
    const lead = ANCHOR[z.roles[0]];
    for (const r of z.roles) {
      const a = ANCHOR[r];
      // Der Winkelabstand INNERHALB der Familie bleibt (gedaempft), damit die
      // Familie zusammenhaelt und ihre inneren Kontraste nicht kippen.
      const h = (zoneHue[key] + dAngle(a.h, lead.h) * 0.8 + 360) % 360;
      const L = clamp(a.L + lightMood, 0.05, 0.97);
      const ch = a.C * chromaMood;
      lch[r] = { L, C: ch, h };
    }
  }

  // Lesbarkeitsboden fuer die Markierungen: eine Linie MUSS sich von der Fahrbahn
  // abheben, und zwar NACH OBEN — Fahrbahnfarbe ist Strassenfarbe, Markierung ist
  // Farbe. Gemessen wird in L, weil L wahrnehmungsgleich ist. Die Messung gibt
  // 0,28 Abstand (Fahrbahn 0,60 / Gold 0,88): das ist der Boden.
  // Erst die Fahrbahn deckeln, sonst bleibt fuer die Linien kein Platz.
  if (lch.bed.L > 0.62) {
    const drop = lch.bed.L - 0.62;
    for (const r of ZONES.surface.roles) lch[r].L = clamp(lch[r].L - drop, 0.05, 0.97);
  }
  const bedL = lch.bed.L;
  for (const r of ZONES.markings.roles) {
    lch[r].L = clamp(Math.max(lch[r].L, bedL + 0.28), 0.1, 0.95);
  }

  for (const r of ROLE_NAMES) roles[r] = oklchToHex(lch[r].L, lch[r].C, lch[r].h);

  const cityHue = zoneHue.city, surfHue = zoneHue.surface, accHue = zoneHue.accent;
  const pickHue = i => [cityHue, surfHue, cityHue, accHue][i % 4];
  const buildings = ANCHOR_BUILDING.map((a, i) =>
    oklchToHex(clamp(a.L + lightMood, 0.08, 0.92), a.C * chromaMood, (pickHue(i) + dAngle(a.h, ANCHOR_BUILDING[0].h) * 0.5 + 360) % 360));
  const roofs = ANCHOR_ROOF.map((a, i) =>
    oklchToHex(clamp(a.L + lightMood, 0.06, 0.9), a.C * chromaMood * 1.05, (zoneHue.sky + dAngle(a.h, ANCHOR_ROOF[0].h) * 0.6 + 360) % 360));

  return {
    schema: PALETTE_SCHEMA,
    id: opts.id || 'cologne-dom-loop',
    label: opts.label || ('Seed ' + seed),
    seed, scheme,
    baseHueDeg: +baseHue.toFixed(1),
    chromaMood, lightMood,
    zones: Object.fromEntries(Object.entries(ZONES).map(([k, z]) => [k, {
      label: z.label, hueDeg: +zoneHue[k].toFixed(1),
      roles: Object.fromEntries(z.roles.map(r => [r, roles[r]]))
    }])),
    roles,
    buildings, roofs,
    hud: buildHud(roles, lch, zoneHue)
  };
}

export function measuredPalette() {
  const roles = {};
  const lch = {};
  for (const r of ROLE_NAMES) { roles[r] = numToHex(ANCHOR_NUMS[r]); lch[r] = ANCHOR[r]; }
  const zoneHue = Object.fromEntries(Object.entries(ZONES).map(([k, z]) => [k, z.roles.length ? ANCHOR[z.roles[0]].h : ANCHOR.shoulder.h]));
  return {
    schema: PALETTE_SCHEMA, id: 'cologne-dom-loop', label: 'Gemessen · Tafel 01/02',
    seed: 0, scheme: 'gemessen',
    baseHueDeg: +ANCHOR.bed.h.toFixed(1), chromaMood: 1, lightMood: 0,
    zones: Object.fromEntries(Object.entries(ZONES).map(([k, z]) => [k, {
      label: z.label, hueDeg: +zoneHue[k].toFixed(1),
      roles: Object.fromEntries(z.roles.map(r => [r, roles[r]]))
    }])),
    roles,
    buildings: ANCHOR_BUILDING_NUMS.map(numToHex),
    roofs: ANCHOR_ROOF_NUMS.map(numToHex),
    hud: buildHud(roles, lch, zoneHue)
  };
}

// --------------------------------------------------------------------- HUD
// Das HUD erbt die Palette, es hat keine eigenen Literale mehr. Jede Rolle, die
// Text traegt, bekommt einen Helligkeitsboden gegen den Anthrazit-Grund
// (L 0,20): 0,66 liefert rund 4,6:1, 0,74 rund 6:1.
function buildHud(roles, lch, zoneHue) {
  const at = (role, minL, maxL) => {
    const a = lch[role];
    return oklchToHex(clamp(a.L, minL ?? 0, maxL ?? 1), a.C, a.h);
  };
  const panelL = 0.20;
  const panel = numToOklch(hexToNum(oklchToHex(panelL, 0.02, zoneHue.surface)));
  const p = oklabRgb(panelL, 0.02, zoneHue.surface);
  const ramp = [at('bedLight', 0.70), at('gold', 0.74), at('coral', 0.68), at('hot', 0.62)];
  return {
    ink: oklchToHex(0.96, 0.015, zoneHue.surface),
    line: at('lineCream', 0.80),
    cool: at('bedLight', 0.68),
    deep: at('deep', 0.14, 0.34),
    accent: at('lineGold', 0.78),
    yellow: at('lineYellow', 0.82),
    gold: at('gold', 0.72),
    hot: at('hot', 0.58),
    warm: at('coral', 0.66),
    magenta: at('magenta', 0.50),
    // Aktivflaechen tragen WEISSE Schrift, also ein Deckel auf L statt eines Bodens
    active: at('bedDark', 0.16, 0.42),
    activeWarm: at('skyHighDusk', 0.16, 0.42),
    panelRgb: p.join(','),
    panel: 'rgba(' + p.join(',') + ',0.82)',
    panelSoft: 'rgba(' + p.join(',') + ',0.60)',
    ramp,
    // Der Tacho braucht vier Stuetzstellen mit ihren Positionen (HUD v4 §3)
    rampStops: [0, 0.55, 0.78, 1].map((x, i) => ({ at: x, hex: ramp[i] })),
    panelL: +panel.L.toFixed(3)
  };
}

function oklabRgb(L, c, h) {
  const n = oklchToNum(L, c, h);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

// ------------------------------------------------------------- Anwenden / IO
// Die Welt liest ihre Farben aus C. Eine Palette wird deshalb IN C geschrieben,
// bevor Geometrie gebaut wird — kein zweiter Farbkanal nebenher.
export function applyPalette(p) {
  for (const r of ROLE_NAMES) if (p.roles && p.roles[r]) C[r] = hexToNum(p.roles[r]);
  if (p.buildings && p.buildings.length) BUILDING_TONES.splice(0, BUILDING_TONES.length, ...p.buildings.map(hexToNum));
  if (p.roofs && p.roofs.length) ROOF_TONES.splice(0, ROOF_TONES.length, ...p.roofs.map(hexToNum));
  return p;
}

export function exportPalette(p) { return JSON.stringify(p, null, 2); }

export function importPalette(src) {
  const p = typeof src === 'string' ? JSON.parse(src) : src;
  if (!p || p.schema !== PALETTE_SCHEMA) throw new Error('Palette: falsches Schema (' + (p && p.schema) + ')');
  if (!p.roles) throw new Error('Palette: roles fehlt');
  const missing = ROLE_NAMES.filter(r => !p.roles[r]);
  if (missing.length) throw new Error('Palette: Rollen fehlen · ' + missing.join(', '));
  if (!p.hud) {
    const lch = {}; for (const r of ROLE_NAMES) lch[r] = numToOklch(hexToNum(p.roles[r]));
    const zoneHue = Object.fromEntries(Object.entries(ZONES).map(([k, z]) => [k, z.roles.length ? lch[z.roles[0]].h : lch.shoulder.h]));
    p.hud = buildHud(p.roles, lch, zoneHue);
  }
  return p;
}

export const randomSeed = () => (Math.random() * 0x7fffffff) | 0;
