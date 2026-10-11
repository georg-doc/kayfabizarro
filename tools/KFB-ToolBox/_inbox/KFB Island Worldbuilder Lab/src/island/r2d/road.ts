// Road bed (kfb.road-bed/1, RKIT) as R2D road input (STAGE1_R2D_PORT_PLAN §2: "hw und roadY je Station").
// R2D v0 levels the ground to one road height − 0.35 inside hw and rolls out over W. With RKIT's road body that left
// gaps of up to 0.6 at the slope foot, because RKIT already builds its own slope band per side (from the outer edge
// `from` down / up to the seam foot `p`). So, per station and side:
//   under the road (lateral < from):  lowest point of the cross-section − DROP
//   under RKIT's slope band:           the band (from → p) − DROP
//   beyond the seam foot p:            R2D embankment from p.y − DROP back to the natural ground over W
// DROP 0.2 < skirt 0.3: the road body's skirt always reaches into the ground (T2), the ground stays under road, kerb
// and walk (T1).
import { bedFromS, type RoadBedSpec } from '../roadbed';
import type { R2DRoadHit } from './fields';

export const SEAM_DROP = 0.2;

interface Side { d3: number; d4: number; w4: number; dIn: number; dFrom: number; yT: number; dP: number; yP: number; dPaint?: number; yMax?: number }
interface Station { ax: number; az: number; yMin: number; L: Side; R: Side; lx: number; lz: number }

export interface RoadQuery { (x: number, z: number): R2DRoadHit }

/** contract rule B (Steuerung 10.10.): ground at hw (outer support point, key 6) per side and station */
function ruleB(t: string | undefined, top6: number, roadY: number, legacy: number, walkTop = top6, wallFoot?: number): number {
  // rule B means the walk's outer edge stone, not a parapet / wall on it (Steuerung 10.10.): at a wall the ground goes to its
  // foot. RKIT will deliver 'wallFoot-0.10' with the foot height per station; until then such stations take roadY − 0.35
  if (t === 'wallFoot-0.10') return wallFoot !== undefined ? wallFoot - 0.1 : roadY - 0.35;
  if (t === 'sectionTop-0.10' && top6 - walkTop > 0.25) return roadY - 0.35;
  if (t === 'sectionTop-0.10') return top6 - 0.1;
  if (t === 'roadY-0.35') return roadY - 0.35;
  return legacy;
}

