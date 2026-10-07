import { objectsFor, instanceId } from './objects';
// Chunk streaming + per-chunk geometry merging. See ARCHITECTURE.md §5.
import * as THREE from 'three';
import type RAPIER from '@dimforge/rapier3d-compat';
import type { AssetLibraryApi, ChunkInfo, CoreContext, GameModule } from './types';
import { chunkCells, chunkKey, hexToWorld, worldToHex, hexToChunk } from './hex';
import { CHUNK, HEX_WIDTH } from './units';

export interface AddOptions {
  castShadow?: boolean;
  receiveShadow?: boolean;
  /** Override material for every part (e.g. water shader). */
  material?: THREE.Material;
}

interface MergeBucket {
  material: THREE.Material;
  cast: boolean;
  receive: boolean;
  items: { geometry: THREE.BufferGeometry; matrix: THREE.Matrix4 }[];
}

const _m = new THREE.Matrix4();
const _n = new THREE.Matrix3();
const _v = new THREE.Vector3();

/** Collects one chunk's content from all modules, then merges per material. */
export class ChunkBuilder {
  private buckets = new Map<string, MergeBucket>();
  private instanced = new Map<string, { assetId: string; matrices: THREE.Matrix4[]; opts: AddOptions }>();
  readonly objects: THREE.Object3D[] = [];
  readonly colliders: RAPIER.ColliderDesc[] = [];
  /** Module currently building (for diagnostics). */
  currentModule = '';
  stats = { added: 0, missing: 0 };

  constructor(readonly chunk: ChunkInfo, private assets: AssetLibraryApi, readonly seed=0) {}
  readonly semanticIds:string[]=[];
  record(assetId:string,matrix:THREE.Matrix4,role=this.currentModule) {
    const chunk=`${this.chunk.cx},${this.chunk.cz}`,original=matrix.toArray(),id=instanceId(this.seed,this.currentModule,assetId,chunk,original);
    const record=objectsFor(this.seed).register({id,source:assetId,chunk,role,matrix:original,origin:'procedural',stateRef:id});
    this.semanticIds.push(id);return record;
  }

  /** Add a static asset instance (merged into the chunk mesh). Returns false if the asset is missing. */
  add(assetId: string, matrix: THREE.Matrix4, opts: AddOptions = {}): boolean {
    const a = this.assets.get(assetId);
    if (!a) {
      this.stats.missing++;
      return false;
    }
    this.record(assetId,matrix);
    const cast = opts.castShadow ?? true;
    const receive = opts.receiveShadow ?? true;
    for (const p of a.parts) {
      const mat = opts.material ?? p.material;
      const key = mat.uuid + (cast ? 'c' : '') + (receive ? 'r' : '');
      let b = this.buckets.get(key);
      if (!b) this.buckets.set(key, (b = { material: mat, cast, receive, items: [] }));
      b.items.push({ geometry: p.geometry, matrix: new THREE.Matrix4().multiplyMatrices(matrix, p.matrix) });
    }
    this.stats.added++;
    return true;
  }

  /** Add many instances of one small asset as InstancedMesh (grass, pebbles). */
  addInstanced(assetId: string, matrix: THREE.Matrix4, opts: AddOptions = {}): boolean {
    if (!this.assets.get(assetId)) {
      this.stats.missing++;
      return false;
    }
    this.record(assetId,matrix);
    const key = assetId + '|' + (opts.material?.uuid ?? '');
    let e = this.instanced.get(key);
    if (!e) this.instanced.set(key, (e = { assetId, matrices: [], opts }));
    e.matrices.push(matrix.clone());
    return true;
  }

  /** Add an arbitrary object (owned by the chunk; its geometries are disposed on unload unless userData.shared). */
  addObject(obj: THREE.Object3D): void {
    this.objects.push(obj);
  }

  addCollider(desc: RAPIER.ColliderDesc): void {
    this.colliders.push(desc);
  }

