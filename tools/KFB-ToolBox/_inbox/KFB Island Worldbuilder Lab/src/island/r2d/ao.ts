// Baked occlusion (Steuerung 10.10., Lauf 03 Punkt 4): cheap, deterministic darkening in the creases of the clay, baked
// once per build as a vertex attribute `aAO` (1 = open, lower = occluded) and multiplied into the diffuse colour by the
// R2D materials. Same on every device; no screen-space pass (GTAO is a Stufe-2 budget decision).
import * as THREE from 'three';
import { sstep } from './math';

/** neighbour lists from an indexed geometry */
function neighbours(geo: THREE.BufferGeometry): number[][] {
  const n = geo.attributes.position.count, ix = geo.index!, nb = Array.from({ length: n }, () => new Set<number>());
  for (let t = 0; t < ix.count; t += 3) for (let e = 0; e < 3; e++) { const a = ix.getX(t + e), b = ix.getX(t + ((e + 1) % 3)); nb[a].add(b); nb[b].add(a); }
  return nb.map((s) => [...s]);
}

/**
 * Cavity from the mesh: how far the 2-ring neighbourhood's centre lies in front of the vertex along its normal, relative
 * to the neighbourhood size (concave creases between drips, under knobs, at the foot of a wall). Smoothed, so it reads
 * as soft clay shade and never as a line.
 */
export function cavityAO(geo: THREE.BufferGeometry, strength = 0.32, smooth = 3): Float32Array {
  const P = geo.attributes.position as THREE.BufferAttribute, N = geo.attributes.normal as THREE.BufferAttribute, n = P.count, nb = neighbours(geo);
  const c = new Float32Array(n), ao = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const ring = new Set<number>(nb[i]);
    for (const j of nb[i]) for (const k of nb[j]) ring.add(k);
    ring.delete(i);
    if (!ring.size) { c[i] = 0; continue; }
    let x = 0, y = 0, z = 0, r = 0;
    for (const j of ring) { x += P.getX(j); y += P.getY(j); z += P.getZ(j); }
    const k = ring.size; x /= k; y /= k; z /= k;
    for (const j of ring) r += Math.hypot(P.getX(j) - x, P.getY(j) - y, P.getZ(j) - z);
    r = r / k || 1;
    c[i] = ((x - P.getX(i)) * N.getX(i) + (y - P.getY(i)) * N.getY(i) + (z - P.getZ(i)) * N.getZ(i)) / r;
  }
  for (let i = 0; i < n; i++) ao[i] = 1 - strength * sstep(0.03, 0.35, c[i]);
  return smoothAO(ao, nb, smooth);
}

export function smoothAO(ao: Float32Array, nb: number[][], it: number): Float32Array {
  let a = ao;
  for (let s = 0; s < it; s++) {
    const b = new Float32Array(a.length);
    for (let i = 0; i < a.length; i++) { let v = a[i]; for (const j of nb[i]) v += a[j]; b[i] = v / (nb[i].length + 1); }
    a = b;
  }
  return a;
}

/**
 * Horizon occlusion on the polar top net (rows × NA, row 0 = centre): along the four grid directions, the steepest rise
 * of the ground within `reach` units darkens the vertex (foot of terraces, crags, the castle rock). Rows ≥ `rimRow` (roll
 * and wall) keep only their cavity.
 */
export function horizonAO(geo: THREE.BufferGeometry, NA: number, rimRow: number, reach = 14, strength = 0.3): Float32Array {
  const P = geo.attributes.position as THREE.BufferAttribute, n = P.count, ao = new Float32Array(n).fill(1);
  const at = (row: number, a: number) => row * NA + (((a % NA) + NA) % NA);
  for (let row = 1; row < rimRow; row++) for (let a = 0; a < NA; a++) {
    const i = at(row, a), x = P.getX(i), y = P.getY(i), z = P.getZ(i);
    let occ = 0;
    for (const [dr, da] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      let best = 0;
      for (let s = 1; s <= 24; s++) {
        const r2 = row + dr * s, a2 = a + da * s;
        if (r2 < 1 || r2 >= rimRow) break;
        const j = at(r2, a2), d = Math.hypot(P.getX(j) - x, P.getZ(j) - z);
        if (d > reach) break;
        if (d > 0.3) best = Math.max(best, (P.getY(j) - y) / d);
      }
      occ += Math.atan(best) / (Math.PI / 2);
    }
    ao[i] = 1 - strength * sstep(0.04, 0.3, occ / 4);
  }
  // two grid passes: the per-vertex horizon is noisy on the polar net (it shaded along the triangle diagonals)
  for (let it = 0; it < 2; it++) {
    const o = ao.slice();
    for (let row = 1; row < rimRow; row++) for (let a = 0; a < NA; a++) {
      const i = at(row, a); let s = o[i] * 2, k = 2;
      for (const j of [at(row - 1, a), at(row + 1, a), at(row, a + 1), at(row, a - 1)]) { s += o[j]; k++; }
      ao[i] = s / k;
    }
  }
  return ao;
}
