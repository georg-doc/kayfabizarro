# KFB Asset Librarian · KayKit Visual Scene Atlas Preflight · Living Status

**Date:** 2026-09-16  
**Branch:** `chat/kaykit-visual-scene-atlas-preflight-2026-09-16`  
**Status:** `ASSET-CHAT PREP COMPLETE / READY FOR CLAUDE DESIGN`  
**Execution boundary:** read-only discovery + provenance + source mapping + job preparation. **No Asset-Chat visual reconstruction and no runtime implementation.**

## 1. Governing briefing

Current WSA Lead brief:

`tools/KFB-ToolBox/_inbox/KFB Asset Librarian · Visual Scene Atlas Preflight.md`

The brief defines this Asset Librarian pass as structural preflight for the later Claude Design project:

`KFB Visual Scene Atlas · KayKit Reference Lab`

Existing canonical Atlas foundation remains:

`tools/asset_registry/librarian/_handover/KAYKIT_REFERENCE_ATLAS_2026-09-15/`

Do not duplicate or silently replace established conclusions there.

## 2. Owner boundary — unchanged

### Asset / Registry owner

`georg-doc/kayfabizarro`

Owns source files, generated Registry facts and source provenance.

### Asset Librarian

Owns read-only discovery, preview/reference indexing, candidate grouping and handoff preparation.

### Claude Design / Visual Reference Lab

Owns the actual pixel/frame-level visual interpretation and reconstruction work assigned by the prepared job packets.

### ToolBox / Animation Lab

Own final actor/rig/motion/part/attachment compatibility and measured transforms.

### Consumer runtimes

Town / Travel / Stunt / Combat own their own scene/runtime suitability, collision, physics and integration.

### Current Travel-world owner

Travel/TinySkies remains terrain/sky/light/water/audio owner for the current Birthday/Orbit/coastal world direction. KayKit reference work does not replace that world substrate.

## 3. Status vocabulary — unchanged

Use explicitly:

`SOURCE FACT / OBSERVED DEMO / FILENAME / GEORG NOTE / INFERENCE / PROPOSAL / TESTED RESULT / UNRESOLVED`

A demo relation is not automatically a KFB compatibility result.

## 4. Primary source corpus

### Canonical heavy-media source

`/CLAUDE/KFB Stunt Car Race/reference/KayKit_PACKS_References_Scenes_Demos`

### Stable GitHub mirror / evidence pointer

`georg-doc/KFB-Stunt-Car-Race/_inbox/KayKit_PACKS_References_Scenes_Demos/`

The Stunt mirror is reference/source material only, not Stunt implementation truth.

### Structured Atlas foundation

`tools/asset_registry/librarian/_handover/KAYKIT_REFERENCE_ATLAS_2026-09-15/`

## 5. Canonical visual-review queue — preserve exactly

This remains the governing Reference Lab order:

1. Ultra Turbo Hero Man weapon / grip / pose
2. Goth Girl demo/reference
3. Demon Lord demo/reference
4. Orc Brute
5. Lorekeeper
6. remaining Series 6 monthly demos in chronological order
7. Block Bits annotated/sample references
8. Board Game Bits overview
9. Resource Bits overview
10. Holiday overview
11. remaining monthly-character references
12. cryptic host-named images last

`WORLD_NOW_FAST_LANE.md` is a **separate overlay**. It may surface production-relevant work early only when Georg/Lead explicitly activates it. It does not rewrite this queue.

Every future visual return must state either:

- `TRACK: CANONICAL`
- `TRACK: WORLD_NOW`

## 6. Prep deliverables — COMPLETE

The required prep set now exists on this branch:

1. `REFERENCE_CORPUS_INDEX.md` — complete source/reference corpus map for the visual preflight
2. `VISUAL_REVIEW_QUEUE.md` — canonical queue preserved + WORLD NOW overlay separated
3. `WORLD_NOW_FAST_LANE.md` — Birthday / Orbit 7 / modular world production overlay
4. `VISUAL_JOB_PACKETS/` — canonical and WORLD NOW bounded jobs
5. `SOURCE_ASSET_MATCH_MATRIX.md` — exact/family/unresolved source mapping
6. `SCENE_RECIPE_v0_PROPOSAL.md` — existing `kfb.scene-recipe.v0` visual-preflight profile, proposal only
7. `CLAUDE_DESIGN_START_HERE.md` — execution start brief
8. `RETURN_ASSETCHAT_PREP.md` — completed Asset-Chat handoff return

## 7. Canonical first three jobs — READY

### CQ-001 · Ultra Turbo Hero Man

`VISUAL_JOB_PACKETS/CQ-001_ULTRA_TURBO_HERO_MAN_WEAPON_GRIP_POSE.md`

Established before visual review:

- SOURCE FACT: Rig_Medium
- SOURCE FACT: semantic Series 7 / Aug 2026
- SOURCE FACT: physical source family currently under historical `KayKit_Mystery_Series6/UltraTurboHeroMan/`
- SOURCE FACT: exact same-collection Blaster source path known
- FILENAME / GEORG NOTE: reference explicitly flags `BLASTER · GRIP · POSE`
- UNRESOLVED: actual demonstrated hand/grip/pose transform until frame review
- provenance discrepancy preserved: reference `UltraHeroTurboMan` vs source `UltraTurboHeroMan`

### CQ-002 · Goth Girl

