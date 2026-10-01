# FAILURE RECOVERY · WC1-BASELINE

Status: **CANDIDATE PRESERVED · SOURCE PARITY PASS · ABSOLUTE CI PERFORMANCE GATE STOPPED**
Date: 2026-10-01
Owner: KFB WorldBuilder / World Corridor 01
Branch: `chatgpt-web/world-corridor-01-2026-10-01`

## Named gate

WC1-BASELINE:
1. rehome the exact R2C source under the WorldBuilder owner;
2. add only an additive performance probe;
3. prove source parity and record a baseline before adding Track / Vehicle / Billboard / SKY3.

## Preserved candidate

Exact source rehome:
`tools/KFB-ToolBox/worldbuilder/world-corridor-01/baseline-source/`

Immutable parity source entry:
`KFB World Core R2C · Hex-Archipel Katalog.dc.html`

Instrumented entry:
`KFB World Core R2C · WC1 Baseline.dc.html`

Probe:
`../performance-probe.js`

The probe does not own rendering, timers, camera, scene, world state or physics. It observes the existing `window.__r2c` API and requestAnimationFrame only.

## Proven result

**10 / 10 source files BYTE-IDENTICAL PASS** between the Claude inbox source and the WorldBuilder rehome:

1. R2C HTML;
2. support.js;
3. hex-archipel.r2c.js;
4. shadow-fit.v1.js;
5. sky-core.r0a.js;
6. clay-relief.v2.js;
7. clay-material.v10.js;
8. clay-profiles.v2.js;
9. clay-relief.v4.js;
10. clay-toolmix.v1.js.

The instrumented HTML is the exact rehomed HTML plus one module script tag for `performance-probe.js`.

The second browser run reached the live R2C scene and the probe. Therefore source resolution / boot was not the failing gate.

## Failed evidence

### Run 1
GitHub Actions run: `36861649207`

Failure:
test harness variable shadowed the browser `URL` constructor before browser execution.

Classification:
**HARNESS BUG**, not product/runtime evidence.

### Run 2
GitHub Actions run: `36861843836`
Job: `110367697722`
Artifact: `11161609956`

Result:
- checkout PASS;
- syntax PASS;
- 10/10 source parity PASS;
- R2C + probe became ready;
- frame sampling returned fewer than 30 frames within the fixed 3.5 s sample;
- test stopped with `Error: too few measured frames`.

Runner configuration:
headless Chrome + WebGL via SwiftShader on GitHub Ubuntu runner.

## Observed failure

The CI environment does not provide a useful absolute real-time GPU baseline for this scene. Its software-rendered frame throughput is below the smoke's minimum sampling assumption.

This does **not** prove the R2C scene itself is too slow on Georg's GPU.

It also does **not** prove the scene is performant.

## Proven cause vs hypothesis

PROVEN:
- source parity is intact;
- scene boot succeeds;
- the additive probe is reachable;
- the GitHub/SwiftShader sample is too slow for the absolute-FPS assertion.

NOT PROVEN:
- whether the low frame count is dominated by SwiftShader, hosted-runner CPU load, external asset loading side effects, R2C rendering cost, or a combination;
- real performance on Georg's browser/GPU.

## Stop rule

Two repair passes on this gate are exhausted.

**DO NOT**:
- relax the CI frame threshold and call that a product PASS;
- tune R2C geometry from hosted-runner FPS;
- add Track / Vehicle / Billboard / SKY3 before a representative GPU baseline;
- build another performance dashboard or proxy scene.

## Salvage map

Keep:
- exact WorldBuilder rehome;
- 10/10 parity proof;
- performance-probe.js schema and counters;
- instrumented entry;
- GitHub runner as a future regression/boot environment, but not the absolute performance authority.

Quarantine:
- the current GitHub smoke's absolute frame-count acceptance threshold.

## Exactly one next gate

**WC1-GPU-BASELINE**

Run the existing instrumented R2C entry unchanged in a visible Chromium browser on representative hardware and save one result from `window.__KFB_WC1_BASELINE__.measure()`.

Required result:
fps · mean/p95/p99 frame ms · calls · triangles · geometries · textures · batches · world items/cells · cloud/billboard counts · track length/crossings.

No design or runtime change is permitted in that gate.

If a browser-accessible KFB Stage is needed for Georg's machine, publish only this exact preserved candidate to a direct `kayfabizarro.pages.dev` WorldBuilder Stage route and link it from the Hub; do not alter the candidate during publication.
