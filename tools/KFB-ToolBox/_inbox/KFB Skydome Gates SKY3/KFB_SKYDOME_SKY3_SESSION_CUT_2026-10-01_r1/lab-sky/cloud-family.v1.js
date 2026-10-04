/* KFB · SKY1 · Wolken-Familie v1 (01.10.)
 * Donor: media/3D_Assets/KFB/Clouds by Jarlan Perez - b3Kia9N2fS2.glb · Git-Blob acd9d653f31f249d0bcf11a8b6311594a9d6e153 · 201 576 B (unverändert, per SHA-1 geprüft).
 * Befund am Donor (gemessen, nicht gelesen): 1 Node, 1 Mesh, 1 Primitive, 1 Material (mat21), 7 476 Vertices / 3 452 △, nach Positions-Verschweißung
 *   GENAU 18 getrennte Schalen (16 × 192 △, 2 × 190 △), je ein gestauchtes Ellipsoid, untereinander überlappend. Die 18 Schalen SIND die Lappen.
 * Familie: begrenzte Rekombination dieser 18 Lappen — Auswahl, Skalierung je Lappen, Lappen-Versatz (Überlappung und Unterseite bleiben), globales Squash/Stretch, Spiegelung.
 *   Variante 0 = alle 18 Lappen, Identität (der Donor selbst). Jede Variante: ein gemeinsames BufferGeometry je LOD, Instancing, stabile Saat.
 *   LOD near = die exakten Donor-Dreiecke (leicht verknetet), mid = ein Ellipsoid je Lappen (aus den umgesetzten Lappen gefittet), far = die 8 größten Lappen.
 * Kein Sphere-Pile, keine Metaballs, keine Partikel: jede Form stammt aus einer der 18 Donor-Schalen. */
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { softenGeometry } from '../lab-clay/clay-soften.v1.js';
import * as C from '../lab-clay/clay-material.v10.js';
import { makeClayRelief } from '../lab-clay/clay-relief.v2.js';
import { makeToolReliefs } from '../lab-clay/clay-relief.v5.js';
import { TOOLMIX } from '../lab-clay/clay-toolmix.v1.js';

const enc = p => p.split('/').map(encodeURIComponent).join('/');
export const DONOR = { path: 'media/3D_Assets/KFB/Clouds by Jarlan Perez - b3Kia9N2fS2.glb', blob: 'acd9d653f31f249d0bcf11a8b6311594a9d6e153', size: 201576 };
DONOR.raw = 'https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/' + enc(DONOR.path);
DONOR.local = new URL('../' + enc(DONOR.path), import.meta.url).href;
export const FAMILY_VERSION = 'kfb.sky.cloud-family/1';

export const mulberry = a => () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };

export async function gitBlobSha(u8) {
  const h = new TextEncoder().encode('blob ' + u8.length + '\0'), m = new Uint8Array(h.length + u8.length); m.set(h); m.set(u8, h.length);
  return [...new Uint8Array(await crypto.subtle.digest('SHA-1', m))].map(x => x.toString(16).padStart(2, '0')).join('');
}

