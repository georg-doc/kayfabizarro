# R23 · Milners Kindergarten Karaoke · Static test report

**2026-11-22 · DESIGN ONLY · LOCAL NODE ASSERT PROBE PASS · 0 human games.**
Source: [R23 candidate](R23_MILNERS_KINDERGARTEN_KARAOKE_2026-11-22.md); executable [R23 fixture](R23_KARAOKE_GEOMETRY_PRESSURE_PROBE.js). The fixture was executed in the current ChatGPT container with `node /mnt/data/kfb_r23/R23_KARAOKE_GEOMETRY_PRESSURE_PROBE.js`; exit0 and printed the exact counts below. Node version and browser were not recorded; this is **not** a GitHub Actions, Stage or physical-game run.

## Execution and checked facts

| Check | Observed |
| --- | ---: |
| Distinct ordered initial positions for three identified dice on six outer slots | **120** |
| SET-at-1 opening assertions across all starts | **360** |
| Candidate legal post-setup outer MOVE target checks (15 beats per ordered start ×3 currently die-free cards) | **5,400** |
| Max faces at beat18 | **6/6/6** for every tested start |
| First mandatory face6→TILT attempt with no optional actions | **Beat19 · HATE** for every start |
| Cumulative pressure sum after beat18 | **18** |
| Unique unordered 3-vertex triangles in regular six-vertex hexagon | **20** |
| FOCUS strictly inside / on boundary / outside | **2 / 12 / 6** |
| Complete automated matches | **0** |
| Human playtests | **0** |
| R23 browser, Stage, Site, public verification | **0** |

Every sampled legal target was a different **occupied card without a die**, never FOCUS; no die stacking was permitted. Counts enumerate **single-step candidate targets**, not every 15-step path (3^15 per start) and **not probabilities or balanced complete games**. For a deterministic representative path, the fixture uses the lowest-index legal target each turn and checks the pressure invariant. Other paths obey the same forced clock if all six remain occupied.

## Interpretation

1. **R22 stationary MOVE loop is resolved in this new baseline:** a successful post-opening MOVE necessarily increments the active die face. But it replaces the nontermination defect with a **fixed 19-beat countdown**. At beat k (k=3..18), HATE+FEAR+HOPE = k, so choosing a different outer card changes the **meaning**, not the first TILT timing.
2. **Potential seat/role lock:** awarding FOCUS to the face6→TILT actor on the first case would always reward the **PROBLEM** beat, not a balanced claim; the acting seat depends on starting player and player count. For a rotating starting player over n consecutive separate cases, first-TILT seats cover each seat once for n=2..6 in this fixture; this alone does not validate a scoring economy.
3. **Space offers narration, not a ready-made mathematical victory:** center strictly within 2/20 triangles, on edges 12/20, outside 6/20. Geometry requires an explicit edge treatment. “Center inside” cannot be turned into an unquestioned reward rule.
4. **Vacancy hazard:** the fixture assumes all **six public cards stay occupied**. Removing outer narratives during the case can leave fewer than three die-free occupied destinations; replacement/reentry must be defined before card capture is implemented.
5. **Real-card specificity unmeasured:** 0 card-art tests, 0 spoken causal-chain tests, 0 human timing, 0 humor/comprehension reports, 0 NPC editorial pulses and 0 validated card-claim mechanisms. The R23 concept is **not a balanced game**.

## Human test focus / one gate

Play actual illustrated and named six outside cards + one center in 2H/4H/6H, show/spin/sell introductions, one assertive spoken line = one SET or MOVE+TURN gesture. Observe legal destination confusion, real card identity, causal continuity, seconds/turn and desire for an **optional costly claim** before beat19. Ask Georg **KEEP/TUNE/FAIL** on R23 round-table karaoke core. **Do not import** R14 6→7 trophies, R17 B HOPE payouts, R21 Solution-only reward or imaginary fourth Quest die as a fix. No merge, second runtime owner, published Stage or Live claim.
