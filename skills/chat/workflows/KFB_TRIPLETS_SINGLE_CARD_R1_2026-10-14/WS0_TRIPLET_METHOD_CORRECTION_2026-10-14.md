# KFB Triplets — Georg corrective decision / WS0 handoff — 2026-10-14
**Authority:** Georg; WS0 receiving owner for editorial/method design. **Scope:** single-card Triplet authoring, no gameplay runtime, Site publishing or full-deck rollout.

## Binding intent — play the card, do not explain it
The Card itself is the scripted content. One played card must become one natural, character-performable English utterance grounded in its exact original **cardName + POWER + LORE**. Display the actual original Card; speak its original title. Apply the real mechanic correctly, preserve alternatives, costs and prerequisites; bring in the card's own vivid/meaningful lore. Do not replace mechanics, invent actors, events, consequences, jokes or narrative motivation. Do not manufacture a punchline, comedy beat, irony, final twist or required 'because' conclusion. **SELL means the card's existing consequence becomes audible**, not an extra gag. No mandated Stand-up construction. A source-true concise sentence is success, whether or not it ends on a comedic reversal.

## Relevant production donor: Wrinkle Rumble 48-card spoken-word cut
Georg supplied a 48-line [Spoken Word] Wrinkle Rumble script, e.g.
- "The Creaky-Knees Caliper predicts rain; the mind wants to tango, cartilage refuses."
- "The Wheelchair Joust settles things: roll one, heart attack; roll six, opponent dies."
- "The Creaky-Knees Caliper" and "The Wheelchair Joust" are **method examples only**, NOT source-verified accepted card beats and NOT automatically golden.
Method: original card title + condensed actual mechanic + distinctive lore detail. Voice-first playable utterance, economical language, no rulebook recap. In the full 48-card performance some connective intros ("To settle that", "In protest", etc.) and intro/outro create storytelling; they are **NOT part of the present isolated one-card slice** and must not leak into its facts.
The pasted full script must not be described as fully validated against the exact source JSON or the 90% constraint until separate evidence exists.

## Root cause and fail containment
Georg rejected the **entire 16-card Monomyth Mayhem / Help I Am A Human R1 sample: HUMAN FAIL 16/16**. Machine's 5/5 validateBeat and lexical ContentShare measures only technical metadata and word provenance; no acceptance. Failure: template "title -> mechanics synopsis -> because -> lore", artificial forced final reversal, robotic recital of a concept.
**Supersede** the earlier "SELL first / write a punchline" suggestion: it was a further misinterpretation, not Georg's desired method. Do not propagate that old proposal into briefs, rubrics, builder prompts or WS1.
Retain historical sample and failure records as negative evidence; do not change their status to accepted.

## Retained constraints — not permissions for drift
- One played card, exactly one English sentence; original card title at utterance start as grammatical subject (WS0 V-231 deterministic title substitution); never silently alter game logic ("or" is not "and").
- Trace cardName, POWER, LORE to original pinned JSON and blob SHA. Content word 90% provenance minimum remains a guardrail, not a prose generator or comedy target.
- Output kfb.voice.triplet-opener-pool/1, editor PENDING, evidence spans, exact source metadata; run actual validateBeat plus an honest semantic/editorial review, not acceptance by code.
- When card fields are missing or no truthful single utterance can be composed -> NO_TRIPLET with reason.
- **No runtime LLM**. Later runtime uses curated precomputed pool, deterministic selection, separate opener/figure/reaction layers. V-231 opener arrangement is future infrastructure, not license to insert prefixed filler in the base Triplet.
- No extra opener, bridge, intro/outro, Suno, audio or performance in current slice. No full-deck fan-out until Georg judges a small exemplar sample.

## Proposed corrected acceptance rubric (human gate remains authoritative)
(1) Exact title at start and actually displayed; (2) original POWER action/choices unchanged; (3) LORE meaning present rather than pasted; (4) one fluent English utterance without rulebook jargon where avoidable; (5) zero invented content; (6) no required joke/forced twist; (7) real source/evidence and machine checks; (8) Georg judges readability and playability.
Never claim source-verified donor or Site-visible result without actually reading source/displaying route.

## Owner, write boundary, next gate
Repository georg-doc/kayfabizarro; branch editorial/kfb-triplets-single-card-r1-2026-10-14. The existing kfb-triplets plugin v0.1.2 currently contains obsolete SELL "audible flip" language, which is now **human-superseded**; patch the existing plugin itself in a separate versioned, evidence-checked edit before the next generation. Do not create another plugin, new Site, second runtime owner, PR, merge, or public rollout.
**One next gate:** WS0 reviews this corrected rule with Georg, updates the existing plugin authoring instruction accordingly, and demonstrates 2-3 cards against exact POWER/LORE before 16 or full deck.
