# DocCheck Interactive Microlearning — Learning Loops Addendum

**Status:** PROPOSAL / Living Design Addendum  
**Version:** 1.0-proposal  
**Date:** 2026-09-21  
**Parent intake:** `DocCheck_Interactive_Microlearning_Living_Doc_v0.9.md`  
**Owner boundary:** Wissens-Pilli / DocCheck Interactive Microlearning learner runtime (still UNVERIFIED intake; no runtime promotion implied)

---

## 1. Core extension: from spaced cards to adaptive learning loops

The microlearning model should not be limited to repeating isolated cards.

A stronger product model is:

> **Spaced repetition of adaptive learning loops.**

A loop is a small, navigable knowledge structure made of:
- concepts / entities,
- ordered steps,
- causal relations,
- inputs and outputs,
- optional branches,
- transfer questions,
- user-specific weak points.

The same loop can be revisited at different levels of compression.

### Example

First encounter:

```text
A → B → C → D → E → F → G → H
↑                           ↓
└───────────────────────────┘
```

Later recall:

```text
A → [known] → C → [known] → E → F → [known]
                         ↑
                    weak region
```

Later still:

```text
E → ? → G
```

The user does not repeatedly receive the same full lesson. Known relations disappear from the active task and only uncertain relations remain.

Working term:

# Adaptive Loop Compression

The better the learner knows a region, the smaller and more contextual the next recall loop becomes.

---

## 2. Why this is stronger than card-only spaced repetition

Classic spaced repetition mainly varies **when** an item reappears.

Adaptive Learning Loops additionally vary:
- **how much** of the process is shown,
- **where** the learner enters,
- **which relations** remain active,
- **which representation** is used,
- **which context** triggers the recall.

This allows a learning object to evolve from:
1. guided exploration,
2. partial reconstruction,
3. weak-spot repair,
4. micro-recall,
5. contextual transfer.

A repeated interaction can therefore feel like a new task rather than repetition of a previous card.

---

## 3. Multiple entry points

Loops should not require a fixed “start at step one” curriculum.

A learner may enter a loop through any meaningful node.

For the citric acid cycle, possible entry points include:
- Acetyl-CoA,
- citrate,
- alpha-ketoglutarate,
- succinyl-CoA,
- oxaloacetate,
- NADH,
- FADH2,
- CO2,
- GTP.

This matters because medical knowledge is encountered contextually.

Examples:
- glycolysis can enter through pyruvate → Acetyl-CoA,
- beta-oxidation can enter through Acetyl-CoA,
- electron transport can enter backwards through NADH/FADH2,
- gluconeogenesis can enter through oxaloacetate,
- amino-acid metabolism can enter through alpha-ketoglutarate or succinyl-CoA.

The runtime should therefore treat a learning object as a graph with preferred routes, not as one fixed slideshow.

---

## 4. Loop Portals

Introduce a reusable visual affordance:

# Loop Portal

A Loop Portal marks a concept that has a connected interactive learning object.

It should be recognizable across DocCheck microlearning embeds.

Possible functions:
- **Where did this come from?**
- **Where does this go?**
- **Why does this matter?**
- **Compare this with…**
- **Go deeper**

Example:

```text
Acetyl-CoA  ◉
   ↓
TCA Cycle
   ↓
NADH  ◉
   ↓
Electron Transport Chain
```

The same visual symbol can signal:

> There is another explorable learning loop behind this concept.

The portal is not merely a hyperlink. It should preserve context and, where possible, carry the learner's current knowledge state into the next loop.

---

## 5. Personalised portal behaviour

A Loop Portal may offer different next actions depending on learner state.

For a beginner:

> What is NADH?

For an intermediate learner:

> Where is NADH generated in this cycle?

For an advanced learner:

> Follow NADH to Complex I.

For a learner with a known misconception:

> Compare NADH and FADH2.

The portal therefore becomes a context-aware invitation rather than a static “More info” link.

---

## 6. Three forms of recall

The system should distinguish at least three forms of reactivation.

### A. Scheduled Recall
A known weak point returns after an interval.

### B. Contextual Recall
A concept reappears naturally in another article, pathway, case or learning loop.

### C. Exploratory Recall
The learner voluntarily follows a Loop Portal and encounters prior knowledge from a new direction.

This makes repetition less visibly repetitive.

A learner may therefore experience:

> “You already know NADH from the citric acid cycle. You need it here.”

instead of:

> “Time for your NADH flashcard.”

---

## 7. Knowledge rooms, not isolated simulations

Longer-term, 3D / 2.5D learning objects should be designed as **connectable rooms**.

Examples:

- Citric Acid Kitchen / TCA Loop
- Glycolysis Room
- Beta-Oxidation Room
- Electron Transport Chain Room
- Gluconeogenesis Room

A room has:
- its own visual metaphor and mechanic,
- defined entry nodes,
- defined exit nodes,
- one or more Loop Portals,
- a learner-state interface.

