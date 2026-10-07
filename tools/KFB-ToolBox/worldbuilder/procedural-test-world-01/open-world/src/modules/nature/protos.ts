// Prototypes: flattened geometry (metres, origin = trunk base) + measured metrics for every nature piece.
// Hex-pack cluster meshes (trees_A_large / trees_B_large) are split into their individual pines (one connected component
// each), so forests can be composed tree by tree with the exact hex-pack look (dense cores, thinning edges, per-tree
// ground height, per-tree colliders).
import * as THREE from 'three';
import type { AssetLibraryApi, StaticAsset } from '../../core/types';

export type ProtoKind = 'pine' | 'broad' | 'bush' | 'rock' | 'stump' | 'bare';

export interface ProtoPart {
  material: THREE.Material;
  pos: Float32Array;
  nor: Float32Array;
  uv: Float32Array | null;
  idx: Uint32Array;
  /** Normalised height 0..1 per vertex (wind weight). */
  hf: Float32Array;
  /** 1 = foliage vertex (green atlas texel: dithers near the camera / on the camera→player line), 0 = trunk/rock. */
  fol: Float32Array;
}

export interface Proto {
  id: string;
  kind: ProtoKind;
  parts: ProtoPart[];
  /** Top above base (m). */
  height: number;
  /** Trunk radius near the ground (m). */
  trunkR: number;
  /** Foliage radius around the crown centre (m). */
  canopyR: number;
  /** Lowest foliage height (m). */
  canopyBottom: number;
  /** Crown centre offset from the trunk (local xz, m). */
  crownX: number;
  crownZ: number;
  /** Footprint radius (m) for spacing checks (bush/rock: half max xz extent). */
  footR: number;
  /** Lowest y of the geometry (rocks may be half buried). */
  minY: number;
  /** Convex-hull point cloud (rocks), local metres. */
  hull?: Float32Array;
  /** Cheaper far representation (vertex-clustered); absent = use this proto. */
  far?: Proto;
  /** Lowest foliage-coloured vertex (m). */
  folBottom: number;
  /** Extra scale so low branches clear the Knight's helmet (broad-leaf trees; 1 otherwise). */
  headScale: number;
}

export const HEX_NATURE = 'hex/decoration/nature/';
export const PINE_SOURCES = [HEX_NATURE + 'trees_A_large', HEX_NATURE + 'trees_B_large'];
export const SINGLE_PINES = [HEX_NATURE + 'tree_single_A', HEX_NATURE + 'tree_single_B'];
export const STUMPS = [HEX_NATURE + 'tree_single_A_cut', HEX_NATURE + 'tree_single_B_cut'];
export const HEX_ROCKS = ['A', 'B', 'C', 'D', 'E'].map((l) => HEX_NATURE + 'rock_single_' + l);
/** Broad-leaved forest-pack trees, grouped by family (a region / copse uses one family so it reads coherent). */
export const BROAD_FAMILIES = [['Tree_1_A', 'Tree_1_B'], ['Tree_2_A'], ['Tree_3_A', 'Tree_3_B']].map((f) => f.map((n) => `forest/${n}_Color1`));
export const BROAD = BROAD_FAMILIES.flat();
export const BUSHES = ['Bush_1_B', 'Bush_1_C', 'Bush_1_D', 'Bush_3_A', 'Bush_3_B', 'Bush_4_B', 'Bush_4_D'].map(
  (n) => `forest/${n}_Color1`,
);
export const SMALL_ROCKS = ['A', 'B', 'C', 'D', 'E', 'F'].map((l) => `forest/Rock_3_${l}_Color1`);
export const MID_ROCKS = ['G', 'H', 'I', 'J', 'K', 'L'].map((l) => `forest/Rock_3_${l}_Color1`);
export const GRASS = ['forest/Grass_1_B_Color1', 'forest/Grass_2_B_Color1'];
/** Light tufts (44 tris) for meadow patches. */
export const GRASS_LIGHT = ['forest/Grass_1_A_Color1', 'forest/Grass_2_A_Color1'];
export const BARE = ['Tree_Bare_1_A', 'Tree_Bare_1_B', 'Tree_Bare_2_A'].map((n) => `forest/${n}_Color1`);