/* ── E0 · den Donor laden, prüfen, inventarisieren ─────────────────────────────────────────────── */
export async function loadDonor(THREE) {
  let bytes = null, from = null, sha = null; const tried = [];
  for (const [src, url] of [['Projektkopie', DONOR.local], ['RAW @main', DONOR.raw]]) {
    try { const r = await fetch(url); if (!r.ok) { tried.push(src + ' HTTP ' + r.status); continue; }
      const b = new Uint8Array(await r.arrayBuffer()), s = await gitBlobSha(b);
      if (b.length === DONOR.size && s === DONOR.blob) { bytes = b; from = src; sha = s; break; } tried.push(src + ' Abweichung ' + b.length + ' B ' + s.slice(0, 8)); }
    catch (e) { tried.push(src + ' ' + e.message); }
  }
  if (!bytes) throw new Error('SOURCE_REQUIRED: Jarlan-Donor nicht verifizierbar (' + tried.join('; ') + ')');
  const gltf = await new Promise((res, rej) => new GLTFLoader().parse(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength), '', res, rej));
  const nodes = [], meshes = [], mats = new Set(); gltf.scene.traverse(o => { nodes.push({ name: o.name || '(Szene)', type: o.type }); if (o.isMesh) { meshes.push(o); [].concat(o.material).forEach(m => mats.add(m)); } });
  const mesh = meshes[0], geo = mesh.geometry; geo.computeBoundingBox();
  const bb = geo.boundingBox, size = bb.getSize(new THREE.Vector3());
  const lobes = analyseLobes(THREE, geo);
  const inventory = { from, tried, sha, bytes: bytes.length, nodes, meshCount: meshes.length, meshName: mesh.name, primitives: 1, materials: [...mats].map(m => m.name + ' · ' + m.type + (m.vertexColors ? ' · VC' : '') + (m.map ? ' · map' : '')),
    attributes: Object.keys(geo.attributes), verts: geo.attributes.position.count, tris: geo.index.count / 3, bbox: { min: bb.min.toArray().map(v => +v.toFixed(3)), max: bb.max.toArray().map(v => +v.toFixed(3)), size: size.toArray().map(v => +v.toFixed(3)) },
    clouds: lobes.clouds.map(a => a.length + ' Lappen: ' + a.join(',')), lobes: lobes.map(l => ({ id: l.id, tris: l.tris, c: l.c.map(v => +v.toFixed(3)), half: l.half.map(v => +v.toFixed(3)), bottom: +l.bottom.toFixed(3) })) };
  return { gltf, mesh, geometry: geo, lobes, inventory };
}

/* ── 3×3-Eigenzerlegung (Jacobi) und Ellipsoid-Fit ──────────────────────────────────────────────── */
function jacobi(a) {
  const v = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
  for (let it = 0; it < 40; it++) {
    let p = 0, q = 1, m = Math.abs(a[0][1]); if (Math.abs(a[0][2]) > m) { p = 0; q = 2; m = Math.abs(a[0][2]); } if (Math.abs(a[1][2]) > m) { p = 1; q = 2; m = Math.abs(a[1][2]); }
    if (m < 1e-14) break;
    const th = (a[q][q] - a[p][p]) / (2 * a[p][q]), t = Math.sign(th || 1) / (Math.abs(th) + Math.sqrt(th * th + 1)), c = 1 / Math.sqrt(t * t + 1), s = t * c;
    for (let k = 0; k < 3; k++) { const x = a[k][p], y = a[k][q]; a[k][p] = c * x - s * y; a[k][q] = s * x + c * y; }
    for (let k = 0; k < 3; k++) { const x = a[p][k], y = a[q][k]; a[p][k] = c * x - s * y; a[q][k] = s * x + c * y; }
    for (let k = 0; k < 3; k++) { const x = v[k][p], y = v[k][q]; v[k][p] = c * x - s * y; v[k][q] = s * x + c * y; }
  }
  return [0, 1, 2].map(j => [v[0][j], v[1][j], v[2][j]]);
}
export function fitEllipsoid(P /* Float32Array xyz */) {
  const n = P.length / 3, c = [0, 0, 0]; for (let i = 0; i < n; i++) for (let k = 0; k < 3; k++) c[k] += P[i * 3 + k] / n;
  const a = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  for (let i = 0; i < n; i++) { const d = [P[i * 3] - c[0], P[i * 3 + 1] - c[1], P[i * 3 + 2] - c[2]]; for (let r = 0; r < 3; r++) for (let s = 0; s < 3; s++) a[r][s] += d[r] * d[s] / n; }
  const ax = jacobi(a), half = [0, 0, 0];
  for (let i = 0; i < n; i++) for (let j = 0; j < 3; j++) { const d = (P[i * 3] - c[0]) * ax[j][0] + (P[i * 3 + 1] - c[1]) * ax[j][1] + (P[i * 3 + 2] - c[2]) * ax[j][2]; half[j] = Math.max(half[j], Math.abs(d)); }
  return { c, ax, half };
}

