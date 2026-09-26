# SC02b · Support family redesign · RETURN · 2026-09-26

**Trigger (Georg, 26.09):** "no more tinkering → re-conceive and build clean". The v2–v4 shafts were regressive, and even v4 was not the approved form.
**Status:** CONCEPT + HEIGHT-LADDER PROOF. Nothing is re-placed on the fixture yet. Georg looks first.

## Defects first

1. **Three repairs at the same point (v2 → v3 → v4) patched the donor profile instead of fixing its cause.** That was wrong. The process rule from now on: redesign after two failed repairs.
2. **Root cause:** `rkit3_lib.build_support_v2` defines the shaft with **absolute** foot/waist heights (0.8 / 1.4 / 2.6 / 3.0 / 3.4 m) against capital heights **relative** to the top. Below roughly 6 m the two sets cross, and the lathe folds. No footing or scaling trick fixes that cleanly.
3. **trunk at 3–4 m looks melted:** the roots are too wide for short supports. This is a style-layer issue. Proposal: make root spread scale with height, or disable organic styles below about 5 m.
4. **Not re-placed on the fixture yet**, by design. SC02 v4 (PR #226) stays as the placement/checks reference only.

## Concept (clean)

`SC-LIB/sc_support.py`, a new family. The donor is unchanged, and only its `organic_shaft` style layer and `rounded_box` are reused.

- **Profile by height shares with clamps:**
  - foot flare `0.30·H` (0.6–2.2 m);
  - capital flare `0.28·H` (0.55–1.6 m);
  - disc band 0.22 m;
  - the shaft gets the rest and tapers from 2.1 to 1.65 m radius (thicker at the base).
- **z strictly increasing by construction**, asserted in code, so the lathe can never fold.
- **Pedestal class:** if the remaining neck is under 0.35 m (about H < 3.3 m), the support becomes footing + one soft capital with no shaft.
- **Footing:** round, with the v1 block proportions (6.2 m, top +1.0, sunk 0.8). Only a narrow skirt follows the ground.
- **Bearing plate:** follows the soffit (bank and grade) and is embedded 0.25 m in the track body. No shaft vertex may rise above the plate top.

## Height-ladder proof (3, 3.5, 4, 5, 7, 9, 12, 15 m × classic, trunk)

16/16 PASS:
- profile monotonic;
- 0 shaft vertices above the plate top;
- lowest point sunk 0.8 m (footing) or at 0 m (roots);
- footing rim 5 cm below the ground.

Preview: `sc02b_height_ladder.png` (classic in front, trunk behind).
Blender: `KFB_SC02B_SUPPORT_LADDER_v1.blend`, collection `SC02B_SUPPORT_LADDER` at (1400, −2600).

## Exactly one next gate

**Georg · look PASS / TUNE / REJECT on the classic ladder** (and whether organic styles should exist below about 5 m). Only then does SC02 re-place the family on the fixture route and replace the v4 GLBs.
