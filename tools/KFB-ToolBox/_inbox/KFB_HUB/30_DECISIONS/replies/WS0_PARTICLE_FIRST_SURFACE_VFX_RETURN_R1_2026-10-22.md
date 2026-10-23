# RETURN · WS0 Particle-First Surface-Reactive VFX R1 · 2026-10-22


> **Überholt in der Methode (23.10.):** 160 Partikel sind keine Grenze. → Webchat-Regel „Intent First · Solution Open“ (V-690): siehe `replies/WEBCHAT_INTENT_FIRST_SOLUTION_OPEN_R1_2026-10-23.md`.

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


---

## Current additive follow-up · 2026-10-22 · palette/source bridge + particle disc-risk

Georg asked what else we could prepare after the Particle-First check-in. **One read-only bounded source follow-up** closed substantial previous open questions and was persisted on the **same existing WS0 register branch**:

- New `WS0_PARTICLE_FIRST_VFX_SOURCE_BRIDGE_R1_2026-10-22.md`: source-pin and mapping for `terrain2Palette`, height-free `terrain2` shader, intentionally height/time-coupled later `terrain3`, current `terrain3` palette IDs, numeric-only `m1-terrain.surfaceAt`, no CPU material-role sampler, and the Racer's uncapped per-camera `gl_PointSize`. Does NOT alter prior Claude/WS1b source code or shaders.
- Existing `WS0_PARTICLE_FIRST_SURFACE_VFX_TEST_REPORT_R1_2026-10-22.md` additively expanded with **17/17 newly executed source-text assertions**. Its prior **14/14** remains historical, not rerun as part of this batch.
- Source doc creation exact GitHub readback: `9982ee1a08ed24be716a963778d6d444008f2722`, blob `f9e8113a3915b7639bc22ec9b00c8284519c65fc`.
- Report expansion exact GitHub readback: `c25cbd9d73523c9609c0dd2207ea54486ac220c0`, blob `28c0715dcba3bfb34d849f6f322a52663fc0c817`.
- Runtime tests **0**, new game/browser screenshots **0**, controlled GPU frame test **0**, server/Site/Stage work **0**, production code changed **0**.

### Key readiness delta

1. **Palette source has been found**, so source-first integration can initially use the **actual** Terrain2 or Terrain3 existing palette by zone or stage role. Exact per-pixel organic color selection is **NOT** exposed as a CPU API and remains unproven. Any precise sampler must be derived from one color-field source and parity tested, not improvised from height/slope or duplicated noise.
2. **Active look is not identical between variants:** `terrain2` is height-independent, whereas later `terrain3` is time-animated and deliberately uses a height/downhill contribution per the 21 Oct WS1 source. Preserve both until WS0 confirms which is active and intended for the receiving Racer fixture.
3. **No meaningful water-kind signal is returned by numeric `m1-terrain.surfaceAt(x,z)`**; exact Water material owner is still SOURCE_REQUIRED for real fluid/wake comparison. Do not fake it via a palette named "water".
4. **Point sprite geometry is source-confirmed**; the current shader has no explicit pixel-size clamp, creating a concrete near-camera circular-sprite risk. Controlled visual + frame cost check before design changes.

**Single next gate unchanged:** WS0 and WS1b pin the active receiving code/material owner, show actual source 160 particle points in isolation, then decide whether to schedule reversible same-scene Sand/Water/Soil VFX A/B inside existing #439 work without creating a second engine. No automatic merge/Live.