/**
 * Crown lift (m, before scale) for the split hex-pack pines: their trunk is stretched so the crown skirt starts above the
 * 1.9 m Knight's head once the species scale (place.ts SPECIES_SCALE) is applied. KayKit's cluster pines are modelled
 * as diorama props with the skirt at ~1 m; at walking scale that swallows the player's head.
 */
export const CROWN_LIFT = { pineA: 1.3, pineB: 1.7, single: 1.0 };
/**
 * Trunk slimming (xz factor on trunk-coloured vertices only): the lifted pine trunks are diorama-thick (Ø ≈ 1 m, about
 * the Knight's width); at walking scale they read as a hall of pillars. B-pine trunks are also made a straight column
 * (their stub widened upward, which read as a needle point at the ground once stretched).
 */
export const TRUNK_SLIM = { pineA: 0.55, pineB: 0.5, single: 0.55 };

/**
 * Replace the (square, 4–6 sided) hex-pack pine trunk by a round tapered 10-sided column with the same atlas texel:
 * trunk triangles (all corners trunk-coloured, below the crown bottom) are dropped, a frustum from just below the ground
 * to 0.3 m into the crown is added. Up close it reads as a trunk, not a fence post.
 */
function roundTrunk(f: Flat, cb: number, rBase: number, rTop: number): Flat {
  const fol = foliageFlags(f, (i) => (f.pos[i * 3 + 1] < cb ? 0 : 1));
  const keep: number[] = [];
  let us = 0, vs = 0, un = 0;
  for (let t = 0; t < f.idx.length; t += 3) {
    const a = f.idx[t], b = f.idx[t + 1], c = f.idx[t + 2];
    const trunk = !fol[a] && !fol[b] && !fol[c] && Math.max(f.pos[a * 3 + 1], f.pos[b * 3 + 1], f.pos[c * 3 + 1]) < cb + 0.1;
    if (!trunk) { keep.push(a, b, c); continue; }
    if (f.uv) for (const v of [a, b, c]) { us += f.uv[v * 2]; vs += f.uv[v * 2 + 1]; un++; }
  }
  if (!un) return f;
  const u0 = us / un, v0 = vs / un;
  const N = 10, n0 = f.pos.length / 3;
  const y0 = -0.2, y1 = cb + 0.3;
  const pos = Array.from(f.pos), nor = Array.from(f.nor), uv = f.uv ? Array.from(f.uv) : null;
  const slope = (rBase - rTop) / (y1 - y0);
  for (let k = 0; k < N; k++) {
    const a = (k / N) * Math.PI * 2, ca = Math.cos(a), sa = Math.sin(a);
    const nl = Math.hypot(1, slope);
    for (const [y, r] of [[y0, rBase], [y1, rTop]] as const) {
      pos.push(ca * r, y, sa * r);
      nor.push(ca / nl, slope / nl, sa / nl);
      uv?.push(u0, v0);
    }
  }
  for (let k = 0; k < N; k++) {
    const i0 = n0 + k * 2, i1 = n0 + ((k + 1) % N) * 2;
    // outward-facing (counter-clockwise seen from outside)
    keep.push(i0, i0 + 1, i1, i1, i0 + 1, i1 + 1);
  }
  return { material: f.material, pos: Float32Array.from(pos), nor: Float32Array.from(nor), uv: uv ? Float32Array.from(uv) : null, idx: Uint32Array.from(keep) };
}

/**
 * Scale the trunk in xz by `k`: every vertex within the trunk's top radius (pre-slim) up to just above the crown bottom —
 * trunk vertices AND the inner ring of the crown underside around the trunk hole — so the crown hole closes with the
 * trunk (no light leaks in its shadow). With `straight`, the trunk becomes a column of the base radius·k.
 */
