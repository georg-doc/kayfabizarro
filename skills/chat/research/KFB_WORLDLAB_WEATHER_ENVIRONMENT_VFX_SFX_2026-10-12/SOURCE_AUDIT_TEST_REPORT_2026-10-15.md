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

## Additive final evidence · 2026-10-15 · Existing KFB Audio + actual CC0 rain

**Supersedes the earlier B=NOT_RUN checkpoint above; the earlier checkpoint is retained as history.**

**Actual outcome:** A original SKY3 dry/rain/dry = PASS; C original Kenney sprite source isolation = PASS; B **real CC0 rain file through KFB Audio's original calibration mixer, voice duck, recovery and mute** = TECHNICAL PASS. No claim of product sound quality, Clay visual compatibility or target-device performance.

### Exact audio run
- KFB Audio workflow: https://github.com/georg-doc/kayfabizarro/actions/runs/38786984218
- Tested branch source revision: `e2266499a7b15a2b630f03f2121c7714d4adc69c`
- Audio job `116601396362` **SUCCESS · 13/13 PASS**.
- Artifact: https://github.com/georg-doc/kayfabizarro/actions/runs/38786984218/artifacts/11998403026
- Artifact SHA-256 `b5f062b0f5b8320fd34256c77a16f33a6ece628a5d2434897b8217a75af20fb6`; files `results.json`, `rain-via-existing-audio-duck.png`.
- Repeated Weather/VFX source run at same branch head: https://github.com/georg-doc/kayfabizarro/actions/runs/38786984611 · **SUCCESS**. Its 18/18 assertion counts are from original browser run `38785952718`; the repeated head run was successful.
- CC0 rain source item: https://opengameart.org/content/rain-loopable; **Ylmir**; file from `Rain OGG.zip` downloaded **only inside ephemeral CI**, first sorted OGG member; source original exact member filename was not retained, identity fixed by **SHA-256 `4f659f68cf5219007d0bb0969a1862491ceee4057fda4c491c6001e8608fa2cb` · 550049 bytes**. No copy checked into GitHub media or asset registry; consumer rights/licensing recheck before production intake.
- Existing production-code source `kfb-hub/stage/audio-calibration/audio-calibration.js` unchanged; its SOURCE.json was intercepted **only in test browser memory** to route existing GLOBAL_BED/wind input to temporary CC0 rain.
- `AudioContext` count 1, loops 3, decoded-buffer loadErrors 0, browser errors 0; background music timeline kept advancing.
- Existing ambience gain: open `0.7086` → voice-duck `0.5148` → recovered `0.7715` → existing ambience slider mute `0.0012`.
- The prior optional `ffprobe` CLI absence (runner exit 127) was made non-blocking; then a test-only 0.8-second mute measurement incorrectly asserted the owner's smooth 0.38-second `setTargetAtTime` before it settled. Raising the test wait to 2.5 seconds (no owner source change) passed. Both predecessor failures remain traceable in Actions, and the repair outcomes improved.

### Boundary and missing work
- **31/31** total real browser/source assertions across two suites, not a single 31-case whole-world product test.
- Screenshots actually captured and inspected; they show SKY3 atmosphere with/without rain, original VFX sprite isolated and the original Audio Calibration interface in ducked state. These do not prove Clay integration, visually approved style or a user-listened rain sound.
- No authored world scene or resident, no target GPU, no deployment, no Site/Stage, no audio asset import/merge/Live.
- No independent fresh-context human product critic was run. Existing scripted CI is measurement evidence only.
- New machine-readable summary: `SOURCE_AUDIT_RESULT_2026-10-15.json` (both exact run/asset IDs).

**Exactly one remaining productive gate:** show the *same original source FX* next to an actual existing KFB Clay scene and conduct one human listening audition of the CC0 rain with speech duck/mute. Do not invent a new world or audio owner.
