# KFB Hub · Paper/Dark + Stage/Live Preview Slice · Test Report

Date: 2026-09-20  
Owner: KFB Production Hub  
Branch: `work/kfb-hub-paper-dark-previews-2026-09-20`  
Implementation head tested: `0c609eaf8013b605238b29fd3597c037613ad453`

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

## Not yet proven

- no real-browser visual QA on this branch;
- no Cloudflare Stage publication for this Hub UI candidate;
- no PUBLIC_VERIFIED claim;
- no Georg visual acceptance;
- no Live promotion.

The exact public KFB Hub remains the old deployed state until a deliberate Stage/publication gate is completed.
