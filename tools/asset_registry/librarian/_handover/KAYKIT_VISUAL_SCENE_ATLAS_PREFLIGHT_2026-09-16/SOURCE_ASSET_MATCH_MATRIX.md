# KFB Asset Librarian · Visual Scene Atlas Preflight · Source Asset Match Matrix

**Date:** 2026-09-16  
**Status:** `IMPLEMENTED DOCUMENTATION / VALIDATION-READY SOURCE MAP`  
**Branch:** `chat/kaykit-visual-scene-atlas-preflight-2026-09-16`

## 0. Contract

This matrix narrows the search space for visual reconstruction. It maps known visual jobs to source families and exact source paths **only where source truth is already established**.

It does not assert:

- scene suitability;
- attachment compatibility;
- collision/physics suitability;
- final scale;
- final transforms;
- that an asset is visible in a demo unless `OBSERVED DEMO` evidence says so.

### Match states

- `EXACT SOURCE` — exact repo path already established.
- `PACK SOURCE` — pack/archive/family is known but object-level mapping is not.
- `STRUCTURAL SIBLING` — authored same-collection source relation; not attachment compatibility.
- `VISUAL TARGET` — reference/mockup, not a runtime asset.
- `REFERENCE ONLY` — visual/source reference exists but source asset is absent/unresolved.
- `BLOCKED` — source indexing/exposure prevents object-level mapping.

## 1. Birthday / Cozy Party

| Role | Candidate / source path | Match state | Evidence | Confidence | Receiving-consumer validation still required |
|---|---|---|---|---|---|
| visual target | `tools/KFB-ToolBox/_inbox/KFB Elisa B-Day Reference+Mockups/mockup elisa b-day 01.png` | `VISUAL TARGET` | existing Birthday review | high | pixel/runtime staging comparison |
| editable visual master | Dropbox `/CLAUDE/KFB Stunt Car Race/_inbox/mockup elisa b-day 01.psd` | `VISUAL TARGET` | existing Birthday review | high | none for source identity; not a runtime asset |
| Little Miss Messy actor | GothGirl source family under `media/3D_Assets/KayKit_Mystery_Series6/GothGirl/` | `PACK SOURCE` | existing Birthday + Atlas evidence | high | receiving consumer uses already tested Birthday actor state |
| cloud candidate | `media/3D_Assets/Platformer Game Kit - Dec 2021/Nature/glTF/Cloud_1.gltf` | `EXACT SOURCE` | `kfb.asset-handoff.v1` + Registry path | high | final visual subset, placement, scale |
| cloud candidates 2/3 | same `Platformer Game Kit - Dec 2021/Nature/glTF/` collection; `Cloud_2.gltf`, `Cloud_3.gltf` named in Birthday review | `PACK SOURCE` | existing review | medium-high | exact path confirmation before automated use; visual selection |
| microphone | `media/3D_Assets/KayKit_Mystery_Series6/GothGirl/assets/gltf/GothGirl_Microphone.gltf` | `STRUCTURAL SIBLING / EXACT SOURCE` | source tree + Atlas | high | hand/stand transform; runtime attachment |
| mic stand | `media/3D_Assets/KayKit_Mystery_Series6/GothGirl/assets/gltf/GothGirl_MicStand.gltf` | `STRUCTURAL SIBLING / EXACT SOURCE` | source tree + Atlas | high | placement/scale; character relation |
| speaker | `media/3D_Assets/KayKit_Mystery_Series6/GothGirl/assets/gltf/GothGirl_Speaker.gltf` | `STRUCTURAL SIBLING / EXACT SOURCE` | source tree + Atlas | high | placement/scale |
| stool | `media/3D_Assets/KayKit_Mystery_Series6/GothGirl/assets/gltf/GothGirl_Stool.gltf` | `STRUCTURAL SIBLING / EXACT SOURCE` | source tree + Atlas | high | seating alignment and runtime use |
| broad party dressing | current Birthday `kfb.asset-handoff.v1` discovery pool: balloons, presents, circus podium/hoop, selected Farmer props, Driver car | `PACK SOURCE` | existing Birthday review | medium | curate tiny subset; exact scene role; source path per chosen item |
| market/environment reuse | market stall/roof, barrel/crate stacks, cart, hay, signs, shovel/trowel, seasonal variants from prior Birthday starter review | `PACK SOURCE` | prior Atlas review | medium | exact path resolution before handoff; visual target match |

