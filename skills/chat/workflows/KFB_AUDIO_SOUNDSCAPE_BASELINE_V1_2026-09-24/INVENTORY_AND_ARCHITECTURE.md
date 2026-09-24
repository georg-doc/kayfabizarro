# KFB Audio & Soundscape Baseline v1 · Inventory & Architecture

**Audit date:** 2026-09-24  
**Scope:** existing sources only; no remastering, no runtime promotion.

## 1 · Executive finding

KFB is **not audio-empty**. It already has four useful layers:

1. a broad SFX library;
2. authored KFB music / RoadTrip songs / Racer engine sources;
3. several mature runtime donors;
4. tested semantic feedback patterns.

The missing piece is a shared calibration and metadata layer. The immediate task is therefore to **curate and connect what exists**, then acquire only the categories that remain genuinely uncovered.

## 2 · Shared repository pool

### `media/3D_Assets/Audio/`

The older canonical README (2026-09-02) records **1006 usable sounds** in its then-audited set: 400 WAV + 606 OGG across the 400 Sounds Pack and Kenney packs.

The current tree is larger than that frozen count because later/parallel packs, duplicates, previews, docs and new KFB-specific material coexist. A 2026-09-24 subtree scan found these notable groups:

| Group | observed source files | role |
|---|---:|---|
| Classic Arcade SFX Complete | 213 WAV | arcade/game events |
| S050C Arcade Shooter | 194 WAV + docs | Combat voice / licensed arcade kit |
| Kenney impact | 130 OGG | impacts + footsteps |
| Musical Effects | 111 WAV | stings / effects |
| Kenney interface | 100 OGG | UI |
| Kenney music jingles | 86 OGG | stings / ladders |
| Classic Arcade SFX | 80 WAV | arcade/game events |
| Kenney sci-fi | 73 OGG | sci-fi |
| Kenney digital | 62 OGG + preview/docs | blips/power/laser |
| curated | 59 OGG | earlier KFB shortlist |
| Kenney casino | 54 OGG + preview/docs | cards/dice/chips |
| Kenney RPG | 51 OGG + preview/docs | props / RPG Foley |
| Kenney fighter VO | 47 OGG + docs | combat voice clips |
| Footsteps | 33 WAV | grass/gravel/snow/wood/carpet/concrete/vinyl |
| Materials | 33 WAV | material Foley |
| UI | 30 WAV | generic UI |
| Retro | 25 WAV | jump/coin/power/game cues |
| Environment | 24 WAV | wind, water, door, fire, locks, ticks |
| Card and Board | 24 WAV | dice/cards |
| Items | 24 WAV | item Foley |
| Other | 20 WAV | applause, whooshes, scratch, white noise, food etc. |
| Combat and Gore | 17 WAV | punch/splat/crunch |
| Human | 17 WAV | cough/belch/whistle/man clips |
| Machines | 7 WAV | drill/hydraulic/industrial door etc. |
| KFB Racer | 5 WAV masters + 14 MP3 variants | V8 / steampunk engine source |
| Music | 6 MP3 + docs | smaller music pool |

Counts are observations per subtree, **not a canonical unique-total claim**. Some sets overlap or contain previews/docs.

### Environment coverage actually present

Verified central examples:

- `ambient_wind.wav`
- `water_babbling_loop.wav`
- `water_boiling_loop.wav`
- `water_dripping.wav`
- `water_splashing.wav`
- `fire_lighting.wav`
- `applause.wav`
- `white_noise_long.wav`
- `whoosh_1.wav`
- `whoosh_2.wav`

Travel's own Tiny-audio donor also references ocean waves, crickets and birds. Those are runtime-local coverage, not yet a normalized shared central catalog.

### `media/3D_Assets/Sounds/`

This is the authored KFB music layer, not merely another SFX directory.

Verified current material includes:

- Van Metronome / stems;
- KFB Metronomes and Karaoke Metronomes;
- Shepard's Coaster song;
- Van Freestyle versions;
- Kayfabizarro songs;
- Doorways/Nexus tracks;
- `KFB RoadTrip JukeBox v2/`.

RoadTrip v2 subtree audit: **26 source records**, including 23 MP3s, one M4A and prompt metadata. Titles include Checkpoint Rush, Endless Forward Motion, Final Lap Lift, Night Circuit Runner, Night Desert Lap, Orcish Municipal Hustle, Orcish Street Corner Jam, War Busker Groove and others.

