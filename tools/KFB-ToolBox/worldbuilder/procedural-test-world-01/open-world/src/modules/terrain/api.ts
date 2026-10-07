import { SurfaceTruth } from '../../core/surface';
let activeSurface:SurfaceTruth|null=null;
export function bindSurfaceQueries(surface:SurfaceTruth){activeSurface=surface;}
// Public, pure helpers other layers/modules may import. Everything here reads only CellData (never mutates).
// Import from 'src/modules/terrain/api' — nothing in this file touches three.js scene state.
import type { CellData } from '../../core/types';
import { DIRS, edgeVector, hexToWorld, worldToAxial, hexRound } from '../../core/hex';
import { HEX_SCALE, LEVEL_H, WATER_DROP } from '../../core/units';

import { terrainGen, type RiverInfo } from './gen';
export { validCoastMask, MAX_LEVEL, MOUNTAIN_LEVEL, HILL_LEVEL, RIVER_SPACING, RIVER_HALF_WIDTH, type RiverInfo } from './gen';

/**
 * River valley info for cell (q, r) — pure, seeded, stable signature for the roads module:
 *   riverCorridor(seed, q, r) → { onCentre, corridor, dist, level, id }
 * - onCentre: the cell is on the single-cell centre chain of a river (continuous, endless, 6-connected along the line)
 * - corridor: inside the flat valley (centre ± ~1.7 cells). Terrain guarantees: level === `level` (0) for every corridor
 *   cell, never water/coast (no lake within 3.6 cells of a centre line), no ramps, no rock/mountain.
 * - dist: approximate distance to the centre line in cells; id: which river (adjacent rivers differ by 1).
 * Rivers are ~37 cells (≈ 560 m) apart, gently meandering, never closing or crossing.
 */
export function riverCorridor(seed: number, q: number, r: number): RiverInfo {
  return terrainGen(seed).river(q, r);
}

/** Tags terrain writes into CellData.tags. */
export const TAG = {
  coast: 'coast', // land cell with >= 1 water neighbour (draws a hex_coast_* tile)
  ramp: 'ramp', // natural grass ramp (cell.slope set by terrain)
  embankment: 'embankment', // flank of a natural ramp: terrain raises an earth shoulder here — keep buildings/roads off
  cliff: 'cliff', // a higher land neighbour exists (cliff above this cell)
  rock: 'rock', // terrain draws a solid rock/hill decoration here (hills_*, mountain_*)
  mountain: 'mountain', // impassable mountain cell (also reserved = true)
  lake: 'lake', // water cell of a lake
} as const;

export const isWater = (c: Readonly<CellData>) => c.water;
export const isCoast = (c: Readonly<CellData>) => !c.water && c.coastMask !== 0;
export const isMountain = (c: Readonly<CellData>) => c.biome === 'mountain';
export const hasRock = (c: Readonly<CellData>) => c.tags.includes(TAG.rock);

/**
 * Cell can carry a building / village lot / field: dry, flat (no ramp), not coast, no rock decoration, not reserved.
 */
export function isBuildable(c: Readonly<CellData>): boolean {
  const w=hexToWorld(c.q,c.r);if(activeSurface)return activeSurface.isBuildable(w.x,w.z)&&!c.reserved&&!c.roadMask&&!c.riverMask;
  return !c.water && c.coastMask === 0 && !c.slope && c.biome !== 'mountain' && !c.reserved && !hasRock(c) && c.roadMask === 0 && c.riverMask === 0;
}

/** Cell a road may run through (roads may still add their own slope on flat cells). Not water, not coast, not mountain. */
export function isRoadPassable(c: Readonly<CellData>): boolean {
  return !c.water && c.coastMask === 0 && c.biome !== 'mountain';
}

/** Cell a walker can stand on (rock decorations only occupy part of the cell; mountains block it). */
export function isWalkable(c: Readonly<CellData>): boolean {
  const w=hexToWorld(c.q,c.r);return activeSurface?activeSurface.isWalkable(w.x,w.z):!c.water&&c.biome!=='mountain';
}

/**
 * Can a walker step from cell a to its neighbour b (adjacent) without jumping a cliff?
 * Same level, or a ramp on either cell bridging exactly its `steps` in the right direction.
 */
