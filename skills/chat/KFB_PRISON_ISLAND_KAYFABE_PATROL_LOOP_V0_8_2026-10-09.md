# KFB Prison Island / Kayfabe Patrol Loop · v0.8 · 2026-10-09

Status: **POST-MVP CONCEPT SLICE · DOCUMENTATION ONLY · NOT IMPLEMENTED**
Owner: **existing KFB Island Worldbuilder Lab / Minigame-Layer ideation**
Planning branch: `planning/kfb-fluff-crafting-almanac-ideation-2026-10-09`
Runtime authority: **unchanged**
Current Four-Island A/B gate: **unchanged**
Public Site/Stage: **not requested**
Later receiving executor: **Claude Code / Island Worldbuilder Lab steering, only after explicit Georg authorization**

## 0. Slice contract

**Goal:** Preserve and extend Georg's Prison-Island idea as a reusable post-MVP encounter/venue concept: Toy Soldier patrols a modular prison, repeatedly captures the same recurring heel, the player may also be arrested and escape by several playful routes, and the location doubles as a satirical Panopticon/ChatterBox playground.

**Owner:** Existing Island Worldbuilder Lab / Minigame-Layer ideation. This document creates no second World, Dungeon, Combat, Dialogue, Economy, Card, Camera, Audio or Save owner.

**Source:** Current KFB Bigger Picture + existing S13.2 World-Atlas Dungeon grammar + current Resident/Asset source pool. Exact source objects must still be shown in isolation before later integration.

**Protected boundary:** No R5, no current MVP change, no fifth canonical core island, no new universal prison generator, no competing dialogue/AI runtime, no invented canonical Card, no automatic merge or deployment.

**Done for this slice when:** concept is persisted on the current planning branch and KFB Production Control, source/donor status is explicit, recovery path is sufficient for a fresh chat, and the later implementation seam is narrow enough for Claude Code to classify KEEP / ADAPT / AFTER_MVP / BLOCKED without guessing architecture.

## 1. Product idea in one sentence

A small **Prison Planet played as a prison venue / satellite island** where the pompous Toy Soldier and a recurring Kayfabe supervillain reenact capture, escape and re-capture because each of them professionally and emotionally needs the other role to exist.

The venue should feel like a **living clay/cartoon stage set**, not a realistic prison simulator: open-top cells, visible gates, sparse dungeon furniture, tally marks, wall scribbles, surveillance cameras, a watch point, breakaway scenery and deliberately theatrical arrests.

## 2. The central relationship: Toy Soldier ↔ recurring heel

### Toy Soldier

Georg's intended reading is retained:

- ceremonial authority made into a full-time identity;
- patrols because patrolling proves that authority is necessary;
- overconfident, literal, officious and easy to distract;
- not a sadist and not a competent detective;
- believes uniform, musket and procedure are self-validating;
- can be tricked by flattery, bureaucracy, fake urgency, another rule, a prop reaction or a better performance;
- remains irritatingly certain of his office even while everybody around him understands the absurdity.

This is not a new police-system owner. It is a Resident role expressed through the existing interaction, ChatterBox and World event seams.

### Primary existing-source rival candidate: Black Knight

**Proposal, not character-canon lock:** use the existing source-backed **Black Knight** as the first visual/body candidate for the recurring heel.

Why he currently fits better than the Demon Lord:

- visually and physically reads as a proper opposing "heel" without automatically becoming a final boss;
- existing sword/knight identity supports pompous villain theatre and mock-duel / wrestling staging;
- he can plausibly be dangerous, vain, articulate, pathetic and repeatedly capturable at the same time;
- the role can be funny at low stakes without making a cosmological Demon Lord feel trivial;
- his larger silhouette contrasts well with the smaller ceremonial Toy Soldier.

Exact model source already exists in the KFB asset corpus:
`media/3D_Assets/KayKit_Mystery_Series6/3 - September 2024 - Black Knight/characters/BlackKnight.glb`

