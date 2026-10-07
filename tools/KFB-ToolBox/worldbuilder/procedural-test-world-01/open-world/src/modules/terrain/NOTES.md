# terrain — NOTES (round 4 + integration pass "welded meadows")

## Void slits (user report 2026-10-07)
- Cause: a flat top welded (no rim) toward a LOWER ramp neighbour; hex_grass side walls start 0.375 m below the top, so
  a see-through slit opened along that edge (seed 97 at the road ramps (1,−3), (2,1)).
- Fix (`edgeDepths`/`flatTop`): lower flat neighbour → KayKit rim bevel (as before); lower ramp neighbour (side/foot
  edges) → vertical skirt from the top down past the side-wall top, no inset (no groove); a ramp whose high edge meets
  the cell at its level still welds. Embankment, ramp and shore skirts are two-sided (no slit seen from behind).
- Void probe (scratch): magenta background, sky/clouds/fog off, 4 oblique views per 15 m grid point over ±60 m,
  count background pixels in the ground part of the frame: seed 97 9 hits → 0; 123 0; 42 0. Crack check: 0 on all three.

## Road sink on ramps (2026-10-07)
- Road-ramp cells (roadMask + slope, not bridge/water): planar ramp hull lowered by ROAD_SINK (0.375 m); roads' ramp-tile
  trimesh is the walkable top. Embankment colliders unchanged (their edge now stands ≤ 0.375 m above the hull: a
  step within autostep, covered by roads' full-height wings).

## Claymation detail (2026-10-07, decision `asset-policy-clay`)
- `look.ts CLAY`: one shared `public/assets/tex/clay_floor_001_diff_1k.jpg` (CC0 Poly Haven), mipmapped, anisotropy 4,
  repeat; world-space projection (tops: xz, cliff faces: along-wall × height), tile 2.8 m. Used as grey luminance
  detail normalised to the texture's σ (it is low-contrast): albedo × (1 + clamp(z, ±2)·0.07), faded by view distance
  22 → 50 m. Applies to every `makeTerrainMaterial` user (terrain tops/sides/embankments/shore, roads tiles, village
  plaza). `?clay=0` off. Copied via tools/copy-assets.mjs extra-files section; listed in ASSETS.md.

## Overhang fix (2026-10-06)
- Embankment colliders were only the top trimesh sheet: where an embankment edge stands above a lower/flat neighbour
  (corner next to a ramp), the sheet overhung the neighbour (seed 97 near (−150,−17.3): 1.6 m thin edge, head catch).
  The trimesh now includes the same vertical skirts as the mesh (from the edge down to level − 0.5 m) → vertical face.
- Cells with village buildings / fields / squares (`bld:*`, `field`, `square` tags) are never embanked.
- Probe: upward rays from the physics ground (+0.15 m, 2.35 m long, player filter) on a 1 m grid around the 40 nearest
  ramps: 0 overhangs on seeds 97, 123, 42 (~42k points each); probe validated with a test sheet.

## Whole-game critic r3 pass (2026-10-06)
- **Ramp/embankment crack (#5)**: the free-edge fade of an embankment also lowered it next to its own ramp near
  corners shared with a non-embanked neighbour → slit along the ramp side (0.1–0.15 m, ramp skirt showing brown).
  Now the fade is overridden within EMB_FADE of the edge shared with the ramp → welded (probe: ≤ 0.02 m).
- **Crack check** (scratch tool): along every shared hex edge within ~95 m of the origin, where `heightAt` is continuous
  (|Δ| < 0.35 m) the rendered surfaces on both sides (±6 cm) must agree within 8 cm. Terrain-owned crack edges after
  the fix: seed 97 0 (2 before), 123 0, 42 0. Remaining cracks all involve roads' tiles (road-tile berm 0.29 m above the
  flat grass, road tile dipping 0.3 m at its rim, road ramp tile 0.6 m above the plane near a corner) → roads.
- **Physics lips (#3)**: same edges, player-filter ray casts at ±0.3 m: terrain-owned lips 0 — the few flagged are
  nature solids (rocks/trunks) or roads' berm colliders (0.29–0.31 m at road cells).
- **Cliff faces (#8)**: dirt shader adds a shadow line under the grass lip, two darker strata bands with a slow
  world-space wobble, a darker foot, vertical weathering streaks and close-range clods/stones (faded by footprint).
- `api.cliffFootMask(cell, get)`: edges where a higher land neighbour rises (cliff foot) — anchor for nature's foot rocks.

## Integration follow-up (river banks, road-ramp embankments)
- `gen.ts bankCap`: cells ≤ RIVER_HALF_WIDTH+1.6 cells from a river line are capped at level 1, ≤ +3.2 at level 2 →
  no river cell has a neighbour 2+ levels higher (before: 42–87 per 81×81 cells per seed; the seed-50 `roads.river`
  "grass over the river" was a 7.5 m plateau beside the channel hiding it from that angle — top-down the river was intact).
- Embankments now also flank road ramps (`isTongue` = slope, not river, not water); flank cells carrying road/river are
  never embanked; `embHeight` fades to 0 within EMB_FADE 3 m of every same-level neighbour that is not part of the same
  ramp's embankment (roads, rivers, flat grass) → no raised hex outlines, nothing over road/river tiles.
- Wedge check (61×61 cells, game mode): terrain-owned partial walls 0 on seeds 50/123/42/7.

## Whole-game critic r2 pass (2026-10-06)
- **Root cause of wedges/trenches**: the pocket ramp rule (upper boundary cell dropped a level, sides d±2 kept HIGH) cut
  a ramp-shaped pit into every plateau edge: the planar ramp sat below its four high flank neighbours → triangular dirt
  walls on both sides (V wedge / trench the player could run into).
- **Tongue ramps** (`gen.ts rampCandidate`): a LOW cell in front of a straight one-step cliff becomes the ramp; only d is
  high, d±1/d±2/d+3 stay low, levels never change. Plateau edges are never notched.
- **Embankments** (`build.ts embRamps/embAt/embTop`): the 4 flank cells of a tongue ramp get a lattice top that slopes
  (EMB_W 6.5 m) from the ramp's side edge down to their grass, with round shoulders; trimesh collider; `heightAt` uses the
  same lattice. Edge tolerance matters (lattice vertices lie exactly on the shared edge). Stage-1 tag `embankment` on
  flank cells (request to villages/roads to keep buildings off — see CORE_REQUESTS).
- `?ramps=pocket` restores the old rule (A/B, before/after measurements only).
- **Check** (scratch tool, counts per 61×61 cells around the origin, game mode): edges where the height step varies
  along the edge by > 1.2 m (partial-height walls = wedges). Terrain-owned wedge edges: seed 50 135→3, 123 148→5,
  42 121→4, 7 132→2 (remaining: ramp flank cells with a building on them). Road/river-owned: 92–118 (roads' ramps).
- **Hex outlines from the air**: rim bevel now uses the top texel with an up-biased normal; remaining lines are real
  one-step terrace edges.
- **Forest floor**: smooth per-vertex `aForest` (nature's final `cell.forest`, distance-weighted over 7 cells) darkens/
  greens grass tops under canopies (≤ 20 %). `?forestshade=0` off.

## Whole-game critic r1 pass (2026-10-06)
- **Curved coasts** (`shore.ts`): `shoreD` = polynomial smooth-min (k = SHORE_SMOOTH 8 m) over the water-hex distances,
  clamped ≥ 0 → concave notches filled, convex corners rounded; sand band SAND_W 6 m, waterline ≈ 3 m into the shore
  cell (SAND_EDGE 2.86), lip 1.2 m; beach facets shaded with up-biased normals (no lattice checker). The shallow band of
  water cells uses the same smooth-min. Non-shore cells stay ≥ 6.66 m from water in the smoothed field → never sand.
- **Wading limit**: shore cells add a PLAYER_ONLY trimesh wall where the beach is > 0.45 m under the water surface
  (lattice edges between wet and dry ground) — the knight stops at knee depth (was walking 1.4 m deep).
- **Hex shade patches**: removed the per-level brightness step in look.ts (single raised cells read as lighter hexes
  from the air); shore grass texel = flat-top texel; planar ramp tops shaded with up-biased normals. Measured remaining
  difference between a meadow cell and its neighbours ≤ 2/255.
- **Softer terrace silhouettes** (`build.ts cornerShift`): at hex corners where exactly two levels (one step apart) meet
  between three flat grass cells, the corner of top polygons and hex_grass side walls is pulled 0.55 m toward the odd
  cell (+ ±0.2 m world-space jitter). Decided per corner from its 3 cells → watertight; colliders stay hex prisms
  (≤ 0.75 m visual deviation near corners). `?soften=0` switches it off.

## Perf pass (2026-10-06) — generator ~6–9× faster, bit-identical
Measured (seed 123, `/`): terrain layer self time was 8.1–13.3 s of an 18–29 s boot (roads' A* pulls ~300k terrain
cells at boot). Hot spots found (node CPU profile + call counts):
- string keys (`q + ',' + r`) + `Map` lookups in 13 per-cell memos — ~40 % of the time (pre/raw/base1/base2/key/GC);
- `rampCandidate` NOT memoised: every `rampDir` re-evaluated it for 37 cells (each ~10 `pre` lookups);
- lake rasters built for all 3×3 lake macro cells of every queried cell (each raster reads `baseLevel` along its whole
  shore, i.e. terrain ~30–60 cells away); `lakeAccepted` re-read 9 lake params per call; lake distance field a string Map;
- `clean()` allocated a Map + closures per cell and pass; `evalFeature` returned objects; `riverCorridor` allocated a
  RiverInfo per raw cell and the centre-chain test re-evaluated the warped river coordinate of 7 cells;
- core/rng `hash(...v)` rest-args + `simplex2` closure per corner.
Changes (`gen.ts`, new `fastrng.ts`):
- every per-cell stage is memoised in 32×32-cell **tiles of typed arrays** (packed ints, numeric tile keys, 2-entry
  tile cache), computed lazily and exactly once; `pre` is one packed int (level|water|rocky|top|form|lakeDist);
- ramp candidates, rocky-neighbour counts and the river coordinate at cell centres are memoised;
- `riverCorridor()` / `river()` = O(1) amortised (typed tile + one RiverInfo object per cell on demand);
- lakes are rasterised only when a queried cell lies inside their box (box known from the params); lake rasters use
  flat indexing; `lakeAccepted` memoised;
- features that cannot beat the current max step (`maxS ≤ s`) are skipped; `hypot` skipped when a²+b² is clearly
  beyond the outer ring (1e-9 relative margin);
- `fastrng.ts`: fixed-arity, closure-free copies of core `hash`/`simplex2`/`fbm2` + pre-mixed seed state (5 instead of 9
  murmur mixes per simplex). Same integer ops / float expression order → identical values (verified on 2M random
  inputs). **If core/rng.ts ever changes, mirror it in fastrng.ts.**
- memo caps: 1024 tiles per typed memo (~53 KB per tile set), 512 tiles for TerrainCell/RiverInfo objects.
Proof of identity: `node --experimental-transform-types --no-warnings src/modules/terrain/tools/ident.mjs [row|shuffle|reverse] [cq cr]`
hashes all fields the layer writes (+ derived tags) and `riverCorridor` over 161×161 cells × seeds 123/1337/42/7 —
identical to the pre-perf generator for 3 areas × 3 query orders; public `pre/baseLevel/rampDir/elev` identical too;
in-page stage-1 CellData of the live world == old generator (25 921 cells, 0 mismatches); terrain showcase screenshot
pair differs only at the render noise floor (0.04 % px, max Δ4, same as two shots of the same build).
Speed (cold generator, µs per final cell, min of 3, node / Chrome in-page; old → new): dense 161² 18.3→3.0 /
16.1→2.6; scattered 16×16 blocks 42.7→6.2 / 40.3→5.9; sparse every-4th 202→33 / 187→30; isolated cell 2.6→0.30 ms.
Boot `/` seed 123, same machine load (uptime load ≈ 17): layerMs.terrain 8137 → 1185 ms, ready 17.6 → 11.9 s,
streaming roadsMs 12.5 → 7.7 s (logs `tools/out/terrain/perf_{before,after}2.json`). The remaining boot time is roads'
`net.ts` A* (~6.9 s self) and `world.ts computeUpTo` (~3.4 s self: string keys + 60k-entry memo cleared while ~300k
cells are live) — not terrain.

## Welded meadows (integration pass, 2026-10-06)
Critics on every module read the hex grid on flat grass as "giant floor tiles". Fix, terrain-only:
- **Flat grass tops are procedural** (`build.ts` `flatTop`, merged into the per-chunk `terrain-tops` mesh): one flat
  polygon per cell at `y0`, normal straight up, the hex_grass top texel. **Same-level edges carry no geometry at all**
  → adjacent tops are one continuous plane (no bevel ring, hairline, normal tilt or tonal step).
- **KayKit rim only where it means something** (`edgeDepths`): an edge gets the 45° KayKit bevel (0.05 units wide/deep,
  hex_grass bevel texel) iff the neighbour is a lower, flat, non-water cell (terrace/cliff rim) or a same-level
  road/river cell (their tiles keep KayKit's full grass bevel → symmetric V groove; a softer rim there left cracks and
  see-through slivers). Shore and ramp neighbours weld. The polygon is inset only along rim edges; the class of an
  edge depends only on the two levels + the third cell's kind, so all cells sharing a corner agree (watertight).
- hex_grass' **side walls** are reused as geometry (top + bevel stripped once in `prepareFlatTop`), so cliff faces,
  dirt bands and grass lips are unchanged.
- **Tonal variation** (`look.ts`, all users of `makeTerrainMaterial`, i.e. also roads/villages tiles): value-noise in
  world space instead of the old sine patches — low frequency (~120–290 m) warm/cool hue drift ±8 %, ~75 m brightness
  ±5 %, plus a faint 2.6 m / 7 m grain (±3–4 %) on grass-coloured, up-facing fragments only, faded out by screen
  footprint (`fwidth`) before it can alias. No texture, KayKit-clean.
- Switches: `?flattops=0` → plain softened KayKit hex_grass tiles (old seam look, A/B + kill switch);
  `?terrainnoise=0` (or `services.terrain.noise.value = 0` live) → no tonal noise. `?plainmat` implies both tiles off.
- Heights, colliders, `heightAt`, ramps, shore and water are untouched.
- New camera presets: `terrain.meadow` (eye level ~2 m), `meadow15`, `meadow60`, `meadow200`, `rim` (one-step terrace
  rim from below), `coastclose`, `roadedge`, `riveredge`.
- Known: road/river tiles (roads module) still outline their own cells with the KayKit bevel and show a moiré in their
  grass area; corridors of road/river cells therefore still read as hex plates. That is the roads module's to weld.

## Planar ramps (integration decision)
- `api.ts`: `rampPlaneT(cell, x, z)` (−1 foot edge d+3 … +1 high edge d, linear) and
  `rampPlaneHeight(cell, x, z) = (level + steps·(t+1)/2)·LEVEL_H`. `rampHeight` = OLD half profile, @deprecated, kept
  until roads switch. heightAt, ramp colliders (convex hull of the plane corners) and the natural-ramp mesh all use the
  plane; `cellTopY` of a ramp = mid height.
- Natural ramp cells: own mesh (6-triangle plane + outward dirt skirts from the plane down to foot level − 0.1 m, so any
  lower side is closed), KayKit `hex_grass_bottom` columns start 5 cm under the foot level.
- Road ramp cells (roadMask + slope): terrain draws NO top and NO skirt, column starts at level·LEVEL_H − 7.5 m (as
  before; roads' tile supplies the body down to −1 asset unit), collider + heightAt planar.

## Round 4 changes
- **Closed cliff contours**: (superseded by the welded tops above — rims are now per edge, not per corner.)
- **Ramps**: pocket rule (d, d±1, d±2 HIGH, d+3 LOW): cut into the cliff, bounded by full-height neighbour walls along
  whole hex edges; must lead to a ≥ 3-cell-deep plateau and open onto ≥ 2 cells of low ground. Ramp tiles' rims are
  softened along the ramp profile (no 0.3 m micro-step cracks against neighbours).
- **Shore**: the distance field uses ALL water cells within 2 rings (one world-space function) → shared edges of
  shore cells match exactly (no folded sand / wedges).
- Capsule knolls (low connected ridges), dirt bands with constant texels + AA, decorations get the same tonal patches,
  gentle per-level brightness on grass tops (plateaus read against the plain).
- Perf: cheap feature rejection, cheaper river distance, memoised shore lattice. Terrain-only cold chunk 5–15 ms
  (incl. generator); in game mode most cold-chunk time is other layers computed lazily on first `world.cell`.


## What it builds
- **Stage-1 world layer** (`gen.ts`, pure, seeded, memoised, order-free; shared instance per seed via `terrainGen(seed)`):
  - **Plain** level 0, one broad step to level 1 in the uplands.
  - **Landforms** (jittered macro grid, 1 candidate per 10×10 cells): *mesa* (1–2 level wall, inner tier), *hill*
    (stacked 7.5 m terraces) and *ridge* (uplands, mountain crown). Hills/ridges ≥ 2 terraces get a one-step
    **foothill skirt** (d 1.0–1.32). **Knolls**: small one-step rises (R 1.7–3.6 cells) on a 7×7 grid, 62 % chance.
    Three clean-up passes remove pillars, pits, 1-cell spurs and 1-cell channels/walls.
  - **Rocky crowns** only at summit cores and never on a cell with a lower neighbour; mountain/hills pieces vary in letter
    and rotation per cell; outcrops only next to a crown.
  - **Lakes**: unions of 2–4 hex discs, cleaned to coast-representable shapes; never within 3.6 cells of a river line.
  - **River corridors** (new, for roads stage 4): rivers are iso-lines u = k·37 cells of a warped, seed-rotated, seed-phased
    coordinate → endless, gently meandering, never crossing, ≈ 560 m apart; the origin is always 25–75 % between two rivers.
    Corridor = single-cell centre chain + cells ≤ 1.7 cells from the line: forced to level 0 (carves a valley with clean
    cliffs through higher ground), no water/coast, no ramps, no rock. Validated over 141×141 cells × 3 seeds: 0 violations,
    0 dead ends, 0 branches in the centre chain.
  - **Ramps** (1 step): upper boundary cell drops a level; neighbours d, d±1 at the HIGH level, d+3 and d±2 at the LOW
    level (assets' rule — no corner slivers / coplanar walls).
- **Tiles** (`build.ts`): `hex_grass` / `hex_grass_sloped_low` + `hex_grass_bottom` columns (below the lowest neighbour's
  bevel). Road/river cells: column only. All tiles in ONE terrain material (`look.ts` 'dirt'): KayKit-style brown dirt
  sides with a grass lip under every 3.75 m step, world-space tonal noise on grass, FrontSide (no coplanar back-face
  z-fight on ramp edges). Flat tops: see "Welded meadows" (no same-level seams at all).
- **Shore** (`shore.ts`): KayKit coast tiles replaced by a procedural top per shore cell — a 10-subdivision lattice whose
  height and grass/sand split are a function of the world-space distance D to the union of the water hexes → crisp,
  constant-width beach that follows hex edges exactly, rounded around corners, no sawtooth, seamless between cells.
  Grass lip (0.3 m) → sand slope → under water. Separate 'shore' material picks grass/sand texels per fragment
  (anti-aliased edge). Trimesh collider = same lattice; `heightAt` uses the same barycentric lattice (max error 0.037 m).
- **Water** (`water.ts`): subdivided hexes per water/shore cell, vertex colour from distance to the waterline: light
  shallow band `#78cdf0` → `#44a3e6` → `#3990dc` in open water; calm specular shimmer only (no colour noise). Lake bed
  hex 4.5 m down. Colliders: WORLD bed, PLAYER_ONLY wall, CAMERA_ONLY sensor to the surface.
- **Showcase** `/?showcase=terrain` = the real unbounded streamed world (no island, load radius 300 m). Presets search
  the real world from the origin: `terrain.coast|cliff|ramp|mountain|river|wide` (targets differ per seed).

## Public API (`api.ts`, pure)
- `riverCorridor(seed, q, r): RiverInfo` — `{ onCentre: boolean; corridor: boolean; dist: number; level: number; id: number }`
  (see doc comment; stable signature for roads).
- `TAG`, `isBuildable`, `isRoadPassable`, `isWalkable`, `canStep`, `isWater`, `isCoast`, `isMountain`, `hasRock`,
  `cellTopY`, `rampHeight`, `cellOfWorld`, `cliffDropMask`, `validCoastMask`, `MAX_LEVEL`, `RIVER_SPACING`, `RIVER_HALF_WIDTH`.
- Service `terrain`: `{ heightAt, gen, stats(), waterMaterial }`.

## Known issues
- Grass colour/fog are environment's; my tonal patches are subtle on purpose.
- KayKit ramp tiles keep their original (deeper) edge bevel.
- Per-cell generator cost ≈ 3 µs (dense) … 30 µs (sparse queries; margins for the clean-up passes and ramp search).
