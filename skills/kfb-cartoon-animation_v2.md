---
name: kfb-cartoon-animation
version: 2.0
status: canonical-draft
scope: 2D · 2.5D · 3D game motion · comic VFX · cartoon SFX · camera · procedural animation
primary-language: English for implementation, German accepted for direction
owner: Georg / KFB
depends-on:
  - skills/SSOT_Card_Ink_Outline_v2.md
  - KFB visual canon
  - project-specific asset manifests
---

# KFB Cartoon Motion — Mental Models, Choreography, and Proof Skill

## 0. Purpose

This skill governs how KFB characters, pets, cards, terrain objects, UI objects, comic effects, camera moves, and sounds move.

It exists to prevent a recurring failure mode:

> Adding transforms, particles, shakes, words, sounds, or random easing is not animation design.

KFB motion must be:

- semantically motivated;
- visually staged;
- readable in one glance;
- composed in time;
- physically suggestive without realism;
- cartoon-wild without becoming noisy;
- measurable;
- tested through actual playback and screenshots;
- reversible and additive to existing systems.

This skill applies to:

- 2D Canvas games;
- 2.5D puppet scenes;
- SVG rigs;
- pixel sprites;
- Three.js / R3F objects;
- WebGL materials where motion is visible;
- cards and card reveals;
- Emanata;
- bubbles;
- comic onomatopoeia;
- camera choreography;
- VFX and SFX;
- HyperFrames / video scenes;
- pet dialogue and presentation scenes.

It does **not** authorize inventing new art direction, replacing existing visual SSOTs, adding unrelated systems, or turning every state change into an effect.

---

# 1. Prime Directive

## 1.1 Motion is meaning in time

Every movement must answer at least one question:

```text
What happened?
Who caused it?
Where did it happen?
How strong was it?
What should the viewer look at first?
What remains after it ends?
```

If a movement cannot answer one of those questions, it is likely decorative noise and should be removed.

## 1.2 One clear read

At any important instant, the viewer must be able to identify:

```text
Primary read:
  the most important action or object

Secondary read:
  the reaction or reinforcement

Tertiary read:
  atmosphere, debris, small after-effects
```

Never make all three layers equally large, equally bright, equally animated, or equally loud.

```text
Bad:
character shake + giant text + ring + stars + dust + glow + sound + camera shake

Good:
character squash and recoil
→ short burst at contact
→ one readable word placed in free space
→ two small dust shapes
→ one dry sound
→ clean recovery
```

## 1.3 The whole body speaks

For pets, cartoon characters, and expressive props:

> Do not animate only the mouth, text, or eye. The entire body participates.

Speech and emotion may affect:

- torso;
- head;
- eyes;
- ears;
- arms;
- held cards;
- hats;
- cape;
- shadow;
- nearby small props.

But motion remains punctuation, not permanent fidgeting.

```text
Speech:
body lean + head nod + eye direction + tiny arm accent

Emphasis:
body bounce + ear/hat follow-through + card wobble + shadow bounce

Silence:
return to calm idle
```

---

# 2. Required Mental Models

Before implementing or editing motion, identify the applicable mental model.

## 2.1 Cause → anticipation → action → impact → follow-through → recovery

This is the default KFB choreography model.

```text
Cause
→ Anticipation
→ Main action
→ Contact / impact
→ Follow-through
→ Recovery
```

### Cause

The event that motivates motion.

```text
player input
physics collision
card reveal
speech emphasis
enemy sees player
die result
pet receives a compliment
character changes direction
```

### Anticipation

A small preparatory action that tells the viewer what will happen.

```text
jump:
body squashes down before launch

turn:
body leans against new direction before rotating

attack:
arm or weapon pulls back

card reveal:
card contracts, turns, or pauses before opening

speech emphasis:
head/body draws back slightly before the accent
```

Anticipation should usually oppose the main movement.

### Main action

The readable action.

