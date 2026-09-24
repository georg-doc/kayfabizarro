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


## Timeout sanity recovery · 2026-09-24 21:05 CEST

A connector/tool timeout occurred while beginning the Hub-owner lookup after PR #207 had already been created.

Sanity check after the timeout:

- MUSIC-PERF stacked Draft PR: **#207 · OPEN · mergeable**
- MUSIC-PERF branch head before this recovery write: `e207f2ba70bf892a0de59dc6f7f3dfe470bd6a6d`
- frozen runtime-tested head remains: `d834f1d4819dc972e2f4aeeedee4c559cbe8afbd`
- final successful QA remains: run `36033971182` / job `107749357266`
- Source/owner checks remain **22/22 PASS**
- Chromium playback remains **29/29 PASS**
- receiving ToolBox owner PR #185: **OPEN**, head `fdfe5fc26b37c1baf87804d3cb427654d54bd5a8`
- Hub owner PR #202: **OPEN**, head `b2c7ab4a4afff67174a2c05ca6723b3f8c7c596f`
- no Hub file, `cloudflare-live` ref, ToolBox owner ref or MUSIC-PERF runtime file was written by the timed-out lookup
- therefore there is **no unknown mutation to retry or roll back**

The timed-out operation was discovery/read-only. Continue from the current GitHub heads, not from the pre-timeout Hub-search attempt.

### Current safe continuation

1. Read HUB-CTRL #202's current registry/render/publication files at its exact head.
2. Add MUSIC-PERF-01 only through the existing Hub/Stage owner; do not create a second Hub runtime.
3. Mirror the exact tested MUSIC-PERF candidate to the fixed Stage route:
   `https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/music-performance/`
4. Open that exact public URL and verify the `MUSIC-PERF-01-v1` marker plus real playback before claiming `PUBLIC_VERIFIED`.
5. Then update RETURN / CHANGELOG / Hub metadata with deploy head, direct Stage URL, humanResult=PENDING and one next gate.

No runtime retune is authorized during this recovery continuation.
