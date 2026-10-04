# Landmark Override Contract

**Status:** CONTRACT READY · no accepted landmark mounted yet.

OSM City must remain complete without any landmark model.

A landmark override is a presentation/consumer substitution keyed to the source OSM identity, not a new geography owner.

## Entry shape

```json
{
  "id": "cologne-cathedral-v0",
  "cityOrCorridorId": "future-cologne-corridor",
  "osm": {
    "type": "way|relation",
    "id": 123456
  },
  "asset": {
    "repo": "georg-doc/kayfabizarro",
    "path": "media/.../accepted-landmark.glb",
    "sourceCommit": "<pin>"
  },
  "placement": {
    "originPolicy": "osm-footprint-centroid",
    "yawDeg": 0,
    "scale": 1,
    "yOffsetM": 0
  },
  "baseBuilding": {
    "policy": "hide-only-after-asset-loaded-and-validated"
  }
}
```

## Rules

- OSM identity and footprint remain the placement/provenance anchor.
- The base procedural building renders when the override is absent, fails to load, or is rejected.
- Accepted landmark assets come from GitHub when available.
- No landmark silently changes road/contact/Travel ownership.
- Visual scale, yaw and footprint fit are consumer acceptance, not Registry facts.
- img2threejs remains one optional landmark-production donor; it is not required for City Lab.

## Cologne Cathedral direction

The current hand-built Dom prototype is still experimental. When Georg's newer low-poly Cathedral model is ready, first identify the exact OSM building/relation and validate:

1. footprint/centroid alignment;
2. model scale against local metres;
3. orientation;
4. silhouette from OSM City camera heights;
5. fallback to the procedural footprint extrusion;
6. no new collision claim until the receiving consumer validates it.

The same contract applies to towers, monuments, castles and other signature buildings.
