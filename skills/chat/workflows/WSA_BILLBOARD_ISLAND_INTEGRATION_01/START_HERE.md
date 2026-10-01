# WSA-BILLBOARD-ISLAND-INTEGRATION-01

Owner: existing B1/B2a Billboard runtime; WSA is integration executor.
Branch: `work/billboard-island-integration-01-2026-10-01`.
Base: `georg-doc/kayfabizarro@99d882ca8e3bae53999a4c939cbfb46d4444d874`.
Status: implementation in progress, not a playable/publicly verified island build.

## Current user decisions · 2026-10-01

Go for productive integration. Claude Design Clay r2 is **TUNE, ready for use**.
Use the simple `plain` body for the first reduced island test; keep `tv` and
`highway` available as donor variants, not a mandatory new approval cycle.
Preserve the 12×6m / 2:1 media surface. Body uses the receiving island palette
and canonical KFB prop/signage clay treatment; media remains sharp and unlit.

This is a reusable game asset, not a diagnostic billboard generator. At distance
it must identify the deck/theme by a stable signature image and palette. Nearby
it may play the existing H13/H14 hypernormalisation, cards, video and YouTube.
Use KFB SHOW/SPIN/SELL triplets and deck content rather than a tiny repeating
Latin-motto list. Existing H13 songform/similarity logic is not replaced.

Expand the shared provenance-tracked Public Domain image **and video** pool.
Target at least 120 distinct images and 8 short video sources, not 120 crops of
four images. Record actual admitted totals; a target is not evidence. No asset
repeat within a five-minute simulated session where pool size allows it; test
seed reproducibility and text/image recurrence separately. Small thematic pools
fall back to the shared pool without mislabelling unrelated assets as deck-specific.

Do not put the PD pool, source video, old cuts, font binaries or 2048px bake
frames into new exchange ZIPs. Handoff is pinned source/manifest links plus
changed code, recipe and small evidence: target ≤5MB, hard limit 10MB unless
Georg expressly requests full offline media. Reuse remote repository assets;
decode/preload lazily with a bounded shared cache. Browser tests and rights
checks are performed by this integration job, not bounced back to Georg.

## Verified donor delta

r2 raw source is preserved at
`tools/KFB-ToolBox/_inbox/KFB_WORLD_BILLBOARD_CLAY01_CLAUDE_DESIGN_SESSION_CUT_2026-10-01_r2/`.
All 35 original checksum entries verified locally. Dropbox metadata reports
1,368,114 bytes for the supplied folder. Source screenshots have been inspected.
Reported render checks are Claude evidence, not this job's browser measurements.

Authoring/extraction seam:
`tools/KFB-ToolBox/worldbuilder/billboard-island-01/build-donor.mjs`.
It copies the r2 geometry/palette/anchor blocks with their original SHA lock,
then applies one explicit repair: foot sum divided by actual foot count.
Original r2 divides by four even for the new two-post Plain/TV variants.
The input cut remains byte-identical. The output has no shader, content provider,
terrain generator, scheduler or animation loop; these remain receiving owners.

B1 stays Surface/Fit owner; B2a stays CSS3D YouTube/Front-Rear owner.
H13/H14 stay media recipe/filter/effect donor. B2b-P1 stays archived failed.
Do not install the cut's copied `makeClayFamily` or sample `buildIsland` in the
production world. Do not use a second billboard ticker. Source-isolate before
joining the already accepted runtime and preserve its back-face exclusion.

## Exactly one next productive step

Connect this r2 body-only seam to the accepted B1/B2a media owner in a reduced
island consumer, with the rich-pool provider. Then run visible 0/1/4/8/16 tests
with source isolation, near/mid/far/rear evidence, page visibility, cache and
decoded texture limits. Do not claim FPS from an inactive or hidden tab.

No Stage, merge or Live promotion has occurred at this checkpoint.
Intended human milestone route (NOT PUBLISHED):
`https://kayfabizarro.pages.dev/kfb-hub/pruefen/billboard-island-01/`.
