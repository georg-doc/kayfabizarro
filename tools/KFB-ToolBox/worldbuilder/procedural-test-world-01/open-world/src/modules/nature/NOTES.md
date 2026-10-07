# nature — NOTES (round 4)

## Round 4 changes (critic r3: 7.5 / 8.0 / 8.0 / 6.5)
1. **Occlusion cut-out instead of dither** (`mesh.ts`, cache key nature-v6): no screen-door at all. Fragments are discarded
   only (a) within 1.2 m of the camera and (b) inside a cone from the camera to the Knight's body centre (player + 0.95 m):
   radius = 1.1 m (foliage) / 0.75 m (trunks, rocks, bushes) at the Knight, shrinking linearly toward the camera (= a fixed
   screen-space circle), ending 0.25 / 0.45 m before him. Edges are a 1–2 px `fwidth` ramp written to alpha with
   `alphaToCoverage` (MSAA) → smooth, not dotted. Nothing beside or behind the Knight is touched. Shadows: three uses a plain
   MeshDepthMaterial for these meshes (no fade) → shadows always whole.
2. Shadows: see 1 (the r3 "dotted shadows" were the dithered crown fragments themselves / GTAO on the dithered depth).
3. **One type per stand**: `standType()` (260 m noise, ±0.03 jitter → ~5 m mixing band): angular pines (+ single A, rare
   dead trees) / round pines (+ single B) / broad-leaf groves (one family per 320 m region). Copses: one family each.
   Crowns of different families never interpenetrate (`crownsCompatible`, 0.9·(R1+R2)).
4. **Stand borders off the hex grid**: per-tree density = interpolated cell density × world-space round clearings
   (`clearingAt`, moved out of the per-cell layer) + a fine 11 m edge noise in the mid band; copse/lone cells no longer
   punch hex holes into forests.
5. Rim setback: no drop > 0.3 m within 1.3 × crown radius of the trunk; ≥ max(1.5 m, 0.8 R) from any cliff foot.
   Validator (24 directions, all trees of loaded chunks): seed 42 2696 trees, seed 7 2996 trees → 0 wall / 0 rim / 0 foot.
6. See 3 (crown compatibility).
7. Broad-leaf `headScale` = clamp(3.3 m / lowest foliage vertex, 1, 1.35) → no branches at helmet height.
8. **Round trunks**: hex-pack pine trunks replaced by a 10-sided tapered column (same atlas texel, r 0.20→0.15 m A /
   0.22→0.17 m B before species scale). Far LOD now only beyond 230 m chunk distance (decimation made trunks boxy).
Perf: game `/` 141–236 draw calls, 0.58–0.87 M tris, 60 fps; showcase 162–305 dc, 0.43–1.0 M tris, 59–61 fps.


## Round 3 changes (critic r2: 8.5 / 8.0 / 8.0 / 8.0)
1. Needle-point pines: B-pine trunks are made a straight column (radius ≤ base·k) and all trunks are slimmed via
   `slimTrunk` (protos.ts `TRUNK_SLIM`: A 0.55, B 0.5, single 0.55 — trunk and the crown-underside ring around the trunk
   hole, so the crown stays closed). Trunk Ø now ≈ 0.25–0.4 m (was ≈ Knight width). Colliders follow (r ≥ 0.22 m).
2. Dither: interleaved-gradient-noise threshold (fine, no Bayer rings), smooth fade 0.8–3.0 m from the camera, band
   around the camera→player line 0.8–2.6 m soft radius. **Trunks, rocks and bushes fade too** (camera request) — trunks only
   in front of the player (band ends 0.9 m before him), crowns until 1.5 m past him. Shadows unchanged.
3. One pine style per stand: round B-pines (+ tree_single_B) where the 260 m type noise < −0.15, angular A-pines
   (+ tree_single_A) elsewhere; broad-leaf (orange trunks) only in broad-leaf regions and their transition zone (type > 0.2); dead trees not in round-pine stands.
4. Layout: density interpolation no longer stops at level changes; per-level offset cut to ±0.07 → edges cross terraces.
   Broad-leaf and round-pine stands gated by an 11 m clump noise (groups with glades) and big crowns in cores may overlap
   (40 %) → no orchard grid. Per-seed coverage calibration (`coverageShift`, pure of seed: 62nd percentile of potential over
   ±90 cells → ~30–35 % forest): seed 42 now has large forests.
