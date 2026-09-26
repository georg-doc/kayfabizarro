# TEST REPORT · HUB-BRIEFING-SYNC-01

Status: **FROZEN FAILURE · PUBLIC ROOT UNCHANGED**

## Source sync evidence
- #222 executor-board sync: committed at `823bdb57c2ab30027cafcac9c867f5b6c3e8c9ac`.
- #204 final briefing/catalog sync: `deec05c883de02836c3d699fa6e64d647d32a9f7`.
- HUB-CTRL config sync checkpoint: `8fe5f7be6af8532393a135d194b0768659d9c5b2`.

## Final validation run
GitHub Actions run: `36213057662`
Job: `108323464259`

Passed:
- builder unit tests: **16/16**
- render unit tests: **2/2**
- online registry build: PASS
- registry validator: **VALID**
- rendered Desk: PASS
- embedded/live/main source switching: PASS
- bucket counts vs registry: PASS
- generic paste-ready brief copy: PASS
- drawer/details: PASS

Registry summary:
- 22 lanes
- LOOK_AT 3
- RUNNING 4
- CAN_START 5
- WAITING 9
- problems 1
- content hash prefix `5f09c6e4e180`

Failed:
- card-face technical-details contract still detects PR/SHA-like text;
- stale hardcoded `vfx-sfx` primary-copy selector crashes the DOM test.

## Publication
- bot/public root: not written by this slice
- `cloudflare-live`: unchanged
- exact `https://kayfabizarro.pages.dev/kfb-hub/`: no new revision claimed
- PUBLIC_VERIFIED: **NO**

No product runtime was changed.
