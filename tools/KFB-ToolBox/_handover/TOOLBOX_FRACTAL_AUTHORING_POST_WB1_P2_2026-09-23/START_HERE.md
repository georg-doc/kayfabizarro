# KFB ToolBox · Fractal Authoring Consolidation · post-WB1-P2

**Date:** 2026-09-23  
**Status:** PREPARED BRIEF · NO RUNTIME BUILD · EXECUTE ONLY AFTER WORLDBUILDER WB1-P0–P2  
**Owner:** existing KFB ToolBox / Stage-First authoring owner  
**Branch:** `chatgpt-web/toolbox-fractal-authoring-brief-2026-09-23`

## Decision

After WorldBuilder **WB1-P0 → WB1-P1 → WB1-P2** are green, continue the authoring consolidation in the fresh **KFB ToolBox Claude Design project**.

Do **not** move ToolBox ownership into the separate World Design / lighting project.

The World Design project remains a donor / receiving WorldBuilder context for:

- WhackMan-derived Environment Profile;
- world lighting/fog/local-visibility look;
- Surface Adapter / WorldBuilder visual composition.

The KFB ToolBox project remains the authoring home for:

- Actor selection;
- Face / EyeRig / brows;
- Head / graft;
- Body / pose / motion;
- props / attachments;
- compact in-scene editing;
- scene groups;
- Story Zone authoring;
- export/import patches and recipes.

WorldBuilder consumes those shared authoring seams later. It does not own them.

## Why this split

The desired authoring model is already naturally layered:

`EyeRig / Brows / Lashes → Face → Head/Graft → Actor/Body → Pose/Motion → Activity/Scene → Story Zone → World placement`

That is a ToolBox authoring problem.

WhackMan lighting, terrain/surface, routes and world placement are WorldBuilder concerns.

Mixing both inside the World Design project would create a second:

- EyeRig owner;
- Resident editor;
- scene-editor implementation;
- asset browser;
- save/profile owner.

## Read in this order after WB1-P2

1. `CURRENT_STATE.md`
2. `FRACTAL_AUTHORING_CONTRACT_v0.json`
3. `CLAUDE_DESIGN_BRIEF.md`
4. current GitHub versions of:
   - `tools/KFB-ToolBox/START_HERE.md`
   - `tools/KFB-ToolBox/_handover/STAGE_FIRST_V1_INTAKE_2026-09-18/START_HERE.md`
   - `tools/KFB-ToolBox/_handover/EYE_RIG_BATCH_2026-09-18/START_HERE.md`
   - `skills/chat/workflows/KFB_INSCENE_EDITOR_MODULE_V1_2026-09-20/START_HERE.md`
   - `tools/resident_atlas_s6/docs/ATLAS_RETURN.md`
   - `tools/KFB-ToolBox/_handover/WORLD_BUILDER_V1_2026-09-22/START_HERE.md`

GitHub state overrides this packet if any owner/head has moved.

## Important current correction

The user-supplied Claude project summary says a folder named:

`_handover/STAGE_FIRST_V1_PROMOTION_2026-09-18/`

contains promotion manifests and that Slice A is around 80%.

At preparation time this folder is **not present on current `main`**.

Likewise:

`tools/KFB-ToolBox/stage-first/`

does not exist on current `main`.

Therefore the Claude project state is useful external work, but **not current GitHub SSOT** until exported/reconciled.

Do not throw it away.
Do not trust the summary as source either.

## First post-WB1-P2 gate · TFA-0

**Export and reconcile the current KFB ToolBox Claude project before any redesign/build.**

Compare the actual exported tree against:

- the merged Stage-First v1 intake;
- current ToolBox source;
- current EyeRig/Motion/Resident donors.

Classify every delta as:

- already canonical on GitHub;
- useful new ToolBox implementation;
- stale/superseded;
- local duplicate;
- unresolved.

Only after TFA-0 may the consolidation shell be implemented.

## Product shape

Keep the accepted Stage-First principle:

**one dominant 3D stage, one persistent navigation layer, one contextual palette.**

Do not add a new dashboard.

The fractal hierarchy appears as **selection context / breadcrumb**, not another top-level navigation bar.

Example:

`World / Story Zone / Scene / Actor / Head / Face / EyeRig / Brows`

Selecting a level changes the active edit owner.

## Persistence rule

Edits save at the lowest owner that can express them:

- Eye geometry/gaze → Eye profile;
- brow shape → brow/face overlay profile;
- head/graft → graft/actor profile;
- pose/motion → motion/pose profile;
- prop attachment → actor/activity profile;
- scene transform → `kfb.scene-patch.v1`;
- Story Zone composition → Story Zone recipe;
- world placement/navigation → receiving WorldBuilder/world host.

No giant flattened scene save.

## First visual authoring fixture

Use **FrizzleBob Yellow / Graft Driver** as the first Face/Head/Body nested-editor proof because the relevant source modules already exist and the current Claude screenshot shows the same family.

Specific face gate:

**FrizzleBob brows must remain visually anchored to the eyes while width/scale is adjusted.**

The existing `brow-rig.v2.js` remains the owner.
Do not create a second eyebrow implementation.

First expose and test its real controls.
Only if the measured visual gate proves the current pair-wide scaling behavior insufficient, extend the existing owner with a per-eye-centred width/spacing mode.

## Later arbitrary-host direction

After character workflows are stable, support non-character hosts such as a car through an explicit/manual **FaceHost / FaceFrame** adapter:

`select host → define face plane/orientation → place EyeRig frame → save profile`

Do not guess car-eye positions automatically in the first consolidation slice.

## Reserved future route

If this authoring shell is later built and published:

`https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/fractal-authoring/`

**RESERVED ONLY · NOT BUILT · NOT DEPLOYED · NOT PUBLIC_VERIFIED**

## Do not

- start this build before WB1-P2 is green;
- rebuild EyeRig v6;
- rebuild Resident Atlas;
- build a second Asset Librarian;
- build a second generic Three.js editor;
- move WorldBuilder lighting ownership into ToolBox;
- move ToolBox authoring ownership into the World Design project;
- flatten all profile/scene/world state into one JSON;
- delete local Claude-project files based only on the chat summary;
- ask Georg for internal actor IDs/functions when code can recover them.

## One next gate

Finish WorldBuilder WB1-P0–P2.

Then execute **TFA-0 · export/reconcile current KFB ToolBox Claude project** before any Claude visual authoring pass.