### Boundary

`Idle_A`, `Waving`, `Cheering` hero-state results remain consumer/test evidence from the Birthday contract. This matrix does not redefine them as asset matches.

## 2. Orbit 7 / Town / Seaside

| Scene role | Source family | Current match | Evidence | Confidence | Unresolved / next validation |
|---|---|---|---|---|---|
| town/street/building grammar | `KayKit_City_Builder_Bits_1.0_FREE.zip` | `PACK SOURCE` | owned archive + `Overview_Extra.png` mapping in prior Atlas | high pack / low object | exact object paths require source exposure/indexing or manual source inspection by owner |
| natural town edge | `media/3D_Assets/KayKit_Forest_Nature_Pack_1.0_FREE/` | `PACK SOURCE` | owned/indexed; official Medieval Village companion relation | high | exact tree/rock choices; spacing; collision/runtime suitability |
| terrain/tile grammar | `KayKit_Medieval_Hexagon_Pack_1.0_FREE 2.zip` | `PACK SOURCE / BLOCKED` | owned archive | high pack / none object | exact asset exposure and tile adjacency review |
| resource landmark clusters | `KayKit_ResourceBits_1.0_FREE.zip` | `PACK SOURCE / BLOCKED` | owned archive + named overview/sample | high pack / none object | Registry blind spot; visual value first, then Registry-owner recovery decision |
| modular landmark/platform | `media/3D_Assets/KayKit_BlockBits_1.0_FREE/` | `PACK SOURCE` | owned/indexed + named demo | high | exact piece mapping from visual review |
| sci-fi platform/base grammar | Space Base Bits owned source/archive family | `PACK SOURCE` | prior Atlas coverage | medium-high | use only for explicit Orbit 7 sci-fi target; exact object mapping |
| coastline/beach/water | no single KayKit source relation promoted yet | `REFERENCE ONLY / UNRESOLVED` | current preflight target, not source fact | low | receiving scene owner/reference review must identify actual water/beach source |

### Rule

Do not fabricate `road_straight`, `beach_tile`, `water_edge`, etc. as source assets merely because the Scene Recipe needs those semantic roles. Scene roles and Registry/source asset names remain separate.

## 3. Block Bits reconstruction candidates

Source root:

`media/3D_Assets/KayKit_BlockBits_1.0_FREE/`

Known exact source examples:

| Asset | Exact path | Match state | Confidence | Visual-demo use |
|---|---|---|---|---|
| bricks A | `media/3D_Assets/KayKit_BlockBits_1.0_FREE/Assets/gltf/bricks_A.gltf` | `EXACT SOURCE` | high | `UNRESOLVED` until image review |
| bricks B | `media/3D_Assets/KayKit_BlockBits_1.0_FREE/Assets/gltf/bricks_B.gltf` | `EXACT SOURCE` | high | `UNRESOLVED` |
| blue block | `media/3D_Assets/KayKit_BlockBits_1.0_FREE/Assets/gltf/colored_block_blue.gltf` | `EXACT SOURCE` | high | `UNRESOLVED` |
| green block | `media/3D_Assets/KayKit_BlockBits_1.0_FREE/Assets/gltf/colored_block_green.gltf` | `EXACT SOURCE` | high | `UNRESOLVED` |
| red block | `media/3D_Assets/KayKit_BlockBits_1.0_FREE/Assets/gltf/colored_block_red.gltf` | `EXACT SOURCE` | high | `UNRESOLVED` |
| shared texture | `media/3D_Assets/KayKit_BlockBits_1.0_FREE/Assets/gltf/block_bits_texture.png` | `EXACT SOURCE` | high | source dependency/material fact only |

**Registry/source readiness:** the prior Atlas records the pack as owned/indexed with complete model dependencies in the current snapshot.

## 4. RPG Tools reconstruction candidates

Source root:

`media/3D_Assets/KayKit_RPGToolsBits_1.0_FREE/`

