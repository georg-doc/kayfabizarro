# KFB Performance Animation Pilot · Instrument / Prop Actions · 2026-09-23

Status: **CANDIDATE ADDENDUM · VALIDATE ON WARBAND BEFORE PROMOTION**

## Purpose

Current KFB animation skills already cover:
- anticipation;
- arcs;
- timing / spacing;
- follow-through;
- cartoon staging;
- motion families;
- reusable clip metadata.

The missing production layer is **task mechanics**:

> What is the functional body sequence for an instrument/prop action, where are the real contact moments, and how is the authored Blender result exported as a reusable runtime clip with deterministic triggers?

First validation target:
**Orc Brute / Warband drum performance.**

This file extends, not replaces:
- `skills/cartoon-motion_v1.md`;
- `skills/kfb-cartoon-animation_v2.md`;
- Resident/rig/attachment source facts.

## 1 · Performance action = task loop, not generic waving

Before keyframing, define:

```
setup pose
→ preparation
→ acceleration
→ contact
→ rebound / follow-through
→ return / next preparation
```

For cyclic musical performance, the recovery is the next preparation.

Do not start from:
“move both arms up and down to the beat.”

Start from:
“which hand hits which target on which beat, with what accent, and what joint chain produces that contact?”

## 2 · Contact-first authoring

For every prop/instrument action define actual geometry facts:

- held prop/stick grip point;
- active tip/contact point;
- target surface / zone;
- allowed contact tolerance;
- pre-contact clearance;
- contact frame;
- post-contact rebound.

The contact frame is the anchor.
The pose between contacts is animation.

Required test concept:

```
before contact: tip above/outside target
contact: tip reaches target zone
after contact: tip separates again
```

No stick may remain buried through the drum head.

## 3 · Body-chain model

Use the smallest believable kinematic chain.

For a heavy drummer:

```
root / pelvis
→ torso
→ shoulder / scapular region
→ upper arm
→ elbow
→ forearm
→ wrist
→ hand
→ stick
→ drum contact
```

Weight distribution:
- hand/wrist = fastest/local detail;
- forearm/elbow = main stroke support;
- upper arm/shoulder = larger accent / heavy stroke;
- torso/root = slower groove and weight shift.

For a Rig_Large Orc:
**do not make the whole arm one rigid lever.**
The body is heavy, but the stick still rebounds quickly.

## 4 · Drumming mental model

Source-backed human drumming references support these useful abstractions:

- stick uses a fulcrum/pivot rather than being clamped rigidly;
- grip remains relaxed enough to allow rebound;
- wrist is a primary stroke driver;
- larger arm movement supports slower/heavier/louder strokes;
- after contact the stick naturally rebounds into preparation for the next stroke.

KFB translation:

### Normal hit

```
A · ready
stick tip above drum
elbow relaxed

B · lift / preparation
wrist + small forearm lift
opposite hand may already be in recovery

C · downstroke
wrist leads
forearm supports
torso accent is small and delayed

D · CONTACT
tip reaches measured drum zone
hit event fires here

E · rebound
tip exits surface quickly
wrist opens
forearm follows

F · settle / next lift
body groove resolves into next beat
```

### Heavy accent

Increase:
- preparation height;
- stroke speed;
- modest shoulder/torso participation;
- follow-through/body reaction.

Do not just scale every joint rotation equally.

### Alternating hands

Avoid twinning.

Typical readable loop:
`R contact → R rebound while L prepares → L contact → L rebound while R prepares`

Even when the rhythm is simple, left/right phase offset makes the performance legible.

## 5 · Beat contract

Every musical clip should define:

- BPM;
- meter / beats per loop;
- loop duration;
- beat frame/time table;
- contact hand/prop on each beat;
- accent strength;
- optional offbeat/ghost hits;
- phase offset relative to source audio.

Example candidate:

```json
{
  "clip": "OrcBrute_WarDrum_Groove_A",
  "fps": 24,
  "bpm": 96,
  "beatsPerLoop": 4,
  "rootMotion": "none",
  "contacts": [
    {"beat":1,"hand":"R","event":"DRUM_HIT_R","accent":1.0},
    {"beat":2,"hand":"L","event":"DRUM_HIT_L","accent":0.75},
    {"beat":3,"hand":"R","event":"DRUM_HIT_R","accent":0.9},
    {"beat":4,"hand":"L","event":"DRUM_HIT_L","accent":0.75}
  ]
}
```

The exact Warband pattern may differ.
Do not invent the final musical pattern if Georg/Suno/audio establishes one.

## 6 · Blender authoring contract

Author reusable performance clips as named Blender Actions.

Preferred:
- one semantic action per reusable clip;
- preserve source bone names;
- props attached through proven bones/frames;
- no root translation unless explicitly required.

Use Blender NLA for organization/preview where useful.

For game export:
- ensure intended Actions are active or stashed appropriately for glTF export;
- give clips stable semantic names;
- if constraints/IK/drivers create the final motion, bake the evaluated result before runtime export where needed.

Do not assume a beautiful viewport constraint setup automatically exports correctly.

## 7 · Runtime event contract

glTF carries animation clips, but KFB should **not rely on Blender timeline markers as the sole runtime trigger system**.

Keep semantic trigger data in a compact sidecar:

`kfb.performance-motion/0.1-candidate`

Suggested fields:

- clip name;
- source rig;
- fps;
- duration;
- loop;
- BPM / beat grid;
- contact events;
- prop bindings;
- root-motion policy;
- runtime trigger names;
- measured contact tolerances;
- known compromises.

