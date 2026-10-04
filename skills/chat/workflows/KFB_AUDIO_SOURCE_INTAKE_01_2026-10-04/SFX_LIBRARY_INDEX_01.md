# KFB AUDIO SFX LIBRARY INDEX 01

**Status:** DATA_INDEX_GREEN · SITE_UI_PENDING  
**Date:** 2026-10-04  
**Owner:** KFB Audio & Soundscape Baseline v1  
**Branch:** `chatgpt-web/kfb-audio-source-intake-01-2026-10-04`  
**Asset source lock:** `main@ca4f953d0d5ca001b46f1d89b8908b80592a09c9`  
**Existing Site:** https://kfb-audio.frizzlebob.chatgpt.site/

## Outcome

Create one current, source-locked inventory for the existing KFB Audio Site without creating a second Site or a replacement audio runtime.

Canonical registry remains:

`media/3D_Assets/CATALOG/audio-catalog.json`

Site discovery view:

`tools/KFB-Audio-Site/sfx-library.snapshot.json`

The Site snapshot is derived metadata, not a second canonical registry.

## Current inventory

Canonical shared audio inventory at the pinned source:

- **2,084 audio files total**
- **1,704** under `media/3D_Assets/Audio/`
- **380** under `media/3D_Assets/Sounds/`
- formats: **892 WAV · 765 OGG · 426 MP3 · 1 M4A**
- canonical catalog folders containing audio: **91**

The SFX discovery snapshot covers all **1,704 Audio files** across **31 source families**.

Audio subtree payload:

- 1,735 total blob/file records
- 1,704 audio files
- 219,448,396 audio bytes
- 892 WAV
- 765 OGG
- 47 MP3

## Existing KFB role contract retained

No new universal audio engine was introduced. The existing shared mix-role vocabulary remains:

`VOICE | UI | PLAYER_CRITICAL | WORLD_SFX | DIEGETIC_MUSIC | SCORE | LOCAL_AMBIENCE | GLOBAL_BED`

The new index adds discovery facets only:

- gameplay use-case;
- interaction verb;
- temporal class;
- spatial class;
- source pack;
- blob SHA / exact-duplicate count;
- source-inventory / audition / alias status;
- classification confidence.

Filename/pack inference is metadata for discovery. It is not listening acceptance.

## Use-case coverage

Counts overlap because one source may serve more than one gameplay use-case.

| Use case | Candidate files |
|---|---:|
| Combat | 346 |
| Feedback / reward / success / pickups | 321 |
| UI / HUD | 307 |
| Arcade-game feedback | 293 |
| Object interaction / inventory / doors / cards / materials | 291 |
| Music / score-like sources inside Audio | 213 |
| Vehicle / machinery | 143 |
| Tech / sci-fi | 136 |
| Movement / footsteps / jump / land | 125 |
| Voice / human / generated audition | 81 |
| Curated legacy shortlist | 59 |
| World ambience | 34 |
| Other foley | 20 |

**95 files** remain deliberately low-confidence / generically indexed rather than being forced into an invented gameplay role.

## Temporal coverage

Heuristic temporal classification:

- **1,263 one-shots**
- **126 stings**
- **81 voice/reaction files**
- **213 music-class files**
- only **21 clear loop-class files**

Interpretation: KFB already has a deep one-shot vocabulary. The weak side is continuous physical-world soundscape material.

## Exact duplicate / lineage result

Across the Audio subtree:

- **214 exact duplicate blob groups**
- **273 extra duplicate copies**
- **14,060,534 bytes** of extra exact-copy payload

Three important lineage checks:

### Interface

The 100 OGG files at Audio root have:

- **100/100 same-name matches**
- **100/100 exact blob matches**

against `kenney_interface-sounds/Audio/`.

Discovery preference: use the nested Kenney family as the source family and retain the root files as provenance aliases.

### Classic Arcade

`Classic Arcade SFX/` contains 80 files.

All **80/80** are exact blob matches at the same relative paths inside `Classic Arcade SFX Complete/`.

Discovery preference: expose the Complete family by default and retain the smaller pack as an alias lineage.

### S050C Arcade Shooter

- DryStereo: 84 files
- WetStereo: 110 files
- same-name Dry/Wet pairs: 84
- exact-byte pairs: **32**

Therefore Dry/Wet naming must not be treated as proof of different content. Some are distinct, some are byte-identical.

## Source-family highlights

Strong current banks include:

- Classic Arcade SFX Complete — 213
- S050C ArcadeShooter — 194
- Kenney Impact — 130
- Musical Effects — 111
- Kenney Interface — 100
- Kenney Music Jingles — 86
- Kenney Sci-Fi — 73
- Kenney Digital — 63
- curated — 59
- Kenney Casino — 55
- Kenney RPG — 52
- Kenney Fighter Voiceover — 47
- Footsteps — 33
- Materials — 33
- UI WAV family — 30
- Environment — 24
- Items — 24
- KFB Racer — 19
- ElevenLabs Audio — 17 audition-only
- Combat and Gore — 17
- Weapons — 15
- Cartoonish Music Pack — 10
- Machines — 7

## Gaps preserved

Do not close these by filename inference:

1. **tyre / skid / friction** — SOURCE_REQUIRED
2. **physical rain / storm / thunder** — SOURCE_REQUIRED
3. **sustained crowd / venue ambience** — SOURCE_REQUIRED
4. **city / traffic bed + pass-bys** — SOURCE_REQUIRED
5. **additional loopable workshop machinery** — CURATION_REQUIRED

The existing 17 ElevenLabs files remain audition candidates; they do not silently close any physical-world source gap.

## Site integration contract

Next Site iteration should extend the existing KFB Audio Site, not create a sibling.

Recommended surface:

1. **SFX Library** search/filter over the snapshot.
2. Filters: use-case, source pack, temporal class, spatial class, status, confidence, duplicate visibility.
3. Preview through the Site's existing audio player.
4. **Event Map** view for common KFB events such as click, select, open, pickup, inspect, discover, step, jump, land, hit, attack, engine, machine, success and failure.
5. Default duplicate suppression with an explicit “show aliases” option.
6. Candidate decisions remain `KEEP / TUNE / REJECT`; no mass auto-approval.
7. Selected cues can later feed scene/mix audition against the existing voice-ducking and music-bed architecture.

No second AudioContext. No new runtime owner. No Cloudflare requirement for this Site iteration.

## QA

Tested implementation head before documentation-only handoff update:

`28ef0d5ad0e45f2ba32d17030542f94caa8cfd71`

GitHub Actions:

- run: `37185843367`
- job: `111387438944`
- validator: **45/45 PASS**
- existing Site browser QA: **14/14 PASS**
- artifact: `11296249195`
- digest: `sha256:0beeb50c4701a48ebd9921fcb2e5438d27f1001b7962ed1e6146cc00a8cd3199`

This QA proves the data snapshot and existing Site source remain coherent. It does **not** claim the new SFX Library UI has been built or published.

## Exactly one next gate

**KFB_AUDIO_SOURCE_INTAKE_01_SITE_UPDATE**

Extend the existing KFB Audio Site with a searchable/auditionable SFX Library + Event Map backed by this snapshot, then update the existing Site project and verify the exact Site URL. Do not create a second Site.
