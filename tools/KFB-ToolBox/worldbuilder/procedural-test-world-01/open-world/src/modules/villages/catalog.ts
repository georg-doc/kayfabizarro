// Building catalogue: asset ids, measured door directions and front depths.
//
// DOOR DIRECTION (measured in ?showcase=villages&view=doors, every type × 6 rotations seen from +Z, see NOTES.md):
// every KayKit hexagon-pack building used here has its door / open front on LOCAL +Z (a hex corner direction at
// rotation 0, not an edge). In OUR angle convention (ARCHITECTURE §1: angle from +X toward −Z) local +Z is −90°.
// A building whose door must face hex edge d therefore gets rotation.y = d·60° + 90° (see `rotForDoor`).
import type { VillageColor } from '../../core/types';
import { HEX_SCALE } from '../../core/units';

export type BuildingType =
  | 'home_A' | 'home_B' | 'tavern' | 'blacksmith' | 'market' | 'church' | 'well' | 'windmill' | 'lumbermill'
  | 'stage_B' | 'stage_C' | 'mine' | 'tower_A' | 'tower_B';

export const COLORS: VillageColor[] = ['blue', 'red', 'green', 'yellow'];

/** Door direction of each model at rotation 0, as an angle in OUR convention (radians, from +X toward −Z). */
export const DOOR_ANGLE: Record<BuildingType, number> = {
  home_A: -Math.PI / 2, // door in the gable end, +Z
  home_B: -Math.PI / 2, // door + side stairs on the +Z facade
  tavern: -Math.PI / 2, // door + stairs under the barrel sign, +Z
  blacksmith: -Math.PI / 2, // open forge + workshop door, +Z
  market: -Math.PI / 2, // awning / stalls, +Z
  church: -Math.PI / 2, // tower door, +Z
  well: -Math.PI / 2, // crank side, +Z (round, nearly symmetric)
  windmill: -Math.PI / 2, // door + sails, +Z
  lumbermill: -Math.PI / 2, // door + stairs, +Z
  stage_B: -Math.PI / 2, // construction site (neutral): open frame, stair stub on +Z
  stage_C: -Math.PI / 2, // construction site, timber frame on a stone plinth
  mine: -Math.PI / 2, // gallery mouth + rails, +Z
  tower_A: -Math.PI / 2, // door, +Z
  tower_B: -Math.PI / 2, // door, +Z
};

/** Neutral (colourless) types. */
export const NEUTRAL_TYPES = new Set<BuildingType>(['stage_B', 'stage_C']);

/**
 * Front depth (asset units, local +Z extent of the model incl. stairs) → door threshold position for props/demo.
 * From the glTF bounds (tools/bounds.mjs).
 */
export const FRONT_DEPTH: Record<BuildingType, number> = {
  home_A: 0.385, home_B: 0.56, tavern: 0.63, blacksmith: 0.685, market: 0.601, church: 0.595, well: 0.375,
  windmill: 0.438, lumbermill: 0.73, stage_B: 0.555, stage_C: 0.553, mine: 0.9, tower_A: 0.58, tower_B: 0.691,
};

/** Local footprint (asset units, from the glTF bounds): [minX, maxX, minZ, maxZ]; +Z = front. */
export const FOOTPRINT: Record<BuildingType, [number, number, number, number]> = {
  home_A: [-0.396, 0.396, -0.469, 0.385],
  home_B: [-0.439, 0.436, -0.539, 0.56],
  tavern: [-0.595, 0.577, -0.702, 0.63],
  blacksmith: [-0.63, 0.658, -0.56, 0.685],
  market: [-0.901, 0.898, -0.715, 0.601],
  church: [-0.514, 0.514, -0.56, 0.595],
  well: [-0.315, 0.337, -0.375, 0.375],
  windmill: [-0.558, 0.568, -0.379, 0.438],
  lumbermill: [-0.686, 0.681, -0.459, 0.73],
  stage_B: [-0.496, 0.524, -0.575, 0.555],
  stage_C: [-0.5, 0.66, -0.574, 0.553],
  mine: [-0.817, 0.789, -1.02, 0.9],
  tower_A: [-0.497, 0.497, -0.573, 0.58],
  tower_B: [-0.599, 0.599, -0.691, 0.691],
};

