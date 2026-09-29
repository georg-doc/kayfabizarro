# RECOVERY · KFB Town Resident Social Memory + AIDA · 2026-09-28

Status: **CRASH-SAFE CHECKPOINT · DESIGN SLICE · NOT RUNTIME IMPLEMENTATION**

Repository: `georg-doc/kayfabizarro`  
Branch: `chatgpt-web/town-resident-social-memory-2026-09-28`  
Verified branch head after timeout: `3075ed044b27a32e0f68a6cd0ad33626bbcd96a4`

## What the timeout affected

The GitHub write that extended the resident design with **Points of Interest, routine activities, personal goals/motivations and the KFB AIDA gameplay loop** returned no visible completion response in chat.

Per KFB timeout policy it was treated as **UNKNOWN**.

Recovery inspection proved the write **did land**:
- exact branch head: `3075ed044b27a32e0f68a6cd0ad33626bbcd96a4`;
- `skills/chat/town/references/KFB_RESIDENT_SOCIAL_MEMORY_AI_TOWN_2026-09-28.md` blob: `55e53537265cf4e908ff04b45f90fee8da3cb049`;
- sections `17 · Points of Interest` through `25 · Updated first productive implementation later` are present;
- both `## 17 · Points of Interest are the perception surface` and `## 21 · KFB AIDA gameplay loop` were read back from GitHub.

Do **not** retry that write.

## Current design stack

```text
world / encounter truth
→ bounded perception / POI candidates
→ Attention
→ Curiosity / Interest
→ Expectation
→ Interaction
→ Reaction
→ interpret / Lean Memory / social-thread update
→ return / resume / retarget
```

Language/performance seam:

```text
ChatterBox / semantic Triplet / selectable retort
→ optional context-valid Fluff-o-lect
→ Reaction Choreography
→ source-backed animation / body / face / ears / mouth / Emanata
→ consumer-owned recovery
```

## New post-timeout content now safely persisted

### POIs

POI classes include:
- player;
- Resident / NPC;
- Cube Pet;
- plants / trees / natural objects;
- landmarks / buildings / environment features;
- resource nodes;
- loose props;
- Cards / MediaSurfaces;
- activity stations;
- vehicles;
- temporary social events;
- hazards/obstructions.

POI is a **query/view layer over current world objects**, not a second Asset Registry or world database.

### Sight / range / search

Four tiers:
1. immediate contact / near field;
2. visible attention field;
3. deliberate local semantic search;
4. remembered/reported target that must be revalidated on arrival.

No whole-world scan per frame.

### Routine activities

Existing source-backed candidates include:
- Hammer/Hammering;
- Chop/Chopping;
- Dig/Digging;
- Pickaxe/Pickaxing;
- Saw/Sawing;
- Fishing_*;
- Work_A/B/C / Working_A/B/C.

Existing Overworld direction already includes:
- fishing;
- mining gold/ore;
- chopping wood;
- transporting/using resources;
- faction-specific routines.

Georg's additive direction adds:
- patrol;
- explore;
- inspect;
- gather/collect;
- carry/deliver;
- tend/care;
- rehearse/play music;
- rest/socialize;
- return-home / return-to-post.

### Personal goals / motivations

Stable motivations may include protection/duty, making/repair, gather/trade, perform, help, investigate/curiosity, explore, patrol, socialize, collect Cards/objects, preserve a place/resource.

Concrete current goals can compete. Goal conflict is the conflict motor but does **not** automatically imply hostility or Combat.

### KFB AIDA loop

For both player and NPC:

```text
ATTENTION
→ CURIOSITY / INTEREST
→ EXPECTATION
→ INTERACTION
→ REACTION
→ INTERPRET / REMEMBER / UPDATE THREAD
→ RETURN / RESUME / RETARGET
```

This is Georg's current KFB gameplay definition for this slice, not the classic marketing acronym.

## Sources already pinned before timeout

