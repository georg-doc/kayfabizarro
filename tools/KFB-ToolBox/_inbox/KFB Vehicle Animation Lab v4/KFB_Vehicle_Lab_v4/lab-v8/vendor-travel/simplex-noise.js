// ============================================================================
// simplex-noise.js — 3D-Simplex-Rauschen, 1:1 aus tinyskies
// ----------------------------------------------------------------------------
// Quelle: dannylimanseta/tinyskies, client/src/game/SimplexNoise.ts
// (Branch cursor/globefly-multiplayer-globe-flight-game, gelesen 27.8.2026).
// Algorithmus public domain, Stefan Gustavson. Aus TypeScript nach JS übertragen,
// Zeile für Zeile, ohne Änderung an Konstanten oder Reihenfolge.
//
// **Warum 3D und nicht 2D:** die Welt ist eine KUGEL. Ein Höhenfeld über einer Ebene braucht
// Kacheln, LOD-Ringe und einen Horizont, den man streamen muss — und genau daran ist die
// Raymarch-Fassung in der Nacht vom 26./27.8. gescheitert (acht Nähte, siehe SPRINT_planets-v1).
// Auf einer Kugel gibt es keinen Horizont zum Streamen: das Rauschen wird auf der Einheitskugel
// abgetastet, das Mesh ist EINE geschlossene Fläche, und Nähte können gar nicht entstehen.
// ============================================================================

const GRAD3 = [
  [1, 1, 0], [-1, 1, 0], [1, -1, 0], [-1, -1, 0],
  [1, 0, 1], [-1, 0, 1], [1, 0, -1], [-1, 0, -1],
  [0, 1, 1], [0, -1, 1], [0, 1, -1], [0, -1, -1],
];

const F3 = 1 / 3;
const G3 = 1 / 6;

function buildPermutation(seed) {
  const p = new Uint8Array(256);
  for (let i = 0; i < 256; i++) p[i] = i;
  let s = seed | 0;
  for (let i = 255; i > 0; i--) {
    s = (s * 16807 + 0) % 2147483647;
    const j = s % (i + 1);
    const tmp = p[i]; p[i] = p[j]; p[j] = tmp;
  }
  const perm = new Uint8Array(512);
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255];
  return perm;
}

export function createNoise3D(seed) {
  const perm = buildPermutation(seed);
  return function (x, y, z) {
    const s = (x + y + z) * F3;
    const i = Math.floor(x + s), j = Math.floor(y + s), k = Math.floor(z + s);
    const t = (i + j + k) * G3;
    const x0 = x - (i - t), y0 = y - (j - t), z0 = z - (k - t);
    let i1, j1, k1, i2, j2, k2;
    if (x0 >= y0) {
      if (y0 >= z0) { i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 1; k2 = 0; }
      else if (x0 >= z0) { i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 0; k2 = 1; }
      else { i1 = 0; j1 = 0; k1 = 1; i2 = 1; j2 = 0; k2 = 1; }
    } else {
      if (y0 < z0) { i1 = 0; j1 = 0; k1 = 1; i2 = 0; j2 = 1; k2 = 1; }
      else if (x0 < z0) { i1 = 0; j1 = 1; k1 = 0; i2 = 0; j2 = 1; k2 = 1; }
      else { i1 = 0; j1 = 1; k1 = 0; i2 = 1; j2 = 1; k2 = 0; }
    }
    const x1 = x0 - i1 + G3, y1 = y0 - j1 + G3, z1 = z0 - k1 + G3;
    const x2 = x0 - i2 + 2 * G3, y2 = y0 - j2 + 2 * G3, z2 = z0 - k2 + 2 * G3;
    const x3 = x0 - 1 + 3 * G3, y3 = y0 - 1 + 3 * G3, z3 = z0 - 1 + 3 * G3;
    const ii = i & 255, jj = j & 255, kk = k & 255;
    let n = 0;
    let t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0;
    if (t0 > 0) { t0 *= t0; const g = GRAD3[perm[ii + perm[jj + perm[kk]]] % 12]; n += t0 * t0 * (g[0] * x0 + g[1] * y0 + g[2] * z0); }
    let t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1;
    if (t1 > 0) { t1 *= t1; const g = GRAD3[perm[ii + i1 + perm[jj + j1 + perm[kk + k1]]] % 12]; n += t1 * t1 * (g[0] * x1 + g[1] * y1 + g[2] * z1); }
    let t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2;
    if (t2 > 0) { t2 *= t2; const g = GRAD3[perm[ii + i2 + perm[jj + j2 + perm[kk + k2]]] % 12]; n += t2 * t2 * (g[0] * x2 + g[1] * y2 + g[2] * z2); }
    let t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3;
    if (t3 > 0) { t3 *= t3; const g = GRAD3[perm[ii + 1 + perm[jj + 1 + perm[kk + 1]]] % 12]; n += t3 * t3 * (g[0] * x3 + g[1] * y3 + g[2] * z3); }
    return 32 * n;
  };
}

