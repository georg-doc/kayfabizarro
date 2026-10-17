# #369 · Blender MCP · Resident Performance + Character Choreography · RETURN

- **Executor:** Blender MCP (Claude Cowork on Georg's Mac Mini). Blender 5.2.2 LTS with the Blender Lab MCP extension 1.0.3.
- **Execution mode:** BOUNDED_SLICE, source-isolated.
- **Repo:** `georg-doc/kayfabizarro`
  - Branch: `blender/resident-performance-choreography-2026-10-07`, cut from main `6efd7c807eaf9bd8afa6a3807c3d14a91a0ccdbf`.
  - Head after this packet: see the #369 issue comment. That comment is written after the head was read back.
- **Boundaries kept:**
  - no Open World / WB2 / PR #348 write;
  - no Site / Hub / Cloudflare;
  - no merge, no Live promotion;
  - no second EyeRig / PetMouth / dialogue owner;
  - no world coordinates or dialogue text in any clip;
  - Shield Fit #367 not started.

## Result in one sentence

The existing KayKit-native + KFB Motion Library vocabulary covers most of the required Resident behaviours. One gap was real and reusable, the shrug, and was authored for both rigs. The rest of the social / affect grammar is delivered as a small additive layer recipe instead of new clips.

## Totals (34 required behaviours)

| | Rig_Medium | Rig_Large |
|---|---|---|
| COVERED | 24 | 26 |
| LAYERABLE | 8 | 7 |
| NEW_CLIP_REQUIRED | 1 · `kfb_perf_shrug_a` (authored) | 1 · `kfb_perf_shrug_a` (authored) |
| Donor exists, UNRESOLVED seam | 1 · point (U1) | 0 |

Pose / proximity / micro-motion: 14 base poses, 5 relational layers, 7 micro envelopes. All are LAYERABLE recipes in `data/kfb_perf_layers.json`.

## Reused

- **KayKit 1.1 native:** Idle_A / B, Waving, Cheering, Interact, Use_Item, Crouching, PickUp, Holding_A / B / C, Hammering, Work_*, Walking_A (Medium); Idle_A / B, Flexing, Walking_A (Large).
- **KFB Motion Library v7 (PR #344):** idle / gesture / talk / reaction / interaction clips. 64 candidates evaluated per rig.
- **PR #356 Fluff:** roll_push, steer, knead_press, place_small, pack_flatten, patch_press, collect_debris; small Fluff ball.
- **PR #358 Exchange:** gift give / receive (+ Large FIT), react_* set, clay presents, held-POP timing.
- **Resident Atlas (main):** 5 real residents, Atlas rig families, props.

## Authored (additive, rollback-safe; nothing existing was changed)

- `motion_library_delta/libs/Rig_Medium/KFB_Motion_perf369.glb`
  - blob `f6ea22899b52997f2edcda0e5361e3e01e4c1b6c`, 52,972 B
- `motion_library_delta/libs/Rig_Large/KFB_Motion_perf369.glb`
  - blob `a8776c56827dfe252ec35faf11a9be12a4ae89e5`, 52,600 B
  - Both GLBs: one clip `kfb_perf_shrug_a`, 35 samples at 30 fps; joints-only node animation (Motion Library layout).
- `motion_library_delta/KFB_Motion_Library.catalog.patch_perf369.json` (not applied).
- `data/kfb_perf_layers.json`
  - Runtime additive recipes: basePose / relational / microEnvelopes.
  - The catalog patch points at this workflow path. On adoption, copy it next to the catalog in `media/`.

## Tests actually run (Blender 5.2.2, real resident meshes)

| Test | Count / result | File |
|---|---|---|
| Source pin + git-blob check | 123 files, 0 mismatches | `data/SOURCE_VERIFY_LOG.json`, `data/SOURCE_PIN_MANIFEST.json` |
| Resident isolation (bones / binding / height) | 5 residents, Idle_A 23/23 each | `SOURCE_ISOLATION.md` |
| Motion Library node clip → resident re-evaluation check | frame 0 vs native Idle_A: 0.000 m / 0.00° | — |
| Clip analysis (peak, toe, travel, hand-in-head) | 133 clip×rig runs (Farmer_B 69, Orc 64) | `data/clip_analysis_farmerb_orc.json` |
| Raised-hand head contact on 4 Medium residents | 16 clips × 4 = 64 runs | `data/hand_head_medium_4residents.json` |
| Head-clearance layer try (2 amplitudes) | 20 runs, non-improving → quarantined | `data/head_clearance_layer_test.json` |
| Layer poses on 3 residents | 42 poses: feet unchanged, 0 hand-in-head | `data/layer_pose_measure.json` |
| Shrug on 5 residents | toe unchanged, travel 0, hand-in-head 0 (Goth Girl hair 1) | `data/shrug_validation.json` |
| Shrug export round trip | ≤ 1e-6 m, 0.0000° (M and L) | — |
| Exchange spacing search + head overlap | 1.14 m, residual 0.016 m, 0 overlap at 1.14–1.6 m | `data/exchange_spacing_measure.json` |
| Cross-rig handover variants | 9 variants, none holds a gift | `data/crossrig_handover_measure.json`, `data/ground_handover_measure.json` |
| Encounter storyboards | 4 encounters, 26 beats, 0 head-mesh overlap, toe ≥ 0.014 m | `data/beats_*.json` |
| Previews | 6 contact sheets (136 clip rows), 3 layer / shrug proofs, 4 storyboards, 2 shrug evidence sheets | `PREVIEWS/` |
| Independent critic (separate agent, did not build) | PASS WITH FIXES, 15 findings, fixes applied below | — |

**Frame convention:**
- Values in `data/*.json` are Blender scene frames at 24 fps. The glTF clips were imported on a 24-fps timeline, so seconds = f / 24.
- Catalog events and the authored shrug use 30-fps samples.

## UNRESOLVED / quarantined seams

- **U1 · Motion Library raised-hand clips hit the chibi head on Rig_Medium.**
  - Contact samples on FarmerB / FarmerA / Lorekeeper / GothGirl:
    - react_delighted 8 / 13 / 15 / 21;
    - gesture_cheering 17 / 9 / 19 / 32;
    - pointing 1 / 1 / 2 / 17;
    - kayfabe 1 / 2 / 3 / 7;
    - talk_arguing_b 21 / 15 / 15 / 22;
    - talk_watercooler 28 / 31 / 24 / 216;
    - counting 8 / 11 / 13 / 32.
  - Rig_Large is clean (1 sample each in react_fluffy and talk_arguing_b).
  - Constant arm-abduction layer 12° / 20°: non-improving (pointing on Farmer_B 1 → 2 → 7).
  - **Route:** native-first on Medium (KK:Waving, KK:Cheering: 0 contacts on 3 of 4, 1 on Goth Girl's hair). Medium pointing needs a head-clearance FIT bake (IK) in a later gate.
  - Note: the PR #358 reactions `react_delighted`, `react_kayfabe` and `react_fluffy` inherit this on Medium.
- **U2 · Distance readability of subtle base poses.**
  - Pass 1 FAIL, pass 2 PARTIAL.
  - At about 5× body height only the strong poses read (Farmer_B via the hat; on Lorekeeper / Orc mostly closed_low).
  - **Route:** at FAR LOD the Composer uses a large gesture, a full-body donor clip or one Emanatum. Layers are near / mid.
- **U3 · Cross-rig hand-to-hand exchange (Large → Medium).**
  - Hand-height gap 1.43 m.
  - Orc bow 45°: 0.29 m left.
  - Bow + Farmer arms-up 30°: gap 0.03 m, but the Farmer's hands close to 0.11 m and cannot hold any gift.
  - No Large place / pick clip gets the hands below 1.08 m.
  - **Needs a decision:** counter / stall surface (no new clip) vs. a Large "low give / kneel offer" clip.
- **U4 · Face hidden by head pitch.**
  - Several ML idle / reaction clips pitch the head far down: idle_laughing, react_amused, idle_rejected, idle_old_man, idle_drunk, idle_idle_c. Hats and hair then hide the EyeRig / PetMouth area.
  - **Route:** a head-pitch counter layer (≤ 14° net) by the Composer when the face must read. Not tested.
- **U5 · ML:idle_idle_d is broken** on both rigs (folded body at f0). Do not use.
- **U6 · Large work chunk sizes not staged.** The E4 Orc knead / flatten used the Small ball, so the hands float (palm 0.62 / 0.96 m). Use the PR #356 Part 2 Large chunk sizes.
- **U7 · Shrug look.**
  - Mitten hands show no palms and the rig has no clavicle, so the shoulders cannot rise.
  - Reads as an open-arm shrug on Medium; closer to a flex on Large. One tune pass was non-improving.
  - Look decision for Georg. A sourced Mixamo shrug can replace it under the same id.
- **U8 · Storyboard limits (visual, not motion defects).**
  - E1: the Fluff ball is near-white under EEVEE and hard to see at the handover.
  - E2 / E3: the gift jumps to the ground between beats (no place beat shown).
  - E3: the Orc is seen from behind in beats 1–5.
  - E4: the wheelbarrow is uprighted between beats 3 and 4 with no beat shown; the Orc's hand passes over the Farmer's hat (not measured; only head-to-head overlap was).
  - E4: there is no damage / rebuild prop; a KayKit wheelbarrow stands in.
- **U9 · PR #358 Large reactions** start 0.115 m off native Idle_A in position (rotation identical). Donor note.

## Critic findings → what changed

| Findings | Change |
|---|---|
| 1–2 | Added `data/exchange_spacing_measure.json` (spacing search, overlap, no-layer cross-rig 1.43 m); staging distances labelled as choices |
| 3, 4 | Large contacts corrected; toe stated relative to Idle (≤ 2.2 cm M / 2.7 cm L) |
| 5 | One frame convention stated |
| 6 | Point on Medium → UNRESOLVED U1, test cited |
| 7 | Large give / receive cite the PR #358 FIT evidence; cross-rig marked unsolved |
| 8 | Seam list above |
| 9 | Shrug argument reworded; variant evidence added to `PREVIEWS/EVIDENCE_shrug_*` |
| 10 | Shrug look stated honestly (U7); one tune pass recorded |
| 11 | Distance sheet labelled; pass 2 written into `passHistory` |
| 12 | Storyboard limits listed (U8) |
| 13 | Crossfade requirement documented; verify log added |
| 14 | Per-rig totals |
| 15 | Adoption note on the layers file path |

## For the post-freeze Resident Performance Composer

- Consume `kfb_perf_layers.json` as additive COMBINE on spine / chest / head (+ arms only for proud / guarded / closed_small).
- Native-first for raised hands on Rig_Medium (U1).
- Play `kfb_perf_shrug_a` as a one-shot with a 6–12 f crossfade, or additive from reference frame 0.
- Exchange spacing for Medium is 1.14 m. Event frames come from the PR #358 catalog patch.

## Files

- `SOURCE_ISOLATION.md`
- `MOTION_COVERAGE_MATRIX.md`
- `AFFECT_BODY_MAPPING.md`
- `CHOREOGRAPHY_BEATS.md`
- `PREVIEWS/` (15 JPG)
- `motion_library_delta/` (2 GLB + catalog patch)
- `data/` (16 JSON)
- `scripts/kfb369_lib.py` (rebuild helper; Blender 5.2, source paths under the Dropbox job folder)

Working copies and the raw PNG renders are in Dropbox: `BLENDER MCP/RESIDENT_PERFORMANCE_369_2026-10-07/`.

## Exactly one next gate

**Blender MCP #367 · Shield Fit · Rig_Medium + Rig_Large.**

- Open decisions for Georg (U7 shrug look, U3 cross-rig exchange) do not block #367.
- Runtime integration waits for the Open World Architecture Freeze, as the brief requires.
