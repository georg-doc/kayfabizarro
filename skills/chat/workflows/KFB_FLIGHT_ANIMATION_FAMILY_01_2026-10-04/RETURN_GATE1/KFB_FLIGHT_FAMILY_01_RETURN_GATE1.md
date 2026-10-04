# KFB Flight Animation Family 01 — Return, gate 1 (SELF_FLIGHT · Combat Mech)

Executor: Coworker (Blender MCP, cloud bpy 5.0.1) · 2026-10-04 · Brief: "KFB Flight Animation Family 01" (WSA). Discussed with Georg before building.
Status: **candidate, nothing merged, no WorldBuilder/runtime integration, no Stage claim.** CARD_SURF is the next gate.

## Georg's decisions before the build (binding for this family)

| # | Decision |
|---|---|
| F1 | Combat Mech self-flight look = **Jetpack / Iron-Man**: body leans 30–45° forward in cruise, legs hang loose behind, Minigun forward. Superman-horizontal is kept for the Superhero later. |
| F2 | CARD_SURF uses the flight card as in `travel/KFB Travel Globe v13-1` (Georg: the flight card is the same there). The private Travel repo is not readable (404). The card's deformation code was also found at `travel/wip/travel_globe_wsa/terrain-planets-v1/card-carrier.js`; whether it matches Travel main 603f2a9 is **not verified**. |
| F3 | CARD_SURF actor = **KayKit Mannequin** (Georg's reference-actor rule), **not** the ActionFigure named in the brief. The accepted TMB-1E rider scale (2.0×) is carried over via the shared Rig_Medium. |

## Source audit

| Item | Exact source | Finding |
|---|---|---|
| Actor | `media/3D_Assets/KayKit_Mystery_Series6/1 - July 2024 - Combat Mech/characters/CombatMech.glb` (Atlas pin 2c92dd13) | Rig_Medium, 23 joints with the same names as KayKit Character Animations 1.1; `CombatMech_WingLeft/Right` are rigid mesh nodes under `chest`; no clips in the file. Textures: `combatmech_texture.png` (embedded, white/green) and `combatmech_texture_alt.png` (olive). |
| Weapon | `assets/gltf/CombatMech_Minigun.gltf` on `handslot.r`, identity | Atlas convention for the HoldingRifle torso. Barrel = separate node `CombatMech_Minigun_Barrel` (spin stays a prop animation, not in these clips). |
| KayKit clips | Rig_Medium General / MovementBasic / MovementAdvanced / CombatRanged | **No flight clip exists** in all 161 clips. Usable: `Jump_Idle` (airborne legs), `Running_HoldingRifle` (gun hold), `Ranged_2H_Aiming` (aim, one-shot raise then hold), `Jump_Land` (touchdown). `Spawn_Air` carries root motion (drops from above) and is not used. |
| Mixamo | none | The only flight clips in the libraries (`CharacterArmature|Flying_Idle`, `Fast_Flying`) are on a Quaternius monster rig, not usable. No Mixamo flight clip is downloaded. |
| Authored | Blender/Python offsets (source priority 5) | Hips lean/bob/sway, chest/head pitch–yaw–roll, leg swing/flutter, knee/foot, upper-arm counter-lean (keeps the Minigun level), wing spread. |

Isolated proof (before any combination): `ISO_1_source.png` (the Mech as delivered, front/3/4/side/back + olive), `ISO_2_atlas.png` (Idle_A and the current Atlas flight approximation reproduced from `data/cast.js`), `ISO_3_kaykit.png` (the native candidates on the Mech, 4 frames each).

## Review

`KFB_FLIGHT_SELF_01_CombatMech.mp4`: every clip in front / 3/4 / side at once, then cruise and boost in olive. Root fixed, no world movement. Note: in an orthographic front view a forward lean only shortens the figure; the side view shows the lean.

## KEEP / HOLD / REJECT

| Clip | Frames @30 | Loop | Runtime layer | Verdict | Defect / repair |
|---|---|---|---|---|---|
| flight_idle_hover | 64 | yes | BASE LOOP | KEEP | — |
| flight_cruise | 64 | yes | BASE LOOP | KEEP | — |
| flight_boost | 32 | yes | ADDITIVE/OVERLAY (or short BASE while boost > 0) | KEEP | The first build pointed the Minigun at the ground; fixed with an upper-arm counter-lean. |
| flight_climb | 64 | yes | ADDITIVE/OVERLAY (climb > 0) | KEEP | — |
| flight_dive | 64 | yes | ADDITIVE/OVERLAY (climb < 0) | KEEP | Same arm fix as boost. |
| flight_bank_left | 64 | yes | ADDITIVE/OVERLAY, blend pair | KEEP | Head/chest look into the turn, legs swing out. The root bank stays in Travel. |
| flight_bank_right | 64 | yes | ADDITIVE/OVERLAY, blend pair | KEEP | Mirror of bank_left. |
| flight_roll_reaction | 30 | no | ONE-SHOT (Travel rolls the root) | **HOLD** | The tuck pitches the head ~60° down (reads as ducking), and the Minigun points down while tucked. Georg decides the look. |
| flight_brake_recover | 36 | no | TRANSITION cruise → hover | KEEP | — |
| flight_land_prepare | 30 | no | TRANSITION hover → `Jump_Land` | KEEP | Ends in a held pose for the native `Jump_Land`. The blend into Jump_Land is not tested yet. |
| flight_aim (optional) | 64 | yes | ADDITIVE/OVERLAY upper body | KEEP | Native aim hold over the hover legs. |

Not built (optional in the brief): `flight_touchdown` uses the native `Jump_Land` as it is; `flight_fire_recoil` has no source.

Every clip has been checked for:

- **Root policy:** the root is untouched; the hips carry only lean and an in-place bob of at most 0.035.
- **Loop seams:** in every loop, the step from the last frame back to the first is no larger than a normal frame step.
- **Tracks:** no scale tracks, nothing to bake.

## Runtime mapping (for WSA, inputs from Travel)

- speed → idle_hover ↔ cruise
- boost → boost
- signed bank → bank pair
- signed climb → climb (+) / dive (−)
- roll intent → roll_reaction one-shot while Travel rolls the root
- calm → brake_recover → idle_hover
- transition age → land_prepare → Jump_Land

Climb, dive and bank are built as full poses over cruise. If the runtime uses additive blending, subtract cruise as the reference pose.

## Export

| File | Content |
|---|---|
| `KFB_FLIGHT_SELF_01_CombatMech_RigMedium.glb` | Combat Mech + 11 clips (1.56 MB), KayKit-derived (CC0). |
| `KFB_FLIGHT_SELF_01_manifest.json` | Clip names, frames, loop, class, sources per clip, root policy, known limits. |
| `flight.py` | Builds the clips deterministically from the KayKit sources. |

Known limits:

- **Authored, not captured.** All flight poses are authored offsets, not motion capture.
- **Mech-only wing tracks.** They exist only on the Combat Mech; other Rig_Medium actors ignore them.
- **Armed torso.** The torso is the Minigun hold. An unarmed torso is a later variant for the Superhero.
- **No thrust geometry.** There is no thrust or flame geometry; the pack has none.
- **Rig_Large not covered.** Rig_Large is not tested and not claimed.
- **No FBX.** FBX export is not done (GLB is the Three.js path); it can be added on request.

## Next gate

CARD_SURF with the Mannequin on the flight card (F2 and F3), then Superhero / Ultra Turbo Hero Man after the Mech look is accepted.
