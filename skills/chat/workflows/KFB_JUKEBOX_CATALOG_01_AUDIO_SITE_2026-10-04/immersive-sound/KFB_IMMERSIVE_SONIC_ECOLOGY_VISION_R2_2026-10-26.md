# KFB Immersive Sound Universe · Sonic Ecology + Dream Acoustics R2
**Date:** 2026-10-26 · **Status:** PROPOSED CREATIVE DIRECTION / RESEARCH; not runtime, artistically accepted audio, new product owner or deployed site.
**Current owner:** existing KFB Audio & Soundscape / Audio Site (PR #350), source/bus/mix/MusicClock owner; related PR #352 source intake and PR #365 music/voice work retain own status. **Delivery:** authoring/VS0 research into same owner, consumer-specific World/Mindscape adapters only.
**Additive source route:** Draft PR #453, branch `research/kfb-nature-orchestra-vs0-2026-10-26`, stacked on #350. Prior Nature Orchestra R1 under `nature-orchestra/` remains a subordinate source family. This R2 **overrides Nature-only framing** for the research slice, without deleting or falsifying R1 or changing the parent Audio Site's existing next gate.

## 1. Creative intent
Do not equate 'immersive ambient' with nature loops, spa music, drones or a generic effects rack. Target an **expressive, evolving, occasionally psychedelic acoustic world** where recorded reality, synthesized sound, authored KFB music and narrative events form spatially intelligible but surprising experiences.
- Long-listenable and exploratory; avoid fatigue or a permanent attention-grabbing score.
- Psychedelic = perspective, scale, spatial transformation, spectral causality, meaningful metamorphosis and timing — not merely excessive reverb/phaser or disorienting high volume.
- Make silence, foreground detail, scene contrast, imperfections and surprise first-class instruments.
- Sources have identities: field recordings, licensed Foley, authored stems, algorithmically synthesized textures, derived assets, AI-generated candidates, Resident voice, diegetic machines, physical game SFX. Never falsely attribute invented species/physical origins.
- Each Mindscape/Deck/Story beat can reinterpret the *same* sound source, but preserve an intelligible anchor so transformations have an audible cause.
- Source truth and procedural glue coexist: Sonus/Suno masters and authorized stem families remain curated musical identity; organic/abstract/acousmatic material can be non-metrical and free-running.

## 2. Sound palette / axes, not eight isolated subsystems
1. **Natural & organic**: nature, insects, rain, animal voices, branches, underwater, fire; ecology when actual natural place, deliberate fiction when Dream.
2. **Physical & material**: footsteps, cardboard/clay deformation, mechanical clocks, machinery, fluid impacts, combat/vehicle/weather, crackles, resonators driven by existing scene physics.
3. **Atmospheric & tonal**: tonal drones, modal overtones, beating pairs, warm/inharmonic oscillators, texture pads, slow low-frequency modulation; no mandatory constant sub-bass.
4. **Granular & microscopic**: micro-cuts and grains from rights-cleared voices, instruments and ambient clips; time stretching, randomized grain clouds, pitch/position windows, pointillist dust, frozen resonances. Heavy processing should be selectively offline or via AudioWorklet and CPU-tested.
5. **Spectral & transformed**: FFT filtering, spectral tilt, convolution, delay feedback, ring/FM modulation, tape/time reversal, resonant filtering, frequency shift, morph between texture families. Distinguish realtime feasible vs pre-rendered-heavy offline.
6. **Spatial & psychoacoustic**: stereo field, near/far, height, 3D emitter motion, occlusion, acoustic room/tunnel size, early reflections, HRTF, limited ambisonic beds; binaural/beat tones may be artistic devices but never presented as medically proven brain-state or trance induction.
7. **Generative & algorithmic music**: procedural micro-motifs, harmonic constraints, chance rhythm, polyrhythm, call-answer; one existing MusicClock and phrase handling for authored/song states, not a new DAW/transport.
8. **Narrative & diegetic**: word fragments, archival radio, VO/NPCs, distant machinery, impossible announcements, talking relics, portals, mindscape memory, hallucinated acoustics. Dialogue must remain legible with current ducking and semantic priority.
9. **Reactive & crossmodal**: authored world state → sonic rule; visual weather/shader/material/terrain/particle behavior and audio share the same state rather than coupling DSP to framerate.
10. **AI-assisted authored source**: ElevenLabs SFX, Suno/Sonus songs/stems, occasional generated world textures and recorded performances as *assets* with rights, provenance, approved quality and edits. Do not put unpredictable per-frame generative cloud services on the real-time audio render path.

## 3. One sound architecture, multiple compositional perspectives
`Global World Bed` (quiet macro identity) + `Biome / Zone Ambience` (forest, graveyard, workshop, orbit, panopticon) + `Local Spatial Emitters` (waterfall, wheel, mouth, portal, object) + `Abstract Dream Field` (tonal/texture/acousmatic independent spatial or scene-wide layer) + `Authored Score / Sonus Stems` + `Voice / Player Critical`.
These are **source/scene roles routed through the existing bus set**, not a proposal for another global mixer:
`GLOBAL_BED | LOCAL_AMBIENCE | WORLD_SFX | DIEGETIC_MUSIC | SCORE | VOICE | UI | PLAYER_CRITICAL`.
The Dream Field maps to LOCAL_AMBIENCE, GLOBAL_BED or SCORE according to its actual semantic purpose — no mandatory new `DREAM_BUS`.
One active AudioContext, one master limiter/mixer, one existing MusicClock/phrase scheduling and voice ducking. Travel and consumer audio adapters remain individual authoritative presenters, not rival global runtime instances. Sound designers edit parameterized *recipes*, not replace the game's movement/physics/day-night truth.

## 4. Generative dramaturgy: an orchestration policy, not random audio soup
Three independent time scales:
- **micro (0.1–5 s)** crackles, percussive accidents, insect chirps, resonant attacks, small flutters;
- **meso (5–120 s)** call-response, melodic fragments, modulated wind/rain, tonal clusters, reverberant events, environmental encounters;
- **macro (2–30 min and longer)** slow world/biome shifts, sonic morphs, narrative movement, tension/release, listening-focus changes, near-silence.
Actions are `entrance`, `emergence`, `reply`, `move`, `mutate`, `fade`, `rest`, `transition` with authored constraints. Use seeded stochastic renewal distributions/shuffle-bags and refractory windows where appropriate; avoid pure constant-rate uniform events and obviously repeated short loops.
Real ecology uses place/time/species constraints; abstract realms deliberately bend them with explicit `dreamRule` and intensity. Music transitions may respect B/C/D phrase grid; local nature, machinery and voices must not be quantized to beat just to synchronize everything.
The conductor *reads* authoritative `biome, deckTheme, region, timeOfDay, weather, surface/material, motion, danger, social, narrativeBeat, mindscapeIntensity, voiceFocus, seed`. Fields are optional and never invented if no owner signal exists.
A meaningful quiet scene can emit no continuous audio and still be valid.

## 5. Psychoacoustic effects as bounded authored choices
- **Apparent scale** from spectral roll-off/early reflection/reverb/attenuation, without making speech unintelligible.
- **Spatial paradox**: a whisper initially behind then ahead of listener; one sound apparently approaches across a larger-than-visible world; tie to a portal or Mindscape threshold.
- **Tonal drift / beating**: intervals slowly diverge then converge, with limited loudness and frequency; avoid strong continuously penetrating sine waves.
- **Acousmatic object logic**: an object reveals an impossible source when approached, but emitter position and audition provenance remain traceable.
- **Musical ambiguity**: slowly varying tonal centers, fragile spectral fragments, asynchronous motifs and dissonance that resolves into KFB-approved authored score.
- **Masking contrast**: sudden reduction of an otherwise dense field allows a small voice or distant detail to become emotionally salient.
- **Memory and recursion**: a motif heard in a Mindscape reappears altered at a portal, deck, rest stone or Life Tree; a sonic signature can link 56 Decks without fixed location.
- **Nonlinear perception** is artistic sound staging, not therapeutic efficacy. Optional reduced-motion/reduced-intensity/reduced-bass/headphone alternatives should be supported.

## 6. Four representative scene recipes
### A · FrizzleBob's Reflective Dream Journey
Quiet real outdoor air or indoor room tone; sparse water; a lone melodic glass pluck; slowly evolving shared-interval pad from Sonus; one distant voice/meaningful archival fragment (only with provenance/rights); a slight grain-cloud bloom triggered by a Card revelation; gentle silence during narration; resolution to authentic source bed. Listener can opt out of psychedelic transform while nature remains.
### B · Egregore / morphogenetic Mindscape
Thought field represented by one semantic motif/poem fragment (licensed); as more NPCs adhere, distribute related resonant agents through positions and density *without* necessarily increasing total loudness. Field becomes wider, more spectrally rich, and occasionally unstable; counterthought causes thinning/voids and harmonic friction; Card/rest-stone and portal preserve identity and intentionally reveal transition.
### C · Panopticon / HyperNormalisation
Dry mechanical repetitions; subdued siren/announcer; filtered fragments of genuine historical broadcast or permitted original spoken lines; distant metallic knocks and procedural crackle; a slow bureaucratic groove that loses beat stability; normal room tone on leaving. Avoid fake historical quotations disguised as sources.
### D · Utopia → Dystopia → Protopia threshold
Utopia: high air, organic detail, warm tonal intervals and space. Dystopia: narrow resonance, dry machine grid, negative space plus distant surveillance tone. Protopia: mixed organic/acoustic texture, grounded irregular rhythm and humane motifs; preserve energy and life without simplistic major=good/minor=bad. Crossfade physical environments freely; musically phrase-align only compatible KFB masters/stems.

## 7. Authoring workflow and existing tooling
- **Curator/Audio Site**: use canonical Site Catalog, Soundscape/Sources, Prompt Studio and current B/C/D + future approved stem features; add new *source family metadata and preview authoring* only in existing owner's architecture.
- **Asset Librarian/Inbox**: existing import, provenance, license/rights, artist, preview/derived material. Track `original | generated | synthesized | transformed`, instrument/metadata, recipe/seed, master SHA256, source-rights, clip-quality test, re-export path.
- **Offline authoring**: Web Audio OfflineAudioContext for small DSP/WAV, licensed tools or DAW for heavier granular/spectral/impulse processing. Store accepted runtime derivatives with same provenance as source.
- **Source isolation**: actual source WAV/repo source object alone first. An asset URL resolving or a repository source description is not a listening acceptance.
- **Listener UX**: one meaningful `A / B` source-only vs hybrid comparison, scene/moon/day mood controls already exposed if consumer needs them, and accessibility alternatives. Avoid a second complicated DAW-style site.
- **Visual coupling**: e.g. each ambient stem or event sends read-only RMS/onset/centroid to light/particles/foliage, but only on explicit event-to-visual mapping; avoid everything pulsing on every beat.

## 8. What NOT to do
No generic 'psychedelic scratch' pattern engine: KFB Race A3 Psychedelic Scratch/palettes/patterns were rejected. No universally accepted oscillator tire squeal: Race A2 sustained synthetic friction rejected. That rejection is for those specific sources/contexts, not a veto on sound synthesis in Dream Acoustics.
No blanket auto-select `stems` just because a source folder exists: PR #352 source-only stem certification distinct from playback-ready and from deployed site truth.
No commercial release of CC BY-NC / unlicensed Sound Forge code; no copy of license-unclear DSP; no import of sample packs merely because they have a GitHub URL.
No always-loud noise beds, constant filtered pink noise masquerading as nature, abrupt zone cuts, universal “trippy” phasers, inaccessible headphone-only positional cues, or multiple Web Audio contexts.
No claims of spatialized 3D simulation until actual source, mix and browser (including iOS) prove it.

## 9. Staged research-to-production path
**R2 scope now:** broaden art direction, classify reusable donors and author the next VS0 intake. No implementation or Stage/public route required.
**VS0 Gate / prototype:** source-isolate THREE palette references (1 real organic/field sample, 1 real KFB musical pad/stem source, 1 permissible synthesized/acousmatic DSP recipe). A/B dry vs composed within ONE existing Audio Site owner; prove source/provenance/rights; choose one 60–120s transition `REAL → DREAM → REAL` with narration/duck and spatial anchor. Nature first is an available option, **not the only or mandatory aesthetic direction**.
**Later after source evidence:** a few authored Mindscape recipes with reusable archetype mappings, seeded nonrepetition 30-minute trace, 10-minute fatigue, one mobile browser and a meaningful listener evaluation. Separate consumer integrations then follow owner-specific QA. Cloudflare formal Stage only if explicitly required after Site-first real product QA.
**Exactly one next gate (this research side lane): `VS0_SONIC_ECOLOGY_SOURCE_ISOLATION_AND_ONE_MINDSCAPE_01`.** This supersedes the narrowly named R1 forest intake gate for R2 *research routing*, not the parent Audio Site's `WORLD_AUDIO_CONTEXT_BCD_ADAPTER_01`.
