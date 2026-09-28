# KFB Town · Residents as social actors · Lean Memory + ChatterBox + Fluff-o-lect

Status: **ADDITIVE DESIGN DIRECTION / DONOR SYNTHESIS · NOT RUNTIME IMPLEMENTATION**  
Date: 2026-09-28  
Town owner: **Georg / KFB Town design reference**  
Runtime owners retained: existing WorldBuilder/Travel world state, Journey/Almanac persistence, ChatterBox/Triplet dialogue lineage, ToolBox/Resident actor stack, consumer-specific Quest/POP/Combat owners  
Branch: `chatgpt-web/town-resident-social-memory-2026-09-28`  
Reserved future Stage route: `https://kayfabizarro.pages.dev/kfb-hub/stage/town/resident-social-memory-01/` — **NOT DEPLOYED**

## 1 · Outcome

KFB Town residents should feel like recurring inhabitants with history, habits, shared jokes, unfinished business and context-sensitive reactions rather than isolated NPC prompt calls.

The intended stack is:

```text
world / encounter truth
→ compact witnessed event receipts
→ resident-specific Lean Memory
→ open social threads + current intent
→ ChatterBox / semantic Triplet / selectable retort
→ optional Fluff-o-lect when context can carry the missing word
→ Reaction Choreography
→ source-backed animation / face / ears / mouth / Emanata
→ recovery to the consumer-owned world state
```

This is explicitly **not** a proposal to port AI Town as KFB's runtime, create a second NPC database, create a second dialogue engine, or let an LLM own movement/rewards/relationship truth.

## 2 · Verified donors

### 2.1 · `georg-doc/ai-town`

Pinned donor state:
- repository: `georg-doc/ai-town`
- main HEAD inspected: `2693ed6973e3461204385c9d11fb3aca4e8e3a7a`
- architecture: `ARCHITECTURE.md`, blob `4c39ed9e7fef79d3c2435d94f804a0bf09b690ef`
- memory implementation: `convex/agent/memory.ts`, blob `25994567b544c0a3e957f6ec6dd73979e7d38d69`
- memory schema: `convex/agent/schema.ts`, blob `480467b6d625acde7b56011e32893fc1645d8a50`
- autonomous agent loop: `convex/aiTown/agent.ts`, blob `ae49157d5b363e6f51dcf884aa01a499037022fd`
- async operations: `convex/aiTown/agentOperations.ts`, blob `a8eb89dc4aecfc6b4b05534d6764dad062289e96`

Useful mechanisms, not runtime ownership:
1. game state and high-frequency message/memory data are separated;
2. a conversation is summarized into a compact memory instead of replaying full chat history;
3. memories are retrieved in a small top-k set;
4. retrieval combines semantic relevance, recency and importance;
5. agents use cooldowns and availability constraints before starting conversations;
6. an agent has one long-running operation at a time;
7. the donor can create higher-level reflections from multiple memories.

KFB should reuse these principles selectively, with stricter provenance. AI Town's free-form conversational summary or reflection must never silently become objective world truth.

### 2.2 · Current KFB Town Lean Memory

Current Town source:
- `skills/chat/town/LIVING_KFB_TOWN.md`
- inspected blob: `a1bb4ec94aaa5a6d0b694b4fcc4409e8f7573a61`

Existing Town direction already requires:
- identity, confirmed backstory, current performance and session memory remain distinct;
- no omniscient shared knowledge pool;
- observation, hearsay, interpretation and confirmed event remain distinguishable;
- Lean Memory stores relevant actually experienced/heard events, involved/knowing characters, open promises, selected retorts and concrete language takes;
- replay/import does not mint new gifts or rewards;
- no new global NPC database is a prerequisite for worldbuilding.

This document extends that direction rather than replacing it.

### 2.3 · ChatterBox / Triplets

Current reuse source:
- `skills/chat/masterplan/CHATTERBOX_TOURBUS_REUSE_2026-09-14.md`
- blob: `9025a43f042cf055d19851c9a93a6ddd016e3c36`

