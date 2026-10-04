# DocCheck Interactive Microlearning — Living Design Document

**Status:** Living Document  
**Version:** 0.1  
**Date:** 2026-09-10  
**Purpose:** Additive working document for the current concept/design exploration. This document is intended to be expanded during the session and later handed off as a consolidated briefing to Claude Design / Fable Five.

---

## 0. Working principle

This document is **additive**. New ideas, decisions, rejected directions, interaction patterns, technical references and prototype concepts should be appended or refined without silently replacing earlier useful material.

The goal is not to produce isolated one-off mini-games, but to discover a **reusable interaction language and lightweight runtime for embedded DocCheck medical microlearning SPAs**.

Target context:

- DocCheck News articles
- customer channels / sponsored content
- DocCheck posts
- Flexikon articles
- other DocCheck content surfaces that can embed Single Page Applications
- later reuse for product training and simple assessment modules

Core constraints:

- no LLM calls required
- no heavy backend
- single-page web apps
- fast-loading and embeddable
- modern browser technologies allowed
- Three.js / WebGL where spatiality or spectacle adds genuine value
- should work as a 1–3 minute interaction
- medical content first, but with real game-feel and visual polish
- DocCheck visual identity rather than generic edtech/game aesthetics

---

# 1. Product hypothesis

The strongest direction is not “quiz + illustration”, but a family of small interactive learning objects in which **the interaction itself expresses the medical concept**.

Working formula:

> **Explore → Do → Check → Take away**

A module should ideally let a user:

1. **Explore** a system or object with almost no friction.
2. **Do** one meaningful manipulation that embodies the subject.
3. **Check** understanding with a compact transfer task.
4. **Take away** the learned material, optionally as Anki-compatible cards.

The product should feel more like a small playable scientific exhibit than a conventional e-learning slide.

---

# 2. Design goals

## 2.1 Primary goals

- 90 seconds to 3 minutes per module
- understandable without tutorial walls
- useful even when encountered incidentally inside an article
- interaction should reinforce the medical model
- strong visual easing / “juicy” feedback without arcade excess
- pleasant enough to click “just because it is there”
- reusable across multiple subjects
- suitable as a technology showcase for modern embedded web experiences

## 2.2 Explicit non-goals

Avoid:

- generic multiple-choice screens as the core experience
- “illustrated text” disguised as interaction
- point/coin/badge systems unless they serve a real purpose
- heavy story layers
- mandatory avatars that constantly talk
- backend-dependent progression
- LLM-generated tutoring as a requirement
- 3D used merely as decoration
- sloppy one-shot SVG illustrations with weak visual consistency

---

# 3. DocCheck visual / interaction language

Reference supplied: **Recherchi v4** with the 3D cube pet.

Useful qualities to carry forward:

- clean DocCheck editorial UI around a more playful central object
- recognizable DocCheck red / green accents
- white and light-grey surfaces
- compact controls
- soft 3D object with rounded geometry
- personality through eyes / face / motion rather than large amounts of copy
- a clear contrast between “editorial interface” and “playable object”
- restrained, professional environment with one visually memorable interactive centerpiece

The cube-pet principle is useful beyond a literal mascot:

> **One object may carry the delight; the surrounding UI stays calm.**

This is likely a stronger DocCheck signature than making the entire page game-like.

---

# 4. Existing benchmark: Retrovirus replication cycle

Uploaded reference: `retrovirus-replikationszyklus.html`

## 4.1 What already works

The prototype is a good **minimum interaction benchmark**:

- nine discrete replication steps
- direct click targets in the diagram
- synchronized step list
- progressive focus / fading of previous and future steps
- back / forward
- autoplay
- “show all”
- keyboard navigation
- no backend
- responsive structure
- easy embedding

It already demonstrates a useful baseline:

> A Flexikon-style static diagram can become an explorable sequence with almost no infrastructure.

## 4.2 Why this is not yet the target quality

It remains primarily:

> **interactive explanatory graphic**

rather than:

> **playable learning object**

The user mostly selects and reads. There is little manipulation, prediction, reconstruction, consequence or challenge.

The next generation should therefore preserve its simplicity but add one central game-like action, for example:

- reorder stages
- route a viral component
- assemble the virion
- place enzymes at the correct replication step
- block the cycle with an antiviral drug
- identify which step is disrupted

This makes the medical mechanism itself interactive instead of merely navigable.

---

# 5. Source-content opportunities from current Flexikon articles

The current candidate articles naturally represent different **content geometries**. This is useful because we should not force every subject into the same mechanic.

## 5.1 Herz

The Flexikon heart article contains rich material across:

- chambers
- valves
- outer and inner anatomy
- blood supply / coronary arteries
- conduction system
- blood flow
- physiology
- clinical links

This makes “heart” a strong **spatial / assembly / flow** showcase.

Potential module families:

- Build the Heart
- Blood Flow Routing
- Valve Logic
- Coronary Territory Map
- Conduction Board
- chamber / vessel identification
- later bridge to EKG trainer

## 5.2 Antibiotikum

Antibiotics are especially suitable for **target / classification / mechanism / resistance** interactions.

Potential dimensions:

- antibiotic classes
- cellular target
- mechanism of action
- bactericidal / bacteriostatic
- spectrum
- resistance mechanism
- selected clinical use cases

This content can become a reusable “Arsenal / Target Board” mechanic.

## 5.3 Virus + Virusklassifikation

Virus content is naturally suited to:

- classification
- deduction
- assembly
- lifecycle
- replication logic

Candidate mechanics:

- Baltimore sorting
- genome-property deduction
- envelope / capsid / genome builder
- host-cell route
- lifecycle ordering
- antiviral interruption

The existing retrovirus prototype can serve as **Level 0** of this family.

## 5.4 Citratzyklus

The citric acid cycle is a strong **process / machine / resource-flow** use case.

Instead of static pathway memorization:

- complete missing substrates
- place enzymes / cofactors
- activate one reaction at a time
- track NADH / FADH2 / GTP / CO2 output
- visually “run” the cycle after completion
- challenge mode: repair a broken cycle

This is currently one of the strongest candidates for the first visual showcase because the subject benefits directly from motion and causal feedback.

---

# 6. Reusable interaction grammar — initial set

The system should develop a small set of reusable verbs rather than bespoke mechanics for every article.

Initial grammar:

### 1. Explore
Rotate, zoom, hover, reveal, isolate.

Best for:
- anatomy
- cells
- molecules
- devices

### 2. Sort
Drag items into categories.

Best for:
- virus classification
- antibiotic classes
- differential groups
- taxonomy

### 3. Match
Connect item ↔ target / mechanism / consequence.

Best for:
- drug ↔ receptor
- pathogen ↔ feature
- structure ↔ function

### 4. Build
Assemble a system from parts.

Best for:
- heart
- virion
- nephron
- pathway

### 5. Route
Guide something through a system.

Best for:
- blood flow
- conduction
- nephron transport
- metabolism

### 6. Sequence
Put stages into a correct order.

Best for:
- viral lifecycle
- coagulation
- cellular processes
- diagnostic workflow

### 7. Block
Place an inhibitor / lesion / drug and observe where the process stops.

Best for:
- antibiotics
- antivirals
- coagulation
- signaling pathways

### 8. Balance
Manipulate variables until a physiological state is reached.

Best for:
- acid-base
- electrolytes
- ventilation
- osmolality

### 9. Trace
Follow a signal, molecule, impulse or anatomical route.

Best for:
- cardiac conduction
- cranial nerves
- circulation
- pathways

### 10. Repair
A system contains errors; user restores it.

Best for:
- citric acid cycle
- anatomy labels
- treatment pathways
- broken classifications

### 11. Predict
Manipulate one variable and predict the outcome before seeing it.

Best for:
- physiology
- pharmacology
- hemodynamics
- acid-base

### 12. Reveal
Progressively uncover a structure or answer.

Best for:
- morphology
- radiology
- histology
- anatomy

These verbs can later become actual runtime module types.

---

# 7. Three-layer runtime model

Reusable modules should separate:

## CONTENT

Medical facts, labels, relations, values and accepted solutions.

Example:

```js
content = {
  entities: [],
  relations: [],
  hints: [],
  cards: []
}
```

## MECHANIC

Defines what the learner does.

Examples:

```js
type: "sort"
type: "assembly"
type: "route"
type: "sequence"
type: "repair"
```

## PRESENTATION

Defines how it is rendered.

Examples:

- DOM / CSS
- SVG
- Canvas
- WebGL
- Three.js scene
- particle layer
- audio layer
- camera behavior

This separation is important because the same content should potentially support more than one learning interaction.

---

# 8. Learning-flow template

Recommended default module dramaturgy:

## Stage 1 — Discover

Duration: ~20–40 s

No scoring.

User may:

- manipulate object
- reveal structures
- see names / functions
- understand the visual grammar

Purpose:

> eliminate tutorial friction and create curiosity

## Stage 2 — Play

Duration: ~30–90 s

One principal mechanic only.

Examples:

- assemble
- sort
- route
- block
- repair

Purpose:

> actively construct the concept

## Stage 3 — Prove it

Duration: ~20–40 s

Compact transfer test:

- 2–4 placements
- mini-sequence
- structure identification
- one prediction
- one short MC item if appropriate

Purpose:

> verify that the learner can reproduce the logic rather than merely watch it

## Stage 4 — Take away

Optional.

Output:

- completion state
- key learning points
- retry
- Anki-compatible export

---

# 9. Progression language

Avoid conventional mobile-game gamification such as:

- coins
- XP inflation
- trophy cabinets
- badge spam
- leaderboard logic

Prefer **completion as progression**.

Examples:

```text
Explore ●
Build   ●
Check   ○
```

or:

```text
Fragment → System → Mastered
```

The subject itself can visually become complete over the course of the module.

Example heart:

1. Anatomy assembled
2. Blood flow activated
3. Conduction activated
4. Final object is a complete beating heart

The reward is comprehension plus a satisfying finished system.

---

# 10. “DocCheck Juice” — motion and feedback language

The goal is strong interaction feedback without arcade aesthetics.

Preferred micro-interactions:

- magnetic snap
- small overshoot after correct placement
- tiny rotation alignment toward a socket
- spring-back after incorrect placement
- soft depth shift
- camera focus / dolly toward relevant structure
- brief highlight travelling along a biological pathway
- component begins to function after correct placement
- subtle particles that represent meaningful flow
- small pulse / scale impulse
- optional restrained sound
- completed system visibly “comes alive”

Core principle:

> Feedback should communicate what the system understood, not merely celebrate that the user clicked.

Avoid:

- confetti
- giant checkmarks everywhere
- screen shake
- slot-machine effects
- loud arcade sounds
- generic “Great job!” popups

---

# 11. Avatar / character principle

A mini-avatar may be useful, but should not become a conventional speaking tutor.

Better role:

> **functional companion / affordance**

Possible uses:

- rides on a molecule through a pathway
- acts as a probe inside anatomy
- points at the currently manipulable structure
- pulls a wrong card back
- reacts silently to a correct or incorrect move
- becomes an in-world cursor or tool

The Recherchi cube-pet reference suggests that personality can live in one small object while the rest of the interface remains editorial and restrained.

This should remain optional per module.

---

# 12. Showcase concepts — first pool

## A. Citric Cycle Machine

