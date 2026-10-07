// Rural features along the roads between settlements (stage 3, same rules as villages; game critic r1):
// farmsteads (1–2 houses + fenced fields), watchtowers on plateau edges overlooking a road, mines at cliff feet,
// lumber camps / lone chapels at forest edges. One candidate site per jittered GRID×GRID axial cell, snapped to a road
// cell; a site needs a free flat road-side cell, ≥ SETTLE_CLEAR cells from every village / hamlet node and
// ≥ SITE_SPACING from any stronger neighbouring site. Pure function of (seed, stage-3 input), cached per site.
import { isRetrySignal } from '../../core/world';
import { DIRS, hexDistance, hexRound, hexToWorld, edgeVector, opposite } from '../../core/hex';
import { hash, rand01, strSeed } from '../../core/rng';
import { LEVEL_H } from '../../core/units';
import { MACRO } from '../roads/api';
import { COLORS, FRONT_DEPTH, UNIT, buildingId, rotForDoor, type BuildingType } from './catalog';
import { faceVec, fitOne, roadFace } from './fit';
import { key, PERMS, type Item, type PlanCell, type Planner, type RuralFeature, type VillagePlan } from './plan';

export const GRID = 6;
const JIT = 1.5;
const SNAP = 3;
const SETTLE_CLEAR = 8; // = VR + 4 (literal: plan.ts ↔ rural.ts import cycle, VR is not initialised yet at module eval)
const SITE_SPACING = 5;

interface Anchor { q: number; r: number; level: number; prio: number }

export class Rural {
  private anchors = new Map<number, Anchor | null>();
  private sites = new Map<number, VillagePlan | null>();
  private readonly s: number;
  constructor(private pl: Planner) {
    this.s = hash(pl.seed, strSeed('villages.rural'));
  }

  private gk = (gi: number, gj: number) => gi * 65536 + gj;

  /** Road cell the site of grid cell (gi, gj) hangs on (cheap: terrain + roads only). */
  anchorOf(gi: number, gj: number): Anchor | null {
    const k = this.gk(gi, gj);
    if (this.anchors.has(k)) return this.anchors.get(k)!;
    if (this.anchors.size > 20000) this.anchors.clear();
    const S = this.s, get = this.pl.get;
    const fq = gi * GRID + (rand01(S, gi, gj, 1) - 0.5) * 2 * JIT;
    const fr = gj * GRID + (rand01(S, gi, gj, 2) - 0.5) * 2 * JIT;
    const h = hexRound(fq, fr);
    let best: Anchor | null = null, bd = Infinity;
    for (let dq = -SNAP; dq <= SNAP; dq++)
      for (let dr = Math.max(-SNAP, -dq - SNAP); dr <= Math.min(SNAP, -dq + SNAP); dr++) {
        const q = h.q + dq, r = h.r + dr;
        const c = get(q, r);
        if (!c.roadMask || c.slope || c.bridge || c.riverMask) continue;
        const d = hexDistance(q, r, h.q, h.r) + rand01(S, q, r, 3) * 0.5;
        if (d >= bd) continue;
        // needs a free flat road-side cell at its level
        let side = false;
        for (const [a, b] of DIRS) {
          const n = get(q + a, r + b);
          if (!n.roadMask && n.level === c.level && this.pl.ok(q + a, r + b)) { side = true; break; }
        }
        if (!side) continue;
        bd = d;
        best = { q, r, level: c.level, prio: hash(S, gi, gj, 4) };
      }
    this.anchors.set(k, best);
    return best;
  }

  /** Rural sites with a cell within `radius` + 2 of (q, r). */
  near(q: number, r: number, radius: number): VillagePlan[] {
    const out: VillagePlan[] = [];
    const reach = radius + 2 + JIT + SNAP + 1;
    const span = Math.ceil(reach / GRID) + 1;
    const fi = Math.round(q / GRID), fj = Math.round(r / GRID);
    for (let gi = fi - span; gi <= fi + span; gi++)
      for (let gj = fj - span; gj <= fj + span; gj++) {
        if (hexDistance(q, r, gi * GRID, gj * GRID) > reach + GRID) continue;
        const p = this.site(gi, gj);
        if (p && hexDistance(q, r, p.centre.q, p.centre.r) <= radius + 2) out.push(p);
      }
    return out;
  }

  site(gi: number, gj: number): VillagePlan | null {
    const k = this.gk(gi, gj);
    if (this.sites.has(k)) return this.sites.get(k)!;
    if (this.sites.size > 20000) this.sites.clear();
    let p: VillagePlan | null = null;
    try {
      p = this.build(gi, gj);
    } catch (e) {
      if (isRetrySignal(e)) throw e;
      console.warn('[module:villages] rural site failed', gi, gj, e);
      p = null;
    }
    this.sites.set(k, p);
    return p;
  }

