# TinySkies × OSM × Grotesque Stage Return · 2026-09-19

**Status:** STAGE CANDIDATE PUBLISHED TO MAIN · PUBLIC BROWSER VERIFICATION PENDING  
**Direct human route:** https://kayfabizarro.pages.dev/kfb-hub/stage/img2threejs/tinyskies-osm-cohesion-v1/

## Source

- Source branch: `img2threejs/tinyskies-osm-integrated-proof-v1-2026-09-19`
- Draft PR: [#110](https://github.com/georg-doc/kayfabizarro/pull/110)
- Exact tested runtime head: `aa28a743628699271c94c1911af23d0564c6f3cc`
- Source workflow: [35471351012](https://github.com/georg-doc/kayfabizarro/actions/runs/35471351012)
- Source artifact: `10591829944`

## Source evidence

- 27/27 static/source PASS
- 19/19 Chromium/WebGL PASS
- 0 page/console/HTTP errors
- source donor objects captured in isolation first
- integrated OSM / Evening / Rain screenshots captured

## Stage package

The fixed Cloudflare Stage directory mirrors the tested runtime.

Byte-equivalent source files:
- `index.html`
- `viewer.mjs`
- `world-material.mjs`
- `terrain-host.mjs`
- `tinyskies-reference.mjs`

Import-path-only Stage adapters:
- `dom-geometry.mjs`
- `dom-rig.mjs`

Those two adapters only rewrite authoring-relative imports to canonical public `/tools/...` owner paths. No geometry/style logic is changed.

## Boundaries

- Cathedral Hürth placement = `STYLE_INTEGRATION_ONLY_NOT_GEO`
- no real Cologne OSM override
- no wet facade material response
- no new Race/Travel/Audio/Registry owner
- no Live promotion

## Public verification gate

A dedicated main-branch workflow polls `SOURCE.json` on the exact pages.dev route, then runs Chromium checks and screenshots.

Do not change this status to PUBLIC VERIFIED until that workflow passes and the exact route exposes `aa28a743628699271c94c1911af23d0564c6f3cc`.
