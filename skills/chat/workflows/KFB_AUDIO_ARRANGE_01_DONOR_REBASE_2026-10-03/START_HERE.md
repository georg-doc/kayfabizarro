# AUDIO-ARRANGE-01 DONOR REBASE · START HERE

**Status:** SOURCE / CHROMIUM / WEBAUDIO PASS · PUBLIC STAGE PENDING  
**Date:** 2026-10-03  
**Owner:** KFB Audio & Soundscape Baseline v1  
**Repo:** `georg-doc/kayfabizarro`  
**Branch:** `chatgpt-web/audio-arrange-01-donor-rebase-2026-10-03`  
**Draft PR:** `#339`  
**Base:** `eadebbb7ce90612630a9b3b166dd3ae1cad7b0d2`  
**Tested head:** `3d85d7e2aa103ab0bb2b388c678584d9ece19484`  
**Reserved Stage:** `https://kayfabizarro.pages.dev/kfb-hub/stage/audio-arrange-01/`

## Why this branch exists

PR #337 correctly stopped after two repair passes because its branch base predated Georg's Cyclical Warmth / Loping Groove upload.

This fresh branch starts after those files arrived on main and brings the donor bench forward without changing musical logic.

## Current proof

GitHub Actions:
- run `37093077519`;
- job `111117349198`;
- **SUCCESS**.

Checks:
- exact source/donor validation: **29/29 PASS**;
- Chromium/WebAudio donor bench: **24/24 PASS**;
- proof artifact: `11262876991`;
- digest: `sha256:e08c061ac8f580d469b07586c52dd8c52db3fa94dc191e3f77d71f951077df19`.

## Measured donor facts

All eight Cyclical Warmth stems:
- decode successfully;
- 44.1 kHz stereo;
- exact duration **214.128 s** each;
- duration spread **0.000 s**;
- all eight are scheduled at the exact same AudioContext timestamp.

Master durations:
- Cyclical Warmth: **213.200 s**;
- Loping Groove: **204.000 s**.

First-content onsets differ by lane because the musical arrangements contain real silence:
- drums/bass ~0.48 s;
- guitar/keyboard ~0.12 s;
- synth ~0.56 s;
- percussion ~1.26 s;
- brass ~70.56 s;
- strings ~76.32 s.

Do not "align" these onsets independently. The files already share one timeline.

## Bench modes

1. CYCLICAL MASTER
2. LOPING MASTER
3. STEM RECONSTRUCT
4. KFB ARRANGE

KFB ARRANGE uses the same source performances with one fixed 64-bar form:
OPEN → A → A' → B → SPACE → A RETURN → PSY → RECOVERY.

It does not compose new notes.

## Musical decision

Cyclical Warmth remains primary Ground Truth at native **76 BPM**.

The 64-bar form covers about **202.1 s**, leaving the donor's existing tail outside the fixed form. That is acceptable for this diagnostic bench.

Loping Groove stems remain deferred until a concrete musical gap is proven.

## One next gate

Publish this unchanged candidate to `https://kayfabizarro.pages.dev/kfb-hub/stage/audio-arrange-01/`, verify the exact public route, then Georg compares master vs reconstruction vs KFB arrangement.

No WebAudioFont replacement, new Suno generation, Deck logic, weather or Race telemetry before this A/B.
