// Per-chunk rendering of road / river / crossing / sloped-road top tiles and bridges (+ bridge colliders, river
// blockers). Terrain draws the columns under these cells (ownership table in docs/BUILDER_BRIEF.md).
import * as THREE from 'three';
import type RAPIER from '@dimforge/rapier3d-compat';
import type { CellData, ChunkInfo, CoreContext } from '../../core/types';
import type { ChunkBuilder } from '../../core/chunks';
import { DIRS, hexRound, hexToWorld, worldToAxial } from '../../core/hex';
import { hash } from '../../core/rng';
import { HEX_SCALE, LEVEL_H } from '../../core/units';
import { PLAYER_ONLY_GROUPS, WORLD_GROUPS } from '../../core/groups';
import { matchCrossing, matchTile, matchTileNearest } from '../assets/tile-edges';
import * as look from '../terrain/look';
import * as terrainApi from '../terrain/api';
// one source of truth for the road strip depth (= the KayKit road tiles' strip at −0.05 · HEX_SCALE)
import { ROAD_SINK } from '../terrain/build';

export /** Along-edge position (units of HEX_SCALE from the edge midpoint) where a drop corner's rim band ends on a welded
 * edge: terrain's flatTop insets the corner by RIM_W / sin 120° = 0.0577 units → grass at full height from here. */
const CORNER_BAND = 0.5774 - 0.0577;
/**
 * Top line of the KayKit road strip's grass bevel (units of HEX_SCALE from the strip centre line): 1.818 m = 0.2424.
 * (An earlier weld cut lifted a bevel point to grass height near each arm end, pulling the top in to 1.743 m: diagonal
 * kinks, then lengthwise creases — fixed in variant(); the seam cuts use this line, so the bevel is one straight facet.)
 */
const BEVEL_TOP = 0.2424;
const BRIDGE_SCALE = 1.05;
export const RIVER_DECO_IDS = ['waterlily_A', 'waterlily_B', 'waterplant_A', 'waterplant_B', 'waterplant_C'].map((n) => 'hex/decoration/nature/' + n);
export const BRIDGE_IDS = ['hex/buildings/neutral/building_bridge_A', 'hex/buildings/neutral/building_bridge_B'];

const _m = new THREE.Matrix4();
const _q = new THREE.Quaternion();
const _p = new THREE.Vector3();
const _s = new THREE.Vector3(1, 1, 1);
const Y = new THREE.Vector3(0, 1, 0);

export interface RenderStats {
  chunks: number;
  ms: number;
  maxMs: number;
  roadTiles: number;
  riverTiles: number;
  bridges: number;
  berms?: number;
  missing: number;
}

/** Deck profile of a bridge model measured from its vertices (metres; local deck frame). */
interface BridgeShape {
  /** deck direction in the model (our angle convention: radians from +X toward −Z), from a principal-axis fit */
  phi: number;
  /** centre of the deck footprint (model xz) */
  cx: number;
  cz: number;
  half: number; // half length (m)
  halfW: number; // half width of the walkable deck (m)
  rail: number; // railing top above deck (m)
  /** parapet inner face / outer edge, half widths from the deck centre line (m) */
  inner: number;
  outer: number;
  /** deck top height (m above tile top) at NS+1 stations from −half to +half */
  prof: number[];
  /** LOWEST deck surface across the walkable width (m, unclamped; may be < 0 at the feet) at NL+1 stations */
  low: number[];
  /** outer half width of the whole model (parapets, feet) at the same NL+1 stations */
  outerAt: number[];
}



const vkey = (v: THREE.Vector3) => Math.round(v.x * 100) + ',' + Math.round(v.y * 100) + ',' + Math.round(v.z * 100);
const bankCache = new WeakMap<object, Map<string, [number, number]>>();
/**
 * Sloped river banks: KayKit's channel wall is vertical (shoulder at −0.375 m straight above the waterline at
 * −0.75 m). Every waterline vertex under a shoulder moves BANK m into the water (away from the bank's grass lip), so
 * the wall becomes a ~30° slope and the water narrows a little. On the hex boundary only the along-edge component
 * moves (neighbouring tiles agree: rivers cross edges perpendicularly with identical geometry). Asset frame, metres.
 */
function bankShift(a: { parts: { geometry: THREE.BufferGeometry; matrix: THREE.Matrix4 }[] }): Map<string, [number, number]> {
  let m = bankCache.get(a);
  if (m) return m;
  m = new Map();
  const S = HEX_SCALE, BANK = 0.65;
  const pts: THREE.Vector3[] = [];
  const seen = new Set<string>();
  for (const part of a.parts) {
    const P = part.geometry.attributes.position;
    for (let i = 0; i < P.count; i++) {
      const v = new THREE.Vector3().fromBufferAttribute(P, i).applyMatrix4(part.matrix);
      const k = vkey(v);
      if (!seen.has(k)) { seen.add(k); pts.push(v); }
    }
  }
  const tops = pts.filter((v) => Math.abs(v.y) < 0.01 * S);
  const shoulders = pts.filter((v) => Math.abs(v.y + 0.05 * S) < 0.01 * S);
  const E = [0, 1, 2, 3, 4, 5].map((d) => [Math.cos((d * Math.PI) / 3), -Math.sin((d * Math.PI) / 3)]);
  for (const w of pts) {
    if (Math.abs(w.y + 0.1 * S) > 0.01 * S) continue;
    const sh = shoulders.find((v) => Math.hypot(v.x - w.x, v.z - w.z) < 0.01 * S);
    if (!sh) continue;
    let best: THREE.Vector3 | null = null, bd = 0.12 * S;
    for (const t of tops) { const d = Math.hypot(t.x - sh.x, t.z - sh.z); if (d < bd) { bd = d; best = t; } }
    if (!best) continue;
    let ox = best.x - sh.x, oz = best.z - sh.z;
    let onEdge = false;
    for (let d = 0; d < 6; d++) {
      if ((w.x * E[d][0] + w.z * E[d][1]) / S < 0.985) continue;
      // on the hex boundary: a canonical move ALONG the edge toward its midpoint (the channel centre — rivers cross
      // edges perpendicularly at the midpoint), identical for both tiles sharing the edge whatever their inside
      const tx = -E[d][1], tz = E[d][0];
      const along = w.x * tx + w.z * tz;
      if (Math.abs(along) < 1e-3) { onEdge = true; break; }
      ox = Math.sign(along) * tx;
      oz = Math.sign(along) * tz;
      onEdge = true;
      break;
    }
    const l = Math.hypot(ox, oz);
    if (l < 1e-4 || (onEdge && Math.abs(l - 1) > 1e-6 && l < 1e-3)) continue;
    const ux = -ox / l, uz = -oz / l;
    m.set(vkey(w), [ux * BANK, uz * BANK]);
    // the shoulder above it moves onto the straight line lip → shifted waterline (half way down: y −0.375 of −0.75),
    // otherwise it stays a 10–15 cm pit in the slope — a dark notch at every tile seam / crease along bend banks.
    // Lip distance from the shoulder along the move direction: on the boundary the canonical lip (0.512 − 0.462 units),
    // inside the tile the nearest top vertex.
    const lipD = onEdge ? 0.05 * S : Math.max(0, (best.x - sh.x) * -ux + (best.z - sh.z) * -uz);
    const shMove = (BANK - lipD) / 2;
    if (shMove > 0) m.set(vkey(sh), [ux * shMove, uz * shMove]);
  }
  bankCache.set(a, m);
  return m;
}

const samplerCache = new WeakMap<object, (x: number, z: number) => number>();
/**
 * Highest surface y of a static asset at local (x, z) (metres, asset frame); −Infinity outside. Triangles are binned
 * into a 24×24 grid over the asset's footprint (same results as testing every triangle, far fewer tests); cached per
 * asset object (the bridge's appended underlay part is added after its sampler is built).
 */
export function surfaceSampler(a: { parts: { geometry: THREE.BufferGeometry; matrix: THREE.Matrix4 }[] }): (x: number, z: number) => number {
  const hit = samplerCache.get(a);
  if (hit) return hit;
  const T: number[] = []; // ax, ay, az, bx, by, bz, cx, cy, cz per triangle
  const v = new THREE.Vector3();
  for (const part of a.parts) {
    const g = part.geometry, P = g.attributes.position, I = g.index;
    const n = I ? I.count : P.count;
    for (let i = 0; i + 2 < n; i += 3)
      for (let k = 0; k < 3; k++) {
        v.fromBufferAttribute(P, I ? I.getX(i + k) : i + k).applyMatrix4(part.matrix);
        T.push(v.x, v.y, v.z);
      }
  }
  let x0 = Infinity, x1 = -Infinity, z0 = Infinity, z1 = -Infinity;
  for (let i = 0; i < T.length; i += 3) { x0 = Math.min(x0, T[i]); x1 = Math.max(x1, T[i]); z0 = Math.min(z0, T[i + 2]); z1 = Math.max(z1, T[i + 2]); }
  const G = 24, sx = (x1 - x0) / G || 1, sz = (z1 - z0) / G || 1;
  const cells: number[][] = Array.from({ length: G * G }, () => []);
  const cl = (t: number) => Math.max(0, Math.min(G - 1, t));
  for (let t = 0; t < T.length / 9; t++) {
    const o = t * 9;
    const tx0 = Math.min(T[o], T[o + 3], T[o + 6]), tx1 = Math.max(T[o], T[o + 3], T[o + 6]);
    const tz0 = Math.min(T[o + 2], T[o + 5], T[o + 8]), tz1 = Math.max(T[o + 2], T[o + 5], T[o + 8]);
    for (let gx = cl(Math.floor((tx0 - x0) / sx - 1e-6)); gx <= cl(Math.floor((tx1 - x0) / sx + 1e-6)); gx++)
      for (let gz = cl(Math.floor((tz0 - z0) / sz - 1e-6)); gz <= cl(Math.floor((tz1 - z0) / sz + 1e-6)); gz++) cells[gx * G + gz].push(o);
  }
  const f = (x: number, z: number) => {
    if (x < x0 - 1e-6 || x > x1 + 1e-6 || z < z0 - 1e-6 || z > z1 + 1e-6) return -Infinity;
    const list = cells[cl(Math.floor((x - x0) / sx)) * G + cl(Math.floor((z - z0) / sz))];
    let top = -Infinity;
    for (const o of list) {
      const ax = T[o], ay = T[o + 1], az = T[o + 2], bx = T[o + 3], by = T[o + 4], bz = T[o + 5], cx = T[o + 6], cy = T[o + 7], cz = T[o + 8];
      const d = (bz - cz) * (ax - cx) + (cx - bx) * (az - cz);
      if (Math.abs(d) < 1e-9) continue;
      const l1 = ((bz - cz) * (x - cx) + (cx - bx) * (z - cz)) / d;
      const l2 = ((cz - az) * (x - cx) + (ax - cx) * (z - cz)) / d;
      const l3 = 1 - l1 - l2;
      if (l1 < -1e-6 || l2 < -1e-6 || l3 < -1e-6) continue;
      top = Math.max(top, l1 * ay + l2 * by + l3 * cy);
    }
    return top;
  };
  samplerCache.set(a, f);
  return f;
}


/** uv of the highest triangle of an asset above local (x, z) (asset frame); [0, 0] if none. */
function deckUv(a: { parts: { geometry: THREE.BufferGeometry; matrix: THREE.Matrix4 }[] }, x: number, z: number): [number, number] {
  let best = -Infinity, uv: [number, number] = [0, 0];
  for (const part of a.parts) {
    const g = part.geometry, P = g.attributes.position, U = g.attributes.uv, I = g.index;
    if (!U) continue;
    const n = I ? I.count : P.count;
    for (let i = 0; i + 2 < n; i += 3) {
      const id = [0, 1, 2].map((k) => (I ? I.getX(i + k) : i + k));
      const [A, B, C] = id.map((j) => new THREE.Vector3().fromBufferAttribute(P, j).applyMatrix4(part.matrix));
      const d = (B.z - C.z) * (A.x - C.x) + (C.x - B.x) * (A.z - C.z);
      if (Math.abs(d) < 1e-9) continue;
      const l1 = ((B.z - C.z) * (x - C.x) + (C.x - B.x) * (z - C.z)) / d;
      const l2 = ((C.z - A.z) * (x - C.x) + (A.x - C.x) * (z - C.z)) / d;
      const l3 = 1 - l1 - l2;
      if (l1 < -1e-6 || l2 < -1e-6 || l3 < -1e-6) continue;
      const y = l1 * A.y + l2 * B.y + l3 * C.y;
      if (y <= best) continue;
      best = y;
      uv = [l1 * U.getX(id[0]) + l2 * U.getX(id[1]) + l3 * U.getX(id[2]), l1 * U.getY(id[0]) + l2 * U.getY(id[1]) + l3 * U.getY(id[2])];
    }
  }
  return uv;
}

/** Local boxes {x, z, hx, hz} covering the water channel of a river tile (grid sample of its surface, runs along x). */
const WATER_STEP = 1.25;
function waterBoxes(a: { parts: { geometry: THREE.BufferGeometry; matrix: THREE.Matrix4 }[] }): { x: number; z: number; hx: number; hz: number }[] {
  const surf = surfaceSampler(a);
  const out: { x: number; z: number; hx: number; hz: number }[] = [];
  const R = HEX_SCALE * 1.02;
  for (let z = -R; z <= R; z += WATER_STEP) {
    let run: number[] = [];
    const flush = () => {
      if (run.length) out.push({ x: (run[0] + run[run.length - 1]) / 2, z, hx: (run[run.length - 1] - run[0]) / 2 + WATER_STEP * 0.5 + 0.35, hz: WATER_STEP * 0.5 + 0.35 });
      run = [];
    };
    for (let x = -R; x <= R; x += WATER_STEP) {
      const y = surf(x, z);
      if (y > -1e8 && y < -0.5) run.push(x);
      else flush();
    }
    flush();
  }
  return out;
}


/**
 * Terrain softens the top-edge bevel of its grass tiles (rim −0.05 → −0.005 asset units) so seams read as hairlines.
 * Do the same for our road / river tiles (grass-UV rim vertices only; the bevel-ring triangles take the tile's grass
 * texel) so road cells don't look like raised plates between terrain tiles. In place, once per asset.
 */
const RIM_Y = -0.005;
export function softenTileRim(asset: { parts: { geometry: THREE.BufferGeometry; matrix: THREE.Matrix4 }[] } | null): void {
  if (!asset || (asset as { __roadsSoft?: boolean }).__roadsSoft) return;
  (asset as { __roadsSoft?: boolean }).__roadsSoft = true;
  const N3 = [0, 1, 2].map((i) => [Math.cos((i * Math.PI) / 3), -Math.sin((i * Math.PI) / 3)]);
  const v = new THREE.Vector3();
  const inv = new THREE.Matrix4();
  const done = new Set<THREE.BufferGeometry>();
  for (const p of asset.parts) {
    const g = p.geometry;
    if (done.has(g) || g.index) continue;
    done.add(g);
    const P = g.attributes.position as THREE.BufferAttribute, UV = g.attributes.uv as THREE.BufferAttribute | undefined;
    if (!UV) continue;
    inv.copy(p.matrix).invert();
    let gu = 0, gv = 0, gn = 0, changed = 0;
    const isGrass = (i: number) => UV.getX(i) <= 0.125;
    for (let i = 0; i < P.count; i++) {
      v.fromBufferAttribute(P, i).applyMatrix4(p.matrix).divideScalar(HEX_SCALE);
      if (Math.abs(v.y) < 1e-4 && isGrass(i)) { gu += UV.getX(i); gv += UV.getY(i); gn++; }
      if (v.y > -0.03 || v.y < -0.07 || !isGrass(i)) continue;
      let rim = 0;
      for (const [nx, nz] of N3) rim = Math.max(rim, Math.abs(v.x * nx + v.z * nz));
      if (rim < 0.985) continue;
      v.y = RIM_Y;
      v.multiplyScalar(HEX_SCALE).applyMatrix4(inv);
      P.setXYZ(i, v.x, v.y, v.z);
      changed++;
    }
    if (!changed) continue;
    if (gn) {
      gu /= gn; gv /= gn;
      for (let t = 0; t + 2 < P.count; t += 3) {
        let near = true;
        for (let k = 0; k < 3; k++) {
          v.fromBufferAttribute(P, t + k).applyMatrix4(p.matrix).divideScalar(HEX_SCALE);
          if (v.y < -0.03 || !isGrass(t + k)) near = false;
        }
        if (near) for (let k = 0; k < 3; k++) UV.setXY(t + k, gu, gv);
      }
      UV.needsUpdate = true;
    }
    P.needsUpdate = true;
    g.computeVertexNormals();
  }
}


/**
 * Sloped road tiles ship smoothed normals across the ramp (it shades darker than the flat road around it). Give every
 * upward-facing triangle its face normal (non-indexed geometry, in place, once per asset).
 */
