// Stage-1 terrain generator. Pure function of (seed, q, r): every result is derived from seeded noise and from
// per-feature / per-lake data keyed by macro cells, so chunks agree at their borders and the answer never depends on
// query order.
//
// Look target: KayKit Medieval Hexagon sample2 — distinct LANDFORMS framing flat meadows:
//   * gentle lowland (level 0..2, long single-step contours),
//   * mesas (flat-topped plateaus 1–2 steps, sometimes a second tier),
//   * stacked hills (2–4 narrow terraces, rocky crown on the tall ones),
//   * rocky ridges in the highlands (elongated, terraced, mountain crown),
//   * lakes made of overlapping hex discs (straight KayKit-friendly shores, bays where discs meet).
// Landforms come from a jittered macro grid (one candidate per FEAT×FEAT cells) and are combined with max().
//
// Performance (perf pass, 2026-10-06): every per-cell stage (river, lowland, landform sample, raw level, the three
// clean-up passes, pre-ramp level, ramp candidate, ramp winner, rocky-neighbour count, final cell) is memoised in
// 32×32-cell tiles of typed arrays (packed ints, -1/-2 = not yet computed) keyed by a numeric tile id — no string keys,
// no per-cell objects except the final TerrainCell / RiverInfo handed out. Each value is computed lazily, exactly once,
// by the SAME arithmetic as before (fastrng.ts = fixed-arity copies of core/rng), so results are bit-identical to the
// pre-perf generator (identity hashes in NOTES.md). Ramp candidates are memoised (they were recomputed 37× per cell),
// feature / knoll / lake neighbourhoods are cached per macro cell, lake distance fields are typed rasters.
import { hash, rand01, strSeed } from '../../core/rng';
import { DIRS, hexDistance, hexToWorld, SQRT3 } from '../../core/hex';
import { HEX_SIZE, HEX_WIDTH } from '../../core/units';
import type { Biome } from '../../core/types';
import { Fbm, hash3, hash4, seedMix, simplex2m } from './fastrng';

/** Highest terrain level produced. */
export const MAX_LEVEL = 7;
/** Kept for API compatibility: rocky/mountain cells are flagged by biome, not by level. */
export const MOUNTAIN_LEVEL = 5;
export const HILL_LEVEL = 4;

/** Decoration terrain draws on a cell (hex pack nature pieces). All of them are solid. */
export type TerrainDeco = { kind: 'mountain' | 'hills'; asset: string; rot: number };

export interface TerrainCell {
  level: number;
  water: boolean;
  coastMask: number;
  slope: { dir: number; steps: 1 } | null;
  biome: Biome;
  forest: number;
  deco: TerrainDeco | null;
  /** Hex distance to the nearest lake water cell (0 = water, 99 = far). */
  lakeDist: number;
  /** Max level difference to a higher land neighbour (cliff above this cell), 0 if none. */
  cliffUp: number;
  /** Landform the cell belongs to ('' = lowland). */
  form: '' | 'mesa' | 'hill' | 'ridge';
}

type FormKind = 'mesa' | 'hill' | 'ridge';
interface Feature {
  kind: FormKind;
  /** kind as FORM code (1 mesa, 2 hill, 3 ridge) */
  k: number;
  /** centre in cell units (world / HEX_WIDTH) */
  cx: number; cz: number;
  R: number; H: number;
  tier2: boolean;
  /** ridge axis (unit) and half length (cell units) */
  ax: number; az: number; len: number;
  seed: number;
  /** pre-mixed warp noise seeds (seedMix(seed), seedMix(seed ^ 0x9e37)) */
  hsA: number; hsB: number;
  /** cheap-reject half box (cell units) */
  reach: number;
  /** largest step contribution evalFeature can return (mesa H (+1 tier), hill/ridge STEP·H) */
  maxS: number;
  /** (outermost ring radius · R)² · (1 + 1e-9): beyond it evalFeature returns 0 */
  outR2: number;
}
interface Knoll { cx: number; cz: number; R: number; seed: number; ax: number; az: number; len: number; hsA: number; hsB: number }

interface Lake {
  id: number;
  level: number;
  /** hex distance to the lake's water (≤ LAKE_RING), -1 = farther; raster over [q0..q1]×[r0..r1], row stride W */
  D: Int16Array;
  W: number;
  q0: number; r0: number; q1: number; r1: number;
}
interface LakeBox { I: number; J: number; q0: number; q1: number; r0: number; r1: number }
interface LakeParams { cq: number; cr: number; R: number; prio: number; discs: [number, number, number][] }
interface Pre { level: number; water: boolean; lakeDist: number; rocky: boolean; form: FormKind | ''; H: number; s: number; top: boolean; d: number }

/** River centre lines are RIVER_SPACING cells apart (≈ 560 m), meander by ±RIVER_WARP cells over RIVER_WARP_L cells. */
export const RIVER_SPACING = 37;
const RIVER_WARP = 7;
const RIVER_WARP_L = 42;
/** Corridor half width (cells) forced to river level; lakes keep ≥ 3.6 cells from the centre line. */
export const RIVER_HALF_WIDTH = 1.7;
export interface RiverInfo {
  /** On the single-cell centre chain the river follows. */
  onCentre: boolean;
  /** Inside the flat river valley (centre ± ~1.7 cells): level forced, no water/coast/ramps/rock. */
  corridor: boolean;
  /** Approximate distance to the centre line in cells. */
  dist: number;
  /** Valley level (always 0). */
  level: number;
  /** Which river (index of the iso-line); neighbouring rivers differ by 1. */
  id: number;
}

const FEAT = 10;
/** Knoll grid (small one-step rises on the plain). */
const KNOLL = 6;
/** Height of one hill/ridge terrace in levels: tall, clean stacked cliffs (sample1/sample2 rock islands). */
const STEP = 2; // landform macro grid (cells)
const LAKE_MACRO = 22; // lake candidate grid (cells)
const LAKE_RING = 6;

// ---------------------------------------------------------------- cell-centre coordinates (=== hexToWorld / HEX_WIDTH)
const KX = HEX_SIZE * SQRT3;
const KZ = HEX_SIZE * 1.5;
const cellX = (q: number, r: number) => (KX * (q + r / 2)) / HEX_WIDTH;
const cellZ = (r: number) => (KZ * r) / HEX_WIDTH;

// ---------------------------------------------------------------- tile memo (32×32 cells, numeric keys)
const TB = 5;
const TW = 1 << TB;
const TM = TW - 1;
const TN = TW * TW;
/**
 * Tiles kept per memo before it is cleared (pure data → clearing only costs recomputation): typed memos ≈ 53 KB per
 * tile set → ≤ 55 MB; the object memos (TerrainCell / RiverInfo) are capped lower (≤ 512k objects, as before ~250k).
 * Boot of `/` (seed 123) touches ≈ 370–420 tiles per memo.
 */
