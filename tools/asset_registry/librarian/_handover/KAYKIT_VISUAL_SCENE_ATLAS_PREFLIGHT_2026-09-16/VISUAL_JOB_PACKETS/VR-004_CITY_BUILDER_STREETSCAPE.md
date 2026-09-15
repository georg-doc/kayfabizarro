# VR-004 · City Builder · Streetscape Grammar

**Priority:** P0  
**Status:** `READY FOR CLAUDE DESIGN / DIRECT REFERENCE REVIEW`  
**Source family:** KayKit City Builder Bits v1.0  
**Consumers:** Town / Travel / Stunt Race

## 1. Goal

Extract the visible **building / road / block / street-prop composition grammar** from the City Builder reference so later KFB world owners can use it deliberately rather than browsing the pack blind.

Primary reference:

`Overview_Extra.png`

Stable mirror root:

`georg-doc/KFB-Stunt-Car-Race/_inbox/KayKit_PACKS_References_Scenes_Demos/`

## 2. Existing evidence

### OBSERVED DEMO from prior Atlas

The 2026-09-15 Atlas already identified `Overview_Extra.png` as:

`KayKit City Builder Bits Version 1.0`

Do not spend this job rediscovering the pack identity. Spend it extracting spatial grammar.

### SOURCE FACT

Owned source archive is present:

`media/3D_Assets/KayKit_City_Builder_Bits_1.0_FREE.zip`

The current generated Registry does not expose this as a clean structural pack comparable to Block Bits/RPG Tools.

Classification for object-level matching:

`OWNED / ARCHIVE-LEVEL SOURCE / OBJECT MATCH PENDING`

## 3. Visual extraction tasks

### A. Layout taxonomy

Identify only what is actually visible, such as:

- building anchor(s);
- road/path section(s);
- sidewalk/curb/edge if present;
- corner/intersection if present;
- sign/street furniture;
- trees/nature if mixed into the reference;
- repeated facade/block elements.

Do not infer missing categories merely because a “city builder” pack might contain them.

### B. Streetscape ratios

Measure normalized relations where possible:

- road width / building width;
- building setback / road width;
- building gap / building width;
- block length / building width;
- prop spacing / road width;
- sidewalk/edge width / road width.

Mark each as `OBSERVED_DEMO`, `INFERENCE`, or `UNRESOLVED`.

### C. Repetition grammar

Record:

- what repeats;
- what acts as a unique landmark;
- how corners/ends are handled;
- where negative space is deliberately kept;
- whether street furniture is regular or clustered;
- whether scene readability depends on color/material grouping.

### D. Camera

Classify the reference camera:

- showcase/isometric-like;
- high-angle perspective;
- eye-level-ish;
- orthographic-like;
- unknown.

Separate source showcase camera from any later KFB camera proposal.

## 4. Source-match task

Because object-level source exposure is incomplete:

1. identify visible asset **descriptions** first;
2. search exact archive/source names only where the source can actually be inspected;
3. return `family-only` rather than guessed paths if uncertain;
4. do not unzip/re-index as part of this visual job.

If exact reconstruction value is high enough to justify source exposure, return a separate:

`REGISTRY_OWNER_REQUEST: City Builder extraction/indexing useful because ...`

That request is a proposal, not an implementation action.

## 5. KFB application pass

After source analysis, return separate proposals for:

### Town

- street block template;
- town-edge transition;
- plaza/landmark placement;
- building/prop density.

### Travel

- roadside town pass-through;
- built/natural boundary;
- visual landmark placement from moving camera.

### Stunt Race

- urban/street dressing potential;
- readable roadside massing;
- no collision/drivability claim.

## 6. Required outputs

1. `VR-004_CITY_BUILDER_RETURN.md`
2. `CITY_BUILDER_STREET_BLOCK_v0.visual-scene-recipe.json`
3. optional `CITY_BUILDER_CORNER_INTERSECTION_v0.visual-scene-recipe.json` only if actually visible
4. `VR-004_SOURCE_MATCH_DELTA.md`

## 7. Required evidence table

| Visible role | Observed? | Relative placement | Exact source | Confidence | KFB proposal |
|---|---|---|---|---|---|
| road | ... | ... | exact/family/unresolved | ... | ... |
| building anchor | ... | ... | ... | ... | ... |
| edge/sidewalk | ... | ... | ... | ... | ... |
| sign/prop | ... | ... | ... | ... | ... |
| nature | ... | ... | ... | ... | ... |

Only include rows for roles actually present in the capture.

## 8. Stop conditions

Stop and return `UNRESOLVED` if:

- exact object identity requires guessing inside the ZIP;
- the source reference is only a contents sheet and does not show spatial relations;
- the task drifts into a universal town generator;
- KFB road/vehicle physics would need to be decided.

## 9. Acceptance criterion

A consumer should receive a **small streetscape recipe and spacing grammar**, plus a precise account of which source paths are known and which remain archive-level only.