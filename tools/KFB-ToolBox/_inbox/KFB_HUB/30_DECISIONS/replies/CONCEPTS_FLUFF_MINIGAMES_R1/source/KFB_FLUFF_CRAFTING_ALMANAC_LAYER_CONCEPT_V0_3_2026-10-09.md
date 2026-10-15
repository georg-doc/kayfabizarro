# KFB · Fluff Harvest / Cartoon Crafting / Alchemy / Fractal Almanac · Integration Concept v0.3

**Status:** GEORG CREATIVE DIRECTION + PROPOSED INTEGRATION CONTRACT · PLANNING ONLY · NOT IMPLEMENTED  
**Date:** 2026-10-09  
**Receiving owner:** KFB Island Worldbuilder Lab / Claude Code steering (Vite + three.js r186, active sync branch `sync/lab-rkit-2026-10-09`).  
**Planning branch:** `planning/kfb-fluff-crafting-almanac-ideation-2026-10-09`; source is a planning addendum, **not** a parallel world runtime.  
**Outcome:** a specific, low-complexity mini-game/resource economy that can be handed to the **existing Lab** after a playable core MVP, without retrospectively widening its accepted gates.

## 0. Protected current state / authority
- The active Lab Masterplan R2.1 (read from `tools/KFB-ToolBox/_inbox/KFB Island Worldbuilder Lab/docs/KFB_MASTERPLAN_MVP_DRIVE_LOOP_R2.md` on `sync/lab-rkit-2026-10-09`, blob `1b8db9f93e37a2528ee439c8ea577ecbc66ce0a2`) lists Fluff harvest, 20-slot backpack, build/dismantle and God Mode among **non-MVP backlog**. MVP-1 remains Town + Protopia, MVP-2 completes the Drive Loop. The R4 / WB2 stop in `skills/chat/START_HERE.md` is unaffected.
- Source hierarchy: Georg's creative direction > current owning project SSOT/Return > canonical KFB/MED Rules/Deck registry > source-backed technical donors > proposals.
- Source-backed: Fluff Incident / Hunky harvesting, real Farmer resource/activity routes, the D6 Story Modes, canonical source Cards with `deckId + cardNumber`, Card PDF art, existing Almanac/Lean Memory provenance concepts, existing Build/Destroy/Repair and UFO dematerialization *prep*, real Golden Journey courier/Combat context.
- **Not canonized/implemented here:** universal Life Tree per island, fixed island Fluff morality, High/Low resource math, complete crafting game, tractor-beam integration, Studio/Stage deployment.
- Existing modules are not a reason to claim success: a source filename, donor URL or a loaded model is not source isolation or product acceptance. Show source asset/animation in isolation before integration.

## 1. Intent: “Pull, don't gate” with multiple Card acquisition routes
The player's chosen object of desire is a **real Card from a real Deck**, or a genuine asset. Travel, music, fight, social interaction, harvest and crafts are alternative invitations, not chores. A player can ignore alchemy altogether and still explore and enjoy the game. Nothing here makes Crafting a requirement for the Golden Journey, a hidden mandatory resource tax or a second card reward economy.

**Optional short loop:**
1. Spot a Fluff-rich tree, bush, rock, farm or mine node attached to a credible local Resident activity.
2. Press/tap a single existing interaction; the source prop wobbles/deflects; a few clay fruit/balls physically drop and are gathered by walking over them.
3. See a clear, tiny count update for the associated D6 color + High/Low polarity.
4. Either pursue a desired recipe or casually combine available pieces; discover an authentic item/card from source-backed recipes.
5. The existing Bag gets a real item, **or** the existing Almanac gets the authentic Card with a compact Origin Memory. No redundant card copy in the Bag.

Aim for **seconds per collection** and **short optional excursions**, not hour-scale harvesting. Durability, hunger, thirst, base-raid timers, daily caps, loot-box logic and compulsory resource scarcity are not this product.

## 2. Fluff types: six authored D6 modes × two polarities
The origin and symbols are the **public KFB Rules** at `https://kayfabizarro.pages.dev/#kfb` and the GitHub KFB Story Modes reference (`skills/SOT_REGISTRY.md`, `skills/EMBED_CUBE_PET_FULL_v2.2.md`). Some Travel `world-context.js` derivations have **drifted colors** (especially Absurd, mistakenly magenta): NEVER promote them above the public KFB rule source.

