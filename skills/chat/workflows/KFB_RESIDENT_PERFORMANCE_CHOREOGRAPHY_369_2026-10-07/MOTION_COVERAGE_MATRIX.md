# #369 · Motion coverage matrix

Test residents: **Farmer_B (Rig_Medium)** and **Orc Brute (Rig_Large)**. Head-contact checks for raised-hand clips were also run on Farmer_A, Lorekeeper and Goth Girl.

Prefixes: `KK:` = KayKit 1.1 native clip, `ML:` = KFB Motion Library (PR #344 / #356 / #358).

## How each clip was checked

- Sampled every 3rd frame on the real resident (every 2nd frame for the head-contact runs).
- **toe** = lowest toe-joint height. Idle_A reference: M 0.026 m, L 0.052 m.
- **hand in head** = palm point inside the head mesh. Head meshes include hats and hair.
- Contact sheets show start / peak / end for every clip: `PREVIEWS/SHEET_*`.

## Results

- **Feet:** the lowest toe joint drops at most 2.2 cm (Rig_Medium, `react_scared_a`) and 2.7 cm (Rig_Large, `react_amused_a`) below its Idle_A height (M 0.026 m, L 0.052 m). That is ≤ 1 % of body height and may be toe roll, not sinking. Listed, not judged as a defect.
- **Head contact:** raised-hand Motion Library clips hit the chibi head on Rig_Medium, on all 4 Medium residents (seam U1). On Rig_Large: 1 sample each in `react_fluffy_a` and `talk_arguing_b`.
- **Frame convention:** see RETURN.md.

## Totals (34 required behaviours, per rig)

| Class | Rig_Medium | Rig_Large |
|---|---|---|
| **COVERED** | 24 | 26 |
| **LAYERABLE** | 8 | 7 |
| **NEW_CLIP_REQUIRED** | 1 (shrug, authored) | 1 (shrug, authored) |
| **COVERED donor, UNRESOLVED seam** | 1 (point → U1) | 0 |

- **Large give / receive / trade:** COVERED for Large↔Large on the PR #358 FIT measurements (giver ≤ 0.008 m, receiver 0.000 m). Not re-staged here.
- **Large↔Medium exchange:** not solved (U3).

Pose / proximity / micro-motion channels: all LAYERABLE via `data/kfb_perf_layers.json` (see `AFFECT_BODY_MAPPING.md`).

## Matrix

| # | Behaviour | Class | Rig_Medium (Farmer_B) | Rig_Large (Orc Brute) | Notes / evidence |
|---|---|---|---|---|---|
| 1 | neutral / calm | COVERED | KK:Idle_A, KK:Idle_B, ML:idle_breathing_a | same | clean |
| 2 | curious | LAYERABLE | Idle_A + `basePose.curious` + `micro.head_tilt` | same | ML:idle_looking_around_a usable only with travel stripped (hips 0.52 m M / 1.34 m L) |
| 3 | attentive | LAYERABLE | Idle_A + `basePose.attentive` | same | |
| 4 | joyful / pleased | COVERED | ML:idle_happy_a (clean); KK:Cheering for the big read | ML:idle_happy_a, ML:react_delighted_a | ML:react_delighted_a hits the head on M: 8 / 13 / 15 / 21 samples (FarmerB / FarmerA / Lorekeeper / GothGirl) → do not use on M |
| 5 | amused | COVERED | ML:idle_laughing_a, ML:react_amused_a | same | head pitches down at peak; the hat hides the face (face-channel note U4) |
| 6 | grateful / affectionate | LAYERABLE | gift_receive + `basePose.open_soft` + `micro.soft_nod` | same | no hand-to-chest donor exists; not needed (E1 beat 6) |
| 7 | proud | LAYERABLE (M) / COVERED (L) | Idle_A + `basePose.proud` (chin up, elbows out) | KK:Flexing (native, Large only) | |
| 8 | surprised | COVERED | ML:reaction_surprised_a, ML:react_boggle_a | same | while holding a prop: `micro.recoil` (E1 beat 5) |
| 9 | worried / anxious | COVERED | ML:reaction_scared_a / react_scared_a (strong); `basePose.guarded` (sustained) | same | L react_scared turns away, hips travel 0.69 m |
| 10 | sad / disappointed | COVERED | ML:idle_sad_a, ML:react_disappointed_a, ML:idle_defeat_a | same | |
| 11 | annoyed | COVERED | ML:gesture_dismissing_gesture_a, ML:react_dismiss_a; pose `closed_asym` | same | |
| 12 | angry | COVERED | ML:gesture_angry_gesture_a, ML:react_outraged_a | same | clean on M and L |
| 13 | embarrassed | LAYERABLE | `basePose.closed_small` (+ optional shrug) | same | no donor clip |
| 14 | suspicious | LAYERABLE | `basePose.guarded_asym` + `micro.head_tilt`; accent ML:gesture_look_over_shoulder_a | same | |
| 15 | tired / bored | COVERED | ML:idle_old_man_idle_a (strong hunch); `basePose.low_relaxed` (light) | same | |
| 16 | listening | LAYERABLE | Idle_A + `basePose.listening` + `micro.nod` | same | ML:talk_watercooler_a unusable on M: 24–216 hand-in-head samples, 1,070 frames |
| 17 | speaking accent | COVERED | ML:talk_talking_a (0 contacts on Farmer_B), ML:talk_talking_c (0–3 on the 4 M) | same | ML:gesture_talking_a hits Lorekeeper's beard 43× → avoid on M |
| 18 | nod | LAYERABLE | `micro.nod` / `micro.soft_nod` envelopes | same | no nod clip in KK (173) or ML (395) |
| 19 | shake | COVERED | ML:gesture_thoughtful_head_shake_a, ML:react_contradict_a | same | clean |
| 20 | shrug | **NEW_CLIP_REQUIRED → authored** | `kfb_perf_shrug_a` | `kfb_perf_shrug_a` | see below |
| 21 | point | L: COVERED · M: donor exists, UNRESOLVED U1 | ML:gesture_pointing_a, ML:react_kayfabe_a (hand hits the head) | ML:gesture_pointing_a, ML:react_kayfabe_a (clean) | M: pointing 1 / 1 / 2 / 17, kayfabe 1 / 2 / 3 / 7 (FarmerB / FarmerA / Lorekeeper / GothGirl). Constant arm-abduction layer 12° / 20° made it worse (Farmer_B pointing 1 → 2 → 7; `data/head_clearance_layer_test.json`) → 2 passes, quarantined |
| 22 | wave | COVERED | **KK:Waving** (native; 0 contacts on all 4 M) | ML:gesture_waving_gesture_a (clean on L) | the ML wave grazes the head on M (0–2) |
| 23 | give | COVERED | ML:interaction_gift_give_a | ML:interaction_gift_give_fit_a (PR #358, Large↔Large measured there) | E1 / E2: palm-to-ball 0.27 m, ball r 0.21 |
| 24 | receive | COVERED | ML:interaction_gift_receive_a | ML:interaction_gift_receive_fit_a (PR #358) | M↔M hand-meet residual 0.016 m at 1.14 m spacing (`data/exchange_spacing_measure.json`) |
| 25 | trade | COVERED (M↔M staged; L↔L per PR #358) | give / receive + KK:Interact (inspect) + reaction | same | **cross-rig L→M is not solved** → seam U3 |
| 26 | inspect | COVERED | KK:Interact, KK:Use_Item, KK:Crouching (+ `basePose.curious`) | ML:interaction_picking_up_object_a | KK inspect clips are Medium only |
| 27 | carry | COVERED | KK:Holding_A/B/C, ML:idle_holding_idle_a, ML:idle_box_idle_a | ML only (no KK Holding on Large) | |
| 28 | roll / push | COVERED | ML:fluff_roll_push_a / heavy / big | ML:fluff_roll_push_a / heavy | donor PR #356 |
| 29 | knead | COVERED | ML:fluff_knead_press_a | same | Large needs the Part 2 Large chunk size (E4 note) |
| 30 | place | COVERED | ML:fluff_place_small_a, KK:PickUp (reverse) | ML:fluff_place_small_a | |
| 31 | flatten | COVERED | ML:fluff_pack_flatten_a | same | |
| 32 | patch | COVERED | ML:fluff_patch_press_a | same | |
| 33 | celebrate | COVERED | **KK:Cheering** (native; 0 contacts on 3 of 4 M, GothGirl hair 1) | ML:gesture_cheering_a (clean on L), KK:Flexing | ML:gesture_cheering_a on M: 9–32 head contacts → do not use on M |
| 34 | disagreement | COVERED | ML:talk_arguing_a, ML:react_contradict_a, + shrug | ML:talk_arguing_a (clean), talk_arguing_b (1 sample) | ML:talk_arguing_a: 4 contact samples on Farmer_B (minor); ML:talk_arguing_b on M: 15–22 → avoid on M |

## The one NEW_CLIP_REQUIRED: `kfb_perf_shrug_a`

- **Failed donors:**
  - Searched all KK native clips (Medium 139 actions incl. 8 T-poses, Large 34 incl. 6 T-poses) and all 395 ML catalogue clips: no shrug, palms-up or head-cock gesture.
  - PR #358 already reported the same gap: BOGGLE? uses `reaction_surprised` as a placeholder, and Georg was looking for a Mixamo shrug.
- **Why layering is not enough:**
  - The runtime layer schema (`kfb_perf_layers.json`) has constant poses and head/torso envelopes only. It has no timed, coordinated multi-bone arm gesture.
  - A shrug needs 8 bones (both arms, wrists, chest, head) on its own timing: anticipation dip, rise with overshoot, hold, release.
  - The clip is therefore authored. It is built as Idle_A plus a timed additive envelope, so it composes with the same layer math.
  - First try: a straight forearm flex folded the hands into the chest. That is variants A–C in `PREVIEWS/EVIDENCE_shrug_variants_A-F.jpg`; D is the delivered pose.
  - A tune pass (G / H, `PREVIEWS/EVIDENCE_shrug_tune_D-G-H.jpg`) was not better, so D was kept.
- **Look limit:**
  - KayKit hands are closed mitts, so palms can never show.
  - There is no clavicle bone, so the shoulders cannot rise.
  - On Rig_Medium it reads as an open-arm shrug with a head tilt. On Rig_Large it is closer to a flex.
  - Look decision for Georg.
- **Rigs:** Rig_Medium and Rig_Large. The same bone-local degrees work on both.
- **One clip, many beats:**
  - shrug;
  - BOGGLE? (asks back);
  - doubt in TRADE_DECLINED;
  - "dunno" when embarrassed;
  - suspicious accent.
- **Delivered:** `motion_library_delta/libs/Rig_{Medium,Large}/KFB_Motion_perf369.glb`. Joints-only node animation, same layout as the Motion Library libs. 35 samples at 30 fps = 1.13 s. Starts and ends exactly on KK Idle_A frame 0, so it works both as a one-shot and as an additive clip (reference frame 0).
- **Playback:** all 23 bones are keyed. Non-shrug bones hold Idle_A frame 0, so a one-shot needs a crossfade (≥ 6 f) in and out, like the PR #358 reactions.
- **Proof:**
  - Measured on Farmer_B, Farmer_A, Lorekeeper, Goth Girl and Orc Brute:
    - toe unchanged (M 0.026 / L 0.052);
    - hips travel 0;
    - hand-in-head 0 on 4 of 5 residents. Goth Girl's hair is touched in 1 sample at the peak (MINOR).
  - Export round trip (re-import + re-evaluate): ≤ 0.000001 m, 0.0000°.
  - Pictures: `PREVIEWS/PROOF_NEWCLIP_kfb_perf_shrug_a_4residents.jpg`, `BEATS_E3` beat 4.
- **Replaceable:** if Georg finds a better Mixamo shrug, the runtime keeps the semantic name and the file is swapped.

## Not counted, but found

- **ML:idle_idle_d is broken on both rigs.** The body is folded at frame 0. Do not use it.
- **A Large "low give / kneel offer" is a new-clip candidate, not authored** (see U3). The fix depends on a world decision (counter/stall surface vs. hand-to-hand).
