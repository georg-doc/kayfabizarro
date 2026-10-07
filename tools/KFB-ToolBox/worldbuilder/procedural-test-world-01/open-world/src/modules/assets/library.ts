// AssetLibrary: loads KayKit glTFs by id (public/assets/manifest.json), bakes pack scale,
// and canonicalises materials so every asset of a pack shares one material (→ chunk merging stays cheap).
//
// Material policy (owned here; environment owns lights / fog / tone mapping):
//   - one shared atlas TEXTURE per file name (hexagons_medieval.png, forest_texture.png …): the first glTF that needs it
//     loads it, every other glTF awaits the same promise. This is the "warm one texture first" fix for the black-model
//     bug (parallel loads of one shared texture) and avoids hundreds of duplicate 1024² decodes.
//   - one canonical MATERIAL per (pack, material name, atlas file).
//   - matte KayKit look: metalness 0, roughness ROUGHNESS[pack], sRGB colour map, trilinear mipmaps, anisotropy 8.
import * as THREE from 'three';
import { GLTFLoader, type GLTF, type GLTFParser } from 'three/examples/jsm/loaders/GLTFLoader.js';
import type { AssetLibraryApi, AssetPart, StaticAsset } from '../../core/types';
import * as U from '../../core/units';

interface ManifestEntry { url: string; pack: string; scale: keyof typeof U }

/** Base roughness per pack (KayKit source files say 0.5–0.6, which reads glossy under a strong sun). */
export const ROUGHNESS: Record<string, number> = { hex: 0.85, forest: 0.9, builder: 0.85, char: 0.8, anim: 0.8 };
const ANISOTROPY = 8;

export class AssetLibrary implements AssetLibraryApi {
  private manifest: Record<string, ManifestEntry> = {};
  private statics = new Map<string, StaticAsset | null>();
  private loading = new Map<string, Promise<void>>();
  private gltfs = new Map<string, Promise<GLTF | null>>();
  private loader = new GLTFLoader();
  /** canonical material per (pack, material name, texture file) */
  private materials = new Map<string, THREE.Material>();
  private materialPack = new Map<THREE.Material, string>();
  /** shared atlas textures by file name */
  private sharedTex = new Map<string, Promise<THREE.Texture | null>>();
  /** Optional hook (environment/assets policy) to adjust canonical materials once. */
  materialHook: ((m: THREE.Material, pack: string) => void) | null = null;
  readonly missing = new Set<string>();
  private warned = new Set<string>();

  constructor(private base = import.meta.env.BASE_URL) {
    const lib = this;
    // Share atlas textures across all glTFs (see header).
    this.loader.register((parser: GLTFParser) => ({
      // typed loosely: three's plugin typings declare loadTexture as returning a non-null promise
      name: 'kfb_shared_atlas',
      loadTexture(textureIndex: number) {
        const json = parser.json as { textures: { source: number }[]; images: { uri?: string }[] };
        const src = json.textures[textureIndex]?.source;
        const uri = src != null ? json.images[src]?.uri : undefined;
        if (!uri || uri.startsWith('data:')) return null;
        const file = decodeURI(uri).split('/').pop()!;
        let p = lib.sharedTex.get(file);
        if (!p) {
          p = parser.loadTextureImage(textureIndex, src, parser.textureLoader).then((t: THREE.Texture | null) => {
            if (t) {
              t.colorSpace = THREE.SRGBColorSpace;
              t.anisotropy = ANISOTROPY;
              t.userData.sharedAtlas = file;
            }
            return t;
          });
          lib.sharedTex.set(file, p);
        }
        return p;
      },
    }) as any);
  }

  async init(): Promise<void> {
    try {
      const res = await fetch(this.base + 'assets/manifest.json');
      this.manifest = await res.json();
    } catch (e) {
      console.warn('[assets] manifest.json could not be loaded', e);
      this.manifest = {};
    }
  }

  ids(): string[] {
    return Object.keys(this.manifest);
  }

  has(id: string): boolean {
    const v = parseVariant(id);
    return v ? v.base in this.manifest : id in this.manifest;
  }

  scaleOf(id: string): number {
    const e = this.manifest[id];
    return e ? packScale(id, e) : 1;
  }

