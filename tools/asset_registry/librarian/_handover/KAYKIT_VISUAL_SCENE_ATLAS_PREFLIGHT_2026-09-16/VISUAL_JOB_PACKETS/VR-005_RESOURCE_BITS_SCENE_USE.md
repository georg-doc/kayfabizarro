# VR-005 · Resource Bits · Scene-Use Reconstruction

**Priority:** P0  
**Status:** `READY FOR CLAUDE DESIGN / VISUAL REVIEW WITH SOURCE GAP`  
**Source family:** KayKit Resource Bits  
**Consumers:** Town / Travel / Stunt Race / ToolBox candidate discovery

## 1. Goal

Extract the **resource/environment cluster grammar** demonstrated by the saved Resource Bits references, while keeping the known archive/indexing gap explicit.

Primary references:

- `Resource_Bits_Overview.png`
- `Resource_Bits_Sample_Extra.png`

Stable mirror root:

`georg-doc/KFB-Stunt-Car-Race/_inbox/KayKit_PACKS_References_Scenes_Demos/`

## 2. Existing source state

### SOURCE FACT

Owned archive exists:

`media/3D_Assets/KayKit_ResourceBits_1.0_FREE.zip`

The current generated Registry does not expose a matching clean structural pack.

Current classification:

`OWNED / NOT STRUCTURALLY INDEXED`

### OBSERVED DEMO from prior Atlas

The Sep-15 Atlas visually confirmed the Resource Bits overview as:

`45 resource assets (x5 colors)`

That is useful pack-level visual evidence. Exact object names, placement and source paths remain reconstruction work.

## 3. Hard boundary

This job must **not**:

- unzip the archive;
- regenerate Registry output;
- create fake per-model asset IDs;
- infer exact filenames from appearance;
- send archive-internal guesses to ToolBox as selectable assets.

If the visual review establishes strong production value, return a separate Registry-owner proposal after the visual work.

## 4. Visual extraction tasks

### A. Overview vocabulary

From `Resource_Bits_Overview.png`, identify only visibly distinguishable resource families.

For each family record:

- visible shape/category description;
- number of obvious variants if countable;
- color/material variation;
- whether the overview implies one geometry with multiple color states or multiple geometries;
- confidence.

Do not assign semantic names not supported by the visual/source text.

### B. Sample scene composition

From `Resource_Bits_Sample_Extra.png`, extract:

- cluster count;
- cluster size;
- spacing;
- ground/context relationship;
- foreground/midground/background roles;
- any path/structure/worksite relation;
- color grouping;
- any character/prop/vehicle scale cue if actually visible.

### C. Determine authored association strength

For every visible combination classify:

- `strong` — repeated/clearly composed relation;
- `medium` — likely authored but could be showcase convenience;
- `weak` — nearby in frame only.

This is composition confidence, not runtime compatibility.

### D. Candidate world roles

Only after visual review, propose roles such as:

- `resource_landmark`
- `small_resource_cluster`
- `worksite_dressing`
- `roadside_dressing`
- `background_resource_mass`
- `interactive_candidate`

`interactive_candidate` means only “worth consumer investigation,” not that interaction behavior exists.

## 5. KFB consumer questions

### Town

- Can a small cluster make a district/worksite/resource corner readable?
- What spacing keeps props legible rather than noisy?

### Travel

- Which clusters read as landmarks from motion/distance?
- Can they break up roadside/nature repetition?

### Stunt Race

- Which silhouettes could dress track edges or landmarks?
- No collision/obstacle claim until consumer testing.

### ToolBox

- Which resource families would be worth surfacing once the source/Registry owner exposes exact assets?

## 6. Required outputs

1. `VR-005_RESOURCE_BITS_RETURN.md`
2. `RESOURCE_BITS_CLUSTER_v0.visual-scene-recipe.json`
3. optional second recipe only if the sample visibly contains a distinct second grammar
4. `VR-005_SOURCE_MATCH_DELTA.md`
5. if justified: `VR-005_REGISTRY_OWNER_REQUEST.md`

## 7. Registry-owner request gate

Only create `VR-005_REGISTRY_OWNER_REQUEST.md` if all are true:

1. visual review identifies at least one concrete high-value KFB use;
2. source archive presence is confirmed;
3. exact object-level mapping is genuinely blocked by archive/indexing state;
4. existing clean owned packs do not already cover the same need adequately.

Request should say **why** extraction/indexing matters. It must not perform the work itself.

## 8. Scene recipe evidence requirements

The recipe must distinguish:

- source pack/archive fact;
- overview visual facts;
- sample composition observations;
- inferred spacing rules;
- KFB proposals;
- unresolved exact model identities.

Do not put guessed source paths in `assets[]`.

## 9. Stop conditions

Stop if:

- the sample image cannot actually be inspected;
- object identity is too ambiguous to describe reliably;
- exact source mapping requires opening/restructuring the archive outside the visual job;
- the task drifts into mining/harvesting gameplay design.

## 10. Acceptance criterion

The job succeeds when the archive-level pack is converted into **useful scene grammar + a justified source-exposure decision**, without pretending that archive contents are already indexed runtime resources.