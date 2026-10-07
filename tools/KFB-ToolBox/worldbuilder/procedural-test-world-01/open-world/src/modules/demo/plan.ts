// Demo route planning: a pure function of the world (seed + all layers) and nature's crowns. Picks the spawn village
// with the scorer (score.ts: quality, bridge by road, forest edge on foot, spawn view) and builds the landmarks of the
// demo route (village centre → road → bridge → forest edge) with road-following polylines.
import type { WorldModel } from '../../core/world';
import { hexToWorld, worldToHex } from '../../core/hex';
import { villagesNear } from '../villages/api';
import { type Cell, type Get, type Leg, type ForestEdge, type V3, dirIndex, key, pathTo, polyline, pt, r2, smoothPoints } from './graph';
import { type Breakdown, type Cover, rankVillages, villageCentredAt } from './score';

export type { V3, Leg, ForestEdge };
export { polyLen } from './graph';

export interface DemoPlan {
  seed: number;
  village: { id: string; kind: string; centre: Cell; color: string; degree: number; distFromOrigin_m: number } | null;
  spawn: { world: V3; heading: number; cell: Cell | null; source: 'village' | 'nearest-village' | 'origin' };
  landmarks: { villageCentre: V3 | null; bridge: V3 | null; forestEdge: V3 | null; forestBeyondBridge: V3 | null };
  /** bridge cell + the road edge the route enters it through (axis) */
  bridgeCell: (Cell & { axis: number }) | null;
  forest: ForestEdge | null;
  forestBeyond: ForestEdge | null;
  /** village centre → landmark (A1 travel-tempo legs) */
  route: { toBridge: Leg | null; toForest: Leg | null; toForestBeyondBridge: Leg | null };
  /** the player's demo path: spawn → centre → bridge → across → forest edge */
  demoPath: Leg | null;
  /** scorer breakdown of every proper village within the radius, best first */
  candidates: Breakdown[];
  ms: number;
  timing: Record<string, number>;
}


/** opts.at: plan only the village owning that cell (game: the boot choice). opts.village: filter the ranking to that id.
 *  Without `at` this ranks every village within `radius` (OFFLINE scorer: seconds — never at boot). opts.cover: crowns. */
export function planDemo(world: WorldModel, opts: { radius?: number; top?: number; village?: string; at?: Cell | null; cover?: Cover | null } = {}): DemoPlan {
  const t0 = performance.now();
  const seed = world.seed;
  const get: Get = (q, r) => world.cell(q, r);
  const { ranked, ms } = rankVillages(world, opts.cover ?? null, { radius: opts.radius, top: opts.top, only: opts.village, at: opts.at });
  const best = ranked[0] && ranked[0].b.phase === 2 ? ranked[0] : null;

  const plan: DemoPlan = {
    seed,
    village: null,
    spawn: { world: pt(world, 0, 0), heading: 0, cell: null, source: 'origin' },
    landmarks: { villageCentre: null, bridge: null, forestEdge: null, forestBeyondBridge: null },
    bridgeCell: null,
    forest: null,
    forestBeyond: null,
    route: { toBridge: null, toForest: null, toForestBeyondBridge: null },
    demoPath: null,
    candidates: ranked.map((e) => e.b),
    ms: 0,
    timing: { ...ms },
  };

  const v = best?.v ?? (opts.at ? villageCentredAt(seed, opts.at.q, opts.at.r) : villagesNear(seed, 0, 0, 46)[0]) ?? null; // fallback
  if (v) {
    const cw = hexToWorld(v.centre.q, v.centre.r);
    plan.village = { id: v.id, kind: v.kind, centre: { ...v.centre }, color: v.color, degree: v.degree, distFromOrigin_m: Math.round(Math.hypot(cw.x, cw.z)) };
    plan.landmarks.villageCentre = pt(world, cw.x, cw.z);
    if (v.spawn) {
      const s = v.spawn.world;
      plan.spawn = { world: [r2(s.x), r2(s.y), r2(s.z)], heading: v.spawn.heading, cell: worldToHex(s.x, s.z), source: best ? 'village' : 'nearest-village' };
    }
  }

  if (best) {
    let bridgePath: Cell[] | null = null;
    if (best.bridge) {
      const b = best.bridge;
      bridgePath = b.path;
      plan.route.toBridge = polyline(world, get, bridgePath);
      const bw = hexToWorld(b.q, b.r);
      plan.landmarks.bridge = pt(world, bw.x, bw.z);
      const prev = bridgePath[bridgePath.length - 2];
      plan.bridgeCell = { q: b.q, r: b.r, axis: prev ? dirIndex(prev, b) : 0 };
    }
    if (best.forest && best.walk) {
      const f = best.forest;
      plan.route.toForest = polyline(world, get, pathTo(best.walk.tree, f.edge.from.q, f.edge.from.r), undefined, f.point);
      plan.forest = { world: f.point, from: { q: f.edge.from.q, r: f.edge.from.r }, forestCell: { q: f.edge.f.q, r: f.edge.f.r, density: r2(f.edge.f.forest) }, beyondBridge: false };
      plan.landmarks.forestEdge = f.point;
    }
    if (best.beyond) {
      const e = best.beyond;
      plan.forestBeyond = { world: e.point, from: { q: e.edge.from.q, r: e.edge.from.r }, forestCell: { q: e.edge.f.q, r: e.edge.f.r, density: r2(e.edge.f.forest) }, beyondBridge: true };
      plan.landmarks.forestBeyondBridge = e.point;
    }
    // demo path: spawn → centre → (bridge → far side → forest beyond) | (nearest forest)
    let cells: Cell[] | null = null;
    let goal: V3 | null = null;
    if (bridgePath && best.beyond) {
      cells = [...bridgePath, ...pathTo(best.beyond.search.tree, best.beyond.edge.from.q, best.beyond.edge.from.r)];
      goal = best.beyond.point;
      plan.route.toForestBeyondBridge = polyline(world, get, cells, undefined, goal);
    } else if (bridgePath) cells = bridgePath;
    else if (best.forest && best.walk) {
      cells = pathTo(best.walk.tree, best.forest.edge.from.q, best.forest.edge.from.r);
      goal = best.forest.point;
    }
    if (cells) {
      const sc = plan.spawn.cell;
      let start: V3 | undefined;
      if (sc) {
        const onWay = cells.findIndex((c) => c.q === sc.q && c.r === sc.r);
        if (onWay >= 0) cells = cells.slice(onWay);
        else {
          const back = best.road.has(key(sc.q, sc.r)) ? pathTo(best.road, sc.q, sc.r).reverse() : [sc, cells[0]];
          cells = [...back.slice(0, -1), ...cells];
        }
        start = plan.spawn.world;
      }
      plan.demoPath = polyline(world, get, cells, start, goal ?? undefined);
    }
  }
  // steering polylines for the route scripts (safe shortcuts through the zig-zag of cell centres / edge midpoints)
  const fc = (f: ForestEdge | null) => (f ? [{ q: f.forestCell.q, r: f.forestCell.r }] : []);
  const sm = (leg: Leg | null, extra: Cell[]) => { if (leg) leg.smooth = smoothPoints(get, leg.points, leg.cells, extra); };
  sm(plan.route.toBridge, []);
  sm(plan.route.toForest, fc(plan.forest));
  sm(plan.route.toForestBeyondBridge, fc(plan.forestBeyond));
  sm(plan.demoPath, fc(plan.forestBeyond ?? plan.forest));
  plan.ms = +(performance.now() - t0).toFixed(1);
  return plan;
}
