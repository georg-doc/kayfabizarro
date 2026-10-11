// Moos-Kappe R1 (Fels-Bausatz Runde 3, Steuerung 10.10.): a swollen clay cushion on the upward faces of any indexed
// surface, with round drops hanging over its edge as geometry (template look: docs/golden/candidates/
// G1_Town_Island_R2_cartoon_clay.png). Reusable: rocks now, later the grass cap of the islands (same call on the terrain).
//  · patch = faces whose normal points up (normal.y > `up`) above `minY`; it is cut out and subdivided so the dome has
//    interior points
//  · dome: thickness grows from the rim to the inside (smoothstep over the distance to the rim along the patch), plus lumps
//  · rim roll: the edge bulges outward and rolls down, it never ends in a flat plate with a straight edge
//  · drops: round tongues along each rim loop (half-ellipse profile over the arc length), each hugging the body below
//    (ray onto `hug` objects) and tucked in under it
//  · colours per face (no gradient): cushion `top`, roll and drops `lip`
import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

export interface MossOpts {
  /** face selection: normal.y above, centroid y above */
  up: number; minY: number;
  /** cushion thickness in the middle (lab), rim share of it */
  thick: number; rimK: number;
  /** distance over which the dome rises from the rim (lab) */
  domeR: number;
  /** drops: max length (lab), half width range (lab), mean spacing along the rim (lab) */
  drip: number; dropW: [number, number]; dropEvery: number;
  /** the cut-out patch is subdivided until no edge is longer than this (lab), max 3 levels; the rim is resampled at `rimStep` */
  maxEdge: number; rimStep: number;
  /** patches (rim loops) enclosing less area than this (lab²) get no moss: slivers on chamfers */
  minArea: number;
  /** optional: true where a face centre is covered (e.g. by a block above): no moss there */
  covered?: (p: THREE.Vector3) => boolean;
  seed: number;
  top: THREE.Color; lip: THREE.Color;
}
export const MOSS_DEFAULT: Omit<MossOpts, 'top' | 'lip'> = { up: 0.75, minY: 0.5, thick: 0.46, rimK: 0.4, domeR: 1.3, drip: 0.9, dropW: [0.24, 0.4], dropEvery: 0.7, maxEdge: 0.85, rimStep: 0.28, minArea: 0.35, seed: 3 };

const rng = (seed: number) => () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const ss = (x: number) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));

function subdivideIdx(P: number[], I: number[], levels: number) {
  for (let l = 0; l < levels; l++) {
    const mid = new Map<string, number>(), NI: number[] = [];
    const m = (a: number, b: number) => { const k = a < b ? a + '_' + b : b + '_' + a; let i = mid.get(k); if (i === undefined) { i = P.length / 3; P.push((P[a * 3] + P[b * 3]) / 2, (P[a * 3 + 1] + P[b * 3 + 1]) / 2, (P[a * 3 + 2] + P[b * 3 + 2]) / 2); mid.set(k, i); } return i; };
    for (let t = 0; t < I.length; t += 3) { const a = I[t], b = I[t + 1], c = I[t + 2], ab = m(a, b), bc = m(b, c), ca = m(c, a); NI.push(a, ab, ca, ab, b, bc, ca, bc, c, ab, bc, ca); }
    I = NI;
  }
  return I;
}