export function terrainNoise(noise, x, y, z, octaves, lacunarity, persistence, scale) {
  let value = 0, amplitude = 1, frequency = scale, maxAmplitude = 0;
  for (let o = 0; o < octaves; o++) {
    value += noise(x * frequency, y * frequency, z * frequency) * amplitude;
    maxAmplitude += amplitude;
    amplitude *= persistence;
    frequency *= lacunarity;
  }
  return value / maxAmplitude;
}

/* ══ Presets — 1:1 aus TerrainPresets.ts ═══════════════════════════════════ */
const TERRAIN_PRESETS = {
  default:     { scale: 1.5, octaves: 4, lacunarity: 2.05, persistence: 0.48, threshold: 0.0,   oceanBackboneWidth: 0.10, oceanBackboneStrength: 0.22 },
  archipelago: { scale: 3.0, octaves: 4, lacunarity: 2.2,  persistence: 0.45, threshold: 0.2,   oceanBackboneWidth: 0.09, oceanBackboneStrength: 0.14 },
  pangaea:     { scale: 0.8, octaves: 3, lacunarity: 2.0,  persistence: 0.54, threshold: -0.15, oceanBackboneWidth: 0.16, oceanBackboneStrength: 0.26 },
  waterworld:  { scale: 2.5, octaves: 3, lacunarity: 2.0,  persistence: 0.4,  threshold: 0.35,  oceanBackboneWidth: 0.08, oceanBackboneStrength: 0.08 },
};
export const TERRAIN_TYPES = Object.keys(TERRAIN_PRESETS);
export function getTerrainParams(type) {
  return TERRAIN_PRESETS[type] || TERRAIN_PRESETS.default;
}

/* ══ Feld, Ozean-Rückgrat, Land/Wasser — 1:1 aus SimplexNoise.ts ══════════ */
const terrainNoiseBySeed = new Map();
const backboneAxesBySeed = new Map();

function cachedNoise3D(seed) {
  let n = terrainNoiseBySeed.get(seed);
  if (!n) { n = createNoise3D(seed); terrainNoiseBySeed.set(seed, n); }
  return n;
}
function seededRandom(seed) {
  let s = (seed >>> 0) || 1;
  return () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 0x100000000; };
}
function smoothstep(min, max, x) {
  if (x <= min) return 0;
  if (x >= max) return 1;
  const t = (x - min) / (max - min);
  return t * t * (3 - 2 * t);
}
const dotV = (ax, ay, az, b) => ax * b.x + ay * b.y + az * b.z;
const crossV = (a, b) => ({ x: a.y * b.z - a.z * b.y, y: a.z * b.x - a.x * b.z, z: a.x * b.y - a.y * b.x });
function normV(v) {
  const l = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z) || 1;
  return { x: v.x / l, y: v.y / l, z: v.z / l };
}
function randomUnitVector(rand) {
  const z = rand() * 2 - 1, theta = rand() * Math.PI * 2;
  const r = Math.sqrt(Math.max(0, 1 - z * z));
  return { x: Math.cos(theta) * r, y: z, z: Math.sin(theta) * r };
}

