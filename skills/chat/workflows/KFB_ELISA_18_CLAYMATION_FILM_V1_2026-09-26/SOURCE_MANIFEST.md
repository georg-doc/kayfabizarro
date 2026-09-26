# KFB Elisa 18 Claymation Film v1 · Source Manifest

Status: **SOURCE-BACKED PREPRODUCTION · VERIFY AGAIN AT G0**

This document separates current source owners, pinned donors, historical references and unresolved film-specific props. A source must be shown in isolation before integrated use.

## 1. Characters

### FrizzleBob · current actor source

Use the current ToolBox/FrankenStein chain, not a copied birthday runtime.

- graft reader: `tools/KFB-ToolBox/kfb-rigs-embed-v3/frizzlegraft-v1/graft-mount.v1.js`
- current graft contract documented as `kfb-rigs-embed-v3/contracts/kfb-pet-graft-driver.v4.json`
- face owner family: `facehost.v1.js`, EyeRig v6, PetMouth and current head-zone modules
- current Ear Rig v5 donor:
  - pin `19088b142c6a7e7626f27fba8e80caf6ab2437c1`
  - `tools/KFB-ToolBox/ear-rig/ear-dangle.v1.js`
  - `tools/KFB-ToolBox/ear-rig/rigs/fb-default.ear-rig.json`
  - `tools/KFB-ToolBox/ear-rig/glb/FB_TEMPLATE_LOOK_v5.glb`
- KFB Motion Library pin used by current ToolBox Production:
  - `032c9d50cd5de6764fa37fec65cb203ed35fcb11`

Current public actor/motion evidence:
`https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/kaykit-motion-lab-v1/` — current project record says **87/87 public browser PASS**; human motion/attachment review remains a separate gate.

Historical Dropbox `FrizzleBob v5 - standalone.html` is reference/provenance only. Do not mount it as a second actor runtime.

### Elisa / GothGirl

Exact current model:
`media/3D_Assets/KayKit_Mystery_Series6/GothGirl/characters/GothGirl.glb`

Current evidence says:
- Rig family: `Rig_Medium`
- use current KayKit Character Animations 1.1 General / MovementBasic / MovementAdvanced where appropriate
- source-face cleanup + EyeRig path from the current EyeRig batch / Resident Card implementation
- current profile reference:
  `tools/KFB-ToolBox/_inbox/KFB Elisa B-Day Reference+Mockups/kfb-pet-gothgirl.json`
- current integrated evidence:
  `tools/KFB-ToolBox/_inbox/KFB Resident Card Speculation Scene/npc-card-spec-01_2026-09-24/`

Old Elisa Birthday colour sheets / mockups in Dropbox are palette, staging and composition references only.

## 2. Clay / material look

Current ClayBound intake:
`tools/KFB-ToolBox/_inbox/KFB Style References/ClayBound Cozy Platformer + Editor/CLAYBOUND_INPUT_INTAKE_2026-09-26.md`

Current gate:
`CLAY-ASSET-01` = one smooth matte clay seamless texture + 3×3 repeat evidence + Georg review.

Until that gate passes:
- use existing KFB clay/material conventions for previsualization;
- do not claim a final ClayBound material;
- preserve geometry, rig and material-zone ownership.

The existing KFB pet/material contract already contains a matte clay preset with fingerprint-detail direction; consume the convention rather than create a second material schema.

## 3. SAE / snack scene · Tiny Treats

Current registry/world-integration donors include:

- `tiny-treats-bakery-interior-1-1-free`
- `tiny-treats-baked-goods-1-0-free`
- `tiny-treats-charming-kitchen-1-1-free`
- `tiny-treats-homely-house-1-0-free`

Current integration slot logic:
`tools/KFB-ToolBox/_inbox/KFB_WORLD_INTEGRATION_01_CLAUDE_DESIGN_SESSION_CUT_2026-09-25_r2/wd-donors.js`

Use:
- Homely House / world shell for building envelope where needed;
- Charming Kitchen for furniture/appliances;
- Baked Goods for visible snacks;
- Bakery Interior only after exact selected files are shown in G0.

Dropbox also contains `Tiny_Treats_Bakery_Interior_1.1_FREE.zip`, `Tiny_Treats_Baked_Goods_1.0_FREE.zip` and `Tiny_Treats_Charming_Kitchen_1.1_FREE.zip`. GitHub/Registry remains the production source of truth.

## 4. Map / quest handoff · KayKit RPGToolsBits

Registry pack:
`registry/assets/v1/packs/kaykit-rpgtoolsbits-1-0-free.json`

Useful exact models include:
- `media/3D_Assets/KayKit_RPGToolsBits_1.0_FREE/Assets/gltf/map.gltf`
- `.../map_rolled.gltf`
- `.../blueprint.gltf`
- `.../blueprint_stacked.gltf`
- `.../compass_base.gltf`

These are excellent for FrizzleBob's gift / dungeon-floor-plan transformation.

### Important key correction

The inspected RPGToolsBits source tree did **not** expose a literal key model.

Verified gold unlock key:
`media/3D_Assets/Platformer Game Kit - Dec 2021/Powerups and Pickups/glTF/Key.gltf`

Use that model for the literal unlock key. Do not relabel it as an RPGToolsBits key.

## 5. Dungeon

Current brief:
`skills/chat/workflows/KFB_MODULAR_MINIGAME_HUB_2026-09-19/DUNGEON_GENERATOR_V2_BRIEF.md`

