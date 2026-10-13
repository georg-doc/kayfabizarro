# KFB Modular Storytelling · Perplexity/Google Doc research intake and operational triage R1
Date: 2026-10-13
Status: **SOURCE READ AND NORMALIZED · EDITORIAL REVIEW ONLY · ZERO NEW RUNTIME ACTIVATIONS**
Single receiving owner: existing KFB ChatterBox Voice / Triplet authoring branch `planning/kfb-chatterbox-voice-layer-v1-2026-10-08`, Draft PR **#379**, repo `georg-doc/kayfabizarro`. Research worldview original owner remains separate research PR **#394**; KFB Audio/Voice Acting site remains **#365**. Do not duplicate their data owners.

## Actual material read and limit
- Exact user-provided .docx, title **KFB Modular Storytelling Research: Openers, Fourth-Wall Sockets & Bridge-Free Beats**, 248,784 bytes, SHA256 `663787224c8804fa65d89c799416159c94367774cac3b8ae554708d7ff6dccfd`, read locally. The associated **native Google Doc was independently opened via Google Drive**, title identical, document ID `1w9dRLIK5rnO1nnv8K3VVxd4i8k2eWat0-YG9gzZwUuc`, verified original URL `https://docs.google.com/document/d/1w9dRLIK5rnO1nnv8K3VVxd4i8k2eWat0-YG9gzZwUuc/edit?usp=drivesdk`. One native tab contains eleven tables. No source document edit was requested or performed.
- The supplied NotebookLM notebook `https://notebook.google.com/notebook/957e16ed-9bc5-4f49-b8e5-ee9fffcfe165` **could NOT be opened or read by the available tools**. Its other uploaded sources, audio overviews, chat history and future changes have **NOT** been inspected. The Google Doc is the analyzed source; do not falsely claim NotebookLM synchronization or readback.
- The document is a **Perplexity-generated synthesis with linked references**, not a rigorously verified evidence corpus. Its theoretical/practitioner citations and links were extracted but not independently bibliographically audited during this intake. Document-authored KFB examples are explicitly called **design hypotheses, not verified Card outputs**; do not treat their `KEEP` labels as Georg-approved content.
- Important consistency issue: the narrative says **36 candidate operators**, but the seven twelve-column tables contain **43 DISTINCT IDs**: 25 OP-01…OP-25 (including pivots/pauses), 10 UP-01…UP-10, 8 FW-01…FW-08. Another text line says "Use six structures first" but enumerates BG-1…BG-8 (**eight**). Normalized all 43 with exact 12 source columns rather than silently omitting entries.
- Exact 43-row normalized source-derived catalogue: `data/KFB_PERPLEXITY_MODULAR_STORYTELLING_43_OPERATOR_RESEARCH_CATALOG_R1_2026-10-13.json`, unique IDs, original pattern/function/conditions/examples/evidence/verdict and `runtimeEnabled:false`. This is a **research bank**, not accepted production opener records.

## Most valuable source conclusions (not yet independently verified)
1. **Three independent contracts:** Beat Integrity (the Card/argument stands on its own); Conversational Interface (opener, interruption, player response); Sequence Relation (CUT / PAUSE / UPTAKE / THEMATIC_RHYME / conditional CAUSAL_BRIDGE). Avoid confusing a rhetorical "therefore" with actual changed source state.
2. **Local closure is not a compulsory punchline:** a factual absurdity, source contradiction, direct question, specific image or silence can finish the beat. This matches Georg's one-Card/one physical line + blank-line-cut requirement.
3. **Johnstone/Spolin offer-taking:** accept that the other speaker/player has contributed, not necessarily the truth of their interpretation. Exact lexical uptake of their actual word is much stronger than generic "that's ridiculous" rebuttal. These are framework references, not claims of automatic empirical superiority.
4. **Direct address ≠ metalepsis:** naming a real selected Card, player action or reader situation makes a fourth-wall socket grounded; unprompted meta jokes, claimed fake room reactions and simulation clichés add no Card truth.
5. **McCloud closure:** intentional hard cuts, aspect-rhymes and visual gaps can make separate independently meaningful panels/Beats cohere without explicit causal transition. Existing PDF Card Builder/Billboard and Audio clock remain separate existing consumers.
6. **Worldview application:** preserve `RESEARCH_SOURCE` (attributed author claim/citation) → `WORLDVIEW_LENS` (source-supported interpretation) → `KFB_FICTIONAL_RESIDENT_PERFORMANCE`. Never rewrite original Cards or make a real author endorse a fictional gag, never invent a dispute between authors. Compare existing **WorldView Research Core v1.0.0** and Worldview Performance research owner #394.