const TILE_CAP = 1024;
const OBJ_TILE_CAP = 512;
const tidx = (q: number, r: number) => ((r & TM) << TB) | (q & TM);
const DQ = DIRS.map((d) => d[0]);
const DR = DIRS.map((d) => d[1]);
const FORMS: ('' | FormKind)[] = ['', 'mesa', 'hill', 'ridge'];

class Tiles<A> {
  private m = new Map<number, A>();
  // two most recent tiles (neighbour reads along a tile border alternate between two tiles)
  private k0 = NaN;
  private t0: A | null = null;
  private k1 = NaN;
  private t1: A | null = null;
  constructor(private make: () => A, private cap = TILE_CAP) {}
  get(q: number, r: number): A {
    const k = (q >> TB) * 131072 + (r >> TB);
    if (k === this.k0) return this.t0!;
    let t: A | undefined;
    if (k === this.k1) t = this.t1!;
    else {
      t = this.m.get(k);
      if (t === undefined) {
        if (this.m.size >= this.cap) this.clear();
        t = this.make();
        this.m.set(k, t);
      }
    }
    this.k1 = this.k0;
    this.t1 = this.t0;
    this.k0 = k;
    this.t0 = t;
    return t;
  }
  clear(): void {
    this.m.clear();
    this.k0 = this.k1 = NaN;
    this.t0 = this.t1 = null;
  }
  get size(): number {
    return this.m.size;
  }
}
const i8 = (fill: number) => () => new Int8Array(TN).fill(fill);
const i32 = () => new Int32Array(TN).fill(-1);
const f64nan = () => new Float64Array(TN).fill(NaN);

// packed landform sample: s (0..15) | kind << 4 | H << 6 | rocky << 9 | top << 10
const SM_S = (v: number) => v & 15;
const SM_K = (v: number) => (v >> 4) & 3;
const SM_H = (v: number) => (v >> 6) & 7;
const SM_ROCKY = (v: number) => (v >> 9) & 1;
const SM_TOP = (v: number) => (v >> 10) & 1;
// packed pre-ramp cell: level (0..15) | water << 4 | rocky << 5 | top << 6 | form << 7 | lakeDist << 9
const P_LV = (v: number) => v & 15;
const P_W = (v: number) => (v >> 4) & 1;
const P_ROCKY = (v: number) => (v >> 5) & 1;
const P_TOP = (v: number) => (v >> 6) & 1;
const P_FORM = (v: number) => (v >> 7) & 3;
const P_LD = (v: number) => (v >> 9) & 127;
const packPre = (level: number, water: number, rocky: number, top: number, form: number, lakeDist: number) =>
  level | (water << 4) | (rocky << 5) | (top << 6) | (form << 7) | (lakeDist << 9);

export class TerrainGen {
  private sH: number; private sE: number; private sF: number; private sL: number; private sD: number; private sR: number; private sFt: number;
  // macro-cell memos (numeric keys I * 131072 + J)
  private featMemo = new Map<number, Feature | null>();
  private knollMemo = new Map<number, Knoll | null>();
  private lakeMemo = new Map<number, Lake | null>();
  private lpMemo = new Map<number, LakeParams | null>();
  // per-cell tile memos
  private uT = new Tiles(f64nan); // riverU at the cell centre
  private rivT = new Tiles(() => new Array<RiverInfo | undefined>(TN), OBJ_TILE_CAP); // public RiverInfo objects
  private rvT = new Tiles(() => ({ f: new Int8Array(TN).fill(-1), dist: new Float64Array(TN), id: new Int32Array(TN) }));
  private lowT = new Tiles(i8(-1));
  private smT = new Tiles(() => ({ p: new Int32Array(TN).fill(-1), d: new Float64Array(TN) }));
  private rawT = new Tiles(i8(-1));
  private b1T = new Tiles(i8(-1));
  private b2T = new Tiles(i8(-1));
  private baseT = new Tiles(i8(-1));
  private preT = new Tiles(i32);
  private rcT = new Tiles(() => ({ dir: new Int8Array(TN).fill(-2), score: new Float64Array(TN) }));
  private rdT = new Tiles(i8(-2));
  private rnT = new Tiles(i8(-2));
  private cellT = new Tiles(() => new Array<TerrainCell | undefined>(TN), OBJ_TILE_CAP);

  constructor(readonly seed: number) {
    this.sH = hash(seed, strSeed('terrain.height'));
    this.sE = hash(seed, strSeed('terrain.elev'));
    this.sF = hash(seed, strSeed('terrain.forest'));
    this.sL = hash(seed, strSeed('terrain.lake'));
    this.sD = hash(seed, strSeed('terrain.deco'));
    this.sR = hash(seed, strSeed('terrain.ramp'));
    this.sFt = hash(seed, strSeed('terrain.feature'));
    this.sRv = hash(seed, strSeed('terrain.river'));
    const a = rand01(this.sRv, 1) * Math.PI;
    this.rvAx = Math.cos(a);
    this.rvAz = Math.sin(a);
    // seeded phase: the origin lies 25–75 % of the way between two rivers (never on one)
    this.rvOff = RIVER_SPACING * (0.25 + 0.5 * rand01(this.sRv, 2));
    this.fbmRv = new Fbm(this.sRv, 2, 2, 0.45);
    this.fbmE = new Fbm(this.sE, 3, 2, 0.45);
    this.fbmH = new Fbm(this.sH, 2, 2, 0.4);
    this.fbmF = new Fbm(this.sF, 3, 2, 0.5);
  }
  // === fbm2(seed, …, octaves, lac, gain) of the original call sites, constants precomputed
  private fbmRv: Fbm;
  private fbmE: Fbm;
  private fbmH: Fbm;
  private fbmF: Fbm;

  /** Memo sizes in tiles (diagnostics). */
  memoStats(): Record<string, number> {
    return { pre: this.preT.size, raw: this.rawT.size, cell: this.cellT.size, river: this.rvT.size, rampCand: this.rcT.size };
  }

  // ---------------------------------------------------------------- river corridors
  private sRv: number;
  private rvAx: number;
  private rvAz: number;
  private rvOff: number;

  /** Warped coordinate across the rivers (cell units); river centre lines are its multiples of RIVER_SPACING. */
  private riverU(x: number, z: number): number {
    return x * this.rvAx + z * this.rvAz + RIVER_WARP * this.fbmRv.at(x / RIVER_WARP_L + 17.3, z / RIVER_WARP_L - 4.1) + this.rvOff;
  }

  /** Continuous corridor contribution; old Hex metadata remains topology-only. */
  riverDistanceWorld(x:number,z:number):number {const u=this.riverU(x/HEX_WIDTH,z/HEX_WIDTH);return Math.abs(u-Math.round(u/RIVER_SPACING)*RIVER_SPACING)*HEX_WIDTH;}

