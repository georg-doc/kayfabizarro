# KFB Cartoon SFX · Research Source Matrix

Status: RESEARCH CHECKPOINT A
Verified: 2026-10-03
Workflow: KFB-SFX-LANGUAGE-SKILL-01
Owner: KFB shared skill layer · georg-doc/kayfabizarro
Branch: chatgpt-web/kfb-sfx-language-skill-01-2026-10-03

Purpose: source-backed baseline for a reusable cartoon / 3D-game SFX language. This document is research evidence, not an audio runtime owner.

## Evidence classes

- **P1 · official engine / middleware documentation** — supported mechanisms and implementation vocabulary.
- **P2 · developer / shipped-game primary or specialist interview** — production practice from shipped games.
- **P3 · academic / perceptual research** — perceptual and physical basis.
- **P4 · practitioner tutorial** — concrete authoring/implementation workflow.
- **R · public repository/demo** — architecture/code examples; license must be checked before reuse.
- **KFB · repository donor evidence** — current KFB contracts/results to retain or explicitly reject.

## A · Runtime semantics, variation and voice management

| ID | Class | Source | Evidence / use |
|---|---|---|---|
| A01 | P1 | Unreal Engine · MetaSound Templates Quick Start · https://dev.epicgames.com/documentation/unreal-engine/metasound-templates-quick-start-in-unreal-engine | Procedural templates explicitly target footsteps, randomized weapon fire and ambient layers; useful evidence for parameterized sound recipes. |
| A02 | P1 | Unreal Engine · MetaSounds Quick Start · https://dev.epicgames.com/documentation/unreal-engine/metasounds-quick-start | High-performance DSP graph with gameplay-driven 3D sound sources; useful as an engine-specific expression of a provider-neutral recipe model. |
| A03 | P1 | Unreal Engine · Sound Concurrency Reference · https://dev.epicgames.com/documentation/unreal-engine/sound-concurrency-reference-guide | Concurrency groups cap simultaneous sounds and define resolution/voice-steal rules; semantic priority is a first-class production concern. |
| A04 | P1 | Unity · Audio Random Container reference · https://docs.unity3d.com/6000.0/Manual/AudioRandomContainer-UI.html | Random volume/pitch, sequential/shuffle/random playback and avoid-repeat behavior support variation pools rather than single-file events. |
| A05 | P1 | Unity · AudioSource.priority · https://docs.unity3d.com/6000.0/Documentation/ScriptReference/AudioSource-priority.html | Voice virtualization is priority-aware; supports explicit critical/world/UI priority rather than solving clutter with level alone. |
| A06 | P1 | FMOD Studio · Parameters · https://www.fmod.com/docs/tutorials/parameters.html | Game variables can continuously control event/snapshot/bus behavior; supports energy, speed, material, state and distance parameters. |
| A07 | P1 | FMOD Studio · Instrument Reference / Scatterer · https://fmod.com/docs/2.03/studio/instrument-reference.html | Playlist selection, temporal/spatial randomization, individual pitch/level variation; useful for non-repeating texture systems. |
| A08 | P1 | FMOD Studio · Concepts / Parameter Sheets · https://www.fmod.com/docs/2.04/studio/fmod-studio-concepts.html | Events can switch/trigger content from game-state parameters without moving gameplay truth into audio. |
| A09 | P1 | Audiokinetic · WwiseDemoScene Footsteps · https://www.audiokinetic.com/en/public-library/2024.1.8_8898/?id=pg_demoscene.html&source=Unity | Recommended pattern: Random Containers per surface nested under a Switch Container; one Footstep event plus surface-material switch. |
| A10 | P1 | CRYENGINE · Audio for animation · https://www.cryengine.com/tutorials/view/audio-and-music/audio-for-animation | Animation events, 2D/3D multi-instruments and joint-attached Foley demonstrate animation-synchronous event delivery while middleware renders sound. |

### Baseline inference

Use this provider-neutral pipeline:

`game truth → semantic audio event → parameterized sound recipe → variant/layer selection → existing mix/spatial owner`.

Do **not** make the default shared contract `event → one file`.

The consumer remains owner of contact, locomotion, animation and interaction truth. Audio consumes those facts.

## B · Perception, contact and material models

