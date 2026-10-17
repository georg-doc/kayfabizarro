# KFB Fluff Work Motion Pack 01 · Part 3 RETURN · cartoon Sisyphos scale + play set

- **Executor:** Coworker (Blender MCP role, cloud bpy 5.0.1) · 2026-10-04
- **Brief:** `PART3_BRIEF.md`, with Georg's chat updates during the run:
  - "all bigger, Sisyphos in the rig's own size";
  - "irregularly kneaded shape";
  - "about 2/3 body height as diameter".
- **Branch:** `planning/fluff-blender-slice-01-2026-10-04`. Additive, no merge.
- **Replaces:** the Part 2 motion-library delta (same file names, regenerated).

## Defects and open points first

1. **Robot pushing the Large ball: the big chibi head sinks into the ball.** Clips `*_big_a`, ball r 1.40.
   - Measured on Robot One: head 0.38–0.45 m inside the sphere radius. In the renders it reads as the head pressed against the boulder.
   - **Repair 1** (longer reach, lower contact) did not clear the head (0.38–0.50 m) and broke the hand IK (4 cm error, 11° seam jump), so I reverted it.
   - Options:
     - (a) accept it as a cartoon dent: the runtime can dent the clay where the head touches;
     - (b) a separate head-up pose (new authoring).

   **Georg decides.**
