// Environment Kit R1 · E1 intake (docs/SPEC_ENVIRONMENT_KIT_R1.md §1–3).
// Loads one kit model (Quaternius FBX, KayKit Forest / Tiny Treats glTF), bakes it into one non-indexed geometry
// in lab units and normalises it ONCE to the middle of its role band in H (§2). No per-model factors.
// Colours: every vertex gets its kit colour (FBX material colour, or the glTF atlas sampled at its UV; the kit files
// stay unchanged) plus a palette slot (leaf · trunk · rock · bloom · keep) and a shade relative to the slot mean,
// so the shader can recolour to the island palette (§3) while the kit's light/dark modelling survives.
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { claySeed } from '../clay';


/** H = Medium figure height in lab units (SCALE_CONTRACT_K2 §2). */
export const H = 3.64;

export type EnvRole = 'grass' | 'flower' | 'bush' | 'smallTree' | 'anchor' | 'stone' | 'rimRock';
export type EnvKit = 'quaternius' | 'kaykit' | 'tinytreats' | 'kenney';

/** Role target bands in H (spec §2). Each species is normalised to the middle of its band. */
export const ROLE_H: Record<EnvRole, [number, number]> = {
  grass: [0.1, 0.25],
  flower: [0.15, 0.35],
  bush: [0.4, 0.8],
  smallTree: [1.5, 2.5],
  anchor: [2.5, 4],
  stone: [0.15, 0.7],
  rimRock: [0.7, 2],
};
export const roleMid = (r: EnvRole) => ((ROLE_H[r][0] + ROLE_H[r][1]) / 2) * H;

/** Palette slots carried per vertex (attribute envSlot). */
export const SLOT = { leaf: 0, trunk: 1, rock: 2, bloom: 3, keep: 4, grass: 5 } as const;
export const SLOT_NAMES = ['leaf', 'trunk', 'rock', 'bloom', 'keep', 'grass'];

export interface EnvSpecies {
  id: string;
  kit: EnvKit;
  role: EnvRole;
  file: string;
  /** normalised geometry: base at y = 0, trunk foot at x = z = 0, height = role middle */
  geo: THREE.BufferGeometry;
  height: number;
  /** native height in file units (cm for Quaternius) and the factor applied once */
  nativeH: number;
  factor: number;
  /** radius of the foot (lowest 12 % of the model) and of the whole crown, lab units */
  footR: number;
  crownR: number;
  tris: number;
  /** vertex share per slot (leaf, trunk, rock, bloom, keep) and the kit materials → slot table (intake report) */
  slotShare: number[];
  /** tile detector: area share of faces lying in an axis plane (flat cut sides, flat tops). Tiles ≈ 0.8–1, rocks < 0.3 */
  axisShare: number;
  mats: { name: string; hex: string; slot: string }[];
}

const KIT_DIR: Record<EnvKit, string> = { quaternius: '/assets/env/quaternius/', kaykit: '/assets/env/kaykit-forest/', tinytreats: '/assets/env/tinytreats/', kenney: '/assets/env/kenney/' };
const PREFIX: Record<string, EnvKit> = { q: 'quaternius', kk: 'kaykit', tt: 'tinytreats', kn: 'kenney' };
/** Tile and connector pieces are never nature (rulebook §0b.3): Kenney cliff_ / ground_ / path_ / bridge_ / platform_ … */
export const TILE_NAME = /^(cliff|ground|path|bridge|platform|fence|crops?|bed|tent|sign|statue|campfire|canoe|pot|hanging)_?/i;

/** 'q:CommonTree_1' → kit + file */
export function parseId(id: string): { kit: EnvKit; file: string } {
  const [p, name] = id.split(':');
  const kit = PREFIX[p];
  if (!kit) throw new Error('env: unknown kit prefix ' + id);
  const file = kit === 'quaternius' ? name + '.fbx' : kit === 'kaykit' ? name + '_Color1.gltf' : kit === 'kenney' ? name + '.glb' : name + '.gltf';
  return { kit, file };
}

// ---------- slot classification ----------
const hsl = { h: 0, s: 0, l: 0 };
/** Material name first (Quaternius names its materials), colour second (atlases, unnamed materials). */
function classify(name: string, c: THREE.Color, role: EnvRole): number {
  const n = name.toLowerCase();
  c.getHSL(hsl, THREE.SRGBColorSpace);
  const hue = hsl.h * 360;
  if (/snow/.test(n) || (hsl.l > 0.82 && hsl.s < 0.3)) return SLOT.keep; // snow caps stay white
  if (/^grass|grass$/.test(n)) return SLOT.grass; // Kenney names its moss / turf caps 'grass': ground family, not leaf
  if (/wood|bark|trunk|stump|log/.test(n)) return SLOT.trunk;
  if (/rock|stone|pebble/.test(n)) return SLOT.rock;
  if (/flower|blossom|petal|berr|fruit/.test(n)) return SLOT.bloom;
  if (/leaf|leaves|green|grass|plant|cactus|moss|bush|palm/.test(n)) return SLOT.leaf;
  // colour fallback
  if (hsl.s < 0.16) return role === 'stone' || role === 'rimRock' ? SLOT.rock : hsl.l < 0.35 ? SLOT.trunk : SLOT.rock;
  if (hue >= 55 && hue <= 175) return SLOT.leaf;
  if (hue >= 15 && hue < 50 && hsl.l < 0.5 && hsl.s < 0.75) return SLOT.trunk;
  if (role === 'stone' || role === 'rimRock') return SLOT.rock;
  // autumn leaves (orange / red / yellow crowns) are leaves, not blossoms, on trees and bushes
  if ((role === 'anchor' || role === 'smallTree' || role === 'bush') && (hue < 55 || hue > 340)) return SLOT.leaf;
  return SLOT.bloom;
}

