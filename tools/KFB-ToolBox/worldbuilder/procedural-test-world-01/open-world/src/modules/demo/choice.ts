// Boot-time spawn choice — must stay cheap (≤ ~1 s on the loaded machine; integrator requirement). The scorer
// (score.ts) is an OFFLINE tool: its results are baked into presets.ts. At boot, in this order:
//   1. `?demoVillage=v<q>,<r>`        → that village (one planner lookup)
//   2. FIXED[seed] (precomputed spawn) → no world lookup at boot (a cold village lookup costs ~3 s: it builds the
//      road net). SELF-HEALING: on `ready` (chunks built, planner warm, lookup ≈ ms, before the first screenshot)
//      healSpawn() compares it with the village's LIVE planned spawn and respawns there silently if they differ —
//      a stale table never leaves the player on a roof (`stale: true` in __kfb.demo().boot).
//   3. BEST[seed] (scan table)         → villageCentredAt(seed, q, r): one small planner lookup
//   4. fast fallback                   → nearest proper village within 10 / 18 / 28 cells of the origin
//   5. the origin
import type { CoreContext } from '../../core/types';
import * as VA from '../villages/api';
import { villagesNear, type VillageInfo } from '../villages/api';
import type { Cell, V3 } from './graph';
import { BEST, FIXED } from './presets';
import { villageCentredAt } from './score';

export interface Choice {
  id: string | null;
  centre: Cell | null;
  spawn: { world: V3; heading: number };
  source: 'param' | 'fixed' | 'table' | 'nearest' | 'origin';
  ms: number;
  /** the precomputed spawn differed from the live planned one (presets.ts out of date; harmless) */
  stale?: boolean;
  /** heading turned off the village's planned heading to frame a landmark (rad), and which one */
  aim?: { delta: number; landmark: string; dist_m: number } | null;
}

const r2 = (x: number) => +x.toFixed(2);

function fromVillage(v: VillageInfo, source: Choice['source'], t0: number): Choice | null {
  if (v.kind !== 'village' || !v.spawn) return null;
  const s = v.spawn.world;
  const aim = aimHeading(v);
  return {
    id: v.id, centre: { ...v.centre }, spawn: { world: [r2(s.x), r2(s.y), r2(s.z)], heading: v.spawn.heading + (aim?.delta ?? 0) },
    source, ms: Math.round(performance.now() - t0), aim,
  };
}

/**
 * Landmark-aware heading: turn the village's planned heading by up to ±20° (5° steps) when that brings a watchtower /
 * chapel / lumber camp / mine (rural features within 150 m) closer to the screen centre, but only if the street view keeps
 * at least as many buildings (±32°, 5–55 m) and the well stays in view if it was. 0 when nothing is gained.
 */
function aimHeading(v: VillageInfo): Choice['aim'] {
  const ruralNear = (VA as { ruralNear?: (seed: number, q: number, r: number, radius: number) => VillageInfo[] }).ruralNear;
  if (!v.spawn || !ruralNear) return null;
  const s = v.spawn.world, h0 = v.spawn.heading;
  const marks: { x: number; z: number; f: string; d: number }[] = [];
  let rural: VillageInfo[] = [];
  try { rural = ruralNear(currentSeed, v.centre.q, v.centre.r, 12); } catch { rural = []; }
  for (const r of rural) {
    if (!r.feature || !['watchtower', 'chapel', 'lumbercamp', 'mine'].includes(r.feature)) continue;
    const it = r.cells.flatMap((c) => c.items)[0];
    if (!it) continue;
    const d = Math.hypot(it.world.x - s.x, it.world.z - s.z);
    if (d < 10 || d > 150) continue;
    marks.push({ x: it.world.x, z: it.world.z, f: r.feature, d });
  }
  if (!marks.length) return null;
  const off = (h: number, x: number, z: number) => {
    const a = Math.atan2(x - s.x, z - s.z) - h;
    return Math.abs(Math.atan2(Math.sin(a), Math.cos(a)));
  };
  const view = (h: number) => {
    let n = 0;
    for (const c of v.cells) for (const it of c.items) {
      const d = Math.hypot(it.world.x - s.x, it.world.z - s.z);
      if (it.type !== 'well' && d > 5 && d < 55 && off(h, it.world.x, it.world.z) < (32 * Math.PI) / 180) n++;
    }
    const well = !!v.well && off(h, v.well.world.x, v.well.world.z) < (30 * Math.PI) / 180;
    return { n, well };
  };
  const base = view(h0);
  const bestOff = (h: number) => Math.min(...marks.map((m) => off(h, m.x, m.z)));
  let best = { delta: 0, gain: 0 };
  for (let k = -4; k <= 4; k++) {
    if (!k) continue;
    const h = h0 + (k * 5 * Math.PI) / 180;
    const vw = view(h);
    if (vw.n < base.n || (base.well && !vw.well)) continue;
    const gain = bestOff(h0) - bestOff(h);
    // only worth it if the landmark ends up inside the central ±25° of the frame
    if (bestOff(h) < (25 * Math.PI) / 180 && gain > best.gain + 0.01) best = { delta: h - h0, gain };
  }
  if (!best.delta) return null;
  const m = marks.reduce((a, b) => (off(h0 + best.delta, a.x, a.z) < off(h0 + best.delta, b.x, b.z) ? a : b));
  return { delta: +best.delta.toFixed(4), landmark: m.f, dist_m: Math.round(m.d) };
}

