# DRAFT · ToolBox · MVP M3 "the workshop, published" · 2026-09-26

Status: **DRAFT for discussion, solution-open.** Not an execution brief.

## Problem
The ToolBox is the workshop for everything that moves or has a face: actors, eyes, ears, poses, motion, vehicles, resident scenes. It is technically green but not yet visible as one coherent, published tool, and feature parity with the older Pet/FrankenStein Studio v17+ is not proven.

## What exists
- **Owner PR #185** (Stage-First, r2): 31/31 + 34/34 static, 20/20 + 25/25 browser, 13/13 review.
- **Stage review recovery #221**: 33/33, source-first `FB_TEMPLATE_LOOK_v5.glb`, EarRig v5 silhouette complete (#214 Ear Rig Studio + dangle module).
- **Motion Library v2** (#213): 179 clips, per rig and per group, catalogue, contact sheets. (#209 = older 33-clip duplicate.)
- **Eye rigs**: Medium (27) and Large (4) accepted; Legacy page incomplete (head-only, needs full figures, all legacy characters, head-based scale; only Dungeon 1.0 is a kit).
- **AN-PROFILE-01** (#206) measured motion profiles; locomotion profiles consumed by World r2.
- Jobs in #204: `TB-V17-INTEGRATION-01`, `MOTION-INTAKE-DIRECT-01` (direct FBX intake), `ACTOR-FB-BODY-FAMILY-01`, `IK-CCDIK-PARITY-01`.
- Local: `KFB ToolBox Production-01-1` Claude Design session cut r2 (26.09.).

## Open questions
1. What is the minimum Georg must see to call the ToolBox "published"? (one Stage URL + Hub card, or also v17+ parity?)
2. Which v17+ features are really missing? A parity checklist from the old studio, not from memory.
3. Direct FBX intake inside the browser vs. Blender pass: which clips need retargeting at all (#213 shows many exact transfers)?
4. Where do Legacy eye rigs and head-based scale live — ToolBox or Resident Atlas?

## Options
- **A · Publish first:** Stage-publish #221 unchanged, link in Hub, Georg reviews; then parity.
- **B · Parity checklist first:** compare against v17+ and list gaps, then one integration slice.
- **C · UX pass in Claude Design** (compact panels, one inspector) on the published base.

## Success signals
- One URL, Georg opens it, picks FrizzleBob, sees eyes + ears, plays a Motion Library clip, poses, saves.
- Legacy figures appear whole with eyes and correct head scale.
- WorldBuilder consumes the same profiles without a second copy.

## Guardrails
No second eye/motion/transform owner; Motion Library raw FBX stay in Dropbox; wrapper review pages; two failed passes → stop.
