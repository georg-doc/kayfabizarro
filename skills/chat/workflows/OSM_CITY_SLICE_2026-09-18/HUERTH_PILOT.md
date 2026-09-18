# KFB OSM City Slice · Hürth / Stotzheimer Straße Pilot

**Date:** 2026-09-18  
**Status:** PROPOSAL / SOURCE-QUERY CANDIDATE · LIVE OSM DATA NOT YET VERIFIED  
**Parent brief:** `START_HERE.md`

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

### Hürth v0 recommendation

Start with a clipped deterministic bbox or equivalent ~500–800 m local window containing:

- one residential/suburban cluster;
- one useful intersection;
- one longer road segment;
- one road↔field/green transition;
- enough building footprints for parking / turning context.

Record the exact bbox after selection.

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

This remains a discovery query. After the v0 area is selected, prefer a fixed bbox query for deterministic source capture.

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

Actual selected road and legal/source geometry must come from the captured OSM data. Do not claim a specific road is inside the first v0 bbox until the source is checked.

### Green / Off-road Edge

Use open land/green edges for:

- asphalt→terrain seam;
- low-speed terrain handling first;
- later off-road jumps / destructible fences / water-edge tests.

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

Hürth v0 is useful when:

- exact source bbox/query is pinned;
- geometry regenerates deterministically;
- one suburban block is visually readable;
- reverse/turn/parking can be exercised in the receiving Free Roam slice;
- road↔terrain seam is explicit;
- no second movement/collision owner appears;
- the scene still works without landmark/2.5D extras.

No human acceptance or live OSM result is claimed by this document.