let currentSeed = 0;

export function chooseSpawn(ctx: CoreContext): Choice {
  const t0 = performance.now();
  const seed = ctx.world.seed;
  currentSeed = seed;
  const m = /^v?(-?\d+),(-?\d+)$/.exec(ctx.params.get('demoVillage') ?? '');
  if (m) {
    const v = villageCentredAt(seed, +m[1], +m[2]);
    const c = v && fromVillage(v, 'param', t0);
    if (c) return c;
  }
  const f = FIXED[seed];
  if (f) return { id: f.id, centre: { q: f.centre[0], r: f.centre[1] }, spawn: { world: f.spawn, heading: f.heading }, source: 'fixed', ms: Math.round(performance.now() - t0) };
  const b = BEST[seed];
  if (b) {
    const v = villageCentredAt(seed, b[0], b[1]);
    const c = v && fromVillage(v, 'table', t0);
    if (c) return c;
  }
  for (const R of [10, 18, 28]) {
    for (const v of villagesNear(seed, 0, 0, R)) {
      const c = fromVillage(v, 'nearest', t0);
      if (c) return c;
    }
  }
  return { id: null, centre: null, spawn: { world: [0, r2(ctx.world.heightAt(0, 0)), 0], heading: 0 }, source: 'origin', ms: Math.round(performance.now() - t0) };
}

/**
 * Self-healing (call once the chunks around the spawn exist): the village's live planned spawn (+ landmark aim) for the
 * chosen village; returns a corrected Choice when the current one is off by > 0.5 m or > 1°, else null. If the village
 * itself is gone, the nearest proper village. Never throws.
 */
export function healSpawn(ctx: CoreContext, c: Choice): Choice | null {
  try {
    const t0 = performance.now();
    currentSeed = ctx.world.seed;
    let live: Choice | null = null;
    if (c.centre) {
      const v = villageCentredAt(ctx.world.seed, c.centre.q, c.centre.r);
      live = v ? fromVillage(v, c.source, t0) : null;
    }
    if (!live && c.source !== 'origin') {
      for (const v of villagesNear(ctx.world.seed, 0, 0, 28)) if ((live = fromVillage(v, 'nearest', t0))) break;
    }
    if (!live) return null;
    const a = live.spawn.world, b = c.spawn.world;
    const dh = Math.abs(Math.atan2(Math.sin(live.spawn.heading - c.spawn.heading), Math.cos(live.spawn.heading - c.spawn.heading)));
    if (Math.hypot(a[0] - b[0], a[2] - b[2]) <= 0.5 && Math.abs(a[1] - b[1]) <= 0.5 && dh <= Math.PI / 180) return null;
    live.stale = true;
    live.ms = c.ms;
    return live;
  } catch {
    return null;
  }
}
