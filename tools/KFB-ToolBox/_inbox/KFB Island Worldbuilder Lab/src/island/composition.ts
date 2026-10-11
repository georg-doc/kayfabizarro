// Island composition (landmark spot, open zone, footpaths, small plazas, track connector), taken out of IslandField
// unchanged (STAGE1_R2D_PORT_PLAN §7 risk 1), so the old terrain and the R2D terrain share one composition.
import type { RoadBedField } from './roadbed';
import type { IslandSpec } from './spec';
import { vnoise } from './noise';
import type { P2 } from './shape';

export interface Composition {
  landmark: P2; openC: P2; openR: number; path: P2[];
  paths: P2[][]; pathW: number[]; plazas: { x: number; z: number; r: number }[];
  connector: { x: number; z: number; dx: number; dz: number };
}

export function composeIsland(spec: IslandSpec, poly: P2[], c: P2, radius: number, road: RoadBedField | null): Composition {
  const paths: P2[][] = [], pathW: number[] = [], plazas: { x: number; z: number; r: number }[] = [];
  let landmark: P2, openC: P2, openR: number, path: P2[], connector: Composition['connector'];
  const b0 = spec.buildings[0];
  landmark = b0 ? [b0.x, b0.z] : [c[0], c[1]];
  // the landmark's front decides where the forecourt, the open zone and the arrival path go:
  // its facing (rot, +z local) blended with the direction towards the island centre
  let dx = c[0] - landmark[0], dz = c[1] - landmark[1];
  let L = Math.hypot(dx, dz);
  if (L < 2) { const a = spec.seed * 2.39; dx = Math.cos(a); dz = Math.sin(a); L = 1; }
  dx /= L; dz /= L;
  if (b0) { const fx = Math.sin(b0.rot), fz = Math.cos(b0.rot); dx = fx * 0.75 + dx * 0.25; dz = fz * 0.75 + dz * 0.25; const l2 = Math.hypot(dx, dz) || 1; dx /= l2; dz /= l2; }
  openC = [c[0] + dx * radius * 0.38, c[1] + dz * radius * 0.38];
  openR = radius * 0.5;
  let best = poly[0], bd = -Infinity;
  for (const p of poly) { const d = (p[0] - c[0]) * dx + (p[1] - c[1]) * dz; if (d > bd) { bd = d; best = p; } }
  // the main path starts just inside the rim: this is where a track / bridge connects later
  let E: P2 = [best[0] - dx * 2.2, best[1] - dz * 2.2];
  connector = { x: best[0], z: best[1], dx, dz };
  const anc = road?.spec.anchors[0];
  if (road && anc) {
    // island footpath starts at the seam in front of the D2 anchor (the junction piece itself is RKIT's)
    const [ax, , az] = anc.p, [ux, , uz] = anc.dir;
    let t = 0;
    while (t < 30 && road.inMask(ax + ux * t, az + uz * t)) t += 0.25;
    E = [ax + ux * (t + 0.4), az + uz * (t + 0.4)];
    connector = { x: ax, z: az, dx: -ux, dz: -uz };
  }
  const pad = b0 ? b0.pad + 0.5 : 0;
  const Lf: P2 = [landmark[0] + dx * pad, landmark[1] + dz * pad];
  const side = (vnoise(spec.seed, 3, 1) - 0.5) * radius * 0.3;
  const M: P2 = [(E[0] + Lf[0]) / 2 - dz * side, (E[1] + Lf[1]) / 2 + dx * side];
  path = [];
  for (let k = 0; k <= 24; k++) {
    const t = k / 24, u = 1 - t;
    path.push([u * u * E[0] + 2 * u * t * M[0] + t * t * Lf[0], u * u * E[1] + 2 * u * t * M[1] + t * t * Lf[1]]);
  }
  paths.push(path);
  pathW.push(3.2);
  // branch from the middle of the main path to a destination: the pond shore, else a rim viewpoint
  const mid = path[12];
  let T: P2;
  const P = spec.terrain.pond;
  if (P) {
    const a = Math.atan2(mid[1] - P.z, mid[0] - P.x);
    T = [P.x + Math.cos(a) * (P.r * 1.55 + 1.2), P.z + Math.sin(a) * (P.r * 1.55 + 1.2)]; // stops on the shore, never in the water
  } else {
    const a = Math.atan2(dz, dx) + Math.PI / 2 * (side > 0 ? 1 : -1);
    let bp = poly[0], bb = -Infinity;
    for (const p of poly) { const d = (p[0] - c[0]) * Math.cos(a) + (p[1] - c[1]) * Math.sin(a); if (d > bb) { bb = d; bp = p; } }
    T = [bp[0] - Math.cos(a) * 3.0, bp[1] - Math.sin(a) * 3.0];
  }
  const C: P2 = [(mid[0] + T[0]) / 2 + (T[1] - mid[1]) * 0.18, (mid[1] + T[1]) / 2 - (T[0] - mid[0]) * 0.18];
  const br: P2[] = [];
  for (let k = 0; k <= 16; k++) {
    const t = k / 16, u = 1 - t;
    br.push([u * u * mid[0] + 2 * u * t * C[0] + t * t * T[0], u * u * mid[1] + 2 * u * t * C[1] + t * t * T[1]]);
  }
  paths.push(br);
  pathW.push(2.4);
  // recipe layout (Lauf 03): routes between anchors, places and the landmark's forecourt replace the generated paths, so
  // every path ends at something (bridge head, stair, plaza, clearing, pond shore), never at the rim or in the meadow
  const LY = spec.layout;
  if (LY && LY.routes.length) {
    paths.length = 0; pathW.length = 0;
    for (const pl of LY.places) plazas.push({ x: pl.x, z: pl.z, r: pl.r });
    const end = (id: string, other: P2 | null): P2 | null => {
      const an = spec.anchors?.find((a) => a.id === id);
      if (an?.p) return [an.p[0], an.p[1]];
      const pl = LY.places.find((q) => q.id === id);
      if (pl) return [pl.x, pl.z];
      const bd = spec.buildings.find((q) => q.id === id);
      if (bd) return [bd.x + Math.sin(bd.rot) * (bd.pad + 0.5), bd.z + Math.cos(bd.rot) * (bd.pad + 0.5)];
      const pd = spec.terrain.pond;
      if (pd && id === spec.id + '.pond') { const o = other ?? [c[0], c[1]], a = Math.atan2(o[1] - pd.z, o[0] - pd.x); return [pd.x + Math.cos(a) * (pd.r * 1.55 + 1.2), pd.z + Math.sin(a) * (pd.r * 1.55 + 1.2)]; }
      return null;
    };
    for (const r of LY.routes) {
      // the landmark's forecourt is always the END of a route (cameras walk towards the landmark)
      const toLmk = spec.buildings.some((q) => q.id === r.from);
      const fromId = toLmk ? r.to : r.from, toId = toLmk ? r.from : r.to;
      const A0 = end(fromId, null), B0 = end(toId, A0), A = A0 && B0 ? end(fromId, B0) : null;
      if (!A || !B0) continue;
      const len = Math.hypot(B0[0] - A[0], B0[1] - A[1]), bend = r.bend ?? 0, n = Math.max(12, Math.round(len / 4));
      const Cc: P2 = [(A[0] + B0[0]) / 2 - ((B0[1] - A[1]) / (len || 1)) * bend * len, (A[1] + B0[1]) / 2 + ((B0[0] - A[0]) / (len || 1)) * bend * len];
      const pts: P2[] = [];
      for (let k = 0; k <= n; k++) { const t = k / n, u = 1 - t; pts.push([u * u * A[0] + 2 * u * t * Cc[0] + t * t * B0[0], u * u * A[1] + 2 * u * t * Cc[1] + t * t * B0[1]]); }
      paths.push(pts); pathW.push(r.w ?? 3);
    }
    // the main path (cameras, connector) is the one that ends at the landmark, else the first
    const li = paths.findIndex((p) => Math.hypot(p[p.length - 1][0] - landmark[0], p[p.length - 1][1] - landmark[1]) < (b0 ? b0.pad + 3 : 0));
    if (li > 0) { paths.unshift(...paths.splice(li, 1)); pathW.unshift(...pathW.splice(li, 1)); }
    if (paths.length) path = paths[0];
  }
  // paths go around the pond, never across the water
  if (P) {
    const keep = P.r * 1.55 + 2;
    for (const line of paths) for (const p of line) {
      const vx = p[0] - P.x, vz = p[1] - P.z, d = Math.hypot(vx, vz);
      if (d < keep && d > 1e-3) { p[0] = P.x + (vx / d) * keep; p[1] = P.z + (vz / d) * keep; }
    }
  }
  // no island path inside the road's clear zone
  if (road) for (let k = 0; k < paths.length; k++) {
    const kept = paths[k].filter((p) => !road.inClear(p[0], p[1]));
    paths[k].length = 0;
    paths[k].push(...kept);
  }
  
  return { landmark, openC, openR, path, paths, pathW, plazas, connector };
}
