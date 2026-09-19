# Ehrenfeld ↔ Hürth OSM Corridor

**Date:** 2026-09-19  
**Status:** MAIN PROMOTED · POST-MERGE DETERMINISTIC CI PASS · RACE RECEIVER BROWSER PASS · HUMAN FULL-ROUTE DRIVE OPEN

## CURRENT MAIN STATE · promoted 2026-09-19

The tested stack was reconciled onto current main and promoted through PR #86:

- reconciled branch: `osm-city/corridor-promote-tested-stack-r2-2026-09-19`;
- promotion PR: **#86**;
- merge: `3813d24e3db04a43117676890e48f7b6baaf6cd9`;
- pre-merge promotion workflow: `35415509853` / job `105823274200` → **PASS**;
- post-merge consumer workflow: `35415680112` / job `105823765381` → **PASS**;
- S2 export contract on merge: `35415680163` → **PASS**;
- main evidence refresh: `25c2c616720e18d97028bf06fdd03d10c16b3504`;
- normalized and scene SHA-256 values remain byte-identical to PR #82;
- networked Overpass refresh workflows are explicit/manual;
- deterministic consumer regression remains automatic.

See `CORRIDOR_PROMOTION_RETURN_2026-09-19.md`.

The earlier stacked PRs remain provenance/history and must not be force-merged over current main.

## CURRENT RECOVERY OVERRIDE · 2026-09-19

The old `SOURCE BLOCKED` state below is historical, not current execution state.

Three stacked draft PRs now contain tested corridor work:

- PR #80 · `osm-city/corridor-checkpoint-retry-2026-09-19`
  - route discovery workflow PASS: run `35410991615`, job `105810446135`;
  - route candidate: **11,384.3 m / 510 nodes / 509 segments**;
  - real `Militärringstraße` contribution: **344.9 m / 14 segments**;
  - source/evidence commit: `12bc1b03bf179e3d2b45b3a1cf4e56914690f506`.

- PR #81 · `osm-city/corridor-detail-current-2026-09-19`
  - current narrow source workflow PASS: run `35411563105`, job `105812057380`;
  - 15/15 detail chunks complete after bounded checkpoint/retry;
  - current-source SHA-256: `a6a6479e540a9c89d73da86a34313708920e5b0e1f551c9ca4c61c59d06928f6`;
  - freshness / inter-chunk skew gates PASS.

- PR #82 · `osm-city/corridor-consumer-export-2026-09-19`
  - consumer workflow PASS: run `35412177342`, job `105813800461`;
  - generated consumer commit: `3db2c786152fd4d77ca33a63effd2a9db9c1d4c1`;
  - scene SHA-256: `258c4d5a3872750bc9045d771646e85dbf36aab8a14243db98adc0d288edf07d`;
  - selected corridor content: **2,486 roads / 7,420 buildings / 332 landuse / 2 water lines**;
  - consumer bounds: **3,560.216 × 9,735.554 m**;
  - all source / metre-frame / route-band / OSM-id / endpoint-join / movement-owner / determinism gates PASS.

These stacked draft PRs are historical provenance. Their tested artifacts were selectively reconciled and promoted through PR #86; do not merge the old stack over current main.

The existing Race / Free-Roam receiver is already consuming the exact pinned consumer scene on branch:

`georg-doc/KFB-Stunt-Car-Race@wsa/osm-city-drive-corridor-2026-09-19`

Receiver evidence commit for the green continuous-corridor browser run:

`7208b4167df6fbea62703177301473eb841522d7`

The Race lane remains the movement/contact owner; City Lab still owns no driving engine.

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

Historical status at that checkpoint:

`SOURCE BLOCKED · RETRYABLE`

This blocker was later closed by checkpoint/retry PR #80, current-detail PR #81 and consumer export PR #82. The generated route/source/consumer artifacts are now on current main via PR #86.

## Next after source succeeds

1. Review actual named-road sequence and whether Militärringstraße is genuinely used.
2. Approve or adjust graph weighting if the route is technically valid but visually uninteresting.
3. Extract a narrow ~220 m half-width corridor around the accepted route.
4. Fetch buildings, landuse/forest and water only for that corridor.
5. Reuse the same Clean/Cartoon/Grotesque presentation and KayKit Forest POC.
6. Keep full Walk/Drive integration with the existing Free-Roam/Travel receiver.
