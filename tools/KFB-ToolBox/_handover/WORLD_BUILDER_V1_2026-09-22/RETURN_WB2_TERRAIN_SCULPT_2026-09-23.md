# RETURN · WorldBuilder WB2-TERRAIN-SCULPT-01 · 2026-09-23

Status: **GEORG HUMAN PASS · WB2 TERRAIN + INTERACTION ACCEPTED · CLAUDE DESIGN/UI FOLLOW-UP UNBLOCKED**

## Outcome

WB2 adds a bounded non-destructive terrain-modelling layer on top of the accepted WB1/R2 scene-authoring foundation.

Implemented:
- continuous procedural base terrain retained;
- **Raise** terrain brush;
- **Lower** terrain brush;
- brush Radius;
- brush Strength;
- visible brush footprint;
- drag strokes;
- mouse-wheel / touchpad brush-radius adjustment while sculpting;
- hold-Space temporary Orbit without losing the active Raise/Lower mode;
- quick mode keys: `1` Object/Orbit · `2` Raise · `3` Lower;
- true C2 quintic radial falloff;
- Undo last stroke;
- Clear sculpt layer;
- compact sculpt-stroke Save/Reload;
- vertex-normal recompute;
- terrain-color refresh after live dabs;
- exclusive terrain-sculpt pointer ownership;
- explicit **Object edit** mode returning control to the accepted shared ToolBox inline editor.

Not introduced:
- voxel terrain;
- hex/tile terrain;
- CSG;
- marching cubes;
- detached mound meshes;
- a second object picker;
- a second TransformControls owner;
- a new Resident/Animation owner.

## Repository

Repository:
`georg-doc/kayfabizarro`

Branch:
`chatgpt-web/worldbuilder-wb2-terrain-sculpt-2026-09-23`

Stacked Draft PR:
**#190**

Base branch:
`chatgpt-web/worldbuilder-toolbox-scene-authoring-2026-09-23`

Verified evidence head before this Return:
`6dd8ee040bfb6dadbd29362b9238986212d88c20`

PR state:
- Draft: yes
- merged: no
- auto-merge: no

## Accepted foundation

WB1/R2 remains the accepted base:
- Caveman texture in Chat HTML: HUMAN PASS;
- Character Y edit/save/reload: HUMAN PASS;
- palette/FOV: HUMAN PASS;
- object-attached shared inline editor: HUMAN PASS;
- Move / Rotate / free Scale / Drop / World-Local / Close / transform Save-Reload: HUMAN PASS.

Object-edit owner remains:
`tools/KFB-ToolBox/lib/edit-layer.js`

Current inherited module blob:
`c15a200ba8615d55f9d3ae26616e0a8ceba8dc01`

R3 uniform `−/+` size remains optional/non-blocking.

## WB2 files / blobs

Canonical Source:
`tools/KFB-ToolBox/worldbuilder/wb2-terrain-sculpt-01/WB2_TERRAIN_SCULPT_01_SOURCE.html`

Source blob:
`a250f1a36137121942f0f99d6a259146d718b162`

Zero-install Review:
`tools/KFB-ToolBox/worldbuilder/wb2-terrain-sculpt-01/WB2_TERRAIN_SCULPT_01_REVIEW.html`

Review blob:
`393e277adaef0948597ae6781b17d6ddabac1972`

Terrain-sculpt module:
`tools/KFB-ToolBox/worldbuilder/wb2-terrain-sculpt-01/terrain-sculpt.js`

Sculpt module blob:
`182f7c42b709a00547a16cfe0040d5d636bdb680`

Evidence:
`tools/KFB-ToolBox/worldbuilder/wb2-terrain-sculpt-01/TEST_REPORT.md`

Source manifest:
`tools/KFB-ToolBox/worldbuilder/wb2-terrain-sculpt-01/SOURCE.json`

Source manifest blob:
`2e1b9e75deaa8a9fff165fa0202ee3bc21339afd`

Human acceptance manifest status:
`GEORG_HUMAN_PASS`

## Architecture

Procedural base remains reversible:

`finalHeight(x,z) = baseHeight(x,z) + sculptDelta(x,z)`

Sculpt persistence lives under:
`terrain.sculpt.version = 1`
and
`terrain.sculpt.strokes[]`.

Each stroke stores:
- Raise/Lower mode;
- radius;
- strength;
- falloff id;
- compact X/Z dab points.

Reload:
1. regenerate the seeded procedural base;
2. replay sculpt strokes deterministically.

Undo:
- remove the last stroke;
- rebuild base + remaining strokes.

Clear:
- remove all sculpt strokes;
- rebuild the untouched procedural base.

## Interaction ownership

Sculpt mode and Object edit are mutually exclusive.

Terrain sculpt owns only:
- terrain ray hit;
- brush cursor;
- pointer-drag stroke;
- heightfield mutation;
- sculpt persistence.

