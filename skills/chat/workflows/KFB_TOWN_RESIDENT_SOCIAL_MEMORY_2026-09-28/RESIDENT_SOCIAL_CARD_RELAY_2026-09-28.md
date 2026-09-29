# KFB Resident Social Card Relay + Kayfabulation Loop · 2026-09-28

Status: **CURRENT DESIGN PROPOSAL · INTERACTION-FIRST · NOT RUNTIME IMPLEMENTED**  
Owner: **KFB Town Resident Social Memory**  
Branch: `chatgpt-web/town-resident-social-memory-2026-09-28`

## 1 · Why this revision exists

The previous Signature-Deck checkpoint emphasized:
- Resident worldview;
- Signature Deck / Signature Cards;
- Card POIs;
- optional lost/recovered Deck threads.

Georg's current preferred direction shifts the **gameplay emphasis**:

> Cards should move primarily **through Residents and social interaction**, not primarily through searching the landscape.

The player learns Cards because Residents:
- introduce them;
- hand them over;
- ask the player to bring/show/pitch them to somebody else;
- react to the player's presentation;
- sometimes send a response Card or new social task back.

World exploration, Race, Combat, Card Zones and other minigames remain useful, but mainly as:
- travel/connective tissue;
- occasional acquisition route;
- obstacle or detour;
- special proof/challenge;
- source of missing exceptional Cards.

This document **does not delete** landscape discovery or Card recovery. It demotes them from default loop to secondary routes.

## 2 · Existing source grammar already supports this

### Town social grammar

Current Town decisions already provide:
- Monkey-Island-style selectable lines;
- collectible retorts;
- encounter beats separated from animation/text layers;
- favourite/signature/catchphrase Decks;
- Cards as visible encounter material.

### Town / Tourbus performance arc

Current source explicitly retains:

```text
Actor / POV
→ SHOW IT
→ SPIN IT
→ SELL IT
→ Quest / Endpanel / player closure
```

### Freestyle card-entry ritual

Current Kayfabizarro Freestyle rules provide a separate, compatible card-entry ritual:

```text
NAME IT
→ CLAIM IT
→ POWER IT
```

Do not silently merge these into one renamed rule.

Useful social interpretation:

```text
Resident introduces Card to player
→ NAME / CLAIM / POWER establishes the Card

player brings Card to another Resident
→ SHOW / SPIN / SELL performs the social handoff
```

### King / Kayfabulation

Existing Overworld/Kayfabulation donor already defines the five-card composition:

```text
Actor Card
+ Scene Card 1
+ Scene Card 2
+ Scene Card 3
+ Quest Card
```

The player later assembles these at King Kayfabian and constructs connective logic before the Kayfabulated performance.

This is a natural **higher-order synthesis** of Cards learned through Resident life and minigames.

## 3 · Proposed primary game loop

```text
Resident A has a Card to say / send
→ A introduces Card to player
→ player learns / discovers Card
→ A names target Resident B or social purpose
→ player travels through world
→ player meets B
→ SHOW IT
→ SPIN IT
→ SELL IT
→ B reacts through personality + Deck stance + Lean Memory
→ Reaction Choreography / ChatterBox / retort
→ outcome may create:
   counter-Card
   new retort
   new social thread
   Gift / Brick Fish / Dance reaction
   optional minigame detour
→ player continues
→ Almanac grows
→ periodically King Kayfabian Kayfabulation synthesizes collected Cards
```

The **core pleasure** is the Resident interaction.
Movement/minigames create spacing, surprise and context between those interactions.

## 4 · The player is not a postman

A plain courier quest is:

```text
take object A
→ walk
→ click NPC B
→ reward
```

That is not the intended loop.

The KFB Card Relay requires the player to **perform interpretation**.

The Card is not merely delivered.
It must be presented.

The player chooses how to:
- show it;
- frame it;
- sell it.

Different choices can create different recipient reactions without requiring a branching dialogue tree.

The important game action is:
**what did you make this Card mean to this Resident?**

## 5 · SHOW IT / SPIN IT / SELL IT as Monkey-Island interaction

Working social interpretation:

### SHOW IT

Choose what aspect of the Card to foreground.

Possible candidate choices:
- visual/character;
- Card name;
- Power;
- Lore/concept;
- one sender-emphasized detail.

This establishes the object of attention.

### SPIN IT

Choose the framing.

Possible candidates:
- sender's intended reading;
- player's own interpretation;
- a learned retort/reframe;
- a Deck-derived stance;
- a deliberately provocative reading.

This is where the player begins to own the presentation.

### SELL IT

Commit to the social move.

Examples:
- “you need this”;
- “this proves your point”;
- “this proves the opposite”;
- “A says this is for you”;
- “you should pass this on”;
- “King K. Fabian should see this”;
- “I dare you to play it”.

SELL IT is a performative commitment, not a shop/economy transaction.

## 6 · ChatterBox integration

The three interaction steps should use existing ChatterBox/Triplet logic rather than a new dialogue tree.

Input packet can remain small:

```text
current Card
+ sender intent / sender stance
+ player's selected SHOW/SPIN/SELL path
+ recipient identity / Signature Deck stance
+ current relationship/social thread
+ 1–3 relevant Cards
+ small Lean Memory retrieval
→ response candidates
```

Player-facing response UI remains Monkey-Island-like:
- a compact list of meaningful choices;
- selection is the move;
- no sprawling branch tree.

## 7 · Sender and receiver both teach the Card

A powerful learning loop is:

```text
sender explains Card one way
→ player carries that interpretation
→ receiver reacts differently
→ player learns the gap
```

Therefore one Card can teach:
- its source content;
- sender worldview;
- receiver worldview;
- rhetorical framing;
- KFB closure.

The player learns Cards by **using them socially**, not only reading them in a collection screen.

## 8 · Signature Deck still matters

The Signature Deck model remains useful, but its gameplay role changes.

A Resident's Deck primarily supplies:
- Cards they are likely to send;
- Cards they care strongly about receiving;
- vocabulary / worldview;
- ChatterBox seeds;
- likely reaction stance.

A Resident does **not** need to have lost their whole Deck.

Possible Card motives:

```text
send
recommend
warn
challenge
mock
gift
confiscate
destroy
archive
correct
prove
ask-about
pass-on
```

The earlier “lost Deck” / “recover my Cards” concept remains one valid Resident-specific variant, not the universal default.

## 9 · Social Card Relay patterns

### Direct delivery

```text
A → player → B
```

A explicitly names B.

### Opinion relay

```text
A → player → “show this to someone who would hate it”
```

Target is a Resident category / authored candidate set.

### Counter-Card

```text
A sends Card X
→ B rejects it
→ B gives Card Y as answer
→ player returns Y to A or takes it to C
```

This turns Cards into physicalized ChatterBox retorts.

### Open challenge

```text
Resident: “Sell this to three people.”
```

Each recipient responds differently.
Avoid routine repetition; use only when the Card produces genuinely different interactions.

### Missing Card detour

```text
Resident wants Card X
→ X is not currently available socially
→ special acquisition route opens
→ Combat / Card Zone / Race / discovery
→ X returns to social loop
```

This is an exception that makes minigame acquisition feel meaningful.

## 10 · Minigames become connective tissue and exceptional sources

### Free Roam / World exploration

Primary use:
- travel between Residents;
- encounter POIs/routines;
- spontaneous reactions;
- optional environmental Card discovery;
- dynamic interruption of the social mission.

### Race / Drive

Possible use:
- reach another district/Resident;
- courier pressure or time-flavored scenario without making time limits mandatory;
- acquire a Card after a route/event;
- meet mobile Residents / roadside events.

Race remains Race owner.

### Combat Arena / Card Zone

Possible adapters:
- win a missing Card;
- prove a Card by staging an encounter seeded by it;
- use a Card as encounter/story context;
- retrieve a Card another Resident cannot socially provide.

Combat remains the only combat owner.

### Other minigames

They can:
- unlock/earn/reveal one relevant Card;
- provide evidence for a later social pitch;
- create a memorable story the recipient reacts to.

The social Resident loop remains the return point.

## 11 · Almanac role

Player Journey / Fractal Almanac remains the collection truth.

Recommended Card lifecycle:

```text
Resident gives/shows Card
→ Card becomes DISCOVERED in Almanac
→ player may socially carry/present it
→ narrative handoff does not consume discovery
→ later Card can participate in King Kayfabulation
```

If a later physical-card inventory exists, it can model temporary possession separately.

MVP does not need it.

## 12 · Lean Memory role

Do not persist “player currently owns Card instance 14”.

Persist meaningful social receipts such as:
- A asked player to show Card X to B;
- player sold X to B as a warning;
- B thought X was offensive and sent Y back;
- A laughed at B's response;
- this Card became a recurring argument/joke.

Small example:

```ts
{
  kind: 'card-relay',
  cardRef: 'deck/card',
  senderId: 'resident-a',
  recipientId: 'resident-b',
  spinTag: 'warning',
  outcome: 'recipient-rejected',
  responseCardRef: 'deck/card-y',
  importance: 2
}
```

The receipt stores the **social meaning**, not a transaction ledger.

## 13 · Reaction / emotional choreography

The Card Relay should be visibly performative.

Possible receiver choreography:
- lean in / inspect Card;
- take/hold/point at Card;
- eyes/head focus;
- mouth / speech;
- amused/offended/confused/proud/suspicious reaction;
- Emanata;
- Brick Fish retaliation;
- Gift response;
- Signature Dance celebration;
- walk-off / return to routine.

The Card is a reaction trigger, not a menu item floating outside the world.

## 14 · Card Relay can generate Resident-to-Resident life without player ownership

The same semantic pattern can later run NPC↔NPC:

```text
A wants B to see Card X
→ A approaches B directly OR asks another Resident/player
→ presentation
→ reaction
→ compact memory receipt
→ both resume
```

For MVP, player-mediated relay is preferable because:
- it creates gameplay;
- it teaches the Card;
- it exposes ChatterBox choices;
- it gives the player agency over framing.

## 15 · King Kayfabian is the synthesis layer

