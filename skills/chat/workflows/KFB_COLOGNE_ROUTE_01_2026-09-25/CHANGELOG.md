# KFB Cologne Route 01 · Changelog

## 2026-09-26 · Playable Track R0 → OSM execution split

### Added

- `TRACK_TO_OSM_EXECUTION_LADDER_2026-09-26.md` — coordinated Track-first → real OSM production sequence.
- `WEBCHAT_PLAYABLE_TRACK_R0_PREP_BRIEF.md` — source/runtime/module recovery and Claude input-pack task.
- `CLAUDE_DESIGN_PLAYABLE_TRACK_R0_BRIEF.md` — player-facing Track R0 composition brief.
- evidence delta records Blender MCP as user-reported in progress but not yet GitHub-visible, and Race PR #12 as the existing continuous OSM corridor/receiver donor.

### Decision

- First integration product is a closed playable Track R0.
- OSM is not deferred architecturally: the OSM seam contract is prepared before Track R0 composition.
- Track R0 must prove a real `TRACK ↔ CITY_STREET` seam so later Köln sections use the same route grammar.
- Claude Design composes pinned sources; it does not model missing connector pieces or create a second Race runtime.

### Current order

`Blender MCP → WEB-PREP-TRACK-R0 → CLAUDE TRACK-R0 → WEB REHOME/TEST → OSM PREP → CLAUDE OSM`

### Next gate

`WEB-PREP-TRACK-R0`

---

## 2026-09-25 · Planning baseline

### Added

- `START_HERE.md` — accepted planning direction for Hürth → Dom → Rhein → Mülheimer Brücke → SAE.
- common route-first architecture for OSM, manual/editor and seeded generation;
- independent route, cross-section, edge-treatment, structure and stunt layers;
- four missing generic geometry families: M1 curve/bank ease, M2 S/chicane/hairpin, M3 street↔track adapter, M4 grade/crest/dip/bridge approach;
- future simple editor model based on semantic anchors/gestures rather than mesh editing;
- `CLAUDE_BLENDER_MCP_BRIEF.md` — bounded RKIT-10 implementation brief;
- `EVIDENCE_AND_GAP_MATRIX.md` — exact source heads/candidate refs used for planning.

### Unchanged

- Race remains route/vehicle/physics/runtime owner.
- WorldBuilder remains world/terrain/object-authoring owner.
- OSM City remains geographic/city-geometry owner.
- Existing RKIT candidates remain candidates unless separately accepted/merged.
- No runtime, vehicle, camera, physics, HUD or audio code changed.

### Next gate

`RKIT-10 · Modular Route Adapters v1`
