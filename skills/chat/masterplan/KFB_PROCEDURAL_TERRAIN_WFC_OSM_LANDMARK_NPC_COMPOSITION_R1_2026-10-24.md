# KFB Procedural Terrain × WFC × OSM × Genii Loci × Living Scenes — R1
## Georg intent, verified donors, open architecture options, WS1 terrain-planning intake
**Date:** 2026-10-24  
**Type:** INTENT-FIRST DESIGN / RESEARCH SYNTHESIS; no implementation, world-model acceptance, engine adoption, runtime activation or public release.  
**Owning document lane:** KFB cross-project World Composition planning, georg-doc/kayfabizarro, branch planning/kfb-procedural-world-composition-wfc-osm-2026-10-24.  
**Receiving work:** current **WS1 R3F/terrain** writer to be reconfirmed at handoff; not authorized to modify WS1 by this document. Other owning modules retain authority.  
**Base reviewed:** main 7e1c4ab0f143b2f1c0f33017eb473574f20190c9. WS1 branch references are source snapshots, not automatically current runtime refs.

**Governing rule:** [INTENT FIRST · SOLUTION OPEN · EVIDENCE BEFORE PRESCRIPTION](https://github.com/georg-doc/kayfabizarro/blob/docs/kfb-decisions-register-2026-10-11/tools/KFB-ToolBox/_inbox/KFB_HUB/30_DECISIONS/replies/WEBCHAT_INTENT_FIRST_SOLUTION_OPEN_R1_2026-10-23.md). Keep **Georg-originated goals** separate from assistant implementation hypotheses. Neither an attractive demo nor a loaded asset URL proves actual KFB visual/source donor reuse.

## 1 · GEORG'S TARGET EXPERIENCE — WHAT THE PLAYER SHOULD SEE AND DO
These are expressed goals, **not** approval of a particular WFC grid, terrain shader, level count, game engine, fixed biome taxonomy, renderer or pipeline.

- Exploring the KFB procedural world should yield **surprising, varied, recognizable places**. A bounded city district, an authored diorama, landmark with its surrounding street fabric, a Genii Loci / memorable locality, a scenelet or an NPC encounter may emerge by **seeded chance, biome, place suitability, world/story rules or authored trigger**. Avoid visibly formulaic repetition.
- Mix **continuous colored, organically flowing KFB terrain** and surreal/optical transitions with **real-world OSM excerpts**. Real streets should still form believable, legible networks and recognizable skylines. A known structure should be readable *in the context of its district*, not as a lone tourist-model arbitrarily planted on random ground.
- In particular: **Kölner Dom and surrounding Cologne** and **Eiffel Tower with surrounding Paris district** could appear as inserted miniature/playable “city islands”, visually cartoonized and stylistically coherent with KFB; the player can approach, inspect and possibly traverse them. More locations can follow.
- City fragments may be **preprocessed, baked, pre-rendered, preassembled or selectively interactive** before placement for performance. Preserve perspective, street structure, ground contact and necessary proximity gameplay; no assumption that a single flat render can replace drivable collision space.
- Landscape generation should benefit from new procedural methods such as the user-cited **procedural-almanac**, **Wave Function Collapse (WFC)** or other rule/constraint methods, with sufficient freedom to compare and reject them where a simpler method produces a better visual result.
- Variety may include **Goo-infested / transformed real places**, and NPCs with their **real KFB props, habitats, routines and activities**. Areas can respond to world state, encounter outcomes and player actions rather than remain static dioramas.
- The visual end state is KFB's **cartoon, ink, clay and colorful / sometimes deliberately contrasting source-language**, not a generic medieval village, featureless procedural noise, hard visible hex terrain, stock UI, neon portal or copied real-world photogrammetry.
- Separate related creative intent: landscapes and city scenes may later be **seen through portals, Gaussian-splat windows, colorful melt/water surfaces or comic Gutter Space**, but no such renderer is mandatory for these sites to appear in the normal world.
- Georg's exploratory question “Would Godot or a similar engine help?” is **research intent, not migration approval**.
- Preserve meaningful **history → terrain → settlements → paths → functions → actors/activities → present-day life**. Chance should choose *valid, interesting, authored possibilities*, never substitute for purpose or agency.

### 1.1 Two different types of locality (preserve both)
**Geographic truth:** Inside a real OSM-derived city excerpt, its original building footprints, street topology, water/rail relationships and landmark coordinates stay tied to one local-metre reference.  
**KFB world placement:** The excerpt *as a single validated zone or scene* can be translated/rotated/conditionally scaled and discovered at another position in the KFB world. A city fragment is not thereby a claim that Cologne is geographically located in the generated world position. Store the original origin, source IDs, local frame, whole-scene world transform and placement provenance separately.

**Genii Loci / place identity:** A place must retain a coherent skyline, distinctive silhouette, surrounding streets, spatial/use cues, environmental atmosphere and meaningful encounter affordances. An Eiffel GLB alone is **not** a Paris district. Preserve distinct authorship of memorable places while permitting rule-guided discovery.

## 2 · VERIFIED KFB STARTING POINT — REUSE, DO NOT REBUILD
Facts below are from fetched GitHub files; their **evidence state matters**.

| Source/owner | What exists | Status/limitation for this project |
| --- | --- | --- |
| [OSM City Lab](../../../tools/osm-city-lab/README.md) | Reproducible OSM normalization, local ENU metres, source/cache, Clean/Cartoon/Grotesque, building/road/water/landuse consumer scenes; Hürth + Ehrenfeld + Dom/Zentrum | Data/source and dedicated viewer/consumer proofs are **not** proof of seamless placement in current WS1 play world |
| [Dom/Zentrum SOURCE_SPEC](../../../tools/osm-city-lab/data/dom-zentrum-v0/SOURCE_SPEC.json), [CLAUDE_CONTEXT](../../../tools/osm-city-lab/data/dom-zentrum-v0/CLAUDE_CONTEXT.json) | 2,279.652 × 2,115.070 m, 6,351 buildings, 5,236 road segments (2,523 driveable), 665 railways, 6 water lines; Cologne Cathedral OSM way/4532022, HBF node/2399559029, Hohenzollern Bridge relation/5460390 | Cached real OSM / deterministic source; no independently accepted full WS1 city zone |
| [Hürth/Ehrenfeld corridor](../../../tools/osm-city-lab/docs/CORRIDOR_EHRENFELD_HUERTH.md) | Source-backed 11.384 km corridor, Race receiver and public Stunt World prior PASS | Consumer/vehicle context only; does not imply WS1 authored world has same mobility acceptance |
| [Landmark Overrides](../../../tools/osm-city-lab/docs/LANDMARK_OVERRIDES.md) | Stable OSM footprint/centroid → pinned asset, yaw/scale, hide procedural base only after loaded/fit validated; fallback | Contract ready; original standalone model work must be fitted and visually accepted per consumer |
| [Landmark / img2threejs README](../../../tools/img2threejs/README.md), [WORLD MONUMENTS01 PASS Return](../../../tools/img2threejs/docs/WORLD_MONUMENTS01_CLAUDE_DESIGN_PASS_RETURN_2026-10-12.md) | Existing Eiffel/Giza/Stonehenge/Pentagon/Kremlin studies, Cathedral style donor, Grotesque default; accepted 2026-10-12 session cut | **Design PASS · TUNE LATER**, actual accepted archive ingestion/isolated source-object proof and integration still required. No Paris OSM district sourced/accepted here |
| [Cologne Race Option C candidate](../../../tools/KFB-ToolBox/_inbox/KFB%20Cologne%20Race%20Option%20C-2/docs/RETURN.md) | Source-backed example: 850 OSM buildings on 340 m route corridor, Rhein, approx. 157 m donor Dom, race geometry | Design candidate, **not production world acceptance**, does not authorize its independent road-mesh owner |
| [Cologne World Shell WB-D1](../../../tools/KFB-ToolBox/_inbox/KFB%20WB-D1%20%C2%B7%20Cologne%20World%20Shell/SESSION_2026-09-24_WB-D1/SOURCE.json) | Cached city crop, Dom/HBF, geographic anchors, seam and edit-layer experiments | Source candidate only, useful to inspect/isolate rather than reinvent |
| [Resident Atlas S6](../../../tools/resident_atlas_s6/docs/ATLAS_RETURN.md), [Resident Life Semantic Model](../RESIDENT_LIFE_SEMANTIC_MODEL_PREP_2026-10-06.md) | Actor rigs, exact props/poses and source scenelets; proposed ResidentProfile, ActivityDefinition, POI, RouteFamily, ActivityInstance | Atlas donor + **Resident Life proposal**; gameplay schedules, encounter state and nav must be verified in the actual receiving owner |
| [WS1 terrain source branch](https://github.com/georg-doc/kayfabizarro/tree/ws1/terrain-probe-world/ws1/kfb-planet) | React Three Fiber + Three.js + Rapier; actual m1-terrain module with deterministic noise, terrain2/3, probeHeight, hydro/water; world-probe recipe | Inspected branch head **1765b3f8ad7ced84a8ebaf0cc1fd0de5e20e5ec3**, a source snapshot **not** asserted current active WS1/WS1b runtime |
| [WS1_STATUS.md](https://github.com/georg-doc/kayfabizarro/blob/ws1/terrain-439/WS1_STATUS.md) | WS1 R3F progress through §145 dated 2026-10-22; terrain shape/long “marble tongues” remains a live visual concern; WS1 NPC Dark Fluffers have separate current work | Inspected branch head **4df9362a156fabb32411a960915e38d3a68ae224**; more recent private/runtime working trees may exist. **WS1 owner must pin current source before a code write** |
| [WorldBuilder Terrain-First Reset](../../../tools/KFB-ToolBox/_handover/WORLD_BUILDER_V1_2026-09-22/TERRAIN_FIRST_RESET_2026-09-23.md) | Continuous terrain primary; authored scene objects; ZyFou ProceduralTerrains MIT donor for editing/LOD/heightmaps | Architecture/reuse donor; not permission to transplant a new game engine into WS1 |
| [Track Core ownership](../KFB_OPEN_WORLD_ROAD_TRACK_CORE_CANON_2026-10-07.md), [Visual Terrain donor findings](../recovery/KFB_OPEN_WORLD_VISUAL_TERRAIN_LAB_DONOR_FINDINGS_2026-10-07.md) | Track Core builds roads/contact; Joyride presentation; Surface Truth terrain mesh/support/contact; terrain/biome transition donor concepts | A generated WFC road graph may express **route intent only**, never a competing driving-contact owner |
| [Four-Island Story Recovery](../recovery/KFB_FOUR_ISLAND_STORY_RECOVERY_2026-10-08.md), [vision brief](../CLAUDE_DESIGN_FOUR_ISLAND_STORY_VISION_R1_2026-10-08.md) | Town/Dystopia/Utopia/Protopia story, Resident fixtures, histories and POI relationships | WB2 PR [#348](https://github.com/georg-doc/kayfabizarro/pull/348) = **R4 STOPPED / NO MVP / F-R39 FAIL**. A/B visual gate remains binding **for that WorldBuilder**, not automatic stop of WS1 R3F prototypes |

**Scope distinction:** Do not conflate the **WB2 R4 halted design/runtime outcome** with WS1's separately active R3F terrain planning. Still, **this document authorizes neither** to start a new engine, world-builder runtime or massive content migration.

## 3 · EXTERNAL DONOR SHORTLIST — REFERENCES, NOT AUTO-ADOPTION
| Lead | Candidate use | Provenance / caution |
| --- | --- | --- |
| [BlaiseLabs/procedural-almanac](https://github.com/BlaiseLabs/procedural-almanac) | Dependency-free ES modules: seeded fractal/ridged noise, islandHeight, windingRiver, distance masks, A* paths, scatterAlong, time/weather, combinatorial 2D island demo. See its actual source / README. | MIT; **2D canvas/data algorithms, not a 3D terrain renderer or complete WFC engine**. Inspect and isolate each imported function, pin revision, run receiving tests. The island demo uses terraced pixels; **do not reproduce visible height steps as KFB terrain canon**. |
| [ZyFou/ProceduralTerrains](https://github.com/ZyFou/ProceduralTerrains) | Three.js terrain/editor donor: layered noise, chunks, LOD, painting, heightmap import, export | Already tracked in KFB Terrain-First Reset at pinned f58a8ddb81d1fbb526a41282a9a7e9c05c2d2070, MIT. No wholesale editor/runtime swap. |
| [mxgmn/WaveFunctionCollapse](https://github.com/mxgmn/WaveFunctionCollapse) | WFC baseline: tile adjacency/local constraints, solver behavior, contradiction analysis | Method and reference implementation only; choose an actual JS-compatible candidate only after source/license/tests check |
| [BorisTheBrave/DeBroglie](https://github.com/BorisTheBrave/DeBroglie) | 3D/hex/global-constraint/backtracking design comparator | MIT C# library, not drop-in browser JS; use for algorithm design/research only |
| [Aleph / user Reddit reference](https://www.reddit.com/r/TopologyAI/s/fomLObJP0b) | GIS/OSM/terrain/possibly 3D geographic discovery and export idea | Original post/project identity, dataset rights, reliability **must be resolved at intake**. Tool code rights never imply permission to republish imagery or proprietary 3D tiles |
| [Godot documentation](https://docs.godotengine.org/en/stable/tutorials/export/exporting_for_web.html), PlayCanvas/Babylon.js | Future alternate authoring/engine comparison for NPC/nav/physics or 3D tools | No migration decision; Godot 4 web export traditionally relies on WebGL2 Compatibility renderer, so current official docs must be rechecked at decision time |

**Rights:** OSM ODbL 1.0 + contributor attribution, dataset provenance and derived-database obligations must be reviewed per export; other DEM/LoD2/municipal sources need their own documented terms. Do not ship Google-Earth/Maps proprietary mesh content on the strength of an MIT downloader. Do not conflate a CC0/MIT *algorithm* with ownership of a 3D scene/model/texture.

## 4 · ASSISTANT PROPOSAL: HIERARCHICAL WORLD COMPOSITION, NOT “WFC GENERATES EVERYTHING”
This is an **option to test** rather than a hard pipeline requirement:

1. **Story/place intent:** identify history, focal attraction, use, social function, accessible route, expected NPC actions, player role and possible conflict. Author required beats and POIs before randomization.
2. **Geo/diorama source selection:** choose a fully pinned preassembled OSM area, a KFB authored vignette/scenelet, dungeon/market/farm, landmark+surroundings, or procedural nature zone. Decide if placement follows biome, story gate, rare encounter, handcrafted district or seed.
3. **World-suitability / constraints:** preserve slope, water and road connectivity, support footprint, traversal volume, sightlines, skyline framing, landmark clearance, prop/actor placement and entry/exit. Hard constraints should be explicit.
4. **Local WFC / constraint solving:** select compatible border tiles, building/roof/façade variants, prop clusters, vegetation transitions and scene connectors **within the selected zone**. Prefer a small bounded solver on authored module sockets, with seed, limited backtracking and a validated graceful failure/fallback; **do not** make WFC the story compiler or a replacement for road/terrain physics.
5. **Terrain/road implementation through owners:** WS1/current Surface Truth owns height mesh+collision; Track Core constructs routes and drive contact; Joyride/KFB owns road look. Apply proposed cut/fill/blend through owner APIs, not detached “floating diorama plates”.
6. **Resident scene assembly:** place exact-source Actor/Prop/Activity bundles with world POIs and contact/affordance anchors; Atlas owns source identity and rig/pose, Resident Life owns activity intent/state, Navigation owns paths, ChatterBox/Audio own their output.
7. **Goo/Fluff/world-state variants:** layer existing or future world-event semantics over stable scene IDs; choose masked visual morph/material/prop-state variations and Resident reactions as **consumers**. A runtime infection should normally evolve local state, not regenerate an entire city with WFC every frame.
8. **LOD/export/persistence:** bake static batches and far views; keep local collision/nav/interactive meshes and separate dynamic actors; persist seed, generator revision, geo-origin, zone transform, stable source IDs, chosen recipe/variants, deltas and world state; reconstruct unchanged after fresh reload.

### 4.1 Important distinction: local adjacency vs global narrative
WFC enforces **local compatibility**; “market needs homes”, “bridge must go somewhere”, “Farmer can travel field → market”, “Goo spreads through connected surfaces” and “the player can reach this encounter” are **global constraints**, not assured by tile matching. Check them independently by graph, reachability, world-story and activity tests. For impossible inputs, report contradictions and preserve the last valid scene; do not silently create a fake road/door/building or endlessly regenerate.

### 4.2 Spawn/discovery policy (proposal)
- **Seeded locality catalogue**: a set of candidate place/scene recipes tagged with biome, rarity, narrative relevance, area, clearance, skyline and traversal needs. Weighted choice is allowed only after hard constraints are satisfied.
- **Guaranteed meaningful anchors**: required story locations do not depend on chance and cannot vanish because a WFC solve failed.
- **Optional discoveries**: vignette/Genii-Loci/OSM inserts can be rare and context-sensitive; avoid pop-in in plain sight, overlap with landmarks, intersections and other active encounters.
- **Nested composition**: a whole Cologne/Paris neighborhood may be a single world-zone module at outer scale; within it, local submodules vary. Never let WFC independently shuffle real source roads or relocate the Cathedral relative to HBF.
- **Preserve scale options**: real metre scale as default source truth; cartoon exaggeration/perspective/skylines as presentation. Any whole-world scale adaptation must be explicit and simultaneously reconcile vehicle/collision, actor and road widths.

## 5 · CITY PACKAGE: CACHED OSM NEIGHBORHOOD / GENIUS LOCI
**Candidate package, not adopted schema:**

| Layer | Proposed payload |
| --- | --- |
| Identity | package/seed/revision, place name, landmark and district summary, provenance/licence |
| Geographic | WGS84 origin, cached normalized OSM road/building/water/rail metadata, local metres, scene transform |
| Style | KFB Clean/Cartoon/Grotesque + accepted Clay/Ink palette/material mappings, skyline/silhouette golden camera |
| Static bake | Chunked/instanced buildings, simple roof volumes, KFB detail/material variants, low-cost impostor/far capture; optional geo elevation |
| Interactive | Near building proxies, tested Support Truth/collision, Nav/route graph, Track-Core connections, authorized doors/portals |
| Landmark | Exact OSM anchor, pinned genuine donor GLB/source geometry, independent before/after isolated view, silhouette/fit/grounding checks |
| Life | POIs / Actor/Prop/Scenelet refs, navigation affordances and runtime state bindings |
| Transformations | Local Goo mask or authored state variant; separate normal/corrupted/repaired visuals and activities where supported |

**Cologne first:** reuse existing **dom-zentrum-v0** and source-isolated Dom/HBF donors. Test a *small selective crop*, not all 6,351 buildings live at near LOD. Preserve Rhine, rails and bridge relationships important to skyline/entry. A staged zone can be cartoonified without rewriting its true road graph.

**Paris second (NOT CURRENTLY SOURCED/BUILT):** build an OSM bbox/crop around Eiffel Tower **with actual surrounding place context** (e.g. Champ de Mars / Trocadéro / Seine as independently verified in OSM). Reuse the existing Eiffel authoring donor only after real source isolation, scale/yaw/footprint fit and license checks. There is **no verified equivalent current Paris city dataset** in the inspected KFB City Lab; do not claim one or fabricate street alignments. Paris becomes an extension of the existing City Lab normalization pipeline, not a dedicated geography runtime.

**“Pre-rendered” modes are alternatives, not synonymous:** (A) offline *3D baking* (LOD, static batching/instancing/light maps/texture atlases), (B) distant billboard/impostor/2.5D visual shell, (C) actual view-dependent 3D capture such as licensed Gaussian splats for scenic extras. Only **live authored 3D collision and navigation** can be treated as walk/drive surfaces. An impostor may look correct from one camera but not from all traversal views; do not label it an interactive city.

## 6 · LANDSCAPE × CITY BORDERS
- Terrain should remain visually **continuous**, not a carpet of stepped WFC squares or mandatory visible Hex tiles.
- “Seam” is both visual and physical: grade/mask biome and material transitions; where necessary negotiate terrain cut/fill/flattened building footprint with the **single** height/support authority. Connect roads via Track-Core-compatible approaches; preserve slopes, bridges and tunnels. No detached massing hovering over sloped base.
- KFB palette/ink/clay textures should retain authored world surface language; preserve **source recognizable shape** and deliberate stylistic exceptions (WS1 racers retain their source appearance). Do not force all input geometry into one generic material.
- Heightfield + biome mask + WFC connector masks + geometry contact should reference one reproducible coordinate map; source OSM local metres transformed into world space with known north/yaw/scale.
- Terrain can influence which place appears, and an accepted place can constrain/shape surrounding terrain. This is a **negotiation through one owner**, not two independent height writers.

## 7 · GOO, NPCs, PROPS AND ACTIVITIES
**User intent:** Goo-infected city excerpts and encounter dioramas with actual NPC behaviors. **Open:** the canonical current KFB Goo mechanics and their relation to **Fluff** must be inspected; do **not** assert that both are the same substance, or that a fully working Goo infection runtime already exists.

Candidate state slices:
- Clean/ordinary landscape: a source-backed Farmer with tools harvesting near a field connected to a market.
- Affected: visible local contamination/changed palette, with an interrupted activity or a failed supply route.
- Restored/altered: world-state event changes material/props and Resident opportunity; event can be authored, reversible or persistent as allowed by the real owner.

An existing [Resident Life example fixture](../RESIDENT_LIFE_VERTICAL_SLICE_FIXTURE_01_2026-10-06.json) supplies real **candidate** Farmer-b, Lorekeeper and Goth-Girl with POI, activity/route/encounter graphs. Reuse source-backed Atlas prop+rig, and verify actual motion clips/hand contact/POIs rather than picking by filename. Scheduled behaviors, emotion/memory and encounter interruption live with Resident Life, not WFC. Performance cues consume intent; WFC only proposes compatible stage arrangement.

## 8 · PERFORMANCE STRATEGY AND VERIFIABLE BUDGETS
**Avoid prescriptive triangle/FPS defaults without target hardware measurements.** Candidate cost model:
- Offline author/cache deterministic expensive WFC/normalization/scene assembly, geo transform, module variants and static collision baking; no Overpass query at runtime; content-address source assets.
- Spatial chunking + visibility culling + near/mid/far LOD, building instancing, merged static meshes where appropriate **while preserving stable semantic IDs** for doors/POIs/interaction.
- Distance LOD for NPC mixer/eyes/IK/voice/FX; full activities near player, cheap deterministic activity simulation at distance, dormant/unloaded beyond relevance.
- Goo material-state masks or pre-baked style variants for far static environments; limit expensive fragment shader/overdraw effects to what is visually proven. Previous KFB Visual Terrain Lab identified **Clay fragment cost**, not geometry, as a hotspot; its quoted 59.9 FPS figure was **not accepted** due to concurrent GPU load.
- For interactive city geometry, do not replace walkable bridge/road contact with scenic billboard/splat geometry. Test collisions at seams and source geo-scale.

Acceptance measurement: actual target GPU, focused window, no concurrent competing render, identical cameras/scene seed/settings, screenshots and route replay, memory/build size/initial load/draw calls/triangles/frame time. Compare no new generator vs optional local WFC vs pre-baked city vs real interactive 3D. Record **measured** counts, not estimates dressed as tests.

## 9 · ENGINE QUESTION: GODOT OR SIMILAR?
**No switch authorized.** Receiving current WS1 source shows **React Three Fiber/Three.js + Rapier**, plus working terrain, Goo-adjacent NPC, water, shaders and KFB asset pipelines. A migration now would duplicate renderer/materials, input/movement, cards/audio and web publishing. Preferred first use: keep browser-native owner and reusable neutral scene recipes / GLB + JSON interchange.

**Godot as later bounded comparator:** offline/desktop authoring, editor visualization, NPC navigation/animation and optional native build are plausible. Godot 4 web export historically uses WebGL2 Compatibility and has renderer/shader constraints; check current stable docs and browser device support at adoption time. Neither Godot nor Unity/PlayCanvas/Babylon should become a second active runtime owner by stealth. A small source-exact imported city+actor scene can be evaluated independently **after** a receiving owner accepts a cross-engine gate. Evaluate PlayCanvas/Babylon only if concrete missing Web features warrant it. No framework choice before profiling current seams.

## 10 · WS1 INTAKE / IMPLEMENTATION OPTION — BOUNDED AND REVERSIBLE
**This is a planning packet, not a command to interrupt WS1's current terrain-form/A-B work.** WS1 first checks its current private repo/working tree/main host and the exact active branch, including §145 of [WS1_STATUS.md](https://github.com/georg-doc/kayfabizarro/blob/ws1/terrain-439/WS1_STATUS.md) as a *historic status*. The open form/marble-tongue vs blob-shape issue must not be overridden by our guessed Noise settings.

Suggested progression (conditional on current WS1 authority and Georg's World/visual gate):
1. **Source inventory + screenshot isolation:** one actual current WS1 terrain/probe; one exact normalized Cologne crop; genuine Dom/HBF model in isolation; one existing Resident Atlas scenelet+props. Keep provenance and old outputs.
2. **Paper/API fit**: one-page compatibility table: real World Surface API, OSM metre→world frame, seed, roads/Track Core, Resident Life POIs, asset registry, source size, Goo event state. Identify missing APIs before coding.
3. **Cheap composition sanity check** (no full runtime/geometry): top-down route/POI graph and annotated place relationships; at least one reachable meaningful social/work loop. This is the R4 failure-prevention gate.
4. **Only then if authorized: bounded visual comparison** on real receiving owner: baseline vs (a) seeded biome selection, (b) constrained local WFC module variation, (c) pre-baked city crop with genuine hero landmark. Same input place/seed; no duplicate world, movement or renderer.
5. **Later gated dynamic test**: near/mid/far representation, one source-backed NPC activity + prop, optional Goo-state change, real contact + save/fresh reload + re-entry; verify actual user-visible scene on the project's authorized Site/Stage surface when that stage is requested.

**Proposed small proving scene (not required canon):** “Cologne pocket landscape”: a narrow source-backed Dom/HBF/Rhine-district view nested in continuous KFB terrain; preserved skyline and streets; one KFB Resident scenelet on valid POI; optional source-appropriate Goo change; playable approach and camera orbit. Paris/Eiffel as second dataset/scene only after Cologne passes geography + skyline + performance. Competing scene “Authored living hamlet” can benchmark WFC benefits independent of OSM.

**Concrete test requirements (future; no tests executed for this document):**
- source/provenance/rights/ref pin valid, correct OSM identity and silhouette; donor **displayed in isolation** and then integrated;
- same seed & generator revision → identical selected places, geo transforms and generated module IDs on independent reload;
- WFC hard constraints, road endpoint compatibility, collision clearance and 100% required POI reachability; contradiction/fallback never fabricates a landmark;
- terrain visual mesh, physics support and road contact aligned in sampled foot/drive route;
- actual NPC prop contact, believable activity, interrupt/restore, no invented animation/voice;
- style-parity Golden for KFB terrain, city, landmark; skyline legible from near/traversal/far camera;
- measured browser performance/content weight with source IDs preserved under LOD;
- if a public Stage is required, verified exact official deployed route; GitHub blob/preview is not live proof.

## 11 · RELATION TO FLATWORLD / SPLATS / GUTTER SPACE
This document **does not** supersede the already-committed Flatworld research. The connected visual ambition is recorded in [KFB_SPLAT_PROCEDURAL_WORLD_R1_2026-10-24.md](https://github.com/georg-doc/kayfabizarro/blob/planning/kfb-flatworld-comic-gutter-r1-2026-10-18/skills/chat/masterplan/KFB_SPLAT_PROCEDURAL_WORLD_R1_2026-10-24.md), Flatworld Draft PR [#423](https://github.com/georg-doc/kayfabizarro/pull/423). Three concept clusters cover portal/splat access to distant worlds, spatial Cards/Fractal Almanac, and Gutter-Space track ride; Cluster 4 covers optically deep melt/water drive-bys. Their visual implementations are **options**. A city/landmark package may become a destination or scenic source, but splat is not physical ground and portal/Gutter logic remains with its existing owner.

## 12 · HANDOFF / PROVENANCE / LIMITS (PLANNING RETURN)
**Outcome:** Preserve Georg's combined request as one WS1-readable, intent-first source-grounded planning dossier.  
**Changed production code:** none. **Tests:** 0 new unit, 0 integration, 0 browser, 0 GPU, 0 visible public; literature/metadata/source reads only.  
**Current WorldBuilder authority:** WB2 PR #348 remains STOPPED (R4); no R5/merge/live. WS1 R3F is a separate currently productive prototype, actual latest private branch/owner must be verified by WS1.  
**Known limitations:** no verified Paris city crop; Eiffel is an authoring donor, not attached to real Paris OSM; no demonstrated universal WFC pipeline or Goo-state runtime in this slice; existing KFB city/Resident exports are not yet a proven WS1 game integration.  
**Central Hub/router:** routine research addition only; do not churn Hub/Cloudflare and do not reinterpret a Draft PR as acceptance.  
**Only next gate:** **WS1 TERRAIN/WORLD INTAKE** — compare this document against the exact current WS1 receiving terrain/World source, report a source-backed KEEP/ADAPT/REJECT owner matrix and one cheap story/geo/route composition proof; no full generator build until current receiving/human gate authorizes it.

---

## 13 · ADDITIVE RESEARCH NOTE R2 — TERRAIN STUDY I × PROCEDURAL ART DIRECTION (2026-10-25)

**Status:** research/design comparison only; **not** an adopted renderer/shader, WFC requirement, Stage route, WS1 code instruction or human visual acceptance. Same cross-project planning owner, branch and Draft PR #447; same single WS1 terrain/world intake gate from §12. **User stimulus:** [r/creativecoding / Terrain Study I, 24 October 2026](https://www.reddit.com/r/creativecoding/comments/1xe9np2/terrain_study_i/) by Fleur d. Leigh; [artist's generator](https://terrain.fleurs.studio/) and [Instagram stills](https://www.instagram.com/p/De4SWLOjV4G/?img_index=1). User quoted technical description. Reddit indexed post/comment text is available; the actual Fleurs interactive render was **not** opened/visually isolated here. No artwork, image or source was downloaded, and no usage licence for original art/code was established. Technique inspiration only, not an import donor.

### 13.1 Distinguish procedural shape, composition, appearance, atmosphere and behavior

| Independent layer | Candidate techniques to compare, not imposed defaults | KFB receiving truth / practical risk |
| --- | --- | --- |
| **Geomorphology** | fBM, ridged noise, *domain warp*; curvature/slope masks; river/drainage fields, optional erosional detailing | Existing WS1 continuous terrain and height/support/collision owner. Pure layered noise can look like waves or marble tongues; erosion/hydrology should serve chosen cartoon silhouettes, not mandate realism. |
| **Place composition / semantics** | authored POI/route graph, weighted ecology/biome suitability, settlement/river/road functional constraints; WFC for **local** legal neighboring modules; explicit graph connectivity and fallback | Existing KFB OSM City Lab, Track Core, Resident Life, world-state owners. WFC is *not* hydrology, the semantic story designer, city-map truth, or a random landmark spawner. |
| **Procedural art direction / stylization** | object/world-space stipple density driven by light, slope, tonal bands, distance; threshold dithering, ink/hatching/contours, toon/cel bands, Clay hybrid material variants | Retain accepted KFB ink/clay/Cartoon donors, materials and legibility. Terrain Study's points should be an optional **style pass or distant realm/mindscape**, not a forced replacement of the normal colorful KFB world. Avoid unreadable Cards, figures and roads. |
| **Atmosphere / weather** | low valley cloud sea based on terrain-height difference; wind-advection/noise/height masks and crest-spill illusion; fog and light interplay; optional precomputed wind/flow fields | Visually compare on genuine source terrain. A drifting shader/cloud volume is *not* automatically full fluid physics. Render transparent layers carefully around camera, roads, splats and interactable actors. |
| **Determinism / temporal life** | one world seed + versioned independent sub-seeds for geology/biomes/POIs/visual palette/weather; coordinate-stable spatial hashing; time-evolving wind with replayable parameters | Same seed+version must preserve geography, city placement, actor/POI IDs and navigability on reload. A 10-second seamlessly looping atmospheric clip must not imply that full world physics or NPC behavior loops every 10 seconds. |

**Important detail from Terrain Study I:** its stated **~400,000 dots per A3 print** are *print composition density*, not a measured interactive frame/VRAM requirement. Its identical-size printed ink marks, tonal threshold/dither and fog loop may work beautifully for a fixed camera yet flicker/alias with player motion. If studied in KFB, test world-locked sampling or temporal-stable blue-noise/dithering; distance/LOD-aware density; true depth and silhouettes at moving camera; stable fog/actor occlusion; multiple display resolutions; and compare fragment/instruction, fill-rate, alpha blending and overdraw to **existing** toon/ink/Clay baseline. No default point count, frame budget or WebGL/WebGPU migration is assumed.

### 13.2 Method arbitration for the world the player experiences

- **Keep** continuous actual terrain/physics for locomotion, racing, collision and source coordinate truth. Never treat a stipple point cloud or scenic Gaussian splat as support geometry.
- **Compare** geological authoring (noise-only vs terrain-directed hydrology/erosion) first at the *same seed and same camera*, judged by coastline/ridge/valley artistic silhouette, diversity, traversability and current WS1 morph-language; not by realism alone.
- **Use constraints** at semantic scale: major settlement/story/route/landmark/river relationships must be reachable before optional WFC chooses roof/façade/plot/diorama variants. Real OSM street topology remains pinned and is not shuffled independently.
- **Test art styles without changing geometry**: existing KFB colored cartoon/Clay/Ink; graphic monochrome stipple with contour emphasis; painterly/risograph palette and wind-fog atmosphere. Isolate *the same authentic KFB object/terrain donor* first and capture paired integrated views second. The third style is a creative hypothesis, not ownership of the Fleurs technique or graphics.
- **Biomes are dramaturgy as well as ecology**: clean/affected/repaired or Dystopia/Utopia/Protopia can bias lighting, art style, vegetation, prop activities and atmospheric treatment via one authoritative world state, without changing landmark truth or forcing every scene into identical art style.
- **Scale-selective synthesis**: macro terrain + authored place graph → prevalidated OSM pocket/scenelets → local WFC variants → GPU surface/atmosphere, rather than global 3D WFC over all voxels and a full-resolution dotted landscape all the time.

### 13.3 Specific high-value source research, still not imported

- [Fleur d. Leigh, Terrain Study I (Reddit, 2026-10-24)](https://www.reddit.com/r/creativecoding/comments/1xe9np2/terrain_study_i/): layered noise, tonal stippling, ink-threshold dithering, seeded palette/light/weather and 10s wind-driven cloud-sea loop, per creator description. Discussion mentions **Hokusai Fuji woodblock prints** as an artistic influence; not an assertion that all KFB should use this style.
- [Grenier et al., Real-time Terrain Enhancement with Controlled Procedural Patterns, Computer Graphics Forum 2024](https://onlinelibrary.wiley.com/doi/full/10.1111/cgf.14992): slope/drainage-aware structured detail and erosion-pattern enhancement; geological-form comparator, not current engine dependency.
- [Schott et al., Terrain Amplification using Multi-Scale Erosion, SIGGRAPH 2024](https://h-schott.github.io/p/mserosion/): terrain detail across scales with hydrologically consistent forms; image-shape research donor only.
- [Villar López & Chover, Procedural Generation of 3D Maps with WFC: Optimization and Advanced Constraints, Eurographics 2025](https://diglib.eg.org/items/112ca5b1-8e8b-49f0-b28b-25164aad9104): weighted/layered/non-local constraints and connectivity; not an existing browser module.
- [Kim et al., Graph-Based WFC for Games (2020)](https://www.jstage.jst.go.jp/article/transinf/E103.D/8/E103.D_2019EDP7295/_article/-char/en): graph-based placement/topology constraints and navigation-mesh relation; useful for KFB POI/route graphs, not proof of a KFB implementation.

### 13.4 Optional cheap WS1 comparison, only after current intake is authorized

**One authentic current WS1 valley/ridge scene and camera path.** A/B/C: (A) existing colored material/shape, (B) same mesh with ink/stipple screen/world-space style, (C) same mesh with valley-fog + stylistically restrained directional dither. Show the terrain/actor/road **source in isolation**, then same camera path; capture still, short traversal, seam/collision state, frame-time/overdraw only on a focused target GPU and full device context. Vary **one** feature at a time; after visual comparison, choose keep/adapt/reject without displacing existing surface owner. A connected settlement/OSM/WFC check remains a **separate** semantic-composition experiment, not an automatic dependency of the style trial.

### 13.5 Return delta / unchanged next gate

**Changes in this research slice:** additive section 13 in this existing dossier only. No production code, media, real Fleurs image isolation, renderer, library import, live site/Stage, generated screenshot, CI or GPU execution. **Checks:** direct GitHub readback of exact file/head and editorial/source-link assertions; do not count literature reads as software tests. **Unresolved:** original interactive/moving reference cannot be declared visually reviewed; code/license unknown; KFB source objects and WS1 current runtime head must be isolated by current owner before use. **Single unchanged next gate:** WS1 TERRAIN/WORLD INTAKE of §12 (exact receiver head and KEEP/ADAPT/REJECT + cheap coherent POI/route composition proof); include this optional *art-direction comparator* in the intake, not as a new blocker or mandatory implementation.

---

## 14 · ADDITIVE RESEARCH NOTE R3 — DYNAMIC VORONOI × OSM POCKET-CITY SEAMS (2026-10-25)

**Status:** user-triggered method assessment, not an implementation order, new renderer/world writer, chosen algorithm, borrowed source asset or accepted Stage. **Existing planning owner, branch and PR #447 unchanged.** Preserve KFB as collage and cross-style composition: procedural zoning must not impose one art style. This note complements §4–§6, §10 and §13, not replacing WS1 terrain work.

### 14.1 Exact user reference and evidence level

- [ToastilyBreaded, “Bonus: showcasing the dynamic voronoi graph”, r/proceduralgeneration, 2026-01-08](https://www.reddit.com/r/proceduralgeneration/comments/1q7joho/bonus_showcasing_the_dynamic_voronoi_graph/) ([prior city prototype](https://www.reddit.com/r/godot/comments/1plamb9/im_prototyping_a_procedurally_generated_city/)).
- User-provided screenshot in this 2026-10-25 chat at approx. **0:05/0:15 of source clip**: color-coded river/land with blue Voronoi edges; small irregular cells at white built-up urban cluster, larger/quasi-grid cells in surrounding landscape. **Observed screenshot only**, not inspected moving clip or a KFB render; the screenshot is not added to GitHub/media and does not confer redistribution rights. Visible blue lines are a **debug representation**, not proposed KFB surface design.
- The Reddit author describes *regenerating the Voronoi from varying point patterns/densities without changing already “claimed” cells*: generate new points → reject new points inside **circumcircles associated with claimed cells** → add the claimed-cell centroids back to the point set → recompute Voronoi. **This is the author's reported algorithm/behavior**, not a mathematically or code-verified KFB exact-preservation guarantee; the publicly visible discussion is not a verified released code package or license. Verify under cell adjacency, degeneracies, site moves and boundary clipping before adopting.
- Broader **reference donors**, not imported: [Red Blob Games Voronoi maps tutorial](https://www.redblobgames.com/x/2022-voronoi-maps-tutorial/) (Delaunay/Voronoi, elevation/moisture, rivers/graph) and [Red Blob Mapgen4](https://www.redblobgames.com/maps/mapgen4/) (interactive artistic terrain/biomes/weather); [redblobgames/mapgen2](https://github.com/redblobgames/mapgen2) (JavaScript graph/biome generator). These are technique and API ideas; inspect exact source revision/license and isolate actual output before code reuse. No claimed reuse of ToastilyBreaded implementation.

### 14.2 KFB-specific concept — Voronoi as *invisible adaptive regional allocator*

**Desired player-facing outcome:** driving through continuous, distinctly KFB-colored terrain, naturally discover a source-true **Cologne OSM pocket city** (Dom/HBF/Rhein/bridge/street network) with stable silhouette, sensible approaches, actual collision, NPC/POI activity and a believable blend into surrounding hills/forest/villages. World seed or new encounters can adapt **outside** the fixed urban footprint without changing the existing city's geographic geometry, coordinates or internal semantic graph. Paris, fantastic city fragments, micro-dioramas and Goo-altered scenes remain later alternative packages, not automatic requirements.

| Scale / authority | Voronoi / WFC / OSM role | Must remain stable |
| --- | --- | --- |
| **Macro KFB surface** (WS1 terrain/support owner) | actual continuous terrain/water/geological fields; optional coarse biome/place-suitability Voronoi **labels** | single height/mesh/support/physics truth; no global visible Voronoi grid |
| **Adaptive regional layer** (proposed *data only*, not a second world engine) | nonuniform Voronoi seeds: dense near settlements/roads/rivers/points of interest, sparse at quiet distance; named protective “claimed” pockets | deterministic seed/revision, persistent zone identity and retained player-discovered packages; no sudden reflow near a player |
| **OSM city packages** (existing City Lab + landmark authors) | source-true local metric frame, urban extents and protected skyline/road anchors; **one whole fixed scene/pocket**, potentially overlapping several allocator cells rather than forcing its boundaries to equal one Voronoi polygon | exact local streets/building footprints/landmark coordinates inside the package; no Voronoi remix of authentic OSM geometry |
| **Boundary negotiation** (existing WS1 + Track Core) | terrain suitability/grade/cut-fill, coast/river contact, distance-to-pocket seam blend, road/bridge entry alignment, vegetation masks, portal or scenic edge options | passable approach; collision mesh equals support terrain; no detached city slab or fake drivable splat |
| **Micro-world authoring** (WFC / scene recipes / Resident Atlas) | WFC *inside eligible non-OSM plots* and adapted authored parcel variants; real POI graph first, compatible local geometry next; contrasting KFB cartoon/ink/clay/painterly looks allowed per district | scene provenance, actor actions/props, POI reachability and road/nav connectivity |

**Core separation:** Voronoi allocates opportunities / influence *over the world*, WFC selects legal local composition, OSM preserves authored geographic relationships, WS1/Track retain geometry and movement, KFB art-direction controls per-scene style. Voronoi cells are **not mandatory physical mesh patches**, and hard cell borders do not imply hard transitions.

### 14.3 Edge integration — not just a polygon with a city pasted inside

1. Choose a source-verified **Cologne Dom/Zentrum subset** already normalized in OSM City Lab; isolate actual landmark and built block visually. Determine pocket bounding polygon and approach constraints from genuine roads/rail/Rhine (not an invented circle).
2. Find candidate KFB world position(s) by landmass/slope/river/access/visibility and story/Genii Loci relevance. A real OSM city can be rotated/translated as a whole with its documented provenance and local-metre transform; never distort individual streets for nearest Voronoi cell adjacency.
3. Claim the pocket as a **stable protected footprint** plus an intentionally bounded transition apron. Regenerate surrounding regional seeds with a constrained-site strategy such as the author's claimed-cell approach, or a simpler fixed buffer/partition comparator. Reserve coastline, bridge and through-route anchors.
4. Smooth **visual/geological influence fields** across the apron (distance mask / blend / signed-distance alternatives); vary terrain/foliage/material/atmosphere intentionally. Do **not** blur or numerically smooth the *OSM road graph* or move Dom/HBF. Continuous geometry and collision must agree.
5. Connect actual outside routes through existing **Track Core**; validate at least one fully drivable/walkable approach and one semantic Resident/POI loop. If no valid approach, reject candidate placement deterministically and choose another seed/site rather than teleport/patch-in a fake road.
6. WFC may fill suitable nearby hamlets, gardens, ruins or seasonal/Goo scene variants in unclaimed parcels. The player's already discovered city package and state remain stable on regeneration/reload. World-affecting Goo/Fluff state stays with existing runtime authority.

**Important architecture risk:** forcing the OSM pocket boundary to match a single irregular Voronoi cell could crop buildings, rivers and roads. Use **protected package polygons + local influence zones / polygon overlays**, or multiple cells attached to one semantic district. City identity is not identical to a tessellation primitive.

### 14.4 Candidate A/B acceptance question for WS1 after existing intake

**Cheap paper/graph proof FIRST**, without new live generator: same Cologne OSM donor and KFB terrain crop, one seed, one top-down annotated POI/route and protected footprint map. Compare:
- **A — Baseline:** direct prevalidated city insertion + straightforward falloff/terrain apron, **no Voronoi**.
- **B — Dynamic-adaptive:** sparse regional Voronoi, local density around pocket; preserve protected city and route anchors on new seed addition, use **identical** original source scene + terrain/Track owners.

Only select B when it demonstrably improves nearby landscape/settlement layouts, organic seam logic or future controlled expansion over A. Run source-isolated images first; then matching aerial camera and drive-in video, baseline vs variant, with real KFB models/materials, not colored debug cells or placeholder cardboard.

**Future assertions / not executed here:**
- deterministic rerun and persistent IDs for claimed city/POIs after adding adjacent cells; polygon/geographic identity and boundary/topology remain stable or explicitly logged if not;
- no protected buildings/street/Rhein/rail/bridge source geometry cropped/warped; road endpoints match Track Core and physical ground;
- protected city retains player state and same landmark visibility despite outer land regeneration; NPC/prop nav loop and one playable access route work;
- no obvious hard seam, fake grid or discontinuous slope/contact; preserve collage style autonomy; count graph solve cost, generated triangles, memory, frame time on source-correct focused target device;
- if algorithm cannot preserve claimed cells under actual seeds/edge cases, fall back to **fixed protected buffer** rather than rebuilding the owner or fudging source city.

**Rights/evidence:** user screenshot/reference link only, external author code/art license not established, no screenshot uploaded to GitHub, no downloaded sample, no visual browser isolation, no source implementation, no runtime, no unit/integration/browser/GPU tests, no public Stage and no merge.

### 14.5 Return / unchanged single next gate

**This addendum modifies only this existing planning dossier**; the current WS1 R3F implementation and WB2 R4 STOP status are unchanged. No KFB Hub/router/public URL changes because this is an additive planning lead. **One next gate remains §12: WS1 TERRAIN/WORLD INTAKE** — owner confirms the exact current receiving branch and APIs, supplies KEEP/ADAPT/REJECT and one cheap meaningful Cologne geo/route/POI composition proof. Include *fixed-pocket baseline vs dynamic adaptive Voronoi* as an **optional nonblocking comparison**, not as a requirement to replace WS1 terrain, adopt WFC globally, or create a second world owner.

---

## 15 · ADDITIVE CONCEPT RESEARCH R4 — OPEN WORLD AS COLLAGE / POP-UP / BRECHT FAÇADE / BOOK-LANDSCAPE (2026-10-25)

**Status:** user's expressed creative goals and assistant's open technology options; **NOT** a build order, visual Golden, import, new owner/engine, Stage or Live result. Additive to current WFC/OSM/WS1 planning Draft PR #447; existing World/Track, Combat, Card, Clay, paper grammar, 3D asset and Gutter/portal owners remain authoritative. Georg expressly values cross-over and aesthetic discontinuity rather than one universal visual style.

### 15.1 Georg's intent, not implementation commitments

- Immersive but efficiently rendered KFB open-world **collage**: 2.5D pop-up drawings, visible **white cut paper edges**, low-cost building/environment cutouts and rhythmic 2D staccato items (particularly racing), alongside genuine clay/cartoon 3D/OSM.
- Paper façades as interactable/destructible theatrical constructions, including kayfabe, satirical **Fassaden-Demokratie**, Brechtian revealing of stage machinery, and state-based Black Fluff/Goo-infested buildings. No inferred equivalence of Black Fluff and Goo mechanisms.
- Massive instanced **3D books, comic volumes, panels and pages** making surreal walls, mazes, buildings, arches and landscapes like a Panopticon/prison-maze wall-gizmo; existing user-recalled KayKit/Tiny Treats pack assets should be source-confirmed before use.
- Coconino/Krazy Kat shifting-background logic, theatrical reversals, portals/page thresholds and meaningful player discovery, rather than uniform low-poly generic props or repetitive scripted punchlines.

### 15.2 Verified existing KFB material / provenance, limits

- [KFB 2026-10-07 recovery index §§8–12](https://github.com/georg-doc/kayfabizarro/blob/main/skills/chat/recovery/KFB_2026-10-07_WEBCHAT_IDEATION_PERSISTENCE_AUDIT.md) already specifies **PAPER_CARDBOARD**, visible light cut edges, cardboard thickness, braces/tabs/hinges, front/back asymmetry, bending/folding/tearing/tipping, open stage, semantic thresholds including FACADE_DOOR and TRUTH_SWITCH, damage → exposed-edge completion, repair; **not** a verified production runtime. Governing deeper owner: existing KFB Cell/World Grammar. Refer rather than replace.
- [KFB Asset Catalog](https://github.com/georg-doc/kayfabizarro/blob/main/media/3D_Assets/CATALOG/INDEX.md) presently catalogs **2,776** entries including KFB_PaperCard_01, OpenBook_FrizzleBobFractalAlmanac_01, jerryblessed-book-4923, Kenney Furniture bookcaseClosed, bookcaseClosedWide, bookcaseOpen, bookcaseOpenLow, books. **Metadata only**; did not visually isolate GLBs or confirm exact KayKit/Tiny Treats book meshes and licenses. A named existing runtime Panopticon wall-gizmo was **not verified**; no imaginary path or readiness claimed.
- [Seed World Mech Destruction POC](https://github.com/georg-doc/kayfabizarro/blob/main/tools/KFB-ToolBox/_inbox/KFB%20Seed%20World%20Mech%20Destruction%20POC%2001/KFB_SEED_WORLD_MECH_POC_01_2026-10-06/seedworld/docs/HANDOVER_2026-10-06_r2.md) documents worker-safe deterministic geometry, LOD0–3 shells, ring chunk streaming, promoted damage cells, limited physics/pools, support cascades and 2-bit per-cell damage state. It remains **research/playground**, not accepted WS1 or WB2 runtime, and latest full post-walk T1–T13 regression was pending in its handover. Existing [integration mapping](https://github.com/georg-doc/kayfabizarro/blob/main/tools/KFB-ToolBox/_inbox/KFB%20Seed%20World%20Mech%20Destruction%20POC%2001/KFB_SEED_WORLD_MECH_POC_01_2026-10-06/seedworld/docs/INTEGRATION_OPEN_WORLD.md) says Combat owns weapon/destruction while World owns support and recipe-state.
- [KFB Clay Surface Canon](https://github.com/georg-doc/kayfabizarro/blob/main/skills/chat/KFB_OPEN_WORLD_CLAY_SURFACE_CANON_2026-10-07.md) keeps original source geometry and KFB Clay Golden identity distinct, with distance microdetail and source-material/performance constraints. Keep existing art-language rather than homogenize it as paper.
- [KFB OSM City Lab](https://github.com/georg-doc/kayfabizarro/blob/main/tools/osm-city-lab/README.md) provides normalized actual Cologne and Hürth/Ehrenfeld layouts with Clean/Cartoon/Grotesque appearance. Do not paper-flatten physically driveable roads/hero landmarks.
- [Coconino internal research](https://github.com/georg-doc/kayfabizarro/blob/main/media/3D_Assets/WSB_BLENDER/B2/R2/RESEARCH_SOURCES.md) already names Krazy Kat/Herriman shifting scenery and theatrical stage-plant logic. Existing [Flatworld/Gutter PR #423](https://github.com/georg-doc/kayfabizarro/pull/423) separately owns otherworld/page transitions.
- [Tearaway GDC 2013 lecture](https://www.gdcvault.com/play/1017845/Building-the-Touchy-Feely-World) is a relevant **external creative reference** for fold/tear/crumple and paper-world authorship, not imported code or assets. [Brecht stage technique documentation](https://narrative-environments.github.io/CourseCompendium/Alienation-Effect-Verfremdungseffekt.html) emphasizes visible machinery, placards and interrupted illusion, useful to propose *spatial* editorial interactions.

### 15.3 Six independent design/technique candidates, all open to comparison

**I · White-edge paper cutouts.** Three alternatives to compare: (a) flat illustrated alpha-masked billboard/plane with printed white contour; (b) triangulated silhouette **thin extruded mesh**, true white edge material, distinct front/back print, visible tabs/feet; (c) several offset planes with parallax and stage supports. Mixed 3D and 2D is an intended art outcome, not a forced screen-facing billboard requirement. Oblique vehicle views benefit from crossed planes, 4/8/16 view impostor atlases or actual slim physical silhouettes. Alpha blending and layered transparent foliage can overload fill rate; compare opaque silhouette geometry vs alphaTest, alphaHash, alphaToCoverage at actual target cameras.

**II · Racer staccato.** Keep real existing track, controls, support surface, driver animation and camera frame-rate; vary only props/scenery: roadside paper signs, illustrated spectators, rapidly appearing pop-up buildings, 2–4 authored-pose snap changes, layered horizon and forced perspective. For speed, stream/populate camera/track-lookahead zones in existing streaming owner. Staccato refers to **selected art/animation beats**, never to lower physics tick-rate. At high speed verify shimmer, pop-in, readability and parallax; art-directed discrete flips can be preferable to transparency-heavy crossfades.

**III · Brechtian façade / kayfabe reveal.** Candidate semantic sequence: convincing facade front; player can walk around and see construction/back, supports, missing rooms; a world-state condition or bounded impact folds/tears hinged panels; meaningful real NPC/POI, empty backstage, scaffold, portal or contrary reality is revealed. The expected outcome is a pointed spatial contradiction relevant to context, not generic 'everything fake' joke. Use existing paper Facade/Truth-Switch and bidirectional Damage/Build/Repair grammar, not a new puzzle or destruction runtime. Precompute break seams/cells, keep unhit façade batched, promote only currently impacted members to limited rigid-body physics; cache damage state with stable semantic IDs. Black Fluff/Goo changes bind to independently verified actual world-state authority.

**IV · Instanced book/comic architecture.** Existing catalogued genuine KFB PaperCard/OpenBook + bookshelf/books families are donor leads. Build visual idea: spine-walled corridors, bookcase mazes, giant open-book bridges, page arches, volume skyscrapers, footnote stairs and genuine legible Card/PDF inspection points; volumes clustered by thematic/editorial neighborhood, not random grids. World/maze navigation uses coarse stable **wall segment collider per group**, and only near hero volumes are true interactive geometry; many copies share mesh/material/atlas. Ensure Card Viewer/Almanac owns real card text and page action; no second catalog or fake book contents. Claim of an already running "Panopticon prison maze wall-gizmo" requires exact source resolution.

**V · Coconino / Herriman stage-change.** Turn a corner or pass a comic/page threshold and background mesas, props or sky can abruptly change image-language. Keep traversable physical topography, existing POI/city coordinate truth and player positions stable; cosmetic set replacement can be authored, perhaps explicitly exposing stage rails/rear surfaces. Sometimes a physical environment can change via an authoritative separate instance/portal route. Do not animate collision meshes underneath a moving car for a backdrop gag.

**VI · Semantic collage/multi-biome stage.** Geomorphic noise/hydrology drives macro ground. Protected OSM city packages and valid Track roads remain geometric truth. Adaptive Voronoi/constraint placement allocates scenic neighborhoods, optionally local WFC composes compatible parcels; art-direction layers can vary by meaning/location: actual 3D Clay foreground, painted pop-up midground, graphic ink distant hills, paper foldout place, atmospheric splat backdrop. Semantic POI/story routes and resident behavior are authored or constrained first. Collage may celebrate stylistic seams **if they are deliberate**; no default material blender is demanded.

### 15.4 Efficiency plan – research options, not unmeasured FPS promises

| Concern | Practical candidate | Pitfall to measure |
| --- | --- | --- |
| repeated meshes | [Three InstancedMesh](https://threejs.org/docs/pages/InstancedMesh.html) for shared geometry/material, [BatchedMesh](https://threejs.org/docs/pages/BatchedMesh.html) for heterogeneous same-material meshes, subdivided by spatial chunks | fewer draw calls vs more overdraw/poor whole-batch frustum culling; preserve stable IDs for editor/damage |
| paper cutouts | polygon-silhouette + thin sidewall/white trim, or masked/alpha-tested atlas cards | orientation, transparent sorting, anti-aliasing, high-speed shimmer |
| near/mid/far | real collider+hero meshes near; instanced 3D/popup mid; clustered angle-correct impostor/paper matte far | LOD transitions and camera shift; no scenery render geometry as physical driving support |
| delivery | existing chunk/worker pipeline, spatial visibility, predictive Racer route streaming, budgeted GPU uploads | long synchronous loads, upload stalls, memory and pop-in |
| encoding | [gltfpack / meshoptimizer](https://meshoptimizer.org/gltf/) and [Three GLTFLoader KTX2/Meshopt support](https://threejs.org/docs/pages/GLTFLoader.html), test per genuine source object | wire size vs GPU decoded memory, lost metadata/semantics, decoder setup |
| damage | predesigned cell/hinge structures, localized promotion to physics, pooled bits/debris, state persistence and repair | not thousands of simultaneous rigid bodies and no second support truth |
| atmosphere | baked/cheap multi-plane fog, seeded cloud/volumetric illusion, controlled active layers and optional splat *scenery* | transparent fill rate, sorting, no physical splat/collider equivalence |

Performance wins must be **measured at identical cameras and product target GPU**: frame time CPU/GPU, draw calls, triangles, overdraw, VRAM, download/decode, pop-in, physical seam/support and collision; plus player-relevant legibility. Flat planes are not intrinsically cheaper if transparency fill rate dominates.

### 15.5 Optional small visual questions – not authorized build tasks

1. **Paper Racer:** exact current road/vehicle; source-isolate existing genuine roadside props; compare real 3D, opaque thin white-edge cutouts and layered paper stage through identical drive path/speed. One meaningful 10–15 second traverse can reveal mismatch; performance only if target device measured.
2. **Destructible façade:** one actual accepted source façade/threshold, front/back/edge shown in isolation; reveal backside braces and a bounded fold/tear with actual existing world state, explicit authorial claim/consequence and support proof; comparison to existing destruct donor required.
3. **Fractal Book Canyon:** visually isolate actual catalogued 3D open book and shelf/books source objects, verify rights; one walkable small scene with book-spine walls and genuine Card/Almanac stop; coarse wall collision, one escape/re-entry route, batching+LOD evidence. No fabricated "Panopticon wall-gizmo" component.

**One next gate unchanged:** WS1 TERRAIN/WORLD INTAKE as in §12 (pin exact current receiving source and report KEEP/ADAPT/REJECT plus cheap real Cologne POI/route composition proof). These creative candidate studies can be reviewed *after source/owner intake*, not divert the current active WS1 writer. No implementation, source-object visual verification, KFB tests (unit/integration/browser/GPU all **0**), screenshot, Stage/Site verification, Live promotion or merge in this research note.
