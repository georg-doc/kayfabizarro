# KFB Fractal Rolling Slices — WS1 Intake
## 10 August 2026

This slice set is intentionally non-linear. It records connected ideas and status without turning them into a single implementation sequence.

### Main additions
1. Sidescroller assets as deliberate perspective failure.
2. Physics/environment as a carrier of meta-narrative closure.
3. Wiseguy as recurring marketplace institution.
4. Font as semantic voice layer with one meaning per font.
5. Speech/presentation budget as shared attention resource.
6. 3D Ball remains deferred; M-View/Cube Cosmos remains a separate open meta-layer.
7. ChatterBox and Overworld share a cross-modal closure rule.
8. QA heuristic: could the world perform half the line?
9. Status vocabulary preserved.
10. Fractal development does not imply linear implementation.

### Core principle
> Let the world perform the punchline whenever possible.

### Source
WS1 handoff V10-S23, 10 August 2026, plus Georg's ongoing riffing.

---

# A1 — Terminology Contract v0.1
**STATUS: CANONICAL CONCEPT / WS1-READY — 10 Aug 2026**

Purpose: prevent terminology drift between WS0, WS1, NIE, ChatterBox and Journey Brain.

Core terms:
- Kayfabe = KFB's world/reality frame.
- Power = semantic/card-level claim; not automatically numerical game power.
- Effective Power = invisible/internal calculation where needed; distinct from visible semantic Power.
- Closure = player's contribution to meaning.
- Journey Evidence = compressed meaningful evidence, not raw interaction logging.
- NIE = semantic upstream.
- Mask = performance layer.
- ChatterBox = presentation/performance layer.
- Historian = in-world guide/commentator/memory interface.

Status vocabulary:
`BUILT · PARTIAL · OPEN · HOOK · DEFERRED · REJECTED · NEEDS_SOURCE`

Boundary: a useful term in the Living Concept does not automatically become an implementation contract.

---

# A2 — Wiseguy Pool v0.1
**STATUS: CONTENT SLICE / WS1-READY — 10 Aug 2026**

Core rule:
> **The Wiseguy is not a joke machine.**

Target grammar:
`fragment → turn → gap → player closure`

not:
`setup → joke → punchline`

Wiseguy remains a normal Mob with a special personality/performance mask. The existing ChatterBox renderer remains the presentation layer. The established gameplay boundary is:

`3 unsuccessful attacks OR ~8 seconds → Puff`

with one possible corner hit.

The existing KFB insult material remains the source for insult-combat/faction-banter material; A2 must not create a duplicate global insult repository.

---

# A3 — Title Catalogue K1
**STATUS: PROPOSED CONTENT SLICE / WS1-READY — 10 Aug 2026**

Purpose: establish a first player-title catalogue as a cosmetic/social identity layer, without creating a new progression or power system.

Contract:
- 24–36 target titles; first pass = 30.
- Sources: **Achievement / Loot / Pool**, explicitly separated.
- Six angles: **Kayfabe Rank / Jobbing / Heel Turn / Gimmick / Shoot / Statistician's Revenge**.
- English-first title convention; German KFB proper names remain valid.
- `Newbie` remains the default; no title remains valid.
- Titles do not imply gameplay Power.
- UI reserves title space beside avatar identity.

## Catalogue

| Angle | Title | Source |
|---|---|---|
| Kayfabe Rank | Kayfabe Rookie | Pool |
| Kayfabe Rank | Certified Kayfabe | Achievement |
| Kayfabe Rank | Midcard Metaphysician | Pool |
| Kayfabe Rank | Main Event Witness | Achievement |
| Kayfabe Rank | World Champion of Nothing | Loot |
| Jobbing | Professional Jobber | Pool |
| Jobbing | Permanent Undercard | Achievement |
| Jobbing | Pin Cushion | Loot |
| Jobbing | Enhancement Talent | Pool |
| Jobbing | Nearly Main Event | Achievement |
| Heel Turn | Heel in Training | Pool |
| Heel Turn | Betrayal Specialist | Achievement |
| Heel Turn | Public Enemy of Fun | Loot |
| Heel Turn | Morally Flexible | Pool |
| Heel Turn | Turned for the Loot | Achievement |
| Gimmick | Leichenfledderer | Loot |
| Gimmick | Goblin Whisperer | Achievement |
| Gimmick | Graveyard Consultant | Pool |
| Gimmick | Cardboard Occultist | Loot |
| Gimmick | Licensed Reality Distorter | Achievement |
| Shoot | No-Kayfabe Survivor | Achievement |
| Shoot | Shoot Merchant | Pool |
| Shoot | Out-of-Character Witness | Loot |
| Shoot | Unscripted Liability | Achievement |
| Shoot | Kayfabe Escapee | Pool |
| Statistician's Revenge | Statistically Significant | Achievement |
| Statistician's Revenge | Sample Size One | Pool |
| Statistician's Revenge | Margin of Error | Loot |
| Statistician's Revenge | Confidence Interval | Pool |
| Statistician's Revenge | Standard Deviation | Achievement |