// ---------- atlas sampling ----------
const PIX = new Map<unknown, { w: number; h: number; d: Uint8ClampedArray }>();
function pixels(tex: THREE.Texture) {
  const img = tex.image as CanvasImageSource & { width: number; height: number };
  let p = PIX.get(img);
  if (!p) {
    const cv = document.createElement('canvas');
    cv.width = img.width; cv.height = img.height;
    const cx = cv.getContext('2d', { willReadFrequently: true })!;
    cx.drawImage(img, 0, 0);
    p = { w: img.width, h: img.height, d: cx.getImageData(0, 0, img.width, img.height).data };
    PIX.set(img, p);
  }
  return p;
}

// ---------- loading ----------
const fbx = new FBXLoader();
const gltf = new GLTFLoader();
const CACHE = new Map<string, Promise<EnvSpecies>>();

export function loadSpecies(id: string, role: EnvRole): Promise<EnvSpecies> {
  const key = id + '@' + role;
  let p = CACHE.get(key);
  if (!p) {
    p = loadRaw(id).then((root) => bake(id, role, root));
    CACHE.set(key, p);
  }
  return p;
}

function loadRaw(id: string): Promise<THREE.Object3D> {
  const { kit, file } = parseId(id);
  const url = KIT_DIR[kit] + file;
  return file.endsWith('.fbx') ? fbx.loadAsync(url) : gltf.loadAsync(url).then((g) => g.scene);
}

