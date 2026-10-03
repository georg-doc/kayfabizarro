---
name: kfb-cartoon-brawl
version: 1.0
status: canonical-draft
scope: 3D melee combat · weapon choreography · hit validation · reactions · VFX/SFX sync · crowd brawls
primary-language: English for implementation, German accepted for direction
owner: Georg / KFB
depends-on:
  - skills/kfb-cartoon-animation_v2.md
  - current project/runtime SSOT
  - current actor / rig / weapon attachment manifests
research:
  - skills/chat/workflows/KFB_CARTOON_BRAWL_SKILL_2026-10-03/RESEARCH_SOURCE_MATRIX.md
  - skills/chat/workflows/KFB_CARTOON_BRAWL_SKILL_2026-10-03/RESEARCH_BLOCK_B_WEAPON_TRANSITIONS.md
---

# KFB Cartoon Brawl
## Melee Architecture, Weapon Choreography, Contact and Cartoon Impact Skill

## 0 · Purpose

This skill governs how KFB projects design, implement, ingest, review and debug melee combat.

It covers:

- unarmed strikes;
- swords and blades;
- clubs, bats and maces;
- shield + one-hand weapon;
- two-hand weapons;
- staffs and polearms;
- improvised KFB props such as Pencil, Brush or Brickfish;
- player vs NPC;
- NPC vs player;
- NPC vs NPC;
- all-vs-all cartoon brawls;
- ordinary systemic attacks;
- paired takedowns / grapples / finishers;
- hit reactions;
- animation-synchronized VFX/SFX/camera;
- Mixamo / KayKit / mocap / animation-library intake;
- debugging and visual acceptance.

This skill **specializes** `skills/kfb-cartoon-animation_v2.md`.

It does not replace:

- the consumer game's movement owner;
- physics;
- health/damage rules;
- target-selection owner;
- actor/rig owner;
- attachment/Resident Atlas owner;
- the general KFB motion/VFX canon.

---

# 1 · Prime Directive

> **An attack is a timed spatial contract, not an animation clip.**

A clip is only one ingredient.

A complete melee attack must answer:

```text
Who may start it?
From what distance and facing?
Which weapon / limb is authoritative?
How is the weapon attached?
How does the actor move during it?
When may tracking / turning happen?
When may contact be sensed?
What geometry senses contact?
Which targets may be consumed?
What happens on confirmed hit?
What happens on miss?
Which reactions / VFX / SFX / camera cues fire?
When may input branch or cancel?
How does the actor recover?
```

If those answers are not explicit, the move is not production-ready.

---

# 2 · Ownership Model

Keep these responsibilities separate.

```text
runtime / gameplay state
  owns eligibility, target policy, consequences and authoritative action state

movement / physics owner
  owns physical displacement and collision facts

animation system
  owns pose, clip timing, blends, authored root motion and visual choreography

weapon / attachment profile
  owns canonical weapon basis, grip geometry and promoted attachment transforms

contact system
  owns hit sensing / sweep queries / per-attack consumption

reaction system
  owns target response class and attacker response where applicable

VFX / SFX / camera
  consume semantic swing/contact/reaction events

LLM / implementation agent
  composes against these owners
  does not invent a second owner
```

### Hard boundary

Do not fix a bad source attachment by hiding it inside one consumer attack.

Example:

```text
bad shield mount
→ fix in attachment/Atlas owner
→ prove neutral + guard pose
→ promote measured transform
→ Combat consumes it
```

Not:

```text
bad shield mount
→ rotate shield differently inside every combat clip
```

---

# 3 · Core Attack Lifecycle

Default lifecycle:

```text
INTENT
→ ELIGIBILITY
→ STARTUP
→ optional TRACK / ALIGN
→ ACTIVE CONTACT
→ CONFIRMED HIT or MISS
→ FOLLOW-THROUGH
→ RECOVERY
→ NEUTRAL / NEXT ACTION
```

This extends the general KFB motion model:

`cause → anticipation → action → impact → follow-through → recovery`.

## 3.1 Intent

Source may be:

- player input;
- AI decision;
- scripted beat;
- counter/parry result;
- paired interaction trigger;
- environmental opportunity.

Intent is semantic:

```text
attack_primary
attack_secondary
guard
parry_or_deflect
dodge
special
interact_environment
```

It is not:

```text
play Animation_037
play Melee_1H_Attack_Chop
```

## 3.2 Eligibility

Check before committing:

- attack state;
- weapon profile;
- target validity;
- range;
- facing tolerance;
- line / path requirements;
- ground/air state;
- cooldown/resource if the consumer uses them;
- crowd ticket / reservation;
- paired-interaction availability.