  /** riverU at the centre of cell (q, r), memoised (shared by river() and the centre-chain side test). */
  private uAt(q: number, r: number): number {
    const t = this.uT.get(q, r), i = tidx(q, r);
    let u = t[i];
    if (u !== u) t[i] = u = this.riverU(cellX(q, r), cellZ(r));
    return u;
  }

  /** sin(π·u/S) at a cell centre: ≥ 0 on the + side of a river line. */
  private side(q: number, r: number): number {
    return Math.sin((Math.PI * this.uAt(q, r)) / RIVER_SPACING);
  }

  /**
   * River corridor info of a cell. Rivers are the iso-lines u = k·RIVER_SPACING of a warped, seed-rotated coordinate:
   * endless, gently meandering, never closing, never crossing, about RIVER_SPACING cells (≈ 560 m) apart.
   * O(1) amortised: memoised per cell in tiles.
   */
  river(q: number, r: number): RiverInfo {
    const t = this.rivT.get(q, r), i = tidx(q, r);
    let v = t[i];
    if (v !== undefined) return v;
    const f = this.riverF(q, r);
    const rt = this.rvT.get(q, r);
    v = { onCentre: (f & 1) === 1, corridor: (f & 2) === 2, dist: rt.dist[i], level: 0, id: rt.id[i] };
    t[i] = v;
    return v;
  }

  /** River flags of a cell (bit 0 onCentre, bit 1 corridor); dist / id stay in the rvT tile. */
  private riverF(q: number, r: number): number {
    const t = this.rvT.get(q, r), i = tidx(q, r);
    const fl = t.f[i];
    if (fl >= 0) return fl;
    const x = cellX(q, r), z = cellZ(r);
    const u = this.uAt(q, r);
    const f = u / RIVER_SPACING;
    const frac = f - Math.round(f);
    let dist = Math.abs(frac) * RIVER_SPACING;
    if (dist < 6) {
      // only near a line: correct by the gradient of the warped coordinate (cost: 4 extra noise samples)
      const e = 0.35;
      const gx = (this.riverU(x + e, z) - this.riverU(x - e, z)) / (2 * e);
      const gz = (this.riverU(x, z + e) - this.riverU(x, z - e)) / (2 * e);
      dist /= Math.max(0.3, Math.hypot(gx, gz));
    } else dist /= 1.6; // conservative (|grad| <= ~1.6): far cells stay far
    // single-cell centre chain: cells on the + side of a line with a neighbour on the − side
    let onCentre = false;
    if (dist < 2 && this.side(q, r) >= 0) for (let d = 0; d < 6; d++) if (this.side(q + DQ[d], r + DR[d]) < 0) { onCentre = true; break; }
    const v = (onCentre ? 1 : 0) | (onCentre || dist <= RIVER_HALF_WIDTH ? 2 : 0);
    // uAt/side may have evicted rvT tiles: write through the tile fetched now
    const t2 = this.rvT.get(q, r);
    t2.f[i] = v;
    t2.dist[i] = dist;
    t2.id[i] = Math.round(f);
    return v;
  }

  /** === river(q, r).dist */
  private riverDist(q: number, r: number): number {
    this.riverF(q, r);
    return this.rvT.get(q, r).dist[tidx(q, r)];
  }

  /** Inside a river valley corridor (=== river(q, r).corridor). */
  private corr(q: number, r: number): boolean {
    return (this.riverF(q, r) & 2) === 2;
  }

  /** Macro elevation 0..1 (lowland .. highland) at cell-unit coords. */
  elev(x: number, z: number): number {
    return Math.min(1, Math.max(0, 0.5 + 0.62 * this.fbmE.at(x / 75, z / 75)));
  }

  // ---------------------------------------------------------------- landform features
  private feature(I: number, J: number): Feature | null {
    const fk = I * 131072 + J;
    const m = this.featMemo.get(fk);
    if (m !== undefined) return m;
    let f: Feature | null = null;
    const h = (salt: number) => rand01(this.sFt, I, J, salt);
    const q = I * FEAT + 2 + h(1) * (FEAT - 4), r = J * FEAT + 2 + h(2) * (FEAT - 4);
    const w = hexToWorld(q, r);
    const cx = w.x / HEX_WIDTH, cz = w.z / HEX_WIDTH;
    const E = this.elev(cx, cz);
    const u = h(3);
    let kind: FormKind | null = null;
    if (E < 0.42) kind = u < 0.12 ? null : u < 0.62 ? 'mesa' : 'hill';
    else if (E < 0.62) kind = u < 0.05 ? null : u < 0.45 ? 'mesa' : 'hill';
    else kind = u < 0.2 ? 'mesa' : u < 0.6 ? 'hill' : 'ridge';
    if (kind) {
      let R = kind === 'mesa' ? 3 + h(4) * 3.5 : kind === 'hill' ? 4 + h(4) * 3.5 : 2.4 + h(4) * 1.2;
      // mesa: H = wall height in levels (1 or 2). hill/ridge: H = number of terraces, each STEP levels tall.
      const H = kind === 'mesa' ? (h(5) < 0.6 ? 1 : 2) : kind === 'hill' ? (E < 0.42 ? 1 + Math.floor(h(5) * 2) : 2 + Math.floor(h(5) * 1.6)) : 2 + Math.floor(h(5) * 1.6);
      if (kind === 'hill') R = Math.max(R, H * 1.8 + 0.8); // terraces at least ~1.6 cells wide
      const a = h(6) * Math.PI;
      const len = 3 + h(8) * 4;
      const seed = hash(this.sFt, I, J, 9);
      f = {
        kind, k: FORMS.indexOf(kind), cx, cz, R, H, tier2: kind === 'mesa' && H === 1 && R > 3.8 && h(7) < 0.6, ax: Math.cos(a), az: Math.sin(a), len, seed,
        hsA: seedMix(seed), hsB: seedMix(seed ^ 0x9e37),
        // cheap reject before the domain warp (warp displaces by ≤ 1.25·√2 cells)
        reach: (kind === 'ridge' ? len : 0) + R * (kind !== 'mesa' && H >= 2 ? 1.32 : 1) + 1.9,
        maxS: 0,
        outR2: 0,
      };
      const outR = (kind !== 'mesa' && H >= 2 ? 1.32 : 1) * R;
      f.outR2 = outR * outR * (1 + 1e-9);
      f.maxS = kind === 'mesa' ? H + (f.tier2 ? 1 : 0) : STEP * H;
      // keep landforms away from lakes (lakes keep a gentle valley around them)
      const reach = kind === 'ridge' ? f.len + R : R;
      const LI = Math.floor(q / LAKE_MACRO), LJ = Math.floor(r / LAKE_MACRO);
      for (let a2 = -1; a2 <= 1 && f; a2++)
        for (let b2 = -1; b2 <= 1 && f; b2++) {
          const lp = this.lakeAccepted(LI + a2, LJ + b2);
          if (!lp) continue;
          const lw = hexToWorld(lp.cq, lp.cr);
          if (Math.hypot(lw.x / HEX_WIDTH - cx, lw.z / HEX_WIDTH - cz) < lp.R + reach * 0.45 + 1) f = null;
        }
    }
    this.featMemo.set(fk, f);
    return f;
  }

