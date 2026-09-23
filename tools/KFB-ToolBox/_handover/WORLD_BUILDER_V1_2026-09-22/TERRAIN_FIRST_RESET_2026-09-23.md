# KFB WorldBuilder v1 · Terrain-First Reset · 2026-09-23

Status: **CURRENT DIRECTION RESET · CONTINUOUS TERRAIN FIRST · SCENE EDITOR NEXT**

## Why this reset exists

WB1-P2 proved a small mathematical Surface Adapter seam, but Georg's human review correctly rejected the visible result.

The failed proof drifted away from the already-selected product direction:

**continuous procedural terrain as the world surface, with Hex/props/buildings placed into that terrain as optional authored content.**

Do not continue treating visible Hex tiles as the macro world surface.

The existing P2 branch/PR remains useful research evidence for local frames and surface-addressing math, but it is **not the next product gate**.

Apply:
`skills/session-entry-use-what-works_v1.md`

Core rule:

> If a working/reference donor already exists, reuse/adapt it instead of replacing it with a new geometry theory.

---

# 1 · Primary terrain/editor donor

## ZyFou/ProceduralTerrains

Repository:

`https://github.com/ZyFou/ProceduralTerrains`

Pinned current source:

`f58a8ddb81d1fbb526a41282a9a7e9c05c2d2070`

License:

**MIT**  
`LICENSE` blob `30d8711c055630ea5d7a481e20c81766a5fa5abd`

Why it is the primary donor:

- Three.js/WebGL terrain engine;
- engine separated from editor UI;
- GPU-driven terrain;
- deterministic seed + serializable parameters;
- typed/layered noise;
- fixed Tile authoring mode;
- Infinite World streaming/chunks;
- Planet mode;
- chunk/LOD;
- terrain/biome/prop paint tools;
- real-world heightmap import;
- water/shoreline/atmosphere/clouds;
- save/load;
- undo/redo;
- export to GLB/GLTF/OBJ + masks/metadata.

KFB should **reuse/adapt the architecture and, where appropriate, MIT-licensed code**, instead of rebuilding terrain generation from scratch.

Do not copy its React product shell wholesale.

The useful split is:

`terrain engine / document / editor controls / runtime/export`

---

# 2 · Reddit visual/editor references

## Terrain Generator with biome/terrain blending

`https://www.reddit.com/r/proceduralgeneration/comments/1vipn2v/terrain_generator_with_biometerrain_blending/`

Useful observed direction:

- Three.js;
- terrain generated as continuous terrain;
- paint tool selects where terrain/biome systems apply;
- node-based blending between terrain generators/biomes;
- erosion/slumping/hydraulic treatment;
- elevation/slope drive biome/material treatment;
- author explicitly identifies paths and objects as the next authoring layer.

This is **visual/product interaction reference**, not code provenance.

## My terrain editor, update

`https://www.reddit.com/r/proceduralgeneration/comments/1vjjt4u/my_terrain_editor_update/`

Useful observed direction:

- standalone Three.js editor;
- direct terrain painting;
- blending between different node trees/terrain shapes;
- visible in-editor terrain authoring rather than abstract geometry tests.

Treat both Reddit posts as **look/interaction references**.

---

# 3 · Secondary procedural-world reference

## SP13KTRA

Repository:
`https://github.com/KilledByAPixel/SP13KTRA`

Reddit:
`https://www.reddit.com/r/proceduralgeneration/comments/1wi57pj/everything_in_my_13k_futuristic_racing_game_is/`

Role:

**OBSERVATION ONLY.**

Its license is All Rights Reserved.

Useful concepts only:
- compact route/spline grammar;
- hills/banking generated from route;
- seeded shape languages;
- correlated procedural variation;
- procedural city/sky/audio generation.

Do not copy/adapt source, constants, track tables, assets or algorithms.

SP13KTRA does **not** replace ZyFou as the terrain/editor source.

---

# 4 · KFB world geometry basis

The visible playable world should be built on:

## A · Continuous macro terrain — PRIMARY

One continuous terrain/support surface.

Terrain may be:
- seeded/procedural;
- sculpted/painted;
- biome-painted;
- imported from geographic elevation later;
- chunked/LOD as scale requires.

It owns the visible ground shape and support height.

This is the first WorldBuilder surface.

