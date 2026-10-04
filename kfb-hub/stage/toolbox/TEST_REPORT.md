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


## Status refresh · 2026-09-21

Branch: `hub/toolbox-v2-status-refresh-2026-09-21`  
Implementation checkpoint: `ff3b71a386f370da80b2a19cfc242ec9c0a7b00a`

**18/18 PASS**

Covered:
- accepted Hub UI v2 Paper/Dark + hash router retained;
- prominent ToolBox header + fallback link;
- stale Hub UI v2 human gate removed after Georg acceptance;
- stale 15-card ToolBox copy removed;
- current ToolBox v2 status = 17 cards;
- I1A WorldSurface briefing preserved;
- Stage router contains a direct ToolBox v2 card;
- ToolBox v2 still has 17 cards / 6 real public previews;
- Hub and ToolBox inline JavaScript parse;
- route audit = 6 public / 5 missing-or-blocked / 6 source-or-integration;
- route audit rechecked against `cloudflare-live@120159b1d7708b5bf580af63da4c503a6821a286`.

This is source/tree evidence. Public pages.dev verification remains a separate gate.

## Consolidation planning refresh · 2026-09-21

Scope: router and briefing metadata only; no candidate module was promoted.

**9/9 PASS**

Actual static/local-browser gates:
- Hub inline JavaScript parses and exposes the three new briefs in Today, Tools and Projects as intended;
- ToolBox roster = 19 cards: 7 public previews, 5 missing/blocked routes, 7 source/integration gates;
- Theatre Curtain v1 uses its existing direct public route and recorded 25/25 public proof;
- the verified 23-file Fluid/Card/Voxel intake is labeled source-only;
- ROUTE_AUDIT.json and SOURCE.json parse and match the visible counts;
- Stage router reports the same 19 / 7 / 5 figures;
- local Hub browser boot shows four current briefing cards and the visible local Pocket Inbox;
- local ToolBox browser boot shows Theatre Curtain under Open now and Fluid/Card/Voxel under Source / integration;
- the public Theatre Curtain URL opened successfully and exposed its real cloth controls, four fabric choices and CPU Verlet/WebGL status.

Public proof of this router revision remains a separate publication gate. Existing Theatre Curtain evidence is not evidence that this refreshed ToolBox page has deployed.