/* ── Lappen: Schalen des Donors nach Positions-Verschweißung ───────────────────────────────────── */
export function analyseLobes(THREE, geo) {
  const pos = geo.attributes.position, nor = geo.attributes.normal, idx = geo.index.array, N = pos.count;
  const id = new Map(), w = new Int32Array(N);
  for (let i = 0; i < N; i++) { const k = Math.round(pos.getX(i) * 5000) + ',' + Math.round(pos.getY(i) * 5000) + ',' + Math.round(pos.getZ(i) * 5000); if (!id.has(k)) id.set(k, id.size); w[i] = id.get(k); }
  const par = Int32Array.from({ length: id.size }, (_, i) => i), f = x => { while (par[x] !== x) { par[x] = par[par[x]]; x = par[x]; } return x; };
  for (let i = 0; i < idx.length; i += 3) { const a = f(w[idx[i]]); par[f(w[idx[i + 1]])] = a; par[f(w[idx[i + 2]])] = a; }
  const groups = new Map(); for (let i = 0; i < idx.length; i += 3) { const r = f(w[idx[i]]); (groups.get(r) || groups.set(r, []).get(r)).push(i); }
  const lobes = [...groups.values()].map(tri => {
    const P = new Float32Array(tri.length * 9), Nn = new Float32Array(tri.length * 9);
    tri.forEach((t, j) => { for (let v = 0; v < 3; v++) { const vi = idx[t + v]; for (let k = 0; k < 3; k++) { P[j * 9 + v * 3 + k] = pos.array[vi * 3 + k]; Nn[j * 9 + v * 3 + k] = nor.array[vi * 3 + k]; } } });
    const fit = fitEllipsoid(P); let bottom = 1e9; for (let i = 0; i < P.length; i += 3) bottom = Math.min(bottom, P[i + 1]);
    return { tris: tri.length, P, N: Nn, c: fit.c, ax: fit.ax, half: fit.half, bottom, rad: (fit.half[0] + fit.half[1] + fit.half[2]) / 3, vol: fit.half[0] * fit.half[1] * fit.half[2] };
  }).sort((a, b) => b.vol - a.vol);
  lobes.forEach((l, i) => l.id = i);
  /* Der Donor ist ein DREIER-PACK: die 18 Schalen bilden drei getrennte Wolken (Cluster nach Ellipsoid-Überlappung). */
  const par2 = lobes.map((_, i) => i), f2 = x => { while (par2[x] !== x) x = par2[x]; return x; };
  for (let i = 0; i < lobes.length; i++) for (let j = i + 1; j < lobes.length; j++) if (Math.hypot(lobes[i].c[0] - lobes[j].c[0], lobes[i].c[1] - lobes[j].c[1], lobes[i].c[2] - lobes[j].c[2]) < 0.9 * (lobes[i].rad + lobes[j].rad)) par2[f2(i)] = f2(j);
  const cl = new Map(); lobes.forEach((l, i) => (cl.get(f2(i)) || cl.set(f2(i), []).get(f2(i))).push(l.id));
  lobes.clouds = [...cl.values()].map(a => a.sort((x, y) => x - y));
  lobes.clouds.sort((a, b) => b.reduce((q, k) => q + lobes[k].vol, 0) - a.reduce((q, k) => q + lobes[k].vol, 0));
  lobes.clouds.forEach((a, ci) => a.forEach(k => lobes[k].cloud = ci));
  return lobes;
}

/* ── Variante: Spezifikation (deterministisch, begrenzt) ───────────────────────────────────────── */
/* V0–V2 = die drei Donor-Wolken (Identität, nur zentriert und auf Breite 1 normiert). V3–V5 = Rekombination: eine Donor-Wolke, 0–2 Lappen weniger, 1–2 geliehene Lappen einer anderen
 * Donor-Wolke als sekundäre Wölbung, Lappen-Versatz, Squash/Stretch, Spiegelung. */
