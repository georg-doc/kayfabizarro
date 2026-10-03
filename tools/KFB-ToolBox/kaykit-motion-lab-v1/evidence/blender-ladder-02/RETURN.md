# LOCOMOTION-LADDER-02 · RETURN

Lane: Blender MCP (cowork) · Date: 2026-10-03 · Follows LOCOMOTION-LADDER-01 (PR #334) after Georg's review.
Status: **candidate data, nothing merged, nothing on Stage or Live.**

## For Georg (plain language)

- **The jog is fixed.** `strike_foward_jog_a` was a hop, as you saw. Out of your new Mixamo clips, `jog_forward_a` is a real jog.
- **The forward ladder is now complete and clean:** walk → jog → easy run → run → sprint. Every neighbour can be reached with at most ±25 % speed stretch, and no rung slides (all PASS).
- **New:** walk start, sprint start from standing, a shorter walk stop without the end turn, a backward run, a clean side run to the right, running turns and a full jump that also works on the big rig.
- **Still missing or not clean:**
  - a side **jog** (between side walk and side run);
  - a clean backward jog (`slow_jog_backwards_a` slides);
  - a clean side run to the **left**;
  - **left** running turns;
  - a run stop without the 45° turn at the end.
- **Of your 41 clips, 16 were duplicates** of clips we already had (or of each other). They were not taken in. The other 25 are now in the Motion Library (v7).
- **Look at it in Blender:** your open Blender has a second scene, **KFB_LOCOMOTION_LADDER_02**. Press **Space**. Next to each chosen clip stand its alternatives, so you can compare the look. Side runs have their own rows on the far right; the big rig follows after that.
- **Your call (look only):** jog = `jog_forward_a` or the calmer `jogging_a`? Run = `medium_run_a` or `running_d`? Sprint = `sprint_a` (strong lean) or `fast_run_a`?

## Ladder `kfb_ladder_v2` · Rig_Medium (speeds m/s: rig · world)

| Rung | Clip | Speed | Slip | Alternatives |
|---|---|---|---|---|
| idle | kfb_idle_idle_f | — | — | |
| walkStart | start_walking_a (2.9 s) | — | — | female_start_walking_a (1.9 s) |
| walk | walking_c | 1.14 · 0.77 | 0.98 % PASS | |
| jog | jog_forward_a | 1.76 · 1.20 | 0.82 % PASS | jogging_a 1.35, running_f 1.90, strike_foward_jog_a 1.63 (rejected) |
| runEasy | slow_run_a | 2.13 · 1.45 | 1.47 % PASS | running_a 2.03 |
| run | medium_run_a | 3.18 · 2.16 | 1.34 % PASS | running_d 2.98 (slip HOLD), run_forward_c 3.47 |
| sprint | sprint_a | 4.20 · 2.86 | 1.13 % PASS | fast_run_a 3.85, running_e 4.03 |
| sprintStart | idle_to_sprint_a (0.8 s) | — | — | |
| walkStop | female_stop_walking_a (1.3 s) | — | — | stop_walking_a (3.0 s, ~10° end turn) |
| runStop | run_to_stop_a (0.93 s) | — | — | hips end turned 45° |
| walkBack | walk_backward_a | 0.56 | PASS | walking_backwards_a 0.54 |
| jogBack | slow_jog_backwards_a | 1.17 | **HOLD** (root 2× feet) | |
| runBack | running_backward_a | 2.16 | PASS | run_backward_a 1.33 |
| strafeWalkL / R | left_strafe_walking_a / right_strafe_walking_b | 1.18 | PASS | |
| strafeRunL | left_strafe_a | 3.08 | 2.02 % **HOLD** | |
| strafeRunR | strafe_a | 2.63 | 1.86 % PASS | right_strafe_a 2.93 (loop 21°) |
| turnInPlace L90 / R90 / L180 / R180 | left_turn_90_a / right_turn_90_a / left_turn_b / right_turn_b | — | — | R90 turns 102.6°; 180s turn 168° / 175° |
| runTurnR / sprintTurnR / runTurn180 | running_right_turn_a / sprint_turn_a / change_direction_a | — | — | right only |
| jumpFull | jumping_a | — | — | both rigs |
| jumpStart / Air / Land | KayKit Jump_Start / Jump_Idle / Jump_Land | — | — | Rig_Medium only |

### Bands (Rig_Medium)

| From → to | Handoff (m/s) | Rates from / to | Phase offset | Flag |
|---|---|---|---|---|
| walk → jog | 1.41 | 1.245 / 0.803 | 0.94 | — (at the edge) |
| jog → runEasy | 1.94 | 1.100 / 0.909 | 0.89 | — |
| runEasy → run | 2.60 | 1.222 / 0.819 | 0.20 | — |
| run → sprint | 3.65 | 1.149 / 0.870 | 0.02 | — |
| walkBack → jogBack | 0.81 | 1.447 / 0.691 | — | **stretch** |
| jogBack → runBack | 1.59 | 1.360 / 0.735 | — | **stretch** |
| strafeWalkL → strafeRunL | 1.90 | 1.616 / 0.619 | — | **stretch** |
| strafeWalkR → strafeRunR | 1.76 | 1.494 / 0.669 | — | **stretch** |

### Rig_Large

Same clips, forward rates identical. Speeds (rig): walk 2.92, jog 4.52, runEasy 5.47, run 8.16, sprint 10.78; all forward rungs PASS. `strafe_a` slips 3.0 % on Rig_Large (HOLD). No split jump; use jumpFull.

## Gaps · Mixamo search names (nothing downloaded; names not verified)

| Rung | Need | Search |
|---|---|---|
| jogStrafe L/R | side jog around 1.6–2.0 m/s | "Jog Strafe Left", "Jog Strafe Right" |
| jogBack | clean backward jog around 0.8–1.0 m/s | "Jog Backward" |
| strafeRunL | clean left partner of `strafe_a` | "Strafe" with Mixamo **Mirror** on |
| runTurnL / sprintTurnL | left running turns | "Running Left Turn", "Sprint Turn" mirrored |
| runStop (option) | stop without the end turn | "Run To Stop", "Running Stop" |
| jump split on Rig_Large | jumpStart / air / land | already in `_inbox`: Action Adventure Pack "jumping up", "falling idle", "hard landing" |

## Method

Same as LOCOMOTION_LADDER_01 (see `method` in the JSON): own glTF evaluator; cycle = frames − 1; strict no-slip speed; slip PASS ≤ 2.0 % of rig height; handoff = geometric mean, flag outside 0.75–1.25. New: `rungs[].alternatives[]` for the look decision. Motion Lab v1 comparison unchanged (reported in the JSON).

## Files

| File | Where |
|---|---|
| `LOCOMOTION_LADDER_02.json` | GitHub + Dropbox |
| `KFB_LOCOMOTION_LADDER_02_review_plan.json`, `blender_ladder_review.py` (now supports side-run rows) | GitHub + Dropbox |
| `KFB_LOCOMOTION_LADDER_02_Rig_Medium.glb` / `_Rig_Large.glb` (review merges) | Dropbox only |
| Motion Library v7: catalogue, `KFB_Motion_locomotion_i07.glb` ×2, sheets, `RETURN_INTAKE_07.md` | GitHub `media/3D_Assets/Animations/KFB_Motion_Library/` + Dropbox `MOTION_LIB_v7` |

## Not in this job

No controller or state machine, no Three.js, no edits in ToolBox / Travel / Combat / Resident Atlas, no motion edits (no mirroring), no downloads.

## Owner question (from LADDER-01, still open)

Shared gait code: one ToolBox module for everyone (recommended), or separate code per game fed by this JSON? A technical choice, not a look question; written into the brief as "one module" unless Georg objects.