  /** 3×3 features around macro cell (I, J), in (a outer, b inner) order — cached for the last macro cell. */
  private f9K = NaN;
  private f9: (Feature | null)[] = [];
  private feats9(I: number, J: number): (Feature | null)[] {
    const k = I * 131072 + J;
    if (k === this.f9K) return this.f9;
    const out: (Feature | null)[] = [];
    for (let a = -1; a <= 1; a++) for (let b = -1; b <= 1; b++) out.push(this.feature(I + a, J + b));
    this.f9K = k;
    this.f9 = out;
    return out;
  }

  private evalD = 0;
  /** Landform step contribution s of feature f at cell-unit (x, z); the normalised distance lands in this.evalD. */
  private evalFeature(f: Feature, x: number, z: number): number {
    if (Math.abs(x - f.cx) > f.reach || Math.abs(z - f.cz) > f.reach) {
      this.evalD = 9;
      return 0;
    }
    // domain warp → organic but still blocky outlines
    const wx = x + 1.25 * simplex2m(f.hsA, x / 4.5, z / 4.5);
    const wz = z + 1.25 * simplex2m(f.hsB, x / 4.5, z / 4.5);
    let a: number, b: number;
    if (f.kind === 'ridge') {
      const px = wx - f.cx, pz = wz - f.cz;
      const t = Math.max(-f.len, Math.min(f.len, px * f.ax + pz * f.az));
      a = px - t * f.ax;
      b = pz - t * f.az;
    } else {
      a = wx - f.cx;
      b = wz - f.cz;
    }
    // clearly beyond the outermost ring (d ≥ outR ⇒ s = 0): skip the (slow) hypot. The 1e-9 relative margin dwarfs
    // the few-ulp difference between a²+b² and hypot², so this never changes a result.
    if (a * a + b * b > f.outR2) return 0;
    const d = Math.hypot(a, b) / f.R;
    this.evalD = d;
    if (f.kind !== 'mesa' && f.H >= 2 && d >= 1 && d < 1.32) return 1; // foothill skirt (one step)
    if (d >= 1) return 0;
    if (f.kind === 'mesa') return f.H + (f.tier2 && d < 0.48 ? 1 : 0);
    return STEP * Math.min(f.H, Math.max(1, Math.ceil(f.H * (1 - d))));
  }

  /** Strongest landform contribution at a cell (packed, see SM_*); its d is stored alongside. */
  private sample(q: number, r: number): number {
    const t = this.smT.get(q, r), i = tidx(q, r);
    const p = t.p[i];
    if (p >= 0) return p;
    let vs = 0, vk = 0, vH = 0, vRocky = 0, vTop = 0, vd = 1;
    const x = cellX(q, r), z = cellZ(r);
    const fs = this.feats9(Math.floor(q / FEAT), Math.floor(r / FEAT));
    for (let n = 0; n < 9; n++) {
      const f = fs[n];
      // a feature that cannot beat the current maximum is never evaluated (s ≤ maxS; ties keep the earlier one)
      if (!f || f.maxS <= vs) continue;
      const s = this.evalFeature(f, x, z);
      if (s > vs) {
        const d = this.evalD;
        const top = f.kind !== 'mesa' && s >= STEP * f.H;
        // rocky crown only at the summit core, so mountains never stand on the cliff edge of a terrace
        const rocky = top && ((f.kind === 'ridge' && d < 0.6) || (f.kind === 'hill' && f.H >= 2 && d < 0.3));
        vs = s; vk = f.k; vH = f.H; vRocky = rocky ? 1 : 0; vTop = top ? 1 : 0; vd = d;
      }
    }
    if (vs === 0) {
      // small rolling one-step knolls scattered over the plain (finer grid)
      const ks = this.knolls9(Math.floor(q / KNOLL), Math.floor(r / KNOLL));
      for (let n = 0; n < 9 && vs === 0; n++) {
        const kn = ks[n];
        if (!kn) continue;
        const kr = kn.len + kn.R + 1.2;
        if (Math.abs(x - kn.cx) > kr || Math.abs(z - kn.cz) > kr) continue;
        const wx = x + 0.8 * simplex2m(kn.hsA, x / 2.5, z / 2.5), wz = z + 0.8 * simplex2m(kn.hsB, x / 2.5, z / 2.5);
        // capsule: low connected ridges / rolling one-step hills
        const px = wx - kn.cx, pz = wz - kn.cz;
        const tt = Math.max(-kn.len, Math.min(kn.len, px * kn.ax + pz * kn.az));
        const dd = Math.hypot(px - tt * kn.ax, pz - tt * kn.az) / kn.R;
        if (dd < 1) { vs = 1; vk = 1; vH = 1; vRocky = 0; vTop = 0; vd = dd; }
      }
    }
    const v = vs | (vk << 4) | (vH << 6) | (vRocky << 9) | (vTop << 10);
    t.p[i] = v;
    t.d[i] = vd;
    return v;
  }

  private knoll(I: number, J: number): Knoll | null {
    const kk = I * 131072 + J;
    const m = this.knollMemo.get(kk);
    if (m !== undefined) return m;
    let res: Knoll | null = null;
    const h = (salt: number) => rand01(this.sFt ^ 0x6b6e, I, J, salt);
    if (h(1) < 0.72) {
      const q = I * KNOLL + 1 + h(2) * (KNOLL - 2), r = J * KNOLL + 1 + h(3) * (KNOLL - 2);
      const w = hexToWorld(q, r);
      const cx = w.x / HEX_WIDTH, cz = w.z / HEX_WIDTH;
      const a = h(5) * Math.PI;
      const seed = hash(this.sFt, I, J, 77);
      res = { cx, cz, R: 1.6 + h(4) * 1.3, seed, ax: Math.cos(a), az: Math.sin(a), len: h(6) * 3.8, hsA: seedMix(seed), hsB: seedMix(seed ^ 0x51ed) };
      const LI = Math.floor(q / LAKE_MACRO), LJ = Math.floor(r / LAKE_MACRO);
      for (let a = -1; a <= 1 && res; a++)
        for (let b = -1; b <= 1 && res; b++) {
          const lp = this.lakeAccepted(LI + a, LJ + b);
          if (!lp) continue;
          const lw = hexToWorld(lp.cq, lp.cr);
          if (Math.hypot(lw.x / HEX_WIDTH - cx, lw.z / HEX_WIDTH - cz) < lp.R + 3.5 + res.len) res = null;
        }
    }
    this.knollMemo.set(kk, res);
    return res;
  }

