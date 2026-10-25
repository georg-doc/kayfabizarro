# KFB Nature Orchestra · Real Field Recordings + Procedural Browser Biomes · R1
Date: 2026-10-26 · Mode: RESEARCH / HANDOVER · Owner: existing KFB Audio & Soundscape / KFB Audio Site · VS0 is the future receiving executor, not a new owner.

## Outcome and authority
Document an additive nature-sound bank and ecological/adaptive soundscape recipe for Mindscapes, dream journeys, World/Town/Travel and the existing global bed, jointly with Sonus/Suno masters, stem families and possible ElevenLabs-generated **candidates**. No runtime, second mixer, website, new asset registry, AI-synthesis license grant, production import or deployment is authorized. Current canonical Audio Site: https://kfb-audio.frizzlebob.chatgpt.site/ . Branch base: PR #350 Audio Site head baa76264882b5c2ec1cac49ac5ec4f248e32f431. Separate PR #352 intake/mixer fold has documented frozen Sources binding seam: do not fold/rewrite it here.

## Existing source truths (read before implementation)
- `skills/chat/workflows/KFB_AUDIO_SOUNDSCAPE_BASELINE_V1_2026-09-24/{START_HERE,INVENTORY_AND_ARCHITECTURE,RECOVERY,RETURN}.md`: AUDIO-CAL-01 has Georg listening PASS; existing roles `GLOBAL_BED | LOCAL_AMBIENCE | WORLD_SFX | DIEGETIC_MUSIC | SCORE | VOICE`, duck without stopping music, one AudioContext, silence valid.
- `skills/chat/workflows/KFB_AUDIO_SOURCE_INTAKE_01_2026-10-04/KFB_MUSICAL_WORLD_STRATEGY_2026-10-04.md` on PR #352: physical SFX / musical Ambient Beds / activity-performance layer; adaptive world state vector, DJ phrase transitions; physical nature/weather is not quantized to song BPM.
- PR #350: existing Audio Site B Explore/Adventure, C Stay/Cozy, D Conversation states; same AudioContext/MusicClock, external World adapter and existing TTS focus/duck; stems explicitly FUTURE_NOT_AVAILABLE in that source.
- PR #352: 69/59/29 catalog in its source/intake branch and 17 ElevenLabs test candidates; Ambient Bed masters Utopia 73, Protopia 78, Dystopia 98 BPM; stems source-only. This is **not** proof they are present in the deployed Audio Site. Physical rain still SOURCE_REQUIRED. No claim a generated stem is certified.
- `skills/chat/ASSET_LIBRARIAN_PRIVATE_AUDIO_INTAKE_PREP_2026-10-08.md`: existing Registry/Librarian and Production Inbox, private-preview rule and structured per-asset provenance. Use them; do not create second library/inbox or publish private binaries.
- Travel donor `KFB-Travel-Globe/travel/globe-v13/travel-audio.js`: global wind/rumble, SFX, drone/reverb, duck and lifecycle. The world/host remains the physical/weather/ecology truth. Audio consumes states only.

## Four complementary layers: Nature Orchestra
1. **Field-recorded base / GEOPHONY:** clean wind through canopy, moving water, distant ocean, soft rain and air/water texture. Prefer 2+ independent long takes crossfaded at different offsets; true stereo if available. Ambient bed is **not** a 30-second chirping track looped conspicuously.
2. **Biophony and micro-emitters:** actual birds/insects/amphibians/mammal/wings/branches, nearby and distant, left-right, canopy/floor/shore; species/place/time metadata when **confirmed**, never invented from filename or random AI output. Sparse interactive response (one bird answers another), flight path, varying density. Let events leave room for quiet.
3. **Procedural physical glue:** filtered stochastic noise and sparse droplet/leaf/gust grains driven by weather/vegetation/water/wind plus optional light convolution/occlusion. AudioWorklet/OfflineAudioContext can produce/debug signal. Synth is strongest for distributed rustle/wind/rain/water-detail; use authentic recordings for identifiable species calls instead of fake indiscriminate chirps.
4. **Authored dream/musical layer:** Sonus/Suno/KFB Ambient Beds / certified stems, plus optional synth drone/ambient pad that color the scene *without pretending to be biological field recordings*. A surreal dream may use transposition, spectral blur and timed contrast deliberately, marked as `dreamTransform`. Physical events remain asynchronous; only musical pads follow KFB music/phrase clock.