5. Stumps sunk to ≤ 0.45 m above ground (validated max 0.45).
6. Cliff feet: one irregular 2–4 piece cluster per wall (scatter radius 0.9–2.3 m) instead of a dotted line.
7. Rocks/stumps keep footprint + 0.5 m off any wall (no stump leaning on a cliff).
Validator (all trees in loaded chunks): seed 1337 3868 trees 0 wall / ≤ 1 lip / 0 floating; seed 42 3559 / 0 / 0 / 0.
Game `/`: 134–219 draw calls, 0.60–0.77 M tris, 60 fps.


## Round 2 changes (critic r1: 7.0 / 7.0 / 7.5 / 7.0)
1. **Foliage no longer blocks the camera** (ARCHITECTURE §5 decision): all CAMERA_ONLY crown/bush sensors removed.
   The nature material dithers foliage fragments (atlas-classified per vertex: green texel = foliage; trunks/rocks never)
   within 1.3–2.4 m of the camera and inside a cylinder around the camera → player-head line (r 1.1 → 2.0 m soft edge,
   ends 1.2 m behind the player), 4×4 Bayer screen-door. Uniforms from `ctx.camera.position` and
   `services.player.position` every frame (off while a verification camera override is active). Shadows unchanged
   (default depth material). Proof: `tools/out/nature/walk__w0*.jpg`, `walk__sheet06.jpg` (real input on `/`, follow camera).
2. **Crowns above the head**: split hex pines get a crown lift (trunk stretched: A +1.3 m, B +1.7 m (B trunks slimmed to
   ≤ 0.36 m), single +1.0 m) and a per-species scale (`SPECIES_SCALE` in place.ts: A 1.2, B 1.1, single 1.1, broad 1.0).
   Crown skirt now 2.1–2.75 m × scale ≈ 2.3–3.2 m; pines 8–11 m ≈ 1.0–1.3 × KayKit houses (7–10.5 m).
3. **Dense cores, loose rims, edges off hex lines**: density at a lattice point is now the barycentric interpolation of
   the three nearest cell densities (same level only); fill `0.97·smoothstep(0.08,0.85,D)^1.25`, clump noise fades out
   in cores (→ crown to crown), layer ramp `smoothstep(0.28, 0.74)`.
4. **Trunks are capsules** (r ≥ 0.3 m) → the KCC slides around them; real-input walk: continuous 4.4 m/s through the
   forest, the only stops were against terrain cliffs.
5–7. **Ground**: no trees on ramp cells; trunk footprint (r ≥ 0.6 m, 8 samples) must be flat within 0.15 m; nothing
   within 1.15 × crown radius may rise > 0.3 m (walls, raised tiles, ramps); trunk ≥ 1 crown radius from any drop
   > 0.3 m. Rocks/bushes keep their full footprint + 0.35 m off walls; rocks never reach into a crown (crown grid).
   Validator (all trees of all loaded chunks, 16 samples at R): seed 1337 2311 trees / 0 wall / 0 lip violations,
   seed 7 1765 / 0 / 0.
8. **Far LOD**: B-pines, broad and single pines get a vertex-clustered far version (220→84–122, 530–988→63–275 tris);
   chunks beyond `FAR_R` = 150 m (camera distance, +20 m hysteresis) draw it (`services.nature.farRadius`, `?natfar=`).
   Game mode `/` now 129–220 draw calls, 0.51–0.68 M triangles (was up to 0.88 M), showcase 0.44–0.96 M.
9. **Variety**: dead trees (`Tree_Bare_1_A/1_B/2_A`, 2.5 % of rim/mid lattice trees), stumps (`tree_single_*_cut`,
   ~3.5 % of free forest points), per-cluster foliage tint (38 m noise ± per tree, shader `aNat.w`) and per-cluster size
   (45 m noise, ±10 %).


## Files
| file | what |
|---|---|
| `layer.ts` | stage-5 layer `applyNature`: final `cell.forest` density + tags `forest_core`, `forest_edge`, `copse`, `lone_tree`; `blocked(cell)`; `rawDensity` |
| `protos.ts` | prototypes (flattened metres geometry + measured trunk/crown metrics). Hex-pack `trees_A_large` / `trees_B_large` are **split into their individual pines** (one connected component each, deduped → 6 A-pines, 5 B-pines) |
| `place.ts` | `planChunk(pc, protos, cx, cz, cells)` — pure per-chunk placement plan (items, grass, collider specs) |
| `mesh.ts` | per-chunk merge per material + calm wind-sway clone of the pack material (`onBeforeCompile`, built-in material → fog/shadows unchanged) |
| `index.ts` | module: layer, init/preload, buildChunk, near-detail culling, wind time, showcase + presets, showcase-only Knight scale figures |

