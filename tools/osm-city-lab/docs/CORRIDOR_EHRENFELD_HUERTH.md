# Ehrenfeld ↔ Hürth OSM Corridor

**Date:** 2026-09-18  
**Status:** IMPLEMENTATION READY · SOURCE BLOCKED (public Overpass availability) · RETRYABLE

## Goal

Build a narrow real-OSM connection between the accepted Ehrenfeld and Hürth slices rather than rendering all of Cologne.

Anchors:

- Ehrenfeld origin: `50.949425, 6.917500`
- Hürth origin: `50.865900, 6.877000`

Militärringstraße is a preferred real OSM axis when graph connectivity supports it. It is not hardcoded as fictional geometry.

## Implemented discovery pipeline

1. Reuse committed Ehrenfeld/Hürth S0 source caches for local residential connector streets.
2. Fetch only major road classes for the between-city envelope.
3. Use deterministic small Overpass chunks and merge by OSM `type/id`.
4. Build a directed road graph from real OSM way/node topology.
5. Respect basic one-way and motor-vehicle exclusions.
6. Snap both city origins to graph nodes.
7. Run Dijkstra with road-class costs.
8. Prefer actual `name=Militärringstraße` edges with a cost bias, never by inventing missing links.
9. Emit actual route nodes, way IDs, road names and physical route length.
10. Only after source/map review extract a narrow visual corridor and add buildings/green/water/forest.

Files:

- `data/corridors/ehrenfeld-huerth-v0/SOURCE_SPEC.json`
- `data/corridors/ehrenfeld-huerth-v0/query.overpassql`
- `scripts/fetch-ehrenfeld-huerth-corridor.mjs`
- `scripts/route-ehrenfeld-huerth.mjs`
- `.github/workflows/osm-city-corridor.yml`

## Source blocker evidence

Large all-road discovery request:

- run `35388277197`: public Overpass timeout.

2×2 chunking:

- run `35388465918`: NW and NE succeeded; SW timed out.

8-row / two-column small-chunk major-road strategy with three public endpoints:

- run `35389446253`, attempt 1: R1W/R1E/R2W/R2E/R3W/R3E succeeded; R4W timed out across fallbacks.
- same run, attempt 2, unchanged code: R1W/R1E/R2W succeeded; this time R2E timed out.

Because the failure moved between chunks on an unchanged source query, the evidence supports a transient public-service blocker rather than a deterministic bad geometry/query region.

## Decision

Do not fabricate a corridor from memory and do not hammer public Overpass indefinitely.

Current status:

`SOURCE BLOCKED · RETRYABLE`

The local Work Lead may rerun the exact workflow later or execute the same source scripts in an environment with a healthy Overpass endpoint. A route is not called TESTED until `evidence/ehrenfeld-huerth-route.json` is actually generated from source.

## Next after source succeeds

1. Review actual named-road sequence and whether Militärringstraße is genuinely used.
2. Approve or adjust graph weighting if the route is technically valid but visually uninteresting.
3. Extract a narrow ~220 m half-width corridor around the accepted route.
4. Fetch buildings, landuse/forest and water only for that corridor.
5. Reuse the same Clean/Cartoon/Grotesque presentation and KayKit Forest POC.
6. Keep full Walk/Drive integration with the existing Free-Roam/Travel receiver.
