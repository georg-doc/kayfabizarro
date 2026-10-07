// Per-chunk placement: a pure function of (seed, chunk) + the final cell data + terrain height.
//
// Forest trees come from a world-anchored, jittered triangular lattice (spacing 2.7 m) so forests continue seamlessly
// across cell and chunk borders. Each lattice point reads a smooth density: the cell densities barycentrically
// interpolated over the three nearest cell centres (same height level only → forests still stop at cliff lines), so
// forest rims run diagonally through hexes instead of along hex edges. Fill rises steeply with density → cores are packed
// crown to crown, rims are loose and clumpy. Big crowns (broad trees, round B-pines, tall single pines) suppress their
// ring-1 lattice neighbours by priority, decided from the neighbours' own pure candidates → order/chunk independent.
// Copses / lone trees (layer tags), cliff-foot bushes & rocks, field margins have their own per-cell generators.
// Every placement is ground-checked against terrain height (flat trunk footprint, crown clear of walls/raised tiles/ramps,
// trunk set back ≥ one crown radius from any drop) and against neighbouring structures and other pieces.
import type { CellData } from '../../core/types';
import { DIRS, edgeVector, hexToWorld, worldToAxial, worldToHex } from '../../core/hex';
import { hash, rand01, simplex2, strSeed } from '../../core/rng';
import { CHUNK, HEX_SIZE, HEX_WIDTH, LEVEL_H } from '../../core/units';
import { blocked, clearingAt, NTAG } from './layer';
import type { Placement } from './mesh';
import type { Proto, ProtoSet } from './protos';
import { GRASS, GRASS_LIGHT } from './protos';

export interface PlanCtx {
  seed: number;
  cell(q: number, r: number): Readonly<CellData>;
  heightAt(x: number, z: number): number;
  /** Debug: false skips the meadow-detail phase (?natmeadow=0, perf A/B). */
  meadow?: boolean;
}

export type ColliderSpec =
  | { type: 'cyl'; x: number; y: number; z: number; halfH: number; r: number }
  | { type: 'cap'; x: number; y: number; z: number; halfH: number; r: number }
  | { type: 'hull'; points: Float32Array };

export interface Plan {
  items: Placement[];
  grass: { id: string; x: number; y: number; z: number; rot: number; s: number }[];
  colliders: ColliderSpec[];
  counts: { trees: number; bushes: number; rocks: number; grass: number; roadside?: number };
  /** Crowns of placed trees, flat [x, z, radius, baseY, …] (world metres; baseY = lowest foliage). */
  crowns: number[];
}

/**
 * Per-species scale on top of the AssetLibrary's pack scale (documented exception, see NOTES): the hex-pack pines are
 * diorama-sized (5.4–6.9 m with the crown skirt at ~1 m). With the crown lift (protos.ts CROWN_LIFT) and these factors
 * the skirt starts at ~2.4–3.2 m and pines stand 8–11 m ≈ 1.0–1.3 × a KayKit house (7–10.5 m).
 */
export const SPECIES_SCALE = { pineA: 1.2, pineB: 1.1, single: 1.1, broad: 1.0, bare: 1.0 };

const S = 2.0; // candidate lattice spacing (m); final spacing comes from the Matérn thinning
const RN = 3; // neighbour radius of the thinning, in lattice steps (≈ 6 m)
const SH = (S * Math.sqrt(3)) / 2;
const JIT = 0.45; // strong jitter: no visible rows
const INNER = HEX_WIDTH / 2; // centre → edge midpoint
const TAU = Math.PI * 2;

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

const EV = [0, 1, 2, 3, 4, 5].map((d) => edgeVector(d));

const SALT = {
  lat: strSeed('nature.lat'),
  clump: strSeed('nature.clump'),
  type: strSeed('nature.type'),
  cell: strSeed('nature.cell'),
  fam: strSeed('nature.fam'),
  tint: strSeed('nature.tint'),
  size: strSeed('nature.size'),
  edge: strSeed('nature.edge'),
  meadow: strSeed('nature.meadow'),
  feather: strSeed('nature.feather'),
  gap: strSeed('nature.gap'),
  warp: strSeed('nature.warp'),
  floor: strSeed('nature.floor'),
  road: strSeed('nature.roadside'),
  mix: strSeed('nature.mix'),
  patch: strSeed('nature.patch'),
};

interface Cand {
  x: number;
  z: number;
  q: number;
  r: number;
  D: number;
  tree: Proto | null;
  big: boolean;
  prio: number;
  scale: number;
  /** Crown radius (m) and Poisson spacing factor. */
  R: number;
  k: number;
  /** Stand family: 1 angular pine, 2 round pine, 3 broad-leaf, 4 dead tree (crowns of different families never overlap). */
  kind: number;
}

/** Stand type at xz: 0 angular pines, 1 round pines, 2 broad-leaf grove. `j` (0..1) jitters the border by ±0.03. */
export function standType(seed: number, x: number, z: number, j = 0.5): number {
  const ft = simplex2(seed ^ SALT.type, x / 260, z / 260) + (j - 0.5) * 0.06;
  return ft > 0.4 ? 2 : ft < -0.15 ? 1 : 0;
}

function isSpecial(c: Readonly<CellData>): boolean {
  for (const t of c.tags) if (t === NTAG.copse || t === NTAG.lone) return true;
  return false;
}

/** Structures in a neighbour cell that nothing of ours may reach into. */
function solidNeighbour(n: Readonly<CellData>): boolean {
  if (n.building || n.bridge || n.biome === 'mountain') return true;
  if (n.reserved) return true;
  for (const t of n.tags) if (t === 'rock') return true;
  return false;
}

class Planner {
  readonly plan: Plan = { items: [], grass: [], colliders: [], counts: { trees: 0, bushes: 0, rocks: 0, grass: 0 }, crowns: [] };
  private cands = new Map<string, Cand | null>();
  /** Lattice points of this chunk that hold a tree (undergrowth clusters around them). */
  private treeAt = new Set<string>();
  /** Spatial hash of placed footprints (x, z, r). */
  private grid = new Map<string, number[]>();
  /** Spatial hash of crowns (x, z, r, bottomY). */
  private crowns = new Map<string, number[]>();
  private under: { x: number; z: number; D: number; i: number; j: number; q: number; r: number }[] = [];
  private q0: number;
  private r0: number;

  constructor(private pc: PlanCtx, private P: ProtoSet, cx: number, cz: number) {
    this.q0 = cx * CHUNK;
    this.r0 = cz * CHUNK;
  }

  private cells = new Map<number, Readonly<CellData>>();
  /** Final cell (local numeric-key cache over world.cell). */
  cell(q: number, r: number): Readonly<CellData> {
    const k = (q + 32768) * 65536 + (r + 32768);
    let c = this.cells.get(k);
    if (!c) this.cells.set(k, (c = this.pc.cell(q, r)));
    return c;
  }

  /** Ground height: flat dry cells answer from their level (same value terrain's provider returns), else ask terrain. */
  H(x: number, z: number): number {
    return this.pc.heightAt(x, z);
  }

  private bdMemo = new Map<Readonly<CellData>, number>();
  /** Cell density for blending; −1 = blocked/special (no lattice content). */
  private bd(c: Readonly<CellData>): number {
    let v = this.bdMemo.get(c);
    if (v === undefined) this.bdMemo.set(c, (v = blocked(c) ? -1 : isSpecial(c) ? 0 : c.forest));
    return v;
  }

  private inChunk(q: number, r: number) {
    return q >= this.q0 && q < this.q0 + CHUNK && r >= this.r0 && r < this.r0 + CHUNK;
  }

