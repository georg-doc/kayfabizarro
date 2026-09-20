# KFB Racer Engine Audio Pack · WSA Handoff

Status: **CURRENT REFERENCE · SOURCE READY · INTEGRATION OPEN**  
Date: 2026-09-20  
Owner: **KFB Stunt Car Race / WSA**  
Source repository: `georg-doc/kayfabizarro`  
Source folder: `media/3D_Assets/Audio/KFB Racer/`  
Receiving SSOT: `georg-doc/KFB-Stunt-Car-Race`  
Race main observed at handoff start: `9de75c733824720f913f3060be392859e9c5a260`

## Goal

Hand the new V8 and Steampunk sci-fi engine audio candidates to WSA without changing Race runtime ownership.

## Source truth

The KFB Racer folder contains **19 files** at handoff time:

- 5 WAV synthetic/reference masters;
- 14 Suno MP3 renders.

Exact file names, blob SHAs, sizes, roles and acceptance state are recorded in `ASSET_MANIFEST.json`.

The preferred V8 idle donor is:

`Seamless_10–12_secon_#1-1789884544910.mp3`

Georg explicitly said this first V8 idle render is very good. Preserve that as a human preference. Do not extend that acceptance automatically to every later render.

## Protected boundary

- Race remains owner of speed, acceleration, boost, drift, jump/landing, contact and physics.
- Audio reads telemetry only.
- Existing A6 input guard remains: Radio/Audio UI does not capture drive keys.
- Existing A1 history remains separate; this pack does not pretend to be the missing original A1 source.
- Existing RoadTrip/Jukebox remains separate music content.
- No new AudioContext owner is introduced.

## Proposed runtime grammar

### CAR_HEAVY_V8

- IDLE: preferred Suno V8 idle #1
- LOAD: one chosen 10 s load loop
- REV: one chosen big-block rev transient
- WIND: existing/future separate speed layer
- EVENTS: existing Race SFX grammar

### MECH_FUTURE

- IDLE: one chosen steampunk 12 s idle
- THROTTLE: one chosen steampunk pressure-build transient
- WIND / turbine air: separate future layer
- EVENTS: existing Race SFX grammar

## Done for this slice

- source folder recovered from GitHub;
- all 19 assets enumerated and pinned by blob SHA;
- roles/status documented;
- Suno prompts preserved;
- WSA integration boundary documented;
- Hub/router handoff prepared.

## Not done

- no Race runtime files changed;
- no browser integration test;
- no mix/ducking tuning;
- no per-vehicle profile selection;
- no public Stage publication for this pack;
- no claim that every candidate is human accepted.

## Existing target host

Future integration should use the existing Race audio/presentation owner and may be proved in the current BOX1/Environment host:

https://kayfabizarro.pages.dev/kfb-hub/stunt-race/track-environment-lab/?world=facility&seed=KFB-1842&audio=roadtrip-v2

The current URL does **not** contain this new engine pack yet.

## Exactly one next gate

**WSA: integrate only the preferred V8 idle #1 plus one V8 load candidate into the existing one-AudioContext Race graph, driven read-only by `speedNormalized` and acceleration; return a direct Cloudflare Stage audio-driving proof before adding rev/steampunk layers.**
