// V-112 / V-114 / V-127 · Tunnel insertion into ANY closed island body (organ placeholder, mountain island, island base, Phase-D set).
// Vorlage: Joyride TC1 (src/world/organ/vendor/j17/lab-track/tunnel-clay.tc1.js, md5 1fc0a859): kits, module lengths, ring = Track Core
// tunnel ring (td.tunnelRings), Y_CUT, race_tube bands + band rings + lamp band, race_rim portal + gantry + lamps, stone/mine kits. Taken 1:1:
// dimensions and placement of every part. New (V-114): every part is a CLOSED solid, and the body is joined by exact booleans (manifold-3d):
//   result = ((body ∪ shell) − interior) ∪ bands ∪ lamps ∪ portal parts
// shell    = filled sweep of the outer contour along the tunnel (bore circle for a bored body, ring + wall otherwise), to the mouth
// interior = sweep of the visible ring (ring above Y_CUT, closed by the floor) 1 m longer than the shell → opens the mouth, keeps the floor
// The body stays untouched elsewhere. All coordinates of the parts are built in Track Core metres and moved into the body's local frame.
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js';

export const Y_CUT = -0.7;                 // TC1: visible contour from just under the deck
export const KITS: Record<string, { label: string; module: number; interior: 'bands' | 'ribs' | 'frames'; portal: 'race_rim' | 'arch_stones' | 'rect_stones' | 'timber' }> = {
  race_tube: { label: 'Race-Tube', module: 6, interior: 'bands', portal: 'race_rim' },     // V-100 standard
  stone_arch: { label: 'Stein-Bogen', module: 8, interior: 'ribs', portal: 'arch_stones' },
  stone_rect: { label: 'Stein-Rechteck', module: 8, interior: 'ribs', portal: 'rect_stones' },
  mine: { label: 'Minen-Stollen', module: 5, interior: 'frames', portal: 'timber' },
};

export type V2 = [number, number];
export type Frame = { o: THREE.Vector3; X: THREE.Vector3; Y: THREE.Vector3; Z: THREE.Vector3 };
export type Part = { tag: string; P: number[]; I: number[] };   // closed triangle mesh in Track Core metres
export type TunnelSpec = { i0: number; i1: number; ringId?: number; wall?: number };
export type InsertOpts = { style?: string; outer?: { kind: 'bore'; R: number; up: number } | { kind: 'wall' }; mouthExt?: number; mouthIn?: number; mouthOut?: number; step?: number };

const V3 = (a: number[]) => new THREE.Vector3(a[0], a[1], a[2]);

/** outline of the ring above Y_CUT (TC1 outline(): floor-cut, resampled ≤ maxSeg), with outward 2D normals */
export function outline(ring: V2[], yCut = Y_CUT, maxSeg = 1.0) {
  const n = ring.length, vis = ring.map((p) => p[1] >= yCut);
  // start at the first visible point after an invisible one (the ring may start anywhere)
  let a = -1; for (let i = 0; i < n; i++) if (vis[i] && !vis[(i - 1 + n) % n]) { a = i; break; }
  if (a < 0) return outline(ring, Math.min(...ring.map((p) => p[1])) + 0.02, maxSeg);   // the whole ring above yCut (Core rect / round rings with a flat floor at −0.70): cut just above its floor
  const P: V2[] = [], cut = (p: V2, q: V2): V2 => { const t = (yCut - p[1]) / (q[1] - p[1]); return [p[0] + (q[0] - p[0]) * t, yCut]; };
  P.push(cut(ring[(a - 1 + n) % n], ring[a])); let i = a; while (vis[i]) { P.push(ring[i]); i = (i + 1) % n; } P.push(cut(ring[(i - 1 + n) % n], ring[i]));
  const D: V2[] = [P[0]]; for (let k = 1; k < P.length; k++) { const p = P[k - 1], q = P[k], m = Math.max(1, Math.ceil(Math.hypot(q[0] - p[0], q[1] - p[1]) / maxSeg)); for (let j = 1; j <= m; j++) D.push([p[0] + (q[0] - p[0]) * j / m, p[1] + (q[1] - p[1]) * j / m]); }
  const ys = D.map((p) => p[1]), cy = (Math.max(...ys) + yCut) / 2;
  const N = D.map((p, k) => { const u = D[Math.max(0, k - 1)], v = D[Math.min(D.length - 1, k + 1)]; let nx = v[1] - u[1], ny = -(v[0] - u[0]); const l = Math.hypot(nx, ny) || 1; nx /= l; ny /= l; if (nx * p[0] + ny * (p[1] - cy) < 0) { nx = -nx; ny = -ny; } return [nx, ny] as V2; });
  const L = [0]; for (let k = 1; k < D.length; k++) L.push(L[k - 1] + Math.hypot(D[k][0] - D[k - 1][0], D[k][1] - D[k - 1][1]));
  return { P: D, N, L, len: L[L.length - 1], top: Math.max(...ys), half: Math.max(...D.map((p) => Math.abs(p[0]))) };
}
const atLen = (O: ReturnType<typeof outline>, s: number) => { let i = 1; while (i < O.L.length - 1 && O.L[i] < s) i++; const t = (s - O.L[i - 1]) / ((O.L[i] - O.L[i - 1]) || 1), a = O.P[i - 1], b = O.P[i];
  return { p: [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t] as V2, n: O.N[t < 0.5 ? i - 1 : i], t: [b[0] - a[0], b[1] - a[1]] as V2 }; };
