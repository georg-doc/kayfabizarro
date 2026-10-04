/* KFB · SKY1 · Wolken-Familie v2 (01.10., Georg: »die clouds sind noch zu eckig gerendert, und der claymation style fehlt«)
 * Befund an v1 (gemessen): near = die 18 Donor-Schalen als getrennte Hüllen, je 192 △ (ein 12×8-Ellipsoid). Die Vorstufe lief mit maxEdge 0,001 / 1 Stufe / 4 Iterationen,
 *   rundete also kaum; die Hüllen durchdringen sich, jede Schnittkante ist eine harte Falte, und alles Innere wird trotzdem gezeichnet (Überzeichnung = die Bildzeit, die
 *   mit der BILDFLÄCHE statt mit der Anzahl wuchs). Das Material lief mit QUIET (Abdruck 0,3 · Druckstelle 0 · Kerbe 0) — die Knete war abgeschaltet.
 * v2 · Form: dieselben 18 Donor-Lappen (Lage, Achsen, Halbachsen aus v1.makeSpec, unverändert) werden als EIN geschlossenes Knetstück gebaut:
 *   Abstandsfeld je Lappen-Ellipsoid → weiche Vereinigung (smin, Kehle zwischen den Lappen) → flach gedrückte Unterseite (wie auf den Tisch gesetzt) → tieffrequente
 *   Beulen (Saat je Variante) → Surface Nets → Newton-Projektion auf die Fläche → Normale = Feldgradient (keine Facetten). Kein generischer Kugelhaufen: jedes Volumen ist ein Donor-Lappen.
 *   Ein Netz je LOD, alle drei aus DEMSELBEN Feld (gleiche Silhouette), keine inneren Flächen.
 * v2 · Oberfläche: K2-Material (clay-material.v10, das HX1 schon nutzt) mit dem Profil `cloud` aus clay-profiles.v2 UNGEDÄMPFT (SSOT: Profil je Familie), Handmaß im Wolkenmaß.
 * v2 · Kontakt: Kehlen-AO aus dem Feld selbst (wie tief die Vereinigung unter dem nächsten Einzellappen liegt) + weiche Unterseite — keine hellen Nähte zwischen Lappen.
 * Status nach SSOT: Kandidat (TUNE), A/B gegen den unveränderten Donor in E0. Der Donor bleibt Quelle, kein Golden Sample. */
import * as V1 from './cloud-family.v1.js';
import * as C from '../lab-clay/clay-material.v10.js';
import { TOOLMIX } from '../lab-clay/clay-toolmix.v1.js';
export { DONOR, loadDonor, analyseLobes, makeSpec, mulberry, scatterClouds, createCloudField, makeClayBase, gitBlobSha } from './cloud-family.v1.js';
export const FAMILY_VERSION = 'kfb.sky.cloud-family/2-clay';
export const CLAY_PARAMS = { k: 0.022, flat: 0.07, flatK: 0.035, lump: 0.011, lumpF: 7.5, cells: [56, 24, 12], creaseAO: 0.5 };

function h3(x, y, z) { let h = (x * 374761393 + y * 668265263 + z * 1274126177) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; }
function vn3(x, y, z) {
  const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z), fx = x - xi, fy = y - yi, fz = z - zi, u = fx * fx * (3 - 2 * fx), v = fy * fy * (3 - 2 * fy), w = fz * fz * (3 - 2 * fz), L = (a, b, t) => a + (b - a) * t;
  return L(L(L(h3(xi, yi, zi), h3(xi + 1, yi, zi), u), L(h3(xi, yi + 1, zi), h3(xi + 1, yi + 1, zi), u), v), L(L(h3(xi, yi, zi + 1), h3(xi + 1, yi, zi + 1), u), L(h3(xi, yi + 1, zi + 1), h3(xi + 1, yi + 1, zi + 1), u), v), w);
}
const inv3 = m => { const [a, b, c, d, e, f, g, h, i] = m, A = e * i - f * h, B = -(d * i - f * g), Cc = d * h - e * g, det = a * A + b * B + c * Cc;
  return [A / det, -(b * i - c * h) / det, (b * f - c * e) / det, B / det, (a * i - c * g) / det, -(a * f - c * d) / det, Cc / det, -(a * h - b * g) / det, (a * e - b * d) / det]; };
const mv = (m, x, y, z) => [m[0] * x + m[1] * y + m[2] * z, m[3] * x + m[4] * y + m[5] * z, m[6] * x + m[7] * y + m[8] * z];
const mtv = (m, x, y, z) => [m[0] * x + m[3] * y + m[6] * z, m[1] * x + m[4] * y + m[7] * z, m[2] * x + m[5] * y + m[8] * z];

