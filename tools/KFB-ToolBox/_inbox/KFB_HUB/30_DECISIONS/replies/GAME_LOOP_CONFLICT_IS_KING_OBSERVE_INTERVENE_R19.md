# KFB Game Loop R19 · Conflict Is King / NPC Worldview Encounters / Watch or Intervene
29 Oct 2026 · GEORG CREATIVE STEERING + COMMENTED DESIGN · DOCS-ONLY, NO RUNTIME OR NEW CANON SSOT

**Bounded concept owner:** existing KFB_HUB `30_DECISIONS/replies`, same branch / Draft PR #460. **Receiving owners remain:** Resident Life (activity, affect, contact), ChatterBox (speaker/presentation/Triplets), canonical Deck/Almanac, Lean Event/Social Memory, current World/WS1 and media/motion/FX. Georg/WS0 alone accepts creative direction and authorizes a later consumer.

## 1. Greater intent
**Conflict is King.** Not “everyone argues” or “every matchup becomes fighting”: *a meaningful difference between two situated characters creates the possibility of an incident*. A clash can involve their true Card knowledge, secondhand rumors, incompatible assumptions, different jobs or incompatible intentions, even when both want a similar end. Sometimes they cooperate, misunderstand, laugh, remain silent, become friends, walk away or keep a disagreement unresolved.

**Universe in a Nutshell. You choose something. Ride the consequences.** NPCs have social lives before the player arrives. Their interactions with one another and with canonical Cards can produce emergent *comic* meanings without a hidden philosophical tutor, ideological correct-answer route or global World AI. Player can **watch** the encounter or **intervene** as another character in the fiction; both are legitimate Chill & Fun paths. The meaning belongs to participants and player, not to an omniscient simulation verdict.

## 2. Source-aligned existing design lineage
- `skills/chat/town/LIVING_KFB_TOWN.md` **J-13**: Monkey-Island dialogue presents **what one might say**; *the joke lies in choosing, not branching*. **J-14**: heard retorts become optionally available later; listening is a collection affordance. **J-15**: encounter beats are upstream; animation and text layer each decide how to express them.
- `tools/KFB-ToolBox/_inbox/KFB_CHATTERBOX_STUDIO_CLAUDE_DESIGN_SESSION_CUT_2026-10-05_r2/docs/chatterbox-studio/RETURN.md`: a local **Monkey-Island Exchange** fixture among other ChatterBox scenes, including curated answers, bubble and presentation controls. The fixture is not verified integration into the current World. `CURRENT_STATE.md` notes TUNE / acceptance open; a Triplet stage runs with source-copy candidate corpus, **no source-backed current Card art, no face/mouth rig**. Do not promote it as an accepted game owner.
- `overworld/docs/MASTERPLAN_overworld.md`: Georg’s *Kayfabe Sims + Super Bizarro Mario + Hitchhiker’s Guide + Monkey Island on Acid* direction. The older Overworld runner has interaction bubble choices; it is **historical**, not a current World consumer proof.
- **Karaoke / Speaker’s Corner**: `skills/chat/town/LIVING_KFB_TOWN.md` and `overworld/docs/ANTWORT_ChatterBox_v2.md` explicitly say these are **OPEN HOOKS**, not playable/current shipped attractions. Here **Watch/Karaoke** names a proposed *noninteractive observation/performance mode*, not proof of voice/singing/live karaoke.
- `skills/chat/RESIDENT_LIFE_SEMANTIC_MODEL_PREP_2026-10-06.md`, `skills/chat/RESIDENT_REACTION_ENCOUNTER_MATRIX_PREP_2026-10-06.md`: current **planning** donors for local activity, proximity, salient reaction pulses, pause/resume, gestures, affect, one primary Emanatum and no compulsory LLM calls. Not a completed autonomous NPC social simulation.
- `replies/GAME_LOOP_SIGNAL_MEMORY_R5.md`, `GAME_LOOP_RIDE_THE_CONSEQUENCES_FRAMING_REACTIONS_R17.md`, `GAME_LOOP_RUMOUR_MILL_EGREGORE_FIELDS_R18.md`: ordered exposure, framed Card delivery, rumor vs source Card, bounded encounter memory. R15 remains **NO PHILOSOPHER KING**.
- `registry/assets/v1/decks/kayfabizarro_improv_comedy.json` **`kayfabizarro_improv_comedy:49` OBJECTION! (Yes, But...)** is a **mappingVerified:true** source Card that makes narrative contradiction explicit. This is a semantic donor, not a requirement to convert analog Power verbatim into a new UI statistic.

