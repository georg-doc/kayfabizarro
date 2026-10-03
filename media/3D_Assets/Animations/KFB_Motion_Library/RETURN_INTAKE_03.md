# RETURN · KFB Animation Intake 03 · Motion Library v3 · 2026-09-28

Scope: index, convert and normalise only; no motion was edited by hand. 25 new Mixamo clips (talk, throw and four others) on Rig_Medium and Rig_Large, with the unchanged v1/v2 pipeline (`ml_bake.py` exact transfer, v2 loop and facing metrics, v2 sheet framing). The library is additive: **every v2 file stays byte-identical and untouched**; the catalogue grows from 179 to 204 clips.

## Defects and open points (read first)

1. **Tooling.** Headless Blender in the cloud session (bpy 5.0.1, empty process, nothing saved to any foreign .blend). Source rigs from `MOTION_LIB/KFB_MOTION_LIBRARY_01.blend` (Blender warned that the file was written by a newer build, as in Intake 02). The new GLBs have the same 24 nodes, bone names and rest pose as the v2 GLBs (max difference 0.0).
2. **Supplement files.** Four clips belong to existing groups (action, locomotion, reaction). The v2 group GLBs were not rebuilt, so that no v2 motion could change. Those four clips live in `KFB_Motion_<group>_i03.glb`; the catalogue `library` field points every clip to its file. A later consolidation can merge them into the group files if Georg wants one file per group.
3. **Two new groups:** `talk` (11 clips) and `throw` (10 clips).
4. **Release markers (throw).** For the prop throws there is a measured candidate: `events.release`, the frame of peak world speed of the faster hand (Rig_Medium). It is a candidate for the Brick Fish toss (PR #254 asks for measured release markers) and must be confirmed in the runtime. `kfb_throw_run_and_throw_a` throws with the left hand; all others use the right.
5. **Shoulder throw** (aggressor and victim) is a two-person grapple, not a prop throw. The two clips carry `pairedWith`. The aggressor faces about 180 degrees away (`facingYawDeg` -159.3).
6. **Loop flag.** It means "first and last pose match" (under 15 degrees, v2 per-bone metric). Several one-shot clips (throw, run and throw) therefore read `loop: true`. `kfb_throw_run_and_throw_a` travels 6.5 m / 16.6 m and should be played once.
7. **Seated clips.** `kfb_talk_meeting_a` and `kfb_talk_sitting_a` need a seat; the pelvis stays at seat height.
8. **No duplicates.** The rotation channels of all 25 clips were compared pairwise and no pair is identical. `Throwing` and `Throwing Dice` are different clips.
9. **Contact sheets.** All 25 were rendered with the v2 framing and every one was viewed. No floating, twisted or mirrored retarget was found.
10. **Raw FBX** stay in Dropbox `_inbox/` and never go to GitHub.

## Verification

- Each rig has 25 animations across 5 files, 0 meshes, 0 skins, 24 nodes per file. Node names and rest transforms equal the v2 `KFB_Motion_gesture.glb` (max difference 0.0).
- Catalogue: 204 clips, 204 unique ids, sha256 per new GLB in `libraries`. Every new id has an action in its file and vice versa (checked at export).

## New files

| file | clips | bytes | sha256 |
|---|---|---|---|
| libs/Rig_Medium/KFB_Motion_reaction_i03.glb | 1 | 51988 | 1ee75dcc8faec37a… |
| libs/Rig_Large/KFB_Motion_reaction_i03.glb | 1 | 52196 | 364fd79daf75bef5… |
| libs/Rig_Medium/KFB_Motion_action_i03.glb | 1 | 81116 | 9f2b1c0ecc0df982… |
| libs/Rig_Large/KFB_Motion_action_i03.glb | 1 | 80920 | 1fe8741eebd8690b… |
| libs/Rig_Medium/KFB_Motion_locomotion_i03.glb | 2 | 289792 | 9a249d0434b56501… |
| libs/Rig_Large/KFB_Motion_locomotion_i03.glb | 2 | 289452 | 2d342a4275211e70… |
| libs/Rig_Medium/KFB_Motion_talk.glb | 11 | 1822696 | 094b0d3e3b493a88… |
| libs/Rig_Large/KFB_Motion_talk.glb | 11 | 1824008 | dae5ffc1e97e4410… |
| libs/Rig_Medium/KFB_Motion_throw.glb | 10 | 535048 | 04e7f7a48931c085… |
| libs/Rig_Large/KFB_Motion_throw.glb | 10 | 535948 | e5212a7510981cd8… |

`sheets/<group>/<id>.png` for the 25 clips (talk 11, throw 10, action 1, locomotion 2, reaction 1).

## Measured table

Travel is metres per cycle, Rig_Medium / Rig_Large. Release is the measured candidate frame and hand.

| id | label_de | source | frames | sec | loop (Δ°) | root motion | travel m | facing yaw | release |
|---|---|---|---|---|---|---|---|---|---|
| kfb_reaction_agony_a | Qualvoll leiden | Agony.fbx | 121 | 4.033 | yes (0.0) | in-place | 0.0 / 0.0 | 24.7 |   |
| kfb_action_casting_spell_a | Zauber wirken | Casting Spell.fbx | 232 | 7.733 | yes (0) | in-place | 0.0 / 0.0 | -88.8 |   |
| kfb_locomotion_catwalk_walk_a | Laufsteg-Gang | Catwalk Walk.fbx | 460 | 15.333 | yes (0.1) | in-place | 0.0 / 0.0 | 1.3 |   |
| kfb_locomotion_walk_in_circle_a | Im Kreis gehen | Walk In Circle.fbx | 522 | 17.4 | yes (0.1) | in-place | 0.0 / 0.0 | 11.4 |   |
| kfb_talk_meeting_a | Besprechung (sitzend am Tisch) | Having A Meeting, Male.fbx | 1401 | 46.7 | yes (0.0) | in-place | 0.0 / 0.0 | 5.8 |   |
| kfb_talk_sitting_a | Im Sitzen reden | Sitting Talking.fbx | 1323 | 44.1 | yes (0.1) | in-place | 0.0 / 0.0 | -8.1 |   |
| kfb_talk_arguing_a | Im Stehen streiten | Standing Arguing.fbx | 625 | 20.833 | yes (0.1) | in-place | 0.0 / 0.0 | -8.7 |   |
| kfb_talk_arguing_b | Im Stehen streiten | Standing Arguing (1).fbx | 625 | 20.833 | yes (0.1) | in-place | 0.0 / 0.0 | -1.0 |   |
| kfb_talk_talking_a | Reden | Talking (4).fbx | 151 | 5.033 | yes (0) | in-place | 0.0 / 0.0 | -20.6 |   |
| kfb_talk_talking_b | Reden | Talking (5).fbx | 176 | 5.867 | yes (0) | in-place | 0.0 / 0.0 | 24.8 |   |
| kfb_talk_talking_c | Reden | Talking (6).fbx | 118 | 3.933 | yes (0.0) | in-place | 0.0 / 0.0 | -5.6 |   |
| kfb_talk_talking_d | Reden | Talking (7).fbx | 219 | 7.3 | yes (0.0) | in-place | 0.0 / 0.0 | 14.2 |   |
| kfb_talk_talking_e | Reden | Talking (8).fbx | 309 | 10.3 | yes (0.1) | in-place | 0.0 / 0.0 | 0.8 |   |
| kfb_talk_talking_f | Reden | Talking (9).fbx | 135 | 4.5 | yes (0.0) | in-place | 0.0 / 0.0 | -4.2 |   |
| kfb_talk_watercooler_a | Plausch am Wasserspender | Talking At Watercooler.fbx | 1338 | 44.6 | yes (1.2) | in-place | 0.0 / 0.0 | -30.8 |   |
| kfb_throw_throw_a | Werfen | Throw.fbx | 67 | 2.233 | yes (0.1) | in-place | 0.0 / 0.0 | -5.0 | 27 hand.r |
| kfb_throw_throwing_a | Werfen (Schwung) | Throwing.fbx | 168 | 5.6 | no (87.7) | travel | 0.529 / 1.357 | 8.7 | 50 hand.r |
| kfb_throw_dice_a | Würfeln | Throwing Dice.fbx | 170 | 5.667 | yes (0.0) | in-place | 0.0 / 0.0 | -0.7 | 83 hand.r |
| kfb_throw_frisbee_a | Frisbee werfen | Frisbee Throw.fbx | 100 | 3.333 | yes (0.0) | in-place | 0.0 / 0.0 | -66.3 | 40 hand.r |
| kfb_throw_goalie_a | Torwart-Abwurf | Goalie Throw.fbx | 116 | 3.867 | no (78.7) | travel | 0.814 / 2.089 | 1.6 | 51 hand.r |
| kfb_throw_goalkeeper_overhand_a | Torwart-Überkopfwurf | Goalkeeper Overhand Throw.fbx | 86 | 2.867 | no (47.8) | travel | 2.702 / 6.935 | -6.3 | 44 hand.r |
| kfb_throw_grenade_a | Granatenwurf (Überkopf) | Grenade Throw.fbx | 246 | 8.2 | yes (0.2) | in-place | 0.0 / 0.0 | -15.9 | 102 hand.r |
| kfb_throw_run_and_throw_a | Anlauf und Wurf | Run And Throw Grenade.fbx | 89 | 2.967 | yes (0.0) | travel | 6.463 / 16.591 | 19.4 | 53 hand.l |
| kfb_throw_shoulder_aggressor_a | Schulterwurf (Werfer) | Shoulder Throw, Aggressor.fbx | 201 | 6.7 | no (69.0) | travel | 3.023 / 7.761 | -159.3 | 59 hand.r |
| kfb_throw_shoulder_victim_a | Schulterwurf (Geworfener) | Shoulder Throw, Victim.fbx | 201 | 6.7 | no (148.5) | travel | 1.102 / 2.829 | 33.9 |   |
