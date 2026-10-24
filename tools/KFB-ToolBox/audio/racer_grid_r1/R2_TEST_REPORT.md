# R2 · TEST_REPORT · 2026-10-17

**Current-turn source-audit checks · not audio listening tests.**

## Actual evidence gathered
- GitHub `main@904f0e95968999c7e8af77cc6667161bd4f3f788`: 27/27 chosen primary candidate donor paths confirmed as real blobs via their owning leaf directories; 26 distinct paths.
- Duplicate audit by full Git blob SHA: `Classic Arcade SFX` vs `Classic Arcade SFX Complete`: explosion shared filenames **11/11 byte-identical**, SciFi shared filenames **9/9 byte-identical** (20 checked pairs, no differences).
- GitHub R2 JSON readback static assertions: **18/18 PASS**, including 27 distinct slots, family counts 5/4/10/8, 20 audition-first, 7 conditional gaps, 26 unique primary paths, fixed-rate budget pilot=1,160/all-gaps=3,080/total optional envelope=4,840, freeze/no paid authorization and SSOT pinned.
- Official ElevenLabs docs checked: v2 required for seamless `loop`; duration 0.5–30 s; `prompt_influence` 0–1; fixed duration price 40 credits/second.

## Not tested
- Audio playback/listening/decoded waveform: **0 files**. Loop seam / pitch stationarity / mix headroom: **0**. Current production Audio Site visually opened: **NO** (GitHub source inspected; 2026-10-04 deployment/browser proof is historical).
- Paid ElevenLabs calls: **0**. New audio files: **0**. No GitHub CI added for this document-only audit, no code or product runtime changed.
- License full-text adoption for S050C and third-party kits: **NOT_VERIFIED**; do not assert global CC0.
- The source matrix is a donor shortlist, not an exhaustive audit of every audio file in the repo.

## Exact historical evidence reused (not rerun)
- `AUDIO-CAL-01`: **31/31** old public Chromium/WebAudio PASS and Georg `HUMAN_ACCEPTED`; its baseline source and tested 2026-09-24 tree had 1,732 audio files.
- Audio Site PR #350 `tools/KFB-Audio-Site/`, historical Site verified 2026-10-04; `soundscape-source.json` has stale gap flags pending current-source reconciling.
- R1 source/test milestone PR #413 had **10/10 offline Python tests PASS**, does not authorize paid 48-file generation.

## Next proof
WS0 must play **each candidate donor source in isolation**, record listening KEEP/REJECT/ADAPT, then compare the intended 4-slot R2 pilot in the accepted calibrated mix; only then submit one signed off paid batch.
