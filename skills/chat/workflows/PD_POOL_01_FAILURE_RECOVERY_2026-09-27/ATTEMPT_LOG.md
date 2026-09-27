# ATTEMPT LOG · PD-POOL-01

## Initial implementation · `154e573b8defacd17e836de049b3853578291f94`

Built the bounded four-source harness:
- explicit manifest;
- provider rights recheck;
- atomic downloads;
- SHA-256 sidecars;
- byte caps;
- second-run idempotence;
- stale-partial rejection;
- generated manifest/credits;
- GitHub Actions persistence only after full PASS.

The initial connector push did not create a workflow run. PR trigger support was then added at `faad78d3e3a823f061100d0e4c2f388a254659d3`.

## Gate execution · run `36283860675`

Job: `108520821629`

Actual result:
- checkout: PASS;
- Python setup: PASS;
- static syntax: PASS;
- Met: **LOADED**;
- AIC: **REJECTED · HTTP 403** on image transport;
- Commons: **LOADED**;
- Internet Archive: **LOADED**;
- provider result: **3/4**;
- persistence step: SKIPPED;
- second-run/idempotence gate: NOT RUN;
- stale-partial injection gate: NOT RUN.

Decision: one bounded repair pass for AIC request headers.

## Repair pass 1 · `66dfa4a7a384593679b35735d1e114ad444746c0`

Change attempted:
- browser-compatible User-Agent;
- AIC-specific `AIC-User-Agent`;
- AIC Referer;
- shallow checkout.

Actual result, push run `36283989583`, job `108521124193`:
- checkout: PASS;
- Python setup: PASS;
- static syntax: **FAIL**;
- network/provider gate: SKIPPED.

Proven defect:
the edited source contains a literal `\\n` between the `UA` and `AIC_UA` assignments.

## Repair pass 2 · frozen head `b49ae450aa378718e5e595fd8f00bfd215c1df65`

Change attempted:
- remove the literal escape;
- cancel stale duplicate workflow runs.

Post-write verification found the script blob unchanged:
`509a3458a815a71b2759bb2788b045a3256c4f00`.

Final current-head run:
- run: `36284076862`;
- job: `108521380387`;
- checkout: PASS;
- Python setup: PASS;
- static syntax: **FAIL**;
- provider gate: SKIPPED;
- persistence: SKIPPED.

Decision: **STOP · no repair pass 3**.
