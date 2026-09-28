# KFB Town · Resident Social Memory · START HERE

Status: **DESIGN REFERENCE CANDIDATE · DOCUMENTED / TESTED · NOT IMPLEMENTED**  
Date: 2026-09-28  
Owner: **Georg / KFB Town design reference**  
Branch: `chatgpt-web/town-resident-social-memory-2026-09-28`

## Outcome

Connect the existing KFB Town Lean Memory direction with:
- `georg-doc/ai-town` as a **mechanism donor** for compact episodic memory, small top-k retrieval, cooldowns and async agent cognition;
- world-owned **Points of Interest** covering player, Residents/NPCs, Cube Pets, nature/plants, environment, resources, props/Cards and activity stations;
- source-backed **routine activities** plus current patrol/explore direction;
- small authored **personal goals/motivations** as attention and conflict drivers;
- a shared KFB **AIDA gameplay loop** for player and NPCs: Attention → Curiosity/Interest → Expectation → Interaction → Reaction → Interpret/Remember → Return/Resume/Retarget;
- existing ChatterBox / semantic Triplets / selectable retorts as the language owner;
- Fluffolekt / Fluff-o-lect as a context-dependent omission register;
- current Brick Fish social interaction candidate;
- current Resident Reaction Choreography candidate.

No second runtime, NPC database, dialogue engine, movement owner, reward owner or relationship score system is created.

## Read order

1. `skills/chat/START_HERE.md`
2. `skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`
3. `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`
4. `skills/chat/town/START_HERE.md`
5. `skills/chat/town/SESSION_CARD.md`
6. `skills/chat/town/references/KFB_RESIDENT_SOCIAL_MEMORY_AI_TOWN_2026-09-28.md`
7. `OFFICER_DOPPEL_DENK_RESIDENT_PROFILE_2026-09-28.md` — first resident-specific attention/reaction overlay
8. `RESIDENT_DANCE_CULTURE_2026-09-28.md` — Common Bounce, Signature Move mapping and player learning/collection
9. `RESIDENT_GIFT_CULTURE_2026-09-28.md` — gifts, barter, prank escalation, provenance and reconciliation
10. `RESIDENT_SIGNATURE_DECKS_2026-09-28.md` — worldview/ChatterBox Deck lens + Card-recovery threads
11. `RESIDENT_SOCIAL_CARD_RELAY_2026-09-28.md` — interaction-first Resident→Player→Resident Card loop + King synthesis
12. `SITE_PROCESS_CHECKPOINT_RESIDENT_CARD_RELAY_2026-09-28.json` — exact existing Site target + pending process payload
13. `SOURCE.json`
14. `TEST_REPORT.md`
15. `RETURN.md`

For implementation later, also read the **current heads**, not stale copies, of:
- Brick Fish / Prop Toss candidate;
- Clay Emanata / Reaction Choreography candidate;
- current WorldBuilder/Travel recovery/Return;
- current ToolBox/Resident actor recovery/Return;
- current Journey/Almanac persistence owner;
- current ChatterBox donor selected by the receiving consumer.

## Reserved Stage route

`https://kayfabizarro.pages.dev/kfb-hub/stage/town/resident-social-memory-01/`

Status: **NOT DEPLOYED**.

Do not create a standalone review page for the design contract. Use the route only when `RESIDENT-SOCIAL-MEMORY-01` exists as a meaningful integrated world milestone.

## One next gate

After relevant current recovery blockers clear, implement **RESIDENT-SOCIAL-MEMORY-01** in the real receiving world with:
- two real current Residents;
- one bounded POI perception/search loop;
- one source-backed resumable routine;
- one personal-goal/motivation-backed AIDA cycle;
- Brick Fish plus one Card/gift context;
- witness-specific event receipts;
- one bounded social thread;
- later recall;
- ChatterBox/Triplet speech;
- one context-valid Fluff-o-lect variant;
- coordinated Reaction Choreography;
- clean recovery to consumer-owned path/activity/dialogue state.