```text
launch
turn
strike
walk
point
reveal
fall
enter
exit
```

### Impact

The precise moment where meaning changes.

```text
feet touch ground
weapon reaches target
card becomes visible
ball hits bumper
door slams
character sees a threat
```

### Follow-through

Loose or secondary parts continue after the main body stops.

```text
ear lags behind
cape swings
arm overshoots
card wiggles
hat bounces
dust continues
shadow settles
```

### Recovery

The action resolves and the scene becomes readable again.

```text
return to idle
clear VFX
release camera shake
remove temporary pose
remove temporary CSS class
restore save/restore state
```

No animation is complete until it has a defined recovery.

---

## 2.2 Timing and spacing are different

Richard Williams’ teaching places timing and spacing at the core of animation craft: timing is the duration of an action; spacing is the distribution of positions across that duration. His *Animator’s Survival Kit* covers timing, spacing, walks, runs, jumps, flexibility, weight, anticipation, takes, dialogue, acting, animal action, and directing. [530][537][538]

```text
Timing:
How long does the action take?

Spacing:
Where is the object at each moment?
```

Examples:

```text
Same timing, different spacing:
- even spacing = mechanical
- close at start, wider later = acceleration
- wide at start, closer later = deceleration
- held key pose + fast travel = comic snap
```

### Required rule

Do not claim “gravity”, “weight”, “bounce”, or “ease” unless spacing supports it.

```text
Falling:
positions get farther apart downward

Rising:
positions get closer together upward

Heavy landing:
fast descent
→ short hold / hitstop
→ compressed pose
→ slower recovery

Light landing:
small descent
→ tiny compression
→ immediate rebound
```

---

## 2.3 Staging is a motion requirement

Staging means an idea is presented clearly enough to be understood. It applies to action, personality, expression, mood, and the viewer’s eye direction. [536][535]

Before a motion starts, identify:

```text
focal actor
action point
protected areas
safe VFX areas
camera framing
background contrast
reading order
```

### Protected areas

These must not be covered by VFX, loud words, bubbles, unrelated particles, or decorative motion:

```text
character face / eyes
active card content
speech bubble text
important UI state
current combat contact point
key interaction target
narrative landmark
```

If no clear safe position exists for a word or effect:

```text
omit it
```

Do not place it over a face or card merely because a raw collision coordinate is available.

---

## 2.4 Secondary action supports, never competes

Secondary action enriches the main action but cannot compete with it.

```text
Primary:
Captain points at card

Secondary:
hat follows slightly late

Tertiary:
one small sparkle near the card
```

Not:

```text
Captain points
+ three stickers
+ ring
+ stars
+ particles
+ giant word
+ camera zoom
+ five SFX
```

The viewer must never need to solve the screen like a puzzle.

---

## 2.5 Overlap and follow-through

Different parts do not start and stop at the same instant. Follow-through is motion continuing after the primary body has stopped; overlapping action means different components moving at different rates. [478][482][536]

```text
Body stops first
→ arm settles second
→ held object settles third
→ cape / ear / tail settles last
```

For a KFB pet:

```text
body bounce: 0 ms
ears: +35 ms
eyes: +55 ms
card wobble: +70 ms
shadow settle: +85 ms
```

These offsets are starting points, not universal constants.

---

# 3. KFB Motion Families

Every motion must belong to a named family.

```ts
export type MotionFamily =
  | 'idle'
  | 'locomotion'
  | 'turn'
  | 'jump'
  | 'impact'
  | 'combat'
  | 'speech'
  | 'emotion'
  | 'card'
  | 'camera'
  | 'transition'
  | 'ambient'
  | 'vfx'
  | 'ui'
```

## 3.1 Idle

Idle is evidence that something is alive, not an invitation to wiggle.

```text
Allowed:
slow breath
tiny weight shift
occasional blink
subtle ear/cape lag
very slow eye drift

Forbidden:
permanent bounce
constant random rotation
continuous particle emissions
permanent camera drift
casino polish
```