function slimTrunk(f: Flat, cb: number, k: number, straight = false): Flat {
  const fol = foliageFlags(f, (i) => (f.pos[i * 3 + 1] < cb ? 0 : 1));
  const pos = f.pos.slice();
  let base = 0, top = 0;
  for (let i = 0; i < pos.length; i += 3) {
    if (fol[i / 3]) continue;
    const r = Math.hypot(pos[i], pos[i + 2]), y = pos[i + 1];
    if (y < cb * 0.3) base = Math.max(base, r);
    if (y > cb * 0.6 && y < cb + 0.6) top = Math.max(top, r);
  }
  const reach = Math.max(top, base) * 1.08;
  for (let i = 0; i < pos.length; i += 3) {
    const r = Math.hypot(pos[i], pos[i + 2]), y = pos[i + 1];
    if (y > cb + 0.6 || r > reach) continue;
    let m = k;
    if (straight && base > 0 && r > base) m = (base * k) / r;
    pos[i] *= m; pos[i + 2] *= m;
  }
  return { ...f, pos };
}

export const ALL_IDS = [...PINE_SOURCES, ...SINGLE_PINES, ...STUMPS, ...HEX_ROCKS, ...BROAD, ...BUSHES, ...SMALL_ROCKS, ...MID_ROCKS, ...GRASS, ...GRASS_LIGHT, ...BARE];

interface Flat {
  material: THREE.Material;
  pos: Float32Array;
  nor: Float32Array;
  uv: Float32Array | null;
  idx: Uint32Array;
}

const _v = new THREE.Vector3();
const _n3 = new THREE.Matrix3();

/** Flatten one asset part into metres (part matrix applied). */
function flatten(geo: THREE.BufferGeometry, matrix: THREE.Matrix4, material: THREE.Material): Flat {
  const P = geo.attributes.position, N = geo.attributes.normal, UV = geo.attributes.uv;
  const n = P.count;
  const pos = new Float32Array(n * 3), nor = new Float32Array(n * 3);
  const uv = UV ? new Float32Array(n * 2) : null;
  _n3.getNormalMatrix(matrix);
  for (let i = 0; i < n; i++) {
    _v.fromBufferAttribute(P, i).applyMatrix4(matrix);
    pos[i * 3] = _v.x; pos[i * 3 + 1] = _v.y; pos[i * 3 + 2] = _v.z;
    if (N) _v.fromBufferAttribute(N, i).applyMatrix3(_n3).normalize();
    else _v.set(0, 1, 0);
    nor[i * 3] = _v.x; nor[i * 3 + 1] = _v.y; nor[i * 3 + 2] = _v.z;
    if (uv) { uv[i * 2] = UV.getX(i); uv[i * 2 + 1] = UV.getY(i); }
  }
  let idx: Uint32Array;
  if (geo.index) idx = Uint32Array.from(geo.index.array as ArrayLike<number>);
  else idx = Uint32Array.from({ length: n }, (_, i) => i);
  if (matrix.determinant() < 0) for (let i = 0; i < idx.length; i += 3) { const t = idx[i + 1]; idx[i + 1] = idx[i + 2]; idx[i + 2] = t; }
  return { material, pos, nor, uv, idx };
}

/** Split a flat mesh into connected components (vertices welded by position). */
function components(f: Flat): number[][] {
  const n = f.pos.length / 3;
  const par = new Int32Array(n);
  for (let i = 0; i < n; i++) par[i] = i;
  const find = (x: number): number => { while (par[x] !== x) { par[x] = par[par[x]]; x = par[x]; } return x; };
  const uni = (a: number, b: number) => { a = find(a); b = find(b); if (a !== b) par[a] = b; };
  const key = new Map<string, number>();
  for (let i = 0; i < n; i++) {
    const k = f.pos[i * 3].toFixed(3) + ',' + f.pos[i * 3 + 1].toFixed(3) + ',' + f.pos[i * 3 + 2].toFixed(3);
    const j = key.get(k);
    if (j === undefined) key.set(k, i); else uni(i, j);
  }
  for (let i = 0; i < f.idx.length; i += 3) { uni(f.idx[i], f.idx[i + 1]); uni(f.idx[i], f.idx[i + 2]); }
  const groups = new Map<number, number[]>();
  for (let t = 0; t < f.idx.length; t += 3) {
    const r = find(f.idx[t]);
    let g = groups.get(r);
    if (!g) groups.set(r, (g = []));
    g.push(t);
  }
  return [...groups.values()]; // triangle start offsets per component
}