| D6 | Story mode | Canonical ink/accent | Existing pale panel reference | Fluff palette cue |
|---:|---|---|---|---|
| 1 | TRAGIC | `#3e6a83` | `#dbe4e9` | steel blue |
| 2 | COMIC | `#5e6f33` | `#e3e9d3` | olive green |
| 3 | ABSURD | `#8a6d12` | `#f1e8c5` | gold/yellow |
| 4 | HEROIC | `#b75f23` | `#f4e1cd` | burnt orange |
| 5 | MYSTICAL | `#6b4e7d` | `#e5dde9` | purple |
| 6 | FORBIDDEN | `#8f3a5f` | `#efdbe2` | wine-red |

**High Vibrational** signifies the human surplus: solidarity, curiosity, truthful insight, care, courage, repair, love of beauty; **Low Vibrational** signifies dissipated/extracted attention, suffering, exploitation, manipulated spectacle and similar conditions. These are competing *energetic* readings, **not** a simplistic good-island/bad-island map or a morality meter. High-Tragic and Low-Comic are equally conceivable. Residents may show source-backed light preferences (Farmer tending High, dystopian extractor seeking Low, trader using both), not a global NPC simulation.

Minimal resource identity is `(storyMode: one of six canonical keys, polarity: HIGH | LOW)`, plus count. This gives **12 stackable varieties but six base colors**. High is bouncier, livelier, brighter and smoother; Low is visibly denser, darker and more heavily kneaded, with different squash/sound/settling. Readability also uses D6 icon/name and +/− form so it is not color-only. No real-time moral scoring, no separate hue rules invented for each island.

The actual world palette is owned by `ENV_ROLES` in the existing Lab. The Story Mode is an accent/material role *within* a biome, never a mandate to repaint all six biomes with six flat templates. The public website's pale color washes are a **UI presentation**, not a mandate to render pastel Fluff balls. Source-isolate real Clay materials and demonstrate six paired colors before integration.

### Deliberately tiny “opposites” alchemy (working rules, adjustable)
- Combining matching Story Mode High + Low **may** yield one recoverable neutral/raw mass in a recipe, not just delete rewards. Neutral is an **intermediate crafting output**, not a seventh D6 color, thirteenth collectible wallet type or universal resource.
- A named authored recipe may instead turn a High/Low pair into a catalyst/scene prop. Different modes may fuse in specified combinations; do **not** build an open-ended 12×12 transformation graph.
- For first proof, at most **two resource varieties + one authored recipe**. Discovery must not silently eat resources on mismatch. Refund/no-op is the default when a combination is unknown.
- Same category across POIs may vary in abundance/story/performance, but **canonical mode identities remain stable**. Low is not inherently usable only for demolition; High is not the only legal input for construction.

## 3. Three presentation modes of the SAME crafting contract
**A. Backpack knead (immediate):** drag/tap 2–3 lumps into tactile wells, press or pinch to combine, see material wobble/fuse, obtain a genuine item/Card. A successful crafted prop goes into a free Bag slot. A new Card goes to the Almanac, not to bag storage.

**B. Location workshop (spatial):** Protopia workbench, Town craft area or another *source-backed meaningful POI*. Same ingredient check, recipe and one resource transaction, but uses hand choreography / workshop props.

**C. Later mini-factory:** a small maker-machine with 6 color hoppers and a short clay conveyor, press/squash → fuse → stamped genuine Card / real miniature prop ejected. It is **a presentation skin for the same A/B crafting API**, never a second inventory engine, random reward spinner or different recipe grammar. The machine can use existing KFB particle/materialization presentation (UFO Tractor Beam family is an audition candidate, not already accepted runtime).

### Existing Backpack and item UX
- Golden Journey §7 establishes **20 ordinary visible Bag slots** and does not demand loot economy for current MVP.
- Existing `tools/KFB-ToolBox/_inbox/KFB HUD Flight Board - Flight VFX/KFB_HUD_FLIGHT_SESSION_CUT_2026-10-09_r1/hud-flight/kfb-backpack.js` exports a candidate 20-slot/3D mini backpack; needs consumer/code/donor verification before use.
- Concept: six **quick wells** by D6 family, each visibly showing HIGH and LOW portions; these can be a Bag *subview backed by a single resource wallet* or pre-existing stacked items. **No unreviewed separate save/inventory owner.** Only normal props consume the 20 slots. If Bag is full, do not deduct resource before placement is possible; offer to free a slot.
- Interaction must support desktop hover/click plus mobile tap; scrolling game HUD should never require desktop-only hover.
- At the crafting moment show only missing quantities (e.g. “Absurd HIGH ×2”) rather than a matrix of twelve resource counters.

## 4. Harvest, sourcing and optional navigation
Existing World/Environment owner supplies *actual* source-backed tree/bush/mine/soil props and their persistent POI ID; real resident work routines explain why the node exists. The harvester adds **an interaction and drop presentation**, not its own world terrain mutation.

