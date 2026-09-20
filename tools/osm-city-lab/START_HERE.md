# KFB OSM City Lab · START HERE

**Current pilot:** `ehrenfeld-v0`  
**Scope owner:** OSM normalization → local-metre city geometry/style → consumer export.  
**Not owned here:** Travel world/modes/persistence, Ground/Drive physics, Registry, Resident animation, Combat.

## Read order

1. `README.md`
2. `data/ehrenfeld-v0/SOURCE_SPEC.json`
3. `data/ehrenfeld-v0/query.overpassql`
4. `docs/OSM_DATA_PIPELINE.md`
5. `docs/CONSUMER_CONTRACT.md`
6. `docs/TEST_PLAN.md`
7. `CHANGELOG.md`

## Current status vocabulary

- **DECISION:** pilot bbox + local ENU/metre frame fixed.
- **IMPLEMENTATION:** normalization, deterministic fallbacks, S1 viewer, S2 export generator and source-cache workflow exist.
- **TESTED RESULT:** local deterministic fixture checks can pass before the real cache exists. Real S0 result is only the committed cache + `evidence/ehrenfeld-v0-s0-report.json`.
- **PUBLIC DEPLOYMENT:** never infer from a GitHub file existing.
- **GEORG ACCEPTANCE:** separate human gate.
- **OPEN:** Travel/Free-Roam receiver integration and browser visual acceptance.
