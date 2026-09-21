# Recovery · KFB Cartoon Map Board

## Current entry

Current implementation slice: **P0.2 Story Focus**.

Read `docs/STORY_FOCUS_P02.md` after this file.

`tools/kfb-cartoon-map-board/index.html`

Expected public route after Pages deployment:

`https://kayfabizarro.pages.dev/tools/kfb-cartoon-map-board/`

## Owners that must not be overwritten

- Detailed city OSM pipeline: `tools/osm-city-lab/`
- Card ink canon: `skills/kfb-ink-canon.js`
- Card rendering: `skills/kfb-card-builder.js` + `skills/kfb-card-format.js`
- 3D asset identity/provenance: central KFB asset repository / Registry

## P0 external runtime dependencies

- Three.js `0.160.0` from unpkg (matching the KFB embed bundle contract).
- OSM-derived country GeoJSON resolved from `download.openplanetdata.com`.
- KFB ink canon loaded through jsDelivr.
- KayKit BoardGameBits GLTF bytes loaded from the KFB GitHub repo.

If the board boots but no countries appear, inspect in this order:

1. OpenPlanetData catalogue request / CORS.
2. v2 `geojson` country entries returned for the pilot ISO codes.
3. country GeoJSON request / CORS.
4. console for geometry/triangulation failures.

If the country board works but markers fail, inspect the KayKit GLTF URL and its sibling `.bin`; GLTF relative buffer URLs must resolve from the same repo folder.

If the KFB ink module fails to import, the P0 keeps the map adapter and reports `canon unavailable; adapter black`. That is a degraded diagnostic state, not permission to fork the card-ink SSOT.

## Rollback

This tool is additive. Rollback is confined to `tools/kfb-cartoon-map-board/`; do not modify `osm-city-lab`, cardbuilder or ink-canon to remove it.

## Resume point

First action in a recovery chat: read this file, `README.md`, `CHANGELOG.md`, `docs/STORY_FOCUS_P02.md`, then inspect the deployed P0.2 visually before adding hierarchy/cards/authoring.

Current next slice after visual QA: **Europe -> country -> region -> city**, handing detailed city ownership back to `osm-city-lab`.