  get(id: string): StaticAsset | null {
    const s = this.statics.get(id);
    if (s !== undefined) return s;
    const v = parseVariant(id);
    if (!v) return null;
    const base = this.statics.get(v.base);
    if (!base) return null; // base not preloaded (yet)
    const syn = synthVariant(id, base, v);
    this.statics.set(id, syn);
    return syn;
  }

  async preload(ids: string[]): Promise<void> {
    try {
      // Warm one asset per pack first so the pack's atlas texture is decoded once before the parallel batch.
      const first = new Map<string, string>();
      for (const id of ids) {
        const pack = this.manifest[id]?.pack;
        if (pack && !first.has(pack) && !this.statics.has(id)) first.set(pack, id);
      }
      await Promise.all([...first.values()].map((id) => this.loadStatic(id)));
      await Promise.all(ids.map((id) => this.loadStatic(parseVariant(id)?.base ?? id)));
      for (const id of ids) if (parseVariant(id)) this.get(id); // synthesize variants now
    } catch (e) {
      console.warn('[assets] preload failed', e);
    }
  }

  private loadStatic(id: string): Promise<void> {
    if (this.statics.has(id)) return Promise.resolve();
    let p = this.loading.get(id);
    if (p) return p;
    p = (async () => {
      const e = this.manifest[id];
      if (!e) {
        this.missing.add(id);
        this.warnOnce(id, `[assets] unknown asset id ${id}`);
        this.statics.set(id, null);
        return;
      }
      const gltf = await this.loadGltf(e.url);
      if (!gltf) {
        this.statics.set(id, null);
        return;
      }
      try {
        this.statics.set(id, this.extract(id, gltf.scene, e.pack, packScale(id, e)));
      } catch (err) {
        this.warnOnce(id, `[assets] could not extract ${id}`, err);
        this.statics.set(id, null);
      }
    })();
    this.loading.set(id, p);
    return p;
  }

  private warnOnce(key: string, msg: string, extra?: unknown): void {
    if (this.warned.has(key)) return;
    this.warned.add(key);
    if (extra !== undefined) console.warn(msg, extra);
    else console.warn(msg);
  }

  private extract(id: string, root: THREE.Object3D, pack: string, scale: number): StaticAsset {
    const parts: AssetPart[] = [];
    const S = new THREE.Matrix4().makeScale(scale, scale, scale);
    root.updateMatrixWorld(true);
    const bounds = new THREE.Box3();
    root.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      const matrix = new THREE.Matrix4().multiplyMatrices(S, mesh.matrixWorld);
      const geo = id.startsWith('hex/tiles/') ? flatTopNormals(mesh.geometry) : mesh.geometry;
      // lake water: neighbouring hex_water tiles share exact edges → hairline cracks show as faint hex lines.
      // Grow the water tile 1 % in x/z so neighbours overlap (same flat colour, so the overlap is invisible).
      if (id === 'hex/tiles/base/hex_water') geo.scale(1.01, 1, 1.01);
      geo.userData.shared = true;
      if (mats.length === 1 || !geo.groups.length) {
        parts.push({ geometry: geo, material: this.canonical(mats[0], pack), matrix });
      } else {
        for (const g of geo.groups) {
          const sub = geo.clone();
          sub.setIndex(Array.from((geo.index!.array as ArrayLike<number>)).slice(g.start, g.start + g.count) as any);
          sub.clearGroups();
          sub.userData.shared = true;
          parts.push({ geometry: sub, material: this.canonical(mats[g.materialIndex ?? 0], pack), matrix });
        }
      }
      geo.computeBoundingBox();
      bounds.union(geo.boundingBox!.clone().applyMatrix4(matrix));
    });
    return { id, parts, bounds };
  }

  private canonical(m: THREE.Material, pack: string): THREE.Material {
    const std = m as THREE.MeshStandardMaterial;
    const src = (std.map?.userData.sharedAtlas as string | undefined) ?? (std.map?.name ?? '').split('/').pop() ?? '';
    const key = pack + '|' + m.name + '|' + src + '|' + (std.color?.getHexString?.() ?? '');
    let c = this.materials.get(key);
    if (!c) {
      c = m;
      applyPolicy(c, pack);
      this.materialHook?.(c, pack);
      this.materials.set(key, c);
      this.materialPack.set(c, pack);
    }
    return c;
  }

  /** All canonical materials (environment may tune them). */
  allMaterials(): THREE.Material[] {
    return [...this.materials.values()];
  }

  /** Unique canonical materials and atlas textures per pack (for verification logs). */
  materialStats(): { materials: Record<string, number>; textures: string[] } {
    const materials: Record<string, number> = {};
    for (const p of this.materialPack.values()) materials[p] = (materials[p] ?? 0) + 1;
    return { materials, textures: [...this.sharedTex.keys()] };
  }

  loadGltf(url: string): Promise<GLTF | null> {
    let p = this.gltfs.get(url);
    if (!p) {
      const pack = Object.values(this.manifest).find((e) => e.url === url)?.pack ?? url.split('/')[1] ?? '';
      p = this.loader
        .loadAsync(this.base + url)
        .then((g) => {
          // base material policy for skinned / animated loads too (characters keep their own material instances)
          g.scene.traverse((o) => {
            const mesh = o as THREE.Mesh;
            if (!mesh.isMesh) return;
            for (const mat of Array.isArray(mesh.material) ? mesh.material : [mesh.material]) applyPolicy(mat, pack);
          });
          return g;
        })
        .catch((e) => {
          this.warnOnce(url, `[assets] failed to load ${url}`, e);
          this.missing.add(url);
          return null;
        });
      this.gltfs.set(url, p);
    }
    return p;
  }

  /** URL of an asset id (for skinned/animated loads). */
  url(id: string): string | null {
    return this.manifest[id]?.url ?? null;
  }
}