  // ---------------------------------------------------------------- density + checks
  /**
   * Smooth density at (x, z) in cell c: barycentric interpolation over the three nearest cell centres. Neighbours on a
   * different height level contribute c's own value (forests end at cliff lines, not before them); blocked ones 0.
   */
  private densityAt(c: Readonly<CellData>, x: number, z: number): number {
    const d0 = Math.max(0, this.bd(c));
    const a = worldToAxial(x, z);
    const fq = Math.floor(a.q), fr = Math.floor(a.r);
    const u = a.q - fq, v = a.r - fr;
    const val = (q: number, r: number) => {
      if (q === c.q && r === c.r) return d0;
      return Math.max(0, this.bd(this.cell(q, r)));
    };
    if (u + v < 1) return (1 - u - v) * val(fq, fr) + u * val(fq + 1, fr) + v * val(fq, fr + 1);
    return (u + v - 1) * val(fq + 1, fr + 1) + (1 - v) * val(fq + 1, fr) + (1 - u) * val(fq, fr + 1);
  }

  /** Keep `r` metres from neighbour structures (buildings, rock decorations), `rRoad` from road/river edges. */
  private clearOfStructures(c: Readonly<CellData>, x: number, z: number, r: number, rRoad: number): boolean {
    const ctr = hexToWorld(c.q, c.r);
    const vx = x - ctr.x, vz = z - ctr.z;
    for (let d = 0; d < 6; d++) {
      const e = EV[d];
      const dist = INNER - (vx * e.x + vz * e.z);
      if (dist >= Math.max(r, rRoad)) continue;
      const n = this.cell(c.q + DIRS[d][0], c.r + DIRS[d][1]);
      if (dist < r && (solidNeighbour(n) || (n.village && dist < r * 0.8))) return false;
      if (dist < rRoad && (n.roadMask || n.riverMask)) return false;
    }
    return true;
  }

  /**
   * Ground test for a tree: trunk footprint (ring rt) must be flat (≤ 0.15 m spread — no tile step, ramp or bevel under
   * it), nothing within 1.15 × crown radius may rise > 0.3 m above the base (walls, raised tiles, ramps never reach into
   * the crown), and nothing within one crown radius of the trunk may drop > 0.3 m (set back from cliff lips).
   * Returns the base height (lowest footprint sample − 5 cm) or null.
   */
  private groundTree(x: number, z: number, rt: number, R: number, ox: number, oz: number): number | null {
    const h0 = this.H(x, z);
    let hmin = h0, hmax = h0;
    for (let k = 0; k < 8; k++) {
      const a = (k * TAU) / 8;
      const h = this.H(x + Math.cos(a) * rt, z + Math.sin(a) * rt);
      hmin = Math.min(hmin, h);
      hmax = Math.max(hmax, h);
    }
    if (hmax - hmin > 0.15) return null;
    const cx = x + ox, cz = z + oz;
    for (let k = 0; k < 16; k++) {
      const a = (k * TAU) / 16, ca = Math.cos(a), sa = Math.sin(a);
      if (this.H(cx + ca * R * 1.15, cz + sa * R * 1.15) > h0 + 0.3) return null;
      if (this.H(cx + ca * R * 0.6, cz + sa * R * 0.6) > h0 + 0.3) return null;
      if (this.H(x + ca * R * 1.3, z + sa * R * 1.3) < h0 - 0.3) return null;
      if (this.H(x + ca * Math.max(1.5, R * 0.8), z + sa * Math.max(1.5, R * 0.8)) > h0 + 0.3) return null; // ≥ 1.5 m from a cliff foot
      if (this.H(x + ca * R * 0.5, z + sa * R * 0.5) < h0 - 0.3) return null;
    }
    return hmin - 0.05;
  }

  /** Ground test for small pieces (bush/rock/stump) of foot radius r. */
  private groundSmall(x: number, z: number, r: number, tol: number): number | null {
    const h0 = this.H(x, z);
    let hmin = h0, hmax = h0;
    for (let k = 0; k < 6; k++) {
      const a = (k * TAU) / 6, ca = Math.cos(a), sa = Math.sin(a);
      const h = this.H(x + ca * r, z + sa * r);
      hmin = Math.min(hmin, h);
      hmax = Math.max(hmax, h);
      if (this.H(x + ca * (r + 0.35), z + sa * (r + 0.35)) > h0 + 0.3) return null; // no wall/tile step against it
    }
    if (hmax - hmin > tol) return null;
    return hmin;
  }

  private gkey(ix: number, iz: number) {
    return ix + ',' + iz;
  }

  private free(x: number, z: number, r: number): boolean {
    const ix = Math.floor(x / 4), iz = Math.floor(z / 4);
    for (let dz = -1; dz <= 1; dz++)
      for (let dx = -1; dx <= 1; dx++) {
        const a = this.grid.get(this.gkey(ix + dx, iz + dz));
        if (!a) continue;
        for (let i = 0; i < a.length; i += 3) {
          const rr = a[i + 2] + r;
          if ((a[i] - x) ** 2 + (a[i + 1] - z) ** 2 < rr * rr) return false;
        }
      }
    return true;
  }

  private occupy(x: number, z: number, r: number) {
    const k = this.gkey(Math.floor(x / 4), Math.floor(z / 4));
    let a = this.grid.get(k);
    if (!a) this.grid.set(k, (a = []));
    a.push(x, z, r);
  }

  /** A piece of radius r reaching up to topY under (x, z) stays out of every crown (crown bottom − 0.25 m). */
  private underCrowns(x: number, z: number, r: number, topY: number): boolean {
    const ix = Math.floor(x / 6), iz = Math.floor(z / 6);
    for (let dz = -1; dz <= 1; dz++)
      for (let dx = -1; dx <= 1; dx++) {
        const a = this.crowns.get(this.gkey(ix + dx, iz + dz));
        if (!a) continue;
        for (let i = 0; i < a.length; i += 5) {
          const rr = a[i + 2] + r;
          if ((a[i] - x) ** 2 + (a[i + 1] - z) ** 2 < rr * rr && topY > a[i + 3] - 0.25) return false;
        }
      }
    return true;
  }

  // ---------------------------------------------------------------- emitters
  private emitTree(p: Proto, x: number, y: number, z: number, rot: number, s: number, phase: number, tint: number, kind: number) {
    const wind = p.kind === 'pine' ? 0.05 + 0.011 * p.height * s : p.kind === 'bare' ? 0.03 : 0.08 + 0.01 * p.height * s;
    this.plan.items.push({ proto: p, x, y, z, rot, s, wind, phase, tint });
    // collider = visible trunk (≥ 0.22 m): a thin round post deflects an off-centre player more than a fat one
    const tr = Math.max(0.22, p.trunkR * s);
    this.occupy(x, z, tr + 0.15);
    // trunk: capsule (rounded → the character controller slides around it instead of sticking)
    const trunkH = Math.max(2.2, Math.min(p.canopyBottom * s, 3.4));
    this.plan.colliders.push({ type: 'cap', x, y: y + trunkH / 2, z, halfH: Math.max(0.2, trunkH / 2 - tr), r: tr });
    if (p.kind !== 'bare') {
      const cs = Math.cos(rot), sn = Math.sin(rot);
      const ox = s * (p.crownX * cs + p.crownZ * sn), oz = s * (-p.crownX * sn + p.crownZ * cs);
      const k = this.gkey(Math.floor((x + ox) / 6), Math.floor((z + oz) / 6));
      let a = this.crowns.get(k);
      if (!a) this.crowns.set(k, (a = []));
      a.push(x + ox, z + oz, p.canopyR * s, y + p.canopyBottom * s, kind);
      this.plan.crowns.push(x + ox, z + oz, p.canopyR * s, y + Math.min(p.canopyBottom, p.folBottom) * s);
    }
    this.plan.counts.trees++;
  }

