// Tile edge atlas for the KayKit Medieval Hexagon Pack road / river / coast tiles.
//
// Edge order is OURS (ARCHITECTURE §1): 0 E(+X), 1 NE, 2 NW, 3 W, 4 SW, 5 SE; edge d faces angle d·60° from +X toward −Z.
// A tile placed with rotation.y = k·60° (three.js, radians k·π/3) carries the rot-0 mask rotated by k: bit d → bit d+k
// (`rotateMask` in core/hex.ts).
//
// Every mask below was DERIVED FROM GEOMETRY, not copied from docs: `src/modules/assets/tools/derive-edges.mjs` probes
// the top-most triangle 0.93 asset units out toward each edge midpoint (7 samples along the edge), interpolates the UV,
// reads the atlas texel and classifies it (grass 192,197,55 · water 37,131,193 · road/sand 223,183,135 · hole = the
// cut-out water area of a `waterless` variant). An edge is "connected" when the middle three samples agree.
// Raw output: `tools/edges.derived.json`. Visual proof: `/?showcase=assets&view=edges` (see NOTES.md).
import * as THREE from 'three';
import { rotateMask } from '../../core/hex';
import { HEX_SCALE } from '../../core/units';

export type EdgeKind = 'road' | 'river' | 'coast';

export interface TileEdges {
  asset: string;
  kind: EdgeKind | 'crossing' | 'base';
  /** Edges carrying a road at rotation 0. */
  road: number;
  /** Edges carrying river water at rotation 0. */
  river: number;
  /** Edges that are open sea / lake (coast tiles; hex_water = all). */
  water: number;
  /** Edges with a sand flank touching them (partial, next to a water edge or a sand corner). */
  sand: number;
  /** Ramp tiles: edge toward which the tile rises, rise in asset units (×HEX_SCALE → metres) and LEVEL_H steps. */
  slope?: { highEdge: number; rise: number; steps: 1 | 2 };
  /** Height (asset units, tile top = 0) of the water surface on this tile, if any. */
  waterY?: number;
  /** `waterless` variant: the water area is a hole (terrain may draw its own animated water). */
  waterless?: boolean;
  /** Coast E: sand corner touching only the vertex between edges `vertex` and `vertex+1`, no water edge. */
  sandCorner?: number;
}

const B = (...edges: number[]) => edges.reduce((m, d) => m | (1 << d), 0);
const T = 'hex/tiles/';

