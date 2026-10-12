# KFB Triplets · Semantic + Bridge Contract Recovery R1
Date: 2026-10-13
Status: **SOURCE-COMPARISON COMPLETE · HUMAN FAIL RETAINED · REPAIR DECISION PREPARED · PLUGIN UNPATCHED**
Execution mode: RECOVERY, independent source/contract assessment, not a new creative audition.
One owner: existing `georg-doc/kayfabizarro` · ChatterBox Voice Draft PR #379 · branch `planning/kfb-chatterbox-voice-layer-v1-2026-10-08`.
Read first: `POSTMORTEM_KFB_TRIPLETS_1001_NIGHTS_SOURCE_BRIDGE_SEMANTIC_FAIL_2026-10-13.md` (binding exact negative Golden), `data/KFB_1001_NIGHTS_TRIPLETS_FAIL_PROVENANCE_AUDIT_R1_2026-10-13.json`.

## Why source preservation checks did not prove a Triplet
Independent source contrasts were read by exact GitHub path/blob:
- `skills/chat/town/references/KFB_META_NARRATION_SAMMLUNG_WS0_2026-09-14.md` @ `9ca3ed0a9987fbb11d0721f5689d6040943403d5`, §3 L-26: subject / **meaning-bearing middle predicate** / reframe. The middle's unexamined authority assumption is the thing to expose. Second speaker appropriates the *prior speaker's words*, not merely the next Card title. Example “[Freiheit] [ist letztendlich] [die größte Tugend]” is a **discourse form illustration**, not a human-accepted new Card comedy Golden.
- `media/prompts/narrator/bunny_carny.md` @ `a89a174934d1bac834d9e2aa30`: audible causal hinge, tangible action/cost, specific anchor then subversion, and narrator as invitation rather than an explainer. Its clock/bill example is a **method donor** not a new canon Card.
- `DECK_CARD_ONE_SENTENCE_TRIPLET_AND_FRACTAL_QUEST_R0_1_2026-10-12.md` distinguishes **one grammatical utterance** from 3 autonomous fragments. Its #2 Chatter-Chompers compressed effect is a Card-derived sentence, not sufficient proof of a semantic reframe/comedy.
- Plugin v0.1 `plugin/kfb-triplets/skills/compose-card-performance/SKILL.md` @ `f8ccc11af40e13051951510bf38798c662d417c4` explicitly directs “title/POWER/LORE anchors” and defaults unspecified task to **three Cards**. These are not inherently wrong as provenance, but can *never substitute* for a meaningful connector+reframe and explicit user scale.

## A. Four separate types, no more conflation
| Type | Minimal independently demonstrable evidence | NOT enough |
| --- | --- | --- |
| Card source | Exact `deckId/cardNumber/blob/cardName/power/lore/artwork` with null-handling; citations separate | a convincing retelling or one title match |
| Semantic Triplet | **One** spoken sentence; explicit `subject`, `connectorPredicate`, `reframe`; connector carries specific claim/action/implicit assumption, reframe changes interpretation or consequence | title + two details / synopsis / mere grammatical one-liner |
| Cross-Card Bridge | `beforeState` caused by Card A, `hingeAction` that changes available action/stake, `afterState` supported by Card B, `costOrReversal`, `sourceRefs`, editorial provenance; human plausibility critique | “retaliation” label, announcing next Card, or invented unseen physical event |
| Higher story / Suno | User-requested exact Card scope and order or evidenced page; actual Card beats, previous effects persist, rhythmic closure; provenance and source-word-match disclosed | three randomly chosen Cards from a 60-card deck, text length or tags alone |

A Triplet semantic **reframe** may arise through actor appropriation/over-affirmation, reversal or concrete consequence; it does not require a long separate joke. A Bridge can be deliberately absurd **provided** its causal hinge can be pointed to in the story state. Fictional dramatization stays clearly editorial and cannot be falsely labeled as original Power. When the connection cannot be justified use `NO_EDGE` or explicit cut/scene change; do not fill the seam with generic text.

## B. Scope guard
Input is exact original `media/kfb/1001_Kayfabe_Nights_-_ADD_web_ID.pdf.json` @ blob `c5b6719d6a0612f227615d9917bbfbb45563f45d`, **60 Cards**. Named-deck-only input MUST be classified as deck-intent, not default THREE_CARD. First report 60/60 Card IDs, actual page address/selection evidence and the feasible 5,000-character plan. If the whole deck cannot fit, split into sequential labeled parts with unomitted IDs or ask for a *targeted creative choice* rather than silently doing 3/60.

Original rejected #5→6→7 remains negative Golden `KFB_1001_KAYFABE_NIGHTS_5_6_7_FRIZZLEBOB_TRIPLETS_SUNO_R1_2026-10-13.md` blob `4d813bfd5aadf57c80552afb4960473c0558b23e`. NEVER recast its 17/17 structural/source count as creative PASS. Postmortem auditable figures: strict 36/114 = 31.58% exact source-overlap (>=3 contiguous original words), 78/114 = 68.42% non-verbatim; this is surface wording, NOT proof every other word invents a fact. 0/3 accepted semantic Triplets and 0/2 accepted causal Bridges, 0/6 complete Power/Lore fields. Do not rerender or rewrite this specimen.

