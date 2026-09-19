# RETURN · TinySkies × OSM × Landmark Cohesion v1 · 2026-09-19

**Owner:** `tools/img2threejs/`  
**Repo:** `georg-doc/kayfabizarro`  
**Branch:** `img2threejs/tinyskies-osm-cohesion-v1-2026-09-19`  
**PR:** `#109` · DRAFT / OPEN · no auto-merge  
**Head before final metadata update:** `4af12b484ed9ee85a7e4e033d3f26f2966a948e6`  
**Outcome:** source-backed world/object cohesion contract  
**Stage:** reserved but **NOT DEPLOYED / NOT VERIFIED**

## Completed

- Reviewed the current public TinySkies implementation at commit `2659a5cc987d7e4a4c5aa7e79c86a1626ad75df6`.
- Pinned the relevant Globe / DayNight / SkyPreset / RimLight / Rain / Terrain / Game sources.
- Documented the actual object-in-world techniques used by lighthouse, villages and observatory.
- Added a machine-readable KFB cohesion contract.
- Added a pure `WorldAppearanceState` helper.
- Added 31 contract/source checks — all PASS.

## Main conclusion

The TinySkies look is coherent because the **objects do not own the atmosphere**.

Local object identity stays simple and readable, while one world state owns:

- sky;
- fog;
- multi-light rig;
- rim colour;
- atmosphere/clouds/ocean;
- weather.

KFB should use the same separation:

> **Grotesque = shape. Local palette = identity. WorldAppearanceState = atmosphere. Terrain grounding = physical belonging.**

## TinySkies donor rules worth carrying forward

1. flat-shaded, lit low-poly materials;
2. shared rim response with globally changing rim colour;
3. emissive details only where semantically justified;
4. real terrain sampling + slight sinking/deeper foundations;
5. location logic tied to terrain role;
6. day/night changes the world, not a separate per-building palette;
7. rain is currently an overlay/audio donor, not a verified wet-material donor.

## KFB-specific extension

Future KFB weather wetness may be useful, but it remains a separate experiment:

- roughness ↓;
- specular ↑;
- subtle darkening;
- puddle/road response.

Nothing in this Return calls that verified TinySkies behaviour.

## Files

- `landmarks/pilot-07/SLICE.md`
- `landmarks/pilot-07/SOURCE.json`
- `landmarks/pilot-07/TEST_REPORT.md`
- `styles/tinyskies-osm-cohesion.v1.json`
- `styles/world-appearance-state.mjs`
- `docs/TINYSKIES_OSM_LANDMARK_COHESION_2026-09-19.md`
- `tests/check_tinyskies_osm_cohesion_v1.mjs`
- `evidence/2026-09-19-tinyskies-osm-cohesion-v1/summary.json`

## Unresolved

- no visual/browser proof yet;
- no actual TinySkies terrain receiver;
- no shared KFB rim shader adapter yet;
- no weather material response;
- no semantic OSM window-emissive pass;
- no Cologne Cathedral OSM Golden Sample yet.

## Next gate

Build one small integrated Stage proof from this contract: TinySkies-like terrain + OSM cluster + modular Grotesque Cologne Cathedral + shared day/night/rim/weather state.

Do not start the long-tail landmark catalogue before that world-cohesion seam is visibly proven.
