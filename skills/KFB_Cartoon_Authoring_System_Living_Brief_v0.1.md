# KFB Cartoon Authoring System — Living Brief

**Status:** living design brief / Codex implementation basis
**Version:** 0.1
**Date:** 08.09.2026
**Purpose:** This document consolidates the design decisions, visual principles, existing KFB SOPs, architecture, MVP scope, QA rules, and open questions for a browser-based LLM-assisted 2D cartoon authoring system. It is intended to minimize later clarification, approval loops, and micro-management when implemented by Codex/Astra.

---

## 0. Executive intent

Build a small deterministic **2D / 2.5D Cartoon Authoring System** in which an LLM acts as story director and scene composer while the renderer remains deterministic and asset-driven.

The system should allow the creation of short animated cartoons / strips / micro-stories from:

- a reusable pool of stylized characters / archetypes;
- hand-drawn background assets with optional parallax layers;
- reusable props, accessories, and gear attached to characters through anchors;
- limited animation clips and expressive facial states;
- comic speech / thought / scream bubbles;
- browser TTS and optional narrator voice;
- camera choreography;
- KFB-specific ink / outline rendering and controlled hand-drawn motion.

The core principle is:

> The LLM decides **what happens, who acts, what they say, what they look at, and how the scene is staged**. The deterministic authoring engine decides **how the assets are rendered and animated**.

Do not build a generic AI animation generator. Build a constrained cartoon theatre with a strong visual grammar.

---

# 1. Design thesis

The strongest current direction is not a generic stick-figure system. Use the existing KFB Godot-style compact head/animal figures as the visual and technical starting point.

These figures already have the desired abstraction:

- compact bodies;
- oversized expressive heads/faces;
- simple rubber-like limbs;
- strong silhouette readability;
- expression carried primarily by face and posture;
- accessories can transform character identity quickly;
- they can coexist with much more detailed hand-drawn backgrounds.

The intended aesthetic is **living drawing**, not “animated SVG”.

The key ingredients are:

1. simple graphic actors;
2. expressive eyes, eyebrows, lids, and tiny mouths;
3. limited body poses;
4. deliberately limited / pseudo lip-sync;
5. hand-drawn backgrounds;
6. restrained parallax and camera motion;
7. attached props and costume logic;
8. controlled line wobble / ink drift;
9. comic staging and punctuation;
10. speech bubbles, TTS, and narrator.

The visual family may range from stylized humans to anthropomorphic animals and abstract cartoon creatures. Geometric base forms plus rubber-like limbs are preferred where they improve reusability and expression.

---

# 2. Reuse and inheritance from existing KFB assets

## 2.1 Existing Godot character sheets are the preferred visual starting point

The attached Godot strip artwork demonstrates the target relationship between:

- large expressive head actors;
- small simplified mascot-like figures;
- hand-drawn environments;
- irregular ink contours;
- speech bubbles and comic composition.

Do not discard this language in favor of generic vector-cartoon aesthetics.

## 2.2 Existing ink SOPs are normative inputs, not inspiration only

The existing KFB ink work already defines critical behavior:

- outline width is position-dependent rather than uniform;
- global light direction is upper-left, with richer/darker line treatment lower-right;
- `LX 0.62`, `LY 0.78`, `ORIENT 0.34` are explicitly documented as global KFB ink values;
- cards / comic panels use a BAND family built from offset curves, not a uniform `stroke()`;
- small shapes require special treatment because a full-width band can swallow them;
- contours must be deterministic and seed-stable;
- silhouette and ink are separate concerns;
- geometry should be measured rather than judged only by intuition;
- an owner exists for each numeric source of truth;
- actual playback / actual interaction, not only API invocation, is part of QA.

These rules should be reused for the cartoon authoring renderer wherever applicable. Do not invent a second unrelated “handdrawn” outline engine.

Reference: `skills/SOP_kfb_ink_v1.md` and `skills/kfb-embed-bundle v3/SOP_KFB-Karte-und-Tuschekante.md`.

The card ink SOP explicitly states that the KFB contour is generated once and reused by mask, decal, and additional layers, and that the fill recedes beneath the ink while the ink remains visually centered / dominant at the edge. It also distinguishes the BAND family from a zippier STRICH family and warns that a plain stroked polyline cannot reproduce a brush-band appearance. [Source-derived from existing SOPs]

