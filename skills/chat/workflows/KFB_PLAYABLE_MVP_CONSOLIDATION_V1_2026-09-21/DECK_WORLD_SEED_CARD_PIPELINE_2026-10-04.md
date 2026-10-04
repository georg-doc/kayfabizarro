# KFB deck-driven world seed + Card pipeline contract · 2026-10-04

Status: **CURRENT MVP PLANNING CONTRACT · SOURCE-LOCKED · NO RUNTIME / STAGE / LIVE PROMOTION**
Owner: **KFB playable MVP integration**
Receiving world owner: **KFB WorldBuilder / WB2**
Planning branch: **georg-doc/kayfabizarro · main**
Stage route: **none for this planning checkpoint**
Purpose: bind the three Hannover future decks to WorldBuilder, Resident/NPC semantics, Fractal Almanac and the existing KFB Card rendering pipeline without creating a second card, world or ink owner.

Read with:
- `skills/chat/START_HERE.md`
- `skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`
- `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`
- `START_HERE.md`
- `SITE_GODMODE_LEAN_MEMORY_ARCHITECTURE_2026-10-04.md`
- `ONE_SHOT_PRECHECK_2026-10-04.md`
- current WB2 Recovery/Return

## 1 · Product direction

The four-island MVP uses KFB Town as the historical/current-world hub and the three exhibition future decks as the semantic seeds for the three satellite worlds:

- **Utopia** ← `forget_utopia` / *Forget Utopia*
- **Dystopia** ← `ignore_dystopia` / *IGNORE DYSTOPIA — Anatomy of a Trap*
- **Protopia** ← `embrace_protopia` / *Protopia Sketchbook — Deck C: EMBRACE*

The authored journey is deliberately non-linear:
- start in KFB Town;
- Town architecture/Track-Core gates make Utopia and Dystopia legible alternative routes;
- either route may be explored first;
- Protopia is reachable as the third-way/workshop world and can later become an alternate home/save anchor;
- no route is a mandatory moral quiz or a forced linear lesson.

The decks provide authored themes, motifs, Card identities and encounter seeds. They do **not** become a second world runtime or a procedural replacement for source-proven assets.

## 2 · Canonical Card source chain

### Deck identity / registry
Current registry shards:
- `registry/assets/v1/decks/forget_utopia.json`
- `registry/assets/v1/decks/ignore_dystopia.json`
- `registry/assets/v1/decks/embrace_protopia.json`

Each shard points to the canonical PDF and the corresponding card-text JSON.

### Semantic Card data
- `media/kfb/Deck_A_UTOPIA_-_Forget_Utopia_web_H.pdf.json`
- `media/kfb/Deck_B_DYSTOPIA_-_ANATOMY_OF_A_TRAP_web_H.pdf.json`
- `media/kfb/Deck_C_PROTOPIA_-_Protopia_Sketchbook_(1)_web_H.pdf.json`

These contain the authored per-Card semantic fields already useful to WorldBuilder/Residents:
- `cardNumber`
- `cardName`
- `grade`
- `power`
- `lore`
- `artworkPrompt`

No extra transcription/RAG-preprocessing pass is required before NPCs can reason over the authored text fields.

### Visual Card truth
The actual PDF/Card crop is the authoritative visual object. If an `artworkPrompt` and the final printed artwork ever differ, NPC/world visual claims follow the actual Card/PDF; the prompt remains authored semantic intent, not replacement pixels.

### Viewer
Current reusable reading surface:
- `KFB Comic Card Deck Viewer v4 (WS0)/KFB Deck Viewer.dc.html`

The Viewer is a consumer/presentation donor. It is not a second Card database.

## 3 · Card Builder / Ink / format owners

Current shared Card construction line:
- `skills/kfb-card-builder.js`
- `skills/kfb-ink-canon.js`
- `skills/kfb-card-format.js`

Read-first consolidated contract:
- `skills/EMBED_KFB_CardBuilder_Ink_FULL_v1.md`
- `skills/SSOT_KFB_CardBuilder_PDF.md`
- `skills/SSOT_Card_Ink_Outline_v2.md`

Rules:
- reuse the Builder; do not create another Card renderer;
- reuse `cardGrid` from the deck manifest/registry; no blind quarter crop;
- actual Card art comes from the source PDF;
- Card ink uses the canonical **BAND/card** family, not a new jitter loop;
- Card objects in 3D, Almanac detail views, billboards and Resident handoffs preserve the same `deckId + cardNumber` identity;
- Hero Shots/path images remain attachments/provenance, never replacements for the Card.

