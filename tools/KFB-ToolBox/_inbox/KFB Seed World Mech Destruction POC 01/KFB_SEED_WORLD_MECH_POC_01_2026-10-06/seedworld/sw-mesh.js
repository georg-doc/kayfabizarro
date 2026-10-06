/* KFB Seed World · POC 01 · recipe → geometry (pure arrays, no three.js; main thread + worker)
   RESEARCH PLAYGROUND · NOT WORLD STUDIO · NOT COMBAT ARENA
   One BuildingRecipe → LOD0 (bays, ledges, windows, roof rows, chimney), LOD1 (shell, roof, simple windows),
   LOD2 (deformed shell), LOD3 (silhouette), and the destruction cells (floor × bay, corners, slabs, roof sections).
   Layer order after the clay router: footprint → massing deformation (one cumulative, base-anchored torsion
   field shared by body, roof, windows and cells) → façade semantics (party walls blank, door on the street
   side) → shared clay material (in the renderer) → normals (wall normals never averaged with roof/cap). */

import { CHUNK, DONOR, rng } from './sw-gen.js';
const DEG = Math.PI / 180;
const UP = [0, 0, 1];

export class GB {
  constructor() { this.p = []; this.n = []; this.c = []; this.i = []; }
  get vc() { return this.p.length / 3; }
  _v(a, n, c) { this.p.push(a[0], a[1], a[2]); this.n.push(n[0], n[1], n[2]); this.c.push(c[0], c[1], c[2]); }
  quad(a, b, c, d, col, hint) {
    let nx = (c[1] - a[1]) * (d[2] - b[2]) - (c[2] - a[2]) * (d[1] - b[1]);
    let ny = (c[2] - a[2]) * (d[0] - b[0]) - (c[0] - a[0]) * (d[2] - b[2]);
    let nz = (c[0] - a[0]) * (d[1] - b[1]) - (c[1] - a[1]) * (d[0] - b[0]);
    const l = Math.hypot(nx, ny, nz) || 1; nx /= l; ny /= l; nz /= l;
    let flip = false; if (hint && nx * hint[0] + ny * hint[1] + nz * hint[2] < 0) { nx = -nx; ny = -ny; nz = -nz; flip = true; }
    const n = [nx, ny, nz], i0 = this.vc;
    this._v(a, n, col); this._v(b, n, col); this._v(c, n, col); this._v(d, n, col);
    if (flip) this.i.push(i0, i0 + 2, i0 + 1, i0, i0 + 3, i0 + 2); else this.i.push(i0, i0 + 1, i0 + 2, i0, i0 + 2, i0 + 3);
  }
  tri(a, b, c, col, hint) {
    let nx = (b[1] - a[1]) * (c[2] - a[2]) - (b[2] - a[2]) * (c[1] - a[1]);
    let ny = (b[2] - a[2]) * (c[0] - a[0]) - (b[0] - a[0]) * (c[2] - a[2]);
    let nz = (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
    const l = Math.hypot(nx, ny, nz) || 1; nx /= l; ny /= l; nz /= l;
    let flip = false; if (hint && nx * hint[0] + ny * hint[1] + nz * hint[2] < 0) { nx = -nx; ny = -ny; nz = -nz; flip = true; }
    const n = [nx, ny, nz], i0 = this.vc;
    this._v(a, n, col); this._v(b, n, col); this._v(c, n, col);
    if (flip) this.i.push(i0, i0 + 2, i0 + 1); else this.i.push(i0, i0 + 1, i0 + 2);
  }
  box(p, X, Y, Z, s, col, colTop) {
    const hx = s[0] / 2, hy = s[1] / 2, hz = s[2] / 2;
    const P = (i, j, k) => [p[0] + X[0] * hx * i + Y[0] * hy * j + Z[0] * hz * k, p[1] + X[1] * hx * i + Y[1] * hy * j + Z[1] * hz * k, p[2] + X[2] * hx * i + Y[2] * hy * j + Z[2] * hz * k];
    const a = P(-1, -1, 1), b = P(1, -1, 1), c = P(1, 1, 1), d = P(-1, 1, 1), e = P(-1, -1, -1), f = P(1, -1, -1), g = P(1, 1, -1), h = P(-1, 1, -1);
    this.quad(a, b, c, d, col, Z); this.quad(f, e, h, g, col, [-Z[0], -Z[1], -Z[2]]);
    this.quad(b, f, g, c, col, X); this.quad(e, a, d, h, col, [-X[0], -X[1], -X[2]]);
    this.quad(d, c, g, h, colTop || col, Y); this.quad(e, f, b, a, col, [-Y[0], -Y[1], -Y[2]]);
  }
  arrays() { return { pos: new Float32Array(this.p), nrm: new Float32Array(this.n), col: new Float32Array(this.c), idx: new Uint32Array(this.i) }; }
}

const lerp = (a, b, t) => a + (b - a) * t;
const mul = (c, k) => [c[0] * k, c[1] * k, c[2] * k];
const jit = (k) => 1 + ((((k * 2654435761) >>> 0) % 1000) / 1000 - 0.5) * 0.07;
const norm3 = (v) => { const l = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l]; };
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];

/* ---------- the one deformation field (LOOK-TORSION architecture: cumulative, height-dependent, anchored base) ---------- */
export function deformer(rec) {
  const [cx, cz] = rec.centroid, by = rec.baseY, Ht = rec.height + Math.max(rec.roof.h, 0.5), tw = rec.deform.twist * DEG, lx = rec.deform.lean[0], lz = rec.deform.lean[1], wob = rec.deform.wob, ph = rec.deform.ph;
  return (x, y, z) => {
    const t = Math.max(0, y) / Ht, a = tw * Math.pow(t, 1.35), ca = Math.cos(a), sa = Math.sin(a), dx = x - cx, dz = z - cz, w = wob * t * Math.sin(y * 0.8 + ph);
    return [cx + dx * ca - dz * sa + lx * y * t + w, by + y, cz + dx * sa + dz * ca + lz * y * t + w * 0.6];
  };
}
export function bases(rec) { const fb = [0]; for (const h of rec.floorH) fb.push(fb[fb.length - 1] + h); return fb; }
export function outwards(rec) {
  const [cx, cz] = rec.centroid;
  return [0, 1, 2, 3].map((s) => {
    const A = rec.corners[s], B = rec.corners[(s + 1) % 4]; let o = [B[1] - A[1], -(B[0] - A[0])]; const l = Math.hypot(o[0], o[1]) || 1; o = [o[0] / l, o[1] / l];
    if ((A[0] + B[0]) / 2 - cx) { /* no-op guard */ }
    if (o[0] * ((A[0] + B[0]) / 2 - cx) + o[1] * ((A[1] + B[1]) / 2 - cz) < 0) o = [-o[0], -o[1]];
    return o;
  });
}
export function bayA(rec, s, b) { const len = rec.sides[s].len, aC = Math.min(0.3, 0.32 / len); return aC + (1 - 2 * aC) * (b + 0.5) / rec.sides[s].bays; }