/** Measured rot-0 masks (tools/derive-edges.mjs output, 2026-10-05). */
const TABLE: TileEdges[] = [
  // ---- roads (13 = every non-empty edge set up to rotation) ----
  { asset: T + 'roads/hex_road_M', kind: 'road', road: B(3), river: 0, water: 0, sand: 0 }, // dead end
  { asset: T + 'roads/hex_road_A', kind: 'road', road: B(0, 3), river: 0, water: 0, sand: 0 }, // straight
  { asset: T + 'roads/hex_road_B', kind: 'road', road: B(1, 3), river: 0, water: 0, sand: 0 }, // wide bend
  { asset: T + 'roads/hex_road_C', kind: 'road', road: B(2, 3), river: 0, water: 0, sand: 0 }, // sharp bend
  { asset: T + 'roads/hex_road_D', kind: 'road', road: B(1, 3, 5), river: 0, water: 0, sand: 0 }, // Y
  { asset: T + 'roads/hex_road_E', kind: 'road', road: B(0, 1, 3), river: 0, water: 0, sand: 0 },
  { asset: T + 'roads/hex_road_F', kind: 'road', road: B(0, 3, 5), river: 0, water: 0, sand: 0 }, // mirror of E
  { asset: T + 'roads/hex_road_G', kind: 'road', road: B(2, 3, 4), river: 0, water: 0, sand: 0 },
  { asset: T + 'roads/hex_road_H', kind: 'road', road: B(0, 2, 3, 4), river: 0, water: 0, sand: 0 },
  { asset: T + 'roads/hex_road_I', kind: 'road', road: B(1, 2, 4, 5), river: 0, water: 0, sand: 0 },
  { asset: T + 'roads/hex_road_J', kind: 'road', road: B(0, 3, 4, 5), river: 0, water: 0, sand: 0 },
  { asset: T + 'roads/hex_road_K', kind: 'road', road: B(1, 2, 3, 4, 5), river: 0, water: 0, sand: 0 },
  { asset: T + 'roads/hex_road_L', kind: 'road', road: B(0, 1, 2, 3, 4, 5), river: 0, water: 0, sand: 0 },
  // sloped straight road: low side edge 3 (y≈0), high side edge 0. Ramp over the W half, plateau over the E half.
  { asset: T + 'roads/hex_road_A_sloped_low', kind: 'road', road: B(0, 3), river: 0, water: 0, sand: 0, slope: { highEdge: 0, rise: 0.5, steps: 1 } },
  { asset: T + 'roads/hex_road_A_sloped_high', kind: 'road', road: B(0, 3), river: 0, water: 0, sand: 0, slope: { highEdge: 0, rise: 1, steps: 2 } },
  // ---- rivers (12: no dead end; rivers start/end at water) ----
  ...(
    [
      ['A', B(0, 3)], ['A_curvy', B(0, 3)], ['B', B(1, 3)], ['C', B(2, 3)], ['D', B(1, 3, 5)], ['E', B(0, 1, 3)], ['F', B(0, 3, 5)],
      ['G', B(2, 3, 4)], ['H', B(0, 2, 3, 4)], ['I', B(1, 2, 4, 5)], ['J', B(0, 3, 4, 5)], ['K', B(1, 2, 3, 4, 5)], ['L', B(0, 1, 2, 3, 4, 5)],
    ] as [string, number][]
  ).flatMap(([n, m]): TileEdges[] => [
    { asset: T + `rivers/hex_river_${n}`, kind: 'river', road: 0, river: m, water: 0, sand: 0, waterY: -0.1 },
    { asset: T + `rivers/waterless/hex_river_${n}_waterless`, kind: 'river', road: 0, river: m, water: 0, sand: 0, waterY: -0.1, waterless: true },
  ]),
  // ---- river × road crossings (straight river 0–3, straight road at ±60°) ----
  { asset: T + 'rivers/hex_river_crossing_A', kind: 'crossing', road: B(2, 5), river: B(0, 3), water: 0, sand: 0, waterY: -0.1 },
  { asset: T + 'rivers/hex_river_crossing_B', kind: 'crossing', road: B(1, 4), river: B(0, 3), water: 0, sand: 0, waterY: -0.1 },
  { asset: T + 'rivers/waterless/hex_river_crossing_A_waterless', kind: 'crossing', road: B(2, 5), river: B(0, 3), water: 0, sand: 0, waterY: -0.1, waterless: true },
  { asset: T + 'rivers/waterless/hex_river_crossing_B_waterless', kind: 'crossing', road: B(1, 4), river: B(0, 3), water: 0, sand: 0, waterY: -0.1, waterless: true },
  // ---- coast: contiguous water runs of 1..4 edges; sand flanks on the two edges next to the run ----
  ...(
    [
      ['A', B(5), B(0, 4)],
      ['B', B(4, 5), B(0, 3)],
      ['C', B(4, 5, 0), B(1, 3)],
      ['D', B(4, 5, 0, 1), B(2, 3)],
    ] as [string, number, number][]
  ).flatMap(([n, w, s]): TileEdges[] => [
    { asset: T + `coast/hex_coast_${n}`, kind: 'coast', road: 0, river: 0, water: w, sand: s, waterY: -0.2 },
    { asset: T + `coast/waterless/hex_coast_${n}_waterless`, kind: 'coast', road: 0, river: 0, water: w, sand: s, waterY: -0.2, waterless: true },
  ]),
  // coast E: grass tile with a sand corner at the vertex between edges 4 and 5 (no water edge).
  { asset: T + 'coast/hex_coast_E', kind: 'coast', road: 0, river: 0, water: 0, sand: B(4, 5), sandCorner: 4 },
  { asset: T + 'coast/waterless/hex_coast_E_waterless', kind: 'coast', road: 0, river: 0, water: 0, sand: B(4, 5), sandCorner: 4, waterless: true },
  // ---- base ----
  { asset: T + 'base/hex_grass', kind: 'base', road: 0, river: 0, water: 0, sand: 0 },
  { asset: T + 'base/hex_water', kind: 'base', road: 0, river: 0, water: 63, sand: 0, waterY: -0.2 },
  { asset: T + 'base/hex_grass_sloped_low', kind: 'base', road: 0, river: 0, water: 0, sand: 0, slope: { highEdge: 0, rise: 0.5, steps: 1 } },
  { asset: T + 'base/hex_grass_sloped_high', kind: 'base', road: 0, river: 0, water: 0, sand: 0, slope: { highEdge: 0, rise: 1, steps: 2 } },
];

