# PC-ARCH-01 · Failure Recovery

**Date:** 2026-09-29  
**Status:** ARCHIVED_FAILED_CANDIDATE · SOURCE PRESERVED · HEADLESS TELEMETRY GATE STOPPED  
**Owner:** `georg-doc/kayfabizarro`  
**Branch:** `chatgpt-web/playcanvas-arch-01-2026-09-29`  
**Frozen implementation head:** `a072514f111ebf6068606fbf06a017f33f617102`

## SOURCE

Editable source is preserved in place:
- `game-container/turbo-kfb/bench/playcanvas-arch-01/index.html`
- `game-container/turbo-kfb/bench/playcanvas-arch-01/style.css`
- `game-container/turbo-kfb/bench/playcanvas-arch-01/bench.mjs`
- `game-container/turbo-kfb/bench/playcanvas-arch-01/local-proof.mjs`
- `.github/workflows/playcanvas-arch-01.yml`

External runtime dependency:
- PlayCanvas Engine `2.22.4`
- pinned browser import: `https://cdn.jsdelivr.net/npm/playcanvas@2.22.4/build/playcanvas.mjs`

No KFB mesh, T4 geometry, vehicle donor, physics, Resident, Card or Clay material is part of this candidate.

## GOAL

Establish a minimal PlayCanvas architecture bench before any KFB content is imported.

The bench compares:
1. many independent `Entity + RenderComponent` boxes;
2. one mesh submitted with hardware instancing;
3. counts 0 / 100 / 250 / 500 / 1000 / 2000;
4. shadows OFF/ON;
5. device-pixel-ratio OFF/ON.

Visible metrics are intended to expose:
- FPS;
- frame time;
- CPU render time;
- draw calls;
- tracked VRAM;
- controlled geometry estimate.

## ATTEMPTS

### Initial run · #1
- workflow run: `36594694953`
- head: `636a0ba976274ba22168dac925adfddbb5fc7012`
- result: FAIL
- full repository checkout was unnecessarily expensive; repository size is about 2.5 GB.
- browser proof reached the bench but the first sampling gate returned zero samples / zero telemetry.

### Repair 1 · #2
- workflow run: `36594838998`
- head: `fa69e344ec0d71e4405fede94e6f17ce12b8baaa`
- result: FAIL
- repair: workflow changed to sparse checkout of only the bench.
- checkout, Node setup, syntax, Playwright Chromium installation and local HTTP preview all PASS.
- browser proof still failed at `entities 100 frames`:
  `{"frames":0,"frameMs":0,"cpuRenderMs":0,"drawCalls":0,"vramMB":0}`.

### Repair 2 · #3
- workflow run: `36595058236`
- head: `a072514f111ebf6068606fbf06a017f33f617102`
- result: FAIL
- repair: sampling no longer depends on headless `requestAnimationFrame`; a real frame counter plus timer sampling was added.
- checkout, syntax, browser installation and local preview all PASS.
- render loop now demonstrably advances:
  `{"frames":5,"samples":24,"frameMs":0,"cpuRenderMs":0,"drawCalls":0,"vramMB":0}`.
- PlayCanvas `AppStats` values remain zero in this minimal SwiftShader/headless measurement path.

Two repair passes on the same telemetry gate are exhausted. No repair 3.

## WORKING PARTS

| Part | Status | Evidence |
|---|---|---|
| sparse source checkout | REUSE_CANDIDATE | workflow #2/#3 PASS |
| JS syntax | REUSE_CANDIDATE | workflow #2/#3 PASS |
| local HTTP boot | REUSE_CANDIDATE | workflow #2/#3 PASS |
| PlayCanvas engine import / app ready | REUSE_CANDIDATE | proof reached `data-pc-arch-ready=1` |
| WebGL2 device creation | REUSE_CANDIDATE | initial proof gates before sampling PASS |
| Entity-grid construction | NEEDS_REAL_BROWSER_TEST | candidate reaches case setup |
| instancing implementation | NEEDS_REAL_BROWSER_TEST | source uses `VertexFormat.getDefaultInstancingFormat` + `setInstancing` |
| orbit / zoom UI | NEEDS_REAL_BROWSER_TEST | source preserved |
| AppStats telemetry in headless SwiftShader | REJECTED_FOUNDATION | two repair passes remain zero |
| KFB asset/world integration | NOT_STARTED | intentionally deferred |

## FAILURE EVIDENCE

Observed, not inferred:
- after the second sampling repair the PlayCanvas render callback advanced 5 frames during the controlled sample;
- 24 timer samples were taken;
- `app.stats.frameTime`, `cpuRenderTime`, `drawCallCount` and tracked VRAM remained zero in that run;
- the test stopped before the first architecture comparison assertion;
- no KFB content was involved.

## PROVEN CAUSES

**PROVEN**
- the original full-repo checkout was unnecessary and costly; sparse checkout fixes it.
- headless timing through `requestAnimationFrame` was not a reliable sampling mechanism in this CI environment.
- replacing that timing source proves some render-loop advancement but does not make the AppStats telemetry useful.

## HYPOTHESES

**HYPOTHESIS**
- PlayCanvas AppStats publication and Chromium SwiftShader/headless cadence do not provide representative telemetry for this minimal AppBase host.
- real hardware / normal browser scheduling may expose the expected metrics without changing the candidate.

These are not promoted to architecture rules until tested in a normal browser.

## SALVAGE

- **REUSE_CANDIDATE:** minimal AppBase host.
- **REUSE_CANDIDATE:** entity-vs-instancing scene generator.
- **REUSE_CANDIDATE:** count, shadow and DPR toggles.
- **REUSE_CANDIDATE:** lean interactive UI.
- **NEEDS_ISOLATED_TEST:** actual metric values and architecture breakpoints in a normal browser.
- **REJECTED_FOUNDATION:** more headless-AppStats repair work on this branch.

## LESSONS LEARNED

Error:
we attempted to make CI SwiftShader telemetry the performance truth before proving the same bench in a real browser.

Rule:
CI may verify boot/source/structural contracts, but performance thresholds and renderer budgets must be established on representative browser/hardware.

Earlier cheaper test:
publish the unchanged primitive-only bench and collect the first real-browser snapshot before importing any GLB or physics.

## EXPORT

No ZIP is required because the complete editable candidate and its workflow are already preserved on the named Git branch. No secrets, tokens or private URLs are needed.

Missing from this recovery:
- real-browser screenshot: NOT YET PRODUCED;
- representative-device metric capture: NOT YET PRODUCED;
- KFB asset tests: NOT STARTED;
- physics tests: NOT STARTED.

## TESTED RESULT

- static/syntax: PASS
- local HTTP boot: PASS
- headless browser app-ready/WebGL initialization: PASS up to sampling
- headless renderer-performance telemetry: FAIL / NOT REPRESENTATIVE
- integrated KFB world: NOT TESTED

## PUBLIC DEPLOYMENT

None at freeze time.

## GEORG ACCEPTANCE

Not requested. This is internal failure recovery, not a product acceptance surface.

## OPEN

Exactly one next gate:

**PC-ARCH-RB01 · REAL-BROWSER BASELINE**

Publish the frozen primitive-only bench unchanged to KFB Stage and collect one real-browser baseline for:
- Entities 100 / 500 / 1000;
- Instanced 100 / 500 / 1000 / 2000;
- shadows OFF first;
- device pixel ratio 1 first.

Do not import a KFB mesh or add physics before that baseline exists.
