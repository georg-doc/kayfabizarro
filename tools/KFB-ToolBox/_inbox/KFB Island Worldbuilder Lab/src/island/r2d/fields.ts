// Height, mask and transition weights at any (x, z): one analytic truth for terrain, water, plants and buildings.
// Ported 1:1 from R2D v0 island.js `fields(P)` (Z. 137–163). Lab extensions, each switchable so the port test can run
// with R2D's exact numbers: paths are polylines with a width (R2D: 2-point segments, 2.8 wide), the road answers per
// station (hw, roadY vary along the road; R2D: one value), the embankment width W (R2D: 7) is a function, and
// analytic embeds (earth wedge / talus) are added after the road bed.
import { lerp, sstep, distLine, type P2 } from './math';

export interface R2DPad { x: number; z: number; r: number; h: number; kind?: string; id?: string }
export interface R2DPath { pts: P2[]; w: number }
/** d = distance to the axis, hw = half width, y = height the bed is levelled to, drop = how far below y (R2D: 0.35) */
export interface R2DRoadHit { d: number; hw: number; y: number; drop?: number; /** half width for the sand / paving paint (rule B shoulder: hw reaches further than the paint) */ paintHw?: number }
export interface R2DCreek { pts: P2[]; w: number; cross: P2 | null; dist(x: number, z: number): number }
export interface R2DPlan {
  seed: number;
  /** signed distance to the rim, NEGATIVE inside (R2D convention) */
  sdf(x: number, z: number): number;
  c0: P2;
  NA: number;
  edgeR: Float32Array;
  rAt(th: number): number;
  roll: [number, number];
  natural(x: number, z: number): number;
  pads: R2DPad[];
  plazas: R2DPad[];
  paths: R2DPath[];
  /** nearest road station: distance to the axis, half width, road surface height; null = no road */
  road: ((x: number, z: number) => R2DRoadHit) | null;
  /** embankment width at height difference dh (R2D: 7) */
  slopeW(dh: number): number;
  pond: { x: number; z: number; r: number; h: number } | null;
  creek: R2DCreek | null;
  /** lab: 0…1 rim roll factor at (x, z) (form cliffs: the top runs to the wall); absent = 1 (R2D) */
  rollK?: (x: number, z: number) => number;
}
export type Mask = 'road' | 'water' | 'building' | 'interact' | 'walk' | 'edge' | 'veg';

/** analytic terrain embed: raises the ground towards `y` around a foot line (see IslandField.addEmbed) */
export interface R2DEmbed { rise(x: number, z: number, h: number): number; w(x: number, z: number): [number, number, number] | null }

export interface R2DFields {
  heightAt(x: number, z: number): number;
  maskAt(x: number, z: number): Mask;
  weightsAt(x: number, z: number): [number, number, number];
  /** height before embeds (reference for placing an embedded object) */
  baseAt(x: number, z: number): number;
}

const NO_ROAD: R2DRoadHit = { d: 1e9, hw: 0, y: 0 };

export function fields(P: R2DPlan, embeds: () => Iterable<R2DEmbed> = () => []): R2DFields {
  const { sdf, natural, pads, plazas, paths, pond, creek, roll } = P;
  const roadAt = (x: number, z: number) => (P.road ? P.road(x, z) : NO_ROAD);
  const carveAt = (x: number, z: number): [number, number, number] => {
    if (!creek) return [0, 1e9, 0];
    const dc = creek.dist(x, z);
    let c = 1.1 * (1 - sstep(creek.w, creek.w + 2.6, dc)), k = 0;
    if (creek.cross) { k = 1 - sstep(7, 16, Math.hypot(x - creek.cross[0], z - creek.cross[1])); k *= sstep(3, 15, -sdf(x, z)); c += k * 6.5 * (1 - sstep(creek.w + 1.2, creek.w + 8, dc)); }
    let keep = 0;
    for (const p of [...pads, ...plazas]) keep = Math.max(keep, 1 - sstep(p.r + 0.5, p.r + 3.5, Math.hypot(x - p.x, z - p.z)));
    c *= 1 - keep;
    return [c, dc, k * (1 - keep)];
  };
  const baseAt = (x: number, z: number) => {
    const e = -sdf(x, z);
    let h = natural(x, z) - (P.rollK ? P.rollK(x, z) : 1) * roll[0] * Math.pow(1 - sstep(0, roll[1], e), 2);
    for (const p of [...pads, ...plazas]) { const w = 1 - sstep(p.r, p.r + 4, Math.hypot(x - p.x, z - p.z)); h = lerp(h, p.h, w); }
    if (pond) { const dp = Math.hypot(x - pond.x, z - pond.z); h = lerp(h, pond.h, 1 - sstep(pond.r + 1, pond.r + 5, dp)); h -= 0.9 * Math.pow(1 - sstep(0, pond.r + 0.6, dp), 0.7); }
    const R = roadAt(x, z);
    if (R.d < 1e8) { const W = P.slopeW(h - R.y), w = 1 - sstep(R.hw, R.hw + W, R.d); h = lerp(h, R.y - (R.drop ?? 0.35), w); }
    return h - carveAt(x, z)[0];
  };
  const heightAt = (x: number, z: number) => { let h = baseAt(x, z); for (const e of embeds()) h = e.rise(x, z, h); return h; };
  const weightsAt = (x: number, z: number): [number, number, number] => {
    const R = roadAt(x, z);
    const pw = R.paintHw ?? R.hw;
    let sand = R.d < 1e8 ? 1 - sstep(pw + 0.6, pw + 3.4, R.d) : 0, pav = 0;
    if (pond) sand = Math.max(sand, 1 - sstep(pond.r + 0.8, pond.r + 3.6, Math.hypot(x - pond.x, z - pond.z)));
    for (const p of [...pads, ...plazas]) pav = Math.max(pav, 1 - sstep(p.r - 1.2, p.r + 1.4, Math.hypot(x - p.x, z - p.z)));
    // R2D: path 2.8 wide, weight 0.8 … 2.4 = hw − 0.6 … hw + 1.0
    for (const s of paths) { const hw = s.w / 2; pav = Math.max(pav, 1 - sstep(hw - 0.6, hw + 1.0, distLine(x, z, s.pts))); }
    let rock = 0;
    if (creek) { const [, dc, k] = carveAt(x, z); sand = Math.max(sand, 1 - sstep(creek.w + 0.6, creek.w + 3, dc)); rock = Math.max(rock, k * (1 - sstep(creek.w + 1, creek.w + 6, dc))); }
    for (const e of embeds()) { const w = e.w(x, z); if (w) { sand = Math.max(sand, w[0]); pav = Math.max(pav, w[1]); rock = Math.max(rock, w[2]); } }
    return [sand, pav, rock];
  };
  const maskAt = (x: number, z: number): Mask => {
    const e = -sdf(x, z), R = roadAt(x, z);
    if (R.d < (R.paintHw ?? R.hw)) return 'road';
    if (creek && creek.dist(x, z) < creek.w + 0.8) return 'water';
    if (pond && Math.hypot(x - pond.x, z - pond.z) < pond.r + 1.5) return 'water';
    for (const p of pads) if (Math.hypot(x - p.x, z - p.z) < p.r) return 'building';
    for (const p of plazas) if (Math.hypot(x - p.x, z - p.z) < p.r) return 'interact';
    for (const s of paths) if (distLine(x, z, s.pts) < s.w / 2) return 'walk';
    return e < 2.2 ? 'edge' : 'veg';
  };
  return { heightAt, maskAt, weightsAt, baseAt };
}
