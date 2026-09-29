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