/* façade semantics: which opening sits in bay b of floor f on side s (null = blank) */
export function winSpec(rec, s, f, b) {
  const side = rec.sides[s]; if (side.kind === 'party') return null;
  const fh = rec.floorH[f], bw = side.len / side.bays;
  if (s === 0 && f === 0 && b === rec.entranceBay) return { kind: 'door', w: DONOR.door.w, h: DONOR.door.h, y: DONOR.door.h / 2 };
  if (rec.role === 'industrial') {
    if (f === 0 && s === 0) return { kind: 'shop', w: Math.min(3.4, bw * 0.7), h: 2.6, y: fh * 0.5 };
    return b % 2 === 0 ? { kind: 'win', w: Math.min(2.2, bw * 0.6), h: 1.3, y: fh * 0.66 } : null;
  }
  if (rec.role === 'shop' && f === 0 && s === 0) return { kind: 'shop', w: Math.min(bw * 0.74, 3.2), h: 2.1, y: 0.25 + 1.05 };
  if (side.kind === 'back' && f === 0 && b % 2) return null;
  return { kind: 'win', w: DONOR.win.w, h: DONOR.win.h, y: DONOR.win.sill + DONOR.win.h / 2 };
}

/* right-handed frame on a wall: X along A→B (deformed), Y up, Z outward */
function frameAt(D, A, B, a, y, o) {
  const P = (t) => D(A[0] + (B[0] - A[0]) * t, y, A[1] + (B[1] - A[1]) * t);
  const p = P(a), p1 = P(a - 0.01), p2 = P(a + 0.01);
  let X = norm3([p2[0] - p1[0], 0, p2[2] - p1[2]]);
  let Z = [-X[2], 0, X[0]];
  if (Z[0] * o[0] + Z[2] * o[1] < 0) { X = [-X[0], 0, -X[2]]; Z = [-Z[0], 0, -Z[2]]; }
  return { p, X, Y: [0, 1, 0], Z };
}
function pushInst(list, p, X, Y, Z, sx, sy, sz, col) {
  list.m.push(X[0] * sx, X[1] * sx, X[2] * sx, 0, Y[0] * sy, Y[1] * sy, Y[2] * sy, 0, Z[0] * sz, Z[1] * sz, Z[2] * sz, 0, p[0], p[1], p[2], 1);
  list.c.push(col[0], col[1], col[2]);
}
const shade = (y) => (y < 0.9 ? 0.6 + 0.4 * (y / 0.9) : 1);

/* ---------- shell + roof ---------- */
export function shell(g, rec, lod, inst) {
  const D = deformer(rec), C = rec.corners, H = rec.height, fb = bases(rec), O = outwards(rec), rf = rec.roof;
  const topY = H + (rf.parapet || 0);
  for (let s = 0; s < 4; s++) {
    const A = C[s], B = C[(s + 1) % 4], side = rec.sides[s], o = O[s], o3 = [o[0], 0, o[1]];
    const nx = lod === 0 ? side.bays * 2 : lod === 1 ? side.bays : 1;
    const ys = [];
    if (lod <= 1) { for (let f = 0; f < rec.floors; f++) { ys.push(fb[f]); if (lod === 0) ys.push(fb[f] + rec.floorH[f] * 0.5); } } else if (lod === 2) ys.push(0, H * 0.5); else ys.push(0);
    ys.push(topY);
    const P = (a, y, off = 0) => D(A[0] + (B[0] - A[0]) * a + o[0] * off, y, A[1] + (B[1] - A[1]) * a + o[1] * off);
    for (let iy = 0; iy < ys.length - 1; iy++) for (let ix = 0; ix < nx; ix++) {
      const a0 = ix / nx, a1 = (ix + 1) / nx, y0 = ys[iy], y1 = ys[iy + 1];
      g.quad(P(a0, y0), P(a1, y0), P(a1, y1), P(a0, y1), mul(rec.wall, shade(y0) * jit(s * 131 + iy * 17 + ix)), o3);
    }
    if (lod === 0) {
      const tc = rec.trim;
      for (let f = 1; f < rec.floors; f++) {
        const y = fb[f], d = DONOR.ledge.depth, h = 0.12;
        g.quad(P(0, y - h / 2, d), P(1, y - h / 2, d), P(1, y + h / 2, d), P(0, y + h / 2, d), tc, o3);
        g.quad(P(0, y + h / 2, 0), P(1, y + h / 2, 0), P(1, y + h / 2, d), P(0, y + h / 2, d), tc, [0, 1, 0]);
        g.quad(P(0, y - h / 2, 0), P(1, y - h / 2, 0), P(1, y - h / 2, d), P(0, y - h / 2, d), mul(tc, 0.7), [0, -1, 0]);
      }
    }
    if (lod <= 1 && inst) {
      for (let f = 0; f < rec.floors; f++) for (let b = 0; b < side.bays; b++) {
        const w = winSpec(rec, s, f, b); if (!w) continue;
        const fr = frameAt(D, A, B, bayA(rec, s, b), fb[f] + w.y, o);
        const p = [fr.p[0] + fr.Z[0] * 0.02, fr.p[1], fr.p[2] + fr.Z[2] * 0.02];
        if (w.kind === 'door') pushInst(inst.door, p, fr.X, fr.Y, fr.Z, w.w, w.h, 1, rec.door);
        else pushInst(inst.win, p, fr.X, fr.Y, fr.Z, w.w, w.h, 1, rec.trim);
      }
    }
    // gable / shed end walls
    if (rf.type === 'gable' && (s === 1 || s === 3)) g.tri(D(A[0], H, A[1]), D(B[0], H, B[1]), D((A[0] + B[0]) / 2, H + rf.h, (A[1] + B[1]) / 2), rec.wall, o3);
    if (rf.type === 'shed') {
      if (s === 0) g.quad(P(0, H), P(1, H), P(1, H + rf.h), P(0, H + rf.h), rec.wall, o3);
      if (s === 1) g.tri(D(A[0], H, A[1]), D(B[0], H, B[1]), D(A[0], H + rf.h, A[1]), rec.wall, o3);
      if (s === 3) g.tri(D(A[0], H, A[1]), D(B[0], H, B[1]), D(B[0], H + rf.h, B[1]), rec.wall, o3);
    }
  }
  roof(g, rec, D, lod, inst);
}

