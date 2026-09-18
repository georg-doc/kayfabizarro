# Changelog · additive

## 2026-09-18 · Hürth v0 S0 tested result + shared multi-city pipeline

### DECISION
- Reused the Ehrenfeld City-Lab architecture instead of copying it.
- Fixed the first Hürth v0 candidate directly around the supplied centre at a ~700 × 700 m bbox:
  `50.862756,6.872018,50.869044,6.881982`.
- The first candidate passed all requested source-derived fixture signals, so no bbox shift was required.

### IMPLEMENTATION
- Added generic `fetch-city.mjs`, `build-city.mjs`, `analyze-city.mjs` and city-ID snapshot tests.
- Removed the last Ehrenfeld-specific path from the shared S2 exporter.
- Added one shared KFB city style and parameterized the S1 viewer via `?city=<id>`.
- Added Hürth source spec, exact fixed-bbox query and CI source/fixture workflow.
- Hardened the cache workflow against branch-write races by rebasing before the bot push.

### TESTED RESULT
- Hürth cached source: **5,640** Overpass elements; OSM base timestamp `2026-09-18T15:30:51Z`.
- Final normalized bounds: **700.05 × 699.976 m**.
- Feature counts: **164** road parts, **116** driveable road parts, **700** buildings, **22** landuse surfaces, **10** green polygons, **2** water lines.
- Fixture probe found **154** road connection/intersection nodes.
- Longest driveable normalized road part: `Am Heideberg`, OSM `way/27933239`, **478.64 m**.
- Requested fixture signals all PASS: residential context, intersection, acceleration corridor, road/green edge.
- Deterministic reload, OSM ID preservation, metre frame and fixed-bbox clipping PASS.
- Diagnostics: 0 missing nodes, 0 open polygon ways, 0 unsupported relations.

### PUBLIC DEPLOYMENT
- Not claimed.

### GEORG ACCEPTANCE
- S1 Hürth visual acceptance pending.
- S2 Hürth Walk/Drive acceptance pending.

### OPEN
- Review Hürth in the shared browser viewer.
- Mount the generated Hürth scene into the named Travel/Free-Roam receiver and execute the requested reverse/turn/parking/road↔terrain loop.
- Authored stunt layer only after the base receiver seam works.

---

## 2026-09-18 · Ehrenfeld v0 S0 tested result

### TESTED RESULT
- GitHub Actions source/cache/build/snapshot run completed successfully.
- Cached source: 11,874 Overpass elements; OSM base timestamp `2026-09-18T15:18:35Z`.
- Final normalized bbox is exactly the intended local slice: `659.24 × 595.56 m`.
- Final feature counts: 372 road parts, 1,808 buildings, 22 landuse surfaces, 0 water lines.
- Source and normalized regeneration are deterministic for the committed snapshot.
- OSM IDs are preserved and the geometry is clipped to the fixed bbox.
- Diagnostics: 0 missing nodes, 0 unsupported relations; 117 polygons and 6 line continuations required deterministic bbox clipping.

### CORRECTION
- The first real-source run exposed full OSM ways extending beyond the query bbox after recursive node expansion. That intermediate blockout reached roughly 3 × 4 km and was **not accepted** as S0.
- The normalizer now clips lines and polygons to the selected bbox while retaining OSM provenance plus local part/ring identity.
- The corrected cache/rebuild passed the hardened bbox gate.

### IMPLEMENTATION
- S1 low-poly viewer is implemented with top / oblique / street cameras.
- S2 consumer recipe is generated with frame, road/sidewalk data, building obstacles, landuse, provenance and candidate anchors.
- City Lab still owns no Walk/Drive physics.

### PUBLIC DEPLOYMENT
- Not claimed.

### GEORG ACCEPTANCE
- S0 data pipeline: no separate human acceptance required beyond the requested reproducible source gate.
- S1 visual acceptance: pending.
- S2 Walk/Drive acceptance: pending.

### OPEN
- Browser visual review of Ehrenfeld S1.
- Mount `ehrenfeld-v0.json` into the existing Travel/Free-Roam receiver and execute the full Walk→Drive loop.

---

## 2026-09-18 · Ehrenfeld v0 S0–S2 implementation start

### DECISION
- Fixed pilot bbox `50.94675,6.91280,50.95210,6.92220` (~596 × 659 m).
- Fixed local metre frame origin `50.949425,6.917500`.
- Reused current Free-Roam receiver proposal: Travel host + Race Slice-04 DRIVE donor; City Lab owns no movement engine.

### IMPLEMENTATION
- Added exact Overpass query + source spec + style spec.
- Added deterministic OSM normalization with ID/tag preservation, width/height fallbacks and basic multipolygon outer-ring stitching.
- Added GitHub Actions source-cache path; browser/runtime never queries Overpass.
- Added S1 Three.js low-poly viewer with top/oblique/street cameras and visible OSM attribution.
- Added S2 consumer export generator with roads, sidewalk hints, building obstacles, landuse/water and safety-qualified candidate anchors.
- Added automated synthetic normalization test and real-cache snapshot test.
- Added source/style/consumer/test/donor documentation.

### TESTED RESULT
- Pending local fixture run and GitHub CI source cache at time of this historical entry.

### PUBLIC DEPLOYMENT
- Not claimed.

### GEORG ACCEPTANCE
- Pending at that historical checkpoint.

### OPEN
- Historical entry retained; superseded by the tested-result sections above.
