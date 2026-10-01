# RETURN · FB-EARS-FLOPPY-01 · ToolBox Production-06

Brief: `skills/chat/workflows/FB_EARS_FLOPPY_01_2026-09-30/START_HERE.md` @ georg-doc-patch-3 (+ SIM.json, AUDIT.json, source/sim.py, renders ×4). Not merged, no commit (write access 403).

## Problems first
- **lifting_a is not in the ToolBox.** The sim used Motion Library v6; this ToolBox pins the 204-clip v3 catalogue, which has no `kfb_action_lifting_a`. I scanned all bend-type v3 clips for head lean: the best real stand-in is `throw_shoulder_aggressor_a` (head 89.4° at 3.63 s, but moving there, not held). Check 5 therefore runs on a **scripted lean** over idle_b: head 0 → 97° forward by 1.75 s, held, then back. The same numbers are reported for the real clip as INFO.
- **Bone 1 share at full bend is 63 % against ≥ 60 %.** That is thin; any retarget difference could tip it.
- **Right ear peaks higher than left in the bend** (108° against 82°). That is the roll and mirror path, the same code as before; it still stays inside the 127° limit.
- **v5b is loaded from commit `23615cff`** (branch georg-doc-patch-3). PR #214 (`EAR.pin`) does not contain it. v5 stays available via `EAR.figV5` @ pin for comparison.

## Acceptance on frizzlebob-earrig-v5 (Rigging › Ears › "Run acceptance 1–7") → PASS 7/7
| # | Measured |
|---|---|
| 1 Defaults unchanged | frozen PR #214 module (`kfb-lib/_ref/ear-dangle.v1.pr214.js`) against the patched one, all new fields unset: the live actor with idle_b over 10 s, with gravity 0.4, and with wind 8 m/s plus limits ×1.3 (25 200 values each), and fresh v5 and v5b figures with procedural head motion plus 6 m/s wind (also with gravity): **max Δ 0** everywhere |
| 2 v5b weight-only | 18 meshes in both · max position Δ 0 m (≤ 1e-6) · 22 278 ear-influenced vertices (FB_Ear_L_v5 and FB_Ear_R_v5) · weight sum max \|Δ1\| 3.0e-8 · no vertex with > 2 joints · skin data of all other meshes identical |
| 3 Wind wired | Floppy · idle_b · 12 m/s travel wind: mean tip pitch L −28.6° / R −34.6° (−32 ± 8) · no wind: −0.0° / −0.0° (0 ± 3) · peak-to-peak with wind 23.3° (Blender 25.2) |
| 4 Idle bob | Floppy · idle_b · no wind: peak-to-peak L 16.3° / R 16.4° (14 ± 5) · mean −0.0° / −0.0° |
| 5 Bend | head scripted to 97° (measured 96.2° at 1.75 s; idle already leans 24.0°): tip **69.9°** (≥ 40) · bone 1 carries **63 %** (≥ 60) [44.3 / 18.9 / 6.7°] · peak L 81.8° / R 108.3° (≤ 127) · min −13.2° · [Blender lifting_a: +58 at full bend, peak 113] · INFO real clip throw_shoulder_aggressor_a: tip −16.7°, peak 127.0°, min −44.6° |
| 6 Clean shape | Perky / Floppy / Rag × 30 / 60 / 144 fps × (bend clip, idle_b + 12 m/s wind) = 18 runs · no bone beyond maxFwd / maxBack / maxRoll (worst overshoot 0) · NaN 0 |
| 7 Untouched | after Floppy → Rag + 3 s of sim: eyes / eyeFrame Δ 0 · brow / nose / mouth Δ 4.4e-16 (float noise) · ear base placement Δ 0 · eye / brow / mouth / lid entries identical · a 4-bone chain (the eye-stalk case) under a moving parent stays finite, swing 66.2° |


## Changes (additive)
- `kfb-lib/ear-dangle.v1.js` (new local copy of the PR #214 owner, now the loaded one): `sagFrom`, `sagShare`, `maxFwd` / `maxBack` / `maxRoll`, `bob`, `bobHz`; `setParams({ x: null })` clears an array; arrays shorter than the chain repeat their last value (4+ bone chains); wind contract in the header; `rigEars` passes the new fields from the rig JSON. Unset = today's code path, bit-identical (check 1).
- `KFB ToolBox Production-06.dc.html`:
  - figure switched to v5b (`EAR.figPin`);
  - wind fed every tick through `_earsTick` (live loop, sequence driver, acceptance): `wind = −(actor velocity, low-passed 0.2) + travel wind along −forward`;
  - Rigging › Ears: three presets "Try preset · this session only" (Perky / Floppy / Rag) with "Back to my saved ears"; the old four sit under "Legacy presets"; sliders for gravity start (°), idle bob (°), bob speed (Hz), travel wind (test, session only);
  - Save keeps a tried preset; export writes the new fields only when set (they are plain keys of `ears`).
- Georg's saved ears (dangle 1.5, stiff 1, damp 0.8, elastic 0.8, out 10.5, back −6, twist −14.5, sink 0.3, fwd −0.03) are untouched until he presses a preset.
- Production-07 still loads its own copy of the ear owner and the v5 figure; not touched.
