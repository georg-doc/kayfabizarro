# World Corridor 01 · Test Report

Status: **SOURCE REHOME PASS · BROWSER BOOT PASS · ABSOLUTE CI PERFORMANCE NOT ACCEPTED**
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

## What is NOT claimed

- no representative GPU FPS baseline;
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

**WC1-GPU-BASELINE:** run the existing instrumented R2C candidate unchanged in a visible Chromium browser on representative hardware and save the probe result. No design/runtime tuning belongs in that gate.
