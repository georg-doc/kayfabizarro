// nature module: stage-5 forest density layer, per-chunk forests / copses / lone trees / bushes / rocks / grass,
// trunk + rock colliders (WORLD), canopy + bush sensors (CAMERA_ONLY), calm wind sway, showcase + presets.
import * as THREE from 'three';
import type { CameraView, CellData, CoreContext, GameModule } from '../../core/types';
import { DIRS, chunkCells, edgeVector, hexToChunk, hexToWorld, worldToHex } from '../../core/hex';
import { orbitToView } from '../../core/debug';
import { WORLD_GROUPS } from '../../core/groups';
import { applyNature, blocked, NTAG, NATURE_STAGE } from './layer';
import { ALL_IDS, buildProtos, type ProtoSet } from './protos';
import { mergePlacements, natUniforms, windMaterial } from './mesh';
import { PlanJob, type Plan } from './place';
import { CanopyIndex, canopyBaseAt, inForest } from './api';
import { clone as skeletonClone } from 'three/examples/jsm/utils/SkeletonUtils.js';

let protos: ProtoSet | null = null;
/** Crowns of the loaded chunks (camera queries: canopyBaseAt / inForest). */
const canopy = new CanopyIndex();
/** Near-only detail per loaded chunk (bushes, small rocks, grass) — hidden beyond DETAIL_R from the camera. */
const details = new Map<string, { x: number; z: number; objs: THREE.Object3D[]; vis: boolean; near: THREE.Object3D[]; far: THREE.Object3D[]; nearVis: boolean | null; cast: boolean | null }>();
/** Near-detail (bushes, rocks ≥ 0.6 m) only casts shadows in chunks whose centre is within this of the chunk focus. */
let DETAIL_SHADOW_R = 110;
let DETAIL_R = 125;
/** Chunks whose centre is farther than this from the camera draw the far LOD of their heavy trees. */
let FAR_R = 230;
const stats = { planned: 0, planMs: 0, mergeMs: 0, chunks: 0, ms: 0, maxMs: 0, trees: 0, bushes: 0, rocks: 0, grass: 0, tris: 0, colliders: 0 };
const _m = new THREE.Matrix4();
const _q = new THREE.Quaternion();
const _s = new THREE.Vector3();
const _p = new THREE.Vector3();
const _up = new THREE.Vector3(0, 1, 0);