/** Sub-mesh of the given triangles, translated by (-ox, 0, -oz). */
function subMesh(f: Flat, tris: number[], ox: number, oz: number): Flat {
  const remap = new Map<number, number>();
  const idx: number[] = [];
  for (const t of tris) for (let k = 0; k < 3; k++) {
    const v = f.idx[t + k];
    let m = remap.get(v);
    if (m === undefined) remap.set(v, (m = remap.size));
    idx.push(m);
  }
  const n = remap.size;
  const pos = new Float32Array(n * 3), nor = new Float32Array(n * 3);
  const uv = f.uv ? new Float32Array(n * 2) : null;
  for (const [v, m] of remap) {
    pos[m * 3] = f.pos[v * 3] - ox; pos[m * 3 + 1] = f.pos[v * 3 + 1]; pos[m * 3 + 2] = f.pos[v * 3 + 2] - oz;
    nor[m * 3] = f.nor[v * 3]; nor[m * 3 + 1] = f.nor[v * 3 + 1]; nor[m * 3 + 2] = f.nor[v * 3 + 2];
    if (uv && f.uv) { uv[m * 2] = f.uv[v * 2]; uv[m * 2 + 1] = f.uv[v * 2 + 1]; }
  }
  return { material: f.material, pos, nor, uv, idx: Uint32Array.from(idx) };
}

// ---------------------------------------------------------------- atlas texel classification (foliage vs trunk/rock)
const texReaders = new Map<unknown, ((u: number, v: number) => number) | null>();
/** Returns a function (u, v) → 1 if the atlas texel is foliage-green, else 0; null if the image cannot be read. */
function foliageReader(material: THREE.Material): ((u: number, v: number) => number) | null {
  const map = (material as THREE.MeshStandardMaterial).map;
  const img = map?.image as (CanvasImageSource & { width: number; height: number }) | undefined;
  if (!img || !img.width) return null;
  if (texReaders.has(img)) return texReaders.get(img)!;
  let fn: ((u: number, v: number) => number) | null = null;
  try {
    const w = img.width, h = img.height;
    const cv = document.createElement('canvas');
    cv.width = w; cv.height = h;
    const g = cv.getContext('2d', { willReadFrequently: true })!;
    g.drawImage(img, 0, 0);
    const data = g.getImageData(0, 0, w, h).data;
    const flipY = !!map!.flipY;
    fn = (u, v) => {
      u = u - Math.floor(u); v = v - Math.floor(v);
      const x = Math.min(w - 1, Math.floor(u * w));
      const y = Math.min(h - 1, Math.floor((flipY ? 1 - v : v) * h));
      const i = (y * w + x) * 4;
      const r = data[i], gg = data[i + 1], b = data[i + 2];
      return gg > r * 1.12 && gg > b * 1.05 ? 1 : 0;
    };
  } catch {
    fn = null;
  }
  texReaders.set(img, fn);
  return fn;
}

function foliageFlags(f: Flat, fallback: (i: number) => number): Float32Array {
  const n = f.pos.length / 3;
  const out = new Float32Array(n);
  const rd = f.uv ? foliageReader(f.material) : null;
  for (let i = 0; i < n; i++) out[i] = rd && f.uv ? rd(f.uv[i * 2], f.uv[i * 2 + 1]) : fallback(i);
  return out;
}

/**
 * Stretch the trunk below `cb` so the crown starts `lift` m higher (crown shifted up rigidly); the stretched trunk is
 * slimmed so that its radius is at most `maxR` (round B-pines have a 0.6–0.75 m stub that reads as a barrel when long).
 */
function liftCrown(f: Flat, cb: number, lift: number, maxR = Infinity): Flat {
  const pos = f.pos.slice();
  const k = (cb + lift) / Math.max(cb, 0.05);
  let r = 0;
  for (let i = 0; i < pos.length; i += 3) if (pos[i + 1] < cb * 0.9) r = Math.max(r, Math.hypot(pos[i], pos[i + 2]));
  const slim = r > maxR ? maxR / r : 1;
  for (let i = 0; i < pos.length; i += 3) {
    const y = pos[i + 1];
    if (y < cb * 0.9) { pos[i] *= slim; pos[i + 2] *= slim; }
    pos[i + 1] = y <= 0 ? y : y < cb ? y * k : y + lift;
  }
  return { ...f, pos };
}

