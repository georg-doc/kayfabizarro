# KFB Fluff Work Motion Pack 01 · Part 3 · Delta brief (cartoon scale + play set)

- **Date:** 2026-10-04
- **Approved by:** Georg in chat.
- **Branch:** `planning/fluff-blender-slice-01-2026-10-04`. Base head `fed7254`.
- **Scope:** this file replaces nothing in `START_HERE.md`. It only adds the deltas below.
- **Unchanged:** Part 1 and Part 2 returns stay valid unless a line here changes them.

## Decision: count logic and visual size are separate

**The runtime counts.** The Fluff Mass Ladder stays the economy rule:
- 6 Small = 1 Medium;
- 3 Medium = 1 Large;
- 18 Small = 1 Large.

**The picture is cartoon logic.** Fluff puffs up when it is kneaded together, like rising dough. Visual size is chosen per carrier and does not follow volume.

| Size | Visual radius (start value) | Read |
|---|---|---|
| Small | ≈ 0.13 m | Life-Tree fruit, hand-sized |
| Medium | ≈ 0.48 m (0.22 × Medium body height 2.17 m) | one Robot / Skeleton work ball |
| Large | ≈ 0.92 m (0.22 × Orc Brute height 4.19 m) | one Orc, or the Sisyphos ball for 2–3 Medium workers |

Georg decides the final look from the renders.

## Deliverables (checkable)

1. **Size sheet.** Small / Medium / Large balls next to Robot One, Skeleton Minion and Orc Brute, with radii written on the sheet.
2. **Merge prop reference.** `kfb_fluff_merge_6to1_reference`: 6 Small balls roll together → squash cluster → POP → one Medium ball, marbled in the source colours. Prop-only glb + video + timing json (frames of gather, squash, pop, settle). Runtime keeps the conversion logic.
3. **Large push back on the Large ball.**
   - Rig_Large `roll_push`, `roll_push_heavy`, `steer_left`, `steer_right` re-solved for r 0.92. Leg-in-ball ≤ 0.05 m measured on the Orc mesh.
4. **Growing-ball support (Katamari-Sisyphos).**
   - Rig_Medium push and steer clips are baked at two radii: 0.48 (Medium) and 0.92 (Large).
   - The runtime blends the two by the current ball radius.
   - The hands stay on the ball surface at both radii (IK error ≤ 0.01 m).
5. **Coop pose reference.**
   - 2 and 3 Robots push one Large ball, using the Medium big-ball push placed around the ball.
   - Measured: no actor-actor overlap, all hands on the ball.
6. **Play set (reuse first).**
   - Audition the existing library clips for ball play:
     - `kfb_action_header_soccerball_a`
     - `kfb_action_kicking_a`
     - `kfb_action_inside_crescent_kick_a`
     - `kfb_action_headbutt_a/b`
     - `kfb_throw_frisbee_a`
     - `kfb_throw_goalkeeper_overhand_a`
     - `kfb_locomotion_skateboarding_a/b/c` (ball-surf donor)
     - an idle / dance clip on top of the ball (ball balance)
   - Each kept clip gets a decision (KEEP / KEEP + FIT / DERIVE / NOT NEEDED). Each also gets a **contact event**: frame, body part, contact point and suggested ball size.
   - For balance / surf: foot contact on the ball top and the root lift the runtime must apply.
7. **Marbled Fluff look.** Two or three palette colours swirled in one ball, from the K1 material values. EEVEE render.
8. **Catalogue patch.** `KFB_Motion_Library.catalog.patch_fluff02.json`: new or derived clips plus contact events for play clips.

## Still true

- Pickup = walk over + POP. No bend-down.
- The runtime owns root motion, ball translation and rotation, gravity, and the count logic.
- No new clip where derive / fit / retarget is enough.
- No merge, no Live.
- Local changes on `work/hub-ctrl-01-2026-09-24` stay untouched.

**Next gate:** `FLUFF_BUILDING_ASSEMBLY_KIT_01_RUNTIME_CONSUMER_PROOF`