These map into the current buses: broad non-positional low-level physical world = GLOBAL_BED; wetland/forest/shore = LOCAL_AMBIENCE; waterfall/one bird/branch/stream = WORLD_SFX spatial emitter; ambient music = SCORE (or DIEGETIC_MUSIC when attached to world source); addressed narrator = VOICE. The Nature Conductor is **data/scene automation attached to existing mixer**, not a second AudioContext, KFB global transport or master mixer.

## Ecology / dramaturgy instead of generic random layers
One biome recipe uses `biome, geography, season, timeOfDay, weather, canopy, altitude, waterProximity, playerSpeed, listeningFocus, narrativeBeat, seed` from **existing** consumers; not every field must exist in v1. Ecological eligibility matrix: avoid nightingale/morning dawn chorus at midday; tree canopy species should appear above listener; pond frogs clustered by water/season/night; arid biome uses wind/insects sparingly, not European forest bird loops. Tropical-specific fauna only when corresponding source/location is verified. A surreal exception is explicitly tagged `dreamRule`, not an unnoticed ecology error.

Events drawn from density envelopes (e.g. diurnal dawn/midday/dusk/night), bounded semi-Markov/renewal intervals with per-emitter refractory cooldown and no-repeat windows; shuffle bags weighted by source quality, caller identity, distance and prior-use debt. Avoid correlated obvious identical call repetition, and avoid entirely uniform background noise. Bird duet/call-response can alternate emitter positions with natural 0.6–4s irregular pauses *as a tunable artistic baseline, not ornithological truth*. Use scene-tuned ensembles and purposeful quiet/call-outs: `awakening → immersion → encounter → clearing → transition` for dream journeys, with voice focus suppressing busy calls but not muting world.

Example **temperate forest dawn**: soft distant leaf/canopy broadband field bed; 1–3 spatial bird positions; a brook confined to a water feature; a low probability branch/wing transient; one long interval with no foreground birds; gradually increase density at dawn, then taper on narrator voice; music D is available but not forced. **Coastal night**: long irregular waves and wind; insect/frog only if an actual compatible coastal/wetland ecology exists; do not layer a forest dawn loop over waves. **Dream/Protopia**: keep authentic live texture, allow *intentional* spectral harmonics/slow choir/pad, KFB Ambient Bed C as optional musical color, negative space on speech.

## Nonrepetition and cost design (proposal, not measured)
- Long seamless environmental take OR 2–3 independent takes with equal-power crossfades (avoid phasing from same recording).
- Short calls chosen from at least 4–8 independently distinct cues **per active call family** where feasible; no same source re-trigger within approx. 90–180 seconds, tunable by catalog size. Do not make this numerical target block v1 if assets are missing.
- Distinct sources may overlap, but gate density by listener focus, ecological limits and active/polyphony cap; do not trigger a whole forest of individual Three.js positional nodes by default.
- Probabilistic patterns need deterministic seeded replays for QA but should vary between sessions; record seed and event log to detect repetitive schedule.
- Inactive/inaudible emitters virtualized; far canopy groups become a low-cost nonpositional bed and near-field emitters promoted via panning/attenuation. Spatial budget and mobile browser CPU cap are evidence-driven, not assumed.
- Sample masters losslessly preserved privately with SHA-256; derived Opus/Ogg, MP3/AAC fallback by actual browser support; do not ship giant raw wav for every world. Evaluate iOS Safari decode and autoplay directly.
- Browser user-gesture starts existing AudioContext; suspend/resume/page-visibility/state transitions must not unleash queued events or re-phase music.

