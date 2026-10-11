// Island body "Scholle v7" (donors/…/KFB_R2D_v0/scholle-bench.js `buildScholle`, KONZEPT_SCHOLLE_v7.md), ported 1:1:
// rings of the outline shrunk towards the area centroid, fewer corners further down (zipper), corners jittered, spikes =
// corners of the last rings pulled down, one main tip under the centroid; then subdivide + Taubin (top pinned).
// Lab changes (Bauplan §1): the cross-section is the island's own rim (polar edge + roll overhang) instead of the bench
// lobes, ring 0 IS the last roll ring of the top mesh (same positions, same normals: no step, no gap), the bench's own
// flat top plate is dropped (the R2D top surface is the plate), the main tip stays ≤ 1.5 from the centroid (hard rule
// ≤ 2), and the body carries a grass → earth weight (aGW) for the 3D speckle under the rim (§01, R2-Plan §6).
import * as THREE from 'three';
import { rng, lerp, clamp, sstep, vnoise, fbm } from './math';
import type { R2DPlan } from './fields';
import { neckWeights, type TerrainMesh, type EdgeParams } from './terrain-mesh';

/** Benchmark presets (scholle-bench.js PRESETS, measured silhouettes); only the body fields are used here. */
export const PRESETS: Record<string, { label: string; depth: number; prof: number[]; inset: number; saw: number; zack: number; zackD: number; off: number; seed: number }> = {
  I: { label: 'Hütte', depth: 0.50, prof: [1, 0.94, 0.88, 0.81, 0.76, 0.69, 0.64, 0.56, 0.49, 0.33, 0.01], inset: 0.03, saw: 0.05, zack: 4, zackD: 0.38, off: 0.04, seed: 11 },
  D: { label: 'Food Point', depth: 0.45, prof: [1, 0.89, 0.81, 0.75, 0.67, 0.59, 0.55, 0.45, 0.37, 0.25, 0.05], inset: 0.02, saw: 0.05, zack: 3, zackD: 0.32, off: 0.05, seed: 23 },
  C: { label: 'Garten', depth: 0.48, prof: [1, 0.94, 0.88, 0.81, 0.76, 0.69, 0.64, 0.56, 0.49, 0.33, 0.01], inset: 0.05, saw: 0.05, zack: 5, zackD: 0.32, off: 0.03, seed: 37 },
  B: { label: 'Wald', depth: 0.39, prof: [1, 0.89, 0.78, 0.68, 0.63, 0.54, 0.48, 0.41, 0.35, 0.25, 0.02], inset: 0.03, saw: 0.05, zack: 6, zackD: 0.42, off: 0.02, seed: 41 },
  // lab (Lauf 03): Klumpen = a broken-off clod: deep, shoulders stay wide (no mushroom stalk), blunt end
  K: { label: 'Klumpen', depth: 0.8, prof: [1, 0.97, 0.93, 0.88, 0.82, 0.75, 0.66, 0.55, 0.42, 0.27, 0.06], inset: 0.01, saw: 0.06, zack: 2, zackD: 0.2, off: 0.04, seed: 61 },
  // lab (Lauf 03): Pfeiler = a bridge pier clod: the body stays massive well below the top (springers 3–7 under the road + 1.1 rock), then tapers
  P: { label: 'Pfeiler', depth: 0.85, prof: [1, 1, 0.99, 0.97, 0.93, 0.86, 0.76, 0.62, 0.46, 0.28, 0.06], inset: 0.03, saw: 0.05, zack: 2, zackD: 0.2, off: 0.03, seed: 67 },
  A: { label: 'Leuchtturm', depth: 0.46, prof: [1, 0.9, 0.82, 0.73, 0.65, 0.56, 0.49, 0.41, 0.33, 0.23, 0.05], inset: 0.06, saw: 0.05, zack: 2, zackD: 0.22, off: 0.03, seed: 53 },
  E: { label: 'Strand', depth: 0.47, prof: [1, 0.9, 0.81, 0.74, 0.65, 0.59, 0.53, 0.47, 0.36, 0.23, 0.01], inset: 0.05, saw: 0.05, zack: 2, zackD: 0.22, off: 0.05, seed: 67 },
  F: { label: 'Wüste', depth: 0.41, prof: [1, 0.89, 0.8, 0.72, 0.64, 0.57, 0.51, 0.44, 0.36, 0.23, 0.05], inset: 0.25, saw: 0.05, zack: 3, zackD: 0.28, off: 0.06, seed: 79 },
  G: { label: 'Schnee', depth: 0.45, prof: [1, 0.9, 0.82, 0.73, 0.65, 0.56, 0.49, 0.41, 0.33, 0.23, 0.05], inset: 0.08, saw: 0.05, zack: 4, zackD: 0.45, off: 0.04, seed: 97 },
};

export interface ScholleInfo { Dprofile: number; knobs: number; style: string; massCentroid: [number, number]; spikesDown: number; spikeTiltDeg: number; ringCV: number; preset: string; Dm: number; D: number; ratio: number; tris: number; zack: number; apexOff: number; apex: [number, number, number]; centroid: [number, number]; spikes: [number, number, number][]; ms: number }

