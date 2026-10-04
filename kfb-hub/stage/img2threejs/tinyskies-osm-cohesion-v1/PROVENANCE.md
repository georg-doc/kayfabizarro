# PROVENANCE · TinySkies × OSM × Grotesque Stage v1

**Stage route:** https://kayfabizarro.pages.dev/kfb-hub/stage/img2threejs/tinyskies-osm-cohesion-v1/

## Source candidate

- Repo: `georg-doc/kayfabizarro`
- Branch: `img2threejs/tinyskies-osm-integrated-proof-v1-2026-09-19`
- PR: #110 (draft)
- Tested runtime head: `aa28a743628699271c94c1911af23d0564c6f3cc`
- Source browser workflow: `35471351012`
- Source artifact: `10591829944`

## Donors

- Real Hürth OSM scene: `tools/osm-city-lab/scenes/huerth-v0.json`
- Existing tested OSM Stage mesh/style modules
- Georg-accepted Cathedral v0.2 direction
- TinySkies source behaviour reviewed at `dannylimanseta/tinyskies@2659a5cc987d7e4a4c5aa7e79c86a1626ad75df6`

## Stage packaging

Most files are byte-equivalent to the tested source candidate. `dom-geometry.mjs` and `dom-rig.mjs` only replace relative authoring imports with canonical public `/tools/...` imports so the fixed Stage location consumes the existing owners rather than copying them.

The Stage is not a new OSM, Travel, Race, Audio or asset owner.

## Geography boundary

The Cathedral placement inside the Hürth scene is deliberately synthetic for style integration:

`STYLE_INTEGRATION_ONLY_NOT_GEO`

Do not interpret it as a real Cologne Cathedral OSM binding.
