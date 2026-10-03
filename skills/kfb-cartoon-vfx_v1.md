---
name: kfb-cartoon-vfx
version: 1.0
status: canonical-draft
scope: gameplay VFX · clay particles · impact choreography · trails · vehicles · flight · water · comic typography · transition concealment
primary-language: English for implementation, German accepted for direction
owner: Georg / KFB
depends-on:
  - skills/kfb-cartoon-animation_v2.md
  - current KFB visual / clay material canon
  - current consumer runtime, actor, physics, collision and camera owners
research-workflow: KFB-VFX-LANGUAGE-SKILL-01
---

# KFB Cartoon VFX
## Semantic Effects, Claymation Feedback and Cross-Game Visual Language

## 0 · Purpose

This skill governs how KFB gameplay events become readable visual effects.

It covers:

- combat impacts and weapon trails;
- direct hits, misses, bounces, scrapes and near misses;
- melee contact support;
- ground and AOE feedback;
- jumps, landings, skids and interaction accents;
- vehicle rolling, drifting, braking, off-road dust, scraping, impacts and boosts;
- vehicle enter / exit concealment;
- flight speed lines, contrails and near-ground disturbance;
- boat wake, bow response, spray and water entry;
- smoke, fire and residue;
- comic words, symbols and emanata used as VFX;
- screen-space speed / impact treatment;
- reusable instanced clay particles;
- quality scaling, pooling, determinism and effect budgets;
- LLM authoring and implementation review.

This skill is provider-neutral. It may be used by ChatGPT, Claude, Codex or another implementation/design agent.

It is also engine-neutral. Three.js examples are important because KFB already has proven Three.js donors, but the semantic contract applies equally to Unity, Unreal, Godot, Blender-authored game assets or another renderer.

This skill specializes the timing and visual hierarchy rules in skills/kfb-cartoon-animation_v2.md.

It does not replace:

- gameplay state;
- damage or health logic;
- collision / hit validation;
- vehicle physics;
- locomotion;
- actor / rig ownership;
- weapon attachment ownership;
- camera ownership;
- the current KFB clay material / look owner;
- consumer-specific effect renderers that already work.

---

# 1 · Prime Directive

> **VFX is semantic choreography, not particles.**

A good effect answers:

~~~text
What actually happened?
Where did it happen?
Who or what caused it?
How strong was it?
What surface / medium was involved?
What should be read first?
What may remain after the event?
~~~

A particle system is only one possible renderer for that answer.

Bad architecture:

~~~text
collision
→ spawn random spheres
→ add glow
→ add shake
→ add text
~~~

KFB architecture:

~~~text
authoritative event fact
→ semantic VFX event
→ recipe + timing + visual budget
→ one or more style adapters
→ pooled renderers
→ measurable cleanup
~~~

## 1.1 Truth before style

VFX may exaggerate a true event.

VFX may not invent a false event.

Examples:

~~~text
true hard hit
→ exaggerated squash, burst and debris       OK

true near miss
→ air streak / cloth flutter                 OK

miss
→ HIT confirmation                           NOT OK

small decorative dust ring
→ drawn like a damaging AOE                  NOT OK

vehicle scrape
→ metal streak + sparse chips                OK

vehicle never touched barrier
→ scrape sparks because it looked dramatic   NOT OK
~~~

## 1.2 Clay-first, not clay-only

KFB's primary effect vocabulary is claymation-compatible:

- small clay balls / crumbs;
- squashed drops;
- short chips / shards;
- stretched clay smears;
- chunky foam / dust clusters.

But some visual jobs are better handled by another primitive:

- ribbons for continuous trails;
- 2D masks for flashes or stylized bursts;
- rings / sheets for ground contact and water waves;
- screen-space speed lines;
- comic glyphs / words;
- lightweight post effects.

The rule is:

> Use the cheapest primitive that communicates the event clearly while preserving the KFB look.

Do not force every effect into a 3D ball.

---

# 2 · Ownership Model

Keep these responsibilities separate.

~~~text
gameplay / physics owner
  owns truth:
  state, motion, collisions, contact, damage, water contact, drift, boost, etc.

animation owner
  owns authored pose, clip timing, anticipation, follow-through and recovery

VFX semantic layer
  names the event and normalizes the payload

VFX recipe layer
  maps meaning to timing, hierarchy, anchors and effect primitives

style adapters
  choose clay / ink / sprite / ribbon / glyph / screen implementation

renderers
  own pools, meshes, materials, buffers, lifetimes and cleanup

camera / audio / hitstop
  consume the same event when allowed
  remain separate feedback channels
~~~

### Hard rule

> **Never calculate a second gameplay truth inside VFX when the consumer already owns that value.**

Examples:

~~~text
already have driftIntensity
→ VFX consumes driftIntensity

already have hit contact point
→ VFX consumes contact point

already have water surface query
→ wake consumes water-surface result

already have actor / wheel / seat node
→ VFX anchors to that source node
~~~

Do not estimate those facts again from visual transforms unless the owner exposes no usable data.

---

# 3 · The Semantic Event Contract

Every implementation should expose an equivalent of this contract.

