# KFB Triplets deterministic source-span & semantic-operator pilot R1 · Test Report

Date: 2026-10-13
Status: **IMPLEMENTED + SOURCE-BLOB-GROUNDED TECHNICAL PASS · SEMANTIC/COMEDY HUMAN GATE NOT YET PASSED**
Owner: existing ChatterBox Voice PR #379 / branch planning/kfb-chatterbox-voice-layer-v1-2026-10-08.

## Changed code and fixtures

- `tools/deterministic_triplet_pilot_r1.cjs` · CommonJS pure-JavaScript, zero runtime LLM/network/Site requirement, pinned Card span extraction, typed operator validation, one-sentence candidate assembly, Bridge state evidence, explicit NO_TRIPLET/NO_EDGE and seeded deterministic selection. Git blob `7cb25020d9ef14c54dda7ebfc859caa014d55d3d`.
- `data/KFB_TRIPLETS_SPAN_OPERATOR_PILOT_R1_FIXTURES_2026-10-13.json` · exact original selected Card field quotes, proposed semantic proofs and one typed cross-Card edge; all `EDITORIAL_CANDIDATE`, not admitted. Git blob `f6ef0f8bfee9425d1ad827fe77895d92d895f71d`.
- `tools/test_deterministic_triplet_pilot_r1.cjs` · runnable **repository-root Node regression runner**; code syntax checked in V8, not separately executed by Node in this chat. Git blob `91d7060a8a423f6a95dc6d23aeb61f57b28c1bf6`.

## Actual source deck inputs independently fetched from GitHub

| Deck | Actual Cards | Exact original Git blob | Pilot cases |
|---|---:|---|---|
| Wrinkle Rumble | 48 | `695e74af3bd8f0c0cbaa4bd88a57d637ed095f8c` | #10, #31 |
| 1001 Kayfabe Nights | 60 | `c5b6719d6a0612f227615d9917bbfbb45563f45d` | #12, NO_TRIPLET #11, frozen #5–7 negative |
| IGNORE DYSTOPIA | 56 | `84c2e72cd73b597e467008452af8a3d4e9dfe00b` | #2, #4 + 2→4 bridge |

## Deterministic outputs · candidate only

- Wrinkle #10: "The war didn't start over land or ideology, but over a snickerdoodle." (10 original-span tokens, 2 grammar-glue tokens).
- Wrinkle #31: "They are 'safe' now because the doors are locked from the outside." (11 + 1).
- Dystopia #2: "The fear tracks the coverage, not the actual events." (9 + 0).
- Dystopia #4: "The fear is the renewable product, not the forecast." (9 + 0).
- Nights #12: "She doesn't want the Vizier's son; she wants the guy with the blue giant in his corner." (17 + 0).
- Bridge, Dystopia 2→4: "It never arrived, so issue the next at full volume." Operator MISSED_DEADLINE_RENEWED_ALARM; source fields previous POWER "never arrived" + next POWER "issue the next at full volume", before/after and changed stake specified. **Human semantic/comedian PASS unknown**.
- NO_TRIPLET: Nights #11 (no curated admissible recipe yet).
- NO_EDGE: Wrinkle #31 → Nights #12 (no curated compatible edge).
- Full Nights Deck scope: **60 selected, 0 silently omitted**, *not* a 60-Card script.

### Source usage

Across these **five candidates only**, exact source-span fragments contribute **56 of 59 whitespace/unicode word tokens = 94.92%**; allowed `because` and `but over` add 3. These are **source-fragment token shares based on the emitter provenance**, not the earlier strict ≥3-contiguous-word matching algorithm, and not a rating of humor or causal elegance. All fragments carry actual field, start/end character offset and original source revision when compiled. The original Card title remains a nonspoken source identity if it is not part of the selected spoken fragment. No arbitrary newly invented character, prop or scenario is present in emitted text.

### Real checks

An actual execution of **the exact committed CJS module source** via a fresh V8 JavaScript evaluation with current GitHub deck and fixture reads:
- **35/35 PASS** after one bounded repair. Verified three exact source blob pins and Card counts; five expected candidate utterances; all source substrings at exact field offsets; candidate-only/no promotion status; one Bridge with actual two-sided quote offsets; NO_TRIPLET/NO_EDGE; 60/60 deck scope; fixed-seed determinism; negative source/candidate pin; rejection of synopsis-only operator, invented source text, new unauthorised glue, fabricated operator, missing Bridge stake; Node-runner JavaScript syntax; current Audio unsupported multi-deck status. Negative Golden remained unmodified.
- **Initial wider test 20/22** due to one real integration mismatch: Fixture stored `from/to` as source Card objects while Bridge compiler expected flat `fromCard/toCard`. Implemented exactly one bounded correction accepting both identities without changing meanings. **Subsequent full V8 checks 35/35** with zero failure.
- The pure Node regression runner was **created and its JavaScript syntax parsed**, but an actual local `node test_deterministic_triplet_pilot_r1.cjs` run was **not performed** here. Its complete git-corpus run remains reproducible for a subsequent independent test runner. Do not claim Node CI or headless browser execution.
- The source and static tests **do not prove the semantic Triplet/Bridge quality**. The middle predicate/reframe and state evidence are *authored candidate proof labels*. A malicious/wrong label could fool machine structure checks. Independent semantic criticism and Georg's editorial listening/reading still required before any `REVIEWED` or `HUMAN_ACCEPTED`.
- The old 1001 Nights #5–7 output remains frozen **HUMAN_FAIL**, not reworded, not regenerated as a new Suno song, 0 promoted Triplets/Bridges from it. Hard-coded Audio v9 Wrinkle 48-only receiver unchanged.

## Non-goals and one next gate

No Plugin Creator v0.1 update, new Site, real Suno/TTS generation, full-Deck output, Audio Site multi-deck import, caption/3D Billboard playback, new runtime owner, Cloudflare, PR merge or Live. The pure grammar is a **bounded candidate emitter**, not an approved large-scale stand-up engine. Its curated operators and examples are deliberately few; no arbitrary unknown Cards are classified as automatically speakable.

**Next gate: `KFB_TRIPLETS_PILOT_R1_INDEPENDENT_SEMANTIC_CRITIC_AND_HUMAN_REVIEW`.** Independent critic assesses the five real source-based utterances and 2→4 Bridge against L-26 predicate/reframe and the existing narrator Seven Moves; Georg KEEP/TUNE/CUT determines actual quality. Only if that is convincing, update the existing private plugin skill in place and plan Site authoring UI. The separate Audio #365 generic multi-deck receiver remains a later engineering step.
