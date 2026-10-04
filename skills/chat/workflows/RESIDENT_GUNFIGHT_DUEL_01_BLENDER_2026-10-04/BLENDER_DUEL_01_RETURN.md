# BLENDER-DUEL-01 REV — Return (ranged clips + weapon sockets)

Executor: Coworker (cloud bpy 5.0.1 + numpy glTF tooling) · 2026-10-04
Brief: `docs/RESIDENT_GUNFIGHT_DUEL_01/BLENDER_MCP_BRIEF.md` (Resident Atlas S17 session cut r2), revised with Georg before running.
Status: candidate, additive, nothing merged. Runtime integration is WSA / Claude Design work.

## Why the brief was revised

The duel used Mixamo / Motion Library clips for every pose:

- pistol: `kfb_action_shooting_gun_a` frozen at frame 40;
- rifle: `Idle_A` legs with the upper body borrowed from `Running_HoldingRifle` at 0.3 s.

It did not use the native KayKit Character Animations 1.1 ranged set, which already exists for Rig_Medium:

- `Ranged_1H_Aiming` / `_Shoot` / `_Shooting` / `_Reload`
- `Ranged_2H_Aiming` / `_Shoot` / `_Shooting` / `_Reload`

Georg's rule is that KayKit 1.1 is the first truth and other libraries are additive only. So the brief was changed in four ways:

1. Map the native clips first.
2. Put the grip into the weapon file, not into new arm motion.
3. Author only real gaps: the minigun hip hold and the two-hand fit for the ToySoldier rifle.
4. Check KayKit hits and deaths for direction before building new ones.

## Defects and open points first

1. **Rig_Large: NOT_RUN.** KayKit 1.1 has no ranged clips for Rig_Large; it only has `Melee_Block_Hit`, `Hit_A` and `Death_A`. The brief's "second export with the same names" is a retarget job and is not claimed here.
2. **The rifle stance is turned 31.2°.** The KayKit two-hand pose holds the gun along the line from the right hand to the left hand, which points 31.2° to the character's left. The rifle clips therefore carry a root yaw of −31.2°. The body stands bladed and the rifle points down the lane. The runtime places the actor root facing the target.
3. **The rifle left hand is a small authored IK correction.** The native left hand sits 0.016 FH off the bore line, and the bore is about 6° muzzle-up against a level lane. I lowered the grip 4.5° and moved the left arm onto `socket_grip_l`; the result is 0.000 FH. The arm change is small, but the clips are no longer byte-native.
4. **Minigun hold and fire are authored, so they are a gap and not KayKit.** The base is `Ranged_2H_Shooting`, with the right arm lowered 34° (elbow −8°), hips leaning back 4°, a root yaw of −18.7°, and the left hand set by IK onto the top of the body. Fire adds a chest kick at a 0.11 s rhythm.
5. **The die is my own CC0 build.** `kfb-weapon-dice.js` from the Arena repo was not readable. I matched the brief's numbers (0.14 FH, pips, origin at the centre), not the Arena look.
6. **Fight 02 points are NOT_RUN in this pass:** the hammer inside the body, lying figures below the floor, and push / tackle / body slam.
7. **B7 (rubber-rope ring kit) is NOT_RUN,** as the brief says, until WSA-STAGE-01 sets the contract.
8. **Runtime check is NOT_RUN.** Measured in Blender and in my glTF evaluator only, not in the Atlas.

## What changes for the runtime (per duel role)

| Role | Today | New |
|---|---|---|
| gun (blaster) | Mixamo `kfb_action_shooting_gun_a` frame 40, roll 75°, grip 23.3° | `kfb_action_aim_blaster_a` (= `Ranged_1H_Aiming`; plays once then holds; clamp it) + `kfb_action_shoot_blaster_a` per shot (one 13-frame recoil cycle, fire at frame 2). Weapon `UltraTurboHeroMan_Blaster_KFB.glb` attached to `handslot.r` with identity. **Roll 0, grip 0.** |
| rifle | `Idle_A` + `Running_HoldingRifle`@0.3 + procedural recoil, left hand free | `kfb_action_aim_rifle_a` + `kfb_action_shoot_rifle_a` (9 frames, fire at frame 0, recoil 11 cm back through chest and shoulder). `ToySoldier_Rifle_KFB.glb` attached with identity. Left hand is on the gun, no runtime IK. |
| minigun | rifle layer borrowed | `kfb_action_hold_minigun_a` / `kfb_action_fire_minigun_a` (33-frame loops, fire every 0.11 s). `CombatMech_Minigun_KFB.glb`; the barrel spin stays runtime on `CombatMech_Minigun_Barrel` (the name is kept). |
| hit | `Hit_A` / Mixamo `standing_react_small_from_right` | **Native already from the front:** `Hit_A` moves head and hips straight back 13 cm (small); `Hit_B` moves back 41 cm and down (big). Copied as `kfb_reaction_hit_front_small_a` / `_big_a`. The Mixamo "from right" clip is no longer needed. |
| death | `Death_A` | `Death_A` falls backwards (shot from the front). `Death_B` falls forwards (shot from behind). Both native. |
| dodge, throw | KayKit `Dodge_*`, `Throw` | Unchanged; already native. |
| muzzle | measured from a vertex slice | read the `socket_muzzle` empty: its +Z is the barrel; recoil runs along −Z. |
| die | procedural | `KFB_Die_Arena_KFB.glb` |

## Weapon files (`<Name>_KFB.glb`; the KayKit originals are unchanged inside)

