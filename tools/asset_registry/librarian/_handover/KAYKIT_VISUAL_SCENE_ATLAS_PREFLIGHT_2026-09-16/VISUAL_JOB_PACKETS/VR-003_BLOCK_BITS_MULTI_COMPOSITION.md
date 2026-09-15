# VR-003 · Block Bits · Multi-Composition Reconstruction

**Priority:** P0  
**Status:** `READY FOR CLAUDE DESIGN / DIRECT DEMO RECONSTRUCTION`  
**Source family:** `KayKit_BlockBits_1.0_FREE`  
**Consumers:** Stunt Race / Town / Combat / ToolBox candidate discovery

## 1. Goal

Inspect the authored Block Bits sample and extract each **distinct composition motif** as a small visual recipe.

Primary reference:

`Block_Bits_Sample - VOXEL PYRAMID + STAGE + WRESTLING RING FLOOR + BOXEL BLITZ.png`

Secondary reference:

`Block_Bits_Overview.png`

Stable mirror root:

`georg-doc/KFB-Stunt-Car-Race/_inbox/KayKit_PACKS_References_Scenes_Demos/`

## 2. Source facts already established

Source root:

`media/3D_Assets/KayKit_BlockBits_1.0_FREE/`

Prior Registry/Atlas evidence records:

- 44 indexed assets;
- 40 3D models;
- 4 images;
- 40 complete model dependencies in the current Registry snapshot.

Known exact source examples include:

- `Assets/gltf/bricks_A.gltf`
- `Assets/gltf/bricks_B.gltf`
- `Assets/gltf/colored_block_blue.gltf`
- `Assets/gltf/colored_block_green.gltf`
- `Assets/gltf/colored_block_red.gltf`
- `Assets/gltf/block_bits_texture.png`

The source pack also contains its own sample/content imagery.

## 3. Filename evidence boundary

The recovered filename contains:

- `VOXEL PYRAMID`
- `STAGE`
- `WRESTLING RING FLOOR`
- `BOXEL BLITZ`

These are `SOURCE FACT / filename_note` until the image is inspected.

Do not assume:

- there are exactly four panels;
- every label maps one-to-one to a visible object;
- the sample uses only Block Bits;
- any one motif is canonical.

## 4. Visual tasks

### A. Segment the sample

Determine how many distinct authored motifs/compositions are actually visible.

For each motif return:

- normalized image bounds;
- source label if visually/source-context justified;
- major silhouette;
- floor/base structure;
- repeated elements;
- accent elements;
- camera/view class.

### B. Identify exact or family-level source models

Use `../SOURCE_ASSET_MATCH_MATRIX.md`.

For each visible object:

- `exact` if source match is proven;
- `family-only` if only pack/type is known;
- `unresolved` otherwise.

Do not construct likely filenames from shapes.

### C. Extract modular grammar

For each motif record:

- unit repetition;
- stack height pattern;
- corner/edge pattern;
- symmetry/asymmetry;
- color grouping;
- gaps/negative space;
- obvious entry/exit/opening;
- any stage/ring/platform boundary.

### D. Extract relative scale

Use ratios, for example:

- block height / motif total height;
- floor width / central structure width;
- ring/stage width / block unit;
- gap / block width.

If perspective prevents reliable measurement, mark the ratio `INFERENCE` or `UNRESOLVED`.

### E. Camera and presentation

Record:

- perspective / orthographic-like / unknown;
- azimuth/elevation class;
- framing;
- whether the composition is shown as a showcase render versus a plausible gameplay camera.

Do not treat showcase camera as a consumer-camera recommendation automatically.

## 5. KFB use questions

After source reconstruction only, add a separate `PROPOSAL` section for:

### Stunt Race

- obstacle/platform landmark potential;
- readable modular set-piece potential;
- arena/ring visual language;
- no drivability/collision claim.

### Town

- plaza/stage/play-space potential;
- landmark/set-piece potential.

### Combat

- ring/arena boundary potential;
- cover/obstacle potential only as visual suggestion.

### ToolBox

- source candidates worth surfacing for scene authoring;
- no automatic part/compatibility classification.

## 6. Required outputs

1. `VR-003_BLOCK_BITS_RETURN.md`
2. one recipe per actually distinct motif, named only after visual/source confirmation, e.g.:
   - `VR-003_A.visual-scene-recipe.json`
   - `VR-003_B.visual-scene-recipe.json`
3. `VR-003_SOURCE_MATCH_DELTA.md`

Do not pre-create four recipes just because the filename contains four phrases.

## 7. Recipe minimum

Every motif recipe must contain:

- source capture + inspected region;
- exact/family/unresolved assets;
- observed relations;
- relative scale;
- camera;
- material/color observations;
- inference list;
- KFB proposal list;
- unresolved list.

## 8. Validation pass

If Claude Design can reconstruct the scene in a visual sandbox, compare:

1. coarse silhouette;
2. unit count/repetition;
3. width/height ratios;
4. color grouping;
5. camera framing;
6. only then local detail.

Return a screenshot comparison if the environment supports it, but do not call that a KFB runtime test.

## 9. Stop conditions

Stop rather than guess if:

- the image cannot be inspected directly;
- a source model identity is ambiguous;
- exact hidden/occluded geometry is unknowable;
- the task drifts into collision, vehicle physics or ToolBox implementation.

## 10. Acceptance criterion

The job is successful when the sample is converted from “interesting promo image” into a **small set of provenance-backed composition recipes** that a receiving owner can deliberately reuse or reject.