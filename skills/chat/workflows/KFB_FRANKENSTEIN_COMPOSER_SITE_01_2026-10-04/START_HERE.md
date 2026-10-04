# KFB FrankenStein Composer · GPT Site

Status: **PLANNING READY · IMPLEMENTATION NOT STARTED**
Date: 2026-10-04
Workflow: `KFB-FRANKENSTEIN-COMPOSER-SITE-01`
Owner: **KFB ToolBox** in `georg-doc/kayfabizarro`
Branch: `planning/frankenstein-composer-gpt-site-2026-10-04`

## Bounded slice

- **Goal:** one browser authoring surface where Georg can combine a verified KFB/FrizzleBob head/face stack with compatible KayKit bodies, audition the correct rig-family motion, create living Pencil/Prop actors, and save/reload the resulting actor recipe.
- **Owner:** existing KFB ToolBox / FrankenStein actor-composition lane. This Site is an authoring frontend, never a second rigging, motion, EyeRig, face or game-runtime owner.
- **Source:** current ToolBox contracts + source-first KayKit Character Compatibility matrix + current Studio/Face donors named below.
- **Protected boundary:** preserve `kfb.pets/1`; preserve Rig_Medium/Rig_Large/Rig_Legacy skeleton ownership; preserve current Motion Library; preserve EyeRig v6 and existing face/ear owners; consumer games retain movement/camera/physics/audio ownership.
- **Done when:** one integrated browser candidate proves source isolation → body/head/face composition → compatible animation audition → save/export → cold reload/import on representative Rig_Medium, Rig_Large and Prop actors, with no placeholder source and no duplicate owner.

## Product outcome

Working name: **KFB FrankenStein Composer**.

The primary interaction is not destructive mesh fusion. It creates a **reversible Actor Recipe**:

`source body + source skeleton + head graft + face stack + ear stack + surface/look + motion profile refs + authoring transforms`

The body and skeleton remain the selected KayKit source. The FrizzleBob/KFB head and face stack are mounted through the existing graft/FaceHost chain. Motion is selected only from clips compatible with the selected rig family. The saved result remains source-addressable and reversible.

## Core modes

### 1. Source Bench · mandatory first view
Every donor must be viewable **alone** before it can be integrated. A successful asset URL is not acceptance.

For every selectable body/head/prop:
- render the exact source object in isolation;
- show source path, rig family, skeleton/bone summary and provenance;
- show compatibility state: VERIFIED / MEASURED / SOURCE_REQUIRED / UNSUPPORTED;
- no fallback geometry if the source is missing.

### 2. Body
Body picker consumes verified Asset Librarian / ToolBox source records, grouped by:
- Rig_Medium;
- Rig_Large;
- Rig_Legacy where the exact skeleton/adapter is proven;
- other KayKit bodies only after skeleton/facing/head-anchor compatibility is measured.

Do not retarget all bodies into one invented universal skeleton.

### 3. Head / Graft
First production head family:
- exact pinned FrizzleBob EarRig-v5 donor: `tools/KFB-ToolBox/ear-rig/glb/FB_TEMPLATE_LOOK_v5.glb` @ `19088b142c6a7e7626f27fba8e80caf6ab2437c1` (blob `131d7c3862591708bbd4ad50af39093605b56b92`);
- optional newer comparison donor: `FB_TEMPLATE_LOOK_v5b.glb` @ `23615cff` (blob `24134a51793fef0dd8cab59bbf50b6b7c5960a45`);
- these model files are pinned historical GitHub donors and are not claimed to exist at the current `main` path;
- existing FrankenStein graft chain:
  - `frizzlegraft-v1/graft-biped.v1.js`
  - `frizzlegraft-v1/facehost.v1.js`
  - `frizzlegraft-v1/headgraft.v1.js`
  - `frizzlegraft-v1/ears.v2.js`
  - `frizzlegraft-v1/actor-wobble.v1.js`

Head fit uses measured head/bone bounds and head-based scale. Do not resize the entire body to make the head fit.

