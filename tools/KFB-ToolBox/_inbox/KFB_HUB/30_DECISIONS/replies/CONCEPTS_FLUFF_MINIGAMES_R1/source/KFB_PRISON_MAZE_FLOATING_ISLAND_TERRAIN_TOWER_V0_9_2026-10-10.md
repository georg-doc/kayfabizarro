# KFB Prison Maze · Floating Island Terrain & Adaptive Panopticon Tower · v0.9
Date: 2026-10-10
Status: POST-MVP CONCEPT · GEORG DESIGN DIRECTION · NO RUNTIME / DEPLOYMENT
Owner: existing KFB Island Worldbuilder Lab / Minigame/Fluff planning owner
Branch: planning/kfb-fluff-crafting-almanac-ideation-2026-10-09
Parent: skills/chat/KFB_PRISON_ISLAND_KAYFABE_PATROL_LOOP_V0_8_2026-10-09.md
Execution: post-MVP1, later Claude Design visual research only after Georg authorization.

## Creative delta from Georg
The prison is a classic floating island with a torn/wedge-shaped underside, visibly thickest toward its central mass. Instead of merely placing walls on a flat pad, exploit this depth as a deformable bowl/basin or the inverse central rise. The Panopticon watchtower is a landmark near the middle and physically/telescopically extends as the basin deepens to regain visibility across and outside the rim. Tower growth itself is potential satirical performance: the Toy Soldier's all-seeing institution repeatedly loses its own vantage point and must extend its tower.

**Non-negotiable creative intent of this concept**: a living, visibly reconfigurable maze, controlled by a Toy Soldier button from the tower, not a static procedural layout. Inmates, especially the recurring Medium Frost Orc, are close to apparent escape when corridors close, old walls descend and new walls grow from terrain. The Large Frost Orc and Survivalist are candidate escalations. The Black Knight remains elsewhere in his established bodyguard role, not the regular prisoner.

## Terrain design directions — compare rather than lock
A. **Basin / hollow cauldron**: circular rim, sloped terraces descending toward center; central tower may have telescoping sections to clear rim line of sight. Captives seen from outside above the rim, and interior camera reads both confined ground and visible sky.
B. **Inverse hill / mound**: pathways rise toward a central panopticon peak; tower sits above an actively changing maze that produces shadowed valleys and occluded routes.
C. **Mutable hybrid**: perimeter and stable anchor pads, local rings/sectors raised or lowered over time; permits limited inversion of the profile as a dramatic phase, but do not claim full island remeshing is cheap or accepted.
D. **Orthogonal topology on round footprint** as technical comparator: map a rectangular grid into an approximate circular usable area. Do not silently flatten the whole island or require square Dungeon-wall modules.
All variants retain a strongly readable torn floating-island underside, meaningful silhouette, support/contact truth and player-readable maze entrances.

## Three-layer geometry hypothesis, NOT implementation canon
1. Stable floating-island underbody: visible wedge/torn mass and protected world support/persistence.
2. Mutable upper terrain/surface: bowl/mound field, walkable paths, height changes controlled by existing World/Surface Truth.
3. Maze walls and cell/fence inserts: terrain-colored raised/extruded ribbons or sectors with seams/clay bevels; graph topology determines openings, corridors and moving walls. Existing S13.2 Dungeon cell/seam logic is an optional orthogonal donor, not a mandatory wall mesh or second World owner.
Watchtower and lantern/search cone remain attached to World-approved stable support/root; visual telescoping may be independent presentation, but actual sight lines, collision and occlusion must be recalculated by their existing owners.

## Core landmark: adaptive tower
- Central or near-central watchtower with disproportionate cannon, lighthouse-like searchlight, siren, loudspeaker, possible button console; the Toy Soldier can press the layout-change button.
- **Variable height**: visually extends with the depression of the basin so its lantern/observer clears relevant ridges. Potential theatrical choices: stacked modular shaft segments, telescopic toy sections, concertina/stretch cartoon tower.
- The humor: tower remains powerful but also maladaptive, constantly needing adjustment as the very maze it controls transforms.
- Multiple instances of Toy Soldier using same source mesh may be recolored or given small accessory changes, with one tower operator and other guards on patrol; do not replace character design/rig by default.
- Candidate source strategy: first query pinned KayKit/Kenney/registered tower, scaffold, platform, watch/lantern and spotlight parts; show actual isolated source objects; evaluate CONNECT/STACK/ANIMATE and camera silhouette. If source families insufficient, later assess licensed/generated bespoke wonky bitter cartoon tower (e.g. Meshy AI) with actual export, geometry, rig/contact, visual and rights verification. A named service/model is not acceptance proof; do not invent finished assets or force a purchase.
- Existing Tiny Skies-style beam is a LOOK/behavior donor only until source/pipeline isolated and compatible; one KFB light/VFX/Audio owner. Searchlight may reveal/occlude paths and satirically spot inmates.