  private k9K = NaN;
  private k9: (Knoll | null)[] = [];
  private knolls9(I: number, J: number): (Knoll | null)[] {
    const k = I * 131072 + J;
    if (k === this.k9K) return this.k9;
    const out: (Knoll | null)[] = [];
    for (let a = -1; a <= 1; a++) for (let b = -1; b <= 1; b++) out.push(this.knoll(I + a, J + b));
    this.k9K = k;
    this.k9 = out;
    return out;
  }

  /** Gentle lowland level 0..1. */
  private lowland(q: number, r: number): number {
    const t = this.lowT.get(q, r), i = tidx(q, r);
    let v = t[i];
    if (v < 0) {
      const x = cellX(q, r), z = cellZ(r);
      // one broad step between plain and upland — the landforms provide the relief
      t[i] = v = this.elev(x, z) + 0.12 * this.fbmH.at(x / 30, z / 30) > 0.55 ? 1 : 0;
    }
    return v;
  }

  private raw(q: number, r: number): number {
    const t = this.rawT.get(q, r), i = tidx(q, r);
    let v = t[i];
    if (v < 0) t[i] = v = this.corr(q, r) ? 0 : Math.min(MAX_LEVEL, this.bankCap(q, r), this.lowland(q, r) + SM_S(this.sample(q, r)));
    return v;
  }

  private base1(q: number, r: number): number {
    const t = this.b1T.get(q, r), i = tidx(q, r);
    let v = t[i];
    if (v < 0)
      t[i] = v = clean(this.raw(q, r), this.raw(q + 1, r), this.raw(q + 1, r - 1), this.raw(q, r - 1), this.raw(q - 1, r), this.raw(q - 1, r + 1), this.raw(q, r + 1));
    return v;
  }

  private base2(q: number, r: number): number {
    const t = this.b2T.get(q, r), i = tidx(q, r);
    let v = t[i];
    if (v < 0)
      t[i] = v = clean(this.base1(q, r), this.base1(q + 1, r), this.base1(q + 1, r - 1), this.base1(q, r - 1), this.base1(q - 1, r), this.base1(q - 1, r + 1), this.base1(q, r + 1));
    return v;
  }

  /** Level after three clean-up passes (before lakes and ramps). */
  baseLevel(q: number, r: number): number {
    const t = this.baseT.get(q, r), i = tidx(q, r);
    let v = t[i];
    if (v < 0)
      t[i] = v = clean(this.base2(q, r), this.base2(q + 1, r), this.base2(q + 1, r - 1), this.base2(q, r - 1), this.base2(q - 1, r), this.base2(q - 1, r + 1), this.base2(q, r + 1));
    return v;
  }

  // ---------------------------------------------------------------- lakes
  private lakeParams(I: number, J: number): LakeParams | null {
    const lk = I * 131072 + J;
    const m = this.lpMemo.get(lk);
    if (m !== undefined) return m;
    let res: LakeParams | null = null;
    const h = (salt: number) => rand01(this.sL, I, J, salt);
    const S = LAKE_MACRO;
    const cq = I * S + 6 + Math.floor(h(2) * (S - 12));
    const cr = J * S + 6 + Math.floor(h(3) * (S - 12));
    const w = hexToWorld(cq, cr);
    const E = this.elev(w.x / HEX_WIDTH, w.z / HEX_WIDTH);
    if (h(1) < 0.72 && E < 0.6) {
      // union of 2..4 overlapping hex discs along a meandering axis → elongated lakes with bays
      const discs: [number, number, number][] = [];
      let q = cq, r = cr;
      let dir = Math.floor(h(4) * 6);
      let rad = 2 + Math.floor(h(5) * 2);
      const n = 2 + Math.floor(h(6) * 2.6);
      discs.push([q, r, rad]);
      for (let i = 1; i < n; i++) {
        const nr = 1 + Math.floor(h(10 + i) * 2.5);
        const step = Math.max(1, rad + nr - 1 - Math.floor(h(20 + i) * 2));
        dir = (dir + [0, 1, 5, 0][Math.floor(h(30 + i) * 4)]) % 6;
        q += DIRS[dir][0] * step;
        r += DIRS[dir][1] * step;
        rad = nr;
        discs.push([q, r, rad]);
      }
      let R = 0;
      for (const [dq, dr, rr] of discs) R = Math.max(R, hexDistance(dq, dr, cq, cr) + rr);
      res = { cq, cr, R, prio: hash(this.sL, I, J, 7), discs };
    }
    this.lpMemo.set(lk, res);
    return res;
  }

  /** Lake params if no higher-priority neighbouring lake conflicts (params only — no terrain reads). */
  private laMemo = new Map<number, LakeParams | null>();
  private lakeAccepted(I: number, J: number): LakeParams | null {
    const k = I * 131072 + J;
    const m = this.laMemo.get(k);
    if (m !== undefined) return m;
    let p = this.lakeParams(I, J);
    if (p)
      for (let a = -1; a <= 1 && p; a++)
        for (let b = -1; b <= 1 && p; b++) {
          if (!a && !b) continue;
          const o = this.lakeParams(I + a, J + b);
          if (o && o.prio > p.prio && hexDistance(o.cq, o.cr, p.cq, p.cr) < o.R + p.R + 9) p = null;
        }
    this.laMemo.set(k, p);
    return p;
  }

  private lake(I: number, J: number): Lake | null {
    const lk = I * 131072 + J;
    const m = this.lakeMemo.get(lk);
    if (m !== undefined) return m;
    const p = this.lakeAccepted(I, J);
    const res = p ? this.rasterLake(I, J, p) : null;
    this.lakeMemo.set(lk, res);
    return res;
  }

