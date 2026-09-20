// ============================================================================
// terrain-surface.js — Radiale Auslenkung gegen die Basiskugel, 1:1 aus tinyskies
// ----------------------------------------------------------------------------
// Quelle: dannylimanseta/tinyskies, client/src/game/TerrainSurface.ts (und die identische
// Server-Kopie server/src/terrain/TerrainSurface.ts), gelesen 27.8.2026.
//
// **Der Satz, um den es geht, steht im Original ganz oben:**
//   „Single source of truth for radial surface displacement vs the base sphere radius.
//    Must match Globe mesh vertices and boat / prop placement."
//
// Genau diese Regel haben wir in der Raymarch-Fassung dreimal gebrochen (Höhe im Bild ≠ Höhe für
// Kollision ≠ Höhe für Kartenplatzierung). Hier ist sie die Bauform: EINE Funktion liefert die
// Auslenkung, und Mesh, Flugavatar und Kartenplätze fragen sie alle.
//
// tinyskies hält davon absichtlich zwei identische Kopien (Client und Server), weil beide Seiten
// dieselbe Zahl brauchen. Wir brauchen nur eine — aber die Lehre bleibt: wer die Formel kopiert,
// muss die Kopie bitgleich halten, sonst driften Bild und Spiel auseinander.
// ============================================================================

import {
  createNoise3D, sampleTerrainValue, terrainNoise,
  terrainElevationFromValue, terrainIsLand, terrainWaterDepthFromValue, smoothstep,
} from './simplex-noise.js';
import { biomeReliefAt } from './globe-biome.js';   // v3 · S3c · Relief und Rauheit je Domäne

export const MOUNTAIN_HEIGHT = 0.52;
export const PROP_TERRAIN_SINK = 0.018;
const LAND_HEIGHT = 0.02;
const OCEAN_DEPTH = 0.01;

// `createNoise3D` ist teuer im Aufbau — cachen. Original-Notiz: „Globe calls displacement
// ~260k× per load". Bei 256×256 Segmenten sind das genau die Größenordnungen.
const noiseFnBySeed = new Map();
function noiseForSeed(seed) {
  let n = noiseFnBySeed.get(seed);
  if (!n) { n = createNoise3D(seed); noiseFnBySeed.set(seed, n); }
  return n;
}

// **Die Zacken sitzen nur auf den Gipfeln.** `peakMask` blendet erst ab Höhe 0,52 ein — dadurch
// bleiben Küsten und Ebenen ruhig, und das Gebirge wird schroff. Ein globaler Rauschaufschlag
// hätte dieselben Kosten und würde die ganze Kugel unruhig machen.
// v3 · S3c: `relief` und `rough` kommen aus der Biom-Mischung (1/1 = quellentreu). Das ist die
// zweite Hälfte der Domänen — das FELD entscheidet, WO Land ist, die Auslenkung, WIE es aussieht:
// Plateau flach und ruhig, Spires hoch und zackig. Beides aus derselben Gewichtung, also stimmen
// Mesh und Physik weiter überein.
function landDisplacement(nx, ny, nz, elevation, ruggedNoise) {
  const rugged = terrainNoise(ruggedNoise, nx, ny, nz, 5, 2.2, 0.5, 7.0);
  const r01 = (rugged + 1) * 0.5;
  const peakMask = Math.pow(smoothstep(0.52, 0.86, elevation), 1.35);
  const bio = biomeReliefAt(nx, ny, nz);
  const jagged = 1 + 0.38 * bio.rough * Math.pow(r01, 1.2) * peakMask;
  const micro = 0.06 * bio.rough * rugged * elevation * peakMask;
  return LAND_HEIGHT + elevation * MOUNTAIN_HEIGHT * bio.relief * jagged + micro;
}

export function surfaceDisplacementFromValue(seed, type, nx, ny, nz, value, ruggedNoise) {
  const roh = rawDisplacementFromValue(seed, type, nx, ny, nz, value, ruggedNoise);
  // ⚠ **Bauplätze planieren nur LAND. Und das ist der geometrische Grund für „Wasser auf Hügeln".**
  // `zoneBlend` ist UNSERE Zutat (v3 · S3a, Bauplätze für Landmarken) — `TerrainSurface.ts` hat
  // nichts Vergleichbares. Sie wurde auf JEDEN Vertex angewandt, ohne zu fragen, ob er Land oder
  // Wasser ist. `rawDisplacementFromValue` gibt für Wasser immer `-OCEAN_DEPTH * depth`, also
  // ≤ 0 — **eine positive Wasserhöhe kann rechnerisch nur aus `zoneBlend` kommen.**
  // Gemessen am fertigen Netz: 365 Wasser-Vertices (0,9 %) über `LAND_HEIGHT` (0,02), Maximum
  // **+0,1207**, und 19 davon vollständig von Land eingeschlossen — der höchste bei +0,1014,
  // während seine vier Landnachbarn im Mittel bei +0,0994 liegen. Ein Wasser-Vertex auf
  // Hügelkuppenhöhe.
  // Die Bildfolge daraus: der Vertex trägt `landFlag = 0`, die halbe Raute um ihn läuft also durch
  // den Wasser-Zweig; und `oceanDepth` klemmt auf 0,001, weil die Verschiebung positiv ist —
  // `depthFade` wird dadurch **1,0**, und die Kontour-Gischt malt bei voller Helligkeit. Auf einen
  // Berg. Das Land-Bit hat das großflächige Bluten behoben; einen Vertex, der WIRKLICH als Wasser
  // auf Kuppenhöhe klassifiziert ist, kann es nicht retten.
  // Nach §05q gibt unsere Seite nach: die Quelle kennt diese Planierung nicht, also darf sie den
  // Wasserstand nicht anheben. Ein Bauplatz im Meer ist auch inhaltlich keiner.
  if (!terrainIsLand(type, value)) return roh;
  return zoneBlend(nx, ny, nz, roh);
}