## 2.3 Existing cartoon-motion SOP is normative

`skills/kfb-cartoon-animation_v2.md` is the current basis for motion design.

Important inherited principles:

- motion must have semantic motivation;
- staging and one clear visual read are required;
- cause → anticipation → action → impact → follow-through → recovery is the default choreography;
- timing and spacing are distinct;
- secondary action supports rather than competes;
- idle motion should indicate life without permanent fidgeting;
- speech is body punctuation, not continuous shaking;
- stable seeded geometry is preferred over per-frame random redraw;
- visible comic marks belong to the KFB ink language;
- rings are not generic impact effects;
- dust is tertiary;
- effects must be semantically assigned.

Reference: `skills/kfb-cartoon-animation_v2.md`.

---

# 3. Character system

## 3.1 Character = Actor

Each character is a reusable actor with a stable identity and a small number of variable visual channels.

Conceptual structure:

```text
ACTOR
├── silhouette / head-body base
├── eye_L
│   ├── eyeball
│   ├── pupil
│   └── lid
├── eye_R
├── brow_L
├── brow_R
├── mouth
├── limb_L/R components
├── optional ears / tail / appendages
├── accessory anchors
└── metadata / behavior profile
```

The exact implementation may use SVG, Canvas, DOM, or a hybrid, but the conceptual separation should remain stable.

## 3.2 Face is the primary actor interface

The expression system should expose high-value parameters rather than dozens of named emotions.

Core channels:

```text
eye openness
pupil x/y
lid amount
brow angle
brow height
mouth shape
mouth openness
gaze target
```

Initial mouth library can be deliberately small:

```text
closed
small-open
wide-open
O
smile
grimace
```

The expression system should support named presets, but presets are compositions of these channels rather than a giant hard-coded taxonomy.

## 3.3 Recommended first expression set

```text
neutral
happy
angry
confused
suspicious
shocked
sad
smug
panicked
thinking
```

These are starting presets, not separate rig types.

The animation engine should allow the LLM to call either a named expression or direct facial channels within safe bounds.

## 3.4 Body language

Body action matters. A talking head with a moving mouth is insufficient.

Allowed body punctuation:

- small lean;
- head nod;
- head tilt;
- eye direction change;
- eyebrow accent;
- tiny arm gesture;
- ear / tail / hat lag;
- squash / stretch accent;
- weight shift.

Keep the body language economical and readable.

## 3.5 Compact cartoon anatomy

Preferred anatomy for the first archetypes:

- oversized head;
- compact torso;
- simple arms and legs;
- rubber-like / capsule / Bézier limbs;
- simple hands / paws where needed;
- silhouette carries character.

Avoid anatomically realistic joints, skinning, or full skeletal complexity in MVP.

## 3.6 Character archetypes

Separate **archetype** from **instance**.

Example:

```yaml
archetype: bureaucrat
species: cat
personality:
  - pedantic
  - tired
  - passive_aggressive
visual:
  head_shape: round
  eye_scale: large
  body_scale: tiny
costume:
  default: glasses
available_actions:
  - point
  - stamp
  - shrug
  - sigh
  - sit
  - walk
```

An archetype provides reusable acting capabilities and semantic metadata. An instance is the actual character appearing in a scene.

## 3.7 Broad cast strategy

Prefer a compact reusable base cast that can appear across radically different genres:

- satire;
- classic storybook;
- postmodern;
- absurdist;
- meme;
- science fiction;
- horror parody;
- bureaucracy / workplace satire;
- historical parody;
- children's-story abstraction.

The visual identity of the cast should remain recognizable while costume, props, setting, wording, and direction change.

---

# 4. Animation system

## 4.1 Philosophy

Do not attempt full traditional animation.

Build **limited, strongly staged cartoon animation**.

The target is:

> enough motion to communicate acting, weight, timing, and comic punctuation while preserving the hand-drawn / simplified visual character.

## 4.2 Core clip library

MVP clip library:

```text
idle
walk
turn
jump
fall
sit
talk
point
wave
shrug
react
panic
look_left
look_right
blink
```

Each clip should be parameterized where practical and should support additive layering.

## 4.3 Pseudo-talk

Do not build full phoneme-perfect facial animation for MVP.

