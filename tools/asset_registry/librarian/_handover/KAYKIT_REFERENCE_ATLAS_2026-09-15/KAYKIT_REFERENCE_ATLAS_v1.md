# KFB Asset Librarian · KayKit Reference Atlas v1

**Date:** 2026-09-15  
**Branch:** `chat/kaykit-reference-atlas-2026-09-15`  
**Status:** V1 SOURCE / STRUCTURE / COVERAGE BASELINE. Visual frame-by-frame enrichment remains open.  
**Owner:** Asset Librarian as read-only discovery/reference layer.  
**Not owner of:** Registry truth, licenses inferred from filenames, rig/part/motion compatibility, attachment transforms, gameplay suitability or runtime integration.

## 0 · Purpose

The KayKit Reference Atlas connects three previously separate information layers:

1. **what official KayKit references and source pages demonstrate or describe;**
2. **what KayKit source assets KFB actually has in GitHub / Dropbox;**
3. **what the existing Asset Registry / Librarian / ToolBox can safely discover or test.**

It is not a second file catalog. The generated Asset Registry remains source/file truth; Atlas records contextual knowledge and source relationships that the Registry intentionally does not infer.

## 1 · Evidence vocabulary

Every Atlas claim uses one of these states:

- `SOURCE FACT` — direct source/repo/official-page fact.
- `OBSERVED DEMO` — visually inspected demo fact. **No new frame-level observations are claimed in this v1 connector pass.**
- `FILENAME / GEORG NOTE` — descriptive information recovered from a filename.
- `INFERENCE` — reasoned interpretation, not source truth.
- `PROPOSAL` — possible KFB use/design direction.
- `TESTED RESULT` — concrete KFB test evidence.
- `UNRESOLVED` — insufficient evidence.

Ownership/content states:

- `OWNED / INDEXED`
- `OWNED / ARCHIVE ONLY`
- `REFERENCE ONLY`
- `NOT FOUND IN CONNECTED SOURCES`
- `UNKNOWN`

Coverage parity is tracked separately:

- `STRONG`
- `UNVERIFIED`
- `RISK`
- `N/A`

A pack may be `OWNED / INDEXED` while still having `PARITY RISK`.

## 2 · Source roots

### GitHub

Primary source/Registry/Librarian repo:

`georg-doc/kayfabizarro`

Remote-main baseline observed for this Atlas:

`967d872ea5d0c4894ae55bd9e89a5f1067c49bd1`

Canonical Registry snapshot currently records source commit:

`11d7df978c63b9e375707bd8d9431b4c8358cda8` · 2026-09-12

Registry snapshot:

- 12,767 assets
- 99 packs
- 4,642 3D models
- 6,442 2D images
- 1,683 audio files
- 1,335 recorded problems

The Registry explicitly avoids gameplay roles, license inference, rig compatibility and inferred groupings.

### Dropbox

Canonical heavy-reference root:

`/CLAUDE/KFB Stunt Car Race/reference/KayKit_PACKS_References_Scenes_Demos`

**SOURCE FACT:** 557,327,372 bytes.

Two `_inbox` copies exist. The `/reference/` path is the Atlas canonical reference source.

Content includes:

- PNG/JPG promo/content images;
- large monthly-character GIFs;
- pack samples/overviews;
- saved KayKit/Patreon HTML source pages and their page assets;
- one incomplete `.crdownload`, excluded as evidence.

## 3 · Current KayKit holdings — high-level

### 3.1 OWNED / INDEXED structural packs

Current Registry/source evidence includes:

- Adventurers 2.0 FREE
- Block Bits 1.0 FREE
- Board Game Bits 1.0 FREE
- Character Animations 1.1
- Dungeon Pack 1.1 FREE
- Fantasy Weapons Bits 1.0 FREE
- Forest Nature Pack 1.0 FREE
- Halloween Bits
- Mystery monthly source population
- RPG Tools Bits 1.0 FREE
- Skeletons

Do not interpret this list as current-release parity. See `KAYKIT_PACK_COVERAGE_MATRIX.md`.

### 3.2 OWNED / ARCHIVE ONLY

Current GitHub contains ZIP source but not extracted/indexed pack content for:

- City Builder Bits FREE
- Space Base Bits FREE
- Resource Bits FREE
- Medieval Hexagon FREE

