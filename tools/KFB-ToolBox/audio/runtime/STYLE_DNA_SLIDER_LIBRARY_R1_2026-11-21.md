# KFB Audio · Style DNA / Spieler-Soundbed R1
Date: 2026-11-21
State: PROPOSAL + VERIFIED SOURCE RESEARCH, NOT AN AUDIO IMPLEMENTATION
Receiving owner: current KFB Audio / MusicClock / Mixer, Draft PR #365
Candidate branch / PR: feature/kfb-audio-procedural-phrases-r1-2026-11-21 / #476
Owner boundaries: one MusicClock, one AudioContext, SCORE bus, existing stem families, Voice Focus and world context/event contracts.

## Product intent
Players create their own soundbed intuitively through several INDEPENDENT 0–100 style-influence sliders (e.g. Funk, Classical, Pop, Death Metal), not by selecting a single mutually exclusive genre. An original seed/world motif persists while stylistic composition, groove, orchestration, performance articulation and sound sources adapt. World/day/activity/event context can reshape ARRANGEMENT without rewriting the player's preferences or deleting local world identity. Save/export as a named Sound DNA preset, restore after reload. Still preserve authored songs, radio and silence.

## Three levels of musical identity (not one homogeneous style soup)
A) WORLD identity: stable world/location/POI leitmotif and curated KFB world personality, not automatically replaced by taste.
B) PLAYER taste: persistent influence vector, top-three active styles and optional novelty/variety preference. All sliders may move independently; normalize active values internally. A slider at zero has zero influence. Do not silently make player taste follow speed.
C) CONTEXT: current room/biome/time, MOVE/STAY/DRIVE/RACE/SPEECH, event types; controls density, dynamics, layer activity, transition urgency, not genre stereotypes. Treat speech as voice-space/ducking, not an excuse to lose musical time.
Mix outcome is deterministic given stable place ID + player Sound DNA + world context snapshot + variation counter. Explicit saved presets override inference. Adaptive learning from user likes/skips is opt-in and can be disabled/reset; no hidden permanent modifications.

## Style = grammar and sound-role instructions, NOT a stereo loop
Each style's versioned package describes:
- groove templates: kick/snare/hat placement, microtiming/swing, fill probabilities, humanization;
- bass language: syncopation, octave/play patterns, note durations;
- harmony: modes, cadences, voicings, harmonic rhythm, dissonance thresholds;
- melody/motifs: contour, call/response, repetition, articulation, range and cadence;
- orchestration: preferred role instruments/synth programs and effects;
- dynamics: density, accents, breakdowns, intros, endings, 4/8/16 bar form;
- technical compatibility: meter, BPM usable range, key/mode remap, transition type, author/licence/source manifest;
- style identity checks: distinctive audible features and negative examples.
Version schemas, keep approved style sources immutable, and store listening approvals separately from code/static QA.

## Coherent blend algorithm (R2 proposal)
1) Quantize weight changes to musical seams. Rank activated styles by weight, cap simultaneous active GRAMMARS to 3 initially; other sliders remain saved but dormant below a threshold.
2) Pick a structural anchor (dominant style), preserving its drum groove / rhythm grid / harmonic progression in that phrase. This is role ownership, not simple note-by-note interpolation.
3) Let secondary styles contribute COMPATIBLE roles or transformations: brass/strings counterline, groove syncopation, tone, articulation, chromatic tension. Choose ONE rhythmic grid and ONE chord timeline per phrase. Genre-specific counter-rhythms may run polyrhythmically ONLY when authored/QA-proven.
4) Use actual KFB MusicClock, quantized changes and crossfades. Two-bar seams for compatible materials; 4/8/16-bar bridge or transitional drone/stinger for dissonant BPM/key/meter changes. No arbitrary pitched crossmix between unrelated mastered stems.
5) Use exact source-proven instrument voices/samples via existing SCORE destination, max polyphony and limiter; remove/defer material without verified license or alignment.
6) Strongly distinguish style identity. A/B tests compare dominant style alone vs blended. Diversity metrics prevent the most common groove/instrument from swallowing all profiles.

## Concrete first public-facing control concept (NOT BUILT)
- Header: current world/scene and named Sound DNA preset; soundbed ON/OFF.
- Four immediately usable sliders: Funk, Classical, Pop, Death Metal; add/remove style from a compact browser of vetted styles (do not put 30 knobs on screen).
- One dual-mode control: WORLD (context-forward) vs MY MIX (preference-forward), with predictable interpolation and always audible scene SFX.
- Activity labels are read-only evidence (roaming, driving, talking); no duplicated gameplay controls.
- Buttons: Audition A/B, Reset to world baseline, Save preset, Export preset. Never advertise playback or cloud save before implementation.
- Optional later controls: density, surprise, instrumentation, stem/song vs procedural preference. An advanced mode can expose rhythm/harmony/timbre influence separately.
- Start with standalone material, not a generalized DAW or replacement KFB radio.

