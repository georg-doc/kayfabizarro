// C1b+C3 · V-112 mesh checks (Steuerung: mandatory per organ in the REPORT): open (boundary) edges and non-manifold edges of a
// triangle mesh after welding vertices by position (tolerance `eps`, world units of the geometry). An edge used by one triangle is
// open; used by more than two it is non-manifold. Also non-manifold vertices (fan split) are counted as information.
import * as THREE from 'three';

export function meshCheck(geo: THREE.BufferGeometry, eps = 1e-4) {
  const pos = geo.attributes.position, n = pos.count, q = 1 / eps, ids = new Int32Array(n), map = new Map<string, number>();
  for (let i = 0; i < n; i++) {
    const k = Math.round(pos.getX(i) * q) + ',' + Math.round(pos.getY(i) * q) + ',' + Math.round(pos.getZ(i) * q);
    let id = map.get(k); if (id === undefined) { id = map.size; map.set(k, id); } ids[i] = id;
  }
  const idx = geo.index ? geo.index.array : null, tc = (idx ? idx.length : n) / 3, edges = new Map<number, number>(), V = map.size;
  let degenerate = 0;
  for (let t = 0; t < tc; t++) {
    const a = ids[idx ? idx[t * 3] : t * 3], b = ids[idx ? idx[t * 3 + 1] : t * 3 + 1], c = ids[idx ? idx[t * 3 + 2] : t * 3 + 2];
    if (a === b || b === c || a === c) { degenerate++; continue; }
    for (const [u, v] of [[a, b], [b, c], [c, a]]) { const k = u < v ? u * V + v : v * V + u; edges.set(k, (edges.get(k) ?? 0) + 1); }
  }
  let open = 0, nonManifold = 0; for (const c of edges.values()) { if (c === 1) open++; else if (c > 2) nonManifold++; }
  return { tris: tc, verts: V, edges: edges.size, open, nonManifold, degenerate };
}

/** one-sided surface distance: for every vertex of A the exact distance to the nearest triangle of B (spatial hash of B's triangles,
 *  cell `cs`, searched within `reach` cells); returns mean / max / p99 in the units of the geometry */
export function surfaceDistance(A: ArrayLike<number>, BP: ArrayLike<number>, BI: ArrayLike<number>, cs: number, reach = 2) {
  const grid = new Map<string, number[]>(), key = (i: number, j: number, k: number) => i + ',' + j + ',' + k, T = BI.length / 3;
  for (let t = 0; t < T; t++) { let x0 = Infinity, y0 = Infinity, z0 = Infinity, x1 = -Infinity, y1 = -Infinity, z1 = -Infinity;
    for (let e = 0; e < 3; e++) { const v = BI[t * 3 + e] * 3; x0 = Math.min(x0, BP[v]); x1 = Math.max(x1, BP[v]); y0 = Math.min(y0, BP[v + 1]); y1 = Math.max(y1, BP[v + 1]); z0 = Math.min(z0, BP[v + 2]); z1 = Math.max(z1, BP[v + 2]); }
    for (let i = Math.floor(x0 / cs); i <= Math.floor(x1 / cs); i++) for (let j = Math.floor(y0 / cs); j <= Math.floor(y1 / cs); j++) for (let k = Math.floor(z0 / cs); k <= Math.floor(z1 / cs); k++) { const kk = key(i, j, k); let L = grid.get(kk); if (!L) grid.set(kk, (L = [])); L.push(t); } }
  const tri = new THREE.Triangle(), a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3(), p = new THREE.Vector3(), q = new THREE.Vector3();
  const n = A.length / 3, ds = new Float32Array(n); let sum = 0, mx = 0;
  for (let v = 0; v < n; v++) { p.set(A[v * 3], A[v * 3 + 1], A[v * 3 + 2]); const ci = Math.floor(p.x / cs), cj = Math.floor(p.y / cs), ck = Math.floor(p.z / cs); let best = Infinity; const seen = new Set<number>();
    for (let i = -reach; i <= reach; i++) for (let j = -reach; j <= reach; j++) for (let k = -reach; k <= reach; k++) { const L = grid.get(key(ci + i, cj + j, ck + k)); if (!L) continue;
      for (const t of L) { if (seen.has(t)) continue; seen.add(t); a.fromArray(BP as any, BI[t * 3] * 3); b.fromArray(BP as any, BI[t * 3 + 1] * 3); c.fromArray(BP as any, BI[t * 3 + 2] * 3); tri.set(a, b, c); tri.closestPointToPoint(p, q); const d = q.distanceTo(p); if (d < best) best = d; } }
    if (!isFinite(best)) best = reach * cs; ds[v] = best; sum += best; if (best > mx) mx = best; }
  const sorted = Array.from(ds).sort((x, y) => x - y);
  return { mean: sum / n, max: mx, p99: sorted[Math.floor(n * 0.99)], ds };
}