### Tutorial title

`Leichenfledderer` is the current preferred candidate over `Grave Robber / Corpse-Picker`, but remains **OPEN pending final confirmation**.

### Boundaries

No title stats, rarity-power calculation, title-specific dialogue engine, or title-specific LLM system. Titles are metadata that may later become ChatterBox context.

### Acceptance

A title must read immediately as a social identity label, fit KFB Kayfabe, work beside a player name, avoid explanatory setup, avoid numerical Power implications, carry a clear source classification, and survive contextual reuse.

### Cross-system path

`Achievement / Loot / Pool → Title → Player Identity → ChatterBox / NPC reaction / Card or Quest presentation`

---

## A-Slice Persistence Rule

Each A-slice is considered persisted only when it exists in:

`Living Concept → WS1 Living Slice Doc → validation/status`

Riffing may remain OPEN. Persistence does not imply implementation commitment.

# A4 — Timing Lab Prüfzeilen v0.1
**STATUS: PROPOSED QA CONTENT SLICE / WS1-READY — 10 Aug 2026**

A4 turns ChatterBox §12.1 into an actual ten-case content fixture set for browser validation.

1. `Blödsinn...` — short reaction / minimum dwell.
2. `Card says freedom. Goblin says: convenient.` — normal line / baseline.
3. `Freedom is a door. Conveniently, the Goblin has lost the key.` — longer line / visual dominance.
4. `Freedom becomes strange when nobody agrees what counts as a cage.` — philosophy / semantic density.
5. `You missed me. This is becoming a method.` — joke setup / anticipation.
6. `Good. I was worried you might learn.` — punchline / landing.
7. `Goblin: Show it. / Knight: The card? / Goblin: The mistake.` — sequential exchange.
8. `Methinks, our little hero has discovered the obvious.` — TTS baseline.
9. `Verily. Click the thing. The world is waiting.` — fast TTS.
10. `Oh, that reminds me... Waterloo.` — slow TTS.

The lab must test human readability, Unit visibility, dwell, punchline landing, response timing and
TTS synchronization. The provisional §12.2 values remain hypotheses until measured.

**Boundary:** A4 supplies QA content only. It does not lock timing constants or create a subtitle engine.

### Persistence

`Riff → Slice → Living Concept → WS1 Living Slice Doc → validation/status`

# A5 — Fraktions-Schmährufe K2 v0.1
**STATUS: PROPOSED CONTENT SLICE / WS1-READY — 10 Aug 2026**

A5 supplies a compact faction-taunt fixture set for ChatterBox. The target is not a second dialogue engine: each line is short, performable material whose voice comes from the faction. The six canonical factions are the current Overworld set: `kingCourt · townsfolk · camp · wilds · cave · audience`.

## Contract

- Target form: `{who}` with and without `{title}`.
- Two escalation levels: **K1 / K2**.
- K1 = dismissive/social jab; K2 = sharper public humiliation, without becoming a generic insult generator.
- English-first, consistent with ChatterBox content convention.
- Short enough for one speech bubble; target ~40 characters, 60 maximum except deliberate edge cases.
- No numerical Power, no new reputation rules, no LLM dependency.
- Titles are contextual identity material only; the taunt must still work when no title is present.

### Target notation

`{who}` = player name.

`{who}, the {title}` = player name plus currently equipped cosmetic/social title.

The title is used as a social framing device, not as a gameplay modifier.

## K2 fixture set

