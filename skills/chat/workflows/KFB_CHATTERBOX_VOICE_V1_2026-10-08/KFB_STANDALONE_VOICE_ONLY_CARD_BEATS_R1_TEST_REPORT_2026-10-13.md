# KFB Standalone Card Beats · Solo dry spoken-word + source coverage · R1
Date: 2026-10-13
Status: **DETERMINISTIC SOURCE/FORMAT TECHNICAL PASS · CREATIVE QUALITY UNAPPROVED**.
Owner: existing Voice/ChatterBox Draft PR #379, `georg-doc/kayfabizarro`, branch `planning/kfb-chatterbox-voice-layer-v1-2026-10-08`.
Receiver remains existing KFB Audio Site / Audio #365 only. **No new plugin/second TTS/mixer/Site/World runtime**.

## Georg's updated binding performance direction
Treat **each Card as a self-contained stand-up mini-routine** with an optional source-appropriate relatable opening; it can be played alone or shuffled among other Card Beats **with zero inter-Card Bridges**. A semantic Triplet can be one main connected sentence, but a standalone card **routine** may contain multiple short spoken sentences on **one physical text line**; the following **blank line** marks a separately cuttable beat. Intro/outro are their own line+blank blocks. The source absurdity may carry the outcome: no forced joke or tidy final punchline/Closure.

Closed proposed opener library:
- `DIRECT`: original Card title first, no stage fiction;
- `HEARD_OF`: "Ever heard of <original Card title>?";
- `DO_YOU_KNOW`: "Do you know <original Card title>?";
- `EVER_TASTED`: food-source-compatible cards only; Cookie verified by original title;
- `I_ONCE_MET`: approved `PERSON` + pronoun + explicit **PERFORMER_FICTION** opt-in;
- `RESTAURANT_ORDERED`: `FOOD` source + explicit **PERFORMER_FICTION** opt-in. A "restaurant" is not source canon. No auto-invented restaurant in Lore.

Avoid repetitive openers through approved deterministic rotation/seed, not completely random context-agnostic templates. The generator must not put "I met" on an abstract Card or "ever tasted" on a prison/institutional Card without explicit source-compatible rationale.

## Two distinct valid output *types*, never conflate them

