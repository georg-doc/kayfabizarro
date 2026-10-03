---
name: kfb-cartoon-sfx
version: 1.0
status: canonical-draft
scope: cartoon game SFX · Foley · material audio · combat impacts · locomotion · interactions · vehicles · sci-fi/RPG sound
primary-language: English for implementation, German accepted for direction
owner: Georg / KFB
depends-on:
  - current project/runtime SSOT
  - skills/chat/workflows/KFB_AUDIO_SOUNDSCAPE_BASELINE_V1_2026-09-24/START_HERE.md
  - current audio source catalog / provenance manifests
research:
  - skills/chat/workflows/KFB_CARTOON_SFX_SKILL_2026-10-03/RESEARCH_SOURCE_MATRIX.md
  - skills/chat/workflows/KFB_CARTOON_SFX_SKILL_2026-10-03/KFB_AUDIO_DONOR_AUDIT.md
---

# KFB Cartoon SFX
## Semantic Events, Material Sound, Foley, Impact and Cartoon Sonic Identity

# 0 · Purpose

This skill governs how KFB projects research, design, curate, implement, review and debug sound effects for:

- character locomotion;
- footsteps and body Foley;
- combat;
- weapon movement and impact;
- environment interaction;
- pickups, props and destructibles;
- vehicle/racing contact;
- jumps, landings and traversal;
- sci-fi / fantasy / RPG mechanisms;
- UI feedback where relevant;
- cartoon exaggeration;
- character/object sonic signatures;
- sound/music coexistence;
- spatial world sound.

It is provider-neutral.

It can be expressed through:

- Web Audio;
- FMOD;
- Wwise;
- Unreal audio / MetaSounds;
- Unity audio;
- Godot audio;
- a consumer's existing audio runtime.

It does **not** require one middleware and it does not create a universal KFB audio engine.

The accepted Audio/Soundscape baseline remains the shared mix/ducking reference.

---

# 1 · Prime Directive

> **A sound effect is a rendered semantic event, not a filename.**

Do not start with:

```text
jump → laser_03.wav
hit → bonk.wav
step → foot.wav
```

Start with:

```text
truthful game event
→ semantic event payload
→ material / energy / size context
→ SFX recipe
→ functional layers
→ variant pools
→ consumer mix / spatial owner
```

A good source file can still produce bad game audio when:

- it represents the wrong material;
- it represents the wrong energy;
- it repeats too often;
- it is layered without hierarchy;
- it fires on the wrong gameplay event;
- it competes with voice/music;
- it is spatialized incorrectly;
- it has the wrong perspective;
- it is technically dynamic but perceptually implausible.

The recipe is the missing contract.

---

# 2 · Ownership Model

Keep these owners distinct.

```text
gameplay / physics / interaction owner
  owns authoritative event truth
  owns contact, state, speed, damage, material query and telemetry

animation owner
  owns pose / clip timing
  may schedule animation-semantic events such as footfall or swing

SFX semantic adapter
  translates owner truth into a provider-neutral SFX event
  does not invent a second physics model

SFX recipe layer
  selects material / energy / functional-layer policy
  selects variant pools and signature policy

audio runtime / middleware
  plays, spatializes, filters, mixes, virtualizes and stops audio

shared Audio/Soundscape baseline
  provides semantic mix/ducking direction

LLM / implementation agent
  composes against existing owners
  does not create a parallel universal runtime
```

### Hard boundary

Audio may **react** to speed, slip, impact energy, material or state.

Audio does not become authoritative for those facts.

Bad:

```text
audio code guesses collision from volume spikes
audio timer invents footsteps unrelated to locomotion
sound system calculates its own tire slip
```

Good:

```text
movement owner reports footfall + surface
combat reports confirmed contact + materials
race reports slip / speed / surface + contact lifecycle
audio renders the result
```

---

# 3 · Canonical Mental Model

Use five layers of abstraction.

## 3.1 Source catalog

What audio exists?

```ts
type AudioSourceAsset = {
  id: string
  path: string
  provenance: string
  license: string
  durationMs?: number
  channels?: number
  dryWet?: 'dry' | 'wet' | 'unknown'
  loopable?: boolean
  tags: string[]
}
```

## 3.2 Material profile

What perceptual traits matter?

## 3.3 Semantic event

What actually happened?

## 3.4 Sound recipe

How should that event be expressed?

## 3.5 Runtime renderer

How does the receiving engine play it?

Do not collapse these into one giant JSON that simultaneously owns physics, asset catalog, mix and gameplay.

---

# 4 · Semantic SFX Event Contract

Equivalent structures are valid.

