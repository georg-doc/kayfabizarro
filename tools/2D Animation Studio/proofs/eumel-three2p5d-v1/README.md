# Eumel three2p5d proof v1

Status: **IMPLEMENTATION · browser QA pending**

This is WSA Phase 1 from:

`skills/chat/workflows/2D_RESIDENT_ACTOR_WSA_2026-09-20/START_HERE.md`

## What it does

- loads the source-exact Eumel SVG component groups;
- rasterizes only selected source groups into transparent textures;
- mounts them as z-layered world-space Three.js planes;
- derives the neutral leg bind from the measured Eumel bind data;
- anchors leg swing at the measured hips;
- keeps source shadow as a world-space ground plane;
- reuses the shared EyeRig semantic adapter on Three.js wrapper groups;
- supports `upright-yaw-billboard` and `world-facing-upright`;
- exposes neutral/idle/look/walk/hop local presentation states.

## What it does not do

- no KayKit Project Island composition yet;
- no consumer collision;
- no world locomotion;
- no Resident Atlas index promotion;
- no DocCheck project interaction/content;
- no Doccy implementation.

The neutral stage exists only to prove the world-space actor seam before a named consumer writes runtime code.
