# MUSIC-PERF-01 · RECOVERY

**Status:** CI PASS · REVIEW CANDIDATE · NOT MERGED  
**Date:** 2026-09-24  
**Receiving owner:** ToolBox integration PR #185  
**Stacked branch:** `web/music-perf-01-2026-09-24`  
**Tested head:** `d834f1d4819dc972e2f4aeeedee4c559cbe8afbd`

## Resume order

1. `skills/chat/START_HERE.md`
2. `skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`
3. `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`
4. Production Architecture v3 PR #204 → `MUSIC-PERF-01`
5. ToolBox PR #185 current head / Return
6. ORB-P1 PR #195 `SOURCE.json` + `review/module.json`
7. this folder's `SOURCE.json`, `performance-recipe.json`, `TEST_REPORT.md`, `RETURN.md`

## Why the stacked branch exists

PR #185 is an active multi-writer ToolBox owner. It advanced twice while MUSIC-PERF-01 was starting. Both direct fast-forward writes were rejected safely; no force-push was used.

This slice therefore runs on a stable branch based on ToolBox head:

`6224614eccfa24938394e8866aac0dea9c3db3f0`

Receiving ownership remains PR #185.

## Frozen technical candidate

Final tested head:

`d834f1d4819dc972e2f4aeeedee4c559cbe8afbd`

Evidence:

- Static/source/owner: **22/22 PASS**
- Browser playback: **29/29 PASS**
- run `36033971182`
- job `107749357266`
- proof artifact `10822609381`
- digest `sha256:0d5950361fa3ae74b90c4b3afb31a01fdc97953616a60fa371d156518e6ff69d`

Exact donor mirrors:

- ORB v5 GLB blob `446b044ed7c68bf877afc0f456f0aa87cc390b46`
- ORB module metadata blob `35de1a9d6138b0a27b61f07056f26970ac56dada`
- Rubbish Groove MP3 blob `368eb5ae8fafcfba1cce3ba3f80488378fe056b0`

## Owner rules

- song transport is the one master clock;
- no audio is baked into animation clips;
- no Resident/performer owns a music player;
- current Motion Library stays read-only owner;
- Source Object mode shows the exact ORB donor before integration;
- leader + guitarist preserve Georg PASS;
- drummer remains HOLD and is only hidden by the integrated recipe;
- no second Resident DB, renderer, animation catalogue or persistence schema.

## Next allowed work

Do **not** tune timing or animation further before review.

Next gate:

**direct Cloudflare playback review of this exact candidate**, then Georg decides PASS / TUNE / REJECT.

Planned route:

`https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/music-performance/`

No PUBLIC_VERIFIED claim exists until the exact route exposes `MUSIC-PERF-01-v1` and the public playback proof passes.
