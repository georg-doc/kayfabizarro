# KFB Asset Librarian · Visual Scene Atlas Preflight · Reference Corpus Index

**Date:** 2026-09-16  
**Status:** `IMPLEMENTED DOCUMENTATION / SOURCE INDEX`  
**Branch:** `chat/kaykit-visual-scene-atlas-preflight-2026-09-16`

## 0. Governing relationship

This document **extends** the canonical KayKit Reference Atlas already present at:

`tools/asset_registry/librarian/_handover/KAYKIT_REFERENCE_ATLAS_2026-09-15/`

It does not replace that Atlas, the generated Asset Registry, the Asset Librarian, ToolBox, Animation Lab, or any consumer runtime owner.

The 2026-09-15 Atlas remains the source for pack coverage, ownership/source verification, purchase-gap analysis, existing observed-demo findings, Resource Picker mapping, and prior tested evidence. This 2026-09-16 preflight adds a **visual-scene reconstruction queue and Claude Design handoff layer**.

## 1. Canonical source roots

### 1.1 Heavy visual reference source

Canonical Dropbox root:

`/CLAUDE/KFB Stunt Car Race/reference/KayKit_PACKS_References_Scenes_Demos`

**SOURCE FACT:** the existing Atlas records this folder as the canonical heavy-media reference source. Paid/Patreon/reference media stays in the reference source and is not republished into public documentation.

### 1.2 GitHub mirror for stable filenames/pointers

`georg-doc/KFB-Stunt-Car-Race/_inbox/KayKit_PACKS_References_Scenes_Demos/`

**SOURCE FACT:** this mirror contains the same working reference corpus used by the previous Atlas pass: named GIF demos, pack overviews/samples, generic promo/content sequences, saved source pages, screenshots, opaque image-host filenames, and one incomplete `.crdownload` artifact.

The mirror is an evidence pointer, not a new Asset/Registry owner.

### 1.3 Canonical structured Atlas foundation

`tools/asset_registry/librarian/_handover/KAYKIT_REFERENCE_ATLAS_2026-09-15/`

Read before doing visual jobs:

- `KAYKIT_REFERENCE_ATLAS_v1.md`
- `KAYKIT_REFERENCE_ATLAS_v1.json`
- `KAYKIT_PACK_COVERAGE_MATRIX.md`
- `KAYKIT_DEMO_SCENE_LEARNINGS.md`
- `KAYKIT_MISSING_PAID_BONUS_GAPS.md`
- `KAYKIT_TOOLBOX_RESOURCE_PICKER_MAPPING.md`
- `BIRTHDAY_STARTER_BUNDLE_REVIEW_2026-09-15.md`
- `RETURN.md`
- `LIVING_STATUS.md`

## 2. Evidence classes for this preflight

Every visual source is classified independently along two axes.

### Source-state axis

- `SOURCE MAPPED` — exact owned source family/path is already known.
- `PARTIALLY MAPPED` — pack/family is known, exact asset mapping is incomplete.
- `REFERENCE ONLY` — visual/source reference exists but owned source mapping is absent or unresolved.
- `CONTEXT WEAK` — filename/sequence is too generic to assign safely without visual/source-page corroboration.
- `INVALID EVIDENCE` — incomplete/download artifact; excluded.

### Review-state axis

- `OBSERVED DEMO EXISTS` — previous Atlas contains an explicit visual observation from an actually reviewed capture.
- `NEEDS VISUAL REVIEW` — source is indexed but no frame/pixel-level scene extraction has been recorded.
- `NEEDS RECONSTRUCTION REVIEW` — some content is already observed, but composition/transforms/camera/lighting relationships still need extraction for a reusable Scene Recipe.
- `DEFERRED` — low-value until higher-confidence anchors are resolved.

## 3. WORLD / BUILDING / ENVIRONMENT corpus

