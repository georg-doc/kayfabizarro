# RETURN · WS0 Particle-First Surface-Reactive VFX R1 · 2026-10-22

**Outcome:** USER-APPROVED VISUAL DIRECTION PERSISTED · TECHNICAL SOURCE RESEARCH PERSISTED · NO RUNTIME/ART ASSET EXECUTION. The earlier idea of AI-modeled big "Knet clouds" is expressly rejected for Racer wakes. A coherent dust wake must emerge exclusively from existing small GPU particles, actual movement history, drift and palette, not sculpted silhouettes or synthetic cloud geometry.

**Owner:** WS0 Game Design/Terrain register; **single receiving runtime:** WS1b existing `kfb-planet`. **Parent:** https://github.com/georg-doc/kayfabizarro/issues/439 (whole terrain/Banden/Rampen owner), future optional VFX effect only. No new standalone engine/renderer/writer.
**Repo:** `georg-doc/kayfabizarro`
**Branch:** `docs/kfb-decisions-register-2026-10-11` (existing owner branch)
**GitHub branch/PR head:** fetch current ref after final write, not this stale embedded checkpoint.
**Stage/Site:** none required for this documentation-only change.

## Saved companion docs

- `replies/WS0_PARTICLE_FIRST_SURFACE_VFX_R1_2026-10-22.md` – binding visual constraint, exact donor file/blob map, 160-point baseline, existing `k2t.signals.drift` forwarding seam, surface identity/palette requirements, water/snow/soil/Goo profile cases, alpha/overdraw safeguards and no cloud sculpting.
- `replies/WS0_PARTICLE_FIRST_SURFACE_VFX_TEST_REPORT_R1_2026-10-22.md` – real 14/14 source/text assertions and explicit not-run scope, 3-case future real visual/performance fixture.
- This `RETURN` – current handoff. Parent `WS0_COLOURED_3D_SHADOW_MVP_TRIAL_R1_2026-10-19.md` retains original scope and gets a short pointer/changelog after this document.

## Actual evidence

- Source paths read on mirror `ws1/terrain-439@4df9362a156fabb32411a960915e38d3a68ae224`: `vehicleRig.js`, `racerRig.js`, `M2Car.jsx`, `k2t.js`, `kfb-flight-vfx.js`, `perfBudget.js`, `test/unit/vehicleRig.mjs`.
- **160-point Racer pool** and separate **240-point Flight skim** exist; no proof both pools run concurrently.
- Crucial discovered simple hook: `k2t.js` already produces actual `signals.drift` = signed drift strength, and `M2Car.jsx` already reads `signals?.()`; the currently read VFX update call does not forward drift.
- Current `racerRig.js` still derives dust color from height/slope. Existing palette/source resolver has to be located, **not invented**.
- Source-only docs read including official Three.js point-size/alpha/WebGPU point constraints. Users' Reddit clip screenshots treated as aesthetic/behavior reference, original Reddit author/repository unverified.
- Source/design first commit `06636f109b848e14bfe6b7e24a2f5bdbe921bea0`, exact GitHub readback; corrected donor-seam commit `e7b3b8534ac2d1a45526485b0083b11becf29e9a`, exact GitHub readback; report checkpoint `4122ff2aa948ad609fb305cc047b4162b8c7cc2d`, exact GitHub readback.
- **14/14 source/text editorial assertions PASS** (reported accurately in TEST_REPORT). **No new code, no executed unit test, no visual source isolation, no new screenshot, no browser/gameplay benchmark, no CI, no deployed Site or Stage.** Tests/run count for these: 0.

## Remaining source and performance questions

1. Actual surface/palette role sampler in the receiving terrain owner (source-backed API, plus water-vs-ground semantics).
2. Player-relevant drift-to-emitter severity mapping and scene/time integration without double-counting existing VFX emitters.
3. Visual behavior with 160 small particles on the same seed/camera; if a coherent wake fails, do **not** auto-replace with blob puffs or big smoke sprites.
4. True GPU frame cost/overdraw and point-size limit on the target Mac/Safari/browser, controlled A/B (existing state has tight budget).
5. Correct integration with existing water wake/ripple owner, not custom fluid simulation.

## Single next gate

**WS0 uses this direction in the existing issue #439 and asks the existing WS1b Racer/Terrain owner to pin the receiving code HEAD and show the *actual* 160-particle source in isolation; then, if scheduled, one reversible same-scene Particle-First Sand/Water/Soil A/B against the current visual baseline, with time+source+GPU evidence.** Existing overall Terrain/Banden/Ramp/Shadow gate remains primary. No forced new priority or separate editor/host.

No merge or Live promotion. No direct KFB Stage link claimed.