/** Q5 (Steuerung 11.10., „Kehle nach Bild“): the band ring's section as a clay bead that runs out softly into the wall — height 0.3 m
 *  (TC1 ring r 0.3), a = 0.34·exp(−(b/0.32)²) − 0.04 meets the wall at ≈ 18°, closed 0.15 m inside the wall */
export const BELL: V2[] = (() => { const top: V2[] = []; for (let k = 0; k <= 12; k++) { const b = -0.62 + 1.24 * k / 12; top.push([-(0.34 * Math.exp(-((b / 0.32) ** 2)) - 0.04), b]); } return [...top, [0.15, 0.62], [0.15, -0.62]] as V2[]; })();   // a < 0 = into the tube (outline normals point into the wall)
/** an open outline path lengthened 0.3 m at both ends (into the floor: no cap lies on the floor plane) */
const extPath = (P: V2[]): V2[] => { const a = P[0], b = P[1], y = P[P.length - 1], z = P[P.length - 2], la = Math.hypot(a[0] - b[0], a[1] - b[1]) || 1, ly = Math.hypot(y[0] - z[0], y[1] - z[1]) || 1;
  return [[a[0] + (a[0] - b[0]) / la * 0.3, a[1] + (a[1] - b[1]) / la * 0.3], ...P, [y[0] + (y[0] - z[0]) / ly * 0.3, y[1] + (y[1] - z[1]) / ly * 0.3]]; };
const extNorm = (N: V2[]): V2[] => [N[0], ...N, N[N.length - 1]];
const circle = (r: number, n = 10): V2[] => Array.from({ length: n }, (_, k) => { const a = 2 * Math.PI * k / n; return [Math.cos(a) * r, Math.sin(a) * r]; });

/** the outline (floor-left → wall → ceiling → wall → floor-right; the loop closes along the floor) with its two floor corners rounded */
export function roundFloorCorners(P: V2[], r: number, n = 4): V2[] {
  const arc = (a: V2, corner: V2, b: V2): V2[] => { const ua = [a[0] - corner[0], a[1] - corner[1]], ub = [b[0] - corner[0], b[1] - corner[1]], la = Math.hypot(ua[0], ua[1]) || 1, lb = Math.hypot(ub[0], ub[1]) || 1, d = Math.min(r, la * 0.45, lb * 0.45);
    const p0: V2 = [corner[0] + ua[0] / la * d, corner[1] + ua[1] / la * d], p1: V2 = [corner[0] + ub[0] / lb * d, corner[1] + ub[1] / lb * d], out: V2[] = [];
    for (let k = 0; k <= n; k++) { const t = k / n, q0: V2 = [p0[0] + (corner[0] - p0[0]) * t, p0[1] + (corner[1] - p0[1]) * t], q1: V2 = [corner[0] + (p1[0] - corner[0]) * t, corner[1] + (p1[1] - corner[1]) * t]; out.push([q0[0] + (q1[0] - q0[0]) * t, q0[1] + (q1[1] - q0[1]) * t]); } return out; };   // quadratic Bézier = smooth cove
  const L = P.length, first = P[0], last = P[L - 1];
  // corner at P[0]: neighbours = floor (towards last) and wall (P[1]); corner at P[L-1]: wall (P[L-2]) and floor (towards first)
  return [...arc(last, first, P[1]), ...P.slice(1, L - 1), ...arc(P[L - 2], last, first)];
}

