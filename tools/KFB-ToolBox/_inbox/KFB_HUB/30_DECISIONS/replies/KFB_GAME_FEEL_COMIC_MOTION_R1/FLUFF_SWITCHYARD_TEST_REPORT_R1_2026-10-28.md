# Fluff Switchyard · R1 source and logical scenario tests · 2026-10-28
**Mode:** design/source and abstract graph assertions. NO gameplay/runtime/browser/3D/physics/visual-source isolation/site publication.
**Design owner:** WS0 / KFB Game Feel PR #435. **Productive receiver:** existing WS1/WS1b R3F, per V-228.

## Actually verified this conversation
1. Three KayKit author's itch.io pages individually opened: Platformer FREE CC0 (120+ unique, buttons/ramp, EXTRA-only conveyors/traps), Prototype Bits FREE CC0 (64+), City Builder Bits FREE CC0 (32+). Source URLs and tier limits explicitly documented in concept; downloadable source binaries not fetched.
2. Current `registry/assets/v1/packs/index.json` searched: City Builder Bits found, 45 asset records; Platformer and Prototype Bits not present by those pack IDs. Kenney Factory Kit 3.0 148, Kenney Prototype Kit 74, KayKit BlockBits 44 verified. This is a registry snapshot, not a claim a separate paid pack isn't stored somewhere else.
3. Read `registry/assets/v1/packs/kaykit-city-builder-bits-1-0-free.json` and `kenney-factory-kit-3-0.json`: **11/11 exact intended source asset IDs exist** (five City Builder and six Kenney Factory). No file-byte/mesh loading or visual donor audition.
4. Read existing Dungeon S13.2 `lib/dungeon-grid.js`, WhackMan `wm-maze.js`/`wm-pursuers.js`, Seed World `sw-destruct.js`, modular Minigame Hub and in-scene editor SSOT, and current PR #435 Cascade Sphere/Mech/OSM source continuity. These are reuse candidates; actual module behavior not re-run this slice.
5. `FLUFF_SWITCHYARD_THREE_LEVEL_RECIPES_R1.json` validated with a local in-tool deterministic directed-graph BFS against source/goal/switch predicates. **21/21 graph assertions PASS** (7 per level: unique node IDs, valid edge endpoints, source and goals exist, initially blocked, two distinct authored action sequences each reach all sink goals, all action state keys declared). This is **NOT** a proof those player actions can physically be reached or performed.
6. All 3 new concept/source/recipe files were read back exactly after creation; JSON parse 2/2 PASS.

## Hard boundaries
- No source objects isolated in an actual 3D viewer; no selected final pack model scales/pivots; no transformed Maze mesh or shaders; no opening a Site; no third-person Mech pilot or grappling runtime; no actual enemy/bunny/Fluff instance performance measurements; no physics tests.
- No Maze renderer/solver implemented in WS1, no damage/Save/Combat integration and no accepted Card grant. Canonical Fluff cure-color rule q103 OPEN.
- Avoid counting prior Seed World POC test results or frozen Dungeon E1 20/20 as newly executed tests. Current WS1b head and host import contract not verified in this slice.
- R3 conceptual target times 90–150/150–210/180–240 seconds and 50–200 possible visual instances are **design budgets**, not game performance.

## Source and control state
Original code and visual source identities remain in existing KFB Registry/owners; three external CC0 FREE KayKit pages only serve as candidate acquisition. Shared in-scene editor owns transforms only, Dungeon/WhackMan are algorithmic donors, Combat Arena/WS1 remain active gameplay owners. No new runtime owner, Standalone Site, Stage route, Hub card, auto merge or Live.

## One next gate
`WS0_SWITCHYARD_SOURCE_ISOLATION_AND_WS1B_RECEIVER_TRIAGE`: source-render exact 5–8 chosen 3D models from existing City Builder/Factory plus any newly acquired KayKit Platformer/Prototype FREE models, measure real pivots and grid footprints; read true WS1b working branch/Return; greenlight ONE L1 switchyard 90–150 s with actual packet movement, one real switch, two solvable routes, true collision and one durable local outcome before adding L2/L3.