```ts
type KfbSfxEvent = {
  id: string
  time?: number

  action: string
  phase: 'one_shot' | 'enter' | 'sustain' | 'exit'

  actorId?: string
  actorClass?: string
  objectClass?: string

  sourceMaterial?: MaterialId
  targetMaterial?: MaterialId

  surfaceBlend?: Array<{
    material: MaterialId
    weight: number
  }>

  energy?: number
  speed?: number
  slip?: number
  force?: number

  sizeClass?: 'tiny' | 'small' | 'medium' | 'large' | 'huge'

  position?: Vec3
  normal?: Vec3

  perspective?: 'player' | 'npc' | 'world' | 'ui'
  biome?: string
  environmentClass?: string

  signature?: string
  state?: Record<string, string | number | boolean>

  seed?: string | number
}
```

The payload should contain facts the renderer needs.

It should not carry arbitrary implementation details such as:

```text
oscillatorFrequency = 417
playBuffer = sound_027
gainNode = 0.74
```

Those belong inside a recipe/runtime.

---

# 5 · Material Model

## 5.1 Start perceptually broad

Default physical families:

```text
SOLID_RESONANT
SOLID_DAMPED
AGGREGATE
SOFT_FIBROUS
LIQUID
HYBRID_VISCOUS
```

Stylized KFB extension:

```text
ENERGY_TECH
```

Research baseline for floor interactions includes:

- solid;
- aggregate;
- liquid;
- hybrid.

KFB adds soft/fibrous and fictional energy/tech because the world contains cloth, flesh-like/soft objects and nonphysical devices.

## 5.2 Material descriptors

```ts
type MaterialProfile = {
  id: string
  family:
    | 'solid_resonant'
    | 'solid_damped'
    | 'aggregate'
    | 'soft_fibrous'
    | 'liquid'
    | 'hybrid_viscous'
    | 'energy_tech'

  hardness: number
  resonance: number
  massFeel: number
  roughness: number
  granularity: number
  wetness: number
  hollowness: number
  friction: number
  debris: number
  breakability: number

  attackClass?: string
  bodyClass?: string
  frictionClass?: string
  debrisClass?: string
  tailClass?: string
}
```

These values are semantic controls.

Do not pretend they are laboratory material constants unless a consumer actually provides physical values.

## 5.3 Examples

```yaml
metal_plate:
  family: solid_resonant
  hardness: high
  resonance: high
  hollowness: medium
  friction: medium

stone_dense:
  family: solid_resonant
  hardness: high
  resonance: low-medium
  massFeel: high
  debris: medium

cardboard:
  family: soft_fibrous
  hardness: low
  resonance: low
  roughness: medium

gravel:
  family: aggregate
  granularity: high
  roughness: high

mud:
  family: hybrid_viscous
  wetness: high
  granularity: medium
  suction: implied by recipe

slime_kfb:
  family: hybrid_viscous
  wetness: high
  elasticity: recipe extension

plasma_shield:
  family: energy_tech
  resonance: signature-defined
```

## 5.4 Do not equate mesh name with sound material

`Wall_037` is not a material.

A wall may be:

- concrete;
- hollow metal;
- wood;
- alien membrane;
- glass;
- energy field.

World geometry maps to a semantic material profile through the current consumer owner.

---

# 6 · Two-Material Contact

Contact may involve both source and target.

Example:

```text
metal sword → wood shield
```

Possible functional contributions:

```text
weapon movement / mechanism
+ target wood body
+ optional source metal ring
+ debris/splinter
+ environment tail
```

Do not force every impact to be target-only or source-only.

Use event semantics.

Examples:

- punch into cloth body: target dominates;
- steel parry: both metal sources dominate;
- rubber tire on asphalt: interface/friction dominates;
- stone dropped into water: source mass + liquid displacement both matter;
- laser hitting energy shield: fictional source/target signature can be jointly authored.

---

# 7 · Functional Layer Vocabulary

A recipe may request these functional layers.

## 7.1 ATTACK / TRANSIENT

Purpose:

- exact timing;
- contact readability;
- edge/crack/click/snap.

## 7.2 BODY / MASS

Purpose:

- perceived weight;
- scale;
- low-mid body;
- object volume.

## 7.3 MATERIAL / TEXTURE

Purpose:

- tell the listener what contacted;
- grain, fiber, glass, liquid, metal, dirt, rubber, etc.

## 7.4 MECHANISM / MOVEMENT

Purpose:

- servo;
- gear;
- cloth;
- armor;
- weapon handling;
- suspension;
- hinge;
- rattle.

## 7.5 SWEETENER / SIGNATURE

Purpose:

- controlled KFB identity;
- sci-fi accent;
- tuned/musical accent;
- elastic/cartoon exaggeration;
- character motif.

## 7.6 TAIL / SPACE / DEBRIS

Purpose:

- object resonance;
- fragments;
- splash aftermath;
- room/environment response.

### Event-budget rule

These are **functions**, not six mandatory sounds.

Ordinary events should use the smallest stack that communicates:

```text
what happened
+ what it was made of
+ how strong / large it felt
```

Signature events may use more.

Do not make every footstep or punch a six-layer trailer hit.

---

# 8 · Source Pools and Variation

## 8.1 Variation hierarchy

Prefer:

```text
semantic variation
→ different real takes / source variants
→ material/energy variants
→ layer combination variation
→ small timing variation
→ small pitch / gain variation
```

Do not reverse the order.

Pitch randomization cannot turn one weak generic clip into a believable material library.

## 8.2 Pool policy

A pool should define:

```ts
type VariantPool = {
  id: string
  assets: string[]
  selection: 'shuffle' | 'random' | 'sequential' | 'weighted'
  avoidRepeat?: number
  pitchRange?: [number, number]
  gainRangeDb?: [number, number]
  delayRangeMs?: [number, number]
  weights?: number[]
}
```

Use the current middleware equivalent where available.

## 8.3 Phrase-coherent variation

When several layers form one perceived event, avoid randomizing them so independently that they sound like unrelated objects.

Useful pattern:

- one event-level variation seed;
- one shared phrase pitch tendency;
- limited per-layer deviations.

KFB Combat already contains a phrase-pitch pattern worth retaining.

## 8.4 Deterministic seed

Use deterministic seeds when needed for:

- A/B listening;
- replay;
- test fixtures;
- bug reproduction;
- capture evidence.

Randomness without reproducibility makes sonic regressions hard to compare.

---

# 9 · One-Shot vs Stateful / Continuous Sound

This distinction is mandatory.

## 9.1 One-shot examples

```text
footstep
impact
jump takeoff
land
pickup
drop
UI confirm
weapon swing
whiff
short break
checkpoint
```

## 9.2 Stateful examples

```text
tire slip
brake scrub
body scrape
rail grind
dragging
engine / motor bed
beam sustain
energy charge hold
water wading loop
continuous fire
machine loop
```

## 9.3 Lifecycle

Stateful contact uses:

```text
ENTER
→ SUSTAIN(parameter updates)
→ EXIT
```

Not:

```text
play scrape.wav every 80 ms
play scrape.wav every 80 ms
play scrape.wav every 80 ms
```

unless the source model is intentionally granular and designed to overlap that way.

## 9.4 Ownership

The consumer owns when contact starts/stops.

The audio renderer owns:

- crossfade;
- texture selection;
- grain behavior;
- pitch/timbre response;
- fade/release;
- spatial playback.

---

# 10 · Sustained Friction Rule

This rule is KFB-hard because it is backed by direct human rejection.

## 10.1 Rejected pattern

The Race A2 contact lab used procedurally reactive oscillator/noise voices for:

- tire squeal;
- braking;
- scraping;
- rail grinding;
- metal screech.

Technical behavior passed.

Human listening failed.

## 10.2 Production default

```text
recorded / stochastic / granular material texture
  = primary audible source

procedural synthesis
  = optional coloration / modulation / secondary sweetener
```

Do not make a tonal resonator the audible identity of rubber or metal friction merely because it maps cleanly to speed.

## 10.3 Parameterization

A friction recipe may continuously respond to:

```text
speed
slip
contact force
roughness
surface
wetness
vehicle/object size
perspective
```

But parameters should modulate a believable texture.

---

# 11 · Locomotion and Footsteps

## 11.1 Event families

At minimum:

```text
step
run_step
scuff
pivot
jump_takeoff
land
slide
roll
climb_contact
wade
swim_contact
crawl_contact
```

## 11.2 Footstep recipe inputs

Useful inputs:

```text
left/right foot
gait
speed
energy
surface material
surface blend
footwear / body contact type
actor size
worn gear / armor
wetness
special state
```

## 11.3 Layer example

```text
FOOT CONTACT
  target surface

BODY / WEIGHT
  optional mass thump for heavy actor

FOLEY
  cloth / armor / keys / gear

SIGNATURE
  optional tiny resident-specific accent
```

Do not attach a comedy sweetener to every step.

## 11.4 Surface blending

For blended terrain, allow weighted material contributions.

Example:

```yaml
surfaceBlend:
  grass: 0.60
  dirt: 0.30
  gravel: 0.10
```

A consumer may:

- mix all three;
- choose dominant + secondary;
- quantize into a stable pair;
- smooth weights across steps.

Avoid rapid unstable switching near a texture boundary.

## 11.5 Triggering

Footfall truth can come from:

- animation events/notifies;
- procedural foot contact;
- gait/state timing;
- consumer-specific locomotion events.

Choose one authoritative method per consumer.

Do not run independent competing footstep timers.

## 11.6 Gait

Walk/run should not only change playback rate.

They may alter:

- heel/toe relationship;
- attack hardness;
- foot drag;
- gear movement;
- body mass;
- cadence;
- surface scatter intensity.

---

# 12 · Character Foley

Characters sound through more than feet.

Possible continuous/episodic Foley families:

```text
cloth
leather
armor
backpack
keys / charms
weapon carry
servo
mechanical joint
fur / soft body
accessory wobble
breathing / effort owner
```

Foley can be driven by:

- animation markers;
- joint velocity;
- root acceleration;
- turn rate;
- gait state;
- explicit authored events.

Use the simplest truthful driver.

### Signature rule

