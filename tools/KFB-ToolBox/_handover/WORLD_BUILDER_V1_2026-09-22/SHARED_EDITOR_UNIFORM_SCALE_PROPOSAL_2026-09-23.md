# Shared Inline 3D Edit Layer · Uniform Scale Proposal · 2026-09-23

Status: **R2 EDITOR HUMAN ACCEPTED · R3 UNIFORM-SCALE CANDIDATE**
Owner: **KFB ToolBox · shared selected-object edit layer**
First receiving host for this extension: **WorldBuilder WB1-TERRAIN-SCENE-01**

## Human trigger

After accepting the shared inline-editor R2 integration, Georg requested one simpler size gesture for ordinary prop authoring: make an object quickly smaller or larger from its source/default scale, e.g. turn the existing Boulder into a small rock or pebble and place it in-scene.

## Existing accepted foundation

Accepted shared editor:
`tools/KFB-ToolBox/lib/edit-layer.js`

Accepted R2 base donor blob:
`c97b3537f71e939176f3ae5ce7ae83feabb7918f`

Lineage:
`Dungeon Room Study S21/S22 → Resident Atlas S7 → ToolBox → WorldBuilder`

Georg accepted in R2:
- object-attached mini-menu;
- Move;
- Rotate;
- free Scale gizmo;
- Drop / Absetzen;
- World / Local axes;
- Close;
- Save/Reload transform roundtrip.

Do not replace or regress those controls.

## Proposed global extension

Add a uniform `scaleBy(factor)` gesture to the shared ToolBox edit layer.

Default authoring pair:
- **smaller**: `×0.8`;
- **larger**: `×1.25`.

The values are mathematical inverses (`0.8 × 1.25 = 1.0`), so one smaller followed by one larger returns to the original scale, within normal floating-point tolerance.

Default safety bounds:
- minimum component scale: `0.05`;
- maximum component scale: `20`.

The operation multiplies all three existing scale components by the same factor. Therefore it preserves an object's existing proportions instead of forcing `x = y = z`.

## Mini-menu grammar

Keep the established rule of no more than six top-level fields.

WorldBuilder R3 layout:
1. ✥ Move
2. ⟳ Rotate
3. **− / + uniform size pair**
4. ⬓ Drop
5. ⊹ World / Local
6. ✕ Close

The `−/+` pair is one grouped Scale field. The accepted free Scale gizmo remains available through keyboard shortcut `S`; no capability is removed.

## Host contract

The shared edit layer owns only the gesture and selected-node transform.

A receiving host remains responsible for:
- its scene document;
- persistence/save/reload;
- whether scale is an allowed transform for that object type;
- source asset identity;
- terrain/runtime/gameplay ownership.

For WorldBuilder, `transform.scale` is already part of the accepted R2 scene document and Save/Reload contract, so the uniform gesture needs no new schema.

## Current R3 implementation candidate

Shared ToolBox module candidate blob:
`c15a200ba8615d55f9d3ae26616e0a8ceba8dc01`

WorldBuilder Source candidate blob:
`d550d5bf8ce93dbcc17b4687dbda1afcb4f3a223`

WorldBuilder standalone Review candidate blob:
`f07fc23dcbd3525be7dd6d8c2e0b1b93799a313a`

Implementation behavior:
- shared `scaleBy(factor)`;
- menu actions `scale-down` / `scale-up`;
- default inverse factor pair;
- min/max clamp;
- accepted free `scale` TransformControls mode preserved;
- WorldBuilder `−/+` grouped field;
- WorldBuilder persistence remains unchanged.

## Evidence

- R3 Source/Review/shared-module static integration: **26/26 PASS**;
- pinned actor/prop/animation/texture paths: **4/4 PASS**;
- shared module syntax: **1/1 PASS**;
- embedded browser self-test: **22 assertions prepared / 0 executed**.

No browser PASS or R3 human PASS is claimed yet.

## Integration proposal

If Georg accepts the R3 WorldBuilder review, promote uniform smaller/larger as a normal capability of the shared ToolBox inline editor for future hosts.

Recommended default:
`scaleFactor = 1.25`, inverse down factor `1 / scaleFactor`.

Hosts may override `scaleFactor`, `minScale`, or `maxScale` only for a measured reason. Do not fork separate scale math per host.

## One next gate

Georg reviews the WorldBuilder R3 Chat HTML and verifies:
- Boulder selected;
- `−` produces a visibly smaller rock/pebble;
- `+` produces a visibly larger rock;
- repeated clicks remain usable;
- free `S` scale still works;
- Save/Reload restores the resulting scale.

STOP before general rollout to other ToolBox hosts until that human result.