/** filled prism: closed 2D loop swept through frames; caps = fan from the loop centre; orientation fixed by signed volume */
export function prism(frames: Frame[], loopIn: V2[] | V2[][], tag: string): Part {
  const loops: V2[][] = Array.isArray(loopIn[0][0]) ? (loopIn as V2[][]) : frames.map(() => loopIn as V2[]), loop = loops[0];
  const K = loop.length, P: number[] = [], I: number[] = [], cx = loop.reduce((a, p) => a + p[0], 0) / K, cy = loop.reduce((a, p) => a + p[1], 0) / K;
  const put = (F: Frame, x: number, y: number) => { const v = F.o.clone().addScaledVector(F.X, x).addScaledVector(F.Y, y); P.push(v.x, v.y, v.z); return P.length / 3 - 1; };
  const rows = frames.map((F, r) => loops[r].map(([x, y]) => put(F, x, y)));
  for (let r = 0; r < rows.length - 1; r++) for (let k = 0; k < K; k++) { const a = rows[r][k], b = rows[r][(k + 1) % K], c = rows[r + 1][k], d = rows[r + 1][(k + 1) % K]; I.push(a, b, d, a, d, c); }
  const c0 = put(frames[0], cx, cy), c1 = put(frames[frames.length - 1], cx, cy), last = rows[rows.length - 1];
  for (let k = 0; k < K; k++) { I.push(c0, rows[0][(k + 1) % K], rows[0][k]); I.push(c1, last[k], last[(k + 1) % K]); }
  return orient({ tag, P, I });
}
/** closed tube of a 2D profile swept along an OPEN 2D path (in one frame); both ends capped */
export function tubeAlong(Fr: Frame, path: V2[], nrm: V2[], a0: number, z0: number, prof: V2[], tag: string): Part {
  const K = prof.length, P: number[] = [], I: number[] = [];
  const put = (x: number, y: number, z: number) => { const v = Fr.o.clone().addScaledVector(Fr.X, x).addScaledVector(Fr.Y, y).addScaledVector(Fr.Z, z); P.push(v.x, v.y, v.z); return P.length / 3 - 1; };
  const rows = path.map((p, k) => prof.map(([a, b]) => put(p[0] + nrm[k][0] * (a0 + a), p[1] + nrm[k][1] * (a0 + a), z0 + b)));
  for (let r = 0; r < rows.length - 1; r++) for (let k = 0; k < K; k++) { const a = rows[r][k], b = rows[r][(k + 1) % K], c = rows[r + 1][k], d = rows[r + 1][(k + 1) % K]; I.push(a, b, d, a, d, c); }
  const e0 = path[0], e1 = path[path.length - 1], n0 = nrm[0], n1 = nrm[nrm.length - 1];
  const c0 = put(e0[0] + n0[0] * a0, e0[1] + n0[1] * a0, z0), c1 = put(e1[0] + n1[0] * a0, e1[1] + n1[1] * a0, z0), last = rows[rows.length - 1];
  for (let k = 0; k < K; k++) { I.push(c0, rows[0][(k + 1) % K], rows[0][k]); I.push(c1, last[k], last[(k + 1) % K]); }
  return orient({ tag, P, I });
}
/** closed ROUNDED box (TC1: RoundedBoxGeometry(w, h, d, 1, min(r, …))) centred at local (x, y, z), rotated rz about the frame Z axis;
 *  the geometry's duplicated seam vertices are welded so the part is a closed solid */
function box(Fr: Frame, w: number, h: number, d: number, x: number, y: number, z: number, rz: number, tag: string, r = 0.34): Part {
  let g: THREE.BufferGeometry = new RoundedBoxGeometry(w, h, d, 1, Math.min(r, w / 2 - 0.01, h / 2 - 0.01, d / 2 - 0.01)); g.deleteAttribute('normal'); g.deleteAttribute('uv'); g = mergeVertices(g, 1e-5);
  g.rotateZ(rz); g.translate(x, y, z); const pos = g.attributes.position, P: number[] = [];
  for (let i = 0; i < pos.count; i++) { const v = Fr.o.clone().addScaledVector(Fr.X, pos.getX(i)).addScaledVector(Fr.Y, pos.getY(i)).addScaledVector(Fr.Z, pos.getZ(i)); P.push(v.x, v.y, v.z); }
  return orient({ tag, P, I: Array.from(g.index!.array as ArrayLike<number>) });
}
/** Q5 lamp: a glowing clay dome that runs out softly into the surface it sits on (bell section revolved; height h, foot radius ≈ 1.9 h,
 *  closed 0.12 m below the surface). Axis = the frame direction `ax` (unit, in frame coordinates), foot centre at local (x, y, z). */
