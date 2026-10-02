# KFB-NARRATIVE-CORE-RECON-01 · NARRATIVE_RUNTIME_ARCHITECTURE

Target picture reconstructed from existing sources. Nothing here is built. Every layer names the **existing** artefact that fills it today (or `PLANNED`), and exactly one owner. Open conflicts are referenced as `D-xx` (ledger) and `G-xx` (open decisions).

## 0 · Principles carried over from the sources

1. **Rules are the public #kfb canon** (D-01, D-08). No engine, prompt or NIE file may change them silently.
2. **One owner per concern.** Consumers read data; they never fork it (CritEngine boot decision; Resident PR owner lists).
3. **The LLM proposes, the runtime disposes.** LLM output is a typed *intent* that is validated against state before anything happens. It never moves a die, a body, a camera or an object directly.
4. **Deterministic first, LLM optional** (CritEngine v2.0 vs v2.1; #305 kernel; StoryRunner audit scorer).
5. **Synthesis belongs to the player** (Simulator v0.8 pencil rule): the system never writes the final meaning.
6. **Layer Zero applies to every generated text** (Simulator and GM engine already enforce it).
7. **Disciplined ambiguity** (NOS/AOS): documented / plausible / speculative stay separate when real-world material enters a seed.

## 1 · The six axes (kept separate on purpose)

| Axis | Values | Owner | Today |
|---|---|---|---|
| `seat` | 1–6, controller `human` \| `sim` \| `empty` | Kayfabulation Game Director | GM engine `turnIdx` over a roster (no human/sim switch) |
| `persona` | crit / player identity (FrizzleBob, Hunky, Dory, …) | CritEngine (**PLANNED**); interim pinned candidate profile (G-06) | GM roster YAML, S01 YAML, CtP YAML (three lists, D-04/D-07) |
| `storyMode` | Tragic, Comic, Absurd, Heroic, Mystical, Forbidden | rolled per turn by the Game Director (PUB) | GM rolls per turn; SIM picks one dominant mode (D-01) |
| `lens` | NOS/AOS lenses (FrizzleBob-Loriot, Hunky & Dory, Alien Overlord) and NIE formats (advisory council, roundtable, Quill flows) | NOS/AOS (method) + NIE (formats) | documents only; a lens counts only after 5 real outputs (NOS) |
| `resident` | an embodied NPC in the 3D world | Resident Atlas (character/set/rig truth) | Resident PRs #305–#310, Residents Lorekeeper/Goth Girl/Clown/Witch |
| `memory` | relationships, experience, receipts | **undecided** (D-13, G-11) | `crit_memory.py` (implemented) vs #272 (design) |

Allowed bindings: a seat *is played by* a persona (or a human); a persona *plays* any story mode; a persona *may be looked at through* a lens; a resident *may embody* a persona; memory *records* what seats, personas and residents did. A resident never owns rules or story; a lens never owns state.

## 2 · Ten layers and their owners

```
 (1) Card & Rule Canon ─────────────┐ PUB rules · deck SSOT · Layer Zero
 (2) User Seed & Mnemosyne Tafel ───┤ Match Card · Tafel fragments · real-world dossier (optional)
 (3) NIE Analyze / Generate / Play ─┤ seed enrichment, never rules
 (4) NOS/AOS Lens selection ────────┤ how a seat or output is seen
 (5) CritEngine persona / conflict ─┤ who speaks, why they clash, how they fail and repair (PLANNED)
                                    ▼
 (6) KAYFABULATION GAME DIRECTOR  ◄── the only owner of table state (seats, cards, stage, quest, dice, King, calls, finale)
        │  emits typed events (KFB_SIM_EVENT_SCHEMA)
        ├──► (7) Culture Director ── turns allowed events into world-action intents (gift, dance, debate, throw, brawl, work …)
        │           │ intents, validated
        │           ▼
        │    (8) Deterministic Runtime ── animation, combat, physics, navigation, Residents' bodies (WHEN/HOW it moves)
        ├──► (9) Presentation ── ChatterBox, Triplets (#305), speech bubbles, Emanata, comic panels, Simulator UI
        └──► (10) Lean-Memory receipts ── compact, bounded records (owner per G-11)
```

| # | Layer | Owner | Existing artefact(s) | Status |
|---|---|---|---|---|
| 1 | Card & Rule Canon | Georg (public page) + deck lane | `#kfb`, `decks/*.json`, starter bundle v1.4, Layer Zero | CANON |
| 2 | User Seed & Mnemosyne Tafel | Seed layer (input only) | Simulator Match Card JSON (export/import), Tafel model (NIE M65, 15 fragment types), `hunky_dory_dialogue.ts` input schema | DONOR |
| 3 | NIE Analyze/Generate/Play | NIE (knowledge, not runtime) | START_HERE paths, OPERATION_MODES, field solver, Warburg | CANON-SUPPORT; M50 rules LEGACY |
| 4 | NOS/AOS Lens | NOS/AOS method | Briefing → Dossier → Lens → Output Format | CANON-SUPPORT; lenses not yet "official" |
| 5 | CritEngine persona/conflict/failure loop | CritEngine | `CLAUDE.md`, boot decision; S01 YAML (candidate); runtime formula `trigger → failure_spiral → speech_signature → destabilize partner → repair → re-entry` | **PLANNED / INCOMPLETE** |
| 6 | Kayfabulation Game Director | **new owner, built from donors** | GM v2 rules loop + King step + NDJSON; Simulator v0.8 corpus/Match Card/JSON hygiene/finale | to build (SIM-01) |
| 7 | Culture Director | **new owner, later** | #272 AIDA/POI design, Brick Fish + reaction choreography seams | to build (after SIM-01) |
| 8 | Deterministic Runtime | existing world owners | World/Drive/Combat/Animation owners (Motion Library #275, Combat Arena, Resident Atlas) | exists elsewhere; not touched |
| 9 | Presentation | ChatterBox (WHAT) + host (WHEN) + bubbles | #305 kernel, #306 card-scene seam, Simulator UI, Emanata | DONOR/CANDIDATE |
| 10 | Lean-Memory receipts | **G-11** | `crit_memory.py` (per-crit, bounded, ON/OFF), #272 Lean Memory design | undecided |

## 3 · Data flow of one Kayfabulation turn

```
seat N active
  1 RollMode        Director rolls d6 (seeded rng)               → story_mode_rolled
  2 PlayCard        controller chooses: scene slot | actor switch → card_played
                    Card Ritual: card_shown → card_spun → card_sold (text from human or TellProvider)
  3 Tell            controller provides the story                → story_told (+ story_beat[] panels)
  4 Draw            Director draws back to 3                     → card_drawn
  5 SocialCalls     window opens for other seats                 → social_call[]
    Verdict         King = seat N+1: +2/+1/0/−1 or BLÖDSINN upheld → verdict, quest_changed
                    die < 1 → quest_failed ; die = 6 → finale_armed
  crown passes      → king_passed
memory              → memory_receipt (append-only, bounded)
```

A **human** seat supplies choices and text through the UI. A **sim** seat supplies them through two pluggable providers:

- `DecisionProvider` (deterministic): which card, which slot, actor switch or not, which call, which verdict. Inputs: persona profile (disposition fields as in GM: `switchBias`, `pole`, `kingGenerosity`, `callBias`), visible state, seeded rng.
- `TellProvider` (text): ritual lines and the story. Default = deterministic/authored (templates, Triplet pool, card lore); optional = async LLM with the Layer Zero guard and a schema check. The result is logged, so a **replay never calls a provider again**.

Taking over a sim seat = switching its controller to `human` between two events (`seat_controller_changed`). Because state lives only in the Director, nothing else has to change.

## 4 · Typed interfaces (sketch, TypeScript-style)

```ts
type SeatId = 1|2|3|4|5|6;
type StoryMode = 'TRAGIC'|'COMIC'|'ABSURD'|'HEROIC'|'MYSTICAL'|'FORBIDDEN';
type SocialCall = 'KAYFABINGO'|'KAYFABOGGLE'|'KAYFABONGO'|'BLOEDSINN';      // PUB semantics (D-11)
type TripletOperator = 'BINGO'|'BONGO'|'BOGGLE'|'BLOEDSINN';                 // #305 semantics, presentation only
type VerdictDelta = 2|1|0|-1;

interface CardRef { deckId: string; cardTitle: string; source: 'deck-ssot'|'bundle-v1.4'|'diy'; }
interface Seat { id: SeatId; controller: 'human'|'sim'|'empty'; personaId?: string; actor?: CardRef; hand: CardRef[]; }
interface TableState {
  sessionId: string; rngSeed: string; rulesetId: 'kfb-public-2026-10'; options: { safeFloor: boolean; trophyRule: boolean };
  seats: Seat[]; stage: [CardRef|null, CardRef|null, CardRef|null]; quest: CardRef|null;
  questDie: number; activeSeat: SeatId; kingSeat: SeatId; phase: 'setup'|'turn'|'finale'|'after'|'quest_failed';
  eventIndex: number;
}
interface DecisionProvider { decide(view: SeatView, kind: 'play'|'call'|'verdict'): Decision; }      // pure, seeded
interface TellProvider { tell(req: TellRequest): Promise<TellResult>; }                                 // may be async
interface TellResult { text: string; panels?: { text: string; speaker: string }[]; provider: string; layerZero: { pass: boolean; hits: string[] }; }
interface WorldIntent {                         // Culture Director → Runtime, never executed by the LLM
  intent: 'gift_offer'|'gift_open'|'dance_invite'|'debate'|'throw_prop'|'brawl'|'monologue'|'work_activity'|'recognize';
  actorId: string; targetId?: string; propId?: string; place?: string; reason: EventRef; ttlMs: number;
}
interface IntentResult { accepted: boolean; reason?: string; runtimeOwner: string; }
interface MemoryReceipt { subjectId: string; kind: string; ref: EventRef; summary: string; weight: number; bounded: true; }
```

Validation rule for every LLM-originated value: it must be a member of an enum or reference an existing id in `TableState`; otherwise the Director rejects it and logs `intent_rejected`.

## 5 · Owner boundaries (who may write what)

| Data | Writer (only) | Readers |
|---|---|---|
| Rules, rule options | Georg / canon | Director |
| Cards | deck SSOT lane | Director, Seed, Presentation |
| Table state, dice, King, calls, finale | **Game Director** | everyone else |
| Persona profiles, conflict matrix | **CritEngine** (interim pinned candidate) | Director (DecisionProvider), Lens, Presentation |
| Seeds, Tafel fragments | Seed layer / NIE | Director (setup only) |
| World actions | **Deterministic Runtime**, after validating Culture Director intents | Presentation |
| Ambient Resident speech | **ChatterBox** + #305 kernel (WHAT), host (WHEN) | Presentation |
| Memory store | **G-11 owner** | Director (setup injection), Culture Director, ChatterBox (knowledge items) |

Explicitly forbidden: Triplet pool narrating Kayfabulation turns (would make ChatterBox a second narrative owner); NIE prompts deciding verdicts; Residents holding table state; any layer writing memory except through `memory_receipt`.

## 6 · Donor mapping for the Game Director (SIM-01)

| Contract needed | Take from | Adapt |
|---|---|---|
| Card corpus loading | Simulator v0.8 / bundle v1.4 (`{n,name,power,lore,g}`, `roleHint`) | keep grades hidden from sim seats (GM blind rule) |
| Match Card (Actor + 3 Scenes + Quest) export/import | Simulator v0.8 | becomes setup snapshot of the Director |
| Turn loop, rotating King, Quest Fail, BLÖDSINN by King | GM v2 rules | align to PUB: Show/Spin/Sell, hand 3 / draw after, no +2 cap (D-10, D-12) |
| Social calls with per-persona bias | GM `callBias` | PUB semantics (D-11) |
| Per-turn log | GM NDJSON | becomes `KFB_SIM_EVENT_SCHEMA` events with sequence numbers |
| KPIs, slop check | `playtest_postprocessor.py`, `check_repair.py` | read the new log; unchanged otherwise |
| JSON hygiene for LLM text | Simulator `parseWithRepair`, `sanitize`, retry, fallback, `epToken` | applies only to the optional LLM TellProvider |
| Finale after-show | Simulator four readings + pencil synthesis | optional, after the PUB finale, never replaces it (G-01) |
| Persona voice | GM roster + Layer Zero; S01 YAML for Hunky/Dory/FrizzleBob (candidate) | pinned, `canon:false` (G-06) |
| Look | Simulator design tokens (site CSS) | reuse; no redesign in SIM-01 |

## 7 · Path to embodiment (later, not SIM-01)

1. **SIM-01** produces events only (headless + minimal table UI).
2. **Presentation bridge**: `story_told` / `card_sold` → existing card-scene seam of #306 (`lineProvider`) so two Residents can *perform* a recorded turn. The Triplet kernel stays for ambient lines between turns.
3. **Culture Director**: selected table events (`verdict` hard push, `social_call` KayfaBINGO, `quest_failed`, `finale_told`) and world events (#272 AIDA loop) become `WorldIntent`s: gift, dance, debate, Brick-Fish throw, brawl, work. The runtime owners (Combat, Motion Library, Resident Atlas) accept or reject.
4. **Memory**: receipts feed the decided memory owner; Residents recognise players and other personas through it.

## 8 · Culture mechanics map

| Mechanic | Trigger source | Intent | Runtime owner (existing) | Memory receipt |
|---|---|---|---|---|
| Mutual gifting | KayfaBINGO, finale loot, relationship threshold | `gift_offer` → `gift_open` (+ `emotion_reaction`) | Resident Atlas props + Motion Library | giver/receiver, card or prop ref |
| Opening a gift + emotional reaction | `gift_open` | emote/clip choice | Motion Library (#275), Emanata | reaction kind |
| Dancing together | hard-push verdict, finale, music event | `dance_invite` | Motion Library (dance clips), Orc band visualiser | partners |
| Throwing Brick Fish or props at heads | BLÖDSINN upheld, KayfaBONGO, debate escalation | `throw_prop` | Combat/physics owner; Brick Fish candidate seam (#272) | thrower/target/prop |
| Quarrel and debate | conflict edge from persona matrix (PLANNED), opposing verdict streak | `debate` (roundtable/advisory format as lens) | ChatterBox presentation; no physics | stance, outcome |
| Wrestling-style scuffle, melee | debate escalation past threshold, Forbidden mode finale | `brawl` | Combat Arena owner | winner/loser, grudge |
| Storytelling, monologue, Speakers' Corner | Tell beat, finale, `monologue` intent at a POI | `monologue` | Presentation + POI (#272) | topic, audience |
| Show it · Spin it · Sell it | every card played | `card_shown/spun/sold` events | Director; Presentation performs | card ref |
| Work and routines | idle between sessions, AIDA loop | `work_activity` | Resident routines (#272 design) | place, activity |
| Smithy, mine, bar, market and other places | POI type | `work_activity{place}` | world owners | place visits |
| Relationships, recognition, learning traces | receipts over time | `recognize` | memory owner (G-11) | updated relation |
| Kayfabulation as playful reading of real cards | real deck cards at a table POI | full SIM-01 session in-world | Director | session summary |

## 9 · What this architecture deliberately does not do

- It does not invent a narrative engine: the Director is the existing GM loop made deterministic and aligned to PUB.
- It does not reduce KFB to ChatterBox, Triplets or NPC chat: those are layer 9.
- It does not declare CritEngine finished: layer 5 is read through a pinned candidate until CritEngine delivers.
- It does not integrate the Open World, merge, deploy or redesign UI.
