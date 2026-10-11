// Konzept C1b_C3 R1 (a), Prototyp „Tunnel im Feld“ (Steuerung 11.10.: ein Körper + race_tube, dann Stopp).
// The island body's own distance field forms the tunnel: the Track Core ring (visible contour, floor at Y_CUT) is cut out of the field along
// the stream with a smooth subtraction (rounded lip at the mouth), and a clay socket under the deck at each mouth is smoothly added; one
// levelSet then meshes the whole body closed. TC1's fine parts (band beads, lamp domes) are placed on the field's actual wall (projected along
// the contour normal) and joined by booleans. Generic over any field G {V, nx, ny, nz, o, h} with V < 0 inside; the field→track transform
// is given (organ: B.root.matrixWorld). Vorlage: O1 v7 Mündung sleeve (kept in the field), Core v0.12 ring, TC1 race_tube sizes.
import * as THREE from 'three';
import { outline, roundFloorCorners, tubeAlong, dome, BELL, Y_CUT, type V2, type Frame, type Part } from './tunnel-insert';

export type FieldGrid = { V: Float32Array; nx: number; ny: number; nz: number; o: number[]; h: number };
export type FieldTunnel = { i0: number; i1: number; a: number; b: number; mouthIn: number; mouthOut: number; ring: V2[]; grown: V2[]; top: number; wall: number };

const smin = (a: number, b: number, k: number) => { const h = Math.max(k - Math.abs(a - b), 0) / k; return Math.min(a, b) - h * h * k * 0.25; };
const smax = (a: number, b: number, k: number) => -smin(-a, -b, k);
/** signed distance to a closed polygon (negative inside) */
export function sdPoly(P: V2[], x: number, y: number) { let d = Infinity, inside = false;
  for (let i = 0, j = P.length - 1; i < P.length; j = i++) { const ax = P[j][0], ay = P[j][1], ex = P[i][0] - ax, ey = P[i][1] - ay, l2 = ex * ex + ey * ey || 1, t = Math.max(0, Math.min(1, ((x - ax) * ex + (y - ay) * ey) / l2));
    d = Math.min(d, Math.hypot(x - ax - t * ex, y - ay - t * ey)); if ((P[i][1] > y) !== (P[j][1] > y) && x < (P[j][0] - P[i][0]) * (y - P[i][1]) / (P[j][1] - P[i][1]) + P[i][0]) inside = !inside; }
  return inside ? -d : d; }
export const sampG = (G: FieldGrid, x: number, y: number, z: number) => { const fx = Math.min(G.nx - 1.001, Math.max(0, (x - G.o[0]) / G.h)), fy = Math.min(G.ny - 1.001, Math.max(0, (y - G.o[1]) / G.h)), fz = Math.min(G.nz - 1.001, Math.max(0, (z - G.o[2]) / G.h));
  const i = fx | 0, j = fy | 0, k = fz | 0, u = fx - i, v = fy - j, w = fz - k, sy = G.nx, sz = G.nx * G.ny, q = i + G.nx * (j + G.ny * k), V = G.V;
  const c00 = V[q] + (V[q + 1] - V[q]) * u, c10 = V[q + sy] + (V[q + sy + 1] - V[q + sy]) * u, c01 = V[q + sz] + (V[q + sz + 1] - V[q + sz]) * u, c11 = V[q + sy + sz] + (V[q + sy + sz + 1] - V[q + sy + sz]) * u;
  return (c00 + (c10 - c00) * v) * (1 - w) + (c01 + (c11 - c01) * v) * w; };