**Important:** presence of the file is only source evidence. Before any implementation, show the Black Knight in isolation at the pinned source, including rig/scale/material/animation compatibility. Do not treat earlier Joyride screenshots or a loaded URL as proof that this exact prison role has been visually accepted.

### Runner-up / occasional high-security guest: Demon Lord

The existing Demon Lord can remain a candidate for a rarer "we need another cell" gag or high-security visitor, but is not the preferred recurring buddy antagonist. He reads more naturally as a special escalation than the everyday fugitive.

### Tragicomic shared backstory direction

The relationship works best if neither role is merely a joke mask:

- the Soldier once had a ceremonial institution, regiment or kingdom that no longer meaningfully exists; patrol is the surviving ritual that gives him status;
- the Knight likewise lost the court, war or audience that made "villain" a socially legible occupation;
- they therefore keep each other employed: escape creates patrol, patrol creates villainy;
- both know the script and will occasionally break Kayfabe to repair the set, complain about timing or negotiate the next chase;
- once the performance resumes, both snap back into absolute role certainty.

This creates a dysfunctional two-person institution rather than hero versus disposable enemy.

Open question for later writing: whether the Knight truly wants freedom, or mainly wants **the escape** because being recaptured is the only time somebody still treats him as important.

## 3. Kayfabe behavior grammar

The pair should not have one fixed joke. Reusable relationship beats:

1. **Pre-show negotiation** — they quietly agree on stakes, route or timing.
2. **Role snap** — once another Resident/player is watching, both become Soldier and Supervillain.
3. **Escape** — sometimes clever, sometimes embarrassingly enabled by the Soldier.
4. **Patrol hunt** — Soldier gets a reason to traverse the island and appear in unrelated world situations.
5. **Capture** — chase, argument, environmental trick, short combat/wrestling beat or voluntary surrender depending on context.
6. **Ceremonial booking** — absurdly formal return to the same cell.
7. **Backstage reset** — gate fixed, scenery reassembled, grudges temporarily suspended.
8. **Next breakout** — different route or excuse; no implication that the previous loop was erased.

Short example tone only, not frozen dialogue:

- Soldier: "You are under arrest again."
- Knight: "You missed the cue by three minutes."
- Soldier: "Procedure has no cue."
- Knight: "That is why your second act drags."

The joke is their dependency and performance discipline, not generic stupidity.

## 4. Prison venue: small satellite island, not a fifth core world

The current Four-Island story remains KFB Town / Dystopia / Utopia / Protopia. Therefore this concept must **not** silently create a fifth canonical main island.

Preferred topology options, still proposal-level:

- small **satellite prison island / offshore fort** belonging to Dystopia;
- a prison venue on the edge of Dystopia with a short bridge/ferry/portal seam;
- an instanced "Prison Planet" interior/venue that uses planet language as satire rather than adding a cosmological world;
- later, if the world topology itself changes through its own accepted design gate, this venue may be relocated without changing the gameplay contract.

The Dystopia adjacency is attractive because CCTV, Panopticon, authority and institutional absurdity are native scene material there, while the human-scale Toy Soldier/Black Knight relationship keeps it from becoming a lecture.

## 5. Existing Dungeon donor: use, do not replace

### S13.2 remains the spatial donor/owner family

Existing World-Atlas Dungeon S13.2 already provides:

- graph-based cells and seams;
- module size 4;
- two levels;
- deterministic Recipe-JSON;
- seam classes `solid`, `door`, `gate`, `open`;
- `wall_gated` as a visible blocked gate;
- `wall_doorway` as the current walkable doorway;
- proven walkability/pixel-probe logic;
- measured stairs and wall contacts.

This is enough to make a prison **cell block recipe** without inventing a new prison generator.

### Important actual asset limitation

The current FREE Dungeon inventory explicitly lacks a standalone **cage** asset. That is not a blocker.

The prison cell should therefore initially be composed from existing structural seams:

`cell floor + solid walls + one wall_gated seam + open top / cutaway view + sparse props`

