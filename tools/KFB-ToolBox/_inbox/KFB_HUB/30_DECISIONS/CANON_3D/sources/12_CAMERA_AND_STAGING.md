# 12_CAMERA_AND_STAGING

## Status

**Camera & Staging / Presentation Execution SSOT**

This document defines the boundary between **directorial staging decisions** and the technical camera system.

It answers:

> **Given an explicit staging and camera instruction, how does KFB frame, position and move the camera without inventing new dramaturgy?**

The Scene Director decides what the audience should see.

The Camera system executes that decision.

The renderer renders the resulting view.

---

# 1. CORE PRINCIPLE

```text
SCENE DIRECTOR
      |
      | staging intent
      v
PERFORMANCE EXECUTION CONTRACT
      |
      | camera instructions
      v
CAMERA + STAGING
      |
      v
DETERMINISTIC RENDERER
```

### Governing rule

> **The Director chooses the shot. The Camera chooses the coordinates.**

The camera is therefore an execution system, not a second director.

---

# 2. WHAT CAMERA & STAGING OWNS

The camera system owns:

- camera position
- camera target
- framing
- scale
- crop
- projection
- camera interpolation
- shot transitions
- screen-space composition constraints
- safe areas
- character placement relative to frame
- deterministic camera evaluation

It may expose reusable shot primitives.

---

# 3. WHAT CAMERA & STAGING DOES NOT OWN

It must not decide:

- which character is important
- whether a moment is funny
- whether a character is angry
- whether a scene needs a close-up
- whether a reaction should happen
- what a character means
- whether a shot is aesthetically successful

Those decisions belong upstream or to external evaluation.

---

# 4. CAMERA AS EXECUTION LAYER

The Director may say:

```yaml
camera:
  shot: medium_two_shot
  emphasis: Dory
  movement: none
```

The camera resolves this into:

```text
position
target
zoom / scale
projection
crop
```

The renderer receives the resolved camera state.

The camera must not reinterpret:

```text
Dory is morally superior
→ zoom into Dory
```

unless the Director explicitly requested the emphasis.

---

# 5. SHOT VOCABULARY

The initial shot library should remain small.

Suggested primitives:

```text
WIDE
MEDIUM
MEDIUM_TWO_SHOT
CLOSE
EXTREME_CLOSE
OVER_SHOULDER
PROFILE
INSERT
```

These are staging tools, not visual effects.

New shot types should be added only when they recur.

---

# 6. DEFAULT SHOT

KFB should have a stable default shot.

Suggested conceptual default:

```text
MEDIUM_TWO_SHOT
```

for ordinary Hunky/Dory interaction.

The default should allow:

- readable silhouettes
- facial acting
- bubble placement
- spatial relationship
- enough negative space for staging

The exact framing is a calibration decision, not hardcoded canon in this document.

---

# 7. WHY DEFAULT MATTERS

A stable default means a scene can remain visually coherent without constant directorial intervention.

It also provides a baseline for:

- regression tests
- comparison
- critic review
- scene generation
- user expectations

---

# 8. COMPOSITION BEFORE MOVEMENT

The first task of the camera is composition.

Before any movement:

```text
Who is visible?
Where are they?
What are they looking at?
What is the relevant object?
Where is the speech bubble?
What negative space is required?
```

Only after those questions are satisfied should movement be considered.

---

# 9. CHARACTER PLACEMENT

Character placement should be explicit.

Example:

```yaml
stage:
  positions:
    Hunky:
      x: -0.35
      y: 0
    Dory:
      x: 0.35
      y: 0
```

These values are conceptual.

The host's coordinate system remains authoritative.

---

# 10. SCREEN DIRECTION

The camera system should preserve readable screen direction.

For a two-character exchange:

```text
Hunky  →  Dory
Dory   ←  Hunky
```

Avoid unnecessary mirroring between shots unless explicitly requested.

A change in screen direction should be a deliberate staging decision.

---

# 11. CAMERA TARGETS

Targets may include:

- character
- pair midpoint
- object
- monitor
- external material
- scene anchor
- world position

Example:

```yaml
target:
  type: pair_midpoint
  actors:
    - Hunky
    - Dory
```

The camera resolves the target.

The Director determines why that target matters.

---

# 12. TWO-SHOT

The two-shot is a core KFB relationship shot.

It should make visible:

- relative size
- physical distance
- gaze relationship
- body posture
- reaction
- bubble relationship

