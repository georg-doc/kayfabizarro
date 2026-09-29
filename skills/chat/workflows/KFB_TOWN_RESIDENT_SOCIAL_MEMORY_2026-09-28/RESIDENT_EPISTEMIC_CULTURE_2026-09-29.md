# KFB Town · Resident Epistemic Culture

Status: **CURRENT DESIGN DIRECTION · ADDITIVE · SITE-FIRST CHECKPOINT**  
Date: 2026-09-29  
Owner: **KFB Town Resident Social Memory**  
Branch: `chatgpt-web/town-resident-social-memory-2026-09-28`

## 1 · Core premise

KFB Town is not conflict-poor. It is **escalation-poor**.

Residents can be stubborn, jealous, territorial, contradictory, ideologically incompatible, tired of one another and trapped in century-old running disputes. The world remains broadly chill, funny and protopian because it has cultural ways to metabolize conflict without turning every disagreement into permanent enmity.

Recurring social mechanisms include:
- Dance;
- Gift;
- Brick Fish;
- Kayfabe fight / buddy brawl;
- Card relay;
- retort / ChatterBox exchange;
- walk-off / resume;
- shared music and routine activity.

A Resident can sincerely like another Resident and still be intensely irritated by them. Long-term relationships should therefore not collapse into one friend/enemy scalar.

Working relationship dimensions:
`affection · irritation · trust · fascination · rivalry · shared-history`

## 2 · Shared epistemic culture, not shared ideology

Most Residents may share a **method habit** without sharing conclusions.

Existing KFB meta grammar already keeps three readings in the air:
1. **official story / stated purpose**;
2. **POSIWID + cui bono** — judge a system by what it repeatedly does and inspect who benefits;
3. **Hanlon's Bizarro-Blödsinn** — do not require malice when incompetence, self-deception, drift or nobody-at-the-wheel dynamics are sufficient.

Do not turn this into a KFB dogma. The important move is the refusal to collapse too early onto one explanation.

Resident cognition should therefore ask, explicitly or implicitly:

```text
What is claimed?
→ What actually happens?
→ Who benefits from the repeated outcome?
→ Does this require intention?
→ What am I probably missing because of my own lens?
```

## 3 · Character truth remains perspectival

No Resident owns final truth.

Each Resident should have a compact epistemic profile:

`observationStyle · preferredExplanation · expertise · jargon · blindSpot · projection · taboo · skepticismTrigger · authorityTrigger`

A Resident's strengths and blind spots must be linked. The same trait that lets them see something others miss should also make them misread something else.

Examples:
- systems thinker spots incentive structures but over-attributes design;
- practical farmer sees material consequences but dismisses abstractions too quickly;
- scientist catches bad causal claims but underrates tacit or non-scientific knowledge;
- mystic detects symbolic/psychological patterns but overreads coincidence;
- bureaucrat sees procedure everywhere and mistakes procedure for legitimacy;
- outlaw detects coercion but may underweight coordination problems.

Do not write a cast of fools around one correct narrator.

## 4 · Evidence, perception, interpretation and performance are separate layers

For real-world events, political material, Cards and Town events, preserve this separation:

### A · Event / Evidence
What is actually known or source-backed?

### B · Resident Perception
What has this Resident heard, seen or been told?

### C · Resident Interpretation
How do their worldview, Signature Deck, expertise, blind spots, relationships and current emotional preoccupation color it?

### D · Performance
How does that interpretation appear in the world:
- ChatterBox line;
- semantic Triplet;
- Fluff-o-lect;
- thought bubble;
- Card;
- gesture;
- Emanata;
- Gift;
- Brick Fish;
- dance;
- silence;
- walk-off.

A Resident interpretation must not silently overwrite the factual layer.

## 5 · ChatterBox / Triplet role

Reuse the existing semantic-Triplet / reader-closure lineage.

The strongest Resident lines should not explain the whole joke or thesis. They establish a relation, mismatch or status shift and let the player supply closure.

Useful abstract shape:

```text
worldview / loaded term
→ relation or contradiction
→ open closure
```

For Cards, keep the existing distinction:

```text
NAME / CLAIM / POWER
```

establishes the Card, while

```text
SHOW IT → SPIN IT → SELL IT
```

performs the social handoff.

`SPIN IT` is the main home for Resident worldview, emotional coloring, jargon, expertise and bias.