export function dome(Fr: Frame, h: number, x: number, y: number, z: number, ax: V2 | [number, number, number], tag: string): Part {
  const w = h * 0.75, pts: THREE.Vector2[] = []; for (let k = 0; k <= 10; k++) { const r = (k / 10) * w * 2.1; pts.push(new THREE.Vector2(r, (h + 0.03) * Math.exp(-((r / w) ** 2)) - 0.03)); }
  pts.push(new THREE.Vector2(w * 2.1, -0.12), new THREE.Vector2(0, -0.12)); pts.reverse();
  let g: THREE.BufferGeometry = new THREE.LatheGeometry(pts, 16); g.deleteAttribute('normal'); g.deleteAttribute('uv'); g = mergeVertices(g, 1e-6);
  const A = new THREE.Vector3(ax[0], ax[1], (ax as number[])[2] ?? 0).normalize(), q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), A); g.applyQuaternion(q); g.translate(x, y, z);
  const pos = g.attributes.position, P: number[] = []; for (let i = 0; i < pos.count; i++) { const v = Fr.o.clone().addScaledVector(Fr.X, pos.getX(i)).addScaledVector(Fr.Y, pos.getY(i)).addScaledVector(Fr.Z, pos.getZ(i)); P.push(v.x, v.y, v.z); }
  return orient({ tag, P, I: Array.from(g.index!.array as ArrayLike<number>) });
}
/** closed icosphere-ish ball (UV sphere, poles welded) */
function ball(Fr: Frame, r: number, x: number, y: number, z: number, tag: string, sy = 1): Part {
  const P: number[] = [], I: number[] = [], NS = 10, NL = 16, put = (lx: number, ly: number, lz: number) => { const v = Fr.o.clone().addScaledVector(Fr.X, x + lx).addScaledVector(Fr.Y, y + ly * sy).addScaledVector(Fr.Z, z + lz); P.push(v.x, v.y, v.z); return P.length / 3 - 1; };
  const top = put(0, r, 0), rows: number[][] = []; for (let i = 1; i < NS; i++) { const t = Math.PI * i / NS; rows.push(Array.from({ length: NL }, (_, j) => { const p = 2 * Math.PI * j / NL; return put(r * Math.sin(t) * Math.cos(p), r * Math.cos(t), r * Math.sin(t) * Math.sin(p)); })); }
  const bot = put(0, -r, 0);
  for (let j = 0; j < NL; j++) I.push(top, rows[0][(j + 1) % NL], rows[0][j]);
  for (let i = 0; i < rows.length - 1; i++) for (let j = 0; j < NL; j++) { const a = rows[i][j], b = rows[i][(j + 1) % NL], c = rows[i + 1][j], d = rows[i + 1][(j + 1) % NL]; I.push(a, b, d, a, d, c); }
  const L = rows[rows.length - 1]; for (let j = 0; j < NL; j++) I.push(bot, L[j], L[(j + 1) % NL]);
  return orient({ tag, P, I });
}
/** make the signed volume positive (outward winding) */
function orient(p: Part): Part {
  let v = 0; const P = p.P, I = p.I; for (let t = 0; t < I.length; t += 3) { const a = I[t] * 3, b = I[t + 1] * 3, c = I[t + 2] * 3;
    v += P[a] * (P[b + 1] * P[c + 2] - P[b + 2] * P[c + 1]) - P[a + 1] * (P[b] * P[c + 2] - P[b + 2] * P[c]) + P[a + 2] * (P[b] * P[c + 1] - P[b + 1] * P[c]); }
  if (v < 0) for (let t = 0; t < I.length; t += 3) { const x = I[t + 1]; I[t + 1] = I[t + 2]; I[t + 2] = x; }
  return p;
}