~~~ts
type KfbVfxEvent = {
  id: string
  type: string
  time: number
  seed: number

  source?: {
    id?: string
    kind?: 'actor' | 'weapon' | 'vehicle' | 'projectile' | 'prop' | 'world'
    objectRef?: unknown
  }

  target?: {
    id?: string
    kind?: string
    objectRef?: unknown
  }

  truth: {
    contact:
      | 'none'
      | 'confirmed_target'
      | 'confirmed_world'
      | 'bounce'
      | 'scrape'
      | 'near_miss'
    consequence?: 'none' | 'cosmetic' | 'accepted'
    authoritativeAreaRadius?: number
  }

  frame?: {
    point?: Vec3
    normal?: Vec3
    tangent?: Vec3
    incoming?: Vec3
    velocity?: Vec3
    relativeVelocity?: Vec3
    impulse?: Vec3
  }

  motion?: {
    speed?: number
    normalizedSpeed?: number
    acceleration?: number
    lateralSlip?: number
    driftIntensity?: number
    yawRate?: number
    nearGround?: number
    altitude?: number
  }

  environment?: {
    surface?: string
    biome?: string
    medium?: 'air' | 'ground' | 'water'
    wetness?: number
    wind?: Vec3
  }

  intensity: {
    energy: number
    significance: number
  }

  anchors?: KfbVfxAnchor[]

  text?: {
    mode?: 'motion' | 'impact' | 'reaction'
    token?: string
  }

  tags?: string[]
}
~~~

The exact object syntax is optional.

The information separation is not.

## 3.1 Required truth distinction

Do not collapse these into one impact event:

~~~text
confirmed target hit
confirmed world hit
bounce
scrape
near miss
~~~

They may share render primitives, but they do not share meaning.

## 3.2 Intensity has two dimensions

Energy and significance are not identical.

A high-energy background crash may be visually subordinate to a low-energy player pickup.

Use:

~~~text
energy
= physical / authored force

significance
= how important the event is to the player right now
~~~

This prevents background VFX from competing with the primary read.

---

# 4 · Anchor Spaces

Every effect element declares where it lives.

Preferred anchor vocabulary:

~~~text
SOURCE_OBJECT
SOURCE_BONE
TARGET_OBJECT
TARGET_BONE
WEAPON_SOCKET
WHEEL
SEAT
CONTACT
SURFACE
GROUND
WATER_SURFACE
PROJECTILE
WORLD
SCREEN
~~~

## 4.1 Attached vs released

This distinction is mandatory.

### Attached source

An emitter remains bound to a moving owner.

Examples:

- burning source on a moving actor;
- muzzle;
- exhaust;
- weapon trail head;
- wheel smoke source;
- contrail source;
- seat/foot transition puff source.

### Released world effect

The effect leaves the source and continues in world space.

Examples:

- already emitted smoke;
- debris;
- droplets;
- dust;
- sparks;
- leaves;
- residue.

Correct:

~~~text
burning vehicle moves
→ flame source follows vehicle
→ emitted smoke stays behind
~~~

Incorrect:

~~~text
whole smoke cloud remains glued to vehicle forever
~~~

## 4.2 Source-object proof

A URL or filename is not proof of a usable anchor.

Before integrating a donor:

1. load / inspect the real source;
2. show the relevant source object in isolation;
3. identify its real transform / node / socket;
4. only then connect the VFX.

Do not attach to an approximate duplicate transform when the source node exists.

---

# 5 · Visual Hierarchy and Budgets

The KFB motion skill already requires primary, secondary and tertiary reads.

VFX makes this measurable.

Default event budget:

~~~ts
type VfxBudget = {
  primary: 1
  secondary: 2
  tertiary: 3

  dominantScreenEffect: 1
  dominantCameraAction: 1
  dominantGlyph: 1

  maxSimultaneousBeatSignals: 3
}
~~~

These are default ceilings, not quotas.

An ordinary footstep might use:

~~~text
primary: none
secondary: 1 tiny dust/chip response
tertiary: none
~~~

A major boss landing might use:

~~~text
primary: body/ground impact
secondary: ground ring + clay burst
tertiary: 2–3 debris / dust families
optional: one camera action
~~~

## 5.1 Stronger is not always more particles

Prefer escalation in this order:

~~~text
clearer timing
→ larger primary shape
→ stronger directional deformation
→ longer follow-through
→ more secondary spread
→ only then more particle count
~~~

## 5.2 Saturation shedding

If a renderer is full:

1. preserve primary;
2. preserve semantic secondary cues;
3. drop tertiary atmosphere first;
4. never grow the scene unbounded to preserve decoration.

---

# 6 · KFB Effect Primitive Vocabulary

These are presentation primitives, not gameplay meanings.

## 6.1 BALL

Use for:

- soft clay crumbs;
- dust knots;
- foam;
- bubbles;
- rounded debris;
- soft impact punctuation.

Shape read:

~~~text
round / soft / friendly / blunt
~~~

## 6.2 DROP

A squashed / stretched blob.

Use for:

- directional puff;
- splash;
- smoke lobe;
- soft body fragment;
- acceleration smear.

Shape read:

~~~text
soft but directional
~~~

