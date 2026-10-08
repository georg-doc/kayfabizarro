# #376 · Motion Forge Pack 01 · usable clips · RETURN

- **Status:** rev 2 (2026-10-08), after Georg's first look check. Waiting for Georg's look check of the new point.
- **Trigger:** Georg, 2026-10-08: build it so that we can use it. Also: use his own Mixamo shrug, with arms less far back and a different timing.
- **Licence:** Georg's decision. KFB is free-to-play / portfolio, so non-commercial; creators are credited in game. No email to the UniMate authors for now. See `ATTRIBUTION.md`.
  - The POC 01 rule "no generated clip in a GLB on GitHub" is lifted for these clips by that decision. After rev 2, two UniMate clips remain.

## Rev 2 (Georg's look check, 2026-10-08)

- **`kfb_gesture_point_forward_a` dropped.** Bad on both rigs; on the Orc the arm read as broken.
- **New `kfb_gesture_point_forward_b`, authored without a template** (`scripts/kfb_point_author.py`):
  - the right arm chain is aligned to one straight direction (elbow 0°, so no hyperextension);
  - Medium points 4° below horizontal, the Orc 18° below (Georg: Orc a bit lower);
  - spine/chest lean forward 3–4° and twist the pointing shoulder forward 3–5°; the head dips 6° along the arm;
  - timing (60 frames): body leads; the arm rises from frame 3, overshoots 7 % at frame 13 and settles by 18; one small pulse at 28; back on Idle_A at 57;
  - reach M 0.58 H / L 0.56 H; hand-in-head 0; legs untouched.
- **`kfb_interaction_kneel_offer_a` → `kfb_action_kneel_eat_a`.** Georg: it reads as preparing food and eating, not as offering.
  - Use it for eating, working or writing.
  - A chair + table variant needs a seated lower body.
  - Not for offering: the head looks down at the hands; an offer must look at the counterpart.

## What was built

Four clips (rev 2) on **Rig_Medium** (Farmer B) and **Rig_Large** (Orc Brute), 30 fps:

| id | Source | Body | Frames | Verdict |
|---|---|---|---|---|
| `kfb_gesture_point_low_a` | UniMate lane A (T3_p2_r2) | upper body | 80 | **Usable.** Closes #369 U1: 0 hand-in-head (old donor: 30). |
| `kfb_gesture_point_forward_b` | authored (rev 2) | upper body | 60 | **New.** Straight arm, Orc lower. Waiting for Georg's look. |
| `kfb_action_kneel_eat_a` | UniMate lane B (Mixamo model) | full body | 92 | **Usable as eat / work** (rev 2). Toe slide in the transitions (M 0.137 H / L 0.108 H). Not an offer. |
| `kfb_gesture_shrug_georg_a` | Georg's Mixamo shrug | upper body | 69 | **Usable.** Arms less far back, shorter hold. Candidate to replace `kfb_perf_shrug_a`. |

**Every clip:**

- starts and ends exactly on KayKit Idle_A frame 0 (smoothstep transitions: 10 frames for points, 16 for the kneel, 8 for the shrug);
- has 0 hip travel on gestures and 0 hand-in-head samples;
- keeps feet and knees at or above the ground (per-frame hips lift: M 0.038 / L 0.058, kneel only).

**Gestures are upper-body only.** Root, hips and legs stay on Idle_A frame 0. Reason: the clip stance differs from the Idle_A stance (toe x 0.112 vs. 0.236), which made the feet slide in the transitions.

### Shrug changes (Georg's feedback)

- **Arms:** each arm chain rotates about its shoulder so the hand's backward swing is **35 %** of the original.
- **Timing** (source 24 fps):
  - rise 1–16 unchanged;
  - hold 16–40 shortened from 24 to **9** source frames;
  - drop 40–52 unchanged;
  - settle trimmed to 6 frames;
  - then resampled to 30 fps.
- **Result:** spread M 0.36 / L 0.46; lift M 0.56 / L 0.51.

## Export

| File | Bytes | Clips |
|---|---|---|
| `libs/Rig_Medium/KFB_Motion_forge01.glb` | 345,012 | 4 |
| `libs/Rig_Large/KFB_Motion_forge01.glb` | 344,640 | 4 |

- Joints-only node-animation GLBs in the KFB Motion Library layout (`kfb369_lib.write_motion_glb`, templates Farmer_B.glb / OrcBrute.glb).
- **Round trip:** re-imported at 30 fps and compared with the Blender actions every 3rd frame (6 bone-pair distances). Max error **1.8e-6 m** (rev 2 re-checked).
- **Catalogue patch:** `KFB_Motion_Library.catalog.patch_forge01.json` (`kfb.motion-catalog.patch.v1`). ADDITIVE, NOT APPLIED.
  - Per clip: events per rig, `bonesChanged`, `lowerBody`, and `provenance` (generator, checkpoint, licence, credit line).

## Files

- `RETURN_PACK01.md` (this file), `ATTRIBUTION.md`, `KFB_Motion_Library.catalog.patch_forge01.json`, `qa_pack01.json`.
- `scripts/kfb_forge_pack.py` (md5 `23e59548…`), `scripts/kfb_point_author.py`.
- `libs/Rig_Medium/KFB_Motion_forge01.glb`, `libs/Rig_Large/KFB_Motion_forge01.glb`.
- `previews/FORGE_PACK01_overview.mp4`, `previews/FORGE_PACK01_shrug_vorher_nachher.mp4` (rev 1), `previews/FORGE_POINT_B_zeigen_vorn.mp4` (rev 2).
- **Dropbox only:** `blend/KFB_MOTION_FORGE_PACK01.blend` (8 actions `{M|L}|FORGE|PACK|*` on `ARM_farmer_b` / `ARM_orcbrute`, scene `369_ISOLATION`).

## Open

| ID | Item |
|---|---|
| P1 | `point_forward_b`: Georg's look check. |
| P2 | Kneel/eat: toe slide in the in/out transitions. Fix: foot IK lock or a lane B "stand → kneel → stand" expansion. |
| P3 | Chair + table variant of the eat clip: upper body of `kfb_action_kneel_eat_a` on a seated lower body, plus a table/chair prop. Not built. |
| P4 | Offer (U3): an authored offer with look-at at the counterpart and an IK hand target at the receiver's hand height. Not built. |
| P5 | Shrug: Georg decides whether it replaces `kfb_perf_shrug_a` under the old id. |

## Exactly one next gate

Georg watches `FORGE_POINT_B_zeigen_vorn.mp4` and says whether the point is OK, and whether P3 / P4 should be built.
