# Source Review · 2026-09-18

## Read

- OSM City Slice workflow brief;
- current `KFB-Travel-Globe/WSA_START.md`;
- `travel/CONTRACT.md`;
- WB0 `REUSE_MATRIX.md` and World Recipe proposal;
- current Walk/Drive/Combat source review, receiver contract and fixture build order;
- `tools/world_atlas/source/lib/kit-lab.js`;
- `tools/img2threejs/README.md`;
- `tools/2D Animation Studio/README.md`.

## Receiver finding

The newest Free-Roam documents name the intended seam: Travel stays host; Race Slice-04 is the DRIVE physics donor, with exactly one movement writer. Therefore City Lab exports surfaces/obstacles/anchors and does not invent drive physics.

## Dropbox

A read-only Dropbox search for `OSM Ehrenfeld Köln KFB city` returned no result. No Dropbox files were mutated and no parallel Dropbox SSOT was created.

## Source fetch blocker observed in web-chat runtime

The chat container cannot resolve the Overpass host directly, and the web fetch surface does not expose arbitrary Overpass JSON responses. The implementation therefore uses a GitHub Actions source-cache job rather than violating the brief with the main OSM editing API.

If the CI Overpass fetch also fails, that CI log + endpoint status is the precise S0 source blocker. If it succeeds, the committed cache/report is the S0 source result.