## Density rules (layer, stage 5)
- 0 on: water, coast, road/river, bridge, village/building/reserved, mountain biome, tags `rock mountain field square lake`.
- `d = smoothstep(0.32, 0.72, terrainPotential + 0.2·simplex(level-salted, 140 m))` → the per-level offset makes forest
  borders snap to cliff lines (one plateau wooded, the next open). Clearings: `d *= 1 − smoothstep(0.5, 0.68, simplex(52 m))`.
  `d < 0.12 → 0`. Next to village/building cells `d ≤ 0.45`; next to road/river `d *= 0.9`.
- Meadow cells (d = 0, flat, no forest neighbour > 0.3): `copse` (forest 0.35) or `lone_tree` (forest 0.1) by hash, only
  in "parkland" regions (330 m noise) and likelier just outside forests (outliers); lone trees likelier next to villages.

## Placement rules (place.ts, pure of seed + chunk + final cells + terrain height)
- **Forest lattice**: world-anchored triangular lattice, spacing 2.7 m (≈ one hex-pack pine), jitter ±26 %. Each point
  reads a smooth density (own cell blended toward the neighbour across the nearest edge, so rims thin out and spill a
  little past hex borders instead of hex-shaped blocks). `P(tree) = 0.72·smoothstep(0.06, 0.72, D)·clump` with a 15 m
  clump noise (0.12…1.35) → tight groups with small glades. Seamless across chunks.
- (round 2: density is barycentric over the 3 nearest cells, see above; scales include `SPECIES_SCALE`.)
- **Species**: A-pines dominate; B (round) pines where a 260 m type-noise < −0.22; broad-leaf regions (type > 0.4) use one
  family per region (round `Tree_1_*` or boxy `Tree_2_A`, chosen by 320 m noise); rim trees (D < 0.5) 20 % broad; 7 % of
  core trees are tall `tree_single_*`. `Tree_3_*` (umbrella) only in copses / lone trees. Scale: pines
  `(0.9 + 0.24·core)·(0.88…1.12)` → 5–8.5 m (core taller than rim), broad 0.82–1.08 → 6.5–10 m. Random Y rotation.
- **Big crowns** (broad, B-pine, single) suppress ring-1 lattice neighbours by priority — computed from the neighbours'
  own pure candidates, so it is order/chunk independent.
- **Undergrowth** on free lattice points: bushes (rim band + a few deep), small rocks, rare mid rocks, grass — gathered
  around trunks (×1.25 next to a tree, ×0.35 isolated).
- **Per cell**: copse = 3–6 trees of one family around an off-centre point + bushes + grass; lone tree (+ bush, grass);
  cliff feet = 1–3 bushes/rocks along 35 % of walls of higher neighbours (inset 1.1–1.9 m); field margins = loose
  bush hedge along edges to `field` cells (ready for villages); meadow grass = one small clump in 12 % of cells.
