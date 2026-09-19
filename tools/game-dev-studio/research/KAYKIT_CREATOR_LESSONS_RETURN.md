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