## Execution lane · Web-first / no Work by default

Binding current workflow:
`skills/chat/workflows/KFB_WEB_FIRST_EXECUTION_V1_2026-09-22/START_HERE.md`

For this Resident / POI / routine / AIDA slice:
- **ChatGPT Web + GitHub is the default production lane** for architecture, source recovery, contracts, implementation, tests, Return/changelog and owner integration;
- Claude Design is used only for visual/3D authoring where it materially helps;
- **Work / WSA is escalation-only** and needs a concrete capability gap that Web/Claude cannot perform;
- do not send routine Resident logic, memory, POI search, AIDA, ChatterBox integration, tests or metadata maintenance to Work;
- human review should happen in the real Resident/WorldBuilder receiving surface when a meaningful product decision exists, not through a proxy dashboard.

Historical delivery distinction:
- the older Astra Integration delivery contract required a native ChatGPT Site **and** KFB Cloudflare from the same source state when that specific runtime was delivered;
- a ChatGPT Site is therefore a possible private distribution/review mirror, **not a second runtime owner and not the default place where this work is authored**;
- current KFB acceptance links remain the direct `kayfabizarro.pages.dev` route when this slice reaches a meaningful integrated Stage milestone.

For the present design-only slice:
- no Work escalation;
- no ChatGPT Site deployment;
- no Cloudflare deployment;
- continue repository-native Web/GitHub persistence only.


## 2026-09-28 · POI / Routine / Goal / AIDA extension

The current design now also includes:
- POIs covering player, Residents, Cube Pets, plants/nature, environment/landmarks, resources, props, Cards/MediaSurfaces, activity stations, vehicles, events and hazards;
- bounded perception as immediate contact → visible attention field → deliberate local semantic search → remembered/reported target;
- source-backed routine roles for fishing, smith/work, chopping, digging, pickaxing, sawing and resource work;
- Georg's additive routine direction for patrol, explore, inspect, gather, carry/deliver, tend/care, music/rehearsal, socialize/rest and return-home/post;
- small authored motivations + concrete current goals as the conflict motor;
- the shared KFB AIDA loop for player and NPC:
  `Attention → Curiosity/Interest → Expectation → Interaction → Reaction → Interpret/Remember → Return/Resume/Retarget`;
- mandatory clean return to prior routine/path/dialogue or deliberate retarget instead of generic Idle.

Machine-readable contract:
`resident-aida-poi.v0.1.json`

Current evidence:
- **27/27** source reads PASS;
- **1/1** SOURCE manifest parse PASS;
- **1/1** AIDA/POI contract parse PASS;
- **20/20** design invariants PASS;
- Resident Dance Culture checks: **12/12 PASS**;
- Resident Gift Culture checks: **15/15 PASS**;
- Gift KISS correction checks: **6/6 PASS**;
- Resident Signature Deck checks: **12/12 PASS**;
- Resident Social Card Relay checks: **15/15 PASS**;
- runtime/browser/Stage remain 0 because this is design persistence only.

Fresh-chat shorthand:

> **KFB WEB PUSH/READ — Town Resident Social Memory — recover + continue**


## 2026-09-28 · First resident-specific overlay · Officer Doppel-Denk

Technical source remains `toy-soldier`; **Officer Doppel-Denk** is the working character name, not a replacement asset ID.

The first character overlay proves the intended uniqueness layer:
- gift reveal as one-time world entrance state;
- patrol/march as resumable routine;
- resident-specific Attention Bias toward perceived disorder, obstruction, litter, noise, unsafe horseplay, unattended objects and authority opportunities;
- Brick Fish, Tiny Treats pizza slice and plant/path obstruction as different POI interpretations of the same general AIDA contract;
- tragicomic authority dynamic: loyal to King K. Fabian, seeks recognition, commonly not taken seriously by other Residents;
- ChatterBox/Triplets remain language owner; Reaction Choreography remains physical response owner; Lean Memory stores only socially meaningful outcomes;
- `Running_HoldingRifle` plus `Walking_A/B` are source-backed audition candidates; no shoulder-rifle march is accepted until visually proven.

