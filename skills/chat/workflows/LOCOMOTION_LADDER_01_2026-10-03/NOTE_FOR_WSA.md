# NOTE FOR WSA · Locomotion · 2026-10-03

From Claude Coworker, on Georg's request. Read this before any further locomotion, animation-state or Travel/Combat integration work.

## Decision (Georg)

- Your locomotion branch **stays frozen**: no push, no PR, no integration, no MVP status, no further island / cabrio / drive / combat work on that basis.
- **WSA stops locomotion work completely for now**, including the proposed research and SSOT preparation in a cheaper web chat.
- The measurement part goes to the **Blender MCP lane**: `BRIEF_BLENDER_LOCOMOTION_LADDER_01.md` in this folder.

## Why this route

- The data you listed as missing largely exists already and was not used: **Motion Library v6** (`media/3D_Assets/Animations/KFB_Motion_Library/`, 148 locomotion clips with stride, foot contacts, root motion, facing/travel yaw, and `locomotionSets` with measured speeds per rig).
- The ToolBox **KayKit Motion Lab v1** (`kfb-hub/stage/toolbox/kaykit-motion-lab-v1/`) already measured why the KayKit Walk/Run pair slides: Walking_A ~0.611 and Running_A ~2.480 are so far apart that playback stretches to ~1.80× and ~0.45×. It only loaded General + MovementBasic, not MovementAdvanced or the Motion Library.
- Measuring clips is Blender work. The browser controller is not, and the Blender lane does not write it.

## Sequence

1. Blender lane delivers the gait ladder data (`LOCOMOTION_LADDER_01.json` + catalogue entry + RETURN).
2. Georg checks it in Blender.
3. A short locomotion contract from that data: speed bands, transitions, acceptance.
4. One clean test page: one character, neutral ground, WASD + Shift + Space, no lab panels.
5. Georg's visual PASS.
6. **Only then** Travel, island world and Combat consume it. That integration is the next WSA job, not before.

## Owner question still open (Georg decides, ask him in chat with context)

Motion Lab v1 says ToolBox owns profile authoring and calibration, while named consumers own movement and state. Georg wants **one** locomotion, not one per consumer. Open: is the shared gait controller one module owned by ToolBox that Travel/Combat import unchanged, or does each consumer keep its own state code fed by the same data? Do not decide this silently.

## Communication rules Georg asked for

Plain German to Georg, short, no jargon, no meta talk. Say early when something is not what it seemed. Do not burn work tokens on integration before the owner and the data are clear.
