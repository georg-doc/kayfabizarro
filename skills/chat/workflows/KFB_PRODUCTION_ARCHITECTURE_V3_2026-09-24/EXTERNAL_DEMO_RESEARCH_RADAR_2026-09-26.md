# KFB External Demo Research Radar · 2026-09-26

Status: **PASS 2 IN PROGRESS · CHECKPOINT 4 / G–I RESEARCH PERSISTED**  
Owner: **KFB Web Architecture lane** (planning/routing only; runtime owners unchanged)  
Repository: `georg-doc/kayfabizarro`  
Branch: `chatgpt-web/production-architecture-v3-2026-09-24`  
PR: **#204**  
Starting head: `5f19bc7d43fddde56fab9029e304a19a6a4acccf`  
Outcome: a source-linked research radar that routes external patterns/demos into existing KFB jobs without creating a second runtime, editor, registry or world owner.  
Hub/Stage navigation route: `https://kayfabizarro.pages.dev/kfb-hub/` — **navigation only; no new public Stage candidate is claimed by this research slice.**

## Why this slice exists

Georg asked for a recurring research lane across **Reddit, GitHub and other public demos** to identify useful:
- concrete implementation techniques;
- reusable architectural patterns;
- interaction/presentation ideas;
- source/demo donors;
- small blueprint candidates;
- anti-patterns and integration risks

for current KFB slices, especially **World / WorldBuilder / ToolBox / Residents / Race / Card Zones / playable game loops**.

This document is an additive research artifact under the existing Production Architecture v3 planning owner. It does **not** promote any external project to KFB owner or implementation truth.

## Current KFB receiving context

Current architecture source on PR #204:
- **13 strands**
- **96 jobs**
- **44 READY**
- **52 HOLD**

Highest-value receiving jobs for this research pass:
1. `ENV-PREVIEW-01` — shared KFB environment preview host.
2. `WORLD-ENV-CONSOLIDATE-01` — current world-environment source recipe.
3. `WB-MOBILITY-MVP-01` — one playable world with movement-mode handoffs.
4. `WB-HUERTH-COLOGNE-RACE-MVP-01` — OSM world → authored Race transition.
5. `WORLD-BIOME-MOOD-01` / `WORLD-NATURE-01` / `WORLD-RECIPE-01`.
6. `CZ-ENV-01` — Card Zone × current Environment.
7. `NPC-AITOWN-KISS-01` — bounded living-resident intent loop.
8. ToolBox / Animation / Resident Atlas preview consumers.

Protected boundaries:
- Travel/TinySkies remains macro-world truth.
- WorldBuilder remains its authoring owner.
- Race remains its track/physics owner.
- ToolBox / Animation Lab remain actor/motion authoring owners.
- Resident Atlas / Resident Scene remain resident presentation owners.
- Card Zones mount into current environment rather than importing the historical standalone voxel world.
- No second renderer, terrain generator, sky stack, locomotion writer, NPC memory runtime, asset registry or universal game runtime.

## Research method

Every external item is classified by **what KFB can actually take from it**, not by popularity.

### Evidence classes

- **SOURCE** — code/docs/repo inspected.
- **DEMO** — interactive/public demo inspected.
- **COMMUNITY** — Reddit/forum discussion; useful for failure modes, usability and practice, never implementation truth by itself.
- **SECONDARY** — article/video/write-up; useful context, lower confidence than source.
- **KFB-PRIOR** — older KFB/Dropbox research used only as a lead or comparison.

### KFB fit labels

- **ADOPT PATTERN** — small pattern can map to an existing KFB owner.
- **DONOR CANDIDATE** — source worth isolated inspection before any integration.
- **BLUEPRINT** — concrete bounded proof worth turning into a KFB job/brief.
- **INSPIRATION ONLY** — useful interaction/look/product idea, not direct implementation.
- **AVOID / ANTI-PATTERN** — likely to create owner drift, duplicated stacks, brittle generation or unnecessary complexity.
- **NO ACTION** — interesting but not useful enough for current queue.

### Per-item questions

1. What problem does it solve?
2. What is the smallest reusable mechanism?
3. Which current KFB owner/job receives it?
4. Does KFB already have an equivalent donor/module?
5. What must be shown in **source isolation** before integration?
6. What are the licensing/runtime/dependency constraints?
7. What would be the smallest KFB proof?
8. What should explicitly **not** be copied?

## Timeout-safe execution plan

Long web research is split into independent batches. Each batch is persisted before the next one.

### Batch A · World rendering / environment / procedural world
Targets:
- Three.js/WebGL examples and open repos;
- procedural terrain / biome / scatter / sky / fog;
- asset-light stylized worlds;
- environment-preview host patterns;
- deterministic seed/recipe patterns.

Primary receivers:
`ENV-PREVIEW-01`, `WORLD-ENV-CONSOLIDATE-01`, `WORLD-BIOME-MOOD-01`, `WORLD-NATURE-01`, `WORLD-RECIPE-01`.

### Batch B · WorldBuilder / in-world editing / authoring UX
Targets:
- runtime terrain editing;
- direct manipulation;
- orbit/edit mode switching;
- brush radius/strength interaction;
- scene object transforms;
- save/reload document patterns;
- play/edit coexistence.

Primary receiver:
WorldBuilder / WB2 / current World Integration.

### Batch C · Tracks / roads / modular world-to-race seams
Targets:
- spline/segment track construction;
- procedural or authored road meshes;
- road-edge/barrier variants;
- socket/connector systems;
- transition from world road network to gameplay track.

Primary receivers:
Race + WorldBuilder / `WB-HUERTH-COLOGNE-RACE-MVP-01`.

### Batch D · Residents / living NPCs / lightweight simulation
Targets:
- bounded intent/state loops;
- local perception;
- approach/participate/leave;
- schedule/needs systems;
- deterministic or inspectable memory/state;
- multi-NPC simulation without a new backend stack.

Primary receiver:
`NPC-AITOWN-KISS-01`, Resident Scene/Town.

### Batch E · Card Zones / portals / modular activities / diegetic interfaces
Targets:
- portal/instance handoff;
- world-space cards/objects;
- minigame sockets;
- diegetic interaction;
- reversible local environment overrides.

Primary receivers:
Card Zones, Shared Stage/Transitions, Museum/portal concepts.

### Batch F · ToolBox / animation / preview surfaces
Targets:
- shared scene-preview host;
- pose/motion audition;
- source isolation;
- actor/asset comparison;
- compact browser authoring surfaces.

Primary receivers:
ToolBox, Animation Lab, Resident Atlas, Quick 3D Review.

## Research result format

Each accepted item will be appended to a table with:
- source + date checked;
- evidence class;
- mechanism;
- KFB receiver;
- fit label;
- smallest proof;
- integration risk;
- licensing/dependency notes;
- source-isolation requirement;
- priority.

A final section will convert only the strongest findings into **candidate KFB research follow-ups**. No new job enters `HUB_BRIEFING_CATALOG.json` merely because it is interesting.

