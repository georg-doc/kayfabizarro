# KFB Fluff Work Motion Pack 01 · Part 3 · TEST REPORT

- **Executor:** Coworker (cloud bpy 5.0.1 + numpy glTF evaluator) · 2026-10-04
- **Branch:** `planning/fluff-blender-slice-01-2026-10-04`
- **Space:** clip space as in Part 2 (+Y up, actor faces +Z, metres).
- **Body heights H:** Rig_Medium 2.17, Rig_Large 4.19.
- **Radii:** Small 0.20, Medium 0.723 (H_M / 3), Large 1.397 (H_L / 3).
- **Raw numbers:** `part3_metrics.json`.

## 0 · Deviations from the Part 3 brief

| Brief | Done | Why |
|---|---|---|
| Start radii S 0.13 / M 0.48 / L 0.92 | S 0.20 / M 0.723 / L 1.397 | Georg in chat: "bigger, Sisyphos in the rig's size", "about 2/3 body height as diameter" |
| Leg-in-ball limit on Large push measured at r 0.92 | measured at r 1.397 | same |
| Growing ball baked at 0.48 and 0.92 | baked at 0.723 and 1.397 | same |
| New file `catalog.patch_fluff02.json` | `catalog.patch_fluff01.json` regenerated (17 / 13 clips) | the Part 2 patch was never applied; one patch per library file is cleaner than a patch on a patch. Replaces the Part 2 file of the same name |
| Spheres | irregular kneaded lumps | Georg in chat ("unregelmäßig geknetet"); contact math stays on the sphere radius, lumps ±13 % |

## 1 · Library round trip

| Check | Result |
|---|---|
| `KFB_Motion_fluff01.glb` Rig_Medium | 17 clips, 1 193 660 bytes, sha256 `24233e1c…a4cf` |
| `KFB_Motion_fluff01.glb` Rig_Large | 13 clips, 1 014 012 bytes, sha256 `5331fda7…1ac` |
| Layout | skeleton-only, 24 nodes, same as Part 2 / existing libraries |
| Actors bind and play (Robot One, Robot Two, Skeleton Minion, Orc Brute) | PASS (renders) |
| Mirror: steer_right = steer_left mirrored (both radii) | PASS |

## 2 · Push / steer at the new radii

Contact is 20° above the equator; palms aimed at the centre. If the arms cannot reach, the contact falls back down in 5° steps.

| Clip | Rig | Ball r | Contact elev | IK hand error | Palm→centre | Seam excess | Runtime speed |
|---|---|---|---|---|---|---|---|
| roll_push_a | M | 0.723 | 20° | 0.004 m | 22.8° | 0.0° | 1.09 m/s |
| roll_push_heavy_a | M | 0.723 | 20° | 0.001 m | 5.5° | 0.0° | 0.83 m/s |
| steer_left/right_a | M | 0.723 | 20° | 0.001 m | 9.5° | 4.0° (foot) | 0.96 m/s, ±35.2 °/s |
| roll_push_a | L | 1.397 | 20° | 0.008 m | 19.1° | 0.0° | 2.74 m/s |
| roll_push_heavy_a | L | 1.397 | 20° | 0.002 m | 6.7° | 1.1° | 2.07 m/s |
| steer_left/right_a | L | 1.397 | 20° | 0.002 m | 7.4° | 4.0° (foot) | 2.52 m/s, ±35.2 °/s |
| roll_push_big_a | M | 1.397 | 5° | 0.000 m | 0.2° | 0.0° | 1.09 m/s |
| roll_push_heavy_big_a | M | 1.397 | 0° | 0.000 m | 0.1° | 0.6° | 0.83 m/s |
| steer_left/right_big_a | M | 1.397 | 0° | 0.000 m | 1.0° | 4.0° (foot) | 0.96 m/s, ±35.2 °/s |

**Growing ball:** both ends keep the hands on the surface (IK ≤ 0.008 m). Requirement ≤ 0.01 m: **PASS**.

## 3 · Mesh penetration (body vertices inside the sphere, arms excluded)

| Actor | Clip | Ball r | Max inside | Where | Status |
|---|---|---|---|---|---|
| Robot One | roll_push_a | 0.723 | 0.000 | – | PASS |
| Robot One | roll_push_heavy_a | 0.723 | 0.028 | head, f6 | PASS (≤ 0.05) |
| Robot One | steer_a | 0.723 | 0.007 | head | PASS |
| **Robot One** | **roll_push_big_a** | 1.397 | **0.376** | head, f12 | **FAIL** |
| **Robot One** | **roll_push_heavy_big_a** | 1.397 | **0.451** | head, f18 | **FAIL** |
| **Robot One** | **steer_big_a** | 1.397 | **0.398** | head, f6 | **FAIL** |
| Orc Brute | push / heavy / steer | 1.397 | 0.000 | – | PASS (Part 2 leg defect gone) |
| Robot One | ball_surf / balance / dance (on top) | 0.723 | ≤ 0.009 | legs | PASS |
| Orc Brute | ball_surf | 1.397 | 0.121 | right leg, f12 | minor |
| Orc Brute | ball_balance | 1.397 | 0.069 | right leg | minor |
| Orc Brute | ball_dance | 1.397 | 0.123 | left leg, f218 | minor |
| Robot One | foot_roll_a | 0.20 | 0.044 | left leg | PASS |
| **Orc Brute** | **foot_roll_a** | 0.386 | **0.194** | right leg, f18 | **FAIL** (at r 0.723 it was 0.387) |

