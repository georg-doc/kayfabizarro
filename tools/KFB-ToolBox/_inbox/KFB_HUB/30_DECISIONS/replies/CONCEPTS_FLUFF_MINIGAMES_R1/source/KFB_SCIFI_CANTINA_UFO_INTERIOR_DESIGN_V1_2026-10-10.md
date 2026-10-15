# KFB · Sci-Fi Cantina / UFO Interior Hub · Design v1 · 2026-10-10

**Status:** post-MVP creative planning / exact-source donor audit, NOT a tested scene or maze. **Owner:** existing KFB World/Environment/Portal/Resident/Audio + Dungeon/Tile authoring; UFO World Event owner remains `skills/chat/UFO_HUNKY_DORY_WORLD_EVENT_PREP_2026-10-06.md`.
**Branch:** `planning/kfb-fluff-crafting-almanac-ideation-2026-10-09`. **Siblings:** `KFB_FANTASY_TAVERN_OPEN_STAGE_DESIGN_V1_2026-10-10.md`, `KFB_AKASHIC_LIBRARY_ISLAND_DESIGN_V1_2026-10-10.md`.

## Scene identity / no reskin
A **semi-open Sci-Fi Cantina** echoes the fantasy tavern's social/quest role, but does not copy its rock room, lighting, social dynamics or modular topology. Cutaway docking quarter / orbital bar: asymmetric metal walls, pressure doors, consoles, bright panels, gantry rail and one performance nook, with open sides for Cartoon Acting and 3+1 encounter staging. One recognizable spaceship/mast/landing structure serves as far landmark. Inside, a dramatic counter and three different seats/formal social distances should be legible without heads-up UI. Visual tone: a comfortably dysfunctional bounty crew at the "restaurant at the end of the universe" meets alien-nightlife cabaret; Star-Wars-style social contrast is an **genre donor**, not borrowed characters/branding or scenery reconstruction.

## Source-backed assets / exact boundaries
- `registry/assets/v1/packs/kaykit-space-base-bits-1-0-free.json`: `basemodule_A/B/C/D/E`, `basemodule_garage`, `tunnel_straight_A/B`, `tunnel_diagonal_short_A/B`, `cargodepot_A/B/C`, `roofmodule_base`, `lights`, `cargo_A`, `landingpad_large/small`. These are real prefab-like meshes **not** proof of interior corridor walkability, door cutout, collision or a complete cantina bar. Use source object inspection and validate tile support / angles first.
- `registry/assets/v1/packs/scifi-ultimate-space-kit-quaternius.json`: actual `Astronaut_BarbaraTheBee`, `Astronaut_FinnTheFrog`, `Mech_BarbaraTheBee`, `Mech_FinnTheFrog`, `House_OpenBack`, `GeodesicDome`, `Connector`, `Pickup_KeyCard`, plant / ship candidates. Different Quaternius source identity must remain recognizable.
- `registry/assets/v1/packs/kaykit-restaurant-bits-1-0-free.json` has restaurant table/plates and food props, but cartoon tech bar look needs an **actual** source-visual audition, not a blind material swap.
- `skills/chat/UFO_HUNKY_DORY_WORLD_EVENT_PREP_2026-10-06.md`: Kenney Tower Defense four original UFO body candidates `enemy-ufo-a/b/c/d.glb`, source tractor beam variants `enemy-ufo-beam.glb` / `enemy-ufo-beam-burst.glb`; A/B/C/D visual selection NOT DONE. Five Kenney Platformer animated aliens are candidates only; do not invent Hunky/Dory body assignment.
- KayKit Mystery Series 2024 Combat Mech, Robot and Space Ranger; exact actor/rig/costume provenance needs source-isolated Resident Atlas review before casting them as bounty hunters. Hunky & Dory are **story identities**, not inferred from candidate alien GLBs.
- Later external 3D asset search through existing Asset Librarian for CC0/public-domain-compatible corridor/console/bookable space furniture is **optional if verified gaps remain**. License-compatible source proof before any import; no generic replacement UI/branding.

