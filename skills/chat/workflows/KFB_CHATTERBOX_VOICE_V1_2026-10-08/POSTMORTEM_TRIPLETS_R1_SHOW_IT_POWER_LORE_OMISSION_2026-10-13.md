# KFB Triplets R1 · Show-it / POWER / LORE omission · SECOND PRODUCT-SEMANTIC FAIL
Date: 2026-10-13
Status: **GEORG HUMAN_FAIL · CURRENT R1 CANDIDATES QUARANTINED · TECHNICAL 35/35 NOT PRODUCT ACCEPTANCE**.
Owner: existing Voice/ChatterBox Draft PR #379, georg-doc/kayfabizarro branch `planning/kfb-chatterbox-voice-layer-v1-2026-10-08`.
Prior negative Golden: `POSTMORTEM_KFB_TRIPLETS_1001_NIGHTS_SOURCE_BRIDGE_SEMANTIC_FAIL_2026-10-13.md`, preserved.

## Binding correction received from Georg
The actual intended **single-card spoken performance Triplet** must be a **single connected, character-performable sentence** in which:
- **SHOW IT**: the ORIGINAL card title is actually spoken, not just retained invisibly as metadata / visual card title;
- **SPIN IT**: a concrete original POWER (rule/action/effect) and LORE (setting, reason, meaning, source's comic tension) are translated into the **semantically related slots** of the Triplet, rather than just concatenated as "Title + Power + Lore" or arbitrarily omitting either;
- **SELL IT / REFRAME**: the existing Card's implication changes or snaps in the audible final turn, using its own source materials. One syntactically grammatical summary is insufficient;
- one spoken Triplet is one utterance; Show/Spin/Sell are *semantic roles inside this card performance* (and can also recur fractally at higher level), not three disconnected spoken sentences.
- Inter-Card **BRIDGE** remains a separate object with prior-effect -> next trigger/condition -> changed stakes/cost, or honest NO_EDGE; a connector word alone does not establish causality.

Source fields are NOT literally identical to subject/connector/reframe slots. The complete original title, POWER and LORE must each be traceably USED in the emitted line or have an explicitly reviewed omission with a documented reason. For the MVP acceptance fixture, require ALL THREE used. Null/malformed fields => honest NO_TRIPLET unless a separate authorized source-specific exception is made. Preserve original wording as far as grammar allows; new physical incidents, actors and unrelated jokes are forbidden.

## Actual measured failure of R1, based on exact GitHub script + fixtures + Card JSON
Current code: `tools/deterministic_triplet_pilot_r1.cjs` Git blob `7cb25020d9ef14c54dda7ebfc859caa014d55d3d`.
Fixtures: `data/KFB_TRIPLETS_SPAN_OPERATOR_PILOT_R1_FIXTURES_2026-10-13.json` blob `f6ef0f8bfee9425d1ad827fe77895d92d895f71d`.
Three original decks pinned: Wrinkle Rumble 48 @ `695e74af3bd8f0c0cbaa4bd88a57d637ed095f8c`; IGNORE DYSTOPIA 56 @ `84c2e72cd73b597e467008452af8a3d4e9dfe00b`; 1001 Nights 60 @ `c5b6719d6a0612f227615d9917bbfbb45563f45d`.

| Card | Actual R1 speech | Title spoken? | POWER excerpt? | LORE excerpt? |
|---|---|---|---|---|
| Wrinkle #10 The Cookie of Causality | The war didn't start over land or ideology, but over a snickerdoodle. | NO | NO | YES |
| Wrinkle #31 The Abyss Home | They are 'safe' now because the doors are locked from the outside. | NO | YES | YES |
| Dystopia #2 The Perpetual Almost | The fear tracks the coverage, not the actual events. | NO | NO | YES |
| Dystopia #4 The Renewed Alarm | The fear is the renewable product, not the forecast. | NO | NO | YES |
| Nights #12 PRINCESS BADROULBADOUR | She doesn't want the Vizier's son; she wants the guy with the blue giant in his corner. | NO | NO | YES |

**Actual code-derived numbers: 0/5 with title spoken; 1/5 with POWER source field used; 5/5 with LORE source field used; 0/5 with all three.** Previous 56/59 =94.92% excerpt-vs-glue word share therefore *misleading for the intended output*. 35/35 technical checks confirmed precisely the wrong acceptance contract. `TECHNICAL_SOURCE_SPAN_PASS` remains historical evidence; **`CARD_PERFORMANCE_PRODUCT_FAIL` supersedes any implication of a valid R1 Triplet**. The lone R1 Dystopia Bridge is also unreviewed and cannot rescue omitted on-card Show/Spin/Sell.

## Source example and expected structural contract — PROPOSAL, not accepted Creative Golden
Original Wrinkle #10:
- cardName `The Cookie of Causality`;
- POWER `Inciting Incident: Restart the game from Turn 1. Keep all damage.`;
- LORE `The war didn't start over land or ideology. It started over a snickerdoodle.`.

One **proposed** spoken utterance:
> The Cookie of Causality restarts the war over a snickerdoodle at Turn One, but keeps all the damage.

SHOW IT = original title; SPIN IT = POWER restart / Turn One applied to LORE war over a snickerdoodle; SELL IT = source POWER keep all damage, furnishing contradiction/comic cost. "restarts the war" is a short editorial semantic join, not literal POWER; this must be clearly attributed. The title, action and ironic cost are audible. This is only an **editorial demonstration** of the rule, NOT a generator release, human-accepted line or new Rule1 creative pass. A reviewer can still TUNE or reject it.

## Why the code passed the wrong thing
- Old `compileTriplet` required `source.length >= 2` but **not one span from each of** `cardName`, `power`, `lore`.
- It accepted `subjectEvidence` in ANY cited text, so a pronoun, "the war" or "the fear" satisfied the slot and did NOT establish the visible Card.
- It required only machine-authored labels `interpretationBefore !== interpretationAfter`, not a validated *audible* transition tying actual POWER with LORE and landing a reframe.
- Its "source share" measurement rewarded LORE-only quotation as much as genuine Card/Power/Lore integration.
- The debug checks never asserted a cardName in emitted speech; this had become a second version of the prior type-conflation failure.

## Fail-closed guard before further repair
1. **DO NOT** promote the five R1 outputs as a passed product, creative positive Golden or import into Audio/ChatterBox pool/Suno/World; retain code, fixtures and original test report as historical debug fixtures.
2. Next small proof must first explicitly label/show: original exact title, original POWER, original LORE; one audible line that uses all three with a meaningful subject/predicate/reframe; then evaluate its comic cost. A generic all-three field copy is NOT enough without meaning.
3. Hard-negative tests must reject: title omitted, power omitted, lore omitted, plain Title+Power+Lore synopsis lacking turn, operator label with ungrounded semantic slots, generic funny filler, made-up source facts. Show both good and failing cases to independent critic.
4. After two non-improving repair passes, preserve the smallest broken seam rather than claiming success or rerendering arbitrary stories. The prior 1001 Nights negative Golden stays frozen.
5. All new Card/performance output requires explicit **HUMAN CREATIVE DECISION** before accepted goldens; no more automated "35/35 = concept success".
6. A separate future Audio receiver gate still needs generalizing `wrinkle_rumble`/48 Cards/50 segments/3×50 cues to other source decks. Do not confound that with semantic authoring correctness.
7. Existing KFB Audio Site Source 0.6.0 / Version 9, r3 Card11 preview and Audio PR #365 are unchanged.

## One next gate
`KFB_TRIPLETS_SHOW_SPIN_SELL_SINGLE_CARD_HUMAN_FORMULA_GATE_R1`: validate the above one-card source/Power/Lore/show/turn mapping against Georg's intention, with independent creator/critic separation. If the formula is human-accepted, make ONE revised constrained compiler and comprehensive negative regression in this existing Voice owner; then evaluate Bridge and deck scale. No separate Site/plugin/publish while formula remains disputed.
