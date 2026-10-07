// Per-chunk rendering of village content (buildings, square, fields, stone walls) + fitted colliders.
import * as THREE from 'three';
import type { ChunkInfo, CoreContext, StaticAsset } from '../../core/types';
import type { ChunkBuilder } from '../../core/chunks';
import { edgeVector, hexToWorld } from '../../core/hex';
import { LEVEL_H, HEX_SCALE } from '../../core/units';
import { WORLD_GROUPS } from '../../core/groups';
import { hash } from '../../core/rng';
import * as look from '../terrain/look';
import { plannerOf } from './plan';
import { FADE_W0, occluderFadeMaterial } from '../../core/fade';
import { WOOD_FENCE_ID, WOOD_GATE_ID, WOOD_SCALE_Y, DIRT_ID, GATE_ID, ROAD_REF_ID, PLAZA_INNER, PLAZA_Y, GRAIN_SINK, GRAIN_SCALE_XZ, FENCE_ID, FENCE_SCALE_T, FENCE_SCALE_Y, GRAIN_ID, GRAIN_SCALE_Y } from './catalog';

// ------------------------------------------------------------------ fitted colliders
/** Box in asset-local metres: centre + half extents (axis aligned in the model frame). */
export interface LocalBox { cx: number; cy: number; cz: number; hx: number; hy: number; hz: number }

const GRID = 0.4; // m
const CAP = 2.6; // geometry above this (eaves, roofs, sails) does not shape the footprint
const SOLID = 1.25; // columns at least this high are walls

/**
 * Column heightmap of the model below CAP, interior flood-filled, merged into boxes:
 *  - wall columns (≥ SOLID) → boxes up to ~75 % of the model height (camera + player blockers)
 *  - lower columns (stairs, plinths, crates) → boxes of their own height (the character steps ≤ 0.45 m)
 */
export function fitBoxes(a: StaticAsset): LocalBox[] {
  const b = a.bounds;
  const nx = Math.max(1, Math.ceil((b.max.x - b.min.x) / GRID));
  const nz = Math.max(1, Math.ceil((b.max.z - b.min.z) / GRID));
  const H = new Float32Array(nx * nz).fill(-1);
  const v0 = new THREE.Vector3(), v1 = new THREE.Vector3(), v2 = new THREE.Vector3(), p = new THREE.Vector3();
  for (const part of a.parts) {
    const pos = part.geometry.attributes.position;
    const idx = part.geometry.index;
    const tri = idx ? idx.count / 3 : pos.count / 3;
    for (let t = 0; t < tri; t++) {
      const i0 = idx ? idx.getX(t * 3) : t * 3, i1 = idx ? idx.getX(t * 3 + 1) : t * 3 + 1, i2 = idx ? idx.getX(t * 3 + 2) : t * 3 + 2;
      v0.fromBufferAttribute(pos, i0).applyMatrix4(part.matrix);
      v1.fromBufferAttribute(pos, i1).applyMatrix4(part.matrix);
      v2.fromBufferAttribute(pos, i2).applyMatrix4(part.matrix);
      if (Math.min(v0.y, v1.y, v2.y) > CAP) continue;
      const e = Math.max(v0.distanceTo(v1), v1.distanceTo(v2), v2.distanceTo(v0));
      const n = Math.min(60, Math.max(1, Math.ceil(e / (GRID * 0.5))));
      for (let i = 0; i <= n; i++)
        for (let j = 0; j <= n - i; j++) {
          const u = i / n, w = j / n;
          p.copy(v0).multiplyScalar(1 - u - w).addScaledVector(v1, u).addScaledVector(v2, w);
          if (p.y > CAP) continue;
          const gx = Math.min(nx - 1, Math.max(0, Math.floor((p.x - b.min.x) / GRID)));
          const gz = Math.min(nz - 1, Math.max(0, Math.floor((p.z - b.min.z) / GRID)));
          const k = gz * nx + gx;
          if (p.y > H[k]) H[k] = p.y;
        }
    }
  }
  // flood fill the outside over non-wall columns; enclosed columns become walls
  const outside = new Uint8Array(nx * nz);
  const stack: number[] = [];
  for (let x = 0; x < nx; x++) for (const z of [0, nz - 1]) stack.push(z * nx + x);
  for (let z = 0; z < nz; z++) for (const x of [0, nx - 1]) stack.push(z * nx + x);
  while (stack.length) {
    const k = stack.pop()!;
    if (outside[k] || H[k] >= SOLID) continue;
    outside[k] = 1;
    const x = k % nx, z = (k / nx) | 0;
    if (x > 0) stack.push(k - 1);
    if (x < nx - 1) stack.push(k + 1);
    if (z > 0) stack.push(k - nx);
    if (z < nz - 1) stack.push(k + nx);
  }
  const top = Math.max(SOLID + 0.5, (b.max.y - Math.max(0, b.min.y)) * 0.75);
  // quantised column class: 0 none, 1..n step heights, 99 wall
  const cls = new Int16Array(nx * nz);
  for (let k = 0; k < nx * nz; k++) {
    if (!outside[k] || H[k] >= SOLID) cls[k] = 99;
    else if (H[k] > 0.15) cls[k] = Math.max(1, Math.round(H[k] / 0.15));
    else cls[k] = 0;
  }
  // greedy rectangles per class
  const done = new Uint8Array(nx * nz);
  const boxes: LocalBox[] = [];
  for (let z = 0; z < nz; z++)
    for (let x = 0; x < nx; x++) {
      const k = z * nx + x;
      const c = cls[k];
      if (!c || done[k]) continue;
      let w = 1;
      while (x + w < nx && cls[k + w] === c && !done[k + w]) w++;
      let h = 1;
      outer: while (z + h < nz) {
        for (let i = 0; i < w; i++) {
          const kk = (z + h) * nx + x + i;
          if (cls[kk] !== c || done[kk]) break outer;
        }
        h++;
      }
      for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) done[(z + j) * nx + x + i] = 1;
      const hy = (c === 99 ? top : c * 0.15) / 2;
      boxes.push({
        cx: b.min.x + (x + w / 2) * GRID, cz: b.min.z + (z + h / 2) * GRID, cy: hy,
        hx: (w * GRID) / 2, hz: (h * GRID) / 2, hy,
      });
    }
  return boxes;
}