Future KFB heads enter through the same measured HeadProfile/Graft seam, not by forking the renderer.

### 4. Face stack
Reuse the current Studio owners:
- eyes: `pet-eye-rig.v6.js`;
- brows: `brow-rig.v2.js`;
- clay eyelids: current repository-resident `clay-lids.v1` candidate from the 2026-10-01 ToolBox session cut, preserving the Eye Actor Studio volume-lid lineage and eyeball-bound auto-fit;
- mouth / viseme / rest-mouth: current Studio mouth owner;
- ears: EarRig v5 / current ear-dangle owner;
- face part mount: current FaceHost/face-mount chain;
- clay surface treatment: current ToolBox clay/body-surface donor where supported.

The Site may expose parameters, presets and semantic emotes, but must not clone those implementations.

### 5. Motion
Motion panel is rig-aware:
- Rig_Medium → current compatible KayKit/Motion Library catalogue;
- Rig_Large → current compatible Rig_Large catalogue;
- Rig_Legacy → only proven Legacy clips;
- Prop actors → no fake humanoid animation binding.

Use the verified rig-family Motion Library catalogue resolved for the implementation pin; do not hardcode a historical clip count. Current-main `KFB_Motion_Library.catalog.json` resolves at blob `694d797702d126e71a724eab137197bf2a8e6914` with 33 clip records, while later ToolBox session history references Motion Library v3 with 204 clips at pin `4fa082714c7200f6926008a1cd0b34db8df4dbad`. The implementation must pick and pin one verified catalogue rather than silently mixing generations. One skeleton = one mixer. Authoring preview never becomes a second game movement controller.

### 6. Pencil / Prop Actor
Verified initial source:
`media/3D_Assets/KayKit_RPGToolsBits_1.0_FREE/Assets/gltf/pencil_A_long.gltf`

Pencil is a static/source prop host with a measured front/up/bounds profile. Add face life through the current EyeRig/FaceHost semantic seam:
- pupils/gaze;
- blink;
- clay upper/lower eyelids;
- animated brows;
- emotes/life;
- optional mouth only when a real mouth donor/placement exists.

Body movement for a prop is a separate semantic/procedural PropActor adapter; do not bind humanoid clips by accident.

### 7. Eraser
Current repository search still finds no real Eraser/Rubber GLTF/GLB source. Therefore:

**Eraser = SOURCE_REQUIRED.**

The UI may show a disabled Eraser row explaining the missing source. It must not render a cube, rounded box, generated rubber or any other substitute. As soon as a verified source is resolved through Asset Librarian/intake, it enters the same PropActor path as Pencil.

### 8. Pose / Fit
Reuse Studio pose/edit modules:
- head/face anchor handles;
- existing pose gizmos and patch export;
- head-based fit;
- source-facing correction only when measured;
- undo/redo;
- no destructive source mutation.

### 9. Save / Export
Primary round trip remains compatible with the existing actor contract `kfb.pets/1`.

If the Composer needs extra provenance or composition metadata before a canonical schema exists, save it as a **companion candidate manifest** referencing the existing actor config. Do not silently promote a new global actor schema.

Round trip:
`load sources → compose → save/export → fresh browser state → import → same source identities + same transforms + same face/motion refs`.

## Proposed Site layout

Compact Studio language, not generic dashboard chrome:

- **left:** Source / Body / Head / Face / Props;
- **center:** one clean 3D authoring stage;
- **right:** compatibility, rig, animation, pose and selected-part controls;
- **bottom dock:** isolate source, compose, play/stop, save actor, export, import, reset.

A visible toggle switches between:
- **SOURCE** — exact donor alone;
- **COMPOSITE** — current Actor Recipe;
- **MOTION** — same composite with selected compatible clip.

No palette, modal or debug overlay may cover the actor during the core review.

## Asset Librarian seam

The Composer does not create another asset catalogue. It consumes Asset Librarian handoffs/search results for candidate bodies and props, then applies the ToolBox compatibility classifier before allowing composition.

