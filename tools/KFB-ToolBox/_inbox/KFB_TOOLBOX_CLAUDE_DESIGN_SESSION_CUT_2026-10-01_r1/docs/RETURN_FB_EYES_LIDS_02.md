# RETURN · FB-EYES-LIDS-02 · ToolBox Production-06

Brief: `skills/chat/workflows/FB_EYES_LIDS_02_2026-09-30/START_HERE.md` @ georg-doc-patch-3 (+ MEASURE.json, source/build.py, renders/*). Not merged, no commit (write access 403).

## Problems first
- **Check 7 FAILS on `round`: 30.0° (hinge) / 29.9° (slide) against ≤ 20°.** The brief contradicts itself here. §2.5 keeps today's lip with "6 steps", which is 7 segments over 180°, so every step is at least 25.7°. The limit is unreachable by construction. Georg decides: either more lip steps (12 gives about 15°) or a looser limit. The cut edge passes: 41.5° / 39.5° against > 35°.
- **Bug fixed along the way (also affected LIDS-01 hinge):** closed lids let rays through because of a stale `geometry.boundingBox`. The shadow fit's `Box3.setFromObject` caches it once. `_rehinge` now recomputes the box as well. Glide and fold are untouched.
- Cube Pets and every actor without a saved clay entry now get clay lids (on · hinge · round · level). The brief asks for this as the new default, but it changes how the pets look.
- Georg's saved FrizzleBob entry in this browser is **on: true · glide**, not "on: false" as in START_HERE. It stays as it is. The panel shows the "Use the new default (hinge, round)" button.
- For the rigid EyeRig shells, level applies only when the entry itself carries `tilt: 'level'`. Otherwise Georg's saved entry would have changed on load, which check 8 forbids.

## Acceptance on frizzlebob-earrig-v5 (Rigging › Eyes › "Run acceptance 1–10")
For the run: MEASURE.json anchor dy 0.21, ring 0.255 and oval 1.06/1.04/0.98/−25, with the lids at the START_HERE start values. Everything is restored afterwards. cm = R × 12 (R = 0.12 m).

| # | Result | Measured |
|---|---|---|
| 1 | PASS | EYE_DEF.socket surface · entry without socket → surface · saved legacy → legacy · legacy placement Δ 1.7e-16 |
| 2 | PASS | yaw L/R: 21.42/21.43 · 25.22/25.16 · 28.78/28.87 · 33.46/33.37 (ref 21.43 · 25.19 · 28.83 · 33.41) · max Δ 0.05° · rising · pitch within 0.03° |
| 3 | PASS | turn 0/10/20 → 28.78/38.78/48.78 (L) · 28.87/38.87/48.87 (R) · L−R 0.082° · step 10.000° · turnL 6/turnR 10 → turn 8, fine −2/+2, placement Δ 0 |
| 4 | PASS | corner gap 0 (round + cut) · corners in the head −1.29 … −0.99 cm (ref −1.28 … −1.00) |
| 5 | PASS | latitude spread 6.7e-8 rad · front rim y spread 0.0249 R (ref 0.0203) · rim at the sides −1.90 … −1.48 cm (ref −2.25 … −0.93) |
| 6 | PASS | 0 / 0 sclera rays, front / ¾, all four combinations |
| 7 | **FAIL** | cut: 41.5° (hinge) / 39.5° (slide) > 35 ✓ · round: 30.0° / 29.9° > 20 ✗ (see above) |
| 8 | PASS | glide, fold and the saved entry build bit-identically to the frozen LIDS-01 module `kfb-lib/_ref/clay-lids.v1.lids01.js` (max Δ 0) |
| 9 | PASS | eyeFrame Δ 0 · brow/nose/mouth Δ ≤ 2.2e-16 |
| 10 | PASS | level: max 0.42° off horizontal (hinge + slide, oval tilt −25/0/+15) · follow tips 25.00° / 0 / 15.00° |

Differences from Blender: the front rim spread is 0.025 R instead of 0.020 R, and the side rim sits a little shallower. The live gap is measured (pupil clearance) and not fixed at 0.035.

## Changes (additive)
- `kfb-lib/face-mount.v1.js`: `EYE_DEF.socket = 'surface'`, `eye.turn` + `eye.turnFine.{l,r}`, `migrateTurn()` (turnL/turnR are dropped on load and no longer exported), `e._kfbTilt`.
- `kfb-lib/clay-lids.v1.js` (schema 0.3): `mech: 'slide'` (`slidePositions`, `buildSlideGeometry`, one writer `lidPositions`) · `lip: 'round' | 'cut'` (double chamfer vertices) · `tilt: 'level' | 'follow'` · `metaVisible()` · `poseLids()` (`poseHinge` stays as an alias) · MECHS with a legacy flag.
- `KFB ToolBox Production-06.dc.html`: P06 loader injection removed · one turn slider plus "▸ Fine tune per eye" · clay panel: Hinge/Slide on top, Glide/Fold under Legacy, Lip, Lid line, default button · "Run acceptance 1–10" · "Look review" (overlay with PNG download).
- Production-07 uses the same libs and inherits the lib behaviour. Its panel still shows the old 4-way menu and turnL/turnR sliders (not touched).

## Look review
Rigging › Eyes › "Look review · hinge / slide × round / cut": 4 rows × (open · neutral · half · closed · angry · sad · ¾ · side · ¾ closed), rendered on the live actor.