/** all TC1 parts of one tunnel as closed solids (Track Core metres) + lamp light positions */
export function tunnelParts(td: any, seg: TunnelSpec, o: InsertOpts = {}) {
  const S = td.samples, ds = td.ds, style = o.style ?? 'race_tube', kit = KITS[style] ?? KITS.race_tube, step = o.step ?? 4;
  const ring: V2[] = (td.tunnelRings?.[seg.ringId ?? S[seg.i0].tunnel?.ringId ?? 0] ?? td.tunnelRings?.[0]).map((p: number[]) => [p[0], p[1]] as V2);
  const wall = seg.wall ?? S[seg.i0].tunnel?.wall ?? 1.2, O = outline(ring), ext = o.mouthExt ?? 0, nIn = Math.round((o.mouthIn ?? ext) / ds), nOut = Math.round((o.mouthOut ?? ext) / ds);
  const N = S.length, closed = !!td.closed, idx = (i: number) => (closed ? ((i % N) + N) % N : Math.max(0, Math.min(N - 1, i)));
  const frameAt = (i: number, along = 0): Frame => { const q = S[idx(i)]; return { o: V3(q.p).addScaledVector(V3(q.T), along), X: V3(q.R), Y: V3(q.U), Z: V3(q.T) }; };
  const a0 = seg.i0 - nIn, a1 = seg.i1 + nOut;   // tube ends = the body's face at each mouth (host finds it) or a fixed extension
  // rows every `step` samples AND exactly on every module joint (TC1 builds one wall grid per module: colour borders never cut a triangle)
  const s0 = S[idx(a0)].s, s1 = S[idx(a1)].s, len = closed && s1 < s0 ? s1 + td.length - s0 : s1 - s0, nMod = Math.max(1, Math.round(len / kit.module)), mLen = len / nMod;
  const atS = (m: number) => a0 + Math.round(m / ds), joints = new Set<number>(); for (let m = 1; m < nMod; m++) joints.add(atS(m * mLen));
  const idSet = new Set<number>([a1, ...joints]); for (let i = a0; i <= a1; i += step) idSet.add(i); const ids = [...idSet].sort((x, y) => x - y).filter((i, k, A) => k === 0 || i - A[k - 1] >= 1);
  const parts: Part[] = [], lights: THREE.Vector3[] = [];
  // shell: outer contour. bore: circle R about (0, up), never inside ring + wall; wall: ring offset by wall
  const ctr: V2 = [0, o.outer?.kind === 'bore' ? o.outer.up : (Math.max(...ring.map((p) => p[1])) + Math.min(...ring.map((p) => p[1]))) / 2];
  const outerLoop: V2[] = ring.map(([x, y]) => { const dx = x - ctr[0], dy = y - ctr[1], d = Math.hypot(dx, dy) || 1, r = o.outer?.kind === 'bore' ? Math.max(o.outer.R, d + wall) : d + wall; return [ctr[0] + dx / d * r, ctr[1] + dy / d * r]; });
  parts.push(prism(ids.map((i) => frameAt(i)), outerLoop, 'shell'));
  // interior: visible ring closed by the floor, 1 m beyond the shell at both ends (opens the mouth; floor below Y_CUT stays solid)
  // Q5: the two floor corners (wall ↔ floor under the deck line) rounded r 0.8 m; at each mouth a 45° chamfer of 0.6 m (walls + ceiling) and
  // the cut runs 3 m beyond the face (opens the mouth cleanly)
  const inner = roundFloorCorners(O.P, 0.8), cx = 0, cy = (O.top + Y_CUT) / 2, grow = (L: V2[], d: number): V2[] => L.map(([x, y]) => { if (y < Y_CUT + 0.1) return [x, y]; const dx = x - cx, dy = y - cy, l = Math.hypot(dx, dy) || 1; return [x + dx / l * d, y + dy / l * d]; });
  const fr = ids.map((i) => frameAt(i)), lp = ids.map(() => inner);
  fr.unshift(frameAt(ids[0], -0.6), frameAt(ids[0], -3)); lp.unshift(grow(inner, 0.6), grow(inner, 0.6)); fr.push(frameAt(ids[ids.length - 1], 0.6), frameAt(ids[ids.length - 1], 3)); lp.push(grow(inner, 0.6), grow(inner, 0.6));
  const fr2 = [fr[1], fr[0], ...fr.slice(2)], lp2 = [lp[1], lp[0], ...lp.slice(2)];   // order along the track: −3, −0.6, rows…, +0.6, +3
  parts.push(prism(fr2, lp2, 'interior'));
  // modules (TC1: module length per kit; joints every module; lamps at module middles)
  for (let m = 1; m < nMod; m++) { const F = frameAt(atS(m * mLen));
    if (kit.interior === 'bands') parts.push(tubeAlong(F, extPath(O.P), extNorm(O.N), 0, 0, BELL, 'band'));   // TC1 circle(0.3, 6) → clay bead with a soft fillet into the wall (Q5)
    if (kit.interior === 'ribs') parts.push(tubeAlong(F, O.P, O.N, 0, 0, [[0.15, -0.5], [-0.2, -0.45], [-0.35, 0], [-0.2, 0.45], [0.15, 0.5]], 'rib'));
    if (kit.interior === 'frames') { const hp = O.top - Y_CUT - 0.2;
      for (const sx of [-1, 1]) parts.push(box(F, 0.8, hp + 0.1, 0.8, sx * (O.half - 0.55), Y_CUT + hp / 2 - 0.05, 0, 0.02 * sx * ((m % 3) - 1), 'timber', 0.18));   // +0.1 m into the floor: TC1 stood exactly ON it (touch ≠ joined, Q1)
      parts.push(box(F, 2 * O.half - 0.6, 0.75, 0.85, 0, O.top - 0.75, 0, 0.012 * (((m * 7) % 3) - 1), 'timber', 0.2));
      for (const sx of [-1, 1]) parts.push(box(F, 0.5, 2.6, 0.55, sx * (O.half - 1.6), O.top - 1.8, 0, sx * Math.PI / 4, 'timber', 0.12));   // Türstock-Strebe
      if (m % 2 === 0) { const sx = m % 4 ? 1 : -1, lx = sx * (O.half - 1.1); parts.push(box(F, 0.14, 0.9, 0.14, lx, O.top - 1.55, 0.5, 0, 'timber', 0.05)); parts.push(ball(F, 0.36, lx, O.top - 2.15, 0.5, 'lamp', 1.2)); } } }
  for (let m = 0; m < nMod; m++) { const F = frameAt(atS((m + 0.5) * mLen));
    if (kit.interior === 'bands') for (const side of [0.18, 0.82]) { const q = atLen(O, O.len * side); parts.push(dome(F, 0.36, q.p[0], q.p[1], 0, [-q.n[0], -q.n[1], 0], 'lamp')); }   // TC1 ball r 0.28 → glowing clay dome h 0.36 on the wall (Q5)   // TC1: 0.3 off the wall → the lamp floated 0.02 m (Q1); 0.2 = set 0.08 m into the wall
    if (kit.interior === 'ribs') parts.push(box(F, 1.8, 0.34, 0.8, 0, O.top - 0.12, 0, 0, 'lamp', 0.14));   // TC1 O.top − 0.32 hung 0.15 m under the ceiling (Q1) → set 0.05 m into it
    lights.push(F.o.clone().addScaledVector(F.Y, O.top * 0.7)); }
  // portals at both mouths (TC1 frame: Z points out of the tube)
  for (const end of ['in', 'out'] as const) { const i = end === 'in' ? a0 : a1, f = frameAt(i), Z = end === 'in' ? f.Z.clone().negate() : f.Z.clone();
    // TC1 mound kits stand on the mound's Stirnwand (extrude depth 1.2, front face at z ≈ +1.2); here the body's face IS at z = 0 → the
    // portal set moves 1.2 m back onto it (else it floats in front, Q1). race_rim (shell host, no Stirnwand) stays 1:1.
    const Fr: Frame = { o: kit.portal === 'race_rim' ? f.o : f.o.clone().addScaledVector(Z, -1.2), X: f.X, Y: f.Y, Z };
    // TC1 mound kits bring their Stirnwand (head, extrude 1.2 m). Generic: a head plate around the opening = the closed contour grown 4.2 m,
    // from 3 m inside the body to the face, its front edge chamfered (4.2 → 3.8 m over 0.4 m, Q5); it is cut by the interior like the shell,
    // body clay — the portal set stands on it even where the body's own face falls away (Q1)
    if (kit.portal !== 'race_rim') { const along = (z: number) => frameAt(i, end === 'in' ? -z : z), cl = roundFloorCorners(O.P, 0.8), cc = (O.top + Y_CUT) / 2;
      const grow2 = (d: number): V2[] => cl.map(([x, y]) => { const dx = x, dy = y - cc, l = Math.hypot(dx, dy) || 1; return [x + dx / l * d, y + dy / l * d]; });
      parts.push(prism([along(-3), along(-0.4), along(0)], [grow2(4.2), grow2(4.2), grow2(3.8)], 'head')); }
    if (kit.portal === 'race_rim') { parts.push(tubeAlong(Fr, extPath(O.P), extNorm(O.N), 0.65, -0.65, circle(1.0, 14), 'rim'));   // TC1 (wall/2, z 0.2) → (0.65, −0.65): the ring meets wall and face at ≈ 49° (Q5), reads as a rolled lip
      const gy = O.top + wall + 1.35; parts.push(box(Fr, 18, 2.7, 1.0, 0, gy, 0.6, 0, 'gantry', 0.4));
      for (let k = -2; k <= 2; k++) parts.push(dome(Fr, 0.42, k * 3.2, gy, 1.1, [0, 0, 1], 'lamp'));   // TC1 ball r 0.46 → dome h 0.42 on the gantry front (Q5)
      for (const sx of [-1, 1]) parts.push(box(Fr, 0.9, 3.0, 0.9, sx * 7.6, gy - 2.6, 0.3, 0, 'gantry', 0.3)); }   // legs 1.4 m longer, z 0.3: they stand in the rolled lip / face (TC1 legs rested on the rim)
    if (kit.portal === 'arch_stones') { const cnt = Math.max(9, Math.round(O.len / 2.1) | 1), sl = O.len / cnt, kc = (cnt - 1) / 2;
      for (let k = 0; k < cnt; k++) { const q = atLen(O, (k + 0.5) * sl), key = k === kc, rad = key ? 2.7 : 1.9, dep = key ? 2.1 : 1.7; parts.push(box(Fr, sl * 0.9, rad, dep, q.p[0] + q.n[0] * (rad / 2 + 0.02), q.p[1] + q.n[1] * (rad / 2 + 0.02), 1.05 + dep / 2 - 0.5, Math.atan2(q.t[1], q.t[0]), key ? 'key' : 'stone')); }
      for (const sx of [-1, 1]) parts.push(box(Fr, 3.2, 1.5, 2.5, sx * (O.half + 1.3), Y_CUT + 0.55, 1.3, 0, 'stone')); }
    if (kit.portal === 'rect_stones') { for (const sx of [-1, 1]) for (let k = 0, y = Y_CUT; y < O.top - 0.2; k++) { const hh = Math.min(1.55, O.top - y + 0.05), wq = k % 2 ? 1.7 : 2.6; parts.push(box(Fr, wq, hh * 0.94, 1.9, sx * (O.half + wq / 2 - 0.1), y + hh / 2, 1.4, 0, 'stone')); y += hh; }
      const span = 2 * O.half + 5.2, bw = span / 3; for (let k = 0; k < 3; k++) parts.push(box(Fr, bw * 0.96, 2.3, 2.1, -span / 2 + bw * (k + 0.5), O.top + 1.15, 1.45, 0, k === 1 ? 'key' : 'stone'));
      parts.push(box(Fr, span + 1.4, 0.7, 2.6, 0, O.top + 2.65, 1.55, 0, 'stone')); }
    if (kit.portal === 'timber') { const hp = O.top - Y_CUT + 0.9;
      for (const sx of [-1, 1]) parts.push(box(Fr, 1.05, hp, 1.15, sx * (O.half - 0.6), Y_CUT + hp / 2, 1.3, sx * 0.025, 'timber', 0.22));
      parts.push(box(Fr, 2 * O.half + 3.4, 1.25, 1.35, 0, O.top + 0.35, 1.45, -0.012, 'timber', 0.26));
      for (const sx of [-1, 1]) parts.push(box(Fr, 0.6, 3.8, 0.7, sx * (O.half + 1.25), O.top - 0.9, 1.55, sx * Math.PI / 4, 'timber', 0.14));
      // Bretterwand (TC1: rnd(31 + i0 (+99 out)), rows of 1.0 m from Y_CUT + 0.5 up to top + 2.4, beside the opening below top + 1.0)
      let sd = 31 + seg.i0 + (end === 'in' ? 0 : 99); const r = () => { sd = (sd * 1664525 + 1013904223) >>> 0; return sd / 4294967296; }, x0 = O.half + 3.6, yTop = O.top + 2.4;
      // only on the face: with a bored body (outer.kind 'bore') the face ends at the shell radius → the wall is clipped to it (no plank in the air)
      // the planks stay on the head plate: half width of the grown contour (3.8 m, the chamfered front) at the plank's top and bottom edge
      const cl2 = roundFloorCorners(O.P, 0.8), cc2 = (O.top + Y_CUT) / 2, G2: V2[] = cl2.map(([x, y]) => { const dy = y - cc2, l = Math.hypot(x, dy) || 1; return [x + x / l * 3.6, y + dy / l * 3.6]; });
      const halfAt = (y: number) => { let m = 0; for (let k = 0; k < G2.length; k++) { const a = G2[k], b = G2[(k + 1) % G2.length]; if ((a[1] - y) * (b[1] - y) <= 0 && a[1] !== b[1]) m = Math.max(m, Math.abs(a[0] + (b[0] - a[0]) * (y - a[1]) / (b[1] - a[1]))); } return m; };
      const xMax = (y: number) => Math.min(halfAt(y - 0.45), halfAt(y + 0.45));
      for (let y = Y_CUT + 0.5, row = 0; y < yTop; y += 1.0, row++) { const xm = Math.min(x0, xMax(y)); if (xm < O.half + 0.8 && y < O.top + 1.0) continue; const spans = y < O.top + 1.0 ? [[-xm, -O.half - 0.1], [O.half + 0.1, xm]] : [[-xm, xm]];
        for (const [a, b] of spans) { let x = a - (row % 2) * 0.7; while (x < b - 0.3) { const L = Math.min(b - x, 3.2 + r() * 2.6); if (L > 0.6) parts.push(box(Fr, L - 0.12, 0.9, 0.3, x + L / 2, y, 1.3, (r() - 0.5) * 0.05, 'timber', 0.1)); x += L;   /* TC1 z 1.72 hung 0.37 m in front of its Stirnwand (Q1) → 1.3: 0.05 m into the face */ } } }
      // portal lanterns: TC1 hung them at half + 2.9 from the plank wall (z 1.72); with the wall set onto the face (z 1.3) they hang from the Kappe (half + 1.5)
      const lxp = O.half + 1.5;
      for (const sx of [-1, 1]) { parts.push(box(Fr, 0.14, 0.9, 0.14, sx * lxp, O.top - 0.55, 1.9, 0, 'timber', 0.05)); parts.push(ball(Fr, 0.42, sx * lxp, O.top - 1.2, 1.9, 'lamp', 1.2)); } } }
  return { parts, lights, style, kit, O, wall, a0, a1, nMod, mLen, s0, len };
}

