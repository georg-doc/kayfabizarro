# PC-ARCH-01 · Test Report

Date: 2026-09-29  
Owner: `georg-doc/kayfabizarro`  
Branch: `chatgpt-web/playcanvas-arch-01-2026-09-29`  
Frozen implementation: `a072514f111ebf6068606fbf06a017f33f617102`

## Scope

Minimal PlayCanvas `AppBase` render-architecture bench only.

No KFB meshes, T4, physics, Clay material, Residents, Cards, audio or game logic.

## Static / boot checks

Run #2 `36594838998` and Run #3 `36595058236` both prove:
- sparse checkout: PASS
- Node setup: PASS
- `bench.mjs` syntax: PASS
- `local-proof.mjs` syntax: PASS
- Playwright Chromium install: PASS
- local HTTP preview: PASS
- browser reaches the bench and ready marker: PASS
- browser reaches the WebGL2 source gate before sampling: PASS

## Failed performance-telemetry gate

### Run #2
Head `fa69e344ec0d71e4405fede94e6f17ce12b8baaa`

Observed:
```json
{"frames":0,"frameMs":0,"cpuRenderMs":0,"drawCalls":0,"vramMB":0}
```

### Run #3
Head `a072514f111ebf6068606fbf06a017f33f617102`

Timer/frame-counter repair produced:
```json
{"frames":5,"samples":24,"frameMs":0,"cpuRenderMs":0,"drawCalls":0,"vramMB":0}
```

The render counter improved from 0 to 5, but the PlayCanvas `AppStats` values remained zero in GitHub Chromium/SwiftShader.

## Test counts

The intended architecture proof contains 23 named assertions.

Actual completed named assertions before the stop point:
- initial ready/engine/WebGL gates: **3 PASS**
- first case sampling gate: **1 FAIL**
- remaining architecture comparison assertions: **NOT RUN**

It would be incorrect to call this 22/23 or 3/23 PASS because the remaining checks never executed.

## Classification

- source/static: PASS
- boot/WebGL2 initialization: PASS
- headless renderer-performance telemetry: FAIL / NOT REPRESENTATIVE
- real-browser performance: UNTESTED
- KFB integration: NOT STARTED

## Stop decision

Two repair passes were spent on the same telemetry gate. Candidate is frozen; no repair 3.

Recovery:
`recovery/RECOVERY.md`

Manifest:
`recovery/EXPORT_MANIFEST.json`

## Next gate

`PC-ARCH-RB01 · REAL-BROWSER BASELINE`

Use the unchanged primitive-only bench in a normal browser and record the first device baseline before any GLB/physics/KFB content is introduced.
