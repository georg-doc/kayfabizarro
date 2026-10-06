# KFB Adaptive Music Stem Proof 01

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
