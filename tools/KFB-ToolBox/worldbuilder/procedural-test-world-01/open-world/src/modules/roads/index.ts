import {TrackConstruction} from './track-adapter';
// roads module: stage-2 road network, stage-4 rivers + bridges, their top tiles per chunk, bridge colliders, showcase.
import * as THREE from 'three';
import type { CameraView, CoreContext, GameModule } from '../../core/types';
import { DIRS, edgeVector, hexDistance, hexToWorld } from '../../core/hex';
import { LEVEL_H } from '../../core/units';
import { orbitToView } from '../../core/debug';
import { EDGE_TILE_IDS } from '../assets/tile-edges';
import { roadLayer, riverLayer, bindRoadNet, bindRiverNet, roadNetOf, riverNetOf } from './layers';
import { RoadRenderer, BRIDGE_IDS, RIVER_DECO_IDS, softenTileRim, rebuildRampTile, roadSinkAt } from './render';
import { networkStats } from './stats';
import { GATE } from './rivers';
import { Prefetcher } from './prefetch';
import { HEX_WIDTH } from '../../core/units';

let renderer: TrackConstruction | null = null;
let prefetch: Prefetcher | null = null;

const TILE_IDS = EDGE_TILE_IDS.filter((id) => /\/(roads|rivers)\//.test(id) && !id.includes('waterless'));

// ------------------------------------------------------------------ feature search (deterministic, near the origin)
type Spot = { q: number; r: number; dir: number };
const found = new Map<string, Spot | null>();

function cellTop(ctx: CoreContext, q: number, r: number): number {
  return ctx.world.cell(q, r).level * LEVEL_H;
}

function findCrossing(ctx: CoreContext): Spot | null {
  const key = 'x' + ctx.world.seed;
  if (found.has(key)) return found.get(key)!;
  const net = roadNetOf(ctx.world.seed);
  let s: Spot | null = null;
  if (net) {
    const n = net.nodesNear(0, 0, 70).find((x) => x.degree >= 3);
    if (n) s = { q: n.node.q, r: n.node.r, dir: 0 };
  }
  found.set(key, s);
  return s;
}

/** Walk the routed paths of nodes near the origin; first step matching pred (nearest node first). */
function findOnPaths(ctx: CoreContext, tag: string, pred: (q: number, r: number, mode: number, dir: number) => boolean): Spot | null {
  const key = tag + ctx.world.seed;
  if (found.has(key)) return found.get(key)!;
  const net = roadNetOf(ctx.world.seed);
  let best: Spot | null = null, bd = Infinity;
  if (net)
    for (const { node } of net.nodesNear(0, 0, 90)) {
      for (const k of net.allDirs(node.i, node.j)) {
        const p = net.alive(node.i, node.j, k) ? net.pathAny(node.i, node.j, k) : null;
        if (!p) continue;
        for (const st of p.steps) {
          const d = hexDistance(st.q, st.r, 0, 0);
          if (d < bd && pred(st.q, st.r, st.mode, st.dir)) {
            bd = d;
            best = { q: st.q, r: st.r, dir: st.dir };
          }
        }
      }
      if (best && bd < hexDistance(node.q, node.r, 0, 0) - 20) break;
    }
  found.set(key, best);
  return best;
}

function findRiver(ctx: CoreContext, bridge: boolean): Spot | null {
  const key = (bridge ? 'b' : 'v') + ctx.world.seed;
  if (found.has(key)) return found.get(key)!;
  const rn = riverNetOf(ctx.world.seed);
  let best: Spot | null = null, bd = Infinity;
  if (rn) {
    const id0 = rn.corr(0, 0).id;
    const n0 = Math.floor(rn.vOf(0, 0) / GATE);
    for (let k = id0 - 2; k <= id0 + 2; k++)
      for (let n = n0 - 14; n <= n0 + 14; n++) {
        const st = rn.link(k, n);
        if (!st) continue;
        for (let t = 1; t + 1 < st.length; t++) {
          const s = st[t];
          const d = hexDistance(s.q, s.r, 0, 0);
          if (d >= bd) continue;
          const c = ctx.world.cell(s.q, s.r);
          if (bridge ? c.bridge : !c.roadMask && st[t + 1].dir === s.dir) {
            bd = d;
            best = { q: s.q, r: s.r, dir: s.dir };
          }
        }
      }
  }
  found.set(key, best);
  return best;
}

const yawOf = (vx: number, vz: number) => (Math.atan2(vx, vz) * 180) / Math.PI;

function viewAt(ctx: CoreContext, s: Spot | null, side: number, pitch: number, dist: number, lift = 0): CameraView {
  if (!s) return orbitToView({ target: [0, cellTop(ctx, 0, 0), 0], yaw: 30, pitch: 40, dist: 120 });
  const p = hexToWorld(s.q, s.r);
  const v = edgeVector(s.dir);
  // look across the feature's heading (side view, rotated a bit toward the front)
  const a = Math.atan2(v.z, v.x) + side;
  return orbitToView({ target: [p.x, cellTop(ctx, s.q, s.r) + lift, p.z], yaw: yawOf(Math.cos(a), Math.sin(a)), pitch, dist });
}

const presets: Record<string, (ctx: CoreContext) => CameraView> = {
  crossing: (ctx) => viewAt(ctx, findCrossing(ctx), 0.5, 38, 62),
  crossing_close: (ctx) => viewAt(ctx, findCrossing(ctx), 2.2, 24, 26),
  bridge: (ctx) => viewAt(ctx, findRiver(ctx, true), 1.0, 26, 34, 1),
  bridge_top: (ctx) => viewAt(ctx, findRiver(ctx, true), 0.0, 80, 45),
  bridge_close: (ctx) => viewAt(ctx, findRiver(ctx, true), 2.0, 14, 16, 1),
  ramp: (ctx) => viewAt(ctx, findOnPaths(ctx, 'ramp', (_q, _r, m) => m === 1 || m === 2 || m === 6 || m === 7), 1.1, 38, 42, 2),
  ramp_side: (ctx) => viewAt(ctx, findOnPaths(ctx, 'ramp', (_q, _r, m) => m === 1 || m === 2 || m === 6 || m === 7), 1.57, 12, 30, 2),
  river_top: (ctx) => viewAt(ctx, findRiver(ctx, false), 0, 82, 90),
  river: (ctx) => viewAt(ctx, findRiver(ctx, false), 1.2, 30, 55),
  overview: (ctx) => viewAt(ctx, findCrossing(ctx), 0.6, 55, 280),
  /** debug: top-down at ?at=q,r (&atd=dist) */
  at: (ctx) => {
    const [q, r] = (ctx.params.get('at') ?? '0,0').split(',').map(Number);
    const p = hexToWorld(q, r);
    return orbitToView({ target: [p.x, cellTop(ctx, q, r), p.z], yaw: 0, pitch: 70, dist: Number(ctx.params.get('atd') ?? 80) });
  },
  far: (ctx) => viewAt(ctx, findCrossing(ctx), 0.6, 30, 200),
};

// ------------------------------------------------------------------ debug spawn (?roadsSpawn=bridge|crossing|ramp)
let spawnReq = true;
function trySpawn(ctx: CoreContext): void {
  const player = ctx.services.get<{ spawn(x: number, y: number, z: number, h?: number): void }>('player');
  if (!player || ctx.time < 0.5) return;
  spawnReq = false;
  const what = ctx.params.get('roadsSpawn');
  const s = what === 'crossing' ? findCrossing(ctx) : what === 'river' ? findRiver(ctx, false) : what === 'ramp' ? findOnPaths(ctx, 'ramp', (_q, _r, m) => m === 1 || m === 2 || m === 6 || m === 7) : findRiver(ctx, true);
  if (!s) return;
  if (what === 'river') {
    // stand on the bank next to a straight river cell, facing across the river
    const side = (s.dir + 2) % 6;
    const bq = s.q + DIRS[side][0], br = s.r + DIRS[side][1];
    const bp = hexToWorld(bq, br), rp = hexToWorld(s.q, s.r);
    player.spawn(bp.x, ctx.world.heightAt(bp.x, bp.z) + 0.2, bp.z, Math.atan2(rp.x - bp.x, rp.z - bp.z));
    return;
  }
  const free = (q: number, r: number) => {
    const c = ctx.world.cell(q, r);
    return !!c.roadMask && !c.building && !c.reserved && !c.bridge && !c.slope && !c.water && !c.riverMask;
  };
  if (what === 'ramp') {
    // at the foot of the road ramp, on the approach cell, facing up the ramp
    const rc = ctx.world.cell(s.q, s.r);
    if (rc.slope) {
      const back = (rc.slope.dir + 3) % 6;
      const fq = s.q + DIRS[back][0], fr = s.r + DIRS[back][1];
      const fp = hexToWorld(fq, fr), rp = hexToWorld(s.q, s.r);
      const x = fp.x + (rp.x - fp.x) * 0.3, z = fp.z + (rp.z - fp.z) * 0.3;
      player.spawn(x, ctx.world.heightAt(x, z) + 0.2, z, Math.atan2(rp.x - fp.x, rp.z - fp.z));
      return;
    }
  }
  if (what === 'crossing') {
    // a free road cell 1–3 cells out along one of the crossing's roads (never inside a building / on a roof)
    const c0 = ctx.world.cell(s.q, s.r);
    for (let k = 1; k <= 3; k++)
      for (let e = 0; e < 6; e++) {
        if (!((c0.roadMask >> e) & 1)) continue;
        const q = s.q + k * DIRS[e][0], r = s.r + k * DIRS[e][1];
        if (!free(q, r)) continue;
        const p = hexToWorld(q, r), t = hexToWorld(s.q, s.r);
        player.spawn(p.x, ctx.world.heightAt(p.x, p.z) + 0.2, p.z, Math.atan2(t.x - p.x, t.z - p.z));
        return;
      }
  }
  // stand 2 cells before the feature on its road, facing it
  const c = ctx.world.cell(s.q, s.r);
  let d = s.dir;
  if (what === 'bridge' || !what) for (let e = 0; e < 6; e++) if ((c.roadMask >> e) & 1) { d = (e + 3) % 6; break; }
  const back = (d + 3) % 6;
  const nb = what === 'bridge' || !what ? 1 : 2;
  const q = s.q + nb * DIRS[back][0], r = s.r + nb * DIRS[back][1];
  const p = hexToWorld(q, r);
  const v = edgeVector(d);
  const off = Number(ctx.params.get('roadsSpawnOff') ?? 0);
  p.x += -v.z * off;
  p.z += v.x * off;
  player.spawn(p.x, ctx.world.heightAt(p.x, p.z) + 0.2, p.z, Math.atan2(v.x, v.z));
}

// ------------------------------------------------------------------ module
const mod: GameModule = {
  id: 'roads',
  layers: [roadLayer, riverLayer],

  async init(ctx) {
    bindRoadNet(ctx.world.seed, (q, r) => ctx.world.cellAt(2, q, r));
    bindRiverNet(ctx.world.seed, (q, r) => ctx.world.cellAt(4, q, r));
    renderer = new TrackConstruction(ctx);
    const rnet = roadNetOf(ctx.world.seed);
    if (rnet && !ctx.params.has('noprefetch')) prefetch = new Prefetcher(ctx.world, rnet, riverNetOf(ctx.world.seed), 0);
    const seed = ctx.world.seed;
    ctx.services.set('roads', {
      net: () => roadNetOf(seed),
      rivers: () => riverNetOf(seed),
      stats: () => ({ render: renderer?.stats, road: roadNetOf(seed)?.stats, river: riverNetOf(seed)?.stats }),
      /** time-sliced, leaf-first network prefetcher (streaming drives it when present) */
      prefetcher: () => prefetch,
    });
    (window as unknown as Record<string, unknown>).__roads = {
      stats: (q = 0, r = 0, R = 40) => networkStats(ctx.world, q, r, R),
      perf: () => ({ render: renderer?.stats, road: roadNetOf(seed)?.stats, river: riverNetOf(seed)?.stats, prefetch: prefetch && { done: prefetch.done, ms: +prefetch.ms.toFixed(0), maxStep: +prefetch.maxStep.toFixed(1), maxPhase: prefetch.maxPhase, slow: prefetch.slow } }),
      renderer: () => renderer,
      find: () => ({ crossing: findCrossing(ctx), bridge: findRiver(ctx, true), river: findRiver(ctx, false) }),
    };
  },

  buildChunk(chunk, out) {
    renderer?.build(chunk, out);
  },

  update(_dt, ctx) {
    if (spawnReq && ctx.params.has('roadsSpawn')) trySpawn(ctx);
    if (!prefetch || ctx.services.get('streaming')) return;
    prefetch.radiusCells = ctx.chunks.config.loadRadius / HEX_WIDTH + 10;
    const f = ctx.chunks.focus;
    prefetch.update(f.x, f.z, 2.5);
  },

  showcaseUses: ['terrain'],
  showcase(ctx) {
    ctx.chunks.configure({ loadRadius: 330, urgentRadius: 330 });
    const v = presets.crossing(ctx);
    ctx.chunks.focus.set(v.target[0], 0, v.target[2]);
    ctx.camera.position.set(...v.position);
    ctx.camera.lookAt(new THREE.Vector3(...v.target));
  },

  cameraPresets: presets,
};

export default mod;