- `georg-doc/ai-town@2693ed6973e3461204385c9d11fb3aca4e8e3a7a`
- current Town Living;
- ChatterBox/Tourbus reuse;
- Fluff-o-lect source;
- Brick Fish PR #254;
- Reaction Choreography PR #256.

## Newly verified source donors to add to SOURCE/TEST metadata

1. `tools/KFB-ToolBox/_handover/RESIDENT_SCENE_MODULES_WSA_2026-09-19/BACKLOG.md`
   - blob `38323ce5a72c479ca5017d3daa1aa0508494c7ba`
   - source-backed Resident Activity candidates.

2. `overworld/docs/LIVING_CONCEPT_overworld.md`
   - blob `8f9e3c70c5046ce7b0e63698d500129a27975207`
   - established resource/faction routines and interruptible living-world activities.

Patrol/explore and the AIDA sequence are Georg's current additive direction; do not mislabel them as facts from those older sources.

## Existing evidence before AIDA extension

- source reads: **11/11 PASS**
- SOURCE.json parse: **1/1 PASS**
- design invariants: **12/12 PASS**
- runtime/browser/Stage: **0** by design

These counts must be updated additively after the two new donor pins are entered.

## Reserved future Stage route

`https://kayfabizarro.pages.dev/kfb-hub/stage/town/resident-social-memory-01/`

Status: **NOT DEPLOYED**.

No standalone proxy review page.

## One next implementation gate

**RESIDENT-SOCIAL-MEMORY-01**

The first real integrated proof should now include:
- two real Residents;
- one source-backed routine activity + clean interruption/resume;
- bounded sight/range POI candidate set;
- one motivation-backed attention choice;
- one expectation;
- one interaction;
- Reaction Choreography;
- optional ChatterBox/Triplet;
- one context-valid Fluff-o-lect variant;
- witness-specific Lean Memory only if the result matters;
- one bounded social thread;
- return to routine/path/dialogue or retarget to a new goal.

## Continue from here

1. Update `SOURCE.json` with the two newly verified routine/Overworld donor pins.
2. Update `TEST_REPORT.md` with new AIDA/POI/routine invariants and actual counts.
3. Update Town Session/Router/Changelog/Hub metadata to mention POI + AIDA + routines.
4. Write `RETURN.md`.
5. Open/update a Draft PR.
6. Read back exact final branch head and intended files.
7. Do not deploy Stage or promote Live in this design-only slice.


## Execution lane clarification · Web-first, WSA/Work escalation only

Current binding process from `skills/chat/workflows/KFB_WEB_FIRST_EXECUTION_V1_2026-09-22/START_HERE.md`:

- **ChatGPT Web/GitHub is the default KFB production lane** for recovery, planning, architecture, repository implementation, tests/CI, donor extraction, debugging, bounded repair, Return/changelog/Hub metadata and fresh-chat handoffs.
- **Claude Design** is the visual-authoring specialist when needed.
- **Work / WSA is escalation-only**, only when a concrete capability is unavailable or impractical in Web/GitHub/Claude, such as private/local binary movement, exact simultaneous local multi-repo checkout, OS/browser automation, a hard local cross-repo runtime seam or final packaging that cannot be done through GitHub.
- If there is no concrete missing capability, **do not use Work**.

The later `PRODUCTIVE_REVIEW_GATE_POLICY.md` further qualifies the older HTML-review-first wording:
- do not manufacture a zero-install/Stage review artifact merely because a slice ended;
- prefer implementation and evaluation in the **real WorldBuilder / ToolBox / Resident / Travel / Combat owner surface**;
- technical evidence stays internal unless Georg has a concrete product decision to make.

Application to this slice:
- continue Resident Social Memory / POI / Routine / AIDA design and repository work in **ChatGPT Web + GitHub**;
- do **not** wait for WSA/Work;
- do **not** create a standalone review HTML or Stage page for this design contract;
- escalate to Work only later if the real integrated RESIDENT-SOCIAL-MEMORY-01 hits an actual Web capability gap.


