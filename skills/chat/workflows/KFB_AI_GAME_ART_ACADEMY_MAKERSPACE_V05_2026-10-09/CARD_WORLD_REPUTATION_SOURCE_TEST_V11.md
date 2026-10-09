# Card → World / NPC Six Reputation Tiers · Evidence R1 · 2026-10-09

**Scope:** read-only GitHub source/contract validation, plus local machine-readable fixture checks. This is NOT a live MVP test.

## Checks

**16/16 pure data fixture assertions PASS** for `CARD_WORLD_REPUTATION_SIX_TIER_FIXTURE_V11.json`: tiers exactly 1–6, continuous nonoverlapping 0–56 deck bands, threshold 10, 51/56>90%, Deck/World/NPC scopes, 0 and 2+ linked-deck worlds, noncanonical synthetic world sample flagged, no independent XP/Card/NPC-memory DB, distinct WorldGraph access milestones, no universal automatic Card grant, bounded one-hop rumor, independent warm/neutral/skeptical sentiment, accessible Academy fundamentals, zero claimed runtime.

**22/22 independent current source + document assertions PASS**:
- PlayerSave has Card collection and social refs; Lean Memory uses real Encounter/Provenance/Moment records and derived NPC views;
- one canonical `deckId+cardNumber` identity;
- Lab God Mode `kfb.island-config/1` allows `0…n` decks per island;
- Resident Life candidate has familiarity, affinity and optional trust;
- sibling Fluff v0.4 uses CHILL/PULL DON'T GATE and defers feature implementation;
- 56-card fixture uses 0/1/3/10/28/51 cutoffs without ambiguity;
- first Card can be discovery but World-only authoring decides access;
- one-hop rumor, separate valence, no duplicate card or NPC memory, read-only check-in explicitly outside MVP.
Exact checked GitHub blobs:
- `SITE_GODMODE_LEAN_MEMORY_ARCHITECTURE_2026-10-04.md` `ff4571348634181323059b0babad3b5d862e409c`
- `DECK_WORLD_SEED_CARD_PIPELINE_2026-10-04.md` `15f8fce5428bfc6c2725b9e3042e9a83966468`
- `RESIDENT_LIFE_SEMANTIC_MODEL_PREP_2026-10-06.md` `17e5e0e36eb7aaa949a077188bc1509a79681785`
- Lab `SPEC_WORLDBUILDER_GODMODE_VISION_R1.md` on `sync/lab-rkit-2026-10-09` blob `b53fbf75c87a7a8c6aa6bdff8c54d9585ad545fd`
- sibling Fluff `KFB_PLAY_CRAFT_LEARN_OPTIONAL_SURVIVAL_PROFILES_V0_4_2026-10-09.md` blob `de686cf04f47d5fe6008cd6316223851fbccb5c1`
- Three Deck registry shards on current main report exactly `metadata.cardCount = 56` each: forget_utopia `190079f02487d08b040af81839c912bb7519c9f1`, ignore_dystopia `b6c0cd3653e773c836e0605263544015f91d5686`, embrace_protopia `491c53e48e9d37948f9897a890d94c5246eb57f4`.

## NOT tested, MUST NOT CLAIM

**0 runtime implementation; 0 Lab acceptance; 0 browser/Game QA; 0 actual Save/Reload; 0 NPC reputation animation; 0 card-triggered Gatekeeper access; 0 rumor delivery; 0 real courier/Fluff reward transaction; 0 Stage/Site; 0 human acceptance.**

The user-requested six stages are a product preference; their English labels and thresholds are provisional balancing. The proposed World and NPC tier evaluation must be reviewed by existing World/Resident owners before acceptance. Lab doc header date 2026-10-10 is later than system date 2026-10-09; only the actual current GitHub branch head/source is evidence, not a future-dated completion claim.

**Delivery:** `CARD_WORLD_REPUTATION_SIX_TIERS_V11.md`, `CARD_WORLD_REPUTATION_SIX_TIER_FIXTURE_V11.json`, `HANDOVER_CLAUDE_CODE_DECK_WORLD_REPUTATION_FLUFF_V11.md`.
**Next:** existing Claude Code Worldbuilder Lab steering, READ ONLY architecture fit verdict; active Academy gate unchanged `ACADEMY_MAKERSPACE_VISUAL_SOURCE_PROOF_R1`. No R5.