## 3.3 Startup

Startup communicates intent and sets the attack geometry.

For player-controlled attacks:

- acknowledge input immediately with a readable pose/change;
- anticipation must not create accidental input lag;
- animation may still have anticipation, but responsiveness wins.

For enemy attacks:

- readable tell may be longer;
- silhouette/direction must make the threat legible;
- tracking normally closes before the decisive contact pose.

## 3.4 Track / align

Optional and bounded.

Use for:

- small facing correction;
- target approach;
- root-motion warp;
- paired-interaction pre-alignment.

Never let target attraction run invisibly through the whole swing.

## 3.5 Active contact

Only declared active windows may create attack contact.

Active window can contain several samples or sub-windows.

## 3.6 Confirmed hit

A timeline marker can say:

> "the weapon is now allowed to hit."

Only contact validation can say:

> "this attack hit this target here."

Confirmed contact drives consequences.

## 3.7 Follow-through and recovery

Hit or miss must resolve.

Recovery defines:

- remaining pose;
- movement authority;
- allowed cancels;
- return to guard/idle;
- combo continuation;
- cleanup of IK/trails/VFX;
- attack-ledger disposal.

---

# 4 · Core Data Contracts

Use equivalent structures even when an engine expresses them differently.

## 4.1 `MeleeAttackSpec`

```ts
type MeleeAttackSpec = {
  id: string
  weaponProfileId: string

  animation: {
    semantic: string
    clipRef: string
    sourceRig: string
    retargetProfile?: string
  }

  intent:
    | 'light'
    | 'heavy'
    | 'launcher'
    | 'sweep'
    | 'stab'
    | 'guard_break'
    | 'counter'
    | 'special'

  entry: {
    minRange: number
    maxRange: number
    facingToleranceDeg: number
    lineOfMotion?: string
    grounded?: boolean
  }

  timeline: {
    startup: Window
    tracking?: Window
    warp?: Window
    active: Window[]
    followThrough: Window
    recovery: Window
    buffers?: InputWindow[]
    branches?: BranchWindow[]
    cancels?: CancelWindow[]
  }

  movement: {
    mode:
      | 'in_place'
      | 'controller_driven'
      | 'root_motion'
      | 'bounded_motion_warp'
    turnPolicy: string
  }

  hitPolicy: {
    contactGeometryId: string
    perTarget: 'once_per_swing' | 'multi_hit' | 'persistent'
    maxTargets?: number
    friendlyFire?: boolean
  }

  reactionClass: string
  impactProfile: string
}
```

## 4.2 `WeaponProfile`

```ts
type WeaponProfile = {
  id: string

  handedness:
    | 'unarmed'
    | '1h'
    | '2h'
    | 'shield_1h'
    | 'polearm'
    | 'improvised'

  primaryHand?: 'left' | 'right'
  gripSocket?: string

  canonicalForwardAxis?: Axis
  canonicalUpAxis?: Axis

  primaryGrip?: Transform
  secondaryGrip?: Transform

  contactKind:
    | 'limb'
    | 'edge_segment'
    | 'head_volume'
    | 'shaft_segment'
    | 'soft_volume'

  contactAnchors: string[]

  allowedOwnerContactZones: string[]
  forbiddenOwnerZones: string[]

  attackFamilies: string[]
  presentationProfile: string
}
```

## 4.3 `AttackInstance`

Every committed attack gets a unique instance.

```ts
type AttackInstance = {
  id: string
  specId: string
  attackerId: string
  startedAt: number
  phase: 'startup' | 'active' | 'followThrough' | 'recovery'
  consumedTargets: Set<string>
}
```

This prevents a weapon overlapping one target for several frames from accidentally applying the same single-hit attack repeatedly.

---

# 5 · Donor Admission Rule

A loaded asset URL is not proof that the donor design was used correctly.

Before integrating a new actor, weapon or motion:

```text
1. Show the source object / clip in isolation.
2. Identify exact file, rig, clip and authored anchors.
3. Verify source coordinate system and scale.
4. Verify target owner / consumer contract.
5. Then integrate.
```

Never replace a verified donor with a generic approximation merely because the approximation loads more easily.

---

# 6 · Canonical Weapon Basis and Grip

Every weapon needs a stable local frame.

Record:

- length/forward axis;
- up or face normal where meaningful;
- grip origin;
- primary grip rotation;
- optional secondary grip;
- blade base/tip or impact head;
- shaft endpoints if relevant;
- visual root;
- scale;
- source hand slot / socket.

## 6.1 Correct repair order

If a sword points through the attacker:

```text
weapon source
→ canonical basis
→ socket / grip transform
→ neutral-pose proof
→ retarget pose
→ hand / off-hand IK
→ attack clip
→ attack-specific polish
```

Do not start with a per-clip wrist rotation.

## 6.2 Neutral grip proof

Before attack animation:

- show actor in neutral/reference pose;
- show weapon mounted;
- show front;
- show profile;
- show 3/4;
- show hand close-up if necessary;
- show local weapon axes / grip anchor;
- confirm no blocking torso/head penetration.

If the neutral mount is wrong, stop attack choreography and fix the attachment owner.

---

# 7 · Two-Hand and Off-Hand Rule

For a typical 2H weapon:

```text
primary hand
  owns the weapon attachment

weapon secondaryGrip
  owns the target transform for the off-hand

off-hand IK
  reaches secondaryGrip
```

Do not hard-parent one weapon independently to two animated hands.

Use:

- Two Bone IK;
- Full Body IK;
- equivalent arm solver;
- pole/hint target;
- twist correction/limits where available.

The same principle applies to a staff or long improvised prop.

---

# 8 · Self-Clearance Contract

Weapon self-intersection is a first-class diagnostic.

## 8.1 Owner protection zones

At minimum:

```text
head
upper torso
pelvis
upper legs
non-grip arm
non-grip hand
```

Optional:

- ears/horns;
- cape;
- backpack;
- large accessories;
- face-protection volume stricter than general torso.

## 8.2 Allowed contact zones

Examples:

```text
primary grip hand
secondary grip hand
forearm touching shield straps
deliberately braced staff contact
```

## 8.3 Sample the full clip

Do not test only idle and impact frame.

```text
startup
→ active
→ follow-through
→ recovery
```

Sample weapon bounds / contact anchors against owner zones.

Classify:

```text
CLEAR
TOUCH_ALLOWED
VISUAL_NEAR_MISS
PENETRATION_MINOR
PENETRATION_BLOCKING
```

`PENETRATION_BLOCKING` fails the move.

## 8.4 Important distinction

Contact geometry may be smaller/simpler than the visible prop.

The visible prop must still pass visual self-clearance.

---

# 9 · Weapon Archetypes

One core architecture; different profiles.

## 9.1 Unarmed

Active geometry:

- fist;
- elbow;
- foot;
- knee;
- other explicitly declared limb.

Never use the whole body collider as the attack.

## 9.2 1H blade

Recommended anchors:

```text
grip
bladeBase
bladeTip
optional edgeNormal
```

Slash:

- swept segment/base-to-tip;
- readable arc;
- body clearance.

Stab:

- tip-focused contact;
- forward orientation;
- smaller lateral tolerance.

## 9.3 1H blunt / club / mace

Recommended anchors:

```text
grip
optional shaftBase
impactHead
```

The impact-head volume is normally more important than edge orientation.

## 9.4 Shield + 1H

The shield is not a decoration.

Define:

- shield mount;
- outside/guard direction;
- guard plane;
- block volume if gameplay needs it;
- forearm/body clearance;
- attack-hand occupancy.

The shield hand cannot simultaneously act as a second weapon grip unless the move explicitly releases/reparents the shield.

## 9.5 2H weapon

Define:

- primary grip;
- secondary grip;
- long contact region;
- larger owner-clearance budget;
- torso/root participation.

## 9.6 Polearm / staff

A polearm may have several possible contact zones:

- tip;
- head;
- shaft;
- butt.

The **attack spec** chooses which are active.

Do not make the whole pole damaging during every move.

## 9.7 Improvised / soft prop

Examples:

- Brickfish;
- Pencil;
- Brush;
- rolled newspaper;
- absurd oversized object.

Use simple deterministic contact geometry and a richer visual layer.

```text
contact:
stable capsule / segment / impact lobe

visual:
bend / squash / wobble / smear / tail follow-through
```

Do not couple every visual deformation vertex to gameplay damage geometry.

---

# 10 · Animation Library Intake

Mixamo, KayKit, mocap and purchased motion packs are donors.

They are not automatically production-ready.

## 10.1 Intake audit

For every candidate:

```text
[ ] exact source clip isolated
[ ] semantic family identified
[ ] source rig identified
[ ] reference / neutral pose known
[ ] root / hips orientation understood
[ ] target rig exact
[ ] retarget profile applied
[ ] shoulder / elbow / wrist inspected
[ ] twist inspected
[ ] foot/root slide inspected
[ ] weapon mounted from canonical profile
[ ] self-clearance sampled
[ ] target spacing fixture run
[ ] active window measured
[ ] start/end pose compatibility classified
[ ] recovery proven
```

## 10.2 Retargeting rule