Runtime then binds:
`animation time → semantic event`

Example:
- drum contact → SFX / local VFX;
- guitar strum → optional stem/visual accent;
- juggle release/catch → prop ownership event.

Animation playback and gameplay/event ownership remain separate.

## 8 · Trigger rule

Authoring trigger and runtime effect are not the same owner.

Blender owns:
- pose;
- timing;
- contact frame;
- clip.

Runtime owns:
- audio dispatch;
- VFX;
- gameplay consequence;
- interaction state.

A drum hit marker must not create a second AudioContext or gameplay owner.

## 9 · Validation views

Before Georg sees the clip, provide:

### Motion view
- normal game/read camera;
- one loop;
- real speed.

### Contact view
- close side/3/4;
- sticks + drum surface visible.

### Silhouette view
- actor readable at expected world size.

### Optional diagnostic
- contact point / target zone overlay.

Diagnostics are secondary, not the hero presentation.

## 10 · Quantitative checks

At each declared contact:
- tip-to-target distance within tolerance;
- no deep penetration;
- hand/prop attachment remains stable.

Across loop seam:
- first/last root pose compatible;
- no snap in torso/arms;
- prop transform continuous.

For batch authoring:
validate one source-backed fixture first.
Then parameterize.

## 11 · Failure diagnosis

### Robotic piston arms
Cause:
same joint phase / whole-arm rotation / no rebound.

Fix:
wrist-led stroke + elbow/forearm hierarchy + phase offset.

### Stick tunnels through drum
Cause:
animation authored by silhouette only.

Fix:
contact-first measurement.

### Heavy Orc looks weightless
Cause:
hands/torso all move at same speed.

Fix:
fast local stick/wrist motion over slower body groove.

### Rhythm looks correct but action looks wrong
Cause:
beat grid exists, task mechanics do not.

Fix:
separate beat timing from physical stroke cycle.

### Blender looks good, runtime looks wrong
Cause:
constraint/Action/NLA/export mismatch.

Fix:
inspect exported clip names and bake final evaluated pose motion where needed.

## 12 · Promotion gate

Do not make this a canonical new global skill yet.

Promote/merge into the existing animation skill only after:
1. one Warband drummer candidate visually passes;
2. GLB clip plays in an existing KFB runtime;
3. contact events survive via sidecar/runtime binding;
4. one second action family (guitar, juggling, hammering, etc.) reuses the grammar without a rewrite.

Until then:
**candidate production addendum**.


## Research references

External references used for this candidate addendum:

### Blender 5.2 LTS

glTF 2.0 animation export:
https://docs.blender.org/manual/en/5.2/addons/scene_gltf2.html

Relevant production facts:
- named Actions can export as glTF animations;
- Actions must be active or stashed to NLA as required by the chosen export mode;
- NLA Tracks can be exported as independent animations;
- object transforms / pose bones / shape keys are supported;
- non-animation runtime semantics should not be assumed to export as clip events.

NLA:
https://docs.blender.org/manual/en/5.2/editors/nla/introduction.html
https://docs.blender.org/manual/en/5.2/editors/nla/strips.html

Bake Action:
https://docs.blender.org/manual/en/5.2/editors/nla/editing/strip.html

Production implication:
constraints/IK may be useful for authoring contact, but runtime export should be verified/baked rather than assumed.

### Drumming mechanics

Yamaha · snare drum basics:
https://hub.yamaha.com/music-educators/instruments/perc/snare-drum-basics-pedagogy/

Yamaha · stick grip:
https://hub.yamaha.com/music-educators/instruments/perc/a-guide-to-proper-stick-grips/

Vic Firth · rebound stroke:
https://ae.vicfirth.com/wp-content/uploads/FA-Drumset-Lessons-1-2.pdf

Useful abstractions retained:
- relaxed fulcrum;
- wrist-led stroke;
- arm support for larger/slower/heavier strokes;
- real target contact;
- natural rebound after contact.

These are mechanics references, not mandates to reproduce a realistic human drummer literally on a stylized Orc.


## PR #195 postmortem corrections

PR #195 provides direct negative evidence from Orc Brute drummer v1–v4.

### Donor motion before IK

New hard rule:

`same-rig source clip → contact frame → prop/target placement → small additive correction → audit`

Do not begin with:
`fixed target → IK/search solves whole body`.

The latter produced:
- wrist overbend;
- forearm twist;
- stabbing motion;
- prop orientation errors.

### Target may move

A good natural source motion outranks an arbitrarily pre-positioned drum.

If the natural strike misses:
first move/scale/orient drum + actor.

Do not deform the actor to preserve the old target.

### Joint budgets are action-family-specific

No universal wrist/twist budget.

Current Drum Strike candidate:
- elbow ≥ 35°;
- wrist ≤ 35°;
- forearm twist ≤ 70°.

This profile is candidate-only.

Accepted Guitar Hold already exhibits much larger forearm supination (~117°), so guitar requires a different profile.

### Contact metric

Use evaluated:
- stick tip;
- target surface;
- deformed mesh/prop relation.

Do not infer impact solely from hand local-axis F-curves.

### Two-pass stop

After two failed repairs on the same movement problem:
STOP and return to reference/donor choice.

PR #195 went to four failed drummer methods and demonstrates why this rule is binding.

### Related current route

Read:
`RESIDENT_PERFORMANCE_NEXT_2026-09-23.md`

ORB-D1:
same-rig combat reference review first.

DANCE-D1:
Rig_Medium source-audition + one clean authored groove may run in parallel.