  private emitBush(p: Proto, x: number, y: number, z: number, rot: number, s: number, phase: number, tint: number) {
    this.plan.items.push({ proto: p, x, y, z, rot, s, wind: 0.025 * p.height * s, phase, detail: true, tint });
    this.occupy(x, z, p.footR * s * 0.8);
    this.plan.counts.bushes++;
  }

  private emitRock(p: Proto, x: number, y: number, z: number, rot: number, s: number) {
    this.plan.items.push({ proto: p, x, y, z, rot, s, wind: 0, phase: 0, detail: p.height * s < 1.6 });
    this.occupy(x, z, p.footR * s * 0.85);
    const h = p.height * s;
    if (h > 0.7) {
      if (p.hull) {
        const cs = Math.cos(rot), sn = Math.sin(rot);
        const pts = new Float32Array(p.hull.length);
        for (let i = 0; i < p.hull.length; i += 3) {
          const lx = p.hull[i], ly = p.hull[i + 1], lz = p.hull[i + 2];
          pts[i] = x + s * (lx * cs + lz * sn);
          pts[i + 1] = y + s * ly;
          pts[i + 2] = z + s * (-lx * sn + lz * cs);
        }
        this.plan.colliders.push({ type: 'hull', points: pts });
      } else this.plan.colliders.push({ type: 'cyl', x, y: y + h / 2, z, halfH: h / 2, r: p.footR * s * 0.7 });
    }
    this.plan.counts.rocks++;
  }

  private emitGrass(x: number, z: number, salt: number) {
    if (!this.free(x, z, 0.2)) return;
    const y = this.H(x, z) - 0.04;
    const id = GRASS[hash(this.pc.seed, salt, 1) % GRASS.length];
    // forest-pack tufts at FOREST_SCALE are 1.1–1.8 m (pack proportions); knee-to-hip height reads cleaner at walking scale
    const s = (id.includes('Grass_2') ? 0.42 : 0.62) * (0.85 + 0.3 * rand01(this.pc.seed, salt, 2));
    this.plan.grass.push({ id, x, y, z, rot: rand01(this.pc.seed, salt, 3) * TAU, s });
    this.plan.counts.grass++;
  }

  private grassClump(x: number, z: number, n: number, rad: number, salt: number) {
    for (let k = 0; k < n; k++) {
      const a = rand01(this.pc.seed, salt, k, 11) * TAU, d = rad * Math.sqrt(rand01(this.pc.seed, salt, k, 12));
      const gx = x + Math.cos(a) * d, gz = z + Math.sin(a) * d;
      const h = worldToHex(gx, gz);
      const c = this.cell(h.q, h.r);
      if (!this.inChunk(h.q, h.r) || blocked(c)) continue;
      this.emitGrass(gx, gz, hash(salt, k, 13));
    }
  }

  /** Cluster tint (−1…1) and size factor at a point: neighbouring stands differ, a stand reads as one. */
  private clusterLook(x: number, z: number, salt: number): { tint: number; size: number } {
    const sd = this.pc.seed;
    const t = 0.85 * simplex2(sd ^ SALT.tint, x / 38, z / 38) + 0.3 * (rand01(sd, SALT.tint, salt) - 0.5);
    const size = 1 + 0.1 * simplex2(sd ^ SALT.size, x / 45, z / 45);
    return { tint: Math.max(-1, Math.min(1, t)), size };
  }

  // ---------------------------------------------------------------- lattice forest
  private latticePoint(i: number, j: number): { x: number; z: number } {
    const sd = this.pc.seed;
    const jx = (rand01(sd, SALT.lat, i, j, 1) - 0.5) * 2 * JIT * S;
    const jz = (rand01(sd, SALT.lat, i, j, 2) - 0.5) * 2 * JIT * S;
    return { x: (i + j * 0.5) * S + jx, z: j * SH + jz };
  }

  /** Distance (m) from (x, z) to the nearest edge of c toward a path-like cell (road, river, bridge, square, village). */
  private pathDist(c: Readonly<CellData>, x: number, z: number): number {
    const ctr = hexToWorld(c.q, c.r);
    let best = Infinity;
    for (let d = 0; d < 6; d++) {
      const dist = INNER - ((x - ctr.x) * EV[d].x + (z - ctr.z) * EV[d].z);
      if (dist >= best || dist > 4) continue;
      const n = this.cell(c.q + DIRS[d][0], c.r + DIRS[d][1]);
      if (n.roadMask || n.riverMask || n.bridge || n.village || n.tags.includes('square')) best = dist;
    }
    return best;
  }

  /**
   * Roadside / terrace-edge landmarks outside villages: on open cells next to a road or on a terrace lip/foot, a lone
   * tree or a small grove (2–4 trees) with a bush and a rock. Sparse local-maximum selection (≈ one per 60–80 m of
   * road); the crown keeps ≥ 1 m off the road edge, groundTree keeps it back from drops and cliff walls.
   */
  *roadsideTrees(cells: { q: number; r: number }[]): Generator<void> {
    const P = this.P, sd = this.pc.seed;
    const score = (q: number, r: number): number => {
      const c = this.cell(q, r);
      if (blocked(c) || c.slope || c.forest > 0.15 || isSpecial(c)) return -1;
      let road = false, terrace = false;
      for (let d = 0; d < 6; d++) {
        const n = this.cell(q + DIRS[d][0], r + DIRS[d][1]);
        if (n.village || n.building || n.tags.includes('field') || n.tags.includes('square')) return -1;
        if (n.roadMask) road = true;
        if (!n.water && n.level !== c.level) terrace = true;
      }
      if (!road && !terrace) return -1;
      const u = rand01(sd, SALT.road, q, r);
      return u < (road ? 0.26 : 0.07) ? u : -1;
    };
    for (const { q, r } of cells) {
      yield;
      const sc = score(q, r);
      if (sc < 0) continue;
      // local maximum among ring-1 neighbours → spaced picks, identical from any chunk
      let top = true;
      for (const [dq, dr] of DIRS) if (score(q + dq, r + dr) > sc) { top = false; break; }
      if (!top) continue;
      const c = this.cell(q, r);
      const ctr = hexToWorld(q, r);
      const R = (k: number) => rand01(sd, SALT.road, q, r, k);
      // anchor: pulled away from the nearest road edge, jittered
      let ax = 0, az = 0;
      for (let d = 0; d < 6; d++) if (this.cell(q + DIRS[d][0], r + DIRS[d][1]).roadMask) { ax -= EV[d].x; az -= EV[d].z; }
      const al = Math.hypot(ax, az) || 1;
      const off = 1.5 + R(1) * 2.5;
      const mx = ctr.x + (ax / al) * off + (R(2) - 0.5) * 3, mz = ctr.z + (az / al) * off + (R(3) - 0.5) * 3;
      const st = standType(sd, mx, mz);
      const fams = P.broadFam.length ? P.broadFam : [P.broad];
      const broad = st === 2 || R(4) < 0.45;
      const list = broad ? fams[Math.floor(R(5) * fams.length)] : st === 1 ? P.pinesB : P.pinesA;
      if (!list.length) continue;
      const n = R(6) < 0.4 ? 1 : 2 + Math.floor(R(7) * 3);
      const kind = broad ? 3 : st === 1 ? 2 : 1;
      const tint = (R(8) - 0.5) * 1.4;
      let placed = 0;
      for (let k = 0; k < n + 3 && placed < n; k++) {
        const p = list[Math.floor(R(10 + k) * list.length)];
        const ring = k === 0 ? 0 : (broad || kind === 2 ? 4.2 : 3.0) * (0.9 + 0.3 * R(20 + k));
        const a = R(30 + k) * TAU;
        const x = mx + Math.cos(a) * ring, z = mz + Math.sin(a) * ring;
        const h = worldToHex(x, z);
        const hc = this.cell(h.q, h.r);
        if (blocked(hc) || hc.level !== c.level) continue;
        const sp = broad ? SPECIES_SCALE.broad * p.headScale : kind === 2 ? SPECIES_SCALE.pineB : SPECIES_SCALE.pineA;
        const s = sp * (k === 0 ? 1.05 : 0.9) * (0.92 + 0.16 * R(40 + k));
        const cr = p.canopyR * s;
        if (this.pathDist(hc, x, z) < cr + 1.0) continue;
        if (this.tryTree(hc, p, x, z, R(50 + k) * TAU, s, R(60 + k) * TAU, tint, kind)) placed++;
      }
      if (!placed) continue;
      this.plan.counts.roadside = (this.plan.counts.roadside ?? 0) + 1;
      if (P.bushes.length && R(70) < 0.7) {
        const a = R(71) * TAU, d = 2.5 + R(72) * 1.5;
        this.tryBush(c, P.bushes[Math.floor(R(73) * P.bushes.length)], mx + Math.cos(a) * d, mz + Math.sin(a) * d, R(74) * TAU, 0.75 + 0.25 * R(75), R(76) * TAU, tint);
      }
      if (P.smallRocks.length && R(80) < 0.5) {
        const a = R(81) * TAU, d = 3 + R(82) * 2;
        this.tryRock(c, P.smallRocks[Math.floor(R(83) * P.smallRocks.length)], mx + Math.cos(a) * d, mz + Math.sin(a) * d, R(84) * TAU, 0.8 + 0.4 * R(85));
      }
    }
  }