| Asset | Exact path | Match state | Confidence | Visual-demo relation |
|---|---|---|---|---|
| anvil | `media/3D_Assets/KayKit_RPGToolsBits_1.0_FREE/Assets/gltf/anvil.gltf` | `EXACT SOURCE` | high | demo visibility/placement to verify |
| axe | `media/3D_Assets/KayKit_RPGToolsBits_1.0_FREE/Assets/gltf/axe.gltf` | `EXACT SOURCE` | high | demo visibility/handheld relation to verify |
| blueprint | `media/3D_Assets/KayKit_RPGToolsBits_1.0_FREE/Assets/gltf/blueprint.gltf` | `EXACT SOURCE` | high | demo visibility/placement to verify |
| stacked blueprint | `media/3D_Assets/KayKit_RPGToolsBits_1.0_FREE/Assets/gltf/blueprint_stacked.gltf` | `EXACT SOURCE` | high | demo visibility/stacking to verify |
| metal bucket | `media/3D_Assets/KayKit_RPGToolsBits_1.0_FREE/Assets/gltf/bucket_metal.gltf` | `EXACT SOURCE` | high | demo visibility/placement to verify |
| shared texture | source collection `tools_bits_texture.png` | `PACK SOURCE` | high family | exact path can be resolved if material validation needs it |
| blueprint material/image | source collection `tools_bits_blueprint.png` | `PACK SOURCE` | high family | exact path can be resolved if visual validation needs it |

**Prior OBSERVED DEMO:** the Sep-15 Atlas visually confirmed overview vocabulary including campfire, anvil, blueprint scrolls, workbench, signpost, shovel, hammer, pickaxe, hatchet and saw. Exact per-pixel sample placement remains reconstruction work.

## 5. BoardGame Bits reconstruction candidates

Source root:

`media/3D_Assets/KayKit_BoardGameBits_1.0_FREE/`

| Candidate family | Source state | Match state | Confidence | Constraint |
|---|---|---|---|---|
| colored D20 variants | exact source models exist in pack, including `D20_blue.gltf`, `D20_green.gltf`, `D20_red.gltf` | `PACK SOURCE` | high family | resolve exact full paths before automated handoff |
| red/blue class badges | source images exist | `PACK SOURCE` | high family | identify exact demo usage |
| skeleton badge/image variants | source images exist | `PACK SOURCE` | high family | do not infer Skeleton pack compatibility from naming alone |
| card holders / deck / generic board pieces | prior official source-page notes + owned pack | `PACK SOURCE` | medium-high | exact source paths and demo layout require review |

**Registry warning:** the prior generated Registry snapshot records 35 missing model dependencies for this pack. Keep that source-health issue separate from visual composition evidence.

## 6. Character / performance source matches

### 6.1 Goth Girl

| Relation | Exact source | State | Confidence | Validation boundary |
|---|---|---|---|---|
| actor family | `media/3D_Assets/KayKit_Mystery_Series6/GothGirl/` | `PACK SOURCE` | high | semantic Series 7 despite historical physical parent |
| microphone | `.../GothGirl/assets/gltf/GothGirl_Microphone.gltf` | `STRUCTURAL SIBLING / EXACT SOURCE` | high | grip/attachment not implied |
| mic stand | `.../GothGirl/assets/gltf/GothGirl_MicStand.gltf` | `STRUCTURAL SIBLING / EXACT SOURCE` | high | transform not implied |
| speaker | `.../GothGirl/assets/gltf/GothGirl_Speaker.gltf` | `STRUCTURAL SIBLING / EXACT SOURCE` | high | placement not implied |
| stool | `.../GothGirl/assets/gltf/GothGirl_Stool.gltf` | `STRUCTURAL SIBLING / EXACT SOURCE` | high | seating alignment not implied |
| local general motion bundle | `.../GothGirl/Animations/gltf/Rig_Medium/Rig_Medium_General.glb` | `EXACT SOURCE` | high | prior narrow Librarian bind/playback evidence only |
| local basic-movement bundle | `.../GothGirl/Animations/gltf/Rig_Medium/Rig_Medium_MovementBasic.glb` | `EXACT SOURCE` | high | no universal retarget claim |

