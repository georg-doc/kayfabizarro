# KFB Container Turbo-01 · Return

Updated: 2026-09-29
Status: EXPERIMENTAL · RECOVERY CHECKED · CHECKPOINT B IMPLEMENTED · BROWSER HARNESS BLOCKED BY rAF TIMING

## Owner / branch / exact head
- repo: `georg-doc/kayfabizarro`
- branch: `chatgpt-web/kfb-container-turbo-01-2026-09-29`
- verified head before this recovery write: `e6c53ddae32f38dcc7fb7d482d29f94a7686843e`

## Upstream host donor
- `bridge-mind/turbo-kart-rally@c52aca3f10c7995884c316810cac6514daa40e9c`
- MIT license retained.
- protected driving feel files remain donor-exact unless explicitly recorded otherwise.

## Checkpoint A · Explore
Implemented:
- one player kart;
- same upstream Kart controller;
- same ChaseCamera;
- same InputController;
- no countdown/laps/results requirement;
- Race ItemSystem off in EXPLORE;
- Race remains regression control.

Static/source evidence remains **34/34 PASS**.

## Checkpoint B · Ground consumer
Implementation commit:
- `772131720e591df1ca341a73e1a59284ef5dd499`

Added:
- `app/src/ground-player.js`
- exact existing KFB `walk-controller.js` as Ground movement owner;
- ActionFigure · Rig_Medium;
- real KayKit `Idle_A / Walking_A / Running_A / Jump_Start / Jump_Idle / Jump_Land`;
- Root/Hips world translation stripped;
- one AnimationMixer;
- KCL/Motion-Lab playback/phase-sync logic consumed instead of another locomotion lab;
- hidden Kart is not updated while Ground owns movement;
- shared Turbo chase camera consumes the Ground target interface.

## Timeout recovery / browser evidence
Runs 5, 6 and 7 all stop at the same first gameplay assertion:
- title boot PASS;
- EXPLORE entry PASS;
- EXPLORE mode PASS;
- one player kart PASS;
- Race items off PASS;
- input reaches the player: `throttle=1`, `controlsLocked=false`, active input confirmed;
- observed after a 1.4 s wall-clock wait: `speed=1.220266...`, displacement ≈ `0.04`.

This is effectively one fixed `1/30 s` simulation step:
`1.220... × 1/30 ≈ 0.0407`.

Therefore the current red browser gate is **not evidence that Turbo driving is broken**. The headless GitHub browser is not advancing `requestAnimationFrame` reliably during wall-clock waits. This matches the established KFB preview lesson: hidden/headless acceptance must drive simulation with explicit fixed steps, not wait for rAF.

Runs:
- #5 `53519bac...` FAILURE · same 0.04 displacement
- #6 `cd00df61...` FAILURE · physical-key diagnostic, same 0.04 displacement
- #7 `e6c53dda...` FAILURE · exact input trace confirms throttle reaches player

Run 7 artifact:
- artifact id `11023690122`
- digest `sha256:7f5ce06f2a409a7a25676596bf1d90389e170a9b4cac5929095a15d52c591c92`

The two post-timeout commits were **QA diagnostics only**, not two gameplay repair passes. The two-repair stop rule has therefore not been consumed on the product implementation.

## Stage
Checkpoint-A source was mirrored to:
- `cloudflare-live@aed6a2b6684c21cb7de19d58a00c1ef787ccd23d`
- target: `https://kayfabizarro.pages.dev/kfb-hub/stage/game-container/turbo-01/`

Current chat environment still cannot independently open `pages.dev`, so `PUBLIC_VERIFIED` remains OPEN.

Checkpoint B has **not** been promoted to Stage.

## Protected / deferred
Do not yet add:
- Cards;
- Residents;
- Voxel/WFC/procedural world replacement;
- Clay styling;
- Flight;
- Enter/Exit Kart.

Do not retune `kart.js` or animation clips from the current browser failure.

## Exactly one next gate
Replace wall-clock/rAF timing in the browser proof with a deterministic fixed-step `advanceBy(seconds)` debug seam, without changing Kart/Ground gameplay code. Then rerun:
1. EXPLORE drive;
2. Race regression;
3. Ground `Idle → Walk → Run → Walk → Stop → Jump_Start → Jump_Idle → Land`.

