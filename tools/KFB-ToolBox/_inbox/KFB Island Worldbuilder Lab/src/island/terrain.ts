// Island ground: height field inside the outline, top surface mesh (Delaunay over edge + interior points),
// torn-earth underside (faceted cone with strata bands) and the pond water sheet.
import * as THREE from 'three';
import Delaunator from 'delaunator';
import cdt2d from 'cdt2d';
import type { RoadBedField } from './roadbed';
import { sampleOutline, polygonize, signedDist, distToPoly, centroid, bounds, isCCW, type P2 } from './shape';
import { fbm, smooth, lerp, rng, vnoise } from './noise';
import type { IslandSpec } from './spec';
import { ENV_ROLES, type IslandPalette } from '../palettes';
import { softenGeometry } from '../clay/clay-soften';

const LIP = -0.45; // rounded edge: the top rolls down this far over the last ROLL metres into the grass band
const ROLL = 1.6;

/** Outward unit normal of the outline at point i. */
function outward(B: P2[], i: number, ccw: boolean): [number, number] {
  const n = B.length, p = B[(i - 1 + n) % n], q = B[(i + 1) % n];
  let tx = q[0] - p[0], tz = q[1] - p[1];
  const L = Math.hypot(tx, tz) || 1;
  tx /= L; tz /= L;
  return ccw ? [tz, -tx] : [-tz, tx];
}

/** Bottom of the grass band per outline point: wavy, so grass meets earth in an irregular line. */
export function grassBottom(f: IslandField): Float32Array {
  const W = f.radius * 2, grassT = Math.max(0.6, 0.03 * W), n = f.poly.length, out = new Float32Array(n);
  for (let i = 0; i < n; i++) out[i] = LIP - grassT * (1 + 0.7 * (vnoise(i * 0.21, 5, f.spec.seed + 3) - 0.5));
  return out;
}

/**
 * Terrain embedding of one object (agreed with the Environment kit, Bauweise „Wie liegt was in der Landschaft“):
 * the terrain itself is deformed around the object's foot line instead of gluing on a mound mesh.
 * footprint: foot line in object space (x, z), transformed by x/z/rot/scale into island space.
 * rise: how high the ground runs up the object at the foot line; falloff: width of that run-up;
 * downhill 0–1: asymmetry. boulder = earth wedge uphill (rock sits deeper uphill, freer downhill);
 * outcrop = talus elongated downhill; others symmetric. slope = downhill direction (else terrain gradient).
 */
export interface TerrainEmbed {
  id: string;
  kind: 'boulder' | 'outcrop' | 'rim' | 'shrub' | 'tree' | 'prop';
  x: number; z: number; rot?: number; scale?: number;
  footprint: P2[];
  sink: number; rise: number; falloff: number; downhill?: number;
  slope?: [number, number];
  /** darker earth on the terrain itself (drip line, crown shadow, contact): radius around the centre, strength 0–1 */
  contact?: { radius: number; strength: number };
}
interface EmbedLive extends TerrainEmbed { poly: P2[]; cx: number; cz: number; down: [number, number]; x0: number; x1: number; z0: number; z1: number; ref: number }

export class IslandField {
  readonly poly: P2[];
  readonly c: P2;
  readonly radius: number;
  private padH = new Map<string, number>();
  private embeds = new Map<string, EmbedLive>();
  /** composition: landmark spot, open zone (≥ 30% kept free), a footpath from the edge across the open zone */
  readonly landmark: P2;
  readonly openC: P2;
  readonly openR: number;
  readonly path: P2[];
  /** all footpaths (main + branch) and the small plazas they end in */
  readonly paths: P2[][] = [];
  readonly pathW: number[] = [];
  readonly plazas: { x: number; z: number; r: number }[] = [];
  /** where a track / bridge will arrive: on the rim, facing outwards */
  readonly connector: { x: number; z: number; dx: number; dz: number };

  /** road bed from RKIT (kfb.road-bed/1): terrain is cut at the mask and sewn to the seam; null = no road */
  readonly road: RoadBedField | null;