/** O1's island rule (dropIslands: components under max(`minTris`, `frac` of the largest) are removed): the kept triangle index of a mesh */
export function keepLargeComponents(P: ArrayLike<number>, I: ArrayLike<number>, frac = 0.02, minTris = 0) {
  const n = P.length / 3, par = new Int32Array(n); for (let i = 0; i < n; i++) par[i] = i;
  const f = (x: number) => { while (par[x] !== x) { par[x] = par[par[x]]; x = par[x]; } return x; };
  for (let t = 0; t < I.length; t += 3) { const a = f(I[t]), b = f(I[t + 1]), c = f(I[t + 2]); par[a] = b; par[f(c)] = f(b); }
  const cnt = new Map<number, number>(); for (let t = 0; t < I.length; t += 3) { const r = f(I[t]); cnt.set(r, (cnt.get(r) ?? 0) + 1); }
  const big = Math.max(...cnt.values()), out: number[] = [], used = new Uint8Array(n);
  for (let t = 0; t < I.length; t += 3) if ((cnt.get(f(I[t])) ?? 0) >= Math.max(minTris, big * frac)) { out.push(I[t], I[t + 1], I[t + 2]); used[I[t]] = used[I[t + 1]] = used[I[t + 2]] = 1; }
  const pts: number[] = []; for (let i = 0; i < n; i++) if (used[i]) pts.push(P[i * 3], P[i * 3 + 1], P[i * 3 + 2]);
  return { idx: out, keptPoints: pts };
}

/** V-116 diagnosis: vertices farther than `thr` (from surfaceDistance ds) grouped on a grid of `cs`; the `top` biggest groups with centre,
 *  count and max distance (positions in the geometry's space) */
export function farClusters(P: ArrayLike<number>, ds: Float32Array, thr: number, cs: number, top = 5) {
  const G = new Map<string, { s: [number, number, number]; n: number; max: number }>();
  for (let v = 0; v < ds.length; v++) { if (ds[v] <= thr) continue; const x = P[v * 3], y = P[v * 3 + 1], z = P[v * 3 + 2], k = Math.floor(x / cs) + ',' + Math.floor(y / cs) + ',' + Math.floor(z / cs);
    let c = G.get(k); if (!c) G.set(k, (c = { s: [0, 0, 0], n: 0, max: 0 })); c.s[0] += x; c.s[1] += y; c.s[2] += z; c.n++; c.max = Math.max(c.max, ds[v]); }
  return [...G.values()].sort((a, b) => b.max - a.max).slice(0, top).map((c) => ({ c: c.s.map((q) => q / c.n), n: c.n, max: c.max }));
}

/** connected components (by index) of a triangle mesh: triangle counts, largest first */
export function componentSizes(I: ArrayLike<number>, nV: number) {
  const par = new Int32Array(nV); for (let i = 0; i < nV; i++) par[i] = i;
  const f = (x: number) => { while (par[x] !== x) { par[x] = par[par[x]]; x = par[x]; } return x; };
  for (let t = 0; t < I.length; t += 3) { const a = f(I[t]), b = f(I[t + 1]), c = f(I[t + 2]); par[a] = b; par[f(c)] = f(b); }
  const cnt = new Map<number, number>(); for (let t = 0; t < I.length; t += 3) { const r = f(I[t]); cnt.set(r, (cnt.get(r) ?? 0) + 1); }
  return [...cnt.values()].sort((a, b) => b - a);
}