function buildChunk(chunk: { cx: number; cz: number; cells: { q: number; r: number }[] }, out: import('../../core/chunks').ChunkBuilder, ctx: CoreContext) {
  if (!protos || ctx.params.get('nature') === 'off') return;
  const t0 = performance.now();
  // pure plan, cached (streaming may have prefetched it in idle time → this build is merge-only)
  const plan = planFor(ctx, chunk.cx, chunk.cz);
  if (!plan) return;
  const t1 = performance.now();
  stats.planMs += t1 - t0;
  for(const it of plan.items){_m.compose(_p.set(it.x,it.y,it.z),_q.setFromAxisAngle(_up,it.rot),_s.setScalar(it.s));out.record(it.proto.id,_m,it.proto.kind);}
  for(const it of plan.grass){_m.compose(_p.set(it.x,it.y,it.z),_q.setFromAxisAngle(_up,it.rot),_s.setScalar(it.s));out.record(it.id,_m,'grass');}
  const detail: THREE.Object3D[] = [];
  const near: THREE.Object3D[] = [];
  const far: THREE.Object3D[] = [];
  const mk = (list: typeof plan.items, isFar: boolean, name: string, into: THREE.Object3D[] | null, cast = true) => {
    for (const { material, geometry } of mergePlacements(list, true, isFar)) {
      const mesh = new THREE.Mesh(geometry, material);
      mesh.name = name;
      mesh.castShadow = cast;
      mesh.receiveShadow = true;
      mesh.matrixAutoUpdate = false;
      out.addObject(mesh);
      into?.push(mesh);
      if (!isFar) stats.tris += (geometry.index?.count ?? 0) / 3;
    }
  };
  const main = plan.items.filter((i) => !i.detail);
  mk(main, false, 'nature', near);
  // far LOD (B-pines, broad, bare, single pines vertex-clustered); only built when it differs
  if (main.some((i) => i.proto.far)) mk(main, true, 'nature-far', far);
  else near.length = 0;
  // near detail: pieces under ~0.6 m (small bushes, pebbles, stumps) cast no shadow (shadow-pass cost; AO grounds them)
  const smallShadow = ctx.params.get('natsmallshadow') === '1';
  const small = (i: (typeof plan.items)[number]) => !smallShadow && i.proto.height * i.s < 0.6;
  mk(plan.items.filter((i) => i.detail && !small(i)), false, 'nature-detail', detail);
  mk(plan.items.filter((i) => i.detail && small(i)), false, 'nature-detail-small', detail, false);
  stats.mergeMs += performance.now() - t1;
  // grass: own InstancedMesh per tuft asset (near-only detail; shared asset geometry, instance buffers die with the chunk)
  if (ctx.params.get('natgrass') !== '0') {
    const byId = new Map<string, typeof plan.grass>();
    for (const g of plan.grass) {
      let l = byId.get(g.id);
      if (!l) byId.set(g.id, (l = []));
      l.push(g);
    }
    for (const [id, list] of byId) {
      const a = ctx.assets.get(id);
      if (!a) continue;
      for (const part of a.parts) {
        const im = new THREE.InstancedMesh(part.geometry, windMaterial(part.material, true), list.length);
        im.name = 'nature-grass';
        im.userData.sharedGeometry = true;
        list.forEach((g, i) => {
          _q.setFromAxisAngle(_up, g.rot);
          _m.compose(_p.set(g.x, g.y, g.z), _q, _s.set(g.s, g.s, g.s)).multiply(part.matrix);
          im.setMatrixAt(i, _m);
        });
        im.instanceMatrix.needsUpdate = true;
        im.castShadow = false;
        im.receiveShadow = true;
        im.computeBoundingSphere();
        out.addObject(im);
        detail.push(im);
      }
    }
  }
  const ctr = ctx.chunks.chunkCenter(chunk.cx, chunk.cz);
  canopy.set(chunk.cx + ',' + chunk.cz, plan.crowns);
  details.set(chunk.cx + ',' + chunk.cz, { x: ctr.x, z: ctr.z, objs: detail, vis: true, near, far, nearVis: null, cast: null });
  const R = ctx.rapier;
  for (const c of plan.colliders) {
    if (c.type === 'cyl') out.addCollider(R.ColliderDesc.cylinder(c.halfH, c.r).setTranslation(c.x, c.y, c.z).setCollisionGroups(WORLD_GROUPS));
    else if (c.type === 'cap') out.addCollider(R.ColliderDesc.capsule(c.halfH, c.r).setTranslation(c.x, c.y, c.z).setCollisionGroups(WORLD_GROUPS));
    else {
      const d = R.ColliderDesc.convexHull(c.points);
      if (d) out.addCollider(d.setCollisionGroups(WORLD_GROUPS));
    }
  }
  const ms = performance.now() - t0;
  stats.chunks++;
  stats.ms += ms;
  stats.maxMs = Math.max(stats.maxMs, ms);
  stats.trees += plan.counts.trees;
  stats.bushes += plan.counts.bushes;
  stats.rocks += plan.counts.rocks;
  stats.grass += plan.counts.grass;
  stats.colliders += plan.colliders.length;
}

// ------------------------------------------------------------------ preset search (deterministic, near the origin)
const planCache = new Map<string, Plan>();
const PLAN_CACHE = 128;
/** Pure plan of a chunk (cached) — presets use it to find spots between trunks before the chunk is built. */
function planFor(ctx: CoreContext, cx: number, cz: number): Plan | null {
  const k = cx + ',' + cz;
  const p = planCache.get(k);
  if (p) return p;
  return prefetchStep(ctx, cx, cz, Infinity) ? planCache.get(k)! : null;
}

/** Jobs in progress (resumable planning, streaming idle time). */
const jobs = new Map<string, PlanJob>();
let maxStepMs = 0;

