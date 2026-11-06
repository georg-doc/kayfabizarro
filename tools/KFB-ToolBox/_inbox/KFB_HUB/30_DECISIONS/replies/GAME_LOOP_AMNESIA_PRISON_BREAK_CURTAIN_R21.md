# KFB Game Loop R21 · The Amnesia Protocol / Prison Break / Physical Curtain
Date: 2026-11-01 · Owner: Georg / WS0 creative steering via existing KFB_HUB `30_DECISIONS/replies` concept lane · **PROPOSAL / SOURCE-AUDITED / NO RUNTIME**

## 0 · Product-level reading
A strong opening for **Universe in a Nutshell** and **You choose something. Ride the consequences**: the player wakes without reliable personal memory in a **small prison cell**. An imprisoned Clown offers a real Anti-Rules Card, a rule-bound Toy Soldier is an optional obstacle, and a short rearranging corridor leads into the pre-existing Open World. The scene must work as a goofy, tactile, satisfying game first; its Plato-cave/HyperNormalisation/authority themes are optional interpretations, not an explanatory tutorial or proof of the conspiracy.

**Georg's explicit visual correction:** an animated **heavy full-screen curtain**, not the current unfinished clay diorama/stage or decorative frame; **NO SVG/CSS curtain stand-in**, no generic splash UI, no substitute branding. The curtain is a physical *loading cover* and can also host small Actor/atmosphere choices without revealing a cheap parallel stage. Do not build a second curtain engine. The player choice should be optional, default FrizzleBob when source validated.

## 1 · Fictional frame without imposing ultimate cause
The protagonist *may suspect* that amnesia follows a HyperNormalisation Sphere, Men in Black/Black Fluffer/Academy experiments, surveillance, Panopticon-style influence or MKULTRA-like coercive conditioning. These are **attributed in-universe interpretations, propaganda or fragmented memories**, not settled cosmic chronology or a claim about current actual institutions. A character may give mutually incompatible explanations. The acronym “QED” is present in Georg's verbal proposal but **its exact faction/product referent is not source-verified here**; do not silently install it as canon.

Possible Clown arrest reason: **lèse-majesté / insulting the monarch**. This is a good authoring seed for a comic character, not a newly verified Clown backstory. The Clown may be helpful, manipulative, misunderstood or unserious; neither he nor the guard is the philosophy teacher. Dissonance is felt through physical events and character behavior. A safe escape is possible even if the player ignores all lore.

## 2 · Minimal first-run experience (proposal, not a mandatory scripted lesson)
1. **CURTAIN / LOAD / CHOOSE:** existing physical cloth covers **the entire view** during real loading; optional two choices (“I woke up as…” FrizzleBob / *proposed* Skeleton Warrior, and stormy night / sunny afternoon). One genuine Enter gesture opens it. Audio from the current single Audio owner begins only when allowed after user interaction; accessible mute and progress/fallback. No imported Clay stage/plaques as UI. An existing r3 curtain candidate **did include a wooden proscenium** and received Georg PASS then; today's full-screen textile-only instruction is a **new visual supersession for this introduction**, requiring separate acceptance.
2. **AMNESIA / CELL:** source-built small prison room, readable light/exit and player movement using current Ground owner. Clown is another prisoner and the first meaningful Resident. No lengthy monologue.
3. **FIRST REAL ANTI-RULES CARD:** Clown presents `anti_rules_toolkit:1`, **The Rules Lawyer** (registered, mappingVerified:true, page 2 quadrant 0). Actual authored `power`: challenge someone to cite a nonexistent rule. Use as *comic inspiration for the situation* with the rule-bound guard, **not** automatic rule-book enforcement or a guaranteed win key. One canonical Card object + one first-acquisition/provenance receipt + Almanac; no cloned Card when later delivered. Card is viewable independently of Clown's spin.
4. **TOY SOLDIER / SMALL ESCAPE:** one actual KayKit Toy Soldier guard (source `media/3D_Assets/KayKit_Mystery_Series6/6 - December 2025 - Toy Soldier/ToySoldier.glb`, Rig_Medium Resident Atlas lineage). An interaction can deflect a rule, distract the guard, provoke a small prop event or let the player take an already visible alternative exit. No mandatory battle/complex puzzle; the guard remains a fallible character and may remember what happened.
5. **TINY CHANGING CORRIDOR → OPEN WORLD:** a short, bounded, aesthetically strange maze/traversal: Toy Soldier may visibly rotate/slide a wall or reroute one corridor. Never shuffle the floor beneath the player, never trap them permanently, preserve the actual valid route and collision topology and a reset/accessible escape. Player emerges into existing WB2/Town/Open World; daylight and scope contrast make the reveal rewarding. Radio, compass, bag, lantern, optional Taxi and later car/jetpack are gradually discovered, not forced tutorial loot.

