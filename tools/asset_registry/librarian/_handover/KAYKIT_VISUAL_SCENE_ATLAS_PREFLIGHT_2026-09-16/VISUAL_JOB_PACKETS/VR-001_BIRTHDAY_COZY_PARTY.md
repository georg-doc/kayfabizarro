# VR-001 · Birthday / Cozy Party Scene

**Priority:** P0  
**Status:** `READY FOR CLAUDE DESIGN / VISUAL RECONSTRUCTION`  
**Owner:** Visual Scene Atlas preflight only. Birthday consumer, Travel/Astra, Graft and Animation Lab ownership remain unchanged.

## 1. Goal

Reconstruct the **smallest convincing Birthday/cozy-party staging** around the already-decided/tested hero setup. Produce visual evidence and a candidate Scene Recipe, not runtime code.

The useful question is:

> What small set of existing source candidates and relative placement rules reproduces the target visual intent well enough for the receiving scene owner to test?

## 2. Read first

1. `../WORLD_NOW_FAST_LANE.md`
2. `../SOURCE_ASSET_MATCH_MATRIX.md`
3. `../SCENE_RECIPE_v0_PROPOSAL.md`
4. `../../KAYKIT_REFERENCE_ATLAS_2026-09-15/BIRTHDAY_STARTER_BUNDLE_REVIEW_2026-09-15.md`

Do not reopen the hero-state decisions already documented there.

## 3. Primary visual targets

### Canonical flattened target

`tools/KFB-ToolBox/_inbox/KFB Elisa B-Day Reference+Mockups/mockup elisa b-day 01.png`

### Secondary generated variant

`tools/KFB-ToolBox/_inbox/KFB Elisa B-Day Reference+Mockups/mockup elisa b-day 01 - Gemini_Generated_Image_ccu5l5ccu5l5ccu5.jpeg`

### Color/look reference

`tools/KFB-ToolBox/_inbox/KFB Elisa B-Day Reference+Mockups/color sheet elisa b-day 01 Gemini_Generated_Image_uhyp7ouhyp7ouhyp.jpeg`

### Additional reference captures

The same folder contains several `Bildschirmfoto 2026-09-15 ...` captures. Use them only where they clarify geometry/staging; record the exact filename for every claim derived from them.

### Curtain/stage reference

`tools/KFB-ToolBox/_inbox/KFB Elisa B-Day Reference+Mockups/CURATIN-THREE-js - old-stage-red-curtains-wooden-architecture-dilapidated-velvet-set-aged-ornate-stone-architectural-frame-387640660.webp`

Treat this as a visual/reference source only. Do not infer an owned 3D asset from it.

## 4. Existing decisions / tested state — do not replace

From the existing Birthday consumer review:

- Uncle FrizzleBob uses the existing Graft owner/config path.
- Little Miss Messy uses GothGirl.
- `Idle_A`, `Waving`, `Cheering` hero-state behavior already has narrow tested evidence.
- Hihi Love-Hope remains the inactive existing Cube-Pet slot.
- Dance / richer performance remains P1/unresolved.

Your work starts at **scene staging**, not recasting or motion-system redesign.

## 5. Known source candidates

### Strong exact candidates

- `media/3D_Assets/Platformer Game Kit - Dec 2021/Nature/glTF/Cloud_1.gltf`
- GothGirl same-collection microphone
- GothGirl mic stand
- GothGirl speaker
- GothGirl stool

Exact GothGirl paths are in `SOURCE_ASSET_MATCH_MATRIX.md`.

### Existing discovery-pool candidates

The existing Birthday handoff contains candidate balloons, presents, circus podium/hoop, selected Farmer props, Driver car and alternate actors.

Do **not** use all of them. The task is curation.

### Existing nearest-family environment candidates

The prior Atlas review recorded market/environment candidates such as stalls, barrel/crate stacks, cart, hay, side signs, shovel/trowel and seasonal variants.

These need exact path confirmation before final source matching.

## 6. Visual extraction tasks

### A. Composition zones

Mark the target image into normalized regions:

- `hero_zone`
- `party_focal_zone`
- `foreground_dressing`
- `background_depth`
- optional `performance_zone`

For each region record:

- normalized screen bounds;
- important silhouettes;
- negative space;
- overlap rules;
- depth order.

### B. Object inventory

List every visually important object/family in the target as:

- `OBSERVED_DEMO`/`OBSERVED_TARGET`
- functional role
- source match `exact / family-only / unresolved`
- required vs optional

Do not list tiny incidental details unless they affect the composition.

### C. Relative placement

Record relations such as:

- left/right/behind/in front;
- placed on / adjacent to;
- repeated cluster;
- height/width ratio to hero figures;
- clear floor area around characters.

Prefer normalized ratios. Do not invent world-meter coordinates from the image.

### D. Camera

Estimate only what is visually supportable:

- projection class;
- view height/class;
- framing;
- focal target;
- target occupancy in frame.

If an exact camera cannot be reconstructed, say `UNRESOLVED`.

### E. Lighting/look

Extract:

- key/fill direction if readable;
- contrast;
- warm/cool bias;
- glow/emissive elements actually visible;
- color roles from the color sheet versus geometry roles from the mockup.

Keep `source material fact`, `observed look`, and `proposed KFB treatment` separate.

## 7. Required outputs

Return these files/artifacts:

1. `VR-001_BIRTHDAY_COZY_PARTY_RETURN.md`
2. `VR-001_BIRTHDAY_COZY_PARTY_RECIPE.json` using `kfb.visual-scene-recipe.v0-proposal`
3. `VR-001_BIRTHDAY_SOURCE_MATCH_DELTA.md`

### Return.md must include

- `SOURCE FACT`
- `OBSERVED TARGET`
- `INFERENCE`
- `PROPOSAL`
- `UNRESOLVED`
- smallest viable asset set
- optional P1 performance set
- camera/look summary
- confidence per key source match

## 8. P0 versus P1

### P0

Only what is needed to make the stable hero Birthday slice visually convincing.

Aim for:

- 2 active hero figures;
- compact scene anchor;
- deliberately small party dressing set;
- enough depth framing to read as an authored scene.

### P1

May include:

- GothGirl microphone;
- mic stand;
- speaker;
- stool;
- richer stage/curtain treatment;
- additional actor/decor candidates.

Do not let P1 block P0.

## 9. Stop conditions

Stop and return `UNRESOLVED` if:

- a screenshot cannot actually be inspected;
- an exact source asset cannot be identified from evidence;
- a prop relation would require attachment measurement;
- you are tempted to modify Graft, Animation Lab, ToolBox or runtime code;
- the reconstruction starts expanding into a general interior system.

## 10. Acceptance criterion

The packet succeeds when a receiving scene owner can answer, without reopening the whole asset library:

- what visual arrangement to reproduce;
- what small source candidate set to start from;
- what camera/look to compare against;
- what remains a visual inference;
- what still requires runtime validation.