| ID | Class | Source | Evidence / use |
|---|---|---|---|
| B01 | P3 | Luca Turchet · Footstep sounds synthesis · Applied Acoustics 107 (2016) · https://www.sciencedirect.com/science/article/pii/S0003682X15001747 | Models walking/running/sliding, shoes, walker size and ground materials. Ground families include solid, aggregate, liquid and hybrid; design explicitly considers ecological validity, cartoonification, temporal control and realtime use. |
| B02 | P3 | Traer, Cusimano, McDermott · A perceptually inspired generative model of rigid-body contact sounds · https://mcdermottlab.mit.edu/bib2php/pubs/makeAbs.php?loc=traer19 | Perceptually compelling impact/scrape synthesis need not reproduce every physical detail; sound must reliably convey ecologically relevant material, mass and motion cues. |
| B03 | R/P3 | MIT ALTER / Clatter · https://github.com/alters-mit/clatter | Physics-driven impact/scrape architecture maps mass, material and motion to plausible contact sound; research/reference only for KFB unless its nonstandard license receives a separate approval. |
| B04 | R | RP.Sound · https://github.com/dickiepotter/RP.Sound | Research example of modal impact/scrape/roll, granular surfaces, footsteps and whoosh. Treat as architecture-only until repository/license is independently admitted. |

### KFB material inference

Start with broad perceptual families, then descriptors:

`SOLID_RESONANT | SOLID_DAMPED | AGGREGATE | SOFT_FIBROUS | LIQUID | HYBRID_VISCOUS | ENERGY_TECH`.

The first four physical ground families are grounded by Turchet; `SOFT_FIBROUS` and `ENERGY_TECH` are deliberate KFB extensions.

A material profile may expose:

`hardness, resonance, massFeel, roughness, granularity, wetness, hollowness, friction, debris, breakability, tailClass`.

Do not create hundreds of arbitrary mesh-specific audio categories when a perceptually meaningful family plus parameters will do.

## C · Footsteps, Foley and locomotion

| ID | Class | Source | Evidence / use |
|---|---|---|---|
| C01 | P2 | Ninja Theory · Hellblade II sound / Foley interview · https://www.asoundeffect.com/senuas-saga-hellblade-ii-game-audio/ | Procedural footfall curves avoid hand-tagging every animation; character-joint velocity drives cloth/leather/gadget layers. Landscape footsteps blend three detected surface materials by weights instead of forcing one surface. |
| C02 | P2 | Bethesda · Starfield audio interview · https://www.asoundeffect.com/starfield-game-audio/ | Player movement separates footwear/surface/speed from worn-suit Foley; modular creature footsteps/movement/impacts are selected by material, creature size and visual characteristics. |
| C03 | P2 | 11-11 Memories Retold · Audiokinetic · https://www.audiokinetic.com/rendertron/render/https%3A/www.audiokinetic.com/fr/behind-the-sound-of-11-11-memories-retold/ | Cat footsteps use continuous random-container playback with trigger rate, volume and pitch driven by speed when animation-event rhythm was unreliable. |
| C04 | P2 | Designing Sound · LIMBO interview with Martin Stig Andersen · https://designingsound.org/2011/08/01/limbo-exclusive-interview-with-martin-stig-andersen/ | Passive/adaptive footstep mixing reduces repetition fatigue and creates renewed contrast after material transitions; useful evidence that variation is more than pitch randomization. |
| C05 | P4 | Pyramind / Eric Kuehnl · Game Audio: Footstep Implementation FMOD & Wwise · https://www.youtube.com/watch?v=j99JadEO2xk | Concrete layered footstep + cloth + keys workflow; multi-sounds/random containers, small pitch variation and per-layer timing/level. |
| C06 | P4 | Henry Scott · FMOD & Unity: Footsteps & Raycasts · https://www.youtube.com/watch?v=bLjfG-0YGZ0 | Surface changes driven by raycasts/layers/tags/animation + FMOD parameters. |
| C07 | P1/P4 | CRYENGINE · Audio Showcase chapter 2 · https://www.cryengine.com/docs/static/engines/cryengine-5/categories/23756816/pages/56000697 | Left/right footsteps plus Foley, multiple source variants and pitch variation; demonstrates direct animation-to-audio trigger structure. |
| C08 | R | KomponentAB stepFX · https://github.com/KomponentAB/stepFX | Small material-area example with multiple files per material. Useful as a simple data-model reference, not a KFB runtime candidate. |
| C09 | R | Presence Footsteps · https://github.com/Sollace/Presence-Footsteps | Large material-to-sound mapping concept with fallback/custom sound packs; evidence for semantic material packs separated from world geometry. |

