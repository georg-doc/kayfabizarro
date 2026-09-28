# KFB Resident Signature Decks · Worldview, ChatterBox + Card-Recovery Threads · 2026-09-28

Status: **DESIGN PERSISTENCE · SOURCE-BACKED DIRECTION · NOT RUNTIME IMPLEMENTED**  
Owner: **KFB Town Resident Social Memory**  
Branch: `chatgpt-web/town-resident-social-memory-2026-09-28`


## CURRENT INTERACTION-FIRST ADDENDUM · 2026-09-28

This document's Signature-Deck identity model remains valid, but **`RESIDENT_SOCIAL_CARD_RELAY_2026-09-28.md` now carries the preferred gameplay emphasis**.

Current priority:
- Residents primarily **send/show Cards through social encounters**;
- the player actively presents them to other Residents via `SHOW IT → SPIN IT → SELL IT`;
- Signature Decks supply worldview, candidate Cards and reaction stance;
- “recover my lost Deck” remains one optional Resident-specific motive, **not** the universal Card loop;
- Free Roam/Race/Combat/Card Zones remain secondary travel/acquisition routes;
- King Kayfabian's existing five-card Kayfabulation is the higher-order synthesis layer.

Do not interpret Sections 12–15 below as a mandate to make every Resident a missing-Deck fetch quest.

## 1 · Existing Town decision

Current Town source already states:

- every NPC has a favourite / signature / catchphrase deck **or an individual selection within a cluster**;
- personal selection, deck cluster and current card set are different things;
- Moshpit-style mismatches are explicitly welcome;
- a Signature Deck is **not an admission barrier** for what the character may talk about;
- ChatterBox / Monkey-Island selectable retorts remain the dialogue lineage.

This document turns that existing identity rule into one small Resident-facing contract.

## 2 · Core idea

A Resident's Signature Deck is a **stable authored worldview lens**.

It can shape:
- what the Resident notices;
- what they expect;
- which analogies/examples they reach for;
- preferred vocabulary and rhetorical patterns;
- ChatterBox/Triplet candidate content;
- Card POI salience;
- long-running personal goals;
- one lightweight Card-recovery/search thread.

It is not:
- episodic memory;
- objective world truth;
- a full prompt containing every card on every turn;
- a new Card database;
- a requirement that every Resident only discusses one deck.

Useful separation:

```text
STABLE IDENTITY
resident role / archetype
+ signature deck / deck cluster / stance
+ authored voice

CURRENT CONTEXT
visible card / current POI / conversation / activity

LEAN MEMORY
specific meaningful encounters with cards / people / promises

CHATTERBOX
selects a small relevant card/deck seed + current beat
→ Triplet / retort / question / short exchange
```

## 3 · Do not assume every deck is 56 cards

Current KFB card index proves that deck sizes vary.

Examples at the inspected source:
- many decks use **56 cards / 15 pages**;
- `anti_rules_toolkit` / **The Anti-Rules Manifesto** currently reports **57 cards / 16 pages**;
- `the_kayfabe_money_trail_9_11` currently reports **60 cards / 15 pages**;
- `big_bad_brain_wrestling` reports **56 cards / 15 pages**.

Therefore:
- Resident systems store `deckRef`;
- card/page count comes from the current deck index;
- never hard-code 56 or 15 into the Resident contract.

Historical Overworld direction `1 Deck = 56 Cards = 1 World` remains a useful default-era donor, not a safe universal count for the current corpus.

## 4 · Resident Deck Affinity

Working contract:

```ts
type ResidentDeckProfile = {
  residentId: string

  signatureDeckRef: string
  secondaryDeckRefs?: string[]
  clusterRefs?: string[]

  stance:
    | 'aligned'
    | 'devoted'
    | 'curious'
    | 'collector'
    | 'archivist'
    | 'misreads-as-law'
    | 'adversarial'
    | 'confiscate'
    | 'destroy'
    | 'parody'
    | 'obsessed'

  signatureCardRefs?: string[]
  favouriteCardRefs?: string[]
  dislikedCardRefs?: string[]

  worldviewTags: string[]
  voiceProfileRef?: string
  chatterProfileRef?: string

  deckGoal?: {
    kind:
      | 'recover'
      | 'complete'
      | 'find'
      | 'protect'
      | 'archive'
      | 'confiscate'
      | 'destroy'
      | 'distribute'
      | 'study'
    deckRef: string
  }
}
```

