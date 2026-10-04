# RETURN · FIGHT-SANDBOX-03 data slice (Blender MCP) · 2026-09-30

Scope: answer Georg's Sandbox 02 feedback and the Resident's Blender questions. No library clip was changed.

**Output:** `KFB_Fight_Cartoon_Contact_03.json` (`kfb.fight-cartoon-contact/0.3`, 76 KB). It is the 0.2 data plus:
- facing per clip;
- follow-up rule;
- dust-cloud recipe;
- lying lift;
- limb capsules;
- hammer data;
- ring rule.

## Defects and open points (read first)

1. **The sideways / backwards facing was a convention mix-up, not a clip fault.**
   - The catalogue `facingYawDeg` is the shoulder-line angle (0 = rest facing). The sandbox used it as a forward direction.
   - Effect: idle and cloud fighters were turned 90°, and the run-in about 140° (backwards).
   - 0.3 gives `forwardYawDeg` per clip. The catalogue field keeps its meaning and is documented in `facing.convention`.
2. **Big in-clip turns leave fighters back to back at the end.** Affected: sword attack 61°, shoved-with-spin 158°, surprise uppercut 204°. Fixed by the follow-up re-facing rule (runtime, not data).
3. **The lying lift has no clean answer for the Raider.** Its head is much bigger than the Mixamo skeleton expects:
   - Lifting to the lowest vertex: the body rests on the head and floats a little.
   - Lifting to the body: the head sinks up to 0.5 m.
   - Head tuck: clears the head, but the head then looks up and reads as "awake".

   All three are in the data. **Georg picks the look** (`lying_options.png`). The Brute is clean.
4. **The hammer is inside its own body during wind-up and recovery** of `sword_and_shield_attack_a` (Raider frames 1–18 and 31–40), up to 0.68 m (Raider) and 0.84 m (Brute) deep.
   - No other library clip is better for a long handle.
   - Proposal: cartoon "hammer space". The hammer pops in on the hit and out after the swing.
   - Alternative: a dedicated overhead hammer-swing clip in a later Mixamo intake.
5. **Brute hitting Raider with the hammer still misses:** it passes 1.05 m above the Raider head, the same limit as high punches.
6. **`forwardYawDeg` of in-place runs** comes from the feet travel axis. For `kfb_locomotion_run_a`, the torso is turned 36° from the travel direction.

## Answers to the Resident's questions (§2 of GEORG_FEEDBACK)

| # | Question | Answer |
|---|---|---|
| 1 | Prop capsules and intersecting frames | `prop.capsulesInPropSpace` (handle r 0.08, head r 0.34, × rig scale); `prop.selfIntersection` |
| 2 | Arm and leg capsules | `rigs[rig].limbCapsules`. Raider arm 0.156 / 0.131 m, leg 0.116 / 0.113 m. Brute arm 0.422 / 0.388 m, leg 0.278 / 0.220 m |
| 3 | Lowest vertex of lying poses, lift per rig | `lift` (per frame, two curves) and `headTuck`. End minima match your S15 measurement (Raider standing_death_left −0.82 m) |
| 4 | `facingYawDeg` convention | shoulder-line angle = forward + 90; use `facing.clips[..].forwardYawDeg` |
| 5 | Prop-swing clip or offset for long handles | none in the library; `prop.visibleWindow` pop rule; the 0.3 table stages `sword_and_shield_attack_a` for the hammer head |

## Method

- **Forward yaw:** the mean of the hip-line and shoulder-line normals (loops: averaged over the cycle; locomotion: the feet swing axis). Checked against the catalogue: shoulder angle − 90 matches `facingYawDeg` on all clips.
- **Lift:** skinned vertices of the Orc meshes, every frame, with an allowed sink of 3 cm × scale.
- **Limb capsules:** the 80th percentile vertex distance per bone segment in `kfb_action_boxing_a` frame 1.
- **Hammer:**
  - the `clown_hammer.gltf` mesh in `handslot.r` space, as the sandbox attaches it (checked in a render);
  - the defender is placed at the smallest distance at which the hammer and the attacker stay 5 cm × scale clear during the 8 frames before contact.

## Proofs (looked at)

- `proof_facing_lift.png`:
  - top row, Raider pair: idle, run-in, cloud start (all 0.3), then the run-in as 0.2 did it (B turned away);
  - bottom row: lying end pose before and after `liftM`, Raider standing_death_left and Brute fall_flat.
- `proof_prop_hit.png`: the hammer hit at the contact frame for Raider-Raider, Raider-Brute, Brute-Raider (miss above) and Brute-Brute. The orange ball marks the puff.
- `lying_options.png`: the three lift options on the Raider.

## Files

| File | What |
|---|---|
| `START_HERE.md` | Claude Design brief (Resident Atlas) |
| `KFB_Fight_Cartoon_Contact_03.json` | Data (also in Motion Library `fight/`) |
| `proof_facing_lift.png`, `proof_prop_hit.png`, `lying_options.png` | Proofs |
| `SOURCE.json` | Sources |
| `source/*.py` | Facing, lift, capsules, hammer staging, data build, renders |

## Exactly one next gate

**Claude Design (Resident Atlas): apply the 0.3 brief and run acceptance 1–8.** Georg then picks the lift option and the hammer pop.
