# RETURN · KFB Town Resident Social Memory + POI/AIDA · 2026-09-28

Status: **DESIGN REFERENCE CANDIDATE · DOCUMENTED / TESTED · NOT IMPLEMENTED**

## Repository / owner / route

- Repository: `georg-doc/kayfabizarro`
- Owner: **KFB Town design reference**
- Branch: `chatgpt-web/town-resident-social-memory-2026-09-28`
- Draft PR: **#272**
- Base: `main@67f28c955b8dfeb10085d9d09c895e004edb6614`
- PR head immediately before this Return commit: `1f881520db1debaf929befd940ee61f229da1da5`
- Reserved future Stage route: `https://kayfabizarro.pages.dev/kfb-hub/stage/town/resident-social-memory-01/`
- Stage status: **NOT DEPLOYED**
- Live status: **NOT PROMOTED**

The final branch head is the commit containing this Return and is verified through the branch ref / PR after this write.

## Outcome

Persisted one bounded architecture/design slice for Residents as recurring inhabitants with:

1. **Lean Memory**
   - compact, witness-specific event receipts;
   - `witnessed / told / inferred` provenance separation;
   - no full transcript or omniscient shared knowledge pool;
   - bounded resumable social threads for gifts, promises, Cards, banter, arguments, work and performance continuity.

2. **AI Town donor use**
   - pinned `georg-doc/ai-town@2693ed6973e3461204385c9d11fb3aca4e8e3a7a`;
   - reuse only the mechanisms: compact episodic memory, top-k retrieval, relevance/recency/importance, cooldowns and async cognition;
   - no Convex requirement, no AI Town runtime port, no second NPC database/dialogue engine.

3. **ChatterBox / Triplets / Fluff-o-lect**
   - existing ChatterBox/semantic Triplet/selectable-retort lineage remains language owner;
   - Fluff-o-lect may omit the carrying word only when shared memory or visible world context makes meaning recoverable;
   - micro-reactions need no LLM call.

4. **Points of Interest**
   - player;
   - Residents/NPCs;
   - Cube Pets;
   - plants/nature;
   - environment/landmarks;
   - resources;
   - loose props;
   - Cards/MediaSurfaces;
   - activity stations;
   - vehicles;
   - temporary events;
   - hazards/obstructions.
   
   POIs are a semantic query/view over existing world objects, not a second Registry.

5. **Perception / range / search**
   - immediate contact / near field;
   - visible attention field;
   - deliberate local semantic search;
   - remembered/reported target that must be revalidated by the world owner.
   
   No whole-world scan per frame.

6. **Routine activity**
   - source-backed donors: Hammer/Hammering, Chop/Chopping, Dig/Digging, Pickaxe/Pickaxing, Saw/Sawing, Fishing_* and role-specific Work;
   - established Overworld resource routines: fishing, mining gold/ore, chopping wood, transporting/using resources;
   - Georg additive direction: patrol, explore, inspect, gather/collect, carry/deliver, tend/care, rehearse/music, rest/socialize, return-home/post;
   - routine is resumable and does not reset to generic Idle after every encounter.

7. **Personal goals and motivations**
   - authored stable motivations + short-lived current goals;
   - personal goals affect POI salience/search;
   - competing goals form a conflict motor without automatically implying hostility or Combat.

8. **Shared KFB AIDA gameplay loop**
   - applies to both player and NPC:
   `Attention → Curiosity/Interest → Expectation → Interaction → Reaction → Interpret/Remember/Update Thread → Return/Resume/Retarget`;
   - mismatch between expectation and result is a natural source of surprise/comedy/conflict;
   - return/resume is part of the loop, not cleanup after it.

9. **Physical acting seam**
   - Brick Fish PR #254 remains the social prop-toss candidate;
   - Reaction Choreography / Clay Emanata PR #256 remains the coordinated performance candidate;
   - world state, movement, damage, resources, persistence and rewards keep their existing owners.

## Machine-readable contract

`skills/chat/workflows/KFB_TOWN_RESIDENT_SOCIAL_MEMORY_2026-09-28/resident-aida-poi.v0.1.json`

