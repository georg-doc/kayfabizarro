# Claude Design Briefing — Flexa Citric Acid Kitchen · Adaptive Learning Loop Demo 01

**Status:** DESIGN / IMPLEMENTATION BRIEF · PROPOSAL  
**Date:** 2026-09-21  
**Owner:** DocCheck Wissens-Pilli / Interactive Microlearning learner runtime (currently UNVERIFIED project intake)  
**Source context:** `DocCheck_Interactive_Microlearning_Living_Doc_v0.9.md` + `DocCheck_Interactive_Microlearning_Learning_Loops_Addendum_v1.0.md`  
**Primary surface:** Flexikon-style article embed + standalone demo  
**First build:** TEXT + 3D ANIMATION ONLY  
**Video:** later enhancement; build must work completely without it

---

# 1. Goal

Build one polished interactive 16:9 microlearning demo around the citric acid cycle.

The demo must prove three things:

1. A medical pathway can become a playful 3D learning object rather than a static diagram.
2. Flexa can guide the learner contextually without becoming a conventional chat window.
3. The same learning object can compress from a full guided loop into a personalised weak-spot loop and expose connected Loop Portals.

The first build is a **text + 3D animation prototype**. Flexa is represented by a still/animated still on the right. Do not depend on HeyGen/video playback.

---

# 2. Creative premise

Working title:

# Flexa's Citric Acid Kitchen

Flexa appears with a **white chef hat** and is mildly, knowingly exasperated that she has to explain a biochemical cycle that literally ends where it began.

Tone:
- competent;
- dry;
- lightly amused;
- never childish;
- never hostile to the learner;
- never generic "edutainment enthusiasm";
- humour comes from the actual cyclic logic.

The core running joke is:

> Flexa can finish the explanation, but the cycle cannot finish.

The humour must reinforce the learning point.

---

# 3. Hard design principle

Do not build:
- a nested dashboard;
- a conventional LMS;
- a chat bubble;
- a generic quiz app;
- a sci-fi HUD;
- a realistic molecular simulation;
- a Candy Crush clone;
- a full metabolic mega-world.

Build:

> one memorable 3D learning object inside a calm DocCheck editorial embed.

The character + 3D object + active task are the interface.

---

# 4. Embed composition

Desktop / tablet default:

```text
┌───────────────────────────────────────────────────────────────┐
│ FLEXA'S CITRIC ACID KITCHEN                     LOOP 1 / 3   │
│                                                               │
│ ┌─────────────────────────────────────┐ ┌───────────────────┐ │
│ │                                     │ │                   │ │
│ │       3D METABOLIC KITCHEN          │ │       FLEXA       │ │
│ │                                     │ │  white chef hat   │ │
│ │ task / molecule slots / outputs     │ │   still portrait  │ │
│ │                                     │ │                   │ │
│ └─────────────────────────────────────┘ └───────────────────┘ │
│                                                               │
│ Hint        Ask Flexa        Show chemistry        Continue   │
└───────────────────────────────────────────────────────────────┘
```

Approximate balance:
- 65–70% learning / 3D area;
- 30–35% Flexa presenter area.

No persistent heavy chrome.

Minimal optional controls:
- sound placeholder;
- reset;
- sources/info;
- fullscreen if useful.

---

# 5. Flexa in build 01

Use:
- one approved Flexa still / portrait;
- white chef hat as episode-specific accessory;
- small position / scale / crop transitions;
- subtle eye-line / parallax if available;
- optional expression still swaps.

Do not implement actual video yet.

Reserve a media slot/API seam so a later HeyGen clip can replace a still for:
- intro;
- three core beats;
- outro.

The layout must not change when video is introduced later.

---

# 6. 3D world concept

Build a stylised circular **Metabolic Kitchen / Factory Ring**.

It is not meant to depict real mitochondrial spatial organisation.

It is a spatial learning metaphor.

Required visible biochemical nodes:
- Oxaloacetate;
- Citrate;
- Isocitrate;
- alpha-Ketoglutarate;
- Succinyl-CoA;
- Succinate;
- Fumarate;
- Malate.

Required input/output tokens:
- Acetyl-CoA;
- NADH;
- FADH2;
- GTP;
- CO2.

Use simple readable stylised forms rather than fully realistic ball-and-stick chemistry.

Each node can have:
- a station/socket;
- readable label;
- distinct silhouette/material;
- connection to next station;
- optional enzyme label in Study Mode.