### Baseline inference

A footstep is not one clip.

Useful semantic ingredients include:

`foot / gait / locomotion phase / ground family / blend weights / footwear / body or actor size / worn-gear Foley / energy / slope or special state`.

Locomotion event families should at least distinguish:

`step | run_step | scuff | pivot | jump_takeoff | land | slide | roll | climb | wade`.

## D · Combat, impacts and weapon sound

| ID | Class | Source | Evidence / use |
|---|---|---|---|
| D01 | P4 | Steinberg / Formosa · Setting Up A Session For A Weapon Element For Video Games · https://www.steinberg.net/tutorials/setting-up-a-session-for-a-weapon-element-for-video-games/ | Shipped-game weapon assets are multi-element designs; organize elements into buses/markers and export coherent families rather than one flattened generic sound. |
| D02 | P1/P4 | CRYENGINE FMOD tutorial series · https://www.cryengine.com/tutorials/view/audio-and-music/audio-using-fmod-studio | Demonstrates trigger spots, animation audio, particle audio and dynamic ambience in one integrated game-audio workflow. |
| D03 | KFB | Combat Arena · `modules/kfb-arena-sfx.v4.json` | Existing KFB semantic hit/impact/aftermath priority model; player cues and spatial world impacts are already separated. |
| D04 | KFB | Combat Arena · `modules/kfb-sfx-layers.js` | Existing KFB donor for spatial attenuation/filtering, phrase pitch, polyphony/priority and explicit missing-cue behavior. |
| D05 | KFB | Mech Combat donor · `tools/KFB-ToolBox/_inbox/cloud-design-worldbuilding-2026-09-18/donor-bank/modules/kfb-mech-combat.js` | Internal donor already treats surface/material as essential to impact identity and limits competing cues within a short event window. |

### Combat inference

Separate these semantics:

`windup / swing-or-whiff / launch / flyby / confirmed-contact / block / parry / glance / break / aftermath-debris / reaction`.

A confirmed contact recipe may combine:

1. **ATTACK / TRANSIENT** — readable connection time.
2. **BODY / MASS** — perceived energy and actor/object scale.
3. **MATERIAL / TEXTURE** — target and/or source contact identity.
4. **MECHANISM / MOVEMENT** — weapon rattle, cloth, servo, scrape.
5. **SWEETENER / SIGNATURE** — controlled cartoon/sci-fi exaggeration.
6. **TAIL / SPACE / DEBRIS** — resonance, debris or environment.

This is a KFB functional-layer vocabulary, not a mandate to play six equal layers.

## E · Cartoon identity, signatures and music/SFX cooperation

| ID | Class | Source | Evidence / use |
|---|---|---|---|
| E01 | P2 | Somatone · The Audio Development of Ratchet & Clank · https://somatone.com/the-audio-development-of-ratchet-clank/ | Clank retained defined servo “Signature Sounds” while Foley experimentation found a complementary body-movement vocabulary; strong model for stable character signatures plus physical Foley. |
| E02 | P2 | Xbox Wire · Hi-Fi Rush oral history · https://news.xbox.com/en-us/2023/10/04/hi-fi-rush-exclusive-oral-history/ | Audio team was involved from the beginning because sound/game logic were coupled; useful production lesson for SFX event contracts rather than late decorative audio. |
| E03 | P2 | CEDEC 2023 · Hi-Fi Rush game/sound synchronization · https://cedec.cesa.or.jp/2023/session/detail/s6423d5c393c96.html | Gameplay, cutscenes and event systems share music timing; player/enemy attacks use instrument-like effects. Relevant as an optional KFB “musical sweetener” pattern, not a global rhythm-game requirement. |
| E04 | P2 | Unreal Engine · Hi-Fi Rush developer interview · https://www.unrealengine.com/developer-interviews/hi-fi-rush-was-inspired-by-shaun-of-the-dead-and-futurama | Shared beat information drives systems and adjustable hit timing; supports using one event/time source across audiovisual consumers. |
| E05 | P2 | Guardian · Hi-Fi Rush / Inst FX · https://www.theguardian.com/games/2023/mar/10/hi-fi-rush-fresh-take-on-the-rhythm-game-player-drives-the-music- | Instrumental attack/connect effects can join the soundtrack. KFB use should be bounded to compatible scenes/palettes rather than applied to every event. |
| E06 | P2/P3 | Insider cartoon Foley feature index · https://www.imdb.com/title/tt22302874/ | Cartoon Foley is intentionally heightened and less constrained by literal realism. Useful supporting evidence for deliberate exaggeration after the physical read is established. |
| E07 | P2 | AudioTechnology · Inside LIMBO · https://www.audiotechnology.com/features/inside-limbo | Coherent processing can unify diverse source recordings into one world aesthetic; demonstrates that a consistent sonic surface matters as much as individual realism. |

