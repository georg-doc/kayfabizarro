# KFB Fluff Work Motion Pack 01 · Reuse / Gap status after Part 2

Date: 2026-10-04. Part 1 matrix: `../PART1_RETURN/REUSE_MATRIX.md`.

**Sizes:**
- **Rolled balls follow the Fluff Mass Ladder (brief `cd69323`):** Medium r 0.477 m, Large r 0.689 m (3 Medium = 1 Large).
- **The Large two-hand bench/ground work chunk follows Option A (Production Control `c948e155`):** r 0.22 × body height = 0.922 m.
- This is presentation size only. Inventory, resource and pickup value, and the global Fluff ball size, stay runtime-owned.

| Role | Part 1 decision | Part 2 result | Clip (both rigs unless noted) |
|---|---|---|---|
| roll_push | DERIVE / EDIT (G1) | built | `kfb_fluff_roll_push_a` |
| roll_push_heavy | DERIVE (G2) | built | `kfb_fluff_roll_push_heavy_a` |
| steer_left | DERIVE (G3) | built | `kfb_fluff_steer_left_a` |
| steer_right | DERIVE = mirror (G3) | built | `kfb_fluff_steer_right_a` |
| place_small | KEEP + FIT, Large retarget (G5) | built | `kfb_fluff_place_small_a` (Medium = native Interact) |
| knead_press | KEEP + FIT, Large G4 | built, Large chunk 0.22 H | `kfb_fluff_knead_press_a` (Medium = native Working_B) |
| pack_flatten | KEEP + FIT, Large retarget (G5) | built | `kfb_fluff_pack_flatten_a` (Medium = native Working_A) |
| pass_receive | KEEP | unchanged; pair alignment measured | `kfb_interaction_gift_give_a` + `_receive_a`: receiver starts 10 frames after the giver, roots 1.149 m apart (M) / 2.774 m (L) |
| pull_chunk | KEEP + FIT | unchanged | `kfb_interaction_pulling_lever_a` |
| collect_debris | KEEP + FIT, Large G4 | built, Large chunk 0.22 H | `kfb_fluff_collect_debris_a` (Medium = native Digging) |
| patch_press | KEEP + FIT, Large retarget (G5) | built | `kfb_fluff_patch_press_a` (Medium = native Work_A) |
| work_to_dance / dance_to_work | NOT NEEDED | runtime crossfade, no clip | – |
| celebrate_short | KEEP | unchanged | Cheering (Medium), `kfb_gesture_cheering_a` / `kfb_gesture_clapping_a` |
| pickup_react_short | KEEP + FIT | unchanged; pickup stays walk-over + POP | trim of `kfb_locomotion_joyful_jump_a` |
| ball_bounce_reference | prop reference | unchanged (Part 1) | `kfb_fluff_ball_bounce_reference.glb` |

**Optional rows added in `cd69323` (secondary, not run):**

| Row | Status |
|---|---|
| coop_large_push | NOT_RUN |
| foot_driven_roll | NOT_RUN |
| ball_balance | NOT_RUN |
| ball_dance | NOT_RUN |
| ball_surf | NOT_RUN |

- **Remaining motion gaps:** none in the core pack. The Large push needs a ball-size or posture decision (RETURN defect 0).
- **NEW CLIP REQUIRED:** none.
- **Open decisions for Georg:**
  - Large push vs. Mass Ladder ball size;
  - forearm sink into the Large knead chunk;
  - chunk size for one-hand roles.
