# KFB Hub UI v2 + ToolBox Home v2 · Static Test Report

Status: **SOURCE PASS · PUBLICATION NOT YET VERIFIED**

Branch: `promote/hub-ui-v2-accepted-2026-09-21`
Implementation checkpoint: `7b23009f1f863d1793421de72862b90e42f650a8`

## Actual checks

**18/18 PASS**

1. PASS · Hub HTML language/theme marker
2. PASS · Hub explicit Paper/Dark toggle
3. PASS · Hub shareable hash router
4. PASS · Hub Stage/Live preview surface
5. PASS · Hub prominent ToolBox header link
6. PASS · Hub current Storytelling Map Animator preserved
7. PASS · Hub current ToolBox v2 briefing
8. PASS · Hub current I1A human gate
9. PASS · Hub inline JS parses
10. PASS · ToolBox v2 theme marker
11. PASS · ToolBox v2 explicit theme toggle
12. PASS · ToolBox v2 card roster = 17
13. PASS · ToolBox public previews = 6
14. PASS · ToolBox no fake preview wording
15. PASS · ToolBox Vehicle Deformer public route surfaced
16. PASS · ToolBox Ranged Calibration public route surfaced
17. PASS · ToolBox KCC remains PUBLIC BLOCKED
18. PASS · ToolBox inline JS parses

## Route audit

ToolBox card roster:
- 6 exact public preview routes;
- 5 missing or explicitly blocked routes;
- 6 source/integration-only cards;
- 17 total.

No missing/blocked route receives a fake preview.

The audit is against `cloudflare-live@ca576e3126e110a2d445b0b4c174faf7217b1c3a` before this promotion.

## Evidence boundary

This proves source composition and current publication-tree presence/absence. It does not yet prove the new Hub/ToolBox files are deployed on Cloudflare or visually accepted after publication.

## Publication checkpoint

- main merge: `dfbbb733b37a3923e4e5a80ff99f9f91209f3aaa`
- cloudflare-live write/readback: `cbbae810e6ddb8f282e702d0897bed8566361327`
- exact published file blobs were read back from the publication branch: PASS
- direct public HTTP/browser verification from this session: **PENDING / TOOL ACCESS BLOCKED**

Do not convert the publication-branch write into `PUBLIC_VERIFIED` until the exact Hub and ToolBox routes visibly show the v2 revision.
