# KFB Cascade Sphere – Prototype Factory Maze, KayKit R2 (WS0)

**2026-10-28. GEORG CREATIVE DIRECTION + SOURCE-AUDITED DESIGN PROPOSAL; NO RUNTIME OR PUBLIC ACCEPTANCE.**

Owner: existing KFB_HUB/WS0 Game Design and Fractal Canvas, Draft PR #435, branch planning/kfb-game-feel-comic-motion-ideation-r1-2026-10-19. Product receiver later: sole WS1/WS1b R3F World/Game host after a separate authorization. Combat owns weapons, hits and enemies; World/Terrain/Track owns physical placement/contact and movement/camera; Asset Librarian and Registry own source identity; Cards/Almanac/Save own grants; Audio owns mix; Mindscape/HyperNorm owns artistic presentation. Existing WB2 Four-Island R4 remains STOPPED / NO MVP. This is an additive refinement of the same-folder Cascade Sphere R1; no idea is silently lost or turned into accepted canon.

## 1. Playable product and core pleasure

**Working title: CASCADE SPHERE – PROTOTYPE FACTORY MAZE.** A bright KFB claymation miniature factory-city, part platformer, part reconfigurable street maze, part short strategy/defense game, with a source-real flying KayKit Combat Mech. Friendly instanced, bouncing eye-bearing Fluff units travel the machine/street network toward a landmark while Black Goo/Ink, bad routing, blocked switches or small hostile units interfere. The Mech can land at a switch, target a contaminated detachable shell, reclaim Fluff and snap one valid bridge/conduit into place. Visible causality, high-impact KFB squash/sound/clay VFX and reversible world changes are the reward. One round should last approximately 90–240 seconds, without a lecture or big HUD.

**Loop:** encounter -> select one card/module -> place/redirect -> run wave -> observe -> intervene (switch/shoot/repair) -> consequence -> remember/retry. Player sees the stream actually divert, bounce, queue or reach destination. No abstract score change in place of an event. Level 1 must make sense without advanced Combat; final product differentiator is player-controlled flight and targeted mechanical intervention.

**Modes:** Mobile = slightly tilted isometric scene with forgiving tap + drag-to-socket + swipe to orbit, one main action and one switch. Desktop = same topology/game state plus existing WS1 third-person flight/Mech interactions; never a second movement or camera runtime. A future spatial Mindscape Sphere presents the level; Open World has one world-owned entry/return and saved result. Sphere volume is not just a uniform scale adjustment: physics frame, precision, LOD, flight ceiling/contacts, mobile budget, source heights and streaming still require the World owner.

## 2. Actual three-level minimal campaign

| Level (candidate) | Local geometry | Player action | Visible win or failure | Deferred |
| --- | --- | --- | --- | --- |
| **L01 SWITCHYARD** 90–150 s | One compact KayKit City Builder road T-split, two routes, Prototype Bits floor, door/gate and target; one landmark/watertower, one source of Fluff. | Tap or land at big source-bound switch and flip one route edge. Optional place exactly one valid diverting piece. | Packet group reaches landmark; wrong route queues/bounces and can be reversed. | Weapons, grappling, Goo, City-wide generation. |
| **L02 BLACK GOO BLOCK** 120–210 s | Same maze + City Builder building A/C (withoutBase when mounted on base), workbench, one infected detachable facade/conduit cell, one repair socket. | Mech minigun hits only designated infected subcell; collect Fluff, repair/open route or choose detour. | Goo retreats from functioning node; packets flow via physical route, source building identity preserved. | Global city destruction, Goo color matching q103. |
| **L03 ROOFTOP RELAY** 150–240 s | Two elevations, Prototype Bits stairs/doorway/pads, City Builder roofs; one genuine Platformer button/checkpoint only once source imported and isolated. | Fly/land on roof station, activate a 3D button, choose one defense/route socket against up to two small hostile waves. | Defended landmark gets required actual deliveries, local evidence persists. | Grapple/swing, cinematic hordes, freely placed objects, full OSM region. |

All levels: one meaningful visible goal, at most three choice sockets, pre-authored layout, seed/retry, a clear consequence and a viable alternative. Candidate 7x7/9x9 graph dimensions are *not* literal measured building-cell dimensions. Require tests, and prefer one authored connected map over a big procedural world that looks assembled without purpose.

## 3. Dungeon Generator blueprint, maze geometry and authoring Gizmo

