# TEST EVIDENCE · KFB Adaptive Music Stem Proof 01

Date: 2026-10-06
Status: **SITE_GREEN_TECHNICAL · HUMAN_LISTENING_GATE**
GitHub integration checkpoint read back: `1e78f218639347316c4b5716927c33b1e3a13a1e`

## Preserved prior evidence

- manifest / MusicClock / host contract: **18 / 18 PASS**
- exact real GitHub source assets: **22 / 22 PASS**
  - G master 1/1 + G stems 10/10
  - D Base master 1/1 + D stems 10/10

## Current Site source validation

Command: bundled Node runtime against the managed Site source.

Result: **75 / 75 PASS**.

Covered:
- 54 catalog tracks / 44 RoadTrip v2 / 14 catalog stem families;
- B/C/D state contract and six transition pairs;
- generic B/C/D stem slots remain `FUTURE_NOT_AVAILABLE` with no placeholder audio;
- 12 B/C/D Prompt Studio entries;
- exactly two admitted proof families, G and D, with 10 real stems each;
- G 120 BPM + ROAD/WIDE/EPIC;
- D 94 BPM + additive Speech Focus;
- all unclassified Vocal/Other defaults are zero;
- adaptive module contains no AudioContext constructor;
- existing Site injects the existing AudioContext and `SCORE` destination;
- shared shortest decoded duration is used as one loop end;
- no interval-based second music clock.

## Browser checks

Result: **30 / 30 PASS**, **0 console errors**.

Existing screens:
- Catalog: 54 tracks retained;
- navigation retained: Catalog / Mix / Soundscape / Intake / Prompt Studio / Brief;
- Prompt Studio D donor resolves to `KFB Conversation Style D`;
- Soundscape still exposes Rain as `SOURCE_REQUIRED`;
- B → C → D demo ends in D with TTS released;
- Catalog, Mix and Soundscape BEFORE/AFTER captures retained.

Host/runtime:
- `hostMode = INJECTED_EXISTING_CONTEXT`;
- Site-created AudioContexts: **1**;
- adaptive-module-created AudioContexts: **0**;
- starting stems pauses master players; starting a master stops the stem deck;
- G ↔ D uses a short gain crossfade;
- no page/network error caused by the integration.

## Real decoded measurements

| Family | Stems | BPM | Decoded format | Min duration | Max duration | Delta | Shared loop end |
|---|---:|---:|---|---:|---:|---:|---:|
| G · Cosmic Roadtrip | 10 | 120 | 44,100 Hz · stereo | 179.879977 s | 179.879977 s | 0.00 ms | 179.879977 s |
| D · Conversation Base | 10 | 94 | 44,100 Hz · stereo | 179.519977 s | 179.519977 s | 0.00 ms | 179.519977 s |

The four separately downloaded unclassified source-label MP3s report 48,000 Hz stereo via `afinfo`; WebAudio decodes/resamples active buffers to the existing 44,100 Hz host context.

## Transition / continuity evidence

G sequence tested in the existing Mix:
- ROAD → WIDE → EPIC;
- MusicClock epoch remained exactly `124.74344671201814` through all three presets;
- source nodes were not restarted;
- gains reached the declared presets at the configured next-bar boundary;
- muted `Lead Vocals` and `Other` remained at zero-equivalent gain throughout.

D Speech Focus tested with the existing TTS control:
- D state selected automatically when the D proof deck starts;
- existing SCORE-bus ducking remained owner;
- D added the declared 2.2 kHz EQ pocket and per-role restraint;
- Drums 0.34 → 0.2108, Percussion 0.24 → 0.12, Brass 0.16 → 0.072, Guitar 0.34 → 0.2448;
- clock elapsed increased while TTS was active;
- open D gains restored at the next safe bar boundary without restart.

Long-play check:
- observed D for **403.452472 seconds**;
- crossed **2 complete loop boundaries**;
- no runtime error;
- one shared `loopEnd` plus 0 ms decoded family delta prevents accumulated inter-stem loop drift.

## Source-label classification

These Suno labels remain deliberately disabled:

- G `Lead Vocals` → `MUTED_PENDING_HUMAN_LISTEN`;
- G `Other` → `MUTED_PENDING_HUMAN_LISTEN`;
- D `Lead Vocals` → `MUTED_PENDING_HUMAN_LISTEN`;
- D `Backing Vocals` → `MUTED_PENDING_HUMAN_LISTEN`.

No semantic truth was inferred from the splitter names. They are not enabled by any default or G preset. Audible content classification remains the named human listening gate.

## Published Site evidence

- project: `appgprj_6ac1c73dc28881919123106bd6d3e90e`
- final source commit: `fd9d8cd7f85289d8d3a1fc7bd11dd7298bbc63bc`
- version: **5**
- version id: `appgprj_6ac1c73dc28881919123106bd6d3e90e~appgver_2f797958900c8191b0683a08c761c531`
- deployment: `appgdep_6ac4624c87a4819182bea35b9dd08301`
- deployment status: **succeeded**
- exact URL: `https://kfb-audio.frizzlebob.chatgpt.site`
- exact authorized GET: **HTTP 200**
- exact deployed index: `SITE SOURCE 0.3`, runtime query `audio-site.js?v=0.3.1`
- exact index SHA-256: `43b193d141203fef55c1793d3302acee20bf12add8055bae6826b66f75491c84`
- Sites-generated version-5 screenshot visibly shows `SITE SOURCE 0.3`, preserved Catalog design and unchanged counts.

The normal in-app-browser route stops at the intentional owner login boundary. No authentication barrier was bypassed. Exact deployed bytes were verified with the Site's existing authorized bearer; interactive behavior was exercised against the identical final managed source commit.

No sample-level phase-coherence or subjective audible-quality claim is made beyond the measured duration/timeline evidence.