  constructor(readonly spec: IslandSpec, road: RoadBedField | null = null) {
    this.road = road;
    this.poly = polygonize(sampleOutline(spec.outline, 0.8), spec.seed, 1.1);
    this.c = centroid(this.poly);
    let r = 0;
    for (const [x, z] of this.poly) r += Math.hypot(x - this.c[0], z - this.c[1]);
    this.radius = r / this.poly.length;
    const b0 = spec.buildings[0];
    this.landmark = b0 ? [b0.x, b0.z] : [this.c[0], this.c[1]];
    // the landmark's front decides where the forecourt, the open zone and the arrival path go:
    // its facing (rot, +z local) blended with the direction towards the island centre
    let dx = this.c[0] - this.landmark[0], dz = this.c[1] - this.landmark[1];
    let L = Math.hypot(dx, dz);
    if (L < 2) { const a = spec.seed * 2.39; dx = Math.cos(a); dz = Math.sin(a); L = 1; }
    dx /= L; dz /= L;
    if (b0) { const fx = Math.sin(b0.rot), fz = Math.cos(b0.rot); dx = fx * 0.75 + dx * 0.25; dz = fz * 0.75 + dz * 0.25; const l2 = Math.hypot(dx, dz) || 1; dx /= l2; dz /= l2; }
    this.openC = [this.c[0] + dx * this.radius * 0.38, this.c[1] + dz * this.radius * 0.38];
    this.openR = this.radius * 0.5;
    let best = this.poly[0], bd = -Infinity;
    for (const p of this.poly) { const d = (p[0] - this.c[0]) * dx + (p[1] - this.c[1]) * dz; if (d > bd) { bd = d; best = p; } }
    // the main path starts just inside the rim: this is where a track / bridge connects later
    let E: P2 = [best[0] - dx * 2.2, best[1] - dz * 2.2];
    this.connector = { x: best[0], z: best[1], dx, dz };
    const anc = road?.spec.anchors[0];
    if (road && anc) {
      // island footpath starts at the seam in front of the D2 anchor (the junction piece itself is RKIT's)
      const [ax, , az] = anc.p, [ux, , uz] = anc.dir;
      let t = 0;
      while (t < 30 && road.inMask(ax + ux * t, az + uz * t)) t += 0.25;
      E = [ax + ux * (t + 0.4), az + uz * (t + 0.4)];
      this.connector = { x: ax, z: az, dx: -ux, dz: -uz };
    }
    const pad = b0 ? b0.pad + 0.5 : 0;
    const Lf: P2 = [this.landmark[0] + dx * pad, this.landmark[1] + dz * pad];
    const side = (vnoise(spec.seed, 3, 1) - 0.5) * this.radius * 0.3;
    const M: P2 = [(E[0] + Lf[0]) / 2 - dz * side, (E[1] + Lf[1]) / 2 + dx * side];
    this.path = [];
    for (let k = 0; k <= 24; k++) {
      const t = k / 24, u = 1 - t;
      this.path.push([u * u * E[0] + 2 * u * t * M[0] + t * t * Lf[0], u * u * E[1] + 2 * u * t * M[1] + t * t * Lf[1]]);
    }
    this.paths.push(this.path);
    this.pathW.push(3.2);
    // branch from the middle of the main path to a destination: the pond shore, else a rim viewpoint
    const mid = this.path[12];
    let T: P2;
    const P = spec.terrain.pond;
    if (P) {
      const a = Math.atan2(mid[1] - P.z, mid[0] - P.x);
      T = [P.x + Math.cos(a) * (P.r * 1.55 + 1.2), P.z + Math.sin(a) * (P.r * 1.55 + 1.2)]; // stops on the shore, never in the water
    } else {
      const a = Math.atan2(dz, dx) + Math.PI / 2 * (side > 0 ? 1 : -1);
      let bp = this.poly[0], bb = -Infinity;
      for (const p of this.poly) { const d = (p[0] - this.c[0]) * Math.cos(a) + (p[1] - this.c[1]) * Math.sin(a); if (d > bb) { bb = d; bp = p; } }
      T = [bp[0] - Math.cos(a) * 3.0, bp[1] - Math.sin(a) * 3.0];
    }
    const C: P2 = [(mid[0] + T[0]) / 2 + (T[1] - mid[1]) * 0.18, (mid[1] + T[1]) / 2 - (T[0] - mid[0]) * 0.18];
    const br: P2[] = [];
    for (let k = 0; k <= 16; k++) {
      const t = k / 16, u = 1 - t;
      br.push([u * u * mid[0] + 2 * u * t * C[0] + t * t * T[0], u * u * mid[1] + 2 * u * t * C[1] + t * t * T[1]]);
    }
    this.paths.push(br);
    this.pathW.push(2.4);
    // paths go around the pond, never across the water
    if (P) {
      const keep = P.r * 1.55 + 2;
      for (const line of this.paths) for (const p of line) {
        const vx = p[0] - P.x, vz = p[1] - P.z, d = Math.hypot(vx, vz);
        if (d < keep && d > 1e-3) { p[0] = P.x + (vx / d) * keep; p[1] = P.z + (vz / d) * keep; }
      }
    }
    // no island path inside the road's clear zone
    if (road) for (let k = 0; k < this.paths.length; k++) {
      const kept = this.paths[k].filter((p) => !road.inClear(p[0], p[1]));
      this.paths[k].length = 0;
      this.paths[k].push(...kept);
    }
  }

