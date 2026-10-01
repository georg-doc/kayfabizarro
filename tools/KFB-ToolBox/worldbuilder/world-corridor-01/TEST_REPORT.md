# World Corridor 01 · Test Report

Status: **SOURCE REHOME PASS · M1 MAX GPU BASELINE + COST SPLIT MEASURED · CLAY BOTTLENECK IDENTIFIED**
Date: 2026-10-01

## Intake / owner checks

**13 / 13 PASS**

The current island and SKY3 cuts are pinned under the existing WorldBuilder route while WB2, Track Core, Race/Ground, Billboard and Environment owner boundaries remain protected.

## Exact source rehome

**10 / 10 BYTE-IDENTICAL PASS**

Compared directly in GitHub Actions between:
- Claude inbox source: `_inbox/KFB World Core R2C · Hex-Archipel Katalog/WORLD_CORE_R2C_2026-10-01/`
- WorldBuilder rehome: `worldbuilder/world-corridor-01/baseline-source/`

Exact files:
- R2C HTML;
- support.js;
- hex-archipel.r2c.js;
- shadow-fit.v1.js;
- sky-core.r0a.js;
- clay-relief.v2.js;
- clay-material.v10.js;
- clay-profiles.v2.js;
- clay-relief.v4.js;
- clay-toolmix.v1.js.

The preserved source HTML remains exact. The separate WC1 Baseline HTML differs only by the additive `performance-probe.js` module tag.

## Performance probe contract

Probe schema:
`kfb.world-corridor.performance/0.1`

Counters:
- fps;
- mean / p95 / p99 / max frame ms;
- draw calls;
- triangles;
- geometries;
- textures;
- shader programs;
- batch count;
- world items / cells;
- clouds;
- billboards;
- track length / crossings;
- build / load time;
- canvas size / pixel ratio;
- WebGL renderer facts.

The probe observes the existing R2C loop; it owns no renderer, timer, camera or world state.

## GitHub browser gate

### Run 1 · FAIL · harness only
Run: `36861649207`

Cause:
test harness shadowed the built-in `URL` constructor before the browser test.

Product/runtime conclusion:
**NONE**.

### Run 2 · STOP
Run: `36861843836`
Job: `110367697722`
Evidence artifact: `11161609956`

PASS before stop:
- checkout;
- JavaScript syntax;
- exact 10/10 source parity;
- R2C boot;
- performance probe ready.

Failure:
`Error: too few measured frames`

Environment:
headless Chrome on GitHub Ubuntu with SwiftShader WebGL.

Interpretation:
the hosted software-rendered runner is not accepted as an absolute product-performance authority for this scene. The candidate is preserved; no third repair pass is allowed.


## Representative hardware baseline · Georg / Apple M1 Max

Two visible 10 s Chrome measurements were supplied from the exact WC1 candidate.

### Run A · instanced signature
- 28.7 fps
- mean 34.8 ms
- p95 55.3 ms
- p99 64.3 ms
- max 91.4 ms
- 179 draw calls
- 414,758 triangles
- 89 geometries
- 15 textures
- 82 batches

### Run B · individual-mesh signature
- 29.0 fps
- mean 34.53 ms
- p95 50.1 ms
- p99 62.1 ms
- max 75.0 ms
- 868 draw calls
- 403,264 triangles
- 459 geometries
- 15 textures
- 82 batches

Shared world facts:
414 items · 158 cells · 54 clouds · 5 billboards · 2,516 m route · 0 crossings · pixel ratio 1.5 · Apple M1 Max / Metal.

### Interpretation

R2C source code proves:
- mode **B** uses `THREE.InstancedMesh`;
- mode **A** builds individual `THREE.Mesh` objects.

The probe version did not persist `info.mode`, so mode labels are inferred from the unmistakable runtime signature rather than explicitly recorded. The 179-call/89-geometry run matches B; the 868-call/459-geometry run matches A.

Observed delta A→B measurement:
- draw calls: +384.9%;
- geometries: +415.7%;
- triangles: −2.8%;
- fps: +1.0%;
- mean frame time: −0.8%.

Therefore Hex instancing / draw-call count is **not the dominant frame-time limiter** for this current scene on this hardware. The baseline itself is already about 34.5–34.8 ms/frame, so adding Track Core before decomposing the current cost would confound the result.

Evidence:
`evidence/WC1_GPU_BASELINE_2026-10-01.json`.

## WC1 cost split · same B/instanced source

A new mode-recording baseline confirms the measured runtime is mode **B**:
- 29.4 fps;
- mean 34.05 ms;
- p95 53.7 ms;
- 179 calls;
- 414,758 triangles;
- 89 geometries.

Automatic same-scene cost split:

| Pass | FPS | Mean ms | Δ mean vs default | Calls | Triangles |
|---|---:|---:|---:|---:|---:|
| B_DEFAULT | 30.3 | 32.96 | — | 179 | 414,758 |
| B_CLAY_OFF | 90.2 | 11.09 | **−66.4%** | 179 | 414,758 |
| B_CLOUDS_OFF | 34.5 | 28.99 | −12.0% | 164 | 402,470 |
| B_SHADOWS_OFF | 29.5 | 33.91 | +2.9% (noise / no gain) | 94 | 212,712 |
| B_PIXEL_RATIO_1 | 39.1 | 25.54 | −22.5% | 179 | 414,758 |

### Interpretation

1. **Clay fragment/material work is the dominant measured cost.**
   Turning Clay off leaves geometry, calls and world state unchanged but removes about **21.87 ms** from the mean frame time.

2. **Pixel cost matters.**
   Pixel ratio 1.0 improves mean frame time by 22.5% without changing geometry/calls, consistent with a fill/fragment-heavy bottleneck.

3. **Clouds are secondary.**
   Removing 54 clouds saves about 3.97 ms / 12%.

4. **Shadows are not the primary limiter here.**
   Disabling shadows roughly halves draw calls/triangles, yet mean frame time does not improve. Do not spend the next optimization pass on shadow geometry by assumption.

5. Together with the earlier A/B mesh result, **Hex instancing is not the current performance blocker**.

The active parity path already has K2 tools disabled and uses the accepted K1-parity settings. Therefore the next diagnostic must decompose the active v10 fragment path itself — legacy relief/stroke/grain, fingerprints where enabled, facets/creases/mottle and distance/pixel-footprint fading — while preserving the K1/H0 Golden appearance.

Evidence:
`evidence/WC1_COST_SPLIT_2026-10-01.json`.

Clay style authority:
`work/clay-style-ssot-2026-10-01` / PR #301 — K1/H0 v8 is visual Golden; K2/v10 is implementation baseline only when Golden parity is preserved.

## What is NOT claimed

- no Track Core integration;
- no Vehicle integration;
- no Billboard integration;
- no SKY3 integration;
- no streaming / 150-island stress result;
- no Stage/public acceptance.

## Recovery

Read:
`FAILURE_RECOVERY_WC1_BASELINE.md`

## Exactly one next gate

**WC1-CLAY-PERF-01:** profile the active K1-parity K2/v10 Clay fragment path on the same source/camera with bounded feature toggles, then implement the smallest shader/LOD optimization that preserves the locked K1/H0 Golden result. No Track/Vehicle/Billboard/SKY integration belongs in that gate.
