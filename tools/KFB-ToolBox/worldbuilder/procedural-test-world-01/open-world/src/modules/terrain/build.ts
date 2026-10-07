// Per-chunk tiles, procedural shore tops, water mesh, colliders and the exact ground-height function.
import * as THREE from 'three';
import { ConvexHull } from 'three/examples/jsm/math/ConvexHull.js';
import type RAPIER from '@dimforge/rapier3d-compat';
import type { ChunkBuilder } from '../../core/chunks';
import type { CellData, ChunkInfo, CoreContext } from '../../core/types';
import { DIRS, hexToWorld, worldToAxial, worldToHex, hexRound, edgeVector } from '../../core/hex';
import { HEX_SCALE, HEX_SIZE, LEVEL_H, TILE_THICKNESS } from '../../core/units';
import { WORLD_GROUPS, PLAYER_ONLY_GROUPS, CAMERA_ONLY_GROUPS } from '../../core/groups';
import { WaterMeshBuilder, type WaterMaterial } from './water';
import { makeTerrainMaterial, rampProfile, softenBevel, type TerrainLook } from './look';
import { SHORE_N, SHORE_SMOOTH, shoreProfile, distToHex, hexLattice, latticeHeight, shoreD, shoreSurface, waterlineD } from './shore';
import type { TerrainGen } from './gen';

export const T_GRASS = 'hex/tiles/base/hex_grass';
export const T_BOTTOM = 'hex/tiles/base/hex_grass_bottom';
export const T_SLOPE_LOW = 'hex/tiles/base/hex_grass_sloped_low';
export const T_SLOPE_HIGH = 'hex/tiles/base/hex_grass_sloped_high';

/** Water blocker reaches this high above the lake's land level (player cannot step over). */
const BLOCK_ABOVE = 2.2;
/** Water surface below the lake's land level (KayKit: 0.2 asset units). */
export let WATER_DROP = 1.5;
export function setWaterDrop(v: number): void {
  WATER_DROP = v;
}
/** Lake bed below the lake's land level. */
const BED_DEPTH = 4.5;
/** KayKit tile top-edge bevel depth (0.05 asset units) plus margin: columns must reach below a neighbour's bevel. */
const BEVEL = 0.05 * HEX_SCALE + 0.1;
/** Shore cells: the procedural top surface + skirt reaches this far down; the KayKit column starts here. */
const SHORE_SKIRT = 3.3;

interface DecoShape { points: Float32Array }

const _m = new THREE.Matrix4();
const _q = new THREE.Quaternion();
const _s = new THREE.Vector3(1, 1, 1);
const _p = new THREE.Vector3();
const _yAxis = new THREE.Vector3(0, 1, 0);

function hexCorners(r: number): [number, number][] {
  const out: [number, number][] = [];
  for (let i = 0; i < 6; i++) {
    const a = ((30 + 60 * i) * Math.PI) / 180;
    out.push([r * Math.cos(a), -r * Math.sin(a)]);
  }
  return out;
}
const CORNERS = hexCorners(HEX_SIZE);
/** Outward edge normals (x, z) of edge d (pointy-top, ARCHITECTURE §1). */
const EDGE_N: [number, number][] = [0, 1, 2, 3, 4, 5].map((d) => [Math.cos((d * Math.PI) / 3), -Math.sin((d * Math.PI) / 3)]);
/** KayKit top bevel: 0.05 asset units wide and deep (45°). */
const RIM_W = 0.05 * HEX_SCALE;
const RIM_FULL = 0.05 * HEX_SCALE;
/** Roads' strip sink on flat road tiles (roads/render.ts SINK = 0.05 · HEX_SCALE; roads exports no constant). */
export const ROAD_SINK = 0.05 * HEX_SCALE;
/** Tongue-ramp embankment width (m) and lattice subdivision. */
const EMB_W = 6.5;
const EMB_N = 8;
const EMB_FADE = 3;

const worldToHexQ = (x: number, z: number) => worldToHex(x, z).q;
const worldToHexR = (x: number, z: number) => worldToHex(x, z).r;

/** Collects flat grass tops (welded tops + rim bevels + hex_grass side walls) and ramp tops of one chunk. */
class TopMeshBuilder {
  pos: number[] = [];
  nor: number[] = [];
  uv: number[] = [];
  add(g: THREE.BufferGeometry, x: number, y: number, z: number, shift?: number[][] | null, corner?: Int8Array | null): void {
    const P = g.attributes.position, N = g.attributes.normal, U = g.attributes.uv;
    for (let i = 0; i < P.count; i++) {
      const s = shift && corner && corner[i] >= 0 ? shift[corner[i]] : null;
      this.pos.push(P.getX(i) + x + (s ? s[0] : 0), P.getY(i) + y, P.getZ(i) + z + (s ? s[1] : 0));
      this.nor.push(N.getX(i), N.getY(i), N.getZ(i));
      this.uv.push(U.getX(i), U.getY(i));
    }
  }
  /** Raw flat-shaded triangle with the atlas grass texel (the 'dirt' look turns vertical faces into dirt bands). */
  tri(a: number[], b: number[], c: number[], uv: readonly number[] = [0.09, 0.575], upBias = 0): void {
    const ux = b[0] - a[0], uy = b[1] - a[1], uz = b[2] - a[2];
    const vx = c[0] - a[0], vy = c[1] - a[1], vz = c[2] - a[2];
    let nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
    let l = Math.hypot(nx, ny, nz) || 1;
    nx /= l; ny /= l; nz /= l;
    if (upBias > 0) {
      // shade (not shape) toward straight up: tilted planes no longer read as lighter/darker hex patches from the air
      nx *= 1 - upBias; nz *= 1 - upBias; ny = ny * (1 - upBias) + upBias;
      l = Math.hypot(nx, ny, nz) || 1;
      nx /= l; ny /= l; nz /= l;
    }
    this.pos.push(...a, ...b, ...c);
    for (let i = 0; i < 3; i++) { this.nor.push(nx, ny, nz); this.uv.push(uv[0], uv[1]); }
  }
  build(material: THREE.Material, forestAt?: (x: number, z: number) => number): THREE.Mesh | null {
    if (!this.pos.length) return null;
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(this.pos, 3));
    g.setAttribute('normal', new THREE.Float32BufferAttribute(this.nor, 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(this.uv, 2));
    if (forestAt) {
      // smooth forest-floor shade (nature's final cell.forest, interpolated in world space → no per-cell patches)
      const n = this.pos.length / 3;
      const f = new Float32Array(n);
      const memo = new Map<number, number>();
      let any = false;
      for (let i = 0; i < n; i++) {
        if (this.nor[i * 3 + 1] < 0.5) continue;
        const x = this.pos[i * 3], z = this.pos[i * 3 + 2];
        const k = Math.round(x * 8) * 1000003 + Math.round(z * 8);
        let v = memo.get(k);
        if (v === undefined) memo.set(k, (v = forestAt(x, z)));
        f[i] = v;
        if (v > 0) any = true;
      }
      if (any) g.setAttribute('aForest', new THREE.BufferAttribute(f, 1));
    }
    g.computeBoundingSphere();
    const m = new THREE.Mesh(g, material);
    m.name = 'terrain-tops';
    m.castShadow = m.receiveShadow = true;
    m.matrixAutoUpdate = false;
    return m;
  }
}

