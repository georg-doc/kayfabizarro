# R3 research notes · narrative situations, not synonym counts

**Status:** RESEARCH / NOT APPROVED. Source: R2 checker blob `095846ba2896a83d1b8747066978e7f05b6d7164`; seed blob `d9c9fa7bceac781ffebb1d0efb52d123073713f9`; eight-deck branch `editorial/kfb-triplets-eight-decks-r2-2026-10-15` @ `31639721af054419e4674707759a86d94e3c852c`.

## Baseline census and design judgement
- 27 exact approved literals; R2 groups only five explicit overlap families: know/heard/try/nobody/thing (one literal may belong to more than one). `FAMILY_GAP=10` applies to near siblings; other rhetorical cousins remain ungrouped.
- Distribution by coarse speech act: {"DECLARATION_OR_STANCE":7,"DIRECT_ADDRESS_QUESTION_OR_PROMPT":7,"CARD_ACTION_OR_TARGET":8,"DISCOURSE_TRANSITION":5}. These are research labels, not official R2 tags.
- Direct-address near-neighbors: `You know`, `Do you know`, `You know the thing with`; `Have you heard of` / `Did you hear of`. They vary lexical form more than story setting.
- Existing class-specific high-sensitivity examples: `Ever tasted` requires edible title; `I once met` PERSON; `You played` game/activity. Existing R2 checker checks exact literals and family gap but **does not itself perform semantic eligibility checks**.
- Longest existing literal: Here is something nobody asked for (34 chars; excluding join space); cumulative length is not a proxy for variety.

## Completed seed audit
- 74/74 prepared entries inventoried in `OPENERS_R3_CANDIDATES.json:rawAudit`. 14 distinct seed provenance families. All remain nonapproved. 13 marked for elevated scrutiny for attribution, naturalness, or duplicate scene moves.
- `134` raw original candidate phrasings across 20 families (prepared seeds plus newly authored, NOT copied dialogue). `64` curated for review in `OPENERS_R3_CANDIDATES.json`, spanning 20 families; `18` first-look picks. This is editorial curation, **not human PASS**.
- Qualitative elimination themes: official press claims, documentary assertions, faux witness testimony, strained `book was called <title, POWER>` joins, repeated `The label said` micro-variants, and obscure school/market metaphors lacking applicable cards.

## Research-grounded mechanisms and limits
- **SRC-PRAGMATICS** [source](https://plato.stanford.edu/entries/implicature/). Conversational implicature: short contextual frame licenses inference but does not prove a new fact.
- **SRC-STORY** [source](https://www.sciencedirect.com/science/article/pii/S0378216614000812). Conversation analysis: story preface projects stance and sets recipient expectations.
- **SRC-FOLKLORE** [source](https://wwws.loc.gov/folklife/guide/storytelling.html). Oral forms include myths, rumors, interviews, notes, family experience, manuscripts.
- **SRC-SKETCHBOOK** [source](https://www.aaa.si.edu/exhibitions/visual-thinking-sketchbooks). Sketchbooks and notebooks function as visual notes, observations and fragmentary material records.
- **SRC-CLOSURE** [source](https://arxiv.org/abs/1611.05118). Comics gutters ask readers to infer unstated connections; here used only as an analogy for elliptical narration.
- **SRC-CUTUP** [source](https://www.briongysin.com/cut-ups/). Cut-up reorders text; KFB may transpose the collage feeling but must NOT cut and rearrange authoritative card Triplets.
- **SRC-ORALHIST** [source](https://siarchives.si.edu/history/how-do-oral-history). Oral testimony is situated recollection; staged reminiscence must never masquerade as documented primary source.

**Synthesis:** Different access routes (saw / read / was told / found / performed / misremembered) change the fictional speaker's relation to the printed words. A story preface earns attention through social setting, not a rhetorical punchline. Comic closure supports gaps in listener inference but cannot license new POWER, LORE, or card mechanisms. Cut-up is a technique donor for rhythmic juxtaposition **only**, never permission to remix source facts.

## Syntax and credibility firewall
1. `DIRECT_PREFIX`: exactly `literal + " " + triplet`; only permit cards of the specified class when the literal reads naturally with the **full title-first Triplet**, not just the title. No article/verb infill. 
2. `COLON_FRAME`: same concatenation; the colon performs a quotation-like turn. Such material is **fictional performer staging** unless attested by the printed card. Never claim actual book, film, source, museum label, government record, or real quotation.
3. High-risk `OFFICIAL_VOICE`, witness and real-document implications are held or explicitly fictionalized; no real named politician/agency is invented. The opener is never a documentary citation.
4. Preserve one canonical Triplet. No mandatory Fluff-o-lect, improvised sentence, filler bridge, invented emotional fact or runtime LLM. A syntactically legal join can still be an editorial FAIL.
5. `spokenCharacterCost` counts the **literal string only**; track selection pays another **1 ASCII space per use**. Blank beats pay `\n\n` (2 chars) in serialized Suno output; intro/outro remain untouched. Strict `<5000`, not `<=5000`.

## Review routing
Start with first-look candidates in the comparative report and the 12–20 complete utterances, then mark **PASS / TUNE / FAIL** by literal and family. Only user-approved IDs proceed to WS0; selection simulation is research evidence only.
