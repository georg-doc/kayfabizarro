# RETURN · KFB Animation Intake 02 · Motion Library v2 · 2026-09-25

Scope: convert and normalise only. No motion was edited by hand. 179 clips: 33 from v1 and 146 new, on Rig_Medium and Rig_Large.

## Defects and open points (read first)

1. **Tooling.** The Blender MCP `*_for_cli` tools could not start (no BLENDER_PATH). All work ran in a separate headless Blender (bpy 5.0.1, empty process, no GUI scene touched, nothing saved to any foreign .blend). The v1 source file was written by a slightly newer Blender build (Blender printed a data-loss warning on open). Result of the check: for all 33 v1 clips on both rigs, every keyframe time and value in the new GLBs equals the v1 GLBs (max absolute difference 0.0, no channel shape mismatch).
2. **v1 catalogue not visible.** The published v1 catalogue could not be read in this session. The schema follows Intake 01 section 3 plus the new fields. For the 33 v1 clips `bestVariant`, `ledgeHeightM` and `endsOnTop` (except `kfb_climb_to_top_a`) are null and must be merged from the published v1 catalogue. `label_de` for v1 clips comes from `ml_bake.py`.
3. **Loop metric.** The v1 log measured the pose difference with a max over raw quaternion angles, which reports up to 360 degrees for a small rotation. v2 measures the per-bone angle (0 to 180 degrees) on world rotations. `loopPoseDiffDeg` is therefore the corrected value for all clips. Two v1 values change (kfb_climb_to_top_a 289.7 to 114.3, kfb_dance_thriller_part3_a 337.3 to 104.9); no `loop` flag changes. Loop rule for new clips: difference under 15 degrees. `kfb_locomotion_crouched_sneaking_right_a` is at 14.9 and counts as a loop (borderline).
4. **Facing.** 9 clips face away from the standard front (facingYawDeg close to 180), all from the Action Adventure Pack plus the ladder climb: kfb_climb_climbing_ladder_a, kfb_idle_idle_d, kfb_idle_idle_e, kfb_interaction_cover_to_stand_a, kfb_interaction_cover_to_stand_b, kfb_locomotion_crouched_sneaking_left_a, kfb_locomotion_crouched_sneaking_right_a, kfb_locomotion_left_cover_sneak_a, kfb_locomotion_right_cover_sneak_a. They are not turned; the runtime may need a 180 degree yaw for them.
5. **Root bone.** Horizontal travel sits mainly on the `root` bone (hips follow). `rootBone` is `root` for every clip. In 35 of the new clips hips and root travel differ by more than 1 cm; `travelMetersPerCycle` is the hips travel (as in v1). New clips count as `travel` when the larger of hips or root travel is at least 0.05 m. This turns four clips into `travel` that a hips-only rule would call in-place: kfb_locomotion_spin_in_place_a, kfb_reaction_hard_landing_a, kfb_locomotion_left_turn_90_a, kfb_locomotion_right_turn_90_a.
6. **Duplicates.** `kfb_interaction_unarmed_grab_torch_from_wall_b` and `kfb_dance_hip_hop_b` have rotation channels identical to `_a` (max difference 0) and carry `duplicateOf`. `kfb_locomotion_running_b` and `_c` have the same length and travel (2.262 m) but are not identical; `kfb_locomotion_run_a` (in-place) and `kfb_locomotion_standard_run_a` (travel) have the same length but different rotations, so they are not an in-place pair. No motion was declared an in-place twin.
7. **Falling.** `kfb_reaction_falling_a` starts and stays on the ground (prone) and loops; `kfb_reaction_falling_b` is the real fall.
8. **Excluded.** `Lorekeeper.fbx` (in Action Adventure Pack and Male Locomotion Pack) are characters, not clips.
9. **Contact sheets.** Camera slightly higher than in v1 so the head is not cut off; all 179 sheets (v1 and new) were re-rendered with the same framing. Every new sheet was viewed. No floating, twisted or mirrored retarget was found. Sheets follow the hips, so travel is not visible in them.
10. **No `_ip` twins** were baked (decision of Georg and Coworker); the runtime strips horizontal `rootBone` translation when it wants in-place.

## Verification (numbers from a reimport)

