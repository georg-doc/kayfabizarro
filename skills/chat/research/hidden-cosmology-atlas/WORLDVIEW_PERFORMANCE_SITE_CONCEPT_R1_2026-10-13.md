# KFB Worldview Performance — GPT Site / Game Integration Concept R1

**Date:** 2026-10-13  
**Status:** USER-REQUESTED PRODUCT DESIGN / PROPOSAL; NOT BUILT, NOT PUBLISHED, NOT PLAYTESTED  
**Research owner and branch:** Existing KFB Editorial Research, `georg-doc/kayfabizarro`, `research/hidden-cosmology-atlas-2026-10-13`, Draft PR #394.  
**Future receiving runtime owner:** The **existing KFB ChatterBox / Resident Dialogue semantics owner**, with Resident Life/Affect and KFB Audio retaining their respective responsibilities. A GPT Site is a proposed **authoring / testing / performance workbench** and must not become a competing game dialogue owner.  
**Delivery policy:** GPT Site first *if/when a Site build is separately authorized*; do not publish a Cloudflare Stage or create a replacement Site from this planning task.  
**Language:** All artifact/content/UI/performances in English; direct discussion with Georg in German.

## 1. Product north star

A player presents a real KFB Card, topic, question, world/scene context or heckle. A **canonical KFB fictional Resident** (for example a KFB Clown) consistently inhabits a *researched worldview lens* based on one named author and delivers a fast, sharp, source-compatible and funny explanation, monologue, rebuttal or extended improvised dialogue.

The Resident is not a literal impersonation or fake recording of the researcher. The distinct layers are:

1. **Author worldview (source truth)**: internally coherent author-specific cosmology, claimed causal mechanisms, priorities, rhetorical premises, known/unknown subjects, stated doubts and real supporting passages. Keep full original source as recoverable provenance.
2. **KFB fictional actor/persona (character truth)**: established Resident identity, role, relationships, social stakes, conflicts, impulses, emotions, comic dialect, physical business and in-world situation. Character is not reduced to the author; the same Clown can switch worldview lenses without changing his canonical identity.
3. **Performance (scene truth)**: spoken argument adapted to the actual Card/player remark/context, rapid turns, escalating stakes, callbacks, stagecraft, interruptions, reversals and punchlines. Never pass invented jokes as literal researcher quotes.

**Immersion rule:** The fictional Resident stays in character throughout the performance; author and sources appear as provenance in a separate **inspectable non-diegetic source drawer or post-scene notes**, not as forced spoken disclaimers. The Resident can answer sceptical or hostile heckles forcefully without breaking character. Nothing requires the player to agree; satire emerges from motivated characters and the player's choices.

## 2. Source discovery and responsibilities

### Existing source and owner contracts inspected

- `skills/chat/workflows/KFB_PLAYABLE_MVP_CONSOLIDATION_V1_2026-09-21/DECK_WORLD_SEED_CARD_PIPELINE_2026-10-04.md` (main Git blob `15f8fce5428bfc6c2725b9e3042e9a8a83966468`): KFB Deck `deckId + cardNumber`, canonical PDF art, per-Card JSON `cardName/power/lore/grade/artworkPrompt`; derived `CARD_SEMANTIC_SEED`, `WORLD_KNOWLEDGE_PROFILE` and `RESIDENT_KNOWLEDGE_PROFILE`; no duplicate Card DB in NPC memory.
- `skills/chat/masterplan/CHATTERBOX_TOURBUS_REUSE_2026-09-14.md` (main blob `9025a43f042cf055d19851c9a93a6ddd016e3c36`): existing semantic/NIE → performance mask → ChatterBox → bubble/voice owner routes; v10/v13 donors require current receiver verification, and historical source existence is not product QA. Preserve event ownership and visible-speaker budgets.
- `skills/chat/KFB_NEXT_RUNTIME_MVP_VOICE_ACCEPTANCE_2026-10-08.md` (main blob `19c6e177c5043c96d32dbd762f5cdee602c5c770`): KFB ChatterBox is dialogue semantic owner, KFB Audio controls mix/ducking and source-backed voices, Resident Life/Affect is gameplay state owner; no second AudioContext. The Four-Island R4 world STOP and subsequent visual gate are not overridden by a research Site.
- `skills/chat/KFB_GAME_BIGGER_PICTURE_REFERENCE_2026-10-04.md` (main blob `cddaf7de44436dc1a1c763d58649eeb38d318e68`): pull-not-gate, Cards → world → Resident worldview → Triplet → Almanac; players can accept, reject, remix, ignore. A character should make offers and face consequences, not deliver mandatory tutorials.
- KFB Fractal Canvas/semantic neighbor research remains a separate later lens; no hexagonal format imposed on initial source corpus.