## Fresh-chat shorthand

Use:

> **KFB WEB PUSH/READ — Town Resident Social Memory — recover + continue**

This invokes the repository-documented shortcut in `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`: recover current GitHub truth, keep the existing owner/branch, continue Web/GitHub-first, persist before long chat prose, read back every write, treat timeouts as UNKNOWN, and avoid Work/WSA or human review surfaces unless a concrete capability/decision requires them.


## Additive recovery checkpoint · Officer Doppel-Denk · 2026-09-28

Latest verified design checkpoint before this Recovery write: `0a36500fbb16835ea9b2b3bc9dc79cbba721b3ba`.

New durable profile:
`OFFICER_DOPPEL_DENK_RESIDENT_PROFILE_2026-09-28.md`

Working name: **Officer Doppel-Denk**. Technical source remains `toy-soldier`.

Source/evidence updates:
- source manifest now contains **15** entries, adding current Resident Atlas Toy Soldier and Motion Registry pins;
- general design checks remain **20/20 PASS**;
- Officer-specific source/profile checks: **6/6 PASS**;
- no runtime/browser/Stage test is claimed.

Recovered continuation state:
```text
closed present
→ existing one-time reveal
→ Officer emerges
→ rifle march/patrol
→ resident-specific order/disorder POI scan
→ inspect/admonish/interact
→ ChatterBox/Triplet + Reaction Choreography as needed
→ Lean Memory only if socially meaningful
→ resume patrol
```

First POI examples: Brick Fish exchange, Tiny Treats pizza slice, plant/path obstruction.

Open animation seam updated: Georg identified Mixamo **`Walk with Briefcase`** as the priority external donor because its right arm already carries a load while the left arm keeps a normal walk swing. It is **USER-IDENTIFIED / NOT YET ADMITTED / NOT PINNED**. Preferred intake is In Place → existing Motion Library → retarget to `Rig_Medium` → exact Toy Soldier rifle at `handslot.r` → small right-arm/attachment fit only if needed. World/navigation remains translation owner. `Running_HoldingRifle` and `Walking_A/B` remain A/B/fallback candidates.

The single next gate remains **RESIDENT-SOCIAL-MEMORY-01**; Officer Doppel-Denk is the preferred first character-specific overlay inside that integrated proof, not a separate runtime or proxy Stage.


## Additive recovery checkpoint · Resident Dance Culture · 2026-09-28

Latest verified design checkpoint before this Recovery write: `72a403fbc9d6c836f8e093389e1ebfbdde38d819`.

New durable design:
`RESIDENT_DANCE_CULTURE_2026-09-28.md`.

Source stack expanded to **20** pinned entries with:
- Motion Library v2b dance catalogue (**24 dance entries**, Rig_Medium + Rig_Large);
- Resident Disco shared transport and pairing candidates;
- Orc Band real beat clock + accepted Legacy Orc B `orb.bounce`;
- Player Meta STRAND M progression ownership;
- versioned Journey save/export/import donor.

Recovered design state:
```text
music POI/event
→ Resident enters Common Bounce
→ shared song transport keeps group coherent
→ resident-specific Signature Move inserts on phrase boundary
→ return to Common Bounce
→ optional Brick Fish / social reaction interruption
→ re-enter groove on legal beat/bar
```

Player collection state:
```text
UNKNOWN
→ DISCOVERED (observe / join / teach context)
→ LEARNED / PERFORMABLE
```

Persistence owner: **Player Journey / Meta**. Preserve teacher Resident, source event and learning method. Learned dance moves do not consume Backpack slots.

Compatibility rule: collected move identity is semantic. Rig_Medium/Rig_Large use compatible Motion Library mappings; Legacy/CubePet/non-humanoid families use their own owner-specific adapters or remain temporarily unperformable without losing the unlock.

