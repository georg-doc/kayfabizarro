# KFB WorldBuilder · Terrain Editor → Claude Design handoff · 2026-09-23

Status: **PREPARED · HOLD UNTIL WEB HTML HUMAN PASS**
Current product direction:
**continuous procedural terrain + productive Scene Editor**

## Gate chain

### Step 1 · Fresh Web

Use:
`TERRAIN_FIRST_FRESH_WEB_START.md`

Web builds:
`WB1-TERRAIN-EDITOR-01`

Required functional proof:
- continuous procedural terrain;
- seed/minimal terrain controls;
- one real Hero Landmark;
- one small prop group;
- source-object picker;
- place/select;
- move/rotate/scale;
- drop/snap to terrain;
- save/reload;
- HTML-first review artifact.

Primary terrain/editor donor:
`ZyFou/ProceduralTerrains@f58a8ddb81d1fbb526a41282a9a7e9c05c2d2070` · MIT.

Scene-edit donor:
existing KFB S21/S22 / Scene Patch source interactions.

No Cloudflare for the normal review loop.

### Step 2 · Georg Human HTML Review

Claude Design remains HOLD until Georg can actually:

- generate a useful terrain;
- place/edit a real object;
- save;
- reload;
- continue editing.

If Web fails the functional seam, fix that in Web.
Do not ask Claude Design to repair missing terrain/editor functionality.

### Step 3 · Claude Design

After Web Human PASS, Claude Design receives the exact accepted Web source/head and improves the **authoring experience and world presentation**, not the architecture.

Claude may then:

- compose the WorldDesign Lab look/environment controls into the accepted editor;
- refine terrain material/look hierarchy;
- integrate the accepted P1 Environment Profile controls;
- make Source Object / Scene editing visually direct;
- use the successful Hero Landmark cartoon deformation as a presentation donor where appropriate;
- improve asset browsing / compact context palette;
- compose one coherent 12–24-object world vignette;
- add restrained visual feedback for selection/snap/support;
- preserve save/reload behavior.

## Claude must not rebuild

- terrain engine;
- terrain-height truth;
- scene persistence;
- TransformControls/edit seam;
- Resource Registry;
- Travel runtime;
- OSM truth;
- Hex solver;
- movement/camera gameplay owners.

Hex is optional local content only.

No Sphere/Torus proof requirement.

## WorldDesign donor

Use the current WhackMan-origin WorldDesign Lab:

`tools/KFB-ToolBox/_inbox/KFB World Design Setup (1)/WORLDDESIGN_LAB_2026-09-23/`

Reuse/adapt:
- `wd-light.js`;
- `wd-look.js`;
- `wd-view.js`;
- story palette / comparison grammar where accepted.

Material and lighting remain orthogonal.

## Review transport after Claude

Claude exports a complete Session Cut.

Web rehomes it 1:1, checks parity, then generates:

`WB1_TERRAIN_EDITOR_DESIGN_REVIEW.html`

Georg reviews the HTML directly.

No Cloudflare until a milestone is worth publishing.

## Done when

The accepted functional Web editor still works, and the Claude pass makes it visibly useful/pleasant without replacing its owners.

Exactly one gate before Claude:
**WB1-TERRAIN-EDITOR-01 Web HTML Human PASS.**
