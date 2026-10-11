// R2D v0 helpers, ported 1:1 from donors/kfb-island-kit-r2-2026-10-08/KFB_R2D_v0/island.js (Z. 49–57).
// The JS hash keeps R2D's sin form on purpose (double precision, identical values to the donor for the port test);
// the GLSL side (top-material.ts) uses a sine-free hash.
export type P2 = [number, number];

export const clamp = (x: number, a: number, b: number) => Math.min(b, Math.max(a, x));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const sstep = (a: number, b: number, x: number) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
export const hash2 = (x: number, y: number, s: number) => { const h = Math.sin(x * 127.1 + y * 311.7 + s * 74.7) * 43758.5453; return h - Math.floor(h); };
/** value noise in [-1, 1] */
export const vnoise = (x: number, y: number, s: number) => {
  const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi, u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
  const a = hash2(xi, yi, s), b = hash2(xi + 1, yi, s), c = hash2(xi, yi + 1, s), d = hash2(xi + 1, yi + 1, s);
  return (a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v) * 2 - 1;
};
export const fbm = (x: number, y: number, s: number, o = 4) => { let a = 0, f = 1, w = 0.5; for (let i = 0; i < o; i++) { a += w * vnoise(x * f, y * f, s + i * 13); f *= 2.03; w *= 0.5; } return a; };
export const rng = (a: number) => () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
export function sdHex(dx: number, dz: number, r: number) {
  const kx = -0.866025404, ky = 0.5, kz = 0.577350269;
  let px = Math.abs(dz), py = Math.abs(dx);
  const d = 2 * Math.min(kx * px + ky * py, 0);
  px -= d * kx; py -= d * ky; px -= clamp(px, -kz * r, kz * r); py -= r;
  return Math.hypot(px, py) * Math.sign(py);
}
export const smin = (a: number, b: number, k: number) => { const h = Math.max(k - Math.abs(a - b), 0) / k; return Math.min(a, b) - h * h * k * 0.25; };
export const distSeg = (px: number, pz: number, a: P2, b: P2) => {
  const vx = b[0] - a[0], vz = b[1] - a[1], l2 = vx * vx + vz * vz || 1, t = clamp(((px - a[0]) * vx + (pz - a[1]) * vz) / l2, 0, 1);
  return Math.hypot(px - a[0] - vx * t, pz - a[1] - vz * t);
};
/** distance to an open polyline (lab paths are polylines, R2D paths are 2-point segments: same result for those) */
export const distLine = (px: number, pz: number, pts: P2[]) => { let b = 1e9; for (let i = 0; i < pts.length - 1; i++) { const d = distSeg(px, pz, pts[i], pts[i + 1]); if (d < b) b = d; } return b; };