export function flatTopNormals(asset: { parts: { geometry: THREE.BufferGeometry }[] } | null): void {
  if (!asset || (asset as { __flatTop?: boolean }).__flatTop) return;
  (asset as { __flatTop?: boolean }).__flatTop = true;
  const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3(), n = new THREE.Vector3();
  for (const part of asset.parts) {
    const g = part.geometry;
    if (g.index) continue;
    const P = g.attributes.position as THREE.BufferAttribute, N = g.attributes.normal as THREE.BufferAttribute | undefined;
    if (!N) continue;
    for (let t = 0; t + 2 < P.count; t += 3) {
      a.fromBufferAttribute(P, t); b.fromBufferAttribute(P, t + 1); c.fromBufferAttribute(P, t + 2);
      n.subVectors(c, b).cross(a.clone().sub(b)).normalize();
      if (n.y < 0) n.negate();
      // keep orientation consistent with the stored normal
      const s0 = N.getY(t) + N.getY(t + 1) + N.getY(t + 2);
      if (n.y < 0.75 || s0 < 1.5) continue;
      for (let k = 0; k < 3; k++) N.setXYZ(t + k, n.x, n.y, n.z);
    }
    N.needsUpdate = true;
  }
}


/**
 * KayKit's sloped road tile is internally inconsistent (the sand strip is a smooth arc, the grass beside it a half
 * ramp → creased "tent" facets and a sunken road on the plateau half). Rebuild it from the flat straight road tile
 * (`hex_road_A`): every top vertex is lifted by the KayKit ramp profile f(x) (x = −1 low edge … +1 high edge, asset
 * units): linear over the low half, flat over the high half — the same profile terrain uses for heightAt / colliders,
 * so the visual matches the walkable surface exactly. Face normals (flat facets: one plane for the slope, one for the
 * plateau). The asset object is updated in place (only roads draws road tiles).
 */
/**
 * Ramp profile f(t) ∈ [0, 1] across a ramp cell (t = −1 foot edge … +1 high edge, asset units), taken from terrain's
 * public `rampPlaneHeight()` (one inclined plane over the whole hex) so road ramps always match terrain's walkable surface (planar once terrain switches to the
 * single inclined plane; the old half-ramp otherwise).
 */
export function terrainRampProfile(): (t: number) => number {
  const api = terrainApi as unknown as Record<string, unknown>;
  const rh = api.rampPlaneHeight as ((c: unknown, x: number, z: number) => number) | undefined;
  const planar = (t: number) => Math.min(1, Math.max(0, (t + 1) / 2));
  if (typeof rh !== 'function') return planar;
  const fake = { q: 0, r: 0, level: 0, slope: { dir: 0, steps: 1 }, water: false, coastMask: 0, biome: 'grass', tags: [], roadMask: 0, riverMask: 0 };
  try {
    const f = (t: number) => rh(fake, t * HEX_SCALE, 0) / LEVEL_H;
    if (!Number.isFinite(f(0)) || Math.abs(f(1) - 1) > 0.05 || Math.abs(f(-1)) > 0.05) return planar;
    return (t: number) => Math.min(1, Math.max(0, f(t)));
  } catch {
    return planar;
  }
}


/** Split every triangle crossing the tile's x = 0 line (asset frame) so a kinked ramp profile is followed exactly. */
function clipX0(g: THREE.BufferGeometry, m: THREE.Matrix4): THREE.BufferGeometry {
  const P = g.attributes.position as THREE.BufferAttribute, UV = g.attributes.uv as THREE.BufferAttribute | undefined;
  const pos: number[] = [], uv: number[] = [];
  const w = new THREE.Vector3();
  type V = { p: THREE.Vector3; u: THREE.Vector2; x: number };
  const push = (v: V) => { pos.push(v.p.x, v.p.y, v.p.z); uv.push(v.u.x, v.u.y); };
  const lerp = (a: V, b: V): V => {
    const t = a.x / (a.x - b.x);
    return { p: a.p.clone().lerp(b.p, t), u: a.u.clone().lerp(b.u, t), x: 0 };
  };
  for (let i = 0; i + 2 < P.count; i += 3) {
    const vs: V[] = [0, 1, 2].map((k) => {
      const p = new THREE.Vector3().fromBufferAttribute(P, i + k);
      return { p, u: UV ? new THREE.Vector2().fromBufferAttribute(UV, i + k) : new THREE.Vector2(), x: w.copy(p).applyMatrix4(m).x };
    });
    const neg = vs.filter((v) => v.x < -1e-6).length, posN = vs.filter((v) => v.x > 1e-6).length;
    if (!neg || !posN) { vs.forEach(push); continue; }
    // rotate so vs[0] is the lone vertex on its side
    let k0 = 0;
    for (let k = 0; k < 3; k++) {
      const s0 = Math.sign(vs[k].x), s1 = Math.sign(vs[(k + 1) % 3].x), s2 = Math.sign(vs[(k + 2) % 3].x);
      if (s0 !== 0 && s1 !== s0 && s2 !== s0) { k0 = k; break; }
    }
    const a = vs[k0], b = vs[(k0 + 1) % 3], c = vs[(k0 + 2) % 3];
    const ab = Math.sign(b.x) === 0 ? b : lerp(a, b), ac = Math.sign(c.x) === 0 ? c : lerp(a, c);
    [a, ab, ac].forEach(push);
    [ab, b, c].forEach(push);
    [ab, c, ac].forEach(push);
  }
  const out = new THREE.BufferGeometry();
  out.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  if (UV) out.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  return out;
}


/**
 * Conforming subdivision (no T-junctions): an edge is split at its midpoint iff wantEdge(a, b) and it is longer than
 * maxLen (xz) — a pure function of the edge, so both triangles sharing it agree; each triangle is then re-triangulated
 * by how many of its edges split (1 → 2, 2 → 3, 3 → 4). Repeated until no edge splits (≤ 8 passes).
 */
function subdivideConforming(g: THREE.BufferGeometry, maxLen: number, wantEdge: (a: THREE.Vector3, b: THREE.Vector3) => boolean): THREE.BufferGeometry {
  const P = g.attributes.position as THREE.BufferAttribute, UV = g.attributes.uv as THREE.BufferAttribute | undefined;
  type V = { p: THREE.Vector3; u: THREE.Vector2 };
  let tris: V[][] = [];
  for (let i = 0; i + 2 < P.count; i += 3)
    tris.push([0, 1, 2].map((k) => ({ p: new THREE.Vector3().fromBufferAttribute(P, i + k), u: UV ? new THREE.Vector2().fromBufferAttribute(UV, i + k) : new THREE.Vector2() })));
  const mid = (a: V, b: V): V => ({ p: a.p.clone().lerp(b.p, 0.5), u: a.u.clone().lerp(b.u, 0.5) });
  const split = (a: V, b: V) => Math.hypot(a.p.x - b.p.x, a.p.z - b.p.z) > maxLen && wantEdge(a.p, b.p);
  for (let pass = 0; pass < 8; pass++) {
    const out: V[][] = [];
    let any = false;
    for (const t of tris) {
      const s = [split(t[0], t[1]), split(t[1], t[2]), split(t[2], t[0])];
      const n = (s[0] ? 1 : 0) + (s[1] ? 1 : 0) + (s[2] ? 1 : 0);
      if (!n) { out.push(t); continue; }
      any = true;
      if (n === 3) {
        const ab = mid(t[0], t[1]), bc = mid(t[1], t[2]), ca = mid(t[2], t[0]);
        out.push([t[0], ab, ca], [ab, t[1], bc], [ca, bc, t[2]], [ab, bc, ca]);
      } else if (n === 1) {
        const k = s.indexOf(true), a = t[k], b = t[(k + 1) % 3], c = t[(k + 2) % 3], m = mid(a, b);
        out.push([a, m, c], [m, b, c]);
      } else {
        const k = s.indexOf(false); // unsplit edge k → k+1; apex c = k+2
        const a = t[k], b = t[(k + 1) % 3], c = t[(k + 2) % 3];
        const mbc = mid(b, c), mca = mid(c, a);
        out.push([mca, mbc, c], [a, b, mbc], [a, mbc, mca]);
      }
    }
    tris = out;
    if (!any) break;
  }
  const pos = new Float32Array(tris.length * 9), uv = new Float32Array(tris.length * 6);
  tris.forEach((t, i) => t.forEach((v, k) => { pos.set([v.p.x, v.p.y, v.p.z], (i * 3 + k) * 3); uv.set([v.u.x, v.u.y], (i * 3 + k) * 2); }));
  const out = new THREE.BufferGeometry();
  out.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  if (UV) out.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  return out;
}

/** Subdivide a non-indexed geometry's triangles (midpoints) until no triangle edge spans more than `maxLen` in x/z. */
function subdivide(g: THREE.BufferGeometry, maxLen: number, want: (a: THREE.Vector3, b: THREE.Vector3, c: THREE.Vector3) => boolean = () => true): THREE.BufferGeometry {
  const P = g.attributes.position as THREE.BufferAttribute, UV = g.attributes.uv as THREE.BufferAttribute | undefined;
  type V = { p: THREE.Vector3; u: THREE.Vector2 };
  let tris: V[][] = [];
  for (let i = 0; i + 2 < P.count; i += 3)
    tris.push([0, 1, 2].map((k) => ({ p: new THREE.Vector3().fromBufferAttribute(P, i + k), u: UV ? new THREE.Vector2().fromBufferAttribute(UV, i + k) : new THREE.Vector2() })));
  const mid = (a: V, b: V): V => ({ p: a.p.clone().lerp(b.p, 0.5), u: a.u.clone().lerp(b.u, 0.5) });
  for (let pass = 0; pass < 8; pass++) {
    const out: V[][] = [];
    let split = false;
    for (const t of tris) {
      const [a, b, c] = t;
      const long = Math.max(Math.hypot(a.p.x - b.p.x, a.p.z - b.p.z), Math.hypot(b.p.x - c.p.x, b.p.z - c.p.z), Math.hypot(c.p.x - a.p.x, c.p.z - a.p.z));
      if (long <= maxLen || !want(a.p, b.p, c.p)) { out.push(t); continue; }
      split = true;
      const ab = mid(a, b), bc = mid(b, c), ca = mid(c, a);
      out.push([a, ab, ca], [ab, b, bc], [ca, bc, c], [ab, bc, ca]);
    }
    tris = out;
    if (!split) break;
  }
  const pos = new Float32Array(tris.length * 9), uv = new Float32Array(tris.length * 6);
  tris.forEach((t, i) => t.forEach((v, k) => { pos.set([v.p.x, v.p.y, v.p.z], (i * 3 + k) * 3); uv.set([v.u.x, v.u.y], (i * 3 + k) * 2); }));
  const out = new THREE.BufferGeometry();
  out.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  if (UV) out.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  return out;
}

/**
 * Road ramp tile = the flat straight road tile (`hex_road_A`) lifted onto terrain's ramp surface: every top vertex
 * (road strip and grass wings alike) gets y += f(x)·rise, after subdividing so the profile is followed exactly →
 * no trench, no step at the top or bottom, road and wings on ONE surface. Face normals. In place, once per asset.
 */
export function rebuildRampTile(slope: { parts: { geometry: THREE.BufferGeometry; material: THREE.Material; matrix: THREE.Matrix4 }[] } | null,
  flat: { parts: { geometry: THREE.BufferGeometry; material: THREE.Material; matrix: THREE.Matrix4 }[] } | null, rise: number,
  profile: (t: number) => number = terrainRampProfile()): void {
  if (!slope || !flat || (slope as { __rebuilt?: boolean }).__rebuilt) return;
  (slope as { __rebuilt?: boolean }).__rebuilt = true;
  const v = new THREE.Vector3();
  slope.parts = flat.parts.map((part) => {
    const g1 = part.geometry.index ? part.geometry.toNonIndexed() : part.geometry.clone();
    // subdivide in asset-local units (part.matrix includes the pack scale): 0.25 units ≈ 1.9 m
    const sc = new THREE.Vector3().setFromMatrixScale(part.matrix).x || 1;
    const inv = part.matrix.clone().invert();
    // no grass bevel on a ramp: its rim vertices (y −0.05 on the hex boundary, outside the road strip) go up to the
    // top, so the inclined plane runs crisp to the hex edge (the bevel made dark V-pits where it met the neighbours'
    // bevels at the ramp-top corners, and a soft "glassy" rim along the walls). The sunken road strip stays.
    {
      const P1 = g1.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < P1.count; i++) {
        v.fromBufferAttribute(P1, i).applyMatrix4(part.matrix).divideScalar(HEX_SCALE);
        if (Math.abs(v.y + 0.05) > 0.01) continue;
        const rim = Math.max(Math.abs(v.x), Math.abs(0.5 * v.x + 0.866 * v.z), Math.abs(-0.5 * v.x + 0.866 * v.z));
        if (rim < 0.985 || Math.abs(v.z) < 0.2) continue;
        v.y = 0;
        v.multiplyScalar(HEX_SCALE).applyMatrix4(inv);
        P1.setXYZ(i, v.x, v.y, v.z);
      }
    }
    const g0 = subdivide(clipX0(g1, part.matrix), 0.25 * HEX_SCALE / sc);
    const P = g0.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < P.count; i++) {
      v.fromBufferAttribute(P, i).applyMatrix4(part.matrix).divideScalar(HEX_SCALE); // asset units
      const w = v.y > -0.5 ? 1 : 0; // top: grass (0), road strip + bevel (−0.05) all follow fully; body bottom (−1) stays
      v.y += w * profile(v.x) * rise;
      v.multiplyScalar(HEX_SCALE).applyMatrix4(inv);
      P.setXYZ(i, v.x, v.y, v.z);
    }
    P.needsUpdate = true;
    g0.computeVertexNormals();
    // soft joints: near the foot and the high edge the top normals bend toward straight up, so the shading meets
    // the flat neighbours without a hard tone break at the hex edge (the slope keeps its true normal in the middle)
    const N = g0.attributes.normal as THREE.BufferAttribute;
    const upL = new THREE.Vector3(0, 1, 0).applyMatrix3(new THREE.Matrix3().getNormalMatrix(inv)).normalize();
    const n = new THREE.Vector3();
    for (let i = 0; i < P.count; i++) {
      n.fromBufferAttribute(N, i);
      if (n.dot(upL) < 0.6) continue; // side walls keep their face normals
      v.fromBufferAttribute(P, i).applyMatrix4(part.matrix).divideScalar(HEX_SCALE);
      const e = 1 - Math.min(1, Math.abs(v.x)); // 0 at the foot / high edge, 1 in the middle
      const k = 0.4 * (e >= 0.45 ? 1 : (e / 0.45) * (e / 0.45) * (3 - 2 * (e / 0.45)));
      n.lerp(upL, 1 - k).normalize(); // ≤ 40 % of the tilt in the shading: the road reads as the same ground
      N.setXYZ(i, n.x, n.y, n.z);
    }
    N.needsUpdate = true;
    g0.computeBoundingBox();
    g0.computeBoundingSphere();
    return { geometry: g0, material: part.material, matrix: part.matrix };
  });
}

/** Surface functions of one road-ramp shape (see RoadRenderer.rampFns). */
interface RampFns {
  key: string; dir: number; raise: number;
  W: (xa: number, za: number, y: number) => number[];
  toFrame: (lx: number, lz: number) => [number, number];
  plane: (xa: number) => number; zmax: (xa: number) => number;
  height: (xa: number, za: number) => number; walk: (xa: number, za: number) => number;
  STRIP: number; BEV: number; WIDEN: number;
}

/** The running renderer (set by its constructor) — backs the pure `roadSinkAt` query. */
let activeRenderer: RoadRenderer | null = null;
/** Distance (m) over which the road sink fades out toward a ramp / bridge cell edge. */
const SINK_FADE = 2.5;

/**
 * Depth (m, ≥ 0) of the rendered road surface below the cell's grass height at world (x, z): 0 off the road, ROAD_SINK
 * (terrain's constant, 0.05 · HEX_SCALE = 0.375 m) on the strip, the bevel ramp in between — read from the very tile variant that is drawn
 * (crossings and bends included). Flat road cells and road ramps (the procedural ramp tile's walkable strip below
 * terrain's ramp plane); 0 on bridge and river cells (their own surfaces).
 */
/** debug: the renderer backing roadSinkAt */
export function activeRoadRenderer(): RoadRenderer | null {
  return activeRenderer;
}
export function roadSinkAt(x: number, z: number): number {
  const r = activeRenderer;
  if (!r) return 0;
  const a = worldToAxial(x, z), h = hexRound(a.q, a.r);
  const c = r.cellAt(h.q, h.r);
  if (!c.roadMask || c.bridge || c.riverMask || c.water) return 0;
  const p = hexToWorld(h.q, h.r);
  if (c.slope) return r.rampSink(c, x - p.x, z - p.z);
  return -r.roadSurfaceOffset(c, x - p.x, z - p.z);
}

