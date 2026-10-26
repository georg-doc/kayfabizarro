# DONOR AUDIT · FatGuy84/sound-forge · 2026-10-26
**Decision: REFERENCE / DESIGN-DONOR CANDIDATE · SOURCE INSPECTED · NO LICENSE / NO CODE IMPORT · NO RUNTIME INTEGRATION**

## Source pinned at audit
- Public repository: https://github.com/FatGuy84/sound-forge
- Current default-branch HEAD observed 2026-10-26: `54bbdec315e92798660f93ae897c7ccedac7370e`.
- Created 2026-10-26; files: README.md, index.html (GitHub blob SHA `de2443947ac0df5de102fa0464519e3f1fb3c3f4`, 73,835 bytes) and sfx.html (28,178 bytes). Source was directly read via GitHub connector. No license file and GitHub repo license metadata null on this observed head. No workflows/tests in Git tree.
- No source object isolated and listened in browser; no SHA-pinned screenshots/aural render or technical acceptance. Not accepted as a KFB implementation.

## Evidence-based capabilities
### Music index.html
Single HTML/Web Audio browser *sketchpad* with 8 genre families × 3 styles, sections/arrangements, 6 note/instrument roles (melody/chords/bass/arp/pad/drums), 28 patch-like presets per README, musical regeneration, Piano Roll, keyboard note recording, tempo/swing/key/transposition, JSON project save, MIDI song export, 44.1kHz stereo WAV exports.
Code uses `AudioContext` for playback and `OfflineAudioContext` for WAV rendering. Shared `buildGraph()` synthesizes reverb impulse from random noise; synth voices are oscillators/noise+filter/envelopes with sends. `exportWav('loop')` renders the chosen section twice and retains pass two, a sensible *tail-wrap heuristic* rather than independently proven sample-perfect loop certification. MIDI/JSON is useful as editable authoring output.
Known KFB fit: drafts for mood color, drone/pads, note/section structures and offline stems, **not** an upgrade to existing Sonus/Suno or MusicClock. Live player creates its own `AudioContext`; must not be embedded into the KFB Audio runtime as a second clock/context. Fixed 4/8/16 sections and 25ms JS look-ahead scheduling are music-oriented, not ecological world-time generative audio.

### SFX sfx.html
Standalone `OfflineAudioContext(1,...,44100)` mono offline signal constructor; up to 4 synthesized layers; square/saw/triangle/sine/white/pink/brown; ADSR-like attack/sustain/punch/decay, pitch slides, arpeggio, repeats, FM/vibrato, LPF/HPF, drive, bitcrush/downsample, reverb/echo; preset families 16 incl. `Critter chirp`, `Creature growl`, `Footstep`, `Swoosh`, `Magic/Heal`; batch mutates parameters by small random offsets and exports 16-bit mono WAV, plus JSON/history. Noise code implements pink filter and brown integration; `noiseBuffer` generates two seconds of pseudorandom samples on each render. Output normalize then trims silence and fades last 5ms.
KFB fit: compact **variation authoring grammar** for procedural wind/leaf/rain-patters as independent *future design*, stylized wildlife/Mindscape accent noises, magical portal FX, footsteps and source-specific event families. Batch subtle variations mitigate immediate repetition but cannot create an ecological long-running soundscape automatically. `Critter chirp` is a high-frequency synthetic oscillating chirp; **NOT recorded/taxonomically grounded bird/insect voice**. SFX current output **mono, short, not spatial, not continuous**. Same JSON recipe does not ensure byte-for-byte repeat because it uses `Math.random()` for noise, reverb and mutations (no saved seeded RNG). Source-to-runtime playback equivalence and deterministic regression require further work.

## Gaps against KFB Nature Orchestra
| Requirement | Current sound-forge truth | KFB decision |
|---|---|---|
| authentic birds/amphibians/insects | no samples, purely synth | must come from verified CC0/PD field recordings, SOURCE_REQUIRED |
| biome/time/ecology/species metadata | none | world/mindscape provides existing context; ecology event recipes live under current Audio owner |
| 20–30min organic nonrepetition | parameter variations only; no ecological scheduler | implement weighted/no-repeat event conductor separately, deterministic seeds + log |
| spatial emitters/HRTF/environment | SFX mono offline, no Three.js positional routing | existing Web Audio/Three.js audio consumer |
| adaptive weather/water/wind | musical clip generator and one-shot noise primitives only | source-controlled atmospheric AudioWorklet / Web Audio glue, not drop-in module |
| voice duck/master mixing/music clock | self-contained audio output contexts | forbid second mixer; KFB Audio Site owns bus, Duck and MusicClock |
| licensed code reuse | GitHub license missing | NO source copy, vendoring, module extraction, website deployment or code derivative absent explicit permission/license |
| auditable acoustic quality and browser performance | README/source inspected only | source isolation, isolated WAV listening, headless/browser tests later; not PASS |

## Suggested bounded evaluation for VS0 (optional within the same forest gate)
1. Do not add the code or embed the UI. If author grants a valid license, first obtain it and pin the head/license. Otherwise use **independent implementation of standard Web Audio techniques**, with no translated/copy/pasted original source code.
2. *In isolation first*: compare a source-only quiet real-forest baseline with one independently authored filtered pink/brown noise canopy/gust recipe and three subtly varying short leaf-twig accents. Identify source origin clearly.
3. Judge naturalism, noise fatigue, mono-to-stereo/spatial budget and actual 10/30-minute repetition; do not substitute synthetic `Critter chirp` for real dawn birds.
4. For music, test one simple drone/pad as offline WAV authoring aid alongside current Sonus Ambient Bed, not a new in-world clock/mixer. Existing B/C/D states and SCORE/GLOBAL_BED priorities stay authoritative.
5. Log `SOURCE_INSPECTED_ONLY`, `LICENSE_MISSING`, `BROWSER_NOT_TESTED`, `RUNTIME_NOT_ADOPTED`. If asked for actual playable donor proof, obtain lawful source usage, perform real browser audio isolation and listening before any integration.

## Priority and one next gate
Priority **P2 optional tool donor**; the P1 real CC0 source-bank forest baseline still wins. No new product stage or human gate. **One next gate remains: VS0 AUDIO NATURE SOURCE-ISOLATION + FOREST ADAPTER INTAKE**.

## Source citations/pointers
- https://github.com/FatGuy84/sound-forge/blob/54bbdec315e92798660f93ae897c7ccedac7370e/README.md
- https://github.com/FatGuy84/sound-forge/blob/54bbdec315e92798660f93ae897c7ccedac7370e/index.html
- https://github.com/FatGuy84/sound-forge/blob/54bbdec315e92798660f93ae897c7ccedac7370e/sfx.html
