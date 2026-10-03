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


## 2026-10-01 · optional native streaming shell

Current experimental donor: `THREE-GEO-PLAY-DONOR-P0`.

Read:
- `docs/THREE_GEO_PLAY_DONOR_P0_RETURN_2026-10-01.md`
- `evidence/three-geo-play-donor-p0/RESULT_2026-10-01.json`
- `experiments/three-geo-play-donor-p0/README.md`

P0 is **TECHNICAL DONOR PASS · local Chromium 18/18 · public Stage pending**.

Three-geo-play is an optional vector-tile streaming shell only. It does not replace cached OSM, normalized City Lab geometry, source identity/provenance, consumer recipes or movement/collision owners.

Required seam: City Lab is `x=east,z=north`; Three-geo-play is `x=east,z=south`. Use `city.x=threeGeo.x; city.z=-threeGeo.z`. Current Ehrenfeld seam proof is < 0.02 m after that mapping.

Next gate: `THREE-GEO-PLAY-P0B` — one streamed building + one City Lab building through one shared existing KFB presentation/deformation adapter. No Town/Travel-wide integration before that gate.