Useful filters:
`character`, `Rig_Medium`, `Rig_Large`, `Rig_Legacy`, `head`, `prop`, `Pencil`, `Eraser`, `KayKit`.

## Source pins / donors to reuse

- ToolBox contracts: `tools/KFB-ToolBox/docs/CONTRACTS.md`
- ToolBox module index: `tools/KFB-ToolBox/docs/MODULES.json`
- KCC source matrix: `kfb-hub/stage/toolbox/kaykit-character-compat-v0/SOURCE_MATRIX.json`
- EyeRig v6: `tools/KFB-ToolBox/kfb-rigs-embed-v3/petstudio-v9/studio-v12/pet-eye-rig.v6.js`
- Brow rig: `tools/KFB-ToolBox/kfb-rigs-embed-v3/petstudio-v9/studio-v12/brow-rig.v2.js`
- Frizzle graft: `tools/KFB-ToolBox/kfb-rigs-embed-v3/frizzlegraft-v1/`
- current repository-resident clay-lid implementation candidate: `tools/KFB-ToolBox/_inbox/KFB_TOOLBOX_CLAUDE_DESIGN_SESSION_CUT_2026-10-01_r1/kfb-lib/clay-lids.v1.js` (blob `d7cea2ae7be416f32d634190b335f1a40b29c7b2`); its history records derivation from the older Eye Actor Studio PR #159 donor, whose former main-style path is not present on current main
- current accepted/newer ToolBox face-state evidence: `tools/KFB-ToolBox/_inbox/KFB_TOOLBOX_CLAUDE_DESIGN_SESSION_CUT_2026-10-01_r1/`
- FrizzleBob Ear Rig v5 source: pinned GitHub donor above, not a current-main path
- Motion Library: `media/3D_Assets/Animations/KFB_Motion_Library/`
- Pencil: exact source path above.

## First fixtures

The implementation must start with these real fixtures:

1. **FrizzleBob head/face + Rig_Medium body** — prove existing graft unchanged.
2. **Same FrizzleBob head/face + one Rig_Large body** — prove family-aware head fit + Rig_Large motion, not a hidden Medium clone.
3. **Pencil A long + EyeRig/Clay lids/Brows** — prove PropActor face stack without humanoid body assumptions.
4. **Eraser** — disabled SOURCE_REQUIRED row until the real source exists.

Then add arbitrary compatible KayKit bodies through data, not hardcoded buttons.

## Acceptance

Automated/source checks:
- every selectable donor has a resolved exact source;
- no selected donor is a placeholder;
- source-isolation mode renders the same selected source;
- rig family classifier matches skeleton;
- one mixer max per animated skeleton;
- no second EyeRig/brow/motion implementation;
- round-trip preserves source identities and untouched fields.

Browser fixtures:
- Rig_Medium composite loads and plays a compatible clip;
- Rig_Large composite loads and plays a compatible clip;
- Pencil face reacts: gaze + blink + clay lids + animated brows;
- switching SOURCE ↔ COMPOSITE does not change source identity;
- fresh import reconstructs the actor;
- Eraser remains disabled until source exists;
- zero uncaught browser errors/resource 404s.

Visual proof:
- donor screenshot in isolation before each integrated fixture screenshot;
- front + 3/4 for head fit;
- eyebrows and clay lids visibly animate;
- no clipping introduced by head graft at neutral and one motion pose.

## Site / Stage policy

Target product is a **KFB FrankenStein Composer GPT Site** backed by these source contracts.

The current chat environment has no authenticated GPT-Site authoring/publish action, so this branch is the durable implementation brief and source contract. Do not claim a GPT Site has been created from this planning commit.

If a public KFB runtime review is later required, reserved route:
`https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/frankenstein-composer/`

Status now: **RESERVED · NOT CREATED · NOT LIVE**.

No merge and no Live promotion without Georg's named gate.

## Exactly one next gate

**IMPLEMENT GPT SITE / COMPOSER FRONTEND ON THIS BRIEF** using the existing ToolBox donors and Asset Librarian seam. First visible proof must show the selected body/head/prop source **in isolation** before the integrated composite.
