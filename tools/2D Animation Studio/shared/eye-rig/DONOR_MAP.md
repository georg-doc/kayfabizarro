# EyeRig donor map · 2D / 3D unification

## Current canonical donor

3D EyeRig v6:

`tools/KFB-ToolBox/kfb-rigs-embed-v3/petstudio-v9/studio-v12/pet-eye-rig.v6.js`

Relevant public control surface already present there:

- `eyeFrame()`
- `setBlink()`
- `blinkNow()`
- `setGazeFollow()`
- `pointTo(nx,ny)`
- `applyEmote()`
- `setKinetics({a,c,j})`
- `setLife()`
- `update(dt)`

## Existing face/accessory donors

- `tools/KFB-ToolBox/kfb-rigs-embed-v3/petstudio-v9/studio-v12/brow-rig.v2.js`
  - already treats `eyeFrame()` as the public face-overlay seam;
  - explicitly anticipates later glasses/eyewear on that seam.
- `tools/KFB-ToolBox/_handover/EYE_RIG_BATCH_2026-09-18/START_HERE.md`
  - current batch calibration direction for Medium/Large/Legacy and later selected face grafts.
- `tools/KFB-ToolBox/kfb-rigs-embed-v3/EMBED_KFB_RIGS_v3.md`
  - consumer contract proving gaze, blink and emote calls are already shared across Graft and Carl.
- existing 3D accessory asset: `media/3D_Assets/GLB_mini_chars/aid-sunglasses.glb` / block equivalent.

## 2D decision

The 2D Studio does **not** fork these semantic controls.

`eye-rig-2d-adapter.v1.js` maps the same calls to SVG wrapper transforms. Shared eye clips live in `eye-clips.v1.json`.

## Rich DocCheck eye asset set

Georg notes that the DocCheck source collection is richer than the current FrankenStein face controls and includes additional curved eye rings/modifiers and eyewear such as sunglasses / protective goggles.

Current source audit has only promoted what is visible and source-resolved from `_Dr_Vorlage.ai`. Do not fabricate the rest from memory.

Required next source-resolution lane:

1. inventory all eye-related Illustrator layers/artboards/assets;
2. classify each as `eye-white`, `pupil`, `lid/ring`, `brow`, `eyewear`, `headwear`, `mask/occluder`, or unresolved;
3. preserve exact source groups;
4. attach reusable modifiers to the shared `eyeFrame()` contract;
5. let 2D and 3D adapters differ only in renderer/asset representation where possible.

This turns the richer DocCheck set into an **Eye/Face Modifier Atlas**, not a one-off Eumel fork.
