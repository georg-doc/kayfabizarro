# KFB World Workbench · additive changelog

Never rewrite prior entries to make history look cleaner. Add a correction/successor entry instead.

## 2026-09-17 · W008 · IMPLEMENTATION POC

Added `prefab-lab.html` + `prefab-lab.js` as the first direct Resident Atlas → World authoring bridge.

Current Prefab Lab capabilities:

- load a declarative `kfb-resident-scene.v1` from pasted JSON or URL;
- one-click load the current `Caveman · Cave Camp` Resident Atlas scene;
- resolve exact resident assets from the scene's pinned `sourceCommit`;
- honor the Atlas scene's `fit.height` / `fit.max`, placement and rotation hints for the POC preview;
- assemble all scene parts under one movable prefab root;
- Move / Rotate / Scale the full resident ensemble with Three.js `TransformControls`;
- ungroup while preserving world transforms, then select/edit individual child assets;
- regroup loose children while preserving their current world placement;
- Hero / Top / Frame views using Atlas camera hints where present;
- local save/reload of source scene + candidate recipe;
- copy/download a `kfb.world-recipe.v0-poc` candidate with a `residentPrefabs` extension containing source-scene provenance, root transform and child transforms.

Hard boundary: the Prefab Lab is still a neutral `poc-local` authoring surface. It consumes Resident Atlas source recipes but does not become Resident Atlas truth, Travel terrain/runtime truth, Animation-Lab compatibility truth or a productive save owner. Travel decides whether/how the candidate prefab maps to spherical anchors and productive `kfb.world-recipe.v0` state.

Browser acceptance is still PENDING.

Context refresh while adding W008: current productive WB0 Ground evidence in Travel includes persistent player scale/facing calibration and the established W/S move, A/D turn, Q/E strafe mapping; latest reported static validation is 25/25 tests + build/verify PASS, human browser acceptance still pending.

## 2026-09-17 · W007 · IMPLEMENTATION POC

Added `route-lab.html` + `route-lab.js` as a separate spline-authoring UX proof.

Current Route Lab capabilities:

- start/cancel/finish one ROAD candidate;
- click neutral authoring ground to add control points;
- select and move individual control points with Three.js `TransformControls`;
- visual centerline preview through the authored points;
- undo point / delete selected point / clear all;
- top view and frame-road inspection;
- local save/reload;
- copy/download candidate spline JSON.

Hard boundary: this is **not** productive road geometry. It stores explicit `poc-local` ROAD control points only. Terrain projection, spherical anchoring, width/profile compilation, banking, road mesh, AI/navigation and productive persistence remain Travel/WB0-owned.

Browser acceptance is still PENDING.

## 2026-09-17 · W006 · IMPLEMENTATION POC

Added `composer.html` + `composer.js` as a direct-manipulation authoring UX proof.

Current POC capabilities:

- paste/import Librarian-style candidate JSON or a direct GLB/GLTF URL;
- load real repository assets rather than placeholder primitives;
- click-place them on a neutral authoring pad;
- select and edit with Three.js `TransformControls`;
- Move / Rotate / Scale;
- local ground snap;
- duplicate / delete / frame selection;
- measured current object bounds in the inspector;
- local save/reload through browser storage;
- copy/download a `kfb.world-recipe.v0-poc` candidate recipe.

Hard boundary: the authoring pad uses explicit `poc-local` coordinates and is **not** Travel terrain. The exported recipe is `candidate-only`; productive spherical anchoring, terrain conformance, movement and save/promotion remain Travel-owned.

Browser acceptance is still PENDING.

## 2026-09-17 · W005 · DECISION

Clarified `/world/` as **POC / Design Lab**, not a second World Builder runtime.

Required handoff path:

`/world/ POC → Candidate World Recipe → Travel validation → optional promotion`

The POC may experiment with placement, transform UX, snapping, prefabs, BlockBits, spline authoring UX, seed/variant browsing and recipe generation. It may not invent competing terrain, locomotion, Asset Registry, animation-compatibility or productive save truth.

## 2026-09-17 · W004 · PARALLELIZATION

Accepted the WSA role split:

- `/world/` / this chat: fast visual authoring/UX POC and design donor;
- Travel WB0: productive Globe runtime, terrain, locomotion, persistence, owner contracts and promotion;
- Asset Librarian: read-only source/search/bundle input;
- Resident Atlas: grouped resident/prefab candidate input;
- historical Voxel/Worldbuilder lines: donors, not new SSOTs.

## 2026-09-17 · W003 · WORKFLOW

Created a durable `/world/` planning surface so fresh chats can recover the active World Builder direction from one public URL instead of receiving pasted mega-briefings. The page remains a navigator; Travel GitHub/project SSOT wins on conflict.

## 2026-09-17 · W002 · CLEAN-ROOM NOTE

Added SP13KTRA as an **observation-only** donor. Its repository license is all rights reserved and explicitly forbids copying/modifying/derivative use without permission. KFB may learn abstract design/production principles; no source code, constants, circuit tables, music parameter tables, seed tables, shape implementations or assets are copied.

Observed principles recorded for independent KFB work:

- compact authored route skeleton → derived road/banking/hills/navigation/cues;
- route metadata as reference while movement stays in world coordinates;
- correlated spatial fields for districts/ridges;
- zone-level shape language and palette;
- procedural SFX/ambience as glue;
- seeded candidate generation + human curation;
- compile/bake stable world state from a small recipe;
- canonical assets for identity, procedural geometry for connective tissue.

## 2026-09-17 · W001 · IMPLEMENTATION NOTE

This workbench was created **after** WB0 already existed as an additive WIP under `site/world-builder/`.

Recorded existing evidence rather than re-implementing it:

- Travel implementation merge `b1b5065449f84fbf76112bd0e61790c6c9a54441`;
- PR #13 static result: 21/21 tests PASS, build PASS, verify PASS, 108 frozen B0 runtime files unchanged;
- public WB0 mirror path `/travel/wip/travel_globe_wsa/world-builder/`;
- human browser/gameplay acceptance still PENDING.

No runtime owner or canonical Travel contract was changed by creating this planning site.
