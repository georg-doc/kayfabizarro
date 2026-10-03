# AUDIO-ARRANGE-01 DONOR REBASE · START HERE

**Status:** PUBLIC_VERIFIED · HUMAN A/B LISTENING PENDING  
**Date:** 2026-10-03  
**Owner:** KFB Audio & Soundscape Baseline v1  
**Repo:** `georg-doc/kayfabizarro`  
**Branch:** `chatgpt-web/audio-arrange-01-donor-rebase-2026-10-03`  
**Draft PR:** `#339`  
**Base:** `eadebbb7ce90612630a9b3b166dd3ae1cad7b0d2`  
**Tested head:** `e7e55078208a031207a67299d54015f67aa78a29`  
**Direct Stage:** `https://kayfabizarro.pages.dev/kfb-hub/stage/audio-arrange-01/`

## Why this branch exists

PR #337 correctly stopped after two repair passes because its branch base predated Georg's Cyclical Warmth / Loping Groove upload.

This fresh branch starts after those files arrived on main and brings the donor bench forward without changing musical logic.

## Current proof

GitHub Actions:
- source run/job `37093867717 / 111119683066`: **SUCCESS**;
- exact source/donor validation: **29/29 PASS**;
- Chromium/WebAudio donor bench: **25/25 PASS**;
- source proof artifact: `11263208942`;
- source digest: `sha256:b22361501dc0db8ab08d773a5e73b6d3e721ea82e9d3589c27bad6ae8c4b0a22`.

A/B mode gains are level-calibrated in v0.2: master 0.68 · reconstruction 0.73 · KFB arrangement 0.90. Musical source/form is otherwise unchanged.

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

## Public verification

- publication: `cloudflare-live@9761d68b83da0e8c091fe22e9edbb8d00054a9c7`;
- Cloudflare Pages check `111120414788`: **SUCCESS**;
- public proof source: `5e58f4bc706ebcd5cc23a9bd277e0289e18ab85b`;
- public run/job: `37094037185 / 111120175674`;
- exact public Chromium/WebAudio: **25/25 PASS**;
- passed on retry attempt 3 after deployment timing;
- public artifact: `11262928219`;
- public digest: `sha256:d8dbdff3eb862d23402cdc3dd90670ef68388712651c3bc53dd3ca3d7024de3c`.

## One next gate

**GEORG_AUDIO_ARRANGE_AB_01** — compare CYCLICAL MASTER / LOPING MASTER / STEM RECONSTRUCT / KFB ARRANGE.

No WebAudioFont replacement, new stem extraction, Deck logic, weather or Race telemetry before this A/B.