  /**
   * Register (or replace, same id) a terrain embedding. Returns the reference ground height under the foot
   * (before any embedding) so the caller can place the object at ref − sink. Rebuild the ground mesh afterwards
   * (Island.rebuildGround()) to see the deformation.
   */
  addEmbed(e: TerrainEmbed): { ref: number; down: [number, number] } {
    const c = Math.cos(e.rot ?? 0), s = Math.sin(e.rot ?? 0), k = e.scale ?? 1;
    const poly: P2[] = e.footprint.map(([px, pz]) => [e.x + (px * c + pz * s) * k, e.z + (-px * s + pz * c) * k]);
    let x0 = Infinity, x1 = -Infinity, z0 = Infinity, z1 = -Infinity;
    for (const [x, z] of poly) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); z0 = Math.min(z0, z); z1 = Math.max(z1, z); }
    let down: [number, number];
    if (e.slope) { const l = Math.hypot(...e.slope) || 1; down = [e.slope[0] / l, e.slope[1] / l]; }
    else {
      const g = 0.75, dx = this.raw(e.x + g, e.z).h - this.raw(e.x - g, e.z).h, dz = this.raw(e.x, e.z + g).h - this.raw(e.x, e.z - g).h, l = Math.hypot(dx, dz);
      down = l > 1e-4 ? [-dx / l, -dz / l] : [0, 1];
    }
    this.embeds.delete(e.id);
    let ref = 0;
    for (const [x, z] of poly) ref += this.base(x, z);
    ref /= poly.length || 1;
    const pad = e.falloff * (1 + (e.downhill ?? 0));
    this.embeds.set(e.id, { ...e, poly, cx: e.x, cz: e.z, down, x0: x0 - pad, x1: x1 + pad, z0: z0 - pad, z1: z1 + pad, ref });
    return { ref, down };
  }

  removeEmbed(id: string) { this.embeds.delete(id); }
  /** terrain vertex shade from embed contacts (1 = unchanged) */
  contactShade(x: number, z: number): number {
    let k = 1;
    for (const e of this.embeds.values()) {
      if (!e.contact) continue;
      const d = Math.hypot(x - e.cx, z - e.cz);
      if (d < e.contact.radius) { const t = 1 - d / e.contact.radius; k *= 1 - e.contact.strength * t * t; }
    }
    return k;
  }

  /**
   * Rim rocks are part of the island body: the grass band stays closed (no cut faces, no hole to the underside),
   * but its outward roll flattens towards the rock over about one foot radius and is flush under the foot line,
   * so the rock covers it instead of the band poking out. 1 = normal roll, 0 = flush.
   */
  bandTaper(x: number, z: number): number {
    let k = 1;
    for (const e of this.embeds.values()) {
      if (e.kind !== 'rim' || x < e.x0 - 4 || x > e.x1 + 4 || z < e.z0 - 4 || z > e.z1 + 4) continue;
      let r = 0; for (const [px, pz] of e.poly) r += Math.hypot(px - e.cx, pz - e.cz); r /= e.poly.length || 1;
      const out = -signedDist(x, z, e.poly) - 0.3; // distance outside the (slightly grown) foot line
      k = Math.min(k, out <= 0 ? 0 : smooth(0, Math.max(1.2, r), out));
    }
    return k;
  }

  /** foot lines + run-up widths, for denser terrain sampling around embedded objects */
  embedRings(): { poly: P2[]; fall: number }[] { return [...this.embeds.values()].map((e) => ({ poly: e.poly, fall: e.falloff * (1 + (e.downhill ?? 0)) })); }
  clearEmbeds() { this.embeds.clear(); }

  /** terrain run-up of all embeds at (x, z) (added to the base height) */
  private embedRise(x: number, z: number, h: number): number {
    let out = h;
    for (const e of this.embeds.values()) {
      if (x < e.x0 || x > e.x1 || z < e.z0 || z > e.z1 || e.rise <= 0) continue;
      const sd = signedDist(x, z, e.poly); // > 0 inside the foot line
      // direction from the object centre: +1 = uphill, −1 = downhill
      const vx = x - e.cx, vz = z - e.cz, vl = Math.hypot(vx, vz) || 1;
      const up = -(vx * e.down[0] + vz * e.down[1]) / vl;
      const dh = e.downhill ?? 0;
      let fall = e.falloff, rise = e.rise;
      if (e.kind === 'boulder') rise *= Math.max(0, 1 + dh * up) / (1 + dh);           // earth wedge uphill
      else if (e.kind === 'outcrop') fall *= 1 + dh * Math.max(0, -up) * 1.5;           // talus runs out downhill
      const d = Math.max(0, -sd);
      if (d >= fall) continue;
      const t = 1 - d / fall, prof = t * t; // concave run-up, steepest at the foot line
      const target = e.ref + rise;
      if (sd >= 0) out = Math.max(out, target); // under the object: up to the run-up height (hidden, keeps the seam closed)
      else out = Math.max(out, lerp(out, target, prof));
    }
    return out;
  }

  /** road / slope / clear zone: no plants, props or paths here (consumed by the Environment kit) */
  isClear(x: number, z: number): boolean {
    return this.road ? this.road.inClear(x, z) : false;
  }

  pathDist(x: number, z: number): number {
    let best = Infinity;
    for (const q of this.plazas) best = Math.min(best, Math.hypot(x - q.x, z - q.z) - q.r + 1.2);
    for (const path of this.paths) for (let i = 1; i < path.length; i++) {
      const [ax, az] = path[i - 1], [bx, bz] = path[i];
      const vx = bx - ax, vz = bz - az, L = vx * vx + vz * vz || 1e-9;
      const t = Math.max(0, Math.min(1, ((x - ax) * vx + (z - az) * vz) / L));
      best = Math.min(best, Math.hypot(ax + vx * t - x, az + vz * t - z));
    }
    return best;
  }

  /** signed distance to the path bed (negative = on a path or plaza) */
  bed(x: number, z: number): number {
    let best = Infinity;
    for (const q of this.plazas) best = Math.min(best, Math.hypot(x - q.x, z - q.z) - q.r);
    this.paths.forEach((path, k) => {
      const hw = this.pathW[k] / 2;
      for (let i = 1; i < path.length; i++) {
        const [ax, az] = path[i - 1], [bx, bz] = path[i];
        const vx = bx - ax, vz = bz - az, L = vx * vx + vz * vz || 1e-9;
        const t = Math.max(0, Math.min(1, ((x - ax) * vx + (z - az) * vz) / L));
        best = Math.min(best, Math.hypot(ax + vx * t - x, az + vz * t - z) - hw);
      }
    });
    return best;
  }

  inOpen(x: number, z: number): boolean {
    return Math.hypot(x - this.openC[0], z - this.openC[1]) < this.openR;
  }

  sd(x: number, z: number) {
    return signedDist(x, z, this.poly);
  }

  /** Height without building pads. Returns parts for colouring. */
  raw(x: number, z: number, sd = this.sd(x, z)) {
    const T = this.spec.terrain, s = this.spec.seed;
    if (sd <= 0) return { h: LIP, hills: 0, mount: 0, basin: 0, sd };
    const roll = sd < ROLL ? LIP * (1 - sd / ROLL) ** 2 : 0;
    const lip = roll;
    let inner = smooth(1.5, 9, sd);
    let basin = 0;
    if (T.pond) {
      const dp = Math.hypot(x - T.pond.x, z - T.pond.z), R = T.pond.r * 1.3;
      if (dp < R) basin = 1.5 * Math.pow(1 - (dp / R) ** 2, 1.4);
      inner *= smooth(T.pond.r * 0.9, T.pond.r * 1.8, dp);
    }
    if (T.beach > 0) inner *= smooth(T.beach * 0.7, T.beach * 1.6, sd);
    const hills = (fbm(x * T.hillScale + s * 3.1, z * T.hillScale - s * 1.7, s) - 0.42) * 2 * T.hills * inner;
    let mount = 0;
    if (T.mount) {
      const dm = Math.hypot(x - T.mount.x, z - T.mount.z) / T.mount.r;
      if (dm < 1) {
        const k = 1 - dm * dm;
        mount = T.mount.h * k * k * (0.8 + 0.4 * fbm(x * 0.2, z * 0.2, s + 9)) * smooth(0.5, 4, sd);
      }
    }
    return { h: lip + Math.max(hills, -0.4) + mount - basin, hills, mount, basin, sd };
  }

  /** ground height with the path bed pressed in (paths lie in it, the terrain never pokes through) */
  height(x: number, z: number): number {
    const h = this.base(x, z);
    const b = this.bed(x, z);
    return b < 0.9 ? h - 0.24 * (1 - smooth(-0.1, 0.9, b)) : h;
  }

  /** ground height without the path bed */
  base(x: number, z: number): number {
    const r = this.raw(x, z);
    let h = r.h;
    if (this.road) {
      const { d, y } = this.road.seamNear(x, z);
      if (d < this.road.falloff) h = lerp(y, h, smooth(0, this.road.falloff, d));
    }
    if (this.embeds.size) h = this.embedRise(x, z, h);
    for (const b of this.spec.buildings) {
      const d = Math.hypot(x - b.x, z - b.z);
      if (d > b.pad * 1.5) continue;
      let ph = this.padH.get(b.id);
      if (ph === undefined) { ph = Math.max(0, this.raw(b.x, b.z).h); this.padH.set(b.id, ph); }
      const w = 1 - smooth(b.pad * 0.75, b.pad * 1.5, d);
      h = lerp(h, ph, w);
    }
    return h;
  }

  /** Is (x,z) a sensible spot for a plant / rock (inside, off the lip, dry, off building pads)? */
  free(x: number, z: number, margin = 2): boolean {
    const sd = this.sd(x, z);
    if (sd < margin) return false;
    if (this.isClear(x, z)) return false;
    const T = this.spec.terrain;
    if (T.pond && Math.hypot(x - T.pond.x, z - T.pond.z) < T.pond.r * 1.25 + 0.5) return false;
    for (const b of this.spec.buildings) if (Math.hypot(x - b.x, z - b.z) < b.pad * 1.1) return false;
    return true;
  }
}

