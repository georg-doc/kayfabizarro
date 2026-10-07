// Procedural lake shore: the top of a shore cell is a finely triangulated heightfield whose height and grass/sand split
// are functions of the distance D to the union of the neighbouring water hexes. Because D is one world-space function,
// neighbouring shore cells agree exactly at their shared edges, the waterline is a clean offset of the hex outline of the
// lake (straight along hex edges, rounded around water corners) and the sand band has a constant, KayKit-like width.
import { DIRS, hexToWorld } from '../../core/hex';
import { HEX_SIZE } from '../../core/units';

/** Sand band width measured from the water hex edge into the land cell (m). */
export const SAND_W = 6.0;
/** Width of the small grass→sand lip (m) and its drop (m). */
export const LIP_W = 1.2;
export const LIP_DROP = 0.3;
/** Sand height at the water hex edge, below the land level (m). Water surface is 1.5 m below the land level. */
export const SAND_EDGE = 2.86; // → waterline ≈ 3 m into the shore cell (rounded convex corners)
/** Rim drop of the neighbouring (softened) KayKit tiles, metres: shore cells match it on their land edges. */
export const SHORE_RIM = 0; // welded flat tops (integration pass) have no rim

/** Shore surface height (relative to land level) at local (lx,lz) with distance D: profile + matching rim on land edges. */
export function shoreSurface(lx: number, lz: number, D: number): number {
  const h = shoreProfile(D);
  if (D < SAND_W) return h;
  const ap = (HEX_SIZE * Math.sqrt(3)) / 2;
  for (let d = 0; d < 3; d++) {
    const a = (d * Math.PI) / 3;
    if (Math.abs(lx * Math.cos(a) - lz * Math.sin(a)) > ap * 0.999) return h - SHORE_RIM;
  }
  return h;
}

/** Grid subdivisions per sector edge. */
export const SHORE_N = 10;

/** Height of the shore surface relative to the land level, as a function of D. */
export function shoreProfile(D: number): number {
  if (D >= SAND_W) return 0;
  if (D > SAND_W - LIP_W) return (-LIP_DROP * (SAND_W - D)) / LIP_W;
  const t = D / (SAND_W - LIP_W);
  return -SAND_EDGE + (SAND_EDGE - LIP_DROP) * t;
}

/** Distance from the land level down to where the sand meets the water surface (for colouring the shallows). */
export function waterlineD(waterDrop: number): number {
  return ((SAND_EDGE - waterDrop) / (SAND_EDGE - LIP_DROP)) * (SAND_W - LIP_W);
}

const CORNER_ANG = [0, 1, 2, 3, 4, 5].map((i) => ((30 + 60 * i) * Math.PI) / 180);
const CX = CORNER_ANG.map((a) => HEX_SIZE * Math.cos(a));
const CZ = CORNER_ANG.map((a) => -HEX_SIZE * Math.sin(a));

/** Distance from point (px,pz) to the hexagon centred at (cx,cz) (0 inside). */
export function distToHex(px: number, pz: number, cx: number, cz: number): number {
  const x = px - cx, z = pz - cz;
  // inside test via the three slab apothems
  const ap = (HEX_SIZE * Math.sqrt(3)) / 2;
  let inside = true;
  for (let d = 0; d < 3; d++) {
    const a = (d * Math.PI) / 3;
    if (Math.abs(x * Math.cos(a) - z * Math.sin(a)) > ap) { inside = false; break; }
  }
  if (inside) return 0;
  let best = Infinity;
  for (let i = 0; i < 6; i++) {
    const ax = CX[i], az = CZ[i], bx = CX[(i + 1) % 6], bz = CZ[(i + 1) % 6];
    const ex = bx - ax, ez = bz - az;
    const t = Math.max(0, Math.min(1, ((x - ax) * ex + (z - az) * ez) / (ex * ex + ez * ez)));
    const dx = x - ax - t * ex, dz = z - az - t * ez;
    const dd = dx * dx + dz * dz;
    if (dd < best) best = dd;
  }
  return Math.sqrt(best);
}

/** Centres of the water neighbours of a shore cell. */
export function waterCentres(q: number, r: number, coastMask: number): { x: number; z: number }[] {
  const out: { x: number; z: number }[] = [];
  for (let d = 0; d < 6; d++) if ((coastMask >> d) & 1) out.push(hexToWorld(q + DIRS[d][0], r + DIRS[d][1]));
  return out;
}

