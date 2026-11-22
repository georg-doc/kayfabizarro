# KFB Game Loop R6 · Kayfabe Fluff Toy Ecology and Discovery
Date: 2026-10-29. Status: GEORG CREATIVE STEERING / DESIGN PROPOSAL. Not implemented, tested, published or promoted.

Owner: KFB_HUB/30_DECISIONS/replies on Draft PR #460. Receiving owners stay Card/Almanac, WS1 World/Fluff/placement/save, Combat Arena, Resident/ChatterBox and Motion/FX. No new economy or game runtime.

## Priority
Card collection and NPC world-knowledge exchange remain the **main player objectives** (R3–R5). Fluff and ordinary resources are a **secondary tactile playground and NPC livelihood/metanarrative**, not a grind economy. The player explores, tries things, sees clay-cartoon reactions and sometimes discovers a real Card, clue, prop or social encounter. Chill & Fun is the default, not a survival spreadsheet.

## Simple six-colour alchemy
Reuse the six existing Story-Mode Fluff types, not six separate skill trees. Most activities use exactly the same physical harvest, bounce, collect and transport interactions regardless of colour.

**One optional known recipe:** take one of each of the six coloured Fluff types to the Witch/Alchemist characters, learn the recipe, and synthesize **one not-yet-owned real canonical Card chosen from the valid Deck registry**. Check target uniqueness and source identity before spending the ingredients. The two existing Witch candidates are mentioned as Fluff-alchemists in the Dark Fluffer brief; their precise encounter/authoring details remain with the owning Character lane. No fabricated Card, duplicate or mandatory alchemy route. High/Low can remain metadata/visual until decided.

## Black Fluff as a world-state interaction
The current `BRIEF_WS1_DARK_FLUFFER_R1.md` (V-583) already specifies: `dark_fluffer` is the production ID; Residents say “Black Fluffer”; corruption is a **tainted state, not a seventh Fluff type**. The source brief prioritizes **healing with one existing WS1 action**, a finite one-time coloured Fluff drop, a peaceful cured creature, stopped Goo spraying and a visual eye change when the actual model is ready. A bounded Goo patch can be visibly cleaned. No second physics, combat or FX owner. The earlier infection backlog remains later scope.

Playable concept: player spots an ink-covered patch and a Black Fluffer, chooses whether to restore the patch, interact with the creature, leave it alone or follow another invitation. A successful cure produces a physical cartoon response, an NPC reaction and one finite coloured Fluff release. A Card/clue is optional only when genuinely authored. No repeatable exploit and no moral ranking of the player's route.

## Small, low-pressure interaction palette
| Source/scene | Try it | Fun/reward possibilities |
|---|---|---|
| Tree, bush, farm | shake, collect, found suction tool | falling, bouncing Fluff; incidental discovery |
| Rock or mine POI | interact with marked material source | mineral prop, Fluff nest, Card clue |
| Pond | relaxed fishing or comic-chaos interaction | animated fish, odd boot, Fluff-fish, occasional valid Card clue |
| Chest/Mimic | inspect, open, chase or start an encounter | real prop, Fluff, Card/clue, unexpected character reaction |
| Grab & Hook toy (candidate) | catch, pull or redirect a compatible object | physical comedy and access to curiosities; exact existing source **UNVERIFIED** |

These are **separate small toys** served by existing modules, not a new universal interaction engine. A valid activity can reward a surprising reaction alone. The Grab & Hook feature name/source cannot yet be confirmed from the reviewed GitHub records; do not claim it implemented.

## Placement and source-backed loot
Existing `KONZEPTBLATT_KFB_PLACE_R1.md` and `KONZEPT_KFB_VERTEILER_R1.md` describe seeded placement and WFC-style neighbourhood rules for scenery, Fluff nests, props and eventually encounters. Reuse that placement authority. **Placement decides where a chest/source fits; the owning loot/Card rule decides what it yields.** A guard may create one optional interaction, but the player need not clear every guard to progress. Alternative calm paths should remain available.

A real Card is unique in the Almanac by `deckId + cardNumber`, not replicated on every chest reopening. Stable POI/object IDs and encounter/loot receipts are needed for deterministic save/reload. Owned Card target => alternative *legitimate* prop, Fluff, clue or reaction rather than fabricated duplicate. No invented drop rates, six independent loot tables, reroll-on-reload or unbounded farming.

## NPC jobs and satirical Kayfabe economy
The existing `SPEC_FLUFF_SUCTION_R1.md` V-480 already gives a causal background: Fluff harvest → collection/loading station → Utopia industry → cheap synthetic construction → recovery/release into the world. This makes NPC work, farms, mines, factories and resource props meaningful **without modelling a global goods market**. Ordinary wood/ore can support optional building, repair and playful strategy/RPG moments. A cumulative Fluff tally is enough for much of the ordinary collecting. Satirical institutions may issue solemn claims about resources and licenses without actually blocking the player's free exploration.

## Next tiny experiment / acceptance not yet run
An actual source-backed POI containing a Fluff source, a small Goo/Black-Fluffer interaction and one curious find could prove three different voluntary actions, a satisfying visible response, one optional Card clue, and save/reload idempotency. Source objects must be isolated and actual visual output tested before source adoption.

Status: source-document review only; **0 runtime tests, 0 browser tests, 0 playtests, 0 asset-isolation proofs**. World R4 STOP/NO MVP remains unaffected.

**One next gate:** WS0/Georg register intake for the toy-first Fluff/Black-Fluff/optional alchemy/curiosity-loot direction; implementation remains subject to existing owner authorization.

## Checked sources
`replies/BRIEF_WS1_DARK_FLUFFER_R1.md`; `replies/BACKLOG_BLACKFLUFF_INFECTION_R1.md`; `replies/CONCEPTS_FLUFF_MINIGAMES_R1/OVERVIEW.md`; `replies/FLUFF_WORLD_DRESSING_R1.md`; `replies/SPEC_FLUFF_SUCTION_R1.md`; `replies/GAME_LOOP_R1.md`; `replies/KONZEPTBLATT_KFB_PLACE_R1.md`; `replies/KONZEPT_KFB_VERTEILER_R1.md`; current KFB Game Loop R2–R5.
