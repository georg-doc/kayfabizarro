# AUDIO-SEED-01 · TEST REPORT

## CURRENT OVERRIDE · HUMAN REPAIR r2 · 2026-10-02

**Current status:** r2 SOURCE/BROWSER PASS · r2 PUBLIC PENDING  
**Repair head:** `eddfd84c37bdb5faf4f222c992bc5cf89fec6604`  
**Current source head:** `02c74a72b1320a67f995f8f86c5d71089c2f1b90`  
**r2 publication write:** `cloudflare-live@34d1dc408719ebc77351a13e1ca6557b62c315ab`

Human v0.1 feedback:
- broad soundbed was promising;
- rain sounded like water/noise, not rain;
- high xylophone/cartoon-like chime became quickly fatiguing.

Repair r2:
- removes octave-bright overtone;
- lowers/softens motif register and gain;
- reduces G3 and secondary answer density;
- reduces continuous rain noise;
- adds deterministic stochastic stereo droplet/splash transients.

r2 branch QA:
- deterministic/source: **35/35 PASS**;
- Chromium/WebAudio: **35/35 PASS**;
- run/job: `37052602108 / 110989403830`;
- artifact: `11246418871`;
- digest: `sha256:51c1bf4204f35213559b3bcc2a64119aed154f177687146d31ab1f9edfe9be2d`.

Public r2 state:
- all six r2 Stage blobs match on `cloudflare-live@34d1dc4…`;
- Cloudflare Pages check `110990617688`: **IN_PROGRESS**;
- public proof `37053177990 / 110991313066`: **FAIL at Stage marker 4/4 while Pages pending**;
- artifact `11246834657`;
- digest `sha256:149fb1a5990172cf6cc4329e6f26cc37c79ffe11a41bec01192f2a0fef4fd105`;
- no behavioral r2 assertion failed because none ran after the stale marker.

The older v0.1 PUBLIC_VERIFIED evidence below remains historical. It must not be used to claim r2 is public.

**Exactly one next gate:** Cloudflare Pages SUCCESS → rerun unchanged exact public proof for `AUDIO-SEED-01-v0.2`. Only then ask Georg for `GEORG_AUDIO_SEED_RELISTEN_R2`.

**Date:** 2026-10-02  
**Status:** HISTORICAL v0.1 PUBLIC_VERIFIED · CURRENT r2 PUBLIC PENDING  
**Repo:** `georg-doc/kayfabizarro`  
**Branch:** `chatgpt-web/audio-seed-01-2026-10-02`  
**Draft PR:** #325  
**Tested head:** `b566e272493864dc9bb0cd27f8e2d7574be061d0`

## GitHub Actions

- Workflow: `AUDIO-SEED-01 branch QA`
- Push run: `37045038692`
- Job: `110964247965`
- Conclusion: **SUCCESS**
- Environment: Ubuntu 24.04 · Node 22.23.3 · Playwright 1.51.1 · Chromium 134

## Deterministic / source validation

**34 / 34 PASS**

Coverage includes:
- exact build marker;
- external generation disabled;
- 3 real current Deck JSON inputs;
- 56 / 56 cards for each FORGET / IGNORE / EMBRACE deck;
- exact recomputation of each 8D Travel `cardSemanticVector` baseline;
- deterministic identity repeated from the same seed;
- secondary grammar compatibility always > 0;
- 3–4-family foreground budget;
- deterministic 64-step structure fingerprints;
- non-empty event plans;
- ROAD tempo delta capped at 7 BPM;
- speed adds subdivision/density instead of continuously chasing BPM;
- all three deck identities are distinct.

### Proven identities

| Deck | Primary | Secondary | Families | Pitch | Identity | WORLD → ROAD |
|---|---|---|---|---|---|---|
| FORGET | G5 Modal Drone | G10 Negative Space | P10 / P1 / P4 / P12 | dorian | `858680da` | 72 → 79 BPM |
| IGNORE | G9 Electro-Funk | G1 Pocket Funk | P10 / P5 / P7 / P12 | dorian | `d0074ab4` | 100 → 107 BPM |
| EMBRACE | G3 Interlocking | G1 Pocket Funk | P1 / P4 / P10 / P12 | mixolydian | `058bdca1` | 82 → 89 BPM |

WORLD structure fingerprints:
- FORGET `e5c3bf13`
- IGNORE `5ce2ac10`
- EMBRACE `95066e65`

## Browser / WebAudio validation

**33 / 33 PASS**

The Chromium proof covers:
- exact Stage build marker and exported runtime;
- exactly three real Deck controls;
- one and only one AudioContext;
- AudioContext running after user gesture;
- procedural timeline advances;
- exact semantic baseline match in browser;
- compatible secondary grammar;
- same-seed restart reproduces the same 64-step structural fingerprint;
- same-seed restart preserves identity;
- all three Decks resolve to distinct identities;
- WORLD → ROAD preserves identity;
- ROAD tempo remains bounded while subdivision increases with speed;
- NIGHT / RAIN preserve identity;
- RAIN becomes an active ambience transform;
- PSYCHEDELIC / SHADOW preserve identity;
- psychedelic wet path and shadow transform become active;
- AUDIO-CAL-style voice focus ducks music;
- desktop viewport fits;
- mobile viewport fits and Deck controls stack;
- no page / console errors;
- no HTTP failures;
- **no external API/network dependency**.

## Proof artifact

- Artifact: `audio-seed-01-proof`
- Artifact ID: `11243804164`
- Size: 521,076 bytes
- Digest: `sha256:614a7b0311eaf75cb709f9bc4dbc65614f0b3c6deb3b56ea5ea96a2feef710a3`
- Contents: desktop screenshot, mobile screenshot, browser result JSON.

## PUBLIC VERIFIED · 2026-10-02

The unchanged green AUDIO-SEED-01 candidate is publicly verified on the required Cloudflare Stage route.

- exact Stage: `https://kayfabizarro.pages.dev/kfb-hub/stage/audio-seed-01/`
- publication: `cloudflare-live@62c7124faadbd27dd96b667465e93351fe5a6c8a`
- Cloudflare Pages: **SUCCESS**
- public-proof source head: `a9758734c7ec2d2311c88a2d313c293e02254f4c`
- public proof run: `37045888652`
- public proof job: `110967091484`
- public Chromium/WebAudio: **33 / 33 PASS on attempt 1**
- public artifact: `11244059091`
- public artifact size: 521,079 bytes
- public digest: `sha256:945f1ee23f8c60d969f40fb2943ffcf0480b59108b9ad943b11bc851979693c8`
- public screenshots: desktop + mobile inside the proof artifact
- external runtime/API requests: **0**

Public automation proves the deployed route carries the expected build and behavior. It does not prove musical taste, long-session fatigue or final instrument realism.

**Exactly one next gate:** `GEORG_AUDIO_SEED_LISTEN_01`.

## What this does not prove

Automated QA does not prove:
- that the three musical identities are pleasant or musically convincing;
- that the procedural voices yet sound sufficiently like the intended broad human instrument palette;
- that long-session fractal variation avoids fatigue;
- that ROAD feels sufficiently coupled to real Race telemetry;
- human acceptance of the publicly verified revision.

These remain later listening/integration gates.

## One next gate

`GEORG_AUDIO_SEED_LISTEN_01` — listen to FORGET / IGNORE / EMBRACE in WORLD and ROAD, then try Night / Rain / Psychedelic / Shadow. Judge pleasantness, distinctness and identity continuity. No merge or wider runtime integration before that decision.
