// V-130 Prüfbank B / V-156 (Steuerung 11.10.: freigegeben, Adapter-Weg 2, ein levelSet): the tunnel host as a REAL island body after Georg's
// Inselboden / Berginsel references (REFS_INSELBODEN IB1–IB3, REFS_COUNTRY_TUNNEL CR3; V-142, R3b, R3c):
//   · ONE cohesive clay earth mass: R2D-style blob outline, top with a ridge mountain (r2d/plan.ts mountHeight idea: bell + wandering rim),
//     Scholle v7 underside depth profile (k = (1 − h/D)^pw, KFB_TECHNIK l.28) under a near-vertical earth rim wall, soft lobes hanging down
//   · grey rock partien as FACETED lobes (soft max of random planes = rounded facets) half fused into the mass by smin — never separate balls
//     (R3b); layered plates on the portal faces (CR3 cliffs), a rock band in the Scholle wall (IB1)
//   · moss beads over the rim (IB „Moos quillt über die Kante“), snow by height (R3c: snow belongs to the island)
//   · the road reaches the portals through a cut (Voreinschnitt): its faces are rock — the portal stands in a rock face (CR3)
// Everything is ONE field → one levelSet → one closed mesh (V-136); colour = vertex colour from the field channels (no extra meshes).
// Track metres (bench scale), road along s at lat 0 / up 0; island top −0.6 (as the TC1 table). Lab = × 1.46: island ≈ 20 MC, mountain ≈ 45 lab.
import * as THREE from 'three';
import { sdPoly, type FieldGrid } from '../world/tunnel/tunnel-field';
import type { V2 } from '../world/tunnel/tunnel-insert';
import { fbm, rng, sstep, smin } from '../island/r2d/math';

const smax = (a: number, b: number, k: number) => -smin(-a, -b, k);
export type BergIn = {
  local: (x: number, y: number, z: number) => number[];        // world → [lat, up, s]
  toWorld: (lat: number, up: number, s: number) => THREE.Vector3;
  s0: number; s1: number; half: number; top: number; wall: number; H: number; size?: 'M' | 'L';
  headLoop: V2[]; blobs: { lo: number[]; hi: number[] }[]; sdBox: (l: number[], b: { lo: number[]; hi: number[] }) => number;
};
// O1 „kneten“: box blur of the field (organ-islands.v7.js blurG l.117, 1:1 in TS) — softens creases the levelSet would pinch into one edge
function blurG(G: FieldGrid, r: number, passes: number) {
  const { nx, ny, nz } = G, w = 1 / (2 * r + 1); let A = Float32Array.from(G.V), B = new Float32Array(A.length);
  const cl = (x: number, a: number, b: number) => Math.min(b, Math.max(a, x));
  const line = (src: Float32Array, dst: Float32Array, o: number, st: number, n: number) => { let s = 0; for (let t = -r; t <= r; t++) s += src[o + cl(t, 0, n - 1) * st];
    for (let t = 0; t < n; t++) { dst[o + t * st] = s * w; s += src[o + Math.min(n - 1, t + r + 1) * st] - src[o + Math.max(0, t - r) * st]; } };
  for (let p = 0; p < passes; p++) {
    for (let k = 0; k < nz; k++) for (let j = 0; j < ny; j++) line(A, B, nx * (j + ny * k), 1, nx); [A, B] = [B, A];
    for (let k = 0; k < nz; k++) for (let i = 0; i < nx; i++) line(A, B, i + nx * ny * k, nx, ny); [A, B] = [B, A];
    for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) line(A, B, i + nx * j, nx * ny, nz); [A, B] = [B, A]; }
  G.V.set(A); }
type Rock = { c: number[]; r: number; N: number[][]; off: number[]; k: number };
type Ell = { c: number[]; r: number[] };

