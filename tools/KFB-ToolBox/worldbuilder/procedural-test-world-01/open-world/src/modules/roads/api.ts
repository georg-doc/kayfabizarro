// Public, pure helpers for villages / props / nature / demo. Import from 'src/modules/roads/api'.
//
// The network is a pure function of (seed, terrain). Helpers taking a `seed` work once the roads module is active in
// the running engine (its init binds the network to the world); they return empty results otherwise. Inside a WORLD
// LAYER prefer reading the cell data you already get (`ctx.cellAt(stage, q, r)`): `roadMask`, `riverMask`, `bridge`,
// `slope`, and tags `road`, `road-node`, `crossing`, `road-ramp`, `river`, `bridge`.
import type { CellData } from '../../core/types';
import { DIRS, hexDistance } from '../../core/hex';
import { roadNetOf, riverNetOf, ROAD_TAG } from './layers';
import { corridorFn } from './corridor';
import { MACRO, type RoadNode } from './net';

export { ROAD_TAG, MACRO };
/** Depth (m, ≥ 0) of the drawn road surface below grass height at world (x, z); 0 off flat road cells. */
export { roadSinkAt } from './render';
export type { RoadNode };

export interface Crossing {
  q: number;
  r: number;
  /** terrain level of the node cell (its ring 1 is flat at the same level) */
  level: number;
  /** number of roads meeting here (≥ 3 = crossing / village site) */
  degree: number;
  /** hex edges (OUR order) the roads leave through */
  dirs: number[];
}

/** Edges of a 6-bit mask as direction indices. */
export function maskDirs(mask: number): number[] {
  const out: number[] = [];
  for (let d = 0; d < 6; d++) if ((mask >> d) & 1) out.push(d);
  return out;
}

/** Road edge directions of a cell (from CellData or from the network for a seed). */
export function roadDirs(cell: Readonly<Pick<CellData, 'roadMask'>>): number[] {
  return maskDirs(cell.roadMask);
}

/** Road mask of (q, r) straight from the network (no world layer needed). 0 when no road or roads inactive. */
export function roadMaskAt(seed: number, q: number, r: number): number {
  return roadNetOf(seed)?.cell(q, r)?.mask ?? 0;
}

/** River mask of (q, r) (stage 4 needs villages: only valid after stage 3 exists). */
export function riverMaskAt(seed: number, q: number, r: number): number {
  return riverNetOf(seed)?.mask(q, r) ?? 0;
}

/** Node (≥ 1 road) at (q, r)? */
export function nodeAt(seed: number, q: number, r: number): Crossing | null {
  const net = roadNetOf(seed);
  const n = net?.nodeAtCell(q, r);
  if (!net || !n) return null;
  const deg = net.degree(n.i, n.j);
  if (!deg) return null;
  return { q, r, level: n.level, degree: deg, dirs: maskDirs(net.cell(q, r)?.mask ?? 0) };
}

/** Is (q, r) a crossing (macro node where ≥ 3 roads meet)? */
export function isCrossing(seed: number, q: number, r: number): boolean {
  return (nodeAt(seed, q, r)?.degree ?? 0) >= 3;
}

/** Crossings (degree ≥ 3) within `radius` cells of (q, r), nearest first. */
export function crossingsNear(seed: number, q: number, r: number, radius: number): Crossing[] {
  return nodesNear(seed, q, r, radius).filter((c) => c.degree >= 3);
}

/** All road nodes (degree ≥ 1) within `radius` cells, nearest first. */
export function nodesNear(seed: number, q: number, r: number, radius: number): Crossing[] {
  const net = roadNetOf(seed);
  if (!net) return [];
  return net.nodesNear(q, r, radius).map(({ node, degree }) => ({
    q: node.q, r: node.r, level: node.level, degree, dirs: maskDirs(net.cell(node.q, node.r)?.mask ?? 0),
  }));
}

/**
 * Road frontage: for a non-road cell, the directions d whose neighbour is a road cell (a building on this cell should
 * face one of them). Uses CellData via the getter you pass (e.g. ctx.cellAt(3, …) inside the villages layer).
 */
export function roadFrontage(q: number, r: number, get: (q: number, r: number) => Readonly<CellData>): number[] {
  const out: number[] = [];
  for (let d = 0; d < 6; d++) if (get(q + DIRS[d][0], r + DIRS[d][1]).roadMask) out.push(d);
  return out;
}

/** Inside a river valley corridor (terrain's riverCorridor): villages should keep buildings out of it. */
export function inRiverCorridor(seed: number, q: number, r: number): boolean {
  return corridorFn(seed)(q, r).corridor;
}

/** Hex distance from (q, r) to the nearest crossing within `radius` (Infinity if none). */
export function distToCrossing(seed: number, q: number, r: number, radius = 20): number {
  const c = crossingsNear(seed, q, r, radius)[0];
  return c ? hexDistance(q, r, c.q, c.r) : Infinity;
}

export { networkStats } from './stats';