/** moss cushion on `surface` (indexed, in the frame of `hug`), drops hugging the `hug` meshes; null if nothing points up */
export function buildMossCap(surface: THREE.BufferGeometry, hug: THREE.Object3D[], o: MossOpts) {
  const R = rng(o.seed * 4099 + 7), SP = surface.attributes.position, SI = surface.index!.array;
  const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3(), n = new THREE.Vector3(), e1 = new THREE.Vector3(), e2 = new THREE.Vector3();
  // ---- cut out the upward patch (own vertex numbering), subdivide it
  const map = new Map<number, number>(), P: number[] = []; let I: number[] = [];
  const id = (i: number) => { let k = map.get(i); if (k === undefined) { k = P.length / 3; P.push(SP.getX(i), SP.getY(i), SP.getZ(i)); map.set(i, k); } return k; };
  for (let t = 0; t < SI.length; t += 3) { a.fromBufferAttribute(SP, SI[t]); b.fromBufferAttribute(SP, SI[t + 1]); c.fromBufferAttribute(SP, SI[t + 2]); n.crossVectors(e1.subVectors(b, a), e2.subVectors(c, a)).normalize();
    if (n.y > o.up && (a.y + b.y + c.y) / 3 > o.minY && !(o.covered && o.covered(a.clone().add(b).add(c).divideScalar(3)))) I.push(id(SI[t]), id(SI[t + 1]), id(SI[t + 2])); }
  if (!I.length) return null;
  // patches (face components sharing vertices) smaller than minArea get no moss at all: no plate without its roll and drops
  { const par = new Int32Array(P.length / 3).map((_, i) => i), f = (x: number): number => (par[x] === x ? x : (par[x] = f(par[x])));
    for (let t = 0; t < I.length; t += 3) { const r0 = f(I[t]); par[f(I[t + 1])] = r0; par[f(I[t + 2])] = f(I[t]); }
    const area = new Map<number, number>(), fa = (t: number) => { a.set(P[I[t] * 3], 0, P[I[t] * 3 + 2]); b.set(P[I[t + 1] * 3], 0, P[I[t + 1] * 3 + 2]); c.set(P[I[t + 2] * 3], 0, P[I[t + 2] * 3 + 2]); return e1.subVectors(b, a).cross(e2.subVectors(c, a)).length() / 2; };
    for (let t = 0; t < I.length; t += 3) area.set(f(I[t]), (area.get(f(I[t])) ?? 0) + fa(t));
    const keep: number[] = []; for (let t = 0; t < I.length; t += 3) if ((area.get(f(I[t])) ?? 0) >= o.minArea) keep.push(I[t], I[t + 1], I[t + 2]); I = keep; }
  if (!I.length) return null;
  for (let lv = 0; lv < 3; lv++) { let mx = 0; for (let t = 0; t < I.length; t += 3) for (const [x, y] of [[I[t], I[t + 1]], [I[t + 1], I[t + 2]], [I[t + 2], I[t]]]) mx = Math.max(mx, Math.hypot(P[x * 3] - P[y * 3], P[x * 3 + 1] - P[y * 3 + 1], P[x * 3 + 2] - P[y * 3 + 2])); if (mx <= o.maxEdge) break; I = subdivideIdx(P, I, 1); }
  const patch = new THREE.BufferGeometry(); patch.setAttribute('position', new THREE.Float32BufferAttribute(P, 3)); patch.setIndex(I); patch.computeVertexNormals();
  const PP = patch.attributes.position, PN = patch.attributes.normal, nv = PP.count;
  const pv = (i: number) => new THREE.Vector3().fromBufferAttribute(PP, i), pn = (i: number) => new THREE.Vector3().fromBufferAttribute(PN, i);
  // ---- rim: directed boundary edges (face order) → loops; outward direction per rim vertex
  const half = new Map<string, number>(), nb: number[][] = Array.from({ length: nv }, () => []);
  for (let t = 0; t < I.length; t += 3) for (const [x, y] of [[I[t], I[t + 1]], [I[t + 1], I[t + 2]], [I[t + 2], I[t]]]) { half.set(x + '_' + y, t); nb[x].push(y); nb[y].push(x); }
  const next = new Map<number, number>(), outward = new Map<number, THREE.Vector3>();
  for (const [k, t] of half) { const [x, y] = k.split('_').map(Number); if (half.has(y + '_' + x)) continue; next.set(x, y);
    const fn = new THREE.Vector3().crossVectors(e1.subVectors(pv(I[t + 1]), pv(I[t])), e2.subVectors(pv(I[t + 2]), pv(I[t]))).normalize(), ob = new THREE.Vector3().crossVectors(e1.subVectors(pv(y), pv(x)), fn).normalize();
    for (const v of [x, y]) outward.set(v, (outward.get(v) ?? new THREE.Vector3()).add(ob)); }
  const loops: number[][] = [], seen = new Set<number>();
  for (const s of next.keys()) { if (seen.has(s)) continue; const L: number[] = []; let v: number | undefined = s; while (v !== undefined && !seen.has(v)) { seen.add(v); L.push(v); v = next.get(v); } if (L.length >= 3) loops.push(L); }
  // ---- distance to the rim along the patch (Dijkstra over the edges) → dome
  const dist = new Float32Array(nv).fill(Infinity), Q: number[] = [];
  for (const v of next.keys()) { dist[v] = 0; Q.push(v); }
  while (Q.length) { Q.sort((p, q) => dist[q] - dist[p]); const v = Q.pop()!; for (const w of nb[v]) { const d = dist[v] + pv(v).distanceTo(pv(w)); if (d < dist[w] - 1e-6) { dist[w] = d; Q.push(w); } } }
  const S = o.seed * 1.7, lump = (p: THREE.Vector3) => Math.sin(p.x * 2.1 + S) * Math.sin(p.z * 2.3 - S * 0.7) * Math.sin(p.y * 1.7 + S * 0.3);
  const verts: number[] = [], tri: number[] = [], lipFace = new Set<number>();
  const push = (p: THREE.Vector3) => { verts.push(p.x, p.y, p.z); return verts.length / 3 - 1; };
  const topId = new Int32Array(nv).fill(-1);
  const thickAt = (i: number) => { const k = o.rimK + (1 - o.rimK) * ss(dist[i] / o.domeR); return o.thick * k * (0.85 + 0.25 * lump(pv(i))); };
  for (let i = 0; i < nv; i++) topId[i] = push(pv(i).addScaledVector(pn(i), thickAt(i)));
  for (let t = 0; t < I.length; t += 3) tri.push(topId[I[t]], topId[I[t + 1]], topId[I[t + 2]]);
  // ---- rim roll + round drops, per loop
  const rc = new THREE.Raycaster();
  for (const L of loops) {
    // resample the rim at rimStep (round drops need more points than the patch has); ring 0 runs on the cushion's rim
    // edges (the points lie on them), position / normal / outward interpolated
    const smp: { p: THREE.Vector3; n: THREE.Vector3; out: THREE.Vector3; th: number; top: number; s: number }[] = []; let acc = 0;
    for (let k = 0; k < L.length; k++) { const i0 = L[k], i1 = L[(k + 1) % L.length], p0 = pv(i0), p1 = pv(i1), el = p0.distanceTo(p1), m = Math.max(1, Math.ceil(el / o.rimStep));
      const o0 = (outward.get(i0) ?? new THREE.Vector3(1, 0, 0)).clone().setY(0).normalize(), o1 = (outward.get(i1) ?? new THREE.Vector3(1, 0, 0)).clone().setY(0).normalize();
      const T0 = new THREE.Vector3(verts[topId[i0] * 3], verts[topId[i0] * 3 + 1], verts[topId[i0] * 3 + 2]), T1 = new THREE.Vector3(verts[topId[i1] * 3], verts[topId[i1] * 3 + 1], verts[topId[i1] * 3 + 2]);
      for (let j = 0; j < m; j++) { const u = j / m; smp.push({ p: p0.clone().lerp(p1, u), n: pn(i0).lerp(pn(i1), u).normalize(), out: o0.clone().lerp(o1, u).normalize(), th: thickAt(i0) * (1 - u) + thickAt(i1) * u, top: j === 0 ? topId[i0] : push(T0.clone().lerp(T1, u)), s: acc + el * u }); }
      acc += el; }
    const len = acc, drops: { at: number; w: number; d: number }[] = [];
    for (let x = R() * o.dropEvery; x < len; x += o.dropEvery * (0.6 + 0.8 * R())) drops.push({ at: x, w: o.dropW[0] + (o.dropW[1] - o.dropW[0]) * R(), d: o.drip * (0.35 + 0.65 * R()) });
    const dropAt = (x: number) => { let d = 0; for (const q of drops) { let dx = Math.abs(x - q.at); dx = Math.min(dx, len - dx); if (dx < q.w) d = Math.max(d, q.d * Math.sqrt(1 - (dx / q.w) ** 2)); } return d; };
    const rings: number[][] = [[], [], [], [], []];
    for (const q of smp) {
      const { p, n: nrm, out, th } = q, d = dropAt(q.s) + th * 0.6;
      const roll = p.clone().addScaledVector(out, th * 0.55).addScaledVector(nrm, th * 0.35).add(new THREE.Vector3(0, -th * 0.2, 0));
      // where the drop ends: the body below, found by a horizontal ray towards it
      const qq = p.clone().addScaledVector(out, 0.05).add(new THREE.Vector3(0, -d, 0));
      rc.set(qq.clone().addScaledVector(out, 2), out.clone().negate()); rc.far = 3.5;
      // only a hit close to where the drop should end (the start sits 2 lab outside): a far neighbour block would pull a sheet across the gap
      const h = rc.intersectObjects(hug, false).find((x) => x.distance > 1.3 && x.distance < 2.6);
      let tip: THREE.Vector3, tuck: THREE.Vector3, belly: THREE.Vector3;
      if (h && h.face) { const nh = h.face.normal.clone().transformDirection(h.object.matrixWorld); tip = h.point.clone().addScaledVector(nh, th * 0.45); tuck = h.point.clone().addScaledVector(nh, -th * 0.35); belly = roll.clone().lerp(tip, 0.5).addScaledVector(nh, th * 0.3); }
      else { tip = p.clone().addScaledVector(out, th * 0.35).add(new THREE.Vector3(0, -Math.min(d, th * 1.2), 0)); tuck = p.clone().addScaledVector(out, -th * 0.3).add(new THREE.Vector3(0, -Math.min(d, th * 1.2) - th * 0.2, 0)); belly = roll.clone().lerp(tip, 0.5).addScaledVector(out, th * 0.25); }
      rings[0].push(q.top); rings[1].push(push(roll)); rings[2].push(push(belly)); rings[3].push(push(tip)); rings[4].push(push(tuck));
    }
    const nL = smp.length;
    for (let r = 0; r < 4; r++) for (let k = 0; k < nL; k++) {
      const k2 = (k + 1) % nL, A = rings[r][k], B = rings[r][k2], C = rings[r + 1][k2], D = rings[r + 1][k];
      tri.push(A, D, B, B, D, C); if (r >= 1) { lipFace.add(tri.length / 3 - 1); lipFace.add(tri.length / 3 - 2); }
    }
  }
  // winding test for the rim strips: their faces must point away from the patch middle (horizontally); flip all if not
  const pc = new THREE.Vector3(); for (let i = 0; i < nv; i++) pc.add(pv(i)); pc.divideScalar(nv);
  const V = (i: number) => new THREE.Vector3(verts[i * 3], verts[i * 3 + 1], verts[i * 3 + 2]); let vote = 0;
  for (const f of lipFace) { const A = V(tri[f * 3]), B = V(tri[f * 3 + 1]), C = V(tri[f * 3 + 2]), fn = new THREE.Vector3().crossVectors(e1.subVectors(B, A), e2.subVectors(C, A)), dir = A.clone().add(B).add(C).divideScalar(3).sub(pc).setY(0); vote += Math.sign(fn.dot(dir)); }
  const firstStrip = I.length / 3;   // the cushion faces come first, every later face belongs to a rim strip
  if (vote < 0) for (let f = firstStrip; f < tri.length / 3; f++) { const t = tri[f * 3 + 1]; tri[f * 3 + 1] = tri[f * 3 + 2]; tri[f * 3 + 2] = t; }
  const m = new THREE.BufferGeometry(); m.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3)); m.setIndex(tri); m.computeVertexNormals();
  const flat = m.toNonIndexed(), cols = new Float32Array(flat.attributes.position.count * 3);
  for (let f = 0; f < flat.attributes.position.count / 3; f++) { const col = lipFace.has(f) ? o.lip : o.top; for (let k = 0; k < 3; k++) cols.set([col.r, col.g, col.b], (f * 3 + k) * 3); }
  flat.setAttribute('color', new THREE.BufferAttribute(cols, 3));
  const tops: { c: THREE.Vector3; area: number }[] = [];
  for (let t = 0; t < I.length; t += 3) { a.fromBufferAttribute(PP, I[t]); b.fromBufferAttribute(PP, I[t + 1]); c.fromBufferAttribute(PP, I[t + 2]); const ar = e1.subVectors(b, a).cross(e2.subVectors(c, a)).length() / 2; tops.push({ c: a.clone().add(b).add(c).divideScalar(3).addScaledVector(n.fromBufferAttribute(PN, I[t]), o.thick), area: ar }); }
  return { geo: flat, tops, loops: loops.length, rimLen: loops.reduce((acc, L) => acc + L.length, 0) };
}
export { mergeVertices };