## 6.3 CHIP

A short flattened or capsule-like clay fragment.

Use for:

- hard debris;
- gravel;
- leaves / litter;
- metal / stone fragments;
- scrape chips;
- directional shards.

Shape read:

~~~text
hard / sharp / directional
~~~

Clay does not mean every particle must be round.

## 6.4 RIBBON

Use for continuous motion:

- weapon slash trail;
- projectile trail;
- vehicle speed streak;
- contrail;
- scrape streak;
- wake edge.

A ribbon is preferable to a dense chain of puffs.

## 6.5 RING / SHEET

Use for:

- ground impact;
- AOE boundary;
- water ring;
- shock wave;
- skid smear;
- contact plane accent.

If the ring communicates gameplay range, its dimensions must derive from the authoritative range.

If it is decorative only, it must be visibly subordinate and may not imply a false damage boundary.

## 6.6 MASK / SPRITE

Use for:

- extremely fast contact flash;
- muzzle burst;
- ink burst;
- stylized smoke cell;
- flipbook;
- star / arc / slash shape.

Prefer one reusable grayscale / white mask with runtime tint where possible.

## 6.7 GLYPH

Use for:

- onomatopoeia;
- punctuation;
- motion symbols;
- reaction marks.

Glyphs are VFX, not UI labels.

## 6.8 SCREEN

Use for:

- speed lines;
- radial speed pulse;
- brief impact frame;
- bounded blur when explicitly approved.

Screen effects are global and therefore expensive in attention.

Use sparingly.

---

# 7 · Effect Modes

Every recipe element uses one of these modes.

~~~text
BURST
RATE
LOOP
TRAIL
VOLUME
RESIDUE
GLYPH
SCREEN
DEFORM
FLASH
~~~

## 7.1 BURST

One causal event.

Examples:

- landing;
- hit;
- collision;
- water entry;
- mount concealment peak.

## 7.2 RATE

Continuous cause expressed as particles per second.

Examples:

- drift dust;
- rolling crumbs;
- rain splash;
- low-flight leaves.

> Continuous emission is time-based, not frame-count based.

## 7.3 LOOP

Persistent authored effect while state is active.

Examples:

- exhaust;
- fire source;
- charged aura.

## 7.4 TRAIL

Path history.

Examples:

- slash;
- contrail;
- projectile streak;
- wake.

## 7.5 VOLUME

A loose evolving mass.

Examples:

- smoke;
- dust cloud;
- mist.

## 7.6 RESIDUE

Something remains after the event.

Examples:

- scorch;
- splat;
- track mark;
- small clay chip settlement.

## 7.7 GLYPH / SCREEN / DEFORM / FLASH

Non-particle sibling feedback channels.

They consume the same semantic event.

They do not need their own duplicate collision logic.

---

# 8 · Timing Grammar

A strong effect is normally a short composition.

Default model:

~~~text
ANTICIPATION
→ CONTACT / PEAK
→ HOLD
→ RELEASE
→ AFTERMATH
→ CLEANUP
~~~

Not every event needs every phase.

## 8.1 Stagger components

Do not begin every visual component on the same frame.

Example: fire

~~~text
0 ms       ignition flash / hot clay tongue
60 ms      sustained flame begins
220 ms     smoke starts
750 ms     flame source ends
1450 ms    last smoke resolves
~~~

This reads as a process rather than a colored explosion.

## 8.2 Pop first

For short impacts, the first readable frame should usually be near the strongest silhouette.

Do not spend half the effect growing into visibility.

## 8.3 Separate clocks

These may have different durations:

- animation hitstop;
- deformer hold;
- material flash;
- debris lifetime;
- smoke lifetime;
- camera impulse;
- glyph hold.

One duration field for the entire event is usually insufficient.

## 8.4 Simulation time

Stateful VFX use host simulation dt.

Do not use wall-clock time inside gameplay effect modules.

---

# 9 · Recipe Contract

Use equivalent data even if the implementation language differs.

~~~ts
type KfbVfxRecipe = {
  id: string
  eventType: string

  conditions?: {
    contact?: string[]
    surfaces?: string[]
    minEnergy?: number
    maxEnergy?: number
    tags?: string[]
  }

  primary?: VfxLayer[]
  secondary?: VfxLayer[]
  tertiary?: VfxLayer[]

  phases?: {
    anticipation?: number
    peak?: number
    hold?: number
    release?: number
    cleanup?: number
  }

  camera?: VfxCameraRequest | null
  hitstop?: VfxHitstopRequest | null

  quality?: {
    low?: VfxQualityOverride
    medium?: VfxQualityOverride
    high?: VfxQualityOverride
  }
}

type VfxLayer = {
  mode:
    | 'BURST'
    | 'RATE'
    | 'LOOP'
    | 'TRAIL'
    | 'VOLUME'
    | 'RESIDUE'
    | 'GLYPH'
    | 'SCREEN'
    | 'DEFORM'
    | 'FLASH'

  primitive?: 'BALL' | 'DROP' | 'CHIP' | 'RIBBON' | 'RING' | 'MASK'

  anchor: string
  t0: number
  duration: number

  curve?: 'pop' | 'grow' | 'rise' | 'settle' | 'fade'
  size?: number
  opacity?: number
  count?: number
  rate?: number

  directionFrom?:
    | 'normal'
    | 'incoming'
    | 'velocity'
    | 'impulse'
    | 'tangent'
    | 'outward'

  inheritVelocity?: number
}
~~~