**Robot `_big` head, repair 1:** reach × 1.09 and a lower contact. Result 0.38–0.50 m inside, hand IK error 4 cm, steer seam 11.4°. Worse, so reverted (`penetration_footRollFix_Medium` in the metrics holds those values). Stopped there.

**Why the head hits:** the Robot's chibi head reaches the front of the body further than the hands do. On a ball whose radius is 64 % of the body height, a leaning push puts the head into the ball's upper back.

## 4 · Ball rides (actor on the ball top)

The root lift is baked per frame so the lower foot sits on the ball top. The runtime puts the actor root at the ball's ground point.

| Clip | Rig | Root lift | Foot-to-top gap max | Seam |
|---|---|---|---|---|
| ball_surf_a | M | 1.347–1.353 | 0.020 | 0.0° |
| ball_balance_a | M | 1.402–1.411 | 0.022 | 0.0° |
| ball_dance_a | M | 1.402–1.425 | 0.088 | 0.0° |
| ball_surf_a | L | 2.553–2.567 | 0.082 | 0.0° |
| ball_balance_a | L | 2.676–2.713 | 0.043 | 0.0° |
| ball_dance_a | L | 2.678–2.754 | 0.333 (step-up frames) | 0.0° |
| foot_roll_a | M / L | in place, toe events f7 / f23 | – | 0.0° |

Renders of the kneaded ball are z-stretched to height 2R (`topfit`), so the feet meet the lumpy top.

## 5 · Coop on one Large ball (r 1.397, `roll_push_big_a`)

| Setup | Angles | Phase offset | Min actor-actor gap | Hand to ball |
|---|---|---|---|---|
| 2 Robots | ±26° | 0 / 9 frames | 0.371 m | +0.043 m (handslot-to-palm offset; palms on the surface) |
| 3 Robots | 0 / −48 / +48° | 0 / 9 / 17 frames | 0.302 m | +0.043 m |

No actor-actor overlap: **PASS**. The head-in-ball defect from §3 applies to each worker.

## 6 · Play set contact events

**How the frames were found:**
- Kick: the frame where the fastest forward-moving toe is below ball height.
- Header / bonk: head extreme along hitDir.
- Throw: wrist speed peak.
- Placement: the ball touches the part's outer surface along hitDir.

| Clip | Rig M frame / part | Speed | Decision |
|---|---|---|---|
| KayKit `Melee_Unarmed_Attack_Kick` | f12 toes.r (L `Melee_Unarmed_Kick` f19) | 3.1 m/s (L 15.5) | KEEP native |
| `kfb_action_header_soccerball_a` | f27 head | 1.0 m/s | KEEP, Small ball |
| `kfb_action_headbutt_a` / `_b` | f16 / f14 head | 2.4 / 3.1 m/s | KEEP, bonk own ball |
| `kfb_action_inside_crescent_kick_a` | f37 toes.r | 7.5 m/s | KEEP + FIT |
| `kfb_throw_frisbee_a` | f39 hand.r release | 6.7 m/s | KEEP, Small ball |
| `kfb_action_kicking_a` | f49 toes.r | 9.7 m/s, travels | NOT NEEDED |
| `kfb_throw_goalkeeper_overhand_a` | f44 hand.r | 11.2 m/s, travels | NOT NEEDED |

All events are in `playEvents` in the catalogue patch.

## 7 · Merge 6→1 prop reference

| Phase | Frames |
|---|---|
| gather | 1–26 |
| squash | 26–34 |
| POP | 36 |
| puff stretch 1.25 | 39 |
| land squash 0.86 | 42 |
| settle | 56 |
| end | 64 |

- **Small r:** 0.20 → Medium r 0.723.
- **Glb:** prop only, 957 548 bytes. Previewed in `kfb_fluff_merge_6to1_reference.mp4` and `MERGE_6TO1_STRIP.png`.
- **Look:** EEVEE, marbled with the 6 source colours. A 3-colour variant is shown in `FLUFF_MARBLED_LOOK.png`.

## 8 · NOT_RUN

- KFB runtime check (ball radius blend, root lift, contact events).
- Production Control checkpoint (tools not connected).
- Per-actor hand-radius offset (Part 2 defect 2, still open).
- Head-up pose for Robot on the Large ball (needs authoring; Georg decides).
