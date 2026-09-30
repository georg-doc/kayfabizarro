# TEST REPORT · 2026-09-30

| Test | Status | Evidence |
|---|---|---|
| Acceptance 1 · corners in the head | PASS | L −0.099/−0.089 R · R −0.101/−0.090 R |
| Acceptance 2 · shared corners, 6 states | PASS | gap 0 |
| Acceptance 3 · closed means closed (front + ¾) | PASS | 0 / 2836 rays hit sclera/pupil |
| Acceptance 4 · pupil never clips | PASS | min clearance 0.0043 R |
| Acceptance 5 · legacy unchanged | PASS (run 3) | max Δ 5.6e-17; runs 1–2 FAIL on exact-equality of one float bit → tolerance 1e-9 R |
| Acceptance 6 · mirror | PASS | normal Δ 0.098°, hinge Δ 0.082° |
| Acceptance 7 · untouched ears/brows/nose/mouth | PASS | eyeFrame/brow/nose/mouth Δ < 3e-16 |
| Visual · socket before/after (front, ¾, side) | RUN · look review pending | evidence/01 |
| Visual · hinge lid states ×6 (front, ¾) | RUN · look review pending | evidence/02 |
| Nose contact shadow on the face | RUN (visual) | evidence/01 row surface vs evidence/00 |
| Full ToolBox self-test 01–28e | NOT_RUN | — |
| Production-05 regression with changed shared libs | NOT_RUN | — |
| Cube Pets with socket surface | NOT_RUN | — |
| Clean-run check of the unpacked ZIP (structure, checksums, closure) | see CLEAN_RUN in EXPORT_MANIFEST.json | — |
| Browser load from the unpacked ZIP | NOT_RUN | — |

All acceptance runs executed live in Claude Design on frizzlebob-earrig-v5 (evidence/acceptance_1-7_frizzlebob-earrig-v5.json).
