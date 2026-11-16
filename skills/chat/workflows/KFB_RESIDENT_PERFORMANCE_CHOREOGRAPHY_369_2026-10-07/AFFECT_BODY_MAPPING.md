# #369 · Affect → body mapping

Machine-readable recipe: `data/kfb_perf_layers.json` (candidate schema `kfb.resident-performance-layers/0-candidate`).

Layer numbers are degrees in bone-local XYZ. They compose as `base_basis @ delta` (Blender NLA COMBINE = three.js additive). The same numbers work on Rig_Medium and Rig_Large.

## Channel split (kept)

- **Body (this packet):** posture, torso, shoulders, arms, hands, props, and small head pitch/tilt for staging only.
- **EyeRig v6:** gaze target, lids, blink, eye emote. The body never bakes eyes.
- **Brows:** EyeRig `eyeFrame()` seam.
- **PetMouth:** rest shape and visemes. The body never bakes mouth or lip-sync.
- **Emanata / Bubble / Audio:** read-only. The body only names the semantic slot from `RESIDENT_AFFECT_EMANATA_MAP_PREP`.

## Emotion table

**Columns**
- **in / hold / out** are frames at 30 fps.
- **Face cues** are names for the existing owners, not new channels.
- **Base pose** and **micro** names refer to `data/kfb_perf_layers.json`.

| Affect | Base clip (donor) | Base pose layer | Micro | Head / torso | Hands | EyeRig cue | Brow | PetMouth rest | in / hold / out | Class |
|---|---|---|---|---|---|---|---|---|---|---|
| calm | KK:Idle_A | open_neutral | settle | level | at sides | ambient / target | neutral | neutral | 12 / loop / 12 | COVERED |
| curious | KK:Idle_A | curious | head_tilt | lean in 10°, head tilt 18° | at sides | target-focus, lids wider | asym up | thinking-neutral | 8 / ≤3 s / 10 | LAYERABLE |
| attentive | KK:Idle_A | attentive | nod (listening) | lean in 8°, chin level | at sides | speaker-focus | neutral-up | neutral | 8 / loop / 10 | LAYERABLE |
| joyful | ML:idle_happy_a · M big read KK:Cheering · L ML:react_delighted_a | open_soft | bounce_small | upright | out / up (clip) | target-warm | up | happy | clip / clip / 12 | COVERED |
| amused | ML:react_amused_a / idle_laughing_a | relaxed | — | clip pitches the head down: clamp ≤14° when the face must read | clip | target | up | happy | clip | COVERED |
| grateful | ML:gift_receive_a then KK:Idle_A / Holding_C | open_soft | soft_nod | head down 10°, chest open | hold the gift | giver | soft up | happy-soft | 6 / 1–2 s / 12 | LAYERABLE |
| proud | M: KK:Idle_A · L: KK:Flexing | proud | — | chin up 14°, chest out 10° | elbows out (M layer) | forward / target | slightly down-in | smile-small | 10 / loop / 12 | LAYERABLE (M) / COVERED (L) |
| surprised | ML:reaction_surprised_a / react_boggle_a | — | recoil (with prop) | back 10° then settle | clip / keep prop | cause, wide | up | surprised | clip 0.5–1 s | COVERED |
| worried | ML:react_scared_a (spike) | guarded (sustain) | — | chest in 10°, head down-side | hands to chest (layer) | cause-or-check | inner up | worried | 8 / loop / 12 | COVERED + LAYERABLE |
| sad | ML:idle_sad_a / react_disappointed_a | closed_low | — | head down 18°, torso sink | hang forward | down-or-away | inner up | sad | 12 / loop / 16 | COVERED |
| annoyed | ML:react_dismiss_a (accent) | closed_asym | — | turn away 14°, lean away | clip | target | down-in | annoyed | 8 / loop / 10 | COVERED |
| angry | ML:react_outraged_a / gesture_angry_gesture_a | forward_closed | — | forward 12°, chin down | fists out (clip) | target-hard | down-in | angry | clip / loop pose / 12 | COVERED |
| embarrassed | KK:Idle_A (+ optional NEW shrug) | closed_small | — | head down-side 18°, turn away | hands to chest | away | inner up | awkward | 8 / 1–2 s / 12 | LAYERABLE |
| suspicious | KK:Idle_A (+ ML:gesture_look_over_shoulder_a accent) | guarded_asym | head_tilt | side lean 12°, chest turn 14° | at sides | target-narrow, lids lowered | one down | thinking | 10 / loop / 12 | LAYERABLE |
| tired | ML:idle_old_man_idle_a (strong) | low_relaxed (light) | — | slump 16°, head drop 18° | hang | low | low | neutral-low | 16 / loop / 16 | COVERED |

