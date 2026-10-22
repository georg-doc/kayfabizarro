// @ts-nocheck
// K1 form for skinned KayKit characters, taken unchanged from the Resident Atlas (R2 lib/clay-k1.js · softenSkinned):
// Taubin smoothing (3 iterations, λ .5, μ −.53); face islands under 12 % of the mesh diagonal (mouth, eyes, brows) stay untouched.
import * as THREE from 'three';

export function softenSkinned(geom, o = {}) {
  const opt = Object.assign({ iters: 3, lambda: 0.5, mu: -0.53, islandFrac: 0.12 }, o);
  const g = geom.clone(), P = g.attributes.position, n = P.count;
  g.computeBoundingBox(); const diag = g.boundingBox.getSize(new THREE.Vector3()).length(), q = 1e4 / Math.max(diag, 1e-6);
  const map = new Map(), id = new Int32Array(n), U = [];
  for (let i = 0; i < n; i++) {
    const k = Math.round(P.getX(i) * q) + ',' + Math.round(P.getY(i) * q) + ',' + Math.round(P.getZ(i) * q);
    let j = map.get(k); if (j === undefined) { j = U.length / 3; map.set(k, j); U.push(P.getX(i), P.getY(i), P.getZ(i)); } id[i] = j;
  }
  const nu = U.length / 3, nb = Array.from({ length: nu }, () => new Set()), use = new Map();
  const idx = g.index ? g.index.array : null, tc = idx ? idx.length : n;
  const vi = (t) => (idx ? idx[t] : t);
  for (let t = 0; t < tc; t += 3) for (const [a, b] of [[0, 1], [1, 2], [2, 0]]) {
    const i = id[vi(t + a)], j = id[vi(t + b)]; if (i === j) continue;
    nb[i].add(j); nb[j].add(i); const k = i < j ? i + '_' + j : j + '_' + i; use.set(k, (use.get(k) || 0) + 1);
  }
  const fixed = new Uint8Array(nu); for (const [k, c] of use) if (c === 1) { const [i, j] = k.split('_'); fixed[+i] = 1; fixed[+j] = 1; }
  /* S16 · Georg 01.10. „Knete verformt den Mund": Gesichtsteile (Mund, Augen, Brauen, Nasenspitze) sind bei KayKit
     eigene kleine Insel-Schalen im selben Skin-Netz. Taubin auf einer kleinen geschlossenen Schale zieht sie rund und
     zerknittert die Kontur. Inseln unter islandFrac der Netz-Diagonale bleiben deshalb unberührt. */
  if (opt.islandFrac > 0) {
    const par = new Int32Array(nu); for (let i = 0; i < nu; i++) par[i] = i;
    const f = (x) => { while (par[x] !== x) { par[x] = par[par[x]]; x = par[x]; } return x; };
    for (let i = 0; i < nu; i++) for (const j of nb[i]) { const a2 = f(i), b2 = f(j); if (a2 !== b2) par[a2] = b2; }
    const mn = new Map(), mx = new Map();
    for (let i = 0; i < nu; i++) { const r = f(i); let lo = mn.get(r), hi = mx.get(r); if (!lo) { lo = [Infinity, Infinity, Infinity]; hi = [-Infinity, -Infinity, -Infinity]; mn.set(r, lo); mx.set(r, hi); } for (let c = 0; c < 3; c++) { const v = U[i * 3 + c]; if (v < lo[c]) lo[c] = v; if (v > hi[c]) hi[c] = v; } }
    const small = new Set(); for (const [r, lo] of mn) { const hi = mx.get(r); if (Math.hypot(hi[0] - lo[0], hi[1] - lo[1], hi[2] - lo[2]) < opt.islandFrac * diag) small.add(r); }
    let kept = 0; for (let i = 0; i < nu; i++) if (small.has(f(i))) { fixed[i] = 1; kept++; }
    g.userData.clayIslandsKept = { islands: small.size, verts: kept };
  }
  const X = Float64Array.from(U), T = new Float64Array(nu * 3);
  const step = (f) => { for (let i = 0; i < nu; i++) { if (fixed[i] || !nb[i].size) { T[i * 3] = X[i * 3]; T[i * 3 + 1] = X[i * 3 + 1]; T[i * 3 + 2] = X[i * 3 + 2]; continue; } let sx = 0, sy = 0, sz = 0; for (const j of nb[i]) { sx += X[j * 3]; sy += X[j * 3 + 1]; sz += X[j * 3 + 2]; } const m = nb[i].size; T[i * 3] = X[i * 3] + f * (sx / m - X[i * 3]); T[i * 3 + 1] = X[i * 3 + 1] + f * (sy / m - X[i * 3 + 1]); T[i * 3 + 2] = X[i * 3 + 2] + f * (sz / m - X[i * 3 + 2]); } X.set(T); };
  for (let it = 0; it < opt.iters; it++) { step(opt.lambda); step(opt.mu); }
  const N = new Float64Array(nu * 3);
  for (let t = 0; t < tc; t += 3) {
    const a = id[vi(t)], b = id[vi(t + 1)], c = id[vi(t + 2)];
    const e1 = [X[b * 3] - X[a * 3], X[b * 3 + 1] - X[a * 3 + 1], X[b * 3 + 2] - X[a * 3 + 2]], e2 = [X[c * 3] - X[a * 3], X[c * 3 + 1] - X[a * 3 + 1], X[c * 3 + 2] - X[a * 3 + 2]];
    const nx = e1[1] * e2[2] - e1[2] * e2[1], ny = e1[2] * e2[0] - e1[0] * e2[2], nz = e1[0] * e2[1] - e1[1] * e2[0];
    for (const v of [a, b, c]) { N[v * 3] += nx; N[v * 3 + 1] += ny; N[v * 3 + 2] += nz; }
  }
  const nrm = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) { const j = id[i]; P.setXYZ(i, X[j * 3], X[j * 3 + 1], X[j * 3 + 2]); const l = Math.hypot(N[j * 3], N[j * 3 + 1], N[j * 3 + 2]) || 1; nrm[i * 3] = N[j * 3] / l; nrm[i * 3 + 1] = N[j * 3 + 1] / l; nrm[i * 3 + 2] = N[j * 3 + 2] / l; }
  P.needsUpdate = true; g.setAttribute('normal', new THREE.BufferAttribute(nrm, 3));
  g.computeBoundingBox(); g.computeBoundingSphere();
  return g;
}
