// props module (stage 6): hand-composed prop vignettes at doors, the well, work-building yards, field edges and
// village flags (crossing / entries). No free scatter anywhere. Placement is planned per village (plan.ts, pure,
// seeded), rendered per chunk through out.add (merged into the chunk's hex-atlas mesh → +0 draw calls) with small
// colliders for the props a player would bump. See NOTES.md.
import * as THREE from 'three';
import type { CameraView, CoreContext, GameModule } from '../../core/types';
import type { ChunkBuilder } from '../../core/chunks';
import { orbitToView } from '../../core/debug';
import { DIRS, chunkCells } from '../../core/hex';
import { CHUNK } from '../../core/units';
import { hash, rand01 } from '../../core/rng';
import { WORLD_GROUPS } from '../../core/groups';
import { FADE_ATTR, FADE_W0, occluderFadeMaterial } from '../../core/fade';
import { villageAt, villagesNear, type VillageInfo } from '../villages/api';
import * as VApi from '../villages/api';
import { PropEnv, PROP_IDS, REASONS, planVillage, planVillageSteps, planCrossing, planRest, FENCE_PROP, pocketCount, buildingAt, validateVillage, type Kind, type Placed, type Vignette, type VillageProps } from './plan';
import { buildRig, rigIds, rigPresets } from './rig';

let env: PropEnv | null = null;
const plans = new Map<string, VillageProps>();
const stats = { villages: 0, signposts: 0, rests: 0, props: 0, triangles: 0, colliders: 0, planMs: 0, maxPlanMs: 0, chunkMs: 0, chunks: 0 };

const CACHE = 128;

/** Village plans in progress (prefetchStep): resumable generators + active ms so far. */
const pending = new Map<string, { gen: Generator<void, VillageProps, void>; ms: number }>();

function store(p: VillageProps): void {
  plans.set(p.id, p);
  while (plans.size > CACHE) plans.delete(plans.keys().next().value as string);
  stats.villages++;
  stats.planMs += p.ms;
  stats.maxPlanMs = Math.max(stats.maxPlanMs, p.ms);
}

/** Advance a village plan for at most `budget` ms; returns the plan when complete. Identical output however driven. */
function stepPlan(v: VillageInfo, budget: number): VillageProps | null {
  if (!env) return null;
  let job = pending.get(v.id);
  if (!job) pending.set(v.id, (job = { gen: planVillageSteps(env, v), ms: 0 }));
  const t0 = performance.now();
  for (;;) {
    const r = job.gen.next();
    if (r.done) {
      pending.delete(v.id);
      r.value.ms = job.ms + (performance.now() - t0);
      store(r.value);
      return r.value;
    }
    if (performance.now() - t0 > budget) {
      job.ms += performance.now() - t0;
      return null;
    }
  }
}

function planFor(v: VillageInfo): VillageProps | null {
  const hit = plans.get(v.id);
  if (hit) {
    // LRU refresh
    plans.delete(v.id);
    plans.set(v.id, hit);
    return hit;
  }
  if (!env) return null;
  // a plan started by prefetchStep is finished from where it stopped (same result as a fresh plan)
  if (pending.has(v.id)) return stepPlan(v, Infinity);
  const p = planVillage(env, v);
  plans.set(v.id, p);
  while (plans.size > CACHE) plans.delete(plans.keys().next().value as string);
  stats.villages++;
  stats.planMs += p.ms;
  stats.maxPlanMs = Math.max(stats.maxPlanMs, p.ms);
  return p;
}

/** Village cells whose plans can own props on (q, r): the cell itself, or for a street cell its village neighbours. */
function ownersOf(ctx: CoreContext, q: number, r: number, out: Map<string, { q: number; r: number }>): void {
  const c = ctx.world.cell(q, r);
  if (c.village) {
    if (!out.has(c.village.id)) out.set(c.village.id, { q, r });
    return;
  }
  if (!c.roadMask) return;
  for (const [dq, dr] of DIRS) {
    const n = ctx.world.cell(q + dq, r + dr);
    if (n.village && !out.has(n.village.id)) out.set(n.village.id, { q: q + dq, r: r + dr });
  }
}

