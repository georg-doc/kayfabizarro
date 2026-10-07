# assets module — NOTES

## Files
| File | What |
|---|---|
| `library.ts` | `AssetLibrary` (core instantiates it). Public API unchanged: `init, preload, get, loadGltf, url, scaleOf, allMaterials, ids, has` + new `materialStats()`, `materialHook`, exported `applyPolicy`, `ROUGHNESS`. |
| `tile-edges.ts` | **Tile edge atlas** for road / river / coast / ramp / crossing tiles + matchers. Import from `../assets/tile-edges`. |
| `tools/derive-edges.mjs` | Node script that derives the edge masks from glTF geometry + atlas texels (`node src/modules/assets/tools/derive-edges.mjs [--dump]`), writes `tools/edges.derived.json`. |
| `showcase-edges.ts` | `/?showcase=assets&view=edges` — visual proof of the atlas. |
| `showcase-scale.ts` | `/?showcase=assets` — scale QA (Knight in Idle_A vs door, props, trees, rulers, height labels). |
| `showcase-gallery.ts` | `/?showcase=assets&view=gallery` — every family on clean ground + material report. |

## Tile edge atlas (`tile-edges.ts`)
Edge order is OURS (ARCHITECTURE §1): `0 E(+X), 1 NE, 2 NW, 3 W, 4 SW, 5 SE`, edge d at angle d·60° from +X toward −Z.
rotation.y = k·π/3 moves the rot-0 mask by `rotateMask(mask, k)` (bit d → d+k). Proven end-to-end in the edges showcase.

Derivation: for each tile, 7 probes 0.93 units out toward every edge midpoint → top-most triangle → interpolated UV →
atlas texel → class (grass 192,197,55 · water 37,131,193 · road/sand 223,183,135 · hole = waterless cut-out). An edge is
"connected" when the middle three probes agree. LESSONS.md strings (old clockwise order) agree after re-mapping for
roads; the coast strings in LESSONS do NOT match the geometry (they describe something else) — ignore them.

### rot-0 masks (edge digits)
| Tile | road | river | water (sea) | sand flank | notes |
|---|---|---|---|---|---|
| road_M | 3 | | | | dead end |
| road_A | 0 3 | | | | straight |
| road_B | 1 3 | | | | wide bend |
| road_C | 2 3 | | | | sharp bend |
| road_D | 1 3 5 | | | | Y |
| road_E | 0 1 3 | | | | |
| road_F | 0 3 5 | | | | mirror of E |
| road_G | 2 3 4 | | | | |
| road_H | 0 2 3 4 | | | | |
| road_I | 1 2 4 5 | | | | |
| road_J | 0 3 4 5 | | | | |
| road_K | 1 2 3 4 5 | | | | |
| road_L | 0–5 | | | | |
| road_A_sloped_low / _high | 0 3 | | | | high edge **0**, rise 0.5 / 1.0 units (1 / 2 LEVEL_H) |
| river_A, A_curvy … L (+ `_waterless`) | | same sets as road_A…L (no M) | | | water surface y = −0.1 units |
| river_crossing_A | 2 5 | 0 3 | | | |
| river_crossing_B | 1 4 | 0 3 | | | |
| coast_A | | | 5 | 0 4 | water y = −0.2 units |
| coast_B | | | 4 5 | 0 3 | |
| coast_C | | | 4 5 0 | 1 3 | |
| coast_D | | | 4 5 0 1 | 2 3 | |
| coast_E | | | — | corner between 4 and 5 | sand corner only, no water edge |
| grass_sloped_low / _high | | | | | high edge **0** |

Coverage: roads 63/63 masks, rivers 57/63 (no single-edge river), coast 24/63 (contiguous runs of 1–4 water edges only),
crossings 12/12 (6 rotations × 2), ramps 24/24.

**Ramp profile (measured from vertices):** the ramp occupies the LOW half of the tile (low edge → centre), the HIGH half
is a flat plateau at full rise. Use `slopeHeight(t, rise)` (t = −1 low edge … +1 high edge, asset units) for `heightAt`.

### API
```ts
TILE_EDGES[id]                       // { road, river, water, sand, slope?, waterY?, waterless?, sandCorner? }
EDGE_TILE_IDS                        // all ids the atlas knows (preload what you use)
edgeMask(id, kind?) / rotatedMask(id, k, kind?) / describe(id, k)
matchTile('road'|'river'|'coast', mask, { waterless?, curvy?, slope?: {dir, steps} }) → { asset, rotY, rot } | null
matchTileNearest(kind, mask, opts)   // fallback: subset-preferring best fit, { exact:false, mask } when not exact
matchCrossing(riverMask, roadMask, { waterless? })
matchSlope(dir, steps)               // grass ramp rising toward dir
slopeHeight(t, rise)
```