These are source/import hygiene gaps, not acquisition gaps.

### 3.3 Released FREE products not found in connected sources

Current high-confidence source gap list:

- Mixed Bag 1
- Holiday Bits FREE
- Restaurant Bits FREE
- Prototype Bits FREE
- Furniture Bits FREE

This means no matching pack/archive was found in current remote GitHub plus title-based connected Dropbox search. It does **not** prove account non-ownership.

### 3.4 Platformer identity unresolved

KFB has:

`media/3D_Assets/Platformer Game Kit - Dec 2021/`

It is already structurally indexed and consumed by KFB. A current official KayKit Platformer Pack also exists. Provenance/version identity between the old KFB source and the current official product is not yet established.

Status:

`UNRESOLVED IDENTITY` — do not buy, import or call current until compared.

## 4 · Mystery Monthly Atlas

The physical folder:

`media/3D_Assets/KayKit_Mystery_Series6/`

is a historical container name and **must not be used as the logical series classifier**.

### Series 4 · Jul 2023–Jun 2024 · OWNED

| Month | Package |
|---|---|
| 2023-07 | Orc Raider |
| 2023-08 | Driver |
| 2023-09 | Monster Costume |
| 2023-10 | Werewolf |
| 2023-11 | Animatronic |
| 2023-12 | Action Figure |
| 2024-01 | Space Ranger |
| 2024-02 | Ninja |
| 2024-03 | Survivalist |
| 2024-04 | Paladin |
| 2024-05 | Clown |
| 2024-06 | Robot |

Official bundle character count is larger than 12 because some monthly packages contain multiple characters. Atlas currently maps the monthly source folders exactly; per-character expansion is a later detail pass.

### Series 5 · Jul 2024–Jun 2025 · OWNED

| Month | Package |
|---|---|
| 2024-07 | Combat Mech |
| 2024-08 | Superhero |
| 2024-09 | Black Knight |
| 2024-10 | Vampire |
| 2024-11 | Witch |
| 2024-12 | Helpers |
| 2025-01 | FrostGolem |
| 2025-02 | Caveman |
| 2025-03 | Clanker |
| 2025-04 | Protagonists |
| 2025-05 | Hiker |
| 2025-06 | Tiefling |

### Series 6 · Jul 2025–Jun 2026 · OWNED

| Month | Package |
|---|---|
| 2025-07 | Lorekeeper |
| 2025-08 | Orc Brute |
| 2025-09 | Cleric |
| 2025-10 | Monstrosity |
| 2025-11 | Plant Warrior |
| 2025-12 | Toy Soldier |
| 2026-01 | 4GTN + 4GTN_Forgotten |
| 2026-02 | Hoarder |
| 2026-03 | Avian Swordsman |
| 2026-04 | Marksman |
| 2026-05 | Magical Girl |
| 2026-06 | Farmer_A + Farmer_B |

### Series 7 · current monthly sources already OWNED

#### Jul 2026 · Demon Lord

**SOURCE FACT**

- source folder `DemonLord/`
- family-specific animation source: `Rig_Large`
- sibling assets:
  - `DemonHeart.gltf`
  - `SummoningCircle.gltf`

**Potential KFB use — PROPOSAL:** Combat boss, ritual/stage scene, ToolBox prop discovery, performance casting.

#### Aug 2026 · Ultra Turbo Hero Man

**SOURCE FACT**

- source folder `UltraTurboHeroMan/`
- animation source family: `Rig_Medium`
- sibling assets:
  - `UltraTurboHeroMan_Blaster.gltf`
  - `UltraTurboHeroMan_Sword.gltf`

**FILENAME / GEORG NOTE**

Dropbox includes:

`Weapons- DEMO - BLASTER - GRIP - POSE August2026_UltraHeroTurboMan.gif`

This identifies the visual-reference question but does not supply measured grip transforms in v1.

#### Sep 2026 · Goth Girl

**SOURCE FACT**

- source folder `GothGirl/`
- animation source family: `Rig_Medium`
- sibling assets:
  - Mic Stand
  - Microphone
  - Speaker
  - Stool

**TESTED RESULT**

Existing KFB evidence:

- General 15/15 clips bound
- MovementBasic 11/11 bound
- Simulation 14/14 bound
- Special 15/15 bound
- documented `Death_A`: 69/69 tracks bound, playback started
- microphone discovered structurally
- Dance intentionally remained `MISSING` pending visual groove review

