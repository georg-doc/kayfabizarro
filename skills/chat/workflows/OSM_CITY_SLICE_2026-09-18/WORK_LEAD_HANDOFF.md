# KFB OSM City Lab · Work Lead Handoff

**Date:** 2026-09-18  
**Status:** ACTIVE HANDOFF · GitHub state overrides this text  
**GitHub SSOT:** `georg-doc/kayfabizarro/tools/osm-city-lab/`

## Read first

1. `tools/osm-city-lab/README.md`
2. `tools/osm-city-lab/CHANGELOG.md`
3. `tools/osm-city-lab/docs/CARTOON_MASSING.md`
4. `tools/osm-city-lab/docs/PRESENTATION_S1C.md`
5. `tools/osm-city-lab/docs/CONSUMER_CONTRACT.md`
6. `tools/osm-city-lab/docs/LANDMARK_OVERRIDES.md`
7. `skills/chat/workflows/OSM_CITY_SLICE_2026-09-18/START_HERE.md`
8. `skills/chat/workflows/OSM_CITY_SLICE_2026-09-18/HUERTH_PILOT.md`

## Product split

### City Lab

Owns OSM source/cache/normalization, local-metre city geometry, presentation and consumer export.

### Travel / Free Roam

Owns actual Walk / Drive movement, terrain contact, mode switching and persistence. Do not create a City-Lab WASD/physics owner.

### Registry / Librarian

Owns asset identity/provenance. City may consume exact GitHub assets, not duplicate them into a new asset store.

## Current city slices

### Ehrenfeld

- dense urban anatomy;
- fixed tested ~659 × 596 m slice;
- 372 normalized road parts;
- 1,808 buildings.

### Hürth

- suburban / road↔green edge anatomy;
- fixed tested ~700 × 700 m slice;
- 164 road parts / 116 driveable;
- 700 buildings.

## Presentation stack

Viewer query examples:

```text
?city=ehrenfeld-v0&look=clean
?city=ehrenfeld-v0&look=cartoon
?city=ehrenfeld-v0&look=grotesque
?city=ehrenfeld-v0&look=cartoon&labels=1
?city=huerth-v0&look=cartoon&nature=1
```

Modes:

- `clean` = source-anatomy extrusion baseline;
- `cartoon` = intended playable KFB visual baseline;
- `grotesque` = exaggerated skew/cubist/wide-angle stress-test.

Optional presentation layers:

- `labels=1` = OSM street-name poles/boards;
- `nature=1` = source-backed KayKit Forest Nature POC.

All are presentation-only; S2 collision/export geometry is not deformed.

## Known road issue / current fix

Georg observed pale flickering fragments and gaps/zags while zooming.

Current repair:

- continuous joined strips per OSM way;
- shared-node junction patches to close source-way seams;
- non-driveable pale paths render below driveable asphalt;
- explicit ground/landuse/sidewalk/path/road depth stack;
- no synthetic junction across geometry that lacks a shared OSM node.

Georg live moving/zoom review remains the important human gate.

## Asset POCs

### Forest

Exact pack:

`media/3D_Assets/KayKit_Forest_Nature_Pack_1.0_FREE/`

First used assets:

- `Tree_1_A_Color1.gltf`
- `Tree_2_A_Color1.gltf`
- `Tree_3_A_Color1.gltf`

### City furniture

Exact pack:

`media/3D_Assets/KayKit_City_Builder_Bits_1.0_FREE/`

Useful present assets include `streetlight.gltf`, `trafficlight_A/B/C.gltf` and road modules.

### Street-sign carrier

Existing exact Registry-backed candidate:

`media/3D_Assets/kenney_city-kit-roads/Models/GLB format/road-sign-street.glb`

Current City viewer still generates the board/pole directly so OSM name/provenance remains the primary truth.

## Landmark seam

`tools/osm-city-lab/landmarks/manifest.json` is intentionally empty.

Future Kölner Dom / other landmark flow:

`OSM identity + footprint → accepted GitHub low-poly model → landmarkOverride`

Base procedural building must remain as fallback.

## Ehrenfeld ↔ Hürth corridor

Active discovery source:

`tools/osm-city-lab/data/corridors/ehrenfeld-huerth-v0/`

Routing evidence target:

`tools/osm-city-lab/evidence/ehrenfeld-huerth-route.json`

Militärringstraße is preferred when the real OSM graph supports it; never hand-draw it to satisfy the name.

## Status discipline

Always separate:

`PROPOSAL | DECISION | IMPLEMENTATION | TESTED RESULT | PUBLIC DEPLOYMENT | GEORG ACCEPTANCE | OPEN`

Automated browser success is not Georg visual acceptance. GitHub file existence is not Cloudflare deployment. A source-derived route candidate is not a drivable Travel corridor.