/** Advance the plan of chunk (cx, cz) for at most ~budgetMs; true once it is complete and cached. */
function prefetchStep(ctx: CoreContext, cx: number, cz: number, budgetMs = 3): boolean {
  if (!protos) return false;
  const k = cx + ',' + cz;
  if (planCache.has(k)) return true;
  let job = jobs.get(k);
  if (!job) {
    job = new PlanJob({ seed: ctx.world.seed, cell: (q, r) => ctx.world.cell(q, r), heightAt: (x, z) => ctx.world.heightAt(x, z), meadow: ctx.params.get('natmeadow') !== '0' }, protos, cx, cz, [...chunkCells(cx, cz)]);
    jobs.set(k, job);
    if (jobs.size > 32) jobs.delete(jobs.keys().next().value!); // abandoned jobs (streaming moved on)
  }
  const t0 = performance.now();
  const done = job.step(budgetMs);
  if (budgetMs !== Infinity) maxStepMs = Math.max(maxStepMs, performance.now() - t0);
  if (!done) return false;
  jobs.delete(k);
  // bounded cache, oldest entry evicted first (Map keeps insertion order)
  while (planCache.size >= PLAN_CACHE) planCache.delete(planCache.keys().next().value!);
  planCache.set(k, job.plan);
  stats.planned++;
  return true;
}

/** Trees (x, z, clearance radius) around a point. */
function treesNear(ctx: CoreContext, x: number, z: number): [number, number, number, number][] {
  const h = worldToHex(x, z);
  const { cx, cz } = hexToChunk(h.q, h.r);
  const out: [number, number, number, number][] = [];
  for (let dz = -1; dz <= 1; dz++)
    for (let dx = -1; dx <= 1; dx++) {
      const p = planFor(ctx, cx + dx, cz + dz);
      if (!p) continue;
      for (const it of p.items) {
        const k = it.proto.kind;
        if (k === 'pine' || k === 'broad' || k === 'bare') out.push([it.x, it.z, Math.max(0.7, it.proto.canopyR * it.s * 0.85), it.y + it.proto.height * it.s]);
        else if (k === 'bush' || k === 'rock') out.push([it.x, it.z, it.proto.footR * it.s, it.y + it.proto.height * it.s]);
      }
    }
  return out;
}

function spiral(ctx: CoreContext, pred: (c: Readonly<CellData>) => boolean, maxR = 45, cq = 0, cr = 0): Readonly<CellData> | null {
  for (let rad = 0; rad <= maxR; rad++) {
    if (rad === 0) {
      const c = ctx.world.cell(cq, cr);
      if (pred(c)) return c;
      continue;
    }
    let q = cq - rad, r = cr + rad;
    for (let d = 0; d < 6; d++)
      for (let i = 0; i < rad; i++) {
        const c = ctx.world.cell(q, r);
        if (pred(c)) return c;
        q += DIRS[d][0];
        r += DIRS[d][1];
      }
  }
  return null;
}

const nb = (ctx: CoreContext, c: Readonly<CellData>, d: number) => ctx.world.cell(c.q + DIRS[d][0], c.r + DIRS[d][1]);
const yawOf = (vx: number, vz: number) => (Math.atan2(vx, vz) * 180) / Math.PI;
const groundY = (ctx: CoreContext, c: Readonly<CellData>) => {
  const p = hexToWorld(c.q, c.r);
  return ctx.world.heightAt(p.x, p.z);
};

/**
 * Orbit view whose sight line to the target is not blocked by terrain: tries yaw0, then ±30°, ±60° … and returns the
 * first one whose camera→target segment stays above the ground (deterministic).
 */
function clearView(ctx: CoreContext, target: [number, number, number], yaw0: number, pitch: number, dist: number): CameraView {
  const tries = [0, 30, -30, 60, -60, 90, -90, 120, -120, 150, -150, 180];
  const variants: [number, number][] = [[pitch, dist], [pitch + 10, dist * 1.3], [pitch + 20, dist * 1.6]];
  for (const [pt, ds] of variants)
  for (const dy of tries) {
    const v = orbitToView({ target, yaw: yaw0 + dy, pitch: pt, dist: ds });
    let ok = true;
    // nothing of ours in the first 35 % of the sight line (camera end): no crown filling the frame
    const trees = treesNear(ctx, v.position[0], v.position[2]);
    for (let t = 0; t < 0.5 && ok; t += 0.04) {
      const x = v.position[0] + (target[0] - v.position[0]) * t;
      const y = v.position[1] + (target[1] - v.position[1]) * t;
      const z = v.position[2] + (target[2] - v.position[2]) * t;
      for (const [tx, tz, r, top] of trees) if (y < top + 1 && (tx - x) ** 2 + (tz - z) ** 2 < (r / 0.85 + 0.8) ** 2) { ok = false; break; }
    }
    for (let t = 0.04; t < 0.95 && ok; t += 0.04) {
      const x = v.position[0] + (target[0] - v.position[0]) * t;
      const y = v.position[1] + (target[1] - v.position[1]) * t;
      const z = v.position[2] + (target[2] - v.position[2]) * t;
      if (ctx.world.heightAt(x, z) > y - 0.6) ok = false;
    }
    if (ok) return v;
  }
  return orbitToView({ target, yaw: yaw0, pitch: pitch + 20, dist });
}

