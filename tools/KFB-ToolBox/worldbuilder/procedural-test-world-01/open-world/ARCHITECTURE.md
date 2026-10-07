# ARCHITECTURE · KFB Open World

Third-person, endless, seeded hex-world game. three.js + Rapier (`@dimforge/rapier3d-compat`) + Vite, TypeScript, static build. All art: KayKit CC0 packs listed in `ASSETS.md`.

## 1. Units and conventions

| Thing | Value |
|---|---|
| Unit | 1 = 1 metre, +Y up, right-handed, camera-forward of the spawn is −Z |
| Hex grid | pointy-top, axial `(q, r)`; KayKit tile = 2 × 2.309 asset units |
| `HEX_SCALE` (hexagon pack → metres) | **7.5** → hex is 15 m flat-to-flat, circumradius 8.66 m; house door ≈ 2.4 m ≈ 1.25 × Knight (measured in `?showcase=assets`, preset `assets.door`) |
| `LEVEL_H` (one terrain height step) | 0.5 asset units × 7.5 = **3.75 m** (matches `*_sloped_low`; `*_sloped_high` = 2 steps) |
| `CHAR_SCALE` (adventurers → metres) | **0.75** → Knight ≈ 1.9 m incl. helmet |
| `FOREST_SCALE` (forest nature pack → metres) | **2** → Tree_1 ≈ 8 m |
| Chunk | 8 × 8 hexes in axial parallelogram space (`CHUNK = 8`) |

All constants live in `src/core/units.ts`. Nothing else hard-codes a scale.

Hex directions (edge index `d`, pointy-top, axial):
`0 E (+1,0)`, `1 NE (+1,−1)`, `2 NW (0,−1)`, `3 W (−1,0)`, `4 SW (−1,+1)`, `5 SE (0,+1)`.
Edge `d` faces world angle `θ = d·60°` measured from +X toward −Z (= three.js `rotation.y`; NE points to −Z), i.e. counter-clockwise seen from above. `rotationForEdge()` in `src/core/hex.ts` is the only place that converts edge indices to Y rotations.

## 2. Determinism

- One world seed (`?seed=` URL param, default `97` (123 until integration round 2, then 50; re-chosen after each world change by a full rescan + real-input A1 check) — chosen by the demo scorer for the best spawn village/route). All randomness via `src/core/rng.ts`: `hash(seed, …ints)` → uint32, `rand01(seed, …)`, `mulberry32(seed)`, seeded 2-D value/simplex noise. **`Math.random` is forbidden in world code** (allowed only for purely visual, non-persistent effects such as particle jitter).
- World features are pure functions of `(seed, q, r)` or of a macro-region key derived from them, so content continues seamlessly across chunk borders and is identical on reload.
- Multi-cell features (roads, rivers, villages) are computed per **macro region** (a coarse jittered grid of nodes), cached, and queried per cell. Any cell can be asked about at any time in any order.

## 3. Folder layout and ownership

```
src/
  core/                      # INTEGRATOR ONLY
    units.ts rng.ts hex.ts events.ts
    world.ts                 # WorldModel: layered, memoised CellData
    chunks.ts                # ChunkManager + ChunkBuilder (merging, colliders)
    physics.ts               # Rapier world wrapper
    engine.ts                # renderer, scene, loop, module host (error isolation)
    debug.ts                 # window.__kfb verification API
    types.ts                 # all shared interfaces
    main.ts                  # bootstrap, mode selection (game / showcase)
  modules/
    assets/                  # wave 1  AssetLibrary, manifest, material policy
    terrain/                 # wave 1  height/biome layer, hex tiles, coast, water, terrain colliders
    environment/             # wave 1  sky, sun, hemisphere light, fog, shadows, time of day, tone mapping
    character/               # wave 1  Rapier capsule controller, animation state machine, character switching
    camera/                  # wave 1  third-person orbit camera, collision, zoom, presets
    roads/                   # wave 2  road + river networks, road/river tiles, bridges
    villages/                # wave 2  village sites at crossings, buildings facing roads, wells/squares
    nature/                  # wave 2  forest clusters, single trees, bushes, rocks, grass
    props/                   # wave 2  props at doors, wells, fields, crossings
    streaming/               # wave 3  load radius, build budget, LOD/culling, perf HUD
    demo/                    # wave 3  spawn village, tuned demo route, final game mode
tools/                       # verification loop (shoot.mjs), asset copy, env
docs/ reference/ evidence/ STATUS.json
public/assets/               # copied KayKit files only (see ASSETS.md)
```

