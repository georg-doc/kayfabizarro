# Changelog · additive

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
- Hürth pilot should reuse this same pipeline with a second source spec, not fork the architecture.

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
- Pending local fixture run and GitHub CI source cache at time of this entry.

### PUBLIC DEPLOYMENT
- Not claimed.

### GEORG ACCEPTANCE
- Pending.

### OPEN
- Real Overpass cache + S0 report.
- S1 browser visual review.
- S2 receiver integration in named Travel/Free-Roam seam.