/** Meadow cell M bordering a forest F (direction d) that continues behind F. */
function findEdge(ctx: CoreContext): { m: Readonly<CellData>; d: number } | null {
  let dir = 0;
  const m = spiral(ctx, (c) => {
    if (blocked(c) || c.forest > 0 || c.slope) return false;
    for (let d = 0; d < 6; d++) {
      const f = nb(ctx, c, d);
      if (f.forest < 0.6 || f.level !== c.level) continue;
      const f2 = ctx.world.cell(f.q + DIRS[d][0], f.r + DIRS[d][1]);
      const back = nb(ctx, c, (d + 3) % 6);
      if (f2.forest >= 0.6 && back.forest === 0 && !back.water && back.level <= c.level) { dir = d; return true; }
    }
    return false;
  });
  return m ? { m, d: dir } : null;
}

const presets: Record<string, (ctx: CoreContext) => CameraView> = {
  forest_edge(ctx) {
    const e = findEdge(ctx);
    if (!e) return presets.overview(ctx);
    const p = hexToWorld(e.m.q, e.m.r);
    const v = edgeVector(e.d);
    // look from the meadow toward the forest wall, 3/4 view
    const tx = p.x + v.x * 9, tz = p.z + v.z * 9;
    const a = Math.atan2(-v.z, -v.x) + 0.45;
    return clearView(ctx, [tx, groundY(ctx, e.m) + 3, tz], yawOf(Math.cos(a), Math.sin(a)), 12, 34);
  },
  figure(ctx) {
    // the showcase Knight (1.9 m) in front of the forest edge, game-camera distance: scale check
    const e = findEdge(ctx);
    if (!e) return presets.forest_edge(ctx);
    const p = hexToWorld(e.m.q, e.m.r);
    const v = edgeVector(e.d);
    const fd = figureDist(ctx, p.x, p.z, v.x, v.z);
    const x = p.x + v.x * fd, z = p.z + v.z * fd;
    return orbitToView({ target: [x + v.x * 2, ctx.world.heightAt(x, z) + 2.2, z + v.z * 2], yaw: yawOf(-v.x, -v.z) + 35, pitch: 10, dist: 13 });
  },
  forest_inside(ctx) {
    const c = spiral(ctx, (c) => {
      if (c.forest < 0.85 || c.slope) return false;
      for (let d = 0; d < 6; d++) {
        const n = nb(ctx, c, d);
        if (n.forest < 0.75 || n.level !== c.level) return false;
      }
      return true;
    });
    if (!c) return presets.forest_edge(ctx);
    const p = hexToWorld(c.q, c.r);
    // camera between the trunks at head height: the first (target, direction) whose 6.5 m sight line stays clear of
    // every crown, scanned on a fixed grid around the core cell → deterministic
    const trees = treesNear(ctx, p.x, p.z);
    const clear = (x: number, z: number) => trees.every(([tx, tz, r]) => (tx - x) ** 2 + (tz - z) ** 2 > r * r);
    const DIST = 6.5;
    let best = null as { x: number; z: number; yaw: number; score: number } | null;
    for (let gz = -6; gz <= 6 && !(best && best.score >= 1); gz += 1.5)
      for (let gx = -6; gx <= 6; gx += 1.5) {
        const tx = p.x + gx, tz = p.z + gz;
        if (!clear(tx, tz)) continue;
        for (let a = 0; a < 12; a++) {
          const yaw = (a * 30 + 15) * (Math.PI / 180);
          let ok = 0;
          for (let s = 0.5; s <= DIST + 0.6; s += 0.5) if (clear(tx + Math.sin(yaw) * s, tz + Math.cos(yaw) * s)) ok++; else break;
          const score = ok / ((DIST + 0.6) / 0.5);
          if (!best || score > best.score) best = { x: tx, z: tz, yaw, score };
        }
        if (best && best.score >= 1) break;
      }
    const t = best ?? { x: p.x, z: p.z, yaw: 0.6 };
    const y = ctx.world.heightAt(t.x, t.z);
    return orbitToView({ target: [t.x, y + 1.7, t.z], yaw: (t.yaw * 180) / Math.PI, pitch: 7, dist: DIST });
  },
  mid(ctx) {
    // mid distance (~60 m) over a forest core: the densest view (perf check)
    const c = spiral(ctx, (c) => c.tags.includes(NTAG.core));
    if (!c) return presets.forest_edge(ctx);
    const p = hexToWorld(c.q, c.r);
    return clearView(ctx, [p.x, groundY(ctx, c), p.z], 200, 28, 60);
  },
  cliff(ctx) {
    // forest on a cliff lip, seen from the lower level (no trunk may overhang the drop)
    let dir = 0;
    const c = spiral(ctx, (c) => {
      if (c.forest < 0.5 || c.slope) return false;
      for (let d = 0; d < 6; d++) {
        const n = nb(ctx, c, d);
        if (!n.water && !n.slope && n.level < c.level && !blocked(n) && n.forest === 0) { dir = d; return true; }
      }
      return false;
    });
    if (!c) return presets.forest_edge(ctx);
    const p = hexToWorld(c.q, c.r);
    const v = edgeVector(dir);
    const n = nb(ctx, c, dir);
    const tx = p.x + v.x * 7.5, tz = p.z + v.z * 7.5;
    return clearView(ctx, [tx, (groundY(ctx, c) + groundY(ctx, n)) / 2, tz], yawOf(v.x, v.z) + 25, 14, 24);
  },
  ramp(ctx) {
    // trees around a ramp: trunks on sloped ground
    const c = spiral(ctx, (c) => {
      if (!c.slope || blocked(c)) return false;
      for (let d = 0; d < 6; d++) if (nb(ctx, c, d).forest > 0.4) return true;
      return c.forest > 0.2;
    });
    if (!c) return presets.forest_edge(ctx);
    const p = hexToWorld(c.q, c.r);
    const v = edgeVector((c.slope!.dir + 1) % 6);
    return clearView(ctx, [p.x, groundY(ctx, c) - 1, p.z], yawOf(v.x, v.z), 16, 22);
  },
  road(ctx) {
    // a road / river running past a forest: trees keep off the tiles
    const c = spiral(ctx, (c) => {
      if (!(c.roadMask || c.riverMask) || c.slope) return false;
      let f = 0;
      for (let d = 0; d < 6; d++) if (nb(ctx, c, d).forest > 0.5) f++;
      return f >= 2;
    }, 60);
    if (!c) return presets.forest_edge(ctx);
    const p = hexToWorld(c.q, c.r);
    return clearView(ctx, [p.x, groundY(ctx, c) + 1, p.z], 30, 24, 30);
  },
  copse(ctx) {
    const c = spiral(ctx, (c) => c.tags.includes(NTAG.copse));
    if (!c) return presets.forest_edge(ctx);
    const p = hexToWorld(c.q, c.r);
    return clearView(ctx, [p.x, groundY(ctx, c) + 2.5, p.z], 30, 18, 30);
  },
  lone(ctx) {
    const c = spiral(ctx, (c) => c.tags.includes(NTAG.lone));
    if (!c) return presets.copse(ctx);
    const p = hexToWorld(c.q, c.r);
    return clearView(ctx, [p.x, groundY(ctx, c) + 3, p.z], 210, 16, 26);
  },
  overview(ctx) {
    // the spot with the richest mix of forest and open land within ~35 cells of the origin
    let best = -1, bq = 0, br = 0;
    for (let cr = -32; cr <= 32; cr += 8)
      for (let cq = -32 - Math.floor(cr / 2); cq <= 32 - Math.floor(cr / 2); cq += 8) {
        let f = 0, n = 0, copse = 0;
        for (let r = cr - 10; r <= cr + 10; r += 2)
          for (let q = cq - 10; q <= cq + 10; q += 2) {
            const c = ctx.world.cell(q, r);
            n++;
            if (c.forest > 0.5) f++;
            if (c.tags.includes(NTAG.copse) || c.tags.includes(NTAG.lone)) copse++;
          }
        const frac = f / n;
        const score = (1 - Math.abs(frac - 0.4) * 2) + Math.min(0.2, copse / n) - Math.hypot(cq + cr / 2, cr) / 200;
        if (score > best) { best = score; bq = cq; br = cr; }
      }
    const p = hexToWorld(bq, br);
    return orbitToView({ target: [p.x, ctx.world.heightAt(p.x, p.z), p.z], yaw: 30, pitch: 40, dist: 170 });
  },
};

