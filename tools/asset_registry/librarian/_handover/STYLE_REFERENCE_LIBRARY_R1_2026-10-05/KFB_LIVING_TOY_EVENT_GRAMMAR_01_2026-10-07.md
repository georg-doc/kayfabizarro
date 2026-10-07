# KFB Living-Toy Event Grammar · 01

Status: **RESEARCH / ARCHITECTURE PREP · NO RUNTIME EVENT NAMES CLAIMED**
Date: 2026-10-07
Owner: KFB Style Reference / narrative research
Receiving consumers later: KFB Open World / Resident Life / ChatterBox / Resident Performance / Historian

## Purpose

Turn the recovered Overworld idea **"the world should speak, breathe and react"** into a compact event-authoring grammar that can be mapped onto the real post-Coworker architecture.

This file defines **scenario families and presentation arbitration**, not runtime APIs.

## 1 · Living-toy principle

A living toy world is not a backdrop full of idle actors.

It should make these things readable:
- Residents are doing something before the player arrives;
- world objects/POIs suggest affordances;
- the player can perturb ongoing activity;
- the world reacts visibly;
- social/world consequences may matter without awarding XP or quest progress;
- actors recover, resume, replan or join after an interruption;
- not every meaningful event needs text;
- not every actor is a combat target, quest giver or loot container.

Historical Overworld donor principle:
**immersion and Points of Interest outrank combat depth.**

## 2 · Truth / expression split

Truth belongs to existing owners.

Candidate flow:
`world fact / activity / encounter → Resident reaction/performance → optional ChatterBox line → rare Historian framing`

Never invert this flow.

The Historian does not cause the event.
A bubble does not cause Affect.
An Emanatum does not cause relationship state.

## 3 · Foreground carrier arbitration

For each meaningful event ask in order:

1. **Can world behavior alone communicate it?**
2. **Can a Resident reaction communicate it?**
3. **Does one Resident need a line?**
4. **Does the Historian add unseen context, memory or closure?**
5. **Would silence be stronger?**

Default:
- one foreground text carrier at a time;
- nearby Resident beats usually outrank Historian commentary;
- group events select one primary speaker;
- other witnesses use pose/gaze/gesture/Emanata/silence;
- Historian is sparse.

## 4 · Scenario family A · Arrival / POI discovery

Examples:
- first arrival in a district;
- first view of a landmark;
- entering a socially meaningful place;
- discovering a POI with hidden history.

World can carry:
- landmark silhouette;
- activity already underway;
- signage / in-world typography;
- local ambient life.

Resident can carry:
- greeting;
- suspicion;
- local routine;
- pointing/looking.

Historian eligible when:
- the place has relevant unseen history;
- the present scene contradicts its historical reputation;
- the player has returned after a meaningful prior event.

Historian normally silent when:
- the landmark already communicates the whole idea.

## 5 · Scenario family B · Card / Billboard / semantic reveal

Examples:
- Card discovered;
- billboard changed;
- deck/world semantic object becomes newly relevant.

Preferred order:
`world reveal → Resident inspect/react → optional short Card-anchored line → rare Historian context`

Historian may frame:
- historical relation;
- prior callback;
- contrast between public message and observed world consequence.

Do not:
- quote-feed lore at the player;
- turn the Historian into a Card encyclopedia.

## 6 · Scenario family C · Gift / Trade / Fluff exchange

Examples:
- gift offered/received;
- trade accepted/declined;
- Fluff shared;
- resource exchange with social meaning.

Primary carriers:
- gesture/handoff;
- proximity;
- facial response;
- short Resident line or silence.

Historian default:
**silent**.

Historian becomes eligible only when:
- the exchange changes a relationship or social pattern;
- a later callback reframes the earlier exchange;
- the item/resource has broader historical significance.

## 7 · Scenario family D · Activity interruption

Examples:
- player interrupts work;
- Resident interrupts another Resident;
- social encounter collides with routine;
- urgent world event interrupts leisure.

Core question:
**What was this actor trying to do before the interruption?**

Reaction depends on:
- activity urgency;
- relationship;
- status/power;
- interruption style;
- prior memory.

Historian usually silent.

Use interruption as characterization, not as generic chatter trigger.

## 8 · Scenario family E · Work / Repair / Rebuild completed

Examples:
- repair finished;
- building section restored;
- shared work completed;
- a Resident successfully finishes a visible task.

World should show consequence first.

Resident may show:
- relief;
- pride;
- fatigue;
- celebration;
- inspection.

Historian eligible when:
- the repair closes an earlier loss;
- it changes a remembered place;
- it produces ironic contrast with an earlier failure.

## 9 · Scenario family F · Damage / Collapse / world consequence

Examples:
- building collapse observed;
- damaged object/area;
- environmental consequence;
- aftermath of combat/event.

Priority:
world consequence + safety first.

Resident reaction may include:
- recoil/flee;
- inspect;
- help;
- blame;
- silence.

Historian eligible in aftermath, not during immediate safety response.