## 3.2 Locomotion

Locomotion must state:

```text
direction
speed
weight
ground contact
intent
```

Required states:

```text
start
travel
stop
turn
recovery
```

Do not use a single perpetual walk transform for all of these.

## 3.3 Turn

`turn180` is not an instantaneous left/right sprite swap.

```text
old direction
→ brake / short settle
→ anticipation away from new direction
→ rotation or pose transition
→ new direction
→ follow-through
→ stable facing
```

Use motion streaks only when speed makes them meaningful.

## 3.4 Jump

`powerJump` is a complete event, not a vertical translation.

```text
squash
→ launch
→ stretch
→ airborne arc
→ landing preparation
→ impact
→ dust / burst
→ recovery
```

A jump must use an arc unless deliberately supernatural.

## 3.5 Speech

Speech uses body punctuation:

```text
baseline:
idle breathe

phrase:
small lean / head accent

emphasis:
one clear body bounce or point

end:
return to neutral
```

Speech is not a continuous shake.

## 3.6 Emotion

Initial speaker emotions are deliberately limited:

```ts
export type SpeakerEmotion =
  | 'neutral'
  | 'happy'
  | 'angry'
```

Implement these as distinct body languages:

```text
neutral:
calm weight, small motion, open posture

happy:
upward motion, open arms, light bounce, lifted gaze

angry:
compression, hard directional action, short sharp motion, narrowed posture
```

Do not create ten shallow emotion states before these three are visually distinct.

---

# 4. VFX Semantic Grammar

## 4.1 A VFX event is not a shape

A VFX event is a choreography with a meaning.

```ts
export type VfxSemanticClass =
  | 'movement'
  | 'contact'
  | 'impact'
  | 'charge'
  | 'target'
  | 'portal'
  | 'zone'
  | 'reveal'
  | 'speech'
  | 'emotion'
  | 'transition'
```

```ts
export type VfxEvent = {
  id: string
  semanticClass: VfxSemanticClass
  trigger: string
  anchor: 'head' | 'body' | 'feet' | 'contact' | 'card' | 'world' | 'camera'
  primary: VfxElement[]
  secondary?: VfxElement[]
  tertiary?: VfxElement[]
  audio?: AudioCue[]
  durationMs: number
  exclusiveGroup?: string
  priority: number
}
```

## 4.2 Movement VFX

Movement communicates trajectory and speed.

```text
Primary:
2–3 tapered action lines aligned with travel direction

Secondary:
short visual trail

Tertiary:
small filled dust shapes, only near ground if grounded
```

```text
No:
impact starburst
large ring
generic flash
readable impact word
```

Use an onomatopoeia only if the movement itself is the intended read, and then treat it as a distinct word-placement event, not automatic decoration.

## 4.3 Contact VFX

Contact communicates touch, landing, friction, or weight.

```text
Primary:
body/object reaction

Secondary:
small filled contact burst

Tertiary:
2–3 small filled dust puffs or fragments
```

```text
No:
large ring
giant word by default
multiple overlapping bursts
```

## 4.4 Impact VFX

Impact communicates a decisive collision, strike, or break.

```text
Primary:
one readable impact word OR one strong burst

Secondary:
squash / recoil / hitstop / small flash

Tertiary:
few fragments or filled dust shapes
```

```text
No:
motion trail
selection ring
multiple words
simultaneous unrelated emanata
```

Examples:

```text
TOCK
BONK
PLUMP
KRACH
BLÖDSINN!
```

## 4.5 Ring restriction

Rings are not generic impact effects.

Reserve rings/halos for:

```text
charge
targeting
portal
zone boundary
magic field
card activation
reveal field
```

A large ring at a landing reads as a selection marker, collider, portal, or UI state unless the event is explicitly a zone/charge event.

