# KFB Container Turbo-01 · Additive Changelog

## 2026-09-29 · A · Turbo Explore
- pinned MIT Turbo Kart Rally donor at `c52aca3f...`;
- imported runtime with donor-exact Kart/Input/Camera/Track/Models;
- added EXPLORE: one player kart, Race progression/items disabled;
- static/source proof 34/34 PASS.

## 2026-09-29 · B · KFB Ground consumer
- added existing KFB walk-controller as sole Ground movement owner;
- mounted real ActionFigure Rig_Medium;
- consumed real KayKit Idle/Walk/Run/Jump clips and KCL/Motion-Lab calibration logic;
- kept one AnimationMixer and stripped Root/Hips world translation;
- shared Turbo ChaseCamera with Ground target.

## 2026-09-29 · Browser recovery
- runs 5–7 exposed rAF/wall-clock false negative, not broken Kart input;
- added deterministic QA-only fixed-step seam;
- run `36548532308`: **29/29 PASS**, zero runtime/console errors;
- published integrated Explore + Walk candidate to `cloudflare-live@563d3c1f...`;
- next gate: Georg motion/control feel in the real Stage.


## 2026-09-29 · GROUND-CONTROLLER-DONOR-01 · implementation checkpoint


- sibling branch from B2 browser-pass head `b4c7bb14…`; Orbit B2a remains separate;
- added opt-in clean-room velocity feel under `?groundFeel=velocity`;
- candidate consumes existing Rig_Medium directional/sprint states instead of the old six-state subset;
- candidate Walk uses measured Walking_A speed; Shift ramps Walk/Fast/Run/Sprint with Running_B as top tier;
- actor-scale jump replaces the Voxel-height manual jump only in candidate mode; bounce disabled;
- baseline/no-query B2 behavior remains available for regression;
- browser/CI evidence pending.


## 2026-09-29 · GROUND-CONTROLLER-DONOR-01 · browser evidence
- exact head `ee1abb9fe6736fe4cf6926846f7d298f9d22b9e4` · Actions run `36554119832` / job `109359065140`;
- **16/16 static + 29/29 unchanged B2 regression + 22/22 velocity candidate PASS**;
- Velocity candidate: Walk 0.611 u/s; Run ramp 2.587 u/s; Running_B sprint 3.024 u/s;
- Backward + left strafe semantic source clips PASS;
- actor-scale jump: 1.208 u apex / .78 s nominal air / 3.90 u sprint-jump travel;
- zero runtime/page/console errors;
- artifact `11027300966`, digest `sha256:67d77fd0dfb136824674e737adc575b569590aa410b6ce45dfd96cf17ceab9c0`;
- next: dedicated Hub-linked Stage route for human locomotion feel only; Orbit B2a remains separate.


## 2026-09-29 · GROUND-CONTROLLER-DONOR-01 · PUBLIC VERIFIED
- Stage mirror on source head `e91db771…`: static 16/16 + B2 regression 29/29 + candidate 22/22 + Stage mirror 22/22 PASS.
- Published dedicated route at `/kfb-hub/stage/game-container/ground-controller-donor-01/?ground=1&groundFeel=velocity`.
- Cloudflare runtime publication `2551ce4953…`; exact marker appeared and Cloudflare Pages deploy succeeded.
- Public proof attempt 1: every Stage/runtime assertion PASS; Hub lookup alone failed because QA opened Heute instead of Briefings.
- Repair 1 `ae38fd2999…`: QA-only route correction to `#briefings`.
- Final public run `36556353970` / job `109366329677`: **13/13 PASS**, 0 runtime errors, 0 page/console errors, Hub link PASS.
- Public artifact `11027623437` · `sha256:9bc0088bedce00591e9ddb2b6ab2fd2541bd59a70d5f3f8b469be3976d248211`.
- Final Hub badge source: `cloudflare-live@c752cab81b35ca44998a635c544fd05eb1a33b85` · PUBLIC VERIFIED · HUMAN FEEL.
- Orbit B2a remains a separate sibling slice.
- Next and only gate: Georg locomotion feel in the real dedicated Stage.


## 2026-09-29 · GROUND-ORBIT-INTEGRATION-01 · real-browser PASS
- branched from public-verified GROUND-CONTROLLER-DONOR-01 handoff `8016b925...`;
- transplanted exact tested Orbit B2a module + main camera-owner seam;
- retained #287 ground-player / walk-controller / ground-feel blobs unchanged;
- run `36557928700`: static **16/16 + 10/10**, browser **29/29 + 22/22 + 27/27 PASS**;
- combined candidate proves Velocity semantic locomotion and free Ground orbit together with zero runtime/page/console errors;
- artifact `11029226537`, digest `sha256:8aadac4950f6b877cc06451613ad83788be28b47982a847d5c657ae42bf93ce3`;
- next: one dedicated Ground+Orbit Stage milestone; no merge / Enter-Exit yet.


## 2026-09-29 · GROUND-ORBIT-INTEGRATION-01 · PUBLIC VERIFIED
- published exact tested runtime `9a71c79d...` at dedicated Ground+Orbit Stage route;
- first publication `cloudflare-live@65c00aed...`: Cloudflare Pages SUCCESS + public Chromium 18/18 PASS;
- final Hub/metadata `cloudflare-live@0f2e0588...`: Cloudflare Pages SUCCESS + public Chromium 18/18 PASS again;
- final artifact `11029408390`, digest `sha256:0ec22fc23ce71dd2e6f84b34bb5d0772ba2895f5d84074ba17f50314546e48f5`;
- public route proves Locomotion + Orbit together; next gate is Georg combined feel, then Enter/Exit Kart if PROCEED.