export class RoadRenderer {
  stats: RenderStats = { chunks: 0, ms: 0, maxMs: 0, roadTiles: 0, riverTiles: 0, bridges: 0, missing: 0 };
  private mats = new Map<string, THREE.Material>();
  private bridge: BridgeShape | null = null;
  /** debug: extra bridge rotation in degrees (?bridgeRot=) */
  bridgeRotDeg = 0;
  /** debug: which bridge model (?bridge=A|B) */
  bridgeModel = 'B';

  /** debug (?bevelv1): the pre-2026-10-07 walk surface (riser probe 'before' counts) */
  private oldBevel = false;
  constructor(private ctx: CoreContext) {
    activeRenderer = this;
    this.oldBevel = ctx.params.has('bevelv1');
    this.bridgeRotDeg = Number(ctx.params.get('bridgeRot') ?? 0);
    if (ctx.params.get('bridge') === 'A') this.bridgeModel = 'A';
  }

  /** Terrain's tile material (same tonal patches / side bands as the neighbouring grass), cached per look. */
  private material(id: string, lk: 'plain' | 'dirt', ramp = false): THREE.Material | undefined {
    if (ramp) {
      // ramp tiles: terrain's per-level tint is a hard step (floor of the height) that cut across the slope; on
      // ramps it becomes continuous (equal to the flat value at both the foot and the high edge)
      let r = this.mats.get(lk + ':ramp');
      if (r) return r;
      const b = this.material(id, lk);
      if (!b) return undefined;
      r = b.clone();
      const prev = b.onBeforeCompile;
      r.onBeforeCompile = (sh, rd) => {
        prev.call(r, sh, rd);
        sh.fragmentShader = sh.fragmentShader.replace('floor((vTWP.y + 0.5) / 3.75)', '(vTWP.y / 3.75)');
      };
      const key = b.customProgramCacheKey();
      r.customProgramCacheKey = () => key + '-roadramp';
      this.mats.set(lk + ':ramp', r);
      return r;
    }
    let m = this.mats.get(lk);
    if (m) return m;
    // terrain's own base (hex_grass): same atlas, same material parameters → identical grass tone
    const base = this.ctx.assets.get('hex/tiles/base/hex_grass')?.parts[0]?.material ?? this.ctx.assets.get(id)?.parts[0]?.material;
    const mk = (look as unknown as Record<string, unknown>).makeTerrainMaterial as ((b: THREE.Material, l: string) => THREE.Material) | undefined;
    if (!base || !mk || this.ctx.params.has('plainmat')) return undefined;
    try {
      m = mk(base, lk);
      // terrain's look is FrontSide; KayKit road/river tiles have mixed winding (e.g. the ramp tile) → keep DoubleSide
      m.side = THREE.DoubleSide;
    } catch {
      return undefined;
    }
    this.mats.set(lk, m);
    return m;
  }

  private place(out: ChunkBuilder, id: string, x: number, y: number, z: number, rotY: number, mat?: THREE.Material, shadow = true, scale = 1): boolean {
    _q.setFromAxisAngle(Y, rotY);
    _m.compose(_p.set(x, y, z), _q, _s.setScalar(scale));
    const ok = out.add(id, _m, mat ? { material: mat, castShadow: shadow } : { castShadow: shadow });
    if (!ok) this.stats.missing++;
    return ok;
  }

  build(chunk: ChunkInfo, out: ChunkBuilder): void {
    const t0 = performance.now();
    const v0 = this.variants.size, b0 = this.beds.size;
    const world = this.ctx.world;
    const R = this.ctx.rapier;
    // road / river tiles are emitted as per-cell variants (welded grass edges) and merged per material at the end
    const groups = new Map<THREE.Material, { g: THREE.BufferGeometry; x: number; y: number; z: number }[]>();
    const emit = (g: THREE.BufferGeometry | null, mat: THREE.Material | undefined, x: number, y: number, z: number) => {
      if (!g || !mat) return false;
      let l = groups.get(mat);
      if (!l) groups.set(mat, (l = []));
      l.push({ g, x, y, z });
      return true;
    };
    const tile = (id: string, rotY: number, c: Readonly<CellData>, x: number, y: number, z: number, mat: THREE.Material | undefined) => {
      if (this.ctx.params.has('noweld')) return this.place(out, id, x, y, z, rotY, mat);
      const g = this.variant(id, rotY, this.weldMask(c), c.riverMask ? 0 : c.roadMask);
      return emit(g, mat ?? this.ctx.assets.get(id)?.parts[0]?.material, x, y, z) || this.place(out, id, x, y, z, rotY, mat);
    };
    for (const { q, r } of chunk.cells) {
      const c = world.cell(q, r);
      if (!c.roadMask && !c.riverMask) continue;
      const p = hexToWorld(q, r);
      const y0 = c.level * LEVEL_H;
      // tile sides show on cliffs: use terrain's dirt look where a neighbour is ≥ 2 levels lower (as terrain does)
      // terrain now uses its dirt look for every land tile (grass tops identical; vertical faces = dirt bands with a
      // grass lip) → same material on road tiles, so ramp side walls look like terrain's ramp walls
      const lk: 'plain' | 'dirt' = 'dirt';
      if (c.riverMask && c.roadMask) {
        // plain river tile under the bridge (the crossing tile's own road strip showed as a sliver under the arch);
        // the bridge feet carry the road from cell edge to cell edge. `?xtile=1` restores the crossing tile.
        const m = this.ctx.params.has('xtile') ? matchCrossing(c.riverMask, c.roadMask) : matchTile('river', c.riverMask);
        if (m) {
          const bed = this.ctx.params.has('xtile') ? null : this.bridgeBed(m.asset, m.rotY, c);
          const bmat = this.material(m.asset, lk) ?? this.ctx.assets.get(m.asset)?.parts[0]?.material;
          if (!emit(bed, bmat, p.x, y0, p.z)) tile(m.asset, m.rotY, c, p.x, y0, p.z, this.material(m.asset, lk));
          const toDeck = this.placeBridge(out, R, c, p.x, y0, p.z);
          this.bridgeBlockers(out, R, m.asset, m.rotY, p.x, y0, p.z, toDeck);
          this.stats.bridges++;
          continue;
        }
      }
      if (c.riverMask) {
        const straight = c.riverMask === 9 || c.riverMask === 18 || c.riverMask === 36;
        const curvy = false && straight && hash(q, r, 77) % 5 < 2; // curvy tiles pinch the banks at cell borders
        const m = matchTile('river', c.riverMask, { curvy }) ?? matchTileNearest('river', c.riverMask);
        if (m) tile(m.asset, m.rotY, c, p.x, y0, p.z, this.material(m.asset, lk));
        if (m && !this.ctx.params.has('noriverdeco')) this.riverDeco(out, m.asset, m.rotY, c, p.x, y0, p.z);
        if (m) this.riverBlockers(out, R, m.asset, m.rotY, p.x, y0, p.z, false);
        this.stats.riverTiles++;
        continue;
      }
      const m = c.slope
        ? matchTile('road', c.roadMask, { slope: c.slope }) ?? matchTileNearest('road', c.roadMask)
        : matchTile('road', c.roadMask) ?? matchTileNearest('road', c.roadMask);
      if (m && c.slope && !this.ctx.params.has('noweld') && !this.ctx.params.has('rampwalls')) {
        const rt = this.rampTile(m.asset, m.rotY, c);
        const mat = this.material(m.asset, lk, true) ?? this.ctx.assets.get(m.asset)?.parts[0]?.material;
        if (!rt || !emit(rt.geo, mat, p.x, y0, p.z)) this.place(out, m.asset, p.x, y0, p.z, m.rotY, this.material(m.asset, lk, true));
        if (rt?.col) {
          const desc = R.ColliderDesc.trimesh(rt.col, Uint32Array.from({ length: rt.col.length / 3 }, (_, i) => i));
          if (desc) out.addCollider(desc.setTranslation(p.x, y0, p.z).setCollisionGroups(WORLD_GROUPS));
        }
      } else if (m) tile(m.asset, m.rotY, c, p.x, y0, p.z, this.material(m.asset, lk, !!c.slope));
      if (m && !c.slope && !this.ctx.params.has('nosink')) {
        // the capsule rests on the visible road (strip 0.375 m below the grass); terrain lowers its prism top on
        // flat road cells so this trimesh is the top surface there
        const fc = this.flatCollider(c);
        const desc = fc && R.ColliderDesc.trimesh(fc, Uint32Array.from({ length: fc.length / 3 }, (_, i) => i));
        if (desc) out.addCollider(desc.setTranslation(p.x, y0, p.z).setCollisionGroups(WORLD_GROUPS));
      }
      if (m && !c.slope && !this.ctx.params.has('noberm')) this.roadBerm(out, R, c, p.x, y0, p.z, this.material(m.asset, lk) ?? this.ctx.assets.get(m.asset)?.parts[0]?.material, emit);
      this.stats.roadTiles++;
    }
    for (const [mat, items] of groups) {
      let n = 0;
      for (const it of items) n += it.g.attributes.position.count;
      const pos = new Float32Array(n * 3), nor = new Float32Array(n * 3), uv = new Float32Array(n * 2);
      let o = 0;
      for (const it of items) {
        const P = it.g.attributes.position.array as Float32Array, N = it.g.attributes.normal.array as Float32Array, U = it.g.attributes.uv.array as Float32Array;
        const k = P.length / 3;
        for (let i = 0; i < k; i++) {
          pos[(o + i) * 3] = P[i * 3] + it.x;
          pos[(o + i) * 3 + 1] = P[i * 3 + 1] + it.y;
          pos[(o + i) * 3 + 2] = P[i * 3 + 2] + it.z;
        }
        nor.set(N, o * 3);
        uv.set(U, o * 2);
        o += k;
      }
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      g.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
      g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
      g.computeBoundingSphere();
      const mesh = new THREE.Mesh(g, mat);
      mesh.name = 'roads-tiles';
      mesh.castShadow = mesh.receiveShadow = true;
      mesh.matrixAutoUpdate = false;
      out.addObject(mesh);
    }
    const ms = performance.now() - t0;
    this.stats.chunks++;
    this.stats.ms += ms;
    this.stats.maxMs = Math.max(this.stats.maxMs, ms);
    if (ms > 12) {
      const slow = ((this.stats as unknown as { slow?: unknown[] }).slow ??= []);
      if (slow.length < 30) slow.push({ ms: +ms.toFixed(1), t: +(performance.now() / 1000).toFixed(1), newVariants: this.variants.size - v0, newBeds: this.beds.size - b0, cells: chunk.cells.length });
    }
  }

  // ------------------------------------------------------------------ flat road surface (heightAt + collider)
  cellAt(q: number, r: number): Readonly<CellData> {
    return this.ctx.world.cell(q, r);
  }
  private flatTiles = new Map<number, { id: string; rotY: number; weld: number; fade: number[]; mask: number } | null>();
  private flatTile(c: Readonly<CellData>): { id: string; rotY: number; weld: number; fade: number[]; mask: number } | null {
    // memo per cell (heightAt runs per frame and per scattered instance; weldMask reads 6 neighbours)
    const k = (c.q + 0x8000) * 0x10000 + (c.r + 0x8000);
    let f = this.flatTiles.get(k);
    if (f !== undefined) return f;
    const m = matchTile('road', c.roadMask) ?? matchTileNearest('road', c.roadMask);
    // road edges into a ramp or bridge cell: those keep their own (unsunk) walkable surface (terrain's ramp plane, the
    // deck), so the sink fades out toward that edge — else a 0.375 m step stood at the ramp foot / deck end
    const fade: number[] = [];
    if (m) for (let d = 0; d < 6; d++) {
      if (!((c.roadMask >> d) & 1)) continue;
      const n = this.ctx.world.cell(c.q + DIRS[d][0], c.r + DIRS[d][1]);
      if (n.bridge) fade.push(d); // (road ramps carry the same sunk strip since 2026-10-07: no fade needed)
    }
    f = m ? { id: m.asset, rotY: m.rotY, weld: this.weldMask(c), fade, mask: c.roadMask } : null;
    if (this.flatTiles.size > 50000) this.flatTiles.clear();
    this.flatTiles.set(k, f);
    return f;
  }
  private flatSamplers = new Map<string, ((x: number, z: number) => number) | null>();
  private walkMemo = new Map<string, Float32Array | null>();
  /**
   * Walkable top of a drawn flat road tile (cell-local triangles): the variant's up-facing faces, with the strip bevel
   * widened from 45° to ≤ 26° (bevel tops 0.2 m outward, strip edges 0.2 m inward; along the hex edge on the
   * boundary, so neighbouring tiles agree). The character controller treated the 45° bevel (0.375 m) as a wall (3 wall stops
   * crossing strip → verge). Collider AND heightAt use this surface; it deviates from the drawn bevel by ≤ 0.1 m.
   */
  private walkTris(f: { id: string; rotY: number; weld: number; mask: number }): Float32Array | null {
    const key = f.id + '|' + f.rotY.toFixed(3) + '|' + f.weld + '|' + f.mask;
    if (this.walkMemo.has(key)) return this.walkMemo.get(key)!;
    const g = this.variant(f.id, f.rotY, f.weld, f.mask);
    let out: Float32Array | null = null;
    if (g) {
      const P = g.attributes.position, v: number[] = [];
      for (let t = 0; t + 2 < P.count; t += 3) {
        const a = [P.getX(t), P.getY(t), P.getZ(t)], b = [P.getX(t + 1), P.getY(t + 1), P.getZ(t + 1)], c2 = [P.getX(t + 2), P.getY(t + 2), P.getZ(t + 2)];
        const ux = b[0] - a[0], uy = b[1] - a[1], uz = b[2] - a[2], wx = c2[0] - a[0], wy = c2[1] - a[1], wz = c2[2] - a[2];
        const ny = uz * wx - ux * wz, l = Math.hypot(uy * wz - uz * wy, ny, ux * wy - uy * wx);
        if (l < 1e-9 || Math.abs(ny) / l < 0.3 || Math.min(a[1], b[1], c2[1]) < -0.06 * HEX_SCALE) continue; // walls, bottoms, backstop cap
        v.push(...a, ...b, ...c2);
      }
      // bevel softening: every vertex of a steep face (> ~27°) moves away from the road's centre line by
      // SHIFT · (1 − 2 f), f = its depth / ROAD_SINK: bevel tops outward, strip edges inward, mid-bevel vertices stay —
      // the 0.375 m bevel (KayKit 45°, partly steeper) becomes ≥ 0.78 m wide (≤ 26°), whatever its own vertex rows.
      // (Face gradients cancelled at the bevel ends; the centre-line direction is unambiguous.)
      const S = HEX_SCALE, E = [0, 1, 2, 3, 4, 5].map((d) => [Math.cos((d * Math.PI) / 3), -Math.sin((d * Math.PI) / 3)]);
      const vk = (i: number) => Math.round(v[i] * 1000) + ',' + Math.round(v[i + 1] * 1000) + ',' + Math.round(v[i + 2] * 1000);
      const steepV = new Set<string>();
      for (let t = 0; t < v.length; t += 9) {
        const ux = v[t + 3] - v[t], uy = v[t + 4] - v[t + 1], uz = v[t + 5] - v[t + 2], wx = v[t + 6] - v[t], wy = v[t + 7] - v[t + 1], wz = v[t + 8] - v[t + 2];
        const nx = uy * wz - uz * wy, ny = uz * wx - ux * wz, nz = ux * wy - uy * wx;
        if (Math.hypot(nx, nz) < 0.5 * Math.abs(ny)) continue; // gentler than ~27°
        // only the strip bevel: faces within 2.8 m of a road centre line (kept rims at drops are cliff edges)
        const fx = (v[t] + v[t + 3] + v[t + 6]) / 3, fz = (v[t + 2] + v[t + 5] + v[t + 8]) / 3;
        let fdr = Infinity;
        for (let d = 0; d < 6; d++) {
          if (!((f.mask >> d) & 1)) continue;
          const ex2 = E[d][0] * S, ez2 = E[d][1] * S, tt = Math.max(0, Math.min(1, (fx * ex2 + fz * ez2) / (ex2 * ex2 + ez2 * ez2)));
          fdr = Math.min(fdr, Math.hypot(fx - tt * ex2, fz - tt * ez2));
        }
        if (fdr > 2.8 && !this.oldBevel) continue;
        for (let k = 0; k < 3; k++) steepV.add(vk(t + 3 * k));
      }
      // grass vertices at the bevel's top edge that only flat faces use (KayKit adds a few near the tile ends): they
      // move too, else a flat face kept spanning the widened bevel and stood 5 cm above it
      const tops: number[] = [];
      for (let i = 0; i < v.length; i += 3) if (v[i + 1] > -0.004 * S && steepV.has(vk(i))) tops.push(v[i], v[i + 2]);
      for (let i = 0; i < v.length; i += 3) {
        if (v[i + 1] <= -0.004 * S || steepV.has(vk(i))) continue;
        for (let j = 0; j < tops.length; j += 2) if (Math.hypot(v[i] - tops[j], v[i + 2] - tops[j + 1]) < 0.45) { steepV.add(vk(i)); break; }
      }
      const dirs = [0, 1, 2, 3, 4, 5].filter((d) => (f.mask >> d) & 1);
      // uphill directions of the steep faces around each vertex: where they agree (inner corners of bends, crossings,
      // strip ends) they are the right "outward"; where they cancel (bevel ends) the centre-line direction is used
      const grad = new Map<string, [number, number, number]>();
      for (let t = 0; t < v.length; t += 9) {
        const ux = v[t + 3] - v[t], uy = v[t + 4] - v[t + 1], uz = v[t + 5] - v[t + 2], wx = v[t + 6] - v[t], wy = v[t + 7] - v[t + 1], wz = v[t + 8] - v[t + 2];
        let nx = uy * wz - uz * wy, ny = uz * wx - ux * wz, nz = ux * wy - uy * wx;
        if (ny < 0) { nx = -nx; ny = -ny; nz = -nz; }
        if (Math.hypot(nx, nz) < 0.5 * ny) continue;
        const gx = -nx, gz = -nz, gl = Math.hypot(gx, gz) || 1;
        for (let k = 0; k < 3; k++) { const id = vk(t + 3 * k); const e = grad.get(id) ?? [0, 0, 0]; grad.set(id, [e[0] + gx / gl, e[1] + gz / gl, e[2] + 1]); }
      }
      const SHIFT = 0.2;
      const moved = new Map<string, [number, number]>();
      for (let i = 0; i < v.length; i += 3) {
        const id = vk(i);
        if (!steepV.has(id)) continue;
        let m = moved.get(id);
        if (!m) {
          // outward = from the nearest point of the road centre lines (centre → edge midpoints)
          let best = Infinity, ox = 0, oz = 0;
          for (const d of dirs) {
            const ex = E[d][0] * S, ez = E[d][1] * S;
            const tt = Math.max(0, Math.min(1, (v[i] * ex + v[i + 2] * ez) / (ex * ex + ez * ez)));
            const qx = v[i] - tt * ex, qz = v[i + 2] - tt * ez, dd = Math.hypot(qx, qz);
            if (dd < best) { best = dd; ox = qx; oz = qz; }
          }
          let dx = ox, dz = oz;
          const gr = grad.get(id);
          if (!this.oldBevel && gr && gr[2] > 0 && Math.hypot(gr[0], gr[1]) >= 0.6 * gr[2]) { dx = gr[0]; dz = gr[1]; } // consistent face gradients win
          for (let d = 0; d < 6; d++)
            if ((v[i] * E[d][0] + v[i + 2] * E[d][1]) / S > 0.985) { const tx = -E[d][1], tz = E[d][0], dt = dx * tx + dz * tz; dx = tx * dt; dz = tz * dt; }
          const dl = Math.hypot(dx, dz);
          const fr = Math.max(0, Math.min(1, -v[i + 1] / ROAD_SINK));
          const sh = dl > 0.05 ? (SHIFT * (1 - 2 * fr)) / dl : 0;
          m = [dx * sh, dz * sh];
          moved.set(id, m);
        }
        v[i] += m[0]; v[i + 2] += m[1];
      }
      out = v.length ? new Float32Array(v) : null;
    }
    this.walkMemo.set(key, out);
    return out;
  }
  /**
   * Walkable road-tile surface relative to the cell's grass height (≤ 0) at cell-local (lx, lz): `walkTris`, limited to
   * the road corridor (≤ 3 m from the strip's centre lines) so the kept terrace rims at drops stay terrain's business
   * (terrain's heightAt ignores its own rims too), faded out toward ramp / bridge edges. 0 elsewhere.
   */
  roadSurfaceOffset(c: Readonly<CellData>, lx: number, lz: number): number {
    let dr = Infinity;
    for (let d = 0; d < 6; d++) {
      if (!((c.roadMask >> d) & 1)) continue;
      const ex = Math.cos((d * Math.PI) / 3) * HEX_SCALE, ez = -Math.sin((d * Math.PI) / 3) * HEX_SCALE;
      const t = Math.max(0, Math.min(1, (lx * ex + lz * ez) / (ex * ex + ez * ez)));
      dr = Math.min(dr, Math.hypot(lx - t * ex, lz - t * ez));
    }
    if (dr > 3) return 0;
    const f = this.flatTile(c);
    if (!f) return 0;
    const key = f.id + '|' + f.rotY.toFixed(3) + '|' + f.weld + '|' + f.mask;
    let smp = this.flatSamplers.get(key);
    if (smp === undefined) {
      const w = this.walkTris(f);
      if (w) {
        const g = new THREE.BufferGeometry();
        g.setAttribute('position', new THREE.Float32BufferAttribute(w, 3));
        smp = surfaceSampler({ parts: [{ geometry: g, matrix: new THREE.Matrix4() }] });
      } else smp = null;
      this.flatSamplers.set(key, smp);
    }
    if (!smp) return 0;
    const y = smp(lx, lz);
    if (!Number.isFinite(y)) return 0;
    let k = 1;
    for (const d of f.fade) {
      // distance to edge d (inner radius 7.5 m along its normal), faded over SINK_FADE
      const de = HEX_SCALE - (lx * Math.cos((d * Math.PI) / 3) - lz * Math.sin((d * Math.PI) / 3));
      const t = Math.max(0, Math.min(1, de / SINK_FADE));
      k = Math.min(k, t * t * (3 - 2 * t));
    }
    return Math.min(0, Math.max(-1.2 * ROAD_SINK, y)) * k;
  }
  /** Trimesh of the flat road cell's walkable top (strip, softened bevel, verge), cell-local. */
  private flatCollider(c: Readonly<CellData>): Float32Array | null {
    const f = this.flatTile(c);
    if (!f) return null;
    if (f.fade.length) return this.latticeCollider(c);
    return this.walkTris(f);
  }

