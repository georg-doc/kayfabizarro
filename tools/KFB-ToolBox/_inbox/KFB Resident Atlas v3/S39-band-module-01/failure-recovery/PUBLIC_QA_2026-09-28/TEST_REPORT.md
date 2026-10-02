# PUBLIC QA TEST REPORT

**Status:** FROZEN AFTER TWO FAILING WORKFLOW CONCLUSIONS

Exact route exercised:
`https://kayfabizarro.pages.dev/kfb-hub/stage/resident-atlas/band/#__band`

## Repeated result
- attempt 1: **21/23 FAIL** · run `36398578326` · artifact `10959452416`;
- attempt 2: **21/23 FAIL** · run `36398674762` · artifact `10959143954` (265103 bytes);
- Stage HTTP 200;
- marker HTTP 200;
- failed Stage HTTP assets: 0;
- first screenshot captured;
- second screenshot timeout;
- public Hub semantic/link proof: **NOT REACHED**.

## Attempt 2 checks

| # | Check | Result | Observed |
|---:|---|---|---|
| 1 | SOURCE.json HTTP | PASS | 200 |
| 2 | marker build | PASS | exact build |
| 3 | marker source PR | PASS | 277 |
| 4 | marker baseplate false | PASS | false |
| 5 | marker human pose pending | PASS | HUMAN_DRUMMER_POSE_PENDING |
| 6 | Stage HTTP | PASS | 200 |
| 7 | deep-link selected | PASS | __band |
| 8 | exact three performers | **FAIL / false negative** | leader, guitarist, drummer + optional trumpeter |
| 9 | runtime baseplate false | PASS | false |
| 10 | shortened root name | **FAIL / false negative** | resident-module:resident-band-module-01 |
| 11 | root parent | PASS | band-world |
| 12 | song blob | PASS | 368eb5ae… |
| 13 | BPM | PASS | 100 |
| 14 | phase | PASS | 0.465 |
| 15 | drummer action | PASS | orb.drum.v5c |
| 16 | R strike | PASS | frame 0 · gap 0.0256 |
| 17 | timeline | PASS | visible |
| 18 | band controls | PASS | visible |
| 19 | Play | PASS | playing true |
| 20 | song advances | PASS | 0.930667 s observation |
| 21 | Pause | PASS | playing false |
| 22 | holdStrike R | PASS | frame 0 |
| 23 | hold pauses | PASS | playing false |

Additional browser values:
- L strike: frame 25 · gap 0.0245;
- support probe: 4/4 corners carried at host y=0;
- core bindings: 7/7 · 69/69 · 69/69;
- optional trumpeter is `member: extension`;
- run 2 artifact contains `report.json`, `check.mjs`, `01-band-loaded.png`.

No corrected third run exists.
