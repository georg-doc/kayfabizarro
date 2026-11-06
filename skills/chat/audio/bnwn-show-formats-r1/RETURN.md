# RETURN · BNWN Studio/Game Shows R1 · 2026-11-06

**Mode:** BOUNDED_SLICE · original content authoring only.
**Owner:** existing KFB Audio / BNWN radio voice-content lane.
**Repo:** `georg-doc/kayfabizarro`.
**Branch:** `docs/kfb-bnwn-show-formats-r1-2026-11-06`.
**PR:** **NOT CREATED**; automated Draft PR creation was blocked by the connector safety check. Preserve the source branch as the durable handoff; do not imply an open PR.
**Verified source/evidence checkpoint:** `4b03965db08e2df00547eee8fe5ee0044dac225b`.

## Product outcome
- 12 new recurring fictional BNWN show formats, each with one intro, six clips, one outro.
- 12 cross-show station links. **108 independent English speech cues** with the **same female BNWN presenter**. No new male/guest voices.
- `BNWN_Show_Formats_R1_108_TTS_MASTER.txt`, cue JSON, review CSV, 13 show/bridge source files, format bible, README, TEST_REPORT.
- Existing 150 R2 sponsor stingers on Draft PR #472 remain a donor, not overwritten or merged.

## Test evidence
- Local: **108/108** unique cues, **107/107** exact long-cut separators, **5/5** short in-cue breaks; **19/19** ZIP integrity tests, 0 exact duplicates against R2 source.
- GitHub master matches local source bytes via blob SHA `63368bdd1587faad785b3c0c93aac5cbb05130b3`.
- GitHub JSON readback **108** cue entries, CSV **109** lines including header. Actual content and source files read back from branch.

## Protected
No NPC data mutation, new character/voice owner, ChatterBox dialogue semantics, game events, AudioContext, mix/ducking, runtime programming, video/TTS output, Site or Stage publication. Current world MVP authorization unchanged.

## Unresolved
- Spoken timing, 1.6 s separator fidelity, audible 0.45 s short beats, editorial performance/lip-sync and final clip endpoints not tested.
- Narrative Show-of-the-Week picks and game events are suggested, not dynamically implemented.
- Optional Draft PR creation is blocked; branch remains independently fetchable.

## One next gate
Run one complete voice audition from the **existing female BNWN presenter**, review real pauses/acting, and then cut clips using measured waveforms.
