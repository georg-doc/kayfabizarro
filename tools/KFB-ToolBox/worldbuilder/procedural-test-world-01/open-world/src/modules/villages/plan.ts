import { isRetrySignal } from '../../core/world';
// Village planning — pure function of (seed, stage-3 input cells). One plan per road node (crossing = village,
// some 2-road nodes = hamlet), cached; cells are claimed Voronoi-style so neighbouring plans never overlap.
//
// Layout (see NOTES.md):
//  - spacing: a crossing within MIN_SPACING cells of a stronger crossing is demoted to a hamlet (or nothing)
//  - streets: road cells reachable along the road network from the node within STREET_R cells
//  - ring 1 (the 6 cells around the node are flat at the node level by the roads contract): one free cell becomes the
//    PLAZA (sandy square joined to the crossing, the well on it); the other free ones the tavern + market / church,
//    all facing the crossing
//  - lots: free flat cells next to a street, at the street's level → buildings pushed to the street edge (façade
//    ~1.8 m from the hex edge), door to the street; on a street corner (street along 2–3 edges) two houses, one per
//    street edge, or one house facing the corner
//  - inner lots: church / blacksmith / market; outer lots: lumbermill (forest), construction site
//  - gardens (walled grain plots) behind the houses of the core, fields + windmill on the fringe, back-yard walls
import type { CellData, VillageColor } from '../../core/types';
import { DIRS, hexDistance, hexToWorld, edgeVector, opposite, worldToHex, bitCount6 } from '../../core/hex';
import { hash, rand01, strSeed } from '../../core/rng';
import { LEVEL_H } from '../../core/units';
import { nodesNear, inRiverCorridor, MACRO } from '../roads/api';
// read-only access to the roads network for lazy degree queries (perf: degrees force routing; only ask when needed)
import { roadNetOf } from '../roads/layers';
import { COLORS, FRONT_DEPTH, UNIT, WELL_OFFSET, buildingId, rotForDoor, type BuildingType } from './catalog';
import { corners, faceVec, fitOne, overlaps, polyDist, roadFace } from './fit';
import { Rural } from './rural';

export type Getter = (q: number, r: number) => Readonly<CellData>;
export type RuralFeature = 'farmstead' | 'watchtower' | 'mine' | 'lumbercamp' | 'chapel';

/** Max hex distance of anything of a village from its node. */
export const VR = 6;
/** Minimum hex distance between two village centres (the weaker crossing becomes a hamlet or stays empty). */
export const MIN_SPACING = 15;
const STREET_R = { village: 4, hamlet: 2 } as const;
/** façade → road-strip centreline target (m) and the hard minimum clearance of the footprint from it */
const ROAD_FRONT = 3.6;
const ROAD_CLEAR = 3.1;
const HAMLET_P = 0.45;

export type Role = 'centre' | 'lot' | 'edge';

/** One building on a cell (a cell may hold two houses on a street corner). */
export interface Item {
  type: BuildingType;
  asset: string;
  /** metres from the cell centre */
  x: number;
  z: number;
  rotY: number;
  /** road edge next to the door (for tags / props), -1 for the well */
  door: number;
  /** facing as an edge index, may be x.5 (corner) */
  face: number;
}

export interface PlanCell {
  q: number;
  r: number;
  role: Role;
  /** main building (items[0]) — kept for CellData.building */
  type: BuildingType | null;
  asset: string | null;
  rotY: number;
  door: number;
  face: number;
  items: Item[];
  field: boolean;
  garden: boolean;
  square: boolean;
  plaza: boolean;
  /** edges carrying a stone fence (owned by this cell) */
  fences: number[];
  /** edges carrying a stone gate (field entrance from the street) */
  gates: number[];
  /** field look: grain crop, ploughed dirt, or fenced pasture (grass) */
  crop: 'grain' | 'dirt' | 'pasture' | null;
  /** ground height of the cell top (m) */
  y: number;
}

export interface VillagePlan {
  id: string;
  kind: 'village' | 'hamlet' | 'rural';
  /** rural features only: farmstead / watchtower / mine / lumbercamp / chapel */
  feature?: RuralFeature;
  centre: { q: number; r: number };
  level: number;
  degree: number;
  color: VillageColor;
  cells: Map<string, PlanCell>;
  streets: { q: number; r: number; ds: number }[];
  doors: { q: number; r: number; d: number; type: BuildingType; world: { x: number; y: number; z: number } }[];
  well: { q: number; r: number; world: { x: number; y: number; z: number } } | null;
  fields: { q: number; r: number }[];
  windmill: { q: number; r: number } | null;
  /** plaza cell (sandy square between it and the crossing, the well on it) */
  plaza: { q: number; r: number; toward: number } | null;
  /** cells the village layer levels to the crossing's level (core flattening, integrator permission round 4) */
  flat: Set<string>;
  /** guaranteed free standing point on a street, heading toward the centre (atan2(dx, dz), like player.spawn) */
  spawn: { world: { x: number; y: number; z: number }; heading: number } | null;
}

export const key = (q: number, r: number) => q + ',' + r;

export const PERMS: number[][] = [];
for (let a = 0; a < 4; a++) for (let b = 0; b < 4; b++) for (let c = 0; c < 4; c++) for (let d = 0; d < 4; d++)
  if (new Set([a, b, c, d]).size === 4) PERMS.push([a, b, c, d]);

export function freeCell(c: Readonly<CellData>): boolean {
  if (c.water || c.coastMask || c.slope || c.reserved || c.roadMask || c.riverMask || c.bridge || c.building) return false;
  if (c.biome === 'mountain') return false;
  // embankment: terrain raises a grass shoulder on ramp flanks → neither buildings nor flat field plates fit there
  for (const t of c.tags) if (t === 'rock' || t === 'mountain' || t === 'lake' || t === 'coast' || t === 'ramp' || t === 'embankment') return false;
  return true;
}

/** Ramp-flank embankment (terrain TAG.embankment): fields may lie there, buildings may not. */
export const isEmbankment = (c: Readonly<CellData>) => c.tags.includes('embankment');

