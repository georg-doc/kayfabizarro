# KFB Container Turbo-01 · Return

Updated: 2026-09-29
Status: **CHECKPOINT B BROWSER PASS · HUMAN MOTION/FEEL GATE**

## Owner / branch / heads
- repo: `georg-doc/kayfabizarro`
- branch: `chatgpt-web/kfb-container-turbo-01-2026-09-29`
- tested runtime head: `b4c7bb14cb51d6c5515613593b33c0ea0e183e89`
- Ground implementation head: `772131720e591df1ca341a73e1a59284ef5dd499`
- upstream host donor: `bridge-mind/turbo-kart-rally@c52aca3f10c7995884c316810cac6514daa40e9c` · MIT

## Implemented
### EXPLORE
- one player kart;
- upstream Kart / Input / ChaseCamera feel retained;
- no countdown/laps/results requirement;
- Race ItemSystem off;
- Race remains regression control.

### WALK
- real ActionFigure · Rig_Medium;
- existing KFB `walk-controller.js` is sole Ground movement owner;
- one AnimationMixer for presentation;
- Root/Hips world translation stripped;
- exact clips:
  `Idle_A · Walking_A · Running_A · Jump_Start · Jump_Idle · Jump_Land`;
- KCL/Motion-Lab measured Walk/Run mapping and phase-sync logic consumed;
- hidden kart is not updated while Ground owns movement;
- Turbo ChaseCamera follows the Ground target interface.

## Browser proof
GitHub Actions run: `36548532308`
Artifact: `11023896755`
Digest: `sha256:c18e1193c79165efdd410337b521d309a646c48e831d9118e4acfeb2568132e0`

**29/29 PASS**
- runtime errors: 0
- console/page errors: 0
- EXPLORE drive displacement: 28.91 u
- EXPLORE speed: 33.23 u/s
- Race regression: 8 karts, drive displacement 22.51 u
- Ground Walk: `Walking_A`
- Ground Run: `Running_A` at measured 2.480274... u/s
- Run → Walk → Idle transition PASS
- Jump: `Jump_Start → Jump_Idle → Jump_Land` PASS

## Recovery finding
Runs 5–7 were false-negative QA results caused by headless `requestAnimationFrame` advancing only about one fixed 1/30 s step during a 1.4 s wall-clock wait.

Run 7 proved input was already correct:
`throttle=1`, `controlsLocked=false`, speed `1.220266...`, displacement `0.04`.

The tested runtime adds a deterministic `advanceBy(seconds)` **QA seam only**. Kart/Ground gameplay tuning was not changed to make the test pass.

## Stage / Hub
Published source:
- `cloudflare-live@563d3c1f1c0ed89bf810ba7448db8e90bf0a30f3`
- Cloudflare Pages check: **SUCCESS**
- direct Stage: `https://kayfabizarro.pages.dev/kfb-hub/stage/game-container/turbo-01/`
- Hub card updated to `BROWSER 29/29 · HUMAN MOTION GATE`

The current ChatGPT web fetcher cannot open `pages.dev`, so independent in-chat `PUBLIC_VERIFIED` remains OPEN. No claim beyond successful deployment is made.

## Human gate
In the real Stage:
1. click **EXPLORE** briefly to confirm Turbo driving still feels like the donor;
2. return to title, click **WALK**;
3. try W, Shift+W, stop, A/D turns and Space.

Judge only:
- foot sliding;
- Walk/Run transition weight;
- facing/camera;
- Jump/Land feel.

## Deferred
Cards · Residents · Enter/Exit Kart · Voxel/WFC world · Clay look · Flight.

## Human review · 2026-09-29
Outcome: **HOST / APPROACH PROCEED · GROUND CONSUMER REPAIR REQUIRED BEFORE C**

Observed in the real Stage:
- free orbit camera is missing;
- semantic locomotion states are not wired;
- current Walk/Run presentation feels like small/tripping steps and the Run tier does not read as a distinct fast state;
- Jump is far too high and too short horizontally.

Source diagnosis:
- current Turbo Ground consumer maps only `idle / walk / run / jumpStart / jumpAir / jumpLand`;
- the existing Rig_Medium consumer profile already defines `walk.fast / sprint / backward / strafe.left / strafe.right / crouch / sneak / crawl` plus explicit transition hints;
- current consumer ignores `Running_B` sprint and MovementAdvanced directional clips;
- current Walk controller still derives manual jump from Voxel `autoJumpMax=4.2` + `hopClear=0.55`, producing an apex around 4.75 world units at gravity 30; this is wrong for the Turbo free-roam character;
- the old Walk controller exposes orbit state/methods, but the Turbo Ground consumer does not wire pointer orbit into the camera.

## Exactly one next gate
**Checkpoint B2 · Locomotion Consumer Repair**
1. wire the existing semantic Rig_Medium role/state profile instead of the six-state subset;
2. use source-backed `Running_B` as the sprint tier and MovementAdvanced backward/strafe roles where appropriate;
3. replace the Voxel-height jump preset with a character-scale/free-roam ballistic jump while retaining the KayKit Jump_Start/Air/Land presentation;
4. add free pointer orbit as an additive camera adapter without rewriting the donor ChaseCamera.

Do not start Enter/Exit Kart until B2 passes human motion/control review.


## Parallel slice · B2a Ground Orbit Camera
Status: **BROWSER PASS · MERGE-READY DONOR · NOT STAGE-PUBLISHED**

Parallel branch:
- `chatgpt-web/kfb-container-turbo-orbit-01-2026-09-29`
- implementation commit: `029bc3178bf2e5e83c679ee8b2b478987e110658`
- tested branch head: `a8df18fdba97cbe3eb8ee1eba0f787c00fe30439`

Scope isolation:
- added `app/src/ground-orbit-camera.js`;
- changed only `app/src/main.js` to select that camera owner in WALK;
- `ground-player.js` unchanged: `0afc832cf4035c72c7c22cb7454d3685de6fa280`;
- `walk-controller.js` unchanged: `b49dbb8dde4f906d8698f23323d032d645e35194`;
- donor `camera.js`, Kart and Input remain untouched.

Controls:
- mouse/pointer drag = free orbit;
- wheel = zoom;
- `C` = recenter behind actor;
- Race/EXPLORE continue using the original Turbo ChaseCamera.

Browser proof:
- run `36552520869`;
- artifact `11025615756`;
- digest `sha256:d5de9175df8af68a881fa4061418fb3955ccaa4d8c6f959f9379882ed60147f1`;
- **34/34 PASS**, 0 runtime errors, 0 page/console errors;
- drag changed Orbit yaw by > 0.5 rad and camera position by **7.66 u**;
- wheel changed target distance from **7.50 → 3.52 u**;
- `C` recentered to exact actor-back yaw;
- all prior Explore/Race/Ground checks remain PASS.

QA workflow uses sparse checkout; repository checkout reduced from ~50 s to ~2 s.

This branch is intentionally **not published to the shared Turbo Stage**, because Georg is working on Locomotion B2 in parallel and the shared Stage must not overwrite that work with an orbit-only variant.

## Parallel integration next action
When Georg's Locomotion B2 branch/candidate is known, transplant only:
- `ground-orbit-camera.js`;
- the small WALK camera-owner seam in `main.js`.

Then rerun the combined browser proof before Checkpoint C.
