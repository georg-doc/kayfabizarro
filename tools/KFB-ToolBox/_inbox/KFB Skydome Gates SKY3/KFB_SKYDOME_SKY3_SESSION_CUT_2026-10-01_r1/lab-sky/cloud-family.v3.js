/* KFB · SKY1 · Wolken-Familie v3 (01.10., Georg: »baue unterschiedliche varianten der clouds mit der gleichen logik, claymation design & grund-anatomie«)
 * Gleiche Logik wie v2 (cloud-family.v2.js, unverändert importiert): jede Variante besteht NUR aus Donor-Lappen (18 Schalen der Jarlan-Wolke, Lage/Achsen/Halbachsen gemessen),
 *   wird als ein Knetstück aus dem Abstandsfeld gebaut (smin-Kehle, Tisch-Unterseite, Beulen) und trägt dasselbe K2-Material (Profil cloud). Ein Material für alle Wolken.
 * Neu: Archetypen als Regeln über die Donor-Lappen — kein freies Modellieren, keine Kugel aus dem Nichts:
 *   donor     V0–V2  die drei Donor-Wolken, Identität
 *   kumulus   eine Donor-Wolke, 2 geliehene Lappen OBEN auf den größten gesetzt, hoch gestreckt
 *   stratus   eine Donor-Wolke, 2–3 geliehene Lappen SEITLICH in Reihe, flach und lang
 *   puff      nur die 3–4 größten zusammenhängenden Lappen einer Donor-Wolke, klein und rund
 *   turm      eine Donor-Wolke, 3 geliehene Lappen GESTAPELT, nach oben kleiner
 *   kette     zwei Donor-Wolken nebeneinander, an einem Lappen verschmolzen (lange Wolkenbank)
 * Überlappungsregel wie v1: jeder Lappen berührt einen anderen mit ≥ 15 % Radiusüberlapp. Stabile Saat je Variante. */
import * as V2 from './cloud-family.v2.js?r=3';
import { mulberry, makeSpec, DONOR } from './cloud-family.v1.js';
export { DONOR, loadDonor, scatterClouds, createCloudField, makeClayBase, makeCloudMaterial, CLAY_PARAMS, CLOUD_HAND } from './cloud-family.v2.js?r=3';
export const FAMILY_VERSION = 'kfb.sky.cloud-family/3-archetypes';
export const ARCHETYPES = ['donor', 'kumulus', 'stratus', 'puff', 'turm', 'kette'];
export const ARCH_LABEL = { donor: 'Donor', kumulus: 'Kumulus', stratus: 'Stratus', puff: 'Puff', turm: 'Turm', kette: 'Kette' };
/* 13 Varianten: 3 × donor + je 2 der übrigen fünf */
export const PLAN = ['donor', 'donor', 'donor', 'kumulus', 'kumulus', 'stratus', 'stratus', 'puff', 'puff', 'turm', 'turm', 'kette', 'kette'];

const big = (lobes, ids) => [...ids].sort((a, b) => lobes[b].vol - lobes[a].vol);
const cen = (lobes, spec, k) => lobes[k].c.map((v, q) => v + spec.jit[k].off[q]);
function overlapFix(lobes, spec, primId) {
  for (let pass = 0; pass < 4; pass++) for (const k of spec.keep) {
    if (k === primId) continue; const l = lobes[k], j = spec.jit[k], ci = cen(lobes, spec, k); let best = null, bd = 1e9;
    for (const o of spec.keep) { if (o === k) continue; const cj = cen(lobes, spec, o), d = Math.hypot(ci[0] - cj[0], ci[1] - cj[1], ci[2] - cj[2]); if (d < bd) { bd = d; best = { cj, o }; } }
    const lim = 0.85 * (l.rad * j.s + lobes[best.o].rad * spec.jit[best.o].s); if (bd > lim) for (let q = 0; q < 3; q++) j.off[q] += (best.cj[q] - ci[q]) * (bd - lim) / bd;
  }
}
const place = (lobes, spec, k, tgt, s) => { const l = lobes[k]; spec.keep.push(k); spec.borrowed.push(k); spec.jit[k] = { s, off: [tgt[0] - l.c[0], tgt[1] - l.c[1], tgt[2] - l.c[2]] }; };