Rules:
- Dungeon remains fully KayKit Dungeon Pack.
- World Atlas S13.2 remains layout / two-level / stairs / recipe owner.
- Do not mix Tiny Treats assets into the Dungeon.
- Film may stage traps, mobs and combat visually, but Combat remains hit/damage/mob/reward truth owner.
- The film should prefer a small readable room chain over a random asset pile.

## 6. Loot prop · Demon Heart

Exact asset:
`media/3D_Assets/KayKit_Mystery_Series6/DemonLord/assets/gltf/DemonHeart.gltf`

Asset Registry evidence:
`tools/resident_atlas_s6/docs/ASSET_MANIFEST.json`

Related source family:
- Demon Lord · current Series-7 semantic classification
- Rig family `Rig_Large`
- sibling `SummoningCircle.gltf`

Existing Resident Atlas staging already treats the Demon Heart as a floating identity object, which is a good donor for the requested pulse/reveal shot.

Film meaning:
**future dark-psychology quest / campaign teaser only; no exposition dump.**

## 7. Vehicle unlock / drift / stunt

Verified vehicle-pool source list:
`tools/KFB-ToolBox/_inbox/KFB Cartoon Vehicle Deformer Lab v2/WSA_Vehicles_v2_2026-09-18/lab-v7/registry-vehicles.v1.js`

Registry baseline in that donor:
`kfb.asset-registry.v1 @ 34cde3f8f752d481a03c9714f1c3b3a8b2c15c46`

The list contains 22 registry vehicles across:
- `kenney-car-kit`
- `kenney-toy-car-kit`
- `kenney-racing-kit`

G0 shortlist for visual comparison:
- `hatchback-sports`
- `sedan-sports`
- `race-future`
- optional `vehicle-speedster`

Do **not** silently choose from memory. At G0:
1. load the pinned registry URLs,
2. show candidates in isolation,
3. choose one by silhouette/animation suitability,
4. record the exact model path and pin.

The film may depict Tokyo-drift / parking-garage / skyscraper-stunt fantasy, but Race remains physics/telemetry/movement owner.

## 8. OSM / Cologne / grotesque world language

Current public donor:
`https://kayfabizarro.pages.dev/kfb-hub/stage/stunt-world/te01-osm-depth-ink/`

Source route:
`kfb-hub/stage/stunt-world/te01-osm-depth-ink/`

Existing presentation vocabulary:
- OSM semantic geometry
- KFB Ink
- OFF / INK / BEND / TORN
- Grotesque world styling

Use this as motion/presentation language for map/city cuts. Do not fork OSM ingestion or create a second WorldBuilder.

Additional StoryMap donor:
`tools/KFB-ToolBox/_inbox/KFB StoryMap v1/`

Useful mechanisms:
- source-backed map pieces;
- reversible map motion/camera;
- real Grotesque landmark donor;
- future papercraft direction.

## 9. Band / dance / disco finale

Current Orc/performance donor:
`tools/KFB-ToolBox/_inbox/KFB Resident Atlas v3/S39-band-module-01/`

Current production source record pins that band donor at:
`b64d7edca3ec0d184d97f1b3a5db0103332e3e54`

Relevant files:
- `lib/band-module.js`
- `data/resident-band-module-01.json`

Current Disco donor:
`tools/KFB-ToolBox/_inbox/KFB_Resident_Atlas_S9/S40-disco-rotation/`

Useful exact module:
- `lib/disco-ball-core.js`

Also useful:
- S40 FrizzleBob-MC / rotation / playlist staging;
- Resident disco crowd/performance composition.

Consume those presentation donors; do not create a duplicate performance transport.

## 10. Audio

Current accepted reference:
`skills/chat/workflows/KFB_AUDIO_SOUNDSCAPE_BASELINE_V1_2026-09-24/START_HERE.md`

Human status:
**AUDIO-CAL-01 HUMAN_ACCEPTED**

Exact current Stage:
`https://kayfabizarro.pages.dev/kfb-hub/stage/audio-calibration/`

Use the semantic mix contract:
`VOICE | UI | PLAYER_CRITICAL | WORLD_SFX | DIEGETIC_MUSIC | SCORE | LOCAL_AMBIENCE | GLOBAL_BED`

Do not create a universal replacement audio engine.

## 11. Film-specific source still required

### PayPal 3D icon

Requested by Georg. No exact KFB production asset was established in this recon.

G0 rule:
- use an official/user-supplied PayPal mark or a source with explicit provenance;
- extrude/render it as a film-specific prop without changing project branding;
- never include credentials, balances, account numbers or real setup data;
- do not imply PayPal sponsorship/endorsement.

### Painterly sunset / rainbow

Prefer current world sky/light donors plus paper/clay presentation.
A procedural rainbow is acceptable as a film effect, but it must match the physical clay/paper world and not become generic neon UI.

## 12. Dropbox references inspected

Read-only references found:
- FrizzleBob v5 standalone + JS;
- Elisa B-Day Reference+Mockups folder;
- old `KFB World G0 · Elisa Birthday Hero` folder;
- Tiny Treats source ZIPs;
- `KayKit_RPGToolsBits_1.0_FREE.zip` plus extracted pack;
- KFB Stunt Car Race KayKit reference GIFs;
- current/archival Cologne World materials.

These are supporting evidence only. GitHub current state wins.