export function canStep(a: Readonly<CellData>, b: Readonly<CellData>): boolean {
  if(activeSurface){const p=hexToWorld(a.q,a.r),q=hexToWorld(b.q,b.r);return activeSurface.canStep(p.x,p.z,q.x,q.z);}
  if (!isWalkable(a) || !isWalkable(b)) return false;
  const d = DIRS.findIndex(([dq, dr]) => a.q + dq === b.q && a.r + dr === b.r);
  if (d < 0) return false;
  const top = (c: Readonly<CellData>, edge: number) => c.level + (c.slope && (edge === c.slope.dir || edge === (c.slope.dir + 1) % 6 || edge === (c.slope.dir + 5) % 6) ? c.slope.steps : 0);
  // height of each cell at the shared edge (ramps: high side toward slope.dir, plus the two flanking edges are high too)
  return top(a, d) === top(b, (d + 3) % 6);
}

/** Top-of-tile y at the cell centre (ramps: their centre is already the high plateau). */
export function cellTopY(c: Readonly<CellData>): number {
  if(activeSurface){const w=hexToWorld(c.q,c.r);return activeSurface.heightAt(w.x,w.z);}
  if (c.water) return c.level * LEVEL_H - WATER_DROP;
  return (c.level + (c.slope ? c.slope.steps / 2 : 0)) * LEVEL_H; // planar ramp: centre at mid height
}

/**
 * PLANAR ramp (integration decision): one inclined plane over the whole hex. Pure.
 *   rampPlaneT(cell, x, z)  → t ∈ [−1, 1]: −1 on the foot edge (d+3), +1 on the high edge (d = slope.dir),
 *                             linear across the cell (t = projection on the slope direction / inner radius 7.5 m)
 *   rampPlaneHeight(cell, x, z) = (level + steps·(t+1)/2)·LEVEL_H
 * Edge heights: high edge d and its two corners at level+steps; foot edge d+3 and its corners at level; the two side
 * corners (±90°) at level + steps/2. Side edges d±1 run high→mid, d±2 mid→foot.
 * Terrain's natural ramps are TONGUES: only d is at level+steps; d±1, d±2, d+3 stay at level, so the plateau edge is
 * never notched. The plane's sides above the lower neighbours are closed by terrain's dirt-banded skirts.
 */
export function rampPlaneT(c: Readonly<CellData>, x: number, z: number): number {
  const s = c.slope!;
  const ctr = hexToWorld(c.q, c.r);
  const v = edgeVector(s.dir);
  return Math.max(-1, Math.min(1, ((x - ctr.x) * v.x + (z - ctr.z) * v.z) / HEX_SCALE));
}

export function rampPlaneHeight(c: Readonly<CellData>, x: number, z: number): number {
  if (!c.slope) return c.level * LEVEL_H;
  return (c.level + ((rampPlaneT(c, x, z) + 1) / 2) * c.slope.steps) * LEVEL_H;
}

/**
 * @deprecated OLD KayKit half-ramp profile (linear low half, flat high half). Kept only until roads switch to
 * `rampPlaneHeight`; terrain's heightAt / colliders / meshes all use the planar profile now.
 */
export function rampHeight(c: Readonly<CellData>, x: number, z: number): number {
  const s = c.slope!;
  const ctr = hexToWorld(c.q, c.r);
  const v = edgeVector(s.dir);
  const t = ((x - ctr.x) * v.x + (z - ctr.z) * v.z) / HEX_SCALE;
  const f = t >= 0 ? 1 : Math.max(0, 1 + t);
  return (c.level + f * s.steps) * LEVEL_H;
}

/** Hex (q,r) containing world xz. */
export function cellOfWorld(x: number, z: number): { q: number; r: number } {
  const a = worldToAxial(x, z);
  return hexRound(a.q, a.r);
}

/**
 * Edges of `c` whose land neighbour is HIGHER (the foot of a cliff runs along these edges) — anchor for nature's foot
 * rocks / boulders (whole-game r3 #8). Bit d set = cliff wall rising along edge d. Same-call cost as cliffDropMask.
 */
export function cliffFootMask(c: Readonly<CellData>, get: (q: number, r: number) => Readonly<CellData>): number {
  if (c.water) return 0;
  let m = 0;
  for (let d = 0; d < 6; d++) {
    const n = get(c.q + DIRS[d][0], c.r + DIRS[d][1]);
    if (!n.water && n.level > c.level && !(c.slope && d === c.slope.dir)) m |= 1 << d;
  }
  return m;
}

/** Edges of `c` that face a lower land neighbour (cliff drops), given a cell getter. */
export function cliffDropMask(c: Readonly<CellData>, get: (q: number, r: number) => Readonly<CellData>): number {
  let m = 0;
  for (let d = 0; d < 6; d++) {
    const n = get(c.q + DIRS[d][0], c.r + DIRS[d][1]);
    if (!n.water && n.level < c.level) m |= 1 << d;
  }
  return m;
}
