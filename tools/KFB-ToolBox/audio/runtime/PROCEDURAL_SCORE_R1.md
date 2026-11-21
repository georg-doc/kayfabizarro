# KFB Procedural Phrases R1 — optional Audio source

Status: CANDIDATE · LOCAL STATIC PROOF ONLY · NOT INTEGRATED/HEARD/PUBLISHED
Owner: existing KFB Audio PR #365, branch web/kfb-adaptive-music-stem-proof-2026-10-06
Candidate branch: feature/kfb-audio-procedural-phrases-r1-2026-11-21
Source: user-provided plain-language algorithm description, not transplanted source code.

## Goal
Turn stable place identities into reproducible 8-bar music that the existing KFB Audio engine can optionally play. No recorded samples, no synth library.

## Actual candidate
- procedural-score.mjs: UTF-8 FNV-1a + xorshift32; 8 bars of 4/4, 16 steps/bar; 2-bar diatonic progressions; 5-note melodic subset; nine provisional KFB world/biome/vehicle profiles; optional daytime bird call.
- procedural-voice.mjs: injected Web Audio context/destination only; FM bass, oscillator flute/saw, additive marimba/steelpan/musicbox, generated Karplus–Strong plucks.
- qa-procedural.mjs: 19 structural/determinism/ownership assertions, no audible playback.

Exports: composePlace, nextTwoBarSeam, cueForEvent, mixForActivity, scheduleProceduralNote.

## Protected owners
Existing KFB Audio MusicClock owns lookahead and audio-time mapping. There is NO scheduler in this module. Existing SCORE bus, mixer, stem routing and voice ducking own mix gains. The game owns stable world/zone IDs, daytime, activity and event facts only. It never chooses music pitches, BPM or instruments. A place/vehicle change requests a 32-step (2-bar) boundary; tempo is independent of vehicle speed.

Existing songs/stems/radio remain primary: this is opt-in background material, not a replacement or second live music owner. Existing kfb.audio.context.v1 and kfb.audio.event.v1 contracts are preserved. Event cues map POI_DISCOVERED, CARD_ACQUIRED and RACE_START. ROCKET_COUNTDOWN is future-only if a real event emitter exists.

Musical palette choices are proposals, not Georg-approved sound identities.

## Evidence and limits
Local Node candidate source tests: 19/19 PASS. No exact GitHub-branch Node run, no real browser Web Audio hearing, no iOS, CPU/polyphony or mixing proof; no Site or Cloudflare Stage publication. Module-created AudioContexts by design: 0, not browser-instrumented. Existing Audio Site v11 untouched.

## Next productive gate
KFB Audio integrator: run candidate through existing Site MusicClock/SCORE graph and audition two locations, one 2-bar switch, one semantic cue, movement-to-stillness and Voice/Speech Focus. Record real browser errors, voice/CPU cost and audible ducking while preserving the existing song/stem/radio catalogue. Do not advance World/Race/Live before this proof.