The new intro should ideally remain short, skip-friendly and replayable; the real Card, social encounter and open-world entry matter more than winning a puzzle. The prison is an **instance/threshold candidate** only under existing WB2 and Save/world state ownership, not a separate dungeon runtime.

## 3 · Source inventory / reuse boundaries
### Actual Dungeon / Cell
- **World Atlas S13.2**: `tools/world_atlas/source/KayKit_Dungeon_Generator_S13_2.html`, `lib/dungeon-grid.js`, `lib/dungeon-light.js`, `docs/HANDOFF_dungeon_S13.md`: measured KayKit room/edge/geometry generator and reusable authoring donor. It is **not** proof that a productive first-person prison escape is already present. Later Dungeon v2 brief `skills/chat/workflows/KFB_MODULAR_MINIGAME_HUB_2026-09-19/DUNGEON_GENERATOR_V2_BRIEF.md` explicitly says **IMPLEMENTATION NOT STARTED**, and retains S13.2 as geometry owner, Combat Arena separately.
- **Room Study S21/S22 R09 “Zellen”** in `tools/KFB-ToolBox/_inbox/KayKit_Room_Study_S21/S22_RoomStudy_Handover/lib/room-recipes.js`: concrete source-backed gated-wall room. A room-study source, **not already a loaded World prison**. Isolate and render original R09 scene/prop **unchanged before integration**, test actual walls, gates, floor contact and character scale.
- **WhackMan MazeGraph** in `tools/KFB-ToolBox/_inbox/KFB WhackMan v1-1/WHACKMAN_SESSION_2026-09-22/wm-maze.js`: candidate **connectivity audit/graph lesson**, not an authorized movement owner, dungeon generator or solver to copy into WS1. Use S13.2 for source composition; current World/physics is sole collision/traversal owner. “Gizmo Maze” exact current product/source is not verified.

### Curtain and stack
- Current **Theatre Curtain recovery r3** donor packet: `tools/KFB-ToolBox/_inbox/KFB Theatre Curtain Recovery Board/KFB_THEATRE_CURTAIN_RECOVERY_SESSION_2026-10-07/tools/KFB-ToolBox/_inbox/KFB_THEATRE_CURTAIN_RECOVERY_CLAUDE_DESIGN_2026-10-07/` with `candidate/kfb-curtain-core.js`, `KEEP_TUNE_REJECT.md`, `RETURN.md`. Georg **PASS** for r3 source candidate (not an Open World integration PASS); isolated WebGPU (Three.js) cloth/pleats/weight shown and some WebGL/mobile fallback questions still open. Its rejected list explicitly excludes CSS/SVG/video curtains, flat panels, plaques/wordmark overlays and second simulation owner.
- Earlier `KFB Theatre Curtain v2.html` derives from `mrdoob/three.js` **`examples/webgpu_compute_cloth.html`**. **Three.js with WebGPU compute is the relevant technology**, not SVG. WebGPU/renderer interoperability with the active WB2 host needs a separate owner-side technical gate; do not claim “Three.js alone already works in the current stack.”
- User's revised **fullscreen cloth-only view** supersedes the optional proscenium/stage look **for the intro**, retaining source physical behavior but requiring visual re-review. Loading facts remain real. Character selector already has FrizzleBob target, Mannequin Medium fallback and Black Knight Large; Skeleton Warrior is a newly proposed player target requiring source rig/source motion proof.

### Actor and Card
- Toy Soldier is an existing Registry/Resident Atlas source with Rig_Medium; present donor scene **does not prove guard dialogue, patrol and cell-key interaction**.
- `registry/assets/v1/decks/anti_rules_toolkit.json`: real `anti_rules_toolkit:1` The Rules Lawyer (PDF mapped). Do not fabricate replacement Card art or assert any custom new Power/Lore.
- `skills/chat/workflows/KFB_PLAYABLE_MVP_CONSOLIDATION_V1_2026-09-21/GOLDEN_JOURNEY_MVP_2026-10-04.md` and Character Select are the current approved *planning contracts*, not current running live intro.

