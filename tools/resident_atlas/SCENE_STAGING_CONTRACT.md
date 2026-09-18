# Resident Scene Staging Contract

Status: CURRENT LOCAL CONTRACT · candidate composition  
Date: 2026-09-18

This file governs `tools/resident_atlas/` only. It does not replace the central production router, Asset Registry, `tools/resident_atlas_s6/`, Animation/Movement owners or any consumer runtime.

## Sync order

1. Read `skills/chat/START_HERE.md` and `skills/chat/SYNC_PROTOCOL.md`.
2. For resident/rig/pose facts, read the current `tools/resident_atlas_s6/docs/ATLAS_RETURN.md` and only the relevant recipe in `data/cast.js`.
3. Read this viewer's `README.md`, `CHANGELOG.md` and current scene recipe.
4. GitHub state overrides exported Dropbox copies or chat recollection when they differ.

Dropbox's `/CLAUDE/KFB ToolBox Studio Rig Anim/KayKit Resident Atlas/` remains useful provenance/export evidence, but is not allowed to override newer GitHub state.

## Owner matrix

| Concern | Owner / source |
|---|---|
| Asset identity and exact source path | Asset Registry / GitHub |
| Resident rig, tested pose and attachment evidence | `tools/resident_atlas_s6/` donor evidence |
| Scene camera, habitat and prop staging | `tools/resident_atlas/` |
| Shared production routing | `skills/chat/` |
| Final locomotion/world placement | receiving consumer runtime |
| Generic Animation Lab status | central router; currently `UNVERIFIED` |

## Resident scene binding

A scene may reference:

- `residentBinding.residentId`
- donor path + donor revision
- actor `rigFamily`
- exact `pose.clip`, source path and commit
- explicit `ground.y` and `ground.lock`

This is a reference seam, not a copy of the S6 recipe system.

## Runtime order

For an animated resident, the viewer must do these operations in this order:

1. load exact actor asset from its pinned GitHub commit;
2. apply declared visual scale and facing;
3. load the exact compatible KayKit animation file;
4. evaluate the selected pose/idle;
5. measure **posed** geometry with precise bounds;
6. place X/Z at the scene anchor;
7. move the posed lower bound to the declared ground plane;
8. when the clip keeps running and `ground.lock=true`, re-apply contact after mixer updates;
9. only then render the scene with habitat and props.

Grounding the bind/T-pose and animating afterwards is invalid for this lane.

## Prop rule

Use whole, exact authored assets. Position/rotation/scale may be scene staging. An unrelated asset must not be presented as another object. Hand attachments are inherited only when a tested donor contract explicitly supports them; scene composition must not guess a new grip.

## Evidence gates

A resident scene can claim:

- **IMPLEMENTATION** when the recipe and runtime path exist;
- **STATIC TESTED RESULT** when JSON parses and the module script parses;
- **BROWSER TESTED RESULT** only after the page loads the expected scene models and pose source without console/load failure;
- **GROUND CONTACT TESTED RESULT** only after posed lower-bound contact is measured within tolerance;
- **GEORG ACCEPTANCE** only after Georg's visual review.

A browser PASS is not a consumer integration PASS.
