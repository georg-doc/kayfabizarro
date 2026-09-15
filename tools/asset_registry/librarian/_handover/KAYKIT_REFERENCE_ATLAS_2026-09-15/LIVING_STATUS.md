# KFB Asset Librarian · KayKit Reference Atlas · Living Status

**Date:** 2026-09-15  
**Branch:** `chat/kaykit-reference-atlas-2026-09-15`  
**Base remote main:** `967d872ea5d0c4894ae55bd9e89a5f1067c49bd1`  
**Status:** ACTIVE LIVING DOCUMENT / READ-ONLY INVENTORY + MAPPING. Not a new Registry or compatibility owner.

## Owner boundary

- `georg-doc/kayfabizarro` remains source / Registry / Librarian repo.
- Asset Librarian remains read-only discovery / recommendation layer.
- ToolBox / Animation Lab / consumer runtimes remain owners of actual rig, part, motion, attachment, physics and gameplay compatibility.
- Dropbox contains heavy visual reference media; GitHub stores structured findings and mappings only.
- Paid / Patreon reference media must not be republished publicly without explicit review.
- Status vocabulary: `SOURCE FACT / OBSERVED DEMO / INFERENCE / PROPOSAL / TESTED RESULT / UNRESOLVED`.

## User continuity requirement

Georg explicitly requested that in-progress Atlas work be saved during the chat so a chat interruption does not lose the research state. This branch is intentionally separate from `main` because Georg reported four local commits ahead of remote main; do not create unnecessary remote-main divergence while those commits remain local.

## Canonical Dropbox source

`/CLAUDE/KFB Stunt Car Race/reference/KayKit_PACKS_References_Scenes_Demos`

- **SOURCE FACT:** folder size `557,327,372` bytes.
- **SOURCE FACT:** two additional `_inbox` variants exist; the `reference/` path is treated as canonical for this Atlas pass.
- **SOURCE FACT:** content is a mixed reference library, not a simple pack mirror: PNG/JPG promo and contents images, large GIF demos, saved Patreon HTML snapshots, screenshots and source-support folders.
- **SOURCE FACT:** one `.crdownload` incomplete-download artifact exists and is not treated as evidence.

## Current Registry baseline

Canonical generated Registry snapshot currently records:

- source commit `11d7df978c63b9e375707bd8d9431b4c8358cda8` (2026-09-12)
- 12,767 indexed assets
- 99 packs
- 4,642 3D models
- 6,442 2D images
- 1,683 audio assets
- 1,335 recorded problems

Registry scope explicitly does **not** claim gameplay roles, license inference, rig compatibility or inferred deck grouping.

## KayKit pack coverage · initial source mapping

### OWNED / INDEXED in Registry

1. `KayKit_Adventurers_2.0_FREE`
2. `KayKit_BlockBits_1.0_FREE`
3. `KayKit_BoardGameBits_1.0_FREE`
4. `KayKit_Character_Animations_1.1`
5. `KayKit_Dungeon_Pack_1.1_FREE 2`
6. `KayKit_FantasyWeaponsBits_1.0_FREE`
7. `KayKit_Forest_Nature_Pack_1.0_FREE`
8. `KayKit_HalloweenBits`
9. `KayKit_Mystery_Series6`
10. `KayKit_RPGToolsBits_1.0_FREE`
11. `KayKit_Skeletons`

Initial Registry evidence totals approximately 1,501 entries across these eleven KayKit packs. `KayKit_Mystery_Series6` alone has 826 entries in the snapshot, including 586 3D models and 240 images; its dependency state includes 272 unresolved items. `KayKit_BoardGameBits_1.0_FREE` records 35 missing dependencies and `KayKit_HalloweenBits` records one missing dependency. Preserve these facts; promo imagery does not upgrade them to runtime compatibility.

### OWNED / NOT STRUCTURALLY INDEXED yet

GitHub `media/3D_Assets/` contains archives for which no matching extracted Registry pack was found in the initial pass:

1. `KayKit_City_Builder_Bits_1.0_FREE.zip`
2. `KayKit_Medieval_Hexagon_Pack_1.0_FREE 2.zip`
3. `KayKit_ResourceBits_1.0_FREE.zip`
4. `KayKit_Space_Base_Bits_1.0_FREE.zip`

Treat as `OWNED / NOT INDEXED`, not `MISSING`, until archive contents and intended import state are checked.

## Dropbox named-reference clusters already identified

### Character / performance GIFs