  /** Same result as finish(), one merge bucket / instanced set per step (streaming spreads the merge over frames). */
  *finishSteps(): Generator<void, THREE.Group, void> {
    const group = new THREE.Group();
    group.userData.semanticIds=this.semanticIds;
    group.name = `chunk ${this.chunk.cx},${this.chunk.cz}`;
    for (const b of this.buckets.values()) {
      const geo = mergeTransformed(b.items);
      if (geo) {
        const mesh = new THREE.Mesh(geo, b.material);
        mesh.castShadow = b.cast;
        mesh.receiveShadow = b.receive;
        mesh.matrixAutoUpdate = false;
        group.add(mesh);
      }
      yield;
    }
    for (const e of this.instanced.values()) {
      const a = this.assets.get(e.assetId)!;
      for (const p of a.parts) {
        const im = new THREE.InstancedMesh(p.geometry, e.opts.material ?? p.material, e.matrices.length);
        im.userData.sharedGeometry = true;
        e.matrices.forEach((m, i) => im.setMatrixAt(i, _m.multiplyMatrices(m, p.matrix)));
        im.instanceMatrix.needsUpdate = true;
        im.castShadow = e.opts.castShadow ?? false;
        im.receiveShadow = e.opts.receiveShadow ?? true;
        im.computeBoundingSphere();
        group.add(im);
      }
      yield;
    }
    for (const o of this.objects) group.add(o);
    group.updateMatrixWorld(true);
    return group;
  }

  /** Build the final scene graph for this chunk. */
  finish(): THREE.Group {
    const it = this.finishSteps();
    let r = it.next();
    while (!r.done) r = it.next();
    return r.value;
  }
}

