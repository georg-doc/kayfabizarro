# AUDIO-ARRANGE-01 · FAILURE RECOVERY EXPORT

**Date:** 2026-10-03  
**Status:** STOPPED AFTER TWO REPAIR PASSES · CANDIDATE PRESERVED  
**Owner:** KFB Audio & Soundscape Baseline v1  
**Repo:** `georg-doc/kayfabizarro`  
**Branch:** `chatgpt-web/audio-arrange-01-2026-10-03`  
**Draft PR:** `#337`  
**Latest preserved head:** `b553b2c036baa1e30bec46e6d9eb1c66606e2741`  
**Donor-bench implementation head:** `6e0d616e2d7cd6be0a858083bc78b441f23b64e8`  
**Branch base:** `74f7a690fbec88cf98ce0936f31b72ad3f1148f5`  
**Current main observed:** `eadebbb7ce90612630a9b3b166dd3ae1cad7b0d2`  
**Public Stage:** NONE

## Intended gate

Build an internal donor bench for AUDIO-ARRANGE-01 with four modes:

1. exact **Cyclical Warmth** master;
2. exact **Loping Groove** master;
3. sample-synchronous reconstruction of all eight **Cyclical Warmth 76-BPM stems**;
4. the same eight stems under one fixed 64-bar KFB arrangement.

The bench deliberately composes no new notes. It isolates arrangement/mix quality from musical-performance quality.

## Preserved candidate files

- `kfb-hub/stage/audio-arrange-01/SOURCE.json`
- `kfb-hub/stage/audio-arrange-01/index.html`
- `kfb-hub/stage/audio-arrange-01/style.css`
- `kfb-hub/stage/audio-arrange-01/arrange-bench.js`
- `kfb-hub/stage/audio-arrange-01/validate.mjs`
- `kfb-hub/stage/audio-arrange-01/qa.mjs`
- `.github/workflows/audio-arrange-stage.yml`
- `skills/chat/workflows/KFB_AUDIO_ARRANGE_01_2026-10-03/DONOR_CYCLICAL_WARMTH.md`

The musical/bench implementation itself has not received an audio-behavior failure. Browser/WebAudio checks never ran.

## Root cause

The new Suno donor files were uploaded to `main` **after** the AUDIO-ARRANGE branch was created.

Branch base:
`74f7a690fbec88cf98ce0936f31b72ad3f1148f5`

Current main:
`eadebbb7ce90612630a9b3b166dd3ae1cad7b0d2`

GitHub compare reports main is **3 commits ahead** and specifically reports all ten required donor files as **added** after the branch base:

- `Cyclical Warmth.mp3`
- `Loping Groove.mp3`
- `Cyclical Warmth Stems (76BPM)/0 Drums.mp3`
- `.../1 Bass.mp3`
- `.../2 Guitar.mp3`
- `.../3 Keyboard.mp3`
- `.../4 Percussion.mp3`
- `.../5 Strings.mp3`
- `.../6 Synth.mp3`
- `.../7 Brass.mp3`

Therefore the validator's repeated
`cyclical exists = false`
result was correct for the branch snapshot.

The subsequent sparse-checkout edits could not fix a source file that did not exist on the branch.

## Failed gate attempts

### Original candidate

- head: `6e0d616e2d7cd6be0a858083bc78b441f23b64e8`
- run: `37092265329`
- job: `111114911475`
- checkout: full checkout
- result: **FAIL**
- failure: validator stops at `cyclical exists = false`
- browser/WebAudio: **NOT RUN**

### Repair pass 1

- head: `5e1861f725dd6c2f8e1e14fd91d3b3e50f803eca`
- run: `37092385429`
- job: `111115266003`
- attempted repair: sparse checkout for exact RoadTrip subtree
- result: **FAIL**
- failure: same missing `Cyclical Warmth.mp3`
- browser/WebAudio: **NOT RUN**

### Repair pass 2

- head: `b553b2c036baa1e30bec46e6d9eb1c66606e2741`
- run: `37092416340`
- job: `111115360191`
- attempted repair: broader `media/3D_Assets/Sounds` sparse checkout
- result: **FAIL**
- failure: same missing `Cyclical Warmth.mp3`
- browser/WebAudio: **NOT RUN**

## Two-repair rule

The same gate has now had two failed repair passes.

**STOP.**

Do not:
- make a third checkout/workflow repair on PR #337;
- fake duration/BPM/alignment evidence;
- publish the bench to Cloudflare;
- claim stem reconstruction or 64-bar arrangement PASS;
- pull Loping Groove stems yet.

## Donor truth on current main

User-supplied current donors on `main`:

### Cyclical Warmth master

- path: `media/3D_Assets/Sounds/KFB RoadTrip JukeBox v2/Cyclical Warmth.mp3`
- blob: `0f544bd7e51b6b0f86f3996daa0a66b8d8be27ce`
- bytes: 4,917,339

### Loping Groove master

- path: `media/3D_Assets/Sounds/KFB RoadTrip JukeBox v2/Loping Groove.mp3`
- blob: `04d08d460e0339504802fd9f77544a92661e2d54`
- bytes: 4,986,803

### Cyclical Warmth stems · 76 BPM

- Drums: `39525692c33c738aafa519661773fbd78c1fb21a`
- Bass: `32b5ceae7b973f43055f46bbded3db19d4b13ade`
- Guitar: `9e3b0b83e5a237465e4ee5cc2661011916518419`
- Keyboard: `38b44f8fca9af07cdea5aca1ccddd651856885d7`
- Percussion: `f4aa370df2b08979fc861b1168cdf29104dec4ac`
- Strings: `a26456d848b4cd44b587f1176758c6743f8d5f9a`
- Synth: `1736f60264d25ff74f753cba36261b8d3f203f20`
- Brass: `54828793df169cedea834745a6f6c2611d10b28b`

These are **main-only relative to PR #337's base** at this checkpoint.

## Musical decision preserved

Cyclical Warmth remains the preferred first Ground Truth because its prompt/performance structure already matches the target:
- gently loping groove;
- electric piano / clav / organ color;
- two-bar rounded bass;
- sparse muted guitar;
- restrained percussion;
- subtle timbral evolution;
- tape-like warmth;
- intimate, mellow dynamics.

Native **76 BPM** should be preserved for the first WORLD donor test. Do not time-stretch to the earlier 90-BPM draft target merely to satisfy a design number.

Loping Groove remains a secondary master reference.

**Do not spend credits on Loping Groove stems yet.**

Only pull them if the Cyclical donor bench proves a concrete missing groove/ROAD/phrase role.

## Recovery route

Fresh restart only.

Create a **new branch from current main `eadebbb7ce90612630a9b3b166dd3ae1cad7b0d2` or later**, then bring forward the preserved bench files from PR #337.

Recommended next slice:
`AUDIO-ARRANGE-01-DONOR-REBASE`

The fresh slice must first prove:
1. the two masters and eight stems exist on its branch;
2. exact byte sizes match;
3. browser decode succeeds;
4. decoded stem durations/alignment are measured;
5. only then run MASTER / STEM RECONSTRUCT / KFB ARRANGE comparison.

Do not alter musical logic before source parity passes.

## Exactly one next gate

**AUDIO-ARRANGE-01-DONOR-REBASE · fresh branch from current main with donor files present.**