- `August2025_OrcBrute.gif`
- `September2025_Cleric.gif`
- `October2025_Monstrosity.gif`
- `November2025_PlantWarrior.gif`
- `February2026_Hoarder.gif`
- `March2026_AvianSwordsman.gif`
- `April2026_Marksman.gif`
- `May2026_MagicalGirl.gif`
- `June2026_Farmers.gif`
- `July2026_DemonLord.gif`
- `GothGirl.gif`
- `Weapons- DEMO - BLASTER - GRIP - POSE August2026_UltraHeroTurboMan.gif`
- `LOREKEEPER SET 1.gif`

### Pack / scene reference images

- BoardGame Bits overview/sample images
- Block Bits overview + sample including `VOXEL PYRAMID + STAGE + WRESTLING RING FLOOR + BOXEL BLITZ`
- RPG Tools Bits overview/sample
- Resource Bits overview/sample
- Holiday Bits samples
- Lorekeeper promo/content references
- multiple generic `promo*.png`, `contents*.png`, screenshots and image-host filenames requiring visual classification

### Saved source pages

- `Updates recap! _ Kay Lousberg _ KayKit on Patreon.html`
- `02 Updates recap! _ Kay Lousberg _ KayKit on Patreon.html`
- `KayKit Updates recap November! _ Kay Lousberg _ KayKit on Patreon.html`
- `Holiday Bits _ Released! ... _ Kay Lousberg _ KayKit on Patreon.html`

## Initial gap classification

| Reference | Initial status | Notes |
|---|---|---|
| BoardGame Bits | OWNED | Pack + references present |
| Block Bits | OWNED | Pack + references present |
| RPG Tools Bits | OWNED | Pack + references present |
| Resource Bits | OWNED / NOT INDEXED | ZIP + reference images present |
| City Builder Bits | OWNED / NOT INDEXED | ZIP present |
| Medieval Hexagon | OWNED / NOT INDEXED | ZIP present |
| Space Base Bits | OWNED / NOT INDEXED | ZIP present |
| Holiday Bits | REFERENCE ONLY / UNRESOLVED | reference/Patreon material present; actual asset pack not yet mapped |
| Orc Brute | OWNED | concrete Mystery Series source already documented elsewhere |
| GothGirl | OWNED | concrete source + previous tested motion-preview evidence |
| Lorekeeper | UNRESOLVED MAPPING | reference material present; map before calling missing |
| monthly 2025–2026 characters | UNRESOLVED MAPPING | likely Mystery / bonus context; verify individually |
| UltraHeroTurboMan / blaster demo | UNRESOLVED | demo evidence present; actual source mapping open |

## Existing tested evidence to preserve

- Asset Librarian is already a read-only Registry consumer and does not replace Registry or consumer owners.
- Existing documented GothGirl browser test: local `Death_A` preview from `Rig_Medium_General.glb`, 69/69 tracks bound and playback started. This is evidence for that exact preview path only.
- Existing ToolBox concept requires full population-driven KayKit character discovery and a future Coverage / Part Atlas before generic Frankensteining claims.
- Existing Performance Suite concept requires character → rig family → performance family → clip/source → binding result → visual QA, not filename-based compatibility assumptions.

## Current work queue

1. Visually classify informative Dropbox references by Pack / Series / Character / Environment / Performance.
2. Extract text/source facts from saved Patreon HTML where useful without republishing paid media.
3. Map each identified demo/reference to actual GitHub assets and Registry pack/collection paths.
4. Distinguish `OWNED / REFERENCE ONLY / MISSING / PAID ADD-ON / UNKNOWN`.
5. Record demonstrated combinations, staging, lighting/material/FX and interactions as `OBSERVED DEMO`, never as compatibility proof.
6. Produce first coverage matrix and missing/paid gap list only after mapping.
7. Defer ToolBox Resource Picker implementation until Atlas findings are stable.

## Planned deliverables

- `KAYKIT_REFERENCE_ATLAS_v1.md`
- `KAYKIT_REFERENCE_ATLAS_v1.json`
- `KAYKIT_PACK_COVERAGE_MATRIX.md`
- `KAYKIT_DEMO_SCENE_LEARNINGS.md`
- `KAYKIT_MISSING_PAID_BONUS_GAPS.md`
- `KAYKIT_TOOLBOX_RESOURCE_PICKER_MAPPING.md`
- `RETURN.md`

## Checkpoint 0

**TESTED RESULT:** canonical Dropbox folder located and top-level inventory obtained; GitHub Registry, Librarian ownership docs and ToolBox KayKit/Performance concepts inspected; initial indexed vs archive-only KayKit coverage established.

**NOT YET TESTED:** visual interpretation of the reference images/GIFs; exact monthly-character mapping; paid/free/Patreon status for every reference; archive contents of the four ZIP-only packs; any new compatibility claim.
