# KayKit Creator Lessons · Return

**Date:** 2026-09-19  
**Owner:** KFB Game Dev Studio  
**Repository:** `georg-doc/kayfabizarro`  
**Branch:** `chatgpt-web/kaykit-creator-learning-2026-09-19`  
**Base main head:** `a92e3c70029d811b76a88a15459adc20fea943bb`

## Goal

Create a durable, additive KFB living analysis of Kay Lousberg's creator videos/how-tos, starting with `Using KayKit Characters In Godot (Detailed version)`, and extract engine-independent KayKit production rules that can be used before any Godot integration.

## Actual result

Created:
- `tools/game-dev-studio/research/KAYKIT_CREATOR_LESSONS_LIVING.md`
- `tools/game-dev-studio/research/KAYKIT_CREATOR_LESSONS_SOURCE.json`
- `tools/game-dev-studio/research/KAYKIT_CREATOR_LESSONS_TEST_REPORT.md`
- this Return

The living document currently covers:
- character/rig/animation-library separation;
- `Rig_Medium` vs `Rig_Large`;
- attachment/socket calibration;
- material/texture variants;
- character composition / pick-and-choose;
- state-machine ownership boundaries;
- transition/event timing;
- staged retargeting;
- neutral mannequin/rig-bench proposal;
- current vs legacy KayKit generations;
- Platformer control donors;
- Dungeon/Hex modular/topology-vs-appearance grammar;
- Mixed Bag / Live Show family-vs-file-count lessons;
- functional pack boundaries;
- environment tutorial watchlist.

## Owners kept unchanged

- canonical source identity/provenance: Asset Registry / Asset Librarian;
- package presentation/evidence: KFB Game Dev Studio;
- graft/socket/attachment authoring: ToolBox / FrankenStein;
- animation calibration/retarget preview: Animation owner;
- runtime state/physics/gameplay: named consumer;
- Dungeon/Hex/Platformer scene composition: existing Baukasten/level owner.

No new runtime, Registry or asset-library owner was created.

## Evidence

See `KAYKIT_CREATOR_LESSONS_TEST_REPORT.md`.

Current verified documentation head before metadata wiring:
`1be983ba35606b444b5bd5e75dae8ee44e1f69a0`

## Public route

Existing owner route:
https://kayfabizarro.pages.dev/kfb-hub/free-roam/game-dev-studio/

No new public deployment is claimed by the documentation checkpoint.

## Unresolved

- deep, timestamped extraction of Live Show Episodes 0–4;
- exact URLs for Episodes 0/1/4 before citing them individually;
- creator modeling grammar: primitives, bevels, pivots/origins, part splitting, proportions, material workflow;
- planned environment tutorial is not yet confirmed published;
- all proposed metadata/schema fields remain proposals until separately accepted by their owners;
- no KayKit Rig Bench or Platformer interactive-donor bench is implemented here.

## Exactly one next gate

**KCL-A5 · Deep-watch KayKit Live Show Episodes 0–4 and append creator modeling grammar to the same living document.**

Focus on decisions that let KFB build or adapt KayKit-compatible objects without making Blender a required end-user skill:
- construction primitives;
- proportions;
- bevel/edge language;
- pivots/origins;
- part decomposition;
- material/atlas usage;
- variant policy;
- reusable recipes suitable for browser/tool automation.


## PR / branch review state

- Draft PR: **#107** — `https://github.com/georg-doc/kayfabizarro/pull/107`
- Head at PR creation: `2b7d70a6b6484f29f344e8f4e86e540ff570120d`
- Base: `main@a92e3c70029d811b76a88a15459adc20fea943bb`
- PR state: OPEN · DRAFT · UNMERGED
- Changed files at PR creation: **10**
- Commits at PR creation: **11**
- Additions/deletions at PR creation: **1567 / 0**

