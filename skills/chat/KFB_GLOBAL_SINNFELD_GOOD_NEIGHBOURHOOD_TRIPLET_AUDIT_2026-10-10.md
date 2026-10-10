# KFB Global Semantic Fields / Good Neighbourhood / Triplet Audit · 2026-10-10

Status: **GLOBAL AUTHORING RECONCILIATION · NO RUNTIME OWNER CHANGE**
Owner for this prep: existing ChatterBox / Resident authoring research
Current implementation owners remain unchanged.
Branch: `planning/kfb-fluff-crafting-almanac-ideation-2026-10-09`

## 0 · Why this audit exists

Georg asked to verify that the current dialogue / Triplet / visual-perception work still carries the older KFB/Mnemosyne construction logic:

- Markus Gabriel / Sinnfelder;
- Aby Warburg / good neighbourhood;
- fractal construction across scales;
- Denkbewegungen;
- character-specific vocabulary, semantic fields and socio-cultural/temporal registers;
- player closure rather than explanatory NPC wrap-up.

Conclusion:

**The conceptual spine already exists in several KFB layers, but the current game authoring model lacks one explicit bridge: a character-level Semantic/Register profile that turns those ideas into repeatable Triplet selection.**

This file reconciles the pieces without creating a new runtime.

## 1 · Current GitHub evidence

### A · Fractal Canvas masterplan

`skills/chat/masterplan/FRACTAL_CANVAS_NARRATORS_AND_PLAY_2026-09-14.md`

Current user direction already states:
- Warburg: meaning emerges from image neighbourhood / re-ordering;
- Gabriel/Sinnfelder: the same object changes meaning in different contexts;
- fractal thinking applies across **figure → Card → Page → Deck → room → Town → world**;
- player closure remains authoritative;
- satire should emerge from constellation/consequence rather than explanatory punchline.

### B · Public Fractal Almanac language

Current GitHub public source describes Warburg's good neighbourhood in KFB terms as:
**two neighbouring images producing a third meaning belonging to neither alone.**

This is directly compatible with Triplets.

### C · Historical Overworld class logic

`overworld/docs/MASTERPLAN_overworld.md`

Historical Georg decision:
`Doctrine · Actor Form · Sinnfeld`

This proves Sinnfeld was already treated as part of Character/class interpretation, not only museum theory.

It is historical product logic, not automatically current runtime API.

### D · Current Semantic Triplet grammar

Current ChatterBox donor:
`subject → connector → reframe`

Current rules already preserve:
- signature weighting rather than private catchphrase banks;
- speaker worldview;
- relationship context;
- player/audience/world closure;
- silence as valid;
- relation classes such as CATEGORY_SHIFT / ESCALATION / COLLISION / MISFIT / SYNERGY.

### E · Current Voice research

Current Style Reference live data contains:
**Differentiate voice through worldview, sociolect, cadence and response habits.**

Therefore a voice is already understood as more than vocabulary.

### F · Archaic-language precedent

Historical Overworld/TTS fixtures already include:
- `Methinks...`
- `Verily...`

So archaic English markers are not a new foreign style idea.

What is missing is a bounded per-Character policy controlling **when and how often** such markers appear.

### G · Current Visual / Media perception prep

Current files:
- `KFB_VISUAL_CHARACTERIZATION_WORLD_PERCEPTION_CONTEXT_V0_1_2026-10-10.md`
- `KFB_DIALOGUE_PERCEPTION_CONTEXT_PACKET_V0_1_2026-10-10.json`

They make Character visuals, current Cards and current Billboard/Quote records available as grounded context.

This is the missing sensory anchor needed to make Sinnfeld / good-neighbourhood dialogue feel embodied rather than abstract.

## 2 · Historical authoring line recovered outside current game schema

Prior KFB/Mnemosyne/NOS work also used:
- Good Neighborhood as **fertile adjacency**;
- Sinnfelder as named context/boundary operators;
- Denkbewegung selection;
- separation of **validity** from **fertility/resonance**;
- semantic parallel / causal link / tension / paradox;
- associative but non-random fragment combination.

