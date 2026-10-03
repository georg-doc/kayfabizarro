# KFB Cartoon Brawl · Research Block B
## Weapon profiles, transition contracts and clearance taxonomy

Status: RESEARCH CHECKPOINT B
Verified: 2026-10-03
Workflow: KFB-CARTOON-BRAWL-SKILL-01

This document converts Research Block A into a reusable melee taxonomy. It is deliberately engine-neutral and does not take runtime ownership from Combat Arena or other consumers.

## 1 · One melee core, multiple weapon profiles

Do not create separate combat architectures for every prop. Keep one common attack lifecycle:

`intent → eligibility → startup → alignment/track window → active sensing → validated contact → reaction/consequence → follow-through → recovery`

Vary the geometry and choreography through a `WeaponProfile`.

### Draft weapon-profile contract

```ts
type WeaponProfile = {
  id: string
  handedness: 'unarmed' | '1h' | '2h' | 'shield_1h' | 'polearm' | 'improvised'

  // attachment / basis
  primaryHand?: 'left' | 'right'
  gripSocket?: string
  canonicalForwardAxis?: Axis
  canonicalUpAxis?: Axis
  primaryGrip?: Transform
  secondaryGrip?: Transform

  // contact geometry
  contactKind: 'limb' | 'edge_segment' | 'head_volume' | 'shaft_segment' | 'soft_volume'
  contactAnchors: string[]
  allowedContactZones?: string[]

  // owner protection
  allowedOwnerContactZones: string[]
  forbiddenOwnerZones: string[]
  clearanceMarginClass: 'tight' | 'normal' | 'wide'

  // semantic families, not clip names
  attackFamilies: string[]
  guardFamilies?: string[]
  presentationProfile: string
}
```

The profile describes **facts about the prop and rig**. Attack clips stay in attack specs; damage stays in the consumer's consequence system.

## 2 · Canonical weapon basis

Every admitted weapon needs a stable local coordinate frame before choreography.

Record at minimum:

- forward / length axis;
- up / face normal where meaningful;
- grip origin;
- primary grip orientation;
- optional secondary grip;
- contact endpoints/volumes;
- visual root;
- authored scale;
- hand-slot owner.

### Hard rule

> Never repair a wrong canonical basis by inventing a different wrist rotation for every attack clip.

Repair order:

1. show weapon source object in isolation;
2. establish canonical local axes;
3. attach to the intended socket/hand in neutral pose;
4. prove grip and body clearance from front / side / 3/4;
5. set/verify retarget pose;
6. add hand / off-hand IK if the profile needs it;
7. then evaluate attack clips;
8. finally tune attack-specific offsets only if the source/rig genuinely demands them.

Engine support:
- Unreal Skeletal Mesh Sockets provide transformed attachment points relative to bones.
- Unity Two Bone IK supports target position/rotation and hint direction.
- Unreal IK/FBIK supports multi-goal solves, preferred angles, limits and twist correction.
- Blender IK and Child Of constraints provide end-effector orientation and animated parent influence.

## 3 · Self-clearance is an explicit test

"Looks mounted" is not enough. A weapon may be correct at idle and still cut through the attacker during startup, recoil or recovery.

For every admitted attack:

```text
sample pose over full clip
→ transform weapon contact/visual bounds
→ compare against owner protection volumes
→ ignore only declared grip/allowed-contact regions
→ record minimum clearance + penetration intervals
```

### Required owner volumes

At minimum:
- head;
- upper torso;
- pelvis;
- upper legs;
- non-grip arm/hand;
- optional accessory/cape volumes when visually important.

### Result classes

```text
CLEAR
TOUCH_ALLOWED
VISUAL_NEAR_MISS
PENETRATION_MINOR
PENETRATION_BLOCKING
```

A clip with `PENETRATION_BLOCKING` is not admitted merely because the attack reaches the target.

## 4 · Weapon archetypes

### 4.1 Unarmed

Geometry:
- attack source = named limb endpoint/volume (fist, elbow, foot, knee);
- no prop socket;
- hurtboxes remain separate from attack volumes.

