# KFB World Pulse · Audio-Reactive Living Toy Contract · PREP · 2026-10-07

Status: **ARCHITECTURE PREP · NO RUNTIME WRITE**  
Owner: **KFB World Presentation / receiving World**  
Audio owner: **KFB Audio / Jukebox / Mixer · PR #365 lineage**  
Repo: `georg-doc/kayfabizarro`  
Branch: `planning/world-pulse-audio-reactive-living-toy-2026-10-07`

## North Star

**The world is a breathing, living toy.**

This recovers the existing KFB Living-Toy direction: scenery should have restrained ambient life and may react more strongly in explicit music/performance contexts.

Existing donor already proposed:
- idle breathing / sway;
- music response from BPM/phase/beat/downbeat;
- later broad frequency-band response;
- buildings/terrain as spatial music visualizer;
- reuse of the older voxel-dancefloor idea;
- no second Audio runtime.

## Ownership

**Audio owns musical truth. World owns spatial truth. World Pulse owns presentation only.**

Audio owns:
- the one AudioContext;
- MusicClock;
- BPM / beat / bar / phrase;
- track/family selection;
- stems and gains;
- adaptive mix;
- speech focus / ducking.

World owns:
- object identity/transforms;
- source positions;
- biome/zone;
- wind/weather;
- visibility/LOD;
- gameplay state.

World Pulse must not create AudioContext, choose tracks, own BPM/stem tables, alter gameplay/collision or replace Resident Performance.

## One shared response layer

Do not build separate scenery systems for wind and music.

Use:

`WorldPulse = BaseLife + WindResponse + MusicResponse + optional EventPulse`

BaseLife:
- subtle breathing;
- slow phase-offset sway;
- small secondary-soft wobble.

WindResponse:
- direction;
- strength;
- gust envelope;
- stable noise/seed.

MusicResponse:
- beat phase/pulse;
- downbeat;
- broad musical energy;
- audible intensity;
- local diegetic-source influence.

Optional EventPulse later:
- impact;
- stunt;
- discovery;
- celebration.

## Audio → World presentation pulse

PR #365 already forbids World-side BPM/stem tables and owns MusicClock.

Add an optional Audio-owned read-only output:

`kfb.audio.presentation-pulse.v1`

Candidate semantic fields:

```
transport:
  beatPhase01
  beatPulse01
  downbeatPulse01
  barPhase01
  phrasePhase01

energy:
  audible01
  rhythm01
  bass01
  harmony01
  melody01
  texture01
  crescendo01

activeSources:
  sourceId
  sourceType
  audibleGain01
  signature01
```

Consumers receive semantic values, never track IDs or stem IDs.

Audio may derive them from metadata, stems, analyser data or a hybrid. World Pulse does not care how.

## Local music influence

Audio knows what is playing. World knows where it is.

Join by canonical `sourceId`.

World-side anchor:

```
sourceId
worldObjectId
position
radius
falloff
responseProfile
```

Source examples:
- GLOBAL_SCORE;
- JUKEBOX;
- BILLBOARD;
- BAND;
- RADIO;
- island/Scenelet signature source.

Global soundtrack gives a subtle world-wide response.

Jukebox/Band/Billboard may create a stronger bounded local field.

Billboard remains Media owner and does not run beat detection, ducking or its own AudioContext.

## Vegetation · preferred first consumer

Do not use isolated single leaves as the default vegetation unit.

Prefer:

`leaf geometry → composed leaf cluster → bush/canopy/crown module → instanced vegetation family`

This improves:
- silhouette;
- volume;
- KayKit Nature/Forest fidelity;
- toy-world readability;
- cheap group animation.

For one cluster:

`motion = baseSway + windSway + musicModulation`

Possible mappings:
- wind → directional bend;
- bass → small grounded pulse;
- rhythm → short sway accent;
- melody/texture → subtle tip flutter;
- crescendo → slow widening of amplitude;
- downbeat → bounded accent, never whole-tree jumping.

