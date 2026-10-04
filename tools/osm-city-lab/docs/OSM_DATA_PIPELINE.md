# OSM Data Pipeline · Ehrenfeld v0

## DECISION · bbox and local frame

BBox (Overpass order south,west,north,east):

```text
50.94675,6.91280,50.95210,6.92220
```

Origin:

```text
lat 50.949425
lon 6.917500
alt 0 m
```

Frame is Three-friendly local ENU: `x=east`, `y=up`, `z=north`, metres. For the ~0.66 km pilot, an origin-centred equirectangular ENU approximation is used:

```text
x = R · Δlon(rad) · cos(lat0)
z = R · Δlat(rad)
R = 6378137 m
```

This is a local normalization contract, not a global map projection.

## Source query

`data/ehrenfeld-v0/query.overpassql` requests:

- `highway=*`;
- `building=*` ways and relations;
- `landuse=*`, `leisure=*`, `natural=*`;
- `water=*`, `waterway=*`;
- referenced ways/nodes required to reconstruct geometry.

The query is sent once by GitHub Actions and cached. The viewer/consumer reads the cache only.

## Preservation

Every normalized feature keeps `type/id/tags`. Relation-derived polygon rings keep relation identity and ring index. No Registry entry is invented for OSM features.

## Deterministic fallbacks

Road width order:

1. usable OSM `width`;
2. usable lane count × 3.1 m, bounded by class default;
3. documented highway-class default.

Building height order:

1. OSM `height`;
2. `building:levels × 3.1 m`;
3. building-class fallback, with any variation derived from stable OSM identity.

Roof order:

1. OSM `roof:shape`;
2. small stable KFB vocabulary derived from OSM identity.

There is no `Math.random()` in geometry generation.

## Relations

v0 stitches multipolygon outer member ways when their endpoints connect cleanly. Unsupported/fragmented relations remain visible in diagnostics; they are not silently fabricated.

## Source refresh policy

A source/workflow change can trigger a single cached refresh. Public Overpass endpoints are not queried by browser runtime. Fallback endpoint is used only if the primary fetch fails.