export const TILE_EDGES: Readonly<Record<string, TileEdges>> = Object.fromEntries(TABLE.map((t) => [t.asset, t]));

/** Every tile id the atlas knows about (callers preload what they use). */
export const EDGE_TILE_IDS: readonly string[] = TABLE.map((t) => t.asset);

const STEP = Math.PI / 3;

/** Primary 6-bit mask of a tile at rotation 0 (road for road tiles, river for river/crossing tiles, water for coast). */
export function edgeMask(tile: string, kind?: EdgeKind): number {
  const t = TILE_EDGES[tile];
  if (!t) return 0;
  const k = kind ?? (t.kind === 'crossing' ? 'river' : t.kind === 'base' ? 'coast' : t.kind);
  return k === 'road' ? t.road : k === 'river' ? t.river : t.water;
}

/** Mask of `tile` after rotation.y = k·60°. */
export function rotatedMask(tile: string, k: number, kind?: EdgeKind): number {
  return rotateMask(edgeMask(tile, kind), k);
}

export interface TileMatch {
  asset: string;
  /** three.js rotation.y in radians (multiple of π/3). */
  rotY: number;
  /** Rotation in 60° steps (0..5). */
  rot: number;
}

export interface MatchOpts {
  /** Prefer the `waterless` variant (rivers / coast). */
  waterless?: boolean;
  /** Rivers: use hex_river_A_curvy for straight runs. */
  curvy?: boolean;
  /** Roads: sloped straight tile rising toward `slope.dir` (mask must be that straight line). */
  slope?: { dir: number; steps: 1 | 2 } | null;
}

function candidates(kind: EdgeKind, opts: MatchOpts): TileEdges[] {
  return TABLE.filter((t) => {
    if (t.kind !== kind) return false;
    if (kind === 'road') return opts.slope ? t.slope?.steps === opts.slope.steps : !t.slope;
    if (kind === 'river') return !!t.waterless === !!opts.waterless && t.asset.includes('_curvy') === !!opts.curvy;
    if (kind === 'coast') return !!t.waterless === !!opts.waterless && t.water !== 0;
    return true;
  });
}

const memo = new Map<string, TileMatch | null>();

/**
 * Tile + rotation whose rotated mask equals `mask` (bit d = edge d, OUR order). Returns null when the pack has no tile
 * for it (e.g. river dead ends, coast with 5 water edges or split water runs, empty mask).
 * Sloped roads: pass `opts.slope`; the result rises toward `slope.dir` and `mask` must be `dir | dir+3`.
 */
export function matchTile(kind: EdgeKind, mask: number, opts: MatchOpts = {}): TileMatch | null {
  mask &= 63;
  const key = `${kind}|${mask}|${opts.waterless ? 1 : 0}|${opts.curvy ? 1 : 0}|${opts.slope ? opts.slope.dir + ':' + opts.slope.steps : '-'}`;
  if (memo.has(key)) return memo.get(key)!;
  let res: TileMatch | null = null;
  if (mask) {
    for (const t of candidates(kind, opts)) {
      const m0 = kind === 'road' ? t.road : kind === 'river' ? t.river : t.water;
      for (let k = 0; k < 6 && !res; k++) {
        if (rotateMask(m0, k) !== mask) continue;
        if (opts.slope && (t.slope!.highEdge + k) % 6 !== ((opts.slope.dir % 6) + 6) % 6) continue;
        res = { asset: t.asset, rotY: k * STEP, rot: k };
      }
      if (res) break;
    }
    // curvy only exists for the straight river: fall back to the normal set
    if (!res && kind === 'river' && opts.curvy) res = matchTile(kind, mask, { ...opts, curvy: false });
  }
  memo.set(key, res);
  return res;
}

