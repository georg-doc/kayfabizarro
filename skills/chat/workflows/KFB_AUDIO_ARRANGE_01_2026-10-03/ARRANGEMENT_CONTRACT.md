# AUDIO-ARRANGE-01 · Arrangement Contract v0.3

## 1. First-piece target

Working title: **KFB Motorik Funk Mirage**

This is a functional name only.

- tempo: **90 BPM** working target;
- meter: 4/4;
- duration: 64 bars ≈ 2:50 plus tails;
- groove-led, not melody-led;
- restrained human pocket;
- enough negative space for NPC speech and world SFX.

The first implementation may adjust tempo within ~88–100 BPM if existing KFB donor material clearly works better there. Do not time-stretch a good donor merely to hit 90.

## 2. Pitch strategy

### Melody / riff pool

Use a small **D-minor-pentatonic core**:

`D F G A C`

This is the default riff/hook safety set, not the full harmonic language.

Optional color tones from D Dorian may appear in harmony or authored phrases, but the procedural hook generator must not spray all modal notes.

### Transposition

The single hook may recur:
- unchanged;
- scale-clamped around +7 semitone class;
- scale-clamped around +2 semitone class;
- lower-register return.

No independent random note mutation in the first proof.

## 3. Harmony

Use a **modal vamp**, not a busy progression.

Primary harmonic field:
- Dm7 / Dm9 / D pedal
- G7sus / G6/9 color

