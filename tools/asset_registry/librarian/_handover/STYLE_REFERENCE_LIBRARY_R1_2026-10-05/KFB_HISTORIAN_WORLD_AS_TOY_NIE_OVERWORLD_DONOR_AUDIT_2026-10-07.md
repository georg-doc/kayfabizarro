# KFB Historian / Meta-Narrator / World-as-Toy · Overworld + NIE donor audit

Status: **RESEARCH / DONOR AUDIT · NO CURRENT RUNTIME PROMOTION**
Date: 2026-10-07
Research owner: ChatGPT Web Chat
Receiving consumers later: KFB Open World / ChatterBox / Resident Performance
Protected current owner: Open World receiving path PR #348 after exact Coworker intake

## Executive finding

The Historian/meta-commentator idea is **not new** in KFB.

The repository contains three distinct historical layers that should be reused rather than re-invented:

1. a **built historical fallback narrator / Afterglow**;
2. a **built historical zone-story narrator slot** and NIE content seam;
3. a later **OPEN “narrator becomes a character” concept** closely matching Georg's current Historian idea.

Separately, the Overworld already articulated **“Die Welt als Spielzeug”** as a North Star: the world should speak, breathe and react; immersion and points of interest outrank combat depth.

None of these historical layers is automatically current Open World runtime truth. They are donors to be reconciled after Coworker intake + Architecture Freeze.

---

# 1 · HISTORIAN / NARRATOR DONORS

## H1 · Built historical narrator fallback

Source:
`overworld/overworld/narrator-2d.js`

Historical status:
**IMPLEMENTED DONOR · NOT CURRENT 3D WORLD OWNER**

The module explicitly described itself as a fallback layer without LLM.

Two functions:
- `captions(ctx)` — after a cleared zone, offer three caption choices;
- `compose(save)` — create an Afterglow from facts, chosen captions and diary.

Important design facts:
- the **player is the Letterer**;
- player choice changes the narration tone;
- historical tones: heroic / cynic / absurd;
- deterministic/fallback narration exists below any later generative layer.

### Reuse value now

Strong donor principles:
- deterministic narration works without an LLM;
- narration can use **facts already owned by gameplay**;
- narration may be perspectival rather than “objective”;
- player-selected framing can alter interpretation without altering game truth;
- an LLM, if ever used, belongs **above** a viable deterministic fallback.

Do not copy its old tone pools or state shape blindly.

---

## H2 · Built historical narrator slot inside zone stories

Source:
`overworld/overworld/zone-story.js`

Historical status:
**IMPLEMENTED STORY-SCHEDULING DONOR · CONTENT OWNERSHIP EXPLICITLY EXTERNAL**

Original principle:
**“Das Gerüst, nicht die Geschichte.”**

Historic beat shape:
`{ on, who, text, type, once }`

Historic `who` supported:
- guard;
- mob;
- narrator.

Historic occasions:
- enter;
- guard;
- fight;
- win;
- reveal;
- leave.

Key principles:
- runtime decides the occasion, not the story meaning;
- content author writes beats, not state machines;
- one short sentence / one bubble;
- repeat visits may consume a sequence of different beats;
- when no beat remains, **silence is valid**;
- NIE was intended as semantic/content upstream later.

### Reuse value now

This is a direct precedent for the current architecture rule:
**world state/event owner emits truth → narration/dialogue layer selects expression**.

Do not promote the old six event names as current API names.
Architecture Freeze must map this grammar onto the actual returned World event seam.

---

## H3 · OPEN historical “Erzähler als Figur”

Source:
`overworld/docs/MASTERPLAN_overworld.md` §4.2f

Historical status:
**OPEN CONCEPT DONOR · NEVER TREAT AS IMPLEMENTED**

