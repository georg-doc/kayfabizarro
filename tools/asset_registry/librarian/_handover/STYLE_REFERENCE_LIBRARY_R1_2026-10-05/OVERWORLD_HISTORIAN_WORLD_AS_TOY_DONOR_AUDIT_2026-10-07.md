# KFB Overworld · Historian / Meta-Narrator / World-as-Toy Donor Audit

Status: RESEARCH / DONOR AUDIT · NO OPEN-WORLD RUNTIME WRITES
Date: 2026-10-07
Owner: KFB Asset Registry / Style Reference curation
Receiving consumers later: KFB Open World / ChatterBox / Resident Performance
Current Open World owner remains protected.

## Executive result

The Historian / meta-narrator idea is **not new** in KFB. GitHub contains several compatible but historically separate strands:

1. a built deterministic Afterglow/caption narrator;
2. a zone-story narrator role;
3. an explicit Masterplan concept "Der Erzähler als Figur";
4. a North Star "Die Welt als Spielzeug";
5. autonomous Mob life / ambient chatter;
6. an explicit NIE → ChatterBox adapter contract;
7. current Resident Performance / Reaction architecture that can receive presentation cues later.

These should be reconciled, not replaced.

## 1 · BUILT HISTORICAL DONOR · Afterglow narrator

Source:
`overworld/overworld/narrator-2d.js`

Historical behavior:
- deterministic, no LLM required;
- `captions(ctx)` offers three caption choices after a zone is cleared;
- **the player is the letterer**: selection sets the tone of the later Afterglow;
- `compose(save)` builds Afterglow from facts, chosen captions and Diary;
- historical tones: heroic / cynic / absurd;
- fallback narration exists below any future LLM layer.

Useful current lesson:
**narration can be authored from world facts + player framing without becoming a world-state owner.**

Do not port the old implementation blindly.
Its event/state model is historical.

## 2 · BUILT HISTORICAL DONOR · Zone mini-story narrator

Source:
`overworld/overworld/zone-story.js`

Important contract:
- runtime is "the skeleton, not the story";
- story content was explicitly expected from NIE / authoring;
- beat shape included:
  - occasion;
  - speaker role;
  - one short text;
  - carrier type;
  - once/repetition behavior;
- `who` already allowed `guard | mob | narrator`;
- six historical occasions:
  `enter · guard · fight · win · reveal · leave`;
- silence after the sequence is valid;
- content author does not own the state machine.

Useful current lesson:
**the narrator should consume semantic occasions from the current world rather than create its own event system.**

Do not promote these six event names as current runtime truth before Architecture Freeze.

## 3 · OPEN HISTORICAL CONCEPT · "Der Erzähler als Figur"

Source:
`overworld/docs/MASTERPLAN_overworld.md` §4.2f

Historical concept elements:
- opening caption: "It was a dark and stormy Knight…";
- fog / graveyard arrival;
- reincarnated Knight with amnesia as diegetic reason for explanation;
- narrator box is rectangular, screen-positioned, **not anchored to a speaker**;
- narrator evolves from voice → device → companion;
- explicit inspiration: the date/time computer from *Es war einmal… der Mensch*;
- three-beat slot machine doubles as date machine / oracle / King-choice object;
- narrator explains **meta-closure**, not controls;
- dry robotic delivery;
- deadpan / Loriot logic;
- narrator must be rare;
- if narration says what is already visible, it becomes a subtitle;
- if it says what cannot be seen, it earns narrator status;
- narrator-as-tutorial-manual is explicitly rejected.

This aligns strongly with Georg's current Historian idea.

### Identity remains unresolved

Historical files contain more than one identity direction:
- FrizzleBob / Carny-absurd as first narrator candidate;
- a robotic date-computer / device;
- current discussion: Historian / chronicler.

Do **not** force these into one identity now.
Architecture/content design should separate:

`NARRATOR ROLE` from `NARRATOR PERSONA`.

Possible later persona experiments can consume the same role.

## 4 · CURRENT NORTH STAR DONOR · "Die Welt als Spielzeug"

