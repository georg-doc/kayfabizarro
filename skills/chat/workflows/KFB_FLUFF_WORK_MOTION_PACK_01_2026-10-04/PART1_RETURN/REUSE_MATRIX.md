# KFB Fluff Work Motion Pack 01 · Reuse Matrix

Status: **PART 1 COMPLETE · 2026-10-04 · Blender MCP (Coworker)**  
Date: 2026-10-04

This matrix exists to prevent duplicate animation work.

Blender MCP must complete the **Evidence / Decision** columns before building new clips.

## Source actors

| Actor | Exact source | Rig evidence | Use |
|---|---|---|---|
| Robot One | `media/3D_Assets/KayKit_Mystery_Series6/12 - June 2024 - Robot/characters/Robot_One.glb` | Resident Atlas: **Rig_Medium**, 23 joints | Robot A / precision worker reference |
| Robot Two | `media/3D_Assets/KayKit_Mystery_Series6/12 - June 2024 - Robot/characters/Robot_Two.glb` | Resident Atlas: **Rig_Medium**, 23 joints | Robot B / salvage worker reference |
| Skeleton Minion | `media/3D_Assets/KayKit_Skeletons/Skeleton_Minion.glb` | current Skeleton source: **Rig_Medium** | Skeleton Fluff worker |
| Legacy Skeleton Minion | `KayKit Legacy/.../character_skeleton_minion.gltf` | **Rig_Legacy** | **DO NOT USE as the default Fluff worker** |
| Orc Raider | Motion Library preview actor | Rig_Medium | canonical Medium motion check |
| Orc Brute | Motion Library preview actor | Rig_Large | canonical Large motion check |

## Known source-backed prop

Robot habitat charging station:

`media/3D_Assets/KayKit_Mystery_Series6/12 - June 2024 - Robot/assets/gltf/Robot_ChargingStation.gltf`

Use this exact donor where a charging-station reference is needed.

---

## Existing motion donors already proven in Registry

### Rig_Medium_General

`media/3D_Assets/KayKit_Character_Animations_1.1/Animations/gltf/Rig_Medium/Rig_Medium_General.glb`

- Interact
- PickUp
- Throw

### Rig_Medium_Tools

`media/3D_Assets/KayKit_Character_Animations_1.1/Animations/gltf/Rig_Medium/Rig_Medium_Tools.glb`

- Chop
- Chopping
- Dig
- Digging
- Hammer
- Hammering
- Holding_A
- Holding_B
- Holding_C
- Pickaxe
- Pickaxing
- Saw
- Sawing
- Work_A
- Work_B
- Work_C
- Working_A
- Working_B
- Working_C

### Rig_Medium_Simulation

Candidate:

- Cheering

### KFB Motion Library

`media/3D_Assets/Animations/KFB_Motion_Library/`

Current accepted two-rig motion family includes:

- dance;
- idle;
- climb;
- locomotion;
- music;
- action.

Use its existing Rig_Large library for two-rig comparison.

### Critical gap

`Rig_Large_Tools.glb` **does not exist**.

Do not load or cite it as an available source.

---

## Role mapping to complete in Blender

Decision vocabulary:

- **KEEP**
- **KEEP + FIT**
- **DERIVE / EDIT**
- **NEW CLIP REQUIRED**
- **NOT NEEDED**

Metric key (from `metrics.json`, each rig normalised to its own `Idle_A` rest height H0): **head** = lowest head height / H0; **hips** = lowest hips height; **hand h / fwd / sep** = mean hand height, max forward reach, mean left-right hand separation. "RT" = Medium KayKit clip retargeted onto Rig_Large in this pass (`scripts/rt.py`). Medium preview = Robot One; Large preview = Orc Brute.