### Source storage and retrieval proposal

Each worldview is **source-backed**, reference-based and versioned, not an opaque generic persona prompt:

- `AUTHOR_ID` — named thinker (for source catalog only), publication/episode index and direct citations, exact excerpts where permitted, speaker attribution, source-native certainty.
- `WORLDVIEW_LENS_ID` — authored projection of an author's recurring ontology, named actors, principles, causal arguments, motifs, historical time models and implicit questions, derived from source refs.
- `CONCEPT_INDEX` — shared glossary and cross-author claims: source author identity remains intact and edges never silently merge theories.
- `RESIDENT_ID` — immutable fictional KFB character; existing actor/casting/relationship state.
- `CARD_REF` — canonical `deckId + cardNumber` and fetched Card fields/PDF art, not a second proprietary card schema.
- `CONTEXT` — world/POI/time/player remark/player relationship/previous turn and current stakes.
- `PERFORMANCE_SCRIPT` — generated source-connected dramatic beats, spoken text, source IDs and stage actions; optional playback compatible with existing Voice mixer.

Store full author originals in the existing research archive/Library or properly referenced source store. Use a compact verified topical passage set to construct each LLM request; don't stuff entire Decks/interviews into one prompt or clone whole source corpora into every Resident. Sources can be updated without changing the game's character ID, or replacing canonical Card source.

### Attribution and absent coverage

For any exact topic (e.g. Tartaria), select passages that really discuss it and only then assign them to the active worldview lens. An author may not have a documented position on a Card's exact subject. Record **topic coverage** as `EXPLICIT`, `NEIGHBOR` or `NOT_DOCUMENTED_IN_CORPUS`; these are retrieval scopes, **not researcher truth ratings**. "NOT_DOCUMENTED" does not mean the author never spoke about it: run a targeted source-discovery pass before concluding the current corpus has no direct coverage.

If the exact claim is absent, the fictional Resident can produce a *source-consistent conceptual extension* only with clear editorial provenance outside the scene (`KFB_EXTENSION`), never a made-up quotation or purported exact belief of a living thinker. Alternatively the Resident may pivot to a genuinely source-backed adjacent claim **in character**, maintaining humor and momentum. A generic invented "Author X believes Y about Tartaria" is a **source-fidelity FAIL**.

## 3. Product interactions / output modes

**Input avenues:**
- select canonical KFB Card (`deckId + cardNumber`) with preview of actual source art and exact `power` / `lore`;
- enter open-ended player question or heckle, optional remark/mood;
- reference a scene, quest, NPC event, encountered Resident or current world;
- select one or more available worldview lenses and one canonical Resident.

**Output modes (proposal):**
- `HOT_TAKE`: rapid 15–35-second viewpoint burst, one sharp dramatic conflict;
- `STAND_UP`: coherent 60–180-second stand-up-like story with premise, mounting examples, callback and punchline; generated only from sources/authorized KFB fiction;
- `DEEP_MONOLOGUE`: expandable longer spoken argument with continuity and substantive sourced material;
- `HECKLE_AND_RETORT`: player interrupts or challenges; Resident maintains position, reacts to their actual words, and can escalate/deflate without leaving character;
- `CROSS_EXAM`: two KFB Residents adopt different researched worldview lenses and dispute the same Card without turning into generic "pro/con AI" roles;
- `SPIN_THE_CARD`: KFB Card interpreted through multiple lenses, one at a time, with previous replies retained as scene context.

**Site concept** (not a proposed generic dashboard or a separate game runtime): one intimate **KFB performance bench**. It shows one **actual canonical Card or user topic**, the **actual KFB Resident** in its already approved visual language, a compact worldview lens selector, the spoken/scripted act as a scene, player heckle/reply channel, and optional research provenance after the scene. No replacement branding, avatar headshots used as fake actor rigs, fake Card art, generic chat chrome, generic gag library, token-count scoreboards or second actor runtime. Before any design/implementation, show source Card, actor and UI donors **in isolation** and verify original object identity.