Current Town/meta direction:
- reuse the semantic Triplet / reader-closure lineage;
- `Actor/POV → SHOW IT → SPIN IT → SELL IT → player closure` remains a full performance arc;
- `Subject / Connector / Reframe` may describe sentence roles;
- player closure is not explained away by the NPC;
- collectible retorts and Monkey-Island-like selected responses remain valid;
- bubble/attention budgets remain bounded;
- a social reaction does not require an LLM call.

### 2.4 · Fluffolekt / Fluff-o-lect

Current Town spelling is explicitly preserved as **Fluffolekt / Fluff-o-lect**.

Source:
- `skills/chat/town/references/KFB_META_NARRATION_SAMMLUNG_WS0_2026-09-14.md`
- inspected blob: `9ca3ed0a9987fbb11d0721f56d1ec4a83757146`

Core rule:
- the carrying word may be replaced by **Fluff**;
- meaning comes from context rather than from the missing word itself.

Current Town §12.1 adds the important safety rail:
- all three Triplet parts still carry meaning;
- a naked placeholder is too thin;
- Fluff-o-lect uses the **situation as semantic carrier**, not as an excuse for three incomprehensible fragments.

This makes Lean Memory materially useful to dialogue: shared prior events, the visible prop, the place and the current body reaction can carry what the spoken sentence deliberately leaves unsaid.

### 2.5 · Reaction Choreography

Current candidate source:
- Draft PR #256
- branch: `chatgpt-web/toolbox-clay-emanata-v1-2026-09-27`
- head: `051b376d717ce54fc7d563b5ce95c3317523d96d`

The candidate already defines:
`source-backed clip → body/Parts-as-Actors → EyeRig/brows → mouth/active Viseme → Ear Dangle → Clay Emanata → recovery`.

It also defines `social.prop_hit` for Brick Fish:
- physical BONK/recoil reads first;
- default NPC presentation then uses heart Emanata;
- buddy banter, argument and Kayfabe performance are contextual variants;
- real harm remains `damage.*` and consumer-owned;
- Choreography can emit a dialogue cue but does not generate dialogue.

This resident-memory layer therefore chooses **meaning and continuation**, while Reaction Choreography owns the coordinated performance.

### 2.6 · Brick Fish / social prop toss

Current candidate source:
- Draft PR #254
- branch: `chatgpt-web/kfb-town-prop-throw-pattern-2026-09-27`
- head: `79d7c18a8f07b99efe8276211a9cda527ac2f2ea`

The Brick Fish is especially useful as a persistent social-memory object because the same physical action can mean:
- friendly running gag;
- affectionate slapstick;
- buddy banter;
- argument escalation;
- Kayfabe sell;
- real damage only when the consumer explicitly changes semantic event class.

The object identity can therefore recur without inventing a global relationship meter.

## 3 · Resident state should be small and layered

A resident does not need a full transcript or autonomous life-simulation dump.

### 3.1 · Stable authored identity

Owned by existing character/authoring sources:
- name and identity;
- confirmed backstory;
- role/archetype;
- signature deck / favourite cards;
- catchphrase or phrase-family where genuinely authored;
- voice/register;
- preferred activities;
- known homes/places;
- social habits;
- Fluff-o-lect tolerance/style;
- explicit knowledge boundaries.

This layer changes rarely.

### 3.2 · Current embodied state

Owned by the world/actor consumer:
- current place and destination;
- current activity;
- locomotion/action lock;
- current conversation/performance;
- held/visible props;
- focus target;
- temporary mood/acting state;
- current card/media focus.

This is not memory.

### 3.3 · Lean episodic memory

Store only receipts that can later change interpretation or choice.

Proposed contract:

```ts
type ResidentMemoryReceipt = {
  id: string
  residentId: string
  eventType: string
  timestamp: number

  placeRef?: string
  participantIds: string[]
  witnessIds: string[]

  objectRefs?: string[]
  cardRefs?: string[]
  sourceEventRef: string

  knowledgeMode: 'witnessed' | 'told' | 'inferred'
  speakerSourceId?: string

  semanticBeat: string
  outcome?: string

  openLoopId?: string
  chosenRetortId?: string
  spokenTakeId?: string

  salience: 'low' | 'normal' | 'high' | 'must-recall'
  expiresAt?: number

  interpretation?: {
    tag: string
    confidence: 'tentative' | 'held'
  }
}
```