## Reconfiguration choreography
Tower button → authored seed / next maze graph → validate path and collision topology → compute safe/expressive transition → visibly raise/lower ground-derived walls and affected terrace strips → update movement/navmesh/path awareness through existing owners → inmate reactions / optional ChatterBox → persist appropriate stable state.
Allow a cartoon inmate to be briefly lifted and bounce to a new walkable cell, but only with bounded collision-safe transitions, safe recovery from overlap/fall, no uncontrolled displacement through solid geometry.
Avoid constantly globally remeshing entire floating island for every maze change unless profiling proves the approach. A segmented local morph with predictable cost and reversible saved recipe is likely the more economical proof.
An apparent exit can move; avoid automatic unwinnable player loops. Player can choose free roam/observational mode and opt into coercive prison minigame rules rather than always being punished. Inmate looping can remain dark/comic and theatrical.

## Maze algorithm donor
Kevin MacLeod / Incompetech Maze Generator: https://incompetech.com/gallimaufry/incompetech-maze.html
Page describes CC0 downloadable utility; Prim, Kruskal, Wilson, Recursive Backtracker. Reuse only after actual downloadable code inspection and licensing verification. The HTML UI by itself is not a validated 3D graph implementation; mapping to ring/spoke/polar graph is its own experimental geometry step.
WhackMan / patrol / Skeleton Ghost Guards and Sisyphus-Ariadne-Minos motifs stay potential overlays.

## Visual study brief for later Claude Design (not launched)
Produce source-isolated asset contact sheet (terrain/world materials, genuine towers/props, Toy Soldier and Frost Orc meshes), then a visual side-by-side of:
- orthogonal maze in an island basin;
- radial/concentric maze inside a pronounced cauldron with height-adjusting watchtower;
- inverse central mound or morphing hybrid terrain.
For each show external island silhouette with floating torn underside, top/isometric maze, ground-level inmate view looking upward, tower sightline/beam, and a before/button/after maze reconfiguration triptych. Visuals must show actual design differences, not generic diagrams and invented source-model identity.
Keep palette KFB Clay/playmation and grimly funny; don't globally impose 2D paper print on terrain deformation and light FX.
Risk notes: tower landmark disappears behind rim, slope navigation issues, visible NPC occlusion, navmesh updates and actor rescue, tower connection seams, performance of mutable geometry, arbitrary unwinnability, rights for AI-generated or purchased assets.

## Later technical minimal proof (after MVP1)
One floating-island silhouette; one small maze section shown in orthogonal AND round/radial topology; one approved raised-ground wall language; two layouts and a button-triggered visible transition; a tower height variation tied to one basin-depth change; one inmate safely re-routed with readable behavior. Source isolate before integration. Actual save/reload of authoritative world graph and actor position. Measure render cost, collision, support, path continuity and camera views. No new global terrain engine, actor controller, tower runtime, light engine or generic maze editor.

## Recovery and authority
Read main skills/chat/START_HERE.md, CHAT_GITHUB_KFB_STAGE_WORKFLOW.md, FRESH_CHAT_SLICE_PROTOCOL.md; then parent v0.8, this v0.9, current owner Return, Four-Island Recovery/Claude Design current brief and current Island Lab head. Previous v0.8 remains an additive historical concept snapshot; its Black Knight preference is explicitly superseded by Georg's Frost Orc cast correction.
If a GitHub write times out, state UNKNOWN, inspect exact intended branch/file before retry. Only GitHub-confirmed blobs are durable repo truth. Production Control holds an additional artifact copy.
No additional main island, no new active MVP acceptance gate, no public route, no PR/merge/Live.
Single unchanged deferred next gate: MINIGAME_FLUFF_SOURCE_AND_OWNER_AUDIT, after playable MVP and explicit Georg authorization.