// ---------------------------------------------------------------------------------------------------------------
// Load-time geometry fixes / synthesized variants (asset units, before pack scale).

/**
 * KayKit road/river tiles carry smoothed vertex normals on some flat top triangles (up to 23° off vertical, e.g.
 * hex_road_C/L, river_C, the ramp plateaus) → faint dark smudges on the grass. For every near-horizontal triangle
 * (face normal y > 0.97) the corner normals are set to the face normal. Positions/silhouette are untouched.
 */
function flatTopNormals(src: THREE.BufferGeometry): THREE.BufferGeometry {
  const g = src.index ? src.toNonIndexed() : src.clone();
  const P = g.attributes.position as THREE.BufferAttribute;
  const N = g.attributes.normal as THREE.BufferAttribute | undefined;
  if (!N) return g;
  const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3(), n = new THREE.Vector3();
  for (let i = 0; i < P.count; i += 3) {
    a.fromBufferAttribute(P, i);
    b.fromBufferAttribute(P, i + 1);
    c.fromBufferAttribute(P, i + 2);
    n.subVectors(b, a).cross(c.clone().sub(a));
    if (n.lengthSq() < 1e-24) continue;
    n.normalize();
    if (n.y <= 0.97) continue;
    for (let k = 0; k < 3; k++) N.setXYZ(i + k, n.x, n.y, n.z);
  }
  N.needsUpdate = true;
  return g;
}

interface Variant { base: string; kind: 'mouth' | 'spring'; mask: number }
/** `<asset>@mouth<localMask>` / `<asset>@spring<localEdge>` — see tile-edges.ts `riverMouthId()` / `composeRiver()`. */
function parseVariant(id: string): Variant | null {
  const i = id.indexOf('@');
  if (i < 0) return null;
  const m = /^(mouth|spring)(\d+)$/.exec(id.slice(i + 1));
  if (!m) return null;
  return { base: id.slice(0, i), kind: m[1] as 'mouth' | 'spring', mask: Number(m[2]) & 63 };
}

// Atlas texels (hexagons_medieval.png), measured from the tiles: lake water (hex_water top), sand (coast beach),
// grass top (hex_grass). The river-water strip u≈0.16–0.21, v≈0.27–0.40 shares its centre with the lake texel.
const UV_LAKE: [number, number] = [0.1972, 0.379];
const UV_SAND: [number, number] = [0.5773, 0.6];
const UV_GRASS: [number, number] = [0.0446, 0.584];
const isWaterUv = (u: number, v: number) => u > 0.14 && u < 0.23 && v > 0.25 && v < 0.41;

