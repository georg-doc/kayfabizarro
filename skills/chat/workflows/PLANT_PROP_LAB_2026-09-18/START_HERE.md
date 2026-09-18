# KFB Plant Prop Lab · Living Plants / Crazy-Cat Botanicals

**Date:** 2026-09-18  
**Status:** PREPARED DONOR / LOOKDEV LANE · P2 · NO RUNTIME OWNERSHIP  
**Tool home:** `tools/plant-prop-lab/`

## Purpose

Create modular KFB plant props from exact GitHub source models, then progressively turn some of them into animated / expressive “living props” without replacing the original meshes.

Primary source families:

1. `media/3D_Assets/Tiny_Treats_House_Plants_1.0_FREE 2/`
2. `media/3D_Assets/SciFI_Ultimate Space Kit_Quaternius/Environment/GLTF/`

The visual idea is a KFB “Crazy-Cat” landscape logic: ordinary trees/plants coexist with oversized potted plants, alien-looking bulbous/spiky/swirl plants and occasional animated character-plants. Scale and placement may be deliberately absurd while the asset source and transform recipe remain precise.

This is a **donor / authoring lab**. It does not become Travel terrain owner, Resident Atlas owner, Game Dev Studio owner, Asset Registry owner or a second animation engine.

## Current source facts

### Tiny Treats House Plants

Unpacked from:

`media/3D_Assets/Tiny_Treats_House_Plants_1.0_FREE 2.zip`

Preserved ZIP blob:

`7f4d1581c6f56d4090f9d728f4b684dceccfff4a`

Extracted tree:

`media/3D_Assets/Tiny_Treats_House_Plants_1.0_FREE 2/`

Current extraction result:

- 233 files;
- 113 GLTF models;
- 113 BIN sidecars;
- 4 PNG images;
- License present;
- ZIP preserved.

Useful modular parts include:

- pot A/B/C/D in small/medium/large;
- saucer A/B in small/medium/large;
- cacti + cactus parts;
- monstera leaves + plants;
- pothos vines + plants;
- sansevieria leaves + plants;
- succulents;
- yucca branches + plants;
- ZZ-plant leaves + plants;
- watering cans / shovel / stacked pots.

### Quaternius Sci-Fi plants

Existing source:

`media/3D_Assets/SciFI_Ultimate Space Kit_Quaternius/Environment/GLTF/`

Useful exact models include:

- `Plant_1.gltf`
- `Plant_2.gltf`
- `Plant_3.gltf`
- `Bush_1.gltf`
- `Bush_2.gltf`
- `Bush_3.gltf`
- `Tree_Blob_1..3.gltf`
- `Tree_Floating_1..3.gltf`
- `Tree_Lava_1..3.gltf`
- `Tree_Light_1..2.gltf`
- `Tree_Spikes_1..2.gltf`
- `Tree_Spiral_1..3.gltf`
- `Tree_Swirl_1..2.gltf`

These models are especially useful for the alien / bulbous / knobbly / stylized branch of the plant vocabulary.

## Read next

1. [MENTAL_MODEL.md](MENTAL_MODEL.md)
2. [FLOATE_DESIGN_BRIEF.md](FLOATE_DESIGN_BRIEF.md)
3. [CHANGELOG.md](CHANGELOG.md)
4. `tools/KFB-ToolBox/kfb-rigs-embed-v3/EMBED_KFB_RIGS_v3.md`
5. `tools/KFB-ToolBox/kfb-rigs-embed-v3/petstudio-v9/studio-v12/pet-eye-rig.v6.js`
6. Game Dev Studio living architecture:
   `skills/chat/workflows/OSM_CITY_SLICE_2026-09-18/GAME_DEV_STUDIO_ASSET_PACKAGING_LIVING.md`

## First bounded slices

### PLANT-0 · Source / measurement atlas

Measure pots, plant roots, bounding boxes, likely insertion depth and visual orientation. Do not alter originals.

### PLANT-1 · Static Frankensteining

Compose exact pot + saucer + one or more plant sources into reusable recipes.

Prove:
- normal houseplant;
- alien plant;
- mixed cluster;
- one oversized landscape specimen.

### PLANT-2 · Pattern / color system

Procedural pot decoration independent from source texture:
- bands;
- stripes;
- dots;
- diamonds;
- zigzags;
- scallops;
- sunburst / simple radial motifs.

Use a KFB palette tied to environment/light calibration. Mexican folk-art / ceramic inspiration may inform geometric rhythm and color, but do not claim cultural authenticity or copy a specific protected artwork.

### PLANT-3 · Prop rig

Add a small transform-based prop rig:
- pot root;
- plant root;
- optional stem/crown pivots;
- wobble/sway/pulse/squash response;
- wind/impact/interaction inputs.

No second physics root and no mandatory skeleton re-rig.

### PLANT-4 · Living Plant

Mount the existing KFB EyeRig onto an explicit plant face host / eye anchor. Optional later brows/mouth only if the same modular host proves useful.

States may include:
- asleep / idle;
- blink;
- gaze;
- surprised;
- happy;
- recoil;
- sway;
- listen / follow player.

Plant may remain non-hostile. “Character” here means expressive presentation, not automatic Combat semantics.

## Consumer uses

Potential later consumers:

- Travel / TinySkies terrain dressing;
- OSM Ehrenfeld / Hürth streets, courtyards, parks;
- Free Roam / Platformer project islands;
- World Atlas room/scene generation;
- Dungeon rooms / indoor gardens;
- KFB Town;
- Game Dev Studio packaging.

No consumer gets automatic ownership or acceptance merely because the Plant Prop Lab can render the composition.
