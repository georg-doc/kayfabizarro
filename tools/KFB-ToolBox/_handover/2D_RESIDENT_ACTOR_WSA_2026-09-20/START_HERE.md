# ToolBox Handoff Pointer · 2D/2.5D Resident Actor Integration

**Date:** 2026-09-20  
**Status:** `HANDOFF READY · WSA REVIEW`

Authoritative cross-project brief:

`skills/chat/workflows/2D_RESIDENT_ACTOR_WSA_2026-09-20/START_HERE.md`

## Why ToolBox points here

ToolBox owns the existing 3D EyeRig/FaceHost/FrankenStein lane and the Resident integration lead already reads ToolBox handovers.

This handoff does **not** move 2D source ownership into ToolBox.

## First actor

DocCheck Eumel as a source-exact 2.5D cutout resident.

Prepared uses:

- DocCheck Project Island with pinned KayKit 3D scenery;
- KFB Resident Atlas candidate;
- later one named KFB game consumer.

## Shared seam

Eye/face behavior uses the existing shared EyeRig protocol.

Actor/world seam:

`mount / update / setState / dispose`

World/collision/camera remain consumer-owned.

## Current next gate

Implement one isolated `three2p5d` Eumel world-space adapter proof. Do not modify Travel/Free Roam/Resident runtimes before that browser gate.

## Related current Resident handoff

`tools/KFB-ToolBox/_handover/RESIDENT_SCENE_MODULES_WSA_2026-09-19/START_HERE.md`

The Clown S33 gate remains separate and unchanged.


## Phase 1 proof now exists

`tools/2D Animation Studio/proofs/eumel-three2p5d-v1/`

Static sanity is PASS. Browser/visual acceptance is still pending.

WSA should inspect this proof before any Resident Atlas index change or DocCheck Project Island runtime work.
