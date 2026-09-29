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


## GROUND-WALK-PACE-TUNE-01 · tested result

Tested runtime/QA head: `d6e9d42149670af290d96fe19dfdc28095f2f337`
Actions run: `36582612505`
Artifact: `11040906054`
Digest: `sha256:ae9e6929c02fcf0357fb7c57228d168a64561f7b9d5f21f152ccd8f1f6a3289e`

Result:
- Walk-pace static: **6/6 PASS**
- existing Ground+Orbit regression: **27/27 PASS**
- Travel-Walk browser: **14/14 PASS**
- runtime/page/console errors: **0**

Measured Travel-Walk:
- target: `1.0997117224 u/s`
- settled: `1.0989688245 u/s`
- Walking_A playback: `1.8×`
- 0.84 s travel: `0.94 u`
- Shift Run tier: `Running_A @ 2.7251 u/s`
- Shift Sprint tier: `Running_B @ 3.0254 u/s`
- Shift release: returns to `Walking_A @ 1.1019 u/s`
- Orbit remains active.

Repair history:
1. first red run was QA-only: Node assertion referenced browser `window`; runtime checks before that point were green;
2. after QA repair, the faster starting pace exposed a real state-threshold issue: Shift crossed the old Sprint threshold too quickly and skipped the visible `Running_A` tier;
3. one product repair moved the Travel-profile Sprint handoff to 96% of Running_B speed; the next exact runtime run passed.

The current 0.611 u/s measured pace remains available when `walkPace=travel` is absent.

## Exactly one current next gate
Publish a dedicated Pace-Tune Stage using `?ground=1&groundFeel=velocity&walkPace=travel` and ask Georg whether ~1.10 u/s is now enjoyable enough. If still too slow, do **not** keep overdriving Walking_A blindly; the next design choice is normal-W-as-jog/Running_A versus a higher playback cap.


## GROUND-WALK-PACE-TUNE-01 · PUBLIC VERIFIED closure

Status: **PUBLIC VERIFIED · HUMAN PACE FEEL OPEN · DO NOT MERGE**

Owner:
- repo: `georg-doc/kayfabizarro`;
- branch: `chatgpt-web/kfb-container-walk-pace-tune-01-2026-09-29`;
- Draft PR: **#289**;
- tested runtime/QA head: `d6e9d42149670af290d96fe19dfdc28095f2f337`;
- source handoff before this metadata close: `16f3d3f0e3a1081d6748e3f418370c718bb57f9e`.

Direct human Stage:
`https://kayfabizarro.pages.dev/kfb-hub/stage/game-container/ground-walk-pace-tune-01/?ground=1&groundFeel=velocity&walkPace=travel`

Public publication:
- Cloudflare publication source: `cloudflare-live@20c1858c2f6cdd0b48136eb8295b7c803a5e12f6`;
- Cloudflare Pages: **SUCCESS**;
- Hub card: `PUBLIC VERIFIED · HUMAN PACE`, linked to the dedicated direct Stage.

Public Chromium:
- run `36583694971`;
- job `109458242652`;
- **13/13 PASS**;
- exact runtime marker `d6e9d42149670af290d96fe19dfdc28095f2f337` PASS;
- faster `Walking_A` Travel profile PASS;
- `Running_A` tier + `Running_B` Sprint + release-to-Walk PASS;
- Orbit owner mounted PASS;
- runtime/page/console errors: **0**;
- Hub dedicated-link check PASS;
- artifact `11040747449`;
- digest `sha256:8c1b6f7e9bd53d8637fc814efff2e27ca91beb80629b34d63d7c593ead353fe2`;
- screenshots: `stage.png`, `hub.png`.

Public measured Travel-Walk remains:
- target `1.0997117224 u/s`;
- settled `1.0989688245 u/s`;
- `Walking_A` playback `1.8×`;
- `Running_A` tier `2.7251 u/s`;
- `Running_B` Sprint `3.0254 u/s`;
- release returns to faster `Walking_A`;
- measured 0.611 u/s profile remains available without `walkPace=travel`.

## Exactly one current next gate
**GEORG HUMAN PACE FEEL:** freeplay only the dedicated Pace-Tune Stage and judge whether ~1.10 u/s normal W is lively/enjoyable enough without obvious foot-slide or renewed tiny/tripping-step feel. If TUNE because it is still too slow, the next design choice is normal-W-as-`Running_A`/jog versus deliberately raising the Walk playback ceiling. No merge and no Enter/Exit Kart before this human gate.


## Georg human pace review · 2026-09-29 · TUNE 2

Outcome: **TUNE · 1.10 u/s STILL TOO SLOW · NORMAL W MUST BE RUNNING_A**