A builder agent edits **only** its `src/modules/<name>/` folder (plus its own showcase). Changes to `src/core/`, `package.json`, `index.html`, `tools/` go to the integrator as a written core-change request.

## 4. Shared world data model (`src/core/types.ts`)

```ts
interface CellData {
  q: number; r: number;
  level: number;                 // integer height step; top of tile at y = level * LEVEL_H
  biome: 'grass' | 'forest' | 'hill' | 'mountain' | 'water';
  water: boolean;                // lake/sea cell (tile surface below land)
  coastMask: number;             // 6-bit: neighbour d is water (on a land cell)
  slope: { dir: number; steps: 1 | 2 } | null;   // ramp rising toward edge dir
  roadMask: number;              // 6-bit edges with road
  riverMask: number;             // 6-bit edges with river
  bridge: boolean;               // road crosses river here
  village: { id: string; color: 'blue'|'red'|'green'|'yellow'; role: 'centre'|'lot'|'edge' } | null;
  building: { asset: string; rotY: number } | null;
  reserved: boolean;             // something solid owns the cell (building, well, bridge)
  forest: number;                // 0..1 density (nature layer)
  tags: string[];                // free-form hints for later layers, e.g. 'field', 'square', 'door:3'
}
```

Layers, in order. **Each layer may only place things where earlier layers allow.**

| # | Layer (module) | Writes |
|---|---|---|
| 1 | `terrain` | `level`, `biome`, `water`, `coastMask`, `slope`, base `forest` potential |
| 2 | `roads` | `roadMask`, `slope` along roads (ramps), road may not enter water |
| 3 | `villages` | `village`, `building`, `reserved`, tags `square`, `field`, `door:<d>` |
| 4 | `roads` (rivers part) | `riverMask`, `bridge` (river never cuts a village cell; bridge only where it meets a road). **Rivers are endless meandering lines (no springs, no mouths)** running inside a valley corridor that terrain guarantees at stage 1 (`riverCorridor()` in `src/modules/terrain/api.ts`: single level along its length, no lakes within 2 cells). Decision 2026-10-06 after three failed critic rounds on composed spring/mouth tiles. |
| 5 | `nature` | `forest` final density (0 on roads/villages/water) |
| 6 | `props` | nothing in the model; places props only on tagged cells (doors, wells, fields, crossings) |

API (`src/core/world.ts`):

```ts
world.registerLayer(layer: WorldLayer)          // core wires modules' layers in the order above
world.cell(q, r): Readonly<CellData>            // final cell (all layers)
world.cellAt(stage, q, r): Readonly<CellData>   // cell after layers < stage (for layer code)
world.heightAt(x, z): number                    // ground height at world xz (tile top, slope aware)
world.seed
```

`WorldLayer = { id; stage; apply(cell, ctx) }` where `ctx` gives `seed`, `cellAt(q,r)` (earlier stages only) and region caches. Layers are pure; memoised per stage.

## 5. Chunks and rendering

- `ChunkManager` (core) loads/unloads chunks around a focus point; `streaming` tunes radius/budget/LOD through `chunks.configure()`.
- Each static module implements `buildChunk(chunk, out: ChunkBuilder, ctx)`. `ChunkBuilder.add(assetId, matrix)` collects instances; at the end the builder **merges all instances per material** into one mesh per chunk per material (KayKit packs share one atlas each), so a chunk costs ~3–6 draw calls. `out.addInstanced()` exists for very frequent small meshes (grass) and `out.addObject()` for special cases (water shader).
- Colliders: `out.addCollider(desc)` (Rapier collider desc, fixed body per chunk). Collision groups in `src/core/groups.ts`: `WORLD_GROUPS` for solids, `PLAYER_GROUPS` for the capsule, `PLAYER_ONLY_GROUPS` for invisible player blockers. **Foliage does not block the camera** (decision 2026-10-06): tree crowns and bushes are not camera colliders; instead the nature module's foliage shader dithers out fragments near the camera and inside the camera→player line (services `player`, `cameraRig`), so the camera never dips under crowns and the character stays visible. `CAMERA_ONLY_GROUPS` remains for genuine camera blockers only. Terrain adds hex prism hulls; buildings add boxes; trees add trunk cylinders. Bushes, grass and small props are not solid.
- Each module's `buildChunk` runs in `try/catch`; a throw logs one `console.warn` prefixed `[module:<id>]`, marks the module degraded in `__kfb.stats().modules`, and the chunk still builds with the other modules' content.

