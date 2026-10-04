# Floate Design Brief · KFB Crazy-Cat Plant Prop Lab

**Date:** 2026-09-18  
**Status:** DESIGN / AUTHORING BRIEF · EXPORT / HANDOFF ONLY  
**GitHub push:** do not rely on Floate Design being able to push. Return a clean project/export package + preview; Web Lead integrates later.

## Mission

Build a **modular KFB Plant Prop workbench** that composes existing GitHub plant/pot assets into reusable static, rigged and optionally living plant props.

Visual idea:

> normal houseplants + alien Quaternius botanicals + deliberately oversized potted plants in KFB landscapes, rooms, project islands and city scenes.

Think “Crazy-Cat logic”: familiar domestic objects may appear at absurd landscape scale and still keep their recognizable pot/plant identity.

Do not build a full game or World runtime.

## Read first

GitHub sources:

1. `skills/chat/workflows/PLANT_PROP_LAB_2026-09-18/START_HERE.md`
2. `skills/chat/workflows/PLANT_PROP_LAB_2026-09-18/MENTAL_MODEL.md`
3. `tools/KFB-ToolBox/kfb-rigs-embed-v3/EMBED_KFB_RIGS_v3.md`
4. `tools/KFB-ToolBox/kfb-rigs-embed-v3/petstudio-v9/studio-v12/pet-eye-rig.v6.js`

Primary assets:

### Tiny Treats House Plants

`media/3D_Assets/Tiny_Treats_House_Plants_1.0_FREE 2/`

Use exact source files from GitHub.

Key modular parts:

- pots A/B/C/D, small/medium/large;
- saucers;
- monstera / pothos / sansevieria / yucca / ZZ plant parts;
- cacti;
- succulents;
- watering cans / shovel / stacked pots.

### Quaternius Sci-Fi botanical donors

`media/3D_Assets/SciFI_Ultimate Space Kit_Quaternius/Environment/GLTF/`

Focus first on:

- Plant_1 / Plant_2 / Plant_3;
- Bush_1..3;
- Tree_Blob_1..3;
- Tree_Floating_1..3;
- Tree_Lava_1..3;
- Tree_Light_1..2;
- Tree_Spikes_1..2;
- Tree_Spiral_1..3;
- Tree_Swirl_1..2.

Do not duplicate these assets in the final export if they already exist on GitHub.

## Core workbench

Build one browser-first stage with:

- free orbit camera;
- source browser for pot / saucer / plant;
- scale / position / rotation;
- insertion-depth control;
- plant count / cluster controls;
- seed;
- palette/style;
- pattern controls;
- static / ambient-rig / living toggle;
- regenerate;
- export recipe.

Keep stage dominant. No engineering-dashboard wall.

## Composition presets

Create at least:

### A · NORMAL

Tiny Treats pot + conventional Tiny Treats plant.

### B · ALIEN

Tiny Treats pot + Quaternius Plant/Blob/Spiral/Swirl/Spikes source.

### C · MIXED CLUSTER

2–5 pots, varied sizes, one alien accent.

### D · CRAZY-CAT LANDMARK

Giant scaled pot + giant plant/tree used as landscape landmark.

### E · LIVING PLANT

One valid composition + existing KFB cartoon EyeRig.

## Prop rigging experiment

Do not immediately bone-rig all plant meshes.

First use a transform-based prop rig:

```text
PlantPropRoot
  PotRoot
  PlantRoot
    PlantPivot
      optional CrownPivot
  LivingOverlay
```

Controls:

- idle sway;
- wind response;
- pulse;
- proximity response;
- impact recoil;
- settle;
- squash/stretch wrapper where visually useful.

The rig must never own world movement/collision.

If a source has useful separable parts, expose them as optional pivots. Do not destructively edit the source mesh to fake modularity.

## Living / eye experiment

Use the **existing KFB EyeRig v6**, not a new eye implementation.

Donor:

`pet-eye-rig.v6.js`

Build a small adapter that gives EyeRig a suitable face host / eye anchor on the plant composition.

Try at least three placements:

1. eyes on the pot;
2. eyes on the plant crown/body;
3. eyes as a floating/offset expressive overlay if that works visually.

User-facing toggle:

`STATIC | AMBIENT | AWARE`

Where:

- STATIC = no rig;
- AMBIENT = sway/pulse only;
- AWARE = existing EyeRig with gaze/blink + ambient rig.

Optional EXPRESSIVE mode with brows/mouth is backlog unless the EyeRig proof is clean.

These plants do not need to be carnivorous or hostile. They may simply look alive, observe the player, blink, lean, react or sleep.

## Pot patterns / color

The current pots should not remain one terracotta family.