| Cluster | Stable reference pointers | Source state | Review state | Main reconstruction questions |
|---|---|---|---|---|
| Block Bits | `Block_Bits_Overview.png`; `Block_Bits_Sample - VOXEL PYRAMID + STAGE + WRESTLING RING FLOOR + BOXEL BLITZ.png` | `SOURCE MAPPED` to `KayKit_BlockBits_1.0_FREE` | `NEEDS RECONSTRUCTION REVIEW` | grid/stack logic, scale, modular joins, stage/ring/pyramid composition, camera |
| BoardGame Bits | `BoardGame_Bits_Overview.png`; `_Extra`; `BoardGame_Bits_Sample.png`; `Boardgame_Artboard 1.png` | `SOURCE MAPPED` | `NEEDS RECONSTRUCTION REVIEW` | board/token/card-holder spatial grammar, markers, scale, layer order |
| Resource Bits | `Resource_Bits_Overview.png`; `Resource_Bits_Sample_Extra.png` | `PARTIALLY MAPPED` — source ZIP present, Registry blind spot documented | `NEEDS RECONSTRUCTION REVIEW` | resource clusters, work/harvest/mining staging, environmental placement |
| City Builder Bits | `Overview_Extra.png` plus source/archive evidence from prior Atlas | `PARTIALLY MAPPED / OWNED` | `NEEDS RECONSTRUCTION REVIEW` | roads, buildings, blocks, streetscape assembly, town composition |
| Medieval Hexagon | saved reference/source evidence from prior Atlas | `PARTIALLY MAPPED / OWNED` | `NEEDS VISUAL REVIEW` | hex-tile adjacency, paths/roads, elevation/edge logic |
| Space Base Bits | saved reference/source evidence from prior Atlas | `PARTIALLY MAPPED / OWNED` | `NEEDS VISUAL REVIEW` | modular base/road/platform composition; sci-fi world/stunt use |
| Forest Nature | owned source pack; referenced by Kay's Medieval Village WIP | `SOURCE MAPPED` | `NEEDS RECONSTRUCTION REVIEW` | natural scatter/composition, tree/rock integration with buildings/roads |
| Dungeon | owned/indexed source pack and generic backgrounds | `SOURCE MAPPED` | `NEEDS VISUAL REVIEW` | modular room/ground grammar, lighting/backdrop role |
| Holiday Bits | `Holiday_Bits_Sample.png`; `Holiday_Bits_Sample_Extra.png`; saved release page | core pack `MISSING FROM REPO`; EXTRA ownership unresolved per Sep-15 Atlas | `OBSERVED DEMO EXISTS / NEEDS RECONSTRUCTION REVIEW` | gingerbread/platforming assembly, festive decor, glow material, lighting |
| Birthday/cozy-party reuse | no single canonical KayKit demo; use prior Birthday Starter Bundle review + source candidates | `SOURCE MAPPED CANDIDATES` | `NEEDS SCENE DESIGN REVIEW` | living-room/cozy-party staging from reusable furniture/market/decor/backdrop families |
| Orbit 7 / seaside / town-road | distributed environment refs and owned world packs | `PARTIALLY MAPPED` | `NEEDS SCENE DESIGN REVIEW` | beach/water/road/town edge grammar, road continuity, prop density, camera readability |

## 4. SCENE-USE / PROP / PACK-SAMPLE corpus

| Cluster | Stable reference pointers | Source state | Review state | Main questions |
|---|---|---|---|---|
| RPG Tools Bits | `RPG_Tools_Bits_Overview.png`; `RPG_Tools_Bits_Sample_Extra.png` | `SOURCE MAPPED` | `OBSERVED DEMO EXISTS / NEEDS RECONSTRUCTION REVIEW` | workstation clusters, handheld vs placed props, tool adjacency, scale |
| Block Bits scene-use | Block sample + overview | `SOURCE MAPPED` | `NEEDS RECONSTRUCTION REVIEW` | which pieces form reusable set-pieces rather than isolated props |
| BoardGame scene-use | BoardGame sample/overview/artboard | `SOURCE MAPPED` | `NEEDS RECONSTRUCTION REVIEW` | physical markers/cards/dice as world props vs board-only presentation |
| Resource scene-use | Resource overview/sample | `PARTIALLY MAPPED` | `NEEDS RECONSTRUCTION REVIEW` | prop families and environmental affordances |
| Holiday props | Holiday samples + release page | `REFERENCE ONLY / CORE SOURCE GAP` | `OBSERVED DEMO EXISTS / NEEDS RECONSTRUCTION REVIEW` | emissive/glow objects, decor clusters, gingerbread construction |
| Birthday starter candidates | `BIRTHDAY_STARTER_BUNDLE_REVIEW_2026-09-15.md` source list | `SOURCE MAPPED CANDIDATES` | `NEEDS SCENE DESIGN REVIEW` | compact party/living-room scene vocabulary without broad catalog expansion |

## 5. CHARACTER / PERFORMANCE corpus

### 5.1 Named GIF anchors

The stable mirror contains these named character/performance GIF references:

- `LOREKEEPER SET 1.gif`
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
- `Weapons- DEMO - BLASTER - GRIP - POSE August2026_UltraHeroTurboMan.gif`
- `GothGirl.gif`

### 5.2 Current source mapping

The prior Atlas already resolves the semantic monthly sequence:

- Jul 2025 Lorekeeper
- Aug 2025 Orc Brute
- Sep 2025 Cleric
- Oct 2025 Monstrosity
- Nov 2025 Plant Warrior
- Dec 2025 Toy Soldier
- Jan 2026 4GTN / 4GTN_Forgotten
- Feb 2026 Hoarder
- Mar 2026 Avian Swordsman
- Apr 2026 Marksman
- May 2026 Magical Girl
- Jun 2026 Farmers
- Jul 2026 Demon Lord
- Aug 2026 Ultra Turbo Hero Man
- Sep 2026 Goth Girl

