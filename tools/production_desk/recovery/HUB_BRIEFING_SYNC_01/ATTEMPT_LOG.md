# ATTEMPT LOG · HUB-BRIEFING-SYNC-01

## Attempt 1 · run 36212815856
Result: FAIL before registry build.
Cause: generic unittest discovery included the separate Hub UX Recovery Session-Cut parity suite, whose source fixture files are intentionally absent from HUB-CTRL.
Observed: 27 tests, 6 FileNotFound errors in `test_hub_ux_recovery_stage.py`.

Repair 1:
Scope validation to Production Desk builder/render unit suites for this sync; leave UX recovery gate separate.

## Attempt 2 · run 36212892871
Builder 16/16 PASS · render unit 2/2 PASS · online registry PASS · VALID · render PASS.
DOM FAIL:
- visible-card contract: PR/SHA-like technical text detected;
- first copy test selected a briefing lane without a primary copy button.

Repair 2:
- removed several PR-number references from visible Georg-facing lane prose;
- first copy test now selects a generic `brief.rawUrl && brief.pasteReady` lane.

## Attempt 3 / Repair-pass-2 evidence · run 36213057662
Builder 16/16 PASS · render unit 2/2 PASS · online registry PASS · VALID · render PASS.
DOM still FAIL:
- card-face PR/SHA contract still detects at least one remaining technical token;
- generic paste-ready copy now PASS;
- drawer PASS;
- later test still hardcodes `[data-lane="vfx-sfx"] .btn.primary` and crashes because no primary button exists.

Stop condition reached. No repair pass 3.
