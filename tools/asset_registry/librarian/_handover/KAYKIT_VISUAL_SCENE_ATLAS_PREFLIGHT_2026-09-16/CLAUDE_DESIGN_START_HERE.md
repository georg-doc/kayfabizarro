# KFB Visual Scene Atlas · Claude Design · START HERE

**Date:** 2026-09-16  
**Status:** `EXECUTION BRIEF / VISUAL RECONSTRUCTION ONLY`  
**Source owner:** KFB Asset Librarian / KayKit Reference Atlas preflight  
**Do not implement ToolBox or consumer runtime here.**

## 1. Mission

Convert bounded KayKit/reference captures into **provenance-backed visual annotations and scene recipes** that later KFB consumers can test.

The inventory, ownership and pack/source research already exists. Do not rebuild it.

Your job is to answer:

> What is visibly composed here, which owned source assets exactly or probably correspond to it, how are they arranged, and what remains unresolved?

## 2. Read only these files first

In this folder:

1. `LIVING_STATUS.md`
2. `REFERENCE_CORPUS_INDEX.md`
3. `VISUAL_REVIEW_QUEUE.md`
4. `SOURCE_ASSET_MATCH_MATRIX.md`
5. `SCENE_RECIPE_v0_PROPOSAL.md`

Read `WORLD_NOW_FAST_LANE.md` only when executing the explicit WORLD NOW track.

Then open **only the job packet you are executing** under:

`VISUAL_JOB_PACKETS/`

Do not crawl the whole repository before starting.

## 3. Canonical Atlas foundation

For existing KayKit source/ownership/context, use:

`tools/asset_registry/librarian/_handover/KAYKIT_REFERENCE_ATLAS_2026-09-15/`

That directory already owns:

- pack coverage;
- source/ownership mapping;
- gap/purchase analysis;
- existing demo learnings;
- Resource Picker mapping;
- prior tested evidence.

Do not create a second Atlas owner.

## 4. Two tracks — never conflate them

### Track A · CANONICAL Reference Lab

This is the default visual-review order owned by the governing preflight.

Start with:

1. `VISUAL_JOB_PACKETS/CQ-001_ULTRA_TURBO_HERO_MAN_WEAPON_GRIP_POSE.md`
2. `VISUAL_JOB_PACKETS/CQ-002_GOTH_GIRL_DEMO.md`
3. `VISUAL_JOB_PACKETS/CQ-003_DEMON_LORD_DEMO.md`

Then continue the exact canonical queue in `VISUAL_REVIEW_QUEUE.md`.

Every return must say:

`TRACK: CANONICAL`

### Track B · WORLD NOW Fast Lane

This is a separate production overlay. It does **not** reorder the canonical queue.

Use only when Georg/Lead explicitly asks for current world-production support.

Prepared packets:

- `VR-001_BIRTHDAY_COZY_PARTY.md`
- `VR-002_ORBIT7_SEASIDE_TOWN_ROAD.md`
- `VR-003_BLOCK_BITS_MULTI_COMPOSITION.md`
- `VR-004_CITY_BUILDER_STREETSCAPE.md`
- `VR-005_RESOURCE_BITS_SCENE_USE.md`

Every return must say:

`TRACK: WORLD_NOW`

Do not silently switch between tracks.

## 5. Scene Recipe status

Use:

`kfb.scene-recipe.v0`

with:

`profile: visual-preflight`

This remains a **PROPOSAL**. The first 3–5 visual jobs are expected to prove, modify or simplify it.

Maturity:

- L0 reference indexed
- L1 visual annotation
- L2 asset-matched
- L3 static reconstruction
- L4 reusable scene recipe
- L5 consumer-tested

Only the receiving consumer may promote to L5.

## 6. Evidence discipline — hard

Every claim must be clearly one of:

- `SOURCE FACT`
- `OBSERVED DEMO`
- `INFERENCE`
- `PROPOSAL`
- `TESTED RESULT`
- `UNRESOLVED`

### Good

`OBSERVED DEMO: the blaster is visibly held in the right hand in frame/time X.`

`INFERENCE: the contact point appears near the rear grip, but the exact local attachment transform is not recoverable from this view.`

### Bad

`The blaster is compatible with this rig.`

A source demo does not prove KFB runtime compatibility.

## 7. What you may infer visually

You may estimate and label as `INFERENCE`:

- relative position;
- normalized scale ratios;
- camera class;
- symmetry/repetition;
- visual depth order;
- grouping/cluster logic.

Use confidence levels. Prefer normalized relationships to fake world-space precision.

## 8. What you must not infer

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

## 9. Source matching

Use `SOURCE_ASSET_MATCH_MATRIX.md` first.

Return one of:

- `exact`
- `family-only`
- `unresolved`

If an exact asset is not already known and cannot be proven, do not guess its path.

Archive-only families may remain family-level.

## 10. Existing owners you must preserve

- Asset files + generated Registry → source/file truth
- Asset Librarian → read-only discovery/preview/candidate handoff
- ToolBox / Animation Lab → final rig/part/motion/attachment compatibility
- Travel/TinySkies → current terrain/sky/light/water/audio world owner
- Town / Travel / Combat / Stunt → their own runtime suitability/composition
- Birthday Graft path → existing Uncle FrizzleBob owner

Do not silently replace any of them.

## 11. Canonical Job 1 non-negotiable

For CQ-001, inspect the GIF itself. The filename already supplies `BLASTER · GRIP · POSE`; your task is to establish what those words correspond to **visually**.

Preserve the literal naming discrepancy:

- reference: `UltraHeroTurboMan`
- source tree: `UltraTurboHeroMan`

Do not normalize it silently.

## 12. Goth Girl non-negotiable

Do not spend CQ-002 re-proving the existing narrow binding evidence.

Analyze what remains visually unresolved:

- actual action sequence;
- microphone/mic-stand/speaker/stool use if visible;
- contact/seating;
- scale;
- camera/staging;
- look/material/light.

## 13. Demon Lord non-negotiable

DemonHeart and SummoningCircle are source siblings, not automatically demonstrated props. Confirm their visual presence before creating `OBSERVED_DEMO` relations.

## 14. WORLD NOW non-negotiables

If Track B is explicitly activated:

### Birthday

Do not recast/rebuild the already-tested P0 hero behavior. Reconstruct scene staging only.

### Orbit 7 / seaside

Do not replace Travel/TinySkies terrain, water, sky, lighting or coastal-world logic with KayKit tiles. KayKit supplies built-environment/dressing/reference grammar.

## 15. Required return format for every job

### A. Markdown

`<JOB_ID>_RETURN.md`

with:

- `TRACK`;
- source captures actually inspected;
- inspection state;
- `SOURCE FACT`;
- `OBSERVED DEMO`;
- `INFERENCE`;
- exact/family/unresolved source matches;
- composition;
- camera;
- lighting/material/glow/FX;
- KFB `PROPOSAL`;
- referenced `TESTED RESULT` only where relevant;
- `UNRESOLVED`;
- confidence.

### B. Recipe JSON

`<JOB_ID>.scene-recipe-v0.json`

using `kfb.scene-recipe.v0`, `profile: visual-preflight`.

### C. Source-match delta

`<JOB_ID>_SOURCE_MATCH_DELTA.md`

Only add mappings strengthened by the actual visual job.

## 16. Reconstruction loop

Where the environment supports visual reconstruction/rendering:

1. inspect the source directly;
2. segment composition/action;
3. load only supplied candidates;
4. reproduce coarse silhouette/placement;
5. compare spacing/scale;
6. tune camera;
7. add material/light/FX last;
8. capture comparison evidence;
9. list residual mismatches.

A successful visual reconstruction is still not L5 consumer acceptance.

## 17. Paid/reference handling

Use reference media for inspection. Do not republish paid/Patreon reference masters into public repo outputs.

Return metadata, observations, mappings and permitted evidence only.

## 18. Stop conditions

Stop and return a blocker rather than improvising when:

- pixels/frames cannot be inspected;
- source identity is ambiguous;
- source access requires a new owner action;
- a required existing contract cannot be found;
- the job drifts into runtime implementation;
- you would need to invent compatibility.

## 19. First response expected from Claude Design

Default Track A:

1. open `CQ-001_ULTRA_TURBO_HERO_MAN_WEAPON_GRIP_POSE.md`;
2. state whether the GIF frames can actually be inspected;
3. if yes, perform the frame-level extraction;
4. return the three required artifacts;
5. stop for review before CQ-002 unless Georg explicitly requests a batch.

If Georg explicitly activates WORLD NOW, open the requested WN packet instead and state `TRACK: WORLD_NOW` in the return.