// **Das Ozean-Rückgrat ist der Trick, der die Kontinente lesbar macht.** Drei Großkreis-Achsen je
// Seed; entlang ihrer Bänder wird der Feldwert abgesenkt. Ohne das ist eine Rauschkugel ein
// gleichmäßiger Fleckenteppich — mit ihm bekommt sie Ozeane, die trennen, und Landmassen, die
// zusammenhängen. Das ist der Unterschied zwischen Rauschen und Geographie.
function backboneAxesForSeed(seed) {
  let axes = backboneAxesBySeed.get(seed);
  if (axes) return axes;
  const rand = seededRandom((seed ^ 0x9e3779b9) >>> 0);
  const axisA = randomUnitVector(rand);
  let helper = randomUnitVector(rand);
  if (Math.abs(dotV(axisA.x, axisA.y, axisA.z, helper)) > 0.92) {
    helper = Math.abs(axisA.y) < 0.9 ? { x: 0, y: 1, z: 0 } : { x: 1, y: 0, z: 0 };
  }
  let axisPerp = crossV(axisA, helper);
  if (axisPerp.x === 0 && axisPerp.y === 0 && axisPerp.z === 0) axisPerp = crossV(axisA, { x: 0, y: 1, z: 0 });
  axisPerp = normV(axisPerp);
  const spread = 0.95 + rand() * 0.45;
  const ss = Math.sin(spread), cs = Math.cos(spread);
  const axisB = normV({ x: axisA.x * cs + axisPerp.x * ss, y: axisA.y * cs + axisPerp.y * ss, z: axisA.z * cs + axisPerp.z * ss });
  const axisC = normV({ x: axisA.x * cs - axisPerp.x * ss, y: axisA.y * cs - axisPerp.y * ss, z: axisA.z * cs - axisPerp.z * ss });
  axes = [axisA, axisB, axisC];
  backboneAxesBySeed.set(seed, axes);
  return axes;
}

function oceanBackboneMask(seed, params, nx, ny, nz) {
  if (params.oceanBackboneStrength <= 0 || params.oceanBackboneWidth <= 0) return 0;
  const innerWidth = params.oceanBackboneWidth, outerWidth = innerWidth * 1.9;
  let mask = 0;
  for (const axis of backboneAxesForSeed(seed)) {
    const dist = Math.abs(dotV(nx, ny, nz, axis));
    const band = 1 - smoothstep(innerWidth, outerWidth, dist);
    if (band > mask) mask = band;
  }
  return mask;
}

// ── v3 · S3c · EIN Haken für Biom-Domänen (die einzige Änderung an diesem 1:1-Port) ────────
// `globe-biome.js` hängt sich hier ein und liefert je Probe einen gemischten Parametersatz.
// **Der Haken sitzt bewusst HIER und nicht bei den Lesern:** Mesh, Flugphysik, Zonen, Props,
// Schatten und Karten fragen alle über diese eine Funktion — ein Haken heißt EINE Wahrheit.
// Ein Umschalten in jedem Leser wäre Fehlerklasse 1 (zwei Verwalter derselben Sache).
// ⚠ Der Haken darf `threshold` NICHT verändern: `terrainIsLand` & Co. kennen keine Position.
let biomeFieldHook = null;
export function setBiomeFieldHook(fn) { biomeFieldHook = fn || null; }

// ── v10 · Der ZWEITE und letzte Haken: ein Zuschlag auf den WERT ──────────────────────
// Der Biom-Haken oben ändert, WIE geraucht wird (Oktaven, Skala) — er kann nicht sagen, WO Land
// liegt. Genau das braucht die Weltbau-Werkbank: eine Vorlage (die Erde) soll die Kontinente
// setzen, ohne dem Rauschen die Küsten wegzunehmen.
// **Warum das kein dritter Rechner ist:** der Zuschlag steht in derselben Rechnung und derselben
// Einheit wie `oceanBackboneMask` direkt darunter — ein positionsabhängiger Term auf dem
// Feldwert, mehr nicht. Die Schwelle bleibt unberührt, also bleibt `terrainIsLand` der eine
// Richter über Land und Wasser. Ohne gesetzten Haken ist die Welt Zeichen für Zeichen die alte.
let kontinentHook = null;
export function setKontinentHook(fn) { kontinentHook = fn || null; }