export function roofGeom(rec) {
  const [c0, c1, c2, c3] = rec.corners, rf = rec.roof, ov = rf.ov, H = rec.height;
  let L = [c1[0] - c0[0], c1[1] - c0[1]]; const ll = Math.hypot(L[0], L[1]) || 1; L = [L[0] / ll, L[1] / ll];
  let F = [L[1], -L[0]]; const mx = (c0[0] + c1[0]) / 2 - rec.centroid[0], mz = (c0[1] + c1[1]) / 2 - rec.centroid[1]; if (F[0] * mx + F[1] * mz < 0) F = [-F[0], -F[1]];
  const ad = (p, a, b) => [p[0] + L[0] * a + F[0] * b, p[1] + L[1] * a + F[1] * b];
  const m03 = [(c0[0] + c3[0]) / 2, (c0[1] + c3[1]) / 2], m12 = [(c1[0] + c2[0]) / 2, (c1[1] + c2[1]) / 2];
  const slope = rf.h / Math.max(1, rec.depth / 2);
  return { L, F, e0: ad(c0, -ov, ov), e1: ad(c1, ov, ov), b0: ad(c3, -ov, -ov), b1: ad(c2, ov, -ov), r0: ad(m03, -ov, 0), r1: ad(m12, ov, 0), m03, m12, yE: H - ov * slope, yR: H + rf.h };
}

function surface(g, D, p00, p10, p11, p01, y0, y1, col, rows, cols, hint, stripe) {
  const Q = (a, t) => { const x = lerp(lerp(p00[0], p10[0], a), lerp(p01[0], p11[0], a), t), z = lerp(lerp(p00[1], p10[1], a), lerp(p01[1], p11[1], a), t); return D(x, lerp(y0, y1, t), z); };
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const k = stripe && r % 2 ? 0.84 : 1;
    g.quad(Q(c / cols, r / rows), Q((c + 1) / cols, r / rows), Q((c + 1) / cols, (r + 1) / rows), Q(c / cols, (r + 1) / rows), mul(col, k * jit(r * 7 + c * 13 + 5)), hint);
  }
}

function roof(g, rec, D, lod, inst) {
  const rf = rec.roof, H = rec.height, col = rec.roofC, R = roofGeom(rec), { L, F } = R;
  const rows = lod === 0 ? 6 : lod === 1 ? 3 : 1, cols = lod === 0 ? rec.sides[0].bays : 1, th = 0.22;
  const up = (k, l = 0) => [F[0] * k + L[0] * l, 1, F[1] * k + L[1] * l];
  const at = (p, y) => D(p[0], y, p[1]);
  const edge = (pa, ya, pb, yb, hint) => g.quad(at(pa, ya), at(pb, yb), at(pb, yb - th), at(pa, ya - th), mul(col, 0.62), hint);
  if (rf.type === 'gable' || rf.type === 'hip') {
    let r0 = R.r0, r1 = R.r1;
    if (rf.type === 'hip') { const k = Math.max(0.2, Math.min(rec.depth * 0.5, rec.sides[0].len * 0.5 - 0.4) * 0.95); r0 = [R.m03[0] + L[0] * k, R.m03[1] + L[1] * k]; r1 = [R.m12[0] - L[0] * k, R.m12[1] - L[1] * k]; }
    surface(g, D, R.e0, R.e1, r1, r0, R.yE, R.yR, col, rows, cols, up(0.6), lod <= 1);
    surface(g, D, R.b1, R.b0, r0, r1, R.yE, R.yR, col, rows, cols, up(-0.6), lod <= 1);
    if (rf.type === 'hip') { g.tri(at(R.b0, R.yE), at(R.e0, R.yE), at(r0, R.yR), col, up(0, -0.6)); g.tri(at(R.e1, R.yE), at(R.b1, R.yE), at(r1, R.yR), col, up(0, 0.6)); }
    if (lod <= 1) {
      edge(R.e0, R.yE, R.e1, R.yE, [F[0], 0, F[1]]); edge(R.b1, R.yE, R.b0, R.yE, [-F[0], 0, -F[1]]);
      g.quad(at(R.e0, R.yE - th), at(R.e1, R.yE - th), at(R.b1, R.yE - th), at(R.b0, R.yE - th), mul(col, 0.5), [0, -1, 0]);
      if (rf.type === 'gable') { edge(R.e0, R.yE, r0, R.yR, [-L[0], 0, -L[1]]); edge(R.b0, R.yE, r0, R.yR, [-L[0], 0, -L[1]]); edge(R.e1, R.yE, r1, R.yR, [L[0], 0, L[1]]); edge(R.b1, R.yE, r1, R.yR, [L[0], 0, L[1]]); }
    }
    if (rf.chimney && inst && lod <= 1) {
      const t = 0.26, p = [lerp(r0[0], r1[0], t), lerp(r0[1], r1[1], t)], q = at(p, R.yR - 0.35);
      const X = norm3([L[0], 0, L[1]]), Z = [-X[2], 0, X[0]];
      pushInst(inst.chim, q, X, [0, 1, 0], Z, 1, 1, 1, mul(col, 0.75));
    }
  } else if (rf.type === 'shed') {
    surface(g, D, R.b1, R.b0, R.e0, R.e1, H - 0.1, H + rf.h + R.F[0] * 0, col, rows, cols, up(-0.4), lod <= 1);
  } else if (rf.type === 'sawtooth') {
    const [c0, c1, c2, c3] = rec.corners, n = Math.max(2, Math.round(rec.depth / 4.5)), tt = 2.2;
    const Qp = (a, d) => [lerp(lerp(c0[0], c1[0], a), lerp(c3[0], c2[0], a), d), lerp(lerp(c0[1], c1[1], a), lerp(c3[1], c2[1], a), d)];
    for (let k = 0; k < n; k++) {
      const dA = k / n, dB = (k + 1) / n;
      g.quad(at(Qp(0, dA), H), at(Qp(1, dA), H), at(Qp(1, dA), H + tt), at(Qp(0, dA), H + tt), [0.05, 0.07, 0.1], [F[0], 0, F[1]]);
      g.quad(at(Qp(0, dA), H + tt), at(Qp(1, dA), H + tt), at(Qp(1, dB), H), at(Qp(0, dB), H), mul(col, jit(k)), up(-0.5));
      g.tri(at(Qp(0, dA), H), at(Qp(0, dB), H), at(Qp(0, dA), H + tt), rec.wall, [-L[0], 0, -L[1]]);
      g.tri(at(Qp(1, dA), H), at(Qp(1, dB), H), at(Qp(1, dA), H + tt), rec.wall, [L[0], 0, L[1]]);
    }
  } else {
    const [c0, c1, c2, c3] = rec.corners, cx = rec.centroid[0], cz = rec.centroid[1], pp = rf.parapet || 0;
    const inset = (c, k) => { const dx = cx - c[0], dz = cz - c[1], l = Math.hypot(dx, dz) || 1; return [c[0] + dx / l * k, c[1] + dz / l * k]; };
    const I = [c0, c1, c2, c3].map((c) => inset(c, pp > 0 ? 0.32 : 0));
    g.quad(at(I[0], H + 0.04), at(I[1], H + 0.04), at(I[2], H + 0.04), at(I[3], H + 0.04), mul(col, 0.9), [0, 1, 0]);
    if (pp > 0 && lod <= 2) {
      const Cc = [c0, c1, c2, c3];
      for (let s = 0; s < 4; s++) {
        const a = Cc[s], b = Cc[(s + 1) % 4], ia = I[s], ib = I[(s + 1) % 4];
        g.quad(at(ia, H + pp), at(ib, H + pp), at(ib, H), at(ia, H), mul(rec.wall, 0.8), [cx - (ia[0] + ib[0]) / 2, 0, cz - (ia[1] + ib[1]) / 2]);
        g.quad(at(a, H + pp), at(b, H + pp), at(ib, H + pp), at(ia, H + pp), rec.trim[0] > 0.5 ? mul(rec.wall, 1.08) : rec.trim, [0, 1, 0]);
      }
    }
  }
}