/** Collects shore tops of one chunk (position, flat normal, uv, shoreD). */
class ShoreMeshBuilder {
  pos: number[] = [];
  nor: number[] = [];
  d: number[] = [];
  tri(a: number[], b: number[], c: number[], da: number, db: number, dc: number): void {
    const ux = b[0] - a[0], uy = b[1] - a[1], uz = b[2] - a[2];
    const vx = c[0] - a[0], vy = c[1] - a[1], vz = c[2] - a[2];
    let nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
    let l = Math.hypot(nx, ny, nz) || 1;
    nx /= l; ny /= l; nz /= l;
    if (ny > 0.5) {
      // beach facets: shade toward straight up so the lattice triangles don't read as a checker pattern
      nx *= 0.25; nz *= 0.25; ny = ny * 0.25 + 0.75;
      l = Math.hypot(nx, ny, nz);
      nx /= l; ny /= l; nz /= l;
    }
    this.pos.push(...a, ...b, ...c);
    for (let i = 0; i < 3; i++) this.nor.push(nx, ny, nz);
    this.d.push(da, db, dc);
  }
  build(material: THREE.Material): THREE.Mesh | null {
    if (!this.pos.length) return null;
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(this.pos, 3));
    g.setAttribute('normal', new THREE.Float32BufferAttribute(this.nor, 3));
    const uv = new Float32Array((this.pos.length / 3) * 2);
    for (let i = 0; i < uv.length; i += 2) { uv[i] = 0.09; uv[i + 1] = 0.575; }
    g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
    g.setAttribute('shoreD', new THREE.Float32BufferAttribute(this.d, 1));
    g.computeBoundingSphere();
    const m = new THREE.Mesh(g, material);
    m.name = 'terrain-shore';
    m.castShadow = m.receiveShadow = true;
    m.matrixAutoUpdate = false;
    return m;
  }
}

export class TerrainBuilder {
  deco = new Map<string, DecoShape>();
  stats = { chunks: 0, ms: 0, maxMs: 0, tiles: 0, colliders: 0 };
  private mats: Partial<Record<TerrainLook, THREE.Material>> = {};

  /** `?flattops=0` (or `?plainmat`): plain softened KayKit hex_grass tiles instead of welded tops (A/B, kill switch). */
  private legacyTops: boolean;
  constructor(private ctx: CoreContext, private gen: TerrainGen, private water: WaterMaterial) {
    this.legacyTops = ctx.params.has('plainmat') || ctx.params.get('flattops') === '0';
  }

  /** Pristine hex_grass geometry (metres, part matrix baked) captured before bevel softening. */
  private grassOrig: THREE.BufferGeometry | null = null;
  /** hex_grass side walls only (everything below the top bevel), metres. */
  private sideGeom: THREE.BufferGeometry | null = null;
  /** Atlas texels of hex_grass: flat top and KayKit bevel ring. */
  private uvTop: [number, number] = [0.083, 0.576];
  private uvBevel: [number, number] = [0.067, 0.594];

  /** Split hex_grass into its side walls (kept as geometry) and the texels of its top / bevel ring. */
  private prepareFlatTop(): void {
    const g = this.grassOrig;
    if (!g) return;
    const P = g.attributes.position, N = g.attributes.normal, U = g.attributes.uv;
    const S = HEX_SCALE;
    const pos: number[] = [], nor: number[] = [], uv: number[] = [];
    let tu = 0, tv = 0, nt = 0, bu = 0, bv = 0, nb = 0;
    const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3();
    for (let t = 0; t + 2 < P.count; t += 3) {
      a.fromBufferAttribute(P, t); b.fromBufferAttribute(P, t + 1); c.fromBufferAttribute(P, t + 2);
      const n = b.clone().sub(a).cross(c.clone().sub(a)).normalize();
      const maxY = Math.max(a.y, b.y, c.y);
      if (maxY > -0.049 * S) {
        // top or bevel ring
        for (let k = 0; k < 3; k++) {
          if (n.y > 0.99) { tu += U.getX(t + k); tv += U.getY(t + k); nt++; }
          else if (n.y > 0.4) { bu += U.getX(t + k); bv += U.getY(t + k); nb++; }
        }
        continue;
      }
      if (Math.abs(n.y) > 0.5) continue; // bottom face (never visible)
      for (let k = 0; k < 3; k++) {
        pos.push(P.getX(t + k), P.getY(t + k), P.getZ(t + k));
        nor.push(N.getX(t + k), N.getY(t + k), N.getZ(t + k));
        uv.push(U.getX(t + k), U.getY(t + k));
      }
    }
    if (nt) this.uvTop = [tu / nt, tv / nt];
    if (nb) this.uvBevel = [bu / nb, bv / nb];
    if (!pos.length) return;
    const sg = new THREE.BufferGeometry();
    sg.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    sg.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
    sg.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    this.sideGeom = sg;
    const sc = new Int8Array(pos.length / 3).fill(-1);
    for (let i = 0; i < sc.length; i++) {
      const vx = pos[i * 3], vz = pos[i * 3 + 2];
      for (let k = 0; k < 6; k++) if (Math.hypot(vx - CORNERS[k][0], vz - CORNERS[k][1]) < 0.05 * S) sc[i] = k;
    }
    this.sideCorner = sc;
  }