  private rasterLake(I: number, J: number, p: LakeParams): Lake | null {
    const M = Math.ceil(p.R) + LAKE_RING + 2;
    const q0 = p.cq - M, q1 = p.cq + M, r0 = p.cr - M, r1 = p.cr + M;
    const W = q1 - q0 + 1, Hh = r1 - r0 + 1;
    const N = W * Hh;
    // flat raster, neighbour d of index i is i + off[d] (interior cells only — every neighbour is inside)
    const off = DIRS.map(([dq, dr]) => dr * W + dq);
    const water = new Uint8Array(N);
    for (let r = r0, i = 0; r <= r1; r++)
      for (let q = q0; q <= q1; q++, i++) for (const [dq, dr, rr] of p.discs) if (hexDistance(q, r, dq, dr) <= rr) { water[i] = 1; break; }
    // clean-up to shapes the coast tiles can represent (one contiguous run of 1..4 water edges per shore cell)
    // (sweep order and in-place updates exactly as before: row-major over the interior, removal pass then fill pass)
    for (let iter = 0; iter < 40; iter++) {
      let changed = false;
      for (let r = 1; r < Hh - 1; r++)
        for (let q = 1, i = r * W + 1; q < W - 1; q++, i++) {
          if (water[i] !== 1) continue;
          let n = 0;
          for (let d = 0; d < 6; d++) if (water[i + off[d]] === 1) n++;
          if (n < 2) { water[i] = 0; changed = true; }
        }
      for (let r = 1; r < Hh - 1; r++)
        for (let q = 1, i = r * W + 1; q < W - 1; q++, i++) {
          if (water[i] === 1) continue;
          let mask = 0;
          for (let d = 0; d < 6; d++) if (water[i + off[d]] === 1) mask |= 1 << d;
          if (mask && !validCoastMask(mask)) { water[i] = 1; changed = true; }
        }
      if (!changed) break;
      if (iter === 39) return null;
    }
    const waterCells: number[] = [];
    for (let i = 0; i < N; i++) if (water[i] === 1) waterCells.push(i);
    if (waterCells.length < 4) return null;
    for (const i of waterCells) if (this.riverDist(q0 + (i % W), r0 + ((i / W) | 0)) < 3.6) return null; // never water near a river
    // multi-source BFS from the water cells = exact hex distance (the raster is unobstructed)
    const D = new Int16Array(N).fill(-1);
    let queue = waterCells.slice();
    for (const i of queue) D[i] = 0;
    for (let d = 1; d <= LAKE_RING && queue.length; d++) {
      const next: number[] = [];
      for (const i of queue) {
        const q = i % W, r = (i / W) | 0;
        for (let k = 0; k < 6; k++) {
          const nq = q + DQ[k], nr = r + DR[k];
          if (nq < 0 || nq >= W || nr < 0 || nr >= Hh) continue;
          const j = i + off[k];
          if (D[j] >= 0) continue;
          D[j] = d;
          next.push(j);
        }
      }
      queue = next;
    }
    let minLevel = 99;
    for (let r = r0, i = 0; r <= r1; r++)
      for (let q = q0; q <= q1; q++, i++) {
        const best = D[i];
        if (best >= 0 && best <= 1) minLevel = Math.min(minLevel, this.baseLevel(q, r));
      }
    return { id: hash(this.sL, I, J) & 0xffff, level: Math.max(0, minLevel), D, W, q0, r0, q1, r1 };
  }

  private l9K = NaN;
  private l9: LakeBox[] = [];
  /**
   * Accepted lakes of the 3×3 lake macro cells around (I, J), in (a outer, b inner) order, with their raster boxes
   * (cq ± M, cr ± M — known from the params alone). Cached for the last macro cell. The raster itself is only built
   * when a queried cell lies inside the box (a raster reads baseLevel along its whole shore).
   */
  private lakes9(I: number, J: number): LakeBox[] {
    const k = I * 131072 + J;
    if (k === this.l9K) return this.l9;
    const out: LakeBox[] = [];
    for (let a = -1; a <= 1; a++)
      for (let b = -1; b <= 1; b++) {
        const p = this.lakeAccepted(I + a, J + b);
        if (!p) continue;
        const M = Math.ceil(p.R) + LAKE_RING + 2;
        out.push({ I: I + a, J: J + b, q0: p.cq - M, q1: p.cq + M, r0: p.cr - M, r1: p.cr + M });
      }
    this.l9K = k;
    this.l9 = out;
    return out;
  }

  /** Nearest lake at (q, r): its level in this.laLevel, returns the hex distance (≤ LAKE_RING) or -1 if none. */
  private laLevel = 0;
  private lakeAt(q: number, r: number): number {
    const ls = this.lakes9(Math.floor(q / LAKE_MACRO), Math.floor(r / LAKE_MACRO));
    let bestD = -1, bestId = 0, bestLevel = 0;
    for (let n = 0; n < ls.length; n++) {
      const B = ls[n];
      if (q < B.q0 || q > B.q1 || r < B.r0 || r > B.r1) continue;
      const L = this.lake(B.I, B.J);
      if (!L) continue;
      const d = L.D[(r - L.r0) * L.W + (q - L.q0)];
      if (d >= 0 && (bestD < 0 || d < bestD || (d === bestD && L.id < bestId))) {
        bestD = d;
        bestId = L.id;
        bestLevel = L.level;
      }
    }
    this.laLevel = bestLevel;
    return bestD;
  }

  // ---------------------------------------------------------------- levels incl. lakes (pre-ramp), packed (P_*)
  private preP(q: number, r: number): number {
    const t = this.preT.get(q, r), i = tidx(q, r);
    let v = t[i];
    if (v < 0) t[i] = v = this.computePre(q, r);
    return v;
  }

  private computePre(q: number, r: number): number {
    const base = this.baseLevel(q, r);
    const sm = this.sample(q, r);
    // a cell belongs to its landform only if the clean-up kept it raised
    const raised = base > this.lowland(q, r);
    const form = raised ? SM_K(sm) : 0;
    const laD = this.lakeAt(q, r);
    const top = raised && SM_TOP(sm) ? 1 : 0;
    const smRocky = raised && SM_ROCKY(sm) ? 1 : 0;
    let v: number;
    if (laD < 0) v = packPre(base, 0, smRocky, top, form, 99);
    else {
      const Lw = this.laLevel;
      if (laD === 0) v = packPre(Lw, 1, 0, 0, 0, 0);
      else if (laD === 1) v = packPre(Lw, 0, 0, 0, 0, 1);
      else {
        const lv = Math.min(base, Lw + laD - 1);
        const keep = lv === base;
        v = packPre(lv, 0, keep ? smRocky : 0, keep ? top : 0, keep ? form : 0, laD);
      }
    }
    if (!P_W(v) && this.corr(q, r)) v = packPre(0, 0, 0, 0, 0, P_LD(v));
    else if (!P_W(v) && P_LV(v) > this.bankCap(q, r)) v = packPre(this.bankCap(q, r), 0, 0, 0, 0, P_LD(v));
    return v;
  }

  /**
   * River valley banks (whole-game r2 integration: rivers ran at the foot of 7.5–11 m walls and were hidden behind the
   * plateau from most angles): the valley rises at most one step per ~1.6 cells away from the river line.
   */
  private bankCap(q: number, r: number): number {
    const d = this.riverDist(q, r);
    return d <= RIVER_HALF_WIDTH + 1.6 ? 1 : d <= RIVER_HALF_WIDTH + 3.2 ? 2 : MAX_LEVEL;
  }

  /** Pre-ramp cell (compat object view of the packed memo). */
  pre(q: number, r: number): Pre {
    const v = this.preP(q, r);
    const sm = this.sample(q, r);
    const t = this.smT.get(q, r);
    const plain = P_LD(v) <= 1 || (!P_W(v) && this.corr(q, r));
    return {
      level: P_LV(v), water: !!P_W(v), lakeDist: P_LD(v), rocky: !!P_ROCKY(v), form: FORMS[P_FORM(v)], top: !!P_TOP(v),
      H: plain ? 0 : SM_H(sm), s: plain ? 0 : SM_S(sm), d: plain ? 1 : t.d[tidx(q, r)],
    };
  }