The social Card Relay gives the player **pieces**.

King Kayfabian gives them a place to **compose** those pieces.

Existing five-card grammar:

```text
          QUEST
SCENE 1 · SCENE 2 · SCENE 3
          ACTOR
```

The player:
- selects collected Cards;
- orders/places Scene Cards;
- supplies connective logic;
- activates Kayfabulation;
- performs/sees the resulting story;
- receives the King's bounded outcome / Quest progression.

This gives the game a strong rhythm:

```text
SOCIAL MICRO-STORIES
→ TRAVEL / MINIGAME INTERLUDES
→ CARD COLLECTION
→ SOCIAL MICRO-STORIES
→ KING KAYFABULATION SYNTHESIS
→ NEW QUEST / NEW RESIDENT CHAINS
```

## 16 · Relationship to ordinary Kayfabular Freestyle

The in-world loop should not replace the tabletop/Freestyle grammar.

Instead it teaches pieces of it diegetically:
- Card entry rituals;
- framing;
- performance;
- closure;
- commitment;
- social reaction.

The player learns to “Kayfabulate” through Resident interactions before or alongside the larger King performance.

## 17 · Suggested first proof

Actors:
- Officer Doppel-Denk;
- one contrasting Resident;
- player.

Card:
- one real Anti-Rules Card.

Sequence:

```text
Doppel-Denk introduces Card
→ his stance is visible in ChatterBox + body performance
→ Card enters player's Almanac
→ Doppel-Denk asks player to show it to Resident B
→ player travels a short real-world path
→ B interaction opens:
   SHOW IT choice
   SPIN IT choice
   SELL IT choice
→ B reacts strongly
→ B may answer with one retort or counter-Card
→ one compact Card Relay memory receipt
→ both Residents resume routines
```

No Card Zone, Combat, Race or King sequence is required for this first micro-proof.

Those become adapters after the social loop reads well.

## 18 · Second proof · exceptional acquisition

Only after the first social proof:

```text
Resident requests Card X
→ X requires Combat/Card Zone/Race acquisition
→ existing minigame owner produces X
→ Card enters Almanac
→ player returns to Resident social loop
→ SHOW / SPIN / SELL to intended recipient
```

This proves minigames serve the social core rather than replacing it.

## 19 · Third proof · King synthesis

Once several Cards are naturally collected:

```text
Actor
+ 3 collected Scene Cards
+ Quest
→ King Kayfabian
→ player connective arrangement
→ Kayfabulation performance
→ bounded Quest result
```

This is the meta-closure proof.

## 20 · Current product hierarchy

Working priority:

1. **Resident interaction / ChatterBox / Reaction Choreography / Lean Memory**
2. **Card Relay / SHOW-SPIN-SELL**
3. **Free Roam / travel as connective tissue**
4. **Dance / Gift / Brick Fish as social culture**
5. **minigames as special acquisition / interruption / proof**
6. **King Kayfabulation as synthesis / closure**

This is a product-priority proposal, not a runtime ownership change.

## 21 · KISS state sketch

Dynamic state can remain tiny:

```ts
type CardRelayThread = {
  id: string
  cardRef: string

  senderResidentId: string
  targetResidentId?: string

  status:
    | 'offered'
    | 'carried'
    | 'presented'
    | 'resolved'

  senderIntent?: string
  showChoice?: string
  spinChoice?: string
  sellChoice?: string

  outcomeTag?: string
  responseCardRef?: string

  lastMeaningfulBeatRef?: string
}
```

Player Journey already owns Card discovery.
Lean Memory stores only meaningful resulting social episodes.

Do not create:
- physical Card inventory duplication;
- 56 per-Deck courier rows;
- a second Quest database;
- per-NPC copy of the Card corpus.

## 22 · Site-persistence payload shape

For the existing KFB Production Control / GPT-Site process mirror, the useful process checkpoint is not a full game save.

A compact process payload is enough:

```json
{
  "process": "resident-social-card-relay",
  "owner": "KFB Town Resident Social Memory",
  "branch": "chatgpt-web/town-resident-social-memory-2026-09-28",
  "status": "DESIGN_PROPOSAL",
  "primaryLoop": "Resident → Player → Resident / SHOW-SPIN-SELL",
  "secondaryLoops": [
    "Free Roam / Race connective travel",
    "Combat / Card Zone exceptional acquisition",
    "King Kayfabulation five-card synthesis"
  ],
  "nextProof": "one real Card relay between two source-proven Residents",
  "runtimeImplemented": false
}
```

This process payload does **not** claim live Site runtime implementation.

## One next gate

Keep exactly one integrated gate:
**RESIDENT-SOCIAL-MEMORY-01**.

Current preferred content order inside it:

1. prove two Residents + POI/AIDA/reaction/resume;
2. add **one real Social Card Relay** as the first Card/ChatterBox interaction;
3. add Common Bounce / Signature Dance;
4. add one KISS Gift beat;
5. then one exceptional minigame Card-acquisition adapter;
6. later King Kayfabulation synthesis.

Do not build a separate courier game or Card-quest runtime.
