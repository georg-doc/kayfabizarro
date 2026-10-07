// Single source of truth for scale. See ARCHITECTURE.md §1.

/** Medieval Hexagon Pack asset units → metres. A hex tile is 2 asset units flat-to-flat. */
export const HEX_SCALE = 7.5;
/**
 * Hexagon-pack small props (hex/decoration/props/* except tent, flag_*) → metres. The pack's props are modelled for
 * diorama readability and are ~1.7× too big next to a 1.9 m figure at HEX_SCALE (barrel = chest height). Measured in
 * ?showcase=assets: barrel 0.95 m, crate 0.95 m at 4.5. Deliberate, documented exception to "one scale per pack".
 */
export const HEX_PROP_SCALE = 0.6 * HEX_SCALE;
/** Adventurers / Rig_Medium character asset units → metres. */
export const CHAR_SCALE = 0.75;
/** Forest Nature Pack asset units → metres. */
export const FOREST_SCALE = 2;
/** Medieval Builder Pack asset units → metres (optional pack). */
export const BUILDER_SCALE = 7.5; // same hex footprint as the hexagon pack

/** Hex flat-to-flat width in metres. */
export const HEX_WIDTH = 2 * HEX_SCALE;
/** Hex circumradius (centre → corner) in metres. */
export const HEX_SIZE = HEX_WIDTH / Math.sqrt(3);
/** One terrain height step in metres (= *_sloped_low rise). */
export const LEVEL_H = 0.5 * HEX_SCALE;
/** Thickness of one hex tile in metres (tiles extend from top down by this). */
export const TILE_THICKNESS = 1 * HEX_SCALE;
/** Water surface sits this far below the land tile top of the same level. */
export const WATER_DROP = 0.2 * HEX_SCALE;

/** Chunk edge length in hexes (axial parallelogram). */
export const CHUNK = 8;