First authoring route: existing Animation Studio / Motion Library should define Common Bounce and resident Signature mappings/motion slices; do not create a second Dance runtime.

Evidence: **20/20 source reads · 20/20 general design invariants · 6/6 Officer checks · 12/12 Dance Culture checks PASS**. Runtime/browser/Stage remain 0.

The single next integrated gate remains **RESIDENT-SOCIAL-MEMORY-01**, now expected to consume the Dance Culture layer when the first Animation Studio mappings are available; no separate proxy Dance Stage is required.


### Dance collection interaction refinement

Learned Signature Moves are reusable **social tokens**, not dead collection entries.

When the player performs a learned Signature inside an actor's attention field, emit `dance.signature.perform` with performer, move, origin Resident, witnesses and source-event provenance. The original teacher may join, approve, correct, challenge with another move, parody, ignore or recall the teaching event through their own Reaction/Memory profile. Other Residents recognize the move only when their authored knowledge or memory supports it.

A tiny bounded `dance_exchange` thread may open and then return both actors to Common Bounce or their prior activity. Player Journey remains authoritative for the unlock; Resident Lean Memory may store only the socially meaningful teaching/use event.


## Additive recovery checkpoint · Resident Gift Culture · 2026-09-28

Latest verified design checkpoint before this Recovery write: `d0d9751b5b6d5a7099cf75b5039de2bb0ded8377`.

New durable design:
`RESIDENT_GIFT_CULTURE_2026-09-28.md`.

Source stack expanded to **23** pinned entries with:
- Santa `Santa.glb` + five exact wrapper variants `Present_A–E`;
- Helper_A / Helper_B;
- Helpers toy-workshop GLTF tree;
- existing Toy Soldier reveal source already pinned as the timing/unwrap donor.

Recovered Gift Culture state:
```text
real gift wrapper + real payload
→ giver offers
→ recipient notices / expects meaning
→ accept / refuse / inspect
→ Toy-Soldier-derived anticipation/pop reveal
→ character-specific Reaction Choreography
→ optional ChatterBox/Triplet
→ validated ownership/provenance update
→ keep / use / regift / countergift / prank
→ bounded escalation if warranted
→ reconcile / cooldown / return
```

Hard separations:
- wrapper identity is never payload identity;
- dialogue/LLM never creates or transfers an object;
- player-facing durable gift provenance belongs to Player Journey / Meta;
- real item ownership stays with existing inventory/world owner;
- prank/exploding present is social/Kayfabe cartoon violence by default; Combat owns real damage only if explicitly invoked.

Failure Spiral working budget:
`warm/neutral → tease → slapstick → Kayfabe blowout → reconciliation/cooldown/return`.

Future North-Pole scene is separate and source-first:
- verified: Santa, Helper_A/B, Present_A–E, Candycane, Drawers, Glue A/B, Hammer, Lamp_Workbench, Toy trains, Toy workbenches;
- still `SOURCE_REQUIRED`: winter/North-Pole environment and exact Holiday/Jingle-Bells-like audio source.

Evidence: **23/23 source reads · 20/20 general design invariants · 6/6 Officer · 12/12 Dance Culture · 15/15 Gift Culture PASS**. Runtime/browser/Stage remain 0.

Single integrated next gate remains **RESIDENT-SOCIAL-MEMORY-01**. Gift Culture should enter after the basic POI/AIDA/reaction/resume seam and first Dance mappings; no separate Gift-game runtime or proxy Stage.


### KISS correction · Gift Culture persistence

**SUPERSEDES the item-ledger implications in the earlier Gift Culture recovery checkpoint.**

