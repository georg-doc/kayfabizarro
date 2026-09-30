# HANDOVER → Blender MCP lane · 2026-09-30 (from Claude Design · ToolBox)

Read with: BLENDER MCP/BLENDER_MCP_LANE_2026-09-30/BACKLOG.md. Lane owns measurement, bakes, reference builds, briefs; no runtime.

## What ToolBox did with your briefs
| Brief | ToolBox result | Needs from the lane |
|---|---|---|
| FB_EYE_SOCKET_CLAY_LIDS_01 | implemented, acceptance 1–7 PASS | — |
| FB_EYES_LIDS_02 | implemented; acceptance 9/10. **Check 7 FAIL:** hard edge at cut (hinge 41.5°, slide 39.5°, need ≤35°); round-edge jumps 30.0°/29.9° (need ≤20°). Spec has 6 steps (§2.5) ≈ 25.7°/step — too coarse. | **Decision input:** re-run the edge profile with 12 steps (≈15°) in the Blender reference and confirm the ≤20° / ≤35° numbers are reachable; otherwise propose relaxed tolerances. |
| FB_EARS_FLOPPY_01 (r2, v5b GLB) | 7/7 PASS. Check 5: bone 1 carries 63 % (spec ≥60 %) — tight. `kfb_action_lifting_a` is not in the pinned Motion Library v3 (only v6) → bend tested on a scripted lean. | Re-weight check for other rigs on retarget; confirm bend clip from MOTION_LIB_v6. |
| FB_MOUTH_FIT_01 | implemented this turn (`mouth.conform`, `mouth.edge`), acceptance NOT_RUN | Measure on the real GLB: signed distance card→skin per vertex must be 0…2·EPS; send MEASURE.json of the ToolBox result for comparison. |

## New findings the lane should know
1. **Lid "neutral" failed in the ToolBox** because the lid line inherited the eye's socket-frame roll (surface normal frame), not only the oval tilt. Fixed in runtime by levelling to the line through both eyes. If the Blender reference levels lids differently (e.g. to the head's up axis), say so.
2. Mouth card assumed to face +z (three.js) after PartRig pitch/yaw.
3. Model mouth shadow: painted mouth and rig mouth must not receive shadows (LESSONS_SHADOWS).

## Open backlog items touching the lane
R2 irregular lid rim rounding (needs measurement against the reference) · R3 clay texture strength (itch.io textures not cleared for GitHub) · R5 tube brows as standard (not started) · R7 one rigging system for all characters (blank-face textures).

## Gate for the lane
Deliver (a) the 12-step edge check for LIDS-02 §2.5, (b) the mouth-fit measurement on the GLB. Nothing merged; branch georg-doc-patch-3.