/** Y rotation that turns building `t` so its door faces hex edge d (d may be fractional: d + 0.5 = a corner). */
export function rotForDoor(t: BuildingType, d: number): number {
  return (d * Math.PI) / 3 - DOOR_ANGLE[t];
}

export const buildingId = (t: BuildingType, c: VillageColor) =>
  NEUTRAL_TYPES.has(t) ? `hex/buildings/neutral/building_${t}` : `hex/buildings/${c}/building_${t}_${c}`;

export function typeOfId(id: string): BuildingType | null {
  const m = /building_([a-zA-Z_]+?)_(blue|red|green|yellow)$/.exec(id);
  return m ? (m[1] as BuildingType) : null;
}

export const N = 'hex/buildings/neutral/';
export const GRAIN_ID = N + 'building_grain';
export const DIRT_ID = N + 'building_dirt';
export const FENCE_ID = N + 'fence_stone_straight';
export const GATE_ID = N + 'fence_stone_straight_gate';
/** Pasture fence: KayKit wood fence (0.55 units = 4.1 m at HEX_SCALE) scaled in height to ≈ 1.2 m. */
export const WOOD_FENCE_ID = N + 'fence_wood_straight';
export const WOOD_GATE_ID = N + 'fence_wood_straight_gate';
export const WOOD_SCALE_Y = 0.3;

/**
 * Stone fence: the KayKit wall is 0.27 units (2.0 m) high and 0.2 units (1.5 m) thick at HEX_SCALE — a castle wall
 * next to a 1.9 m figure. The hexagon sample shows knee-to-hip high field walls, so the fence keeps its length (one
 * hex edge) and is scaled in height/thickness only (documented exception, like HEX_PROP_SCALE for props).
 */
export const FENCE_SCALE_Y = 0.55;
export const FENCE_SCALE_T = 0.6;
/** Grain overlay: 0.39 units = 2.95 m of wheat at HEX_SCALE; scaled in height to a ~1.4 m crop. */
export const GRAIN_SCALE_Y = 0.3;
/** …and grown 7 % in plan so neighbouring plots meet (the KayKit plate is 1.874 × 2.094 units on a 2 × 2.309 hex). */
export const GRAIN_SCALE_XZ = 1.07;
/** The grain plate sinks this far (m) so its jagged rim (triangular teeth at street level) hides in the grass top. */
export const GRAIN_SINK = 0.14;

export const ALL_TYPES: BuildingType[] = Object.keys(DOOR_ANGLE) as BuildingType[];

export function allAssetIds(): string[] {
  const ids = new Set<string>([GRAIN_ID, DIRT_ID, FENCE_ID, GATE_ID, WOOD_FENCE_ID, WOOD_GATE_ID, ROAD_REF_ID]);
  for (const c of COLORS) for (const t of ALL_TYPES) ids.add(buildingId(t, c));
  return [...ids];
}

export const UNIT = HEX_SCALE;
/** Front façade → hex edge gap (m) the placer aims for: buildings line the street, gardens behind. */
export const STREET_GAP = 1.8;
/** @deprecated round-1 constant (props module compatibility); buildings now carry exact poses (api `items`). */
export const STREET_SHIFT = 0.1 * HEX_SCALE;
/** Plaza: sandy stadium from the plaza cell to the crossing, radius (m) and lift above the tile top. */
/** Paved plaza hex: centre → edge midpoint (m); the tile is 7.5, the rest is its top bevel rim. */
export const PLAZA_INNER = 7.15;
export const PLAZA_Y = 0.03;
/** Road tile whose surface texel the plaza uses. */
export const ROAD_REF_ID = 'hex/tiles/roads/hex_road_A';
/** The well sits this far (m) from its cell centre toward the crossing (on the plaza). */
export const WELL_OFFSET = 0.25 * HEX_SCALE;
