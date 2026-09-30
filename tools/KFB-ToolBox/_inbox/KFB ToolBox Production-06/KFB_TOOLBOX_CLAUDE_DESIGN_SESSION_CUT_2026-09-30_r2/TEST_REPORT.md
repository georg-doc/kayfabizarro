# TEST REPORT · 2026-09-30 (r2)

| Test | Status | Evidence |
|---|---|---|
| Logic class evaluates, page renders (after bracket fix) | RUN · PASS | standalone: tab labels resolve, 1 canvas; console still shows one empty `{}` error (unidentified) |
| clay-lids.v1.js loads as ES module (31 exports, DEFAULTS.roll = 0) | RUN · PASS | eval in preview |
| Lid level to eyes / roll: visual or numeric | NOT_RUN | implemented only |
| Painted-mouth fit: acceptance 1–7 (FB-MOUTH-FIT-01 §6) | NOT_RUN | |
| Mouth no-shadow re-apply | NOT_RUN (visual) | |
| FB-EYES-LIDS-02 acceptance | PASS 9 / FAIL 1 (check 7) | docs/RETURN_FB_EYES_LIDS_02.md |
| FB-EARS-FLOPPY-01 acceptance 1–7 | PASS 7/7 (scripted bend) | docs/RETURN_FB_EARS_FLOPPY_01.md |
| Eye socket + hinge acceptance 1–7 (r1 cut) | PASS | evidence/r1_acceptance_1-7_frizzlebob-earrig-v5.json |
| Full ToolBox self-test 01–28e | NOT_RUN | |
| Production-05 regression, Cube Pets | NOT_RUN | |
| zipcheck.py | NOT_RUN (no Python in Claude Design) | WSA to run |
| Clean-run of unpacked ZIP in a browser | NOT_RUN | |
