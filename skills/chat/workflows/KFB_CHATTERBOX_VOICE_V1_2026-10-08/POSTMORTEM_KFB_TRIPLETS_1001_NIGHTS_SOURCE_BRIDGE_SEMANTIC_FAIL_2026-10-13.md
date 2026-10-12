# POSTMORTEM · KFB Triplets · 1001 Kayfabe Nights · semantic/Bridge/provenance failure

Date: 2026-10-13  
Status: **GEORG HUMAN FAIL · SEMANTIC_TRIPLET_FAIL · CAUSAL_BRIDGE_FAIL · NEGATIVE GOLDEN / QUARANTINE**  
Type: **RECOVERY / READ-ONLY CONTENT REVIEW**; no replacement script, plugin source repair, Site or audio generation.
Repo: `georg-doc/kayfabizarro` · existing KFB ChatterBox Voice owner · Draft PR #379 · branch `planning/kfb-chatterbox-voice-layer-v1-2026-10-08`.

## 0. Binding human verdict and scope

Georg's direct feedback on the just-produced 1001 Nights result: **"Das ist ja wohl ein totaler Fail. Wie kommst du denn drauf, dass das das wäre, was wir hier als Triplets haben? Da ist ja auch gar keine Bridge dabei und nichts. Bitte mal Postmortem dazu."** He additionally required **exact percentages for verbatim Card content versus newly authored material**.

The rejected exact candidate is:
`skills/chat/workflows/KFB_CHATTERBOX_VOICE_V1_2026-10-08/KFB_1001_KAYFABE_NIGHTS_5_6_7_FRIZZLEBOB_TRIPLETS_SUNO_R1_2026-10-13.md`
Git blob `4d813bfd5aadf57c80552afb4960473c0558b23e`, content commit `a8cd8e140edc5d179dd582520fc8bfc072c59f9c`.
Its original source:
`media/kfb/1001_Kayfabe_Nights_-_ADD_web_ID.pdf.json` at supplied ref `34102e8bec6ae76e5b2e8de1f1c2a6abb4f4bd1c`, blob `c5b6719d6a0612f227615d9917bbfbb45563f45d`, pack ID `1001_kayfabe_nights`, **60** actual cards. Only cards #5, #6, #7 were processed. The selection of THREE_CARD, FrizzleBob voice and Suno format was assistant-determined, not a user-stated requirement.

**Human FAIL supersedes the earlier assistant's 17/17 structural/source checks.** Do not ask Georg to Suno-audition the rejected text, do not use as a Golden, do not promote into ChatterBox/Suno pool, game lore or Audio feed. Preserve the exact candidate as a **negative Golden**.

## 1. Quantitative verbatim-vs-authored audit · reproducible word methodology

**Corpus:** original selected #5/#6/#7 `cardName`, `power`, `lore` (not grade, gradeReason, artworkPrompt); original 103 source word tokens total. 
**Output:** only audible English text inside the candidate's Suno Lyrics block, excluding `[Spoken Word]` / `[End]` tags; includes intro, three Card summary sentences, two claimed Bridge sentences and `Stay Fluffy!`. Exactly **114 whitespace/punctuation tokenized words**.

**Tokenization:** Unicode letters/numbers with internal straight/curly apostrophes, lowercased, punctuation stripped; exact same normalized consecutive token sequence must occur in at least one selected source field; matches do not cross source field boundaries; longest nonoverlapping matches counted from left to right in generated text. This measures literal surface overlap, **not** conceptual authorship or made-up facts. Generic matches such as `the main event` may be incidental, so this generously **overstates meaningful verbatim use**.

| Denominator / criterion | Source-verbatim | Not verbatim / assistant-written wording |
| --- | ---: | ---: |
| Entire 114-word spoken output, ≥3 consecutive source words | **36/114 = 31.58%** | **78/114 = 68.42%** |
| Entire 114-word spoken output, lenient ≥2 words | **48/114 = 42.11%** | **66/114 = 57.89%** |
| 100-word content body only (three Card lines + two transitions), ≥3 words | **33/100 = 33%** | **67/100 = 67%** |
| 34-word claimed Bridge block alone, ≥3 words | **3/34 = 8.82%** | **31/34 = 91.18%** |
| Coverage of 103 original source-field word positions, unique source tokens belonging to a ≥3-word match anywhere in output | **36/103 = 34.95%** | **67/103 = 65.05% not reused verbatim** |

