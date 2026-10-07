// Offline seed scan (in-page, NOT part of the game bundle's startup path): builds a fresh WorldModel per seed from the
// running engine's world layers (all per-seed state in the layers is keyed by seed), plans nature's crowns per chunk
// with nature's pure planner, and runs the demo scorer. Driven by src/modules/demo/tools/scan.mjs:
//   const m = await import('/src/modules/demo/scan.ts'); await m.scanSeeds([1, 2, 3])
import type { WorldLayer } from '../../core/types';
import { WorldModel } from '../../core/world';
import { chunkCells, edgeVector, hexRound, hexToWorld, worldToAxial } from '../../core/hex';
import { HEX_SCALE, LEVEL_H, WATER_DROP } from '../../core/units';
import { planChunk } from '../nature/place';
import type { ProtoSet } from '../nature/protos';
import { bindPlanner } from '../villages/plan';
import { planDemo } from './plan';
import { lazyCover } from './score';

interface Kfb { engine: { world: WorldModel; ctx: { services: { get<T>(n: string): T | undefined } } } }

/** Terrain's ground height (planar ramps, water surface) for a world without a terrain builder. */
function heightOf(w: WorldModel, x: number, z: number): number {
  const a = worldToAxial(x, z);
  const h = hexRound(a.q, a.r);
  const c = w.cell(h.q, h.r);
  const top = c.level * LEVEL_H;
  if (c.water) return top - WATER_DROP;
  if (c.slope) {
    const ctr = hexToWorld(h.q, h.r);
    const v = edgeVector(c.slope.dir);
    const t = ((x - ctr.x) * v.x + (z - ctr.z) * v.z) / HEX_SCALE;
    return top + ((Math.max(-1, Math.min(1, t)) + 1) / 2) * c.slope.steps * LEVEL_H;
  }
  return top;
}

export function worldFor(seed: number): WorldModel {
  const k = (window as unknown as { __kfb: Kfb }).__kfb;
  const layers = (k.engine.world as unknown as { layers: WorldLayer[] }).layers;
  const w = new WorldModel(seed);
  for (const l of layers) w.registerLayer(l);
  w.heightProvider = (x, z) => heightOf(w, x, z);
  return w;
}

export function scanSeed(seed: number, opts: { radius?: number; top?: number } = {}) {
  const k = (window as unknown as { __kfb: Kfb }).__kfb;
  const protos = k.engine.ctx.services.get<{ protos(): ProtoSet | null }>('nature')?.protos() ?? null;
  const t0 = performance.now();
  const w = k.engine.world.seed === seed ? k.engine.world : worldFor(seed);
  // bind the per-seed village planner exactly like the villages module's init does (the layer binds lazily)
  bindPlanner(seed, (q, r) => w.cellAt(3, q, r));
  w.cell(0, 0);
  const cover = protos
    ? lazyCover((cx, cz) => planChunk({ seed, cell: (q, r) => w.cell(q, r), heightAt: (x, z) => w.heightAt(x, z) }, protos, cx, cz, [...chunkCells(cx, cz)]).crowns)
    : null;
  const plan = planDemo(w, { cover, radius: opts.radius, top: opts.top });
  return {
    seed,
    ms: Math.round(performance.now() - t0),
    timing: plan.timing,
    coverChunks: cover?.chunks ?? 0,
    village: plan.village,
    best: plan.candidates[0] ?? null,
    candidates: plan.candidates,
    route: {
      toBridge: plan.route.toBridge?.length ?? null,
      toForest: plan.route.toForest?.length ?? null,
      toForestBeyondBridge: plan.route.toForestBeyondBridge?.length ?? null,
      demoPath: plan.demoPath?.length ?? null,
    },
  };
}

export async function scanSeeds(seeds: number[], opts: { radius?: number; top?: number } = {}) {
  const out = [];
  for (const s of seeds) {
    try {
      out.push(scanSeed(s, opts));
    } catch (e) {
      out.push({ seed: s, error: String((e as Error)?.stack ?? e) });
    }
    await new Promise((r) => setTimeout(r, 0));
  }
  return out;
}