| Check | Rig_Medium | Rig_Large |
|---|---|---|
| Animations in all library GLBs together | 179 | 179 |
| Unique ids | 179 | 179 |
| Catalogue clipCount | 179 | 179 |
| Meshes | 0 in every file | 0 in every file |
| Objects/nodes per file | 24 (23 bones + armature) | 24 |
| v1 clips compared with the v1 GLB | 33, max diff 0.0 | 33, max diff 0.0 |

Every catalogue id has an action in the library of its group and vice versa. Folder budget: libs/Rig_Medium 9 files and 9 MB, libs/Rig_Large 9 files and 9 MB; largest sheets folder is sheets/locomotion (51 files, 17 MB). Every GLB is far below 12 MB (largest 2.5 MB). Sheets total 64 MB; each folder is under 100 files and 25 MB.

## Files

- `libs/Rig_Medium/KFB_Motion_<group>.glb` and `libs/Rig_Large/KFB_Motion_<group>.glb` for the groups action, climb, dance, gesture, idle, interaction, locomotion, music, reaction (armature and actions only; action name = clip id).
- `KFB_Motion_Library.catalog.json` (`kfb.motion-catalog.v1`, sha256 per GLB, `library` per clip).
- `sheets/<group>/<id>.png` (top row Rig_Medium, bottom row Rig_Large, 6 frames).
- `NOTICE.md`, `RETURN.md`, `_work/` (log and scripts; not for GitHub).

## Measured table

Loop-Δ is in the catalogue. Travel is metres per cycle for Rig_Medium / Rig_Large (0 for in-place). The last column is set when the rotation channels equal another clip.

