# KFB Resident Gift Culture · Gifts, Barter, Pranks, Kayfabe Escalation + Reconciliation · 2026-09-28

Status: **DESIGN PERSISTENCE · SOURCE-BACKED DIRECTION · NOT RUNTIME IMPLEMENTED**  
Owner: **KFB Town Resident Social Memory**  
Branch: `chatgpt-web/town-resident-social-memory-2026-09-28`

## 1 · Direction

Gift-giving is a third shared KFB Resident culture axis alongside:
- Brick Fish / Red Herring social play;
- music / Common Bounce / Signature Dance culture.

### KISS correction · 2026-09-28

The first implementation does **not** need a durable Resident item economy, barter ledger or per-prop ownership/provenance history.

For the MVP, a gift is primarily:
- a visible social action;
- a Point of Interest;
- a character test;
- a joke/prank/reconciliation device;
- a trigger for Reaction Choreography;
- a possible **semantic memory receipt** when the interaction becomes meaningful.

The physical prop may be scene-local, randomly selected from admitted props, reused later, or disappear after the beat according to the receiving scene's ordinary prop rules.

Persist **meaningful social content**, not routine object bookkeeping.

Examples worth remembering:
- A deliberately mocked B with a gift aimed at B's vanity;
- B unexpectedly loved the insulting gift;
- A prank gift triggered a memorable escalation;
- A later apology/reconciliation closed that thread.

Examples normally **not** worth remembering:
- exact gift instance ID;
- every wrapper color;
- every routine handoff;
- who technically owned a disposable scene prop after the beat;
- a full chain of low-value regifts.

A later true item/inventory/provenance system may attach to this culture layer when a real gameplay need exists. It is not a prerequisite for lively Resident behavior.

KFB gift culture should allow sincere warmth, loose exchange, teasing, status play, absurdity, cartoon violence and reconciliation without requiring a global relationship meter or economy.

## 2 · Verified source foundation

### Santa pack

Current repository source:
`media/3D_Assets/KayKit_Mystery_Series6/Santa/`

Verified:
- `characters/Santa.glb`;
- `assets/gltf/Present_A.gltf`;
- `Present_B.gltf`;
- `Present_C.gltf`;
- `Present_D.gltf`;
- `Present_E.gltf`;
- shared `santa_texture.png`.

The five Santa presents are therefore real source variants, not generated recolors.

### Helpers pack · December 2024

Current repository source:
`media/3D_Assets/KayKit_Mystery_Series6/6 - December 2024 - Helpers/`

Verified characters:
- `Helper_A.glb`;
- `Helper_B.glb`.

Verified workshop/toy props in its GLTF asset set:
- Candycane;
- Drawers;
- Glue A/B;
- Hammer;
- Lamp_Workbench;
- Toy_Train_Paint;
- Toy_Train_Wood;
- Toy_Workbench;
- Toy_Workbench_decorated.

The checked Helpers GLTF set does **not** itself contain the Santa presents. The North-Pole/Holiday scene should combine source refs deliberately rather than pretending one pack contains everything.

### Toy Soldier gift reveal

The existing Resident Atlas Toy Soldier provides:
- `Present_Base.gltf`;
- `Present_UnwrappedBase.gltf`;
- a working authored reveal grammar:
  anticipation → pop → overshoot → settle.

This is the strongest current **animation/presentation donor** for generic KFB gift reveals.

Its exact unwrapped geometry belongs to the Toy Soldier pack and should not silently become the universal opened state for differently styled Santa presents.

## 3 · Later North-Pole / Holiday Resident scene

Future scene direction:

```text
Santa
+ Helper_A / Helper_B
+ toy workshop props
+ Present_A–E
+ source-backed winter/North-Pole environment
+ Holiday-season music
+ Resident work / gift routines
```

Potential routines:
- build/repair toys;
- paint toy trains;
- wrap/stack gifts;
- carry gifts;
- inspect finished toys;
- hand gifts to Santa;
- Santa distributes gifts;
- Helpers dance / celebrate between work beats.