/* ---------- destruction cells (same recipe → same ids) ---------- */
export function cellsFor(rec) {
  const D = deformer(rec), C = rec.corners, fb = bases(rec), O = outwards(rec), rf = rec.roof, H = rec.height, top = rec.floors - 1;
  const cells = [], W = [[], [], [], []], K = [[], [], [], []], S = [];
  const add = (c) => { c.i = cells.length; c.id = `${rec.id}#c${c.i}`; c.lat = c.lat || []; c.sup = c.sup || []; c.minSup = c.minSup || 1; c.below = c.below ?? -1; cells.push(c); return c.i; };
  const inward = (fr, d) => [fr.p[0] - fr.Z[0] * d, fr.p[1], fr.p[2] - fr.Z[2] * d];
  for (let f = 0; f < rec.floors; f++) {
    const fh = rec.floorH[f] + (f === top ? rf.parapet || 0 : 0), yc = fb[f] + fh / 2;
    for (let k = 0; k < 4; k++) {
      const fr = frameAt(D, C[k], C[(k + 1) % 4], 0, yc, O[k]);
      K[k][f] = add({ kind: 'corner', side: k, floor: f, p: inward(fr, 0.2), X: fr.X, Y: fr.Y, Z: fr.Z, s: [0.66, fh, 0.66], hp: rec.hp.corner, col: mul(rec.wall, 0.93) });
    }
    for (let s = 0; s < 4; s++) {
      const side = rec.sides[s], aC = Math.min(0.3, 0.32 / side.len), bw = (1 - 2 * aC) * side.len / side.bays;
      W[s][f] = [];
      for (let b = 0; b < side.bays; b++) {
        const fr = frameAt(D, C[s], C[(s + 1) % 4], bayA(rec, s, b), yc, O[s]), w = winSpec(rec, s, f, b);
        W[s][f][b] = add({ kind: 'wall', side: s, floor: f, bay: b, p: inward(fr, 0.16), X: fr.X, Y: fr.Y, Z: fr.Z, s: [bw + 0.04, fh, 0.32], hp: rec.hp.wall, col: mul(rec.wall, jit(s * 31 + f * 7 + b)),
          win: w ? { kind: w.kind, w: w.w, h: w.h, dy: fb[f] + w.y - yc } : null });
      }
    }
  }
  const [c0, c1, c2, c3] = C, Qp = (a, d) => [lerp(lerp(c0[0], c1[0], a), lerp(c3[0], c2[0], a), d), lerp(lerp(c0[1], c1[1], a), lerp(c3[1], c2[1], a), d)];
  const fr0 = frameAt(D, C[0], C[1], 0.5, 0, O[0]);
  for (let f = 1; f < rec.floors; f++) {
    S[f] = [];
    for (let h = 0; h < 2; h++) {
      const q = Qp(0.5, h ? 0.75 : 0.25), p = D(q[0], fb[f], q[1]);
      S[f][h] = add({ kind: 'slab', floor: f, half: h, p, X: fr0.X, Y: [0, 1, 0], Z: fr0.Z, s: [rec.sides[0].len * 0.86, 0.26, rec.depth * 0.44], hp: rec.hp.slab, col: mul(rec.wall, 0.66), minSup: 2 });
    }
  }
  const RG = roofGeom(rec), bays0 = rec.sides[0].bays, roofCells = [];
  const at = (p, y) => D(p[0], y, p[1]);
  if (rf.type === 'gable' || rf.type === 'hip' || rf.type === 'shed') {
    for (let b = 0; b < bays0; b++) {
      const a0 = b / bays0, a1 = (b + 1) / bays0, am = (a0 + a1) / 2;
      const slopes = rf.type === 'shed'
        ? [[RG.b0, RG.b1, H - 0.1, RG.e0, RG.e1, H + rf.h, 0.0, 0.5, 2], [RG.b0, RG.b1, H - 0.1, RG.e0, RG.e1, H + rf.h, 0.5, 1.0, 0]]
        : [[RG.e0, RG.e1, RG.yE, RG.r0, RG.r1, RG.yR, 0, 1, 0], [RG.b0, RG.b1, RG.yE, RG.r0, RG.r1, RG.yR, 0, 1, 2]];
      for (const [pa, pb, ya, qa, qb, yb, t0, t1, sideS] of slopes) {
        const E = [lerp(pa[0], pb[0], am), lerp(pa[1], pb[1], am)], Rr = [lerp(qa[0], qb[0], am), lerp(qa[1], qb[1], am)];
        const lo = [lerp(E[0], Rr[0], t0), lerp(E[1], Rr[1], t0)], hi = [lerp(E[0], Rr[0], t1), lerp(E[1], Rr[1], t1)];
        const P1 = at(lo, lerp(ya, yb, t0)), P2 = at(hi, lerp(ya, yb, t1));
        const Zs = norm3([P2[0] - P1[0], P2[1] - P1[1], P2[2] - P1[2]]); let X = norm3([RG.L[0], 0, RG.L[1]]); let Y = cross(Zs, X); if (Y[1] < 0) { X = [-X[0], -X[1], -X[2]]; Y = cross(Zs, X); }
        const len = Math.hypot(P2[0] - P1[0], P2[1] - P1[1], P2[2] - P1[2]);
        const p = [(P1[0] + P2[0]) / 2 - Y[0] * 0.12, (P1[1] + P2[1]) / 2 - Y[1] * 0.12, (P1[2] + P2[2]) / 2 - Y[2] * 0.12];
        const wTop = Math.hypot(pb[0] - pa[0], pb[1] - pa[1]) / bays0;
        const sideLen = rec.sides[sideS].bays, bb = sideS === 0 ? b : Math.min(sideLen - 1, Math.floor((1 - am) * sideLen));
        const sup = []; for (let d = -1; d <= 1; d++) { const w = W[sideS][top][bb + d]; if (w !== undefined) sup.push(w); }
        if (b === 0) sup.push(K[sideS === 0 ? 0 : 3][top]); if (b === bays0 - 1) sup.push(K[sideS === 0 ? 1 : 2][top]);
        roofCells.push(add({ kind: 'roof', bay: b, p, X, Y, Z: Zs, s: [wTop * 1.03, 0.24, len + 0.05], hp: rec.hp.roof, col: mul(rec.roofC, jit(b * 3 + sideS)), sup }));
      }
    }
    if (rf.type === 'gable') for (const s of [1, 3]) {
      const fr = frameAt(D, C[s], C[(s + 1) % 4], 0.5, H + rf.h * 0.33, O[s]);
      add({ kind: 'gable', side: s, p: inward(fr, 0.16), X: fr.X, Y: fr.Y, Z: fr.Z, s: [rec.sides[s].len * 0.55, rf.h * 0.62, 0.3], hp: rec.hp.wall, col: rec.wall, sup: W[s][top].slice() });
    }
  } else {
    for (let b = 0; b < bays0; b++) for (let d = 0; d < 2; d++) {
      const q = Qp((b + 0.5) / bays0, d ? 0.75 : 0.25), p = D(q[0], H + 0.12, q[1]), sideS = d ? 2 : 0, sl = rec.sides[sideS].bays, bb = d ? Math.min(sl - 1, Math.floor((1 - (b + 0.5) / bays0) * sl)) : b;
      const sup = []; for (let k = -1; k <= 1; k++) { const w = W[sideS][top][bb + k]; if (w !== undefined) sup.push(w); }
      sup.push(K[d ? 2 : 0][top], K[d ? 3 : 1][top]);
      add({ kind: 'roof', bay: b, p, X: fr0.X, Y: [0, 1, 0], Z: fr0.Z, s: [rec.sides[0].len / bays0 * 1.02, 0.24, rec.depth * 0.5], hp: rec.hp.roof, col: mul(rec.roofC, jit(b * 5 + d)), sup });
    }
  }
  /* support links */
  for (let f = 0; f < rec.floors; f++) {
    for (let k = 0; k < 4; k++) { const c = cells[K[k][f]]; c.below = f ? K[k][f - 1] : -1; const prev = (k + 3) % 4; c.lat.push(W[k][f][0], W[prev][f][W[prev][f].length - 1]); }
    for (let s = 0; s < 4; s++) { const row = W[s][f]; row.forEach((ci, b) => { const c = cells[ci]; c.below = f ? W[s][f - 1][b] : -1; if (b > 0) c.lat.push(row[b - 1]); if (b < row.length - 1) c.lat.push(row[b + 1]); if (b === 0) c.lat.push(K[s][f]); if (b === row.length - 1) c.lat.push(K[(s + 1) % 4][f]); }); }
  }
  for (let f = 1; f < rec.floors; f++) for (let h = 0; h < 2; h++) {
    const c = cells[S[f][h]]; c.sup = [...W[h ? 2 : 0][f - 1], ...W[1][f - 1], ...W[3][f - 1], ...K.map((k) => k[f - 1])];
  }
  return cells;
}