| Faction | Target | K1 | K2 |
|---|---|---|---|
| **kingCourt** | `{who}` | `{who}. Please stand somewhere useful.` | `{who}. Even the paperwork has lost faith.` |
| **kingCourt** | `{who}, the {title}` | `{who}, the {title}. Noted.` | `{who}, the {title}. A remarkable administrative failure.` |
| **townsfolk** | `{who}` | `Look who found the market again.` | `{who}, you break things like it's a trade.` |
| **townsfolk** | `{who}, the {title}` | `The {title} is back. Hide the crockery.` | `{who}, the {title}. Still no improvement.` |
| **camp** | `{who}` | `Hey {who}. Big hero. Tiny brain.` | `{who}! Even the goblins saw that coming.` |
| **camp** | `{who}, the {title}` | `Ooooh. The {title} has arrived.` | `{who}, the {title}. We expected less.` |
| **wilds** | `{who}` | `{who}. The forest remembers.` | `{who}. Even the crows are judging you.` |
| **wilds** | `{who}, the {title}` | `The {title} walks loudly.` | `{who}, the {title}. The wilds reject the claim.` |
| **cave** | `{who}` | `{who}. Too loud.` | `{who}. The echo already disagrees.` |
| **cave** | `{who}, the {title}` | `The {title}. The cave has heard worse.` | `{who}, the {title}. Even the echo left.` |
| **audience** | `{who}` | `{who}. Kayfabe needs work.` | `{who}. That was not the angle.` |
| **audience** | `{who}, the {title}` | `{who}, the {title}. Strong entrance.` | `{who}, the {title}. Weak continuity.` |

### Correction / canonical line

The wilds K1 no-title line is canonicalized as:

> `{who}. The forest remembers.`

The table above intentionally keeps the taunts as short performance units. No explanatory punchline is appended.

## Voice test

The factions should be distinguishable even if the player removes the name and title mentally:

- **kingCourt:** procedural politeness, institutional contempt, speaks as if recording an incident.
- **townsfolk:** social gossip, practical annoyance, property/community consequences.
- **camp:** goblin directness, childish aggression, status mockery.
- **wilds:** environmental personification, sparse threat, nature as witness.
- **cave:** compressed language, echo/silence, subterranean indifference.
- **audience:** kayfabe literacy, framing, performance judgment rather than physical hostility.

The audience is therefore not merely another biome voice: it comments on the *quality of the fiction being performed*.

## Escalation rule

`K1 → social inconvenience / dismissal`

`K2 → identity attack / public kayfabe failure`

K2 should not simply add profanity or adjectives. The escalation should change the **social meaning** of the line.

## Missing / candidate factions

The older ChatterBox draft contained `shore · frost · dungeon` in addition to the current set. fileciteturn77file4L212-L219

### 1. shore — RECOMMENDED FUTURE VOICE

**Reason:** Shore has a genuinely different social register from `wilds`: maritime trade, tide, wreckage, boats, sailors, ports and offshore travel. It can therefore sustain a distinct vocabulary and cadence rather than being merely another biome.

**Own voice:** practical nautical fatalism; transactional; weather/tide metaphors used as ordinary speech rather than poetic decoration.

### 2. frost — RECOMMENDED FUTURE VOICE

**Reason:** Frost can sustain a distinct survival register: clipped speech, endurance, cold, visibility and scarcity. It is meaningfully different from both `wilds` and `cave` if the zone actually exists as a recurring social/environmental identity.

**Own voice:** terse, dry, endurance-oriented; fewer words because warmth and time are treated as scarce resources.

### 3. dungeon — DO NOT ADD AS A SEPARATE FACTION YET

`dungeon` is currently better treated as a presentation/zone variant of `cave`. Both naturally support compressed, enclosed, echoing language and both already occupy the underground semantic space. Giving dungeon its own faction now would mostly duplicate the voice rather than add a new social perspective.

### Decision

**Recommended future additions: `shore`, `frost`.**

`dungeon` remains a zone/style variant unless a later slice demonstrates a genuinely different social institution or recurring NPC population that requires its own voice.

## Boundaries

A5 does **not** create:

- a new faction system;
- reputation logic;
- a second insult engine;
- title-dependent gameplay;
- LLM-generated insults;
- a new emote language.