Georg's current music direction includes traditional Holiday/Jingle-Bells-like scenes. The exact audio source/recording is **not pinned by this document** and remains a later Audio-owner choice.

Do not make the seasonal North-Pole scene a prerequisite for ordinary Town gift culture. Present A–E can already be reusable packaging props in other contexts.

## 4 · Gift = wrapper + presented payload + social intent

Separate what the gift **looks like**, what appears **inside the scene**, and what the giver **means**.

KISS baseline:

```ts
type GiftBeat = {
  id: string
  sourceEventRef: string

  giverId: string
  recipientId: string
  witnessIds?: string[]

  wrapperRef: string
  payloadRef?: string
  payloadTags?: string[]

  intent:
    | 'care'
    | 'welcome'
    | 'celebrate'
    | 'thanks'
    | 'trade'
    | 'reconcile'
    | 'tease'
    | 'satirical_needling'
    | 'prank'
    | 'tribute'
    | 'apology'

  relationshipTone?: string
  revealProfileRef?: string
}
```

Important:
- `wrapperRef` is presentation;
- `payloadRef` may point to a real source prop shown in the scene, but the Gift Culture layer does **not** require durable ownership;
- `payloadTags` can carry the semantic meaning when the exact prop instance is disposable;
- `intent` is the giver's authored/subjective social intention;
- the recipient may interpret it differently.

No LLM is allowed to create persistent inventory truth by merely mentioning an item.

### Optional future extension

If a later consumer already has real inventory/object identity and the gift genuinely changes player/world inventory, it may attach an external `itemTransferRef` or provenance ref. That remains an **optional integration seam**, not MVP Gift Culture state.

## 5 · Generic gift choreography

A reusable gift beat:

```text
giver selects/holds gift
→ approach / offer
→ recipient notices
→ recipient accepts / refuses / inspects
→ anticipation
→ unwrap / pop
→ payload reveal
→ recipient Reaction Choreography
→ optional ChatterBox / Triplet
→ optional semantic-memory / social-thread update
→ return / continue / escalate
```

### 5.1 · Packaging reveal rules

For Toy Soldier packaging:
- exact `Present_Base → Present_UnwrappedBase` state can be used.

For Santa `Present_A–E`:
- no unwrapped counterpart is currently proven;
- do not invent a hinged lid or hidden geometry;
- reuse the **timing language** of Toy Soldier:
  squash/wobble → pop → payload overshoot → settle;
- the wrapped present may scale/pop away at the reveal frame;
- clay/paper/ribbon VFX may later carry the opening illusion through the existing VFX/Reaction owner;
- payload appears with source-backed object identity.

The gift should feel physically cartoony without pretending source geometry exists when it does not.

## 6 · Payloads are character-writing tools

A KFB gift can be:
- useful;
- useless;
- too useful;
- insulting only because it is accurate;
- affectionate teasing;
- an object that exposes a weakness;
- an object that tempts a vice;
- a sincere repair after a conflict;
- a deliberately absurd status symbol;
- a prank object;
- a classic cartoon trap.

The point is not random weirdness.

The best gift is tied to:
- recipient identity;
- known habit/vice;
- current activity;
- shared memory;
- open social thread;
- visible context;
- giver's own motives.

Example pattern:

```text
known trait / prior incident
→ giver selects object whose meaning is legible
→ recipient recognizes implication
→ reaction creates next beat
```

This makes the gift a physical equivalent of a good ChatterBox retort.

## 7 · Satirical needling without generic insult generation

`satirical_needling` should work by **object choice**, not by insulting prose.

Examples of structure, not canon item assignments:
- compulsively officious Resident receives an absurdly oversized whistle / rule-like object;
- boastful Resident receives a tiny trophy;
- Resident who repeatedly loses something receives another copy;
- vain Resident receives an object that exaggerates vanity;
- unreliable Resident receives an absurdly impractical tool.

