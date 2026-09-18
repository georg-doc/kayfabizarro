# Batch EyeRig Atlas · 2D Alignment Addendum

Date: 2026-09-18  
Status: ADDITIVE ALIGNMENT · DOES NOT REPLACE THE BATCH BRIEF

## Why this exists

The new 2D Animation Studio has implemented a renderer-neutral semantic EyeRig protocol derived from the same public EyeRig-v6 control surface used by ToolBox.

This addendum prevents the Batch EyeRig Atlas from accidentally evolving a separate 3D-only semantic contract.

## Keep unchanged

The existing Batch EyeRig priority remains:

`Rig_Medium → Rig_Large → Legacy → selected face grafts → Vehicle → Living Plants`

The existing ToolBox profile remains:

`kfb.eye-profile/0.1-candidate`

Do not pause Medium implementation to make 2D support universal.

## Additive rule

Where the Batch workbench emits or consumes behavior-level eye commands, prefer the shared semantics documented in:

`tools/KFB-ToolBox/docs/2D_ANIMATION_STUDIO_BRIDGE.md`

and:

`tools/2D Animation Studio/shared/eye-rig/eye-rig-protocol.v1.json`

Renderer-specific realization stays local.

## Companion binding

If a profile needs a renderer/host realization record, use companion candidate metadata:

`kfb.eye-binding/0.1-candidate`

Do not bump the EyeProfile schema merely to identify Three.js vs SVG.

## Cross-render proof after Medium

Once one Medium actor is visually approved, use that actor and DocCheck Eumel for one small protocol test:

`neutral → blink → look_left → look_right → surprised → thinking → neutral`

This proof is downstream of the first useful Medium slice. It must not block the Medium atlas itself.

## Accessory seam

Keep `eyeFrame()` public and stable. 2D and 3D glasses/brows/lashes may differ in asset representation but should attach through the same semantic frame where possible.


## Protocol proof already prepared

The cross-render **Phase A** proof is implemented at:

`tools/2D Animation Studio/proofs/cross-render-eye-v1/`

It uses the existing FrizzleBob Driver Graft as the 3D Rig_Medium side because that actor already has the real ToolBox EyeRig-v6 owner.

This does **not** satisfy the Batch exit gate for a generic Medium EyeProfile.

Once the Batch Atlas approves its first Medium profile, repeat the same shared semantic sequence there as **Phase B** without changing the protocol vocabulary.
