# KFB Historian / Chronicler Contract · 01

Status: **GEORG PREFERENCE RECORDED · AUTHORING/PRESENTATION CONTRACT · NO RUNTIME OWNERSHIP**
Date: 2026-10-07
Research owner: ChatGPT Web Chat
Receiving consumers later: KFB Open World / ChatterBox / Resident Performance
Protected runtime: PR #348 / current Open World receiving owner

## Decision

Georg's current preferred narrator direction is:

**Historian / Chronicler**

Operational split:
- **Role:** Historian
- **Persona register:** Chronicler
- **Working label:** Historian / Chronicler

This supersedes the need to choose FrizzleBob/Carny or Ship Computer as the default narrator identity.

Those older concepts remain useful donors for:
- dry/deadpan timing;
- observer behavior;
- voice → device → companion progression;
- player-framed Afterglow;
- visual narrator-box treatment.

They are not the current preferred persona.

## 1 · What the Historian is

The Historian / Chronicler is a **selective witness to consequence**.

It:
- frames context the player cannot directly see;
- records meaningful changes;
- notices repetition;
- connects present events to prior world/social history;
- can expose the gap between heroic self-image and observed result;
- can provide rare meta-closure;
- may be opinionated without becoming omniscient.

It is closer to a chronicler with memory than to:
- a quest log;
- a tutorial voice;
- a generic AI assistant;
- an omniscient author;
- a joke machine.

## 2 · What the Historian knows

Knowledge must come from existing owners.

Allowed inputs later may include:
- world event/fact exposed by current runtime;
- place / POI identity;
- Card / Deck semantic refs;
- Resident relationship-memory facts exposed by Resident Life;
- prior meaningful event refs;
- authored local-history tags;
- player-selected framing/tone where a consumer explicitly supports it.

The Historian does not infer hidden gameplay truth that no owner supplied.

## 3 · What the Historian does not own

Never owns:
- quest state;
- player death/revival state;
- relationship state;
- Resident Affect;
- world simulation;
- activity scheduling;
- encounter arbitration;
- Card truth;
- navigation;
- animation;
- Audio mix.

It only consumes facts and emits presentation/content.

## 4 · When narration is earned

Strong triggers:
- transition into a place with unseen historical/contextual significance;
- aftermath after a meaningful world consequence;
- a repeated pattern that has become narratively legible;
- contradiction between intention and result;
- a callback that changes the meaning of an earlier event;
- rare fourth-wall/meta-closure;
- an event whose significance is larger than any nearby Resident reasonably knows.

Weak triggers:
- routine locomotion;
- routine pickup;
- every activity beat;
- every combat hit;
- every death;
- visible state that needs no interpretation;
- instructions the UI/world affordance can communicate directly.

Rule:
**If the player can already see the whole meaning, prefer silence.**

## 5 · Tone

Core register:
- dry;
- exact;
- observant;
- mildly opinionated;
- patient;
- concise;
- straight-faced.

Humor sources:
- precision;
- contradiction;
- delayed recognition;
- understatement;
- social consequence;
- callback.

Avoid:
- generic quips;
- constant snark;
- wink-to-camera;
- AI/system/glitch jokes;
- explaining the joke;
- fake omniscience;
- moralizing every event.

## 6 · KayfabeTips application

### Therefore / But
The Historian should connect consequences, not list events.

Bad grammar:
"He entered the graveyard. And then he died. And then he returned."

Better grammar:
"He returned because the graveyard permits it. But the skeletons had started keeping count."

These are examples of causal framing, not canonical final copy.

### Yes, And
Accept the current world fact. Add a frame; do not erase or retcon it.

### Follow people, not props
A Card, ruin, shop or grave matters because someone wanted, feared, remembered, damaged, repaired or misunderstood it.

### Straight face
Absurd facts are reported as facts.

### Concrete picture
Prefer an observable detail over an abstract thesis.

## 7 · Narration carriers

Preferred carrier family:
- caption / narrator box;
- off-screen voice when appropriate;
- later optional device/observer embodiment.

Historical donor:
the narrator box may be **unanchored** because it does not belong to a nearby speaker.

Presentation owner remains the existing bubble/caption family.
No second renderer.

## 8 · Frequency / restraint

Default state:
**OFF / SILENT**

Narration is a sparse layer.

Recommended heuristic:
- nearby Resident reaction normally wins over Historian commentary;
- visible world reaction normally wins over explanation;
- Historian appears when it adds context, relation, memory or closure unavailable through those channels.

If three possible carriers can express the beat:
1. world behavior;
2. Resident reaction;
3. Historian;
prefer the lowest layer that communicates the meaning.

## 9 · Death / revival

Do not make the Historian a death counter.

Escalation principle:
1. first failure: world/Resident may react; Historian usually silent;
2. repeated failure: recognition may emerge;
3. socially meaningful repetition: Resident-specific callback;
4. broader pattern / ironic closure: Historian becomes eligible;
5. later return: memory may reframe the same place/event.

The joke is not "you died again."
The story value is **who noticed, what changed, and what the repetition now means**.

## 10 · Relationship to Residents

Nearby Residents:
- own their own worldview and response;
- may disagree with the Historian's framing;
- may know less or more about local specifics;
- may remain silent.

The Historian is not the final authority on meaning.

Useful tension:
**Resident testimony vs. Chronicler framing** may create ambiguity without requiring either to be "wrong."

## 11 · Relationship to the player

The Historian may:
- address the player rarely;
- remember authored meaningful patterns;
- offer framing rather than commands;
- leave interpretation open.

Do not:
- praise the player generically;
- scold continuously;
- explain controls;
- narrate objectives as instructions.

## 12 · Player-framed Afterglow donor

Historical `narrator-2d.js` allowed the player to choose a caption/tone before later Afterglow narration.

Retain as a future design option:
**the player may influence framing without changing world truth.**

This is compatible with a Historian/Chronicler if treated as:
- editorial angle;
- diary voice;
- disputed chronicle;
not objective state mutation.

## 13 · Identity development

Current preferred identity:
**Historian / Chronicler**

Possible later embodiment:
- disembodied caption voice first;
- small archival/device presence later if it improves performance;
- companion embodiment only if justified by product experience.

Do not force the historical Ship Computer or FrizzleBob persona into the role.

## 14 · Acceptance audit for a Historian line

A candidate line passes when:
- it adds something not fully visible;
- its facts come from owned context;
- it has one concrete anchor;
- it connects cause/resistance/callback;
- it does not steal a nearby Resident's stronger beat;
- it is short enough for the carrier;
- it is played straight;
- silence was considered and rejected for a reason.

## 15 · Architecture Freeze questions

Before runtime adoption confirm:
- actual event/state seam;
- available durable memory refs;
- caption/bubble narrator carrier;
- arbitration with Resident dialogue;
- cooldown/frequency owner;
- save/persistence of any narrator memory;
- whether player-framed Afterglow exists in current product;
- whether narrator embodiment is useful or unnecessary.

## Boundary

No Open World runtime write.
No ChatterBox runtime write.
No narrator state machine.
No invented current event names.
No second Site.
No merge / Live promotion.

## Next gate

**Use this contract during post-Coworker Architecture Freeze and map it onto the actual returned event/state seams.**
