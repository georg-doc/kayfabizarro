# Changelog · additive

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