## Browser/Three.js technology assessment (as of 2026-10-26)
| Candidate | Can do | Verdict / protected seam |
| --- | --- | --- |
| Native Web Audio `PannerNode`, `StereoPannerNode`, `BiquadFilterNode`, `ConvolverNode`, `DynamicsCompressorNode`, `OscillatorNode`, `AudioBufferSourceNode` | Real-time spatial emitters, filtering/occlusion approximation, wind/noise envelopes, delay/reverb | **KEEP / primary**, reuse current AudioContext buses, do not recreate routing |
| `AudioWorklet` (HTTPS secure context) | sample-accurate-ish low-latency custom DSP/noise/granular synthesis off main UI thread | **ADAPT / prototype** only for quality/perf proven needs; avoid deprecated ScriptProcessorNode |
| `OfflineAudioContext` | render same procedural recipe offline, capture deterministic golden comparisons | **KEEP test tool**, not second playback engine |
| Three.js `AudioListener`, `PositionalAudio`, `Audio` | scene-attached 3D emitter plus global audio with native Web Audio | **KEEP existing scene adapter**; map to shared mixer rather than attaching another master |
| Tone.js (MIT) | transport, synth, modulated pads and effects | **OPTIONAL DONOR ONLY** for synth voices/effects; its transport must **not** replace existing KFB MusicClock/phrase schedule |
| howler.js (MIT) | cross-browser sound playback/sprites/spatial controls | **OPTIONAL / likely redundant** in current site; avoid a separate Howler global AudioContext |
| Resonance Audio Web SDK | ambisonic spatial audio reference | **HISTORY DONOR ONLY**, GitHub archived 2026-04-19; not preferred production dependency |
| WebGPU / GPU visual shaders | scene-driven visual weather and ecological input | **NOT audio renderer**. Use same authoritative weather/biome inputs to drive both modalities; don't bind audio timing to frame rate |

Source anchors:
- MDN Web Audio API: https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API
- MDN AudioWorklet: https://developer.mozilla.org/en-US/docs/Web/API/AudioWorklet
- MDN best practices/autoplay: https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Best_practices
- Three.js PositionalAudio: https://threejs.org/docs/pages/PositionalAudio.html
- Three.js Audio: https://threejs.org/docs/pages/Audio.html
- Tone.js: https://github.com/Tonejs/Tone.js (MIT)
- howler.js: https://github.com/goldfire/howler.js
- archived Resonance Audio: https://github.com/resonance-audio/resonance-audio-web-sdk

## Rights and acquisition logic
Prioritize **CC0 1.0, explicitly public-domain individual audio files**. CC0 permits commercial reuse without required attribution, though creator/source metadata are still mandatory **internally** for provenance and good-faith credits. The file's own sound page, download license snapshot and original bytes must be pinned before a real import. Freesound generally requires login for full download; page proof is NOT downloaded sample proof. Creative Commons legal summary: https://creativecommons.org/publicdomain/zero/1.0/ . NPS Natural Sound Gallery explicitly marks listed downloadable files public-domain and *requests* appropriate credit: https://www.nps.gov/subjects/sound/gallery.htm . For NPS validate each actual file/scope before promotion.
- CC BY *does require attribution*: https://creativecommons.org/licenses/by/4.0/ ; no straight `no-credit` treatment.
- CC BY-NC not suitable as automatic candidate for commercial/public KFB: https://creativecommons.org/licenses/by-nc/4.0/ .
- Pixabay allows no-attribution project use but disallows standalone distribution and has broad collection restrictions; **not equivalent to CC0** and not a default KFB source bank: https://pixabay.com/service/license-summary/ .
- Mixkit Sound Effects Free License allows integrated projects but not stand-alone/source redistributing or a tool/template: no default bank redistribution: https://mixkit.co/license/modal/sfxFree/ .
- xeno-canto / other wildlife collections require per-recording license vetting, typically attribution and/or noncommercial; do not scrape/ingest them wholesale.
- AI/ElevenLabs-generated assets must be individually checked against account's commercial/export/ownership terms **and** listening acceptance; they are not inherently CC0 or field recordings. Freesound now separately records AI-training uploader preferences (July 2026): do not equate reuse rights with permission to train a model or treat recorded fauna as free model-training data.

## Discovery classification
`NATURE_SOURCES_R1.json` lists concrete sound-page candidates with observed file-level CC0 declarations and source URLs, along with known defects (traffic bleed, short loop, long raw size, potential taxonomy unknown). No file bytes downloaded, no login/autoplay listening proof, no acoustic scoring, no species confirmation. All are `DISCOVERED_CC0_PAGE`, *not* `LICENSE_SNAPSHOT_AND_BYTES_VERIFIED` or `GOLDEN`. Read the URL live at import and preserve screenshot/HTML license text, original filename, SHA-256, date, byte size, producer and original URL. License proof alone does not imply fit for an immersive, ecologically coherent biome.

