# KFB Exchange + Reaction Kit 01 · Part 2 RETURN · build

- **Executor:** Coworker (cloud bpy 5.0.1 + numpy glTF evaluator) · 2026-10-05
- **Brief:** `../BRIEF.md`, including Georg's call set (BINGO! yes, BONGO. no, BOGGLE? unclear / asks back, Blödsinn… reject + leave, FLUFFY!, Kayfabe!, Pop!, Bizarro…?!).
- **Branch:** `planning/exchange-reaction-kit-01-2026-10-05`, draft PR #358. No merge.

## Defects and open points first

1. **BOGGLE? has no real "asking back" gesture yet.** It uses `reaction_surprised` for now. Neither KayKit nor the library has a puzzled shrug or head tilt. Georg checks Quaternius / Mixamo (search list sent in chat).
2. **Idle blend pops on a few reactions.**
   - Every reaction starts and ends on KayKit `Idle_A` (12-frame ease).
   - The Mixamo-based library clips hold their arms differently from KayKit idle. On calm clips the blend step is therefore larger than the clip's own motion:

     | Clip | Blend step | Clip's own step |
     |---|---|---|
     | contradict | 6.8–7.7° | ≤ 1.9° |
     | boggle | 7.9–10.5° | 3.8° |
     | taunt | 32.8° | 24.6° |

   - It reads as a quick settle into the gesture. Fix if needed: a longer blend, or start from the library's own rest pose.
3. **Faint is KayKit `Death_A`.**
   - The hips slide 0.45 m (Medium) / 0.74 m (Large) inside the clip.
   - The clip ends lying down. Getting up is `kfb_reaction_getting_up_a`; its start pose does not match the `Death_A` end pose, so the runtime crossfades between them. The KayKit `Lie_StandUp` exists for Medium only.
4. **Orc arm-in FIT (`*_fit_a`):**
   - While holding, the palms sit ≤ 0.008 m from the box sides.
   - During the 8-frame ramps the IK misses by up to 5 cm (1.2 % H). This is transition only.
   - The giant-gift variant uses the original clips (box 1.88 m).
5. **The Robots' big heads still touch during the handover** (known since Part 2 of the Fluff pack). The reference views are side-on, so the heads overlap in the picture.
6. **Look decisions for Georg:**
   - **Call-out letters:** clay colours, size, and the voxel softness that rounds "BOGGLE?" a little much.
   - **Clay presents:** the 6 colour combinations come from the Fluff palette.
   - **Prop scaling:** the gingerbread prop scales with the gift size, so the giant gift holds a giant gingerbread.
7. **Props are stand-ins:** Kenney Holiday Kit 2.0 presents (CC0). KayKit Holiday Bits are not on disk.
8. **NOT_RUN:**
   - KFB runtime check;
   - Production Control checkpoint;
   - Large knead → gift (the Medium storyboard was in Part 1);
   - call-out letters as glb with collider (look sample only).

## What is built

### `KFB_Motion_exchange01.glb` (Medium: 14 clips, Large: 17)

**Reactions, both rigs, in place.** Every `io` clip starts and ends on Idle_A.

