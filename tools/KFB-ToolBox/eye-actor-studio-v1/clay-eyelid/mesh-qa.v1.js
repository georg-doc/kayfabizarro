/* mesh-qa.v1.js — Geometrie-Prüfung für Lid-Netze (KFB Clay-Lid Werkbank). Liest nur Positionen + Indizes.
   Roh = Topologie wie gerendert; verschweißt = gleiche Lage zusammengelegt (1e-6), zeigt ob das Netz räumlich geschlossen ist. */
export function weld(pos, eps = 1e-6) {
  const V = pos.length / 3, map = new Int32Array(V), seen = new Map();
  let n = 0;
  for (let i = 0; i < V; i++) {
    const k = Math.round(pos[i * 3] / eps) + ',' + Math.round(pos[i * 3 + 1] / eps) + ',' + Math.round(pos[i * 3 + 2] / eps);
    let id = seen.get(k);
    if (id == null) { id = n++; seen.set(k, id); }
    map[i] = id;
  }
  return { map, count: n };
}

function edgeStats(idx, V) {
  const m = new Map();
  for (let f = 0; f < idx.length; f += 3) for (let e = 0; e < 3; e++) {
    const a = idx[f + e], b = idx[f + (e + 1) % 3];
    if (a === b) continue;
    const lo = a < b ? a : b, hi = a < b ? b : a, key = lo * V + hi;
    let s = m.get(key); if (!s) { s = { n: 0, dir: 0 }; m.set(key, s); }
    s.n++; s.dir += a < b ? 1 : -1;
  }
  let boundary = 0, nonManifold = 0, winding = 0;
  for (const s of m.values()) {
    if (s.n === 1) boundary++;
    else if (s.n > 2) nonManifold++;
    else if (s.dir !== 0) winding++;
  }
  return { E: m.size, boundary, nonManifold, winding };
}

function components(idx, V) {
  const p = new Int32Array(V).map((_, i) => i);
  const f = (x) => { while (p[x] !== x) { p[x] = p[p[x]]; x = p[x]; } return x; };
  const used = new Uint8Array(V);
  for (let i = 0; i < idx.length; i += 3) {
    used[idx[i]] = used[idx[i + 1]] = used[idx[i + 2]] = 1;
    const a = f(idx[i]), b = f(idx[i + 1]), c = f(idx[i + 2]);
    p[b] = a; p[f(c)] = a;
  }
  const roots = new Set(); let nUsed = 0;
  for (let i = 0; i < V; i++) if (used[i]) { nUsed++; roots.add(f(i)); }
  return { count: roots.size, used: nUsed };
}

const sub = (o, a, b) => { o[0] = a[0] - b[0]; o[1] = a[1] - b[1]; o[2] = a[2] - b[2]; return o; };
const cross = (o, a, b) => { const x = a[1] * b[2] - a[2] * b[1], y = a[2] * b[0] - a[0] * b[2], z = a[0] * b[1] - a[1] * b[0]; o[0] = x; o[1] = y; o[2] = z; return o; };
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

function segTri(p, q, A, B, C, eps, t0 = [0, 0, 0], t1 = [0, 0, 0], d = [0, 0, 0], h = [0, 0, 0], s = [0, 0, 0], qq = [0, 0, 0]) {
  sub(d, q, p); sub(t0, B, A); sub(t1, C, A); cross(h, d, t1);
  const a = dot(t0, h); if (Math.abs(a) < 1e-14) return false;
  const f = 1 / a; sub(s, p, A);
  const u = f * dot(s, h); if (u <= eps || u >= 1 - eps) return false;
  cross(qq, s, t0);
  const v = f * dot(d, qq); if (v <= eps || u + v >= 1 - eps) return false;
  const t = f * dot(t1, qq); return t > eps && t < 1 - eps;
}

