# Inline 3D Edit Layer · Intake · 2026-09-20

Status: **REVIEWED SOURCE INTAKE · IMPLEMENTATION NOT STARTED**
Owner: **KFB ToolBox · Stage / Scene authoring**
Donor owner: **World Atlas / Claude Design intake**
Source baseline: `georg-doc/kayfabizarro@5316ce6903760f19e50bb8f7f619951b43bb1f47`

## Goal

Pin Georg's new Claude Design inline 3D editor as the reusable **detail-edit interaction donor** for KFB authoring tools without creating a second Scene Builder, World Editor, Resident owner or Platformer runtime.

This slice performs **source review only**. No runtime/editor code is promoted here.

## Exact donor

`tools/KFB-ToolBox/_inbox/KayKit Environment Atlas + Dungeon Generator + 3D scene editor TOOL (5)/KFB_Dungeon_RoomStudy_S21_EXPORT_2026-09-20/`

Primary files:

- `KayKit_Room_Study_S21.html` — working S21 room-study host and Mini-Editor.
- `docs/EDITOR_LAYER.md` — explicit cross-tool editor contract.
- `lib/kit-lab.js` — shared viewer/build seam including `onFrame`, `onResize`, `userData.recipe`.
- `lib/room-recipes.js` — current Dungeon host recipe.
- `README.md` / `HOUSEKEEPING.md` / `docs/HANDOFF_S21_ONBOARDING.md` — status/evidence/re-entry.
- `docs/SPRINT_22_ROOMS.md` — room sequence + E2 posing dependency.

The export contains **no copied model assets**; runtime assets remain GitHub-first.

## What is actually implemented in S21

Source-backed mechanisms:

- Three.js `TransformControls`;
- click-to-select visible scene object;
- move / rotate;
- snap increments **0.1 units / 15°**;
- object-attached mini menu that follows the selection on camera movement;
- **single part ⇄ semantic group** scope;
- group transform around a temporary pivot;
- **Absetzen** / bottom-to-surface floor placement;
- visible-object raycast filtering;
- local hand-correction cache in `localStorage`;
- cache invalidation by recipe identity;
- output as a **recipe patch**, not silent file mutation;
- reset-to-source-recipe path;
- OrbitControls disabled while dragging;
- viewer hooks `onFrame` and `onResize`.

The S21 docs explicitly state that the recipe remains the source of truth.

## Evidence boundary

### Proven / source-backed
- R02 room-study source is present and documented as accepted in the exported onboarding.
- Housekeeping records cold-start R02 gates: ground contact, zero prop intersections, expected doorway cleanup and no missing names.
- Editor implementation and contract are present in source.
- Georg reports the Mini-Editor as useful and wants it reused.

### Not independently proven in this intake
- no new browser run was executed by this GitHub audit;
- no dedicated S21 editor TEST_REPORT / public Stage proof is present;
- there is no `EXPORT_MANIFEST.json` at the export root;
- the editor has not yet been integrated into the promoted World Atlas, Resident Atlas, ToolBox Stage or Platformer consumer.

Therefore status is **REVIEWED SOURCE INTAKE**, not `CURRENT_TOOL` or `PUBLIC_VERIFIED`.

## Important discovery: this is not a new universal editor

Existing KFB authoring donors already provide broader manipulation:

### Travel World Authoring POC
`travel/wip/travel_globe_wsa/world/`

Already has:
- Object Composer: place, move, rotate, scale, ground snap, duplicate/delete, save/reload, candidate World Recipe;
- Resident Prefab Lab: grouped root transform, ungroup/edit/regroup;
- Route Lab: point gizmos and candidate spline output.

These remain their own authoring POCs and Travel boundaries.

### ToolBox Stage / Scene Builder
`tools/KFB-ToolBox/_handover/ELISA_PRIORITY_STAGE_BUILDER_2026-09-15/`

Already decides:
- viewport-first direct manipulation;
- Stage / Scene Builder / Terraformer as contexts inside one ToolBox Stage;
- Resource Picker as asset entry;
- Pose as a first-class workspace.