// ---------------------------------------------------------------- crossing signposts (outside settlements)
const crossings = new Map<string, Vignette | null>();
const CROSS_CACHE = 1024;

function forkCell(ctx: CoreContext, q: number, r: number): boolean {
  const m = ctx.world.cell(q, r).roadMask;
  if (!m) return false;
  let n = 0;
  for (let d = 0; d < 6; d++) if (m & (1 << d)) n++;
  return n >= 3;
}

/** Colour of the village the road leaving (q, r) through edge d leads to (walks the road ≤ 24 cells), or null. */
function destColour(ctx: CoreContext, q: number, r: number, d: number): string | null {
  const W = ctx.world;
  let pq = q, pr = r, cq = q + DIRS[d][0], cr = r + DIRS[d][1];
  for (let step = 0; step < 24; step++) {
    for (const [dq, dr] of [[0, 0], ...DIRS]) {
      const n = W.cell(cq + dq, cr + dr);
      if (n.village && n.tags.includes('village') && !n.tags.includes('rural')) return n.village.color;
    }
    const c = W.cell(cq, cr);
    if (!c.roadMask) return null;
    let next = -1, cnt = 0;
    for (let e = 0; e < 6; e++) {
      if (!(c.roadMask & (1 << e))) continue;
      const nq = cq + DIRS[e][0], nr = cr + DIRS[e][1];
      if (nq === pq && nr === pr) continue;
      cnt++;
      if (next < 0) next = e;
    }
    if (cnt !== 1) return null; // dead end or another fork
    pq = cq; pr = cr;
    cq += DIRS[next][0]; cr += DIRS[next][1];
  }
  return null;
}

function crossingAt(ctx: CoreContext, q: number, r: number): Vignette | null {
  if (!env?.roadside || !forkCell(ctx, q, r)) return null; // only fork cells are cached
  const k = q + ',' + r;
  if (crossings.has(k)) return crossings.get(k)!;
  let vg: Vignette | null = null;
  {
    const t0 = performance.now();
    vg = planCrossing(env, q, r, (d) => destColour(ctx, q, r, d));
    stats.planMs += performance.now() - t0;
    if (vg) stats.signposts++;
  }
  crossings.set(k, vg);
  while (crossings.size > CROSS_CACHE) crossings.delete(crossings.keys().next().value as string);
  return vg;
}

// ---------------------------------------------------------------- rest spots (one candidate per 9×9 axial grid cell)
const REST_GRID = 9;
const rests = new Map<string, Vignette | null>();

function restOfGrid(ctx: CoreContext, gi: number, gj: number): Vignette | null {
  const k = gi + ',' + gj;
  if (rests.has(k)) return rests.get(k)!;
  let vg: Vignette | null = null;
  if (env?.roadside) {
    const W = ctx.world, seed = ctx.world.seed;
    let best: { q: number; r: number; h: number } | null = null;
    for (let q = gi * REST_GRID; q < (gi + 1) * REST_GRID; q++)
      for (let r = gj * REST_GRID; r < (gj + 1) * REST_GRID; r++) {
        const c = W.cell(q, r);
        if (!c.roadMask || c.slope || c.bridge || c.riverMask) continue;
        let bits = 0;
        for (let d = 0; d < 6; d++) if (c.roadMask & (1 << d)) bits++;
        if (bits !== 2) continue;
        const h = hash(seed, 0x52535431, q, r);
        if (best && h <= best.h) continue;
        // ≥ 3 cells from any settlement cell (villages, hamlets, rural sites dress themselves)
        let free = true;
        for (let dq = -3; dq <= 3 && free; dq++)
          for (let dr = Math.max(-3, -dq - 3); dr <= Math.min(3, -dq + 3); dr++)
            if (W.cell(q + dq, r + dr).tags.includes('village')) { free = false; break; }
        if (free) best = { q, r, h };
      }
    if (best && rand01(seed, 0x52535432, gi, gj) < 0.8) {
      const t0 = performance.now();
      vg = planRest(env, best.q, best.r);
      stats.planMs += performance.now() - t0;
      if (vg) stats.rests++;
    }
  }
  rests.set(k, vg);
  while (rests.size > 512) rests.delete(rests.keys().next().value as string);
  return vg;
}