/** 1→4 midpoint subdivision of a non-indexed geometry (position/normal/uv), `levels` times. No T-junctions. */
function subdivide(g: THREE.BufferGeometry, levels: number): THREE.BufferGeometry {
  let src = g.index ? g.toNonIndexed() : g;
  for (let l = 0; l < levels; l++) {
    const names = ['position', 'normal', 'uv'].filter((n) => src.attributes[n]);
    const out: Record<string, number[]> = Object.fromEntries(names.map((n) => [n, []]));
    const P = src.attributes.position;
    for (let t = 0; t < P.count; t += 3) {
      for (const n of names) {
        const A = src.attributes[n] as THREE.BufferAttribute, k = A.itemSize;
        const v = [0, 1, 2].map((i) => Array.from({ length: k }, (_, c) => A.getComponent(t + i, c)));
        const mid = (x: number[], y: number[]) => x.map((xi, c) => (xi + y[c]) / 2);
        const [a, b, c] = v, ab = mid(a, b), bc = mid(b, c), ca = mid(c, a);
        for (const tri of [[a, ab, ca], [ab, b, bc], [ca, bc, c], [ab, bc, ca]]) for (const vv of tri) out[n].push(...vv);
      }
    }
    const ng = new THREE.BufferGeometry();
    for (const n of names) ng.setAttribute(n, new THREE.Float32BufferAttribute(out[n], (src.attributes[n] as THREE.BufferAttribute).itemSize));
    src = ng;
  }
  return src;
}

function flatNormals(g: THREE.BufferGeometry): void {
  const P = g.attributes.position as THREE.BufferAttribute;
  const N = g.attributes.normal as THREE.BufferAttribute;
  const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3();
  for (let i = 0; i < P.count; i += 3) {
    a.fromBufferAttribute(P, i); b.fromBufferAttribute(P, i + 1); c.fromBufferAttribute(P, i + 2);
    const n = b.sub(a).cross(c.sub(a));
    if (n.lengthSq() < 1e-24) continue;
    n.normalize();
    for (let k = 0; k < 3; k++) N.setXYZ(i + k, n.x, n.y, n.z);
  }
  N.needsUpdate = true;
}

/**
 * mouth: toward every edge in `mask` (tile-local) the river becomes an estuary — water drops from −0.1 to lake level
 *   (−0.2) and blends to the lake colour; the grass banks slope down as a sand beach exactly like the coast tiles'
 *   flanks (height −0.2·d at signed distance d toward the edge), so bank tips meet the neighbouring coast tiles and the
 *   lake without vertical ends.
 * spring: the half of the tile beyond the centre toward edge `mask` (an edge index) is filled up to grass level, so
 *   the channel ends inside the tile (under the spring hill) and the tile rim stays an ordinary grass rim.
 */