Use simple mouth cycling driven by TTS duration and optional timing hints.

Possible algorithm:

1. determine utterance duration;
2. generate an approximate talk rhythm;
3. cycle through 3–5 mouth states;
4. add occasional blink / brow / head punctuation;
5. return to neutral at the end of the utterance.

The goal is visual plausibility and comic rhythm, not phonetic realism.

## 4.4 Animation mental model

Use the existing KFB motion model:

```text
cause
→ anticipation
→ action
→ impact
→ follow-through
→ recovery
```

No clip is considered complete without recovery.

## 4.5 Overlap and follow-through

Secondary parts can settle after the main body stops:

```text
body
→ arms
→ held object
→ ears / tail / hat / cape
```

This creates life without adding complexity to the core actor rig.

---

# 5. Living Ink System

## 5.1 Ink is a system-level style language

The “wobbling” ink outline should be a core rendering behavior, not a decorative filter.

Desired impression:

- hand-drawn;
- slightly nervous;
- alive;
- imperfect but legible;
- subtly organic;
- sometimes mildly neurotic.

## 5.2 Three layers of visual life

### A. Ink Drift

Very small, temporally coherent contour deformation.

Never generate independent random geometry each frame.

Bad:

```text
new random outline every frame
```

Good:

```text
stable canonical path
+ slowly evolving deformation
```

### B. Actor Drift

Small body-level micro-motion:

- tiny breathing;
- weight shift;
- head settle;
- small pose drift.

### C. Facial Microanimation

- occasional blink;
- pupil drift;
- eyebrow twitch;
- tiny mouth movement;
- micro-expression transitions.

## 5.3 Ink deformation constraints

The deformation must preserve recognition.

```text
recognition first
irregularity second
```

Do not use visible glitching, flickering, or frame-to-frame contour replacement.

## 5.4 Relation to existing KFB ink canon

Where possible, derive character outline rendering from the existing KFB ink logic rather than creating an unrelated renderer.

The existing SOP specifies position-dependent line weight, with richer line treatment down/right and global values `LX 0.62 · LY 0.78 · ORIENT 0.34`. It also explicitly warns that a uniform `stroke()` is not KFB ink and that the appropriate family may be a band between offset curves. [Source-derived]

For characters, the exact numeric preset may differ from cards. The **language is global; presets are contextual**.

Suggested presets:

```text
ink_character
ink_small_character
ink_prop
ink_bubble
ink_emanata
ink_motion
```

Never silently create arbitrary new numeric presets during implementation. Add named presets only with rationale and measurements.

---

# 6. Background system

## 6.1 Backgrounds are authored assets

Prefer hand-drawn background artwork over procedural “AI backgrounds” at runtime.

A background may consist of layers:

```text
sky
far
mid
architecture / main world
foreground
foreground_fx
```

## 6.2 Parallax

Use limited parallax to create depth from 2D drawings.

No need for full 3D reconstruction.

Conceptually:

```text
far        small camera response
mid        moderate response
scene      standard response
foreground strong response
```

Exact factors remain tunable in a named preset.

## 6.3 Camera

Camera controls should remain simple:

```text
x
y
zoom
rotation (rare)
shake
focus target
```

Camera movement must obey the existing KFB staging rules. Avoid constant cinematic movement.

---

# 7. Props, costumes, and gear

## 7.1 Attachment model

Props should be first-class assets attached to actor anchors.

Conceptual anchors:

```text
head
hand_L
hand_R
back
waist
mouth
body
foot_L
foot_R
```

Each attachment supports:

```text
offset
rotation
scale
layer/order
optional follow-through
```

## 7.2 Cartoon attachment logic

The visual logic should be closer to classic cutout/cartoon staging than to physically realistic equipment simulation.

A character can have:

- giant hat;
- glasses;
- folder;
- sword;
- microphone;
- bag;
- cape;
- sign;
- absurd object;

without redesigning the base character.

Accessories should remain visually attached and inherit actor transforms.

---

# 8. Comic speech and narration

## 8.1 Speech is a scene system, not a bitmap decoration

A dialogue item should conceptually look like:

```json
{
  "speaker": "bureaucrat",
  "text": "Ihr Antrag ist leider nicht antragsfähig.",
  "bubble": "speech",
  "direction": "toward_citizen",
  "duration": 2.8
}
```

