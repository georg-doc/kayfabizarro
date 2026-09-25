# WorldBuilder WB2 · Terrain Sculpting Proposal · 2026-09-23

Status: **IMPLEMENTED · GEORG HUMAN PASS · FUNCTIONAL GATE CLOSED**
Owner: **WorldBuilder terrain authoring**
Shared object-edit owner: **ToolBox `lib/edit-layer.js`**
Current accepted foundation: **WB1 R1 + shared inline editor R2 HUMAN PASS**
Current separate editor candidate: **R3 uniform −/+ size gesture · OPTIONAL / NON-BLOCKING**

## Human direction

Georg accepts the current WB1 terrain + scene-authoring foundation.

Follow-up direction:

- keep the shared inline 3D editor as the object-transform owner;
- do not let WorldBuilder drift into a second local transform/picking implementation;
- later simplify the side UI because object Move / Rotate / Scale / Drop now live at the selected object;
- add a simple terrain-modelling workflow that can form low hills, rises and depressions directly in the continuous terrain;
- avoid voxel, cube, tile or hex-piece terrain appearance;
- prefer a small, robust 3D-modelling grammar over a large terrain suite.

## Human result · 2026-09-25

Georg accepted WB2-TERRAIN-SCULPT-01 including the R1 interaction additions:
- Raise / Lower;
- Radius / Strength;
- wheel / touchpad Radius;
- hold-Space temporary Orbit;
- `1 / 2 / 3` quick modes;
- Undo / Clear;
- Save / Reload.

Result: **GEORG HUMAN PASS**.

The next gate is no longer terrain-sculpt functionality. The prepared Claude Design/UI authoring pass is now unblocked. Smooth / Flatten / material painting remain later separate functional slices.

## Product intent

WB2 should let Georg shape the existing continuous procedural terrain by dragging a brush over it.

First useful gestures:

1. **Raise**
2. **Lower**

Controls:
- brush radius;
- brush strength;
- visible brush footprint;
- drag to sculpt;
- undo last stroke;
- clear sculpt layer;
- save / reload.

Later only, after this works:
- Smooth;
- Flatten / Set Height;
- larger regional tools;
- masks / material painting.

Do not start with those.

## Architecture

### Base terrain remains procedural

The existing ZyFou-derived deterministic terrain remains the immutable base generator:

`baseHeight(x,z, terrainSettings)`

WB2 adds a separate authoring layer:

`finalHeight(x,z) = baseHeight(x,z) + sculptDelta(x,z)`

The sculpt layer must not rewrite or bake over the source noise settings.

### Sculpt document

WorldBuilder scene document extends terrain state additively:

```json
{
  "terrain": {
    "seed": 43129,
    "height": 2.6,
    "macroScale": 3.2,
    "detail": 0.55,
    "sculpt": {
      "version": 1,
      "strokes": [
        {
          "mode": "raise",
          "x": 1.25,
          "z": -0.8,
          "radius": 1.4,
          "strength": 0.18,
          "falloff": "smooth-c2"
        }
      ]
    }
  }
}
```

For WB2, storing compact deterministic strokes is preferred over serializing every terrain vertex.

Benefits:
- base terrain remains reversible;
- save files stay small;
- Undo = remove last stroke;
- reload = regenerate base + replay strokes;
- later parameter changes remain inspectable.

If stroke replay becomes too expensive in a later large-world host, bake/cache can be a later optimization. Do not introduce that now.

## Brush math

Use a continuous radial heightfield brush in X/Z.

For a vertex/sample at distance `d` from brush center and radius `r`:

`t = clamp(d / r, 0, 1)`

Preferred first falloff:
`w = (1 - t²)²`

or another measured C1/C2-smooth radial kernel with:
- `w = 1` at center;
- `w = 0` at edge;
- no hard edge step.

Raise:
`delta += strength * w`

Lower:
`delta -= strength * w`

### Artifact guards

WB2 must:
- use the existing continuous heightfield vertices/samples;
- never introduce separate mound meshes;
- never stamp flat cylinders/cones into the terrain;
- clamp minimum brush radius to at least ~2 terrain grid spacings;
- recompute vertex normals after a stroke;
- update dependent grounding only after stroke commit, not every pointer pixel if that causes jitter;
- keep the brush kernel continuous at its boundary;
- avoid topology changes in the first slice.

No voxel remesh, marching cubes, CSG or hex tiles in WB2.

## Interaction seam

Terrain sculpting must coexist with the accepted shared object editor.

Current object editor:
`tools/KFB-ToolBox/lib/edit-layer.js`

Do not add a second canvas-wide picker.

Use an explicit WorldBuilder terrain-authoring mode and the existing shared layer's claim/ownership seam where possible:
- Sculpt mode claims terrain pointer interaction;
- Object mode leaves selection/editing to `edit-layer.js`;
- switching modes is explicit;
- only one gesture owner handles a pointer drag.