export function selfIntersections(pos, idx, wmap, maxHits = 60) {
  const F = idx.length / 3, P = (i) => [pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2]];
  const bb = new Float64Array(F * 6); let el = 0;
  for (let f = 0; f < F; f++) {
    const a = P(idx[f * 3]), b = P(idx[f * 3 + 1]), c = P(idx[f * 3 + 2]);
    for (let k = 0; k < 3; k++) { bb[f * 6 + k] = Math.min(a[k], b[k], c[k]); bb[f * 6 + 3 + k] = Math.max(a[k], b[k], c[k]); }
    el += Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
  }
  const cell = Math.max(1e-4, 2.5 * el / F), grid = new Map();
  const ci = (x) => Math.floor(x / cell);
  for (let f = 0; f < F; f++) {
    const x0 = ci(bb[f * 6]), y0 = ci(bb[f * 6 + 1]), z0 = ci(bb[f * 6 + 2]), x1 = ci(bb[f * 6 + 3]), y1 = ci(bb[f * 6 + 4]), z1 = ci(bb[f * 6 + 5]);
    if ((x1 - x0 + 1) * (y1 - y0 + 1) * (z1 - z0 + 1) > 512) continue;
    for (let x = x0; x <= x1; x++) for (let y = y0; y <= y1; y++) for (let z = z0; z <= z1; z++) {
      const k = x + ',' + y + ',' + z; let l = grid.get(k); if (!l) { l = []; grid.set(k, l); } l.push(f);
    }
  }
  let hits = 0, tests = 0; const where = [];
  for (const [key, l] of grid) {
    if (l.length < 2) continue;
    const [cx, cy, cz] = key.split(',').map(Number);
    for (let i = 0; i < l.length; i++) for (let j = i + 1; j < l.length; j++) {
      const A = l[i], B = l[j];
      if (ci(Math.max(bb[A * 6], bb[B * 6])) !== cx || ci(Math.max(bb[A * 6 + 1], bb[B * 6 + 1])) !== cy || ci(Math.max(bb[A * 6 + 2], bb[B * 6 + 2])) !== cz) continue;
      if (bb[A * 6] > bb[B * 6 + 3] || bb[B * 6] > bb[A * 6 + 3] || bb[A * 6 + 1] > bb[B * 6 + 4] || bb[B * 6 + 1] > bb[A * 6 + 4] || bb[A * 6 + 2] > bb[B * 6 + 5] || bb[B * 6 + 2] > bb[A * 6 + 5]) continue;
      const wa = [wmap[idx[A * 3]], wmap[idx[A * 3 + 1]], wmap[idx[A * 3 + 2]]], wb = [wmap[idx[B * 3]], wmap[idx[B * 3 + 1]], wmap[idx[B * 3 + 2]]];
      if (wa.some((v) => wb.includes(v))) continue;
      tests++;
      const a = [P(idx[A * 3]), P(idx[A * 3 + 1]), P(idx[A * 3 + 2])], b = [P(idx[B * 3]), P(idx[B * 3 + 1]), P(idx[B * 3 + 2])];
      let x = false;
      for (let e = 0; e < 3 && !x; e++) x = segTri(a[e], a[(e + 1) % 3], b[0], b[1], b[2], 1e-7) || segTri(b[e], b[(e + 1) % 3], a[0], a[1], a[2], 1e-7);
      if (x) { hits++; if (where.length < maxHits) where.push([(a[0][0] + a[1][0] + a[2][0]) / 3, (a[0][1] + a[1][1] + a[2][1]) / 3, (a[0][2] + a[1][2] + a[2][2]) / 3]); }
    }
  }
  return { hits, tests, where };
}

export function meshQA(pos, idx, opt = {}) {
  const V = pos.length / 3, F = idx.length / 3, R = opt.eyeRadius || 1;
  const raw = edgeStats(idx, V);
  const w = weld(pos), widx = new Uint32Array(idx.length);
  for (let i = 0; i < idx.length; i++) widx[i] = w.map[idx[i]];
  const wel = edgeStats(widx, w.count), comp = components(widx, w.count);
  let vol = 0, degenerate = 0, minQ = Infinity, spikes = 0, minR = Infinity, worst = null;
  const dup = new Set(); let duplicates = 0;
  const e1 = [0, 0, 0], e2 = [0, 0, 0], c = [0, 0, 0];
  for (let f = 0; f < F; f++) {
    const ia = idx[f * 3], ib = idx[f * 3 + 1], ic = idx[f * 3 + 2];
    const a = [pos[ia * 3], pos[ia * 3 + 1], pos[ia * 3 + 2]], b = [pos[ib * 3], pos[ib * 3 + 1], pos[ib * 3 + 2]], cc = [pos[ic * 3], pos[ic * 3 + 1], pos[ic * 3 + 2]];
    vol += dot(a, cross(c, b, cc)) / 6;
    cross(c, sub(e1, b, a), sub(e2, cc, a));
    const area = Math.hypot(c[0], c[1], c[2]) / 2;
    const l2 = dot(e1, e1) + dot(e2, e2) + (b[0] - cc[0]) ** 2 + (b[1] - cc[1]) ** 2 + (b[2] - cc[2]) ** 2;
    if (area < 1e-12) degenerate++;
    else { const q = 4 * Math.sqrt(3) * area / l2; if (q < 0.02) spikes++; if (q < minQ) { minQ = q; worst = [(a[0] + b[0] + cc[0]) / 3, (a[1] + b[1] + cc[1]) / 3, (a[2] + b[2] + cc[2]) / 3]; } }
    const k = [widx[f * 3], widx[f * 3 + 1], widx[f * 3 + 2]].sort((x, y) => x - y).join(',');
    if (dup.has(k)) duplicates++; else dup.add(k);
  }
  for (let i = 0; i < V; i++) minR = Math.min(minR, Math.hypot(pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2]));
  const si = opt.selfIntersection === false ? null : selfIntersections(pos, idx, w.map);
  const closed = wel.boundary === 0 && wel.nonManifold === 0;
  return {
    V, F, raw, welded: { V: w.count, ...wel }, components: comp.count,
    euler: comp.used - wel.E + F, closed, volume: vol, outward: closed ? vol > 0 : null,
    degenerate, duplicates, minQuality: minQ, spikes, worstAt: worst,
    clearance: minR / R - 1, self: si,
  };
}
