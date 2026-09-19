> **CURRENT OVERRIDE · 2026-09-18:** The 15 Sep registry baseline and pack-gap lists below are historical snapshots. Canonical Registry now uses source `eb48f50489b9e4903ec1e3d2fb1837605ce7d792` with **14,226 assets · 5,981 3D models · 107 packs**. New structural pack `kaykit-legacy` contains **389 assets** across five collections: Character Animations 1.2 legacy, Dungeon Pack 1.0 legacy, Skeletons 1.0 legacy, Spooktober 1.1 and Orc Warband. Dungeon 1.0 is extracted at `media/3D_Assets/KayKit Legacy/KayKit Dungeon Pack 1.0 2/` with 202 GLTF/GLB models and does not replace Dungeon 1.1. Recent source updates also made Medieval Builder, Furniture Bits, Restaurant Bits and Space Base Bits available as extracted Registry sources. Current GitHub/Registry state overrides any older “missing/archive-only” row below. Resident-specific Legacy candidates are documented in `tools/resident_atlas_s6/docs/LEGACY_INTAKE_2026-09-18.md`.

# KFB Asset Librarian · KayKit Pack Coverage Matrix

**Date:** 2026-09-15  
**Branch:** `chat/kaykit-reference-atlas-2026-09-15`  
**Status:** WORKING DELIVERABLE / SOURCE MAPPING. Not a purchase recommendation and not a compatibility claim.

## Status key

- `OWNED / INDEXED` — source content is present on remote GitHub `main` and represented by the generated Asset Registry snapshot.
- `OWNED / ARCHIVE ONLY` — an archive is present in GitHub but its content is not structurally available through the Registry.
- `MISSING FROM REMOTE MAIN` — official released pack exists, but no matching source folder/archive was found on current remote `main` during this pass.
- `UNRESOLVED IDENTITY` — a possibly related local source exists, but it has not been proven to be the current official KayKit pack.
- `PARITY STRONG` — repo version/name/source structure closely matches the current official release; still not a runtime compatibility claim.
- `PARITY UNVERIFIED` — pack exists, but free/extra/source completeness against the current official release has not yet been audited.
- `PARITY RISK` — concrete evidence suggests the repo representation may be incomplete, old, or dependency-broken.

The official current catalog is taken from Kay Lousberg's live itch profile on 2026-09-15. Bundles are treated as purchase aggregates, not separate content packs. The itch Complete KayKit page was last updated 2026-08-14 and therefore lags the profile by at least the newly listed `Mixed Bag 1`.

## Current individual KayKit packs on itch vs KFB remote main