**A — Condensed source-borne semantic Card Triplet** (pre-existing source-locked Cookie #10 R2, still editorial candidate):
> Ever tasted The Cookie of Causality? It restarts the war over a snickerdoodle at Turn One, but keeps all the damage.

Quoted original-source token coverage **14/28 = 50%** using original field token positions (Card title 4/4, POWER 6/11, LORE 4/13). It covers the main POWER restart and retained damage and the Lore's snickerdoodle war, but it does **not** preserve 90% of original words. A 90% **original-token** strict target correctly fails with `ORIGINAL_CONTENT_COVERAGE_TARGET_UNMET`. Do not confuse 90% of emitted words from sources with 90% of original content used.

**B — Full source stand-up *recitation*** (new `toFullSourceBeat`, preserving **100% literal original Card title/POWER/LORE tokens**; NOT yet a creative Triplet proof):
> Ever tasted The Cookie of Causality? Inciting Incident: Restart the game from Turn 1. Keep all damage. The war didn't start over land or ideology. It started over a snickerdoodle.

All original full source fields are present **unchanged** except the optional separate opener; source coverage 28/28 original tokens = **100%**. The difference from A is material: B is a complete original text performance, which may sound like a rules recitation and is **not automatically an elegant stand-up Triplet**. Delivery/rhythm/pauses can make it a candidate standalone beat; Georg/independent creative review decides KEEP/TUNE/CUT. Do not let source-token coverage claim artistic quality.

A and B coexist, allowing comparative audition; there is no assertion that every Card can reach 90% original source coverage *and* remain equally short or funny. User's high-retention target should be separately tracked by per-Card facts/meaning and original token coverage.

## Actual implementation
- `tools/assemble_standalone_card_beats_r1.cjs`: six typed opener modes with source-category and explicit stage fiction gates, "one card = one physical line", two Beat types, origin/cue/expected-delivery metadata, source token-position coverage, seeded reorder/no-Bridge, fixed Stay Fluffy finale, one empty-line separator, **dry-only** TTS intent (not claimed recorded), chapter-length guard and lossless `splitSoloParts` for 5000-character parts, and `planFullSourceDeck` fail-closed source audit.
- `data/KFB_STANDALONE_VOICE_ONLY_2_CARD_PREVIEW_R1_2026-10-13.json`: two actual Wrinkle Rumble #10 Cookie + #31 Abyss Home **full-source** standalone beats, intro + 2 separate card paragraphs + Stay Fluffy outro, 397 characters, 2 of 2 originals each 100% preserved, *editorial candidates* only. Cue IDs, pause recommendations and Card/Deck original revisions survive arbitrary reordering. No bridges.
- Existing R2 single Cookie compiler `tools/deterministic_card_triplet_show_spin_sell_r2.cjs` and pinned original Wrinkle source remain original. Existing R1 5-card negative examples remain rejected.

## Actually executed
The **exact committed updated assembler source** loaded into a V8 JavaScript isolate and run with current GitHub original Wrinkle 48, Nights 60, Dystopia 56 Card JSON and original R2 Cookie recipe:
- **35/35 technical QA PASS** on source label/quote preservation, opener mode enforcement, fictional-opener opt-in, spoken title only once, all POWER and LORE words retained in full-source mode, compact mode original-token coverage 50% and full-source 100%, fixed no-bridge, one physical Card line with blank-line separators, silence of Music Bed, optional punchline, stable seed, source refs, input-shape fail closed, source-to-consumer identity and non-acceptance.
- Wrapped Dystopia 56 Card input: original **56**, **55** with complete title/POWER/LORE fields can be prepared as **unaltered source recitation candidates**; **Card #9 `The Firehose` has `power: null`, `lore: null`** (exact original source JSON blob `84c2e72cd73b597e467008452af8a3d4e9dfe00b`). Its Card artworkPrompt exists but must NOT silently substitute as POWER or LORE. The planner reports `NO_BEAT_SOURCE_INCOMPLETE`, blocks automatic complete-deck acceptance and requires visual-only Card cue or an explicit human source review. Therefore **no claimed full 56/56 performed set**.
- Tested a bounded **55 candidate partial preview**, split to three independent source-only text chapters under a 5000-char cap: 27 cards (4918 chars), 26 cards (4870 chars), 2 cards (445 chars), all exact Card IDs accounted for in the *partial* preview. **This is not a publicly accepted/generated 56-card comedy show** and not 56 source-derived Triplets; 55 source recitation drafts only.
- Screen/voice audio: **not run**. One blank line creates text cut metadata; it does not create actual MP3 waveform cuts or guarantee time-coded speech. Beat pauseMs is a rehearsal preference; exact clip/caption timing requires separate actual audio rendering. Suno prompt requests a cappella / no instruments but **Suno is not guaranteed to suppress backing music**. Existing KFB Audio DRY playback is safer for strictly clean stems; original Audio clock/mixer ownership preserved.

## Negative guard & production boundary
- Wrong food/person/mismatched opener categorization rejected; fictional restaurant/meeting cannot silently become Card lore.
- Compact candidate fails strict ≥90% original-token target; full source recitation preserves all original tokens but may need human editing before it becomes a true Triplet.
- Missing Power/Lore produces a visibly blocked source row, **not a silently skipped #9**, and 56 Card count is carried throughout the deck plan. No batch admission or auto canonical/source edits.
- Original 1001 Nights #5–7 rejected candidate and R1 LORE-only candidates remain negative Goldens. Audio Site Source 0.6.0 / Version 9 still supports Wrinkle only, source r3 preview untouched, no extra publish.
- No plugin v0.1.0 update, Suno, TTS, 3D Billboard/Scenelet, World, cloud build, merge or Live.

## Exactly one next gate
**`KFB_STANDALONE_CARD_BEAT_R1_EDITORIAL_LISTENING_GATE`**: Georg chooses between the *compact semantic* and *full-source recital* versions (and optional matching improvisational opener) for the identical Cookie source, using DRY voice on the existing Audio Site when accessible or a permitted source-locked standalone audition. This decides required source retention vs compact speech, stand-up delivery and whether the opener should be optional/default; then add the first accepted Card/Bridge/stand-alone pattern to current private KFB Triplets plugin and extend dataset **without further Work for routine new Card data**.