/** V-112 mouths: where the tube's crown (ring top + ½ wall) leaves the closed body at each end, in metres beyond i0 / i1 (manifold-3d point
 *  test = a 0.1-unit cube intersected with the body). Scans from 30 m inside outwards in 1 m steps; falls back to `fallback` if the crown is
 *  never inside. The tube, its portal and the cut end there, so the portal sits on the body's own face (no gap to a wider bore). */
export function findMouths(w: any, body: THREE.BufferGeometry, td: any, seg: TunnelSpec, trackToLocal: THREE.Matrix4, fallback = 12.5) {
  const pos = body.attributes.position, vp = new Float32Array(pos.count * 3); for (let i = 0; i < pos.count; i++) { vp[i * 3] = pos.getX(i); vp[i * 3 + 1] = pos.getY(i); vp[i * 3 + 2] = pos.getZ(i); }
  const mesh = new w.Mesh({ numProp: 3, vertProperties: vp, triVerts: new Uint32Array(body.index!.array as ArrayLike<number>) }); mesh.merge(); const B = new w.Manifold(mesh);
  const S = td.samples, N = S.length, ds = td.ds, ring = (td.tunnelRings?.[S[seg.i0].tunnel?.ringId ?? 0] ?? td.tunnelRings[0]), top = Math.max(...ring.map((p: number[]) => p[1])), wall = S[seg.i0].tunnel?.wall ?? 1.2, k = 0.1 / trackToLocal.getMaxScaleOnAxis() * trackToLocal.getMaxScaleOnAxis();
  const inside = (i: number) => { const q = S[((i % N) + N) % N], v = new THREE.Vector3(q.p[0] + q.U[0] * (top + wall / 2), q.p[1] + q.U[1] * (top + wall / 2), q.p[2] + q.U[2] * (top + wall / 2)).applyMatrix4(trackToLocal);
    const c = w.Manifold.cube([k, k, k], true).translate([v.x, v.y, v.z]); return B.intersect(c).volume() > 0; };
  const scan = (start: number, dir: number) => { let wasIn = false; for (let m = -30; m <= 60; m += 1) { const i = start + dir * Math.round(m / ds), inn = inside(i); if (inn) wasIn = true; else if (wasIn && m > -30) return m; } return null; };
  const mIn = scan(seg.i0, -1), mOut = scan(seg.i1, +1);
  return { mouthIn: mIn ?? fallback, mouthOut: mOut ?? fallback, found: [mIn != null, mOut != null] };
}

