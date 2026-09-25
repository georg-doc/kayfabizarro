# KFB Cologne Route 01 · Changelog

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
