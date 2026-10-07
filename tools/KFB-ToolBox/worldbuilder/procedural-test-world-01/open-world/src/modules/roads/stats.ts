// Network QA over a hex disc: used by the offline harness (tools/harness.mjs) and by the showcase (window.__roads).
import type { WorldModel } from '../../core/world';
import { DIRS, hexDistance } from '../../core/hex';

const bits = (m: number) => {
  let n = 0;
  for (; m; m &= m - 1) n++;
  return n;
};

export function networkStats(world: WorldModel, q0: number, r0: number, R: number) {
  const s = {
    cells: 0, land: 0, road: 0, roadPct: 0, crossings: 0, crossingsPerKm2: 0, nodes2: 0, deadEnds: 0, sharpBends: 0,
    roadRamps: 0, terrainRampRoads: 0, roadTriangles: 0, parallelAdj: 0, maskMismatch: 0, roadOnWaterOrCoast: 0, junctionsOffNode: 0, rampBad: 0,
    river: 0, riverPct: 0, bridges: 0, riverRoadNoBridge: 0, riverTriangles: 0, riverDeadEnds: 0, riverSharp: 0,
    riverLevelSteps: 0, riverOnVillage: 0, riverMismatch: 0, riverSystems: 0, levelJumps: 0,
  };
  const get = (q: number, r: number) => world.cell(q, r);
  for (let q = q0 - R; q <= q0 + R; q++)
    for (let r = r0 - R; r <= r0 + R; r++) {
      if (hexDistance(q, r, q0, r0) > R) continue;
      const c = get(q, r);
      s.cells++;
      if (!c.water) s.land++;
      if (c.roadMask) {
        s.road++;
        if (c.water || c.coastMask) s.roadOnWaterOrCoast++;
        const n = bits(c.roadMask);
        if (n === 1) { s.deadEnds++; (s as any).deadAt = [...((s as any).deadAt ?? []), [q, r, c.tags.includes('road-node')]]; }
        if (n >= 3 && !c.tags.includes('road-node')) s.junctionsOffNode++;
        if (n === 2) {
          for (let d = 0; d < 6; d++) if ((c.roadMask >> d) & 1 && (c.roadMask >> ((d + 1) % 6)) & 1) { s.sharpBends++; (s as any).sharpAt = [...((s as any).sharpAt ?? []), [q, r, c.roadMask, c.tags.join('|'), c.level]]; }
        }
        if (c.tags.includes('crossing')) s.crossings++;
        if (c.tags.includes('road-node') && !c.tags.includes('crossing')) s.nodes2++;
        if (c.slope) {
          if (c.tags.includes('road-ramp')) s.roadRamps++;
          if (c.tags.includes('road-ramp')) {
            // tongue: only the high neighbour above the ramp's level
            let hi = 0;
            for (let d = 0; d < 6; d++) { const n = get(q + DIRS[d][0], r + DIRS[d][1]); if (n.level > c.level) hi++; }
            (s as any).tongueRamps = ((s as any).tongueRamps ?? 0) + (hi === 1 ? 1 : 0);
          }
          else s.terrainRampRoads++;
          const sd = c.slope.dir;
          if (c.roadMask !== ((1 << sd) | (1 << ((sd + 3) % 6)))) s.rampBad++;
        }
        for (let d = 0; d < 6; d++) {
          const n1 = get(q + DIRS[d][0], r + DIRS[d][1]);
          const linked = (c.roadMask >> d) & 1;
          if (linked !== ((n1.roadMask >> ((d + 3) % 6)) & 1)) s.maskMismatch++;
          if (!linked && n1.roadMask) s.parallelAdj++;
          // height continuity along the link
          if (linked) {
            const hc = c.level + (c.slope && (d === c.slope.dir) ? c.slope.steps : 0);
            const hn = n1.level + (n1.slope && ((d + 3) % 6 === n1.slope.dir) ? n1.slope.steps : 0);
            if (hc !== hn && !c.bridge && !n1.bridge) s.levelJumps++;
          }
          // triangle: c–n1 and c–n2 and n1–n2 linked
          const e = (d + 1) % 6;
          const n2 = get(q + DIRS[e][0], r + DIRS[e][1]);
          if (linked && (c.roadMask >> e) & 1) {
            const dd = [0, 1, 2, 3, 4, 5].find((t) => q + DIRS[d][0] + DIRS[t][0] === q + DIRS[e][0] && r + DIRS[d][1] + DIRS[t][1] === r + DIRS[e][1])!;
            if ((n1.roadMask >> dd) & 1) s.roadTriangles++;
          }
          void n2;
        }
      }
      if (c.riverMask) {
        s.river++;
        if (c.village) s.riverOnVillage++;
        const n = bits(c.riverMask);
        if (n === 1) { s.riverDeadEnds++; (s as any).riverDeadAt = [...((s as any).riverDeadAt ?? []), [q, r, c.riverMask, c.level]]; }
        if (n === 2) for (let d = 0; d < 6; d++) if ((c.riverMask >> d) & 1 && (c.riverMask >> ((d + 1) % 6)) & 1) s.riverSharp++;
        if (n === 2) { let straight = false; for (let d = 0; d < 3; d++) if ((c.riverMask >> d) & 1 && (c.riverMask >> (d + 3)) & 1) straight = true; (s as any).riverBendPct = ((s as any).riverBendPct ?? 0) + (straight ? 0 : 1); }
        if (c.roadMask) {
          if (c.bridge) s.bridges++;
          else s.riverRoadNoBridge++;
        }
        for (let d = 0; d < 6; d++) {
          const n1 = get(q + DIRS[d][0], r + DIRS[d][1]);
          const linked = (c.riverMask >> d) & 1;
          if (linked !== ((n1.riverMask >> ((d + 3) % 6)) & 1)) s.riverMismatch++;
          if (linked && n1.level !== c.level) s.riverLevelSteps++;
          const e = (d + 1) % 6;
          if (linked && (c.riverMask >> e) & 1) {
            const n2q = q + DIRS[e][0], n2r = r + DIRS[e][1];
            const dd = [0, 1, 2, 3, 4, 5].find((t) => q + DIRS[d][0] + DIRS[t][0] === n2q && r + DIRS[d][1] + DIRS[t][1] === n2r)!;
            if ((n1.riverMask >> dd) & 1) s.riverTriangles++;
          }
        }
      }
    }
  s.parallelAdj /= 2;
  s.roadPct = +((100 * s.road) / Math.max(1, s.land)).toFixed(1);
  s.riverPct = +((100 * s.river) / Math.max(1, s.land)).toFixed(1);
  (s as any).riverBendPct = +((100 * ((s as any).riverBendPct ?? 0)) / Math.max(1, s.river)).toFixed(0);
  {
    // straight river runs: longest and histogram (runs start where the previous cell along the axis is not straight)
    const axisOf = (q: number, r: number): number => {
      const m = get(q, r).riverMask;
      for (let d = 0; d < 3; d++) if (m === ((1 << d) | (1 << (d + 3)))) return d;
      return -1;
    };
    const hist: Record<number, number> = {};
    let longest = 0;
    for (let q = q0 - R; q <= q0 + R; q++)
      for (let r = r0 - R; r <= r0 + R; r++) {
        if (hexDistance(q, r, q0, r0) > R) continue;
        const a = axisOf(q, r);
        if (a < 0 || axisOf(q - DIRS[a][0], r - DIRS[a][1]) === a) continue;
        let n = 1;
        while (axisOf(q + DIRS[a][0] * n, r + DIRS[a][1] * n) === a) n++;
        hist[n] = (hist[n] ?? 0) + 1;
        longest = Math.max(longest, n);
      }
    (s as any).riverRuns = hist;
    (s as any).riverLongestRun = longest;
  }
  const km2 = (s.cells * (Math.sqrt(3) / 2) * 15 * 15) / 1e6;
  s.crossingsPerKm2 = +(s.crossings / km2).toFixed(2);
  return s;
}