/** move a part from Track Core metres into the body frame (m: track → body local) */
export function partToLocal(p: Part, m: THREE.Matrix4) { const v = new THREE.Vector3(), P = p.P.slice(); for (let i = 0; i < P.length; i += 3) { v.set(P[i], P[i + 1], P[i + 2]).applyMatrix4(m); P[i] = v.x; P[i + 1] = v.y; P[i + 2] = v.z; }
  const I = p.I.slice(); if (m.determinant() < 0) for (let t = 0; t < I.length; t += 3) { const x = I[t + 1]; I[t + 1] = I[t + 2]; I[t + 2] = x; } return { ...p, P, I }; }

/** manifold-3d solid from a part; numProp = np (extra props zero) */
export function partManifold(w: any, p: Part, np: number) {
  const n = p.P.length / 3, vp = new Float32Array(n * np); for (let i = 0; i < n; i++) { vp[i * np] = p.P[i * 3]; vp[i * np + 1] = p.P[i * 3 + 1]; vp[i * np + 2] = p.P[i * 3 + 2]; }
  const mesh = new w.Mesh({ numProp: np, vertProperties: vp, triVerts: new Uint32Array(p.I) }); mesh.merge(); return new w.Manifold(mesh).asOriginal();
}

/** the body + the tunnels' parts → one closed solid. body: indexed geometry (position, color, normal) in its local frame; tunnels: parts in the
 *  same frame. Returns the manifold result, the originalID → tag map and the boolean times. */
