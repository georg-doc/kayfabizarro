# EyeRig Batch · Control R2 · 2026-10-02

Status: **SOURCE TESTED · STAGE MIRRORED · HUMAN VISUAL GATE OPEN**

## 2026-10-02 · EYE-RIG-BATCH-CONTROL-R2-01

Georg feedback addressed:
- oval-shaped eyes could swallow/clip the now-independent pupil;
- Converge and some ranges were too narrow;
- numeric readouts needed direct edit-in-place;
- Orc Raider rendered without its source texture.

### Pupil seating repair

The first independent-pupil implementation only moved the pivot by Oval Depth. Stress testing exposed that this was insufficient when Width/Height and gaze direction changed together.

Final shared-owner implementation:
- EyeOval owner commit `2bfbe0d2d73aeb5f2fc3af5b11983dc099016792`;
- shared + FrankenStein Studio snapshot blob `90c5e44b17bbb59b1cc26dc5dc943f1091cd5b3b`;
- pupil size remains independent;
- the complete spherical pupil cap is placed in front of the tangent plane of the deformed ellipsoid after every EyeRig gaze update.

Why tangent plane:
the ellipsoid is convex. If the complete pupil cap is in front of the surface tangent plane, it cannot be inside/occluded by the sclera.

Stress proof:
- **3,125** W/H/D × gaze combinations;
- dense cap sampling;
- **0** cases inside the ellipsoid;
- worst sampled ellipsoid equation value `F=1.0397125325424128` where `F>1` is outside.

### Controls

Workbench implementation head:
`9927bdd1fee790e28b583f3ac614e2044df06630`

- Converge: `-2 … 3` + dynamic expansion;
- Gaze drift: `0 … 1.5` + dynamic expansion;
- placement + Oval controls can expand around directly typed values;
- Pupil size: `0 … 1` matching EyeRig's underlying clamp;
- Lid fit: `0 … 1`;
- kinetics A/C/J expose the underlying `-1.5 … 1.5` owner range.

Every numeric `output[data-out]` is now click-to-edit:
- click → edit in place;
- Enter / blur → commit;
- Escape → cancel;
- flexible controls expand their slider range around an entered value.

Browser persistence is intentionally unchanged:
`kfb.toolbox.eye-rig-batch.v0`
and the existing `profiles` map remains the stored source. No clear/remove/reset was added.

### Orc Raider texture

Source GLB:
`media/3D_Assets/KayKit_Mystery_Series6/1 - July 2023 - Orc Raider/character/OrcRaider.glb`
blob `875c648a9d01929bff06fcb9de54416ae32da1f7`.

Direct GLB JSON:
- material `orc_texture_A`;
- **0 images**;
- **0 textures**.

Exact source image:
`textures/orc_texture_A.png`
blob `2035dea050702373c5d2d3c9c49a3381c93b1122`.

The actor now uses an explicit texture override targeting material name `orc_texture_A`; runtime texture override now supports named source materials even when the GLB material originally has no `map`.

### Focused checks

**15/15 PASS**

Stage mirror:
`cloudflare-live@7fc4e208cb956a74cfa8ab409f9eed74eb2ef69c`
exact file readback PASS; deployment status pending.

### Deferred owner decisions

Not implemented in Control R2:
- independent left/right eye position/visibility authoring;
- Survivalist eyepatch → one EyeRig eye hidden;
- deciding whether those controls belong in Batch EyeRig vs the 3D Editor;
- same click-to-edit numeric UX in the separate FrankenStein/Pet Studio UI owner.

## Human check

1. Use an extreme Oval Width/Height and move gaze: pupil should remain fully visible on the sclera and retain its size.
2. Increase Converge far beyond the old 0.5 ceiling and verify strong inward cross-eye is possible.
3. Click any numeric readout, type an exact value such as `1`, press Enter.
4. Open Orc Raider and confirm the original source texture is visible.
5. Reload once and verify the existing locally saved profiles are still present.

No profile promotion / merge / Live promotion follows automatically.