The runtime `media/3D_Assets/Sounds/jukebox.json` currently defines a canonical 10-track KFB catalog. Race can opt into additional RoadTrip-v2 material.

## 3 · Current shared manifests

### `Audio/sfx.json`

13 semantic events currently exist:

`card | land | step | roll | jump | boost | coin | hit | ui | confirm | error | win | gutterFall`

Strength: exact source paths and sample-first consumption in Travel.

Known debt recorded inside the manifest itself:

- jump / boost currently use laser-like placeholders;
- gutterFall still needs a water/splash treatment;
- coin can be improved with casino/chip alternatives.

### `Audio/ui-sfx.json`

Design intent is good: one family, debounce, small pitch variance, polyphony cap and “under-world” mix.

Current path defect:

`media/3D_Assets/Audio/kenney_interface-sounds/click_001.ogg`

but actual tree path is:

`media/3D_Assets/Audio/kenney_interface-sounds/Audio/click_001.ogg`

The same pattern affects the manifest family. Fix + path-validation test is P0.

### Existing audio catalog

`media/3D_Assets/CATALOG/audio-catalog.json`

already exists and therefore must be extended rather than replaced. It was generated on **2026-08-04**, reports 1018 files and predates later additions. It is a stale inventory, not a current runtime registry.

## 4 · Runtime donors

### Travel · strongest general soundscape donor

Verified current modules at `KFB-Travel-Globe/main`:

- `travel-audio.js`: one AudioContext, master, FX bus, reverb, drone, wind, rumble, Jukebox and sample-first SFX;
- `audio-switch.js`: preserves one owner and switches KFB/Tiny behavior without muting the fallback bus incorrectly;
- `narrator.js` + `frizzlebob-voice.js`: browser SpeechSynthesis, voice ranking, activity callbacks;
- narrator activity calls `audio.duck(on)`.

Current Travel defaults include `duckAmount = 0.62`; its implementation multiplies music/drone by `1 - duckAmount = 0.38`, roughly an 8 dB class reduction, with faster attack and slower recovery. This is a proven donor behavior, not yet a universal KFB value.

Important: speech ducking is **not pause**. Music timeline continues.

### Race

Current useful facts:

- BOX1 keeps one music source / AudioContext and a separate SFX gain in the same output graph;
- telemetry edges trigger Boost, Jump/Land, Drift/Re-grip and Rail cues;
- current Race source evidence: 139/139 PASS at tested A6 source;
- RoadTrip v2 direction is human-positive;
- Runner + Shepard direction is human-positive in the later WSA check-in;
- A2 sustained oscillator friction is human-rejected;
- A3 generated palettes/patterns and Psychedelic Scratch are human-rejected;
- A3 Motion Bed may remain a donor;
- accepted original A1 source package is still missing and must not be reconstructed.

A2 explicitly identified a source gap for dedicated tyre-squeal/friction recordings.

### Combat

Combat is structurally more mature than its audible result may suggest.

Verified current capabilities:

- semantic cue ids;
- `player | enemy | world | ui | music` bus semantics;
- priority;
- debounce;
- polyphony cap;
- spatial attenuation;
- per-event ducking;
- local vendoring;
- source mapping in `docs/AUDIO-SOURCES-v4.json`.

The current v4 local manifest has real source provenance for 27 vendored assets. The architectural donor is valuable even if individual cue choices are later re-curated.

### Boxel Blitz

Browser-tested donor vocabulary:

- PICKUP → Retro coin;
- POWER UP → Retro power-up + Pizzicato jingle;
- POWER DOWN → Retro power-down + Steel jingle;
- CHECKPOINT → Match Three xylophone ladder 1–10;
- CASCADE → Match Three synth ladder 1–10.

Technical evidence: 8/8 browser PASS. Human KFB-wide adoption remains open.

## 5 · Proposed shared semantic contract

This is a mapping contract only. Runtime owners remain unchanged.

| shared role | purpose | typical owner mapping |
|---|---|---|
| `VOICE` | addressed narrator/NPC speech | Travel narrator / consumer voice adapter |
| `UI` | non-diegetic controls/confirmation | consumer UI bus |
| `PLAYER_CRITICAL` | hit, landing, boost, danger, success feedback | Race/Combat/Boxel local SFX |
| `WORLD_SFX` | spatial impacts, props, doors, combat in world | consumer spatial bus |
| `DIEGETIC_MUSIC` | Orc band, radio, boombox, stage | local world emitter |
| `SCORE` | non-diegetic/adaptive music | Jukebox/adaptive score bus |
| `LOCAL_AMBIENCE` | venue/zone layer | zone emitter/crossfade |
| `GLOBAL_BED` | weather/day/night/world activity | Travel-style bed |