The recipient may:
- love it without understanding the joke;
- understand and resent it;
- weaponize the gift back;
- regift it;
- display it proudly;
- throw it;
- use it literally;
- turn it into a new routine.

That last step is important: a gift should sometimes **change future behavior**, not end at the reveal.

## 8 · Reaction matrix

Reaction is character-specific, not intrinsic to the item.

Candidate intents:

- `gift_delight`;
- `gift_touched`;
- `gift_suspicious`;
- `gift_confused`;
- `gift_offended`;
- `gift_deadpan`;
- `gift_greedy`;
- `gift_proud`;
- `gift_refuse`;
- `gift_immediate_use`;
- `gift_regift`;
- `gift_counterprank`;
- `gift_cartoon_blast`;
- `gift_reconcile`.

Reaction Choreography owns:
- face/eyes/mouth;
- body/ears/parts;
- Emanata;
- impact/recoil;
- recovery.

ChatterBox/Triplets may add one compact semantic beat.

The object/world owner owns the actual payload state.

## 9 · Cartoon trap / exploding gift

A classic exploding present is valid KFB social/cartoon logic.

Default semantic class:

```text
gift.prank.reveal
→ cartoon_blast / soot / parts reaction
→ recipient reaction
→ optional retaliation
→ social thread continues
```

By default this is **Kayfabe/social cartoon violence**, not Combat damage.

If a consumer explicitly changes the event to real damage/combat, Combat becomes owner of health/damage truth.

The same visual event must therefore not automatically imply injury.

Possible recipient aftermath:
- stunned pause;
- soot / Emanata;
- angry retort;
- heart / affectionate tolerance;
- immediate countergift;
- Brick Fish retaliation;
- laughter;
- exaggerated walk-off.

No meta joke about “game physics”. The characters treat the event as part of the shared played reality.

## 10 · Gift social thread

The existing `ResidentSocialThread kind: 'gift'` is the correct continuity handle when a gift interaction matters enough to continue.

Suggested states:

```text
offered
→ accepted / refused
→ opened
→ interpreted
→ optional response / countergift
→ reconciled / closed
```

KISS memory payload:
- giver;
- recipient;
- semantic gift/payload tag when useful;
- source event;
- witnesses only when relevant;
- meaningful interpretation/reaction;
- whether one bounded response remains.

Normally do **not** persist:
- current item owner;
- wrapper instance ID;
- every regift hop;
- full conversation transcript.

The thread remembers **what the exchange meant**, not a miniature warehouse ledger.

## 11 · Semantic gift memory, not item provenance by default

The valuable persistent fact is usually the **social meaning** of the exchange.

Example compact receipt:

```ts
{
  kind: 'gift',
  giverId: 'resident-a',
  recipientId: 'resident-b',
  meaningTags: ['tease', 'vanity'],
  outcome: 'recipient-loved-it',
  sourceEventRef: 'evt-42'
}
```

Later this can influence:
- a callback in ChatterBox;
- a repeat prank;
- a warmer reconciliation;
- a Resident choosing a related gift;
- a reaction when a visually/semantically similar prop appears.

The exact same prop object does **not** need to survive for the memory to matter.

If a later real inventory system supplies durable object identity, the receipt may point to it. Until then, no item-provenance graph is required.

Knowledge remains witness-specific. A third Resident does not magically know the exchange unless they witnessed it or were told.

## 12 · Player participation

The same culture should include the player.

Player may:
- give a scene gift where the consumer allows it;
- receive one;
- reject one;
- unwrap one;
- trigger a prank;
- use a later dialogue/action callback based on a memorable gift exchange.

For the KISS baseline, **Player Journey does not need to become a gift inventory ledger**.

Only meaningful player-facing receipts may persist, for example:
- who gave the player something memorable;
- what the social intent/meaning was;
- where/when the notable beat happened;
- whether it opened or closed a social thread.

If a later real inventory consumer transfers a durable object, that consumer owns the item state and may attach its reference. No duplicate item is created by replaying a reveal.

## 13 · Loose exchange, not an economy