Important separation:
- `sourceEventRef` and participants are world truth;
- `knowledgeMode` describes how this resident knows it;
- `interpretation` is subjective and may differ between residents;
- an LLM may suggest an interpretation but may not rewrite the source event;
- player Almanac memory and resident subjective memory are different consumers of the same event provenance.

## 4 · Social Threads turn memories into mini-scenarios

Do not ask the LLM to maintain an invisible life novel.

Use a tiny resumable thread when a real event creates unfinished social business.

```ts
type ResidentSocialThread = {
  id: string
  kind:
    | 'gift'
    | 'promise'
    | 'card'
    | 'banter'
    | 'argument'
    | 'work'
    | 'performance'
    | 'rumour'

  participantIds: string[]
  memoryRefs: string[]
  state: string

  objectRef?: string
  cardRef?: string

  nextEligibleAfter?: number
  expiresAt?: number
  maxContinuationBeats: number
}
```

Examples:
- gift given → recipient later acknowledges or uses it;
- promise made → resident can later ask whether it happened;
- Brick Fish bonk → one later counter-throw opportunity;
- argument over a Card → one stored retort can reopen the topic;
- band rehearsal → later performance references the prior practice;
- repair/build task → resident remembers who helped;
- one NPC tells another what happened → receiver gets `told`, never `witnessed`.

A thread is not a quest system. It is a small continuity handle.

## 5 · Retrieval: AI-Town principle, KFB ordering

AI Town retrieves a few semantically relevant memories and ranks by relevance, recency and importance.

KFB can adapt that in a more deterministic order:

1. **must-recall open loop**
   - current promise;
   - current gift/object provenance;
   - current staged argument/banter continuation.

2. **direct counterpart memory**
   - latest meaningful event with the present resident/player.

3. **visible-context memory**
   - current Card;
   - current prop;
   - current place;
   - active show/performance.

4. **semantic retrieval**
   - optional embedding or tag match.

5. **recency + salience tie-break**
   - do not let a recent trivial idle beat suppress a still-open promise.

Target retrieval remains small: normally **3–6 receipts**, not a session dump.

## 6 · Interaction selection: event deck before LLM improvisation

A resident first decides whether anything should happen.

Eligibility should remain cheap and rule-based:
- not in combat unless Combat owns the scene;
- not in a vehicle/action lock;
- not already focused in another conversation/performance;
- valid proximity / visibility where needed;
- pair cooldown passed;
- local social-action budget available;
- relevant open thread or current-world trigger exists.

Then choose from a small candidate intent deck, for example:
- notice;
- greet;
- react silently;
- offer/show object;
- give;
- ask;
- remind;
- tease;
- retort;
- disagree;
- reconcile;
- invite;
- throw Brick Fish;
- return Brick Fish;
- comment on Card;
- join music;
- leave.

An LLM may rank or phrase candidates when needed. It should not invent a new world-state transition merely because it can write one.

## 7 · ChatterBox is the language layer

The resident planner should not call a generic chatbot and then retrofit KFB style.

Recommended speech ladder:

### Level 0 · No speech

Valid and common:
- look;
- ear/head turn;
- small face reaction;
- Emanata;
- handoff;
- move closer;
- leave.

### Level 1 · One compact ChatterBox beat

One semantic line driven by:
- current event;
- one relevant memory;
- resident voice;
- visible object/Card.

### Level 2 · Triplet / selectable retort

Use the existing semantic-triplet logic:
- every part carries meaning;
- no filler middle token;
- player may choose from a small Monkey-Island-like response set;
- a heard/chosen retort may become a collectible/reusable memory item when the existing owner supports it.

### Level 3 · Short exchange