  /**
   * Rim depth per edge of a flat grass top (metres): the KayKit bevel where the neighbour is a lower flat cell (cliff /
   * terrace rim); 0 = welded (same-level grass, same-level road/river tiles — they weld their grass edges since the
   * roads integration — shore, ramp, higher ground): the top runs flat to the edge, no
   * seam at all. The class of an edge only depends on the two cells' levels and the third cell's kind, so all cells
   * sharing a corner agree.
   */
  private edgeDepths(c: Readonly<CellData>, get: (q: number, r: number) => Readonly<CellData>): number[] {
    const out = [0, 0, 0, 0, 0, 0];
    for (let d = 0; d < 6; d++) {
      const n = get(c.q + DIRS[d][0], c.r + DIRS[d][1]);
      // any lower land neighbour (flat, ramp, road, shore): the KayKit side wall starts 0.375 m below the top, so
      // without the rim bevel a lower neighbour leaves a see-through slit (void at ramp/road edges, user 2026-10-07)
      if (n.water || n.level >= c.level) continue;
      if (!n.slope) out[d] = RIM_FULL;
      else if ((n.slope.dir + 3) % 6 !== d || n.level + n.slope.steps < c.level) out[d] = -1; // ramp side/foot: vertical skirt
      // (a ramp whose HIGH edge meets this cell at our level welds: no rim, no skirt)
      // (integrator 2026-10-06) same-level road/river tiles now weld their grass edges too → no rim here
    }
    return out;
  }

  /**
   * Flat grass top welded to its same-level neighbours: one flat polygon whose rim edges are inset by the KayKit bevel
   * width, plus a 45° bevel strip on each rim edge (KayKit rim texel), plus hex_grass' side walls. Same-level edges
   * carry no geometry at all, so adjacent tops form one continuous, perfectly flat meadow (same normal, same texel).
   */
  private flatTop(tm: TopMeshBuilder, x: number, y0: number, z: number, dep: number[], shift: number[][] | null = null): void {
    const A = HEX_SIZE * (Math.sqrt(3) / 2);
    const V: number[][] = [], K: [number, number][] = [];
    for (let i = 0; i < 6; i++) {
      const j = (i + 1) % 6;
      const ni = EDGE_N[i], nj = EDGE_N[j];
      const ai = A - (dep[i] > 0 ? RIM_W : 0), aj = A - (dep[j] > 0 ? RIM_W : 0);
      const det = ni[0] * nj[1] - ni[1] * nj[0];
      const s = shift ? shift[i] : [0, 0];
      V.push([x + (ai * nj[1] - ni[1] * aj) / det + s[0], y0, z + (ni[0] * aj - ai * nj[0]) / det + s[1]]);
      K.push([x + CORNERS[i][0] + s[0], z + CORNERS[i][1] + s[1]]);
    }
    const C = [x, y0, z];
    for (let i = 0; i < 6; i++) tm.tri(C, V[i], V[(i + 1) % 6], this.uvTop);
    for (let d = 0; d < 6; d++) {
      if (!dep[d]) continue;
      const s = (d + 5) % 6; // edge d runs from corner d-1 to corner d
      if (dep[d] < 0) {
        // lower ramp neighbour: vertical skirt down past the KayKit side wall's top (no inset → no groove)
        const yb = y0 - RIM_FULL - 0.05;
        tm.tri([K[d][0], y0, K[d][1]], [K[s][0], y0, K[s][1]], [K[s][0], yb, K[s][1]]);
        tm.tri([K[d][0], y0, K[d][1]], [K[s][0], yb, K[s][1]], [K[d][0], yb, K[d][1]]);
        continue;
      }
      const K0 = [K[s][0], y0 - dep[d], K[s][1]], K1 = [K[d][0], y0 - dep[d], K[d][1]];
      // rim bevel: top grass texel + normal biased toward up → from mid/far range the terrace rim no longer draws a
      // light hex outline (whole-game critic r2 #6); up close the 45° chamfer still catches a soft highlight
      tm.tri(V[s], K0, K1, this.uvTop, 0.6);
      tm.tri(V[s], K1, V[d], this.uvTop, 0.6);
    }
    if (this.sideGeom) tm.add(this.sideGeom, x, y0, z, shift, this.sideCorner);
  }

  /** Corner index (0..5) of every side-wall vertex (all hex_grass wall vertices sit on hex corners), −1 otherwise. */
  private sideCorner: Int8Array | null = null;

  /**
   * Softer terrace silhouettes: where exactly two levels meet at a hex corner (one cell differs from the other two),
   * the shared corner is pulled ≈0.55 m toward the odd cell (convex terrace corners get blunter, concave notches
   * shallower → the zig-zag amplitude drops by ~25 %), plus ±0.2 m world-space jitter. Computed from the corner's three
   * cells only, so every cell sharing the corner moves it identically (watertight). Only for corners whose three cells
   * are all flat grass tops (no road/river/shore/ramp/water) with a one-level drop (deeper walls show KayKit columns
   * that are not moved). Colliders stay hex prisms (≤ 0.75 m visual deviation at cliff corners).
   */
  private cornerShift(q: number, r: number, get: (q: number, r: number) => Readonly<CellData>): number[][] | null {
    if (this.ctx.params.get('soften') === '0') return null;
    const c = get(q, r);
    const ctr = hexToWorld(q, r);
    const out: number[][] = [];
    let any = false;
    const flat = (n: Readonly<CellData>) => !n.water && !n.slope && !n.coastMask && !n.roadMask && !n.riverMask && !this.embRamps(n, get).length;
    if (!flat(c)) return null;
    for (let i = 0; i < 6; i++) {
      const a = get(q + DIRS[i][0], r + DIRS[i][1]), b = get(q + DIRS[(i + 1) % 6][0], r + DIRS[(i + 1) % 6][1]);
      const cells = [c, a, b];
      let s = [0, 0];
      if (cells.every(flat)) {
        const lv = cells.map((n) => n.level);
        const mx = Math.max(...lv), mn = Math.min(...lv);
        if (mx - mn === 1 && (lv[0] === lv[1] || lv[0] === lv[2] || lv[1] === lv[2]) && new Set(lv).size === 2) {
          const odd = cells.find((n, k) => lv.filter((v) => v === lv[k]).length === 1)!;
          const op = hexToWorld(odd.q, odd.r);
          const kx = ctr.x + CORNERS[i][0], kz = ctr.z + CORNERS[i][1];
          const dx = op.x - kx, dz = op.z - kz, l = Math.hypot(dx, dz) || 1;
          const jx = 0.2 * Math.sin(kx * 0.37 + kz * 0.11), jz = 0.2 * Math.sin(kz * 0.31 - kx * 0.17);
          s = [(dx / l) * 0.55 + jx, (dz / l) * 0.55 + jz];
          any = true;
        }
      }
      out.push(s);
    }
    return any ? out : null;
  }