Special requirements:
- limb extension and recovery are part of fairness/readability;
- multiple limbs can be valid contact sources, but each attack declares exactly which ones are active;
- do not let a whole character collider become the attack hitbox.

### 4.2 1H blade

Geometry:
- primary grip;
- blade base + tip;
- optional edge normal / edge side;
- swept blade segment during slash;
- tip-focused volume during stab.

Choreography:
- slash path must clear owner's head/torso;
- stab must orient the tip toward target region during active window;
- trail can follow the blade path, but damage uses validated contact.

### 4.3 1H blunt / club / mace

Geometry:
- primary grip;
- shaft optional;
- impact head volume is usually the important contact region.

Choreography:
- larger anticipation/recoil may sell weight;
- impact consequence can differ from blade while reusing the same attack lifecycle.

### 4.4 Shield + 1H

Geometry:
- one weapon grip + dedicated shield mount;
- shield has its own forward/guard plane and owner-clearance requirements;
- offhand is occupied by the shield and must not be reused as a second sword grip.

Owner rule:
- fix shield placement in the attachment owner, prove neutral + guard/block pose there, then consume that transform in Combat.
- this directly generalizes the current KFB Black Knight shield failure.

### 4.5 2H weapon

Geometry:
- primary grip is authoritative attachment;
- secondary grip is a target on the weapon;
- secondary hand is solved to that target via IK/constraint rather than separately hard-parenting the weapon to two skeleton bones.

Choreography:
- longer lever creates wider owner-clearance and target-spacing requirements;
- torso/root participation normally increases;
- turn/alignment window must close before active contact unless the attack explicitly tracks.

### 4.6 Polearm / staff

Geometry:
- primary + secondary grips;
- at least one long shaft segment;
- optional tip/head contact zone;
- attack spec decides which zones are active for a given move.

Do not make the entire polearm damaging during every move. A thrust, butt strike and wide staff sweep are separate contact policies.

### 4.7 Improvised / soft / absurd prop — KFB "Brickfish" class

Purpose:
- support fish, pencil, brush and other stylized props without inventing another combat engine.

Geometry:
- stable primary grip;
- simple effective collision envelope: capsule/segment/soft lobe;
- optional secondary wobble/tail visual chain.

Separation of concerns:
- **contact geometry** may stay simple and deterministic;
- **presentation** may squash, wobble, smear, shed ink/slime/stars, etc.;
- visual deformation must not silently move authoritative damage geometry unless the attack spec explicitly owns that behavior.

This class is the recommended KFB MVP narrowing path if broad weapon coverage becomes expensive.

## 5 · Attack specification

```ts
type MeleeAttackSpec = {
  id: string
  weaponProfileId: string
  animationSemantic: string
  clipRef: string

  intent: 'light' | 'heavy' | 'launcher' | 'sweep' | 'stab' | 'guard_break' | 'counter' | 'special'
  targetPolicy: string

  entry: {
    range: RangeSpec
    facingToleranceDeg: number
    lineOfMotion?: LineSpec
    grounded?: boolean
  }

  timeline: {
    startup: Window
    tracking?: Window
    warp?: Window
    active: Window[]
    followThrough: Window
    recovery: Window
    buffer: InputWindow[]
    cancel: CancelWindow[]
    branch: BranchWindow[]
  }

  movement: {
    mode: 'in_place' | 'controller_driven' | 'root_motion' | 'bounded_motion_warp'
    turnPolicy: string
  }

  hitPolicy: {
    geometry: string
    perTarget: 'once_per_swing' | 'multi_hit' | 'persistent'
    maxTargets?: number
  }

  reactionClass: string
  impactProfile: string
}
```

## 6 · Transition grammar

A combo is a state graph, not a playlist.

Every edge must state:

```text
source semantic pose/state
→ input or AI condition
→ buffer window
→ branch/cancel window
→ transition mode
→ destination semantic pose/state
→ recovery fallback
```

### Distinguish these windows

