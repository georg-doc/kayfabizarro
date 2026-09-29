# CLAUDE DESIGN FREEFORM EXPLORATION · JOYRIDE MAP / TOY WORLD 01

**Status:** READY OPTIONAL PARALLEL EXPLORATION · DESIGN ONLY · NO RUNTIME OWNERSHIP
**Date:** 2026-09-29
**Provider:** Claude Design
**Parent:** `CLAUDE_DESIGN_BRIEF_JOYRIDE_WORLD_01.md`
**Style:** `KFB_HANDMADE_TOY_WORLD_STYLE_BIBLE_v0_1.md`

## Why this exists

The core JOYRIDE-WORLD-01 brief is intentionally constrained.

This companion brief does the opposite: **test Claude Design's visual/spatial creativity inside hard KFB technical boundaries**.

Do not solve locomotion, physics, camera, deployment or runtime architecture. Instead, ask:

> If the KFB world is a handmade toy box and the player primarily wants to travel for fun, what is the most distinctive, performant world form we can build from the assets, roads, board-game props, maps and material systems we already own?

The answer does not have to look like a conventional open world.

## Product constants

Must remain true:
- Joyride / travel fun matters more than racing.
- The player may cruise slowly or drive wildly.
- Stunts, bounce, flips, loops and destruction are welcome.
- Residents / Cards / encounters punctuate travel.
- Characters and hero props remain clay-first / stop-motion-puppet compatible.
- World structures may use any coherent handmade craft material.
- Geometry should be performance-conscious.
- Existing tracks / roads / stunt pieces are reusable kinetic attractions.
- One future runtime owner; this design pass creates no new engine.

## Creative permission

You may freely combine:
- clay;
- cardboard;
- paper;
- felt / fabric;
- wood / craft sticks;
- toy plastic;
- bottle caps;
- dice;
- pawns / meeples;
- dominoes;
- card standees;
- stacked game pieces;
- cards as architecture;
- pop-up-book structures;
- low-poly / computed terrain;
- voxel / stepped relief;
- oversized landmarks;
- surreal scale compression.

The world may visibly look like a game table, diorama, travelling theatre set, giant collage map, toy railway landscape or impossible handmade atlas.

Do not default to a normal videogame town with a clay shader.

## Existing Story / Tactical donor · reuse, do not fork

Read:
`tools/KFB-ToolBox/_handover/CLAUDE_DESIGN_WORLD_RACER_2026-09-22/STORYTELLING_MAP_WORLD_DONOR_2026-09-22.md`

Key existing decisions:
- Storytelling / Tactical views are **representations of World Recipe data**, not separate world runtimes.
- Canonical geography / semantic IDs remain truth; presentation may raise, fold, exaggerate or animate pieces.
- Existing camera roles: FLAT / TABLE / FLYOVER / POP-UP.
- Existing relief donor rasterizes geography, preserves water holes, and supports stepped D6-height terrain.
- Existing BoardGameBits include meeples, pawns, dice, flags and buildings.
- Existing Domino donor proves real toppling chains.
- Tactical / Story map may exaggerate and animate without changing world state.

Use these as a vocabulary.

## Exploration challenge

Develop **three genuinely different spatial interpretations** of the same KFB Joyride fantasy.

Do not produce three palette swaps.

### Direction A · Handmade Stunt Diorama
A compact physical landscape:
- roads / stunt strips / bridges / loops;
- clay terrain + cardboard/wood/felt structures;
- Resident pockets and destruction toys.

### Direction B · Storytelling Board World
The player drives **on the map itself**:
- flat / shallow-relief handmade map;
- roads drawn/laid onto the board;
- countries/regions become physical pieces;
- giant standees / cards / landmarks;
- board-game props become world-scale structures;
- geography may be heavily compressed.

Example thought experiment:
**France is a 1–2 minute drive across; Paris is marked by a surreal oversized Eiffel-Tower toy; Residents occupy country/region nodes; roads connect narrative places rather than reproduce literal geography.**

This is not a requirement to build France specifically. It defines the allowed scale logic.

### Direction C · Hybrid Pop-Up / Atlas World
The road moves across a mostly planar toy-map, but selected destinations rise into:
- pop-up cardboard cities;
- voxel/relief hills;
- clay stunt islands;
- Resident dioramas;
- portals / books / cards / toy landmarks.

The player can visually read both **map context** and **local playful depth**.

## The key design question

Can we make the **map itself the open world**?

Instead of:
`map menu → load world`

consider:
`map = world surface → road = journey → landmark/Resident = physical encounter`

The Tactical / Story view could later simply pull the camera upward and change presentation state rather than leaving the world.

Do not implement that runtime in this design pass. Explore whether the spatial language supports it.

## Existing road / stunt inputs

