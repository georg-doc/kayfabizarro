# #376 · Motion Forge Pack 01 · usable clips · RETURN

- **Status:** built and exported (2026-10-08). Waiting for Georg's look check.
- **Trigger:** Georg, 2026-10-08: build it so that we can use it. Also: use his own Mixamo shrug, with arms less far back and a different timing.
- **Licence:** Georg's decision. KFB is free-to-play / portfolio, so non-commercial; creators are credited in game. No email to the UniMate authors for now. See `ATTRIBUTION.md`.
  - The POC 01 rule "no generated clip in a GLB on GitHub" is lifted for these three clips by that decision.

## What was built

Four clips on **Rig_Medium** (Farmer B) and **Rig_Large** (Orc Brute), 30 fps:

| id | Source | Body | Frames | Verdict |
|---|---|---|---|---|
| `kfb_gesture_point_low_a` | UniMate lane A (T3_p2_r2) | upper body | 80 | **Usable.** Closes #369 U1: 0 hand-in-head (old donor: 30). |
| `kfb_gesture_point_forward_a` | UniMate lane A (T3_p1_r1) | upper body | 80 | **Weak on Medium.** Right-hand reach is only 0.08 H, and the peak falls into the return transition. Large is fine (0.24 H). |
| `kfb_interaction_kneel_offer_a` | UniMate lane B (Mixamo model) | full body | 92 | **Usable with defects.** Toe slide in the transitions (M 0.137 H / L 0.108 H). Medium face hidden under the hat (U4). Does not close U3. |
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
| `libs/Rig_Medium/KFB_Motion_forge01.glb` | 363,528 | 4 |
| `libs/Rig_Large/KFB_Motion_forge01.glb` | 363,160 | 4 |

- Joints-only node-animation GLBs in the KFB Motion Library layout (`kfb369_lib.write_motion_glb`, templates Farmer_B.glb / OrcBrute.glb).
- **Round trip:** re-imported at 30 fps and compared with the Blender actions every 3rd frame (6 bone-pair distances). Max error **1.8e-6 m**.
- **Catalogue patch:** `KFB_Motion_Library.catalog.patch_forge01.json` (`kfb.motion-catalog.patch.v1`). ADDITIVE, NOT APPLIED.
  - Per clip: events per rig, `bonesChanged`, `lowerBody`, and `provenance` (generator, checkpoint, licence, credit line).

## Files

- `RETURN_PACK01.md` (this file), `ATTRIBUTION.md`, `KFB_Motion_Library.catalog.patch_forge01.json`, `qa_pack01.json`.
- `scripts/kfb_forge_pack.py` (md5 `23e59548…`).
- `libs/Rig_Medium/KFB_Motion_forge01.glb`, `libs/Rig_Large/KFB_Motion_forge01.glb`.
- `previews/FORGE_PACK01_overview.mp4`, `previews/FORGE_PACK01_shrug_vorher_nachher.mp4`.
- **Dropbox only:** `blend/KFB_MOTION_FORGE_PACK01.blend` (8 actions `{M|L}|FORGE|PACK|*` on `ARM_farmer_b` / `ARM_orcbrute`, scene `369_ISOLATION`).

## Open

| ID | Item |
|---|---|
| P1 | `point_forward_a` on Medium barely points. Drop it, or keep Large only. |
| P2 | Kneel: toe slide in the in/out transitions. Fix: foot IK lock or a lane B "stand → kneel → stand" expansion. |
| P3 | Kneel on Medium: head pitched down, hat hides the face (U4). Fix: head-up counter layer. |
| P4 | The kneel offer does not close the Large→Medium hand-height gap (U3). That still needs an IK hand target. |
| P5 | Shrug: Georg decides whether it replaces `kfb_perf_shrug_a` under the old id. |

## Exactly one next gate

Georg watches the two videos and says which clips go into the library (and P1 / P5).
