# TEST REPORT · WB-ZONE-SEAM-01 FAILURE RECOVERY

Status: **SEAM GATE FAIL · BROWSER REGRESSION NOT REACHED**

## Actual candidate runs

| Run | Head | Seam contract | Static World r2 | Hürth/Cologne browser | WB2 baseline |
|---|---|---|---|---|---|
| 36291539816 | 6f3e60df | FAIL at 368/369 | skipped | skipped | skipped |
| 36291711090 | f01bb78a | FAIL at 370/369 | skipped | skipped | skipped |
| 36291859889 | 2224d95d | FAIL at 370/369 | skipped | skipped | skipped |

For every run, the following assertions passed before the crop mismatch:
1. baked manifest id = `cologne-dom-zentrum-v0`;
2. baked revision = `2026-09-24.1`;
3. WorldBuilder package contract storage = `zone manifest reference + transform only`.

No candidate claim is made for:
- static owner regression;
- Hürth runtime/browser;
- baked Cologne runtime/browser;
- WB2 34/34;
because CI correctly stopped before those steps.

Parent/previous evidence remains parent evidence only and is not re-labelled as candidate proof.

## Public deployment

None. No Stage page was created. No human review requested.