  /** Distance (m) from (x, z) to the nearest edge of c toward a blocked cell or a different height level. */
  private featureDist(c: Readonly<CellData>, x: number, z: number): number {
    const ctr = hexToWorld(c.q, c.r);
    let best = Infinity;
    for (let d = 0; d < 6; d++) {
      const dist = INNER - ((x - ctr.x) * EV[d].x + (z - ctr.z) * EV[d].z);
      if (dist >= best) continue;
      const n = this.cell(c.q + DIRS[d][0], c.r + DIRS[d][1]);
      if (this.bd(n) < 0 || n.level !== c.level || n.slope) best = dist;
    }
    return best;
  }

  /**
   * Smooth forest field at a world point (pure): region density from the cell densities (barycentric) sampled at a
   * domain-warped position (outlines don't follow hex lines), feathered against hard features (roads, water, villages,
   * terrace steps), × round world-space clearings; plus the clump field F (density falls off from scattered clump
   * centres) and the clearing value clr. null where the point's own cell can't carry trees.
   */
  private field(x: number, z: number): { D: number; Dr: number; clr: number; F: number; c: Readonly<CellData> } | null {
    const h = worldToHex(x, z);
    const c = this.cell(h.q, h.r);
    if (this.bd(c) < 0 || c.slope) return null;
    const sd = this.pc.seed;
    // domain warp (±6 m, 26 m wavelength): contours of the cell-interpolated density stop being straight hex lines
    const wx = x + 6 * simplex2(sd ^ SALT.warp, x / 26, z / 26);
    const wz = z + 6 * simplex2(sd ^ SALT.warp, x / 26 + 41.7, z / 26 - 13.1);
    const wh = worldToHex(wx, wz);
    const wc = this.cell(wh.q, wh.r);
    let Dr = wc.level === c.level ? this.densityAt(wc, wx, wz) : this.densityAt(c, x, z);
    Dr = Math.max(0, Math.min(1, Dr + 0.3 * simplex2(sd ^ SALT.edge, x / 11, z / 11) * Dr * (1 - Dr) * 2));
    const fd = this.featureDist(c, x, z);
    if (fd < 9) {
      const n = 0.5 + 0.5 * simplex2(sd ^ SALT.feather, x / 14, z / 14);
      Dr *= smooth(0, 1 + 7 * n * n, fd);
    }
    const clr = clearingAt(sd, x, z);
    return { D: Dr * clr, Dr, clr, F: this.clumpField(x, z), c };
  }

  /** Clump field 0..1: jittered centres on a 21 m grid, radius 7–13 m each, smooth falloff from the centre. */
  private clumpCentres = new Map<number, [number, number, number]>();
  private clumpCentre(ix: number, iz: number): [number, number, number] {
    const k = (ix + 32768) * 65536 + (iz + 32768);
    let c = this.clumpCentres.get(k);
    if (!c) {
      const sd = this.pc.seed, G = 21;
      c = [(ix + 0.15 + 0.7 * rand01(sd, SALT.clump, ix, iz, 1)) * G, (iz + 0.15 + 0.7 * rand01(sd, SALT.clump, ix, iz, 2)) * G, 7 + 6 * rand01(sd, SALT.clump, ix, iz, 3)];
      this.clumpCentres.set(k, c);
    }
    return c;
  }

  private clumpField(x: number, z: number): number {
    const G = 21;
    const gx = Math.floor(x / G), gz = Math.floor(z / G);
    let F = 0;
    for (let dz = -1; dz <= 1; dz++)
      for (let dx = -1; dx <= 1; dx++) {
        const [cx, cz, R] = this.clumpCentre(gx + dx, gz + dz);
        const d = Math.hypot(x - cx, z - cz) / R;
        if (d < 1) F = Math.max(F, 1 - d * d * (3 - 2 * d));
      }
    return F;
  }

