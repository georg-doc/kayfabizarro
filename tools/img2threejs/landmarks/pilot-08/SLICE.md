# TinySkies × OSM × Grotesque Integrated Proof v1 · Pilot 08 · 2026-09-19

**Status:** IMPLEMENTATION SLICE  
**Owner:** `georg-doc/kayfabizarro/tools/img2threejs/`  
**Branch:** `img2threejs/tinyskies-osm-integrated-proof-v1-2026-09-19`  
**Base dependency:** Pilot 07 / PR #109  
**Stage route:** `https://kayfabizarro.pages.dev/kfb-hub/stage/img2threejs/tinyskies-osm-cohesion-v1/`

## GOAL

Build one visible proof that terrain, real OSM city massing and a hero Grotesque landmark can share one visual world.

The candidate must show:

- real Hürth OSM geometry from the tested City scene;
- a modularized Cologne Cathedral derived from the Georg-accepted v0.2 source;
- City Grotesque presentation on the cathedral;
- TinySkies-derived world-cohesion rules: flat-lit materials, shared rim, local emissive details, terrain grounding;
- OSM Day + Day / Evening / Night comparison;
- rain as world overlay only;
- source-derived lighthouse / observatory references in isolation before integrated use.

## EXISTING OWNERS

- OSM City Lab: geodata / local metre geometry / current City style.
- img2threejs: landmark authoring donor.
- KFB Travel: current KFB world/sky owner.
- Race / Travel: movement/contact/physics.
- Audio: audio/weather sound.
- Registry/Librarian: asset identity.

No new owner is introduced.

## SOURCE PINS

### KFB dependency

Pilot 07 branch head at slice start:
`2f98d7adfa6f9074efad6894ecb3e0b4d3b225c6`

Current Hürth consumer scene:
`tools/osm-city-lab/scenes/huerth-v0.json`

Current tested Stage OSM mesh donors:
- `city-style.mjs` blob `788de83c97d12ef71260be18c1996dae065e6e48`
- `city-geometry.mjs` blob `a600aedb4a364f2de13e1cb84cc5869e580c4a9f`

Accepted Dom source:
`tools/img2threejs/prototypes/koelner-dom/v0.2/index.html`

### TinySkies donor

`dannylimanseta/tinyskies@2659a5cc987d7e4a4c5aa7e79c86a1626ad75df6`

Reference behaviour and source blobs are inherited from Pilot 07.

## PROTECTED BOUNDARIES

- The Hürth placement of Cologne Cathedral in this proof is explicitly **STYLE_INTEGRATION_ONLY_NOT_GEO**.
- It is not a real Cologne Cathedral OSM override.
- No Hürth OSM building is silently claimed to be the Cathedral.
- Physics/collision use is not implemented.
- Rain does not modify building wetness/roughness in this baseline.
- TinySkies references are source-derived procedural recreations for visual comparison, not copied upstream assets/code.
- No hero-only key light: landmark and OSM share the world light/rim.
- Existing accepted Dom v0.2 remains unchanged.

## DONE WHEN

1. Hürth OSM buildings render from the current consumer scene in Grotesque.
2. Dom geometry is modularized from accepted v0.2 and retains source dimensions/triangle budget class.
3. Dom semantic groups remain attached under Grotesque.
4. One shared rim controller affects OSM, Dom and reference props.
5. World controls provide OSM Day / Day / Evening / Night and rain on/off.
6. Rain leaves baseline object albedo/roughness unchanged.
7. Terrain is a rolling TinySkies-like host with a flat urban pad and explicit grounding.
8. Lighthouse and Observatory source-reference recreations can be shown in isolation.
9. Static/source tests and browser screenshot evidence exist.
10. Exact tested files are mirrored to the fixed Cloudflare Stage route and linked from KFB Hub.

## HUMAN GATE

Does the integrated scene finally read as **one breathing toy world** rather than terrain + city + landmark from separate renderers?