/** Rest-spot items owned by cells of chunk (cx, cz). */
function restsForChunk(ctx: CoreContext, cx: number, cz: number): Vignette[] {
  const out: Vignette[] = [];
  const q0 = cx * CHUNK, r0 = cz * CHUNK;
  for (let gi = Math.floor(q0 / REST_GRID); gi <= Math.floor((q0 + CHUNK - 1) / REST_GRID); gi++)
    for (let gj = Math.floor(r0 / REST_GRID); gj <= Math.floor((r0 + CHUNK - 1) / REST_GRID); gj++) {
      const vg = restOfGrid(ctx, gi, gj);
      if (vg && vg.q >= q0 && vg.q < q0 + CHUNK && vg.r >= r0 && vg.r < r0 + CHUNK) out.push(vg);
    }
  return out;
}

/** Villages a chunk needs: id → VillageInfo (cheap; no planning). */
function villagesForChunk(ctx: CoreContext, cx: number, cz: number): VillageInfo[] {
  const owners = new Map<string, { q: number; r: number }>();
  for (const { q, r } of chunkCells(cx, cz)) ownersOf(ctx, q, r, owners);
  const out: VillageInfo[] = [];
  for (const [, at] of owners) {
    const v = villageAt(ctx.world.seed, at.q, at.r);
    if (v) out.push(v);
  }
  return out;
}

/** Plans needed by a chunk (computed and cached; pure → identical output whenever and in whatever order). */
function plansForChunk(ctx: CoreContext, cells: { q: number; r: number }[]): VillageProps[] {
  const owners = new Map<string, { q: number; r: number }>();
  for (const { q, r } of cells) ownersOf(ctx, q, r, owners);
  const out: VillageProps[] = [];
  for (const [id, at] of owners) {
    let p = plans.get(id) ?? null;
    if (!p) {
      const v = villageAt(ctx.world.seed, at.q, at.r);
      p = v ? planFor(v) : null;
    }
    if (p) out.push(p);
  }
  return out;
}

// ---------------------------------------------------------------- rendering
const UP = new THREE.Vector3(0, 1, 0);
const XAXIS = new THREE.Vector3(1, 0, 0);
const _q = new THREE.Quaternion();
const _v = new THREE.Vector3();
const _s = new THREE.Vector3(1, 1, 1);

function matrixOf(it: Placed): THREE.Matrix4 {
  const k = it.k ?? 1;
  if (it.scl) {
    const m0 = new THREE.Matrix4().compose(_v.set(it.x, it.y, it.z), _q.setFromAxisAngle(UP, it.rot), _s.set(...it.scl));
    return it.pre ? m0.multiply(new THREE.Matrix4().makeTranslation(...it.pre)) : m0;
  }
  const m = new THREE.Matrix4().compose(_v.set(it.x, it.y + (it.lie ? it.hx : 0), it.z), _q.setFromAxisAngle(UP, it.rot), _s.set(k, k, k));
  if (it.lie) {
    // barrel on its side: axis along local Z, resting on its rim
    m.multiply(new THREE.Matrix4().makeRotationAxis(XAXIS, Math.PI / 2)).multiply(new THREE.Matrix4().makeTranslation(0, -it.hz, 0));
  }
  return m;
}

const DBG_MAT = new THREE.LineBasicMaterial({ color: 0xff00ff, depthTest: false, toneMapped: false });
const DBG_BOX = new THREE.EdgesGeometry(new THREE.BoxGeometry(1, 1, 1));
DBG_BOX.userData.shared = true;

/** Fade anchor of a prop: the sphere around its whole stack (a crate on a crate fades as one). */
function anchorOf(it: Placed, tops: Map<Placed, number>): [number, number, number, number] {
  let root = it;
  while (root.base) root = root.base;
  const y1 = Math.max(root.y + root.h, tops.get(root) ?? 0);
  const hy = (y1 - root.y) / 2;
  return [root.cx, root.y + hy, root.cz, Math.hypot(root.hx, root.hz, hy)];
}