Observed on the dedicated PUBLIC VERIFIED Pace-Tune Stage:
- the controller/locomotion still reads like the old too-slow state;
- merely overdriving `Walking_A` to ~1.10 u/s is not enough for normal free travel.

Binding human direction:
- **normal W in the Travel profile = `Running_A` immediately** — treat this as the normal second gear / default traversal state;
- **Shift+W = `Running_B` Sprint**;
- do not insert the old Walking_A / walk.fast tier between idle and normal travel;
- preserve actor-scale Jump, backward/strafe semantics, Orbit and the measured/no-query comparison path.

Interpretation:
- the Travel profile becomes a two-gear forward ladder: **Idle → Running_A (W) → Running_B (Shift)**;
- `Walking_A` remains source/reference and measured-profile evidence, not the default forward traversal animation.

## Exactly one current next gate
**GROUND-WALK-PACE-TUNE-02:** implement the two-gear Travel ladder on this same owner branch, prove normal W = Running_A and Shift = Running_B in the integrated Ground+Orbit host, then republish the same dedicated Pace-Tune Stage for Georg feel review. No Enter/Exit Kart before this gate.


## GROUND-WALK-PACE-TUNE-02 · implementation checkpoint

Status: **IMPLEMENTED · TESTS PENDING**

- same canonical pace owner / PR #289; no new locomotion branch or runtime owner;
- `walkPace=travel` is now a two-gear forward profile:
  - **W → Running_A / run**, target = source-backed `Running_A` reference (~2.4803 u/s);
  - **Shift+W → Running_B / sprint**, target ~3.028 u/s;
- Travel W selects `Running_A` immediately from Idle; it no longer waits for a Walk/Fast/Run threshold;
- Shift selects `Running_B` immediately; release returns directly to `Running_A`;
- measured/no-query profile still keeps `Walking_A` and the prior semantic ramp for comparison;
- backward/strafe, actor-scale Jump, velocity response and Orbit are unchanged.

Exactly one current gate: run the existing Ground+Orbit regression plus the dedicated Travel two-gear browser proof. Republish the same Stage route only after both pass.


## GROUND-WALK-PACE-TUNE-02 · source browser PASS

Tested runtime head: `4475271b61e65fae95e5044925b83f2e39c18e6e`  
Actions run: `36588655547` · job `109475640957`  
Artifact: `11043426976`  
Digest: `sha256:fd09e2adf33efb7c7b70950d3f0b789f40f563158ec84bc2be0177108127601f`

Result:
- Walk/pace static: **8/8 PASS**;
- integration static: **10/10 PASS**;
- unchanged Ground+Orbit regression: **27/27 PASS**;
- Travel two-gear browser: **16/16 PASS**;
- runtime/page/console errors: **0**.

Measured Travel two-gear behavior:
- W target / `Running_A` reference: `2.4802741670 u/s`;
- after 0.06 s W: `Running_A / run @ 1.5210503972 u/s`;
- settled normal W: `Running_A / run @ 2.4785986456 u/s`;
- 0.84 s normal-W travel: `2.11 u`;
- after 0.06 s Shift: `Running_B / sprint @ 2.8159216475 u/s`;
- settled Shift: `Running_B / sprint @ 3.0263315488 u/s`;
- Shift release: direct `Running_A / run @ 2.5503960035 u/s`;
- Orbit retained;
- measured/no-query `Walking_A @ 0.6109509569 u/s` path still passes inside the 27/27 regression.

Exactly one current next gate: republish the **same** dedicated Pace-Tune Stage with runtime `4475271b...`, update the Hub copy from obsolete “Walking_A 1.8× / ~1.10” wording to **W = Running_A / Shift = Running_B**, and require exact public Chromium proof before returning the link.


## GROUND-WALK-PACE-TUNE-02 · PUBLIC VERIFIED closure

Status: **PUBLIC VERIFIED · HUMAN TWO-GEAR FEEL OPEN · DO NOT MERGE**

Owner / exact state:
- repo: `georg-doc/kayfabizarro`;
- branch: `chatgpt-web/kfb-container-walk-pace-tune-01-2026-09-29`;
- Draft PR: **#289**;
- tested runtime/QA head: `4475271b61e65fae95e5044925b83f2e39c18e6e`;
- source evidence head before this closure: `096f63a32963424d95330f24e5709003d4dd5278`;
- Cloudflare publication: `cloudflare-live@92335555295ee84eecfd2c3cec9d01ead98533ab`.

Direct human Stage:
`https://kayfabizarro.pages.dev/kfb-hub/stage/game-container/ground-walk-pace-tune-01/?ground=1&groundFeel=velocity&walkPace=travel`

