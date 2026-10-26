# KFB Immersive Sonic Ecology · Technology & Donor Atlas R2
Date: 2026-10-26 · research matrix, NOT integration approval. Existing KFB Audio is the only mixer, clock and AudioContext owner. Read `KFB_IMMERSIVE_SONIC_ECOLOGY_VISION_R2_2026-10-26.md` first.

## Recovered internal donor — more important than another synth app
### Conspiracy Iceberg Explorer · exact source inspected
`georg-doc/kayfabizarro/travel/3D Conspiracy Iceberg Explorer/atmo-engine.js` on `main`, fetched blob SHA `5ec70fd33a53cdca6e2344f32aa7b79d73b5ce60`; companion `docs/ATMO-prompts.md` blob SHA `0f5c0acd88b8e88fe3797d6122b583dfd4199e29`.
Its concrete **source**:
- Browser Web Audio no mandatory files; seven-depth gradient expressed as colored dual oscillator interval pairs/beating, lowpass brown noise, sub/body drone, LFO vibrato, rare filtered sonar pings with delay, slow parameter ramps (~4.5s target time), duck, tier state and dispose.
- If all seven authored MP3 loops exist, may crossfade to those while synth remains faint. Prompts request A-minor shared center and seven narrative stages. The JS uses `Math.random()` and discrete timer pings, not seeded replay.
- This proves **a real source architecture recipe already lives in KFB**, not that its current sound is artistically accepted or actually isolated/listened. Importantly the standalone object **creates its own AudioContext and compressor/master** and is therefore **NOT drop-in** for KFB Audio's one-context owner. Reuse only verified *design parameters/arrangement ideas* after a source-isolated listening and adapt to existing owner's buses; no parallel AtmoEngine host.
- Potential distinctive technique: an abstract spatial/story level `mindscapeDepth` morphs filtered noise, interval ratios, beat-rate, reverb and sporadic world events across a smooth progression. For Egregore field replace depth with `thoughtAdherence`/density/threshold only if World supplies genuine state. Avoid automatic low-sub escalation or default dark dread.

### Other protected internal proven contracts
- `skills/chat/workflows/KFB_AUDIO_SOUNDSCAPE_BASELINE_V1_2026-09-24/`: accepted AUDIO-CAL-01, global/local/emitters semantics and voice duck.
- Audio Site PR #350: B movement / C stay / D dialogue; music source, one context, clock; no world truth ownership.
- PR #352 `KFB_MUSICAL_WORLD_STRATEGY_2026-10-04.md`: physical freely timed layer, authored musical Ambient Bed, higher-energy performance layer; phrase-aware DJ transitions; source-only stems, frozen Sources bug in a separate fold.
- Nature R1 `nature-orchestra/`: 13 per-recording CC0 page candidates (all unimported); page license ≠ source acceptance.
- `FatGuy84/sound-forge@54bbdec315e92798660f93ae897c7ccedac7370e`: real source inspected (Web Audio offline music/SFX authoring, 4-layer sound variation) but **no LICENSE file or repo license**, no vendoring/derivatives, no browser listening. `nature-orchestra/DONOR_AUDIT_SOUND_FORGE_R1_2026-10-26.md`.