Contains:
- 7 AIDA states;
- 12 POI kinds;
- four perception/search tiers;
- routine roles;
- motivation/current-goal examples;
- selection priority;
- memory write / do-not-write policy;
- return/resume policy;
- first implementation gate.

## Workflow shortcut

A natural-language shortcut is now documented on this branch in `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`:

> **KFB WEB PUSH/READ — <project or slice> — recover + continue**

Meaning:
- recover GitHub truth first;
- preserve current owner/branch/next gate;
- ChatGPT Web + GitHub is default;
- persist meaningful checkpoints before long prose;
- read back branch head + intended file after every write;
- timeout = UNKNOWN;
- Work/WSA only for a concrete missing capability;
- no manufactured REVIEW/Stage/Human gate;
- no auto-merge or Live promotion.

For this slice:

> **KFB WEB PUSH/READ — Town Resident Social Memory — recover + continue**

## Changed files

The branch changes these Town/router/Hub surfaces plus the bounded workflow package:

- `skills/chat/town/references/KFB_RESIDENT_SOCIAL_MEMORY_AI_TOWN_2026-09-28.md`
- `skills/chat/workflows/KFB_TOWN_RESIDENT_SOCIAL_MEMORY_2026-09-28/START_HERE.md`
- `skills/chat/workflows/KFB_TOWN_RESIDENT_SOCIAL_MEMORY_2026-09-28/RECOVERY.md`
- `skills/chat/workflows/KFB_TOWN_RESIDENT_SOCIAL_MEMORY_2026-09-28/SOURCE.json`
- `skills/chat/workflows/KFB_TOWN_RESIDENT_SOCIAL_MEMORY_2026-09-28/TEST_REPORT.md`
- `skills/chat/workflows/KFB_TOWN_RESIDENT_SOCIAL_MEMORY_2026-09-28/resident-aida-poi.v0.1.json`
- `skills/chat/workflows/KFB_TOWN_RESIDENT_SOCIAL_MEMORY_2026-09-28/OFFICER_DOPPEL_DENK_RESIDENT_PROFILE_2026-09-28.md`
- `skills/chat/workflows/KFB_TOWN_RESIDENT_SOCIAL_MEMORY_2026-09-28/RESIDENT_DANCE_CULTURE_2026-09-28.md`
- `skills/chat/workflows/KFB_TOWN_RESIDENT_SOCIAL_MEMORY_2026-09-28/RESIDENT_GIFT_CULTURE_2026-09-28.md`
- this `RETURN.md`
- `skills/chat/town/START_HERE.md`
- `skills/chat/town/SESSION_CARD.md`
- `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`
- `skills/chat/START_HERE.md`
- `skills/chat/CHANGELOG.md`
- `kfb-hub/index.html`

No runtime source file is changed.

## Actual evidence

From `TEST_REPORT.md`:

- source reads: **23/23 PASS**
- source manifest parse: **1/1 PASS**
- AIDA/POI contract parse: **1/1 PASS**
- design invariants: **20/20 PASS**
- Officer Doppel-Denk source/profile checks: **6/6 PASS**
- Resident Dance Culture source/design checks: **12/12 PASS**
- Resident Gift Culture source/design checks: **15/15 PASS**
- Gift KISS correction checks: **6/6 PASS**
- runtime tests: **0**
- browser tests: **0**
- screenshots: **0**
- Cloudflare Stage deployments: **0**
- Live promotions: **0**

This is a documentation/design PASS, not a runtime implementation PASS.

## Timeout recovery

One AIDA/POI design write returned no visible chat completion and was treated as **UNKNOWN**.

Recovery inspection proved it had landed at branch head `3075ed044b27a32e0f68a6cd0ad33626bbcd96a4`; the target design file contained the new POI/AIDA sections. The write was not duplicated.

Durable details are in:
`skills/chat/workflows/KFB_TOWN_RESIDENT_SOCIAL_MEMORY_2026-09-28/RECOVERY.md`.

## Unresolved / deferred