function bake(id: string, role: EnvRole, root: THREE.Object3D): EnvSpecies {
  const { kit, file } = parseId(id);
  root.updateMatrixWorld(true);
  const P: number[] = [], N: number[] = [], C: number[] = [], S: number[] = [];
  const matTable = new Map<string, { name: string; hex: string; slot: string }>();
  const col = new THREE.Color(), nm = new THREE.Matrix3();
  root.traverse((o) => {
    const m = o as THREE.Mesh;
    if (!m.isMesh) return;
    let g = m.geometry.clone();
    g.applyMatrix4(m.matrixWorld);
    if (m.matrixWorld.determinant() < 0) { // mirrored node: keep faces pointing out
      const ix = g.index;
      if (ix) for (let i = 0; i < ix.count; i += 3) { const t = ix.getX(i + 1); ix.setX(i + 1, ix.getX(i + 2)); ix.setX(i + 2, t); }
    }
    if (g.index) g = g.toNonIndexed();
    if (!g.attributes.normal) g.computeVertexNormals();
    nm.getNormalMatrix(m.matrixWorld);
    const mats = Array.isArray(m.material) ? m.material : [m.material];
    const groups = g.groups.length ? g.groups : [{ start: 0, count: g.attributes.position.count, materialIndex: 0 }];
    const pos = g.attributes.position, nor = g.attributes.normal, uv = g.attributes.uv, vc = g.attributes.color;
    for (const gr of groups) {
      const mm = mats[gr.materialIndex ?? 0] as THREE.MeshStandardMaterial & THREE.MeshPhongMaterial;
      const base = mm.color ? mm.color.clone() : new THREE.Color(1, 1, 1);
      // Quaternius FBX stores Blender's linear diffuse; FBXLoader treats it as sRGB and darkens it a second time → undo once
      if (kit === 'quaternius') base.convertLinearToSRGB();
      const atlas = mm.map && uv ? pixels(mm.map) : null;
      const end = Math.min(pos.count, gr.start + gr.count);
      for (let i = gr.start; i < end; i++) {
        P.push(pos.getX(i), pos.getY(i), pos.getZ(i));
        N.push(nor.getX(i), nor.getY(i), nor.getZ(i));
        col.copy(base);
        if (atlas) {
          // glTF textures are not flipped: uv (0,0) is the top-left pixel
          const u = uv.getX(i) - Math.floor(uv.getX(i)), v = uv.getY(i) - Math.floor(uv.getY(i));
          const px = Math.min(atlas.w - 1, Math.floor(u * atlas.w)), py = Math.min(atlas.h - 1, Math.floor(v * atlas.h));
          const k = (py * atlas.w + px) * 4;
          col.setRGB(atlas.d[k] / 255, atlas.d[k + 1] / 255, atlas.d[k + 2] / 255, THREE.SRGBColorSpace).multiply(base);
        }
        if (vc) col.multiply(new THREE.Color(vc.getX(i), vc.getY(i), vc.getZ(i)));
        C.push(col.r, col.g, col.b);
        const nameKey = (mm.name || '') + (atlas ? '#' + col.getHexString() : '');
        let sl = classify(mm.name || '', col, role);
        if (role === 'grass' && sl === SLOT.leaf) sl = SLOT.grass; // grass is ground family, never leaf (colour grammar)
        S.push(sl);
        if (!matTable.has(nameKey) && matTable.size < 40) matTable.set(nameKey, { name: mm.name || '(atlas)', hex: '#' + col.getHexString(THREE.SRGBColorSpace), slot: SLOT_NAMES[sl] });
      }
    }
    g.dispose();
  });
  const n = P.length / 3;
  // bounds, foot centre (mean x/z of the lowest 4 %), normalise
  let y0 = Infinity, y1 = -Infinity;
  for (let i = 0; i < n; i++) { y0 = Math.min(y0, P[i * 3 + 1]); y1 = Math.max(y1, P[i * 3 + 1]); }
  const hN = y1 - y0;
  let fx = 0, fz = 0, fc = 0;
  for (let i = 0; i < n; i++) if (P[i * 3 + 1] < y0 + hN * 0.04) { fx += P[i * 3]; fz += P[i * 3 + 2]; fc++; }
  fx /= fc || 1; fz /= fc || 1;
  const target = roleMid(role), k = target / hN;
  let footR = 0, crownR = 0;
  for (let i = 0; i < n; i++) {
    const x = (P[i * 3] - fx) * k, y = (P[i * 3 + 1] - y0) * k, z = (P[i * 3 + 2] - fz) * k;
    P[i * 3] = x; P[i * 3 + 1] = y; P[i * 3 + 2] = z;
    const r = Math.hypot(x, z);
    crownR = Math.max(crownR, r);
    if (y < target * 0.12) footR = Math.max(footR, r);
  }
  // shade: luminance relative to the slot mean of this model (keeps the kit's two-tone modelling)
  const lum = (i: number) => 0.2126 * C[i * 3] + 0.7152 * C[i * 3 + 1] + 0.0722 * C[i * 3 + 2];
  const sum = [0, 0, 0, 0, 0, 0], cnt = [0, 0, 0, 0, 0, 0];
  for (let i = 0; i < n; i++) { sum[S[i]] += lum(i); cnt[S[i]]++; }
  const shade = new Float32Array(n), slot = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const mean = sum[S[i]] / Math.max(1, cnt[S[i]]);
    shade[i] = THREE.MathUtils.clamp(mean > 1e-4 ? lum(i) / mean : 1, 0.72, 1.3);
    slot[i] = S[i];
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(P, 3));
  geo.setAttribute('normal', new THREE.Float32BufferAttribute(N, 3));
  geo.setAttribute('color', new THREE.Float32BufferAttribute(C, 3));
  geo.setAttribute('envSlot', new THREE.BufferAttribute(slot, 1));
  geo.setAttribute('envShade', new THREE.BufferAttribute(shade, 1));
  // height share 0 (foot) … 1 (top): the contact band (Etherington: ground colour creeps up the foot)
  const foot = new Float32Array(n);
  for (let i = 0; i < n; i++) foot[i] = P[i * 3 + 1] / target;
  geo.setAttribute('envFoot', new THREE.BufferAttribute(foot, 1));
  geo.normalizeNormals();
  const out = geo; // kit geometry as delivered (Georg 2026-10-08: no kneading)
  claySeed(out, 1);
  out.computeBoundingBox();
  out.computeBoundingSphere();
  return {
    id, kit, role, file, geo: out, height: target, nativeH: +hN.toFixed(3), factor: +k.toFixed(5),
    footR: Math.max(0.15, footR), crownR: Math.max(0.2, crownR), tris: out.attributes.position.count / 3,
    slotShare: cnt.map((c) => +(c / n).toFixed(2)), mats: [...matTable.values()], axisShare: axisShare(out),
  };
}

/** area share of triangles whose normal lies within ~10° of a coordinate axis */
export function axisShare(g: THREE.BufferGeometry): number {
  const p = g.attributes.position, a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3();
  let tot = 0, ax = 0;
  for (let i = 0; i + 2 < p.count; i += 3) {
    a.fromBufferAttribute(p, i); b.fromBufferAttribute(p, i + 1); c.fromBufferAttribute(p, i + 2);
    const n = b.sub(a).cross(c.sub(a)), A = n.length() / 2;
    if (A < 1e-9) continue;
    n.normalize();
    tot += A;
    if (Math.max(Math.abs(n.x), Math.abs(n.y), Math.abs(n.z)) > 0.985) ax += A;
  }
  return +(ax / (tot || 1)).toFixed(2);
}
