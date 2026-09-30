# RETURN · KFB Animation Intake 06 · Motion Library v6 · 2026-09-30

Scope: index, duplicate check, convert and normalise only. No motion was edited by hand.

**Input:** 30 single Mixamo FBX from Dropbox `BLENDER MCP/_inbox` (30.09).

**Result:**
- 25 clips baked onto Rig_Medium and Rig_Large with the unchanged pipeline (intake 05 bake, loop and facing metrics, sheet framing).
- 5 (near) duplicates were not baked (Georg agreed on 30.09).
- The catalogue grows from 345 to **370** clips.
- Every earlier library file stays byte-identical. The new clips are in the supplement libraries `*_i06.glb`.
- **New for every clip:** `forwardYawDeg`, plus `travelYawDeg` for locomotion clips.

## Defects and open points (read first)

1. **`facingYawDeg` was being misread by the runtimes.**
   - It is the shoulder-line angle (0 = rest facing), not a direction.
   - The Fight Sandbox used it as a direction, and the fighters ended up sideways or backwards.
   - The catalogue now carries `forwardYawDeg` (the body facing, Blender yaw, rest = −90) for all 370 clips. Locomotion clips also get `travelYawDeg` (where the clip moves).
   - Backward walks and board rides differ between the two by up to 180°.
   - `facingYawDeg` stays unchanged for compatibility.
2. **Three catalogue notes were wrong and are now corrected:**
   - `kfb_reaction_getting_up_a` starts face down.
   - `kfb_action_hurricane_kick_a` is broken: no body motion, in the source either.
   - `kfb_action_swinging_a` is a rope swing, not a weapon swing.
3. **Not baked (pose difference against the library clip, 9-segment descriptor):**

   | File | Library clip | Difference |
   |---|---|---|
   | Running (2) | running_a | 0.0° |
   | Jogging With Box (1) | jogging_with_box_a | 3.0° |
   | Box Idle | box_idle_a | 7.3° |
   | Surprise Uppercut (2) | reaction surprise_uppercut_a | 5.3° |
   | Illegal Knee (1) | illegal_knee_a | 7.6° |

4. **The surprise uppercut pair is not aligned yet.** `kfb_action_surprise_uppercut_a` (the new attacker side) and `kfb_reaction_surprise_uppercut_a` have the same length (106 frames) and are marked `pairedWith`. Their placement relative to each other is not measured yet; that belongs to the next fight-combo slice.
5. **Seated clips need a seat:** driving, writing, and shaking dice (hips well below standing height).
6. **Two clips float by design:** floating (the hips about 0.6 m up) and flying (horizontal body, almost static).
7. **`flying_bicycle_kick_a` is only the air phase:** a 0.7 s loop with no take-off and no landing.
8. **One-shots (not clean loops):** surprise uppercut, hit by car (ends lying face down), entering car, exiting car.
9. **Props are not included:** skateboard, car, steering wheel, pen, dice, cards. Clips carry `props`.
10. **Contact sheets:** all 25 were rendered and viewed. No floating, twisted or mirrored retarget.
11. **Raw FBX stay in Dropbox `_inbox/`** and never go to GitHub.

## New clips

| Group | Clips |
|---|---|
| Boxing and fight | jab_cross, body_jab_cross (variant), dodging, dodging_back, step_backward, short_left_side_step, flying_bicycle_kick, surprise_uppercut (attacker), taunt_b |
| Reactions | reacting, surprised, scared, hit_by_car |
| Air and board (`flightLabSet`) | floating, flying, skateboarding_b (with push), skateboarding_c (steady ride) |
| Other | goofy_running, driving, entering_car, exiting_car, writing, shaking_dice, cards_a, cards_b (variant) |

## Flight lab (Georg, 30.09)

The new top-level `flightLabSet` groups the base motions for the moving travel-globe card backside: board ride, board push, hover and the flight pose. The idea:
- fine-tune them in the Studio / Animation Lab together with the surf-card posing;
- then layer the flight kinetics (banking, barrel roll) on top with deformers and posing.

There is **no surfing clip** in the library yet. The steady board ride (`skateboarding_c`) is the nearest base.

## Boxing with the new fight logic

- `jab_cross` / `body_jab_cross` plus `dodging` give readable exchanges without contact: the punch misses and the dodge sells it.
- `step_backward` and `short_left_side_step` give footwork between exchanges.
- `taunt_b` is the short winner pose.
- The combos are staged in the next fight slice, after the Resident has applied Fight Sandbox 03.

## Files

| File | What |
|---|---|
| `KFB_Motion_Library.catalog.json` | Catalogue v6 (`2026-09-30`, 370 clips) |
| `libs/Rig_Medium/*_i06.glb`, `libs/Rig_Large/*_i06.glb` | 6 supplement libraries per rig (action, locomotion, gesture, reaction, idle, interaction) |
| `sheets/<group>/<id>.png` | Contact sheets of the 25 new clips |
| `verify6.json` | Export check: rest skeleton identical, animations complete, round trip 0.0 cm |

## Exactly one next gate

**Fight combos 04:** stage the boxing exchanges and the surprise uppercut pair with the 0.3 rules, once Georg has played Fight Sandbox 03.