| Official pack / series | Official state | Remote GitHub evidence | Registry evidence | Coverage parity | Atlas status | KFB relevance |
|---|---|---|---|---|---|---|
| Mixed Bag 1 | RELEASED; 24 viewer-request assets from KayKit Live Show source snapshot | no matching pack/archive found in current remote-main pass | none found | N/A | **MISSING FROM REMOTE MAIN** | Town / ToolBox / general props |
| Mystery Monthly Series 6 | RELEASED paid character bundle; Jul 2025–Jun 2026 | 12 monthly source folders under historical `KayKit_Mystery_Series6/` container | included in structural `kaykit-mystery-series6` pack | STRONG at monthly-folder level | **OWNED / INDEXED** | Town / ToolBox / Combat / Performance |
| Mystery Monthly Series 5 | RELEASED paid character bundle; Jul 2024–Jun 2025 | 12 monthly source folders under same historical container | included in structural `kaykit-mystery-series6` pack | STRONG at monthly-folder level | **OWNED / INDEXED** | Town / ToolBox / Combat / Performance |
| Mystery Monthly Series 4 | RELEASED paid character bundle; Jul 2023–Jun 2024 | 12 monthly source folders under same historical container | included in structural `kaykit-mystery-series6` pack | STRONG at monthly-folder level | **OWNED / INDEXED** | Town / ToolBox / Combat / Performance |
| Platformer Pack | RELEASED current KayKit pack; 120+ unique free assets, 170+ unique EXTRA | no pack with current official identity found; `Platformer Game Kit - Dec 2021` exists but provenance/current-pack equivalence is not established | separate structural pack `platformer-game-kit-dec-2021` exists | UNVERIFIED / identity mismatch | **UNRESOLVED IDENTITY; do not count as current KayKit yet** | Travel / Stunt / Town / obstacles |
| Forest Nature Pack | RELEASED | `KayKit_Forest_Nature_Pack_1.0_FREE` | 105 model files + 4 images in snapshot | UNVERIFIED | **OWNED / INDEXED** | Town / Travel / Stunt scenery |
| Dungeon Pack 1.1 | RELEASED remastered/current 1.1 | `KayKit_Dungeon_Pack_1.1_FREE 2` | 207 model files + 20 images | STRONG version match; exact tier parity not yet checked | **OWNED / INDEXED** | Town / Combat / interiors |
| Adventurers | RELEASED current character pack | `KayKit_Adventurers_2.0_FREE` | 39 model files + 24 images | STRONG version identity; tier parity unverified | **OWNED / INDEXED** | Town / ToolBox / Combat / Performance |
| Character Animations 1.1 | RELEASED; official page currently lists Rig_Medium + Rig_Large sets | `KayKit_Character_Animations_1.1` | 16 animation GLBs + preview image | STRONG version match | **OWNED / INDEXED** | ToolBox / Combat / Performance |
| Skeletons | RELEASED current character pack | `KayKit_Skeletons` + `KayKit_Skeletons_1.1_FREE.zip` | 25 model files + 9 images in structural pack | UNVERIFIED | **OWNED / INDEXED + archive** | Town / Combat / ToolBox |
| Medieval Hexagon Pack | RELEASED; current line patched to 1.0.1 according to Complete-KayKit devlog | `KayKit_Medieval_Hexagon_Pack_1.0_FREE 2.zip`; older 2026-08 local-library note reported an extracted 221-asset copy, but no extracted current-main folder is visible now | no current structural pack found | VERSION / extraction lag possible | **OWNED / ARCHIVE ONLY** | Town / Travel / world tiles |
| Board Game Bits | RELEASED; current FREE tier advertises 75+ unique models / 162 with recolours; EXTRA adds 65+ and playing-card textures | `KayKit_BoardGameBits_1.0_FREE` | only 35 model files + 14 images; registry records 35 missing dependencies | **PARITY RISK** | **OWNED / INDEXED, completeness unresolved** | Town / physical-deck crossover / props |
| Fantasy Weapons Bits | RELEASED; FREE 25+; EXTRA +15 elemental weapons | `KayKit_FantasyWeaponsBits_1.0_FREE` | 31 model files + 3 images | plausible FREE coverage; not audited | **OWNED / INDEXED** | Combat / ToolBox / Town props |
| RPG Tools Bits | RELEASED; 45+ models; official page notes 28 new tool animations added to Character Animations | `KayKit_RPGToolsBits_1.0_FREE` | 49 model files + 9 images | plausible FREE coverage; not audited | **OWNED / INDEXED** | Town / ToolBox / crafting / Performance |
| Holiday Bits | RELEASED; FREE 55+; EXTRA +30+ gingerbread pieces | no matching pack/archive found | none found | N/A | **FREE: MISSING FROM REMOTE MAIN; EXTRA ownership unresolved** | Town / seasonal / platformer / Birthday |
| Resource Bits | RELEASED; FREE 75+ | `KayKit_ResourceBits_1.0_FREE.zip` | no extracted structural pack found | archive content unverified | **OWNED / ARCHIVE ONLY** | Town / crafting / props |
| Block Bits | RELEASED | `KayKit_BlockBits_1.0_FREE` | 40 model files + 4 images | UNVERIFIED | **OWNED / INDEXED** | Stunt / stage / Town / block worlds |
| Halloween Bits | RELEASED | `KayKit_HalloweenBits` | 36 model files + 4 images; one missing dependency recorded | minor dependency risk | **OWNED / INDEXED** | Town / Combat / seasonal |
| Restaurant Bits | RELEASED; FREE 140+; EXTRA +75+ | no matching KayKit pack/archive found | none found | N/A | **MISSING FROM REMOTE MAIN** | Town interiors / food / props |
| Prototype Bits | RELEASED; FREE 64+; EXTRA +12 + animated character | no matching KayKit pack/archive found; Kenney prototype pack and a BlockBits model named `prototype` are unrelated evidence | none found | N/A | **MISSING FROM REMOTE MAIN** | ToolBox / greybox / Stunt / Town |
| Furniture Bits | RELEASED; FREE 50+; EXTRA +20 + alternate textures | no matching KayKit pack/archive found; Kenney furniture pack is a different source | none found | N/A | **MISSING FROM REMOTE MAIN** | Town interiors / Performance staging |
| Space Base Bits | RELEASED; FREE 48+ | `KayKit_Space_Base_Bits_1.0_FREE.zip` | no extracted structural pack found | archive content unverified | **OWNED / ARCHIVE ONLY** | Town / Travel / sci-fi |
| City Builder Bits | RELEASED; FREE 32+; EXTRA +16 park assets | `KayKit_City_Builder_Bits_1.0_FREE.zip` | no extracted structural pack found | archive content unverified | **OWNED / ARCHIVE ONLY** | Town / Travel / city staging |

