# WSA · 2D/2.5D Resident Actor Integration

**Date:** 2026-09-20  
**Status:** `HANDOFF PREPARED · WSA CHECK-IN`  
**Existing integration lead:** WSA — unchanged  
**Tool owner:** `tools/2D Animation Studio/`

## Goal

Turn the source-first 2D Animation Studio into a reusable presentation producer for named consumers without creating a new world/runtime owner.

First actor:

**DocCheck Eumel · 2.5D Resident**

Planned first uses:

1. DocCheck Project Island with an exact pinned KayKit 3D environment;
2. KFB Resident Atlas as a new `2p5d-cutout-resident` presentation class;
3. later named KFB game consumers through the same mount/update/dispose seam;
4. future DocCheck characters such as **Doccy** through a quadruped cutout topology template.

## Read first

1. `skills/chat/START_HERE.md`
2. `skills/chat/REGISTRY.json`
3. `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`
4. `skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`
5. `skills/kfb-cartoon-animation_v2.md`
6. `tools/2D Animation Studio/START_HERE.md`
7. `tools/2D Animation Studio/docs/CONSUMER_MATRIX.md`
8. `tools/2D Animation Studio/contracts/kfb-2d-actor-module.v0.1-candidate.json`
9. `tools/2D Animation Studio/consumers/eumel-resident/README.md`
10. `tools/resident_atlas/modules/README.md`
11. `tools/KFB-ToolBox/_handover/RESIDENT_SCENE_MODULES_WSA_2026-09-19/START_HERE.md`

## Current source facts

Eumel source:

- Illustrator source blob: `436143b019f0034c6d2d9183154cf613ff8c701e`
- source-exact component SVG blob: `457bca8a76bd156ba627763098f0dcfc9a54edc1`
- rig contract blob: `742cb0504bdd0f2ed16bb01f618764c5da9c4a17`
- neutral-bind blob: `3f080dc26b74e3f2b9ae6283aff18a26347a0782`
- shared EyeRig protocol: `kfb.eye-rig.protocol/1`

Cross-render eye proof exists and has static sanity PASS. Its browser/visual gate remains separate.

## New prepared contracts

- `tools/2D Animation Studio/2D_TOOLBOX_MANIFEST.json`
- `tools/2D Animation Studio/contracts/kfb-2d-actor-module.v0.1-candidate.json`
- `tools/2D Animation Studio/consumers/eumel-resident/EUMEL_2P5D_RESIDENT_BINDING.v0.1.json`
- `tools/resident_atlas/modules/candidates/eumel-doccheck-project-island.module.json`
- `tools/2D Animation Studio/templates/DOCCY_QUADRUPED_RIG_TEMPLATE.v0.1.json`

## Architecture decision

A 2.5D actor is a **presentation class**, not a world runtime.

```text
world / island / resident consumer
        owns
position · heading · collision · camera · interaction · persistence
        ↓
world anchor
        ↓
2D actor module
        owns
source art · local bones · acting · eye/face · secondary motion
```

The candidate actor lifecycle is:

`mount → root → update(dt) → setState(...) → dispose`

## Eumel 2.5D mode

First proposed world-space presentation:

`upright-yaw-billboard`

Requirements:

- world-space root, not a screen overlay;
- grounded upright character;
- yaw-only camera following when billboard mode is selected;
- alternate `world-facing-upright` mode;
- tiny layer depth only, preserving source proportions;
- consumer owns ground/support/collision;
- source Bézier paths remain unchanged.

## WSA Phase 1 · three2p5d adapter proof

Build exactly one renderer adapter/proof:

`source-exact Eumel → world-space THREE.Group → neutral KayKit-compatible stage`

Test:

- source identity;
- neutral bind;
- idle/look/hop;
- fixed hip anchors;
- shared EyeRig;
- yaw billboard vs fixed world-facing switch;
- shadow/ground relation;
- clean dispose;
- one RAF/update owner.

Do not build the full Project Island yet.

## WSA Phase 2 · Resident Atlas mount

Use the existing Resident Scene Module seam.

Candidate:

`tools/resident_atlas/modules/candidates/eumel-doccheck-project-island.module.json`

Do **not** add it to the resident module index until Phase 1 browser proof passes.

Resident Atlas/receiving consumer still owns:

- platform/island support;
- collision;
- camera;
- gameplay;
- persistence.