IMPORTANT DENOMINATOR DISTINCTION: The last row measures **how much original text was copied**, not what fraction of the newly written script is original. `Not verbatim` is **not** synonymous with `fabricated fact`: paraphrases may be factually anchored in the Card, but are still assistant-composed prose. Conversely verbatim common words don't establish meaningful fidelity.

**By audible segment, strict ≥3-word matches:** intro 3/12; Card #5 6/18; alleged Bridge 5→6 3/18; Card #6 14/22; alleged Bridge 6→7 0/16; Card #7 10/26; outro 0/2. Sum **36/114**. The three original Card titles appeared as exact names (3/3), but **zero of the six complete POWER or LORE fields** was reproduced verbatim (0/6). Only **3/60 = 5%** of original Cards were represented at all, despite the user supplying a full deck.

**Examples of source vs own words:**
- Exact source from #5: `SHAHRYĀR, THE DESTROYER`, `Pink Slip`, `one match`, `THE HEEL PROMOTER`; authored wrapping: `issues ... after ... burying anyone ... permanently`.
- Exact #6: `SCHEHERAZADE, THE UNENDING`, `the shoot into a work`, `the locker room`, `a thousand nights`; authored summary verbs: `delivers ... keeping ... alive`.
- Exact #7: `DUNYAZAD, THE HYPE WOMAN`, `Ringside Distraction`, `about the apples`, `the heat alive`; authored summary syntax changes agency and sequence.
- Claimed 5→6 Bridge invented physical beats: `Shahryār reaches for the next name on the roster; Scheherazade takes the microphone before the Pink Slip lands.` The Card source supports the Pink Slip/Promo motifs, **not this literal event**.
- Claimed 6→7 Bridge invented a timing trigger: `When Scheherazade stops for breath, Shahryār counts toward the finish; her sister starts shouting from ringside.` In the source, Dunyazad's Ringside Distraction is real, but **that breath/counter sequence is not**. Zero ≥3-word Card text sequences appear in this line.

## 2. Contract violation · wrong understanding of what a Triplet is

Existing binding ChatterBox semantics:
`skills/chat/town/references/KFB_META_NARRATION_SAMMLUNG_WS0_2026-09-14.md` and
`tools/KFB-ToolBox/_inbox/HANDOVER_Voice-Layer_KFB_AudioTutor_2026-10-08.md`: **one spoken semantic utterance assembled as subject → meaningful connector → reframe**. The resident/pool/LLM can use source Cards as prompts/constraints; these slots are not mechanically equal to title, POWER, LORE. The existing `DECK_CARD_ONE_SENTENCE_TRIPLET_AND_FRACTAL_QUEST_R0_1_2026-10-12.md` clarifies a higher-scale page/quest separately, not a rule that any one-sentence card summary automatically becomes a Triplet.

Actual rejected output was **three synopsis sentences**: `[original name] [does effect] [role/history]`. They repeat the same source facts rather than deliver a meaningful middle relation that forces a reinterpretation in the third slot. There is no explicit `subject/connector/reframe` slot evidence, no scored reframe, no source-backed semantic ChatterBox pool triplet IDs, no actor's reactive second utterance. One sentence per Card is a **necessary form in this lane, insufficient evidence of Triplet semantics**. **Actual semantic Triplet PASS count: 0/3 demonstrated**, not a verdict that no conceivable Triplet could ever be authored from those Cards.

## 3. Bridge false-positive · two labels, zero proven Bridges

The historical `KFB_CARD_PERFORMANCE_TTS_BED_BRIDGES_SPEAKERS_CORNER_R0_1_2026-10-12.md` and `data/KFB_CARD_PERFORMANCE_BRIDGES_R0_1_2026-10-12.json` explicitly demand a curated compatible transition linking **prior concrete effect → next consequence, obstacle, cost, reversal or changed stake**, with source IDs and editorial status; otherwise use `NO_EDGE`, cut/silence, reorder.

Previous report advertised **2 Bridges** because it typed `5>6` and `6>7` in Markdown. Those are **two transition sentences, not two verified causal Bridge objects**. They restate the next character's action or inject an unverified event. No persistent before/after state, actual cost, causal incompatibility fallback, or semantic reframe was established; no candidate underwent a real quality check. Numerical shape/provenance tests did not certify content. Correct outcome: **2 labeled transitions / 0 demonstrated acceptable causal Bridges**. Georg's statement that the work has no *real* Bridge is substantively correct.