## 4 · World-seed use of the deck JSONs

The deck JSONs become an **authoring/reference layer** for `WORLD_RECIPE`, `BIOME_PROFILE`, Resident dialogue/context and media surfaces.

A world recipe may reference:
- one primary `deckId`;
- selected `cardRefs`;
- derived motif tags;
- architecture/prop cues;
- light/weather/audio cues;
- Resident/encounter hooks;
- media/billboard Card refs.

Derived tags are caches/authoring aids. The Card JSON + PDF remain provenance.

Do not auto-generate unproven replacement architecture from Card prompts. World Director/God Mode uses the prompts to search/compose from source-proven assets and existing procedural grammars.

## 5 · Utopia world seed · Forget Utopia

Authored semantic direction from the Deck A cards:
- polished promised future;
- frictionless/seamless systems;
- finished glass-city presentation;
- keynote/demo spectacle;
- metrics, queues, access tiers and closed-loop convenience;
- technology/automation/robotic inhabitants;
- seduction first, visible cost/maintenance second.

Representative Card seeds:
- `The Finished City`
- `The Cure-All Keynote`
- `The Moving Launch Date`
- `The Beautiful Mockup`
- `The Comfort Trap`
- `The Seamless Surface`
- `The Closed Loop`
- `The Core Question`

MVP spatial/visual heuristics:
- bright, clean, controlled light;
- glassy/cubic/brutalist-futurist massing compatible with source-proven KayKit/Sci-Fi/Kenney donors;
- CCTV/sensor/control motifs where source-backed;
- clean transit and robotic/automated presence;
- deliberately little visible repair/scaffolding in the public-facing layer, with service/backstage seams available for discovery.

This is an authored satirical future-world lens, not an instruction that the player must accept a political conclusion.

## 6 · Dystopia world seed · Ignore Dystopia

Authored semantic direction from Deck B:
- perpetual alarm / emergency;
- crisis loops and state-of-exception imagery;
- overload, fear, narrowed attention and surrender of agency;
- sealed rooms, no-off-ramp systems and repeating warning infrastructure;
- decayed/hostile/post-apocalyptic atmosphere;
- Demon Lord as principal Resident/anchor candidate.

Representative Card seeds:
- `The Doomsday Clock`
- `The Manufactured Crisis`
- `The State of Exception`
- `The Infinite Feed`
- `The Comfort of Doom`
- `The Narrowed View`
- `The Sealed Room`
- `The Surrendered Wheel`
- `The No-Off-Ramp`
- `THE CORE QUESTION`

MVP spatial/visual heuristics:
- darker/spooky light;
- damaged/eroded terrain and stronger vertical descent where useful;
- warning/broadcast/ruin motifs;
- constrained passages, loops and remnants of control infrastructure;
- Mordor/post-apocalypse energy without requiring a literal licensed imitation.

## 7 · Protopia world seed · Embrace Protopia

Authored semantic direction from Deck C:
- unfinished, repairable, revisable systems;
- visible seams;
- small experiments and incremental improvement;
- shared skills / mutual aid / practical making;
- direct observation and local know-how;
- farms, workshops, common spaces and hand-built infrastructure;
- nature-integrated, lively and human-scale rather than pristine.

Representative Card seeds:
- `The Open Notebook`
- `The Fixable Thing`
- `The Shared Skill`
- `The Invitation`
- `The Awkward Start`
- `The Done Thing`
- `The Made Thing`
- `The Pilot Move`
- `The Proof of Concept`
- `The Visible Seam`
- `The Plural Path`
- `The Nearest Lever`
- `THE CORE QUESTION`

MVP spatial/visual heuristics:
- natural terrain, farms/gardens/workshops and communal spaces;
- source-proven BlockBits/KayKit/Kenney modular farm/utility assets where suitable;
- visible repairs, additions and mismatched-but-coherent accretion;
- Lawkeeper/Lorekeeper and Farmer as strong Resident anchors;
- playful activity and social life; avoid sterile eco-utopia or pastoral kitsch.

The Deck C artwork style (`watercolor ink sketch, aged paper`) is semantic source flavor. It does **not** replace the global Playmation/Clay rendering SSOT.

## 8 · KFB Town historical hub · current biography direction

Town is not a fourth future deck. It is the historical/current-world origin and transport hub from which the three futures branch.

