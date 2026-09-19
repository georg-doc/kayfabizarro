# KCL-M1 · Test / Evidence Report

Date: 2026-09-19  
Owner: KFB Game Dev Studio research  
Branch: `chatgpt-web/kaykit-creator-learning-2026-09-19`

## Scope

This checkpoint tests the **source structure and owner boundaries** of the Locomotion Sync Bench.

It does not claim:
- browser boot;
- GLB network load;
- measured runtime foot-contact values;
- visual superiority of phase sync;
- approved timeScale ranges;
- consumer integration.

## Existing source evidence

The current KayKit `Rig_Medium_MovementBasic` donor already has measured clip durations in existing KFB casting evidence:

- `Running_A` — 0.800 s
- `Running_B` — 0.800 s
- `Walking_A` — 1.067 s
- `Walking_B` — 1.067 s
- `Walking_C` — 1.600 s

KCL-M1 does not treat those durations as gait-role proof. It remeasures the real actor/clip combination in-browser.

## Static/source checks

1. exactly five source clips — PASS
2. no Sprint source — PASS
3. Root/Hips translation is stripped — PASS
4. real foot nodes are measured — PASS
5. 240 intervals per cycle — PASS
6. planted-interval derivation exists — PASS
7. reference speed derives from planted-foot motion — PASS
8. compensated slip metric exists — PASS
9. phase-sync target entry exists — PASS
10. naive target entry remains phase 0 — PASS
11. Three.js crossfade is used — PASS
12. optional fade warp is surfaced — PASS
13. desired speed maps to timeScale — PASS
14. candidate rate clamp is bounded — PASS
15. no keyboard/input ownership — PASS
16. no world movement/velocity writer — PASS
17. two simultaneous A/B visual lanes — PASS
18. measurement profile export exists — PASS
19. human approval flags remain false — PASS
20. human Stage target is a `kayfabizarro.pages.dev` route — PASS

**20/20 static/source checks PASS.**

## Donor reuse verified

### Travel Ground Movement Lab

Reused:
- controller-owned clip cleaning;
- foot sampling approach;
- source-derived cadence thinking.

Not copied:
- player input;
- Ground movement;
- world position;
- Travel jump/controller state.

### KFB Rig Embed v3

Preserved:
- one mixer per host;
- animation presentation does not own movement/physics.

KCL-M1 uses two isolated hosts only because it is an A/B laboratory: one mixer per A/B actor. There is no shared consumer actor here.

## Current source pins

See `SOURCE.json`.

Actor:
- ActionFigure / Rig_Medium
- blob `4785276defdb929cb397954eb74b76aecb84486b`

MovementBasic:
- blob `98e965e886ec539e80f8984a77a29b0c1c02e5e5`

## Browser / runtime status

- browser boot: **NOT RUN**
- ActionFigure visible: **NOT RUN**
- 5/5 source clips loaded: **NOT RUN**
- foot nodes resolved: **NOT RUN**
- automatic measurements generated: **NOT RUN**
- A/B transition visibly compared: **NOT RUN**
- console/page errors: **NOT RUN**
- public Cloudflare Stage: **NOT DEPLOYED**
- Georg motion preference: **OPEN**

## One next gate

Publish the exact candidate to:

https://kayfabizarro.pages.dev/kfb-hub/stage/game-dev-studio/kcl-m1-locomotion-sync/

Then run a browser proof covering source marker, WebGL boot, 5/5 measurements, A/B transition state and zero page/console errors. Human review follows automated proof.
