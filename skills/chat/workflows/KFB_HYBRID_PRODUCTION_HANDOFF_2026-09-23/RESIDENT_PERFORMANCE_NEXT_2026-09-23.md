# KFB Resident Performance · Next Route · 2026-09-23

Status: **CURRENT PLANNING · ORB-D1 + DANCE-D1 MAY RUN IN PARALLEL**

## Für Georg

Die Trommelbewegung und die nächsten Tanzbewegungen sollten jetzt **nicht mehr als freie IK-Aufgaben** behandelt werden.

Neue Grundregel:

**bestehenden Bewegungsdonor zuerst → natürlicher Bewegungsbogen bleibt → Objekt/Target wird passend positioniert → nur kleine additive Korrekturen → Audit → Export**

Nicht:
Target festnageln und den Körper so lange verbiegen, bis er es erreicht.

---

# Lane A · ORB-D1 · Drummer reference-first rebuild

Owner:
PR #195 / Blender MCP authoring.

Current accepted:
- leader = OK;
- guitarist = OK;
- drummer v1–v4 = FAIL;
- v5 = restored baseline only, not accepted.

## A1 · First reference source = KayKit Rig_Large combat

Before external mocap, render/audition exact same-rig movement donors on Orc Brute.

Priority candidates from current source evidence:
- `Melee_2H_Slam`;
- `Melee_2H_Attack`;
- `Melee_1H_Slash`;
- `Melee_Dualwield_Slash`;
- `Melee_Unarmed_Smash`.

Use unchanged donor clips first.

For each:
- Orc Brute;
- source rig;
- side view;
- 3/4 view;
- marked natural impact/contact frame;
- sticks remain identity-gripped.

No drum-target solving yet.

## A2 · Georg reference pick

Georg picks the motion that reads most like:
**heavy Orc strikes war drum**.

External drumming/mocap reference is needed only if the local same-rig donors do not provide a credible stroke.

Do not make Georg research external libraries before the local donor review exists.

## A3 · Clip first, placement second

After the motion is selected:

1. keep donor arm mechanics;
2. find natural contact frame;
3. move/scale/orient drum + Brute until stick tip reaches inner drum head;
4. only then apply small additive correction.

Do not bend wrist/forearm to a drum position chosen earlier.

## A4 · IK policy

IK / reach solvers are allowed only for:
- small contact correction;
- placement assistance;
- preview diagnostics.

They may not redesign the source stroke.

If IK must rotate a joint beyond the action-family budget:
move the target or reject the candidate.

## A5 · Joint profiles

No universal KFB joint limit.

Create:
`kfb.motion-joint-profile/0.1-candidate`

For Drum Strike candidate:
- elbow min 35°;
- wrist max 35°;
- forearm twist max 70°.

Status:
**CANDIDATE · calibrate against accepted stroke.**

Do not apply this profile to guitar.

Accepted guitar evidence requires its own profile and currently includes much larger forearm supination (~117°).

## A6 · Contact truth

Measure:
- stick tip;
- drum surface/target zone;
- before-contact clearance;
- contact distance;
- rebound clearance.

Not:
hand local-Z minima as sole proof.

## A7 · Trigger/export

GLB:
motion only.

Sidecar:
- BPM;
- phase;
- contact times;
- hand;
- accent;
- semantic event name.

Current ORB source:
- 100 BPM;
- phase offset 0.465.

Runtime decides SFX/VFX behavior.

## A8 · Stop rule

Two failed repair passes after the selected donor:
STOP, export, ask.

No v6→v10 solver spiral.

---

# Lane B · DANCE-D1 · first reusable Resident dance/groove

This lane may proceed while ORB-D1 is waiting on a drummer reference.

## B1 · Rig scope

Start:
**Rig_Medium only.**

First QA actors:
- GothGirl;
- Orc Raider.

Why:
- same 23-bone family;
- richest KayKit donor coverage;
- already central to Performance/Warband work.

Do not include Rig_Large in the first dance build.

Resident Atlas proves:
Rig_Medium clips can bind to Large but deform badly.
Large remains a separate authored/validated family.

Legacy remains later KISS:
torso/head/arms only, no leg dance vocabulary.

## B2 · Source-first dance audition

