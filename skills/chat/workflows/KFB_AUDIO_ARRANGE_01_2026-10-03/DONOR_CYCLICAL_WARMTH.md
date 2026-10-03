# AUDIO-ARRANGE-01 · Donor Bench · Cyclical Warmth / Loping Groove

**Date:** 2026-10-03
**Status:** PRIMARY MUSICAL DONOR SELECTED · INTERNAL BENCH NEXT
**Owner:** KFB Audio & Soundscape Baseline v1
**Branch:** `chatgpt-web/audio-arrange-01-2026-10-03`

## Decision

Use **Cyclical Warmth** as the first musical Ground Truth for AUDIO-ARRANGE-01.

Why:
- its prompt already matches the current target unusually closely;
- Georg supplied a complete aligned stem set normalized to **76 BPM**;
- the stem roles map directly to our intended arrangement layers;
- using a proven musical performance lets us test arrangement/mix/form separately from synthesis/timbre generation.

Do not treat the track as final KFB world music or as something to copy unchanged.

## Master donors

### Cyclical Warmth

`media/3D_Assets/Sounds/KFB RoadTrip JukeBox v2/Cyclical Warmth.mp3`

- blob: `0f544bd7e51b6b0f86f3996daa0a66b8d8be27ce`
- bytes: 4,917,339
- role: primary musical floor / A-B reference

User-supplied generation prompt:

> Psychedelic instrumental, gently loping groove; warm electric piano loops extended chords and a repeating motif, clipped clavinet replies in syncopated offbeats, rounded bass circles a hypnotic two-bar pattern, mellow organ sustains, muted guitar adds sparse percussive upstrokes, restrained shaker and soft hand-percussion taps. Seamless cyclical arrangement with subtle timbral shifts every few bars, warm tape-like saturation, intimate close mix, soft stereo width, mellow dynamics.

Trait match to current contract:
- rhythm-first: YES
- hypnotic repetition: YES
- electric piano / clav / organ harmonic color: YES
- rounded repeating bass: YES
- sparse muted guitar: YES
- restrained percussion: YES
- subtle timbral change instead of note density: YES
- warm/tape-like close production: YES

Main gap relative to KFB target:
- stronger Yello-like sparse sound-design events / negative-space drama still need to be added carefully.

### Loping Groove

`media/3D_Assets/Sounds/KFB RoadTrip JukeBox v2/Loping Groove.mp3`

- blob: `04d08d460e0339504802fd9f77544a92661e2d54`
- bytes: 4,986,803
- role: secondary master reference / alternate groove character
- stems: NOT REQUIRED YET

Decision:
Do not spend Suno credits on Loping Groove stems before the Cyclical Warmth donor bench tells us which missing role/variation is actually needed.

## Cyclical Warmth stems · 76 BPM

Folder:
`media/3D_Assets/Sounds/KFB RoadTrip JukeBox v2/Cyclical Warmth Stems (76BPM)/`

| lane | file | blob | bytes | intended KFB role |
|---|---|---|---:|---|
| drums | `0 Drums.mp3` | `39525692c33c738aafa519661773fbd78c1fb21a` | 4,354,916 | core pocket / rhythm owner |
| bass | `1 Bass.mp3` | `32b5ceae7b973f43055f46bbded3db19d4b13ade` | 3,252,740 | primary pitched identity |
| guitar | `2 Guitar.mp3` | `9e3b0b83e5a237465e4ee5cc2661011916518419` | 2,854,004 | sparse color / upstroke / answers |
| keyboard | `3 Keyboard.mp3` | `38b44f8fca9af07cdea5aca1ccddd651856885d7` | 3,836,900 | E-piano / clav / harmonic source |
| percussion | `4 Percussion.mp3` | `f4aa370df2b08979fc861b1168cdf29104dec4ac` | 4,563,980 | high/mid detail / hand percussion |
| strings | `5 Strings.mp3` | `a26456d848b4cd44b587f1176758c6743f8d5f9a` | 1,452,572 | optional atmosphere / probably sparse |
| synth | `6 Synth.mp3` | `1736f60264d25ff74f753cba36261b8d3f203f20` | 3,918,932 | bed / psychedelic color |
| brass | `7 Brass.mp3` | `54828793df169cedea834745a6f6c2611d10b28b` | 1,731,524 | rare accent only if useful |

All stems are source-preserving; no derivative audio is created in this checkpoint.

## Why 76 BPM is useful

At 4/4:
- one beat = ~0.78947 s
- one bar = ~3.15789 s
- 2 bars = ~6.31579 s
- 4 bars = ~12.63158 s
- 8 bars = ~25.26316 s
- 64 bars = ~202.105 s (~3:22)

This is ideal for bar-addressable browser automation if the stems share a common downbeat/alignment.

Do not assume downbeat offset = 0 until browser decode/playback proves it.

## First donor-bench experiment

Create an INTERNAL branch-local browser bench, not yet a public/human Stage.

Modes:

### A · MASTER
Play exact Cyclical Warmth master unchanged.

Purpose:
musical Ground Truth.

### B · STEM RECONSTRUCT
Start all eight stems sample-accurately together at their original balance approximation.

Purpose:
prove the stems reconstruct a coherent performance and expose decode/duration/alignment.

### C · KFB ARRANGE
Use the same aligned performances but automate stem buses over a fixed 64-bar form:
- OPEN
- A
- A'
- B
- SPACE
- A RETURN
- PSYCHEDELIC DRIFT
- RECOVERY

This isolates **arrangement** from **composition/performance**.

If C is worse than A/B, fix arrangement before replacing any instrument with procedural playback.

## KFB ARRANGE initial stem policy

### always structurally important
- Drums
- Bass

### harmonic/color pool
- Keyboard
- Guitar
- Synth

### optional / sparse only
- Percussion
- Strings
- Brass

No section should simply turn all eight stems on.

Initial layer budget:
- 2–4 foreground/meaningful stems at a time;
- explicit near-silence section;
- brass/strings are not default glue;
- percussion can disappear for long stretches.

## Later rebuild path

Once the stem arrangement itself passes:

1. replace one role at a time with phrase/MIDI + sample-based instrument;
2. compare replaced role against original stem;
3. keep original stem as reference mute/solo;
4. only promote replacements that do not reduce musicality.

Suggested replacement order:
1. percussion / drum support
2. keyboard/clav color
3. bass
4. sparse guitar
5. optional synth/bed

WebAudioFont may be used internally to audition timbres.
Public implementation should prefer permissively licensed/self-hosted sources.

## Loping Groove stem decision

**WAIT.**

Pull Loping Groove stems only if one of these becomes true:
- Cyclical Warmth lacks a sufficiently funky/propulsive drum-bass pocket;
- a second phrase family is needed to avoid overfitting one Suno performance;
- we need a cleaner ROAD-oriented donor;
- human A/B listening prefers Loping Groove strongly enough to justify extraction.

This avoids spending credits before a concrete gap exists.

## One next gate

Implement the internal MASTER / STEM RECONSTRUCT / KFB ARRANGE donor bench and measure:
- decoded duration per file;
- common start/alignment behavior;
- 76-BPM bar clock fit;
- stem load/decode success;
- one AudioContext;
- no phase drift caused by independent HTMLAudio playback;
- fixed 64-bar section scheduler.

No public Stage claim yet.