A recipe is data.

A renderer decides how BALL or RIBBON is drawn.

A gameplay owner decides whether the event exists.

---

# 10 · Contact Frame

For directional impacts, construct a local frame from real contact data.

Preferred inputs:

~~~text
point
normal
incoming / impulse direction
tangent
~~~

Derive:

~~~text
N = surface normal
I = normalized incoming direction
T = projected incoming direction on contact plane
B = cross(N, T)
~~~

Use the frame for:

- clay debris fan;
- slash plane;
- spark direction;
- glyph skew;
- ground smear;
- ring orientation;
- target deformation axis.

### Important

Surface normal and impact direction are not interchangeable.

A body can have a curved local normal while the hit force still travels in a clear world direction.

---

# 11 · Surface Response

The source / weapon determines energy and often color.

The contacted surface determines the response family.

| Surface | Primary response | Debris | Residue | Notes |
|---|---|---|---|---|
| organic | soft burst / drop | soft chips | optional | avoid metallic spark language |
| metal | sharp star / streak | sparks / chips | scratch / scorch | scrape can become continuous |
| wood | dry burst | chips | dark mark | stronger directional shards |
| stone | dry hard burst | gravel chips | dust / mark | short heavy motion |
| glass | sharp star | thin chips | optional | sparse, fast, brittle |
| paper | flat puff | flakes | tear / mark | low-mass motion |
| water | splat / ring | droplets | none | surface anchored |
| slime | splat | drops | splat | slow secondary motion |
| ice | sharp burst | chips | crack cue | brittle |
| air | short directional streak | minimal | none | never leave a ground mark |

Consumer projects may add surfaces.

Do not hard-code a material table into gameplay physics merely for VFX.

---

# 12 · Combat VFX

## 12.1 Attack swing

Typical recipe:

~~~text
STARTUP
  optional tiny anticipation smear

ACTIVE
  weapon-bound ribbon
  ribbon intensity follows authored swing window

CONTACT
  contact burst at confirmed point
  direction follows impact frame

REACTION
  target clip / deformer
  short material flash

AFTERMATH
  surface-dependent debris
  optional smoke / residue
~~~

A trail may show where the weapon travelled.

It must not decide whether the weapon hit.

## 12.2 Direct hit

Preferred hierarchy:

~~~text
PRIMARY
target/body reaction

SECONDARY
contact burst or ring

TERTIARY
surface debris / small residue
~~~

Do not let the contact particle cloud completely cover the reaction pose.

## 12.3 Contact-imprecision cover

VFX may hide small visual mismatch between animation contact and collision contact.

Allowed:

- short burst centered on authoritative contact;
- very short smear between weapon and contact;
- small ring / star;
- 1–3 clay chips.

Not allowed:

- moving the visible hit effect far enough to imply a hit that visually never occurred;
- enlarging an impact cloud until any contact error disappears;
- changing damage timing to match an effect.

Use a project-declared maximum conceal distance.

## 12.4 Miss / near miss

Possible cues:

- short air ribbon;
- fabric / leaf disturbance;
- subtle motion glyph;
- no hit flash;
- no damage-confirmation word.

## 12.5 Bounce

Bounce is world contact without target confirmation.

Use:

- compressed contact puff;
- small surface response;
- outgoing direction visibly changes;
- optional hop-specific sound/glyph.

## 12.6 Scrape

A scrape is continuous contact.

Use:

~~~text
contact-following ribbon / streak
+ sparse chips / sparks at rate
+ surface-specific mark if owned
~~~

Do not emit a full impact burst every frame.

## 12.7 AOE

If VFX is a gameplay telegraph:

> Visual radius and timing derive from the authoritative AOE.

If it is aftermath only:

- keep it visually subordinate;
- do not imply a larger active region than gameplay.

---

# 13 · Locomotion and Character Interaction

## 13.1 Footstep

Small and surface-specific.

Examples:

~~~text
dry soil
→ 1–3 BALL/CHIP crumbs

wet ground
→ 1–2 DROP splats

hard clean floor
→ no particle, or one tiny contact tick
~~~

Not every step needs a visible effect.

## 13.2 Jump launch

~~~text
body anticipation
→ foot-contact compression
→ short outward clay puff
→ clean airborne silhouette
~~~

Launch dust should originate from ground contact, not character center.

## 13.3 Landing

Scale with vertical impact, not total speed.

Possible layers:

~~~text
PRIMARY
body squash / landing pose

SECONDARY
ground burst

TERTIARY
ring or a few chips
~~~

## 13.4 Skid / stop

Use motion tangent and braking/slip state.

A skid is not a generic radial burst.

## 13.5 Interaction

Buttons, levers, pickups or prop contact should use the smallest cue that confirms the action.

VFX is feedback, not confetti.

---

# 14 · Vehicle and Racer VFX

