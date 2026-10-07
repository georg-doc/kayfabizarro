// Pointy-top axial hex math. Edge d: 0 E, 1 NE, 2 NW, 3 W, 4 SW, 5 SE. See ARCHITECTURE.md §1.
import { HEX_SIZE, CHUNK } from './units';

export const DIRS: readonly [number, number][] = [
  [1, 0], [1, -1], [0, -1], [-1, 0], [-1, 1], [0, 1],
];

export const SQRT3 = Math.sqrt(3);

/** World xz centre of hex (q, r). */
export function hexToWorld(q: number, r: number): { x: number; z: number } {
  return { x: HEX_SIZE * SQRT3 * (q + r / 2), z: HEX_SIZE * 1.5 * r };
}

/** Fractional axial coords of world xz. */
export function worldToAxial(x: number, z: number): { q: number; r: number } {
  const q = ((SQRT3 / 3) * x - (1 / 3) * z) / HEX_SIZE;
  const r = ((2 / 3) * z) / HEX_SIZE;
  return { q, r };
}

/** Hex containing world xz. */
export function worldToHex(x: number, z: number): { q: number; r: number } {
  const a = worldToAxial(x, z);
  return hexRound(a.q, a.r);
}

export function hexRound(q: number, r: number): { q: number; r: number } {
  const s = -q - r;
  let rq = Math.round(q), rr = Math.round(r);
  const rs = Math.round(s);
  const dq = Math.abs(rq - q), dr = Math.abs(rr - r), ds = Math.abs(rs - s);
  if (dq > dr && dq > ds) rq = -rr - rs;
  else if (dr > ds) rr = -rq - rs;
  return { q: rq, r: rr };
}

export function neighbor(q: number, r: number, d: number): { q: number; r: number } {
  const [dq, dr] = DIRS[((d % 6) + 6) % 6];
  return { q: q + dq, r: r + dr };
}

export function hexDistance(q1: number, r1: number, q2: number, r2: number): number {
  const dq = q1 - q2, dr = r1 - r2;
  return (Math.abs(dq) + Math.abs(dr) + Math.abs(dq + dr)) / 2;
}

/** Direction index from a to an adjacent b, or -1. */
export function dirTo(q1: number, r1: number, q2: number, r2: number): number {
  const dq = q2 - q1, dr = r2 - r1;
  for (let d = 0; d < 6; d++) if (DIRS[d][0] === dq && DIRS[d][1] === dr) return d;
  return -1;
}

export const opposite = (d: number) => (d + 3) % 6;

/** World-space angle (radians, from +X toward −Z, i.e. three.js Y-rotation) the edge d faces. */
export function edgeAngle(d: number): number {
  return (d * Math.PI) / 3;
}

/**
 * Y rotation that turns an object whose "front" points along +X (asset local) to face edge d.
 * Modules that know their asset's local front direction add their own offset.
 */
export function rotationForEdge(d: number): number {
  return edgeAngle(d);
}

/** Unit vector (x, z) pointing from the hex centre toward edge d's midpoint. */
export function edgeVector(d: number): { x: number; z: number } {
  const a = edgeAngle(d);
  return { x: Math.cos(a), z: -Math.sin(a) };
}

/** Chunk coordinate containing hex. Chunks are CHUNK×CHUNK axial parallelograms. */
export function hexToChunk(q: number, r: number): { cx: number; cz: number } {
  return { cx: Math.floor(q / CHUNK), cz: Math.floor(r / CHUNK) };
}

export function chunkKey(cx: number, cz: number): string {
  return cx + ',' + cz;
}

export function* chunkCells(cx: number, cz: number): Generator<{ q: number; r: number }> {
  for (let r = cz * CHUNK; r < (cz + 1) * CHUNK; r++)
    for (let q = cx * CHUNK; q < (cx + 1) * CHUNK; q++) yield { q, r };
}

/** Rotate a 6-bit edge mask by k steps (bit d → bit d+k). */
export function rotateMask(mask: number, k: number): number {
  k = ((k % 6) + 6) % 6;
  return ((mask << k) | (mask >> (6 - k))) & 63;
}

export function bitCount6(m: number): number {
  let c = 0;
  for (let d = 0; d < 6; d++) if (m & (1 << d)) c++;
  return c;
}
