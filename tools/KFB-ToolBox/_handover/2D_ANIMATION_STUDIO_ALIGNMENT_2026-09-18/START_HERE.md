# KFB ToolBox · 2D Animation Studio Alignment · Fresh Chat Brief

**Date:** 2026-09-18  
**Status:** CURRENT ALIGNMENT / CONTRACT SLICE · NO TOOLBOX RUNTIME REWRITE  
**Owners:** ToolBox/Rigging + 2D Animation Studio

## Goal

Align ToolBox 3D actor/face/eye semantics with the new 2D Animation Studio so a consumer can reuse the same **semantic EyeRig commands and eye clips** across Three.js and SVG/cutout actors.

Do not merge tool ownership.

## Read first

1. `tools/KFB-ToolBox/START_HERE.md`
2. `tools/KFB-ToolBox/docs/CONTRACTS.md`
3. `tools/KFB-ToolBox/docs/2D_ANIMATION_STUDIO_BRIDGE.md`
4. `tools/KFB-ToolBox/_handover/EYE_RIG_BATCH_2026-09-18/START_HERE.md`
5. `tools/2D Animation Studio/START_HERE.md`
6. `tools/2D Animation Studio/shared/eye-rig/README.md`
7. `skills/kfb-cartoon-animation_v2.md`

## Hard decisions

- **EyeRig v6 remains the current 3D implementation donor.**
- 2D gets a renderer adapter, not a second incompatible control vocabulary.
- `eyeFrame()` is the cross-render accessory seam.
- current ToolBox `kfb.eye-profile/0.1-candidate` stays intact.
- renderer-specific binding is companion metadata, not a forced schema migration.
- 2D source art stays owned by 2D Animation Studio.
- ToolBox Stage-First does not need a redesign for this integration.
- ToolBox Animation Lab is not silently superseded.

## First proof

Eumel 2D + one Rig_Medium ToolBox actor consume:

`neutral → blink → look_left → look_right → surprised → thinking → neutral`

Proof is behavioral/protocol alignment, not pixel matching.

## Output expected from a follow-up implementation chat

- exact source revisions;
- profile + renderer binding refs;
- one shared semantic clip payload;
- screenshots/playback evidence in both renderers;
- no duplicate RAF/mixer/eye owner;
- clean recovery to neutral;
- additive Return/CHANGELOG.

## Do not

- copy SVG geometry into the 3D EyeRig;
- rebuild EyeRig v6 in ToolBox;
- move DocCheck visual SSOT into ToolBox;
- claim whole-body clip interchangeability from eye-protocol success;
- alter Resident/Travel/Combat defaults during this proof.


## Phase A implementation now exists

`tools/2D Animation Studio/proofs/cross-render-eye-v1/`

3D target: FrizzleBob Driver Graft / real Rig_Medium / EyeRig v6.  
2D target: source-exact DocCheck Eumel.

Static sanity is PASS. Browser runtime/visual proof remains pending.

This Phase A result validates the architecture without waiting for a new generic Medium EyeProfile. The first approved generic Medium profile becomes Phase B and must reuse the same sequence/protocol rather than inventing a new one.
