---
name: compose-card-performance
description: Produce complete, English-only, canonical-source KFB deck spoken-word Triplet sets with word audit, take-by-take CSV and Hub JSON under Triplet Set Spec R2.
---

# KFB Triplet Set R2 · 2026-10-15

This updates the same existing `kfb-triplets` plugin; do not create another plugin, Site, runtime, audio system or a second card database. Georg names a deck: the product is a whole-deck, individually recordable **English-only** spoken-word set without music. R2 and human verdicts override R1, V-231–V-235, the 90% rule, mandatory single sentence, mandatory reframe/punchline, rigid three-field recital and the 16/16 HUMAN FAIL legacy sample.

## Binding authority and source
Read GitHub `skills/chat/START_HERE.md`, `skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`, `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`, and current owner Return. Then retrieve `tools/KFB-ToolBox/_inbox/KFB_HUB/30_DECISIONS/replies/TRIPLET_SET_SPEC_R2.md`, the **exact** `triplet_set_check.py` and `TRIPLET_SETS_R2/` from branch `docs/kfb-decisions-register-2026-10-11`; record source ref + blob. Georg's verdicts on reference sets supersede conflicting prose in the spec. Original printed card truth exclusively from `data/kfb-card-text-canonical-2026-10-14` pinned at `233efd533869e70cc2b2c87205e34b5e47e125b7` (or newer explicitly verified accepted source), `media/kfb/<Deck>.pdf.json`, with only `cardName`, `power`, `lore` as vocabulary. **Never source text from `jsonLegacy`, `artworkPrompt`, `grade`, `gradeReason`, marketing, old OCR or a remembered card.** If a card print text is OPEN/unreadable, omit as OPEN and report cardNumber. Nonplay meta cards (BLANK, instructions, licence, QR code, card back etc.) are not spoken; list them.

## Compose only source-faithful speech
- One card line starts with card title in **normal title case**, not ALL CAPS, fused with the term/concept in POWER (e.g. `The Ordinary World stasis loop`, `Jean-Jacques Rousseau, Natural Goodness`). It is a **spoken word line**, not necessarily one grammatical sentence.
- Follow with brief **telegraphic fragments**: deliberate omissions, elliptic rhythms, cut-up cartoon language, source-grounded surreal speech, player closure. Approximately 8–20 spoken words in a breath. Be performable, not a definition, synopsis, textbook exposition, forced joke, or stock punchline.
- Use **ONLY source card words**, permitting grammatical glue, minimal inflection, punctuation, omission and at most **one** Fluff-o-lect token per line. No imported verbs, images, actors, scenes, claims or rules. Mechanic numbers/dice labels are normally omitted; keep an actual mechanic only where it provides a concrete image. Never change mechanic meaning when one is spoken. Card picture is a separate visual channel; do not mine `artworkPrompt` for new speech words.
- The existing checked goldens in R2 are creative references, not license to silently invent matching words on an unrelated card. Human verdict always governs.

## Openers separate, deterministic and nonrepeating
Use only exact entries in `OPENERS` of the pinned checker, each **at most once per deck set**; not all lines need one, roughly every second/third is a planning heuristic, not a quota. Fit content and grammar: `I once met` for a person, `Ever tasted` for edible subject, `You played` only for an actual played card. Do not invent bridges or prefix stock phrases. Preserve opener separately from core Triplet.

## Deck completeness and four files
Named deck = every unique `cardNumber` exactly once: either a card take or an explicit OPEN/meta skip in Hub report. No three-card default. Keep original card number ordering. Produce FOUR independent files named `<deckId>.suno.txt`, `<deckId>.takes.csv`, `<deckId>.check.txt`, `<deckId>.hub.json`.
- `.suno.txt`: `[Spoken Word]`, blank line, `Welcome to <deck title>.`, card takes in order with a blank after roughly eight lines, `Stay Fluffy!` final; no music/no audio upload. Intro/outro only once.
- `.takes.csv`: exact columns `line_no,kind,card_number,card_title,opener,triplet,spoken_text,start_seconds,end_seconds,sync_status`. One card per take; intro/outro separate; `spoken_text` is opener + core; timing cells EMPTY and status `UNTIMED_AWAIT_REAL_AUDIO`. Never invent seconds.
- `.check.txt`: capture the pinned ported checker output and fail summary; **0 FAIL** required before presenting as clean.
- `.hub.json`: stable per-card source/provenance, opus lines, opener, omitted/OPEN card numbers and reasons, production status editorial/not recorded, and audit facts; no claim of human acceptance unless Georg explicitly supplied it.

## Mandatory exact checker and editorial gate
Port `triplet_set_check.py` 1:1 preserving `GRAMMAR`, `FLUFF`, `OPENERS`, `SUFFIXES`, regex tokenization, `stems()`, `vocab()`, `card_fields()`, title check, opener uniqueness and printed PASS/FAIL format. Do not write a weaker new checker. The authoritative Python file itself is a legal exact port inside plugin support files; if using JS, demonstrate identical fixture outputs. Run actual checker on actual generated CSV against pinned canonical deck. It catches out-of-card lexical forms but **does not catch a false claim created by recombining source words**: conduct a separate semantic read-through and report both. If code cannot execute, label NOT RUN and do not fake 0 FAIL. No advance beyond Monomyth until it is compared card-by-card with the accepted WS0 reference **after Georg's verdict**. Reuse verified reference only as a donor, not as evidence the plugin generated a fresh independent set. No Site, PR, merge, music, audio, Suno upload or Live promotion.

## Deliver and checkpoint
Return lines, skipped OPEN/meta IDs, opener counts, exact diff against WS0 reference, checker pass/fail and semantic read-through, source blob SHAs and one next gate. Save plugin files, one complete deck output and a concise report on a **new GitHub branch**; reread exact branch head and intended files after every GitHub write. Plugin updates must use same ID and release guard. Do not claim complete or clean unless actual evidence supports it.
