// World layers owned by the roads module: stage 2 (roads) and stage 4 (rivers + bridges).
import type { CellData, WorldLayer, WorldLayerCtx } from '../../core/types';
import { RoadNet, type CellGetter } from './net';
import { RiverNet } from './rivers';

/** Tags written into CellData.tags. */
export const ROAD_TAG = {
  road: 'road',
  /** a macro road node (≥ 1 road ends here) */
  node: 'road-node',
  /** node where ≥ 3 roads meet = village site */
  crossing: 'crossing',
  /** straight road ramp added by the road layer (cell.slope set) */
  ramp: 'road-ramp',
  river: 'river',
  bridge: 'bridge',
} as const;

const roadNets = new Map<number, RoadNet>();
const riverNets = new Map<number, RiverNet>();

/** Bind (or get) the road network of a seed. The first binding's getter wins (all getters are equivalent). */
export function bindRoadNet(seed: number, stage1: CellGetter): RoadNet {
  let n = roadNets.get(seed);
  if (!n) roadNets.set(seed, (n = new RoadNet(seed, stage1)));
  return n;
}
export function bindRiverNet(seed: number, stage3: CellGetter): RiverNet {
  let n = riverNets.get(seed);
  if (!n) riverNets.set(seed, (n = new RiverNet(seed, stage3)));
  return n;
}
export const roadNetOf = (seed: number) => roadNets.get(seed) ?? null;
export const riverNetOf = (seed: number) => riverNets.get(seed) ?? null;

function applyRoads(cell: CellData, ctx: WorldLayerCtx): void {
  const net = bindRoadNet(ctx.seed, (q, r) => ctx.cellAt(2, q, r));
  const rc = net.cell(cell.q, cell.r);
  if (!rc || !rc.mask) return;
  cell.roadMask = rc.mask;
  cell.tags.push(ROAD_TAG.road);
  if (rc.slope && !cell.slope) {
    // notch ramp: the upper cell is cut down one level and rises toward the plateau (terrain's pocket rule)
    cell.tags.push('road-intent-grade:'+rc.level);
    cell.slope = { dir: rc.slope.dir, steps: 1 };
    cell.tags.push(ROAD_TAG.ramp);
  }
  if (rc.node) {
    cell.tags.push(ROAD_TAG.node);
    if (net.degree(rc.node.i, rc.node.j) >= 3) cell.tags.push(ROAD_TAG.crossing);
  }
}

function applyRivers(cell: CellData, ctx: WorldLayerCtx): void {
  const net = bindRiverNet(ctx.seed, (q, r) => ctx.cellAt(4, q, r));
  const rc = net.cell(cell.q, cell.r);
  if (!rc || !rc.mask) return;
  cell.riverMask = rc.mask;
  cell.tags.push(ROAD_TAG.river);
  if (cell.roadMask) {
    cell.bridge = true;
    cell.reserved = true;
    cell.tags.push(ROAD_TAG.bridge);
  }
}

export const roadLayer: WorldLayer = { id: 'roads', stage: 2, apply: applyRoads };
export const riverLayer: WorldLayer = { id: 'rivers', stage: 4, apply: applyRivers };
