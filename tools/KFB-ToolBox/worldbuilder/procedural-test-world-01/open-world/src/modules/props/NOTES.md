# props — NOTES (round 4 + game critic r2)

## Occluder fade (core/fade.ts)
- Every prop renders with `occluderFadeMaterial(atlas)`; props are merged per chunk by the props module itself
  (`mergeFading` in index.ts) with a per-vertex `aFadeAnchor` = sphere of the prop's whole STACK (a crate on a crate,
  a flag in its barrel fade as one; centre at mid-height, radius = half diagonal). Colliders unchanged.
- Cost: one extra mesh per chunk that holds props (core merge cannot carry attributes) → CORE_REQUESTS.md #1.
- Evidence: `tools/out/props/fade/occl_s97_{lumber,smith,tavern,door}.jpg` (probe `occl.mjs`: player spawned in front
  of a group, follow camera behind it), `cliff2__{front,orbit90,orbit180}.jpg` (camera builder's cliffcam2 probe).

## Game critic r3: pockets (#6) and road structure (#7)
- **Pockets**: `pocketCount()` — configuration-space test on a 0.2 m grid (obstacles: building footprints, solid props,
  terrain rising > 0.45 m; chamfer clearance; open space flood-filled through clearance ≥ (capsule Ø + 0.5)/2 = 0.55 m;
  a pocket = capsule-sized free space (clearance ≥ 0.32 m) the open space does not reach, within 1.6 m of the group).
  Every group with solid props is rejected if it creates a pocket (`pocket` in rejected stats); validator field
  `pocket`. Wheelbarrows no longer have colliders. Radius 40, validator: seed 97 40 → 0, 123 27 → 0, 42 20 → 0.
- **Rest spots** (`planRest`): one candidate per 9×9 axial grid cell (the highest-hash 2-edge road cell ≥ 3 cells
  from any settlement cell, 80 % kept): a low wooden fence piece (fence_wood_straight, length ×0.45, height ×0.22 →
  3.9 × 0.9 m) on the outer verge, with a small group flush in front (bench-like long crate + barrel, goods crate +
  sacks, barrels, cart, woodpile); ≥ 1.5 m inside the hex (nature's roadside trees stand on the neighbouring cells),
  pocket-free. `__props.rests()`, `__props.roadPockets()`, preset `props.rest`.

## Game critic r2: road-side life (#4) and the empty fence (#8)
- **Signposts at forks outside settlements** (`planCrossing`): every road cell with ≥ 3 road edges and no village /
  hamlet cell around (rural sites allowed) gets a pole planted in a stone cairn on the grass verge of the widest gap
  between two roads (≥ ROAD_CLEAR + 0.2 from every strip, ≥ 0.6 m inside the hex, flat, off buildings), with one
  pennant per road (≤ 3, stepped 0.42 m) pointing along it in the colour of the village that road leads to
  (`destColour` walks the road ≤ 24 cells; seeded colour otherwise); 55 % a cart / crate + sack beside it.
  No signpost/haystack/bench assets exist in the allowed packs → the signpost is composed from cairn + flags.
  Cached per fork cell (LRU 1024), included in `prefetchStep`. `__props.signs()`, preset `props.signpost`.
- **Farmsteads / rural sites** (villages `ruralNear`, kind 'rural'): already planned like villages (door groups,
  field-gate groups, lumber groups at lumber camps); now also a road-side stand (barrels, crates, cart, sacks) on
  the verge of the site's road cell toward the farm in ~70 % of sites. Preset `props.farm`.
- **Pastures**: a paddock group (trough, water, feed sacks) inside every `crop:pasture` cell — villages has since
  dropped pastures (fences only around crops now), so this is dormant; the seed-42 zig-zag fence is gone (villages).
- Lone trees: left to nature (none added). `?proproad=0` disables all of the above (before/after A/B).
- Evidence: `tools/out/props/road/{before,after}_s{50,42,123}__orbit_*.jpg`, `game_s42__aerial.jpg`.


## Round 4 changes (critic r3: Authored 7.5, Scale 8.5, Ground 7.5, Image 8.0)
- **Hex seams**: no prop corner within 0.4 m of a hex edge, and a prop's whole box must lie on one tile (`seam`).
- **Plinths**: wall slots scan onto their OWN building only (outside-in, 0.15 m clearance, coarse 0.3 m / fine 0.05 m);
  every prop (stacked ones too) is then tested against all buildings within 2 cells with a 0.1 m margin.
- **Door groups**: only beside the door / stairs (front slots, ≥ 0.5 m off the door corridor), 2–4 pieces
  (min 2), 14 door templates; each village dresses its doors from its own seeded subset of 6 ("village style") →
  seeds differ. Measured 70–81 % of houses.
- **Well**: buckets vary (5 templates incl. none-sack/three-bucket) + 1–2 groups on the plaza RIM (outer 1.8 m of the
  plaza hex, edges not toward a road): water barrels, a trough (crate_long_empty), crates, sacks.
- **Field gates**: harvest gear (sacks, pallet, wheelbarrow, barrels) on the street side next to each field gate,
  the opening free. Smith: 5 + 3 richer templates (stone heaps, crates, barrels, charcoal sacks).
- **Presets**: the camera search also rejects views whose line passes through a prop (flag poles).
- **Perf**: `planVillageSteps` is a resumable generator (yields after every slot attempt; max single step 0.9–1.6 ms
  measured); `services.props.prefetchStep(cx, cz, budgetMs = 8): boolean` advances at most ONE village plan of the
  chunk by ≤ budget and returns true when the chunk's plans are all cached; `prefetch()` drains everything; buildChunk
  finishes a started plan from where it stopped. `__props.selfTest(R)`: stepped vs one-shot plans identical (6/6, 5/5,
  6/6 on seeds 1337/42/7).
- Measured (radius 40, validator 0 violations each): seed 1337 250 props, houses with a group 31/44, 4 flag groups;
  seed 42 326, 42/52, 6; seed 7 431, 71/90, 10. 0 console errors, showcase 128–147 draw calls, 60–61 fps.


## Round 3 changes (critic r2: Authored 7.0, Scale 8.0, Ground 8.0, Image 8.0)
- **Villages round 4** (houses slide onto the street cell's grass, two-row frontage, paved plaza, closed walls with
  gates): props may now stand on the village's cells AND on the grass verge of its street cells (those touching a
  village cell), ≥ 2.6 m (ROAD_CLEAR) from every road-strip centreline (centre → road-edge midpoints, the villages'
  model) → the sand stays free; ≥ 1.0 m from walls / gates (`fence:` / `gate:` tags), level changes, water, rivers;
  never on bridges / ramps; no solid prop on the plaza hex; 3.5 m around the spawn point. Props are owned by the cell
  they stand on (stacks follow their base); buildChunk also asks the village plans of a street cell's neighbours.
- **Variety**: 7 medium + 8 small house groups, 4 tavern-front + 4 tavern-side, 7 market, 4 + 3 smith, 3 lumber +
  3 lumber-cart, 4 mill, 5 field, 3 well templates, each with probabilistic items and seeded per-instance jitter
  (position ±0.14 m along the wall, front-row offsets, yaw ±17° for boxes, stacks ±0.5 rad).
- **Coverage**: 75–87 % of houses (seeded per village) get a group beside door / stairs (measured 80–84 %); markets
  2–3 groups (stall goods), work buildings 2.
- **Traps**: a solid prop stands flush (≤ 0.2 m) against a wall or ≥ 1.2 m off it; two solid props touch (≤ 0.25 m) or
  leave ≥ 0.8 m (`trapProblem`, validator `trap`).
- **Bounds**: building test with 0.15 m sampling over the rotated prop box (coarse 0.3 m pass + fine refinement),
  10 cm wall clearance; pairwise ≥ 5 cm with rotated real bounds.
- **Entry flags** on the grass verge of the last street cell where the road leaves the village, at the road edge,
  planted in a barrel, with a seeded companion (hand cart / crate stack / barrels / sacks / a second flag across the
  road = gate); none fits → no flag.
- Dropped: weapon rack (read as a broken frame), crate_open at the lumbermill (lumber only), buckets at the smith;
  all buckets ×0.7. `site` preset removed (villages dropped construction sites).
- **Perf**: plans are pure and cached (LRU 128 villages); `services.props.prefetch(cx, cz)` computes the plans a chunk
  needs (returns ms) so streaming can do it in idle time; buildChunk is then merge-only, identical output. One village
  plan costs 18–63 ms in the headless runs (machine shared with other agents).
- Measured (radius 40, validator 0 violations: float/slope/spot/building/door/overlap/trap/stack/spawn): seed 1337
  196 props, 3 villages 45–50, houses 37/44; seed 42 244, 40–69, 43/52; seed 7 347, 38–76, 72/90. 0 console errors,
  showcase 128–147 draw calls, 61 fps; game `/` 157 draw calls, 61 fps.


## Round 2 changes (critic r1: Authored 7.5, Scale 8.5, Ground 8.5, Image 7.5)
1. Smithy: door corridor recalibrated from rig top views (workshop door is on the LEFT; the whole front incl. anvil /
   forge mouth stays free: DOOR_X blacksmith [-0.66, 0.70]); smith groups only on side walls. Door corridors padded
   0.5 m sideways, endless to the front. Lumbermill / tavern corridors recalibrated to their stairs.
2. Wall slots now come in **from outside** until the group first touches the building (coarse 0.3 m, refined 6 cm),
   10 cm wall clearance → never in an interior gap (between a house and its forge, under an open roof, in a plinth).
   A group that never touches a wall is rejected. Stacked props are tested against footprints too.
3. Templates auto-space with real prop bounds: back-row props slide along the wall, front-row props away from it,
   until every pair is ≥ 5 cm apart; the validator now also checks pairs inside a group (0 overlaps on 3 seeds).
4. (lumber stairs) corridors cover the stairs; the logs lying at the lumbermill's stair foot are part of the KayKit
   building model itself (visible in `?showcase=props&view=rig`), not props.
5. 60–72 % of houses (seeded per village) get a group beside the door/stairs: 55 % small (1–3 props, `doorSmall`,
   6 variants), else the medium `door` templates (5 variants).
6. Smith: 3 + 3 variants, market: 4 + 2 variants, all seeded per building.
7. Flags: no lone flags. Village entries only: flag in a barrel at the yard corner by the road out, with a hand cart
   or a crate stack lined up along the road edge; no companion fits → no flag. No centre flag (plaza stays free).
8. `props.rig_*` presets exist only with `&view=rig`.
9. Buckets ×0.7 (bucket of arrows ×0.75) on top of HEX_PROP_SCALE (`PROP_K` in plan.ts, documented exception like
   HEX_PROP_SCALE itself) → ≈ 0.4 m. Buckets are not solid; a stall at the well would come from the villages' well
   collider, not from props.
- Measured r2 (radius 40, validator 0 violations each): seed 1337 428 props, 8 villages 30–63, house groups 70/113,
  7 flags; seed 42 446, 32–60, 77/116, 6 flags; seed 7 609, 37–66, 103/172, 10 flags. Showcase 122–147 draw calls,
  61 fps, 0 errors; planning ≤ 22–36 ms per village under heavy machine load (once per village). Evidence
  `tools/out/props/r2_s{1337,42,7}__props.*.jpg`.
- Villages round 3: building poses read from `villageItemsAt`; the whole plaza hex is kept free of solid props.


## What it builds
Stage-6 props as small hand-composed **vignettes**, each with a reason. No scatter anywhere: every prop belongs to a
door, the well, a work building's yard, a field edge or a village flag (entry / centre). Nothing is written to the
world model (ARCHITECTURE §4 stage 6); placement is planned per village and emitted per chunk by owner cell.

Files: `plan.ts` (planner, templates, checks, validator), `footprint.ts` (building ground footprints), `index.ts`
(module, rendering, colliders, presets, debug API), `rig.ts` (door-corridor calibration rig, showcase only).

### Placement model (plan.ts)
- **Building poses** come from the villages API `villageItemsAt(seed, q, r)` (exact world pose of every building on a
  cell, 1–2 per cell); fallbacks: the villages planner's `items`, then the round-1 `CellData.building` + street shift.
  Villages imports are namespace imports so a renamed export never breaks this module's import.
- **Footprint** per building model (footprint.ts): every triangle below 2.0 m rasterised on a 0.15 m grid, outside
  flood-filled → solid ground footprint incl. stairs, plinths and the models' built-in clutter (market stalls,
  lumbermill logs, windmill sacks). Eaves above 2 m do not block (a crate may stand under an eave). Fitted once per
  model at init (≈ 40–100 ms).