function sampleTerrainFieldValue(seed, type, nx, ny, nz) {
  const base = getTerrainParams(type);
  const params = biomeFieldHook ? biomeFieldHook(base, nx, ny, nz) : base;
  const rawValue = terrainNoise(cachedNoise3D(seed), nx, ny, nz,
    params.octaves, params.lacunarity, params.persistence, params.scale);
  const roh2 = rawValue - oceanBackboneMask(seed, params, nx, ny, nz) * params.oceanBackboneStrength;
  // ⚠ **v10 · Die weiche Decke — nur wenn eine Vorlage im Spiel ist.**
  // `terrainElevationFromValue` verspricht 0…1, und die Abnahme hat gemessen, dass ein Zuschlag
  // diesen Vertrag bricht (2,28 bei voller Erd-Treue). Wer den Vertrag bricht, verschiebt
  // stillschweigend jede Schwelle, die daran hängt — das Hochland-Prädikat der Vulkane, die
  // Mesh-Höhe, die Biomfarben. Also wird oben gedeckelt, aber WEICH: bis 0,78 bleibt jeder Wert
  // unangetastet (dort spielt sich alles ab, was die Vorlage nicht anfasst), darüber nähert er
  // sich 1 an, ohne es zu erreichen. Ein harter Schnitt bei 1 hätte stattdessen Plateaus
  // gemacht: alles über der Grenze wäre gleich hoch, und Gebirge sähen aus wie Tischplatten.
  // Ohne Vorlage ist diese Zeile ein `+ 0` — die alte Welt bleibt Zeichen für Zeichen dieselbe.
  let value = roh2;
  if (kontinentHook) {
    // ⚠ **Die Schwelle wird MITGEGEBEN, und zwar die des Presets, nicht die der Biom-Parameter.**
    // Genau diese Zahl benutzt `terrainIsLand` als Richter — ein Zuschlag, der gegen eine andere
    // rechnet, wäre ein zweiter Maßstab für dieselbe Entscheidung.
    // Die Abnahme hat gezeigt, warum das nötig ist: derselbe absolute Zuschlag trifft jede
    // Schwelle anders — unter der Erd-Maske wurde `pangaea` (Schwelle −0,15) zur wasserreichsten
    // Welt und `waterworld` (0,35) zur landreichsten. Die Rangfolge der Sorten stand auf dem Kopf.
    value += kontinentHook(nx, ny, nz, getTerrainParams(type).threshold);
    const K = 0.78;
    if (value > K) value = K + (1 - K) * (1 - Math.exp(-(value - K) / (1 - K)));
  }
  return { params, rawValue, value };
}

export function terrainIsLand(type, value) { return value > getTerrainParams(type).threshold; }
export function terrainElevationFromValue(type, value) {
  const p = getTerrainParams(type);
  if (value <= p.threshold) return 0;
  return (value - p.threshold) / (1 - p.threshold);
}
export function terrainWaterDepthFromValue(type, value) {
  const p = getTerrainParams(type);
  if (value > p.threshold) return 0;
  return Math.min(1, (p.threshold - value) * 4);
}
export function sampleTerrainValue(seed, type, nx, ny, nz) {
  return sampleTerrainFieldValue(seed, type, nx, ny, nz).value;
}
export function sampleTerrain(seed, type, nx, ny, nz) {
  const s = sampleTerrainFieldValue(seed, type, nx, ny, nz);
  return {
    rawValue: s.rawValue, value: s.value,
    isLand: s.value > s.params.threshold,
    elevation: terrainElevationFromValue(type, s.value),
    waterDepth: terrainWaterDepthFromValue(type, s.value),
  };
}
export { smoothstep };
