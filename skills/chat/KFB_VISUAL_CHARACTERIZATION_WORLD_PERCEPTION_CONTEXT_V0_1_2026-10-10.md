# KFB Visual Characterization + World Perception Context · v0.1 · 2026-10-10

Status: **AUTHORING / CONTEXT-ADAPTER PREP · NO RUNTIME OWNER**
Owner: existing KFB ChatterBox / Resident authoring research
Receiving consumers later: ChatterBox / Triplet selector / optional LLM dialogue calls
World/media owners remain external.
Branch: `planning/kfb-fluff-crafting-almanac-ideation-2026-10-09`

## 0 · Product idea

Characters should not merely remember lore. They should be able to **refer to what is visibly present in their world**.

Three existing KFB data families already support this:

1. **Cards**
   - canonical per-Card JSON already carries `cardName`, `power`, `lore`, `gradeReason`, `artworkPrompt`;
   - `artworkPrompt` already describes style, subject and mood;
   - existing `world-context.js` and Billboard H13 consume this semantic layer.

2. **Hypernormalisation / Quote Billboard**
   - Quote owner PR #354 already carries stable quote ID, text, author, work, themes, deck/card refs, FrizzleQuestion, provenance and rights;
   - Billboard donor UI already exposes current `quoteId` and current playback phase.

3. **Characters**
   - Resident Atlas / EyeRig coverage already pins actual source models, rigs, props and references;
   - what is missing is a small **visual characterization semantic layer** comparable to a Card's `artworkPrompt`.

The target is therefore not a new vision AI system.

Target:
`existing source data → compact read-only perception context → ChatterBox/Triplet/optional LLM`

## 1 · Why this matters

Dialogue becomes world-anchored when a speaker can refer to:
- the other Character's visible silhouette/features/props;
- a recurring tell or costume detail;
- the current Card image motif;
- the current quote/author/question on the Billboard;
- the current POI/activity/event;
- prior relationship knowledge.

This produces lines that feel observed rather than randomly generated.

Example distinction:

Generic:
`"You look ridiculous."`

World-anchored:
a Character notices a hat number, plume, moustache, eyepatch, axe, microphone, staff, damaged shield, current screen motif or actual Card subject and builds the beat from that real detail.

## 2 · Three-layer visual truth

Every visual characterization item must carry one of three truth classes.

### A · SOURCE_OBSERVED
Actually visible in a source-isolated Character model/promo/reference.

Eligible for:
- `VISIBLE_NOW` dialogue;
- roast/banter;
- scene description;
- LLM context.

### B · USER_AUTHORED_OR_REPORTED
Georg states or proposes a visible trait, but current source-isolation proof has not yet been recorded.

Eligible for:
- design/authoring candidate;
- future extraction checklist.

Not yet eligible for runtime "the Character can see this" claims.

Current examples to verify:
- Toy Soldier: comic pink cheeks / moustache;
- Survivalist: eyepatch.

### C · STORY_HYPOTHESIS
Interpretation or possible history inspired by a visible trait.

Examples:
- how an eyepatch was acquired;
- whether a scar came from a named incident;
- whether a Guard caused an injury;
- whether a costume detail has hidden institutional meaning.

A Story Hypothesis is **never promoted to Character history merely because an LLM invented it**.

It becomes fact only through explicit author decision / accepted story owner.

## 3 · VisualCharacterization candidate

Do not duplicate mesh/material/rig truth.

The semantic record references the source Character and adds dialogue-facing observations.

Candidate shape:

```ts
VisualCharacterization {
  characterId
  sourceCharacterRef
  sourceStatus

  silhouette: string[]
  faceFeatures: VisualFeature[]
  bodyFeatures: VisualFeature[]
  costumeFeatures: VisualFeature[]
  carriedProps: VisualFeature[]
  movementReads: VisualFeature[]
  recurringTells: VisualFeature[]

  socialReads: string[]
  comicAffordances: string[]
  banterHooks: BanterHook[]

  extractionStatus
  lastSourceIsolationRef?
}
```

### VisualFeature

```ts
VisualFeature {
  featureId
  label
  description
  truthClass: SOURCE_OBSERVED | USER_AUTHORED_OR_REPORTED
  visibility: NEAR | MID | FAR | PROP_DEPENDENT
  persistence: STABLE | COSTUME_STATE | ACTIVITY_STATE
  sourceRef?
  roastSafe: boolean
  storyHypothesisAllowed: boolean
}
```

### BanterHook

A BanterHook is not a joke line.

It says what kind of transformation a feature affords:
- status deflation;
- silhouette exaggeration;
- prop irony;
- role contradiction;
- grooming/costume tease;
- wear/damage callback;
- symmetry/asymmetry;
- overcompensation.

The actual line still comes from the speaker's Social Edge lane.

## 4 · Feature is not flaw

