# KFB Triplets — Opener Diversity Deep Dive R1
Date: 2026-10-15
Status: RESEARCH BRIEF / CANDIDATES ONLY / NOT APPROVED
Authority: Georg; owner: existing kfb-triplets plugin (`compose-card-performance`) and WS0 Triplet Set R2 editorial workflow.
GitHub research branch: `research/kfb-triplet-opener-diversity-r1-2026-10-15`. No new plugin, no runtime, no Site publication, no changes to active checker or generated tracks.

## Problem / desired outcome
The current approved pool contains **27** exact OPENERS in `triplet_set_check.py` and sounds repetitive when 48–60 cards are performed in one ~5000-character spoken-word track. The neighboring variants `You know`, `Do you know`, `Did you hear of`, `Have you heard of` do not yield genuinely different situations. Georg wants short, idiomatic, cartoon-performable **English** openers that set up distinct dialogic storytelling frames: reading a book, seeing a film/artwork, running into a friend, finding a scrap of paper, a journal or poetry album entry, hearing a rumor, a politician's remark, an overheard argument, etc. The variety is about **provenance / narrative situations / social relations / attitudes**, not a bag of synonyms. Allow unusual, elliptic, dry and playful character speech; absolutely no default generic AI quips.

## Source authority / recovery
1. Read latest GitHub `skills/chat/START_HERE.md`, `skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`, `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`, existing Triplet owner Return and newest WS0 decisions before drafting.
2. Current canonical editorial spec: `tools/KFB-ToolBox/_inbox/KFB_HUB/30_DECISIONS/replies/TRIPLET_SET_SPEC_R2.md` on `docs/kfb-decisions-register-2026-10-11`, observed blob `b0e5b770d80414c4d28528ec7137766066079861`. Current exact validator: `triplet_set_check.py` blob `095846ba2896a83d1b8747066978e7f05b6d7164`. The exact `OPENERS` array contains **27 approved literals**; `FAMILIES` protects near duplicates with `FAMILY_GAP=10`.
3. Finished reference sets and accepted Golden context are in `TRIPLET_SETS_R2/`; no source rewriting. Eight-deck independent editorial branch: `editorial/kfb-triplets-eight-decks-r2-2026-10-15` @ `31639721af054419e4674707759a86d94e3c852c`; `BATCH_INDEX.json` and `RETURN.md`. Recorded batch: 445 spoken card lines / 8 decks, 148 opener uses, all still awaiting WS0 exact Python/semantic review.
4. Existing Fluff-o-lect/closure donor: `skills/chat/town/references/KFB_META_NARRATION_SAMMLUNG_WS0_2026-09-14.md` (missing semantically load-bearing words, closure in the player). Keep as creative mechanism, not license for new card facts.
5. Printed `cardName`, `power`, `lore` are truth; `cardNamePrint` not spoken; do not mine artworkPrompt, grade, gradeReason, marketing, jsonLegacy.

## Research question
How can a compact **approved, deterministic, no-runtime-LLM** opener library give the impression that a cartoon performer has read, seen, overheard, remembered, found, misunderstood, or been told something, rather than reciting interchangeable direct-address prompts?

## Scope for external Deep Dive
Research authentic patterns of short oral narrative openings / transitions in anecdote, diary, letters, notebooks, found manuscripts, notebook marginalia, rumor/overheard conversations, screen/radio/film recollection, museum placards, visual-art encounters, courtroom minutes, folk tales, theatre/backstage chatter, reportage, hearsay, forgotten scraps, slogans and stage patter. Useful linguistic references may include conversational pragmatics and storytelling, comic-gutter closure, free indirect speech, cut-up / collage language, and Krazy Kat-like elliptical cartoon diction. Explain findings briefly and cite real sources when used; **never reproduce copyrighted dialogue as output** or mechanically imitate a living creator. New examples must be original.

### Mandatory families to explore (not one example each)
1. READ / TEXT: I read a book; poem; article; footnote; manual; archive; label; inscription.
2. SAW / SCREEN / ART: film; painting; cartoon; poster; museum display; newsreel; photo.
3. MET / TALKED: friend; stranger; expert; aunt; neighbour; witness; a person at the bar.
4. HEARD / RUMOR: rumor; gossip; radio; whisper; interview; sermon; overheard argument.
5. FOUND / LEFT BEHIND: scrap; receipt; note; letter; message in bottle; napkin; classified file.
6. PERSONAL WRITING: diary; notebook; sketchbook; poetry album; schoolbook; marginalia.
7. INSTITUTIONAL SPEECH: politician / official / board / press conference / meeting minutes / report (do not falsify an attributed historical quotation).
8. MEMORY / DREAM / UNRELIABLE: I remember; I dreamed; they swear; was I there?; uncertain reports.
9. PERFORMANCE / STAGE: rehearsal; backstage; audience shout; announcement; radio host; storyteller.
10. MATERIAL / OBJECT: box label; map; ticket; sign; price tag; engraving; ledger; painting label.
11. QUESTION / INTERRUPTION / CALLBACK: short speech interruptions with a situated reason, not another "Have you heard of".
12. PERSON / PLACE / EVENT / IDEA / THING: semantic eligibility and natural grammar for card-title categories, not catch-all forms.

