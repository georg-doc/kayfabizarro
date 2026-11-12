# TEST REPORT · BNWN Sponsor Stingers R2 · 2026-11-06

## Tests actually executed (local Python 3 authoring pack)
- 12 topical lanes × 12 original lines: **144/144 PASS**.
- Existing R1 sponsor lines retained verbatim: **6/6 PASS**.
- Unique normalized text and unique IDs: **150/150 PASS**.
- Exact TTS text reconstructed by splitting at 149 `<break time="1.6s" />` delimiters: **150/150 PASS**.
- No emotion tags: **PASS**.
- Review CSV/JSON written and local pack ZIP CRC checked (7/7 entries): **PASS**.
- Words per cue: minimum **3**, median **10**, maximum **15**; estimates are not audio measurements.
- TTS master's Git blob SHA locally computed and GitHub independently reread: `e7c59d8fd580d8a4f8bc70a9b6549b74d8ef183a` — **MATCH**.
- Existing KFB Audio runtime source, World, and ChatterBox files untouched.

## Not run
TTS synthesis, SSML implementation fidelity, measured silence, actual cut points, recorded audio, Hedra/avatar rendering, caption sync, human editorial/listening acceptance, event triggering, save/reload shuffle, mixer ducking, public browser verification.

## Single next gate
Generate one BNWN voice master and audibly/waveform-verify cuts + speaker acting before generating individual avatar videos.