/** Smoothing radius (m) of the shore distance field: fills the hex staircase notches of the lake outline. */
export const SHORE_SMOOTH = 8;

/**
 * Smoothed distance to the water hexes (polynomial smooth-min over the per-hex distances, clamped ≥ 0): concave notches
 * of the hex outline are filled, convex corners are rounded by the waterline offset → a curved, KayKit-clean beach.
 * Land-cell edges of shore cells stay ≥ 8.66 − SHORE_SMOOTH/4 > SAND_W from water, so the beach never leaves the shore
 * ring. One world-space function → neighbouring shore cells agree exactly.
 */
export function shoreD(x: number, z: number, centres: { x: number; z: number }[]): number {
  let D = Infinity;
  const k = SHORE_SMOOTH;
  for (const c of centres) {
    const d = distToHex(x, z, c.x, c.z);
    if (D === Infinity) { D = d; continue; }
    const h = Math.max(k - Math.abs(D - d), 0) / k;
    D = Math.min(D, d) - h * h * k * 0.25;
  }
  return Math.max(0, D);
}

/**
 * Triangle lattice of one hex: 6 sectors (centre, corner i, corner i+1), each split into N² triangles.
 * Calls emit(ax,az, bx,bz, cx,cz) with CCW-from-above winding (world offsets from the hex centre).
 */
export function hexLattice(N: number, emit: (ax: number, az: number, bx: number, bz: number, cx: number, cz: number) => void): void {
  for (let s = 0; s < 6; s++) {
    const ux = CX[s] / N, uz = CZ[s] / N, vx = CX[(s + 1) % 6] / N, vz = CZ[(s + 1) % 6] / N;
    const P = (a: number, b: number) => [a * ux + b * vx, a * uz + b * vz];
    for (let a = 0; a < N; a++)
      for (let b = 0; b < N - a; b++) {
        const p0 = P(a, b), p1 = P(a + 1, b), p2 = P(a, b + 1);
        emit(p0[0], p0[1], p1[0], p1[1], p2[0], p2[1]);
        if (a + b < N - 1) {
          const p3 = P(a + 1, b + 1);
          emit(p1[0], p1[1], p3[0], p3[1], p2[0], p2[1]);
        }
      }
  }
}

/**
 * Height at local (x,z) of a lattice whose vertex heights are f(vertex): exact barycentric interpolation of the same
 * triangle the mesh uses (so heightAt matches the rendered surface).
 */
export function latticeHeight(N: number, x: number, z: number, f: (x: number, z: number) => number): number {
  let ang = Math.atan2(-z, x) - Math.PI / 6;
  ang = ((ang % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
  const s = Math.min(5, Math.floor(ang / (Math.PI / 3)));
  const ux = CX[s] / N, uz = CZ[s] / N, vx = CX[(s + 1) % 6] / N, vz = CZ[(s + 1) % 6] / N;
  // solve x = a*ux + b*vx, z = a*uz + b*vz
  const det = ux * vz - vx * uz;
  let a = (x * vz - vx * z) / det, b = (ux * z - x * uz) / det;
  a = Math.max(0, a);
  b = Math.max(0, b);
  if (a + b > N) { const k = N / (a + b); a *= k; b *= k; }
  let ia = Math.min(N - 1, Math.floor(a)), ib = Math.min(N - 1 - ia, Math.floor(b));
  if (ia + ib > N - 1) ib = N - 1 - ia;
  const fa = a - ia, fb = b - ib;
  const H = (aa: number, bb: number) => f(aa * ux + bb * vx, aa * uz + bb * vz);
  if (fa + fb <= 1 || ia + ib === N - 1) {
    const h0 = H(ia, ib), h1 = H(ia + 1, ib), h2 = H(ia, ib + 1);
    return h0 + fa * (h1 - h0) + fb * (h2 - h0);
  }
  const h1 = H(ia + 1, ib), h2 = H(ia, ib + 1), h3 = H(ia + 1, ib + 1);
  return h3 + (1 - fa) * (h2 - h3) + (1 - fb) * (h1 - h3);
}
