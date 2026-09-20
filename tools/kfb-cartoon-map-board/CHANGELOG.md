# Changelog · KFB Cartoon Map Board

## 2026-09-18 · P0

### DECISION
- New additive tool folder: `tools/kfb-cartoon-map-board/`.
- Do not repurpose `osm-city-lab` or `world_atlas`; consume their contracts/donors instead.
- Preserve `kfb-ink-canon.js` as card-ink SSOT; world-space geographic borders are implemented as a map adapter, not a replacement canon.
- Use actual KayKit BoardGameBits from the central GitHub asset repository.

### IMPLEMENTATION
- Added Europe 3D board shell and Three.js orbit viewer.
- Added OSM-derived country GeoJSON resolver through OpenPlanetData v2 catalogue.
- Added independent country extrusions, selection lift, explode/recombine, country labels and camera presets.
- Added filled Map BAND ribbon with deterministic wobble and south-east edge weighting.
- Added actual KayKit GLTF markers for Berlin, Paris, Rome, Warsaw and London.
- Added ink / relief controls and explicit OSM attribution.

### TESTED RESULT
- `node --check src/app.js`: PASS.
- Browser/WebGL visual run: NOT YET RUN.
- Public Pages deployment: NOT YET VERIFIED.
- Georg acceptance: OPEN.


## 2026-09-18 · P0.2 Story Focus

### DECISION
- Story anchors are declarative demo content, not card canon.
- KayKit map content must remain registered to its geographic owner during explode/recombine.
- Live-boundary provenance is made explicit in `data/europe-p0/SOURCE_SPEC.json`; this is not yet a pinned snapshot.

### IMPLEMENTATION
- Added deterministic paper texture generation.
- Added hover feedback and selected-country focus ring.
- Added smooth camera choreography plus `FOCUS` and `NEXT STORY`.
- Added `data/story-demo.v1.json` as a data-driven content-anchor manifest.
- Reparented KayKit markers to their country tiles and counter-scaled marker Y against the HEIGHT presentation control.
- Added P0.2 story-focus documentation.

### TESTED RESULT
- GitHub source readback confirms the P0.2 files are on `main`.
- GitHub Pages build/deployment workflow has been triggered for the new commits; that is separate from the canonical Cloudflare `kayfabizarro.pages.dev` deployment.
- Browser/WebGL execution of P0.2: NOT YET CLAIMED.
- Cloudflare public deployment: NOT YET VERIFIED.
- Georg visual acceptance: OPEN.


## 2026-09-20 · P0.2 experimental Stage packaging

### DECISION
- Publish an experimental Stage copy before further product integration.
- Keep Live unchanged and preserve existing owners.

### IMPLEMENTATION
- Added `kfb-hub/stage/cartoon-map-board-p02/` as the experimental Stage package.
- Stage build stamp: `p0.2-stage-exp-r1`.
- KayKit runtime assets stay sourced from the central GitHub repository.
- KFB Stage index gets a direct human-test card.

### STATUS
- Source package: IMPLEMENTED.
- Public browser verification: OPEN.
- Georg visual acceptance: OPEN.
- Live: unchanged.
