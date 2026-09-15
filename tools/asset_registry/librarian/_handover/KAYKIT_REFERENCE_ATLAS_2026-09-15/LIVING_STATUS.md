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

## KayKit pack coverage · current mapping

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

## Mystery Monthly mapping

### Series 6 · SOURCE FACT / OWNED

Repo `media/3D_Assets/KayKit_Mystery_Series6/INDEX.md` identifies the purchased Series 6 web subset as CC0 and maps the full Jul 2025–Jun 2026 roster:

1. Jul 2025 — Lorekeeper
2. Aug 2025 — Orc Brute
3. Sep 2025 — Cleric
4. Oct 2025 — Monstrosity
5. Nov 2025 — Plant Warrior
6. Dec 2025 — Toy Soldier
7. Jan 2026 — 4GTN + 4GTN_Forgotten
8. Feb 2026 — Hoarder
9. Mar 2026 — Avian Swordsman
10. Apr 2026 — Marksman
11. May 2026 — Magical Girl
12. Jun 2026 — Farmer_A + Farmer_B

Dropbox contains demo GIFs for most, but not all, of this roster. Missing demo GIFs do **not** mean missing assets.

### Series 7 · SOURCE FACT / OWNED, physically stored under historical parent

The saved KayKit source page states that **July 2026 starts Series 7**. Current repo already contains:

- Jul 2026 — `DemonLord/`
- Aug 2026 — `UltraTurboHeroMan/`
- Sep 2026 — `GothGirl/`

These are physically located under `media/3D_Assets/KayKit_Mystery_Series6/`, but Atlas semantics must record them as Series 7. Do **not** rename/move the existing source folder as part of this Atlas.

### Series 7 same-collection source assets

**Demon Lord**
- `DemonHeart.gltf`
- `SummoningCircle.gltf`

**Ultra Turbo Hero Man**
- `UltraTurboHeroMan_Blaster.gltf`
- `UltraTurboHeroMan_Sword.gltf`

**Goth Girl**
- `GothGirl_MicStand.gltf`
- `GothGirl_Microphone.gltf`
- `GothGirl_Speaker.gltf`
- `GothGirl_Stool.gltf`

These are **SOURCE FACT / structural sibling assets** only. They are excellent Resource Picker candidates, but no generic attachment, grip, seating or animation compatibility claim follows automatically.

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

## Source-page learnings

### Holiday Bits · 2025-12-08

**SOURCE FACT:** KayKit Holiday Bits core pack launched as free CC0 content with 55+ low-poly models, OBJ/FBX/GLTF formats and a single 1024×1024 gradient atlas. Listed content includes presents, Christmas tree, train/train tracks, festive cookies/snacks, snowman, snowballs, snowball cannon and modular gingerbread pieces.

**SOURCE FACT:** light-bearing assets use a secondary `holiday_glow` material intended for engine emission.

**SOURCE FACT:** an EXTRA tier adds 30+ additional gingerbread-themed assets for platforming levels / gingerbread houses.

**SOURCE FACT:** pack was added to the Complete KayKit Collection.

**REPO GAP:** no Holiday Bits pack/archive was found in current `main` during this pass. Therefore current classification is:
- core FREE pack: `MISSING FROM REPO`
- EXTRA assets: `REFERENCE ONLY / OWNERSHIP UNRESOLVED`

### KayKit update snapshot · 2026-09-15 capture

**SOURCE FACT:** `Mixed Bag 1` is released; 24 viewer-requested assets from KayKit Live Show episodes 0–4. Majority are free with standard FREE/EXTRA/SOURCE tiers. Added to Complete KayKit Collection v7.

**SOURCE FACT / WIP:** Medieval Village is planned as three separate packs:
- Medieval Village Exteriors
- Medieval Village Interiors
- Medieval Villagers Character pack

**SOURCE FACT / DEMONSTRATED COMBINATION:** Village Exteriors WIP uses trees and rocks from the free Forest Nature Pack. Planned/visible source description includes medieval houses, fences, street signs, lanterns, roads, ladders and other props.

**SOURCE FACT:** Kay reports working on Godot scene setup / lighting covering day, night and indoor dungeon lighting. Treat this as reference-learning context, not engine compatibility proof.

### November 2025 development snapshot

**SOURCE FACT:** RPG Weapons & Tools Bits were planned as two separate packs; a Tool Bits release was expected to be accompanied/followed by tool-animation additions.

**SOURCE FACT:** BoardGame Bits WIP already included generic board-game pieces, dominoes, a full 52-card deck + backs in 3D and 2D, and character card holders.

**SOURCE FACT:** KayKit UI/HUD exploration used 3D-modeled elements rendered to images intended for 9-slice modular UI.

**SOURCE FACT / EXPERIMENTAL:** KayKit pixel-art experiments included Adventurers, Skeletons, weapons and dungeon tiles, with no release timeframe at that snapshot.

## Current gap classification