## 4 · P0 collision with the CURRENT Golden Journey (not silently decided)
The existing Golden Journey has:
- Curtain + `BLÖDSINN!` clay loading plaque/Enter → **Town**.
- **Juggling Clown** first Town Resident → hands player `ignore_dystopia:1` **The Doomsday Clock** as the first Card, and sets Orc Band courier task.
- Later **Protopia Farmer Duo gives `anti_rules_toolkit:1` The Rules Lawyer**, which the player delivers to the Lorekeeper.

R21 proposes **prison Clown**, **Anti-Rules first Card**, **new escape prelude**, and **fullscreen Curtain without plaques/wooden stage**. This intentionally crosses **three established acceptance assumptions**, not merely the first Card: (1) Town spawn/first Resident performance, (2) first Dystopia Card and courier purpose, (3) later Anti-Rules Card provenance/Lorekeeper handoff.

**WS0 decision is required:** whether prison Clown is the *same existing character/source asset* in a new temporary location, and whether Anti-Rules is **moved from the Farmer/Lorekeeper beat to the prison** with explicit later no-duplicate recontextualization. Candidate lean reconciled route:
- Clown hands **`anti_rules_toolkit:1` once** in the cell;
- escape opens into Town where Clown's **original `ignore_dystopia:1` delivery** can be rescheduled/reassigned as an NPC/card encounter (but **not duplicated** or magical second Clown without same character/world location reconciliation);
- Lorekeeper later **reacts to the already-owned Anti-Rules Card**, without Farmers issuing a duplicate; source/quest rewards use unique receipts.
This is only a suggested **revised Golden**, not production authorization or a patch to the current contract.

An alternative retains old Golden and makes the prison an optional replayable prologue with no new Card acquired there. That preserves acceptance but loses much of Georg's intended core. **Do not choose by stealth.**

## 5 · WS0 outstanding decisions after R21
**P0 editorial:** approve/decline prison prologue as the new *first actual spawn*; select exact prison Clown identity and Card handoff; reconcile Golden, including the late Lorekeeper Anti-Rules handoff; confirm one actor default and one existing source-lit room; specify exactly whether the full-screen cloth covers only loading or also selection/mode switch.
**P1 source and UX:** source-isolated unchanged R09 prison + r3 curtain + Toy Soldier before combined scene; compact dialogue interaction (existing Monkey-Island/ChatterBox), possible multiple escape methods, safe always-reachable passage through small maze, actual target/compass once outdoors, day/night sky and accessible performance; music after user gesture under existing Audio owner.
**P2 later:** HyperNorm visual fragments/Black Goo as layer not exposition; full Dungeon Raid or moving-maze level, mindscape portal, richer NPC rumors/egregores, larger Riot/MIB faction reactions, optional vehicles/flying and full Combat; no introduction blockers.
**Unverified:** acronym QED, “Gizmo Maze” specific owner, whether original old curtain donor is compatible with running WB2 renderer; real current playable Skeleton Warrior; actual integration of first-cell Clown NPC.

## 6 · Acceptance and next gate
Design gate for a future optional isolated visual **not** a full playable MVP: source-isolated full-screen physically behaving r3 curtain without stage; real R09 cell; real Toy Soldier and existing Clown actor if source-proven; original Anti-Rules Card; readable route to a WB2 exit. One renderer/world/runtime owner each, no placeholder/VFX cover that replaces donor; actual desktop/mobile behavior/low-end fallback separately assessed. Do not claim this preview exists.

**Tests this R21:** source-document investigation only, GitHub exact write/readback. Runtime tests 0, browser tests 0, visual donor-isolation tests 0, player tests 0, no Site/Stage/Live, no merge. Existing World R4 NO MVP not overridden. R9–R11 remain older local-only drafts and are not claimed persisted on this branch.

**Exactly one next human gate:** WS0/Georg approves or rejects **R21 prison-Clown/Anti-Rules first-Card opening AND its explicit revised Golden Journey handoff**. The receiving World/Character/Card/Audio owners may begin only a single source-isolated proof after that gate, with no second runtime.