| Semantic role | Donors auditioned | Medium evidence | Large evidence | Actor evidence | Decision |
|---|---|---|---|---|---|
| roll_push | `kfb_locomotion_wheelbarrow_walk_a` (in place, 30 f loop); Holding_A/B/C; Work_A/B/C | wheelbarrow_walk_a: head 0.91, hands h 0.44 / fwd 0.14 → ball sits at the hips, reads as hugged, not pushed. Holding_A/B/C: good forward hold (fwd 0.35/0.28/0.17) but idle legs, no push body. Work_*: wrong semantics. | Library wheelbarrow_walk_a exists; same read (hands at hip, ball under chest). | Robot One, Robot Two, Skeleton bind and play wheelbarrow_walk_a (`AUD_RobotTwo.jpg`, `AUD_SkeletonMinion.jpg`). | **DERIVE / EDIT** · keep legs/root of wheelbarrow_walk_a, raise arms to ball-centre height, reach forward, add ~10° forward lean. **Gap G1.** |
| roll_push_heavy | `wheelbarrow_walk_b`; Work/Working; Large library effort clips | wheelbarrow_walk_b: head 0.86, root travel 0.87 m/cycle (must be stripped). | Library walk_b exists. At Large ball scale 1.9 the ball intersects the belly (`ROLE_Large_OrcBrute.png`). | Medium + Large ref | **DERIVE** from G1 + walk_b legs in place, 0.75× speed, more lean. **Gap G2.** |
| steer_left | `wheelbarrow_walk_turn_a/_b` | turn_a/turn_b: root travel 1.2 m, shoulder yaw −8° → −36° / −4° → −34°. **Both clips turn the same way (left).** | Library turn_a/b exist (travel 0.94). | Robot/Skeleton (via shared Rig_Medium) | **DERIVE** from turn_a: strip travel/yaw, layer G1 arms. **Gap G3.** |
| steer_right | as above | No right-turn donor exists. | as above | Robot/Skeleton | **DERIVE** = mirror of steer_left. **Gap G3.** |
| place_small | Interact; PickUp; Holding; gift_give_a | Interact: upright (head 0.97), one hand forward 0.13 at h 0.64. **PickUp rejected** (head 0.83, hips 0.74, bends to floor). | RT Interact plays cleanly (`ROLE_Large_OrcBrute_RT.png`); library gift_give_a also fits. | Robot One preview OK | **KEEP + FIT** (Medium native). Large: retarget only (G5). |
| knead_press | Work_A/B/C; Working_A/B/C; Hammering (motion only) | Working_B: two hands close together (sep 0.39), fwd 0.36, h 0.80, head 0.99 → best kneading read. Hammering: one-handed tool swing, rejected. | **RT Working_B: hands spread to 0.45 of body height (Medium 0.22)**; Large shoulders are 4× wider in rest pose (upperarm x 0.884 vs 0.212). Two-hand contact on a body-scaled ball is lost. | Robot One / Robot Two / Skeleton play Working_B. | Medium **KEEP + FIT**. Large **DERIVE** (retarget + arm-in correction). **Gap G4.** |
| pack_flatten | Work/Working; Hammering | Working_A / Work_A: one-hand press-and-pat, head 0.97, fwd 0.25–0.30. | RT Working_A plays cleanly, one-hand read survives. | Robot One preview OK | Medium **KEEP + FIT**. Large retarget only (G5). |
| pass_receive | `kfb_interaction_gift_give_a` / `_receive_a`; Interact; Holding; Throw | gift_give/receive: 90 f, head 0.98, hands fwd 0.30–0.33, both hands. Throw: wrong semantics. | Library give/receive exist (fwd 0.27–0.30). Large preview reads. | Robot Two / Skeleton play gift_give. **Paired two-actor preview NOT_RUN.** | **KEEP** (both rigs). |
| pull_chunk | `kfb_interaction_pulling_lever_a`; Pickaxe/Pickaxing; Saw/Sawing; Interact | pulling_lever_a: 189 f, fully upright (head 1.01), hand h 0.54. Pickaxing (hands fused on a tool, sep 0.04) and Sawing: tool-bound, rejected. pull_plant_a/b rejected (head 0.21). | Library pulling_lever_a exists (head 1.00). Large preview: pulling arm low at the side; reads as lever, weak for a chunk. | Robot One preview OK | **KEEP + FIT** (hand target = lever height ≈0.54 H0). |
| collect_debris | Digging; Interact; Work; PickUp; pull_plant; plant_a_plant; cow_milking; lifting_a | Digging (tool-less): scoop toward a ground ball, head 0.89, hands together sep 0.35. **Rejected (head to ground):** pull_plant_a 0.21, plant_a_plant 0.12, cow_milking 0.48, lifting_a 0.44; PickUp (see above). | RT Digging: hands spread, scoop does not reach the ground ball (`ROLE_Large_OrcBrute_RT.png`). | Robot One preview OK | Medium **KEEP + FIT**. Large **DERIVE** (part of **Gap G4**). |
| patch_press | Work/Working; Hammering; Interact; Use_Item | Work_A: one-hand press, head 0.97. Use_Item: hands barely forward (0.05), weak. | RT Work_A plays cleanly. | Robot One preview OK | Medium **KEEP + FIT** (Work_A). Large retarget only (G5). |
| work_to_dance | Work → accepted dance clip | No transition clip in any source. | — | — | **NOT NEEDED** as a clip: runtime crossfade via Idle_A / `kfb_idle_happy_a`. Pose-distance check **NOT_RUN**. |
| dance_to_work | accepted dance → Work | as above | — | — | **NOT NEEDED** (same). |
| celebrate_short | Cheering; `kfb_gesture_cheering_a`; `kfb_gesture_clapping_a` | Cheering (KayKit Simulation): hands up to 0.98, 51 f. | Library gesture_cheering_a / clapping_a exist and read (`ROLE_Large_OrcBrute.png`). | Robot Two and Skeleton play Cheering. | **KEEP** (Medium Cheering; both rigs gesture_cheering_a / clapping_a). |
| pickup_react_short | Interact / Cheering / `kfb_locomotion_joyful_jump_a` | joyful_jump: 57 f, head 0.93, in place. Upright, no bend. | Library joyful_jump exists, reads. | player/NPC-safe (in place, no bend) | **KEEP + FIT** (trim a ≤0.8 s window of joyful_jump; Cheering as alternative). |
| ball_bounce_reference | prop-only | n/a | n/a | High + Low | **DONE** (optional prop ref): `kfb_fluff_ball_bounce_reference.glb`, `bounce_reference.json`. |

