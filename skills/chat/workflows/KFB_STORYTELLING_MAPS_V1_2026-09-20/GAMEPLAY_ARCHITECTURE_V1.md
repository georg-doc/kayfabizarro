# KFB Storytelling Maps · Gameplay Architecture v1

Status: **IMPLEMENTATION PREP / NO GLOBAL RUNTIME CLAIM**
Date: 2026-09-20
Owner: existing Cartoon Map Board / Storytelling Maps presentation layer

## 1. Goal

Prepare one KISS architecture that can support:

- current Kayfabizarro Freestyle rules;
- KFB + MedKayfab card pools;
- manual human play;
- KFB Karaoke onboarding;
- LLM-assisted co-play;
- autoplay / emergent simulation;
- KayKit, Cube Pet and future Frankensteining player avatars;
- world/zone/galaxy/tactical/cut-scene maps;
- later 1–6 player online rooms;
- deliberately absurd mini-game crossovers.

The architecture must not turn every idea into a new runtime owner.

---

## 2. Layer model

### A · Rule Kernel

Pure game/story state. No Three.js, no DOM, no LLM calls.

Candidate state:

```ts
type KFBGameState = {
  gameId: string
  seed: string
  players: PlayerState[]
  activePlayer: number
  turnNumber: number
  phase: 'draw'|'roll'|'play'|'tell'|'calls'|'move'|'finale'
  drawPile: CardRef[]
  discard: CardRef[]
  quest: CardRef | null
  questProgress: 1|2|3|4|5|6
  scenes: [CardRef|null, CardRef|null, CardRef|null]
  storyMode: 1|2|3|4|5|6|null
  calls: SocialCall[]
  log: GameEvent[]
}
```

### B · Deck Provider

One normalized card interface over multiple sources.

```text
KFB deck JSON/PDF
MED deck JSON/PDF
future custom/local deck
random mixed pool
seeded curated pool
```

The kernel sees `CardRef`, not PDF crop geometry.

### C · Player / Avatar Adapter

```ts
type PlayerAvatarRef =
  | { kind:'kaykit', actorId:string }
  | { kind:'cube-pet', petId:string }
  | { kind:'frankenstein', profileId:string }
```

Avatar is presentation. Story Character remains the current Actor card.

### D · Storytelling Maps Presentation

Consumes rule events and manifests:

- map/board;
- standees;
- dice;
- actors;
- camera;
- VFX/SFX;
- narrator/captions.

### E · Agent Layer

Optional.

Agents can propose actions/text but **cannot mutate game state directly**.

```text
KFBStageContext
→ Agent proposal
→ schema validation
→ Rule Kernel validates action
→ committed GameEvent
→ presentation
```

---

## 3. Action model

Candidate minimal action vocabulary:

```ts
type KFBAction =
  | {type:'DRAW'}
  | {type:'ROLL_MODE'}
  | {type:'PLAY_SCENE', cardId:string, slot:0|1|2}
  | {type:'SWITCH_ACTOR', cardId:string}
  | {type:'TELL', text:string}
  | {type:'CALL', call:'BINGO'|'BONGO'|'BOGGLE'|'BLOEDSINN', text?:string}
  | {type:'MOVE_QUEST', delta:-1|0|1|2}
  | {type:'FINALE', text:string}
  | {type:'START_QUEST', cardId:string}
```

Presentation-only actions such as camera zoom, standee hop or dice bounce never mutate rule truth by themselves.

---

## 4. KFBStageContext v2 candidate

Preserve the historical public seam and extend it.

```json
{
  "players": 2,
  "activePlayer": 1,
  "questProgress": 3,
  "quest": {},
  "scenes": [null, {}, {}],
  "actors": [{"player":1,"card":{}}],
  "turn": {
    "number": 8,
    "phase": "tell",
    "storyMode": 3
  },
  "calls": [],
  "availableActions": ["TELL","CALL","MOVE_QUEST"],
  "seed": "…"
}
```

This can feed:
- UI;
- narrator;
- LLM;
- replay;
- multiplayer observers;
- editor preview.

---

## 5. Four play modes from one kernel

### Manual Table

Humans perform all actions.

Storytelling Maps is presentation only.

### Co-Pilot

Human chooses cards/actions.
LLM proposes:
- a short interpretation;
- one possible story beat;
- one optional question.

Human accepts/edits/ignores.

### Autoplay / Simulation

A controller selects legal actions and produces story text.

For reviewability:
- all prompts/results stored as receipts;
- draws/dice are seeded;
- state changes are deterministic after an accepted action;
- LLM prose itself may be cached rather than regenerated.

### KFB Karaoke

Onboarding/performance layer, not a new rule set.

A beat director walks a player through:

```text
DRAW
→ ROLL
→ PLAY
→ TELL
→ CALLS
→ MOVE
```

Possible presentation:
- metronome / backing beat;
- teleprompter captions;
- FrizzleBob demonstrates;
- card is highlighted/pointed at;
- player repeats/improvises.

Existing audio evidence:
`media/3D_Assets/Sounds/KFB Karaoke Metronomes v3.mp3`

Microphone recognition is optional, never required.

---

## 6. FrizzleCrits seam

The repository currently records:

`KFB Game Sim → FrizzleCrits`

as a reported concept whose exact authoring home/caller chain is still unresolved.

Therefore:

### Do now

Reserve an interface:

```ts
type CriticProvider = {
  evaluate(context: KFBStageContext): Promise<CriticResult[]>
}
```

A critic may propose:
- BINGO;
- BONGO;
- BOGGLE;
- Blödsinn;
- no call.

### Do not do yet

- invent "the FrizzleCrits prompt" from memory;
- claim a canonical set of critic personas;
- rewrite the unresolved Game Sim chain.

Once its source home is pinned, it can plug into `CriticProvider`.

This lets autoplay proceed with a neutral/test critic without fabricating FrizzleCrits canon.

---

## 7. Emergent LLM turn loop

KISS first loop:

```text
Rule Kernel builds legal context
→ DirectorAgent picks one legal action
→ NarratorAgent writes the performed beat
→ optional CriticProvider emits table calls
→ rule validator commits
→ Storytelling Maps stages the result
→ next player
```

No free-form agent gets write access to state.

### Suggested structured output

```json
{
  "action": {"type":"PLAY_SCENE","cardId":"…","slot":1},
  "intro": {
    "name":"…",
    "claim":"…",
    "powerPerformance":"…"
  },
  "storyBeat":"…",
  "questMove":1
}
```

The current rule validator can reject illegal slot/card/phase choices before presentation.

---

## 8. Random KFB + MED cards

Use a seeded `DeckPoolManifest`.

```json
{
  "sources": [
    {"deckId":"kfb-doom","weight":2},
    {"deckId":"med-cardiology","weight":1}
  ],
  "filters": {
    "grades":[1,2,3],
    "tags":[]
  },
  "seed":"episode-0042"
}
```

Benefits:
- reproducible autoplay;
- theme mixes;
- easy testing;
- no duplicate deck runtime.

---

## 9. Storytelling Maps / mini-game encounters

A mini-game does not own the whole KFB rules state.

It receives an encounter request and returns a small narrative result.

```ts
type EncounterResult = {
  outcomeId: string
  summary: string
  tags: string[]
  suggestedQuestDelta?: -1|0|1|2
  mediaRefs?: string[]
}
```

Examples:
- absurd 4D chess;
- bowling balls crashing through pieces;
- dice physics challenge;
- driving a token across a city route;
- dungeon micro-scene;
- platformer beat.

The result becomes story material. It does not silently create a permanent score/win condition for Freestyle.

---

## 10. "4D Chess with bowling balls" architecture

Treat the board as a Storytelling Maps scene preset:

```text
map/board geometry
+ KayKit / custom pieces
+ one encounter mechanic
+ story cards
+ camera director
+ KFB narration
```

Bowling collision can be real physics.

Rule truth stays external:
- story action starts encounter;
- encounter resolves;
- result returns as a story cue / optional Quest suggestion;
- table continues.

This is the same semantic-state-vs-spectacle principle already adopted from the tabletop benchmark.

---

## 11. Multiplayer KISS path

Not for the first POC.

When single-client state/event logging is stable, sync **actions**, not Three.js transforms.

Preferred shape:

```text
client A
client B
client C
   ↘
small authoritative room relay
   ↘
ordered KFBAction log + seed
   ↘
each browser renders locally
```

Because the public surface is already Cloudflare-based, a future Cloudflare Worker + Durable Object/WebSocket room is a natural candidate **if the account/project permits it**.

Why not WebRTC first:
- more connection state;
- host migration complexity;
- harder replay/debug;
- unnecessary for 1–6 low-bandwidth turn actions.

First multiplayer POC:
- 2 players;
- join code;
- active-player lock;
- action log;
- reconnect from snapshot;
- no voice/video transport.

---

## 12. Editor relationship

The future authoring tool should edit the same manifests/events:

```text
game state
+
map scene manifest
+
story/camera cues
+
deck pool
+
agent policy
```

No separate "cut-scene format" and "game format" unless real constraints later demand it.

---

## 13. Suggested implementation ladder after Storytelling Maps T2–T5

1. **G0 · Rule Kernel extraction**
   - current Freestyle turn state;
   - no rendering.
2. **G1 · Context bridge**
   - KFBStageContext v2;
   - compatibility snapshot.
3. **G2 · Karaoke one-turn onboarding**
   - one human;
   - deterministic scripted tutorial.
4. **G3 · LLM Co-Pilot**
   - suggestions only.
5. **G4 · Autoplay**
   - seeded cards/dice;
   - agent receipts.
6. **G5 · CriticProvider**
   - generic first;
   - FrizzleCrits only after source pin.
7. **G6 · Encounter adapter**
   - one absurd mini-game proof.
8. **G7 · Multiplayer**
   - two-player action-log room.

Do not build all of these inside the Odyssey POC.

---

## 14. Product conclusion

KFB Table v6, the current Freestyle rules, historical KFBStageContext and Storytelling Maps fit together unusually well.

The minimal durable core is not "a tabletop game engine".

It is:

> **a small narrative state machine + an event log + multiple theatrical presentations.**

That is the architecture that can scale from one cardboard card on a table to an absurd galaxy map without throwing away the original game.