Source:
`overworld/docs/MASTERPLAN_overworld.md` §4.4c-2

Historical Georg direction:
**the world should speak, breathe and react.**

Named composition:
- Kayfabe Sims;
- Super Bizarro Mario;
- Hitchhiker's Guide / Fractal Almanac;
- Monkey Island on Acid.

Priority statement:
**immersion + points of interest over combat depth.**

Useful concrete principles already present:
- ambient chatter = many short world-space beats;
- one interactive bubble = deliberate player conversation;
- neutral creatures and allies share world-presence paths rather than existing only as combat targets;
- tone/heat can affect expression without replacing semantics;
- world behavior should communicate state;
- props/places can be playable affordances, not menu labels.

Current portfolio phrasing later sharpens this into:
**KFB claymation cartoon open world as a living toy.**

## 5 · BUILT HISTORICAL DONOR · Mob Eigenleben

Sources:
- `overworld/overworld/mob-ai.js`
- `overworld/overworld/factions.js`
- v14 freeze/history for later living-world goals

Historical design:
- one small brain/state model per Mob rather than frame-by-frame random behavior;
- minimum dwell time in states;
- perception / territory / temperament;
- world-space chatter;
- bubble placement avoids stealing another Mob's attribution;
- some Mob behavior existed for life/territory, not merely combat;
- later v14 planning called for more life between Card Zones, natural patrols and individual purposes such as searching for resources.

Useful current lesson:
**Mobs/Residents need ongoing activities and local purpose, not just encounter triggers.**

This maps cleanly to the current Resident Life semantic model and Blender choreography work.

## 6 · WORLD-AS-TOY creature donor

Historical sources:
- `overworld/overworld/units-catalog.js`
- `overworld/overworld/overworld-game*.js`

The old "world as toy" Critter rule deliberately separated some creatures from zone combat progression:
- peaceful but interactable;
- killing them did not grant ordinary progress;
- player behavior produced reputation/social meaning instead;
- shape-shifting was also treated as a toy-like exploration affordance.

Useful current lesson:
**not every actor exists to pay out XP or advance a quest.**
The world can expose consequences without forcing one "correct" game loop.

## 7 · NIE / ChatterBox historical contract

GitHub source:
`overworld/docs/BRIEFING_ChatGPT_phrasen-prompts.md`

Private Dropbox donor:
`NIE_ADAPTER_HOOK.md`

Historical authority split:

```
NIE              semantic/structural upstream
FrizzleBob masks performance/register
ChatterBox       who/when/budget/speaker selection
Bubble/Emote/TTS output
```

Strong surviving principles:
- **no NIE inside the runner**;
- static fallback exists before any generative request;
- response may be rejected;
- one bubble gets only as much context as its beat can pay for;
- Card/semantic seed outranks generic world chatter;
- external material is digested through worldview, not quoted raw;
- world movement alone is normally silent.

This architecture is still directionally compatible with current one-owner rules.

## 8 · NIE Writer's Room / Dialogue donors

Private source root:
`MD NARRATIVE INTELLIGENCE ENGINE`

Useful inspected donors:
- Writer's Room OS;
- room brainstorm;
- character web;
- conflict map;
- South Park therefore/but tool;
- dialogue/debate grammar;
- character development system;
- style compression;
- FrizzleBob WritersRoom.

What transfers to KFB:
- Therefore/But causality;
- Yes-And during generation;
- character relationship/power web;
- SAID / MEANT / WANTED;
- adjacency pairs;
- interruption as power/character signal;
- silence as a speech act;
- callbacks;
- distinct register/worldview;
- conflict as clarification;
- internal multi-voice critique.

What does **not** transfer automatically:
- the Writer's Room ensemble as in-world characters;
- long debate formats;
- real-world research requirements for every NPC line;
- NIE as a synchronous gameplay dependency.

## 9 · KayfabeTips as compact authoring lens

Current public/user-supplied tips are strongly compatible with NIE:

- Therefore / But → causal beat chain;
- Yes, And → accept current stage truth before bending it;
- follow people, not props → wants/relationships first;
- weirder card, straighter face → deadpan Kayfabe;
- one real picture beats ten big ideas → concrete image/action floor.

