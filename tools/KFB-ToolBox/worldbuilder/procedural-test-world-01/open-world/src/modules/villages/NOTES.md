# villages — NOTES (round 4)

## Occluder fade (core/fade.ts)
- Buildings, wells and stone/wood walls are merged by villages itself per base material (core's ChunkBuilder merge drops
  custom attributes) with `aFadeAnchor` = the object's bounding sphere (world) and drawn with
  `occluderFadeMaterial(base)` → a building between camera and player (or around the camera) fades as a whole.
  Fields, plaza stay in the normal path. `?vnofade=1` = old path (A/B only). Probe: `tools/fadeprobe.mjs`.
- Cost: +1 draw call per chunk that has village buildings (+ its shadow pass): seed 97 follow 228 → 237,
  overview 353 → 366, aerial 375 → 389 (load average ~33 during the runs, fps not comparable).

## Embankments (terrain tongue ramps)
- Cells tagged `embankment` (terrain TAG.embankment, ramp flanks with a raised grass shoulder) are not free: no
  buildings, no fields/gardens, no flattening (`freeCell`, `isEmbankment`, rural `sides`/`building`). A flat grain plate
  on the shoulder showed the hump cutting through it (tools/out/villages/emb__orbit_-645_4_-117_200_22_30.jpg before,
  emb2__… after). Buildings on embankment over R = 60: 11 / 8 / 9 → 0 (seeds 50 / 123 / 42).

## Game critic r2 follow-up
- **Facing snapped to the road** (`roadFace()` in fit.ts): the front is perpendicular to the road-strip segment that
  passes nearest (interior points beat bend joints), quantised to 30°, for village lots and rural buildings. Before, the
  front pointed radially at the nearest strip point → ~30° off at bends.
- **Denser rural features**: grid 8 → 6 cells, snap 3, spacing 5, 8 cells clear of settlements → 17–18 per km² on
  seeds 50 / 123 / 42 (≈ one per 100–150 m of road). 35 % of farmsteads get a **windmill** next to their fields (a
  landmark visible from afar). Watermills still impossible at stage 3 (rivers are stage 4).
- **Pastures dropped** (fence around bare grass read as "enclosing nothing"): crops grain / dirt / mixed only.
- Seed 50: the demo's precomputed spawn (262.5, −194.86) now lands on a home_A (layouts changed) → demo presets.ts
  must be regenerated; the village API spawn of v26,−14 is (307.5, 0, −168.87), heading −120°.

## Game critic r1 follow-up
- **Rural features** (`rural.ts`, part of the stage-3 layer, same rules): one candidate per jittered 8×8 axial grid cell,
  snapped (≤ 4) to a flat road cell with a free road-side cell at its level; ≥ 9 cells from every village / hamlet node,
  ≥ 6 cells from any stronger site, 8 % dropped. Feature by context of the road-side cell: ≥ 2 higher neighbours or rock
  within 2 above → **mine** (75 %); ≥ 2 lower neighbours (plateau edge) → **watchtower** (`tower_A/B`, 45 %); forest
  around (Σ ≥ 2.4) → **lumber camp** (lumbermill, 80 %) or **lone chapel**; else **farmstead** (1–2 houses + 1–3 field
  cells behind, one crop per farm, closed fence with a gate to the road) or chapel. Buildings face the nearest road point.
  Tags `rural`, `rural:<feature>` (+ the usual `bld:`, `door:`, `field`, `crop:`, `fence:`, `gate:`).
  API `ruralNear(seed, q, r, radius)` (VillageInfo with kind 'rural', `feature`), service `villages.ruralNear`.
  Presets `villages.rural_<feature>`, `villages.walkout`.
- **Field variety**: crop per cluster: grain 45 % / ploughed dirt (`building_dirt`) 20 % / mixed rows 20 % / pasture
  15 % (wood fence `fence_wood_straight` ×0.3 height, grass inside). Tag `crop:<grain|dirt|pasture>`.
- **Civic facing**: tavern / market / church / smith on a street cell now face their road (round-4 rule faced them at
  the square/crossing corner → side-on to the street); only cells touching the square but no street face the square.
