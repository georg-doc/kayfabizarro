# RETURN · FIGHT-SANDBOX-01 data slice (Blender MCP) · 2026-09-29

Scope: measure the existing fight clips on both rigs and pre-compute the staging for a Resident Atlas test scene. No library clip was changed.

**Result:**
- `KFB_Fight_Combos.json` (`kfb.fight-combos/0.1`) contains 16 attacks, 9 reactions, 13 standard combos and 1 paired clip (shoulder throw).
- It also contains staging for every attack × reaction × rig pairing: 576 entries.
- `START_HERE.md` is the brief for the Resident Atlas Claude Design project.

## Defects and open points (read first)

1. **`kfb_action_hurricane_kick_a` is unusable.**
   - The library clip animates only the root (spin + 2.5 m travel); every body bone is frozen in one pose.
   - The source FBX in `_inbox` has the same fault, so the bake is not the cause.
   - The intake 04 contact sheet shows a frozen figure that turns; this was missed in the intake 04 review.
   - It is excluded from the fight data. It needs a fresh Mixamo download.
   - The catalogue is not changed yet.
2. **`kfb_reaction_getting_up_a` starts face down, not on the back.**
   - The catalogue comment is wrong (checked by render).
   - It fits after `fall_flat_a`.
   - After the knock-outs that end face up, the pose jumps: surprise uppercut, crescent/death-left fall and shoulder-throw victim. `death_from_the_front_a` ends on the side.
   - No get-up-from-the-back clip exists.
   - The Choreo Lab 01 brawl storyboard used this get-up after a face-up knock-out; its storyboard frames did not show the jump.
3. **Raider vs Raider: heads get in the way.**
   - In 29 of 144 pairs the strike reaches only when the big heads overlap (`HEADS_COLLIDE`), and in 17 more other body parts touch (`BODIES_TOUCH`).
   - This is the same look decision as in AN-PERF-01: rubber-hose arm, head squash, or head hits.
   - It is less severe than AN-PERF-01 reported, because the defender here is measured in its recoiling reaction pose, not standing.
4. **Brute attacks Raider:** 41 of 144 pairs have no contact. High punches, the uppercut and high kicks pass over the Raider's head.
5. **Shoulder throw:**

   | Pairing | Result |
   |---|---|
   | Brute vs Brute | Works |
   | Raider vs Raider | Throws, but the heads clash during the grapple |
   | Mixed sizes | No grab: the root-aligned pair keeps each rig's own offset, so the actors stand metres apart |

   Proof: `proof_shoulder_throw.png`. Columns are the pairings Raider–Raider, Raider throws Brute, Brute throws Raider, Brute–Brute; rows are frames 41, 61, 81, 121.
6. **Contact and impact frames are measured candidates.**
   - Attack contact is the widest reach of the striking limb within 8 frames of its speed peak (catalogue `events.strike` where present).
   - Kicks use the highest toe; the back-flip uppercut uses the highest hand after the landing.
   - The reaction impact is the first strong head jolt while the head is still up, shared by both rigs.
   - Several reactions have their impact in the first 3–6 frames, because the Mixamo reaction starts at the hit.
7. **Facing rule:**
   - The defender turns its hip line to face the attacker, or its right side for `standing_react_small_from_right_a`.
   - The measured head-jolt direction was too noisy to set facing (the clips fall and spin), so it is kept only as a diagnostic.
8. **Multi-hit clips** (quad punch, fist-fight combos, taking-punch series) are synced on one measured hit only.
9. **Crescent kick:** the highest toe is the apex of a sideways sweep. It reads as a hit only for Brute vs Brute.

## Counts (pairMatrix, 144 pairs per pairing)

| Pairing (attacker vs defender) | LANDS | BODIES_TOUCH | HEADS_COLLIDE | NO_CONTACT |
|---|---|---|---|---|
| Raider vs Raider | 98 | 17 | 29 | 0 |
| Brute vs Brute | 113 | 26 | 5 | 0 |
| Raider attacks Brute | 104 | 39 | 1 | 0 |
| Brute attacks Raider | 97 | 6 | 0 | 41 |

54 pairs needed a sideways shift of the defender (up to 0.4 × its scale) to touch; the shift is stored as `defenderSideShiftM`.

## Method

- Source: the published Motion Library GLBs of both rigs (catalogue `2026-09-29b`), sampled at every frame.
- Meshes: Orc Raider and Orc Brute were posed from the same data; bone position error against the GLB is 0.0 cm.
- Placement:
  - the attacker stands at the origin;
  - the defender is posed at its impact frame, turned to face the attacker, and pushed along the attack axis until the limb mesh touches its mesh (tolerance 1 cm × rig scale);
  - then the bodies and the heads are checked for contact.
- Rig scale: the Brute is 2.568 × the Raider (hips height).
- Proof: `proof_contact.png` shows each pair at the attacker's contact frame.
  - Columns: hook, jab, back-flip uppercut, kick, headbutt.
  - Rows: Raider vs Raider, Raider attacks Brute, Brute attacks Raider, Brute vs Brute.
  - The pictures agree with the statuses in the data.

## Files

| File | What |
|---|---|
| `START_HERE.md` | Claude Design brief: Fight Sandbox scene in Resident Atlas |
| `KFB_Fight_Combos.json` | Fight data (also in the Motion Library folder `fight/`) |
| `proof_contact.png`, `proof_shoulder_throw.png` | Staging proofs (also in `fight/`) |
| `SOURCE.json` | Exact sources |
| `source/*.py` | Measurement, posing, staging, throw check, proof renders, data build |

## Exactly one next gate

**Claude Design (Resident Atlas): build the Fight Sandbox scene from `START_HERE.md`.** After Georg's verdict list, the Blender MCP chat reworks only the combos marked *rework*.
