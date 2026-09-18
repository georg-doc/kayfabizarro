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