| id | frames | sec | loop | root motion | travel m | facing yaw | duplicateOf |
|---|---|---|---|---|---|---|---|
| kfb_action_baseball_pitching_a | 142 | 4.733 | no | travel | 0.053 / 0.136 | -80.6 |  |
| kfb_action_center_block_a | 54 | 1.8 | yes | in-place | 0.0 / 0.0 | -36.6 |  |
| kfb_action_dribble_a | 53 | 1.767 | yes | travel | 3.293 / 8.453 | 5.3 |  |
| kfb_action_fireball_a | 102 | 3.4 | yes | in-place | 0.0 / 0.0 | -67.1 |  |
| kfb_action_fist_fight_b_a | 141 | 4.7 | no | travel | 0.714 / 1.833 | -28.6 |  |
| kfb_action_flying_kick_a | 46 | 1.533 | no | travel | 1.606 / 4.123 | -2.5 |  |
| kfb_action_headbutt_a | 64 | 2.133 | yes | in-place | 0.0 / 0.0 | -28.2 |  |
| kfb_action_header_soccerball_a | 58 | 1.933 | yes | in-place | 0.0 / 0.0 | -16.4 |  |
| kfb_action_hook_punch_a | 64 | 2.133 | yes | in-place | 0.0 / 0.0 | -36.0 |  |
| kfb_action_illegal_knee_a | 69 | 2.3 | yes | in-place | 0.0 / 0.0 | -36.6 |  |
| kfb_action_kicking_a | 103 | 3.433 | no | travel | 1.619 / 4.156 | 67.4 |  |
| kfb_action_pistol_to_idle_a | 52 | 1.733 | no | travel | 0.099 / 0.254 | 6.5 |  |
| kfb_action_punching_a | 45 | 1.5 | yes | in-place | 0.0 / 0.0 | -2.3 |  |
| kfb_action_quarterback_pass_a | 231 | 7.7 | no | travel | 0.788 / 2.022 | 4.0 |  |
| kfb_action_stabbing_a | 72 | 2.4 | yes | in-place | 0.0 / 0.0 | 41.5 |  |
| kfb_action_swinging_a | 74 | 2.467 | no | travel | 4.206 / 10.796 | -2.9 |  |
| kfb_action_sword_and_shield_attack_a | 40 | 1.333 | no | travel | 2.062 / 5.293 | -0.5 |  |
| kfb_climb_climbing_ladder_a | 24 | 0.8 | yes | in-place | 0.0 / 0.0 | -177.5 |  |
| kfb_climb_edge_slip_a | 75 | 2.5 | no | travel | 0.163 / 0.418 | 3.7 |  |
| kfb_climb_hanging_a | 79 | 2.633 | yes | in-place | 0.0 / 0.0 | -0.4 |  |
| kfb_climb_start_climbing_ladder_a | 62 | 2.067 | no | travel | 0.72 / 1.848 | 6.9 |  |
| kfb_climb_to_top_a | 121 | 4.033 | no | travel | 0.846 / 2.173 | 2.5 |  |
| kfb_climb_up_a | 90 | 3.0 | yes | travel | 0.292 / 0.75 | 1.7 |  |
| kfb_climb_up_b | 48 | 1.6 | yes | travel | 0.151 / 0.389 | 3.0 |  |
| kfb_dance_breakdance_uprock_var_1_a | 64 | 2.133 | yes | in-place | 0.0 / 0.0 | 16.4 |  |
| kfb_dance_chicken_a | 144 | 4.8 | yes | in-place | 0.0 / 0.0 | -2.2 |  |
| kfb_dance_dancing_maraschino_step_a | 98 | 3.267 | yes | in-place | 0.0 / 0.0 | -3.8 |  |
| kfb_dance_dancing_twerk_a | 457 | 15.233 | yes | in-place | 0.0 / 0.0 | 3.0 |  |
| kfb_dance_hip_hop_a | 410 | 13.667 | yes | in-place | 0.0 / 0.0 | -18.7 |  |
| kfb_dance_hip_hop_b | 410 | 13.667 | yes | in-place | 0.0 / 0.0 | -18.7 | kfb_dance_hip_hop_a |
| kfb_dance_hip_hop_c | 414 | 13.8 | yes | in-place | 0.0 / 0.0 | -1.0 |  |
| kfb_dance_hokey_pokey_a | 351 | 11.7 | yes | in-place | 0.0 / 0.0 | -4.2 |  |
| kfb_dance_house_a | 595 | 19.833 | yes | in-place | 0.0 / 0.0 | -46.7 |  |
| kfb_dance_house_b | 595 | 19.833 | yes | in-place | 0.0 / 0.0 | -46.7 |  |
| kfb_dance_jazz_dancing_a | 164 | 5.467 | yes | in-place | 0.0 / 0.0 | 4.9 |  |
| kfb_dance_kip_up_a | 62 | 2.067 | no | travel | 0.31 / 0.795 | 2.2 |  |
| kfb_dance_left_shimmy_a | 42 | 1.4 | yes | travel | 0.255 / 0.654 | 2.7 |  |
| kfb_dance_locking_hip_hop_a | 511 | 17.033 | yes | travel | 0.416 / 1.068 | -6.3 |  |
| kfb_dance_moonwalk_a | 32 | 1.067 | yes | travel | 0.686 / 1.76 | -5.8 |  |
| kfb_dance_northern_soul_spin_a | 122 | 4.067 | yes | in-place | 0.0 / 0.0 | -5.4 |  |
| kfb_dance_samba_a | 717 | 23.9 | yes | in-place | 0.0 / 0.0 | 91.7 |  |
| kfb_dance_slide_hip_hop_a | 520 | 17.333 | yes | in-place | 0.0 / 0.0 | -4.4 |  |
| kfb_dance_step_hip_hop_a | 235 | 7.833 | yes | travel | 1.851 / 4.753 | -20.4 |  |
| kfb_dance_swing_dancing_a | 157 | 5.233 | yes | in-place | 0.0 / 0.0 | -2.5 |  |
| kfb_dance_thriller_part3_a | 768 | 25.6 | no | travel | 2.63 / 6.751 | 11.6 |  |
| kfb_dance_thriller_part_3_a | 768 | 25.6 | no | travel | 2.909 / 7.466 | 11.6 |  |
| kfb_dance_twist_dance_a | 284 | 9.467 | yes | in-place | 0.0 / 0.0 | -36.8 |  |
| kfb_dance_wave_hip_hop_a | 506 | 16.867 | yes | in-place | 0.0 / 0.0 | -3.8 |  |
| kfb_gesture_angry_gesture_a | 99 | 3.3 | yes | in-place | 0.0 / 0.0 | -3.3 |  |
| kfb_gesture_cheering_a | 88 | 2.933 | yes | in-place | 0.0 / 0.0 | -5.6 |  |
| kfb_gesture_clapping_a | 37 | 1.233 | yes | in-place | 0.0 / 0.0 | -5.4 |  |
| kfb_gesture_counting_a | 419 | 13.967 | yes | in-place | 0.0 / 0.0 | -0.8 |  |
| kfb_gesture_dismissing_gesture_a | 68 | 2.267 | yes | in-place | 0.0 / 0.0 | -3.3 |  |
| kfb_gesture_look_over_shoulder_a | 114 | 3.8 | yes | in-place | 0.0 / 0.0 | -6.8 |  |
| kfb_gesture_pointing_a | 106 | 3.533 | yes | in-place | 0.0 / 0.0 | -7.6 |  |
| kfb_gesture_salute_a | 86 | 2.867 | yes | in-place | 0.0 / 0.0 | -1.0 |  |
| kfb_gesture_standing_clap_a | 144 | 4.8 | yes | in-place | 0.0 / 0.0 | 1.0 |  |
| kfb_gesture_standing_greeting_a | 175 | 5.833 | yes | in-place | 0.0 / 0.0 | -5.3 |  |
| kfb_gesture_strong_gesture_a | 58 | 1.933 | yes | in-place | 0.0 / 0.0 | 3.2 |  |
| kfb_gesture_talking_a | 237 | 7.9 | yes | in-place | 0.0 / 0.0 | 14.7 |  |
| kfb_gesture_talking_on_phone_a | 1166 | 38.867 | yes | in-place | 0.0 / 0.0 | 1.0 |  |
| kfb_gesture_taunt_a | 88 | 2.933 | yes | in-place | 0.0 / 0.0 | -37.7 |  |
| kfb_gesture_thoughtful_head_shake_a | 93 | 3.1 | yes | in-place | 0.0 / 0.0 | -3.3 |  |
| kfb_gesture_waving_gesture_a | 45 | 1.5 | yes | in-place | 0.0 / 0.0 | 0.1 |  |
| kfb_gesture_yelling_a | 243 | 8.1 | yes | in-place | 0.0 / 0.0 | -6.8 |  |
| kfb_idle_breathing_a | 299 | 9.967 | yes | in-place | 0.0 / 0.0 | -5.2 |  |
| kfb_idle_breathing_b | 299 | 9.967 | yes | in-place | 0.0 / 0.0 | -5.2 |  |
| kfb_idle_defeat_a | 53 | 1.767 | yes | in-place | 0.0 / 0.0 | -4.4 |  |
| kfb_idle_drunk_idle_variation_a | 120 | 4.0 | yes | in-place | 0.0 / 0.0 | 1.1 |  |
| kfb_idle_happy_a | 89 | 2.967 | yes | in-place | 0.0 / 0.0 | -1.0 |  |
| kfb_idle_idle_a | 112 | 3.733 | yes | in-place | 0.0 / 0.0 | -19.5 |  |
| kfb_idle_idle_b | 301 | 10.033 | yes | in-place | 0.0 / 0.0 | -19.5 |  |
| kfb_idle_idle_c | 98 | 3.267 | yes | in-place | 0.0 / 0.0 | -19.5 |  |
| kfb_idle_idle_d | 77 | 2.567 | yes | in-place | 0.0 / 0.0 | -155.8 |  |
| kfb_idle_idle_e | 65 | 2.167 | yes | in-place | 0.0 / 0.0 | -152.6 |  |
| kfb_idle_idle_f | 247 | 8.233 | yes | in-place | 0.0 / 0.0 | -3.3 |  |
| kfb_idle_injured_a | 281 | 9.367 | yes | in-place | 0.0 / 0.0 | -3.4 |  |
| kfb_idle_kneeling_a | 129 | 4.3 | yes | in-place | 0.0 / 0.0 | 1.2 |  |
| kfb_idle_laughing_a | 312 | 10.4 | yes | in-place | 0.0 / 0.0 | 1.0 |  |
| kfb_idle_lying_down_a | 173 | 5.767 | no | travel | 0.131 / 0.335 | -7.1 |  |
| kfb_idle_mutant_idle_a | 160 | 5.333 | yes | in-place | 0.0 / 0.0 | -0.5 |  |
| kfb_idle_ninja_a | 101 | 3.367 | yes | in-place | 0.0 / 0.0 | 69.1 |  |
| kfb_idle_ninja_b | 276 | 9.2 | yes | in-place | 0.0 / 0.0 | 69.1 |  |
| kfb_idle_offensive_idle_a | 318 | 10.6 | yes | in-place | 0.0 / 0.0 | -8.2 |  |
| kfb_idle_old_man_idle_a | 259 | 8.633 | yes | in-place | 0.0 / 0.0 | -2.0 |  |
| kfb_idle_orc_a | 161 | 5.367 | yes | in-place | 0.0 / 0.0 | -1.3 |  |
| kfb_idle_praying_a | 89 | 2.967 | yes | in-place | 0.0 / 0.0 | -4.1 |  |
| kfb_idle_rejected_a | 145 | 4.833 | yes | in-place | 0.0 / 0.0 | 1.0 |  |
| kfb_idle_sad_a | 85 | 2.833 | yes | in-place | 0.0 / 0.0 | 4.1 |  |
| kfb_idle_sitting_a | 64 | 2.133 | yes | in-place | 0.0 / 0.0 | -1.5 |  |
| kfb_idle_standing_a | 84 | 2.8 | no | travel | 0.052 / 0.134 | -0.5 |  |
| kfb_idle_standing_idle_03_a | 343 | 11.433 | yes | in-place | 0.0 / 0.0 | -52.8 |  |
| kfb_idle_treading_water_a | 91 | 3.033 | yes | in-place | 0.0 / 0.0 | -0.1 |  |
| kfb_idle_unarmed_idle_looking_ver_1_a | 339 | 11.3 | yes | in-place | 0.0 / 0.0 | -2.8 |  |
| kfb_interaction_closing_a | 190 | 6.333 | yes | in-place | 0.0 / 0.0 | -2.1 |  |
| kfb_interaction_cover_to_stand_a | 46 | 1.533 | no | travel | 0.712 / 1.829 | -155.8 |  |
| kfb_interaction_cover_to_stand_b | 43 | 1.433 | no | travel | 0.656 / 1.683 | -152.7 |  |
| kfb_interaction_entry_a | 220 | 7.333 | yes | travel | 0.63 / 1.617 | 0.8 |  |
| kfb_interaction_opening_a | 158 | 5.267 | yes | in-place | 0.0 / 0.0 | -3.7 |  |
| kfb_interaction_opening_a_lid_a | 221 | 7.367 | yes | in-place | 0.0 / 0.0 | -2.2 |  |
| kfb_interaction_opening_door_inwards_a | 192 | 6.4 | yes | travel | 1.193 / 3.063 | -4.6 |  |
| kfb_interaction_pick_fruit_a | 187 | 6.233 | yes | in-place | 0.0 / 0.0 | 2.4 |  |
| kfb_interaction_picking_up_object_a | 104 | 3.467 | no | in-place | 0.0 / 0.0 | -1.9 |  |
| kfb_interaction_pulling_lever_a | 189 | 6.3 | yes | in-place | 0.0 / 0.0 | -1.6 |  |
| kfb_interaction_stand_to_cover_a | 27 | 0.9 | no | travel | 0.721 / 1.85 | -20.2 |  |
| kfb_interaction_stand_to_cover_b | 39 | 1.3 | no | travel | 0.819 / 2.103 | -19.5 |  |
| kfb_interaction_unarmed_grab_torch_from_wall_a | 139 | 4.633 | no | in-place | 0.0 / 0.0 | -1.4 |  |
| kfb_interaction_unarmed_grab_torch_from_wall_b | 139 | 4.633 | no | in-place | 0.0 / 0.0 | -1.4 | kfb_interaction_unarmed_grab_torch_from_wall_a |
| kfb_locomotion_crouch_turn_to_stand_a | 26 | 0.867 | no | travel | 0.408 / 1.048 | 8.7 |  |
| kfb_locomotion_crouched_sneaking_left_a | 39 | 1.3 | yes | travel | 0.886 / 2.276 | -169.0 |  |
| kfb_locomotion_crouched_sneaking_right_a | 33 | 1.1 | yes | travel | 0.814 / 2.09 | 173.9 |  |
| kfb_locomotion_drunk_walk_a | 91 | 3.033 | yes | in-place | 0.0 / 0.0 | 32.0 |  |
| kfb_locomotion_female_walk_a | 36 | 1.2 | yes | travel | 1.011 / 2.595 | 5.1 |  |
| kfb_locomotion_holding_walk_a | 42 | 1.4 | yes | travel | 1.15 / 2.953 | -11.1 |  |
| kfb_locomotion_injured_run_a | 20 | 0.667 | yes | in-place | 0.0 / 0.0 | 3.8 |  |
| kfb_locomotion_injured_walk_backwards_a | 51 | 1.7 | yes | travel | 0.999 / 2.564 | -11.8 |  |
| kfb_locomotion_jog_in_circle_a | 179 | 5.967 | yes | in-place | 0.0 / 0.0 | -3.6 |  |
| kfb_locomotion_jogging_with_box_a | 24 | 0.8 | yes | in-place | 0.0 / 0.0 | -2.4 |  |
| kfb_locomotion_joyful_jump_a | 57 | 1.9 | yes | in-place | 0.0 / 0.0 | 1.4 |  |
| kfb_locomotion_jump_a | 66 | 2.2 | no | in-place | 0.0 / 0.0 | -3.3 |  |
| kfb_locomotion_jumping_up_a | 8 | 0.267 | no | travel | 0.061 / 0.156 | -16.1 |  |
| kfb_locomotion_left_cover_sneak_a | 35 | 1.167 | yes | travel | 0.913 / 2.344 | -169.9 |  |
| kfb_locomotion_left_strafe_a | 21 | 0.7 | yes | travel | 2.051 / 5.264 | 55.8 |  |
| kfb_locomotion_left_strafe_walking_a | 32 | 1.067 | yes | travel | 1.218 / 3.125 | 47.7 |  |
| kfb_locomotion_left_turn_90_a | 29 | 0.967 | no | travel | 0.012 / 0.032 | -4.1 |  |
| kfb_locomotion_left_turn_a | 32 | 1.067 | yes | in-place | 0.0 / 0.0 | -19.5 |  |
| kfb_locomotion_mutant_walking_a | 44 | 1.467 | yes | travel | 1.277 / 3.278 | 12.6 |  |
| kfb_locomotion_right_cover_sneak_a | 34 | 1.133 | yes | travel | 0.882 / 2.264 | 172.7 |  |
| kfb_locomotion_right_strafe_a | 21 | 0.7 | no | travel | 1.955 / 5.017 | -62.2 |  |
| kfb_locomotion_right_strafe_walking_a | 31 | 1.033 | no | travel | 1.176 / 3.019 | -49.5 |  |
| kfb_locomotion_right_turn_90_a | 29 | 0.967 | no | travel | 0.014 / 0.037 | 8.5 |  |
| kfb_locomotion_right_turn_a | 31 | 1.033 | yes | in-place | 0.0 / 0.0 | -19.5 |  |
| kfb_locomotion_run_a | 23 | 0.767 | yes | in-place | 0.0 / 0.0 | 51.3 |  |
| kfb_locomotion_run_backward_a | 19 | 0.633 | yes | travel | 0.8 / 2.054 | 7.7 |  |
| kfb_locomotion_run_forward_a | 23 | 0.767 | yes | travel | 1.564 / 4.014 | 3.2 |  |
| kfb_locomotion_run_forward_arc_left_a | 23 | 0.767 | no | travel | 1.412 / 3.625 | 21.1 |  |
| kfb_locomotion_run_forward_b | 28 | 0.933 | yes | in-place | 0.0 / 0.0 | -1.0 |  |
| kfb_locomotion_run_to_stop_a | 28 | 0.933 | no | travel | 0.601 / 1.542 | 7.8 |  |
| kfb_locomotion_running_a | 39 | 1.3 | yes | travel | 2.571 / 6.599 | -6.3 |  |
| kfb_locomotion_running_b | 22 | 0.733 | yes | travel | 2.262 / 5.807 | 7.8 |  |
| kfb_locomotion_running_c | 22 | 0.733 | yes | travel | 2.262 / 5.807 | 7.8 |  |
| kfb_locomotion_running_jump_a | 28 | 0.933 | yes | travel | 3.03 / 7.779 | -1.8 |  |
| kfb_locomotion_sad_walk_a | 45 | 1.5 | yes | travel | 0.805 / 2.066 | 4.4 |  |
| kfb_locomotion_scary_clown_walk_a | 30 | 1.0 | yes | travel | 0.893 / 2.292 | 8.3 |  |
| kfb_locomotion_skateboarding_a | 66 | 2.2 | yes | travel | 3.385 / 8.689 | -33.4 |  |
| kfb_locomotion_spin_in_place_a | 51 | 1.7 | no | travel | 0.049 / 0.125 | -1.3 |  |
| kfb_locomotion_sprint_backward_a | 16 | 0.533 | yes | travel | 2.469 / 6.339 | 3.5 |  |
| kfb_locomotion_standard_run_a | 23 | 0.767 | yes | travel | 2.204 / 5.657 | -2.5 |  |
| kfb_locomotion_strike_foward_jog_a | 40 | 1.333 | yes | travel | 2.122 / 5.448 | 2.8 |  |
| kfb_locomotion_strut_walking_a | 44 | 1.467 | yes | travel | 0.945 / 2.427 | 4.6 |  |
| kfb_locomotion_treadmill_running_a | 237 | 7.9 | no | travel | 0.079 / 0.204 | -8.9 |  |
| kfb_locomotion_unarmed_jump_a | 71 | 2.367 | yes | in-place | 0.0 / 0.0 | -2.8 |  |
| kfb_locomotion_walk_backward_a | 38 | 1.267 | yes | travel | 0.687 / 1.764 | 0.9 |  |
| kfb_locomotion_walk_to_stop_a | 148 | 4.933 | no | travel | 1.129 / 2.898 | 2.9 |  |
| kfb_locomotion_walking_a | 43 | 1.433 | yes | in-place | 0.0 / 0.0 | 8.2 |  |
| kfb_locomotion_walking_b | 32 | 1.067 | no | travel | 1.17 / 3.003 | 4.4 |  |
| kfb_locomotion_walking_c | 32 | 1.067 | yes | travel | 1.173 / 3.012 | -4.6 |  |
| kfb_locomotion_wheelbarrow_walk_a | 30 | 1.0 | yes | in-place | 0.0 / 0.0 | 5.7 |  |
| kfb_locomotion_zombie_running_a | 25 | 0.833 | yes | in-place | 0.0 / 0.0 | -10.2 |  |
| kfb_music_drums_a | 142 | 4.733 | yes | in-place | 0.0 / 0.0 | 27.2 |  |
| kfb_music_guitar_a | 144 | 4.8 | yes | in-place | 0.0 / 0.0 | -4.0 |  |
| kfb_music_guitar_b | 144 | 4.8 | yes | in-place | 0.0 / 0.0 | -4.0 |  |
| kfb_music_guitar_c | 250 | 8.333 | yes | in-place | 0.0 / 0.0 | -30.1 |  |
| kfb_reaction_death_from_the_front_a | 104 | 3.467 | no | travel | 0.397 / 1.018 | -52.2 |  |
| kfb_reaction_dizzy_idle_a | 134 | 4.467 | yes | in-place | 0.0 / 0.0 | -5.6 |  |
| kfb_reaction_dying_a | 133 | 4.433 | no | travel | 0.283 / 0.726 | -0.3 |  |
| kfb_reaction_fall_flat_a | 77 | 2.567 | no | travel | 1.945 / 4.993 | -1.7 |  |
| kfb_reaction_falling_a | 136 | 4.533 | yes | in-place | 0.0 / 0.0 | 2.2 |  |
| kfb_reaction_falling_b | 342 | 11.4 | no | travel | 1.378 / 3.537 | 14.4 |  |
| kfb_reaction_falling_idle_a | 21 | 0.7 | yes | in-place | 0.0 / 0.0 | -34.1 |  |
| kfb_reaction_falling_to_roll_a | 55 | 1.833 | no | travel | 1.974 / 5.068 | -24.2 |  |
| kfb_reaction_hard_landing_a | 61 | 2.033 | no | travel | 0.01 / 0.026 | -24.2 |  |
| kfb_reaction_reaction_a | 67 | 2.233 | yes | in-place | 0.0 / 0.0 | -51.4 |  |
| kfb_reaction_receiving_an_uppercut_a | 51 | 1.7 | yes | travel | 0.77 / 1.977 | -36.6 |  |
| kfb_reaction_shoved_reaction_with_spin_a | 137 | 4.567 | no | travel | 1.539 / 3.951 | 5.5 |  |
| kfb_reaction_standing_death_left_01_a | 69 | 2.3 | no | travel | 0.479 / 1.228 | -57.2 |  |
| kfb_reaction_standing_react_small_from_right_a | 31 | 1.033 | yes | in-place | 0.0 / 0.0 | -52.8 |  |
| kfb_reaction_sword_and_shield_death_a | 70 | 2.333 | no | travel | 0.518 / 1.33 | -48.5 |  |
| kfb_reaction_zombie_transition_a | 201 | 6.7 | no | travel | 0.155 / 0.397 | -19.0 |  |
