// Form modifiers (Gott-Modus-Spec §2b) as additions to the R2D fields: every island is a clod broken out of the shattered
// earth, with its own outline, rim height, rock walls, terraces and peaks. All analytic, all seeded, nothing hand-placed
// in the mesh. Directions in degrees around the island centre c0 (0 = +x / east, 90 = +z / south, −90 = north).
import { sstep, vnoise, fbm, type P2 } from './math';
import type { IslandForm } from '../spec';

const D2R = Math.PI / 180;
const angDiff = (a: number, b: number) => Math.abs(((a - b + 540) % 360) - 180);

export interface FormField {
  /** 0…1: how much this direction (radians, around c0) belongs to a rock wall */
  cliffW(th: number): number;
  /** wall height at this direction (lab units) */
  wallH(th: number): number;
  /** how far the break cuts into the outline here (> 0 pulls the rim inwards, jagged in top view) */
  cut(th: number): number;
  /** height added at (x, z): rim profile + crags */
  add(x: number, z: number, th: number, tRad: number): number;
  /** soft terrace steps on a height (R2D terrace logic), faded by direction so they run out at the ends */
  terrace(h: number, th: number, k?: number): number;
  /** 0…1 on a terrace riser (stone face) for the height before stepping */
  riser(h: number, th: number, k?: number): number;
  /** 0…1 roll suppression: at a cliff the top runs to the wall instead of rolling off */
  rollK(th: number): number;
  /** 0…1 bare rock on the top (peak cores: the rock breaks out of the meadow) */
  rock(x: number, z: number): number;
  /** abutment niche at this direction: weight 0…1 and the sole height the wall band runs down to */
  niche(th: number): { w: number; soleY: number };
}