export function roadFromBed(spec: RoadBedSpec): RoadQuery {
  const segs: [Station, Station][] = [];
  spec.roads.forEach((r, ri) => {
    const s0 = bedFromS(spec, ri);
    const seamSide = (side: typeof r.seam.L) => (s: number) => { let b = null as (typeof side)[number] | null, bd = 1.5; for (const q of side) { const d = Math.abs(q.s - s); if (d < bd) { bd = d; b = q; } } return b; };
    const sL = seamSide(r.seam.L), sR = seamSide(r.seam.R);
    const secs = r.sections.filter((S) => S.s >= s0);
    const st: Station[] = secs.map((S) => {
      const ax = (S.L[0][0] + S.R[0][0]) / 2, az = (S.L[0][2] + S.R[0][2]) / 2, roadY = (S.L[0][1] + S.R[0][1]) / 2;
      const yMin = Math.min(...S.L.map((p) => p[1]), ...S.R.map((p) => p[1]));
      const lat = (p: number[]) => Math.hypot(p[0] - ax, p[2] - az);
      const side = (keys: number[][], q: ReturnType<typeof sL>, t: string | undefined): Side => {
        const o = keys[keys.length - 1], d6 = lat(o), d4 = keys.length > 4 ? lat(keys[4]) : d6 - 0.3, d3 = keys.length > 3 ? lat(keys[3]) : d4;
        // the ground rises to the target under the outer support (parapet / edge stone), never under the walk (T1)
        const dIn = Math.min(d6 - 0.05, Math.max(d6 - 0.8, d4 + 0.15));
        const w4 = keys.length > 4 ? Math.min(keys[4][1], keys[3][1]) : yMin;   // the walk's lower edge (it has a cross fall)
        const yMax = Math.max(...keys.slice(4).map((k) => k[1])) - 0.1;
        const wTop = keys.length > 4 ? keys[4][1] : o[1], wFoot = (S as { wallFootY?: Record<string, number | null> }).wallFootY?.[keys === S.L ? 'L' : 'R'] ?? undefined;
        if (!q) { const yT = ruleB(t, o[1], roadY, yMin, wTop, wFoot); return { d3, d4, w4, dIn, dFrom: d6, yT, dP: d6, yP: yT, yMax }; }
        // a shoulder of ≥ 2.5 after hw before the ground falls to RKIT's seam foot: the polar net (≈ 1 wide) drew a narrower
        // rise as a sawtooth along the edge stones
        const dF = Math.min(lat(q.from), d6);
        // where RKIT built the edge (its turf strip lies at about top − 0.10 itself) the ground stays 0.08 under it: coplanar it
        // poked through the turf as a sawtooth along the edge stones
        const yT = ruleB(t, o[1], roadY, Math.min(q.from[1], yMin), wTop, wFoot) - (r.builtParts && t ? 0.08 : 0), dP0 = Math.max(lat(q.p), dF + 0.05);
        // shoulder only where the ground falls away from hw (fill); in a cut RKIT's slope band climbs to its seam foot (T2b)
        const dP = t && q.p[1] < yT ? Math.max(dP0, dF + 2.5) : dP0;
        return { d3, d4, w4, dIn, dFrom: dF, yT, dP, yP: q.p[1], dPaint: dP0, yMax };
      };
      const L6 = S.L[S.L.length - 1];
      return { ax, az, yMin, L: side(S.L, sL(S.s), S.bedTarget?.L), R: side(S.R, sR(S.s), S.bedTarget?.R), lx: L6[0] - ax, lz: L6[2] - az };
    });
    // the target changes per station (bande ↔ lay-by): eased along the road over a few metres, no step at the change (§01)
    for (const k of ['L', 'R'] as const) for (let it = 0; it < 12; it++) {
      const y0 = st.map((x) => x[k].yT);
      for (let i = 1; i < st.length - 1; i++) st[i][k].yT = (y0[i - 1] + 2 * y0[i] + y0[i + 1]) / 4;
    }
    // easing must never lift the ground over the local edge (T2a: ≥ 0.05 under the section's top at key 6)
    for (const x of st) for (const k of ['L', 'R'] as const) if (x[k].yMax !== undefined) x[k].yT = Math.min(x[k].yT, x[k].yMax!);
    for (let i = 1; i < st.length; i++) segs.push([st[i - 1], st[i]]);
  });
  const G = 8, grid = new Map<string, number[]>(), reach = 40;
  segs.forEach(([a, b], i) => {
    const x0 = Math.floor((Math.min(a.ax, b.ax) - reach) / G), x1 = Math.floor((Math.max(a.ax, b.ax) + reach) / G);
    const z0 = Math.floor((Math.min(a.az, b.az) - reach) / G), z1 = Math.floor((Math.max(a.az, b.az) + reach) / G);
    for (let gx = x0; gx <= x1; gx++) for (let gz = z0; gz <= z1; gz++) { const k = gx + ',' + gz; (grid.get(k) ?? grid.set(k, []).get(k)!).push(i); }
  });
  const FAR: R2DRoadHit = { d: 1e9, hw: 0, y: 0 };
  const L = (a: number, b: number, t: number) => a + (b - a) * t;
  return (x, z) => {
    const cell = grid.get(Math.floor(x / G) + ',' + Math.floor(z / G));
    if (!cell) return FAR;
    let bd = 1e9, bi = -1, bt = 0;
    for (const i of cell) {
      const [a, b] = segs[i], ex = b.ax - a.ax, ez = b.az - a.az, L2 = ex * ex + ez * ez || 1e-9;
      const t = Math.max(0, Math.min(1, ((x - a.ax) * ex + (z - a.az) * ez) / L2)), d = Math.hypot(x - a.ax - ex * t, z - a.az - ez * t);
      if (d < bd) { bd = d; bi = i; bt = t; }
    }
    if (bi < 0) return FAR;
    const [a, b] = segs[bi], px = L(a.ax, b.ax, bt), pz = L(a.az, b.az, bt);
    const isL = (x - px) * L(a.lx, b.lx, bt) + (z - pz) * L(a.lz, b.lz, bt) > 0;
    const sa = isL ? a.L : a.R, sb = isL ? b.L : b.R;
    const dI = L(sa.dIn, sb.dIn, bt), dF = L(sa.dFrom, sb.dFrom, bt), yT = L(sa.yT, sb.yT, bt), dP = L(sa.dP, sb.dP, bt), yP = L(sa.yP, sb.yP, bt), yMin = L(a.yMin, b.yMin, bt);
    const ss = (u: number) => { const c = Math.max(0, Math.min(1, u)); return c * c * (3 - 2 * c); };
    const d3 = L(sa.d3, sb.d3, bt), d4 = L(sa.d4, sb.d4, bt), w4 = L(sa.w4, sb.w4, bt), yLow = Math.min(yMin, yT) - SEAM_DROP, yF = yP - SEAM_DROP;
    // under the walk (hidden by its slabs) the ground already stands just under the walk top: no low → high step at the walk
    // edge for the ≈ 1 wide polar net to draw as a sawtooth. Next to a high target (parapet) it dips instead, low enough that
    // a net triangle with one or two corners up at the target keeps its centre under the walk (T1)
    const yW = yT > w4 ? Math.min(yLow, 3 * w4 - 2 * yT - 0.05) : Math.max(yLow, Math.min(yT, w4 - 0.2));
    const y = bd <= d3 ? yLow
      : bd <= dI ? L(yLow, yW, ss((bd - d3) / Math.max(0.3, Math.min(0.6, dI - d3))))
      : bd <= dF ? L(yW, yT, ss((bd - dI) / Math.max(1e-3, dF - dI)))
      : bd >= dP ? yF : L(yT, yF, ss((bd - dF) / (dP - dF)));
    return { d: bd, hw: dP, y, drop: 0, paintHw: L(sa.dPaint ?? sa.dP, sb.dPaint ?? sb.dP, bt) };
  };
}