  /** Fine lattice of `roadSurfaceOffset` (cells whose sink fades toward a ramp / bridge edge), cell-local. */
  private latticeCollider(c: Readonly<CellData>): Float32Array {
    const N = 28, Rc = (2 / Math.sqrt(3)) * HEX_SCALE, v: number[] = [];
    const K = (i: number) => { const a = ((((i % 6) + 6) % 6) + 0.5) * (Math.PI / 3); return [Rc * Math.cos(a), -Rc * Math.sin(a)]; };
    for (let s6 = 0; s6 < 6; s6++) {
      const k1 = K(s6 - 1), k2 = K(s6);
      const P = (i: number, j: number) => {
        const lx = (k1[0] * (i - j) + k2[0] * j) / N, lz = (k1[1] * (i - j) + k2[1] * j) / N;
        return [lx, this.roadSurfaceOffset(c, lx, lz), lz];
      };
      for (let i = 0; i < N; i++)
        for (let j = 0; j <= i; j++) {
          v.push(...P(i, j), ...P(i + 1, j), ...P(i + 1, j + 1));
          if (j < i) v.push(...P(i, j), ...P(i + 1, j + 1), ...P(i, j + 1));
        }
    }
    return new Float32Array(v);
  }

  // ------------------------------------------------------------------ road-cell berms
  /**
   * A flat road cell beside the SIDE of a ramp at its own level (a terrain tongue or a road ramp whose side faces this
   * cell): terrain embanks such flanks with an earth shoulder, but never road cells, so the ramp's dirt skirt stood as a
   * sharp brown triangle next to the road (critic r3 / terrain's crack check). The road tile gets the same shoulder:
   * terrain's embankment profile (ramp side height × (1 − s / 6.5 m)), faded to 0 at this cell's other same-level edges
   * (3 m, not near the ramp edge — terrain's rule) and kept off the road strip with a ≤ 35° flank (h ≤ 0.7 · (d − 2.8 m)
   * from the strip centre line). Visual lattice + trimesh collider on the raised part; skirts are visual only.
   */
  private roadBerm(out: ChunkBuilder, R: typeof RAPIER, c: Readonly<CellData>, x: number, y0: number, z: number, mat: THREE.Material | undefined, emit: (g: THREE.BufferGeometry | null, m: THREE.Material | undefined, x: number, y: number, z: number) => boolean): void {
    const world = this.ctx.world;
    const ramps: { d: number; n: Readonly<CellData> }[] = [];
    const nb: Readonly<CellData>[] = [];
    for (let d = 0; d < 6; d++) {
      const n = world.cell(c.q + DIRS[d][0], c.r + DIRS[d][1]);
      nb.push(n);
      if (!n.slope || n.riverMask || n.water || n.level !== c.level) continue;
      const rel = ((d + 3) % 6 - n.slope.dir + 6) % 6;
      if (rel === 1 || rel === 2 || rel === 4 || rel === 5) ramps.push({ d, n });
    }
    if (!ramps.length || !mat) return;
    const grass = this.grassTexel();
    if (!grass) return;
    const A = HEX_SCALE, Rc = (2 / Math.sqrt(3)) * A, EMB_W = 6.5, EMB_FADE = 3;
    const E = [0, 1, 2, 3, 4, 5].map((d) => [Math.cos((d * Math.PI) / 3), -Math.sin((d * Math.PI) / 3)]);
    const K = (i: number) => { const a = ((((i % 6) + 6) % 6) + 0.5) * (Math.PI / 3); return [Rc * Math.cos(a), -Rc * Math.sin(a)]; }; // corner between edge i and i+1
    const segDist = (px: number, pz: number, ax: number, az: number, bx: number, bz: number) => {
      const ex = bx - ax, ez = bz - az, t = Math.max(0, Math.min(1, ((px - ax) * ex + (pz - az) * ez) / (ex * ex + ez * ez)));
      return Math.hypot(px - ax - t * ex, pz - az - t * ez);
    };
    const edgeDist = (px: number, pz: number, d: number) => { const a = K(d - 1), b = K(d); return segDist(px, pz, a[0], a[1], b[0], b[1]); };
    const rampEdge = new Set(ramps.map((o) => o.d));
    // terrain's free edges: same-level, dry, not one of our ramps (terrain fades its own shoulders there too)
    const free = [0, 1, 2, 3, 4, 5].filter((d) => !rampEdge.has(d) && !nb[d].water && nb[d].level === c.level);
    const roadDirs = [0, 1, 2, 3, 4, 5].filter((d) => (c.roadMask >> d) & 1);
    // same-level neighbours terrain embanks itself: meet their shoulder exactly on the shared edge (heightAt is
    // terrain's rendered embankment lattice), blended in over EMB_FADE — else the berm stood 1.1 m above it there
    const embEdges = free.filter((d) => !nb[d].roadMask && !nb[d].riverMask && nb[d].tags.includes('embankment'));
    const height = (lx: number, lz: number): number => {
      let h = bermCore(lx, lz);
      for (const d of embEdges) {
        const a = K(d - 1), b = K(d), ex = b[0] - a[0], ez = b[1] - a[1];
        const t = Math.max(0, Math.min(1, ((lx - a[0]) * ex + (lz - a[1]) * ez) / (ex * ex + ez * ez)));
        const qx = a[0] + t * ex, qz = a[1] + t * ez;
        const dist = Math.hypot(lx - qx, lz - qz);
        if (dist >= EMB_FADE) continue;
        const hT = world.heightAt(x + qx + E[d][0] * 0.02, z + qz + E[d][1] * 0.02) - y0;
        let wE = 1 - dist / EMB_FADE;
        wE = wE * wE * (3 - 2 * wE);
        h += (hT - h) * wE;
      }
      return Math.max(0, h);
    };
    const bermCore = (lx: number, lz: number): number => {
      let base = 0, nearRamp = Infinity;
      for (const { d, n } of ramps) {
        const sIn = A - (lx * E[d][0] + lz * E[d][1]);
        const de = edgeDist(lx, lz, d);
        nearRamp = Math.min(nearRamp, de);
        if (sIn > EMB_W) continue;
        // ramp side height at the closest point of the shared edge
        const a = K(d - 1), b = K(d), ex = b[0] - a[0], ez = b[1] - a[1];
        const t = Math.max(0, Math.min(1, ((lx - a[0]) * ex + (lz - a[1]) * ez) / (ex * ex + ez * ez)));
        const hb = terrainApi.rampPlaneHeight(n, x + a[0] + t * ex, z + a[1] + t * ez) - y0;
        base = Math.max(base, hb * (1 - Math.max(0, sIn) / EMB_W));
      }
      if (base <= 0) return 0;
      let f = 1;
      if (nearRamp > EMB_FADE) for (const d of free) f = Math.min(f, Math.min(1, edgeDist(lx, lz, d) / EMB_FADE));
      let h = base * f * f * (3 - 2 * f);
      let dr = Infinity;
      for (const d of roadDirs) dr = Math.min(dr, segDist(lx, lz, 0, 0, A * E[d][0], A * E[d][1]));
      // flat for 1 m beside the bevel (1.8 m): lattice triangles straddling the clearance line never float over it
      if (roadDirs.length) {
        const b = Math.max(0, 0.7 * (dr - 2.8)), k = 0.4; // smooth min: no faceted crease along the clearance line
        const t = Math.max(0, Math.min(1, 0.5 + (0.5 * (b - h)) / k));
        h = Math.max(0, Math.min(h, b, b + (h - b) * t - k * t * (1 - t)));
      }
      return Math.max(0, h);
    };
    const N = 14, LIFT = 0.01;
    const pos: number[] = [], nor: number[] = [], uv: number[] = [], col: number[] = [];
    const face = (P: number[][], collide: boolean) => {
      const [a, b, cc] = P;
      const ux = b[0] - a[0], uy = b[1] - a[1], uz = b[2] - a[2], vx = cc[0] - a[0], vy = cc[1] - a[1], vz = cc[2] - a[2];
      let nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
      if (ny < 0) { nx = -nx; ny = -ny; nz = -nz; P = [a, cc, b]; }
      const l = Math.hypot(nx, ny, nz) || 1;
      // shade like terrain's shoulders: normal biased toward up (one meadow tone)
      nx = (nx / l) * 0.45; nz = (nz / l) * 0.45; ny = (ny / l) * 0.45 + 0.55;
      const l2 = Math.hypot(nx, ny, nz);
      for (const q of P) { pos.push(q[0], q[1], q[2]); nor.push(nx / l2, ny / l2, nz / l2); uv.push(grass[0], grass[1]); }
      if (collide) col.push(...P[0], ...P[1], ...P[2]);
    };
    const memo = new Map<string, number[]>();
    const V = (lx: number, lz: number) => {
      const k = Math.round(lx * 100) + ',' + Math.round(lz * 100);
      let v = memo.get(k);
      if (!v) memo.set(k, (v = [lx, height(lx, lz), lz]));
      return v;
    };
    for (let s6 = 0; s6 < 6; s6++) {
      const k1 = K(s6 - 1), k2 = K(s6);
      const P = (i: number, j: number) => V((k1[0] * (i - j) + k2[0] * j) / N, (k1[1] * (i - j) + k2[1] * j) / N);
      for (let i = 0; i < N; i++)
        for (let j = 0; j <= i; j++) {
          const tris = [[P(i, j), P(i + 1, j), P(i + 1, j + 1)]];
          if (j < i) tris.push([P(i, j), P(i + 1, j + 1), P(i, j + 1)]);
          for (const t of tris) {
            const mx = Math.max(t[0][1], t[1][1], t[2][1]);
            if (mx <= 0.003) continue; // flat: the tile's own grass is there
            face(t.map((q) => [q[0], q[1] + LIFT, q[2]]), mx > 0.05);
          }
        }
      // skirt under the raised boundary (visual only): from the shoulder down below the tile top
      for (let j = 0; j < N; j++) {
        const a = P(N, j), b = P(N, j + 1);
        if (Math.max(a[1], b[1]) <= 0.003) continue;
        const A0 = [a[0], a[1] + LIFT, a[2]], B0 = [b[0], b[1] + LIFT, b[2]], A1 = [a[0], -0.4, a[2]], B1 = [b[0], -0.4, b[2]];
        const ox = (k1[0] + k2[0]) / 2, oz = (k1[1] + k2[1]) / 2, ol = Math.hypot(ox, oz) || 1; // outward
        for (let t of [[A0, B0, B1], [A0, B1, A1]]) {
          const [a2, b2, c2] = t;
          const cx = (b2[1] - a2[1]) * (c2[2] - a2[2]) - (b2[2] - a2[2]) * (c2[1] - a2[1]);
          const cz = (b2[0] - a2[0]) * (c2[1] - a2[1]) - (b2[1] - a2[1]) * (c2[0] - a2[0]);
          if (cx * ox + cz * oz < 0) t = [a2, c2, b2]; // counter-clockwise seen from outside
          for (const q of t) { pos.push(q[0], q[1], q[2]); nor.push(ox / ol, 0, oz / ol); uv.push(grass[0], grass[1]); }
        }
      }
    }
    if (!pos.length) return;
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    geo.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    emit(geo, mat, x, y0, z);
    this.stats.berms = (this.stats.berms ?? 0) + 1;
    if (col.length) {
      const desc = R.ColliderDesc.trimesh(new Float32Array(col), Uint32Array.from({ length: col.length / 3 }, (_, i) => i));
      if (desc) out.addCollider(desc.setTranslation(x, y0, z).setCollisionGroups(WORLD_GROUPS));
    }
  }