export function makeArchSpec(lobes, i, arch, seed = 1) {
  const clouds = lobes.clouds, nC = clouds.length;
  if (arch === 'donor') { const s = makeSpec(lobes, i % nC, seed); s.arch = 'donor'; s.i = i; return s; }
  const r = mulberry(seed * 1543 + i * 389 + 11), src = (i + Math.floor(r() * nC)) % nC, base = clouds[src].slice(), others = clouds.filter((_, q) => q !== src).flat();
  const spec = { i, seed, src, arch, keep: [], borrowed: [], sx: 1, sy: 1, sz: 1, mirror: r() < 0.5, jit: {}, bellyY: Math.min(...base.map(k => lobes[k].bottom)) };
  const jitter = (k, m = 0.12) => { const l = lobes[k], a = r() * 6.2832, mm = m * l.rad; spec.jit[k] = { s: 1 + (r() - 0.5) * 0.22, off: [Math.cos(a) * mm, (r() - 0.4) * mm * 0.6, Math.sin(a) * mm * 0.6] }; };
  const take = ids => ids.forEach(k => { spec.keep.push(k); jitter(k); });
  const pick = () => others.splice(Math.floor(r() * others.length), 1)[0];
  if (arch === 'puff') {
    const bb = big(lobes, base), core = bb[0], near = base.filter(k => k !== core).sort((a, b) => Math.hypot(...lobes[a].c.map((v, q) => v - lobes[core].c[q])) - Math.hypot(...lobes[b].c.map((v, q) => v - lobes[core].c[q])));
    take([core, ...near.slice(0, 2 + Math.floor(r() * 2))]); spec.sx = 0.95 + r() * 0.15; spec.sy = 0.95 + r() * 0.2; spec.sz = 0.9 + r() * 0.15;
  } else {
    take(base);
    const prim = lobes[big(lobes, base)[0]], top = Math.max(...base.map(k => lobes[k].c[1] + lobes[k].half[1])), xs = base.map(k => lobes[k].c[0]), xMin = Math.min(...xs), xMax = Math.max(...xs);
    if (arch === 'kumulus') { for (let q = 0; q < 2; q++) { const k = pick(), l = lobes[k], s = 0.6 + r() * 0.2, side = q ? -1 : 1; place(lobes, spec, k, [prim.c[0] + side * prim.rad * (0.35 + r() * 0.3), top - l.rad * s * 0.55, prim.c[2] + (r() - 0.5) * prim.rad * 0.4], s); }
      spec.sx = 0.95 + r() * 0.1; spec.sy = 1.0 + r() * 0.1; spec.sz = 0.9 + r() * 0.1; }
    if (arch === 'stratus') { const n = 2 + Math.floor(r() * 2), dir = r() < 0.5 ? -1 : 1; let x = dir > 0 ? xMax : xMin;
      for (let q = 0; q < n; q++) { const k = pick(), l = lobes[k], s = 0.7 + r() * 0.25; x += dir * l.rad * s * 1.1; place(lobes, spec, k, [x, spec.bellyY + l.half[1] * s * 0.9, prim.c[2] + (r() - 0.5) * prim.rad * 0.3], s); }
      spec.sx = 1.25 + r() * 0.2; spec.sy = 0.62 + r() * 0.1; spec.sz = 0.85 + r() * 0.1; }
    if (arch === 'turm') { /* Blumenkohl: eine zweite Lage aus 3 Lappen auf der Krone, seitlich versetzt, dazu eine Kuppe — kein Schneemann */ const ring = []; for (let q = 0; q < 3; q++) { const k = pick(), l = lobes[k], s = 0.72 + r() * 0.12, a = q * 2.1 + r() * 0.6; ring.push(l.rad * s); place(lobes, spec, k, [prim.c[0] + Math.cos(a) * prim.rad * 0.55, top - l.rad * s * 0.35, prim.c[2] + Math.sin(a) * prim.rad * 0.35], s); }
      if (others.length) { const k = pick(), l = lobes[k], s = 0.6; place(lobes, spec, k, [prim.c[0] + (r() - 0.5) * prim.rad * 0.3, top + Math.max(...ring) * 0.45, prim.c[2]], s); }
      spec.sx = 0.92 + r() * 0.08; spec.sy = 1.05 + r() * 0.1; spec.sz = 0.9 + r() * 0.1; }
    if (arch === 'kette') { const src2 = (src + 1) % nC, b2 = clouds[src2], c2 = b2.map(k => lobes[k].c), cx2 = c2.reduce((a, c) => a + c[0], 0) / c2.length, cy2 = Math.min(...b2.map(k => lobes[k].bottom)), cz2 = c2.reduce((a, c) => a + c[2], 0) / c2.length;
      const sh = [xMax + (xMax - xMin) * 0.35 - (Math.min(...c2.map(c => c[0])) - cx2) * 0.8 - cx2, spec.bellyY - cy2, prim.c[2] - cz2];
      for (const k of b2) { const l = lobes[k], s = 0.8; place(lobes, spec, k, [l.c[0] + sh[0], l.c[1] + sh[1], l.c[2] + sh[2]], s); }
      spec.sx = 1.0 + r() * 0.1; spec.sy = 0.85 + r() * 0.1; spec.sz = 0.9 + r() * 0.1; }
    overlapFix(lobes, spec, prim.id);
  }
  return spec;
}

export const CLAY_PARAMS_V3 = { creaseAO: 0.32 };
export function buildFamily(THREE, lobes, { seed = 1, ao = 1, params = CLAY_PARAMS_V3, plan = PLAN } = {}) {
  const variants = plan.map((arch, i) => { const spec = makeArchSpec(lobes, i, arch, seed), v = V2.buildVariant(THREE, lobes, spec, { ao, params }); v.arch = arch; return v; });
  return { version: FAMILY_VERSION, seed, ao, params: { ...V2.CLAY_PARAMS, ...params }, variants, lobes, donor: DONOR, plan,
    totals: { geometries: variants.length * 3, trisNear: variants.reduce((a, v) => a + v.tris[0], 0), trisMid: variants.reduce((a, v) => a + v.tris[1], 0), trisFar: variants.reduce((a, v) => a + v.tris[2], 0) },
    dispose() { for (const v of variants) v.geom.forEach(g => g.dispose()); } };
}