## Evidence (my own shots, `tools/out/assets/`)
- `edges_r1__assets.edges_roads.png`, `…_rivers.png`, `…_coast.png`: every mask 1..63, pillars on the requested edges sit on road ends / river mouths / sea edges in all cases.
- `edges_r1__assets.edges_netroad.png`, `…_netriver.png`, `…_netlake.png`: random networks + lake, continuous across every tile border; lake rim fully resolved with coast A–D.
- `edges_r4__assets.edges_stairs_a.png`, `…_b.png`: ramp + upper flat + lower flat for dir 0..5 — ramps meet the upper tile, no cliffs.
- `edges_r1__assets.edges_special.png`: crossings A/B in all rotations (red = road, magenta = river).
- `edges_final__assets.edges_roads.png / _rivers / _coast / _netriver.png`: final run after the library changes (fog off).

## Material policy (`library.ts`)
- Shared atlas texture per file name via a GLTFLoader plugin (`kfb_shared_atlas`): the first glTF loads
  `hexagons_medieval.png` / `forest_texture.png`, every other glTF awaits that one promise → one decode per atlas, no
  parallel-load race (the LESSONS "black models" bug). `preload()` additionally warms one asset per pack before the batch.
- Canonical material per (pack, material name, atlas file). Measured after loading ALL 305 hex + forest assets
  (`/?showcase=assets&view=gallery`, `window.__kfbMaterials`, 695 ms): **hex 1, forest 2** — the 2nd forest material
  is three's default white material of `Grass_*_Mesh` (no material in the file; don't use them, CORE_REQUESTS #3).
- Base properties: metalness 0, roughness hex 0.85 / forest 0.9 / characters 0.8 (`ROUGHNESS`), sRGB map, trilinear
  mipmaps, anisotropy 8. Also applied to `loadGltf()` results (characters keep their own material instances).
  `materialHook` still runs once per canonical material for environment overrides. No dark/black models in any shot.

## Scale QA (`/?showcase=assets`, presets `assets.lineup`, `lineup_proposed`, `door`, `trees`, `houses`, `scale_overview`)
Knight 1.89 m (skinned Idle_A). home_A door: 2.15 m clear (2.36 m frame) × 1.16 m (vertex data) → door/Knight 1.14
clear / 1.25 frame: fine. Houses: home_A 6.98, home_B 9.60, tavern 10.47 m. Trees: hex tree_single_A 8.2, trees_A_large
6.85; forest Tree_1_A 7.8, Tree_2_A 8.6, Tree_3_A 6.5, Tree_4_A 9.9, bushes 0.45–1.06, Rock_3_A 0.79 m — forest pack and
hex pack trees agree at FOREST_SCALE 2 / HEX_SCALE 7.5. **Hex props are too big** (barrel 1.59 m = Knight chest) →
CORE_REQUESTS #1 (`HEX_PROP_SCALE = 4.5`), already wired in `packScale()`.

## Gallery (`/?showcase=assets&view=gallery`)
Presets `assets.gallery_tiles | _buildings | _buildings_close | _nature | _props | _forest | _chars | _overview`.
All 60 tiles, 18 blue + 18 other-colour + 21 neutral buildings, 42 hex nature, 26 hex props, 84 forest assets,
6 characters (Idle_A). Fog is switched off in `view=edges|gallery` only (`&fog=1` keeps it).

## Robustness
`get(unknown)` → null; `preload(['unknown'])` → one warning per id, no throw; `loadGltf(bad url)` → null, one warning
per url (cached). `init()` survives a missing manifest. Verified with `tools/probe.mjs` (0 errors).

## Assumptions / known issues
- Showcases are seed-independent (pure asset staging), so the 3-seed rule does not apply to them.
- coast_E (sand corner) is not returned by `matchTile` (no water edge). The lake test never needed it; terrain may use it
  for concave shore vertices if it wants to.
- Non-contiguous coast masks have no tile: terrain should avoid them (or use `matchTileNearest`, or turn the cell into water).
- River dead ends have no tile (rivers must end in water / hex_water).
- River water surface −0.1 units vs lake −0.2 units: a 0.75 m step where a river mouth meets hex_water.
- Scene fog / lights / tone mapping belong to environment; in the default scale view the environment fog is active.

## Round 2 (critic: Scale 8.5, Image 8.5, Atlas 8.0)
1. **River dead ends** → `composeRiver(mask, {mouthMask})` in tile-edges.ts returns placements for every non-empty
   mask. One edge = **spring**: a straight river tile whose closed end runs under `hill_single_C` (×1.1) with a pine
   on top, rocks and water plants at the outflow. Mouth edges get a synthesized `<tile>@mouth<localMask>` variant
   (library `synthVariant`): the river's water slopes from −0.1 to lake level −0.2 units, so there is no step against
   hex_water. `riverMouthId()` builds the id; preload `RIVER_DECOR_IDS`. Shown in `edges_spring`, `edges_endings`,
   `edges_mouth` vs `edges_mouth_plain`, the river mask table (6 springs) and the river system.
2. **Coast `none`** → `coastAdvice(mask)` returns `{tile}` / `{action:'water'}` / `{action:'none'}`, and
   `settleWater(cells, isWater)` grows water until every shore cell has a tile. In-page stress test of 300 random
   lake fields per seed: seed 1337 raw 352 → **0**, seed 7 raw 482 → 0, seed 42 raw 477 → 0 (`edges_coastraw` vs
   `edges_netlake`). The coast table shows hex_water for the 39 masks without a tile.
