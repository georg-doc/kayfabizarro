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

## 2026-10-06 · Quote Research Reserve 05 · tonal rotation clusters

- Continued Georg's active long-session quote-pool expansion.
- Added `QUOTE_RESEARCH_RESERVE_05.json` with **30 further quote + FrizzleQuestion candidates**.
- Structured the batch into five balanced research clusters:
  - humor/satire: 6
  - nature/ecology: 6
  - technology/infrastructure: 6
  - relationships: 6
  - historical oddities: 6
- Reserve 05 remains `UNMAPPED_BY_DESIGN`; no deck, Card, island/biome or Billboard mapping was invented.
- Provenance: **29 VERIFIED**, **1 SECONDARY_ONLY**, **0 UNVERIFIED**.
- Rights: **29 PUBLIC_DOMAIN_CONFIRMED**, **1 DRAFT_RIGHTS_UNKNOWN**.
- The open rights case is Alexander Graham Bell's 1876 notebook line: wording is primary-source verified at the Library of Congress, but the pre-1978 manuscript/publication-term status was not resolved and is not assumed public-runtime-safe.
- The one `SECONDARY_ONLY` source-chain case is La Rochefoucauld's English rendering; the underlying text/old English rendering is public domain, but the exact direct Maxims edition remains to be pinned.
- Validation: **20/20 PASS**, including five balanced clusters and zero ID/text collisions against the prior 145-candidate inventory.
- Combined researched inventory is now **175 candidates**: 30 mapped Batch-01 candidates + 145 deliberately unmapped reserve candidates.
- No H13, Billboard runtime, Audio, 3D, curator Site runtime/UI, Stage, router, Hub-runtime, merge or Live changes.

## 2026-10-06 · Quote Research Reserve 06 · myth / law / psychology / performance / science oddities

- Continued Georg's active long-session quote-pool expansion.
- Added `QUOTE_RESEARCH_RESERVE_06.json` with **30 further quote + FrizzleQuestion candidates**.
- Structured the batch into five balanced research clusters:
  - myth/religion: 6
  - law/crime: 6
  - psychology: 6
  - music/performance: 6
  - science/history oddities: 6
- Reserve 06 remains `UNMAPPED_BY_DESIGN`; no deck, Card, island/biome or Billboard mapping was invented.
- Provenance: **28 VERIFIED**, **2 SECONDARY_ONLY**, **0 UNVERIFIED**.
- Rights: **29 PUBLIC_DOMAIN_CONFIRMED**, **1 DRAFT_RIGHTS_UNKNOWN**.
- The open rights case is Wilbur Wright's 1900 letter to Octave Chanute: exact wording is primary-source verified via the Library of Congress, but the historical manuscript/publication-term status was not resolved and is not assumed public-runtime-safe.
- The two `SECONDARY_ONLY` source-chain cases are Diderot's `Paradox of Acting` English formulation and Talma's acting maxim; both are supported by old public-domain English sources but await direct original/edition-level pinning.
- Validation: **20/20 PASS**, including five balanced clusters and zero ID/text collisions against the prior 175-candidate inventory.
- Combined researched inventory is now **205 candidates**: 30 mapped Batch-01 candidates + 175 deliberately unmapped reserve candidates.
- No H13, Billboard runtime, Audio, 3D, curator Site runtime/UI, Stage, router, Hub-runtime, merge or Live changes.

## 2026-10-06 · Quote Research Reserve 07 · architecture / education / conflict / material culture / language

- Continued Georg's active long-session quote-pool expansion.
- Added `QUOTE_RESEARCH_RESERVE_07.json` with **30 further quote + FrizzleQuestion candidates**.
- Structured the batch into five balanced research clusters:
  - architecture/urbanism: 6
  - education/learning: 6
  - war/conflict: 6
  - food/material culture: 6
  - language/translation: 6