The key design point is **stance**.

The same Deck may fit a character directly or through deliberate contradiction.

## 5 · Perfect fit and deliberate mismatch are both valid

### Direct fit

The deck reinforces the visible/archetypal role.

Examples:
- music-oriented Resident ↔ music/performance deck;
- medical Resident ↔ MedKayfab cluster;
- archivist/Lorekeeper ↔ books/history/knowledge deck.

### Productive mismatch

The deck creates tension with the role.

Examples:
- rigid authority figure ↔ Anti-Rules;
- innocent-looking character ↔ conspiratorial/paranoid deck;
- brute ↔ delicate philosophy/art deck;
- clown ↔ extremely dry procedural/medical deck.

Mismatch should be authored, not random.

The question is:
**Why does this Resident care about this Deck?**

That answer creates character.

## 6 · Officer Doppel-Denk × Anti-Rules · unresolved but productive

Technical character:
`toy-soldier`  
Working name:
**Officer Doppel-Denk**

Candidate Signature Deck:
`anti_rules_toolkit` / **The Anti-Rules Manifesto**

Current deck source is real and contains Card concepts such as:
- The Rules Lawyer;
- The Optimizer;
- The Authority Figure;
- other anti-rule / improvisational / authority-friction material.

Three valid authored stances remain open:

### A · `misreads-as-law`

In KFB Land, the Anti-Rules are the rules.

Doppel-Denk earnestly tries to enforce a rulebook whose purpose is to undermine rigid rules.

Comic motor:
```text
obedience
→ anti-rule
→ literal enforcement
→ contradiction
→ doubles down
```

### B · `confiscate / destroy`

He treats the Deck as dangerous contraband.

His personal goal is to recover all missing cards so they can be confiscated/destroyed.

Comic motor:
```text
he must study the forbidden Cards
in order to identify them
→ therefore the anti-rules increasingly shape his language
```

### C · `archivist / evidence locker`

He wants a complete set as evidence of disorder.

The Deck becomes his private case file.

This produces a less one-note relationship than pure hatred.

**No stance is selected by this document.** The contract preserves Georg's open choice.

## 7 · Deck content is a character lens, not objective world truth

Some KFB decks contain:
- satire;
- historical/political material;
- medicine;
- philosophy;
- conspiracy/investigation themes;
- speculative or contested claims.

A Resident speaking from such a deck is expressing:
- an authored Deck source;
- that Resident's stance toward it;
- current Card context.

Do not silently promote Deck prose into authoritative world facts.

Useful provenance label:

```text
knowledgeSource = 'signature-deck'
```

This sits beside:
- witnessed;
- told;
- inferred;
- current visible world state.

For medical/scientific material, current external truth may require separate verification when the product actually presents it as instruction rather than character speech.

## 8 · Deck knowledge is not Lean Memory

Do **not** create one ResidentMemoryReceipt per card.

Deck source content belongs to stable authored knowledge.

Lean Memory only records events such as:
- player returned/showed a specific important Card;
- Resident and player argued about Card X;
- Resident changed their interpretation after Card Y;
- a promised Card has not yet been found;
- a Card caused a memorable prank/performance/conflict;
- Resident heard another character's take on a Card.

This keeps memory small.

## 9 · ChatterBox retrieval stack

For a normal Resident utterance, retrieve a **small** packet:

1. current POI / event;
2. Resident role + motivation;
3. Signature Deck profile + stance;
4. **1–3 relevant Cards** from the Deck/cluster;
5. up to a few relevant Lean Memory receipts;
6. current social-thread state;
7. ChatterBox/Triplet voice constraints.

Never dump the full deck into every dialogue call.

Conceptually:

```text
WORLD BEAT
+ CHARACTER
+ DECK LENS
+ CARD SEED
+ MEMORY
→ CHATTERBOX TRIPLET
```

The Card supplies semantic pressure.
The Resident supplies point of view.
The current scene supplies the reason to speak.

