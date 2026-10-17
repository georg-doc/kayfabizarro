# KFB Fluff Work Motion Pack 01 · Part 1 · SOURCE

All paths are relative to the repo root on `georg-doc-patch-3` unless noted.

## Actors (all verified in this pass)

| Actor | File | Rig | Joints | Height (maxY) |
|---|---|---|---|---|
| Robot One | `media/3D_Assets/KayKit_Mystery_Series6/12 - June 2024 - Robot/characters/Robot_One.glb` | Rig_Medium | 23 | 2.17 |
| Robot Two | `media/3D_Assets/KayKit_Mystery_Series6/12 - June 2024 - Robot/characters/Robot_Two.glb` | Rig_Medium | 23 | 2.40 |
| Skeleton Minion (current) | `media/3D_Assets/KayKit_Skeletons/Skeleton_Minion.glb` | Rig_Medium | 23 | 2.17 |
| Orc Raider | Motion Library Medium preview actor | Rig_Medium | 23 | 2.46 |
| Orc Brute | `media/3D_Assets/KayKit_Mystery_Series6/2 - August 2025 - Orc Brute/OrcBrute.glb` | Rig_Large | 23 | 4.19 |

- The joint names are identical across all five actors.
- The legacy Skeleton Minion (Rig_Legacy) was not used.

## Motion donors

**KayKit Character Animations 1.1** (`media/3D_Assets/KayKit_Character_Animations_1.1/Animations/gltf/`):
- `Rig_Medium/Rig_Medium_General.glb`: Interact, PickUp, Throw, Use_Item, Idle_A.
- `Rig_Medium/Rig_Medium_Tools.glb`: Work_*, Working_*, Holding_*, Dig/Digging, Hammer/Hammering, Pickaxe/Pickaxing, Saw/Sawing, Chop/Chopping.
- `Rig_Medium/Rig_Medium_Simulation.glb`: Cheering, Waving, Push_Ups.
- `Rig_Large/Rig_Large_General.glb` and `Rig_Large_Simulation.glb`: Idle_A/B, Hit_A, Death_A, Flexing.
- **`Rig_Large_Tools.glb` does not exist.** It was not loaded or cited.

**KFB Motion Library** (`media/3D_Assets/Animations/KFB_Motion_Library/`):
- `KFB_Motion_Library.catalog.json` (370 clips) + `catalog.patch_an01.json`.
- `libs/Rig_Medium|Rig_Large/KFB_Motion_{locomotion, locomotion_i05, interaction, interaction_i05, perf_an01, action_i04, gesture, gesture_i05, idle, dance}.glb`.
- Clips auditioned:
  - locomotion: wheelbarrow_walk_a/b/c, wheelbarrow_walk_turn_a/b, holding_walk_a, jogging_with_box_a, joyful_jump_a;
  - interaction: wheelbarrow_dump_a, gift_give_a, gift_receive_a, pulling_lever_a, pull_plant_a/b, picking_up_object_a, cow_milking_a, plant_a_plant_a, opening_a_lid_a, watering_a, opening_a;
  - action and gesture: lifting_a, cheering_a, clapping_a, swatting_bugs_a;
  - idle and dance: idle_happy_a, twist_dance_a, chicken_a, swing_dancing_a.
- There is no push/pushing clip in the library.

## Medium → Large retarget (proof, not a delivery)

- **Rest rotations:** identical between Rig_Medium and Rig_Large (max 1−|q·q| = 0.0004, feet and lower legs).
- **Bone lengths:** differ. Large shoulders sit at x 0.884 (Medium 0.212); hips sit at 1.041 (Medium 0.406).
- **Method** (`scripts/rt.py`):
  - copy local rotations;
  - keep the Large rest translations;
  - hips translation = Large rest + (Medium − Medium rest) × 2.564.

## Fluff look

**Parameters** (from K1 lab-clay, on `main` under `tools/KFB-ToolBox/_inbox/KFB Knet-Katalog K1 + Hirnwelt Claymation Reference/KFB_K1_H0_CODEBASE_2026-09-29/lab-clay/`):

| Parameter | Value | K1 file |
|---|---|---|
| Roughness | 0.9 | clay-material.v8 |
| Sheen | 0.18, colour #fff1e0, roughness 0.85 | clay-material.v8 |
| Facet tilt | 0.14 | clay-material.v8 |
| Facet size | 0.65 | clay-material.v8 |
| Print tile | 4.5 | clay-material.v8 |
| Oil | 0.22 | clay-material.v8 |
| Mottle | ±0.05 | clay-material.v8 |
| Soften lump | 0.06, frequency 1.6 | clay-soften.v1 |
| Prop dent | 0.35–0.4 | clay-profiles.v2 |

**Fingerprints:** cgbookcase "Fingerprints 01" via joebinns/clay, the same source K1 names. Taken as the 512 px copy `lab-hud/fingerprints-512.png` from the J15 Claude Design session cut (`scripts/fingerprints-512.png`).

**Palette:** claybound
- knetbar #8b68c7
- accent #f2b632
- ground #ef5a22
- leaf #1f7a3e
- lime #cdc666

Plus optionc knetbar #b86384.

**Low variant values are mine, not K1.** K1 has no High/Low split. I derived Low from the High values:
- lump 0.12 at frequency 2.0;
- sag 0.82;
- facet 0.20;
- dent 0.55;
- roughness 0.94;
- one separated crumb (radius 0.24 R).

**Facets are an approximation.** They are a Voronoi-distance bump, not K1's flat tilted facet planes.

## Bounce reference

- `scripts/bounce_sim.py` writes keyframe data and `scripts/bounce_render.py` builds the glb and the video.
- No external donor. Gravity is 9.81, the restitution values are my choice (see TEST_REPORT).
