# KFB Atmosphere · source and licence register · V-458

Checked 2026-10-18. `licence-register.json` records every source URL, author, original SHA256, derivative SHA256, duration and exact extraction window. No paid generation. SOURCE_VERIFIED is not HUMAN_ACCEPTED.

## Own stock first

- Chequered Ink: existing `Environment/ambient_wind.wav` and `water_babbling_loop.wav`, pinned main c746a9567e0ea20a24b8969fe9130ac0756e7a7e. Both byte-identical to the publisher-linked 400 Sounds archive. Publisher https://ci.itch.io/400-sounds-pack permits commercial game incorporation; optional credit, not CC0, no repackaging unchanged as an asset collection. Archive SHA256: `6824581dd5ed3f5162e85090b11155562759291b72fc5f6cc92bed67e7025e24`. Our normalized excerpts are game-runtime components, not an asset-pack offer.
- Two repo ElevenLabs rain sources are quarantined: creation-plan/commercial-rights receipt not available here. They are NOT copied into the release. Supplying that receipt can reopen admission; no key is required.

## CC0 additions · primary licence pages

- [Thimras · Park ambiences](https://opengameart.org/content/park-ambiences): bird, wind and river field recordings; different source windows, not independent recording sessions. Meadow and forest share this donor — fir-specific recording remains open.
- [isaiah658 · Ambient Bird Sounds](https://opengameart.org/content/ambient-bird-sounds): recorded bird phrases.
- [syncopika · Bird chirping sounds](https://opengameart.org/content/bird-chirping-sounds): three excerpts, no invented species labels.
- [Wolfgang_ / Ted Kerr · Crickets](https://opengameart.org/content/crickets-ambient-noise-loopable): short cricket texture excerpts, not isolated named species.
- [Traviow · Frogs at Night distant](https://freesound.org/people/Traviow/sounds/687211/): pond bed and frog phrases.
- [seventhsamurai · Jungle](https://freesound.org/people/seventhsamurai/sounds/644886/): morning recording; two overlapping excerpts. Authentic jungle-night bed and handling-noise listening review remain open.
- [jasinski / qubodup · Beach Ocean Waves](https://opengameart.org/content/beach-ocean-waves): four distinct waves.
- [Ylmir · Rain loopable](https://opengameart.org/content/rain-loopable): four rain recordings. Light/heavy are a mixing interpretation, not measured rainfall rates.
- [denalwa · Thunder](https://freesound.org/people/denalwa/sounds/472480/): one rain/thunder recording, cropped at the first substantial envelope; dry thunder alternatives remain open.
- [A.Deathy · Waterfall](https://freesound.org/people/A.Deathy/sounds/44880/): short waterfall source.

Freesound files here are the openly served **HQ MP3 previews**, not the original WAV/FLAC downloads. The same source-page CC0 dedication applies; no login wall was bypassed. Original-quality replacement is optional later. No species, geography or realism claim beyond the source author’s description.

## Excluded

Tiny Skies audio: reference only, unclear licence. Jukebox ambient beds remain music. BBC, NC/ND and unclear remixes excluded. No Sonniss bundle downloaded. No ElevenLabs API calls or credits.

## Preparation and levels

Repository-native `scripts/prepare-ambience.mjs`: 45 Hz high-pass, −26 LUFS target (thunder −20 LUFS), true-peak target ≤−9 dBTP, 40 ms attack / 120 ms tail, stereo 32 kHz Ogg. Targets are not final mixed loudness measurements. Runtime adds quiet layer gains and existing semantic-bus levels. Event pitch ±3%; no immediate same-file repeat; shifted Poisson minimum gap 5 s. Long beds are real 40–60 s excerpts, not short clips padded into beds.

The three-minute non-repetitiveness gate is **OPEN for Georg’s ear**. Randomization is not a claim of perceptual uniqueness.
