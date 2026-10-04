# KFB Fluff Work Motion Pack 01 · Part 2 RETURN

- **Executor:** Coworker (Blender MCP role, cloud bpy 5.0.1) · 2026-10-04
- **Branch:** `planning/fluff-blender-slice-01-2026-10-04`. Additive only, no merge.
- **Decisions applied:**
  - G4 = Option A, Production Control `c948e155-3a33-4876-a987-525dc938b754`: Rig_Large works with a larger work chunk, radius ≈ 0.22 × body height, and gets no arm-in correction.
  - Low Fluff = Part 2 visual baseline only.
- **Status:** Part 2 complete as motion and prop evidence. **Stop here.** The next gate is the runtime consumer.

## Defects and open points first

1. **G4 on Large: the 0.22 H chunk hits the body.** Placed at the hand midpoint (the plain Option A reading), the chunk pushes 0.38 m into the Orc's belly (knead) and 0.19 m into the shoulder pad (collect).
   - **Repair 1:** move the chunk forward 0.39 m (knead) and 0.37 m (collect). The body is then clear (≤ 0.01 m), but the forearms sink up to 0.25 m into the knead chunk.
   - It reads as gripping soft Fluff (`PART2_WORK_G4_G5_MEDIUM_LARGE.png`). **Georg decides the look.**
   - No arm change was made.
2. **Contact depends on the actor's hand mesh.** The ball is placed for the shared skeleton:
   - Robot fists sink a little (up to 0.14 m, the spherical fists);
   - Skeleton Minion's thin hands stop just short.

   A per-actor hand offset is a runtime detail. It was not built.
3. **steer_left / steer_right are made loopable.** The donor `turn_a` is a non-looping turn.
   - Seam: 4° worse than the largest normal foot step.
   - Feet dipped up to 2 cm under the floor after the loop blend; fixed by lifting the root.
   - Both turn donors turn left, so steer_right is the exact mirror.
   - **The steering itself barely shows in the clip.** With yaw stripped as briefed, steer_left/right differ from roll_push mainly in the step pattern and the stronger lean (28° vs 16°). The turn comes from the runtime yaw rate (±35 °/s).
   - If the stills/video read too similar to push once the yaw is in, a small constant bank/twist into the turn (about 5–8°) would be the next edit. **Not built.**
4. **Paired give/receive: the robots' big heads come within a few centimetres** at the root distance where the hands meet (1.149 m Medium). The handover lines up to 1–3 cm.
5. **One-hand roles (G5) were previewed with a small chunk** (0.09 H on both rigs), not 0.22 H. The decision text names 0.22 H for the large two-hand work piece; for "place_small" I kept the piece small. **This is my reading; please confirm.**
6. **Push contact height is a reading of "hands on the ball centre".** Palms sit on the ball's back 20° above the equator and are aimed at the centre. With a 0.22 H ground ball, contact exactly at equator height would need a crouch.
7. **NOT_RUN:**
   - KFB runtime check.
   - Production Control checkpoint (the tools are not connected in this session).

## Result

| Gap | Clip ids (both rigs) | How | Status |
|---|---|---|---|
| G1 | `kfb_fluff_roll_push_a` | `wheelbarrow_walk_a` legs, root and rhythm kept; arms IK onto the ball back, palms aimed at the centre; donor lean 16° kept | DONE |
| G2 | `kfb_fluff_roll_push_heavy_a` | `wheelbarrow_walk_b` with travel stripped, 0.74× speed, donor lean 27°, G1 arms | DONE |
| G3 | `kfb_fluff_steer_left_a`, `kfb_fluff_steer_right_a` | `turn_a`: travel and yaw drift stripped, 8-frame loop crossfade, G1 arms; right = mirror | DONE |
| G4 | `kfb_fluff_knead_press_a`, `kfb_fluff_collect_debris_a` | Medium: native KayKit (Working_B / Digging). Large: plain retarget, 0.22 H chunk | DONE, see defect 1 |
| G5 | `kfb_fluff_place_small_a`, `kfb_fluff_pack_flatten_a`, `kfb_fluff_patch_press_a` | Medium: native (Interact / Working_A / Work_A). Large: plain retarget | DONE |

- **NEW CLIP REQUIRED:** none. No transition clip, no bend-down pickup.
- **Root motion:** in place on every clip. The catalogue gives the runtime root speed (measured from the stance foot, so no foot slide) and, for steering, the yaw rate.

## Files

| File | What |
|---|---|
| `motion_library_delta/libs/Rig_Medium/KFB_Motion_fluff01.glb` | 9 clips, skeleton-only, same layout as the existing libraries |
| `motion_library_delta/libs/Rig_Large/KFB_Motion_fluff01.glb` | 9 clips, skeleton-only |
| `motion_library_delta/KFB_Motion_Library.catalog.patch_fluff01.json` | catalogue patch (append-only, +9 clips). Per clip: frames, loop, seam, foot contacts, donor, workpiece size/centre, hand-to-workpiece distance, runtime speed/yaw |
| `PART2_PUSH_STEER_MEDIUM_LARGE.png` | G1–G3: Robot One vs Orc Brute, side + three-quarter |
| `PART2_WORK_G4_G5_MEDIUM_LARGE.png` | G4/G5 with workpieces |
| `PART2_FLUFF_CLIPS_MEDIUM_LARGE.mp4` | all 9 clips, Medium and Large side by side, 15 fps |
| `PART2_PAIR_GIVE_RECEIVE.png` / `.mp4` | paired give/receive, Medium and Large |
| `PART2_CREW_ROBOT2_SKELETON.png` | Robot Two and Skeleton Minion playing the new clips |
| `part2_metrics.json` | contact, penetration, pair alignment |
| `TEST_REPORT.md` | all measurements |
| `REUSE_STATUS.md` | updated gap / reuse status |
| `scripts/` | rebuild |

**Integration path (not done here):**
- Copy `libs/*/KFB_Motion_fluff01.glb` to `media/3D_Assets/Animations/KFB_Motion_Library/libs/<rig>/`.
- Apply the catalogue patch next to `patch_an01` and `patch_duel01`.
- WSA decides where and when.

**Next gate (one):** `FLUFF_BUILDING_ASSEMBLY_KIT_01_RUNTIME_CONSUMER_PROOF`.
