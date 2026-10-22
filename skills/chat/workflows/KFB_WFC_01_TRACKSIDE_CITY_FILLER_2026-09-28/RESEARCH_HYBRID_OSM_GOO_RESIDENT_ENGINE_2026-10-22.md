# KFB WFC-01 · Hybrid OSM / Goo / Resident composition & engine choice · research R1
Date: 2026-10-22
Status: **PROPOSAL / SOURCE RESEARCH ONLY · NO RUNTIME, NO ARCHITECTURE PROMOTION**
Owning lane: WorldBuilder / WFC-01 trackside-city filler, branch `work/wfc-01-trackside-city-filler-2026-09-28`, PR #271
Product: one authored, traversable KFB world consuming existing City Lab, Surface Truth, Track Core, Resident Atlas/Life, KFB Clay and Story sources.
Scope of this additive research: identify an engine-neutral composition strategy and judge whether Godot/other engines justify a later benchmark. It **does not** authorize WB2 R4 repair, R5, new geometry, Godot adoption, publishing or Live.

## Current authority / precedence
- Canonical router: `skills/chat/START_HERE.md` on main (read 2026-10-22). Island R4 remains **STOPPED / NO MVP / F-R39 FAIL**. Current approved Four-Island work is **story visual A/B only**, with Georg A/B/FAIL human gate; no post-R4 runtime build is authorized.
- Existing WFC-01 branch: `START_HERE.md`, `CLAUDE_DESIGN_BRIEF_WFC_01.md`, and `RETURN.md`: WFC-01 is **READY BRIEF, NOT IMPLEMENTED**; bounded seeded 2D/2.5D **editor-time filler** outside protected track/road, never a second road/ground/OSM/render/runtime owner. It has a prior independent **RENDER-R0** shared shadow/presentation gate.
- WFC-01 retained K2 clay + T3-v2 donors and rejects S1 road v1-v3. Track Core's existing `seeds.wfc` and socket/transition role must be consumed after auditing the exact current core; 2026-09 v0.11 pins are historic facts, not proof of latest API equivalence.
- City Lab: `tools/osm-city-lab/README.md`, `data/dom-zentrum-v0/CLAUDE_CONTEXT.json`, `docs/LANDMARK_OVERRIDES.md`: real OSM data is normalized/georeferenced. Landmark override remains a model substitution by OSM identity with procedural fallback, not a second geodata owner.
- Resident planning: `skills/chat/RESIDENT_LIFE_SEMANTIC_MODEL_PREP_2026-10-06.md` and `RESIDENT_LIFE_VERTICAL_SLICE_FIXTURE_01_2026-10-06.json`: `ResidentProfile`, `ActivityDefinition`, `ResidentPOI`, `RouteFamily`, `PerformanceCue` are **proposal contracts**, not proven gameplay integration. Source-proven actor/rig/prop/scenelets come from Resident Atlas; atlas is authoring/donor, not second world.
- Black Goo infection/cleansing as a spatial world-mechanic is a **user-proposed direction** in this 2026-10-22 discussion; no existing production infection owner/state schema/implemented behavior was verified in main. Do not claim this loop works.

## Hybrid composition idea / keep authoritative systems
1. **Story/causal spatial graph first.** Explicit authored requirements like market ↔ residences ↔ work ↔ routes ↔ resident daily activity. A plausible scene requires viable economic/social relations; local WFC adjacency alone never proves this. No replacement story/lore.
2. **Fixed source geography.** OSM anchors/roads/river/landmarks and verified scene assets are **fixed constraints** in a real-city patch. Preserve local ENU metre positions and OSM IDs, license/provenance and editable placement. Never claim procedural fantasy additions are real OSM. Other fictional worlds may permit more variation.
3. **Surface & road restrictions.** Continuous Surface Truth owns height/mesh/support/terrain collider; Track Core owns road construction/contact and consumes route-intent/OSM graph. WFC receives no-build masks, legal slope, protected route/sidewalk/portal/spawn/sight cones; does not create a new physics/height system.
4. **Editor-time constrained filler, not global runtime solver.** Adapt existing WFC-01 12–20 verified module catalog and bounded retry/fallback for city/nature/race edges to authored POI neighborhoods, façade/prop clusters and per-zone safe cells. Emit deterministic, pinned, compact `kfb.world-filler/1` recipes; consumers do not solve whole cities on load. Retain stable per-module source IDs.
5. **Pre-bake the static; keep interactions dynamic.** Batch/instance static buildings, use LoD, baked lighting/occlusion/low-poly skyline or impostors at far range where appropriate; near physical contact/navigation/interactive props need actual meshes or validated proxy surfaces. Reversibly stage near/mid/far presentation. Photoreal/licensed 3D imports must pass source/provenance check; OSM ODbL attribution follows existing City Lab.
6. **Goo proposal = later runtime state, not WFC re-collapse.** A possible infection mask/region graph changes presentation, hazards, access, prop affordances and Resident intent at runtime. Avoid re-solving the full WFC layout per Goo tick. Keep identity, playability, prior edits and restore path consistent across transitions. No assumption of canonical infection gameplay until a named owner and acceptance exist.
7. **Resident placement via POI affordances.** Scene recipes may reference Atlas `resident-set` + actor/prop/animation source ID, POI, capacity, work/social/route affordances, but Resident Life owns Activity/Affect/Encounter selection and ChatterBox/Audio stay on existing owners. Do not have WFC select runtime motions, author clips or create a second NPC scheduler.
8. **No generic replacement content.** A module is usable only after exact donor objects are source-isolated and measured: footprint, clearance, geometry/sockets, support, animation/prop fit, license. Avoid placeholder buildings/figures or generic UI.