This is exact Goth Girl evidence only, not a generic Rig_Medium guarantee.

## 5 · Reference media inventory — named high-value set

### Series / performance references

Dropbox includes named demos for:

- Lorekeeper
- Orc Brute
- Cleric
- Monstrosity
- Plant Warrior
- Hoarder
- Avian Swordsman
- Marksman
- Magical Girl
- Farmers
- Demon Lord
- Ultra Turbo Hero Man
- Goth Girl

Toy Soldier and 4GTN lack equivalent named top-level GIFs in the current reference selection; absence of a demo file does not mean absence of source assets.

### Pack references

Named reference groups include:

- Board Game Bits
- Block Bits
- RPG Tools Bits
- Resource Bits
- Holiday Bits
- Lorekeeper content/promo
- saved official KayKit update/release pages

Generic host-named images remain visually unclassified in v1.

## 6 · Source-derived composition learnings

### Forest Nature ↔ Medieval Village

**SOURCE FACT:** official Village Exteriors WIP reuses Forest Nature trees and rocks.

**Atlas relation:** `official_companion_pack`.

### RPG Tools ↔ Character Animations

**SOURCE FACT:** official Tools release context links Tools content to added tool-oriented character animations; current release information describes 28 tool-animation additions.

**Atlas relation:** `official_motion_companion`.

### Holiday glow

**SOURCE FACT:** light-capable Holiday assets use a secondary `holiday_glow` material intended for emission.

**Potential KFB use — PROPOSAL:** useful material/staging reference for Town, Birthday, Stunt spectacle and stage lighting. Renderer support remains untested.

### Board Game crossover

**SOURCE FACT:** source material describes generic pieces, dominoes, full 52-card deck/backs in 3D/2D and character card holders.

**Potential KFB use — PROPOSAL:** unusually direct bridge between physical KFB deck language and in-world Town/ToolBox props.

### KayKit UI / HUD approach

**SOURCE FACT:** KayKit source exploration models UI elements in 3D, renders them to images and uses them as modular 9-slice UI.

**Potential KFB use — PROPOSAL:** optional presentation reference, not a Librarian UI requirement.

## 7 · Filename-derived reference clues still awaiting visual confirmation

These are **not OBSERVED DEMO claims**.

- Block Bits sample filename identifies `VOXEL PYRAMID + STAGE + WRESTLING RING FLOOR + BOXEL BLITZ`.
- Ultra Turbo Hero Man GIF filename identifies `BLASTER + GRIP + POSE` as the intended inspection target.

They should be first in the future visual-reference pass because they map directly to Stunt/Combat/Performance production questions.

## 8 · Current pack parity risks

### Board Game Bits · PARITY RISK

KFB Registry currently sees only 35 model files and records 35 missing dependencies, while current official FREE release information describes a much larger content set.

Do not call this pack complete until source/version/dependency parity is audited.

### Archive-only packs

City / Space / Resource / Medieval Hexagon cannot contribute individual selectable models to Librarian while opaque in ZIP form. Do not fabricate pseudo-assets from archive names.

### Other indexed packs

Forest, Block, Halloween, Fantasy Weapons, RPG Tools, Skeletons and Adventurers have strong source identity, but exact current FREE-tier parity remains `UNVERIFIED` unless separately compared.

## 9 · Paid / bonus / entitlement state

### Demonstrably present paid/monthly content

Mystery Series 4, 5, 6 source populations and current Series 7 monthly sources are present in GitHub.

### Bits EXTRA/SOURCE tiers

Current connected sources do not establish which EXTRA/SOURCE tiers are owned.

### Bits Bundle 1 / Bits Bundle 2 / Complete KayKit

No matching aggregate archive was found by connected Dropbox title search; GitHub has no entitlement manifest.

Status:

`UNRESOLVED ENTITLEMENT` — do not recommend repurchase until account/download entitlement is checked or Georg confirms it.

## 10 · KFB use map