  /** Pure candidate tree at lattice point (i, j) — identical whichever chunk asks. */
  private cand(i: number, j: number): Cand | null {
    const key = i + ',' + j;
    if (this.cands.has(key)) return this.cands.get(key)!;
    let res: Cand | null = null;
    const { x, z } = this.latticePoint(i, j);
    const f = this.field(x, z);
    if (f && f.D > 0.02) {
      const sd = this.pc.seed, D = f.D, F = f.F;
      const h = worldToHex(x, z);
      res = { x, z, q: h.q, r: h.r, D, tree: null, big: false, prio: hash(sd, SALT.lat, i, j, 7), scale: 1, kind: 0, R: 0, k: 1.5 };
      // existence: thin at rims, denser in clumps; spacing factor k (Poisson radius / crown radius): tight in clump
      // cores (crowns overlap), loose between clumps and at rims → irregular spacing, no plantation rows
      const core = F * smooth(0.35, 0.85, D);
      const pE = smooth(0.04, 0.5, D) * (0.65 + 0.35 * F);
      res.k = 1.5 - 0.72 * core - 0.2 * smooth(0.6, 0.95, D) + 0.25 * (rand01(sd, SALT.lat, i, j, 14) - 0.5);
      if (rand01(sd, SALT.lat, i, j, 3) < pE) {
        const u = rand01(sd, SALT.lat, i, j, 4), v = rand01(sd, SALT.lat, i, j, 5), w = rand01(sd, SALT.lat, i, j, 6);
        const st = standType(sd, x, z, rand01(sd, SALT.lat, i, j, 12));
        const look = this.clusterLook(x, z, i * 7 + j);
        const young = D < 0.4 && rand01(sd, SALT.lat, i, j, 13) < 0.3 ? 0.74 : 1;
        // clump cores a little taller than their fringe
        const jit = (0.84 + 0.3 * w) * look.size * young * (0.94 + 0.1 * F);
        const P = this.P;
        const fams = P.broadFam.slice(0, 2);
        const fam = fams.length ? fams[simplex2(sd ^ SALT.fam, x / 320, z / 320) > 0 || fams.length === 1 ? 0 : 1] : [];
        // species groups inside a stand: a 17 m noise forms small groups of the stand's companion species
        const grp = simplex2(sd ^ SALT.mix, x / 17, z / 17);
        let tree: Proto | null = null;
        const margin = D < 0.42 || f.clr < 0.85;
        if (P.bare.length && (margin || F < 0.2) && u > 0.975) {
          tree = P.bare[Math.floor(v * P.bare.length)];
          res.kind = 4;
          res.scale = SPECIES_SCALE.bare * (0.9 + 0.2 * w);
        } else if (st === 2) {
          // broad-leaf grove (one family per region) with a few round-pine groups
          if (grp > 0.55 && P.pinesB.length) {
            tree = P.pinesB[Math.floor(v * P.pinesB.length)];
            res.kind = 2;
            res.scale = SPECIES_SCALE.pineB * jit;
          } else if (fam.length) {
            tree = fam[Math.floor(v * fam.length)];
            res.kind = 3;
            res.scale = SPECIES_SCALE.broad * tree.headScale * jit;
          }
        } else if (st === 1) {
          // round-pine stand (+ round single pine), broad-leaf groups at its margins
          if (grp < -0.5 && margin && fam.length) {
            tree = fam[Math.floor(v * fam.length)];
            res.kind = 3;
            res.scale = SPECIES_SCALE.broad * tree.headScale * jit;
          } else if (P.pinesB.length) {
            const single = P.singles.length > 1 && D > 0.7 && u > 0.93;
            tree = single ? P.singles[1] : P.pinesB[Math.floor(v * P.pinesB.length)];
            res.kind = 2;
            res.scale = (single ? SPECIES_SCALE.single : SPECIES_SCALE.pineB) * jit;
          }
        } else {
          // angular-pine stand: groups of round pines (grp > 0.5) and, at margins, broad-leaf groups (grp < -0.45)
          if (grp > 0.5 && P.pinesB.length) {
            tree = P.pinesB[Math.floor(v * P.pinesB.length)];
            res.kind = 2;
            res.scale = SPECIES_SCALE.pineB * jit;
          } else if (grp < -0.45 && margin && fam.length) {
            tree = fam[Math.floor(v * fam.length)];
            res.kind = 3;
            res.scale = SPECIES_SCALE.broad * tree.headScale * jit;
          } else if (P.singles.length && D > 0.7 && u > 0.94) {
            tree = P.singles[0];
            res.kind = 1;
            res.scale = SPECIES_SCALE.single * jit;
          } else if (P.pinesA.length) {
            tree = P.pinesA[Math.floor(v * P.pinesA.length)];
            res.kind = 1;
            res.scale = SPECIES_SCALE.pineA * jit;
          }
        }
        if (tree) {
          res.tree = tree;
          res.big = res.kind === 2 || res.kind === 3;
          res.R = tree.kind === 'bare' ? 1.2 : tree.canopyR * res.scale;
        }
      }
    }
    this.cands.set(key, res);
    return res;
  }

  /**
   * Hard-core (Matérn II) thinning, pure and chunk-independent: a candidate survives unless a higher-priority candidate
   * lies closer than k·(R1+R2)/2 (k of the pair; different families keep their crowns apart).
   */
  private survives(i: number, j: number, c: Cand): boolean {
    for (let dj = -RN; dj <= RN; dj++)
      for (let di = -RN; di <= RN; di++) {
        if ((di === 0 && dj === 0) || Math.abs(di + dj) > RN) continue;
        const n = this.cand(i + di, j + dj);
        if (!n || !n.tree || n.prio <= c.prio) continue;
        let minD = Math.min(RN * S, ((c.k + n.k) / 2) * ((c.R + n.R) / 2));
        if (n.kind !== c.kind && c.kind !== 4 && n.kind !== 4) minD = Math.max(minD, Math.min(RN * S, 0.85 * (c.R + n.R)));
        if ((n.x - c.x) ** 2 + (n.z - c.z) ** 2 < minD * minD) return false;
      }
    return true;
  }

  *forestTrees(cells: { q: number; r: number }[]): Generator<void> {
    let xmin = Infinity, xmax = -Infinity, zmin = Infinity, zmax = -Infinity;
    for (const { q, r } of cells) {
      const p = hexToWorld(q, r);
      xmin = Math.min(xmin, p.x); xmax = Math.max(xmax, p.x); zmin = Math.min(zmin, p.z); zmax = Math.max(zmax, p.z);
    }
    xmin -= HEX_SIZE + S; xmax += HEX_SIZE + S; zmin -= HEX_SIZE + S; zmax += HEX_SIZE + S;
    const j0 = Math.floor(zmin / SH), j1 = Math.ceil(zmax / SH);
    const sd = this.pc.seed;
    for (let j = j0; j <= j1; j++) {
      const i0 = Math.floor(xmin / S - j * 0.5), i1 = Math.ceil(xmax / S - j * 0.5);
      for (let i = i0; i <= i1; i++) {
        yield;
        const lp = this.latticePoint(i, j);
        const lh = worldToHex(lp.x, lp.z);
        if (!this.inChunk(lh.q, lh.r)) continue;
        const c = this.cand(i, j);
        if (!c || !c.tree || !this.survives(i, j, c)) continue;
        const cell = this.cell(c.q, c.r);
        const rot = rand01(sd, SALT.lat, i, j, 8) * TAU;
        const look = this.clusterLook(c.x, c.z, i * 7 + j);
        if (this.tryTree(cell, c.tree, c.x, c.z, rot, c.scale, rand01(sd, SALT.lat, i, j, 9) * TAU, look.tint, c.kind)) this.treeAt.add(i + ',' + j);
      }
    }
  }