Verified source family:
- tools/world_atlas/source/lib/dungeon-grid.js: seeded RNG, canonical seam keys, BSP room construction, door/gate/open/rail FUGEN model.
- tools/world_atlas/source/lib/kit-lab.js: measure() actual glTF geometry, bounding boxes, module placement, loading; PACKS currently **does not include** KayKit Prototype Bits 1.1 or official Platformer; add only a thin Registry consumer mapping later.
- tools/world_atlas/source/scenes/kaykit-city.js: authentic City Builder 1.0 authored sample scene, road junctions, base/noBase rule; 1.1 richer kit available.
- tools/KFB-ToolBox/_inbox/KFB WhackMan v1-1/WHACKMAN_SESSION_2026-09-22/wm-maze.js and wm-recipe.js: MazeGraph, BFS, gates and routes, but its exported session lacks dependencies and is NOT a complete generator.
- tools/resident_atlas_s6/lib/studio.js and travel/wip/travel_globe_wsa/world-builder/wb0.js: TransformControls/Gizmo source donors for authoring only, not mobile play HUD.

**Model rule:** one canonical route graph with stable node/seam IDs, separate from visible meshes and from host-owned physical collision/support. Nodes describe valid road/room/roof/POI/goal functions; seams describe open, blocked, gate, redirect, ramp, one-way connections. When a switch flips or a valid module is attached, mark one seam and invalidate cached BFS path. Movement of Fluff packets follows the graph, with deterministic schedule; their cartoon bodies do not each need physics simulation. Each source mesh is isolated and measured before snap slots are allowed. A scene recipe stores exact source pin, ID, placed transform and connector identity. The rendered door must truly permit or block traversal; assert real physical agreement instead of relying on geometric naming.

**Generation R0:** deterministic source-backed prefab graph with 1 spawn, 1 landmark, 1 route fork, 1 switch, 2 valid routes; small seeded rotation/extras only when connectivity, clearance, switch reachability and physical support are proven. WhackMan route logic is a donor, Dungeon seam solver a donor, not two path owners. Later: City Lab real OSM streets -> clipped connected city junction graph -> gameplay constraints -> valid KFB city styling; OSM is source of street geography, not a ready fair Maze. No repeated Overpass at runtime, preserve local-meter origin, source IDs, terrain/height evidence and ODbL attribution.

**Gizmo:** authoring/God-mode uses measured snap sockets, one current editor's TransformControls, preview/undo/save, author-only export. A player gets a large physical placement hotspot, a movable ghost of the genuine part ONLY after that actual source model is confirmed, and a quick confirm; no exposed full transform/rotation/scale gizmo or separate in-game editor owner.

## 4. Gameplay state, cards, quests and strategy

Player action set P0: **SWITCH**, **SHOOT (one Mech target weapon)**, **REPAIR/PLACE (one valid socket)**, plus look/move/leave. No mandatory free-aim on mobile. If hostile waves are enabled, enemies follow limited source-backed behavior; friendly Fluff is guided, defended and redirected, not automatically exterminated.

Packet truth: stable packetId, kind, spawn, route, nodeProgress, arrival/loss/corruption status. Render bouncy Fluff spheres + small legible cartoon eyes as a performance candidate; first visual proof 8–24 agents, not a promise of 500 animated bunnies. Separate meaningful data packets from cosmetic particles. Optional actual source-backed 2.5D bunny Pop-Up cards later, with billboard orientation/depth tests. Goo is infection/obstruction state; Ink is an authored visible Card/media occlusion layer, separately reversible. No arbitrary black postprocessing that turns all scene geometry into an unreadable blob.

Quest outcome candidate: valid arrivals / eligible spawned, state of critical landmark and number of stabilized nodes; never divide by zero or equate VFX count to deliveries. Quest Die push +2/+1/0/-1 is an **experimental digital adaptation** of the analog KFB story progression, not identical scoring. Event IDs prevent double pushes. Preserve six real Story Modes: Tragic / Comic / Absurd / Heroic / Mystical / Forbidden, no invented mode colors/elements. WS0 q103 color-matching cure remains OPEN. One Actor Card + three Scene Cards + one Quest Card is a narrative/world recipe; casual play may enter with a pre-authored deck rather than requiring five cards to be manually chosen. Cards are immutable source-pinned originals from WS0 registry; illustrative technical card labels are candidates, never false canonical KFB Card IDs. Qiva may independently receive the resulting synthetic causal event stream later, but the game is not a Qiva accuracy or real-company proof.

## 5. SOURCE-AUDITED asset selection