// ------------------------------------------------------------------ chunk renderer
const UP = new THREE.Vector3(0, 1, 0);
const _q = new THREE.Quaternion();
const _v = new THREE.Vector3();

export class VillageRenderer {
  private boxes = new Map<string, LocalBox[]>();
  stats = { chunks: 0, buildings: 0, fields: 0, fences: 0, colliders: 0, ms: 0 };
  constructor(private ctx: CoreContext) {}

  private boxesOf(id: string): LocalBox[] {
    let b = this.boxes.get(id);
    if (b) return b;
    // all colour variants share geometry: fit once per type (blue) and reuse
    const canon = id.replace(/_(red|green|yellow)$/, '_blue').replace(/\/(red|green|yellow)\//, '/blue/');
    b = this.boxes.get(canon);
    if (!b) {
      const a = this.ctx.assets.get(canon) ?? this.ctx.assets.get(id);
      b = a ? fitBoxes(a) : [];
      this.boxes.set(canon, b);
    }
    this.boxes.set(id, b);
    return b;
  }

  // ---------------------------------------------------------------- occluder fade (core/fade.ts)
  // Buildings, wells and walls are merged here (per base material) with a per-vertex `aFadeAnchor` = the object's
  // bounding sphere, and drawn with core's occluderFadeMaterial → a building between camera and player fades as a whole.
  // Core's ChunkBuilder merge drops custom attributes, so these get their own merged mesh per chunk (addObject).
  private fadeItems = new Map<THREE.Material, { geometry: THREE.BufferGeometry; matrix: THREE.Matrix4; c: THREE.Vector3; r: number }[]>();
  private sphereOf = new Map<string, THREE.Sphere>();
  private out: ChunkBuilder | null = null;
  private noFade = false;
  private addFade(id: string, m: THREE.Matrix4): boolean {
    if (this.noFade) return this.out!.add(id, m); // A/B check only (?vnofade=1): the pre-fade path
    this.out?.record(id,m);
    const a = this.ctx.assets.get(id);
    if (!a) return false;
    let sp = this.sphereOf.get(id);
    if (!sp) this.sphereOf.set(id, (sp = a.bounds.getBoundingSphere(new THREE.Sphere())));
    const c = sp.center.clone().applyMatrix4(m);
    const sc = new THREE.Vector3().setFromMatrixScale(m);
    const r = sp.radius * Math.max(sc.x, sc.y, sc.z);
    for (const p of a.parts) {
      let list = this.fadeItems.get(p.material);
      if (!list) this.fadeItems.set(p.material, (list = []));
      list.push({ geometry: p.geometry, matrix: new THREE.Matrix4().multiplyMatrices(m, p.matrix), c, r });
    }
    return true;
  }
  private flushFade(out: ChunkBuilder): void {
    for (const [mat, items] of this.fadeItems) {
      const g = mergeWithAnchor(items);
      if (!g) continue;
      const mesh = new THREE.Mesh(g, occluderFadeMaterial(mat));
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.matrixAutoUpdate = false;
      mesh.name = 'villages fade';
      out.addObject(mesh);
    }
    this.fadeItems.clear();
  }

  /** debug (?vcol=1): wireframes of every collider box */
  private dbg: THREE.Matrix4[] | null = null;
  private dbgBox(hx: number, hy: number, hz: number, x: number, y: number, z: number, q: THREE.Quaternion) {
    this.dbg?.push(new THREE.Matrix4().compose(new THREE.Vector3(x, y, z), q, new THREE.Vector3(hx * 2, hy * 2, hz * 2)));
  }

  build(chunk: ChunkInfo, out: ChunkBuilder): void {
    const t0 = performance.now();
    this.dbg = this.ctx.params.has('vcol') ? [] : null;
    this.fadeItems = new Map();
    this.out = out;
    this.noFade = this.ctx.params.has('vnofade');
    const arrows = this.ctx.params.has('vdoor') ? new THREE.Group() : null;
    const world = this.ctx.world;
    const planner = plannerOf(world.seed);
    const R = this.ctx.rapier;
    let any = false;
    for (const { q, r } of chunk.cells) {
      const c = world.cell(q, r);
      if (!c.village) continue;
      any = true;
      const ctr = hexToWorld(q, r);
      const y = world.heightAt(ctr.x,ctr.z);
      const crop = c.tags.find((t) => t.startsWith('crop:'))?.slice(5) ?? 'grain';
      if (c.tags.includes('field') && crop === 'dirt') {
        // ploughed plot: the KayKit dirt plate grown to the hex (1.795 × 2.007 units on a 2 × 2.309 hex)
        const m = new THREE.Matrix4().compose(_v.set(ctr.x, y + 0.01, ctr.z), _q.setFromAxisAngle(UP, (hash(q, r, 7) % 6) * (Math.PI / 3)), new THREE.Vector3(1.1, 1, 1.1));
        if (out.add(DIRT_ID, m, { castShadow: false })) this.stats.fields++;
      } else if (c.tags.includes('field') && crop === 'grain') {
        // grain overlay grown to the full hex (the KayKit plate is 6 % smaller → V-gaps between neighbouring plots)
        const m = new THREE.Matrix4().compose(_v.set(ctr.x, y - GRAIN_SINK, ctr.z), _q.setFromAxisAngle(UP, (hash(q, r, 7) % 6) * (Math.PI / 3)), new THREE.Vector3(GRAIN_SCALE_XZ, GRAIN_SCALE_Y, GRAIN_SCALE_XZ));
        if (out.add(GRAIN_ID, m)) this.stats.fields++;
      }
      const pc = planner?.cell(q, r)?.cell;
      if (pc?.plaza) this.plaza(out, ctr.x, y, ctr.z, Number(c.tags.find((t) => t.startsWith('toward:'))?.slice(7) ?? 0));
      if (c.building && pc && pc.items.length) {
        for (const it of pc.items) {
          const x = ctr.x + it.x, z = ctr.z + it.z;
          const m = new THREE.Matrix4().compose(_v.set(x, world.heightAt(x,z), z), _q.setFromAxisAngle(UP, it.rotY), new THREE.Vector3(1, 1, 1));
          if (!this.addFade(it.asset, m)) continue;
          this.stats.buildings++;
          const rot = new THREE.Quaternion().setFromAxisAngle(UP, it.rotY);
          for (const bx of this.boxesOf(it.asset)) {
            const p = new THREE.Vector3(bx.cx, bx.cy, bx.cz).applyQuaternion(rot);
            out.addCollider(
              R.ColliderDesc.cuboid(bx.hx, bx.hy, bx.hz)
                .setTranslation(x + p.x, world.heightAt(x,z) + p.y, z + p.z)
                .setRotation({ x: rot.x, y: rot.y, z: rot.z, w: rot.w })
                .setCollisionGroups(WORLD_GROUPS),
            );
            this.stats.colliders++;
            this.dbgBox(bx.hx, bx.hy, bx.hz, x + p.x, world.heightAt(x,z) + p.y, z + p.z, rot);
          }
          if (arrows) {
            // debug: door direction = rotY + model door angle (local +Z = −90° in our convention)
            const a = it.rotY - Math.PI / 2;
            const dir = new THREE.Vector3(Math.cos(a), 0, -Math.sin(a));
            arrows.add(new THREE.ArrowHelper(dir, new THREE.Vector3(x, y + 9, z), 8, 0xff1010, 3, 2.2));
          }
        }
      }
      for (const t of c.tags) {
        if (t.startsWith('fence:')) this.fence(out, ctr.x, y, ctr.z, Number(t.slice(6)), false, crop === 'pasture');
        else if (t.startsWith('gate:')) this.fence(out, ctr.x, y, ctr.z, Number(t.slice(5)), true, crop === 'pasture');
      }
    }
    if (arrows?.children.length) out.addObject(arrows);
    this.flushFade(out);
    if (any) this.stats.chunks++;
    if (this.dbg?.length) {
      const g = new THREE.EdgesGeometry(new THREE.BoxGeometry(1, 1, 1));
      const mat = new THREE.LineBasicMaterial({ color: 0xff00ff, depthTest: false, toneMapped: false });
      const grp = new THREE.Group();
      for (const m of this.dbg) {
        const l = new THREE.LineSegments(g, mat);
        l.matrixAutoUpdate = false;
        l.matrix.copy(m);
        l.renderOrder = 10;
        grp.add(l);
      }
      out.addObject(grp);
    }
    this.stats.ms += performance.now() - t0;
  }

  // ---------------------------------------------------------------- plaza
  private plazaMat: THREE.Material | null | undefined;
  private plazaUV: [number, number] | null = null;
  /** Terrain's tile material (same tonal patches as the roads) + the atlas texel of the road surface. */
  private plazaMaterial(): THREE.Material | null {
    if (this.plazaMat !== undefined) return this.plazaMat;
    this.plazaMat = null;
    const road = this.ctx.assets.get(ROAD_REF_ID);
    if (!road) return null;
    // road/sand texel of the hexagon atlas (223,183,135 — the class assets' derive-edges uses for road & beach sand;
    // terrain's look.ts samples the same texel for its beaches)
    this.plazaUV = [0.58, 0.575];
    if (!this.plazaUV) return null;
    const base = road.parts[0].material;
    const mk = (look as unknown as Record<string, unknown>).makeTerrainMaterial as ((b: THREE.Material, l: string) => THREE.Material) | undefined;
    try {
      this.plazaMat = mk ? mk(base, 'plain') : base;
    } catch {
      this.plazaMat = base;
    }
    return this.plazaMat;
  }

  private stoneUVc: [number, number] | null | undefined;
  /** most frequent UV of the KayKit stone wall = its grey stone texel */
  private stoneUV(): [number, number] | null {
    if (this.stoneUVc !== undefined) return this.stoneUVc;
    this.stoneUVc = null;
    const a = this.ctx.assets.get(FENCE_ID);
    const hist = new Map<string, number>();
    for (const p of a?.parts ?? []) {
      const U = p.geometry.attributes.uv;
      if (!U) continue;
      for (let i = 0; i < U.count; i++) {
        const k = U.getX(i).toFixed(3) + ',' + U.getY(i).toFixed(3);
        hist.set(k, (hist.get(k) ?? 0) + 1);
      }
    }
    let best = 0;
    for (const [k, n] of hist) if (n > best) { best = n; this.stoneUVc = k.split(',').map(Number) as [number, number]; }
    return this.stoneUVc;
  }

  /**
   * Paved square on the plaza hex ONLY (never on road cells — the roads module owns the crossing surface): a sand base
   * hex plus running-bond flagstones clipped to the hex, so it is paved edge to edge. Flat, coplanar slabs (no sides,
   * no shadow casting) 2 cm above the base → flush, no shadow lines. The paving stops inside the tile's top bevel, so the
   * shared edge with the crossing tile is the tile's own rim.
   */
  private plaza(out: ChunkBuilder, x: number, y: number, z: number, _toward: number): void {
    const mat = this.plazaMaterial();
    if (!mat || !this.plazaUV) return;
    const st = this.stoneUV() ?? this.plazaUV;
    const pos: number[] = [], nor: number[] = [], uv: number[] = [], idx: number[] = [];
    const INNER = PLAZA_INNER; // m, centre → edge midpoint of the paved hex
    const hex: [number, number][] = [];
    const Rc = INNER / Math.cos(Math.PI / 6);
    for (let k = 0; k < 6; k++) {
      const a = Math.PI / 6 + (k * Math.PI) / 3; // pointy-top corners, CCW seen from above (OUR angle convention)
      hex.push([x + Math.cos(a) * Rc, z - Math.sin(a) * Rc]);
    }
    const fan = (pts: [number, number][], yy: number, t: [number, number]) => {
      if (pts.length < 3) return;
      const b = pos.length / 3;
      for (const [px, pz] of pts) { pos.push(px, yy, pz); nor.push(0, 1, 0); uv.push(t[0], t[1]); }
      // pts run with increasing OUR angle (x = cos, z = −sin) → (b, b+i, b+i+1) has a +Y normal
      for (let i = 1; i + 1 < pts.length; i++) idx.push(b, b + i, b + i + 1);
    };
    fan(hex, y + PLAZA_Y, this.plazaUV);
    // clip a convex polygon to the hex (Sutherland–Hodgman against the 6 edge half-planes)
    const clip = (poly: [number, number][]) => {
      let out = poly;
      for (let k = 0; k < 6 && out.length; k++) {
        const a = (k * Math.PI) / 3;
        const nx = Math.cos(a), nz = -Math.sin(a);
        const f = (p: [number, number]) => INNER - ((p[0] - x) * nx + (p[1] - z) * nz);
        const res: [number, number][] = [];
        for (let i = 0; i < out.length; i++) {
          const P = out[i], Q = out[(i + 1) % out.length];
          const fp = f(P), fq = f(Q);
          if (fp >= 0) res.push(P);
          if ((fp >= 0) !== (fq >= 0)) {
            const t = fp / (fp - fq);
            res.push([P[0] + (Q[0] - P[0]) * t, P[1] + (Q[1] - P[1]) * t]);
          }
        }
        out = res;
      }
      return out;
    };
    const SL = 1.55, GAP = 0.16;
    const gz0 = Math.floor((z - Rc) / SL) - 1, gz1 = Math.ceil((z + Rc) / SL) + 1;
    const gx0 = Math.floor((x - Rc) / SL) - 1, gx1 = Math.ceil((x + Rc) / SL) + 1;
    for (let j = gz0; j <= gz1; j++)
      for (let i = gx0; i <= gx1; i++) {
        const cx0 = i * SL + (j & 1) * SL * 0.5, cz0 = j * SL;
        const h = SL / 2 - GAP / 2;
        // CCW seen from above (OUR convention: −z is "up" on the map)
        const quad: [number, number][] = [[cx0 - h, cz0 + h], [cx0 + h, cz0 + h], [cx0 + h, cz0 - h], [cx0 - h, cz0 - h]];
        const c = clip(quad);
        let area = 0;
        for (let k = 0; k < c.length; k++) { const p = c[k], q = c[(k + 1) % c.length]; area += p[0] * q[1] - q[0] * p[1]; }
        if (Math.abs(area) / 2 < 0.05) continue;
        fan(c, y + PLAZA_Y + 0.02, st);
      }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    g.setIndex(idx);
    g.computeBoundingSphere();
    const mesh = new THREE.Mesh(g, mat);
    mesh.receiveShadow = true;
    mesh.castShadow = false;
    mesh.name = 'village plaza';
    out.addObject(mesh);
  }

  /** Stone wall along edge d of the cell (model lies on local edge 3 = W at x = −1 unit). */
  private fence(out: ChunkBuilder, x: number, y: number, z: number, d: number, gate = false, wood = false): void {
    const rot = ((d - 3) * Math.PI) / 3;
    const edge = HEX_SCALE; // inner radius (1 unit) in metres
    const m = new THREE.Matrix4()
      .makeTranslation(x, y, z)
      .multiply(new THREE.Matrix4().makeRotationY(rot))
      .multiply(new THREE.Matrix4().makeTranslation(-edge, 0, 0))
      .multiply(new THREE.Matrix4().makeScale(wood ? 1 : FENCE_SCALE_T, wood ? WOOD_SCALE_Y : FENCE_SCALE_Y, 1))
      .multiply(new THREE.Matrix4().makeTranslation(edge, 0, 0));
    if (!this.addFade(wood ? (gate ? WOOD_GATE_ID : WOOD_FENCE_ID) : gate ? GATE_ID : FENCE_ID, m)) return;
    this.stats.fences++;
    if (gate) return; // walk-through entrance
    // collider: thin box along the edge
    const R = this.ctx.rapier;
    const q = new THREE.Quaternion().setFromAxisAngle(UP, rot);
    const p = new THREE.Vector3(-edge, 0, 0).applyQuaternion(q);
    const hy = wood ? 0.5 * HEX_SCALE * WOOD_SCALE_Y * 0.5 : 0.27 * HEX_SCALE * FENCE_SCALE_Y * 0.5;
    out.addCollider(
      R.ColliderDesc.cuboid(0.1 * HEX_SCALE * FENCE_SCALE_T, hy, 0.5 * HEX_SCALE * 1.1547 * 0.98)
        .setTranslation(x + p.x, y + hy, z + p.z)
        .setRotation({ x: q.x, y: q.y, z: q.z, w: q.w })
        .setCollisionGroups(WORLD_GROUPS),
    );
    this.stats.colliders++;
    this.dbgBox(0.1 * HEX_SCALE * FENCE_SCALE_T, hy, 0.5 * HEX_SCALE * 1.1547 * 0.98, x + p.x, y + hy, z + p.z, q);
  }
}

const _mv = new THREE.Vector3();
const _mn = new THREE.Matrix3();
/** Merge transformed geometries (position, normal, uv) + aFadeAnchor (sphere per source object). */
function mergeWithAnchor(items: { geometry: THREE.BufferGeometry; matrix: THREE.Matrix4; c: THREE.Vector3; r: number }[]): THREE.BufferGeometry | null {
  if (!items.length) return null;
  const hasUv = items.every((i) => i.geometry.attributes.uv);
  let vCount = 0, iCount = 0;
  for (const it of items) {
    vCount += it.geometry.attributes.position.count;
    iCount += it.geometry.index ? it.geometry.index.count : it.geometry.attributes.position.count;
  }
  const pos = new Float32Array(vCount * 3), nor = new Float32Array(vCount * 3), anc = new Float32Array(vCount * 4);
  const uv = hasUv ? new Float32Array(vCount * 2) : null;
  const idx = vCount > 65535 ? new Uint32Array(iCount) : new Uint16Array(iCount);
  let vo = 0, io = 0;
  for (const it of items) {
    const g = it.geometry, P = g.attributes.position, N = g.attributes.normal;
    _mn.getNormalMatrix(it.matrix);
    const flip = it.matrix.determinant() < 0;
    const w = FADE_W0 + it.r;
    for (let i = 0; i < P.count; i++) {
      const o = vo + i;
      _mv.fromBufferAttribute(P, i).applyMatrix4(it.matrix);
      pos[o * 3] = _mv.x; pos[o * 3 + 1] = _mv.y; pos[o * 3 + 2] = _mv.z;
      if (N) {
        _mv.fromBufferAttribute(N, i).applyMatrix3(_mn).normalize();
        nor[o * 3] = _mv.x; nor[o * 3 + 1] = _mv.y; nor[o * 3 + 2] = _mv.z;
      }
      if (uv) { uv[o * 2] = g.attributes.uv.getX(i); uv[o * 2 + 1] = g.attributes.uv.getY(i); }
      anc[o * 4] = it.c.x; anc[o * 4 + 1] = it.c.y; anc[o * 4 + 2] = it.c.z; anc[o * 4 + 3] = w;
    }
    if (g.index) {
      const I = g.index;
      for (let i = 0; i < I.count; i += 3) {
        const a = I.getX(i) + vo, b = I.getX(i + 1) + vo, c = I.getX(i + 2) + vo;
        idx[io++] = a; idx[io++] = flip ? c : b; idx[io++] = flip ? b : c;
      }
    } else {
      for (let i = 0; i < P.count; i += 3) { idx[io++] = vo + i; idx[io++] = vo + (flip ? i + 2 : i + 1); idx[io++] = vo + (flip ? i + 1 : i + 2); }
    }
    vo += P.count;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
  if (uv) geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  geo.setAttribute('aFadeAnchor', new THREE.BufferAttribute(anc, 4));
  geo.setIndex(new THREE.BufferAttribute(idx, 1));
  geo.computeBoundingSphere();
  geo.computeBoundingBox();
  return geo;
}