---

# 7. Visual style

Target:

# colourful editorial edutainment

Use:
- light / warm neutral stage;
- DocCheck red `#cc0033` only as restrained UI/action accent;
- playful but controlled metabolite colours;
- rounded low-poly / stylised 3D forms;
- soft shadows;
- clear hierarchy;
- satisfying movement;
- readable typography;
- no excessive particles.

The scene may borrow the interaction grammar of a small factory/kitchen:
- conveyor segments;
- sockets;
- trays;
- output chutes;
- small containers.

Do not let factory decoration obscure chemistry.

---

# 8. Interaction grammar

Use only a few strong verbs:

### Place
Put the correct molecule/resource into the active station.

### Activate
Trigger a reaction / station after the correct input is present.

### Follow
Camera / highlight follows the cycle to the next station.

### Collect
NADH / FADH2 / GTP / CO2 visibly leave the active station.

### Recall
Labels disappear; learner identifies or reconstructs the missing relation.

### Portal
Optional connected knowledge opens from a node.

No economy, crafting tree, coins, XP or leaderboard.

---

# 9. Demo dramaturgy

The prototype has **five beats**:

1. Intro
2. Core Step 1 — Build the entry
3. Core Step 2 — Harvest the outputs
4. Core Step 3 — Close and compress the loop
5. Outro / next recall

These beats correspond to later HeyGen slots, but must initially run as text + 3D only.

---

# 10. INTRO STATE

Visual:
- quiet kitchen/factory ring;
- most nodes dimmed;
- Acetyl-CoA arrives at the outer edge;
- Oxaloacetate station is visible;
- Flexa right side with chef hat.

Text:

> **Another shift. Same cycle.**  
> Acetyl-CoA is here. What does it need before we can make citrate?

CTA:

**Start cooking**

Secondary:
**Show me the cycle**

---

# 11. CORE STEP 1 — Entry / build citrate

Learning target:
Acetyl-CoA condenses with oxaloacetate to form citrate.

Interaction:
- show 3–4 candidate molecule tokens;
- learner chooses Oxaloacetate;
- place token into the active station;
- Acetyl-CoA token joins;
- station activates;
- citrate appears;
- first section of ring lights up.

If wrong:
- no red "WRONG";
- station simply does not run;
- Flexa reacts visually;
- short text hint appears.

Hint example:

> This is the molecule we need back at the end of every turn.

Correct feedback:

> **Citrate ready.**  
> Oxaloacetate + Acetyl-CoA gets the cycle moving.

Optional **Show chemistry** reveals:
- citrate synthase;
- reaction label.

---

# 12. CORE STEP 2 — Run / harvest energy carriers

Learning target:
The cycle oxidises the acetyl group and captures energy mainly in reduced electron carriers.

Progression:
- animate the ring through its stations;
- do not require the user to manually solve every intermediate in Demo 01;
- stop at selected output moments;
- visually eject/collect output tokens.

Required per acetyl-CoA overview:
- 3 NADH;
- 1 FADH2;
- 1 GTP;
- 2 CO2.

Primary task:

> **Ignore the metabolite names for a moment. What are we actually collecting?**

Interaction examples:
- click the highlighted stations that yield NADH/FADH2;
- catch/route output tokens into labelled trays;
- locate the FADH2-producing step as one short challenge.

Use the game action to make the output pattern memorable.

Keep exact biochemical labels available in Study Mode.

---

# 13. CORE STEP 3 — Close the loop + adaptive compression

Learning target:
Oxaloacetate is regenerated, so the pathway can accept another Acetyl-CoA.

Visual:
- final station produces / restores Oxaloacetate;
- circular ring closes;
- Acetyl-CoA appears again at entry.

Text:

> **Oxaloacetate is back.**  
> Which means the kitchen can start again. Naturally.

Then demonstrate **Adaptive Loop Compression**.

Session-local learner state marks one weak region, e.g.:

```text
Succinyl-CoA → Succinate → Fumarate → Malate
```

Full ring dims and known sections collapse / auto-complete.

Only the uncertain section remains active.

Prompt:

> **You know the entrance. Let's keep only the part you hesitated on.**

User completes one relation.

This is the key product proof.

---

# 14. LOOP PORTALS

Show two optional, recognisable portal icons.

## Portal A — Acetyl-CoA
Label:

> **Where did this come from?**

Teaser panel:
- Pyruvate / glycolysis;
- beta-oxidation;
- no full simulation yet.

