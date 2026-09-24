# Changelog · additive

## 2026-09-24 · WORLD-ZONE-BAKE-01 · Cologne reusable baked zone

### IMPLEMENTATION
- Added deterministic World Zone compiler under `src/world-zone/` plus `scripts/build-world-zone.mjs`.
- Baked `dom-zentrum-v0` once into versioned package `world-zones/cologne-dom-zentrum-v0/2026-09-24.1/`.
- Package carries source spec/query/provenance, normalized semantics, roads, building semantics, anchors, `visual.glb`, undeformed support/collision, compiler/look/deformer revisions, manifest, tests and checksums.
- Added WorldBuilder consumer fixture that stores only `kind: world-zone`, manifest ref and transform.
- Landmarks remain separate modules; raw Overpass source is excluded from the runtime package.

### TESTED RESULT
- G0 source/cache verifier: **14/14 PASS** · run `36028104923`.
- G1 deterministic compiler/package contract: **51/51 PASS** · run `36028566910`.
- G2 canonical package: **51/51 PASS** · run `36029199406` · package commit `1888824ef0f28670f55e21301c18cf3254d32370`.
- G3 Chromium load/place/reload: **22/22 PASS**, 0 page/console errors, 0 HTTP errors · run `36029946915`.
- G3 reload requested exactly `MANIFEST.json` + `visual.glb`; no normalized/raw/Overpass fetch.
- Browser artifact `10820974194`, digest `sha256:52a97f4629b86ea2a7e18672ad2bb545524814794ccfa69782605126326655b5`, contains four screenshots + report.

### RECOVERY
The initial CI branch was frozen after two repair passes on its source-lock gate. Full recovery is preserved in `docs/WORLD_ZONE_BAKE_01_FAILURE_RECOVERY_2026-09-24.md`; the successful G0→G3 continuation reused the salvaged compiler rather than replaying or hiding that failure.

### PUBLIC / HUMAN
- Cloudflare: not used.
- Stage/Live: not published/promoted.
- Georg acceptance: open.
- Barcelona: deferred second-city portability proof.

---


## 2026-09-20 · Dom / Zentrum reusable OSM dataset

### DATA
- Added cached real OSM/Overpass dataset `dom-zentrum-v0` for Cologne Cathedral / HBF / Altstadt / Rhine.
- Raw source SHA-256: `8ab058da444eee7bd54c367aec770bbe10c4bef2ddda636cd95b886f5dca244c`.
- OSM base timestamp: `2026-09-20T03:20:04Z`.
- Source cache commit: `19f6ec3729a2d1be93bab04a871186b53df230ec`.
- Added normalized metre-frame geometry, consumer scene, fixture evidence, rail/hero design context and a smaller `CLAUDE_CONTEXT.json`.

### TESTED RESULT
- raw elements: **145,967**
- roads: **5,236** / driveable **2,523**
- buildings: **6,351**
- landuse/surface polygons: **456**
- water lines: **6**
- railway ways: **665**
- local bounds: **2,279.652 × 2,115.070 m**
- S0 gates: source cached / OSM IDs / local-metre frame / roads / buildings / deterministic reload / bbox clip = **PASS**

### HERO SOURCE ANCHORS
- Kölner Dom: `way/4532022`
- Köln Hauptbahnhof: `node/2399559029`
- Hohenzollernbrücke: `relation/5460390`
- Deutzer Brücke: `relation/3837695`
- Rheinufertunnel: `way/23559378`

### LICENSE / ATTRIBUTION
Map data **© OpenStreetMap contributors · ODbL 1.0**. Exact endpoint, bbox, retrieval time and source hash are in `data/dom-zentrum-v0/PROVENANCE.json`.

### CONSUMER
The dataset closes the geography gate for the Claude Design Cologne Race Option C slice. OSM stays geographic/semantic truth; styling/deformation/gameplay remain KFB-owned.

---

## 2026-09-19 · corridor on main + canonical public Stunt World PASS

### IMPLEMENTATION
- PR #86 promoted the reconciled current-source corridor into City Lab `main` at `3813d24e3db04a43117676890e48f7b6baaf6cd9`.
- Main consumer evidence refreshed at `25c2c616720e18d97028bf06fdd03d10c16b3504`; normalized and scene hashes stayed exact.
- Stage mirror package `8607fb512726af81848b6545eda25ad451491f36` exposes the tested Race runtime under `/kfb-hub/stage/stunt-world/`.
- Main proof commit `d78fa862262184aa0ed172ed42e10db6e3705c71` adds canonical public URL verification; no runtime bytes changed.