**Type:** Process / machine / repair  
**Renderer:** 2D, 2.5D or lightweight Three.js  
**Core mechanic:** Complete and activate the cycle.

Possible flow:

1. Explore animated stations.
2. Place missing metabolites / cofactors.
3. Run the completed cycle.
4. Answer 2–3 transfer tasks.
5. Export key cards.

Why promising:

- motion adds genuine explanatory value
- turns a memorized diagram into causal machinery
- strong visual payoff after completion

---

## B. Build the Heart

**Type:** Spatial / assembly  
**Renderer:** Three.js  
**Core mechanic:** Build / inspect / activate.

Possible stages:

1. place chambers / large vessels
2. route blood flow
3. activate conduction system

Payoff:

> assembled model becomes a beating, functioning system

---

## C. Cardiac Conduction Board

**Type:** Route / block / predict  
**Renderer:** simplified heart + optional EKG mini-strip

User:

- traces impulse
- blocks a node or bundle
- predicts consequence
- sees resulting conduction pattern

Strong bridge between anatomy and the existing EKG tools.

---

## D. Antibiotic Arsenal

**Type:** Target / block / resistance  
**Renderer:** 2D / 2.5D bacterial cell

User drags antibiotic classes onto functional targets.

Correct target triggers a meaningful cellular effect.

Second stage may introduce resistance cards:

- enzyme destruction / modification
- efflux
- target alteration
- permeability changes

The same mechanic can later be reused for customer product training.

---

## E. Virus Sorting Lab

**Type:** Classification / deduction  
**Renderer:** 2D or 3D scanner / specimen tray

The user infers the class from genome properties.

Possible dimensions:

- DNA / RNA
- ss / ds
- polarity
- envelope
- replication strategy

Ideal showcase for converting taxonomy into an actual deduction game.

---

## F. Retrovirus: Break the Cycle

Evolution of the uploaded benchmark.

Instead of only navigating the nine steps:

1. explore lifecycle
2. reconstruct shuffled lifecycle
3. place viral enzymes
4. apply a drug / inhibitor to the correct step
5. identify resulting blocked process

This is a particularly useful test because an existing baseline already exists.

---

## G. Coagulation Network

**Type:** Network / flow / block  
**Renderer:** graph-based or custom animated pathway

User activates or blocks nodes and sees downstream consequences.

Potential later relation to anticoagulants.

---

## H. Acid–Base Mixer

**Type:** Balance / predict  
**Renderer:** sliders + animated system representation

User manipulates:

- pCO2
- HCO3-
- pH relation

Challenge examples:

- create respiratory acidosis
- restore compensation
- identify disorder from values

Less visually spectacular, but an excellent proof that the same framework can support quantitative physiology.

---

# 13. Anki / takeaway layer

Anki should not be the primary game mechanic.

Preferred role:

> **learning residue after the interaction**

Possible output:

- all core cards
- only incorrectly answered concepts
- only user-bookmarked concepts
- “My 5 weak points”

Recommended first implementation:

- TSV / CSV export compatible with Anki import

Later:

- direct `.apkg` generation if robust enough client-side

Potential card schema:

```js
{
  front: "...",
  back: "...",
  tags: ["doccheck", "citric-cycle", "level-1"],
  source: "Flexikon: Zitratzyklus"
}
```

---

# 14. Technical direction

## 14.1 Base shell

Preferred:

- standalone HTML / CSS / JavaScript
- minimal dependencies
- no mandatory build system for simplest modules
- embed-safe
- responsive
- touch + mouse
- keyboard where appropriate
- `prefers-reduced-motion`
- deterministic local state

## 14.2 Rendering options

### DOM / CSS / SVG

Use where:

- text precision matters
- interaction is card / label based
- simple diagrams
- low rendering cost

### Canvas / game runtime

Use where:

- many animated elements
- particles
- arcade-like movement
- continuous visual feedback

### Three.js

Use where:

- anatomy is genuinely spatial
- rotation matters
- assembly benefits from depth
- camera movement explains relationships
- 3D object itself is the central exhibit

Rule:

> 3D is a content affordance, not a mandatory branding effect.

## 14.3 Hybrid preferred

Likely best pattern:

```text
DOM UI
+
Three.js / Canvas central stage
+
CSS / Web Animations microfeedback
```

This preserves accessibility and editorial cleanliness while allowing one polished visual centerpiece.

---

# 15. Runtime / content-pack hypothesis

Long-term direction:

> **DocCheck Interactive Runtime + Content Packs**

Illustrative structure:

```js
module = {
  meta: {},
  theme: {},
  stages: [],
  entities: [],
  interactions: [],
  challenges: [],
  cards: []
}
```

Example classification stage:

```js
{
  type: "classification",
  items: [],
  targets: [],
  successRule: {}
}
```

Example assembly stage:

```js
{
  type: "assembly",
  model: "heart",
  parts: [],
  sockets: []
}
```

Example pathway stage:

```js
{
  type: "pathway",
  nodes: [],
  edges: [],
  movableItems: []
}
```

This is not a commitment to build a framework immediately.

It is a **design constraint for prototypes**:

> when we discover a good mechanic, design it so that its content could later be swapped.

---

# 16. Initial production dramaturgy

Do not jump directly to a finished framework.

## WS0 — Interaction / visual exploration

Goal:

- discover the strongest interaction grammar
- explore DocCheck game-feel
- test 2D vs 2.5D vs 3D
- test motion / easing / feedback
- investigate usable libraries and open examples
- no final medical product required

## WS1 — Three vertical showcases

Suggested spread:

### Showcase 1 — PROCESS
Citric Cycle Machine

### Showcase 2 — SPACE
Build the Heart / Conduction Board

### Showcase 3 — SYSTEM
Antibiotic Arsenal

This deliberately demonstrates three different interaction geometries rather than three variations of drag-and-drop.

## WS2 — Reusable shell extraction

Only after successful showcases:

- identify common stage flow
- standardize controls
- standardize completion state
- define content schema
- extract reusable feedback / animation helpers

## WS3 — Production-ready embedded module

Take one successful showcase and harden it for real article embedding:

- mobile
- resize behavior
- performance
- accessibility
- reset
- analytics hooks if required
- loading / failure state
- host-page compatibility

---

# 17. Fable Five exploration principle

Do **not** start with:

> “Build an interactive learning game about the citric acid cycle.”

That invites conventional edtech output.

Preferred exploration prompt direction:

> Explore a visual interaction language and reusable microgame grammar for embedded DocCheck medical learning SPAs. Do not design the final product first. Prototype interaction mechanics, spatial metaphors, transitions, feedback behavior and rendering approaches. The experience should sit between scientific interactive, microgame and editorial infographic.

After the interaction language is established, medical content is mapped onto it.

---

# 18. Questions for the current brainstorming session

Items to decide or explore next:

1. Which 10–15 interaction verbs deserve to become the permanent DocCheck microgame grammar?
2. Should a common mini-avatar exist across modules, or only when mechanically useful?
3. How much of Recherchi’s soft 3D / cube-pet language should become system-wide?
4. How much article text/context should remain visible while the SPA is running?
5. Should the default module open in “Explore” or immediately give the user a task?
6. What does the compact embedded viewport look like on Flexikon?
7. Is Anki export a showcase feature or a later production feature?
8. Which of the three first showcases is best for demonstrating actual editorial/product value to management?
9. Which open-source game / visualization libraries are mature enough for vibe-coded production without excessive framework complexity?
10. Which elements must be templated from the beginning, and which should remain bespoke during exploration?

---

# 19. Current recommended next discussion

The most useful next step is to define the **microgame grammar** more rigorously.

For each candidate mechanic we should specify:

- medical content types it fits
- 30–90 second core loop
- input gesture
- success/failure feedback
- visual payoff
- reusable implementation pattern
- accessibility fallback
- whether 3D adds value
- candidate Flexikon topics

This will turn the current idea pool into an actual design system rather than a list of mini-game pitches.

---

# 20. Source / reference set for this exploration

Current editorial/content references:

- https://flexikon.doccheck.com/de/Herz
- https://flexikon.doccheck.com/de/Antibiotikum
- https://flexikon.doccheck.com/de/Virus
- https://flexikon.doccheck.com/de/Virusklassifikation
- https://flexikon.doccheck.com/de/Zitratzyklus

Provided project references:

- Screenshot of current Flexikon article context
- Screenshot of Recherchi v4 with 3D cube pet
- `retrovirus-replikationszyklus.html`

---

## Change log

### v0.1 — 2026-09-10

Initial consolidation of:

- product hypothesis
- article embedding context
- DocCheck / Recherchi visual direction
- existing retrovirus benchmark
- four-layer design model
- Explore → Do → Check → Take away flow
- initial microgame grammar
- showcase pool
- Anki strategy
- technical approach
- runtime/content-pack hypothesis
- staged production plan
- open questions for continued riffing



---

# 21. Conceptual refinement: from “mechanics” to interaction choreography

## 21.1 Important shift from the current discussion

The next design step should **not** begin by defining a taxonomy of sophisticated game mechanics.

The more useful framing is:

> **The “game” lives primarily in the interaction choreography, not in cognitive challenge.**

The user should often be able to progress with almost no deliberation.

The intended feeling is closer to:

- guided onboarding
- FarmVille-style click loops
- simple cooking / assembly mini-games
- tactile “click → response → next affordance” sequences
- playful manipulation of already-present learning content

than to:

- puzzle games
- complex rule systems
- strategy
- deep resource management
- difficult knowledge testing

The learning challenge can remain conventional and lightweight:

- single choice
- multiple choice
- Anki-style recall
- matching
- ordering
- simple categorisation

What makes the module feel game-like is the **way these actions are staged, animated and chained together**.

---

## 21.2 Core principle

A useful default rule:

> **The user should almost always know what to do next without reading instructions.**

Possible guidance devices:

- one object pulses
- one card rises slightly
- one slot lights up
- one component wiggles
- one path glows
- the camera subtly reframes
- an object magnetically attracts toward a valid target
- the next actionable object becomes visually salient after the prior step

The interaction flow should feel self-explanatory and almost inevitable.

This is closer to a **guided playable sequence** than an open-ended game.

---

# 22. New preferred flow model

The previous “Explore → Do → Check → Take away” model remains useful, but the central “Do” stage should be specified more precisely.

Recommended experiential flow:

> **Click → Create / Reveal → Combine / Build → See consequence → Check → Take away**

This can often happen in only three major beats.

## Beat 1 — Click / Reveal

The user performs the obvious first action.

Examples:

- click a metabolite
- tap an antibiotic class
- open a 3D card
- rotate a heart
- select a virus
- click a glowing cell component

Immediate reward:

- object moves
- camera reacts
- hidden layer appears
- structure opens
- an element is spawned or “picked up”
- the next possible action becomes visible

No knowledge test is required yet.

---

## Beat 2 — Combine / Build

The user combines one or more elements.

This is the main “toy-like” moment.

Examples:

- drag antibiotic onto bacterial target
- insert a metabolite into the cycle
- combine genome type + envelope + replication mode
- place heart structures into position
- stack or merge two knowledge cards
- select the two components that belong together

The system should strongly guide the valid action.

Incorrect actions should usually:

- spring back
- wobble
- refuse connection
- give a tiny non-verbal hint

rather than punish the user.

---

