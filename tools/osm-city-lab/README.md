# KFB OSM City Lab

Status: **S0 TESTED RESULT · S1 VIEWER IMPLEMENTED · S2 EXPORT CONTRACT IMPLEMENTED**  
Pilot: **Köln-Ehrenfeld v0**

Browser entry: `tools/osm-city-lab/index.html`

## Fixed v0 area

`50.94675, 6.91280 → 50.95210, 6.92220`

Approx. **596 m north–south × 659 m east–west**, centred at `50.949425, 6.917500`, around Venloer Straße / Ehrenfeldgürtel / Heliosstraße.

The source is a cached, read-only Overpass vector query. The browser never queries Overpass and no OSM raster tile is used as geometry.

## Current tested S0 result

The committed cache and deterministic rebuild are green in GitHub CI.

- source elements: **11,874**
- normalized roads: **372**
- buildings: **1,808**
- landuse polygons: **22**
- normalized bounds: **659.24 × 595.56 m**
- OSM IDs preserved: **PASS**
- deterministic reload: **PASS**
- geometry clipped to the fixed bbox: **PASS**
- missing referenced nodes: **0**
- unsupported relations in this snapshot: **0**

S1 has code and a browser viewer, but no Georg visual acceptance is claimed. S2 has a concrete consumer export/owner contract, but the Walk/Drive receiver loop has not yet been run on this OSM scene.

## Pipeline

```text
SOURCE_SPEC + query.overpassql
→ one CI Overpass refresh
→ source.overpass.json + PROVENANCE.json
→ deterministic local ENU/metre normalization + bbox clipping
→ normalized.json
→ procedural KFB low-poly viewer
→ scenes/ehrenfeld-v0.json consumer handoff
```

OSM IDs and source tags survive normalization. Missing widths/heights use explicit deterministic fallback rules; roof/style choices are stable by OSM identity.

## Ownership

City Lab owns geodata normalization, city geometry, styling and export only.

- Travel owns World/Terrain/Mode/Persistence.
- Ground uses the existing Travel/WB0 movement seam.
- DRIVE receiver is the existing Race Slice-04 physics donor described by `skills/chat/workflows/ASTRA_INTEGRATION_01_2026-09-18/WALK_DRIVE_COMBAT/CONTRACT_PROPOSAL.md`; it is not reimplemented here.
- Registry/Librarian owns GitHub asset identity/provenance.
- `img2threejs` and `2D Animation Studio` remain optional later donors.

## Source / licence

Map data © OpenStreetMap contributors, ODbL 1.0. Exact bbox, query, endpoint, OSM base timestamp and SHA-256 live in `data/ehrenfeld-v0/PROVENANCE.json`.

See `START_HERE.md`, `docs/`, and `evidence/ehrenfeld-v0-s0-report.json`.
