# RETURN · Mixamo lane · Guitar A on the Orc Raider · 2026-09-24

Für Georg: Erster angepasster Mixamo-Clip. Die Gitarre hängt tiefer (untere Wirbelsäule statt Brust), die rechte Hand spielt auf dem Body, die linke greift außen am Hals. Beine, Hüfte und Oberkörper sind unverändert Mixamo; angepasst sind nur die Arme.

Status: **CANDIDATE · waiting for Georg's review** · no GLB export yet, no runtime change.

## 1 · Inbox inventory (Batch 1 + 2, all on KayKit rigs, Mixamo kept the uploaded skeleton)

| Clip | Rig | Frames @30 | Verdict |
|---|---|---|---|
| Playing Drums | Rig_Large (Brute) | 142 | drummer candidate (ORB-D1 lane B); right club hits the head → shoulder offset + collision pass needed |
| Guitar Playing A | Rig_Large + Rig_Medium | 144 | strong template → **fitted on the Raider (this return)** |
| Guitar Playing B | Rig_Medium (Caveman) | 250 | usable, turned −20…−55°, needs facing fix |
| Hip Hop Dancing | Rig_Medium (Toy Soldier) | 410 | strong, almost in place |
| House Dancing | Rig_Medium + Rig_Large | 595 | cut needed, travels up to ~2.6 |
| Thriller Part 3 | Rig_Large | 768 | show moment only |
| Chicken Dance | Rig_Medium (Caveman) | 144 | loop-ready |
| Step Hip Hop | Rig_Medium | 235 | loop-ready after zeroing travel |
| Wave Hip Hop | Rig_Medium | 506 | strong, arm wave = signature move |
| Locking Hip Hop | Rig_Medium | 511 | cut, contains a floor move |
| Slide Hip Hop | Rig_Medium | 520 | cut, spins ~600° in total |

Every clip keeps its body motion on the armature object (not the hips bone) and animates only the `wrist.*` bones, not `hand.*`. None of them animates `head`.

## 2 · What was done for Guitar A → Orc Raider

1. **Transfer:** the Caveman clip (Rig_Medium) was copied onto a duplicate of `Rig_Raider`. The rest poses are identical after the FBX axis rotation, so the transfer is exact (max error 0.00002). Object motion goes into the bones; the character is centred.
2. **Guitar placement search** (`gtr_fit.py`), grid over neck angle, yaw, face tilt, scale and position, with:
   - the right hand reaching the strum area over the pickups (shoulder–hand distance ≤ 0.63)
   - the left hand reaching the outer neck just below the headstock (≤ 0.62, and not closer than 0.46 so the elbow stays open)
   - no penetration of the guitar into body, legs or head across the clip (BVH test on the deformed meshes)
3. **Arm correction** (`gtr_apply.py`, `apply_fit2`): IK on `lowerarm.*` (chain 2). The pole targets follow the mocap elbow direction. Targets: right = strum point + the mocap strum motion; left = outer neck + a small slide along the neck taken from the mocap. Six correction passes for the hand offset, then baked to rotation keys. No constraints remain.

Chosen fit: neck 45° up, yaw 0°, face tilted 15° up, guitar scale 0.8, parented to `spine`.

## 3 · Numbers (`GA_final_check.json`)

- Guitar vs body, legs and head: **no penetration**.
- Right forearm rests up to 0.04 into the body edge; the left fist overlaps the neck by up to 0.07 (grip). The figure is ~2.4 units tall.
- Inner elbow angle: left 112–130°, right 99–154° (no locked arm).
- Hand position error vs target: max 0.04 (left) / 0.08 (right).
- Joint audit: elbow min 100.5°, wrist max 83.4° (the wrist is unchanged from the mocap).

## 4 · Honest limit

Short KayKit arms plus the Raider belly: in the raw mocap the hands already sit about 0.06 inside the belly. To get the guitar in front of the belly, the right hand has to move ~0.3 forward, and the guitar can only hang as low as the right arm can reach. Lower than this means an over-stretched arm.

## 5 · Files

- Dropbox `BLENDER MCP/_inbox/_probe_batch1/`:
  - `mixamo_probe_batch1_GA.blend`: copy with all MX_ scenes plus `GTR_RAIDER_A`
  - MP4 previews
  - scripts
- `orb_band_module_v5.blend` was not saved.
- Here: `gtr_fit.py`, `gtr_apply.py`, `mix_probe.py`, `GA_fit_applied.json`, `GA_final_check.json`, `gtr_fit_search5.json`, `preview/ga_raider_*.mp4`.
- Mixamo FBX sources stay in Dropbox (licence).

## 6 · Next

1. Georg reviews the hold.
2. If OK: GLB export on the original Raider rig and time-warp of the strum to 100 BPM.
3. Then the drummer: shoulder offset from the collision pass, plus a small orc drum set placed at the clip's contact points.
4. In parallel: dance loops (Chicken, Step, Wave) onto GothGirl / Raider.
