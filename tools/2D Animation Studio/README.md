# 2D Animation Studio

Status: **CURRENT_TOOL**  
Owner: Georg / KFB  
Created: 2026-09-18

Browser-first authoring and calibration tool for reusable **2D / 2.5D cutout animation modules**.

The Studio combines measured source artwork, explicit part/pivot hierarchies, limited cartoon deformation, KFB motion choreography, browser playback/QA, and reusable outputs for mini-games, microlearning, UI actors and other consumers.

## First lab

`labs/eumel-rig-lab/` — DocCheck Eumel cutout / Hampelmann rig.

The existing measured/traced Eumel reconstruction is a **provisional donor**. Georg will provide the DocCheck AD Illustrator source as the intended visual SSOT through the tool-local inbox. Do not silently promote the provisional reconstruction over that incoming source.

## Read first

1. `START_HERE.md`
2. `WIP_STATUS.json`
3. `RECOVERY.md`
4. `CHANGELOG.md`
5. `docs/ARCHITECTURE.md`
6. `docs/SOURCE_INTAKE_CONTRACT.md`
7. the named lab README

## Source-of-truth rule

- Tool implementation/state: this folder.
- Shared production workflow: `skills/chat/`.
- Motion grammar: `skills/kfb-cartoon-animation_v2.md`.
- Incoming source files: `_inbox/` until explicitly accepted.
- Consumer runtime/game rules remain with the consumer project.

**Measure → decompose → rig → animate → browser-test → hand off.**


## ToolBox alignment

Cross-tool contract:

`tools/KFB-ToolBox/docs/2D_ANIMATION_STUDIO_BRIDGE.md`

The Studio owns 2D source geometry, cutout bind/bones, 2D deformers and SVG adapters. ToolBox remains the 3D EyeRig/FaceHost/FrankenStein owner.

Shared eye semantics are defined by `kfb.eye-rig.protocol/1`; 2D and 3D differ at the renderer/host binding layer.

No claim is made that SVG cutout body clips and KayKit skeletal clips are interchangeable.
