# CLAY-B1 · FrizzleBob v5 · round 2 · RETURN · 2026-09-26

**Georg on round 1:** "looks nothing like claymation, even a bit too bright"; "needs an urgent tune"; he approved smoothing the body parts, **on condition** that they stay usable in the Studio, in all JSON configurations and in the game.

## Defects first

1. **Still not claymation.**
   - ClayMaster v0.2 (re-conceived: soft thumb dents, waxy sheen, a little subsurface, darker creases, grain almost off) reads as smooth vinyl at 1024².
   - The dents are too faint, and the saturated yellow keeps it plastic.
   - Look: **FAIL / TUNE**. This is the third attempt at the look point, so the next step is not more slider turning.
2. **New EEVEE defect:** sparkly grain on the shoulder, arm and feet in the rendered viewport (AO node or bump aliasing). It does not show in Cycles.
3. **Brightness:** exposure was lowered by 0.4 for the look-dev camera only. FB's colour itself is unchanged; the colour is Georg's.

## Smoothing (done, on the copy scene)

- **Parts:** Body, ArmLeft/Right, LegLeft/Right. Subdivision level 2 was applied **before** the armature modifier, and all parts are shaded smooth.

| Part | Verts before → after |
|---|---|
| Body | 211 → 5018 |
| Each arm | 252 → 5408 |
| Each leg | 186 → 4081 |

- Vertex groups are kept (47); all weights stay normalised at 1.0.
- The silhouette shrinks by ~1 % at most (body 0.778 → 0.769 m).
- **Head and ears are untouched.** The face anchors in the `kfb.pets/1` JSON (eye/brow/nose/mouth, relative to the head) therefore stay valid.
- **Unchanged:** object names, material slot names, bone names and the armature.

**Open for the Studio/game condition:**
- The export GLB has not yet been built and loaded in the ToolBox. That is the proof: same node and bone names, face mount OK, animation plays.
- Triangle budget: +~21k vertices for the body parts. Head (6k) and ears (2 × 11k) were already heavy.

## Files

- `build_clay_master_v02.py` (md5 `b5bf6aae…`).
- `fbv5_r2_AB_1024.png`: left = original colour, smoothed; right = ClayMaster v0.2.
- Dropbox `CLAY-B1/KFB_CLAY_B1_FB_v5_r2.blend` (only the clay scene).
- Georg's Blender viewport is set to that scene (rendered, overlays off). Georg orbits himself and does not save.

## Recommendation (Coworker)

- **Stop tuning on a plain grey stage.** Claymation reads through **light and form** as much as through the shader: a warm key light with soft visible shadows, a darker set, visible thumb-press modelling in the *geometry* (sculpted, not bump), and slightly muted colours.
- **Next step, proposed:** one reference frame. Georg names a claymation still he likes (for example from the ClayBound deck), and Blender matches light and material to it side by side.

## Exactly one next gate

Georg picks the target reference image (or says: match the ClayBound deck look).