- Counts (R = 60 ≈ 2.14 km²): rural 9.4 / 12.2 / 6.1 per km² on seeds 123 / 42 / 7 (≈ one every 150–250 m of road).

## Perf integration (after round 4)
- Profile (`tools/perf.mjs prof`): villages' own code was ~100 ms of the boot; the 1.1–1.5 s billed to
  `layerMs.villages` was the roads module's routing, forced by `nodesNear()` (it computes the degree of every node in
  range, and kindOf/plansNear/ownership asked for radii up to ~30 cells around each node).
- Now lazy and exact: `rawNodes()` (node positions without degree, via `roadNetOf(seed).node`), degrees only where the
  answer can change the result: kindOf's rival test skips nodes with a lower flat count (prio = flat·1e12 + degree·1e10
  + hash, so flat dominates), stops at the first rival; hamlet test stops at the first crossing; plansNear radius
  VR + 8 (max hex distance of a region cell from its centre is 8); ownership rivals within 2·VR + 1. Flat counts and
  kinds memoised with numeric keys.
- Identity: `node src/modules/villages/tools/perf.mjs digest 123,1337,42,7` hashes every stage-3 cell (level, village,
  building, reserved, tags) over R = 60 plus all plan data (items, doors, spawn, plaza): identical before/after
  (62f1dfbd / 2ee8c39f / d73c240e / 5eebe4b9).
- `?vlegacy=1` re-enables the eager degree queries for A/B timing (`perf.mjs boot N` interleaves both).

