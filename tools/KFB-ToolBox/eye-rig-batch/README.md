# KFB Batch EyeRig Atlas

**Status:** IMPLEMENTED CANDIDATE · Rig_Medium first · source identity resolved (eyes 2+3) · corrected Stage published · Georg visual gate pending.

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

GothGirl source-eye cleanup now uses current-source components **2 + 3** and a fail-closed identity signature (12 components, 69-triangle mirrored frontal eye pair). Components 6/7/8 are lateral accessories and remain preserved. The historical 6+7 interpretation is diagnostic history only.

v0 includes eyes, pupils, gaze, blink, upper/lower lids, splay, the six existing expressions, life/kinetics and motion regression. Lashes, brows, nose and mouth stay out.

See:

- `SOURCE.json`
- `docs/SOURCE_AUDIT.md`
- `docs/SOURCE_COMPONENT_IDENTITY_2026-09-19.md`
- `docs/source-components-0-11.html`
- `TEST_REPORT.md`
- `RETURN.md`
- `CHANGELOG.md`

Cross-render semantics remain aligned with:

`../docs/2D_ANIMATION_STUDIO_BRIDGE.md`

The existing `kfb.eye-profile/0.1-candidate` schema remains local/candidate. No global contract promotion is claimed.


## Review handoff

Draft PR: `#104` — not merged.

Publication mirror: `cloudflare-live@f309948a3bd265154e6d3f5c959b69ec9b725f26`.

The fixed Stage route is linked from the KFB Hub. Automated public verification is still open because the available environments cannot resolve/open `pages.dev`; Georg's normal-browser check is the next gate.


Public proof: GitHub Actions run `35457983922` · 17/17 PASS · 5 screenshots · 0 page/console errors.

The current GothGirl seed remains `AUTO_CANDIDATE`: screenshots show the default eye size (`ring=0.30`) is visibly oversized/protruding. Use the Stage workbench to tune Eye size → Inset → Spacing/Vertical before approval.


## Current corrected gate

Source identity checkpoint: `949ff8037df2da88eb91ef825984ef57870b8238`.  
Corrected Stage mirror: `cloudflare-live@c6489fce74f98b2124feb184becd27d2cbe4a922`.

The earlier 21/21 public proof remains useful runtime history but is **not** current 2+3 visual proof. The corrected Stage needs one human browser review: use the runtime-generated source-measured baseline, compare Front / 3/4 / Side and motion, then approve or reject. The profile remains `AUTO_CANDIDATE`.
