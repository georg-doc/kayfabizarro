# C0 · Pack-to-Generator Production Pipeline

**Date:** 2026-09-19  
**Status:** `CURRENT USER DIRECTION · PIPELINE SSOT ADDENDUM`  
**Owner:** Asset Registry / Asset Librarian source truth → Game Dev Studio packaging → ToolBox/Builder/Generator consumers

## User direction

The objective is not a one-off C0 catalog.

The objective is to turn **all current KayKit and Tiny Treats packs** into analysed modular construction kits that can feed pack-specific Builder / Generator equivalents of the existing Dungeon Generator.

Canonical flow:

`Pack source → analysis → Module Library → 3D Module Atlas / sample builds → Asset Librarian → Game Development Studio package → KFB ToolBox / Builder → pack-specific Generator`

## Owner boundaries

### Asset Registry

Owns:
- exact source identity;
- pack/file paths;
- revisions/blobs;
- dependency truth.

Does **not** infer gameplay/building semantics.

### Module Kit sidecars

Derived semantics only:
- family;
- structural/scenery role;
- footprint/measurement evidence;
- connectors/snap candidates;
- collision/support candidates;
- allowed/known combinations;
- sample recipes;
- generator profile.

No source binary copies.

### Asset Librarian

Human pack/module discovery:
- Pack → family → source asset;
- individual 3D preview;
- shared-scale sample builds;
- module evidence/status;
- selection/handoff.

It remains the one asset browser.

### Game Development Studio

Package-first production gate:
- module-kit metadata;
- license/provenance;
- validation;
- preview;
- package receipt;
- later consumer admission.

A metadata candidate is not a sealed GDS package.

### ToolBox / Builder

Consumes proven Module Libraries and Recipes.

It does not become a second Asset Registry or Librarian.

### Generator

Created only after the module grammar and sample builds pass.

Generator logic is **pack-specific**, not one universal algorithm.

## Production stages

### C0-A · Pack Analysis

For every pack:

- closed source roster;
- license/provenance;
- family classification;
- structural vs furnishing/scenery;
- dimensions/pivot/base evidence state;
- connector/snap candidates;
- collision/support role candidates;
- dependency/problems;
- generator-class candidate.

### C0-B · Module Atlas + Sample Builds

For each meaningful family:

1. exact source object in isolation;
2. shared-scale comparison;
3. small hand-authored sample composition;
4. measurement / connector evidence;
5. visual human gate where required.

No generator yet.

### C0-C · Asset Librarian

Expose the same Module Library without copying assets:

`Pack → Family → Module → Preview → Sample Build → Evidence → Handoff`

### C0-D · Game Development Studio

Create a `GameReadyModuleKitPackage` candidate.

Required before sealed status:

- license;
- source digest;
- closed file roster;
- validation policy/result;
- previews/evidence;
- `game-dev package build` receipt;
- `game-dev package verify` receipt.

If `game-dev` is unavailable, status remains candidate/open.

### C1 · KFB Modular Builder Core

Manual authoring first:

`Module Library → place/snap/inspect → SceneRecipe → export/import → reproduce`

### C2 · Generator families

Only proven Builder grammars become generators.

Examples:

- Dungeon / Kitchen / Bathroom / Bakery / Restaurant → room/interior/grid generators;
- Medieval Builder → structure/house/village generator;
- Medieval Hexagon → hex terrain/platform generator;
- City Builder → road/block/city generator;
- Forest Nature / Pretty Park / Picnic → biome/scatter/outdoor scene generator;
- Space Base → base/tube/module generator;
- Furniture → furnishing/layout generator;
- House Plants → plant/prop composer;
- BoardGameBits → board/token/marker composer;
- Mystery/Adventurer/Skeleton character packs → resident/encounter/activity composers;
- weapon/tool packs → loadout/workshop prop composers.

## Current pack scope from Registry

Current Registry snapshot exposes **19 KayKit + 8 Tiny Treats = 27 relevant pack lanes**.

### KayKit · 19

1. `kaykit-adventurers-2-0-free`
2. `kaykit-blockbits-1-0-free`
3. `kaykit-boardgamebits-1-0-free`
4. `kaykit-character-animations-1-1`
5. `kaykit-city-builder-bits-1-0-free`
6. `kaykit-dungeon-pack-1-1-free-2`
7. `kaykit-fantasyweaponsbits-1-0-free`
8. `kaykit-forest-nature-pack-1-0-free`
9. `kaykit-furniture-bits-1-0-free`
10. `kaykit-halloweenbits`
11. `kaykit-legacy`
12. `kaykit-medieval-builder-pack-1-0`
13. `kaykit-medieval-hexagon-pack-1-0-free`
14. `kaykit-mixed-bag-1-free`
15. `kaykit-mystery-series6`
16. `kaykit-restaurant-bits-1-0-free`
17. `kaykit-rpgtoolsbits-1-0-free`
18. `kaykit-skeletons`
19. `kaykit-space-base-bits-1-0-free`

### Tiny Treats · 8

1. `bubbly-bathroom-tiny-treats-1-1`
2. `tiny-treats-baked-goods-1-0-free`
3. `tiny-treats-bakery-interior-1-1-free`
4. `tiny-treats-charming-kitchen-1-1-free`
5. `tiny-treats-homely-house-1-0-free`
6. `tiny-treats-house-plants-1-0-free-2`
7. `tiny-treats-pleasant-picnic-1-0-free`
8. `tiny-treats-pretty-park-1-0-free`

This list is a current Registry snapshot, not permanent hardcoded canon. Re-enumerate Registry at execution time.

## C0-A1 · Charming Kitchen result

### Source analysis

`PASS`

- 118/118 models classified;
- 0 unclassified;
- Build 69;
- Furnish 26;
- Story 23;
- CC0-1.0 source license pinned;
- no source asset copies.

### Module-kit artifacts

Reusable:
- Pack Profile;
- Module Library;
- Generator Profile proposal;
- wall-grammar recipe;
- worktop-run recipe;
- furnished-cell recipe.

### Browser / Librarian integration

`FAIL · ARCHIVED_FAILED_CANDIDATE`

Frozen product head:

`a5a8fcfb25e2ec89ab4346a812870d5b18bf91e6`

Recovery:

`C0_A1_CHARMING_KITCHEN_FAILURE_RECOVERY_2026-09-19/START_HERE.md`

### GDS

Metadata candidate exists.

`game-dev` was unavailable in the execution environment, therefore:
- no sealed package build receipt;
- no package verify receipt;
- no vendor admission.

## Next gate

`C0-A1R · Librarian Wall Grammar Proof`

Start from current main.

Only:
- Pack deep-link;
- one alias;
- one six-asset wall-grammar sample;
- existing Librarian shell;
- zero browser errors.

Do not reapply the failed Librarian `app.js` patch wholesale.

Only after this gate passes may the pipeline continue to worktop/furnished samples, GDS preview and then broader pack scaling.
