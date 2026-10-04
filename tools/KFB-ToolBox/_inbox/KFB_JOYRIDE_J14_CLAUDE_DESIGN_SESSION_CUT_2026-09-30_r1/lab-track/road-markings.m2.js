/* KFB road-markings M2 (28.09.) — lab-track/road-markings.m2.json in 3D, gelesen von transition-atlas.v1.
 * Regelwerk-Maß: S 0,30 / B 0,60 / Q 1,20 m. Leitlinie 6/12, Warnlinie 6/3, Blocklinie 3/3. Enden gerade, keine Wobble.
 * Muster vom Ereignis rückwärts (Zebra → 3 m → drei Warnstriche → 12 m → Leitlinie). Takt-Auslauf statt Tropfen.
 * Stärkewechsel Strecke B → Stadt S als Keil über 20 m, Außenkante bündig. Verwehung/Runout bleibt vorerst M1 (MR1). */
import { runoutY } from './road-markings.m1.js?r=4';
const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
const lerp = (a, b, t) => a + (b - a) * t;

export function buildRoadMarkingsM2({ THREE, S, N, ds, A, M2, MR1, seedGeometry, rulebook = 'de' }) {
  const WD = M2.widths, Sw = WD.S, Bw = WD.B, Qw = WD.Q, PT = M2.patterns, PR = M2.profile, TPR = M2.transitions.taper, WEDGE = M2.transitions.weight.length;
  const Lend = S[N - 1].s, idx = s => clamp(Math.round(s / ds), 0, N - 1), cs = s => clamp(s, 0, Lend);
  const off = q => q.prm.offset || 0;
  const nrm = v => { const l = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l]; };
  const frIn = s => { const x = clamp(s / ds, 0, N - 1.001), i = Math.floor(x), f = x - i, a = S[i], c = S[i + 1];
    const L = (u, v) => [u[0] + (v[0] - u[0]) * f, u[1] + (v[1] - u[1]) * f, u[2] + (v[2] - u[2]) * f];
    return { s, p: L(a.p, c.p), T: nrm(L(a.T, c.T)), U: nrm(L(a.U, c.U)), R: nrm(L(a.R, c.R)), off: lerp(off(a), off(c), f),
      l6: lerp(a.slots[6][0], c.slots[6][0], f), l7: lerp(a.slots[7][0], c.slots[7][0], f), y6: lerp(a.slots[6][1], c.slots[6][1], f), y7: lerp(a.slots[7][1], c.slots[7][1], f) }; };
  const fr = s => { if (s >= 0 && s <= Lend) return frIn(s); const F = frIn(s < 0 ? 0 : Lend), d = s < 0 ? s : s - Lend, y = runoutY(MR1, Math.abs(d));
    F.p = [F.p[0] + F.T[0] * d + F.U[0] * y, F.p[1] + F.T[1] * d + F.U[1] * y, F.p[2] + F.T[2] * d + F.U[2] * y]; F.s = s; return F; };
  const surf = (F, lat) => { const t = (lat - F.l6) / Math.max(0.01, F.l7 - F.l6), y = lerp(F.y6, F.y7, t);
    return [F.p[0] + F.R[0] * lat + F.U[0] * y, F.p[1] + F.R[1] * lat + F.U[1] * y, F.p[2] + F.R[2] * lat + F.U[2] * y]; };
  const onRoad = s => (S[idx(s)].prm.surface ?? 1) >= 1;
  const isMag = s => S[idx(s)].skin === 'mag';
  const bio = s => A.bio(cs(s));

  // ---------- Geometrie (eine je Farbrolle), Knetwurst-Querschnitt, Enden gerade ----------
  const OUT = { hell: { pos: [], ind: [] }, signal: { pos: [], ind: [] } }; let pieces = 0;
  const roleOf = r => (r === 'centre' ? (rulebook === 'us' ? 'signal' : 'hell') : r);
  const vtx = (o, p) => { o.pos.push(p[0], p[1], p[2]); return o.pos.length / 3 - 1; };
  const tri = (o, a, b2, c, D) => { const P = o.pos, ax = P[a * 3], ay = P[a * 3 + 1], az = P[a * 3 + 2];
    const ux = P[b2 * 3] - ax, uy = P[b2 * 3 + 1] - ay, uz = P[b2 * 3 + 2] - az, wx = P[c * 3] - ax, wy = P[c * 3 + 1] - ay, wz = P[c * 3 + 2] - az;
    const nx = uy * wz - uz * wy, ny = uz * wx - ux * wz, nz = ux * wy - uy * wx; if (nx * D[0] + ny * D[1] + nz * D[2] >= 0) o.ind.push(a, b2, c); else o.ind.push(a, c, b2); };
  const at3 = (c, R, T, U, x, y, h) => [c[0] + R[0] * x + T[0] * y + U[0] * h, c[1] + R[1] * x + T[1] * y + U[1] * h, c[2] + R[2] * x + T[2] * y + U[2] * h];
  const HH = PR.h.map(h => h + PR.lift), H0 = PR.lift * 0.5;
  const endWall = (o, c, F, w, row, dir) => { const D = F.T.map(v => v * dir), cb = vtx(o, at3(c, F.R, F.T, F.U, 0, 0, H0)),
      b0 = vtx(o, at3(c, F.R, F.T, F.U, -w / 2, 0, H0)), b1 = vtx(o, at3(c, F.R, F.T, F.U, w / 2, 0, H0));
    for (let j = 0; j < row.length - 1; j++) tri(o, cb, row[j], row[j + 1], D); tri(o, cb, b0, row[0], D); tri(o, cb, row[row.length - 1], b1, D); };
  // Band von sa bis sb längs der Fahrbahn, Breite wf(s), Mitte latf(F, w) (lateral absolut)
  const band = (role, sa, sb, wf, latf) => { const o = OUT[roleOf(role)], L = sb - sa; if (L < 0.05) return;
    const n = Math.max(1, Math.ceil(L / 0.5)); let prev = null;
    for (let k = 0; k <= n; k++) { const s = sa + L * k / n, F = fr(s), w = wf(s), c = surf(F, latf(F, w)), row = PR.x.map((x, j) => vtx(o, at3(c, F.R, F.T, F.U, x * w / 2, 0, HH[j])));
      if (prev) for (let j = 0; j < row.length - 1; j++) { tri(o, prev[j], prev[j + 1], row[j], F.U); tri(o, prev[j + 1], row[j + 1], row[j], F.U); }
      if (k === 0) endWall(o, c, F, w, row, -1); if (k === n) endWall(o, c, F, w, row, 1); prev = row; }
    pieces++; };
  // Längsmuster vom Anker aus; segs [[muster, anzahl|null], …]; Lücke beim Musterwechsel = Lücke des nächsten Musters
  const run = (anchor, dir, segs, lo, hi, emit) => { let t = anchor;
    for (let si = 0; si < segs.length; si++) { const [pk, n] = segs[si], p = PT[pk]; let k = 0;
      while (k < (n ?? 1e9)) { const a = dir > 0 ? t : t - p.dash, z = dir > 0 ? t + p.dash : t; if (dir > 0 ? a > hi - 1e-6 : z < lo + 1e-6) return;
        const ca = Math.max(a, lo), cz = Math.min(z, hi); if (cz - ca > 0.3) emit(ca, cz, pk); k++;
        const g = (k === n && segs[si + 1]) ? PT[segs[si + 1][0]].gap : p.gap; t = (dir > 0 ? z : a) + dir * g; } } };
  // Takt-Auslauf: Linie endet bei x0 und zerfällt in n Stücke im 3-m-Takt, Länge linear bis zur Strichbreite
  const taper = (x0, dir, w, lo, hi, emit, n = 7) => { const p = TPR.period, L0 = TPR.first * p, step = (L0 - w) / (n - 1), c0 = x0 + dir * (p - (L0 + step) / 2);
    for (let k = 0; k < n; k++) { const L = L0 - step * k, cx = c0 + dir * k * p, a = Math.max(lo, cx - L / 2), z = Math.min(hi, cx + L / 2); if (z - a >= w * 0.9) emit(a, z); } };

  // ---------- Sackgassen: Zebra 12 m vor dem Ende, 6 m lang ----------
  const Lro = MR1.runout.length * MR1.unit.m, zF = M2.deadEnd.zebraFromEnd, zL = M2.elements.zebra.length, ends = [];
  const closedT = typeof window !== 'undefined' && window.__KFB_T4_PROPS && window.__KFB_T4_PROPS.closed;   // J13: geschlossener Stream hat keine Sackgassen → kein Zebra/Warnlinie/gerader Auslauf über die Naht
  if (!closedT && bio(0) === 0) ends.push({ dir: -1, s: 0, z0: zF, z1: zF + zL });
  if (!closedT && bio(Lend) === 0) ends.push({ dir: 1, s: Lend, z0: Lend - zF - zL, z1: Lend - zF });
  const sLo = ends.some(e => e.dir < 0) ? -Lro : 0, sHi = ends.some(e => e.dir > 0) ? Lend + Lro : Lend;

  // ---------- Randlinien ----------
  // Stärke: Stadt S, sonst B; Keil über 20 m in die Stadt hinein ab jeder Grenze Stadt/Nicht-Stadt
  const cityEdges = []; for (let s = 1; s <= Lend; s += 1) if ((bio(s) === 0) !== (bio(s - 1) === 0)) cityEdges.push(s - 0.5);
  const edgeW = s => { if (bio(s) !== 0) return Bw; let d = 1e9; for (const b of cityEdges) d = Math.min(d, Math.abs(s - b)); return lerp(Bw, Sw, clamp(d / WEDGE, 0, 1)); };
  const presence = (s, sd) => (bio(s) === 1 ? 1 - A.w('mark_track', cs(s), sd) : 1);
  const info = { tapers: 0, wedges: cityEdges.length, zebraBars: 0, centreDashes: 0, blocks: 0 };
  for (const sd of [-1, 1]) {
    const latf = (F, w) => (sd > 0 ? F.l7 - w / 2 : F.l6 + w / 2);
    const segs = []; let cur = null;
    for (let s = sLo; s <= sHi + 1e-6; s += 0.25) { const key = !onRoad(s) ? null : isMag(s) ? 'mag' : 'std';
      if (!cur || cur.key !== key) { if (cur && cur.key) segs.push(cur); cur = { key, a: s, b: s }; } else cur.b = s; }
    if (cur && cur.key) segs.push(cur);
    let carry = null;
    segs.forEach((g, gi) => {
      const prevAdj = gi > 0 && Math.abs(segs[gi - 1].b - g.a) < 0.3, nextAdj = !!segs[gi + 1] && Math.abs(segs[gi + 1].a - g.b) < 0.3;
      if (g.key === 'mag') { const P = PT.block, wf = () => Bw; let t = prevAdj ? g.a + P.gap : g.a, last = null;
        while (t + P.dash <= g.b + 1e-6) { band('signal', t, t + P.dash, wf, latf); info.blocks++; last = t + P.dash; t += P.dash + P.gap; }
        carry = nextAdj && last != null ? last + P.gap : null; return; }
      const a0 = carry ?? g.a, b0 = g.b; carry = null; if (b0 - a0 < 0.4) return;
      // Läufe mit Präsenz ≥ 0,5; innere Enden laufen im Takt aus
      const runs = []; let ra = null;
      for (let s = a0; s <= b0 + 1e-6; s += 0.25) { const on = presence(s, sd) >= 0.5; if (on && ra == null) ra = s; if (!on && ra != null) { runs.push([ra, s]); ra = null; } }
      if (ra != null) runs.push([ra, b0]);
      const emit = (a, z) => band('hell', a, z, edgeW, latf);
      for (const [ra2, rb] of runs) { emit(ra2, rb);
        if (ra2 > a0 + 0.5) { taper(ra2, -1, edgeW(ra2), a0, ra2, emit); info.tapers++; }
        if (rb < b0 - 0.5) { taper(rb, 1, edgeW(rb), rb, b0, emit); info.tapers++; } }
    });
  }

  // ---------- Mitte Stadt: vom Zebra rückwärts 3 m, drei Warnstriche, 12 m, Leitlinie ----------
  { const wf = () => Sw, latf = F => F.off;
    const ok = (a, z) => { for (let s = a; s <= z + 1e-6; s += 0.5) if (!onRoad(s) || isMag(s) || bio(s) !== 0 || A.w('mark_city', cs(s), 0) < 0.5) return false; return true; };
    const emit = (a, z) => { if (ok(a, z)) { band('centre', a, z, wf, latf); info.centreDashes++; } };
    const two = ends.length === 2, mid = Lend / 2;
    for (const e of ends) { const G = PT.warn.gap;
      if (e.dir > 0) { run(e.z0 - G, -1, [['warn', 3], ['leit', null]], two ? mid : 0, e.z0, emit); run(e.z1 + G, 1, [['warn', null]], e.z1, Lend + Lro * 0.9, emit); }
      else { run(e.z1 + G, 1, [['warn', 3], ['leit', null]], e.z1, two ? mid : Lend, emit); run(e.z0 - G, -1, [['warn', null]], -Lro * 0.9, e.z0, emit); } }
    if (!ends.length) run(0, 1, [['leit', null]], 0, Lend, emit); }

  // ---------- Zebra: Balken Q, Lücke Q, über die Fahrbahn zwischen den Randlinien, symmetrisch zur Achse ----------
  for (const e of ends) { const F = fr((e.z0 + e.z1) / 2), wR = F.l7 - F.l6, n = Math.floor((wR - 2 * Sw + Qw) / (2 * Qw));
    for (let k = 0; k < n; k++) { const x = (k - (n - 1) / 2) * 2 * Qw; band('hell', e.z0, e.z1, () => Qw, G => (G.l6 + G.l7) / 2 + x); info.zebraBars++; } }

  const geo = role => { const o = OUT[role]; if (!o.ind.length) return null; const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(o.pos, 3)); g.setIndex(o.ind); g.computeVertexNormals(); seedGeometry(THREE, g, role === 'hell' ? 2201 : 2202); return g; };
  return { hell: geo('hell'), signal: geo('signal'), pieces, ends, Lro, info };
}