## Practical editorial candidate subset for a staged authoring pool
These are derived from the document's *prioritized MVP recommendation*, not yet implementation approval:
| Research ID | Function | Source/runtime dependency | KFB gate |
|---|---|---|---|
| OP-01 | “Do you know [subject]?” | Exact original Card title / known topic | Candidate; maps existing `DO_YOU_KNOW` when title exact |
| OP-06 | “Let me tell you about [subject].” | Verified named source | Candidate, no fictional meeting implied |
| OP-08 | “This one has a rule.” | Actual POWER | Candidate; require source Power, not artworkPrompt stand-in |
| OP-16 | “You would think [expectation].” | A sourced/justifiable prior expectation | Do not fabricate norm; editorial compare |
| OP-20 | “Anyway.” | Can hard-cut with next standalone Beat | Set-level cut, **not** causal Bridge |
| OP-25 | Deliberate pause | Actual playback/scene cue | Director metadata, not sung stage tag or fabricated timestamp |
| UP-01 | “You said ‘[word].’” | Exact `previousSpeakerId + utteranceId + quotedTerm` | Not standalone without previous turn, optional overlay only |
| UP-02 | “You call that [X]?” | Actual prior term/category in context | No fake uptake when X was not said |
| UP-03 | “Exactly. And if [claim], then…” | Actual prior claim + source-backed consequence | No unsourced consequence or fake endorsement |
| FW-01 | “You played [Card].” | Real user selection event + actual Card | Do not pretend a player played a Card |

Next optional candidates according to source: `OP-09`, `OP-23`, `UP-04`, `FW-04`; all remain **not enabled**. Existing six runtime opener signatures (DIRECT, HEARD_OF, DO_YOU_KNOW, EVER_TASTED, I_ONCE_MET, RESTAURANT_ORDERED) are already elsewhere in this Voice owner and **not replaced** by the new OP IDs. Match by meaning, never equate research ID with runtime ID automatically. Existing six Grok-derived *proposed* candidates remain separate editorial entries, not secretly active.

## Standalone semantics and conversation layering
A dialogue-dependent uptake line is not itself a fully standalone story: pair it with a source-complete standalone **base Beat** and select a prior-turn-dependent **entrance overlay** only if the prior utterance is real. If the prior turn is gone, simply speak the same base Beat with a source-neutral opener / pause. This resolves the otherwise conflicting "every Beat standalone" versus "a second actor borrows the first actor's words" requirements.

Recommended working object boundaries, as research candidates, not yet schema migration:
- `CARD_BEAT`: `beatId`, exact `deckId/cardNumber/sourceRevision`, original title + POWER/LORE source offsets, spoken core, source retention/info audit, spoken line, human status. A Card with missing Power/Lore remains NO_BEAT under existing negative Golden.
- `OPENING_FRAME`: `researchPatternId`, optionally mapped approved local `openerId`, source category, grammatical slots, fictional-stage permission, actor/delivery constraints, repetition cooldown, status.
- `TURN_UPTAKE`: only `previousSpeakerId, previousUtteranceRef, exactQuotedTerm, operation, residentId, baseBeatId, provenance`; cannot become an on-Card canonical factual claim; if no source quote, NO_UPTAKE.
- `FOURTH_WALL`: `audienceTarget, actualPlayerActionRef, boundaryMode, sourceCardRef`, no fictional real player action.
- `SET_RELATION`: one of CUT, PAUSE, UPTAKE, RHYME, CAUSAL_BRIDGE; only last requires `beforeState/trigger/afterState/cost`, and only when real change is proven.
- `WORLDVIEW_LENS_REF`: points to research #394 immutable source/author/citation/version, not a copied full research dossier, never claims fictional KFB actor is researcher.
- `PERFORMANCE`: ordered approved Beat IDs, optional sequence relations, original Card crop/visual ref, voice/actual clip cues controlled by current Audio #365, DRY preferred. Word-level timestamps only after actual rendered audio.

