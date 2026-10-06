# CHANGELOG · KFB Billboard Quote Hypernormalisation

## 2026-10-04 · Concept captured

- Added deterministic loop: Card/deck seed + biome/world seed → curated quote → timed Hypernormalisation read-along → attribution → FrizzleQuestion → optional Brain Food.
- FrizzleQuestion is a mandatory terminal beat, exactly one question per quote.
- Added claymation TV/full-screen control requirement: same sequence and clock continue across in-world ↔ full-screen transition.
- Added mute and future Lean Memory / Fractal Almanac seam without creating a memory owner.

## 2026-10-04 · Current owners reconciled

- H13 is the current Hypernormalisation reference; H4 remains historical design ancestry.
- Existing Billboard Context chain #321/#324/#326 supplies contextual media routing, Card/Biome WorldContext binding and physical clay/world-look adaptation.
- Existing 12 × 6 m World Billboard Clay / CanvasTexture / BillboardScheduler remains physical runtime donor.
- Existing Card registry/Builder/Ink/format remain Card owners.
- Existing KFB Audio baseline remains audio/mix owner; no second AudioContext/mixer.

## 2026-10-04 · Curator/Admin Site planned

- Working title: KFB Hypernormalisation Curator.
- Required areas: Decks, Quotes, Mappings, Audio, 3D Stage, Validation.
- Added clean neutral 3D test stage with selectable verified clay Billboard, Card seed, biome/world seed, existing palette owner, quote cycle and audio recipe.
- No palette/debug overlay may cover the actual preview; diagnostics live in a collapsible panel.

## 2026-10-04 · Audio visualizer interface planned

- Added `kfb.audio-visualizer-handoff.v1` read-only analysis contract.
- H13 consumes BPM/master time/beat/bar phase plus kick/bass/mid/high/RMS/transient from the existing audio host.
- Voice focus uses existing ducking; music/soundbed timeline does not pause.
- Full-screen entry/exit must preserve audio and quote timing.

## 2026-10-04 · 130-deck curation scaffold

- Verified `media/kfb/index.json` contains 130 canonical deck records.
- Generated `DECK_QUOTE_PROFILE_SEED.json` with exactly 130 matching packIds/titles.
- Added `QUOTE_POOL_SCHEMA.json` for provenance, rights, deck/Card mapping, FrizzleQuestion, Brain Food, timing and audio recipe references.
- Planning/data checks: 8/8 PASS.

## 2026-10-04 · Execution policy

- This is a queued planning lane only; active MVP1 recovery remains unaffected.
- First productive implementation is one continuous Work One-Shot using `WORK_ONE_SHOT_BRIEF.md`.
- Planned formal Stage route: `https://kayfabizarro.pages.dev/kfb-hub/stage/billboard-hypernorm-curator/`.
- No merge, Stage deployment or Live promotion performed.

## 2026-10-04 · Quote Pool Batch 01

- Curated the first 10 canonical decks from `media/kfb/index.json` in normal Web Chat as a research/data slice.
- Added `QUOTE_POOL_BATCH_01.json` as an additive schema-aligned shard: 30 researched quote candidates, exactly 3 per deck, with deck profiles, provenance, rights state, theme/biome tags, one FrizzleQuestion per quote and Brain Food references.
- Provenance status: 27 primary/edition-verified or double-checked; 3 `SECONDARY_ONLY`; 0 `UNVERIFIED`.
- Rights status: 21 `PUBLIC_DOMAIN_CONFIRMED`; 6 `RESEARCHED_RESTRICTED`; 2 `RESEARCHED_QUOTE_LIMIT_ONLY`; 1 `DRAFT_RIGHTS_UNKNOWN`.
- Conservative open-source cases retained instead of promoted: Wittgenstein English translation, Woolf edition-level locator, Vertov English translation, Debord English-translation rights, plus territorial limits for Lippmann and Mencken.
- No runtime, H13, Billboard, Audio, 3D, Stage, merge or Live changes.

## 2026-10-04 · Quote Research Reserve 01

- Added `QUOTE_RESEARCH_RESERVE_01.json` with **25 additional quality-first quote + FrizzleQuestion candidates** for later cross-context curation.
- This reserve is intentionally `UNMAPPED_BY_DESIGN`: no deck, Card, island/biome or Billboard refs are assigned yet. Later curation may map one candidate many-to-many across those contexts.
- Provenance: **24 VERIFIED**, **1 SECONDARY_ONLY**, **0 UNVERIFIED**.
- Rights: **22 PUBLIC_DOMAIN_CONFIRMED**, **2 RESEARCHED_RESTRICTED**, **1 RESEARCHED_QUOTE_LIMIT_ONLY**.
- Reserve validation: **14/14 PASS** including unique IDs, unmapped-only policy, absence of premature mapping fields, exactly one FrizzleQuestion per candidate, HTTPS provenance and reconciled rights/provenance counts.
- The reserve intentionally does not pretend to satisfy `QUOTE_POOL_SCHEMA.json`, because that runtime/pool schema requires a deck mapping. Candidates enter the mapped quote pool only after a later curator decision.
- No H13, Billboard, Audio, 3D, Stage/runtime, main-router, Hub-runtime, merge or Live changes.