It is a content fixture set for existing ChatterBox presentation. The existing ChatterBox principle remains: faction + Anlass + source + state select a short expression, with the static pool as fallback. fileciteturn77file6L297-L301

## Acceptance

A5 passes when:

1. the faction can be recognized from the line without a label;
2. `{who}` works naturally without a title;
3. `{who}, the {title}` does not sound mechanically bolted on;
4. K2 escalates social meaning rather than merely adding volume;
5. lines remain one-bubble material;
6. no faction sounds like generic "video game NPC" banter;
7. `shore` and `frost` remain optional until they earn a distinct voice through a later slice.

### Persistence

`Riff → Slice → Living Concept → WS1 Living Slice Doc → validation/status`

Persistence does not imply implementation commitment.

## A5.1 · Pottymouth / Aggro / Boss Command Extension

This is an additive extension to the A5 faction-taunt slice. It is **not** a new dialogue system.

### 1. Escalation inside a situation

Faction taunts can escalate during an ongoing argument, conversation or conflict into **Pottymouth**.

- Pottymouth is a higher-intensity register, not a permanently active voice.
- User rule: **1 glyph, maximum 3**.
- Escalation is contextual: the longer/hotter the exchange, the more plausible the register becomes.
- The existing K1 → K2 distinction remains; Pottymouth is a further performance register, not a replacement for K2.

### 2. Aggro / attack language

When an aggro pull or attack begins, **some mobs, but not all**, may emit Pottymouth curses while attacking.

This should remain sparse and character/fraktion dependent. It is a behavioral accent on the attack, not a universal attack callout.

### 3. Boss command

A Boss unit may initiate an attack by issuing a factional Schmähruf / command before or with the attack.

Canonical example context: **the player enters a Card Zone → Boss notices → Boss issues Schmähruf → subordinate mobs attack.**

The Boss therefore turns the taunt from commentary into an **action trigger / social command**. The exact wording and timing remain content-level decisions.

### Architectural constraint

All three behaviors remain within the existing ChatterBox / speech-bubble / emote pipeline. No separate Pottymouth engine and no separate Boss-dialogue engine.


# A5.2 — Fraktions-Schmährufe K2 · Content Fixture Revision
**STATUS: PROPOSED CONTENT SLICE / WS1-READY — 10 Aug 2026**

A5 is now backed by an explicit fixture set rather than only a contract. It remains content for the existing ChatterBox pipeline, not a new insult or dialogue system.

## Contract
- Six current factions: `kingCourt · townsfolk · camp · wilds · cave · audience`.
- Targets: `{who}` and `{who}, the {title}`.
- K1 = social jab / dismissal.
- K2 = sharper social or kayfabe attack.
- K2 changes social meaning, not merely volume or profanity.
- One-bubble material; compact by default.
- English-first.
- Existing `Elender Wicht` material remains a semantic source rather than a second insult repository.

## Fixture set v0.2

| Faction | Target | K1 | K2 |
|---|---|---|---|
| `kingCourt` | `{who}` | `{who}. Still awaiting competence.` | `{who}. Even procedure has noticed the failure.` |
| `kingCourt` | `{who}, the {title}` | `The {title}. Duly observed.` | `{who}, the {title}. A triumph of ceremony over result.` |
| `townsfolk` | `{who}` | `Look who brought consequences.` | `{who}. The market has discussed you.` |
| `townsfolk` | `{who}, the {title}` | `The {title} is back. Keep count.` | `{who}, the {title}. We remember the last visit.` |
| `camp` | `{who}` | `Big entrance. Small legend.` | `{who}. Even the goblins stopped betting.` |
| `camp` | `{who}, the {title}` | `Ooh. The {title}. Fancy.` | `{who}, the {title}. We expected a bigger problem.` |
| `wilds` | `{who}` | `{who}. The trees noticed.` | `{who}. The forest declines your version.` |
| `wilds` | `{who}, the {title}` | `The {title} walks loudly.` | `{who}, the {title}. The wilds reject the claim.` |
| `cave` | `{who}` | `{who}. Echo says no.` | `{who}. Even the echo wants distance.` |
| `cave` | `{who}, the {title}` | `The {title}. The cave has heard worse.` | `{who}, the {title}. Your echo has resigned.` |
| `audience` | `{who}` | `{who}. Strong claim. Weak continuity.` | `{who}. That was not the angle.` |
| `audience` | `{who}, the {title}` | `{who}, the {title}. Strong entrance.` | `{who}, the {title}. The kayfabe cannot carry this.` |