| Family | Town | Travel | Stunt | Combat | ToolBox | Performance |
|---|---|---|---|---|---|---|
| Mystery characters | high | med | low | high | high | high |
| same-collection character props | high | med | med | high | high | high |
| Forest Nature | high | high | high | med | med | low |
| Board Game Bits | high | low | med | low | high | med |
| Block Bits | high | med | high | high | med | high |
| RPG Tools / Fantasy Weapons | high | med | med | high | high | high |
| Holiday | high | med | high | low | med | high |
| City / Medieval Hexagon | high | high | high | med | low | low |
| Space Base | high | high | high | high | med | med |
| Furniture / Restaurant | high | low | low | low | med | high |
| Prototype | med | med | high | med | high | med |

This is `PROPOSAL` prioritization only.

## 11 · Resource Picker integration direction

**PROPOSAL:** Atlas stays a sidecar lookup keyed by existing immutable Registry/source identity.

Useful relation types:

- `same_collection`
- `official_companion_pack`
- `official_motion_companion`
- `reference_demo`
- `tested_kfb_preview`
- `filename_note`

Existing `kfb.asset-handoff.v1` remains unchanged and candidate-only. Compatibility remains owned by the receiving consumer / ToolBox / Animation Lab.

See `KAYKIT_TOOLBOX_RESOURCE_PICKER_MAPPING.md`.

## 12 · WIP / future official content

Recovered Sep-2026 source material describes a future Medieval Village trilogy:

- Exteriors
- Interiors
- Villagers

Status: `WIP / NOT A CURRENT PURCHASE GAP`.

## 13 · Visual-reference limitation and next visual pass

This v1 has a complete **source/structure/coverage baseline**, but not full frame-level visual annotation.

The connected Dropbox surface does not expose sufficiently reliable image/GIF pixels to this chat for a forensic scene breakdown. Therefore no generic promo image has been labeled by guessing.

Priority future visual pass:

1. Ultra Turbo Hero Man weapon/grip/pose GIF
2. Goth Girl GIF vs mic/stool/speaker sources and existing measured KFB evidence
3. Demon Lord GIF vs Heart/Summoning Circle
4. Orc Brute GIF for large-rig/body-performance staging
5. Block Bits annotated sample
6. Board Game / Resource / Holiday overview sheets
7. remaining monthly-character GIFs
8. cryptic host-named images last

## 14 · Acquisition / cleanup order before purchase recommendation

**PROPOSAL:**

1. recover/check current missing FREE packs first;
2. expose already-owned ZIP-only packs through proper source/indexer workflow;
3. parity-audit Board Game and representative existing packs;
4. resolve current Platformer identity;
5. establish paid Bits/Complete entitlement;
6. only then calculate marginal value of Bundle 1 / Bundle 2 / Complete KayKit.

This avoids buying material already owned, buying paid content before free gaps are closed, or treating an old source version as the current product without proof.

## 15 · Current tested results

- canonical 557 MB Dropbox reference root located and inventoried at top level;
- current GitHub source tree and generated Registry baseline inspected;
- physical Mystery container mapped across Series 4/5/6 plus current Series 7;
- Series 7 same-collection props mapped;
- Series 7 rig-family source folders mapped (`Demon Lord = Large`, Goth Girl / Ultra Turbo Hero Man = Medium source trees);
- Goth Girl existing binding evidence recovered;
- saved official Holiday/update source pages extracted;
- official-current catalog cross-checked against repo holdings;
- global Dropbox title searches used to avoid confusing remote-main gaps with hidden asset archives;
- pack coverage, paid/bonus gaps, demo learnings and Resource Picker mapping saved as separate living deliverables.

## 16 · Unresolved

- frame-by-frame visual interpretation of GIFs/images;
- exact contents/version parity inside ZIP-only packs;
- current Platformer vs 2021 Platformer Game Kit identity;
- paid EXTRA/SOURCE/Bundle/Complete account entitlement;
- per-character expansion of multi-character monthly Mystery packages;
- universal rig/part/motion compatibility — explicitly outside Atlas authority.

## 17 · Companion files

- `LIVING_STATUS.md`
- `KAYKIT_PACK_COVERAGE_MATRIX.md`
- `KAYKIT_DEMO_SCENE_LEARNINGS.md`
- `KAYKIT_MISSING_PAID_BONUS_GAPS.md`
- `KAYKIT_TOOLBOX_RESOURCE_PICKER_MAPPING.md`
- `KAYKIT_REFERENCE_ATLAS_v1.json`
- `RETURN.md`