This reads as a cell while preserving one owner.

### Existing prop vocabulary useful for cells

Current Dungeon prop evidence includes or explicitly records:

- bed;
- table;
- chair;
- shelves;
- keyring_hanging;
- crates / barrels / chests;
- bones / skull;
- candles / mounted torch;
- banners and sparse wall props.

Tally marks, scribbles and prisoner graffiti are **presentation proposals**, not currently claimed source assets. Later implementation must either:
- reuse an accepted existing decal/paper/facade owner;
- use a source-backed wall/paper prop;
- or defer the marks rather than invent a new texture/decal subsystem.

## 6. Visual treatment: open cell, clay/cardboard stage, breakaway scenery

Georg's intended image is stronger than a realistic dungeon: the player should see the prisoner easily and read the space almost like a dollhouse theatre.

Desired presentation:

- top open or camera-cutaway; no need to hide the inmate behind a full roof;
- sparse old-dungeon interior;
- one miserable bed/cot, stool/table if useful, wall keyring or shelf, candle/torch;
- lots of negative space;
- worn clay/stone with KFB handmade imperfection;
- tally groups, scratches, complaints, conspiracy diagrams and bad escape plans where a source-compatible wall-mark layer exists;
- a few rounded clay pebbles/rubble clumps at damaged edges;
- gates remain visibly structural and legible from player height.

### Breakaway / crumple mode for Kayfabe wrestling

Do not make authoritative World collision depend on a physics-heavy wall simulation.

Later proof may use a cheap reversible **breakaway presentation state**:

- structural cell recipe remains the authoritative support/walkability state;
- selected noncritical facade/gate/wall presentation pieces can tilt, squash, detach or swap to a damaged preset during a wrestling brawl;
- collision/escape state changes only when the existing World/door owner commits it;
- after the bout, the pair may visibly reassemble the set or the World recipe reloads its intact presentation;
- no permanent terrain destruction is implied unless the World destruction owner separately accepts it.

This lets the room read as "kartonig zerknüllt" without creating a second physics/destruction engine.

## 7. Modular expansion: Toy Soldier can "build another cell"

The prison can grow theatrically when more troublemakers arrive.

Preferred later contract:

`PrisonBlockRecipe + available support node + authoritative World build action → append one pre-authored cell module`

The Soldier may perform the build with comically serious measuring, hammering, wall placement or gate inspection, but the actual persistent edit remains with the existing World/Build owner.

No freeform runtime architecture system is required for the first proof. A small finite set of authored cell-block recipes is enough:
- solitary cell;
- two-cell row;
- small holding pen;
- damaged/wrestling cell;
- watch/gate node.

## 8. Player custody: prison is gameplay, not only scenery

The player can also be detained. Custody should create options, not a forced timeout.

### Possible arrest triggers

Keep these local/authored rather than a universal morality system:
- caught trespassing in a clearly restricted local scene;
- interfering with a current Soldier/heel performance;
- carrying a specific contraband quest item;
- losing a local chase or comic duel;
- deliberately choosing "arrest me" to enter the venue;
- being framed by an inmate/Resident in an authored encounter.

Do not invent a global police heat/wanted simulation merely for this venue.

### Release / escape routes

A custody state can support several equivalent routes:

1. **Serve / wait briefly** — sleep, listen, inspect the cell, talk to inmates.
2. **Pay an official fine** — only through the existing economy/wallet owner.
3. **Bribe** — separate authored social/economic action, not automatic "money always wins".
4. **Persuade / flatter / confuse Toy Soldier** — existing ChatterBox/Social Call seam.
5. **Distract him** — living props, another Resident, false alarm, musical event, escaped heel.
6. **Find/use a real key or local escape prop** — persistent item receipt through the existing inventory owner.
7. **Exploit a breakaway / loose facade route** — only if the World/door state authorizes the opening.
8. **Use a release token/card-like item** — Monopoly-style inspiration is acceptable as a gameplay reference, but do not copy Monopoly art or silently declare a new canonical KFB Card. If an actual KFB source Card later fits, route it through the existing Card owner; otherwise this is a local item/receipt.

