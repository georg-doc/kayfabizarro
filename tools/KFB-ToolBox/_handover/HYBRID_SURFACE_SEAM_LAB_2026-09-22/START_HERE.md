# KFB ToolBox · Hybrid Surface Seam Lab · START HERE

Status: **PUBLIC VERIFIED · HUMAN VISUAL GATE OPEN**  
Date: 2026-09-22  
Owner: **KFB ToolBox / material-surface compatibility lab**  
Draft PR: **#171**  
Stage: https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/hybrid-surface-seam-lab/

## Why this slice exists

Georg observed a visible line on a broad flat wall in the hybrid material proof.

The source cause is proven in code: the predecessor `createRgbBrushTexture()` paints a non-periodic random canvas and then enables `RepeatWrapping`. RepeatWrapping repeats mismatching borders; it does not make them seamless.

Measured predecessor edge mismatch:
- max absolute RGB edge delta: **136**
- mean absolute RGB edge delta: **42.755859375**

The seam lab replaces only the RGB macro texture generator:
- every stroke/blob is duplicated toroidally across a 3×3 neighborhood;
- opposite pixel edges are normalized explicitly;
- measured tileable edge delta: **0 / 0**.

## What is unchanged

- exact World Atlas Dungeon donor;
- exact five actor donors;
- frozen Hybrid v2 clay/grain shader math;
- measured head-size scaling;
- source color/map preservation;
- source roughness/metalness behavior;
- all consumer/runtime owners.

The unresolved Black Knight compile-census issue remains separate and is not claimed fixed here.

## Human gate

Open the Stage, choose **Seam close-up**, and toggle:

- `Legacy non-tileable`
- `Tileable macro`

Judge whether the visible repeat line is gone on the actual KFB/KayKit scene.
