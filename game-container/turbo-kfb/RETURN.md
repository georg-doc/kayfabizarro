# KFB Container Turbo-01 · Return

Updated: 2026-09-29
Status: **GROUND-CONTROLLER-DONOR-01 · PUBLIC VERIFIED · HUMAN LOCOMOTION FEEL GATE · ORBIT SEPARATE**

## Owner / branch / heads
- repo: `georg-doc/kayfabizarro`
- branch: `chatgpt-web/kfb-container-ground-controller-donor-01-2026-09-29`
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


## GROUND-CONTROLLER-DONOR-01 · PUBLIC VERIFIED closure

Direct human Stage:
https://kayfabizarro.pages.dev/kfb-hub/stage/game-container/ground-controller-donor-01/?ground=1&groundFeel=velocity

Public publication:
- first publication commit: `cloudflare-live@2551ce49532ac705f160448562c95e7b6ba05efb`;
- public-proof Repair 1 commit: `cloudflare-live@ae38fd29993151b655c668bd5776d0f042d2dd27`;
- final Hub metadata commit: `cloudflare-live@c752cab81b35ca44998a635c544fd05eb1a33b85`;
- Cloudflare Pages deployment of the runtime revision: SUCCESS;
- exact public marker `ee1abb9fe6736fe4cf6926846f7d298f9d22b9e4` observed before Chromium.

Public Chromium:
- run `36556353970`;
- job `109366329677`;
- **13/13 PASS**;
- exact runtime marker PASS;
- velocity candidate PASS;
- `Running_B` Sprint PASS;
- MovementAdvanced directional bindings PASS;
- public Walk / Sprint / Jump-Air / Land PASS;
- runtime errors 0;
- page/console errors 0;
- Hub `#briefings` contains the dedicated candidate link PASS;
- artifact `11027623437`;
- digest `sha256:9bc0088bedce00591e9ddb2b6ab2fd2541bd59a70d5f3f8b469be3976d248211`;
- screenshots: `stage.png`, `hub.png`.

Public proof history:
- first public run `36556038270` proved every Stage/runtime check but failed only because QA searched the default **Heute** Hub view for a Briefing card;
- Repair 1 changed the QA route to `#briefings`; no runtime, locomotion, Stage or Hub-card content repair was required;
- Repair 1 PASS closed the publication gate.

Parallel boundary remains binding:
- Orbit B2a: `chatgpt-web/kfb-container-turbo-orbit-01-2026-09-29`;
- this locomotion slice does not contain `ground-orbit-camera.js`;
- no merge between sibling candidates is implied.

### Exactly one next gate

**GEORG HUMAN LOCOMOTION FEEL:** use the direct Stage and judge whether Walk → Run → Sprint, stop/release, backward/strafe and moving Jump now read as intentional full-body locomotion rather than tripping/small steps.

No merge. No Enter/Exit Kart. No Orbit decision in this gate.


## Integrated slice · GROUND-ORBIT-INTEGRATION-01

Status: **REAL-BROWSER PASS · 29/29 + 22/22 + 27/27 · STAGE PUBLICATION NEXT**

Owner:
- repo: `georg-doc/kayfabizarro`
- branch: `chatgpt-web/kfb-container-ground-orbit-integration-01-2026-09-29`
- base: GROUND-CONTROLLER-DONOR-01 handoff `8016b925bf44f380a17b9aa4f3ff7e86c9f4b210`
- implementation commit: `299d44314f351fff5e03dff555266fabcc88fa7f`
- QA commit: `9a71c79d63cd985f0ab622e4309656ab522ccea4`

Integration:
- transplanted exact tested B2a `ground-orbit-camera.js` blob `c05eddbf33bffb8fa0dc63b3a9ce4fa6d6c43e51`;
- transplanted exact tested Orbit `main.js` seam blob `4faafa7616497a7c3bcbcc2ef39e3bd972bf0c6c`;
- retained #287 Locomotion blobs unchanged:
  - `ground-player.js` `99544c0d03eca37b11f8d9e6b9fe58abe187d869`;
  - `walk-controller.js` `18dd999be52981122b011487286e99db1ad00455`;
  - `ground-feel.js` `0001dbe9e9a5e9e111b1587d7374e0f551c0132b`.

Runtime ownership:
- Ground movement remains the #287 Walker/Velocity owner;
- AnimationMixer remains presentation only;
- Ground camera uses the isolated Orbit owner;
- Kart/Race/Explore retain the original Turbo ChaseCamera;
- no Enter/Exit Kart and no second movement owner added.

QA:
- workflow run `36557928700` on exact runtime/QA head `9a71c79d63cd985f0ab622e4309656ab522ccea4`: **SUCCESS**;
- static Locomotion donor: **16/16 PASS**;
- static integration seam: **10/10 PASS**;
- B2 browser regression: **29/29 PASS**;
- Velocity Locomotion browser proof: **22/22 PASS**;
- combined Velocity + Orbit browser proof: **27/27 PASS**;
- runtime/page/console errors: **0**;
- artifact: `11029226537`;
- digest: `sha256:8aadac4950f6b877cc06451613ad83788be28b47982a847d5c657ae42bf93ce3`.

