# KFB WorldBuilder · World Corridor 01

Status: **WC1 COST SPLIT MEASURED · CLAY PERF GATE OPEN · RUNTIME INTEGRATION NOT STARTED**
Date: 2026-10-01
Owner: existing KFB WorldBuilder / ToolBox world owner
Branch: `chatgpt-web/world-corridor-01-2026-10-01`
Stage route: **NONE** — no human/public gate yet.

## Outcome

Turn the current Claude Design island + sky cuts into one measured, real WorldBuilder integration corridor without creating another world, track, billboard, physics or environment owner.

The accepted intake is:
- current Hex-Archipel / island source: `KFB World Core R2C · Hex-Archipel Katalog`;
- current Skydome / Environment source: `KFB Skydome Gates SKY3`;
- existing Billboard scheduler/LOD cut is a later media donor;
- existing WB2 terrain/object editor remains the WorldBuilder host;
- existing Track Core remains the only track-frame/slot/check owner.

## Source cuts accepted for integration

### Islands / route-layout donor
`tools/KFB-ToolBox/_inbox/KFB World Core R2C · Hex-Archipel Katalog/WORLD_CORE_R2C_2026-10-01/`

Active source object:
`KFB World Core R2C · Hex-Archipel Katalog.dc.html`

Active module:
`lab-world/hex-archipel.r2c.js`

R2C facts retained:
- 4 main islands + 7 stepping islands;
- Burg → A → B → Loop → C → Burg;
- island-local instanced/batched catalog pieces;
- island route layout with minimum-radius / crossing checks;
- current visual result is candidate, not a new WorldBuilder or Track SSOT;
- representative M1 Max baseline and cost split are measured; Clay fragment/material work is the dominant current cost.

### Skydome / Environment donor
`tools/KFB-ToolBox/_inbox/KFB Skydome Gates SKY3/KFB_SKYDOME_SKY3_SESSION_CUT_2026-10-01_r1/`

Use:
- `lab-sky/env-host.v3.js`;
- `lab-sky/cloud-family.v3.js`;
- `lab-sky/spindle-sky.v5.js`;
- existing Travel day/night/weather/sky modules carried by that cut.

EnvironmentHost rule:
one host, one scene, one frame loop, one fog/day-night writer. The WorldBuilder calls `update(dt)` and `after()`; no second renderer or timer.

Cloud v3 remains **TUNE**, not Golden. It must be measured in the actual corridor at 0 / 4 / 12 / 24 clouds before adoption.

## Protected owners

### WorldBuilder
Current accepted WB2 terrain + object editor remains the receiving host:
`tools/KFB-ToolBox/worldbuilder/wb2-terrain-sculpt-01/WB2_TERRAIN_SCULPT_01_SOURCE.html`
accepted source pin: `8922d4b1329fbd47b8754db9dd04ca6b9eb0ee9e`.

WorldBuilder owns:
- scene document;
- terrain / surface editing;
- object selection / transform;
- save / reload;
- final world-height / chunk presentation.

R2C does not replace that owner.

### Track
Canonical track owner remains Track Core, current owner branch / review:
`georg-doc-patch-2@3232a1070686896833d6b7942fcd631b9fa8cda6`.

Verified integration snapshot on main:
`tools/KFB-ToolBox/_inbox/KFB_JOYRIDE_J14_CLAUDE_DESIGN_SESSION_CUT_2026-09-30_r1/lab-track/core/track-core.v012.mjs`
with `CORE_VERSION = kfb.track-core/0.12`.

R2C `buildTrack()` is therefore a **layout/input donor only**. It may produce island entry/exit intent or a route recipe, but it must not become a parallel track sweep/frame/check owner.

### Driving / movement
Race / current KFB drive owner retains vehicle contact, steering, drift, jump and driving physics.
WorldBuilder / Ground owner retains walk movement.
No corridor code may silently fork either loop.

### Billboard
Use the existing Billboard scheduler/LOD/content-provider seam from:
`tools/KFB-ToolBox/_inbox/KFB_WORLD_BILLBOARD_CLAY01_CLAUDE_DESIGN_SESSION_CUT_2026-10-01_r1/`.

For this corridor:
- baked/static card image provider first;
- scheduler decides update cadence;
- no PDF rendering in the frame loop;
- far billboards off;
- final billboard body styling remains separate from the corridor performance decision.

## Performance question this slice must answer

Do **not** decide Track vs Flight vs Portal from theory.

Measure the actual combined corridor additively:
1. R2C visual baseline;
2. Track Core adapter;
3. one driven vehicle + required physics;
4. cached/static billboards;
5. EnvironmentHost v3 with cloud series;
6. representative near-island props / one animated actor;
7. logical-world stress: 4 → 12 → 24 → 48 → 150 islands with Near / Mid / Far streaming.

Never render 150 full-detail islands simultaneously.

