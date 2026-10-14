# KFB Triplets R1 — isolated single-card editorial slice
Owner: existing kfb-triplets plugin, skill compose-card-performance. Source owner: georg-doc/kayfabizarro. Git branch: editorial/kfb-triplets-single-card-r1-2026-10-14. No PR, merge, Site, Suno, audio, voice or performance work.

## Binding contract (Georg 2026-10-13/14)
One card produces exactly ONE continuous, character-performable English sentence or explicit NO_TRIPLET with reason. SHOW: speak exact cardName. SPIN: causally apply POWER (action/effect/rule) to LORE (context/meaning/reason), never concatenate field excerpts. SELL: audible end-turn grounded in the card's own cost/catch/irony, never outside joke. At least 90% of content words must originate in cardName + power + lore (verbatim/minimally inflected); remaining words grammatical glue only. No other facts, people, events, setting, lore or rules. Preserve author's strange wording. All 3 original source fields required and audibly traceable.

## Source
Read exact media/kfb/*.pdf.json from a pinned Git commit, record Git blob SHA (40 hex); confirm every cardNumber. Named deck = whole deck, every unique cardNumber exactly once (beat or NO_TRIPLET). No silent default of three. Never use grade, gradeReason, artworkPrompt, marketing, image text or registry metadata as content. Null, empty, nonstring or malformed cardName/POWER/LORE -> NO_TRIPLET, never repair from guesses.

## Output — one import route
Single-card beats follow kfb.voice.triplet-opener-pool/1. Beat fields: beatId "<deckId>:<n>:triplet-r1"; version 1; deckId; cardNumber; cardBlob; mode COMPACT; surfaceText; openerId DIRECT; openerVersion 1; status EDITORIAL_CANDIDATE; humanAcceptance PENDING; reviewer null. Evidence for each of cardName,power,lore includes {field,quote,start,end,spoken}; quote is exact original field substring at original 0-based [start,end), spoken is exact audible substring in surfaceText. semanticCoverage {power,lore,reframe,humanAcceptance:PENDING}; delivery {pauseBeforeMs:300,pauseAfterMs:800,rate:0.93,pitch:1}; contentShare {method:"content words from card / all content words",pct}; slots {show,spin,sell} are quoted substrings of surfaceText. All acceptance stays human PENDING. A NO_TRIPLET record preserves source identity and reason and is not a playable beat.

## Required self-check — reject (never silently score as a beat)
- Missing/malformed title, power or lore.
- Title absent verbatim from surfaceText; fields not all represented via exact source quote and audible spoken anchors; faulty evidence spans.
- 2+ sentences, fragments, list, raw recital, literal title+POWER+LORE concatenation.
- Missing semantically connected action/setting, a bare synopsis, no final source-derived implication turn.
- Generic filler, stock punchline, any extra-world claim.
- Content share <90%; calculate content-word ratio rather than input-token retention, document tokenizer/stopword rules; audit inflections.
- All slots must be exact surfaceText substrings in natural show→spin→sell order.
Use core validateBeat from ws1/r3f-frame ws1/kfb-planet/src/vendor/triplet-pool-core.mjs on each playable beat. Core validates metadata/evidence but does NOT test semantic quality, sentence count, percent or recital: run separate own check too. If core is unavailable, label core validation NOT RUN; do not claim PASS.
Negative golden: 1001 Kayfabe Nights #5–7 R1 synopsis/invented bridges must FAIL. Plain original recital must FAIL. Cookie of Causality example is TUNE, not golden.

## Bounded sample/human gate
First only Monomyth Mayhem 1–8 and Help I Am A Human 1–8, original title/POWER/LORE beside line, contentShare, NO_TRIPLET reasons; run both negative regressions; report counts Triplet/NO_TRIPLET/failed own check; no full deck before Georg judges. Openers, bridges, intros/outros ("Stay Fluffy!"), performances, Suno, audio and Site are later separate layers. Do not borrow older skill advice on these out-of-scope features.