export function joinTunnels(w: any, body: THREE.BufferGeometry, tunnels: Part[][]) {
  const t0 = performance.now(), pos = body.attributes.position, col = body.attributes.color, nrm = body.attributes.normal, np = 9, n = pos.count, vp = new Float32Array(n * np);
  for (let i = 0; i < n; i++) { vp[i * np] = pos.getX(i); vp[i * np + 1] = pos.getY(i); vp[i * np + 2] = pos.getZ(i); if (col) { vp[i * np + 3] = col.getX(i); vp[i * np + 4] = col.getY(i); vp[i * np + 5] = col.getZ(i); } if (nrm) { vp[i * np + 6] = nrm.getX(i); vp[i * np + 7] = nrm.getY(i); vp[i * np + 8] = nrm.getZ(i); } }
  const bm = new w.Mesh({ numProp: np, vertProperties: vp, triVerts: new Uint32Array(body.index!.array as ArrayLike<number>) }); bm.merge();
  let M = new w.Manifold(bm).asOriginal(); const bodyComponents = M.decompose().length; const tags = new Map<number, string>(); tags.set(M.originalID(), 'body');
  const times: number[] = []; let crumbs = 0, floating = 0, specks = 0;
  for (const parts of tunnels) { const t1 = performance.now(), mk = (tag: string) => parts.filter((p) => p.tag === tag), solid = (L: Part[]) => L.map((p) => { const m = partManifold(w, p, np); tags.set(m.originalID(), p.tag); return m; });
    const shell = solid(parts.filter((p) => p.tag === 'shell' || p.tag === 'head')), interior = solid(mk('interior')), extra = solid(parts.filter((p) => p.tag !== 'shell' && p.tag !== 'interior' && p.tag !== 'head'));
    M = w.Manifold.union([M, ...shell]); M = M.subtract(w.Manifold.union(interior));
    // Q1: the interior cut can slice thin body parts off (crumbs beside the bore); O1's island rule (dropIslands: 200 △ at SN density ≈ 400 △
    // here) removes them — on body + shell ONLY, before the TC1 parts join (a TC1 part that does not touch stays visible to the Q1 count)
    { const comps = M.decompose(), keep = comps.filter((c: any) => c.numTri() >= 400); crumbs += comps.length - keep.length; if (keep.length < comps.length) M = w.Manifold.compose(keep); }
    const base = M.decompose().length; if (extra.length) M = w.Manifold.union([M, ...extra]);
    // exact booleans can leave numerical slivers (4–28 △) where a part face nearly meets the body face: < 40 △ removed and counted (specks);
    // a TC1 part that touches nothing (≥ 40 △) stays and is counted as floating (Q1)
    { const cs = M.decompose(), keep = cs.filter((c: any) => c.numTri() >= 40); specks += cs.length - keep.length; if (keep.length < cs.length) M = w.Manifold.compose(keep); floating += keep.length - base; }
    times.push(Math.round(performance.now() - t1)); }
  return { M, tags, times, bodyComponents, crumbs, floating, specks, ms: Math.round(performance.now() - t0), status: M.status ? M.status() : null };
}