| Reference | Current status | Notes |
|---|---|---|
| BoardGame Bits | OWNED / INDEXED | Pack + references present |
| Block Bits | OWNED / INDEXED | Pack + references present |
| RPG Tools Bits | OWNED / INDEXED | Pack + references present |
| Resource Bits | OWNED / NOT INDEXED | ZIP + reference images present |
| City Builder Bits | OWNED / NOT INDEXED | ZIP present |
| Medieval Hexagon | OWNED / NOT INDEXED | ZIP present |
| Space Base Bits | OWNED / NOT INDEXED | ZIP present |
| Holiday Bits FREE | MISSING FROM REPO | official CC0/free pack exists; no repo copy found |
| Holiday Bits EXTRA | REFERENCE ONLY / OWNERSHIP UNRESOLVED | 30+ extra gingerbread assets documented |
| Mystery Series 6 Jul 2025–Jun 2026 | OWNED / INDEXED | full roster mapped |
| Lorekeeper | OWNED / INDEXED | Series 6, Jul 2025 |
| Orc Brute | OWNED / INDEXED | Series 6, Aug 2025 |
| Cleric | OWNED / INDEXED | Series 6, Sep 2025 |
| Monstrosity | OWNED / INDEXED | Series 6, Oct 2025 |
| Plant Warrior | OWNED / INDEXED | Series 6, Nov 2025 |
| Toy Soldier | OWNED / INDEXED | Series 6, Dec 2025 |
| 4GTN | OWNED / INDEXED | Series 6, Jan 2026 |
| Hoarder | OWNED / INDEXED | Series 6, Feb 2026 |
| Avian Swordsman | OWNED / INDEXED | Series 6, Mar 2026 |
| Marksman | OWNED / INDEXED | Series 6, Apr 2026 |
| Magical Girl | OWNED / INDEXED | Series 6, May 2026 |
| Farmers | OWNED / INDEXED | Series 6, Jun 2026 |
| Demon Lord | OWNED / INDEXED | Series 7, Jul 2026; historical physical parent mismatch |
| Ultra Turbo Hero Man | OWNED / INDEXED | Series 7, Aug 2026; Blaster + Sword siblings |
| Goth Girl | OWNED / INDEXED | Series 7, Sep 2026; Mic Stand + Microphone + Speaker + Stool siblings |
| Mixed Bag 1 | RELEASED / REPO OWNERSHIP UNRESOLVED | Complete Collection v7 source fact; repo mapping pending |
| Medieval Village trilogy | WIP / NOT A PURCHASE GAP YET | source says in development; do not classify as missing released content yet |

## Existing tested evidence to preserve

- Asset Librarian is already a read-only Registry consumer and does not replace Registry or consumer owners.
- Existing documented GothGirl browser test: local `Death_A` preview from `Rig_Medium_General.glb`, 69/69 tracks bound and playback started. This is evidence for that exact preview path only.
- Existing ToolBox concept requires full population-driven KayKit character discovery and a future Coverage / Part Atlas before generic Frankensteining claims.
- Existing Performance Suite concept requires character → rig family → performance family → clip/source → binding result → visual QA, not filename-based compatibility assumptions.
- An old Series 6 `INDEX.md` sentence describes shared-rig retargetability, but current owner discipline requires measured binding + visual QA before promoting this to a generic compatibility claim.

## Current work queue

1. Inspect character-specific animation folders and map named clips/performance families without assuming universal compatibility.
2. Map Pack/Series references against actual Registry pack/collection paths.
3. Resolve `Mixed Bag 1`, released Bits packs and Complete Collection gaps against repo holdings.
4. Continue visual classification where the available connector surface provides actual evidence; do not infer image contents from filenames alone.
5. Distinguish `OWNED / REFERENCE ONLY / MISSING / PAID ADD-ON / UNKNOWN`.
6. Record demonstrated combinations, staging, lighting/material/FX and interactions as `OBSERVED DEMO`, never as compatibility proof.
7. Produce first coverage matrix and missing/paid gap list only after mapping.
8. Defer ToolBox Resource Picker implementation until Atlas findings are stable.

## Planned deliverables

- `KAYKIT_REFERENCE_ATLAS_v1.md`
- `KAYKIT_REFERENCE_ATLAS_v1.json`
- `KAYKIT_PACK_COVERAGE_MATRIX.md`
- `KAYKIT_DEMO_SCENE_LEARNINGS.md`
- `KAYKIT_MISSING_PAID_BONUS_GAPS.md`
- `KAYKIT_TOOLBOX_RESOURCE_PICKER_MAPPING.md`
- `RETURN.md`

## Checkpoint 1

**TESTED RESULT:** canonical Dropbox folder located and top-level inventory obtained; saved KayKit source pages extracted; Series 6 roster mapped exactly; Series 7 Jul–Sep 2026 separated semantically despite historical parent path; Series 7 same-collection props mapped; Holiday Bits release/tier facts resolved; initial source-development roadmap recovered.

**NOT YET TESTED:** frame-by-frame visual interpretation of GIFs; generic promo-image classification beyond filenames; archive contents of the four ZIP-only packs; ownership of Holiday EXTRA / Mixed Bag 1; universal rig/part/motion compatibility.