/** Vertex-clustering decimation (cell `c` m) keeping foliage and trunk clusters apart; metrics copied from `p`. */
function decimate(p: Proto, c: number): Proto | undefined {
  let before = 0, after = 0;
  const parts: ProtoPart[] = p.parts.map((part) => {
    const n = part.pos.length / 3;
    const key = new Map<string, number>();
    const map = new Int32Array(n);
    const acc: number[] = [];
    const first: number[] = [];
    for (let i = 0; i < n; i++) {
      const k = Math.round(part.pos[i * 3] / c) + ',' + Math.round(part.pos[i * 3 + 1] / c) + ',' + Math.round(part.pos[i * 3 + 2] / c) + ',' + part.fol[i];
      let id = key.get(k);
      if (id === undefined) { key.set(k, (id = key.size)); acc.push(0, 0, 0, 0, 0, 0, 0); first.push(i); }
      map[i] = id;
      const a = id * 7;
      acc[a] += part.pos[i * 3]; acc[a + 1] += part.pos[i * 3 + 1]; acc[a + 2] += part.pos[i * 3 + 2];
      acc[a + 3] += part.nor[i * 3]; acc[a + 4] += part.nor[i * 3 + 1]; acc[a + 5] += part.nor[i * 3 + 2]; acc[a + 6]++;
    }
    const m = key.size;
    const pos = new Float32Array(m * 3), nor = new Float32Array(m * 3), uv = part.uv ? new Float32Array(m * 2) : null;
    const hf = new Float32Array(m), fol = new Float32Array(m);
    for (let j = 0; j < m; j++) {
      const a = j * 7, cnt = acc[a + 6];
      pos[j * 3] = acc[a] / cnt; pos[j * 3 + 1] = acc[a + 1] / cnt; pos[j * 3 + 2] = acc[a + 2] / cnt;
      const l = Math.hypot(acc[a + 3], acc[a + 4], acc[a + 5]) || 1;
      nor[j * 3] = acc[a + 3] / l; nor[j * 3 + 1] = acc[a + 4] / l; nor[j * 3 + 2] = acc[a + 5] / l;
      const f0 = first[j];
      if (uv && part.uv) { uv[j * 2] = part.uv[f0 * 2]; uv[j * 2 + 1] = part.uv[f0 * 2 + 1]; }
      hf[j] = part.hf[f0];
      fol[j] = part.fol[f0];
    }
    const idx: number[] = [];
    const seen = new Set<string>();
    for (let t = 0; t < part.idx.length; t += 3) {
      const a = map[part.idx[t]], b = map[part.idx[t + 1]], d = map[part.idx[t + 2]];
      if (a === b || b === d || a === d) continue;
      const s = [a, b, d].sort((x, y) => x - y).join(',');
      if (seen.has(s)) continue;
      seen.add(s);
      idx.push(a, b, d);
    }
    before += part.idx.length / 3;
    after += idx.length / 3;
    return { material: part.material, pos, nor, uv, idx: Uint32Array.from(idx), hf, fol };
  });
  if (after > before * 0.75) return undefined;
  return { ...p, id: p.id + '@far', parts, far: undefined };
}