export function makeSpec(lobes, i, seed = 1) {
  const r = mulberry(seed * 977 + i * 131 + 7), clouds = lobes.clouds, nC = clouds.length, src = i % nC, base = clouds[src].slice();
  const spec = { i, seed, src, keep: base.slice(), borrowed: [], sx: 1, sy: 1, sz: 1, mirror: false, jit: {}, bellyY: Math.min(...base.map(k => lobes[k].bottom)) };
  base.forEach(k => spec.jit[k] = { s: 1, off: [0, 0, 0] });
  if (i < nC) return spec;
  const core = new Set([...base].sort((a, b) => lobes[b].vol - lobes[a].vol).slice(0, 2).concat([...base].sort((a, b) => lobes[a].bottom - lobes[b].bottom).slice(0, 2)));
  const cand = base.filter(k => !core.has(k)), drop = Math.floor(r() * 3);
  for (let d = 0; d < drop && cand.length; d++) spec.keep.splice(spec.keep.indexOf(cand.splice(Math.floor(r() * cand.length), 1)[0]), 1);
  const prim = lobes[[...base].sort((a, b) => lobes[b].vol - lobes[a].vol)[0]], other = clouds[(src + 1 + Math.floor(r() * (nC - 1))) % nC].slice(), nb = 1 + Math.floor(r() * 2);
  for (let q = 0; q < nb && other.length; q++) { const k = other.splice(Math.floor(r() * other.length), 1)[0], l = lobes[k], s = 0.6 + r() * 0.3, a = r() * 6.2832, up = 0.3 + r() * 0.5, m = (prim.rad + l.rad * s) * 0.7;
    const tgt = [prim.c[0] + Math.cos(a) * m * (1 - up * 0.5), prim.c[1] + up * m, prim.c[2] + Math.sin(a) * m * 0.6]; spec.keep.push(k); spec.borrowed.push(k); spec.jit[k] = { s, off: [tgt[0] - l.c[0], tgt[1] - l.c[1], tgt[2] - l.c[2]] }; }
  spec.sx = 0.85 + r() * 0.45; spec.sy = 0.82 + r() * 0.33; spec.sz = 0.85 + r() * 0.35; spec.mirror = i % 2 === 1;
  for (const k of spec.keep) if (!spec.borrowed.includes(k)) { const l = lobes[k], a = r() * 6.2832, m = (0.08 + 0.14 * r()) * l.rad; spec.jit[k] = { s: 1 + (r() - 0.5) * 0.28, off: [Math.cos(a) * m, (r() - 0.35) * m * 0.8, Math.sin(a) * m * 0.6] }; }
  /* Überlappung bewahren: jeder Lappen (außer dem größten) berührt einen anderen mit ≥ 15 % Radiusüberlapp */
  for (let pass = 0; pass < 3; pass++) for (const k of spec.keep) {
    if (k === prim.id) continue; const l = lobes[k], j = spec.jit[k], ci = l.c.map((v, q) => v + j.off[q]); let best = null, bd = 1e9;
    for (const o of spec.keep) { if (o === k) continue; const lo = lobes[o], cj = lo.c.map((v, q) => v + spec.jit[o].off[q]), d = Math.hypot(ci[0] - cj[0], ci[1] - cj[1], ci[2] - cj[2]); if (d < bd) { bd = d; best = { cj, lo, d }; } }
    const lim = 0.85 * (l.rad * j.s + best.lo.rad * spec.jit[best.lo.id].s);
    if (bd > lim) for (let q = 0; q < 3; q++) j.off[q] += (best.cj[q] - ci[q]) * (bd - lim) / bd;
  }
  return spec;
}