Changed files:
1. `kfb-hub/index.html`
2. `skills/chat/CHANGELOG.md`
3. `skills/chat/START_HERE.md`
4. `tools/game-dev-studio/CHANGELOG.md`
5. `tools/game-dev-studio/README.md`
6. `tools/game-dev-studio/RECOVERY.md`
7. `tools/game-dev-studio/research/KAYKIT_CREATOR_LESSONS_LIVING.md`
8. `tools/game-dev-studio/research/KAYKIT_CREATOR_LESSONS_RETURN.md`
9. `tools/game-dev-studio/research/KAYKIT_CREATOR_LESSONS_SOURCE.json`
10. `tools/game-dev-studio/research/KAYKIT_CREATOR_LESSONS_TEST_REPORT.md`

Static documentation/wiring sanity: **9/9 PASS**.

No public Cloudflare deployment was performed for this branch. The existing Game Dev Studio route is not evidence for this revision.


## v0.2 return · animation timing / Mixed Bag source evidence

### Added in this continuation

Source:
`KayKit - Animations - Overview Set 1`
https://www.youtube.com/watch?v=T1KNCtAqJ7A

The video is treated as the visual animation-vocabulary source. State-machine/timeScale implementation lessons are synthesized with the first detailed Godot tutorial and current KFB/Three.js capabilities; current inventory truth comes from current sources, not the 2024 preview.

### Current source evidence

Re-synced during the turn to:
`main@3d9ac78bfabcec0c43fc453c124133764221139c`.

Verified:
- **139** current KayKit Rig_Medium motions / 8 sets;
- Walking_A/B/C + Running_A/B present;
- **no explicit Sprint clip** present;
- Jump_Start / Jump_Idle / Jump_Land present;
- current ranged aim/shoot/reload/bow/magic families present;
- Mixed Bag Registry shard: **47 assets = 41 GLTF + 6 PNG**;
- Mixed Bag source pin: `378b209355b13304e3cff656ec0806ca5b89df28`;
- current EyeRig authoring Hub/Registry/Handover and parallel uploaded Factory+UI file preserved when the branch was synced.

### New KFB synthesis

The living document now specifies:
- locomotion phase/foot-contact synchronization across gait transitions;
- measured speed ↔ playback-rate calibration;
- hysteresis between speed bands;
- short class-specific crossfades + optional temporary warp;
- physics-owned jump state with animation Start / Air / Land;
- phase-relative combat hit/release markers under timeScale;
- stance/equipment-aware locomotion;
- interaction/tool entry-loop-exit graphs;
- candidate `MotionClipProfile` / `MotionTransitionProfile`;
- a bounded measurement-only `Locomotion Sync Bench`.

### Tests / evidence

Static/source/current-main synchronization: **21/21 PASS**.

No runtime or animation-playback PASS is claimed:
- consumer/runtime changes: **0**;
- asset/animation binary changes: **0**;
- measured locomotion clips: **0** in this documentation slice;
- public browser deployment: **0 / NOT CLAIMED**;
- Georg motion acceptance: **OPEN**.

### PR state

- repository: `georg-doc/kayfabizarro`;
- branch: `chatgpt-web/kaykit-creator-learning-2026-09-19`;
- Draft PR: **#107**;
- branch was merged forward from current `main@3d9ac78bfabcec0c43fc453c124133764221139c` without merging PR #107 into main;
- after that sync, compare showed `behind_by = 0` and the intended **10-file** research/router diff.

### CURRENT NEXT GATE OVERRIDE

The previous KCL-A5 Live Show modeling deep-pass stays in research backlog.

The single current next gate is:

**KCL-M1 · Locomotion Sync Bench measurement pass**

Use one verified current `Rig_Medium` actor and only:
`Walking_A`, `Walking_B`, `Walking_C`, `Running_A`, `Running_B`.

Measure:
- left/right foot contacts;
- planted intervals;
- cycle duration;
- acceptable playback-rate range;
- reference translation/speed;
- naive reset transition vs phase-synced transition;
- optional crossfade warp.

Do **not** alter Travel/Race/Combat movement or invent a Sprint source in this gate.
