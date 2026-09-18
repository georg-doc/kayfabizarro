# KFB OSM City Lab

Status: **S0 IMPLEMENTATION + S1 VIEWER + S2 EXPORT CONTRACT · REAL SOURCE CACHE VIA CI**  
Pilot: **Köln-Ehrenfeld v0**

Browser entry: `tools/osm-city-lab/index.html`

## Fixed v0 area

`50.94675, 6.91280 → 50.95210, 6.92220`

Approx. **596 m north–south × 659 m east–west**, centred at `50.949425, 6.917500`, around Venloer Straße / Ehrenfeldgürtel / Heliosstraße.

The source is a cached, read-only Overpass vector query. The browser never queries Overpass and no OSM raster tile is used as geometry.

## Pipeline

```text
SOURCE_SPEC + query.overpassql
→ one CI Overpass refresh
→ source.overpass.json + PROVENANCE.json
→ deterministic local ENU/metre normalization
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

Map data © OpenStreetMap contributors, ODbL 1.0. Exact bbox, query, endpoint, OSM base timestamp and SHA-256 live in `data/ehrenfeld-v0/PROVENANCE.json` after a successful cache run.

See `START_HERE.md` and `docs/`.