Current rule:
- first-run gift props are scene-local/social by default;
- no Resident inventory economy, barter ledger, resource accounting or full prop provenance chain is required;
- persist only high-value semantic receipts when an interaction becomes meaningful: participants, intent/meaning, notable reaction/escalation, reconciliation and relevant witness provenance;
- do not persist routine wrapper colors/instances, every handoff, disposable prop ownership or low-value regift chains;
- optional GPT-Site persistence may hold a tiny `ResidentMemoryReceipt` collection; the visible interaction must work without it;
- a later real inventory system may attach an external item ref if a specific gameplay use requires durable ownership.

Priority remains **Behavior → Reaction Choreography → emotional expression → compact meaning-memory**, not item administration.


## Additive recovery checkpoint · Resident Signature Decks · 2026-09-28

Latest verified design checkpoint before this Recovery write: `05b0f95f384a5fd94b30021c6839ccdcf6f08206`.

New durable design:
`RESIDENT_SIGNATURE_DECKS_2026-09-28.md`.

Source stack expanded to **25** pinned entries with:
- current `media/kfb/index.json` deck metadata;
- structured Anti-Rules source JSON;
- existing Town Signature/Favourite/Catchphrase-Deck decision and ChatterBox donors already pinned.

Recovered architecture:
```text
stable Resident identity
+ signatureDeckRef / cluster
+ authored stance
+ 3–7 high-salience Signature Cards

current POI / interaction
+ 1–3 relevant Deck Cards
+ small Lean Memory set
→ ChatterBox / Triplet / retort
```

Deck content is authored knowledge, not episodic memory. Lean Memory stores only meaningful Card encounters, arguments, promises, returns or changed interpretations.

Card-recovery KISS loop:
```text
player discovers Cards naturally
→ Almanac / Player Journey records normal collection truth
→ matching Resident treats them as salient
→ next visit batches newly relevant Cards
→ one reaction / ChatterBox beat / Deck-thread update
→ player keeps discovery record
```

Do not create one courier interaction per Card by default. Full Deck completion may remain a long-form collection goal while Resident reactions occur at authored milestones.

Current source counts are variable: Anti-Rules 57/16, 9/11 Money Trail 60/15, Big Bad Brain Wrestling 56/15. No 56/15 hard-code.

Officer Doppel-Denk first candidate:
- Deck: `anti_rules_toolkit` / The Anti-Rules Manifesto;
- stance remains open: `misreads-as-law` vs `confiscate/destroy` vs `archivist/evidence-locker`.

Evidence: **25/25 source reads · 20/20 general design invariants · 6/6 Officer · 12/12 Dance Culture · 15/15 Gift Culture · 6/6 Gift KISS · 12/12 Signature Deck PASS**. Runtime/browser/Stage remain 0.

Single integrated next gate remains **RESIDENT-SOCIAL-MEMORY-01**. Its content preparation now includes a small first Resident→Deck mapping pass before the real Card-POI/ChatterBox proof; no new parallel Deck runtime or proxy Stage.


## Additive recovery checkpoint · Social Card Relay · 2026-09-29

Latest verified design head before this Recovery write:
`614aeff4f32af6c0dbecc3ef85e4c9ebd2c248cc`.

New durable design:
`RESIDENT_SOCIAL_CARD_RELAY_2026-09-28.md`.

New Site-process handoff:
`SITE_PROCESS_CHECKPOINT_RESIDENT_CARD_RELAY_2026-09-28.json`.

Recovered preferred loop:
```text
Resident A introduces Card
→ player discovers it
→ A asks player to show/pitch it to B
→ travel through living world
→ SHOW IT
→ SPIN IT
→ SELL IT
→ B reacts via identity + Deck stance + Lean Memory
→ ChatterBox / Reaction Choreography / optional counter-Card
→ compact semantic receipt
→ Residents resume
```

Source grammar stays separate:
- Freestyle entry: `NAME IT → CLAIM IT → POWER IT`;
- Town presentation: `SHOW IT → SPIN IT → SELL IT`;
- King synthesis: `Actor + 3 Scene + Quest`.