Read and reuse before inventing:
- `georg-doc/KFB-Stunt-Car-Race` main;
- Free Roam S04 / `site/world.js`;
- Road Family Atlas;
- existing Racing / City / Toy Narrow / Toy Wide / Bridge / Dirt families;
- existing loops / ramps / garage / bypass / curve vocabulary.

Treat Race-specific markings, barriers and start/finish as optional overlays.

The underlying road / stunt forms are the asset.

## Existing asset inputs

Use the real available KFB/KayKit/Kenney/Tiny Treats/BoardGameBits catalog.

Do not invent substitute branding or generic placeholder props when a source object exists.

Donor rule:
1. source object isolated;
2. translated material/look isolated;
3. integrated use.

BoardGameBits and Domino modules are especially encouraged where they solve structure cheaply.

## Performance challenge

Each concept must explain **why it could be cheaper than a conventional asset-heavy open world**.

Prefer:
- broad computed surfaces;
- shallow relief;
- instanced repeated pieces;
- simple silhouettes;
- reusable road splines;
- landmark exaggeration instead of dense city detail;
- visual scale compression;
- hero detail only at encounter pockets;
- cheap far-field board/map presentation.

Do not make R0A's expensive full-K2-everywhere preview the baseline.

## Material challenge

Use material identity to turn cheap forms into intentional craft objects.

Examples:
- flat country polygon → layered cut cardboard;
- road strip → painted tape / clay ribbon / stitched felt strip;
- low-poly mountain → crumpled paper / papier-mâché / clay lump;
- skyscraper block → stacked boardgame tower;
- fence → domino line / craft sticks;
- billboard → KFB card on a stand;
- lake → glossy cellophane / resin-like toy insert / cut-paper hole;
- trees → felt balls / clay spheres / sponge / model-railway flock;
- tunnel → cardboard tube / toy arch / punched map hole.

## Motion / life challenge

For each concept, annotate a few examples of:
- STATIC;
- AMBIENT_REACTIVE;
- SCRIPTED_REACTIVE;
- PHYSICS_HERO.

The world should look like it can breathe, wobble, topple and rebuild without requiring full simulation everywhere.

## Scale and geography

Literal geographic scale is not required.

Allowed:
- narrative compression;
- exaggerated landmarks;
- country/region-as-biome;
- impossible adjacency when clearly part of KFB's storytelling map logic;
- routes that privilege story, rhythm and travel feel over cartographic accuracy.

But:
- semantic IDs / source identity should remain recoverable in the recipe;
- do not silently call stylised relief factual topography.

## Deliverable

First produce:
1. three compact concept directions A/B/C;
2. one comparison sheet/table covering:
   - travel feel;
   - stunt potential;
   - Resident/Card integration;
   - handmade identity;
   - expected performance;
   - reuse of current tracks/assets;
   - scalability;
3. select **one** direction for a bounded editable 3D composition;
4. build only one representative chunk;
5. return a declarative recipe / manifest as the authoritative artifact.

The final chunk should be small enough that the receiving runtime can later reproduce it without importing a monolithic scene.

## Free-for-all rule

Within the constraints above, **do not imitate our existing screenshots by default**.

Surprise us.

The experiment succeeds if Claude proposes a world form that:
- feels unmistakably KFB;
- makes our current limitations useful;
- is fun to imagine driving through;
- plausibly runs better than the asset-heavy alternatives;
- reuses rather than discards our existing work.

## Hard boundaries

Do not:
- modify Turbo/Joyride runtime;
- modify Locomotion / Flight;
- modify Kart physics;
- create Race logic;
- create new World ownership;
- create a second StoryMap runtime;
- create a second asset library;
- mass-generate placeholder assets;
- use TinySkies code;
- make cartographic accuracy a blocking goal.

## Compact Claude Design start

> Run **KFB JOYRIDE MAP / TOY WORLD 01** as a freeform visual-spatial exploration, not a runtime build. Read the Handmade Toy-World Style Bible, JOYRIDE-WORLD-01 brief, Free Roam S04/Road Family donors and the existing Storytelling Map → World/Tactical donor note. Keep one World Recipe truth and treat Story/Tactical/Playable views as possible representations, not separate engines. Explore three genuinely different forms: A handmade stunt diorama, B a driveable storytelling board/map with compressed geography and oversized landmarks, and C a hybrid pop-up/atlas world where selected areas rise into local dioramas. Reuse real KFB roads, tracks, assets, BoardGameBits, dominoes and material donors before inventing anything. Characters/hero props stay clay-first; the world may mix cardboard, paper, wood, felt, fabric, toy plastic, bottle caps and game pieces. Prefer simple/procedural/instanced geometry and explain why each concept is performant. Then choose one direction and build one small editable representative chunk plus a declarative recipe. No Locomotion, Flight, Kart physics, Race, WFC, new renderer or new World owner. Surprise us inside those boundaries.
