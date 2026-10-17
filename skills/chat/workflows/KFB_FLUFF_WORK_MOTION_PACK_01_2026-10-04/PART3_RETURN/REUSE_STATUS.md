# KFB Fluff Work Motion Pack 01 · Reuse / Gap status after Part 3

- **Date:** 2026-10-04
- **Earlier status:** `../PART2_RETURN/REUSE_STATUS.md`
- **Size rule now:** count stays the Mass Ladder (runtime). The picture is cartoon: work-ball diameter ≈ 2/3 body height.

| Size | Radius |
|---|---|
| Small | 0.20 |
| Medium | 0.723 |
| Large | 1.397 |

The bench/ground work chunks keep their Part 2 sizes.

| Role | After Part 2 | After Part 3 | Clip |
|---|---|---|---|
| roll_push | built (Large leg defect) | rebuilt at new radii, Large clean | `kfb_fluff_roll_push_a` |
| roll_push_heavy | built | rebuilt | `kfb_fluff_roll_push_heavy_a` |
| steer_left / right | built | rebuilt | `kfb_fluff_steer_left_a` / `_right_a` |
| growing ball (Medium on Large ball) | – | **DERIVE, built**; head-in-ball defect | `kfb_fluff_*_big_a` (Rig_Medium only) |
| coop_large_push | NOT_RUN | **runtime placement of `roll_push_big_a`**, measured 2 and 3 workers | no new clip |
| foot_driven_roll | NOT_RUN | **DERIVE, built**; Orc leg defect | `kfb_fluff_foot_roll_a` |
| ball_balance | NOT_RUN | **DERIVE, built** (idle_happy + root lift) | `kfb_fluff_ball_balance_a` |
| ball_dance | NOT_RUN | **DERIVE, built** (twist_dance + root lift) | `kfb_fluff_ball_dance_a` |
| ball_surf | NOT_RUN | **DERIVE, built** (skateboarding_c, travel stripped + root lift) | `kfb_fluff_ball_surf_a` |
| kick | – | KEEP native KayKit + contact event | `Melee_Unarmed_Attack_Kick` / `Melee_Unarmed_Kick` |
| header | – | KEEP + event | `kfb_action_header_soccerball_a` |
| head bonk | – | KEEP + event | `kfb_action_headbutt_a/b` |
| side kick | – | KEEP + FIT + event | `kfb_action_inside_crescent_kick_a` |
| throw | – | KEEP + event | `kfb_throw_frisbee_a` |
| flying kick / goalkeeper throw | – | NOT NEEDED | – |
| merge 6→1 | – | prop reference built | `kfb_fluff_merge_6to1_reference.glb` |
| marbled colour memory | NOT_RUN | look reference (EEVEE) | `FLUFF_MARBLED_LOOK.png` |
| knead_press, collect_debris, place_small, pack_flatten, patch_press, pass_receive, pull_chunk, celebrate, pickup_react | built / kept | unchanged | as Part 2 |

## Gaps

- **NEW CLIP REQUIRED:** none.
- **Possible new authoring, only if Georg rejects the cartoon dent:** a Robot head-up push pose for the Large ball.

## Open decisions for Georg

1. Robot head into the Large ball: dent look vs. new pose.
2. Orc foot_roll leg: accept, or smaller dribble ball for the Orc.
3. Marble: 6 colours vs. 3.
4. Still open from Part 2: forearm sink in the Large knead chunk; per-actor hand offset.