The vehicle VFX adapter should consume values already owned by vehicle physics.

Recommended inputs:

~~~text
wheel contact points
surface
speed
longitudinal velocity
lateral slip / driftIntensity
yaw rate
brake state
boost state
impact point / impulse
airborne state
~~~

## 14.1 Roll

Low continuous crumbs/dust from contact wheels.

Use RATE.

Do not make ordinary rolling look like drifting.

## 14.2 Drift

Driven by lateral slip / drift intensity.

Typical:

~~~text
rear wheel / contact anchors
→ warm clay puffs or smoke lobes
→ outward + backward direction
→ rate scales with drift
~~~

The effect reads the existing drift value.

It does not recalculate drift from visuals.

## 14.3 Off-road

Surface response differs from asphalt drift.

Examples:

- gravel chips;
- dry dust;
- grass / leaf chips;
- mud drops.

## 14.4 Brake

Can use:

- brief tire smoke;
- short ground smear;
- tiny wheel contact glyph if stylistically approved.

Do not reuse boost speed lines.

## 14.5 Barrier / vehicle impact

~~~text
PRIMARY
vehicle body reaction / deformation / authored jolt

SECONDARY
contact burst

TERTIARY
surface-specific fragments
~~~

Metal on metal may add sparse bright chips/sparks.

## 14.6 Metal scrape

~~~text
TRAIL
thin contact streak following scrape path

RATE
few sparks / clay chips

RESIDUE
optional scratch owned by surface / vehicle decal system
~~~

## 14.7 Boost

Do not start every component at maximum simultaneously.

Suggested phases:

~~~text
BOOST_START
short exhaust pulse + optional ring

BOOST_LOOP
dominant exhaust / ribbon
+ speed lines at higher threshold

BOOST_PEAK
optional bounded screen pulse

BOOST_END
trail resolves; speed lines fade
~~~

## 14.8 Jump / landing

Vehicle landing effect uses:

- landing impulse;
- wheel / chassis contact;
- surface;
- vehicle mass class.

Do not simply scale by forward speed.

---

# 15 · Vehicle Enter / Exit and Transition Concealment

This is a first-class VFX use case.

The purpose is not to simulate a door animation that does not exist.

The purpose is to make an intentionally stylized state transition read as a cartoon event.

## 15.1 Ownership

Gameplay owns:

~~~text
outside vehicle
→ transition
→ inside vehicle
~~~

VFX owns only the visual cover around a declared transition hook.

## 15.2 Three-phase recipe

### ANTICIPATION

Short preparation:

- actor crouch / compress if animation provides it;
- small foot / seat-directed clay chips;
- optional short smear toward vehicle.

### CONCEALMENT PEAK

The representation swap may happen here.

Use a compact combination:

~~~text
1 clay puff cluster
+ optional ring / smear
+ optional tiny glyph
~~~

The effect should be large enough to cover the missing in-between pose but not large enough to hide half the scene.

### SETTLE

- 1–3 trailing particles inherit movement;
- a few puffs settle near foot / seat / wheel;
- actor/vehicle is already in its new authoritative state.

## 15.3 Generic use

The same pattern may support:

- mount / dismount;
- teleport;
- prop swap;
- costume/state swap;
- character pop-in/out;
- entering a hatch without a detailed door rig.

Name it a transition concealment recipe, not a fake animation.

---

# 16 · Flight VFX

## 16.1 Speed lines

Use screen-space or camera-relative tapered streaks.

Preferred behavior:

- appear above a meaningful speed threshold;
- increase density / brightness more than raw thickness;
- frame motion;
- do not cover the player;
- fade smoothly.

## 16.2 Contrails

Use actual source anchors.

~~~text
source anchor
→ path history
→ ribbon
~~~

On teleport / respawn:

> Clear the path history.

Otherwise the trail may draw across the world.

## 16.3 Near-ground disturbance

This is an environment-response event.

Consumer supplies:

~~~text
nearGroundFactor
ground material / biome
source velocity
source radius
downwash / influence vector
~~~

Adapter chooses:

- dry dust;
- leaves;
- small litter;
- grass chips;
- snow;
- water mist.

Do not run expensive object-by-object leaf physics by default.

## 16.4 Leaf language

Leaves should normally use CHIP-like primitives:

- flat / light;
- randomized orientation;
- strong drag;
- quick initial acceleration;
- short flutter / tumble.

Do not render them as spherical dust.

---

# 17 · Water and Boats

Default KFB water response is layered, not fully simulated.

## 17.1 Wake stack

~~~text
PERSISTENT
surface-anchored wake ribbon / mesh

SECONDARY
foam / clay drops along wake edge

OPTIONAL
light spray / mist

ONE-SHOT
entry / hard turn / impact splash
~~~

## 17.2 Surface anchoring

The wake belongs on the water surface.

It should not float at the vehicle / boat transform when the source rises.

## 17.3 Bow response

Inputs:

- water contact;
- forward speed;
- hull width;
- turn / yaw rate;
- optional acceleration.

Visuals:

- bow wave sheet / ring;
- outward droplets;
- foam streak.

## 17.4 Hard water entry

Use a one-shot burst independent of the steady wake threshold.