Do not encode:
`eyepatch = flaw`

Encode:
`eyepatch = visible feature`

Then the authoring layer decides whether it becomes:
- affectionate nickname;
- Clown visual gag;
- dark heel status jab;
- Toy Soldier Needle;
- serious history beat;
- no comment.

This keeps appearance data neutral and reusable.

## 5 · Social Edge connection

Consume:
`KFB_SOCIAL_EDGE_ROAST_NEEDLE_GRAMMAR_V0_1_2026-10-10.md`

Pipeline:

`VisibleFeature + WeakSpot + Relationship + SocialEdgeLane → Triplet / dialogue move`

Examples:
- Buddy Banter may tease the feature but offer repair;
- Clown can physicalize/exaggerate it;
- Dark Heel can use it for status pressure;
- Toy Soldier can use a precise visual observation to provoke behavior.

A visible feature does not grant knowledge of its history.

## 6 · Visual feature → story hypothesis

A visible feature may invite story generation without declaring truth.

Candidate pattern:

`feature → 2–4 possible hypotheses → Character reactions → NONE becomes canon automatically`

For an eyepatch, possible authoring routes might include:
- mundane accident;
- heroic exaggeration;
- embarrassing accident;
- prison incident;
- self-authored myth;
- nobody knows.

The interesting dialogue may be that different Residents believe different stories.

That is better than one LLM call silently deciding the biography.

## 7 · Card visual perception

Canonical source already exists.

When a Card is current, a read-only CardPerception may include:

```json
{
  "deckId": "...",
  "cardNumber": 1,
  "cardName": "...",
  "power": "...",
  "lore": "...",
  "gradeReason": "...",
  "artworkPrompt": "Style: ... Subject: ... Mood: ...",
  "semanticSource": "CANONICAL_CARD_JSON"
}
```

Dialogue may respond to:
- named subject;
- physical motif;
- action depicted;
- mood;
- contradiction between visual and text;
- similarity to a visible Resident/world object.

Do not require Computer Vision when the Card semantic source already describes the image.

If actual rendered artwork and prompt diverge materially, the real Card artwork/provenance owner remains final visual truth.

## 8 · Existing proof that artworkPrompt is useful

Current KFB code already treats `artworkPrompt` semantically:
- Viewer API exposes it;
- `world-context.js` reads it into Card semantic vectors;
- Mood from `artworkPrompt` is explicitly weighted;
- Billboard H13 already generated SHOW IT → SPIN IT → SELL IT Card text using Card text plus artwork-prompt Mood.

Therefore this proposal extends an existing seam rather than inventing a new semantic source.

## 9 · Hypernormalisation / Billboard perception

PR #354 remains the quote/content owner.
Billboard/MediaSurface remains the current presentation owner.

A future read-only BillboardPerception should expose only the currently active owner record, for example:

```json
{
  "mediaKind": "QUOTE",
  "quoteId": "...",
  "phase": "quote | attribution | question | brainfood",
  "text": "...",
  "author": "...",
  "work": "...",
  "themes": ["..."],
  "frizzleQuestion": "...",
  "cardRefs": [],
  "provenanceStatus": "...",
  "rightsStatus": "..."
}
```

For Card mode:

```json
{
  "mediaKind": "CARD",
  "deckId": "...",
  "cardNumber": 1,
  "cardName": "...",
  "artworkPrompt": "..."
}
```

ChatterBox never owns the Billboard schedule.
It only receives the currently visible record.

## 10 · World Perception Context packet

Candidate read-only packet:

```ts
DialoguePerceptionContext {
  speaker
  target?: {
    characterId
    visualCharacterization
    visibleFeaturesNow[]
  }

  media?: {
    billboard?
    currentCard?
  }

  scene: {
    poi?
    activity?
    witnessedEvent?
    nearbyResidents?
  }

  relationship?: {
    band
    knownWeakSpots[]
    rememberedVisualCallbacks[]
  }

  socialEdge?: {
    lane
    repairBudget
    reciprocity
  }
}
```

This can feed either:
- deterministic Triplet selection;
- authored pools;
- optional LLM call.

LLM is not required for baseline dialogue.

## 11 · Perception budget

Do not dump entire Character/Card/Billboard databases into each prompt.

Priority:

1. current visible target;
2. current world event/activity;
3. current visible Billboard/Card;
4. relationship-relevant memory;
5. one or two stable visual Character facts;
6. broader lore only when needed.

Existing KFB principle still applies:
**A bubble gets only as much world as its beat can pay for.**

## 12 · Surprise without randomness

The desired surprise comes from **unexpected relation between real context elements**, not from hallucinated trivia.

Good:
- Soldier compares a prisoner's hat/eyepatch to the current Billboard image;
- Clown links a Card's visual motif to the target's prop;
- Lorekeeper notices that the quote attribution contradicts a Resident's retelling;
- Skeleton interprets a skull motif differently from a living Resident;
- two Characters disagree about what an image means.