Georg's “barter society” direction is primarily **cultural and performative**, not a request for resource management.

Residents may visibly:
- offer;
- accept;
- refuse;
- counteroffer;
- swap;
- regift;
- hand over a ridiculous substitute.

For ordinary Resident-life scenes these may be ephemeral props and semantic beats. No universal commodity table, stock count, price system or durable ownership chain is required.

If a specific later gameplay consumer already has inventory/resource truth, Gift Culture may call that owner's transfer action. Otherwise the scene ends after the social beat and meaningful memory update.

This keeps exchange lively without turning Resident life into an economy simulator.

## 14 · Kayfabe escalation

Gift exchanges can become small causal spirals.

Example:

```text
A gives B a needling gift
→ B understands the implication
→ B responds with a retort
→ B countergifts a worse object
→ A opens it
→ cartoon blast
→ Brick Fish retaliation
→ nearby Resident joins / Officer Doppel-Denk intervenes
→ short Kayfabe scuffle
→ cooldown
→ reconciliation / shared drink-food / dance / resumed routine
```

The important property is **therefore/but causality**, not random escalation.

Each next beat should come from:
- the object;
- the prior reaction;
- relationship tone;
- current POIs;
- memory;
- character motivations.

## 15 · Failure Spiral budget

Emergence needs a stop condition.

Use the existing bounded-thread idea:

```ts
{
  kind: 'gift',
  maxContinuationBeats: 4,
  escalationLevel: 0 | 1 | 2 | 3,
  nextEligibleAfter?: number
}
```

Working escalation language:

- **0 · warm/neutral** — offer, accept, thank, use;
- **1 · tease** — odd gift, retort, regift;
- **2 · slapstick** — prank, Brick Fish, chase, Emanata;
- **3 · Kayfabe blowout** — cartoon blast/scuffle/scene-wide reaction.

Then resolve:
- reconcile;
- disengage;
- cooldown;
- return to activity;
- switch to dance/meal/drink/socializing;
- leave with an open memory but no active chain.

Do not let NPC-to-NPC gift loops recurse indefinitely off camera.

## 16 · Reconciliation matters

A Failure Spiral should not erase affection or become permanent hostility by default.

Possible closure:
- sincere replacement gift;
- shared food/drink where a source-backed prop exists;
- Common Bounce / dance join;
- help repairing the mess;
- one compact apology;
- silent prop handback;
- jointly teasing a third Resident;
- return to routine with a remembered incident.

Lean Memory can preserve:
- “we blew each other up with presents”;
- “they replaced the broken object”;
- “we made up afterward”.

The reconciliation is part of the event history, not a reset button.

## 17 · Gifts as POIs

Gift objects can attract attention before they are opened.

POI tags may include:
- `gift`;
- `wrapped`;
- `unattended`;
- `for-me`;
- `from-known-resident`;
- `suspicious`;
- `valuable-looking`;
- `ridiculous`;
- `prank-history`.

Different Residents interpret the same package differently.

Officer Doppel-Denk may treat an unattended present as a public-order problem.
A greedy Resident may approach immediately.
A suspicious Resident may refuse it.
A Helper may inspect wrapping quality.
A Santa/North-Pole Resident may treat it as routine work.

## 18 · AIDA gift loop

```text
ATTENTION
wrapped gift / giver / exchange becomes visible

INTEREST
recipient motivation + giver relationship + wrapper/payload cues

EXPECTATION
care / bargain / prank / insult / unknown

INTERACTION
accept / refuse / inspect / open / trade

REACTION
reveal + character-specific choreography

INTERPRET / REMEMBER
gift meaning + outcome if socially relevant

RETURN / RESUME / RETARGET
continue / joke / countergift / reconcile / leave
```

Expectation mismatch is a major comic engine:
- expensive-looking wrapper → ridiculous payload;
- insulting-looking payload → recipient genuinely loves it;
- obvious prank → harmless;
- sincere gift → accidentally disastrous.