## Candidate technology decisions
| Technique / donor | Use case | License/evidence | Classification and constraint |
| --- | --- | --- | --- |
| Native Web Audio `GainNode`, `BiquadFilterNode`, `DelayNode`, `ConvolverNode`, `StereoPannerNode`, `PannerNode`, oscillators and `AudioBufferSourceNode` | pads, rings, dynamic resonators, wind, filtering, reverbs, movement | Web platform, MDN verified | **KEEP / FIRST CHOICE**; route to existing bus; no second context |
| `AudioWorklet` | custom grains, filters, physical models, streaming generative texture (single audio thread) | MDN verified, secure context required | **ADAPT** only after vanilla nodes fail CPU/quality; no obsolete ScriptProcessor |
| `OfflineAudioContext` | deterministic or controlled asset bake + isolated A/B/golden | MDN verified | **KEEP authoring/test**, not separate playback transport; seeded DSP state needed for reproducibility |
| Tone.js `GrainPlayer`, `PolySynth`, `FrequencyShifter`, `Phaser`, `PitchShift`, `Reverb`, `Noise` | granular/texture/pads and optional FX experiments | MIT repo verified, docs available | **OPTIONAL** selected nodes/authoring; `Tone.Transport` cannot replace KFB MusicClock, ensure can use current context |
| Elementary Audio (`@elemaudio/web-renderer`) | declarative dynamically updated DSP graph, oscillators/noise/resonators/effects | MIT upstream; web renderer accepts AudioContext | **OPTIONAL / promising custom DSP donor**, one isolated patch first; no parallel audio master |
| FaustWasm `grame-cncm/faustwasm` | complex filter/modulation/physical/spectral DSP compiled to WASM/Web Audio nodes | current repo technically active, GitHub SPDX `NOASSERTION`; check exact code+Faust DSP/export licensing | **RESEARCH ONLY** until licensing and bundle/CPU confirmed; WASM patch can connect current context |
| `polarch/jsambisonics` | first/higher-order Ambisonic sound beds and headphone decode, e.g. dream sky/surround | BSD-3-Clause verified; current source, no KFB spatial audition | **P2 audition** for real multichannel material; HRTF and CPU/mobile cost need proof |
| Meyda | spectral centroid/RMS/onsets and timbre descriptors for visual/VFX/read-only reactive controls | MIT; realtime/offline feature extraction | **P2 optional** visual/audio-reactive input; not mastering or synthesis |
| Strudel | exploratory algorithmic/cyclic patterns; authored generative motifs | AGPL; default sample banks separate rights | **IDEATION / POSSIBLE OFFLINE AUTHORING**, avoid direct runtime embedding without license compatibility, sample rights and separate clock review |
| RNBO (Cycling '74) | visual DSP patching exported to AudioWorklet/WASM | paid authoring and export-license restrictions | **optional professional authoring**, commercial rights check; not needed to start |
| Three.js `PositionalAudio` + `AudioListener` | attach sources to canonical camera/objects; spatial movement | built on Web Audio | **KEEP consumer adapter**, does not synthesize sound itself |
| Unity/Wwise/FM0D concepts | state/interactive music inspiration only | proprietary/runtime incompatible with web-first by default | **pattern references**, not web owner |
| Sound Forge | genre+SFX offline generation and preset variation | no declared license, not 3D/ecology | **reference only**, not embed |

## Auditable DSP experiments (a single candidate each; never a new engine)
1. **Slow drone field**: two gently detuned partials + bounded inharmonic overtones, slow filter movement + noise breath; optionally derive mood scalar from `mindscapeDepth`; low bass alternative, constrained loudness. Compare *existing Iceberg Atmo source* in isolation before writing new patch.
2. **Granular memory**: licensed 3–10-second source fragment with asynchronous short grains and a limited stereo cloud; bounded voices and pitch range; no whole-song vocals mutated without rights/voice consent. If Web Audio nodes insufficient, narrow AudioWorklet prototype, offline bake fallback.
3. **Threshold acoustic geometry**: approaching portal interpolates early-reflection/reverb/filter, then at threshold swaps place acoustics while physical emission remains location-correct. Three.js provides position; game/World provides threshold truth.
4. **Mechanical/organic phasing**: irregular pulse evolves from clock/mechanical sources into wet/breathing organic sound, then converges into an authored Sonus/B/C passage; no arbitrary synchronization of physical sources.
5. **Audio-reactive mural**: onset/centroid or authored event envelopes drive clay ripple/stage lighting; use event envelope when available instead of extra FFT load. Audio drives presentation only, not World physics authority.
6. **Acousmatic card**: source-isolate a genuine analog sound, transform it by convolution/reversal/ring modulation into a Card-Egregore signature; A/B original vs transformed then catalog rights+seed+source metadata.
7. **One hybrid forest**: authentic organic bed (R1) over slowly deforming instrumental drone; spatial waterfall/whisper and optional surreal wings only when scene state authorizes them.

## Psychoacoustic / spatial design precautions
Headphone binaural mixes are not equivalent to loudspeaker playback; provide stereo/speaker-friendly fallback and explicit headphone-only 3D mode when meaningful. Convolution/realtime binaural/HOA are CPU-expensive on mobile; keep distant sources pre-baked, near ones spatial, allow reduced spatial quality. Never assume a fixed hardware device sample rate, autoplay, low-level hearing threshold or precise device sound pressure. Avoid unbounded low-end energy or feedback loops. Binaural beating/isocronic-pulse recipes are creative textures, **not therapy claims**.

## Sources (verified external descriptions, NOT benchmarked in KFB)
- https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API
- https://developer.mozilla.org/en-US/docs/Web/API/AudioWorklet
- https://developer.mozilla.org/en-US/docs/Web/API/OfflineAudioContext
- https://tonejs.github.io/docs/ (GrainPlayer, synths, effects; MIT at https://github.com/Tonejs/Tone.js)
- https://www.elementary.audio/docs/packages/web-renderer and https://github.com/elemaudio/elementary (MIT)
- https://github.com/grame-cncm/faustwasm (license requires exact dependency/redistribution check)
- https://github.com/polarch/jsambisonics (BSD-3-Clause)
- https://github.com/meyda/meyda (MIT)
- https://strudel.cc/ (AGPL upstream; separate soundbank rights)
- https://rnbo.cycling74.com/learn/the-web-export-target and https://support.cycling74.com/hc/en-us/articles/10730637742483-RNBO-Export-Licensing-FAQ
- https://threejs.org/docs/pages/PositionalAudio.html

## Acceptance boundary
Only native / already-licensed code and source-backed real clips can be implementation candidates; all others are design references. The current research proves exact-source reading, **0 browser DSP audition, 0 source-isolated aural checks, 0 performance measurement**.
**Next gate remains:** `VS0_SONIC_ECOLOGY_SOURCE_ISOLATION_AND_ONE_MINDSCAPE_01` (three sound classes in isolation, one 60–120s Real → Dream → Real mix).