Bad:
- LLM invents a missing limb/history;
- LLM knows a Card not currently present;
- LLM quotes a Billboard item not currently selected;
- LLM turns a visual metaphor into engine truth.

## 13 · Visual callback memory

Useful durable memory is not:
`every visual feature ever seen`

Candidate memorable visual callbacks:
- first time a Character sees a dramatic costume change;
- broken/repaired prop;
- newly acquired eyepatch/scar/hat;
- embarrassing outfit state;
- recurring custody number;
- Character repeatedly compared with a Card/Billboard motif.

Relationship Memory owner decides what persists.

## 14 · Classes / skeletons / variants

Visual characterization should work at three levels:

### Character instance
Unique:
- current costume;
- damage;
- custody number;
- prop;
- relationship-specific nickname.

### Character archetype / Resident
Stable:
- silhouette;
- face;
- usual outfit;
- signature props;
- stable visual quirks.

### Class/family
Shared:
- Skeleton family;
- Orc family;
- Toy Soldier Corps;
- Farmers;
- Animatronics;
- etc.

A class record must not erase individual differences.

Example:
`skeleton` can carry class-level visual/social affordances while Skeleton Warrior/Rogue/Mage retain their own props/silhouettes.

## 15 · Coverage strategy

Do not hand-write unverified descriptions for all models from filenames.

Current source pools:
- **21** current Resident Atlas entries;
- **49** source-pinned Mystery/Character coverage entries.

Process:

`source model/reference isolation → feature extraction → human/agent review → SOURCE_OBSERVED → dialogue eligibility`

This is ideal Asset Librarian / Resident Atlas work and can later be semi-automated.

## 16 · Initial user-reported candidates

Keep these as **PENDING SOURCE ISOLATION**, not current source fact:

### Toy Soldier
User proposes/recalls:
- pink/comic cheeks;
- moustache;
- hat/plume/number already part of current prison visual direction.

Potential authoring value:
- over-serious authority contrasted with doll-like face;
- grooming/status tease;
- Number identity vs ornamental individuality.

### Survivalist
User reports:
- eyepatch.

Potential authoring value:
- visual nickname/tease;
- conflicting stories about how eye was lost;
- later authored Prison/Panopticon connection possible.

Important:
"Toy Soldier blinded him" is currently a **story hypothesis**, not fact.
It may become a strong dark-history option later if explicitly chosen.

## 17 · LLM contract

If an LLM is used, prompt context should distinguish:

`SEEN FACTS`
`KNOWN RELATIONSHIP FACTS`
`CURRENT MEDIA`
`DIEGETIC CLAIMS`
`STORY HYPOTHESES`
`FORBIDDEN INVENTION`

LLM output should return:
- one or more candidate Triplet/dialogue moves;
- which input facts were used;
- whether any line contains a new hypothesis;
- Social Edge lane;
- optional repair/countermove.

A generated hypothesis is not persisted as fact automatically.

## 18 · Ownership

Keep:
- Card JSON / artwork/provenance = Card owner;
- Quote records / provenance / rights = PR #354 Quote owner;
- Billboard playback/current visible item = Billboard/MediaSurface owner;
- Character mesh/rig/props = Resident Atlas / Asset owners;
- relationship memory = Resident Life/Memory owner;
- dialogue semantics/speaker/budget = ChatterBox;
- Social Edge / Visual Characterization = authoring metadata;
- LLM = optional expression consumer, never truth owner.

## 19 · First practical proof later

One tiny dialogue proof is enough:

Actors:
- Toy Soldier;
- Survivalist or another source-isolated Resident.

Context:
- one visible Character feature;
- one currently displayed canonical Card or approved quote;
- one relationship Weak Spot;
- one Social Edge lane.

Generate:
1. deterministic Triplet candidate;
2. optional LLM variation;
3. visible provenance/context receipt.

Pass if:
- line clearly refers to something actually present;
- no invented visual fact;
- no invented media record;
- no hidden biography promoted;
- different speaker lane changes the same observation meaningfully.

## 20 · Boundary

No Computer Vision runtime required.
No second Card/Quote/Billboard owner.
No Resident Atlas mutation in this prep.
No LLM requirement.
No automatic biography generation.
No automatic visual insult generator.
No Open World runtime write.
No Site/Stage.
No merge/Live.

Next authoring/data gate:
**VISUAL_CHARACTERIZATION_SOURCE_EXTRACTION_01**

Extract a small source-isolated set first:
Toy Soldier · Survivalist · Clown · Skeleton Warrior · one additional main Resident.
Then run:
**SOCIAL_EDGE_WEAKSPOT_MICROSCENES_01**
using real visual context.