The bubble engine then handles geometry, placement, text fit, tail, and timing.

## 8.2 Existing bubble lessons must be preserved

From the existing KFB ink / bubble SOPs:

- use actual point geometry rather than vague shape names when a shape is explicitly authored;
- text belongs in the measured interior, not simply frame center;
- padding is geometry, not an arbitrary fixed pixel guess;
- text metrics must be based on the actually loaded font;
- the ink line must not be a uniform stroke;
- bubble silhouettes and ink families must remain separate responsibilities.

## 8.3 Do not repeat the failed generic bubble approach

The authoring system must not default to:

- generic cloud thought bubbles;
- generic UI rounded rectangles;
- mathematically perfect starbursts;
- generic sans-serif comic replacement fonts;
- arbitrary curved tails when the canonical shape specifies two straight tapering lines.

The bubble system must consume canonical KFB shape definitions and the same measurement-driven QA approach used elsewhere.

## 8.4 Narrator

Narration is an independent voice track and should not require a bubble.

Conceptual structure:

```text
scene narration
→ TTS
→ optional subtitle / caption
→ optional visual narrator treatment
```

---

# 9. TTS and audio

## 9.1 Browser TTS is sufficient for MVP

Use browser TTS as the first implementation.

Do not block the system on a sophisticated voice platform.

## 9.2 Audio timing

Speech animation should be able to use:

- total utterance duration;
- optional word/phrase timing if available;
- optional emphasis markers from the LLM.

## 9.3 Sound effects

Use the existing KFB semantic VFX / SFX approach.

A sound event should have meaning. Avoid constant sound beds and indiscriminate effects.

---

# 10. LLM director layer

## 10.1 Role

The LLM is the **director / author**, not the renderer.

It should be able to create a scene plan that references only known assets and capabilities.

## 10.2 Scene description

Recommended internal representation:

```yaml
scene:
  background: office_03
  camera:
    framing: medium
    focus: bureaucrat
  actors:
    - id: bureaucrat
      archetype: bureaucrat
      pose: seated
      expression: tired
      props:
        - asset: giant_stamp
          attach: hand_R
    - id: citizen
      archetype: citizen
      pose: standing
      expression: confused
  dialogue:
    - speaker: bureaucrat
      text: "Ihr Antrag auf einen Antrag..."
      bubble: speech
    - speaker: citizen
      text: "Ja?"
      bubble: speech
  actions:
    - actor: bureaucrat
      clip: point
    - actor: citizen
      clip: blink
```

The exact schema can evolve, but the distinction between **semantic scene plan** and **rendered geometry** must remain.

## 10.3 LLM constraints

The LLM must not invent:

- unknown assets;
- unsupported animation clips;
- arbitrary renderer parameters;
- new character anatomy at runtime;
- new ink systems;
- duplicate timing owners.

Unknown capabilities should produce an explicit fallback or proposal rather than silently fabricating a solution.

---

# 11. Authoring UX

The first useful UI should feel like a small cartoon studio, not a programming environment.

Recommended panels:

```text
CHARACTERS
BACKGROUNDS
PROPS
SCENE
DIALOGUE
TIMELINE
CAMERA
PLAYBACK
```

The user should be able to:

- choose actors;
- place them;
- choose poses / expressions;
- attach props;
- type or generate dialogue;
- preview TTS;
- adjust timing;
- scrub and play;
- export a scene / short.

LLM generation can sit on top of this authoring model rather than replacing direct control.

---

# 12. MVP scope

Do not start with a giant system.

## MVP target

### Characters

3–5 archetypes, ideally reusing existing KFB/Godot character language.

### Expressions

10 presets built from shared facial channels.

### Poses / clips

10–15 reusable clips.

### Props

10–20 reusable assets.

### Backgrounds

3–5 layered hand-drawn scenes.

### Rendering

SVG / Canvas / hybrid deterministic renderer.

### Motion

Idle, talk, walk, point, react, jump, fall, basic turn.

### Speech

One speech bubble family plus narration.

### Audio

Browser TTS.

### Camera

Position, zoom, small shake, focus.

### Ink

KFB character preset + controlled temporal wobble.

### Export

At minimum a playable browser scene and a deterministic frame/image export. Video export can follow after the core loop is stable.