export function makeForm(F: IslandForm | undefined, seed: number, c0: P2): FormField {
  const cliffs = F?.cliffs ?? [], rp = F?.rimProfile, crags = F?.crags ?? [], ter = F?.terraces, old = F?.breakAge !== 'fresh';
  const cliffW = (th: number) => {
    let w = 0; const deg = th / D2R;
    for (const c of cliffs) { const d = angDiff(deg, c.dir), half = c.width / 2; w = Math.max(w, 1 - sstep(half - 9, half + 7, d)); }
    return w;
  };
  const wallH = (th: number) => {
    let h = 0; const deg = th / D2R;
    for (const c of cliffs) { const d = angDiff(deg, c.dir), half = c.width / 2, w = 1 - sstep(half - 9, half + 7, d);
      // the wall top is not a level line: it wanders with the break
      h = Math.max(h, w * c.height * (0.8 + 0.35 * vnoise(th * 7.3, 2.1, seed + 77))); }
    return h;
  };
  // jagged break in top view: a few big teeth and smaller ones in between; old breaks weathered (softer, shallower)
  const cut = (th: number) => {
    let w = 0; const deg = th / D2R;
    for (const c of cliffs) { const d = angDiff(deg, c.dir), half = c.width / 2; w = Math.max(w, (c.jag ?? 1) * (1 - sstep(half - 9, half + 7, d))); }
    if (w <= 0) return 0;
    // rounded teeth (§01: zackig, aber Knet-gerundet): smooth waves, no |sin| cusps
    const big = 0.5 + 0.5 * Math.sin(th * 9 + seed * 0.37), small = vnoise(th * 14, 1.7, seed + 91) * 0.5 + 0.5;
    const tooth = old ? 0.55 + 0.25 * big + 0.2 * small : 0.35 + 0.45 * Math.pow(big, 0.6) + 0.3 * small;
    return w * (old ? 5 : 14) * tooth;
  };
  // crag distance (0 = summit, 1 = foot): ridge frame, u along the ridge, v across; the +v side is the break (contours
  // closer = steeper); gullies and ribs run down the flanks (none at the summit and the foot)
  const cragD = (c: NonNullable<IslandForm['crags']>[number], ci: number, x: number, z: number) => {
    const a = (c.dir ?? 0) * D2R, dx = x - c.x, dz = z - c.z, u = dx * Math.cos(a) + dz * Math.sin(a), v = -dx * Math.sin(a) + dz * Math.cos(a);
    const el = c.elong ?? 1, vv = v * (1 + (c.steep ?? 0) * sstep(-0.3 * c.r, 0.3 * c.r, v)), uu = u / el;   // steep side eased in across the crest (a hard switch creased the ridge line)
    let d = Math.hypot(uu, vv) / (c.r * (1 + 0.1 * fbm(x * 0.04, z * 0.04, seed + 31 + ci, 1)));   // only a slow wobble: fine radius noise creased the flanks
    if (d >= 1.25) return d;
    if (c.ribs) { const ph = Math.atan2(vv, uu), rib = Math.sin(ph * c.ribs + 1.7 * fbm(dx * 0.05, dz * 0.05, seed + 33 + ci, 2)); d *= 1 + 0.11 * rib * sstep(0.12, 0.55, d) * (1 - sstep(0.62, 0.92, d)); }   // ribs fade before the foot (they pressed the last contours together)
    return d;
  };
  // the upper half of a peak is bare rock; the boundary wanders (S1 speckle in the shader)
  const rock = (x: number, z: number) => { let r = 0; crags.forEach((c, ci) => { const d = cragD(c, ci, x, z); if (d < 1) r = Math.max(r, 1 - sstep(0.42, 0.62, d + 0.08 * vnoise(x * 0.15, z * 0.15, seed + 37))); }); return r; };
  const add = (x: number, z: number, th: number, tRad: number) => {
    let h = 0;
    if (rp) {
      const belt = sstep(0.35, 0.95, tRad);   // only the outer belt: the rim rises and sinks, the middle stays as it is
      h += belt * rp.amp * Math.sin(th * rp.lobes + (rp.phase ?? 0));
      if (rp.rise) h += belt * rp.rise * Math.cos(th - (rp.riseDir ?? 0) * D2R);
    }
    crags.forEach((c, ci) => {
      const d = cragD(c, ci, x, z);
      if (d >= 1) return;
      const k = Math.cos(d * Math.PI / 2); let p = k * k * (0.85 + 0.15 * k);   // rounded peak, long foot
      // broken-off top: a rounded table at (1 − cut) (smooth min, no edge)
      if (c.cut) { const t = 1 - c.cut, kk = 0.16, hh = Math.max(kk - Math.abs(p - t), 0) / kk; p = Math.min(p, t) - hh * hh * kk * 0.25; }
      h += c.h * p;
    });
    return h;
  };
  // terraces: R2D soft steps; strength by direction (the town side) and fading at the ends, so steps follow the contours
  const terDir = 90 * D2R;
  const terrace = (h: number, th: number, kPath = 1) => {
    if (!ter) return h;   // (a shortcut for h ≤ 0.2 left a small jump at the lowest contour)
    // Lauf 03: risers over the middle third of a contour interval (≈ 40° stone faces, Q5 near the polar centre) with rounded lip and
    // foot, wide treads: readable steps instead of a soft band; paths cut a ramp through them (kPath → 0 on the path)
    const st = ter.step, q = Math.floor(h / st), f = h / st - q, stepped = (q + sstep(0.33, 0.67, f)) * st;
    const k = (1 - sstep(55, 110, angDiff(th / D2R, terDir / D2R))) * kPath;
    return h + (stepped - h) * k;
  };
  // only a real wall stops the top's roll (a break without wall rows, fragments, keeps the R2D roll)
  const riser = (h: number, th: number, kPath = 1) => {
    if (!ter) return 0;
    const f = h / ter.step - Math.floor(h / ter.step), k = (1 - sstep(55, 110, angDiff(th / D2R, terDir / D2R))) * kPath;
    return k * sstep(0.3, 0.38, f) * (1 - sstep(0.62, 0.7, f));
  };
  const rollK = (th: number) => { let w = 0; const deg = th / D2R; for (const c of cliffs) if (c.height > 0) { const d = angDiff(deg, c.dir), half = c.width / 2; w = Math.max(w, 1 - sstep(half - 9, half + 7, d)); } return 1 - w; };
  // niche sectors from c0: the angular span of the plan's corners (the band is the worked rock of the niche walls)
  const nsec = (F?.niches ?? []).map((n) => { const as = n.plan.map((p) => Math.atan2(p[1] - c0[1], p[0] - c0[0])), m = as[0]; const rel = as.map((a) => ((a - m + Math.PI * 3) % (Math.PI * 2)) - Math.PI); return { mid: m + (Math.min(...rel) + Math.max(...rel)) / 2, half: (Math.max(...rel) - Math.min(...rel)) / 2, soleY: n.soleY }; });
  const niche = (th: number) => { let w = 0, soleY = 0; for (const s of nsec) { const d = Math.abs(((th - s.mid + Math.PI * 3) % (Math.PI * 2)) - Math.PI), k = 1 - sstep(s.half, s.half + 8 * D2R, d); if (k > w) { w = k; soleY = s.soleY; } } return { w, soleY }; };
  const rollK0 = rollK, rollKN = (th: number) => Math.min(rollK0(th), 1 - niche(th).w);
  return { cliffW, wallH, cut, add, terrace, riser, rollK: nsec.length ? rollKN : rollK0, rock, niche };
}

/** split (recipe field, built later): a jagged line through the outline gives two outlines with a shared break */
export function splitOutline(poly: P2[], c0: P2, sp: { dir: number; offset: number; gap: number; jag: number }, seed: number): [P2[], P2[]] {
  const nx = Math.cos(sp.dir * D2R), nz = Math.sin(sp.dir * D2R), side = (p: P2) => (p[0] - c0[0]) * nx + (p[1] - c0[1]) * nz - sp.offset;
  const jag = (p: P2) => sp.jag * (vnoise((p[0] * -nz + p[1] * nx) * 0.15, 0.5, seed + 5) - 0.5);
  const a: P2[] = [], b: P2[] = [];
  for (const p of poly) { const s = side(p) + jag(p); if (s < -sp.gap / 2) a.push(p); else if (s > sp.gap / 2) b.push(p); }
  return [a, b];
}