/**
 * Best-effort fallback when no exact tile exists (e.g. a coast cell with two separate water runs).
 * Prefers tiles whose edges are a SUBSET of `mask` (never draws water/road toward a neighbour that has none), then the
 * largest overlap. Returns null only if nothing overlaps. `exact` tells the caller whether it got a perfect fit.
 */
export function matchTileNearest(kind: EdgeKind, mask: number, opts: MatchOpts = {}): (TileMatch & { exact: boolean; mask: number }) | null {
  mask &= 63;
  const exact = matchTile(kind, mask, opts);
  if (exact) return { ...exact, exact: true, mask };
  let best: (TileMatch & { exact: boolean; mask: number }) | null = null;
  let bestScore = -Infinity;
  for (const t of candidates(kind, { ...opts, slope: null })) {
    const m0 = kind === 'road' ? t.road : kind === 'river' ? t.river : t.water;
    for (let k = 0; k < 6; k++) {
      const m = rotateMask(m0, k);
      const overlap = bitCount(m & mask), extra = bitCount(m & ~mask);
      if (!overlap) continue;
      const score = overlap * 2 - extra * 5;
      if (score > bestScore) {
        bestScore = score;
        best = { asset: t.asset, rotY: k * STEP, rot: k, exact: false, mask: m };
      }
    }
  }
  return best;
}

function bitCount(m: number): number {
  let c = 0;
  for (; m; m &= m - 1) c++;
  return c;
}

/** River × road crossing tile (river straight through, road straight at ±60°). Null if no tile fits. */
export function matchCrossing(riverMask: number, roadMask: number, opts: { waterless?: boolean } = {}): TileMatch | null {
  for (const t of TABLE) {
    if (t.kind !== 'crossing' || !!t.waterless !== !!opts.waterless) continue;
    for (let k = 0; k < 6; k++)
      if (rotateMask(t.river, k) === (riverMask & 63) && rotateMask(t.road, k) === (roadMask & 63)) return { asset: t.asset, rotY: k * STEP, rot: k };
  }
  return null;
}

/** Grass ramp rising toward edge `dir` by 1 or 2 LEVEL_H steps. */
export function matchSlope(dir: number, steps: 1 | 2): TileMatch {
  const k = ((dir % 6) + 6) % 6;
  return { asset: T + (steps === 2 ? 'base/hex_grass_sloped_high' : 'base/hex_grass_sloped_low'), rotY: k * STEP, rot: k };
}

/**
 * Height profile of the ramp tiles (asset units, before HEX_SCALE): measured from the vertices, the ramp occupies the
 * LOW half of the tile (from the low edge to the centre) and the HIGH half is a flat plateau at `rise`.
 * `t` = signed distance along the rise direction in asset units (−1 = low edge midpoint, +1 = high edge midpoint).
 */
export function slopeHeight(t: number, rise: number): number {
  if (t >= 0) return rise;
  return rise * Math.max(0, 1 + t);
}

/** Which kind/mask a tile carries after rotation, for markers & debugging. */
export function describe(tile: string, k = 0): { road: number; river: number; water: number; sand: number; highEdge: number | null } | null {
  const t = TILE_EDGES[tile];
  if (!t) return null;
  return {
    road: rotateMask(t.road, k),
    river: rotateMask(t.river, k),
    water: rotateMask(t.water, k),
    sand: rotateMask(t.sand, k),
    highEdge: t.slope ? (t.slope.highEdge + k) % 6 : null,
  };
}

// =====================================================================================================================
// Composition helpers (round 2): every river / coast situation a generator can produce resolves to something drawable.
// Placements are in ASSET UNITS relative to the cell centre at the tile top (multiply x/y/z by HEX_SCALE, add the cell's
// world position; rotY is world rotation). Use `placementMatrix()` to get a THREE.Matrix4.
// =====================================================================================================================
export interface Placement {
  asset: string;
  rotY: number;
  x: number;
  y: number;
  z: number;
  /** uniform scale on top of the pack scale */
  s?: number;
}

