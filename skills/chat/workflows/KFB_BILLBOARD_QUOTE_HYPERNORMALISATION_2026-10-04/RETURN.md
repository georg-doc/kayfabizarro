# RETURN · KFB Billboard Quote Hypernormalisation

Date: 2026-10-04
Status: QUOTE POOL BATCH 01 + RESEARCH RESERVE 01 COMPLETE · GEORG CURATOR REVIEW PENDING
Owner: KFB Quote Curator · normal Web Chat
Slice: research/data only · no Work/WSA runtime work
Repo: georg-doc/kayfabizarro
Branch: planning/billboard-quote-hypernorm-curator-2026-10-04
Draft PR: #354
Last verified branch head before this Return write: dc7c1498ef6313ef7e9ecfccb261783ac56ec0d6

## Batch 01 · mapped canonical-deck pool

The first 10 canonical records from `media/kfb/index.json` were curated from their canonical Card JSONs:

1. `1001_kayfabe_nights` — Uncle FrizzleBob's 1001 Kayfabe Nights — 3 candidates
2. `ai_kayfabe` — Roko's Basilisk & The AI Kayfabe Takeover — 3 candidates
3. `academic_anarchy_intellectual` — Unseal the Academic Anarchy — Academic Alphas vs Brain Benders — 3 candidates
4. `anti_rules_toolkit` — The Anti-Rules Manifesto — 3 candidates
5. `big_bad_brain_wrestling` — Big Bad Brain Wrestling — 3 candidates
6. `brain_flipper_image_spots` — The Brain-Flipper Pack — 3 candidates
7. `cinematic_kayfabizarro_2` — Cinematic Legacy & Motion Picture Kayfabe — 3 candidates
8. `cosmic_grift_dark_journalism` — Cosmic Grift – Dark Journalism — 3 candidates
9. `forget_utopia` — Forget Utopia — 3 candidates
10. `ignore_dystopia` — IGNORE DYSTOPIA — Anatomy of a Trap (Deck B) — 3 candidates

Mapped Batch 01 total: **30 quote candidates**.

Provenance:
- VERIFIED (`PRIMARY_OR_EDITION_VERIFIED` or `DOUBLE_CHECKED`): **27**
- `SECONDARY_ONLY`: **3**
- `UNVERIFIED`: **0**

Rights:
- `PUBLIC_DOMAIN_CONFIRMED`: **21**
- `RESEARCHED_RESTRICTED`: **6**
- `RESEARCHED_QUOTE_LIMIT_ONLY`: **2**
- `DRAFT_RIGHTS_UNKNOWN`: **1**

Validation: **13/13 PASS**.

## Research Reserve 01 · deliberately unmapped

Added **25 further quote + FrizzleQuestion candidates** selected for semantic strength independent of any one current deck.

File:
`QUOTE_RESEARCH_RESERVE_01.json`

Reserve policy:
- status = `RESEARCH_RESERVE`;
- mapping status = `UNMAPPED_BY_DESIGN`;
- **no deck/Card/island/biome/Billboard mapping is assigned yet**;
- later curation may map a candidate many-to-many across canonical decks, island/biome contexts and concrete Billboard placements;
- no candidate is made runtime-eligible merely by being in the reserve.

The reserve intentionally does **not** pretend to conform to `QUOTE_POOL_SCHEMA.json`, because that mapped runtime/pool schema requires `deckRefs`. A reserve candidate enters the mapped quote pool only after an explicit later curator mapping decision.

Reserve themes span:
- uncertainty, doubt and scientific method;
- attention, information and models;
- automation, invention and cognitive offloading;
- agency, obedience, contracts and power;
- cooperation, competition and social systems;
- status, consumption and performance;
- appearance, reputation and hypocrisy;
- misinformation, media speed and public narratives;
- mortality, freedom and existential orientation;
- medicine, observation and evidence.

Representative authors include Francis Bacon, Charles Darwin, T. H. Huxley, Henri Poincaré, Alfred North Whitehead, Mary Shelley, Adam Smith, Peter Kropotkin, Thorstein Veblen, Étienne de La Boétie, Mary Wollstonecraft, John Stuart Mill, Machiavelli, Hobbes, Bastiat, Pascal, Chesterton, Swift, George Bernard Shaw, H. G. Wells, Spinoza, La Rochefoucauld, Charles S. Peirce, Florence Nightingale and Claude Bernard.

Reserve provenance:
- VERIFIED: **24**
- `SECONDARY_ONLY`: **1**
- `UNVERIFIED`: **0**

Reserve rights:
- `PUBLIC_DOMAIN_CONFIRMED`: **22**
- `RESEARCHED_RESTRICTED`: **2**
- `RESEARCHED_QUOTE_LIMIT_ONLY`: **1**

Open reserve rights/provenance cases:
- La Boétie's quoted Harry Kurz English translation remains `RESEARCHED_RESTRICTED`.
- Bastiat's exact modern English rendering remains `RESEARCHED_RESTRICTED`.
- Claude Bernard remains `SECONDARY_ONLY` + `RESEARCHED_QUOTE_LIMIT_ONLY` until the cited English edition/translator-term status is directly resolved.

Reserve validation: **14/14 PASS**:
- 25 candidates;
- unique IDs;
- every record `UNMAPPED_BY_DESIGN`;
- no premature deck/Card/island/Billboard/biome mapping fields;
- exactly one FrizzleQuestion each;
- provenance URLs present;
- Brain Food present;
- semantic themes/axes present;
- billboard-reasonable quote lengths;
- provenance and rights counts reconciled.

## Combined research inventory

- Mapped Batch 01: **30**
- Unmapped Research Reserve 01: **25**
- Combined researched candidates: **55**
- No runtime/public approval is implied by the combined count.

## Files

Added:
- `skills/chat/workflows/KFB_BILLBOARD_QUOTE_HYPERNORMALISATION_2026-10-04/QUOTE_POOL_BATCH_01.json`
- `skills/chat/workflows/KFB_BILLBOARD_QUOTE_HYPERNORMALISATION_2026-10-04/QUOTE_RESEARCH_RESERVE_01.json`

Updated:
- `skills/chat/workflows/KFB_BILLBOARD_QUOTE_HYPERNORMALISATION_2026-10-04/CHANGELOG.md`
- `skills/chat/workflows/KFB_BILLBOARD_QUOTE_HYPERNORMALISATION_2026-10-04/RETURN.md`

## Scope protection

Not changed:
- H13;
- Billboard runtime/context;
- Audio;
- 3D;
- Stage/runtime implementation;
- Cloudflare/Live surfaces;
- main router or KFB Hub runtime.

Runtime/browser/audio/3D tests: **NOT RUN BY SCOPE**.
Screenshots/browser proof: **NOT APPLICABLE TO THIS RESEARCH/DATA SLICE**.

No merge. No Live promotion.

## One next gate

**Georg Curator Review Batch 01.**

The 25-item Research Reserve stays available for a later dedicated mapping pass to decks / islands-biomes / Billboards after the editorial review.