The room does not own the whole curriculum.

This allows a modular learning graph without requiring a giant monolithic simulation.

---

## 8. Citric Acid Kitchen as first Loop prototype

The TCA showcase is especially suitable for the first implementation because the cycle is already a natural loop.

The prototype should demonstrate four loop states:

### Loop A — Full Guided Loop
Flexa guides the learner through the complete cycle.

### Loop B — Partial Recall Loop
Known steps are hidden or auto-completed.

### Loop C — Weak-Spot Loop
Only the uncertain segment remains playable.

Example:

```text
Succinyl-CoA → Succinate → Fumarate → Malate
```

### Loop D — Context Loop
A concept becomes the entry point into another process.

For Demo 01, only two portals are needed:

**Acetyl-CoA → “Where did this come from?”**  
Teaser: glycolysis / beta-oxidation.

**NADH → “Where does this go?”**  
Teaser: electron transport chain.

The downstream simulations do not need to be implemented yet. The portal can open a short teaser state.

---

## 9. Adaptive compression for Flexa

Flexa's dialogue should visibly reflect loop compression.

Examples:

> “We can skip the entry step. You know that one.”

> “Citrate is not the problem.”

> “Let’s keep only the succinate–fumarate section.”

> “Same molecule, different context.”

This is more credible personalisation than merely using the learner's name.

Flexa demonstrates memory by **removing unnecessary instruction**.

---

## 10. User-state model — conceptual minimum

A future learner model does not need to store “mastered / not mastered” only.

Per knowledge relation, it may track:

```js
{
  nodeId,
  relationId,
  strength,
  confidence,
  lastSeen,
  lastContext,
  errors,
  hintsUsed,
  transferSuccess,
  preferredRepresentation
}
```

For the first prototype this can remain session-local and simulated.

No backend is required to demonstrate the concept.

---

## 11. Loop scheduling principle

Scheduling should operate on **relations / weak regions**, not necessarily whole lessons.

Possible progression:

```text
FULL LOOP
→ PARTIAL LOOP
→ WEAK REGION
→ SINGLE RELATION
→ CONTEXTUAL TRANSFER
```

If the learner repeatedly succeeds, the active loop contracts.

If the learner fails or loses confidence, it expands again.

This creates a reversible adaptive system rather than a one-way level progression.

---

## 12. Visual grammar for Loop Portals

The exact visual design is still open, but the portal should:

- be small enough not to compete with the current task,
- be consistent across topics,
- read as optional depth,
- remain visible in 2D and 3D,
- support hover / focus states,
- show directionality when useful,
- avoid generic “info” or external-link iconography.

Possible semantic states:
- upstream,
- downstream,
- related,
- compare,
- weak-spot recall.

The icon should become a learned affordance across DocCheck.

---

## 13. Relationship to Anki / cards

Cards remain useful as:
- lightweight recall units,
- export format,
- fallback representation,
- terminal summary,
- mobile quick review.

But the runtime's primary learning object can be a loop rather than a card deck.

A loop may generate cards.

Cards do not need to define the entire learning architecture.

---

## 14. Product-level hypothesis

The larger product hypothesis becomes:

> **EmbedX / DocCheck Interactive Microlearning turns medical content into small, connected learning worlds. Flexa observes how the learner acts inside them and progressively compresses, redirects and reconnects those worlds according to what is already known.**

This connects:
- article context,
- interactive learning,
- spaced repetition,
- personalisation,
- Feynman recall,
- transfer,
- discoverable deep dives.

---

## 15. MVP boundary

Do **not** build a metabolic mega-world in Demo 01.

The first Citric Acid Kitchen prototype only needs to prove:

1. one complete loop,
2. one compressed weak-spot loop,
3. one personalised skip,
4. two visible Loop Portals,
5. one portal teaser,
6. one simulated delayed recall.

No full glycolysis, beta-oxidation or electron-transport simulation is required.

---

## 16. Suggested next design gate

For the first Claude Design / prototype slice:

> **Prove Adaptive Loop Compression inside the Citric Acid Kitchen before building connected downstream rooms.**

A successful prototype should make it obvious that:
- the same learning object changes shape with learner state,
- known steps disappear,
- weak regions remain,
- connected knowledge is discoverable,
- Flexa uses this state to guide rather than simply narrate.

---

## Additive change log

### v1.0-proposal — 2026-09-21

Added:
- Adaptive Learning Loops as a higher-level learning model,
- Adaptive Loop Compression,
- multiple entry points,
- Loop Portals,
- scheduled / contextual / exploratory recall,
- connected knowledge rooms,
- TCA-specific portal examples,
- relation-level learner state,
- bounded MVP rule for the first Citric Acid Kitchen prototype.

This addendum is conceptual input only. It does not promote the current Wissens-Pilli intake to a runtime SSOT and does not replace the parent Living Design Document.
