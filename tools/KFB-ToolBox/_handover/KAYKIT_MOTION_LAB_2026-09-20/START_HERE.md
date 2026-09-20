# KFB ToolBox · KayKit Motion / Animation Lab proposal · START HERE

**Date:** 2026-09-20  
**Status:** IMPLEMENTATION CANDIDATE · TOOLBOX OWNER · HUMAN ACCEPTANCE OPEN  
**Owner:** KFB ToolBox / Motion authoring  
**Does not create:** a second Animation owner, Registry, mixer, physics controller or consumer runtime  
**Implementation candidate:** `tools/KFB-ToolBox/kaykit-motion-lab-v1/`  
**Fixed Stage target:** https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/kaykit-motion-lab-v1/

## 0 · Why this exists

Georg asked to hand the Kay Lousberg creator-video learnings and KCL-M1 measurements into ToolBox / Animation Lab and already apply them as proposals to:

1. **FrizzleBob · Driver Graft · Rig_Medium**
2. **GothGirl · Rig_Medium**
3. **Black Knight · Rig_Large**

The point is not to copy Godot. The useful layer is engine-neutral:

```text
exact actor source
→ rig family
→ separate animation library
→ semantic motion state
→ measured clip profile
→ phase-aware transition
→ local playback-rate correction
→ attachment/event profile
→ consumer-owned movement/physics
```

## 1 · Mandatory source chain

Read in this order:

1. `skills/chat/START_HERE.md`
2. `skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`
3. `skills/kfb-cartoon-animation_v2.md`
4. `tools/KFB-ToolBox/START_HERE.md`
5. `tools/KFB-ToolBox/_handover/STAGE_FIRST_V1_INTAKE_2026-09-18/START_HERE.md`
6. KayKit creator living research on Draft PR #107:
   `tools/game-dev-studio/research/KAYKIT_CREATOR_LESSONS_LIVING.md`
7. KCL-M1 evidence:
   `tools/game-dev-studio/research/kcl-m1-locomotion-sync/`

PR #107 remains research evidence; it is not automatically merged by this slice.

## 2 · Creator/KCL rules to carry forward

### 2.1 Rig family is a hard compatibility boundary

`Rig_Medium` and `Rig_Large` are explicit motion-library families.

Never:
- feed Medium motion profiles into Black Knight;
- infer Large timing from Medium timing;
- treat identical bone names as identical scale/kinematics.

Black Knight has measured Large proportions and uses Large-sized equipment.

### 2.2 Animation library is separate from actor identity

An actor profile points to a motion library. It does not copy clips into the actor asset.

```text
actor/model source
+ rig profile
+ animation-library refs
+ motion-profile refs
+ attachment refs
```

This is the reusable structure Kay demonstrates and KFB should preserve.

### 2.3 Consumer state remains outside Animation Lab

ToolBox may author/test:

- clip selection;
- phase/contact markers;
- crossfade;
- timeScale;
- loop/once semantics;
- attachment profiles;
- event-marker candidates.

Travel/Race/Combat/Platformer still own:

- world position;
- velocity;
- physics;
- gameplay state;
- damage/ammo;
- jump trajectory;
- interaction progress.

### 2.4 Locomotion transitions synchronize phase, not merely state

Preferred Walk ↔ Run seam:

```text
source supporting/contact foot
→ target same-foot contact
→ short crossfade
→ optional temporary warp
→ target cadence settles
```

Not:

```text
speed threshold
→ target starts at frame 0
```

### 2.5 timeScale is local cadence correction

Candidate:

`playbackRate ≈ desiredSpeed / measuredReferenceSpeed`

Only inside a visually approved range.

Do not stretch one gait across every speed.

### 2.6 Use hysteresis around speed bands

```text
Walk → Run above runEnter
Run → Walk below runExit
runExit < runEnter
```

This is consumer-facing state logic, but ToolBox can author/export the candidate thresholds.

### 2.7 Contact/release markers are phase-relative

If playback rate changes, combat/interaction events remain tied to animation phase.

Never use an unscaled wall-clock timeout as the authoritative weapon release / tool impact marker.

### 2.8 Attachments use exact donors and named bones

```text
exact donor
→ correct rig-size variant
→ named bone/socket
→ local calibration
→ stance/clip compatibility
→ consumer test
```

A loaded asset is not proof of a good attachment.

### 2.9 Material/texture variants remain variants

Do not duplicate actor identity merely because the texture/palette/UV variant changes.

### 2.10 Retargeting remains a staged evidence ladder

External retargeting is later work:

```text
source rig map
→ retargeted clip
→ neutral mannequin
→ actor visual QA
→ consumer QA
→ Georg acceptance
```

