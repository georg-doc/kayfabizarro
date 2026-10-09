// Island outline: a closed centripetal Catmull-Rom curve through editable control points (x, z in island-local metres).
export type P2 = [number, number];

/** Dense closed polyline through the control points (centripetal Catmull-Rom, no self-loops on uneven spacing). */
export function sampleOutline(ctrl: P2[], step = 1.2): P2[] {
  const n = ctrl.length;
  const out: P2[] = [];
  for (let i = 0; i < n; i++) {
    const p0 = ctrl[(i - 1 + n) % n], p1 = ctrl[i], p2 = ctrl[(i + 1) % n], p3 = ctrl[(i + 2) % n];
    const t01 = Math.pow(Math.hypot(p1[0] - p0[0], p1[1] - p0[1]), 0.5) || 1e-3;
    const t12 = Math.pow(Math.hypot(p2[0] - p1[0], p2[1] - p1[1]), 0.5) || 1e-3;
    const t23 = Math.pow(Math.hypot(p3[0] - p2[0], p3[1] - p2[1]), 0.5) || 1e-3;
    const segLen = Math.hypot(p2[0] - p1[0], p2[1] - p1[1]);
    const k = Math.max(2, Math.ceil(segLen / step));
    for (let j = 0; j < k; j++) {
      const t = j / k;
      out.push(catmull(p0, p1, p2, p3, t01, t12, t23, t));
    }
  }
  return out;
}

function catmull(p0: P2, p1: P2, p2: P2, p3: P2, t01: number, t12: number, t23: number, u: number): P2 {
  // Barry–Goldman pyramid with centripetal knots
  const t0 = 0, t1 = t01, t2 = t1 + t12, t3 = t2 + t23;
  const t = t1 + (t2 - t1) * u;
  const lerp = (a: P2, b: P2, ta: number, tb: number): P2 => {
    const w = (t - ta) / (tb - ta || 1e-6);
    return [a[0] + (b[0] - a[0]) * w, a[1] + (b[1] - a[1]) * w];
  };
  const a1 = lerp(p0, p1, t0, t1), a2 = lerp(p1, p2, t1, t2), a3 = lerp(p2, p3, t2, t3);
  const b1 = lerp(a1, a2, t0, t2), b2 = lerp(a2, a3, t1, t3);
  return lerp(b1, b2, t1, t2);
}

export function pointInPoly(x: number, z: number, poly: P2[]): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, zi] = poly[i], [xj, zj] = poly[j];
    if ((zi > z) !== (zj > z) && x < ((xj - xi) * (z - zi)) / (zj - zi) + xi) inside = !inside;
  }
  return inside;
}

/** Unsigned distance from a point to the closed polyline. */
export function distToPoly(x: number, z: number, poly: P2[]): number {
  let best = Infinity;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [ax, az] = poly[j], [bx, bz] = poly[i];
    const dx = bx - ax, dz = bz - az;
    const L = dx * dx + dz * dz || 1e-9;
    let t = ((x - ax) * dx + (z - az) * dz) / L;
    t = t < 0 ? 0 : t > 1 ? 1 : t;
    const ex = ax + dx * t - x, ez = az + dz * t - z;
    const d = ex * ex + ez * ez;
    if (d < best) best = d;
  }
  return Math.sqrt(best);
}

/** Signed distance: positive inside the island. */
export function signedDist(x: number, z: number, poly: P2[]): number {
  const d = distToPoly(x, z, poly);
  return pointInPoly(x, z, poly) ? d : -d;
}

export function centroid(poly: P2[]): P2 {
  let a = 0, cx = 0, cz = 0;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const f = poly[j][0] * poly[i][1] - poly[i][0] * poly[j][1];
    a += f; cx += (poly[j][0] + poly[i][0]) * f; cz += (poly[j][1] + poly[i][1]) * f;
  }
  a *= 0.5;
  return Math.abs(a) < 1e-6 ? [0, 0] : [cx / (6 * a), cz / (6 * a)];
}

