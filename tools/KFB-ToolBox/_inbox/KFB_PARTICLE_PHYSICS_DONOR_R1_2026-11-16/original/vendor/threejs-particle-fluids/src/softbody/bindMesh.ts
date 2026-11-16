import { BufferGeometry, Float32BufferAttribute, Uint32BufferAttribute } from 'three';

import type { SoftbodySystem } from './SoftbodySystem.js';

/** Particles each vertex follows. */
const INFLUENCES = 4;
/**
 * Particles with fewer face neighbors than this sit on one-particle-thick
 * chains (the tip of a bunny ear, say), which shape matching can't hold
 * steady. Vertices bind to steadier particles instead, so thin features
 * move rigidly with the body rather than tearing.
 */
const STABLE_DEGREE = 3;

/**
 * Skin `geometry` to a soft body: give every vertex its four nearest stable
 * particles and inverse-distance weights that sum to one, stored as the
 * `influences` and `weights` attributes. The geometry must be positioned
 * like the body's rest shape. Returns the geometry.
 *
 * Only {@link SoftbodyMesh} calls this, so its errors carry that name.
 */
export function bindSoftbodyMesh(
  geometry: BufferGeometry,
  softbody: SoftbodySystem,
  bodyIndex: number,
): BufferGeometry {
  const body = softbody.bodies[bodyIndex];
  if (!body) throw new Error(`SoftbodyMesh: no body ${bodyIndex} (have ${softbody.bodies.length})`);
  const position = geometry.getAttribute('position');
  if (!position) throw new Error('SoftbodyMesh: geometry has no position attribute');
  const { restPositions: rest, range, edges } = body;
  const n = range.count;

  const stable = new Uint8Array(n).fill(1);
  if (edges && edges.length > 0) {
    const degree = new Uint32Array(n);
    for (const i of edges) degree[i]!++;
    for (let i = 0; i < n; i++) stable[i] = degree[i]! >= STABLE_DEGREE ? 1 : 0;
    // A body made only of chains still has to bind to something.
    if (!stable.includes(1)) stable.fill(1);
  }

  const influences = new Uint32Array(INFLUENCES * position.count).fill(range.start);
  const weights = new Float32Array(INFLUENCES * position.count);
  // Keeps a vertex sitting on a particle from getting an infinite weight.
  const minDistance = 0.1 * softbody.particles.particleRadius;
  const bestDistSq = new Float64Array(INFLUENCES);
  const bestIndex = new Int32Array(INFLUENCES);
  // Patch: a grid over the particles, in place of testing every particle for every vertex, which
  // froze the page for seconds on a detailed mesh with thousands of particles. Same result.
  const cell = 4 * softbody.particles.particleRadius;
  const cellKey = (ix: number, iy: number, iz: number) => (ix + 1024) * 4194304 + (iy + 1024) * 2048 + (iz + 1024);
  const cells = new Map<number, number[]>();
  let minCell = Infinity,
    maxCell = -Infinity;
  for (let i = 0; i < n; i++) {
    if (!stable[i]) continue;
    const ix = Math.floor(rest[i * 3]! / cell),
      iy = Math.floor(rest[i * 3 + 1]! / cell),
      iz = Math.floor(rest[i * 3 + 2]! / cell);
    minCell = Math.min(minCell, ix, iy, iz);
    maxCell = Math.max(maxCell, ix, iy, iz);
    const key = cellKey(ix, iy, iz);
    const list = cells.get(key);
    if (list) list.push(i);
    else cells.set(key, [i]);
  }
  for (let v = 0; v < position.count; v++) {
    const x = position.getX(v),
      y = position.getY(v),
      z = position.getZ(v);
    bestDistSq.fill(Infinity);
    bestIndex.fill(-1);
    const cx = Math.floor(x / cell),
      cy = Math.floor(y / cell),
      cz = Math.floor(z / cell);
    const consider = (list: number[] | undefined) => {
      if (!list) return;
      for (const i of list) {
        const dx = rest[i * 3]! - x,
          dy = rest[i * 3 + 1]! - y,
          dz = rest[i * 3 + 2]! - z;
        const d = dx * dx + dy * dy + dz * dz;
        let worst = 0;
        for (let k = 1; k < INFLUENCES; k++) if (bestDistSq[k]! > bestDistSq[worst]!) worst = k;
        if (d < bestDistSq[worst]!) {
          bestDistSq[worst] = d;
          bestIndex[worst] = i;
        }
      }
    };
    // Rings of cells outward. Anything in ring r is at least (r - 1) cells away, so stop once the
    // farthest of the four best is nearer than that.
    const lastRing = Math.max(maxCell - Math.min(cx, cy, cz), Math.max(cx, cy, cz) - minCell) + 1;
    for (let r = 0; r <= lastRing; r++) {
      let farthest = 0;
      for (let k = 0; k < INFLUENCES; k++) farthest = Math.max(farthest, bestDistSq[k]!);
      if (r > 0 && farthest <= ((r - 1) * cell) ** 2) break;
      for (let a = -r; a <= r; a++)
        for (let b = -r; b <= r; b++) {
          if (Math.abs(a) === r || Math.abs(b) === r) {
            for (let c = -r; c <= r; c++) consider(cells.get(cellKey(cx + a, cy + b, cz + c)));
          } else {
            consider(cells.get(cellKey(cx + a, cy + b, cz - r)));
            if (r > 0) consider(cells.get(cellKey(cx + a, cy + b, cz + r)));
          }
        }
    }
    let total = 0;
    for (let k = 0; k < INFLUENCES; k++) {
      if (bestIndex[k]! < 0) continue;
      total += 1 / Math.max(Math.sqrt(bestDistSq[k]!), minDistance);
    }
    for (let k = 0; k < INFLUENCES; k++) {
      const i = bestIndex[k]!;
      if (i < 0) continue;
      influences[v * INFLUENCES + k] = range.start + i;
      weights[v * INFLUENCES + k] = 1 / Math.max(Math.sqrt(bestDistSq[k]!), minDistance) / total;
    }
  }
  geometry.setAttribute('influences', new Uint32BufferAttribute(influences, INFLUENCES));
  geometry.setAttribute('weights', new Float32BufferAttribute(weights, INFLUENCES));
  return geometry;
}