export function buildScholle(P: R2DPlan, T: TerrainMesh, U0: EdgeParams, presetId: string, opts: { soft?: number; seed?: number; style?: 'cone' | 'lobes' | 'broken' | 'roots'; cliffW?: (th: number) => number; niche?: (th: number) => { w: number; soleY: number }; rim0?: (th: number) => number } = {}): { geo: THREE.BufferGeometry; info: ScholleInfo } {
  const t0 = performance.now(), pr = PRESETS[presetId] ?? PRESETS.D, soft = opts.soft ?? 2;
  const R = rng((opts.seed ?? P.seed) * 7919 + pr.seed);
  const { NA, edgeR, c0 } = P, top = T.geo.attributes.position as THREE.BufferAttribute, rollRow = T.rollRow;
  // area centroid of the rim polygon (Flächenschwerpunkt) and mean diameter
  let A = 0, cx = 0, cz = 0, Rm = 0, eyM = 0;
  const rx = (a: number) => top.getX(rollRow * NA + a), rz = (a: number) => top.getZ(rollRow * NA + a);
  for (let a = 0; a < NA; a++) {
    const b = (a + 1) % NA, f = rx(a) * rz(b) - rx(b) * rz(a);
    A += f; cx += (rx(a) + rx(b)) * f; cz += (rz(a) + rz(b)) * f; Rm += edgeR[a] + U0.ov; eyM += T.bodyEdgeY[a];
  }
  A *= 0.5; cx /= 6 * A; cz /= 6 * A; Rm /= NA; eyM /= NA;
  const Dm = 2 * Rm, D = pr.depth * Dm, yRef = eyM - U0.cap;
  // rim radius around the centroid (the roll ring, as seen from C) by angle
  const rimAt = (th: number) => {
    // walk the roll ring: radius of the ring point whose direction from C is closest to th (ring is star-shaped from c0 ≈ C)
    const f = (((th / (Math.PI * 2)) % 1) + 1) % 1 * NA, i = Math.floor(f) % NA, j = (i + 1) % NA, t = f - Math.floor(f);
    return lerp(Math.hypot(rx(i) - c0[0], rz(i) - c0[1]), Math.hypot(rx(j) - c0[0], rz(j) - c0[1]), t);   // angle AND distance from c0 (the polar net's centre)
  };
  // abutment niche (RKIT): below the sole the body reaches out to the original rim; rimN = that radius in the niche sector
  const nicheAt = opts.niche ?? (() => ({ w: 0, soleY: 0 })), rimN = (th: number) => { const n = nicheAt(th); return n.w > 0 && opts.rim0 ? lerp(rimAt(th), Math.max(rimAt(th), opts.rim0(th)), n.w) : rimAt(th); };
  const rimMin = (th: number, w: number) => { let m = Infinity; for (let i = -6; i <= 6; i++) m = Math.min(m, rimN(th + (i / 6) * w)); return m; };
  // coarse rings take the lowest rim height over their corner window: a chord never lies above the finer ring at a dip
  const edgeMin = (th: number, w: number) => { let m = Infinity; for (let i = -6; i <= 6; i++) m = Math.min(m, edgeYAt(th + (i / 6) * w)); return m; };
  const edgeYAt = (th: number) => { const f = (((th / (Math.PI * 2)) % 1) + 1) % 1 * NA, i = Math.floor(f) % NA; return lerp(T.bodyEdgeY[i], T.bodyEdgeY[(i + 1) % NA], f - Math.floor(f)); };
  const Pp: number[] = [], idx: number[] = [], pin: (boolean | 'z')[] = [], gw: number[] = [];
  const v = (x: number, y: number, z: number, pinned: boolean | 'z' = false) => { Pp.push(x, y, z); pin.push(pinned); return Pp.length / 3 - 1; };
  // ring 0 = the top mesh's last roll ring (pinned, identical positions)
  const ang = [...Array(NA).keys()].map((a) => (a / NA) * Math.PI * 2);
  // (until Lauf 03 ring 0 tucked 0.4 up and 0.15 in behind the last roll ring; now it shares the row, see ring0Pos)
  // (built after smoothing, see below: smoothing the band with its 608 pinned corners dragged ring k0 upwards and folded it)
  // Lauf 03 N2 (Geisterlinie), structural fix: ring 0 is the seam ring K, which is also the top net's last row (ground.ts
  // buildNeck lays its dive row on these very points): one seam generated once, no overlap of two bodies under the lip
  // (the old tuck 0.4 up / 0.15 in behind the roll made the top net's dive strip and the body cross along a straight line)
  // seam ring K (once, used by both meshes): where the old first body ring (k0) was: ov + 0.5 inside the roll end (or
  // wall foot), 0.04 D under it; at an abutment niche down to the sole. The top net's neck runs onto exactly these points.
  const seamK = (th: number): [number, number, number] => {
    const r = rimAt(th) - (U0.ov + 0.5), nc = nicheAt(th);
    let y = edgeYAt(th) - U0.cap - 0.04 * D;
    if (nc.w > 0) y = lerp(y, nc.soleY - 0.02, nc.w);
    return [c0[0] + Math.cos(th) * r, y, c0[1] + Math.sin(th) * r];
  };
  const ring0Pos = ang.map((th) => seamK(th));
  // mass centroid: what the clod carries (castle rock, peaks) pulls the heavy part and the main tip under it
  // (Steuerung 10.10.: "die tiefste, schwerste Masse unter dem Burgfels"); weight = height above the lowest top point
  // plus a base layer of 0.15 D, times the polar area of the vertex
  let mx = 0, mz = 0, mw = 0, yMin = Infinity;
  for (let i = 0; i <= T.NR; i++) for (let a = 0; a < NA; a += 4) yMin = Math.min(yMin, top.getY(i * NA + a));
  for (let i = 1; i <= T.NR; i++) for (let a = 0; a < NA; a += 4) {
    const o = i * NA + a, x = top.getX(o), z = top.getZ(o), w = (top.getY(o) - yMin + 0.15 * D) * Math.hypot(x - c0[0], z - c0[1]);
    mx += x * w; mz += z * w; mw += w;
  }
  const MCx = mw ? mx / mw : cx, MCz = mw ? mz / mw : cz;
  const oa = R() * Math.PI * 2, off = Math.min(pr.off * Dm, 1.5), apexXZ: [number, number] = [MCx + Math.cos(oa) * off, MCz + Math.sin(oa) * off];
  const shape = (u: number) => { const f = clamp(u, 0, 1) * 10, i = Math.min(9, Math.floor(f)); return Math.max(0.03, lerp(pr.prof[i], pr.prof[i + 1], f - i)); };
  // ring0 (NA, pinned) → 96 → 32 → bench rings: keeps vertex valence low, so Taubin does not drag rings upwards
  // upper rings follow the exact rim (96 / 96 / 48 corners): the outline's bays are narrower than a 16-ring's spacing, and
  // switching to the coarse window radius right under the rim made shelves that smoothing folded. The switch happens at
  // u = 0.25, where the vertical gap (0.15 D) exceeds a bay's depth. Below, the bench facets are unchanged.
  const rings = [{ n: 96, u: 0 }, { n: 96, u: 0.07 }, { n: 48, u: 0.1 }, { n: 13, u: 0.25 }, { n: 10, u: 0.42 }, { n: 8, u: 0.6 }, { n: 6, u: 0.76 }, { n: 4, u: 0.9 }, { n: 3, u: 0.96 }];   // u = 0.96: one more sample of the measured profile, the body tapers into the main tip
  // coarser stand-in for the tucked ring 0 (NA / 2 corners, pinned) during smoothing: normal valence for ring k0, so the band →
  // body crease rounds like in the bench; the fine ring 0 (NA corners) is zipped to it afterwards (hidden sliver < 0.1)
  const A96 = [...Array(96).keys()].map((i) => (i / 96) * Math.PI * 2), NP = Math.round(NA / 2), AP = [...Array(NP).keys()].map((i) => (i / NP) * Math.PI * 2);
  // stand-in for ring 0 during smoothing: the same seam ring at NA / 2 corners (pinned); ring 0 is zipped to it afterwards
  // pinned (unpinned, its open edge drifted under the smoothing and folded); its loop (corners + midpoints) is the seam
  const proxy = AP.map((th) => { const q = seamK(th); return v(q[0], q[1], q[2], true); });
  let prev: number[] = proxy, prevA: number[] = AP;
  const ringV: { ids: number[]; A: number[] }[] = [];
  rings.forEach((rg, k) => {
    // k0 (u = 0) is the seam ring now (ring 0 / stand-in): no vertices, but the same random draws (body shape unchanged)
    if (k === 0) { for (let i = 0; i < A96.length; i++) R(); return; }
    const s = k === 0 ? 1 - pr.inset * 0.3 : shape(rg.u), ccx = lerp(c0[0], apexXZ[0], rg.u), ccz = lerp(c0[1], apexXZ[1], rg.u);   // rings shrink from the rim (c0 frame) towards the tip under C
    const Aa = k === 0 ? A96 : [...Array(rg.n).keys()].map((i) => ((i + 0.5 * k + (R() - 0.5) * 0.5) / rg.n) * Math.PI * 2);
    const low = rg.u > 0.5, top2 = rg.u < 0.08, jr = k === 0 || top2 ? 0.02 : rg.u <= 0.1 ? 0.02 : low ? 0.18 : 0.07, jy = k === 0 ? 0 : rg.u <= 0.1 ? 0.005 : low ? 0.1 : 0.04;   // rings under the rim: height jitter smaller than their spacing (no crossing)
    const ids = Aa.map((a, i) => {
      const sw = rg.u > 0.6 ? pr.saw * (i % 2 ? 0.35 + 0.3 * R() : 0.75 + 0.5 * R()) * (rg.u > 0.8 ? 1 : 0.6) : 0;   // Sägezahn
      // ring k=0 sits a fixed distance inside the roll (bench: relative jitter ±2 %, which is ±2.5 at Ø 250 and pushed the
      // body out in front of the grass lip); lower rings keep the bench's relative facet jitter
      // coarse rings: radius = minimum over a common window (± 11.25°, the 16-ring's spacing; wider for coarser rings), so the
      // rings stay nested at bays (own windows let the 32- and 16-ring dip at different angles and fold); originally: so a chord never bridges a narrow bay outside the
      // finer ring above it (that folded the body at the outline's concave bays)
      // inserted ring (u = 0.07): radius halfway between k0 and ring u = 0.1, so the band does not step onto a shelf
      const sIns = top2 ? (1 - pr.inset * 0.3 + shape(0.1)) / 2 : rg.u > 0.95 ? s * 0.7 : s;
      const r = k === 0 ? rimAt(a) - (U0.ov + 0.5) : (rg.u <= 0.1 ? rimN(a) : rimMin(a, Math.PI / rg.n)) * sIns * (1 + (R() - 0.5) * 2 * jr) * (1 - 0.35 * sw);
      // the upper rings follow the rim height per angle (Town's plateau lifts the back rim by ≈ 8.5); unequal offsets crossed them
      const ue = k === 0 ? 0.04 : rg.u, y0 = yRef - ue * D + ((k === 0 ? edgeYAt(a) : (rg.u <= 0.1 ? edgeYAt(a) : edgeMin(a, Math.PI / rg.n))) - eyM) * (rg.u <= 0.1 ? 1 : Math.max(0, 1 - (rg.u - 0.1) / 0.32));   // rings down to u = 0.1 follow the rim fully (equal offset: no crossing), then fade out by u = 0.42
      let y = y0 + (R() - 0.5) * 2 * jy * D - sw * D;
      // niche: ring 0 and the two upper rings form the bench at the sole (flat, out to the original rim, rounded lip)
      const nc = nicheAt(a); if (nc.w > 0 && rg.u <= 0.1) y = lerp(y, nc.soleY - (k === 0 ? 0.02 : rg.u < 0.08 ? 0.06 : 1.2), nc.w);
      return v(ccx + Math.cos(a) * r, y, ccz + Math.sin(a) * r);
    });
    zip(prev, prevA, ids, Aa);
    ringV.push({ ids, A: Aa }); prev = ids; prevA = Aa;
  });
  // seam ring placed on the body's own path (shared seam, Lauf 03 N2): between the roll end / wall foot and the first body
  // ring (u = 0.07): 30 % out from that ring towards the rim, halfway down. A fixed K (ov + 0.5 in, 0.04 D down) sat inside
  // the first ring and the pinned band zig-zagged (Q5 folds). Ring 0 (NA corners, = the top net's last row) is laid on the
  // chords of this stand-in ring, so the stitch between them has no width.
  {
    const R1 = ringV[0], r1 = R1.ids.map((id) => [Math.hypot(Pp[id * 3] - c0[0], Pp[id * 3 + 2] - c0[1]), Pp[id * 3 + 1], ((Math.atan2(Pp[id * 3 + 2] - c0[1], Pp[id * 3] - c0[0]) % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)] as [number, number, number]).sort((p, q) => p[2] - q[2]);
    const at1 = (th: number) => {   // radius / height of ring u = 0.07 at angle th (linear between its corners)
      const t0 = ((th % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2); let j = r1.findIndex((p) => p[2] > t0); if (j < 0) j = 0;
      const p = r1[(j - 1 + r1.length) % r1.length], q = r1[j], span = ((q[2] - p[2]) + Math.PI * 2) % (Math.PI * 2) || 1e-6, t = (((t0 - p[2]) + Math.PI * 2) % (Math.PI * 2)) / span;
      return [lerp(p[0], q[0], t), lerp(p[1], q[1], t)];
    };
    const eAt = (th: number) => { const f = (((th / (Math.PI * 2)) % 1) + 1) % 1 * NA, i = Math.floor(f) % NA, j = (i + 1) % NA, t = f - Math.floor(f); return [lerp(Math.hypot(rx(i) - c0[0], rz(i) - c0[1]), Math.hypot(rx(j) - c0[0], rz(j) - c0[1]), t), lerp(top.getY(rollRow * NA + i), top.getY(rollRow * NA + j), t)]; };
    // under a wall the seam ring continues the wall (0.25 in, 1 below its foot): the top net's short neck there has only
    // NECK rows and creased when it had to reach 3–4 inwards; blended by the same wall-height weight as the top net's neck
    const NW = neckWeights(T), nwAt = (th: number) => { const f = (((th / (Math.PI * 2)) % 1) + 1) % 1 * NA, i = Math.floor(f) % NA; return lerp(NW[i], NW[(i + 1) % NA], f - Math.floor(f)); };
    proxy.forEach((id, k2) => {
      const th = AP[k2], [rr1, yy1] = at1(th), [rE, yE] = eAt(th), sN = nwAt(th);
      const r = lerp(rE - 0.25, lerp(rr1, rE, 0.3), sN), y = lerp(yE - 1.0, lerp(yE, yy1, 0.5), sN);

      Pp[id * 3] = c0[0] + Math.cos(th) * r; Pp[id * 3 + 1] = y; Pp[id * 3 + 2] = c0[1] + Math.sin(th) * r;
    });
    // ring 0 on the stand-in's chords (by angle)
    for (let a = 0; a < NA; a++) {
      const f = (ang[a] / (Math.PI * 2)) * proxy.length, i = Math.floor(f) % proxy.length, j = (i + 1) % proxy.length, t = f - Math.floor(f), A = proxy[i], B = proxy[j];
      ring0Pos[a] = [lerp(Pp[A * 3], Pp[B * 3], t), lerp(Pp[A * 3 + 1], Pp[B * 3 + 1], t), lerp(Pp[A * 3 + 2], Pp[B * 3 + 2], t)];
    }
  }
  // Zacken (BAUANLEITUNG §6, KONZEPT_SCHOLLE_v7 §2) are sculpted after smoothing, on the heavy side first (see the drips
  // block below); pulled ring corners made flat fins and, from the last ring, never hung down.
  const apexY = yRef - D, style = opts.style ?? 'cone', heavy = Math.atan2(MCz - c0[1], MCx - c0[0]), heavyK = Math.hypot(MCx - c0[0], MCz - c0[1]) > 3 ? 1 : 0;
  let spikeTilt = 0, spikesDown = 0, knobs = 0;
  const spikesIdx: number[] = [];   // spikes are sculpted after smoothing (see `drips`)
  const apex = v(apexXZ[0], yRef - (Number(QS.get('apexK') ?? 1.18)) * D, apexXZ[1], true);   // the main tip stays a tip and hangs deepest (KONZEPT v7: Hauptspitze am tiefsten); Lauf 03: 0.18 D below the profile's end (heavier)
  const L = ringV[ringV.length - 1].ids;
  for (let i = 0; i < L.length; i++) idx.push(L[i], L[(i + 1) % L.length], apex);
  function zip(Aid: number[], Aa: number[], Bid: number[], Ba: number[]) {
    const norm = (a: number) => ((a % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2), a0 = Aa.map(norm), b0 = Ba.map(norm);
    const oA = [...a0.keys()].sort((p, q) => a0[p] - a0[q]), oB = [...b0.keys()].sort((p, q) => b0[p] - b0[q]);
    let i = 0, j = 0; const nA = oA.length, nB = oB.length;
    while (i < nA || j < nB) {
      const ai = Aid[oA[i % nA]], bj = Bid[oB[j % nB]], an = a0[oA[(i + 1) % nA]] + (i + 1 >= nA ? Math.PI * 2 : 0), bn = b0[oB[(j + 1) % nB]] + (j + 1 >= nB ? Math.PI * 2 : 0);
      if (j >= nB || (i < nA && an <= bn)) { idx.push(ai, Aid[oA[(i + 1) % nA]], bj); i++; } else { idx.push(ai, Bid[oB[(j + 1) % nB]], bj); j++; }
    }
  }
  let geo = soften(Pp, idx, pin, soft);
  // upper band (to 0.2 D below the rim): extra Taubin passes round the lip between the band under the roll and the body
  // (§01); the facets further down keep the bench's light smoothing
  {
    const pp = geo.attributes.position as THREE.BufferAttribute, ix = geo.index!, pinned: boolean[] = geo.userData.pinned, n = pp.count;
    const nb = Array.from({ length: n }, () => new Set<number>());
    for (let t = 0; t < ix.count; t += 3) for (let e = 0; e < 3; e++) { const a = ix.getX(t + e), b = ix.getX(t + ((e + 1) % 3)); nb[a].add(b); nb[b].add(a); }
    const N = nb.map((x) => [...x]), pos = Array.from(pp.array as Float32Array);
    const wgt = (i: number) => { if (pinned[i]) return 0; const th = Math.atan2(pos[i * 3 + 2] - c0[1], pos[i * 3] - c0[0]), dd = edgeYAt(th) - U0.cap - pos[i * 3 + 1]; return 1 - sstep(0.12 * D, 0.2 * D, dd); };
    const W = [...Array(n).keys()].map(wgt);
    const step = (f: number) => { const o = pos.slice(); for (let i = 0; i < n; i++) { if (W[i] <= 0) continue; let x = 0, y = 0, z = 0; for (const j of N[i]) { x += o[j * 3]; y += o[j * 3 + 1]; z += o[j * 3 + 2]; } const k = N[i].length || 1;
      pos[i * 3] += W[i] * f * (x / k - o[i * 3]); pos[i * 3 + 1] += W[i] * f * (y / k - o[i * 3 + 1]); pos[i * 3 + 2] += W[i] * f * (z / k - o[i * 3 + 2]); } };
    const LIP = Number(new URLSearchParams(typeof location !== 'undefined' ? location.search : '').get('lipIt') ?? 8);
    const ref = pos.slice();
    for (let it = 0; it < LIP; it++) { step(0.5); step(-0.53); }
    unfold(pos, ref, Array.from(ix.array), pinned);
    pp.copyArray(pos); pp.needsUpdate = true; geo.computeVertexNormals();
  }
  // spikes as sculpted drips (Knet-Zapfen): vertices within ρ sink with a soft falloff, so a drip is a round clay cone
  // of the same body, never an attached part and never a flat fin (a single pulled ring corner made fins)
  {
    const pp = geo.attributes.position as THREE.BufferAttribute, pos = Array.from(pp.array as Float32Array), n = pp.count;
    const cand: number[] = [];
    for (let i = 0; i < n; i++) { const dd = (yRef - pos[i * 3 + 1]) / D; if (dd > 0.5 && dd < 0.86) cand.push(i); }
    // Lauf 03 (HIGH 1): runners hang from the body's corners: under the outline's bulges and on the heavy side
    let rmM = 0; for (let a = 0; a < NA; a += 4) rmM += rimAt((a / NA) * Math.PI * 2); rmM /= NA / 4;
    const score = (i: number) => { const th = Math.atan2(pos[i * 3 + 2] - c0[1], pos[i * 3] - c0[0]); return heavyK * Math.cos(th - heavy) + 4 * (rimAt(th) / rmM - 1) + 0.6 * R(); };
    cand.sort((p, q) => score(q) - score(p));
    const plan: { len: number; rho: number; tilt: number; sharp: boolean; near?: number }[] = style === 'broken'
      ? [{ len: 0.46, rho: 0.105, tilt: 14, sharp: true }, { len: 0.34, rho: 0.09, tilt: 8, sharp: false }, { len: 0.22, rho: 0.07, tilt: 18, sharp: true },
         { len: 0.08, rho: 0.04, tilt: 20, sharp: true, near: 0 }, { len: 0.06, rho: 0.035, tilt: 10, sharp: false, near: 0 }, { len: 0.07, rho: 0.04, tilt: 16, sharp: true, near: 1 }, { len: 0.05, rho: 0.03, tilt: 6, sharp: false, near: 2 }]
      // cone: two long heavy runners at the body's corners, the rest shorter (Lauf 03: the bench's 0.16–0.28 D read as stubs)
      // (many spikes = small bodies: one runner × 0.82; a second one creased the saddle to it, Q5 on rkit_hub)
      : Array.from({ length: pr.zack }, (_, k) => k < (pr.zack >= 5 ? 1 : 2) ? { len: (k ? 0.31 : 0.4) * (pr.zack >= 5 ? 0.82 : 1) + 0.05 * R(), rho: 0.1 + 0.012 * R(), tilt: 0, sharp: false } : { len: 0.16 + 0.08 * R(), rho: 0.075 + 0.02 * R(), tilt: 0, sharp: true });   // no drip squeezed beside a long runner (the saddle creased)
    const centres: number[][] = [];
    for (const d of plan) {
      let c: number | undefined;
      if (d.near !== undefined && centres[d.near]) { const q = centres[d.near]; c = cand.find((i) => { const dx = pos[i * 3] - q[0], dz = pos[i * 3 + 2] - q[2], h = Math.hypot(dx, dz); return h > q[3] * 1.1 && h < q[3] * 2.4; }); }
      if (c === undefined) c = cand.find((i) => centres.every((q) => Math.hypot(pos[i * 3] - q[0], pos[i * 3 + 2] - q[2]) > 0.16 * Dm));
      if (c === undefined) continue;
      const rho = d.rho * Dm, len = d.len * D, cxp = pos[c * 3], cyp = pos[c * 3 + 1], czp = pos[c * 3 + 2], ta = R() * Math.PI * 2, tk = Math.tan((d.tilt * Math.PI) / 180);
      centres.push([cxp, cyp, czp, rho]);
      for (let i = 0; i < n; i++) {
        const dx = pos[i * 3] - cxp, dy = pos[i * 3 + 1] - cyp, dz = pos[i * 3 + 2] - czp, dist = Math.hypot(dx, dy * 0.6, dz);
        if (dist >= rho) continue;
        // rounded clay bells (no knife tips, Q5): narrow bell = pointed drip, flat bell = blunt / broken off
        const sN = dist / rho, b = 1 - sN * sN, f = d.sharp ? b * b * b : b * b * (0.75 + 0.25 * b);
        pos[i * 3 + 1] -= len * f; pos[i * 3] += Math.cos(ta) * tk * len * f; pos[i * 3 + 2] += Math.sin(ta) * tk * len * f;
      }
      if (d.len >= 0.1) { spikesDown++; spikeTilt = Math.max(spikeTilt, d.tilt); } else knobs++;
      spikesIdx.push(c);
    }
    pp.copyArray(pos); pp.needsUpdate = true; geo.computeVertexNormals();
  }
  // Q5 (Steuerung 10.10.): transition zone under the rim ≤ 45° (relaxed to 40°), designed facets / spikes ≤ 75° (to 70°)
  {
    const pp = geo.attributes.position as THREE.BufferAttribute, pos = Array.from(pp.array as Float32Array), pinned: boolean[] = geo.userData.pinned;
    const zone = (v: number) => { const th = Math.atan2(pos[v * 3 + 2] - c0[1], pos[v * 3] - c0[0]), dd = edgeYAt(th) - U0.cap - pos[v * 3 + 1]; return dd < 0.2 * D ? 36 : 70; };
    // only the hidden stand-in ring stays fixed here; tip and spikes may round (a fixed tip forced its neighbours to fold)
    const ix2 = Array.from(geo.index!.array);
    const ringOnly = pinned.map((p, i) => (p && i !== apex ? true : false)), before = pos.slice();   // soften keeps the original indices first: `apex` is still the main tip
    if (QS.get('relax') !== '0') relaxSharp(pos, ix2, ringOnly, zone);
    unfold(pos, before, ix2, ringOnly, false);   // after relaxing only real folds count (rotation is the point of relaxing)
    pp.copyArray(pos); pp.needsUpdate = true; geo.computeVertexNormals();
  }
  // attach the fine ring 0 after smoothing: tucked ring 0 (NA corners) zipped by angle to the (subdivided) stand-in polyline
  {
    const sp = Array.from(geo.attributes.position.array as Float32Array), six = Array.from(geo.index!.array), pinK0: boolean[] = geo.userData.pinned;
    // the stand-in ring after subdivision: its corners + the pinned midpoints on its chords (found geometrically)
    const NPp = proxy.length, onProxy = (i: number) => {
      if (!pinK0[i]) return false;
      const x = sp[i * 3], y = sp[i * 3 + 1], z = sp[i * 3 + 2], th = (((Math.atan2(z - c0[1], x - c0[0]) / (Math.PI * 2)) % 1) + 1) % 1, s0 = Math.floor(th * NPp) % NPp;
      for (const sgi of [s0, (s0 + NPp - 1) % NPp, (s0 + 1) % NPp]) {
        const A = proxy[sgi], B = proxy[(sgi + 1) % NPp], ax = sp[A * 3], ay = sp[A * 3 + 1], az = sp[A * 3 + 2], ex = sp[B * 3] - ax, ey = sp[B * 3 + 1] - ay, ez = sp[B * 3 + 2] - az, L2 = ex * ex + ey * ey + ez * ez || 1;
        const tt = Math.max(0, Math.min(1, ((x - ax) * ex + (y - ay) * ey + (z - az) * ez) / L2));
        if (Math.hypot(x - ax - ex * tt, y - ay - ey * tt, z - az - ez * tt) < 1e-4) return true;
      }
      return false;
    };
    void onProxy;
    const ec = new Map<string, number>(); for (let t = 0; t < six.length; t += 3) for (let e = 0; e < 3; e++) { const a = six[t + e], b = six[t + (e + 1) % 3], k = a < b ? a + '_' + b : b + '_' + a; ec.set(k, (ec.get(k) ?? 0) + 1); }
    const bnd = new Set<number>(); for (const [k, c] of ec) if (c === 1) for (const i of k.split('_').map(Number)) bnd.add(i);
    const n0 = sp.length / 3, k0 = [...bnd], angOf = (i: number) => Math.atan2(sp[i * 3 + 2] - c0[1], sp[i * 3] - c0[0]);
    const r0 = ring0Pos.map((p) => { sp.push(p[0], p[1], p[2]); return sp.length / 3 - 1; });
    const saved = idx.length; zip(r0, ang, k0, k0.map(angOf)); const band = idx.splice(saved);
    const out = new THREE.BufferGeometry();
    out.setAttribute('position', new THREE.Float32BufferAttribute(sp, 3));
    out.setIndex([...six, ...band]); out.computeVertexNormals();
    const inK0 = new Set(k0);
    out.userData.seamStart = n0; out.userData.seamStandIn = k0;   // ring 0 = the seam ring K: vertices n0 … n0 + NA − 1 (angle a = index − n0)
    out.userData.pinned = [...Array(sp.length / 3).keys()].map((i) => i >= n0 || inK0.has(i) || (pinK0[i] && i !== apex));   // ring 0, stand-in and the whole neck stay fixed (the rim clamp pulled the neck in and creased it)   // the main tip is pinned for smoothing but not hidden   // "pinned" = tucked ring 0 + stand-in (hidden behind the roll)
    geo = out;
  }
  // under the rim the body stays inside the roll (smoothing pulls it outwards at concave bays): within 6 below the roll
  // radius ≤ roll − 0.2, then the limit opens by 1 per unit depth (no crease, the facets below stay free)
  {
    const pp = geo.attributes.position as THREE.BufferAttribute, pinned: boolean[] = geo.userData.pinned;
    const clampR = () => { for (let i = 0; i < pp.count; i++) {
      if (pinned[i]) continue;
      const x = pp.getX(i), y = pp.getY(i), z = pp.getZ(i), th = Math.atan2(z - c0[1], x - c0[0]), dd = edgeYAt(th) - U0.cap - y;
      if (dd > 30) continue;
      const rmax = (presetId === 'P' ? Math.min(rimAt(th), rimMin(th, 0.04) + 0.25) : rimN(th)) - 0.3 - 0.8 * Math.min(U0.ov, 1.2) * sstep(0, 3, dd) - 0.1 * Math.min(dd, 8) + 0.3 * Math.max(0, dd - 8), r = Math.hypot(x - c0[0], z - c0[1]);   // and clearly behind the roll's bulge (a band reaching 0.3 under it read as a second lip)   // Lauf 03: tapers in under the roll and opens slowly (a quick opening let the band swell out again: double contour)   // the real roll / wall-foot ring (at a break the rounding is smaller than U0.ov)
      if (r > rmax) { const k = rmax / r; pp.setXYZ(i, c0[0] + (x - c0[0]) * k, y, c0[1] + (z - c0[1]) * k); }
    } };
    // (boxy pier outlines: the limit from a small window minimum, or the corners crease; on large rims that window
    // minimum itself creased the band, so only there)
    clampR();
    // Lauf 03: the clamp follows the wall foot's knobs at a break and can crease the band under it: one more relax of
    // the band (≤ 40°), then the clamp again
    { const pos = Array.from(pp.array as Float32Array), ix3 = Array.from(geo.index!.array);
      relaxSharp(pos, ix3, pinned, (v) => { const th = Math.atan2(pos[v * 3 + 2] - c0[1], pos[v * 3] - c0[0]); return edgeYAt(th) - U0.cap - pos[v * 3 + 1] < 0.2 * D ? 42 : 72; }, 80);
      pp.copyArray(pos); pp.needsUpdate = true; }
    clampR();
    geo.computeVertexNormals();
  }
  // orientation: faces must point outwards (the bench builds clockwise; check one side face)
  const pa = geo.attributes.position as THREE.BufferAttribute, na = geo.attributes.normal as THREE.BufferAttribute;
  let outward = 0;
  for (let i = 0; i < pa.count; i += 7) outward += (pa.getX(i) - cx) * na.getX(i) + (pa.getZ(i) - cz) * na.getZ(i);
  if (outward < 0) {
    const ix = geo.index!.array as Uint32Array;
    for (let i = 0; i < ix.length; i += 3) { const t = ix[i + 1]; ix[i + 1] = ix[i + 2]; ix[i + 2] = t; }
    geo.computeVertexNormals();
  }
  // ring 0 back onto the stand-in ring (the body's former open edge: corners + midpoints) as it is NOW, by angle: the
  // stitch between them has no width, and ring0Pos (the top net's seam) follows
  {
    const PP = geo.attributes.position as THREE.BufferAttribute, st = geo.userData.seamStart as number, ids = geo.userData.seamStandIn as number[];
    const ring = ids.map((i) => [((Math.atan2(PP.getZ(i) - c0[1], PP.getX(i) - c0[0]) % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2), i] as [number, number]).sort((p, q) => p[0] - q[0]);
    const m = ring.length;
    for (let a = 0; a < NA; a++) {
      const t0 = ((ang[a] % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2); let j = ring.findIndex((r) => r[0] > t0); if (j < 0) j = 0;
      const p = ring[(j - 1 + m) % m], q = ring[j], span = ((q[0] - p[0]) + Math.PI * 2) % (Math.PI * 2) || 1e-6, t = (((t0 - p[0]) + Math.PI * 2) % (Math.PI * 2)) / span;
      const x = lerp(PP.getX(p[1]), PP.getX(q[1]), t), y = lerp(PP.getY(p[1]), PP.getY(q[1]), t), z = lerp(PP.getZ(p[1]), PP.getZ(q[1]), t);
      PP.setXYZ(st + a, x, y, z); ring0Pos[a] = [x, y, z];
    }
    PP.needsUpdate = true; geo.computeVertexNormals();
  }
  // Lauf 03 fix 3 (facettierte Polygon-Konturen / ebene Unterkante): one level of Phong tessellation after all shaping. The
  // existing vertices (rim, spikes, tip, every Q-measured point) stay where they are; each edge gets a midpoint lifted onto
  // the curve its two vertex normals describe, so long straight silhouette segments and the flat bottom edge become curves
  // while the facets keep their corners. Under the rim (≤ 3) and next to the pinned rings the midpoints stay straight.
  // (depth measured from the shared seam ring: on small fragments the seam itself lay inside the lift zone and creased)
  const seamYAt = (th: number) => { const f = (((th / (Math.PI * 2)) % 1) + 1) % 1 * NA, a = Math.floor(f) % NA; return lerp(ring0Pos[a][1], ring0Pos[(a + 1) % NA][1], f - Math.floor(f)); };
  if (QS.get('phong') !== '0') geo = phongSplit(geo, (x, y, z) => { const th = Math.atan2(z - c0[1], x - c0[0]); return sstep(3, 8, seamYAt(th) - y); });
  // ring 0 (and its pinned midpoints) takes the top mesh's rim normal: no shading step between roll and body
  {
    const pinned: boolean[] = geo.userData.pinned, NN = geo.attributes.normal as THREE.BufferAttribute, PP = geo.attributes.position as THREE.BufferAttribute;
    // shared seam: from ring 0 (= the top net's last row, its outward rim normal) the body's normals ease into their own over
    // ≈ 3 below the seam (neck included): the same normal on both sides of the seam, no shading step under the lip
    for (let i = 0; i < PP.count; i++) {
      if (i === apex) continue;
      const th = Math.atan2(PP.getZ(i) - c0[1], PP.getX(i) - c0[0]), dd = edgeYAt(th) - U0.cap - PP.getY(i), k = sstep(0, 3, dd);
      if (k >= 1) continue;
      const f = (((th / (Math.PI * 2)) % 1) + 1) % 1 * NA, a = Math.floor(f) % NA, b = (a + 1) % NA, t = f - Math.floor(f);
      const rx = lerp(T.rimN[a * 2], T.rimN[b * 2], t), rz = lerp(T.rimN[a * 2 + 1], T.rimN[b * 2 + 1], t);
      const x = lerp(rx, NN.getX(i), k), y = lerp(0, NN.getY(i), k), z = lerp(rz, NN.getZ(i), k), l = Math.hypot(x, y, z) || 1;
      NN.setXYZ(i, x / l, y / l, z / l);
    }
    // ring 0 hangs on the stand-in ring by zero-width stitch slivers only, so its own normals were noise: it takes the
    // stand-in's (along the same chords). The top net's neck arrives along these and copies them at the seam.
    const st = geo.userData.seamStart as number, ids = geo.userData.seamStandIn as number[];
    const ring = ids.map((i) => [((Math.atan2(PP.getZ(i) - c0[1], PP.getX(i) - c0[0]) % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2), i] as [number, number]).sort((p, q) => p[0] - q[0]), m = ring.length;
    for (let a = 0; a < NA; a++) {
      const t0 = ((ang[a] % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2); let j = ring.findIndex((r) => r[0] > t0); if (j < 0) j = 0;
      const p = ring[(j - 1 + m) % m], q = ring[j], span = ((q[0] - p[0]) + Math.PI * 2) % (Math.PI * 2) || 1e-6, t = (((t0 - p[0]) + Math.PI * 2) % (Math.PI * 2)) / span;
      const x = lerp(NN.getX(p[1]), NN.getX(q[1]), t), y = lerp(NN.getY(p[1]), NN.getY(q[1]), t), z = lerp(NN.getZ(p[1]), NN.getZ(q[1]), t), l = Math.hypot(x, y, z) || 1;
      NN.setXYZ(st + a, x / l, y / l, z / l);
    }
    NN.needsUpdate = true;
  }
  // grass → earth weight: 1 at the roll ring, speckle over the band under it (scales gently with the island)
  const band = 3 + 0.01 * Dm, P2 = geo.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < P2.count; i++) {
    const th = Math.atan2(P2.getZ(i) - c0[1], P2.getX(i) - c0[0]), f = (((th / (Math.PI * 2)) % 1) + 1) % 1 * NA, a = Math.floor(f) % NA;
    // measured from the shared seam ring (the top net's neck above it is plain map grass): no colour step at the seam
    const yr = lerp(ring0Pos[a][1], ring0Pos[(a + 1) % NA][1], f - Math.floor(f)), dd = yr - P2.getY(i);
    // solid grass for the first ≈ 1.2 under the roll, then drops. The onset wanders (± 1 over ≈ 8 along the rim), so the
    // first tiny drops never line up into a dotted line under grazing views
    const px = P2.getX(i), pz = P2.getZ(i), wob = vnoise(px * 0.12, pz * 0.12, P.seed + 17), wob2 = vnoise(px * 0.07 + 5, pz * 0.07, P.seed + 23);
    gw.push(1 - sstep(1.2 + 1.0 * wob, band + 1.5 * wob2, dd));
  }
  geo.setAttribute('aGW', new THREE.Float32BufferAttribute(gw, 1));
  // cross-section through the earth (Georg 10.10.: the islands are clods broken out of the earth): strata as tone steps
  // (aST.x: layer 1 from ≈ 0.2 D, aST.y: layer 2 from ≈ 0.48 D), and under a cliff the break face shows rock all the way
  // into the body (aST.z). Boundaries are S1 speckle in the shader, never gradients.
  // Lauf 03: the layers belong to the earth, not to the clod: a tilted bed (the clod broke out at an angle, ≈ 12–16°),
  // bent over long distances and offset at one fault, so they never run as rings parallel to the rim.
  const st: number[] = [], dipA = R() * Math.PI * 2, dipK = 0.45 + 0.15 * R(), fA = dipA + 1.2 + R(), fO = (R() - 0.5) * 0.3;
  for (let i = 0; i < P2.count; i++) {
    const x = P2.getX(i), y = P2.getY(i), z = P2.getZ(i), th = Math.atan2(z - c0[1], x - c0[0]);
    const ux = (x - c0[0]) / Dm, uz = (z - c0[1]) / Dm, fault = sstep(-0.012, 0.012, ux * Math.cos(fA) + uz * Math.sin(fA) - fO);
    const dd = (yRef - y) / D + dipK * (ux * Math.cos(dipA) + uz * Math.sin(dipA)) + 0.14 * fbm(x * 0.012, z * 0.012, P.seed + 45, 2) + 0.07 * fault;
    const w1 = vnoise(x * 0.05, z * 0.05, P.seed + 41) * 0.08, w2 = vnoise(x * 0.04 + 7, z * 0.04, P.seed + 43) * 0.1;
    const cw = opts.cliffW ? opts.cliffW(th) : 0, dTop = (lerp(T.bodyEdgeY[Math.floor((((th / (Math.PI * 2)) % 1) + 1) % 1 * NA) % NA], T.bodyEdgeY[0], 0) - U0.cap - y) / D;
    st.push(sstep(0.17 + w1, 0.24 + w1, dd), sstep(0.44 + w2, 0.52 + w2, dd), cw * (1 - sstep(0.22, 0.32, dTop)));
  }
  geo.setAttribute('aST', new THREE.Float32BufferAttribute(st, 3));
  // no grass under a rock wall: the break face starts with rock
  if (opts.cliffW) { const g2 = geo.getAttribute('aGW') as THREE.BufferAttribute; for (let i = 0; i < g2.count; i++) g2.setX(i, g2.getX(i) * (1 - st[i * 3 + 2])); }
  geo.computeBoundingBox(); geo.computeBoundingSphere();
  const SPp = geo.attributes.position as THREE.BufferAttribute, tris = geo.index!.count / 3, spikes = spikesIdx.map((id) => [SPp.getX(id), SPp.getY(id), SPp.getZ(id)] as [number, number, number]);
  const bb = geo.boundingBox!;
  let rm = 0, rv = 0; for (let a = 0; a < NA; a++) rm += rimAt((a / NA) * Math.PI * 2); rm /= NA; for (let a = 0; a < NA; a++) rv += (rimAt((a / NA) * Math.PI * 2) - rm) ** 2;
  return { geo, info: { Dprofile: D, knobs, style, massCentroid: [MCx, MCz], spikesDown, spikeTiltDeg: +spikeTilt.toFixed(1), ringCV: +(Math.sqrt(rv / NA) / rm).toFixed(3), preset: presetId, Dm: +Dm.toFixed(1), D: +(yRef - bb.min.y).toFixed(1), ratio: +((yRef - bb.min.y) / Dm).toFixed(2), tris, zack: pr.zack, apexOff: +off.toFixed(2), apex: [apexXZ[0], apexY, apexXZ[1]], centroid: [cx, cz], spikes, ms: +(performance.now() - t0).toFixed(1) } };
}

/** Fold guard (lab addition): Taubin on the long zip slivers between rings of different corner counts flipped single
 *  faces. Every face whose normal turned by more than 45° against the reference pulls its free vertices halfway back,
 *  until none tips (≤ 10 rounds). */
function unfold(pos: number[], ref: number[], idx: number[], pinned: (boolean | 'z')[], checkRotation = true) {
  const nrm = (P: number[], a: number, b: number, c: number) => {
    const ux = P[b * 3] - P[a * 3], uy = P[b * 3 + 1] - P[a * 3 + 1], uz = P[b * 3 + 2] - P[a * 3 + 2], vx = P[c * 3] - P[a * 3], vy = P[c * 3 + 1] - P[a * 3 + 1], vz = P[c * 3 + 2] - P[a * 3 + 2];
    const nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx, l = Math.hypot(nx, ny, nz) || 1; return [nx / l, ny / l, nz / l];
  };
  let fixed = 0;
  for (let round = 0; round < 16; round++) {
    const flag = new Set<number>();
    for (let t = 0; t < idx.length; t += 3) {
      const a = idx[t], b = idx[t + 1], c = idx[t + 2], n0 = nrm(ref, a, b, c), n1 = nrm(pos, a, b, c);
      if (checkRotation && n0[0] * n1[0] + n0[1] * n1[1] + n0[2] * n1[2] < 0.7) for (const v of [a, b, c]) if (pinned[v] !== true) flag.add(v);
    }
    // neighbouring faces folded against each other (> 120°) count too
    const fn: number[][] = [], edge = new Map<string, number>();
    for (let t = 0; t < idx.length; t += 3) fn.push(nrm(pos, idx[t], idx[t + 1], idx[t + 2]));
    for (let t = 0; t < idx.length; t += 3) for (let e = 0; e < 3; e++) {
      const a = idx[t + e], b = idx[t + ((e + 1) % 3)], k = a < b ? a + '_' + b : b + '_' + a, o = edge.get(k);
      if (o === undefined) { edge.set(k, t / 3); continue; }
      const n1 = fn[o], n2 = fn[t / 3];
      if (n1[0] * n2[0] + n1[1] * n2[1] + n1[2] * n2[2] < -0.5) for (const f of [o, t / 3]) for (let q = 0; q < 3; q++) { const v = idx[f * 3 + q]; if (pinned[v] !== true) flag.add(v); }
    }
    if (!flag.size) break;
    for (const v of flag) for (let d = 0; d < 3; d++) pos[v * 3 + d] = (pos[v * 3 + d] + ref[v * 3 + d]) / 2;
    fixed += flag.size;
  }
  return fixed;
}

const QS = new URLSearchParams(typeof location !== 'undefined' ? location.search : '');
const SPIKE_W = Number(QS.get('spikeW') ?? 0.35), EXTRA_IT = Number(QS.get('extraIt') ?? 0);

/** Q5 relax (lab addition): only the vertices of edges whose dihedral angle exceeds the zone limit move halfway towards
 *  their neighbours' mean, until none exceeds it (≤ 100 rounds). Facets below the limit stay as they are. */
function relaxSharp(pos: number[], idx: number[], pinned: (boolean | 'z')[], limitDeg: (v: number) => number, rounds = 150) {
  const n = pos.length / 3, nb = Array.from({ length: n }, () => new Set<number>());
  for (let t = 0; t < idx.length; t += 3) for (let e = 0; e < 3; e++) { const a = idx[t + e], b = idx[t + ((e + 1) % 3)]; nb[a].add(b); nb[b].add(a); }
  const N = nb.map((x) => [...x]);
  const nrm = (a: number, b: number, c: number) => {
    const ux = pos[b * 3] - pos[a * 3], uy = pos[b * 3 + 1] - pos[a * 3 + 1], uz = pos[b * 3 + 2] - pos[a * 3 + 2], vx = pos[c * 3] - pos[a * 3], vy = pos[c * 3 + 1] - pos[a * 3 + 1], vz = pos[c * 3 + 2] - pos[a * 3 + 2];
    const nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx, l = Math.hypot(nx, ny, nz) || 1; return [nx / l, ny / l, nz / l];
  };
  const cosLim = new Float32Array(n); for (let v = 0; v < n; v++) cosLim[v] = Math.cos((limitDeg(v) * Math.PI) / 180);
  let moved = 0;
  for (let round = 0; round < rounds; round++) {
    const fn: number[][] = [], edge = new Map<string, number>(), flag = new Set<number>();
    for (let t = 0; t < idx.length; t += 3) fn.push(nrm(idx[t], idx[t + 1], idx[t + 2]));
    for (let t = 0; t < idx.length; t += 3) for (let e = 0; e < 3; e++) {
      const a = idx[t + e], b = idx[t + ((e + 1) % 3)], k = a < b ? a + '_' + b : b + '_' + a, o = edge.get(k);
      if (o === undefined) { edge.set(k, t / 3); continue; }
      const n1 = fn[o], n2 = fn[t / 3], c = n1[0] * n2[0] + n1[1] * n2[1] + n1[2] * n2[2];
      if (c < Math.max(cosLim[a], cosLim[b])) for (const f of [o, t / 3]) for (let q = 0; q < 3; q++) { const v = idx[f * 3 + q]; if (pinned[v] !== true) flag.add(v); }
    }
    if (!flag.size) break;
    const o = pos.slice();
    for (const v of flag) { let x = 0, y = 0, z = 0; for (const j of N[v]) { x += o[j * 3]; y += o[j * 3 + 1]; z += o[j * 3 + 2]; } const k = N[v].length || 1;
      pos[v * 3] += 0.5 * (x / k - o[v * 3]); pos[v * 3 + 1] += 0.5 * (y / k - o[v * 3 + 1]); pos[v * 3 + 2] += 0.5 * (z / k - o[v * 3 + 2]); }
    moved += flag.size;
  }
  return moved;
}

/** Knete: midpoint subdivision (shared edges) + Taubin λ/μ, pinned vertices stay (scholle-bench.js `soften`, 1:1). */
function soften(pos0: number[], idx0: number[], pin0: (boolean | 'z')[], levels: number): THREE.BufferGeometry {
  let pos = pos0.slice(), idx = idx0.slice();
  const pn = pin0.slice();
  for (let l = 0; l < levels; l++) {
    const mid = new Map<string, number>(), ni: number[] = [];
    const m = (a: number, b: number) => {
      const k = a < b ? a + '_' + b : b + '_' + a; const got = mid.get(k); if (got !== undefined) return got;
      const n = pos.length / 3;
      for (let d = 0; d < 3; d++) pos.push((pos[a * 3 + d] + pos[b * 3 + d]) / 2);
      pn.push(pn[a] === true && pn[b] === true); mid.set(k, n); return n;
    };
    for (let t = 0; t < idx.length; t += 3) { const a = idx[t], b = idx[t + 1], c = idx[t + 2], ab = m(a, b), bc = m(b, c), ca = m(c, a); ni.push(a, ab, ca, ab, b, bc, ca, bc, c, ab, bc, ca); }
    idx = ni;
  }
  const n = pos.length / 3, nb = Array.from({ length: n }, () => new Set<number>());
  for (let t = 0; t < idx.length; t += 3) for (let e = 0; e < 3; e++) { const a = idx[t + e], b = idx[t + ((e + 1) % 3)]; nb[a].add(b); nb[b].add(a); }
  const N = nb.map((s) => [...s]);
  const step = (f: number) => {
    const o = pos.slice();
    for (let i = 0; i < n; i++) {
      if (pn[i] === true) continue;
      const ns = N[i], w = pn[i] === 'z' ? SPIKE_W : 1; let x = 0, y = 0, z = 0;
      for (const j of ns) { x += o[j * 3]; y += o[j * 3 + 1]; z += o[j * 3 + 2]; }
      const k = ns.length || 1;
      pos[i * 3] += w * f * (x / k - o[i * 3]); pos[i * 3 + 1] += w * f * (y / k - o[i * 3 + 1]); pos[i * 3 + 2] += w * f * (z / k - o[i * 3 + 2]);
    }
  };
  const ref = pos.slice();
  for (let it = 0; it < 1 + levels + EXTRA_IT; it++) { step(0.5); step(-0.53); }
  unfold(pos, ref, idx, pn);
  const out = new THREE.BufferGeometry();
  out.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  out.setIndex(idx); out.computeVertexNormals();
  out.userData.pinned = pn.map((p) => p === true);
  return out;
}

/** one level of Phong tessellation (Boubekeur & Alexa 2008, α 0.75) on an indexed body; `w(x, y, z)` scales the lift
 *  (0 = plain midpoint). Pinned flags carry over (a midpoint is pinned when both ends are; its lift is then 0). */
function phongSplit(geo: THREE.BufferGeometry, w: (x: number, y: number, z: number) => number): THREE.BufferGeometry {
  geo.computeVertexNormals();
  const P = geo.attributes.position as THREE.BufferAttribute, N = geo.attributes.normal as THREE.BufferAttribute, ix = geo.index!, pinned: boolean[] = geo.userData.pinned ?? [];
  const pos = Array.from(P.array as Float32Array), pin = pinned.slice(), mid = new Map<string, number>(), out: number[] = [];
  const p = (i: number) => new THREE.Vector3(pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2]), nrm = (i: number) => new THREE.Vector3().fromBufferAttribute(N, i);
  const proj = (q: THREE.Vector3, i: number) => { const pi = p(i), ni = nrm(i); return q.clone().addScaledVector(ni, -q.clone().sub(pi).dot(ni)); };
  const edge = (a: number, b: number) => {
    const k = a < b ? a + '_' + b : b + '_' + a;
    let m = mid.get(k);
    if (m !== undefined) return m;
    const q = p(a).add(p(b)).multiplyScalar(0.5);
    const lift = pinned[a] || pinned[b] ? 0 : 0.75 * w(q.x, q.y, q.z);
    const ph = proj(q, a).add(proj(q, b)).multiplyScalar(0.5), r = q.clone().lerp(ph, lift);
    pos.push(r.x, r.y, r.z); m = pos.length / 3 - 1; pin.push(!!(pinned[a] && pinned[b])); mid.set(k, m);
    return m;
  };
  for (let t = 0; t < ix.count; t += 3) {
    const a = ix.getX(t), b = ix.getX(t + 1), c = ix.getX(t + 2), ab = edge(a, b), bc = edge(b, c), ca = edge(c, a);
    out.push(a, ab, ca, ab, b, bc, ca, bc, c, ab, bc, ca);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(out); g.computeVertexNormals();
  g.userData = { ...geo.userData, pinned: pin };
  geo.dispose();
  return g;
}