## 2026-10-05 · Quote Research Reserve 02 · rotation depth

- Georg explicitly asked to continue filling the pool so an island does not fall back to the same few quotations after longer play. This is a **PROCEED PASS for research expansion**, not approval of individual quotes for public runtime.
- Added `QUOTE_RESEARCH_RESERVE_02.json` with **30 further quote + FrizzleQuestion candidates**.
- Reserve 02 remains `UNMAPPED_BY_DESIGN`: no deck, Card, island/biome or Billboard mapping is invented during research.
- Added research-only `rotationIntent`: later selection should diversify theme, author, era and tone, filter by rights eligibility, and suppress recent repeats. No runtime selector was changed.
- Provenance: **30 VERIFIED**, **0 SECONDARY_ONLY**, **0 UNVERIFIED**.
- Rights: **29 PUBLIC_DOMAIN_CONFIRMED**, **1 DRAFT_RIGHTS_UNKNOWN**. The open case is the anonymous/unresolved English translator term for Le Bon's 1896 `The Crowd` edition in EU context; the candidate remains out of public rotation until cleared.
- Validation: **16/16 PASS**, including no ID/text collision with the prior 55-candidate inventory.
- Combined researched inventory is now **85 candidates**: 30 mapped Batch-01 candidates + 55 deliberately unmapped reserve candidates.
- This increases future rotation depth but does **not** claim that any specific island already has an approved 85-item pool; island/deck/Billboard mapping remains a later curator step.
- No H13, Billboard runtime, Audio, 3D, Stage, main-router, Hub-runtime, merge or Live changes.

## 2026-10-06 · Quote Research Reserve 03 · author/era diversity

- Continued Georg's active quote-pool expansion for long island/Billboard sessions.
- Added `QUOTE_RESEARCH_RESERVE_03.json` with **30 further quote + FrizzleQuestion candidates**.
- Deliberately used **30 distinct authors** in this batch to reduce future author repetition as well as quote repetition.
- Reserve 03 remains `UNMAPPED_BY_DESIGN`; no deck, Card, island/biome or Billboard placement is invented during research.
- Provenance: **21 VERIFIED**, **9 SECONDARY_ONLY**, **0 UNVERIFIED**.
- Rights: **18 PUBLIC_DOMAIN_CONFIRMED**, **5 RESEARCHED_RESTRICTED**, **3 RESEARCHED_QUOTE_LIMIT_ONLY**, **4 DRAFT_RIGHTS_UNKNOWN**.
- Rights/provenance uncertainty is kept explicit for Peirce publication status, Pasteur/Poincaré translation status, Ida B. Wells exact original locator, active-copyright modern authors, and jurisdiction-sensitive Huxley/Du Bois/Korzybski records.
- Validation: **18/18 PASS**, including zero ID/text collisions against the prior 85-item inventory, 30 unique authors, quote/question length bounds and no premature mapping fields.
- Combined researched inventory is now **115 candidates**: 30 mapped Batch-01 candidates + 85 deliberately unmapped reserve candidates.
- No H13, Billboard runtime, Audio, 3D, curator Site runtime/UI, Stage, router, Hub-runtime, merge or Live changes.

## 2026-10-06 · Quote Research Reserve 04 · medicine / art / economics / everyday behaviour

- Continued Georg's active long-session quote-pool expansion.
- Added `QUOTE_RESEARCH_RESERVE_04.json` with **30 further quote + FrizzleQuestion candidates**.
- Deliberately broadened the pool into medicine/biology, care systems, observation, habit, identity, art/literature, design, economics, delayed consequences, interdependence and ordinary human behaviour.
- Reserve 04 remains `UNMAPPED_BY_DESIGN`; no deck, Card, island/biome or Billboard mapping was invented.
- Provenance: **25 VERIFIED**, **5 SECONDARY_ONLY**, **0 UNVERIFIED**.
- Rights: **30 PUBLIC_DOMAIN_CONFIRMED**.
- Validation: **18/18 PASS**, including zero ID/text collisions against the prior 115-candidate inventory.
- Combined researched inventory is now **145 candidates**: 30 mapped Batch-01 candidates + 115 deliberately unmapped reserve candidates.
- Reserve 04 intentionally increases tonal range as well as quantity so future island rotation can avoid topic/mood repetition, not merely exact-quote repetition.
- No H13, Billboard runtime, Audio, 3D, curator Site runtime/UI, Stage, router, Hub-runtime, merge or Live changes.