/** Measure a proto from its flattened parts. Origin = trunk base. */
function makeProto(id: string, kind: ProtoKind, flats: Flat[], wantHull = false): Proto {
  let minY = Infinity, maxY = -Infinity, maxXZ = 0;
  for (const f of flats) for (let i = 0; i < f.pos.length; i += 3) {
    minY = Math.min(minY, f.pos[i + 1]);
    maxY = Math.max(maxY, f.pos[i + 1]);
    maxXZ = Math.max(maxXZ, Math.hypot(f.pos[i], f.pos[i + 2]));
  }
  const height = Math.max(0.05, maxY);
  // trunk (first estimate): vertices in the lowest min(10 %, 0.4 m) above ground — below any low-hanging crown
  const ringR = (y0: number, y1: number) => {
    let r = 0;
    for (const f of flats) for (let i = 0; i < f.pos.length; i += 3) {
      const y = f.pos[i + 1];
      if (y > y0 && y < y1) r = Math.max(r, Math.hypot(f.pos[i], f.pos[i + 2]));
    }
    return r;
  };
  let trunkR = ringR(0, Math.min(height * 0.1, 0.4));
  // crown: vertices clearly wider than the trunk
  let cx = 0, cz = 0, cn = 0, canopyBottom = height;
  const wide = Math.max(trunkR * 1.8, 0.45);
  for (const f of flats) for (let i = 0; i < f.pos.length; i += 3) {
    const r = Math.hypot(f.pos[i], f.pos[i + 2]);
    if (r > wide && f.pos[i + 1] > height * 0.08) {
      canopyBottom = Math.min(canopyBottom, f.pos[i + 1]);
      cx += f.pos[i]; cz += f.pos[i + 2]; cn++;
    }
  }
  if (cn) { cx /= cn; cz /= cn; }
  // trunk radius for colliders: mid-trunk band (excludes root flares and the crown)
  if (canopyBottom > 0.6) {
    const mid = ringR(canopyBottom * 0.3, canopyBottom * 0.6);
    if (mid > 0) trunkR = mid;
  }
  let canopyR = 0;
  for (const f of flats) for (let i = 0; i < f.pos.length; i += 3) {
    if (f.pos[i + 1] < canopyBottom) continue;
    canopyR = Math.max(canopyR, Math.hypot(f.pos[i] - cx, f.pos[i + 2] - cz));
  }
  const parts: ProtoPart[] = flats.map((f) => {
    const hf = new Float32Array(f.pos.length / 3);
    for (let i = 0; i < hf.length; i++) hf[i] = Math.min(1, Math.max(0, f.pos[i * 3 + 1] / height));
    // fallback (unreadable atlas): crown = everything above the crown bottom or wider than the trunk
    const fol = kind === 'rock' || kind === 'stump' || kind === 'bare' ? new Float32Array(hf.length) : foliageFlags(f, (i) => {
      const r = Math.hypot(f.pos[i * 3], f.pos[i * 3 + 2]);
      return kind === 'bush' || f.pos[i * 3 + 1] > canopyBottom - 0.05 || r > trunkR * 1.6 ? 1 : 0;
    });
    return { material: f.material, pos: f.pos, nor: f.nor, uv: f.uv, idx: f.idx, hf, fol };
  });
  let hull: Float32Array | undefined;
  if (wantHull) {
    const pts: number[] = [];
    for (const f of flats) for (let i = 0; i < f.pos.length; i += 3 * 3) pts.push(f.pos[i], f.pos[i + 1], f.pos[i + 2]);
    hull = Float32Array.from(pts);
  }
  let folBottom = height;
  for (const q of parts) for (let i = 0; i < q.fol.length; i++) if (q.fol[i] > 0.5) folBottom = Math.min(folBottom, q.pos[i * 3 + 1]);
  const headScale = kind === 'broad' ? Math.min(1.35, Math.max(1, 3.3 / Math.max(folBottom, 0.5))) : 1;
  return {
    folBottom, headScale,
    id, kind, parts, height, trunkR: Math.max(trunkR, 0.12), canopyR: Math.max(canopyR, 0.3), canopyBottom,
    crownX: cx, crownZ: cz, footR: maxXZ, minY, hull,
  };
}

function flats(a: StaticAsset): Flat[] {
  return a.parts.map((p) => flatten(p.geometry, p.matrix, p.material));
}

export interface ProtoSet {
  pinesA: Proto[];
  pinesB: Proto[];
  singles: Proto[];
  bare: Proto[];
  stumps: Proto[];
  broad: Proto[];
  /** broad split by family (index = BROAD_FAMILIES index). */
  broadFam: Proto[][];
  bushes: Proto[];
  smallRocks: Proto[];
  midRocks: Proto[];
  hexRocks: Proto[];
  /** First material of each pack (for the wind clones). */
  hexMat: THREE.Material | null;
  forestMat: THREE.Material | null;
}

