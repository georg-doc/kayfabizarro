# KFB AUDIO SFX PROMPT BANK 01 · START HERE

**Status:** PROMPT_READY · GENERATION OPEN  
**Date:** 2026-10-04  
**Owner:** KFB Audio & Soundscape Baseline v1  
**Repo:** `georg-doc/kayfabizarro`  
**Branch:** `chatgpt-web/kfb-audio-sfx-prompt-bank-01-2026-10-04`  
**Target surface:** future KFB Audio Site module

## Goal

Provide one copy-ready, machine-readable prompt bank for missing KFB sound layers while the Audio Site host is being completed.

## Current source-backed gap priority

P0:
1. rain / thunder;
2. sustained crowd / venue;
3. city / traffic;
4. tyre / friction;
5. loopable workshop machinery.

Existing usable sources remain:
- shared wind / water / impacts;
- sparse applause reaction;
- KFB Racer V8 idle/load/rev + steampunk engine WAVs.

Vehicle replacements are P2, not blockers.

## Tool split

- ElevenLabs Sound Effects = primary source acquisition, separate layers;
- Suno Sounds = intentionally BPM/key-synced texture loops/one-shots;
- Suno v6 = optional “weather as music” biome/style experiments.

## Runtime rule

Environmental loops free-run and crossfade. Only intentionally musical textures use BPM/bar sync. New sources never create a second gameplay/audio owner.

## Artifacts

- `tools/KFB-Audio-Site/SFX_PROMPT_BANK_01.html`
- `tools/KFB-Audio-Site/sfx-prompt-bank.v1.json`

## Exactly one next gate

`KFB_AUDIO_SFX_INTAKE_01` — Georg generates whichever P0 assets are useful, then uploads/selects the winners for Audio Site intake. No need to complete the whole bank first.