## 4.6 Dust rule

Dust is tertiary.

```text
dust:
small
filled
low opacity
brief
grounded
subordinate
```

Dust should suggest mass and contact, not demand to be read as a symbol.

Do not use giant outlined dust loops. They read as undefined geometry.

---

# 5. Global KFB Ink for Motion

## 5.1 Global language, contextual presets

All visible KFB comic marks belong to the KFB ink language:

```text
cards
terrain contours
characters
emanata
stars
bursts
rings
motion lines
speech bubbles
onomatopoeia
VFX circles
```

They must be:

```text
slightly irregular
alive
asymmetric
stable across frames
visually intentional
```

But global language does not mean one numeric preset everywhere.

```text
card preset
chip preset
terrain preset
character preset
bubble preset
emanata preset
vfx preset
```

Use the existing Ink SSOT and named presets. Do not invent a second random-jitter loop.

## 5.2 Stable seed rule

A contour must not re-randomize every rendered frame.

```text
shape seed is stable for the life of the event
```

Allowed:

```text
transform changes
scale changes
rotation changes
opacity changes
controlled path deformation
```

Forbidden:

```text
new random contour each frame
new random line width each frame
new random particle shape every update
```

Frame-to-frame random geometry reads as flicker, not hand-drawn life.

## 5.3 Imperfect but legible

A circle may be an irregular ring, but must still read as a circle.

A star may be uneven, but must still read as a burst.

A letter may wobble, but must remain readable.

```text
recognition first
irregularity second
```

---

# 6. Onomatopoeia and Comic Text FX

## 6.1 Two word families

```text
Movement words:
WUSCH
ZISCH
FLITZ
SWOOP

Impact words:
TOCK
BONK
PLUMPS
KRACH
BLÖDSINN!
```

### Movement word

```text
aligned with trajectory
slightly italic / stretched
placed in free space along or behind movement
paired with action lines
not paired with starburst
```

### Impact word

```text
placed near semantic contact
outside protected areas
bold / compact
paired with impact burst
not paired with large ring
```

## 6.2 One word at a time

```ts
const MAX_SIMULTANEOUS_SOUND_WORDS = 1
```

A new word removes, replaces, or waits for the previous word.

Do not render several word instances from one event chain.

## 6.3 Real font measurement

Never estimate word width from character count.

```text
Bad:
wordWidth = fontSize * characterCount * 0.62

Required:
render or measure actual text using the active font and weight
```

Use:

```ts
ctx.measureText(text)
```

or a mounted DOM/SVG text element with its real font loaded.

## 6.4 Transform separation

Position and animation scale/rotation must not fight on the same element.

```text
outer wrapper:
position / translate

inner wrapper:
scale / rotate / opacity animation
```

Example:

```html
<div class="word-position" style="transform: translate(220px, 140px)">
  <div class="word-motion">TOCK</div>
</div>
```

Do not use one `transform` declaration for both persistent placement and animated transform state.

## 6.5 Protected placement

```ts
export type ProtectedAreaReason =
  | 'face'
  | 'eyes'
  | 'card'
  | 'bubble'
  | 'ui'
  | 'action'
  | 'landmark'

export type ProtectedArea = {
  id: string
  rect: Rect
  reason: ProtectedAreaReason
  priority: number
}
```

For a word, evaluate candidates:

```text
right of impact
left of impact
above impact
below impact
along trajectory
opposite trajectory
```

Choose the first candidate that:

```text
does not overlap protected areas
does not leave viewport
does not collide with active word
preserves event meaning
```

If no candidate is valid:

```text
omit the word
```

## 6.6 Word duration

A word must be readable.

Starting point:

```text
pop-in: 80–140 ms
hold: 350–650 ms
exit: 160–260 ms
```

Do not make a word vanish at the same speed as a spark.

---

# 7. Audio FX Grammar

## 7.1 Audio is punctuation

