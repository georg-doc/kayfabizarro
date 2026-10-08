# TEST REPORT · KFB ChatterBox Voice Layer v1 · 2026-10-08

Status: **EVIDENCE MILESTONE · SOURCE AUDIT + REAL-POOL ADAPTER GREEN**
Branch-under-test parent: `4d341158b7723732b65e20c94777ac63dcc485d9`

## Scope

This report covers source-package integrity and compatibility evidence only.

It does not claim:
- audio quality;
- human listening acceptance;
- browser playback rerun;
- real ChatterBox consumer integration;
- real Resident mapping;
- Site runtime publication.

## Exact donor

GitHub ZIP blob:
`6b3593a2bc3b33120fdb466c9b4267077dd1fc4b`

Production Control import:
- bytes: 1,953,144
- SHA-256: `f51bc757fb612af942e79cd217ca1faacc32780ffeb532e740cf2759636883c6`

## Structural audit · 18/18 PASS

| # | Assertion | Result |
|---|---|---|
| 1 | ZIP entries = 141 | PASS |
| 2 | MP3 files = 119 | PASS |
| 3 | fragment MP3s = 71 | PASS |
| 4 | line MP3s = 48 | PASS |
| 5 | manifest fragments = 71 | PASS |
| 6 | manifest lines = 24 | PASS |
| 7 | every manifest fragment path exists | PASS |
| 8 | every Whole/Assembled path exists | PASS |
| 9 | archetype voice presets = 11 | PASS |
| 10 | package emotions = 15 | PASS |
| 11 | package emotion IDs exactly equal current Resident Affect IDs | PASS |
| 12 | runtime exposes fragments/whole/live/browser routes | PASS |
| 13 | runtime exposes onBeat/onSpeaking callbacks | PASS |
| 14 | runtime creates no AudioContext | PASS |
| 15 | runtime performs no fetch | PASS |
| 16 | donor test source declares 10 cases | PASS |
| 17 | example Triplets explicitly mark themselves non-canon | PASS |
| 18 | selected casting excludes donor-listed non-commercial/unclear voice candidates | PASS |

## Current emotion equality

Both current Resident Affect and donor casting use exactly:

`calm, curious, attentive, joyful, amused, grateful, proud, surprised, worried, sad, annoyed, angry, embarrassed, suspicious, tired`

No translation layer is needed for emotion IDs in the first adapter.

## Donor test source · 10 declared cases

1. exact Triplet → fragments
2. normalization tolerates case/space/punctuation
3. missing emotion fallback behavior
4. joyful → amused fallback hits fragments
5. 3-segment template → fragments
6. 2-segment template → fragments + one gap
7. unknown fragments + known lineId → Whole
8. free LLM text + live provider → live
9. free LLM text without live provider → browser
10. every manifest fragment file exists

Donor START_HERE reports `node tools/test_runtime.cjs → 10/10` and a headless Chromium bench. Those runs were not rerun by this Web Chat.

## Compatibility evidence

### ChatterBox semantics
Current source contract already defines TTS as output:
semantic source → Resident/faction filter → ChatterBox speaker/timing/presentation → Bubble/Emote/TTS.

Verdict: **compatible if kept output-only**.

### Resident Affect
15/15 exact ID equality.

Verdict: **compatible**.

### KFB Audio
Donor resolver has no AudioContext and can emit onSpeaking.

Verdict: **compatible with PR #365 ownership if onSpeaking is routed to existing ducking/speech-focus authority**.

### Canonical phrase pool
Current `chatter-phrases.js` uses faction phrase families and {X} templates; donor fixtures use direct segmented Triplet arrays.

Verdict: **ADAPTER REQUIRED**.

### Resident voice mapping
Current semantic profile includes `chatterProfileRef`; no current runtime proof of `residentId → chatterProfileRef → voicePreset`.

Verdict: **MAPPING REQUIRED**.

## Quality evidence not available

- no human listening in this chat;
- no comparison of Assembled vs Whole by ear;
- no proof that each of the 11 presets fits a KFB Resident;
- no public/browser decode check against this imported ZIP;
- no lipsync/viseme proof.

These remain explicitly UNKNOWN, not FAIL.

## Production Guard conclusion

**CONTINUE to S1 only.**

Smallest missing seam:
`canonical KFB phrase/Triplet source IDs → voice fragment/line manifest`.

Do not spend credits or regenerate the full pool before that seam exists.

## Next gate

`KFB_CHATTERBOX_VOICE_REAL_POOL_ADAPTER_R1`


## S1 · Real canonical pool adapter · 13/13 PASS

Exact source under test:
- `overworld/overworld/chatter-phrases.js`
- blob `72f0bd5333cdadc2b1dcdbb1d8b782ead1e70ac4`
- version `phrases-v1`

Exact adapter under test:
- `runtime/real-pool-adapter.js`
- blob `011f3a96975bd66ed2aaca219577e6108b893f42`

Current source census:
- 8 factions;
- 128 faction phrase records;
- 23 synthesis records;
- 15 activity-thought records;
- **166 unique source records**.

Assertions:
1. version = phrases-v1;
2. current faction count = 8;
3. current record count = 166;
4. all source IDs unique;
5. exact `kingCourt.ueber[0]` template recovered;
6. `{X}` binding produces exact expected visible text;
7. `philo` defaults to silent thought;
8. synthesis source resolves;
9. activity thought defaults silent;
10. VoiceRequest preserves stable source ID/provenance;
11. semantic Triplet adapter produces subject/connector/reframe roles;
12. `AUTHORING_CANDIDATE` status is preserved and never auto-promoted;
13. emotion change changes the audio asset key without changing dialogue identity.

Result:
**13/13 PASS**.

### Still UNKNOWN
- audio quality;
- Whole vs Assembled listening preference;
- final Resident-to-voice casting;
- actual KFB Audio ducking in an integrated surface;
- browser playback of newly rendered canonical lines;
- next-MVP World integration.

These are not treated as failures.

## MVP planning evidence

`NEXT_MVP_VOICE_ACCEPTANCE_ADDENDUM.md` and `data/NEXT_MVP_VOICE_PROOF_R1.json` now freeze the Voice proof for the first runtime MVP after the current Four-Island A/B visual gate.

The current visual-only Story Vision R1 remains unchanged and receives no runtime work.