Hunky and Dory must remain visually distinct.

The camera must not normalize their different silhouettes.

---

# 13. HUNKY / DORY SCALE RELATIONSHIP

The camera may frame both characters, but it must preserve the canonical relationship:

```text
Hunky = compact / broad / smaller
Dory  = tall / elongated / larger
```

Camera scaling must not accidentally make them appear equal in a way that destroys the intended visual hierarchy.

At the same time, the camera must not exaggerate their difference merely for a gag unless directed.

---

# 14. NEGATIVE SPACE

Negative space is functional.

Reserve sufficient space for:

- speech bubbles
- narrator box
- monitor / Alien Lens
- character gaze
- important objects

The camera should not crop away the destination of a meaningful gaze.

---

# 15. GAZE / FRAME CONSISTENCY

If a character looks at something, the composition should generally make the target legible.

Example:

```text
Hunky → monitor
```

If the monitor is completely outside the frame, the gaze may become ambiguous.

Possible solutions:

- include target
- use an intentional off-screen target
- adjust framing
- preserve ambiguity deliberately

The camera system must not automatically solve this by inventing a new target.

---

# 16. OFF-SCREEN SPACE

Off-screen targets are valid.

Examples:

- someone outside frame
- sound source
- unseen event
- narrator
- external material

Off-screen staging can create:

- anticipation
- curiosity
- social pressure
- absence
- scale

The Director specifies when off-screen attention is intentional.

---

# 17. CLOSE-UP

A close-up is a directorial choice.

It should be used when facial performance needs to become the dominant visual information.

Typical uses:

- eye contact
- brow reaction
- silent judgment
- whispered line
- emotional rupture
- comic pause

Do not convert every reaction into a close-up.

---

# 18. EXTREME CLOSE-UP

Extreme close-up is reserved for genuinely specific moments.

Possible targets:

- eyes
- brow
- mouth
- monitor detail
- object detail

It should not become a generic intensity effect.

---

# 19. PROFILE

Profile can clarify:

- silhouette
- gaze direction
- physical relationship
- body posture

It is particularly useful when character shape itself is important.

Avoid profile shots that obscure face acting without a staging reason.

---

# 20. OVER-THE-SHOULDER

OTS is optional.

It may emphasize:

- interpersonal pressure
- listening
- point of view
- spatial dominance

But it should not be introduced simply because two characters are speaking.

The two-shot is often clearer.

---

# 21. INSERTS

An insert isolates a specific object or visual information.

Examples:

```text
cockpit control
monitor
archive document
Fluff instrument
Ship Computer display
```

The insert must have a concrete informational or comedic function.

No decorative insert montage.

---

# 22. CAMERA MOVEMENT

Initial movement vocabulary:

```text
STATIC
PAN
TILT
PUSH
PULL
TRACK
```

Use the smallest vocabulary necessary.

Movement should have a staging reason.

Examples:

```text
PUSH
→ reveal that a facial reaction matters

PAN
→ reveal who Dory is looking at

TRACK
→ maintain composition during meaningful movement
```

---

# 23. STATIC IS THE DEFAULT

Static framing should be the baseline.

The camera should not move because:

- the scene feels slow
- the system wants more dynamism
- an animation just happened
- a character spoke

Movement must be justified by information, relationship or staging.

---

# 24. CAMERA TIMING

Camera actions use the same host clock as character performance.

Example:

```yaml
camera:
  action: push
  start: 2.2
  duration: 0.8
  hold: 0.5
```

No private camera timer.

No frame-rate-dependent movement.

---

# 25. CAMERA HOLDS

A shot may hold after a movement.

Example:

```text
push
→ arrive
→ hold
→ reaction
```

This prevents the camera from behaving like a continuous animation layer.

---

# 26. SHOT TRANSITIONS

Transitions should be explicit.

Supported initial modes:

```text
CUT
FADE
DISSOLVE
MATCH
```

The initial production default should generally be **CUT** unless another transition is explicitly staged.

---

# 27. CUTS

A cut is not a failure to animate.

A cut can provide:

- reaction emphasis
- temporal compression
- contrast
- reveal
- reset of composition

The Director decides when a cut is meaningful.

---

# 28. CONTINUITY

The camera system should preserve:

- character side
- relative positions
- gaze direction
- scale logic
- object continuity
- relevant screen direction

Unless the Director explicitly requests a discontinuity.