## Existing KFB prior-research pool found in Dropbox

Read-only leads discovered on 2026-09-26:
- `KFB Research Cluster 01 — AI-Native Game Development & Technical Production.md`
- `KFB Research Cluster 02 — Solo Onboarding, Discovery & Game Design.md`
- `KFB Research Cluster 03 — Physical, Visual & Interactive Tabletop Worlds.md`
- `kfb-overworld-asset-research.md`
- `KFB_STUNT_PHYSICS_PIRATE_UNDERWATER_RESEARCH_v1.md`
- `KFB Cartoon Motion Research v1.md`
- `WOW_UNDERMINE_DRIVE_RESEARCH_2026-09-19/RESEARCH.md`

These remain **KFB-PRIOR** evidence only. GitHub current state and current owner contracts override them.

## Checkpoint rule

After each research batch:
1. append findings here;
2. record checked source count and failures/timeouts;
3. fetch the exact branch head + this file;
4. only then continue.

A timeout is **UNKNOWN**, never success. Do not repeat a write until branch/file inspection proves it absent.

## Current next gate

**Execute Batch A + Batch B first** because they directly support the active environment/world integration queue. Persist findings before moving to Race/NPC/Card/ToolBox batches.


---

# CHECKPOINT 2 · Batches A–D

Status: **PERSISTED RESEARCH · SOURCE/COMMUNITY TRIAGE COMPLETE FOR WORLD + AUTHORING + ROAD/CONNECTOR + NPC CORE**

## Executive signal

The useful external work does **not** point to a new engine. It mostly validates and sharpens the KFB direction already on PR #204:

- procedural nature should be **seeded support-aware sampling**, not a second terrain/noise world;
- previews should expose **presentation presets orthogonally to source content**, not clone the World stack;
- WB2 sculpting can borrow **localized acceleration/refit techniques** without replacing the accepted editor;
- roads/tracks benefit from a **cross-section + reusable container/socket data model**, which maps onto the already-existing KFB Track Socket/Stunt Registry;
- living Residents benefit from **tiny explicit state/perception/memory primitives**, but KFB should keep AI Town's one-writer/one-intent owner model and avoid importing another simulation backend.

## Batch A · World rendering / environment / procedural world