/* Lappen der Variante als Ellipsoide: E = Spiegel/Squash · s_j · [ax_i · half_i] (Spalten), Mitte = S·(c + off). Danach zentriert und auf Breite 1 normiert (wie v1). */
export function lobeEllipsoids(lobes, spec) {
  const S = [spec.sx * (spec.mirror ? -1 : 1), spec.sy, spec.sz], out = [];
  for (const k of spec.keep) {
    const l = lobes[k], j = spec.jit[k], E = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (let r = 0; r < 3; r++) for (let q = 0; q < 3; q++) E[r * 3 + q] = S[r] * j.s * l.ax[q][r] * l.half[q];
    out.push({ id: k, c: [S[0] * (l.c[0] + j.off[0]), S[1] * (l.c[1] + j.off[1]), S[2] * (l.c[2] + j.off[2])], E });
  }
  /* Unterseite wie v1: kein Lappen tiefer als der tiefste Punkt der Quell-Wolke */
  const lim = spec.bellyY * spec.sy;
  for (const e of out) { const ext = Math.hypot(e.E[3], e.E[4], e.E[5]); if (e.c[1] - ext < lim) e.c[1] = lim + ext; }
  const bx = [1e9, -1e9, 1e9, -1e9, 1e9, -1e9];
  for (const e of out) for (let r = 0; r < 3; r++) { const ext = Math.hypot(e.E[r * 3], e.E[r * 3 + 1], e.E[r * 3 + 2]); bx[r * 2] = Math.min(bx[r * 2], e.c[r] - ext); bx[r * 2 + 1] = Math.max(bx[r * 2 + 1], e.c[r] + ext); }
  const cx = (bx[0] + bx[1]) / 2, cy = (bx[2] + bx[3]) / 2, cz = (bx[4] + bx[5]) / 2, ns = 1 / Math.max(bx[1] - bx[0], bx[5] - bx[4]);
  for (const e of out) { e.c = [(e.c[0] - cx) * ns, (e.c[1] - cy) * ns, (e.c[2] - cz) * ns]; e.E = e.E.map(v => v * ns); e.Ei = inv3(e.E); }
  return { list: out, box: [(bx[0] - cx) * ns, (bx[1] - cx) * ns, (bx[2] - cy) * ns, (bx[3] - cy) * ns, (bx[4] - cz) * ns, (bx[5] - cz) * ns] };
}

/* Abstandsfeld: Ellipsoid-Näherung erster Ordnung d = (|q|−1)·|q| / |E⁻ᵀq|, polynomiales smin, Tisch-Ebene, Beulen */
export function makeField(ell, o) {
  const { list, box } = ell, k = o.k, yFlat = box[2] + o.flat * (box[3] - box[2]), lumpA = o.lump, f = o.lumpF, sd = (o.seed || 1) * 7.31;
  const one = (e, x, y, z) => { const q = mv(e.Ei, x - e.c[0], y - e.c[1], z - e.c[2]), L = Math.hypot(q[0], q[1], q[2]) || 1e-6, g = mtv(e.Ei, q[0], q[1], q[2]), G = Math.hypot(g[0], g[1], g[2]) || 1e-6; return (L - 1) * L / G; };
  const field = (x, y, z, info) => {
    let d = 1e9, dmin = 1e9;
    for (const e of list) { const di = one(e, x, y, z); if (di < dmin) dmin = di; const h = Math.max(k - Math.abs(d - di), 0) / k; d = Math.min(d, di) - h * h * k * 0.25; }
    const pl = yFlat - y, h2 = Math.max(o.flatK - Math.abs(d - pl), 0) / o.flatK; d = Math.max(d, pl) + h2 * h2 * o.flatK * 0.25;
    d += lumpA * ((vn3(x * f + sd, y * f, z * f) - 0.5) + 0.5 * (vn3(x * f * 2.3, y * f * 2.3 + sd, z * f * 2.3) - 0.5));
    if (info) { info.crease = Math.max(0, Math.min(1, (dmin - d) / (k * 0.22))); info.yFlat = yFlat; }
    return d;
  };
  return field;
}