/* ── Variante: Geometrien (near/mid/far) ───────────────────────────────────────────────────────── */
function transformLobe(THREE, l, spec) {
  const j = spec.jit[l.id], M = new THREE.Matrix4().makeScale(spec.sx * (spec.mirror ? -1 : 1), spec.sy, spec.sz)
    .multiply(new THREE.Matrix4().makeTranslation(l.c[0] + j.off[0], l.c[1] + j.off[1], l.c[2] + j.off[2]))
    .multiply(new THREE.Matrix4().makeScale(j.s, j.s, j.s)).multiply(new THREE.Matrix4().makeTranslation(-l.c[0], -l.c[1], -l.c[2]));
  const NM = new THREE.Matrix3().getNormalMatrix(M), P = new Float32Array(l.P.length), Nn = new Float32Array(l.N.length), v = new THREE.Vector3();
  for (let i = 0; i < P.length; i += 3) { v.set(l.P[i], l.P[i + 1], l.P[i + 2]).applyMatrix4(M); P[i] = v.x; P[i + 1] = v.y; P[i + 2] = v.z; v.set(l.N[i], l.N[i + 1], l.N[i + 2]).applyMatrix3(NM).normalize(); Nn[i] = v.x; Nn[i + 1] = v.y; Nn[i + 2] = v.z; }
  if (M.determinant() < 0) for (let t = 0; t < P.length; t += 9) for (let k = 0; k < 3; k++) { let a = P[t + 3 + k]; P[t + 3 + k] = P[t + 6 + k]; P[t + 6 + k] = a; a = Nn[t + 3 + k]; Nn[t + 3 + k] = Nn[t + 6 + k]; Nn[t + 6 + k] = a; }
  /* Unterseite: kein Lappen sinkt unter den tiefsten Punkt der Variante */
  let mn = 1e9; for (let i = 1; i < P.length; i += 3) mn = Math.min(mn, P[i]);
  const lim = spec.bellyY * spec.sy; if (mn < lim - 1e-4) for (let i = 1; i < P.length; i += 3) P[i] += lim - mn;
  return { id: l.id, P, N: Nn, fit: fitEllipsoid(P) };
}

const f01 = (x, a, b) => Math.min(1, Math.max(0, (x - a) / (b - a)));
function aoFor(parts, y0, H, ao) {
  /* Kontakt-AO: Vertices nahe der Fläche eines anderen Lappens dunkler, Unterseite weich dunkler — vermeidet helle Nähte zwischen den Lappen */
  for (const L of parts) {
    const n = L.P.length / 3, col = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const x = L.P[i * 3], y = L.P[i * 3 + 1], z = L.P[i * 3 + 2]; let k = 1;
      for (const O of parts) { if (O === L) continue; const e = O.fit; let s = 0;
        for (let q = 0; q < 3; q++) { const d = (x - e.c[0]) * e.ax[q][0] + (y - e.c[1]) * e.ax[q][1] + (z - e.c[2]) * e.ax[q][2]; s += (d / e.half[q]) ** 2; }
        s = Math.sqrt(s); if (s < 1.22) k = Math.min(k, 1 - ao * 0.30 * (1 - f01(s, 0.92, 1.22))); }
      k *= 1 - ao * 0.22 * (1 - f01(y, y0, y0 + 0.45 * H));
      col[i * 3] = col[i * 3 + 1] = col[i * 3 + 2] = k;
    }
    L.C = col;
  }
}
const cat = (parts, key) => { const n = parts.reduce((a, p) => a + p[key].length, 0), o = new Float32Array(n); let q = 0; for (const p of parts) { o.set(p[key], q); q += p[key].length; } return o; };
function mkGeo(THREE, P, Nn, Cc) {
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(P, 3)); g.setAttribute('normal', new THREE.BufferAttribute(Nn, 3)); g.setAttribute('color', new THREE.BufferAttribute(Cc, 3));
  g.setIndex(Array.from({ length: P.length / 3 }, (_, i) => i)); g.computeBoundingBox(); g.computeBoundingSphere(); return g;
}
const triCount = g => (g.index ? g.index.count : g.attributes.position.count) / 3;

