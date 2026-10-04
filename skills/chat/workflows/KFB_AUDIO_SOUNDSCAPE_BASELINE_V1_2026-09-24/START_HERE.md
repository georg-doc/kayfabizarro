# KFB Audio & Soundscape Baseline v1 · START HERE

**Status:** CURRENT REFERENCE · AUDIO-CAL-01 HUMAN_ACCEPTED  
**Date:** 2026-09-24  
**Owner:** existing WSA / KFB integration lead  
**Executing lane:** Fresh Web + GitHub, GPT-5.6 Sol, Medium/High reasoning  
**Branch:** `web/kfb-audio-soundscape-baseline-2026-09-24`  
**Repository:** `georg-doc/kayfabizarro`  
**Outcome:** one recoverable inventory + shared audio contract proposal + bounded next Stage gate  
**Runtime promotion:** NONE in this slice

GitHub state overrides this document whenever a named source ref advances.


## HUMAN LISTENING RESULT · PASS

Georg reviewed AUDIO-CAL-01 on 2026-09-24 and reported: **“klingt sehr gut soweit. passt.”**

Decision:
- `HUMAN_ACCEPTED = YES` for the calibration baseline;
- this accepts the current mix/ducking direction as a reusable reference, not every individual source asset as final library canon;
- broader source-bank gaps (crowd/weather/traffic/friction/voice-profile metadata) remain curation follow-ups;
- no automatic Race/Combat/Town integration or PR merge follows from this acceptance.

## CURRENT OVERRIDE · AUDIO-CAL-01 PUBLIC_VERIFIED

The baseline audit has advanced through its bounded calibration gate.

- exact human route: `https://kayfabizarro.pages.dev/kfb-hub/stage/audio-calibration/`
- publication: `cloudflare-live@a8e2af8f79f33b51f638222f203a28f3e1c15b23`
- Cloudflare Pages check `107727186186`: **SUCCESS**
- source/browser CI: **6/6 groups PASS · 31/31 PASS**
- exact public Cloudflare proof: workflow `36025670884` attempt 3 / job `107731456493` → **31/31 PASS**
- public proof artifact: `10819978496`
- public proof digest: `sha256:49ef9b156efadaced6d257f8768ba553a780a443a6bd13666014781e7a2fd3c2`

Attempts 1–2 ended before the Cloudflare deployment completed; they are retained as publication-timing evidence, not candidate defects.

**One next gate:** Georg human-listens to the three calibration states and judges voice intelligibility, duck amount, event readability and whether the ambience/music still feels alive. Do not integrate broadly into Race/Combat/Town before that listening decision.

## Why this slice exists

KFB already contains much more audio than the current games expose. The problem is not primarily a lack of files. The current problem is fragmentation:

- a large shared SFX library exists in `media/3D_Assets/Audio/`;
- authored KFB music / Suno / RoadTrip material exists in `media/3D_Assets/Sounds/`;
- Travel already owns a mature Jukebox + drone + wind + rumble + SFX + narrator-ducking implementation;
- Race has working music/SFX integration plus accepted music direction, but sustained friction experiments were rejected and the original accepted A1 source package is still missing;
- Combat has a semantic cue manifest, local vendoring/provenance, polyphony and ducking logic, but its current sound choices are not yet a shared KFB sound identity;
- Boxel Blitz has a technically proven pickup/power/cascade vocabulary;
- no current cross-KFB calibration stage measures how voice, diegetic music, weather/ambience, vehicle/combat SFX and silence coexist.

Do not respond by creating a universal replacement audio engine.

## Read first

1. `skills/chat/START_HERE.md`
2. `skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`
3. `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`
4. this file
5. `INVENTORY_AND_ARCHITECTURE.md`
6. `RECOVERY.md`
7. `RETURN.md`

Then read the runtime-owner source you are actually changing.

## Named source owners / protected boundaries

### Shared asset source

`georg-doc/kayfabizarro/media/3D_Assets/Audio/` and `media/3D_Assets/Sounds/` remain the shared source pool. The existing asset catalog is extended/refreshed; do not create a second asset registry.

### Travel / world soundscape donor

Implementation SSOT: `georg-doc/KFB-Travel-Globe`.

Current owner modules verified on main:

- `travel/globe-v13/travel-audio.js`
- `travel/globe-v13/audio-switch.js`
- `travel/globe-v13/tiny-audio.js`
- `travel/globe-v13/narrator.js`
- `travel/globe-v13/frizzlebob-voice.js`

Travel already proves one AudioContext lifecycle, Jukebox, sample-first SFX with synthetic fallback, mood drone, wind/gust/rumble, shared reverb, browser TTS and voice-activity ducking.

### Race donor

Implementation SSOT: `georg-doc/KFB-Stunt-Car-Race`.

Race owns movement/contact/physics/telemetry. Audio reads those signals only. Preserve the accepted v0.8 driving baseline.

Current useful donors:

- BOX1 radio / telemetry-SFX integration;
- `ChatGPT_web/race-audio-runner-lab/` for authored Runner + Shepard direction;
- A2 transient sample accents only; **do not reuse the rejected sustained oscillator friction voices**;
- A3 Motion Bed only as an optional donor; generated palette/pattern system and Psychedelic Scratch remain rejected.

Original Audio A1 sonic direction is human accepted, but its exact 20-file source package is still missing. Do not reconstruct it from prose.

### Combat donor

Implementation SSOT: `georg-doc/KFB-Combat-Arena`.

Useful existing system:

- semantic cue names;
- player/enemy/world/ui buses;
- priority and debounce;
- polyphony cap;
- distance attenuation;
- local vendoring and `AUDIO-SOURCES-v4.json` provenance;
- per-event ducking.

Do not copy Combat gameplay truth into a shared audio layer.

### Boxel Blitz donor

`KFB Boxel Blitz/audio-feedback-poc/` is a presentation/audio donor only.

Technically proven vocabulary:
pickup, power-up, power-down, checkpoint ladder 1–10, cascade ladder 1–10.

Do not move Boxel physics/progression ownership into audio.

## Shared contract direction

The cross-KFB layer should be a **semantic contract + calibration recipe**, not a second runtime.

Every consumer keeps its own current owner and maps to a small shared role vocabulary:

`VOICE | UI | PLAYER_CRITICAL | WORLD_SFX | DIEGETIC_MUSIC | SCORE | LOCAL_AMBIENCE | GLOBAL_BED`

Key invariants:

- one active AudioContext per host/runtime;
- user-gesture start and safe suspend/resume;
- voice activity ducks music/ambience but does not pause their timelines;
- critical gameplay SFX stay readable during speech;
- spatial sources remain spatial; UI and addressed narrator remain non-spatial unless deliberately staged;
- silence is a valid world state;
- no audio component writes gameplay truth;
- asset paths are exact and provenance-bearing;
- human listening acceptance is separate from static/browser execution.

## Immediate defects already found

1. `media/3D_Assets/Audio/ui-sfx.json` points at `kenney_interface-sounds/<file>.ogg`; the actual files live under `kenney_interface-sounds/Audio/<file>.ogg`. Treat the UI manifest as not wire-ready until fixed and tested.
2. Global `sfx.json` still labels jump/boost as placeholder laser choices and gutter-fall as needing a real splash.
3. Dedicated sustained tyre/skid/friction source coverage is insufficient for the Race requirement; A2's synthetic replacement was human rejected.
4. The existing generated audio catalog is stale (2026-08-04) and predates later Racer/RoadTrip additions.
5. Shared character voice profiles / fallback policy are not yet formalized even though Travel has a working FrizzleBob browser-TTS donor.
6. Weather/crowd/urban ambience coverage is incomplete in the central pool: wind/water/applause exist; a verified rain+thunder bank, crowd loop and city/traffic bed are not currently established as shared assets.

## Next gate

### AUDIO-CAL-01 · KFB Audio Calibration Stage

**Executor:** Fresh Web / GitHub  
**Model:** GPT-5.6 Sol High  
**Work/WSA escalation:** only if a real multi-repo write or browser capability is missing  
**Claude Design:** not required for audio architecture; optional later for a visual mixer surface only  
**Game Development Studio:** optional; CLI unavailable in the current chat environment, so repository-native checks are the allowed fallback.

Planned direct route:

`https://kayfabizarro.pages.dev/kfb-hub/stage/audio-calibration/`

**Current state of that route:** PLANNED / NOT CREATED / NOT PUBLIC-VERIFIED.

Build one source-preserving calibration page with three states:

1. `golden-hour-town`
2. `graveyard-night`
3. `ring-performance`

Use the same reference set in all three:

- FrizzleBob or another addressed browser-TTS voice;
- one diegetic music source (Orc band/radio class);
- global bed + local ambience;
- one vehicle/motion source;
- one contact/impact;
- one Boxel-style feedback cue;
- one weather/event accent.

The purpose is to calibrate priority, ducking, spatiality and transitions — not to build a DAW or remaster every file.

## Existing evidence routes

Race RoadTrip/BOX1 route:

`https://kayfabizarro.pages.dev/kfb-hub/stunt-race/track-environment-lab/?world=facility&seed=KFB-1842&audio=roadtrip-v2`

Source-side A6 testing is green at 139/139. The dedicated public A6 proof run `35417759627`, attempts 1 and 2, failed at the deployed-source marker before browser checks; therefore PUBLIC A6 PASS is **not** claimed.

Boxel audio-feedback Stage pointer:

`https://kayfabizarro.pages.dev/kfb-hub/stage/boxel-audio-feedback-poc/`

Historical technical browser evidence: 8/8 PASS at `1adbdba8c17b7ef4f1f987197b483ab064c4282d`. Human audio/VFX review remains open.

## Stop condition

Do not implement AUDIO-CAL-01 in this baseline slice. This slice closes when the audit, architecture, Recovery/Return, additive changelog and KFB Hub/router pointers are persisted on the branch and handed to WSA.