## Beat 3 — Consequence / Completion

The assembled system visibly does something.

Examples:

- citric acid cycle begins to turn
- bacterial wall ruptures
- ribosome stops
- blood starts flowing
- conduction path lights up
- virion assembles
- a classification object transforms into its resolved category

This consequence is the **primary reward**.

Only after this payoff should a concise knowledge check appear.

---

# 23. The role of conventional learning formats

Single choice, multiple choice and Anki-style cards remain important, but they should be treated as the **boring reliable substrate**, not necessarily as the visible game concept.

They can appear:

- before an interaction as prediction
- inside the interaction as a selectable component
- after the interaction as verification
- at the end as exportable learning residue

The goal is not to reinvent multiple choice.

The goal is to **wrap standard learning primitives in a much stronger spatial, animated and tactile experience**.

---

# 24. 3D cards as a baseline, not the ambition ceiling

A simple implementation could already use:

- 3D cards in space
- smooth flips
- depth transitions
- front/back Anki logic
- cards moving into slots or collections
- stacking / fanning / rotating

This is useful as a baseline because:

- it maps directly to familiar medical learning behaviour
- it can be templated easily
- it supports many content types
- it is visually more engaging than flat flashcards

However, it should be considered the **conservative fallback**.

The stronger direction is to let cards become **objects or ingredients in the medical interaction**.

Examples:

- antibiotic card turns into a molecular “tool” and docks at a target
- virus-property cards combine into a classified virion
- citrate-cycle cards become machine components
- anatomy cards become draggable 3D parts
- answer cards physically build the final structure

Thus:

> **Card → object → action → consequence**

instead of:

> **Card → flip → next card**

---

# 25. Cooking-game analogy as a useful design reference

The cooking-game analogy is particularly useful because it demonstrates the right degree of simplicity:

1. A recipe / target is visible.
2. Ingredients are already available.
3. The user selects or combines them.
4. The system animates the preparation.
5. A recognisable result appears.
6. The next small task begins.

There is minimal conceptual friction.

Medical translation examples:

### Antibiotics

“Recipe”:
Stop bacterial protein synthesis.

Ingredients:
- macrolide
- beta-lactam
- fluoroquinolone

User chooses the correct tool.

Result:
ribosome visibly stops translating.

### Citric acid cycle

“Recipe”:
Generate the next reaction step.

Ingredients:
- substrate
- enzyme
- cofactor

User combines the obvious highlighted components.

Result:
the reaction fires and products emerge.

### Virus classification

“Recipe”:
Resolve the virus class.

Ingredients:
- genome type
- strandedness
- polarity
- envelope

User adds attributes stepwise.

Result:
the specimen transforms into the correct class / family slot.

### Heart

“Recipe”:
Complete pulmonary circulation.

Ingredients:
- chamber
- valve
- vessel

User connects highlighted parts.

Result:
flow animation starts.

---

# 26. Preferred interaction characteristic: guided, not difficult

A useful target is:

> **low cognitive friction, high perceptual reward**

The user should rarely become stuck.

The learning outcome comes from:

- repetition
- spatial association
- causal animation
- reconstruction
- recognition
- short recall

not from solving a hard puzzle.

This is especially important in the embedding context because the user did not necessarily arrive wanting to “play a game”.

The artifact must earn attention immediately.

---

# 27. New design term: “Playable Onboarding”

A strong internal concept for the format is:

> **Playable Onboarding for medical knowledge**

This captures the desired behaviour better than “mini-game”.

The module behaves like a product onboarding flow:

- one obvious next action
- progressive disclosure
- immediate visual feedback
- no manual
- short sequence
- satisfying completion

But the object being onboarded is a **medical concept**.

This framing may be especially useful for Claude Design / Fable Five because it discourages unnecessary game-system invention.

---

# 28. Default 3-step interaction dramaturgy

For first prototypes, a standard three-step structure may be enough:

## Step A — Trigger

One clearly highlighted interaction.

> “Touch this.”

## Step B — Construct

One or more elements are combined, routed, placed or selected.

> “Put these together.”

## Step C — Resolve

The medical system visibly reacts and the takeaway becomes obvious.

> “See what that means.”

Then optionally:

## Check

One conventional question or 2–3 rapid checks.

## Take away

Anki / save / replay / next micro-module.

This should be the default before designing more complex game loops.

---

# 29. Implication for Fable Five exploration

The first exploration should focus less on “inventing game mechanics” and more on:

- choreography
- affordances
- camera movement
- object behaviour
- tactile feedback
- transitions
- guided sequencing
- visual transformation
- how standard learning interactions become spatial and animated

The task is therefore closer to:

> “Invent a reusable interaction language for playable medical onboarding.”

than:

> “Invent mini-games for medicine.”

---

# 30. Prototype evaluation criteria — revised

Each prototype should be judged primarily on:

1. **Is the next action immediately obvious?**
2. **Does clicking/manipulating feel satisfying?**
3. **Does the visual response teach something about the medical concept?**
4. **Is there a visible completion or transformation payoff?**
5. **Can the entire interaction be understood within seconds?**
6. **Can the core learning point be retained after 1–3 minutes?**
7. **Can the same interaction shell be reused with different content?**
8. **Does it feel like DocCheck, not generic edtech or mobile-game UI?**

Difficulty is explicitly **not** a primary success criterion.

---

# 31. Updated immediate next step

Before formalising a mechanics library, explore **3–5 interaction choreography prototypes** that all use the same simple learning substrate but present it differently.

Suggested exploration set:

### Prototype A — 3D Card Flow
Classic Anki logic, but spatial and animated.

### Prototype B — Ingredient / Assembly Flow
Cooking-game inspired combination of highlighted components.

### Prototype C — Click-to-Transform Flow
One object changes state after each guided interaction.

### Prototype D — Guided Route Flow
User advances an object through a system by clicking the next highlighted station.

### Prototype E — Build-and-Activate Flow
User assembles 2–4 parts; completed system begins to function.

These are not yet permanent mechanics. They are **interaction-language probes**.

The best-performing patterns can later become the reusable DocCheck microgame grammar.

---

## Change log

### v0.2 — 2026-09-10

Refined the concept after discussion:

- shifted focus away from sophisticated game mechanics
- established interaction choreography as the primary “game” layer
- introduced “low cognitive friction, high perceptual reward”
- added Click → Create/Reveal → Combine/Build → Consequence flow
- positioned MC / Anki as reliable learning substrate rather than visible game concept
- introduced 3D cards as baseline/fallback
- added cooking-game analogy
- introduced “Playable Onboarding” as a useful working concept
- added revised 3-step dramaturgy
- revised prototype evaluation criteria
- proposed 3–5 interaction-language probes before formalising a mechanics library


---

# 32. Two-tier portfolio model: production modules + flagship mini-game slice

## 32.1 New strategic clarification

A very useful refinement is to split the briefing into **two levels** rather than forcing one format to do everything.

## Level A — Interactive Micro-Learning (production-near)

This is the format most likely to go into regular production.

Characteristics:

- short embedded SPA
- 1–3 minutes
- low cognitive friction
- guided interaction
- article-adjacent learning reinforcement
- no heavy backend
- reusable runtime potential
- medically focused
- calm DocCheck UI with one delightful interactive core

This level is the practical, scalable, article-compatible format.

## Level B — Showcase / Flagship Mini-Game

This is one layer above the production baseline.

Characteristics:

- still embeddable, but more spectacle-driven
- stronger game identity
- more cartoon logic
- more moment-to-moment motion
- more explicit game verbs such as steering, shooting, collecting, dodging or repairing
- visually richer 3D stage or pseudo-3D side-scroller
- still short and simple, but more “this is a mini-game” than “this is a microlearning interaction”

This level is useful as:

- showcase for management
- proof of technical ambition
- reusable inspiration source
- visual benchmark for how far DocCheck SPAs can go
- potential template for future sponsored/product-training experiences

This split is important because it prevents overloading the core production format while still allowing a more playful exploration lane.

---

# 33. Recommended framing for the two levels

## Level A

Internal framing:

> **Playable medical onboarding**
> or
> **interactive micro-learning slice**

Goal:

> Reinforce understanding of a concept embedded in article context.

## Level B

Internal framing:

> **Medical mini-game slice**
> or
> **DocCheck playable showcase**

Goal:

> Deliver a short, memorable, game-like interaction that still teaches a concept, but is allowed to lean harder into spectacle, motion and metaphor.

---

# 34. The blood-vessel side-scroller concept

## 34.1 Initial reaction

The idea is good — especially as a **Level B flagship slice**, not as the core production template.

Why it is promising:

- immediately understandable
- visually memorable
- well suited to landscape / desktop embed
- compatible with article contexts on atherosclerosis, vascular disease, thrombosis, blood components, inflammation or cardiovascular prevention
- a strong bridge between medical education and playful web spectacle
- allows the use of existing asset libraries
- a clear candidate for Three.js or 2.5D rendering
- can demonstrate that embedded DocCheck SPAs are not limited to static quizzes or infographic widgets

The key is to keep it **short, guided and visually clean** rather than turning it into a real shooter game.

---

## 34.2 Working concept

Working title:

> **Nano Mission: Bloodstream Patrol**
> or
> **Artery Run**
> or
> **Plaque Patrol**

Core fantasy:

The player pilots a tiny nano-drone through a blood vessel. The vessel is stylised, cross-sectional, readable and slightly cartooned, with flowing erythrocytes and other recognizable blood elements. Along the vessel wall, plaque deposits or other pathological obstacles appear. The player clears or interacts with them through a very simple shooting / cleaning / targeting mechanic.

This sits somewhere between:

- side-scroller
- rail shooter
- guided educational ride
- light action toy

---

# 35. Why this concept works

## 35.1 Strong affordance

The player immediately understands:

- I am inside a vessel.
- Things are moving.
- I can steer or aim.
- These deposits / threats are relevant.

No heavy explanation needed.

## 35.2 Natural learning hooks

The same system can teach several ideas without long text:

- vessel narrowing
- plaque growth
- blood-flow obstruction
- red blood cells as background flow
- thrombus / embolus
- inflammation or immune response
- stent / intervention metaphors
- effect of risk factors or treatment choices

## 35.3 Built-in “juicy” reward layer

The concept naturally supports:

- satisfying impact feedback
- plaque chunks breaking away
- vessel lumen widening
- flow improving
- small debris effects
- streaking red cells / particles
- soft camera parallax
- cel-shaded assets
- clean destruction without gore

This gives a strong showcase payoff.

---

# 36. Important caution: metaphor vs medical correctness

The shooter concept must be handled carefully.

We should not imply literally:

> “atherosclerosis is solved by shooting plaque off the wall.”

So the framing must be slightly stylised and educational.

Possible interpretations:

## Option A — diagnostic / inspection drone

The drone scans, tags, clears visualized “simulation nodes” or pathological overlays rather than literally destroying human tissue.

## Option B — educational metaphor

The experience is explicitly a stylised teaching metaphor, not a real intervention.

## Option C — intervention fantasy with debrief

The mini-game can include a short wrap-up that translates the simplified play into the real medical meaning.

This matters if the module is placed next to serious article content.

---

# 37. Best use case for the vessel-shooter slice

This concept is most appropriate for:

- atherosclerosis / arteriosclerosis
- coronary heart disease
- peripheral arterial disease
- thrombosis / embolism basics
- blood components / circulation basics
- prevention / risk-factor explainers
- customer education on vascular products or therapies

It is less suitable for very abstract biochemistry or taxonomic content.

---

# 38. Suggested scope: keep it a “guided rail experience”

The safest version is not free movement in a large game space.

Recommended structure:

## Format

- landscape
- 60–120 seconds
- side-scrolling or forward-moving rail sequence
- 3 short segments / levels
- optional end summary / mini-check

## Core verbs

- steer slightly up/down
- aim with strong assist
- click / tap to clear or tag targets
- collect one or two beneficial pickups
- optionally trigger one contextual tool (e.g. anti-inflammatory pulse, plaque dissolver, scan mode)

## Reduced complexity

Avoid:

- precision platforming
- difficult collision demands
- fast arcade difficulty
- long level progression
- many weapon types
- complicated HUD

This should feel like a guided medical attraction, not a hardcore action game.

---

# 39. Example 3-level dramaturgy for the vessel game

## Level 1 — Healthy flow / orientation

Purpose:

- establish setting
- teach the player what a vessel looks like
- introduce erythrocytes, plasma flow and vessel wall
- teach the main input

Player actions:

- move slightly
- tag a healthy vessel structure
- clear one obvious deposit or obstacle
- collect one info token

Takeaway:

> Normal lumen and smooth endothelium enable good flow.

## Level 2 — Plaque buildup

Purpose:

- show narrowing
- introduce plaque / endothelial damage
- make the main shooting / clearing interaction meaningful

Player actions:

- remove highlighted plaque obstacles
- identify one harmful factor
- optionally choose a correct “tool”

Takeaway:

> Plaque narrows the lumen and disturbs flow.

## Level 3 — Critical event / rescue

Purpose:

- show danger of severe stenosis or thrombosis
- increase pace slightly
- create climax

Player actions:

- clear obstructive elements
- avoid or mark a thrombus
- restore a visible flow corridor
- answer one quick concluding question

Takeaway:

> Severe narrowing or thrombus formation can critically impair perfusion.

Then:

- summary card
- 2–3 Anki cards
- replay or next module

---

# 40. Learning layer for the vessel game

Even the more game-like Level B format should still resolve into clear learning outcomes.

A simple pattern:

## During play

Tiny on-stage knowledge moments:

- labels pop in briefly
- scan pings reveal terms
- one-line hints appear
- important structures glow

## After each micro-segment

One compact “anchor statement”, e.g.:

- “Plaques form in the intima.”
- “Reduced lumen increases flow resistance.”
- “A thrombus can suddenly obstruct the vessel.”

## At the end

One of:

- 2–3 quick checks
- 3 take-home cards
- “What did you just see?” summary
- export / save key facts

Thus the game layer remains connected to the educational purpose.

---

# 41. Art direction for the vessel game

## 41.1 Visual language

Recommended:

- readable tubular environment
- stylised cross-section
- soft, rounded vessel geometry
- cel shading or cartoon-textured materials
- clean, clear reds / pinks / creams / plaque-yellows
- recognisable erythrocytes floating in depth
- occasional leukocyte / platelet silhouettes if useful
- moderate parallax for depth
- no photorealism
- no gore
- polished, toy-like clarity

This should feel like:

> medical clarity + playful stylisation

not:

> realistic surgery sim

## 41.2 DocCheck consistency

Keep around the game stage:

- calm DocCheck shell
- compact top or bottom UI
- limited text on screen
- restrained colors outside the play scene
- optional small cube-pet / guide integration only if helpful

The game scene can be richer, but the surrounding interface should remain in-family.

---

# 42. Technical interpretation options

## Option 1 — 2.5D side-scroller (likely best)

- lane-based or free slight vertical motion
- layered backgrounds
- sprite/mesh hybrids
- easiest to make feel polished quickly

## Option 2 — Forward rail through a vessel

- pseudo-first-person or chase-cam
- more immersive
- potentially heavier and harder to control

## Option 3 — Cross-sectional belt / conveyor metaphor

- less literal movement
- easier mechanically
- still visually interesting

Current recommendation:

> Start with a **2.5D side-scroller / rail-shooter hybrid**.

This is ambitious enough for a showcase, but still manageable.

---

# 43. Relation between Level A and Level B

These two levels should inform each other.

## What Level A teaches Level B

- how to keep learning objectives clear
- how to structure a 1–3 minute loop
- how to keep UX self-explanatory
- how to turn knowledge into action cues

## What Level B teaches Level A

- how much motion / spectacle the platform can support
- what asset language works
- what kind of delight fits DocCheck
- how far Three.js / 3D can be pushed inside embeds
- which game-feel patterns may be worth simplifying into production modules

So the flagship game is not a detour; it is a **design laboratory one step above production**.

---

# 44. Suggested briefing structure for Claude / Fable Five

The future briefing should explicitly contain two workstreams:

## Workstream A — Production-Oriented Interactive Micro-Learning

Deliverables:

- exploration of reusable interaction language
- 2–3 production-near microlearning prototypes
- guided, low-friction flows
- article-embedded use cases

## Workstream B — Flagship Playable Mini-Game

Deliverables:

- one higher-ambition showcase slice
- stronger game identity
- 3D/2.5D spectacle
- still short and educational
- example candidate: blood-vessel side-scroller / nano-drone shooter

This two-lane structure should produce both:

- realistic production value
- inspirational upper-bound exploration

---

# 45. Production caution

The vessel-shooter concept is strong, but should remain a **slice**, not a promise of a full game platform.

Important production boundaries:

- 1 vessel environment only
- 3 micro-levels max
- very few input verbs
- no full inventory
- minimal UI
- one medical learning goal per slice
- deterministic scripted encounters
- no backend dependency
- desktop-first, mobile-adapted if feasible

The magic comes from polish and staging, not breadth.

---

# 46. Updated immediate next exploration options

After this discussion, there are now two sensible next steps.

## Path 1 — continue with Level A

Refine the production-near interaction language and select 2–3 showcase microlearning formats.

## Path 2 — concept-shape the Level B mini-game

Define the blood-vessel shooter slice more concretely:

- fantasy / framing
- core loop
- level beats
- asset needs
- UI shell
- medical learning goal
- visual language
- what counts as success

Most likely the eventual briefing should include both paths.

---

## Change log

### v0.3 — 2026-09-10

Added:

- two-tier portfolio model
- separation between production microlearning and flagship mini-game slice
- blood-vessel side-scroller / nano-drone concept
- rationale, cautions and best-fit use cases
- example 3-level dramaturgy
- art direction notes
- technical options
- relationship between Level A and Level B
- briefing recommendation with two workstreams


---

# 47. Cardiology flagship slice — strategic direction

## 47.1 Decision

The flagship playable slice should now be developed from a **cardiology / vascular perspective**, centered on:

- atherosclerosis
- plaque burden and lumen narrowing
- vessel-wall layers as a medically legible environment
- interventional logic
- balloon / stent deployment as the dramatic payoff
- short, guided, game-like interaction in a stylised but cardiologically recognizable form

This is a strong choice because it combines:

- intuitive visual space
- recognisable pathology
- meaningful progression
- strong spectacle potential
- clear learning outcome
- translational value for customers, CME-like explainers, product training and cardiology-adjacent editorial use

The concept should remain a **flagship slice**, not a full simulation platform.

---

# 48. Working concept: interventional artery mini-game

## 48.1 Working title options

- **Plaque Patrol**
- **Artery Run**
- **Nano Mission: Stent Rescue**
- **Inside the Artery**
- **Cath Lab Mini**

Recommended tone:

- playful
- clean
- medically respectful
- cartooned, but not silly
- no gore
- no “arcade disease destruction” tone

The metaphor can lean toward:

> a stylised micro-interventional educational ride

rather than pure shooter fantasy.

---

## 48.2 Core fantasy

The player controls a tiny nano-drone / cath-lab-inspired intervention craft travelling through a stylised artery.

Inside the vessel, the player:

1. orients within the blood vessel environment
2. encounters plaque-related narrowing
3. clears or tags the most obvious obstructive elements
4. reaches a critical stenosis
5. deploys a stent in a guided final step
6. sees improved lumen and restored flow

This makes the climax not merely “shooting plaque”, but a **recognizable interventional resolution**.

That is likely more cardiologically satisfying and medically more grounded.

---

# 49. Medical grounding for the visual concept

## 49.1 Required medical recognizability

Even in stylised form, the scene should make a cardiologist immediately feel:

> “This is cartooned, but it understands the underlying anatomy and intervention logic.”

Therefore the following should be conceptually legible:

### Vessel wall layering

At least in simplified form, the artery wall should suggest:

- **Tunica intima**
- **Tunica media**
- **Tunica adventitia**

This does not require microscopic realism.

But it should be visually structured so that plaque is clearly associated with the **intimal / subintimal side**, not just random wall debris.

### Plaque / stenosis logic

The pathology should imply:

- eccentric or concentric plaque burden
- progressive narrowing of the lumen
- disturbed / reduced passage
- surface irregularity
- optional late-stage complication such as thrombotic superstructure

Again, this can be stylised, but the spatial logic must remain correct.

### Blood components

The lumen may contain:

- flowing erythrocytes as the main visual stream
- occasional platelets or leukocyte-like accents if helpful
- visual distinction between free-flowing blood and fixed wall pathology

### Interventional endpoint

The final solution should resemble the basic logic of:

- lesion crossed
- vessel prepared / visualised
- stent deployed
- stent expands against the wall
- lumen becomes more patent
- flow visibly improves

The stylisation may be cartooned, but the **deployment narrative** should feel credible.

---

# 50. Important design rule: educational metaphor, not literal procedure training

The module should not pretend to be an interventional cardiology simulator.

It should communicate:

- atherosclerotic narrowing
- why reduced lumen matters
- the idea of restoring vessel patency
- the basic role of a stent

It should not attempt:

- exact cath-lab workflow simulation
- device-specific realism
- procedural nuance
- complex complications
- operator-level decision training

A helpful mental model is:

> **medically literate toy model of angioplasty + stenting**

That is the correct ambition level.

---

# 51. Proposed 3-act flagship loop

## Act 1 — Enter the vessel / understand the space

### Learning goal
Understand healthy vessel structure and blood flow.

### Player experience
The player enters a healthy or mildly changed artery segment.

Visible / learnable elements:

- flowing erythrocytes
- central open lumen
- layered vessel wall
- one or two brief labeled scan moments

Interaction:

- very light steering
- a ping / scan pulse
- optional removal or marking of one small soft obstacle
- camera settles into the stage

Narrative function:

> orientation, wonder, low-friction onboarding

---

## Act 2 — Encounter plaque / worsening stenosis

### Learning goal
Understand how plaque reduces lumen and impairs flow.

### Player experience
The artery narrows; plaque deposits become obvious.

Visible / learnable elements:

- intimal plaque growth
- lumen narrowing
- wall irregularity
- reduced open channel
- perhaps sluggish local flow

Interaction:

- the drone clears, tags or destabilises highlighted obstructive elements
- simplified target-assist or lock-on
- optional “scan reveals layers” moment
- possibly identify a culprit area

Narrative function:

> pathology becomes visible and actionable

Important:

This act may include some satisfying plaque-fragment or debris effects, but these should read as stylised educational feedback, not violent tissue destruction.