Good Historian function:
- connect this damage to prior history or consequence.

Bad function:
- describe the collapse while it is visibly happening.

## 10 · Scenario family G · Resident disagreement / social friction

Examples:
- disagreement;
- rivalry;
- failed negotiation;
- accusation/denial;
- conflicting interpretation of a world event.

Primary owner:
Residents / ChatterBox.

Use:
- adjacency pairs;
- SAID / MEANT / WANTED;
- interruption;
- silence;
- relationship power.

Historian should almost always stay silent during the live exchange.

Historian may appear later for retrospective irony/closure only.

## 11 · Scenario family H · Performance / Music / celebration

Examples:
- band performance;
- public ritual;
- celebration;
- applause/praise;
- Resident entertainment activity.

World/Resident performance carries the event.

Audience reactions should be sparse and varied:
- watch;
- join;
- applaud;
- leave;
- mock;
- ignore.

Historian only if the event acquires larger meaning or callback value.

## 12 · Scenario family I · Mob / Critter autonomous behavior

Examples:
- patrol;
- search for resources;
- animal/creature crosses path;
- neutral creature reacts to player;
- Mob pursues its own local purpose.

Living-toy rule:
**the actor exists for its own activity first, not only for the player's objective.**

Possible player relationship:
- observe;
- help;
- interrupt;
- follow;
- scare;
- attack;
- ignore.

Consequences may be social/reputational rather than quest/XP.

Historian eligible only when the player's behavior creates a meaningful pattern or world consequence.

## 13 · Scenario family J · Player failure / death / revival

Do not equate this family with joke generation.

Preferred escalation:
1. first failure → visible consequence / Resident reaction / silence;
2. repeat → recognition;
3. pattern → changed social estimate;
4. relationship-aware callback;
5. only then, if useful, Historian closure.

Graveyard / ghost / skeleton witnesses are especially strong because the location and event are causally linked.

Historian job:
- frame repetition;
- connect the present failure to earlier behavior;
- expose ironic difference between intended heroism and observed pattern.

Historian must not:
- become a death counter;
- comment on every failure;
- own resurrection logic.

## 14 · Scenario family K · Repeat visit / memory callback

Examples:
- player returns to place;
- Resident recalls prior help/conflict;
- earlier boast gains new meaning;
- changed POI is revisited.

Strong callback test:
**Does the old beat mean something different now?**

If no, memory display is probably decorative.

Historian can be strong here because chronicle/memory is its natural role.

## 15 · Scenario family L · Rare anomaly / UFO / metaphysical event

Examples:
- UFO event;
- impossible world transformation;
- surreal/metaphysical anomaly;
- major world contradiction.

Priority:
- world event truth first;
- Resident reaction second;
- Historian last.

Historian may supply:
- historical parallel;
- context unavailable to Residents;
- dry framing after the event;
- rare meta-closure.

Do not let narration domesticate the anomaly by over-explaining it.

## 16 · Scenario family M · Transition / Afterglow

Examples:
- leaving a major area;
- finishing a meaningful event chain;
- returning to Town after consequences;
- retrospective chapter/episode close.

This is the Historian's strongest natural habitat.

Possible inputs:
- authored facts;
- Resident memories;
- Card/deck refs;
- player-selected framing if supported;
- world consequences.

Historical Afterglow donor suggests:
**player framing may influence the chronicle without changing world truth.**

## 17 · Text scarcity budget

Recommended qualitative budget:
- Ambient: mostly no text / short world-space chatter;
- Focused Resident encounter: one foreground dialogue owner;
- Major consequence: one short reaction, then recovery;
- Historian: rare, after meaning exists.

Rule:
**Do not stack Ambient + Resident + Historian text because all three are available.**

## 18 · Group witness grammar

When multiple actors witness an event:

Choose:
- primary respondent;
- optional supporter/opponent;
- silent observer(s);
- optional interrupter.

Selection factors:
- relationship;
- proximity;
- status;
- current activity;
- information;
- temperament;
- stake.

Default failure mode to avoid:
**everyone speaks.**

## 19 · Recovery

Every visible reaction must end in a meaningful next state owned elsewhere:
- resume activity;
- replan activity;
- enter encounter;
- join activity;
- leave area;
- seek help;
- start repair;
- inspect target.

Presentation does not choose the durable outcome.

## 20 · Architecture Freeze mapping

For each scenario family, Work/WSA later maps:
- actual runtime source event/state;
- truth owner;
- Resident Life/Affect consumer;
- PerformanceCue path;
- ChatterBox eligibility;
- Historian eligibility;
- durable memory write point;
- cooldown/arbitration;
- recovery outcome.

Until then:
scenario families are design grammar only.

## Boundary

No Open World runtime write.
No new event bus.
No second dialogue engine.
No narrator state owner.
No event IDs claimed as current API.
No merge / Live promotion.

## Next gate

**Post-Coworker Architecture Freeze maps these scenario families onto the actual returned runtime seams.**