/** World matrix for a placement on a cell whose tile top is at (cx, cy, cz) metres. */
export function placementMatrix(p: Placement, cx: number, cy: number, cz: number): THREE.Matrix4 {
  return new THREE.Matrix4().compose(
    new THREE.Vector3(cx + p.x * HEX_SCALE, cy + p.y * HEX_SCALE, cz + p.z * HEX_SCALE),
    new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), p.rotY),
    new THREE.Vector3(p.s ?? 1, p.s ?? 1, p.s ?? 1),
  );
}

/** Rotate a local (asset-unit) offset by k·60° the same way three.js rotation.y does. */
function rot(x: number, z: number, k: number): [number, number] {
  const a = k * STEP, c = Math.cos(a), s = Math.sin(a);
  return [x * c + z * s, -x * s + z * c];
}

/**
 * UNUSED (see composeRiver). Id of a river tile whose water slopes down to lake level (−0.2 units) at the WORLD edges `mouthMask`
 * (the library synthesizes it on preload; see library.ts `synthVariant`). Use for river cells that flow into a
 * hex_water / lake cell, so river and lake meet without a 0.75 m step.
 */
export function riverMouthId(m: TileMatch, mouthMask: number): string {
  const local = rotateMask(mouthMask & 63, -m.rot);
  return local ? `${m.asset}@mouth${local}` : m.asset;
}

/** UNUSED since ARCHITECTURE §4 (rivers are endless): assets of the old spring composition. */
export const RIVER_DECOR_IDS: readonly string[] = [
  'hex/decoration/nature/hill_single_C',
  'hex/decoration/nature/tree_single_A',
  'hex/decoration/nature/rock_single_C',
  'hex/decoration/nature/rock_single_E',
  'hex/decoration/nature/waterplant_A',
  'hex/decoration/nature/waterplant_B',
  'hex/decoration/nature/waterlily_A',
  'hex/decoration/nature/waterlily_B',
];

/**
 * UNUSED since ARCHITECTURE §4 (rivers are endless lines; no springs, no mouths) — kept only for reference; the
 * game and the showcases use matchTile('river', mask) / matchCrossing() directly. Do not use for new code.
 * Everything to draw on a river cell.
 *  - ≥ 2 river edges → the matching river tile (mouth variant toward `mouthMask` edges, which must be ⊆ riverMask).
 *  - exactly 1 edge (a river SOURCE) → a spring: straight river tile whose closed end runs under a small rocky hill
 *    (hill_single_C), with rocks and water plants at the outflow. Reads as "the river rises from the hill".
 *  - 0 → null.
 * Never returns a bare hex_water pond for a dead end.
 */
export function composeRiver(riverMask: number, opts: { mouthMask?: number; waterless?: boolean } = {}): Placement[] | null {
  riverMask &= 63;
  if (!riverMask) return null;
  const mouth = (opts.mouthMask ?? 0) & riverMask;
  let n = 0;
  for (let m = riverMask; m; m &= m - 1) n++;
  if (n >= 2) {
    const m = matchTile('river', riverMask, { waterless: opts.waterless });
    if (!m) return null;
    return [{ asset: mouth ? riverMouthId(m, mouth) : m.asset, rotY: m.rotY, x: 0, y: 0, z: 0 }];
  }
  // spring: open edge d, closed toward d+3
  const d = [0, 1, 2, 3, 4, 5].find((e) => riverMask & (1 << e))!;
  const k = d; // local layout below is for d = 0 (open toward +X)
  const tile = matchTile('river', (1 << d) | (1 << ((d + 3) % 6)), { waterless: opts.waterless })!;
  const local: [string, number, number, number, number, number?][] = [
    // asset, x, y, z, extra rotY (deg), scale
    ['hex/decoration/nature/hill_single_C', -0.42, -0.02, 0, 0, 1],
    ['hex/decoration/nature/tree_single_A', -0.5, 0.56, 0.1, 15, 0.8],
    ['hex/decoration/nature/rock_single_E', 0.13, -0.11, -0.3, 30, 0.9],
    ['hex/decoration/nature/rock_single_C', 0.11, -0.11, 0.33, -20, 0.8],
    ['hex/decoration/nature/waterplant_B', 0.25, -0.11, 0.28, 0],
    ['hex/decoration/nature/waterplant_A', 0.21, -0.11, -0.13, 40],
    ['hex/decoration/nature/waterlily_A', 0.58, -0.1, 0.12, 0],
    ['hex/decoration/nature/waterlily_B', 0.42, -0.1, -0.15, 70],
  ];
  // closed edge d+3 in tile-local terms → the synthesized @spring variant fills that half of the channel
  const closedLocal = (((d + 3 - tile.rot) % 6) + 6) % 6;
  const out: Placement[] = [{ asset: `${tile.asset}@spring${closedLocal}`, rotY: tile.rotY, x: 0, y: 0, z: 0 }];
  for (const [asset, x, y, z, r, s] of local) {
    const [wx, wz] = rot(x, z, k);
    out.push({ asset, rotY: k * STEP + (r * Math.PI) / 180, x: wx, y, z: wz, s });
  }
  return out;
}