const _mw = new THREE.Matrix4();
const _nm = new THREE.Matrix3();
const _p = new THREE.Vector3();

/**
 * Merge all props of a chunk per material into ONE mesh each, with a per-vertex `aFadeAnchor` (core/fade.ts) and the
 * shared occluder-fade material → a prop between camera and player fades as a whole (never a hole).
 */
function mergeFading(ctx: CoreContext, out: ChunkBuilder, items: Placed[], tops: Map<Placed, number>): void {
  const buckets = new Map<THREE.Material, { geo: THREE.BufferGeometry; m: THREE.Matrix4; a: [number, number, number, number] }[]>();
  for (const it of items) {
    const a = ctx.assets.get(it.id);
    if (!a) continue;
    stats.props++;
    const anc = anchorOf(it, tops);
    const mi = matrixOf(it);
    out.record(it.id,mi,'prop');
    for (const part of a.parts) {
      let l = buckets.get(part.material);
      if (!l) buckets.set(part.material, (l = []));
      l.push({ geo: part.geometry, m: new THREE.Matrix4().multiplyMatrices(mi, part.matrix), a: anc });
      stats.triangles += (part.geometry.index?.count ?? part.geometry.attributes.position.count) / 3;
    }
  }
  for (const [mat, list] of buckets) {
    let vc = 0, ic = 0;
    const hasUv = list.every((e) => e.geo.attributes.uv);
    for (const e of list) {
      vc += e.geo.attributes.position.count;
      ic += e.geo.index ? e.geo.index.count : e.geo.attributes.position.count;
    }
    const pos = new Float32Array(vc * 3), nor = new Float32Array(vc * 3), anc = new Float32Array(vc * 4);
    const uv = hasUv ? new Float32Array(vc * 2) : null;
    const idx = vc > 65535 ? new Uint32Array(ic) : new Uint16Array(ic);
    let vo = 0, io = 0;
    for (const e of list) {
      const P = e.geo.attributes.position, N = e.geo.attributes.normal, U = e.geo.attributes.uv;
      _mw.copy(e.m);
      _nm.getNormalMatrix(_mw);
      const flip = _mw.determinant() < 0;
      for (let i = 0; i < P.count; i++) {
        _p.fromBufferAttribute(P, i).applyMatrix4(_mw);
        pos.set([_p.x, _p.y, _p.z], (vo + i) * 3);
        if (N) {
          _p.fromBufferAttribute(N, i).applyMatrix3(_nm).normalize();
          nor.set([_p.x, _p.y, _p.z], (vo + i) * 3);
        }
        if (uv && U) uv.set([U.getX(i), U.getY(i)], (vo + i) * 2);
        anc.set([e.a[0], e.a[1], e.a[2], FADE_W0 + e.a[3]], (vo + i) * 4);
      }
      const I = e.geo.index;
      const n = I ? I.count : P.count;
      for (let i = 0; i < n; i += 3) {
        const a0 = (I ? I.getX(i) : i) + vo, b0 = (I ? I.getX(i + 1) : i + 1) + vo, c0 = (I ? I.getX(i + 2) : i + 2) + vo;
        idx[io++] = a0; idx[io++] = flip ? c0 : b0; idx[io++] = flip ? b0 : c0;
      }
      vo += P.count;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
    if (uv) geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
    geo.setAttribute(FADE_ATTR, new THREE.BufferAttribute(anc, 4));
    geo.setIndex(new THREE.BufferAttribute(idx, 1));
    geo.computeBoundingSphere();
    geo.computeBoundingBox();
    const mesh = new THREE.Mesh(geo, occluderFadeMaterial(mat));
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.matrixAutoUpdate = false;
    mesh.name = 'props';
    out.addObject(mesh);
  }
}

function emit(ctx: CoreContext, out: ChunkBuilder, items: Placed[]): void {
  const R = ctx.rapier;
  // ?pcol=1: draw every prop collider as a magenta wire box (verification only)
  const dbg = ctx.params.has('pcol') ? new THREE.Group() : null;
  const show = (hx: number, hy: number, hz: number, x: number, y: number, z: number, rot: number) => {
    if (!dbg) return;
    const l = new THREE.LineSegments(DBG_BOX, DBG_MAT);
    l.position.set(x, y, z);
    l.rotation.y = rot;
    l.scale.set(hx * 2, hy * 2, hz * 2);
    l.renderOrder = 10;
    dbg.add(l);
  };
  // stack tops per base item (one collider per stack)
  const top = new Map<Placed, number>();
  for (const it of items) if (it.base && !/flag_/.test(it.id)) top.set(it.base, Math.max(top.get(it.base) ?? 0, it.y + it.h));
  // fade anchors include flags planted in their barrel / cairn
  const tops = new Map(top);
  for (const it of items) if (it.base && /flag_/.test(it.id)) tops.set(it.base, Math.max(tops.get(it.base) ?? 0, it.y + it.h));
  mergeFading(ctx, out, items, tops);
  for (const it of items) {
    if (!it.solid || it.base) continue;
    const H = Math.max(it.y + it.h, top.get(it) ?? 0) - it.y;
    const rot = { x: 0, y: Math.sin(it.rot / 2), z: 0, w: Math.cos(it.rot / 2) };
    let d: ReturnType<typeof R.ColliderDesc.cuboid>;
    if (/barrel$/.test(it.id) && !it.lie && !top.has(it)) {
      d = R.ColliderDesc.cylinder(H / 2, it.hx * 0.96).setTranslation(it.x, it.y + H / 2, it.z);
      show(it.hx * 0.96, H / 2, it.hx * 0.96, it.x, it.y + H / 2, it.z, it.rot);
    } else {
      const k = /resource_stone/.test(it.id) ? 0.8 : 0.96;
      d = R.ColliderDesc.cuboid(it.hx * k, H / 2, it.hz * k).setTranslation(it.cx, it.y + H / 2, it.cz).setRotation(rot);
      show(it.hx * k, H / 2, it.hz * k, it.cx, it.y + H / 2, it.cz, it.rot);
    }
    out.addCollider(d.setCollisionGroups(WORLD_GROUPS));
    stats.colliders++;
  }
  if (dbg?.children.length) out.addObject(dbg);
}

// ---------------------------------------------------------------- presets (deterministic search near the origin)
function nearbyVillages(ctx: CoreContext): VillageInfo[] {
  return villagesNear(ctx.world.seed, 0, 0, 70);
}

const foundV = new Map<string, { v: VillageInfo; vg: Vignette } | null>();
function findVignette(ctx: CoreContext, kind: Kind): { v: VillageInfo; vg: Vignette } | null {
  const k = kind + ctx.world.seed;
  if (foundV.has(k)) return foundV.get(k)!;
  let res: { v: VillageInfo; vg: Vignette } | null = null;
  if (kind === 'sign' || kind === 'rest') {
    let best: Vignette | null = null, bd = Infinity;
    const c0 = mainVillage(ctx)?.world ?? { x: 0, z: 0 };
    for (const vg of (kind === 'sign' ? crossings : rests).values()) {
      if (!vg) continue;
      const d = Math.hypot(vg.focus.x - c0.x, vg.focus.z - c0.z);
      if (d < bd) { bd = d; best = vg; }
    }
    const v = mainVillage(ctx);
    res = best && v ? { v, vg: best } : null;
    if (res) foundV.set(k, res);
    return res;
  }
  const rural = (VApi as { ruralNear?: (s: number, q: number, r: number, R: number) => VillageInfo[] }).ruralNear?.(ctx.world.seed, 0, 0, 40) ?? [];
  const vs = [...nearbyVillages(ctx), ...rural];
  // prefer proper villages, nearest first
  for (const v of [...vs.filter((x) => x.kind === 'village'), ...vs.filter((x) => x.kind !== 'village')]) {
    const p = planFor(v);
    // the richest vignette of that kind in the nearest village that has one
    const vg = p?.vignettes.filter((g) => g.kind === kind).sort((a, b) => b.items.length - a.items.length)[0];
    if (vg) { res = { v, vg }; break; }
  }
  foundV.set(k, res);
  return res;
}

const yawOf = (x: number, z: number) => (Math.atan2(x, z) * 180) / Math.PI;
const fallback = (ctx: CoreContext): CameraView => orbitToView({ target: [0, ctx.world.heightAt(0, 0), 0], yaw: 30, pitch: 40, dist: 120 });

/** Camera spot with a clear line to the target (not inside / behind a building, not under a cliff). */
function clearView(ctx: CoreContext, v: CameraView): boolean {
  if (!env) return true;
  const [px, py, pz] = v.position, [tx, ty, tz] = v.target;
  // props in the way (flag poles, crate stacks) block the view too
  const near: Placed[] = [];
  for (const p of plans.values())
    for (const vg of p.vignettes)
      for (const it of vg.items) if (Math.hypot(it.cx - tx, it.cz - tz) < 25) near.push(it);
  for (let i = 0; i <= 20; i++) {
    const t = i / 20;
    if (t > 0.8) break;
    const x = px + (tx - px) * t, y = py + (ty - py) * t, z = pz + (tz - pz) * t;
    for (const it of near) if (y < it.y + it.h + 0.3 && Math.hypot(x - it.cx, z - it.cz) < Math.max(it.hx, it.hz) + 0.5) return false;
  }
  for (let i = 0; i <= 12; i++) {
    const t = i / 12;
    if (t > 0.8) break;
    const x = px + (tx - px) * t, y = py + (ty - py) * t, z = pz + (tz - pz) * t;
    if (ctx.world.heightAt(x, z) > y - 0.4) return false;
    // eaves and roofs overhang the ground footprint: keep the camera well off it
    if (y < 12 && buildingAt(env, x, z, i === 0 ? 2.2 : 1.0)) return false;
  }
  return true;
}

function closeUp(ctx: CoreContext, kind: Kind, dist = 8.5, pitch = 20, turn = 38): CameraView {
  const f = findVignette(ctx, kind);
  if (!f) return fallback(ctx);
  const { vg } = f;
  const o = vg.out;
  let first: CameraView | null = null;
  for (const dt of [0, -2 * turn, 25, -turn - 25, 70, -110, 110, 150, 180]) {
    for (const [dd, pp] of [[dist, pitch], [dist * 0.8, pitch + 12]]) {
      const a = Math.atan2(o.z, o.x) + ((turn + dt) * Math.PI) / 180;
      const view = orbitToView({ target: [vg.focus.x, vg.focus.y + 0.7, vg.focus.z], yaw: yawOf(Math.cos(a), Math.sin(a)), pitch: pp, dist: dd, fov: 50 });
      first ??= view;
      if (clearView(ctx, view)) return view;
    }
  }
  return first!;
}

function mainVillage(ctx: CoreContext): VillageInfo | null {
  const vs = nearbyVillages(ctx);
  return vs.find((v) => v.kind === 'village') ?? vs[0] ?? null;
}

const presets: Record<string, (ctx: CoreContext) => CameraView> = {
  door: (ctx) => closeUp(ctx, 'door'),
  well: (ctx) => closeUp(ctx, 'well', 9, 22, 30),
  market: (ctx) => closeUp(ctx, 'market', 10),
  mill: (ctx) => closeUp(ctx, 'mill', 10),
  field: (ctx) => closeUp(ctx, 'field', 10, 24),
  crossing: (ctx) => closeUp(ctx, 'flag', 11, 18, 40),
  tavern: (ctx) => closeUp(ctx, 'tavern', 10),
  smith: (ctx) => closeUp(ctx, 'smith', 9),
  lumber: (ctx) => closeUp(ctx, 'lumber', 11),
  /** top-down checks (wall contact / overlaps) */
  lumber_top: (ctx) => closeUp(ctx, 'lumber', 9, 80, 0),
  smith_top: (ctx) => closeUp(ctx, 'smith', 9, 80, 0),
  /** street level: eye height (≈ 2 m) about 16 m from a door vignette, clear line of sight */
  signpost: (ctx) => closeUp(ctx, 'sign', 9, 14, 30),
  rest: (ctx) => closeUp(ctx, 'rest', 10, 16, 35),
  pasture: (ctx) => closeUp(ctx, 'paddock', 11, 26, 30),
  farm: (ctx) => closeUp(ctx, 'farm', 10, 18, 30),
  street: (ctx) => closeUp(ctx, 'door', 16, 5, 20),
  /** the main village from 45 m */
  village: (ctx) => {
    const v = mainVillage(ctx);
    if (!v) return fallback(ctx);
    return orbitToView({ target: [v.world.x, v.world.y + 1, v.world.z], yaw: 35, pitch: 36, dist: 50, fov: 50 });
  },
  // calibration rig presets only exist in the rig view (they look at a floating rig, not the world)
  ...(typeof location !== 'undefined' && new URLSearchParams(location.search).get('view') === 'rig' ? rigPresets : {}),
};

// ---------------------------------------------------------------- module
const mod: GameModule = {
  id: 'props',

  async init(ctx) {
    ctx.events.on('surface:changed',()=>{plans.clear();pending.clear();crossings.clear();rests.clear();foundV.clear();});
    await ctx.assets.preload([...PROP_IDS, FENCE_PROP]);
    env = new PropEnv(ctx.world.seed, ctx.world, (id) => ctx.assets.get(id));
    env.roadside = ctx.params.get('proproad') !== '0';
    // fit every building footprint now (≈ 40 ms once) instead of inside the first village chunk build
    for (const id of ctx.assets.ids()) if (/^hex\/buildings\/(blue|neutral)\/building_/.test(id) && ctx.assets.get(id)) env.footprint(id);
    const api = {
      stats: () => ({ ...stats, footprintMs: env?.fpMs ?? 0, cachedVillages: plans.size, rejected: { ...REASONS } }),
      /** plans of every village within R cells of (q, r) */
      census: (R = 30, q = 0, r = 0) =>
        [...villagesNear(ctx.world.seed, q, r, R), ...((VApi as { ruralNear?: (s: number, q: number, r: number, R: number) => VillageInfo[] }).ruralNear?.(ctx.world.seed, q, r, R) ?? [])].map((v) => {
          const p = planFor(v);
          return { id: v.id, kind: v.kind, doors: v.doors.length, ms: +(p?.ms ?? 0).toFixed(2), ...(p?.counts ?? {}) };
        }),
      plan: (id: string) => plans.get(id) ?? null,
      /**
       * Streaming hook: compute (and cache) the plans chunk (cx, cz) will need, e.g. in idle time, so its buildChunk
       * is merge-only. Returns ms spent. Pure: the output is identical with or without prefetching.
       */
      /**
       * Streaming hook, sliced: advances at most ONE village plan of chunk (cx, cz) by ≤ `budgetMs` (default 8) of
       * work and returns true once every plan the chunk needs is cached (false = call again later). Output identical.
       */
      /** debug: a fresh plan vs the same plan driven one step at a time must be identical */
      selfTest: (R = 20) => {
        if (!env) return null;
        const sig = (p: VillageProps) => JSON.stringify(p.vignettes.map((g) => g.items.map((it) => [it.id, +it.x.toFixed(4), +it.z.toFixed(4), +it.y.toFixed(4), +it.rot.toFixed(4)])));
        let same = 0, diff = 0, maxStep = 0;
        for (const v of villagesNear(ctx.world.seed, 0, 0, R)) {
          const a = planVillage(env, v);
          const g = planVillageSteps(env, v);
          let r = g.next();
          for (;;) {
            const t0 = performance.now();
            if (r.done) break;
            r = g.next();
            maxStep = Math.max(maxStep, performance.now() - t0);
          }
          if (sig(a) === sig(r.value)) same++; else diff++;
        }
        return { same, diff, maxStepMs: +maxStep.toFixed(2) };
      },
      /** crossing signposts planned so far (loaded chunks): count, arms, companions */
      signs: () => [...crossings.values()].filter(Boolean).map((vg) => ({
        q: vg!.q, r: vg!.r, x: +vg!.focus.x.toFixed(1), z: +vg!.focus.z.toFixed(1),
        arms: vg!.items.filter((it) => /flag_/.test(it.id)).map((it) => it.id.split('_').pop()).join('/'),
        extra: vg!.items.filter((it) => !/flag_|resource_stone/.test(it.id)).map((it) => it.id.split('/').pop()).join('+'),
      })),
      /** rest spots planned so far */
      rests: () => [...rests.values()].filter(Boolean).map((vg) => ({ q: vg!.q, r: vg!.r, x: +vg!.focus.x.toFixed(1), z: +vg!.focus.z.toFixed(1), items: vg!.items.map((it) => it.id.split('/').pop()).join('+') })),
      /** pocket check of every rest spot + crossing planned so far */
      roadPockets: () => {
        let n = 0;
        for (const vg of [...rests.values(), ...crossings.values()]) {
          if (!vg || !env) continue;
          const sol = vg.items.filter((it) => it.solid && !it.base);
          n += pocketCount(env, [], sol, sol);
        }
        return n;
      },
      prefetchStep: (cx: number, cz: number, budgetMs = 8): boolean => {
        for (const v of villagesForChunk(ctx, cx, cz)) {
          if (plans.has(v.id)) continue;
          stepPlan(v, budgetMs);
          return false;
        }
        for (const { q, r } of chunkCells(cx, cz)) crossingAt(ctx, q, r);
        restsForChunk(ctx, cx, cz);
        return true;
      },
      prefetch: (cx: number, cz: number) => {
        const t0 = performance.now();
        plansForChunk(ctx, [...chunkCells(cx, cz)]);
        return performance.now() - t0;
      },
      /** re-check every planned prop of the villages within R cells (ground, roads, buildings, doors, overlaps) */
      validate: (R = 30, q = 0, r = 0) => {
        const tot: Record<string, number> = {};
        const bad: string[] = [];
        for (const v of [...villagesNear(ctx.world.seed, q, r, R), ...((VApi as { ruralNear?: (s: number, q: number, r: number, R: number) => VillageInfo[] }).ruralNear?.(ctx.world.seed, q, r, R) ?? [])]) {
          const p = planFor(v);
          if (!p || !env) continue;
          const res = validateVillage(env, p, v);
          for (const [k, n] of Object.entries(res)) if (typeof n === 'number') tot[k] = (tot[k] ?? 0) + n;
          bad.push(...(res.bad as string[]).map((b) => v.id + ' ' + b));
        }
        return { ...tot, bad: bad.slice(0, 30) };
      },
    };
    ctx.services.set('props', api);
    (window as unknown as Record<string, unknown>).__props = api;
  },

  buildChunk(chunk, out, ctx) {
    if (!env) return;
    const t0 = performance.now();
    const items: Placed[] = [];
    const ps = plansForChunk(ctx, chunk.cells);
    if (ps.length)
      for (const { q, r } of chunk.cells)
        for (const p of ps) {
          const l = p.byCell.get(q + ',' + r);
          if (l) items.push(...l);
        }
    for (const { q, r } of chunk.cells) {
      const vg = crossingAt(ctx, q, r);
      if (vg) items.push(...vg.items);
    }
    for (const vg of restsForChunk(ctx, chunk.cx, chunk.cz)) items.push(...vg.items);
    if (items.length) {
      emit(ctx, out, items);
      stats.chunks++;
    }
    stats.chunkMs += performance.now() - t0;
  },

  showcaseUses: ['terrain', 'roads', 'villages', 'nature'],
  async showcase(ctx, params) {
    if (params.get('view') === 'rig') {
      await ctx.assets.preload(rigIds());
      buildRig(ctx);
      return;
    }
    ctx.chunks.configure({ loadRadius: 240, urgentRadius: 240 });
    const v = mainVillage(ctx);
    const view = v ? presets.village(ctx) : fallback(ctx);
    ctx.chunks.focus.set(view.target[0], 0, view.target[2]);
    ctx.camera.position.set(...view.position);
    ctx.camera.lookAt(new THREE.Vector3(...view.target));
  },

  cameraPresets: presets,
};

export default mod;