---

# 29. STAGING STATE

The camera layer should expose inspectable state.

Example:

```yaml
camera_state:
  shot: medium_two_shot

  position:
    x: 0
    y: 1.1
    z: 5.4

  target:
    type: pair_midpoint
    actors:
      - Hunky
      - Dory

  projection:
    type: orthographic

  framing:
    scale: 1.0

  movement:
    active: false
```

This supports:

- debugging
- replay
- screenshots
- critic review
- regression tests

---

# 30. CAMERA CONSTRAINTS

The camera must respect:

- scene bounds
- character visibility
- bubble safe areas
- narrator safe area
- monitor visibility where required
- minimum readable character scale
- canonical staging rules
- host coordinate system

If a requested shot cannot satisfy constraints:

```yaml
validation:
  status: ERROR
  code: CAMERA_CONSTRAINT_VIOLATION
```

Do not silently crop a character.

---

# 31. BUBBLE SAFE AREA

Speech presentation must have predictable space.

Conceptually:

```text
┌─────────────────────────┐
│ narrator safe area      │
│                         │
│      CHARACTER          │
│                         │
│   bubble safe region    │
└─────────────────────────┘
```

The exact bubble layout belongs to the presentation layer.

The camera needs to know only the required exclusion zones.

---

# 32. NARRATOR SAFE AREA

If the Ship Computer occupies a persistent narrator position, the camera should respect that region.

It should not repeatedly crop or overlap it.

The narrator's visual presence is part of the staging grammar.

---

# 33. ALIEN LENS

The monitor may function as an important staging target.

Possible compositions:

```text
TWO SHOT
Hunky + Dory + monitor

MONITOR EMPHASIS
monitor + reactions

REACTION SHOT
character watching monitor
```

The camera does not decide which composition is interesting.

The Director specifies emphasis.

---

# 34. SHIP COMPUTER

If the Ship Computer is visually present, the camera treats it as an ordinary stage participant.

Possible framing:

```text
full scene
Ship Computer corner presence
close reaction
monitor-style insert
```

It should not automatically receive camera attention merely because it speaks.

---

# 35. VISUAL HIERARCHY

A shot should have:

```text
PRIMARY
SECONDARY
BACKGROUND
```

The Director specifies the intended hierarchy.

The camera executes it through:

- framing
- scale
- position
- crop
- focus where applicable

The renderer does not invent hierarchy.

---

# 36. NO AUTO-CINEMATICS

Do not implement rules such as:

```text
speaker → zoom
emotion → close-up
movement → tracking shot
important line → camera shake
```

These are attractive in demos and harmful in a deterministic authoring system.

They turn explicit direction into hidden behavior.

---

# 37. NO CAMERA HUMOR

The camera must not independently create jokes.

Reject:

- surprise zooms without direction
- Dutch angles without purpose
- random pans
- accidental framing gags
- camera shake as generic emphasis

If a camera move is funny, the Scene Director should have staged it.

---

# 38. CALIBRATION SCENE

Before production scenes, calibrate the camera using:

```text
Hunky
Dory
cockpit background
one monitor
one speech bubble
```

Test:

- two-shot
- close-up
- profile
- monitor composition
- bubble clearance
- narrator clearance
- silhouette readability
- relative scale

The calibration scene becomes the baseline for regression.

---

# 39. VERIFICATION

Technical camera gate:

- [ ] all targets resolve
- [ ] all shot types resolve
- [ ] framing constraints pass
- [ ] character visibility passes
- [ ] bubble safe area passes
- [ ] narrator safe area passes
- [ ] screen direction is valid
- [ ] timing uses host clock
- [ ] camera is deterministic
- [ ] replay is possible
- [ ] no hidden auto-cinematics occur

---

# 40. EXTERNAL EVALUATION

Technical validity is not visual success.

The external critic should evaluate:

### Composition

- Is attention clear?
- Is the frame balanced?
- Is the important relationship visible?

### Character

- Are silhouettes readable?
- Is face acting visible?
- Is Hunky/Dory scale distinction preserved?

### Staging

- Does the camera support the scene?
- Is movement necessary?
- Are holds effective?

### KFB visual language

- Does the shot feel authored?
- Is it too slick?
- Is it too generic?
- Does it preserve the hand-made / graphic staging language?

The camera system does not score itself.

---

# 41. FAILURE MODES

### F1: Auto-Zoom