**SOURCE FACT:** Demon Lord, Ultra Turbo Hero Man and Goth Girl are physically stored under the historical `KayKit_Mystery_Series6/` parent in current source layout but are semantically Series 7 according to the source-page mapping recorded by the prior Atlas. Do not rename/move source folders in this preflight.

### 5.3 Review state

| Character cluster | Source state | Review state | High-value extraction target |
|---|---|---|---|
| Goth Girl | `SOURCE MAPPED`; local Rig_Medium + microphone/mic-stand/speaker/stool siblings known | `NEEDS RECONSTRUCTION REVIEW` | exact demonstrated action sequence, props, seated/standing alignment, camera/stage composition |
| Cleric | `SOURCE MAPPED` | `NEEDS VISUAL REVIEW` | equipment/action/pose relations |
| Marksman | `SOURCE MAPPED` | `NEEDS VISUAL REVIEW` | ranged grip/aim/recoil pose and weapon relation |
| Magical Girl | `SOURCE MAPPED` | `NEEDS VISUAL REVIEW` | material/glow/FX + performance staging |
| Farmers | `SOURCE MAPPED` | `NEEDS VISUAL REVIEW` | multi-character/tool/work-action staging |
| Ultra Turbo Hero Man | `SOURCE MAPPED`; dedicated blaster/sword/cell/disc source siblings known | `NEEDS RECONSTRUCTION REVIEW` | blaster grip/orientation/pose; attachment evidence must remain source/demo scoped |
| Lorekeeper | `SOURCE MAPPED` | `NEEDS VISUAL REVIEW` | set/prop/performance relation |
| Orc Brute / Monstrosity / Plant Warrior / Hoarder / Avian Swordsman / Demon Lord | `SOURCE MAPPED` | `DEFERRED after priority characters` | nonstandard body/rig/performance, props, FX |

**TESTED RESULT boundary:** the prior Librarian GothGirl `Death_A` 69/69 track-bind/playback result is a narrow Librarian-preview test. It does not make all visual-demo relations generically ToolBox-compatible.

## 6. Generic promo / contents sequences

Stable mirror includes generic sequences such as:

- `promo.png`
- `promo (1).png` through `promo (11).png`
- `contents.png`
- `contents_alt.png`
- `contents (1).png` through `contents (11).png`

Current classification:

`CONTEXT WEAK / DEFERRED`

Rule: do not map by sequence order, filesystem adjacency, or filename similarity alone. Resolve only through one of:

1. direct visual match to a named pack/character capture;
2. saved source-page corroboration;
3. exact source artwork/content image match;
4. otherwise retain `UNRESOLVED`.

## 7. Opaque screenshot / image-host bucket

The mirror also contains numerous hash-like PNG/JPG names, Discord captures, and screenshots. Examples include image-host-like names (`KqbE6G.png`, `8NIPZZ.png`, etc.), `Discord_*.png`, and `screenshot_*.jpg/png`.

Current classification:

`CONTEXT WEAK / NEEDS VISUAL CLASSIFICATION / LOW PRIORITY`

These are not worth exhaustive reconstruction before the named anchors and WORLD NOW jobs have produced reusable Scene Recipes.

## 8. Saved source pages

Known saved pages include:

- `Updates recap! _ Kay Lousberg _ KayKit on Patreon.html`
- `02 Updates recap! _ Kay Lousberg _ KayKit on Patreon.html`
- `KayKit Updates recap November! _ Kay Lousberg _ KayKit on Patreon.html`
- `Holiday Bits _ Released! ... _ Kay Lousberg _ KayKit on Patreon.html`

Use them for release/date/content/source-intent corroboration. They are not runtime evidence.

## 9. Invalid evidence

`Nicht bestätigt 560852.crdownload`

Classification:

`INVALID EVIDENCE`

Do not use it for any Atlas claim.

## 10. What this index changes

### IMPLEMENTED DOCUMENTATION

- one owner-safe corpus map now exists for the Sep-16 Visual Scene Atlas preflight;
- it points back to the Sep-15 canonical Atlas rather than reimplementing it;
- WORLD / SCENE-USE / CHARACTER / GENERIC / OPAQUE / SOURCE-PAGE buckets are separated;
- each bucket has a source state and review state.

### NOT IMPLEMENTED

- no ToolBox feature;
- no asset move/rename/unpack;
- no Registry regeneration;
- no Scene Recipe yet;
- no new visual observation invented from filenames;
- no compatibility promotion.

## 11. Next checkpoint

Create `VISUAL_REVIEW_QUEUE.md` with reconstruction jobs ordered by current product value, then `WORLD_NOW_FAST_LANE.md` for Birthday + Orbit 7 + environment composition before broad character coverage.