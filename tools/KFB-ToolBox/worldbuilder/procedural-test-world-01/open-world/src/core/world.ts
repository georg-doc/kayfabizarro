import { surfaceFor } from './surface';
// Layered, memoised world model. Pure function of (seed, q, r). See ARCHITECTURE.md §4.
import type { CellData, WorldLayer, WorldLayerCtx } from './types';
import { worldToAxial, hexToWorld, hexRound, edgeVector } from './hex';
import { LEVEL_H, HEX_SIZE, WATER_DROP } from './units';

function blankCell(q: number, r: number): CellData {
  return {
    q, r, level: 0, biome: 'grass', water: false, coastMask: 0, slope: null,
    roadMask: 0, riverMask: 0, bridge: false, village: null, building: null,
    reserved: false, forest: 0, tags: [],
  };
}

function cloneCell(c: CellData): CellData {
  return {
    ...c,
    slope: c.slope ? { ...c.slope } : null,
    village: c.village ? { ...c.village } : null,
    building: c.building ? { ...c.building } : null,
    tags: c.tags.slice(),
  };
}

/** Per-stage memo size; on overflow the oldest quarter is evicted (Map keeps insertion order) — never a full clear. */
const MAX_CACHE = 160000;
/** Numeric cell key (|q|,|r| < 2^20). */
const cellKey = (q: number, r: number) => (q + 1048576) * 2097152 + (r + 1048576);

/**
 * A layer may throw an object with `kfbRetry === true` to mean "not computable right now, try again later"
 * (e.g. roads' prefetch-step control flow). The world model rethrows it without memoising the cell and without
 * disabling the layer. Any module catching errors around world/roads queries must rethrow such objects too.
 */
export function isRetrySignal(e: unknown): boolean {
  return !!e && typeof e === 'object' && (e as { kfbRetry?: unknown }).kfbRetry === true;
}

export class WorldModel {
  readonly seed: number;
  private layers: WorldLayer[] = [];
  /** stageIndex → key → cell after layers[0..stageIndex] */
  private memo: Map<number, CellData>[] = [];
  private caches = new Map<string, Map<string, unknown>>();
  /** Layer ids that threw at least once (disabled). */
  readonly failedLayers = new Set<string>();
  /** Diagnostics: inclusive ms spent in each layer's apply() (self time; nested earlier-stage lookups excluded). */
  readonly layerMs: Record<string, number> = {};
  private layerStack: { id: string; t0: number; child: number }[] = [];

  constructor(seed: number) {
    this.seed = seed;
  }

  registerLayer(layer: WorldLayer): void {
    this.layers.push(layer);
    this.layers.sort((a, b) => a.stage - b.stage);
    this.memo = this.layers.map(() => new Map());
  }

  get layerIds(): string[] {
    return this.layers.map((l) => `${l.stage}:${l.id}`);
  }

  /** Final cell after all layers. */
  cell(q: number, r: number): Readonly<CellData> {
    return this.computeUpTo(this.layers.length - 1, q, r);
  }

  /** Cell after all layers with stage < `stage`. */
  cellAt(stage: number, q: number, r: number): Readonly<CellData> {
    let idx = -1;
    for (let i = 0; i < this.layers.length; i++) if (this.layers[i].stage < stage) idx = i;
    return this.computeUpTo(idx, q, r);
  }

  private computeUpTo(idx: number, q: number, r: number): CellData {
    if (idx < 0) return blankCell(q, r);
    const key = cellKey(q, r);
    const m = this.memo[idx];
    const hit = m.get(key);
    if (hit) return hit;
    const prev = this.computeUpTo(idx - 1, q, r);
    const cell = cloneCell(prev);
    const layer = this.layers[idx];
    if (!this.failedLayers.has(layer.id)) {
      const frame = { id: layer.id, t0: performance.now(), child: 0 };
      this.layerStack.push(frame);
      try {
        layer.apply(cell, this.ctxFor(layer));
      } catch (e) {
        if (isRetrySignal(e)) throw e;
        this.failedLayers.add(layer.id);
        console.warn(`[module:${layer.id}] world layer threw; layer disabled`, e);
        Object.assign(cell, cloneCell(prev));
      } finally {
        this.layerStack.pop();
        const total = performance.now() - frame.t0;
        this.layerMs[layer.id] = (this.layerMs[layer.id] ?? 0) + (total - frame.child);
        const parent = this.layerStack[this.layerStack.length - 1];
        if (parent) parent.child += total;
      }
    }
    if (m.size > MAX_CACHE) {
      let drop = MAX_CACHE >> 2;
      for (const k of m.keys()) {
        m.delete(k);
        if (--drop <= 0) break;
      }
    }
    m.set(key, cell);
    return cell;
  }

  private ctxCache = new Map<string, WorldLayerCtx>();
  private ctxFor(layer: WorldLayer): WorldLayerCtx {
    let ctx = this.ctxCache.get(layer.id);
    if (!ctx) {
      let cache = this.caches.get(layer.id);
      if (!cache) this.caches.set(layer.id, (cache = new Map()));
      ctx = {
        seed: this.seed,
        cellAt: (stage, q, r) => {
          if (stage > layer.stage) throw new Error(`layer ${layer.id} may not read stage ${stage}`);
          return this.cellAt(stage, q, r);
        },
        cache,
      };
      this.ctxCache.set(layer.id, ctx);
    }
    return ctx;
  }

  /** Top-of-tile height of a cell centre in metres (water cells: water surface). */
  cellTop(c: Readonly<CellData>): number {
    const w=hexToWorld(c.q,c.r); return surfaceFor(this.seed).heightAt(w.x,w.z);
  }

  get surface() {return surfaceFor(this.seed);}
  /** Compatibility slot for archived diagnostic modules; active consumers use Surface Truth. */
  heightProvider: ((x:number,z:number)=>number)|null=null;
  heightAt(x:number,z:number):number {return surfaceFor(this.seed).heightAt(x,z);}
  defaultHeightAt(x:number,z:number):number {return this.heightAt(x,z);}
  invalidateDerived():void {for(const m of this.memo)m.clear();for(const c of this.caches.values())c.clear();}
}