### Priority model to audition, not hard-code blindly

1. addressed `VOICE`;
2. `PLAYER_CRITICAL`;
3. foreground `DIEGETIC_MUSIC` when the scene explicitly focuses it;
4. `WORLD_SFX`;
5. `LOCAL_AMBIENCE`;
6. `GLOBAL_BED`;
7. background `SCORE`.

Context may swap score and diegetic music. A concert/ring scene is intentionally different from a quiet walk.

### Voice focus contract

A voice provider should expose only the semantic lifecycle a mixer needs:

`voiceStart(characterId, priority)`  
`voiceEnd(characterId)`

The mixer decides ducking; the TTS provider does not own music.

For the first calibration stage:

- keep critical SFX readable;
- duck music/global bed substantially while speech is active;
- reduce noncritical ambience less aggressively;
- do not stop or restart musical timelines;
- recover smoothly after speech;
- captions remain available even if browser TTS has no suitable voice.

Do not freeze an OS/browser voice name into the KFB canon. A future character voice profile should describe language, rate/pitch/timbre preference and fallback class, while allowing the runtime to select an available voice/provider.

## 6 · Spatial / world sound model

Use three independent concepts:

### Global bed

Non-local world identity: time of day, weather, broad world activity. Quiet enough that silence still exists.

### Local ambience zone

Crossfaded state around a place: graveyard, workshop, forest, pit, arena, town square, tunnel.

Overlapping zones should blend by weight; no hard one-frame audio scene switches.

### Diegetic emitter

A point/area sound source with position, range and optional occlusion semantics: band, radio, TV, machine, fountain, portal.

A local music source may become the foreground musical layer without becoming a new global Jukebox owner.

## 7 · What is genuinely missing

### P0 · correctness / catalog

- repair `ui-sfx.json` paths and add exact-path validation;
- refresh the existing audio catalog from the current tree;
- add fields needed for curation: semantic tags, license/provenance, loopability, spatial/default role, preferred runtime format, default gain reference, BPM where applicable;
- keep raw/source master vs runtime derivative explicit;
- preserve the original Race Audio A1 package when found.

### P1 · source-bank gaps

1. **tyre / skid / friction:** dedicated clean recordings suitable for sustained crossfade/granular playback;
2. **weather:** verified rain loop(s), thunder near/far variants, storm bed;
3. **crowd / venue:** sustained crowd bed + sparse reactions beyond one applause clip;
4. **city / traffic:** urban distance bed and traffic pass-by set;
5. **continuous machinery:** more usable looping mechanical beds for workshops/facilities;
6. **character voice identity:** shared voice-profile metadata and provider fallback behavior, not necessarily prerecorded lines.

Acquire only after checking existing repo + Travel-local assets + licensing.

### P2 · authored identity

- curate 2–4 signature KFB cue families rather than using a random sound for every event;
- decide where Boxel ladders belong outside Boxel;
- create scene-specific silence/space rules;
- later, optionally commission/record signature Foley that makes KFB recognizably KFB rather than recognizably “Kenney pack”.

## 8 · AUDIO-CAL-01 acceptance design

Three scenes:

### golden-hour-town

Test: global bed + local street ambience + diegetic source + footsteps + narrator.

Question: can voice remain intelligible without flattening the world?

### graveyard-night

Test: sparse ambience, wind, one local emitter, silence windows, occasional one-shot.

Question: does the system allow restraint, distance and negative space?

### ring-performance

Test: loud diegetic music/Orc band + crowd/venue + gameplay cue + narrator + impact.

Question: can FrizzleBob/another addressed character cut through a dense scene without pausing the band or turning every other bus off?

Controls should expose only:

`MASTER | VOICE | SFX | MUSIC | AMBIENCE`

plus scene selector, source labels and a developer diagnostics disclosure. Do not build a DAW.

## 9 · Evidence policy

Static validation can prove:

- files exist;
- manifests parse;
- source licenses/provenance are recorded;
- semantic mappings stay within contract;
- no duplicate runtime owner is introduced.

Browser automation can prove:

- one AudioContext;
- decode/playback;
- start/suspend/resume;
- ducking state transitions;
- no stale burst/resource leak in the tested path.

Only Georg's listening can prove:

- balance is good;
- a cue is pleasant/appropriate;
- voice is intelligible in the intended KFB mix;
- a signature family is worth promoting.