  prepare(decoIds: string[] = []): void {
    const ga = this.ctx.assets.get(T_GRASS);
    if (ga && ga.parts.length === 1 && !ga.parts[0].geometry.index && !(ga as any).__softened) {
      this.grassOrig = ga.parts[0].geometry.clone().applyMatrix4(ga.parts[0].matrix);
      this.prepareFlatTop();
    }
    for (const id of [T_GRASS, T_BOTTOM]) softenBevel(this.ctx.assets.get(id));
    softenBevel(this.ctx.assets.get(T_SLOPE_LOW), undefined, rampProfile(0.5));
    softenBevel(this.ctx.assets.get(T_SLOPE_HIGH), undefined, rampProfile(1));
    for (const id of decoIds) this.decoShape(id);
  }

  private mat(look: TerrainLook): THREE.Material | undefined {
    let m = this.mats[look];
    if (!m) {
      const base = this.ctx.assets.get(T_GRASS)?.parts[0]?.material;
      if (!base) return undefined;
      m = this.mats[look] = makeTerrainMaterial(base, look);
    }
    return m;
  }

  /** Reduced convex-hull point set of a decoration asset (local, metres). */
  decoShape(id: string): DecoShape | null {
    let s = this.deco.get(id);
    if (s) return s;
    const a = this.ctx.assets.get(id);
    if (!a) return null;
    const pts: THREE.Vector3[] = [];
    for (const p of a.parts) {
      const P = p.geometry.attributes.position;
      for (let i = 0; i < P.count; i++) pts.push(new THREE.Vector3().fromBufferAttribute(P, i).applyMatrix4(p.matrix));
    }
    const hull = new ConvexHull().setFromPoints(pts);
    const verts = new Set<THREE.Vector3>();
    for (const f of hull.faces) {
      let e = f.edge;
      do {
        verts.add(e.head().point);
        e = e.next;
      } while (e !== f.edge);
    }
    const arr = new Float32Array(verts.size * 3);
    let i = 0;
    for (const v of verts) { arr[i++] = v.x; arr[i++] = v.y; arr[i++] = v.z; }
    s = { points: arr };
    this.deco.set(id, s);
    return s;
  }

  // ------------------------------------------------------------------ tongue-ramp embankments
  /** A planar ramp whose flanks get embankments: terrain tongues AND road ramps (roads' request), never river cells. */
  private isTongue(c: Readonly<CellData>): boolean {
    return !!c.slope && !c.riverMask && !c.water;
  }

  /**
   * Tongue ramps adjacent to cell X whose side (edge d±1 / d±2) faces X, X on the ramp's foot level. X then carries an
   * earth embankment (EMB_W wide) that slopes from the ramp's side edge down to X's grass, instead of a vertical dirt
   * wedge (whole-game critic r2: wedges / slivers at ramps). Excluded: cells drawn or occupied by other modules.
   */
  private embRamps(X: Readonly<CellData>, get: (q: number, r: number) => Readonly<CellData>): Readonly<CellData>[] {
    if (X.water || X.slope || X.coastMask || X.roadMask || X.riverMask || X.building || X.bridge) return [];
    // cells owned by villages (houses, fields, squares) stay flat: no earth shoulder under a building
    if (X.tags.some((t) => t.startsWith('bld:') || t === 'field' || t === 'square')) return [];
    let out: Readonly<CellData>[] | null = null;
    for (let d = 0; d < 6; d++) {
      const n = get(X.q + DIRS[d][0], X.r + DIRS[d][1]);
      if (!this.isTongue(n) || n.level !== X.level) continue;
      const back = (d + 3) % 6; // edge of the ramp facing X
      const rel = (back - n.slope!.dir + 6) % 6;
      if (rel === 1 || rel === 2 || rel === 4 || rel === 5) (out ??= []).push(n);
    }
    return out ?? [];
  }

  /** Embankment height (m above the ramp's foot level) at world (px,pz) for tongue ramp R. */
  private embAt(R: Readonly<CellData>, px: number, pz: number): number {
    const ctr = hexToWorld(R.q, R.r);
    const dir = R.slope!.dir, steps = R.slope!.steps;
    const lx = px - ctr.x, lz = pz - ctr.z;
    let best = 0;
    // strips along the side edges e (from corner e-1 to corner e)
    for (const k of [1, 2, 4, 5]) {
      const e = (dir + k) % 6;
      const a = CORNERS[(e + 5) % 6], c = CORNERS[e];
      const ex = c[0] - a[0], ez = c[1] - a[1];
      const len2 = ex * ex + ez * ez;
      let t = ((lx - a[0]) * ex + (lz - a[1]) * ez) / len2;
      if (t < -1e-6 || t > 1 + 1e-6) continue;
      t = Math.min(1, Math.max(0, t));
      const n = EDGE_N[e];
      let s = (lx - a[0]) * n[0] + (lz - a[1]) * n[1];
      if (s < -1e-3 || s > EMB_W) continue; // tolerance: lattice vertices lie exactly on the shared edge
      s = Math.max(0, s);
      const hA = this.planeH(a[0], a[1], dir, steps), hB = this.planeH(c[0], c[1], dir, steps);
      best = Math.max(best, (hA + (hB - hA) * t) * (1 - s / EMB_W));
    }
    // round shoulders (cones) at the two high corners and the two side corners
    for (const ci of [dir, (dir + 5) % 6, (dir + 1) % 6, (dir + 4) % 6]) {
      const k = CORNERS[ci];
      const dist = Math.hypot(lx - k[0], lz - k[1]);
      if (dist >= EMB_W) continue;
      best = Math.max(best, this.planeH(k[0], k[1], dir, steps) * (1 - dist / EMB_W));
    }
    return best;
  }