export function buildBergField(I: BergIn) {
  const { s0, s1, H } = I, sm = (s0 + s1) / 2, Y0 = -0.6, seed = 156, SZ = I.size === 'L' ? 1.5 : 1;   // M = 20 MC (decided), L = 30 MC (comparison)
  // ---- island outline (blob ellipse, wandering rim) and top
  const CL = 7 * SZ, CS = sm, RL = 38 * SZ, RS = 46 * SZ;
  const wob = (th: number) => 1 + 0.07 * fbm(Math.cos(th) * 1.6 + 3, Math.sin(th) * 1.6 - 1, seed, 3) + 0.035 * Math.sin(5 * th + 1);
  const side = (lat: number, s: number) => { const dl = (lat - CL) / RL, ds = (s - CS) / RS, rho = Math.hypot(dl, ds), th = Math.atan2(ds, dl); return { rho: rho / wob(th), d: (rho - wob(th)) * Math.min(RL, RS) }; };
  // ridge mountain: crest 10 m right of the road, along s; Hp 31 m ≈ 45 lab (Steuerung c); a sub-peak behind; crinkled by fbm
  const Hp = 31 * SZ, ML = 6 * SZ, ROT = 0.22, aL = 28 * SZ, aS = 46 * SZ;
  const mount = (lat: number, s: number) => { const u0 = lat - ML, v0 = s - (sm + 3), u = u0 * Math.cos(ROT) - v0 * Math.sin(ROT), v = u0 * Math.sin(ROT) + v0 * Math.cos(ROT);
    const k = Math.max(0, 1 - (u / aL) ** 2 - (v / aS) ** 2), k2 = Math.max(0, 1 - ((lat - 22 * SZ) / (15 * SZ)) ** 2 - ((s - sm + 16 * SZ) / (18 * SZ)) ** 2);
    const crinkle = 1 + 0.14 * fbm(lat * 0.06 / SZ, s * 0.06 / SZ, seed + 3, 4);
    return Hp * Math.pow(k, 1.2) * crinkle + 4 * SZ * Math.abs(fbm(lat * 0.09 / SZ, s * 0.09 / SZ, seed + 5, 3)) * Math.sqrt(k) + 9 * SZ * Math.pow(k2, 1.2); };   /* ridged crinkle: crags, not a dome */
  // top: road bed −0.6 along the road, small hills elsewhere, plus the mountain
  const topAt = (lat: number, s: number) => { const hills = 0.9 * fbm(lat * 0.05, s * 0.05, seed + 7, 3) + 0.4, flat = sstep(9, 15, Math.abs(lat));
    return Y0 + hills * flat + mount(lat, s); };
  // underside: earth rim wall WD deep, then the Scholle v7 depth profile (radius fraction ρ = (1 − h/D)^pw ⇒ h = D (1 − ρ^(1/pw)))
  const WD = 9 * SZ, D = 42 * SZ, PW = 0.6;
  const botAt = (rho: number, lat: number, s: number) => Y0 - WD - D * (1 - Math.pow(Math.min(1, rho), 1 / PW)) + 1.6 * fbm(lat * 0.07, s * 0.07, seed + 9, 3);
  // ---- lobes (soft bulges hanging down + bulging out of the rim wall)
  const R = rng(seed * 7919), lobes: Ell[] = [];
  const onRim = (th: number, f = 1) => { const w = wob(th) * f; return [CL + Math.cos(th) * RL * w, CS + Math.sin(th) * RS * w]; };
  for (let i = 0; i < 22; i++) { const th = R() * Math.PI * 2, rho = 0.15 + 0.8 * Math.sqrt(R()), [la, ss] = [CL + Math.cos(th) * RL * rho * wob(th), CS + Math.sin(th) * RS * rho * wob(th)];
    const rx = (5 + 5 * R()) * SZ, ry = (6 + 6 * R()) * SZ, yb = botAt(rho, la, ss); lobes.push({ c: [la, yb + 0.3 * ry, ss], r: [rx, ry, rx * (0.8 + 0.4 * R())] }); }
  for (let i = 0; i < 14; i++) { const th = (i + R() * 0.6) / 14 * Math.PI * 2, [la, ss] = onRim(th, 0.97), r = (3.5 + 3 * R()) * SZ; lobes.push({ c: [la, Y0 - (3.5 + 6 * R()) * SZ, ss], r: [r, r * (1 + 0.5 * R()), r] }); }
  const sdEll = (p: number[], e: Ell) => { const a = (p[0] - e.c[0]) / e.r[0], b = (p[1] - e.c[1]) / e.r[1], c = (p[2] - e.c[2]) / e.r[2], k0 = Math.hypot(a, b, c), k1 = Math.hypot(a / e.r[0], b / e.r[1], c / e.r[2]); return k1 < 1e-9 ? -Math.min(...e.r) : (k0 * (k0 - 1)) / k1; };
  // ---- rocks: faceted lobes (random planes, soft max) half fused into the mass
  const rocks: Rock[] = [];
  const mkRock = (c: number[], r: number, flat = 1, nPl = 10): Rock => { const N: number[][] = [], off: number[] = [];
    for (let j = 0; j < nPl; j++) { const z = R() * 2 - 1, a = R() * Math.PI * 2, q = Math.sqrt(1 - z * z); let n = [q * Math.cos(a), z / flat, q * Math.sin(a)]; const l = Math.hypot(...n); n = n.map((x) => x / l); N.push(n); off.push(r * (0.82 + 0.3 * R()) * (Math.abs(n[1]) > 0.7 ? flat : 1)); }
    N.push([0, 1, 0], [0, -1, 0]); off.push(r * flat * 0.9, r * flat * 0.9); return { c, r, N, off, k: 0.3 * r * Math.min(1, flat * 1.5) }; };
  const sdRock = (p: number[], o: Rock) => { let d = -1e9; for (let j = 0; j < o.N.length; j++) { const n = o.N[j], e = n[0] * (p[0] - o.c[0]) + n[1] * (p[1] - o.c[1]) + n[2] * (p[2] - o.c[2]) - o.off[j]; d = d < -1e8 ? e : smax(d, e, o.k); } return d; };
  const surfN = (lat: number, s: number) => { const e = 0.6, gx = (topAt(lat + e, s) - topAt(lat - e, s)) / (2 * e), gz = (topAt(lat, s + e) - topAt(lat, s - e)) / (2 * e), l = Math.hypot(gx, 1, gz); return [-gx / l, 1 / l, -gz / l]; };
  const corridor = (lat: number, s: number) => Math.abs(lat) < I.half + I.wall + 2.5 + 0.2 * Hp + 8 && s > s0 - 40 * SZ && s < s1 + 40 * SZ;   /* clear of the cut walls: a half-cut rock left a horn */
  // mountain outcrops on the flanks (not in the road corridor)
  for (let i = 0, tries = 0; i < 22 && tries < 600; tries++) { const la = ML + (-20 + 44 * R()) * SZ, ss = sm + (-40 + 80 * R()) * SZ, m = mount(la, ss); if (m < 4 || m > Hp * 0.85 || corridor(la, ss) || side(la, ss).d > -4) continue;
    const n = surfN(la, ss), r = (3.5 + 4 * R()) * SZ, y = topAt(la, ss); rocks.push(mkRock([la - n[0] * r * 0.62, y - n[1] * r * 0.62, ss - n[2] * r * 0.62], r, 0.7)); i++; }   /* 62 % in the mass: partien, not balls (R3b) */
  // layered plates on the portal faces (CR3 cliffs): three flat plates stacked and stepped back, above and beside each portal
  for (const [sf, dir] of [[s0, -1], [s1, 1]] as [number, number][]) for (const sideL of [-1, 1]) for (let j = 0; j < 3; j++) {
    const la = sideL * (I.half + I.wall + 4 + 3 * R()) , up = I.top + I.wall + 1 + j * 2.6, ss = sf - dir * (1.5 + j * 1.2 + 0.8 * R());
    if (topAt(la, ss) < up + 1) continue; rocks.push(mkRock([la, up, ss], 4 + 1.5 * R(), 0.38, 8)); }
  // rock band in the Scholle wall (IB1) + rock partien on the underside (half embedded)
  for (let i = 0; i < 11; i++) { const th = (i + R() * 0.7) / 11 * Math.PI * 2, [la, ss] = onRim(th, 0.99); const rr = (4 + 2.5 * R()) * SZ; rocks.push(mkRock([la - Math.cos(th) * rr * 0.5, Y0 - WD - (2 + 4 * R()) * SZ, ss - Math.sin(th) * rr * 0.5], rr, 0.6)); }   /* band: half sunk into the wall */
  for (let i = 0; i < 14; i++) { const th = R() * Math.PI * 2, rho = 0.25 + 0.65 * R(), la = CL + Math.cos(th) * RL * rho, ss = CS + Math.sin(th) * RS * rho; const rr = (5 + 4 * R()) * SZ; rocks.push(mkRock([la, botAt(rho, la, ss) + rr * 0.5, ss], rr, 0.9, 16)); }   /* IB: big rounded-faceted boulders half in the earth */
  // moss over the rim (IB): clumps of 3–5 overlapping soft beads that sit on the lip and bulge over it, a few drip lower; gaps between clumps
  const moss: Ell[] = [];
  for (let i = 0; i < 26; i++) { const th = (i + R() * 0.6) / 26 * Math.PI * 2, [la0, ss0] = onRim(th, 1.0); if (Math.abs(la0) < I.half + I.wall + 3 && Math.abs(ss0 - sm) < 80 * SZ) continue;   // not where the road crosses the rim
    const n = 3 + Math.floor(R() * 3); for (let k = 0; k < n; k++) { const t2 = th + (k - n / 2) * 0.025 / SZ, [la, ss] = onRim(t2, 1.0 + 0.01 * R()), r = (1.1 + 1.0 * R()) * SZ, y = Math.max(topAt(la, ss), Y0);
      moss.push({ c: [la, y - 0.35 * r - R() * 1.2 * r, ss], r: [r * 1.3, r * (0.9 + 0.4 * R()), r * 1.3] }); }
    if (R() < 0.5) { const [la, ss] = onRim(th, 1.0), r2 = 0.9 * SZ; moss.push({ c: [la, Y0 - 2.4 * SZ, ss], r: [r2, r2 * 1.5, r2] }); } }
  // Voreinschnitt: the road cuts into the mountain up to each portal face; faces lean back 0.2 : 1, craggy (fbm on the face, rock); its floor lies
  // 0.2 under the flat top (a floor just over the top left a sliver that pinched into non-manifold edges)
  const Wc = I.half + I.wall + 2.5;
  const crag = (lat: number, up: number, s: number) => 1.6 * fbm(lat * 0.12 + up * 0.08, s * 0.12 - up * 0.1, seed + 31, 3) + 0.55 * Math.abs(Math.sin(up * 0.75 + 0.6 * fbm(lat * 0.05, s * 0.05, seed + 33, 2)));   /* craggy + layered (CR3 cliffs) */
  const sdCut = (lat: number, up: number, s: number) => { const wl = Math.abs(lat) - (Wc + 0.2 * Math.max(0, up)), fl = Y0 - 0.2 - up, c = up > 1 ? crag(lat, up, s) : 0; return Math.min(Math.max(wl + c, s - s0 + c * 0.6, fl), Math.max(wl + c, s1 - s + c * 0.6, fl)); };

  // ---- grid
  const M2 = 16 * SZ, lo = [CL - RL * 1.1 - M2, Y0 - WD - D - 14 * SZ, CS - RS * 1.1 - M2], hi = [CL + RL * 1.1 + M2, Y0 + Hp + 14 * SZ, CS + RS * 1.1 + M2];   /* rim lobes reach ≈ 1.07 R + 7: a tighter grid sliced one flat */
  const corners: THREE.Vector3[] = []; for (const a of [lo[0], hi[0]]) for (const b of [lo[1], hi[1]]) for (const c of [lo[2], hi[2]]) corners.push(I.toWorld(a, b, c));
  const bb = new THREE.Box3().setFromPoints(corners), nx = Math.ceil((bb.max.x - bb.min.x) / H) + 1, ny = Math.ceil((bb.max.y - bb.min.y) / H) + 1, nz = Math.ceil((bb.max.z - bb.min.z) / H) + 1;
  const G: FieldGrid = { V: new Float32Array(nx * ny * nz), nx, ny, nz, o: [bb.min.x, bb.min.y, bb.min.z], h: H };
  // column pass: top, bottom, side per (x, z) column (with slope normalisation for the height terms)
  const nC = nx * nz, cT = new Float32Array(nC), cKT = new Float32Array(nC), cB = new Float32Array(nC), cKB = new Float32Array(nC), cS = new Float32Array(nC);
  for (let k = 0; k < nz; k++) for (let i = 0; i < nx; i++) { const [lat, , s] = I.local(G.o[0] + i * H, 0, G.o[2] + k * H), sd = side(lat, s), e = 0.4, c = i + nx * k;
    const t0 = topAt(lat, s), gl = (topAt(lat + e, s) - topAt(lat - e, s)) / (2 * e), gs = (topAt(lat, s + e) - topAt(lat, s - e)) / (2 * e);
    const rr = (l: number, ss: number) => side(l, ss).rho, b0 = botAt(sd.rho, lat, s), bl = (botAt(rr(lat + e, s), lat + e, s) - botAt(rr(lat - e, s), lat - e, s)) / (2 * e), bs = (botAt(rr(lat, s + e), lat, s + e) - botAt(rr(lat, s - e), lat, s - e)) / (2 * e);
    cT[c] = t0; cKT[c] = 1 / Math.sqrt(1 + gl * gl + gs * gs); cB[c] = b0; cKB[c] = 1 / Math.sqrt(1 + bl * bl + bs * bs); cS[c] = sd.d; }
  for (let k = 0; k < nz; k++) for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) { const l = I.local(G.o[0] + i * H, G.o[1] + j * H, G.o[2] + k * H), up = l[1], c = i + nx * k;
    let v = smax((up - cT[c]) * cKT[c], (cB[c] - up) * cKB[c], 2.0); v = smax(v, cS[c], 3.0);   // top ∩ bottom, rounded rim (earth rounds into the top)
    G.V[i + nx * (j + ny * k)] = v; }
  // local blobs: only the cells in their box (+ margin), smin into the mass
  const box = (c: number[], r: number) => { const ps = [] as THREE.Vector3[]; for (const a of [-1, 1]) for (const b2 of [-1, 1]) for (const d of [-1, 1]) ps.push(I.toWorld(c[0] + a * r, c[1] + b2 * r, c[2] + d * r)); const B = new THREE.Box3().setFromPoints(ps);
    return [Math.max(0, Math.floor((B.min.x - G.o[0]) / H)), Math.min(nx - 1, Math.ceil((B.max.x - G.o[0]) / H)), Math.max(0, Math.floor((B.min.y - G.o[1]) / H)), Math.min(ny - 1, Math.ceil((B.max.y - G.o[1]) / H)), Math.max(0, Math.floor((B.min.z - G.o[2]) / H)), Math.min(nz - 1, Math.ceil((B.max.z - G.o[2]) / H))]; };
  const apply = (c: number[], r: number, f: (p: number[]) => number, op: (v: number, d: number) => number) => { const [i0, i1, j0, j1, k0, k1] = box(c, r);
    for (let k = k0; k <= k1; k++) for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) { const q = i + nx * (j + ny * k), p = I.local(G.o[0] + i * H, G.o[1] + j * H, G.o[2] + k * H); G.V[q] = op(G.V[q], f(p)); } };
  for (const e of lobes) apply(e.c, Math.max(...e.r) + 4, (p) => sdEll(p, e), (v, d) => smin(v, d, 3.0));
  for (const o of rocks) apply(o.c, o.r * 1.4 + 2.5, (p) => sdRock(p, o), (v, d) => smin(v, d, 0.35 * o.r));   /* wide fillet: the earth swells around the rock */
  for (const e of moss) apply(e.c, Math.max(...e.r) + 1.5, (p) => sdEll(p, e), (v, d) => smin(v, d, 0.8));
  // the cut (after the unions: it also trims rock in the road corridor), then the Knet-Fuß of the portals (head plate + stone bases, as bank A)
  for (let k = 0; k < nz; k++) for (let i = 0; i < nx; i++) { const [lat, , s] = I.local(G.o[0] + i * H, 0, G.o[2] + k * H); if (Math.abs(lat) > Wc + 0.2 * (Hp + 4) + 4) continue;
    for (let j = 0; j < ny; j++) { const q = i + nx * (j + ny * k), l = I.local(G.o[0] + i * H, G.o[1] + j * H, G.o[2] + k * H);
      let v = smax(G.V[q], -sdCut(l[0], l[1], l[2]), 1.2);
      if (Math.abs(l[2] - s0) < 5 || Math.abs(l[2] - s1) < 5) { for (const [fa, fb] of [[s0, s0 + 3], [s1 - 3, s1]]) { const dh = Math.max(sdPoly(I.headLoop, l[0], l[1]), Math.max(fa - l[2], l[2] - fb)); if (dh < 1.2) v = smin(v, dh, 0.6); }
        for (const b of I.blobs) { const db = I.sdBox(l, b); if (db < 0.8) v = smin(v, db, 0.35); } }
      G.V[q] = v; } }
  blurG(G, 1, 2);   // kneten (two passes, ±1 cell: the rock–lobe creases in the rim wall still pinched after one)
  // border stays outside (closed body)
  for (let k = 0; k < nz; k++) for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) if (i === 0 || j === 0 || k === 0 || i === nx - 1 || j === ny - 1 || k === nz - 1) { const q = i + nx * (j + ny * k); G.V[q] = Math.max(G.V[q], H); }

  // ---- colour per vertex (field channels) — palette from Georg's references (IB rust-ochre earth, grey rock, moss, CR3 grass, snow)
  const C = { earth: new THREE.Color('#c47b3c'), earthDk: new THREE.Color('#9a5a2c'), rock: new THREE.Color('#b8b1a6'), rockDk: new THREE.Color('#9a948a'), moss: new THREE.Color('#93b53a'), grass: new THREE.Color('#9fbd3e'), sand: new THREE.Color('#d2a35c'), snow: new THREE.Color('#f1f3f5') };
  const tmp = new THREE.Color();
  const colourAt = (x: number, y: number, z: number, n: THREE.Vector3, out: THREE.Color) => { const p = I.local(x, y, z), [lat, up, s] = p, nu = n.dot(new THREE.Vector3(0, 1, 0));
    // earth, darker with depth, mottled
    out.copy(C.earth).lerp(C.earthDk, 0.65 * sstep(Y0 - 4, Y0 - 40, up) + 0.15 * (0.5 + 0.5 * fbm(lat * 0.2 + up * 0.1, s * 0.2, seed + 21, 2)));
    // top surface: grass with sand patches
    const t0 = topAt(lat, s), onTop = sstep(0.45, 0.7, nu) * sstep(-2.2, -0.6, up - t0);
    const mt = sstep(1.5, 5, mount(lat, s)) * sstep(-3, -0.5, up - t0);   // on the mountain skin
    if (mt > 0) { tmp.copy(C.rock).lerp(C.rockDk, 0.4 + 0.4 * fbm(lat * 0.3, s * 0.3, seed + 29, 2)); const g = sstep(0.38, 0.55, nu + 0.08 * fbm(lat * 0.15, s * 0.15, seed + 35, 2));   /* green up to ≈ 62°, rock walls steeper (CR3) */ tmp.lerp(C.grass, g); out.lerp(tmp, mt); }   // CR3: rock on steep, green on gentle
    const flatTop = onTop * (1 - mt);
    if (flatTop > 0) { tmp.copy(C.grass).lerp(C.sand, sstep(0.15, 0.4, fbm(lat * 0.08, s * 0.08, seed + 23, 3))); out.lerp(tmp, flatTop); }
    // moss at the rim lip + the beads
    const sd = side(lat, s).d; let mo = sstep(2.0, 0, Math.abs(sd)) * sstep(Y0 - 2.8, Y0 - 0.8, up); for (const e of moss) if (Math.abs(lat - e.c[0]) < 4 * SZ && Math.abs(s - e.c[2]) < 4 * SZ && Math.abs(up - e.c[1]) < 4 * SZ) mo = Math.max(mo, sstep(0.6, 0, sdEll(p, e)));
    if (mo > 0) out.lerp(C.moss, mo);
    // rock: the faceted lobes + the portal cut faces
    let ro = 0; for (const o of rocks) if (Math.abs(lat - o.c[0]) < o.r * 1.6 && Math.abs(up - o.c[1]) < o.r * 1.6 && Math.abs(s - o.c[2]) < o.r * 1.6) ro = Math.max(ro, sstep(0.8, 0.1, sdRock(p, o)));
    if (up > Y0 + 0.4) ro = Math.max(ro, sstep(0.9, 0.1, Math.abs(sdCut(lat, up, s))) * sstep(Y0 + 0.4, Y0 + 1.6, up));
    if (ro > 0) { tmp.copy(C.rock).lerp(C.rockDk, 0.5 + 0.5 * fbm(lat * 0.4, up * 0.4 + s * 0.3, seed + 25, 2)); out.lerp(tmp, ro); }
    // snow on the ridge (R3c), only on faces that look up
    const sn = sstep(Y0 + 0.8 * Hp, Y0 + 0.88 * Hp, up + 2.5 * fbm(lat * 0.1, s * 0.1, seed + 27, 2)) * sstep(0.2, 0.45, nu);
    if (sn > 0) out.lerp(C.snow, sn);
    return out; };
  return { G, colourAt, info: { cells: nx * ny * nz, nx, ny, nz, h: H, island: { CL, CS, RL, RS, Y0, WD, D, PW }, size: I.size ?? 'M', mountain: { Hp, ML, aL, aS, lab: +(Hp * 1.46).toFixed(1) }, lobes: lobes.length, rocks: rocks.length, moss: moss.length, cutW: Wc },
    views: { CL, CS, RL, RS, Y0, Hp } };
}
