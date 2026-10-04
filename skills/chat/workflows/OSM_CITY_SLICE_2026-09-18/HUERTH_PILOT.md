# KFB OSM City Slice · Hürth / Stotzheimer Straße Pilot

**Date:** 2026-09-18  
**Current status:** S0 TESTED RESULT · S1 SHARED VIEWER IMPLEMENTED · S2 SHARED EXPORT GENERATED · HUMAN/RUNTIME ACCEPTANCE OPEN  
**Parent brief:** `START_HERE.md`

## 0 · Current verified v0 result

The first fixed **700 × 700 m** candidate around the user-provided centre already contains the requested complementary Free-Roam mix. No bbox search/shift was required after the real OSM check.

Exact v0 bbox:

```text
south 50.862756
west   6.872018
north 50.869044
east   6.881982
origin 50.865900, 6.877000
```

Committed real-source result:

- Overpass elements: **5,640**
- normalized bounds: **700.05 × 699.976 m**
- road parts: **164**
- driveable road parts: **116**
- buildings: **700**
- landuse surfaces: **22**
- green polygons: **10**
- water lines: **2**
- intersection/link nodes detected by the fixture probe: **154**
- driveable road parts touching the local edge band: **42**
- green polygons touching the local edge band: **10**
- longest contiguous driveable road part in the normalized fixture: **Am Heideberg**, OSM `way/27933239`, **478.64 m**
- missing referenced nodes: **0**
- unsupported relations in this snapshot: **0**
- deterministic reload: **PASS**
- OSM ID preservation: **PASS**
- fixed-bbox clipping: **PASS**

Fixture signals required by this brief:

```text
residentialContext   PASS
intersection         PASS
accelerationCorridor PASS
roadTerrainEdge      PASS
```

This is a **source/geometry TESTED RESULT**, not a visual or driving acceptance. The shared S1 viewer can display Hürth through `?city=huerth-v0`; the S2 scene export exists, but the receiving Travel/Free-Roam Walk→Drive loop has not yet been executed on this scene.

## 1 · Why Hürth

Hürth is deliberately complementary to the dense Ehrenfeld pilot.

- **Ehrenfeld:** dense urban fabric, parking, narrow streets, intersections, pedestrians/props later.
- **Hürth:** suburban streets, open edges, road↔terrain transitions, longer acceleration corridors, off-road and stunt branches.

The goal is not to decide which is the one true KFB city. Both test different Free Roam requirements.

## 2 · User-provided source envelope

Initial concept uses a 1.5 km radius around:

`50.8659, 6.8770`

with building, highway, landuse and water queries.

Treat the 1.5 km radius as a **source envelope / later expansion**, not the first render target. At roughly 7 km² it is too broad for a first geometry/controller proof.

### Hürth v0 decision

The first deterministic bbox is now fixed to the 700 m window recorded in §0. Real OSM evidence confirms that it contains:

- residential/suburban context;
- many usable road intersections/connections;
- a long driveable road corridor;
- road and green geometry at the local edge;
- enough building footprints for parking / turning context.

The 1.5 km discovery envelope remains only a future expansion aid.

## 3 · Corrected Overpass pilot query

The user-provided query is a useful discovery query. For the reproducible pilot, include multipolygon relations for landuse/water as well and cache the exact result.

Example discovery query:

```overpass
[out:json][timeout:60];
(
  way["building"](around:1500,50.8659,6.8770);
  relation["building"](around:1500,50.8659,6.8770);

  way["highway"](around:1500,50.8659,6.8770);

  way["landuse"](around:1500,50.8659,6.8770);
  relation["landuse"](around:1500,50.8659,6.8770);

  way["natural"="water"](around:1500,50.8659,6.8770);
  relation["natural"="water"](around:1500,50.8659,6.8770);
  way["waterway"](around:1500,50.8659,6.8770);

  way["leisure"="park"](around:1500,50.8659,6.8770);
  relation["leisure"="park"](around:1500,50.8659,6.8770);
);
out body;
>;
out skel qt;
```

