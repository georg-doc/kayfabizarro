# KFB Batch EyeRig Atlas

**Status:** PREPARED / no runtime yet.

Owner: KFB ToolBox / Rigging.

Current brief:

`../_handover/EYE_RIG_BATCH_2026-09-18/START_HERE.md`

Proposed implementation:

```text
tools/KFB-ToolBox/eye-rig-batch/
  index.html
  lib/
  data/
  docs/
  evidence/
  tests/
```

Do not create runtime/source files here until the dedicated implementation branch begins.


Planned sequence:
`Rig_Medium + source-eye cleanup → Rig_Large → Legacy → selected face grafts → Vehicle EyeRig → Living Plants`.

Original source-eye geometry is removed non-destructively when measured/verified; recolor is only a fallback.


## 2D / 3D alignment

Cross-tool bridge:

`../docs/2D_ANIMATION_STUDIO_BRIDGE.md`

The Batch EyeRig Atlas remains the ToolBox-owned 3D calibration lane. It must not fork a second control grammar for 2D.

The 2D Animation Studio consumes the shared `kfb.eye-rig.protocol/1` semantics through its SVG adapter. Current ToolBox `kfb.eye-profile/0.1-candidate` stays intact; renderer binding is companion metadata until consumer proof warrants anything broader.

First cross-render protocol proof: one approved Rig_Medium actor + DocCheck Eumel consuming the same semantic eye sequence.
