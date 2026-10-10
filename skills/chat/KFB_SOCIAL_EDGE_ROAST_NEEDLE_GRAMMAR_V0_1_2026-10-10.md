# KFB Social Edge · Roast / Needle Grammar · v0.1 · 2026-10-10

Status: **AUTHORING FRAMEWORK · NO RUNTIME OWNER**
Owner: KFB ChatterBox / Resident authoring research
Receiving consumers later: existing ChatterBox / Triplet / Resident profiles
Prison consumer: Toy Soldier Guard Corps
Public language: English dialogue; planning may remain German

## 0 · Purpose

Create one shared authoring axis for:
- warm Buddy Banter;
- Clown-style roast;
- darker but still socially human antagonist/heel banter;
- Toy Soldier psychological Needles.

The same Weak Spot may produce very different speech depending on:
- speaker;
- relationship;
- truth proximity;
- power imbalance;
- intent;
- public exposure;
- warmth/repair.

This is not a universal insult generator and not a runtime scoring owner.

## 1 · Core principle

**A joke can target the same fact at different moral temperatures.**

Example target:
`character overestimates own competence`

Buddy:
teases the visible mismatch and leaves room to recover.

Clown:
turns the mismatch into a public performance and lets the target laugh too.

Darker heel / Slatte-like tier:
pushes the contradiction harder and enjoys the embarrassment.

Toy Soldier:
touches the contradiction because anger or defensiveness can become a control pretext.

The difference is not vocabulary.
The difference is **what the speaker wants the wound to do**.

## 2 · WeakSpotProfile

Each recurring Character may later expose a bounded authoring profile:

```ts
WeakSpotProfile {
  characterId

  selfImage[]          // what the character needs to believe about self
  surfaceInsecurities[]// visible, pool-safe
  competenceFears[]    // being useless, cowardly, replaceable, etc.
  statusFears[]        // ignored, demoted, laughed at, ordinary
  belongingFears[]     // excluded, abandoned, unwanted
  contradictions[]     // claim vs behavior
  recurringTells[]     // posture, correction, brag, silence, over-explaining

  privateWounds[]      // story-shaping, not automatically pool-safe
  sealedWounds[]       // never generic pool material
  knownBy[]            // which characters plausibly know what
  repairHooks[]        // ways a warm speaker lets target recover
  retaliationHooks[]   // likely counter-moves / reframes
}
```

The profile stores **authoring facts**, not psychiatric diagnoses.

## 3 · Three depth bands

### BAND A · Surface
Pool-safe by default:
- vanity;
- bad habit;
- obvious contradiction;
- failed boast;
- status anxiety;
- comic cowardice;
- predictable overreaction.

### BAND B · Character wound
Use only with relational/provenance permission:
- abandonment fear;
- parental approval need;
- shame around failure;
- lost vocation/status;
- betrayal;
- grief;
- persistent inadequacy.

These may support strong authored roasts but should not be randomly surfaced by every NPC.

### BAND C · Sealed wound
Not generic roast-pool material:
- sexual abuse;
- severe childhood abuse;
- torture;
- self-harm history;
- similarly high-trauma material.

Such history may shape a Character's behavior and subtext.
It requires **explicit authored scene context** before direct verbal reference.
No random Triplet generator reaches into this band.

## 4 · Knowledge gate

A speaker may only hit a Weak Spot if at least one is true:
- visibly inferable now;
- previously witnessed;
- told directly;
- public/local knowledge;
- supplied by relationship-memory owner;
- explicitly authored dramatic irony.

A Toy Soldier can be perceptive.
He is not magically omniscient.

A false accusation is allowed as a **diegetic claim**, but the authoring record must know that it is false/guessed.

## 4.1 · Visual characterization inputs

Consume:
`KFB_VISUAL_CHARACTERIZATION_WORLD_PERCEPTION_CONTEXT_V0_1_2026-10-10.md`

A Weak Spot may be anchored to a **source-observed visual feature**:
- silhouette;
- face/costume feature;
- signature prop;
- movement tell;
- temporary visible state.

