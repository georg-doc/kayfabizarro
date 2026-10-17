# KFB Fluff Work Motion Pack 01 · Part 1 · TEST REPORT

Executor: Coworker (cloud bpy 5.0.1 + numpy glTF evaluator) · 2026-10-04

## 1 · Rig and binding proof

| Check | Result |
|---|---|
| Robot One / Robot Two / Skeleton Minion (current) are Rig_Medium, 23 joints, same names as Rig_Medium donors | PASS |
| Orc Brute is Rig_Large, 23 joints, same names | PASS |
| 56 Medium clips merged onto Robot One / Robot Two / Skeleton Minion bind by node name and play (`AUD_RobotOne_1/2.jpg`, `AUD_RobotTwo.jpg`, `AUD_SkeletonMinion.jpg`). Robot Two and Skeleton were checked on a 7-clip subset: Idle_A, Work_A, Working_B, wheelbarrow_walk_a, gift_give_a, Hammering, Cheering. | PASS |
| 30 Large library clips play on Orc Brute (`AUD_OrcBrute_1/2.jpg`) | PASS |
| 8 Medium KayKit clips retargeted to Orc Brute play without distortion (`ROLE_Large_OrcBrute_RT.png`) | PASS (visual) |

## 2 · Rejections (evidence)

Rule: the head intersects or nears the terrain, or the body bends to the floor. Values are the lowest head height divided by the rest height H0.

| Clip | Medium | Large | Verdict |
|---|---|---|---|
| kfb_interaction_pull_plant_a | 0.21 | 0.08 | REJECT |
| kfb_interaction_plant_a_plant_a | 0.12 | 0.05 | REJECT |
| kfb_interaction_cow_milking_a | 0.48 | 0.41 | REJECT |
| kfb_action_lifting_a | 0.44 | 0.37 | REJECT |
| PickUp | head 0.83, hips 0.74 | n/a | NOT NEEDED for pickup (bends) |

Other rejections:
- **Pickaxing / Sawing / Hammering:** tool-bound, so the semantics are wrong for bare-hand Fluff work.
- **Throw:** wrong semantics.

## 3 · Hand/Fluff relationship

**Ball-in-hand previews.** A purple placeholder ball is placed at the hand midpoint or the reach point. Radius 0.20 m on Medium, ×1.9 on Large.
- `ROLE_Medium_RobotOne.png`: 14 roles.
- `ROLE_Large_OrcBrute.png`: 6 library roles.
- `ROLE_Large_OrcBrute_RT.png`: 6 retargeted roles.

**Findings:**
- **wheelbarrow_walk (both rigs):** hands at hip height (0.44 H0), forward reach 0.14. The ball sits under the chest. This is the reason for gaps G1–G3.
- **Large retarget, hand separation** (normalised by character height):

  | Clip | Medium | Large |
  |---|---|---|
  | Working_B | 0.22 | 0.45 |
  | Digging | 0.22 | 0.42 |
  | Interact | 0.49 | 0.79 |

  The cause is Large's 4× wider shoulder rest offset. Two-hand contact on a body-scaled ball is lost (gap G4). One-hand roles (Interact, Working_A, Work_A) still read.
- **Library Large clips** show the same widening (wheelbarrow_walk_a handSep 0.66 → 0.82). So this is a property of Rig_Large, not of my retarget.

## 4 · Root and loop

- **Root motion:** all KEEP / KEEP + FIT donors are in place (travel 0.00–0.04 m), except the steering donors:
  - wheelbarrow_walk_b: 0.87 m/cycle;
  - wheelbarrow_walk_turn_a/b: 1.2 m, with shoulder yaw of about −28°.

  Their travel must be stripped in G2/G3 so that runtime owns root motion.
- **Turn direction:** both turn donors turn **left**. steer_right is a mirror.
- **Loops:** loop seams were not measured in this pass, because nothing was authored. This is checked in Part 2 on G1–G5.

## 5 · Fluff look

**Renders:**
- `FLUFF_LOOK_HIGH_LOW.png` (EEVEE): High left, Low right with a separated crumb.
- `FLUFF_LOOK_PALETTE.png`: 6 palette colours. Front row High, back row Low.

**Reference data:**

| Property | Value |
|---|---|
| Radius | 0.5 m (reference; scale at runtime) |
| Pivot | ball centre |
| Axis | Blender Z up (glTF +Y up) |
| Parameters | `fluff_look_params.json` |
| Source | SOURCE.md |

**Defects:**
- In `FLUFF_LOOK_PALETTE.png` the outer balls (knetbar left, optionc right) are cut off at the frame edge. Two framing repairs failed, so I stopped (rule: two attempts).
- The facets are barely visible at this distance.
- `KFB_Fluff_Look_HighLow.blend` references the fingerprint image by an absolute cloud path. Relink it to `scripts/fingerprints-512.png` when opening.

## 6 · Bounce reference (`kfb_fluff_ball_bounce_reference`)

Setup: 30 fps, R 0.5 m, drop from a centre height of 2.0 m, g 9.81. Prop only, no humanoid.

| | High | Low |
|---|---|---|
| Restitution (my choice) | 0.62 | 0.40 |
| Frames | 76 | 64 |
| Contact frames | 16, 38, 51 | 16, 32, 38 |
| Contact hold (frames per bounce) | 2, 2, 1 | 4, 3, 2 |
| Peak centre heights (m) | 2.0 → 1.105 → 0.729 → 0.564 | 2.0 → 0.752 → 0.534 → 0.502 |
| Squash (min height scale, volume-preserving) | 0.80 | 0.66 |
| Stretch (max) | 1.10 | 1.05 |
| Settle | roll out 0.35 m/s, no wobble | short roll (0.12 m/s), decaying wobble ±0.05 |

- **Response notes:** High rebounds higher, contacts briefly and stays round. Low lands heavy: deeper and longer squash, low rebound, settles with a wobble. They are the same substance.
- **Files:**
  - `kfb_fluff_ball_bounce_reference.glb`: two animated balls, translation and scale.
  - `bounce_reference.json`: per-frame x, centre z, scale xz, scale y.
  - `kfb_fluff_ball_bounce_reference_side.mp4`
  - `BOUNCE_STRIP.png`
- **Check:** the bottom stays on the ground during contact, because centre z = R × scaleY. PASS by construction.

## 7 · NOT_RUN

- Paired two-actor pass_receive preview.
- work↔dance pose-distance check.
- Loop seams (nothing authored).
- Runtime check in KFB.
- Charging station prop (`Robot_ChargingStation.gltf`): not needed for Part 1.