## Contract: separate the opener from the card
- **Keep one canonical card Triplet.** The opener is a separate data field and must combine deterministically with `cardName` / Triplet, not rewrite card POWER/LORE, generate new dialog, or require runtime LLM calls.
- Current runtime serialization in `takes.csv`: `spoken_text = opener + " " + triplet`. If a proposed opener requires punctuation (e.g., a colon framing a found quotation), define the exact literal—including punctuation—and test this unchanged concatenation. Do not quietly add a second templating engine; a conditional additional slot is proposal only, with compatibility details.
- Distinguish **grammatical eligibility** (book about X vs person you met vs food tasted), **narrative credibility** (artwork/diary/film is a fictional *speaker frame*, not an asserted real external record), **semantic fit**, and **style voice**. A claim such as "the President admitted" cannot be attached as a factual quotation unless on the source card; if used as invented fiction, explicitly label `PERFORMER_FICTION` and require Georg's editorial permission.
- No invented bridges; a two-word opener must not secretly add new plot events, official corroboration or biographical facts to the card.
- No parroting same rhetorical family in one track. Preserve current **one literal use per track and min 10 lines between sibling families**; propose additional families by genuine shared move (source type, speech act, first-person claim) rather than lexical similarity alone.
- Strict **English** for proposed opener strings, spoken samples and eventual track lines. German language is fine for workflow discussion outside the content.
- Keep Suno spoken-word tracks below **5000 characters** including per-beat blank lines, intro and outro. Test character overhead across 48-, 52-, 56-, and 60-card decks; prefer short 2–6 word openers and avoid needless stock filler.
- Fluff-o-lect remains a separate restrained voice layer; it may exploit **closure** but may not disguise newly invented card events, forced jokes or compulsory punchlines.

## Required research process and concrete outputs
A. Baseline census of all 27 approved literals, categorize their actual speech acts, aliases, semantic restrictions, longest lengths, obvious repetition/family collision. Do not assume the historical count 31.
B. Assemble **at least 100 raw research candidates** distributed over >=10 distinct narrative situations; tag original examples vs externally observed patterns and source references. Eliminate generic synonyms, vague meta-opener filler, false official authority and stilted grammar.
C. Curate **approximately 40–70 strong independent candidates** in a structured machine-readable ledger with `id`, `literal`, `family`, `frame`, `cardClassAllowed`, `syntacticJoin` (DIRECT_PREFIX / COLON_FRAME / OTHER_PROPOSAL), `performerFiction`, `risk`, `spokenCharacterCost`, `sampleCardId`, `sampleSpokenText`, `reviewStatus=PROPOSED`. Keep existing 27 in a distinct approved baseline section, not part of new approval count.
D. Stress-test a representative minimum **24 real source cards** spanning people, things, abstract concepts, games, places, food, ideas, institutions from at least four different current KFB decks. Write exact opener + unchanged Triplet combinations and show rejected bad combinations. No new card text or openers hidden in `triplet`.
E. Simulate deterministic scheduling for 48, 52, 56 and 60 lines; enforce no duplicate literal, family-gap 10, semantic eligibility, intro/outro and 5000-character ceiling. Compare variety with the 27-literal baseline. Report actual distinct story-frame coverage, not just count of strings.
F. Human-facing **one-page comparison** of strongest and weakest options, 12–20 listenable examples with original card context, risk/eligibility, candidate statuses and actual costs; explain how actor persona/Fluff-o-lect may color delivery WITHOUT manufacturing a second Triplet pool.
G. Provide an additive, no-mutation **WS0 handoff**: proposed `OPENERS_R3_CANDIDATES.json`, an R3 candidate checker patch/diff (do not overwrite current `OPENERS`), research notes with citations, stress-test results and a short Return. Propose which 10–20 entries deserve Georg A/B approval first. No activation until explicit Georg + WS0 gate.

## Acceptance thresholds
- Distinct situations, not trivial "Have you heard / Do you know" rephrasings.
- Natural in English when combined with the title-first Triplet and no extra authored phrase.
- Grammatically suitable for the card classes specified, with unsafe combinations documented.
- No invented card-world facts or mislabeled attributed claims; performance fiction explicitly controlled.
- No new runtime dependency, no parallel dialogue owner, no automatic publication.
- No fake PASS. External research citations must be real, and actual tests must show executed counts.
- **Final authority: Georg PASS / TUNE / FAIL** on a short, *audible/readable* sample; only then WS0 may alter checker, plugin or regenerate the eight tracks.

## Single next gate
`GEORG_OPENER_R3_SHORTLIST_REVIEW`: show Georg an immediately readable (not JSON-only) 12–20 opener+card demonstrations and an R3 family-level shortlist. No automatic incorporation into existing checker or production tracks.