| Source | Evidence | Reusable mechanism | KFB receiver | Verdict | Smallest useful KFB proof | Do NOT copy |
|---|---|---|---|---|---|---|
| [Three.js MeshSurfaceSampler](https://threejs.org/docs/#examples/en/math/MeshSurfaceSampler) + [source](https://github.com/mrdoob/three.js/blob/dev/examples/jsm/math/MeshSurfaceSampler.js) | SOURCE · MIT | weighted triangle-area sampling; optional weight attribute; custom RNG | `WORLD-NATURE-01`, `WORLD-RECIPE-01` | **ADOPT PATTERN** | deterministic seed → sample only eligible current TerrainSurface/support → instance procedural flora; biome/support mask becomes sampler weight | do not use sampler as a terrain owner; do not confuse weighted eligibility with believable spacing |
| [Three.js InstancedMesh](https://threejs.org/docs/#api/en/objects/InstancedMesh) | SOURCE · MIT | many repeated objects sharing geometry/material in fewer draw calls | `WORLD-NATURE-01`, preview consumers | **ADOPT PATTERN** | one procedural flora family rendered as instanced geometry, preserving per-instance transform/seed | no giant uniform monoculture; no loss of current scatter/support legality |
| Reddit / r/proceduralgeneration community discussion on unnatural noise-driven tree placement | COMMUNITY | biome/noise defines *where allowed*; a second spacing process such as variable-radius Poisson/exclusion gives more natural distribution | `WORLD-NATURE-01` | **BLUEPRINT SUPPORT** | seeded eligible-domain sampler + minimum-distance/exclusion radius; compare against raw noise scatter on same seed | do not turn low-frequency noise blobs into the visible composition grammar |
| [pmndrs/drei Environment](https://drei.docs.pmnd.rs/staging/environment) + [Bounds](https://drei.docs.pmnd.rs/staging/bounds) + [drei-vanilla](https://github.com/pmndrs/drei-vanilla) | SOURCE/DEMO · MIT | compact separation of scene environment/background, intensity/rotation and fit/focus staging | `ENV-PREVIEW-01`, ToolBox/Resident Atlas | **INSPIRATION + SELECTIVE DONOR** | represent `WORLD_MATCH / SOURCE_ISOLATION / CONSUMER_PRESET` as a small host-owned presentation config, consuming current KFB World sources | do not add React/R3F as a KFB runtime owner; do not depend on convenience CDN presets in production |
| [Google model-viewer lighting/environment](https://modelviewer.dev/examples/lightingandenv/) + [staging/camera](https://modelviewer.dev/examples/stagingandcameras/) | SOURCE/DEMO · Apache-2.0 | source model and presentation controls are orthogonal: environment image, skybox, exposure, shadow, camera target; compact preview staging | `ENV-PREVIEW-01`, Quick 3D Review, ToolBox | **INSPIRATION ONLY / API SHAPE** | one source object shown in isolation with explicit preset id + current-world-match preset; same asset, two presentations | do not replace Three.js/ToolBox renderer with model-viewer; avoid simultaneous heavyweight visible HDR/LDR preview stacks |
| [model-viewer animation](https://modelviewer.dev/examples/animation/) + [annotations](https://modelviewer.dev/examples/annotations/) | SOURCE/DEMO · Apache-2.0 | independent animation selection/blend/speed; surface-anchored hotspots that follow animated geometry | ToolBox / Animation / Resident Atlas | **INSPIRATION ONLY** | keep motion selection and source annotations as metadata/presentation layers, not actor truth | no second animation owner; no DOM overlay system unless a real consumer needs it |

### A · concrete KFB recommendation

For `WORLD-NATURE-01`, prefer this sequence:

`current TerrainSurface/support → biome/support eligibility weight → seeded MeshSurfaceSampler-equivalent → spacing/exclusion pass → InstancedMesh/procedural geometry → sparse curated KayKit/Kenney accents`.

This fits the already-recorded rule: **asset-light procedural base + intentional curated accents**, with no second world stack and no noise/blob composition.

For `ENV-PREVIEW-01`, external preview libraries support the current planned three-mode contract:

- `WORLD_MATCH` — consume the actual current KFB environment presentation;
- `SOURCE_ISOLATION` — neutral studio-like source-object proof;
- `CONSUMER_PRESET` — Resident/ToolBox-specific camera/presentation override.

The lesson is the **separation contract**, not the library.

## Batch B · WorldBuilder / in-world editing / authoring UX

| Source | Evidence | Reusable mechanism | KFB receiver | Verdict | Smallest useful KFB proof | Boundary |
|---|---|---|---|---|---|---|
| [three-mesh-bvh sculpt example](https://github.com/gkjohnson/three-mesh-bvh/blob/master/example/sculpt.js) + [project](https://github.com/gkjohnson/three-mesh-bvh) | SOURCE/DEMO · MIT | sphere `shapecast` selects only affected triangles/vertices; wheel changes brush size; OrbitControls disabled while brush hits; interpolated stroke steps; partial normal update; `boundsTree.refit(traversedNodeIndices)` | accepted WB2 terrain sculpt | **STRONG DONOR CANDIDATE** | isolate only the brush-selection/update/refit technique on the current WB2 terrain if/when terrain density/perf becomes a real blocker | do not replace accepted WB2; do not import its whole demo/material/UI |
| [Three.js editor History](https://github.com/mrdoob/three.js/blob/dev/editor/js/History.js) | SOURCE · MIT | command-based execute/undo/redo + JSON persistence | WorldBuilder scene/object editing | **ADOPT PATTERN · LATER** | when Undo becomes a named gate, wrap existing scene-doc mutations as commands/deltas rather than snapshotting renderer state | Undo is not current P0; do not widen WB2 now |
| [Three.js TransformControls](https://threejs.org/docs/#examples/en/controls/TransformControls) | SOURCE/DEMO · MIT | translate/rotate/scale modes, local/world space, snapping, drag events enabling camera arbitration | existing WB2 object editor | **REFERENCE / REGRESSION CHECKLIST** | verify current owner covers transform mode, snapping as needed, drag/orbit arbitration and save/reload; borrow only missing mechanics | no second transform UI or generic editor chrome |
| Reddit: [Four game-development patterns](https://www.reddit.com/r/gamedev/comments/1sf409c/four_game_development_patterns_ive_found/) | COMMUNITY · 2026 | keep data in plain text/JSON as long as possible; custom editors only where spatial authoring gives real value | WorldBuilder, ToolBox config/docs | **SUPPORT CURRENT KFB DIRECTION** | preserve `kfb-worldbuilder-scene` and machine-readable recipe/profile truth as primary state even when edited visually | do not turn every config into a bespoke UI |

### B · concrete KFB recommendation

WB2 already has Georg acceptance and should **not** be rebuilt around an external sculpt library. Keep the current behavior. If larger terrain or denser meshes make brush latency/normal rebuilds measurable, source-isolate the three-mesh-bvh loop and compare:

1. current WB2 selection/update;
2. BVH sphere shapecast;
3. affected-triangle normal update;
4. partial `refit(nodeIndices)`.

The external demo also independently validates Georg's recent UX request: **wheel-adjusted brush radius plus automatic orbit/sculpt arbitration** is a proven low-friction interaction pattern, not an exotic special case.

## Batch C · roads / modular tracks / world-to-Race seams

Current KFB owner truth checked first:
`TRACK_SOCKET_STUNT_REGISTRY_2026-09-25.json` already owns a candidate socket/registration model and explicitly states:
**registration != placement**, **registration != physics acceptance**, WorldBuilder placement only after the Race gate.

| Source | Evidence | Reusable mechanism | KFB receiver | Verdict | KFB mapping | Do NOT copy |
|---|---|---|---|---|---|---|
| [Godot Road Generator](https://github.com/TheDuckCow/godot-road-generator) | SOURCE/DEMO · MIT | cross-section `RoadPoint` settings interpolate along a container; lane width/shoulder live in points; sibling points form reusable `RoadContainer`; containers snap and can be saved/reused; prefab junction containers | Race RKIT / Track Socket Registry / WorldBuilder placement | **STRONG BLUEPRINT, NOT DEPENDENCY** | enrich existing KFB track-piece/socket metadata with explicit cross-section/edge/shoulder/connector facts where missing; generated render mesh stays downstream | no Godot runtime; no replacement track generator; no promotion before Race-driven contact proof |
| Godot Road Generator procedural/prefab intersections | SOURCE · MIT | connector graph + reusable intersection/container pieces; non-planar joins | later road/track assembly | **INSPIRATION / BLUEPRINT** | useful for modular track-kit composition and variant roads with/without barriers/fences while retaining the same socket logic | do not proceduralize real OSM geography |
| Reddit: [procedural road generation using A*](https://www.reddit.com/r/proceduralgeneration/comments/1sx1act/procedural_road_generation_using_a_in_an_infinite/) | COMMUNITY · 2026 | terrain cost/no-go maps can guide a *new* route before smoothing | authored non-OSM connector experiments only | **LIMITED INSPIRATION** | possible fallback for a short authored world→track connector when no geographic road truth exists | never replace Hürth/Köln OSM with generated roads |
| Reddit: [terrain-aware A* realism discussion](https://www.reddit.com/r/proceduralgeneration/comments/1rs7tgc/terrainaware_a_road_generation_for_procedural/) | COMMUNITY · 2026 | mathematically optimal elevation path can look artificial; road cost should include construction/maintenance/distance and appropriate scale | planning heuristic only | **ANTI-PATTERN WARNING** | prefer authored/OSM route truth; procedural connector should expose explicit cost inputs and human authoring | no “shortest/least-slope = realistic road” assumption |

### C · concrete KFB recommendation

Do **not** create another `TRACK-SOCKET` system. The external road generator is valuable because its mature data model supports the plan Georg already described: the **same modular track logic can produce different terrain/road families** by changing cross-section and edge metadata rather than rebuilding track topology.

Potential later enhancement to the *existing* Track Socket/Stunt registry, only if owner code shows these fields are missing:

- left/right edge treatment: none / curb / barrier / high wall / fence;
- cross-section width/profile;
- shoulder/gutter;
- surface/material role;
- connector/socket transform + allowed mate types;
- terrain-conform policy;
- collision/physics owner reference;
- visual variant set.

That is a **schema enrichment proposal**, not a new generator or current implementation task.

## Batch D · Residents / lightweight NPC simulation

Current KFB AI Town decision was re-read before external comparison. It already locks:
`free → choose one intent → approach → participate briefly → leave → remember/resume`,
one world-state writer, one high-level Resident intent, optional Journey-filtered memory and **no** AI Town backend/runtime import.

| Source | Evidence | Reusable mechanism | KFB receiver | Verdict | Smallest proof | Do NOT copy |
|---|---|---|---|---|---|---|
| [Yuka](https://github.com/Mugen87/yuka) | SOURCE/DEMO · MIT | standalone state/goal agents, steering, triggers, short-term Vision/MemorySystem, JSON serialization | `NPC-AITOWN-KISS-01` | **DONOR CANDIDATE FOR PRIMITIVES** | compare current KFB intent loop with a source-isolated `StateMachine + Vision/MemorySystem` on one Resident, while host movement remains owner | no Yuka world/navmesh/Vehicle writer replacing KFB movement |
| [Yuka StateMachine](https://github.com/Mugen87/yuka/blob/master/src/fsm/StateMachine.js) | SOURCE · MIT | explicit enter/exit/current/previous state | NPC intent implementation | **ADOPT PATTERN IF NEEDED** | map to KFB semantic states rather than inventing implicit booleans | no parallel semantic vocabulary |
| [Yuka MemorySystem](https://github.com/Mugen87/yuka/blob/master/src/perception/memory/MemorySystem.js) + Vision | SOURCE · MIT | bounded short-term perceived-entity records with memory span, FOV/range/obstacle awareness | local Resident noticing/approach | **BLUEPRINT** | ephemeral “seen recently” state feeds KFB intent chooser; durable facts still come only from Journey knowledge | no second durable memory DB; no embeddings requirement |
| [Yuka ArriveBehavior](https://github.com/Mugen87/yuka/blob/master/src/steering/behaviors/ArriveBehavior.js) | SOURCE · MIT | decelerating arrival near target rather than stop/teleport | approach/presentation seam | **ALGORITHM REFERENCE ONLY** | use only if existing host locomotion lacks smooth semantic approach; translation remains host-owned | do not give Yuka movement ownership |

### D · concrete KFB recommendation

Yuka should **not** become a KFB dependency by default. Its value is that it decomposes NPC behavior into small inspectable pieces that reinforce AI Town KISS:

`host-known world state → tiny explicit intent state → local perception/short memory → host-approved approach → brief activity/encounter → leave → optional durable Journey fact`.

The highest-value new idea beyond the existing AI Town memo is the **two-memory distinction**:

- **perception memory** = ephemeral, seconds-scale, “who/what did I just see?”;
- **Journey memory** = durable, semantic, only facts the Resident can legitimately know.

This prevents “living NPC” from becoming a global omniscient relationship database.

## Checkpoint-2 source / failure accounting

Inspected in this checkpoint:
- primary GitHub/source families: **7** — Three.js, three-mesh-bvh, drei/drei-vanilla, model-viewer, Godot Road Generator, Yuka, current KFB Architecture/Race/NPC owner docs;
- official documentation/demo surfaces: **10+** focused pages/examples;
- Reddit/community threads used as decision support: **3** directly accessible current/recent threads plus earlier search excerpts;
- licenses directly checked: **Three.js MIT, three-mesh-bvh MIT, drei-vanilla MIT, Google model-viewer Apache-2.0, Godot Road Generator MIT, Yuka MIT**.

Retrieval failures:
- several older Reddit thread opens returned fetch-disabled/internal errors. They are **not** used as implementation evidence and are not required for the recommendations above.
- no GitHub write timeout occurred in Checkpoint 1.

## Checkpoint-2 routing result

No new KFB job is justified yet.

The strongest findings map cleanly into jobs that already exist:
1. `ENV-PREVIEW-01` ← preview-preset separation.
2. `WORLD-NATURE-01` ← seeded weighted support sampling + spacing + instancing.
3. WB2/current World Integration ← BVH sculpt optimization only if a measured performance gate appears.
4. Existing Race Track Socket/Stunt Registry ← cross-section/edge/socket schema enrichment only after owner inspection.
5. `NPC-AITOWN-KISS-01` ← ephemeral perception memory + explicit state primitives.

Next research batch remains **E + F: Card Zones / portal-instance seams / diegetic interfaces + ToolBox/animation/review surfaces**.


---

# CHECKPOINT 3 · Batches E–F + first-pass synthesis

Status: **PASS 1 COMPLETE**

## Batch E · Card Zones / portals / diegetic interfaces

Current KFB owner truth checked first:
- `CURTAIN-02` is the current cover/reveal transition module.
- `STAGE-INSTANCE-01` is the later shared instance recipe.
- Card Zones already own exact fluid, stack/reveal/Beam, Card Cube, authored recipe, WorldBuilder placement and the later world→card→Journey loop.
- Therefore an external portal technique may be a **visual surface/preview**, never a replacement enter/return owner.

| Source | Evidence | Reusable mechanism | KFB receiver | Verdict | Smallest useful proof | Boundary |
|---|---|---|---|---|---|---|
| [drei-vanilla MeshPortalMaterial](https://github.com/pmndrs/drei-vanilla/blob/main/src/core/MeshPortalMaterial.ts) | SOURCE/DEMO · MIT | render a second scene to `WebGLRenderTarget`, align it perspectively behind a mesh, optional SDF-shaped soft edge | Card Zone / Stage presentation | **INSPIRATION / OPTIONAL DONOR** | one bounded “living window” that previews a real existing Zone/instance before entry; enter still fires current KFB transition/return contract | do not introduce portal-as-runtime owner; no recursive portal stack; no RenderTarget/Post stack as default |
| [Three.js CSS3DRenderer](https://threejs.org/docs/#examples/en/renderers/CSS3DRenderer) + [iframe example](https://threejs.org/examples/#css3d_youtube) | SOURCE/DEMO · MIT | real DOM/iframe element receives hierarchical 3D transforms and can be combined visually with WebGL | Museum / kiosk / rare live Card/PDF surface | **BOUNDED INSPIRATION** | only when KFB must preserve an existing real DOM viewer inside a 3D scene without rewriting it | material/geometry limitations, dual-renderer occlusion/compositing, browser zoom limitation; not Card Zone core |
| [Three.js HTMLMesh](https://threejs.org/docs/#examples/en/interactive/HTMLMesh) + InteractiveGroup | SOURCE · MIT | rasterize a DOM control into CanvasTexture on a 3D plane; re-dispatch pointer events; MutationObserver refresh | simple world-space control surfaces | **DONOR CANDIDATE FOR SMALL UI ONLY** | one simple diegetic button/panel where the same existing DOM control logic can be reused | not a full rich web-view replacement; do not rasterize the whole ToolBox/Almanac into the world |
| Reddit: [fully diegetic UI discussion](https://www.reddit.com/r/gamedev/comments/tnkv7j) | COMMUNITY | all-diegetic UI can become cumbersome; a mostly diegetic world with minimal overlay is often clearer | adaptive HUD, Card Zone prompts, vehicles | **PRODUCT GUIDANCE** | keep physical/world-space UI for things that are genuinely objects; keep dense/meta information in existing adaptive overlay/Almanac | no ideology of “all UI must exist physically” |
| Reddit: [world-space UI zoom/pan problem](https://www.reddit.com/r/gamedesign/comments/1wguxg0/) · 2026-09-15 | COMMUNITY · current | menus tightly attached to world objects become difficult across camera scale; world-space signals work best when they are part of the world | Card Zone/Museum interaction affordances | **ANTI-PATTERN WARNING** | world object supplies focus/affordance; detailed data opens in the existing readable overlay/focus surface | do not force long text, inventory or dense controls to remain perspective-distorted in world space |

### E · concrete KFB recommendation

A portal effect is worth keeping as a **future presentation option**, not a new job now.

Best KFB grammar:

`world object / Card Zone portal surface → optional live preview texture → player activates → CURTAIN/STAGE transition → real instance owner → explicit return anchor`.

This preserves the Theatre Curtain and Stage recipe while allowing a more magical “peek inside” when a particular Zone benefits from it.

For cards/PDFs/UI, use a **hybrid rule**:
- world-space = object identity, affordance, short status, physical card/cube/beam;
- focus/overlay = reading, detailed inspection, collection, Almanac, settings.

That matches existing `CZ-CUBE-01`, `META-ALMANAC-01` and adaptive-HUD ownership better than an all-diegetic rewrite.

## Batch F · ToolBox / animation / source-isolation / review surfaces

| Source | Evidence | Reusable mechanism | KFB receiver | Verdict | Smallest useful KFB proof | Boundary |
|---|---|---|---|---|---|---|
| [Don McCurdy three-gltf-viewer](https://github.com/donmccurdy/three-gltf-viewer) | SOURCE/DEMO · MIT | local drag/drop glTF, auto center/fit, environment presets, cameras, AnimationMixer clips/speed, morph controls, axes/grid/skeleton helpers, Draco/KTX2/Meshopt loading | `WEB-QUICK-3D-REVIEW`, ToolBox, `MOTION-INTAKE-DIRECT-01` | **STRONG DONOR / CHECKLIST** | source-isolate one real KFB GLB with compact tabs: Source / Motion / Skeleton / Render / Validation; existing KFB owners remain authoritative | do not fork the whole viewer as a second ToolBox |
| three-gltf-viewer validation report | SOURCE · MIT | provenance fields plus draw calls, animation/material/vertex/triangle counts, extensions, validator errors/warnings | Motion intake / asset audition | **ADOPT PATTERN** | emit compact inspection facts next to the source-isolation preview and persist only useful metadata into the existing catalogue | diagnostics stay secondary to visual review; no dashboard bloat |
| [glTF-Transform inspect](https://gltf-transform.dev/cli.html#inspect) / [source](https://github.com/donmccurdy/glTF-Transform) | SOURCE · MIT | inspect scenes, meshes, materials, textures, animations; identify geometry/texture/draw-call pressure before choosing optimizations | ToolBox intake / production diagnostics | **ADOPT AS TOOLING REFERENCE** | use inspect-like facts for incoming GLB validation/triage before compression/conversion; browser UI optional | no automatic destructive “optimize everything” on owner assets |
| [Khronos glTF Sample Viewer](https://github.khronos.org/glTF-Sample-Viewer-Release/) | SOURCE/REFERENCE DEMO | reference rendering + validator + animation controls + extension/material coverage + model/environment credits | difficult source fidelity disputes | **REFERENCE ORACLE, NOT DONOR UI** | compare a suspicious exported GLB against Khronos when ToolBox/KFB rendering looks wrong | no new production renderer |
| Reddit: [browser glTF inspector / ZeroXR](https://www.reddit.com/r/threejs/comments/1w3estp/) · 2026-08-31 | COMMUNITY/DEMO | exploded/flattened component separation, wireframe and local-only inspection make complicated assets understandable | `WEB-QUICK-3D-REVIEW`, source isolation | **INSPIRATION** | optional “explode/isolate selected nodes + wireframe” review mode for multi-part donors | author explicitly describes the cost of bypassing Three.js; KFB should **not** write a custom WebGL renderer |
| Reddit: [simple Three.js keyframe animation tool](https://www.reddit.com/r/threejs/comments/1l0b5fm/) | COMMUNITY/DEMO · 2025 | import FBX actor + existing FBX/GLB/GLTF motion, do a deliberately slim edit, export GLB | `MOTION-INTAKE-DIRECT-01`, ToolBox Animation Lab | **SUPPORT CURRENT KFB DIRECTION** | keep direct browser motion intake/edit/export narrow; Blender only for the technical exceptions already documented | do not turn the Animation Lab into a Blender clone |
| [glTF Report](https://gltf.report/) / [glTF-Transform](https://github.com/donmccurdy/glTF-Transform) | DEMO + OPEN-CORE UI / MIT core | browser-local inspection/editing, source stays local; source SDK handles analysis/optimization | ToolBox diagnostic workflow | **INSPIRATION / CORE-LIB REFERENCE** | preserve local-first file inspection where practical; surface provenance/size/structure before any mutation | UI is open-core, not open-source; do not copy proprietary UI or treat it as a donor |

### F · concrete KFB recommendation

The best reusable ToolBox pattern is not “build a better universal viewer.” It is:

`real source object → source isolation → compact structural/validation facts → selected owner-specific controls → export through existing owner`.

For `WEB-QUICK-3D-REVIEW`, a useful later enhancement is a tiny diagnostic drawer:
- source/provenance;
- node tree / isolate;
- wireframe;
- optional exploded separation;
- animation clip selector;
- skeleton helper;
- GLB stats/validator result.

It should stay **collapsed by default**. Georg's primary surface remains the real object and the visual question, not the diagnostics.

For `MOTION-INTAKE-DIRECT-01`, the external tools support the current route:
**browser-direct when compatible; Blender queue only when technically required**.

## Pass-1 synthesis · strongest KFB transfers

### P0 / directly useful to current queue

1. **Environment Preview Contract**  
   Adopt the separation principle from model-viewer/drei: source object is constant; presentation is a small explicit preset. This directly strengthens `ENV-PREVIEW-01`.

2. **Support-weighted procedural nature**  
   Use seeded weighted surface sampling + a spacing/exclusion stage + instancing on current TerrainSurface/support. This is the strongest concrete blueprint for `WORLD-NATURE-01`.

3. **WB2 localized sculpt optimization donor**  
   Keep accepted WB2. If brush performance becomes a real gate, compare current code against three-mesh-bvh `shapecast → affected normals → partial refit`.

4. **Track family through cross-section metadata**  
   The Godot Road Generator strongly supports keeping the same KFB socket/segment topology while varying road width, shoulders, barriers/fences and surface roles. Enrich the existing Track Socket registry rather than creating a generator.

5. **Source-isolation diagnostics**  
   three-gltf-viewer + glTF-Transform provide a good donor/checklist for compact node/motion/skeleton/validation inspection around real KFB assets.

### P1 / valuable after current gates

6. **Ephemeral NPC perception memory**  
   Yuka's short-term Vision/MemorySystem is a clean supplement to AI Town KISS, provided Journey remains the only durable semantic memory.

7. **Portal preview, not portal runtime**  
   A render-target/SDF portal can be a living preview window; KFB Curtain/Stage remains the actual transition/return owner.

8. **Hybrid diegetic UI**  
   Keep the card/cube/beam/physical interaction in-world; keep dense text, collection and settings readable in focus/Almanac surfaces.

## Pass-1 anti-pattern list

External research also gives several useful **NOs**:

- **No custom renderer rewrite** merely because a demo is elegant; current Three.js ecosystem already solves most of it.
- **No procedural road generator replacing OSM** for Hürth/Köln.
- **No second World/sky/terrain stack** inside preview tools.
- **No universal external NPC runtime** replacing AI Town KISS + existing host movement/ChatterBox/Journey owners.
- **No universal new 3D editor**; keep plain JSON/recipes as source truth and add spatial authoring only where it pays.
- **No noise-only flora placement** producing visible macro blobs.
- **No all-diegetic UI mandate** for dense information.
- **No portal RenderTarget/Post stack by default**.
- **No destructive asset optimization on intake** without explicit owner workflow.

## Candidate blueprints — routed into existing jobs, not added as new jobs

### Blueprint A · WORLD-NATURE seeded scatter
Receiver: `WORLD-NATURE-01`  
Proof:
1. current TerrainSurface/support only;
2. one deterministic seed;
3. biome/support weight;
4. weighted surface samples;
5. deterministic exclusion/min-distance pass;
6. procedural/instanced flora;
7. sparse curated accents;
8. compare two seeds + reload determinism.

### Blueprint B · ENV-PREVIEW source isolation
Receiver: `ENV-PREVIEW-01`  
Proof:
1. load the exact donor object;
2. show `SOURCE_ISOLATION` neutral view;
3. switch to `WORLD_MATCH` consuming actual KFB World presentation;
4. switch to one `CONSUMER_PRESET`;
5. object identity/source ref stays unchanged;
6. no hidden baseplate or cloned sky stack.

### Blueprint C · TRACK cross-section metadata
Receiver: current Racer Track Socket/Stunt Registry / later modular-track work  
Proof only after current Race gate:
1. use existing socket owner;
2. same segment topology;
3. 3 cross-section presets, e.g. open road / barrier / fence-high-wall;
4. generated/interpolated edge treatment remains visual/geometry metadata;
5. Race still owns contact/physics;
6. WorldBuilder still places only admitted modules.

### Blueprint D · NPC short-memory seam
Receiver: `NPC-AITOWN-KISS-01`  
Proof:
1. three current Residents;
2. one writer / one intent each;
3. seconds-scale “seen recently” records;
4. host-approved approach;
5. actual Journey knowledge separate;
6. no vector DB / no omniscient facts.

### Blueprint E · Quick 3D Source Inspector
Receiver: `WEB-QUICK-3D-REVIEW`, ToolBox  
Proof:
1. real source object isolated;
2. camera fit;
3. node isolate;
4. wireframe/skeleton;
5. clip selector;
6. compact GLB stats + validation;
7. optional exploded-node view;
8. visual object remains primary.

## Research queue · future timeout-safe waves

These are **research batches, not production jobs**. Run only as needed and persist each batch before the next.

- **G · Vehicle / driving / hover / boat / flight handoffs** — Rapier, arcade vehicle controllers, wheel/contact models, water/hover.
- **H · Water / weather / sky / fog / stylized shader recipes** — current Travel/World owner first; Shadertoy mechanisms only as algorithm donors.
- **I · Combat / hit reactions / choreography / crowd separation** — animation/contact/state donors without taking damage ownership.
- **J · Performance / streaming / LOD / large-world loading** — only against measured KFB bottlenecks.
- **K · Mobile/touch authoring and game controls** — WorldBuilder/ToolBox/Hub mobile pain points, pointer/touch parity.
- **L · Small game loops / minigame sockets / playful UI** — patterns that can attach to existing Stage/Instance/Card/Town contracts.

## Pass-1 source accounting

Approximate focused surfaces inspected:
- **10 external GitHub/source families**: Three.js, three-mesh-bvh, drei/drei-vanilla, model-viewer, Godot Road Generator, Yuka, three-gltf-viewer, glTF-Transform, Khronos glTF Sample Viewer, glTF ecosystem references.
- **20+ focused source/doc/demo pages/files** across environment, scatter, sculpting, transforms, roads, AI, portals, DOM-in-3D, GLB inspection and animation.
- **7 community/Reddit discussions/demos** used for practice/failure-mode evidence; community claims were not treated as implementation truth.
- direct license checks where relevant: Three.js MIT · three-mesh-bvh MIT · drei-vanilla MIT · model-viewer Apache-2.0 · Godot Road Generator MIT · Yuka MIT · three-gltf-viewer MIT · glTF-Transform MIT.
- older Reddit fetch failures remain **UNKNOWN/unavailable**, not evidence.

## Production routing decision

**No new Production Architecture job is added by Pass 1.**

Reason: every strong finding has an existing receiving owner/job. Adding another “research implementation” job would duplicate the queue rather than improve it.

The research report itself becomes the living external-donor index. Any future source that crosses from inspiration into a real implementation candidate must first be:
1. pinned to source/license;
2. shown in source isolation;
3. mapped to an existing owner;
4. converted into a bounded proof inside that owner's current job or a genuinely missing capability only.

## One next gate

**Use the Pass-1 findings while executing the already-current `ENV-PREVIEW-01` / World integration queue; do not start a separate implementation branch from this research.**


---

# CHECKPOINT 4 · Batches G–I

Status: **PASS 2 IN PROGRESS · VEHICLE / WATER-WEATHER / COMBAT RESEARCH PERSISTED**

## Batch G · Vehicle / Drive / Boat / Flight handoffs

Current KFB owner truth was re-read first:

- `TRAVEL-MODES-01` already owns the atomic **one-active-writer** Ground / Flight / Drive / Water mode contract.
- `TRAVEL-BOAT-01` explicitly says: recover exact TinySkies Boat source first; no prose reconstruction.
- `TRAVEL-AIR-01` explicitly says: recover Plane source first.
- `TRAVEL-DRIVE-01` is the later free-drive world adapter; Race remains its own track/contact owner.
- `WB-MOBILITY-MVP-01` waits for those source-backed adapters; therefore this research must not invent a shared replacement controller.

### G1 · TinySkies Boat is already the strongest Water-mode donor

Pinned upstream:
`dannylimanseta/tinyskies@2659a5cc987d7e4a4c5aa7e79c86a1626ad75df6`

Source:
- [Boat.ts](https://github.com/dannylimanseta/tinyskies/blob/2659a5cc987d7e4a4c5aa7e79c86a1626ad75df6/client/src/game/Boat.ts)
- [BoatMesh.ts](https://github.com/dannylimanseta/tinyskies/blob/2659a5cc987d7e4a4c5aa7e79c86a1626ad75df6/client/src/game/BoatMesh.ts)
- [WakeTrail.ts](https://github.com/dannylimanseta/tinyskies/blob/2659a5cc987d7e4a4c5aa7e79c86a1626ad75df6/client/src/game/WakeTrail.ts)

Observed mechanism:
- Boat movement is spherical-surface movement, not generic rigid-body boat physics.
- Spawn legality comes from actual world/ocean truth: `isMainOcean`, `isLand`, `surfaceAltitudeAt`.
- Heading input is smoothed; acceleration/brake/coast are explicit.
- Land blocks movement.
- Vertical presentation is a bounded bob/pitch/roll layer around the real surface altitude.
- Wake is a lightweight V-shaped ribbon technique reusing the same presentation family as contrails.
- BoatMesh already includes a foam-waterline presentation.

**Verdict: SOURCE-PIN / ADAPT FIRST.**

For `TRAVEL-BOAT-01`, the first KFB proof should remain almost boring:
1. exact upstream source behavior reproduced;
2. current KFB world/ocean/support truth substituted explicitly;
3. one movement writer;
4. exact wake + waterline source presentation isolated;
5. only then consider wave-reactive buoyancy.

Do **not** start by replacing this with a full physics boat.

### G2 · If KFB later needs wave-reactive buoyancy: queryable wave truth beats visual-wave colliders

Community evidence:
- [r/gamedev · dynamic ocean discussion](https://www.reddit.com/r/gamedev/comments/1rkxzr8/) — recommends sampling multiple hull points against a wave-height function rather than representing waves as physical colliders.
- [r/gamedev · ocean-ish physics](https://www.reddit.com/r/gamedev/comments/xuyy5c/) — highlights the practical difficulty of deriving buoyancy from horizontally displaced Gerstner geometry.
- [r/gamedev · Sea of Thieves water discussion](https://www.reddit.com/r/gamedev/comments/vlvh1t/) — community explanation emphasizes that low-resolution/queryable wave information is needed for buoyancy while visual detail can remain GPU-side.
- [wave-simulation postmortem](https://www.reddit.com/r/gamedev/comments/5q4k2q/) — a deliberately simple CPU-queryable wave influence was more practical than a complex fluid simulation for a small game.

**KFB BLUEPRINT / LATER ONLY:**
`waveQuery(x,z,t) → sample 3–5 hull points → average lift + pitch/roll target → current Boat presentation/movement`.

This preserves one water-height truth for gameplay while letting water visuals be richer.

It is **not** a reason to add physical wave colliders, CFD or an FFT ocean to current P1 Boat recovery.

### G3 · Rapier ray-cast vehicle is a strong Free-Drive reference, not a Race replacement

Current source:
- [Rapier TypeScript DynamicRayCastVehicleController](https://github.com/dimforge/rapier/blob/master/bindings/typescript/src.ts/control/ray_cast_vehicle_controller.ts)
- [Rapier vehicle docs](https://rapier.rs/javascript3d/classes/DynamicRayCastVehicleController.html)
- license: Apache-2.0.

Observed capabilities:
- dynamic chassis;
- per-wheel suspension ray direction;
- wheel radius;
- suspension stiffness/compression/relaxation;
- max suspension force;
- brake impulse;
- steering angle;
- engine force;
- side-friction tuning.

**Verdict: DONOR CANDIDATE / A-B REFERENCE for `TRAVEL-DRIVE-01`.**

Smallest useful KFB proof:
- same current vehicle source;
- same current world support;
- A = current simple/free-drive adapter;
- B = Rapier ray-cast-wheel adapter;
- compare support stability, slope behavior, steering, braking and recovery;
- Race physics/contact owner remains untouched.

Do not port a new ray-cast vehicle into Race merely because it exists.

### G4 · ecctrl exposes useful vehicle/flight primitives, but should not become a KFB runtime dependency by default

Source:
- [pmndrs/ecctrl](https://github.com/pmndrs/ecctrl) · MIT.
- current README documents:
  - ShapeCast wheels with editable longitudinal/lateral slip curves;
  - custom gravity fields;
  - propeller drones mixing thrust + reaction torque;
  - runtime-cheap curve LUTs;
  - touch joystick/buttons.

**Useful mechanisms:**
- **ShapeCast wheel** can be more robust than a single thin wheel-ray over seams/rough terrain.
- **Slip curves** are an explicit tunable handling layer rather than arbitrary steering constants.
- **Custom gravity field** is relevant to KFB's sphere/torus surface experiments.
- **ThrustPropeller** is a useful physical-flight donor if KFB later needs a drone/VTOL mode.

**Verdict: ALGORITHM / TUNING REFERENCE ONLY.**

Do not import React/R3F/ecctrl as a second Travel/Race movement owner. Reuse the ideas only where current owner code has a named gap.

### G5 · TinySkies Plane remains the first aerial donor

Pinned source:
[Plane.ts](https://github.com/dannylimanseta/tinyskies/blob/2659a5cc987d7e4a4c5aa7e79c86a1626ad75df6/client/src/game/Plane.ts)

Observed:
- one spherical position + heading owner;
- explicit altitude, minimum terrain clearance and climb/descend smoothing;
- smoothed turn input;
- bank response;
- speed/boost ceilings;
- visual roll/hit-wobble layers separated from translation truth;
- propeller animation remains presentation.

**Verdict: SOURCE-PIN / ADAPT FIRST for `TRAVEL-AIR-01`.**

The useful design rule for KFB:
**flight state writes translation; bank/pitch/roll presentation follows that state.**
Do not infer flight from camera motion.

## Batch H · Water / weather / sky / stylized shader recipes

### H1 · Current TinySkies mood contract is already stronger than a generic sky library

Pinned source:
- [SkyPresets.ts](https://github.com/dannylimanseta/tinyskies/blob/2659a5cc987d7e4a4c5aa7e79c86a1626ad75df6/client/src/game/SkyPresets.ts)
- current `DayNightCycle.ts`
- current `Globe.ts`
- current `RainOverlay.ts`

The `SkyPreset` already groups:
- sky gradient;
- fog near/far/color;
- hemi + ambient + key/fill/back lights;
- shallow/deep ocean + foam;
- rim;
- cloud opacity;
- atmosphere glow;
- flare color;
- stars/aurora.

This directly supports the current `WORLD-BIOME-MOOD-01` rule that **World/Deck Mood is one global presentation axis**, separate from spatial BiomeField.

**Verdict: CURRENT OWNER / DO NOT REPLACE.**

### H2 · Three.js Sky is useful as a parameter/mechanism reference, not a new owner

Source:
[Three.js Sky](https://github.com/mrdoob/three.js/blob/dev/examples/jsm/objects/Sky.js) · MIT.

Current source exposes:
- turbidity;
- Rayleigh;
- Mie coefficient / directional G;
- sun position;
- cloud scale/speed/coverage/density/elevation;
- sun-disc visibility;
- time.

It also uses an analytic daylight model plus procedural cloud noise.

**KFB use: INSPIRATION / MECHANISM DONOR ONLY.**

Potential gain:
- if current KFB needs a richer continuous mood interpolation later, these atmospheric parameters can inform the existing KFB World Mood schema.

Do not add a second skydome when current Travel/TinySkies already owns sky/mood.

### H3 · Three.js Water2 shows a useful visual-flow trick, but its render cost and owner shape are wrong as the KFB default

Source:
[Water2.js](https://github.com/mrdoob/three.js/blob/dev/examples/jsm/objects/Water2.js) · MIT.

Mechanisms:
- reflection + refraction render targets;
- dual normal maps;
- optional flow map / flow direction;
- two offset phases wrapped over a cycle so flow loops without a visible reset.

**Verdict: ALGORITHM DONOR / NOT DEFAULT WATER OWNER.**

Potential KFB reuse:
- the **two-phase flow-offset trick** is useful for convincing river/current motion if the existing exact Card Zone/World water donor needs it.
- the full reflection/refraction stack is comparatively expensive and should not silently replace the exact current KFB water shader.

### H4 · Underwater look should be a presentation profile, not a second ocean simulation

Current community question:
[r/threejs · underwater absorption/scattering/fog/caustics](https://www.reddit.com/r/threejs/comments/1vqu4d8/)

Useful KFB decomposition:
- distance fog / color absorption;
- limited visibility;
- optional caustic/projected light;
- waterline transition;
- surface reflection/distortion.

This maps cleanly to a later **underwater presentation preset** on the current world/water truth.

No need for volumetric fluid simulation to get the visual language.

### H5 · Weather should be semantic state first, presentation second

TinySkies already has `RainOverlay`; its own design notes propose coupling weather to gameplay rather than leaving it decorative.

For KFB, later weather should be:
`weather semantic state → current World Mood/FX presentation → explicit consumer modifiers`.

Examples:
- `RAIN`: visibility/fog preset + rain overlay + water/wake intensity modifier;
- `WIND`: cloud/foliage/trail modifier;
- `STORM`: lighting/fog/audio + mode-specific handling modifiers.

**Do not let each vehicle/tool implement its own weather system.**

## Batch I · Combat / hit reactions / choreography / crowd separation

### I1 · Rapier sensors/groups/events support a clean “contact candidate” layer

Official current docs:
- [Rapier Colliders](https://rapier.rs/docs/user_guides/javascript/colliders/)
- [Collision groups](https://rapier.rs/docs/user_guides/javascript/collider_collision_groups/)
- [Active events](https://rapier.rs/docs/user_guides/javascript/collider_active_events/)
- [Advanced collision detection](https://rapier.rs/docs/user_guides/javascript/advanced_collision_detection/)

Mechanisms:
- sensor colliders detect intersection without generating physical contact force;
- collision groups filter pair tests early;
- solver groups can keep contact info while suppressing solver forces;
- active collision/contact-force events are opt-in;
- contact force events can use thresholds;
- contact manifolds expose contact points/normals.

**KFB mapping: `COMBAT-MELEE-01` / later Combat adapters.**

Useful architecture:
`animation/action window → candidate sensor/sweep/contact query → Combat validates semantic hit → Combat applies damage/reaction`.

This is compatible with the existing rule that Combat keeps damage truth.

It does **not** supersede the current real swept-blade contact owner. Use only where it simplifies filtering, anticipation or trigger volumes.

### I2 · Three.js additive/cross-fade tools fit KFB semantic hit/block/reaction overlays

Source:
- [AnimationAction](https://threejs.org/docs/#api/en/animation/AnimationAction)
- [AnimationUtils](https://threejs.org/docs/#api/en/animation/AnimationUtils)
- [additive blending example](https://threejs.org/examples/#webgl_animation_skinning_additive_blending)

Mechanisms:
- `crossFadeTo`;
- `fadeIn/fadeOut`;
- `warp`;
- `AnimationUtils.makeClipAdditive`;
- `AnimationUtils.subclip`.

**KFB mapping: `TB-ANIM-01`, `COMBAT-DUEL-01`.**

Strong use case:
keep locomotion/base pose running and layer a brief upper-body hit/block/flinch additive **when the source rig/track set supports it**.

Community support:
[r/gamedev animation-blending critique](https://www.reddit.com/r/gamedev/comments/1eyu9g5/) specifically calls out partial upper/lower animation as a practical way to preserve locomotion while blocking/attacking.

Do not synthesize per-rig masks blindly; actor-family capability matrix stays authoritative.

### I3 · Crowd separation is a presentation/spacing primitive, not an AI owner

Source:
[Yuka SeparationBehavior](https://github.com/Mugen87/yuka/blob/master/src/steering/behaviors/SeparationBehavior.js) · MIT.

Mechanism:
neighbor repulsion scales inversely with distance.

**KFB use:**
- Resident Disco crowd collision/spacing;
- Town street groups;
- combat crowd presentation where Combat already chose movement targets.

Potential contract:
`owner target velocity/path + bounded local separation offset → final legal host move`.

That keeps semantic intent/pathfinding with the current owner.

Do not let separation steer Residents away from authored participation, formation or combat targets indefinitely.

### I4 · Hit reactions need visible feedback but must remain semantically typed

Community signal:
- [r/gamedev visual critique](https://www.reddit.com/r/gamedev/comments/1g2nz7h/) notes that attacks feel weak when enemies do not visibly react.
- Older/ongoing gamedev discussion repeatedly identifies hit reaction, recoil and clear feedback as disproportionately important.

KFB should represent this as typed reaction recipes, not arbitrary animation calls:
`hit.light`, `hit.heavy`, `block`, `stagger`, `knockdown`, `recover`.

Combat owns which semantic reaction happened. Animation Studio owns the best available source-backed performance per actor family.

## Checkpoint-4 synthesis

### Strongest transfers

1. **TRAVEL-BOAT-01:** exact TinySkies Boat first. Later wave response, if wanted, should sample one queryable water-height function at several hull points.
2. **TRAVEL-DRIVE-01:** Rapier ray-cast vehicle is a strong A/B donor; ecctrl ShapeCast/slip-curve ideas are optional refinements, not dependencies.
3. **TRAVEL-AIR-01:** exact TinySkies Plane first; translation state owns motion, visual bank/pitch/roll follow.
4. **WORLD-BIOME-MOOD-01:** current TinySkies `SkyPreset` already has the right multi-parameter mood shape; generic Sky/Water libraries are mechanism donors only.
5. **Weather:** one semantic weather state feeds World presentation + explicit consumer modifiers.
6. **COMBAT-MELEE-01:** use Rapier sensor/groups/events only as a filtered contact-candidate seam around current Combat truth.
7. **TB-ANIM / COMBAT-DUEL:** additive/cross-fade reactions can preserve locomotion where actor capability allows.
8. **Resident/Combat crowds:** bounded local separation offset, never a new AI/movement owner.

### Anti-patterns added

- no universal physics controller for Ground/Drive/Boat/Air;
- no full boat physics rewrite before exact TinySkies Boat parity;
- no physical collider waves as the default water model;
- no second KFB sky or water owner from generic Three.js examples;
- no weather logic duplicated per vehicle;
- no Combat damage semantics hidden inside physics events;
- no crowd-separation system allowed to become semantic pathfinding.

## Checkpoint-4 source accounting

Focused new source families/surfaces:
- current TinySkies Boat / Plane / Wake / SkyPreset / DayNight / Rain / Globe;
- current Rapier monorepo TypeScript vehicle + collision docs;
- pmndrs/ecctrl vehicle/gravity/drone/touch capabilities;
- Three.js Sky / Water2 / AnimationAction / AnimationUtils;
- Yuka SeparationBehavior;
- current/recent Reddit threads on boat buoyancy, underwater presentation, hit feedback and animation blending.

No new Production Architecture job is justified by G–I.

Next timeout-safe research block:
**J · performance/LOD/loading · K · mobile/touch authoring/controls · L · small game loops/minigame sockets/playful UI.**