const col = (hex: string) => new THREE.Color(hex);

/** Top surface: Delaunay over resampled edge + jittered interior grid. Vertex colours carry the palette. */
export function buildTop(f: IslandField, pal: IslandPalette): THREE.BufferGeometry {
  const T = f.spec.terrain, R = rng(f.spec.seed * 7 + 1);
  const pts: number[] = [];
  for (const [x, z] of f.poly) pts.push(x, z);
  const nEdge = f.poly.length;
  {
    const ccw = isCCW(f.poly);
    for (let i = 0; i < nEdge; i++) {
      const [ox, oz] = outward(f.poly, i, ccw);
      for (const d of [0.35, 0.8, 1.35]) {
        const x = f.poly[i][0] - ox * d, z = f.poly[i][1] - oz * d;
        if (f.sd(x, z) > d * 0.7) pts.push(x, z);
      }
    }
  }
  // embedded objects: sample the foot line and the run-up densely so the terrain really climbs the object
  for (const { poly, fall } of f.embedRings()) {
    const ccwE = isCCW(poly);
    for (let i = 0; i < poly.length; i++) {
      const [a, b] = [poly[i], poly[(i + 1) % poly.length]];
      const L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(1, Math.ceil(L / 0.35));
      for (let k = 0; k < n; k++) {
        const t = k / n, x = a[0] + (b[0] - a[0]) * t, z = a[1] + (b[1] - a[1]) * t;
        let ox = b[1] - a[1], oz = -(b[0] - a[0]); const ol = Math.hypot(ox, oz) || 1; ox /= ol; oz /= ol;
        if (!ccwE) { ox = -ox; oz = -oz; }
        for (const d of [0.04, fall * 0.2, fall * 0.45, fall * 0.75]) { const px = x + ox * d, pz = z + oz * d; if (f.sd(px, pz) > 0.6) pts.push(px, pz); }
      }
    }
  }
  const bb = bounds(f.poly), step = 1.15;
  for (let z = bb.z0; z <= bb.z1; z += step)
    for (let x = bb.x0; x <= bb.x1; x += step) {
      const jx = x + (R() - 0.5) * step * 0.7, jz = z + (R() - 0.5) * step * 0.7;
      if (f.sd(jx, jz) > 1.8) pts.push(jx, jz);
    }
  // road bed (kfb.road-bed/1): drop samples inside the mask / on the seam, add the seam points themselves and
  // triangulate with the seam as constrained edges → terrain and road share exactly these vertices (no gap, no poke)
  const seamY = new Map<number, number>();
  let t: ArrayLike<number>;
  if (f.road) {
    const road = f.road, kept: number[] = [];
    for (let i = 0; i < pts.length / 2; i++) {
      const x = pts[i * 2], z = pts[i * 2 + 1];
      if (i < nEdge || (!road.inMask(x, z) && road.seamNear(x, z).d > 0.35)) kept.push(x, z);
    }
    pts.length = 0; pts.push(...kept);
    const edges: [number, number][] = [];
    for (const line of road.seams) {
      let prev = -1;
      for (const [x, y, z] of line) {
        if (prev >= 0 && Math.hypot(pts[prev * 2] - x, pts[prev * 2 + 1] - z) < 1e-4) continue;
        const k = pts.length / 2;
        pts.push(x, z); seamY.set(k, y);
        if (prev >= 0) edges.push([prev, k]);
        prev = k;
      }
    }
    // cdt2d needs unique points: nudge exact duplicates of non-seam samples
    const seen = new Set<string>();
    for (let i = 0; i < pts.length / 2; i++) {
      const key = pts[i * 2].toFixed(5) + ',' + pts[i * 2 + 1].toFixed(5);
      if (seen.has(key)) pts[i * 2] += 1e-4;
      seen.add(key);
    }
    const P2s: [number, number][] = [];
    for (let i = 0; i < pts.length / 2; i++) P2s.push([pts[i * 2], pts[i * 2 + 1]]);
    t = cdt2d(P2s, edges, { exterior: true }).flat();
  } else t = new Delaunator(pts).triangles;
  const idx: number[] = [];
  for (let i = 0; i < t.length; i += 3) {
    const a = t[i], b = t[i + 1], c = t[i + 2];
    const cx = (pts[a * 2] + pts[b * 2] + pts[c * 2]) / 3, cz = (pts[a * 2 + 1] + pts[b * 2 + 1] + pts[c * 2 + 1]) / 3;
    if (f.sd(cx, cz) <= 0) continue; // concave outlines
    if (f.road && f.road.inMask(cx, cz)) continue; // the road's own ground
    // one winding for all (cdt2d does not guarantee it); ensureUp below then flips all if needed
    const o2 = (pts[b * 2] - pts[a * 2]) * (pts[c * 2 + 1] - pts[a * 2 + 1]) - (pts[b * 2 + 1] - pts[a * 2 + 1]) * (pts[c * 2] - pts[a * 2]);
    if (o2 < 0) idx.push(a, c, b); else idx.push(a, b, c);
  }
  const n = pts.length / 2;
  const pos = new Float32Array(n * 3), cols = new Float32Array(n * 3);
  const cTop = col(pal.top), cTop2 = col(pal.top2), cH0 = col(pal.hill[0]), cH1 = col(pal.hill[1]);
  // mountain rock: the island's own stone (colour grammar ENV_ROLES), not the Joyride tower colour
  const cSand = col(pal.sand), cRim = col(pal.rim), cRock = col(ENV_ROLES[pal.id]?.stone[1] ?? pal.rock), tmp = new THREE.Color();
  for (let i = 0; i < n; i++) {
    const x = pts[i * 2], z = pts[i * 2 + 1];
    const sd = i < nEdge ? 0 : f.sd(x, z);
    const r = f.raw(x, z, sd);
    const h = i < nEdge ? LIP : seamY.get(i) ?? f.height(x, z);
    pos[i * 3] = x; pos[i * 3 + 1] = h; pos[i * 3 + 2] = z;
    // palette: patches → hills → mountain → shore/beach → lip
    const patch = smooth(0.48, 0.56, vnoise(x * 0.085 + 3, z * 0.085 - 5, f.spec.seed + 4));
    tmp.copy(cTop).lerp(cTop2, patch);
    if (T.hills > 0) tmp.lerp(r.hills > 0 ? cH0 : cH1, smooth(0.35, 1.0, Math.abs(r.hills) / T.hills) * 0.75);
    if (r.mount > 0) tmp.lerp(cRock, smooth(1.5, 4.5, r.mount));
    let sand = 0;
    if (T.beach > 0) sand = 1 - smooth(T.beach * 0.55, T.beach * 1.05, sd);
    if (T.pond) {
      const dp = Math.hypot(x - T.pond.x, z - T.pond.z);
      sand = Math.max(sand, (1 - smooth(T.pond.r * 0.98, T.pond.r * 1.22, dp)) * (0.75 + 0.25 * vnoise(x * 0.4, z * 0.4, 5)));
    }
    tmp.lerp(cSand, sand);
    tmp.lerp(cRim, (1 - smooth(0.1, 0.9, sd)) * 0.6);
    tmp.multiplyScalar(f.contactShade(x, z));
    cols[i * 3] = tmp.r; cols[i * 3 + 1] = tmp.g; cols[i * 3 + 2] = tmp.b;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setAttribute('color', new THREE.BufferAttribute(cols, 3));
  g.setIndex(idx);
  // Delaunator winding is CCW in (x, z); with y up that faces down → flip if needed
  ensureUp(g);
  g.computeVertexNormals();
  return g;
}

function ensureUp(g: THREE.BufferGeometry) {
  const p = g.attributes.position as THREE.BufferAttribute, ix = g.index!;
  const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3();
  a.fromBufferAttribute(p, ix.getX(0)); b.fromBufferAttribute(p, ix.getX(1)); c.fromBufferAttribute(p, ix.getX(2));
  const nY = b.sub(a).cross(c.sub(a)).y;
  if (nY < 0) {
    const arr = ix.array as Uint32Array | Uint16Array;
    for (let i = 0; i < arr.length; i += 3) { const t = arr[i + 1]; arr[i + 1] = arr[i + 2]; arr[i + 2] = t; }
    ix.needsUpdate = true;
  }
}

/** Underside after the measured construction rule (docs/ISLAND_ANATOMY_RULES.md, StreakByte base meshes):
 *  thin grass band (≈3% of W) · a deep mass (≈0.48 W below the band) whose width tapers almost linearly
 *  (measured profile PROFILE) · its lower surface broken into a stalactite field: one hanging cone per Voronoi cell,
 *  15–35 tips at depths 25–100%, deepest tip off-centre · big flat facets · one closed sheet (no loose parts, no gaps). */
const PROFILE = [1, 0.9, 0.82, 0.74, 0.67, 0.59, 0.53, 0.44, 0.37, 0.27, 0.17]; // radius share at depth 0, 10, …, 100 %

/** depth share t at which the measured profile reaches radius share ρ */
function profileDepth(rho: number): number {
  if (rho >= 1) return 0;
  if (rho <= PROFILE[10]) return 1;
  for (let k = 1; k <= 10; k++) {
    if (rho >= PROFILE[k]) {
      const a = PROFILE[k - 1], b = PROFILE[k];
      return (k - 1 + (a - rho) / (a - b)) / 10;
    }
  }
  return 1;
}

export function buildUnder(f: IslandField, pal: IslandPalette): THREE.BufferGeometry {
  const s = f.spec.seed, B = f.poly, n = B.length, [cx, cz] = f.c, R0 = f.radius, dk = f.spec.terrain.depth;
  const W = R0 * 2;
  const grassT = Math.max(0.6, 0.03 * W);
  const D = 0.56 * W * dk;
  const yS = LIP - grassT;
  const gb = grassBottom(f);
  const R = rng(s * 13 + 5), tmp = new THREE.Color();
  const bands = pal.under.map(col);
  // footprint points: the outline itself + a jittered interior grid (spacing ≈ 5% of W → measured facet size)
  const bb = bounds(B), step = 0.075 * W;
  const pts: number[] = [];
  for (const [x, z] of B) pts.push(x, z);
  for (let z = bb.z0; z <= bb.z1; z += step)
    for (let x = bb.x0; x <= bb.x1; x += step) {
      const jx = x + (R() - 0.5) * step * 0.8, jz = z + (R() - 0.5) * step * 0.8;
      if (f.sd(jx, jz) > step * 0.45) pts.push(jx, jz);
    }
  const N = pts.length / 2;
  const sdv = new Float32Array(N);
  let maxSd = 1e-3;
  for (let i = 0; i < N; i++) { sdv[i] = i < n ? 0 : f.sd(pts[i * 2], pts[i * 2 + 1]); maxSd = Math.max(maxSd, sdv[i]); }
  // stalactite field: tips (cell centres) with their own depth and steepness
  const area = Math.PI * R0 * R0;
  const K = Math.round(24 + Math.min(16, (area / (Math.PI * 900)) * 10));
  const tips: { x: number; z: number; y: number; k: number }[] = [];
  const rhoAt = (x: number, z: number) => 1 - Math.max(0, f.sd(x, z)) / maxSd;
  for (let t = 0; tips.length < K && t < K * 40; t++) {
    const a = R() * Math.PI * 2, rr = Math.sqrt(R()) * R0 * 1.05;
    const x = cx + Math.cos(a) * rr, z = cz + Math.sin(a) * rr;
    const sd = f.sd(x, z);
    if (sd < 0.06 * W) continue;
    if (tips.some((q) => Math.hypot(q.x - x, q.z - z) < 0.085 * W)) continue;
    const rho = rhoAt(x, z);
    const tb = profileDepth(rho);
    // tips hang below the body: most land between 50 and 100% depth
    const td = Math.min(1.0, tb * (0.94 + R() * 0.12) + 0.02);
    tips.push({ x, z, y: yS - D * td, k: 1.3 + R() * 1.1 });
  }
  // one deepest tip, off-centre (measured 7–56% of the radius)
  {
    const a = R() * Math.PI * 2, rr = R0 * (0.15 + R() * 0.3);
    tips.push({ x: cx + Math.cos(a) * rr, z: cz + Math.sin(a) * rr, y: yS - D * 1.04, k: 1.8 });
  }
  // lower surface height: body (measured taper, a bit shallower) ∩ union of hanging cones
  const ys = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    const x = pts[i * 2], z = pts[i * 2 + 1];
    if (i < n) { ys[i] = gb[i]; continue; }
    const rho = 1 - sdv[i] / maxSd;
    let y = yS - D * profileDepth(rho) * 0.6;
    for (const q of tips) {
      const yc = q.y + q.k * Math.hypot(x - q.x, z - q.z);
      if (yc < y) y = yc;
    }
    // never above the band near the rim; a little noise breaks regular rings
    y = Math.min(y, yS - 0.45 * grassT - 0.4) + (vnoise(x * 0.3, z * 0.3, s + 31) - 0.5) * 0.04 * D;
    ys[i] = y;
  }
  const del = new Delaunator(pts);
  const pos: number[] = [], cols: number[] = [];
  const P = (i: number) => new THREE.Vector3(pts[i * 2], ys[i], pts[i * 2 + 1]);
  const e1 = new THREE.Vector3(), e2 = new THREE.Vector3(), nv = new THREE.Vector3();
  const tri = (a: THREE.Vector3, b: THREE.Vector3, c: THREE.Vector3, color: THREE.Color, wantDown: boolean) => {
    e1.subVectors(b, a); e2.subVectors(c, a); nv.crossVectors(e1, e2);
    if (nv.lengthSq() < 1e-10) return;
    const flip = wantDown ? nv.y > 0 : false;
    if (flip) pos.push(a.x, a.y, a.z, c.x, c.y, c.z, b.x, b.y, b.z);
    else pos.push(a.x, a.y, a.z, b.x, b.y, b.z, c.x, c.y, c.z);
    for (let k = 0; k < 3; k++) cols.push(color.r, color.g, color.b);
  };
  const t = del.triangles;
  for (let i = 0; i < t.length; i += 3) {
    const ia = t[i], ib = t[i + 1], ic = t[i + 2];
    const mx = (pts[ia * 2] + pts[ib * 2] + pts[ic * 2]) / 3, mz = (pts[ia * 2 + 1] + pts[ib * 2 + 1] + pts[ic * 2 + 1]) / 3;
    if (f.sd(mx, mz) <= 0) continue;
    tri(P(ia), P(ib), P(ic), tmp, true);
  }
  // smooth colours by depth: earth bands blend softly, low-frequency mottling (no per-face stripes)
  const cA = new THREE.Color(), cB = new THREE.Color();
  for (let i = 0; i < pos.length; i += 3) {
    const x = pos[i], y = pos[i + 1], z = pos[i + 2];
    const t = Math.max(0, Math.min(1, (yS - y) / D)), k = Math.min(1.999, t * 2.2), j = Math.floor(k);
    cA.copy(bands[1 + j]); cB.copy(bands[2 + j]);
    cA.lerp(cB, smooth(0.25, 0.75, k - j));
    cA.multiplyScalar(0.9 + 0.18 * vnoise(x * 0.09 + y * 0.05, z * 0.09 - y * 0.04, s + 77));
    cols[i] = cA.r; cols[i + 1] = cA.g; cols[i + 2] = cA.b;
  }
  const raw = new THREE.BufferGeometry();
  raw.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  raw.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3));
  // clay pre-stage (golden-k1h0 clay-soften v1): subdivide, weld, Taubin rounding, gentle lumps; the open rim stays put
  const soft = (softenGeometry as any)(THREE, raw, { maxEdge: 0.03 * W, maxLevels: 3, iters: 4, lambda: 0.45, mu: -0.48, lump: 0.03, lumpFreq: 0.9, seed: s, maxTris: 60000 });
  return soft.geometry as THREE.BufferGeometry;
}

