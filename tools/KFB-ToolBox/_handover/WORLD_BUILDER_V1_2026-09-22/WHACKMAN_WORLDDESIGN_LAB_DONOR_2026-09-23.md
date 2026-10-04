# WhackMan → WorldDesign Lab donor · 2026-09-23

Status: **CURRENT INTERNAL DONOR · WHACKMAN-ORIGIN · NOT A NEW TOOLBOX PROJECT · NOT A WORLD OWNER**

Source intake:

`tools/KFB-ToolBox/_inbox/KFB World Design Setup (1)/WORLDDESIGN_LAB_2026-09-23/`

Origin classification from Georg:

**This Lab comes from the WhackMan project lineage.**

Its location under `tools/KFB-ToolBox/_inbox/` is a handoff/intake location only.

Do not reclassify it as:
- a new ToolBox project;
- a new World runtime;
- a replacement for WhackMan;
- a replacement for WorldBuilder;
- a new Asset Librarian/Registry owner.

## What it already proves

The WorldDesign Lab is a reusable **look/environment comparison bank** over real KFB donors.

### BANK

Same source object shown as:
- SOURCE;
- DEREK;
- NORMALEN-LOOK;
- RAUHEITS-LOOK.

SOURCE remains visually unmodified.

### WELT

Mixed real-donor scene with McCloud-like layers:
- foreground;
- midground;
- background;
- terrain.

Each layer may carry a different look.

This is useful WorldBuilder authoring evidence, but it is explicitly **not a World Recipe**.

## Strong modules to reuse/adapt

### `wd-light.js`

Direct WhackMan-derived environment/light donor.

Already separates:
- BASELINE;
- WHACKMAN;
- ambient/world light;
- fog;
- exposure;
- torch intensity/range;
- nearest-light pool;
- asynchronous flicker;
- glow sprites.

Important architectural lesson:

**material/look and lighting remain orthogonal.**

WorldBuilder must preserve that separation.

### `wd-look.js`

Strong Look Profile donor.

Already provides:
- reversible SOURCE/reference path;
- macro texture strength/scale/contrast;
- source colour preservation;
- procedural/clay;
- paper/cardboard/felt/stone;
- Derek RGB variants;
- grain/normal/roughness controls;
- cel bands;
- channel views;
- story palette;
- separate Character / Prop / Terrain presets.

Do not silently promote any one preset to final KFB canon.

Georg human review remains the look gate.

### `wd-view.js`

Useful comparison/authoring presentation donor:
- one-camera comparison bank;
- single / four-field comparison;
- per-field ink;
- per-field sky;
- McCloud world layers;
- layer-specific look selection;
- story palette;
- day/evening/night cycle;
- look JSON controls.

This may become a **Look Lab panel / comparison mode** inside or alongside WorldBuilder.

Do not turn it into the WorldBuilder's structural editor.

### `wd-terrain.js`

Natural test-terrain donor:
- continuous height field;
- stand pads;
- same look treatment as other donors.

Use as a look/terrain test donor, not geographic/world truth.

### `wd-voxel.js`

Correct reuse pattern:
- does not rebuild Voxel Zone S2 look;
- loads Voxel Zone S2 owner modules;
- reuses story palettes / material / ink concepts.

This is direct evidence for the World architecture rule:
**reuse owner semantics rather than cloning visual code.**

### `wd-sky.js`

Comparison donor for:
- Three Sky;
- Travel skydome S/A;
- watercolor;
- TinySkies.

Do not create another sky owner in WorldBuilder.

### `wd-ink.js`

Candidate improvements to the current ink owner:
- light thin / shadow thick;
- second-depth-derivative silhouette;
- soft wobble;
- pressure-like grain;
- gaps;
- surface-derived ink colour;
- per-field scissor behavior.

These are **MISSING_DELTA candidates** that belong back to the existing ink owner only after human acceptance.

Do not let WorldBuilder fork its own global ink canon.

## Important owner-backed sources already reused

The Lab calls/reuses:
- Resident Atlas;
- World Atlas / Kit Lab;
- FrizzleBob graft;
- CapsuleCarl;
- Cube Pets / EyeRig;
- Voxel Zone S2;
- Travel / TinySkies skies;
- Plant Lab.

This is a strong donor-composition pattern for WorldBuilder.

## Current limitations

The Lab is not yet a production WorldBuilder.

It does not currently prove:
- World Recipe;
- persistent structural world document;
- Surface Adapter FLAT/SPHERE/TORUS;
- route editing;
- Scene Patch authoring;
- save/reload of authored topology;
- Source Object placement editor;
- OSM semantic world.

Standalone export also still needs a real JS build because the Lab is an ES-module graph with runtime owner imports.

Under current KFB Web-first rules this is not a reason to use Work:
a Web slice may package/build it and return a Portable Preview Pack if/when needed.

## Impact on WorldBuilder v1 sequence

### WB1-P0

Add this Lab to the internal donor matrix as:

**ADAPT / REUSE_COMPONENTS · WHACKMAN_ORIGIN**

Pin:
- handover;
- active module SHAs;
- source owner dependencies.

### WB1-P1 Environment Profile

Do not rebuild WhackMan lighting from scratch.

Start from:
- original WhackMan source as truth;
- `wd-light.js` as already isolated comparison implementation.

P1 still has to prove the reusable Environment Profile contract and, where required, the real mounted-torch source objects.

### WB1-P2 Surface Adapter

WorldDesign Lab is presentation evidence only.

Do not use its natural/voxel test terrain as a substitute for the required same-recipe FLAT/SPHERE/TORUS proof.

### WB1-P3 Claude Design input

Include:
- accepted WorldDesign look presets;
- light/look orthogonality;
- Bank/Welt comparison grammar;
- layer-specific look model;
- story-palette seam;
- sky donor list;
- accepted MISSING_DELTA candidates.

Claude Design should reuse the Lab instead of rebuilding another material/look dashboard.

## ToolBox relationship

ToolBox may surface/navigate this Lab as a useful donor/tooling surface.

But label ownership clearly:

**WhackMan-origin WorldDesign Lab · shared donor**

not:

**new ToolBox WorldDesign project**.

If later promoted into a shared Look Lab product, that promotion requires an explicit receiving owner decision.