There is **no accepted native KayKit Rig_Medium dance clip** in the current Character Animations 1.1 workflow.

Known P1 donor candidate:
`Rig_Medium_Special.glb · Skeletons_Taunt_Longer`
- 3.0 s;
- loopable candidate;
- binding 69/69 on existing hero tests;
- **not visually accepted as groove**.

Other proven performance donors may be auditioned as ingredients:
- `Cheering` = accent/celebration, not assumed base dance;
- existing Idle/Movement clips = timing/body-weight references.

A Quaternius Mech asset has a clip literally named `Dance`, but it uses a different 13-bone rig and is **not** a KayKit dance donor.

## B3 · First DANCE-D1 outcome

Build one small review with:

### Candidate A · SOURCE
`Skeletons_Taunt_Longer` unchanged on GothGirl + Orc Raider.

### Candidate B · AUTHORED
one simple reusable:
`Dance_Idle_Groove_A`

Requirements:
- stable feet;
- weight shifts visibly;
- hips/body groove;
- asymmetry;
- exact loop;
- no grotesque wrist/forearm poses;
- no prop.

Optional:
a second authored:
`Dance_Step_Bounce_A`
only if Candidate B is already structurally clean.

Do not build a full dance library in D1.

## B4 · Dance authoring method

Use Resident Atlas rule:
- additive from a measured base pose;
- axis verified by test, not guessed;
- amplitude described as distance where possible, not arbitrary degrees.

Prefer:
- feet / knees / hips / torso first;
- arms as secondary follow-through.

Do not begin with upper-body arm choreography.

## B5 · NLA / upper-lower layering

The Base-Dance + Performance-Overlay architecture is a valid **candidate**, not yet a rule.

DANCE-D1 first proves a clean full-body/base groove.

Only after PASS:
DANCE-D2 may test:
- lower-body groove;
- upper-body vocal/guitar overlay;
- NLA layering;
- mask/export behavior.

## B6 · Dance joint / contact checks

Dance profile differs from strike profile.

Gate focuses on:
- foot floor penetration;
- knee/elbow self-fold;
- wrist/twist outliers;
- self-intersection;
- loop seam;
- root drift.

Do not reuse drum strike limits blindly.

## B7 · Human gate

One clickable review:

- GothGirl Candidate A/B;
- Orc Raider Candidate A/B;
- Front + 3/4 or orbit;
- real speed;
- source labels.

Ask Georg:

1. Which groove direction reads as KFB?
2. Should GothGirl/Orc share this base groove or diverge stylistically?
3. Is the movement clean enough to proceed to overlays/signature dances?

No separate approval for every bone/timing parameter.

---

# Lane C · Performance layering later

After DANCE-D1 PASS:

Possible next:
- Goth Vocal overlay;
- Guitar upper-body overlay;
- Presenter;
- WarDrum;
- signature dances.

Use:
`PERFORMANCE_SUITE_2026-09-15/START_HERE.md`

Do not create a second Performance Suite.

---

# Current animation-system rules

## Use existing clip if possible

Classification:
- FOUND_EXACT;
- FOUND_ADAPTABLE;
- COMPOSITE;
- PROCEDURAL;
- MISSING;
- DEFER.

Do not commission custom Blender animation before the source inventory is checked.

## IK is an authoring tool, not a motion concept

Good:
source clip + small contact correction.

Bad:
fixed target + solver invents anatomy.

## Prop relation first-class

Instrument/prop may move to fit a good body motion.

The actor is not required to deform grotesquely to preserve an arbitrary prop location.

## Events separate

Blender authors contact/timing.
Runtime owns:
- SFX;
- VFX;
- gameplay;
- state changes.

## Deliverables

Each promoted performance candidate returns:
- .blend;
- authoring script where practical;
- GLB/GLTF;
- preview;
- source + rig;
- clip name;
- joint profile used;
- contact/loop evidence;
- sidecar/event metadata;
- Return.

---

# Exactly one current decision

ORB-D1:
prepare same-rig KayKit melee reference review before new drummer animation.

DANCE-D1:
may start in parallel as Rig_Medium source-audition + one clean authored groove.

Neither blocks the ToolBox Control-Tower build.