Priority:
- Resident interaction is the core game;
- Signature Decks supply worldview/Card pool/stance;
- lost-Deck search is optional, not universal;
- Free Roam/Race are connective travel;
- Combat/Card Zones are exceptional acquisition/proof;
- Almanac remains Card collection truth;
- King Kayfabulation is later synthesis/closure.

KISS relay state stores only Card ref, participants, presentation choices, outcome and one meaningful beat ref. No second Card inventory, Quest DB, Card corpus or minigame owner.

Site backend write is **not claimed**. The exact existing Site target and intended payload are frozen in the Site-process checkpoint with status `PENDING_TOOL_GAP`.

Evidence:
**27/27 source reads · 20/20 general design invariants · 6/6 Officer · 12/12 Dance · 15/15 Gift · 6/6 Gift KISS · 12/12 Signature Deck · 15/15 Social Card Relay PASS**.

Runtime/browser/Stage/Site-backend implementation remain 0.

Single next gate remains **RESIDENT-SOCIAL-MEMORY-01**. First Card proof: one real Resident→Player→Resident relay before any default Card-search grind.


## Productive runtime recovery · Social Card Relay · 2026-09-29

The earlier design-only Social Card Relay checkpoint has now been consumed by the real Travel Town runtime.

Receiving owner:
- `georg-doc/KFB-Travel-Globe`
- branch `chatgpt-web/resident-social-card-relay-01-2026-09-29`
- Draft PR **#40**
- runtime candidate `392d2b909afe3d26a25e2f64e3fdae19d1159273`
- closed recovery/handoff state observed at `a8aba4fdc4de8ece4d529cc9edcd4097ec876e05`

Runtime proof:
```text
existing Caveman
→ Anti-Rules / The Authority Figure
→ player discovery + carry state
→ existing King Kayfabian
→ SHOW
→ SPIN
→ SELL
→ visible reaction
→ semantic ChatterBox seed
→ semantic Reaction intent
→ one witnessed card-relay receipt
→ RESOLVED
```

Static/build evidence:
- `36498754015 / 109184348867`
- **140/140 PASS**
- build PASS
- verify PASS
- 0 missing
- artifact `11004492242`
- digest `sha256:65d52153ef902f87da88ec5c08b1e0cd911a61306e6caec11d2441f532f14cb6`

Final browser repair-pass evidence:
- `36498754082 / 109184348812`
- **27 functional Relay assertions PASS**
- real Card source observed as `remote-pinned`
- Relay reached `RESOLVED`
- artifact `11004023875`
- digest `sha256:da00d8545b7d28db444c8409505fc61919f97f1d256b90b45f9e70fab9440f98`
- screenshots: offer / Sell choice / resolved reaction

Overall browser gate remains **BLOCKED**, not PASS, because the host emits existing relative 404 requests:
- `/town/asset-repo.json`
- `/town/globe-v13/auswahl-georg.json`
- `/town/globe-v13/flora-auswahl.json`

These requests did not prevent the new Card Relay flow from completing.

Two browser repair passes are exhausted:
1. diagnostics proved the Relay's old 15 s mount deadline expired before real Town boot;
2. 90 s owner-ready wait fixed the mount race and proved the full Relay flow, after which only the pre-existing shared-host 404 gate remained.

**STOP. No repair 3.**

Travel full recovery:
`_handover/RESIDENT_SOCIAL_CARD_RELAY_01_2026-09-29/FAILURE_RECOVERY.md`.

Parallel Blender MCP gift/brawl/clay VFX work remains an external upcoming donor. Do not claim or integrate it until source-admitted.

Exactly one current next gate:
**TOWN-RESOURCE-PATH-01**.

Do not modify Social Card Relay runtime. Isolate the existing Town request owner, resolve/retire/classify those resource paths, then rerun the exact unchanged browser proof.

Public Stage remains **NOT DEPLOYED**. Live remains **NOT PROMOTED**.