**Performance durations** are options, not mandatory word quotas. The short mode can reuse semantic Triplets when appropriate; the longer stand-up and argument modes are **not forced** into exactly three phrases. The verified Triplet source-to-bridge postmortem is a negative Golden against flattening an author's extended explanatory line into a fabricated causal bridge.

## 4. Scene construction: source worldview × KFB cartoon craft

**Writer's Room requirements:**
1. Establish the active author's actual interpreted causal model and choose the exact source passages for the specific topic.
2. Establish the fictional Resident's current dramatic objective and relationship to the player. In what way could the player interfere with the Resident's certainty, status or plan?
3. Write an argument that **does something**: make a case, pressure the player, ask a question, make a wager, refuse, recruit, insult, misdirect or reveal a contradiction in context.
4. Allow fast-paced delivery, interruptions, escalation, timing, surprise, material stage actions, callbacks and a sufficiently earned final turn. Prefer concrete consequence and character conflict over abstract jokes, canned one-liners, bureaucratic metrics or "AI meta" humor.
5. Retain substantial source substance when the output is long; change comic expression, not the worldview's central causal architecture.
6. Keep clear ownership of any creative extension. A stand-up premise invented for the KFB Clown is allowed **as KFB fiction**. An invented quotation, fact attributed to a person or claim that a researcher personally made is not.
7. In-world speech remains in-character. Speaker/source distinctions, narrative gaps and factual traceability are inspectable by humans outside the scene. If the player directly asks for original citations, the character can trigger/point to that view without delivering a generic AI disclaimer.

**Style priority:** An authored KFB cartoon character's voice and situation **plus** the research author's worldview *logic*. Never claim to reproduce a living comedian's exact performance, vocal identity or verbatim invented remarks. Create distinctive KFB satire with maintained worldview coherence instead.

## 5. Example interaction / Tartaria Card

**Example requires selecting an actually existing canonical Tartaria Card** in the verified Deck registry. The product must first resolve its PDF artwork, authored `power` and `lore`; a user-mentioned topic alone is not proof the named Card exists.

Input:
- `cardRef` (verified canonical)
- `residentId = existing KFB Clown`
- `worldviewLens = kurt_metzger` or `michael_wann`, `david_icke`, `dark_journalist`, `catherine_austin_fitts`, `jason_reza_jorjani` or `joseph_farrell`
- `mode = STAND_UP`
- question: "What really happened to Tartaria?"
- follow-up: player directly challenges the Resident's interpretation.

**Outcome contract:** Seven possible perspectives can produce seven genuinely distinguishable *source-supported explanations*. A missing source for a specific author's Tartaria position must remain visible in provenance; the tool may request deeper research, use an explicitly editorial neighboring extension or route to an author with coverage. Do not invent seven Tartaria theories to satisfy a numerical target.

**After interaction:** Player can ask a follow-up, switch lens without changing the Card, compare with a second Resident, continue as a skit or save an encounter provenance link into existing Fractal Almanac/Lean Memory where authorized. Researcher persona never becomes a fake KFB Citizen/Resident identity in the game state.

## 6. Proposed execution sequence — no implementation authorized here

**R0 — Source-aware concept dossier (this document):** Source families, owners and product interaction contract. Already design-only. No new public route.

**R1 — Corpus coverage benchmark (research owner):** Choose **one real Card with source-backed relevance** and **two source-rich differing author lenses**, exact source passages, one accepted KFB Resident and a question/heckle. Collect transcripts and speaker citations. Isolate actual Card + Resident/model + dialogue owner donors. This is the cheapest critical gate.

**R2 — Performance contract/prototype (existing ChatterBox semantic owner):** Implement only the smallest safe adapter for `CardRef + ResearchLens + Resident + Context → PerformanceScript + Provenance`; demonstrate one source-faithful 45–90-second stand-up and one improvised retort. One builder, independent source fidelity critic and independent humor/gameplay critic. Sources/author names must be selected from the research corpus, not empty fake personas.

