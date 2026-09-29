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