Source-backed profile:
`OFFICER_DOPPEL_DENK_RESIDENT_PROFILE_2026-09-28.md`

Additional profile evidence: **6/6 PASS**. No runtime/browser/Stage claim.


## 2026-09-28 · Shared Dance Culture + collectible Signature Moves

Music/dance is now a second shared Resident culture axis beside Brick Fish social play.

Design stack:
- **Common Bounce** = shared beat-driven groove semantic for all compatible actor families;
- Legacy Orc B `orb.bounce` is the first behavioral donor, not a universal binary clip;
- Animation Studio / Motion Library remains the authoring owner for Rig_Medium/Rig_Large mappings;
- each Resident eventually receives one learnable **Signature Move** or beat-aligned motion slice;
- Resident Disco pairings are the first audition pool, not final assignments;
- one shared music transport drives group timing; Signature inserts occur on phrase boundaries between Common Bounce phrases;
- Brick Fish/Reaction Choreography may interrupt dancing and actors return to the groove on a legal beat/bar;
- player starts with Common Bounce; Signature Moves are discovered/learned from Residents and persisted by **Player Journey / Meta**, not a second skill inventory or Backpack slots;
- learned move identity is semantic so incompatible avatar families may keep the unlock without forcing humanoid retargets.

Durable design:
`RESIDENT_DANCE_CULTURE_2026-09-28.md`.

Current evidence: **20/20 source reads · 12/12 Dance Culture checks PASS**. No Common Bounce runtime, final Signature mapping, player Dance UI or Stage deployment is claimed.


## 2026-09-28 · Shared Gift Culture / barter / prank / reconciliation

Gift-giving is now a third shared Resident culture axis beside Brick Fish play and Dance Culture.

Design stack:
- exact Santa source provides `Santa.glb` plus five real wrappers `Present_A–E`;
- December-2024 Helpers provide `Helper_A/B` plus toy-workshop props for a later North-Pole/Holiday Resident scene;
- Toy Soldier `Present_Base → Present_UnwrappedBase` remains the strongest reveal-animation donor, but its opened geometry is not generalized to Santa wrappers;
- Gift Culture separates **wrapperRef**, optional presented **payloadRef/payloadTags** and giver **intent**;
- **KISS baseline:** ordinary Resident gifts are social scene beats, not durable item transfers; do not build a Resident inventory/barter ledger or per-prop provenance chain;
- persist only meaningful semantic receipts (who, social intent/meaning, notable outcome/reconciliation); exact wrapper instance, routine handoff and disposable prop owner normally stay transient;
- Player Journey / GPT-Site persistence is optional for meaningful callbacks, not required for the visible gift scene; later real inventory may attach through its existing owner;
- gifts can be warm, useful, barter, teasing, satirical needling, prank, tribute, apology or reconciliation without creating a global relationship score;
- character-specific Reaction Choreography + ChatterBox/Triplets resolve the reveal; Lean Memory stores only meaningful provenance/outcomes;
- exploding/prank presents default to social/Kayfabe cartoon violence; actual damage only when Combat explicitly owns the event;
- bounded Failure Spiral: warm/neutral → tease → slapstick → Kayfabe blowout → reconciliation/cooldown/return;
- later North-Pole winter environment and Holiday/Jingle-Bells-like audio remain source-required and are not falsely attributed to Santa/Helpers packs.

Durable design:
`RESIDENT_GIFT_CULTURE_2026-09-28.md`.

Current evidence: **23/23 source reads · 15/15 Gift Culture checks · 6/6 Gift KISS correction checks PASS**. No gift runtime, barter/item economy, North-Pole scene, unwrap VFX or Stage deployment is claimed.


## 2026-09-28 · Resident Signature Decks / Card-recovery threads

This extends an existing Town decision: every NPC may have a favourite/signature/catchphrase Deck or individual selection inside a cluster; deliberate Moshpit mismatch remains valid and a Signature Deck is not a speech admission barrier.