## C. Audio receiver incompatibility is not a plugin content failure
Audio owner existing Draft PR #365, branch `web/kfb-adaptive-music-stem-proof-2026-10-06`, v9 Site code:
- `tools/KFB-ToolBox/audio/card-performance-self-service/card-performance-core.mjs` @ `3e10209e6d76af718420e7fe8c1175c6070bfb8d`: `validateDeck` hardcodes 48 and Wrinkle; `parsePerformanceText` requires exactly 50 spoken segments (intro + 48 + outro).
- `tools/KFB-ToolBox/audio/card-performance-self-service/card-performance.js` @ `133a1ccee8f0bac9091ab1a608bbd95f7f10ec75`: hardcodes `deckId='wrinkle_rumble'`, 3 timing profiles × 50 cues, Wrinkle-specific preview-feed path/source/casting/cache.
- Merely replacing the deckId string **cannot** make a 60-card audio import compatible. The existing v9 Site is a **Wrinkle Rumble 48-Card product**, while the desired plugin is **KFB corpus/deck independent**.
- The plugin must explicitly output capability status for *each* consumer: `SUNO_COPY_READY` can hold for any source-backed deck; `AUDIO_SITE_IMPORT_SUPPORTED` only after the exact current Audio owner accepts that deck and matching schema; otherwise `AUDIO_SITE_IMPORT_UNSUPPORTED_DECK`. Never claim an importable JSON when unsupported.
- Future receiving-owner bounded Site upgrade: metadata-driven card count/selected pages, variable-length 1/3/4/N segments, per-renderer cue lengths, dynamically source-pinned deck IDs, protected preview vs accepted, fallback, and regression preservation of existing r3. This is **one-time capability change** to Audio #365 (may require Sites-capable publish); ordinary later content rows must continue to hot reload without Work. Do not patch a second Audio runtime in Voice #379.

## D. Proposed bounded **separate** plugin R0.1.1 repair (NOT executed in this source-evidence slice)
One targeted amendment to existing private plugin/Voice mirror, not a new plugin:
1. Drop unspecified `THREE_CARD` default for named deck, use explicit user scope or full-deck plan; no silent scope reduction.
2. Replace the broad “one Card sentence = semantic Triplet” inference with **Triplet evidence slots**: source Card fact(s), subject, real middle predicate with causal/rhetorical operation, changed interpretive stake in reframe. Annotate independently, keep speech itself a single compact utterance.
3. Add **Bridge proof fields** `beforeState, triggeringAction, afterState, changedStakeOrCost, sourceRefs, relationKind, editorialStatus`. A label and line are not sufficient. If any required seam absent, no `bridge` claim, only `NO_EDGE`/cut.
4. In output, separate `ORIGINAL_CARD_FIELDS` / `DERIVED_TRIPLET` / `EDITORIAL_BRIDGE` / `PERFORMANCE_ARC` and report literal original-word overlap with explicit method; never use verbatim % as automatic artistic quality gate.
5. Consumer capability matrix: always honest `SOURCE_ONLY`, `SUNO_COPY_READY`, `SITE_IMPORT_UNSUPPORTED`, or `SITE_IMPORT_TESTED` based on receiver evidence.
6. Independent negative regression on the frozen 1001 #5–7 case: same old lines must FAIL Triplet and Bridge; source-summary with correct names but no reframe must fail; new output requires actual annotated relation and source state, plus an independent critic / Georg judgement before creative PASS. No “20/20 source checks = 20/20 comedy” rhetoric.
7. Update private Plugin Creator release **in place** (same backend plugin ID), mirror exact released skill files into Voice branch, read exact branch head after each write. No Audio Site deploy, Suno/song generation or active r3 preview change.

## E. Tests actually executed for this recovery
15/15 explicit code/source evidence assertions PASS, **only** that the named contracts and hardcode seams exist. Examined original 60-card Nights and 48-card Wrinkle JSON, semantic Goldens, failed candidate/postmortem and actual Audio editor/core. This is not a live repair/test of plugin behavior.
- FAIL retained: Georg's human content verdict.
- Plugin repair attempts here: **0**; new valid Triplets produced **0**; new valid Bridges demonstrated **0**; Audio/Suno/Site generation **0**.
- Negative regression is **specified**, not yet run.
- No second plugin created, audio Site changed, preview feed updated, merge or Live.

## Single next gate
`KFB_TRIPLETS_V0_1_1_FAIL_CLOSED_SKILL_REPAIR_AND_INDEPENDENT_REGRESSION_R1` in **Voice PR #379**, followed only if its independent functional/semantics test is sound by a **separate** Audio #365 capability/generalization gate. Do not auto-promote rewritten creative outputs.
