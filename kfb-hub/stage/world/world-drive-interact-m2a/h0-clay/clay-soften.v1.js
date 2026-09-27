/* KFB Knet-Vorstufe v1 — kantige Low-Poly-Geometrie wird zu gedrückter Knete.
 *
 * Nur Geometrie, kein Material. Gedacht als Vorstufe (später offline als eigene .glb-Variante),
 * in der Probe zur Laufzeit, damit sie per Schalter verglichen werden kann.
 *
 *   1 · Unterteilen, bis die längste Kante unter maxEdge liegt (Mittelpunkt 1→4, alle Attribute)
 *   2 · Verschweißen nach LAGE, nicht nach Index: UV- und Materialnähte teilen sich einen Punkt,
 *       damit nichts aufreißt, wenn verschoben wird
 *   3 · Taubin-Glättung (λ/μ): Ecken und Kanten runden, ohne das Stück schrumpfen zu lassen.
 *       Offene Ränder bleiben stehen.
 *   4 · Beulen: tieffrequentes 3D-Rauschen entlang der Normale, Amplitude relativ zur Objektgröße
 *   5 · Normalen je Lage gemittelt (weich über Nähte)
 *
 * Skin-Netze werden NICHT angefasst (Gewichte für Mittelpunkte wären eine eigene Aufgabe).
 */

function h3(x, y, z) {
  let h = (x * 374761393 + y * 668265263 + z * 1274126177) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}
function vn3(x, y, z) {
  const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z);
  const fx = x - xi, fy = y - yi, fz = z - zi;
  const u = fx * fx * (3 - 2 * fx), v = fy * fy * (3 - 2 * fy), w = fz * fz * (3 - 2 * fz);
  const L = (a, b, t) => a + (b - a) * t;
  return L(L(L(h3(xi, yi, zi), h3(xi + 1, yi, zi), u), L(h3(xi, yi + 1, zi), h3(xi + 1, yi + 1, zi), u), v),
           L(L(h3(xi, yi, zi + 1), h3(xi + 1, yi, zi + 1), u), L(h3(xi, yi + 1, zi + 1), h3(xi + 1, yi + 1, zi + 1), u), v), w);
}

