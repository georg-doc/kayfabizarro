/* KFB road-markings M1.1 (28.09.) — Markierungssystem aus lab-track/road-markings.m1.json, gelesen von transition-atlas.v1.
 * Bänder folgen der Fahrbahn Sample für Sample (Knetwurst-Querschnitt, runde Kappen), Tropfenregel in Übergängen.
 * M1.1: zwei Fugen (längs F1 = 1 Takt, quer F2 = 2b), Muster vom Ereignis aus angelegt, nie gestreckt.
 *   Sackgasse: Sperrlinie, Zebra, dann laufen Asphalt und Randlinien gerade weiter und der Platz weht darüber (Verwehung im Atlas). */
const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
const sstep = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const lerp = (a, b, t) => a + (b - a) * t;
const h1 = n => { const v = Math.sin(n * 91.345 + 47.853) * 43758.5453; return v - Math.floor(v); };
const vn = x => { const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f); return h1(i) * (1 - u) + h1(i + 1) * u; };

export const runoutY = (MR, v) => MR.runout.ramp.h * sstep(0, MR.runout.ramp.len, v);

// Knetfleck-Regel (symmetrisch): F = Knetkugelfeld A − Knetkugelfeld B (Summe runder Gauß-Kugeln, je Zelle eine, Radius variiert).
// Schwelle k(w) so, dass Deckung ≈ w. Enden: einzelne Kugelspitzen → kleine runde Tropfen in beide Richtungen, Mitte: verschmolzene Flecken.
export const KFB_BLEND_GLSL = /* glsl */`
vec2 kfbBH2(vec2 p){ p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3))); return fract(sin(p) * 43758.5453); }
float kfbBG(vec2 x, float o){ vec2 b = floor(x); float s = 0.0;
  for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) { vec2 cc = b + vec2(float(i), float(j)); vec2 p = cc + 0.15 + 0.7 * kfbBH2(cc + o);
    float r = 0.28 + 0.3 * kfbBH2(cc + o + 3.0).x; vec2 d = x - p; s += exp(-dot(d, d) / (r * r)); }
  return s; }
float kfbBlend(vec2 su, float cell, float w, out float rim){ rim = 0.0; if (w <= 0.001) return 0.0; if (w >= 0.999) return 1.0;
  vec2 x = su / cell; float F = kfbBG(x, 17.0) - kfbBG(x + vec2(0.5, 0.37), 0.0); float t = 2.0 * w - 1.0, t3 = t * t * t;
  float k = 0.66 * t + 0.43 * t3 * t3 * t; rim = 1.0 - smoothstep(0.0, 0.07, abs(F - k)); return F < k ? 1.0 : 0.0; }
`;

