# KFB Game Loop R18 · The Rumour Mill / Egregore Fields / Card-Driven Social Resonance
2026-10-29 · GEORG CREATIVE STEERING + COMMENTED PROPOSAL · DOCUMENTATION ONLY

Owner: existing KFB_HUB/30_DECISIONS/replies on Draft PR #460, branch planning/kfb-game-loop-fluff-economy-r2-2026-10-29. Creative intake Georg/WS0; future consumers remain Card/Almanac, Resident Life/ChatterBox, Lean Memory, World/WS1, Media/HyperNorm and Audio. No second NPC knowledge engine or global world mind.

## 1 · Greater intent
**“You choose something. Ride the consequences.”** (corrected in R17.)

NPCs transmit ideas not only through literal Card handoffs but through gossip, competing rumors, quotations, allegations, slogans, jokes, memories, distorted accounts and sometimes deliberate propaganda. A claim may outlive, outrun or contradict its original Card. Two Residents who share no actual Card can nevertheless argue over its alleged meaning.

The in-world effect is a living *resonance space* between actual Card sources, character knowledge, narrative framing, social bonds, public performance and the player's independent interpretation. Rumor is neither automatically false nor automatically emancipatory. People may enjoy passing it on, refuse, verify it, ridicule it, or weaponize it. The same satirical mechanisms can carry official compliance phrases and self-declared anti-establishment insight.

**No predicted enlightenment, no mandatory ideological contagion, no universal world-belief score.** KFB is an optional Chill & Fun toy-world in which consequences can be social, funny, materially visible, contested or inconclusive.

## 2 · Four distinct forms of reception (not an enlightenment ladder)

- **HEARD ABOUT:** an NPC remembers an attributed account, slogan or rumor *concerning* a `cardRef` or topic, even without holding or reading the actual Card. This is NOT Card ownership and not automatically exact knowledge of Card Power/Lore.
- **SAW / VERIFIED CARD:** the actual canonical `deckId:cardNumber` was displayed, delivered, or inspected with source provenance. Seeing it does not mean agreeing, understanding or permanently owning the player's source Card.
- **CAN REFER / KNOWN:** Resident has a sufficiently meaningful exposure to refer to the verified content rather than repeating hearsay, with context/order in existing Lean Memory. This is a **candidate gameplay distinction** under the existing knowledge owner, not a new permanent level or arbitrary two/three-step unlock.
- **INTERPRETS / RESPONDS:** an attributed, potentially inconsistent stance: amused, doubtful, persuaded, curious, opposed, withholding, ambivalent, confused or silent. Never rewrite the original Card record or assign an author-approved opinion.

The same NPC can report a rumor accurately, reject it personally and tell a friend because it is entertaining. Another can believe an unfounded official slogan without any malicious motive. Actual belief and publicly performed role remain separate as in R7/R17.

## 3 · Lean gossip, selective retelling and bounded reach

**Conceptual event flow, not a runtime/API schema:**
`AUTHORED CARD EVENT → HEARER / OBSERVER → attributed, optionally altered RETELLING → real local listener → character-specific reaction → salient receipt / possible next encounter`.

Future integration should consume existing `RESIDENT_KNOWLEDGE_PROFILE`, resident identity/affect/activity and social relationship records, and R5 ordered first-exposure receipts.

**Plausible editorial lenses:** who said it, does the hearer know/trust them, what topic connects to their own Deck/job, did they witness it, how public is the room, what pressure or incentive is present, does the rumor clash with recent lived experience? These are soft salience/routing cues, **not** a psychology equation or conviction detector. A direct source remains distinguishable from a thirdhand assertion.

**Bounded processing:** only real encounters, a relevant NPC-to-NPC contact and a small named set of significant ideas; active scene/relevant POI priority; bounded retelling hops and time/space; deduplicate old hearsay, avoid spamming repeats, decay minor chatter; persist source/time/origin attribution for salient deviations. No instant faction-wide broadcast, unbounded recursive propagation or always-on LLM per Resident. Quiet daily life remains default.

Each retelling may keep, exaggerate, omit, question or invert *one* aspect through authored templates/context. The narrative change is attributable to a Resident, not automatically a seeded random rewriting of a factual Card. A ChatterBox Triplet can perform it if useful, but silence or one sentence often works better.

**Meaningful acquisition:** a rumor may motivate an NPC to request an authentic Card, inspect it, receive a courier delivery or enter a longer exchange. There is no fixed number of dialog steps guaranteeing a belief/knowledge upgrade. Player Card uniqueness, source authenticity and finite rewards remain unchanged. No imaginary or duplicated canonical Cards.

## 4 · Egregores and morphic fields as optional in-fiction imagery

