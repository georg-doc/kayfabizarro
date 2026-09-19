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
