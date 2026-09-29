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