`VISUAL_JOB_PACKETS/CQ-002_GOTH_GIRL_DEMO.md`

Established before visual review:

- SOURCE FACT: Rig_Medium
- SOURCE FACT: semantic Series 7 / Sep 2026
- SOURCE FACT: same-collection Microphone, Mic Stand, Speaker, Stool
- TESTED RESULT: prior narrow Librarian/Birthday binding/playback evidence already documented
- visual-analysis budget: staging/contact/scale/pose/performance composition, not re-proving generic binding

### CQ-003 · Demon Lord

`VISUAL_JOB_PACKETS/CQ-003_DEMON_LORD_DEMO.md`

Established before visual review:

- SOURCE FACT: Rig_Large
- SOURCE FACT: semantic Series 7 / Jul 2026
- SOURCE FACT: exact sibling `DemonHeart.gltf`
- SOURCE FACT: exact sibling `SummoningCircle.gltf`
- UNRESOLVED: actual visual presence/staging/FX relation until GIF review

## 8. WORLD NOW jobs — PREPARED, NOT CANONICAL REORDERING

Prepared packets:

- `VR-001_BIRTHDAY_COZY_PARTY.md`
- `VR-002_ORBIT7_SEASIDE_TOWN_ROAD.md`
- `VR-003_BLOCK_BITS_MULTI_COMPOSITION.md`
- `VR-004_CITY_BUILDER_STREETSCAPE.md`
- `VR-005_RESOURCE_BITS_SCENE_USE.md`

### Birthday boundary

Existing hero casting/motion/Graft contracts remain authoritative. WORLD NOW only prepares scene staging/candidate composition.

### Orbit 7 boundary

Travel/TinySkies remains the actual terrain/coast/water/sky/light owner. KayKit supplies built-environment, prop, modular-layout and reference grammar only.

## 9. Scene Recipe rule — preserved and clarified

`kfb.scene-recipe.v0` remains a `PROPOSAL` only.

This preflight supplies:

`profile: visual-preflight`

It does not create a competing runtime schema.

Maturity remains:

- L0 reference indexed
- L1 visual annotation
- L2 asset-matched
- L3 static reconstruction
- L4 reusable scene recipe
- L5 consumer-tested

Only the receiving consumer may promote to L5.

The first 3–5 Claude Design jobs should prove, simplify or modify v0 before any v1 decision.

## 10. Important source-match preparation now complete

### Ultra Turbo Hero Man

Exact source candidate:

`media/3D_Assets/KayKit_Mystery_Series6/UltraTurboHeroMan/assets/gltf/UltraTurboHeroMan_Blaster.gltf`

Other same-collection siblings are recorded in `SOURCE_ASSET_MATCH_MATRIX.md` without compatibility promotion.

### Goth Girl

Exact source siblings documented:

- `GothGirl_Microphone.gltf`
- `GothGirl_MicStand.gltf`
- `GothGirl_Speaker.gltf`
- `GothGirl_Stool.gltf`

### Demon Lord

Exact source siblings documented:

- `DemonHeart.gltf`
- `SummoningCircle.gltf`

### Forest Nature ↔ Medieval Village

SOURCE FACT preserved: official source material demonstrates Forest Nature trees/rocks in the Village direction.

Relation remains:

`official_companion_pack`

### Archive/source-gap families

City Builder / Medieval Hexagon / Resource Bits remain owned archive/family-level sources where object-level exposure is incomplete. The preflight does not invent per-model Registry assets.

## 11. Asset-Chat evidence boundary

### IMPLEMENTED

- corpus/index preparation
- provenance/source grouping
- exact source mapping where established
- canonical job packet preparation
- WORLD NOW job packet preparation
- visual-preflight recipe proposal
- Claude Design execution brief
- Asset-Chat return

### NOT IMPLEMENTED

- no new pixel/frame-level `OBSERVED DEMO` claims from this Asset-Chat pass
- no visual reconstruction
- no ToolBox implementation
- no runtime scene wiring
- no Registry regeneration
- no ZIP extraction
- no source move/rename
- no attachment/physics/collision/drivability decisions
- no purchase recommendation update

This is intentional. Actual visual evidence must come from the designated visual-analysis owner.

## 12. Current branch snapshot

### Branch head immediately before this Living Status update

`ff71bfb9ee04f236a33ad6b40bb2d3db5874b48d`

### Current `main`

`c495206ba150514df65947793ed4acf18d91859c`

### Merge base

`98932987f4f5e289a2bc6779e5e0b05162f7dd83`

Comparison immediately before this update:

- status: `diverged`
- ahead: 19 commits
- behind: 2 commits

No rebase, merge or force-update has been performed. The prep block was intentionally checkpointed first to protect work from chat timeout/data loss.

## 13. Default NEXT

Hand Claude Design:

`CLAUDE_DESIGN_START_HERE.md`

Default execution:

`TRACK: CANONICAL`

starting with:

`CQ-001_ULTRA_TURBO_HERO_MAN_WEAPON_GRIP_POSE.md`

If Georg/Lead explicitly requests current world-production support, use the requested `WORLD_NOW` packet instead without altering the canonical queue.

## 14. Asset-Chat stop condition

Reached.

The prep is complete enough that the next useful evidence should come from actual visual inspection/reconstruction, not another round of Asset-Chat planning.

Keep this file additive: future returns may append results/maturity updates, but must not erase the provenance, queue or owner boundaries above.