# ATTEMPT LOG

| Step | Change | Expected | Actual | Evidence | Decision |
|---|---|---|---|---|---|
| Baseline runtime | Race TE-01 implementation + tests | stable OSM depth + Ink receiver | 60/60 PASS | Race run 35459658425 | RETAIN |
| Local package | Stage mirror on kayfabizarro branch/main | exact runtime package boots locally | 22/22 PASS | run 35460338909, artifact 10589368634 | RETAIN |
| Public attempt 1 | package merged to kayfabizarro main | Cloudflare marker appears | marker absent after 42×10 s | run 35460463723 attempt 1, artifact 10589048551 | REJECT PUBLIC CLAIM |
| Repair 1 | exact mirror to `cloudflare-live@07c47e1` | Pages consumes designated branch | marker still absent after 42×10 s | run 35460463723 attempt 2, artifact 10591633629 | NO PROGRESS |
| Repair 2 | Contents-API commit `66bd170` on `cloudflare-live` | force observable Git content update | marker still absent after 42×10 s | run 35460463723 attempt 3, artifact 10591509359 | STOP / RECOVERY |

## Public-proof artifact digests

- attempt 1: `10589048551` · `sha256:9483f6e46c9f87500f5b39086aa0e5f602c9fce0b35813939b2cc361b38b262b`
- attempt 2: `10591633629` · `sha256:0cba9fdbf434e8a5f30c21841a9e9cc1ef8b61ba63ec3b208af3814c76629b46`
- attempt 3: `10591509359` · `sha256:194fd188006192a225ab121e5271fd3abc71af4f2f29c376746288452fa5c378`

No further Git-side publication retry is authorized from this recovery package.