## 3. NPCs should meet through an actual world situation
Candidate situations arise when **two actual active/available Residents share a plausible POI, path, job, task, event or audience** and something in the local world supplies a concrete subject (a physical Card, prop, street, rumor, broadcast or recent event). Not a pair of randomly selected talking heads teleported into an empty arena.

**Matchmaking editorial cues** (soft, local, bounded, no new runtime contract):
- both NPCs are present, available, have a relevant motivation and can plausibly address one another;
- knowledge context includes authentic `deckId:cardNumber` sources, actual **HEARD ABOUT** hearsay refs, personal memory and firsthand observation; keep these distinct;
- select **semantic tension** that can be played physically: direct contradiction, shared topic/different cause, misaligned interests, literal/metaphorical misunderstanding, surprising Warburg good-neighbour adjacency, one character’s blind spot, a productive overlap or a mutually useful compromise;
- vary dialogue **disposition**: curious, amused, defensive, irritated, solemn, skeptical, conciliatory, opportunistic or indifferent, based on author-sourced character motives and situation;
- avoid simplistic pairing by ideology tags alone or “one Utopia versus one Dystopia” as a default. **Mismatch is an opportunity, not proof of automatic conflict**.

**Encounter seed:** `actual local subject + two present Resident refs + their exposure/relationship context + one concrete tension + expressive staging`. Use a bounded set of authored tension operators or safe source-backed templates, with deterministic seed-based variety only for noncritical choices. No vector similarity score may decide truth or create nonexistent Card lore.

## 4. Two interfaces, one ongoing encounter

### Watch / “Karaoke” / ambient performance
- The world can run a short performable beat as an **opt-in-to-attention**, never mandatory: a pair points at a thing, a reply or pause follows, then a gesture, prop interaction or anticlimax. A Triplet (SHOW IT / SPIN IT / SELL IT) can distribute three semantic functions **across speakers or actions**, but does not mandate three sentences, a song or a rap.
- Player may pass by, approach, keep listening, inspect the **actual** Card source, take a picture if product already supports it, or move on. No automatic acquisition or forced tutorial from just watching.
- Watch only emits a salient memory receipt if something in-world actually changed (an argument, handoff, posted sign, real rumor transmission, meaningful relationship event), not for every ambient line.

### Intervene / Monkey-Island choice
- The player can enter **the same ongoing event without resetting it** and choose a few grounded responses: **ASK** (what did you actually see?), **SHOW CARD** (a canonical source from inventory), **COUNTERPOINT** (a sourced conflicting Card/learned retort), **PERFORM/PROVOKE** (a role-specific satirical line), **LEAVE**. This is a suggestion for future control integration, not a new approved button row.
- Existing J-14 **heard retorts** can enrich available choices and make listening rewarding, but no secret answer or mandatory dialogue tree. Silence, refusal and rejection remain valid.
- A player who frames a Card as “dangerous rumor”, “public truth”, “curiosity” or “commercial pitch” affects **speaker attribution and reaction**, not an underlying canon truth bit. Real NPC personalities may respond differently to identical content depending on who delivered it and who watched.

### Transition and continuity
The encounter has one state owner. Watching and intervening use one scene context and the same receipts. Intervene may interrupt the NPC interaction, redirect it, cause it to continue with a new subject or fail to attract attention. A paused encounter resumes only if participants are still there and willing; otherwise it ends coherently. No branching narrative explosion.