  /**
   * Forest floor on its own jittered 2.4 m grid: bushes, rocks, stumps and dead trees concentrate at rims and in/around
   * clearings and clump gaps; inside, grass clumps (tall Grass_2 reads like ferns) and the odd bush, rock or stump.
   */
  *undergrowth(cells: { q: number; r: number }[]): Generator<void> {
    const P = this.P, sd = this.pc.seed, G = 2.4;
    let xmin = Infinity, xmax = -Infinity, zmin = Infinity, zmax = -Infinity;
    for (const { q, r } of cells) {
      const p = hexToWorld(q, r);
      xmin = Math.min(xmin, p.x); xmax = Math.max(xmax, p.x); zmin = Math.min(zmin, p.z); zmax = Math.max(zmax, p.z);
    }
    xmin -= HEX_SIZE; xmax += HEX_SIZE; zmin -= HEX_SIZE; zmax += HEX_SIZE;
    for (let gz = Math.floor(zmin / G); gz <= Math.ceil(zmax / G); gz++)
      for (let gx = Math.floor(xmin / G); gx <= Math.ceil(xmax / G); gx++) {
        yield;
        const R = (k: number) => rand01(sd, SALT.floor, gx, gz, k);
        const x = (gx + 0.1 + 0.8 * R(1)) * G, z = (gz + 0.1 + 0.8 * R(2)) * G;
        const h = worldToHex(x, z);
        if (!this.inChunk(h.q, h.r)) continue;
        const f = this.field(x, z);
        if (!f || f.Dr < 0.03) continue;
        const rim = smooth(0.03, 0.25, f.D) * (1 - smooth(0.55, 0.9, f.D));
        const clearing = smooth(0.3, 0.7, f.Dr) * (1 - f.clr);
        const gapZone = smooth(0.5, 0.85, f.D) * (1 - f.F); // between clumps inside the stand
        const interior = smooth(0.5, 0.9, f.D);
        const edge = Math.max(rim, clearing, gapZone * 0.6);
        const pB = 0.17 * edge + 0.035 * interior;
        const pS = 0.03 * edge + 0.012 * interior;
        const pR = 0.035 * edge + 0.012 * interior;
        const pM = 0.012 * Math.max(rim, clearing);
        const pD = 0.006 * Math.max(clearing, rim);
        const pG = 0.11 * edge + 0.14 * interior;
        let r = R(3);
        const rot = R(4) * TAU, w = R(5);
        const c = f.c;
        const look = this.clusterLook(x, z, gx * 13 + gz);
        if (r < pB && P.bushes.length) {
          this.tryBush(c, P.bushes[Math.floor(w * P.bushes.length)], x, z, rot, 0.72 + 0.35 * R(6), R(7) * TAU, look.tint);
        } else if ((r -= pB) < pS && P.stumps.length) {
          this.tryRock(c, P.stumps[Math.floor(w * P.stumps.length)], x, z, rot, 0.5 + 0.12 * R(6));
        } else if ((r -= pS) < pR && P.smallRocks.length) {
          this.tryRock(c, P.smallRocks[Math.floor(w * P.smallRocks.length)], x, z, rot, 0.75 + 0.45 * R(6));
        } else if ((r -= pR) < pM && P.midRocks.length) {
          this.tryRock(c, P.midRocks[Math.floor(w * P.midRocks.length)], x, z, rot, 0.8 + 0.3 * R(6));
        } else if ((r -= pM) < pD && P.bare.length) {
          this.tryTree(c, P.bare[Math.floor(w * P.bare.length)], x, z, rot, SPECIES_SCALE.bare * (0.85 + 0.25 * R(6)), R(7) * TAU, 0, 4);
        } else if ((r -= pD) < pG) {
          // floor clump: tall Grass_2 tufts (fern-like) mixed with leafy Grass_1
          const n = 2 + Math.floor(R(8) * 4);
          for (let k = 0; k < n; k++) {
            const a = R(10 + k) * TAU, d = k === 0 ? 0 : 0.3 + 0.6 * R(20 + k);
            const tx = x + Math.cos(a) * d, tz = z + Math.sin(a) * d;
            const th = worldToHex(tx, tz);
            if (th.q !== c.q || th.r !== c.r) continue;
            const tall = R(30 + k) < 0.45;
            const id = tall ? GRASS[1] : R(40 + k) < 0.4 ? GRASS[0] : GRASS_LIGHT[0];
            const sc = tall ? 0.48 + 0.15 * R(50 + k) : id === GRASS[0] ? 0.62 : 1.1;
            this.emitGrassId(id, tx, tz, sc * (0.85 + 0.3 * R(60 + k)), R(70 + k) * TAU);
          }
        }
      }
  }

  private tryBush(cell: Readonly<CellData>, b: Proto, x: number, z: number, rot: number, s: number, phase: number, tint = 0): boolean {
    const r = b.footR * s * 0.8;
    // ≥ 0.6 m between the bush and any road / river / square / village-lot cell edge (walkable paths stay clear)
    if (!this.free(x, z, r) || !this.clearOfStructures(cell, x, z, r + 0.2, r + 0.6) || this.pathDist(cell, x, z) < r + 0.6) return false;
    const y = this.groundSmall(x, z, Math.max(0.3, r), 0.3);
    if (y === null) return false;
    this.emitBush(b, x, y, z, rot, s, phase, tint);
    return true;
  }

  private tryRock(cell: Readonly<CellData>, b: Proto, x: number, z: number, rot: number, s: number): boolean {
    const r = b.footR * s * 0.85;
    if (!this.free(x, z, r) || !this.clearOfStructures(cell, x, z, r + 0.2, r + 0.3)) return false;
    const y = this.groundSmall(x, z, Math.max(0.3, b.footR * s) + 0.5, 0.35);
    if (y === null) return false;
    if (!this.underCrowns(x, z, r, y + b.height * s)) return false; // no rock poking through a crown
    // half-buried forest rocks keep their authored sink; hex rocks sit on the ground; stumps are sunk to knee height
    const sink = b.kind === 'stump' ? Math.max(0, b.height * s - 0.45) : b.minY < -0.05 ? -0.03 : 0.03;
    this.emitRock(b, x, y - sink, z, rot, s);
    return true;
  }

  /** Crowns of another family may not interpenetrate (pine through a cube crown); same family: no trunk in a crown core. */
  private crownsCompatible(cx: number, cz: number, R: number, kind: number): boolean {
    const ix = Math.floor(cx / 6), iz = Math.floor(cz / 6);
    for (let dz = -1; dz <= 1; dz++)
      for (let dx = -1; dx <= 1; dx++) {
        const a = this.crowns.get(this.gkey(ix + dx, iz + dz));
        if (!a) continue;
        for (let i = 0; i < a.length; i += 5) {
          const d = Math.hypot(a[i] - cx, a[i + 1] - cz);
          if (a[i + 4] !== kind && d < 0.9 * (a[i + 2] + R)) return false;
          if (d < 0.32 * (a[i + 2] + R)) return false;
        }
      }
    return true;
  }

  private tryTree(cell: Readonly<CellData>, p: Proto, x: number, z: number, rot: number, s: number, phase: number, tint: number, kind: number): boolean {
    if (cell.slope) return false;
    const cs = Math.cos(rot), sn = Math.sin(rot);
    const ox = s * (p.crownX * cs + p.crownZ * sn), oz = s * (-p.crownX * sn + p.crownZ * cs);
    const R = p.kind === 'bare' ? Math.max(1, p.footR * s * 0.6) : p.canopyR * s;
    if (!this.free(x, z, Math.max(0.3, p.trunkR * s) + 0.15)) return false;
    if (!this.crownsCompatible(x + ox, z + oz, R, kind)) return false;
    if (!this.clearOfStructures(cell, x + ox, z + oz, R * 0.95, Math.max(0.9, R * 0.45))) return false;
    const y = this.groundTree(x, z, Math.max(0.6, p.trunkR * s * 2), R, ox, oz);
    if (y === null) return false;
    this.emitTree(p, x, y, z, rot, s, phase, tint, kind);
    return true;
  }

