# KFB Audio & Soundscape Baseline v1 · CHANGELOG

## 2026-09-24 · Baseline audit

- opened bounded documentation branch from `kayfabizarro@9431dcb8da0158a75d0988d52fc1e7a49aac21f1`;
- read current KFB Chat workflow/router and owner recovery sources;
- audited `media/3D_Assets/Audio/` and `media/3D_Assets/Sounds/`;
- confirmed Travel as the strongest existing general soundscape/narrator-ducking donor;
- preserved Race/Combat/Boxel runtime ownership instead of proposing a universal replacement engine;
- recorded Race accepted/rejected audio history;
- confirmed current recursive tree counts: 1718 Audio file records + 48 Sounds file records;
- parsed four core JSON manifests/catalogs successfully;
- validated 13/13 shared SFX asset paths;
- found 0/16 valid UI-SFX paths as written because the Kenney `/Audio/` segment is missing;
- validated 10/10 authored KFB Jukebox track paths;
- recorded the stale 2026-08-04 shared audio catalog as an extension target rather than creating a new registry;
- identified source-bank gaps: tyre/friction, weather/thunder, crowd, urban/traffic, continuous machinery and shared character voice-profile metadata;
- defined a small semantic role mapping:
  `VOICE | UI | PLAYER_CRITICAL | WORLD_SFX | DIEGETIC_MUSIC | SCORE | LOCAL_AMBIENCE | GLOBAL_BED`;
- defined next gate `AUDIO-CAL-01` with golden-hour-town, graveyard-night and ring-performance states;
- recorded target Cloudflare route as planned only:
  `https://kayfabizarro.pages.dev/kfb-hub/stage/audio-calibration/`;
- checked optional Game Development Studio helper and recorded:
  `GAME_DEV_CLI_UNAVAILABLE · OPTIONAL FALLBACK USED`;
- no runtime, binary audio, physics, gameplay or public Stage was changed.

## Decision carried forward

The shared KFB audio problem is currently a **curation/mix/contract problem**, not an “invent another audio engine” problem.

AUDIO-CAL-01 must prove the target dense-scene case before wider integration:

`diegetic band/music + ambience/weather + critical SFX + addressed speech`

with voice intelligible through ducking/focus, while music timelines continue.