/** Angular distance between two (fractional) edge indices, in edge steps (0..3). */
const angDist = (a: number, b: number) => {
  const d = Math.abs((((a - b) % 6) + 6) % 6);
  return Math.min(d, 6 - d);
};

export class Planner {
  private plans = new Map<string, VillagePlan | null>();
  private regions = new Map<number, VillagePlan[]>();
  private readonly s: number;
  /** debug counters (lot candidates rejected by reason) */
  readonly rejects = { level: 0, core: 0, owner: 0, near: 0, accepted: 0, chosen: 0, enclosed: 0, front: 0, single: 0, none: 0 };
  constructor(readonly seed: number, readonly get: Getter) {
    this.s = hash(seed, strSeed('villages'));
  }

  ok(q: number, r: number): boolean {
    return freeCell(this.get(q, r)) && !inRiverCorridor(this.seed, q, r);
  }

  /**
   * Road-node positions within `radius` of (q, r) WITHOUT their degree (a degree forces the roads module to route that
   * node's edges — the expensive part). Same node set and scan as roads' `nodesNear` (minus the degree > 0 filter).
   */
  rawNodes(q: number, r: number, radius: number): { i: number; j: number; q: number; r: number; level: number }[] {
    const net = roadNetOf(this.seed);
    if (!net) return [];
    if (Planner.LEGACY) {
      // eager: computes all degrees in range first (old behaviour); the node set is the subset with degree > 0
      nodesNear(this.seed, q, r, radius);
    }
    const out: { i: number; j: number; q: number; r: number; level: number }[] = [];
    const span = Math.ceil(radius / MACRO) + 2;
    const I = Math.round(q / MACRO), J = Math.round(r / MACRO);
    for (let i = I - span; i <= I + span; i++)
      for (let j = J - span; j <= J + span; j++) {
        const n = net.node(i, j);
        if (!n || hexDistance(q, r, n.q, n.r) > radius) continue;
        out.push({ i, j, q: n.q, r: n.r, level: n.level });
      }
    return out;
  }
  /** A/B perf check only (`?vlegacy=1`): the round-4 eager path (roads' nodesNear computes every degree in range). */
  private static LEGACY = typeof location !== 'undefined' && new URLSearchParams(location.search).has('vlegacy');
  degreeOf(i: number, j: number): number {
    return roadNetOf(this.seed)?.degree(i, j) ?? 0;
  }

  /** Plans that may own cells of the 8×8 region containing (q, r). */
  plansNear(q: number, r: number): VillagePlan[] {
    const I = Math.floor(q / 8), J = Math.floor(r / 8);
    const k = I * 65536 + J;
    let list = this.regions.get(k);
    if (list) return list;
    if (this.regions.size > 4000) this.regions.clear();
    list = [];
    // plan cells lie within VR of their node; region cells within 8 of the region centre → nodes within VR + 8
    for (const n of this.rawNodes(I * 8 + 4, J * 8 + 4, VR + 8)) {
      const d = this.degreeOf(n.i, n.j);
      if (d < 2 || !this.kindOf(n.q, n.r, d)) continue; // no settlement: skip without planning
      const p = this.planAt(n.q, n.r, n.level, d);
      if (p) list.push(p);
    }
    for (const p of this.rural.near(I * 8 + 4, J * 8 + 4, 8 + 2)) list.push(p);
    this.regions.set(k, list);
    return list;
  }

  /** Rural features (farmsteads, watchtowers, mines, lumber camps, chapels) along roads between settlements. */
  readonly rural: Rural = new Rural(this);

  /** Plan cell of (q, r) if any village claims it. */
  cell(q: number, r: number): { plan: VillagePlan; cell: PlanCell } | null {
    const k = key(q, r);
    for (const p of this.plansNear(q, r)) {
      const c = p.cells.get(k);
      if (c) return { plan: p, cell: c };
    }
    return null;
  }

  /** Level a village core sets for (q, r), or null. */
  flatAt(q: number, r: number): number | null {
    const k = key(q, r);
    for (const p of this.plansNear(q, r)) if (p.flat.has(k)) return p.level;
    return null;
  }

  /** All plans whose centre lies within `radius` cells of (q, r). */
  near(q: number, r: number, radius: number): VillagePlan[] {
    const out: VillagePlan[] = [];
    for (const n of nodesNear(this.seed, q, r, radius)) {
      const p = this.planAt(n.q, n.r, n.level, n.degree);
      if (p) out.push(p);
    }
    return out;
  }

  planAt(q0: number, r0: number, level: number, degree: number): VillagePlan | null {
    const k0 = key(q0, r0);
    if (this.plans.has(k0)) return this.plans.get(k0)!;
    if (this.plans.size > 3000) this.plans.clear();
    let p: VillagePlan | null = null;
    try {
      p = this.build(q0, r0, level, degree);
    } catch (e) {
      // roads' prefetch-step "Missing" is a retry signal: not an error, don't memoise (integrator 2026-10-06)
      if (isRetrySignal(e)) throw e;
      console.warn('[module:villages] plan failed at', k0, e);
      p = null;
    }
    this.plans.set(k0, p);
    return p;
  }

  /** Crossing priority (pure): flattest site first (cells within 2 at the node level), then more roads, then a hash. */
  private prio(q: number, r: number, degree: number): number {
    return this.flatCount(q, r) * 1e12 + degree * 1e10 + hash(this.s, q, r, 99);
  }
  private flats = new Map<number, number>();
  /** same-level flat cells within 2 of a node (terrain/roads only, memoised) — the dominant term of prio */
  private flatCount(q: number, r: number): number {
    const k = q * 4194304 + r;
    let flat = this.flats.get(k);
    if (flat !== undefined) return flat;
    if (this.flats.size > 50000) this.flats.clear();
    const L = this.get(q, r).level;
    flat = 0;
    for (let dq = -2; dq <= 2; dq++)
      for (let dr = Math.max(-2, -dq - 2); dr <= Math.min(2, -dq + 2); dr++) {
        const c = this.get(q + dq, r + dr);
        if (!c.water && c.level === L && !c.slope) flat++;
      }
    this.flats.set(k, flat);
    return flat;
  }