A recurring Resident/mech may own a small stable signature palette.

For example:

```text
Clank-like concept:
defined servo family
+ physical body Foley
+ occasional signature detail
```

Do not invent a new signature on every scene.

---

# 13 · Combat SFX Grammar

Separate these semantics.

```text
windup
swing
whiff
projectile_launch
flyby
confirmed_contact
glance
block
parry
guard_break
break
aftermath
reaction
environment_contact
```

## 13.1 Swing / whiff

Can be animation-timed.

Inputs:

- weapon class;
- speed;
- arc;
- size;
- air displacement;
- signature.

Whiff is not impact.

## 13.2 Confirmed contact

Must be contact-driven.

Possible layers:

```text
contact transient
+ target body/material
+ source material accent
+ debris
+ signature
+ tail
```

## 13.3 Miss rule

A miss may have:

- swing;
- air whoosh;
- footwork;
- mechanism;
- environmental incidental contact if it really occurred.

It must not have:

- target hit body;
- target material impact;
- hit-confirm sweetener;
- impact tail tied to nonexistent contact.

## 13.4 Energy classes

Use semantic energy bands or a continuous parameter.

Example:

```text
light
medium
heavy
catastrophic
```

Do not create loudness-only differences.

Energy can change:

- transient hardness;
- body layer;
- debris;
- tail length;
- source/target balance;
- cartoon accent;
- priority.

## 13.5 Weapon / target matrix

Example:

```text
blade → flesh/soft
blade → wood
blade → metal
blunt → soft
blunt → stone
metal → metal parry
shield → weapon
improvised soft prop → body
```

Use semantic recipes with shared components.

Do not author every matrix cell as an unrelated one-off if components can be recombined coherently.

---

# 14 · Melee / VFX / Animation Synchronization

For melee:

```text
animation
  opens swing timing

contact system
  proves hit or miss

confirmed contact event
  fans out to:
    damage/reaction owner
    SFX
    VFX
    optional hitstop
    optional camera accent
```

Audio consumes the same confirmed contact that VFX consumes.

Do not let audio and VFX independently guess the hit frame.

When the specialized Brawl skill is present in a receiving branch, this SFX skill supplies its sonic recipe layer. It does not depend on an unmerged Brawl draft being available.

---

# 15 · Interaction / Prop Grammar

Recommended semantic families:

```text
pickup
putdown
drop
grab
release
open
close
toggle
insert
remove
drag_enter
drag_sustain
drag_exit
push
pull
tear
bend
snap
break
repair
consume
pour
splash
```

Recipe inputs:

- object material;
- target material;
- object size/mass class;
- action speed;
- contact energy;
- mechanism;
- wetness;
- contents;
- signature.

Example:

```text
cardboard_box / close
  flap transient
  + fibrous body
  + optional content rattle
```

Not:

```text
all props → click_001
```

---

# 16 · Vehicles and Racing

Vehicle audio separates:

```text
propulsion / engine bed
wheel / surface contact
tire slip
brake
suspension
body rattle
impact
scrape
landing
boost
environment pass-by
interior/exterior perspective
```

## 16.1 Contact truth

Race/vehicle physics owns:

- speed;
- slip;
- wheel state;
- contact force;
- surface;
- collision;
- grind contact.

Audio maps those facts.

## 16.2 Tire / road

Use stateful texture.

Possible source categories:

```text
chirp
scrub
squeal
lockup
burnout
wet spray
gravel scatter
```

Crossfade or select by slip/energy.

## 16.3 Body scrape

Use:

```text
ENTER transient
+ SUSTAIN material texture
+ EXIT release
```

Avoid a periodic oscillator “screech” as the primary bed.

## 16.4 Cartoon racing

Cartoon layer may add:

- elastic pitch gesture;
- tiny rhythmic/tuned accent;
- exaggerated suspension thunk;
- signature exhaust chirp.

It must sit **on top of** a readable physical/contact layer.

---

# 17 · Sci-Fi / Fantasy / RPG SFX

Fictional sounds still need causality.

Useful phase grammar:

```text
charge
ready
release
travel
contact
sustain
decay
shutdown
failure
overload
```

Build fictional devices from a stable combination of:

```text
mechanism
+ energy identity
+ mass/scale
+ interaction material
+ signature
```

Example:

```text
plasma door:
  mechanism motor
  + energy hum
  + latch transient
  + room tail
```

Do not represent every sci-fi action with the same laser blip.

---

# 18 · UI SFX

UI is its own family.

Default:

- non-spatial;
- short;
- clear;
- low layer count;
- strict repetition control;
- priority appropriate to function.

Semantic categories may include:

```text
hover
select
confirm
cancel
error
warning
success
open
close
tab
toggle
notification
critical_alert
```

Silence is valid.

Do not attach a sound to every cursor movement if it becomes chatter.

World material recipes do not automatically apply to UI.

Diegetic interfaces may deliberately combine UI clarity with a world/device signature.

---

# 19 · Cartoon Sound Design Rule