  // ------------------------------------------------------------------ bridges
  /** Measure the bridge model once: deck direction (PCA of the footprint), length, width, height profile. */
  private bridgeShape(): BridgeShape | null {
    if (this.bridge) return this.bridge;
    const a = this.ctx.assets.get(BRIDGE_IDS[this.bridgeModel === 'B' ? 1 : 0]);
    if (!a) return null;
    const pts: THREE.Vector3[] = [];
    const v = new THREE.Vector3();
    for (const part of a.parts) {
      const P = part.geometry.attributes.position;
      for (let i = 0; i < P.count; i++) pts.push(v.fromBufferAttribute(P, i).applyMatrix4(part.matrix).clone());
    }
    let mx = 0, mz = 0;
    for (const p of pts) { mx += p.x; mz += p.z; }
    mx /= pts.length; mz /= pts.length;
    let sxx = 0, szz = 0, sxz = 0;
    for (const p of pts) { const dx = p.x - mx, dz = p.z - mz; sxx += dx * dx; szz += dz * dz; sxz += dx * dz; }
    // major axis of the xz covariance (three.js xz) → direction (ux, uz)
    const th = 0.5 * Math.atan2(2 * sxz, sxx - szz);
    const ux = Math.cos(th), uz = Math.sin(th);
    const along = (p: THREE.Vector3) => (p.x - mx) * ux + (p.z - mz) * uz;
    const across = (p: THREE.Vector3) => -(p.x - mx) * uz + (p.z - mz) * ux;
    let lo = Infinity, hi = -Infinity, wlo = Infinity, whi = -Infinity;
    for (const p of pts) { const t = along(p), w = across(p); lo = Math.min(lo, t); hi = Math.max(hi, t); wlo = Math.min(wlo, w); whi = Math.max(whi, w); }
    const cAl = (lo + hi) / 2, cAc = (wlo + whi) / 2;
    const half = (hi - lo) / 2, wHalf = (whi - wlo) / 2;
    // deck top = highest triangle surface straight above the deck centre line (vertical ray test per station)
    const surfAt = surfaceSampler(a);
    const NS = 12;
    const prof: number[] = [];
    for (let s = 0; s <= NS; s++) {
      const t = lo + 0.02 + ((hi - lo - 0.04) * s) / NS;
      const x = mx + t * ux - cAc * uz, z = mz + t * uz + cAc * ux;
      const top = surfAt(x, z);
      prof.push(Number.isFinite(top) ? Math.max(0, top) : 0);
    }
    let railTop = -Infinity;
    for (const p of pts) railTop = Math.max(railTop, p.y);
    // parapets: sweep across the deck at mid-length; inner face = first point clearly above the deck
    const tm = cAl;
    const at = (w: number) => surfAt(mx + tm * ux - (cAc + w) * uz, mz + tm * uz + (cAc + w) * ux);
    const deckMid = at(0);
    let inner = wHalf * 0.7, outer = wHalf;
    for (const sgn of [1, -1]) {
      let inn = wHalf, out = 0;
      for (let w = 0; w <= wHalf + 0.2; w += 0.02) {
        const y = at(sgn * w);
        if (y > deckMid + 0.25 && inn === wHalf) inn = w;
        if (y > -1e8) out = w;
      }
      inner = Math.min(inner, inn);
      outer = Math.max(sgn === 1 ? 0 : outer, out);
    }
    // fine profiles for the bank bed under the deck and for the side colliders
    const NL = 48;
    const low: number[] = [], outerAt: number[] = [];
    for (let s = 0; s <= NL; s++) {
      const t = cAl - half + (2 * half * s) / NL;
      const pt = (w: number) => surfAt(mx + t * ux - (cAc + w) * uz, mz + t * uz + (cAc + w) * ux);
      let lo = Infinity;
      for (let k = -4; k <= 4; k++) { const y = pt((k / 4) * inner * 0.95); if (y > -1e8) lo = Math.min(lo, y); }
      low.push(Number.isFinite(lo) ? lo : 0);
      let o = 0;
      for (const sg of [1, -1]) for (let w = 0; w <= wHalf + 0.3; w += 0.04) if (pt(sg * w) > -1e8) o = Math.max(o, w);
      outerAt.push(o);
    }
    // under-deck strip (stone, 3 cm below the deck's lowest surface): the model's deck pieces meet in T-junctions
    // that rasterise as hairline cracks, through which the grass showed as a light seam across the deck
    if (!(a as { __underlay?: boolean }).__underlay && !this.ctx.params.has('nounderlay')) {
      (a as { __underlay?: boolean }).__underlay = true;
      const uv = deckUv(a, mx + cAl * ux - cAc * uz, mz + cAl * uz + cAc * ux);
      const pos: number[] = [], uvs: number[] = [];
      const W = inner * 0.98;
      const P = (s: number, w: number) => {
        const t = cAl - half + (2 * half * s) / NL;
        return [mx + t * ux - (cAc + w) * uz, low[s] - 0.03, mz + t * uz + (cAc + w) * ux];
      };
      for (let s = 0; s < NL; s++) {
        const A = P(s, -W), B = P(s, W), C = P(s + 1, W), D = P(s + 1, -W);
        // both windings (the material may be FrontSide)
        for (const tri of [[A, B, C], [A, C, D], [A, C, B], [A, D, C]]) for (const v of tri) { pos.push(...v); uvs.push(uv[0], uv[1]); }
      }
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
      g.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
      g.computeVertexNormals();
      g.computeBoundingSphere();
      a.parts.push({ geometry: g, material: a.parts[0].material, matrix: new THREE.Matrix4() } as never);
    }
    this.bridge = {
      low, outerAt,
      phi: Math.atan2(-uz, ux),
      cx: mx + cAl * ux - cAc * uz,
      cz: mz + cAl * uz + cAc * ux,
      half, halfW: inner - 0.05, rail: railTop - Math.max(...prof), prof, inner, outer: Math.max(outer, inner + 0.2),
    };
    return this.bridge;
  }

  /** Rotation of the bridge model so its deck runs along the road axis of cell c. */
  private bridgeRot(c: Readonly<CellData>, shape: BridgeShape): number {
    let d = 0;
    for (let e = 0; e < 6; e++) if ((c.roadMask >> e) & 1) { d = e; break; }
    return (d * Math.PI) / 3 - shape.phi + (this.bridgeRotDeg * Math.PI) / 180;
  }

  /**
   * Welded edges of a road/river cell (bit d = edge d): the grass rim is removed (top runs flat to the hex edge at cell
   * height) where the neighbour is at the same level or higher, or a ramp; kept at drops and water — terrain's rule.
   */
  private weldMask(c: Readonly<CellData>): number {
    let m = 0;
    for (let d = 0; d < 6; d++) {
      const n = this.ctx.world.cell(c.q + DIRS[d][0], c.r + DIRS[d][1]);
      if (n.water) continue;
      if (!n.slope && n.level < c.level) continue;
      m |= 1 << d;
    }
    // closed corners (bit 8 + d = corner between edge d and d + 1): a corner on a drop edge whose two other cells
    // both reach this cell's height there (terrain embankment shoulders, ramp planes, higher cells). Its rim must not
    // dip, else a black triangle opened between the three surfaces (user 2026-10-07, ramp ends on seed 97).
    const y0 = c.level * LEVEL_H, ctr = hexToWorld(c.q, c.r), Rc = (2 / Math.sqrt(3)) * HEX_SCALE;
    for (let d = 0; d < 6; d++) {
      const d1 = (d + 1) % 6;
      if (((m >> d) & 1) && ((m >> d1) & 1)) continue; // already welded on both sides
      const a = (d + 0.5) * (Math.PI / 3), kx = ctr.x + Rc * Math.cos(a), kz = ctr.z - Rc * Math.sin(a);
      let closed = true;
      for (const e of [d, d1]) {
        const n = this.ctx.world.cell(c.q + DIRS[e][0], c.r + DIRS[e][1]);
        if (n.water) { closed = false; break; }
        if (n.roadMask || n.riverMask) { if (!(n.slope || n.level >= c.level)) closed = false; continue; }
        // (embankment cones fall off ~0.6 m per m from the corner: sample 0.15 m in, accept anything closer to our
        // top than to our rim depth)
        // sample toward THAT cell's centre: the same point for every tile sharing this corner (symmetric decision —
        // per-edge sample directions let two road tiles disagree and open slits along their shared edge)
        const nc = hexToWorld(c.q + DIRS[e][0], c.r + DIRS[e][1]);
        const ux = nc.x - kx, uz = nc.z - kz, ul = Math.hypot(ux, uz) || 1;
        const h = this.ctx.world.heightAt(kx + (ux / ul) * 0.15, kz + (uz / ul) * 0.15);
        if (h < y0 - 0.5 * ROAD_SINK) closed = false;
      }
      if (closed) m |= 1 << (8 + d);
    }
    return m;
  }

  /** Terrain's flat-grass texel (average uv of hex_grass' up-facing top), so tile grass = terrain grass. */
  private grassUv: [number, number] | null = null;
  private grassTexel(): [number, number] | null {
    if (this.grassUv) return this.grassUv;
    const a = this.ctx.assets.get('hex/tiles/base/hex_grass');
    if (!a) return null;
    let tu = 0, tv = 0, nt = 0;
    const A = new THREE.Vector3(), B = new THREE.Vector3(), C = new THREE.Vector3();
    for (const part of a.parts) {
      const g = part.geometry.index ? part.geometry.toNonIndexed() : part.geometry;
      const P = g.attributes.position, U = g.attributes.uv;
      if (!U) continue;
      for (let t = 0; t + 2 < P.count; t += 3) {
        A.fromBufferAttribute(P, t).applyMatrix4(part.matrix); B.fromBufferAttribute(P, t + 1).applyMatrix4(part.matrix); C.fromBufferAttribute(P, t + 2).applyMatrix4(part.matrix);
        const n = B.clone().sub(A).cross(C.clone().sub(A)).normalize();
        if (Math.max(A.y, B.y, C.y) > -0.049 * HEX_SCALE && n.y > 0.99) for (let k = 0; k < 3; k++) { tu += U.getX(t + k); tv += U.getY(t + k); nt++; }
      }
    }
    if (!nt) return null;
    this.grassUv = [tu / nt, tv / nt];
    return this.grassUv;
  }

