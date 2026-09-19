# TinySkies × OSM × Grotesque Stage Return · 2026-09-19

**Status:** PUBLIC PROOF FAILED ×2 · RECOVERY EXPORTED · HUMAN REVIEW BLOCKED  
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

## Public verification result

The public gate failed twice:

1. attempt 1: candidate not yet present on the actual `cloudflare-live` publication branch; public marker returned Hub fallback HTML;
2. attempt 2: publication branch contained the candidate, but `SOURCE.json` is malformed by a trailing literal `\\n`.

Workflow: `35471646709` · attempts 1–2.

Per KFB stop rule, no third repair pass is made in this slice.

Recovery export:
[../landmarks/pilot-08/failure-recovery/START_HERE.md](../landmarks/pilot-08/failure-recovery/START_HERE.md)

**PUBLIC_VERIFIED = NO**  
**HUMAN REVIEW = BLOCKED**

Exactly one next gate: marker-only repair and rerun of the unchanged public proof.