## 19 · Gift + Dance + Brick Fish are one culture, not three minigames

These systems should cross naturally.

Examples:

### Gift → Dance
Resident receives a beloved object and celebrates with Common Bounce or Signature Move.

### Dance → Gift
After a group performance, one Resident gives another a prop or trophy.

### Gift → Brick Fish
Bad gift prompts a bounded Brick Fish retaliation.

### Brick Fish → Reconciliation Gift
Resident returns later with a sincere or sarcastic peace offering.

### Gift → remembered social token
A memorable gift beat creates a semantic callback. Later a related prop, joke, Resident or situation can reopen the memory thread even if the original object instance no longer exists.

This is how a small prop library can generate recurring social history without requiring persistent item bookkeeping.

## 20 · First productive implementation later

Do not build a separate Gift Game.

Extend the existing integrated Resident proof with one gift chain after the basic AIDA/Reaction seams work.

First compact proof:

Actors:
- two source-proven Residents;
- player optional.

Objects:
- one Santa `Present_A–E` wrapper;
- one source-proven payload prop.

Sequence:

```text
Resident A carries/offers wrapped gift
→ Resident B notices
→ accept
→ Toy-Soldier-derived reveal timing
→ payload appears
→ B reacts according to profile
→ meaningful interpretation is optionally written as one compact receipt
→ one optional retort/countergift beat
→ thread closes or reconciles
→ both Residents return to their prior activity
```

Second variation only after the warm baseline works:
- prank / cartoon-blast gift;
- Reaction Choreography;
- one bounded retaliation;
- reconciliation/return.

Evidence must prove:
- wrapper and presented payload remain visually/semantically distinct;
- no unnecessary durable item ledger is created;
- only meaningful social outcomes enter Lean Memory;
- witness knowledge is correct when a receipt is written;
- social thread is bounded;
- Reaction Choreography recovers cleanly;
- both actors return to routine/social state.

## 21 · Later authoring/mapping work

ToolBox / Resident Scene / Animation Studio should eventually support:
- choose giver + recipient;
- choose real wrapper;
- choose real payload;
- select gift intent;
- preview offer/accept/unwrap;
- map recipient Reaction profile;
- inspect the optional semantic memory receipt;
- save as reusable mini-scenario recipe.

The interface must consume existing Asset Library, Motion Library and Reaction Choreography owners. Player Journey / site persistence is only needed when a gift beat is important enough to become durable player memory.

No Gift Inventory, barter ledger or Gift Animation runtime.

## 22 · Minimal persistence / GPT-Site architecture sketch

If the initial GPT-Site runtime offers a simple persistent store, the first implementation only needs a tiny semantic receipt collection, for example:

```ts
type ResidentMemoryReceipt = {
  id: string
  actorId: string
  otherActorIds?: string[]
  kind: 'gift' | 'dance' | 'brick_fish' | 'promise' | 'argument' | 'performance'
  meaningTags: string[]
  outcome?: string
  sourceEventRef?: string
  importance: 1 | 2 | 3
  createdAt: number
}
```

For gifts this can capture:
- who was involved;
- whether it was affectionate, mocking, prankish or reconciliatory;
- what character trait/context made it meaningful;
- the outcome.

It does **not** need:
- item instance ownership;
- resource counts;
- per-wrapper persistence;
- complete prop histories.

If storage is unavailable or unreliable, the runtime can still play the scene correctly without durable memory. Persistence enriches callbacks; it must not be a prerequisite for the visible interaction.


## One next gate

Keep the single integrated gate **RESIDENT-SOCIAL-MEMORY-01**.

Gift Culture is now part of the same Resident-life stack, but the first implementation order should remain:
1. basic POI/AIDA/routine/reaction/resume;
2. Dance/Common Bounce mapping;
3. one warm gift exchange;
4. only then one bounded prank/failure-spiral gift variant.

The later North-Pole/Santa/Helpers Holiday Resident Scene is a separate future scene-composition slice, not a prerequisite for Town gift culture.
