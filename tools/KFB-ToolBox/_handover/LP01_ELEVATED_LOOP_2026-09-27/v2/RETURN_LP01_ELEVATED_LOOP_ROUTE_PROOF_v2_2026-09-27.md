# LP01 · Elevated loop + underpass · route proof v2 · RETURN · 2026-09-27

**Why v2:** Georg's verdict on v1:
- the ring was a squashed mini loop;
- the beams and hangers ran through the track and did not read as cartoon;
- there was no real junction ("Weiche"): the two decks simply overlapped, so the through route could not be read or driven cleanly.

v2 answers these three points. The v1 files stay in place next to it.

## Defects and limits first

1. **Real physics cannot reach the top: cartoon physics must deliver about 1.46× the speed at the loop base.**
   - Left after the 10 m climb: 23.1 m/s. Needed for a 50 m loop: 33.7 m/s.
   - Options: a booster pad on the run-up, a "sticky track" rule in the loop, or a lower loop. With real physics, a loop of about 23 m would be the limit.
   - This is a game-physics decision for Georg and the Track Core. It is not a geometry problem.
2. **No structure at all.** This is deliberate after Georg's feedback. How the loop is carried (pylons, consoles, clay struts) is a job for the design-language brief. It must never cross the driving surface.
3. **The loop is 60 m high above the deck (50 m loop + 10 m base).**
   - That is taller than the real Mülheim Bridge pylons (~50 m) and taller than Perplexity's game-scale suggestion (apex 28–38 m).
   - `loop_H` is one parameter; Georg decides the size.
4. **The gore noses are markers only** (orange bollards). The crash-cushion look belongs to the design brief.
5. **Lateral load in the lane change rose to 0.57 g at full speed.** Cause: the shift is now 16 m (was 14) to get a 4 m gap between the lanes. Longer S-curves would lower it.

## What changed

- **Classic loop:** a clothoid ("teardrop") ring. Curvature rises smoothly from 0 to the top and back, so there is no jump in g-load at entry or exit.
  - Height 50 m, top radius 15.8 m, footprint 74 m long.
  - It shifts 32 m sideways, so entry and exit run past each other.
- **Earlier and longer run-up:** a 200 m climb to 10 m (max 6.25 %), a 30 m flat, then the loop. Descent and merge mirror this.
- **Real junction pieces, split and merge:**
  - One widened shared deck runs from the split to the gore nose. It becomes two decks separated by a 1.4 m gore gap.
  - The inner edges and barriers start at the nose.
  - A dashed lane divider runs across the junction.
  - There are no overlapping decks anymore.
- **Structure:** the v1 beams, hangers and support proxies are removed.
- **Layer names fixed:** `edgeL` / `barrierL` are now really on the left.

## Checks (auto)

| Check | Value |
|---|---|
| Lane-change S (110 m, shift 16 m): min radius / lateral load at 27 m/s | 131 m / 0.57 g |
| Max grade | 6.25 % |
| Loop height / top z / top radius | 50 m / 60 m / 15.8 m |
| Speed at loop base, real / needed | 23.1 / 33.7 m/s → cartoon factor 1.46 |
| Underpass: min clear height over the through lane | 24.6 m ✔ |
| Side gap to the through lane (low sections) | 4.0 m ✔ |
| Ring self-clearance | 28.5 m ✔ |
| Gore noses at x | −322.9 (split) / 277.1 (merge) |

## Perplexity input "Mülheim Bridge loop" (Coworker assessment)

**Useful:**
- the real bridge facts (main span 315 m, pylons ~50 m, width 27.2 m; to be verified);
- the game scale factor 0.6–0.75;
- ramps at the bridge ends, never mid-span;
- a clothoid/teardrop profile;
- trigger volumes and checkpoints along the centreline.

**Wrong or contradictory:**
- Its code (`y = apex·(1−x²)`) builds an **arch over the span, not a loop**. The text asks for a vertical closed curve. The arch is the "hump" v1 was criticised for.
- The speeds (14–19 m/s at radius 25–30 m) can work at the top, but they do not add up with the energy needed to climb the loop.
- Its structure proposal ("hanging elements to the main cables") is exactly what Georg rejected in v1.

**Adopt:** the bridge facts and the ramp placement, for the Mülheim Bridge set piece later. LP01 stays the generic recipe.

## Files

- `build_lp01_loop_v2.py` (md5 `162f4864…`)
- `lp01_loop_v2.routes.json`
- `lp01_loop_proof_v2.glb` (3.2 MB)
- `lp01_v2_overview.png`, `lp01_v2_junction.png`, `lp01_v2_side.png`
- Dropbox:
  - `LP01-ELEVATED-LOOP/KFB_LP01_LOOP_v2.blend` (new file; v1 kept).
  - The v1 routes JSON on Dropbox was overwritten by the v2 run, so it was restored as `lp01_loop_v1.routes.json`. The v1 original is also on GitHub.

**Gate:** Georg: PASS / TUNE on loop size, run-up rhythm and the junction.