  /**
   * Embankment height of cell X at world (px,pz): max over its ramps R of embAt(R)·falloff, where the falloff (EMB_FADE
   * m) runs to 0 at every "free" edge of X — a same-level neighbour that is neither R nor embanked from R (flat grass,
   * road, river …). So the shoulder never stands proud of a neighbour's surface (no raised hex outline, nothing over a
   * road or river tile). The rule only depends on the cells around each edge → neighbours agree on shared edges.
   */
  private embHeight(X: Readonly<CellData>, rs: Readonly<CellData>[], px: number, pz: number, get: (q: number, r: number) => Readonly<CellData>): number {
    let h = 0;
    const ctr = hexToWorld(X.q, X.r);
    const lx = px - ctr.x, lz = pz - ctr.z;
    for (const R of rs) {
      const e0 = this.embAt(R, px, pz);
      if (e0 <= 0) continue;
      let f = 1;
      // edge of X shared with R: the embankment must reach R's plane exactly there (no crack), so the free-edge fade
      // is overridden close to it
      let dR = Infinity;
      for (let d = 0; d < 6; d++) {
        if (X.q + DIRS[d][0] !== R.q || X.r + DIRS[d][1] !== R.r) continue;
        const a = CORNERS[(d + 5) % 6], c = CORNERS[d];
        const ex = c[0] - a[0], ez = c[1] - a[1];
        const t = Math.max(0, Math.min(1, ((lx - a[0]) * ex + (lz - a[1]) * ez) / (ex * ex + ez * ez)));
        dR = Math.hypot(lx - a[0] - t * ex, lz - a[1] - t * ez);
      }
      for (let d = 0; d < 6 && f > 0; d++) {
        const Y = get(X.q + DIRS[d][0], X.r + DIRS[d][1]);
        if (Y === R || (Y.q === R.q && Y.r === R.r)) continue;
        if (Y.level !== X.level || Y.water) continue; // walls / skirts handle level changes
        if (this.embRamps(Y, get).some((o) => o.q === R.q && o.r === R.r)) continue;
        // distance from p to edge d of X (segment from corner d-1 to corner d)
        const a = CORNERS[(d + 5) % 6], c = CORNERS[d];
        const ex = c[0] - a[0], ez = c[1] - a[1];
        const t = Math.max(0, Math.min(1, ((lx - a[0]) * ex + (lz - a[1]) * ez) / (ex * ex + ez * ez)));
        const dist = Math.hypot(lx - a[0] - t * ex, lz - a[1] - t * ez);
        f = Math.min(f, Math.min(1, dist / EMB_FADE));
      }
      const keep = Math.max(0, 1 - dR / EMB_FADE);
      const ff = Math.max(f * f * (3 - 2 * f), keep * keep * (3 - 2 * keep));
      h = Math.max(h, e0 * ff);
    }
    return h;
  }

  /** Embankment cell top: lattice heightfield (flat grass where 0) + skirts; trimesh collider. */
  private embTop(tm: TopMeshBuilder, out: ChunkBuilder, R: typeof RAPIER, X: Readonly<CellData>, x: number, y0: number, z: number, rs: Readonly<CellData>[], get: (q: number, r: number) => Readonly<CellData>): void {
    const memo = new Map<number, number[]>();
    const V = (lx: number, lz: number) => {
      const k = Math.round(lx * 64) * 100003 + Math.round(lz * 64);
      let v = memo.get(k);
      if (!v) memo.set(k, (v = [x + lx, y0 + this.embHeight(X, rs, x + lx, z + lz, get), z + lz]));
      return v;
    };
    const verts: number[] = [];
    hexLattice(EMB_N, (ax, az, bx, bz, cx, cz) => {
      const A = V(ax, az), B = V(bx, bz), C = V(cx, cz);
      tm.tri(A, B, C, this.uvTop, 0.55);
      verts.push(...A, ...B, ...C);
    });
    const yb = y0 - 0.5;
    for (let i = 0; i < 6; i++) {
      const [ax, az] = CORNERS[i], [bx, bz] = CORNERS[(i + 1) % 6];
      for (let k = 0; k < EMB_N; k++) {
        const P0 = V(ax + ((bx - ax) * k) / EMB_N, az + ((bz - az) * k) / EMB_N), P1 = V(ax + ((bx - ax) * (k + 1)) / EMB_N, az + ((bz - az) * (k + 1)) / EMB_N);
        tm.tri(P1, P0, [P0[0], yb, P0[2]]);
        tm.tri(P1, [P0[0], yb, P0[2]], [P1[0], yb, P1[2]]);
        // and its back face: where the neighbour is HIGHER, the shoulder can stand above that cell's rim bevel and the
        // skirt is seen from behind (FrontSide) → void slit (user report 2026-10-07). Two-sided closes it.
        if (P0[1] > y0 + 0.02 || P1[1] > y0 + 0.02) {
          tm.tri(P0, P1, [P0[0], yb, P0[2]]);
          tm.tri([P0[0], yb, P0[2]], P1, [P1[0], yb, P1[2]]);
        }
        // same vertical skirt in physics wherever the edge stands above the cell's level: without it the top sheet
        // overhangs the neighbour (head catch under a 1.6 m thin edge, seed 97 near (−150, −17))
        if (P0[1] > y0 + 0.02 || P1[1] > y0 + 0.02) {
          verts.push(...P1, ...P0, P0[0], yb, P0[2]);
          verts.push(...P1, P0[0], yb, P0[2], P1[0], yb, P1[2]);
        }
      }
    }
    const tmc = R.ColliderDesc.trimesh(new Float32Array(verts), Uint32Array.from({ length: verts.length / 3 }, (_, i) => i));
    if (tmc) {
      tmc.setCollisionGroups(WORLD_GROUPS);
      out.addCollider(tmc);
      this.stats.colliders++;
    }
  }