Not part of this first three-actor slice.

## 3 · Actor proposal matrix

### A · FrizzleBob · Driver Graft

Current reader:
`tools/KFB-ToolBox/kfb-rigs-embed-v3/frizzlegraft-v1/graft-mount.v1.js`

Current contract:
`tools/KFB-ToolBox/kfb-rigs-embed-v3/contracts/kfb-pet-graft-driver.v4.json`

Host:
`KayKit_Mystery_Series6/2 - August 2023 - Driver/character/gltf/Driver.glb`

Rig:
`Rig_Medium`

Rule:
`mountGraft(... animation:'host')` → one lab mixer drives `graft.figure` → each frame `mixer.update(dt)` before `graft.update(dt,camera)`.

Initial locomotion proposal:
- Idle_A;
- Walking_A;
- Running_A;
- phase-aware Walk ↔ Run;
- timeScale candidate;
- Walking_B/C remain selectable alternatives;
- Running_B remains HOLD until actor-specific visual review.

Default motion proof disables pose-over-clip and does not force a weapon.

Weapon/Ranged work stays an explicit later profile; the graft reader already has the correct hand/slot ownership.

### B · GothGirl

Exact actor:
`media/3D_Assets/KayKit_Mystery_Series6/GothGirl/characters/GothGirl.glb`

Rig:
`Rig_Medium`

Known motion binding evidence exists on the real actor.

Initial proposal:
- same measured Medium locomotion framework;
- actor-specific remeasurement before exporting speeds;
- Idle_A → Walking_A → Running_A state graph;
- Walking_B/C alternatives;
- Running_B HOLD until visual review.

Attachment proposal:
`GothGirl_Microphone.gltf` → `handslot.r`.

It is same-collection source and should be tested as an explicit attachment profile, not embedded into locomotion ownership.

Current EyeRig/Face work remains owned by the EyeRig ToolBox slice. This Motion Lab must not mount a second face owner.

### C · Black Knight

Exact actor:
`media/3D_Assets/KayKit_Mystery_Series6/3 - September 2024 - Black Knight/characters/BlackKnight.glb`

Rig:
`Rig_Large`

Animation sources:
- `Rig_Large_General.glb`;
- `Rig_Large_MovementBasic.glb`.

Initial proposal:
- enumerate the real Large clip set at runtime;
- Idle_A / Walking_A / Running_A only when those exact clips exist and bind;
- measure Large foot contacts/reference speeds independently;
- no Medium motion-profile reuse;
- no Jump state unless an exact Large source clip exists.

Attachment proposal:
- `BlackKnight_Sword_Large.gltf` → right hand slot;
- `BlackKnight_Shield_Large.gltf` → left hand slot;
- shield local push donor: `0.55` from measured Resident Atlas evidence;
- do not substitute Medium sword/shield.

## 4 · First implementation gate

The browser candidate should prove:

1. each of the three real actors loads in isolation;
2. its declared rig-family library loads;
3. exact available motion names are enumerated;
4. Idle / Walk / Run candidates bind;
5. real foot contacts are measured;
6. actor-specific reference-speed/slip candidates are generated;
7. A/B naive vs phase-sync Walk → Run can be run;
8. speed→timeScale is inspectable;
9. no consumer world movement/physics writer exists;
10. one mixer per visual host;
11. FrizzleBob keeps the current graft reader;
12. Large remains independent from Medium;
13. attachment proposals are source-pinned and not silently promoted.

## 5 · Candidate output

Machine-readable proposal:

`tools/KFB-ToolBox/kaykit-motion-lab-v1/PROFILE_PROPOSALS.json`

Runtime evidence should later append/export:

```text
actor
rigFamily
clipRef
duration
footContacts
plantedIntervals
referenceSpeed
approvedPlaybackRange
transition profile
attachment profile
event-marker candidates
human status
```

Unknown stays unknown.

## 6 · Promotion boundary

This slice may produce:

- ToolBox candidate;
- browser evidence;
- profile proposals;
- Stage link;
- handoff to future Animation Lab promotion.

It may **not** automatically:

- merge the ToolBox branch;
- promote Animation Lab from UNVERIFIED to CURRENT_TOOL;
- rewrite Travel/Race/Combat;
- modify canonical KayKit GLBs;
- invent Sprint;
- claim Large/Medium interchangeability.

## Exactly one next gate

Publicly prove the three-actor ToolBox candidate, then Georg reviews **FrizzleBob / GothGirl / Black Knight** in the same semantic Idle → Walk → Run / phase-sync workflow before any consumer integration.