---

## Act 3 — Critical lesion / guided stent deployment

### Learning goal
Understand the basic purpose and effect of a stent.

### Player experience
A short severe-stenosis segment forms the climax.

Interaction sequence:

1. approach the lesion
2. stabilise / prepare the site
3. position the stent delivery system
4. trigger deployment
5. watch the stent expand
6. see restored vessel lumen and improved flow

Visual payoff:

- stent opens cleanly
- vessel lumen enlarges
- blood flow becomes visibly easier
- the environment brightens / clears
- the final scene becomes the completion reward

This should be the signature moment of the flagship slice.

---

# 52. Why stenting is the right climax

The stent finale improves the concept in four ways:

## 1. Medical clarity
The player sees not only “disease exists”, but also:

> a recognisable intervention changes vessel patency.

## 2. Better dramaturgy
The climax becomes more than repeated shooting. It gains a build / deploy / reveal beat.

## 3. Better visual design
A stent can be a beautiful animated object:
- mesh expansion
- compression / release
- radial opening
- contact with the wall
- clear before/after contrast

## 4. Better learning retention
The end state is memorable:
- narrowed vessel before
- deployed stent
- restored lumen after

That is an ideal educational image.

---

# 53. Recommended gameplay tone

The experience should be:

- guided
- forgiving
- spectacle-led
- short
- tactile
- never frustrating
- desktop-first in landscape
- plausible with mouse or touch

The player should feel:

> “I am inside a vessel, I can do something meaningful, and I understand what changed.”

The player should not feel:

> “I am being tested on cardiology under arcade pressure.”

---

# 54. Suggested control model

Keep controls extremely light.

## Preferred model

- slight up/down movement or lane-switching
- pointer-assisted targeting
- click / tap to act
- one contextual “tool” button if needed
- auto-forward motion or rail-based movement

Avoid:

- full 360° control
- complex aim
- multiple weapons
- difficult timing windows
- resource/inventory systems

The stent deployment should be largely guided, almost ceremonial:

- align
- confirm
- deploy
- watch result

This is more satisfying and more embed-friendly than deeper control complexity.

---

# 55. Minimal medical content payload

The module should teach a few strong truths, not the whole of vascular medicine.

Recommended core takeaways:

1. **Atherosclerotic plaque develops in the vessel wall and narrows the lumen.**
2. **Relevant stenosis impairs blood flow.**
3. **A thrombotic or critical lesion can acutely worsen the situation.**
4. **A stent is used to keep the vessel open after deployment.**

Optional extension:

5. **Healthy endothelium and open lumen support smooth flow.**

Everything else is bonus material.

---

# 56. Visual design specification — high level

## 56.1 Environment

- stylised arterial tube in cross-sectional readability
- soft curvature
- clear depth but not visually chaotic
- layered vessel wall hinted through color/material zoning
- plaque masses readable as layered intimal protrusions
- open lumen readable at all times

## 56.2 Style

- 3D assets
- cel shading or semi-flat cartoon materials
- clean specular control
- readable silhouettes
- warm reds / pinks / flesh tones for vessel environment
- plaque in yellows / creams / pale calcific tones
- blood flow in deeper reds
- polished, modern WebGL feel

## 56.3 Motion

- constant blood-stream drift
- floating erythrocytes
- subtle parallax
- clear impact / tagging feedback
- satisfying stent deployment animation
- before/after flow contrast

## 56.4 UI shell

- restrained DocCheck frame
- compact status / stage indicators
- minimal text while playing
- optional summary panel after each act
- no large HUD clutter

---

# 57. Comparison to Level A

This flagship slice should deliberately sit one level above the production microlearning modules.

## Level A
- reusable
- lower production complexity
- article-near
- interaction-first
- lightweight

## Level B
- more bespoke
- more cinematic
- more asset-driven
- stronger “wow” factor
- still short and controlled
- serves as upper-bound exploration

This means the flagship slice should be designed with enough specificity to shine, without forcing all future production modules into the same complexity.

---

# 58. Recommended double-sprint structure

The user proposed a **double sprint** approach. This is the right production framing.

## Sprint A — Interactive Micro-Learning track

Goal:
Develop the production-near format.

Focus:
- reusable interaction language
- 2–3 microlearning prototype slices
- low-friction guided loops
- article embedding viability
- calm DocCheck design system
- content portability

Likely outputs:
- one pathway/process concept
- one anatomy/spatial concept
- one classification/targeting concept

This sprint defines the realistic production lane.

---

## Sprint B — Flagship Slice track

Goal:
Develop the high-ambition showcase module.

Focus:
- cardiology / atherosclerosis
- vessel traversal
- plaque / stenosis visualization
- guided action play
- stent deployment climax
- more bespoke 3D / gameplay staging
- upper-bound spectacle within embed constraints

Likely output:
- one polished, short arterial mini-game MVP

This sprint defines the aspirational lane.

---

# 59. Why parallel development makes sense

These two sprints should not block each other.

Parallelism is valuable because:

## The microlearning sprint provides:
- reusable UX lessons
- shell conventions
- article-context discipline
- realistic production constraints

## The flagship sprint provides:
- ambition
- asset language exploration
- 3D/staging experiments
- management-showcase value
- inspiration for future simplified modules

Together they form a stronger exploration portfolio than either lane alone.

---

# 60. Briefing recommendation for Claude / Fable Five

The briefing should now clearly contain:

## Part I — Systemic lane
Interactive micro-learning:
- reusable
- guided
- low-friction
- article-embeddable
- production-near

## Part II — Flagship lane
Cardiology mini-game:
- artery environment
- atherosclerosis / stenosis
- plaque encounter
- guided action mechanics
- stent deployment payoff
- medically literate stylisation
- 3D/cel-shaded spectacle
- MVP, not a full game platform

It is important to state explicitly that the flagship slice should be **conceptually clean and self-contained**, not dependent on building an editor or deep content-authoring pipeline first.

---

# 61. Production discipline

An important constraint from the discussion:

> do not over-micromanage sub-slices or overbuild authoring infrastructure before proving the concept.

This means:

- no artery editor
- no vessel construction toolkit first
- no multi-level content pipeline before the MVP
- no exhaustive histology detailing
- no attempt at full interventional fidelity

Instead:

- one clear medical concept
- one strong visual metaphor
- one short guided flow
- one polished MVP

This is the right balance between accuracy and speed.

---

# 62. Immediate next step recommended

The most useful next addition to the living document would be a **concrete concept sheet for the cardiology flagship slice** containing:

- title / fantasy
- educational promise
- 3-act loop
- player verbs
- visual anchors
- asset categories
- UI shell
- medical guardrails
- MVP boundaries
- stretch ideas

This can then be handed directly into the future Claude / Fable Five design sprint with minimal ambiguity.

---

## Change log

### v0.4 — 2026-09-10

Added:

- cardiology flagship direction
- artery / atherosclerosis / stent concept
- medical recognizability requirements
- vessel-wall and plaque logic
- 3-act cardiology mini-game loop
- stent deployment as climax
- recommended controls and tone
- double-sprint structure
- production discipline and MVP scope


---

# 63. Shared thematic foundation: cardiology as the first dual-track content domain

## 63.1 Decision

A strong next step is to use **cardiology / atherosclerosis as the common content base for both workstreams**:

- Level A: production-oriented Interactive Micro-Learning
- Level B: flagship playable mini-game

This creates useful synergies because the expensive part is not only rendering or coding. It is also:

- medical research
- didactic reduction
- terminology decisions
- visual abstraction
- learning-objective definition
- source curation
- medical review

If both tracks share the same domain, one research and content-preparation pass can feed both output levels.

This should be treated as a **shared content pack** rather than two unrelated products.

---

# 64. Proposed shared cardiology content pack

The first common pack should focus on:

> **Atherogenesis → Atherosclerosis → Consequences → Diagnosis → Intervention**

Core source articles currently in scope:

- Flexikon: Atherosklerose
- Flexikon: Atherogenese
- related consequence articles:
  - myocardial infarction
  - stroke
  - peripheral arterial disease
  - renal insufficiency
- related diagnostics:
  - ultrasound
  - angiography
  - laboratory markers
  - CT
  - MRI
- related interventions:
  - lifestyle modification
  - lipid lowering
  - antihypertensive therapy
  - antiplatelet therapy
  - bypass
  - angioplasty
  - stent

The content pack should be deliberately smaller than the full articles.

Recommended MVP knowledge map:

1. healthy artery
2. endothelial dysfunction
3. LDL entry into the intima
4. inflammatory response / foam cells
5. plaque formation
6. progressive luminal narrowing
7. plaque complication / thrombosis
8. downstream ischemic disease
9. modifiable risk factors
10. diagnostic visualization
11. treatment / prevention
12. PCI / stent as one interventional option

---

# 65. Pathology visual logic for both tracks

A shared visual model can support both the simpler microlearning slice and the flagship game.

## Vessel wall

Simplified but medically legible layers:

- lumen / endothelium
- tunica intima
- tunica media
- tunica adventitia

The didactic model should visually place atherosclerotic change primarily within / beneath the intimal side rather than depicting plaque as arbitrary material glued onto the lumen.

## Suggested pathology progression

### State 0 — Healthy artery
- smooth lumen
- thin intimal surface
- unrestricted flow

### State 1 — Endothelial dysfunction / lipid entry
- subtle endothelial irregularity
- LDL-like particles enter the subendothelial zone

### State 2 — Fatty streak
- macrophage / foam-cell accumulation
- early yellowish intimal lesion

### State 3 — Fibroatheroma
- larger lipid core
- fibrous cap
- clear luminal protrusion

### State 4 — Severe stenosis
- substantial lumen reduction
- disturbed flow becomes visually obvious

### State 5 — Complicated plaque
- cap disruption / thrombotic overlay as an optional climax state

This state sequence can become a reusable visual asset across both levels.

---

# 66. Level A cardiology microlearning — candidate 3-step slice

## Working concept: “Build an Atheroma”

This intentionally uses the same world and asset logic as the flagship game, but in a much simpler production format.

### Step 1 — Trigger / risk factor

The user sees a clean arterial cross-section and selects or clicks a modifiable risk factor.

Examples:
- smoking
- hypertension
- hypercholesterolemia
- diabetes
- inactivity / obesity

The interaction need not model individual risk quantitatively.

Instead it triggers a stylised endothelial dysfunction state.

### Step 2 — Build / reveal the lesion

Guided clicks progressively create:

- LDL entry
- inflammatory cell recruitment
- foam cells
- lipid core
- fibrous cap

The user essentially “builds” the lesion with obvious highlighted affordances.

No difficult puzzle is required.

### Step 3 — Resolve / consequence

The lumen visibly narrows.

A simple selector or click reveals one of the major consequence territories:

- coronary → myocardial infarction
- carotid / cerebral → stroke
- peripheral arteries → PAD
- renal circulation → renal impairment

Then one short check.

This module could function as the production-near sibling of the flagship game.

---

# 67. KISS interaction idea: modifiable risk-factor selector

The user’s proposed risk-factor interaction is strong precisely because it is simple.

Possible UI:

> **“What pushes the vessel in the wrong direction?”**

A row / wheel / dropdown of modifiable factors:

- smoking
- hypertension
- hypercholesterolemia
- diabetes
- obesity / inactivity
- hyperuricemia / gout if the source scope retains it

