# KFB 3D in-scene editor · shared-module briefing

Status: DESIGN + ADAPTER CONTRACT
Date: 2026-09-20
Owner: ToolBox editor module; each consumer keeps its scene/runtime ownership.

## Goal

Create one small editor module that can be embedded in existing KFB scenes without replacing their loaders, cameras, generators or save formats. It helps select, place, rotate, scale and annotate real scene objects, then exports a portable patch/recipe.

## First consumers

- Resident Atlas — existing editor is the baseline donor;
- Environment Atlas;
- Dungeon Generator — existing POC proves the need;
- Platformer Hub / Babel Tower;
- later ToolBox apps.

## Reuse rule

Start by inspecting the Resident Atlas editor and the Dungeon POC. Reuse their working selection/transform/export seams where possible. Do not invent a fresh generic Three.js editor, scene graph or asset browser.

## Module boundary

The common editor owns only:
- selection and scene-object highlighting;
- transform controls;
- compact inspector values;
- optional labels/anchors/notes;
- undo/redo for its own patch session;
- export/import of a small scene patch.

Each host keeps:
- loading models;
- scene ownership;
- render loop/camera;
- physics/navigation;
- generator seed;
- asset-library truth;
- save/publish destination.

## Minimal patch contract

```json
{
  "schema": "kfb.scene-patch.v1",
  "host": "resident-atlas | environment-atlas | dungeon | babel",
  "source": {"assetId": "canonical-asset-id", "sourceRef": "exact source path"},
  "ops": [
    {"id": "host-object-id", "position": [0,0,0], "rotation": [0,0,0], "scale": [1,1,1], "note": "optional"}
  ]
}
```

If a host cannot resolve the source/object id exactly, it refuses the operation and explains why. No anonymous placeholder objects.

## Build order

1. Extract a short capability matrix from Resident Atlas and Dungeon POC.
2. Write the adapter contract and one fixture per host.
3. Prove select/move/export/import on Resident Atlas without changing its existing saved data.
4. Prove the same operation in Dungeon on one named prop.
5. Add Environment Atlas, then Babel. Do not claim “shared” before two hosts pass.
6. Add a compact ToolBox launcher only after the two-host seam is stable.

## Claude Design task

Design the compact, in-scene control language: selection readout, transform controls, object source identity, undo/redo and export cue. Keep it secondary to the scene. No giant sidebars, generic floating panels or permanent instructional prose in the field of view.

## Acceptance

- A known object can be selected, moved and restored in two existing hosts.
- Export/import carries source identity and transform accurately.
- Mobile keeps primary scene view and touch controls clear.
- Direct Cloudflare Stage routes prove every host adapter.
- Failure cannot leave a scene half-mutated; a patch is either applied or rejected visibly.