function synthVariant(id: string, base: StaticAsset, v: Variant): StaticAsset {
  const dirs = (v.kind === 'mouth' ? [0, 1, 2, 3, 4, 5].filter((d) => v.mask & (1 << d)) : [v.mask % 6]).map((d) => [Math.cos((d * Math.PI) / 3), -Math.sin((d * Math.PI) / 3)]);
  const parts = base.parts.map((p) => {
    const g = subdivide(p.geometry, 2);
    const P = g.attributes.position as THREE.BufferAttribute;
    const U = g.attributes.uv as THREE.BufferAttribute;
    const dOf = (i: number) => Math.max(...dirs.map(([ex, ez]) => P.getX(i) * ex + P.getZ(i) * ez));
    for (let t = 0; t < P.count; t += 3) {
      const ids = [t, t + 1, t + 2];
      const ys = ids.map((i) => P.getY(i));
      const top = ys.every((y) => y > -0.12); // top-surface triangle (water, banks, bevels)
      const water = ids.every((i) => isWaterUv(U.getX(i), U.getY(i)));
      if (v.kind === 'spring') {
        if (!top) continue;
        // fill the closed half: water level (and channel-wall bottoms) rise to grass level beyond d ≈ 0.12…0.3;
        // the rim bevel (−0.05) is left alone so the tile border looks like any grass tile.
        const k = ids.map((i) => THREE.MathUtils.smoothstep(dOf(i), 0.1, 0.3));
        if (Math.max(...k) <= 0) continue;
        ids.forEach((i, j) => { if (ys[j] < -0.075) P.setY(i, ys[j] * (1 - k[j])); });
        if (water && Math.min(...k) > 0.5) ids.forEach((i) => U.setXY(i, UV_GRASS[0], UV_GRASS[1]));
        continue;
      }
      if (!top) {
        // side walls: only their top vertices follow the surface below
        ids.forEach((i, j) => {
          if (ys[j] < -0.12) return;
          const d = Math.max(0, dOf(i));
          P.setY(i, Math.min(ys[j], -0.2 * d));
        });
        continue;
      }
      const ds = ids.map((i) => Math.max(0, dOf(i)));
      if (water) {
        ids.forEach((i, j) => {
          P.setY(i, Math.min(ys[j], -0.2 * ds[j] - 0.002));
          const s = THREE.MathUtils.smoothstep(ds[j], 0.25, 0.95);
          U.setXY(i, U.getX(i) + (UV_LAKE[0] - U.getX(i)) * s, U.getY(i) + (UV_LAKE[1] - U.getY(i)) * s);
        });
      } else {
        ids.forEach((i, j) => P.setY(i, Math.min(ys[j], -0.2 * ds[j] + 0.006)));
        // beach colour where the bank has dropped clearly below grass level
        const after = ids.map((i) => P.getY(i));
        const e1 = new THREE.Vector3(P.getX(t + 1) - P.getX(t), after[1] - after[0], P.getZ(t + 1) - P.getZ(t));
        const e2 = new THREE.Vector3(P.getX(t + 2) - P.getX(t), after[2] - after[0], P.getZ(t + 2) - P.getZ(t));
        const ny = e1.cross(e2).normalize().y;
        // only near-horizontal bank/beach faces turn sand (channel walls keep their own texel)
        if (ny > 0.6 && Math.max(...after) < -0.035 && Math.min(...ds) > 0.2) ids.forEach((i) => U.setXY(i, UV_SAND[0], UV_SAND[1]));
      }
    }
    P.needsUpdate = true;
    U.needsUpdate = true;
    flatNormals(g);
    g.computeBoundingBox();
    g.computeBoundingSphere();
    g.userData.shared = true;
    return { geometry: g, material: p.material, matrix: p.matrix };
  });
  return { id, parts, bounds: base.bounds.clone() };
}

/**
 * Scale for an asset id. Hex-pack props (barrel, crates, sack, wheelbarrow …) are modelled ~1.7× too big for the
 * characters at HEX_SCALE (barrel = 1.59 m = Knight chest). If core defines `HEX_PROP_SCALE` (CORE_REQUESTS.md) it is
 * used for `hex/decoration/props/*` except tents and flags; until then everything stays at its pack scale.
 */
function packScale(id: string, e: ManifestEntry): number {
  const prop = (U as Record<string, unknown>).HEX_PROP_SCALE;
  if (typeof prop === 'number' && id.startsWith('hex/decoration/props/') && !/\/flag_/.test(id)) return prop;
  return U[e.scale] as number;
}

/** Per-material base properties (idempotent). */
export function applyPolicy(m: THREE.Material, pack: string): void {
  const std = m as THREE.MeshStandardMaterial;
  if (m.userData.kfbPolicy) return;
  m.userData.kfbPolicy = true;
  if ('metalness' in std) std.metalness = 0;
  if ('roughness' in std) std.roughness = ROUGHNESS[pack] ?? 0.85;
  if (std.map) {
    std.map.colorSpace = THREE.SRGBColorSpace;
    std.map.anisotropy = ANISOTROPY;
    if (std.map.minFilter !== THREE.NearestFilter && std.map.minFilter !== THREE.LinearFilter) {
      std.map.minFilter = THREE.LinearMipmapLinearFilter;
      std.map.generateMipmaps = true;
    }
    std.map.needsUpdate = true;
  }
  m.needsUpdate = true;
}