## Pose / proximity / micro (contract 2.1–2.4)

| Channel | Item | Recipe | Class | Evidence |
|---|---|---|---|---|
| Base Pose | open, attentive, proud, tired, worried / guarded, suspicious, relaxed (+6 more) | `basePose.*` (14 entries) | LAYERABLE | near: `PREVIEWS/PROOF_LAYERS_BASEPOSE_near_*` (Farmer_B, Lorekeeper, Orc Brute) |
| Proximity | orient toward / away | object yaw: navigation / encounter owner | LAYERABLE (runtime) | E1–E4: yaw only, no foot clip |
| Proximity | step-in / step-out | position change: encounter seam | LAYERABLE (runtime) | measured spacings below |
| Relational | lean toward / away, side lean | `relational.*` | LAYERABLE | E1 beat 2 |
| Relational | turn toward (≤40°) | `relational.turn_toward` split 25 / 30 / 45 % spine / chest / head | LAYERABLE | axis probe |
| Micro | nod, soft nod, head tilt, recoil, settle, bounce, hand anticipation | `microEnvelopes.*` | LAYERABLE | E1 beats 2, 5, 6 |

Every layer touches spine / chest / head (plus arms in proud / guarded / closed_small). None touches hips / root / legs.

- **Feet:** toe-joint height is identical to Idle_A in all 42 layered poses (14 poses × 3 residents). `data/layer_pose_measure.json`.
- **Hands:** 0 hand-in-head.

## Measured spacing (Rig_Medium, real meshes) · `data/exchange_spacing_measure.json`

- **Hand-to-hand exchange** (gift_give / gift_receive): **1.14 m** root-to-root.
  - Hand meeting residual 0.016 m.
  - Head / hat / glasses mesh overlap 0 triangles.
  - Hand gap 0.54 m: holds the Small Fluff ball (0.42 m) or a 0.40–0.45 m present.
- **Social talk distance used in the beats:** 1.6 m. This is a staging choice; head overlap measured 0.
- **Large ↔ Medium staging:** 2.7 m (E3). Also a staging choice; head overlap measured 0.

## Distance readability (contract §9: far = silhouette)

- **Pass 1** (spine/chest ≤8°, head ≤12°): FAIL. Nothing reads at gameplay distance.
- **Pass 2** (amplitudes ~2× plus arm components): PARTIAL.
  - At about 5× body height on Farmer_B, proud, closed_low (sad), low_relaxed (tired) and curious (head tilt) still read through the hat silhouette.
  - On Lorekeeper and Orc Brute, mostly only closed_low reads.
  - attentive, relaxed, open_soft and listening do not read on any of the three.
  - `PREVIEWS/PROOF_LAYERS_BASEPOSE_distance_*`.
- **Consequence for the Composer:**
  - At FAR LOD, subtle affects need a large gesture, a full-body donor clip or one Emanatum. Layers alone are not enough.
  - Stopped after two passes as the brief requires (seam U2). Both passes are recorded in `passHistory` in the layers JSON.

## Face visibility

- **Hat / hair hides the face:** on hatted / long-haired Medium residents, any head pitch above ~14° hides the face.
- **Clips that do this:** several ML clips pitch the head far down — idle_laughing, react_amused, idle_rejected, idle_old_man, idle_drunk, idle_idle_c. During those peaks the EyeRig / PetMouth work is invisible.
- **Suggestion (not built):** when the face must read near the camera, the Composer adds a head-pitch counter layer (≤14° net). Seam U4.
