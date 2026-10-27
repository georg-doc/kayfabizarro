# KFB Atmosphere · source and licence register · V-458

Checked 2026-10-18, updated for Hub b116. All **36 files in this new Atmosphere set are CC0**; canonical delivery `media/3D_Assets/Audio/KFB_Ambience_CC0_r1/` includes `LICENCES.json`. `licence-register.json` records source URL, author, original SHA256, derivative SHA256, duration and extraction window. No paid generation. SOURCE_VERIFIED is not HUMAN_ACCEPTED.

## Own stock first

- Chequered Ink: inspected existing `Environment/ambient_wind.wav` and `water_babbling_loop.wav`, pinned main c746a9567e0ea20a24b8969fe9130ac0756e7a7e. Both byte-identical to the publisher-linked 400 Sounds archive (archive SHA256 `6824581dd5ed3f5162e85090b11155562759291b72fc5f6cc92bed67e7025e24`). Custom commercial-use licence, NOT CC0. After Hub b116 these are **manifest-only / not shipped in this set**, and their two normalized excerpts have been removed from the new branch tip and Site 0.8.1. Georg's Dropbox path is not known and has not been invented. Existing older repo/footstep stock is outside this delivery and was not rewritten.
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


## Freesound CC0 (Georg 26.10.2026, Nature Orchestra)
- forest-birds-axelfors by forestfjord (CC0) – https://freesound.org/people/forestfjord/sounds/816088/ → forest-3
- forest-birds-skephult-part-1 by forestfjord (CC0) – https://freesound.org/people/forestfjord/sounds/816111/ → forest-4
- morning-forest-with-birds by RyanKingArt (CC0) – https://freesound.org/people/RyanKingArt/sounds/844605/ → meadow-3
- forest-birds-ambient-seamless-loop by Magnesus (CC0) – https://freesound.org/people/Magnesus/sounds/723913/ → meadow-4
- crickets-at-night-clean-sound by Defelozedd94 (CC0) – https://freesound.org/people/Defelozedd94/sounds/522298/ → crickets-night-1

- frogs-at-night by eqko (CC0) – https://freesound.org/people/eqko/sounds/645958/ → pond-3
- southern-summer-evening-ambience-with-crickets-4 by RyanKingArt (CC0) – https://freesound.org/people/RyanKingArt/sounds/746365/ → crickets-night-2
- ocean-waves by Noted451 (CC0) – https://freesound.org/people/Noted451/sounds/531015/ → ocean-1
- rushing-stream-river-water by RyanKingArt (CC0) – https://freesound.org/people/RyanKingArt/sounds/726522/ → river-2
- rain-and-thunder-copenhagen-evening by mechamantra (CC0) – https://freesound.org/people/mechamantra/sounds/316617/ → rain-5
- wind-thru-trees-or-strong-rain-02 by ListenTonyBoy (CC0) – https://freesound.org/people/ListenTonyBoy/sounds/325090/ → wind-3
- rumblings-of-thunder by C-V (CC0) – https://freesound.org/people/C-V/sounds/830372/ → thunder-2