// ------------------------------------------------------------------ showcase-only scale figures (Knight, Idle_A)
const mixers: THREE.AnimationMixer[] = [];
async function placeFigures(ctx: CoreContext, spots: [number, number, number, number][]): Promise<void> {
  const a = ctx.assets;
  const url = a.url('char/Knight');
  const g = url ? await a.loadGltf(url) : null;
  if (!g) return;
  const au = a.url('anim/Rig_Medium_General');
  const ag = au ? await a.loadGltf(au) : null;
  const idle = ag?.animations.find((c) => c.name === 'Idle_A') ?? null;
  for (const [x, y, z, rot] of spots) {
    const o = skeletonClone(g.scene);
    o.scale.setScalar(a.scaleOf('char/Knight'));
    o.position.set(x, y, z);
    o.rotation.y = rot;
    o.traverse((m) => {
      if ((m as THREE.Mesh).isMesh) { m.castShadow = true; m.receiveShadow = true; m.frustumCulled = false; }
    });
    ctx.scene.add(o);
    if (idle) {
      const mx = new THREE.AnimationMixer(o);
      mx.clipAction(idle).play();
      mixers.push(mx);
    }
  }
}

/** Distance (m) from the meadow centre toward the forest where the figure stands clear of every crown. */
function figureDist(ctx: CoreContext, px: number, pz: number, vx: number, vz: number): number {
  const trees = treesNear(ctx, px + vx * 5, pz + vz * 5);
  for (let d = 5.5; d > 0; d -= 0.5) {
    const x = px + vx * d, z = pz + vz * d;
    if (trees.every(([tx, tz, r]) => (tx - x) ** 2 + (tz - z) ** 2 > (r + 0.4) ** 2)) return d;
  }
  return 0;
}