Combined measured facts:
- Orbit drag camera displacement: **7.66 u**;
- Orbit wheel zoom: **7.50 → 3.52 u** target distance;
- C recenter: exact actor-back yaw;
- Walk: **0.6109509569 u/s**;
- Running_A ramp: **2.5867839515 u/s**;
- Running_B sprint: **3.0240851618 u/s**;
- jump apex: **1.2075871706 u**;
- sprint-jump travel: **3.90 u**;
- backward + strafe source clips PASS;
- no root-motion world translation.

## Ground + Orbit public closure

Direct Stage:
`https://kayfabizarro.pages.dev/kfb-hub/stage/game-container/ground-orbit-integration-01/?ground=1&groundFeel=velocity`

Publication:
- runtime + first Hub card: `cloudflare-live@65c00aed4a9e0250b0850d1b170460d9ea66126e`;
- final PUBLIC VERIFIED metadata/Hub: `cloudflare-live@0f2e05889189c736d4efc69a0bfaafa0d2b2cd1a`;
- Cloudflare Pages: **SUCCESS**.

Final public Chromium:
- run `36559579811`;
- job `109376914403`;
- **18/18 PASS**;
- exact runtime marker `9a71c79d63cd985f0ab622e4309656ab522ccea4` visible;
- Velocity / Running_B / directional clips / actor-scale Jump PASS;
- Orbit owner / drag / zoom / C-recenter PASS;
- public Walk / Sprint / Jump-air / Land PASS;
- runtime errors 0;
- page/console errors 0;
- Hub integrated link PASS;
- artifact `11029408390`;
- digest `sha256:0ec22fc23ce71dd2e6f84b34bb5d0772ba2895f5d84074ba17f50314546e48f5`.

Status: **PUBLIC VERIFIED · HUMAN COMBINED FEEL OPEN**.

## Exactly one current next gate
Georg freeplays the integrated Stage and judges only the combined Ground experience: locomotion feel + Orbit usefulness. If this is a PROCEED PASS, Checkpoint C becomes `WALK ⇄ ENTER KART ⇄ DRIVE/DRIFT ⇄ EXIT ⇄ WALK`. No merge before that gate.


## Georg human combined-feel review · 2026-09-29

Outcome: **TUNE · APPROACH GOOD · DEFAULT WALK TOO SLOW**

Observed on the public integrated Stage:
- animation quality is clearly better;
- combined Ground + Orbit direction is good;
- **default Walk pace is still much too slow for enjoyable free travel**;
- traversal takes too long and the actor does not read as dynamic enough at normal W.

Human direction:
- normal W must be materially faster;
- it is acceptable to **overdrive animation playback** if needed;
- do not regress into the previous tiny/tripping-step feel;
- preserve the improved semantic states, actor-scale Jump and Orbit.

Interpretation:
- the current `Walking_A @ 0.6109509569 u/s` should be treated as source/reference cadence, **not the final game traversal speed**;
- next tuning should separate **gameplay travel speed** from **clip source reference speed** and use the best existing Rig_Medium walk role / playback multiplier rather than blindly locking world speed to measured source displacement.

## Exactly one current next gate
**GROUND-WALK-PACE-TUNE-01:** choose the best existing source-backed Walk tier (Walking_A/B/C and existing profile data), raise normal W to an enjoyable travel pace, keep Run/Sprint hierarchy intact, and prove no obvious foot-slide/tripping regression in the real integrated Ground+Orbit host.


## GROUND-WALK-PACE-TUNE-01 · implementation checkpoint

Status: **IMPLEMENTED · CI RUNNING · OPT-IN TUNE**

- branch: `chatgpt-web/kfb-container-walk-pace-tune-01-2026-09-29`
- base: public-verified Ground+Orbit integration + Georg TUNE feedback
- implementation commit: `d3679c2e8609232674225ab798b4931327e43cff`
- QA commit: `eb8d5a660eea64187b26df6d4b82d40cc14d9eee`
- activation: `?ground=1&groundFeel=velocity&walkPace=travel`

Design finding:
- later Rig_Medium consumer profile measured `Walking_B` only +9.8% vs `Walking_A`; it is not a meaningful missing medium gait;
- existing semantic profile therefore already defines `walk.fast` as playback-rate variation;
- older Motion Lab technical handoff was ~1.108 u/s at `Walking_A ×1.8`.

Tune:
- normal travel W target = `Walking_A reference × 1.8 = 1.0997117224 u/s`;
- playback cap remains 1.8; no extra animation-rate range invented;
- current measured 0.6109509569 u/s path remains default when `walkPace=travel` is absent;
- Run / Running_B Sprint / backward / strafe / Jump / Orbit unchanged.

QA run:
- `36581374090` on exact QA head `eb8d5a66...`;
- static Walk-pace checks **6/6 PASS**;
- integration static checks **10/10 PASS**;
- browser regression + tuned Travel-Walk currently running.

## Exactly one current next gate
Finish run `36581374090`. If regression + tuned Travel-Walk both pass, publish a dedicated pace-tune Stage for Georg feel review. Do not replace the current public Combined baseline before that review.
