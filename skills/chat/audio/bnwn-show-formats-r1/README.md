# Brave New World News · Studio/Game Shows R1

Date: 2026-11-06 · **AUTHORING CANDIDATE, NOT PRODUCED**.
Owner: KFB Audio / BNWN radio content, no replacement for existing KFB Audio/ChatterBox/game runtime.

## Files
- `BNWN_Show_Formats_R1_108_TTS_MASTER.txt`: 108 independent English dialogue clips; 107 outer breaks, five short dramatic breaks.
- `BNWN_Show_Formats_R1_108_CUE_MAP.json`: stable IDs, show/slot and proposed event tags; unrecorded duration estimates.
- `BNWN_Show_Formats_R1_108_REVIEW_INDEX.csv`: one row per clip for selection and editing.
- `shows/*.txt`: twelve separate eight-clip show scripts and one 12-clip studio bridges collection.
- `FORMAT_BIBLE.md`: editorial intention, show mechanics and nonbinding event/scheduler suggestions.
- `TEST_REPORT.md`: local static and GitHub-readback results.
- `RETURN.md` and `CHANGELOG.md`: after final checkpoint.

Voice reference: the existing **female** Brave New World News R3 announcer, source upload `Brave New World News 02 (R3, aus Georgs BNWN-Kanon).srt`. R2 sponsor-stinger donor is [PR #472](https://github.com/georg-doc/kayfabizarro/pull/472); this new production slice has its own docs-only branch and does not silently depend on merging R2.

Do not narrate file names or IDs. Text is intentionally free of emotion tags, with precise authored `<break time="1.6s" />` clip gaps and `<break time="0.45s" />` internal beats. Actual voice engine support and timing must be checked.

**Not implemented:** audio/video files, multi-host or dynamic NPC voice, event dispatch, TTS, game playback, Site/Stage or Live deployment.
**Next gate:** one BNWN female voice master audition, waveform/acting review, then cut clips and optionally author video.