Retargeting solves skeleton/proportion mapping.

It does not prove:

- correct weapon grip;
- correct blade orientation;
- body clearance;
- target contact;
- combo compatibility.

## 10.3 Keyframe / mocap rule

Use the representation that serves gameplay.

A useful production pattern from shipped martial-arts games is:

- real expert performance as movement/reference;
- hand-keyframing where timing/readability/gameplay constraints need precise control;
- mocap for complex paired/takedown interactions when two bodies must coordinate.

Never treat raw mocap as final merely because it is "real".

---

# 11 · Hit Geometry

Keep these concepts separate:

```text
PUSH / BODY VOLUME
  prevents impossible body overlap

HURT VOLUME
  says where an actor may receive a combat hit

ATTACK / CONTACT VOLUME
  says where this attack may connect

GUARD / THROW VOLUME
  optional specialized semantics

OWNER-CLEARANCE VOLUME
  diagnostic protection against self-intersection
```

They may share source bones but not meaning.

---

# 12 · Swept Contact

Fast melee motion can tunnel between discrete samples.

Default KFB rule:

> Sweep the attack geometry from its previous transform to its current transform during the active window.

Examples:

- blade: swept base-tip segment/capsule;
- mace: swept impact-head sphere/capsule;
- fist: swept fist sphere;
- staff: swept declared shaft/tip segment;
- Brickfish: swept impact-lobe capsule.

## 12.1 Per-swing ledger

Default:

```text
once_per_swing
```

On first valid hit:

```text
targetId → consumed
```

Ignore repeated samples against that target for the same attack instance.

Exceptions must be explicit:

```text
multi_hit
persistent
ricochet
damage_over_time
```

---

# 13 · Timeline Ownership

Animation time may schedule opportunities.

It must not own all combat truth.

## 13.1 Animation-timed events

Suitable:

- trail on/off;
- air whoosh;
- foot plant;
- contact sensing on/off;
- tracking on/off;
- motion-warp window;
- buffer/branch/cancel window;
- authored pose marker.

## 13.2 Confirmed-contact events

Normally require collision validation:

- damage;
- target hit reaction;
- blood/ink/spark impact;
- hit sound;
- hitstop;
- impact camera accent;
- weapon recoil class.

Hard rule:

> A miss must remain a miss even when the animation reaches its "impact" marker.

---

# 14 · Input, Buffering, Branching and Cancels

## 14.1 Device-independent combat intent

Map controller, keyboard/mouse or touch to semantic intents.

```ts
type CombatIntent =
  | 'attack_primary'
  | 'attack_secondary'
  | 'guard'
  | 'parry_or_deflect'
  | 'dodge'
  | 'target_switch'
  | 'interact_environment'
  | 'special'
```

Never bind a physical button directly to an asset filename.

## 14.2 Input buffer

Stores a bounded future intent.

Use it so a slightly early button press can become a legal follow-up once the branch window opens.

The buffer:

- has an expiration;
- may be replaced by newer higher-priority intent if the design allows;
- clears on invalidating states such as death/stun where appropriate.

## 14.3 Branch window

Selects a follow-up.

It does not have to interrupt the current animation immediately.

## 14.4 Cancel window

Explicitly declares interruption rights.

Separate:

- offensive cancel;
- dodge cancel;
- block/parry cancel;
- hit-confirm cancel;
- whiff cancel if allowed.

Do not make every animation freely cancelable merely to hide weak transitions.

## 14.5 Transition edge

Every combo edge declares:

```text
source state/pose tag
input/AI condition
timing window
transition type
destination state/pose tag
fallback recovery
```

---

# 15 · Transition Quality

A combo is a graph, not a list of clips.

## 15.1 Bad transition

```text
clip A
→ generic 300 ms crossfade
→ clip B
```

without checking:

- hand path;
- weapon path;
- feet;
- hips;
- contact state;
- active-window overlap.

## 15.2 Good transition

Use one or more:

- pose-compatible clip endpoints;
- authored bridge;
- short controlled blend;
- inertialization/dead-blend equivalent;
- synchronized phase when appropriate;
- explicit root/turn correction before contact.

## 15.3 Transition failure test

Scrub the blend and ask:

```text
Does the weapon pass through the owner?
Does a hand teleport?
Does the off-hand detach?
Do feet reverse/slip?
Does attack contact become active during an unreadable in-between pose?
Does the body rotate after the weapon has apparently committed?
```

If yes, the transition fails even if playback never crashes.

---

# 16 · Root Motion and Motion Warping

Choose one movement authority per attack.

## 16.1 In-place

Good when:

- controller movement remains authoritative;
- attacks need high steering freedom;
- runtime already owns displacement strongly.

## 16.2 Root motion

Good when:

- authored displacement is the move;
- lunge/step distance matters;
- paired choreography needs a defined path.

It must integrate with the consumer's movement/physics owner rather than overwrite it.

## 16.3 Bounded motion warping

Good when:

- source animation has useful motion;
- exact target distance varies slightly;
- a short approach/alignment correction is needed.

Declare:

- window;
- translation axes;
- rotation policy;
- target;
- maximum acceptable correction.

Do not use unlimited warping to rescue fundamentally wrong spacing.

---

# 17 · Targeting and Spatial Choreography

An attack normally checks:

```text
range
facing
line of motion
path / obstruction if relevant
target state
crowd reservation
```

## 17.1 Soft target

For free-flow cartoon combat:

- directional input/camera chooses likely target;
- resolver may select nearest valid target in that cone;
- actor may make bounded pre-contact facing correction.

## 17.2 Hard lock

Useful for:

- duel;
- boss;
- precise shield/parry game;
- camera-centered confrontation.

Do not assume all KFB brawls need permanent hard lock.

## 17.3 Body spacing

Characters should not solve weapon reach by walking their torsos into each other.

Separate:

- body/push spacing;
- weapon reach;
- active hit geometry.

KFB Combat Arena's non-overlap spacing diagnostic is a direct donor for this rule.

---

# 18 · Ordinary Hits vs Paired Choreography

## 18.1 Ordinary systemic hit

Default for scalable combat:

```text
attacker animation
+
independent target reaction
+
validated contact
```

Benefits:

- works across more body types;
- less content explosion;
- better for crowds;
- easier to interrupt.

## 18.2 Paired animation

Reserve for:

- takedown;
- throw;
- grapple;
- struggle;
- finisher;
- exact environmental beat;
- comic interaction whose point is exact body-to-body choreography.

Contract:

```ts
type PairedInteraction = {
  attackerClip: string
  defenderClip: string
  relativeRootTransform: Transform
  entryTolerance: TransformTolerance
  alignmentWindow: Window
  reservation: 'exclusive_pair'
  breakConditions: string[]
  exits: string[]
}
```

Pre-align before the exact choreographed portion.

Do not drag both actors continuously toward each other while the paired move plays.

---

# 19 · Crowd Brawl Scheduler

All-vs-all is not "everyone attack whenever possible."

Use local roles/tickets.

```text
PRIMARY_ATTACKER
SECONDARY_PRESSURE
CIRCLE_OR_REPOSITION
RECOVER
PAIR_RESERVED
ENVIRONMENT_INTERACT
```

## 19.1 Per-victim pressure budget

Limit how many actors may be in committed active offense against one victim simultaneously.

Pressure can still come from:

- approach;
- feint;
- guard;
- flank;
- environmental movement;
- near threat;
- vocal/body anticipation.

## 19.2 Pair reservation

A takedown/grapple reserves both participants.

Other actors must route around or wait unless the design explicitly allows interruption.

## 19.3 NPC vs NPC

Each actor has:

- current primary opponent;
- local threat score;
- attack eligibility;
- scheduler token;
- safe retarget points.

Do not switch target halfway through a committed swing unless the attack explicitly supports tracking/retargeting.

---

# 20 · Fight Choreography Grammar

Gameplay fight choreography must remain readable from the gameplay camera.

For every attack, design:

```text
intent
→ line of action
→ anticipation/read
→ acceleration
→ contact pose
→ reaction
→ follow-through
→ recovery
```

## 20.1 Silhouette

At key moments, the body + weapon should read in one glance:

- attack direction;
- weapon class;
- threat;
- target relation.

Avoid poses where weapon, forearm and torso collapse into one unreadable mass.

## 20.2 Arc

A swing needs a coherent path.

Debug it as a trail/path even if the final game uses no trail.

## 20.3 Rhythm

Do not make every attack:

```text
same startup
same velocity
same impact pause
same recovery
```

Use contrast:

- quick / slow;
- narrow / wide;
- light / heavy;
- hold / burst;
- single / flurry;
- advance / retreat.

Variation must remain learnable.

## 20.4 Realism vs stylization

Research real movement so the stylization has a physical basis.

Then exaggerate deliberately:

- clearer anticipation;
- stronger silhouette;
- larger arc;
- faster contact;
- bigger reaction;
- more readable follow-through.

Cartoon exaggeration is allowed.

Spatial causality is not optional.

---

# 21 · Cartoon Impact

KFB brawls may be absurd.

They must still read.

## 21.1 Contact stack

Default hierarchy:

```text
PRIMARY
  body/weapon contact + target reaction

SECONDARY
  one impact burst / short hitstop / one strong sound

TERTIARY
  small debris / dust / smear / accessory follow-through
```

This inherits the event-budget logic from `kfb-cartoon-animation_v2.md`.

## 21.2 Hitstop

Use only on confirmed contact.

Purpose:

- emphasize connection;
- add perceived resistance;
- give the contact pose time to read.

Hitstop must not:

- cause a second hit;
- move collision geometry independently;
- leave AI/physics/gameplay owners in inconsistent states.

Different impact classes may use different hitstop strengths.

## 21.3 Reaction

Target reaction should encode:

- impact direction;
- strength class;
- target state;
- grounded/airborne state;
- interruption rules.

Possible classes:

```text
flinch
recoil
stagger
knockback
launch
spin
fall
guard_reaction
parry_reaction
comic_squash
```

Overreaction may be more readable than realism, especially for KFB.

---

# 22 · VFX Sync

## 22.1 Swing VFX

Can be animation-timed:

- trail;
- smear;
- motion line;
- pre-contact spark from weapon magic;
- dust from footwork.

## 22.2 Hit VFX

Normally confirmed-contact driven:

- impact burst;
- ink;
- stars;
- chips;
- sparks;
- blood if a project uses it;
- Brickfish squash flash.

Anchor hit VFX to the actual semantic contact point.

## 22.3 Trail rule

Trail proves path visually.

It does not define damage by itself.

Trail on/off markers should roughly bracket meaningful weapon speed, not entire idle/recovery.

## 22.4 Miss rule

A whiff may have:

- air whoosh;
- trail;
- dust.

It must not have:

- target impact burst;
- target hit sound;
- target hit reaction;
- hitstop,

unless some other confirmed contact occurred.

---

# 23 · SFX Sync

Audio is part of impact, not a substitute for it.

Separate:

```text
swing sound
confirmed impact sound
target material accent
weapon material accent
reaction vocalization
environment impact
```

## 23.1 Swing

Animation-timed.

## 23.2 Impact

Confirmed-contact timed.

Use semantic classes such as:

```text
light_blunt
heavy_blunt
blade_slice
blade_stab
shield_block
parry
staff_hit
brickfish_bonk
environment_crash
```

Do not stack every available layer at equal volume.

---

# 24 · Camera

Camera exists to preserve the fight read.

For melee:

- keep attacker/target relation visible;
- preserve nearby threats in crowd combat;
- reduce camera motion when awareness matters;
- use accent shake only for strong confirmed impacts;
- settle before the next important read.

A strong hit can be sold more through:

- animation;
- reaction;
- audio;
- hitstop

than through violent camera shake.

---

# 25 · Environment Interaction

For cartoon brawls, environment is useful because it creates variation without requiring a new core combat engine.

Examples:

- push enemy into another enemy;
- wall rebound;
- table vault;
- prop pickup;
- ledge takedown;
- breakable barrel;
- door slam;
- chair / fish / pencil pickup.

Environment action still uses:

```text
eligibility
→ reservation
→ alignment
→ active contact
→ reaction
→ recovery
```

Special paired animation is optional, not mandatory.

---

# 26 · Debug Overlay

Every serious melee lab should be able to show:

```text
current attack spec
attack instance id
current phase
timeline cursor

actor root
facing vector
target vector
target distance

weapon canonical axes
primary grip
secondary grip
weapon contact anchors

owner protection volumes
push/body volumes
hurt volumes
attack swept volumes

tracking window
warp window
active window
buffer window
branch window
cancel window

confirmed contact point
contact normal if used
consumed target ledger

root-motion delta
motion-warp target / correction

active reaction class
VFX/SFX cue timestamps
hitstop state
crowd ticket / reservation
```

---

# 27 · Required Fixtures

At minimum:

## 27.1 Attachment fixture

```text
neutral pose
front / side / 3/4
weapon axes
grip close-up
```

## 27.2 Self-clearance fixture

```text
full attack at 1×
full attack at 0.25×
scrub
owner-protection overlay
minimum-clearance / penetration intervals
```

## 27.3 Spacing fixture

Attacker and target begin outside body overlap.

Prove:

- weapon can reach;
- bodies remain spatially plausible;
- no hidden target suction.

## 27.4 Forced-contact fixture

Place target intentionally inside valid contact path.

Prove:

- contact registers;
- per-swing ledger consumes target;
- confirmed-hit feedback fires once.

## 27.5 Miss fixture

Place target outside contact path.

Prove:

- no damage;
- no hit reaction;
- no hit VFX/SFX/hitstop.