/** Figure spots: in front of the forest edge, and beside the nearest lone tree. */
function figureSpots(ctx: CoreContext): [number, number, number, number][] {
  const out: [number, number, number, number][] = [];
  const e = findEdge(ctx);
  if (e) {
    const p = hexToWorld(e.m.q, e.m.r);
    const v = edgeVector(e.d);
    const fd = figureDist(ctx, p.x, p.z, v.x, v.z);
    const x = p.x + v.x * fd, z = p.z + v.z * fd;
    out.push([x, ctx.world.heightAt(x, z), z, Math.atan2(-v.x, -v.z)]);
  }
  const c = spiral(ctx, (c) => c.tags.includes(NTAG.lone));
  if (c) {
    const h = hexToChunk(c.q, c.r);
    const plan = planFor(ctx, h.cx, h.cz);
    const ctr = hexToWorld(c.q, c.r);
    const t = plan?.items.filter((i) => i.proto.kind === 'pine' || i.proto.kind === 'broad').sort((a, b) => Math.hypot(a.x - ctr.x, a.z - ctr.z) - Math.hypot(b.x - ctr.x, b.z - ctr.z))[0];
    if (t) {
      const x = t.x + 2.6, z = t.z + 1.2;
      out.push([x, ctx.world.heightAt(x, z), z, 0.4]);
    }
  }
  return out;
}

