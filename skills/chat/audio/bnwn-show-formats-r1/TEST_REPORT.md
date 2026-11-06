# TEST REPORT · BNWN Studio & Game Shows R1 · 2026-11-06

**Scope:** static authoring/metadata checks; no audio-video or runtime acceptance.

## Actually tested locally
- 12 named shows × eight cues each = **96/96 PASS**.
- 12 reusable studio bridges = **12/12 PASS**.
- Unique cue IDs and verbatim cue texts = **108/108 PASS**.
- Master re-split at `<break time="1.6s" />`: **108/108 identical snippets PASS**.
- Separator count: **107/107 PASS**; internal `<break time="0.45s" />`: **5/5 PASS**.
- All text clip bodies free of performance/emotion tags and placeholder NPC identifiers: **108/108 PASS**.
- No exact normalized duplicate against BNWN Sponsor Stingers R2 150-cue local pool: **0 duplicates**.
- CSV row count including header: **109**. JSON cue count: **108**.
- Local authoring pack ZIP CRC: **19/19 entries PASS**.
- Total words in 108 clips: **2179**; only a planning measure, not recorded duration.

## Source-GitHub parity
GitHub master TTS blob SHA `63368bdd1587faad785b3c0c93aac5cbb05130b3` matches the local `git hash-object` of the master byte for byte. The 13 individual source scripts and master were reread from this branch. GitHub JSON + CSV were reread and matched their generated source in the write transaction.

## Not tested
Actual TTS/HeyGen or Hedra tag interpretation, voiced timing and breathing, clipped waveform, NPC selection, player events, real show scheduler, Audio ducking, Game integration, Site/public Stage, and Georg editorial approval.

## One next gate
Run one female BNWN voice-synthesis audition from the master; review presentation and true cut positions before batch-splitting all 108 assets.