Usually 2–4 alternating beats around one actual object, event, promise or disagreement.

Do not automatically escalate every encounter into dialogue.

### Level 4 · Deliberate performance

Use the full:
`Actor/POV → SHOW IT → SPIN IT → SELL IT → player closure`

This belongs on the stage, Card commentary, Kayfabulation, quest performance or another explicit performance context — not ambient street chatter.

## 8 · Fluff-o-lect becomes stronger with memory

Fluff-o-lect should be used when the missing/corrupted carrying word is recoverable from:
- a shared prior event;
- a visible prop;
- a visible Card;
- the current place;
- an obvious body reaction;
- a known repeated ritual or running gag.

It should not be random noise.

### Example · Brick Fish continuity

Event 1:
- resident B is hit by Brick Fish;
- Choreography plays BONK → heart;
- B stores witnessed `social.prop_hit` with A and Brick Fish.

Later, with the same red Brick Fish visible:

Player-facing candidate:
> “You brought the red one again. Don’t fluff me before coffee.”

The missing verb is recoverable from:
- visible object;
- prior shared hit;
- target/source relationship;
- body orientation.

Without that shared context, the line should be phrased normally.

### Example · promise

Earlier:
> “Bring the card back after the show.”

Later, near the stage with the Card visible:
> “So. Did you fluff it, or did the King keep it?”

Again the semantic gap is carried by world state and memory, not by a random nonsense token.

## 9 · Gossip without omniscience

A living town benefits from information moving between residents.

Mechanic:
1. A witnesses an event.
2. A later tells B.
3. B receives a new memory receipt with:
   - `knowledgeMode: 'told'`;
   - `speakerSourceId: A`;
   - source event reference preserved.
4. B may form a subjective interpretation.
5. B must never talk as if they personally witnessed it.

This allows:
- rumours;
- misunderstandings;
- alliances;
- retorts travelling spatially;
- Card claims spreading;
- different residents holding different interpretations of the same event.

Do not add a global gossip truth table. Provenance is enough.

## 10 · Emergent mini-scenarios

The combination of a few receipts + one open thread + one current object can generate readable situations.

### 10.1 · Brick Fish buddy loop

1. A throws Brick Fish at B.
2. B BONKs, then hearts.
3. B stores shared-banter receipt.
4. One retaliation opportunity remains open.
5. Later B notices Brick Fish on the player's table.
6. B may ask for it, steal/borrow it if the world interaction owner permits, or use a stored retort.
7. Thread closes after one counter-beat unless explicitly authored further.

### 10.2 · Card disagreement

1. A and B interpret the same Card differently.
2. Each stores their own interpretation plus the shared Card reference.
3. Player hears and selects one retort.
4. That retort can later reappear with either resident.
5. A third resident can hear about the dispute as hearsay.
6. Stage performance may later reuse the Card and known disagreement.

No resident needs the full prior transcript.

### 10.3 · Gift provenance

1. Resident gives player a prop.
2. Gift receipt stores giver, object, place and occasion.
3. Later the giver can recognize the object when visible.
4. Another witness may comment on it.
5. Replay/import never generates a second gift.

### 10.4 · Workshop continuity

1. Player helps Maker-Space resident fix/build an object.
2. Resident remembers helper + object + outcome.
3. Later encounter can be a silent approving reaction, a short thank-you, or a new related request.
4. The object itself provides context for Fluff-o-lect.

### 10.5 · Music continuity

1. Two residents jam.
2. Store performance receipt and participants, not audio history.
3. Next meeting may trigger a small synchronized groove or callback.
4. Full song/performance remains Audio/Animation-owned.

## 11 · Autonomy budget

The town feels alive through **selective continuity**, not maximum simulation.

Default proposal for the immediate camera neighbourhood:
- max 1 active spontaneous social interaction chain;
- normal bubble budget remains 1 active, soft max 2;
- one spontaneous chain normally ends after 1 response or 1 retaliation;
- pair cooldown after a completed ambient interaction;
- no background chain while a nearby authored quest/performance owns attention;
- micro-reactions should usually avoid LLM calls;
- cached authored/selected language takes are preferred when they fit;
- no chain-of-thought or hidden life-log persistence.