## Demonstration mixture: Funk 60 / Classical 25 / Death Metal 15
Groove/harmony initially owned by Funk, weighted syncopated bass and drums. Classical may supply a coherent counterline and string timbre, Metal may supply selected distorted-guitar articulation / fills / edge on transitions. At high Metal weight, the structural anchor can change on an audible phrase boundary to double-kick/driven riffs while strings and funk bass accents remain compatible. These are example ARRANGEMENT RULES, not evidence of an actual music render.

## Source acquisition & rights shortlist (verified source pages 2026-11-21)
1) EXISTING KFB stems and masters (priority one): current Audio runtime registry G/D/C/M/N/O, and the Musical World Strategy's already accepted ambient / zone masters. These have KFB-owned timing, master-first and source-status rules; G/D/C/M/N/O runtime VERIFIED is not equivalent to human musical approval. Do not intermix pitched stems from different masters arbitrarily.
2) Google Magenta Groove MIDI Dataset (GMD), MIDI-only 3.11 MB, CC BY 4.0. ~1,150 human-performed drum MIDI files across genres incl funk/pop/rock/jazz; learn/curate groove templates and preserve attribution, not automatically import as a finished KFB song. https://magenta.withgoogle.com/datasets/groove
3) Versilian VSCO 2 Community Edition: CC0 orchestral instrumental source library (strings, brass, winds, percussion) with SFZ/WAV. Source: https://versilian-studios.com/vsco-community/ ; https://github.com/sgossner/VSCO-2-CE
4) Versilian Community Sample Library (VCSL): CC0 orchestral/world/experimental sampled instruments, SFZ; source https://versilian-studios.com/vcsl/
5) FreePats: license depends on each instrument; specifically FSBS distorted electric guitar variant 1/2, CC0, SF2/SFZ, suitable as a candidate Metal tone (quality, layering and amp sound must be auditioned). https://freepats.zenvoid.org/ElectricGuitar/distorted-electric-guitar.html
6) GeneralUser GS: broad GM SoundFont under its own permissive v2.0 license; verify that exact version/sample notices before client packaging. https://github.com/mrbumpy409/GeneralUser-GS/blob/main/documentation/LICENSE.txt
7) Original KFB MIDI/SFZ patterns and Web Audio synth patches: best long-term fully-controlled source; original own bass/drums/chord/motif grammar per style. MIDI carries note/control instructions, NOT sound. Soundfonts/SFZ and WebAudio generate sound; audio stems are recordings of distinct layers of one particular arrangement.

Rights exclusions until separately cleared: random scraped commercial-song MIDI, copied Yamaha factory styles, unlicensed web loops; BandLab Sounds are not licensed for isolated sampler/loop library redistribution and are restricted for AI training (https://bandlabtechnologies.com/policies/bandlab-terms-of-use/); Pianobook allows use in music productions but not redistribution of its standalone sample libraries as part of a game sampler (https://www.pianobook.co.uk/terms-conditions/). Do not package such libraries as KFB Sound DNA instrument banks.

## Proposed bounded implementation path
P0: inventory/reuse 4 KFB-relevant current stems, Groove MIDI subset, 1 CC0 orchestral instrument, 1 CC0 distorted guitar; isolate/authenticate source and instrument in the existing Audio Site before combining.
P1: four real style grammar presets; implement role-aware blender with injected MusicClock/SCORE bus and same-seed A/B scenes. Preserve existing songs, radio and ducking.
P2: in-place Site controls, save/export JSON and environment-vs-personal preference blending, no new Audio Site or runtime owner.
P3: real browser listening and QA: four solo styles vs all pairings, explicit impossible blend case, 2-bar and long transition, dialog duck, loop fatigue, max voices/CPU, iOS boot/autoplay gesture; sources and attribution checked.

## Honest evidence
This record is an architectural proposal and externally sourced donor shortlist only. Imported third-party MIDI/sample bytes: 0. Style grammar programs implemented: 0. Audio listening/style-slider browser tests: 0. Existing R1 seed composer remains a separately statically tested candidate on this branch. No KFB world/race code, no Site deployment, no Cloudflare Stage/Live or merge.

## One productive next gate
A real FIRST listening/morph proof inside the existing KFB Audio Site: same seed, Funk vs Classical vs Death Metal, then two 2-style blends, with live sliders on the existing host clock/bus and A/B subjective notes plus measured browser/CPU/voice integrity. No further palette expansion before this proof.
