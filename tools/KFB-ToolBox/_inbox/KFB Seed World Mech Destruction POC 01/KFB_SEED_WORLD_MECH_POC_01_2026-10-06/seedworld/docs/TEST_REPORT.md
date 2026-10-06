# TEST REPORT · 2026-10-05 · seed 2 (Spielzeugstadt)

Run in the page via **CHECKS** (`__sw.runChecks()`); the determinism checks build fresh generators.

| # | Check | Result | Measured |
|---|---|---|---|
| T1 | same seed → same road IDs | PASS | 32 street ids, hash bbb77945 |
| T2 | same seed → same parcels | PASS | 309 parcels in 5 × 5 chunks |
| T3 | same seed → same BuildingRecipes | PASS | hash 7201b6fb = 7201b6fb |
| T4 | same recipe → same destruction cell IDs | PASS | 1862 cell ids over 25 recipes |
| T5 | Minigun 2 min (7200 fixed steps) → no unbounded growth | PASS | non-world objects 101 → 101; chunk objects 384 → 385 (recompiled with damage, slots ≤ 169); GPU geometries 84 → 85; 1905 shots |
| T6 | debris never exceeds pool cap | PASS | peak 230 / 256, retired 0 |
| T7 | projectiles never exceed pool cap | PASS | rounds 5 / 96, rockets 5 / 24 |
| T8 | VFX never grows unbounded | PASS | peak 552 / 584 |
| T9 | leaving active radius releases dynamic state | PASS | chunk released; promoted 0; owned debris 0; stored 25 bytes for 98 cells |
| T10 | returning reconstructs damaged state | PASS | 17 / 98 cells gone, states identical after re-promotion |
| T11 | no material per house | PASS | 10 materials in the scene (mech + FX + 1 clay); every chunk mesh on the shared clay material |
| T12 | queued chunks not all integrated in one frame | PASS | max 3 per frame (cap 3, budget 4 ms); queue was at 6; 8 frames held back a larger queue; worst frame 2.5 ms |

Earlier versions of T5 and T12 failed. Both failures came from the checks themselves, not from leaks. T5 had counted chunk objects that change legitimately when a chunk is recompiled with damage. T12 had allowed cheap chunks to drain inside the 4 ms budget, so an explicit cap of 3 per frame was added.

## Bug found and fixed during testing
The promotion cap could be exceeded: a building that was being demoted and got hit again re-entered the active set without a slot check (8 / 4 seen). Fixed in `promote()`. Not re-run since the fix.

## Not tested
- Real frame rate and pointer lock in a visible top-level tab (the preview frame throttles rAF and blocks pointer lock; the mouse-move fallback was used).
- Bench C after the shader warm-up.
- Mobile, low-end GPUs.

---
## Addendum · 2026-10-06 r2
| # | Check | Result | Note |
|---|---|---|---|
| T13 | locomotion: land → walk → run → jump → double-Space take-off | PASS (single run after rework 3) | walks 8 headings for 40 steps each, keeps the longest; then lands, idles, runs at ladder speed ±15 %, jumps, lands, takes off with Space×2 |

**Not yet recorded after the walk sprint:** a complete T1–T13 run and bench A–E. The numbers above for T1–T12 are from 2026-10-05. Run *Diagnose → Checks*, then *Bench*, then *Download*, and replace this addendum.