**Input buffer**
- accepts an input before it can execute;
- stores a bounded intent;
- consumes it only when the destination edge becomes legal.

**Branch window**
- chooses the next attack in a combo without necessarily aborting the current pose immediately.

**Cancel window**
- permits an action to interrupt the current move.
- defensive cancels (guard/dodge) and offensive cancels should be separately declared.

**Tracking window**
- permits bounded target-facing correction.

**Warp window**
- permits bounded root-motion alignment to a declared target.
- must end before a phase where visible sliding would break the attack read, unless intentionally designed otherwise.

Engine evidence:
- Unreal Montages expose sections, blend-in/out, interruption/completion and notify-window events.
- Unreal Motion Warping uses explicit notify-state windows.
- Godot state-machine transitions expose immediate/sync/at-end modes, crossfade time/curve and conditions.
- Unreal inertialization can preserve velocity/acceleration across selected transitions.

### Hard rule

> A long generic crossfade is not a transition design.

It can create:
- weapon-through-torso interpolation;
- double-hand ghost poses;
- contact before/after the legal active window;
- foot sliding;
- mushy anticipation.

Use pose-compatible edges, short controlled blends, inertialization, or an authored bridge where required.

## 7 · Player input semantics

Gamepad, keyboard/mouse and touch must map to **combat intentions**, never directly to animation clip names.

Minimum semantic input layer:

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

Directional context is separate:

```text
movement vector
camera/aim vector
current soft target
explicit locked target if used
last hostile direction
```

The attack resolver chooses an eligible attack from weapon profile + state + direction + spacing. This keeps devices interchangeable and prevents animation assets from becoming control architecture.

## 8 · Responsiveness versus animation purity

Player-driven action has a tighter responsiveness budget than enemy telegraphing.

Useful pattern:

```text
player command
→ immediate readable acknowledgment pose / fast startup
→ active action
→ recovery with declared cancel options
```

Enemy action may spend more time on anticipation/tell because the player must read and answer it.

This reconciles classical anticipation with shipped action-game practice: strong readable poses remain essential, while player input should not feel ignored for the sake of a film-length wind-up.

## 9 · Paired vs unsynced choreography

### Default gameplay hit

Prefer:
- independent attacker animation;
- target-relative entry conditions;
- independent directional reaction;
- validated contact.

This scales much better across body sizes, weapons and crowd states.

### Paired move

Reserve for:
- takedown;
- grapple;
- throw;
- finisher;
- scripted struggle;
- environmental kill;
- exact-contact comic beat.

Paired move contract adds:

```ts
type PairedInteraction = {
  attackerClip: string
  defenderClip: string
  relativeRootTransform: Transform
  entryTolerance: TransformTolerance
  alignmentWindow: Window
  breakConditions: string[]
  exitStates: string[]
}
```

Pre-align actors before the choreographed contact. Do not continuously drag two actors together throughout the whole paired sequence.

Sifu's production used mocap specifically for coordinated takedowns while most normal movement was reproduced/keyframed from martial-arts reference. Naughty Dog's Unsynced approach likewise motivates keeping ordinary hits systemic.

## 10 · Crowd / all-vs-all scheduling

A cartoon brawl becomes unreadable if every eligible NPC attacks simultaneously.

Encounter-level scheduler should allocate temporary roles:

```text
PRIMARY_ATTACKER
SECONDARY_PRESSURE
CIRCLE / REPOSITION
RECOVER
PAIR_RESERVED
ENVIRONMENT_INTERACT
```

Sifu's shipped solution explicitly used a ticket system with one main opponent plus secondary enemies to preserve readability.

For NPC-vs-NPC / all-vs-all:
- each actor owns one primary opponent at a time;
- local scheduler limits simultaneous commitments around each victim;
- paired interactions reserve both actors;
- target switching happens at recovery/interrupt-safe points unless an attack explicitly supports retargeting;
- crowd pressure can be created by movement/feints/repositioning without every NPC occupying an active hit window.

## 11 · Hit zones and movement collision are separate

Keep at least these concepts distinct:

```text
push/body volume: prevents character overlap
hurt volume: where actor may receive a hit
attack/contact volume: where current attack may connect
guard/throw volumes: optional specialized semantics
owner-clearance volumes: diagnostic protection against self-intersection
```

The fighting-game hitbox/hurtbox tradition and the existing CA2 non-overlap diagnostic both support this separation. Visible mesh bounds must not become the one universal combat collider.

## 12 · Impact event order

Recommended event chain:

```text
attack timeline enters active
→ contact sampler/tracer detects candidate
→ authority validates target/policy/ledger
→ contact becomes CONFIRMED
→ damage/stagger/reaction intent
→ animation reaction
→ VFX + SFX at actual contact
→ optional hitstop
→ camera accent if budget allows
```

Trail/air-whoosh can be animation-timed because they describe the **swing**.
Blood/impact burst/target hit sound should normally require **confirmed contact** because they describe the **hit**.

God of War analyses specifically emphasize hit reaction, audio, exaggerated follow-through and brief hit-stop as a coordinated feedback loop rather than one isolated effect.

## 13 · Intake audit for Mixamo / motion libraries

A library clip is a **donor candidate**, not an accepted move.

Audit:

```text
source clip isolated
semantic family identified
neutral/reference pose known
root/hips orientation checked
retargeted to exact target rig
hands/wrists/twist inspected
feet/root sliding inspected
weapon mounted with canonical profile
self-clearance sampled
target-spacing fixture run
active window measured
start/end pose compatibility classified
recovery state proven
```

Adobe documents that Mixamo maps supported humanoid skeletons to its system; this does not prove that a retargeted clip has correct KFB weapon contact, grip or body clearance.

## 14 · Failure taxonomy

| Symptom | Likely source | Repair order |
|---|---|---|
| Sword crosses own chest/head | bad weapon basis, grip transform, retarget pose or incompatible clip | basis → socket → neutral proof → retarget → IK → clip |
| Offhand floats off 2H grip | no weapon-space secondary target / wrong IK | secondary grip marker → IK target/hint → twist/limits |
| Shield sits inside forearm/body | attachment-owner transform wrong | fix/promote attachment; do not patch per Combat attack |
| Hit appears before contact | active marker too early or consequence tied only to marker | retime sensing + require validated contact |
| Fast slash misses target | discrete overlap / thin ray | swept segment/capsule/sphere between samples |
| One swing damages every frame | no per-attack ledger | attack instance + per-target consumption policy |
| Combo feels mushy | generic blend or overlong branch window | explicit edge + pose compatibility + shorter/semantic blend |
| Player input feels ignored | too much mandatory anticipation / no buffer | immediate command acknowledgment + bounded buffer/cancel |
| Enemy attack feels unfair | weak tell / tracking too late | stronger readable anticipation; close tracking before impact |
| Crowd becomes blender | unrestricted simultaneous attackers | ticket/role scheduler |
| Impact FX on miss | VFX bound to clip marker rather than contact | swing FX on timeline; hit FX on confirmed contact |
| Retargeted motion twists wrist | retarget pose/chain/twist mismatch | pose → chain axes → twist correction → local polish |
| Paired finisher drifts apart | bad initial relative-root contract | pre-align/warp in bounded entry window; reserve pair |

## 15 · Proposed minimal Brickfish profile

If KFB wants a constrained MVP, this is enough:

```yaml
weapon: brickfish
handedness: 1h
primary_hand: right
contact_kind: soft_volume
anchors:
  - grip
  - impact_head
allowed_attacks:
  - bonk_horizontal
  - bonk_diagonal
  - poke
  - overhead_bonk
presentation:
  trail: optional
  squash_on_confirmed_impact: true
  impact_family: comic_blunt
hit_policy:
  default: once_per_swing
```

This deliberately keeps the same core as swords/clubs while allowing the visual Fish body to bend/wobble independently.

## Next gate

**SKILL-DRAFT-01** — distill Research A+B into `skills/kfb-cartoon-brawl_v1.md`, including implementation order, debug fixtures and quality gates.