---

# 13. QA and acceptance

## 13.1 Three gates

Every implementation milestone should pass:

### Gate A — Specification QA

Does it obey this brief and the cited KFB SSOT/SOPs?

### Gate B — Technical QA

Does it function deterministically, without console errors, geometry corruption, uncontrolled randomization, or conflicting state owners?

### Gate C — Visual QA

Does it actually look like the intended KFB/cartoon language when seen in screenshots or playback?

Passing A and B while failing C is failure.

## 13.2 Screenshot-first visual QA

Codex should actively inspect its own output during implementation.

At each major milestone:

1. run the real app;
2. load the scene through the real user path;
3. capture screenshots at representative sizes;
4. inspect visually;
5. compare against the brief and reference assets;
6. correct obvious visual drift before asking for approval.

Do not rely solely on code-level assertions for visual systems.

## 13.3 Required visual checks

### Character

- silhouette remains recognizable;
- facial features align correctly;
- eyes / brows / lids do not drift or overlap incorrectly;
- limbs remain attached;
- props remain anchored;
- small motion is visible but not jittery;
- ink drift looks alive rather than broken.

### Ink

- line is visibly non-uniform where the preset calls for it;
- lower/right line treatment is consistent with KFB light logic;
- outline does not flicker because of new random geometry every frame;
- small figures are not swallowed by excessive stroke width;
- no obvious detached halos / gaps.

### Animation

- action reads in one glance;
- anticipation exists when useful;
- impact and recovery are distinguishable;
- secondary motion does not dominate;
- idle is calm enough to remain readable.

### Speech

- bubble points to the correct speaker;
- text remains inside measured interior;
- tail construction follows canonical geometry;
- typography remains intentionally comic rather than generic UI text;
- no overlaps with face / important visual content.

### Background

- parallax reads subtly;
- foreground does not break actor readability;
- camera movement does not become constant decoration.

---

# 14. Determinism and source-of-truth rules

The existing KFB SOPs repeatedly emphasize ownership and measurement. Preserve that philosophy.

## 14.1 One owner per number

A numeric property should have one authoritative owner. Other systems may add or transform relative to it, but should not overwrite it absolutely without explicit contract.

## 14.2 Stable seeds

Stable shape geometry is mandatory for any visible contour that should read as hand-drawn rather than flickering.

A character instance should have a stable visual seed.

A prop can have its own stable seed.

An animation event may have an event seed.

The renderer may derive coherent temporal deformation from those seeds.

## 14.3 Measure important geometry

Where the visual requirement is measurable, expose a measurement function or diagnostic.

Possible character diagnostics:

- outline width range;
- contour deviation;
- silhouette bounds;
- eye alignment;
- prop anchor error;
- text-safe area;
- bubble tail direction error.

Do not use measurements as a substitute for visual judgment. Use them to make visual QA faster and more reproducible.

---

# 15. Technical architecture

Preferred first implementation:

```text
browser app
├── asset registry
├── character rig layer
├── expression system
├── animation clip system
├── prop attachment system
├── background / parallax layer
├── camera
├── speech / bubble system
├── TTS adapter
├── scene graph
├── deterministic renderer
├── timeline / playback
└── LLM scene-planning adapter
```

The LLM adapter should output validated scene data, not direct rendering code.

Use a schema validator at the semantic boundary.

---

# 16. Recommended development order

Do not build all subsystems simultaneously.

### Phase 1 — Actor Lab

One character, one background, one camera.

Controls:

- eyes;
- lids;
- brows;
- mouth;
- pose;
- ink amount;
- ink drift;
- squash/stretch.

Goal: prove that the actor looks alive and still hand-drawn.

### Phase 2 — Clip Lab

Add:

- idle;
- talk;
- point;
- react;
- walk;
- jump / fall.

Goal: prove that limited animation communicates acting.

### Phase 3 — Prop / Costume Lab

Attach and animate a handful of objects.

Goal: prove reusable cast logic.

### Phase 4 — Scene Lab

Add layered background, parallax, camera, two actors, simple dialogue.

Goal: one complete 10–20 second scene.

### Phase 5 — Speech / TTS

Add browser TTS and bubble timing.

Goal: complete narrated / dialogued micro-story.

### Phase 6 — LLM Director