/** Die Auslenkung OHNE Zonen — die Zonenplanung selbst muss sie lesen, sonst rechnet sie
 *  gegen ihr eigenes Ergebnis. Alles andere nimmt die zonierte Fassung. */
export function rawDisplacementFromValue(seed, type, nx, ny, nz, value, ruggedNoise) {
  const rn = ruggedNoise || noiseForSeed(seed + 9001);
  if (terrainIsLand(type, value)) {
    const elevation = terrainElevationFromValue(type, value);
    return landDisplacement(nx, ny, nz, elevation, rn);
  }
  const depth = terrainWaterDepthFromValue(type, value);
  return -OCEAN_DEPTH * depth;
}

export function rawDisplacementAt(seed, type, nx, ny, nz) {
  const value = sampleTerrainValue(seed, type, nx, ny, nz);
  return rawDisplacementFromValue(seed, type, nx, ny, nz, value, noiseForSeed(seed + 9001));
}

export function surfaceDisplacementAt(seed, type, nx, ny, nz) {
  const value = sampleTerrainValue(seed, type, nx, ny, nz);
  return surfaceDisplacementFromValue(seed, type, nx, ny, nz, value, noiseForSeed(seed + 9001));
}

/** Alias wie im Original: dieselbe Zahl ist die Flughöhe über der Basiskugel. */
export const surfaceAltitudeAt = surfaceDisplacementAt;
export { noiseForSeed };

// ============================================================================
// v3 · S3a · ZONEN — und zwar HIER, nicht als Mesh obendrauf
// ----------------------------------------------------------------------------
// Georg (29.8.): Assets stehen mit dem Sockel frei im Gelände; gefragt sind Zonen, die „groß
// genug, gerade (leicht schräg ist ok) und sauber eingepasst" sind.
//
// **Warum die Zone in DIESE Datei gehört und nicht in ein Plateau-Mesh:** der Kopfsatz der
// Quelle sagt es — *„single source of truth for radial surface displacement … must match Globe
// mesh vertices and boat / prop placement"*. Eine aufgelegte Scheibe kennt die Flugphysik nicht:
// sie liest diese Funktion, also flöge die Karte durch das Plateau. Das wäre eine zweite
// Höhenwahrheit (Fehlerklasse 1). Steht die Zone im Höhenfeld, stimmen Mesh, Physik, Props,
// Schatten und später die Kartenplätze **automatisch** überein — dieselbe Idee wie `zoneTopAt`
// im Card Zone Lab: EINE Rechnung, aus der alles seine Höhe zieht.
//
// Eine Zone ist: Mittelrichtung (Einheitsvektor), Winkelradius, Zielhöhe, Rampenbreite, und
// optional eine leichte Neigung (zwei Gradienten im Tangentialrahmen). Geblendet wird im
// COSINUS des Winkels — dann kostet die Abfrage ein Skalarprodukt je Zone und keinen acos.
//
// ⚠ Zonen müssen VOR dem Bake des Globus stehen (256² = 66k Vertices, einmal gerechnet).
// Wer sie später ändert, braucht einen Neubau — deshalb ist die Liste absichtlich stumpf:
// setzen, nicht nachregeln.
// ============================================================================

const ZONES = [];

/** @param list [{ n:Vector3-ähnlich {x,y,z}, radius, ramp, height, tiltU, tiltV, ex, ev }] */
export function setTerrainZones(list) {
  ZONES.length = 0;
  for (const z of (list || [])) {
    const L = Math.hypot(z.n.x, z.n.y, z.n.z) || 1;
    const nx = z.n.x / L, ny = z.n.y / L, nz = z.n.z / L;
    const r = Math.max(1e-4, z.radius);
    const ramp = Math.max(1e-4, z.ramp != null ? z.ramp : r * 0.9);
    ZONES.push({
      nx, ny, nz, height: z.height,
      cosInner: Math.cos(r), cosOuter: Math.cos(r + ramp),
      tiltU: z.tiltU || 0, tiltV: z.tiltV || 0,
      ex: z.ex || null, ev: z.ev || null,
    });
  }
  return ZONES.length;
}
export function terrainZoneCount() { return ZONES.length; }
export function terrainZones() { return ZONES; }

function zoneBlend(nx, ny, nz, base) {
  if (!ZONES.length) return base;
  let out = base;
  for (let i = 0; i < ZONES.length; i++) {
    const z = ZONES[i];
    const d = nx * z.nx + ny * z.ny + nz * z.nz;
    if (d <= z.cosOuter) continue;
    const w = smoothstep(z.cosOuter, z.cosInner, d);
    let ziel = z.height;
    // Leichte Neigung: der tangentiale Versatz in den zwei Zonenachsen, mal Gradient. Ohne sie
    // wäre jede Zone eine Tischplatte im Gebirge — Georg: „leicht schräg ist ok".
    if (z.ex && (z.tiltU || z.tiltV)) {
      const u = nx * z.ex.x + ny * z.ex.y + nz * z.ex.z;
      const v = nx * z.ev.x + ny * z.ev.y + nz * z.ev.z;
      ziel += z.tiltU * u + z.tiltV * v;
    }
    out = out + (ziel - out) * w;
  }
  return out;
}
