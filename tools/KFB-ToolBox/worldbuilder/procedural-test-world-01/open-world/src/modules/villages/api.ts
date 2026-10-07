import {surfaceFor} from '../../core/surface';
// Public, pure village queries for props / demo / others. Import from 'src/modules/villages/api'.
//
// Villages are a pure function of (seed, terrain, roads). The helpers work once the villages module is active in the
// running engine (its init binds the planner to the world; the roads module must be active too); they return [] /
// null otherwise. Inside a WORLD LAYER (stage ≥ 4) prefer the cell data: `village`, `building`, `reserved`, tags
// `village`, `square`, `well`, `field`, `door:<d>`, `bld:<type>`, `fence:<d>`.
import type { VillageColor } from '../../core/types';
import { hexDistance, hexToWorld } from '../../core/hex';
import { LEVEL_H } from '../../core/units';
import { plannerOf, type VillagePlan } from './plan';

export type { VillagePlan };

export interface VillageCellInfo {
  q: number;
  r: number;
  role: 'centre' | 'lot' | 'edge';
  /** building type ('home_A', 'tavern', 'well', 'windmill', …) or null for fields */
  type: string | null;
  asset: string | null;
  rotY: number;
  /** door edge (OUR order, a road edge) or -1 */
  door: number;
  /** facing as an edge index, may be a half step (x.5 = the corner between two street edges) */
  face: number;
  field: boolean;
  square: boolean;
  fences: number[];
  /** every building on the cell with its exact WORLD pose (x, z = position of the model origin, ground y), as rendered.
   *  Most cells hold one; a street corner may hold two houses (`items[0]` = the cell's `type/asset/rotY`). */
  items: VillageItem[];
  /** walled grain plot behind the houses (also `field: true`) */
  garden: boolean;
  /** the plaza cell (sandy square toward the crossing, the well on it) */
  plaza: boolean;
}

export interface VillageItem {
  type: string;
  asset: string;
  world: { x: number; y: number; z: number };
  rotY: number;
  /** road edge next to the door (-1 for the well) */
  door: number;
  /** facing as an edge index (x.5 = corner between two edges); door direction = (cos(face·60°), −sin(face·60°)) */
  face: number;
}

export interface VillageInfo {
  id: string;
  kind: 'village' | 'hamlet' | 'rural';
  /** rural features only: 'farmstead' | 'watchtower' | 'mine' | 'lumbercamp' | 'chapel' */
  feature?: string;
  centre: { q: number; r: number };
  /** world xz of the crossing + ground y */
  world: { x: number; y: number; z: number };
  level: number;
  /** number of roads meeting at the centre */
  degree: number;
  color: VillageColor;
  cells: VillageCellInfo[];
  /** building doors: cell, edge d (a road edge next to the door), world point on the ground just outside the door */
  doors: { q: number; r: number; d: number; type: string; world: { x: number; y: number; z: number } }[];
  /** well (on the square cell) or null */
  well: { q: number; r: number; world: { x: number; y: number; z: number } } | null;
  fields: { q: number; r: number }[];
  windmill: { q: number; r: number } | null;
  /** street (road) cells of the village with their road distance from the centre */
  streets: { q: number; r: number; ds: number }[];
  /** plaza cell + the edge toward the crossing (villages; hamlets: null) */
  plaza: { q: number; r: number; toward: number } | null;
  /** guaranteed free standing point on a flat street cell 1–2 cells out, `heading` = atan2(dx, dz) toward the centre
   *  (pass straight to player.spawn(x, y + 0.2, z, heading)) */
  spawn: { world: { x: number; y: number; z: number }; heading: number } | null;
}