Cartoon does not mean random noise.

Use this sequence:

```text
credible cause
→ readable material / mass / motion
→ one chosen exaggeration
→ signature / tail
```

## 19.1 Exaggeration dimensions

Choose deliberately:

```text
scale
elasticity
resonance
velocity
wobble
squash
tail
harmonic / musical identity
temporal snap
```

## 19.2 Comedy

Good cartoon comedy can come from:

- disproportionate scale;
- unexpectedly tiny tail after huge anticipation;
- elastic recovery;
- physically recognizable but exaggerated prop;
- stable character signature applied in an absurd context.

Avoid:

- generic “boing” on everything;
- random kazoo/honk;
- meme sounds;
- unrelated cartoon library spam;
- novelty replacing material identity.

## 19.3 KFB chill/fun target

For ordinary exploration and social interaction:

- keep transients controlled;
- use pleasant texture;
- preserve quiet;
- leave music and voice room;
- use signature accents sparingly.

The world should be enjoyable to inhabit, not constantly demanding attention.

---

# 20 · Sonic Signatures

A recurring character/object/faction/vehicle may have a signature palette.

```ts
type SignaturePalette = {
  id: string
  mechanisms?: string[]
  tonalColors?: string[]
  materials?: string[]
  sweeteners?: string[]
  pitchZone?: string
  temporalTraits?: string[]
  prohibitedCliches?: string[]
}
```

Example concepts:

- resident with soft cloth + wooden charm;
- mech with one servo family + hollow chassis clack;
- absurd fish weapon with wet soft body + tiny tail slap;
- casino machine with mechanical switch + muted tuned chime;
- Academy tech with stable filtered resonance.

A signature palette should survive across events.

Do not design every event from zero.

---

# 21 · Music / Stem / Soundbed Coexistence

The procedural/Suno/stem soundbed and SFX have different jobs.

Soundbed:

- continuity;
- biome mood;
- emotional bed;
- musical identity.

SFX:

- causality;
- interaction;
- physical grounding;
- state feedback;
- local signature.

Use the accepted Audio/Soundscape baseline to arbitrate roles.

Do not solve competition by making SFX uniformly louder.

## 21.1 Optional musical sweetener

In compatible scenes, an SFX recipe may add a tuned/rhythmic accent that agrees with current musical context.

Possible inputs:

- beat phase;
- key/scale;
- intensity;
- current stem palette.

This is optional.

Do not convert all KFB action into a rhythm game.

---

# 22 · Spatialization

Classify every SFX as one of:

```text
UI / HEAD-LOCKED
PLAYER-ATTACHED
WORLD-SPATIAL
AMBIENT-AREA
DIEGETIC-MUSIC
```

World SFX may use:

- attenuation;
- stereo/3D panning;
- obstruction/occlusion;
- distance filtering;
- room/space send;
- portal/acoustic logic.

The skill does not mandate one spatializer.

### Dry / wet rule

If runtime space/reverb is authoritative, prefer suitably dry source material.

Use pre-wet sources only deliberately.

Avoid:

```text
wet source
+ runtime room
+ extra tail
= three rooms at once
```

KFB Combat already distinguishes Dry/Wet source roles.

---

# 23 · Priority, Concurrency and Clutter

A crowded mix is a scheduling problem before it is a loudness problem.

## 23.1 Semantic priority examples

Higher:

- player-critical confirmation;
- dangerous telegraph;
- confirmed major hit;
- mission-critical interaction;
- voice where narrative priority requires it.

Lower:

- repeated debris;
- distant minor impacts;
- cosmetic Foley;
- repeated ambient details.

Exact priority numbers belong to the current runtime.

## 23.2 Concurrency

Use group caps/resolution rules for repeated families.

Examples:

- footsteps;
- shell/debris;
- crowd combat impacts;
- UI hovers;
- environment pings;
- repeated machine details.

## 23.3 Debounce

Debounce prevents accidental retrigger storms.

It must not erase legitimately fast sequences.

Use semantic scope:

```text
per actor
per object
per contact pair
per grid cell
per event family
global
```

## 23.4 Silence

If the event is nonessential and the mix is already saturated, silence may be the correct rendering decision.

---

# 24 · Loudness and Source Preparation

Do not promote arbitrary normalization numbers into a universal KFB standard.

Prepare sources consistently:

```text
trim bad head/tail
remove accidental DC / clicks where needed
preserve intentional transient
check clipping
check phase/stereo usefulness
classify dry/wet
mark loopability
match perceived family level by listening
retain headroom for layering
```

A source normalized to the same numerical peak/RMS as another source can still sound radically louder or smaller.

Final balance requires listening in context.

---

# 25 · Procedural Synthesis Policy

Procedural sound is useful when its strengths match the event.

Good uses can include:

- parameterized fictional energy;
- subtle sweeteners;
- wind/ambient components;
- simple UI tone families;
- resonant object coloration;
- emergency class-correct fallback;
- tightly controlled variation;
- prototyping.