/* Surface Nets über das Feld (eine Zelle = 1/cells Wolkenbreite), dann Newton auf die Fläche, Normale = Gradient */
export function polygonize(THREE, field, box, cells, ao = 1, creaseAO = 0.5) {
  const h = 1 / cells, pad = 3 * h, x0 = box[0] - pad, y0 = box[2] - pad, z0 = box[4] - pad;
  const nx = Math.ceil((box[1] - box[0] + 2 * pad) / h) + 1, ny = Math.ceil((box[3] - box[2] + 2 * pad) / h) + 1, nz = Math.ceil((box[5] - box[4] + 2 * pad) / h) + 1;
  const F = new Float32Array(nx * ny * nz), I = (i, j, k) => i + nx * (j + ny * k);
  for (let k = 0; k < nz; k++) for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) F[I(i, j, k)] = field(x0 + i * h, y0 + j * h, z0 + k * h);
  const vid = new Int32Array(nx * ny * nz).fill(-1), P = [];
  const E = [[0, 1], [2, 3], [4, 5], [6, 7], [0, 2], [1, 3], [4, 6], [5, 7], [0, 4], [1, 5], [2, 6], [3, 7]], cOff = [[0, 0, 0], [1, 0, 0], [0, 1, 0], [1, 1, 0], [0, 0, 1], [1, 0, 1], [0, 1, 1], [1, 1, 1]];
  const v8 = new Float32Array(8);
  for (let k = 0; k < nz - 1; k++) for (let j = 0; j < ny - 1; j++) for (let i = 0; i < nx - 1; i++) {
    let m = 0; for (let c = 0; c < 8; c++) { v8[c] = F[I(i + cOff[c][0], j + cOff[c][1], k + cOff[c][2])]; if (v8[c] < 0) m |= 1 << c; }
    if (m === 0 || m === 255) continue;
    let sx = 0, sy = 0, sz = 0, n = 0;
    for (const [a, b] of E) { const fa = v8[a], fb = v8[b]; if ((fa < 0) === (fb < 0)) continue; const t = fa / (fa - fb), A = cOff[a], B = cOff[b]; sx += A[0] + (B[0] - A[0]) * t; sy += A[1] + (B[1] - A[1]) * t; sz += A[2] + (B[2] - A[2]) * t; n++; }
    vid[I(i, j, k)] = P.length / 3; P.push(x0 + (i + sx / n) * h, y0 + (j + sy / n) * h, z0 + (k + sz / n) * h);
  }
  const idx = [];
  const quad = (a, b, c, d, flip) => { if (a < 0 || b < 0 || c < 0 || d < 0) return; if (flip) idx.push(a, b, c, a, c, d); else idx.push(a, c, b, a, d, c); };
  for (let k = 1; k < nz - 1; k++) for (let j = 1; j < ny - 1; j++) for (let i = 1; i < nx - 1; i++) {
    const f0 = F[I(i, j, k)] < 0;
    if (f0 !== (F[I(i + 1, j, k)] < 0)) quad(vid[I(i, j - 1, k - 1)], vid[I(i, j, k - 1)], vid[I(i, j, k)], vid[I(i, j - 1, k)], f0);
    if (f0 !== (F[I(i, j + 1, k)] < 0)) quad(vid[I(i - 1, j, k - 1)], vid[I(i - 1, j, k)], vid[I(i, j, k)], vid[I(i, j, k - 1)], f0);
    if (f0 !== (F[I(i, j, k + 1)] < 0)) quad(vid[I(i - 1, j - 1, k)], vid[I(i, j - 1, k)], vid[I(i, j, k)], vid[I(i - 1, j, k)], f0);
  }
  const nv = P.length / 3, N = new Float32Array(nv * 3), Cc = new Float32Array(nv * 3), e = h * 0.5, info = {};
  let yMin = 1e9, yMax = -1e9;
  const grad = (x, y, z) => [field(x + e, y, z) - field(x - e, y, z), field(x, y + e, z) - field(x, y - e, z), field(x, y, z + e) - field(x, y, z - e)];
  for (let v = 0; v < nv; v++) {
    let x = P[v * 3], y = P[v * 3 + 1], z = P[v * 3 + 2];
    for (let it = 0; it < 2; it++) { const d = field(x, y, z), g = grad(x, y, z), gg = g[0] * g[0] + g[1] * g[1] + g[2] * g[2] || 1e-9, s = d * 2 * e / gg; x -= g[0] * s; y -= g[1] * s; z -= g[2] * s; }
    P[v * 3] = x; P[v * 3 + 1] = y; P[v * 3 + 2] = z; yMin = Math.min(yMin, y); yMax = Math.max(yMax, y);
    const g = grad(x, y, z), l = Math.hypot(g[0], g[1], g[2]) || 1; N[v * 3] = g[0] / l; N[v * 3 + 1] = g[1] / l; N[v * 3 + 2] = g[2] / l;
  }
  /* Umlaufsinn gegen die Feldnormale prüfen (statt ihn zu behaupten) und notfalls drehen */
  let dot = 0; for (let t = 0; t < idx.length; t += 3) { const a = idx[t] * 3, b = idx[t + 1] * 3, c = idx[t + 2] * 3, ux = P[b] - P[a], uy = P[b + 1] - P[a + 1], uz = P[b + 2] - P[a + 2], vx = P[c] - P[a], vy = P[c + 1] - P[a + 1], vz = P[c + 2] - P[a + 2];
    dot += (uy * vz - uz * vy) * N[a] + (uz * vx - ux * vz) * N[a + 1] + (ux * vy - uy * vx) * N[a + 2]; }
  if (dot < 0) for (let t = 0; t < idx.length; t += 3) { const s = idx[t + 1]; idx[t + 1] = idx[t + 2]; idx[t + 2] = s; }
  const H = yMax - yMin || 1, f01 = (x, a, b) => Math.min(1, Math.max(0, (x - a) / (b - a)));
  for (let v = 0; v < nv; v++) { field(P[v * 3], P[v * 3 + 1], P[v * 3 + 2], info); const kk = (1 - ao * creaseAO * info.crease) * (1 - ao * 0.2 * (1 - f01(P[v * 3 + 1], yMin, yMin + 0.4 * H))); Cc[v * 3] = Cc[v * 3 + 1] = Cc[v * 3 + 2] = kk; }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(P), 3)); g.setAttribute('normal', new THREE.BufferAttribute(N, 3)); g.setAttribute('color', new THREE.BufferAttribute(Cc, 3));
  g.setIndex(nv > 65535 ? new THREE.Uint32BufferAttribute(idx, 1) : new THREE.Uint16BufferAttribute(idx, 1)); g.computeBoundingBox(); g.computeBoundingSphere();
  return { geometry: g, grid: [nx, ny, nz], tris: idx.length / 3, verts: nv };
}