Object edit-layer remains responsible for:
- selected-object Move;
- Rotate;
- Scale;
- Drop;
- World/Local;
- selection lifecycle.

WorldBuilder terrain sculpt remains responsible for:
- terrain ray hit;
- brush cursor;
- terrain stroke generation;
- heightfield update;
- sculpt persistence.

## Grounded scene objects

Terrain changes can move the surface underneath scene objects.

WB2 first rule:
- sculpting does **not** silently rewrite manually authored object Y during the drag;
- after a stroke, offer/perform an explicit re-ground operation for objects that are declared terrain-grounded;
- freely elevated objects keep authored Y.

The existing explicit Drop/Absetzen gesture remains valid and should be reused for manual correction.

Do not reintroduce the old error where Character Y is forced back to terrain every frame.

## UI / authoring cleanup

Current WorldBuilder already moved object transform gestures into the inline object menu.

Future cleanup direction:
- inline object menu is the primary transform surface;
- the side panel should not repeat Move / Rotate / Scale / Drop;
- keep only controls that are genuinely scene-level, such as Add/Remove, Snap if still needed, terrain tools, Save/Reload, import/export;
- compact or collapse explanatory editor copy once the interaction is established;
- maximize 3D field of view.

This cleanup is secondary to WB2 sculpt functionality and must not reopen the accepted editor architecture.

## Shared editor drift prevention

Current global selected-object editor:
`tools/KFB-ToolBox/lib/edit-layer.js`

Lineage:
`Dungeon Room Study S21/S22 → Resident Atlas S7 → ToolBox shared module → WorldBuilder`

Accepted R2:
- object-attached menu;
- Move;
- Rotate;
- free Scale;
- Drop;
- World/Local;
- Close;
- Save/Reload transform roundtrip.

Current R3 candidate adds:
- `scaleBy(factor)`;
- `− ×0.8`;
- `+ ×1.25`;
- clamp `0.05 … 20`.

Do not fork a new WorldBuilder scaling implementation.

A future globally accepted editor version may be reused by WorldBuilder through the shared module only.

## WSA / future sprint intake

WSA and future Web/Claude slices should treat this document as the WorldBuilder terrain-authoring follow-up.

WSA questions:
1. Does another current KFB tool already have a reusable continuous heightfield sculpt brush?
2. Can the brush reuse an existing terrain ray/height sampler rather than introducing a second terrain representation?
3. Is stroke replay sufficient for current WorldBuilder scale, or is there measured evidence that a delta-grid cache is needed?
4. Can terrain-grounded object re-grounding reuse existing Drop/Absetzen semantics?
5. Is any planned global ToolBox editor revision relevant only to object editing, and therefore orthogonal to terrain sculpting?

WSA must not:
- replace `edit-layer.js`;
- promote voxel/hex terrain as the sculpt implementation;
- introduce a universal world runtime;
- move Resident Atlas or Animation ownership;
- bake an irreversible terrain mesh without a measured need.

## Proposed WB2 review

Zero-install HTML first.

Review scene:
- current accepted procedural terrain;
- Caveman;
- Boulder;
- current shared inline object editor;
- new terrain brush cursor.

Human test:
1. choose Raise;
2. create a low hill with several strokes;
3. choose Lower;
4. create a shallow depression;
5. verify edges remain smooth;
6. orbit close to the sculpted region and inspect for cracks/spikes/faceted artifacts;
7. move/drop Boulder onto the sculpted terrain;
8. Save;
9. alter terrain;
10. Reload;
11. verify sculpted terrain returns;
12. Undo one stroke and confirm deterministic rollback.

## Acceptance criteria

WB2 is useful when:
- a low hill can be authored in seconds;
- a shallow depression can be authored in seconds;
- no voxel/hex/tile look is introduced;
- no cracks, hard stamp edges or detached terrain meshes appear;
- normals remain visually coherent;
- object editing still works through the shared inline editor;
- Save/Reload restores the sculpt layer;
- Undo last stroke works;
- the source procedural terrain remains recoverable by clearing sculpt strokes.

## Publication

Normal loop:
**GitHub branch → Chat HTML review → Georg feedback**

Cloudflare:
**HOLD until a persistent/shared milestone is actually useful.**

## Sequencing

Georg has now explicitly accepted the current WB1 foundation and asked to continue with the terrain-authoring direction.

**WB2-TERRAIN-SCULPT-01 is the current next functional WorldBuilder gate.**

The R3 uniform `−/+` size gesture remains a useful shared-editor candidate, but it is now **optional / non-blocking** for WB2 and may be reviewed/promoted separately.

Runtime owners must not change.

## Current result / next gate

**WB2-TERRAIN-SCULPT-01 · GEORG HUMAN PASS.**

The functional terrain-sculpt gate is closed.

Exactly one next WorldBuilder gate:
**Claude Design authoring/UI refinement on the accepted WB2 source.**

Do not extend WB2 here with Smooth / Flatten / material painting. Open those later as separate functional slices if still useful.