High-risk uses:

- rubber tire friction;
- realistic metal scraping;
- cloth;
- complex Foley;
- materials whose stochastic texture is the perceptual identity.

Rule:

> **Use synthesis to model what synthesis is good at. Do not use it merely to avoid curating recordings.**

---

# 26 · Granular / Stochastic Texture Policy

Granular playback is useful for:

- sustained friction;
- rough surfaces;
- debris;
- crowd/texture beds;
- longer variation from limited clean recordings.

The source must still be good.

Bad source + granular playback = varied bad sound.

For contact:

```text
source texture
→ grain / slice selection
→ speed/slip/force modulation
→ optional resonant coloration
→ spatial/mix
```

Avoid obvious machine-gun repetition and periodic looping artifacts.

---

# 27 · Asset / Repo Donor Admission

A public repo is a donor only after:

```text
[ ] exact repository
[ ] exact revision
[ ] exact file/module
[ ] license
[ ] provenance
[ ] architecture fits consumer
[ ] no second runtime owner
[ ] source inspected in isolation
[ ] code reuse permitted
```

Examples from research:

- FMOD Unity Feature Demo — useful middleware example;
- Audiokinetic Gyms — official Unity/Unreal example set;
- FMOD-Unity-Tools — useful MIT architecture where FMOD+Unity is actually used;
- Clatter — valuable research model, but nonstandard license; research-only without explicit license gate.

Never copy code merely because a GitHub repository is public.

---

# 28 · Existing KFB Source-First Rule

Before searching externally:

```text
1. search current KFB Audio/Sounds bank
2. identify candidate source files
3. audition / isolate
4. classify material / event / energy
5. test recipe
6. only then declare a source gap
```

The shared bank already contains large families for:

- impacts;
- footsteps;
- materials;
- sci-fi;
- RPG;
- UI;
- weapons;
- arcade effects;
- environmental audio.

New acquisition must solve a named gap.

---

# 29 · Source Object Isolation for Audio

The general KFB donor rule applies to sound.

A path existing is not proof the source is suitable.

Before integration, record:

```text
exact source path
license/provenance
duration
dry/wet
channel format
audible content
attack/body/tail character
material identity
energy/size class
loop/sustain suitability
noise/problems
```

Audition source **in isolation** before layering.

Then audition:

1. layer solo;
2. recipe stack;
3. in game context;
4. with music/ambience;
5. with voice if relevant.

---

# 30 · Recipe Contract

Use equivalent structures.

```ts
type SfxRecipe = {
  id: string
  eventFamily: string

  match: {
    sourceMaterials?: string[]
    targetMaterials?: string[]
    materialFamilies?: string[]
    energy?: [number, number]
    speed?: [number, number]
    sizeClasses?: string[]
    perspectives?: string[]
  }

  layers: Array<{
    function:
      | 'attack'
      | 'body'
      | 'material'
      | 'mechanism'
      | 'sweetener'
      | 'tail'

    poolId: string

    gainDb?: number
    probability?: number

    parameterMap?: Record<string, string>

    delayMs?: number
    optional?: boolean
  }>

  lifecycle?: 'one_shot' | 'stateful'

  priorityClass: string
  concurrencyClass?: string
  debounceClass?: string

  spatialClass:
    | 'ui'
    | 'player'
    | 'world'
    | 'ambient_area'
    | 'diegetic_music'

  fallback?: {
    policy: 'declared_generic' | 'silence' | 'procedural_class' | 'error'
    id?: string
  }
}
```

This is a conceptual contract.

Do not force every runtime to implement this exact TypeScript.

---

# 31 · Example Recipes

## 31.1 Footstep · medium actor on gravel

```yaml
event: step
surface: gravel
energy: medium
layers:
  - material: gravel_step_pool
  - body: medium_weight_soft
  - foley: actor_gear_light
variation:
  avoidRepeat: 2
signature:
  optional: true
priority: locomotion_local
```

## 31.2 Heavy metal weapon into wood shield

```yaml
event: confirmed_contact
sourceMaterial: metal
targetMaterial: wood
energy: heavy
layers:
  - attack: hard_contact_transient
  - material: wood_heavy_body
  - sourceAccent: metal_ring_short
  - debris: wood_splinter_optional
  - sweetener: weapon_signature_optional
tail:
  world_space: true
```

## 31.3 Brickfish bonk

```yaml
event: confirmed_contact
source: brickfish
targetMaterial: soft_body
energy: medium
layers:
  - attack: soft_snap
  - body: soft_heavy
  - mechanism: fish_tail_slap_optional
  - sweetener: brickfish_signature
cartoon:
  exaggeration: elasticity
rule:
  no_generic_boing_stack: true
```

## 31.4 Tire slip

```yaml
lifecycle: stateful
event: tire_contact
surface: asphalt
enter:
  - rubber_chirp_pool
sustain:
  texture: real_rubber_scrub_bank
  controls:
    slip: grain_density_and_brightness
    speed: texture_rate_and_filter
    load: body_gain
exit:
  - release_chirp_optional
synth:
  role: secondary_color_only
```

