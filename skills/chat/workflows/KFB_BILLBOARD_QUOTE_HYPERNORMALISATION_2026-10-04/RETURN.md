# RETURN · KFB Billboard Quote Hypernormalisation

Date: 2026-10-04
Status: QUOTE POOL BATCH 01 RESEARCH COMPLETE · GEORG CURATOR REVIEW PENDING
Owner: KFB Quote Curator · normal Web Chat
Slice: research/data only · no Work/WSA runtime work
Repo: georg-doc/kayfabizarro
Branch: planning/billboard-quote-hypernorm-curator-2026-10-04
Draft PR: #354
Last verified branch head before this Return write: ceeb39141a6a217912759463763be789210d69d4

## Batch 01 · canonical decks

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

Total: **30 quote candidates**.

Each candidate contains exact quote text, author/work/year where available, source URL, locator/edition context, retrieval date, verification state, honest rights state, themes, biome tags, at least one deck mapping, Card mapping only where concrete, exactly one FrizzleQuestion, and Brain Food references.

## Provenance

- VERIFIED (`PRIMARY_OR_EDITION_VERIFIED` or `DOUBLE_CHECKED`): **27**
- `SECONDARY_ONLY`: **3**
- `UNVERIFIED`: **0**

The three deliberate `SECONDARY_ONLY` records are:
- Ludwig Wittgenstein, `Philosophical Investigations` §23 — exact English wording cross-checked in strong secondary sources; authorized/edition-level English text not retrieved.
- Virginia Woolf, `The Cinema` — exact wording verified in a reputable film-journal transcription; edition-level scan not retrieved.
- Dziga Vertov, `Kino-Eye` — exact English wording cross-checked through Cambridge/Taylor & Francis citations to the Michelson/O'Brien edition; cited English edition not directly retrieved.

## Rights

- `PUBLIC_DOMAIN_CONFIRMED`: **21**
- `RESEARCHED_RESTRICTED`: **6**
- `RESEARCHED_QUOTE_LIMIT_ONLY`: **2**
- `DRAFT_RIGHTS_UNKNOWN`: **1**

Rights-sensitive/open cases:
- Guy Debord, `The Society of the Spectacle`: archive wording is verified, but exact English-translation/publication rights are not established; remains `DRAFT_RIGHTS_UNKNOWN`.
- Walter Lippmann, `Public Opinion` (1922): public domain in the US; EU author term remains ongoing; `RESEARCHED_QUOTE_LIMIT_ONLY`.
- H. L. Mencken, `In Defense of Women` (1918): public domain in the US; EU author term remains active through 2026-12-31; `RESEARCHED_QUOTE_LIMIT_ONLY`.
- Turing, Wiener, Wittgenstein English translation, Barthes English translation, Vertov English translation and Simon remain research/restricted candidates rather than public-runtime approvals.

No quote is marked `APPROVED_PUBLIC` in this batch.

## Validation evidence

Repository-native data validation: **13/13 PASS**.

Checked:
- full `QUOTE_POOL_SCHEMA.json` structure recursively;
- exact first-10 registry packId/title identity;
- 10 batch deck profiles;
- 30 unique quote IDs;
- exactly 3 mapped candidates per deck;
- all deck refs resolve;
- all concrete Card refs resolve against the canonical Card JSONs;
- exactly one FrizzleQuestion per quote;
- provenance URLs present;
- non-public rights records are not promoted;
- verification and rights totals reconcile to 30.

Runtime/browser/audio/3D tests: **NOT RUN BY SCOPE**.
Screenshots/browser proof: **NOT APPLICABLE TO THIS RESEARCH/DATA SLICE**.

## Files

Added:
- `skills/chat/workflows/KFB_BILLBOARD_QUOTE_HYPERNORMALISATION_2026-10-04/QUOTE_POOL_BATCH_01.json`

Updated:
- `skills/chat/workflows/KFB_BILLBOARD_QUOTE_HYPERNORMALISATION_2026-10-04/CHANGELOG.md`
- `skills/chat/workflows/KFB_BILLBOARD_QUOTE_HYPERNORMALISATION_2026-10-04/RETURN.md`

## Scope protection

Not changed:
- H13
- Billboard runtime/context
- Audio
- 3D
- Stage/runtime implementation
- Cloudflare/Live surfaces
- main router or KFB Hub runtime

No merge. No Live promotion.

## One next gate

**Georg Curator Review Batch 01.**
