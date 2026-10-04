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

## Recovery 01 stop · 2026-10-04

The named recovery fixed the stale `12 → 14` assertion and reran the existing browser flow. That advanced the gate through the stem filter and Mix view.

Two bounded recovery repairs then exposed two further harness-only problems:
1. Prompt Studio was opened after the test tried to fill its hidden mood field; navigation now occurs first.
2. The built request is visibly correct and includes the requested mood plus the selected master reference, but the assertion requires case-sensitive `Master` while the generated copy uses lowercase `masters` / `master`.

Observed product state remains usable: Catalog, counts, stem filter, Mix and Prompt Studio all render and operate. The full automated browser gate is not green.

Per the two-pass rule, stop here. Do not publish the GPT Site from this candidate yet, and do not start the planned SFX/Sound-Bed Prompt Bank.

Exactly one next gate: `KFB_AUDIO_SITE_QA_RECOVERY_02` — change only the stale case-sensitive prompt assertion, rerun unchanged QA, then publish through Sites only on full PASS.
