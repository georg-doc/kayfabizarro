# AUDIO-SEED-01 · TEST REPORT

**Date:** 2026-10-02  
**Status:** SOURCE / BROWSER / WEBAUDIO PASS · PUBLIC STAGE PENDING  
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

## What this does not prove

Automated QA does not prove:
- that the three musical identities are pleasant or musically convincing;
- that the procedural voices yet sound sufficiently like the intended broad human instrument palette;
- that long-session fractal variation avoids fatigue;
- that ROAD feels sufficiently coupled to real Race telemetry;
- that the public Cloudflare route serves this revision.

These remain later listening/integration gates.

## One next gate

Publish the unchanged green candidate to the KFB Cloudflare Stage route and publicly verify the exact revision:

`https://kayfabizarro.pages.dev/kfb-hub/stage/audio-seed-01/`

Only after PUBLIC_VERIFIED is a Georg listening/freeplay gate meaningful.
