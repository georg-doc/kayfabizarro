# #376 · Motion Forge POC 01 · UniMate on Rig_Medium / Rig_Large · RETURN

- **Status:** done (2026-10-08). Waiting for Georg's look check.
- **Licence boundary:**
  - R&D / donor material only. UniMate checkpoints are CC BY-NC 4.0, and the training data keep their own terms (Mixamo, Truebones, Objaverse).
  - No generated clip is in the Motion Library, on main, or in any GLB on GitHub.
  - The 99 retargeted actions (`M|FORGE|…`, `L|FORGE|…`) exist only in the Dropbox blend copy.
- **Machine:** Mac Mini, Apple M4, 16 GB, no CUDA.
- **Install:** `~/KFB_MotionForge/`, outside Dropbox, about 3 GB.

## Result in one sentence

UniMate runs on the M4 and drives our KayKit rigs directly. Of the three gaps, only **T3 low point on Rig_Medium** produced something better than what we have. T1 (shrug) and T2 (kneel offer) did not beat the existing donors.

## Verdict per task

| Task | #369 seam | Best result | Verdict |
|---|---|---|---|
| **T3 low point** | U1 | Lane A Medium `T3_p2_r2` and `T3_p1_r1`: a forward point at waist height, face visible, **0 hand-in-head** (existing donor `kfb_gesture_pointing_a`: **30**) | **Useful donor.** First result that solves U1 without IK. Lane B also points low, but pitches the head down so the hat hides the face (U4). |
| **T2 kneel / low offer** | U3 | Lane B Large `T2_p0_r1`: a real kneel (head down to 72 % of standing), hands forward 0.64 H; offer hands at 1.246 units vs. 1.356 for the donor `gift_give_fit` | **Not solved.** The hand-height gap to a Medium resident (idle hand ≈ 0.48 units) shrinks only from 0.88 to 0.77 units (−12 %). The kneel is held for the whole 2 s, with no getting down or up. Lane A never kneels. |
| **T1 shrug** | U7 | Lane A Medium `T1_p1_r0` / `T1_p1_r2` ("palms up"): spread +0.59 / +0.67, lift +0.80 / +0.65 (donors: +0.20–0.35 / +0.38–0.54) | **No better than the donors.** The exact training caption "shrugs its shoulders" barely moves. Stronger prompts move more, but read as flailing or cheering, and some hit the head (up to 15 samples). Georg's raw Mixamo shrug stays the best reference. |

**Lane comparison:**

- **A** (UniML3D v3, direct-to-rig) keeps the chibi head clear and the face visible, but its "kneel" prompts never kneel.
- **B** (Mixamo model, then retarget) knows humanoid postures such as kneeling, but brings human head-down looks and sideways turns.
- Neither lane is a production lane.

## Measurements (`qa_all.json`)

99 clips: 45 on Medium, 54 on Large; 60 frames at 30 fps. Units are fractions of the rig's head height H unless stated.

| | Medium | Large |
|---|---|---|
| Clips with a hand-in-head sample | 5 / 45 | 3 / 54 |
| Foot slide, median / max | 0.034 / 0.534 | 0.028 / 0.413 |
| Lowest foot (ground penetration) | −0.026 | −0.013 |
| Hip travel, max | 0.09 | 0.086 |

- **Large foot slides** (0.4–0.5) come from lane B shrugs where the figure turns sideways.
- **Ground penetration** happens on the kneels. It fits Georg's open ground-clearance rule (#369 E4).
- **Model-side limits** (as stated by the UniMate authors): no contact model; 2 s per sample; longer motion needs "expansion".

## How it was run

1. **Rigs:** `KFB_RigMedium_FarmerB.glb` / `KFB_RigLarge_OrcBrute.glb`, exported from the 369 scene in rest pose (23 bones).
   - `rig_preprocess` with offline rule labels (no LLM key) and facing pair `upperleg.r` / `upperleg.l`.
   - `handslot.*` relabelled `Hand End` by hand.
   - 22 joints each, within the joint limit.
2. **Lane A:** `unimate_uniml3d_f60_v3` (step 150k) on both rigs.
3. **Lane B:** `unimate_mixamo_f60_v2` (step 120k) on the dataset `mixamo` skeleton. It needs only `features/mixamo/cond.npy` and the Michelle canonical GLB from UniML3D.
4. **Prompts** (training-caption style, see `prompts.json`): 3 per task; 3 repetitions; seed 7; cfg 3.
5. **Driving the canonical GLBs:** `run_animate_motion.sh`, with pip `bpy` 4.0 through a `blender` shim.
6. **Transfer onto the 369 residents** (`kfb_forge.py`): world-rotation transfer, the same math as `ml_bake.retarget`.
   - Rest alignment per bone; Mixamo vs. KayKit offsets are 0–19°, and 0° for lane A.
   - Hips translation scaled by hips height; root at rest.
7. **QA** per clip, the #369 measures: toe slide, ground, hip travel, `kfb_talk.hand_in_head`, plus per-task numbers (shrug spread / lift, offer height / reach / kneel depth, point reach / below-shoulder).
8. **Contact sheets:** donor rows first, then the top 3 per lane by score, 5 frames each.

### Mac patches (local, not upstream)

- `UNIMATE_DEVICE`: sampling device override; the config hard-codes `cuda`.
- **MPS float32:** adaptive solvers default to float64 time, which MPS does not support.
- **`UNIMATE_ODE=midpoint`, 50 steps:** fixed-step ODE instead of the paper's adaptive `dopri5`. On the M4 that is about 1 min per sample (dopri5 ≈ 1.7 min). This deviates from the paper's sampler.
- **The patches are not tested for quality** against the paper's sampler.

## Files

- `RETURN.md` (this file), `prompts.json`, `qa_all.json` (all metrics + donor metrics + sheet plan).
- `scripts/kfb_forge.py` (import, retarget, measure, render), `scripts/forge_sheet.py`.
- `previews/FORGE_POC01_T1_M.png`, `…_T1_L.png`, `…_T2_L.png`, `…_T3_M.png`, `…_T3_L.png`.
- **Dropbox only:**
  - `blend/KFB_MOTION_FORGE_POC01.blend` (99 FORGE actions on `ARM_farmer_b` / `ARM_orcbrute`, scene `369_ISOLATION`);
  - UniMate FK preview MP4s and animated GLBs under `~/KFB_MotionForge/samples/`.

## Open

| ID | Item |
|---|---|
| F1 | Licence: no shippable use unless a commercially licensable generator or extractor is found, or a licence is cleared. |
| F2 | T3 low point (Medium): if Georg likes the look, re-author it by hand or with IK on the KayKit rig, using the generated clip only as a reference. That keeps the donor clean. |
| F3 | T2: try motion expansion (stand → kneel → offer → stand) on lane B, plus an IK hand target at Medium hand height. Without IK the gap stays. |
| F4 | Lane B head pitch (U4): a head-up counter layer if lane B is kept. |
| F5 | Kneel ground penetration: part of the global ground-clearance rule (#369 E4). |

## Exactly one next gate

Georg looks at the five contact sheets and decides whether F2 (re-author the low point) or F3 (expansion + IK for the kneel offer) is worth a follow-up, or closes the POC.
