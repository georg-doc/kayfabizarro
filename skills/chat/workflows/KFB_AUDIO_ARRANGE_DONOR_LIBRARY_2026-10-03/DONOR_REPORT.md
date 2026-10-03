# KFB AUDIO DONOR LIBRARY · REPORT

## Census evidence

GitHub Actions:
- run `37124892788`
- job `111208081283`
- **17/17 PASS**
- artifact `11274855175`
- digest `sha256:a74a70ca8feb309b229139631dc547a7da9ff7e96bca729d5e35a0c563f43f67`

Every donor master and every stem decoded successfully in Chromium.

### Donor summary

| Donor | BPM | Master | Stem duration | Spread | Stem count |
|---|---:|---:|---:|---:|---:|
| Cyclical Warmth | 76 | 213.200 s | 214.128 s | 0.000 s | 8 |
| Loping Groove | 88 | 204.000 s | 203.544 s | 0.000 s | 10 |
| Modal Vamp | 77 | 209.960 s | 210.696 s | 0.000 s | 7 |
| Small-Room Groove | 122 | 187.240 s | 187.464 s | 0.000 s | 8 |
| Warm Tape Saturation | 75 | 218.840 s | 218.856 s | 0.000 s | 10 |

All stems within every donor have an exactly shared timeline.

## Donor classification

### SLOW / WORLD CLUSTER

**Warm Tape Saturation · 75 BPM**
- strongest master/stem duration match: only 0.016 s difference;
- bass + keyboard begin immediately;
- drums/percussion enter ~22.4 s;
- guitar ~29.4 s;
- synth ~46.1 s;
- strings ~80.1 s;
- Other ~100.2 s;
- lead-vocal stem is essentially empty/residual and should be excluded.
- excellent natural layer-build donor.

**Cyclical Warmth · 76 BPM**
- established musical Ground Truth;
- drums/bass immediate (~0.48 s);
- guitar/keyboard ~0.12 s;
- strings/brass enter late (~70–76 s);
- ideal cozy/world baseline.

**Modal Vamp · 77 BPM**
- drums/bass immediate;
- guitar early;
- keyboard/synth begin ~25–27 s;
- brass/woodwinds only around 80–89 s;
- unusually clean sparse/orchestrated development.
- very strong candidate for quieter/modal world regions.

The 75/76/77 BPM trio is a natural **slow-world family**.

Do not blindly combine pitched stems across donors merely because BPM is close. Keys/chord fields must be known first.

Safe early cross-donor swaps:
- drums;
- percussion;
- selected non-tonal Other/FX.

Pitched cross-donor swaps require:
- key/mode metadata, or
- MIDI/chord analysis, or
- human-curated compatibility.

### MEDIUM / ACTIVE EXPLORATION

**Loping Groove · 88 BPM**
- drums start immediately;
- keyboard/synth early;
- bass ~1.62 s;
- guitar/brass ~2.3 s;
- percussion ~24.1 s;
- strings ~45.4 s;
- vocal stems are effectively empty end-of-file separation residue and should be excluded.

Role:
- active exploration;
- town/social lift;
- bridge toward Road without becoming race music.

### FAST / ROAD CLUSTER

**Small-Room Groove · 122 BPM**
- strongest bass presence in the measured donors;
- bass/guitar/keys/synth start early;
- drums deliberately enter much later (~15.84 s);
- Other ~46 s;
- brass ~77 s;
- master is also the loudest/most forward by RMS among the five.

Role:
- Road / high activity;
- speed translation;
- later Race-adjacent donor.

Do not time-stretch this down into the slow-world family.

## Why KFB ARRANGE sounded similar to the master

The current KFB ARRANGE bench is a **vertical remix**:
- same full-length performances;
- same internal note phrases;
- different stem gains / space over time.

Therefore it should remain musically close to the master.

That is desirable for the first adaptive layer: it proves we can add game control without destroying the authored music.

It does **not** yet prove horizontal procedural composition.

## Vertical vs horizontal adaptation

### VERTICAL · recommended first

Keep all stems on the same timeline and control:
- drum/percussion intensity;
- bass prominence;
- keyboard/guitar/synth color;
- rare brass/strings/woodwinds;
- filter/reverb/delay;
- voice ducking;
- Road lift;
- night reduction;
- tension/shadow attenuation.

Advantages:
- preserves Suno's musical performance;
- low musical risk;
- easy game integration;
- sample-accurate stems already proven.

### HORIZONTAL · later

Cut the donor into bar/phrase-addressable blocks:
- 2 / 4 / 8 bar regions;
- repeat / skip / reorder;
- choose alternate endings;
- phrase-level Markov graph.

Requirements:
- downbeat/phase map;
- section markers;
- harmonic/key/chord metadata;
- careful tails/crossfades.

Do not start by slicing all five tracks.

First prove one donor can be vertically adaptive and still enjoyable.

## BPM family strategy

Do not force all donors to one tempo.

- 75/76/77: World cluster; near enough for closely related crossfades and possible small pitch-preserving normalization later.
- 88: Active/exploration family.
- 122: Road/high-energy family.

For a first implementation, keep every donor at its native BPM and crossfade at bar/section boundaries rather than continuously time-stretching.

## TinySkies verified donor

Repository:
`dannylimanseta/tinyskies`

Code:
`client/src/audio/AudioManager.ts`

TinySkies:
- explicitly credits **Music by Suno** and **SFX by ElevenLabs**;
- ships pre-authored MP3 tracks:
  - day_1 / day_2
  - evening_1 / evening_2
  - night_1 / night_2
  - end_times_1 / end_times_2
  - plus void_1 in the audio folder;
- randomly chooses one track per normal time phase when loading;
- creates one WebAudio layer per day/evening/night plus End Times layers;
- starts the selected tracks as looping AudioBufferSources;
- calls `setWeights(day, evening, night)` to smoothly crossfade gain;
- blends End Times using a separate scalar;
- does not procedurally compose notes;
- does not use musical stems in the inspected AudioManager.

Conclusion:
TinySkies validates **authored Suno beds + runtime crossfade**.

KFB can deliberately extend that proven pattern to:
**authored Suno beds + phase-locked stems + runtime vertical arrangement + later bounded phrase slicing.**

## Recommended runtime architecture

`Donor Family`
→ phase-locked stem bus
→ context stem weights
→ FX/send weights
→ voice/SFX ducking
→ master

Donor family transitions:
- choose next family from semantic context;
- wait for a musically safe boundary;
- start next family on its own native timeline;
- crossfade donor buses;
- do not mix pitched layers across donor keys by default.

## Next gate

**AUDIO-STEM-BED-01 · Adaptive Suno Stem Bed**

First proof:
- use Cyclical Warmth or Warm Tape Saturation;
- one phase-locked stem family;
- semantic controls only:
  - calm ↔ active;
  - world ↔ road-lift;
  - day ↔ night;
  - voice focus;
- no new note generation;
- no weather yet;
- no cross-song pitched stem mixing yet.

Then:
- add Modal Vamp as alternate slow-world family;
- add Loping as active family;
- add Small-Room as Road/high-energy family.