/* deterministic rubble for a destroyed cell (used by the compiled reconstruction and by the live system) */
export function rubbleFor(rec, cell, heightAt) {
  const R = rng((rec.seed ^ Math.imul(cell.i + 1, 2654435761)) >>> 0), out = [];
  const n = cell.kind === 'slab' ? 2 : 1;
  for (let k = 0; k < n; k++) {
    const sx = Math.max(0.5, Math.min(2.4, cell.s[0] * (0.3 + R() * 0.3))), sy = 0.3 + R() * 0.45, sz = 0.6 + R() * 0.7;
    const dx = (R() - 0.5) * cell.s[0], dz = R() * 2.8 - 0.6;
    const x = cell.p[0] + cell.X[0] * dx + cell.Z[0] * dz, z = cell.p[2] + cell.X[2] * dx + cell.Z[2] * dz;
    const yaw = R() * 6.283, tilt = (R() - 0.5) * 0.6;
    const X = [Math.cos(yaw), 0, -Math.sin(yaw)], Yt = norm3([Math.sin(tilt) * 0.5, 1, Math.cos(tilt) * 0.2 - 0.1]), Z = norm3(cross(X, Yt)), X2 = cross(Yt, Z);
    out.push({ p: [x, heightAt(x, z) + sy * 0.32, z], X: X2, Y: Yt, Z, s: [sx, sy, sz], col: mul(cell.col, 0.82) });
  }
  return out;
}