## Separate interior grammar: TARDIS-like UFO is a fantastic Dungeon
The **UFO world exterior** may be small while its *authored interior* feels improbably expansive. Use existing Dungeon Generator **connectivity/room-slot/adjoining topology** and the owner-approved Portal/Instance entry/return seam as conceptual donors, but the interior does **not** become a Dungeon Pack reskin that merely turns walls silver.
Future candidate room graph:
- beam/arrival vestibule ↔ Cantina or Mess;
- circulating fork ↔ Lord **Hunky**'s machines/control console;
- one side corridor ↔ Lady **Dory**'s private garden/soft nature habitat;
- optional Holodeck ↔ deliberately theatrical fake-world/card scenes;
- optional storage/cargo ↔ hidden crew/quest/bounty stories;
- small observation window and maintenance loop can connect uneven room sizes.
One room can redirect to a strange old dungeon, or one fantasy adventurer may treat the spaceship as an ordinary raid. **No untested indoor size illusion, full maze generator, non-Euclidean space, procedural door grammar or collision solution is claimed.** Exterior UFO/tractor beam scene is owned separately; the receiving World/Instance runtime remains authoritative for entering, safe return, persistence and any travel.

## Residents, roles, satire, performance
**Cantina first stage idea:** 3 avatars (astronaut, robot, mech pilot or alien as verified) + 1 arrival. A wandering **Adventurer Mage** can repurpose the same proven Resident/costume profile as a pompous ship expert; others misunderstand a "Bounty" as a Dungeon Quest. The **Orc Band** can perform here later with approved existing music/rig/gear, but the same traveling musician identities must persist and new cyber costumes must be source-backed.
Comic meta: the captain boasts about faster-than-light navigation yet cannot find the restroom; a bounty hunter reads a "Wanted" Card from the wrong reality; the Holodeck's fake tavern charges real Fluff; Dory's garden is the most harmonious room but blocks Hunky's approved escape route. Characters show claims through pose/gesture/eye action; avoid lifeless talking heads, never impose mandatory jokes.
**Deck source candidates:** `kosmik_kayfabizarro_sci_fi_space_opera` (56 registry cards), `platos_dungeon_raid_v05` (fantasy crossover), relevant Cosmos/Alien/Card pool members after real Registry audit. This proposal does NOT create a new ChatterBox Triplet schema or presuppose another dialog sheet.

## Reusable but not uniform construction
The same *semantic* roles recur across islands: social meeting → interruption → quest claim → player Closure, but their appearances and spatial logic vary:
Fantasy Tavern = rough rock/wood L-corner / pizza/loot / rowdy raid veterans;
Akashic Library = tall, quiet stepped stone/book stacks / study/archives / Lorekeeper and bookworms;
Sci-Fi Cantina = Schott/tech gantries and docking void / bounties/cross-species performance / orbital crew;
Vampire Lair = vertical cold tomb/tower and exposed vault / sleeping coffin;
Dystopia ritual cave = sculpted sheer cracked rock / threat-stage / Orc band.
Never force one fixed prefab onto all scenes or require all scenes be L-shaped. Open-cutaway grammar is a **view and dramaturgy choice**, not terrain-substitution permission.

## KISS future proof, no new obligations
P0 isolate real `basemodule`, `tunnel`, `House_OpenBack`, one astronaut/mech and one actual UFO model separately. P1 one cutaway Cantina with a simple real source-backed social beat and fixed camera. P2 if useful, connect ONE adjacent real corridor + ONE authored second room with existing Instance owner; prove entry/exit and walkability before more rooms. P3 cross-island guest Resident and one Deck-sourced line/music reaction. If physical model scale, collisions or source rules fail, preserve donor and do not build a second engine. No current Four-Island MVP scope change, no PR/merge, no public Stage/Site, no new runtime.
Next existing parent integration gate `MINIGAME_FLUFF_SOURCE_AND_OWNER_AUDIT`.