That remains the discovery query only. The accepted v0 source capture uses the exact fixed bbox query committed at:

`tools/osm-city-lab/data/huerth-v0/query.overpassql`

Do not infer a complete road/carriageway model from `highway=*`; classify road, service, path, footway, cycleway etc. before generating drive surfaces.

## 4 · Corrected gameplay interpretation

The following are **design hypotheses**, not facts derived from OSM alone:

### Hürth Suburban Core

Use residential streets for:

- slow driving;
- reverse;
- parking;
- three-point turns;
- small intersection drifts;
- walk↔drive transitions.

Do not call this `BOX1 Start Area`. BOX1 is a Race/vehicle-selection/runtime surface, not the geographic owner of Hürth.

### Hürth Fast Road Spine

A longer road segment can test:

- controlled acceleration;
- boost;
- high-speed camera;
- road hierarchy;
- later timed/stunt activity.

The source probe has now established a concrete candidate: `Am Heideberg` / OSM `way/27933239` contributes a **478.64 m driveable normalized part** inside the v0 window. This is a geometry candidate, not yet a gameplay-approved boost strip.

### Green / Off-road Edge

Use open land/green edges for:

- asphalt→terrain seam;
- low-speed terrain handling first;
- later off-road jumps / destructible fences / water-edge tests.

The source probe confirms both driveable roads and green polygons reach the local edge band. It does **not** yet prove the Travel terrain seam or safe vehicle contact.

Do not infer driveable water, jump geometry or destructibility from OSM tags.

## 5 · Gate corrections

- **Ground 8** remains the Travel walking/movement human gate. It is not a ramp-placement gate.
- **BOX1** remains the Race vehicle selection / test surface. It is not the Hürth world owner.
- Stunt ramps, loops, boost pads, grindable curbs and rooftop routes are an authored **stunt layer** after the base city + Free Drive geometry works.
- OSM roof polygons do not imply driveable roofs.
- Sidewalk geometry does not automatically become a grind rail.
- Blender or Geometry Nodes may be optional production tools, but the OSM City pipeline must not depend on one proprietary/manual Blender scene for reproducibility.

## 6 · Hürth v0 test fixture

Target one compact scene that can support:

```text
walk to parked vehicle
→ reverse out
→ three-point turn
→ slow suburban road
→ intersection
→ short acceleration corridor
→ road↔terrain seam
→ stop / park / exit
```

Later on the same fixture:

```text
controlled drift
→ boost
→ authored bumper / ramp branch
→ safe bypass
→ return to ordinary street
```

The source fixture now passes the geometry/content preconditions for this route. Actual Walk/Drive execution remains a receiver test.

## 7 · KFB style

Initial city shell remains procedural and asset-light:

- low-poly extruded buildings;
- deterministic roof families;
- stylized facade colour classes;
- clear road/sidewalk/green/water materials;
- coherent relation to Travel/TinySkies terrain.

Later enrich selectively:

- GitHub KayKit/Kenney props;
- Resident Atlas ensembles;
- approved landmark overrides;
- KFB-authored 2.5D cutout actors/props.

Do not turn every OSM building into an individual art-production task.

## 8 · Acceptance

### TESTED RESULT

- exact source bbox/query is pinned;
- real OSM cache exists with source timestamp + SHA-256;
- geometry regenerates deterministically;
- OSM IDs are retained;
- geometry is clipped to the exact v0 bbox;
- the requested suburban/intersection/corridor/green-edge fixture signals are all present.

### OPEN

- S1 browser visual review: suburban block readability, road/building overlap, roofs/materials.
- S2 receiver validation: reverse, three-point turn, parking, intersection and real Travel road↔terrain seam.
- No second movement/collision owner may appear.
- Landmark/2.5D extras remain optional.

### PUBLIC DEPLOYMENT

Not claimed.

### GEORG ACCEPTANCE

Pending for visual S1 and runtime S2.