/* damaged building, compiled from recipe + compact damage state (0 intact · 1 damaged · 2 gone) */
export function damaged(g, rec, state, lod, inst, heightAt) {
  const cells = cellsFor(rec);
  for (const c of cells) {
    const st = state[c.i] || 0;
    if (st >= 2) { if (lod <= 2) for (const r of rubbleFor(rec, c, heightAt)) g.box(r.p, r.X, r.Y, r.Z, r.s, r.col); continue; }
    g.box(c.p, c.X, c.Y, c.Z, c.s, st === 1 ? mul(c.col, 0.74) : c.col);
    if (c.win && inst && lod <= 1) {
      const p = [c.p[0] + c.Z[0] * 0.18, c.p[1] + c.win.dy, c.p[2] + c.Z[2] * 0.18];
      if (c.win.kind === 'door') pushInst(inst.door, p, c.X, c.Y, c.Z, c.win.w, c.win.h, 1, rec.door); else pushInst(inst.win, p, c.X, c.Y, c.Z, c.win.w, c.win.h, 1, rec.trim);
    }
  }
  return cells.length;
}

/* ---------- terrain ---------- */
function terrain(g, gen, cx, cz, seg) {
  const x0 = cx * CHUNK, z0 = cz * CHUNK, st = CHUNK / seg, N = seg + 3, Hh = new Float32Array(N * N), base = g.vc;
  const roads = new Array(N * N);
  for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) { const x = x0 + (i - 1) * st, z = z0 + (j - 1) * st, rd = gen.road(x, z); roads[j * N + i] = rd; Hh[j * N + i] = gen.height(x, z, rd); }
  for (let j = 0; j <= seg; j++) for (let i = 0; i <= seg; i++) {
    const k = (j + 1) * N + i + 1, x = x0 + i * st, z = z0 + j * st, h = Hh[k];
    const n = norm3([-(Hh[k + 1] - Hh[k - 1]) / (2 * st), 1, -(Hh[k + N] - Hh[k - N]) / (2 * st)]);
    const curv = (Hh[k + 1] + Hh[k - 1] + Hh[k + N] + Hh[k - N]) / 4 - h, c = gen.ground(x, z, roads[k]), ao = Math.max(0.8, Math.min(1.08, 1 - curv * 0.25));
    g.p.push(x, h, z); g.n.push(n[0], n[1], n[2]); g.c.push(c[0] * ao, c[1] * ao, c[2] * ao);
  }
  const R = seg + 1;
  for (let j = 0; j < seg; j++) for (let i = 0; i < seg; i++) { const a = base + j * R + i; g.i.push(a, a + R, a + 1, a + 1, a + R, a + R + 1); }
  const edges = [[...Array(R).keys()].map((i) => i), [...Array(R).keys()].map((i) => i * R + seg), [...Array(R).keys()].map((i) => seg * R + (seg - i)), [...Array(R).keys()].map((i) => (seg - i) * R)];
  for (const e of edges) {
    const sb = g.vc;
    for (const vi of e) { const q = (base + vi) * 3; g.p.push(g.p[q], g.p[q + 1] - 4, g.p[q + 2]); g.n.push(g.n[q], g.n[q + 1], g.n[q + 2]); g.c.push(g.c[q] * 0.7, g.c[q + 1] * 0.7, g.c[q + 2] * 0.7); }
    for (let t = 0; t < e.length - 1; t++) { const a = base + e[t], b = base + e[t + 1], c = sb + t, d = sb + t + 1; g.i.push(a, c, b, b, c, d); }
  }
}

/* ---------- road ribbons: centre lines in warped local (u,v) space, sampled every 2 m, edges offset in local space.
   Same rules as gen.road() (street hw 3 inside r<1.04 · primary 4.6 → path 2.2 out to r<3.2 · kerb +1.6), so edges are
   smooth curves instead of terrain-grid stairs. A segment belongs to the chunk holding its midpoint → seamless, no overlap. */
