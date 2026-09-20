# Claude Design Brief · KFB WhackMan v1

Status: **EXPLORATIVE BUILD BRIEF · DUNGEON-FIRST · NO AUTO-MERGE / NO LIVE PROMOTION**  
Date: 2026-09-20  
Owner for this slice: **World Atlas / Dungeon Generator spatial + recipe owner**  
Consumer: **KFB WhackMan v1 modular mini-game candidate**

## 0 · Mission

Create a genuinely playable **KFB 3D maze-chase game** using the current repository sources.

The core loop is familiar maze-chase gameplay:

`enter maze → collect the field → avoid pursuers → trigger a temporary role reversal → whack pursuers → clear the field → exit / restart`

But the visible object must be unmistakably KFB:

- real KayKit / Tiny Treats source objects;
- real KFB cartoon motion;
- KayKit Legacy player/enemy actors;
- current EyeRig v6 after the Legacy gate;
- free orbit camera;
- original dungeon-maze composition;
- absurd/cute/offbeat pickups;
- no generic neon arcade skin, no yellow sphere, no sheet-ghost substitutes.

Do **not** recreate the original Pac-Man board, character art, sound set, typography or branded presentation. Use the classic maze-chase interaction pattern with an original KFB layout and source-backed assets.

## 0.5 · EXISTING TOOLING IS ALREADY BUILT — CONSUME, DO NOT REBUILD

This is a hard correction to the execution order.

WhackMan is **not** an asset-measurement, catalog, Dungeon-generator or editor project.

The following already exist and are source truth for this slice:

### Existing Dungeon model / measured kit truth
- `tools/world_atlas/source/KayKit_Dungeon_Model_S13.html` — measured Dungeon pack model/inventory and visual part catalogue.
- `tools/world_atlas/docs/HANDOFF_dungeon_S13.md` — explicitly says: **“Dann bauen — nicht neu messen, die Zahlen sind belegt.”**
- `tools/world_atlas/source/tools/probe-dungeon-parts.html` — original inventory probe used to establish the model.
- `tools/world_atlas/source/lib/kit-lab.js` — existing loading/measurement/audit utilities.

### Existing Dungeon generator
- `tools/world_atlas/source/KayKit_Dungeon_Generator_S13_2.html`
- `tools/world_atlas/source/lib/dungeon-grid.js`
- `tools/world_atlas/source/lib/dungeon-light.js`

It already owns:
- the seam/cell graph mental model;
- BSP layout;
- two levels;
- measured wall/corner/stair placement;
- deterministic seed/layout generation;
- audits and recipe export.

Do not write a second maze/dungeon generator before adapting its output.

### Existing editor / authoring
S14/S21 already proves:
- real Three.js `TransformControls`;
- move/rotate;
- snapping;
- floor drop;
- visible picking;
- semantic group scope;
- recipe-patch output;
- prop-adjustment → recipe-patch → reload roundtrip.

WhackMan may consume this editor/recipe seam. It must **not** implement a new TransformControls editor inside the WhackMan HTML.

### Existing asset catalogue / discovery
The central asset truth remains:
- `registry/assets/v1/`
- `tools/asset_registry/librarian/`
- pack manifests / Registry shards.

WhackMan must not create a local replacement asset catalogue, asset browser or second inventory.

### What “measure” means in this slice

The current World Atlas pages may themselves run `measure()`, `planScan()`, `openingScan()`, `wallFrame()`, etc at runtime. That is **existing owner logic** and may remain exactly as-is.

WhackMan must not copy/reimplement those functions merely to make its own HTML self-contained.

Allowed new measurement is only a named **MISSING_DELTA** when all of the following are true:
1. the exact needed asset is not covered by the current Dungeon model/Registry/owner data;
2. the missing measurement is necessary for WhackMan gameplay or placement;
3. the existing World Atlas / Librarian utility is reused where possible;
4. the result is returned to the owning catalogue/model instead of becoming WhackMan-only truth.

Default rule:

`existing catalogue / measurements / generator / editor → consume directly → add only gameplay-specific adapters`

Not:

`reload every GLTF → remeasure every part → create another catalogue → create another editor → then make the game`.

## 1 · Product value beyond this POC

WhackMan v1 is deliberately **Dungeon-first** because its useful output should survive even if the mini-game is later changed.

The reusable result is:

`Dungeon Recipe / Maze topology → MazeGraph → movement/collision → actor spawn graph → pickup slots → encounter slots`

That seam can later support:

- the KFB Dungeon Raid;
- the planned Elisa Dungeon Raid expansion;
- other KFB chase / stealth / collection mini-games;
- a later first-person / Doom-like exploration or shooter adapter while Combat keeps combat ownership;
- a later BlockBits / Voxel / Minecraft-style skin;
- Boxel Blitz / voxel dance-floor variants;
- Storytelling Maps / tabletop presentation of the same logical map.

Do not implement those later variants in v1.

## 2 · Exact source hierarchy

### Spatial / Dungeon owner

Start from the existing World Atlas Dungeon sources:

- `tools/world_atlas/source/KayKit_Dungeon_Generator_S13_2.html`
- `tools/world_atlas/source/lib/dungeon-grid.js`
- `tools/world_atlas/source/lib/dungeon-light.js`
- current S14 room/editor result from kayfabizarro Draft PR #126
- S21 RoomStudy authoring donor already pinned through PR #120 / Dropbox intake

S13.2 remains layout/topology/recipe owner.  
S14/S21 is the in-place transform/detail-authoring donor.  
Do not create another room grammar.

### Primary structural assets

Use exact registered **KayKit Dungeon** pieces for the v1 load-bearing maze:
- floors;
- walls;
- corners/intersections;
- doors/gates only where the gameplay needs them;
- torches / small readable dungeon dressing where it does not obstruct the corridor.

Tiny Treats may decorate or become pickups/power-ups, but must not silently replace the Dungeon structural contract in this first proof.

### Primary pickups

Known exact Tiny Treats Baked Goods sources include:

- `media/3D_Assets/Tiny_Treats_Baked_Goods_1.0_FREE/Assets/gltf/donut.gltf`
- `.../donut_pink.gltf`
- `.../donut_chocolate.gltf`
- adjacent cookie / croissant / cupcake / muffin sources from the same registered pack.

Use one cheap repeated collectible family plus a few large, clearly readable special treats. Do not load a unique GLTF for every pellet if instancing/cloning one verified source does the job.

### Optional Bits after exact source pin

KayKit Bits Bundle 1 is currently a WIP package on Draft PR #144.

Useful candidate families already exist there (for example City Builder walls, Prototype floors/walls and Restaurant kitchen/food props), but this is **not** permission to reconstruct missing assets.

If Claude Design cannot read the exact PR #144 source, mark Bits content `SOURCE_REQUIRED` and continue with the current Dungeon + Tiny Treats sources.

Kenney and Quaternius are second-choice donors only after the primary KFB/KayKit/Tiny Treats inventory cannot fill a proven role.

## 3 · Legacy actor truth — do not fake it

The Legacy family is a different rig architecture.

Current proven facts:

- `KayKit_AnimatedCharacter_v1.2.glb` has **6 bones** and **30 clips in one file**.
- `PrototypePete` is the actual skinned Legacy reference character embedded in that rig source.
- many other Legacy character files are **0 bones / 0 skins** and consist of separate Body / Head / ArmLeft / ArmRight parts.
- those characters must use the existing Resident Atlas `legacyAssemble()` path; they are not directly clip-bindable by loading the figure alone.

Current implementation source:

- `tools/resident_atlas_s6/lib/atlas.js`
- `LEGACY_RIG`
- `legacyAssemble()`
- exact Legacy pin/provenance recorded by Resident Atlas.

### First roster

**Player control:** start with PrototypePete because it is the proven skinned Legacy reference.

**First pursuer:** use one proven assembled Orc Warband actor (`character_orcA` or `character_orcB`) through `legacyAssemble()`.

Only after both move correctly may the slice try:
- Legacy Knight;
- Barbarian;
- Mage;
- Rogue;
- Legacy Skeletons;
- Jack/Witch;
- other Legacy actors.

Every additional actor must prove its actual parts/rig binding. A model that merely renders is not accepted.

## 4 · EyeRig gate — Legacy is not batch-approved yet

Reuse the existing EyeRig owner:

- `tools/KFB-ToolBox/kfb-rigs-embed-v3/petstudio-v9/studio-v12/pet-eye-rig.v6.js`
- Batch EyeRig briefing under `tools/KFB-ToolBox/_handover/EYE_RIG_BATCH_2026-09-18/`
- current candidate schema `kfb.eye-profile/0.1-candidate`.

Current Batch priority is:

`Rig_Medium → Rig_Large → Legacy → face grafts → Vehicle → Living Plants`

Medium and Large work does **not** prove Legacy.

Therefore WhackMan must perform one bounded **Legacy EyeRig proof** before batch use:

1. use the proven Legacy actor assembly;
2. identify Head part + Head bone;
3. measure a LegacyFaceHost from the assembled head bounds;
4. mount the existing EyeRig v6;
5. neutral eyes are open on boot;
6. pupil tracking works;
7. blink works;
8. upper/lower lid controls work;
9. optional lashes only after the eye placement itself passes;
10. save an actor-specific candidate profile.

Do not create custom eyeball geometry or a parallel eye API.

After one Player + one Whack pass Front / ¾ / Side + motion, the small POC roster may reuse the candidate pattern. That is still WhackMan evidence, not automatic global Legacy Batch approval.

## 5 · Gate A — source objects in isolation

Before gameplay composition, show these donors separately:

1. one exact Dungeon wall/floor/corner family;
2. PrototypePete running its real Legacy animation source;
3. one assembled Orc Warband character;
4. one exact Tiny Treats donut;
5. existing EyeRig v6 mounted on the first Legacy candidate only after the LegacyFaceHost proof.

Each proof records:
- path;
- revision/pin;
- **existing owner measurement/catalog reference where already available**;
- actual source identity;
- no fallback.

Do **not** remeasure the Dungeon wall/floor/corner family for Gate A. Read the existing S13 model/Handoff and show the source object. Only LegacyFaceHost and genuinely missing WhackMan-specific deltas may require new measurement.

A loaded URL is not donor proof.

## 6 · Gate B — Dungeon Maze Recipe

Do not begin with procedural maze generation.

Create one reproducible WhackMan maze **from the existing S13.2 Dungeon Generator / Recipe contract**.

Prefer adapting/selecting a deterministic S13.2-generated recipe and then using the existing S14/S21 authoring seam for bounded placement corrections. Do not hand-rebuild the Dungeon kit grammar or start a separate maze-construction engine.

Target scale:
- roughly 13–19 logical cells wide;
- multiple loops, not one corridor;
- 3–5 readable junction clusters;
- one central or off-centre Whack pen/spawn room;
- at least one wrap/teleport pair or authored shortcut;
- no dead corridor that can trap the player without intent;
- enough width for the chosen Legacy actor + camera readability.

### Required data separation

The 3D source recipe and gameplay graph must be separate:

`DungeonRecipe → derive/author MazeDefinition → MazeGraph`

MazeGraph owns only logical connectivity:

- walkable nodes;
- legal neighbors;
- spawn nodes;
- pickup nodes;
- special pickup nodes;
- pursuer home/scatter nodes;
- optional tunnel pair;
- mutable-gate nodes if the gimmick later passes.

Visible wall meshes are **not** the navigation truth.

### Collision

Collision follows logical maze occupancy / corridor constraints.

Do not make the core loop dependent on raycasting every decorative prop mesh.

Tiny Treats dressing must never become invisible collision.

## 7 · Gate C — PlayerMotor + orbit camera

Keep input, motor and camera independent:

`Input → MovementIntent → MazeMotor → player transform`

`player transform → CameraFollowTarget → OrbitControls`

Default presentation:
- third person;
- free orbit;
- no mandatory first person;
- no camera-driven player rotation side effect;
- camera collision/readability if the dungeon walls occlude the actor.

### Movement A/B

Preferred default for this POC:

**camera-relative corridor steering**
- WASD / arrows produce a horizontal camera-relative intent;
- at a decision node, the intent resolves to a legal MazeGraph direction;
- the actor turns toward the chosen corridor;
- buffered turns are allowed shortly before an intersection;
- no diagonal corridor clipping.

Also expose one developer A/B:
**character-relative steering**, inspired by the public `butchler/Pacman-3D` control idea.

The external repository is **reference-only in this slice**. Do not vendor/copy its code unless license/source review is separately pinned.

No first-person mode in v1. Preserve the PlayerMotor / Camera split so a later FPS adapter is possible.

## 8 · Core game loop

Implement only after Gates A–C are visibly green.

States:

`READY → PLAYING → POWERED → HIT/RESPAWN → CLEAR → RESTART`

Pursuer modes:

`CHASE · SCATTER · FRIGHTENED · RETURNING`

Minimum:
- 1 player;
- 3 pursuers after the one-pursuer proof;
- regular pickups;
- 4-ish special power pickups;
- score/count;
- one clear/restart loop;
- one hit/respawn loop.

No lives economy, meta shop, multiplayer, quests or progression system in v1.

### Pursuer profiles

Do not recolor four identical brains.

Use simple, legible target policies, for example:

- **Interceptor** — targets a few nodes ahead of the player's current corridor.
- **Pressure** — shortest path to player.
- **Forager** — biases toward a dense remaining-pickup cluster that is near the player.

Keep the actual names editable and KFB-specific; behavior must be understandable from play.

Eyes reinforce behavior:
- Interceptor looks ahead;
- Pressure fixes the player;
- Forager glances between player and pickup cluster;
- Frightened state changes lid/pupil/whole-body acting.

Pathfinding runs on MazeGraph, not decorative meshes.

## 9 · Pickups and living props

Every pickup family has:
- source path;
- gameplay role;
- silhouette;
- idle motion;
- collect anticipation/impact/recovery;
- no random continuous noise.

Regular collectible:
- cheap repeated/instanced object;
- small bob/turn;
- quick squash/pop on collection.

Special treats:
- large Tiny Treats donut/cupcake/etc;
- easy to identify at an orbit-camera angle;
- stronger KFB motion + SFX/VFX;
- triggers POWERED / Whack state.

## 10 · Three story-worthy KFB mechanics

These are **after the core loop works**. Implement all three only if the stable core remains readable.

### G1 · Witness Treats

Four or fewer special uneaten treats act as unreliable danger tellers.

Version 1 should not invent a second prop EyeRig. Their **whole body** can tip/turn toward a nearby pursuer.

If the existing EyeRig can later be mounted through a proven zero-bone/FaceHost seam, eyes may replace the body-direction cue.

The tell is intentionally imperfect:
- useful;
- readable;
- not an exact radar.

### G2 · The Whack Window

POWERED mode is not only “enemy changes color”.

Canonical gameplay remains MazeGraph state.

Presentation adds a short, exaggerated KFB whack:
- anticipation;
- contact;
- squash / recoil / little launch or spin;
- short impact VFX/SFX;
- recovery;
- pursuer continues from its authoritative RETURNING state.

This borrows the useful **state-vs-theatre separation** already documented in the Storytelling Maps / Ludo Wala benchmark: spectacle may be wild while canonical game state remains deterministic.

No physics impulse is allowed to corrupt the logical maze node.

### G3 · The Maze Remembers

One or two authored Dungeon recipe gates can switch after collecting a rare Story Bit:

- shortcut opens;
- another short route closes;
- topology change is deterministic and reversible;
- change occurs only when no actor occupies the affected cells;
- MazeGraph and visible Dungeon recipe update together.

This is the highest-value experimental mechanic because the same seam can later feed Dungeon Raid, quests and authored World instances.

Do not turn this into a procedural maze generator yet.

## 11 · Visual direction

KFB dungeon toybox, not retro-neon arcade.

Required:
- real KayKit structural identity visible;
- Tiny Treats read as deliberately misplaced edible treasure/contraband;
- actors large enough that eyes and body acting matter;
- readable floor/wall contrast;
- restrained HUD;
- orbit camera must preserve corridor legibility.

Avoid:
- glowing cyan grid;
- generic sci-fi maze;
- flat yellow Pac-Man proxy;
- translucent sheet ghosts;
- pixel-font nostalgia as the main identity;
- random bloom everywhere;
- giant explanatory panels.

No UI element without a gameplay purpose.

## 12 · Animation / acting

Use `skills/kfb-cartoon-animation_v2.md`.

All important actions follow:

`cause → anticipation → action → impact → follow-through → recovery`

Player:
- idle;
- locomotion;
- turn anticipation;
- pickup hit;
- powered swagger/reaction;
- hit/respawn.

Pursuers:
- locomotion;
- target/look behavior;
- frightened body acting;
- whack hit;
- returning recovery.

Do not animate only the eyes.

## 13 · Audio / VFX

Reuse central KFB assets where already suitable.

Do not source classic Pac-Man sounds.

Minimum semantic cues:
- regular pickup;
- special treat;
- player hit;
- whack contact;
- clear.

One event-defining cue first; optional support; then silence.

VFX is punctuation, not a permanent particle field.

## 14 · Dungeon editor reuse

The S21/S14 in-place editor is **already built and proven**. Reuse it for:
- wall/prop alignment;
- spawn markers;
- pickup anchors;
- ghost-home layout;
- testing the two mutable-gate objects.

But:
- Dungeon recipe remains source truth;
- editor scratch/cache does not become gameplay truth;
- MazeDefinition/MazeGraph is exported data, not hidden editor state.

A successful WhackMan authoring roundtrip should make the Dungeon tool better for later Raid work.

## 15 · Source fallback rule

Order:

1. current KayKit / KFB sources;
2. Tiny Treats;
3. KayKit Bits only when exact PR source is accessible;
4. Kenney;
5. Quaternius;
6. `MISSING_ASSET`.

If a required visible object is missing:
- inspect at least three real donor candidates;
- use `kfb-frankensteining_v1.md`;
- measure before cutting/assembling;
- no visible primitive larger than the skill allows;
- show donor object in isolation before integration.

Never substitute a generic cube wall, sphere character or placeholder ghost.

## 16 · Out of scope / future crossovers

Record, do not build:

### FPS / Doom-like adapter
Same DungeonRecipe/MazeGraph; first-person camera and weapon/combat input later. Combat ownership comes from the current Combat Arena, not WhackMan.

### GTA-like KFB satire / meta narration
Future World/Resident/ChatterBox layer, not maze core.

### BlockBits / Voxel skin
Future renderer/theme using:
`media/3D_Assets/KayKit_BlockBits_1.0_FREE`

Same MazeDefinition; different structural renderer. This is the path toward Minecraft-like building, Boxel Blitz and voxel dance-floor crossovers.

### Storytelling Maps / Ludo-Wala-like tabletop
Future map/board presentation of the same logical maze. Storytelling Maps remains presentation/timeline owner and waits for its current CardRig gate.

### DocCheck skin
Future content/visual skin after the KFB gameplay module is stable. Do not invent medical content for this gate.

## 17 · Three mandatory stop gates

### STOP GATE 1 · Dungeon identity
PASS only if the maze is visibly made from the named Dungeon donor pieces and corridors are playable/readable.

### STOP GATE 2 · Legacy actor truth
PASS only if PrototypePete + one assembled Legacy pursuer move with the actual Legacy rig architecture. No standing 0-bone figure sold as animated.

### STOP GATE 3 · Legacy EyeRig
PASS only if Player + first pursuer show correctly scaled/aligned EyeRig v6 in Front / ¾ / Side and during locomotion, with tracking + blink + lids.

If any gate fails twice:
- freeze;
- export;
- use `CLAUDE_DESIGN_FAILURE_RECOVERY_EXPORT.md`;
- do not spend a third pass on the same foundation.

Only after all three pass should Claude finish the full one-level game.

## 18 · Required evidence

### Donor evidence
- isolated screenshots for each required core donor;
- for Dungeon parts, cite the existing `KayKit_Dungeon_Model_S13.html` / Handoff measurement instead of producing a new measurement report.

### Integrated visual evidence
- top/oblique maze overview;
- player-height/orbit corridor view;
- Player + first pursuer EyeRig contact sheet;
- powered/Whack event;
- clear state;
- mobile/narrow screenshot if the environment supports it.

### Gameplay checks
At minimum record:
- maze boots;
- every walkable graph node reachable as intended;
- no wall traversal;
- buffered turn at junction;
- all regular pickups collectible;
- special pickup enters POWERED;
- pursuer switches to frightened;
- whack sends pursuer to RETURNING without corrupting MazeGraph;
- player hit/respawn;
- level clear/restart;
- camera orbit does not change canonical movement state;
- 0 missing required assets;
- browser console/resource errors.

Do not invent test counts.

## 19 · Claude Design deliverable

Export a complete editable candidate, not screenshots only.

Required:

- source;
- data;
- `MAZE_DEFINITION.json`;
- `DUNGEON_RECIPE.json` or equivalent current owner format;
- `ACTOR_PROFILES.json`;
- Legacy EyeRig candidate profiles;
- `SOURCE.json`;
- `TEST_REPORT.md`;
- `RETURN.md`;
- additive changelog;
- evidence screenshots;
- asset/reference manifest;
- start instructions.

Recommended candidate implementation path if the current owner has no narrower established WhackMan consumer folder:

`tools/world_atlas/minigames/whackman-v1/`

Do not create that folder if current GitHub state already provides a named receiving location; current owner state wins.

## 20 · Planned branch / Stage contract

Claude Design export is an intake candidate.

Receiving Git branch after source review:
`claude/whackman-v1-dungeon-maze-2026-09-20`

Human Stage target:
`https://kayfabizarro.pages.dev/kfb-hub/stage/minigames/whackman-v1/`

No GitHub Pages / githack / raw-CDN human acceptance route.

No auto-merge. No Live promotion.

## 21 · One acceptance question

**Does this feel like a small living KFB dungeon game that happens to have a brilliant maze-chase loop — rather than a Pac-Man clone wearing KayKit props?**
