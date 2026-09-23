# KFB ToolBox · Fractal Authoring · Current State

**Prepared:** 2026-09-23  
**GitHub base at branch creation:** `main@8f9810e1a2c5ec1cf0e2c5d8a5947b9150f1a4a2`

This document classifies current reusable pieces. It does not promote Draft PRs or external Claude-project state.

## 1 · Stage-First v1

### GitHub truth

Current canonical entry:

`tools/KFB-ToolBox/_handover/STAGE_FIRST_V1_INTAKE_2026-09-18/START_HERE.md`

PR #49 is merged.

The intake proves/reviews:

- complete editable Stage-First export donor;
- 132-file export;
- 35-entry roster;
- Stage-first shell:
  `Actor · Face · Pose · Motion · Voice · Stage`;
- boot/selected source tests from exporter;
- honest gaps around connected functional authoring.

### Not on current main

The expected promoted owner path:

`tools/KFB-ToolBox/stage-first/`

is absent on current `main`.

The user-supplied Claude summary references:

`_handover/STAGE_FIRST_V1_PROMOTION_2026-09-18/`

but that directory is also absent on current `main`.

### Classification

`SOURCE DONOR / REVIEWED INTAKE · OWNER-REPO PROMOTION STILL UNPROVEN ON MAIN`

The screenshot/current Claude project may contain additional useful work.
It must be exported and reconciled in TFA-0.

## 2 · User-supplied Claude project status

The screenshot visibly shows:

- KFB ToolBox project;
- `casting-probe`;
- FrizzleBob Graft/Driver;
- actor/source choices including GothGirl and Cube-Pet;
- motion/action buttons;
- working 3D stage.

The pasted Claude summary additionally claims:

- fonts pinned from local to GitHub Raw;
- FrizzleBob donor and audio source resolved through GitHub;
- 132-file export / 4.32 MiB;
- cold start success;
- Stage-First v1 loading without errors;
- promotion manifest/onboarding/sprint docs in a promotion folder;
- Slice A approximately 80%;
- several moving-`main` URLs still to pin;
- Functional Gate B–D still open.

### Classification

`USER-SUPPLIED EXTERNAL PROJECT STATE · PLAUSIBLE / CONSISTENT WITH DONORS · NOT GITHUB SSOT`

Do not discard.
Do not claim committed until actual exported source is compared.

## 3 · Minimal Stage-First UX

Current design direction:

`tools/KFB-ToolBox/_handover/UI_RESET_MINIMAL_STAGE_FIRST_2026-09-15/START_HERE.md`

Hard retained ideas:

- one persistent global bar;
- stage dominant;
- one context palette;
- no developer/provenance dashboard in normal authoring;
- full functions remain available via progressive disclosure;
- split-screen is a first-class mode.

### Classification

`CURRENT DESIGN DIRECTION`

The fractal editor must fit inside this surface, not replace it.

## 4 · Resource Picker / Asset Librarian seam

Current design direction:

`tools/KFB-ToolBox/_handover/UI_RESET_MINIMAL_STAGE_FIRST_2026-09-15/ASSET_LIBRARIAN_INTEGRATION_2026-09-15.md`

Key rule:

**one context-aware Resource Picker**, not embedded full Asset Librarian and not a second registry.

Contexts already anticipated include:

- actors;
- donor parts;
- motions;
- props;
- stage assets;
- performance assets.

### Classification

`DESIGN CONTRACT / REUSE TARGET`

## 5 · ToolBox Home v2

Source exists:

`kfb-hub/stage/toolbox/`

The route audit records:

- ToolBox front-door/router;
- public-preview cards for existing tools;
- source/integration cards for not-yet-public tools.

It is a router, not a unified authoring shell.

### Classification

`CURRENT ROUTER / NOT THE FRACTAL EDITOR`

## 6 · EyeRig Batch

Current preparation/implementation entry:

`tools/KFB-ToolBox/_handover/EYE_RIG_BATCH_2026-09-18/START_HERE.md`

### Main

Current `main` contains the `eye-rig-batch/` directory only in a limited state; the current implementation truth remains in Draft PRs / Stage evidence.

### PR #104

`ToolBox: Batch EyeRig Atlas · Rig_Medium proof`

At preparation:

- Draft/Open;
- head `e277c3456651d314a01adea046e0105d2a12cdd1`;
- not merged.

Current brief history includes Medium + Large authoring/review work.

### PR #162

`feat(toolbox): Rig_Legacy EyeRig batch 17/17`

Stacked on PR #104.

At preparation:

- Draft/Open;
- head `7b1b52a60d64c9dc710514a59d1a7365f8a168e7`;
- 17/17 Legacy profiles;
- 16 measured candidates;
- Skull human-required;
- not merged.

### Owner truth

EyeRig v6 stays the eye runtime.

Profile inheritance remains:

`rigClass → character → session`

Source actors are never destructively edited.

### Classification

`STRONG CURRENT CANDIDATE / DRAFT PR STACK · MUST RECONCILE BEFORE CONSOLIDATION`

## 7 · Brow / face overlay owner

Current source on main:

`tools/KFB-ToolBox/kfb-rigs-embed-v3/petstudio-v9/studio-v12/brow-rig.v2.js`

It already consumes:

`EyeRig.eyeFrame()`

and already owns substantial brow authoring fields including:

- `length`;
- `mask`;
- `thickness`;
- `height`;
- `x / y`;
- `tiltLeft / tiltRight`;
- `bendLeft / bendRight`;
- `follow`;
- `lift`;
- symmetric/even/solid/cap presentation.

The source derives brow geometry from the eye frame and sampled head surface.

### Current user-reported problem

On FrizzleBob, scaling/width adjustment is not visually preserving the desired relationship to the eyes; the brows appear to move inward/outward instead of behaving like independently eye-anchored shapes.

### Required gate

Do not replace `brow-rig.v2.js`.

First prove whether the problem is:

- current UI mapping;
- use of `length` vs `mask`;
- profile values;
- or the pair-wide geometry model itself.

If the pair-wide model is the blocker, extend the existing owner with a measured **per-eye-centred width/spacing mode**.

Target invariant:

> changing brow width must not unintentionally translate the visual centre of each brow away from its corresponding eye.

## 8 · FrizzleBob / Graft

Current source family exists in:

`tools/KFB-ToolBox/kfb-rigs-embed-v3/`

including:

- FrizzleBob Yellow donor;
- Head graft;
- ears;
- EyeRig;
- brows;
- nose;
- moustache;
- mouth;
- pose/animation seams.

Current graft-mount code already mounts optional brow/nose/mouth modules around the same eye-frame/face-host logic.

### Classification

`STRONG FIRST NESTED-AUTHORING FIXTURE`

## 9 · Resident Atlas

Current:

`tools/resident_atlas_s6/`

Return documents:

- 21 Residents;
- Rig_Medium;
- Rig_Large;
- Rig_Legacy;
- Resident recipes;
- actor grafts;
- props;
- measured attachments;
- Studio/gizmo/manual correction flow;
- complex instrument authoring evidence.

Resident Atlas remains the best current donor for:

- resident composition;
- nested actor object semantics;
- attachment measurements;
- pose/prop evidence;
- manual Studio correction.

It is **not** to be replaced by the consolidation shell.

### Classification

`CURRENT SOURCE / PRIMARY ACTOR-COMPOSITION DONOR`

## 10 · Motion Lab

Current ToolBox START records:

- Draft PR #127;
- public Stage;
- 87/87 public browser PASS;
- FrizzleBob Driver Graft / Rig_Medium;
- GothGirl / Rig_Medium;
- Black Knight / Rig_Large.

At preparation PR #127 is still Draft/Open and unmerged.

### Classification

`PUBLIC-PROVEN DONOR · DRAFT SOURCE BRANCH`

Consume its profile/phase-sync seams; do not rebuild motion authoring from scratch.

## 11 · Shared In-scene Editor

Current contract:

`skills/chat/workflows/KFB_INSCENE_EDITOR_MODULE_V1_2026-09-20/START_HERE.md`

It defines:

- selection/highlight;
- transform controls;
- compact inspector;
- anchors/notes;
- undo/redo for patch session;
- `kfb.scene-patch.v1` import/export.

Hosts retain:

- loader;
- scene;
- camera;
- physics/nav;
- source identity;
- save/publish.

### Classification

`DESIGN + ADAPTER CONTRACT · NOT YET A UNIVERSAL IMPLEMENTATION`

This is exactly the scene-edit layer the consolidation should consume.

## 12 · WorldBuilder

Current SSOT:

`tools/KFB-ToolBox/_handover/WORLD_BUILDER_V1_2026-09-22/START_HERE.md`

Required sequence remains:

`WB1-P0 → WB1-P1 → WB1-P2 → WB1-P3 Claude input → Claude Design`

Current ToolBox consolidation is prepared **after P2** so that:

- Environment Profile;
- Surface Adapter;
- owner seams;

are already proven and do not get rediscovered inside the ToolBox project.

### Classification

`SEPARATE RECEIVING WORLD OWNER`

## 13 · World Design / WhackMan project

Use as:

- Environment Profile donor;
- visual lighting/fog proof;
- WorldBuilder design context.

Do not use as:

- EyeRig editor owner;
- Actor editor owner;
- Stage-First ToolBox source owner;
- shared scene-editor owner.

### Classification

`WORLD VISUAL DONOR / NOT TOOLBOX CONSOLIDATION HOME`

## 14 · What already exists vs what is actually missing

### Already exists

- Eye runtime;
- brow runtime;
- head/graft donors;
- pose/motion systems;
- Resident recipes;
- Legacy assembly;
- Resource Registry/Librarian;
- transform/editor contract;
- scene patch contract;
- ToolBox router;
- Stage-First source export.

### Missing coherent product

One **single stage-first authoring shell** that lets Georg move through the nested object hierarchy without leaving the working context.

That is the consolidation task.

## 15 · Current conclusion

Do not start a new all-purpose editor.

After WB1-P2:

1. recover/reconcile the current Claude ToolBox project;
2. promote/reuse the existing Stage-First shell;
3. wire existing owners into a nested selection model;
4. prove FrizzleBob Face/EyeRig/Brow;
5. prove one Legacy actor;
6. prove one actor/scene nested edit;
7. only then bridge the shell into WorldBuilder / Story Zone authoring.