### KFB stylization inference

Cartoon sound is not “add a random funny noise.”

Default sequence:

`credible cause → readable material/mass cue → one chosen exaggeration → coherent signature/tail`.

Good exaggeration dimensions include:

`scale | elasticity | resonance | velocity | wobble | tail | harmonic/musical identity`.

For passive/chill play, preserve breathing room and pleasant texture. Reserve stronger transients and dense stacks for events that actually deserve attention.

## F · Public repositories / demos

| ID | Class | Repository | Admission status |
|---|---|---|---|
| F01 | R | Unity Technologies · audio-examples · https://github.com/Unity-Technologies/audio-examples | Official conceptual example; current repo includes a simplified Scriptable Processor Random Container. Unity Companion License: do not assume provider-neutral code portability. |
| F02 | R | FMOD · unity-feature-demo · https://github.com/fmod/unity-feature-demo | Broad Unity + FMOD feature demo and useful implementation blueprint. Inspect exact LICENSE/revision before copying code into KFB. |
| F03 | R | Audiokinetic · Gyms · https://github.com/audiokinetic/Gyms | Official Wwise Unity/Unreal working examples/tests; README declares dual license including Apache 2.0. Engine/middleware example, not shared KFB runtime. |
| F04 | R | VilleOjala · FMOD-Unity-Tools · https://github.com/VilleOjala/FMOD-Unity-Tools | MIT; includes triggering/randomization, Animator/Timeline integration, third-person footsteps, surface detection, reverb areas and occlusion. Good architecture/code donor where Unity/FMOD is actually the consumer. |
| F05 | R | ALTER-MIT · Clatter · https://github.com/alters-mit/clatter | Excellent contact/material research blueprint; current repository uses a nonstandard Hippocratic license. **Architecture/research only unless a separate license decision explicitly admits code.** |
| F06 | R | Godot demo projects · https://github.com/godotengine/godot-demo-projects | Broad engine examples; useful only when a Godot consumer exists. |
| F07 | R | Presence Footsteps · https://github.com/Sollace/Presence-Footsteps | Material-pack/fallback reference for a large surface vocabulary. License must be rechecked at the exact revision before code reuse. |
| F08 | R | KomponentAB stepFX · https://github.com/KomponentAB/stepFX | Tiny practical surface mapping example; concept reference only unless exact license/source revision is captured. |
| F09 | R | RP.Sound · https://github.com/dickiepotter/RP.Sound | Interesting physically inspired educational/showcase architecture. Repository availability/license was not independently established through KFB's GitHub connector in this slice, so **do not copy code**. |

## G · Existing KFB audio owners and donors