Public Chromium:
- run `36589579432`;
- job `109478846810`;
- **15/15 PASS**;
- exact public runtime marker `4475271b61e65fae95e5044925b83f2e39c18e6e` PASS;
- W immediately `Running_A / run @ 1.5210503972 u/s`;
- settled W `Running_A / run @ 2.4785986456 u/s`;
- Shift immediately `Running_B / sprint @ 2.8159216475 u/s`;
- settled Shift `Running_B / sprint @ 3.0263315488 u/s`;
- Shift release returns directly to `Running_A / run @ 2.5503960035 u/s`;
- Orbit mounted PASS;
- runtime/page/console errors: **0**;
- refreshed Hub two-gear link PASS;
- artifact `11043990368`;
- digest `sha256:714159ee306220f12aba2443406e992cf11656b8427f06b15a013a19bd4e6707`;
- screenshots: `stage.png`, `hub.png`.

The prior ~1.10 u/s `Walking_A` Travel candidate remains additive history only and is superseded for this human gate. The measured/no-query `Walking_A @ 0.6109509569 u/s` profile remains available solely as regression/reference evidence.

## Exactly one current next gate
**GEORG HUMAN TWO-GEAR FEEL:** on the direct Stage, judge only whether normal W now feels correct as the default `Running_A` travel gear and Shift as `Running_B` Sprint. No merge and no Enter/Exit Kart before this verdict.


## GROUND-TRAVEL-PACE-TIMING-01 · implementation checkpoint

Status: **IMPLEMENTED ON FRESH CLEAN BASE · TESTS PENDING**

- branch: `chatgpt-web/kfb-ground-travel-pace-timing-01-2026-09-29`;
- base: last accepted Two-Gear handoff `542eedb91f96b6f718df9e619fb3d3f746b79854`;
- previous global timing candidate is not in this branch;
- W remains `Running_A`, Shift remains `Running_B`;
- Travel cadence multiplier: **1.8×**, applied to both locomotion playback and forward world target speed;
- target W: **4.4644935006 u/s**;
- target Shift: **5.4511465643 u/s**;
- source/reference speeds remain unchanged measurement data;
- live wall-clock catch-up is scoped only to explicit `walkPace=travel` Ground and uses 1/60-s slices with 0.25-s max catch-up;
- Race, Explore and no-query Ground retain the original live `Math.min(rawDt,1/30)` path;
- existing `advanceBy()` remains unchanged;
- backward/strafe, Jump and Orbit unchanged.

Brief: `game-container/turbo-kfb/GROUND_TRAVEL_PACE_TIMING_01.md`

Exactly one gate: run new static + full baseline + existing Ground/Orbit + dedicated Travel 1.8×/15-FPS browser proof. No Stage publication before all pass.


## GROUND-TRAVEL-PACE-TIMING-01 · source browser PASS

Tested implementation head: `ada92c557d3ef24dd18e511b4cff6f18e8b721fc`  
Actions run: `36601155065` · job `109518578915`  
Artifact: `11048319690`  
Digest: `sha256:5fec8973a084c5c3f5cd4957dea32bb9c7c28bd05ccb7be8eebb027b199d4e28`

Result:
- Travel pace/timing static: **12/12 PASS**
- integration static: **10/10 PASS**
- full Turbo baseline browser: **29/29 PASS**
- existing Ground+Orbit browser: **27/27 PASS**
- dedicated Travel cadence/timing browser: **23/23 PASS**
- runtime/page/console errors: **0**

Measured Travel behavior:
- cadence multiplier: **1.8×**
- Running_A world target: **4.4644935006 u/s**
- Running_B world target: **5.4511465643 u/s**
- 15-FPS W: raw **0.8 s** = simulated **0.8 s**, dropped **0**
- settled W: **4.4534271276 u/s**
- W playback: **1.7955382461×**
- 0.8-s W travel: **3.01 u**
- 15-FPS Shift: raw **0.6 s** = simulated **0.6 s**
- settled Shift: **5.4400629025 u/s**
- Shift playback: **1.7963401110×**
- Shift release: direct `Running_A`
- 0.5-s severe stall: bounded to **0.25 s** catch-up / **0.25 s** dropped
- Orbit retained

Baseline preservation:
- Explore displacement **28.91 u**, speed **33.23 u/s**
- Race: **8 karts**, drive displacement **22.51 u**
- no-query Ground Run remains **2.4802741670 u/s**
- legacy Jump Start → Air → Land PASS
- measured Ground+Orbit profile remains **27/27 PASS**

Exactly one next gate: publish this exact runtime to the existing Pace-Tune Stage route, update Hub copy to `Travel 1.8× + Timing`, and require exact public Chromium proof before returning it for Georg freeplay.


## GROUND-TRAVEL-PACE-TIMING-01 · publication checkpoint