## 27.6 Combo fixture

Prove:

- early buffered input;
- valid branch;
- invalid branch;
- defensive cancel;
- recovery fallback;
- weapon does not cross owner during blends.

## 27.7 Crowd fixture

At least:

- one attacker;
- three opponents;
- all-vs-all if consumer needs it.

Show ticket/role scheduling.

## 27.8 Paired fixture

If paired interactions exist:

- relative roots;
- pre-alignment;
- reservation;
- exact contact;
- exit;
- interruption cleanup.

---

# 28 · Motion-Library Candidate Scorecard

Do not rate clips aesthetically only.

Use PASS / FAIL / HOLD for:

```text
source identity
rig compatibility
retarget integrity
neutral grip
weapon orientation
self-clearance
target reach
foot/root integrity
active-frame readability
reaction compatibility
transition compatibility
recovery
crowd suitability
camera readability
```

A clip can be visually attractive and still fail as gameplay melee.

---

# 29 · Failure Taxonomy

| Symptom | Likely cause | Repair |
|---|---|---|
| Weapon points backward / sideways | canonical basis or grip rotation wrong | fix profile/source basis before clip |
| Sword enters own chest/head | grip, retarget, wrist/twist, or incompatible arc | basis → mount → retarget → IK → clip |
| Off-hand leaves 2H grip | missing secondary weapon-space target | create secondaryGrip; solve off-hand IK |
| Shield intersects arm/body | attachment transform wrong | fix attachment owner; re-prove block pose |
| Bodies overlap so weapon can hit | target spacing tied to torso collision | separate push spacing from reach |
| Strike visually lands but no hit | thin/discrete sensing or bad active window | swept volume; inspect timeline |
| Hit happens before visual contact | active window too early / geometry too generous | retime/reduce; compare contact path |
| Same target takes repeated single-hit damage | no attack ledger | attack instance + consumedTargets |
| Miss still makes impact burst | VFX tied to animation marker | drive impact from confirmed contact |
| Combo melts through body | generic blend | semantic transition edge / shorter blend / bridge |
| Player attack feels laggy | film-style anticipation too long | immediate acknowledgment; shorten or buffer |
| Enemy attack feels unfair | weak tell or late tracking | strengthen tell; close tracking earlier |
| Root motion fights controller | two movement owners | choose movement mode / adapter contract |
| Motion warp looks magnetic | warp window too long / correction too large | bound window and correction |
| Retarget twists wrists | bad retarget pose / axes / twist | correct chains/pose/twist before polish |
| Staff damages everywhere | contact zones not attack-specific | activate only declared tip/shaft/head zones |
| Crowd is unreadable chaos | unrestricted simultaneous attacks | ticket/role scheduler |
| Paired finisher drifts | bad relative-root/alignment contract | pre-align, reserve pair, then play |
| Hitstop creates phantom hits | collision continues incorrectly during pause | freeze/guard contact state consistently |
| Cartoon FX obscures contact | no hierarchy/event budget | restore primary body/weapon read |

---

# 30 · Implementation Order

For a new melee slice:

```text
1. Read consumer SSOT / Return / current runtime owners.
2. Load kfb-cartoon-animation and this skill.
3. Pick one actor, one weapon profile, one attack outcome.
4. Show actor / weapon / clip sources in isolation.
5. Establish canonical weapon basis and neutral grip.
6. Prove self-clearance on the attack clip.
7. Define startup / active / follow-through / recovery.
8. Add swept contact + attack ledger.
9. Prove spacing and forced-contact fixtures.
10. Wire confirmed contact to one reaction.
11. Add one impact VFX and one SFX.
12. Add hitstop/camera only if the read needs them.
13. Add buffer/branch/cancel only after one attack is correct.
14. Add crowds only after one-on-one contact is deterministic.
15. Add paired animation only where exact choreography justifies it.
16. Capture evidence and persist Return.
```

Do not start by importing twenty weapons and fifty attack clips.

---

# 31 · Minimal KFB Brickfish Path

If scope needs to collapse, use one universal improvised weapon first.

```yaml
id: brickfish-1h
handedness: 1h
primaryHand: right
contactKind: soft_volume
anchors:
  - grip
  - impactHead
attackFamilies:
  - bonk_horizontal
  - bonk_diagonal
  - poke
  - overhead_bonk
hitPolicy:
  default: once_per_swing
presentationProfile: comic_blunt_soft
```

Cartoon presentation may add:

- squash on confirmed impact;
- delayed fish tail follow-through;
- smear;
- one BONK-class impact;
- tiny eye reaction if the Brickfish is alive;
- ink/slime only when the project canon wants it.