**R3 — GPT Site authoring bench (Site-capable WSA only after R1/R2 proof and named authorization):** Reuse existing Site/product identity when an actual receiving KFB dialogue/Triplets workbench exists. Publish as primary GPT Site, verify exact revision. Keep the production game semantics owned by the existing ChatterBox/Resident integration. No Cloudflare mirror unless explicitly accepted as necessary.

**R4 — Game handoff:** Once accepted, integrate through existing Resident/ChatterBox, Card identity, bubble/TTS/mixer, scene/Lean Memory and Almanac provenance APIs. Work within world MVP current gate; no R4 repair or R5 promotion silently authorized.

## 7. Prebuild acceptance matrix proposal

- **Source fidelity:** 100% of performance-specific researcher attributions resolvable to exact primary passages or explicitly marked authored KFB extensions; zero fabricated verbatim quotations.
- **Role fidelity:** fixed canonical KFB Resident identity, no out-of-character generic model prose in the performed line.
- **Worldview distinction:** two source-rich author lenses provide meaningfully different causal chains for the same stimulus. Do not use superficial signature words alone as proof.
- **Player challenge:** one live interruption is understood and answered in character with consistent source logic.
- **Comedy craft:** a human editorial audition evaluates concrete beats, status reversals, escalation and earned punchlines, not a generic "funny = pass" score.
- **Card correctness:** source identity stays `deckId + cardNumber`, exact Card PDF/JSON present, no replacement art or manufactured Card.
- **Memory and audio:** tested only when those receivers are actually implemented; bubble readable with audio muted; audio layer adds no second AudioContext.
- **Failure behavior:** missing direct author coverage does not become fake attributed lore or a canned explanatory disclaimer; no silent deletion from researcher source corpus.
- **Site verification:** no public or live claims before exact GPT Site verification (and Cloudflare only if later required).
- **Source-isolation proof:** donor Card/Resident/voice/director source components shown in isolation before combining into a prototype.

## 8. Research agents / reviewer separation

- **Corpus Scout** discovers original author works and relevant episode/source IDs.
- **Attribution Editor** checks exact speaker/passages, source-native certainty and omissions; does **not** apply external belief labels.
- **Worldview Mapper** builds attributed concepts, relationships and author-distinct models.
- **Performance Director** converts one reviewed lens into KFB fictional acting and staged argument.
- **Independent Source Critic** looks for misplaced author claims, forged quotes, unexplained creative bridges and invented source coverage.
- **Independent Comedy/Play Critic** checks character-driven pacing, gamer intervention, specificity and consequence rather than criticizing unavailable WIP motion or voice behavior.
- **Production Guard** decides whether the source seam is an actual outcome blocker; after two non-improving repairs, freezes/quarantines the smallest seam and preserves its recovery export. No global STOP for noncritical side features.

Agents are **roles**, not automatic independent paid services or second code owners. Research can begin in Web Chat/NotebookLM and existing connectors; a later Site-capable WSA build needs its own authorization and scope. Site publication is not a prerequisite for research.

## 9. Decisions and boundaries

**KFB-WPV-001 — USER DIRECTION:** An in-character KFB Resident can adopt an author-derived worldview as a context-dependent *performance lens*, rather than impersonate the real author.

**KFB-WPV-002 — DESIGN PROPOSAL:** Build a source-backed worldview selector/performance bench with single-card/context inputs and non-diegetic provenance, not a new Chat/Voice engine.

**KFB-WPV-003 — DESIGN PROPOSAL:** Long monologues, stand-up sets, responsive heckles and multi-lens debates can use the current ChatterBox semantic pipeline without requiring fixed-length Triplets.

**KFB-WPV-004 — HARD OWNERSHIP BOUNDARY:** Source archive remains KFB Editorial Research; Card identity in Registry/Builder, Resident identity/state in the existing actor/life path, ChatterBox owns dialogue semantics, KFB Audio owns mixer/voice, world host owns performance events/Lean Memory.

**KFB-WPV-005 — NOT YET AUTHORIZED:** No brand-new independent Site/runtime implementation, game build, public Stage, Cloudflare, Live or automatic merge.

**One next gate:** `WORLDVIEW_PERFORMANCE_R1_SOURCE_AND_RECEIVER_FIT` — source-isolate one genuine Card, one actual KFB Resident donor, the existing dialogue/voice receiver and two source-rich author lenses, then test one source-faithful monologue and heckle in an editorial audition *before* a Site implementation.