/** shape the field: tunnel interior (smooth cut, lip k 0.6 m) + deck socket at each mouth (smooth add). Returns the tunnel ranges used. */
export function shapeFieldTunnels(G: FieldGrid, fieldToTrack: THREE.Matrix4, td: any, segs: { i0: number; i1: number; ringId?: number }[], o: { lip?: number; socket?: boolean; grow?: number; ring?: number[][] } = {}) {
  const S = td.samples, N = S.length, ds = td.ds, trackToField = fieldToTrack.clone().invert(), kf = trackToField.getMaxScaleOnAxis(), cellM = G.h / kf, lip = o.lip ?? 0.6;
  const idx = (i: number) => ((i % N) + N) % N, V3 = (a: number[]) => new THREE.Vector3(a[0], a[1], a[2]), out: FieldTunnel[] = [];
  for (const sg of segs) {
    const ring: V2[] = (o.ring ?? td.tunnelRings[sg.ringId ?? S[sg.i0].tunnel?.ringId ?? 0] ?? td.tunnelRings[0]).map((p: number[]) => [p[0], p[1]] as V2), O = outline(ring), wall = S[sg.i0].tunnel?.wall ?? 1.2;
    // the cut contour: TC1's visible contour with rounded floor corners, grown ½ cell on walls and vault (field ± ½ cell; Core margin holds)
    const cl = roundFloorCorners(O.P, 0.8), cy = (O.top + Y_CUT) / 2, gw = o.grow ?? cellM * 0.5, grown: V2[] = cl.map(([x, y]) => { if (y < Y_CUT + 0.05) return [x, y]; const dx = x, dy = y - cy, l = Math.hypot(dx, dy) || 1; return [x + dx / l * gw, y + dy / l * gw]; });   /* grow: ½ cell by default (coarse fields); 0 when the cell is fine and TC1's parts sit on the exact ring (V-130 bench) */
    // mouths: where the crown (top + ½ wall) leaves the field body, scanning outwards from 30 m inside
    const crownIn = (i: number) => { const q = S[idx(i)], p = V3(q.p).addScaledVector(V3(q.U), O.top + wall / 2).applyMatrix4(trackToField); return sampG(G, p.x, p.y, p.z) < 0; };
    const scan = (start: number, dir: number) => { let wasIn = false; for (let m = -30; m <= 60; m += 1) { const i = start + dir * Math.round(m / ds); if (crownIn(i)) wasIn = true; else if (wasIn) return m; } return 12.5; };
    const mouthIn = scan(sg.i0, -1), mouthOut = scan(sg.i1, +1), a = sg.i0 - Math.round((mouthIn + 3) / ds), b = sg.i1 + Math.round((mouthOut + 3) / ds);
    const sA = S[idx(a)].s, L = td.samples[N - 1].s, sOf = (i: number) => { let s = S[idx(i)].s - sA; if (s < 0) s += L; return s; }, sLen = sOf(b);
    const sockA = [sOf(sg.i0 - Math.round(mouthIn / ds)) - 2, sOf(sg.i0 - Math.round(mouthIn / ds)) + 8], sockB = [sOf(sg.i1 + Math.round(mouthOut / ds)) - 8, sOf(sg.i1 + Math.round(mouthOut / ds)) + 2];
    // samples every 1 m in field space + a hash for the nearest-sample search
    const smp: { p: THREE.Vector3; P: THREE.Vector3; R: THREE.Vector3; U: THREE.Vector3; T: THREE.Vector3; s: number }[] = [], cs = (Math.max(O.half, O.top) + 6) * kf,   /* hash cell ≥ the reach of the cut: every grid point in the band finds its sample within ±1 cell */ H = new Map<string, number[]>(), key = (v: THREE.Vector3) => Math.floor(v.x / cs) + ',' + Math.floor(v.y / cs) + ',' + Math.floor(v.z / cs);
    const bb = new THREE.Box3();
    for (let i = a; i <= b; i += 2) { const q = S[idx(i)], P = V3(q.p), e = { p: P.clone().applyMatrix4(trackToField), P, R: V3(q.R), U: V3(q.U), T: V3(q.T), s: sOf(i) }; smp.push(e); bb.expandByPoint(e.p); const k = key(e.p); let Lh = H.get(k); if (!Lh) H.set(k, (Lh = [])); Lh.push(smp.length - 1); }
    bb.expandByScalar((Math.max(O.half, O.top) + 6) * kf);
    const i0 = Math.max(0, Math.floor((bb.min.x - G.o[0]) / G.h)), i1 = Math.min(G.nx - 1, Math.ceil((bb.max.x - G.o[0]) / G.h)), j0 = Math.max(0, Math.floor((bb.min.y - G.o[1]) / G.h)), j1 = Math.min(G.ny - 1, Math.ceil((bb.max.y - G.o[1]) / G.h)), k0 = Math.max(0, Math.floor((bb.min.z - G.o[2]) / G.h)), k1 = Math.min(G.nz - 1, Math.ceil((bb.max.z - G.o[2]) / G.h));
    const q = new THREE.Vector3(), t = new THREE.Vector3(), rel = new THREE.Vector3(), halfS = O.half + 1.5;
    for (let k = k0; k <= k1; k++) for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) {
      q.set(G.o[0] + i * G.h, G.o[1] + j * G.h, G.o[2] + k * G.h); let best = -1, bd = Infinity; const cx = Math.floor(q.x / cs), cy2 = Math.floor(q.y / cs), cz = Math.floor(q.z / cs);
      for (let ax = -1; ax <= 1; ax++) for (let ay = -1; ay <= 1; ay++) for (let az = -1; az <= 1; az++) for (const n of H.get((cx + ax) + ',' + (cy2 + ay) + ',' + (cz + az)) ?? []) { const d = smp[n].p.distanceToSquared(q); if (d < bd) { bd = d; best = n; } }
      if (best < 0) continue; const e = smp[best]; t.copy(q).applyMatrix4(fieldToTrack); rel.copy(t).sub(e.P);
      const lat = rel.dot(e.R), up = rel.dot(e.U), sAl = e.s + rel.dot(e.T), qi = i + G.nx * (j + G.ny * k);
      const ao = Math.max(-sAl, sAl - sLen), sdT = Math.max(sdPoly(grown, lat, up), ao);   // capped sweep of the contour, metres
      let v = smax(G.V[qi], -sdT * kf, lip * kf);
      if (o.socket !== false) for (const [s0, s1] of [sockA, sockB]) { const aS = Math.max(s0 - sAl, sAl - s1), bx = Math.max(Math.abs(lat) - halfS, Math.max(up - (-0.75), -5 - up)), sdS = Math.max(bx, aS); v = smin(v, sdS * kf, 0.9 * kf); }
      G.V[qi] = v; }
    out.push({ i0: sg.i0, i1: sg.i1, a, b, mouthIn, mouthOut, ring, grown, top: O.top, wall });
  }
  return out;
}

