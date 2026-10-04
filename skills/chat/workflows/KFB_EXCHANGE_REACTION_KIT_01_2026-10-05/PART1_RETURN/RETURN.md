# KFB Exchange + Reaction Kit 01 · Part 1 RETURN · audition

- **Executor:** Coworker (cloud bpy 5.0.1) · 2026-10-05
- **Brief:** `../BRIEF.md`. Part 1 builds nothing new; it only auditions what exists.
- **Status:** stop. Part 2 (build) waits for Georg's go.

## Defects and open points first

1. **The Orc gift box comes out huge.**
   - The Orc's hands are 1.80 m apart in gift_give/receive, because the Large rig's shoulders are about 4× wider than Medium.
   - A box sized to fit between his palms is 1.88 m wide (0.45 × his height). For the Robot it is 0.45 m.
   - It reads like a giant cake: funny, but big. Options:
     - (a) keep the giant gift (cartoon);
     - (b) a fixed gift size with an arm-in FIT on Large.

   **Georg decides.**
2. **Orc unbox (`opening_a_lid_a`): the hands miss the lid.** Hands are 1.80 m apart, the lid is 0.93 m wide, so each hand is 0.44 m off the edge. This needs FIT (a wider box on the ground, or arm-in) if this variant is kept. The Robot fits: lid 0.41 m, hands 0.44 m apart, 0.02 m outside each edge.
3. **The Robots' big heads touch during the handover.** This is known from Part 2. The handover itself lines up: palm to box side ≤ 0.014 m (Medium), ≤ 0.032 m (Large).
4. **`reaction_reaction_a` is not a surprise.** The character dives to the floor. I moved it to the fight gate as a hit/knockback candidate.
5. **The Robot's big head hides small hand gestures** (clapping) from the front three-quarter view.
6. **`reaction_scared_a`:** the automatic peak differs between rigs (Medium f229, Large f97). For Part 2 I propose one shared window, f60–135.
7. **Gift props: KayKit Holiday Bits are not on disk.** Only Patreon reference images exist in Dropbox; the repo clone has no models. I used the Kenney Holiday Kit 2.0 (CC0, already in Dropbox) as a stand-in: 6 presents, each with a separate lid node. Swap in KayKit if Georg gets the pack.
8. **Render artifact:** the Workbench storyboard shows thin shadow streaks under the floating lid. They are preview only and not part of any asset.
9. **NOT_RUN:**
   - KFB runtime check;
   - Production Control checkpoint (not connected);
   - GitHub upload. Which branch this gate goes on is still open: PR #356 is the Fluff pack. Files are in Dropbox.

## Reaction set: one recommendation each (both rigs, in place, no new clip)

| Reaction | Clip | Trim (frames) | s | Decision |
|---|---|---|---|---|
| delighted | `kfb_gesture_cheering_a` | 0–75 | 2.5 | KEEP (trim) |
| delighted, crowd loop | `kfb_gesture_clapping_a` | full loop | 1.2 | KEEP (subtle; Robot head hides it) |
| delighted, soft | `kfb_idle_happy_a` | 1–74 | 2.4 | KEEP (alternative) |
| surprised | `kfb_reaction_surprised_a` | 14–89 | 2.5 | KEEP (trim) |
| surprised, weak | `kfb_reaction_reacting_a` | – | – | NOT NEEDED (barely moves) |
| unimpressed / dismiss | `kfb_gesture_dismissing_gesture_a` | 4–44 | 1.3 | KEEP (trim) |
| "no" / doubt | `kfb_gesture_thoughtful_head_shake_a` | 6–64 | 1.9 | KEEP for the talk gate |
| outraged | `kfb_gesture_angry_gesture_a` | 6–56 | 1.7 | KEEP (trim) |
| outraged, long | `kfb_gesture_yelling_a` | 39–114 | 2.5 | KEEP for the talk gate (rant) |
| amused | `kfb_idle_laughing_a` | 78–153 | 2.5 | KEEP + FIT (cut from a 10 s loop; needs entry/exit blend) |
| disappointed | `kfb_idle_sad_a` | 3–68 | 2.2 | KEEP (trim) |
| scared | `kfb_reaction_scared_a` | 60–135 | 2.5 | KEEP + FIT (one window for both rigs) |
| knocked out | `kfb_reaction_fall_flat_a` → `kfb_reaction_getting_up_a` | full | 2.6 + 7.6 | KEEP. fall_flat travels 1.95 m (M) / 4.99 m (L); the runtime owns that travel |
| after the knockout | `kfb_reaction_dizzy_idle_a` | loop | – | KEEP |
| taunt | `kfb_gesture_taunt_b` | 0–48 | 1.6 | KEEP (`taunt_a` as alternative) |

## Social calls: mapping proposal (names and meanings not fixed)

| Call | Reaction | Clip |
|---|---|---|
| KayfaBINGO | delighted | gesture_cheering 0–75 |
| KayfaBOGGLE | surprised | reaction_surprised 14–89 |
| KayfaBONGO | amused | idle_laughing 78–153 |
| BLÖDSINN | unimpressed / reject | gesture_dismissing 4–44 |

## Exchange grammar: what exists

| Step | Clip / method | Measured | Decision |
|---|---|---|---|
| handover | `gift_give` + `gift_receive` (receiver starts 10 frames later, events f50 / f40) | palm to box side ≤ 0.014 m (M), ≤ 0.032 m (L); target ≤ 0.05 | KEEP |
| unbox, default | **held POP, no clip**: receiver holds the box, box squashes, lid pops up, prop jumps out | – | runtime prop animation (Part 2 timing JSON) |
| unbox, careful variant | `place_small` (put down) → `opening_a_lid_a` (crouch, lift lid; grab f52, release f162, lift 0.55 m on M) | hands to lid edge 0.02 m (M), 0.44 m (L) | KEEP (M) / KEEP + FIT (L) |
| unbox | `kfb_interaction_opening_a` | static hands at waist height, like pulling a drawer | NOT NEEDED |
| Fluff → gift | `kfb_fluff_knead_press_a` + POP (merge timing) | lump r 0.135 m fits between the Robot's hands | KEEP |
| Fluff trade | the same handover pair with a Fluff ball | – | KEEP (no extra clip) |

**NEW CLIP REQUIRED: none.**

## Files

| File | What |
|---|---|
| `PART1_REACTION_AUDITION_1.png`, `PART1_REACTION_AUDITION_2.png` | every candidate on Robot One and Orc Brute: trim in / peak (red) / trim out |
| `PART1_EXCHANGE_STORYBOARD.png` | handover M + L with a present, careful unbox M + L, held POP, Fluff → gift |
| `part1_metrics.json` | trims, peaks, travel; palm-to-box and lid measurements |
| `TEST_REPORT.md`, `REUSE_STATUS.md` | evidence |
| `scripts/` | rebuild |

## Part 2 (after go)

**Builds:**
- reaction one-shots `kfb_react_*_a` from the trims above;
- clay presents with the lid as its own node, plus a held-POP timing JSON;
- the careful-unbox FIT for Large;
- catalogue patch with exchange events;
- three reference videos (M + L).

**Needs Georg's decision first:** giant Orc gift or fixed size.