/** Rounded grass edge: the top roll continues over a slight bulge down to the wavy grass bottom, smooth normals,
 *  darkening towards the earth so the grass/earth border reads as a transition. */
export function buildBand(f: IslandField, pal: IslandPalette): THREE.BufferGeometry {
  const B = f.poly, n = B.length, ccw = isCCW(B), gb = grassBottom(f), s = f.spec.seed;
  const pos: number[] = [], cols: number[] = [], idx: number[] = [];
  const cR = col(pal.rim), cT = col(pal.top), tmp = new THREE.Color();
  for (let i = 0; i < n; i++) {
    const [x, z] = B[i], [ox, oz] = outward(B, i, ccw), kt = f.bandTaper(x, z), h = gb[i] - LIP;
    const v = 0.92 + 0.16 * vnoise(i * 0.13, 2, s + 7);
    const rings: [number, number, THREE.Color][] = [
      [0, LIP, tmp.copy(cT).lerp(cR, 0.4).clone()],
      [0.16 * kt, LIP + h * 0.35, tmp.copy(cR).multiplyScalar(v).clone()],
      [0.12 * kt, LIP + h * 0.75, tmp.copy(cR).multiplyScalar(v * 0.82).clone()],
      [0.04 * kt, gb[i], tmp.copy(cR).multiplyScalar(0.55).lerp(col(pal.under[1]), 0.35).clone()],
    ];
    for (const [d, y, c] of rings) { pos.push(x + ox * d, y, z + oz * d); cols.push(c.r, c.g, c.b); }
  }
  const R = 4;
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    if (f.road && (f.road.rimHit(B[i][0], B[i][1]) || f.road.rimHit(B[j][0], B[j][1]))) continue; // bridge root (RKIT GLB)
    for (let r = 0; r < R - 1; r++) {
      const a = i * R + r, b = j * R + r, c = j * R + r + 1, d = i * R + r + 1;
      idx.push(a, b, c, a, c, d);
    }
  }
  // orientation: first face must point outwards
  const P = (k: number) => new THREE.Vector3(pos[k * 3], pos[k * 3 + 1], pos[k * 3 + 2]);
  const nrm = P(idx[1]).sub(P(idx[0])).cross(P(idx[2]).sub(P(idx[0])));
  const [ox, oz] = outward(B, 0, ccw);
  if (nrm.x * ox + nrm.z * oz < 0) for (let k = 0; k < idx.length; k += 3) { const t = idx[k + 1]; idx[k + 1] = idx[k + 2]; idx[k + 2] = t; }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