Selecting one causes a small but visually meaningful response in the vessel.

Important design principle:

Do **not** pretend that each selected risk factor produces a unique deterministic lesion morphology.

Instead:

- use each selection as an entry point into endothelial stress / atherogenic progression
- optionally vary the animation or explanatory line
- preserve the medically correct idea that these factors increase risk through different and overlapping pathways

This keeps the mechanism simple without inventing false causal precision.

---

# 68. Shared diagnostic side-quest module

A useful reusable side-quest for the same content pack could be:

> **“How do we see it?”**

The user switches between diagnostic “lenses”.

Possible tabs / tools:

- ultrasound
- angiography
- intravascular ultrasound
- CT
- MRI
- laboratory risk profile

Each tool changes the same stylised vessel into a different representation.

This could be a separate Level A module or a small optional side quest after the main slice.

The value is that it turns a static diagnostic list into a comparison experience.

---

# 69. Shared intervention side-quest module

Another modular side-quest:

> **“What changes the risk, and what treats the lesion?”**

Two zones:

### Prevention / risk reduction
- exercise
- nutrition / weight reduction
- smoking cessation
- blood-pressure control
- lipid lowering
- diabetes management

### Established vascular disease / intervention
- antiplatelet therapy in appropriate contexts
- angioplasty
- stent
- bypass

The interface should make the conceptual distinction visible:

> **risk modification is not the same as mechanically opening a stenotic vessel**

This is a useful educational point and prevents the game metaphor from collapsing all therapies into one action.

---

# 70. Completion package as a product feature

The “take away” layer should now be treated as a reusable module feature rather than a late afterthought.

Recommended completion state after all three microlearning levels:

## Option A — Anki export

Goal:

- provide ready-to-import cards
- preserve the article / module context
- let Anki users continue learning immediately

Recommended first technical implementation:

- TSV / CSV in Anki-friendly structure
- deterministic export
- no backend required

Potential fields:

```text
Front
Back
Tags
Source
Module
```

Example tags:

```text
doccheck
atherosclerosis
cardiology
flexikon
```

Later upgrade:

- direct `.apkg` package if robust client-side generation proves reliable

## Option B — PDF learning pack

For users who do not use Anki:

- 1–3 page compact learning sheet
- same visual identity as the module
- key concepts
- mini-diagram
- question / answer cards or foldable card layout
- source links
- optional QR back to the interactive module

The PDF should initially remain simple and reliable.

Interactive PDF features can be explored later, but should not be required for MVP.

---

# 71. Completion gating

A good lightweight rule:

> The downloadable learning pack becomes available after completing all three levels.

This produces a small completion incentive without adding artificial points.

Possible completion UI:

```text
3 / 3 complete

Take the knowledge with you:
[Anki cards]
[PDF]
[Replay]
```

Optional later personalization:

- “Export all cards”
- “Export only the questions I missed”
- “Export bookmarked concepts”

---

# 72. Source pack / further reading as a reusable module output

Each module should also support a compact **source package**.

Possible structure:

### Primary source
The host Flexikon article.

### Related Flexikon pages
The most relevant linked concepts.

### External references
A small, curated list of high-quality external sources where useful.

This source package can appear:

- after completion
- inside the PDF
- as metadata in exported cards
- as an expandable “Sources” area in the SPA

This is preferable to filling the interaction itself with citations.

---

# 73. Side-quest architecture

Side quests should be treated as **modular optional branches**, not as required parts of the core 1–3 minute loop.

Potential reusable side-quest types:

- risk-factor selector
- diagnostic lens
- treatment map
- consequence map
- terminology drill
- compare normal vs pathological
- Anki / PDF export
- source / further reading pack

This makes the format extensible without bloating the primary experience.

---

# 74. Separate creative side quest: virus-origin / gain-of-function satire

## 74.1 Conceptual note

A separate, non-DocCheck creative project around:

- laboratory-origin hypotheses
- gain-of-function research
- research governance
- EcoHealth Alliance / WIV funding history
- institutional incentives
- uncertainty and evidence disputes

could be satirically interesting.

However, the framing should **not** become a functional “build a killer virus” simulator or provide operational instructions for pathogen engineering.

A safer and arguably more interesting satirical design is:

> **“Build the Narrative / Investigate the Chain / Risk Lab”**

The player manipulates:

- funding links
- research proposals
- biosafety levels
- oversight failures
- public statements
- evidence cards
- uncertainty levels

rather than designing a pathogen.

Possible game form:

### “Origins Lab — Evidence Board”

The player receives cards such as:

- zoonotic evidence
- laboratory research evidence
- grant / funding relationships
- market data
- genomic arguments
- missing data
- intelligence assessments
- biosafety / oversight records

The player sorts them into:

- supports zoonotic spillover
- supports lab-associated incident
- ambiguous / contested
- missing evidence

This allows satire, institutional critique and cognitive dissonance without turning biotechnology into an instructional construction game.

---

# 75. Evidence status for the COVID-origin side quest

The concept should preserve a key distinction:

> Funding / research relationships and documented oversight problems are not the same thing as proof that SARS-CoV-2 was created in a laboratory or that a specific engineered feature caused the pandemic.

A responsible satire can still be very sharp if it distinguishes:

- what is documented
- what is inferred
- what remains contested
- what evidence is unavailable

This can itself become the gameplay.

The result may actually be more interesting than a simple advocacy game because the player experiences the ambiguity and institutional contradictions directly.

---

# 76. Shared template insight from this side quest

The virus-origin concept reveals a broader reusable format:

> **Evidence-board microgame**

Useful for:

- controversial medical history
- guideline changes
- research disputes
- diagnostic reasoning
- causality vs correlation
- pharmacovigilance
- media literacy

Core loop:

1. inspect evidence cards
2. place into claims / buckets
3. confidence meter changes
4. reveal missing evidence
5. compare final conclusion with source package

This belongs in the broader format library even if the SARS-CoV-2 satire remains a separate non-DocCheck project.

---

# 77. Updated dual-sprint production model

The two main sprints should now share one cardiology research/content foundation.

## Sprint A — Cardiology Interactive Micro-Learning

Recommended MVP family:

### Module A1 — Build an Atheroma
Guided atherogenesis interaction.

### Module A2 — Risk Factor Selector
Very simple click / select interaction affecting a shared artery scene.

### Module A3 — Consequences / Diagnostic Lens
Either:
- downstream disease map
or
- how atherosclerosis is visualised diagnostically

Completion:
- quick check
- Anki export
- PDF pack
- curated sources

## Sprint B — Cardiology Flagship Slice

### Artery Run / Plaque Patrol
- nano-drone
- side-scrolling vessel
- plaque / stenosis
- guided action
- final stent deployment
- same visual pathology model as Sprint A
- stronger 3D and game feel

Shared assets / research:
- vessel layers
- plaque progression
- risk factors
- consequences
- stent logic
- source package
- terminology

This maximises reuse while preserving two distinct ambition levels.

---

# 78. Recommended production order inside the double sprint

## Shared pre-pass

Before either prototype:

1. create cardiology knowledge map
2. define 8–12 learning statements
3. define medically correct visual abstraction
4. define common vessel / plaque states
5. collect / validate reusable assets
6. define source package

Then branch:

### Branch A
Build production-near microlearning.

### Branch B
Build the flagship game slice.

This should reduce duplicated research and contradictory visual decisions.

---

# 79. Updated recommendation

Cardiology / atherosclerosis should now be treated as the **first reference domain for the whole format system**.

Reasons:

- strong visual hierarchy
- clear progression
- spatial anatomy
- behaviour / risk factors
- pathology
- diagnostic imaging
- clinical consequences
- prevention
- intervention
- compatibility with both simple and game-like interaction levels

It is likely a better first systemic proof than virus classification because it supports more of the intended format spectrum within one coherent knowledge world.

Virus remains highly valuable as a second content domain, especially for:

- lifecycle
- classification
- evidence-board formats
- research-history / controversy side quests

---

## Change log

### v0.5 — 2026-09-10

Added:

- cardiology as shared thematic foundation for both tracks
- shared atherosclerosis / atherogenesis content pack
- common pathology state model
- Level A “Build an Atheroma” concept
- KISS modifiable risk-factor selector
- diagnostic and intervention side quests
- Anki + PDF completion package
- completion gating
- reusable source package
- modular side-quest architecture
- separate safe concept for SARS-CoV-2 origins / gain-of-function satire
- evidence-board mechanic
- revised double-sprint plan with a shared cardiology pre-pass


---

# 80. Shared cardiology pre-pass — first production content map

## 80.1 Purpose

This section converts the cardiology / atherosclerosis theme into a shared **medical-didactic substrate** that can feed both:

- **Sprint A:** production-oriented Interactive Micro-Learning
- **Sprint B:** flagship 3D mini-game

The objective is to avoid researching, simplifying and art-directing the same medical content twice.

The pre-pass should define only the minimum shared truth set required for both tracks.

It is **not** intended to become a complete cardiology curriculum or a procedural cath-lab simulator.

---

# 81. Source basis for the pre-pass

Primary DocCheck sources for this first pass:

- **Atherosklerose**
- **Atherogenese**
- **Atherosklerotische Plaque**
- **Koronare Herzkrankheit**
- **Stentimplantation**

The shared content should remain close to these sources where possible.

Important source-derived core sequence:

1. endothelial dysfunction
2. increased permeability
3. LDL entry into the subendothelial space of the intima
4. LDL modification / inflammatory signaling
5. monocyte recruitment
6. macrophage transformation and foam-cell formation
7. fatty streak
8. extracellular lipid accumulation / preatheroma
9. smooth-muscle-cell migration from the media
10. necrotic lipid core + fibrous cap
11. progressive plaque growth / stenosis
12. advanced complicated lesion with possible cap rupture and thrombosis

This sequence is the strongest common didactic backbone for both output levels.

---

# 82. Recommended 10 core learning statements

These are intentionally short enough to become:

- interaction beats
- completion summaries
- Anki cards
- quiz stems
- tooltip copy
- PDF takeaways

## Learning statement 1
**Atherosclerosis begins as a disease process of the arterial wall, not as material simply “stuck inside the blood”.**

Didactic importance:
This corrects the most dangerous visual simplification for the game concept.

---

## Learning statement 2
**Endothelial dysfunction is an early step in atherogenesis.**

Possible visual translation:
The luminal lining loses its smooth, intact appearance.

---

## Learning statement 3
**LDL can enter the subendothelial region of the tunica intima and become modified there.**

Possible visual translation:
LDL-like particles pass through the endothelial boundary into an intimal layer.

---

## Learning statement 4
**Modified LDL promotes a chronic inflammatory response and recruitment of immune cells.**

Possible visual translation:
Monocytes attach, cross the endothelium and become macrophage-like cells.

---

## Learning statement 5
**Macrophages take up modified LDL and become foam cells; accumulations form fatty streaks.**

Possible visual translation:
Small foam cells become a visible yellowish intimal band.

---

## Learning statement 6
**Progression produces a lipid-rich plaque with a necrotic core and, in fibroatheroma, a fibrous cap.**

Possible visual translation:
The early streak becomes a structured plaque rather than a homogeneous blob.

---

## Learning statement 7
**Smooth muscle cells from the media contribute to plaque development and formation of the fibrous cap.**

