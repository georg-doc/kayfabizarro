# KFB Audio & Soundscape Baseline v1 · RECOVERY

**Status:** RECOVERABLE AUDIT BASELINE · DOCUMENTATION BRANCH · NO RUNTIME PROMOTION  
**Date:** 2026-09-24  
**Repo:** `georg-doc/kayfabizarro`  
**Branch:** `web/kfb-audio-soundscape-baseline-2026-09-24`  
**Draft PR:** `#205` — https://github.com/georg-doc/kayfabizarro/pull/205

## Resume order

1. `skills/chat/START_HERE.md`
2. `skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`
3. `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`
4. `skills/chat/workflows/KFB_AUDIO_SOUNDSCAPE_BASELINE_V1_2026-09-24/START_HERE.md`
5. `INVENTORY_AND_ARCHITECTURE.md`
6. this file
7. `RETURN.md`
8. re-read the exact runtime owner before any implementation.

GitHub state wins if any ref below advances.

## Source refs observed during audit

- `georg-doc/kayfabizarro/main` base: `9431dcb8da0158a75d0988d52fc1e7a49aac21f1`
- `georg-doc/KFB-Stunt-Car-Race/main`: `3ef3ebec6975736edb6ec8d5dabebc4ee5b51402`
- `georg-doc/KFB-Travel-Globe/main`: `8614282aab2ced43bb5dda9fcf7abadf9768100a`
- `georg-doc/KFB-Combat-Arena/main`: `f6a59ad15b9ffcf3164b0ab013f223962b63f61f`

These are audit pins, not immutable future integration pins.

## What is established

### Shared pool

A fresh recursive Git-tree audit sees:

- **1718 blob/file records** under `media/3D_Assets/Audio/`;
- **48 blob/file records** under `media/3D_Assets/Sounds/`.

These totals include docs/previews/manifests and are not “1718 usable production sounds”.

Legacy audited README count remains 1006 usable sounds for its 2026-09-02 set.

### Manifest verification run

JSON parse:

- `Audio/sfx.json`: PASS
- `Audio/ui-sfx.json`: PASS
- `Sounds/jukebox.json`: PASS
- `CATALOG/audio-catalog.json`: PASS

**4 / 4 JSON parse PASS**

Exact current-tree path check:

- `Audio/sfx.json`: **13 / 13 asset paths exist**
- `Audio/ui-sfx.json`: **0 / 16 asset paths exist as written**
- `Sounds/jukebox.json`: **10 / 10 track paths exist**

The UI failure is systematic: the manifest omits the real `/Audio/` segment inside `kenney_interface-sounds`.

Do not call `ui-sfx.json` wire-ready until repaired and rechecked.

## Runtime donor state

### Travel

Current implementation contains:

- one AudioContext lifecycle;
- Jukebox;
- sample-first SFX;
- drone/wind/gust/rumble;
- reverb/FX;
- browser SpeechSynthesis narrator;
- voice activity → audio ducking.

This is the primary general soundscape/mix donor. It is not transferred into another repo wholesale without a consumer adapter.

### Race

Keep these distinctions:

- A6 Race source: **139/139 PASS** at tested source `d459bfea5270e5c7bd5a0916b82b799362c771d5`;
- RoadTrip v2 has positive human listening history;
- A4 Runner/Shepard direction has positive later WSA record;
- A2 sustained synthetic friction: HUMAN REJECTED;
- A3 palettes/pattern engine: HUMAN REJECTED;
- A3 Psychedelic Scratch: HUMAN REJECTED;
- original accepted Audio A1 source package: STILL MISSING.

Public A6 proof run `35417759627` is **completed FAILURE** on attempt 2, again at the deployed-source marker. Browser-driving/audio checks did not execute. Do not convert source PASS into public PASS.

### Combat

Semantic/vendored architecture exists and is useful:

- cue ids;
- bus/priority/debounce/polyphony;
- distance attenuation;
- ducking;
- source mapping.

The audible curation may change; do not throw away the architecture.

### Boxel

Audio feedback POC evidence: **8/8 browser PASS** at `1adbdba8c17b7ef4f1f987197b483ab064c4282d`. Human KFB-wide sound-vocabulary gate remains open.

## Game Development Studio

Current environment check:

`game-dev: command not found`

Status to preserve:

`GAME_DEV_CLI_UNAVAILABLE · OPTIONAL FALLBACK USED`

No sealed Game Development Studio bundle is required for this documentation/inventory slice.

## No changes made to

- audio binaries;
- Race runtime;
- Travel runtime;
- Combat runtime;
- Boxel runtime;
- physics/gameplay/input owners;
- public Cloudflare runtime.

## Planned next gate

`AUDIO-CAL-01 · KFB Audio Calibration Stage`

Target route:

`https://kayfabizarro.pages.dev/kfb-hub/stage/audio-calibration/`

At this Recovery checkpoint that route is **PLANNED ONLY**. It must not be called live/public-tested until created, linked from Hub, deployed and opened at the exact Cloudflare URL.

## P0 before AUDIO-CAL-01 listening

1. fix `ui-sfx.json` exact paths and add a path test;
2. refresh/extend the existing audio catalog instead of creating a second registry;
3. classify current assets into shared semantic roles;
4. preserve exact Race A1 source if/when found; do not reconstruct;
5. select a minimal calibration reference set;
6. acquire missing tyre/friction + rain/thunder/crowd/urban sources only if the current shared + Travel-local pool cannot satisfy the stage.

## Failure recovery

If the next implementation gate fails twice on the same issue:

- stop;
- preserve the candidate;
- write exact failure evidence;
- update this Recovery + Return + additive changelog;
- do not replace the existing audio owners as a repair shortcut.
