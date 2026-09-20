# KFB Hub · Paper/Dark + Stage/Live Preview Slice · Test Report

Date: 2026-09-20  
Owner: KFB Production Hub  
Branch: `work/kfb-hub-paper-dark-previews-2026-09-20`  
Implementation head tested: `90e7d4fee3d874271a9dffd89839d240d1de37a0`

## Static checks

Result: **18/18 PASS**

1. inline JavaScript parses;
2. KFB public targets derive from current Hub data;
3. DocCheck public targets derive from current Hub data;
4. Paper theme token exists;
5. Dark theme token exists;
6. theme preference persists locally;
7. header contains the `#stage` anchor;
8. `#stage` and `#live` map to the Stage/Live view;
9. DocCheck route prefix is supported;
10. filter controls are real anchor elements;
11. Stage/Live preview gallery exists;
12. gallery derives from existing `links + todos + briefings`;
13. gallery deduplicates public URLs;
14. screenshot URL uses `maxAge/1`;
15. thumbnail failure falls back to the same public URL in a lazy non-interactive iframe;
16. Stage/Live view suppresses duplicate legacy link cards;
17. preview grid has 3 / 2 / 1-column responsive states;
18. every preview tile opens the direct public URL.

## Derived preview inventory

- KFB: **19** unique public targets = **8 Stage + 11 Live**
- DocCheck: **4** unique public targets = **0 Stage + 4 Live**

These counts are derived from the current Hub data arrays, not maintained as a second list.

## Screenshot contract

The screenshot integration uses the documented Thum.io URL API with width, crop, maxAge, JPG and no-animation modifiers. The UI requests at most one-hour-old cached snapshots and falls back to the actual public route if a thumbnail fails.

## Public Stage observation

Exact route opened:
https://kayfabizarro.pages.dev/kfb-hub/stage/hub-ui-v2/#stage

Observed in the KFB in-app browser:
- candidate route renders instead of a blank/fallback page;
- Stage / Live view renders **19** current KFB targets;
- representative preview screenshots are visibly present;
- Pocket Inbox remains visible.

The first publication exposed two Stage-wrapper defects: filter links resolved to the canonical Hub root, and the Paper/Dark toggle was hidden by the lean-header CSS. Both are corrected in source head `90e7d4fee3d874271a9dffd89839d240d1de37a0` and publication head `78f0af6e0aa24e4489fe8ab0e3d52656b4832a90`.

## Still open

- exact post-fix Cloudflare browser confirmation after deployment cache advances;
- desktop / split-screen / mobile visual review;
- Georg Paper/Dark acceptance;
- no Live promotion.