## Required negative tests before enabling even OP-01
1. Title spoken but POWER omitted and LORE-only synopsis → **FAIL** (binding previous R1 Human FAIL).
2. Entire original source copied with fake semantic-turn quality flag → **NOT_ACCEPTED** (100% verbatim not sufficient).
3. “Ever tasted…” on `Abyss Home`, "I once met..." as real resident biography without source → **REJECT**.
4. “You played…” when no player Card-selection event → **REJECT**.
5. “You call that safety?” when nobody said safety or a relevant category → **REJECT**.
6. “According to [real author], the Cookie proves…” → **REJECT** unsupported researcher endorsement; worldview lens remains interpretative with provenance.
7. “Therefore” without previous sourced state-change → **NOT_CAUSAL; CUT/PAUSE/NO_EDGE**.
8. Repeated FW direct address every beat or generic NPC/simulation meta punchline → **REPETITION / EDITORIAL_BLOCK**.
9. Research examples with `TODO_VERIFY` Card numbers (the document's example JSON contains this placeholder) → **NOT_IMPORTABLE**. Verify exact original Card IDs and hashes before touching runtime.
10. Old rejected 1001 Nights #5–7 negative Golden remains **HUMAN_FAIL**; do not dress it up by adding OP-xx.

## Relation to current Work → Claude Code order
- **Phase 1 Work/WSA owner = Audio #365**, already tasked with persistent editable, multi-deck source-verified Triplet/Opener Pool on the EXISTING Audio Voice Acting Site, controlled GitHub hot reload and safe export. The 43-row research bank is an **OPTIONAL INPUT FOR REVIEW**, not a replacement for existing #379 Opener pool or automatic Data Import to Site. Two ordinary post-deploy content-only changes remain the owner P0.
- **Phase 2 Claude Code** only after an accepted source/stable downstream packet; consumes approved Beat/Uptake/4th-wall patterns for ChatterBox and existing Composer/optional verified Wireface/3D Billboard, preserving the existing AudioContext/media clock and no second SSOT.
- **NotebookLM** remains a research consumer; the supplied Notebook is NOT directly editable/readable with available connector actions. The original native Google Doc IS editable by Google Drive/Docs connector but intentionally left unmodified; this GitHub derivative does not alter it.

## Real evidence versus non-evidence
**Performed:** direct Google Docs metadata/full tab inspection; 11 tables read; 43 distinct 12-field rows normalized and written/read back in exact Voice #379 branch; original DOCX checked independently including its underlying 22 unique linked URLs; current GitHub Voice and WorldView owners consulted.

**Not performed:** reading the linked NotebookLM's source collection, independent verification of every theory citation / quoted example, human KEEP/TUNE/CUT, actual site editor import/Cloud hot reload, any audio clip, new playable 3D/World runtime, plugin release, author dossier edits or live audio acceptance.

**One next gate:** `KFB_MODULAR_STORYTELLING_43_OPERATOR_RESEARCH_SELECTION_GATE_R1` — editorially choose which 8–12 well-supported operators become source-filtered **candidate** presets in existing Work/WSA Audio Site and which remain unpublished, then validate real standalone vs player/second-speaker story beats and source retention using real Card/Worldview refs. Never call all 43 "accepted" on data import.
