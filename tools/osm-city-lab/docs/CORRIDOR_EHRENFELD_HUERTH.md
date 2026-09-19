# Ehrenfeld ↔ Hürth OSM Corridor

**Date:** 2026-09-19  
**Status:** SOURCE-DERIVED ROUTE CANDIDATE · WORKFLOW PASS · MAP / TEMPORAL-COHERENCE REVIEW OPEN

## CURRENT DETAIL OVERRIDE · 2026-09-19 · fresh narrow source succeeded

The mixed-time discovery graph remains useful as the route spine, but it is no longer the intended geography source for the final corridor.

A dedicated current narrow-source slice now exists:

- branch: `osm-city/corridor-detail-current-2026-09-19`;
- PR: `georg-doc/kayfabizarro#81`;
- workflow run: `35411563105`;
- workflow job: `105812057380`;
- source bot commit: `69645c04f8ca2b1ec979c6b046a4a7d551cd88df`.

It builds 15 deterministic route-length query windows around the source-derived route and expands each about 220 m around the route segment.

Only the canonical `overpass-api.de` endpoint is used for this current-detail source.

Freshness policy is explicit:

- oldest OSM base <= 48 h;
- inter-chunk base skew <= 6 h.

### TESTED RESULT

The workflow needed all three bounded passes because the endpoint intermittently returned HTTP 429:

- pass 1: 10/15 fetched;
- pass 2: 10 cache hits + 3 fetched;
- pass 3: 13 cache hits + final 2 fetched;
- 15/15 complete.

Final source candidate:

- elements: **117,750**;
- source SHA-256: `a6a6479e540a9c89d73da86a34313708920e5b0e1f551c9ca4c61c59d06928f6`;
- OSM base oldest: `2026-09-19T01:04:32Z`;
- OSM base newest: `2026-09-19T01:08:37Z`;
- base skew: **0.068 h**;
- oldest source age at gate: **0.085 h**.

Freshness gates PASS.

### Boundary

The 15 acquisition bboxes are intentionally overlapping source windows, **not** the final corridor mask.

Next:
- normalize the merged current source into one metre frame;
- select/clip features against the route-band corridor;
- export the existing City consumer contract;
- still no movement/controller work in City Lab.

Full return:
`docs/CORRIDOR_DETAIL_RETURN_2026-09-19.md`.

## CURRENT OVERRIDE · 2026-09-19 · source discovery succeeded

The previous public-Overpass blocker is now historical. A bounded checkpoint/retry repair was implemented on:

- branch: `osm-city/corridor-checkpoint-retry-2026-09-19`;
- PR: `georg-doc/kayfabizarro#80`;
- workflow run: `35410991615`;
- workflow job: `105810446135`;
- source/evidence commit: `12bc1b03bf179e3d2b45b3a1cf4e56914690f506`.

### What changed

Successful Overpass chunks are written immediately to the GitHub Actions job temp directory and validated by:

- chunk id;
- exact bbox;
- query SHA-256;
- minimum element payload.

The job makes at most three bounded passes. Later passes read already-successful chunks from the job-local checkpoint and request only missing chunks. Partial checkpoints are **not** committed as canonical OSM source.

### TESTED RESULT

Run `35410991615` passed:

- syntax: PASS;
- source fetch: PASS;
- route source graph: PASS;
- source/provenance/route-evidence commit: PASS.

Pass 1 fetched 15 / 16 chunks. Only `R5E` timed out.

Pass 2:

- reused the 15 successful chunks from checkpoint;
- fetched only `R5E`;
- completed the 16 / 16 source set.

Generated source:

- merged elements: **12,417**;
- source SHA-256: `b1ad3dd65574bef8ca6ea806e14f317d8f78ae08ed8147393b1f8ff3d8b7612f`;
- evidence: `evidence/ehrenfeld-huerth-route.json`.

Generated route candidate:

- physical length: **11,384.3 m**;
- nodes: **510**;
- segments: **509**;
- start snap: **12.3 m**;
- end snap: **40.4 m**;
- preferred road requested: `Militärringstraße`;
- preferred road actually used: **yes**, **344.9 m / 14 segments**.

Largest named-route contributions currently include:

- Luxemburger Straße: 3,857.7 m;
- Melatengürtel: 1,381.9 m;
- Stadtwaldgürtel: 1,052.5 m;
- Berrenrather Straße: 1,037.3 m;
- Lindenthalgürtel: 962.6 m;
- Sülzgürtel: 822.1 m.

### Temporal-coherence boundary

This is a **source-derived discovery route candidate**, not yet the final current-OSM corridor asset.

Most chunks came from OSM base timestamps on 2026-09-19, but three fallback-mirror chunks report older bases:

- `R3W`: 2026-07-28;
- `R6W`: 2026-05-06;
- `R8E`: 2026-06-01.

The provenance records those timestamps explicitly. No freshness threshold existed in the original `SOURCE_SPEC.json`, so this slice does **not** invent one after the fact or silently call the mixed-time source “current”.

Use this route as the reproducible discovery candidate. Before the narrow visual corridor becomes geographic truth, review the route and refetch/verify the accepted narrow corridor against a current source snapshot.

### Current next gate

Review the actual named-road path and temporal-source mix. Only then extract the proposed ~220 m half-width corridor and fetch its buildings / green / water source.

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