### TESTED RESULT
- Main corridor consumer `35415680112` / job `105823765381`: **PASS**.
- S2 export contract `35415680163`: **PASS**.
- Canonical Cloudflare Stunt World `35416057009` / job `105824845921`: **29/29 PASS**.
- 9/9 public runtime bytes equal the tested Race revision.
- Public WebGL boot: **2852 ms**.
- Public Hürth join: **4/4** C0 contacts on mapped road.
- Public short drive: **6.406 m**, same C0 run, no new recovery.
- No console/page errors and no failed HTTP assets.
- Artifact: `10575592864`.

### PUBLIC DEPLOYMENT
- `https://kayfabizarro.pages.dev/kfb-hub/stage/stunt-world/` → **PUBLIC STAGE BROWSER PASS**.
- Race remains implementation SSOT; Free Roam C0 remains movement/contact/recovery owner.

### OPEN
- Georg longer/full-route Hürth → Ehrenfeld drive.
- Physical mobile QA.
- Travel Walk↔Drive / Drive↔Flight.
- Landmark runtime.
- Audio integration.
- Live promotion beyond Stage.

---

## 2026-09-19 · tested corridor stack reconciled onto current main base

### IMPLEMENTATION
- Created fresh branch `osm-city/corridor-promote-tested-stack-r2-2026-09-19` from current main `c867788416c50fa9c6e6ce57abc4bad85dca90d1`.
- Reused exact tested Git blobs from stacked PRs #80/#81/#82 instead of replaying old history or reserializing large source files.
- Preserved newer unrelated Resident Atlas main changes.
- Promoted route evidence, current narrow source, normalized corridor, consumer scene, tested source/build scripts and Return docs.
- Promoted the shared normalizer bounds hardening required for corridor-scale arrays.
- Changed networked Overpass workflows to explicit `workflow_dispatch`; deterministic consumer regression remains automatic.

### TESTED RESULT
- Promotion run `35415509853`, job `105823274200`: **PASS**.
- Existing Ehrenfeld/Hürth normalization outputs remain stable.
- Corridor build + deterministic rebuild PASS.
- Normalized SHA-256 remains `e88450d51169f7293bdbfb87955826cf3328a25e00eb3c24e8a08c636e406e6f`.
- Scene SHA-256 remains `258c4d5a3872750bc9045d771646e85dbf36aab8a14243db98adc0d288edf07d`.

### OPEN
- Main merge of the reconciled promotion candidate.
- Human longer-distance Hürth → Ehrenfeld drive.
- Public Corridor Drive Stage.
- Travel Walk↔Drive / Drive↔Flight.

---

## 2026-09-19 · recovery sync after S1c public proof + corridor handoff

### SANITY CHECK
- Current Kayfabizarro main observed at `e00e9d67fcf6884a9d92d01c1b3c397ef50307c9`; unrelated active lanes have advanced main after the City commits.
- S1c public proof: run `35390530619`, attempt 2, job `105748631023` → **27 checks / 2 cities PASS**.
- Public proof validates city entry pages, provenance, exact source road/building counts, no separate roof caps, no City-owned movement and no browser errors.

### CORRIDOR STATUS CORRECTION
- The older `SOURCE BLOCKED · RETRYABLE` note is historical.
- PR #80 generated the 11,384.3 m / 510-node real OSM route candidate and recorded actual Militärringstraße use.
- PR #81 fetched a current narrow corridor source with freshness/skew gates PASS.
- PR #82 exported a deterministic metre-frame consumer scene at bot commit `3db2c786152fd4d77ca33a63effd2a9db9c1d4c1`.
- Corridor scene SHA-256: `258c4d5a3872750bc9045d771646e85dbf36aab8a14243db98adc0d288edf07d`.
- After route-band selection: 2,486 roads / 7,420 buildings / 332 landuse / 2 water lines.

### RECEIVER HANDOFF
- Race branch `wsa/osm-city-drive-corridor-2026-09-19` consumes the exact pinned City consumer while preserving Free Roam C0 as sole movement/contact owner.
- Observed Race branch head during recovery: `d2529e634952f25d691d68873801b2651125ac0c`.
- Workflow `35414946641`, job `105821630552`: **PASS**. Module/owner regression 10/10; existing Hürth C1 browser 26/26; continuous corridor browser 17/17. Boot 2237 ms; short drive 6.807 m; four C0 contacts; no new recovery/run; evidence commit `7208b4167df6fbea62703177301473eb841522d7`, artifact `10574843986`.

### PROMOTION BOUNDARY
- PRs #80/#81/#82 remain stacked drafts and diverged from newer Kayfabizarro main.
- Race corridor branch also diverges from newer Race main.
- Reconcile/rebase before promotion; no force-merge / owner replacement.
- Travel Walk↔Drive remains OPEN.

---

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
