# World Design Export · input to WorldBuilder + later ToolBox integration

**Date:** 2026-09-23  
**Source on current main:**  
`tools/KFB-ToolBox/_inbox/KFB World Design Setup (1)/WORLDDESIGN_LAB_2026-09-23/`

**Classification:** USER/CLAUDE EXPORT · REAL SOURCE PACKAGE · DONOR INPUT · NOT WORLD/TOOLBOX OWNER

## 1 · Why this matters

This export is now the concrete source package for the separate **World Design / WhackMan-lighting Claude context** discussed in the ToolBox organization brief.

It contains:

- a working WorldDesign comparison lab;
- 11 `wd-*.js` modules;
- look/light/sky/terrain/voxel/ink/registry/donor/view seams;
- 5 retained review screenshots;
- Handover / Changelog / Housekeeping;
- a Look JSON export/import path.

This is stronger than a screenshot/reference-only donor.

## 2 · WorldBuilder status when inspected

Current WorldBuilder P0 branch:

`chatgpt-web/world-building-preflight-2026-09-22`

Draft PR:

**#175 · WorldBuilder v1 · WB1-P0 source/reuse/license revalidation**

Current P0 Return says:

`WB1-P0 COMPLETE / REVALIDATED`

Exactly one next gate remains:

**WB1-P1 · Environment Profile isolation**

Do not reopen P0 because this export arrived.

Instead consume this export as a new, source-backed P1 donor.

## 3 · Strong P1 donor: wd-light.js

Exact source:

`deliverables/wd-light.js`

The module already separates lighting from gameplay and documents:

- BASELINE vs WHACKMAN profile;
- cool weak Hemisphere/Directional WhackMan world light;
- `FogExp2`;
- six-light torch pool;
- physical decay;
- asynchronous flicker;
- torch range/intensity;
- local visibility light;
- exposure;
- optional glow sprite;
- world-scene placement distinct from single-asset comparison.

This is almost exactly the technical seam WB1-P1 wanted to prove.

### P1 recommendation

Do not rewrite the WhackMan light profile again from `wm-boot/gate-b/gate-c`.

Instead:

1. verify `wd-light.js` numerically/source-wise against the current pinned WhackMan donor;
2. classify any intentional Lab changes;
3. adapt the smallest reusable Environment Profile API from this module;
4. run the tiny isolated P1 proof scene;
5. keep WhackMan gameplay absent.

This reduces duplicate work while preserving source evidence.

## 4 · Important refinement: material and light remain orthogonal

`wd-light.js` explicitly states:

> Material und Licht bleiben orthogonal.

That is a useful correction/refinement for P1.

Original WhackMan source includes a gameplay-specific mattification behaviour.

The WorldDesign Lab's `wd-look.js` has since explored a richer material/look system and explicitly avoids one global matte clamp.

Therefore P1 should represent these separately:

### Environment Profile

Owns:

- world/ambient light;
- torch light pool;
- fog;
- flicker;
- local visibility;
- exposure;
- optional environmental glow behaviour.

### Material / Look Profile ref

Owns separately:

- source material preservation;
- roughness/gloss policy;
- macro/procedural treatment;
- cel/palette/etc where later accepted.

P1 may still expose:

`Material profile: SOURCE | WHACKMAN_MATTE_CANDIDATE`

for reversibility/testing.

But **do not bake one global matte policy into the Environment Profile schema**.

## 5 · What NOT to pull into P1

Do not make P1 depend on:

- Derek texture/look;
- `wd-macro.js`;
- KFB ink rewrite;
- Cel shading;
- Story Palette;
- Voxel terrain;
- day/evening/night cycle;
- all 31 world donors;
- multi-field comparison UI;
- final Look JSON;
- WorldDesign Lab UI;
- standalone build/productization.

Those remain useful later WorldBuilder/WorldDesign candidates.

P1 is still one small Environment Profile proof.

## 6 · Useful later WorldBuilder donors

### wd-look.js

Strong candidate for the later WorldBuilder **visual/material profile** lane.

It provides:

- source-preserving mode;
- triplanar/procedural/clay candidates;
- roughness/gloss preservation;
- palette/cel experiments;
- normal/roughness channel views;
- reversible settings.

This should be reviewed visually, not promoted wholesale.

### wd-sky.js

Useful later sky donor family.

Not needed for P1/P2 core.

### wd-terrain.js

Lab test ground only.

Not world terrain truth.

Travel/TinySkies remains terrain owner.

### wd-voxel.js

Consumes the existing Voxel owner.

It does not make WorldDesign Lab the Voxel owner.

### wd-registry.js / wd-donors.js

Useful source-selection/donor mechanisms.

Asset Librarian/Registry remains canonical discovery owner.

### Look JSON

`kfb.worlddesign-look/2`

Useful as a **Lab export / candidate visual recipe**.

Do not silently promote it to WorldBuilder canonical schema.

After P1/P2 and human visual selection, WB1-P3 may reference the accepted subset.

## 7 · Standalone/product status

The export Handover correctly says:

- Lab is not live-promoted;
- current HTML + ES-module graph still requires GitHub/network access;
- Claude Design could not produce a true bundled standalone HTML;
- a real Web build/rehome is a later consumer task.

This is not a blocker for using the source as P1 evidence.

Do not burn P1 on Vite/Rollup/productization.

## 8 · Relation to ToolBox Fractal Authoring

This export strengthens the project split:

### World Design project owns / supplies

- World look experiments;
- WhackMan lighting donor;
- sky/look/material candidates;
- visual comparison evidence.

### ToolBox project owns / supplies

- Actor/Face/EyeRig/Brow;
- Pose/Motion;
- nested authoring;
- shared Scene editor controls.

When ToolBox Fractal Authoring begins after WB1-P2, it should consume only the **accepted Environment/World context refs** from WorldBuilder.

Do not copy the WorldDesign Lab's look-control rail into the Face/Actor ToolBox editor.

## 9 · Recommended immediate sequence

No change to the global plan:

1. **WB1-P0 — complete**.
2. **WB1-P1 — next**:
   use `wd-light.js` as the strongest extracted WhackMan-light donor;
   keep material profile separate.
3. **WB1-P2 — after P1**:
   same tiny recipe on Flat/Sphere/Torus.
4. **WB1-P3**:
   compact Claude input may now cite the WorldDesign Lab as a proven visual donor source.
5. **TFA-0** after WB1-P2:
   reconcile the separate KFB ToolBox Claude project.
6. **TFA-CD1**:
   FrizzleBob nested Face/EyeRig/Brow proof.

## 10 · Source facts pinned during this review

Current inspected `main` when the export was read:

`d7c866c225ba0fab5e1324e960e2df26bb52c248`

Export Handover blob:

`2cfdc798289484be4607e173698d9f0630b23da1`

`wd-light.js` blob:

`dfa04d9db909a3dcda20f862b8813bd16a6d186f`

`wd-look.js` blob:

`e8d577629b3e2c580fec92717d433fd743a046a1`

These are evidence pins for this note only. Re-fetch current main before implementation.