- **Structure:** `socket_grip_r` (root, the `handslot.r` frame) → `weapon_frame` (grip rotation) → original mesh plus socket empties.
- **KayKit convention:** in the KayKit ranged clips the barrel lies along **+X of `handslot.r`**, with +Y up. The brief's "+Z of handslot" is not KayKit's convention. The weapon files bake this, so attaching them with identity is correct.

| File | Grip quat (xyzw) | Sockets (weapon frame, barrel +Z, origin = grip) |
|---|---|---|
| `UltraTurboHeroMan_Blaster_KFB.glb` | G1 (0, 0.70711, 0, 0.70711) = Ry +90° | `socket_muzzle` (0, 0.17, 0.76) |
| `ToySoldier_Rifle_KFB.glb` | G2 (−0.01556, 0.86623, 0.00117, 0.49940) | `socket_grip_l` (0, 0.04, 0.60), `socket_muzzle` (0, 0.20, 1.53), `socket_bayonet_tip` (0, 0.03, 2.06) |
| `CombatMech_Minigun_KFB.glb` | G3 (−0.23159, 0.81516, −0.01966, 0.53055) | `socket_grip_l` (0, 0.19, 0.28), `socket_muzzle` (0, 0, 0.77) |

**Carry grips from the locomotion set:** the carry grips Georg accepted were defined for an identity weapon. With the `_KFB` files, the new carry mount is the old one times G⁻¹ (`carry_convert.json`):

- pistol: walk (0.45449, −0.1937, 0.20524, 0.84486), run (0.24179, −0.13472, −0.06101, 0.95899)
- rifle staff: walk (0.20672, −0.16147, 0.73533, 0.62489), run (0.21404, −0.07063, 0.43171, 0.8734), sprint (0.14609, −0.21458, 0.50171, 0.82517)

This assumes the Mannequin `handslot.r` added in the locomotion set equals the KayKit character `handslot.r`. Not re-checked visually.

## Acceptance (measured, Rig_Medium; FH = Hero Man height 2.29)

| Clip | Frames | Loop | Lane deviation (hold) | Left hand → socket |
|---|---|---|---|---|
| `kfb_action_aim_blaster_a` | 33 | once + clamp | 1.3–1.5° (limit 3°) | — |
| `kfb_action_shoot_blaster_a` | 13 | once | 1.5° at rest, 17.6° muzzle-up at the recoil peak (intended) | — |
| `kfb_action_shooting_blaster_a` | 49 | loop, a shot every 12 frames | as above | — |
| `kfb_action_aim_rifle_a` | 49 | once + clamp (IK eased in over frames 4–12) | 0.1–1.8° | 0.000 FH (limit 0.02) |
| `kfb_action_shoot_rifle_a` | 9 | once | 1.6° | 0.000 FH |
| `kfb_action_shooting_rifle_a` | 33 | loop, a shot every 8 frames | 1.6° | 0.000 FH |
| `kfb_action_hold_minigun_a` | 33 | loop | 0.4° | 0.000 FH |
| `kfb_action_fire_minigun_a` | 33 | loop, 0.11 s | 0.1–1.3° | 0.000 FH |
| `kfb_reaction_hit_front_small_a` | 21 | once | — | — |
| `kfb_reaction_hit_front_big_a` | 27 | once | — | — |

Common to all clips:
- **Root motion:** all in-place.
- **Track binding:** every one of the 21 skeleton joints carries rotation and translation (skeleton-only library, the same node set as `KFB_Motion_perf_an01.glb`).
- **Grip visible in the palm:** see the hand close-ups in `BLENDER_DUEL_01_HOLD_PROOF.png`.

## Files and commits (`georg-doc-patch-3`)

| What | Where | Commit |
|---|---|---|
| Clip library (316,296 B, sha256 9308b6d3…) | `media/3D_Assets/Animations/KFB_Motion_Library/libs/Rig_Medium/KFB_Motion_ranged.glb` | `c59ded7b1dbfc4c42b5a6eae2b4218ebf7e66809` |
| Catalog patch (370 → 380) | `media/3D_Assets/Animations/KFB_Motion_Library/KFB_Motion_Library.catalog.patch_duel01.json` | `731aa118bd6ac41275610ab1d9e78d72b1315e21` |
| This return, weapons, die, proofs, scripts | `skills/chat/workflows/RESIDENT_GUNFIGHT_DUEL_01_BLENDER_2026-10-04/` | this commit |

Return folder contents:
- `BLENDER_DUEL_01_RANGED_REVIEW.mp4`: three fighters, side and three-quarter views, red = lane.
- `BLENDER_DUEL_01_HOLD_PROOF.png`: hold poses; side / top / three-quarter / hand views, muzzle marker.
- `BLENDER_DUEL_01_DIE.png`
- The three `_KFB` weapon files and `KFB_Die_Arena_KFB.glb`.
- `grips.json`, `carry_convert.json`, `clips_manifest.json`.
- Rebuild scripts: `clips.py`, `build.py`, `inject.py`, `wkfb.py`, `compose.py`, `dice.py`.

The weapons belong next to their KayKit originals later. WSA decides where they go.

## For VFX (Georg's voice note, routed to Claude Design / WSA)

The voice note asked for claymation particles as the base, plus layers for impact, slice, muzzle, smoke and AOE, using the existing VFX catalogue. The anchors for that now exist:

- **Muzzle VFX:** at `socket_muzzle`, pointing along +Z, on the clip `events.fire` frames.
- **Impact VFX:** on the first frame of `Hit_A` / `Hit_B`.
- **Minigun:** muzzle flash every 0.11 s.

No VFX was built in this pass.