Build a small non-destructive procedural pattern system.

Desired visual direction:

- colorful geometric ceramic / Mexican folk-art-inspired rhythm;
- simple mathematically generated forms;
- compatible with KFB/TinySkies palette.

Pattern vocabulary:

- stripes;
- horizontal bands;
- dots;
- diamonds;
- zigzags;
- scallops;
- simple radial/sun motifs;
- alternating color blocks.

Try two rendering approaches and report which is more robust:

1. generated CanvasTexture using source UVs;
2. analytic cylindrical coordinates based on pot-local XYZ.

If the source UVs make patterns unstable, prefer the analytic projection.

Do not overwrite the source texture.

Expose:

- palette;
- pattern family;
- density;
- band count;
- rotation/phase;
- accent amount;
- seed.

Same seed + same recipe should regenerate the same pot pattern.

## Color concept study

In addition to individual models, include a small comparative color board:

```text
TinySkies-like Terrain / Day
TinySkies-like Sunset
Indoor / Dungeon warm light
Night / cool light
```

For each show:

- normal foliage;
- alien foliage;
- 3–5 pot palettes;
- pattern contrast;
- oversized landscape specimen.

Goal is not to define the final global KFB palette alone.

Goal is to learn how plants, pots, terrain and lighting can share one coherent style system.

## Generator thinking

Prepare generator logic as a recipe, like the existing Dungeon Generator mental model.

Inputs:

- pot family;
- size;
- plant family;
- plant count;
- source variant;
- insertion depth;
- scale;
- pattern;
- palette;
- living level;
- seed.

Output:

`PlantRecipe`

The workbench should be able to:

`Generate → Inspect → Adjust → Export Recipe → Re-import → Reproduce`

Do not export only a screenshot.

## Consumer hooks

Show candidate metadata for later:

- Travel / TinySkies landscape;
- OSM Ehrenfeld/Hürth;
- Platformer Project Island;
- World Atlas;
- Dungeon room;
- Game Dev Studio.

But do not implement those consumers in this Floate Design slice.

## Game Development Studio handoff

Prepare one clean handoff candidate:

`GameReadyPlantPackage candidate`

with:

- exact source refs;
- PlantRecipe;
- pattern recipe;
- prop-rig recipe;
- EyeRig adapter config if used;
- collider/support proxy proposal;
- LOD/instancing notes;
- consumer test checklist.

Do not push it into Game Dev Studio catalog automatically.

## Required first visual proof

Show in one page:

1. original houseplant;
2. styled/patterned version;
3. alien plant in Tiny Treats pot;
4. giant Crazy-Cat landscape version;
5. living EyeRig version;
6. deterministic seed regeneration.

## Export contract

Final export should be lean:

`KFB_Plant_Prop_Lab_v0_EXPORT_2026-09-18.zip`

Include:

```text
KFB_Plant_Prop_Lab_v0/
  START_HERE.md
  README.md
  index.html
  src/
  data/
  recipes/
  docs/
    MENTAL_MODEL.md
    SOURCE_MANIFEST.json
    FEATURE_PARITY.md
    TEST_REPORT.md
    KNOWN_ISSUES.md
    RECOVERY.md
  EXPORT_MANIFEST.json
  CHANGELOG.md
```

Do NOT include:

- node_modules;
- package caches;
- copied Tiny Treats models;
- copied Quaternius models;
- copied KFB EyeRig source tree;
- font binaries;
- unrelated screenshots;
- videos unless essential evidence;
- stale predecessor projects;
- unrelated ToolBox / Travel / Dungeon source trees.

All existing assets are GitHub refs.

If Floate creates genuinely new derived files, put them under:

`NEW_ASSETS_FOR_GITHUB_IMPORT/`

and list them explicitly.

## Test report

At minimum report:

- cold boot;
- normal plant source load;
- alien plant source load;
- pot A/B/C/D load;
- pattern generation;
- deterministic seed;
- import/export recipe roundtrip;
- orbit camera;
- static / ambient / aware modes;
- EyeRig mount / blink / gaze if implemented;
- 10 composition regenerations;
- narrow viewport.

Not run = NOT_TESTED.

## Final return

Return separately:

`SOURCE | DECISION | IMPLEMENTATION | TESTED RESULT | EXPORT | PUBLIC DEPLOYMENT | GEORG ACCEPTANCE | OPEN`

Also provide:

1. ZIP;
2. browser preview;
3. exact entry HTML;
4. file count + size;
5. exact GitHub source refs;
6. actual created files vs proposals;
7. test report;
8. known gaps;
9. statement: `GITHUB PUSH: NOT PERFORMED` unless truly performed.