- Reserve 07 remains `UNMAPPED_BY_DESIGN`; no deck, Card, island/biome or Billboard mapping was invented.
- Provenance: **27 VERIFIED**, **3 SECONDARY_ONLY**, **0 UNVERIFIED**.
- Rights: **26 PUBLIC_DOMAIN_CONFIRMED**, **2 RESEARCHED_QUOTE_LIMIT_ONLY**, **1 RESEARCHED_RESTRICTED**, **1 DRAFT_RIGHTS_UNKNOWN**.
- Rights-sensitive cases remain explicit: Alberti's modern English translation is research-restricted; Wittgenstein's Ogden translation is US-public-domain but still EU-term-sensitive in 2026; Orwell is EU-public-domain but US-protected; Goethe's exact English rendering remains rights-unknown pending a historical translation edition.
- `SECONDARY_ONLY` source-chain cases: Alberti's exact modern English wording, Emerson's education maxim, and Goethe's exact English rendering.
- Validation: **20/20 PASS**, including five balanced clusters and zero ID/text collisions against the prior 205-candidate inventory.
- Combined researched inventory is now **235 candidates**: 30 mapped Batch-01 candidates + 205 deliberately unmapped reserve candidates.
- No H13, Billboard runtime, Audio, 3D, curator Site runtime/UI, Stage, router, Hub-runtime, merge or Live changes.

## 2026-10-06 · Quote Research Reserve 08 · mathematics / administration / media / play / exploration

- Continued Georg's active long-session quote-pool expansion.
- Added `QUOTE_RESEARCH_RESERVE_08.json` with **30 further quote + FrizzleQuestion candidates**.
- Structured the batch into five balanced research clusters:
  - mathematics/chance: 6
  - bureaucracy/administration: 6
  - media/propaganda: 6
  - childhood/play: 6
  - exploration/discovery: 6
- Reserve 08 remains `UNMAPPED_BY_DESIGN`; no deck, Card, island/biome or Billboard mapping was invented.
- Provenance: **26 VERIFIED**, **4 SECONDARY_ONLY**, **0 UNVERIFIED**.
- Rights: **25 PUBLIC_DOMAIN_CONFIRMED**, **3 RESEARCHED_QUOTE_LIMIT_ONLY**, **2 RESEARCHED_RESTRICTED**.
- `SECONDARY_ONLY` source-chain cases are Galton's “Whenever you can, count”, Fröbel's play/development formulation, Huizinga's “Play is older than culture”, and Livingstone's “provided it be forward”; each retains its unresolved direct-edition/original-document note.
- Rights-sensitive cases remain explicit: Russell, Lippmann and Bernays are jurisdiction-limited; Huizinga and Montessori remain research-restricted.
- Validation: **20/20 PASS**, including five balanced clusters and zero ID/text collisions against the prior 235-candidate inventory.
- Combined researched inventory is now **265 candidates**: 30 mapped Batch-01 candidates + 235 deliberately unmapped reserve candidates.
- No H13, Billboard runtime, Audio, 3D, curator Site runtime/UI, Stage, router, Hub-runtime, merge or Live changes.

## 2026-10-06 · Quote Research Reserve 09 · body / mortality / class / craft / failure

- Continued Georg's active long-session quote-pool expansion.
- Added `QUOTE_RESEARCH_RESERVE_09.json` with **30 further quote + FrizzleQuestion candidates**.
- Structured the batch into five balanced research clusters:
  - body/senses: 6
  - death/mortality: 6
  - inequality/class: 6
  - invention/craft: 6
  - failure/error: 6
- Reserve 09 remains `UNMAPPED_BY_DESIGN`; no deck, Card, island/biome or Billboard mapping was invented.
- Provenance: **30 VERIFIED**, **0 SECONDARY_ONLY**, **0 UNVERIFIED**.
- Rights: **29 PUBLIC_DOMAIN_CONFIRMED**, **1 RESEARCHED_QUOTE_LIMIT_ONLY**.
- The rights-sensitive case is Rousseau's 1913 G. D. H. Cole English translation: Rousseau's underlying text is public domain and the edition is US-public-domain, while Cole's translator term remains EU-sensitive through 2029.
- The pre-persistence collision guard rejected three tempting repeats already present in earlier reserves (Morris, Wilde and Huxley); their replacements were rechecked against all prior 265 records before commit.
- Validation: **24/24 PASS**, including five balanced clusters, zero ID/text collisions against the prior 265-candidate inventory, 30 distinct authors/author pairs, mapping guards, source/Brain Food HTTPS checks and quote/question length bounds.
- Combined researched inventory is now **295 candidates**: 30 mapped Batch-01 candidates + 265 deliberately unmapped reserve candidates.
- No H13, Billboard runtime, Audio, 3D, curator Site runtime/UI, Stage, router, Hub-runtime, merge or Live changes.