/** TC1 race_tube fine parts on the field's real wall: band beads at module joints (6 m) and lamp domes at module middles, each contour point
 *  moved along its normal to the field's zero crossing (search ± 2 m). Parts in Track Core metres. */
export function fieldTunnelParts(G: FieldGrid, fieldToTrack: THREE.Matrix4, td: any, ft: FieldTunnel, module = 6) {
  const S = td.samples, N = S.length, ds = td.ds, trackToField = fieldToTrack.clone().invert(), idx = (i: number) => ((i % N) + N) % N, V3 = (a: number[]) => new THREE.Vector3(a[0], a[1], a[2]);
  const O = outline(ft.ring), parts: Part[] = [], lights: THREE.Vector3[] = [];
  const a = ft.i0 - Math.round(ft.mouthIn / ds), b = ft.i1 + Math.round(ft.mouthOut / ds), len = (b - a) * ds, EDGE = 4.5, nMod = Math.max(1, Math.round((len - 2 * EDGE) / module)), mLen = (len - 2 * EDGE) / nMod;   /* modules run between the two mouth bands (EDGE inside each mouth, clear of the lip) */
  const frameAt = (i: number): Frame => { const q = S[idx(i)]; return { o: V3(q.p), X: V3(q.R), Y: V3(q.U), Z: V3(q.T) }; };
  const wallAt = (F: Frame, p: V2, n: V2): V2 => { const pt = new THREE.Vector3(); let prev: number | null = null, prevT = 0;
    for (let tt = -2; tt <= 2.001; tt += 0.1) { pt.copy(F.o).addScaledVector(F.X, p[0] + n[0] * tt).addScaledVector(F.Y, p[1] + n[1] * tt).applyMatrix4(trackToField); const v = sampG(G, pt.x, pt.y, pt.z);
      if (prev == null && v <= 0) return p;   /* already in clay (deck socket at the mouth): the point is anchored, keep it */
      if (prev != null && prev > 0 && v <= 0) { const f = prev / (prev - v), tz = prevT + (tt - prevT) * f; return [p[0] + n[0] * tz, p[1] + n[1] * tz]; } prev = v; prevT = tt; }
    miss++; return p; };
  let miss = 0, skipped = 0;
  /* a band whose contour does not find the wall (no zero crossing within ± 2 m) would float: it is left out and counted */
  const at: number[] = []; for (let m = 0; m <= nMod; m++) at.push(EDGE + m * mLen);   /* bands at every module joint incl. the two mouth bands: they cover the body ↔ wall and strang ↔ cloud seams (tunnel-host) */
  for (const sB of at) { const F = frameAt(a + Math.round(sB / ds)), m0 = miss, P = O.P.map((p, k) => wallAt(F, p, O.N[k])); if (miss > m0) { skipped++; continue; }
    const P2: V2[] = [[P[0][0] + (P[0][0] - P[1][0]) * 0, P[0][1] - 0.3], ...P, [P[P.length - 1][0], P[P.length - 1][1] - 0.3]], N2: V2[] = [O.N[0], ...O.N, O.N[O.N.length - 1]];
    parts.push(tubeAlong(F, P2, N2, 0, 0, BELL, 'band')); }
  const atLen = (s: number) => { let i = 1; while (i < O.L.length - 1 && O.L[i] < s) i++; const t = (s - O.L[i - 1]) / ((O.L[i] - O.L[i - 1]) || 1), p0 = O.P[i - 1], p1 = O.P[i]; return { p: [p0[0] + (p1[0] - p0[0]) * t, p0[1] + (p1[1] - p0[1]) * t] as V2, n: O.N[t < 0.5 ? i - 1 : i] }; };
  for (let m = 0; m < nMod; m++) { const F = frameAt(a + Math.round((EDGE + (m + 0.5) * mLen) / ds));
    for (const side of [0.18, 0.82]) { const qq = atLen(O.len * side), m0 = miss, w = wallAt(F, qq.p, qq.n); if (miss > m0) { skipped++; continue; } parts.push(dome(F, 0.36, w[0], w[1], 0, [-qq.n[0], -qq.n[1], 0], 'lamp')); }
    lights.push(F.o.clone().addScaledVector(F.Y, O.top * 0.7)); }
  return { parts, lights, a, b, nMod, mLen, s0: S[idx(a)].s, skipped, edge: EDGE };
}