  /** Rocky cell with enough rocky neighbours to read as a massif (lone rocky cells stay grass). Memoised. */
  private rockyN(q: number, r: number): number {
    const t = this.rnT.get(q, r), i = tidx(q, r);
    let n = t[i];
    if (n !== -2) return n;
    const p = this.preP(q, r);
    if (!P_ROCKY(p)) n = -1;
    else {
      n = 0;
      const lv = P_LV(p);
      for (let d = 0; d < 6; d++) {
        const o = this.preP(q + DQ[d], r + DR[d]);
        if (P_ROCKY(o) && P_LV(o) === lv) n++;
      }
    }
    t[i] = n;
    return n;
  }

  /** A same-level neighbour belongs to a rocky crown (outcrops cluster around crowns, never stand alone). */
  private touchesRock(q: number, r: number, level: number): boolean {
    for (let d = 0; d < 6; d++) if (this.rockyN(q + DQ[d], r + DR[d]) >= 2 && P_LV(this.preP(q + DQ[d], r + DR[d])) === level) return true;
    return false;
  }

  // ---------------------------------------------------------------- ramps
  private rcScore = 0;
  /** Memoised ramp candidate: direction or -1; its score in this.rcScore. */
  private rampCand(q: number, r: number): number {
    const t = this.rcT.get(q, r), i = tidx(q, r);
    let dir = t.dir[i];
    if (dir === -2) {
      dir = this.rampCandidate(q, r);
      t.dir[i] = dir;
      t.score[i] = this.rcScore;
    }
    this.rcScore = t.score[i];
    return dir;
  }

  /**
   * TONGUE ramp (whole-game critic r2: pocket ramps cut V-notches into the plateau edge): a LOWER cell at level L in
   * front of a straight cliff becomes a planar ramp rising toward edge d. Only d is at L+1; d±1, d±2 and the foot d+3
   * stay at L, so the plateau edge stays intact and the ramp is a clean earth wedge leaning against the cliff (its two
   * triangular sides are dirt-banded skirts, full height at the cliff, zero at the foot). Levels never change.
   * Returns the direction (-1 = none) and leaves the score in this.rcScore.
   */
  /** Debug / A-B only (`?ramps=pocket`): the pre-r2 pocket ramp rule (upper cell drops a level, cut into the cliff). */
  static legacyPocket = false;

  private rampCandidatePocket(q: number, r: number): number {
    this.rcScore = 0;
    const u = this.preP(q, r);
    if (P_W(u) || P_LD(u) <= 2 || P_ROCKY(u) || P_LV(u) < 1 || this.corr(q, r)) return -1;
    const T = P_LV(u), L = T - 1;
    const n = (d: number) => this.preP(q + DQ[((d % 6) + 6) % 6], r + DR[((d % 6) + 6) % 6]);
    for (let d = 0; d < 6; d++) {
      const hi = n(d);
      if (P_W(hi) || P_ROCKY(hi) || P_LV(hi) !== T) continue;
      const f1 = n(d + 1), f2 = n(d - 1);
      if (P_LV(f1) !== T || P_W(f1) || P_LV(f2) !== T || P_W(f2)) continue;
      const lo = n(d + 3);
      if (P_W(lo) || P_LD(lo) <= 1 || P_LV(lo) !== L || P_ROCKY(lo)) continue;
      const s1 = n(d + 2), s2 = n(d - 2);
      if (P_W(s1) || P_W(s2) || P_LV(s1) !== T || P_LV(s2) !== T || P_ROCKY(s1) || P_ROCKY(s2)) continue;
      const hh = this.preP(q + 2 * DQ[d], r + 2 * DR[d]);
      if (P_LV(hh) < T || P_W(hh)) continue;
      const hh3 = this.preP(q + 3 * DQ[d], r + 3 * DR[d]);
      if (P_LV(hh3) < T || P_W(hh3)) continue;
      const lo2 = this.preP(q + 2 * DQ[(d + 3) % 6], r + 2 * DR[(d + 3) % 6]);
      if (P_LV(lo2) !== L || P_W(lo2)) continue;
      this.rcScore = hash3(this.sR, q, r) / 4294967296 + 0.1;
      return d;
    }
    return -1;
  }

  private rampCandidate(q: number, r: number): number {
    if (TerrainGen.legacyPocket) return this.rampCandidatePocket(q, r);
    this.rcScore = 0;
    const u = this.preP(q, r);
    if (P_W(u) || P_LD(u) <= 2 || P_ROCKY(u) || this.corr(q, r)) return -1;
    const L = P_LV(u), T = L + 1;
    const n = (d: number) => {
      const m = ((d % 6) + 6) % 6;
      return this.preP(q + DQ[m], r + DR[m]);
    };
    const low = (p: number) => !P_W(p) && !P_ROCKY(p) && P_LV(p) === L && P_LD(p) > 1;
    let bestDir = -1;
    for (let d = 0; d < 6; d++) {
      const hi = n(d);
      if (P_W(hi) || P_ROCKY(hi) || P_LV(hi) !== T) continue;
      if (!low(n(d + 1)) || !low(n(d - 1)) || !low(n(d + 2)) || !low(n(d - 2)) || !low(n(d + 3))) continue;
      // the plateau behind the top: two more cells at the high level; open ground in front of the foot
      const hh = this.preP(q + 2 * DQ[d], r + 2 * DR[d]);
      if (P_LV(hh) !== T || P_W(hh)) continue;
      const hh3 = this.preP(q + 3 * DQ[d], r + 3 * DR[d]);
      if (P_LV(hh3) < T || P_W(hh3)) continue;
      const lo2 = this.preP(q + 2 * DQ[(d + 3) % 6], r + 2 * DR[(d + 3) % 6]);
      if (P_LV(lo2) !== L || P_W(lo2)) continue;
      bestDir = d;
      break;
    }
    if (bestDir < 0) return -1;
    this.rcScore = hash3(this.sR, q, r) / 4294967296 + 1 * 0.1;
    return bestDir;
  }

  rampDir(q: number, r: number): number {
    const t = this.rdT.get(q, r), i = tidx(q, r);
    let v = t[i];
    if (v !== -2) return v;
    v = -1;
    const me = this.rampCand(q, r);
    const meScore = this.rcScore;
    if (me >= 0 && hash4(this.sR, q, r, 7) / 4294967296 < 0.85) {
      let win = true;
      const R = 3;
      for (let dr = -R; dr <= R && win; dr++)
        for (let dq = Math.max(-R, -dr - R); dq <= Math.min(R, -dr + R) && win; dq++) {
          if (!dq && !dr) continue;
          if (this.rampCand(q + dq, r + dr) >= 0 && this.rcScore > meScore) win = false;
        }
      if (win) v = me;
    }
    t[i] = v;
    return v;
  }

  /** Final level (tongue ramps keep their level). */
  private level(q: number, r: number): number {
    const p = this.preP(q, r);
    return TerrainGen.legacyPocket && !P_W(p) && this.rampDir(q, r) >= 0 ? P_LV(p) - 1 : P_LV(p);
  }

