// planFromSpec: the R2D island plan (island.js `planIsland`, Z. 60–136) built from lab data instead of R2D's own
// blob outline + Track Core road (STAGE1_R2D_PORT_PLAN §2). The outline editor stays owner of the outline; R2D adds its
// clay wobble (+2.2·fbm − 0.4) on top. Hills, roll and pads follow R2D; the lab adds `mount` (bell, plateau, mountain)
// as a parameter of natural(), never as separate terrain.
import { fbm, sstep, lerp, distSeg, type P2 } from './math';
import type { R2DPad, R2DPath, R2DPlan, R2DRoadHit } from './fields';
import { centroid, bounds, signedDist } from '../shape';
import type { IslandSpec } from '../spec';
import { makeForm, type FormField } from './form';

/** R2D biome terrain row (`BIOMES[b].terr`): hill amplitude / frequency, optional terraces, rim roll [depth, width] */
export interface R2DTerr { amp: number; fq: number; terrace: number; roll: [number, number] }
/** lab mount: bell (flat 0), plateau (flat > 0: flat-topped, irregular rim) or mountain (bell, high) */
export interface R2DMount { x: number; z: number; r: number; h: number; flat?: number }

/** R2D natural(): two fBm octaves in world units, optional soft terraces. Exported for the port test. */
export function makeNatural(T: R2DTerr, seed: number): (x: number, z: number) => number {
  return (x, z) => {
    let h = T.amp * (1.7 * fbm(x * 0.03 * T.fq, z * 0.03 * T.fq, seed + 5) + 0.55 * fbm(x * 0.09 * T.fq, z * 0.09 * T.fq, seed + 9));
    if (T.terrace) { const st = T.terrace, q = Math.floor(h / st), f = h / st - q; h = (q + sstep(0.35, 0.65, f)) * st; }
    return h;
  };
}

/**
 * Lab mount as height add-on. The rim of the cap wanders with the angle (fbm on the direction, ±18 % radius) and the
 * slope width changes too, so a plateau reads as a hill the town was built on, not as a tray (Steuerung F2).
 */
export function mountHeight(M: R2DMount, seed: number): (x: number, z: number) => number {
  const flat = M.flat ?? 0;
  return (x, z) => {
    const dx = x - M.x, dz = z - M.z, d = Math.hypot(dx, dz);
    if (d > M.r * 1.4) return 0;
    const a = Math.atan2(dz, dx), ca = Math.cos(a) * 1.6, sa = Math.sin(a) * 1.6;
    const rr = M.r * (1 + 0.18 * fbm(ca + 3.1, sa - 1.7, seed + 41, 3));
    const u = d / rr;
    if (flat > 0) {
      const f = flat * (1 + 0.25 * fbm(ca - 5.3, sa + 2.9, seed + 43, 3));   // the slope starts at a wandering line
      const k = 1 - sstep(f, 1, u);
      return M.h * k;
    }
    const k = 1 - sstep(0, 1, u);
    return M.h * k * (0.7 + 0.3 * k);   // round top, long foot
  };
}

/** Signed-distance grid over the polygon (bilinear): paintMaps alone asks ~1 M times. Positive inside, like shape.ts. */
function sdGrid(poly: P2[]) {
  const b = bounds(poly), pad = 8, x0 = b.x0 - pad, z0 = b.z0 - pad, W = Math.max(b.x1 - b.x0, b.z1 - b.z0) + 2 * pad;
  const step = Math.max(W < 120 ? 0.15 : 0.5, W / 512), N = Math.ceil(W / step) + 1, g = new Float32Array(N * N);   // small outlines (fragments): finer, the 0.5 grid kinked the rim roll
  for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) g[j * N + i] = signedDist(x0 + i * step, z0 + j * step, poly);
  return (x: number, z: number) => {
    const fi = (x - x0) / step, fj = (z - z0) / step;
    if (fi < 0 || fj < 0 || fi >= N - 1 || fj >= N - 1) return signedDist(x, z, poly);
    const i = Math.floor(fi), j = Math.floor(fj), u = fi - i, v = fj - j, o = j * N + i;
    return lerp(lerp(g[o], g[o + 1], u), lerp(g[o + N], g[o + N + 1], u), v);
  };
}

/** distance to the nearest path edge on a grid (bilinear), like sdGrid */
function pathDistGrid(poly: P2[], paths: R2DPath[]) {
  const b = bounds(poly), pad = 8, x0 = b.x0 - pad, z0 = b.z0 - pad, W = Math.max(b.x1 - b.x0, b.z1 - b.z0) + 2 * pad;
  const step = Math.max(0.5, W / 512), N = Math.ceil(W / step) + 1, g = new Float32Array(N * N);
  for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
    const x = x0 + i * step, z = z0 + j * step; let d = 1e9;
    for (const p of paths) for (let k = 0; k < p.pts.length - 1; k++) d = Math.min(d, distSeg(x, z, p.pts[k], p.pts[k + 1]) - p.w / 2);
    g[j * N + i] = d;
  }
  return (x: number, z: number) => {
    const fi = (x - x0) / step, fj = (z - z0) / step;
    if (fi < 0 || fj < 0 || fi >= N - 1 || fj >= N - 1) return 1e9;
    const i = Math.floor(fi), j = Math.floor(fj), u = fi - i, v = fj - j, o = j * N + i;
    return lerp(lerp(g[o], g[o + 1], u), lerp(g[o + N], g[o + N + 1], u), v);
  };
}