## Purchase aggregates — do not treat as missing assets

### Bits Bundle 1

Official bundle combines the EXTRA tiers of:

- City Builder Bits
- Space Base Bits
- Furniture Bits
- Prototype Bits
- Restaurant Bits
- Halloween Bits

Current KFB source state is mixed: City + Space are archive-only, Halloween is indexed, Furniture + Prototype + Restaurant are absent from remote main. Ownership of paid EXTRA tiers is **UNRESOLVED**.

### Bits Bundle 2

Official bundle combines the EXTRA tiers of:

- Block Bits
- Resource Bits
- Holiday Bits
- RPG Tools Bits
- Fantasy Weapons Bits
- Board Game Bits

Current KFB source state is mixed: Block/RPG Tools/Fantasy Weapons/Board Game are indexed, Resource is archive-only, Holiday is absent. Paid EXTRA-tier ownership is **UNRESOLVED**.

### Complete KayKit

Official Complete KayKit states that it includes all currently released KayKit packs at SOURCE tier and future itch releases. The public Complete page currently exposes v6.1 / update 2026-08-14, while Kay's newer source snapshot and current itch profile show `Mixed Bag 1` after that point. Therefore any eventual purchase recommendation must compare **actual account ownership / available downloads**, not just this stale Complete page version label.

## Mystery Series physical-container correction

`media/3D_Assets/KayKit_Mystery_Series6/` is a historical container name, not a reliable series classifier. Current main contains:

### Series 4 · Jul 2023–Jun 2024

Orc Raider · Driver · Monster Costume · Werewolf · Animatronic · Action Figure · Space Ranger · Ninja · Survivalist · Paladin · Clown · Robot.

### Series 5 · Jul 2024–Jun 2025

Combat Mech · Superhero · Black Knight · Vampire · Witch · Helpers · FrostGolem · Caveman · Clanker · Protagonists · Hiker · Tiefling.

### Series 6 · Jul 2025–Jun 2026

Lorekeeper · Orc Brute · Cleric · Monstrosity · Plant Warrior · Toy Soldier · 4GTN / 4GTN_Forgotten · Hoarder · Avian Swordsman · Marksman · Magical Girl · Farmer_A / Farmer_B.

### Series 7 · current monthly Patreon sources already owned in repo

- Jul 2026 Demon Lord — `Rig_Large` animation source family; sibling `DemonHeart`, `SummoningCircle`.
- Aug 2026 Ultra Turbo Hero Man — `Rig_Medium` animation source tree; sibling `Blaster`, `Sword`.
- Sep 2026 Goth Girl — `Rig_Medium`; sibling `MicStand`, `Microphone`, `Speaker`, `Stool`.

Series 7 is not yet represented as a standalone itch series bundle in the current public product catalog. Keep the existing physical source paths unchanged; expose series identity as additive Atlas metadata.

## Coverage risks requiring a parity pass

Pack existence alone is insufficient for `complete` status. Priority parity checks:

1. **Board Game Bits** — repo model count + 35 missing dependencies conflict with current official FREE-tier scale; audit first.
2. **Medieval Hexagon / Resource / City / Space** — archives exist but are invisible to Registry/Librarian until extracted/imported through the proper asset-owner path.
3. **Platformer Pack** — do not equate `Platformer Game Kit - Dec 2021` with the current KayKit Platformer Pack until provenance/version identity is proven.
4. **Forest / Block / Halloween / Fantasy Weapons / RPG Tools / Skeletons / Adventurers** — source identity is strong, but current FREE-tier parity still needs systematic file/version comparison before calling them complete.
5. **Mystery Series container** — structural pack grouping is too coarse for Series 4/5/6/7 semantics; Atlas metadata should supply the series/month mapping without rewriting Registry truth.

## Current high-confidence missing released FREE content

Remote-main evidence currently supports these as released official KayKit products with no matching current pack/archive found:

- Mixed Bag 1
- Holiday Bits FREE
- Restaurant Bits FREE
- Prototype Bits FREE
- Furniture Bits FREE

`Platformer Pack` remains **UNRESOLVED IDENTITY**, not yet placed in this high-confidence missing list because an older `Platformer Game Kit - Dec 2021` source exists and still needs provenance checking.

## Not yet a purchase recommendation

Do **not** buy Complete KayKit yet on the basis of this matrix alone. Next required evidence:

1. inspect archive-only packs and version parity;
2. resolve current Platformer identity;
3. distinguish already-owned Patreon / paid EXTRA / SOURCE material from free-only holdings;
4. quantify missing FREE vs missing paid-only assets by actual KFB use value;
5. only then compare individual/bundle/Complete purchase economics.
