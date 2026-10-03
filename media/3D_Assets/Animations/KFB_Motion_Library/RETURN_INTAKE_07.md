# RETURN · KFB Animation Intake 07 · Motion Library v7 · 2026-10-03

Scope: index, duplicate check, convert and normalise only. No motion was edited by hand. Unchanged pipeline (intake 05/06 bake, loop and facing metrics, sheet framing).

**Input:** 41 single Mixamo FBX from Dropbox `BLENDER MCP/_inbox` (Georg 03.10), chosen for the gait ladder (LOCOMOTION-LADDER-02).

**Result:**
- **25 clips baked** onto Rig_Medium and Rig_Large into the supplement library `libs/*/KFB_Motion_locomotion_i07.glb`.
- **16 files not baked:** (near) duplicates of library clips or of each other (table below).
- The catalogue grows from 370 to **395** clips. Every earlier clip, library entry and intake note is unchanged (checked field by field).
- The catalogue also carries the locomotion sets `kfb_ladder_v1` and `kfb_ladder_kaykit_v1` (from LOCOMOTION-LADDER-01, PR #334) and the new `kfb_ladder_v2`.
- Export check (`verify7.json`): rest skeleton identical to the earlier libraries, no meshes or skins, animation names complete, round trip 0.0 cm.
- Contact sheets: all 25 rendered and viewed. No floating, twisted or mirrored retarget.

## Defects and open points (read first)

1. `slow_jog_backwards_a`: the root travels about twice as fast as the planted feet (1.17 vs 0.53 m/s on Rig_Medium). Expect visible foot sliding. HOLD.
2. `strafe_a` (side run to the right) is clean on Rig_Medium but slips 3.0 % of height on Rig_Large. HOLD on Rig_Large.
3. `walking_backwards_a`: the body is turned about 40° against the travel line.
4. All running turns turn right (`running_right_turn_a`, `sprint_turn_a`). There is no left version.
5. `walking_p` is not a clean loop (13.7°).
6. Raw FBX stay in Dropbox `_inbox/` and never go to GitHub.

## Not baked (duplicate check: 9-segment pose descriptor, yaw-normalised, best phase shift; mean angle)

| File | Same as | Difference |
|---|---|---|
| Standard Run | standard_run_a | 3.6° |
| Running (5) | running_d | 2.4° |
| Run Forward (3) | run_forward_b | 4.3° |
| Standing Sprint Forward | magic_sprint_forward_a | 2.3° |
| Stop Walking | stop_walking_a | 0.0° |
| Stop Walking (1) | stop_walking_a | 2.0° |
| Female Stop And Start Walking (1) | Female Stop And Start Walking (this intake) | 2.1° |
| Left Strafe Walking (1) | left_strafe_walking_b | 0.5° |
| Right Strafe Walking (1) | right_strafe_walking_b | 0.4° |
| Right Strafe Walk | female_right_strafe_walk_a | 3.0° |
| Walking (13) | walking_j | 0.0° |
| Walking (14) | walking_i | 3.9° |
| Walking (15) | walking_a | 2.7° |
| Running Jump (1) | running_jump_a | 0.0° |
| Jog In Circle (1) | jog_in_circle_a | 4.4° |
| Run Backward (1) | Running Backward (this intake) | 6.6° |

## New clips (Rig_Medium natural speed, m/s)

| Group | Clips |
|---|---|
| Jog | jogging_a 1.35, jog_forward_a 1.76, jog_forward_diagonal_a 1.86 (moves forward-left), running_f 1.90 |
| Run | slow_run_a 2.13, medium_run_a 3.18, run_forward_c 3.47 |
| Fast | fast_run_a 3.85, running_e 4.03, sprint_a 4.20 |
| Start / stop | start_walking_a, female_start_walking_a, female_stop_walking_a, idle_to_sprint_a, female_stop_and_start_walking_a (loop) |
| Backward | walking_backwards_a 0.54, slow_jog_backwards_a 1.17 (HOLD), running_backward_a 2.16 |
| Side | strafe_a 2.63 (right) |
| Turns | running_right_turn_a, sprint_turn_a, change_direction_a (~176°) |
| Other | walking_p, jump_b (repeating big jump), jumping_a (single jump) |

## Files

| File | What |
|---|---|
| `KFB_Motion_Library.catalog.json` | Catalogue v7 (`2026-10-03`, 395 clips) |
| `libs/Rig_Medium/KFB_Motion_locomotion_i07.glb`, `libs/Rig_Large/KFB_Motion_locomotion_i07.glb` | Supplement libraries (25 clips each) |
| `sheets/locomotion/<id>.png` | Contact sheets of the 25 new clips |
| `verify7.json` | Export check |
| `source/` | Scripts of this intake and of LOCOMOTION-LADDER-02 |
