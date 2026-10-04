# DocCheck Eye / Face Modifier Atlas · v0.1

Status: **PREPARED · source inventory incomplete**.

This is the next lane after the cross-render semantic EyeRig proof.

## Goal

Turn the richer DocCheck eye/face source collection into exact reusable modules that attach through stable host seams instead of one-off Eumel coordinates.

Primary eye-relative seam:

`eyeFrame() → left / right / radius / parent / rig / gen / unit`

## Current source-resolved pieces

From the existing AD Illustrator intake we can already name:

- two eye-base groups;
- two pupils;
- hat/headwear pair;
- forehead mirror pair.

Only pupils are immediately natural `eyeFrame()` children. Hat/mirror remain head-attached. Eye whites stay source-local until a reusable eye-base abstraction is proven.

## Existing KFB donors

ToolBox contributes control/attachment semantics:

- EyeRig v6;
- BrowRig v2;
- existing 3D sunglasses donors.

These are **logic/3D donors**, not replacements for DocCheck 2D artwork.

## Still unresolved

Georg reports a richer DocCheck source set with curved rings/lid-like modifiers and eyewear including sunglasses and protective/welder goggles.

Those are intentionally marked `AWAITING_NATIVE_SOURCE_INVENTORY`; no geometry or filenames are invented.

## Next source pass

1. locate the authoritative Illustrator source(s);
2. inventory artboards/layers/groups;
3. classify modifier category + left/right/pair behavior;
4. preserve source paths/transforms;
5. assign `eyeFrame | head | sourceLocal` attachment;
6. build isolated atlas cards;
7. test occlusion/order and shared clips;
8. promote only accepted modules.