The visual feature is neutral data.
The Social Edge lane decides whether it becomes:
- affectionate banter;
- Clown roast;
- dark-heel pressure;
- Toy Soldier Needle;
- no comment.

A speaker may not invent the history of a visible feature and then treat that invented history as known fact.

## 5 · Edge dimensions

Use these as authoring sliders, not runtime psychology.

Each 0–3 unless stated:

- **T · Truth proximity** — how close the line gets to the real wound.
- **S · Shame exposure** — how much it makes the target feel seen/exposed.
- **P · Power asymmetry** — speaker's ability to impose consequence.
- **I · Destabilization intent** — desire to upset rather than merely tease.
- **A · Audience exposure** — 0–2; private vs public humiliation.
- **W · Warmth / repair** — speaker gives a route back to dignity.
- **R · Reciprocity** — 0–2; target can safely hit back.

Candidate diagnostic score:

`EDGE = 2T + S + P + I + A - W - R`

This number is **not enough to authorize a line**.
Depth band, knowledge and relationship permissions override it.

## 6 · Suggested tonal lanes

### L0 · Buddy Banter
Typical EDGE: 0–3.

Intent:
connection.

Targets:
Band A almost exclusively.

Properties:
- mutual;
- recoverable;
- affectionate;
- target can hit back;
- often ends with shared action or warmth.

### L1 · Clown Roast
Typical EDGE: 4–6.

Intent:
make contradiction visible through performance.

Properties:
- sharper public embarrassment;
- still human;
- visible delight rather than contempt;
- warmth/repair remains available;
- concrete physical/social stakes;
- roast can turn back onto Clown.

The Clown's best roast says:
**"I saw the contradiction. Come stand in it with me."**

### L2 · Dark Heel / Slatte-like / Squette-adjacent
Working lane, exact cast mapping still open.
Typical EDGE: 7–9.

Intent:
win status, unsettle, entertain self/allies.

Properties:
- darker;
- less repair;
- more appetite for embarrassment;
- still personality/play;
- can admire a good counter-hit;
- may respect the target afterward.

Dungeon Squette may sit toward the cooler/funkier side of this lane rather than pure cruelty.

### L3 · Toy Soldier Needle
Typical EDGE: 9–12.

Intent:
**produce usable behavior**.

Properties:
- power asymmetry matters;
- apparent calm;
- narrow true observation;
- shame/status trigger;
- waits for reaction;
- reaction becomes evidence/pretext;
- minimal repair;
- target's anger benefits speaker.

The Soldier's line says:
**"I saw where it hurts. Please demonstrate it for the record."**

### RED · Story-only
High score and/or Band C material.

Not available to generic pools.
Requires authored scene, explicit dramatic purpose and knowledge provenance.

## 7 · Roast transform

One Weak Spot can be transformed by lane:

```
Weak Spot
→ choose visible/proven fact
→ choose lane intent
→ choose truth depth
→ choose public/private frame
→ choose connector
→ choose recovery or no-recovery
→ Triplet
```

The **connector** is often where moral temperature lives.

Same subject:
`"Big hero"`

Buddy connector:
`"until the ladder moved"`

Clown connector:
`"on a four-inch stage"`

Dark heel connector:
`"while everyone watched"`

Toy Soldier connector:
`"once I called you frightened"`

The noun is not the cruelty.
The relation is.

## 8 · Toy Soldier formula

Preferred authoring shape:

`VISIBLE DETAIL → TRUE-ENOUGH NEEDLE → WAIT → TARGET REACTION → SOLDIER FRAME → CONSEQUENCE`

Triplet compression:

`SUBJECT = target self-image / current behavior`
`CONNECTOR = precise weak-spot pressure`
`REFRAME = reaction becomes authority evidence`

Example mechanism only:
`Brave man / correcting me twice / nervous behavior`

Not frozen copy.

## 9 · Clown formula

Preferred shape:

`VISIBLE CONTRADICTION → PHYSICALIZE / STAGE IT → OFFER TARGET A WAY TO PLAY BACK`

Triplet compression:

`SUBJECT = grand claim`
`CONNECTOR = small concrete stage/test`
`REFRAME = shared comic consequence`

Warmth does not mean softness.
The Clown may hit hard, but does not need the target diminished afterward.

## 10 · Repair budget

A good authoring distinction:

### Buddy / Clown
Usually contains at least one repair path:
- self-deprecation;
- shared laugh;
- target counter-roast;
- affectionate action;
- new task;
- admission.

### Dark heel
Repair is optional.

### Toy Soldier
Repair is normally absent because unresolved reaction is useful to him.

However, **scene design** must still allow the player/Resident a counter-move:
- reframe;
- walk away;
- BLÖDSINN!;
- BOGGLE;
- cartoon retaliation;
- expose Soldier contradiction;
- authority reversal.

This prevents the dialogue system from becoming a one-way abuse simulator.

## 11 · Audience effect

Audience changes roast temperature.

Same line:
- private Buddy Banter can be intimate;
- stage Clown Roast can be consensual/playful;
- public Soldier Needle can become humiliation because the audience is part of enforcement.

Therefore audience/proximity should be available authoring context when real owner data supplies it.

## 12 · Prisoner numbering · Georg decision

**Prisoners receive custody numbers.**

This is a Prison Planet presentation/identity layer.

Rules:
- custody number is not the Character's true identity or global ID;
- actual Resident/player name remains owned elsewhere;
- Toy Soldiers prefer number address during custody;
- other Residents may continue using names;
- prisoners may deliberately misuse, swap, refuse or parody numbers;
- repeated prisoner may acquire social meaning around the number;
- number assignment/persistence must later use existing custody/world save owner, not ChatterBox.

This creates a useful contrast:
**guards have chosen institutional number-identity; prisoners have number-identity imposed on them.**

## 13 · Number-play opportunities

Proposal examples:
- prisoners swap numbers to break guard certainty;
- two guards disagree which prisoner is which;
- a Frost Orc proudly answers to the wrong number;
- an inmate keeps a number after release as a badge;
- No. 1 treats a wrong number as more serious than a wrong person;
- a prisoner knows every guard number while guards cannot remember one inmate's name.

Do not force all of these into implementation.

## 14 · Character-specific weak spots

Later Resident profiles can contain 3 layers:

1. **Public Tell**
   - what strangers can notice.
2. **Known Weak Spot**
   - relationship/history-gated.
3. **Private Wound**
   - author-only unless explicitly surfaced.

Toy Soldier pool should mostly operate on 1 and selectively 2.

Clown can use 1 and trusted portions of 2.

Buddy Banter uses relationally safe 1/2.

Band C remains authored-scene only.

## 15 · Anti-patterns

Reject:
- generic "your mother never loved you" insults;
- trauma as instant depth;
- diagnostic labels used as insults;
- random childhood exposition;
- slurs as shortcut for darkness;
- relentless humiliation with no counterplay;
- every villain discovering the exact same wound;
- weak spots that exist only to be attacked;
- insult escalation measured solely by profanity.

Darkness comes from:
**precision + truth + intent + asymmetry**.

## 16 · Next authoring work

Recommended next slice:
build **relationship-calibrated micro-scenes** from the same Weak Spot.

For 3–4 characters:
- Buddy version;
- Clown Roast;
- dark heel / Slatte-like version;
- Toy Soldier Needle.

Test:
- same factual target;
- different connector/intention;
- different repair budget;
- distinct voice;
- counter-move available.

This is the fastest way to calibrate the lanes before expanding the pool.

## 17 · Boundary

No runtime scoring.
No mental-health diagnosis engine.
No automatic trauma mining.
No new dialogue owner.
No police heat.
No custody system implementation.
No current World write.
No Site/Stage.
No merge/Live.

Next authoring gate:
**SOCIAL_EDGE_WEAKSPOT_MICROSCENES_01**
