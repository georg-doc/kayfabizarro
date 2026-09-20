# Tool Node · 2D Animation Studio

Status: CURRENT_TOOL

Implementation home:

`tools/2D Animation Studio/`

## Responsibility

Browser-first 2D/2.5D cutout rig authoring, pivot/part hierarchy, cartoon deformation/motion calibration, reusable animation-module export and consumer handoff.

## Load with

`skills/kfb-cartoon-animation_v2.md`

## First lab

`tools/2D Animation Studio/labs/eumel-rig-lab/`

Incoming source job:

`tools/2D Animation Studio/_inbox/doccheck-ad-ai-source/`

## Boundaries

The Studio does not own consumer gameplay rules or 3D actor/look/material systems. Inbox material is not automatically canonical. The older `animation-lab` registry node is not silently superseded; reconcile explicitly later if Georg wants this Studio to become its formal successor.


## ToolBox alignment

Cross-tool bridge:

`tools/KFB-ToolBox/docs/2D_ANIMATION_STUDIO_BRIDGE.md`

ToolBox keeps 3D EyeRig-v6 / FaceHost / FrankenStein ownership. The 2D Studio consumes the same semantic EyeRig control surface through an SVG adapter and owns 2D source geometry / cutout binding.

Shared eye semantics do not imply shared whole-body animation tracks across SVG cutouts and KayKit skeletons.
