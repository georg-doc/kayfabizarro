# Three-geo-play donor P0

Status: **IMPLEMENTATION CANDIDATE · ISOLATED DONOR PROOF · NO CONSUMER INTEGRATION**

Owner: `tools/osm-city-lab/`

Branch: `chatgpt-web/osm-city-three-geo-donor-p0-2026-10-01`

## Purpose

Test whether [lorenzoMezza/Three-geo-play](https://github.com/lorenzoMezza/Three-geo-play) can provide an optional native-Three.js vector-tile streaming shell around the existing deterministic KFB OSM City Lab.

This does **not** replace the cached OSM -> normalized -> scene-recipe pipeline.

## Exact donor

- repository: `lorenzoMezza/Three-geo-play`
- upstream commit: `78a6b822261929a54f731dd08a972cf7b0a11500`
- package: `lm-three-geo-play@2.2.0`
- license: MIT
- vector source for P0: OpenFreeMap
- test origin: current `ehrenfeld-v0` origin `50.949425, 6.917500`

The P0 deliberately runs the donor package against the existing KFB WebGL baseline `three@0.160.0`. Upstream declares `three >=0.150.0`; a compatibility failure here is a P0 result and must not be repaired by silently introducing a second Three.js runtime.

## Source-isolation modes

- **A SOURCE** — upstream geometry + upstream default style. No KFB deformation.
- **B KFB MATERIAL** — the same loaded geometry; only layer colors/material presentation are changed.
- **C RUN STREAM** — a follow target traverses multiple tile areas while tile load/unload state is recorded.
- **D QUERY** — click probe uses `pickFeature()`, `worldToLatLon()` and `getHeightAt()`.

The P0 does not add Clay K2 relief/toolmix, Elastic/LOOK-TORSION deformation, FACADE_RULE, collision, locomotion, residents, cars, props or a second world owner.

## Diagnostics

`window.__KFB_THREE_GEO_P0__.snapshot()` returns:

- build marker;
- donor version/commit and Three version;
- tile ready/loading/failed/rebuilding counts;
- tile load/unload/source-error events;
- worker starts/fallbacks;
- draw calls, triangles, geometries, textures;
- rolling FPS and p95 frame time;
- DPR;
- selected feature query result.

## Owner boundaries

- OSM City Lab remains authoritative for cached OSM identity, deterministic geometry/style/export and authored hero zones.
- Travel/Race/Ground remain movement/physics owners.
- Three-geo-play owns only the experimental vector-tile decode/build/load lifecycle in this P0.
- Future KFB look work must consume the existing clay/façade/shadow routers instead of creating another shader/deformer stack.

## Planned Stage

Reserved route:

`https://kayfabizarro.pages.dev/kfb-hub/stage/osm-city-three-geo-p0/`

It is **not public-verified** until that exact Cloudflare URL returns the expected build marker and the browser proof passes. GitHub/raw/GitHub Pages are not human acceptance surfaces.

## Next gate

Run the automated local browser proof, inspect SOURCE and KFB MATERIAL screenshots/metrics, then decide whether this donor is worth a P0B seam/deformation adapter.
