# KFB_JUKEBOX_CATALOG_01 · TEST REPORT

**Date:** 2026-10-04  
**Candidate:** `070fdaee25dfcdc671a0a29946092086c0a50562`  
**Status:** SOURCE_VALIDATED · BROWSER_QA_EXPECTATION_RECOVERY_REQUIRED

## Source / static

Run `37168419769` / job `111336177063`:
- sparse checkout: PASS;
- catalog/source-lock validator: PASS;
- JavaScript syntax: PASS.

Validated locked facts:
- 54 catalog tracks;
- 44 RoadTrip-v2 masters;
- 14 paired stem families;
- exact master/tree SHA reconciliation against `source-lock.json`;
- Cyclical Warmth = `certified`;
- other stem families = source-only;
- verified shared soundscape sources locked;
- rain remains explicit SOURCE_REQUIRED.

## Browser

Browser reached four assertions:
1. Site marker — PASS
2. catalog renders >=54 — PASS
3. stats report 44 RoadTrip-v2 — PASS
4. stem filter expected 12 — FAIL, actual **14**

The fourth assertion is stale test data after source advanced from 12 to 14 paired families.

Artifact `11290582496`  
Digest `sha256:ff8f155fe10a6fccffd951fdd6503df4fd53b4eeb36e52f17c60eee517f5e649`

No full browser PASS is claimed.

## Stop reason

Two repair passes on the browser gate already advanced the candidate. Per KFB recovery policy, no third repair is attempted in this slice.

## Next gate

`KFB_AUDIO_SITE_QA_RECOVERY_01`: change only the one stale 12→14 browser assertion and rerun. If it passes, proceed to GPT Site publication with Sites MCP.