Audio does not duplicate every visible effect.

```text
Audio answers:
What was the key event?
How hard / soft / absurd was it?
When did it happen?
```

## 7.2 One audio cue per essential event

```text
movement:
short whoosh, optional

contact:
dry thump, optional

impact:
one distinctive hit sound

reveal:
paper / card / chime accent

emotion:
rare cue, never constant
```

## 7.3 Audio hierarchy

```text
Primary:
one event-defining cue

Secondary:
optional short support

Tertiary:
usually silence
```

Do not stack ten audio assets because ten visual elements exist.

## 7.4 Silence is active

Use silence for:

```text
awkward pause
thought
suspicion
failed action
Schweigepunkte
pre-impact anticipation
post-punchline beat
```

---

# 8. 2D, 2.5D, and 3D Rules

## 8.1 2D Canvas / pixel sprites

```text
logical position = foot / ground-contact point
draw position = logical point - frame-specific anchor
sort = footY / layer, never sprite top edge
```

Do not derive position from changing transparent bounds.

For animated pixel sprites:

```text
clip state changes only when state changes
frame progression is delta-time based
frame rectangles are explicit
foot anchor is explicit per clip or per frame
```

## 8.2 SVG / 2.5D rigs

```text
character root
→ torso
→ head
→ upper arm
→ lower arm
→ hand / held prop
```

Animate joint pivots and group transforms.

```text
translate to joint
→ rotate
→ draw/attach child
```

Do not animate endpoint positions independently unless intentionally using IK.

Arms, legs, tails, ropes, tentacles, and flexible props must use a shared centerline or rig hierarchy. Do not fake them with two unrelated strokes.

## 8.3 3D game objects

For 3D characters, cards, and pets:

```text
game state owns position and semantic action
motion system owns visual offsets
physics owns physical facts
shader owns surface appearance
LLM owns wording only
```

Use additive visual offsets:

```ts
finalPosition =
  physicsPosition +
  gameplayPosition +
  visualBounceOffset +
  recoilOffset
```

Never let a VFX transform overwrite authoritative gameplay/physics position.

---

# 9. Camera Choreography

## 9.1 Camera is a reader’s eye

The camera does not move because something can move.

Every move must have a purpose:

```text
establish
follow
reveal
emphasize
hide
reframe
pause
release
```

## 9.2 Camera budgets

Per event, normally choose one:

```text
camera push
camera pan
camera shake
camera hold
```

Do not combine all four by default.

## 9.3 Shake

Camera shake belongs to strong impact, not every action.

```text
small hit:
no camera shake or 1–2 px visual nudge

medium impact:
small quick shake

large impact:
strong but short shake, followed by stillness
```

The camera must settle before the next important read.

---

# 10. Motion Preset Contract

Every reusable motion must declare its semantics.

```ts
export type MotionPreset = {
  id: string
  family: MotionFamily
  meaning: string
  durationMs: number
  loop: boolean
  phases: MotionPhase[]
  requiredAnchors?: string[]
  protectedAreas?: ProtectedAreaReason[]
  eventBudget: EventBudget
  recovery: RecoverySpec
}
```

```ts
export type MotionPhase =
  | 'anticipation'
  | 'action'
  | 'impact'
  | 'followThrough'
  | 'recovery'

export type EventBudget = {
  maxPrimaryVfx: number
  maxSecondaryVfx: number
  maxTertiaryVfx: number
  maxSoundWords: number
  maxAudioCues: number
  maxCameraActions: number
}

export type RecoverySpec = {
  restorePose: boolean
  restoreTransform: boolean
  clearVfx: boolean
  clearAudioState: boolean
  withinMs: number
}
```

Example:

```ts
export const POWER_JUMP: MotionPreset = {
  id: 'powerJump',
  family: 'jump',
  meaning: 'A strong intentional launch and weighted landing.',
  durationMs: 860,
  loop: false,
  requiredAnchors: ['feet', 'body', 'shadow'],
  protectedAreas: ['face', 'card', 'bubble'],
  eventBudget: {
    maxPrimaryVfx: 1,
    maxSecondaryVfx: 2,
    maxTertiaryVfx: 3,
    maxSoundWords: 1,
    maxAudioCues: 2,
    maxCameraActions: 1
  },
  phases: [
    'anticipation',
    'action',
    'impact',
    'followThrough',
    'recovery'
  ],
  recovery: {
    restorePose: true,
    restoreTransform: true,
    clearVfx: true,
    clearAudioState: true,
    withinMs: 320
  }
}
```

---

# 11. Required Presets

## 11.1 `powerJump`

```text
0–120 ms:
squash down
shadow widens
no word

120–310 ms:
launch upward
body stretches
one or two motion lines only if speed is legible

310–560 ms:
arc / airborne
secondary parts trail behind

560–680 ms:
landing preparation
shadow tightens

680 ms:
feet contact
short hitstop
small filled burst at feet
2–3 dust puffs
optional impact word in free space

680–860 ms:
compression
follow-through
return toward idle
```

## 11.2 `turn180`

```text
0–90 ms:
brake and small old-direction settle

90–160 ms:
anticipation away from new direction

160–280 ms:
turn / flip / rotation transition

280–430 ms:
accessory and limb follow-through

430–560 ms:
stable new facing
```

No action lines unless travel speed justifies them.

## 11.3 `celebrate`

```text
0–100 ms:
anticipation compression

100–260 ms:
upward bounce
arms open

260–420 ms:
one main expressive accent:
star OR heart OR coin burst OR card lift
not all at once

420–700 ms:
landing / pose hold

700–980 ms:
small settle
return idle
```

## 11.4 `impact`

```text
0–40 ms:
contact registered

40–95 ms:
hitstop / body reaction

60–220 ms:
small burst

90–620 ms:
optional one sound word, placed safely

160–360 ms:
2–3 tertiary debris elements

360–620 ms:
clear secondary elements

620–850 ms:
recovery
```

---

# 12. Debug and Evidence Requirements

## 12.1 No claim without evidence

Before declaring a motion or VFX “fixed”, provide:

```text
1. fixed-camera screenshot before
2. fixed-camera screenshot after
3. short playback proof
4. measured duration / frame timing
5. visible anchors
6. stated semantic class
7. stated primary / secondary / tertiary hierarchy
8. recovery confirmation
```

A screenshot that shows a problem overrides a pleasing internal metric.

## 12.2 Required motion debug overlay

```text
feet / body / head anchors
action point
impact point
protected areas
VFX placement candidates
selected candidate
current phase
timeline cursor
current motion preset
active clip / frame
active VFX count
active sound-word count
audio cue offset
camera action
```

## 12.3 Fixed fixtures

Every system must have repeatable fixtures.

```text
jump fixture
turn fixture
landing fixture
light hit fixture
heavy hit fixture
card reveal fixture
speech emphasis fixture
happy fixture
angry fixture
neutral fixture
```

Each fixture has:

```ts
export type MotionFixture = {
  id: string
  seed: string
  camera: CameraState
  actorState: Record<string, unknown>
  trigger: string
  expectedPrimaryRead: string
  expectedDurationMs: number
  forbiddenOverlaps: ProtectedAreaReason[]
}
```

---

# 13. Repair Protocol

When motion is wrong, do not make cosmetic adjustments indefinitely.

## 13.1 Diagnose in this order

```text
1. What is the semantic event?
2. Which motion family owns it?
3. What is the primary read?
4. Is the anchor correct?
5. Is the timing correct?
6. Is spacing correct?
7. Are protected areas respected?
8. Are VFX layers over budget?
9. Is the contour stable?
10. Does recovery happen?
```

## 13.2 Common failures

