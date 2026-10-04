# RETURN · FIGHT-SANDBOX-02 data slice (Blender MCP) · 2026-09-30

Scope: replace the exact-contact staging of Sandbox 01 with cartoon contact. No library clip was changed.

**Output:** `KFB_Fight_Cartoon_Contact.json` (`kfb.fight-cartoon-contact/0.2`, 31 KB). It contains:
- collision shapes per rig;
- knockback directions for 9 reactions;
- a staging table for 17 attacks × 4 rig pairings (68 entries);
- the runtime rules;
- a proof set of 6 items.

## Defects and open points (read first)

1. **Cause of the wrong fall direction in Sandbox 01:** every reaction was turned to face the attacker. `fall_flat`, `shoved_reaction_with_spin` and `surprise_uppercut` travel forward in their own clip, so they fell into the attacker. Now each reaction carries a knockback direction and is turned so it always moves away from the attacker.
2. **Brute attacks Raider stays weak:** only 2 of 17 attacks stop within 0.15 m. High punches and kicks stop 0.6–1.9 m short. Low attacks work: headbutt 0.14 m, wild swipe 0.19 m, prop swing 0.44 m, which the prop covers.
3. **Two knockback directions are not measured:**
   - `reaction_a` (hit from the left) was judged by eye;
   - `standing_react_small_from_right` was taken from the clip name; its motion is too small to measure.
4. **"From behind" reactions** (`fall_flat`, `shoved_reaction_with_spin`, `surprise_uppercut`, and mostly `death_from_the_front`) turn the defender away at impact. The turn is hidden in the puff, but it reads as a sucker punch.
5. **Get-up clip:** `getting_up` starts face down. It fits after `fall_flat`; after face-up knock-downs there is a pose jump.
6. **Prop swing without a prop:** `kfb_action_swinging_a` is a rope-style swing (hands 2.2 m high, travels 3.9 m), not a weapon swing. The prop hit uses `kfb_action_sword_and_shield_attack_a` instead.
7. **Collision shapes are simple:** the head sphere ignores the hair crest, and the body capsule excludes the arms. Arms may cross the other body briefly; the separation rule only guards heads and torsos.

## Readable hits (visual gap ≤ 0.15 m × defender scale, at a placement where heads and bodies stay 5 cm × scale apart)

| Pairing | Readable / attacks |
|---|---|
| Raider vs Raider | 12 / 17 |
| Raider attacks Brute | 15 / 17 |
| Brute attacks Raider | 2 / 17 |
| Brute vs Brute | 16 / 17 |

On Raider vs Raider, the punches stop 0–15 cm short with the heads apart. That gap is what the puff is meant to cover.

## Method

- **Head sphere:** half the mean head width, resting on the chin, stored as an offset in head-bone space.
- **Body capsule:** from the hips to the neck, radius half the mean torso width.
- Both were measured on the Orc meshes in `kfb_action_boxing_a` frame 1.
- **Placement:**
  - the attacker is posed at its contact frame; the defender stands in the boxing stance and faces the attacker;
  - the defender is placed at the smallest hips distance where heads, head–body and bodies keep 5 cm × scale apart and the strike does not enter the defender;
  - `visualGapM` is what remains between the strike and the defender;
  - `impactPuffAt` is the midpoint of that gap.
- **Knockback:** the direction of the hips' travel for reactions that travel more than 0.3 m, otherwise the head recoil, checked on a side-view sheet (`reactions_side.png`: one row per reaction, frames 1 / impact / impact+12 / last, red cone = own facing).
- **Proof:** `proof_cartoon_contact.png` shows the placement at the moment of impact with the reaction already turned. The Raider heads are clearly apart and the puff sits between the fighters. In the row where the Brute attacks the Raider, the strike visibly passes above.

## Files

| File | What |
|---|---|
| `START_HERE.md` | Claude Design brief: change the Fight Sandbox to cartoon contact |
| `KFB_Fight_Cartoon_Contact.json` | Data (also in the Motion Library `fight/`) |
| `proof_cartoon_contact.png` | Placement proof (also in `fight/`) |
| `reactions_side.png` | Reaction direction check |
| `SOURCE.json` | Sources |
| `source/*.py` | Reaction directions, shapes, table, proof, data build |

## Exactly one next gate

**Claude Design (Resident Atlas): switch the Fight Sandbox to cartoon contact and run the proof set.** Georg then exports his verdicts.
