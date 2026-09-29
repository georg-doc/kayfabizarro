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