**Example, explicitly a proposal not a proven asset selection:** Town Caveman's mine → Heroic/ochre or other lore-supported material, Protopia Farmer orchard → lively grove, later Dystopia extraction site → darker material. Exact resource mode and palette assignments must be checked against the true site biography and real POI; do not hardcode speculative assignments just from island names.

Node can bounce/shake and shed 2–4 balls; it usually survives. Resource pickup via player-proximity magnet, no need for an axe or new attack system. Destructible collapse is future optional using canonical Build/Destroy/Repair owner only; *hitting a tree is not a Combat Arena fight*.

When targeting a missing ingredient the existing minimap/planned **3D way-arrow** may display one **verified reachable** candidate source and permit travel by walking, Joyride car, boat or unlocked flight. Route/nav authority is existing; the ingredient system returns target IDs, not new coordinates, physics, camera transforms or false ETA. No route gate requiring jetpack when a ground alternative exists.

Sources should normally replenish on a soft local basis; no starvation/grind. Courier, Combat, Resident trade or found-world rewards may **also** grant color/polarity materials *if added to the authoritative existing reward source*: the grant receipt is idempotent, never duplicate-paid on reload/revisit and never debits HP through a conflicting meaning of Fluff.

## 5. One event grammar, several genuine outcomes (no VFX-owned truth)
Use the shared, previously prepared KFB Clay lifecycle:
`FLUFF_MATERIAL_DELIVERY → ROUGH_MASS → SCULPT/KNEAD → RESOLVE → EDGE_HEAL/FINISH`;
and the reversible `RESOLVED → DAMAGED → RUIN → REBUILD → RESTORED` as a **presentation mapping to the existing owning state**.
UFO VFX prep (`skills/chat/UFO_HUNKY_DORY_WORLD_EVENT_PREP_2026-10-06.md`) similarly has `SOURCE_OBJECT → CLAY_CHUNKS/PARTICLES → TRANSFER` and reverse. A particle cloud is not an actual transferred/destroyed object.

Use **one semantic animation grammar** (squash/stretch/collect/merge/particles/stamp/reveal/settle) for:
- Fluff falling from a plant or mine;
- hand-kneaded alchemy and Card reveal;
- manufacturing a physical prop;
- later approved Build/Repair/Dismantle and a dungeon wall/piece;
- later UFO transfer/return.

Specific VFX donor selection requires isolated visible source proof. The final object must be the actual approved KFB asset/geometry or canonical Card art. The **World** owns placement/support/sockets/collision/state and save; **Almanac/Card viewer** owns Card UI and identity; **Audio** remains the only AudioContext/mix owner; **Resident Motion** owns gesture; **Combat Arena** owns combat resolution.

God Mode permissions DO NOT become player permissions. Player building means selecting an explicitly permitted recipe and prepared anchor/socket in the existing World scene. Valid source mesh, rounded Knet edges, structural/ground support and persistence must be proved. Use a *single small wall/room part* before any generic dungeon construction. Dismantle/recycle may refund with a validated World + wallet transaction; must not duplicate assets or resources.

## 6. Crafting rules, canonical Cards and transactional safety
**No random invented deck art.** Every craftable Card maps to one existing canonical `deckId + cardNumber`, resolves its original final PDF crop using `cardGrid` and its Card JSON (name/power/lore/other authored fields), and grants collection/provenance through the *existing* Almanac/Card-authority consumer. Cards are NEVER loose Bag inventory copies.

Two play styles:
- **Targeted:** choose an existing missing Card → one terse recipe hint → known accessible material site(s) → combine.
- **Curious:** try 2–3 pieces in the Backpack/workshop; deterministic source-authored outcome or harmless readable no-op/refund. Avoid an opaque lottery, grind or puzzle requiring a wiki.

A validated recipe has stable `recipeId`, `ingredientRefs/counts`, `outputRef` (canonical Card or approved prop), optional allowed world/station/context and provenance sources; do not introduce a second deck catalog. Statuses can be DISCOVERED/KNOWN/UNKNOWN for the player's hints but that is not a new progression currency.

**Proposed minimal transaction contract (interfaces, not currently implemented APIs):**
```text
CraftRequest(recipeId, stationOrBag, playerId, actionId)
→ resolve existing recipe & source-owned material counts
→ verify outputRef against approved KFB asset or canonical Card registry
→ reserve required resources and output destination
→ COMMIT exactly once:
  - deduct material stacks,
  - grant one approved prop OR acquire canonical Card idempotently,
  - append CardProvenance/MomentReceipt with source POIs and actual method.
→ visual CraftResolved/CraftRejected event drives pre-existing Clay VFX presentation.
```
Reload/failure must not half-charge a recipe; repeated `actionId` cannot double-grant. Duplicate already-owned Card: never create a second Card; either refuse craft before spending or execute a separately-authored non-card cosmetic effect. Quest/Courier *custody* cannot be silently bypassed or altered by a newly acquired Card.