The current Clown S33/WSA visual gate is not replaced or retroactively passed by Eumel work.

## WSA Phase 3 · DocCheck Project Island

After the Resident mount proof:

- choose an exact KayKit environment set through Registry/Game Dev Studio;
- pin source paths/revisions;
- build one bounded DocCheck Project Island;
- mount Eumel at a measured ground anchor;
- use restrained DocCheck accent `#cc0033` only for UI/wayfinding where appropriate;
- no generic medical scenery invented as fallback.

DocCheck product content remains owned by the DocCheck consumer project.

## WSA Phase 4 · named KFB game consumer

Only after the Resident proof, choose **one named game consumer**.

Candidate examples:

- Free Roam/Platformer resident island;
- Town scene;
- Travel project stop;
- micro-game host/presenter.

Do not write all consumers at once.

## Doccy / quadruped follow-up

Doccy is a future source intake, not a generated dog.

Prepared topology:

`tools/2D Animation Studio/templates/DOCCY_QUADRUPED_RIG_TEMPLATE.v0.1.json`

The template supports:

- body/root;
- four explicit shoulder/hip limb chains;
- optional small elbow/knee bend proxies;
- stretch/squash;
- head/ear/tail secondary motion;
- same shared EyeRig protocol.

Before implementation WSA must receive the authoritative Doccy source art and measure it. Do not infer anatomy/proportions from a generic dog.

## Protected boundaries

- 2D Animation Studio does not own world movement/collision/camera.
- Resident Atlas does not become the source-art editor.
- Game Dev Studio/Asset Registry retains asset discovery/provenance responsibilities.
- ToolBox keeps the 3D EyeRig/FaceHost/FrankenStein owner.
- DocCheck source art is not replaced by KayKit geometry.
- No second resident runtime.
- No automatic Registry promotion.
- No public review link until Cloudflare route is `PUBLIC_VERIFIED`.

## WSA check-in packet

WSA should receive:

1. exact source branch/commit;
2. changed-file list;
3. static tests;
4. public/browser evidence when available;
5. owner-boundary review;
6. Resident candidate status;
7. DocCheck handoff pointer;
8. next single gate.

## Exit gate for this handoff

Close this preparation when:

- the contract files are on `main`;
- DocCheck receives a project-island consumer pointer;
- Resident Atlas receives the candidate module pointer;
- the three2p5d adapter slice has a named branch/brief;
- Doccy is recorded as source-required quadruped template only;
- no runtime owner was silently replaced.


## Phase 1 implementation checkpoint

A concrete world-space proof is now implemented at:

`tools/2D Animation Studio/proofs/eumel-three2p5d-v1/`

Static sanity: **PASS**.

The proof now attempts:

- source-exact layer rasterization;
- world-space z-layered Three.js planes;
- measured neutral leg bind/hip anchors;
- source shadow on a ground plane;
- `upright-yaw-billboard` / `world-facing-upright`;
- neutral/idle/look/walk/hop local states;
- shared EyeRig semantics on Three.js wrapper groups.

Current next gate is therefore narrower than the original brief:

**real browser review of this exact proof page → accept / tune / reject**

Do not build the Project Island or index the Resident candidate before that browser gate.


## Game Dev Studio package checkpoint

Eumel is now also prepared as a Game Dev Studio candidate package:

`game-ready/eumel-2p5d-actor/`

Catalog:

`tools/game-dev-studio/catalog.json`

This makes the actor discoverable as a package/handoff input for future named KFB games without transferring runtime ownership.

Current package status:

- source/component pins: PASS;
- package metadata: IMPLEMENTED;
- three2p5d static sanity: PASS;
- browser proof: PENDING;
- Resident consumer: PREPARED / NOT INDEXED;
- DocCheck Project Island: PREPARED / NOT BUILT;
- named KFB game runtime: NOT SELECTED.

The current Game Dev Studio public UI still presents `packages[0]`; this registration does not claim a public Eumel package preview.


## Doccy intake is ready

Prepared source lane:

`tools/2D Animation Studio/_inbox/doccy-source/`

Topology donor:

`tools/2D Animation Studio/templates/DOCCY_QUADRUPED_RIG_TEMPLATE.v0.1.json`

No Doccy runtime/geometry work should begin until authoritative source art arrives and is audited.
