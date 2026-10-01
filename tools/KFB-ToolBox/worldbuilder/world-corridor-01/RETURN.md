# WorldBuilder · Floating-Island Corridor · Return

Status: **WC1 GPU BASELINE + COST SPLIT MEASURED · CLAY BOTTLENECK IDENTIFIED · NO STAGE**
Date: 2026-10-01

## Result

The current Claude Design Floating / Hex Island source is now rehomed under the existing WorldBuilder owner without visual or semantic redesign.

Preserved exact source:
`tools/KFB-ToolBox/worldbuilder/world-corridor-01/baseline-source/KFB World Core R2C · Hex-Archipel Katalog.dc.html`

Instrumented entry:
`tools/KFB-ToolBox/worldbuilder/world-corridor-01/baseline-source/KFB World Core R2C · WC1 Baseline.dc.html`

Additive probe:
`tools/KFB-ToolBox/worldbuilder/world-corridor-01/performance-probe.js`

The original rehome remains byte-identical and is not edited by the probe.

## Source / owner status

- WB2 remains WorldBuilder terrain / scene-authoring host.
- Track Core 0.12 remains sole track frame / slot / check owner.
- R2C remains island + route-layout input, not a second Track Core.
- Race / Ground movement owners remain unchanged.
- Billboard and SKY3 remain queued donors, not yet integrated.

## Actual evidence

### Intake
**13 / 13 PASS** source + owner routing checks.

### Rehome
**10 / 10 BYTE-IDENTICAL PASS**:
R2C HTML, support, island module, shadow, sky core and five Clay dependencies are exact copies of the current Claude inbox source.

### Instrumentation
The instrumented HTML differs from the exact source only by one additive module tag for `performance-probe.js`.

Probe records:
fps, mean/p95/p99/max frame time, calls, triangles, geometries, textures, programs, batches, world items/cells, clouds, billboards, track length/crossings, build/load time and WebGL facts.

### Browser
The GitHub browser environment reached the live R2C scene and the performance probe.

Hosted-runner absolute performance is **not accepted**:
- Run `36861649207`: harness bug before browser execution.
- Run `36861843836`: parity + boot PASS; stopped at `too few measured frames` under SwiftShader.
- evidence artifact `11161609956`.

Per stop rule, no third repair/tuning pass is allowed on this CI performance gate.

Full recovery:
`FAILURE_RECOVERY_WC1_BASELINE.md`.

## Why this is not a product-performance verdict

The second run proves the scene boots and the probe works, but the hosted GitHub runner uses software WebGL and delivered too few frames for the fixed sample assumption.

Therefore it is neither evidence that R2C is performant nor evidence that it is too slow on Georg's GPU.

The previously observed ~56 fps / 71 calls / ~354k triangles remains contextual user-device evidence, not this gate's measured result.


## Representative GPU result · Georg / Apple M1 Max

WC1-GPU-BASELINE is now **MEASURED** on visible Chrome / Apple M1 Max.

Two 10 s samples:
- instanced signature: **28.7 fps · 34.8 ms mean · 179 calls · 414,758 triangles · 89 geometries**;
- individual-mesh signature: **29.0 fps · 34.53 ms mean · 868 calls · 403,264 triangles · 459 geometries**.

Both runs share:
414 world items · 158 cells · 54 clouds · 5 billboards · 2,516 m route · 0 crossings · pixel ratio 1.5.

Source interpretation:
R2C mode B uses InstancedMesh; mode A uses individual Mesh objects. The current probe did not serialize mode, so the mapping is inferred from the runtime signature with high confidence.

Key result:
**~5× more calls/geometries did not materially change frame time.** Hex instancing is therefore not the main limiting factor in this current scene on the measured hardware. The current baseline is already ~34.5–34.8 ms/frame, so the next step is to decompose existing shader/fill/shadow/cloud cost before adding Track Core.

Evidence:
`evidence/WC1_GPU_BASELINE_2026-10-01.json`.

## Cost split result · dominant bottleneck found

The same visible M1 Max / Chrome candidate was measured automatically in mode B:

- **Default:** 30.3 fps · 32.96 ms.
- **Clay off:** 90.2 fps · 11.09 ms · **66.4% less frame time** with the same 179 calls / 414,758 triangles.
- **Clouds off:** 34.5 fps · 28.99 ms · 12.0% less frame time.
- **Shadows off:** 29.5 fps · 33.91 ms; despite 94 calls / 212,712 triangles there is no useful frame-time gain.
- **Pixel ratio 1.0:** 39.1 fps · 25.54 ms · 22.5% less frame time.

This closes the earlier uncertainty:

**The present performance problem is dominated by the Clay material/fragment path and pixel footprint, not Hex instancing, draw-call count or shadow geometry.**

Do not remove the KFB Clay look. The current shared Clay SSOT on PR #301 locks K1/H0 v8 as visual Golden and K2/v10 as the new-stage implementation baseline only when it reproduces that Golden. Performance work must therefore optimize/fade/bake the current path while proving locked visual parity.

Clouds remain a secondary budget item and will be revisited after the Clay path is under control.

Evidence:
`evidence/WC1_COST_SPLIT_2026-10-01.json`.

## Reusable measurement lesson

The successful Georg-facing path is now the KFB default for similar local WebGL performance gates:

- exact candidate first;
- single self-contained **double-click HTML**;
- visible Chrome on representative hardware;
- one-click automatic A/B/cost-split;
- one-click JSON export;
- CI only for source parity / syntax / boot;
- no Terminal, unsigned macOS app, Gatekeeper bypass or Cloudflare unless genuinely required.

This rule is persisted in:
- `skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md §4B`;
- `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md §4A`;
- the central Chat router hard rules.

The old terminal helper may remain as developer fallback but is **not** the default Georg-facing workflow.

## No further integration yet

Not started:
- R2C → Track Core adapter;
- chunked colliders;
- vehicle / physics;
- Billboard scheduler + cached content;
- SKY3 EnvironmentHost;
- actor / resident runtime;
- 4 → 150 logical-island streaming stress.

They remain intentionally held behind `WC1-CLAY-PERF-01`; the representative GPU baseline and cost split are complete.

## Local GPU baseline packaging

No Cloudflare or public Stage is required for representative hardware measurement.

The successful Georg-facing format is a **single self-contained HTML opened directly in Chrome**. It requires no Terminal/local server. An earlier unsigned macOS helper app was rejected by Gatekeeper and is not the recommended path.

The repository may retain local-server/CLI helpers for developers, but local performance acceptance uses visible Chrome + exported JSON.

## Public / Stage

No Stage was published in this slice.
No merge or Live promotion occurred.

No Stage is required for the current Clay performance work. Public Stage remains reserved for a meaningful integrated milestone or genuine cross-device/public verification.

## Exactly one next gate

**WC1-CLAY-PERF-01**

Profile the active K1-parity K2/v10 Clay fragment path on the same exact world/camera, then implement only the smallest performance change that preserves the locked K1/H0 visual Golden. Track Core remains the first additive integration delta after Clay performance is brought into a usable budget.