| Clip | Call | Source (trim M) |
|---|---|---|
| `kfb_react_delighted_a` | **BINGO!** | gesture_cheering 0–75 |
| `kfb_react_contradict_a` | **BONGO.** | gesture_thoughtful_head_shake 6–64 |
| `kfb_react_boggle_a` | **BOGGLE?** | reaction_surprised 14–89 (placeholder) |
| `kfb_react_dismiss_a` | **Blödsinn…** (+ runtime turn and sad_walk) | gesture_dismissing 4–44 |
| `kfb_react_fluffy_a` | **FLUFFY!** | locomotion_joyful_jump 4–46 |
| `kfb_react_kayfabe_a` | **Kayfabe!** | gesture_pointing 0–60 |
| `kfb_react_pop_a` | **Pop!** | gesture_strong_gesture 0–48 |
| `kfb_react_outraged_a` | BONGO., strong version | gesture_angry 6–56 |
| `kfb_react_amused_a` | – | idle_laughing 78–153 |
| `kfb_react_disappointed_a` | – | idle_sad 3–68 |
| `kfb_react_scared_a` | – | reaction_scared, M 192–267 / L 60–135 (each rig's own peak) |
| `kfb_react_taunt_a` | – | gesture_taunt_b 0–48 |
| `kfb_react_dizzy_a` | **Bizarro…?!** stage 2 (loop) | reaction_dizzy_idle |
| `kfb_react_faint_a` | **Bizarro…?!** stage 3 | KayKit Death_A |

**Bizarro escalation:**

| Trigger | Clip |
|---|---|
| 1st | `contradict` |
| 2nd | `dizzy` |
| 3rd | `faint` |

The runtime keeps the counter per NPC and session, and writes the shock to Lean Memory.

**Orc only:**
- `kfb_interaction_gift_give_fit_a` / `kfb_interaction_gift_receive_fit_a`: normal gift (box 0.88 m = 0.21 H, same ratio as the Robot's 0.45 m).
- `kfb_interaction_opening_a_lid_fit_a`: careful unbox. Hands 0.99 m apart on the 0.93 m lid; the Robot's ratio is 0.02 m outside each edge.

**Gift size per gift (Georg's decision):** Robot 0.45 m; Orc normal 0.88 m with `*_fit_a`; Orc giant 1.88 m with the original clips.

### Props and timing

| File | What |
|---|---|
| `props/KFB_Gift_Presents_clay01.glb` | 6 presents; lid is its own node (`lid_*`); clay roughness 0.9; Fluff palette |
| `kfb_gift_held_pop_timing.json` | Default unbox in the hands, no clip |

**Held-POP timing** (frames from the end of gift_receive):

| Event | Frame |
|---|---|
| squash | 0–8 |
| lid off + reveal | 10 |
| prop at its peak | 18 |
| prop lands, reaction starts | 26 |

### Catalogue patch (`KFB_Motion_Library.catalog.patch_exch01.json`)

- 17 clips.
- `exchangeEvents`:
  - gift_give `offerReady` 30, `release` 50;
  - gift_receive `reachReady` 38, `grab` 40, `secured` 68, starts 10 frames after the giver;
  - careful-unbox `lidGrab` / `lidOff`;
  - held-POP timing;
  - gift-size rule.
- `callSet` with meaning, clip and escalation.

## Measured

| Check | M | L |
|---|---|---|
| Round trip (written glb vs build) | 0.000 m | 0.000 m |
| Foot min height (all reactions) | ≥ 0.002 m | ≥ 0.020 m |
| Handover palm → box side (normal gift) | giver ≤ 0.001, receiver 0.014 m | FIT: giver ≤ 0.008, receiver 0.000 m |
| Handover, giant gift (L original) | – | giver ≤ 0.003, receiver 0.031 m |
| Careful unbox: hands vs lid | 0.444 / 0.411 m | 0.992 / 0.926 m (FIT) |

## Files

| File | What |
|---|---|
| `PART2_REACTIONS_1.png`, `PART2_REACTIONS_2.png` | all 14 reactions: first / peak / last frame, Robot One + Orc Brute |
| `PART2_GIFT_SEQUENCE.png` + `.mp4` | handover → held POP → reactions: Robot \| Orc FIT \| Orc giant |
| `PART2_CAREFUL_UNBOX.png` | `opening_a_lid` (Robot) and `opening_a_lid_fit` (Orc) with a clay present |
| `PART2_CALLOUT_LOOK.png` | BINGO! / BONGO. / BOGGLE? as kneaded clay 3D letters (EEVEE, K1 clay) |
| `motion_library_delta/`, `props/`, `kfb_gift_held_pop_timing.json`, `part2_metrics.json`, `scripts/` | – |

- **NEW CLIP REQUIRED:** none. Only the BOGGLE? shrug is open, and Georg is sourcing it.
- **Next gate:** `KFB_TALK_GESTURE_KIT_01` (gate 2), then Brickfish throw + clay burst (gate 3).