  // ---------------------------------------------------------------- final cell
  cell(q: number, r: number): TerrainCell {
    const t = this.cellT.get(q, r), i = tidx(q, r);
    const hit = t[i];
    if (hit !== undefined) return hit;
    const v = this.computeCell(q, r);
    t[i] = v;
    return v;
  }

  private computeCell(q: number, r: number): TerrainCell {
    const p = this.preP(q, r);
    const pWater = P_W(p) === 1, pLevel = P_LV(p), pForm = FORMS[P_FORM(p)], pLakeDist = P_LD(p);
    const rd = pWater ? -1 : this.rampDir(q, r);
    const level = TerrainGen.legacyPocket && rd >= 0 ? pLevel - 1 : pLevel;
    let coastMask = 0;
    let cliffUp = 0;
    let drop = 0;
    if (!pWater)
      for (let d = 0; d < 6; d++) {
        const nq = q + DQ[d], nr = r + DR[d];
        const n = this.preP(nq, nr);
        if (P_W(n)) coastMask |= 1 << d;
        else {
          const nl = this.level(nq, nr);
          cliffUp = Math.max(cliffUp, nl - level);
          drop = Math.max(drop, level - nl);
        }
      }
    const slope = rd >= 0 ? { dir: rd, steps: 1 as const } : null;

    const fx = cellX(q, r), fz = cellZ(r);
    let forest = Math.min(1, Math.max(0, (this.fbmF.at(fx / 13, fz / 13) + 0.02) / 0.32));
    forest = forest * forest * (3 - 2 * forest);

    let biome: Biome = 'grass';
    let deco: TerrainDeco | null = null;
    const sD = this.sD;
    const hr = (salt: number) => hash4(sD, q, r, salt) / 4294967296;
    const rn = this.rockyN(q, r);
    if (pWater) {
      biome = 'water';
      forest = 0;
    } else if (rn >= 2 && !slope) {
      // summit core: tapered massif — bare peaks in the middle of ridges, grassy/treed mountains around, hills at the rim
      const letter = 'ABC'[Math.floor(hr(1) * 3)];
      const rot = Math.floor(hr(3) * 6);
      const u = hr(2);
      if (drop > 0) {
        // never a mountain on the lip of a cliff: low outcrop instead
        biome = 'hill';
        if (u < 0.6) deco = { kind: 'hills', asset: `hex/decoration/nature/hills_${letter}${forest > 0.3 || hr(4) < 0.4 ? '_trees' : ''}`, rot };
      } else if (pForm === 'ridge' && rn >= 5 && u < 0.55) {
        biome = 'mountain';
        deco = { kind: 'mountain', asset: `hex/decoration/nature/mountain_${letter}${u < 0.3 ? '' : '_grass'}`, rot };
      } else if (rn >= 4 && u < 0.75) {
        biome = 'mountain';
        deco = { kind: 'mountain', asset: `hex/decoration/nature/mountain_${letter}_grass${forest > 0.3 && hr(4) < 0.6 ? '_trees' : ''}`, rot };
      } else if (u < 0.85) {
        biome = 'hill';
        deco = { kind: 'hills', asset: `hex/decoration/nature/hills_${letter}${forest > 0.3 || hr(4) < 0.4 ? '_trees' : ''}`, rot };
      } else biome = 'hill';
      forest = 0;
    } else if (P_TOP(p) && pForm !== 'mesa' && !slope && this.touchesRock(q, r, pLevel) && hr(5) < 0.45) {
      // a few low rock outcrops on the summit plateau around the crown
      biome = 'hill';
      deco = { kind: 'hills', asset: `hex/decoration/nature/hills_${'ABC'[Math.floor(hr(6) * 3)]}${forest > 0.35 ? '_trees' : ''}`, rot: Math.floor(hr(7) * 6) };
      forest = 0;
    } else if (pForm === 'hill' || pForm === 'ridge') {
      biome = 'hill';
      forest *= 0.7;
    } else if (pLakeDist <= 1) {
      forest = 0;
    } else if (forest > 0.55) biome = 'forest';
    if (pLakeDist === 2) forest *= 0.5;

    return { level, water: pWater, coastMask, slope, biome, forest, deco, lakeDist: pLakeDist, cliffUp, form: pForm };
  }
}

/**
 * One clean-up pass: cells with <= 1 same-level neighbour snap to the most common neighbour level (no pillars, pits,
 * spurs). Neighbour levels n0..n5 in DIRS order. Ties between neighbour levels → the lowest level (order-free).
 */
function clean(own: number, n0: number, n1: number, n2: number, n3: number, n4: number, n5: number): number {
  let same = 0, higher = 0, lower = 0;
  if (n0 === own) same++; else if (n0 > own) higher++; else lower++;
  if (n1 === own) same++; else if (n1 > own) higher++; else lower++;
  if (n2 === own) same++; else if (n2 > own) higher++; else lower++;
  if (n3 === own) same++; else if (n3 > own) higher++; else lower++;
  if (n4 === own) same++; else if (n4 > own) higher++; else lower++;
  if (n5 === own) same++; else if (n5 > own) higher++; else lower++;
  if (same > 2) return own;
  // one-cell-wide channel or wall: the four other neighbours are all on the same side → join them
  if (same === 2 && higher < 4 && lower < 4) return own;
  // most common other level, ties → lowest
  let best = own, bestN = -1;
  for (let k = 0; k < 6; k++) {
    const l = k === 0 ? n0 : k === 1 ? n1 : k === 2 ? n2 : k === 3 ? n3 : k === 4 ? n4 : n5;
    if (l === own) continue;
    const n = (n0 === l ? 1 : 0) + (n1 === l ? 1 : 0) + (n2 === l ? 1 : 0) + (n3 === l ? 1 : 0) + (n4 === l ? 1 : 0) + (n5 === l ? 1 : 0);
    if (n > bestN || (n === bestN && l < best)) { best = l; bestN = n; }
  }
  return bestN < 0 ? own : best;
}

/** One contiguous run of 1..4 set bits (cyclic) — what hex_coast_A..D can represent. */
export function validCoastMask(mask: number): boolean {
  mask &= 63;
  if (!mask || mask === 63) return false;
  let n = 0, runs = 0;
  for (let d = 0; d < 6; d++) {
    const on = (mask >> d) & 1, prev = (mask >> ((d + 5) % 6)) & 1;
    if (on) n++;
    if (on && !prev) runs++;
  }
  return runs === 1 && n <= 4;
}

const GENS = new Map<number, TerrainGen>();
/** Shared generator per seed (memoised; every result is a pure function of (seed, q, r)). */
export function terrainGen(seed: number): TerrainGen {
  let g = GENS.get(seed);
  if (!g) GENS.set(seed, (g = new TerrainGen(seed)));
  return g;
}
