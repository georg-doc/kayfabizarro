# ARCHITECTURE · Seed World POC 01

## Seed → world
```
CARD / WORLD SEED (uint32)
  derive(seed, path) = FNV-1a(`${seed}|g1|${path}`)            world-kernel convention
  world:<seed>/type                → one of 5 settlement types (giebelstadt, machiya, adobe, toytown, werkhafen)
  world:<seed>/params              → terrain amplitude, density, height factor, road curvature, rhythm, vegetation
  world:<seed>/terrain/band:k      → 4 value-noise bands (460 / 190 / 70 / 17 m)
  world:<seed>/settlement:s<i>_<j> → one site per 700 m cell (main town at the origin), centre, radius, rotation, block size, warp
  world:<seed>/street:<s>.P0|P1|u<k>|v<k>   primary axes leave town as paths; secondary grid inside the town boundary
  world:<seed>/district:<s>.core|mid|edge
  world:<seed>/block:<s>.<i>.<j>   → square / yard / built (density falls with distance; squares near the centre)
  world:<seed>/parcel:<s>.<i>.<j>.<edge>.<k>     rows along both long block edges; dense rows → party walls
  world:<seed>/building:<s>.<i>.<j>.<edge>.<k>   BuildingRecipe
  world:<seed>/vegetation:<cx>,<cz>              trees + bushes in yards, courtyards, countryside forest noise
  world:<seed>/chunk:<cx>,<cz>                   chunk recipe = buildings by centroid + trees
```
Streets curve because the whole settlement grid is warped by a smooth sine field (inverted by fixed-point iteration for queries). Roads are ribbon meshes built in warped local (u,v) space every 2 m (walk +0.05 m, road +0.09 m, path +0.07 m, × (1 + LOD)); a segment belongs to the chunk holding its midpoint. (r1 used terrain vertex colours; replaced 2026-10-06.)

## BuildingRecipe
`id, parcel, seed, settlement, district, role (residential/shop/industrial), corners[4] (front first), floors, floorH[], height, sides[4] {kind street/side/party/back, len, bays}, entranceBay, roof {gable/hip/flat/shed/sawtooth, h, ov, parapet, chimney}, wall/roof/trim/door colour, deform {twist, lean, wob, ph}, hp {wall, corner, roof, slab}, baseY, chunk`.
Bays use the donor rule `floor((len − 2·margin − w)/spacing) + 1`. The ridge runs parallel to the street side.

## One recipe, five representations
| LOD | Built from the same recipe |
|---|---|
| 0 combat/close (ring 1) | wall grid per bay × half floor, ledges, instanced windows/doors/chimney, 6 roof tile rows, roof thickness |
| 1 street (ring 2) | wall grid per bay × floor, simple window instances, 3 roof rows |
| 2 district (ring 3) | 2-row deformed shell, single roof surfaces, no openings |
| 3 skyline (rings 4–5) | one quad per wall, simple roof |
| destructible-local | `cellsFor(rec)`: corner columns + wall cells (floor × bay, top floor includes parapet) + 2 slabs per floor + roof sections (+ gable ends) |

All of them pass through `deformer(rec)`: cumulative torsion `twist·(y/H)^1.35`, quadratic lean, small wobble, base anchored. Windows, roof, chimney and cells use the same field (LOOK-TORSION architecture, no second deformer).

## Rendering
- Per chunk: one merged mesh (terrain + skirts + all shells/roofs) and up to five InstancedMeshes (windows, doors, chimneys, trunks, crowns).
- Exactly one world material `KFB_SeedWorld_Clay`: vertex colour × instance colour × triplanar `clay_floor_001` microtexture (albedo + screen-space bump that fades out by 60 m). Terrain, roads, buildings, vegetation, cells, debris, rubble and dust share it. The mech keeps its KayKit materials; FX uses one additive material.
- Ring layout (Chebyshev, 64 m chunks): ring ≤1 LOD0, 2 LOD1, 3 LOD2, 4–5 LOD3 → 121 chunk slots, released at ring 7.

## Streaming
`request → worker compile (≤3 in flight) → result queue sorted by ring → integrate ≤3 per frame and only while the frame's integration time is under budget (4 ms default)`. Chunk slots (Group + Mesh) are recycled. Stale results (wrong seed or superseded job) are dropped. If the module worker never answers, the world falls back to a Blob module worker, then to one main-thread compile per frame.

## Destruction
```
INTACT_COMPILED ──projectile hits a building in a loaded chunk──▶ PROMOTE (≤4)
  hide its vertex range + instance ranges inside the compiled chunk (no rebuild)
  cells = cellsFor(recipe) (+ stored damage states if it was damaged before)
DESTRUCTIBLE_LOCAL
  Minigun: 1 hp per round on the hit cell → damaged at 50 % (tint, chips) → detached at 0
  Rocket: radius 5.5 m, 16 × (1 − d/r)^0.7 to every cell, outward impulse, hit-stop 75 ms, shake, flash
  support: walls/corners score 3 from below, −1 per lateral step; slabs need 2 supporters, roof/gable 1
  unsupported → clusters → 0.32–0.70 s anticipation (shake, sag, dust) → fall together
  debris pool 256 (retire oldest/smallest) → sleeps → static rubble ring 1000
DEMOTE (settled & > 210 m away, or the 5th building needs a slot, or the chunk unloads)
  store { 2-bit cell states, collapsed, rubble count, top } → chunk recompiles with damage (cells + deterministic rubble)
  live debris/rubble of that building released
```
Coarse collision: per-building OBB (top lowered for damaged buildings) + cell OBBs for promoted buildings + terrain height from the chunk grid.

## Player
`sw-mech.js` alone writes the player transform. Weapons call `impulse()`; recoil (0.06 m/s per round, 1.4 m/s per rocket salvo) is applied by the integrator.

Modes (one writer each): `flight` (Space/↑ climb, ↓ descend, ground contact → walk) · `walk` (ladder locomotion, Space jump, Space×2 or ↑ take-off) · `air` (jump arc, landing → walk).

Locomotion ladder `LOCO` (Rig_Medium @ b97b5ac5): roles idle / walk / run / sprint / back / strafeL/R / jStart / jAir / jLand with fades from the profile; world speed = nativeSpeed × body scale. Armed: chest subtree from Running_HoldingRifle, gun aligned along its barrel axis to the aim point.

Camera: rigid in the mech frame, only the boom length is smoothed. On occlusion the boom shortens and never lifts; minimum 70 % length. Tab = combat camera (mouse-look, LMB/RMB fire).

Integration into KFB Open World: see `INTEGRATION_OPEN_WORLD.md`.
