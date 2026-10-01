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

## Local GPU baseline pack

No Cloudflare or public Stage is required for the current hardware measurement.

Standalone artifact:
- name: `kfb-world-corridor-wc1-local-gpu-baseline`;
- artifact id: `11163194027`;
- source head: `4123c3155de7e18b2de4c28a63ace0d11316bf21`;
- digest: `sha256:4f15c12e6ef68c5d5554df16d972b74536a20ba2af488a876b52379db0d6855d`;
- 19 files; contains exact baseline source, performance probe, dependency-free local server and `run-local-gpu-baseline.sh`.

Local use:
`bash run-local-gpu-baseline.sh` → visible Chrome → **Measure 10s** → **Copy JSON** / **Download JSON**.

CI is now limited to source parity + browser boot. Absolute FPS is local-visible-GPU evidence only.

## Public / Stage

No Stage was published in this slice.
No merge or Live promotion occurred.

A Stage is justified next only if required to execute the unchanged instrumented candidate on representative browser/GPU hardware.

## Exactly one next gate

**WC1-COST-SPLIT**

Use only existing toggles on the preserved instanced/B candidate to measure: default, clay shader off, clouds off, shadows off, and reduced render pixel ratio. No new Track, vehicle, Billboard or SKY runtime is added yet. After the dominant current cost is identified, continue with Track Core as the first additive integration delta.