Current GitHub contains the higher-level Warburg/Gabriel direction, but the exact older Architect/Alchemist authoring implementation is not pinned here as a current game source.

Classification:
**HISTORICAL AUTHORING LINE · CURRENT GITHUB HOME UNRESOLVED**

Do not invent a runtime dependency on an unavailable old engine.
Reuse the principles through current Triplet/ChatterBox owners.

## 3 · One global principle

**Meaning is field-relative and relation-generated.**

A Card, quote, hat, eyepatch, grave, tower or sentence does not carry one final dramatic meaning.

Meaning emerges from:

`ANCHOR A + SPEAKER SINNFELD + ANCHOR B + RELATION / GUTTER → OFFERED THIRD MEANING`

Player/other Character may accept, reject or reframe it.

This is Warburg + Gabriel + McCloud in one KFB operation without claiming they are philosophically identical.

## 4 · Triplet as micro Good Neighbourhood

The current Triplet can be read as:

`SUBJECT = Anchor A`

`CONNECTOR = relation / neighbourhood / gutter`

`REFRAME = emergent third meaning`

Therefore the connector is structurally critical.

A weak Triplet merely repeats A in B.

A fertile Triplet puts two grounded things close enough to resonate but different enough to create a new interpretation.

## 5 · Fertility test for authoring

Before keeping a semantic neighbour pair, ask:

1. **Grounded?**
   Are both anchors actually present/known/remembered?

2. **Related?**
   Is there at least one meaningful shared dimension?

3. **Different?**
   Is there a decisive difference preventing simple synonymy?

4. **Productive?**
   Does the relation create a third reading, action, question or status shift?

5. **Economical?**
   Does the relation need few extra invented assumptions?

6. **Open?**
   Does it leave closure to the player/other speaker rather than explain itself shut?

Reject:
- same idea twice;
- random surreal adjacency with no shared dimension;
- lore injection unsupported by context;
- over-explained symbolic interpretation.

## 6 · SinnfeldProfile

Additive authoring concept, not runtime requirement:

```ts
SinnfeldProfile {
  characterId

  coreFields[]
  neighbourFields[]
  lowAffinityFields[]

  temporalRegister
  culturalRegister
  epistemicMode

  lexicalFields[]
  metaphorDomains[]
  preferredThoughtMoves[]
  preferredAdjacencyTypes[]

  syntaxTendencies[]
  discourseHabits[]
  archaicMarkers[]
  codeSwitchTriggers[]

  claimPolicy
  uncertaintyStyle
  humorRegister
  speechAvoid[]
}
```

This complements, rather than replaces:
- Resident conversation profile;
- Attitude/Affect;
- relationship memory;
- Social Edge;
- Visual Characterization.

## 7 · Meaning fields vs facts

A Sinnfeld is **not** a factual knowledge database.

Example:
the Vampire may interpret a tower through fields of:
- lineage;
- ritual;
- night;
- secrecy;
- memory;
- celestial cycles.

The Toy Soldier may interpret the same tower through:
- watch;
- rank;
- visibility;
- custody;
- control.

The Lorekeeper may interpret it through:
- provenance;
- archive;
- witness;
- source.

Same object.
Different field.
No need to invent different world truth.

## 8 · Denkbewegung layer

Candidate thought moves for authoring:

- JUXTAPOSE;
- COMPARE;
- CONTRAST;
- INVERT;
- HISTORICIZE;
- ANALOGIZE;
- CONCRETIZE;
- TRACE_CAUSE;
- TRACE_PROVENANCE;
- CATEGORY_SHIFT;
- SCALE_SHIFT;
- ROLE_REVERSAL;
- VISUAL_RHYME;
- ANACHRONISM;
- QUESTION_PREMISE.

These are authoring-selection labels.
They do not replace current Triplet relation classes.

