# KFB WorldBuilder · World Corridor 01

Status: **WC1 SOURCE REHOME COMPLETE · GPU BASELINE GATE OPEN · RUNTIME INTEGRATION NOT STARTED**
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
- R2C GPU performance is still unproven.

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

## Local GPU baseline · no Cloudflare

Use the standalone folder `world-corridor-01/`.

From that folder/package:

```bash
bash run-local-gpu-baseline.sh
```

The helper starts a local HTTP server on `127.0.0.1:8772`, opens the unchanged instrumented R2C candidate in Google Chrome when available, and keeps the server alive until Enter is pressed in the terminal.

In the page:
1. keep the Chrome tab visible;
2. click **Measure 10s**;
3. use **Copy JSON** or **Download JSON**.

The measurement is local only. No Cloudflare, Stage publication, GitHub Pages, raw-CDN preview or Work/WSA step is required.

## Exactly one next gate

**WC1-COST-SPLIT:** run the preserved instrumented R2C candidate unchanged on representative visible Chromium/GPU hardware and save one probe result. Source parity is already 10/10 PASS; do not tune the candidate before this measurement. After that, Track Core adapter is the first additive delta.


## WC1 stop-rule note

GitHub/SwiftShader absolute performance was stopped after two passes. Source rehome is 10/10 byte-identical PASS. Read `FAILURE_RECOVERY_WC1_BASELINE.md`; do not tune the hosted-runner threshold and do not add Track/SKY/Billboard until `WC1-COST-SPLIT` is captured on representative hardware.


## 2026-10-01 · M1 Max baseline measured

Two visible 10 s measurements are persisted in `evidence/WC1_GPU_BASELINE_2026-10-01.json`: ~29 fps in both the InstancedMesh signature (179 calls / 89 geometries) and individual-mesh signature (868 calls / 459 geometries). Nearly 5× draw-call/geometry growth produced no material frame-time penalty. Therefore Hex instancing is not the dominant current bottleneck. Current next gate: `WC1-COST-SPLIT` using only existing clay/cloud/shadow/pixel-ratio toggles before Track Core integration.