- **Checks for every piece**: footprint spatial hash (no piece intersects another), neighbour structures (buildings,
  bridges, reserved, rock decorations: crown radius clearance; roads/rivers ≥ max(0.9 m, ½ crown)), ground: trunk ring
  slope ≤ 0.38 m, no wall within 1.0 × crown radius, no drop under 0.76 × crown, base = lowest trunk-ring sample − 6 cm.
  Flat dry cells answer height from their level (identical to terrain's provider), others ask `world.heightAt`.

## Colliders
- Trunks (incl. dead trees): capsule `r = max(0.3, mid-trunk radius·s)`, 2.2–3.4 m tall, `WORLD_GROUPS`.
- No crown / bush colliders (foliage is dithered instead, see round 2 #1). Bushes and grass are not solid.
- Rocks / stumps > 0.7 m tall: solid (mid rocks: convex hull of their vertices, others cylinder).

## Rendering / perf
- Per chunk: 1 merged mesh per pack material (hex + forest) for trees/big rocks (+ the same for the far LOD, only one
  of the pair visible), 1 per material for near-detail (bushes, small rocks, stumps), 1 `InstancedMesh` per grass asset.
  Attribute `aNat` = (wind amplitude·h², phase, foliage flag, tint). Wind ~0.13 m at a 7 m pine top. Verified: 2.2 % of pixels move between t=10 s and
  11.7 s vs 0.03 % noise.
- **Near-detail culling**: bushes, small rocks and grass hidden for chunks farther than `DETAIL_R` = 125 m from the camera
  (+20 m hysteresis). Service `nature.detailRadius` is settable (streaming, wave 3). `?natdetail=<m>` overrides.
- Measured (headless Chrome, M1 Max, machine shared with other agents → fps noisy): showcase 3 seeds, all presets:
  **149–259 draw calls, 0.46–1.20 M triangles, 42–61 fps**; game mode `/` (all modules): follow 121 dc / 0.56 M,
  aerial 192 dc / 0.88 M. Before culling, nature alone added ~1.27 M tris in aerial (grass 472k, bushes 223k for 30 chunks).
- Chunk build: plan ≈ 4.8 ms + merge ≈ 2.3 ms warm (≈ 12 ms cold, first chunks / JIT). Above the 6 ms/frame budget when a
  chunk builds alone → **wave 3 streaming**: consider building nature a frame after terrain, or in idle time.
- Far representation: not needed at the current load radius (pines 48 tris, B-pines 220, broad 330–640). If streaming
  raises the radius beyond ~250 m, drop near-detail entirely and swap B-pines/broad trees for A-pines in far chunks.

## Showcase `/?showcase=nature` (uses terrain, roads; works without roads)
Real streamed world, default camera = `forest_edge`. Two Knight figures (Idle_A, 1.9 m) for scale, showcase only
(`&figure=0` hides them). Presets (deterministic spiral search near the origin; camera lines checked against terrain and
crowns): `nature.overview` (forest/open mix, 170 m), `nature.mid` (60 m over a core), `nature.forest_edge`,
`nature.forest_inside` (head height in a clear aisle between trunks), `nature.figure` (Knight at the edge),
`nature.copse`, `nature.lone`, `nature.cliff`, `nature.ramp`, `nature.road`.
Debug: `?nature=off` (no nature build, for perf A/B), `?natgrass=0`. Service `nature`: `stats()`, `protos()`,
`plan(cx,cz)`, `breakdown(cx,cz)`, `detailRadius`.

## Public API for other modules
- `cell.forest` final density 0..1; tags `forest_core`, `forest_edge`, `copse`, `lone_tree` (props may read them).
- `blocked(cell)` from `layer.ts` = the cells nature never plants on.

## Assumptions / known issues
- Grass tufts scaled 0.42–0.62 of the pack size (forest-pack tufts are 1.1–1.8 m at FOREST_SCALE → knee/hip height).
- Bushes limited to the rounded families (Bush_1, Bush_3, Bush_4 B/D); boxy Bush_2 read as green cubes.
- Broad-leaf regions (boxy Tree_2 forests) are busier than the KayKit hex samples (which only show pines); they are a
  minority by design. A critic preferring pure pine forests: raise the broad threshold `ft > 0.4` in `place.ts`.
- Undergrowth "gathering" only sees trees of its own chunk (border points are a little sparser) — deterministic anyway.
- New module folders are not picked up by Vite's `import.meta.glob` (hmr off) until `src/core/main.ts` is touched —
  I touched its mtime once (content unchanged). See CORE_REQUESTS.md.

## Canopy API (for the camera, added after round 4)
- `src/modules/nature/api.ts` (pure): `CanopyIndex` (crowns of loaded chunks in an 8 m grid, flat `[x, z, r, baseY]` per
  chunk, registered in buildChunk, removed on `chunk:unloaded`), `canopyBaseAt(index, x, z, radius = 3): number | null`,
  `inForest(index, x, z): number` (0..1, 19 samples out to 6 m).
- Service `nature`: `canopyBaseAt(x, z, radius = 3): number | null` (lowest crown-base world y of crowns overlapping the
  disk; null = open sky), `inForest(x, z): number`. Cost ≈ 3–6 µs per canopyBaseAt + inForest pair.
- Crown base = world y of the tree's lowest foliage (min of measured crown bottom and lowest leaf vertex).
- Verified in-page: seed 1337 forest cores 2.0–3.6 m above ground, cover 0.16–1.0, meadows null/0; seed 42 cores
  2.2–2.7 m, meadows null/0; minimum crown base on a 6 m grid around the focus 1.9 m (1337) / 2.4 m (42). One split
  B-pine (#3) had leaves at 1.6 m → now lifted until its lowest leaves are ≥ 2.35 m (before species scale).
- Trunk cut-out narrowed to 0.42 m at the Knight (only when a trunk truly covers his body); crowns unchanged (1.1 m).

## Plan cache / prefetch (perf integration)
- `buildChunk` now uses the cached pure plan `planFor(ctx, cx, cz)` (cache 128 entries, oldest evicted first) instead of
  planning inline. Service `nature.prefetch(cx, cz)` computes and caches a plan ahead of time (streaming idle work).
- Measured (seed 1337 showcase, 8 chunks rebuilt): cold build plan 5.5 + merge 2.3 = 8.0 ms/chunk; after prefetch
  plan 0 + merge 2.3 = 2.4 ms/chunk. Rebuilt geometry is identical to the original build (position/instance checksums).
- `nature.prefetchStep(cx, cz, budgetMs = 3): boolean` — resumable planning (`PlanJob` in place.ts: the planner phases are
  generators that yield per lattice point / cell; same order → identical plan). True once complete and cached.
  `prefetch()` drains it. ≤ 32 jobs in flight (oldest abandoned job dropped). `nature.maxStepMs()` for debugging.
  Measured: with the region's world cells already computed, max step 3.0–3.9 ms at budget 3; plans and rebuilt
  geometry identical to the single-call path. A step that is the FIRST to touch an unexplored region can take 0.5–3 s,
  all of it inside `world.cell` (earlier-stage layers: terrain/roads/villages macro regions), not in nature.

## Meadow ground detail (integration, after terrain seam welding)
- `place.ts` `meadowDetail` (last plan phase, resumable): world-anchored jittered 3.2 m grid over open land (cells not
  blocked, no ramp, forest ≤ 0.15). p = 0.004 + 0.55·patch + 0.34·edge; patch = broad 30 m noise × fine 9 m noise
  (irregular islands with bare gaps, not per hex); edge = max(forest rim, cliff foot ≤ 3 m, field margin ≤ 4 m, road/river
  verge ≤ 3.4 m). Each point: tuft clump (3–5 tufts, Grass_1_A ×1.15 + a chunky Grass_1_B ×0.7 in the middle 55 %),
  bush pair (7 % + 10 %·edge) or small rock group (2–3 rocks). In the open only bush pairs / rock groups. Roads, rivers,
  bridges, water, coast, village lots, squares, fields are blocked cells; verges keep ≥ 0.9 m off road/river tiles.
- Old per-cell "12 % of cells one clump" meadow grass removed. `?natmeadow=0` disables the phase (perf A/B).
- Perf (`/`, overview): +18 draw calls, +0.18 M triangles (grass 174k → 344k, detail 118k → 153k); all near-detail
  (125 m culling). Plan ≈ +1–2 ms per chunk, still sliced by prefetchStep.

## Shadow-pass trim (perf integration)
- Grass tufts never cast shadows (unchanged). Near-detail pieces under 0.6 m (pebbles, small rocks, stumps, small bushes)
  go to their own `nature-detail-small` mesh with castShadow = false (`?natsmallshadow=1` restores casting, A/B).
- The remaining near-detail (`nature-detail`: bushes / rocks ≥ 0.6 m) casts only in chunks whose centre is within
  `DETAIL_SHADOW_R` = 110 m (+20 m hysteresis) of the chunk focus (player) — `?natshadow=<m>`. Trees always cast.
- In-session A/B (same frame, all detail casting → now), `/`: seed 1337 follow 215 → 198 dc, 0.89 → 0.84 M tris;
  overview 383 → 346 dc, 1.45 → 1.35 M; aerial 412 → 380 dc, 1.58 → 1.48 M. Seed 42 follow 190 → 169, 0.82 → 0.74 M;
  overview 387 → 345, 1.53 → 1.42 M; aerial 430 → 388, 1.70 → 1.58 M. Trees remain the bulk of nature's shadow load
  (≈ 0.33–0.4 M tris, ~55 dc at overview).

## Whole-game critic r1 fixes (forest outline, rows, camera in bushes)
- Feathering: per tree, distance to the nearest edge of its cell toward a blocked cell (road, river, water, village…) or a
  different height level / ramp (`featureDist`); density × smoothstep(0, 1 + 7·n², dist) with a 14 m noise n → stands
  recede irregularly 1–8 m from roads, rivers and terrace edges instead of tracing the hex edge.
- Lattice jitter 0.26 → 0.42 (no rows); 7 m "gap" noise opens 2–4 m glades inside stands (clumps of trees with gaps).
- Angular-pine stands: at rims (D < 0.42) and around clearings 20 % mixed trees (≈ 9 % broad-leaf of the region's family,
  11 % round pines). Heights: per-tree 0.84–1.14 × cluster size ±10 %, 30 % young trees (×0.74) at rims.
- Cut-out: instanced grass now uses the nature material (`windMaterial(base, true)`, instance-aware world position) and,
  like bushes (flag 2 in aNat.z), clears a 2.3 m near-camera bubble (crowns/trunks 1.2 m) and the camera→player cone.

## Whole-game critic r2 fix (forest interior read as a plantation) + camera r10 trunk cut
- **Placement**: candidate lattice 2.0 m (jitter 0.45) → pure **Matérn-II hard-core thinning** (`survives`): a candidate
  dies if a higher-priority candidate lies closer than k·(R1+R2)/2 (crown radii; k per candidate) within ~6 m; different
  families keep 0.85·(R1+R2) apart. k = 1.5 − 0.72·core − 0.2·dense ± 0.125 → tight in clump cores (crowns overlap),
  loose between clumps and at rims. Chunk-independent (only pure candidates are compared).
- **Clumps**: jittered centres on a 21 m grid, radius 7–13 m, smooth falloff (`clumpField`) → existence probability and
  spacing fall off from clump centres; gaps between clumps.
- **Ragged outlines**: per-tree density sampled at a domain-warped position (±6 m, 26 m noise) + feathering against
  roads/water/villages/terrace steps (1–8 m) + world-space round clearings → no hex-shaped stand edges.
- **Species groups**: 17 m group noise inside a stand: groups of round pines in angular stands, broad-leaf groups at
  margins, round-pine groups in broad-leaf groves (dominant species per stand unchanged); dead trees at margins/gaps.
- **Forest floor** (`undergrowth(cells)`, own jittered 2.4 m grid): bushes, stumps, rocks, mid rocks and dead trees
  concentrate at rims, in clearings and in clump gaps; inside, grass clumps (tall Grass_2 reads like ferns; the packs have
  no mushrooms/ferns/logs). Fallen logs: not in the packs (would need a non-Y rotation in the merge path) — not added.
- Cost: plan ≈ 35 ms per chunk cold (was ≈ 8), sliced by `prefetchStep` (max step 4.1 ms at budget 3); merge ≈ 5 ms
  per chunk after prefetch (was 2.3). Seed 50 overview/aerial: 331/356 dc, 1.07/1.14 M tris, 61 fps.
- **Trunk cut-out near the Knight (camera r10)**: trunks/branches (non-foliage) now cut with a radius widening from
  0.42 m to 0.9 m within the last ~2.5 m before the Knight along the camera→Knight line, with a soft 0.3 m world-space
  ramp there (no popping). Crowns unchanged (1.1 m). Uniforms/API unchanged.
- Layer data shape unchanged (`cell.forest`, tags) — terrain may darken under canopy using `forest` / `canopyBaseAt`.

## Whole-game critic r3 fixes
- **#4 no holes**: trunks/branches, bushes, rocks and grass no longer get per-fragment sphere/cone cuts. Each instance
  carries an anchor sphere (`aAnchor` = centre xyz + radius; grass: from its instance matrix) and the vertex shader
  computes ONE alpha per instance: fade when the camera is within ~0.5–1.5 m of the sphere, or when the sphere crosses the
  camera→Knight line in front of him (to alpha 0.2). Rendered via alpha-to-coverage (MSAA) → whole-instance translucency,
  never a hole. Crown foliage of trees (aNat.z = 1) keeps the cone cut-out above the Knight. Shadows unaffected.
  Camera API unchanged (uniforms/services). Low bushes need no camera collision/tilt — the camera may pass through them.
- **#9**: bushes keep ≥ 0.6 m (+ their radius) off road, river, bridge, square and village cells (`pathDist`).
- **#7**: `roadsideTrees` phase — open cells next to a road or on a terrace edge, outside villages/fields, local-maximum
  hash selection (ring 1): lone tree or grove of 2–4 (stand-type species), + bush / rock; crown ≥ 1 m off road edges.
  Measured: one landmark per ≈ 70 m of road (seed 97: 59 over 274 road cells; seed 123: 52 over 249).
