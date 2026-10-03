# R2D v0 → Procedural Test World · integration note

## Decision

R2D is the visual/world-shape donor for the future KFB movement/combat playground.

The standalone Claude Design renderer is **not** booted inside WB2.

Travel Globe is **not** the neutral test host.

## Source proof

Exact R2D donor:
- `tools/KFB-ToolBox/_inbox/KFB World Core R2D v0 Insel/kfb-r2d-session-2026-10-03/KFB_R2D_v0/island.js`
- blob `6952697d7d3c9cd159ac3fdd924f24fa333c904d`

## Current WB2 integration

Pure R2D world-data owner:
`r2d-island-core.v1.js`

It contains:
- deterministic island plan;
- free/hex outline;
- Track Core route recipe;
- pads/plazas/paths;
- pond/creek/canyon plan;
- shared `heightAt`, `maskAt`, `weightsAt`.

It contains no renderer, scene, camera or frame loop.

World provider:
`world-integration-01/r2d-world.js`

WB2 currently consumes that data for:
- continuous island terrain;
- floating underside;
- Track Core road;
- pond / creek / waterfall;
- P1/P2 procedural nature groups;
- current B1 building-family/facade owner on generated building pads.

## Building owner

Adapter:
`r2d-buildings.v1.js`

It does not invent a new building grammar.

It uses:
- exact B1 sibling donors from `fixtures/huerth-b1-siblings-v0.json`;
- existing `wd1-city.js / buildCityLayer()`;
- existing `kfb-facade-rule-v1`;
- existing support records.

Seed 3 currently yields one valid generated building pad.
The browser-proven result is:
- 1 placed source-proven building;
- 14 windows;
- 1 door;
- remaining donor family members explicitly unplaced.

The procedural plan is not modified merely to satisfy a fixed building-count test.

## Browser proof

Tested runtime head:
`a18846cf8128e3e1facb0b51be0e6aff873d1244`

- workflow `37092514335` PASS;
- job `111115656852`;
- artifact `11263101899`;
- 0 console errors;
- 0 page errors;
- 0 QA problems.

## Future consumer boundary

After the central Motion SSOT neutral prototype receives Georg visual PASS, its player consumer attaches here.

World facts already exposed:
- spawn;
- `baseHeightAt`;
- `groundAt`;
- `solidAt`;
- `buildingAt`;
- Track Core route/support.

Future Motion/Drive/Combat consumers read those facts.
They do not create a second world renderer, terrain owner or collision truth.

## Why Travel is not used

Travel mixed:
- historical world prototype;
- cards;
- Ground;
- Flight;
- WorldBuilder lifecycle;
- mobility experiments.

Its main/default line stayed stale while newer capabilities lived on branches.
Cards were additionally coupled to a Flight/Sky artwork pump.

The new procedural world deliberately contains none of that host baggage.

## Next

Extend the same current WB2 world to a small connected multi-island corridor using R2D + Track Core.

No Player/Drive/Combat yet.