- actual receiving WorldBuilder/Travel runtime seam is not implemented;
- current concrete ChatterBox runtime donor must be pinned by the receiving consumer before implementation;
- actual sight distances, FOV/occlusion method and POI spatial index are deliberately not hard-coded here;
- patrol/explore require source-backed motion/route evidence where they become visible animation rather than navigation intent;
- Officer Doppel-Denk's desired shoulder-rifle march is **not yet accepted**. Georg has now identified Mixamo `Walk with Briefcase` as the priority external donor because of its asymmetric carry pose; it is USER-IDENTIFIED / NOT YET ADMITTED / NOT PINNED. Preferred path is In Place → Motion Library intake → Rig_Medium retarget → exact rifle attachment/pose fit. `Running_HoldingRifle` and `Walking_A/B` remain source-backed A/B/fallback candidates;
- resource availability/consumption stays world/resource-owned and is not defined by Lean Memory;
- Brick Fish PR #254 and Reaction Choreography PR #256 remain separate Draft candidates;
- current relevant ToolBox/WorldBuilder recovery blockers must be checked at implementation time;
- no public Stage exists for this slice;
- Common Bounce is design-only: no universal runtime clip/profile has been authored yet;
- Resident Signature Move assignments are audition candidates only, not final mappings;
- player dance discovery/learning events are not yet added to the Player Journey schema/runtime;
- generic gift wrapper/payload reveal choreography is not yet runtime-implemented;
- **KISS correction:** no Resident item economy, barter ledger or exhaustive prop provenance is required for MVP;
- barter/regift/exploding-present chains remain primarily semantic/visual design beats;
- future Santa/Helpers North-Pole winter environment and Holiday audio remain source-required.

## Exactly one next gate

**RESIDENT-SOCIAL-MEMORY-01**

Implement in the real receiving world, Web/GitHub-first. **Officer Doppel-Denk / `toy-soldier` is now the preferred first resident-specific overlay** for the routine/attention/reaction half of the proof:

- two source-proven Residents;
- one source-backed routine activity;
- bounded POI sight/range/search;
- one motivation-backed AIDA choice;
- one interaction;
- Reaction Choreography;
- optional ChatterBox/Triplet;
- one context-valid Fluff-o-lect variant;
- Lean Memory/social thread only when the result matters;
- clean return to routine/path/dialogue or deliberate retarget.

Do not create a standalone proxy review page. Use Stage only if/when the integrated world result becomes a meaningful human-review milestone.


## Additive checkpoint · Officer Doppel-Denk · 2026-09-28

Working character name: **Officer Doppel-Denk**. Technical Resident source remains `toy-soldier`.

Persisted character-specific layer:
- one-time closed-present → existing reveal → emerged state;
- march/patrol routine with clean interruption/resume;
- attention bias toward perceived disorder, obstruction, litter, noise, unsafe horseplay, unattended props, authority opportunities and royal-interest cues;
- Brick Fish, Tiny Treats pizza and plant/path obstruction as first POI mini-scenario examples;
- tragicomic authority/status dynamic with King K. Fabian and other Residents;
- ChatterBox/Triplet language ownership and Reaction Choreography ownership preserved;
- Lean Memory only for meaningful recurring authority/social outcomes;
- motion gate updated: Mixamo `Walk with Briefcase` is now priority candidate; prefer In Place, preserve left-arm swing, use right carrying arm as base, fit exact Toy Soldier rifle to `handslot.r`, and use only a small additive right-arm/attachment patch if needed. Keep world/navigation as translation owner. `Running_HoldingRifle` + `Walking_A/B` remain comparison/fallback donors.

Durable profile:
`OFFICER_DOPPEL_DENK_RESIDENT_PROFILE_2026-09-28.md`.

No runtime file, browser proof, Stage deployment or Live promotion was added by this checkpoint.


## Additive checkpoint · Resident Dance Culture · 2026-09-28

Persisted Georg's shared KFB music/dance direction as one reusable Resident layer:

- all compatible Residents/characters are music-positive and can enter a shared beat-driven **Common Bounce**;
- accepted Legacy Orc B `orb.bounce` is the behavioral donor; it is not falsely declared a universal skeletal clip;
- current Motion Library v2b provides **24 dance entries** for both `Rig_Medium` and `Rig_Large`;
- long dances may yield beat-aligned **Signature Move slices**, avoiding one new FBX per Resident;
- each Resident eventually gets one authored/learnable Signature Move mapping;
- Resident Disco pairings provide the first audition pool, including Toy Soldier, Witch, Avian, Black Knight, Demon Lord, FrizzleBob and others;
- group grammar is Common Bounce between phrase-boundary Signature inserts, with one shared song transport;
- Brick Fish / Reaction Choreography may interrupt a dancer, then return them to Common Bounce on a legal beat/bar;
- player starts with Common Bounce; Signature Moves progress `UNKNOWN → DISCOVERED → LEARNED/PERFORMABLE`;
- persistent ownership belongs to **Player Journey / Meta**, with teacher/event/method provenance; learned dances do not consume Backpack slots;
- collected move identity is semantic across avatars, so unsupported actor families keep the unlock without invalid retargeting;
- Animation Studio / Motion Library is the intended authoring/mapping surface, not a new Dance Studio runtime.
- learned Signature Moves remain reusable social tokens: performing one near its origin Resident may trigger recognition/join/correct/challenge/parody through the existing Reaction/Memory layers; Player Journey still owns the unlock.

Durable design:
`RESIDENT_DANCE_CULTURE_2026-09-28.md`.

Evidence: **20/20 source reads · 12/12 Dance Culture checks PASS**. Runtime/browser/Stage remain 0 for this additive design checkpoint.


## Additive checkpoint · Resident Gift Culture · 2026-09-28

Persisted Georg's gift-giving / barter / Kayfabe escalation direction as the third shared Resident culture layer.

Source-backed foundation:
- exact Santa pack: `Santa.glb` + five source wrappers `Present_A–E`;
- exact Helpers pack: `Helper_A/B` + Candycane, Drawers, Glue A/B, Hammer, Lamp_Workbench, Toy_Train_Paint/Wood, Toy_Workbench and decorated workbench;
- existing Toy Soldier reveal remains the presentation/timing donor for anticipation → pop → overshoot → settle.

Design rules:
- **wrapper != payload**: a present visual never replaces the actual object identity;
- giver intent and recipient interpretation are separate subjective layers;
- real object ownership changes only through existing world/inventory owners;
- Player Journey / Meta stores durable player-facing gift provenance;
- gifts can carry care, thanks, trade, reconciliation, teasing, satirical needling, prank, tribute or apology;
- `ResidentSocialThread kind: gift` carries bounded continuity rather than a new relationship system;
- prank/exploding presents default to non-Combat Kayfabe/cartoon violence; Combat owns real damage when explicitly invoked;
- Failure Spiral is bounded: warm/neutral → tease → slapstick → Kayfabe blowout → reconciliation/cooldown/return;
- reconciliation may use replacement gifts, source-backed shared food/drink, dance/Common Bounce, repair/help, apology or simple return to routine;
- later North-Pole Holiday Scene is separate: Santa + Helpers + toy workshop + presents, with winter environment and Holiday/Jingle-Bells-like audio still source-required.

Durable design:
`RESIDENT_GIFT_CULTURE_2026-09-28.md`.

Evidence: **23/23 source reads · 15/15 Gift Culture checks PASS**. No gift runtime/browser/Stage/Live claim.


### KISS correction · Gift Culture · 2026-09-28

Georg clarified that “barter society” is primarily a **content/behavior direction**, not a request for inventory/resource management.

Current MVP rule:
- gifts are visible social scene props + semantic interaction beats;
- props may be randomly selected/admitted and remain scene-local/disposable;
- Lean Memory stores only emergent high-value meaning: who interacted, the social intent/trait being exposed, notable reaction/escalation and reconciliation;
- do **not** persist every wrapper, gift instance, handoff, current owner or regift chain;
- no universal barter/resource ledger;
- if a later real inventory system exists, it may attach an external item reference without changing Gift Culture;
- optional GPT-Site persistence may use a tiny semantic `ResidentMemoryReceipt` store; visible interaction must still work with zero persistence.

This correction prioritizes Resident behavior, reactions, animation and emotional choreography over meta item administration.