Otherwise the most important water-contact moment can occur before the continuous wake has faded in.

---

# 18 · Fire and Smoke

Use a staged process.

Recommended phases:

~~~text
IGNITION
hot compact burst

BURN
repeated tongues / lobes

SMOKE
later, slower, darker volume
~~~

Rules:

- deterministic flicker where replay/testability matters;
- smoke starts after the ignition peak;
- smoke inherits some source impulse;
- source can stay attached;
- released smoke becomes world-space;
- host surface/background should inform smoke contrast.

Do not use one simultaneous orange+gray particle explosion as fire.

---

# 19 · Comic Typography as VFX

Comic words and symbols are a first-class feedback channel.

They may reinforce particles or replace them where clearer.

## 19.1 Modes

~~~text
motion
impact
reaction
~~~

Use project-approved vocabulary.

Do not randomly select an impact word for a movement-only event.

## 19.2 Transform from the event frame

A glyph should inherit:

- contact point or motion anchor;
- tangent / incoming direction;
- surface normal;
- intensity;
- significance.

Possible animation:

~~~text
anticipation: compressed
peak: snap open / stretch along force
hold: very short readable pose
release: recoil / skew
cleanup: shrink, fly or dissolve
~~~

## 19.3 Shape integration

Words should be shaped by the impact.

Examples:

~~~text
hard vertical slam
→ wider at base, compressed vertically, debris behind

fast horizontal strike
→ stretched along tangent, slight shear

round soft bounce
→ inflated / rounded word shape
~~~

Do not paste flat UI text over the finished scene.

## 19.4 Placement

Prefer free visual space near the event.

Do not cover:

- face;
- weapon contact;
- critical enemy tell;
- gameplay telegraph.

Only one dominant glyph per beat unless the composition explicitly requires a sequence.

---

# 20 · Screen-Space Effects

Screen effects are powerful because they affect everything.

Use them last, not first.

Possible channels:

- speed lines;
- brief radial pulse;
- bounded radial blur;
- impact frame;
- FOV request owned by camera system.

Rules:

1. one dominant screen effect per beat;
2. no permanent whiteout;
3. prewarm shaders / materials;
4. screen effect must cleanly resolve to the baseline frame;
5. accessibility / comfort settings may reduce or disable it;
6. VFX does not directly seize camera ownership.

---

# 21 · Performance Architecture

## 21.1 Pooling

Prefer fixed pools.

A full pool should drop low-priority effects instead of allocating indefinitely.

## 21.2 Instancing

For Three.js, repeated clay primitives should normally be grouped by shared geometry/material with InstancedMesh.

Recommended:

~~~text
one InstancedMesh for BALL
one InstancedMesh for DROP
one InstancedMesh for CHIP
~~~

Per instance:

- matrix;
- color;
- age/life where needed;
- optional variant data.

## 21.3 Typed state

For large particle counts, prefer flat typed arrays / struct-like storage over one heap object per particle.

## 21.4 Ribbons

Use path buffers for trails.

Do not spawn dozens of sprites per frame merely to imitate continuity.

## 21.5 Projection-safe sizes

Screen-facing particles must have a sensible pixel cap.

A small world-space particle near the camera must not become a giant translucent disk.

## 21.6 No per-frame asset creation

Do not create:

- geometry;
- materials;
- textures;
- audio players;
- new effect definitions

inside the normal frame loop.

## 21.7 Prewarm

Compile / warm effect materials that would otherwise hitch on first use.

Especially:

- screen post;
- unusual blend modes;
- flipbooks;
- rare boss / boost effects.

## 21.8 Culling / quality

Quality tiers may change:

- particle count;
- active pool cap;
- lifetime;
- secondary primitives;
- mesh complexity;
- distant emission.

They should not remove essential semantic feedback.

---

# 22 · Determinism

When practical:

~~~text
event seed
→ deterministic variant selection
→ deterministic scatter
→ deterministic flicker
~~~

Benefits:

- replay;
- debugging;
- screenshot comparison;
- network consistency;
- regression tests.

Never perturb the consumer's unrelated random sequence merely because VFX needs variation.

Use a local seed stream.

---

# 23 · Quality Degradation

Suggested order when reducing cost:

~~~text
1 keep primary semantic cue
2 reduce tertiary particle count
3 reduce secondary count
4 simplify mesh primitive
5 shorten distant lifetime
6 disable optional screen treatment
7 never remove the only confirmation that an action happened
~~~

For accessibility / comfort:

- camera shake may be reduced or disabled;
- strong flashes may be reduced;
- speed line density may be reduced;
- semantic contact cue should remain readable through another channel.

---

# 24 · LLM Authoring Workflow

An LLM or implementation agent must not jump directly from request to particles.

Use this sequence.

## Step 1 · Identify the authoritative owner

Write:

~~~text
event owner:
motion owner:
collision/contact owner:
surface/environment owner:
camera owner:
existing VFX renderer/donors:
~~~

## Step 2 · Inspect donors in isolation

For every reused effect donor:

- open the real source;
- inspect actual frames / geometry / nodes;
- show source object separately before integration;
- record exact path/ref;
- do not infer animation semantics from filenames.

