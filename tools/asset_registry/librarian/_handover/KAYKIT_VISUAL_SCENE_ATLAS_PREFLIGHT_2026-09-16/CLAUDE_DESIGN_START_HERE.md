# KFB Visual Scene Atlas · Claude Design · START HERE

**Date:** 2026-09-16  
**Status:** `EXECUTION BRIEF / VISUAL RECONSTRUCTION ONLY`  
**Source owner:** KFB Asset Librarian / KayKit Reference Atlas preflight  
**Do not implement ToolBox or consumer runtime here.**

## 1. Mission

Convert a small set of high-value visual references into **provenance-backed scene recipes** that later KFB consumers can test.

You are not being asked to inventory KayKit from scratch. That work already exists.

You are being asked to answer:

> What is visibly composed here, which owned source assets likely/exactly correspond to it, how are they arranged, and what remains unresolved?

## 2. Read only these files first

In this folder:

1. `REFERENCE_CORPUS_INDEX.md`
2. `VISUAL_REVIEW_QUEUE.md`
3. `WORLD_NOW_FAST_LANE.md`
4. `SOURCE_ASSET_MATCH_MATRIX.md`
5. `SCENE_RECIPE_v0_PROPOSAL.md`

Then open **only the job packet you are executing** under:

`VISUAL_JOB_PACKETS/`

Do not crawl the whole repository before starting.

## 3. Canonical Atlas foundation

If a job needs existing KayKit source/ownership/context, use:

`tools/asset_registry/librarian/_handover/KAYKIT_REFERENCE_ATLAS_2026-09-15/`

That directory already owns:

- pack coverage;
- source/ownership mapping;
- gap/purchase analysis;
- existing demo learnings;
- Resource Picker mapping;
- prior tested evidence.

Do not create a second Atlas owner.

## 4. First execution sequence

Run these **in order** unless Georg explicitly reprioritizes:

### Job 1

`VISUAL_JOB_PACKETS/VR-001_BIRTHDAY_COZY_PARTY.md`

Goal: smallest convincing Birthday/cozy-party scene recipe around the existing tested hero setup.

### Job 2

`VISUAL_JOB_PACKETS/VR-002_ORBIT7_SEASIDE_TOWN_ROAD.md`

Goal: three compact composition recipes — town edge, road/streetscape, seaside edge — while preserving Travel/TinySkies ownership of terrain/water/sky/light.

### Job 3

`VISUAL_JOB_PACKETS/VR-003_BLOCK_BITS_MULTI_COMPOSITION.md`

Goal: reconstruct the actual distinct motifs in the authored Block Bits sample.

### Jobs 4–5 after the first three returns are stable

- `VR-004_CITY_BUILDER_STREETSCAPE.md`
- `VR-005_RESOURCE_BITS_SCENE_USE.md`

Do not open the P1/P2 character sweep before the first three jobs have produced useful recipe returns unless specifically asked.

## 5. Evidence discipline — hard

Every claim must be clearly one of:

- `SOURCE FACT`
- `OBSERVED DEMO`
- `INFERENCE`
- `PROPOSAL`
- `TESTED RESULT`
- `UNRESOLVED`

### Critical examples

Good:

`OBSERVED DEMO: the blaster is visibly held in the right hand in this frame.`

Good:

`INFERENCE: the prop pivot appears near the grip center, but exact local transform is not recoverable from this view.`

Bad:

`The blaster is compatible with this rig.`

A source demo does not prove KFB runtime compatibility.

## 6. What you may infer visually

You may estimate and label as `INFERENCE`:

- relative position;
- normalized scale ratios;
- camera class;
- likely symmetry/repetition;
- visual depth order;
- likely grouping/cluster logic.

Use confidence levels.

Prefer normalized relationships to false world-space precision.

## 7. What you must not infer

Do not invent:

- exact source paths from appearance;
- hidden geometry;
- collision shapes;
- physics behavior;
- animation retarget compatibility;
- attachment anchors;
- drivable road width;
- engine-specific materials;
- ownership/license state beyond supplied source evidence.

Return `UNRESOLVED` instead.

## 8. Source matching

Use `SOURCE_ASSET_MATCH_MATRIX.md` first.

Return one of:

- `exact`
- `family-only`
- `unresolved`

If an exact asset is not already known and cannot be proven, do not guess its path.

For archive-only families such as Resource Bits / City Builder / Medieval Hexagon, family-level mapping is acceptable.

## 9. Existing owners you must preserve

- Asset files + generated Registry → source/file truth
- Asset Librarian → read-only discovery/preview/candidate handoff
- ToolBox / Animation Lab → final rig/part/motion/attachment compatibility
- Travel/TinySkies → current terrain/sky/light/water/audio world owner
- Town / Travel / Combat / Stunt → their own runtime suitability/composition
- Birthday Graft path → existing Uncle FrizzleBob owner

Do not silently replace any of them.

## 10. Birthday-specific non-negotiable

Do not recast/rebuild the already-tested P0 hero behavior.

Existing Birthday evidence already covers the narrow hero actor/motion state. Your job is **visual scene reconstruction and candidate staging**.

Do not let optional microphone/stool/stage ideas block the stable P0 scene.

## 11. Orbit 7-specific non-negotiable

Do not replace Travel/TinySkies terrain, water, sky, lighting or coastal-world logic with KayKit tiles.

KayKit is a source of:

- built environment;
- modular scene grammar;
- props;
- signs;
- nature dressing;
- reference compositions.

The KFB world substrate remains owned elsewhere.

## 12. Required return format for every job

At minimum return:

### A. Markdown analysis

`<JOB_ID>_RETURN.md`

with:

- source captures inspected;
- `SOURCE FACT`;
- `OBSERVED DEMO`;
- `INFERENCE`;
- exact/family/unresolved source matches;
- composition grammar;
- camera;
- lighting/material/glow/FX;
- KFB `PROPOSAL`;
- `UNRESOLVED`;
- confidence.

### B. Recipe JSON

One or more:

`*.visual-scene-recipe.json`

following `SCENE_RECIPE_v0_PROPOSAL.md`.

### C. Source-match delta

`<JOB_ID>_SOURCE_MATCH_DELTA.md`

Only add mappings that the visual job actually strengthens.

## 13. Visual comparison loop

Where your environment supports reconstruction/rendering:

1. inspect the reference directly;
2. segment composition;
3. build a coarse reconstruction from supplied candidates;
4. compare silhouette and spacing;
5. tune relative scale;
6. tune camera;
7. add material/light/FX last;
8. capture a comparison image;
9. list residual mismatches.

A successful visual reconstruction is still not a consumer runtime acceptance test.

## 14. Paid/reference media handling

Use reference media for inspection. Do not republish paid/Patreon reference masters into public repo outputs.

Return metadata, observations, mappings and small permitted evidence only.

## 15. Stop conditions

Stop the current job and return a blocker instead of improvising when:

- pixels/frames cannot be inspected;
- source identity is ambiguous;
- source access requires a new owner action;
- the job drifts into runtime implementation;
- you would need to invent compatibility;
- a required existing contract cannot be found.

## 16. First response expected from Claude Design

Do not begin with a new planning essay.

For `VR-001`:

1. state which exact visual files you could inspect;
2. identify any access blocker immediately;
3. perform the visual extraction;
4. return the three required artifacts;
5. keep unresolved items explicit.

Then stop for review before opening Job 2, unless Georg explicitly asks for a batch run.