function info(p: VillagePlan, seed:number): VillageInfo {
  const fit=(w:{x:number;y:number;z:number})=>({...w,y:surfaceFor(seed).heightAt(w.x,w.z)});
  const w = hexToWorld(p.centre.q, p.centre.r);
  return {
    id: p.id, kind: p.kind, feature: p.feature, centre: { ...p.centre }, world: { x: w.x, y: surfaceFor(seed).heightAt(w.x,w.z), z: w.z }, level: p.level,
    degree: p.degree, color: p.color,
    cells: [...p.cells.values()].map((c) => {
      const w = hexToWorld(c.q, c.r);
      const y = surfaceFor(seed).heightAt(w.x,w.z); // all village cells sit at their own flat level; see items[].world.y
      return {
        q: c.q, r: c.r, role: c.role, type: c.type, asset: c.asset, rotY: c.rotY, door: c.door, face: c.face, field: c.field,
        square: c.square, fences: c.fences.slice(), garden: c.garden, plaza: c.plaza,
        items: c.items.map((it) => ({
          type: it.type, asset: it.asset, rotY: it.rotY, door: it.door, face: it.face,
          world: { x: w.x + it.x, y: surfaceFor(seed).heightAt(w.x+it.x,w.z+it.z), z: w.z + it.z },
        })),
      };
    }),
    doors: p.doors.map((d) => ({ ...d, world: fit(d.world) })),
    well: p.well ? { q: p.well.q, r: p.well.r, world: fit(p.well.world) } : null,
    fields: p.fields.map((f) => ({ ...f })),
    windmill: p.windmill ? { ...p.windmill } : null,
    streets: p.streets.map((s) => ({ ...s })),
    plaza: p.plaza ? { ...p.plaza } : null,
    spawn: p.spawn ? { world: fit(p.spawn.world), heading: p.spawn.heading } : null,
  };
}

/** Villages (and hamlets) whose centre lies within `radius` cells of (q, r), nearest first. */
export function villagesNear(seed: number, q: number, r: number, radius: number): VillageInfo[] {
  const pl = plannerOf(seed);
  if (!pl) return [];
  return pl
    .near(q, r, radius)
    .sort((a, b) => hexDistance(q, r, a.centre.q, a.centre.r) - hexDistance(q, r, b.centre.q, b.centre.r))
    .map(p=>info(p,seed));
}

/** Nearest proper village (≥ 3 roads) to (q, r) within `radius`, else the nearest hamlet, else null. */
export function nearestVillage(seed: number, q: number, r: number, radius = 60): VillageInfo | null {
  const all = villagesNear(seed, q, r, radius);
  return all.find((v) => v.kind === 'village') ?? all[0] ?? null;
}

/**
 * Rural features (farmsteads, watchtowers, mines, lumber camps, lone chapels) along the roads between settlements,
 * centre (= the road cell they hang on) within `radius` cells of (q, r), nearest first. Same VillageInfo shape
 * (kind 'rural', `feature`, doors, fields; no well/plaza/spawn).
 */
export function ruralNear(seed: number, q: number, r: number, radius: number): VillageInfo[] {
  const pl = plannerOf(seed);
  if (!pl) return [];
  return pl.rural
    .near(q, r, radius)
    .filter((p) => hexDistance(q, r, p.centre.q, p.centre.r) <= radius)
    .sort((a, b) => hexDistance(q, r, a.centre.q, a.centre.r) - hexDistance(q, r, b.centre.q, b.centre.r))
    .map(p=>info(p,seed));
}

/** Buildings standing on cell (q, r) with exact world poses (empty if none). */
export function villageItemsAt(seed: number, q: number, r: number): VillageItem[] {
  const hit = plannerOf(seed)?.cell(q, r);
  if (!hit) return [];
  const w = hexToWorld(q, r);
  return hit.cell.items.map((it) => ({
    type: it.type, asset: it.asset, rotY: it.rotY, door: it.door, face: it.face,
    world: { x: w.x + it.x, y: surfaceFor(seed).heightAt(w.x+it.x,w.z+it.z), z: w.z + it.z },
  }));
}

/** The village owning cell (q, r), if any. */
export function villageAt(seed: number, q: number, r: number): VillageInfo | null {
  const hit = plannerOf(seed)?.cell(q, r);
  return hit ? info(hit.plan,seed) : null;
}