export function buildVariant(THREE, lobes, spec, o = {}) {
  const ao = o.ao ?? 1, parts = spec.keep.map(k => transformLobe(THREE, lobes[k], spec));
  /* zentrieren und auf Breite 1 normieren (Instanz-Maßstab trägt die Wolkengröße) */
  const bx = [1e9, -1e9, 1e9, -1e9, 1e9, -1e9]; for (const p of parts) for (let i = 0; i < p.P.length; i += 3) for (let k = 0; k < 3; k++) { const v = p.P[i + k]; bx[k * 2] = Math.min(bx[k * 2], v); bx[k * 2 + 1] = Math.max(bx[k * 2 + 1], v); }
  const cx = (bx[0] + bx[1]) / 2, cy = (bx[2] + bx[3]) / 2, cz = (bx[4] + bx[5]) / 2, ns = 1 / Math.max(bx[1] - bx[0], bx[5] - bx[4]);
  for (const p of parts) { for (let i = 0; i < p.P.length; i += 3) { p.P[i] = (p.P[i] - cx) * ns; p.P[i + 1] = (p.P[i + 1] - cy) * ns; p.P[i + 2] = (p.P[i + 2] - cz) * ns; } p.fit = fitEllipsoid(p.P); }
  const mn = (bx[2] - cy) * ns, mx = (bx[3] - cy) * ns;
  aoFor(parts, mn, mx - mn, ao);
  /* near: exakte Donor-Dreiecke der gewählten Lappen, danach K1-Vorstufe (clay-soften) */
  let near = mkGeo(THREE, cat(parts, 'P'), cat(parts, 'N'), cat(parts, 'C')), softInfo = 'aus';
  if (o.soften !== false) { try { const r = softenGeometry(THREE, near, { maxEdge: 0.001, relative: false, maxLevels: 1, iters: 4, lump: 0.006, maxTris: 14000, seed: spec.seed * 31 + spec.i }); if (r.geometry && !r.skipped) { near = r.geometry; softInfo = 'K1 soften ' + triCount(near) + ' △'; } else softInfo = 'übersprungen ' + (r.skipped || ''); } catch (e) { softInfo = 'Fehler ' + e.message; } }
  if (!near.attributes.color) { const n = near.attributes.position.count, c = new Float32Array(n * 3).fill(1); near.setAttribute('color', new THREE.BufferAttribute(c, 3)); }
  if (!near.index) near.setIndex(Array.from({ length: near.attributes.position.count }, (_, i) => i));
  /* mid/far: ein Ellipsoid je Lappen, Lage/Achsen/Halbachsen aus den UMGESETZTEN Donor-Lappen */
  const proxy = (list, ws, hs) => {
    const Ps = [], Ns = [], Cs = [];
    for (const p of list) { const e = p.fit, sg = new THREE.SphereGeometry(1, ws, hs).toNonIndexed(), M = new THREE.Matrix4().makeBasis(new THREE.Vector3(...e.ax[0]).multiplyScalar(e.half[0]), new THREE.Vector3(...e.ax[1]).multiplyScalar(e.half[1]), new THREE.Vector3(...e.ax[2]).multiplyScalar(e.half[2])).setPosition(...e.c);
      sg.applyMatrix4(M); const NM = new THREE.Matrix3().getNormalMatrix(M), v = new THREE.Vector3(), nn = sg.attributes.normal;
      for (let i = 0; i < nn.count; i++) { v.fromBufferAttribute(nn, i).applyMatrix3(NM).normalize(); nn.setXYZ(i, v.x, v.y, v.z); }
      if (M.determinant() < 0) { const pp = sg.attributes.position.array, na = nn.array; for (let t = 0; t < pp.length; t += 9) for (let k = 0; k < 3; k++) { let a = pp[t + 3 + k]; pp[t + 3 + k] = pp[t + 6 + k]; pp[t + 6 + k] = a; a = na[t + 3 + k]; na[t + 3 + k] = na[t + 6 + k]; na[t + 6 + k] = a; } }
      Ps.push(sg.attributes.position.array); Ns.push(nn.array); const n = sg.attributes.position.count, c = new Float32Array(n * 3); for (let i = 0; i < n; i++) { const yy = sg.attributes.position.getY(i); c[i * 3] = c[i * 3 + 1] = c[i * 3 + 2] = 1 - ao * 0.22 * (1 - f01(yy, mn, mn + 0.45 * (mx - mn))); } Cs.push(c); }
    return mkGeo(THREE, cat(Ps.map(a => ({ a })), 'a'), cat(Ns.map(a => ({ a })), 'a'), cat(Cs.map(a => ({ a })), 'a'));
  };
  const mid = proxy(parts, 12, 8), far = proxy([...parts].sort((a, b) => b.fit.half[0] * b.fit.half[1] * b.fit.half[2] - a.fit.half[0] * a.fit.half[1] * a.fit.half[2]).slice(0, 8), 8, 5);
  near.computeBoundingBox(); const bb = near.boundingBox, sz = bb.getSize(new THREE.Vector3());
  return { id: spec.i, spec, lobes: spec.keep.length, geom: [near, mid, far], tris: [triCount(near), triCount(mid), triCount(far)], soften: softInfo, bbox: { min: bb.min.toArray(), max: bb.max.toArray(), size: sz.toArray() }, width: Math.max(sz.x, sz.z), parts: parts.map(p => p.fit) };
}

