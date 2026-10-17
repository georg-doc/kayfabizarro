# KFB Theatre Curtain v1

**Owner:** KFB Game Dev Studio  
**Status:** IMPLEMENTATION CANDIDATE · HUMAN LOOK/PHYSICS GATE OPEN  
**Fixed Stage target:** https://kayfabizarro.pages.dev/kfb-hub/stage/game-dev-studio/theatre-curtain-v1/

## Purpose

Reusable foreground transition module for scene loading, race starts, cutscenes and stage reveals.

This is a core KFB game/stage asset. It does not reactivate the Birthday slice and it does not own Travel/Race/Town physics, cameras, progression or save state.

## Donor

Pinned upstream donor:

- three.js commit: `7300402f96c23bfa2174ffc0da01fb4e277d33da`
- example: `examples/webgpu_compute_cloth.html`
- example blob: `0b3c18d87ac0d2428e6a558b6d09889e425dd537`
- three.js version at that commit: `0.186.0`

The donor is shown separately on Stage before the KFB derivation. It contributes Verlet/spring cloth, gravity, damped inertia, wind and fixed attachment logic.

## Current implementation

The KFB curtain is a deterministic CPU Verlet / WebGL fallback using the same cloth-mechanism family, because the upstream example is explicitly WebGPU-first and still carries a WebGL-backend TODO.

Implemented now:

- two independent left/right cloth panels;
- repeated supported top hooks;
- real rail + moving rings explaining attachment;
- structural, shear and bend constraints;
- gravity with a heavier lower hem;
- subtle deterministic idle wind;
- opening/closing by moving the supported top targets toward the outer sides so fabric physically gathers;
- local click/API impulse;
- reset;
- PBR fabric maps from exact KFB repository assets;
- reusable seam: `mount / update / setState / impulse / reset / dispose`.

Default fabric is `velour_velvet`, tinted sand/dark red. The Stage also exposes `rough_linen`, `hessian_230` and `crepe_satin` for direct comparison.

## Deliberately not faked in v1

- burn holes;
- stains;
- torn edges;
- card breach / dissolve;
- theatrical lower-third tie-back or swag presets;
- consumer integration;
- a production WebGPU compute backend.

Those are derivations after the first human fabric + motion gate. Aging decals are intentionally not painted on top of an unapproved cloth.

## Runtime boundary

The curtain mounts as a self-contained transition overlay and can be disposed after reveal. It does not replace the receiving world's renderer or movement/physics owner.

## Next human gate

On the fixed Stage compare:

1. the isolated pinned Three.js cloth donor;
2. the KFB split curtain at idle;
3. open → open-rest → close;
4. center and clicked impacts;
5. the four real fabric map sets.

Judge weight, folds, gathering, hem behaviour, idle motion, red material and whether the rail/rings make the motion physically legible.

Do not integrate into Birthday/Travel/Race before that visual/physics gate.
