# KFB Exchange + Reaction Kit 01 · Part 1 · TEST REPORT

- **Executor:** Coworker (cloud bpy 5.0.1 + numpy glTF evaluator) · 2026-10-05
- **Space:** clip space (+Y up, actor faces +Z, metres).
- **Body height H:** Rig_Medium 2.17, Rig_Large 4.19.
- **Sources:**
  - Motion Library catalogue (370 clips).
  - Libraries: base, i04, i06; talk and reaction from repo clone 09-29 and MOTION_LIB_v6.
  - Fluff pack: `KFB_Motion_fluff01` (Part 3).

## 1 · How the reaction trims were found

- **Pose deviation per frame:** mean joint distance (hips-relative) from frame 0, divided by H.
- **Peak:** the frame of maximum deviation.
- **Trim:** first to last frame with deviation ≥ 30 % of the peak, ±6 frames of padding.
- **Length cap:** if the window is longer than 2.5 s, take 2.5 s around the peak.
- **Check:** every trim was looked at on the sheets. The decision column is based on the picture, not only on the number.

| Clip | M peak / trim | L peak / trim | Peak deviation / H (M) | Hips travel M |
|---|---|---|---|---|
| gesture_cheering_a | 32 / 0–75 | 32 / 0–75 | 0.083 | 0 |
| gesture_clapping_a | 4 / 0–36 | 4 / 0–36 | 0.014 | 0 |
| idle_happy_a | 28 / 1–74 | 27 / 2–73 | 0.063 | 0 |
| reaction_surprised_a | 51 / 14–89 | 51 / 14–89 | 0.097 | 0 |
| reaction_reacting_a | 35 / 0–75 | 34 / 0–75 | 0.029 | 0 |
| reaction_reaction_a | 33 / 1–57 | 29 / 1–57 | 0.209 (dives to the floor) | 0 |
| gesture_dismissing_gesture_a | 27 / 4–44 | 27 / 5–44 | 0.035 | 0 |
| gesture_thoughtful_head_shake_a | 28 / 6–64 | 28 / 6–56 | 0.016 | 0 |
| gesture_angry_gesture_a | 22 / 6–45 | 22 / 6–56 | 0.088 | 0 |
| gesture_yelling_a | 76 / 39–114 | 76 / 39–114 | 0.151 | 0 |
| idle_laughing_a | 115 / 78–153 | 115 / 78–153 | 0.122 | 0 |
| idle_sad_a | 27 / 3–68 | 26 / 2–69 | 0.081 | 0 |
| reaction_scared_a | 229 / 192–267 | 97 / 60–135 | 0.145 | 0 |
| reaction_fall_flat_a | 42 / 2–76 | 42 / 5–76 | 0.305 | 1.945 m (L 4.993 m) |
| reaction_getting_up_a | 166 / 129–204 | 166 / 129–204 | 0.340 | 0.208 m (L 0.534 m) |
| reaction_dizzy_idle_a | 112 / 75–133 | 112 / 75–133 | 0.044 | 0.001 |
| gesture_taunt_a | 48 / 11–78 | 48 / 11–78 | 0.079 | 0 |
| gesture_taunt_b | 14 / 0–48 | 28 / 0–47 | 0.101 | 0 |

## 2 · Handover with a present (gift_give + gift_receive)

**Setup:**
- Roots 1.149 m apart (M) / 2.774 m (L); receiver starts 10 frames after the giver (Part 2 alignment).
- Box width = palm gap of the giver at f40: handslot distance − 2 × 0.02 H (handslot-to-palm offset).
- Box at the giver's hand midpoint until f50, then at the receiver's.

| Rig | Box width | Kenney scale | Palm → box side, giver f30–50 | Receiver f50–78 | Target |
|---|---|---|---|---|---|
| M | 0.454 m | 1.136 | 0.000 … 0.001 m | 0.013 … 0.014 m | ≤ 0.05 PASS |
| L | 1.880 m | 4.700 | −0.001 … 0.003 m | 0.031 … 0.032 m | ≤ 0.05 PASS (box size: defect 1) |

## 3 · Careful unbox candidate (`opening_a_lid_a`, 221 frames)

**Setup:**
- Grab frame = lowest hand-midpoint height in f40–80.
- Box on the ground under the hands, scaled so the lid top sits at palm height.
- Lid follows the hand midpoint from grab to release (highest point), then flies off (preview only).

| Rig | Grab f | Release f | Lift | Hand separation | Lid width | Hands outside lid edge | Target ≤ 0.08 |
|---|---|---|---|---|---|---|---|
| M | 52 | 162 | 0.549 m | 0.444 m | 0.411 m | 0.017 m | PASS |
| L | 53 | 163 | 1.370 m | 1.802 m | 0.926 m | 0.438 m | FAIL → FIT |

`kfb_interaction_opening_a`: hands stay at waist height (0.44–0.59 m on M), 0.3 m forward, 0.58–0.75 m apart, for the whole clip. That reads as pulling a drawer, not opening a box: NOT NEEDED.

## 4 · Fluff → gift (`kfb_fluff_knead_press_a`)

- Smallest hand separation in the clip minus palm offsets: kneaded lump r 0.135 m fits between the Robot's hands.
- POP to a present at the hand midpoint: storyboard frames only.
- Timing is to come from the merge reference (Part 3: squash 26–34, POP 36, settle 56).

## 5 · NOT_RUN

- Large knead / held POP storyboard (Medium only in Part 1).
- Runtime check.
- Production Control checkpoint.
- GitHub upload.