The concept already contained:
- narrator box at top, rectangular and unanchored;
- “the only bubble that belongs to nobody”;
- graveyard/fog opening;
- reincarnation / amnesia as shared-discovery device;
- narrator evolves **voice → device → companion**;
- explicit inspiration from the date computer in `Es war einmal … der Mensch`;
- three-beat slot-machine/time-machine idea;
- narrator explains **meta-closure, not controls**;
- dry/deadpan machine voice;
- narrator should be rare;
- if it says what is already visible, it becomes subtitle;
- if it explains how to play, it becomes a voiced manual.

The historical concept also proposed a Loriot-like rule:
catastrophe can emerge from correct, orderly, polite behavior rather than stupidity or mugging.

### Reuse value now

This is the strongest direct donor for Georg's current **Historian / in-game commentator** concept.

It suggests a useful progression without requiring a new state owner:

`caption voice → observable device/character → optional recurring companion/observer`

The underlying facts must still come from existing game/event owners.

---

## H4 · Later “Ship Computer” narrator-performance donor

Source class:
KFB Cartoon Studio / character-performance reference, Dropbox donor.

Historical status:
**LATER CROSS-PROJECT DESIGN DONOR · NOT OPEN-WORLD CANON**

Useful compatible ideas:
- narrator is apparently neutral but actually opinionated;
- dry, patient, mildly tired;
- informational authority, not social authority;
- no constant punchlines;
- narrator can keep **watching after speaking**;
- narrator box can persist as an acting space;
- states such as speaking / watching / listening / unimpressed / silent;
- a persistent narrator can create a third social presence without another full-body actor.

### Reuse value now

This extends the old Overworld “voice → device → companion” idea with performance behavior.

Potentially useful for a Historian display/device:
the device can react through gaze/timing/silence without generating another line.

Again: donor only.

---

# 2 · NIE / AUTHORING PRECEDENTS

## N1 · NIE was already the intended semantic upstream

Source:
`overworld/docs/BRIEFING_ChatGPT_phrasen-prompts.md`

Historical workflow explicitly said:
Overworld phrase/prompt material should be developed with Georg, tested/optimized in the **Narrative Intelligence Engine**, then reviewed and integrated.

The built runtime stayed separate.

This is exactly the safe architecture today:
- NIE/Writer's Room = authoring/research/semantic upstream;
- ChatterBox = current dialogue/content owner;
- Resident Performance = presentation consumer;
- Open World = gameplay/world truth owner.

Do not embed the NIE itself in the runtime.

---

## N2 · Historical NIE adapter hook

Dropbox donor:
`NIE_ADAPTER_HOOK.md`

Historic role split:
- NIE = semantic/structural upstream;
- FrizzleBob masks = performance/register layer;
- ChatterBox = who/when/budget/speaker selection;
- Bubble/Emote/TTS = output.

Especially valuable retained principle:

**A bubble gets only as much world as its beat can pay for.**

Historic context priority:
1. Card/semantic seed;
2. immediate situation;
3. faction worldview;
4. relationship;
5. local history;
6. global/RSS context.

Fallback was treated as normal, not failure.

### Current interpretation

Keep the principle, not the old network contract.

The current runtime does not need an online NIE request to benefit from NIE-authored pools/rules.

---

# 3 · KAYFABE TIPS AS COMPACT AUTHORING LENS

Public KFB rules already distill useful NIE logic.

## Therefore / But
Cause or resistance links the beats.
Use at dialogue-turn scale as well as story scale.

## Yes, And
During ideation, accept the current Stage truth before spinning it.
Selection/critique happens after generation.

This is an **authoring-room rule**, not permission for runtime state mutation.

## Follow people, not props
A Card/POI/activity becomes dramatic through a character's want, fear, status or relationship.

## Weird card, straight face
Do not wink at the premise.
Let contradiction and consequence carry humor.

## One real picture beats ten big ideas
Concrete action/place/object/social behavior should precede abstract interpretation.

These five rules are compatible with the current Etherington/NIE authoring contract and should be used as a fast audit layer.

---

# 4 · WORLD AS TOY · HISTORICAL NORTH STAR

