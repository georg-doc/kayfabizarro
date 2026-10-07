// Placement geometry inside one hex: push a building toward the street it faces until its front façade is
// STREET_GAP from the hex boundary, keeping its whole footprint inside the hex (so neighbouring cells never collide);
// pairs of houses on a street corner without overlap.
import { HEX_SIZE } from '../../core/units';
import { FOOTPRINT, FRONT_DEPTH, STREET_GAP, UNIT, rotForDoor, type BuildingType } from './catalog';

export interface Placed {
  x: number; // metres from the cell centre
  z: number;
  rotY: number;
}

const INNER = (HEX_SIZE * Math.sqrt(3)) / 2; // 7.5 m
const EDGES = [0, 1, 2, 3, 4, 5].map((d) => ({ x: Math.cos((d * Math.PI) / 3), z: -Math.sin((d * Math.PI) / 3) }));

/** Facing angle → unit xz vector (OUR convention: angle from +X toward −Z). */
export const faceVec = (face: number) => ({ x: Math.cos((face * Math.PI) / 3), z: -Math.sin((face * Math.PI) / 3) });

/** Footprint corners (world-relative metres) of type t rotated by rotY and moved to (ox, oz). */
export function corners(t: BuildingType, rotY: number, ox: number, oz: number, pad = 0): [number, number][] {
  const [x0, x1, z0, z1] = FOOTPRINT[t];
  const c = Math.cos(rotY), s = Math.sin(rotY);
  const pts: [number, number][] = [];
  for (const [lx, lz] of [[x0 * UNIT - pad, z0 * UNIT - pad], [x1 * UNIT + pad, z0 * UNIT - pad], [x1 * UNIT + pad, z1 * UNIT + pad], [x0 * UNIT - pad, z1 * UNIT + pad]])
    pts.push([ox + lx * c + lz * s, oz - lx * s + lz * c]);
  return pts;
}

export function insideHex(pts: [number, number][], margin: number): boolean {
  for (const [x, z] of pts) for (const e of EDGES) if (x * e.x + z * e.z > INNER - margin) return false;
  return true;
}

/** Separating-axis overlap test of two convex quads. */
export function overlaps(a: [number, number][], b: [number, number][]): boolean {
  for (const poly of [a, b])
    for (let i = 0; i < 4; i++) {
      const [x0, z0] = poly[i], [x1, z1] = poly[(i + 1) % 4];
      const nx = z1 - z0, nz = x0 - x1;
      let amin = Infinity, amax = -Infinity, bmin = Infinity, bmax = -Infinity;
      for (const [x, z] of a) { const p = x * nx + z * nz; amin = Math.min(amin, p); amax = Math.max(amax, p); }
      for (const [x, z] of b) { const p = x * nx + z * nz; bmin = Math.min(bmin, p); bmax = Math.max(bmax, p); }
      if (amax < bmin || bmax < amin) return false;
    }
  return true;
}

/** Single building facing `face` (edge index, may be x.5 = corner), pushed toward that side. */
export function fitOne(t: BuildingType, face: number, gap = STREET_GAP, avoid: [number, number][][] = []): Placed | null {
  const rotY = rotForDoor(t, face);
  const u = faceVec(face);
  const L = Number.isInteger(face) ? INNER : HEX_SIZE;
  const sMax = Math.max(0, L - gap - FRONT_DEPTH[t] * UNIT);
  // big models (market, tavern, lumbermill) are wider than a hex allows with margin: let them overhang a little
  for (const margin of [0.3, -0.6, -1.4])
    for (let s = sMax; s >= -0.01; s -= 0.25) {
      const ss = Math.max(0, s);
      if (!insideHex(corners(t, rotY, u.x * ss, u.z * ss), margin)) continue;
      const pad = corners(t, rotY, u.x * ss, u.z * ss, 0.3);
      if (avoid.some((o) => overlaps(pad, o))) continue;
      return { x: u.x * ss, z: u.z * ss, rotY };
    }
  return null;
}