## 2026-09-29 · GROUND-WALK-PACE-TUNE-01 · implementation
- Georg TUNE: animation improved, but 0.611 u/s default Walk is too slow for enjoyable free travel.
- Confirmed later Rig_Medium profile: Walking_B only +9.8% vs Walking_A; no hidden medium-speed gait.
- Added opt-in `walkPace=travel`: Walking_A at existing 1.8× cap, target 1.0997117224 u/s.
- Preserved measured Walk baseline and all Run/Sprint/Jump/Orbit behavior.
- Dedicated regression + travel-pace browser proof running on `eb8d5a66...`.


## 2026-09-29 · GROUND-WALK-PACE-TUNE-01 · browser PASS
- Travel Walk = Walking_A at existing 1.8× playback ceiling, 1.0997117224 u/s target;
- preserved measured 0.611 baseline as no-query comparison;
- preserved explicit Running_A tier before Running_B Sprint by Travel-profile handoff tuning;
- run `36582612505`: static 6/6 + Combined regression 27/27 + Travel-Walk 14/14 PASS;
- zero runtime/page/console errors;
- artifact `11040906054`, digest `sha256:ae9e6929c02fcf0357fb7c57228d168a64561f7b9d5f21f152ccd8f1f6a3289e`;
- next: dedicated human Pace-Tune Stage.


## 2026-09-29 · GROUND-WALK-PACE-TUNE-01 · PUBLIC VERIFIED
- Draft PR #289 opened for the dedicated pace owner; no merge requested.
- Dedicated Cloudflare Stage published at `/kfb-hub/stage/game-container/ground-walk-pace-tune-01/?ground=1&groundFeel=velocity&walkPace=travel`.
- Cloudflare Pages SUCCESS from publication source `20c1858c2f6cdd0b48136eb8295b7c803a5e12f6`.
- Public Chromium run `36583694971` / job `109458242652`: **13/13 PASS**, exact `d6e9d421...` marker, faster Walk + Run/Sprint + release + Orbit + Hub link, zero runtime/page/console errors.
- Public artifact `11040747449`, digest `sha256:8c1b6f7e9bd53d8637fc814efff2e27ca91beb80629b34d63d7c593ead353fe2`; screenshots `stage.png`, `hub.png`.
- Exactly one next gate: Georg human pace feel at ~1.10 u/s; no merge / Enter-Exit before verdict.


## 2026-09-29 · GROUND-WALK-PACE-TUNE-02 · implementation
- Georg TUNE 2: 1.10 u/s Walking_A still felt like the old slow controller.
- Reframed `walkPace=travel` as exactly two forward gears: W = `Running_A`, Shift = `Running_B` Sprint.
- Travel forward target is now source-backed Running_A speed (~2.4803 u/s); Sprint remains Running_B (~3.028 u/s).
- Removed the Travel-only Walking_A / walk.fast / threshold ladder; measured/no-query path remains intact.
- Jump, backward/strafe, velocity response and Orbit unchanged; tests pending.


## 2026-09-29 · GROUND-WALK-PACE-TUNE-02 · source browser PASS
- exact runtime `4475271b...`; run `36588655547` / job `109475640957`.
- **8/8 static + 10/10 integration + 27/27 Ground+Orbit regression + 16/16 Travel two-gear PASS**; zero runtime/page/console errors.
- W immediately selects `Running_A`; settled normal W = 2.4786 u/s.
- Shift immediately selects `Running_B`; settled Sprint = 3.0263 u/s; release returns directly to `Running_A`.
- Orbit and measured Walking_A comparison profile preserved.
- artifact `11043426976`, digest `sha256:fd09e2adf33efb7c7b70950d3f0b789f40f563158ec84bc2be0177108127601f`.
- next: same Pace-Tune Stage route, refreshed runtime + Hub wording + public proof.


## 2026-09-29 · GROUND-WALK-PACE-TUNE-02 · PUBLIC VERIFIED
- Same canonical owner / Draft PR #289; no second movement owner and no merge.
- Exact runtime `4475271b...` published to the existing Pace-Tune route on `cloudflare-live@92335555295ee84eecfd2c3cec9d01ead98533ab`.
- Public Cloudflare marker gate PASS; public Chromium run `36589579432` / job `109478846810` = **15/15 PASS**.
- Public behavior: W immediately `Running_A`, settles 2.4786 u/s; Shift immediately `Running_B`, settles 3.0263 u/s; release returns directly to `Running_A`; Orbit retained.
- 0 runtime/page/console errors; Hub two-gear link PASS.
- Public artifact `11043990368`, digest `sha256:714159ee306220f12aba2443406e992cf11656b8427f06b15a013a19bd4e6707`; screenshots `stage.png`, `hub.png`.
- Prior 1.10-u/s Walking_A Travel candidate is superseded for human review; old measured profile remains regression/reference only.
- Exactly one next gate: Georg human two-gear feel. No Enter/Exit Kart before verdict.


## 2026-09-29 · GROUND-WALLCLOCK-TIMING-01 · implementation
- Georg TUNE 3: W=Running_A / Shift=Running_B mapping is correct, but world traversal remains slow/ruckly.
- Confirmed live timing bug: `frame()` discarded all wall-clock time beyond 1/30 s while deterministic QA used fixed catch-up slices.
- Replaced live simulation clamp with bounded 1/60-s catch-up slices, max 0.25 s per RAF; render/camera/HUD/audio remain one update per RAF.
- Running_A / Running_B targets unchanged; no speed retune and no new movement owner.
- Added explicit slow-frame timing QA plus full Turbo / Ground+Orbit / Two-Gear regression; tests pending.
