# KFB Fluff Work Motion Pack 01 · Part 2 · TEST REPORT

Executor: Coworker (cloud bpy 5.0.1 + numpy glTF evaluator) · 2026-10-04
Branch: `planning/fluff-blender-slice-01-2026-10-04`

All measurements are in clip space: root parent = identity, glTF axes (+Y up, actor faces +Z), metres.

Body heights H: Rig_Medium 2.17 (Robot One / Skeleton Minion), Rig_Large 4.19 (Orc Brute).

## 1 · Binding and round trip

| Check | Result |
|---|---|
| `KFB_Motion_fluff01.glb` (Rig_Medium / Rig_Large) | 9 clips each. Skeleton-only, same 24-node layout as the existing libraries. All 23 joints carry T/R/S. |
| Re-read check: a clip read back from the written glb gives the same handslot position as the built pose | 0.000 m (sampled clips on both rigs) |
| Actors bind by node name and play | Robot One, Robot Two, Skeleton Minion (Medium) and Orc Brute (Large): PASS (renders) |
| Mirror check: steer_right is steer_left mirrored | max world-position error 0.000 m |

## 2 · New / derived clips

All clips are in place (`rootMotion: in-place`) and the runtime owns the root.

**Push and steer clips (G1–G3).** Ball sizes follow the Fluff Mass Ladder (brief commit `cd69323`: 3 Medium Fluff = 1 Large Fluff by volume):
- Medium ball r 0.477 m. This absolute size is my reading: 0.22 × Medium body height.
- Large ball r 0.477 × 3^(1/3) = 0.689 m (0.164 H).
- Palms sit on the ball's back, aimed at the ball centre. Contact is 20° above the equator; the Large push and heavy push need 30° / 25° so the arms reach the smaller ball.

| Clip | Rig | Frames | Loop seam excess* | Trunk lean | IK hand error | Palm→centre | Runtime root speed | Runtime yaw rate |
|---|---|---|---|---|---|---|---|---|
| `kfb_fluff_roll_push_a` | M | 30 | 0.0° | 16.0° | 0.003 m | 16.7° | 1.09 m/s | – |
| | L | 30 | 0.0° | 17.5° | 0.001 m | 5.0° | 2.74 m/s | – |
| `kfb_fluff_roll_push_heavy_a` | M | 39 | 0.7° | 27.4° | 0.001 m | 9.8° | 0.83 m/s | – |
| | L | 39 | 1.1° | 29.0° | 0.001 m | 3.8° | 2.07 m/s | – |
| `kfb_fluff_steer_left_a` | M | 25 | 4.0° (foot) | 27.8° | 0.002 m | 15.7° | 0.96 m/s | +35.2 °/s |
| | L | 25 | 4.0° (foot) | 28.9° | 0.001 m | 4.3° | 2.52 m/s | +35.2 °/s |
| `kfb_fluff_steer_right_a` | M / L | 25 | 4.0° (foot) | as left | as left | as left | as left | −35.2 °/s |

\* **Loop seam excess:** the step from the last frame back to the first, minus the largest normal frame-to-frame step of the same joint. ≤ 0 means the seam is no worse than a normal frame.

Notes on these clips:
- **Lean:** the wheelbarrow donor already leans 16° (walk_a) or 27° (walk_b, heavy). No extra lean was added.
- **Runtime root speed:** this is the measured backward speed of the stance foot. Moving the root at this speed gives no foot slide.
- **Steer clips:** the stance-foot speed (0.96 / 2.52 m/s) is lower than the donor's arc travel (1.23 / 3.15 m/s). The catalogue uses the foot speed.
- **steer_left loop:** the donor `turn_a` is not a loop. I stripped travel and the yaw drift, then made it loop with an 8-frame crossfade. The seam is 4° worse than the largest normal foot step.
- **steer_left floor fix:** after the blend the feet dipped up to 1.6 cm (Medium) or 2 cm (Large) below the floor. The root was lifted per frame (max 2.5 cm / 3.7 cm).
- **Heavy push:** walk_b travel stripped (1.11 m / 2.85 m per cycle). Time-stretched 29 → 39 frames (0.74×).

**Work clips (G4/G5).**
- Medium = native KayKit copy.
- Large = Medium→Large retarget: rotations copied, Large rest translations, hips/root delta × 2.564, no arm correction.

| Clip | Donor | Frames | Loop | Seam |
|---|---|---|---|---|
| `kfb_fluff_knead_press_a` | Working_B | 77 | yes | KayKit native (last = first) |
| `kfb_fluff_collect_debris_a` | Digging | 43 | yes | native |
| `kfb_fluff_place_small_a` | Interact | 40 | one-shot | – |
| `kfb_fluff_pack_flatten_a` | Working_A | 46 | yes | native |
| `kfb_fluff_patch_press_a` | Work_A | 77 | yes | native |

## 3 · Workpiece contact

Handslot to workpiece surface, in metres: negative = the hand presses in, positive = gap. Range over the clip, left / right hand.