const RSTEP = 2;
const sstep = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
function roads(g, gen, cx, cz, lod) {
  const x0 = cx * CHUNK, z0 = cz * CHUNK, x1 = x0 + CHUNK, z1 = z0 + CHUNK, mx = x0 + CHUNK / 2, mz = z0 + CHUNK / 2, C = gen.C, lift = 1 + lod;
  const H = (x, z) => gen.height(x, z, null);
  const nrmAt = (x, z) => norm3([-(H(x + 1, z) - H(x - 1, z)) / 2, 1, -(H(x, z + 1) - H(x, z - 1)) / 2]);
  const sets = new Set(); for (const [ox, oz] of [[mx, mz], [x0, z0], [x1, z0], [x0, z1], [x1, z1]]) for (const s of gen.near(ox, oz)) sets.add(s);
  const vtx = (p, n, c) => { g.p.push(p[0], p[1], p[2]); g.n.push(n[0], n[1], n[2]); g.c.push(c[0], c[1], c[2]); };
  function strip(s, fixed, alongU, ta, tb, hwA, hwB, layers) {
    const P = (t, o) => (alongU ? gen.toWorld(s, t, fixed + o) : gen.toWorld(s, fixed + o, t));
    const ca = P(ta, 0), cb = P(tb, 0), na = nrmAt(ca[0], ca[1]), nb = nrmAt(cb[0], cb[1]);
    for (const [extra, off, col] of layers) {
      const wa = hwA + extra, wb = hwB + extra, i0 = g.vc;
      for (const [t, w, n] of [[ta, wa, na], [tb, wb, nb]]) for (const o of [-w, w]) { const q = P(t, o); vtx([q[0], H(q[0], q[1]) + off * lift, q[1]], n, col); }
      const a = g.p, k = i0 * 3, e1 = [a[k + 6] - a[k], a[k + 7] - a[k + 1], a[k + 8] - a[k + 2]], e2 = [a[k + 3] - a[k], a[k + 4] - a[k + 1], a[k + 5] - a[k + 2]];
      if (cross(e1, e2)[1] >= 0) g.i.push(i0, i0 + 2, i0 + 1, i0 + 1, i0 + 2, i0 + 3); else g.i.push(i0, i0 + 1, i0 + 2, i0 + 1, i0 + 3, i0 + 2);
    }
  }
  const inChunk = (p) => p[0] >= x0 && p[0] < x1 && p[1] >= z0 && p[1] < z1;
  const ROAD = [[-0.15, 0.09, C.road]], WALK = [1.6, 0.05, C.walk], DIRT = [[0, 0.07, C.dirt]];
  for (const s of sets) {
    const dc = Math.hypot(mx - s.cx, mz - s.cz);
    if (dc > s.R * 3.9 + CHUNK) continue;
    // primary axes u=0 and v=0 (both directions), then the secondary grid inside the town
    const lines = [[0, true, s.R * 3.9, 'primary'], [0, false, s.R * 3.9, 'primary']];
    if (dc < s.R * 1.3 + CHUNK) {
      const n = Math.ceil((s.R * 1.25) / s.bu), m = Math.ceil((s.R * 1.25) / s.bv);
      for (let k = -n; k <= n; k++) if (k) lines.push([k * s.bu, false, s.R * 1.3, 'street']);
      for (let k = -m; k <= m; k++) if (k) lines.push([k * s.bv, true, s.R * 1.3, 'street']);
    }
    for (const [fixed, alongU, ext, kind] of lines) {
      const kMax = Math.ceil(ext / RSTEP);
      for (let k = -kMax; k < kMax; k++) {
        const ta = k * RSTEP, tb = ta + RSTEP, tm = ta + RSTEP / 2;
        const pm = alongU ? gen.toWorld(s, tm, fixed) : gen.toWorld(s, fixed, tm);
        if (!inChunk(pm)) continue;
        const r = (t) => (alongU ? gen.townR(s, t, fixed) : gen.townR(s, fixed, t)), rm = r(tm);
        if (kind === 'street') { if (rm < 1.04) strip(s, fixed, alongU, ta, tb, 3, 3, [[1.6, 0.05, C.walk], ...ROAD]); continue; }
        if (rm >= 3.2) continue;
        const hw = (rr) => (rr < 1.1 ? 4.6 : 4.6 + (2.2 - 4.6) * sstep(1.1, 2.4, rr)), ra = r(ta), rb = r(tb);
        if (rm < 1.1) strip(s, fixed, alongU, ta, tb, hw(ra), hw(rb), [WALK, ...ROAD]);
        else strip(s, fixed, alongU, ta, tb, hw(ra), hw(rb), DIRT);
      }
    }
  }
}

/* ---------- tree instances ---------- */
export const TREE_STYLE = {
  round: { trunkH: 2.0, crown: [1.7, 1.45, 1.7], crownY: 2.6 },
  cone: { trunkH: 1.2, crown: [1.5, 4.4, 1.5], crownY: 0.9 },
  palm: { trunkH: 4.6, crown: [2.0, 0.75, 2.0], crownY: 4.7 }
};
function treeInst(inst, t, style, C) {
  const S = TREE_STYLE[style], yaw = t.rot, X = [Math.cos(yaw), 0, -Math.sin(yaw)], Z = [Math.sin(yaw), 0, Math.cos(yaw)], Y = [0, 1, 0];
  if (t.bush) { pushInst(inst.crown, [t.x, t.y + 0.45 * t.s, t.z], X, Y, Z, 1.25 * t.s, 0.9 * t.s, 1.25 * t.s, mul(C.crown[t.c], 0.92)); return; }
  pushInst(inst.trunk, [t.x, t.y - 0.2, t.z], X, Y, Z, t.s, S.trunkH * t.s + 0.2, t.s, C.trunk);
  pushInst(inst.crown, [t.x, t.y + S.crownY * t.s, t.z], X, Y, Z, S.crown[0] * t.s, S.crown[1] * t.s, S.crown[2] * t.s, C.crown[t.c]);
}

/* ---------- chunk compile ---------- */
export const TERRAIN_SEG = [40, 24, 12, 6];
export function compileChunk(gen, cx, cz, lod, damage, hidden) {
  const t0 = (typeof performance !== 'undefined' ? performance : Date).now();
  const rec = gen.chunkRecipe(cx, cz), g = new GB();
  const inst = { win: { m: [], c: [] }, door: { m: [], c: [] }, chim: { m: [], c: [] }, trunk: { m: [], c: [] }, crown: { m: [], c: [] } };
  terrain(g, gen, cx, cz, TERRAIN_SEG[lod]);
  roads(g, gen, cx, cz, lod);
  const meta = [], hAt = (x, z) => gen.height(x, z);
  for (const b of rec.buildings) {
    const v0 = g.vc, i0 = g.i.length, w0 = inst.win.c.length / 3, d0 = inst.door.c.length / 3, c0 = inst.chim.c.length / 3;
    const st = damage && damage[b.id];
    if (hidden && hidden.includes(b.id)) { /* promoted: compiled without it */ }
    else if (st) damaged(g, b, st, lod, inst, hAt);
    else shell(g, b, lod, inst);
    meta.push({ id: b.id, v: [v0, g.vc - v0], ix: [i0, g.i.length - i0], win: [w0, inst.win.c.length / 3 - w0], door: [d0, inst.door.c.length / 3 - d0], chim: [c0, inst.chim.c.length / 3 - c0], damaged: !!st });
  }
  if (lod <= 2) for (const t of rec.trees) treeInst(inst, t, gen.type.tree, gen.C);
  else for (const t of rec.trees) if (!t.bush) { const S = TREE_STYLE[gen.type.tree]; g.box([t.x, t.y + S.crownY * t.s, t.z], [1, 0, 0], [0, 1, 0], [0, 0, 1], [S.crown[0] * t.s * 1.6, S.crown[1] * t.s * 1.6, S.crown[2] * t.s * 1.6], gen.C.crown[t.c]); }
  const out = g.arrays();
  const pack = (l) => ({ m: new Float32Array(l.m), c: new Float32Array(l.c) });
  return { cx, cz, lod, key: rec.key, ...out, inst: { win: pack(inst.win), door: pack(inst.door), chim: pack(inst.chim), trunk: pack(inst.trunk), crown: pack(inst.crown) }, meta, recipes: rec.buildings, buildings: rec.buildings.length, trees: rec.trees.length, genMs: (typeof performance !== 'undefined' ? performance : Date).now() - t0 };
}
export function transferables(r) { return [r.pos.buffer, r.nrm.buffer, r.col.buffer, r.idx.buffer, ...Object.values(r.inst).flatMap((l) => [l.m.buffer, l.c.buffer])]; }

