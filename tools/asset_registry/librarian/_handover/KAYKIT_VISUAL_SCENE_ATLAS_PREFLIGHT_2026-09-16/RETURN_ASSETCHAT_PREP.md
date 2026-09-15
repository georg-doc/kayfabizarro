# KFB Asset Librarian · Visual Scene Atlas Preflight · RETURN_ASSETCHAT_PREP

**Date:** 2026-09-16  
**Status:** `PREP BLOCK COMPLETE / READY FOR CLAUDE DESIGN`  
**Branch:** `chat/kaykit-visual-scene-atlas-preflight-2026-09-16`  
**Asset / Registry / Librarian SSOT:** `georg-doc/kayfabizarro`

## 1. Result

The Asset-Chat preflight is complete enough for the visual-analysis owner to start without repeating broad Registry search, provenance research, ownership checks or candidate discovery.

This pass deliberately stopped before visual reconstruction.

## 2. IMPLEMENTED documentation / prep

The required prep deliverable classes now exist on this branch:

1. `REFERENCE_CORPUS_INDEX.md`
2. `VISUAL_REVIEW_QUEUE.md`
3. `WORLD_NOW_FAST_LANE.md`
4. `VISUAL_JOB_PACKETS/`
5. `SOURCE_ASSET_MATCH_MATRIX.md`
6. `SCENE_RECIPE_v0_PROPOSAL.md`
7. `CLAUDE_DESIGN_START_HERE.md`
8. `RETURN_ASSETCHAT_PREP.md`

The canonical 2026-09-15 Atlas remains the source for prior pack/source/ownership/purchase/demo findings:

`tools/asset_registry/librarian/_handover/KAYKIT_REFERENCE_ATLAS_2026-09-15/`

Nothing in this preflight replaces that Atlas.

## 3. Canonical visual-review track is ready

The governing queue remains unchanged.

The first three bounded packets are ready:

1. `VISUAL_JOB_PACKETS/CQ-001_ULTRA_TURBO_HERO_MAN_WEAPON_GRIP_POSE.md`
2. `VISUAL_JOB_PACKETS/CQ-002_GOTH_GIRL_DEMO.md`
3. `VISUAL_JOB_PACKETS/CQ-003_DEMON_LORD_DEMO.md`

### Default next action

Claude Design starts with:

`CQ-001_ULTRA_TURBO_HERO_MAN_WEAPON_GRIP_POSE.md`

unless Georg/Lead explicitly activates the separate WORLD NOW track.

Every canonical return must state:

`TRACK: CANONICAL`

## 4. WORLD NOW overlay is also prepared

WORLD NOW does **not** reorder the canonical queue.

Prepared packets:

- `VISUAL_JOB_PACKETS/VR-001_BIRTHDAY_COZY_PARTY.md`
- `VISUAL_JOB_PACKETS/VR-002_ORBIT7_SEASIDE_TOWN_ROAD.md`
- `VISUAL_JOB_PACKETS/VR-003_BLOCK_BITS_MULTI_COMPOSITION.md`
- `VISUAL_JOB_PACKETS/VR-004_CITY_BUILDER_STREETSCAPE.md`
- `VISUAL_JOB_PACKETS/VR-005_RESOURCE_BITS_SCENE_USE.md`

Use these only when Georg/Lead explicitly asks for current world-production support.

Every such return must state:

`TRACK: WORLD_NOW`

## 5. Scene Recipe state

`kfb.scene-recipe.v0` remains:

`PROPOSAL ONLY`

The preflight file supplies a `visual-preflight` profile, not a competing runtime schema.

The first 3–5 actual Claude Design jobs must prove, simplify or modify v0 before any v1 contract is considered.

Maturity remains:

- L0 reference indexed
- L1 visual annotation
- L2 asset-matched
- L3 static reconstruction
- L4 reusable scene recipe
- L5 consumer-tested

Only a receiving consumer may promote to L5.

## 6. SOURCE FACT / source-match preparation completed

High-value exact source anchors are already supplied where known, including:

### Ultra Turbo Hero Man

- source family: `media/3D_Assets/KayKit_Mystery_Series6/UltraTurboHeroMan/`
- exact blaster: `assets/gltf/UltraTurboHeroMan_Blaster.gltf`
- other same-collection siblings documented in the source-match matrix
- naming discrepancy preserved: reference `UltraHeroTurboMan` vs source `UltraTurboHeroMan`

### Goth Girl

- source family: `media/3D_Assets/KayKit_Mystery_Series6/GothGirl/`
- exact Microphone / Mic Stand / Speaker / Stool paths documented
- local Rig_Medium animation bundles documented
- prior narrow 69/69 Librarian preview result preserved as a scoped `TESTED RESULT`, not generalized

### Demon Lord

- source family: `media/3D_Assets/KayKit_Mystery_Series6/DemonLord/`
- exact `DemonHeart.gltf`
- exact `SummoningCircle.gltf`
- governing preflight source fact: Rig_Large

### WORLD NOW sources

- Block Bits: clean source/Registry family with exact example paths
- RPG Tools: clean source/Registry family with exact example paths
- City Builder / Medieval Hexagon / Resource Bits: already-owned archive/family mappings retained without fake object-level exposure
- Forest Nature: owned/indexed and official companion relation documented
- Holiday: reference/source-page value preserved while repo-source gap remains explicit

## 7. What this Asset-Chat pass did NOT do

### NOT IMPLEMENTED

- no ToolBox implementation
- no Animation Lab implementation
- no Town / Travel / Stunt / Combat runtime wiring
- no Registry regeneration
- no ZIP extraction
- no source-file moves or renames
- no attachment transforms
- no collision / physics / drivability decisions
- no v1 Scene Recipe contract

### No fabricated visual evidence

This Asset-Chat pass did **not** promote filenames, same-folder relations or source adjacency into new `OBSERVED DEMO` claims.

Where pixels/frames still require inspection, that work remains assigned to Claude Design.

Existing `OBSERVED DEMO` findings from the 2026-09-15 Atlas remain valid in their original scope.

## 8. Purchase / paid-gap state

No new purchase recommendation is made by this prep pass.

The prior Atlas remains authoritative for the current purchase/gap picture.

Important distinction preserved:

- already owned + indexed
- already owned but archive/index blind spot
- genuine repo/source gap
- reference-only / paid-extra ownership unresolved

Do not recommend a bundle merely to close indexing gaps in already-owned material.

## 9. Current Git branch state before this RETURN commit

### Preflight branch head before RETURN

`c50e35e83d7f7ce4ceb9f7f7c6f3293de007d80b`

### Current `main`

`c495206ba150514df65947793ed4acf18d91859c`

### Merge base

`98932987f4f5e289a2bc6779e5e0b05162f7dd83`

Latest comparison before RETURN:

- branch status: `diverged`
- ahead of current main: 18 commits
- behind current main: 2 commits

No rebase, merge or force-update was performed during this prep. That is intentional: the documentation block was checkpointed first to protect against chat timeout/data loss.

## 10. Recommended handoff

### Default

Hand Claude Design:

`CLAUDE_DESIGN_START_HERE.md`

and let it execute `CQ-001` first.

### If current world production is more urgent

Georg/Lead may explicitly activate one WORLD NOW packet without changing the canonical queue.

### After the first 3–5 visual returns

Review:

- whether `kfb.scene-recipe.v0` fields proved useful;
- which source matches were strengthened;
- whether any archive-only source now justifies a separate Registry-owner extraction/indexing task;
- which observations are ready for a receiving consumer test.

## 11. Asset-Chat stop condition reached

The preflight has reached its intended handoff boundary:

- corpus organized;
- canonical queue preserved;
- WORLD NOW separated;
- exact high-value source paths supplied;
- bounded visual jobs written;
- recipe proposal prepared;
- Claude Design start brief prepared;
- no competing owner introduced.

Next new evidence should come from **actual visual inspection/reconstruction**, not another Asset-Chat planning layer.