Recommended use:
**make these five the fast human-readable audit, while the longer Etherington+NIE rule sheet is the deep authoring contract.**

## 10 · Historian / Meta-Narrator synthesis candidate

### Role
An external-seeming but diegetically compatible observer/chronicler.

### Inputs
Only facts supplied by existing owners:
- current place/event;
- observed outcome;
- world/Resident memory exposed by the consumer;
- optional Card/deck/POI semantic refs;
- optional player-selected narration tone if later retained from Afterglow.

### Output
Presentation/content only:
- caption;
- short off-screen line;
- optional later persistent observer/device state;
- no gameplay mutation.

### Good jobs
- place/time framing;
- aftermath;
- transitions;
- reveal of invisible context;
- irony between heroic framing and observed consequence;
- callbacks after repeated meaningful events;
- rare fourth-wall/meta-closure beat.

### Bad jobs
- narrating visible movement;
- explaining controls;
- repeating quest text;
- commenting on every death;
- universal punchline machine;
- deciding what happened.

## 11 · Death / revival opportunity

Current user concept:
after repeated player death/revival, the graveyard/ghost/skeleton social layer begins recognizing the pattern.

Existing donors already support the pieces:
- graveyard/tutorial identity;
- narrator role;
- Failure / Excuses / Callback / Group Dynamic sources;
- Resident memory/reaction proposal;
- ChatterBox content ownership;
- performance channels including silence/gaze/Emanata.

Recommended authoring escalation:
1. first failure → acknowledgement or silence;
2. repeat → recognition;
3. repeated pattern → callback / changed estimate of player;
4. established relationship → Resident-specific interpretation;
5. group witness case → one primary speaker, others react nonverbally or remain silent.

Do not bind this to a runtime `deathCount` field until current Architecture Freeze reveals the actual state/event seam.

## 12 · Activities / "world breathes" connection

The current Resident semantic/prep work should be treated as the modern receiving layer for the old "world as toy" principle.

Activities worth narrative presentation are not only quests:
- work;
- repair/rebuild;
- trade/shop;
- gift/receive;
- Fluff exchange/spill;
- patrol/watch;
- resource search;
- performance/music;
- social encounter;
- POI observation;
- travel/wait/rest;
- reacting to another Resident or player action.

Historian and ChatterBox should **observe or frame** these activities, not schedule them.

## 13 · Donor classification

### KEEP / STRONG DONOR
- world speaks/breathes/reacts North Star;
- narrator role separate from world state;
- narrator rarity;
- meta-closure not tutorial narration;
- deterministic fallback/Afterglow principle;
- player framing can influence retrospective narration;
- zone-story content/runtime separation;
- semantic event → presenter architecture;
- context budget;
- Mob/Resident local purpose;
- ambient chatter vs one interactive conversation;
- social consequence for non-quest interactions.

### PROPOSAL / NEEDS CURRENT ARCHITECTURE CHECK
- Historian identity/persona;
- persistent narrator device/companion;
- graveyard death/revival commentary;
- player-selected narrator tone;
- date-machine / oracle / narrator object convergence;
- exact memory/callback fields.

### HISTORY / DO NOT PROMOTE AS CURRENT API
- v10 six occasion names;
- old Mob/state implementations;
- old 2D bubble geometry/timing numbers;
- old combat/XP/zone counts;
- old UI paths.

## 14 · Integration order

1. finish source/authoring curation;
2. optional Seed 05/06 Asset Librarian sync;
3. exact Coworker intake;
4. Architecture Freeze identifies current world/Resident event/state seams;
5. map Historian + ChatterBox reactions onto those seams;
6. test one representative world event with:
   - one Resident line;
   - one silent/nonverbal response;
   - one rare narrator/caption beat;
7. only then consider a richer narrator persona/device.

## Protected boundary

No PR #348 runtime write.
No PR #357 reactivation.
No second narrator engine.
No new event owner.
No merge or Live promotion.

## One next gate

**Use this donor audit during the post-Coworker Architecture Freeze; until then continue authoring/source curation only.**
