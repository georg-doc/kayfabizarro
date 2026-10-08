# RKIT R3 · Road Constructor purchase and editor-architecture decision

**Date:** 2026-10-08  
**Classification:** `PUBLIC-DOCUMENTATION_CONCEPTUAL_EDITOR_BENCHMARK · OPTIONAL_LICENSED_UNITY_REFERENCE_LAB`  
**Status:** EVALUATED FROM PUBLIC PRODUCT DOCUMENTATION AND UNITY TERMS; NOT PURCHASED, NOT INSTALLED/EXECUTED HERE, NOT APPROVED FOR CODE PORT OR ASSET EXTRACTION.

## Sources checked
- Pampel Games, Road Constructor, Unity Asset Store package #287445: https://assetstore.unity.com/packages/tools/level-design/road-constructor-287445
- Public vendor description: https://marketplace.unity.com/packages/tools/level-design/road-constructor-287445
- Unity EULA FAQ: https://assetstore.unity.com/browse/eula-faq
- Unity Asset Store terms: https://unity.com/legal/as-terms
- Publisher support from Asset Store: https://www.pampelgames.com/ (verify exact contact via store at purchase time)

Price seen on store *during 2026-10-08 inspection*: **USD 25.18 promoted vs USD 69.95 normal**, regional checkout price/taxes/time-limited sale may change; **do not claim bought or base the integration plan on continuing discount**. Public listing identifies `Extension Asset`, package version 1.9.5, Unity 2022 LTS+; verify exact project/editor version before purchasing.

## Why it is attractive for KFB
User goal: hand-drawn-looking road sketch in editor, live shape/snapping, intersections/roundabouts, adjustable profiles, ramps/bridges, terrain raise/lower/blending and automatic structural elements. The publicly advertised behaviors are close to the eventual KFB user workflow.

| Publicly advertised function / design pattern | KFB independent analogue | Current responsibility |
|---|---|---|
| Draw/edit roads like a city builder | Control-point stroke → RouteRecipe diff, edit handles | FUTURE KFB editor |
| Junctions, roundabouts, cul-de-sacs, ramp connections | Topology nodes + typed ports/lane map + actual junction compile | Existing Track Core |
| Curvature/tangent, slope/elevation, overlap validation | Continuous frames/width/grade/bank & rejection diagnostics | Existing Track Core |
| Adjustable road styles and UV options | Profile/material roles and surface/marking adapters | KFB Joyride/Clay and Blender kit |
| Terrain leveling, detail/tree removal, texture blending | Change request (cut/fill support/biome masks) to authoritative terrain | Existing Surface Truth |
| Editable construction, automatic update, Undo | Local graph invalidation, transactional editor edits, save/undo/redo | FUTURE existing WB2 authoring |
| Collider/pivot/LOD options | Physical proof in target contact owner + 3D output metadata | Track Core/Race + Blender |

Do **not** confuse these advertised capabilities with an observed working KFB integration. No private code, SDK class, export or mesh output is audited or licensed for non-Unity reuse.

## Recommended path and decision gates

**A. Immediately, without purchase — PRIMARY.** Use the public description and generic road-authoring principles to define our independent socket, graph and 3D module requirements. Ship a compatible Blender asset kit today without waiting for the Unity editor.

**B. Optional purchase (Georg's choice) — an isolated Unity product/UX lab.** Because Unity is installed, evaluate public demo/manual first. Purchase at the actual checkout cost only if expected usability or editor logic can be observed meaningfully within the allowed license. Create a SEPARATE private licensed Unity scratch project, not an Island/World runtime. Verify installation and minimum Unity version; draw these reference cases **inside Unity**: (1) move an existing T-junction and observe attached roads, (2) attach a curve/bridge/ramp with variant widths and height constraints, (3) grade-level change/terrain smoothing near a crossing. Record neutral behavior requirements, input steps and human-authored notes. Do not move vendor package files into a public repo or an AI context.

**C. Genuine product reuse/port — requires publisher's separate permission.** Before moving source or using Road Constructor directly outside Unity, get written clarification for: (i) extracting/reusing generated road meshes in a non-Unity KFB game, (ii) modifying/porting SDK/editor source, (iii) packaging/distributing reusable road modules as a user-editable tool or exportable creator kit, (iv) sharing source with external agents/contractors, (v) specific allowed development/seat conditions. `Extension Asset` licensing and SDK restrictions do **not** imply those rights. If denied/unclear, stay with route A/B and independent implementation from public functional ideas.

**No auto-purchase. No copying/decompiling/porting proprietary code. Do not input purchased Asset Store asset files/source as AI model material unless authorized.**

## Future KFB Editor design target (NOT Blender R3 execution scope)

Minimum user interaction:
1. Choose ROAD / RACE / OFFROAD / COSMIC and profile/lanes/width/material family.
2. Sketch/drag centerline or add control nodes. Show constrained radius and grade while drawing.
3. Auto-snap to compatible open socket or graph node. Distinguish missing junction capability from missing cosmetic mesh.
4. On crossing: propose junction/overpass/underpass only when geometric, layer and clearance checks pass.
5. Automatically attach compatible deck, side profiles, barriers, supports, bridges and tunnel portals using Blender-authored source IDs.
6. Terrain preview: overlay cut/fill regions from graph/road envelope, but edit/commit terrain only via Surface Truth; allow human preview/accept/revert.
7. Change an old node and update only graph-neighborhood dependencies (incremental compile), showing warnings. Save an operation-history/RouteRecipe with deterministic reload and Undo/Redo.
8. Switching from CITY to RACE/COSMIC updates style profiles and material roles, not graph semantics unless explicitly requested.

Design data should support at least:
- graph nodes/edges and stable semantic IDs;
- dimensions/width/lane count and directional lane continuity;
- parametric curvature/grade/bank and transport frame;
- explicit sockets/profile adapters with attach compatibility/error;
- named visual structural source modules/variants;
- terrain cut/fill **request** not terrain truth;
- dependency graph invalidation;
- versioned serialized document and reversible history;
- collision/vehicle envelope and consumer tests.

## Buy / No-buy checklist to return to Georg
- [ ] Have we already solved the same editing task adequately through the current Track Core and Blender stream?
- [ ] Is there a **specific** editor behavior Road Constructor demonstrates and KFB lacks?
- [ ] Is the current price/seat/license acceptable at checkout?
- [ ] Does the publisher clarify non-Unity export/UGC/source-use rights, if those rights matter?
- [ ] Is the isolated Unity exploration actually faster/better than the independent KFB proof at the same function?
- [ ] Are our lessons written as independent functional requirements rather than vendor code?

Default decision: **buy for UX/reference comparison if Georg wants, especially at discounted price; do not make purchase necessary for RKIT R3; do not promise a legal/technical port without proof.**

## Next gate
`HUMAN_OPTIONAL_ROAD_CONSTRUCTOR_PURCHASE_DECISION_AFTER_RKIT_P1_CENSUS`

This is NOT a new gate for the Blender production sequence; primary RKIT next gate remains `RKIT_R3_VERIFIED_REUSE_CENSUS_AND_FIRST_COMPATIBLE_P1_TRANSITION_ASSEMBLY`.