Possible visual translation:
Selected cells visibly migrate inward and reinforce the cap layer.

---

## Learning statement 8
**Plaque growth can narrow the arterial lumen and impair blood flow.**

Possible visual translation:
Open lumen visibly shrinks; erythrocyte flow becomes constrained.

---

## Learning statement 9
**Advanced plaques can become unstable; rupture can trigger thrombosis and acute vascular events.**

Possible visual translation:
Cap disruption exposes plaque material and a thrombotic overlay forms.

---

## Learning statement 10
**A stent can be expanded at a stenotic lesion to support the vessel wall and help keep the lumen open.**

Possible visual translation:
Balloon-mounted stent expands, contacts the wall, balloon deflates, stent remains.

---

# 83. Optional secondary learning statements

These can support side quests but should not crowd the primary 1–3 minute module.

## Risk factors
Relevant modifiable risk factors include:

- hypercholesterolemia
- hypertension
- smoking
- diabetes mellitus

Additional risk-modification topics may be pulled from the broader atherosclerosis article if retained by editorial review.

## Clinical consequences
Depending on the affected vascular territory, atherosclerotic disease can contribute to:

- coronary heart disease / myocardial infarction
- stroke
- peripheral arterial disease
- other ischemic vascular disease

## Diagnostics
The broader article context supports multiple diagnostic approaches including:

- ultrasound
- angiography
- intravascular ultrasound
- CT
- MRI
- laboratory assessment of risk-related parameters

These belong in optional side quests rather than the core lesion-building loop.

---

# 84. Shared visual state model — 6 states

The strongest reusable asset decision is to define **six canonical artery states** that both Sprint A and Sprint B can consume.

These are not intended as exhaustive histopathological grades.

They are a simplified visual mapping onto the source-derived progression.

---

## V0 — Healthy artery

### Medical meaning
Normal open arterial lumen with intact endothelium.

### Visual anchors
- smooth luminal surface
- clear endothelial boundary
- thin intima
- visible media
- visible adventitia
- open lumen
- uninterrupted erythrocyte flow

### Reuse
- Level A starting scene
- Flagship intro / tutorial environment
- comparison state
- completion “healthy reference” thumbnail

---

## V1 — Endothelial dysfunction / LDL entry

### Medical meaning
Early lesion environment.

### Visual anchors
- subtle irregularity of endothelium
- permeability event
- LDL particles cross into intima
- no large luminal obstruction yet

### Main teaching point
Atherosclerosis begins within the arterial wall.

### Reuse
- risk-factor interaction
- first guided click
- “scan” moment in flagship

---

## V2 — Fatty streak

### Medical meaning
Foam-cell accumulation.

### Visual anchors
- macrophage / foam-cell presence
- yellow-gold intimal streak
- lesion remains relatively shallow
- lumen still largely patent

### Main teaching point
Immune-cell lipid accumulation creates an early visible lesion.

### Reuse
- build step
- short microlearning transition
- early-game plaque encounter

---

## V3 — Fibroatheroma

### Medical meaning
More mature structured plaque.

### Visual anchors
- clear lipid core
- fibrous cap
- plaque protrudes into lumen
- optional small calcific accents
- media remains visually distinguishable

### Main teaching point
A mature plaque has internal structure; it is not simply a pile of cholesterol.

### Reuse
- flagship mid-game target
- Level A major reveal
- Anki visual card

---

## V4 — Severe stenosis

### Medical meaning
Advanced plaque with substantial luminal narrowing.

### Visual anchors
- strong narrowing
- visually constrained flow corridor
- disturbed erythrocyte trajectories
- larger plaque burden
- cap remains intact

### Main teaching point
Plaque burden can significantly reduce vessel patency.

### Reuse
- flagship challenge stage
- consequence visualization
- before-state for stenting

---

## V5 — Complicated lesion / thrombosis

### Medical meaning
Advanced unstable lesion with rupture and thrombotic complication.

### Visual anchors
- focal cap disruption
- exposed lesion surface
- platelet / thrombus accumulation
- critically narrowed or blocked channel
- no gore

### Main teaching point
Acute events can arise when a plaque becomes complicated, not merely from slow narrowing.

### Reuse
- optional Level A consequence
- flagship climax threat
- separate future ACS module

---

# 85. Shared artery asset grammar

To avoid overbuilding, the MVP asset set should remain intentionally small.

## Required core assets

### Vessel
- one arterial tube / corridor
- one cross-sectional wall model
- reusable wall layer materials

### Wall layers
- endothelial surface
- intima
- media
- adventitia

### Pathology
- LDL particles
- monocyte / macrophage representation
- foam cells
- fatty streak
- lipid core
- fibrous cap
- plaque mesh variants
- optional calcification decals / chunks
- thrombus overlay

### Blood
- erythrocytes
- optional platelets
- optional leukocyte accents

### Intervention
- guide / catheter-like delivery element
- balloon
- compressed stent
- expanded stent

### Game object
- nano-drone / probe

This is enough for both tracks.

No artery editor is required.

---

# 86. Medical art-direction guardrails

These should be stated explicitly in the Fable briefing.

## Must preserve

### 1. Plaque location
Plaque must originate from the intimal side of the vessel wall.

### 2. Layer logic
Intima, media and adventitia should remain visually distinguishable in cross-section or scan mode.

### 3. Plaque structure
Later plaque should suggest:
- lipid / necrotic core
- fibrous cap

### 4. Flow
Erythrocytes belong in the lumen, not within plaque layers.

### 5. Thrombus
If shown, thrombus should form at / over a complicated luminal lesion rather than appear as arbitrary free debris.

### 6. Stent
The stent should expand radially and remain apposed against the vessel wall after the balloon is deflated / removed.

## May be stylised

- exact cell morphology
- exact vessel dimensions
- exact stent strut geometry
- number of cells
- plaque composition proportions
- colour palette
- flow density
- camera scale

The result should be **medically literate**, not histology-simulation-level exact.

---

# 87. Sprint A briefing — production-oriented microlearning MVP

## Working title
**Inside Atherosclerosis**

Alternative:
**Build an Atheroma**

## Format
Embedded SPA, landscape preferred but responsive.

## Duration
Approximately 90 seconds to 3 minutes.

## Core promise
The user creates atherosclerotic change step by step and sees how an apparently healthy artery becomes a stenotic vessel.

## Interaction model
Guided “playable onboarding”.

No complex puzzle.

The next valid action is always visually obvious.

---

## Sprint A flow

### Level 1 — Start the lesion

Scene:
Healthy arterial cross-section.

User:
Selects one modifiable risk factor from a small set.

Recommended MVP choices:
- smoking
- hypercholesterolemia
- hypertension
- diabetes mellitus

Response:
- endothelial surface changes subtly
- LDL becomes available
- highlighted cue invites next click

Learning anchor:
**Risk factors promote endothelial dysfunction.**

---

### Level 2 — Build the plaque

Guided sequence:

1. click LDL
2. LDL moves beneath endothelium
3. inflammatory / monocyte step appears
4. click or combine macrophage + LDL
5. foam cells form
6. fatty streak appears
7. one additional click evolves this into structured plaque

Response:
- lipid core appears
- fibrous cap forms
- lumen narrows

Learning anchors:
- LDL enters intima
- inflammation recruits immune cells
- foam cells form
- mature plaque develops a lipid core and fibrous cap

---

### Level 3 — See the consequence

The completed plaque changes the lumen.

User:
Clicks one downstream vascular territory or simple consequence selector.

Possible MVP choices:
- coronary artery
- carotid / cerebral circulation
- peripheral artery

Result:
- myocardial infarction / coronary ischemia context
- stroke context
- peripheral arterial disease context

Optional:
One rapid single-choice question.

Final visual:
Before / after artery pair.

---

# 88. Sprint A UI recommendation

Keep shell minimal:

## Top
- module title
- tiny 1 / 2 / 3 progress indicator

## Center
- large artery scene

## Bottom / side
- only the current actionable objects
- one-sentence learning anchor after each action

## Completion
- 3/3 completed
- Anki
- PDF
- Sources
- Replay

No persistent dense sidebar.

The artery should dominate.

---

# 89. Sprint A “juice” specification

Correct interaction:

- soft magnetic snap
- artery or plaque gives a subtle pulse
- moving particle follows actual biological direction
- cap / lesion forms with smooth morph animation
- next affordance rises or glows

Incorrect interaction:

- short spring-back
- no penalty
- next target subtly re-emphasized

Completion:

- lumen comparison
- gentle camera pullback
- all learned layers briefly highlighted in sequence

No confetti.

---

# 90. Sprint B briefing — flagship cardiology mini-game MVP

## Working title
**Artery Run: Stent Rescue**

Alternatives:
- Plaque Patrol
- Nano Mission: Coronary Rescue

## Format
Landscape embedded SPA.

## Duration
Approximately 2–4 minutes.

## Renderer
Three.js / WebGL or hybrid 2.5D WebGL.

## Fantasy
Pilot a tiny medical nano-drone through a stylised coronary artery, inspect plaque progression, reach a severe stenosis, and perform a guided stent deployment.

## Learning promise
Experience the relationship between vessel-wall plaque, luminal stenosis, disturbed flow and mechanical restoration of patency.

---

# 91. Sprint B 3-act game loop

## Act 1 — Healthy artery / onboarding

Scene:
V0 → V1

Player verbs:
- light steering
- scan
- click / tag

Events:
- erythrocytes flow past
- vessel layers briefly become visible in scan mode
- subtle endothelial dysfunction appears
- LDL entry event occurs

Purpose:
Teach controls and establish medical space.

---

## Act 2 — Plaque corridor

Scene:
V2 → V4

Player verbs:
- steer
- target with generous aim assist
- tag / clear stylised “simulation markers”
- collect one or two learning pickups

Events:
- fatty streak
- structured plaque
- narrowing becomes progressively obvious
- erythrocyte flow corridor becomes tighter
- speed / density visuals communicate disturbed flow

Important:
Do not literally portray clinically meaningful plaque therapy as laser removal.

The shooter-like action should be framed as:
- scanning
- marking
- clearing teaching overlays
- stabilising / navigating

The actual resolution of severe stenosis comes later with the stent.

---

## Act 3 — Stenosis / stent rescue

Scene:
V4, optional brief V5 threat.

Player sequence:

1. approach severe stenosis
2. scan / lock onto lesion
3. position delivery system
4. guide through lesion
5. deploy balloon-mounted stent
6. watch radial expansion
7. balloon deflates / withdraws
8. stent remains in place
9. lumen opens
10. flow visibly improves

Player control should be forgiving.

The final deployment should be the signature animation.

---

# 92. Sprint B signature visual moment: stent deployment

This needs disproportionate polish.

## Animation sequence

### A. Arrival
Compressed stent enters across the stenosis.

### B. Alignment
Device locks into correct axial position.

### C. Expansion
Balloon inflates and expands the stent radially.

### D. Wall contact
Stent struts seat against the vessel wall.

### E. Balloon withdrawal
Balloon deflates and moves out.

### F. Final state
Stent remains open; flow corridor visibly improves.

The user should understand the mechanical principle without needing a paragraph.

---

# 93. Sprint B MVP boundaries

Hard scope limits:

- one vessel environment
- one lesion progression family
- one nano-drone
- one stent sequence
- one short 3-act route
- no full coronary anatomy map
- no branching intervention choices
- no complex hemodynamic simulation
- no catheter-lab procedural scoring
- no real procedural training claim
- no artery editor
- no inventory
- no multiple weapon systems
- no backend

The goal is a polished slice, not a game platform.

---

# 94. Shared source / content package

Both Sprint A and Sprint B should consume one common content package.

Suggested structure:

```js
cardiologyPack = {
  topic: "atherosclerosis",
  learningStatements: [],
  vesselStates: [],
  riskFactors: [],
  consequences: [],
  diagnostics: [],
  interventions: [],
  ankiCards: [],
  sources: []
}
```

This can remain a plain JSON object in MVP.

The point is reuse, not framework engineering.

---

# 95. Shared Anki pack — initial card set

Suggested first 10 cards derived from the shared learning statements.

## Card 1
**Front:** Where does early atherosclerotic change primarily develop in the arterial wall?  
**Back:** In the intimal / subendothelial region after endothelial dysfunction permits lipid entry.

## Card 2
**Front:** What is an early initiating event in atherogenesis?  
**Back:** Endothelial dysfunction.

## Card 3
**Front:** Which lipoprotein is central to the lipid-infiltration model of atherogenesis?  
**Back:** LDL.

## Card 4
**Front:** What happens to monocytes after they enter the subendothelial space?  
**Back:** They differentiate into macrophages.

## Card 5
**Front:** How do foam cells form?  
**Back:** Macrophages take up modified LDL and accumulate intracellular lipid.

## Card 6
**Front:** What is a fatty streak?  
**Back:** An early intimal lesion characterized by accumulation of lipid-laden foam cells.

## Card 7
**Front:** What are two characteristic structural components of a fibroatheroma?  
**Back:** A lipid / necrotic core and a fibrous cap.

## Card 8
**Front:** How can progressive plaque growth affect the vessel lumen?  
**Back:** It can narrow the lumen and impair blood flow.

## Card 9
**Front:** Why can plaque rupture be clinically dangerous?  
**Back:** It can trigger thrombosis and acute vascular occlusion.

## Card 10
**Front:** What is the basic mechanical purpose of a vascular stent?  
**Back:** To support the vessel wall and help keep a stenotic lumen open after deployment.

These should be editorially reviewed before production export.

---

# 96. Shared PDF pack — MVP structure

Recommended 2-page PDF.

## Page 1 — “Atherosclerosis in one vessel”

- healthy artery
- endothelial dysfunction
- fatty streak
- fibroatheroma
- severe stenosis
- complicated plaque

Each shown as a compact visual state.

## Page 2 — “What to remember”

- 6–10 learning statements
- major risk factors
- major consequences
- one simplified stent diagram
- source links
- QR / link back to interactive module

The PDF should reuse the same illustrations / renders from the SPA wherever possible.

Do not create a separate visual language for the PDF.

---

# 97. Shared research / visual-production checklist

Before Fable Five production starts:

## Medical
- [ ] confirm final lesion progression terminology
- [ ] confirm which risk factors belong in MVP
- [ ] confirm wording around plaque rupture and thrombosis
- [ ] confirm simplified stent sequence
- [ ] confirm whether coronary artery should be the explicit vessel context or generic muscular artery

## Didactic
- [ ] lock 8–10 learning statements
- [ ] define what the user must remember after 3 minutes
- [ ] define which facts are optional side quests
- [ ] define final question set

## Visual
- [ ] approve vessel-wall abstraction
- [ ] approve plaque states V0–V5
- [ ] approve stent visual language
- [ ] approve blood-cell stylisation
- [ ] decide whether Recherchi-like character language appears

## Technical
- [ ] identify reusable 3D assets
- [ ] choose Three.js vs 2.5D approach for Flagship
- [ ] decide how much Level A can reuse the same rendered assets
- [ ] verify embed viewport constraints
- [ ] define export mechanism for Anki / PDF

---

# 98. Recommended handoff structure to Fable Five

When this becomes the actual production brief, split the prompt into four blocks.

## Block 1 — Shared medical world
Give:
- learning statements
- vessel states
- medical guardrails
- source links

## Block 2 — Sprint A
Ask for:
- production-near microlearning implementation
- 3 guided levels
- reusable interaction logic

## Block 3 — Sprint B
Ask for:
- flagship artery mini-game MVP
- 3-act side-scroller / rail experience
- stent deployment climax

## Block 4 — Asset / technology exploration
Ask Fable Five to:
- inspect supplied asset-library JSON
- identify suitable existing assets
- prefer adapting strong assets over low-quality autogenerated medical SVGs
- document external libraries / examples used
- keep solution simple and embed-safe

This should give enough autonomy without requiring continuous micromanagement.

---

# 99. Current recommendation after the cardiology pre-pass

The project is now sufficiently defined to move from broad ideation into **two concrete exploratory implementation briefs**.

Recommended sequence:

### First
Produce Sprint A quickly.

Reason:
It validates:
- visual artery model
- lesion state logic
- DocCheck interaction language
- embed behaviour
- Anki/PDF completion pattern

### Then / in parallel
Use the same assets and content model to produce Sprint B.

Reason:
The flagship slice can concentrate effort on:
- movement
- camera
- game feel
- vessel atmosphere
- stent animation

without rediscovering the medical content.

This is the central synergy of the double-sprint model.

---

## Change log

### v0.6 — 2026-09-10

Added the shared cardiology pre-pass:

- 10 core learning statements
- optional secondary content
- 6 canonical vessel / plaque visual states
- shared asset grammar
- medical art-direction guardrails
- detailed Sprint A microlearning brief
- detailed Sprint B flagship brief
- stent deployment signature sequence
- strict MVP boundaries
- shared content-pack structure
- initial 10-card Anki set
- 2-page PDF learning-pack concept
- research / production checklist
- recommended Fable Five handoff structure


---

# 100. Production handoff created

Two concrete implementation briefs have now been distilled from the living document.

## Sprint A
**DocCheck Interactive Micro-Learning · Atherosclerosis**

Purpose:
- production-near
- guided
- reusable
- article-embedded
- 90 seconds to 3 minutes
- includes Anki / PDF / sources completion layer

Filename:
`BRIEFING_Sprint_A_DocCheck_Interactive_Microlearning_Atherosclerosis.md`

## Sprint B
**DocCheck Flagship Playable Slice · Artery Run: Stent Rescue**

Purpose:
- high-ambition showcase
- Three.js / 2.5D
- artery side-scroller / rail experience
- plaque progression
- guided stent deployment climax
- 2–4 minute MVP

Filename:
`BRIEFING_Sprint_B_DocCheck_Flagship_Artery_Run.md`

Both share the same cardiology knowledge map, vessel-state model, medical guardrails and takeaway logic.

This marks the transition from ideation into exploratory production.

---

## Change log

### v0.7 — 2026-09-10

Created two production-ready handoff briefs:
- Sprint A Interactive Micro-Learning
- Sprint B Flagship Artery Run

The living document remains the additive master context.

---

# 101. UI correction for Wissens-Pilli embed: no double UI layering

The current Claude Design / Rigging-Lab style interface is an authoring UI and is explicitly **not** the learner-facing embed.

The Flexikon / article page already provides the outer DocCheck shell. The Wissens-Pilli SPA must therefore behave like a **frameless rich-media embed**, closer to YouTube than to a second website inside the article.

Hard rule:

> If placed in the middle of a Flexikon article, it should look like one interactive media object, not like a nested application.

## Target structure

```text
DocCheck article
└── responsive 16:9 playable stage
    ├── 3D Wissens-Pilli
    ├── 3D learning card / media surface
    ├── subtle integrated progress
    └── minimal controls
```

Do not ship:
- internal navbar
- duplicated DocCheck header
- persistent toolbar
- inspector / settings side panel
- debug tabs
- lab controls
- nested card/dashboard chrome

The character and the card are the interface.

## Preferred landscape composition

Desktop-first:
- width: 100%
- `aspect-ratio: 16 / 9`
- no internal page scroll
- scene fits entirely inside the embed
- safe margins for text / controls

Suggested staging:
- card / media object on left or center
- Wissens-Pilli on right / lower-right
- only contextual answer UI around the active card

## Minimal persistent controls

Only:
- sound / voice
- reset
- optional info / sources
- optional fullscreen

Difficulty selection may appear before the run and disappear afterward.

## Progress

Prefer integrated progress:
- six dots
- cube faces
- tiny segmented indicator
- Pilli repair / damage state
- cube orientation

Avoid dashboard-style progress bars.

## Speech

WS0 uses:
- short speech bubbles
- optional TTS
- simple mouth animation

No chat window in WS0.

The later LLM assistant is a future mode and should not dictate the demo UI.

## Cards

The card is a 3D scene object:
- fly-in
- depth
- tilt
- flip
- dock
- stack
- learned / retry transitions

DOM text may be aligned over the 3D card where needed for crisp typography and accessibility.

## Completion

A stronger panel is acceptable only as terminal state:

```text
6 / 6 complete

[Anki]
[PDF]
[Sources]
[Replay]
```

## Authoring vs runtime

Two UIs may exist:

**Lab / Authoring**
- sliders
- rig controls
- materials
- placement
- debug
- inspectors

**Learner Runtime**
- frameless
- guided
- minimal
- immersive

Do not merge the two.

---

## Change log

### v0.8 — 2026-09-13

Added the hard learner-facing UI rule for Wissens-Pilli:
- no double UI layering
- frameless landscape embed
- character + card as primary UI
- strict separation between authoring Lab and learner runtime

---

# 112. Wissens-Pilli Studio → Animation Lab → Design pipeline

The Wissens-Pilli production path is now explicitly split into three owner layers:

1. **Studio** prepares CapsuleCarl as a stable presenter actor:
   face ownership, eyes, pupils, mouth, material states, damage props, anchors and deformation-safe bounds.
2. **Animation Lab** later owns semantic motion behavior, initially via lightweight procedural cartoon deformation rather than a new skeleton.
3. **Design / runtime assembly** combines topic background, Wissens-Pilli, 1–n learning cards, media, cube, TTS, speech bubbles, progress and exports.

The learner runtime remains frameless and article-embed-first.

## New scene principle

The topic is set primarily through:
- background URL / upload
- content-pack JSON
- optional media card

The presenter stage remains reusable.

## Hard UX rules

- Roboto as learner-facing main font
- large readable text
- one CTA at a time
- microinteraction hints rather than instruction walls
- pupil tracking follows the pointer smoothly
- idle uses intentional lulls
- Pilli performs, then settles so the learner can read

## Props

- landscape learning cards use the KayKit board-game asset language / verified donor
- Ugur low-poly D6 is the preferred six-state progress prop
- exact asset filenames are verified through Asset Librarian before implementation

## Media

Preferred WS0 video card:
self-hosted short clip derived from the current Retrovirus replication visualization.

YouTube is supported as a replaceable iframe card, not required as a production dependency.

---

## Change log

### v0.9 — 2026-09-13

Added:
- Studio preparation contract
- Animation Lab handoff model
- theme by background URL/upload
- 1–n card slider concept
- TTS / Roboto / one-CTA rules
- pointer pupil tracking and lulls
- KayKit board-game card language
- Ugur cube as progress prop
- media-card recommendation