| Clip | Rig | Workpiece | L | R |
|---|---|---|---|---|
| push / heavy / steer | M | Medium ball r 0.477 | +0.044 | +0.044 |
| push / heavy / steer | L | Large ball r 0.689 (Mass Ladder) | +0.084 | +0.084 |
| knead_press | M | bench chunk r 0.24 (0.11 H) between hands | −0.07 … +0.11 | −0.07 … +0.11 |
| knead_press | L | bench chunk r 0.92 (0.22 H), moved 0.39 m forward | −0.04 … +0.24 | −0.07 … +0.25 |
| collect_debris | M | ground chunk r 0.24 at the scoop | +0.02 … +0.46 | +0.04 … +0.44 |
| collect_debris | L | ground chunk r 0.92, moved 0.37 m forward | −0.14 … +1.03 | +0.05 … +2.05 |
| place / pack / patch | M | small chunk r 0.20 (0.09 H) at reach | right hand −0.02 … | – |
| place / pack / patch | L | small chunk r 0.38 (0.09 H) at reach | right hand −0.03 … | – |

The handslot sits inside the palm. The +0.044 / +0.085 on the push clips is the handslot-to-palm offset (2 % H), so the palm surface itself is on the ball.

**Mesh check (body vertices inside the workpiece, arms excluded):**

| Actor | Clip | Body inside workpiece | Status |
|---|---|---|---|
| Orc Brute | knead_press, ball at hand midpoint | 0.38 m | **FAIL** |
| Orc Brute | collect_debris, ball at hand midpoint | 0.19 m | **FAIL** |
| Orc Brute | knead / collect, after moving the ball forward 0.39 / 0.37 m (repair 1) | ≤ 0.01 m | PASS |
| Orc Brute | roll_push, ladder ball r 0.689 | **0.37 m (legs)** | **FAIL** |
| Orc Brute | roll_push_heavy, ladder ball | **0.27 m (legs)** | **FAIL** |
| Orc Brute | steer L/R, ladder ball | 0.07 m (legs) | minor |
| Orc Brute | first build, ball r 0.922 = 0.22 H, for comparison | 0.04 m (knee) | minor |
| Orc Brute | G5 | 0.00 m | PASS |

**Ladder ball on the Orc (two attempts, then stopped):**
- With the ladder Large ball (r 0.689) the Orc's hands only reach it when the ball sits under its body, so the legs step into it.
- **Attempt 2:** move the contact higher (35–40°) and extend the arms (reach 0.95–0.98). The arm IK then fails: hand error 7–9 cm, palms 37° off, a 24° arm flip at the loop seam.
- I kept the attempt-1 version: clean arms, leg intersection reported.
- I did **not** change the ladder rule. The geometry conflict is reported here, as the brief asks.
| Robot One | push (spherical fists) | 0.14 m | hands only, the fist mesh is large |
| Robot One | knead | 0.05 m | hands only |
| Robot One | all other clips | 0.00 m | PASS |

After the repair the Large forearms sink up to 0.25 m into the knead chunk (6 % H). It reads as gripping soft Fluff. Georg decides whether that is acceptable.

**Actor hand size differs.** The ball is placed for the shared skeleton, not per actor:
- Robot One / Robot Two fists sink into the ball a little;
- Skeleton Minion's thin hands stop just short of it (`PART2_CREW_ROBOT2_SKELETON.png`).

The runtime can add a per-actor hand radius offset.

## 4 · Paired give / receive

- **Clips:** existing `kfb_interaction_gift_give_a` and `kfb_interaction_gift_receive_a`. Not changed.
- **Alignment:** taken from the catalogue events. Giver `release` = frame 50, receiver `grab` = frame 40, so the receiver starts 10 frames after the giver.
- **Distance between roots:**

  | Rig | Distance | Hand-midpoint gap at handover |
  |---|---|---|
  | Medium | 1.149 m | 0.013 m lateral, 0.003 m vertical |
  | Large | 2.774 m | 0.030 m lateral, 0.007 m vertical |

- **Previews:** `PART2_PAIR_GIVE_RECEIVE.png` and `.mp4` (Robot One → Robot Two; Orc Brute → Orc Brute). A small chunk is carried by the giver and switches to the receiver at frame 50.
- **Blender check at frames 48–51 (hand midpoints, both actors):** 1.3–1.9 cm (Medium), 3.0–4.6 cm (Large).
- **Defect:** at that distance the actors stand very close. The robots' big heads come within a few centimetres of each other, and the Orc bodies nearly touch. The donor clips were authored on mannequin proportions. At the handover the small chunk is hidden inside the four hands. The handover itself lines up.

## 5 · Rules held

- No new clip invented. Every Part 2 clip is DERIVE / EDIT / RETARGET of an existing donor.
- No transition clip for work↔dance (runtime crossfade).
- No bend-down pickup.
- Root motion is in place on every clip. Speed and yaw rate are given as runtime hints only.
- No arm-in correction on Large (Option A).

## 6 · NOT_RUN

- Runtime check in KFB.
- Low-Fluff look changes. Accepted as the Part 2 baseline; the palette crop stays as documented in Part 1.
- Per-actor hand-radius offsets.
- Optional Mass Ladder variants added to the matrix in `cd69323`: coop_large_push (2–3 Medium on one Large ball), foot_driven_roll, ball_balance, ball_dance, ball_surf. The brief marks them secondary; they did not delay the core pack.
- Marbled colour memory on merged Medium/Large balls.
- Production Control checkpoint: the KFB Production Control tools are not connected in this session.
