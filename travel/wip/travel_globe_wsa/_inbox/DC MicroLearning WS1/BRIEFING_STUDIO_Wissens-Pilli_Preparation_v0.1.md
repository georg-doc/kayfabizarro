# BRIEFING · Studio Preparation · Wissens-Pilli v0.1

**Target project:** `georg-doc/kayfabizarro/micro-learning/wissens-pilli`  
**Owner of this slice:** KFB FrankenStein / Rigging Studio  
**Next consumer:** Wissens-Pilli WS0 runtime, later KFB Animation Lab  
**Primary host asset:** CapsuleCarl  
**Goal:** prepare a stable, machine-readable presenter actor for a standalone 16:9 learning embed.

---

## 1. Mission

Prepare **Wissens-Pilli** as a reusable 3D presenter actor.

Studio does **not** build the learning app, cards, TTS engine or final animations.

Studio owns:

- CapsuleCarl source verification
- face ownership and cleanup
- eye / pupil / lid setup
- mouth ownership and anchor
- material / difficulty color zones
- damage prop toggles
- speech-bubble anchor
- gaze targets
- body deformation-safe setup
- exportable actor configuration
- visual QA

Animation Lab later consumes this prepared actor for procedural motion.

The WS0 learner runtime consumes the actor as a presenter.

---

## 2. Source state already measured

The current Animation Lab handover reports CapsuleCarl as:

- one static mesh
- ~4.8k triangles
- no skeleton
- no animation clips
- one material
- 21 separable mesh islands
- original pupil candidates are measurable as separate mirrored islands
- arrows and metal plates are separable islands
- mouth ownership still requires explicit measurement / decision

Do not invent a skeleton merely because the character must move.

For WS0, a static body plus procedural cartoon deformation is preferred.

---

## 3. Hard owner rule

There must be **one owner per visible facial system**.

Choose and document:

### Eyes
Use the KFB eye rig as the runtime eye owner.

Before hiding original eye/pupil geometry:
- verify candidate islands visually
- save before/after screenshots
- do not delete source geometry destructively

### Mouth
Measure whether the original mouth cavity / lips / teeth are isolated geometry.

Then choose exactly one path:

**A. Original mouth is usable**
- retain it
- define animation range / states

**B. KFB mouth module becomes owner**
- flatten / hide conflicting original mouth geometry
- define one mouth anchor and rest plane
- do not render both systems

The runtime may use simple talk states for WS0; full viseme work is not required here.

---

## 4. Face / eye contract

Prepare:

- eye center L/R
- pupil safe radius
- lid fit
- brow anchor L/R if brows remain
- gaze neutral
- gaze card-left / card-right
- gaze user / camera
- pointer-tracking safe range
- blink capability
- surprised / thinking / happy / sad or equivalent minimal emote states

The uploaded KFB actor contract may be used as a **vocabulary donor**, not as literal CapsuleCarl measurements.

Useful donor concepts:
- blink gaps
- pupil tracking
- emote IDs
- `attend`
- `talk`
- `notice`
- `agree`
- `disagree`
- `celebrate`
- `think`

Do not copy Graft Driver face coordinates.

---

## 5. Pointer tracking

Studio must expose enough data for runtime pointer tracking.

Required output:

```json
{
  "gaze": {
    "maxX": 0.0,
    "maxY": 0.0,
    "deadZone": 0.0,
    "smoothTime": 0.0,
    "cardTargets": {
      "left": [0,0,0],
      "center": [0,0,0],
      "right": [0,0,0]
    }
  }
}
```

Exact values are measured in Studio.

Desired behavior later:
- pupils track mouse/pointer slowly
- no twitching
- use dead zone + smoothing
- during card presentation, gaze may prefer the card
- during explanation, gaze may return to the user

---

## 6. Difficulty color zones

Prepare a reversible body-color system.

Recommended semantic slots:

- `basic`
- `intermediate`
- `advanced`
- `neutral`

Do not hard-wire final colors into geometry.

Use material parameters / actor profile.

Suggested initial palette for later runtime:
- Basic: mint / green
- Intermediate: amber
- Advanced: DocCheck red
- Neutral: warm pill color

Studio should prove that recoloring:
- preserves face contrast
- preserves metal plates / arrows
- does not recolor eyes / mouth unintentionally

---

## 7. Damage / repair props

CapsuleCarl's arrows and metal plates are valuable game-state props.

Studio should:

- identify each separable damage island
- assign stable IDs
- expose visibility toggle
- expose local transform
- preserve source transform
- allow staged damage / repair

Example:

```json
{
  "damageProps": [
    {
      "id": "plate-front-01",
      "visibleDefault": false,
      "position": [0,0,0],
      "rotation": [0,0,0],
      "scale": [1,1,1]
    }
  ]
}
```

Do not build physics.

The runtime only needs deterministic show / hide / small transform animations.

---

## 8. Speech bubble anchor

Define one canonical bubble anchor above / beside Pilli.

Export:

- anchor position
- preferred bubble side
- safe face exclusion rectangle / sphere
- optional card-aware alternate anchor

The bubble belongs to the learner runtime, not Studio.

Studio only measures where it should attach.

---

## 9. Body deformation contract

Because CapsuleCarl has no skeleton, WS0 should use a **simple cartoon deformer**.

Studio must prepare a deformation-safe rest state.

The body deformation layer may later support:

- squash / stretch
- lean
- bend
- recoil
- settle / overshoot
- small hop
- tiny body bob during speech emphasis

Studio should define:
- body deformation center
- protected face region
- protected eye rig
- protected mouth region
- maximum safe X/Y/Z scale
- maximum safe bend / tilt before face distortion

Do **not** author final motion clips in Studio.

---

## 10. Animation-Lab handoff vocabulary

Later Animation Lab should receive semantic triggers, not Studio-specific slider states.

Minimum vocabulary:

- `attend`
- `greet`
- `notice`
- `presentCard`
- `talk`
- `think`
- `correct`
- `wrong`
- `repair`
- `damage`
- `celebrate`
- `fail`

Every event must return to `attend`.

No perpetual fidget loop.

---

## 11. Lulls are intentional

The actor must have a readable quiet state.

Target idle behavior:

- slow breathing / volume shift
- occasional blink
- very small weight / tilt drift
- slow pupil drift or pointer tracking
- no permanent bounce
- no constant mouth motion
- no continuous particles
- no constant sound

After an action:
- reaction
- short recovery
- calm reading lull

The learner must be able to read the card without Pilli competing for attention.

---

## 12. Card / presenter staging anchors

Studio should expose three world-space or actor-relative look targets:

- `card-left`
- `card-center`
- `card-right`

Optionally:
- `cube`
- `user-camera`

Wissens-Pilli does not hold cards with hands.

Cards float as separate stage objects.

---

## 13. Cube relation

The six-sided Ugur cube is a separate scene prop, not part of the actor mesh.

Studio only needs:
- optional gaze target
- optional presentation direction

No cube animation or game logic in Studio.

---

## 14. Deliverables

Place additive outputs under:

```text
micro-learning/wissens-pilli/
  actor/
    wissens-pilli.actor.json
    wissens-pilli.anchors.json
    wissens-pilli.states.json
    README_STUDIO.md
```

If a derivative GLB is truly required, add it only as a non-destructive derivative:

```text
actor/wissens-pilli-runtime.glb
```

Prefer config + source reference over copying geometry.

---

## 15. Proposed actor JSON

```json
{
  "schema": "kfb.wissens-pilli.actor/0.1",
  "source": {
    "repo": "georg-doc/kayfabizarro",
    "asset": "CapsuleCarl"
  },
  "face": {
    "eyeOwner": "kfb-eye-rig",
    "mouthOwner": "TBD_AFTER_MEASUREMENT"
  },
  "gaze": {},
  "bubbleAnchor": {},
  "damageProps": [],
  "difficultyMaterials": {},
  "deformer": {
    "center": [0,0,0],
    "protectedFace": {},
    "safeScale": {},
    "safeBend": {}
  },
  "semanticStates": [
    "attend",
    "greet",
    "notice",
    "presentCard",
    "talk",
    "think",
    "correct",
    "wrong",
    "repair",
    "damage",
    "celebrate",
    "fail"
  ]
}
```

---

## 16. Visual QA

Capture at minimum:

- front
- 3/4 left
- 3/4 right
- side
- eyes neutral
- maximum pointer gaze
- blink
- mouth rest
- mouth talk-open
- one difficulty recolor
- all damage props individually
- body max safe squash
- body max safe lean

Check:
- no pupil clipping
- no lid clipping
- mouth remains readable
- deformer does not tear face
- plate / arrow IDs correspond to visible props
- bubble anchor does not cover eyes
- gaze can visibly move to card and user

---

## 17. Acceptance gate

Studio is done when the next consumer can instantiate Wissens-Pilli from config and can:

1. recolor difficulty
2. move pupils safely
3. blink
4. open / close mouth
5. target card and user gaze
6. show / hide damage props
7. attach speech bubble
8. apply safe squash / lean / recoil to the body
9. return to a clean neutral rest state

No learning runtime required for Studio PASS.
