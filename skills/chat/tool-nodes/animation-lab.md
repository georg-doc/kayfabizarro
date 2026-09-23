# Tool Node · Animation Lab

Status: UNVERIFIED

This node intentionally does not invent a current site or implementation SSOT. Promote it to `CURRENT_TOOL` only after the current Animation Lab source/site is explicitly pinned.

## Intended responsibility

Clip inventory/audit, playback, animation behavior, dynamic pose/clip calibration and later authored vehicle/weapon/surf motion.

## Contract with FrankenStein Studio

FrankenStein Studio decides/measures actor, look, rig/static pose and exports configuration. Animation Lab consumes that state and plays/audits motion. Do not rebuild actor material/head ownership inside the Lab.

## Load with

`skills/kfb-cartoon-animation_v2.md`

This skill currently declares version 2.0 and `canonical-draft`; it provides the KFB motion, staging, VFX and recovery grammar and should be treated as a current reference unless the registry supersedes it.

## Promotion gate

Pin current implementation repository/path, current standalone/live site if any, current handover/return, and tested clip source revision.

## 2026-09-23 · Candidate authoring input · Blender MCP (POC)

A Blender-side authoring lane produced a checked, looping KayKit animation (Clown · Rig_Medium · 3-club cascade, 48 f @ 24 fps, props by the identity rule at `handslot.*`). Georg visual PASS ~80 % on the viewport preview; GLB exported, **browser playback not yet tested**.

This does not promote this node or change its owner. It is an input the Lab may accept after JUG-P2.

Handover: `tools/KFB-ToolBox/_handover/BLENDER_MCP_ANIMATION_POC_2026-09-23/START_HERE.md`