## True remaining motion gaps (Part 2 scope)

| Gap | What | Rigs | Basis |
|---|---|---|---|
| G1 | `roll_push`: arm-raise + forward-reach + lean layer on wheelbarrow_walk_a | Medium + Large | DERIVE / EDIT |
| G2 | `roll_push_heavy`: G1 + walk_b legs in place, slower, more lean | Medium + Large | DERIVE |
| G3 | `steer_left` from turn_a (+ G1 arms, travel/yaw stripped); `steer_right` = mirror | Medium + Large | DERIVE |
| G4 | Large two-hand closure for knead_press and collect_debris (retarget + arm-in correction) | Large | DERIVE / EDIT |
| G5 | Plain Medium→Large retarget export of KayKit clips with no Large source (Interact, Working_A, Work_A) | Large | DERIVE (retarget only) |

**NEW CLIP REQUIRED: none.**

**Decision needed before G4:** the Large Fluff ball size. If Large workers handle a proportionally bigger ball (radius ≈0.22 of body height, so the hands meet its sides), G4 shrinks to a plain retarget.

---

## Rejection rules

Reject an existing clip for a role when any of these is true:

- head intersects terrain;
- foot slide is visually unacceptable;
- hand target is incompatible with intended Fluff radius;
- root motion conflicts with runtime ownership;
- clip semantic read is clearly wrong;
- retarget to Large breaks body/contact quality;
- clip requires a tool that cannot be cleanly removed/reinterpreted.

A rejected donor is still evidence; record why it failed.

---

## Life Tree pickup constraint

The Life Tree pickup is **not** a literal floor pickup animation.

Runtime behaviour:

`walk-over / proximity → collect → POP → object disappears → Fluff changes`

Therefore:

- `PickUp` is only an audition candidate;
- if it bends the actor toward the ground, mark it **NOT NEEDED for pickup**;
- prefer an upright reaction.

---

## Required Part 1 return

Before any new authored clip:

1. completed matrix;
2. side-by-side Medium/Large preview;
3. Robot One / Robot Two / current Skeleton Minion preview;
4. High-Fluff isolated look;
5. Low-Fluff isolated look;
6. explicit list of true remaining motion gaps.

Only the final gap list becomes Part 2 authoring scope.
