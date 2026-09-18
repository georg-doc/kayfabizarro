# Changelog · additive

## 2026-09-18 · S1c roads / grotesque skyline / OSM signs / KayKit nature

### DECISION
- Keep City Lab movement-free; actual WASD / Walk↔Drive remains Travel + Free Roam owned.
- Split presentation into `clean | cartoon | grotesque` instead of forcing extreme distortion into the playable default.
- Preserve OSM road/name/landuse truth and treat signs, trees and landmark overrides as presentation consumers.

### IMPLEMENTATION
- Driveable roads remain continuous joined strips and now receive presentation-only junction patches at shared OSM node IDs.
- Non-driveable pale paths render below driveable asphalt, removing the remaining path/road coplanar competition at crossings.
- Added stronger `cartoon` tuning plus an optional `grotesque` preset with deterministic stacked-ring offsets and wide-angle camera composition.
- Added `STREET SIGNS` from preserved OSM `name=*` tags plus a `SIGN VIEW` camera.
- Street-sign placement evaluates both road sides and multiple edge offsets against building footprints; roads without safe sign space are skipped.
- Added `FOREST POC` using exact GitHub KayKit Forest/Nature Tree_1/2/3 assets, deterministically scattered only on mapped green landuse with road/building clearance.
- Added empty landmark-override manifest/contract for later GitHub low-poly landmarks such as the Cologne Cathedral.
- Added Work Lead handoff and a source-derived Ehrenfeld↔Hürth corridor discovery lane.

### TESTED RESULT
- Latest S1c browser/WebGL run `35389507129`, job `105744305683`: **PASS**.
- Ehrenfeld: 372 source roads / 1,808 buildings / 183 road-junction patches / 168 lower path meshes / 27 safe OSM street-name signs.
- Hürth: 164 source roads / 700 buildings / 104 road-junction patches / 48 lower path meshes / 19 safe OSM street-name signs.
- Hürth Forest POC: 72 source-backed KayKit tree instances loaded from the repository.
- Clean emits 0 window material-codes; Cartoon/Grotesque preserve the deterministic 3,367 Ehrenfeld / 849 Hürth code set.
- S2 geometry remains undeformed and viewer movement owner reports `none-viewer-only`.
- No page/console errors in the tested cases.
- Evidence artifact `10564934919` (`osm-city-s1c-presentation-proof`).

### PUBLIC DEPLOYMENT
- Not claimed by this branch. Permanent Cloudflare verification remains a separate post-merge gate.

### GEORG ACCEPTANCE
- S1b direction was positively received; S1c road shimmer/gap repair, stronger Grotesque intensity, sign readability and forest density remain a live browser/art-direction review.

### OPEN
- Ehrenfeld↔Hürth source route discovery is independent from S1c and currently **SOURCE BLOCKED · RETRYABLE** by public Overpass availability. Two unchanged small-chunk attempts failed on different chunks after other chunks succeeded; do not infer a route until source evidence exists.
- Real Walk/Drive remains the existing Free-Roam/Travel receiver task.
- Landmark models remain optional overrides; base OSM massing must always work without them.

---
## 2026-09-18 · S1b simplified / cartoon massing

### DECISION
- Preserve one OSM source geometry and compare two viewer modes: `clean` and `cartoon`.
- Clean mode is the anatomy baseline: OSM footprint → simple extrusion → flat top cap.
- Cartoon mode reuses the older KFB Cartoon-Verbieger grammar only in a conservative presentation layer: object-normalized, ground-anchored, deterministic per OSM identity.
- S2 collision/export geometry remains undeformed.

### IMPLEMENTATION
- Removed all separate roof boxes/cones from the S1 viewer.
- Added `src/style/cartoon-city.js` with mild deterministic lean/bend/taper/twist for building massing.
- Added sparse irregular window material-codes; they are intentionally not floor-aligned facade rows.
- Replaced per-segment road rectangles with a continuous joined-miter strip per centerline.
- Increased explicit vertical separation between terrain / landuse / sidewalk / road to reduce depth fighting.
- Added Clean Massing / Cartoon Massing controls and a first Cartoon View camera preset.
- Added branch browser/WebGL proof for both cities and both looks.

### TESTED RESULT
- Branch browser/WebGL run `35385560694`, job `105731534856`: **PASS**.
- Four cases passed: Ehrenfeld clean/cartoon and Hürth clean/cartoon.
- Expected source counts remained intact: Ehrenfeld 372 roads / 1,808 buildings; Hürth 164 roads / 700 buildings.
- Clean mode emitted 0 window codes; Cartoon mode emitted 3,367 in Ehrenfeld and 849 in Hürth.
- All cases reported 0 separate roof meshes, `joined-miter` road strips, explicit road/sidewalk/landuse vertical separation, undeformed S2 geometry, and no page/console errors.
- Screenshot artifact `osm-city-massing-proof` (artifact `10564070951`) was visually inspected: the former large floating roof caps are absent and the captured road surfaces no longer show the previous bright segment-junction triangles. Live moving/zoom shimmer remains a Georg browser gate rather than an automated visual claim.

### PUBLIC DEPLOYMENT
- Not claimed by this branch.

### GEORG ACCEPTANCE
- Pending comparison of road shimmer, city anatomy and cartoon intensity.

### OPEN
- Tune one shared deformation grammar only after visual review; avoid per-building exceptions.
- Continue City Drive / Travel integration from the unchanged S2 export, not from presentation-deformed building geometry.

---

## 2026-09-18 · S2 consumer export hardening

### TESTED RESULT
- Added an explicit consumer-contract gate for both `ehrenfeld-v0` and `huerth-v0`.
- Both exported scenes regenerate deterministically from their committed normalized OSM datasets.
- Both scenes provide a local metre frame, driveable road metadata, sidewalk hints, building obstacles and the required foot / park / intersection / road↔terrain candidate anchors.
- Candidate anchors are checked against mapped building footprints; road↔terrain anchors are additionally verified to lie on their declared driveable source road.
- Ehrenfeld road↔terrain candidate: `way/4919998`, local bbox edge distance 0 m.
- Hürth road↔terrain candidate: `way/40306265:0`, local bbox edge distance 0 m and mapped green distance 0 m.
- Second deterministic CI run after the scene commit reported `No S2 scene delta.`.

### CORRECTION
- The first hard gate found the original Ehrenfeld `road-terrain-transition` candidate inside building `way/343089597` (Körnerstraße 22).
- The former heuristic used an outer road midpoint without checking mapped obstacles.
- The exporter now samples driveable road geometry, rejects mapped building footprints, and scores remaining candidates by local-edge / green proximity while preserving the exact source-road identity.

### STATUS
- S2 **export contract**: TESTED RESULT.
- S2 **Travel / Free-Roam runtime integration**: OPEN.
- S2 **driving / reverse / parking / road↔terrain browser acceptance**: OPEN.
- No Race/Travel movement or physics runtime was changed by this slice.

---

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