Current design:
- Signature Deck belongs to **stable authored identity**, not Lean episodic memory;
- use `deckRef + stance` so the same Deck can be loved, misread, archived, confiscated, destroyed or parodied;
- ChatterBox retrieval uses current beat + Resident stance + **1–3 relevant Cards** + small memory set, never a full-deck prompt dump;
- each Resident may have **3–7 Signature Cards** with higher salience inside the broader Deck/cluster;
- Card POIs may open a small Deck search/recovery thread without creating a second Quest/Card inventory owner;
- Player Journey/Almanac remains Card-collection truth; showing/returning/confiscating a Card narratively does not need to erase the player's discovery;
- collect-the-whole-Deck may remain long-form, but Resident interaction is batched through meaningful Card/milestone beats rather than one courier transaction per Card;
- current Card index is source-driven: many Decks are 56/15, but Anti-Rules is currently 57/16 and the 9/11 Money Trail 60/15, so no Resident code may hard-code 56/15;
- Officer Doppel-Denk's first candidate is `anti_rules_toolkit`; his exact stance remains deliberately open between `misreads-as-law`, `confiscate/destroy` and `archivist/evidence-locker`.

Durable design:
`RESIDENT_SIGNATURE_DECKS_2026-09-28.md`.

Current evidence: **25/25 source reads · 12/12 Signature Deck checks PASS**. No final mapping table, Deck-ChatterBox runtime adapter, Card-recovery implementation or Stage deployment is claimed.


## 2026-09-29 · Interaction-first Social Card Relay + King Kayfabulation

Current preferred **design proposal** shifts Card gameplay toward Residents rather than landscape fetch as the default.

Core loop:
```text
Resident A introduces Card
→ player discovers/learns it
→ A asks player to bring/show/pitch it to Resident B
→ travel / world life
→ SHOW IT
→ SPIN IT
→ SELL IT
→ B reacts through personality + Signature Deck stance + Lean Memory
→ ChatterBox / Reaction Choreography / optional counter-Card
→ compact semantic Card-relay receipt
→ Almanac grows
→ later King Kayfabian synthesizes collected Cards
```

Source grammar remains separated:
- Freestyle Card entry = **NAME IT → CLAIM IT → POWER IT**;
- Town/Tourbus social performance = **SHOW IT → SPIN IT → SELL IT**;
- King synthesis = existing **Actor + 3 Scene + Quest** five-card Kayfabulation.

Product emphasis:
- Resident interaction / ChatterBox / emotional choreography is the core game;
- Free Roam/Race provide connective travel and interruptions;
- Combat/Card Zones provide exceptional missing-Card acquisition/proof rather than default Card collection;
- Signature Decks supply worldview, candidate Cards and stance; “lost Deck” remains one optional Resident motive, not universal;
- Player Journey / Almanac remains Card collection truth; narrative handoff does not consume discovery;
- Lean Memory stores meaningful Card-relay outcomes, not Card-instance bookkeeping;
- no second Card inventory, Quest DB, Combat, Race or Almanac owner.

Durable design:
`RESIDENT_SOCIAL_CARD_RELAY_2026-09-28.md`.

Current evidence: **27/27 source reads · 15/15 Social Card Relay checks PASS**. No runtime/browser/Stage implementation is claimed.

### Existing ChatGPT Site process mirror

Exact existing owner is **KFB Production Control** / project `appgprj_6ab82e3950b88191a8ead3c495e21454`. This chat can read its Library/Site metadata but exposes no direct Site/D1/R2 mutation action.

Therefore:
- no second Site was created;
- no Site write is claimed;
- intended process payload is durably stored in `SITE_PROCESS_CHECKPOINT_RESIDENT_CARD_RELAY_2026-09-28.json` with status `PENDING_TOOL_GAP`;
- GitHub remains the recovery truth until a Site-capable execution surface writes the exact same payload into the existing Site owner.