Status: **SOURCE PASS · CLOUDFLARE WRITE VERIFIED · EXACT PUBLIC PROOF PENDING**

- source handoff before publication: `4eeee4b869fdda344339055767c6ddf224f03c99`;
- tested runtime remains `ada92c557d3ef24dd18e511b4cff6f18e8b721fc`;
- Cloudflare mirror write: `cloudflare-live@4035d4a017a55f8f8129639badcfae45ef58c6b1`;
- exact mirror blobs read back:
  - `src/main.js` = `046b731860fad73d2be148c3112504130fdcc3c3`;
  - `src/ground-player.js` = `51dccfd09409ea7fc36883d01a26ee51f8be677d`;
- Stage marker/DEPLOYMENT/SOURCE/Hub all point to runtime `ada92c55...`;
- public proof run `36602463818` / job `109522980455` is currently waiting for the exact Cloudflare `DEPLOYMENT.json` revision;
- **do not claim PUBLIC VERIFIED until that exact wait + Chromium proof succeeds**;
- no retry/write should occur while this run remains in progress because the intended GitHub write is already present.

Exactly one current gate: finish run `36602463818`. On SUCCESS, persist public evidence and return the direct Stage for Georg freeplay; on FAILURE, inspect its exact log before any repair.


## GROUND-TRAVEL-PACE-TIMING-01 · direct public runtime proof

Public proof run `36602463818` reached the exact runtime and all **runtime** checks passed:
- exact marker `ada92c557d3ef24dd18e511b4cff6f18e8b721fc` visible;
- Travel 1.8× active;
- Running_A target `4.4644935006 u/s`, playback target 1.8×;
- Running_B target `5.4511465643 u/s`, playback target 1.8×;
- 15-FPS W preserves 0.8 s wall-clock with 0 dropped ordinary-frame time;
- public W settles `4.4534271276 u/s` at `1.7955382461×`, distance `3.01 u`;
- public Shift settles `5.4400629025 u/s` at `1.7963401110×`;
- 15-FPS Shift preserves 0.6 s wall-clock;
- Shift release returns Running_A;
- Orbit mounted;
- runtime/page errors: 0.

Workflow conclusion is red **only** because the Hub lookup did not find the new Travel 1.8× card after the runtime checks. This does not invalidate the direct Stage runtime.

Direct human test surface:
`https://kayfabizarro.pages.dev/kfb-hub/stage/game-container/ground-walk-pace-tune-01/?ground=1&groundFeel=velocity&walkPace=travel`

Artifact: `11050371267`.

Exactly one current gate: Georg freeplays the direct Stage and judges only whether cadence + covered distance now feel right. Hub-card repair is non-blocking metadata.


## Georg human mobility-profile review · 2026-09-29 · TUNE 5

Outcome: **TUNE · TIMING IMPROVED · PROFILE CONSUMPTION STILL WRONG**

Human result on public Travel 1.8× runtime:
- normal W feels better but still not good;
- run/sprint still feel too slow;
- explicit question: are the KayKit creator / KCL movement-state-animation mapping lessons actually being consumed?

Confirmed architecture finding:
- KCL-M1 + ToolBox already define KayKit locomotion as semantic roles with measured cadence/contact facts and transition hints;
- current Turbo Travel consumer uses only a partial hand-wired subset and a shared 1.8× clamp;
- the stable ToolBox owner path `tools/KFB-ToolBox/kfb-lib/locomotion-profiles.v1.js` is currently missing from main; the owner exists only in ToolBox session-cut exports;
- therefore the consumer is not actually reading one stable canonical profile owner.

Binding direction:
1. **Ground first:** promote the existing ToolBox locomotion profile to a stable owner path and wire Turbo Ground presentation states to it. `walk-controller` remains the sole world-movement owner.
2. Do not keep tuning local `Running_A/Running_B` constants as a substitute for the profile owner.
3. Preserve current wall-clock fix and Orbit.
4. **Cars later, separate owner:** KFB-Stunt-Car-Race remains physics/steering/drift/jump owner. Existing v0.8 human-accepted driving feel is protected; Vehicle Lab / Box Stop profiles become consumed presentation/vehicle profiles rather than parallel physics constants.
5. **Flight later, separate owner:** KFB-Travel-Globe remains Flight movement owner (`carpet.js` / Travel mode bridge). ToolBox/vehicle profiles may describe carrier geometry/presentation/capability but must not create second flight physics.
6. Clay/facade/shadow work is explicitly out of this chat and owned by the separate design chat.

Exactly one current implementation gate here: **GROUND-LOCOMOTION-PROFILE-CONSUMER-01**. Cars and Flight are queued follow-up slices only after Ground proves the pattern.