## 4. Five root causes

1. **TYPE_CONFLATION:** card-based one-sentence *summary* was equated to semantic **Triplet**. `Title + POWER + LORE` became an obligatory paraphrase template, hiding the missing `connector → reframe` semantics.
2. **BRIDGE_LABEL_SUBSTITUTION:** authored bridge-flavored prose was marked `relation: retaliation/obstruction` with no verified action/state/causal graph. This is label laundering, not relation proof.
3. **UNAUTHORIZED_SCOPE_DEFAULT:** unspecified deck request silently reduced 60→3 cards and picked persona/voice/Suno, overapplying the private skill's `three-card` default rather than starting with a deck-level composition contract and delivering the expected mode.
4. **SELF_VALIDATION_LEAK:** `17/17 PASS` checked that titles, source snippets, word count, and labels existed; it did not independently test genuine semantic Triplets, causal Bridges, dramatic change, RULE1 or user expectations. Packaging/citations then gave a false success impression despite `EDITORIAL_CANDIDATE` text.
5. **IGNORED_NEGATIVE_GOLDENS:** same owner already records failures of generic stand-up and arbitrary mechanical cutups; a fresh output repeated the known failure of substituting syntax/layout for story logic.

## 5. Safety of the recovery

- **QUARANTINE EXACT CANDIDATE:** preserve its original content/blob untouched for regression; no automatic Suno, no audio ingestion, no new content edits presented as creative repair, no canonical use.
- **DO NOT PROMOTE PLUGIN v0.1 RULES TO ACCEPTANCE:** source provenance is valid, creative semantics are FAIL. The *plugin product* remains an unproven skills-only authoring composer for this kind of request; this failure alone does not establish that KFB Audio or other independent source/voice work failed.
- **CORRECT GUARD REQUIRED BEFORE NEW COMPOSITION:** restore distinction among (A) semantic Triplet slots, (B) original Card field citations/verbatim excerpt, (C) authored but causally justified inter-Card Bridge with state transition, (D) higher-scale story arc and optional Suno export. Check 1 genuinely working Triplet + 1 bridge under the project's existing source-backed examples **before** any 60-card or Suno scaling. Do not pass on title-match or relation-label alone.
- **FAIL early:** when a compatible causal edge is absent, record `NO_EDGE` or silence/reorder rather than inventing a stage link. Creative text remains human-assessed: Georg's explicit FAIL is sufficient to halt this candidate; do not request a listening trial for it.
- **ONE OWNER:** Voice PR #379 remains content ownership; Audio #365 and active r3 Card11 preview untouched, no second runtime/Site, no Cloudflare/public Stage.
- The current private KFB Triplets plugin v0.1 skill and its default `3 cards` remain **UNREPAIRED** here; source-level plugin amendments require a separately reviewed recovery slice, not silent speculative tweaks.

## 6. Actual evidence / tests / handoff

- Human editorial verdict: **FAIL** (Georg 2026-10-13); treated as authoritative.
- Provenance: original 60-card JSON fetched and matched exact blob; rejected produced Markdown read; deterministic tokenization/contiguous overlap audit above, **7 segment rows totalling 114 words**, strict+lenient and source coverage counted; exact complete Card POWER/LORE matches 0/6.
- Original `17/17 PASS`: historical structural test only; **invalid as product acceptance**.
- Acceptable semantic Triplets: **0/3 demonstrated**; acceptable Bridges: **0/2 demonstrated**.
- Render/audio/browser/Stage screenshots: **0 new**; Suno songs: **0**; deployed Site revisions: **0**.
- Repo/branch/PR: `georg-doc/kayfabizarro`, `planning/kfb-chatterbox-voice-layer-v1-2026-10-08`, #379 Draft. Branch head readback to be recorded by the final Return update.
- No merge / Live promotion.
- **One next gate:** `KFB_TRIPLETS_SEMANTIC_BRIDGE_CONTRACT_RECOVERY_R1` — independent source/contract comparison of the existing semantic ChatterBox Triplet and causal Bridge examples, then a narrowly scoped repair decision on the existing plugin skill; no new generated output or Suno trial before that result. Existing Audio r3 Card11 owner hearing gate is separate and unaffected.