  private kinds = new Map<number, 'village' | 'hamlet' | null>();
  /** village / hamlet / nothing for a road node (pure; cheap: no planning) */
  kindOf(q0: number, r0: number, degree: number): 'village' | 'hamlet' | null {
    const k0 = q0 * 4194304 + r0;
    if (this.kinds.has(k0)) return this.kinds.get(k0)!;
    if (this.kinds.size > 20000) this.kinds.clear();
    const R1 = rand01(this.s, q0, r0, 1);
    let kind: 'village' | 'hamlet' | null = null;
    if (degree >= 3) {
      // rival = a crossing within MIN_SPACING with higher prio. prio's flat term dominates (degree·1e10 + hash < 1e12),
      // so a node with a lower flat count can never win → its degree (= routing) is never asked for.
      const myFlat = this.flatCount(q0, r0);
      const me = this.prio(q0, r0, degree);
      let rival = false;
      for (const o of this.rawNodes(q0, r0, MIN_SPACING)) {
        if (o.q === q0 && o.r === r0) continue;
        if (this.flatCount(o.q, o.r) < myFlat) continue;
        const od = this.degreeOf(o.i, o.j);
        if (od >= 3 && this.prio(o.q, o.r, od) > me) { rival = true; break; }
      }
      kind = !rival ? 'village' : null; // a crossing too close to a stronger one stays a plain junction
    } else if (degree === 2 && R1 < HAMLET_P) {
      let nearVillage = false;
      for (const o of this.rawNodes(q0, r0, 10)) if (this.degreeOf(o.i, o.j) >= 3) { nearVillage = true; break; }
      kind = nearVillage ? null : 'hamlet';
    }
    this.kinds.set(k0, kind);
    return kind;
  }