**Existing authentic Deck seed:** `deep_state_plumbing:45`, **THE EGREGORE**, depicts a collective thought-form in which group belief makes a monster seem real. Its registry entry has `mappingVerified:false` and `page:null`: concept/text provenance exists, but do not assert the visual PDF crop is verified. Other useful source motifs include `help_i_am_a_human:19`, **EMOTIONAL CONTAGION** (also visual mapping unverified), and verified `platos_dungeon_raid_hero_set_01:19`, **Of the Useful Rumor**. Locate any specific older “1.4 egregore” design source before treating that reference as an already approved production rule.

**Diegetic metaphor:** a repeatedly performed claim acquires public form through actual people and media: a mascot; a slogan covering signs; a costumed collective; a new contradictory HyperNorm montage; a grotesque temporary clay icon; a bizarre staged group ritual. The apparent “Egregore” can be a manifestation of collective attention and institutional behavior, **not a cosmic truth oracle or automatically an actual supernatural creature**. A figure can believe an autonomous thought-field summoned it; another can claim a PR agency made it. Both are character accounts.

**Science/fiction distinction:** esoteric egregores are occult thought-form concepts. Rupert Sheldrake's morphic resonance is a controversial speculative hypothesis without robust established evidence for noncommunicative transmission of learned ideas. For any normal KFB NPC spread, use witnessed dialogue, media, social contact and memory rather than mysterious psychic transfer as factual game-engine causation. The fiction may leave cosmological explanations open. Relevant source background: Sheldrake's original formative-causation proposal and Gómez-Marín (2021) BioEssays review; research on social information spread supports a contingent network metaphor, not deterministic "ideas are infectious" laws.

**No mandatory “field balance meter”:** ideas may gather followers, split, fade, compete, become commercialized or return as a joke. Player closure remains free. Neither repeated group slogans nor minority resistance proves a statement true.

## 5 · Warburg neighbours, dissonance and the living world

An unfamiliar Card's topic can activate a real neighbouring Card, a dissenting example or an old gossip item in the *NPC's available reference set*. Aby Warburg's good-neighbour analogy is an **editorial discovery technique**, not a universal semantic-vector oracle. Mismatched Deck claims may create competing interpretations; different NPCs might misremember how they first heard them.

**World's apparent viewpoint** is distributed across attributed inhabitants, factions, newspapers, signs, buildings, Emanata and temporary performances. The terrain itself does not develop a hidden global political opinion or consciousness module. A newly covered Billboard, a crowd chant, an embarrassed archivist or an unused newsstand can show the social consequences of a story in an expressive living toy.

## 6 · Small later paper comparison, not a runtime assignment

Use one mapped canonical Card, two source-owned Residents and one physical meeting/market POI. One NPC *hears a rumor* via a real intermediary; another receives/reads the authentic Card. Compare:
- first response to the same theme (source difference, not truth scoreboard);
- one retelling that changes emphasis with attributed speaker;
- a follow-up offer to inspect the real Card, with acceptance or refusal;
- one optional 2nd-hand social echo on later encounter and one silence outcome.

Check that `HEARD ABOUT` never becomes fake `OWNED`; real Card identity and source remain intact; the story changes only for informed witnesses; relevant receipts survive reload without viral infinite event generation; no forced redemption or contagion loop. No need for full simulation of emerging collective entities.

**NOT RUN:** 0 runtime, 0 browser, 0 actual playtests, 0 3D object-isolation proof. No current World R4 restart, Site/Stage/Live, new asset or Hub/central SSOT edits.

## One next gate
**WS0/Georg editorial intake of R18's distinct heard/seen/known/interpreted states and Egregore metaphor**, then choose whether to hand the smallest one-Card/two-NPC rumor comparison to the existing Resident/Lean Memory owner. Implementation only with separate authorization.

## Source anchors
- Current R17 `GAME_LOOP_RIDE_THE_CONSEQUENCES_FRAMING_REACTIONS_R17.md`, R5 `GAME_LOOP_SIGNAL_MEMORY_R5.md`, R3/R4 Card exchange/knowledge.
- `skills/chat/RESIDENT_LIFE_SEMANTIC_MODEL_PREP_2026-10-06.md` (dynamic rumors optional, not implemented) and `skills/chat/RESIDENT_REACTION_ENCOUNTER_MATRIX_PREP_2026-10-06.md`.
- `skills/chat/workflows/KFB_PLAYABLE_MVP_CONSOLIDATION_V1_2026-09-21/SITE_GODMODE_LEAN_MEMORY_ARCHITECTURE_2026-10-04.md`; current source-locked Card/Almanac pipeline.
- `registry/assets/v1/decks/deep_state_plumbing.json`, `help_i_am_a_human.json`, `platos_dungeon_raid_hero_set_01.json`.
- Gómez-Marín, 2021, BioEssays: `https://doi.org/10.1002/bies.202100055`; Sheldrake 1992 formative-causation paper `https://sheldrake.org/research/morphic-resonance/an-experimental-test-of-the-hypothesis-of-formative-causation`; Hundt & Seta, 2025/2026, `https://pubmed.ncbi.nlm.nih.gov/40135518/`; van Bavel et al., 2025, `https://pubmed.ncbi.nlm.nih.gov/40675888/`.
