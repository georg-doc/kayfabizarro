# KFB_JUKEBOX_CATALOG_01 · FAILURE RECOVERY

**Classification:** `FROZEN_CANDIDATE · QA EXPECTATION MISMATCH`

This is not an audio-design rollback. The candidate is preserved because the browser gate has consumed two repair passes.

## Observed result

The Site successfully loads its pinned 54-track candidate catalog and renders the 44 RoadTrip-v2 count. The browser test then fails because `qa.mjs` still asserts 12 stem-filter results although the source census and UI now correctly contain 14.

## Proven cause

Literal stale assertion in:
`tools/KFB-Audio-Site/qa.mjs`

Current line:
`check('stem filter shows 12', await page.locator('.track').count()===12, ...)`

Source lock, validator and Site catalog all agree on **14**.

## Salvage map

Keep unchanged:
- canonical v2 Jukebox candidate;
- Site catalog/player/mix/soundscape/intake/prompt source;
- source lock;
- prompt donor library;
- intake contract;
- Site Chat instructions;
- KFB Production Control standalone preview.

Do not reuse:
- the old 12-family browser expectation.

## Smallest recovery

One literal QA expectation update: 12 → 14, then rerun the existing workflow unchanged. Do not broaden scope during that recovery.

After green QA, publish via Sites MCP. Do not introduce Cloudflare.

## Host limitation

This chat has no Sites MCP backend, so it cannot create/verify the real GPT Site URL. Plugin Creator documentation explicitly routes new cloud Sites through Sites MCP; no substitute host is used.