export interface PlanInput {
  spec: IslandSpec;
  /** the polygon IslandField builds from the editor outline (sampleOutline + polygonize) */
  poly: P2[];
  terr: R2DTerr;
  /** composition from IslandField: plazas and footpaths (polyline + width) */
  plazas: { x: number; z: number; r: number }[];
  paths: R2DPath[];
  road: ((x: number, z: number) => R2DRoadHit) | null;
  mount?: R2DMount | null;
  /** polar resolution (angles); R2D 192, scaled with the rim length */
  NA?: number;
}

export function planFromSpec(I: PlanInput): R2DPlan & { star: { rays: number; bad: number }; mount: R2DMount | null; poly: P2[]; form: FormField; riser: (x: number, z: number) => number; rAt0: (th: number) => number } {
  const { spec, terr } = I, seed = spec.seed, sd = sdGrid(I.poly);
  const c0 = centroid(I.poly), form = makeForm(spec.form, seed, c0), thOf = (x: number, z: number) => Math.atan2(z - c0[1], x - c0[0]);
  // + form.cut: the break (cliff sectors) pulls the rim inwards, jagged in top view
  const wob = spec.outlineExact ? 0 : 1;
  const sdf0 = (x: number, z: number) => -sd(x, z) + wob * (2.2 * fbm(x * 0.04, z * 0.04, seed + 3) - 0.4) + form.cut(thOf(x, z));
  // abutments: a straight face across the anchor direction (cut where the rim bulges, filled where it bays), blended out
  // over 14 sideways (8 cornered against a break wall, Q5) and 10–18 in depth
  const abut = (spec.form?.abutments ?? []).map((ab) => { const an = spec.anchors?.find((a) => a.id === ab.anchor); if (!an?.p || !an.dir) return null; const l = Math.hypot(an.dir[0], an.dir[1]) || 1; return { px: an.p[0], pz: an.p[1], dx: an.dir[0] / l, dz: an.dir[1] / l, half: ab.half ?? 12 }; }).filter(Boolean) as { px: number; pz: number; dx: number; dz: number; half: number }[];
  // abutment niches (RKIT cut): the plan is cut out of the outline with a clay-rounded smooth max (k 2.5)
  const niches = (spec.form?.niches ?? []).map((n) => n.plan as P2[]);
  const smax = (a: number, b: number, k: number) => { const h = Math.max(k - Math.abs(a - b), 0) / k; return Math.max(a, b) + h * h * k * 0.25; };
  const sdf = abut.length || niches.length ? (x: number, z: number) => {
    let d = sdf0(x, z);
    for (const a of abut) { const dp = (x - a.px) * a.dx + (z - a.pz) * a.dz, lat = -(x - a.px) * a.dz + (z - a.pz) * a.dx, w = (1 - sstep(a.half, a.half + 14, Math.abs(lat))) * (1 - sstep(10, 18, Math.abs(dp))); d = d * (1 - w) + dp * w; }
    for (const pl of niches) d = smax(d, signedDist(x, z, pl), 5);
    return d;
  } : sdf0;
  let per = 0;
  for (let i = 0; i < I.poly.length; i++) { const a = I.poly[i], b = I.poly[(i + 1) % I.poly.length]; per += Math.hypot(b[0] - a[0], b[1] - a[1]); }
  const NA = I.NA ?? Math.max(192, Math.round(per / 1.3 / 32) * 32);
  const b = bounds(I.poly), maxR = Math.hypot(b.x1 - b.x0, b.z1 - b.z0);
  const edgeR = new Float32Array(NA);
  let bad = 0;
  for (let a = 0; a < NA; a++) {
    const th = (a / NA) * Math.PI * 2, cx = Math.cos(th), cz = Math.sin(th);
    let r = 0;
    while (r < maxR && sdf(c0[0] + cx * r, c0[1] + cz * r) < 0) r += 0.5;
    let lo = Math.max(0, r - 0.5), hi = r;
    for (let k = 0; k < 7; k++) { const m = (lo + hi) / 2; if (sdf(c0[0] + cx * m, c0[1] + cz * m) < 0) lo = m; else hi = m; }
    edgeR[a] = lo;
    // star shape: land again further out on this ray = a bay the polar net cuts off
    for (let rr = r + 1; rr < maxR; rr += 1) if (sdf(c0[0] + cx * rr, c0[1] + cz * rr) < -0.5) { bad++; break; }
  }
  const rAt = (th: number) => { const f = (((th / (Math.PI * 2)) % 1) + 1) % 1 * NA, i = Math.floor(f), t = f - i; return lerp(edgeR[i % NA], edgeR[(i + 1) % NA], t); };
  // rim without the niches: below an abutment niche's sole the island body still reaches out to it (RKIT's bench)
  let rAt0 = rAt;
  if (niches.length) {
    const sdfNN = abut.length ? (x: number, z: number) => { let d = sdf0(x, z); for (const a of abut) { const dp = (x - a.px) * a.dx + (z - a.pz) * a.dz, lat = -(x - a.px) * a.dz + (z - a.pz) * a.dx, w = (1 - sstep(a.half, a.half + 14, Math.abs(lat))) * (1 - sstep(10, 18, Math.abs(dp))); d = d * (1 - w) + dp * w; } return d; } : sdf0;
    const e0 = new Float32Array(NA);
    for (let a = 0; a < NA; a++) { const th = (a / NA) * Math.PI * 2, cx = Math.cos(th), cz = Math.sin(th); let r = 0; while (r < maxR && sdfNN(c0[0] + cx * r, c0[1] + cz * r) < 0) r += 0.5; let lo = Math.max(0, r - 0.5), hi = r; for (let k = 0; k < 7; k++) { const m = (lo + hi) / 2; if (sdfNN(c0[0] + cx * m, c0[1] + cz * m) < 0) lo = m; else hi = m; } e0[a] = lo; }
    rAt0 = (th: number) => { const f = (((th / (Math.PI * 2)) % 1) + 1) % 1 * NA, i = Math.floor(f), t = f - i; return lerp(e0[i % NA], e0[(i + 1) % NA], t); };
    // the niche's side walls are radial, so the polar net takes each of them in ONE angular step: its outer (convex) corner
    // was a vertical crease of 60–80° (Q5). Rounded by smoothing the rim radius over the neighbouring angles, but only
    // ever inwards (min): rock is taken away at the mouth, never added into RKIT's cut
    const near = new Uint8Array(NA);
    for (let a = 0; a < NA; a++) if (e0[a] - edgeR[a] > 0.05) for (let k = -4; k <= 4; k++) near[(a + k + NA) % NA] = 1;
    for (let it = 0; it < 3; it++) {
      const o = edgeR.slice();
      for (let a = 0; a < NA; a++) if (near[a]) edgeR[a] = Math.min(o[a], (o[(a + NA - 1) % NA] + 2 * o[a] + o[(a + 1) % NA]) / 4);
    }
  }
  const nat0 = makeNatural(terr, seed), M = I.mount ?? null, mh = M ? mountHeight(M, seed) : null;
  // terraces step down the HILL towards the town side: their direction is measured from the mount's centre (from c0 the
  // castle hill's slope lay mostly outside the town-side sector, Lauf 03)
  const thT = (x: number, z: number, th: number) => (M ? Math.atan2(z - M.z, x - M.x) : th);
  // ramps: where a path crosses the terraces the steps fade out (path distance from a grid, only with terraces)
  const pd = spec.form?.terraces && I.paths.length ? pathDistGrid(I.poly, I.paths) : null;
  // natural = R2D hills + mount, soft-stepped by the terraces, plus rim profile and crags (form §2b)
  const natural = (x: number, z: number) => {
    const th = thOf(x, z), tRad = Math.hypot(x - c0[0], z - c0[1]) / Math.max(1, rAt(th));
    const kp = pd ? sstep(2, 14, pd(x, z)) : 1;   // wide, soft ramp (steep cut walls read as brown scars)
    return form.terrace(nat0(x, z) + (mh ? mh(x, z) : 0), thT(x, z, th), kp) + form.add(x, z, th, tRad);
  };
  // terrace risers as stone faces (rock weight on the top mesh), the same ramp fade as the steps
  const riser = (x: number, z: number) => spec.form?.terraces ? form.riser(nat0(x, z) + (mh ? mh(x, z) : 0), thT(x, z, thOf(x, z)), pd ? sstep(2, 14, pd(x, z)) : 1) : 0;
  // pads from the placed buildings: ground height at the building (lab: "h = Grundhöhe am Gebäude")
  const pads: R2DPad[] = spec.buildings.filter((bd) => bd.pad > 0).map((bd, i) => ({ id: bd.id, x: bd.x, z: bd.z, r: bd.pad, h: natural(bd.x, bd.z), kind: i === 0 ? 'landmark' : 'house' }));
  const plazas: R2DPad[] = I.plazas.map((p) => ({ x: p.x, z: p.z, r: p.r, h: natural(p.x, p.z), kind: 'small' }));
  const P = spec.terrain.pond;
  const pond = P ? { x: P.x, z: P.z, r: P.r, h: natural(P.x, P.z) + 0.1 } : null;
  return {
    seed, sdf, c0, NA, edgeR, rAt, roll: terr.roll, natural, pads, plazas, paths: I.paths, road: I.road,
    slopeW: (dh: number) => Math.max(7, 1.5 * Math.abs(dh)), pond, creek: null,
    rollK: (x: number, z: number) => form.rollK(thOf(x, z)),
    star: { rays: NA, bad }, mount: M, poly: I.poly, form, riser, rAt0,
  };
}
