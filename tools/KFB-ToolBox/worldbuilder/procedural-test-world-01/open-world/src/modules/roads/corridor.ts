// River-valley corridor adapter. Terrain (stage 1) owns the valleys: endless meandering iso-lines, one level along
// their length, no lakes nearby (ARCHITECTURE §4). We read them through terrain's public `riverCorridor()` when it
// exists (namespace import → no hard dependency on the export's presence) and fall back to the generator's
// `river(q, r)` otherwise. Both return { onCentre, corridor, dist, level, id }.
import * as terrainApi from '../terrain/api';
import * as terrainGenMod from '../terrain/gen';
import { hexRound, worldToAxial } from '../../core/hex';
import { HEX_WIDTH } from '../../core/units';

export interface CorridorInfo {
  onCentre: boolean;
  corridor: boolean;
  dist: number;
  level: number;
  id: number;
}

type CorridorFn = (q: number, r: number) => CorridorInfo;
const NONE: CorridorInfo = { onCentre: false, corridor: false, dist: 99, level: 0, id: 0 };
const fns = new Map<number, CorridorFn>();

function norm(v: unknown): CorridorInfo {
  if (!v || typeof v !== 'object') return NONE;
  const o = v as Partial<CorridorInfo>;
  return { onCentre: !!o.onCentre, corridor: !!o.corridor || !!o.onCentre, dist: o.dist ?? 99, level: o.level ?? 0, id: o.id ?? 0 };
}

/** Corridor lookup for a seed (pure). */
export function corridorFn(seed: number): CorridorFn {
  let f = fns.get(seed);
  if (f) return f;
  const api = terrainApi as unknown as Record<string, unknown>;
  const gm = terrainGenMod as unknown as Record<string, unknown>;
  if (typeof api.riverCorridor === 'function') {
    const rc = api.riverCorridor as (...a: number[]) => unknown;
    // accept riverCorridor(seed, q, r) (preferred) — if it returns nothing useful, fall through to the generator
    f = (q, r) => norm(rc(seed, q, r));
  } else if (typeof gm.terrainGen === 'function') {
    const g = (gm.terrainGen as (s: number) => { river?: (q: number, r: number) => unknown })(seed);
    f = g.river ? (q, r) => norm(g.river!(q, r)) : () => NONE;
  } else f = () => NONE;
  // (no memo: terrain's riverCorridor is O(1) now; a string-keyed cache in front of it only cost time)
  fns.set(seed, f);
  return f;
}

/** Spacing between neighbouring river centre lines (cells), from terrain if exported. */
export function riverSpacing(): number {
  const gm = terrainGenMod as unknown as Record<string, unknown>;
  const api = terrainApi as unknown as Record<string, unknown>;
  return Number(api.RIVER_SPACING ?? gm.RIVER_SPACING ?? 37);
}

const axes = new Map<number, { ax: number; az: number }>();

/**
 * Unit vector (cell-unit world xz) ACROSS the rivers (direction in which the river id grows). Estimated from the id
 * field on a large circle (least squares), so it works with any corridor implementation whose ids step by one per line.
 */
export function riverAxis(seed: number): { ax: number; az: number } {
  let a = axes.get(seed);
  if (a) return a;
  const f = corridorFn(seed);
  const S = riverSpacing();
  const R = 4000;
  let sx = 0, sz = 0;
  const N = 36;
  for (let i = 0; i < N; i++) {
    const t = (i / N) * Math.PI * 2;
    const x = R * Math.cos(t), z = R * Math.sin(t);
    const fa = worldToAxial(x * HEX_WIDTH, z * HEX_WIDTH);
    const h = hexRound(fa.q, fa.r);
    const id = f(h.q, h.r).id;
    sx += id * S * Math.cos(t);
    sz += id * S * Math.sin(t);
  }
  let ax = sx / (R * N / 2), az = sz / (R * N / 2);
  const l = Math.hypot(ax, az) || 1;
  ax /= l;
  az /= l;
  a = { ax, az };
  axes.set(seed, a);
  return a;
}
