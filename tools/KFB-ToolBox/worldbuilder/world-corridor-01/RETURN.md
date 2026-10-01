# WorldBuilder · Floating-Island Corridor · Return

Status: **WC1 SOURCE REHOME COMPLETE · 10/10 PARITY PASS · GPU BASELINE STILL OPEN · NO STAGE**
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

## No further integration yet

Not started:
- R2C → Track Core adapter;
- chunked colliders;
- vehicle / physics;
- Billboard scheduler + cached content;
- SKY3 EnvironmentHost;
- actor / resident runtime;
- 4 → 150 logical-island streaming stress.

Those remain blocked only by the representative GPU baseline, not by another architecture discussion.

## Public / Stage

No Stage was published in this slice.
No merge or Live promotion occurred.

A Stage is justified next only if required to execute the unchanged instrumented candidate on representative browser/GPU hardware.

## Exactly one next gate

**WC1-GPU-BASELINE**

Run the preserved instrumented R2C candidate unchanged in a visible Chromium browser on representative hardware and save one `window.__KFB_WC1_BASELINE__.measure()` result.

No geometry, material, Track, vehicle, Billboard or SKY change belongs in that gate.

After that single measurement, continue directly with **Track Core adapter as the first additive performance delta**.
