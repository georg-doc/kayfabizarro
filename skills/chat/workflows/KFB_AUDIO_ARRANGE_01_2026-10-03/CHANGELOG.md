# AUDIO-ARRANGE-01 · CHANGELOG

## 2026-10-03 · v0.3 design contract

- Started clean branch from current main rather than extending rejected AUDIO-SEED renderer.
- Direction narrowed to CAN-derived hypnotic repetition + Yello-derived sparse sound design + electro-funk pocket.
- Adopted Reddit guardrails: rhythm first, three sounds, three patterns, pentatonic melodic core, repetition, ±7/±2-class transposition, silence, production quality.
- Added fixed 64-bar / ~3-minute first form.
- WebAudioFont 3.0.04 verified as sample-based, GM-compatible, ~2000-instrument library with realtime/MIDI/mixer examples; GPL-3.0-or-later means internal research only until license/provenance review.
- WebAudioFonts/deploy-template verified MIT as a possible self-hosted SF2→JSON pipeline; font content licensing remains separate.
- Exact KFB donors pinned: Van Metronome stems; Rubbish Groove 100 BPM / phase 0.465; RoadTrip prompt vocabulary.
- No implementation or public Stage yet.


## 2026-10-03 · Donor bench stopped after two repair passes

- Built MASTER / STEM RECONSTRUCT / KFB ARRANGE branch-local bench.
- Original QA + two checkout repair passes all stopped at exact donor existence validation.
- Root cause subsequently proven as branch-base drift, not missing current-main assets:
  - branch base `74f7a690…`;
  - current main `eadebbb7…`;
  - main 3 commits ahead;
  - all 10 Cyclical/Loping donor files were added after branch creation.
- Browser/WebAudio never ran; no musical PASS/FAIL is inferred.
- Candidate preserved at `b553b2c0…`.
- Two-repair rule invoked.
- Next: fresh `AUDIO-ARRANGE-01-DONOR-REBASE` from current main.