Source:
`overworld/docs/MASTERPLAN_overworld.md` §4.4c-2

Historical explicit North Star:

**the world should speak, breathe and react.**

Original comparison:
`Kayfabe Sims + Super Bizarro Mario + Hitchhiker's Guide / Fractal Almanac + Monkey Island on Acid`.

Original priority:
**immersion and Points of Interest beat combat depth.**

This is not merely visual style.
The historical system decisions already implied a living toy through:
- ambient chatter;
- interactive speech bubbles;
- neutral/friendly/hostile actors sharing one social path;
- mobs with territories and behaviors;
- world reactions;
- critters existing outside zone/combat progression;
- embodied comic UI reactions.

---

# 5 · MOBS / RESIDENT LIFE / ACTIVITIES DONORS

## W1 · Mob Eigenleben

Source:
`overworld/overworld/mob-ai.js`

Historical status:
**IMPLEMENTED 2D DONOR**

The design explicitly used:
- one behavior brain per mob;
- states with minimum dwell time instead of frame-by-frame thrashing;
- perception/steering;
- territory;
- emergent behaviors rather than one subsystem per verb;
- speech-bubble placement tied to the actual actor.

Reuse principle:
Residents/mobs should appear to be **doing something before the player arrives**.

---

## W2 · Life between Card Zones

Source:
historical v14 handover/freeze material.

Historical proposed direction:
- distribute mob/life zones sensibly;
- natural patrol paths;
- individual mobs with purpose;
- example: searching for resources;
- measure performance before increasing population.

Reuse principle:
**purposeful local activity > raw NPC count**.

A resident looking for, carrying, repairing, trading, watching or avoiding something creates more life than ten idle actors.

---

## W3 · Critters as toy-world affordances

Sources:
`overworld/overworld/units-catalog.js`
and historical game runtime.

Historical status:
**IMPLEMENTED DONOR CONCEPT**

Critters were described as:
- living in the world, not the combat calculation;
- peaceful but not untouchable;
- irrelevant to zone progress;
- no conventional XP reward;
- player behavior creates reputation/social consequence instead.

Reuse principle:
Not every entity must be a quest target, combatant or loot container.

The player may invent the mode of play; the world responds.

---

## W4 · Interactive bubble as activity gateway

Historical Masterplan decision:
clicking an actor exposed:
`attack · ask · taunt · philo · trade · leave`.

This exact menu is historical, not current UI canon.

The durable principle is:
**conversation is one affordance among several social actions**.

Potential current activity verbs should be derived from actual Resident/World systems after Architecture Freeze, not copied from v10.

---

## W5 · Ambient chatter vs focused interaction

Historical decision:
- many short ambient remarks remain in-world/on-canvas;
- one focused interactive dialogue owns the foreground presentation.

This maps cleanly to modern performance/readability constraints.

Potential current rule:
**ambient life can be plural; focused conversation must be scarce and attributable.**

---

# 6 · ACTIVITIES + COMMENTARY AS ONE LOOP

A strong current design synthesis, still a PROPOSAL:

`Resident has activity → player perturbs activity → world/resident reacts → relationship/memory changes → Historian may frame only the meaningful delta`

Examples of activity classes already compatible with current Resident prep:
- work / repair / rebuild;
- trade / shop;
- gift / exchange;
- patrol / watch;
- search / collect;
- social encounter;
- Fluff share/spill;
- performance/music;
- POI observation.

The Historian should not narrate routine activity continuously.

Candidate narrator triggers:
- first meaningful encounter with a system;
- surprising consequence;
- repeated pattern worth a callback;
- failure/revival with changed social meaning;
- contradiction between intended heroism and observed result;
- transition/aftermath where unseen context matters.

---

# 7 · DEATH / REVIVAL · CURRENT SAFE PREP

Georg's current idea:
after repeated player deaths/revivals, graveyard ghosts/skeletons or the Historian may respond differently.