| Symptom | Likely cause | Correct repair |
|---|---|---|
| Pet appears to float | wrong foot anchor or shadow anchor | calibrate per clip/frame; anchor at ground contact |
| Sprite flickers | clip reset, random contour, transform conflict | preserve clip state; stable seed; split transform wrappers |
| Turn feels like teleport | no anticipation/follow-through | add brake, turn phase, settle |
| Jump feels weightless | linear spacing/no squat | use squash, acceleration, arc, landing compression |
| Impact unreadable | no primary hierarchy | choose burst or word; remove competing FX |
| Word covers face | raw collision point used directly | evaluate safe placement candidates |
| Ring reads as bug/UI | ring used for impact | reserve ring for zone/portal/charge/target |
| Dust looks like symbols | outlined/large dust | use small filled tertiary puffs |
| Scene feels noisy | too many equal FX | enforce event budget and hierarchy |
| Animation never rests | no recovery state | explicit return to idle and clear transforms |
| Same effect everywhere | no semantic classes | use motion/VFX recipes per event type |
| “Hand-drawn” flicker | random geometry every frame | seed contour once; animate transform only |

---

# 14. Hard Prohibitions

Do not:

- add an effect merely because an event occurred;
- put readable words on faces, cards, bubbles, or central UI;
- use a generic ring for impact;
- use several impact words at once;
- use one global random jitter mechanism for all visual elements;
- restart animation clips every render frame;
- overwrite gameplay or physics transforms with visual transforms;
- add camera shake to minor events by default;
- add glow, blur, bloom, particles, shake, words, and sound simultaneously;
- claim “cartoon” as a substitute for timing and staging;
- call random motion “alive”;
- call a system done without fixed-fixture screenshots and playback proof;
- build a second card gallery while working on motion;
- expand scope before one choreography is visibly correct.

---

# 15. Required Implementation Order

For a new KFB motion/VFX system:

```text
1. Read project SSOTs and existing measured decisions.
2. Identify actor, event, semantic class, and protected areas.
3. Define one fixture.
4. Create no more than one primary, two secondary, and three tertiary elements.
5. Implement visual choreography without extra features.
6. Add audio only after visual read is clear.
7. Add camera only if it strengthens the primary read.
8. Verify recovery and cleanup.
9. Capture fixed-camera screenshots and playback.
10. Add a changelog entry with measurements and known limits.
```

---

# 16. Final Quality Gate

A motion/VFX slice passes only if all answers are “yes”:

```text
[ ] Can a viewer identify what happened in one glance?
[ ] Is there one clear primary read?
[ ] Is every secondary/tertiary element subordinate?
[ ] Does the movement have a cause?
[ ] Does it have anticipation where needed?
[ ] Does timing and spacing support the intended weight?
[ ] Does it have impact/contact where appropriate?
[ ] Does it have follow-through where appropriate?
[ ] Does it return to rest cleanly?
[ ] Are face, card, bubble, UI, and key action areas protected?
[ ] Are words actually measured with the final font?
[ ] Are position and animated transforms on separate layers?
[ ] Is contour variation stable and seeded?
[ ] Is audio punctuating rather than duplicating?
[ ] Is the camera quiet unless it has a reason to move?
[ ] Is the effect tested in fixed fixtures?
[ ] Are screenshots and playback evidence attached?
[ ] Was unrelated scope avoided?
```

---

# 17. Canonical Summary

```text
Motion is meaning in time.

Physics gives facts.
Game state gives consequences.
The semantic layer gives interpretation.
Animation stages the interpretation.
VFX directs attention.
Audio punctuates the moment.
The camera guides the eye.
The LLM may phrase an artifact.
Nothing may obscure the actual event.
```

```text
One event
→ one primary read
→ controlled secondary support
→ quiet tertiary detail
→ recovery
```

> KFB motion is not decorative activity.  
> It is a comic argument performed by bodies, cards, terrain, sound, ink, and time.