## 10 · Card → Triplet mapping

A Card's existing structured content can seed:
- subject / claim;
- connector / complication;
- reframe / retort;
- question;
- performance beat.

Do not quote whole card text by default.

Preferred transformation:

```text
Card concept
→ semantic takeaway
→ Resident stance
→ short ChatterBox phrase fragment
```

Example for an authority Resident:

```text
visible disorder
+ Anti-Rules / Rules Lawyer seed
+ literal-authority stance
→ observation
→ officious interpretation
→ command
```

Another Resident using the same Card could produce the opposite interpretation.

## 11 · Signature Cards inside the Signature Deck

The full Deck is too broad to define a character on every beat.

Each Resident may therefore have a small high-salience subset:

```text
signatureDeckRef
→ favourite / signature Cards
→ ordinary Deck pool
→ optional cluster / secondary Decks
```

Suggested first scale:
- **3–7 Signature Cards** per Resident;
- larger favourite pool optional;
- whole Deck remains searchable.

Signature Cards can:
- appear more often in ChatterBox retrieval;
- become stronger POIs;
- anchor recurring jokes;
- drive one Card-recovery milestone;
- become recognizable physical objects near the Resident.

This is an authoring convenience, not a new gameplay currency.

## 12 · Lost / missing Deck as a personal goal

A Resident can have a simple persistent goal:

```text
"I want my Deck back."
```

But the reason is character-specific:

- recover it because they love it;
- finish an incomplete collection;
- confiscate it;
- destroy it;
- archive it;
- hide/protect it;
- study it;
- distribute it.

This uses the same Cards as world POIs and existing Card collection systems.

No separate quest engine is required.

## 13 · Avoid the 56-fetch-quest problem

Do not turn a 56–60 Card Deck into 56 identical courier transactions.

The player may still **collect the whole Deck**, but Resident interaction should be chunked.

Recommended flow:

```text
player finds Cards naturally in world
→ Cards enter normal player collection / Almanac truth
→ matching Resident considers them salient
→ on next visit, Resident reacts to all newly relevant Cards
→ one compact handoff/show beat
→ Deck thread advances
```

Useful milestones:
- first Card;
- first Signature Card;
- small thematic subset;
- half-ish / major cluster milestone if useful;
- completed Deck.

Exact thresholds should be authored per Deck and need not be numerical UI goals.

This keeps the Resident from becoming a postbox.

## 14 · Show / return does not need to remove the player's Card

To preserve Card collection and avoid ownership complexity:

```text
PLAYER DISCOVERS CARD
→ Almanac records discovery
→ player brings/shows Card to Resident
→ Resident's Deck thread advances
→ player's discovery remains
```

The resident may narratively say:
- “give it back”;
- “hand it over”;
- “confiscated”;
- “burn this”.

But the player's Almanac can retain the **discovery/provenance record**.

A later physical-card inventory system may model actual transfer separately if needed.

## 15 · Lightweight Deck Thread

Reuse the existing bounded Social Thread idea.

```ts
type ResidentDeckThread = {
  residentId: string
  deckRef: string
  goal: string

  state:
    | 'dormant'
    | 'searching'
    | 'partial'
    | 'milestone'
    | 'complete'
    | 'resolved'

  discussedCardRefs?: string[]
  milestoneRefs?: string[]
  lastMeaningfulBeatRef?: string
}
```

Do not mirror every Player Journey card fact here.

Where possible:
- Player Journey / Almanac owns collection truth;
- Deck Thread derives progress from that collection + meaningful Resident interactions;
- Resident Lean Memory stores only salient episodes.

## 16 · Card as POI

A Card can become especially salient when:

```text
card.deckRef == resident.signatureDeckRef
```

or:
- it is one of the Resident's Signature Cards;
- it belongs to a hated/opposed Deck;
- it closes an open Deck Thread;
- it contradicts the Resident's current stance;
- another Resident is holding/discussing it.

Possible intents:
- notice;
- approach;
- point;
- request;
- quote/paraphrase;
- argue;
- celebrate;
- confiscate;
- hide;
- show to another Resident;
- ask player for help.

The world/Card owner remains source of the actual Card POI.

## 17 · Decks create social triangles