**Identity of Fluff is intentionally typed:** Lore High/Low Fluff, health/HP Fluff (older Overworld usage), Fluff score/reward and wallet material must not accidentally be the same mutable counter. Confirm what current owners actually store rather than invent global rename/second save database.

## 7. Fractal Almanac: the Afterglow is the reward
Existing `skills/chat/workflows/KFB_PLAYABLE_MVP_CONSOLIDATION_V1_2026-09-21/SITE_GODMODE_LEAN_MEMORY_ARCHITECTURE_2026-10-04.md` separates:
- `PLAYER_SAVE`: collected canonical Card identities, world/player state;
- `LEAN EVENT MEMORY LEDGER`: acquisitions, arrival, encounters, handoffs and important moments;
- `FRACTAL ALMANAC / JOURNEY`: human-readable projections; cached summaries not authoritative.
The deck pipeline demands source PDF/Card art, source Card identity and a single acquisition/provenance chain.

**Proposed UX** uses the existing HUD/Overworld fan donor, rather than a newly invented card UI:
- Upper-right visible top Card/stack; expand as a downward fan on hover **or tap/focus**.
- Scroll a card rail/group; select Card to open real PDF/Card mini-viewer overlay with correct cardGrid crop; light clay/paper reveal, zoom/scroll and close.
- A compact Afterglow/Origin panel reads actual `how`, `where`, `who` and `when/session`, with **one concise scene memory** derived from real receipt data. Source art is never replaced by screenshots, generated card motifs or fake PDF.
- Source methods may include `COURIER`, `COMBAT`, `HARVEST_CRAFT`, `DISCOVERY`, `RESIDENT_GIFT`; this is a planning vocabulary until the existing owner verifies exact event names.
- Card repeat encounters can accumulate distinct *provenance memories* without duplicating permanent ownership.
- Optionally link the canonical publicly available Cut&Play deck download, only when a **real verified** public/Gumroad URL exists. No invented link or game-baked duplicate download library.

Example Afterglow (NOT a source canon story): “Crafted on the Protopia workbench. High-Absurd Fluff gathered at Farmer's orchard, second ingredient retrieved at Town mine. The card joined the Almanac here.” Real data must support every clause; no fabricated diary entry.

## 8. Easy analogue Cut&Play backport (sidecar, not changing KFB rules)
D6 decides the original six Story Modes, a reversible +/− token represents Fluff polarity. A **small optional two-page add-on** could define 2–3 resource-source/token combinations and a fun Card-use discovery reward. Preserve the current KFB rules and freeform theatrical story; avoid twelve-column bookkeeping or mandatory crafting to play. The digital design *may inspire* the analogue version, never declare itself canonical analog rules without separate Georg decision.

## 9. First later vertical proof: one memorable activity, not a survival platform
**NOT part of currently running MVP-1 acceptance.** After playable MVP and named implementation authorization, consuming owner verifies:
1. One **real** KFB plant/tree fruit source and one **real** Town mine resource node, each shown in visual/source isolation, grounded and assigned a plausible social work route.
2. One true D6 material family with HIGH + LOW variants, plus a second family if the recipe needs it. Match authoritative Story-Mode colors; `ENV_ROLES` retained.
3. Single-input wobble/drop/magnet pickup, short visible count change; resource quantity persists/reloads.
4. Existing 20-slot Bag candidate integrated as **consumer**, with short crafting wells, not a second inventory owner.
5. One source-approved recipe yields one **real existing** Protopia Card or prop; shows KFB Clay knead/reveal; grants exactly once, card PDF/JSON matches actual canonical ref.
6. Almanac fan/Viewer and readable Origin Memory use the **same acquisition receipt** and survive fresh reload; crafting never overwrites Courier custody.
7. One existing wayfinding consumer can point to a real source without replacing walk/drive/flight or camera owner.
8. No regression to the authorized Drive Loop; source prop persists; audio mute works; failure/refund avoids loss; repeat interaction/reload avoids duplication.

**Suggested checks (not yet performed):**
- card identity resolution/real PDF art parity;
- known/unknown/duplicate recipe transaction and rollback;
- material count conservation + save/reload + reward receipt idempotency;
- valid source/waypoint route, no invented resources;
- bag-full behavior;
- same Story Mode High-vs-Low visible/readable contrast;
- source-isolated tree/mine/VFX before integration;
- no second renderer, movement writer, camera, AudioContext, Combat engine or world-state owner.