Shared ToolBox `edit-layer.js` remains the owner of:
- object selection;
- Move;
- Rotate;
- Scale;
- Drop;
- World/Local;
- selected-object lifecycle.

Sculpt pointer handlers use `stopImmediatePropagation()` while active so the same gesture is not also consumed by Orbit/Object-editor listeners on the canvas.

## R1 authoring interaction enrichment

Georg requested faster terrain-authoring gestures without changing owners:

- wheel / touchpad scroll changes Brush Radius only while Raise/Lower is active;
- Object/Orbit mode keeps normal OrbitControls wheel zoom;
- hold Space temporarily yields the canvas to Orbit while preserving the active Raise/Lower mode;
- releasing Space returns immediately to the same sculpt mode;
- `1 / 2 / 3` provide fast Object/Orbit / Raise / Lower switching;
- existing object-editor `R` Rotate and `S` free Scale shortcuts remain unchanged.

Georg has accepted these interaction gestures in the direct Chat review.

## Georg final WB2 acceptance · 2026-09-25

**WB2-TERRAIN-SCULPT-01 · GEORG HUMAN PASS**

Accepted:
- Raise / Lower terrain shaping;
- Radius / Strength;
- wheel / touchpad Radius control;
- hold-Space temporary Orbit;
- `1 / 2 / 3` quick modes;
- Undo / Clear;
- Save / Reload;
- return to the accepted object-edit workflow.

This closes the WB2 functional gate and unblocks the prepared Claude Design authoring/UI pass.

## Pre-review corrections

Before human review:

1. corrected brush-center distance to true X/Z difference;
2. isolated Sculpt pointer ownership from other same-canvas listeners;
3. upgraded the falloff from an initial C1 kernel to a true quintic C2 compact falloff.

No human repair pass has occurred yet.

## Evidence actually recorded

### Sculpt math + geometry
**24/24 PASS**

### Source + Review contract
**56/56 PASS**

Focused wheel / temporary-Orbit / quick-mode contract:
**31/31 PASS**

### Exact pinned runtime sources
**4/4 PASS**
- Caveman;
- Caveman texture;
- Boulder;
- Rig_Medium CombatMelee animation.

### Embedded browser self-test
**34 assertions prepared / 0 executed**

Automated browser runtime:
**0**

Screenshots:
**0**

No browser PASS or visual PASS is claimed.

## Publication

Cloudflare:
**HOLD · NOT PUBLISHED**

Direct Stage URL:
**none**

Live:
**not promoted**

Merge:
**not requested**

Normal loop remains:
`GitHub candidate → Chat HTML → Georg review → bounded repair if needed`.

## Deferred

Do not start before this human gate:
- Smooth;
- Flatten / Set Height;
- material painting;
- erosion;
- masks;
- large-world sculpt cache/baking;
- Claude Design visual polish;
- WorldBuilder side-panel cleanup beyond what the functional gate requires.

UI direction is nevertheless recorded: object transforms remain inline; later cleanup should reduce redundant side-panel editor text/controls and maximize 3D FOV.

## Exactly one next gate

**Claude Design · WorldBuilder authoring/UI refinement on the accepted WB2 functional foundation.**

Use the existing `TERRAIN_EDITOR_CLAUDE_DESIGN_AFTER_WEB_2026-09-23.md` handoff.

Primary goals:
- reduce/collapse redundant side-panel editor controls and explanatory copy;
- keep Move / Rotate / Scale / Drop inline at the selected object;
- keep Terrain Sculpt controls scene-level and compact;
- maximize 3D field of view;
- compose the accepted WorldDesign look/environment controls into the editor;
- preserve all accepted WB1/WB2 save/reload and owner seams.

Do not add Smooth / Flatten / material painting in this design pass. Those remain separate functional slices.

## ADDITIVE UPDATE · WORLD r2 FAILURE RECOVERY · 2026-09-26

World r2 was additively re-homed into this existing PR #190 without changing the accepted WB2 terrain-sculpt or shared edit-layer owners.

Frozen candidate code:
`204afd6dbb1285f8cd77807af0db5fdd6e75308d`

Recovery docs head:
`fa29cfce9062a6fd6b5617ccb2fdaa48d0b57aaa`

Evidence:
- static owner/closure suite: **20/20 PASS**;
- final browser run `36198999279`: FAIL;
- Hürth boots and reaches selftest;
- 700 buildings;
- WB2 terrain/document assertions PASS;
- 13 semantic locomotion states bound;
- pageErrors = 0;
- failed source requests = 0;
- fail is the old `source-backed clips only (variants labelled)` assertion after the ToolBox profile ownership change.

Repair budget is exhausted.

Full recovery package:
`tools/KFB-ToolBox/worldbuilder/world-integration-01/failure-recovery/`

Exactly one next gate:
**WORLD-R2-CONTRACT-RESET-01 · test contract only first.**

No Stage/Public/Human PASS.
