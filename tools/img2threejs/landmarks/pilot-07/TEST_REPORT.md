# TEST REPORT · TinySkies × OSM × Landmark Cohesion v1 · 2026-09-19

**Result:** 31 / 31 PASS  
**Evidence class:** static source / contract evaluation  
**Browser/WebGL:** NOT RUN  
**Cloudflare Stage:** NOT DEPLOYED

## What was tested

- Grotesque remains the landmark default.
- OSM remains the landmark-review default.
- TinySkies donor commit and key reviewed file blobs are exact.
- Shared rim / flat-shading / terrain grounding donor facts are encoded.
- Rain behaviour does not falsely claim building wetness or albedo changes.
- World phase weights normalize to 1.
- Rain input clamps to 0..1.
- TinySkies-like baseline object response keeps albedo stable and wetness at zero.
- Local emissive roles remain opt-in.
- Grounding contract requires terrain-sampled foundations / no floating.
- World owns sky/fog/light/rim/weather; object owns albedo/identity/geometry.
- Landmark hero-light default is false.
- Wet material response remains a separate future gate.

## Reproduction

Repository-native test:

`node tools/img2threejs/tests/check_tinyskies_osm_cohesion_v1.mjs`

The same current branch source was also evaluated in-session through Code Mode and returned 31/31 PASS.

## Browser boundary

This slice intentionally produces a contract and helper rather than a visual runtime candidate.

Reserved Stage route:

`https://kayfabizarro.pages.dev/kfb-hub/stage/img2threejs/tinyskies-osm-cohesion-v1/`

It is **not deployed or publicly verified**.

## Next test gate

The first visual proof should combine, in one receiver-owned Stage:

- TinySkies-like terrain/world state;
- one OSM block cluster;
- one Grotesque landmark;
- shared rim/light/fog;
- day/evening/night;
- rain on/off;
- terrain-sampled grounding.