| ID | Class | KFB source | Preserve / reject |
|---|---|---|---|
| G01 | KFB | `skills/chat/workflows/KFB_AUDIO_SOUNDSCAPE_BASELINE_V1_2026-09-24/` | Preserve. AUDIO-CAL-01 is HUMAN_ACCEPTED; shared roles, mix and ducking remain the current baseline. |
| G02 | KFB | `media/3D_Assets/Audio/sfx.json` | Replace conceptually over time: current single-file semantic keys are too thin for a material/energy recipe layer. Do not destructively rewrite in this research slice. |
| G03 | KFB | `media/3D_Assets/Audio/ui-sfx.json` | Keep UI semantics separate. Current main path debt is known from the Audio baseline PR; this skill does not duplicate that repair. |
| G04 | KFB | `media/3D_Assets/Audio/Footsteps/` | Strong existing source bank: digital + Foley material families. Curate before sourcing more. |
| G05 | KFB | `media/3D_Assets/Audio/Materials/` | Existing Foley/material bank includes cardboard, ceramic, clothing, concrete scrape, glass, metal, paper, pottery, stone and wood sources. |
| G06 | KFB | `media/3D_Assets/Audio/kenney_impact-sounds/` | Strong existing variant families for metal/glass/generic/plank/plate/punch/soft/tin/wood + footsteps. |
| G07 | KFB | Combat Arena SFX modules | Reuse priority/polyphony/spatial/missing-cue patterns; Combat remains owner of its runtime and contact truth. |
| G08 | KFB | Stunt Car Race A2 contact lab | Preserve as technical evidence but **reject sustained oscillator voices as production sound**: Georg's human listening rejected them. |
| G09 | KFB | Stunt Car Race A3 semantic/contact research | Reuse sample/granular sustained-texture direction, ENTER/SUSTAIN/EXIT lifecycle and stateful contact API concepts; Race retains physics/contact ownership. |
| G10 | KFB | Travel Globe audio modules | Reuse one-context / jukebox / ambience patterns only where relevant; Travel retains runtime owner. |

## H · Core synthesis from research

### H1 · Semantic event payload

A provider-neutral SFX event should carry enough truth to choose a recipe without embedding gameplay logic:

```ts
type KfbSfxEvent = {
  id: string
  action: string
  phase: 'enter' | 'sustain' | 'exit' | 'one_shot'
  actorClass?: string
  sourceMaterial?: string
  targetMaterial?: string
  surfaceBlend?: Array<{ material: string, weight: number }>
  energy?: number
  speed?: number
  slip?: number
  sizeClass?: 'tiny' | 'small' | 'medium' | 'large' | 'huge'
  position?: Vec3
  normal?: Vec3
  perspective?: 'player' | 'npc' | 'world' | 'ui'
  biome?: string
  signature?: string
  seed?: string | number
}
```

Audio does not invent authoritative contact, damage, locomotion or vehicle telemetry.

### H2 · Recipe, not file

```text
event
→ semantic family
→ material/energy/size profile
→ functional layers
→ variant pools
→ spatial/mix/concurrency owner
```

Variation must come first from **source diversity and semantic correctness**. Small pitch/gain/timing changes are polish, not a replacement for good sources.

### H3 · One-shots vs continuous contact

One-shots:
- impact;
- step;
- UI;
- jump/land;
- pickup/drop;
- attack swing/whiff.

Continuous/stateful:
- tire slip;
- braking scrub;
- body/rail scrape;
- engine/motion bed;
- sustained energy/magic;
- dragging/pushing;
- water/wading loops where duration is state-driven.

Continuous contacts use:

`ENTER → SUSTAIN(parameters updated by owner telemetry) → EXIT`.

For friction, recorded/stochastic/granular texture should be the primary audible bed. Synthesis may color it, but a tonal oscillator must not masquerade as the material.

### H4 · Safe fallback

Unknown or missing material audio must be explicit in diagnostics.

Allowed:
- declared generic family;
- silence;
- procedural emergency fallback that truthfully preserves the material class;
- telemetry/debug marker.

Disallowed:
- glass silently sounding like earth;
- flesh silently sounding like wood;
- every unknown impact becoming the same plink.

### H5 · Integration with motion / combat / VFX

All consumers subscribe to the same semantic event truth.

Example melee:
```text
animation schedules swing/whiff
→ contact geometry validates actual impact
→ one confirmed-contact event
   → reaction
   → SFX recipe
   → VFX impact
   → optional hitstop/camera accent
```

A miss may have swing/air sound. It must not receive target-impact sound.

## I · Research conclusion

KFB already owns many usable audio assets and several good runtime patterns.

The missing shared layer is a **semantic SFX language and recipe contract** that makes material, energy, size, event phase, variation and priority explicit while preserving existing project owners.

The skill distilled from this research should therefore:
- curate before sourcing;
- model material perceptually;
- layer by function;
- separate event truth from audio rendering;
- parameterize continuous states;
- budget voices by semantic priority;
- make cartoon exaggeration secondary to causality/readability;
- reuse AUDIO-CAL-01 rather than create a second universal mixer;
- require listening gates for sonic acceptance because technical WebAudio tests do not prove good sound.