Stable per-instance phase/amplitude seeds prevent synchronous metronome motion.

## Music response is semantic, not a literal equalizer

The world should **breathe with music**, not bounce like spectrum bars.

Examples:
- grass → ripple/sway;
- leaf clusters → bend + tip flutter;
- tree canopy → slow mass sway;
- flowers → small nod/open-close;
- cloth/flags → wind dominant + beat accent;
- toy props → tiny squash/tilt;
- landmark secondary-soft parts → wobble/overshoot;
- performance-zone floor → bounded vertical response as a deliberate special case.

Orchestral music should produce mood and broad motion envelopes, not constant disco pumping.

## Residents / Band / Dance

Resident Performance remains owner.

It may consume Music Pulse only when the actor is actually in a dance/performance activity.

Examples:
- Rockband clips align to beat/bar;
- dance clips may phase-lock or switch on safe boundaries;
- ambient Residents do not all dance because music exists.

World Pulse must never override locomotion, foot contact or explicit gameplay actions.

## Performance architecture

Forbidden:
- one analyser per prop;
- one AudioContext per Billboard/Jukebox;
- per-object FFT;
- unique material clones for every grass/tree instance;
- offscreen CPU animation.

Preferred:
- Audio computes one small semantic pulse;
- World Pulse exposes shared uniforms;
- instanced props/vegetation carry per-instance seed/profile attributes;
- vertex/material shaders perform cheap shared response;
- hero objects may use small CPU transform groups;
- only a small bounded set of strongest local audio fields is active;
- distance/visibility reduces work.

Suggested shared uniforms:
- time;
- wind direction/strength/gust;
- beat/downbeat pulse;
- broad music energy;
- global intensity;
- a few local source fields.

Suggested per-instance attributes:
- stable phase seed;
- response profile;
- amplitude/stiffness;
- motion axis;
- wind sensitivity;
- music sensitivity.

## Presentation LOD

Near:
- full cluster response;
- wind + music;
- optional secondary tip motion.

Mid:
- cluster-level sway only;
- reduced high-frequency response.

Far:
- silhouette-level shared motion/material pulse only.

Offscreen:
- no CPU presentation updates.

## Speech / ducking

Existing Audio rule remains:

**Ducking changes mix, not transport time.**

Therefore MusicClock keeps running during Resident/Billboard speech.
Beat phase remains stable.
Visible music response may attenuate with audible gain, while BaseLife + Wind continue.

## Current MVP routing

This adds **no new REQUIRED row** to the frozen Island MVP matrix.

For the current Island MVP it is **STRONGLY INCLUDE if low-risk** as one representative living-world seam.

Preferred proof:
1. one clustered Nature family responds to Wind + Music;
2. one hero prop/landmark secondary-soft group responds subtly;
3. one Jukebox or Billboard local source changes nearby response strength;
4. one AudioContext / mixer / MusicClock remains authoritative;
5. target performance gate still passes.

Do not fan out to every object in the first island.

## Acceptance

PASS requires:
- world visibly feels more alive;
- silence still has BaseLife/Wind;
- local source response is spatially legible;
- object families are related but not identical;
- orchestral tracks remain tasteful;
- contact/silhouette/navigation stay readable;
- no second audio or animation owner;
- Claybound Gold Standard remains the visual benchmark;
- performance remains inside the current product gate.

## Donors retained

- Living Toy World / Reactive Landmarks;
- Landmark Group Rig groups: coreMass / rigidAttached / secondarySoft / reactiveGameplay;
- voxel dancefloor response;
- Jukebox/diegetic music-source planning;
- PR #365 MusicClock + adaptive stem runtime;
- Resident Performance micro-motion contract;
- KayKit Nature/Forest clustered foliage grammar.

## One next gate

**BOUNDED WORLD PULSE LAB · CLUSTERED FOLIAGE + LOCAL JUKEBOX/BILLBOARD FIELD + ONE HERO PROP · PERF PROOF**
