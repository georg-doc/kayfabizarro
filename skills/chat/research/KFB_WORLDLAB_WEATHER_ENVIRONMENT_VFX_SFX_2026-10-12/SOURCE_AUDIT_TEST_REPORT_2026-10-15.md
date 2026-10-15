# Test evidence · KFB World Lab source Weather / VFX · 2026-10-15

**Status:** A = **SOURCE-ISOLATED BROWSER PASS** · C = **ORIGINAL SPRITE SOURCE PASS / CLAY-INTEGRATION NOT_RUN** · B = **NOT_RUN at this checkpoint**.
**No public product acceptance / Stage, no WorldBuilder runtime.** Parent World R4 remains STOPPED, F-R39 FAIL.

## Actual CI/browser receipt
- Workflow: `KFB World Lab Source Weather VFX Audit`
- Run: https://github.com/georg-doc/kayfabizarro/actions/runs/38785952718
- Tested exact branch revision: `5294ca68b65b52ac3dd656bdc39bd9a270c70a91`
- Job: `116597872276`, conclusion **SUCCESS**.
- Playwright + Chromium, WebGL Three.js `REVISION 184`; 1280×900, headless SwiftShader (NOT Georg target GPU).
- Actual checks: **18/18 PASS**; 0 page exceptions, 0 HTTP errors.
- Evidence artifact: https://github.com/georg-doc/kayfabizarro/actions/runs/38785952718/artifacts/11997472633
- Artifact SHA-256 (Actions upload): `f7092d1f00ebd4188842c00d95c0014d9f7cf7a4dbb77bbb6f7116dd51b54c36`
- Artifact files: `results.json`, `source-dry.png`, `source-rain.png`, `source-vfx-isolated.png`.

## Pinned originals (validated with git hash-object in runner)
| Original donor | Exact blob |
|---|---|
| SKY3 `lab-sky/env-host.v3.js` | `70579123889d86b1b8a39748ee6ede4d0bcaad98` |
| SKY3 Travel `travel/globe-v13/rain-overlay.js` | `679defc912b2648a04778a3154ed9c0553dee30f` |
| Kenney `media/3D_Assets/FX_Visual/kenney_smoke-particles/PNG/White puff/whitePuff00.png` | `52d2a79863b06669c0a77556602fdb139039267e` |
| KFB Audio `media/3D_Assets/Audio/Environment/ambient_wind.wav` | `9e259a43528d292cf2d61796893df9b2ddb80eb6` |

## A / rain and environment
One exact existing `createEnvironmentHost` with `setShell('tiny')`, `setWeather`, `update(1/60)` and `after()`; no new fog writer, renderer, sky runtime or climate logic. No authored fake world object.

- Dry after 420 fixed steps: `weather=clear`, `rain=0`, `rainStreaks=0`.
- Rain after 120 steps: `weather=rain`, `rain=0.8369399167510666`, `rainStreaks=49`.
- Return to dry after 420 steps: `rain=0`, `rainStreaks=0`.
- 120-step repeat: exact same **rain weight** `0.8369399167510666`; number of streaks differs 49 → 50 because **original rain uses Math.random**. Pixel-identical weather and deterministic streaks are **NOT** claimed.
- Fog object stable; opaque-shell count 0 with `tiny`. This is a source seam test, not target-GPU performance or a cloud-style Golden.
- The returned rain and dry screenshots were opened and visually inspected; real rain streaks appear only in active weather. Neither shows an authored town/world scene.

## C / Kenney source shown in isolation
- Original `whitePuff00.png` resolved and was displayed unmodified, naturalWidth 381 px.
- Browser screenshot `source-vfx-isolated.png` separates it from weather. Does **not** prove animated smoke, physical/particle integration, or Clay parity; those are not run here.
- No stock/cloud substitute painted, source image retains original pixel content.

## B / audio boundary at this checkpoint
- Existing `ambient_wind.wav` RIFF/WAVE header present, browser decoded metadata, duration 8.606508 seconds.
- This file is **wind, not rain**. No rain clip, loop seam, speech ducking via real mixer, human listening or silence acceptance is claimed by this run.
- A separate **existing KFB Audio calibration** test has been prepared to source a CC0 rain archive only in the CI job and substitute its bed input **without modifying canonical audio files or creating a second AudioContext**. Track separately when it completes.

## Known limitations
- Independent read-only product/visual critic: **NOT_RUN**; GitHub browser test results are objective script evidence, not human Golden approval.
- Scene under test contains no KFB world/Resident/animation/Clay geometry. Whole-world FPS = NOT_RUN. GPU performance of the source weather with actual world = UNKNOWN.
- CC0 Kenney license is from upstream source pack/research; git blob checks establish identity, not exhaustive rights-chain.
- No deployment to Site/Cloudflare, no merge or Live.

## One next gate
Complete the **existing-owner CC0 rain audio-mix proof** and then assess the combined three-scenario source-isolation evidence without converting documentation/CI into game acceptance.