## Proposed thin data contract (adapt to owner schema; do not make a new runtime asset registry)
```json
{
  "assetKey": "nature.forest.birds.poland.loop01",
  "audioClass": "AMBIENCE",
  "layerRole": "LOCAL_AMBIENCE",
  "origin": "FIELD_RECORDING",
  "rights": {"licenseId": "CC0-1.0", "sourceUrl": "...", "evidenceStatus": "DISCOVERED_CC0_PAGE"},
  "ecology": {"biome": ["temperate_forest"], "time": ["day"], "speciesTaxon": null, "geography": ["Poland"], "confidence": "site_description"},
  "mix": {"loopClass": "candidate", "spatialClass": "broad_bed", "priority": "background"},
  "qa": {"bytesVerified": false, "listeningAccepted": false, "loopTest": "pending"},
  "delivery": {"privateMaster": null, "runtimeUrl": null}
}
```
`source-only` and `candidate` cannot silently become `runtime`. Per-file binary license gate is separate from programmatic synthetics.

## VS0 staged implementation blueprint
A. **Inventory/rights and isolation**: fetch live KFB Audio Site source/PR #350 and #352 latest, Registry, World/Travel audio adapters; review candidates 1-by-1 and **audition each field recording in isolation**. Reject any that contains audible traffic/voices/out-of-biome fauna. Verify license, bytes/hash, origin, channels/duration, loopable regions, intensity and permitted redistribution. Place accepted metadata in existing Asset Registry; new binaries via current approved Inbox/media storage only. Preserve source path and derived codec records. No synthetic replacement for authentic field source.
B. **Nature Conductor R0, one forest**: existing Audio Site/mixer consumes ONE biome profile `temperate-forest-dawn`, two independent forest/wind beds + 4-8 short calls where available + one spatial brook, 30-minute seeded repeat test, speech focus D and music C, wet/dry transition; one AudioContext, all buses current. Source isolation before mixing.
C. **Synthetic companion A/B**: generate wind/canopy rustle and variable rain via native Web Audio + optional AudioWorklet prototype; contrast against source-only mix. Try optional subtle Tone.js ambient drone pad **through existing SCORE bus/music clock**; no independent Tone transport; audio out never louder than dialogue/critical SFX.
D. **Biome growth and dream scenes**: wetland dusk / coast wind / storm / nocturnal desert (the last SOURCE_REQUIRED), plus surreal `dreamTransform` overlays and Ecological vs Dream toggles; musical status B/C/D, phrase-aware music transitions, physical layer uninterrupted. Same World/Travel/Mindscape context request contract. Real species geography and biogeography, weather, narrative input; never 4 independent audio runtimes.
E. **Audio Site first**, existing Site update in place via capable publisher only if coherent QA-green product; formal Cloudflare Stage is not required for current RESEARCH/HANDOVER. The historical AUDIO-CAL-01 route exists, but is not new Nature proof. No new public acceptance URL asserted.

## Acceptance / independent proof later
Source: ≥1 actual isolated wave/source listening proof; license evidence snapshot + SHA-256 + download permission + no traffic contamination, sample/codec inventory; serializable manifest and exact-source references.
Static: role mapping, per-asset CC0 claims verified, no private original public URL, no second registry/context, source-only fields fail closed.
Browser: one AudioContext; existing clock ownership; user-gesture and iOS resume; streaming/decode fallbacks; narrator focus reduces active calls/bed but *does not pause score or stop world time*; deterministic seed/event scheduling; simultaneous World visual and sound biome match; no bursts after tab wake; same-seed replay; mobile CPU and output monitoring.
Listening: forest dawn, wetland dusk, coast wind, dream journey; isolated authentic samples, source-only vs source+synthetic A/B, 10-minute fatigue and 30-minute nonrepetition, transition and voice audibility. Listening classification remains human, not inferred from static PASS.
Independent Tester/Critic/Guard per KFB production rules for substantial implementation. After two non-improving repairs, quarantine smallest seam, preserve evidence.
**Exactly one next gate:** VS0 AUDIO NATURE SOURCE-ISOLATION + 1-FOREST ADAPTER INTAKE: confirm current Audio Site owner/head, select and binary/rights-check a small CC0 corpus, audition one `temperate-forest-dawn` source-only mix with optional synthetic A/B, then decide a bounded implementation route. No human gate invented merely for the document.
