# CONCEPT · Wissens-Pilli WS0 Standalone Demo

**Target:** `micro-learning/wissens-pilli`  
**Format:** frameless 16:9 Flexikon / article embed  
**Primary demo:** Virus / Retrovirus  
**Core idea:** topic-agnostic themed background + Wissens-Pilli + 1–n animated learning cards + optional media card.

---

## 1. Scene hierarchy

```text
BACKGROUND THEME
  image / upload / later video
      ↓
WISSENS-PILLI + CARD STAGE
      ↓
1–n CARD SLIDER / MEDIA
      ↓
ONE ACTIVE CTA
      ↓
completion → Anki / PDF / Sources
```

The medical topic is primarily set by:
- background URL
- uploaded background
- card content pack
- optional media

The 3D stage itself remains reusable.

---

## 2. Background contract

Support in WS0:

```json
{
  "background": {
    "type": "image",
    "src": "...",
    "fit": "cover",
    "position": "center",
    "dim": 0.25,
    "blur": 0
  }
}
```

Also allow user upload through a local object URL.

Later:
- looping video background
- gradient / color presets

Hard rule:
background never reduces card readability.

Use automatic dim / vignette behind text-heavy cards.

---

## 3. Main composition

Recommended desktop composition:

- Wissens-Pilli: lower-left or lower-right, roughly 25–32% stage width
- active card: central / opposite side, roughly 52–62% width
- cube: small in-world prop near lower edge
- progress: six subtle points or cube state
- tiny sound/reset controls in corner

No app chrome.

No nested panel frame.

---

## 4. Card slider

The runtime accepts `1..n` cards.

Only one card is primary at a time.

Transitions:
- next card approaches from depth / side
- active card settles
- old card leaves to learned / retry stack
- Pilli follows movement with gaze
- Pilli presents with one short gesture
- then Pilli settles into a lull so the user can read

Slider logic should be deterministic, not carousel UI.

---

## 5. One CTA rule

At every beat, there is one obvious next action.

Examples:

### Recall card
`Antwort zeigen`

### After reveal
`Weiter`

### Single choice
the answer options are the only active controls

### Multiple choice
selections + one `Prüfen`

### Video
`Abspielen`

### After video
`Frage beantworten`

Never show:
- Back
- Next
- Hint
- Export
- Settings
- More
all simultaneously.

---

## 6. Micro-interaction hints

Use visual affordance instead of instructions:

- current answer option lifts 2–4 px on hover
- next CTA pulses once, not continuously
- card gives slight anticipatory tilt before flip
- Pilli looks at target before user acts
- cube rotates slightly when progress changes
- correct answer docks / settles
- wrong answer springs back or shakes once
- bubble pointer clearly anchors to Pilli

No casino motion.

---

## 7. Typography

Use **Roboto** throughout learner UI.

Recommended responsive hierarchy:

- card headline: `clamp(24px, 2.2vw, 36px)`
- question / core text: `clamp(20px, 1.7vw, 28px)`
- answer options: `clamp(18px, 1.35vw, 24px)`
- speech bubble: `clamp(18px, 1.25vw, 22px)`
- utility labels: 14–16px

Rules:
- short line length
- high contrast
- generous spacing
- avoid text on busy background
- no tiny HUD text
- no more than one explanatory paragraph per card

---

## 8. TTS

WS0:
- browser SpeechSynthesis is sufficient
- starts only after user gesture
- voice toggle persists during run
- Pilli mouth animation is amplitude/state-based, not phoneme-perfect
- speech bubble shows the same short script

TTS should not read long answer lists by default.

Priority:
question / explanation / transition line.

---

## 9. Lulls

Critical behavior rule:

> Pilli performs, then gets out of the way.

During reading:
- very slow breath
- occasional blink
- smooth pupil tracking
- tiny gaze shifts
- no body bounce
- no chatter
- no particle emission
- no looping sound

Pointer tracking:
- smoothed
- clamped
- dead zone around center
- slower than mouse
- card gaze can temporarily override pointer gaze

After user action:
- one reaction
- follow-through
- recovery
- lull

---

## 10. Six demo card types

1. Recall / Anki flip
2. Single choice
3. Multiple choice
4. Image hotspot
5. Sequence
6. Media / video

All card types share:
- ID
- prompt
- answer
- explanation
- tags
- source
- export front/back
- optional Pilli script
- optional background override

---

## 11. Retrovirus content demo

Recommended WS0 story:

### Card 1 — Recall
“What is the genetic material of a retrovirus?”

### Card 2 — Single choice
“What does reverse transcriptase do?”

### Card 3 — Multiple choice
“Which structures / enzymes are part of the retroviral replication cycle?”

### Card 4 — Hotspot
Select RNA / envelope / receptor in the supplied visual.

### Card 5 — Sequence
Attachment → fusion/entry → reverse transcription → integration → expression → assembly/budding.

### Card 6 — Media
Short replication-cycle clip followed by one transfer question.

The purpose is to demonstrate card forms, not teach the whole Virus article.

---

## 12. Media / YouTube recommendation

For WS0, the **preferred production-safe demo** is:

> turn the current Retrovirus replication visualization into a short self-hosted MP4/WebM clip.

Advantages:
- visual continuity
- no third-party UI
- no embed policy dependency
- controllable length
- no unrelated recommendations / branding
- reusable in PDF / future exports

If a real YouTube card must be proven technically:
- support a replaceable `youtubeId`
- render YouTube as a DOM iframe inside / over the 3D card frame
- do not attempt to use YouTube as a WebGL video texture
- treat the external video as placeholder until editorial / rights review

A suitable temporary content placeholder is the widely viewed “Retrovirus Replication 3D Animation” video (HIV example), but it should not become the production dependency without rights/editorial approval.

---

## 13. Cards / board-game prop language

Use the current KFB asset registry / Asset Librarian to select the exact board-game card / tile donor.

Requirements for Wissens-Pilli cards:
- landscape orientation
- shallow 3D thickness
- readable rounded rectangle silhouette
- front content surface
- optional back
- supports flip / tilt / stack animation

Do not invent an asset filename if the Asset Librarian has not verified it.

If the KayKit BoardGameBits pack does not contain the exact needed landscape card:
- reuse its scale/material language
- build one simple rounded cuboid procedurally
- keep the donor pack as visual reference

---

## 14. 3D cube

Use the verified existing Ugur die:

`media/3D_Assets/dice_ugur_lowpoly.glb`

WS0 roles:
- six-card progress
- card-type reveal
- difficulty state
- optional run-start roll

Recommended:
progress first.

Avoid making the cube a second menu system.

---

## 15. Pilli moderation

Each card can define 0–3 short presenter beats:

```json
{
  "presenter": {
    "intro": "Mal sehen, ob du das noch weißt.",
    "correct": "Genau.",
    "wrong": "Fast. Schau auf den Informationsfluss.",
    "outro": "Weiter."
  }
}
```

Keep Pilli concise.

Pilli is guide / “Erklärbär”, not a stand-up host.

---

## 16. Theme content pack

Illustrative:

```json
{
  "schema": "doccheck.wissens-pilli.module/0.1",
  "id": "retrovirus-demo",
  "title": "Retrovirus",
  "theme": {
    "background": {
      "type": "image",
      "src": "..."
    }
  },
  "cards": [],
  "completion": {
    "anki": true,
    "pdf": true,
    "sources": true
  }
}
```

Later the same runtime can load:
- atherosclerosis
- EKG
- antibiotic classes
- anatomy
- customer product training
- CME-like quiz content

---

## 17. Animation contract for Design assembly

Design does not re-author Pilli.

It consumes:
- Studio actor config
- later Animation Lab semantic states

For WS0 before Animation Lab is final, implement only simple procedural placeholder motion:
- idle breath
- blink
- pointer gaze
- card gaze
- talk bob
- correct hop
- wrong squash
- think lean
- celebrate hop
- fail particle burst

These motions must obey the KFB cartoon-animation skill:
- anticipation
- readable main action
- impact / emphasis
- follow-through
- recovery
- return to lull

---

## 18. Assembly order

### A. Studio
Prepare actor contract.

### B. Animation Lab
Author / validate semantic procedural motions.

### C. Design
Assemble final learner runtime:
- background
- Pilli
- cards
- cube
- typography
- CTA logic
- TTS
- exports

Do not replace current Retrovirus visualization by adding another full UI around it.

The new demo is a **new runtime composition**.

---

## 19. WS0 done definition

WS0 is successful when:
- background can be URL or upload
- 1–n cards load from JSON
- all six demo card types work
- Pilli presents and reacts
- mouse pupil tracking works
- lulls are visible
- Roboto typography is readable at embed size
- only one CTA is active at a time
- cube communicates progress
- media card works
- Anki export works
- PDF export works
- no double UI shell appears