## 5. Cheap believable emergence, not an AI debate simulator
**Suggested limited sequence, not an implementation schema:**
`LOCAL CONTACT / SUBJECT → SELECT ONE MEANINGFUL TENSION → SHORT REACTION/PERFORMANCE → OPTIONAL PLAYER INTERVENTION → ACTOR-SPECIFIC AFTEREFFECT → SALIENT LEAN MEMORY RECEIPT → RETURN`.

- Scheduler considers residents already colocated and not busy; it should not stage conflicts everywhere. Ordinary quiet talk, work, music, trade and walking remain dominant.
- Small author-reviewed pool of ~4–6 *types* of tension is enough for a first experiment; numbers are **test planning**, not a global constant.
- Keep one high-priority reaction pulse, existing gestures/face/Emanata/audio layers, and clear interruption budget. Some scenes should have only two exchanges, some no words; comic timing does more than long AI monologues.
- Triplets and human-written phrases can carry base scenarios; optional LLM escalation for unusual questions only after a future governed receiving-owner gate, with strict source/no-invented-Card checks. No AI-to-AI unlimited conversations, no per-NPC perpetual inference.
- R18 **heard/about / seen / known / interprets** and R5 order continue to matter. NPCs can mistakenly argue over a Card neither has read. Later learning the source need not change either opinion.
- Lean Memory stores actual meaningful witnessed actions and source/retort refs, not entire transcripts, real-user beliefs or forced “enlightenment”. Feedback is physical/social: gesture, broken clipboard, altered sign, slammed book, awkward silence, neighbor leaving, temporary crowd; world has no private omniscient “opinion”.

## 6. Real Card paper fixture, no invented art
One candidate pairing of actual **mapped** source Cards:
- `forget_utopia:1` **The Glossy Horizon**, PDF mapping verified (page 2, quadrant 0): polished future as a persuasive *reflection*.
- `embrace_protopia:2` **The Erasable Line**, PDF mapping verified (page 2, quadrant 1): pencil and revision as a process.
Two *actual selected* existing Residents should inhabit one concrete source-verified place; **do not invent or hard-code a replacement NPC/scene** at editorial stage. They could both want a better future and quarrel about whether it should be presented as complete or revisable. That difference can be enacted through real model surface/prop staging rather than explanatory debate. No predetermined “Protopia NPC wins”.

**Tiny comparison when authorised:** Same residents+Cards, observe with no input; then replay with a player ASK or SHOW intervention; then a third variation with a different exposure order and a late rumor. Evaluate distinct motives, physical comedy, source clarity, state continuity and whether it remains enjoyable while walking past. Record actual source rig/object and browser/Save proof **only later**, not inferred now.

## 7. Safety, philosophy and scope
Conflict is a **narrative generator**, not coercion to argue; laughter, respect, aggression, deadlock and exit can all be consequences. Do not hard-code “critical mind wins”, equal factual evidence, propaganda triumph, faction-wide instant knowledge or forced moral transformation. The actor’s lived stakes and other residents' refusal rights remain real in-fiction. Comedy is not an excuse to dehumanize a target. Accessible controls and skip/reduced-motion remain future consumer needs.

Source status: verified GitHub design/Deck data; **no live current World integration proven**. Karaoke and Speaker’s Corner still OPEN; ChatterBox local fixture TUNE; NPC social life planning donors not accepted as shipped. Docs-only: runtime tests **0**, browser tests **0**, game playtests **0**, isolated asset donor proof **0**. No new runtime/Stage/Site/Live/Hub or World R4 reboot. R9–R11 prior local drafts remain outside this PR.

**One next gate:** WS0/Georg editorial intake of **“Conflict is King” as situational tension with optional Watch/Intervene**; choose whether a future existing Resident/ChatterBox owner should demonstrate one actual two-NPC/two-Card encounter, including isolated source visuals, before any World consumer implementation.
