# Batch EyeRig Atlas · Source Audit · Checkpoint 1

Date: 2026-09-19  
Status: IMPLEMENTATION · RIG_MEDIUM FIRST  
Owner: KFB ToolBox / Rigging  
Branch: `toolbox/eye-rig-batch-2026-09-18`  
Base: `5650b6c54d8789b20ea80abe857688173d506d3b`

## GOAL

Prove one real KayKit `Rig_Medium` actor end-to-end in the browser:

`source actor → non-destructive source-eye cleanup → measured FaceHost → existing EyeRig v6 → expressions / gaze / blink → motion regression → reviewable EyeProfile`.

The first actor is **GothGirl** because the repository already contains exact source-face evidence for her eye components. This isolates EyeRig mounting from a still-unproven general eye-pair detector.

## EXISTING OWNER

- ToolBox / Rigging owns this authoring surface.
- Eye implementation remains **EyeRig v6**.
- Arbitrary-biped measurement remains **FaceHost v1**.
- Actor animation remains **THREE.AnimationMixer on the actor skeleton**.
- Resident Atlas remains a downstream consumer, not an implementation owner.

## EXACT SOURCES / REVISIONS

### Implementation brief
- path: `tools/KFB-ToolBox/_handover/EYE_RIG_BATCH_2026-09-18/START_HERE.md`
- blob: `80b1814ea11a38412b4bdb215be9965852d680d4`

### EyeRig v6
- path: `tools/KFB-ToolBox/kfb-rigs-embed-v3/petstudio-v9/studio-v12/pet-eye-rig.v6.js`
- blob recorded by current brief/source audit: `853bcf5fb090dd6564fda8bc83d0b4cb527e6b26`
- repository revision used by this slice: `5650b6c54d8789b20ea80abe857688173d506d3b`

### FaceHost v1
- path: `tools/KFB-ToolBox/kfb-rigs-embed-v3/frizzlegraft-v1/facehost.v1.js`
- blob: `38ec7770f5fccf3aca93ee234f94b801d527d415`
- repository revision used by this slice: `5650b6c54d8789b20ea80abe857688173d506d3b`

### Stable expression source
- path: `tools/KFB-ToolBox/kfb-rigs-embed-v3/contracts/kfb-pet-graft-driver.v4.json`
- blob: `f202a1c2f1670ab6045176af6621c94041124e76`
- IDs: `neutral happy angry sad surprised thinking`

### Source-face cleanup donor
- path: `media/3D_Assets/build/pet-library.v6.js`
- blob: `45d0679127740adaa83f57027e2de41e0e778c4b`
- reused functions: `faceShells()`, `buildStripped()`
- rule: reuse index filtering; do not duplicate a second connected-component implementation.

### First actor
- actor: `gothgirl`
- source: `media/3D_Assets/KayKit_Mystery_Series6/GothGirl/characters/GothGirl.glb`
- revision loaded by this slice: `5650b6c54d8789b20ea80abe857688173d506d3b`
- measured repository evidence: 6 skinned meshes, 23 joints, height 2.211, `Rig_Medium`
- exact cleanup precedent from current EyeRig brief:
  - head has 12 connected islands
  - original eye islands are **6 + 7**
  - brows 4 + 5 are preserved
  - nose 3 is preserved
  - runtime cleanup must fail closed unless the 12-component guard still matches.

### Motion regression
- General:
  `media/3D_Assets/KayKit_Mystery_Series6/GothGirl/Animations/gltf/Rig_Medium/Rig_Medium_General.glb`
- MovementBasic:
  `media/3D_Assets/KayKit_Mystery_Series6/GothGirl/Animations/gltf/Rig_Medium/Rig_Medium_MovementBasic.glb`
- revision loaded by this slice: `5650b6c54d8789b20ea80abe857688173d506d3b`
- previous measured binding evidence:
  - `Idle_A`: 69/69
  - `Walking_A`: supported
  - `Running_A`: 68/68
  - jump clips: supported

## DROPBOX CROSSCHECK

The connected Dropbox search returned historical PetStudio / Vehicle+Rigging / Stunt-Race exports and handovers. None overrides the current GitHub sources above. Dropbox is therefore used only as historical/reference context for this slice.

## PROTECTED BOUNDARIES

- no permanent GLB/GLTF modification;
- no second EyeRig implementation;
- no FaceHost rewrite;
- no Resident Atlas recipe rewrite;
- no replacement animation/movement owner;
- no global contract/schema promotion;
- no lashes, brows, nose or mouth in v0;
- no Medium numeric profile silently promoted to Large or Legacy;
- source-eye removal is reversible runtime geometry filtering only.

## DONE WHEN · FIRST BOUNDED SLICE

1. GothGirl loads from the exact revision.
2. source-face report confirms the guarded 12 components before hiding islands 6 + 7.
3. FaceHost reports `OK`.
4. EyeRig v6 boots neutral/open and receives `update(dt)` every rendered frame.
5. all six existing expressions, blink, gaze, life and kinetics are reviewable.
6. source-only / EyeRig and source-eye cleanup comparisons are available.
7. T-pose + Idle + Walk + Run + Jump can be exercised without a second mixer.
8. profile export/import + review state work without modifying canonical assets.
9. browser proof is produced before any Large/Legacy work starts.