/** Build all prototypes from the preloaded assets (missing ones are skipped). */
export function buildProtos(assets: AssetLibraryApi): ProtoSet {
  const set: ProtoSet = { pinesA: [], pinesB: [], singles: [], bare: [], stumps: [], broad: [], broadFam: [], bushes: [], smallRocks: [], midRocks: [], hexRocks: [], hexMat: null, forestMat: null };
  // split cluster meshes into individual pines; dedupe identical shapes (same vertex count + height)
  PINE_SOURCES.forEach((id, k) => {
    const a = assets.get(id);
    if (!a || a.parts.length !== 1) return;
    const f = flats(a)[0];
    set.hexMat ??= f.material;
    const seen = new Set<string>();
    for (const tris of components(f)) {
      // trunk base = xz centroid of the lowest vertices
      let minY = Infinity;
      for (const t of tris) for (let j = 0; j < 3; j++) minY = Math.min(minY, f.pos[f.idx[t + j] * 3 + 1]);
      let sx = 0, sz = 0, sn = 0, maxY = -Infinity;
      for (const t of tris) for (let j = 0; j < 3; j++) {
        const v = f.idx[t + j];
        maxY = Math.max(maxY, f.pos[v * 3 + 1]);
        if (f.pos[v * 3 + 1] < minY + 0.3) { sx += f.pos[v * 3]; sz += f.pos[v * 3 + 2]; sn++; }
      }
      const key = tris.length + ':' + maxY.toFixed(1);
      if (seen.has(key)) continue;
      seen.add(key);
      const sub = subMesh(f, tris, sx / sn, sz / sn);
      const pid = `${id}#${seen.size}`;
      const raw = makeProto(pid, 'pine', [sub]);
      const lift = k === 0 ? CROWN_LIFT.pineA : CROWN_LIFT.pineB;
      const up = liftCrown(sub, raw.canopyBottom, lift);
      const cbL = raw.canopyBottom + lift;
      const slim = slimTrunk(up, cbL, k === 0 ? TRUNK_SLIM.pineA : TRUNK_SLIM.pineB, k === 1);
      let lifted = makeProto(pid, 'pine', [k === 0 ? roundTrunk(slim, cbL, 0.2, 0.15) : roundTrunk(slim, cbL, 0.22, 0.17)]);
      // a few split pines have a low skirt the generic lift misses (B#3: lowest leaves 1.6 m) → lift that one further
      if (lifted.folBottom < 2.25) {
        const extra = 2.35 - lifted.folBottom;
        lifted = makeProto(pid, 'pine', lifted.parts.map((q) => liftCrown(q, lifted.folBottom, extra)));
      }
      (k === 0 ? set.pinesA : set.pinesB).push(lifted);
    }
  });
  const add = (ids: string[], kind: ProtoKind, into: Proto[], hull = false) => {
    for (const id of ids) {
      const a = assets.get(id);
      if (!a) continue;
      const fl = flats(a);
      if (id.startsWith('hex/')) set.hexMat ??= fl[0]?.material ?? null;
      else set.forestMat ??= fl[0]?.material ?? null;
      into.push(makeProto(id, kind, fl, hull));
    }
  };
  add(SINGLE_PINES, 'pine', set.singles);
  set.singles = set.singles.map((p) =>
    makeProto(p.id, 'pine', p.parts.map((q) => roundTrunk(slimTrunk(liftCrown(q, p.canopyBottom, CROWN_LIFT.single), p.canopyBottom + CROWN_LIFT.single, TRUNK_SLIM.single), p.canopyBottom + CROWN_LIFT.single, 0.2, 0.15))),
  );
  add(BARE, 'bare', set.bare);
  add(STUMPS, 'stump', set.stumps);
  for (const fam of BROAD_FAMILIES) {
    const list: Proto[] = [];
    add(fam, 'broad', list);
    if (list.length) { set.broadFam.push(list); set.broad.push(...list); }
  }
  add(BUSHES, 'bush', set.bushes);
  add(SMALL_ROCKS, 'rock', set.smallRocks);
  add(MID_ROCKS, 'rock', set.midRocks, true);
  add(HEX_ROCKS, 'rock', set.hexRocks);
  // far LOD for the heavy pieces (B-pines 220 tris, broad 330–640, bare 320–400); A-pines (48 tris) stay as they are
  for (const p of [...set.pinesB, ...set.broad, ...set.singles]) p.far = decimate(p, p.kind === 'pine' ? 0.75 : 0.95);
  return set;
}
