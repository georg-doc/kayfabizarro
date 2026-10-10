# KFB Transition Research · Track ↔ Road / Dungeon Joins / Rail-Minecart
Date: 2026-10-10 · Status: RESEARCH / PROPOSAL ONLY · no runtime / no Visual PASS
Existing source/runtime owner: **Track Core** (PR #219 / branch `georg-doc-patch-2` as planning lineage, later core v0.12 and Joyride T4 source donors).
Downstream consumers: existing Joyride presentation, WB2/Surface Truth, KayKit Dungeon/World Atlas S13.2, actor vehicle/mode owner.
This is a scoped research handoff **not a new seam/road/physics owner**. Island WB2 R4 stays STOPPED (F-R39 FAIL/NO MVP). No R5, world geometry, merge or Live.

## Executive finding

The proposed unified grammar was ALREADY requested by Georg 2026-09-27 in:
`tools/KFB-ToolBox/_inbox/KFB Knet-Strecke T2 - FAIL/KFB_TRACK_LOOK_S4_T2_FAIL_2026-09-27/brief/BRIEF_CLAUDE_DESIGN_TRACK_LOOK_S4_v2.md` §4A.

Crucial source-backed donor:
`tools/KFB-ToolBox/_inbox/KFB_JOYRIDE_J14_CLAUDE_DESIGN_SESSION_CUT_2026-09-30_r1/lab-track/transition-profiles.v1.json`
`tools/KFB-ToolBox/_inbox/KFB_JOYRIDE_J14_CLAUDE_DESIGN_SESSION_CUT_2026-09-30_r1/lab-track/transition-atlas.v1.js`
`tools/KFB-ToolBox/_inbox/KFB_JOYRIDE_J14_CLAUDE_DESIGN_SESSION_CUT_2026-09-30_r1/lab-track/core/track-core.v012.mjs`

These have real source-level evidence of staggered independent layer windows, socket names, arc-length sampling, per-side lag, KFB clay patches, curb bricks, road markings, sidewalk, embankment, ditch, fence, local props. **Do not re-invent those as greenfield architecture.** Their source-loaded existence does **not** prove final author-accepted adapter geometry or runtime rail support.

## 1. Verified KFB facts

- Track Core v0.12 implements a continuous driving section profile with width, shoulderW, shoulderDrop, barrierGap, barrierT/H, left/right vis, sideL/sideR, surface and canonical ordered cross-section SLOTS. `profileSlots()` generates edge positions/heights.
- `transition-profiles.v1.json` schema `kfb.transition-profiles/1` has families A_track_city, B_track_nature, C_nature_track, C_city_track_deck, each with independent `windows` for `road`, `mark_track`, `mark_city`, `barrier`, `curb`, `sidewalk`, `embank`, `ditch`, `fence`, `props`, `light`, `vfx`. `sideLag` shifts left and right.
- Specific track_city donor windows: barrier [0,.55] fades BEFORE curb [.28,1] and sidewalk [.40,1] grow; road [.05,.72]; props only [.55,1]. That is exactly **asynchronous layer transitions**.
- Actual source zones on fixture TD03 are approximately 90–100m long for these regions. A separate 27.09 design brief mentions 32m rhythm/8m minimum as its historical reference. **Do not impose either as a universal global constant**; retain existing source zone/recipe and derive per connection from curvature, width changes, clearance and available space.
- `transition-atlas.v1.js` author intent: no simple alpha fade, use clay patches, descending segments, swelling mass, staggered layer windows. Source contains merged curb stones and placeWorld-like prop dressing. It remains **LOOK ONLY**, not Track Core collision/route truth.
- The 27.09 brief explicitly forbids use of Kenney/KayKit roads or ramps as Track Core geometry substitutes. External packs may donate buildings/trees/props outside the track clearance envelope.
- Exact original 'Kabelbett' source path remains `SOURCE_REQUIRED`; no invented donor identification.

## 2. External technical donors — verified research, not code adoption

1. Epic official City Sample PCG Shape Grammar:
   https://dev.epicgames.com/documentation/unreal-engine/city-sample-pcg-for-unreal-engine
   Uses separate repeatable grammar driven cross-section slots (lane/curb/sidewalk), and spline/footprint exclusion. Useful **architectural reference** for Track Core's existing slots + layer rules.
2. SideFX official Lines and Curves:
   https://www.sidefx.com/tutorials/lines-and-curves/
   Describes a procedural racetrack with road, markings, inside bend barriers, outside tyre piles, terrain exclusion; useful for orientation/curvature-aware dressing.
3. MIT-licensed Unreal modular road source candidate:
   https://github.com/coquigames/Modular_Road_Tool
   Documents auto attach, end connectors, road-width variants, junction/corner sidewalk modules and ground support. **Not code-read or isolated here**, optional procedural concept donor.
4. Modular architecture research (open access):
   https://www.sciencedirect.com/science/article/pii/S1875952121000732
   Standard sizes, pivots, reusable boundary adapters/plug-and-socket trims, shared structural frames and decorative breakups. Design evidence, not code.
5. CryEngine official ruined-structure transitions:
   https://www.cryengine.com/docs/static/engines/cryengine-3/categories/1114113/pages/1310733
   Shows purpose-made broken mesh edges and alpha decals over sharp material seam; additional overdraw acknowledged. For KFB, adapt the principle to clay cracks/rubble and source-grounded damage.
6. Godot official tile terrain matching:
   https://docs.godotengine.org/en/stable/tutorials/2d/using_tilesets.html
   Match corners/sides and select transition tile variants from adjacency. A **2D selection-logic donor only**, not a 3D KayKit asset.
7. SideFX procedural railroad:
   https://www.sidefx.com/tutorials/houdini-railroads/
   curve-based track generation, materials/collision, ballast instances.
8. SideFX Project Titan Rails:
   https://www.sidefx.com/tutorials/project-titan-rails-tool/
   placement of small/medium/large modules along a curve and repeat/infill rules.
9. Godot path sampler (concept only):
   https://docs.godotengine.org/en/stable/classes/class_pathfollow3d.html
   actor advances by path distance. Does not imply direct import of Godot code/rail physics.

## 3. Proposed receiving-owner pattern: one truthful seam, multiple staggered visible layers

**NOT a new central engine.** Extend only existing `CONNECT`/RouteRecipe and T4 profile adapters. The seam has one exact mathematical frame:
- position, tangent/right/up, arc length and local bank;
- track width/height/profile and allowed driving surface;
- lateral role-stack on each side (kerb/sidewalk, shoulder/runoff, barrier, fence, verge, tunnel wall);
- clearance/vehicle envelope;
- material/look profile references and active source-ID;
- root semantic states: road/race/dirt/bridge/tunnel/stunt etc.

A joint at distance `sJ` has constant physical continuity. Visual role A→B may span a window BEFORE/AFTER the joint; each layer chooses `start/end`, target profile and side, without changing the Track Core socket.

**Role-stacks should be explicit in existing adapter data, not a bag of independent props.**

Examples:
- CITY: driving surface → kerb/gutter → sidewalk → fence/world prop.
- RACE: driving surface → rumble/sausage kerb → runoff (asphalt then grass/gravel if needed) → barrier/catch fence.
- DIRT: driving surface → soft shoulder → ditch → berm/vegetation.
- TUNNEL: driving surface → slim service strip → wall/portal shell.
- RAIL: rail corridor → ballast/formation → service strip/retaining wall/world vegetation (visual-only later family).

### Small set of adapter behaviors (proposal, not runtime IDs)

- `TAPER`: transform width/height/edge profile smoothly along s; valid only if minimum curve radius/contact/clearance permit.
- `HANDOFF`: one edge role exits before another enters (race barrier→curb+sidewalk); specify asymmetric left/right windows.
- `CAP`: correctly shaped end, nose, termination or enclosure rather than clipping geometry.
- `CORNER/JUNCTION`: dedicated joining module where two or more boundaries meet; don't force separate linear sweeps through an impossible intersection.
- `BRIDGE/PORTAL`: special adapter to parapet or tunnel wall; check support and clearance.
- `BROKEN/ERODED`: structural connection is already valid, then source-driven chipped/clay/corner/rubble detail masks the *visual* repetition, without altering authoritative road/terrain collision.

Connection classification precedes dress generation. Geometric and collision seams first, then edge profile, then material seams, then props/VFX.

### Priority ordering prevents all seams happening at once

Example road→race proposal:
- upstream: city markings start withdrawing;
- nearer: sidewalk loses slabs in staggered groups; kerb depresses and bends into a race kerb;
- midpoint: road cross-section or material state shifts with Track Core surface/contact continuous;
- downstream: runoff opens, separate barrier noses/sections enter after a safe lateral clearance;
- last: race markings, gravel/props and signage establish new language.

The reverse direction is NOT necessarily time-reversal of this design: safety margins, banking, tunnel approach and driving view may require different role sequencing.

**Important security/physics guard:** a visually continuous barrier may be hidden below surface only in a real collision-safe current core state. Neither decoration nor `alpha` solves an incorrect barrier collider or head-on barrier nose. At s transitions, test clearance for widest real vehicle, against inward shoulders, loop banking and bridge parapets.

## 4. Dungeon / modular rooms: reuse the interface idea, NOT Track geometry

Current exact source:
`tools/world_atlas/source/lib/dungeon-grid.js`
`tools/world_atlas/source/KayKit_Dungeon_Model_S13.html`.

KFB S13.2 already has an **edge-owned wall** keyed by canonical `seamKey(min(cellA,cellB)|max(...))`, and four seam types including solid/door/gate/open; measured source walls and `wall_corner` are separate modules. One wall per edge is structurally enforced. This is distinct from Track Core's curvilinear cross-section along s.

KISS proposed visual rule:
1. Compute canonical grid/wall adjacency using existing S13.2 graph; never create a second wall from neighboring cell.
2. Evaluate edge/corner context: straight / inside corner / outside corner / T / open end / door / half-broken edge.
3. Select **actual** intact KayKit wall/corner/end part first and source-isolate its geometry/pivot, no invented stone prefab.
4. Add **separate** reversible, seeded and physically budgeted clay-adapter endcaps and rubble (rounded blocks, corner chips, little stone groups). Offset crack/reveal/rubble seams from the structural grout joint, with variant masks rather than one straight visible cut.
5. The only authoritative collision wall remains S13.2; rubble is decorative/no-collision except selectively explicitly approved obstacle pieces (under the same collision owner).
6. Floor material transitions use small coarse-to-fine patches / cracks / loose stones and may be height-masked, while preserving the source floor mesh/door clearance and KFB Clay material owner.
7. Demonstrate straight join, L, T, doorway, broken dead end, and two-level stair landing from real source pieces. No dungeon runtime replacement.

This is compatible with 2D autotiling corner/side logic **as a selection strategy**, not a demand to port Godot or introduce WFC/new dungeon graph.

## 5. Rail extension: same route/physics infrastructure, different vehicle mode

**Already proposed on main**:
`skills/chat/workflows/KFB_MVP_PLANNING_2026-09-26/DRAFT_RACER.md`
describes rail/minecart using same Track Core, on-rail no steering, mine gravity. It is a DRAFT, not implemented proof.

Minimum proposed **Track Core receiving-owner** rail profile, no new spline engine:
- source RouteRecipe / sampled arc length s / tangent/up/right and bank;
- stable track gauge `g` held as a configuration/value to be verified from the actual rail-cart model, not guessed from rail artwork;
- two rails centered at offset ±g/2, fitted to source track frame; ballast/roadbed and sleepers placed at fixed arc-length distances using instanced source/adapted modules;
- sleepers/rail/head and side verge transitions across mine mouth, bridge, station or open terrain use their own staggered layer windows;
- turnouts/rail crossings treated as explicit special pieces only AFTER straight/curve proof; do not approximate with two intersecting spaghetti splines;
- tight-radius/vertical curve and banking validate rolling-stock wheelbase, car clearance and minimum curve rules.

**Important physics distinction:** Reroute path, support/collision and common physical engine, but do NOT claim free-steer Joyride car physics equals a rail-guided minecart. A first **on-rail constrained body/mode** can integrate slope force `m g · tangent`, brakes/friction and cap/trigger events while following track arc length `s`; moving wagon pose follows source frame. Full flange/wheel contact/derailment/trains with articulated bogies are later (not required for the first KISS test).
- For a train, each wagon follows same route at signed arc-length offset; for a tight curve, compute wagon/bogie separation rather than rigid parent chain.
- For a minecart, gravity profile can accelerate downhill, optionally a brake, then stop at a real end buffer; no switch/traffic signals in v0.
- Stable route/segment IDs and mode arbitration stay with existing Track Core + receiving vehicle/player owners; no new locomotion kernel or extra physics writer.

**Source candidates only:** KayKit Holiday Bits (train and track pieces per official pack docs), KayKit Mystery Helpers `Toy_Train_Wood/Paint` present under `media/3D_Assets/KayKit_Mystery_Series6/6 - December 2024 - Helpers/assets/gltf/`. These are **visual/scale/prop donors**, not production canonical rail profile, physically compatible rolling stock or license/access proof for the Holiday pack. KFB Racer Track Core must own true rail curves/crossings. Existing OSM Cologne railway layer may later supply semantic alignment only, not drivable rail geometry.

## 6. Three compact source-isolated fixtures and tests (research proposal)

**Fixture A: Street→Race lateral edge adapter, straight + curve**
- Same genuine Track Core route/slot/collision, measured Joyride source geometry shown in isolation.
- Staggered kerb/sidewalk/runoff/barrier windows on left and right; no coincident visible vertical seam or shared harsh color join.
- No Z-fighting, no barrier nose in drive lane; real vehicle clearance; no attached loose slabs in collision envelope.
- Persist RouteRecipe/slot/profile adapter state and fresh reload through future current owner only.

**Fixture B: Dungeon S13.2**
- One real KayKit intact wall/90° corner/door shown first.
- Straight, inner/outer corner, L/T, door, broken end; selected corner/end adapters plus sparse rounded rubble, staggered cracks.
- One wall per canonical seam; no nav blockage by cosmetic stones; source collision aligns with visible unbroken wall.

**Fixture C: Minecart KISS rail profile**
- One track straight, gentle curve, short slope, continuous two rails and repeated sleepers; one cart following it with gravity/brake/no steering, stopping at end buffer.
- Show a mine entrance/open surface transition with separate ballast/sleeper/rail-side props windows.
- Validate curve radius, car width/bogie spacing, rail placement/slope and actor/wagon source model pose; no switch yet.

Proposed test classifications: `CORE_CONTACT`, `EDGE_PRESENTATION`, `DUNGEON_TOPOLOGY`, `RAIL_GUIDANCE`, `SOURCE_FIDELITY`, `PERFORMANCE`, `SAVE_RELOAD`. These are **acceptance topics**, not a new schema or evidence of running tests.

## 7. Guardrails and limits

- No new Godot/Unity/Houdini/Unreal runtime or Blender-generator authority. External references supply methods only.
- No replacing Joyride/Track Core with Kenney/KayKit track geometry. No blanket ink/watercolor treatment for dirt, sparks, smoke, VFX.
- Clay deform visuals outside the exact socket/frame and collision surfaces, preserving frame, support, banking and actual driving clearance.
- Do not assume all KFB route styles use identical fixed 32m transitions. Existing T4 zone widths are longer. Source exact profile and available segment distance wins.
- No new geometry on stopped WorldBuilder R4, no R5, no Stage/Live without authorisation.
- No donor design accepted from asset URL alone: visually isolate real source before integration.
- No exact claimed runtime test, screenshot, rail physics or full source video examination in this research slice.

## 8. Next gate (one)

`TRACK_CORE_EDGE_ADAPTER_SOURCE_ISOLATION_01`: with the EXISTING Track Core/Joyride owner, show the genuine KFB Racer source sections and T4 transition at original camera, then test one **Street↔Race** border stack with staggered curb/sidewalk/barrier and preserve explicit edge/collision invariants. Do NOT begin rail physics or Dungeon runtime before this source-isolated seam proves it can produce valid adapters. Dungeon and Rail fixture descriptions above remain follow-on research targets.

No human product gate is manufactured by this document. Technical result may be reviewed by existing specialists first; a visual Georg decision comes only if actual meaningful KFB comparison is produced.
