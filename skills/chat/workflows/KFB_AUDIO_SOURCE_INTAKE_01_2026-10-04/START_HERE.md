# KFB AUDIO SOURCE INTAKE 01 · START HERE

**Status:** IMPLEMENTATION CANDIDATE  
**Date:** 2026-10-04  
**Owner:** KFB Audio & Soundscape Baseline v1  
**Parent Site:** https://kfb-audio.frizzlebob.chatgpt.site/  
**Parent source:** PR #350 @ `64037bc8e181c0796ddc2d505187074e98f04491`  
**Branch:** `chatgpt-web/kfb-audio-source-intake-01-2026-10-04`

## Outcome

Integrate current generated-audio tests into the Audio Site without pretending they are accepted production sources.

- add `Rain percussion · Beetle / Ring` as a 107 BPM human-positive synced-texture/style reference;
- keep its 11 stems `source-only`;
- add all 17 ElevenLabs files to Source Lab as audition candidates;
- preserve Rain/Thunder/etc. missing-bank truth until actual listening acceptance;
- record Georg feedback that the old SFX prompt bank wording was not good.

## Protected boundaries

- existing live Site stays untouched until this child candidate is green;
- no ElevenLabs test becomes VERIFIED_SOURCE automatically;
- Rain percussion is not a physical rain replacement;
- no merge of PR #350;
- no Cloudflare.

## Exactly one next gate

`KFB_AUDIO_SOURCE_INTAKE_01_REVIEW` — Source Lab + 55/45/15 candidate must pass browser QA; then Sites-capable executor updates the existing `kfb-audio` project and Georg can mark candidates KEEP / TUNE / REJECT.