Secondary color field used sparingly:
- Fmaj7(#11)
- Em11 / A-color leading back to D

Harmony should move through voice-leading, filters and orchestration more often than by changing chord.

## 4. Rhythm: three sounds, three patterns

### Sound classes

**R1 LOW**
- warm dry kick / low drum

**R2 MID**
- brush/snare/cross-stick / soft hand-drum accent

**R3 HIGH**
- shaker / soft hat / shekere-like texture

Found/mechanical hits belong to sound-design events, not the continuous drum grid.

### Pattern A · CORE POCKET

Sparse, repeatable electro-funk/motorik pocket.
- kick anchors;
- mid accent gives backbeat identity;
- high element sparse;
- loop for multiple bars before any change.

### Pattern B · SYNCOPATED POCKET

Same identity, one or two shifted/added accents.
- not a new genre;
- used for B/lift sections.

### Pattern SPACE

Remove most kick activity.
- mid/high traces remain;
- creates air without stopping the musical clock.

No fourth continuous rhythm pattern in the first human proof.

## 5. Bass

Bass is the main pitched identity carrier.

Only two full phrases plus one sparse variant:

- **BASS-A:** 2-bar core syncopated pocket;
- **BASS-B:** 2–4 bar slightly more active response;
- **BASS-SPACE:** pedal/ghost reduction derived from A.

Rules:
- 3–6 meaningful notes per bar maximum;
- no continuous 16ths;
- phrase repeats several times unchanged before variation;
- approach notes only at structural boundaries;
- human microtiming is authored per phrase, not random jitter.

## 6. Harmonic color

One of:
- Rhodes / Wurlitzer;
- clavinet;
- drawbar/percussive organ.

Use as punctuation:
- sustained low-mid voicings;
- sparse offbeat stabs;
- filtered/phase variants;
- no bright top-register sparkle.

## 7. Hook / melody

Exactly **one short 1–2 bar motif family** for the first proof.

Default event budget:
- no hook during opening;
- one appearance around every 8–16 bars;
- silence after it;
- one transposed or lower-register recall later.

If the piece works with no hook at all for 16 bars, that is a success.

## 8. Sound-design instrument

This is the Yello/KFB layer.

Allowed rare events:
- reverse percussion;
- dry mechanical hit;
- spring-reverb splash;
- tape stop/start;
- stereo orbit whoosh;
- filtered radio/tape shard;
- brief pitch dive;
- resonant wood/metal/glass hit;
- dub-delay throw.

Budget:
- 0–2 memorable events per 8 bars;
- do not repeat at the exact same position every cycle.

## 9. Space / production

Two-stage spatial logic:

**DRY FRONT**
- bass;
- kick;
- critical groove accents;
- rare sound-design hit.

**WET BACK**
- harmony tails;
- guitar/organ color;
- bed;
- selected percussion;
- dub/tape throws.

Reverb is glue, not a blanket.
The first proof must remain intelligible when voice ducking is later reattached.

## 10. Fixed 64-bar form

### 1–8 · OPEN
- bed;
- R3 high-percussion traces;
- BASS-SPACE hints;
- harmony enters late;
- one dry weird event;
- no hook.

### 9–16 · A
- Pattern A;
- BASS-A;
- harmonic field A;
- no melody until late in section.

### 17–24 · A'
- same pattern and bass identity;
- one orchestration change;
- first hook appearance;
- one sound-design event.

### 25–32 · B
- Pattern B;
- BASS-B;
- brief secondary harmonic color;
- hook absent or only final 1–2 bars.

### 33–40 · SPACE / DUB
- Pattern SPACE;
- BASS-SPACE;
- deliberate 1-bar near-silence/dropout;
- dub delay / spring / tape space;
- one strange event.

### 41–48 · A RETURN
- Pattern A unchanged at first;
- BASS-A returns recognizably;
- harmonic color instrument may change;
- hook can return lower or transposed.

### 49–56 · PSYCHEDELIC DRIFT
- groove stays stable;
- production moves: phase / Leslie / filter / tape wobble / echo;
- do not increase note density.

### 57–64 · RECOVERY
- return to harmonic field A;
- subtract layers;
- BASS-A recognizable;
- one final dry event or hook fragment;
- final bars allow a clean musical return seam.

## 11. Source / timbre backends

### Preferred public implementation

**Tone.js 15.5.44 · MIT**
- transport;
- sampler/player;
- synchronized phrase scheduling;
- buses/effects;
- section transitions.

**Scribbletune 5.5.5 · MIT**
- pattern notation;
- chord/progression helpers;
- phrase clips;
- MIDI export/import experiments.

**Total Serialism 2.10.4 · MIT**
- NOT required in first proof;
- later only for phrase-level Markov / Euclidean / controlled transform choices.

### WebAudioFont research donor

`surikov/webaudiofont`
- package 3.0.04;
- description says about **2000 musical instruments**;
- sample-based synthesis;
- GM-compatible;
- catalog says full MIDI set with 5–10 sound variations per instrument;
- examples include realtime music, dynamic loading, mixer/EQ/reverb, strum, MIDI player;
- associated example applications include auto accompaniment and 3D music sequencing;
- current repo has a commit dated 2026-09-04;
- global GitHub search shows multiple external projects using `WebAudioFontPlayer`, plus Surikov's own procedural-generation code.

**License:** GPL-3.0-or-later.

Decision:
use as an **internal timbre/sequencing audition donor**, not a public KFB dependency until license implications and preset provenance are explicitly accepted.

### Permissive SoundFont conversion route

`WebAudioFonts/deploy-template`
- MIT;
- converts selected `.sf2` files to browser-ready WebAudioFont-style JSON;
- supports self-hosted curated catalogs.

Important:
the conversion code being MIT does **not** license the SoundFont content itself. Any chosen SF2 must have explicit compatible provenance.

This is the preferred architecture if KFB later curates its own/permissive soundfont pack.

## 12. Existing KFB musical donors

### Van Metronome cover stems

Exact current registered stems:
- `1 Drums.mp3` · blob `7092e01528000d24e3ee30094eae72bcbb78ec09`
- `2 Bass.mp3` · blob `accd3e2fdb395e19814805e15294de8ff474f52a`
- `3 Guitar.mp3` · blob `1ffd052a00bdd82c8da3af9e582b9fbe33a9d54c`
- `4 Synth.mp3` · blob `25a1fe5029adc8e74a6cdb3624d1f864b0a997a1`
- `5 Other.mp3` · blob `7b8dcf1b1ed0c715046021ee795d1f25bc3ada88`

Registry source pin for this family: `378b209355b13304e3cff656ec0806ca5b89df28`.

Use:
- groove/timbre/form analysis;
- possible aligned stem-layer donor;
- do not assume these stems are automatically suitable for the final island.

### Rubbish Groove

`media/3D_Assets/Sounds/KFB RoadTrip JukeBox v2/Rubbish Groove 2min A extend 01.mp3`
- blob: `368eb5ae8fafcfba1cce3ba3f80488378fe056b0`
- measured: **100 BPM**
- phase offset: **0.465 s**
- beats/bar: 4
- already used as the Orc-band beat clock.

Use:
- KFB groove/form reference;
- not an automatically accepted island bed.

### RoadTrip prompt language donor

Existing prompt pack already specifies KFB-adjacent traits:
- psychedelic highway funk / electro-jazz;
- twang guitar;
- clavinet;
- Wurlitzer/Rhodes;
- punchy electric bass;
- tight live + electronic drums;
- 8/16-bar evolution;
- short rhythmic gaps for gameplay SFX.

Use this as existing KFB musical language, not as proof that the suggested prompt renders exist.

## 13. Suno / ElevenLabs escalation

No credits required for first implementation attempt.

Escalate only if current KFB stems + curated/permissive instruments cannot produce the target.

Suno authoring-time use:
- generate one instrumental donor;
- stem split;
- optional MIDI extraction;
- keep approved source locally;
- runtime independent.

ElevenLabs:
- later for believable weather/environment sources;
- not part of AUDIO-ARRANGE-01.

## 14. Implementation order inside one gate

These are internal steps, not extra Georg gates.

1. **Timbre audition**
   - audition a tiny set of candidate E-piano/clav/organ/bass/guitar/percussion voices;
   - WebAudioFont may be used internally only.

2. **Fixed phrase authoring**
   - three rhythm patterns;
   - two bass phrases + sparse version;
   - two harmonic fields;
   - one hook family;
   - 5–8 rare FX events.

3. **Fixed 64-bar arrangement**
   - no seed/Markov logic yet;
   - verify bar/section timing and silence.

4. **Production pass**
   - dry/wet buses;
   - limited reverb;
   - dub/tape/phase movement;
   - master headroom for gameplay.

5. **Human listening**
   - one simple player surface;
   - no matrix/DAW/weather/deck controls.

Only after PASS:
- phrase graph / seed;
- ROAD translation;
- Deck Audio DNA;
- weather;
- broader traditions.
