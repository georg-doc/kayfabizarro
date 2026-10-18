# WSA · V-458 Environment atmosphere · RETURN · 2026-10-18

Status: IMPLEMENTED / SAME PRIVATE SITE VERIFIED / HUMAN EAR GATE OPEN. R1 is not HUMAN_ACCEPTED. Latest Hub b116 storage and follow-up order applied.

## Exact owner / revisions

- Repo `georg-doc/kayfabizarro`; branch `audio/kfb-ambience-v1-v458-2026-10-18`; Draft PR [#420](https://github.com/georg-doc/kayfabizarro/pull/420), stacked on the unchanged PR #413 Audio branch at `737a14f4841438ab8a572f3d984cd70ee921c9e5`.
- Implementation checkpoint `72e0f893585e22054fcbc986db7400128ed7df38`; exact final code/evidence head `c65cb5b594e8b232533454af5fd821273e782078`. Containing Return commit is documentation-only; exact final ref is read back and reported in PR/chat.
- Same project `appgprj_6ac1c73dc28881919123106bd6d3e90e`, saved **version 18**, visible **source 0.8.1**.
- Exact native managed source `33c70dc8e9c1c3b78d3c53e26d78d024d60d033f` (separate from GitHub delivery SHA).
- Saved version ID `appgprj_6ac1c73dc28881919123106bd6d3e90e~appgver_f52cde5389f88191bb9df1ae92668313`.
- Deployment `appgdep_6ad436c898848191850a72f3fa8c0e7f`: succeeded. Exact acceptance [Audio → Atmosphäre](https://kfb-audio.frizzlebob.chatgpt.site/#atmosphere), authenticated Chrome refreshed and used. No new Site, owner-private audience unchanged.

## Delivered

One DOM-free `dist/ambience/kfb-ambience.v1.mjs`, injected context and existing GLOBAL_BED / LOCAL_AMBIENCE destinations; host-driven tick, no timers, context or MusicClock creation. Existing Catalog/Mix/Voice/Soundscape/Intake/Prompt Studio/Brief and accepted footstep geometry/Wood default preserved.

Five biome presets with morning/day/evening/night, real 40–60 s bed excerpts (two source windows, not independent sessions), Poisson fauna phrases, light/heavy rain crossfade, distance/343 thunder, shared audio/visual wind envelope and positional water. Snow dampens ambience and requests the existing Audio owner's 4.2 kHz master filter; Stop restores 20 kHz. Browser-native TTS cannot be filtered through Web Audio.

Studio includes compact selector controls, optional real D music, existing speech-focus test (not a second voice generator), flash/distance fixture, Stop and source/consumer links. All demo media left STOPPED.

## Sources / b116 storage

**36 new shipped files, all CC0**, from 15 downloaded source files/archives. Canonical set `media/3D_Assets/Audio/KFB_Ambience_CC0_r1/` plus `LICENCES.json` (file/source/licence/SHA256); Site bundles the same verified bytes. Full authors, primary licence pages, original hashes and derivative windows in `dist/ambience/licence-register.json` and `LICENCES.md`. Sources: Thimras park birds/wind/river; isaiah658 and syncopika birds; Wolfgang_/Ted Kerr crickets; Traviow frogs; seventhsamurai jungle; jasinski/qubodup waves; Ylmir rain; denalwa thunder; A.Deathy waterfall. Freesound donors use openly served HQ MP3 previews, not authenticated original WAVs.

Two inspected Chequered Ink stock files are manifest-only after b116. Their two normalized excerpts were removed from the new branch tip and v18. Earlier implementation history contained those **processed excerpts** before b116 arrived; no raw originals were newly uploaded by this slice, and shared Git history/inherited footstep stock was not destructively rewritten. Dropbox root is specified by WS0 as `KFB_HUB/40_AUDIO/…`; exact private file locations are not known and are not invented. Two existing ElevenLabs rain files remain quarantined pending plan-at-creation rights receipts. No Sonniss download, NC/ND, BBC or Tiny Skies audio shipping. No paid API calls.

## Parameters / tests / proof

- Quiet source target −26 LUFS; thunder −20 LUFS; pre-encode TP target −9 dBTP. Measured decoded maximum sample peak −7.848 dBFS (codec overshoot; not true-peak certification), no clipping. Bed gain .40, fauna .65, rain .50, wind .45 × shared gust value, water .50, before existing semantic-bus attenuation. Relative vehicle/footstep loudness remains an ear gate.
- Total ambience duck −5 dB under audible music/soundbed or existing voice focus. Existing C voice bus −4.25 dB receives only −.75 dB extra; D host −5 dB receives zero extra. Attack .18 s / release 1.2 s, music detector hold .6 s. New b116 combat −6 dB sidechain will be wired with the following Combat consumer; current v18 has no combat activity source and does not claim that World integration.
- Bed crossfades 8 s, drift ±10% every 12–25 s; rain equal-power gains over 3 s. Fauna shifted exponential hazards + minimum 5 s, no same immediate file, pitch ±3%, room placement. 24 voice cap and backlog dropping. Exact rates in CONSUMER.md.
- **24/24 automated named tests**, including **36 real Ogg PCM decodes**, SHA/duration/peak and ten day/night ×180 s virtual schedule cases (1800 simulated seconds). **172 existing Site assertions + 511 Footstep assertions** PASS. These assertion counts are not 683 separate end-to-end tests.
- **26/26 observed final-v18 browser cases** PASS: all presets/times/weather/wind, 36 decodes, one context, real music ducking, voice cooperation, global snow/Stop. Historical local v17 24 cases retained separately.
- Final 1029 m flash: scheduled thunder +3.000 s; visible flash drift **7.075 ms**. This is control/display timing, not physical speaker/microphone AV calibration. Thunder excerpt begins at donor 4.48 s; substantial envelope anchor +20 ms with 40 ms soft attack.
- [Visible browser proof](evidence/V458/hosted.png), [actual browser cases](evidence/V458/hosted-browser.json), [automated metrics](evidence/V458/automated.json), [test scope](evidence/V458/README.md). No media embedded in chat.

Changed files: existing `dist/{audio-site.js,index.html,soundscape-source.json,validate.mjs}`; new `dist/ambience/` runtime/panel, two licence registers/source plan, LICENCES/CONSUMER/WS0_REQUESTS documents and 36 Oggs; `scripts/{prepare-ambience,ambience-qa}.mjs`; canonical 36-file CC0 set + LICENCES.json; `evidence/V458/`; owning RETURN, this named Return and owner CHANGELOG. No World/WB2/PR348, Hub/router, Cloudflare configuration writes, merge or Live promotion. Optional game-dev CLI unavailable once; repository-native checks used.

## Open / next gate

Authentic jungle-night bed, fir/coastal-specific fauna, monkeys/distant wildlife, dry thunder alternatives and jungle handling-noise listening review remain explicit gaps. Two jungle excerpts overlap and meadow/forest share a field donor; random scheduling is not a claim of perceptual uniqueness. Three-minute-per-biome judgement is **OPEN**. [WS0 gap list](dist/ambience/WS0_REQUESTS.md); no generation request has been executed.

**One next acceptance gate: WS0/Georg listens for three minutes per biome in the existing Atmosphere panel, judges repetition/levels/thunder, and records TUNE/PASS.** No automatic acceptance. Work then continues in the user-ordered sequence Racer gears → layered Combat/Destruction, without assuming World authority. Latest racer source read at `3dc8a12dd883bf1ca5f6bcbb15a22c1f0228ffb9`; paid-plan ownership confirmed in current WS0 brief; silent O2 excluded; only MIT LoopGrid logic may be ported, not GPL CarAudio.ts.