export function softenGeometry(THREE, geom, o = {}) {
  const opt = Object.assign({ maxEdge: 0.18, maxLevels: 3, iters: 8, lambda: 0.5, mu: -0.53, lump: 0.018, lumpFreq: 1.6, seed: 3, maxTris: 90000 }, o);
  if (geom.attributes.skinIndex) return { geometry: geom, skipped: 'skinned' };
  let g = geom.index ? geom.toNonIndexed() : geom.clone();
  const keep = ['position', 'uv', 'color'].filter(k => g.attributes[k]);
  let A = {}; keep.forEach(k => { A[k] = { arr: Array.from(g.attributes[k].array), n: g.attributes[k].itemSize }; });
  g.computeBoundingBox();
  const size = g.boundingBox.getSize(new THREE.Vector3());
  const diag = size.length();

  // 1 · Unterteilen
  const P = () => A.position.arr;
  let longest = 0;
  for (let i = 0; i < P().length; i += 9) for (const [a, b] of [[0, 3], [3, 6], [6, 0]]) {
    const d = Math.hypot(P()[i + a] - P()[i + b], P()[i + a + 1] - P()[i + b + 1], P()[i + a + 2] - P()[i + b + 2]);
    if (d > longest) longest = d;
  }
  const edge = opt.maxEdge * (o.relative === false ? 1 : diag / 3);
  let levels = Math.max(0, Math.min(opt.maxLevels, Math.ceil(Math.log2(longest / edge))));
  while (levels > 0 && (P().length / 9) * Math.pow(4, levels) > opt.maxTris) levels--;
  for (let l = 0; l < levels; l++) {
    const B = {}; keep.forEach(k => { B[k] = { arr: [], n: A[k].n }; });
    const tris = P().length / 9;
    for (let t = 0; t < tris; t++) {
      for (const k of keep) {
        const { arr, n } = A[k], o3 = t * 3 * n;
        const v = i => arr.slice(o3 + i * n, o3 + i * n + n);
        const mid = (a, b) => a.map((x, j) => (x + b[j]) * 0.5);
        const a = v(0), b = v(1), c = v(2), ab = mid(a, b), bc = mid(b, c), ca = mid(c, a);
        B[k].arr.push(...a, ...ab, ...ca, ...ab, ...b, ...bc, ...ca, ...bc, ...c, ...ab, ...bc, ...ca);
      }
    }
    A = B;
  }

  // 2 · Verschweißen nach Lage
  const pos = P(), nv = pos.length / 3, q = 1e4 / Math.max(diag, 1e-6);
  const map = new Map(), id = new Int32Array(nv), U = [];
  for (let i = 0; i < nv; i++) {
    const key = Math.round(pos[i * 3] * q) + ',' + Math.round(pos[i * 3 + 1] * q) + ',' + Math.round(pos[i * 3 + 2] * q);
    let j = map.get(key);
    if (j === undefined) { j = U.length / 3; map.set(key, j); U.push(pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2]); }
    id[i] = j;
  }
  const nu = U.length / 3;
  const nb = Array.from({ length: nu }, () => new Set());
  const edgeUse = new Map();
  for (let t = 0; t < nv; t += 3) for (const [a, b] of [[0, 1], [1, 2], [2, 0]]) {
    const i = id[t + a], j = id[t + b];
    if (i === j) continue;
    nb[i].add(j); nb[j].add(i);
    const k = i < j ? i + '_' + j : j + '_' + i;
    edgeUse.set(k, (edgeUse.get(k) || 0) + 1);
  }
  const fixed = new Uint8Array(nu);
  for (const [k, c] of edgeUse) if (c === 1) { const [i, j] = k.split('_'); fixed[+i] = 1; fixed[+j] = 1; }

  // 3 · Taubin
  const X = Float64Array.from(U), T = new Float64Array(nu * 3);
  const step = f => {
    for (let i = 0; i < nu; i++) {
      if (fixed[i] || nb[i].size === 0) { T[i * 3] = X[i * 3]; T[i * 3 + 1] = X[i * 3 + 1]; T[i * 3 + 2] = X[i * 3 + 2]; continue; }
      let sx = 0, sy = 0, sz = 0;
      for (const j of nb[i]) { sx += X[j * 3]; sy += X[j * 3 + 1]; sz += X[j * 3 + 2]; }
      const m = nb[i].size;
      T[i * 3] = X[i * 3] + f * (sx / m - X[i * 3]);
      T[i * 3 + 1] = X[i * 3 + 1] + f * (sy / m - X[i * 3 + 1]);
      T[i * 3 + 2] = X[i * 3 + 2] + f * (sz / m - X[i * 3 + 2]);
    }
    X.set(T);
  };
  for (let it = 0; it < opt.iters; it++) { step(opt.lambda); step(opt.mu); }

  // Normalen je Lage
  const normalsOf = () => {
    const N = new Float64Array(nu * 3);
    for (let t = 0; t < nv; t += 3) {
      const a = id[t], b = id[t + 1], c = id[t + 2];
      const e1x = X[b * 3] - X[a * 3], e1y = X[b * 3 + 1] - X[a * 3 + 1], e1z = X[b * 3 + 2] - X[a * 3 + 2];
      const e2x = X[c * 3] - X[a * 3], e2y = X[c * 3 + 1] - X[a * 3 + 1], e2z = X[c * 3 + 2] - X[a * 3 + 2];
      const nx = e1y * e2z - e1z * e2y, ny = e1z * e2x - e1x * e2z, nz = e1x * e2y - e1y * e2x;
      for (const v of [a, b, c]) { N[v * 3] += nx; N[v * 3 + 1] += ny; N[v * 3 + 2] += nz; }
    }
    for (let i = 0; i < nu; i++) { const l = Math.hypot(N[i * 3], N[i * 3 + 1], N[i * 3 + 2]) || 1; N[i * 3] /= l; N[i * 3 + 1] /= l; N[i * 3 + 2] /= l; }
    return N;
  };

  // 4 · Beulen
  if (opt.lump > 0) {
    const N = normalsOf(), amp = opt.lump * diag, f = opt.lumpFreq / Math.max(diag, 1e-6) * 3, s = opt.seed * 17.3;
    for (let i = 0; i < nu; i++) {
      if (fixed[i]) continue;
      const x = X[i * 3] * f + s, y = X[i * 3 + 1] * f, z = X[i * 3 + 2] * f;
      const d = ((vn3(x, y, z) - 0.5) + 0.45 * (vn3(x * 2.1, y * 2.1, z * 2.1) - 0.5)) * amp;
      X[i * 3] += N[i * 3] * d; X[i * 3 + 1] += N[i * 3 + 1] * d; X[i * 3 + 2] += N[i * 3 + 2] * d;
    }
  }

  // 5 · zurückschreiben
  const N = normalsOf();
  const outP = new Float32Array(nv * 3), outN = new Float32Array(nv * 3);
  for (let i = 0; i < nv; i++) {
    const j = id[i];
    outP[i * 3] = X[j * 3]; outP[i * 3 + 1] = X[j * 3 + 1]; outP[i * 3 + 2] = X[j * 3 + 2];
    outN[i * 3] = N[j * 3]; outN[i * 3 + 1] = N[j * 3 + 1]; outN[i * 3 + 2] = N[j * 3 + 2];
  }
  const out = new THREE.BufferGeometry();
  out.setAttribute('position', new THREE.BufferAttribute(outP, 3));
  out.setAttribute('normal', new THREE.BufferAttribute(outN, 3));
  if (A.uv) out.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(A.uv.arr), 2));
  if (A.color) out.setAttribute('color', new THREE.BufferAttribute(new Float32Array(A.color.arr), A.color.n));
  // Gruppen (Mehrfachmaterial) überleben die Unterteilung als Vielfache
  if (geom.groups && geom.groups.length) {
    const f = Math.pow(4, levels);
    geom.groups.forEach(gr => out.addGroup(gr.start * f, gr.count * f, gr.materialIndex));
  }
  out.computeBoundingBox(); out.computeBoundingSphere();
  return { geometry: out, levels, tris: nv / 3, welded: nu, fixed: fixed.reduce((a, b) => a + b, 0) };
}