/** Merge geometries with world matrices into one indexed BufferGeometry (position, normal, uv, color if all have it). */
function mergeTransformed(items: { geometry: THREE.BufferGeometry; matrix: THREE.Matrix4 }[]): THREE.BufferGeometry | null {
  if (!items.length) return null;
  const hasUv = items.every((i) => i.geometry.attributes.uv);
  const hasColor = items.every((i) => i.geometry.attributes.color);
  let vCount = 0, iCount = 0;
  for (const it of items) {
    vCount += it.geometry.attributes.position.count;
    iCount += it.geometry.index ? it.geometry.index.count : it.geometry.attributes.position.count;
  }
  const pos = new Float32Array(vCount * 3);
  const nor = new Float32Array(vCount * 3);
  const uv = hasUv ? new Float32Array(vCount * 2) : null;
  const col = hasColor ? new Float32Array(vCount * 3) : null;
  const idx = vCount > 65535 ? new Uint32Array(iCount) : new Uint16Array(iCount);
  let vo = 0, io = 0;
  for (const it of items) {
    const g = it.geometry;
    const P = g.attributes.position, N = g.attributes.normal;
    _n.getNormalMatrix(it.matrix);
    const flip = it.matrix.determinant() < 0;
    for (let i = 0; i < P.count; i++) {
      _v.fromBufferAttribute(P, i).applyMatrix4(it.matrix);
      pos[(vo + i) * 3] = _v.x; pos[(vo + i) * 3 + 1] = _v.y; pos[(vo + i) * 3 + 2] = _v.z;
      if (N) {
        _v.fromBufferAttribute(N, i).applyMatrix3(_n).normalize();
        nor[(vo + i) * 3] = _v.x; nor[(vo + i) * 3 + 1] = _v.y; nor[(vo + i) * 3 + 2] = _v.z;
      }
      if (uv) { uv[(vo + i) * 2] = g.attributes.uv.getX(i); uv[(vo + i) * 2 + 1] = g.attributes.uv.getY(i); }
      if (col) {
        const C = g.attributes.color;
        col[(vo + i) * 3] = C.getX(i); col[(vo + i) * 3 + 1] = C.getY(i); col[(vo + i) * 3 + 2] = C.getZ(i);
      }
    }
    if (g.index) {
      const I = g.index;
      for (let i = 0; i < I.count; i += 3) {
        const a = I.getX(i) + vo, b = I.getX(i + 1) + vo, c = I.getX(i + 2) + vo;
        idx[io++] = a; idx[io++] = flip ? c : b; idx[io++] = flip ? b : c;
      }
    } else {
      for (let i = 0; i < P.count; i += 3) {
        idx[io++] = vo + i; idx[io++] = vo + (flip ? i + 2 : i + 1); idx[io++] = vo + (flip ? i + 1 : i + 2);
      }
    }
    vo += P.count;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
  if (uv) geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  if (col) geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  geo.setIndex(new THREE.BufferAttribute(idx, 1));
  geo.computeBoundingSphere();
  geo.computeBoundingBox();
  return geo;
}

export interface LoadedChunk {
  cx: number;
  cz: number;
  group: THREE.Group;
  body: RAPIER.RigidBody | null;
  dist: number;
}

export interface ChunkConfig {
  /** Load radius in metres around the focus. */
  loadRadius: number;
  /** Extra metres before unloading (hysteresis). */
  unloadMargin: number;
  /** Max milliseconds of chunk building per frame (at least one chunk is always built if any is due within `urgentRadius`). */
  budgetMs: number;
  /** Chunks closer than this are built immediately regardless of budget. */
  urgentRadius: number;
}

/** Owns chunk lifecycle. Streaming module tunes it via configure(). */
export class ChunkManager {
  readonly loaded = new Map<string, LoadedChunk>();
  readonly root = new THREE.Group();
  config: ChunkConfig = { loadRadius: 190, unloadMargin: 40, budgetMs: 6, urgentRadius: 70 };
  focus = new THREE.Vector3();
  modules: GameModule[] = [];
  private ctx!: CoreContext;
  /** Optional filter: if set, only these chunk keys are ever built (showcase staging). */
  onlyChunks: Set<string> | null = null;
  /** Restrict which modules contribute (showcase). null = all. */
  moduleFilter: Set<string> | null = null;
  lastBuildMs = 0;
  builtThisSession = 0;
  degraded = new Map<string, number>();

  constructor() {
    this.root.name = 'chunks';
  }

  attach(ctx: CoreContext, modules: GameModule[]): void {
    this.ctx = ctx;
    this.modules = modules;
    ctx.scene.add(this.root);
  }

  configure(c: Partial<ChunkConfig>): void {
    Object.assign(this.config, c);
  }

  /** World xz centre of a chunk. */
  chunkCenter(cx: number, cz: number): { x: number; z: number } {
    const c = CHUNK / 2 - 0.5;
    return hexToWorld(cx * CHUNK + c, cz * CHUNK + c);
  }

  private chunkDist(cx: number, cz: number): number {
    const c = this.chunkCenter(cx, cz);
    return Math.hypot(c.x - this.focus.x, c.z - this.focus.z);
  }

  /** Chunk coords that should be loaded around the focus, nearest first. */
  wanted(radius = this.config.loadRadius): { cx: number; cz: number; d: number }[] {
    const h = worldToHex(this.focus.x, this.focus.z);
    const { cx, cz } = hexToChunk(h.q, h.r);
    const span = Math.ceil(radius / (CHUNK * HEX_WIDTH * 0.75)) + 2;
    const out: { cx: number; cz: number; d: number }[] = [];
    for (let dz = -span; dz <= span; dz++)
      for (let dx = -span; dx <= span; dx++) {
        const x = cx + dx, z = cz + dz;
        if (this.onlyChunks && !this.onlyChunks.has(chunkKey(x, z))) continue;
        const d = this.chunkDist(x, z);
        // chunk "radius" ~ half diagonal of the parallelogram
        if (d - CHUNK * HEX_WIDTH * 0.6 <= radius) out.push({ cx: x, cz: z, d });
      }
    out.sort((a, b) => a.d - b.d);
    return out;
  }

  /** Build every wanted chunk now (used at spawn / showcase). */
  buildAllNow(radius = this.config.loadRadius): void {
    for (const w of this.wanted(radius)) if (!this.loaded.has(chunkKey(w.cx, w.cz))) this.build(w.cx, w.cz);
  }

  get pending(): number {
    let n = 0;
    for (const w of this.wanted()) if (!this.loaded.has(chunkKey(w.cx, w.cz))) n++;
    return n;
  }

  update(): void {
    const t0 = performance.now();
    const want = this.wanted();
    const wantKeys = new Set(want.map((w) => chunkKey(w.cx, w.cz)));
    // unload far chunks
    for (const [k, c] of this.loaded) {
      if (wantKeys.has(k)) continue;
      if (this.chunkDist(c.cx, c.cz) - CHUNK * HEX_WIDTH * 0.6 > this.config.loadRadius + this.config.unloadMargin) this.unload(k);
    }
    // build nearest missing, within budget
    for (const w of want) {
      const k = chunkKey(w.cx, w.cz);
      if (this.loaded.has(k)) continue;
      const elapsed = performance.now() - t0;
      if (elapsed > this.config.budgetMs && w.d > this.config.urgentRadius) break;
      this.build(w.cx, w.cz);
    }
    this.lastBuildMs = performance.now() - t0;
  }

  /** When set, build() delegates to it (streaming: same result, colliders managed by distance). */
  externalBuild: ((cx: number, cz: number) => void) | null = null;

  /** Register a chunk built elsewhere (streaming's time-sliced build job). */
  adopt(cx: number, cz: number, group: THREE.Group, body: RAPIER.RigidBody | null): void {
    const k = chunkKey(cx, cz);
    if (this.loaded.has(k)) return;
    this.root.add(group);
    this.loaded.set(k, { cx, cz, group, body, dist: 0 });
    this.builtThisSession++;
    this.ctx.events.emit('chunk:loaded', { cx, cz });
  }

  build(cx: number, cz: number): void {
    const k = chunkKey(cx, cz);
    if (this.loaded.has(k)) return;
    if (this.externalBuild) {
      this.externalBuild(cx, cz);
      return;
    }
    const info: ChunkInfo = { cx, cz, cells: [...chunkCells(cx, cz)] };
    const out = new ChunkBuilder(info, this.ctx.assets,this.ctx.world.seed);
    for (const m of this.modules) {
      if (!m.buildChunk) continue;
      if (this.moduleFilter && !this.moduleFilter.has(m.id)) continue;
      out.currentModule = m.id;
      try {
        m.buildChunk(info, out, this.ctx);
      } catch (e) {
        this.degraded.set(m.id, (this.degraded.get(m.id) ?? 0) + 1);
        if ((this.degraded.get(m.id) ?? 0) <= 3) console.warn(`[module:${m.id}] buildChunk(${cx},${cz}) threw`, e);
        this.ctx.events.emit('module:error', { id: m.id, error: e });
      }
    }
    const group = out.finish();
    this.root.add(group);
    let body: RAPIER.RigidBody | null = null;
    if (out.colliders.length) {
      const R = this.ctx.rapier;
      body = this.ctx.physics.world.createRigidBody(R.RigidBodyDesc.fixed());
      for (const d of out.colliders) {
        try {
          this.ctx.physics.world.createCollider(d, body);
        } catch (e) {
          console.warn('[chunks] collider failed', e);
        }
      }
    }
    this.loaded.set(k, { cx, cz, group, body, dist: 0 });
    this.builtThisSession++;
    this.ctx.events.emit('chunk:loaded', { cx, cz });
  }

  unload(k: string): void {
    const c = this.loaded.get(k);
    if (!c) return;
    this.root.remove(c.group);
    c.group.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.geometry && !m.userData.sharedGeometry && !m.geometry.userData?.shared) m.geometry.dispose();
      if ((o as THREE.InstancedMesh).isInstancedMesh) (o as THREE.InstancedMesh).dispose();
    });
    if (c.body) this.ctx.physics.world.removeRigidBody(c.body);
    this.loaded.delete(k);
    objectsFor(this.ctx.world.seed).streamOut(k);
    this.ctx.events.emit('chunk:unloaded', { cx: c.cx, cz: c.cz });
  }

  /** Drop every chunk (used when module output changes in showcases). */
  clear(): void {
    for (const k of [...this.loaded.keys()]) this.unload(k);
  }
}
