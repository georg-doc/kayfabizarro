# KFB ChatterBox Voice v1 · Source Audit · 2026-10-08

Status: **SOURCE PACKAGE ACCEPTED AS DONOR · STATIC/STRUCTURAL AUDIT GREEN**
Runtime promotion: **NO**

## Source identity

ZIP:
`tools/KFB-ToolBox/_inbox/KFB_CHATTERBOX_VOICE_V1_2026-10-08.zip`

GitHub blob:
`6b3593a2bc3b33120fdb466c9b4267077dd1fc4b`

GitHub upload commit:
`4c4ee3951f29e6c5c7b393bdd206b698170a7356`

Production Control imported copy:
- size: 1,953,144 bytes
- SHA-256: `f51bc757fb612af942e79cd217ca1faacc32780ffeb532e740cf2759636883c6`

## ZIP census

Central-directory parse:
- total entries: **141**
- directories: 8
- JavaScript: 4
- HTML: 1
- Markdown: 3
- JSON: 3
- MP3: **119**
- YAML: 1
- Python: 1
- CJS test: 1

Audio split:
- `build/fragments/`: **71 MP3**
- `build/lines/`: **48 MP3**
  - 24 Whole
  - 24 Assembled

Manifest:
- `kfb.chatterbox.voice-manifest.v0.1`
- 71 fragment records
- 24 line records
- every referenced fragment file exists in the ZIP
- every referenced Whole/Assembled line file exists in the ZIP

## Static acceptance assertions · 18/18 PASS

1. ZIP entry count = 141.
2. MP3 count = 119.
3. fragment MP3 count = 71.
4. line MP3 count = 48.
5. manifest fragment count = 71.
6. manifest line count = 24.
7. all manifest fragment paths resolve inside ZIP.
8. all Whole/Assembled paths resolve inside ZIP.
9. 11 proposed archetype voice presets exist.
10. 15 package emotion IDs exist.
11. package emotion IDs exactly equal current `RESIDENT_AFFECT_EMANATA_MAP_PREP_2026-10-06.json`.
12. runtime exposes all four resolver modes: fragments, whole, live, browser.
13. runtime exposes `onBeat` and `onSpeaking`.
14. donor runtime creates no AudioContext.
15. donor runtime performs no fetch.
16. test file declares 10 resolver/file tests.
17. example Triplets explicitly identify themselves as illustrative/non-canon.
18. selected casting does not use the donor document's known non-commercial/unclear voice candidates.

## Donor-reported execution evidence

The package's own START_HERE reports:
- `node tools/test_runtime.cjs` → 10/10;
- Headless Chromium bench: Assembled route played 3 fragments in order;
- custom Triplet resolved `fragments`;
- changed text resolved `browser`;
- no script errors.

These are **donor-reported**, not rerun by this Web Chat. This audit verified package structure and code contracts, not browser audio quality.

## Runtime inspection

`runtime/chatterbox-voice.js`:
- dependency-free IIFE;
- normalization helper mirrored by Python build tool;
- resolver order:
  1. fragment set;
  2. Whole line;
  3. injected `liveTTS`;
  4. browser speech synthesis;
- one line at a time per instance;
- callbacks:
  - `onBeat(slotIndex, line)`;
  - `onSpeaking(bool, line)`;
  - `onRoute(mode, line)`.

Important ownership finding:
the donor runtime does **not** create an AudioContext and does **not** fetch. This is compatible with keeping KFB Audio as mixer/ducking owner.

## Build-tool inspection

`tools/render_chatterbox_voice.py`:
- dependencies: Python stdlib + external Piper / espeak-ng / ffmpeg / ffprobe;
- renderer functions include synthesis, position-aware slot text, FX, loudness/output conversion, duration, silence/gap generation and manifest writing;
- `norm_text()` explicitly states it must match runtime `normText()`;
- writes JSON manifest plus JS twins for local `file://` demo use;
- outputs Whole and optional Assembled lines.

The optional GitHub Actions recipe uses an ordinary Ubuntu runner and does not require GPU infrastructure.

## Current KFB alignment

### Exact match
The donor's 15 emotions are exactly:
`calm, curious, attentive, joyful, amused, grateful, proud, surprised, worried, sad, annoyed, angry, embarrassed, suspicious, tired`.

They match the current Resident Affect source exactly.

### Real semantic owner
The current `DECK_WORLD_SEED_CARD_PIPELINE_2026-10-04.md` says:
- semantic upstream supplies content;
- faction/worldview + Resident identity filters it;
- ChatterBox owns speaker/timing/presentation budget;
- Bubble/Emote/TTS is output.

The voice donor fits that direction if it remains output-only.

### Real phrase source gap
`overworld/overworld/chatter-phrases.js` currently stores faction phrase families such as:
- `idle`
- `ueber`
- `antwort`
- `frage`
- `philo`
- `spott`
- `handel`

It is not yet the same schema as the donor's direct `triplet:[segment0,segment1,segment2]` fixture records.

Therefore the production adapter must create stable source-backed fragment identities; it must not infer canon from the 24 audition examples.

### Resident mapping gap
Current Resident semantic prep exposes `chatterProfileRef`, but no current repository result proves the final runtime mapping:
`Resident → chatterProfileRef → voicePreset`.

That mapping is the first real integration seam.

## License guard

Donor-selected voices:
- LibriTTS-R multi-speaker family: CC BY 4.0;
- cori: public-domain source per donor record;
- northern_english_male: CC BY-SA 4.0, share-alike interpretation still needs explicit ship review;
- espeak-ng Robot output: build-time engine route.

Known non-commercial/unclear candidates listed in the donor document are not selected in the current casting JSON.

No legal conclusion is made here; the production Return must still record the exact shipped voice-model attribution/license.

## Audio-quality status

**UNKNOWN / HUMAN LISTENING NOT RUN IN THIS CHAT.**

No claim is made that the 11 presets sound good, that Assembled beats Whole, or that the FX are final.