Only after that result is known should any product repair be attempted.


## Parallel slice · GROUND-CONTROLLER-DONOR-01 · implementation checkpoint

- branch: `chatgpt-web/kfb-container-ground-controller-donor-01-2026-09-29`
- implementation head: `c5613ff80c6ece19bb701fad98d4f9310d9e8a5b`
- base: shared B2 browser-pass head `b4c7bb14cb51d6c5515613593b33c0ea0e183e89`
- Orbit B2a runs separately on `chatgpt-web/kfb-container-turbo-orbit-01-2026-09-29`; this slice does not edit `ground-orbit-camera.js` or camera integration.
- external `NafisRayan/3D-Game-Template-Ultimate` is behavior-only evidence; its repository declares no specific license and no source code is copied.

Implementation:
- `ground-feel.js` adds opt-in velocity response/damping;
- `walk-controller.js` keeps `direct` as default and exposes `velocity` inside the same movement owner;
- `ground-player.js` activates the candidate only with `?groundFeel=velocity`;
- candidate consumes existing Rig_Medium roles: `Walking_A`, `Running_A`, `Running_B`, `Walking_Backwards`, `Running_Strafe_Left/Right`, plus Jump Start/Air/Land;
- candidate Walk returns to measured Walking_A speed instead of the B2 1.08 u/s near-max playback-rate compromise;
- Shift ramps `walk.fast → run → sprint` rather than snapping directly to one Run state;
- candidate jump is actor-scale ballistic, disables inherited Gummiball bounce and keeps KayKit Jump Start/Air/Land presentation;
- no-query B2 path remains the regression control.

Status: **IMPLEMENTED · TESTS/BROWSER PENDING**.

Exactly one current gate: extend the existing real Turbo browser harness to prove legacy B2 regression plus the opt-in candidate's speed ramp, semantic states and bounded jump.


## GROUND-CONTROLLER-DONOR-01 · tested result

Tested implementation/evidence head: `ee1abb9fe6736fe4cf6926846f7d298f9d22b9e4`

GitHub Actions:
- run: `36554119832`
- job: `109359065140`
- conclusion: **SUCCESS**
- static clean-room/state checks: **16/16 PASS**
- unchanged B2 real-browser regression: **29/29 PASS**
- opt-in Velocity/semantic-state real-browser proof: **22/22 PASS**
- runtime error collector: **0**
- page/console errors: **0**
- artifact: `11027300966`
- digest: `sha256:67d77fd0dfb136824674e737adc575b569590aa410b6ce45dfd96cf17ceab9c0`

Measured candidate behavior in the real Turbo world:
- Walk target/reference: `0.6109509569 u/s`
- after 0.12 s start: `0.4602923058 u/s` — acceleration instead of instant snap
- settled Walk: `0.6109509569 u/s`
- Shift ramp after 0.16 s: `Running_A / run @ 2.5867839515 u/s`
- settled top tier: `Running_B / sprint @ 3.0240851618 u/s`
- release returns to `Walking_A / walk @ 0.6136849006 u/s`
- backward: `Walking_Backwards / backward` PASS
- Q strafe: `Running_Strafe_Left / strafe.left` PASS
- theoretical actor-scale jump: apex `1.2075871706 u`, nominal air time `0.78 s`
- sprint-jump observed horizontal travel: `3.90 u`
- jump sequence: `Jump_Start → Jump_Idle → Running_B` after landing

Baseline preservation on the same branch:
- EXPLORE drive displacement: `28.91 u`
- Race regression: 8 karts, drive displacement `22.51 u`
- old no-query Ground still binds the exact six B2 clips and uses `Running_A @ 2.4802741670 u/s`.

Status: **TECHNICAL + REAL-BROWSER PASS · HUMAN FEEL REVIEW NOT YET PUBLISHED**.

Next gate: publish one dedicated direct Stage route for the real candidate, linked from KFB Hub, then human freeplay compares locomotion feel only. Orbit B2a remains a separate sibling and is not merged into this branch.
