# FB-LIDS-LEVEL-FIX-01 · Erratum (angle sign) + check of ToolBox P08 · 2026-10-01

From: Coworker (Blender MCP lane). To: Claude Design (ToolBox), WSA, Georg.
Checked: `KFB_TOOLBOX_CLAUDE_DESIGN_SESSION_CUT_2026-10-01_r1` (Production-08), headless Chromium (software WebGL), frizzlebob-earrig-v5, with a fresh browser profile and no saved workspace.

## 1 · Erratum: my angle sign was reversed. Design is right.

- `probe_lids_level.js` measured the lid line against `right = up × forward` and reported `−sx · angle`.
- On P08 I measured both conventions side by side, with outward = eye − midpoint of both eyes, which is Design's convention. Mine is the exact negative at every setup:

| Setup | My probe | Outward convention (+ = outer corner up) |
|---|---|---|
| follow, oval −25 | −27.7 / −27.7 | **+27.7 / +27.7** |
| level, roll 0 | +0.06 / +0.07 | −0.06 / −0.07 |
| level, roll +15 | −16.3 / −16.3 | **+16.3 / +16.3** |
| level, roll −15 | +15.7 / +15.7 | −15.7 / −15.7 |

- **What this corrects in my brief:**
  - r2 "level" put the outer corners 5° too **low**, not too high.
  - My roll formula `sx · −1 · roll` turned + **down**. P08's `sx · roll` is correct: + = both outer corners up.
- The magnitudes in my brief are unaffected.
- Picture: `P08_roll_pm15.jpg` (roll +15 vs −15, eye close-up).

## 2 · P08 checked (my run, not Design's)

| Test | Result |
|---|---|
| Level (exact solve), roll 0 | −0.06° / −0.07° → PASS |
| Roll ±15 mirrored | +16.3 / +16.3 · −15.7 / −15.7 → PASS (same direction on both eyes; about 1° asymmetric between + and −, which matches Design's ±5 → +5.4 / −5.3) |
| Full PRODUCTION-01 self-test | **38 / 38 PASS** (178 s). Test 22: dx 0.568 → 0.520 (step −0.05). Test 24: yaw out 28.5° / 118.5° / 6.0° at splay 0 / 2 / −0.5, side Δ 90.0°, inward Δ 22.5° |
| Editor acceptance E1–E9 after the P06 + P07 merge | **9 / 9 PASS** |
| Standalone HTML | not checked here (Design: FAIL) |

So the two open runs in Design's TEST_REPORT (full self-test after the test-24 fix, and E1–E9) are now done: both PASS.

## 3 · Look note (Georg, 01.10.)

In a fresh browser, P08 loads FB earrig v5 with eye anchor dx 0.40 / dy 0.21 / oval −25. With those values the rig eyes sit **over the eyebrows**: the brows show only as dark stubs at the outer edge of each eye. Georg's own saved workspace was not loaded in my run.

- My lid pictures (FB_LIDS_LEVEL_CHECK.jpg and P08_roll_pm15.jpg) show that factory state. They are not a look reference.
- **Question for Design:** is this the intended default for earrig v5, or should the brows follow the eyes (`brow.follow`) or sit higher by default? Georg decides the look.
- The angle numbers do not depend on it, because they are measured relative to the eye and the head.

## 4 · Files

- `probe_p08_sign.js`: both sign conventions, plus screenshots.
- `probe_p08_tests.js`: runs `selfTest()` and `editAcc()`.
- `P08_roll_pm15.jpg`