export function bounds(poly: P2[]) {
  let x0 = Infinity, z0 = Infinity, x1 = -Infinity, z1 = -Infinity;
  for (const [x, z] of poly) { x0 = Math.min(x0, x); z0 = Math.min(z0, z); x1 = Math.max(x1, x); z1 = Math.max(z1, z); }
  return { x0, z0, x1, z1 };
}

/** Counter-clockwise (seen from +y, i.e. x right, z down on screen) orientation check; returns true if CCW in x/z. */
export function isCCW(poly: P2[]): boolean {
  let s = 0;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) s += (poly[i][0] - poly[j][0]) * (poly[i][1] + poly[j][1]);
  return s < 0;
}

/** A blob-shaped default outline (n points around radius r with gentle wobble). */
export function blobOutline(r: number, n: number, seed: number, wobble = 0.22): P2[] {
  const out: P2[] = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const w = 1 + wobble * (Math.sin(a * 2 + seed) * 0.6 + Math.sin(a * 3 + seed * 1.7) * 0.4);
    out.push([Math.cos(a) * r * w, Math.sin(a) * r * w]);
  }
  return out;
}

/** Reference islands have polygonal outlines: 15–25 straight segments, corners of 150–170°, 1–3 small notches.
 *  Turns the dense spline into such a polygon (seeded), then resamples it linearly (corners kept). */
export function polygonize(dense: P2[], seed: number, step = 1.1): P2[] {
  const n = dense.length;
  const cum = [0];
  for (let i = 1; i <= n; i++) cum.push(cum[i - 1] + Math.hypot(dense[i % n][0] - dense[i - 1][0], dense[i % n][1] - dense[i - 1][1]));
  const per = cum[n];
  const c = centroid(dense);
  let r = 0;
  for (const p of dense) r += Math.hypot(p[0] - c[0], p[1] - c[1]);
  r /= n;
  const P = Math.max(24, Math.min(32, Math.round(per / 6.5)));
  let s = seed * 7919 + 13;
  const rnd = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  const at = (d: number): P2 => {
    d = ((d % per) + per) % per;
    let i = 1;
    while (cum[i] < d) i++;
    const t = (d - cum[i - 1]) / (cum[i] - cum[i - 1] || 1);
    const a = dense[i - 1], b = dense[i % n];
    return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  };
  const pts: P2[] = [];
  const off = rnd() * per;
  for (let k = 0; k < P; k++) {
    const p = at(off + ((k + (rnd() - 0.5) * 0.35) / P) * per);
    const dx = p[0] - c[0], dz = p[1] - c[1], L = Math.hypot(dx, dz) || 1;
    const j = 1 + (rnd() - 0.5) * 0.1;
    pts.push([c[0] + dx * j, c[1] + dz * j]);
    void L;
  }
  // notches: pull 1–3 vertices in by ~3% of the width, with a short step on one side
  // two concave bays (each pulls two neighbouring vertices in by 3–6% of the width)
  const k0 = Math.floor(rnd() * P);
  for (const k of [k0, (k0 + Math.floor(P / 2) + Math.floor(rnd() * 4)) % P]) {
    const d = (0.06 + rnd() * 0.06) * r;
    for (const kk of [k, (k + 1) % P]) {
      const p = pts[kk], dx = p[0] - c[0], dz = p[1] - c[1], L = Math.hypot(dx, dz) || 1;
      pts[kk] = [p[0] - (dx / L) * d, p[1] - (dz / L) * d];
    }
  }
  const out: P2[] = [];
  for (let k = 0; k < pts.length; k++) {
    const a = pts[k], b = pts[(k + 1) % pts.length];
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), m = Math.max(1, Math.round(L / step));
    for (let j = 0; j < m; j++) out.push([a[0] + ((b[0] - a[0]) * j) / m, a[1] + ((b[1] - a[1]) * j) / m]);
  }
  return out;
}
