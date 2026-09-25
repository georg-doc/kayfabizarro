# KFB External Demo Research Radar · 2026-09-26

Status: **RESEARCH RUNNING · CHECKPOINT 1 / PLAN PERSISTED**  
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