// ------------------------------------------------------------------ module
const mod: GameModule = {
  id: 'nature',
  layer: { id: 'nature', stage: NATURE_STAGE, apply: applyNature },

  async init(ctx) {
    ctx.events.on('surface:changed',()=>{planCache.clear();jobs.clear();details.clear();});
    await ctx.assets.preload(ALL_IDS);
    protos = buildProtos(ctx.assets);
    if (ctx.params.has('natdetail')) DETAIL_R = Number(ctx.params.get('natdetail'));
    if (ctx.params.has('natfar')) FAR_R = Number(ctx.params.get('natfar'));
    if (ctx.params.has('natshadow')) DETAIL_SHADOW_R = Number(ctx.params.get('natshadow'));
    ctx.events.on('chunk:unloaded', ({ cx, cz }) => {
      details.delete(cx + ',' + cz);
      canopy.remove(cx + ',' + cz);
    });
    ctx.services.set('nature', {
      stats: () => ({ ...stats, avgMs: stats.chunks ? +(stats.ms / stats.chunks).toFixed(2) : 0 }),
      protos: () => protos,
      /** Compute (and cache) a chunk's pure placement plan ahead of its build (streaming calls this in idle time). */
      prefetch: (cx: number, cz: number): void => void planFor(ctx, cx, cz),
      /** Resumable prefetch: plan for at most ~budgetMs; true once the chunk's plan is complete and cached. */
      prefetchStep: (cx: number, cz: number, budgetMs = 3): boolean => prefetchStep(ctx, cx, cz, budgetMs),
      /** Debug: longest single prefetchStep call so far (ms). */
      maxStepMs: () => maxStepMs,
      /** Lowest crown-base world y of trees whose crowns overlap the disk (x, z, radius), or null under open sky. */
      canopyBaseAt: (x: number, z: number, radius = 3): number | null => canopyBaseAt(canopy, x, z, radius),
      /** Local canopy cover 0..1 around (x, z) (19 samples out to 6 m). */
      inForest: (x: number, z: number): number => inForest(canopy, x, z),
      /** Debug: the pure placement plan of a chunk. */
      plan: (cx: number, cz: number) => planFor(ctx, cx, cz),
      /** Debug: triangle/count breakdown of one chunk's plan by piece kind. */
      breakdown: (cx: number, cz: number) => {
        const p = planFor(ctx, cx, cz);
        if (!p) return null;
        const o: Record<string, { n: number; tris: number }> = {};
        for (const it of p.items) {
          const k = it.proto.kind + (it.proto.id.includes('trees_B') ? 'B' : '') + (it.detail ? '*' : '');
          const e = (o[k] ??= { n: 0, tris: 0 });
          e.n++;
          for (const part of it.proto.parts) e.tris += part.idx.length / 3;
        }
        const gt = p.grass.reduce((a, g) => a + (ctx.assets.get(g.id)?.parts.reduce((b, q) => b + (q.geometry.index?.count ?? q.geometry.attributes.position.count) / 3, 0) ?? 0), 0);
        o.grass = { n: p.grass.length, tris: gt };
        return o;
      },
      /** Near-detail radius (m): bushes, small rocks and grass are hidden beyond it (streaming may tune it). */
      get detailRadius() { return DETAIL_R; },
      set detailRadius(v: number) { DETAIL_R = v; },
      /** Far-LOD radius (m): heavy trees of chunks beyond it use their vertex-clustered version. */
      get farRadius() { return FAR_R; },
      set farRadius(v: number) { FAR_R = v; },
    });
  },

  buildChunk(chunk, out, ctx) {
    buildChunk(chunk, out, ctx);
  },

  update(dt, ctx) {
    natUniforms.uWindTime.value = ctx.time;
    for (const m of mixers) m.update(dt);
    const cam = ctx.camera.position;
    natUniforms.uNatCam.value.copy(cam);
    const player = ctx.services.get<{ position?: THREE.Vector3 }>('player');
    if (player?.position && !ctx.getCameraOverride()) {
      natUniforms.uNatPlayer.value.copy(player.position);
      natUniforms.uNatPlayerOn.value = 1;
    } else natUniforms.uNatPlayerOn.value = 0;
    for (const d of details.values()) {
      const dist = Math.hypot(d.x - cam.x, d.z - cam.z);
      const vis = dist < DETAIL_R + (d.vis ? 20 : 0);
      if (vis !== d.vis) {
        d.vis = vis;
        for (const o of d.objs) o.visible = vis;
      }
      const fd = Math.hypot(d.x - ctx.chunks.focus.x, d.z - ctx.chunks.focus.z);
      const cast = fd < DETAIL_SHADOW_R + (d.cast ? 20 : 0);
      if (cast !== d.cast) {
        d.cast = cast;
        for (const o of d.objs) if (o.name === 'nature-detail') o.castShadow = cast;
      }
      if (d.far.length) {
        const nv = dist < FAR_R + (d.nearVis ? 20 : 0);
        if (nv !== d.nearVis) {
          d.nearVis = nv;
          for (const o of d.near) o.visible = nv;
          for (const o of d.far) o.visible = !nv;
        }
      }
    }
  },

  showcaseUses: ['terrain', 'roads'],
  showcase(ctx) {
    const v = presets.forest_edge(ctx);
    ctx.camera.position.set(...v.position);
    ctx.camera.lookAt(new THREE.Vector3(...v.target));
    ctx.chunks.focus.set(v.target[0], 0, v.target[2]);
    if (ctx.params.get('figure') !== '0') return placeFigures(ctx, figureSpots(ctx));
  },

  cameraPresets: presets,
};

export default mod;