export function buildRoadMarkings({ THREE, S, N, ds, A, MR, seedGeometry }) {
  const b = MR.unit.b, m = MR.unit.m, PR = MR.profile, TR = MR.transitions.drops, PL = MR.placement;
  const W = k => MR.weights[k].b * b;
  const Lend = S[N - 1].s, idx = s => clamp(Math.round(s / ds), 0, N - 1);
  const off = q => q.prm.offset || 0;
  const nrm = v => { const l = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l]; };
  const frIn = s => { const x = clamp(s / ds, 0, N - 1.001), i = Math.floor(x), f = x - i, a = S[i], c = S[i + 1];
    const L = (u, v) => [u[0] + (v[0] - u[0]) * f, u[1] + (v[1] - u[1]) * f, u[2] + (v[2] - u[2]) * f];
    return { s, p: L(a.p, c.p), T: nrm(L(a.T, c.T)), U: nrm(L(a.U, c.U)), R: nrm(L(a.R, c.R)), off: lerp(off(a), off(c), f),
      l6: lerp(a.slots[6][0], c.slots[6][0], f), l7: lerp(a.slots[7][0], c.slots[7][0], f), y6: lerp(a.slots[6][1], c.slots[6][1], f), y7: lerp(a.slots[7][1], c.slots[7][1], f) }; };
  // jenseits der Routenenden: gerade weiter + Rampe auf den Platz (nur Sackgassen nutzen das)
  const fr = s => { if (s >= 0 && s <= Lend) return frIn(s); const F = frIn(s < 0 ? 0 : Lend), d = s < 0 ? s : s - Lend, y = runoutY(MR, Math.abs(d));
    F.p = [F.p[0] + F.T[0] * d + F.U[0] * y, F.p[1] + F.T[1] * d + F.U[1] * y, F.p[2] + F.T[2] * d + F.U[2] * y]; F.s = s; return F; };
  const surf = (F, lat) => { const t = (lat - F.l6) / Math.max(0.01, F.l7 - F.l6), y = lerp(F.y6, F.y7, t);
    return [F.p[0] + F.R[0] * lat + F.U[0] * y, F.p[1] + F.R[1] * lat + F.U[1] * y, F.p[2] + F.R[2] * lat + F.U[2] * y]; };
  const onRoad = s => (S[idx(s)].prm.surface ?? 1) >= 1;
  const isMag = s => S[idx(s)].skin === 'mag';

  // ---------- Geometrie-Sammler (eine Geometrie je Farbrolle) ----------
  const OUT = { hell: { pos: [], ind: [] }, signal: { pos: [], ind: [] } }; let pieces = 0;
  const vtx = (o, p) => { o.pos.push(p[0], p[1], p[2]); return o.pos.length / 3 - 1; };
  const tri = (o, a, b2, c, U) => { const P = o.pos, ax = P[a * 3], ay = P[a * 3 + 1], az = P[a * 3 + 2];
    const ux = P[b2 * 3] - ax, uy = P[b2 * 3 + 1] - ay, uz = P[b2 * 3 + 2] - az, wx = P[c * 3] - ax, wy = P[c * 3 + 1] - ay, wz = P[c * 3 + 2] - az;
    const nx = uy * wz - uz * wy, ny = uz * wx - ux * wz, nz = ux * wy - uy * wx; if (nx * U[0] + ny * U[1] + nz * U[2] >= 0) o.ind.push(a, b2, c); else o.ind.push(a, c, b2); };
  const at3 = (c, R, T, U, x, y, h) => [c[0] + R[0] * x + T[0] * y + U[0] * h, c[1] + R[1] * x + T[1] * y + U[1] * h, c[2] + R[2] * x + T[2] * y + U[2] * h];
  const HH = PR.h.map(h => h + PR.lift), RHO = [1, 0.7];   // Kappenringe: außen (h[0]), innen (h[1]); Mitte h[2]
  const cap = (o, c, T, R, U, r, dir) => { const C = vtx(o, at3(c, R, T, U, 0, 0, HH[2])), n = 8, ring = [[], []];
    for (let j = 0; j <= n; j++) { const th = -Math.PI / 2 + Math.PI * j / n; RHO.forEach((rh, k) => ring[k].push(vtx(o, at3(c, R, T, U, rh * r * Math.sin(th), dir * rh * r * Math.cos(th), k ? HH[1] : HH[0])))); }
    for (let j = 0; j < n; j++) { tri(o, C, ring[1][j], ring[1][j + 1], U); tri(o, ring[1][j], ring[0][j], ring[1][j + 1], U); tri(o, ring[0][j], ring[0][j + 1], ring[1][j + 1], U); } };
  const dot = (o, c, T, R, U, r) => { cap(o, c, T, R, U, r, 1); cap(o, c, T, R, U, r, -1); pieces++; };
  // Band von sa bis sb, Breite wf(s), Mitte latf(F, w) (absolut lateral). Kappen rund, Punkt wenn zu kurz.
  const band = (role, sa, sb, wf, latf) => { const o = OUT[role], L = sb - sa; if (L <= 0.02) return;
    const ra = wf(sa) / 2, rb = wf(sb) / 2;
    if (L <= ra + rb + 0.02) { const sm = (sa + sb) / 2, F = fr(sm), w = wf(sm); dot(o, surf(F, latf(F, w)), F.T, F.R, F.U, Math.min(w / 2, L / 2)); return; }
    const ca = sa + ra, cb = sb - rb, n = Math.max(1, Math.ceil((cb - ca) / 0.5)); let prev = null;
    for (let k = 0; k <= n; k++) { const s = ca + (cb - ca) * k / n, F = fr(s), w = wf(s), c = surf(F, latf(F, w)), row = PR.x.map((x, j) => vtx(o, at3(c, F.R, F.T, F.U, x * w / 2, 0, HH[j])));
      if (prev) for (let j = 0; j < row.length - 1; j++) { tri(o, prev[j], prev[j + 1], row[j], F.U); tri(o, prev[j + 1], row[j + 1], row[j], F.U); }
      prev = row;
      if (k === 0) cap(o, c, F.T, F.R, F.U, w / 2, -1);
      if (k === n) cap(o, c, F.T, F.R, F.U, w / 2, 1); }
    pieces++; };
  // Tropfenregel: ein Slot [t0, t1] mit Strichanteil dash (m), Gewicht a → volles Stück, kürzerer Strich, Tropfen oder nichts
  const drop = (role, t0, t1, dash, a, wf, latf, seed) => { const mid = (t0 + t1) / 2;
    if (a >= TR.full) return { full: true };
    if (a > TR.dashToDrop) { const L = dash * (a - TR.dashToDrop) / (1 - TR.dashToDrop), w = wf(mid); band(role, mid - Math.max(L, w) / 2, mid + Math.max(L, w) / 2, wf, latf); return {}; }
    if (a < TR.dropMin || h1(seed) > TR.keepMin + (1 - TR.keepMin) * a / TR.dashToDrop) return {};
    const F = fr(mid), w = wf(mid), r = w / 2 * lerp(TR.dropScale[0], TR.dropScale[1], a / TR.dashToDrop); dot(OUT[role], surf(F, latf(F, w)), F.T, F.R, F.U, r); return {}; };

  // ---------- Fugen, Sackgassen ----------
  const F1 = MR.joints.long * b, F2 = MR.joints.lat * b, Lro = MR.runout.length * m;
  const zL = MR.elements.zebra.length * m, zF = PL.zebraFromEnd * m, ends = [];
  if (A.bio(0) === 0) ends.push({ dir: -1, s: 0, z0: zF, z1: zF + zL });
  if (A.bio(Lend) === 0) ends.push({ dir: 1, s: Lend, z0: Lend - zF - zL, z1: Lend - zF });
  const sLo = ends.some(e => e.dir < 0) ? -Lro : 0, sHi = ends.some(e => e.dir > 0) ? Lend + Lro : Lend;
  const wob = (s, k) => 1 + PR.wobble.width * (vn(s / 5 + k) - 0.5) * 2, lw = s => PR.wobble.lat * b * (vn(s / 7 + 11) - 0.5) * 2;

  // ---------- Randlinien: durchgezogen, Magnet als Blocklinie; Wechsel mit F1, Block vom Wechsel aus angelegt ----------
  const cityK = (s, sd) => (A.bio(s) === 0 ? A.w('mark_city', s, sd) : 0);
  const presence = (s, sd) => (A.bio(s) === 1 ? 1 - A.w('mark_track', s, sd) : 1);
  for (const sd of [-1, 1]) {
    const segs = []; let cur = null;
    for (let s = sLo; s <= sHi + 1e-6; s += 0.25) { const key = !onRoad(s) ? null : isMag(s) ? 'mag' : 'std';
      if (!cur || cur.key !== key) { if (cur && cur.key) segs.push(cur); cur = { key, a: s, b: s }; } else cur.b = s; }
    if (cur && cur.key) segs.push(cur);
    let carry = null;
    segs.forEach((g, gi) => {
      const prevAdj = gi > 0 && Math.abs(segs[gi - 1].b - g.a) < 0.3, nextAdj = !!segs[gi + 1] && Math.abs(segs[gi + 1].a - g.b) < 0.3;
      const mag = g.key === 'mag', role = mag ? 'signal' : 'hell';
      const wf = mag ? (s => W('W3') * wob(s, sd)) : (s => lerp(W('W3'), W('W2'), cityK(s, sd)) * wob(s, sd));
      const latf = (F, w) => (sd > 0 ? F.l7 - w / 2 : F.l6 + w / 2) - sd * Math.abs(lw(F.s)) * 0.5;
      if (mag) { const dash = MR.patterns.block.dash * m, per = dash + F1, lim = g.b + (nextAdj ? F1 / 2 : 0); let t = prevAdj ? g.a + F1 / 2 : g.a, last = null;
        while (t + dash <= lim + 1e-6) { band(role, t, t + dash, wf, latf); last = t + dash; t += per; }
        carry = nextAdj && last != null ? last + F1 : null; return; }
      const a0 = carry ?? g.a, b0 = nextAdj ? g.b - F1 / 2 : g.b; carry = null; if (b0 - a0 < 0.4) return;
      const n = Math.max(1, Math.floor((b0 - a0) / m)); let run = -1;
      for (let k = 0; k <= n; k++) { const t0 = a0 + k * m, t1 = k === n - 1 ? b0 : t0 + m;
        const r = k < n ? drop(role, t0, t1, t1 - t0, presence((t0 + t1) / 2, sd), wf, latf, k * 7 + sd * 13 + gi * 131) : {};
        if (r.full) { if (run < 0) run = t0; } else if (run >= 0) { band(role, run, t0, wf, latf); run = -1; } }
      if (run >= 0) band(role, run, b0, wf, latf);
    });
  }

  // ---------- Mitte Stadt: Sperrlinie F1 vor dem Zebra, Leitlinie 2 : 1 von der Sperrlinie aus angelegt ----------
  { const dash = MR.patterns.guide.dash * m, per = dash + F1, NP = MR.elements.no_pass.length * m;
    const wf = s => W('W2') * wob(s, 5), latf = F => F.off + lw(F.s) * 0.5;
    const emit = (t0, t1, k) => { for (let s = t0; s <= t1; s += 0.5) if (!onRoad(s) || isMag(s)) return;
      const mid = (t0 + t1) / 2, a = A.bio(mid) === 0 ? A.w('mark_city', mid, 0) : 0; if (a < TR.dropMin) return;
      if (drop('hell', t0, t1, dash, a, wf, latf, k * 17 + 3).full) band('hell', t0, t1, wf, latf); };
    for (const e of ends) {
      if (e.dir > 0) { const sB = e.z0 - F1, sA = sB - NP; band('hell', sA, sB, wf, latf); let t1 = sA - F1, k = 0; while (t1 - dash > Lend / 2) { emit(t1 - dash, t1, k++); t1 -= per; } }
      else { const sA = e.z1 + F1, sB = sA + NP; band('hell', sA, sB, wf, latf); let t0 = sB + F1, k = 0; while (t0 + dash < Lend / 2) { emit(t0, t0 + dash, k++); t0 += per; } } } }

  // ---------- Zebra: Balken W3 längs, Abstand F2, symmetrisch zwischen den Randlinien (je F2) ----------
  for (const e of ends) { const bw = W(MR.elements.zebra.bar), F = fr((e.z0 + e.z1) / 2), ew = W('W2'), span = F.l7 - F.l6 - 2 * (ew + F2);
    const nB = Math.floor((span + F2) / (bw + F2)), used = nB * bw + (nB - 1) * F2;
    for (let k = 0; k < nB; k++) { const x = -used / 2 + bw / 2 + k * (bw + F2); band('hell', e.z0, e.z1, () => bw, F2f => (F2f.l6 + F2f.l7) / 2 + x); } }

  const geo = role => { const o = OUT[role]; if (!o.ind.length) return null; const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(o.pos, 3)); g.setIndex(o.ind); g.computeVertexNormals(); seedGeometry(THREE, g, role === 'hell' ? 2101 : 2102); return g; };
  return { hell: geo('hell'), signal: geo('signal'), pieces, ends, Lro };
}