The gameplay core remains the same one later used by swords/clubs.

---

# 32 · LLM Execution Contract

When an LLM is asked to "add melee", it must not immediately code a generic combat controller.

It must first state:

```text
CONSUMER OWNER:
RUNTIME MOVEMENT OWNER:
ACTOR SOURCE:
RIG SOURCE:
WEAPON SOURCE:
ATTACHMENT OWNER:
ATTACK CLIP SOURCE:
CONTACT OWNER:
OUTCOME:
PROTECTED BOUNDARY:
```

Then it must choose exactly one bounded implementation target.

## 32.1 Required before implementation

```text
[ ] exact current SSOT / Return read
[ ] source object shown/verified
[ ] existing contact/movement systems searched
[ ] reuse decision documented
[ ] no second runtime owner introduced
```

## 32.2 Required before "fixed"

```text
[ ] neutral mount proof
[ ] self-clearance proof
[ ] active-window proof
[ ] contact / miss proof
[ ] per-swing dedupe proof
[ ] recovery proof
[ ] VFX/SFX only on correct semantic events
[ ] no unrelated regression
```

---

# 33 · Final Quality Gate

A melee move passes only if every applicable answer is yes.

```text
[ ] Is the exact actor / rig / weapon / clip source known?
[ ] Was the source object verified in isolation before integration?
[ ] Is there only one movement/runtime owner?
[ ] Is the weapon canonical basis defined?
[ ] Is the neutral grip visibly correct?
[ ] Does the weapon clear the owner through startup, active and recovery?
[ ] Is a 2H off-hand solved to a weapon-space secondary grip?
[ ] Are push, hurt and attack geometry semantically separate?
[ ] Are active windows explicit?
[ ] Does fast contact use sweep/volume sampling?
[ ] Is per-target consumption explicit?
[ ] Does a miss remain free of hit consequences?
[ ] Does confirmed contact drive reaction/impact?
[ ] Are target range/facing rules explicit?
[ ] Is target tracking bounded?
[ ] Is root motion / controller movement ownership explicit?
[ ] Are buffer/branch/cancel windows explicit?
[ ] Do transitions preserve readable pose and weapon path?
[ ] Is ordinary combat unsynced unless exact paired contact is required?
[ ] Are paired interactions pre-aligned and reserved?
[ ] Is crowd aggression scheduled rather than simultaneous spam?
[ ] Is there one clear primary read at impact?
[ ] Are VFX/SFX/camera subordinate to contact and reaction?
[ ] Does hitstop preserve combat-state consistency?
[ ] Is recovery clean?
[ ] Are fixed fixtures and debug overlays available?
[ ] Is the exact bounded outcome evidenced?
```

---

# 34 · Canonical Summary

```text
Attack is a contract, not a clip.

Source first.
Grip before swing.
Clearance before contact.
Timeline opens the window.
Geometry proves the hit.
Ledger prevents duplicates.
Reaction sells consequence.
VFX and audio punctuate truth.
Camera preserves readability.
Recovery restores control.

One melee core.
Many weapon profiles.
No second runtime owner.
```

For KFB cartoon combat:

```text
credible cause
→ readable intent
→ clean weapon path
→ confirmed contact
→ exaggerated reaction
→ controlled comic impact
→ recovery
```

Absurdity is welcome.

Unexplained clipping is not.

---

# 35 · Research Spine

The detailed source matrix is persisted separately. Core references include:

- Unreal Engine: Animation Notifies, Motion Warping, Root Motion, Skeletal Mesh Sockets, IK Rig / Full Body IK, Animation Montages and transition blending;
- Unity Animation Rigging: Two Bone IK and dynamic constraint relationships; Physics swept casts;
- Godot AnimationTree / state-machine transitions / method tracks;
- Blender IK and Child Of constraints;
- Adobe Mixamo rigging/mapping documentation;
- Naughty Dog GDC: `Unsynced: The Last of Us Melee System` and `Melee AI in The Last of Us Part II`;
- Sloclap / Sifu developer interviews and Benjamin Colussi fight-choreography material;
- Santa Monica / God of War combat, boss-fight and sound-design material;
- Sucker Punch GDC: `Master of the Katana`;
- Mariel Cartwright GDC game-animation talks;
- Mike Jungbluth: `Anatomy of a Hit Reaction`;
- Jason Shum / Gnomon: `Combat Animation for Games`;
- existing KFB Combat Arena CA2 swept-contact / AttackLedger / spacing diagnostics.

See:

`skills/chat/workflows/KFB_CARTOON_BRAWL_SKILL_2026-10-03/RESEARCH_SOURCE_MATRIX.md`