/** Two buildings on a street corner: A faces edge dA, B faces edge dB, each slid away from the other. */
export function fitPair(tA: BuildingType, dA: number, tB: BuildingType, dB: number, margin = 0.3): [Placed, Placed] | null {
  const uA = faceVec(dA), uB = faceVec(dB);
  const side = (u: { x: number; z: number }, o: { x: number; z: number }) => {
    let px = -u.z, pz = u.x;
    if (px * (u.x - o.x) + pz * (u.z - o.z) < 0) { px = -px; pz = -pz; }
    return { x: px, z: pz };
  };
  const pA = side(uA, uB), pB = side(uB, uA);
  const rA = rotForDoor(tA, dA), rB = rotForDoor(tB, dB);
  const maxA = INNER - STREET_GAP - FRONT_DEPTH[tA] * UNIT, maxB = INNER - STREET_GAP - FRONT_DEPTH[tB] * UNIT;
  for (let k = 0; k <= 8; k++) {
    const sA = Math.max(0, maxA - k * 0.4), sB = Math.max(0, maxB - k * 0.4);
    for (const lat of [3.2, 2.8, 2.4, 2.0, 1.6, 1.2]) {
      const a = { x: uA.x * sA + pA.x * lat, z: uA.z * sA + pA.z * lat };
      const b = { x: uB.x * sB + pB.x * lat, z: uB.z * sB + pB.z * lat };
      const ca = corners(tA, rA, a.x, a.z), cb = corners(tB, rB, b.x, b.z);
      if (!insideHex(ca, margin) || !insideHex(cb, margin)) continue;
      if (overlaps(corners(tA, rA, a.x, a.z, 0.35), corners(tB, rB, b.x, b.z, 0.35))) continue;
      return [{ x: a.x, z: a.z, rotY: rA }, { x: b.x, z: b.z, rotY: rB }];
    }
  }
  return null;
}

/** Distance from point (x, z) to a convex quad (0 inside). */
export function polyDist(pts: [number, number][], x: number, z: number): number {
  let inside = true, best = Infinity;
  let sign = 0;
  for (let i = 0; i < pts.length; i++) {
    const [ax, az] = pts[i], [bx, bz] = pts[(i + 1) % pts.length];
    const cr = (bx - ax) * (z - az) - (bz - az) * (x - ax);
    if (cr !== 0) {
      const sg = Math.sign(cr);
      if (sign === 0) sign = sg;
      else if (sg !== sign) inside = false;
    }
    const vx = bx - ax, vz = bz - az;
    const t = Math.max(0, Math.min(1, ((x - ax) * vx + (z - az) * vz) / (vx * vx + vz * vz)));
    best = Math.min(best, Math.hypot(ax + vx * t - x, az + vz * t - z));
  }
  return inside ? 0 : best;
}

/**
 * Facing toward a road given candidate strip segments [x0, z0, x1, z1] (world metres) near a lot centre (lx, lz):
 * the front is PERPENDICULAR to the road segment passing nearest (not the radial direction to the nearest point, which
 * leaves houses ~30° off a bend), quantised to 30° steps (half edge indices). Segments whose nearest point is interior
 * win over ones that only touch with an end point (a bend's joint). Returns face index (0..6, step 0.5) or null.
 */
export function roadFace(lx: number, lz: number, segs: [number, number, number, number][]): number | null {
  let best: { dd: number; interior: boolean; nx: number; nz: number } | null = null;
  for (const [x0, z0, x1, z1] of segs) {
    const vx = x1 - x0, vz = z1 - z0;
    const L2 = vx * vx + vz * vz;
    if (L2 < 1e-6) continue;
    const tr = ((lx - x0) * vx + (lz - z0) * vz) / L2;
    const t = Math.max(0, Math.min(1, tr));
    const px = x0 + vx * t, pz = z0 + vz * t;
    const dd = Math.hypot(px - lx, pz - lz);
    const interior = tr > 0.02 && tr < 0.98;
    const l = Math.sqrt(L2);
    let nx = -vz / l, nz = vx / l;
    // point the normal from the lot toward the road line
    const mx = (x0 + x1) / 2 - lx, mz = (z0 + z1) / 2 - lz;
    if (nx * mx + nz * mz < 0) { nx = -nx; nz = -nz; }
    const score = dd - (interior ? 2.5 : 0);
    if (!best || score < best.dd - (best.interior ? 2.5 : 0)) best = { dd, interior, nx, nz };
  }
  if (!best) return null;
  const ang = Math.atan2(-best.nz, best.nx);
  return ((Math.round(ang / (Math.PI / 6)) / 2) % 6 + 6) % 6;
}
