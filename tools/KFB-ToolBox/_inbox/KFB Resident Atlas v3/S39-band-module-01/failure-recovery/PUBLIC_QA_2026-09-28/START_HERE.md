# START HERE · RESIDENT-BAND-MODULE-01 · Public QA recovery

**Status:** PUBLIC QA FROZEN AFTER TWO ATTEMPTS · RESIDENT CANDIDATE RETAINED  
**Date:** 2026-09-28  
**Owner:** Resident Atlas · S39  
**Repo:** `georg-doc/kayfabizarro`  
**Source PR:** #277 · `chatgpt-web/resident-band-module-01-2026-09-28`  
**Stage route:** `https://kayfabizarro.pages.dev/kfb-hub/stage/resident-atlas/band/#__band`

Do not rebuild the band. Do not start a new arm-to-drum solver. Do not alter the accepted core actors, Wardrum/sticks, signature song, Motion Library action references or baseplate-free host contract.

Two exact public runs were spent:
- `36398578326` → **21/23 FAIL** · artifact `10959452416`;
- `36398674762` → **21/23 FAIL** · artifact `10959143954`.

The Stage itself booted and behaved. The failures belong to the QA harness/sequence, not to a proven Resident-runtime defect. Read `ATTEMPT_LOG.md`, `POSTMORTEM.md`, then `RECOVERY.md`.

Exactly one next gate:
**PUBLIC-QA-RECOVERY-01** — fresh slice; correct only the two known QA expectations and move Hub semantic proof before nonessential screenshots. No Resident runtime/data change.