## Voice test
- `kingCourt`: procedural politeness, institutional contempt.
- `townsfolk`: gossip, social memory, practical consequences.
- `camp`: blunt status play, childish aggression, goblin directness.
- `wilds`: sparse witness language, nature as observer.
- `cave`: compressed, echoing, indifferent.
- `audience`: kayfabe literacy and performance judgment.

## KFB grammar note
The fixture set intentionally avoids explanatory setup → punchline construction. The faction supplies a worldview, the line creates a semantic mismatch or status shift, and the player supplies the final closure. This makes A5 compatible with the semantic-triplet / reader-closure ChatterBox model.

## Future voices
`shore` and `frost` remain recommended future factions because they can earn distinct social registers. `dungeon` remains a `cave` zone/presentation variant unless a distinct recurring institution emerges.

## Acceptance
A5 passes when faction voice survives without a label, title variants remain natural, K2 changes social meaning, and every line works as a single speech bubble without explanatory tail.

Persistence: `Riff → A5 → Living Concept → WS1 Living Slice Doc → validation/status`.

---

# A6 — Closure Operators / Anti-Closure
**STATUS: PROPOSED SEMANTIC GAMEPLAY SLICE / WS1-READY — 10 Aug 2026**

## Purpose

Turn reader closure into a compact player-facing relation layer between two cards. The player chooses a semantic hinge rather than writing a full bridge text.

## Six operators v0.2 — sentence/story-beat grammar

**Correction:** the player-facing operators are sentence/story connectors, not abstract semantic concepts. `REVEAL` is therefore removed from the player-facing set.

| Operator | Story use | Backend tag | FrizzleBob help |
|---|---|---|---|
| **BECAUSE** | “A happened because B.” | CAUSE | “One thing explains the other. Allegedly.” |
| **BUT** | “A happened, but B.” | CONTRAST | “Ah. There is the problem.” |
| **SO** | “A happened, so B.” | CONSEQUENCE | “And thus, regrettably, we continue.” |
| **THEN** | “A happened, then B.” | PROGRESSION | “A development. Of some kind.” |
| **MEANWHILE** | “A happened. Meanwhile, B.” | PARALLEL | “Elsewhere, reality makes its own arrangements.” |
| **AGAIN** | “A happened. Then B happened again.” | ECHO / RECURRENCE | “Apparently we learned nothing.” |

The player sees the natural story language. The backend may retain the abstract tags for Journey analysis.

The same operator may be used repeatedly. Repetition is legal and can itself become meaningful evidence about the player's storytelling preference.

## Anti-Closure: AND THEN

`AND THEN` is always available as a deliberately weak relation. It advances the story without asserting why the cards belong together. It is not an error and never blocks progress.

For a five-card story with four links, **three or more AND THEN selections** may trigger an in-world quality reaction:

`three AND THEN → audience BOO → King −1 Quest Die`

This is Kayfabe consequence, not hard failure. The player is allowed to tell a flat story; the world reacts to the flatness.

Repeated meaningful operators are not automatically penalized. The target is emergent closure, not mechanical variety.

## Player-model signal

Store only the relation event, not the transcript:

```json
{
  "event": "closure",
  "fromCard": "CARD_ID_A",
  "operator": "BUT",
  "toCard": "CARD_ID_B",
  "context": "quest_story",
  "sequence": 3
}
```

This can later feed hypotheses about causal, contradictory, consequential, sequential, parallel, recurrent, or low-closure preferences. Hypotheses remain uncertain and revisable.

## Core grammar

`Card → Relation → Card → Reader/World Closure`

The fourth beat may be supplied by the player, audience, King reaction, animation, sound, card reveal, Quest result, or another world response. This keeps A6 aligned with the existing cross-modal closure model.

## Acceptance

A6 passes when the six relations are understandable, repeatable, compact, and meaningful; AND THEN remains a legitimate anti-closure choice; three AND THEN links can produce booing and −1 without gating; and each choice can be stored as one small Journey event.

**Persistence chain:** `Riff → A6 → Living Concept → WS1 Living Slice Doc → validation/status`.
