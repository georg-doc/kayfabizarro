# KFB Storytelling Map Animator v1 · Slice Plan / Return

Status: **PLANNING PACKAGE READY · IMPLEMENTATION NOT STARTED**
Date: 2026-09-20

## Owner

Existing implementation owner:
`tools/kfb-cartoon-map-board/`

No second map runtime is authorized.

## Planning branch

`planning/storytelling-map-animator-v1-2026-09-20`

Parent:
Storytelling Maps T2/CardRig branch head
`e81f0e7a05a56e7c03a38b326df4caa1c7c14428`

## Main brief

`CLAUDE_DESIGN_BRIEF_MAP_ANIMATOR_V1.md`

## Source matrix

`MAP_ANIMATOR_DONOR_MATRIX.md`

## Future Stage

`https://kayfabizarro.pages.dev/kfb-hub/stage/storytelling-maps/animator-v1/`

Status:
**TARGET ONLY · NOT DEPLOYED · NOT PUBLIC_VERIFIED**

## Product direction captured

- arbitrary public GeoJSON / OSM-derived maps;
- country/region/city hierarchy;
- puzzle-piece map geometry;
- flat/table/flyover/pop-up views;
- add/fill/remove/stand-up/assemble/explode actions;
- ripple/burn/bomb/hurricane + other VFX as semantic presentation presets;
- Cologne/Hürth/Ehrenfeld City Lab reuse;
- Grotesque landmark reuse;
- cutout/papercraft/popup-diorama look;
- later Card/PDF/standee integration;
- separate Game Dev Studio Theatre Curtain module consumed through an adapter.

## Curtain finding

No new curtain brief is needed to start from zero.

A separate reusable module already exists in Draft PR #114:
- official pinned Three.js compute-cloth donor;
- KFB two-panel physical curtain;
- 22/22 local PASS;
- 25/25 public PASS;
- human visual/physics gate still open.

The Animator brief therefore treats Curtain as an external dependency and explicitly forbids SVG/CSS substitutes.

## Small-slice ladder

1. **SMA1** · Map-piece motion + camera + one landmark + one ripple.
2. **SMA2** · progressive disclosure + destructive-looking VFX.
3. **SMA3** · OSM city / Cologne-Hürth-Ehrenfeld drilldown.
4. **SMA4** · papercraft / popup diorama.
5. **SMA5** · Theatre Curtain adapter.
6. **SMA6** · KFB Viewer / CardRig embeds.
7. **SMA7** · fuller authoring/editor surface.

## Current next gate

**SMA1 only.**

Do not combine SMA1–SMA7 into one Claude Design build.