export function buildFamily(THREE, lobes, { count = 6, seed = 1, ao = 1, soften = true } = {}) {
  const variants = Array.from({ length: count }, (_, i) => buildVariant(THREE, lobes, makeSpec(lobes, i, seed), { ao, soften }));
  return { version: FAMILY_VERSION, seed, ao, variants, lobes, donor: DONOR,
    totals: { geometries: variants.length * 3, trisNear: variants.reduce((a, v) => a + v.tris[0], 0), trisMid: variants.reduce((a, v) => a + v.tris[1], 0), trisFar: variants.reduce((a, v) => a + v.tris[2], 0) },
    dispose() { for (const v of variants) v.geom.forEach(g => g.dispose()); } };
}

/* ── Knete: eigene Uniformen im Wolkenmaß (Objektraum ≈ 1 Wolkenbreite), gleiche K2-Module wie HX1 ─────────── */
export async function makeClayBase(THREE, renderer) {
  const tex = d => { const t = new THREE.DataTexture(d, 1024, 1024, THREE.RGBAFormat); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.magFilter = THREE.LinearFilter; t.minFilter = THREE.LinearMipmapLinearFilter; t.generateMipmaps = true; t.anisotropy = renderer.capabilities.getMaxAnisotropy(); t.needsUpdate = true; return t; };
  const relT = tex(makeClayRelief({ size: 1024, seed: 31 }).data), tools = await makeToolReliefs({ size: 1024, seed: 41 }), U = C.makeClayUniforms(THREE, relT);
  [U.uClayToolA.value, U.uClayToolB.value, U.uClayToolC.value] = tools.maps.map(tex); U.uClayToolOn.value = 1; U.uClayLegacyStroke.value = 0; U.uClayMottle.value = 0.04;
  let printT = null; try { printT = await C.makePrintTexture(THREE, new URL('../ref/clay-joebinns/Fingerprints01_3K.png', import.meta.url).href, 2048); } catch (e) { /* ohne Abdrücke */ }
  U.uClayPrint.value = printT || relT; U.uClayPrintOn.value = printT ? 1 : 0; U.uClayMacro.value = 0.5; U.uClayLodK.value = 0.6; U.uClayStroke.value = 0.7;
  return U;
}
export const CLOUD_HAND = { hand: 0.16, tile: 0.55, print: 1.4 };
export function makeCloudMaterial(THREE, baseU, o = {}) {
  const h = { ...CLOUD_HAND, ...o }, U = { ...baseU, uClayHand: { value: h.hand }, uClayTile: { value: h.tile }, uClayPrintTile: { value: h.print } };
  const QUIET = { print: 0.3, dent: 0, gouge: 0, crack: 0, stroke: 1, facet: 0.9, crease: 0.5 };
  const profile = { ...C.PROFILES.cloud, ...QUIET, tools: TOOLMIX.cloud };
  const m = C.makeClayMaterial(THREE, U, { src: new THREE.MeshStandardMaterial({ color: o.color || '#f3ead8', vertexColors: true }), profile });
  m.name = 'kfb-cloud-clay'; return m;
}