Current authored biography seed:
1. **Origin** — early Kayfabian settlement; Caveman belongs among the oldest Residents / Genesis-era population.
2. **First use** — practical settlement around the island resources, mine and market.
3. **Settlement** — residents, trades and public life accumulate around the central town/market.
4. **Institution / power** — King Kayfabian and the royal/civic layer become a comic/satirical power structure rather than a heroic absolute monarchy.
5. **Accretion / scars** — the mine becomes exploited/industrialized and revisited as an Activity; older personal histories remain in place, including Caveman/Eva tragicomic lore.
6. **Present day** — a lively, layered town whose roads/gates connect to the three satellite future-worlds.

Town may foreshadow all three deck logics through residents/media/architecture, but it does not collapse them into one theme.

## 9 · NPC / Resident use

Resident dialogue and Lean Memory may reference:
- canonical Card identity;
- Card `power` / `lore`;
- Card acquisition/provenance;
- current world/deck context;
- `artworkPrompt` as semantic motif metadata;
- actual PDF/Card art when discussing what is visibly depicted.

Examples:
- a Utopia Resident can discuss a Card's glossy/finished-city promise;
- a Dystopia Resident can connect an encounter to alarm/loop imagery;
- a Protopia Resident can respond to visible seams, repair or local skill motifs.

Do not store full Deck JSON copies per NPC. NPC memory stores stable Card/world/event references and rebuilds a small `NPC_MEMORY_VIEW`.

## 10 · Fractal Almanac / HUD

The Almanac fan shows collected canonical Cards from these same Deck identities.

Minimum chain:
`Deck registry → canonical Card ID → Card acquisition/provenance receipt → Almanac fan → Card detail`.

Card detail may expose:
- actual Card art;
- title;
- lore/power where appropriate;
- Resident/source;
- world/location;
- provenance events;
- optional Hero Shot attachment.

No placeholder Hero Shot may replace the primary collected Card object.

## 11 · Golden Journey direction now resolved enough for preflight

MVP journey shape:
1. spawn in KFB Town market/royal hub;
2. meet an initial Town/Protopia-linked Resident and receive/inspect a real Card;
3. see the three-world route structure;
4. choose **Utopia or Dystopia first**;
5. encounter at least one world-specific Resident/Card/media beat there;
6. travel toward/reach Protopia as the third-way/workshop world;
7. meet Lawkeeper/Lorekeeper and/or Farmer;
8. acquire another real Card and visible Almanac provenance;
9. return via Track Core;
10. save/export and fresh import/resume;
11. same Card identities, encounters and NPC continuity survive.

The exact first Card/song/performance module is still a fixture-selection decision. The route philosophy and Deck→World mapping are now fixed enough for world-recipe prework.

## 12 · Pre-One-Shot implementation consequence

Add one cheap source-lock/preparation item before the final integration lock:

**DECK-WORLD-SEED-01**
- prove four World Recipe fixtures: Town + three deck-backed satellites;
- each satellite references the canonical `deckId`;
- each has a small reviewed set of `cardRefs` + derived motif/biome tags;
- validate that Card IDs resolve through the registry;
- validate that Builder/Viewer render the same Card identity from the canonical PDF/crop contract;
- no duplicate Card DB / renderer / ink owner;
- no Player required for this proof.

This can be folded into `WORLD-MULTI-ISLAND-CORRIDOR-01`; it does not require a new standalone runtime.

## 13 · Protected boundaries

- WB2 remains world owner.
- Track Core remains route owner.
- Existing Registry remains deck/asset discovery owner.
- Existing Card Builder / Ink / format modules remain Card presentation owners.
- Viewer remains a consumer.
- PDF/Card art wins visual conflicts.
- Deck JSON semantic fields are reusable; do not re-author them into a second database.
- Playmation/Clay SSOT remains the 3D look owner.
- No didactic score or forced ideological route.
- No Stage/Live publication for this planning checkpoint.


## 14 · Fractal semantic spine · Deck → Card → Biome → Resident → Triplet

The same authored source should project at several scales instead of being copied into disconnected systems.

### DECK scale · WORLD_KNOWLEDGE_PROFILE
A deck defines the broad semantic prior for one satellite world:
- canonical `deckId`;
- world / island identity;
- worldview/concept weights;
- biome and terrain cues;
- architecture / prop / institution cues;
- light / palette / weather cues;
- audio / performance context cues;
- Resident archetype / occupation affinities;
- Billboard/media pool;
- ChatterBox register bias.

This is a **profile/reference layer**, not another dialogue or world runtime.

### CARD scale · CARD_SEMANTIC_SEED
Every Card can act as a local semantic seed inside its parent deck:
- `cardRef = deckId + cardNumber`;
- `cardName`;
- `power`;
- `lore`;
- `grade`;
- `artworkPrompt`;
- derived concept tags;
- possible POI / prop / activity / Resident affinities;
- possible Billboard/media use;
- possible Triplet relation hooks.