### 6.2 Ultra Turbo Hero Man

Physical source family:

`media/3D_Assets/KayKit_Mystery_Series6/UltraTurboHeroMan/`

Semantic source grouping from prior Atlas: Series 7, Aug 2026.

| Relation | Exact source | State | Confidence | Validation boundary |
|---|---|---|---|---|
| blaster | `media/3D_Assets/KayKit_Mystery_Series6/UltraTurboHeroMan/assets/gltf/UltraTurboHeroMan_Blaster.gltf` | `STRUCTURAL SIBLING / EXACT SOURCE` | high | grip transform still demo/ToolBox work |
| sword | `.../UltraTurboHeroMan/assets/gltf/UltraTurboHeroMan_Sword.gltf` | `STRUCTURAL SIBLING / EXACT SOURCE` | high | no grip claim |
| double sword | `.../UltraTurboHeroMan/assets/gltf/UltraTurboHeroMan_Sword_Double.gltf` | `STRUCTURAL SIBLING / EXACT SOURCE` | high | no grip claim |
| throwing disc | `.../UltraTurboHeroMan/assets/gltf/UltraTurboHeroMan_Throwingdisc.gltf` | `STRUCTURAL SIBLING / EXACT SOURCE` | high | no throw/attachment claim |
| energy cell | `.../UltraTurboHeroMan/assets/gltf/UltraTurboHeroMan_Cell.gltf` | `STRUCTURAL SIBLING / EXACT SOURCE` | high | use relation unresolved |

Reference filename uses `UltraHeroTurboMan`; source tree uses `UltraTurboHeroMan`. Preserve both literal names in evidence; do not silently rewrite history.

### 6.3 Demon Lord

Physical source family:

`media/3D_Assets/KayKit_Mystery_Series6/DemonLord/`

Semantic source grouping from prior Atlas: Series 7, Jul 2026.

Known structural siblings:

- `DemonHeart.gltf`
- `SummoningCircle.gltf`

Exact full object paths should be confirmed at the moment a visual job actually selects them; no behavior/FX relation is implied by the names.

## 7. Holiday reference/source gap

| Reference/feature | Source state | Match state | Confidence | Implication |
|---|---|---|---|---|
| Holiday core pack | prior source-page verification says free CC0 pack exists; repo copy not found in Atlas pass | `REFERENCE ONLY / MISSING FROM REPO` | high for prior verification | no selectable fake source asset |
| Holiday EXTRA gingerbread | source page documents 30+ extra gingerbread assets | `REFERENCE ONLY / OWNERSHIP UNRESOLVED` | high for existence / unresolved ownership | visual learning only until ownership/source confirmed |
| `holiday_glow` | source page documents secondary emission material on light-bearing assets | `REFERENCE ONLY SOURCE FACT` | high | Scene Recipe may record glow intent; no engine implementation claim |

## 8. Source-match output rules for Claude Design

When Claude Design selects an object from a reference, return one of:

```text
MATCH = exact
source_path = <exact repo path>
confidence = high
basis = exact source identity / visual match
```

```text
MATCH = family-only
source_family = <pack/folder/archive>
confidence = medium
basis = source family known; exact model not yet proven
```

```text
MATCH = unresolved
candidate = <description>
confidence = low
basis = visual only / ambiguous source identity
```

Never fill an exact path by guessed filename construction.

## 9. Current source-match readiness

- Birthday hero/signature-prop source mapping: **strong**.
- Block Bits object-level candidate source pool: **strong**, visual identification pending.
- RPG Tools object-level candidate source pool: **strong**, visual placement pending.
- BoardGame: **pack strong / source health degraded / exact layout pending**.
- City Builder / Medieval Hexagon / Resource / Space Base: **pack-level mapping strong enough for visual jobs; object-level source exposure incomplete**.
- Goth Girl / Ultra Turbo Hero Man: **same-collection prop source mapping strong; transforms/compatibility deliberately unresolved**.
- Holiday: **reference/source-page knowledge strong; repo ownership/source gap remains**.

## 10. Next checkpoint

Define `SCENE_RECIPE_v0_PROPOSAL.md` so visual reconstruction can return reusable structured composition evidence without creating a new runtime or Registry contract.