/* ── Feld: Instancing, LOD nach Entfernung/Wolkenbreite, stabile Saat ───────────────────────────── */
export function scatterClouds({ n, center, radius, rMin = 0.35, yRange = [0, 0], scale = [1, 1], seed = 1, spacing = 0.5 }) {
  const r = mulberry(seed * 7919 + 13), out = [], V = 6;
  for (let k = 0, tries = 0; out.length < n && tries < n * 60; tries++, k++) {
    const a = (k * 2.399963) + r() * 0.8, rr = radius * (rMin + (1 - rMin) * Math.sqrt(r())), p = [center[0] + Math.cos(a) * rr, center[1] + yRange[0] + r() * (yRange[1] - yRange[0]), center[2] + Math.sin(a) * rr], s = scale[0] + r() * (scale[1] - scale[0]);
    if (out.some(o => Math.hypot(o.p[0] - p[0], o.p[2] - p[2]) < (o.s + s) * spacing)) continue;
    out.push({ p, s, yaw: r() * 6.2832, sq: [0.92 + r() * 0.16, 0.92 + r() * 0.16, 0.92 + r() * 0.16], v: Math.floor(r() * V) % V });
  }
  return out;
}
export function createCloudField({ THREE, family, material, parent, lodAt: lodAt0 = [3.2, 9] }) {
  let lodAt = lodAt0;
  const group = new THREE.Group(); group.name = 'kfb-cloud-field'; parent.add(group);
  let list = [], meshes = new Map(), counts = [0, 0, 0], last = { tris: 0, calls: 0 };
  const dummy = new THREE.Object3D(), q = new THREE.Quaternion(), up = new THREE.Vector3(0, 1, 0);
  const clear = () => { for (const m of meshes.values()) { group.remove(m); m.dispose(); } meshes = new Map(); };
  return {
    group, get count() { return list.length; }, get lodCounts() { return counts.slice(); },
    set(arr) {
      clear(); list = arr.slice();
      const per = new Map(); list.forEach(c => per.set(c.v % family.variants.length, (per.get(c.v % family.variants.length) || 0) + 1));
      for (const [v, cap] of per) for (let l = 0; l < 3; l++) { const im = new THREE.InstancedMesh(family.variants[v].geom[l], material, cap); im.frustumCulled = false; im.count = 0; im.name = 'cloud-v' + v + '-lod' + l; im.castShadow = false; im.receiveShadow = false; group.add(im); meshes.set(v + ':' + l, im); }
    },
    update(camera) {
      counts = [0, 0, 0]; const fill = new Map(); for (const k of meshes.keys()) fill.set(k, 0);
      for (const c of list) {
        const v = c.v % family.variants.length, d = Math.hypot(camera.position.x - c.p[0], camera.position.y - c.p[1], camera.position.z - c.p[2]), ratio = d / (c.s * family.variants[v].width);
        const l = ratio < lodAt[0] ? 0 : ratio < lodAt[1] ? 1 : 2, key = v + ':' + l, im = meshes.get(key), i = fill.get(key);
        q.setFromAxisAngle(up, c.yaw); dummy.position.set(...c.p); dummy.quaternion.copy(q); dummy.scale.set(c.s * c.sq[0], c.s * c.sq[1], c.s * c.sq[2]); dummy.updateMatrix();
        im.setMatrixAt(i, dummy.matrix); fill.set(key, i + 1); counts[l]++;
      }
      let tris = 0, calls = 0; for (const [k, im] of meshes) { const n = fill.get(k); im.count = n; im.visible = n > 0; im.instanceMatrix.needsUpdate = true; if (n) { calls++; tris += n * triCount(im.geometry); } }
      last = { tris, calls }; return last;
    },
    get last() { return last; }, setLod(a) { lodAt = a; },
    setTint(c) { material.color.copy(c); },
    dispose() { clear(); parent.remove(group); }
  };
}