/* ---------- prototype geometry for instanced details (unit size, vertex colours) ---------- */
export function proto(kind, style) {
  const g = new GB(), X = [1, 0, 0], Y = [0, 1, 0], Z = [0, 0, 1], W = [1, 1, 1];
  if (kind === 'win') {
    const fr = 0.12, d = 0.14;
    g.box([0, 0.5 - fr / 2, 0.03], X, Y, Z, [1, fr, d], W); g.box([0, -0.5 + fr / 2, 0.03], X, Y, Z, [1, fr, d], W);
    g.box([-0.5 + fr / 2, 0, 0.03], X, Y, Z, [fr, 1 - 2 * fr, d], W); g.box([0.5 - fr / 2, 0, 0.03], X, Y, Z, [fr, 1 - 2 * fr, d], W);
    g.box([0, 0, 0.03], X, Y, Z, [0.06, 1 - 2 * fr, d * 0.8], W);
    g.box([0, 0, -0.01], X, Y, Z, [1 - fr, 1 - fr, 0.04], [0.035, 0.05, 0.075]);
    g.box([0, -0.53, 0.08], X, Y, Z, [1.12, 0.07, 0.22], [0.9, 0.9, 0.9]);
  } else if (kind === 'win1') {
    g.box([0, 0, 0.0], X, Y, Z, [1, 1, 0.08], [0.05, 0.07, 0.1]);
    g.box([0, -0.53, 0.06], X, Y, Z, [1.1, 0.08, 0.18], W);
  } else if (kind === 'door') {
    const fr = 0.12;
    g.box([0, 0.5 - fr / 2, 0.04], X, Y, Z, [1.1, fr, 0.16], [1.35, 1.35, 1.35]);
    g.box([-0.5, -fr / 2, 0.04], X, Y, Z, [fr, 1 - fr, 0.16], [1.35, 1.35, 1.35]); g.box([0.5, -fr / 2, 0.04], X, Y, Z, [fr, 1 - fr, 0.16], [1.35, 1.35, 1.35]);
    g.box([0, -fr / 2, -0.02], X, Y, Z, [0.9, 1 - fr, 0.06], W);
    g.box([0.3, -0.05, 0.03], X, Y, Z, [0.08, 0.08, 0.08], [1.8, 1.5, 0.8]);
  } else if (kind === 'chim') {
    g.box([0, 0.6, 0], X, Y, Z, [0.55, 1.3, 0.45], W, [0.4, 0.4, 0.4]); g.box([0, 1.3, 0], X, Y, Z, [0.68, 0.14, 0.58], [1.2, 1.2, 1.2]);
  } else if (kind === 'trunk') {
    const n = 6;
    for (let k = 0; k < n; k++) {
      const a0 = (k / n) * 6.283, a1 = ((k + 1) / n) * 6.283, r0 = 0.16, r1 = 0.1;
      const p = (a, r, y) => [Math.cos(a) * r, y, Math.sin(a) * r];
      g.quad(p(a0, r0, 0), p(a1, r0, 0), p(a1, r1, 1), p(a0, r1, 1), W, [Math.cos((a0 + a1) / 2), 0, Math.sin((a0 + a1) / 2)]);
    }
  } else if (kind === 'crown') {
    if (style === 'cone') {
      for (const [y0, h, r] of [[0, 0.55, 1], [0.38, 0.45, 0.72], [0.68, 0.32, 0.45]]) coneInto(g, y0, h, r);
    } else ico(g, 1, style === 'palm' ? 0.18 : 0.12);
  }
  return g.arrays();
}
function coneInto(g, y0, h, r) {
  const n = 9;
  for (let k = 0; k < n; k++) {
    const a0 = (k / n) * 6.283, a1 = ((k + 1) / n) * 6.283, am = (a0 + a1) / 2;
    const P0 = [Math.cos(a0) * r, y0, Math.sin(a0) * r], P1 = [Math.cos(a1) * r, y0, Math.sin(a1) * r], T = [0, y0 + h, 0];
    g.tri(P0, P1, T, [1, 1, 1], [Math.cos(am), 0.5, Math.sin(am)]);
    g.tri(P0, P1, [0, y0, 0], [0.7, 0.7, 0.7], [0, -1, 0]);
  }
}
function ico(g, r, lump) {
  const t = (1 + Math.sqrt(5)) / 2;
  let V = [[-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0], [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t], [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1]].map(norm3);
  let F = [[0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11], [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8], [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9], [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1]];
  const mid = new Map(), m = (a, b) => { const k = a < b ? a + ',' + b : b + ',' + a; if (!mid.has(k)) { V.push(norm3([(V[a][0] + V[b][0]) / 2, (V[a][1] + V[b][1]) / 2, (V[a][2] + V[b][2]) / 2])); mid.set(k, V.length - 1); } return mid.get(k); };
  F = F.flatMap(([a, b, c]) => { const ab = m(a, b), bc = m(b, c), ca = m(c, a); return [[a, ab, ca], [b, bc, ab], [c, ca, bc], [ab, bc, ca]]; });
  V = V.map((v, i) => { const k = 1 + lump * Math.sin(i * 12.9898 + v[0] * 3.1) * Math.cos(i * 4.1414 + v[2] * 2.7); return [v[0] * r * k, v[1] * r * k, v[2] * r * k]; });
  for (const [a, b, c] of F) { const ctr = [(V[a][0] + V[b][0] + V[c][0]) / 3, (V[a][1] + V[b][1] + V[c][1]) / 3, (V[a][2] + V[b][2] + V[c][2]) / 3]; const sh = 0.82 + 0.18 * (ctr[1] / r + 1) / 2; g.tri(V[a], V[b], V[c], [sh, sh, sh], ctr); }
}
