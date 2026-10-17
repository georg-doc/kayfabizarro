# #369 · Source isolation

Every file used in this packet was downloaded from `georg-doc/kayfabizarro` at a pinned commit by Blender (5.2.2 LTS, Mac Mini) and checked against its Git blob SHA before use. 123 files, 0 mismatches. The full list with blob SHAs is in `data/SOURCE_PIN_MANIFEST.json`.

## Pins

| Source | Ref | What came from it |
|---|---|---|
| main | `34150cd17ed1975fa5a95304fe8f2756d8ee8697` | Residents, props, Resident Atlas `cast.js`, all read-first contracts |
| KayKit Character Animations 1.1 (registry pin) | `378b209355b13304e3cff656ec0806ca5b89df28` | 14 native animation GLBs (Rig_Medium 8, Rig_Large 6) |
| Motion SSOT · PR #344 | `dfb6b8a15b3f04c52f49825252fcaf60f45df51c` | `KFB_Motion_Library.catalog.json` (395 clips) + 70 lib GLBs |
| Fluff Work Motion donor · PR #356 | `9124366b88e5e317cbba8480412a8b90f84c9d5d` | `KFB_Motion_fluff01.glb` M/L, catalog patch, `kfb_fluff_merge_6to1_reference.glb` |
| Exchange + Reaction donor · PR #358 (not pinned in the brief; Blender-lane donor) | `2a92f2bf2102a3d752cad5615ef1c0d26cc15a8f` | `KFB_Motion_exchange01.glb` M/L, `KFB_Gift_Presents_clay01.glb` |
| ChatterBox semantic donor · PR #357 | `886b8e58135553633dda13d0643dc5844078cb35` | read only: Reaction/Choreography Lab call set and reuse owners |

## Residents shown in isolation (real Atlas actors, no placeholders)

| Atlas resident | Actor | Repo path @ main | Rig family (cast.js) | Measured in Blender |
|---|---|---|---|---|
| farmers | farmer_b | `media/3D_Assets/KayKit_Mystery_Series6/12 - June 2026 - Farmers/Farmer_B.glb` | Rig_Medium | 23 bones, Idle_A binds 23/23, top 2.33 m (hat), head bone z 1.228, handslot gap 0.85 |
| farmers | farmer_a | `.../12 - June 2026 - Farmers/Farmer_A.glb` | Rig_Medium | 23/23, top 2.41 m |
| lorekeeper | lorekeeper | `.../1 - July 2025 - Lorekeeper/Lorekeeper.glb` | Rig_Medium | 23/23, top 2.14 m |
| goth-girl | gothgirl | `.../GothGirl/characters/GothGirl.glb` | Rig_Medium | 23/23, top 2.21 m |
| orc-brute | orcbrute | `.../2 - August 2025 - Orc Brute/OrcBrute.glb` | Rig_Large | 23/23, top 4.19 m, head bone z 3.229, handslot gap 2.352 |

All five GLBs carry 0 embedded animations (matches Atlas: motion comes from the shared rig libraries). Rig_Large handslot gap 2.352 vs Medium 0.85 reproduces the Atlas S20 "factor ≈ 2" finding.

## Props shown

| Prop | Path / source | Used in |
|---|---|---|
| pitchfork, wheelbarrow | `.../12 - June 2026 - Farmers/gltf/` @ main | E4 (wheelbarrow = damaged object) |
| Lorekeeper_Tome | `.../1 - July 2025 - Lorekeeper/gltf/` @ main | loaded, not staged |
| Small Fluff ball `kfb_fluff_small_0/1` | PR #356 `kfb_fluff_merge_6to1_reference.glb` | E1, E4 |
| Clay presents `gift_present-a-cube`, `gift_present-b-round` | PR #358 `KFB_Gift_Presents_clay01.glb` (Kenney CC0 stand-in) | E2, E3 |

## Rig axis facts (measured, both rigs identical)

- Residents face −Y; character left = +X.
- spine / chest / head local +X = pitch forward, +Z = lean to the character's right, +Y = turn the face to the character's left.
- The KFB Motion Library GLBs are joints-only node animation (no skin). Blender imports them as empties. This pass re-evaluates them onto the real resident armature with three.js semantics (clip TRS replaces bone local TRS). Check: frame 0 of `kfb_react_delighted_a` equals native `Idle_A` frame 0 on Farmer_B to 0.000 m / 0.00°.

## Not done

- Rig_Legacy residents (orc-warband, prototype-pete) were not loaded. Their motion is a separate 30-clip legacy file and is not in the brief's proof set.
- The Blender scenes live only in Georg's open Blender session (scenes `369_ISOLATION`, `369_LIB`). No .blend was saved.
