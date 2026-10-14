---
name: compose-card-performance
description: Compose pinned source-faithful, single-card English Triplets with exact title, POWER/LORE semantic integration and source-derived turn; produce auditable dialog-pool beat records or NO_TRIPLET.
---

# KFB Triplets — Single Card R1 (2026-10-14)

This is the **existing** kfb-triplets plugin, not a new plugin, runtime, Site or audio system. In this R1 slice, compose **only independent, single-card Triplets**. No Openers, Bridges, intros, outros, "Stay Fluffy!", multi-card performances, Suno, audio or Site exports. Ignore older out-of-scope guidance in reference files.

## Source lock
Read current GitHub start protocols then the exact `georg-doc/kayfabizarro/media/kfb/*.pdf.json` at a pinned commit, record its Git blob SHA. Read `cardName`, `power`, `lore` only as content. Never use `artworkPrompt`, `grade`, `gradeReason`, marketing text or metadata as content. Null, missing, empty or malformed any field -> `NO_TRIPLET` plus reason, without invention. A named deck means **all** unique cardNumbers exactly once, a Triplet or NO_TRIPLET for every card. Never silently default to three.

## Binding SHOW / SPIN / SELL
- Exactly ONE connected, character-performable English sentence per Card, never two or three, fragments or lists.
- SHOW: utter the exact original `cardName` within that sentence.
- SPIN: perform the specific POWER rule/action/effect *in* the LORE's original context/reason/meaning; don't merely concatenate source fields or omit one.
- SELL: close on an audible concrete flip, implication or catch sourced to that same card's POWER/LORE, not an invented gag or generic punchline.
- At least **90%** of spoken **content words** must derive verbatim or by minimal grammatical inflection from title/POWER/LORE; other words may only be grammatical glue. Preserve authorial weirdness. No external facts, actors, places, events or rules. Document tokenization, stopwords and contentShare ratio; a failed ratio is not a candidate PASS.

## One importable beat schema
Use `kfb.voice.triplet-opener-pool/1`: `{beatId:"<deckId>:<n>:triplet-r1",version:1,deckId,cardNumber,cardBlob,mode:"COMPACT",surfaceText,openerId:"DIRECT",openerVersion:1,status:"EDITORIAL_CANDIDATE",humanAcceptance:"PENDING",reviewer:null,evidence,semanticCoverage,delivery,contentShare,slots}`. `evidence` has >=1 `{field,quote,start,end,spoken}` entry for each of `cardName`,`power`,`lore`. `quote` is an EXACT substring of its original source field at character offsets `[start,end)`; `spoken` is exact text in surfaceText. `semanticCoverage` includes descriptions of `power`, `lore`, `reframe`, `humanAcceptance:"PENDING"`. `delivery` exactly `{pauseBeforeMs:300,pauseAfterMs:800,rate:0.93,pitch:1}`. `contentShare` `{method:"content words from card / all content words",pct}`; `slots` `{show,spin,sell}` must quote actual consecutive source text parts of surfaceText. For source failures use a separate nonplayable NO_TRIPLET record, not a fake beat.

## Non-negotiable self-check
Reject missing title, POWER, LORE; missing spoken title; field evidence absent or malformed; multiple sentences; raw source recital, plain synopsis without audible turn, generic filler, stock jokes, unsourced additions, <90% contentShare, missing slots or source-unsupported final turn. Verify syntax *and semantic causality*; lexical matching by itself is insufficient. Run source/metadata evidence through `validateBeat` from branch `ws1/r3f-frame`, path `ws1/kfb-planet/src/vendor/triplet-pool-core.mjs`. The core validates evidence metadata but **not** sentence count/percentage/turn; own checks remain mandatory. Do not claim tests executed unless actually run.

Negative regression must fail: 1001 Kayfabe Nights #5–7 R1 synopsis/invented bridging; also a plain card recital. "The Cookie of Causality" reference is TUNE, not golden. For first gate provide Monomyth Mayhem 1–8 and Help I Am A Human 1–8 with original title/POWER/LORE next to candidate, ratio and reasons; then pause for Georg's judgment before any whole-deck production.

## Ownership
No branch reuse from Voice/Audio. On user-authorized check-in, add plugin sources/sample JSON/report on a new branch of existing repo; no PR, merge, Stage/Live. After each GitHub write read the exact branch head and changed file. Keep Return honest: counts of Triplets/NO_TRIPLET/self-check failures, actual executed validator count, pinned blobs, unresolved negatives and one human next gate. No autopromotion.