/** Footpaths as soft clay ribbons lying on the ground: rounded cross-section (5 points), width varies a little,
 *  smooth centre line, small round plazas where they end. One mesh, smooth normals. */
export function buildPaths(f: IslandField): THREE.BufferGeometry {
  const pos: number[] = [], idx: number[] = [];
  const s = f.spec.seed;
  const lift = (x: number, z: number, d: number) => f.base(x, z) + d;
  // keep every path vertex at least 0.5 m inside the rim
  const inside = (x: number, z: number): [number, number] => {
    const d = f.sd(x, z);
    if (d >= 0.5) return [x, z];
    const vx = f.c[0] - x, vz = f.c[1] - z, L = Math.hypot(vx, vz) || 1;
    return [x + (vx / L) * (0.5 - d), z + (vz / L) * (0.5 - d)];
  };
  const cross = [[-1.12, -0.2], [-0.85, 0.03], [0, 0.07], [0.85, 0.03], [1.12, -0.2]];
  const ribbon = (line: P2[], w0: number, flareStart: boolean, flareEnd: boolean) => {
    const curve = new THREE.CatmullRomCurve3(line.map(([x, z]) => new THREE.Vector3(x, 0, z)), false, 'centripetal');
    const L = curve.getLength(), N = Math.max(8, Math.round(L / 0.6));
    const base = pos.length / 3;
    const ring = (p: THREE.Vector3, nx: number, nz: number, w: number) => {
      for (const [u, dy] of cross) { const [x, z] = inside(p.x + nx * u * w, p.z + nz * u * w); pos.push(x, lift(x, z, dy), z); }
    };
    for (let i = 0; i <= N; i++) {
      const t = i / N, p = curve.getPoint(t), tg = curve.getTangent(t), dist = t * L;
      // ends widen a little over the last 3 m (a path opening into a place), the middle wobbles gently
      let k = 0.92 + 0.16 * vnoise(i * 0.15, 4, s);
      if (flareStart) k *= 1 + 0.35 * (1 - smooth(0, 3, dist));
      if (flareEnd) k *= 1 + 0.35 * (1 - smooth(0, 3, L - dist));
      ring(p, -tg.z, tg.x, (w0 * k) / 2);
    }
    for (let i = 0; i < N; i++) for (let k = 0; k < 4; k++) {
      const a = base + i * 5 + k, b = a + 1, c = a + 6, d = a + 5;
      idx.push(a, c, b, a, d, c);
    }
    // rounded caps: half-discs at both ends, same cross-section
    for (const end of [0, 1]) {
      const p = curve.getPoint(end), tg = curve.getTangent(end).multiplyScalar(end ? 1 : -1);
      const w = (w0 * (1 + 0.35) * 0.98) / 2 * 1.12, c0 = pos.length / 3, segs = 10;
      { const [x, z] = inside(p.x, p.z); pos.push(x, lift(x, z, 0.07), z); }
      for (let j = 0; j <= segs; j++) {
        const a = -Math.PI / 2 + (j / segs) * Math.PI;
        const dx = tg.x * Math.cos(a) - tg.z * Math.sin(a), dz = tg.z * Math.cos(a) + tg.x * Math.sin(a);
        for (const [r, dy] of [[0.76, 0.03], [1, -0.2]]) { const [x, z] = inside(p.x + dx * w * r, p.z + dz * w * r); pos.push(x, lift(x, z, dy), z); }
      }
      for (let j = 0; j < segs; j++) { const A = c0 + 1 + j * 2, B = A + 2; idx.push(c0, A, B, A, A + 1, B + 1, A, B + 1, B); }
    }
  };
  ribbon(f.paths[0], f.pathW[0], true, true);
  for (let k = 1; k < f.paths.length; k++) ribbon(f.paths[k], f.pathW[k], false, true);
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  // every face must point up (ribbons and plazas are built with different windings)
  const P = (k: number) => new THREE.Vector3(pos[k * 3], pos[k * 3 + 1], pos[k * 3 + 2]);
  for (let k = 0; k < idx.length; k += 3) {
    if (P(idx[k + 1]).sub(P(idx[k])).cross(P(idx[k + 2]).sub(P(idx[k]))).y < 0) { const t = idx[k + 1]; idx[k + 1] = idx[k + 2]; idx[k + 2] = t; }
  }
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

export function buildWater(f: IslandField): THREE.BufferGeometry | null {
  const P = f.spec.terrain.pond;
  if (!P) return null;
  const g = new THREE.CircleGeometry(P.r * 1.2, 48);
  g.rotateX(-Math.PI / 2);
  g.translate(P.x, -0.3, P.z);
  return g;
}

/** Few floating clay crumbs under the island (the reference islands shed bits of earth). */
export function buildCrumbs(f: IslandField, pal: IslandPalette): THREE.BufferGeometry {
  const R = rng(f.spec.seed * 3 + 9), parts: THREE.BufferGeometry[] = [];
  const depth = f.radius * 0.5;
  for (let k = 0; k < 7; k++) {
    const a = R() * Math.PI * 2, rr = f.radius * (0.5 + R() * 0.7);
    const g = new THREE.IcosahedronGeometry(0.6 + R() * 1.3, 0);
    g.translate(f.c[0] + Math.cos(a) * rr, -4 - R() * depth * 0.9, f.c[1] + Math.sin(a) * rr);
    const c = col(pal.under[1 + Math.floor(R() * 3)]);
    const cs = new Float32Array(g.attributes.position.count * 3);
    for (let i = 0; i < cs.length; i += 3) { cs[i] = c.r; cs[i + 1] = c.g; cs[i + 2] = c.b; }
    g.setAttribute('color', new THREE.BufferAttribute(cs, 3));
    g.deleteAttribute('uv');
    parts.push(g);
  }
  const merged = mergeSimple(parts);
  merged.computeVertexNormals();
  return merged;
}

/** Merge non-indexed geometries with identical attribute sets (position, normal?, color?). */
export function mergeSimple(list: THREE.BufferGeometry[]): THREE.BufferGeometry {
  const ni = list.map((g) => (g.index ? g.toNonIndexed() : g));
  const names = Object.keys(ni[0].attributes);
  const out = new THREE.BufferGeometry();
  for (const name of names) {
    const item = ni[0].attributes[name].itemSize;
    let len = 0;
    for (const g of ni) len += g.attributes[name].array.length;
    const arr = new Float32Array(len);
    let o = 0;
    for (const g of ni) { arr.set(g.attributes[name].array as Float32Array, o); o += g.attributes[name].array.length; }
    out.setAttribute(name, new THREE.BufferAttribute(arr, item));
  }
  return out;
}
