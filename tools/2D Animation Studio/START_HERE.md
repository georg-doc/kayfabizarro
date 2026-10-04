# 2D Animation Studio · START HERE

Status: CURRENT TOOL ENTRY  
Updated: 2026-09-18

## Session start

1. Read the central `skills/chat/START_HERE.md` router.
2. Read `WIP_STATUS.json`.
3. Read the latest additive entry in `CHANGELOG.md`.
4. Load `skills/kfb-cartoon-animation_v2.md` for animation work.
5. Open only the active lab and any explicitly named inbox job.

## Current active lane

`labs/eumel-rig-lab/`

Goal: turn the DocCheck Eumel into a reusable browser-driven 2D/2.5D cutout actor with preserved source geometry, separate pupils, rigid forehead mirror, secondary stethoscope motion, full hidden leg shapes and controlled cartoon deformation.

## Incoming source

Expected job: `_inbox/doccheck-ad-ai-source/`

Georg will place an Adobe Illustrator source package from the DocCheck AD there. Treat it as intake until classification and acceptance. It is expected to become the visual source SSOT after verification, but that promotion is **not automatic**.

## Evidence discipline

Use the central status vocabulary literally:

`PROPOSAL` → `DECISION` → `IMPLEMENTATION` → `TESTED RESULT` → `HUMAN FREEPLAY / GEORG PASS`.

A source file existing in `_inbox/` is not an implementation PASS. A browser animation running is not proof that source proportions/outlines are correct.


## ToolBox / shared-rig alignment

For eye/face or cross-render work read:

- `docs/TOOLBOX_INTEGRATION.md`
- `shared/eye-rig/toolbox-bridge.v1.json`
- `tools/KFB-ToolBox/docs/2D_ANIMATION_STUDIO_BRIDGE.md`

Do not fork ToolBox EyeRig semantics or migrate 3D actor ownership into this Studio.


## Cross-render proof / modifier atlas

Current Phase A proof:

`proofs/cross-render-eye-v1/`

Current modifier inventory scaffold:

`shared/eye-rig/modifier-atlas/`

Static proof sanity is PASS; browser QA remains pending. The modifier atlas must remain source-first and must not invent unresolved DocCheck layer names/assets.