  /**
   * Road ramp with "cutting" wings (whole-game critic r2 / terrain's tongue rule): where a side neighbour (edges
   * dir±1, dir±2) stands at ≥ L+1, the ramp's grass wing rises from the planar road strip to the full step L+1 at
   * that hex edge (smoothstep across the wing), so no partial-height dirt triangle shows between the flank and the
   * ramp. Sides whose neighbour is at L stay planar (terrain's embankments meet them). The raised wing triangles get a
   * trimesh collider (terrain's planar ramp collider lies below them). Cached per (tile, rotation, raise mask).
   */
  private ramps = new Map<string, { geo: THREE.BufferGeometry; col: Float32Array | null } | null>();
  private rampFnMemo = new Map<string, RampFns>();
  /**
   * Surface functions of a road-ramp cell in the ramp frame (xa along the slope, za across; za < 0 = sides dir+1 /
   * dir+2), heights relative to the cell's level: `height` = the drawn tile, `walk` = the walkable surface (same, with
   * the strip bevel widened like the flat tiles' walkTris: strip edge 0.2 m in, bevel top 0.2 m out → ≤ 29°).
   */
  rampFns(c: Readonly<CellData>): RampFns {
    const dir = c.slope!.dir, L = c.level;
    // raise flags per relative side k ∈ {1, 2, 4, 5}: the flank at edge dir+k stands at ≥ L+1
    let raise = 0;
    for (const k of [1, 2, 4, 5]) {
      const e = (dir + k) % 6;
      const n = this.ctx.world.cell(c.q + DIRS[e][0], c.r + DIRS[e][1]);
      if (!n.water && n.level >= L + 1) raise |= 1 << k;
    }
    // road edges into a bridge cell: the deck end is not sunk → the strip sink fades out toward it (as on flat cells)
    let bridgeEdges = 0;
    for (let d = 0; d < 6; d++) {
      if (!((c.roadMask >> d) & 1)) continue;
      if (!this.oldBevel && this.ctx.world.cell(c.q + DIRS[d][0], c.r + DIRS[d][1]).bridge) bridgeEdges |= 1 << d;
    }
    const key = dir + '|' + raise + '|' + bridgeEdges;
    const hit = this.rampFnMemo.get(key);
    if (hit) return hit;
    const H = LEVEL_H, A = HEX_SCALE, R = (2 / Math.sqrt(3)) * A, S3 = Math.sqrt(3);
    const th = (dir * Math.PI) / 3;
    const ex = Math.cos(th), ez = -Math.sin(th), px = Math.sin(th), pz = Math.cos(th);
    const W = (xa: number, za: number, y: number): number[] => [xa * ex + za * px, y, xa * ez + za * pz];
    const toFrame = (lx: number, lz: number): [number, number] => [lx * ex + lz * ez, lx * px + lz * pz];
    const plane = (xa: number) => H * Math.min(1, Math.max(0, (xa / A + 1) / 2));
    const zmax = (xa: number) => R - Math.abs(xa) / S3;
    const STRIP = 0.192 * A, BEV = BEVEL_TOP * A, SINK = ROAD_SINK, WIDEN = 0.2;
    // wing target height at the side boundary for row xa on side sgn (−1 → k 1 / 2, +1 → k 5 / 4)
    const sideT = (xa: number, sgn: number) => {
      const kHi = sgn < 0 ? 1 : 5, kLo = sgn < 0 ? 2 : 4;
      const tOf = (k: number) => ((raise >> k) & 1 ? H : plane(xa));
      // each edge keeps its own target up to the side corner (xa = 0); the corner takes the lower one. (A 3 m blend
      // across the corner lifted a planar side's boundary up to 0.9 m above a same-level flank: crack check r3.)
      let t = xa < -1e-6 ? tOf(kLo) : xa > 1e-6 ? tOf(kHi) : Math.min(tOf(kLo), tOf(kHi));
      // near the foot edge the approach cell stands at L: fade the raise out over the last 2.5 m
      const g = Math.min(1, Math.max(0, (xa + A) / 2.5));
      t = plane(xa) + (t - plane(xa)) * g;
      return Math.max(t, plane(xa));
    };
    const wing = (xa: number, za: number) => {
      const az = Math.abs(za), p = plane(xa);
      if (az <= BEV) return p;
      const zm = zmax(xa);
      const u = Math.min(1, Math.max(0, (az - BEV) / Math.max(0.1, zm - BEV)));
      const w = u * u * (3 - 2 * u);
      return p + (sideT(xa, Math.sign(za)) - p) * w;
    };
    const bevel = (az: number, s0: number, s1: number) => SINK * Math.min(1, Math.max(0, (s1 - az) / (s1 - s0)));
    const height = (xa: number, za: number) => wing(xa, za) - bevel(Math.abs(za), STRIP, BEV);
    const fadeK = (xa: number, za: number) => {
      if (!bridgeEdges) return 1;
      const lx = xa * ex + za * px, lz = xa * ez + za * pz;
      let k = 1;
      for (let d = 0; d < 6; d++) {
        if (!((bridgeEdges >> d) & 1)) continue;
        const de = A - (lx * Math.cos((d * Math.PI) / 3) - lz * Math.sin((d * Math.PI) / 3));
        const t = Math.max(0, Math.min(1, de / SINK_FADE));
        k = Math.min(k, t * t * (3 - 2 * t));
      }
      return k;
    };
    const walk = (xa: number, za: number) => wing(xa, za) - bevel(Math.abs(za), STRIP - WIDEN, BEV + WIDEN) * fadeK(xa, za);
    const f: RampFns = { key, dir, raise, W, toFrame, plane, zmax, height, walk, STRIP, BEV, WIDEN };
    this.rampFnMemo.set(key, f);
    return f;
  }
  /** Depth of a road ramp's walkable strip below terrain's ramp plane at cell-local (lx, lz) (≥ 0; 0 off the strip). */
  rampSink(c: Readonly<CellData>, lx: number, lz: number): number {
    if (this.ctx.params.has('rampwalls')) return 0;
    const F = this.rampFns(c);
    const [xa, za] = F.toFrame(lx, lz);
    if (Math.abs(za) > F.BEV + F.WIDEN) return 0;
    return Math.max(0, F.plane(Math.max(-HEX_SCALE, Math.min(HEX_SCALE, xa))) - F.walk(xa, za));
  }
  private rampTile(_id: string, _rotY: number, c: Readonly<CellData>): { geo: THREE.BufferGeometry; col: Float32Array | null } | null {
    const F = this.rampFns(c);
    const key = F.key;
    if (this.ramps.has(key)) return this.ramps.get(key)!;
    const grass = this.grassTexel(), sand = this.sandTexel();
    if (!grass || !sand) return null;
    const A = HEX_SCALE;
    const { W, plane, zmax, height, walk, STRIP, BEV, WIDEN } = F;
    const ROWS = 16, WING = 6;
    const rows: number[] = [];
    for (let i = 0; i <= ROWS; i++) rows.push(-A + (2 * A * i) / ROWS);
    const cols = (xa: number): number[] => {
      const zm = zmax(xa), out: number[] = [];
      for (let j = WING; j >= 1; j--) out.push(-(BEV + ((zm - BEV) * j) / WING));
      out.push(-BEV, -STRIP, STRIP, BEV);
      for (let j = 1; j <= WING; j++) out.push(BEV + ((zm - BEV) * j) / WING);
      return out;
    };
    const pos: number[] = [], nor: number[] = [], uv: number[] = [], col: number[] = [];
    const tri = (A0: number[], B0: number[], C0: number[], tex: [number, number], up: number, collide: boolean) => {
      const ux = B0[0] - A0[0], uy = B0[1] - A0[1], uz = B0[2] - A0[2], vx = C0[0] - A0[0], vy = C0[1] - A0[1], vz = C0[2] - A0[2];
      let nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
      let l = Math.hypot(nx, ny, nz) || 1;
      if (ny < 0) { nx = -nx; ny = -ny; nz = -nz; const T = B0; B0 = C0; C0 = T; } // keep tops facing up
      nx /= l; ny /= l; nz /= l;
      if (up > 0) { nx *= 1 - up; nz *= 1 - up; ny = ny * (1 - up) + up; l = Math.hypot(nx, ny, nz) || 1; nx /= l; ny /= l; nz /= l; }
      pos.push(...A0, ...B0, ...C0);
      for (let k = 0; k < 3; k++) { nor.push(nx, ny, nz); uv.push(tex[0], tex[1]); }
      if (collide) col.push(...A0, ...B0, ...C0);
    };
    for (let i = 0; i < ROWS; i++) {
      const x0 = rows[i], x1 = rows[i + 1];
      const c0 = cols(x0), c1 = cols(x1);
      for (let j = 0; j + 1 < c0.length; j++) {
        const z00 = c0[j], z01 = c0[j + 1], z10 = c1[j], z11 = c1[j + 1];
        const P00 = W(x0, z00, height(x0, z00)), P01 = W(x0, z01, height(x0, z01)), P10 = W(x1, z10, height(x1, z10)), P11 = W(x1, z11, height(x1, z11));
        const strip = j === WING + 1, bevel = j === WING || j === WING + 2;
        const tex = strip || bevel ? sand : grass;
        tri(P00, P10, P11, tex, strip ? 0.85 : 0.55, false);
        tri(P00, P11, P01, tex, strip ? 0.85 : 0.55, false);
      }
    }
    // walkable top (WORLD trimesh over the whole cell: terrain lowers its ramp hull on road ramps): strip, widened
    // bevels (≤ 29°), wings — the same `walk` function heightAt uses via roadSinkAt
    {
      const WR = 24;
      const wcols = (xa: number): number[] => {
        const zm = zmax(xa), out: number[] = [];
        for (let j = WING; j >= 1; j--) out.push(-(BEV + WIDEN + ((zm - BEV - WIDEN) * j) / WING));
        out.push(-(BEV + WIDEN), -BEV, -(STRIP - WIDEN), 0, STRIP - WIDEN, BEV, BEV + WIDEN);
        for (let j = 1; j <= WING; j++) out.push(BEV + WIDEN + ((zm - BEV - WIDEN) * j) / WING);
        return out;
      };
      for (let i = 0; i < WR; i++) {
        const x0 = -A + (2 * A * i) / WR, x1 = -A + (2 * A * (i + 1)) / WR;
        const c0 = wcols(x0), c1 = wcols(x1);
        for (let j = 0; j + 1 < c0.length; j++) {
          const P00 = W(x0, c0[j], walk(x0, c0[j])), P01 = W(x0, c0[j + 1], walk(x0, c0[j + 1]));
          const P10 = W(x1, c1[j], walk(x1, c1[j])), P11 = W(x1, c1[j + 1], walk(x1, c1[j + 1]));
          col.push(...P00, ...P10, ...P11, ...P00, ...P11, ...P01);
        }
      }
    }
    // side walls: every boundary segment down to the column top (y −TILE) so the sides are never open
    const yb = -A;
    const wall = (Pa: number[], Pb: number[]) => {
      const Qa = [Pa[0], yb, Pa[2]], Qb = [Pb[0], yb, Pb[2]];
      const push = (a2: number[], b2: number[], c2: number[]) => {
        const ux = b2[0] - a2[0], uz = b2[2] - a2[2], vx = c2[0] - a2[0], vy = c2[1] - a2[1], vz = c2[2] - a2[2], uy = b2[1] - a2[1];
        let nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
        const l = Math.hypot(nx, ny, nz) || 1;
        // outward: away from the cell centre
        if (nx * (a2[0] + b2[0]) + nz * (a2[2] + b2[2]) < 0) { nx = -nx; ny = -ny; nz = -nz; }
        pos.push(...a2, ...b2, ...c2);
        for (let k = 0; k < 3; k++) { nor.push(nx / l, ny / l, nz / l); uv.push(grass[0], grass[1]); }
      };
      push(Pa, Pb, Qb);
      push(Pa, Qb, Qa);
    };
    for (let i = 0; i < ROWS; i++) {
      const x0 = rows[i], x1 = rows[i + 1];
      for (const sg of [-1, 1]) {
        const z0 = sg * zmax(x0), z1 = sg * zmax(x1);
        wall(W(x0, z0, height(x0, z0)), W(x1, z1, height(x1, z1)));
      }
    }
    for (const xe of [-A, A]) {
      const cz = cols(xe);
      for (let j = 0; j + 1 < cz.length; j++) wall(W(xe, cz[j], height(xe, cz[j])), W(xe, cz[j + 1], height(xe, cz[j + 1])));
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    geo.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    geo.userData.shared = true;
    const res = { geo, col: col.length ? new Float32Array(col) : null };
    this.ramps.set(key, res);
    return res;
  }

  /** Road-strip texel of hex_road_A (average uv of its up-facing strip faces at −0.375 m). */
  private sandUv: [number, number] | null | undefined;
  private sandTexel(): [number, number] | null {
    if (this.sandUv !== undefined) return this.sandUv;
    this.sandUv = null;
    const a = this.ctx.assets.get('hex/tiles/roads/hex_road_A');
    if (!a) return null;
    let tu = 0, tv = 0, nt = 0;
    const A = new THREE.Vector3(), B = new THREE.Vector3(), C = new THREE.Vector3();
    for (const part of a.parts) {
      const g = part.geometry.index ? part.geometry.toNonIndexed() : part.geometry;
      const P = g.attributes.position, U = g.attributes.uv;
      if (!U) continue;
      for (let t = 0; t + 2 < P.count; t += 3) {
        A.fromBufferAttribute(P, t).applyMatrix4(part.matrix); B.fromBufferAttribute(P, t + 1).applyMatrix4(part.matrix); C.fromBufferAttribute(P, t + 2).applyMatrix4(part.matrix);
        const n = B.clone().sub(A).cross(C.clone().sub(A)).normalize();
        if (n.y > 0.99 && [A, B, C].every((v) => Math.abs(v.y + 0.05 * HEX_SCALE) < 0.01)) for (let k = 0; k < 3; k++) { tu += U.getX(t + k); tv += U.getY(t + k); nt++; }
      }
    }
    if (nt) this.sandUv = [tu / nt, tv / nt];
    return this.sandUv;
  }

  /**
   * Cell-local copy of a road/river tile (rotation applied): the KayKit grass rim (y −0.375 m on the hex boundary,
   * grass just inside) is lifted to the top on every welded edge (a corner only when all its edges are welded), and
   * all flat grass faces sample terrain's grass texel (one constant colour: no moiré, same colour as the meadow).
   * Road strip / river channel rims stay. Non-indexed, position + normal + uv. Cached per (tile, rotation, mask).
   */
  private variants = new Map<string, THREE.BufferGeometry | null>();
  variant(id: string, rotY: number, weld: number, mask = 0): THREE.BufferGeometry | null {
    const key = id + '|' + rotY.toFixed(3) + '|' + weld + '|' + mask;
    if (this.variants.has(key)) return this.variants.get(key)!;
    const a = this.ctx.assets.get(id);
    if (!a) return null;
    const S = HEX_SCALE;
    const surf = surfaceSampler(a);
    const texel = this.grassTexel();
    const sand = this.sandTexel();
    const rot = new THREE.Matrix4().makeRotationY(rotY);
    const E = [0, 1, 2, 3, 4, 5].map((d) => [Math.cos((d * Math.PI) / 3), -Math.sin((d * Math.PI) / 3)]);
    const pos: number[] = [], nor: number[] = [], uv: number[] = [];
    const p = [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()];
    const nm = new THREE.Vector3(), w = new THREE.Vector3(), e1 = new THREE.Vector3(), e2 = new THREE.Vector3();
    const inv = new THREE.Matrix4().makeRotationY(-rotY);
    // edge distance (asset frame → rotated frame), welded-edge test
    const edgeDist = (v: THREE.Vector3) => {
      w.copy(v).applyMatrix4(rot);
      let m = -Infinity;
      for (let d = 0; d < 6; d++) m = Math.max(m, (w.x * E[d][0] + w.z * E[d][1]) / S);
      return m;
    };
    const band = (v: THREE.Vector3) => v.y > -0.07 * S && v.y < 0.001 && edgeDist(v) > 0.935;
    /** new height of a rim-band vertex on welded edges: the surface just inside the band, along the edge normal(s) */
    const welded = (v: THREE.Vector3): number | null => {
      w.copy(v).applyMatrix4(rot);
      let ix = w.x, iz = w.z, on = 0;
      const near: number[] = [];
      for (let d = 0; d < 6; d++) if ((w.x * E[d][0] + w.z * E[d][1]) / S > 0.935) near.push(d);
      // a closed corner (both edges' band) welds even if one of its edges is a kept rim
      const corner = near.length === 2 ? ((near[1] - near[0] === 1 ? near[0] : near[1]) % 6) : -1;
      const cornerClosed = corner >= 0 && ((weld >> (8 + corner)) & 1) === 1;
      for (const d of near) {
        const dd = (w.x * E[d][0] + w.z * E[d][1]) / S;
        if (!((weld >> d) & 1) && !cornerClosed) return null;
        on++;
        ix -= E[d][0] * (dd - 0.949) * S;
        iz -= E[d][1] * (dd - 0.949) * S;
      }
      if (!on) return null;
      const q = new THREE.Vector3(ix, 0, iz).applyMatrix4(inv);
      const h = surf(q.x, q.z);
      return h > -0.07 * S ? Math.min(0, h) : null;
    };
    // rebuilt ramp tiles have no grass rim left and carry soft-joint normals: no welding, normals kept
    const ramp = id.includes('sloped');
    if (ramp) weld = 0;
    const nr = new THREE.Matrix3().getNormalMatrix(rot);
    // river tiles: the channel shoulders on the hex boundary (|along-edge| < 0.5 units) are never lifted — whether a
    // shoulder would weld depended on the tile's own geometry just inside it (straight vs bend tile), so neighbouring
    // tiles disagreed and the bank showed a dark slit at the seam
    const river = id.includes('river');
    const shoulder = (v: THREE.Vector3) => {
      if (!river) return false;
      w.copy(v).applyMatrix4(rot);
      for (let d = 0; d < 6; d++)
        if ((w.x * E[d][0] + w.z * E[d][1]) / S > 0.985 && Math.abs(-w.x * E[d][1] + w.z * E[d][0]) / S < 0.5) return true;
      return false;
    };
    const rimOf = (v: THREE.Vector3) => Math.abs(v.y + 0.05 * S) < 0.012 * S && edgeDist(v) > 0.985 && !shoulder(v);
    /** hex edge both points lie on (−1 if none) */
    const boundaryEdge = (a2: THREE.Vector3, b2: THREE.Vector3) => {
      const wa = a2.clone().applyMatrix4(rot), wb = b2.clone().applyMatrix4(rot);
      for (let d = 0; d < 6; d++)
        if ((wa.x * E[d][0] + wa.z * E[d][1]) / S > 0.985 && (wb.x * E[d][0] + wb.z * E[d][1]) / S > 0.985) return d;
      return -1;
    };
    const lift = (v: THREE.Vector3) => { const h = welded(v); return h !== null && h > -0.01 * S; };
    // ---- verge (strip bevel) cleanup on road tiles (user 2026-10-07, lengthwise lines): the bevel top must stay one
    // straight line at BEVEL_TOP (else KayKit's 15 m bevel triangles shade as two bands with a crease); stray top
    // vertices on the outer half of each arm snap to it, the bevel itself is never cut (see the low→high cut), and
    // bevel faces get the grass texel and normals half-way to up (no bright line at the strip or grass edge).
    const verge = !!mask && !river && !ramp;
    const roadDirs = [0, 1, 2, 3, 4, 5].filter((d) => (mask >> d) & 1);
    const nearArm = (x: number, z: number): { t: number; dd: number; ox: number; oz: number } => {
      let best = { t: 0, dd: Infinity, ox: 0, oz: 0 };
      for (const d of roadDirs) {
        const ex = E[d][0] * S, ez = E[d][1] * S;
        const t = Math.max(0, Math.min(1, (x * ex + z * ez) / (ex * ex + ez * ez)));
        const ox = x - t * ex, oz = z - t * ez, dd = Math.hypot(ox, oz);
        if (dd < best.dd) best = { t, dd, ox, oz };
      }
      return best;
    };
    const snapBevelTop = (v: THREE.Vector3) => {
      if (Math.abs(v.y) > 0.002 * S) return;
      w.copy(v).applyMatrix4(rot);
      const a = nearArm(w.x, w.z);
      if (a.t < 0.45 || a.dd < 0.215 * S || a.dd > 0.25 * S || a.dd === 0) return;
      const k = (BEVEL_TOP * S) / a.dd;
      const nx = w.x - a.ox + a.ox * k, nz = w.z - a.oz + a.oz * k;
      const back = new THREE.Vector3(nx, v.y, nz).applyMatrix4(inv);
      v.x = back.x; v.z = back.z;
    };
    const emitTri = (A: THREE.Vector3, B: THREE.Vector3, C: THREE.Vector3, ua: number[], ub: number[], uc: number[], na: THREE.Vector3 | null, nb: THREE.Vector3 | null, nc: THREE.Vector3 | null) => {
      p[0].copy(A).applyMatrix4(rot); p[1].copy(B).applyMatrix4(rot); p[2].copy(C).applyMatrix4(rot);
      e1.subVectors(p[1], p[0]); e2.subVectors(p[2], p[0]);
      nm.crossVectors(e1, e2).normalize();
      // constant texels like terrain (no atlas-gradient sampling → no stripes): flat grass → grass texel, the road
      // strip → sand texel; ramp tiles (road along asset x): strip by |z|, grass wings by |z|
      let tx: [number, number] | null = null;
      if (ramp) {
        if (nm.y > 0.6) {
          if (A.z * A.z <= (0.2 * S) ** 2 && B.z * B.z <= (0.2 * S) ** 2 && C.z * C.z <= (0.2 * S) ** 2) tx = sand;
          else if (Math.abs(A.z) >= 0.235 * S && Math.abs(B.z) >= 0.235 * S && Math.abs(C.z) >= 0.235 * S) tx = texel;
        }
      } else if (nm.y > 0.99) {
        if (p.every((v) => Math.abs(v.y) < 0.002)) tx = texel;
        else if (sand && p.every((v) => Math.abs(v.y + 0.05 * S) < 0.002)) tx = sand;
      }
      let vergeFace = false;
      if (verge && nm.y > 0.3 && nm.y <= 0.99 && texel) {
        const cx = (p[0].x + p[1].x + p[2].x) / 3, cz = (p[0].z + p[1].z + p[2].z) / 3;
        if (nearArm(cx, cz).dd < 0.3 * S && p.every((v) => v.y > -0.055 * S && v.y < 0.002 * S)) {
          vergeFace = true;
          tx = texel;
          nm.x *= 0.5; nm.z *= 0.5; nm.y = nm.y * 0.5 + 0.5; nm.normalize();
        }
      }
      // ramp tops shade like terrain's ramp tops: normals biased 85 % toward straight up (one flat tone, no tile edge)
      const rampUp = ramp && nm.y > 0.6;
      if (rampUp) {
        nm.x *= 0.15; nm.z *= 0.15; nm.y = nm.y * 0.15 + 0.85;
        nm.normalize();
      }
      const ns = [na, nb, nc], us = [ua, ub, uc];
      for (let k = 0; k < 3; k++) {
        pos.push(p[k].x, p[k].y, p[k].z);
        const n0 = ns[k];
        if (n0 && !rampUp && !vergeFace) { w.copy(n0).applyMatrix3(nr).normalize(); nor.push(w.x, w.y, w.z); } else nor.push(nm.x, nm.y, nm.z);
        if (tx) uv.push(tx[0], tx[1]);
        else uv.push(us[k][0], us[k][1]);
      }
    };
    const bank = id.includes('river') && !this.ctx.params.has('hardbanks') ? bankShift(a) : null;
    for (const part of a.parts) {
      const g = (part.geometry.index ? part.geometry.toNonIndexed() : part.geometry.clone()).applyMatrix4(part.matrix);
      const P = g.attributes.position, U = g.attributes.uv, N = ramp ? g.attributes.normal : undefined;
      for (let t = 0; t + 2 < P.count; t += 3) {
        const V = [0, 1, 2].map((k) => new THREE.Vector3().fromBufferAttribute(P, t + k));
        if (bank) for (const v of V) { const d = bank.get(vkey(v)); if (d) { v.x += d[0]; v.z += d[1]; } }
        if (verge) for (const v of V) snapBevelTop(v);
        const UV = [0, 1, 2].map((k) => (U ? [U.getX(t + k), U.getY(t + k)] : [0, 0]));
        const NN = [0, 1, 2].map((k) => (N ? new THREE.Vector3().fromBufferAttribute(N, t + k) : null));
        if (!weld) { emitTri(V[0], V[1], V[2], UV[0], UV[1], UV[2], NN[0], NN[1], NN[2]); continue; }
        // side-wall triangles standing ON a welded hex edge: they sit under the neighbour's surface and only cast
        // thin shadow slivers along the seam (two dark lines at drop corners, user 2026-10-07) — drop them
        {
          const be = boundaryEdge(V[0], V[1]);
          if (be >= 0 && be === boundaryEdge(V[1], V[2]) && ((weld >> be) & 1)) continue;
        }
        const rim = V.map(rimOf);
        const up = V.map((v, k) => rim[k] && lift(v));
        const Lf = V.map((v, k) => (up[k] ? new THREE.Vector3(v.x, 0, v.z) : v));
        // a welded boundary edge running low → low from the road strip to a hex corner that stays low (its other edge
        // is a kept rim at a drop): the grass between had no vertex, so it sagged to rim height and the two tiles
        // formed a dark V-groove along their seam (terrace corner beside a road). Insert the bevel-top point (BEVEL_TOP)
        // and the corner band's end (0.075 units from the corner) at grass height — both tiles compute the same points.
        if (!river) {
          let done = false;
          for (let k = 0; k < 3 && !done; k++) {
            const k1 = (k + 1) % 3, k2 = (k + 2) % 3;
            const bd = boundaryEdge(V[k], V[k1]);
            // (rim-band vertices only: the tile's bottom face also lies on the boundary at −HEX_SCALE — lifting its
            // edge points raised huge slanted bottom triangles through the grass: the dark slits of the user report)
            const rimLow = (y: number) => y < -0.01 * S && y > -0.07 * S;
            if (bd < 0 || !((weld >> bd) & 1) || !rimLow(Lf[k].y) || !rimLow(Lf[k1].y)) continue;
            // signed position along the edge (a full edge runs corner −0.577 → corner +0.577)
            const al = (v: THREE.Vector3) => { w.copy(v).applyMatrix4(rot); return -w.x * E[bd][1] + w.z * E[bd][0]; };
            const a0 = al(V[k]), a1 = al(V[k1]);
            const ts: number[] = [];
            for (const t of [-CORNER_BAND * S, CORNER_BAND * S]) ts.push(t);
            // the bevel-top point only beside a strip vertex (an end lying on the road strip)
            for (const a of [a0, a1]) if (Math.abs(a) < BEVEL_TOP * S - 0.01 * S) ts.push(Math.sign(a || 1) * BEVEL_TOP * S);
            const lo = Math.min(a0, a1) + 0.01 * S, hi = Math.max(a0, a1) - 0.01 * S;
            const fs = [...new Set(ts)].filter((t) => t > lo && t < hi).map((t) => (t - a0) / (a1 - a0)).sort((x, y) => x - y);
            if (!fs.length) continue;
            const P = fs.map((f) => { const X = new THREE.Vector3().lerpVectors(V[k], V[k1], f); X.y = 0; return X; });
            const PU = fs.map((f) => [UV[k][0] + (UV[k1][0] - UV[k][0]) * f, UV[k][1] + (UV[k1][1] - UV[k][1]) * f]);
            // the two low ends also get a grass-height point on their interior edge toward the apex (0.433 m from a
            // dipped corner, 0.30 m from a strip edge): else each end formed one long, laterally steep sliver from
            // the low end to an apex metres inside — the dark lines along seams at drop corners (user report)
            const Q = (end: number, end2: number, PU2: number[]): { p: THREE.Vector3; u: number[] } | null => {
              if (Lf[k2].y < -0.004 * S) return null;
              w.copy(V[end]).applyMatrix4(rot);
              // only at a dipped hex CORNER: the triangle across edge (end, apex) is cut at the same point by the
              // interior-edge rule (atCorner → CORNER_BAND). A split at a strip-edge end had no partner there and opened
              // a T-junction pinhole (voidcheck r12: seeds 42 / 97, 2 px at strip ends).
              if (Math.hypot(w.x, w.z) <= 0.99 * (2 / Math.sqrt(3)) * S) return null;
              const dq = (0.5774 - CORNER_BAND) * S;
              const L2 = V[end].distanceTo(V[end2]);
              if (L2 < dq * 1.5) return null;
              const t2 = dq / L2;
              const X = new THREE.Vector3().lerpVectors(V[end], V[end2], t2); X.y = 0;
              void PU2;
              return { p: X, u: [UV[end][0] + (UV[end2][0] - UV[end][0]) * t2, UV[end][1] + (UV[end2][1] - UV[end][1]) * t2] };
            };
            const qa = Q(k, k2, UV[k2]), qb = Q(k1, k2, UV[k2]);
            const n = P.length - 1;
            if (qa) { emitTri(Lf[k], P[0], qa.p, UV[k], PU[0], qa.u, null, null, null); emitTri(P[0], Lf[k2], qa.p, PU[0], UV[k2], qa.u, null, null, null); }
            else emitTri(Lf[k], P[0], Lf[k2], UV[k], PU[0], UV[k2], null, null, null);
            for (let i = 0; i < n; i++) emitTri(P[i], P[i + 1], Lf[k2], PU[i], PU[i + 1], UV[k2], null, null, null);
            if (qb) { emitTri(P[n], Lf[k1], qb.p, PU[n], UV[k1], qb.u, null, null, null); emitTri(P[n], qb.p, Lf[k2], PU[n], qb.u, UV[k2], null, null, null); }
            else emitTri(P[n], Lf[k1], Lf[k2], PU[n], UV[k1], UV[k2], null, null, null);
            done = true;
          }
          if (done) continue;
        }
        // an edge from a low rim-band vertex (road strip / channel side, kept) to a high one: split it where the grass
        // ends, so the welded flat reaches the road/channel bevel (always bisected low → high: neighbours agree)
        const low = Lf.map((v, k) => v.y < -0.01 * S && v.y > -0.07 * S && edgeDist(V[k]) > 0.935);
        const high = Lf.map((v) => v.y > -0.002 * S);
        const cut: (null | { p: THREE.Vector3; u: number[] })[] = [null, null, null]; // cut[k] on edge k → k+1
        for (let k = 0; k < 3; k++) {
          const k2 = (k + 1) % 3;
          let lo = -1, hi = -1;
          if (low[k] && high[k2]) { lo = k; hi = k2; } else if (low[k2] && high[k]) { lo = k2; hi = k; }
          if (lo < 0) continue;
          let f0 = 0, f1 = 1;
          const X = new THREE.Vector3();
          // an edge lying ON the hex boundary: cut at the tile family's fixed grass line (road strip bevel top BEVEL_TOP,
          // river lip 0.512 units from the edge midpoint) — the same point the neighbouring tile computes, whatever its
          // own geometry inside (no T-junction slit along the seam)
          const bd = boundaryEdge(V[lo], V[hi]);
          // a kept rim (drop / water edge) stays at rim height along the whole boundary: no grass-height cut point on
          // it (that lifted the rim 0.43 m from a drop corner and left a pit at the corner → dark slits, user report)
          if (bd >= 0 && !((weld >> bd) & 1)) continue;
          if (bd >= 0) {
            const al = (v: THREE.Vector3) => { w.copy(v).applyMatrix4(rot); return -w.x * E[bd][1] + w.z * E[bd][0]; };
            const a0 = al(V[lo]), a1 = al(V[hi]);
            // low end = the hex corner (its other edge is a kept rim at a drop): cut where that rim band ends
            // (CORNER_BAND, terrain's flatTop inset), not at the strip line or the far corner — else one long slanted
            // face ran from the corner along the whole edge (0.29 m dip against terrain's flat grass, a dark V-groove
            // between two road tiles). Signed: a full edge runs corner → corner.
            const sl = (river ? 0.512 : BEVEL_TOP) * S;
            const thrs = [-sl, sl, -CORNER_BAND * S, CORNER_BAND * S];
            let thr = NaN;
            for (const t of thrs) if ((a0 - t) * (a1 - t) < 0 && !(Math.abs(a0 - t) >= Math.abs(a0 - thr))) thr = t;
            if (Number.isNaN(thr)) continue;
            f1 = (thr - a0) / (a1 - a0);
          } else {
            w.copy(V[lo]).applyMatrix4(rot);
            // the strip bevel itself (low end = a strip-edge vertex): keep it — cutting it "where the grass ends"
            // lifted a point of the bevel to grass height near every arm end, pulling the bevel top in by 7 cm; the
            // 15 m bevel then shaded as two bands with a lengthwise crease (user 2026-10-07)
            const ddLo = verge ? nearArm(w.x, w.z).dd : Infinity;
            let bevelCut = -1;
            if (ddLo < 0.205 * S) {
              w.copy(V[hi]).applyMatrix4(rot);
              const ddHi = nearArm(w.x, w.z).dd;
              if (ddHi <= BEVEL_TOP * S + 0.02) continue; // a bevel edge: never cut
              bevelCut = (BEVEL_TOP * S - ddLo) / (ddHi - ddLo); // cut ON the bevel-top line, flat grass beyond
            }
            const atCorner = bevelCut < 0 && Math.hypot(w.x, w.z) > 0.99 * (2 / Math.sqrt(3)) * S;
            if (bevelCut >= 0) f1 = bevelCut;
            else if (atCorner) {
              // interior edge from a dipped hex corner: the dip ends CORNER_BAND (0.433 m) from the corner — else a
              // long thin slanted sliver ran from the corner to a vertex metres inside (dark lines at drop corners)
              f1 = ((0.5774 - CORNER_BAND) * S) / V[lo].distanceTo(V[hi]);
            } else
            for (let it = 0; it < 12; it++) {
              const mid = (f0 + f1) / 2;
              X.lerpVectors(V[lo], V[hi], mid);
              if (lift(X)) f1 = mid; else f0 = mid;
            }
          }
          if (f1 < 0.02 || f1 > 0.98) continue;
          X.lerpVectors(V[lo], V[hi], f1);
          X.y = 0;
          cut[k] = { p: X, u: [UV[lo][0] + (UV[hi][0] - UV[lo][0]) * f1, UV[lo][1] + (UV[hi][1] - UV[lo][1]) * f1] };
        }
        const nc = cut.filter(Boolean).length;
        if (nc === 0 || nc === 3) { emitTri(Lf[0], Lf[1], Lf[2], UV[0], UV[1], UV[2], null, null, null); continue; }
        if (nc === 1) {
          const k = cut.findIndex(Boolean), k1 = (k + 1) % 3, k2 = (k + 2) % 3, c0 = cut[k]!;
          emitTri(Lf[k], c0.p, Lf[k2], UV[k], c0.u, UV[k2], null, null, null);
          emitTri(c0.p, Lf[k1], Lf[k2], c0.u, UV[k1], UV[k2], null, null, null);
          continue;
        }
        // two cuts: the vertex between them (shared by both cut edges) is cut off as its own triangle
        const k = cut.findIndex((c) => !c); // uncut edge k → k+1; apex = k+2
        const ap = (k + 2) % 3, ka = (k + 1) % 3; // cut edges: (k+1 → ap) and (ap → k)
        const cA = cut[ka]!, cB = cut[ap]!;
        emitTri(cA.p, Lf[ap], cB.p, cA.u, UV[ap], cB.u, null, null, null);
        emitTri(Lf[k], Lf[ka], cA.p, UV[k], UV[ka], cA.u, null, null, null);
        emitTri(Lf[k], cA.p, cB.p, UV[k], cA.u, cB.u, null, null, null);
      }
    }
    // backstop: a flat grass cap just under the rim (−0.065 units) over the whole hex. It is invisible under the top
    // (strip/rim at −0.05, everything else higher) and behind the drop walls, but any pin-hole or T-junction crack
    // in the top now shows shadowed grass instead of the void (voidcheck r12: seed 42 drop corner). Road tiles only
    // (river channels go deeper; ramp tiles are procedural and closed).
    if (!river && !ramp && texel) {
      const Rc = (2 / Math.sqrt(3)) * S, yc = -0.065 * S;
      for (let i = 0; i < 6; i++) {
        const a0 = ((i + 0.5) * Math.PI) / 3, a1 = ((i + 1.5) * Math.PI) / 3;
        // world-frame corners (emitTri rotates by rotY, so feed asset-frame points)
        const P0 = new THREE.Vector3(0, yc, 0).applyMatrix4(inv), P1 = new THREE.Vector3(Rc * Math.cos(a0), yc, -Rc * Math.sin(a0)).applyMatrix4(inv), P2 = new THREE.Vector3(Rc * Math.cos(a1), yc, -Rc * Math.sin(a1)).applyMatrix4(inv);
        const up = new THREE.Vector3(0, 1, 0).applyMatrix3(new THREE.Matrix3().getNormalMatrix(inv));
        emitTri(P0, P1, P2, texel, texel, texel, up, up, up);
      }
    }
    const out = new THREE.BufferGeometry();
    out.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    out.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
    out.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    this.variants.set(key, out);
    return out;
  }

  /**
   * River tile under a bridge with its bank lowered below the deck: the deck's feet dip below the tile top near the
   * cell edges (they meet the road strip of the next cell), so the bank's rim showed through the deck as a thin grass
   * line. Every vertex under the walkable deck strip is capped 5 cm below the deck's lowest surface there (triangles
   * near the strip are subdivided first). Cached per (tile, tile rotation, bridge rotation); cell-local coordinates.
   */
  private beds = new Map<string, THREE.BufferGeometry | null>();
  private bridgeBed(tile: string, rotY: number, c: Readonly<CellData>): THREE.BufferGeometry | null {
    const shape0 = this.bridgeShape();
    if (!shape0) return null;
    const rot = this.bridgeRot(c, shape0);
    const key = tile + '|' + rotY.toFixed(3) + '|' + rot.toFixed(3) + '|' + this.weldMask(c);
    if (this.beds.has(key)) return this.beds.get(key)!;
    const a = this.ctx.assets.get(tile);
    if (!a) return null;
    const S = BRIDGE_SCALE, RAISE = 0.03;
    const half = shape0.half * S, inner = shape0.inner * S;
    const ca = Math.cos(rot), sa = Math.sin(rot);
    const ang = shape0.phi + rot;
    const ax = Math.cos(ang), az = -Math.sin(ang);
    const cx = shape0.cx * S, cz = shape0.cz * S;
    const ox = cx * ca + cz * sa, oz = -cx * sa + cz * ca;
    const toDeck = (lx: number, lz: number): [number, number] => {
      const dx = lx - ox, dz = lz - oz;
      return [dx * ax + dz * az, -dx * az + dz * ax];
    };
    const NL = shape0.low.length - 1;
    const lowAt = (al: number) => {
      const f = Math.min(NL, Math.max(0, ((al + half) / (2 * half)) * NL));
      const i = Math.min(NL - 1, Math.floor(f)), t = f - i;
      return Math.min(shape0.low[i] * (1 - t) + shape0.low[i + 1] * t, shape0.low[i], shape0.low[i + 1]) * S + RAISE;
    };
    const W = inner + 0.15;
    // a triangle is refined when its deck-frame bounding box overlaps the deck strip (+0.6 m) and it is not all below −1 m
    const near = (...vs: THREE.Vector3[]) => {
      if (vs.every((v) => v.y < -0.45)) return false; // water surface, bed, body
      let a0 = Infinity, a1 = -Infinity, c0 = Infinity, c1 = -Infinity;
      for (const v of vs) { const [al, ac] = toDeck(v.x, v.z); a0 = Math.min(a0, al); a1 = Math.max(a1, al); c0 = Math.min(c0, ac); c1 = Math.max(c1, ac); }
      return a1 > -half - 0.6 && a0 < half + 0.6 && c1 > -W - 0.6 && c0 < W + 0.6;
    };
    const pos: number[] = [], uv: number[] = [];
    const base = this.variant(tile, rotY, this.weldMask(c));
    for (const g1 of base ? [base.clone()] : []) {
      const g = subdivideConforming(g1, 0.5, (p, q) => near(p, q)); // conforming: capped vertices never open a crack
      const P = g.attributes.position as THREE.BufferAttribute, U = g.attributes.uv as THREE.BufferAttribute | undefined;
      for (let i = 0; i < P.count; i++) {
        let y = P.getY(i);
        const [al, ac] = toDeck(P.getX(i), P.getZ(i));
        if (Math.abs(al) < half && Math.abs(ac) < W && y > -1.0) y = Math.min(y, lowAt(al) - 0.05);
        pos.push(P.getX(i), y, P.getZ(i));
        uv.push(U ? U.getX(i) : 0, U ? U.getY(i) : 0);
      }
    }
    // skirts along the road edges: the road tile beyond sits a strip-depth lower (sunk strip and bevel), so a thin
    // slit opened under the parapet feet between the bed's edge and the road bevel (voidcheck r13). A vertical face
    // from the bed's boundary down to −0.45 m closes it.
    {
      const tmp = new THREE.BufferGeometry();
      tmp.setAttribute('position', new THREE.Float32BufferAttribute(pos.slice(), 3));
      const top = surfaceSampler({ parts: [{ geometry: tmp, matrix: new THREE.Matrix4() }] });
      const texel = this.grassTexel() ?? [0, 0];
      const Rc = (2 / Math.sqrt(3)) * HEX_SCALE, NS = 24;
      for (let d = 0; d < 6; d++) {
        if (!((c.roadMask >> d) & 1)) continue;
        const a0 = ((d - 0.5) * Math.PI) / 3, a1 = ((d + 0.5) * Math.PI) / 3;
        const k0 = [Rc * Math.cos(a0), -Rc * Math.sin(a0)], k1 = [Rc * Math.cos(a1), -Rc * Math.sin(a1)];
        const nx = Math.cos((d * Math.PI) / 3), nz = -Math.sin((d * Math.PI) / 3);
        const at = (i: number): number[] => {
          const t = i / NS, x = k0[0] + (k1[0] - k0[0]) * t, z = k0[1] + (k1[1] - k0[1]) * t;
          const h = top(x - nx * 0.02, z - nz * 0.02);
          return [x, Number.isFinite(h) ? h : 0, z];
        };
        for (let i = 0; i < NS; i++) {
          const A = at(i), B = at(i + 1);
          if (Math.max(A[1], B[1]) < -0.44) continue;
          const A1 = [A[0], -0.45, A[2]], B1 = [B[0], -0.45, B[2]];
          // facing outward (toward the road cell): counter-clockwise seen from outside
          for (const t of [[A, A1, B1], [A, B1, B]]) {
            const [p0, p1, p2] = t;
            const cx = (p1[1] - p0[1]) * (p2[2] - p0[2]) - (p1[2] - p0[2]) * (p2[1] - p0[1]);
            const cz = (p1[0] - p0[0]) * (p2[1] - p0[1]) - (p1[1] - p0[1]) * (p2[0] - p0[0]);
            const tri = cx * nx + cz * nz >= 0 ? t : [p0, p2, p1];
            for (const q of tri) { pos.push(q[0], q[1], q[2]); uv.push(texel[0], texel[1]); }
          }
        }
      }
    }
    const out = new THREE.BufferGeometry();
    out.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    out.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    out.computeVertexNormals();
    out.computeBoundingSphere();
    out.userData.shared = true;
    this.beds.set(key, out);
    return out;
  }

  private placeBridge(out: ChunkBuilder, R: typeof RAPIER, c: Readonly<CellData>, x: number, y0: number, z: number): ((wx: number, wz: number) => [number, number]) | null {
    let shape = this.bridgeShape();
    if (!shape) return null;
    const rot = this.bridgeRot(c, shape);
    // 5 % longer: the bridge feet reach past the road tiles' rim bevel (no dark slit at the ends)
    const S = BRIDGE_SCALE, SINK = -0.03; // (slightly raised: the deck ends sit just above the bank / road tops)
    this.place(out, BRIDGE_IDS[this.bridgeModel === 'B' ? 1 : 0], x, y0 - SINK, z, rot, undefined, true, S);
    y0 -= SINK;
    const shape0 = shape;
    shape = { ...shape0, cx: shape0.cx * S, cz: shape0.cz * S, half: shape0.half * S, halfW: shape0.halfW * S, inner: shape0.inner * S, outer: shape0.outer * S, prof: shape0.prof.map((h) => h * S) };
    // colliders: deck as sloped slabs per station pair, railings as thin boxes along both sides
    const ca = Math.cos(rot), sa = Math.sin(rot);
    // deck frame → world: deck direction in world = road angle; centre offset rotated with the model
    const ang = shape.phi + rot; // our convention
    const ax = Math.cos(ang), az = -Math.sin(ang); // three.js xz of the deck direction
    const ox = shape.cx * ca + shape.cz * sa, oz = -shape.cx * sa + shape.cz * ca;
    const toWorld = (along: number, across: number): [number, number] => [x + ox + along * ax - across * az, z + oz + along * az + across * ax];
    const n = shape.prof.length - 1;
    const step = (2 * shape.half) / n;
    for (let s = 0; s < n; s++) {
      const a0 = -shape.half + s * step, a1 = a0 + step;
      const h0 = shape.prof[s], h1 = shape.prof[s + 1];
      const pts: number[] = [];
      for (const [al, h] of [[a0, h0], [a1, h1]] as [number, number][])
        for (const ac of [-shape.halfW, shape.halfW]) {
          const [wx, wz] = toWorld(al, ac);
          pts.push(wx, y0 + h, wz, wx, y0 + Math.min(h0, h1) - 0.6, wz);
        }
      const desc = R.ColliderDesc.convexHull(new Float32Array(pts));
      if (desc) out.addCollider(desc.setCollisionGroups(WORLD_GROUPS));
    }
    // railings + side walls (player + camera solid): from the ground up to the parapet top, from the parapet's inner
    // face out to the model's OUTER face at that station + 0.4 m (the knight's helmet is wider than its capsule)
    const railH = Math.max(0.8, Math.min(1.3, shape.rail));
    const NL = shape0.outerAt.length - 1;
    const outerAt = (al: number) => {
      const f = Math.min(NL, Math.max(0, ((al + shape.half) / (2 * shape.half)) * NL));
      const i = Math.min(NL - 1, Math.floor(f));
      return Math.max(shape0.outerAt[i], shape0.outerAt[i + 1]) * S;
    };
    for (const side of [-1, 1]) {
      for (let s = 0; s < n; s++) {
        const a0 = -shape.half + s * step, a1 = a0 + step;
        const h0 = shape.prof[s], h1 = shape.prof[s + 1];
        const ow = Math.max(outerAt(a0), outerAt(a1), outerAt((a0 + a1) / 2), shape.inner + 0.2) + 0.4;
        const pts: number[] = [];
        for (const [al, h] of [[a0, h0], [a1, h1]] as [number, number][])
          for (const ac of [shape.inner, ow]) {
            const [wx, wz] = toWorld(al, side * ac);
            pts.push(wx, y0 - 0.6, wz, wx, y0 + h + railH, wz);
          }
        const desc = R.ColliderDesc.convexHull(new Float32Array(pts));
        if (desc) out.addCollider(desc.setCollisionGroups(PLAYER_ONLY_GROUPS));
      }
    }
    // approach funnels: the road strip (±1.8 m with its bevel) is wider than the walkway between the parapets, and a
    // knight running up the outer part of the road met the parapet's blunt end head-on and was deflected onto the bank
    // (character r3). A thin player-only wedge on each side, from 2.2 m out 2.5 m before the deck end to the parapet's
    // inner face at the deck end, turns that into a glancing contact that slides him onto the deck.
    const FL = 2.5, FW = 2.2, FT = 0.6;
    for (const end of [-1, 1])
      for (const side of [-1, 1]) {
        const pts: number[] = [];
        const ys = y0 + shape.prof[end < 0 ? 0 : n];
        for (const [al, ac] of [[end * (shape.half + FL), FW], [end * shape.half, shape.inner]] as [number, number][])
          for (const t of [0, FT]) {
            const [wx, wz] = toWorld(al, side * (ac + t));
            pts.push(wx, ys - 0.6, wz, wx, ys + 1.6, wz);
          }
        const desc = R.ColliderDesc.convexHull(new Float32Array(pts));
        if (desc) out.addCollider(desc.setCollisionGroups(PLAYER_ONLY_GROUPS));
      }
    // the river beside the deck stays blocked (full height) — only the deck strip is open
    const toDeck = (wx: number, wz: number): [number, number] => {
      const dx = wx - (x + ox), dz = wz - (z + oz);
      return [dx * ax + dz * az, -dx * az + dz * ax];
    };
    return toDeck;
  }

  // ------------------------------------------------------------------ river decoration
  private shallows = new Map<string, { edge: [number, number][]; mid: [number, number][] }>();
  /**
   * River decoration (hash-placed, deterministic): reeds right at the water's edge (0.2–0.9 m from the bank: they
   * mark where the player is stopped — 2 per straight cell, 3 per bend, inner bank first) and water lilies in the
   * shallows (1.0–2.2 m from the bank: 1–2 per bend, one on every third straight cell).
   */
  private riverDeco(out: ChunkBuilder, tile: string, rotY: number, c: Readonly<CellData>, x: number, y0: number, z: number): void {
    let pts = this.shallows.get(tile);
    if (!pts) {
      pts = { edge: [], mid: [] };
      const a = this.ctx.assets.get(tile);
      if (a) {
        const surf = surfaceSampler(a);
        const R = HEX_SCALE * 0.95;
        const wet = (lx: number, lz: number) => { const y = surf(lx, lz); return y > -1e8 && y < -0.6; };
        for (let lz = -R; lz <= R; lz += 0.5)
          for (let lx = -R; lx <= R; lx += 0.5) {
            if (!wet(lx, lz)) continue;
            let near = Infinity;
            for (let k = 0; k < 12; k++) {
              const an = (k * Math.PI) / 6;
              for (const rr of [0.2, 0.55, 0.9, 1.3, 1.75, 2.2]) if (!wet(lx + Math.cos(an) * rr, lz + Math.sin(an) * rr)) { near = Math.min(near, rr); break; }
            }
            // the sloped-bank variant moves the waterline 0.65 m into the water: edge points start beyond it
            if (near >= 0.9 && near <= 1.3) pts.edge.push([lx, lz]);
            else if (near > 1.3 && near <= 2.2) pts.mid.push([lx, lz]);
          }
      }
      this.shallows.set(tile, pts);
    }
    const m = c.riverMask;
    let straight = false;
    for (let d = 0; d < 3; d++) if ((m >> d) & 1 && (m >> (d + 3)) & 1) straight = true;
    const h = hash(c.q, c.r, 4242);
    const nReed = pts.edge.length ? (straight ? 2 : 3) : 0;
    const nLily = pts.mid.length ? (straight ? (h % 3 === 0 ? 1 : 0) : 1 + (h % 2)) : 0;
    const cs = Math.cos(rotY), sn = Math.sin(rotY);
    const put = (list: [number, number][], i: number, reed: boolean) => {
      const hi = hash(c.q, c.r, 4243 + i);
      const [lx, lz] = list[hi % list.length];
      const wx = x + lx * cs + lz * sn, wz = z - lx * sn + lz * cs;
      const id = RIVER_DECO_IDS[reed ? 2 + (hi % 3) : hi % 2];
      const sc = (reed ? 1.7 : 1.9) * (0.85 + ((hi >>> 8) % 100) / 300); // pack scale × 1.4–2.5: readable from the path
      this.place(out, id, wx, y0 - 0.1 * HEX_SCALE + (reed ? -0.05 : 0.01), wz, ((hi >>> 4) % 360) * (Math.PI / 180), undefined, false, sc);
    };
    for (let i = 0; i < nReed; i++) put(pts.edge, i, true);
    for (let i = 0; i < nLily; i++) put(pts.mid, 10 + i, false);
  }

  // ------------------------------------------------------------------ river blockers
  /**
   * The river channel is not walkable: player-only boxes along every river arm (centre → edge midpoint), from below
   * the tile top to +2.4 m. The camera ignores them. On bridge cells they stay below the deck (the deck slabs carry
   * the player over the river).
   */
  private water = new Map<string, { x: number; z: number; hx: number; hz: number }[]>();
  /**
   * The river channel is not walkable: player-only boxes over the tile's water area (sampled from the tile geometry,
   * so bends are covered), from below the water to +2.4 m. The camera ignores them. On bridge cells they stay low
   * (≤ 0.3 m above the tile top) — the deck slabs carry the player over.
   */
  private riverBlockers(out: ChunkBuilder, R: typeof RAPIER, tile: string, rotY: number, x: number, y0: number, z: number, bridge: boolean): void {
    let boxes = this.water.get(tile);
    if (!boxes) {
      const a = this.ctx.assets.get(tile);
      boxes = a ? waterBoxes(a) : [];
      this.water.set(tile, boxes);
    }
    const top = bridge ? y0 + 0.3 : y0 + 2.4;
    const cy = (top + y0 - 1.5) / 2, hy = (top - (y0 - 1.5)) / 2;
    const c = Math.cos(rotY), s = Math.sin(rotY);
    _q.setFromAxisAngle(Y, rotY);
    for (const b of boxes) {
      const desc = R.ColliderDesc.cuboid(b.hx, hy, b.hz);
      desc.setTranslation(x + b.x * c + b.z * s, cy, z - b.x * s + b.z * c);
      desc.setRotation({ x: _q.x, y: _q.y, z: _q.z, w: _q.w });
      out.addCollider(desc.setCollisionGroups(PLAYER_ONLY_GROUPS));
    }
  }

  private waterPts = new Map<string, [number, number][]>();
  /**
   * Bridge cell: full-height player-only boxes over the water EXCEPT under the deck strip (deck slabs + parapets carry
   * and fence the player there). 0.5 m sampling, rows merged into runs.
   */
  private bridgeBlockers(out: ChunkBuilder, R: typeof RAPIER, tile: string, rotY: number, x: number, y0: number, z: number, toDeck: ((wx: number, wz: number) => [number, number]) | null): void {
    const shape = this.bridgeShape();
    let pts = this.waterPts.get(tile);
    if (!pts) {
      const a = this.ctx.assets.get(tile);
      pts = [];
      if (a) {
        const surf = surfaceSampler(a);
        const Rr = HEX_SCALE * 1.02;
        for (let lz = -Rr; lz <= Rr; lz += 0.5)
          for (let lx = -Rr; lx <= Rr; lx += 0.5) {
            const y = surf(lx, lz);
            if (y > -1e8 && y < -0.5) pts.push([lx, lz]);
          }
      }
      this.waterPts.set(tile, pts);
    }
    const c = Math.cos(rotY), sn = Math.sin(rotY);
    _q.setFromAxisAngle(Y, rotY);
    const free = (lx: number, lz: number) => {
      if (!toDeck || !shape) return false;
      const [al, ac] = toDeck(x + lx * c + lz * sn, z - lx * sn + lz * c);
      return Math.abs(al) < shape.half * BRIDGE_SCALE && Math.abs(ac) < shape.inner * BRIDGE_SCALE + 0.45;
    };
    const top = y0 + 2.4, bot = y0 - 1.5;
    const add = (x0: number, x1: number, lz: number, hy: number, cy: number) => {
      const desc = R.ColliderDesc.cuboid((x1 - x0) / 2 + 0.3, hy, 0.3);
      const lx = (x0 + x1) / 2;
      desc.setTranslation(x + lx * c + lz * sn, cy, z - lx * sn + lz * c);
      desc.setRotation({ x: _q.x, y: _q.y, z: _q.z, w: _q.w });
      out.addCollider(desc.setCollisionGroups(PLAYER_ONLY_GROUPS));
    };
    // group samples by row
    const rows = new Map<number, number[]>();
    for (const [lx, lz] of pts) {
      const k = Math.round(lz * 2);
      let r = rows.get(k);
      if (!r) rows.set(k, (r = []));
      r.push(lx);
    }
    for (const [k, xs] of rows) {
      const lz = k / 2;
      xs.sort((p, q) => p - q);
      let run: number[] = [], runFree = false;
      const flush = () => {
        if (run.length) {
          if (runFree) { /* under the deck: the deck slabs cover it */ }
          else add(run[0], run[run.length - 1], lz, (top - bot) / 2, (top + bot) / 2);
        }
        run = [];
      };
      for (const lx of xs) {
        const f = free(lx, lz);
        if (run.length && (f !== runFree || lx - run[run.length - 1] > 0.51)) flush();
        if (!run.length) runFree = f;
        run.push(lx);
      }
      flush();
    }
  }
}
