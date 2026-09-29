# KFB Container Turbo-01 · Additive Changelog

## 2026-09-29 · GROUND-CONTROLLER-DONOR-01 · implementation checkpoint
- sibling branch from B2 browser-pass head `b4c7bb14…`; Orbit B2a remains separate;
- added opt-in clean-room velocity feel under `?groundFeel=velocity`;
- candidate consumes existing Rig_Medium directional/sprint states instead of the old six-state subset;
- candidate Walk uses measured Walking_A speed; Shift ramps Walk/Fast/Run/Sprint with Running_B as top tier;
- actor-scale jump replaces the Voxel-height manual jump only in candidate mode; bounce disabled;
- baseline/no-query B2 behavior remains available for regression;
- browser/CI evidence pending.