A returned Card should not only produce:

```text
player → Resident
```

It can create:

```text
player shows Card to A
→ A reacts through Signature Deck stance
→ B overhears and has a different Deck lens
→ ChatterBox retort / disagreement
→ optional compact memory receipt
→ everyone resumes
```

This makes one found Card a social catalyst.

## 18 · Deck lens + Resident cultures

### Deck + Dance

A music/performance Card can trigger a Signature Dance or group groove.

### Deck + Gift

A Card can suggest a satirical gift or become the context for one.
The Gift Culture KISS rule still applies: persist the meaning, not item bookkeeping.

### Deck + Brick Fish

A Card argument can escalate into a bounded Brick Fish exchange.

### Deck + Routine

A Resident may interrupt patrol/work to inspect a high-salience Card, then resume.

### Deck + Fluff-o-lect

Shared Card context can carry the omitted word, making Fluff-o-lect more recoverable rather than more random.

## 19 · Card-derived language should remain authored and bounded

Decks should enrich ChatterBox, not turn every Resident into a PDF chatbot.

Avoid:
- reciting lore;
- long summaries;
- repeating card titles constantly;
- stuffing every utterance with theme vocabulary;
- treating one deck as the Resident's entire personality.

Preferred:
- one Deck idea under the sentence;
- current situation still foreground;
- Resident's own voice remains dominant;
- visible action beats speech whenever possible.

## 20 · First mapping pass later

Animation/behavior authoring and Card/deck mapping should remain separate.

A first content pass can map a small set:

```text
Resident
→ signatureDeckRef
→ stance
→ 3–7 Signature Cards
→ 3 worldview tags
→ ChatterBox voice profile
→ deckGoal
```

Do this for a handful of strong Residents before assigning every character.

Candidate first group:
- Officer Doppel-Denk;
- Lorekeeper;
- GothGirl;
- one medical/science-oriented Resident;
- one deliberately mismatched Resident.

No final assignments beyond Doppel-Denk's open Anti-Rules candidate are decided here.

## 21 · First integrated proof

Use one real Resident + one real Deck + a few real Card refs.

Suggested sequence:

```text
Resident has authored Signature Deck profile
→ one Signature Card exists as world POI
→ player discovers it
→ Almanac/player collection records normal Card discovery
→ Resident notices it / player shows it
→ Resident reacts from Deck stance
→ ChatterBox uses current Card + 1–2 Deck seeds + current memory
→ one compact Deck Thread update
→ later another Card reopens the thread
→ Resident language reflects continuity without full-deck prompt dump
```

For Officer Doppel-Denk:
- candidate Deck: Anti-Rules;
- stance deliberately remains selectable;
- one recovered Card should alter the immediate interaction, not rewrite his entire personality.

## 22 · KISS persistence

Durable Resident data can stay tiny:

```ts
type ResidentDeckMemory = {
  residentId: string
  deckRef: string
  stance: string

  meaningfulCardRefs?: string[]
  openDeckThreadState?: string
  lastDeckBeatRef?: string
}
```

Even this can be partly derived from authored profile + Player Journey.

Do **not** duplicate:
- full Deck JSON;
- all collected Card refs already owned by Almanac/Journey;
- card text;
- PDF pages;
- the player's entire collection.

GPT-Site persistence, if used by the receiving runtime, only needs the small dynamic residue that cannot be derived from canonical sources.

## 23 · One conceptual payoff

The same physical Resident now has four connected identity/culture layers:

```text
what they DO
routine / activity / POI bias

what they SAY
ChatterBox + Signature Deck lens

how they PLAY
Brick Fish + Dance + Gifts

what they REMEMBER
small meaningful receipts + open threads
```

The Deck becomes the bridge between KFB's existing Card corpus and the Resident's personality without turning either system into a duplicate of the other.

## One next gate

Keep the integrated gate **RESIDENT-SOCIAL-MEMORY-01**.

Before runtime work, add a small **Resident Deck Mapping pass** for the first few characters:
- exact `deckRef`;
- stance;
- Signature Cards;
- worldview tags;
- Deck Goal.

Then the first integrated Resident proof can consume a real Card POI and real ChatterBox seed instead of placeholder lore.