export function buildVariant(THREE, lobes, spec, o = {}) {
  const ao = o.ao ?? 1, prm = { ...CLAY_PARAMS, ...(o.params || {}), seed: spec.seed * 31 + spec.i + 1 }, t0 = performance.now();
  const ell = lobeEllipsoids(lobes, spec), field = makeField(ell, prm);
  const lods = prm.cells.map(c => polygonize(THREE, field, ell.box, c, ao, prm.creaseAO)), geom = lods.map(l => l.geometry);
  geom[0].computeBoundingBox(); const bb = geom[0].boundingBox, sz = bb.getSize(new THREE.Vector3());
  return { id: spec.i, spec, lobes: spec.keep.length, geom, tris: lods.map(l => l.tris), grids: lods.map(l => l.grid.join('×')), soften: 'Feld · smin k ' + prm.k + ' · Tisch ' + prm.flat + ' · Beulen ' + prm.lump + ' · ' + Math.round(performance.now() - t0) + ' ms',
    bbox: { min: bb.min.toArray(), max: bb.max.toArray(), size: sz.toArray() }, width: Math.max(sz.x, sz.z), parts: ell.list.map(e => ({ c: e.c })) };
}

export function buildFamily(THREE, lobes, { count = 6, seed = 1, ao = 1, params = {} } = {}) {
  const variants = Array.from({ length: count }, (_, i) => buildVariant(THREE, lobes, V1.makeSpec(lobes, i, seed), { ao, params }));
  return { version: FAMILY_VERSION, seed, ao, params: { ...CLAY_PARAMS, ...params }, variants, lobes, donor: V1.DONOR,
    totals: { geometries: variants.length * 3, trisNear: variants.reduce((a, v) => a + v.tris[0], 0), trisMid: variants.reduce((a, v) => a + v.tris[1], 0), trisFar: variants.reduce((a, v) => a + v.tris[2], 0) },
    dispose() { for (const v of variants) v.geom.forEach(g => g.dispose()); } };
}

/* Handmaß im Wolkenmaß: Golden-Verhältnis Hand : Kachel : Abdruck = 0,5 : 1,6 : 4,5 (K1/H0), umgerechnet auf Objektbreite 1 */
export const CLOUD_HAND = { hand: 0.2, tile: 0.64, print: 1.8 };
export function makeCloudMaterial(THREE, baseU, o = {}) {
  const h = { ...CLOUD_HAND, ...o }, U = { ...baseU, uClayHand: { value: h.hand }, uClayTile: { value: h.tile }, uClayPrintTile: { value: h.print }, uClayStroke: { value: 1.0 }, uClayPrintK: { value: 0.55 }, uClayMottle: { value: 0.06 } };
  const profile = { ...C.PROFILES.cloud, tools: TOOLMIX.cloud };
  const m = C.makeClayMaterial(THREE, U, { src: new THREE.MeshStandardMaterial({ color: o.color || '#f3ead8', vertexColors: true }), profile });
  m.name = 'kfb-cloud-clay-v2'; return m;
}