Add natural-language scene generation against the validated asset / clip catalog.

Goal: user gives a short story prompt, system creates a playable scene plan.

### Phase 7 — Export and content workflows

Add repeatable short generation and scene reuse.

---

# 17. Failure modes to avoid

The implementation must explicitly avoid these failure modes:

### Generic vector cartoon look

Symptom: sterile perfectly uniform outlines and overly clean shapes.

Fix: reuse KFB ink language and controlled irregularity.

### Random wobble

Symptom: jitter / flicker / unstable contours.

Fix: deterministic temporal deformation with stable seeds.

### Over-animation

Symptom: every object constantly moves.

Fix: semantic motion, calm idle, staging hierarchy.

### Generic AI bubble system

Symptom: rounded UI boxes, cloud bubbles, generic starbursts.

Fix: canonical KFB bubble shapes and measurement-driven geometry.

### Complex rig too early

Symptom: lots of bones and controls but weak acting.

Fix: face + silhouette + simple limbs first.

### LLM invents implementation details

Symptom: unsupported assets, arbitrary styles, fragile code.

Fix: validated scene schema and asset registry.

### Code passes but visuals fail

Symptom: technically correct but stylistically wrong output.

Fix: screenshot-based visual QA is mandatory.

---

# 18. Open questions for implementation, not blockers

These can be resolved by testing rather than by asking the user repeatedly.

1. SVG vs Canvas vs hybrid for the actor renderer.
2. Exact temporal ink-deformation method.
3. Exact parallax ratios.
4. Exact mouth-cycle timing heuristics.
5. Optimal export pipeline.
6. Whether the first editor should be single-scene or storyboard-first.

Choose the simplest architecture that preserves the visual requirements and remains easy to replace.

Do not block the project with premature framework choices.

---

# 19. Codex implementation contract

When asked to implement this brief:

1. Read this document first.
2. Read the referenced KFB ink and cartoon-motion SOPs before modifying visual systems.
3. Inspect existing character assets and reuse them before generating replacements.
4. Build a minimal vertical slice first.
5. Run the real application.
6. Capture screenshots / representative playback.
7. Inspect the visuals yourself.
8. Fix obvious mismatches before requesting user approval.
9. Keep source-of-truth ownership explicit.
10. Avoid speculative abstractions and unnecessary frameworks.
11. Preserve deterministic asset identities and seeds.
12. Do not replace the KFB visual language with generic defaults.
13. When a requirement is ambiguous, choose the smallest implementation consistent with this brief and document the choice rather than creating a broad new system.

The objective is to reduce user micro-management. The implementation should arrive at review with the core design already interpreted, wired, tested, and visually checked.

---

# 20. Canonical one-paragraph brief for an implementation agent

> Build a browser-based 2D/2.5D cartoon authoring system using the existing KFB Godot-style compact characters as the visual starting point. Characters are reusable stylized actors with oversized expressive faces, simple rubber-like limbs, a small facial parameter set, limited animation clips, pseudo-talk, and attachable props/accessories. Backgrounds are hand-drawn layered assets with subtle parallax. The visual identity is “living drawing”: reuse the existing KFB ink canon, including position-dependent line weight and global upper-left light logic, and add controlled temporally coherent ink drift rather than per-frame random jitter. Reuse the existing KFB cartoon-animation SOP: semantic motion, staging, anticipation, action, impact, follow-through, recovery, restrained idle, and readable secondary action. Speech bubbles, narration, and browser TTS are first-class scene systems. An LLM acts as director and scene composer, producing validated semantic scene descriptions that reference known assets and clips; it does not invent arbitrary renderer behavior. Build incrementally from Actor Lab → Clip Lab → Prop Lab → Scene Lab → Speech/TTS → LLM Director. At every milestone run the real app, inspect screenshots/playback, and correct visual drift before asking for approval. Technical correctness is insufficient if the visual result does not match the intended KFB hand-drawn cartoon language.

---

# 21. Living-document rule

This document is intentionally additive.

New discoveries should be appended or incorporated only when they are supported by:

- measured implementation evidence;
- direct visual QA;
- existing KFB canon / SOP;
- explicit design decisions.

When a new rule supersedes an old one, preserve the old rule in a dated changelog entry rather than silently rewriting history.
