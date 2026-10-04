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


## 2026-09-24 · Handoff metadata

- Draft PR #205 opened against `main`.
- Router, registry, global changelog and KFB Hub now point to this baseline.
- The older Town/Travel soundscape item remains preserved as a REFERENCE donor, not a competing current audio plan.
- AUDIO-CAL-01 remains planned only; no public Stage or runtime deployment was created by this slice.
- No merge or Live promotion authorized.


## 2026-09-24 · AUDIO-CAL-01 implementation + CI

### IMPLEMENTATION

- repaired `media/3D_Assets/Audio/ui-sfx.json` exact Kenney paths;
- refreshed the existing shared `audio-catalog.json` in place;
- made the catalog refresh reproducible in `build_catalog.py`;
- added `tools/audio/validate-audio-manifests.mjs`;
- implemented `kfb-hub/stage/audio-calibration/` with one source contract, one AudioContext, three calibration states, diegetic Orc music, shared ambience/SFX sources, browser TTS focus and non-pausing ducking;
- procedural storm is explicitly calibration-only, not an accepted production thunder asset;
- applause remains a sparse reaction, not a crowd-bed substitute.

### TESTED RESULT

Tested runtime/QA head: `7013f43a0501c824deb2c5541c1971c2b979a4e6`.

GitHub Actions:
- run `36024697531`;
- job `107718140193`;
- **SUCCESS**.

Source checks:
- **6/6 report groups PASS**;
- shared SFX **13/13**;
- UI SFX **16/16**;
- Audio Jukebox **1/1**;
- KFB Jukebox **10/10**;
- AUDIO-CAL-01 assets **11/11**;
- catalog count exact: **1732 = 1687 Audio + 45 Sounds**.

Browser/WebAudio:
- **31/31 PASS**;
- one AudioContext;
- real audio decode/playback;
- music timeline advances normally and continues under voice ducking;
- Ring/Performance, Graveyard/Night and event controls exercised;
- desktop and mobile viewport checks PASS;
- no page/console/HTTP failures.

Proof artifact:
- `10819176933`;
- 3 files including desktop/mobile screenshots and `results.json`;
- digest `sha256:05b9776cc3d501a77360e6ee6660278e1137fb793756aa3a817cb555e2c91012`.

### OPEN

Public Stage publication is still pending at this checkpoint. No public or human listening PASS is inferred from CI.


## 2026-09-24 · AUDIO-CAL-01 PUBLIC_VERIFIED

- mirrored exact Stage package, 11 required audio assets and Hub tool to `cloudflare-live@a8e2af8f79f33b51f638222f203a28f3e1c15b23`;
- Cloudflare Pages check `107727186186` completed **SUCCESS** at 16:26:22Z;
- public attempts 1–2 failed at the Stage marker because they completed before that deploy existed;
- unchanged attempt 3 ran after confirmed deployment and reached **31/31 PASS** on the exact Cloudflare route;
- public workflow `36025670884`, attempt 3, job `107731456493`;
- artifact `10819978496`, digest `sha256:49ef9b156efadaced6d257f8768ba553a780a443a6bd13666014781e7a2fd3c2`;
- direct human route: `https://kayfabizarro.pages.dev/kfb-hub/stage/audio-calibration/`;
- next gate is Georg human listening only; no runtime integration, PR merge or Live promotion follows automatically.


## 2026-09-24 · AUDIO-CAL-01 human PASS

- Georg listened to the public calibration and returned **PASS**: “klingt sehr gut soweit. passt.”
- Calibration baseline status is now `HUMAN_ACCEPTED`.
- Acceptance covers the current mix/ducking direction, not blanket approval of every raw sound asset.
- Remaining audio backlog: crowd/weather/traffic/friction source-bank curation, character voice-profile metadata, and later owner-specific adoption.
- No PR merge or automatic consumer integration performed.