A later adapter may map a thought move onto an existing relation:
- CATEGORY_SHIFT;
- ESCALATION;
- COLLISION;
- MISFIT;
- SYNERGY.

## 9 · Good-neighbourhood retrieval

A dialogue candidate should normally begin with **two real anchors** from current context:

Possible Anchor A:
- visible Character feature;
- current action;
- Weak Spot;
- actual Card motif;
- current Billboard quote;
- POI;
- memory.

Possible Anchor B:
- speaker Sinnfeld;
- second visible feature;
- current media motif;
- prior callback;
- local history;
- another Resident.

Then:

`A → choose thought move → retrieve B → connector → reframe`

The surprise should come from the **relation**, not an invented third database fact.

## 10 · Fractal application

The same operation works at multiple scales:

### Word
Fluff-o-lect creates a semantic gap.

### Triplet
Two anchors plus connector create a third reading.

### Dialogue
One speaker reframes another's field.

### Card pair
Two Cards make a new relation.

### Billboard + Character
Current media becomes commentary on the nearby Character.

### Place + Resident
A habitat changes what a Character trait means.

### Island + world
One island's ideology/worldview reframes another.

This is the practical meaning of fractal construction here:
**same relation-operation, different scale — not the same content duplicated everywhere.**

## 11 · Speech register as Sinnfeld surface

Different age/culture/worldview should affect:
- available words;
- metaphors;
- sentence rhythm;
- assumptions;
- examples;
- temporal reference;
- what counts as evidence;
- what seems absurd.

Do not implement historical voice as catchphrase garnish.

Bad:
every old Character says `verily` every line.

Better:
the Character's **thought movement and vocabulary field** feel old even when no archaic marker appears.

Archaic markers should be sparse, authored/weighted and Character-specific.

## 12 · Social Edge connection

Social Edge determines moral temperature.
Sinnfeld determines **what the speaker notices and how it connects**.

Pipeline:

`Perception → Sinnfeld → Denkbewegung → Social Edge → Triplet → closure`

This is more useful than:
`Character → random phrase bank`.

## 13 · Current implementation gap

Already present:
- Triplet grammar;
- relation classes;
- Resident profiles;
- Attitude/relationship filters;
- Social Edge;
- Visual Characterization prep;
- Card artworkPrompt;
- Billboard quote context;
- current world/activity context;
- voice/sociolect authoring principles.

Missing:
- explicit Sinnfeld/Register profile per Character;
- reviewed visual Character feature corpus;
- one retrieval adapter combining two grounded anchors;
- one bounded optional LLM contract using that packet;
- runtime proof.

Therefore:
**the architecture is mostly compositional, not missing a new engine.**

## 14 · Recommended authoring data model

Do not create one huge Character JSON owner.

Use references:
- source/rig/props → Resident Atlas;
- visual semantic features → Visual Characterization;
- worldview/register → Sinnfeld/Register profile;
- relationships/memory → Resident Life;
- Social Edge → shared authoring grammar;
- Card/media context → external owners;
- Triplet selection → ChatterBox.

Character authoring packet composes these refs at use time.

## 15 · Global next step

Do not mass-author every Character.

First six:
1. Toy Soldier;
2. Survivalist;
3. Clown;
4. Skeleton Warrior;
5. Lorekeeper;
6. Vampire.

For each:
- source-observed visuals;
- one Sinnfeld/Register profile;
- 4–8 core/neighbour fields;
- 3–5 preferred thought moves;
- Social Edge tendency;
- speech-register notes;
- one Card/Billboard-aware micro-scene.

Then compare whether the **same Card / quote / visible feature** is interpreted differently.

## Boundary

No second dialogue engine.
No new truth owner.
No generic LLM memory.
No current World runtime write.
No canon promotion of historical unresolved masters.
No Site/Stage.
No merge/Live.

Next global authoring gate:
**SINNFELD_REGISTER_PROFILE_PILOT_01**