  // ------------------------------------------------------------------ height
  /** Exact ground height: tile surface, KayKit ramp profile, procedural shore lattice, water surface on water cells. */
  heightAt(x: number, z: number, world = this.ctx.world): number {
    const a = worldToAxial(x, z);
    const h = hexRound(a.q, a.r);
    const c = world.cell(h.q, h.r);
    const top = c.level * LEVEL_H;
    if (c.water) return top - WATER_DROP;
    if (c.slope) {
      const ctr = hexToWorld(h.q, h.r);
      const v = edgeVector(c.slope.dir);
      const t = ((x - ctr.x) * v.x + (z - ctr.z) * v.z) / HEX_SCALE;
      return top + ((Math.max(-1, Math.min(1, t)) + 1) / 2) * c.slope.steps * LEVEL_H; // planar ramp (api.rampPlaneHeight)
    }
    if (c.coastMask && !c.roadMask && !c.riverMask) {
      const ctr = hexToWorld(h.q, h.r);
      const wc = this.waterNear(h.q, h.r);
      return top + latticeHeight(SHORE_N, x - ctr.x, z - ctr.z, (lx, lz) => shoreSurface(lx, lz, shoreD(ctr.x + lx, ctr.z + lz, wc)));
    }
    const rs = this.embRamps(c, (q, r) => world.cell(q, r));
    if (rs.length) {
      const ctr = hexToWorld(h.q, h.r);
      const g = (q: number, r: number) => world.cell(q, r);
      return top + latticeHeight(EMB_N, x - ctr.x, z - ctr.z, (lx, lz) => this.embHeight(c, rs, ctr.x + lx, ctr.z + lz, g));
    }
    return top;
  }

  // ------------------------------------------------------------------ chunk
  build(chunk: ChunkInfo, out: ChunkBuilder): void {
    const t0 = performance.now();
    const world = this.ctx.world;
    const R = this.ctx.rapier;
    const wm = new WaterMeshBuilder();
    const sm = new ShoreMeshBuilder();
    const tm = new TopMeshBuilder();
    const get = (q: number, r: number) => world.cell(q, r);
    const WL = waterlineD(WATER_DROP);

    for (const { q, r } of chunk.cells) {
      const c = get(q, r);
      const p = hexToWorld(q, r);
      const y0 = c.level * LEVEL_H;

      // lowest visible surface among neighbours (columns must reach it) and the largest drop (dirt look)
      let low = y0;
      let drop = 0;
      for (let d = 0; d < 6; d++) {
        const n = get(q + DIRS[d][0], r + DIRS[d][1]);
        low = Math.min(low, n.level * LEVEL_H - (n.water ? WATER_DROP : 0));
        if (!n.water) drop = Math.max(drop, c.level - n.level);
      }

      if (c.water) {
        const lands = this.landCentres(q, r);
        wm.hexSurface(p.x, y0 - WATER_DROP, p.z, lands.length ? 4 : 1, (wx, wz) => {
          // same smooth-min as the shore field (shore.ts shoreD) → shallow band follows the curved beach
          let dl = Infinity;
          for (const L of lands) {
            if (Math.hypot(wx - L.x, wz - L.z) - HEX_SIZE > dl + SHORE_SMOOTH) continue;
            const d = distToHex(wx, wz, L.x, L.z);
            if (dl === Infinity) { dl = d; continue; }
            const h = Math.max(SHORE_SMOOTH - Math.abs(dl - d), 0) / SHORE_SMOOTH;
            dl = Math.min(dl, d) - h * h * SHORE_SMOOTH * 0.25;
          }
          return Math.max(0, dl) + WL;
        });
        wm.hexFloor(p.x, y0 - BED_DEPTH, p.z);
        this.lakeColliders(out, R, p.x, p.z, y0);
        continue;
      }

      const drawTop = !c.roadMask && !c.riverMask;
      // one tile material for all cliffs (draw calls): KayKit-style dirt sides with a grass lip per step
      const look: TerrainLook = 'dirt';
      void drop;
      let tileBottom = y0 - TILE_THICKNESS;
      let emb: Readonly<CellData>[] = [];
      if (c.coastMask && drawTop) {
        // procedural beach top + skirt, KayKit column below
        const wc = this.waterNear(q, r);
        this.shoreTop(sm, out, R, p.x, y0, p.z, wc);
        wm.hexSurface(p.x, y0 - WATER_DROP, p.z, 4, (wx, wz) => Math.max(0, WL - shoreD(wx, wz, wc)));
        wm.hexFloor(p.x, y0 - BED_DEPTH, p.z);
        tileBottom = y0 - SHORE_SKIRT + 0.2 - TILE_THICKNESS;
        this.add(out, T_BOTTOM, p.x, y0 - SHORE_SKIRT + 0.2, p.z, 0, look);
        this.prism(out, R, p.x, p.z, Math.min(low, tileBottom) - 1, y0 - SHORE_SKIRT + 0.2);
      } else if (c.slope) {
        if (drawTop) {
          // planar ramp top + dirt skirt down to the foot level; KayKit columns start just below
          this.rampTop(tm, p.x, p.z, y0, c.slope.dir, c.slope.steps);
          tileBottom = y0 - 0.05;
        }
        // road ramps: roads' ramp-tile trimesh (strip sunk by ROAD_SINK) is the walkable top → hull one sink lower
        const roadRamp = c.roadMask !== 0 && !c.bridge && !c.water;
        this.ramp(out, R, p.x, p.z, roadRamp ? y0 - ROAD_SINK : y0, c.slope.dir, c.slope.steps, Math.min(low, tileBottom) - 1);
      } else if (drawTop && this.sideGeom && !this.legacyTops && (emb = this.embRamps(c, get)).length) {
        this.embTop(tm, out, R, c, p.x, y0, p.z, emb, get);
        tm.add(this.sideGeom, p.x, y0, p.z);
        this.prism(out, R, p.x, p.z, Math.min(low, tileBottom) - 1, y0);
      } else {
        if (drawTop && this.sideGeom && !this.legacyTops) this.flatTop(tm, p.x, y0, p.z, this.edgeDepths(c, get), this.cornerShift(q, r, get));
        else if (drawTop) this.add(out, T_GRASS, p.x, y0, p.z, 0, look);
        // flat road cells: roads' tiles sink the strip by ROAD_SINK and roads adds a WORLD trimesh on the rendered road
        // surface; the prism top drops by the same amount so that trimesh is the walkable top (no 0.375 m float)
        const roadFlat = c.roadMask !== 0 && !c.slope && !c.bridge && !c.water;
        this.prism(out, R, p.x, p.z, Math.min(low, tileBottom) - 1, roadFlat ? y0 - ROAD_SINK : y0);
      }

      // ---- column: stack bottoms until the lowest neighbour surface (minus its bevel) is covered
      let guard = 0;
      while (tileBottom > low - BEVEL && guard++ < 10) {
        this.add(out, T_BOTTOM, p.x, tileBottom, p.z, 0, look);
        tileBottom -= TILE_THICKNESS;
      }

      this.decoration(out, R, c, p.x, y0, p.z);
    }

    const wmesh = wm.build(this.water.material);
    if (wmesh) out.addObject(wmesh);
    const tmat = this.mat('dirt');
    const tmesh = tmat ? tm.build(tmat, this.ctx.params.get('forestshade') === '0' ? undefined : (x, z) => this.forestAt(x, z)) : null;
    if (tmesh) out.addObject(tmesh);
    const smat = this.mat('shore');
    const smesh = smat ? sm.build(smat) : null;
    if (smesh) out.addObject(smesh);
    const ms = performance.now() - t0;
    this.stats.chunks++;
    this.stats.ms += ms;
    this.stats.maxMs = Math.max(this.stats.maxMs, ms);
  }