S21 therefore fills a narrower gap:

> **inline detail editing directly on a selected object, with semantic group scope and recipe-patch return.**

It should be a reusable layer, not a new top-level application.

## Generic seam to extract on the SECOND real integration

The S21 contract correctly says not to extract a library from only one use case. Keep that rule.

Current S21 code still has host-specific pieces:
- `raum.id`;
- `raum.props`;
- Dungeon `patchZeile()`;
- current recipe fields such as `a`, `propId`, `auf`.

The reusable core is separable from those fields.

Candidate host adapter responsibilities for the second implementation:

- `getRecord(node)`
- `getGroupId(record)`
- `getScopeId()` / cache namespace
- `serializePatch(node, record)`
- `snapToSurface(node, context)`
- `isPickable(node)`
- optional `canTransform(node, mode)`

This is a **design of the extraction seam**, not a new schema/contract yet. The second real host must prove the names/API.

## Recommended implementation order

### E1 · Dungeon Generator / World Atlas · second host
Use the promoted World Atlas as the first receiving owner.

Goal:
- reuse S21 Mini-Editor on generated/placed Dungeon props;
- **do not** let manual edits replace the S13.2 layout generator;
- structural walls/floors remain generator-owned;
- detail props may return transform patches into the room/generator recipe;
- once this second use works, extract the genuinely shared portion into `lib/edit-layer.js`.

This is the right extraction point because World Atlas already shares the same `kit-lab.js` / recipe placement grammar.

### E2 · Resident Atlas · composition + posing
Then adapt the shared edit layer to Resident recipes.

First:
- root/prop placement;
- snap to measured surfaces;
- semantic groups.

Then the already-written S21 E2 contract:
- sitting uses a real registered clip + measured seat surface;
- hand contact is an IK/contact target, not a hand-authored replacement animation;
- gaze/head target reuses existing EyeRig/face semantics;
- no hand-rotated skeleton as a substitute for a real source clip.

Reuse the current ToolBox pose JSON / Resident recipe owner. Do **not** invent a second pose format in this slice.

### E3 · ToolBox Stage / Scene Builder + Environment
Integrate the **same detail layer** into the existing Stage/Scene/World authoring workflow.

Keep:
- World Composer / Resource Picker for broad scene placement;
- Scene Builder for full composition;
- S21 edit layer for selected-object micro-adjustment / semantic group moves / patch return.

Environment/World Atlas consumers may add surface-specific snapping callbacks; they do not gain Travel runtime ownership.

### E4 · Platformer authoring
Last, because Platformer has gameplay/collision semantics.

Current pinned Claude export:
`tools/KFB-ToolBox/_inbox/cloud-design-worldbuilding-2026-09-18/platformer-poc/`

It is a candidate gameplay POC, not a production editor owner.

The future Platformer authoring adapter may edit:
- support/platform transforms;
- scenery/props;
- resident-module mounts.

It must not silently change:
- player movement;
- jump/contact solver;
- collision ownership;
- checkpoint/progression semantics.

## Pose-collection direction

Georg's proposed modular pose collection fits this architecture:

`source clip → optional contact/IK targets → local pose adjustment → saved owner-native pose/recipe → later animation-clip authoring`

Important boundary:
- first preserve a registered source animation/pose identity;
- author only additive offsets/contact targets where supported;
- animation-clip baking/export is a later Animation/ToolBox responsibility, not an implicit side effect of scene editing.

## What NOT to do

- do not copy the S21 block separately into every tool;
- do not create another asset library;
- do not make `localStorage` the production truth;
- do not let the edit layer own runtime collision, terrain, movement or persistence;
- do not turn the compact object menu into a generic desktop DCC UI;
- do not add scene-tree complexity merely because Three.js supports it;
- do not promote the full S21 Claude export over current World Atlas by filename/version alone.

## One next gate

**E1 only:** integrate S21's inline editor into the current promoted Dungeon/World Atlas as the second real host; preserve S13.2 generator ownership; return one visible prop-adjustment → recipe-patch roundtrip.

Only after that proof should `lib/edit-layer.js` become a shared module.
