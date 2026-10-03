# R2D v0 → Procedural Test World · integration note

## Decision
R2D v0 is now the visual/world-shape donor for the future locomotion playground.

The standalone Claude Design renderer is **not** booted inside WB2.

## Source proof
Exact donor on current main:
- `tools/KFB-ToolBox/_inbox/KFB World Core R2D v0 Insel/kfb-r2d-session-2026-10-03/KFB_R2D_v0/island.js`
- blob `6952697d7d3c9cd159ac3fdd924f24fa333c904d`
- Return: sibling `RETURN.md`

Donor result:
- continuous visible island body, no visible tiles/columns;
- Track Core road;
- free outline default;
- Teich/Bach/Schlucht/Wasserfall;
- figures intentionally absent;
- several presentation items remain TUNE.

## Current WB2 integration
Stable extracted module:
`r2d-island-core.v1.js`

It contains the donor-derived:
- deterministic island plan;
- free/hex outline;
- Track Core route recipe;
- pads/plazas/paths;
- pond/creek/canyon plan;
- shared `heightAt`, `maskAt`, `weightsAt`.

It contains **no renderer, scene, camera or frame loop**.

World provider:
`world-integration-01/r2d-world.js`

It:
- consumes Track Core at the donor pin;
- feeds R2D height/masks into WB2 terrain/collision truth;
- mounts the Track Core road into the existing WB2 scene;
- keeps legacy `wi1-play` off.

## Current visual boundary
This is the first **R2D heightfield adapter**, not yet full standalone-R2D visual parity.

Still to migrate additively into WB2:
1. actual floating underside/body geometry;
2. pond + creek water surfaces;
3. waterfall;
4. source-proven R2D nature grouping;
5. current B2/building-family owner instead of donor building_A.

No second renderer or world owner may be introduced to close those gaps.

## Playground consequence
After the central Motion SSOT neutral prototype receives Georg visual PASS, its player consumer attaches here rather than to Travel Globe.