## Step 3 · Write the semantic event

Example:

~~~text
type: vehicle.scrape
truth.contact: scrape
anchor: CONTACT
surface: metal
relativeVelocity: ...
energy: ...
significance: ...
~~~

## Step 4 · Write the read hierarchy

~~~text
primary:
secondary:
tertiary:
~~~

If three lines all sound equally important, simplify.

## Step 5 · Build a recipe, not code

Specify:

- phases;
- anchors;
- primitive families;
- direction sources;
- counts/rates;
- lifetimes;
- cleanup;
- quality behavior.

## Step 6 · Map recipe to existing renderers

Prefer current systems.

Examples:

~~~text
clay burst
→ existing clay instanced primitive donor / consumer implementation

impact sprite
→ existing sprite/atlas owner

trail
→ existing ribbon/trail owner

speed lines
→ existing Travel speed-line module

water wake
→ existing Travel wake pattern
~~~

Only create a new renderer when an existing primitive family cannot express the required effect.

## Step 7 · Measure

At minimum:

- event fired count;
- dropped count;
- live count;
- pool cap;
- draw calls;
- cleanup success;
- invalid dt / invalid anchor count;
- optional screenshots / browser proof.

## Step 8 · Visual review

Ask:

~~~text
Can I identify the event without explanation?
Does the primary read win?
Does the effect originate at the correct place?
Does direction match the action?
Does stronger gameplay read stronger?
Does the effect end cleanly?
Does it preserve the KFB clay/cartoon language?
Does it hide gameplay information?
~~~

---

# 25 · QA Gates

A VFX implementation is not production-ready because it emits pixels.

## 25.1 Truth gate

PASS only if:

- confirmed hit VFX requires confirmed hit;
- miss does not look like hit;
- scrape differs from impact;
- water response occurs on water;
- AOE/telegraph scale matches gameplay truth where authoritative.

## 25.2 Anchor gate

PASS only if:

- source object/socket is verified;
- attached emitters follow their source;
- released effects remain in world space where intended;
- respawn/teleport clears path history.

## 25.3 Timing gate

PASS only if:

- important peak is readable;
- phases are intentionally staggered;
- no frame-rate-dependent continuous emission;
- cleanup finishes.

## 25.4 Hierarchy gate

PASS only if:

- primary read dominates;
- secondary supports;
- tertiary does not obscure bodies / telegraphs.

## 25.5 Performance gate

Record actual:

- maximum live particles;
- maximum trails;
- draw calls;
- pool saturation;
- dropped tertiary events;
- first-use compile hitch if measurable.

## 25.6 Determinism gate

When the feature is declared deterministic:

same event seed + same inputs
→ same effect choices / scatter within documented tolerance.

## 25.7 Donor gate

A donor passes only after its actual visual/source content is inspected.

A loaded asset URL is not enough.

## 25.8 Cross-state gate

Test at least:

- normal speed;
- low speed;
- high speed;
- state enter;
- state exit;
- teleport / reset where applicable;
- overlapping effects.

---

# 26 · Anti-Patterns

Reject these by default.

## 26.1 Generic puff

~~~text
every event
→ same radial dust cloud
~~~

## 26.2 Particle soup

Many equally loud layers with no hierarchy.

## 26.3 Puff-chain trail

Repeated billboards trying to impersonate one continuous streak.

## 26.4 Frame-rate emission

~~~text
spawn 4 particles every frame
~~~

without explicit frame-dependent intent.

## 26.5 Second physics owner

VFX independently guesses speed, drift, water contact or hit state.

## 26.6 False confirmation

Miss/bounce emits hit confirmation.

## 26.7 Attached aftermath

Smoke/debris remains glued to a moving source after release.

## 26.8 Camera spam

Shake on every small event.

## 26.9 Giant concealment cloud

Transition VFX hides missing animation by hiding the entire scene.

## 26.10 Filename animation inference

effect_01, effect_02, effect_03 assumed to be temporal frames without visual inspection.

## 26.11 New global engine without need

Do not replace proven KFB combat, travel or clay renderers merely to make the architecture look uniform.

Uniformity belongs in the semantic contract first.

---

# 27 · KFB Reference Implementations

These are donors / current implementations to inspect, not automatically global owners.

## Combat

~~~text
georg-doc/KFB-Combat-Arena/modules/kfb-vfx-recipes.js
georg-doc/KFB-Combat-Arena/modules/kfb-hit-response.js
georg-doc/KFB-Combat-Arena/modules/kfb-fx-sprites.js
georg-doc/KFB-Combat-Arena/modules/kfb-fx-trails.js
georg-doc/KFB-Combat-Arena/modules/kfb-fx-flame.js
georg-doc/KFB-Combat-Arena/modules/kfb-combat-cues.js
~~~

Proven concepts:

- recipes as data;
- anchors;
- primary/secondary/tertiary budgets;
- impact timeline;
- surface response;
- instanced sprite pools;
- ribbons;
- hit flash / deformation separation;
- deterministic seeded effects.

## Travel / flight / water

