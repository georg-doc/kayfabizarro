# ACTIONFIGURE-MOTION-FREEPLAY-01 · TEST REPORT

Date: 2026-10-03
Repository: georg-doc/kayfabizarro
PR: #333
Branch: `chatgpt-web/motion-ssot-convergence-2026-10-03`
Tested implementation head: `f1ce90d31a18973fa981bc982309c4bb01b204b8`

## Freeplay browser gate

Workflow: ActionFigure Motion Freeplay 01
Run: `37125874478`
Job: `111210930976`
Conclusion: **SUCCESS**

Assertions:
1. exact ActionFigure source loads;
2. central owner pin is exact;
3. Idle loads;
4. W accelerates through the measured forward ladder;
5. Shift reaches Sprint;
6. S reaches source-backed Backward;
7. Space enters airborne Jump Start;
8. Jog A/B switches;
9. Run A/B switches;
10. Sprint A/B switches;
11. console errors = 0;
12. page errors = 0.

Observed snapshots:
- forward Run: 2.132 m/s
- Sprint: 3.006 m/s
- Backward: 0.489 m/s
- Jump Start: jumpY 0.615

Evidence artifact:
- ID `11275251740`
- ZIP digest `sha256:bc6b663622137cc08e0a7e73cf318f77d9b0bf75336da0bd5de657106adeb236`
- screenshot `actionfigure-freeplay.png`
- machine proof `actionfigure-freeplay-proof.json`

## Motion owner regression

Run `37125874493`: **SUCCESS**
- state machine 9/9
- measurement reconciler 6/6
- Ladder 02 integration 7/7
- Motion Lab owner integration 5/5
- total **27/27 PASS · 0 fail**
- syntax/JSON/reconcile smoke PASS

Same candidate:
- Resource Registry `37125874476` SUCCESS
- Asset Registry Refresh `37125874484` SUCCESS

## Repair budget

- baseline: module did not start because one closing parenthesis was missing;
- repair 1: source loaded; exact 404 exposed shorthand `libs/...` path handling;
- repair 2: resolver corrected; full browser gate PASS.

No repair 3.


## HUMAN REVIEW OVERRIDE · 2026-10-03

Georg classified the entire prototype as **TOTAL FAIL**.

Observed:
- wrong step length;
- visible wobble / jitter;
- arms too tight / inside or pressed into torso;
- transitions not clean;
- jump behaviour not clean;
- animation timing itself jerky.

Therefore:
- prior Chromium SUCCESS remains only a technical automation result;
- product acceptance = FAIL;
- candidate status = `ARCHIVED_FAILED_CANDIDATE`;
- no further repair pass on this foundation;
- mixed Ladder-02 primary gait selection is rejected;
- next gate = `KAYKIT-NATIVE-BLENDER-BASELINE-01`.
