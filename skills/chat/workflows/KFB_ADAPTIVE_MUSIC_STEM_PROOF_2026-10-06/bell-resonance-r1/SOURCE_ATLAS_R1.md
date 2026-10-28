# KFB Bell / Resonance · Source + Donor Atlas R1
Date: 2026-10-28 | Inventory: page metadata only, zero sounds imported/listened | All rights decisions are per individual object, not per host/domain.

## Recordings and archives
| Candidate | URL | Source / opportunity | Rights/readiness |
|---|---|---|---|
| WDR Glockenpforte | https://www1.wdr.de/dossiers/religion/christentum/glockenpforte | Decades of NRW church-bell sound recordings; WDR reports hundreds archived and MP3 downloads | Public audition/download ≠ permission to remix, publish in game or train; contact WDR |
| createsoundscape / Glocken-Wiki | https://www.evangelisch.de/inhalte/243785/05-06-2025/so-klingt-heimat-eine-glockenlandkarte-zum-mitmachen | Community map, 1000+ recordings described in June 2025 article | Per record and uploader rights check |
| Austrian Bell Archive | https://www.glockenarchiv.at/ueber-das-archiv | Dates, founders, dimensions, strike notes, inscriptions, audio/video, including lost/historical bells | Explicit reuse restricted to stated license or consent |
| William Hibbert Bell Recordings | https://www.hibberts.co.uk/ | Research corpus reported >13,400 recordings / 9 centuries and acoustic partial analysis | Great research reference; recording reuse permission not assumed |
| Central Council Church Bell Library | https://cccbr.org.uk/bellrecordings/audiochurch/B.php | UK/Irish church-bell recordings with per-item named recording authors | © attribution exists; permission required |
| John Taylor Bell Sounds | https://taylorbells.co.uk/bell-sounds/ | Professional bellfoundry sound examples | Audition/reference only pending permission |
| Wikimedia Commons NRW | https://commons.wikimedia.org/wiki/Category:Audio_files_of_church_bells_in_North_Rhine-Westphalia | Individual OGG/OGA field recordings | Check exact FILE page license, attribution, derivatives before use |
| Freesound 852491 | https://freesound.org/people/Sadiquecat/sounds/852491/ | 2026 Rouvenac France half-hour bell, mono WAV ~29s | Page declares CC0; download, source identification, audible quality and file license receipt PENDING |
| Freesound 850511 | https://freesound.org/people/Sadiquecat/sounds/850511/ | 2026 Rouvenac bell from inside church ~23s | Page declares CC0; PENDING actual audition/metadata |
| Freesound 827279 | https://freesound.org/people/Sadiquecat/sounds/827279/ | 2025 Quemigny-Poisot church bell ~24s high sample-rate | Page declares CC0; PENDING actual audition |
| Freesound 824720 | https://freesound.org/people/Sadiquecat/sounds/824720/ | 2025 Gergueil ~8 min real ambience + ringing | Page declares CC0; large FLAC, assess practical derivative |
| OpenAIR York | https://pure.york.ac.uk/portal/en/datasets/openairlib/ | University of York ambisonic/room impulse response JS+dataset donor | OpenAirLib listed CC BY; each IR/dataset/license separately checked |
| Local KFB Iceberg donor | travel/3D Conspiracy Iceberg Explorer/atmo-engine.js in georg-doc/kayfabizarro | Original procedural psychoacoustic donor already referenced in PR #455 | Source-inspected there, original sound NOT source-isolated/aurally auditioned; reuse current adapter only |

## Existing Dropbox evidence (read-only search; NOT necessarily resonant sound sources)
- /Mac/Documents/Codex/2026-10-10/kf/work/kayfabizarro-wsa-incomplete/media/3D_Assets/Audio/S050C-ArcadeShooter/DryStereo/PickupBells.wav ; matching WetStereo/PickupBells.wav. These are *arcade pickup bells*, NOT church-bell donors. File names found; waveforms and licenses not inspected.
- /CLAUDE/KFB_HUB/40_AUDIO/elevenlabs_r1/chatter_families_r3_orakel_lufs/F19_klangschale_neutral.m4a and other F19_klangschale_* clips. Search result names likely refer to voice/persona content, NOT proof of actual singing-bowl recording. Audition required before any categorization.
- /CLAUDE/KFB_HUB/30_DECISIONS/replies/RESEARCH_BINAURAL_SHEPARD_SPATIAL_R1.md appears as existing research; exact content unreviewed in this slice.
No Dropbox file was copied, altered or imported; Dropbox retains asset truth.

## Source-onboarding minimum
For each binary candidate: canonical URL + original author + object title + file-ID + exact CC/permission screenshot/text + captured date + recorded site/date + isolated solo playback + checksum + format/sample rate/channels + measured partials/quality + credit obligations + approval status. Label RESEARCH_LEAD → RIGHTS_VERIFIED → SOURCE_ISOLATED → AUDIBLY_REVIEWED → ADOPTED. Do not skip gates.

## Technology donors
- Native Web Audio 1.1: https://www.w3.org/TR/webaudio/ — use existing context and bus, HRTF PannerNode, ConvolverNode, analyser; best MVP path.
- JSAmbisonics: https://github.com/polarch/jsambisonics — BSD-3-Clause source, HOA possibility, requires device/browser test.
- Omnitone: https://github.com/GoogleChrome/omnitone — ambisonic decode, inspect maintenance/compatibility before adoption.
- OpenAIR library: https://pure.york.ac.uk/portal/en/datasets/openairlib/ — measured convolution environments.
- Heritage bell modal synthesis: https://www.nature.com/articles/s40494-021-00620-2 — research on physical modes and resynthesis, not ready-to-drop JS library.
- Bowl acoustics: https://doi.org/10.1088/0951-7715/24/8/r01 — real acoustic/visual mechanism donor.
- ElevenLabs SFX: https://elevenlabs.io/docs/overview/capabilities/sound-effects — candidate fictional foley.
- Suno rights: https://help.suno.com/en/articles/9601665 — generated music rights must track actual subscription/time and creation provenance.

## Suggested first authentic source-isolation set
1. One Freesound CC0 isolated short outdoor bell (852491), **license + recording receipt first**.
2. A contrasting indoor bell (850511) to reveal room reverberation, **rights + solo audition**.
3. A KFB owned procedural/modal synth or existing ICEBERG palette, isolated separately.
Comparative measurements: dry peak/long-term loudness, FFT/modal identification, envelope 0–30s, repeated warble, headphone/speaker localization, absence of clipping, mono fold-down and perceptual appropriateness. Never report a technical/source PASS based on URLs alone.

## Rights, source and claims traps
A historical bell may be public-domain physical heritage while its RECENT AUDIO RECORDING is copyrighted. WDR downloads, YouTube, CCCBR and archive playback links are not automatic production licenses. Wikimedia categories have mixed per-file licenses. Freesound CC0 page declarations are leads requiring exact local record check. Neither sound synthesis nor generative restoration should be represented as the actual lost bell without reconstruction marking. Metadata in private Dropbox is not public distribution permission.