---

# 32 · Debug Overlay / Telemetry

A serious SFX fixture should be able to display:

```text
event id
event family
phase
actor/object
source material
target material
surface blend
energy
speed
slip
size class
position / distance
perspective

matched recipe
selected pools
selected assets
seed
active functional layers

priority class
concurrency class
debounce decision
culled / virtualized / played
spatial class

current continuous instance id
ENTER / SUSTAIN / EXIT state
parameter values

missing cue
fallback used
source provenance
```

Do not debug audio only by staring at waveforms.

The event decision path must be inspectable.

---

# 33 · Required Listening Fixtures

Technical tests are necessary.

They are not sonic acceptance.

## 33.1 Material Matrix

Same source action / energy across target materials.

At minimum:

```text
metal
wood
stone
glass
soft
aggregate
liquid/hybrid
```

Prove materials are perceptually distinct without unrelated novelty spam.

## 33.2 Energy Ladder

One material:

```text
light
medium
heavy
```

Prove energy changes more than simple volume.

## 33.3 Locomotion Strip

Same actor:

```text
walk
run
scuff
jump
land
```

across representative surface families.

## 33.4 Combat Triplet

```text
whiff
confirmed weapon→body/material
block/parry
```

Prove no false hit cue on miss.

## 33.5 Stateful Friction

```text
ENTER
slow sustain
fast sustain
high slip / high pressure
release
EXIT
```

Prove there is no flute/oscillator identity or obvious loop.

## 33.6 Cartoon A/B

Same physical base:

```text
A = grounded only
B = grounded + controlled KFB sweetener
```

Human gate decides whether B adds identity or turns into novelty.

## 33.7 Mix Stress

Trigger:

- footsteps;
- impacts;
- debris;
- UI;
- ambience;
- score;
- optional voice.

Prove critical events remain readable through priority/concurrency/ducking.

## 33.8 Distance / Occlusion

Same world event:

- near;
- mid;
- far;
- occluded.

Prove localization changes while event identity remains recognizable.

---

# 34 · Failure Taxonomy

| Symptom | Likely cause | Repair |
|---|---|---|
| Everything plinks | single bright transient used as universal cue | restore body/material layers and event-specific source pools |
| Every impact sounds the same | silent material fallback or generic manifest | explicit material profiles + missing-cue diagnostics |
| Repetitive footsteps | tiny pool / pure random / no semantic variation | more takes, shuffle/avoid-repeat, gait/material/foley layers |
| Pitch-wobbly footsteps | random pitch doing too much work | restore source variation; reduce modulation |
| Tire sounds like a flute | tonal oscillator is primary friction source | real/granular rubber texture primary; synth secondary |
| Scrape chatters | repeated one-shots instead of stateful lifecycle | ENTER/SUSTAIN/EXIT instance |
| Huge actor sounds tiny | no size/mass input | body layer / scale profile / suitable sources |
| Cartoon feels childish | unrelated novelty sweeteners | ground cause/material first; choose one deliberate exaggeration |
| Combat becomes noise wall | no priority/concurrency/debounce | semantic voice budget |
| Hit plays on miss | audio tied to animation marker | confirmed contact drives impact |
| Wet source sounds cavernous | wet asset plus runtime reverb/tail | classify dry/wet; choose one space owner |
| UI sounds like world clutter | spatial/material world recipe reused for UI | separate UI family and spatial class |
| Great solo sound fails in game | no context audition | test with bed/music/voice and actual camera |
| Asset URL loads but design is wrong | source suitability never audited | source isolation + classification before integration |
| Procedural sound passes tests but sounds bad | technical gate substituted for listening | mandatory human listening gate |
| New pack added but quality unchanged | acquisition before curation | recipe audit first; source only named gaps |
| Surface flips at texture boundary | hard one-material selection on blended terrain | weighted/smoothed material blend |
| Foley is detached from motion | independent timers | animation/joint/movement truth owner |
| Signature varies every scene | no stable palette | define SignaturePalette |
| Sci-fi becomes laser soup | one generic tech cue | phase + mechanism + energy signature grammar |
| Music/SFX fight | no role/ducking/priority contract | use AUDIO-CAL roles and bounded musical sweeteners |

---

# 35 · Implementation Order

For one new SFX consumer slice:

```text
1. Read current project SSOT / Return.
2. Read AUDIO-CAL baseline + this skill.
3. Name exactly one SFX outcome.
4. Identify authoritative gameplay/animation/contact owner.
5. Inspect existing consumer audio system.
6. Search KFB source bank before new sourcing.
7. Audition exact source objects in isolation.
8. Define semantic event payload.
9. Define material / energy / size mapping.
10. Build the smallest useful recipe.
11. Add source pool variation.
12. Wire into existing mix/spatial owner.
13. Add priority/concurrency/debounce if needed.
14. Add cartoon/signature sweetener only after physical read works.
15. Build fixed listening fixture.
16. Run technical checks.
17. Run human listening gate.
18. Persist evidence / Return.
```

