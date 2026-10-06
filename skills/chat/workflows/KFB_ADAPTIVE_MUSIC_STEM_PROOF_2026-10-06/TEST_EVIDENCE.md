# TEST EVIDENCE · KFB Adaptive Music Stem Proof 01

Date: 2026-10-06
Tested branch head before evidence write: `6353eeaa1062d5269f2e2755a6178dbc9a9662a7`

## Source / contract tests

Exact branch blobs used locally:
- `music-clock.mjs` blob `0f77fe9a21e8b455ef79a122fbc4edeff2168616`
- `SOURCE.json` blob `0145fab56746177147a70e8deb38b830dc8ef896`
- `qa.mjs` blob `f3e4890dbc35f7a8efac6de9624bffe0a874744b`

Result: **18 / 18 PASS**.

Covered:
- schema + D/G proof deck identity;
- host AudioContext injection contract;
- injected mode creates zero new AudioContexts;
- G 120 BPM / D 94 BPM;
- 10 G stems + 10 D stems;
- unclassified Vocal labels muted by default;
- additive D Speech Focus;
- 120 BPM beat / bar / 8-bar phrase timing;
- NEXT_BEAT / NEXT_BAR / NEXT_PHRASE boundary math;
- transition policy vocabulary.

## GitHub source assets

Current `main` source verified through GitHub contents API:

G:
- master: **1 / 1 exists**
- stems: **10 / 10 exist**
- all 10 are non-empty MP3 files

D Base:
- master: **1 / 1 exists**
- stems: **10 / 10 exist**
- all 10 are non-empty MP3 files

Total exact source presence: **22 / 22 PASS**.

## Branch/source readback

Implementation branch read back after writes:
- `SOURCE.json` contains `INJECT_EXISTING_WHEN_AVAILABLE`;
- runtime source contains `configureHost`;
- branch head after host-injection repair: `6353eeaa1062d5269f2e2755a6178dbc9a9662a7`.

## Runtime evidence boundary

NOT RUN in this ChatGPT Web Chat executor:
- real browser WebAudio decode/playback;
- decoded stem duration delta;
- phase / long-loop drift;
- audible G Road/Wide/Epic transitions;
- audible D TTS Speech Focus;
- exact existing GPT Site update/verification.

Therefore:
- **sample-aligned = UNPROVEN**
- **audible adaptive mix = UNPROVEN**
- **Site updated = NO**

This is deliberate evidence hygiene, not a product-failure claim.