## 10. Named ownership & handoff map
| Concern | Reuse / current authority | Planned consumer |
|---|---|---|
| World, terrain, resource node placement, collision, persistence | Island Worldbuilder Lab / future accepted World owning runtime; WB2 R4 remains stopped | Fluff interaction binds World-owned POI IDs |
| Nature, source props, material/biome palette | Environment + Asset Librarian + KFB Clay + `ENV_ROLES` | Source-isolated tree, mine, clay balls |
| Player Ground/Drive/Flight + camera, route/way arrow | existing Ground, Joyride, Flight, Navigation owners | Target POI ID only |
| Bag, gear & wallet | 20-slot Bag candidate; resource persistence owner MUST be resolved | Six D6 paired craft wells, no second owner |
| Card identity/art/render/acquisition | canonical deck registry, Card Builder/Ink, PDF/Card Viewer, Almanac receipt | Recipes resolve real CardRef, no duplicates |
| Combat/Courier/Resident reward | existing Combat Arena, Golden Journey, Resident + reward owners | Optional resource grant as existing event consequence |
| Shared transformation, audio, gestures | existing Build/Destroy/Repair, UFO Event/VFX, Audio, Resident Motion | Craft/Harvest visuals only after isolated proof |
| Public KFB/MED site and PDF/JSON replatform | separate KFB public-web owner; SITE CONSOLIDATION IS PARKED | No dependency on migration for initial Fluff proof |

### Inputs for future executor (not now)
- Main router: `skills/chat/START_HERE.md`, `CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`, `FRESH_CHAT_SLICE_PROTOCOL.md`.
- Lab sync plan: `sync/lab-rkit-2026-10-09` → `tools/KFB-ToolBox/_inbox/KFB Island Worldbuilder Lab/docs/KFB_MASTERPLAN_MVP_DRIVE_LOOP_R2.md`.
- Creative source: `skills/chat/recovery/KFB_FOUR_ISLAND_STORY_RECOVERY_2026-10-08.md`, `skills/chat/KFB_GAME_BIGGER_PICTURE_REFERENCE_2026-10-04.md`.
- Card/Lean Memory: `skills/chat/workflows/KFB_PLAYABLE_MVP_CONSOLIDATION_V1_2026-09-21/DECK_WORLD_SEED_CARD_PIPELINE_2026-10-04.md` and `SITE_GODMODE_LEAN_MEMORY_ARCHITECTURE_2026-10-04.md`.
- Build/VFX: `skills/chat/recovery/KFB_2026-10-07_WEBCHAT_IDEATION_PERSISTENCE_AUDIT.md`, `skills/chat/UFO_HUNKY_DORY_WORLD_EVENT_PREP_2026-10-06.md`.
- Canonical color correction, original dialogue and full ideation v0.1→v0.2.1: Production Control workflow `KFB_ISLAND_WORLDBUILDER_LAB_MINIGAME_LAYER_IDEATION_2026-10-09`, v0.2.1 file id `3bdf58db-137f-4179-8524-513de0a39a08`.
- Unity kit: mechanics-only reference `https://assetstore.unity.com/packages/templates/packs/open-world-building-survival-crafting-kit-for-mobile-pc-376842`; no Unity plug-in port or licenced asset adoption.

## 11. Deferred side quest (explicit Georg park)
KFB/MED Rules + Cut&Play + public published-deck Gallery + optional read-only Canon Reader GPT Site is PARKED. The full separate plan already exists as Production Control `KFB_PUBLIC_WEB_GPT_SITE_CONSOLIDATION_IDEATION_2026-10-09`, file `98d8a388-5c0c-48d5-89bb-da484e6971f5`; current decision record `PARKED · public KFB GPT Site consolidation`. Do not start Site work, public redirects, repo visibility migration, new plugin, Hub/Cloudflare publishing or a separate app just because this plan exists. Continue existing public KFB/MED PDF/JSON URLs as their present authority.

**Single next gate, later:** `MINIGAME_FLUFF_SOURCE_AND_OWNER_AUDIT` — only after the playable MVP foundation is credible and Georg gives explicit go-ahead. Check actual source donor tree/mine/VFX/Backpack and current Inventory/Almanac authority; deliver a source-isolated wiring plan before writing gameplay code.

**This document has ZERO runtime tests, ZERO visual source isolation, ZERO builds and ZERO public deployments. A plan is not a playable feature.**