## Candidate bake packet, **NOT adopted schema**
A source-agnostic package would reference: `sourcePins`, `zoneId`, `osmOrigin/localMetreFrame`, `fixedOSMAnchorIds`, `worldRecipe`, `wfcPlacements`, `surfaceContributions`, `trackRecipeRefs`, `residentSetRefs`, `poiRefs`, `interactionAnchors`, `materialTier`, `collisionProxyRefs`, `staticBatchRefs`, `licenseProvenance`, `seed`, `generatorRevision`. Any adopted schema must be decided within existing WB2 document/consumer owners; **this list is research vocabulary only**. Persist edits/world effects through the authoritative consumer scene state.

## Godot vs existing web engines
**Recommendation: DO NOT MIGRATE KFB RUNTIME NOW.** Existing Three.js/browser stack already contains Geo/OSM, Race/Rapier, Travel/World, Clay shaders, Resident Atlas, web distribution/Sites/Cloudflare, and producer tooling. Moving it to Godot now would create a second movement/physics/audio/world implementation plus shader and web export parity work and jeopardize accepted donor paths.
- Godot 4 advantages: open-source MIT, 3D editor, imported glTF/GLB scenes, AnimationTree, navigation meshes/agents, desktop/native targets, more traditional integrated game authoring.
- Godot 4 browser limits: WebAssembly + WebGL2 Compatibility renderer only; no Forward+/Mobile web renderer or compute shading in the web target; 3D decals and some advanced graphics not available in Compatibility. Web single-thread export is default/preferred and better compatible; multithread exports require COOP/COEP / cross-origin isolation, impacting third-party embeds. Web export C# unsupported in Godot 4 official docs. Native benchmark cannot be treated as proof for Web performance.
- PlayCanvas and Babylon.js are closer to KFB browser-first JavaScript and WebGL2/WebGPU than Godot, but switching entire renderer/physics owners is likewise unjustified; PlayCanvas driving donor already exists in KFB Joyride history. Compare by incremental donor need, not engine popularity.
- Better optional later evaluation: **engine-neutral data and GLB export** after an authorized playable Web Golden. Export the *same fixed* bounded KFB scene packet to Godot as a separate research-only test, then compare visual parity, asset/animation import, navigation, collision, memory/boot, iOS Safari/web viability, and maintenance cost. Godot's native strengths must be measured; no desktop-speed extrapolation to Web.

## Narrowest future proof / explicit gates
Use **existing WFC-01A** after its current owner gates, not a new tool/PR/runtime. Fixed road + source-isolated landmark + three city/transition/nature cells; same-seed reproducibility; zero protected overlaps; one verified Resident Atlas scenelet attached to meaningful POI (e.g., Farmer field → market), real route to destination, one static baked background band and reversible proposed visual Goo overlay only if its owner/state is separately authorized. Two seeds + same-seed repeat, bounded contradictions/fallback, actual contacts, no floating/duplicate geometry, save/fresh reload. Test target-focused GPU and near/mid/far separately. This is a suggested scenario, **not authorized implementation**.

## Single next gate
Preserve **existing** `RENDER-R0 · shared diagnostic + preset adapter` as the WFC-01 technical dependency and **Four-Island Story Vision A/B → Georg A/B/FAIL** as the active higher world product gate. After explicit human authorization to resume a receiving world slice, run a cheap graph/POI/route composition test before geometry (prevents R4 F-R39 regression). Do not merge/promote or publish a novel Stage on this research result.

## Reviewed public sources (2026-10-22)
- Godot official renderer comparison: https://docs.godotengine.org/en/stable/tutorials/rendering/renderers.html
- Godot web export: https://docs.godotengine.org/en/stable/tutorials/export/exporting_for_web.html
- Godot glTF import: https://docs.godotengine.org/en/stable/tutorials/assets_pipeline/importing_3d_scenes/available_formats.html
- Godot MIT: https://godotengine.org/license/
- PlayCanvas Web-first engine: https://dev.playcanvas.com/products/engine
- Babylon.js capabilities: https://www.babylonjs.com/specifications/
- procedural-almanac (MIT, optional algorithm donor): https://github.com/BlaiseLabs/procedural-almanac

## Evidence / limitations
GitHub source/owner read and official documentation read; no code, browser, rendering, performance, test-suite, source-object visual-isolation, Site or Cloudflare tests performed by this research pass. No verified Goo gameplay owner/runtime and no Godot migration test. No merge/Live authorization.
