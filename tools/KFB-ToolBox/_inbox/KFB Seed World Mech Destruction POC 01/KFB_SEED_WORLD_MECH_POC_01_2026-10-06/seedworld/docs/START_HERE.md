# START HERE · KFB Seed World Mech Destruction · POC 01 · updated 2026-10-06 r2

**RESEARCH PLAYGROUND · NOT WORLD STUDIO · NOT COMBAT ARENA**

Open `KFB Seed World Mech Destruction POC 01.dc.html` in a top-level browser tab (Chrome). It needs `support.js` and `seedworld/` next to it; three.js 0.170 and the pinned KayKit assets load from jsDelivr. Single-file version: `export/KFB Seed World Mech Destruction POC 01 · standalone.html` (still online for three.js and models).

Current state, controls and open points: **`HANDOVER_2026-10-06_r2.md`**. Integration into KFB Open World: **`INTEGRATION_OPEN_WORLD.md`** + **`MODULE_CONTRACTS.json`**.

## UI
- 3D fills the window. Menu top left: **Mech / Welt / Diagnose**. `?` or H key: controls.
- While playing only mode + speed (bottom centre) and the action bar (occupied slots only).
- F1: metrics (off by default). Diagnose → Checks / Bench / Sources open as a side panel; Download saves benchmark + checks JSON.

## Files
| File | Owns |
|---|---|
| `seedworld/sw-gen.js` | seed paths, terrain, settlements, street graph, blocks, parcels, BuildingRecipes, vegetation, chunk recipes (pure) |
| `seedworld/sw-mesh.js` | recipe → LOD0–3 geometry, road ribbons, deformation field, destruction cells, rubble, chunk compile (pure) |
| `seedworld/sw-worker.js` | chunk compile in a module worker (same source) |
| `seedworld/sw-world.js` | shared clay material, ring streaming, integration queue + budget, hit tests, collision |
| `seedworld/sw-destruct.js` | promotion, cells, support cascade, pools, compact damage state |
| `seedworld/sw-mech.js` | sole player-transform owner: modes, locomotion ladder, camera, input, weapons |
| `seedworld/sw-fx.js` | weapon FX pools |
| `seedworld/sw-app.js` | renderer, loop, sun/shadow, metrics, gates, checks T1–T13, bench A–E |
| `seedworld/sw-bundle.js` | generated standalone bundle; rebuild after code changes (HANDOVER r2 §6) |

Then `ARCHITECTURE.md`, `PERFORMANCE_BUDGET.md`, `TEST_REPORT.md`, `CHANGELOG.md`. `RETURN.md` and `HANDOVER_2026-10-06.md` are history.