  // ---------------------------------------------------------------- per-cell generators
  /** Copses and lone trees (before undergrowth, so rocks/bushes respect their crowns). */
  *specialTrees(cells: { q: number; r: number }[]): Generator<void> {
    const P = this.P, sd = this.pc.seed;
    for (const { q, r } of cells) {
      yield;
      const c = this.cell(q, r);
      if (blocked(c)) continue;
      const copse = c.tags.includes(NTAG.copse), lone = c.tags.includes(NTAG.lone);
      if (!copse && !lone) continue;
      const ctr = hexToWorld(q, r);
      const R = (k: number) => rand01(sd, SALT.cell, q, r, k);
      const tint = (R(90) - 0.5) * 1.6;
      if (copse) {
        // 3–6 trees around an off-centre point: one species family, sizes falling off from the middle
        const a0 = R(1) * TAU, d0 = R(2) * INNER * 0.3;
        const mx = ctr.x + Math.cos(a0) * d0, mz = ctr.z + Math.sin(a0) * d0;
        const fam = R(3);
        const n = 3 + Math.floor(R(4) * 4);
        let placed = 0;
        // one family per copse: a broad-leaf family (round, boxy or umbrella), angular pines or round pines
        const broad = fam < 0.45 && P.broadFam.length > 0;
        const isB = !broad && fam >= 0.72;
        const list = broad ? P.broadFam[Math.floor(R(5) * P.broadFam.length)] : isB ? P.pinesB : P.pinesA;
        const kind = broad ? 3 : isB ? 2 : 1;
        for (let k = 0; k < n + 4 && placed < n && list.length; k++) {
          const p = list[Math.floor(R(10 + k) * list.length)];
          const ring = k === 0 ? 0 : (broad || isB ? 3.8 : 2.8) * (1 + 0.35 * Math.floor((k - 1) / 5));
          const a = R(20 + k) * 0.6 + ((k - 1) * TAU) / 5;
          const x = mx + Math.cos(a) * ring, z = mz + Math.sin(a) * ring;
          const h = worldToHex(x, z);
          if (h.q !== q || h.r !== r) continue;
          const sp = broad ? SPECIES_SCALE.broad * p.headScale : isB ? SPECIES_SCALE.pineB : SPECIES_SCALE.pineA;
          const s = sp * (k === 0 ? 1.05 : 0.95) * (0.92 + 0.16 * R(30 + k));
          if (this.tryTree(c, p, x, z, R(40 + k) * TAU, s, R(50 + k) * TAU, tint, kind)) placed++;
        }
        for (let k = 0; k < 3; k++) {
          const a = R(60 + k) * TAU, d = 4.5 + R(63 + k) * 2;
          const x = mx + Math.cos(a) * d, z = mz + Math.sin(a) * d;
          const h = worldToHex(x, z);
          if (h.q !== q || h.r !== r || !P.bushes.length) continue;
          this.tryBush(c, P.bushes[Math.floor(R(66 + k) * P.bushes.length)], x, z, R(69 + k) * TAU, 0.75 + 0.3 * R(72 + k), R(75 + k) * TAU, tint);
        }
        this.grassClump(mx, mz, 5, 4.5, hash(sd, SALT.cell, q, r, 80));
      } else {
        const a0 = R(1) * TAU, d0 = R(2) * INNER * 0.45;
        const x = ctr.x + Math.cos(a0) * d0, z = ctr.z + Math.sin(a0) * d0;
        const broad = R(3) < 0.6 && P.broad.length > 0;
        const list = broad ? P.broad : P.singles.length ? P.singles : P.pinesA;
        const lp = list.length ? list[Math.floor(R(4) * list.length)] : null;
        const sp = broad ? SPECIES_SCALE.broad * (lp?.headScale ?? 1) : P.singles.length ? SPECIES_SCALE.single : SPECIES_SCALE.pineA;
        if (lp && this.tryTree(c, lp, x, z, R(5) * TAU, sp * (0.95 + 0.15 * R(6)), R(7) * TAU, tint, broad ? 3 : 1)) {
          if (R(8) < 0.55 && P.bushes.length) {
            const a = R(9) * TAU;
            this.tryBush(c, P.bushes[Math.floor(R(10) * P.bushes.length)], x + Math.cos(a) * 2.6, z + Math.sin(a) * 2.6, R(11) * TAU, 0.75 + 0.25 * R(12), R(13) * TAU, tint);
          }
          this.grassClump(x, z, 3, 2.2, hash(sd, SALT.cell, q, r, 14));
        }
      }
    }
  }

  *cellFeatures(cells: { q: number; r: number }[]): Generator<void> {
    const P = this.P, sd = this.pc.seed;
    for (const { q, r } of cells) {
      yield;
      const c = this.cell(q, r);
      if (blocked(c)) continue;
      const ctr = hexToWorld(q, r);
      const R = (k: number) => rand01(sd, SALT.cell, q, r, k);

      // cliff feet: bushes and rocks along walls of higher neighbours
      if (c.tags.includes('cliff')) {
        for (let d = 0; d < 6; d++) {
          const n = this.cell(q + DIRS[d][0], r + DIRS[d][1]);
          if (n.water || n.level <= c.level || R(100 + d) > 0.35) continue;
          const e = EV[d];
          const tx = -e.z, tz = e.x; // along the edge
          // one irregular cluster per wall: 2–4 pieces scattered around a point near the wall foot
          const t0 = (R(120 + d) * 2 - 1) * 0.5 * (HEX_SIZE / 2);
          const in0 = 1.6 + R(130 + d) * 1.2;
          const k = 2 + Math.floor(R(110 + d) * 3);
          for (let m = 0; m < k; m++) {
            const a = R(121 + d * 7 + m) * TAU, rr = (m === 0 ? 0 : 0.9 + R(131 + d * 7 + m) * 1.4);
            const t = t0 + Math.cos(a) * rr, inset = Math.max(1.1, in0 + Math.sin(a) * rr);
            const x = ctr.x + e.x * (INNER - inset) + tx * t, z = ctr.z + e.z * (INNER - inset) + tz * t;
            const h = worldToHex(x, z);
            if (h.q !== q || h.r !== r) continue;
            const u = R(140 + d * 7 + m), rot = R(150 + d * 7 + m) * TAU;
            const sc = R(170 + d * 7 + m);
            if (u < 0.55 && P.bushes.length) this.tryBush(c, P.bushes[Math.floor(R(160 + d * 7 + m) * P.bushes.length)], x, z, rot, 0.65 + 0.4 * sc, R(180 + m) * TAU);
            else if (u < 0.85 && P.smallRocks.length) this.tryRock(c, P.smallRocks[Math.floor(R(160 + d * 7 + m) * P.smallRocks.length)], x, z, rot, 0.7 + 0.5 * sc);
            else if (P.hexRocks.length) this.tryRock(c, P.hexRocks[Math.floor(R(160 + d * 7 + m) * P.hexRocks.length)], x, z, rot, 0.6 + 0.4 * sc);
          }
        }
      }

      // field margins (villages tag 'field'): a loose hedge of bushes along the shared edge
      for (let d = 0; d < 6; d++) {
        const n = this.cell(q + DIRS[d][0], r + DIRS[d][1]);
        if (!n.tags.includes('field') || R(200 + d) > 0.6 || !P.bushes.length) continue;
        const e = EV[d];
        const tx = -e.z, tz = e.x;
        for (let m = 0; m < 3; m++) {
          const t = (m - 1) * 2.6 + (R(210 + d * 3 + m) - 0.5);
          const x = ctr.x + e.x * (INNER - 1.3) + tx * t, z = ctr.z + e.z * (INNER - 1.3) + tz * t;
          if (R(220 + d * 3 + m) < 0.8) this.tryBush(c, P.bushes[Math.floor(R(230 + d * 3 + m) * P.bushes.length)], x, z, R(240 + m) * TAU, 0.7 + 0.25 * R(250 + m), R(260 + m) * TAU);
        }
      }

    }
  }
  // ---------------------------------------------------------------- meadow ground detail
  /** Distance (m) from (x, z) in cell c to the nearest edge whose neighbour satisfies pred, or Infinity. */
  private edgeDist(c: Readonly<CellData>, x: number, z: number, pred: (n: Readonly<CellData>) => boolean): number {
    const ctr = hexToWorld(c.q, c.r);
    let best = Infinity;
    for (let d = 0; d < 6; d++) {
      const dist = INNER - ((x - ctr.x) * EV[d].x + (z - ctr.z) * EV[d].z);
      if (dist >= best || dist > 6) continue;
      if (pred(this.cell(c.q + DIRS[d][0], c.r + DIRS[d][1]))) best = dist;
    }
    return best;
  }