The point is choice, observation and mischief. The prison should never become "lose two minutes of play".

## 9. Panopticon + CCTV as playable satire

The prison can borrow the **Panopticon** as spatial/social grammar without requiring a literal historically exact reconstruction.

Useful scene elements:
- central or elevated watch point;
- cell rows arranged so the watched cannot easily tell whether the watcher is active;
- CCTV cameras with visible sweeps/indicator behavior;
- blind spots and contradictory signs;
- loudspeaker / noticeboard / inspection routine;
- camera feeds or signs that exaggerate institutional certainty;
- some cameras may be broken, pointed at one another or confidently monitoring an empty chair.

Living-world rule applies: a camera can twitch, object, misidentify somebody or become part of a distraction. It does not need its own AI agent; use shared reaction grammar and bounded authored lines.

A surveillance state may be **performatively omniscient while materially incompetent**. That tension fits the Soldier.

## 10. ChatterBox and inmate talk

The cell block is a strong place for optional, nonblocking speech.

Inmates can discuss:
- the stated reason for their arrest;
- competing stories about who actually runs the island;
- rumors about the Black Knight's next escape;
- absurd institutional rules;
- deck/world themes relevant to their actual source identity;
- fringe or conspiratorial explanations as **diegetic character claims**, not narrator-certified fact.

Important tonal rule:
- multiple inmates may contradict one another;
- a Resident may be insightful, deluded, lying or performing;
- no "official correction voice" is required inside the fiction;
- actual product facts/provenance remain with source/Almanac layers, not inmate certainty.

ChatterBox/voice/bubbles remain the existing dialogue/audio owners. No prison-specific LLM brain.

## 11. Recurring micro-events

The venue can generate many cheap, memorable loops without a huge quest system:

### A. The escape inspection
Soldier gives a pompous tour of the "inescapable" cell while the Knight is visibly leaving behind him.

### B. Patrol encounter
Player meets Soldier halfway across the island. He is chasing the Knight but stops to enforce a minor local rule, allowing the Knight to gain distance.

### C. Voluntary surrender
Knight returns on his own because nobody noticed the escape. He insists on being properly recaptured.

### D. Wrestling booking
A dispute becomes a short Kayfabe brawl. Breakaway cell dressing crumples, both characters pause to check whether a prop actually broke, then resume.

### E. Player jailed with the heel
The Knight is simultaneously escape mentor, unreliable conspirator and rival. He may give excellent advice for the wrong door.

### F. Mass holding cell
After a festival, protest, band fight, failed stunt or absurd world event, several Residents briefly occupy the same holding area and immediately turn it into a social scene.

### G. CCTV blind-spot game
No new stealth engine is required initially. A later authored puzzle may simply use existing camera cones / timed state / distraction events around one room.

## 12. Relationship memory and persistence

Keep persistence small and meaningful.

Potential stored facts:
- last known custody state;
- number of documented Black Knight escapes;
- last escape method id;
- whether player has ever been jailed;
- which release routes the player has used;
- a few authored relationship flags between Soldier, Knight and player;
- one or two memorable inmate encounters.

Do not store every banter line or every gate animation.

Suggested ownership:
- World/Instance save: doors, cell block recipe, local breakaway/reset state where meaningful;
- Resident/Relationship Memory: social consequences and recurring pair history;
- Inventory/Economy: keys, fines, local release token if real;
- Almanac/Lean Memory: selected memorable firsts only;
- ChatterBox: presentation, not persistent world truth.

## 13. First later vertical proof — intentionally small

When the current playable MVP exists and Georg explicitly opens this post-MVP lane, do **one** proof:

**"The Same Damn Prisoner"**