  private build(q0: number, r0: number, L: number, degree: number): VillagePlan | null {
    const S = this.s;
    const R = (...v: number[]) => rand01(S, q0, r0, ...v);
    const base = this.get;
    let get: Getter = base;

    // ---- kind (with minimum spacing between villages)
    const kind = this.kindOf(q0, r0, degree);
    if (!kind) return null;

    // ---- core flattening: cells within 2 of the crossing one level off become the crossing's level, unless that
    //      would create a 2-level wall against a cell outside the set (the cliff moves outward) or touch a ramp/water
    const flat = new Set<string>();
    if (kind === 'village') {
      const C = new Set<string>();
      for (let dq = -2; dq <= 2; dq++)
        for (let dr = Math.max(-2, -dq - 2); dr <= Math.min(2, -dq + 2); dr++) {
          const q = q0 + dq, r = r0 + dr;
          const c = base(q, r);
          if (Math.abs(c.level - L) !== 1) continue;
          if (c.water || c.coastMask || c.slope || c.roadMask || c.riverMask || c.bridge || c.reserved || c.biome === 'mountain') continue;
          if (c.tags.some((t) => t === 'rock' || t === 'mountain' || t === 'lake' || t === 'coast' || t === 'ramp' || t === 'road-ramp' || t === 'embankment')) continue;
          if (inRiverCorridor(this.seed, q, r)) continue;
          let bad = false;
          for (const [a, b] of DIRS) {
            const n = base(q + a, r + b);
            if (n.slope || n.water) { bad = true; break; }
          }
          if (!bad) C.add(key(q, r));
        }
      for (let it = 0; it < 8; it++) {
        let changed = false;
        for (const k of [...C]) {
          const [q, r] = k.split(',').map(Number);
          for (const [a, b] of DIRS) {
            const nk = key(q + a, r + b);
            if (C.has(nk)) continue;
            if (Math.abs(base(q + a, r + b).level - L) >= 2) { C.delete(k); changed = true; break; }
          }
        }
        if (!changed) break;
      }
      for (const k of C) flat.add(k);
      const fc = new Map<string, CellData>();
      get = (q, r) => {
        const k = key(q, r);
        if (!flat.has(k)) return base(q, r);
        let c = fc.get(k);
        if (!c) fc.set(k, (c = { ...base(q, r), level: L }));
        return c;
      };
    }

    // ---- Voronoi ownership against every other road node nearby (+1 cell of no-man's-land)
    // only nodes that carry a settlement compete for cells (a demoted crossing does not cut the village)
    // (a node can only take a cell c (d0 ≤ VR) if dist(c, o) < d0 + 2 → dist(q0, o) ≤ 2·VR + 1)
    const others = this.rawNodes(q0, r0, 2 * VR + 1).filter((n) => {
      if (n.q === q0 && n.r === r0) return false;
      const d = this.degreeOf(n.i, n.j);
      return d >= 2 && !!this.kindOf(n.q, n.r, d);
    });
    const ownMemo = new Map<string, boolean>();
    const owns = (q: number, r: number): boolean => {
      const k = key(q, r);
      let v = ownMemo.get(k);
      if (v !== undefined) return v;
      const d0 = hexDistance(q, r, q0, r0);
      v = d0 <= VR;
      if (v)
        for (const o of others)
          if (hexDistance(q, r, o.q, o.r) < d0 + 2) { v = false; break; }
      ownMemo.set(k, v);
      return v;
    };

    // ---- streets: BFS along road connectivity
    const SR = STREET_R[kind];
    const ds = new Map<string, number>();
    const streets: { q: number; r: number; ds: number }[] = [{ q: q0, r: r0, ds: 0 }];
    ds.set(key(q0, r0), 0);
    for (let i = 0; i < streets.length; i++) {
      const s = streets[i];
      const sc = get(s.q, s.r);
      for (let d = 0; d < 6; d++) {
        if (!((sc.roadMask >> d) & 1)) continue;
        const nq = s.q + DIRS[d][0], nr = s.r + DIRS[d][1];
        const nk = key(nq, nr);
        if (ds.has(nk) || hexDistance(nq, nr, q0, r0) > SR) continue;
        if (!((get(nq, nr).roadMask >> opposite(d)) & 1)) continue;
        ds.set(nk, s.ds + 1);
        streets.push({ q: nq, r: nr, ds: s.ds + 1 });
      }
    }

    // ---- lot candidates: free flat cells next to a flat street cell at the same level, whose street's road STRIP
    //      actually passes close (≤ 13.6 m from the lot centre: the strip runs along this side of the street cell)
    interface Face { d: number; ds: number }
    interface Cand { q: number; r: number; dist: number; faces: Face[]; level: number; ds: number; near: number; face: number; door: number; px: number; pz: number; segs?: [number, number, number, number][] }
    const cands = new Map<string, Cand>();
    const HALF = 7.5; // centre → edge midpoint (m)
    for (const s of streets) {
      const sc = get(s.q, s.r);
      if (sc.slope || sc.bridge) continue;
      const sw = hexToWorld(s.q, s.r);
      // road strip of the street cell: centre → midpoint of every road edge
      const segs: [number, number, number, number][] = [];
      for (let d = 0; d < 6; d++) if ((sc.roadMask >> d) & 1) {
        const e = edgeVector(d);
        segs.push([sw.x, sw.z, sw.x + e.x * HALF, sw.z + e.z * HALF]);
      }
      for (let d = 0; d < 6; d++) {
        const nq = s.q + DIRS[d][0], nr = s.r + DIRS[d][1];
        const nk = key(nq, nr);
        if (ds.has(nk)) continue;
        const nc = get(nq, nr);
        if (nc.roadMask) continue;
        if (nc.level !== sc.level) { this.rejects.level++; continue; }
        const dist = hexDistance(nq, nr, q0, r0);
        if (dist <= 3 && nc.level !== L) { this.rejects.core++; continue; } // the core stays on the crossing's level
        if (!owns(nq, nr) || !this.ok(nq, nr)) { this.rejects.owner++; continue; }
        let c = cands.get(nk);
        if (!c) cands.set(nk, (c = { q: nq, r: nr, dist, faces: [], level: nc.level, ds: s.ds, near: Infinity, face: 0, door: opposite(d), px: 0, pz: 0 }));
        c.faces.push({ d: opposite(d), ds: s.ds });
        const lw = hexToWorld(nq, nr);
        (c.segs ??= []).push(...segs);
        for (const [x0, z0, x1, z1] of segs) {
          const vx = x1 - x0, vz = z1 - z0;
          const t = Math.max(0, Math.min(1, ((lw.x - x0) * vx + (lw.z - z0) * vz) / (vx * vx + vz * vz)));
          const px = x0 + vx * t, pz = z0 + vz * t;
          const dd = Math.hypot(px - lw.x, pz - lw.z);
          if (dd < c.near - 1e-6 || (Math.abs(dd - c.near) < 1e-6 && s.ds < c.ds)) {
            c.near = dd;
            c.ds = s.ds;
            c.px = px;
            c.pz = pz;
            // facing: toward that nearest strip point, in half edge steps (12 directions)
            const ang = Math.atan2(-(pz - lw.z), px - lw.x);
            c.face = ((Math.round(ang / (Math.PI / 6)) / 2) % 6 + 6) % 6;
          }
        }
      }
    }
    for (const [k, c] of cands) {
      if (c.near > 13.6) { cands.delete(k); this.rejects.near++; continue; }
      this.rejects.accepted++;
      // front perpendicular to the road passing by (game critic r2: no 30°-off houses at bends)
      if (c.segs) {
        const lw = hexToWorld(c.q, c.r);
        const f = roadFace(lw.x, lw.z, c.segs);
        if (f !== null) c.face = f;
        c.segs = undefined;
      }
      // door tag: the street edge closest to the facing
      c.door = c.faces.map((f) => f.d).sort((a, b) => angDist(a, c.face) - angDist(b, c.face))[0];
    }

    // ---- colour: 4-colouring of the macro node lattice, per-seed permutation
    const li = Math.round(q0 / MACRO), lj = Math.round(r0 / MACRO);
    const perm = PERMS[hash(this.seed, strSeed('villages.colors')) % PERMS.length];
    const color = COLORS[perm[(((li + 2 * lj) % 4) + 4) % 4]];

    const cells = new Map<string, PlanCell>();
    const used = new Set<string>(ds.keys());
    const blank = (q: number, r: number, role: Role): PlanCell => ({
      q, r, role, type: null, asset: null, rotY: 0, door: -1, face: -1, items: [], field: false, garden: false,
      square: false, plaza: false, fences: [], gates: [], crop: null, y: get(q, r).level * LEVEL_H,
    });
    const put = (pc: PlanCell) => {
      if (pc.items.length) {
        const m = pc.items[0];
        pc.type = m.type;
        pc.asset = m.asset;
        pc.rotY = m.rotY;
        pc.door = m.door;
        pc.face = m.face;
      }
      cells.set(key(pc.q, pc.r), pc);
      used.add(key(pc.q, pc.r));
      return pc;
    };
    const item = (t: BuildingType, face: number, door: number, at: { x: number; z: number; rotY: number }): Item => ({
      type: t, asset: buildingId(t, color), x: at.x, z: at.z, rotY: at.rotY, door, face,
    });
    /** One building on a cell facing `face`; falls back to the integer door edge, then the centre. */
    const placed: { x: number; z: number; pts: [number, number][] }[] = []; // world footprints so far
    const single = (q: number, r: number, role: Role, t: BuildingType, face: number, door: number): PlanCell | null => {
      if (isEmbankment(get(q, r))) return null;
      const w = hexToWorld(q, r);
      const avoid = placed.filter((p) => Math.hypot(p.x - w.x, p.z - w.z) < 24).map((p) => p.pts.map(([x, z]) => [x - w.x, z - w.z] as [number, number]));
      let at = fitOne(t, face, undefined, avoid);
      let f = face;
      if (!at && !Number.isInteger(face)) { at = fitOne(t, door, undefined, avoid); f = door; }
      if (!at) return null; // no room without touching a neighbour: leave the lot open
      placed.push({ x: w.x + at.x, z: w.z + at.z, pts: corners(t, at.rotY, w.x + at.x, w.z + at.z) });
      const pc = blank(q, r, role);
      pc.items.push(item(t, f, door, at));
      return put(pc);
    };
    /** road strip segments (centre → road-edge midpoints) of every road cell within 2 of (q, r) */
    const stripsNear = (q: number, r: number) => {
      const out: [number, number, number, number][] = [];
      for (let dq = -2; dq <= 2; dq++)
        for (let dr = Math.max(-2, -dq - 2); dr <= Math.min(2, -dq + 2); dr++) {
          const c = get(q + dq, r + dr);
          if (!c.roadMask) continue;
          const w = hexToWorld(q + dq, r + dr);
          for (let d = 0; d < 6; d++) if ((c.roadMask >> d) & 1) {
            const e = edgeVector(d);
            out.push([w.x, w.z, w.x + e.x * 7.5, w.z + e.z * 7.5]);
          }
        }
      return out;
    };
    /** Street frontage: slide the building from its lot centre toward the nearest road strip point until the façade is
     *  ROAD_FRONT m from the strip centreline; the footprint may reach over the lot edge onto the grass of the street
     *  cell (same level, no ramp/bridge) but keeps ROAD_CLEAR from every road strip and never touches another building. */
    const frontage = (c: Cand, t: BuildingType, role: Role): PlanCell | null => {
      if (!Number.isFinite(c.px) || isEmbankment(get(c.q, c.r))) return null;
      const w = hexToWorld(c.q, c.r);
      const rotY = rotForDoor(t, c.face);
      const u = faceVec(c.face);
      const along = (c.px - w.x) * u.x + (c.pz - w.z) * u.z;
      const strips = stripsNear(c.q, c.r);
      const okCell = (x: number, z: number) => {
        const h = worldToHex(x, z);
        if (h.q === c.q && h.r === c.r) return true;
        const hc = get(h.q, h.r);
        return ds.has(key(h.q, h.r)) && hc.level === c.level && !hc.slope && !hc.bridge && !isEmbankment(hc);
      };
      const avoid = placed.filter((p) => Math.hypot(p.x - w.x, p.z - w.z) < 26).map((p) => p.pts);
      for (let s = along - FRONT_DEPTH[t] * UNIT - ROAD_FRONT; s >= 0; s -= 0.25) {
        const x = w.x + u.x * s, z = w.z + u.z * s;
        const pts = corners(t, rotY, x, z);
        // sample the footprint outline (corners + edge points)
        const ring: [number, number][] = [];
        for (let i = 0; i < 4; i++) {
          const [ax, az] = pts[i], [bx, bz] = pts[(i + 1) % 4];
          for (let k = 0; k < 4; k++) ring.push([ax + ((bx - ax) * k) / 4, az + ((bz - az) * k) / 4]);
        }
        if (!ring.every(([px, pz]) => okCell(px, pz))) continue;
        let clear = Infinity;
        for (const [ax, az, bx, bz] of strips)
          for (let k = 0; k <= 10; k++) {
            const sx = ax + ((bx - ax) * k) / 10, sz = az + ((bz - az) * k) / 10;
            clear = Math.min(clear, polyDist(pts, sx, sz));
          }
        if (clear < ROAD_CLEAR) continue;
        const pad = corners(t, rotY, x, z, 0.45);
        if (avoid.some((o) => overlaps(pad, o))) continue;
        placed.push({ x, z, pts });
        const pc = blank(c.q, c.r, role);
        pc.items.push(item(t, c.face, c.door, { x: x - w.x, z: z - w.z, rotY }));
        return put(pc);
      }
      return null;
    };
    const towardNode = (q: number, r: number) => {
      for (let d = 0; d < 6; d++) if (q + DIRS[d][0] === q0 && r + DIRS[d][1] === r0) return d;
      return -1;
    };

    // ---- centre (ring 1): plaza + well, tavern, market / church
    const cliffs = (c: Cand) => {
      let n = 0;
      for (const [dq, dr] of DIRS) {
        const nc = get(c.q + dq, c.r + dr);
        if (!nc.water && nc.level !== c.level) n++;
      }
      return n;
    };
    const ring1 = [...cands.values()].filter((c) => c.dist === 1 && !isEmbankment(get(c.q, c.r))).sort((a, b) => hash(S, a.q, a.r, 21) - hash(S, b.q, b.r, 21));
    let plaza: VillagePlan['plaza'] = null;
    const placeWell = (c: Cand, isPlaza: boolean) => {
      const d = towardNode(c.q, c.r);
      const v = edgeVector(d);
      const off = isPlaza ? 0 : WELL_OFFSET * 0.8; // on the plaza: in its middle
      const pc = blank(c.q, c.r, 'centre');
      pc.square = true;
      pc.plaza = isPlaza;
      pc.items.push(item('well', d, -1, { x: v.x * off, z: v.z * off, rotY: rotForDoor('well', d) }));
      const w = hexToWorld(c.q, c.r);
      placed.push({ x: w.x + v.x * off, z: w.z + v.z * off, pts: corners('well', rotForDoor('well', d), w.x + v.x * off, w.z + v.z * off) });
      put(pc);
      if (isPlaza) plaza = { q: c.q, r: c.r, toward: d };
    };
    /** road cells around (q, r) */
    const roadNb = (q: number, r: number) => {
      let n = 0;
      for (const [a, b] of DIRS) if (get(q + a, r + b).roadMask) n++;
      return n;
    };
    /** a core cell boxed in by roads on ≥ 3 sides reads as a roundabout island: no building there */
    const enclosed = (q: number, r: number) => {
      if (hexDistance(q, r, q0, r0) > 2) return false;
      let m = 0;
      for (let d = 0; d < 6; d++) if (get(q + DIRS[d][0], r + DIRS[d][1]).roadMask) m |= 1 << d;
      const n = bitCount6(m);
      if (n >= 4) return true;
      if (n < 3) return false;
      // 3 road neighbours: fine when they form one consecutive run (a corner lot), enclosed when on opposite sides
      for (let d = 0; d < 6; d++) if (((m >> d) & 1) && ((m >> ((d + 1) % 6)) & 1) && ((m >> ((d + 2) % 6)) & 1)) return false;
      return true;
    };
    const inner: BuildingType[] = [];
    if (kind === 'village' && ring1.length) {
      // plaza: the ring-1 cell with the fewest cliffs, then the most enclosed by roads (a square between the streets)
      const pz = [...ring1].sort((a, b) => cliffs(a) - cliffs(b) || roadNb(b.q, b.r) - roadNb(a.q, a.r) || hash(S, a.q, a.r, 22) - hash(S, b.q, b.r, 22))[0];
      placeWell(pz, true);
      // free cells around the square (not on a street) become lots facing the square
      for (let d = 0; d < 6; d++) {
        const q = pz.q + DIRS[d][0], r = pz.r + DIRS[d][1];
        const k = key(q, r);
        if (used.has(k) || cands.has(k) || get(q, r).level !== L || !owns(q, r) || !this.ok(q, r)) continue;
        const f = opposite(d);
        cands.set(k, { q, r, dist: hexDistance(q, r, q0, r0), faces: [{ d: f, ds: 1 }], level: L, ds: 1, near: 7.5, face: f, door: f, px: NaN, pz: NaN });
      }
      // civic buildings take the cells around the square first (facing it), then the rest of ring 1 (facing the crossing)
      const civic: BuildingType[] = ['tavern', 'church', 'blacksmith'];
      if (R(3) < 0.75) civic.splice(1, 0, 'market');
      const dirTo = (a: { q: number; r: number }, b: { q: number; r: number }) => {
        for (let d = 0; d < 6; d++) if (a.q + DIRS[d][0] === b.q && a.r + DIRS[d][1] === b.r) return d;
        return -1;
      };
      const slots = [...cands.values()]
        .filter((c) => c !== pz && !used.has(key(c.q, c.r)) && c.level === L && !enclosed(c.q, c.r) && (c.dist === 1 || hexDistance(c.q, c.r, pz.q, pz.r) === 1))
        .sort((a, b) => hexDistance(a.q, a.r, pz.q, pz.r) - hexDistance(b.q, b.r, pz.q, pz.r) || a.dist - b.dist || hash(S, a.q, a.r, 23) - hash(S, b.q, b.r, 23));
      let ci = 0;
      for (const c of slots) {
        if (ci >= civic.length) break;
        // a cell on a street faces its road (game critic r1: no side-on/back-on to the road); only cells that touch
        // the square but no street face the square
        if (Number.isFinite(c.px)) {
          if (frontage(c, civic[ci], 'centre') ?? single(c.q, c.r, 'centre', civic[ci], c.face, c.door)) ci++;
        } else {
          const dp = dirTo(c, pz);
          if (single(c.q, c.r, 'centre', civic[ci], dp, dp)) ci++;
        }
      }
      for (; ci < civic.length; ci++) inner.push(civic[ci]);
    } else if (ring1.length && R(4) < 0.6) placeWell(ring1[0], false);

    // ---- lots: every street lot of the core, thinning toward the fringe
    const lots = [...cands.values()]
      .filter((c) => !used.has(key(c.q, c.r)))
      .sort((a, b) => a.ds - b.ds || a.dist - b.dist || hash(S, a.q, a.r, 31) - hash(S, b.q, b.r, 31));
    const maxLots = kind === 'village' ? 20 + Math.floor(R(5) * 5) : 2 + Math.floor(R(5) * 3);
    const chosen: Cand[] = [];
    for (const c of lots) {
      if (chosen.length >= maxLots) break;
      const p = kind === 'hamlet' ? 0.85 : c.dist <= 3 ? 1 : c.dist === 4 ? 0.85 : 0.45;
      if (rand01(S, c.q, c.r, 41) < p) chosen.push(c);
    }
    const special = new Map<string, BuildingType>();
    if (kind === 'village') {
      // inner roles on the innermost lots (ring 2, short street distance)
      const pzc = plaza as { q: number; r: number } | null;
      const innerLots = chosen
        .filter((c) => c.dist <= 3 && !enclosed(c.q, c.r))
        .sort((a, b) => (pzc ? hexDistance(a.q, a.r, pzc.q, pzc.r) - hexDistance(b.q, b.r, pzc.q, pzc.r) : 0) || a.dist - b.dist || hash(S, a.q, a.r, 51) - hash(S, b.q, b.r, 51));
      for (const t of inner) {
        const c = innerLots.find((x) => !special.has(key(x.q, x.r)));
        if (c) special.set(key(c.q, c.r), t);
      }
      // lumbermill: an outer lot next to the forest
      let bestF = 3.0, lm: Cand | null = null;
      for (const c of chosen) {
        if (c.dist < 3 || special.has(key(c.q, c.r))) continue;
        let f = 0; // summed forest potential of the neighbours: a real forest edge, not one wooded cell
        for (const [dq, dr] of DIRS) f += get(c.q + dq, c.r + dr).forest;
        if (f > bestF) { bestF = f; lm = c; }
      }
      if (lm) special.set(key(lm.q, lm.r), 'lumbermill');
      // (construction sites dropped in round 3: the roofless frames read as broken houses)
    }
    for (const c of chosen) {
      const sp = special.get(key(c.q, c.r));
      const role: Role = sp === 'lumbermill' ? 'edge' : 'lot';
      const t: BuildingType = sp ?? (rand01(S, c.q, c.r, 61) < 0.58 ? 'home_A' : 'home_B');
      // door toward the nearest point of the road strip (half edge steps), façade at the street; fallback: in-hex fit
      this.rejects.chosen++;
      if (enclosed(c.q, c.r)) { this.rejects.enclosed++; continue; }
      if (frontage(c, t, role)) this.rejects.front++;
      else if (single(c.q, c.r, role, t, c.face, c.door)) this.rejects.single++;
      else this.rejects.none++;
    }

    // ---- gardens: walled grain plots behind the houses of the core
    if (kind === 'village') {
      const gardenCands: { q: number; r: number; n: number }[] = [];
      for (const pc of cells.values()) {
        if (!pc.items.length || pc.role === 'centre') continue;
        for (const [dq, dr] of DIRS) {
          const q = pc.q + dq, r = pc.r + dr;
          const k = key(q, r);
          if (used.has(k) || !owns(q, r) || !this.ok(q, r) || hexDistance(q, r, q0, r0) > 3 || hexDistance(q, r, q0, r0) < 2) continue;
          if (plaza && hexDistance(q, r, (plaza as { q: number; r: number }).q, (plaza as { q: number; r: number }).r) <= 1) continue;
          if (get(q, r).level !== get(pc.q, pc.r).level) continue;
          let n = 0;
          for (const [eq, er] of DIRS) if (cells.get(key(q + eq, r + er))?.items.length) n++;
          if (n >= 2 && !gardenCands.some((g) => g.q === q && g.r === r)) gardenCands.push({ q, r, n });
        }
      }
      gardenCands.sort((a, b) => b.n - a.n || hash(S, a.q, a.r, 71) - hash(S, b.q, b.r, 71));
      // street-side lots left without a house inside the village: walled garden plots, not bare lawn
      const nearSquare = (q: number, r: number) => !!plaza && hexDistance(q, r, (plaza as { q: number; r: number }).q, (plaza as { q: number; r: number }).r) <= 1;
      const roadside = [...cands.values()]
        .filter((c) => !used.has(key(c.q, c.r)) && c.dist >= 2 && c.dist <= 4 && !nearSquare(c.q, c.r))
        .map((c) => ({ q: c.q, r: c.r, n: 9 }));
      for (const g of [...roadside.slice(0, 8), ...gardenCands.slice(0, 3)]) {
        if (used.has(key(g.q, g.r))) continue;
        const pc = blank(g.q, g.r, 'lot');
        pc.field = true;
        pc.garden = true;
        put(pc);
      }
    }

    // ---- fields (+ windmill) on the fringe
    const fields: { q: number; r: number }[] = [];
    for (const pc of cells.values()) if (pc.field) fields.push({ q: pc.q, r: pc.r });
    let windmill: VillagePlan['windmill'] = null;
    const fieldOk = (q: number, r: number, lvl: number) => {
      const k = key(q, r);
      if (used.has(k) || !owns(q, r)) return false;
      if (get(q, r).level !== lvl || !this.ok(q, r)) return false;
      return hexDistance(q, r, q0, r0) >= 3;
    };
    const clusters = kind === 'village' ? (R(7) < 0.5 ? 2 : 1) : R(7) < 0.7 ? 1 : 0;
    const clusterDirs: { x: number; z: number }[] = [];
    for (let ci = 0; ci < clusters; ci++) {
      let best: { q: number; r: number; score: number } | null = null;
      for (const k of used) {
        const [uq, ur] = k.split(',').map(Number);
        for (const [dq, dr] of DIRS) {
          const q = uq + dq, r = ur + dr;
          const dist = hexDistance(q, r, q0, r0);
          if (dist < 3 || dist > VR - 1) continue;
          const lvl = get(q, r).level;
          if (!fieldOk(q, r, lvl)) continue;
          let room = 0;
          for (const [eq, er] of DIRS) if (fieldOk(q + eq, r + er, lvl)) room++;
          if (room < 2) continue;
          const w = hexToWorld(q - q0, r - r0);
          const len = Math.hypot(w.x, w.z) || 1;
          let sep = 0;
          for (const cd of clusterDirs) sep += 1 - (w.x * cd.x + w.z * cd.z) / len;
          const score = room * 0.35 + dist * 0.25 + sep * 1.5 + rand01(S, q, r, 71 + ci);
          if (!best || score > best.score) best = { q, r, score };
        }
      }
      if (!best) break;
      const lvl = get(best.q, best.r).level;
      const target = kind === 'village' ? 3 + Math.floor(R(8 + ci) * 3) : 2 + Math.floor(R(8 + ci) * 2);
      const cl: { q: number; r: number }[] = [];
      const inCl = new Set<string>();
      const frontier = [best];
      while (cl.length < target && frontier.length) {
        frontier.sort((a, b) => hexDistance(b.q, b.r, q0, r0) - hexDistance(a.q, a.r, q0, r0) || rand01(S, a.q, a.r, 81) - rand01(S, b.q, b.r, 81));
        const f = frontier.shift()!;
        const fk = key(f.q, f.r);
        if (inCl.has(fk) || !fieldOk(f.q, f.r, lvl)) continue;
        inCl.add(fk);
        cl.push({ q: f.q, r: f.r });
        used.add(fk);
        for (const [dq, dr] of DIRS) {
          const q = f.q + dq, r = f.r + dr;
          if (!inCl.has(key(q, r)) && fieldOk(q, r, lvl) && hexDistance(q, r, q0, r0) <= VR) frontier.push({ q, r, score: 0 });
        }
      }
      if (cl.length < 2) {
        for (const c of cl) used.delete(key(c.q, c.r));
        continue;
      }
      const w = hexToWorld(best.q - q0, best.r - r0);
      const len = Math.hypot(w.x, w.z) || 1;
      clusterDirs.push({ x: w.x / len, z: w.z / len });
      for (const c of cl) {
        const pc = blank(c.q, c.r, 'edge');
        pc.field = true;
        put(pc);
        fields.push(c);
      }
      // windmill next to the first cluster, preferably on a street (door to the street)
      if (ci === 0 && (kind === 'village' || R(9) < 0.5)) {
        let wb: { q: number; r: number; door: number; score: number } | null = null;
        for (const c of cl)
          for (const [dq, dr] of DIRS) {
            const q = c.q + dq, r = c.r + dr;
            if (!fieldOk(q, r, lvl)) continue;
            let door = -1, nf = 0;
            for (let d = 0; d < 6; d++) {
              const nq = q + DIRS[d][0], nr = r + DIRS[d][1];
              if (ds.has(key(nq, nr)) && door < 0 && !get(nq, nr).slope) door = d;
              if (inCl.has(key(nq, nr))) nf++;
            }
            const score = (door >= 0 ? 3 : 0) + nf + rand01(S, q, r, 91);
            if (!wb || score > wb.score) {
              // no street next to it: turn the door toward the nearest street cell (the path to the mill)
              let dd = door;
              if (dd < 0) {
                let bs: { q: number; r: number } | null = null, bd = Infinity;
                for (const st of streets) {
                  const dist = hexDistance(q, r, st.q, st.r);
                  if (dist < bd) { bd = dist; bs = st; }
                }
                const a = hexToWorld(q, r), b = bs ? hexToWorld(bs.q, bs.r) : hexToWorld(q0, r0);
                let bestDot = -Infinity;
                for (let d = 0; d < 6; d++) {
                  const e = edgeVector(d);
                  const dot = e.x * (b.x - a.x) + e.z * (b.z - a.z);
                  if (dot > bestDot) { bestDot = dot; dd = d; }
                }
              }
              wb = { q, r, door: dd, score };
            }
          }
        if (wb) {
          single(wb.q, wb.r, 'edge', 'windmill', wb.door, wb.door);
          windmill = { q: wb.q, r: wb.r };
        }
      }
    }

    // ---- stone walls: closed borders around every field / garden cluster (a gate toward the street), nothing else.
    //      A border edge is skipped only where a cliff rises (the cliff is the border) or toward water.
    const isStreet = (q: number, r: number) => ds.has(key(q, r));
    const gated = new Set<string>(); // one gate per cluster: cluster id = smallest key reachable
    const clusterOf = new Map<string, string>();
    for (const c of cells.values()) {
      if (!c.field || clusterOf.has(key(c.q, c.r))) continue;
      const id = key(c.q, c.r);
      const st = [c];
      clusterOf.set(id, id);
      while (st.length) {
        const x = st.pop()!;
        for (const [a, b] of DIRS) {
          const nk = key(x.q + a, x.r + b);
          const n = cells.get(nk);
          if (n?.field && !clusterOf.has(nk)) { clusterOf.set(nk, id); st.push(n); }
        }
      }
    }
    // crop per cluster: grain / ploughed / mixed rows / pasture (gardens never pasture)
    for (const c of cells.values()) {
      if (!c.field) continue;
      const cid = clusterOf.get(key(c.q, c.r))!;
      const [cq, cr] = cid.split(',').map(Number);
      const u = rand01(S, cq, cr, 131);
      // (pasture dropped after game critic r2: a fence around bare grass reads as "enclosing nothing")
      const look = u < 0.5 ? 'grain' : u < 0.75 ? 'dirt' : 'mixed';
      c.crop = look === 'mixed' ? (rand01(S, c.q, c.r, 132) < 0.5 ? 'grain' : 'dirt') : (look as PlanCell['crop']);
    }
    for (const c of cells.values()) {
      if (!c.field) continue;
      const cid = clusterOf.get(key(c.q, c.r))!;
      for (let d = 0; d < 6; d++) {
        const nq = c.q + DIRS[d][0], nr = c.r + DIRS[d][1];
        if (cells.get(key(nq, nr))?.field) continue;
        const nc = get(nq, nr);
        const cl = get(c.q, c.r).level;
        if (nc.water || nc.level > cl) continue;
        if (isStreet(nq, nr) && !gated.has(cid) && nc.level === cl) { gated.add(cid); c.gates.push(d); continue; }
        c.fences.push(d);
      }
    }

    // ---- API data
    const doors: VillagePlan['doors'] = [];
    let well: VillagePlan['well'] = null;
    for (const c of cells.values()) {
      const ctr = hexToWorld(c.q, c.r);
      const y = get(c.q, c.r).level * LEVEL_H;
      for (const it of c.items) {
        if (it.type === 'well') {
          well = { q: c.q, r: c.r, world: { x: ctr.x + it.x, y, z: ctr.z + it.z } };
          continue;
        }
        const v = faceVec(it.face);
        const depth = FRONT_DEPTH[it.type] * UNIT + 0.5;
        doors.push({ q: c.q, r: c.r, d: it.door, type: it.type, world: { x: ctr.x + it.x + v.x * depth, y, z: ctr.z + it.z + v.z * depth } });
      }
    }
    if (!doors.length && !fields.length) return null;

    // ---- spawn: a flat street cell 2 (else 1) out at the centre level, facing the crossing
    let spawn: VillagePlan['spawn'] = null;
    const cw = hexToWorld(q0, r0);
    const sc = streets
      .filter((s) => s.ds >= 1 && s.ds <= 2 && !get(s.q, s.r).slope && get(s.q, s.r).level === L)
      .sort((a, b) => b.ds - a.ds || hash(S, a.q, a.r, 121) - hash(S, b.q, b.r, 121))[0];
    if (sc) {
      const p = hexToWorld(sc.q, sc.r);
      spawn = { world: { x: p.x, y: L * LEVEL_H, z: p.z }, heading: Math.atan2(cw.x - p.x, cw.z - p.z) };
    } else spawn = { world: { x: cw.x, y: L * LEVEL_H, z: cw.z }, heading: 0 };

    return {
      id: `v${q0},${r0}`, kind, centre: { q: q0, r: r0 }, level: L, degree, color, cells, streets, doors, well, fields,
      windmill, plaza, spawn, flat,
    };
  }
}

const planners = new Map<number, Planner>();
/** Bind (or get) the planner of a seed. The first getter wins (all stage-3 getters are equivalent). */
export function bindPlanner(seed: number, get: Getter): Planner {
  let p = planners.get(seed);
  if (!p) planners.set(seed, (p = new Planner(seed, get)));
  return p;
}
export const plannerOf = (seed: number) => planners.get(seed) ?? null;
