# KFB Batch EyeRig Atlas

**Status:** IMPLEMENTED CANDIDATE · Rig_Medium first · static tests green · visual Stage gate pending.

Owner: KFB ToolBox / Rigging.

Current brief:

`../_handover/EYE_RIG_BATCH_2026-09-18/START_HERE.md`

Source branch:

`toolbox/eye-rig-batch-2026-09-18`

First bounded actor:

`GothGirl · Rig_Medium · 23 joints`

Stage target:

`https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/eye-rig-batch/`

## What this candidate does

`exact actor source → verified source-eye cleanup → measured FaceHost → existing EyeRig v6 → review/tune → profile export`

The tool reuses the current EyeRig-v6 / FaceHost owners. It does not modify canonical GLB/GLTF files, create a second eye implementation, rewrite Resident Atlas recipes or introduce another animation owner.

GothGirl source-eye cleanup uses the exact documented precedent only when the head still measures 12 connected components; components 6 + 7 are removed from a derived runtime index. Guard mismatch fails closed.

v0 includes eyes, pupils, gaze, blink, upper/lower lids, splay, the six existing expressions, life/kinetics and motion regression. Lashes, brows, nose and mouth stay out.

See:

- `SOURCE.json`
- `docs/SOURCE_AUDIT.md`
- `TEST_REPORT.md`
- `RETURN.md`
- `CHANGELOG.md`

Cross-render semantics remain aligned with:

`../docs/2D_ANIMATION_STUDIO_BRIDGE.md`

The existing `kfb.eye-profile/0.1-candidate` schema remains local/candidate. No global contract promotion is claimed.
