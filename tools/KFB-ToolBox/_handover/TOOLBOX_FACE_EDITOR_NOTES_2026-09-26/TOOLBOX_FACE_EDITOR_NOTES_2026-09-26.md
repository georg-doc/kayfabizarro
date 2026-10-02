# KFB ToolBox · Face editor notes from Georg · 2026-09-26

**Status:** notes for WSA to turn into slices. Nothing is implemented here.
**Source of these notes:** Georg, reviewing FrizzleBob · Ear Rig v5 in KFB ToolBox Production-02 → Rigging (Claude Design, saved 26.09.2026 20:30).
**Evidence in this folder:**
- `kfb-pet-frizzlebob-earrig-v5.georg-2026-09-26.json` (Georg's saved export, schema `kfb.pets/1`);
- `toolbox_rigging_mouth_painted_2026-09-26.png` (screenshot, Mouth → Painted).

## Defect first

**The painted mouth casts a shadow and cannot follow the head shape.**

- In the export, `parts.mouth = "original"`. The painted mouth is one static mesh from the model, moved as a rigid part (`partrig.v1`: size / lift / depth / tilt).
- It has no bend, no wrap and no rotation around the head, so on a round head it floats or cuts in.
- The rig-mouth fields (`wrap`, `bend`, `rot`) exist in the same export, but only for the "Mouth rig" source.

**Coworker hypotheses, not verified in code:**
1. **Shadow:** the painted-mouth plane has `castShadow = true` on an alpha texture. A decal part should not cast shadows, or it needs alpha-tested shadows.
2. **Stripes on head and ears:** the fine contour-line pattern on the head and ears in the screenshot looks like shadow acne (shadow bias too small). Check the ToolBox shadow bias/normalBias before judging the mesh.

## Georg's requests (slice candidates)

1. **Mouth sliders to Pet Studio level.** The ToolBox still lacks a lot of the Pet Studio controls.
   - The painted mouth must be adjustable to the head: wrap/bend onto the surface, rotation around the head, and no shadow.
   - Pet Studio v9 is the donor. Port its controls; do not re-invent them.
2. **Use the 3D in-place editor here too.** The face part editor was again solved proprietarily and rebuilt without rotation etc.
   - The existing in-place editor (S21 / Stage-First owner) is the owner: gizmo with move, rotate and scale, save and reload.
   - Rule: consume the existing owner. No new proprietary editor.
3. **Eyes and eyebrows adjustable separately.** Today the brows follow the eye anchor. Brows need their own anchor/offset, so that eyes can be placed far out at the side of the head (frog-style) while the brows stay where they belong.
   - Acceptance: an eye anchor placed at the side of the head, with the brows placed independently, survives save and reload.
4. **Claymation eyelids** as an alternative to the current flat shells, offered as an option in the Studio.
   - Rounded, thick lids with a soft edge, colour = base-darkened (as today).
   - The same lid parameters and emotes (`lidUpper`, `lidLower`, `slant`), so the emote vocabulary stays stable.
   - Blender can author the lid form as a donor mesh (Coworker lane) if WSA wants that.

## Boundaries

- These notes do not reopen closed recoveries (ToolBox r2 #220/#221); they add face-editor slices.
- No auto-merge. Georg's look review decides each slice.
