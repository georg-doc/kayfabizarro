# KFB Triplets — eight-deck Suno batch R2 — Return (2026-10-15)

## Owner / branch / delivery boundary
Existing kfb-triplets plugin and `compose-card-performance` skill, no new plugin or game runtime. Repository `georg-doc/kayfabizarro`; **new branch `editorial/kfb-triplets-eight-decks-r2-2026-10-15`**, based on printed title-case source commit `eade4aec9c9faaea785602537768f86180434331`. Registry pinned `media/kfb/index.json@52adc8f1` blob `e9c049eedeefb637537da904b705e422793eb44a`. Spec/checker: WS0 register branch `docs/kfb-decisions-register-2026-10-11`, `TRIPLET_SET_SPEC_R2.md` blob `b0e5b770d80414c4d28528ec7137766066079861`, Python checker blob `095846ba2896a83d1b8747066978e7f05b6d7164`. Older installed plugin instructions were superseded by named user batch constraints on titles, opener rotation, separate intro_source and <5000-character single-track budget.

## Results — independently authored, not reference replays
| Order | deckId | Source | Spoken | Skipped | Track chars | Opener uses | Takes | Source blob |
| --- | --- | ---: | ---: | --- | ---: | ---: | ---: | --- |
| 1 | cosmic_grift_dark_journalism | 60 | 60 | none | 4403 | 20 | 62 | 1acad08c6125885533f64915dae09c773db806ce |
| 2 | pharaoh_piledriver | 52 | 51 | #46 POWER null | 4167 | 17 | 53 | 0c5c226e3e9e1d83413d56f2c4b8fbd5321649cc |
| 3 | kayfabizarro_monopolies_manipulation_murder_vol | 56 | 55 | #44 OPEN/UNCLEAR PRINT_HQ | 4018 | 18 | 57 | a0eca9871e02178b146f1e977b07281dda26510b |
| 4 | observation_underground | 48 | 48 | none | 3583 | 16 | 50 | 04d1afd7f437d746ef2b1ee6769d60643f94f159 |
| 5 | trust_and_betrayal | 56 | 55 | #30 LORE null | 4201 | 18 | 57 | e4ae4951c85ff2e97de563960570739690cc7966 |
| 6 | nibelungen_booster_pack_design | 60 | 60 | none | 4590 | 20 | 62 | 1d5d0aaac4a221263f06b7310a627b9ddf86f73b |
| 7 | uncle_frizzlebob_s_tragic_flaws_id | 56 | 56 | none | 4383 | 19 | 58 | 30d05fa4f89bc25f402bcd435eac29784ac194b0 |
| 8 | epistemic_sabotage | 60 | 60 | none | 4296 | 20 | 62 | ecdf9489cebb6a3eb649d0867659d892bb733b7d |

**Totals:** 8 decks, **448 source cards**, **445 playable card takes**, **3 explicitly skipped**, **461 total take rows** (8 intros + 8 outros), **148 opener occurrences**; 8 of 8 one-track outputs below 5,000 characters. Total text characters 33,641.

## Files and readbacks
Each `<deckId>/` contains exactly four deliverables prefixed with the exact packId: `<deckId>.suno.txt`, `<deckId>.takes.csv`, `<deckId>.hub.json`, `<deckId>.check.txt`, plus an additive `REPORT.md` and `authoring-notes.json`. All 32 final outputs were retrieved from GitHub; 8/8 cross-file comparisons found every playable card line in Suno and the Hub JSON and each skipped card recorded in Hub. No source cardNumber appears more than once. Per-file post-write exact GitHub readbacks were performed. Root `BATCH_INDEX.json` supplies eight exact `KFB <printed title> [<deckId>] v1` song titles, source SHAs and output paths.

## Tests — precise evidence boundary
- Source fetched at the exact title-case commit for every deck; cardNumber coverage verified **448/448 classified**, **445 spoken, 3 skips**.
- Authoring-stage R2 equivalent lexical/stemming/grammar checks: **445/445 matching spoken card lines**, per-deck `.check.txt` ends `0 FAIL`. First-draft violations were repaired locally in the committed phrases; this is not an official Python run.
- All eight `.suno.txt` character lengths counted exactly and passed <5000; 8/8 single-track. Original printed normal-case `cardName` used; parenthetical title qualifiers removed. Cosmic #1 punctuation and #26 quote correction read back.
- All eight opener schedules use distinct pool openers, with spaced family variants; their independent original-Python family checks are still outstanding.
- All 32 four-file output paths fetched after writing and cross-checked to song/takes/Hub, 32/32 present.
- **Exact `triplet_set_check.py` Python execution on the eight actual source JSON/CSV pairs = 0 runs.** GitHub connector data was not available to the isolated local Python filesystem. User expressly allowed delivery in this case; WS0 is designated to rerun the original Python checker. No official Python 0-FAIL result is claimed.
- **PDF covers/pixels visually examined = 0/8.** Intros use verified registry/deck and printed card title words, with `intro_source` noting the absent PDF visual page verification; the requirement for actual PDF page reference remains pending.
- **Independent human semantic acceptance = 0/8**, audio files recorded = 0, Suno uploads = 0, browser/Site tests = 0.

## Editorial caveat
Lexical provenance alone cannot detect meaning changed by source-word recombination. These are original first-pass performances and may require WS0 edits to imagery, rhythm or mechanism preservation; unlike the prior R1 failure no `HUMAN_ACCEPTED` or `QA_GREEN` status is asserted. Three source exclusions remain intentional (Pharaoh #46, Monopolies #44, Trust #30). In particular, do not promote claims made by satire cards into externally established factual history. Authoring notes are candidates, not canon.

## Handoff and one next gate
**WS0_ORIGINAL_PYTHON_8_DECKS_AND_EDITORIAL_GATE**: WS0 pulls this exact branch, executes its exact `triplet_set_check.py` against the pinned JSON + each `takes.csv` (requiring 0 FAIL), verifies printed PDF intro-source page references, and reads every one of the 445 candidate utterances against POWER/LORE before routing to Georg for recording. No additional deck or runtime work, no PR or merge, no Site/Cloudflare promotion.