## Integration fix (after round 4, roads critic)
- Plaza lane over the crossing tile REMOVED: villages never draw on road / river / bridge cells. The plaza is the plaza
  hex only (paved to 7.15 m inner radius, inside the tile's top bevel; the shared edge with the crossing is the tile rim).
- Flagstones: running-bond slabs clipped to the hex (edge to edge, no missing tiles), flat coplanar quads 2 cm above
  the sand base, no side faces, no shadow casting → flush. Preset `villages.plaza` (shared edge close-up).
  Evidence: `tools/out/villages/px_s{1337,42,7}__villages.{plaza,well,centre}.jpg`.

## Round 4 changes (critic r3: Spawn 8.0, Authored 6.5, Scale 8.5, Ground 8.5, Image 7.5)
1. **Street frontage** (`frontage()` in plan.ts): each house slides from its lot centre toward the nearest road-strip
   point until its façade is 3.6 m from the strip centreline. The footprint may reach over the lot edge onto the grass of
   the street cell (same level, no ramp / bridge) but keeps ≥ 3.1 m from every road strip of the cells around and
   ≥ 0.45 m from every other building. Fallback: the in-hex fit of round 2. Lots on both sides of a street → two rows.
2. **Plaza**: paved hex (sand base, running-bond flagstones in the KayKit wall's stone texel, ~70 slabs, world-anchored),
   lane to the crossing, well in the middle on sand. Plaza = ring-1 cell with the fewest cliffs, then most road
   neighbours. Civic buildings (tavern, market 75 %, church, blacksmith) take the cells around the square first, facing
   it; what doesn't fit goes to the lots nearest the square.
3. **Core flattening — integrator permission (round 4)**: the stage-3 layer sets `cell.level = L` (crossing level) on
   cells within 2 of a village crossing that are exactly one level off, dry, no coast / rock / mountain / lake / ramp /
   road / road-ramp / river corridor / reserved, with no ramp or water neighbour, iteratively dropping any cell that
   would leave a ≥ 2-level step against a neighbour outside the set (the cliff moves outward). Tag `flattened`, `cliff`
   tag removed. The planner plans on the flattened levels. `Planner.flatAt(q, r)`.
4. **Facing**: unchanged rule (door toward the nearest road-strip point, half-edge steps); every lot touches a street.
   Cells boxed in by roads (≥ 4 road neighbours, or 3 not in one run) within 2 of the crossing get no building.
5. **Walls**: only closed borders around field / garden clusters (every edge to a non-field cell, except a rising cliff
   or water) with one stone gate (`fence_stone_straight_gate`, tag `gate:<d>`, no collider) toward a street.
   No yard walls.
6. **Fill**: up to 24 lots; unbuilt street lots within 2–4 of the crossing become walled garden plots (≤ 8).
7. **Spacing 15 cells**; a crossing too close to a stronger one (flatter site, then degree) stays a plain junction (no
   hamlet), and only settled nodes compete for cells (round 3 bug: a demoted crossing cut the village in half).
8. Construction sites removed (round 3).


## Round 3 changes (critic r2: Spawn 8.5, Scale 8.5, Ground 8.5, Authored 7.0, Image 8.0)
1. **Lots only where the road strip passes**: a lot must touch a street cell AND lie ≤ 13.6 m from the road strip
   (centre → road-edge midpoints) of that street cell; the door turns toward the nearest strip point in half-edge steps
   (12 directions). Cells around the plaza become lots facing the square.
2. **Plaza**: the plaza hex is paved in the road texel (circumradius 8.1 m, the tile bevel frames it) plus a road-width
   lane to the crossing centre; the well stands in its middle. Plaza = the ring-1 cell with the fewest cliff sides.
   Tavern / market / church on the cells next to the plaza face the plaza/crossing corner.
3. **Walls**: closed borders only — iterative pruning drops any wall segment whose end vertex neither meets another wall
   nor a street / building / field cell / cliff.
4. **Fill**: street lots within 3 of the crossing all built (4: 85 %, 5: 45 %, 16–21 lots); unbuilt street-side lots at
   dist 3–4 become walled garden plots (≤ 4) plus ≤ 3 back gardens.
5. **Grain**: plate sunk 0.14 m so its toothed rim hides in the grass top.
6. **Flat cores**: crossing priority = number of same-level flat cells within 2, then degree; lots within 3 of the
   crossing must be on the crossing's level.
7. **Construction sites dropped.**


## Round 2 changes (critic r1: Spawn 7.0, Authored 6.5, Scale 7.5, Ground 8.5, Image 8.0)
1. **Street frontage** (`fit.ts`): every building is pushed toward the street it faces until its front façade is
   1.8 m from the hex edge (corner-facing: from the hex corner), its whole footprint kept inside the hex (margin 0.3 m;
   big models may overhang ≤ 1.4 m) and never overlapping a building already placed (SAT test, 0 overlaps on 3 seeds).
   Two houses per corner lot were tried: two KayKit houses never fit inside one 15 m hex (brute force,
   `tools/fit.mjs`) → one house per lot, lots facing the corner when the street runs along two edges.
2. **Facing verified** with `?vdoor=1` (red door arrows, top-down `villages.top`) on seeds 1337/42/7: every arrow points
   at an adjacent street cell (or the crossing). Faces are ranked by how close the neighbour's road strip passes the
   shared edge, then street distance.
3. **Plaza**: one ring-1 cell per village becomes the plaza — a sandy stadium (road texel, terrain's tile material)
   from the plaza cell to the crossing centre, the well on it; tavern / market / church on the other ring-1 cells
   facing the crossing.
4. **Spawn point** per village in the API (`spawn: {world, heading}` on a flat street cell 1–2 out, facing the centre).
5. **Denser**: every street lot within 2 of the crossing built, dist 3: 90 %, 4: 60 %, 5: 25 %, 13–18 lots; walled
   **gardens** (grain plots) behind the core houses (≤ 3); back-yard walls on 75 % of houses.
6. **Roles**: inner lots (ring 2, street distance ≤ 2): church / market (whatever did not fit around the crossing) and the
   blacksmith; outer lots (≥ 3): lumbermill (summed neighbour forest ≥ 3.0) and construction sites.
7. **Fields**: grain plate grown 7 % in plan (meets its neighbours), height ×0.3 (crop tufts, not boxes).
8. **Spacing**: a crossing within 11 cells of a stronger one (more roads, then hash) becomes a hamlet or nothing;
   hamlets need 8 cells to any crossing. Min village spacing measured 12–13 cells.
9. `villages.spawn` preset = the API spawn point seen from 10 m behind at head height.


## What it builds
- **Stage-3 layer** (`plan.ts`, pure, seeded, order-free, continuous across chunks). One plan per road node, cached:
  - **kind**: every node with ≥ 3 roads → *village*; 45 % of 2-road nodes → *hamlet* (2–4 houses, maybe a well and a
    small field + windmill). Dead ends: nothing.
  - **ownership**: a plan may only claim cells within `VR = 6` of its node AND at least one cell closer to it than to
    any other road node (Voronoi + slack) → neighbouring plans never touch, any cell can be asked in any order.
  - **streets**: road cells reachable from the node along the road network within 4 cells (hamlet 2).
  - **ring 1** (flat at node level by the roads contract): the free cells become the centre — the **well** (square),
    the **tavern**, a **market** or **church** (degree ≥ 4: both) — all with the door toward the crossing.
  - **lots**: free, flat cells next to a flat street cell at the same level (no ramps, bridges, water, coast, rock,
    mountain, lake, river corridor (`inRiverCorridor`), reserved) → houses (home_A 58 % / home_B) whose door faces that
    street edge (the street cell nearest the centre if several). Dense core (dist ≤ 2: all lots), thinning outward
    (dist 3: 85 %, 4: 50 %, 5: 25 %), 10–14 lots per village.
  - **edge roles**: lumbermill on the outer lot next to the most forest potential (≥ 0.42), blacksmith on the outermost
    remaining lot (village entry), church on a ring-2 lot when the centre has none (45 %), a house under construction
    (`building_stage_B/C`) on a fringe lot in 40 % of villages.
  - **fields**: 1–2 clusters of 3–5 `building_grain` cells on the fringe (free, same level, touching the village,
    clusters spread apart); **windmill** next to the first cluster, on a street when possible, else its door turned to
    the nearest street. Low **stone walls** (`fence_stone_straight`) around fields (not toward other fields / buildings;
    one opening toward a street), and back-garden walls (back + back corners, ≥ 2 segments) on half of the home lots.
  - **colour**: one family per village. 4-colouring of the macro-node lattice ((i + 2j) mod 4, per-seed permutation)
    → neighbouring villages never share a colour.
  - Writes `cell.village {id,color,role}`, `cell.building {asset,rotY}`, `cell.reserved` (buildings + well),
    `cell.forest = 0`, tags `village`, `bld:<type>`, `door:<d>` (not on the well), `square` + `well` + `toward:<d>` (well
    cell; d = edge toward the crossing), `field`, `fence:<d>`. Never writes to road / river / bridge / water / coast /
    ramp / reserved cells (rivers at stage 4 route around village cells).
- **Rendering** (`render.ts`) per chunk from the final cells: building on the tile top (y = level·LEVEL_H, flat cells
  only → flush, no float / sink), shifted 0.75 m toward the street it faces (front yard + back garden); the well
  2.25 m toward the crossing; grain overlay (height ×0.48 → ~1.4 m crop); stone walls on hex edges (length = one edge,
  height ×0.55 → 1.1 m, thickness ×0.6). All through `out.add` → merged per material with the chunk (+0 draw calls
  beyond the hex atlas mesh; measured 150–220 draw calls for the whole showcase).
- **Colliders**: per building type, fitted once from the geometry (`fitBoxes`): 0.4 m column heightmap of everything
  below 2.6 m (eaves/roofs/sails excluded), interior flood-filled, greedy-merged into boxes — walls ≥ 1.25 m → solid
  boxes up to 75 % of the model height; lower columns (stairs, plinths, crates) → boxes of their own height, so stairs
  are steps (0.15 m quantised). ~19 boxes per building, colour variants share the fit. Walls: one thin box per segment.
  `?vcol=1` draws all village collider boxes as magenta wireframes.

## Door direction table (measured, `?showcase=villages&view=doors`, presets `villages.door_row0..18`)
Every type × 6 rotations (k·60°) on floating tiles, seen from +Z. All used models have their door / open front on
**local +Z** at rotation 0 (a hex *corner* direction in our pointy-top grid). OUR angle of local +Z = −90°, so a door
facing edge d needs `rotation.y = d·60° + 90°` (`rotForDoor`).

| type | door / front at rot 0 | notes |
|---|---|---|
| home_A | +Z | door in the gable end, chimney on the back gable |
| home_B | +Z | door + side stairs on the +Z facade |
| tavern | +Z | door + stairs under the barrel |
| blacksmith | +Z | open forge + workshop door |
| market | +Z | awning / stalls |
| church | +Z | tower door |
| well | +Z | crank side (nearly symmetric) |
| windmill | +Z | door + sails |
| lumbermill | +Z | door + stairs |
| mine, castle, barracks | +Z | (not used) |
| watermill | wheel on +X | not used: rivers are stage 4, unknown at stage 3 |
| stage_B / stage_C (neutral) | +Z | construction sites |

## Public API (`api.ts`, pure) — shape of round 1 kept, fields added
- `villagesNear(seed, q, r, radius): VillageInfo[]` (nearest first), `nearestVillage(seed, q, r, radius = 60)` (prefers
  a real village over a hamlet), `villageAt(seed, q, r)`, **`villageItemsAt(seed, q, r)`** (exact world poses).
- `VillageInfo = { id, kind, centre:{q,r}, world:{x,y,z} (crossing), level, degree, color,
  cells:[{q,r,role,type,asset,rotY,door,face,field,square,fences, items:[{type,asset,world:{x,y,z},rotY,door,face}],
  garden, plaza}], doors:[{q,r,d,type,world}] (ground point just outside each door), well:{q,r,world}|null,
  fields:[{q,r}], windmill:{q,r}|null, streets:[{q,r,ds}], plaza:{q,r,toward}|null, spawn:{world,heading}|null }`.
- **Building poses**: buildings are no longer at the cell centre (+ round-1 STREET_SHIFT): use `items[].world` /
  `villageItemsAt` (model origin, rotY). `STREET_SHIFT` stays exported only for compatibility and is NOT the pose.
- `spawn.heading` = atan2(dx, dz) toward the centre → `player.spawn(x, y + 0.2, z, heading)`. Props: keep that street
  cell clear.
- Service `villages`: `{ villagesNear, nearestVillage, villageAt, villageItemsAt, stats }`. In-page `window.__villages`
  adds `census(R)` (incl. footprint overlaps, min spacing) and `find()`.
- Cell tags: `village`, `bld:<type>`, `door:<d>`, `square`/`well`/`plaza`/`toward:<d>`, `field`, `garden`, `fence:<d>`.

## Showcase
`/?showcase=villages` (uses terrain, roads, nature; each optional) — the real streamed world, load radius 260 m.
Presets (deterministic search from the origin): `villages.overview`, `centre`, `street` (eye height on a flat street
cell 2–3 out, looking at the crossing), `fields`, `spawn` (nearest village or hamlet), `door`, `well`, `wall`, `top`,
`type_<t>` (first building of type t), `door_row0..18` (door rig, `&view=doors`).

## Measured (round 4, radius 60 cells ≈ 2.14 km²)
| seed | villages | hamlets | buildings/village (min–max) | overlaps |
|---|---|---|---|---|
| 1337 | 7 | 12 | 16.7 (11–21) | 0 |
Seeds 42 / 7 shot (see evidence), 0 console errors; showcase 166–173 draw calls, 0.57–0.73 M triangles, 61 fps.
Evidence: `tools/out/villages/r9a_s{1337,42,7}__villages.top.jpg` (door arrows), `r9_s{1337,42,7}__villages.*.jpg`.

## Assumptions / known issues
- Watermill unused (rivers are decided at stage 4, after villages). Mine/barracks/towers/castle unused.
- Stone wall + grain field are scaled in height (documented exception like HEX_PROP_SCALE): the KayKit wall is 2 m
  high / 1.5 m thick and the grain 2.95 m tall at HEX_SCALE.
- Lots only on cells touching a street → cells between two arms but not on a street stay open grass (nature may put
  lone trees there).
- A lot touching the street along 2–3 consecutive edges faces the middle of that run (a half-step rotation toward
  the shared corner); `door:<d>` then names the run's first road edge, `face` in the API has the exact facing.
- Village layouts depend on the roads module's network; when roads changes its node graph the villages move with it.
