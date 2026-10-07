// Stage-5 world layer: final forest density per cell (pure function of seed + earlier stages).
//
// Rules (see NOTES.md):
//  - 0 on water, coast, roads, rivers, bridges, village/building/reserved cells, rock/mountain cells, fields/squares.
//  - Forests are clusters: density = smoothstep over the terrain's broad forest potential, nudged by a per-height-level
//    offset noise so forest edges snap to cliff lines (one plateau wooded, the next one open), with clearings carved by a
//    mid-frequency noise. Core cells reach 1, the rim falls off to ~0.15 → placement thins out toward the edge.
//  - Next to villages a forest is capped (≤ 0.45), next to roads slightly thinned.
//  - Meadows (density 0) get rare copses (tag `copse`) and lone trees (tag `lone_tree`), more often near forest outliers
//    and only in "parkland" regions (low-frequency noise) — never an even sprinkle.
import type { CellData, WorldLayerCtx } from '../../core/types';
import { DIRS, hexToWorld } from '../../core/hex';
import { hash, rand01, simplex2, strSeed } from '../../core/rng';

export const NATURE_STAGE = 5;

/** Tags this layer writes. */
export const NTAG = {
  copse: 'copse',
  lone: 'lone_tree',
  edge: 'forest_edge',
  core: 'forest_core',
} as const;

const seeds = new Map<number, { level: number; clear: number; park: number; pick: number }>();
function seedsFor(seed: number) {
  let s = seeds.get(seed);
  if (!s)
    seeds.set(
      seed,
      (s = {
        level: hash(seed, strSeed('nature.level')),
        clear: hash(seed, strSeed('nature.clear')),
        park: hash(seed, strSeed('nature.park')),
        pick: hash(seed, strSeed('nature.pick')),
      }),
    );
  return s;
}

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/** Cells nature never plants on (structure / water / rock). Reads the cell as seen by earlier stages. */
export function blocked(c: Readonly<CellData>): boolean {
  if (c.water || c.coastMask !== 0 || c.roadMask !== 0 || c.riverMask !== 0 || c.bridge) return true;
  if (c.village || c.building || c.reserved) return true;
  if (c.biome === 'mountain') return true;
  for (const t of c.tags) if (t === 'rock' || t === 'mountain' || t === 'field' || t === 'square' || t === 'lake') return true;
  return false;
}

const shifts = new Map<number, number>();
/**
 * Per-seed calibration (pure function of the seed): terrain's forest potential varies a lot between seeds (seed 42 had
 * only small stands). Shift the density ramp so that ≈ 38 % of the open land within ~90 cells of the origin is forest.
 */
function coverageShift(seed: number, ctx: WorldLayerCtx | null): number {
  let v = shifts.get(seed);
  if (v !== undefined) return v;
  if (!ctx) return 0;
  const vals: number[] = [];
  for (let r = -90; r <= 90; r += 6)
    for (let q = -90 - Math.floor(r / 2); q <= 90 - Math.floor(r / 2); q += 6) {
      const c = ctx.cellAt(NATURE_STAGE, q, r);
      if (blocked(c)) continue;
      vals.push(c.forest + levelOffset(seed, c));
    }
  vals.sort((a, b) => a - b);
  const t = vals.length ? vals[Math.floor(vals.length * 0.62)] : 0.36;
  v = Math.max(-0.22, Math.min(0.08, t - 0.36));
  shifts.set(seed, v);
  return v;
}

/** Small per-level offset: neighbouring plateaus differ a little, but forest edges do not simply trace the cliffs. */
function levelOffset(seed: number, c: Readonly<CellData>): number {
  const p = hexToWorld(c.q, c.r);
  return 0.07 * simplex2(seedsFor(seed).level + c.level * 7919, p.x / 140, p.z / 140);
}

/** Raw cluster density of an (unblocked) cell from the terrain potential: 0..1, before neighbour modifiers. */
export function rawDensity(seed: number, c: Readonly<CellData>, potential: number, ctx: WorldLayerCtx | null = null): number {
  const S = seedsFor(seed);
  const p = hexToWorld(c.q, c.r);
  const sh = coverageShift(seed, ctx);
  let d = smooth(0.28 + sh, 0.74 + sh, potential + levelOffset(seed, c)); // wide ramp: density falls off over several cells
  // clearings are carved per tree in world space (place.ts → clearingAt), so they are round, not hex-shaped
  return d < 0.12 ? 0 : d;
}

export function applyNature(cell: CellData, ctx: WorldLayerCtx): void {
  const potential = cell.forest;
  cell.forest = 0;
  if (blocked(cell)) return;
  const seed = ctx.seed;
  let d = rawDensity(seed, cell, potential, ctx);

  let nearVillage = false, nearRoad = false, nearForest = 0, nb = 0;
  for (const [dq, dr] of DIRS) {
    const n = ctx.cellAt(NATURE_STAGE, cell.q + dq, cell.r + dr);
    if (n.village || n.building) nearVillage = true;
    if (n.roadMask || n.riverMask) nearRoad = true;
    if (!blocked(n)) {
      const nd = rawDensity(seed, n, n.forest, ctx);
      nearForest = Math.max(nearForest, nd);
      if (nd > 0.6) nb++;
    }
  }
  if (d > 0) {
    if (nearVillage) d = Math.min(d, 0.45);
    if (nearRoad) d *= 0.9;
    cell.forest = d;
    cell.tags.push(d > 0.75 && nb >= 4 ? NTAG.core : NTAG.edge);
    return;
  }

  // meadow: rare copses / lone trees, only in parkland regions and away from forests' immediate rim
  if (cell.slope || nearForest > 0.3) return;
  const S = seedsFor(seed);
  const p = hexToWorld(cell.q, cell.r);
  const park = smooth(-0.25, 0.45, simplex2(S.park, p.x / 330, p.z / 330));
  const outlier = smooth(0.08, 0.3, potential); // just outside forests: outliers are likelier
  const u = rand01(S.pick, cell.q, cell.r);
  const pCopse = park * (0.012 + 0.05 * outlier) * (nearVillage ? 0 : 1);
  const pLone = park * (0.03 + 0.05 * outlier) + (nearVillage ? 0.04 : 0);
  if (u < pCopse) {
    cell.forest = 0.35;
    cell.tags.push(NTAG.copse);
  } else if (u < pCopse + pLone) {
    cell.forest = 0.1;
    cell.tags.push(NTAG.lone);
  }
}

/** Clearing factor at world xz (1 = no clearing, 0 = glade centre). Pure of the seed. */
export function clearingAt(seed: number, x: number, z: number): number {
  return 1 - smooth(0.5, 0.68, simplex2(seedsFor(seed).clear, x / 52, z / 52));
}
