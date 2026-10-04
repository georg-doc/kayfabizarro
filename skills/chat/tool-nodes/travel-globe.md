# Project Node · KFB Travel Globe

Status: CURRENT_PROJECT_SSOT
Implementation SSOT: `georg-doc/KFB-Travel-Globe`
Public B0/WIP mirror: https://kayfabizarro.pages.dev/travel/wip/travel_globe_wsa/
Travel/World recovery: https://kayfabizarro.pages.dev/kfb-hub/travel-world.html
Live WB0 / Ground Movement Lab: https://kayfabizarro.pages.dev/travel/wip/travel_globe_wsa/world-builder/?wb0=1
Parallel `/world/` authoring POC: https://kayfabizarro.pages.dev/travel/wip/travel_globe_wsa/world/

## Start order

Read current repository state first, especially:

- current default-branch HEAD;
- `README.md`;
- `MASTERPLAN.md`;
- `HOUSEKEEPING.md`;
- `WSA_START.md`;
- `travel/CONTRACT.md`;
- current `_handover/WORLD_BUILDER_GOD_MODE_2026-09-17/` file when working on WB0/runtime movement;
- `site/world/README.md` + `CHANGELOG.md` when working on the parallel authoring POC;
- current open PR/branch.

## Current lane distinction · 2026-09-17

**Productive runtime proof:** `site/world-builder/`

- PLAY / BUILD / GOD authoring modes;
- GROUND / FLIGHT locomotion switch;
- Ground controls W/S move, A/D turn, Q/E strafe, Shift run, Space jump;
- current character comparison: ActionFigure / Rig_Medium, Monstrosity / Rig_Large, Legacy Warband compatibility/fallback;
- persistent World Recipe and runtime validation;
- static Travel evidence through PR #17: 28/28 PASS + build/verify PASS;
- human browser/gameplay acceptance still required.

**Candidate authoring POC:** `site/world/`

- Object Composer, Route Lab, Resident Prefab Lab, seed/scatter and related authoring-UX experiments;
- outputs candidate recipes only;
- never silently becomes a second terrain, movement, Registry, animation-compatibility or productive-persistence owner.

Flow:

`/world/ POC → Candidate World Recipe → Travel validation → optional promotion`

## Hard ownership

Travel world, terrain, atmosphere, world lighting/audio, productive persistence and runtime locomotion remain Travel-owned. Flight continues through the established Travel owner; the current Ground path is the explicit WB0 candidate/runtime proof. Exactly one locomotion writer may be active at a time.

## Donor routing

Actor/look/pose: FrankenStein Studio current node.
Assets: Asset Librarian.
Animation/motion: Animation Lab node plus `skills/kfb-cartoon-animation_v2.md` when applicable.
Resident composition candidates: Resident Atlas.

Kayfabizarro publication paths are mirrors, never the Travel implementation SSOT.
