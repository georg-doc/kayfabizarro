# KFB Exchange + Reaction Kit 01 · Brief

- **Date:** 2026-10-05
- **Approved by:** Georg in chat ("ja, gerne").
- **Scope:** NPC culture mechanics, gate 1 of 3.
- **Gate order:**
  1. This gate: exchange + reactions.
  2. Talk gestures.
  3. Brickfish throw + clay burst, after the Brickfish model exists.
- **Rules carried over:** KayKit 1.1 is the first truth. Reuse before derive, derive before new authoring. The runtime owns root motion, prop ownership and the clay-particle burst. Georg decides the look. No merge, no Live.

## One grammar for all exchange mechanics

`approach → offer/handover (contact event) → transition (lid off / knead / POP) → reveal (prop appears) → reaction`

| Mechanic | Handover | Transition | Reveal | Reaction |
|---|---|---|---|---|
| Gift | gift_give + gift_receive (Part 2 pair, events f50 / f40) | unbox: lid lifts off, box squash + POP | surreal prop | from the reaction set |
| Fluff trade | same pair, Fluff ball as the prop | – | – | from the reaction set |
| Fluff → gift | – | knead_press loop → POP (merge reference timing) | prop | from the reaction set |

## Shared reaction set

Every culture mechanic ends here: gift, trade, debate, hit, dance invite. Reactions are short one-shots cut from existing clips, or the clip itself if it is already short.

| Reaction | Candidate clips (audition) |
|---|---|
| delighted | gesture_cheering, gesture_clapping, idle_happy |
| surprised | reaction_surprised, reaction_reacting, reaction_reaction |
| unimpressed / dismiss | gesture_dismissing_gesture, gesture_thoughtful_head_shake |
| outraged | gesture_angry_gesture, gesture_yelling |
| amused | idle_laughing |
| disappointed | idle_sad |
| scared | reaction_scared |
| knocked out → up | reaction_fall_flat → reaction_getting_up, reaction_dizzy_idle |
| taunt | gesture_taunt_a/b |

**Social calls** KayfaBINGO / KayfaBOGGLE / KayfaBONGO / BLÖDSINN get one reaction each. The mapping is a proposal only; Georg's naming and meaning are not fixed.

## Call set (Georg, 2026-10-05) · replaces the social-call proposal

These are short calls in capitals with fixed punctuation. Each call has three parts: a gesture, a clay call-out object, and a runtime meaning. The punctuation sets the tone, the gesture energy and how the call-out animates.

| Call | Meaning | Gesture (existing clip, trim) | Call-out motion |
|---|---|---|---|
| **BINGO!** | yes / agree | gesture_cheering 0–75 | slams in, squash |
| **BONGO.** | no / contradict | gesture_thoughtful_head_shake 6–64 (angry_gesture 6–56 for the strong version) | short, flat drop |
| **BOGGLE?** | unclear / confused, asks back ("…?") | reaction_surprised 14–89 (Part 2 also auditions a puzzled shrug/tilt if one exists) | wobble, tilt |
| **Blödsinn…** | reject + leave (exit) | gesture_dismissing 4–44 → turn away, walk off (sad_walk) | sags, melts |
| **FLUFFY!** | delighted surprise | joyful_jump (pickup hop) or reaction_surprised | puffs up |
| **Kayfabe!** | interjection | gesture_pointing / strong_gesture | stamp |
| **Pop!** | interjection | short strong_gesture + clay POP sound | merge-POP timing |
| **Bizarro…?!** | cognitive dissonance / disbelief | escalation, see below | glitch / crack |

**Bizarro escalation (the "Ontological Schick-Schock").** The runtime keeps a counter per NPC and per session.

| Trigger | Response |
|---|---|
| 1st | head shake |
| 2nd | dizzy_idle |
| 3rd | faint and fall |

The shock is written to that NPC's Lean Memory in the session. For the faint, Part 2 auditions in-place falls (`standing_death_left`, `death_from_the_front`), because `fall_flat` travels 1.95 m.

**Call-out objects.** Thick kneaded clay letters as a 3D billboard: they face the camera, use the Fluff clay material and POP timing, and carry a collider. They are objects, not 2D sprites, so later mechanics (censoring a thought bubble, stealing a speech bubble, hopping on one's own thought bubble, platformer logic) can use them without a rebuild. Part 2 delivers look samples for 2–3 calls. Georg decides the look.

**Language.** "Blödsinn" is kept as a fixed KFB proper term, like "Kayfabe" (exception to the English-only in-world rule) unless Georg says otherwise.

## Props

- **KayKit Holiday Bits** (the gifts in the KayKit Santa/Holiday pack): only Patreon reference images exist on disk. No model files were found in Dropbox or the repo (clone 09-29).
- **Stand-in:** Kenney Holiday Kit 2.0 (CC0, already in Dropbox).
  - 6 presents: a/b × cube, rectangle, round.
  - Each has a **separate lid node**, which is what unboxing needs.
  - Swap to KayKit Holiday Bits if Georg gets the pack.
- **Look:** clay material (K1 values), palette colours, unboxing via lid pop. Georg decides the look.

## Part 1 · Audition (no new clips) · checkable

1. **Reaction sheet.** Every candidate clip in the table, on Robot One (Medium) and Orc Brute (Large), at its peak frame.
2. **Per reaction, one recommended clip with:**
   - trim window `[in, out]` (frames) for the readable peak;
   - one-shot or loop;
   - travel (m);
   - duration of the trim (s).

   Recommended trims ≤ 2.5 s unless the clip is an idle loop.
3. **Social-call mapping proposal** (4 rows).
4. **Exchange storyboard stills:**
   - give/receive with a Kenney present at f30 / f50 / f68;
   - an unbox candidate (`interaction_opening_a_lid_a` or `interaction_opening_a`) with the present held, lid position at the open frame;
   - Fluff → gift: knead_press + POP frames.
5. **Measured, per exchange row:**
   - hand-to-prop distance at the handover frames (≤ 0.05 m target);
   - whether the unbox candidate's hands meet a lid of present size (≤ 0.08 m), or the clip needs FIT/DERIVE.
6. **Decision column** for every candidate: KEEP / KEEP + FIT / DERIVE / NOT NEEDED.
7. **NEW CLIP REQUIRED:** listed only if no existing clip works.

**Stop after Part 1** with RETURN + TEST REPORT + reuse status.

## Part 2 · Build (after Georg's go) · checkable

- **Reaction one-shots** as clip ids `kfb_react_<name>_a`, both rigs, in-place, seam / entry pose documented.
- **Unbox clip** (KEEP + FIT or DERIVE) with events `lidOff`, `reveal`.
- **Props glb:** clay-recoloured presents, lid as its own node, plus the POP timing JSON.
- **Catalogue patch** with exchange events: `offerReady`, `release`, `grab`, `secured`, `lidOff`, `reveal`, `reactStart`.
- **Reference videos:**
  - gift → unbox → reveal → reaction;
  - Fluff trade;
  - Fluff → gift.

  Medium and Large.

**Next gate after this one:** `KFB_TALK_GESTURE_KIT_01`.