2. **Orc foot-roll:** the stepping leg passes 0.19 m into its dribble ball (r 0.39) at frame 18. The Robot is fine (0.04 m).
3. **Steering still reads close to pushing.** Yaw is stripped as before; the runtime yaw rate (±35 °/s) carries the turn.
4. **The marbled 6-colour ball reads loud** (tie-dye). The 3-colour version is calmer. Look decision for Georg.
5. **Two framing nits.** On the size sheet the Robot is cut at the left edge. In the big-ball push previews the camera is tight.
6. **Sizes outside this pass.** The bench/ground work chunks (knead_press / collect_debris) and the one-hand chunks keep their Part 2 sizes. The new 2/3 rule applies to rolled work balls.
7. **Deviations from `PART3_BRIEF.md`:**
   - Radii are 0.20 / 0.723 / 1.397, not the start values 0.13 / 0.48 / 0.92 (Georg's chat direction).
   - The catalogue patch is the regenerated `patch_fluff01.json` (replaces the Part 2 file), not a new `patch_fluff02`. Part 2's patch was never applied, so one patch per library file stays simpler.
   - Orc ball rides: legs dip 0.07–0.12 m into the lumpy top. This is minor and reads as standing in soft clay.
8. **NOT_RUN:**
   - KFB runtime check;
   - Production Control checkpoint (tools not connected in this session).

## Size rule (now in the catalogue patch)

**Count rule (runtime, unchanged):** 6 Small = 1 Medium; 3 Medium = 1 Large.

**Visual rule (cartoon):** work-ball diameter ≈ 2/3 of the carrier's body height.

| Size | Radius | Who |
|---|---|---|
| Small | 0.20 m | Life-Tree fruit; header / throw / Robot dribble |
| Medium | 0.72 m | Rig_Medium work ball (Robot / Skeleton Sisyphos) |
| Large | 1.40 m | Rig_Large work ball (Orc Sisyphos), or 2–3 Rig_Medium as a team |

**Shape:** an irregular kneaded lump (low-frequency lumps, 2–5 thumb dents, slight squash). The builder is `scripts/knead.py`.

**Merging is a cartoon gag, not volume.** 6 Small roll together, squash into one lump, POP, and a marbled Medium puffs up like rising dough (`kfb_fluff_merge_6to1_reference`).

## What is in the library (`KFB_Motion_fluff01.glb`)

**Rig_Medium: 17 clips. Rig_Large: 13 clips.**

**Push / steer (Sisyphos):**
- `roll_push_a`, `roll_push_heavy_a`, `steer_left_a`, `steer_right_a`: on each rig's own work ball (M 0.72 / L 1.40).
- **Growing ball, Rig_Medium only:** the same four as `*_big_a` on the Large ball (1.40). The runtime blends `_a` ↔ `_big_a` by the current ball radius. Hands stay on the surface at both ends (IK ≤ 0.008 m).
- **Team push:** `roll_push_big_a` placed around one Large ball.
  - 3 workers at 0 / ±48°: closest actor-to-actor gap 0.30 m.
  - 2 workers at ±26°: gap 0.37 m.
  - All hands on the ball.

**Ball tricks (derived, root lift baked so the feet stand on the ball top; the runtime moves the ball and puts the actor root at the ball's ground point):**

| Clip | Donor | Fit |
|---|---|---|
| `ball_surf_a` | skateboarding_c, travel stripped | feet within 0.02 m (M) / 0.08 m (L) of the top |
| `ball_balance_a` | idle_happy | – |
| `ball_dance_a` | twist_dance | – |
| `foot_roll_a` | happy_walk, travel stripped | toe contact events at frames 7 and 23 |

**Work, unchanged from Part 2:** knead_press, collect_debris, place_small, pack_flatten, patch_press.

## Play set: existing clips, no new animation, contact events in the catalogue

| Play | Clip | Decision | Ball |
|---|---|---|---|
| Kick | **KayKit native** `Melee_Unarmed_Attack_Kick` (M) / `Melee_Unarmed_Kick` (L) | KEEP. Toe meets the ball at frame 12 (M) / 19 (L) | own work ball |
| Header | `kfb_action_header_soccerball_a` | KEEP + FIT. Head contact frame 27 | Small |
| Head bonk | `kfb_action_headbutt_a/b` | KEEP + FIT. Contact frame 16/17 and 14 | own work ball |
| Side kick | `kfb_action_inside_crescent_kick_a` | KEEP + FIT. Frame 37/38 | own work ball |
| Throw | `kfb_throw_frisbee_a` | KEEP + FIT. Release frame 39 | Small |
| Flying kick | `kfb_action_kicking_a` | NOT NEEDED. Acrobatic, travels into the ball | – |
| Goalkeeper throw | `kfb_throw_goalkeeper_overhand_a` | NOT NEEDED. Run-up / dive; frisbee covers throwing | – |

## Files

| File | What |
|---|---|
| `motion_library_delta/libs/Rig_Medium/KFB_Motion_fluff01.glb`, `.../Rig_Large/...` | library (replaces Part 2) |
| `motion_library_delta/KFB_Motion_Library.catalog.patch_fluff01.json` | patch: clips + sizeRule + playEvents |
| `PART3_FLUFF_SIZES.png` | S/M/L kneaded balls next to Robot One, Skeleton Minion, Orc Brute |
| `PART3_PUSH_SISYPHOS_MEDIUM_LARGE.png` + `PART3_PUSH_SISYPHOS.mp4` | push/steer, Medium + Large + growing ball |
| `PART3_COOP_LARGE_BALL.png` | 2 and 3 workers on one Large ball |
| `PART3_PLAY_CONTACTS.png` | header / bonk / kicks / throw at the contact frame |
| `PART3_BALL_RIDE.png` | surf / balance / dance on the ball, foot-roll |
| `FLUFF_MARBLED_LOOK.png` | marbled merged balls (6- and 3-colour) + kneaded smalls (EEVEE, K1 material values) |
| `kfb_fluff_merge_6to1_reference.glb` / `.mp4` / `MERGE_6TO1_STRIP.png` / `merge_6to1_timing.json` | merge prop reference |
| `part3_metrics.json`, `TEST_REPORT.md`, `REUSE_STATUS.md` | evidence |
| `scripts/` | rebuild |

**Next gate:** `FLUFF_BUILDING_ASSEMBLY_KIT_01_RUNTIME_CONSUMER_PROOF`.