Historical repository precedent:
- graveyard tutorial;
- repeat-visit mini-story beats;
- narrator slot;
- character memory/callback grammar;
- old resurrection mechanics for mobs.

Important:
**old mob resurrection is not proof of the current player-revival architecture.**

Do not create a new current runtime event name before Architecture Freeze.

Authoring can still prepare a semantic escalation:

1. **first failure** — notice;
2. **repeat failure** — recognition;
3. **pattern established** — social interpretation;
4. **relationship exists** — Resident-specific callback;
5. **group witnesses** — select one primary response, possibly one interrupter, others perform/silence;
6. **Historian** — only if there is a higher-order contrast or context worth framing.

The joke is not “death count increased.”
The material is **what this repeated failure now means to these observers**.

---

# 8 · HISTORIAN ROLE CANDIDATE

Status:
**PROPOSAL FOR POST-COWORKER ARCHITECTURE FREEZE**

Role:
- chronicler / observer / contextual commentator;
- gets facts from World/Resident owners;
- may hold a distinct perspective;
- does not own truth;
- does not own quest/death/revival/relationship state;
- uses existing caption/narration presentation family;
- can be deterministic first;
- may later have a visible device/character manifestation;
- rare by default.

### Information hierarchy

Historian may say what:
- is not directly visible;
- connects current event to remembered context;
- frames a contradiction;
- supplies temporal/historical context;
- turns an aftermath into closure.

Historian should normally **not** say:
- what the player can see;
- controls/instructions;
- constant jokes;
- generic praise/blame;
- lore unrelated to the active beat.

### Voice candidate

Derived from old Overworld + current authoring rules:
- precise;
- dry;
- straight-faced;
- opinionated through selection and understatement;
- concrete before abstract;
- capable of silence;
- does not perform “AI personality”.

Whether the final embodiment is “Historian”, date-computer, FrizzleBob mask or another KFB character remains an explicit design decision, not assumed here.

---

# 9 · SOURCE CLASSIFICATION

| Source / idea | Classification now | Reuse |
|---|---|---|
| `narrator-2d.js` Afterglow | HISTORICAL IMPLEMENTED DONOR | deterministic factual narration + player framing |
| `zone-story.js` narrator slot | HISTORICAL IMPLEMENTED DONOR | event→short authored beat separation |
| Masterplan “Erzähler als Figur” | HISTORICAL OPEN CONCEPT | Historian/device/companion design donor |
| “Welt als Spielzeug” North Star | HISTORICAL EXPLICIT DIRECTION / DONOR | living reactive world principle |
| `mob-ai.js` | HISTORICAL IMPLEMENTED DONOR | purposeful actor life / local state |
| critters outside combat progression | HISTORICAL IMPLEMENTED DONOR | emergent player-defined play |
| NIE Writer's Room | AUTHORING DONOR | generation + conflict + selection |
| NIE dialogue grammar | AUTHORING DONOR | turn-taking, subtext, power, silence |
| KayfabeTips | CURRENT PUBLIC AUTHORING HEURISTIC | compact quality lens |
| Cartoon Studio Ship Computer | LATER CROSS-PROJECT DONOR | narrator as persistent reacting social presence |
| current Open World event API | **UNKNOWN UNTIL COWORKER INTAKE** | Architecture Freeze only |

---

# 10 · Recommended Work/WSA use

After exact Coworker Return is imported:

1. inventory the actual current World/Resident event/state seams;
2. locate any surviving current narration/Afterglow consumer;
3. compare against H1–H4 without copying old architecture blindly;
4. choose the **smallest** representative narrator seam;
5. use deterministic authored content first;
6. reuse ChatterBox/presentation carriers;
7. prove one world activity + one Resident reaction + one Historian closure;
8. only then consider generative/NIE-at-runtime behavior if a real product need remains.

No second dialogue engine.
No second Resident state owner.
No narrator-owned gameplay truth.