  private wnMemo = new Map<string, { x: number; z: number }[]>();
  /**
   * Centres of ALL water cells within 2 rings: the shore distance field D is then one world-space function, so
   * neighbouring shore cells agree exactly along their shared edges (no micro-steps, wedges or folded sand).
   */
  private waterNear(q: number, r: number): { x: number; z: number }[] {
    const k = q + ',' + r;
    let v = this.wnMemo.get(k);
    if (v) return v;
    v = [];
    const world = this.ctx.world;
    for (let dr = -2; dr <= 2; dr++)
      for (let dq = Math.max(-2, -dr - 2); dq <= Math.min(2, -dr + 2); dq++)
        if (world.cell(q + dq, r + dr).water) v.push(hexToWorld(q + dq, r + dr));
    if (this.wnMemo.size > 50000) this.wnMemo.clear();
    this.wnMemo.set(k, v);
    return v;
  }

  /** Smooth forest density at world xz: distance-weighted blend of the containing cell and its 6 neighbours. */
  private forestAt(x: number, z: number): number {
    const h = worldToHex(x, z);
    const world = this.ctx.world;
    let sw = 0, sf = 0;
    for (let d = -1; d < 6; d++) {
      const q = d < 0 ? h.q : h.q + DIRS[d][0], r = d < 0 ? h.r : h.r + DIRS[d][1];
      const p = hexToWorld(q, r);
      const w = Math.max(0, 1 - Math.hypot(x - p.x, z - p.z) / (HEX_SIZE * 1.9));
      if (!w) continue;
      const c = world.cell(q, r);
      sw += w;
      sf += w * (c.water || c.roadMask || c.village ? 0 : c.forest);
    }
    return sw ? Math.min(1, sf / sw) : 0;
  }

  /** Centres of land cells within 3 rings (for the shallow-water band). */
  private landCentres(q: number, r: number): { x: number; z: number }[] {
    const out: { x: number; z: number }[] = [];
    const world = this.ctx.world;
    for (let dr = -2; dr <= 2; dr++)
      for (let dq = Math.max(-2, -dr - 2); dq <= Math.min(2, -dr + 2); dq++) {
        if (!world.cell(q + dq, r + dr).water) out.push(hexToWorld(q + dq, r + dr));
      }
    return out;
  }

  /** Shore cell top: lattice heightfield (grass → lip → sand → under water) plus vertical skirt; trimesh collider. */
  private shoreTop(sm: ShoreMeshBuilder, out: ChunkBuilder, R: typeof RAPIER, x: number, y0: number, z: number, wc: { x: number; z: number }[]): void {
    const verts: number[] = [];
    const memo = new Map<number, { p: number[]; D: number }>();
    const V = (lx: number, lz: number) => {
      const k = Math.round(lx * 64) * 100003 + Math.round(lz * 64);
      let v = memo.get(k);
      if (!v) {
        const D = shoreD(x + lx, z + lz, wc);
        memo.set(k, (v = { p: [x + lx, y0 + shoreSurface(lx, lz, D), z + lz], D }));
      }
      return v;
    };
    // player-only wading limit: triangles deeper than WADE under the water surface are "wet"; every wet triangle edge
    // whose outside (sampled 0.3 m beyond the edge midpoint) is dry ground gets a vertical player-only wall. Edges
    // facing a water cell need none (its prism blocks). Walls stay on the lattice → follow the curved waterline.
    const WADE = 0.45;
    const wetAt = (wx: number, wz: number) => shoreProfile(shoreD(wx, wz, wc)) < -WATER_DROP - WADE;
    const wall: number[] = [];
    const yTop = y0 + BLOCK_ABOVE, yBot = y0 - BED_DEPTH;
    hexLattice(SHORE_N, (ax, az, bx, bz, cx, cz) => {
      const A = V(ax, az), B = V(bx, bz), C = V(cx, cz);
      sm.tri(A.p, B.p, C.p, A.D, B.D, C.D);
      verts.push(...A.p, ...B.p, ...C.p);
      const gx = x + (ax + bx + cx) / 3, gz = z + (az + bz + cz) / 3;
      if (!wetAt(gx, gz)) return;
      const P = [A.p, B.p, C.p];
      for (let e = 0; e < 3; e++) {
        const p0 = P[e], p1 = P[(e + 1) % 3];
        const mx = (p0[0] + p1[0]) / 2, mz = (p0[2] + p1[2]) / 2;
        let ox = mx - gx, oz = mz - gz;
        const l = Math.hypot(ox, oz) || 1;
        ox = mx + (ox / l) * 0.3; oz = mz + (oz / l) * 0.3;
        const oc = this.ctx.world.cell(worldToHexQ(ox, oz), worldToHexR(ox, oz));
        if (oc.water || wetAt(ox, oz)) continue;
        wall.push(p0[0], yBot, p0[2], p1[0], yBot, p1[2], p1[0], yTop, p1[2], p0[0], yBot, p0[2], p1[0], yTop, p1[2], p0[0], yTop, p0[2]);
      }
    });
    if (wall.length) {
      const wd = R.ColliderDesc.trimesh(new Float32Array(wall), Uint32Array.from({ length: wall.length / 3 }, (_, i) => i));
      if (wd) {
        wd.setCollisionGroups(PLAYER_ONLY_GROUPS);
        out.addCollider(wd);
        this.stats.colliders++;
      }
    }
    // skirt along the 6 edges, outward facing, down to y0 - SHORE_SKIRT
    const yb = y0 - SHORE_SKIRT;
    for (let i = 0; i < 6; i++) {
      const [ax, az] = CORNERS[i], [bx, bz] = CORNERS[(i + 1) % 6];
      for (let k = 0; k < SHORE_N; k++) {
        const t0 = k / SHORE_N, t1 = (k + 1) / SHORE_N;
        const P0 = V(ax + (bx - ax) * t0, az + (bz - az) * t0), P1 = V(ax + (bx - ax) * t1, az + (bz - az) * t1);
        const B0 = [P0.p[0], yb, P0.p[2]], B1 = [P1.p[0], yb, P1.p[2]];
        // corners run CCW seen from above → outward face is (P1, P0, B0)
        sm.tri(P1.p, P0.p, B0, P1.D, P0.D, P0.D);
        sm.tri(P1.p, B0, B1, P1.D, P0.D, P1.D);
        sm.tri(P0.p, P1.p, B0, P0.D, P1.D, P0.D);
        sm.tri(B0, P1.p, B1, P0.D, P1.D, P1.D);
      }
    }
    const tm = R.ColliderDesc.trimesh(new Float32Array(verts), Uint32Array.from({ length: verts.length / 3 }, (_, i) => i));
    if (tm) {
      tm.setCollisionGroups(WORLD_GROUPS);
      out.addCollider(tm);
      this.stats.colliders++;
    }
  }

