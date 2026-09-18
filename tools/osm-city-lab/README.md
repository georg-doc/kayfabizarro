# KFB OSM City Lab

Status: **MULTI-SLICE S0 TESTED · S1c CLEAN/CARTOON/GROTESQUE + SIGNS + FOREST BROWSER PASS · S2 EXPORT CONTRACT TESTED**

Browser entry: `tools/osm-city-lab/index.html`

Current datasets:

- `ehrenfeld-v0` — dense urban pilot
- `huerth-v0` — suburban / road↔terrain pilot

Viewer examples:

```text
index.html?city=ehrenfeld-v0&look=clean
index.html?city=ehrenfeld-v0&look=cartoon
index.html?city=ehrenfeld-v0&look=grotesque
index.html?city=ehrenfeld-v0&look=cartoon&labels=1
index.html?city=huerth-v0&look=cartoon&nature=1
```

S1c keeps one normalized OSM source but exposes independent presentation modes/layers:

- **Clean Massing** — direct footprint extrusion, flat extrusion cap, no separate roof geometry;
- **Cartoon Massing** — stronger but controlled deterministic lean/bend/taper/twist plus sparse irregular window material-codes;
- **Grotesque Massing** — exaggerated stacked/cubist building deformation plus wide-angle composition, still presentation-only;
- **Street Signs** — actual preserved OSM `name=*` rendered on small 3D signposts with building-clearance checks;
- **Forest POC** — exact GitHub KayKit Forest/Nature trees scattered deterministically only on mapped green landuse.

Road presentation now uses continuous strips plus shared-OSM-node junction patches, and non-driveable pale paths sit below driveable asphalt to avoid coplanar flicker.

None of these presentation layers modifies the S2 road/building collision export.

## Current tested S0 results

### Köln-Ehrenfeld v0

BBox:

`50.94675, 6.91280 → 50.95210, 6.92220`

Origin: `50.949425, 6.917500`

- source elements: **11,874**
- roads: **372**
- buildings: **1,808**
- landuse: **22**
- normalized bounds: **659.24 × 595.56 m**
- deterministic reload / ID preservation / bbox clipping: **PASS**

### Hürth v0

BBox:

`50.862756, 6.872018 → 50.869044, 6.881982`

Origin: `50.865900, 6.877000`

- source elements: **5,640**
- roads: **164** / driveable road parts **116**
- buildings: **700**
- landuse: **22**
- green polygons: **10**
- water lines: **2**
- normalized bounds: **700.05 × 699.976 m**
- longest source-derived drive corridor candidate: **Am Heideberg · 478.64 m**
- suburban/intersection/corridor/road-green-edge fixture signals: **PASS**
- deterministic reload / ID preservation / bbox clipping: **PASS**

The browser never queries Overpass and no OSM raster tile is used as geometry.

## Shared pipeline

```text
per-city SOURCE_SPEC + query.overpassql
→ cached Overpass vector response
→ shared deterministic WGS84→local-metre normalization + bbox clipping
→ per-city normalized.json
→ shared procedural KFB low-poly viewer
→ per-city consumer scene recipe
```

Shared scripts accept a city ID; Hürth does not fork the Ehrenfeld architecture.

OSM IDs and source tags survive normalization. Missing widths/heights use explicit deterministic fallback rules; roof/style choices are stable by OSM identity.

## Ownership

City Lab owns geodata normalization, city geometry, styling and export only.

- Travel owns World/Terrain/Mode/Persistence.
- Ground uses the existing Travel/WB0 movement seam.
- DRIVE receiver is the existing Race Slice-04 physics donor described by `skills/chat/workflows/ASTRA_INTEGRATION_01_2026-09-18/WALK_DRIVE_COMBAT/CONTRACT_PROPOSAL.md`; it is not reimplemented here.
- Registry/Librarian owns GitHub asset identity/provenance.
- `img2threejs` and `2D Animation Studio` remain optional later donors.

## Acceptance state

**S0 TESTED RESULT:** Ehrenfeld + Hürth source/cache/normalization gates are green.

**S1c TESTED RESULT:** Clean/Cartoon/Grotesque, OSM street-sign and KayKit Forest/Nature presentation cases boot in Chromium/WebGL. Ehrenfeld produces 183 driveable-road junction patches / 168 lower path meshes / 27 safe OSM-name signs; Hürth produces 104 / 48 / 19 plus a 72-tree KayKit green-landuse POC. Separate roof caps remain removed and S2 geometry remains undeformed. Georg live moving/zoom/art-direction acceptance remains pending.

**S2 IMPLEMENTATION:** consumer exports exist. The actual Walk/Drive receiver loops have not yet been run on these OSM scenes.

**PUBLIC DEPLOYMENT:** not claimed.

## Source / licence

Map data © OpenStreetMap contributors, ODbL 1.0. Exact bbox, query, endpoint, OSM base timestamp and SHA-256 live in each dataset’s `PROVENANCE.json`.

See `START_HERE.md`, `docs/CARTOON_MASSING.md`, `docs/PRESENTATION_S1C.md`, `docs/LANDMARK_OVERRIDES.md`, `docs/CORRIDOR_EHRENFELD_HUERTH.md`, the remaining `docs/`, and `evidence/`.
