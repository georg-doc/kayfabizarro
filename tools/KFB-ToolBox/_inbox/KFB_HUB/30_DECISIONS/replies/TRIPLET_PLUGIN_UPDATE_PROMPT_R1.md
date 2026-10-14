# Prompt · kfb-triplets Plugin anpassen (R1, 14.10.2026, ohne Opener)

Quellen der Regeln: Georgs Korrektur vom 13.10. (`POSTMORTEM_TRIPLETS_R1_SHOW_IT_POWER_LORE_OMISSION_2026-10-13.md`), Negativ-Golden 1001 Nights (`POSTMORTEM_KFB_TRIPLETS_1001_NIGHTS_…`), `DECK_CARD_ONE_SENTENCE_TRIPLET_AND_FRACTAL_QUEST_R0_1`, Georg 14.10. (90–95 % Karteninhalt, keine Vortragszeilen, Opener erst als eigene Schicht).

```text
Update the existing kfb-triplets plugin (skill compose-card-performance) in place – same plugin, no new plugin, no Site, no Suno, no audio. Scope of this update: clean single-card Triplets only. Openers, Bridges, intros/outros ("Stay Fluffy!") and performances are OUT of scope now; they come later as separate layers.

WHAT A TRIPLET IS (binding, Georg 13.10. + 14.10.)
1. One card → exactly ONE connected, character-performable English sentence (one utterance). Never two or three sentences, never a list.
2. SHOW IT – the exact original card title (cardName) is spoken in the sentence.
3. SPIN IT – the card's concrete POWER (rule / action / effect) is applied to the card's LORE (setting, reason, meaning) in a semantically connected way. Not "Title + Power + Lore" glued in a row, not one field dropped.
4. SELL IT – the sentence ends on an audible turn: the card's implication flips or snaps in the final part, built from the card's OWN material (e.g. the cost or catch in its POWER, the irony in its LORE). No invented punchline, no outside joke.
5. 90–95 % card content: at least 90 % of the content words come from the card's title, POWER and LORE (verbatim or minimally inflected). The rest is grammatical glue only (articles, pronouns, conjunctions, verb forms). No new facts, actors, events, places or rules. Keep the author's wording and weirdness as far as grammar allows.
6. All three fields (title, POWER, LORE) must be traceably used. If a field is null or malformed → output NO_TRIPLET with the reason. Never fill gaps with invented text.
7. FAIL cases (must be rejected by your own check): title missing; POWER missing; LORE missing; plain synopsis without a turn; card text read out verbatim as a recital; two or more sentences; generic filler or stock jokes; any fact not on the card.

Reference (structure only, Georg rated it TUNE, not a golden): The Cookie of Causality – POWER "Inciting Incident: Restart the game from Turn 1. Keep all damage." – LORE "The war didn't start over land or ideology. It started over a snickerdoodle." → "The Cookie of Causality restarts the war over a snickerdoodle at Turn One, but keeps all the damage."
Negative golden (must stay FAIL): 1001 Kayfabe Nights #5–7 R1 (synopsis sentences, invented bridge events).

SCOPE AND SOURCE
- Input = exact deck JSON from georg-doc/kayfabizarro media/kfb/*.pdf.json at a pinned commit; record the git blob SHA. A named deck means the WHOLE deck: every cardNumber exactly once (Triplet or NO_TRIPLET). No silent 3-card default.
- Never use artworkPrompt, grade, gradeReason or marketing text as content.

OUTPUT (one format, importable without conversion)
For each card one record in the dialog-pool beat schema kfb.voice.triplet-opener-pool/1:
beatId "<deckId>:<n>:triplet-r1", version 1, deckId, cardNumber, cardBlob, mode "COMPACT", surfaceText (the one sentence), openerId "DIRECT", openerVersion 1, status "EDITORIAL_CANDIDATE", humanAcceptance "PENDING", reviewer null,
evidence: for cardName, power and lore each ≥1 entry {field, quote (exact substring of the original field), start, end (character offsets in the original field), spoken (exact text as it appears in surfaceText)},
semanticCoverage {power: "<how POWER is used>", lore: "<how LORE is used>", reframe: "<what turns at the end>", humanAcceptance: "PENDING"},
delivery {pauseBeforeMs:300, pauseAfterMs:800, rate:0.93, pitch:1},
plus contentShare {method: "content words from card / all content words", pct} and slots {show, spin, sell} quoting the parts of the sentence.
Validate every record with triplet-pool-core.mjs (validateBeat) from branch ws1/r3f-frame (ws1/kfb-planet/src/vendor/triplet-pool-core.mjs) before reporting. Report honestly: count Triplet / NO_TRIPLET / failed own check.

FIRST STEP (gate before any full deck)
1. Patch the skill with the rules above and add a self-check that rejects the FAIL cases.
2. Produce Monomyth Mayhem cards 1–8 and Help I Am A Human cards 1–8 as a sample, each line shown next to its original title / POWER / LORE, with contentShare.
3. Run the negative regression: the 1001 Nights #5–7 lines and a plain recital of a card must FAIL.
4. Check in on a NEW branch (not the voice branch, no PR, no merge): plugin files + sample JSON + a short report. Georg judges the sample before any full deck is produced.
```