  /** cheap pre-checks shared by the spacing test (no recursion into neighbour spacing) */
  private viable(gi: number, gj: number): boolean {
    if (rand01(this.s, gi, gj, 9) > 0.92) return false;
    const A = this.anchorOf(gi, gj);
    if (!A) return false;
    for (const n of this.pl.rawNodes(A.q, A.r, SETTLE_CLEAR)) {
      const d = this.pl.degreeOf(n.i, n.j);
      if (d >= 2 && this.pl.kindOf(n.q, n.r, d)) return false;
    }
    return true;
  }

  private build(gi: number, gj: number): VillagePlan | null {
    const S = this.s, pl = this.pl, get = pl.get;
    const R = (...v: number[]) => rand01(S, gi, gj, ...v);
    if (R(9) > 0.92) return null;
    const A = this.anchorOf(gi, gj);
    if (!A) return null;
    // spacing to neighbouring sites (higher prio wins)
    for (let di = -2; di <= 2; di++)
      for (let dj = -2; dj <= 2; dj++) {
        if (!di && !dj) continue;
        const B = this.anchorOf(gi + di, gj + dj);
        if (B && hexDistance(A.q, A.r, B.q, B.r) < SITE_SPACING && (B.prio > A.prio || (B.prio === A.prio && (di > 0 || (di === 0 && dj > 0)))) && this.viable(gi + di, gj + dj)) return null;
      }
    // keep clear of villages and hamlets
    for (const n of pl.rawNodes(A.q, A.r, SETTLE_CLEAR)) {
      const d = pl.degreeOf(n.i, n.j);
      if (d >= 2 && pl.kindOf(n.q, n.r, d)) return null;
    }
    const L = A.level;
    const free = (q: number, r: number) => {
      const c = get(q, r);
      return !c.roadMask && c.level === L && pl.ok(q, r);
    };
    // road-side cells of the anchor, deterministic order
    const sides: { q: number; r: number; d: number }[] = [];
    for (let d = 0; d < 6; d++) {
      const q = A.q + DIRS[d][0], r = A.r + DIRS[d][1];
      if (free(q, r) && !get(q, r).tags.includes('embankment')) sides.push({ q, r, d: opposite(d) });
    }
    sides.sort((a, b) => hash(S, a.q, a.r, 5) - hash(S, b.q, b.r, 5));
    if (!sides.length) return null;
    const F = sides[0];
    // context
    let up = 0, drop = 0, rocky = false, forest = 0;
    for (const [a, b] of DIRS) {
      const n = get(F.q + a, F.r + b);
      if (n.water) continue;
      if (n.level > L) up++;
      if (n.level < L) drop++;
      if (n.tags.includes('rock') || n.biome === 'mountain') rocky = true;
      forest += n.forest;
    }
    // rock / mountain within 2 (a cliff foot with an outcrop) → mine country
    if (!rocky)
      for (let dq = -2; dq <= 2 && !rocky; dq++)
        for (let dr = Math.max(-2, -dq - 2); dr <= Math.min(2, -dq + 2); dr++) {
          const n = get(F.q + dq, F.r + dr);
          if (n.level > L && (n.tags.includes('rock') || n.biome === 'mountain')) { rocky = true; break; }
        }
    let feature: RuralFeature | null;
    const u = R(10);
    if ((up >= 2 || rocky) && u < 0.75) feature = 'mine';
    else if ((drop >= 2 && u < 0.45) || (drop >= 1 && L >= 1 && u < 0.2)) feature = 'watchtower';
    else if (forest >= 2.4) feature = u < 0.8 ? 'lumbercamp' : 'chapel';
    else feature = u < 0.86 ? 'farmstead' : u < 0.9 ? 'chapel' : null;
    if (!feature) return null;

    const li = Math.round(A.q / MACRO), lj = Math.round(A.r / MACRO);
    const perm = PERMS[hash(pl.seed, strSeed('villages.colors')) % PERMS.length];
    const color = COLORS[perm[(((li + 2 * lj) % 4) + 4) % 4]];
    const cells = new Map<string, PlanCell>();
    const blank = (q: number, r: number): PlanCell => ({
      q, r, role: 'edge', type: null, asset: null, rotY: 0, door: -1, face: -1, items: [], field: false, garden: false,
      square: false, plaza: false, fences: [], gates: [], crop: null, y: L * LEVEL_H,
    });
    /** facing of a road-side cell: toward the nearest point of the road strips next to it (half edge steps) */
    const faceOf = (q: number, r: number): number | null => {
      const w = hexToWorld(q, r);
      const segs: [number, number, number, number][] = [];
      for (let d = 0; d < 6; d++) {
        const nq = q + DIRS[d][0], nr = r + DIRS[d][1];
        const c = get(nq, nr);
        if (!c.roadMask) continue;
        const sw = hexToWorld(nq, nr);
        for (let e = 0; e < 6; e++) if ((c.roadMask >> e) & 1) {
          const v = edgeVector(e);
          segs.push([sw.x, sw.z, sw.x + v.x * 7.5, sw.z + v.z * 7.5]);
        }
      }
      return roadFace(w.x, w.z, segs);
    };
    const building = (q: number, r: number, t: BuildingType, door: number): boolean => {
      if (get(q, r).tags.includes('embankment')) return false;
      const face = faceOf(q, r) ?? door; // off the road (windmill): face the given edge
      const at = fitOne(t, face) ?? fitOne(t, door);
      if (!at) return false;
      const pc = blank(q, r);
      const it: Item = { type: t, asset: buildingId(t, color), x: at.x, z: at.z, rotY: at.rotY, door, face: at.rotY === rotForDoor(t, face) ? face : door };
      pc.items.push(it);
      pc.type = t; pc.asset = it.asset; pc.rotY = it.rotY; pc.door = door; pc.face = it.face;
      cells.set(key(q, r), pc);
      return true;
    };

    const main: BuildingType =
      feature === 'mine' ? 'mine' : feature === 'watchtower' ? (R(11) < 0.6 ? 'tower_B' : 'tower_A') : feature === 'lumbercamp' ? 'lumbermill' : feature === 'chapel' ? 'church' : R(11) < 0.55 ? 'home_A' : 'home_B';
    if (!building(F.q, F.r, main, F.d)) return null;
    // a second house: farmsteads 55 %, lumber camps 40 % (on another road-side cell next to the first)
    if ((feature === 'farmstead' && R(12) < 0.55) || (feature === 'lumbercamp' && R(12) < 0.4)) {
      const F2 = sides.find((s) => s !== F && hexDistance(s.q, s.r, F.q, F.r) === 1);
      if (F2) building(F2.q, F2.r, R(13) < 0.5 ? 'home_A' : 'home_B', F2.d);
    }
    // fields behind a farmstead: 1–3 cells off the road, one crop per farm, closed fence with a gate to the road
    const fields: { q: number; r: number }[] = [];
    if (feature === 'farmstead') {
      const want = 1 + Math.floor(R(14) * 3);
      const crop: PlanCell['crop'] = R(15) < 0.55 ? 'grain' : 'dirt';
      const frontier = [...cells.values()].map((c) => ({ q: c.q, r: c.r }));
      for (let i = 0; i < frontier.length && fields.length < want; i++) {
        const c = frontier[i];
        const ns = [0, 1, 2, 3, 4, 5].sort((a, b) => hash(S, c.q, c.r, 16 + a) - hash(S, c.q, c.r, 16 + b));
        for (const d of ns) {
          if (fields.length >= want) break;
          const q = c.q + DIRS[d][0], r = c.r + DIRS[d][1];
          if (cells.has(key(q, r)) || !free(q, r) || hexDistance(q, r, A.q, A.r) > 3) continue;
          // fields keep off the road edge where possible (behind the farm)
          let roadNb = 0;
          for (const [a, b] of DIRS) if (get(q + a, r + b).roadMask) roadNb++;
          if (roadNb > 1) continue;
          const pc = blank(q, r);
          pc.field = true;
          pc.crop = crop;
          cells.set(key(q, r), pc);
          fields.push({ q, r });
          frontier.push({ q, r });
        }
      }
      let gated = false;
      for (const f of fields) {
        const pc = cells.get(key(f.q, f.r))!;
        for (let d = 0; d < 6; d++) {
          const nq = f.q + DIRS[d][0], nr = f.r + DIRS[d][1];
          if (cells.get(key(nq, nr))?.field) continue;
          const n = get(nq, nr);
          if (n.water || n.level > L) continue;
          if (n.roadMask && !gated && n.level === L) { gated = true; pc.gates.push(d); continue; }
          pc.fences.push(d);
        }
      }
    }
    // a windmill on some farms (landmark): on a free cell touching the fields, door toward the road
    let windmill: VillagePlan['windmill'] = null;
    if (feature === 'farmstead' && fields.length && R(17) < 0.35) {
      outer: for (const f of fields)
        for (let d = 0; d < 6; d++) {
          const q = f.q + DIRS[d][0], r = f.r + DIRS[d][1];
          if (cells.has(key(q, r)) || !free(q, r) || hexDistance(q, r, A.q, A.r) > 3) continue;
          if (building(q, r, 'windmill', (d + 3) % 6)) { windmill = { q, r }; break outer; }
        }
    }
    const doors: VillagePlan['doors'] = [];
    for (const c of cells.values()) {
      const w = hexToWorld(c.q, c.r);
      for (const it of c.items) {
        const v = faceVec(it.face);
        const depth = FRONT_DEPTH[it.type] * UNIT + 0.5;
        doors.push({ q: c.q, r: c.r, d: it.door, type: it.type, world: { x: w.x + it.x + v.x * depth, y: L * LEVEL_H, z: w.z + it.z + v.z * depth } });
      }
    }
    return {
      id: `r${gi},${gj}`, kind: 'rural', feature, centre: { q: A.q, r: A.r }, level: L, degree: 0, color, cells,
      streets: [{ q: A.q, r: A.r, ds: 0 }], doors, well: null, fields, windmill, plaza: null, spawn: null,
      flat: new Set<string>(),
    };
  }
}