- source-isolated Toy Soldier;
- source-isolated Black Knight candidate;
- one small S13.2-derived open-top cell with one `wall_gated` seam;
- bed + one or two proven Dungeon props;
- one patrol route outside;
- Knight starts in cell, escapes through one authored state change;
- Soldier notices, short chase/argument, Knight is returned;
- one player distraction option;
- save/reload preserves final custody state;
- one short optional ChatterBox exchange;
- no combat requirement, no full stealth, no dynamic prison generator, no fifth world.

Only after this works should we test:
- player arrest;
- breakaway wrestling cell;
- modular second cell;
- CCTV/Panopticon puzzle;
- multiple inmates.

## 14. Source-isolation checklist for later Claude Code

Before integrating a donor, show it alone at exact pinned source:

1. Toy Soldier exact model, rig family, weapon/prop compatibility, scale.
2. Black Knight exact model, rig family, sword/animation compatibility, scale.
3. Dungeon `wall_gated` / doorway / wall / floor / stair family.
4. Cell prop set: bed, table/chair, keyring_hanging, bones/skull, light.
5. Any cardboard/clay facade treatment proposed for breakaway staging.
6. Any CCTV camera model or decal/graffiti source.
7. Any arrest/release item or Card-like prop.

"File exists" or "URL loads" is not visual/source acceptance.

## 15. Later Claude Code handoff contract

Claude Code should receive this as **planning input**, not as permission to build immediately.

Required first action after explicit authorization:
- inspect current Island Worldbuilder Lab branch/head;
- classify each seam `KEEP / ADAPT / AFTER_MVP / BLOCKED`;
- map prison recipe to existing World/Instance/Build, Resident, Interaction, ChatterBox, Audio, Inventory/Economy and Save owners;
- verify Dungeon S13.2 can be consumed without mutating the existing Dungeon Raid owner;
- isolate exact Toy Soldier/Black Knight/Dungeon sources before integration;
- choose one vertical proof only.

Forbidden:
- new prison runtime;
- new dialogue service;
- new wanted/heat global subsystem;
- new economy;
- new universal Dungeon generator;
- adding a fifth canonical island by assumption;
- placeholder bars/cages when current `wall_gated` can prove the seam;
- automatic merge, Live promotion or public Stage.

## 16. Recovery / timeout packet

Fresh chat recovery order:

1. `skills/chat/START_HERE.md`
2. `skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`
3. `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`
4. `skills/chat/KFB_GAME_BIGGER_PICTURE_REFERENCE_2026-10-04.md`
5. `skills/chat/KFB_FLUFF_CRAFTING_ALMANAC_LAYER_RETURN_2026-10-09.md`
6. this file
7. World-Atlas Dungeon donor:
   - `tools/world_atlas/docs/HANDOFF_dungeon_S13.md`
   - `tools/world_atlas/docs/HANDOFF_dungeon_props_S13_3.md`
   - `tools/world_atlas/source/lib/dungeon-grid.js`
8. current Island Worldbuilder Lab state before any later code write.

If chat or Site times out:
- GitHub branch state is authoritative for committed text;
- KFB Production Control keeps an additive artifact/checkpoint copy;
- a timeout during a GitHub write is `UNKNOWN` until the exact branch ref/file is fetched;
- do not create a duplicate concept file "just in case";
- no runtime work is implied by recovery.

## 17. Current decision / next gate

**Decision:** Persist the prison venue and Toy Soldier ↔ recurring heel relationship as a promising POST-MVP concept. Black Knight is the preferred existing-source visual/body candidate, but final character identity, name and tragicomic biography remain open until source-isolated visual review and writing development.

**No new gate is added.** Existing deferred minigame gate remains:
`MINIGAME_FLUFF_SOURCE_AND_OWNER_AUDIT`

When that broader source/owner audit is eventually authorized, add Prison Island as one scoped subsection:
- Toy Soldier source/owner;
- Black Knight source candidate;
- S13.2 prison-cell recipe viability;
- `wall_gated` / cell props;
- interaction/ChatterBox/save ownership;
- any CCTV/graffiti/breakaway assets still SOURCE_REQUIRED.

Until then: concept only, no implementation.