  /**
   * Water cells: solid lake bed (WORLD — nothing falls through), player-only wall up to BLOCK_ABOVE over the lake's
   * land level, camera-only sensor up to the water surface (camera never dips under water).
   */
  private lakeColliders(out: ChunkBuilder, R: typeof RAPIER, x: number, z: number, y0: number): void {
    this.prism(out, R, x, z, y0 - BED_DEPTH - 2, y0 - BED_DEPTH);
    this.prism(out, R, x, z, y0 - BED_DEPTH, y0 + BLOCK_ABOVE, PLAYER_ONLY_GROUPS);
    this.prism(out, R, x, z, y0 - BED_DEPTH, y0 - WATER_DROP, CAMERA_ONLY_GROUPS, true);
  }

  private decoration(out: ChunkBuilder, R: typeof RAPIER, c: Readonly<CellData>, x: number, y: number, z: number): void {
    if (c.roadMask || c.riverMask || c.building || c.village || c.bridge) return;
    const d = this.gen.cell(c.q, c.r).deco;
    if (!d) return;
    const rotY = (d.rot * Math.PI) / 3;
    if (!this.add(out, d.asset, x, y, z, rotY, 'deco')) return;
    const shape = this.decoShape(d.asset);
    if (!shape) return;
    const desc = R.ColliderDesc.convexHull(shape.points);
    if (!desc) return;
    _q.setFromAxisAngle(_yAxis, rotY);
    desc.setTranslation(x, y, z).setRotation({ x: _q.x, y: _q.y, z: _q.z, w: _q.w }).setCollisionGroups(WORLD_GROUPS);
    out.addCollider(desc);
    this.stats.colliders++;
  }

  /** look = null → asset's own material (decorations). */
  private add(out: ChunkBuilder, id: string, x: number, y: number, z: number, rotY: number, look: TerrainLook | null): boolean {
    _q.setFromAxisAngle(_yAxis, rotY);
    _m.compose(_p.set(x, y, z), _q, _s);
    this.stats.tiles++;
    const m = look && !this.ctx.params.has('plainmat') ? this.mat(look) : undefined;
    return out.add(id, _m, m ? { material: m } : {});
  }

  /** Hex prism collider from yb to yt. */
  prism(out: ChunkBuilder, R: typeof RAPIER, x: number, z: number, yb: number, yt: number, groups = WORLD_GROUPS, sensor = false): void {
    const pts = new Float32Array(36);
    for (let i = 0; i < 6; i++) {
      const [cx, cz] = CORNERS[i];
      pts.set([cx, yt, cz, cx, yb, cz], i * 6);
    }
    const desc = R.ColliderDesc.convexHull(pts);
    if (!desc) return;
    desc.setTranslation(x, 0, z).setCollisionGroups(groups).setSensor(sensor);
    out.addCollider(desc);
    this.stats.colliders++;
  }

  /** Ramp hull following the KayKit slope profile (flat high half, linear low half). */
  /** Plane height offset (m above y0) at a corner/point with local offset (lx,lz) for a ramp rising toward dir. */
  private planeH(lx: number, lz: number, dir: number, steps: number): number {
    const v = edgeVector(dir);
    const t = Math.max(-1, Math.min(1, (lx * v.x + lz * v.z) / HEX_SCALE));
    return ((t + 1) / 2) * steps * LEVEL_H;
  }

  /** Planar ramp top (6 triangles) + outward skirts from the plane down to just below the foot level. */
  private rampTop(tm: TopMeshBuilder, x: number, z: number, y0: number, dir: number, steps: number): void {
    const P = CORNERS.map(([cx, cz]) => [x + cx, y0 + this.planeH(cx, cz, dir, steps), z + cz]);
    const C = [x, y0 + this.planeH(0, 0, dir, steps), z];
    for (let i = 0; i < 6; i++) tm.tri(C, P[i], P[(i + 1) % 6], undefined, 0.85);
    const yb = y0 - 0.1;
    for (let i = 0; i < 6; i++) {
      const A = P[i], B = P[(i + 1) % 6];
      if (A[1] <= y0 + 0.01 && B[1] <= y0 + 0.01) continue;
      const A0 = [A[0], yb, A[2]], B0 = [B[0], yb, B[2]];
      tm.tri(B, A, A0);
      tm.tri(B, A0, B0);
      tm.tri(A, B, A0); // two-sided: never a see-through slit when a neighbour stands higher
      tm.tri(A0, B, B0);
    }
  }

  /** Planar ramp hull (same function as heightAt / api.rampPlaneHeight). */
  ramp(out: ChunkBuilder, R: typeof RAPIER, x: number, z: number, y0: number, dir: number, steps: number, yb: number): void {
    const pts = new Float32Array(36);
    for (let i = 0; i < 6; i++) {
      const [cx, cz] = CORNERS[i];
      pts.set([cx, y0 + this.planeH(cx, cz, dir, steps), cz, cx, yb, cz], i * 6);
    }
    const desc = R.ColliderDesc.convexHull(pts);
    if (!desc) return;
    desc.setTranslation(x, 0, z).setCollisionGroups(WORLD_GROUPS);
    out.addCollider(desc);
    this.stats.colliders++;
  }
}