Official pages checked on 2026-10-28:
- https://kaylousberg.itch.io/kaykit-platformer — CC0. FREE 120 unique / 370 with recolours. FREE: floors, ramps, barriers, pipes, buttons, switches, goal. EXTRA tier 170+ unique / 525 including conveyor belts, saws, bumpers, spike traps; DO NOT claim these premium bits already owned. **Full official KayKit Platformer Pack source not yet located in current KFB main media tree.** The existing media/3D_Assets/GLB_platformer contains only five separate character-o* GLBs, not proof of the official environment pack. Source intake/owner-librarian confirmation required.
- https://kaylousberg.itch.io/prototype-bits — CC0. FREE 64+. Main currently holds **85 GLTF models** with textures/binaries in media/3D_Assets/KayKit_Bits_Bundle1_1.1/Prototype Bits/Assets/gltf/. Exact candidate parts: Floor_Prototype.gltf, Primitive_Floor.gltf, Primitive_Stairs.gltf, Primitive_Doorway.gltf, Primitive_Wall.gltf, Wall_Target.gltf, Door_A.gltf, Workbench.gltf, target.gltf. Bundle has Character/Dummy.glb and animation directory. Keep 1.1 texture with 1.1 model.
- https://kaylousberg.itch.io/city-builder-bits — CC0. FREE 32+. Main holds **73 GLTF models** in media/3D_Assets/KayKit_Bits_Bundle1_1.1/City Builder Bits/Assets/gltf/. Exact candidate road_straight, road_tsplit, road_corner, road_junction, building_A_withoutBase, building_C_withoutBase, watertower, trafficlight_A, park_wall_entry. Existing 1.0 kit-lab sample documents that building_*_withoutBase belongs on a separately placed base; full building includes base. Keep correct 1.1 texture.
- Actual CombatMech.glb (KayKit Mystery Series6), CombatMech_Minigun.gltf, CombatMech_Axe.gltf and respective .bin source located. Mech flight + minigun + selective city destruction documented in original Seed World POC under tools/KFB-ToolBox/_inbox/KFB Seed World Mech Destruction POC 01/; old isolated POC checks are not new WS1 acceptance. Axe mounting/animation unverified.
- WS1 existing kfb-fluff-suck, save, actual Card surface/dialog and flight reported in ws1/combo-r2 + WS1_STATUS. WS0 V-514 flight/destruction and V-531/532/533 Goo/repair plans. Current private WS1b working head remains to be verified.
- Existing KayKit/Prototype/City Builder samples are source; Kenney Factory/Prototype kit are **alternative donor families**, not substituted for the requested KayKit identity. Do not confuse naming.

**Mandatory source-object isolation before visual integration:** (1) real City Builder road+building withoutBase, (2) real Prototype wall/door/stair/target, (3) actual Mech + Minigun and Axe separately, (4) one real official Platformer switch/ramp after asset intake. For each: exact GLTF/bin/texture/commit, bounding box/pivot/footprint/sockets, isolated 3D render at game distance, KEEP/ADAPT/REJECT/SOURCE_REQUIRED, then one authored integrated composition. A successful asset URL load is not visual proof.

## 6. Explicit tasks for later WS1 implementation (only after WS0 triage)

1. Verify current WS1b active branch, its host module API and authoritative movement/weapon/terrain/Audio/save/asset routes. No sw-mech second player controller, no parallel physics.
2. Isolate/measure sources through current Librarian/Kit Lab, extend only existing pack consumer adapter for KayKit Bits 1.1/official Platformer if imported, record source pins.
3. Implement minimal **pure, testable** Maze recipe/edge switching and packet-route simulation as a receiving host module, not new World owner; tests for connect, fail path, switch reroute, repeatability, socket bounds, no double rewards.
4. Mount L01 real source scene; verify true trigger/contact, one wave and one reroute. Capture mobile screenshot/touch test and desktop R3F run.
5. Then add L02 one hit->detachable shell->Goo state->repair->persistent result; use existing Combat/World/Audio owners. One report records real state after fresh reload.
6. L03 adds measured height/support, existing jetpack flight/landing and real Platformer switch after source import; grappling hook remains deferred. Escalate procedural OSM / Mindscape shell only after 3 authored levels and source-based acceptances.

**DoD:** Level01 90–150 s readable through existing R3F host, original sources visible and recognized, one switch changes actual route, friendly packets arrive or fail deterministically, one retry after reset matches same seed, mouse/touch controls don't steal camera and no errors. L02/L03 then each have their own acceptance and no unearned merge. Browser/mobile/GPU/screenshot tests not performed in this design turn.

## 7. Open questions, boundaries and one next gate

Questions for WS0: (A) Official Platformer FREE/EXTRA source availability and exact librarian intake; (B) source-backed 3D button mesh, large touch target + collider; (C) existing WS1b Mech weapon/flight import route; (D) exact safe destructible subcell vs untouched City Builder identity; (E) Fluff visual source with real cartoon eyes and acceptable instancing; (F) q103 Goo cure color and Quest Die semantics; (G) persistence/save actor/scene source IDs; (H) per-device visual / performance budgets; (I) if/when real OSM city shall replace authored kit topology.

**ONE NEXT GATE: WS0_SOURCE_ISOLATION_AND_LEVEL01_FIXTURE.** WS0 with Asset Librarian verifies official Platformer status and independently displays a source-real Prototype+City junction and actual Mech source, pins WS1b host, then freezes L01 SWITCHYARD's one graph, one switch, one landmark, one wave and authoritative response before authorizing one game implementation in WS1. No runtime write/Stage/Site/Cloudflare/merge/Live from this document.