/**
 * River network rule (prevents the grass "nubs" where three river tiles meet at one hex corner, and enclosed pits):
 * a new river link a→b (b = neighbour of a in direction d) is forbidden when a and b already share a river neighbour c
 * linked to both (that would close a triangle). Natural rivers are trees, so this never restricts a sensible network.
 * `linked(q1,r1,q2,r2)` tells whether two adjacent cells are already joined by river.
 */
export function closesRiverTriangle(q: number, r: number, d: number, linked: (q1: number, r1: number, q2: number, r2: number) => boolean): boolean {
  const D = [[1, 0], [1, -1], [0, -1], [-1, 0], [-1, 1], [0, 1]];
  const bq = q + D[d][0], br = r + D[d][1];
  // the two cells adjacent to both a and b sit in directions d-1 and d+1 from a
  for (const e of [(d + 5) % 6, (d + 1) % 6]) {
    const cq = q + D[e][0], cr = r + D[e][1];
    if (linked(q, r, cq, cr) && linked(bq, br, cq, cr)) return true;
  }
  return false;
}

export type CoastAdvice = { tile: TileMatch } | { action: 'water' } | { action: 'none' };

/**
 * What to do with a LAND cell whose water neighbours are `waterMask`:
 *  - 0 → { action: 'none' } (plain land)
 *  - a contiguous run of 1–4 water edges → { tile } (coast A–D at the right rotation)
 *  - 5 or 6 water edges (peninsula tip / islet) or split runs (e.g. 03, 13, 024) → { action: 'water' }: the pack has
 *    no tile; turn this cell into water. `settleWater()` does that iteratively for a whole region.
 */
export function coastAdvice(waterMask: number, opts: { waterless?: boolean } = {}): CoastAdvice {
  waterMask &= 63;
  if (!waterMask) return { action: 'none' };
  const m = matchTile('coast', waterMask, opts);
  return m ? { tile: m } : { action: 'water' };
}

/**
 * Grow water until every land cell in `cells` has a coast tile (or no water neighbour). Returns the set of keys
 * "q,r" that must become water (in addition to `isWater`). Water only grows, so it always terminates; typical fields
 * need 0–3 flips per lake. Cells outside `cells` are treated as fixed (their water state is read via isWater).
 */
export function settleWater(cells: Iterable<{ q: number; r: number }>, isWater: (q: number, r: number) => boolean, maxIter = 32): Set<string> {
  const D = [[1, 0], [1, -1], [0, -1], [-1, 0], [-1, 1], [0, 1]];
  const list = [...cells];
  const flip = new Set<string>();
  const wet = (q: number, r: number) => flip.has(q + ',' + r) || isWater(q, r);
  for (let it = 0; it < maxIter; it++) {
    let changed = false;
    for (const { q, r } of list) {
      if (wet(q, r)) continue;
      let mask = 0;
      for (let d = 0; d < 6; d++) if (wet(q + D[d][0], r + D[d][1])) mask |= 1 << d;
      const adv = coastAdvice(mask);
      if ('action' in adv && adv.action === 'water') {
        flip.add(q + ',' + r);
        changed = true;
      }
    }
    if (!changed) break;
  }
  return flip;
}