  /**
   * Meadow detail on open land: a world-anchored jittered 3.2 m grid; each point may hold a tuft clump, a bush pair or a
   * small rock group. Probability = sparse base + irregular patches (two world-space noises → islands with gaps, not per
   * hex) + boosts near forest rims, cliff feet, field margins and road verges. Roads, rivers, water, coast, village lots,
   * squares and fields are blocked cells; verges keep ≥ 0.9 m off road/river tiles.
   */
  *meadowDetail(cells: { q: number; r: number }[]): Generator<void> {
    const P = this.P, sd = this.pc.seed;
    const G = 3.2;
    let xmin = Infinity, xmax = -Infinity, zmin = Infinity, zmax = -Infinity;
    for (const { q, r } of cells) {
      const p = hexToWorld(q, r);
      xmin = Math.min(xmin, p.x); xmax = Math.max(xmax, p.x); zmin = Math.min(zmin, p.z); zmax = Math.max(zmax, p.z);
    }
    xmin -= HEX_SIZE; xmax += HEX_SIZE; zmin -= HEX_SIZE; zmax += HEX_SIZE;
    for (let gz = Math.floor(zmin / G); gz <= Math.ceil(zmax / G); gz++)
      for (let gx = Math.floor(xmin / G); gx <= Math.ceil(xmax / G); gx++) {
        yield;
        const x = (gx + 0.15 + 0.7 * rand01(sd, SALT.meadow, gx, gz, 1)) * G;
        const z = (gz + 0.15 + 0.7 * rand01(sd, SALT.meadow, gx, gz, 2)) * G;
        const h = worldToHex(x, z);
        if (!this.inChunk(h.q, h.r)) continue;
        const c = this.cell(h.q, h.r);
        if (blocked(c) || c.slope || c.forest > 0.15) continue;
        const roadD = this.edgeDist(c, x, z, (n) => n.roadMask !== 0 || n.riverMask !== 0 || n.bridge);
        if (roadD < 0.9) continue;
        // patches: a broad 30 m noise gated by a finer 9 m one → irregular islands of tufts with bare gaps
        const broad = simplex2(sd ^ SALT.patch, x / 30, z / 30);
        const fine = simplex2(sd ^ SALT.patch, x / 9 + 17.3, z / 9 - 4.1);
        const patch = smooth(0.2, 0.55, broad) * smooth(-0.15, 0.25, fine);
        // boosts: forest rim, cliff foot, field margin, road verge
        const Dn = this.densityAt(c, x, z) * clearingAt(sd, x, z);
        const rim = smooth(0.0, 0.12, Dn);
        const cliff = c.tags.includes('cliff') ? 1 - smooth(1.2, 3.2, this.edgeDist(c, x, z, (n) => !n.water && n.level > c.level)) : 0;
        const field = 1 - smooth(1.5, 4, this.edgeDist(c, x, z, (n) => n.tags.includes('field')));
        const verge = 1 - smooth(1.6, 3.4, roadD);
        const edge = Math.max(rim, cliff, field * 0.9, verge * 0.7);
        const p = 0.004 + 0.55 * patch + 0.34 * edge;
        if (rand01(sd, SALT.meadow, gx, gz, 3) >= p) continue;
        // in the open (outside patches and edges) only the chunky pieces: a bush pair or a rock group
        const open = patch < 0.05 && edge < 0.05;
        const v = open ? 0.11 * rand01(sd, SALT.meadow, gx, gz, 4) : rand01(sd, SALT.meadow, gx, gz, 4), w = rand01(sd, SALT.meadow, gx, gz, 5);
        const rot = w * TAU;
        if (v < 0.07 + 0.1 * edge && P.bushes.length >= 2) {
          // bush pair (two sizes, touching)
          const i0 = Math.floor(w * P.bushes.length);
          const b0 = P.bushes[i0];
          if (this.tryBush(c, b0, x, z, rot, 0.75 + 0.2 * w, w * 7)) {
            const a = rot + 1.3, d = b0.footR * 0.9 + 0.5;
            this.tryBush(c, P.bushes[(i0 + 3) % P.bushes.length], x + Math.cos(a) * d, z + Math.sin(a) * d, rot + 2, 0.55 + 0.15 * v, w * 3);
            this.grassClump(x, z, 2, 1.6, hash(sd, SALT.meadow, gx, gz, 6));
          }
        } else if (v < 0.1 + 0.12 * edge + 0.1 * cliff && P.smallRocks.length) {
          // small rock group (1 larger + 1–2 pebbles)
          const n = 2 + Math.floor(w * 2);
          for (let k = 0; k < n; k++) {
            const a = rot + k * 2.1, d = k === 0 ? 0 : 0.9 + 0.4 * rand01(sd, SALT.meadow, gx, gz, 10 + k);
            const rp = P.smallRocks[Math.floor(rand01(sd, SALT.meadow, gx, gz, 20 + k) * P.smallRocks.length)];
            this.tryRock(c, rp, x + Math.cos(a) * d, z + Math.sin(a) * d, a * 3, k === 0 ? 0.85 + 0.3 * v : 0.45 + 0.2 * w);
          }
        } else {
          // tuft clump: 2–4 tufts (light model; a chunky one in the middle now and then)
          const n = 3 + Math.floor(rand01(sd, SALT.meadow, gx, gz, 7) * 3);
          for (let k = 0; k < n; k++) {
            const a = rand01(sd, SALT.meadow, gx, gz, 30 + k) * TAU, d = k === 0 ? 0 : 0.3 + 0.4 * rand01(sd, SALT.meadow, gx, gz, 40 + k);
            const tx = x + Math.cos(a) * d, tz = z + Math.sin(a) * d;
            const th = worldToHex(tx, tz);
            if (th.q !== c.q || th.r !== c.r) continue;
            const chunky = k === 0 && rand01(sd, SALT.meadow, gx, gz, 8) < 0.55;
            const id = chunky ? GRASS[0] : GRASS_LIGHT[rand01(sd, SALT.meadow, gx, gz, 51 + k) < 0.85 ? 0 : 1];
            const sc = chunky ? 0.7 : id.includes('Grass_2') ? 0.55 : 1.15;
            this.emitGrassId(id, tx, tz, sc * (0.85 + 0.3 * rand01(sd, SALT.meadow, gx, gz, 60 + k)), rand01(sd, SALT.meadow, gx, gz, 70 + k) * TAU);
          }
        }
      }
  }

  private emitGrassId(id: string, x: number, z: number, s: number, rot: number) {
    if (!this.free(x, z, 0.2)) return;
    this.plan.grass.push({ id, x, y: this.H(x, z) - 0.04, z, rot, s });
    this.plan.counts.grass++;
  }

}

/**
 * Resumable chunk planning: the same steps in the same order as a single call, yielding between lattice points / cells,
 * so the result is identical however the work is sliced. `step(budgetMs)` returns true once `plan` is complete.
 */
export class PlanJob {
  private gen: Generator<void>;
  private pl: Planner;
  done = false;

  constructor(pc: PlanCtx, P: ProtoSet, cx: number, cz: number, cells: { q: number; r: number }[]) {
    this.pl = new Planner(pc, P, cx, cz);
    const pl = this.pl;
    this.gen = (function* () {
      yield* pl.forestTrees(cells);
      yield* pl.specialTrees(cells);
      yield* pl.roadsideTrees(cells);
      yield* pl.undergrowth(cells);
      yield* pl.cellFeatures(cells);
      if (pc.meadow !== false) yield* pl.meadowDetail(cells);
    })();
  }

  get plan(): Plan {
    return this.pl.plan;
  }

  /** Run until done or `budgetMs` elapsed (Infinity = drain). */
  step(budgetMs = Infinity): boolean {
    if (this.done) return true;
    const t0 = performance.now();
    for (;;) {
      if (this.gen.next().done) return (this.done = true);
      if (budgetMs !== Infinity && performance.now() - t0 >= budgetMs) return false;
    }
  }
}

/** Plan one chunk. Pure: depends only on the seed, the chunk coords, the final cells and the terrain height. */
export function planChunk(pc: PlanCtx, P: ProtoSet, cx: number, cz: number, cells: { q: number; r: number }[]): Plan {
  const job = new PlanJob(pc, P, cx, cz, cells);
  job.step();
  return job.plan;
}
