# START HERE · KFB ClayBound Asset Pipeline · 2026-09-26

Status: **REVIEW · ASSET 01 HUMAN ACCEPTED · ASSET 03 FROZEN AFTER TWO REPAIR PASSES · NO STAGE / LIVE**

Owner: **KFB ToolBox / ClayBound material exploration**  
Receiving Blender owner: **PR #228 · `claude/claybound-blender-lane-plan-2026-09-26`**  
Human: **Georg**

## Read order

1. `skills/chat/START_HERE.md`
2. `skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`
3. `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`
4. `ASSET_MANIFEST.json`
5. `BLENDER_MCP_BRIEF.md`
6. `failure-recovery/ASSET_03_ROUGH_HANDMADE_2026-09-26/START_HERE.md`
7. `RETURN.md`

## Current asset state

- **Asset 01 · smooth matte clay r1:** HUMAN_ACCEPTED; tile QA PASS; source approval does not yet equal Blender/runtime proof.
- **Asset 02 · fine grain:** DEFERRED because Georg explicitly jumped to rough handmade clay.
- **Asset 03 · rough handmade meso height:** r2 tile PASS / human look OPEN; r3 visually more sculpted but seam FAIL; slice frozen by two-pass rule.

## Protected boundary

Do not:
- mark Asset 03 production-ready before human review;
- use r3 pixels in Blender;
- treat the height source as a Normal map;
- overwrite KFB rig/material-slot ownership;
- create a second clay asset registry;
- publish Stage/Live from this handoff.

## Exactly one next gate

**GEORG HUMAN REVIEW · Asset 03 r2 look.**