3. **Grass nubs at triple river corners** come from river triangles (3 cells pairwise linked). Rule + helper
   `closesRiverTriangle(q, r, d, linked)`. The demo river system grows tree-shaped rivers outward from lake mouths
   (no triangles, rivers never touch each other) → no nubs, no enclosed pits.
4. **Smudges**: KayKit road/river/ramp tiles carry smoothed normals (up to 23° off) on flat top triangles. Library now
   sets face normals on every near-horizontal triangle of `hex/tiles/*` at load (non-indexed); in-page check: 0 corners
   > 3° off on tile tops (was 30+ triangles per road tile). Silhouettes unchanged.
5. Proposed row removed (HEX_PROP_SCALE adopted). **Note for props module:** weaponrack reads low at 4.5 (1.08 m);
   place it on a crate/porch or accept it as a low rack — not rescaled per asset here.
6. Edges showcase networks depend on `&seed=` (road graph, river system, coast fields).
7. `assets.trees` reframed (lower, closer, larger labels); ramps moved to their own area: `edges_ramps` overview and
   `edges_ramp0..5` side views perpendicular to each rise direction (grass ramp ×2 front, road ramp behind).

## Round 3 (critic: Scale 8.5, Image 8.5, Atlas 7.5)
1+2. **Estuary mouths.** `@mouth` variants are rebuilt on a 2× midpoint-subdivided copy of the river tile:
   banks follow exactly the coast-tile flank profile (y = −0.2·d toward the mouth edge, d = signed distance in asset
   units), so bank tips meet the neighbouring coast beaches and the lake at the same height; near-horizontal bank faces
   below −0.035 are re-UV'd to the beach sand texel; the water drops to lake level and its UV is slid along the river
   strip to the lake texel (same atlas column, no foreign colours in between). Flat normals. `edges_mouth` (estuary)
   vs `edges_mouth_plain` (raw KayKit tile) now differ clearly.
3. see 1.
4. Coast: `coastAdvice` always answers (tile / water / none); raw view label explains that the grey cells are what
   coastAdvice turns into water. 39/63 masks have no KayKit coast tile — documented, settleWater resolves all.
5. Spring: new `@spring<closedEdge>` variant fills the closed half of the channel to grass level, so the hill sits
   inside the tile (no rim groove at its foot, no cut channel end); the clipping bush is gone; decor moved in front.
6. Ramps: the demo now places the ramp's side neighbours like a terrain must (rule): **d±1 at the HIGH level, d±2 at
   the LOW level**. That closes the corner slivers. The small road kink at the plateau is in the KayKit tile itself.
7. Lake seams: hex_water grows 1 % in x/z at load so neighbours overlap (flat colour → no z-fight visible). The faint
   lines across roads are the KayKit tile-rim bevel (the road dips to −0.05 at every tile edge); left as authored.
8. `edges_roads_real` / `_low`: 3 roads corner-to-corner, ≤ 60° turn per cell, triangle-free, crossing near the
   centre — representative output (the dense random graph stays as the stress test).
9. Tent now uses HEX_PROP_SCALE (3.87 → 2.32 m, a market stall/canopy); only flags stay at HEX_SCALE.

## Round 4 (architecture change: rivers are ENDLESS lines, ARCHITECTURE §4)
- Springs and mouths are **UNUSED**: `composeRiver`, `riverMouthId`, `RIVER_DECOR_IDS` and the library's
  `@mouth` / `@spring` variants stay in the code (harmless: only synthesized when such an id is requested) but nothing
  in the game or the showcases uses them. Use `matchTile('river', mask)` and `matchCrossing()` only.
- Edges showcase: the spring/mouth close-ups, the waterless table (cut-outs show holes by design) and the old
  lake-mouth river demo are removed. The river mask table marks the 6 single-edge masks "n/a: rivers are endless".
- New river demo (`edges_netriver`, `_low`, `_close`): a confluence (river_D, arms 120° apart) with three long
  meandering arms generated 14 cells out, shown on a radius-9 patch (no line ends inside it), plus a road crossing
  one arm on a `river_crossing` tile (bridge site). Seed-dependent.
- New road demo (`edges_roads_real`, `_low`): a Y junction (arms 120° apart, so no adjacent arm cells) with three long
  winding arms. Shared line walker: ≤ 60° turn per cell, ≤ 60° off its heading, never enters or touches another
  line (or its own earlier cells) → no parallel roads, no fork loops, no tiny grass islands. The dense random graph
  (`edges_netroad`) stays as the explicit stress test.
- Gallery: waterless tiles and the tent are no longer shown. **Props module: don't use `tent`** — at any scale it reads
  as a table/canopy.
- `trees_A_small` (8.16 m tall, 10.8 m wide) vs `trees_A_large` (6.85 m tall, 14.7 m wide): that's the asset — the
  suffix names the clump footprint / number of trees, not tree height. Labels now show both height and clump width.