A Card seed may influence a local POI, Resident encounter, micro-biome, prop cluster or media surface without creating a new global biome class for every Card.

### BIOME / POI scale · projection, not duplicate truth
The world can derive authored presentation from the deck/card layer:
- island/zone palette and light;
- terrain mood;
- architecture families;
- source-proven asset search terms;
- local prop/activity density;
- Resident cast weighting;
- Billboard Card selection;
- ambient audio/performance context.

Derived fields remain reproducible caches. They point back to the source deck/card refs.

### RESIDENT scale · RESIDENT_KNOWLEDGE_PROFILE
A Resident does not own a private copy of the deck. It references:
- `primaryDeckId`;
- optional secondary/counterpoint deck weights;
- `signatureCardRefs[]`;
- known/encountered Card refs;
- profession/archetype/personality filters;
- local POI/world facts;
- social/Lean-Memory facts;
- current activity/context;
- per-topic salience weights.

This means two Residents in the same island can share world knowledge while remaining clearly different.

Example:
- Utopia residents share the `forget_utopia` semantic field, but a robot, bureaucrat and skeptical maintenance worker weight different Cards and motifs.
- Dystopia residents share `ignore_dystopia`, while Demon Lord, exhausted worker and alarm-pundit voice different parts of the same deck.
- Protopia residents share `embrace_protopia`, while Lawkeeper/Lorekeeper, Farmer and maker/repair Resident weight different practical concepts.

## 15 · ChatterBox / semantic Triplet binding

Reuse the existing ChatterBox/Overworld lineage. Do not build a second dialogue grammar.

Current donor rules retained:
- semantic upstream supplies content;
- faction/worldview + Resident identity filter it;
- ChatterBox owns speaker/timing/presentation budget;
- Bubble/Emote/TTS is output;
- Card has content priority ahead of generic faction chatter when contextually relevant;
- the player supplies closure rather than the NPC over-explaining the final beat.

For a Card/deck-backed Resident, Triplet generation should resolve from weighted source refs rather than free-floating generic prose.

Recommended semantic assembly:
1. **SUBJECT / SHOW IT** — concrete local thing: visible Card, object, event, Resident action, Billboard motif or world fact.
2. **CONNECTOR / SPIN IT** — relation selected from Card `power/lore`, deck concepts and current situation.
3. **REFRAME / SELL IT** — Resident-specific worldview/personality/social relation supplies the angle; leave enough semantic gap for player closure.

The three fields can be expressed as one short utterance, three beats, a Card sequence or an encounter arc. They are roles, not mandatory three-sentence output.

### Weighted source order
The runtime/content selector may use a normalized weighting layer such as:

`visible/recent Card → immediate local situation → Resident signature Cards → primary deck/worldview → relationship/social memory → local history → broader world context`

Exact numeric weights remain implementation data and must be tested in the real consumer. Do not hard-code historical ChatterBox constants as new universal defaults.

### Distinguishability requirement
A valid Resident voice test should demonstrate that:
- identical local event + different `primaryDeckId` produces materially different semantic framing;
- identical deck + different Resident profile produces materially different emphasis/register;
- the selected Card refs are inspectable in evidence/debug output;
- no output invents a Card title/concept that is absent from the source JSON unless explicitly marked generated association.

## 16 · Billboards, NPCs and Almanac share the same Card identity

A Billboard, Resident utterance and Almanac entry may all refer to the same canonical `cardRef`.

Example chain:
`cardRef → Billboard shows actual PDF art → Resident Triplet discusses its semantic concepts → Player acquires Card → Almanac records provenance`.

This is the preferred fractal relationship:
- **Deck** = macro-world semantic field;
- **Card** = micro-world / encounter seed;
- **Biome/POI** = spatial projection;
- **Resident worldview** = social projection;
- **Triplet** = sentence/beat projection;
- **Billboard** = media projection;
- **Almanac** = memory/provenance projection.

No layer rewrites the Card into a separate source object.

## 17 · One-Shot fixture consequence

Extend `DECK-WORLD-SEED-01` with one small ChatterBox proof:
- one canonical Card from each future deck;
- one Resident profile per future island;
- one shared neutral local event/interaction;
- source resolver returns the Card/deck refs used;
- each Resident produces a short semantic Triplet/beat that is distinguishable by world knowledge;
- the same Card can be rendered on a Billboard/Viewer and acquired into the Almanac by the same canonical identity.

This is a source/contract proof. It does not require open-ended LLM society simulation.