**Symptom:** every important line triggers a zoom.

**Repair:** remove automatic semantic camera rules.

### F2: Camera Addiction

**Symptom:** camera moves continuously.

**Repair:** make STATIC the default.

### F3: Crop Drift

**Symptom:** ears, silhouettes or bubbles are cut.

**Repair:** enforce safe-area constraints.

### F4: Scale Flattening

**Symptom:** Hunky and Dory lose their intended size relationship.

**Repair:** preserve canonical framing relationship.

### F5: Gaze Mismatch

**Symptom:** character looks somewhere the composition does not explain.

**Repair:** validate target visibility or explicitly mark off-screen target.

### F6: Hidden Staging

**Symptom:** renderer decides framing based on emotion or dialogue.

**Repair:** move decision into Scene Director / contract.

### F7: Cinematic Slop

**Symptom:** generic pushes, pans and cuts make every scene look like an AI-generated trailer.

**Repair:** use fewer, more intentional camera actions.

---

# 42. MINIMAL CAMERA CONTRACT

```yaml
camera:
  shot_id: shot_01

  shot: medium_two_shot

  framing:
    emphasis: Dory
    scale: 1.0

  target:
    type: pair_midpoint
    actors:
      - Hunky
      - Dory

  movement:
    type: static

  transition:
    type: cut
```

The actual coordinate solution belongs to the camera runtime.

---

# 43. DIRECTOR → CAMERA EXAMPLE

```yaml
scene_plan:

  camera_intent:
    shot: medium_two_shot
    emphasis: Dory
    movement: none

  beats:

    - id: b01
      actor: Hunky
      action: look_at
      target: Dory

    - id: b02
      actor: Dory
      action: hold_gaze
      target: Hunky
```

The camera does not infer a close-up from Dory's gaze.

It holds the requested two-shot.

---

# 44. CAMERA → RENDERER

The renderer receives resolved state:

```yaml
camera_state:
  projection: orthographic

  position: [...]
  target: [...]

  viewport:
    x: 0
    y: 0
    width: 1920
    height: 1080

  scale: 1.0
```

The renderer should not need to know:

```text
why Dory is important
```

It only needs the final camera state.

---

# 45. ACCEPTANCE CHECKLIST

A camera module passes when:

- [ ] it uses the shared host
- [ ] it has no private clock
- [ ] it has no uncontrolled randomness
- [ ] shot decisions originate upstream
- [ ] target references are explicit
- [ ] shot vocabulary is finite
- [ ] static framing works
- [ ] camera movement is deterministic
- [ ] timing is deterministic
- [ ] screen direction is stable
- [ ] character scale relationship is preserved
- [ ] bubble safe areas are respected
- [ ] narrator safe area is respected
- [ ] Alien Lens compositions work
- [ ] Ship Computer can be staged
- [ ] camera state is inspectable
- [ ] replay is possible
- [ ] calibration scene exists
- [ ] host integration passes
- [ ] external evaluation remains separate

---

# 46. FINAL ARCHITECTURE

```text
SCENE DIRECTOR
      │
      │ "medium two-shot,
      │  emphasize Dory,
      │  hold"
      ▼
EXECUTION CONTRACT
      │
      ▼
CAMERA
      │
      │ resolved coordinates
      ▼
RENDERER
```

Alongside:

```text
SCENE DIRECTOR
      │
      ▼
CHARACTER PERFORMANCE
      │
      ▼
CHARACTER RIG
```

Both converge only at presentation.

---

# 47. FINAL RULES

```text
DIRECTOR CHOOSES THE SHOT.

CAMERA CHOOSES THE COORDINATES.

RENDERER RENDERS THE VIEW.

STATIC IS A VALID CAMERA ACTION.

MOVEMENT REQUIRES A REASON.

GAPS AND HOLDS ARE PART OF COMPOSITION.

GAZE TARGETS MUST REMAIN LEGIBLE OR EXPLICITLY OFF-SCREEN.

BUBBLE SPACE IS STAGING SPACE.

CHARACTER SCALE IS CANONICAL.

NO AUTO-ZOOM.

NO AUTO-CINEMATICS.

NO CAMERA HUMOR.

NO HIDDEN STAGING.

VALIDATION ≠ EVALUATION.

CAMERA DOES NOT DIRECT ITSELF.
```

Camera & Staging is therefore the **visual framing execution layer** between explicit directorial intent and deterministic rendering.