Do not begin by generating fifty new sounds.

---

# 36 · Source Acquisition Workflow

Only after a recipe exposes a source gap:

```text
GAP
→ define semantic need
→ define duration / one-shot / sustain
→ define material
→ define energy / size
→ define dry/wet preference
→ define number of variants
→ search current KFB bank again
→ research licensed external source / record / synth appropriately
→ provenance record
→ isolated audition
→ recipe audition
→ human admission
```

Never add anonymous AI-generated assets directly to canonical pools.

If AI-assisted generation is explored:

- provenance must remain explicit;
- it must pass the same material/variation/listening gates;
- it gets no quality exemption because it was easy to produce.

---

# 37 · LLM Execution Contract

When an LLM is asked to “improve the sound effects,” it must **not** immediately write a generic WebAudio oscillator patch.

First state:

```text
CONSUMER OWNER:
CURRENT AUDIO RUNTIME:
EVENT-TRUTH OWNER:
TARGET SFX FAMILY:
SOURCE BANK:
MATERIAL INPUT:
TELEMETRY INPUT:
MIX/SPATIAL OWNER:
BOUND OUTCOME:
PROTECTED BOUNDARY:
LISTENING FIXTURE:
```

## 37.1 Required before implementation

```text
[ ] current SSOT / Return read
[ ] current audio baseline read
[ ] current consumer audio modules inspected
[ ] existing KFB source assets searched
[ ] exact candidate sources auditioned/identified
[ ] event truth owner known
[ ] no second runtime owner introduced
[ ] material / energy semantics defined
[ ] reuse decision documented
```

## 37.2 Required before “fixed”

```text
[ ] correct semantic event fires
[ ] miss / inactive case stays clean
[ ] material is distinguishable
[ ] energy/size read correctly
[ ] repetition is controlled
[ ] continuous lifecycle is clean if applicable
[ ] priority/concurrency behavior tested
[ ] spatial class correct
[ ] dry/wet/tail ownership correct
[ ] music/ambience coexistence checked
[ ] cartoon sweetener remains subordinate to cause/readability
[ ] exact sources/provenance recorded
[ ] human listening evidence exists for sonic-quality claim
[ ] no unrelated runtime owner changed
```

---

# 38 · Final Quality Gate

A production SFX family passes only if every applicable answer is yes.

```text
[ ] Is the current runtime owner known?
[ ] Is authoritative event truth external to the audio renderer?
[ ] Is the semantic event named?
[ ] Are source/target materials explicit where relevant?
[ ] Is energy / size explicit where relevant?
[ ] Is the material vocabulary perceptually meaningful?
[ ] Were existing KFB sources searched first?
[ ] Were chosen sources auditioned in isolation?
[ ] Are provenance and license known?
[ ] Is the recipe functional-layered rather than arbitrary?
[ ] Does every layer have a job?
[ ] Are ordinary events free of unnecessary layers?
[ ] Are source pools varied enough?
[ ] Is immediate repetition controlled?
[ ] Is randomization reproducible when evidence needs it?
[ ] Do pitch/gain changes polish rather than fake variation?
[ ] Are one-shot and stateful events separated?
[ ] Does continuous contact use ENTER/SUSTAIN/EXIT?
[ ] Does friction use believable texture as primary?
[ ] Does a combat miss remain free of target impact?
[ ] Does confirmed contact drive impact audio?
[ ] Do blended terrains avoid unstable single-material flipping?
[ ] Does actor/object size affect perceived mass where needed?
[ ] Does Foley remain tied to truthful motion?
[ ] Are character/object signatures stable?
[ ] Is cartoon exaggeration deliberate rather than generic?
[ ] Are UI and world spatial classes separated?
[ ] Is dry/wet/space ownership coherent?
[ ] Are priority/concurrency/debounce explicit?
[ ] Is silence allowed?
[ ] Does the mix coexist with score/ambience/voice?
[ ] Are technical diagnostics available?
[ ] Is there a fixed listening fixture?
[ ] Did human listening accept the sonic outcome?
[ ] Was no second universal audio runtime introduced?
```

---

# 39 · KFB Current Canonical Direction

```text
Game truth first.
Material means something.
Energy means something.
Size means something.

Recipe, not filename.
Source variation before pitch tricks.
Texture before tonal fake friction.
One-shot and continuous are different contracts.

Physical read first.
Cartoon exaggeration second.
Signature stays consistent.

Priority before loudness.
Silence is allowed.
Mix owner stays singular.

Technical PASS does not mean sonic PASS.
Human listening closes the sound gate.
```

For KFB specifically:

```text
credible cause
→ pleasing physical/material read
→ controlled weirdness
→ consistent sonic identity
→ room to breathe
```

The target is not “more sound.”

The target is a world that feels coherent, responsive, weird, fun and acoustically pleasant.