## Portal B — NADH
Label:

> **Where does this go?**

Teaser panel:
- electron transport chain;
- optional mention of Complex I;
- no full simulation yet.

Portal behaviour:
- lightweight;
- optional;
- preserve current loop state;
- return to kitchen without reset.

Do not build the connected rooms yet.

---

# 15. ASK FLEXA

Include an inline **Ask Flexa** affordance.

It opens within the current card/stage, not as a separate chat surface.

Example:

```text
Ask about this step…
[____________________________________]
```

Build 01 can use prepared/demo responses.

Optional example prompts:
- Why does oxaloacetate come back?
- Why do we make NADH instead of lots of ATP directly?
- Where does Acetyl-CoA come from?
- What happens to NADH next?

Provide:

**Back to kitchen**

The UI should already permit a later LLM endpoint without requiring it now.

---

# 16. SESSION-LOCAL PERSONALISATION

No real user backend required.

Track enough local state to support believable adaptive feedback:

```js
{
  knownSteps: [],
  weakSteps: [],
  wrongAnswers: 0,
  confidence: {},
  hintCount: 0,
  questionsAsked: [],
  completedLoops: 0
}
```

Use it to alter copy and active scene.

Examples:

> You know the entry step. Skip it.

> Citrate is not the problem.

> Let's keep only the succinate–fumarate section.

Personalisation should be demonstrated through **removing redundant teaching**, not merely addressing the user by name.

---

# 17. SIMULATED SPACED REPETITION

At the end provide:

**Later shift**

Clicking simulates a later visit.

The full kitchen does not return.

Only the weak segment appears.

Prompt:

> **Quick return order. No full cycle this time.**

This demonstrates spaced repetition as **loop compression**, not card repetition.

---

# 18. OUTRO STATE

After successful weak-spot recall:
- ring reappears in simplified form;
- Oxaloacetate closes the cycle;
- another Acetyl-CoA quietly arrives;
- Flexa notices it.

Text:

> **Cycle closed. Weak spot fixed.**  
> Next time, we start where you still need me — not at the beginning.

Small pause/beat:

> And yes. There's another Acetyl-CoA.

Actions:
- **Back to article**
- **Later shift**
- optional **Explore NADH**

---

# 19. Responsive behaviour

Desktop/tablet:
- 16:9 stage;
- 3D left/centre;
- Flexa right.

Mobile:
- do not shrink the entire desktop frame;
- stack current visual, task and choices;
- Flexa becomes a compact presenter strip / portrait;
- preserve same learning state machine.

---

# 20. Accessibility / text clarity

- crisp DOM text over or beside 3D where needed;
- do not render essential text as low-resolution canvas texture;
- keyboard-focusable options;
- no information encoded solely by colour;
- motion should pause/settle while learner reads;
- subtitles/text states remain first-class even after video is added.

---

# 21. Build order

## Slice A — visual + deterministic interaction
- article mock;
- standalone mode;
- Flexa still;
- 3D ring;
- entry challenge;
- output challenge;
- loop closure;
- compressed weak-spot loop;
- two portal teasers.

## Slice B — tutoring layer
- Ask Flexa demo responses;
- local learner state;
- later-shift state;
- copy refinements.

## Slice C — later media enhancement
- HeyGen intro;
- three core clips;
- outro;
- still→video→still transitions.

Video is explicitly **not required for Slice A**.

---

# 22. Acceptance gate for Demo 01

The prototype is successful if a colleague can understand, without explanation from the author:

1. this is embedded learning, not a separate LMS;
2. the learner acts on the biochemical process;
3. Flexa guides but does not dominate;
4. the system remembers which part was difficult;
5. the repeated loop becomes smaller;
6. NADH / Acetyl-CoA visibly lead to connected future learning spaces.

Do not expand into a complete metabolic network before this gate passes.

---

# 23. Non-negotiable content guardrail

The kitchen/factory metaphor must never override biochemical correctness.

If a game mechanic implies a false mechanism, change the game mechanic.

The first demo should accurately preserve:
- Acetyl-CoA entry via condensation with oxaloacetate to citrate;
- cyclic regeneration of oxaloacetate;
- 3 NADH per acetyl-CoA;
- 1 FADH2 per acetyl-CoA;
- 1 GTP per acetyl-CoA;
- 2 CO2 per acetyl-CoA;
- correct ordering of the eight central intermediates.