## Required measurements

Same counters at every step:
- fps;
- mean frame ms;
- p95 / p99 frame ms;
- draw calls;
- triangles;
- renderer geometries / textures;
- visible islands Near / Mid / Far;
- active track chunks;
- active colliders;
- active AnimationMixers;
- visible / updating billboards.

After 2–3 minutes traversal, unloaded geometry / textures / mixers must fall again; otherwise flag a streaming leak.

No separate dashboard is required. Use a compact debug line / existing HUD and machine-readable sample output.

## Representative local GPU measurement · no Cloudflare

The successful Georg-facing path is a **single self-contained HTML opened directly in Google Chrome by double-click / Open With**.

Rules:
1. no Terminal or local-server requirement for Georg when the candidate can be packaged as one HTML;
2. no unsigned macOS helper app or Gatekeeper bypass;
3. visible Chrome tab on representative hardware;
4. one-click Measure / automatic cost split;
5. Copy JSON / Download JSON;
6. persist returned JSON here before changing the source;
7. CI remains parity/syntax/boot evidence, not absolute FPS authority.

Cloudflare Stage is not needed for this local hardware gate.

The repository CLI/server helpers remain developer fallback only.

## Parallel Blender lane · GitHub only

Blender P0A is allowed to run in parallel with the Web Clay-performance gate.

Read:
`CLAY_PERF_P0A_GITHUB_HANDOFF_2026-10-01.md`

Blender return channel:
- repo: `georg-doc/kayfabizarro`;
- base: `d78009c2de75b85a20060485cb591282aaf3cf54`;
- branch: `blender-mcp/clay-perf-p0a-2026-10-01`;
- return folder: `tools/KFB-ToolBox/_inbox/KFB_CLAY_PERF_P0A_BLENDER_2026-10-01/`;
- Draft PR to `main`, no merge.

No Site / Production Control / Cloudflare dependency is required for Blender P0A.

This parallel lane does not change the World Corridor next gate below.

P0A return is now present on Draft PR #309 / `93af8caef6a85caa1f7fd70a59abb46edf85f0a4`.

Intake classification:
- **PASS as offline bake mechanism / K2_STAGE_BAKED_LITE reference**;
- scale `3.2 / 1.65 = 1.939394...` confirmed;
- **not parameter-identical to the current WC1 parity shader**.

P0A used Tools 1 / Legacy 0 / Mottle .04 / LodK .6 / Stroke .7.
Current WC1 parity uses Tools 0 / Legacy 1 / Mottle .05 / LodK 1.0 / Stroke .55 plus PrintOn 1 and parity fingerprint LOD gating.

Do not request an immediate rebake. Finish `WC1-CLAY-PERF-01`, pin the optimized procedural state, then decide whether the final baked candidate should be regenerated from that exact state.


## Exactly one next gate

**WC1-CLAY-PERF-01:** profile the active K1-parity K2/v10 Clay fragment path using bounded feature toggles on the same exact source/camera, then optimize only what can preserve the locked K1/H0 Golden appearance. Do not add Track/Vehicle/Billboard/SKY runtime in this gate.


## WC1 stop-rule note

GitHub/SwiftShader absolute performance was stopped after two passes. Source rehome is 10/10 byte-identical PASS. Read `FAILURE_RECOVERY_WC1_BASELINE.md`; do not tune the hosted-runner threshold and the representative cost split is now captured. Do not add Track/SKY/Billboard until `WC1-CLAY-PERF-01` identifies and repairs the dominant Clay cost without breaking Golden parity.


## 2026-10-01 · M1 Max baseline measured

Two visible 10 s measurements are persisted in `evidence/WC1_GPU_BASELINE_2026-10-01.json`: ~29 fps in both the InstancedMesh signature (179 calls / 89 geometries) and individual-mesh signature (868 calls / 459 geometries). Nearly 5× draw-call/geometry growth produced no material frame-time penalty. Therefore Hex instancing is not the dominant current bottleneck. Current next gate: `WC1-COST-SPLIT` using only existing clay/cloud/shadow/pixel-ratio toggles before Track Core integration.


## 2026-10-01 · Cost split measured

Mode B baseline: 30.3 fps / 32.96 ms. Clay off: 90.2 fps / 11.09 ms (**−66.4% frame time**) with identical 179 calls / 414,758 triangles. Clouds off: −12%. Shadows off: no useful gain despite roughly halving calls/triangles. Pixel ratio 1: −22.5%.

Conclusion: Clay fragment/material work + pixel footprint are the dominant current bottleneck. Hex instancing is not. Evidence: `evidence/WC1_COST_SPLIT_2026-10-01.json`.

Current Clay authority is PR #301 / `work/clay-style-ssot-2026-10-01`: K1/H0 v8 visual Golden; K2/v10 implementation baseline only with Golden parity.