## 6. Runtime modules and events

```ts
interface GameModule {
  id: string;
  layer?: WorldLayer;
  init?(ctx: CoreContext): Promise<void> | void;
  buildChunk?(chunk: ChunkInfo, out: ChunkBuilder, ctx: CoreContext): void;
  update?(dt: number, ctx: CoreContext): void;
  showcase?(ctx: CoreContext, params: URLSearchParams): Promise<void> | void;
}
```

`CoreContext` exposes `three` handles (`renderer`, `scene`, `camera`), `world`, `physics`, `chunks`, `assets`, `events`, `input`, `services` (a typed registry where modules publish APIs, e.g. `services.get('player')`).

Events (`src/core/events.ts`, typed):

| Event | Payload | Emitted by |
|---|---|---|
| `ready` | — | core, after spawn chunks are built and first frame rendered |
| `chunk:loaded` / `chunk:unloaded` | `{cx, cz}` | core chunks |
| `player:moved` | `{pos, vel, grounded}` | character |
| `player:gait` | `{gait}` | character |
| `player:switched` | `{name}` | character |
| `time:changed` | `{hours}` | environment |
| `module:error` | `{id, error}` | core |

Services published: `assets` (core-provided AssetLibrary from `modules/assets`), `player` (character), `cameraRig` (camera), `environment`, `streaming`.

## 7. Modes and verification

- `/?` normal game (demo world, spawn village).
- `/?showcase=<module>` stages only that module (plus terrain + environment when needed). Each module's `showcase()` builds its stage and sets a sensible default camera.
- `window.__kfb` (`src/core/debug.ts`): `ready`, `errors[]`, `stats()` (fps, drawCalls, triangles, chunks, modules state), `setCamera(preset | {target, yaw, pitch, dist})`, `setTime(hours)`, `player()`.
- `tools/shoot.mjs` (Playwright + system Chrome, WebGL on GPU): loads a URL, waits for `__kfb.ready`, applies camera presets / time, writes `PNG` + `JSON` log (console errors, fps, draw calls), and can drive **real keyboard/mouse input** from a script and record a video. See `tools/README.md`.
- Rule: nobody claims anything they have not screenshotted and looked at.

## 8. Performance budget

≥ 50 fps at 1920×1080 on a recent MacBook; ≤ 800 draw calls (target ≤ 300); ≤ 1.5 M triangles visible; chunk build ≤ 6 ms per frame (time-sliced); shadow map 2048, one directional light following the player; fog hides the load edge. `__kfb.stats()` reports it, the critic checks it.

## 9. Asset policy

Only the KayKit packs named in the spec. Only used files are copied to `public/assets/<pack>/…` by `tools/copy-assets.mjs`; `ASSETS.md` lists each with its source path. Per-pack scale factors (§1) are applied in the AssetLibrary, never ad hoc.

## 10. Failure isolation

- Retry signals: a layer (or code it calls) may throw an object with `kfbRetry === true` (`isRetrySignal()` in `src/core/world.ts`) meaning "not computable right now" (roads' prefetch-step `Missing`). The world model rethrows it without memoising or disabling the layer; modules that catch errors around world/roads queries must rethrow it (villages does). Fixed 2026-10-06 after villages cached transient failures as "no village".


- Module `init` failure → module disabled, warning, game continues.
- `update` throw → caught per frame, module disabled after 3 consecutive throws.
- Missing asset → AssetLibrary returns `null`; callers skip the placement. No placeholder boxes in the game build.