Off-camera:
- schedules/activities may advance if the world owner already simulates them;
- do not fabricate conversations that were never simulated;
- if an NPC-to-NPC event is simulated off-camera, it may create resident memories but not player memory unless the player later witnesses/hears evidence;
- reopening the world should reconstruct from compact state and receipts, not generate retroactive stories to fill time.

## 12 · Memory compaction

AI Town's reflection mechanism is useful as inspiration but too permissive if its inference becomes fact.

KFB compaction rule:
- source receipts remain immutable;
- old low-salience receipts may be summarized into a **subjective resident note**;
- the summary contains references to source receipt IDs;
- the summary is explicitly an interpretation;
- open loops, gifts, selected retorts and authored concrete takes are never compacted away while active;
- rewards and ownership are never inferred by compaction.

Possible compact note:
```json
{
  "residentId": "clown",
  "kind": "subjective_summary",
  "sourceMemoryRefs": ["m12", "m19", "m21"],
  "note": "The player usually plays along with my bad stage bits.",
  "status": "interpretation"
}
```

## 13 · Runtime seam

This design should enter an eventual receiving runtime through semantic events.

Example:

```ts
emitResidentBeat({
  event: 'social.prop_hit',
  sourceId: 'resident-a',
  targetId: 'resident-b',
  objectRef: 'brick-fish',
  worldEventRef: 'evt-7821',
  relationshipTone: 'buddy-banter',
  sceneMode: 'ambient',
  harmMode: 'social'
})
```

The receiver then:
1. validates world truth;
2. writes witness-specific memory receipts;
3. opens/closes a tiny social thread if applicable;
4. chooses whether speech is needed;
5. asks ChatterBox/Triplet for a compatible language beat or selects an existing take;
6. optionally applies Fluff-o-lect only if context supports it;
7. emits the semantic performance cue to Reaction Choreography;
8. returns control to current locomotion/activity.

## 14 · What AI Town should NOT donate

Do not port:
- Convex as a required KFB backend;
- its whole tick/game engine;
- its Pixi client;
- its exact two-person conversation state machine;
- its free-form relationship memory as authoritative social truth;
- its exact importance threshold;
- its reflection prompt as canon;
- full vector-memory infrastructure before a smaller receipt/tag implementation proves insufficient.

The strongest donor is the **shape**:
small state, asynchronous cognition, compact episodic memory, top-k retrieval, cooldowns and one active operation.

## 15 · First productive implementation later

Recommended bounded consumer gate:

**RESIDENT-SOCIAL-MEMORY-01**

In the real current Resident + WorldBuilder/Town receiving surface:

Actors:
- 2 real current Residents.

Objects:
- 1 real source-proven Brick Fish;
- 1 existing Card or gift object.

Required beats:
1. encounter / visual notice;
2. Brick Fish `social.prop_hit` with context-sensitive Choreography;
3. one compact memory receipt for each witness;
4. one open `banter` thread;
5. leave / resume normal activity;
6. later re-encounter;
7. retrieve prior shared event;
8. one ChatterBox line or selectable retort;
9. one context-valid Fluff-o-lect variant;
10. thread closes or becomes one bounded retaliation.

Evidence:
- exact source event and witness receipts;
- no duplicate rewards;
- no false witness knowledge;
- no duplicate AnimationMixer/dialogue owner;
- no conversation spam after cooldown;
- body/face/ears/mouth/Emanata recover cleanly;
- direct Cloudflare Stage only if/when this becomes a real integrated human-review milestone.

No standalone grey/proxy review page.

## 16 · Next gate

This document is design persistence only.

One next gate:
**after the current relevant ToolBox/WorldBuilder recovery blockers are cleared, implement RESIDENT-SOCIAL-MEMORY-01 as one integrated two-Resident world interaction, reusing ChatterBox/Triplets, Fluff-o-lect, Reaction Choreography and existing persistence owners.**
