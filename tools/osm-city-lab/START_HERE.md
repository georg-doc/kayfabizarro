# KFB OSM City Lab · START HERE

**Current pilots:** `ehrenfeld-v0` · `huerth-v0` · `dom-zentrum-v0`  
**Scope owner:** OSM normalization → local-metre city geometry/style → consumer export.  
**Not owned here:** Travel world/modes/persistence, Ground/Drive physics, Registry, Resident animation, Combat.

## Read order

1. `README.md`
2. Pick the named dataset under `data/`.
3. For Cologne Race / Claude Design, start with `data/dom-zentrum-v0/CLAUDE_CONTEXT.json`, then `SOURCE_SPEC.json` / `PROVENANCE.json` / `normalized.json` as needed.
4. `docs/OSM_DATA_PIPELINE.md`
5. `docs/CONSUMER_CONTRACT.md`
6. `docs/TEST_PLAN.md`
7. `CHANGELOG.md`

## Current status vocabulary

- **DECISION:** pilot bbox + local ENU/metre frame fixed.
- **IMPLEMENTATION:** normalization, deterministic fallbacks, S1 viewer, S2 export generator and source-cache workflow exist.
- **TESTED RESULT:** real S0 means committed source cache + provenance + normalized geometry + dataset evidence. `dom-zentrum-v0` is cached and S0-green.
- **PUBLIC DEPLOYMENT:** never infer from a GitHub file existing.
- **GEORG ACCEPTANCE:** separate human gate.
- **OPEN:** Travel/Free-Roam receiver integration and browser visual acceptance.

## 2026-09-24 · First reusable baked World Zone · Cologne

Status: **WORLD-ZONE-BAKE-01 PACKAGE + BROWSER PASS · HUMAN ACCEPTANCE OPEN**

Current package:
`world-zones/cologne-dom-zentrum-v0/2026-09-24.1/`

- cached OSM source only; no runtime/editor Overpass;
- 5,236 roads / 2,523 driveable roads / 6,351 buildings / 456 landuse / 6 water lines;
- deterministic compiler + byte-identical rebuild: **51/51 PASS**;
- source/cache verifier: **14/14 PASS**;
- local Chromium Source → Baked GLB → WorldBuilder ref+transform → Save/Reload: **22/22 PASS**;
- reload network: `MANIFEST.json` + `visual.glb` only; normalized/raw/Overpass = 0;
- WorldBuilder stores the Zone manifest reference + transform, never copied city geometry;
- support/collision uses undeformed semantic truth;
- landmarks remain separate searchable/authored modules.

Current Return:
`docs/WORLD_ZONE_REVIEW_G3_RETURN_2026-09-24.md`

Failure recovery from the interrupted first CI attempt:
`docs/WORLD_ZONE_BAKE_01_FAILURE_RECOVERY_2026-09-24.md`

Barcelona remains the second-city portability proof after the Cologne human gate.

