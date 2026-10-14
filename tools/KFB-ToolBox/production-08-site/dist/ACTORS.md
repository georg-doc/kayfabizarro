# ACTORS · roster of Production-08

| id | Display name | GLB / source | Commit | Blob |
|---|---|---|---|---|
| frizzlebob-driver | FrizzleBob · Driver Graft | graft-mount.v1 (`tools/KFB-ToolBox/kfb-rigs-embed-v3/frizzlegraft-v1/graft-mount.v1.js#mountGraft`) + profile `…/BIRTHDAY_STARTSCREEN_2026-09-15/profiles/kfb-pet-graft-driver.georg-2026-09-15.json` | 8922d4b1329fbd47b8754db9dd04ca6b9eb0ee9e | SOURCE_REQUIRED (not recorded) |
| **frizzlebob-earrig-v5** | FrizzleBob · Ear Rig v5 | **`tools/KFB-ToolBox/ear-rig/glb/FB_TEMPLATE_LOOK_v5b.glb`** | **23615cffb515d03d2b6a0164b896dd08e3bc1bed** (georg-doc-patch-3) | SOURCE_REQUIRED |
| kaykit-orcbrute | Orc Brute | `media/3D_Assets/KayKit_Mystery_Series6/2 - August 2025 - Orc Brute/OrcBrute.glb` (+ orcbrute_texture_A.png) | 891eadf01e218f5fc21387e64cea1fec8332c5b6 | SOURCE_REQUIRED |
| legacy-warband | Warband Orc · Builder | rig `media/3D_Assets/KayKit Legacy/KayKit Character Animations 1.2 - legacy/Animations/gltf/KayKit_AnimatedCharacter_v1.2.glb` + parts `…/Orc Warband - legacy/characters/gltf/character_orcA.gltf / character_orcB.gltf` + props (sword, hammerAxe, shield, banner) | 10a7fdce6b3a1ae22504ade71b7dbec5f25e0ff0 | SOURCE_REQUIRED |
| pet-<name> ×24 | Cube Pet · <Name> | `media/3D_Assets/GLB_cube-pets/…` via pet-library.v6 PET_BASE | **main (unpinned)** | — |

The 24 Cube Pets: bunny, cat, fox, tiger, lion, penguin, panda, koala, deer, monkey, pig, hog, cow, polar, beaver, giraffe, chick, fish, parrot, bee, crab, caterpillar, elephant, dog.

## Which GLB does `frizzlebob-earrig-v5` load?
**v5b.** `EAR.fig = 'glb/FB_TEMPLATE_LOOK_v5b.glb'` at `EAR.figPin = 23615cff…`. The v5 path (`EAR.figV5` @19088b14) is only taken when `this._earFigV5` is true. Nothing in P08 sets that flag: v5 loads only inside the ear acceptance run, which compares v5 and v5b. The export also writes `source.glb` = v5b, but keeps `variant: 'earrig-v5'` and the id (A2).

## Other models (references, not copied)
- Ear rig JSON: `tools/KFB-ToolBox/ear-rig/rigs/fb-default.ear-rig.json` @19088b14
- Hair donor: `tools/KFB-ToolBox/kfb-rigs-embed-v3/petstudio-v9/assets/models/FrizzleBob_Yellow.gltf` @eabc87255ee3da6283f9d438390454d70e9d2e55
- Motion: Motion Library 01 @032c9d50 (`media/3D_Assets/Animations/KFB_Motion_Library/`), v3 @4fa08271, KayKit stock `media/3D_Assets/KayKit_Character_Animations_1.1/Animations/gltf/Rig_<Medium|Large>/…` @b97b5ac5
- Stages: resident scenes `tools/resident_atlas/scenes/` @8922d4b1 · band S39 @b64d7edc