- **Templates**: props laid out in a wall frame (`a` along the wall, `o` away from it), optional stacking (`on`) and
  probabilistic items. A template is applied at a **slot** (front beside the door, side wall from the front corner,
  side wall from the back corner, back wall, toward a field, radial around the well, free slots at a field edge).
  The group is pushed out of the building along the slot normal to its first position clear of the footprint
  (+5 cm) → props stand against the wall. Wall slots must then satisfy everything at that position or the slot is
  rejected (never nudged elsewhere); field-edge slots keep moving inward until valid. Fallback: a smaller template
  (drops the last free-standing item), then the next slot.
- **Checks per prop**: inside its own hex (inset 0.5 m, 0.4 m to a street edge, 1.2 m to stone walls, 1.0 m to level
  changes / rivers / water); not inside any building footprint of the cell or its neighbours; not in any **door
  corridor** (door + stairs x-range of every nearby building, everything in front of its middle; `DOOR_X`, calibrated
  in `?showcase=props&view=rig`); no overlap with other vignettes; flat ground (corner spread ≤ 8 cm), y = heightAt;
  **no solid prop on the plaza** (the villages' sandy stadium plaza cell → crossing, radius `PLAZA_R`), nothing within
  3.5 m of the village `spawn` point. Never on road cells (props stay in their own non-road village cell).

### Vignette rules
| vignette | where | props |
|---|---|---|
| door | 1 of every 2–3 houses (home_A/B; ratio 0.36–0.50 per village, seeded), beside the door against the front wall, else at the front corner on the side wall | 2–4 of barrels, crate stacks (small on big), sacks, bucket (5 templates) |
| well | radial around the well (sides first) | bucket of water + empty bucket; 60 %: a second group (barrel + small crate, or a bucket) — solids are kept off the plaza, so usually buckets only |
| tavern | front beside the door (away from the stairs) + side wall | row of standing barrels (+crate); pyramid of lying barrels + a standing one, or a row of 3 |
| market | in front of the outer stalls (middle stall = way in) ×2 + side/back | crate_long with sacks on top, crate stacks, crate_long rows, barrel; crate_open + sacks |
| smith | side walls / front | weapon rack + crate + bucket of arrows; resource_stone heap + small crate |
| lumber | side wall; front / other side | resource_lumber stack (sometimes 2 high, a second row); wheelbarrow + crate_open |
| mill (windmill) | beside its door; at the edge of its field | 3 sacks (one on top) + small crate; field vignette below |
| field | each field cluster once: on the windmill cell, else on a neighbouring yard **at the same level**, at the shared edge (≤ 3.6 m from it) | pallet with 2–3 sacks + wheelbarrow, or wheelbarrow + bucket + sack |
| site | 65 % of construction sites (stage_B/C) | wheelbarrow + pallet |
| flag (crossing) | villages only (not hamlets): 1–2 village entries (a yard next to a street cell whose road leaves the village, at the corner toward the road out); centre candidates on the plaza cell rim (mostly rejected now that the plaza must stay free) | flag in the village colour planted in a barrel (the KayKit flag is 2.1 m at pack scale; in the barrel the banner flies at ≈ 1.6–2.7 m), 35–40 % a crate at its foot; ≥ 0.6 m off walls, ≥ 1.8 m clear of doorways |

### Rendering / colliders
- `out.add(assetId, matrix)` per prop → merged into the chunk's hex-atlas mesh (+0 draw calls). Lying barrels:
  rotated 90° about X, resting on their rim. Stacked props sit exactly on the top of their base.
- Colliders (WORLD_GROUPS) only for props a player bumps: barrels (cylinder), crates, crate_long, crate_open, lumber,
  stone heap (80 %), wheelbarrow, weapon rack, flag barrel; one collider per stack (stack height). Sacks, buckets,
  pallets (0.36 m, steppable) are not solid. `?pcol=1` draws them as magenta wire boxes.

## Public API
- Service `props` / `window.__props`: `stats()` (villages planned, props, triangles, colliders, planMs, maxPlanMs,
  footprintMs, chunkMs, rejected-slot reasons), `census(R, q, r)` (per village counts), `plan(id)`,
  `validate(R, q, r)` (independent re-check of every planned prop: float, slope, road, building, door, overlap,
  owner cell, stack gap, plaza, spawn).
- `plan.ts` exports `planVillage`, `validateVillage`, `buildingAt`, `PropEnv`, `PROP_IDS`.

## Showcase
`/?showcase=props` (uses terrain, roads, villages, nature; load radius 240 m). Presets (deterministic: nearest proper
village to the origin that has the vignette; its richest one; camera searched for a clear line of sight):
`props.door, well, market, mill, field, crossing, tavern, smith, lumber, site, street (≈ 2 m eye height), village`;
`props.rig_<type>` / `rigtop_<type>` with `&view=rig`.

## Measured (radius 40 cells around the origin; validator)
| seed | villages / hamlets | props | props per village (min–max) | per hamlet | validator violations |
|---|---|---|---|---|---|
| 1337 | 8 / 9 | 499 | 34–57 | 3–14 | 0 |
| 42 | 8 / 8 | 415 | 27–53 | 4–13 | 0 |
| 7 | 11 / 12 | 628 | 42–62 | 2–17 | 0 |
Door vignettes = 40–50 % of houses. Showcase 123–137 draw calls (same as without props), 60 fps, props ≈ 23–40 k
triangles in the loaded area. Planning ≈ 4–6 ms per village (one-time, inside the first chunk build that touches the
village; up to 13–22 ms seen under heavy machine load), footprint fitting 40–100 ms once at init. 0 console errors.
Evidence: `tools/out/props/final_s{1337,42,7}__props.*.jpg`, `final_s42b__props.{crossing,field,mill}.jpg`.

## Assumptions / known issues
- Flags stay at pack scale (units.ts); planted in a barrel so the banner flies above head height. Still a small
  pennant compared with the houses.
- The plaza is kept free of solid props, so the centre flag almost never fits; flags appear at entries instead.
- Trees of the nature module are not tested against props (nature keeps village cells free; crowns may overhang a
  yard edge above prop height).
- Market and windmill models carry a lot of built-in clutter; their vignettes therefore often go to side walls.
- Camera presets are verification aids; a few close-ups still have foreground clutter from neighbouring buildings.