~~~text
travel/travel-v16/terrain-v16/speed-lines.js
travel/KFB Travel Globe v13-1/globe-v13/contrails.js
travel/KFB Travel Globe v13-1/globe-v13/drift-smoke.js
travel/KFB Travel Globe v13-1/globe-v13/impact-dust.js
travel/KFB Travel Globe v13-1/globe-v13/carpet-wake.js
travel/KFB Travel Globe v13-1/globe-v13/post-radial.js
~~~

Proven concepts:

- Tiny Skies-derived speed language;
- drift-state consumption;
- impulse-driven dust;
- water-surface anchoring;
- actual source-node trail anchors;
- bounded screen overlay.

## Clay particle donor

~~~text
tools/KFB-ToolBox/_inbox/KFB Knet-Strecke T4/
  KFB_TRACK_T4_M2_CLAUDE_DESIGN_SESSION_CUT_2026-09-28_r1/
  lab-vfx/clay-vfx.v1.js
  lab-vfx/clay-particle-profiles.v1.json
~~~

Proven concepts:

- BALL / DROP / CHIP primitives;
- instancing;
- pooling;
- local seeds;
- event + point + normal + energy + biome payload;
- bounce / stick / roll;
- quality tiers.

Important:

> Reuse its architecture. Do not silently promote its older reduced clay material over the current KFB clay/look owner.

---

# 28 · Minimal Cross-Engine Adapter Contract

A consumer can implement the skill with only:

~~~ts
interface KfbVfxAdapter {
  emit(event: KfbVfxEvent): void
  update(dt: number): void
  reset(reason?: string): void
  setQuality(level: 'off' | 'low' | 'medium' | 'high'): void
  stats(): KfbVfxStats
}
~~~

Optional renderer interfaces:

~~~ts
interface ClayBurstRenderer {}
interface SpriteMaskRenderer {}
interface RibbonRenderer {}
interface GroundSheetRenderer {}
interface GlyphRenderer {}
interface ScreenFxRenderer {}
~~~

The interface names do not matter.

The separation does.

---

# 29 · Example Recipes

## 29.1 Heavy melee hit on metal

~~~yaml
event: combat.contact.confirmed
surface: metal

primary:
  - DEFORM target along incoming direction

secondary:
  - FLASH target for a very short interval
  - BURST MASK at CONTACT, sharp/star-like

tertiary:
  - BURST CHIP x 4..6 along contact plane
  - RESIDUE scratch/scorch if surface owner supports it

optional:
  glyph:
    mode: impact
    orient: incoming/contact frame
  camera:
    one bounded request only
~~~

## 29.2 Car drift on dirt

~~~yaml
event: vehicle.drift
anchor: rear wheel contacts
input:
  driftIntensity
  speed
  surface: dirt

primary:
  none

secondary:
  RATE DROP/BALL clay dust
  direction: outward + backward
  rate: driftIntensity * speed

tertiary:
  occasional CHIP gravel
~~~

## 29.3 Low flight over leaves

~~~yaml
event: flight.near_ground
input:
  nearGround
  velocity
  downwash
  biome: leafy

secondary:
  RATE CHIP leaves
  direction: downwash + trailing velocity
  drag: strong
  lifetime: short

tertiary:
  sparse ground dust
~~~

## 29.4 Boat fast turn

~~~yaml
event: water.wake.turn
anchor: WATER_SURFACE
input:
  speed
  yawRate
  hullWidth

primary:
  TRAIL wake / foam edge

secondary:
  DROP spray on outer turn side

tertiary:
  VOLUME light mist only at higher energy
~~~

## 29.5 Vehicle entry concealment

~~~yaml
event: vehicle.enter

phase_anticipation:
  BURST small CHIP/DROP toward SEAT

phase_peak:
  BURST compact BALL/DROP clay puff
  RING tiny contact accent
  hook: concealPeak

phase_settle:
  1..3 released particles inherit vehicle velocity

rule:
  gameplay performs authoritative state swap
  VFX does not change vehicle state
~~~

---

# 30 · Exit Criteria for a VFX Slice

A bounded VFX slice may claim ready-for-review only when it can return:

~~~text
owner
repo / branch / PR / exact head

semantic event(s) implemented
runtime owner(s) consumed

donor source proof
exact donor refs

changed files

actual automated test counts

actual VFX event counts / pool stats
actual performance evidence where relevant

screenshots / browser proof where visual acceptance matters

direct KFB Stage URL if a human visual gate is required
or explicit NOT_DEPLOYED / NOT_REQUIRED if it is documentation-only

unresolved items

exactly one next gate
~~~

Do not claim visual acceptance from code review alone.

Do not promote Live automatically.

---

# 31 · Summary

The KFB VFX language is:

~~~text
TRUTH
→ EVENT
→ RECIPE
→ HIERARCHY
→ ANCHORS
→ TIMING
→ PRIMITIVES
→ STYLE
→ POOLED RENDERING
→ PROOF
~~~

Its visual signature is:

~~~text
clay-first
kinetic
directional
short
chunky
readable
surface-aware
cartoon-exaggerated
but never semantically dishonest
~~~

The system becomes reusable by standardizing meaning and choreography first.

Existing Combat, Travel and Clay implementations remain free to render that language with the modules they already own.
