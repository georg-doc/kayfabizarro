# TEST REPORT · PD-POOL-01 failure recovery

Status: **FAILED GATE · ARCHIVED CANDIDATE**

## Executed tests

| Evidence | Result |
|---|---|
| Run 36283860675 · static Python compile | 1/1 PASS |
| Run 36283860675 · provider attempts | 3 LOADED / 1 REJECTED |
| Run 36283860675 · Met | PASS · loaded |
| Run 36283860675 · Commons | PASS · loaded |
| Run 36283860675 · Internet Archive | PASS · loaded |
| Run 36283860675 · AIC | FAIL · HTTP 403 |
| Run 36283989583 · repair-1 compile | 0/1 · FAIL |
| Run 36284076862 · final-head compile | 0/1 · FAIL |
| Final-head provider/download gate | SKIPPED |
| Second-run idempotence | NOT RUN |
| stale partial-file rejection | NOT RUN |
| durable asset persistence | 0 assets |
| Stage/browser publication | NOT APPLICABLE |

## What these results do prove

- Three source-provider paths were capable of completing rights recheck + download in the initial runner.
- The original candidate did not pass the four-source contract.
- No file was promoted into the durable production pool.
- The current frozen fetcher is syntactically invalid.
- The second repair did not alter the invalid blob.

## What they do not prove

- that the AIC 403 is solved by the proposed headers;
- that the four-source process is idempotent;
- that partial downloads are rejected in a real second pass;
- that all historical UI-selected hits are available;
- that any IA/Commons object is automatically suitable for every public KFB use;
- that the public-domain folder is ready for Asset Librarian registration.
