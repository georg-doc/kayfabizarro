# S1c · Roads / OSM Street Signs / Grotesque Skyline / KayKit Nature

**Date:** 2026-09-18  
**Status:** IMPLEMENTATION · automated browser proof exists on branch · live Georg visual review still separate  
**Owner:** OSM City Lab presentation only

## 1 · Road visual repair

The remaining bright/shimmering fragments had two distinct causes.

### A · disconnected visual ways

OSM roads are many source ways. Even when two ways share the same real OSM node, drawing each way as its own strip can leave visible wedges or tiny gaps at the join.

S1c keeps every source way/ID but adds presentation-only junction patches at **shared OSM node IDs**.

No inferred connection is made across roads that merely cross in screen space. A bridge/overpass without a shared OSM node therefore does not receive a fake junction.

### B · pale foot/path geometry on the same depth as asphalt

In S1b, non-driveable `highway=*` geometry used the pale path material but still rendered at the same Y level as driveable asphalt.

At real crossings that can produce exactly the pale/dark depth competition visible while zooming.

S1c separates the presentation layers:

```text
ground
< landuse
< sidewalk
< non-driveable path
< driveable asphalt
```

Driveable-road junction patches sit slightly above their own road layer. Paths remain below asphalt at crossings.

This is a presentation fix only. OSM centerlines, widths and S2 export are unchanged.

## 2 · OSM street-name signs

`STREET SIGNS` reads the existing OSM `name=*` tags already preserved on normalized road features.

Rules:

- driveable named roads only;
- one deterministic representative per unique road name;
- longer roads rank first;
- maximum count is bounded;
- board is generated from the real OSM name;
- pole + board have true small 3D volume;
- both road sides are checked against building footprints and the clearer side is chosen;
- no new semantic road database.

A `SIGN VIEW` camera focuses from the road side onto a source-derived sign for inspection.

Current first implementation uses generated geometry/text because the important truth is the OSM name + source road. Later the board/pole can use an existing source-backed prop without changing the name-placement logic.

### Exact future prop candidates

**Kenney City Kit Roads**

`media/3D_Assets/kenney_city-kit-roads/Models/GLB format/road-sign-street.glb`

Registry pack:

`registry/assets/v1/packs/kenney-city-kit-roads.json`

**KayKit City Builder Bits**

Useful related props already present:

- `Assets/gltf/streetlight.gltf`
- `Assets/gltf/trafficlight_A.gltf`
- `Assets/gltf/trafficlight_B.gltf`
- `Assets/gltf/trafficlight_C.gltf`

No new asset copy is introduced.

## 3 · Grotesque skyline mode

The visual target is deliberately stronger than ordinary low-poly stylization: crooked stacked silhouettes, wide-angle perspective, mild cubist discontinuity and a near-fisheye urban illustration read.

S1c separates three modes:

### CLEAN

OSM footprint → height → flat extrusion.

### CARTOON

Playable/default stylization with moderate bend, lean, taper, twist and very small stacked-ring offsets.

### GROTESQUE

Optional presentation stress-test with stronger bend/lean/taper/twist, seven deterministic stacked vertical rings, larger ring-to-ring lateral shift, 76° camera, framing offset and restrained Dutch/up skew.

This is still not a true nonlinear fisheye lens. A post-projection lens warp remains deferred until the geometry language is visually accepted, because such a warp affects picking and screen-space UI.

The source footprint and S2 collision remain unchanged in every mode.

## 4 · KayKit Forest Nature POC

`FOREST POC` consumes exact GitHub assets from:

`media/3D_Assets/KayKit_Forest_Nature_Pack_1.0_FREE/Assets/gltf/`

First source-backed tree set:

- `Tree_1_A_Color1.gltf`
- `Tree_2_A_Color1.gltf`
- `Tree_3_A_Color1.gltf`

They share the pack's `forest_texture.png` and adjacent `.bin` files.

Placement is deterministic and OSM-driven:

- only normalized `green` landuse polygons;
- reject points near rendered roads;
- reject points inside/too close to mapped building footprints;
- bounded total tree count;
- deterministic scale/yaw variation.

This is scenery presentation only. It is not a forest collision/navmesh claim.

## 5 · Movement boundary

Do **not** add another WASD movement engine to City Lab.

City Lab may have Orbit/inspection cameras. Actual:

```text
walk → vehicle → drive → exit
```

remains the existing Travel / Free-Roam receiver job.

This preserves the hard rule: **no third movement / physics engine**.

## 6 · Landmark seam

See `docs/LANDMARK_OVERRIDES.md` and `landmarks/manifest.json`.

The base OSM city must render without a landmark override. A future Cologne Cathedral model is mounted only after its OSM identity, scale, orientation and footprint alignment are accepted.

## 7 · Ehrenfeld ↔ Hürth corridor

The requested connection is a third, different OSM product:

- not whole Cologne;
- not a giant rectangular city slice;
- not a hand-drawn fantasy road.

Discovery anchors are the already accepted city origins:

- Ehrenfeld: `50.949425, 6.917500`
- Hürth: `50.865900, 6.877000`

Desired source direction includes real **Militärringstraße**, but it is a preference, not a fabricated mandatory segment.

Current discovery approach:

1. reuse the committed Ehrenfeld/Hürth S0 caches for the local residential connector networks;
2. fetch only major OSM road classes across the bounded between-city source envelope;
3. merge by OSM `type/id`;
4. build a graph from actual OSM way/node topology;
5. snap both city origins to the graph;
6. compute a source-derived route;
7. bias real `name=Militärringstraße` edges when connected and plausible;
8. record actual road names and OSM way IDs used;
9. after human/map review, extract a narrow ~220 m half-width visual corridor around that route;
10. then fetch/build buildings, forest/green, water and landmark hooks for the corridor itself.

Large all-road Overpass requests timed out in the public service. The current source implementation intentionally reuses already-cached city connectors and limits fresh Overpass discovery to the major-road network.

## 8 · Automated evidence

Branch browser proof has already demonstrated the S1c mechanisms:

- Ehrenfeld: 183 driveable-road junction patches, 168 lower path meshes, 27 OSM street signs;
- Hürth: 104 driveable-road junction patches, 48 lower path meshes, 19 OSM street signs;
- Hürth Forest POC: 72 source-backed KayKit tree instances;
- clean/cartoon/grotesque modes booted without page/console errors;
- movement owner remains `none-viewer-only` and S2 geometry remains undeformed.

Latest-head CI must still be checked again after the final sign-placement and grotesque tuning commits before promotion to main.

## 9 · Work Lead rule

The local Work Lead should treat these as independent gates:

- road presentation;
- city massing style;
- street-name orientation;
- KayKit scenery;
- corridor source route;
- landmark override;
- Free-Roam/Travel movement.

Do not collapse them into one `city done` status.
