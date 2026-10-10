# KFB Prison Maze · Panopticon Tower Donor Priority v1.0 · 2026-10-10
Status: POST-MVP DESIGN RESEARCH / PLAN ONLY · NO RUNTIME / SITE DEPLOYMENT
Owner: existing KFB Island Worldbuilder Lab / Minigame-Fluff concept lane
Branch: planning/kfb-fluff-crafting-almanac-ideation-2026-10-09
Parent: skills/chat/KFB_PRISON_MAZE_FLOATING_ISLAND_TERRAIN_TOWER_V0_9_2026-10-10.md

## Georg decision — prioritized source candidates
1. **Kenney Tower Defense Kit — preferred PRIMARY.** Its modular round/square base, lower/middle/build/top/roof parts can support variable height and a coherent watchtower. Cannon and catapult are available candidate silhouette accents. Combine parts where meaningful; no new tower system.
2. **Kenney Pirate Kit — SECONDARY, optional Frankenstein composition.** Seek larger watch platform, wraparound parapet/rundlauf, rail, lookout or structural upper deck. User reports a modular tower, but verify exact models by real source isolation before claiming usable connection, dimensions or geometry.
3. **KayKit Medieval Hexagon — TERTIARY visual/composition donor.** The World Atlas S11 source confirms building_tower_A/B_{blue,green,red,yellow}; reference/contact sheets may depict more than actually available in the FREE tier. Verify any other tower or platform against pinned rights and exact source.
Not a contest to use all packs: an intact high-quality Tower Defense assembly may win outright. Mixed-pack tower is allowed when it materially improves the silhouette, not required.

## Current GitHub asset evidence
- Tower Defense registry: `registry/assets/v1/packs/kenney-tower-defense-kit.json` on main (observed blob `9ac07880baf32b0ec3e0f9a540e8dc48547def52`). Verified names include `tower-round-base.glb`, `tower-round-bottom-a/b/c.glb`, `tower-round-middle-a/b/c.glb`, `tower-round-build-a..f.glb`, `tower-round-top-a/b/c.glb`, `tower-round-roof-a/b/c.glb`; matching `tower-square-*` component families, `weapon-cannon.glb`, `weapon-catapult.glb`. This is **registry evidence**, not isolated visual proof or a measured working stack.
- Pirate source folder: `media/3D_Assets/GLB_pirate/`; travel source lists 72 named models from Kenney Pirate kit. Exact modular tower pieces and platform/railing geometry need an isolated inventory/inspection.
- KayKit: `tools/world_atlas/docs/PACK_GAPS.md` §6 confirms four-color building_tower_A and building_tower_B source candidates; Free versus Extra differences remain real. Their precise compatibility with Kenney components is not established.

## Desired Panopticon form and interaction
- Round tower shaft, physically legible modular vertical extension or telescoping insert, stable tower footing on the floating island.
- Enlarged observation crown/platform with guard circulation, railing and one Toy Soldier at the layout-reconfiguration button.
- The tower grows as the bowl sinks or as raised terrain obscures lines of sight. This is character performance as well as silhouette/readability.
- Oversized cartoon cannon/catapult and lighthouse/searchlight cone optional, not mandatory to shoot.
- Additional identical source Toy Soldiers with subtle uniform variants may occupy gate or patrol positions. Never silently replace or modify their authored rig.
- Recolored/clay-treated material palette, intentional wonkiness and cartoon deformation/decimation as **non-destructive approved visual adaptation**; keep real donor identity visible. Do not conflate decimation with texture styling.
- Frankensteining accepted: irregular toy scale, slight stylistic mismatch can be purposeful. Structural connection, visual mass, contact, walkability and railing clearance must still be proven. A shared KFB material pass can visually bind mismatched packs without overwriting source identity.

## Exact visual isolation sequence — before assembly
A. Kenney TD complete tower-round and tower-square subset individually (base, lower, middle, build, top, roof); weapon-cannon and weapon-catapult individually.
B. Kenney Pirate candidate modular tower / watch deck / railing individually with filenames, bounding boxes, pivots, material channels.
C. KayKit Medieval Hexagon tower A/B in at least one existing color each; note extra/missing parts honestly.
For each candidate: source path and registry ID, rights/pin, actual rendered 3D object, scale, pivot, contact, approximate draw cost, collision and build socket assumptions. A successful asset URL alone is NOT visual isolation.
Only then compare:
- **T1** Kenney Tower Defense only, rounded telescopic tower;
- **T2** Tower Defense shaft + Pirate broad lookout crown;
- **T3** KayKit Hexagon tower platform/silhouette donor where source-compatible.
Compare at equal viewing angles and inside **the same floating-basin maze**, with low- and high-tower states. Use two viewpoints: prisoner looking upward and outside island / rim looking across the bowl. Test searchlight occlusion and whether the top remains readable above the rim.
Do not create a new tower builder runtime, new asset bank, replacement branding or dummy geometry.

## Layout/interaction coupling (later technical hypothesis)
Read current World/Surface, Structure Recipe, Build/Destroy, ChatterBox, VFX/Audio and persistence owner contracts before implementing. Tower height is derived from observed/reasoned visibility and a World-authorized change, not an unchecked arbitrary animation that leaves collision or player access behind.
- stable tower root / footing;
- source-based repeatable vertical inserts or telescopic parts;
- top crown moves up; stairs/ladders/lift are an actual later traversal question, not a free assumption;
- use already-owned searchlight and actor movement seams;
- no new physics/camera/light writers.
Optional bespoke AI-generated wonky tower may be evaluated later only if source-verified kit variants fail the visual test.

## Scope / next gate
Current Four-Island R4 STOP, A/B visual gate and future MVP remain unchanged. Concept only, no browser 3D, no donor visual isolation, no runtime, no public Stage/Site, no automatic merge.
The one existing later minigame gate stays `MINIGAME_FLUFF_SOURCE_AND_OWNER_AUDIT`, after playable MVP and Georg's explicit go-ahead. Include this ordered tower donor audit as a subsection, not an additional gate.
Recovery: current GitHub START_HERE + workflow + Fresh protocol → current Fluff Return → Prison v0.8 → Terrain/Tower v0.9 → this v1.0 → actual donor registries + current Island Lab branch.