## B · Scene objects — AUTHORED CONTENT

Real KFB/KayKit/Kenney/Quaternius objects are placed on the terrain:

- landmarks;
- buildings;
- props;
- plants;
- Residents;
- lights;
- cards;
- roads/signs;
- portals;
- race props.

Scene editing should expose:
- select;
- translate;
- rotate;
- scale;
- duplicate/delete;
- snap/drop to terrain;
- save/reload.

Reuse the existing S21/S22 source-object + transform-control / Scene Patch donors.

Do not invent a third generic scene editor.

## C · Hex — OPTIONAL SEMANTIC / LOCAL KIT

Hex is **not the macro ground**.

Use it where useful for:
- authored local zones;
- modular structures;
- tactical/semantic cells;
- boardgame-like locations;
- platform/tower constructions;
- Dungeon/Hex kits.

A Hex cell may sit on / cut into / influence a terrain patch.

The world does not become a visible Hex shell just because Hex data exists.

## D · OSM — LATER GEOGRAPHIC INPUT

OSM may provide:
- roads;
- footprints;
- landmarks;
- semantic place data.

OSM does not own terrain rendering.

## E · Voxel — LOCAL ONLY

Use local volumetric chunks only where continuous terrain is insufficient:
- caves;
- destructible/local cut volumes;
- block worlds;
- special puzzle/instance zones.

Do not make the whole world voxel-first.

---

# 5 · Existing KFB terrain/runtime truth

Current Travel/TinySkies remains the existing runtime/world owner until an explicit promotion changes that.

Relevant existing source:
`georg-doc/KFB-Travel-Globe`
`travel/globe-v13/terrain-surface.js`

It already proves:
- one terrain-height truth;
- gameplay/props can consume the same terrain displacement;
- build/flatten/tilt zones can be expressed in the same support-height source.

The new WorldBuilder terrain/editor proof should not create a competing game runtime.

The Scene Editor should author a terrain/scene document that can later be consumed/promoted into Travel/World runtime.

---

# 6 · What becomes historical research

WB1-P2:

FLAT / SPHERE / TORUS + rigid Hex fixture

is now classified:

**RESEARCH EVIDENCE · NOT PRODUCT GATE**

Retain:
- local-frame math;
- finite tangent/normal checks;
- address/project helpers if later useful.

Do not retain as product direction:
- visible rigid Hex patch as macro world;
- Torus/Sphere comparison as prerequisite for the Scene Editor;
- route TubeGeometry proof;
- debug Ripple as a visual target.

WB1-P2R1 is **SUPERSEDED BEFORE IMPLEMENTATION** by this terrain-first reset.

Do not spend another repair pass making the rejected Hex/Torus proof prettier.

---

# 7 · New product slice · WB1-TERRAIN-EDITOR-01

Goal:

**Get Georg into a useful Scene Editor quickly.**

Build a bounded browser authoring candidate with:

1. one procedural continuous terrain;
2. seed + a small terrain parameter set;
3. terrain material/look seam;
4. orbit/pan/zoom authoring camera;
5. source-object browser for a small pinned set of real assets;
6. place object;
7. move/rotate/scale;
8. drop/snap object to terrain support;
9. save scene;
10. reload same scene;
11. optional one Hex-kit object placed as content on the terrain.

### Terrain controls · first cut

Only enough to be productive:

- seed;
- terrain amplitude/height;
- macro scale;
- roughness/detail;
- optional flatten/smooth brush or zone;
- material/profile selector;
- regenerate.

Do not reproduce ZyFou's full editor in the first cut.

### Scene controls · first cut

Reuse working KFB source-object / Scene Patch interaction.

Do not rebuild transform gizmos from scratch.

### First fixture

Use:
- one attractive rolling-terrain seed;
- one Hero Landmark;
- one small prop group;
- optional one Hex asset;
- accepted P1 Environment Profile reference.

No Sphere/Torus requirement.

No full OSM.

No caves/voxels.

No infinite world.

No gameplay.

---

# 8 · Done when

Georg can visibly:

- regenerate a useful terrain;
- select/place a real object;
- move/rotate/scale it;
- drop it onto the terrain correctly;
- save;
- reload;
- keep editing.

That is the first productive WorldBuilder milestone.

The next question after that is not another geometry theorem.

It is:
**what authoring controls/assets should be added next?**
