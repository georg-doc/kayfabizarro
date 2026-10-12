# KFB Adaptive Music Stem Proof 01


## NEXT SITE UPGRADE · 2026-10-12 · CONTENT EDITS WITHOUT WORK

Georg explicitly rejects **Work/WSA as a recurring requirement for new Card Triplets or authoring updates**. The **existing** KFB Audio Voice Acting Site, same project/site/audio owner, needs one bounded Sites-capable Work enhancement to support **self-service audition plus GitHub-truth content hot reload after future ordinary Chat/GitHub writes**. In-Site drafts must be editable/testable/importable/exportable without another Site publish; secure direct GitHub save only when authorized backend is actually supported. Existing D Conversation Base (94 BPM real stems), mixer, clock, catalog and Site shell stay unchanged. **Audio A/B and two subsequent content-only GitHub hot reloads with zero Site redeploys are required acceptance, not optional.**

**Read now:** `WORK_WSA_AUDIO_VOICE_ACTING_SELF_SERVICE_CARD_PERFORMANCES_R1_2026-10-12.md`. Voice inputs remain source-truth on existing ChatterBox Voice PR #379, not copied into Audio as a second canonical content bank. Existing KFB Audio PR #365 is the single Site owner. This brief is only prepared and source-verified; **no Work/Site execution happened** and the existing URL is not newly browser-verified by this check-in.

--- 

Status: BOUNDED_SLICE · IMPLEMENTATION CANDIDATE
Date: 2026-10-06
Owner: existing KFB Audio / Jukebox / Mixer
Repo: georg-doc/kayfabizarro
Branch: web/kfb-adaptive-music-stem-proof-2026-10-06
Base: 401d560a2e2f6b4b8644c01907c4324f8515444b
Primary product surface: existing KFB Audio Site · https://kfb-audio.frizzlebob.chatgpt.site

## Goal

Prove the first real adaptive-music seam with the user's newly uploaded stems without creating a second audio runtime:
1. G Cosmic Roadtrip Orchestral = same-timeline vertical orchestral layering with one Music Clock and quantized boundaries.
2. D Conversation Base = additive Speech Focus on top of existing KFB voice ducking: gain space + speech-band EQ + restrained transient/orchestral layers, while the music timeline continues.

## Current real sources

G · 120 BPM · 10 source stems:
Lead Vocals label, Drums, Bass, Guitar, Keyboard, Percussion, Strings, Synth, Other, Brass.

D Base · 94 BPM · 10 source stems:
Lead Vocals label, Backing Vocals label, Drums, Bass, Guitar, Keyboard, Percussion, Strings, Synth, Brass.

Source-labelled Vocal/Other stems are not semantic truth and are muted by default until listening audit.

## Donor

Reuse semantics from:
- kfb-hub/stage/audio-calibration/audio-calibration.js @ blob 5cb3f08c1020eaaaf8ba6bb665906f567095fe67
- kfb-hub/stage/audio-calibration/style.css @ blob dada1d6d304be5d9c0aeb9cdb23c4c19ea150fda

Protected:
- one AudioContext;
- existing semantic buses and TTS ducking;
- existing Audio Site owner;
- music never writes gameplay truth.

## Done when

- real G and D stem paths resolve;
- one MusicClock handles IMMEDIATE / NEXT_BEAT / NEXT_BAR / NEXT_PHRASE scheduling;
- G can alter orchestral intensity with SAME_TIMELINE gain changes;
- D Speech Focus changes mix/EQ without restarting the timeline;
- decoded runtime evidence reports actual stem duration delta before any sample-aligned claim;
- source tests pass;
- Site-ready source is preserved;
- existing KFB Audio Site is updated only by a Sites-capable executor and visibly verified before claiming publication.

No Cloudflare substitution. No merge. No Live promotion.