## 6 · Fluff-o-lect

Fluff-o-lect remains **Closure on word level**, not an automatic cute-word replacement filter.

Use it when visible context or shared knowledge allows the missing/altered term to be reconstructed.

The useful effect is:
- semantic compression;
- deniability made visible rather than hidden;
- a line that becomes less quotable but more inferential;
- comic participation by the player.

Do not mechanically replace every institutional or political word with `fluff`.

## 7 · Jargon, expert language and dog whistles

Residents may use:
- technical jargon;
- community shorthand;
- ideological buzzwords;
- conspiracy-community codes;
- academic terminology;
- trade vocabulary;
- slang;
- generational language.

These are **character evidence**, not truth markers.

A term should reveal:
- what communities the Resident knows;
- what they consider obvious;
- what they distrust;
- where they are expert;
- where their expertise becomes tunnel vision.

The same phrase can be understood, mocked, challenged or reframed by another Resident.

## 8 · Shadow / active preoccupation

Stable personality alone is not enough for emergent history.

Each Resident may carry one small current preoccupation such as:
- recent humiliation;
- recurring rivalry;
- failed project;
- new crush;
- unexpected success;
- authority conflict;
- Card they cannot stop thinking about;
- unresolved Gift / Brick Fish / brawl incident.

This temporarily biases interpretation without rewriting the Resident's core identity.

Lean Memory can later explain why the same Resident reacts differently to the same Card or topic after new events.

## 9 · Base social memory

Residents begin as a town that already knows itself. Do not simulate century-old neighbors as strangers at first contact.

Each recurring relationship may begin with a small authored prior:

```text
known habit
old incident
recurring disagreement
shared ritual
one thing I secretly like about them
one thing they always do that annoys me
```

After start, write only meaningful Moment Receipts rather than transcript dumps.

Example:

```json
{
  "kind": "social-episode",
  "actors": ["skeleton-mage", "vampire"],
  "trigger": "card-relay",
  "meaning": "sunlight-card-read-as-mockery",
  "reaction": "brick-fish",
  "closure": "both-laughed-and-resumed",
  "importance": 2
}
```

## 10 · Outside-world / Newsfeed layer

Treat contemporary news and real-world political material as an **optional experimental input layer**, not Resident core identity.

Preferred flow:

```text
bounded factual packet
→ Resident knowledge boundary
→ Resident lens
→ Triplet / thought / performance
→ player closure
```

Avoid:
- omniscient NPC verdicts;
- one official KFB political position;
- identical knowledge for all Residents;
- current-event monologues that turn Residents into news presenters.

The design goal is satirical perspective collision, not a hidden answer key.

## 11 · Character engine summary

Working conceptual stack:

```text
Character Core
→ Worldview / Signature Deck
→ Epistemic Lens
→ Domain Expertise / Jargon
→ Blind Spot / Shadow / Projection
→ Social History
→ Current Moment / POI / Card / Newsbit
→ ChatterBox semantic Triplet
→ optional Fluff-o-lect
→ embodied Performance
→ Lean Memory receipt
→ Resume / Retarget
```

This does not create a new dialogue, memory, news, politics or runtime owner.

## 12 · Design test

A good Resident response should answer at least three questions without exposition:

1. **Why would this Resident notice this?**
2. **Why would this Resident interpret it this way?**
3. **Why would another Resident reasonably disagree?**

If all three Residents would produce the same conclusion with different catchphrases, the characterization is too shallow.

## Status boundary

**DIRECTION:** shared epistemic method culture; perspectival truth; protopian conflict without conflict erasure; Base Social Memory; layered Evidence→Perception→Interpretation→Performance; Triplet and Fluff-o-lect reuse; current preoccupation / Shadow coloring.

**PROPOSAL:** exact per-Resident epistemic profile fields and weighting; outside-world/newsfeed adapters; authored starting relationship priors.

**IMPLEMENTATION:** none in this document.

**PRESERVED OWNERS:** Town character design; ChatterBox; Lean Memory / Journey; Reaction Choreography; Player Almanac; current world/runtime owners.

## Next companion document

`RESIDENT_BASE24_ARCHETYPE_MAP_2026-09-29.md` builds the first source-aware 24-Resident baseline from the current Resident Atlas and Town-specific characters.
