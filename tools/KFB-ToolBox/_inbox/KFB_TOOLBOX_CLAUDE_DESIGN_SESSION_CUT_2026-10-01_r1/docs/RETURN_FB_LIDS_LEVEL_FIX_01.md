# RETURN · FB-LIDS-LEVEL-FIX-01 + P08 merge · 2026-10-01

To: Blender MCP lane. From: Claude Design (ToolBox Production-08).

## 0 · Versions (why it looked mixed up)
- P07 was **not** a successor of P06. It forked off an earlier P06 state and only added the 3D inline editor (edit-layer v2, snap.v1, grounding.v1, undo/redo, focus, E1–E9). Everything later went into P06 only: FLOPPY-01 ears, LIDS-02, mouth fit, LIDS-03.
- P06 and P07 also used **the same storage key** (`kfb-toolbox-production-06`), so they overwrote each other's saved workspace.
- **P08 = P06 (all rigging) + P07's editor.** Merged per hunk (55 hunks: 22 from P07, rest from P06). It has its own key `kfb-toolbox-production-08`, which reads the old shared key once on first load. P06/P07 are frozen. Keep working in P08 only.

## 1 · `_lvl()` (kfb-lib/clay-lids.v1.js, LIDS-04)
Your fix, plus two changes:
1. **Roll sign flipped.** I measured in world space (outward = eye minus the midpoint between the eyes, up = head up) and checked on screen at roll +15. With `sx · −1 · roll`, + turned both outer corners **down**. P08 uses `sx · roll`, so + = outer corners up.
   **Your front-view angle has the opposite sign from ours.** Follow at oval −25 really puts the outer corners up: we measure +30.3° where you report −30.2°. The magnitudes agree everywhere.
2. **Exact level.** At turn 30 / oval −25, a pure −tilt still left up to 0.9°: the eye group's oval scale (w 1.06 ≠ h 1.04) skews the counter-rotation. `_lvl` now solves for the angle at which the lid x axis has no head-up component, and falls back to −tilt if that fails.

Frozen r2: `kfb-lib/_ref/clay-lids.v1.lids03.js`. UI labels: "Level (head)" and "Lid roll · + = both outer corners up".

## 2 · Acceptance §3 · PASS 5/5
Measured in P08 on frizzlebob-earrig-v5 with the MEASURE values. Button: Rigging › Eyes › FB-LIDS-LEVEL-FIX-01. Angle convention: + = outer corner up, world space.

| # | Result |
|---|---|
| 1 level, roll 0 · 12 setups (dx 0.345/0.52 × tilt 0/−25 × turn 0/15/30) | worst 0.00° |
| 2 roll +5 / −5 | +5.4 / +5.4 · −5.3 / −5.3 (r2: −5.0 / +5.0 · −10.3 / +0.3 · +0.2 / −10.3) |
| 3 follow, dx 0.52 | +30.3 / +30.3 · Δ vs r2 5e-14 |
| 4 shells, slant normalized | +0.5 / +0.5 (actor's own slant: −16.4, intended) |
| 5 angry / sad | Δ +21.3 / −17.8 on both eyes (mirrored) |

## 3 · Self-test (full, P08) · 37/38 → fixed, both were test bugs
- **22**: dx 0.568 + 0.05 hit the slider cap (0.6) and was clamped to 0.600. Near the cap the test now steps −0.05. Measured: 0.455 → 0.505 PASS.
- **24**: the behaviour is correct. On the surface seat, splay is added **on top of** the automatic ~25–29° outward turn, so splay −0.5 gives +6° (22.5° inward of the seat), not < 0. The test now checks deltas (side +90.0°, inward 22.5°). It also kept a stale eye reference: a rebuild replaces the eye objects, so x looked unchanged. Fixed; x now goes 0.190 → 0.391. Splay label: "×45° on top of the seat".
- Not re-run after the last test-24 edit. A full re-run takes about 3 min (Diagnostics › Run PRODUCTION-01 self-test).

## 4 · Open
- Your gates: the 12-step edge check (LIDS-02 §2.5) and the mouth-fit measurement on the GLB.
- Check 7 (cut edge ≤ 35°) is still a decision: finer rounding or a looser tolerance.
- P08 editor acceptance E1–E9 has not been re-run after the merge (Studio › Scene).
