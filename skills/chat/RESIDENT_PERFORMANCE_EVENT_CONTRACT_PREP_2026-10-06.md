# KFB Resident Performance Event Contract · PREP · 2026-10-06

Status: **ARCHITECTURE PREP · NO OPEN-WORLD RUNTIME WRITES**
Owner: **KFB Resident Performance**
Receiving product later: **KFB Open World / Resident Life**
Current Open World writer: **Claude Coworker · protected**

Purpose:
define the semantic event/performance contract now so the post-Coworker Architecture Freeze can verify/adjust it against the real runtime instead of inventing it under integration pressure.

## 1 · Prime rule

**State owners decide what is true. Presentation layers only read state/events and render it.**

Existing KFB canon already states:
**Emanata read state; they do not write state.**

The same rule applies to:
- pose;
- gesture;
- EyeRig;
- brows;
- PetMouth;
- bubbles;
- Audio reaction hooks.

No visual layer may become the emotion, dialogue or gameplay owner.

## 2 · Performance channels

A Resident performance is composed from independent channels:

1. **Base Pose**
2. **Relational Pose / Proximity**
3. **Gesture**
4. **Micro-motion**
5. **Face**
6. **Emanata**
7. **Bubble / Speech presentation**
8. **Audio hook**

These channels are combined by the future Resident Performance Composer.

### 2.1 Base Pose

Longer-lived readable whole-body attitude.

Examples:
- open / welcoming;
- attentive;
- guarded;
- proud;
- tired;
- worried;
- angry;
- embarrassed;
- suspicious;
- relaxed.

Base Pose is especially important for distance readability.

Prefer:
- existing idle/stance clips;
- clip time/weight variants;
- additive torso/shoulder offsets;
- small root/foot-safe posture changes.

Avoid one bespoke full-body clip per emotion.

### 2.2 Relational Pose / Proximity

How the Resident physically relates to another actor/object.

Parameters may include:
- facing target;
- social distance;
- step-in / step-out;
- lean toward / lean away;
- side lean;
- shoulder angle;
- head tilt;
- gaze target;
- openness/closedness of torso;
- prop presentation angle.

This is not pathfinding ownership.
Navigation moves actors through the world; relational pose adjusts local staging around an encounter.

### 2.3 Gesture

Short semantic accents:
- nod;
- shake;
- shrug;
- point;
- wave;
- offer;
- receive;
- inspect;
- dismiss;
- celebrate;
- disagree.

Gesture = punctuation.
Pose = readable sentence.

### 2.4 Micro-motion

Low-cost continuous or short additive cues:
- lean forward/back;
- side lean;
- head cock/tilt;
- small recoil;
- breathing/sway;
- step half-distance closer/farther;
- hand/shoulder anticipation;
- settle/recovery.

Micro-motion should be additive and reversible where possible.

### 2.5 Face

Existing owners:
- EyeRig v6 → gaze, blink, lids, eye life/emote;
- brows → public `eyeFrame()` attachment seam;
- PetMouth → rest expression + visemes/speech.

Body clips must not bake competing face logic.

### 2.6 Emanata

Emanata are a **read-only comic reaction layer** driven by Affect/Reaction/Event state.

Historical donor:
- `overworld/overworld-v13_2026-08-12/docs/overworld-v13/SPRINT_overworld-v13.md`
- prior plan: **14 signs, one per unit, mapped to state**;
- `OW_BLAYOUT.PLACE.emanatumOffset = 4` exists in the old bubble placement system;
- optional sound per sign was planned, default off;
- old sheet A was not a reliable sliced source; do not silently promote it.

Asset registry donor:
- `media/2D_Assets/KFB_Custom/KFB_Emanata_ChatGPT Image 12. Aug. 2026, 16_41_34.png`
- registry identity exists, but the old documentation explicitly records the sheet/raster limitation.

For the new 3D/clay Resident layer:
- preserve the semantic Emanata vocabulary;
- presentation may become **Claymation Emanata**: droplets, tears, sweat beads, question/exclamation shapes, anger marks, hearts, stars/sparks, gloom/cloud, etc.;
- exact final 14-art roster remains a design/source task, not invented here;
- V1 retains **max one primary Emanatum per Resident**;
- stable event seed during its lifetime;
- no per-frame random re-shaping;
- no collision with face, bubble or critical UI;
- Emanata may animate in 3D/2.5D but remain presentation-only.

### 2.7 Bubble / Speech presentation

ChatterBox owns speech/content semantics.
Bubble layer renders:
- speech;
- thought;
- whisper;
- shout/call;
- narration/box where supported.

Bubble and Emanata share placement/protected-area logic but remain distinct layers.

### 2.8 Audio hook

Resident Performance emits semantic audio hooks only:
- speech focus;
- reaction accent;
- optional Emanata SFX;
- activity accent.

Audio owner decides actual sound, mix and ducking.

## 3 · Event inputs

The Performance Composer should consume semantic events/state such as:

```
AffectChanged
ReactionPulse
EncounterBeat
ActivityBeat
SpeechStarted
SpeechAccent
SpeechEnded
GiftOffered
GiftReceived
TradeProposed
TradeAccepted
FluffShared
FluffSpilled
WorkStarted
WorkCompleted
DamageObserved
RepairObserved
PlayerApproached
PlayerInterrupted
POIDiscovered
```

Events describe meaning, not animation names.

Bad:
`playShrugClip()`

Good:
`ReactionPulse { kind: "doubt", intensity: 0.55, target: actorB }`

## 4 · PerformanceCue candidate

Conceptual shape for Architecture Freeze:

```
PerformanceCue {
  actorId
  sourceEvent
  affect
  intensity
  targetId?
  durationHint?
  priority

  pose {
    base?
    relational?
    proximityDelta?
    leanForward?
    leanSide?
    headTilt?
    facingTarget?
  }

  gesture?
  microMotion?
  gaze?
  brow?
  mouth?
  emanata?
  bubble?
  audioHook?
}
```

This is a candidate contract, not yet runtime truth.

## 5 · Arbitration

Recommended authority order:

1. physical safety / locomotion;
2. explicit gameplay action;
3. encounter spatial staging;
4. dialogue/body gesture;
5. reaction pulse;
6. idle/base pose;
7. ambient life.

Independent facial channels may layer when safe.

Pose rules:
- never move feet/root in a way that breaks locomotion/contact;
- step-in/out requires navigation/encounter cooperation;
- torso/head lean may be additive;
- gesture may temporarily override arms;
- recovery always returns to valid base pose.

## 6 · Emotion → multi-channel recipe

An emotion must not map to only one face or one clip.

Example:

`curious`
- Pose: slight forward lean, open torso;
- Relational: half-step nearer if allowed;
- Head: small tilt;
- Eyes: target focus, wider lids;
- Brows: asymmetry/up;
- Mouth: neutral/thinking;
- Gesture: optional small point/hand open;
- Emanata: question mark only if the reaction needs extra comic readability;
- Audio: no mandatory sound.

`worried`
- Pose: slight retreat/closed shoulders;
- Relational: maintain or increase distance;
- Head: down/side;
- Eyes: concern;
- Mouth: worried rest;
- Gesture: hands closer/body-protective if available;
- Emanata: sweat/drop optional;
- Audio: optional short accent.

`joy/gratitude`
- Pose: open/upward;
- Relational: step closer if relationship permits;
- Head: upright/soft nod;
- Gesture: receive/hand-to-chest/celebrate;
- Emanata: heart/star optional;
- Audio: optional accent.

## 7 · Encounter use

Encounter beat example:

`approach → notice → orient → greet → offer → receive → react → resolve → depart/resume`

Each beat may emit a PerformanceCue.

Example Gift:
- orient → relational pose;
- offer → gesture + prop presentation;
- receive → handoff action;
- react → affect + pose + face + optional Emanata;
- resolve → nod/thanks;
- resume → return to activity/base pose.

## 8 · Efficient implementation strategy

Prefer composable low-cost layers:

- a small Base Pose set;
- a small Gesture set;
- additive torso/head offsets;
- tiny proximity/root adjustments only through encounter/navigation seam;
- runtime gaze/eyes/brows/mouth;
- one primary Emanatum;
- semantic Audio hook.

This gives many combinations without hundreds of authored clips.

Target principle:
**few strong reusable motions × state-driven combinations > bespoke animation per emotion/dialogue.**

## 9 · Simulation LOD

Near:
- full pose/gesture/face/Emanata/bubble.

Mid:
- Base Pose + large Gesture + Emanata;
- reduced facial update frequency.

Far:
- silhouette-readable Base Pose/activity only;
- optional high-read Emanata;
- no mouth/viseme work.

Offscreen:
- no presentation updates; state simulation only.

This directly supports Georg's requirement that emotion remains readable at distance.

## 10 · Work/Blender split

### Web Chat now
Can define:
- semantic events;
- candidate schemas;
- emotion mappings;
- Emanata state mapping;
- arbitration;
- first fixtures.

### Work later/read-only prep
Can:
- inspect current contracts/modules;
- check ownership conflicts;
- convert this candidate into an Architecture Freeze checklist;
- prepare adapter interfaces;
- no Open World writes while Coworker runs.

### Blender MCP later
Can:
- test Pose/Gesture/Micro-motion on real rigs;
- prove distance readability;
- prove encounter staging;
- fill only true motion gaps;
- design/test clay Emanata geometry if/when resource conditions allow.

## 11 · First proof fixture

Use 3 Residents.

Must demonstrate:
- neutral Base Pose;
- attentive relational pose;
- approach + step-in;
- doubt → lean back/head tilt;
- gift → offer/receive;
- gratitude reaction;
- Fluff spill → surprise/worry;
- one Emanatum at a time;
- clean pose recovery;
- distance-readable silhouette;
- no face/body ownership conflict.

## 12 · Next gate

**Coworker exact RETURN → Work/WSA Architecture Freeze compares this contract to the real Open World architecture.**

No runtime integration before that gate.
