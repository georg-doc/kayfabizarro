# KFB Overworld --- Living Concept Document

**Status:** Working session / additive SSOT\
**Rule:** New decisions are appended. Existing decisions are not
silently rewritten.\
**Status labels:** DECIDED / WORKING MODEL / OPEN / REJECTED

------------------------------------------------------------------------

## 1. Core Overworld Purpose

### DECIDED

The KFB Overworld is not merely an RPG map. It is the spatial runtime
environment for the KFB card/comic system.

The central loop connects:

**Deck → Cards → World → Exploration/Combat → Cards → Almanac → Story →
Push/Progression → next Deck/World**

The world is therefore a physical projection of card data, while
gameplay in the world produces persistent story material.

------------------------------------------------------------------------

## 2. Visual / Terrain Direction

### DECIDED

Do not continue the previous procedural terrain-generator approach.

The terrain basis is the existing **KFB Texture Lab**, which already
contains the texture catalogue from the GitHub repositories and existing
Ground-Type assignments.

Use six selected Ground Types / textures.

Required terrain stack:

**existing texture → seamless/tileable where necessary → terrain mapping
→ inexpensive Ink treatment → lightweight living-terrain shader**

No new blob/Noise/morphology terrain system.

### Visual target

-   Pixel Art remains the established unit/object language.
-   Background/terrain should have analog charm.
-   Psychedelic retro-cartoon influence: 1960s/70s, Nickelodeon-like
    abstraction, Art-Lozzi-like painted background feeling, Pink
    Panther-like graphic/cartoon sensibility.
-   Terrain should subtly live/breathe.
-   Shader should not simulate dry brush or complicated painterly
    materials.
-   Shader may add a subtle sponge-like pattern and slow organic
    wavering/warping.
-   Ink treatment should be inexpensive but organically curved, slightly
    eccentric, colorful/light and cartoon-like.

### DECIDED

The six Ground Types are part of the MVP. They are not a later scaling
step from one prototype.

------------------------------------------------------------------------

## 3. World Geometry

### DECIDED / WORKING MODEL

The world is initially flat and two-dimensional.

A central starting zone contains:

-   Graveyard / respawn point
-   King's Castle
-   Marketplace
-   Tavern
-   Church
-   other Tiny World / Tiny Swords assets

Six roads extend outward from the central zone toward six faction/biome
regions.

The roads are structurally radial but should not look like six
mechanically straight spokes. Terrain should create an organic, natural
overall map silhouette.

The complete map may have an approximate non-rectangular/fractal
outline. The minimap should reproduce the overall world shape rather
than simply displaying a rectangular map.

### Future extension

The 2D surface can later contain underground/other-level transitions.
Falling or digging through the ground could lead to another
map/deck/world layer.

------------------------------------------------------------------------

## 4. Six Biomes / Factions

### DECIDED / WORKING MODEL

There are six surrounding faction/biome regions.

Examples already established include:

-   Goblin region / mine
-   Water-creature region / boats / fishing

The remaining four are based on the existing world/faction concept and
available Tiny Swords assets.

Each region has appropriate resources and faction activity.

Resources include, among others:

-   Gold
-   Ore
-   Wood
-   Water

The six biomes should use the six selected Ground Types rather than
requiring six independent terrain-rendering systems.

------------------------------------------------------------------------

## 5. Living World / Tiny Swords

### DECIDED

The available Tiny Swords assets from the three repositories should be
used throughout the world wherever practical.

The MVP world is also a test environment for:

-   units
-   buildings
-   objects
-   animations
-   faction representation
-   resource activities
-   interactions
-   combat

Fraktions/units should not merely stand around. They can perform simple
activities such as:

-   fishing
-   mining gold/ore
-   chopping wood
-   transporting/using resources
-   other small faction-specific routines

The player can encounter and interrupt these activities, potentially
triggering combat or other micro-events.

------------------------------------------------------------------------

## 6. Card / Comic World Structure

### DECIDED

A world/deck consists of:

-   Cover
-   14 comic pages
-   2 × 2 cards per content page
-   56 cards total
-   a separate rules/tutorial area

The Anti-Rules deck is the intended starter deck and doubles as tutorial
/ onboarding content.

The visual/tutorial logic is intentionally fractal, surreal and
cartoon-like.

The existing PDF/Card Viewer proof of concept is part of the system.

Cards can appear as actual readable/interactive surfaces in the world.

------------------------------------------------------------------------

## 7. Card Viewer / Terrain Integration

### DECIDED

The existing Card/PDF Viewer can be embedded directly into the
terrain/world.

Cards are primarily readable within the 2×2 crop grid.

The viewer supports slight zoom-out when content would otherwise be
cropped.

It also supports **Zoom on Point**, centered around the character's
position.

The player character can therefore interact with the viewer/UI from
inside the world.

The existing Ink Outline is a continuous tapered/irregular boundary
defining the card surface.

------------------------------------------------------------------------

## 8. Rubber-Band Ink / Endless Scroll

### DECIDED

The existing rubber-band Ink Outline is a gameplay mechanic, not merely
visual decoration.

When the player moves against the card boundary:

-   the character is pushed/bounced back;
-   the existing bounce can be used for an endless-scroll presentation;
-   the player can continue moving horizontally against the boundary
    without leaving the card surface.

This can create surreal immersive comic-reading situations in which the
player is physically inside the comic.

------------------------------------------------------------------------

## 9. Card Zones

### DECIDED / WORKING MODEL

The six surrounding regions contain Card Zones.

Each Card Zone corresponds to a playable card/comic situation.

The player enters a zone, fights through its encounters, clears it and
obtains the associated Scene Card.

The current combat concept is three waves:

1.  first enemy wave
2.  second enemy wave
3.  Boss as third wave

Enemy dialogue can be generated from quotations/content of the source
card via prior LLM generation and then played in-game as short comic
speech fragments.

The intended effect is that the card appears to develop an absurd form
of self-description / Eigenleben through its emergent inhabitants.

------------------------------------------------------------------------

## 10. Arena / Card Reveal

### DECIDED / WORKING MODEL

A Card Zone can initially present the card surface as an arena.

Arena dust partially obscures the card.

During combat, movement and effects can clear/wipe away the dust so that
the underlying comic/card becomes progressively visible.

Combat FX can include:

-   blood splatter
-   leaves
-   dust
-   particles
-   AoE effects
-   unit-specific combat animation
-   other cartoon/splatter effects

Bloodlust is an example of a state that can leave visible traces on the
revealed card/arena floor.

The intended visual progression is:

**card → arena dust → combat → dust cleared → card revealed → persistent
combat traces/FX**

------------------------------------------------------------------------

## 11. Story / Quest Loop

### DECIDED

The King offers a Quest Card.

The player must acquire three Scene Cards by clearing the relevant
zones.

The player also has an Actor Card.

The basic story set is:

**Actor Card + Scene Card 1 + Scene Card 2 + Scene Card 3 + Quest Card**

The Actor Card is the player's narrative identity.

The Quest Card is the King's requested narrative endpoint / closure.

The three Scene Cards can later be arranged in a different order than
the order in which they were acquired.

At the King, the player performs a card-ordering/story minigame using
the collected cards.

No live LLM storytelling is required for this minigame itself.

The player can use Drag & Drop to arrange the cards and attempt a
coherent story.

The King evaluates the resulting logical connection and produces a Push
result.

------------------------------------------------------------------------

## 12. Card Persistence / Fractal Almanac

### DECIDED

Collected Scene Cards are not consumed when used for a story.

They remain permanently available in the player's **Fractal Almanac /
Diary**.

The Almanac therefore functions as a persistent story-resource
collection.

A player can reuse collected cards in different narrative combinations.

The Actor Card is the first entry in the Almanac; the player does not
start with an empty collection.

Cards can be shown as a vertical/fanned stack and opened into a larger
card view using the existing Card Viewer logic.

------------------------------------------------------------------------

## 13. Starting Character / Actor Card

### DECIDED

At game start:

1.  Player chooses a character/unit to represent them.
2.  Player receives an Actor Card randomly from the starting deck.
3.  That Actor Card becomes the first Almanac entry.

The physical player unit and the Actor Card are conceptually distinct:

**Unit = physical player representation in the world.**\
**Actor Card = narrative representation in the KFB story.**

------------------------------------------------------------------------

## 14. HUD / UI

### DECIDED / WORKING MODEL

The HUD uses the established Ink Outline visual language.

### Upper right

A tactical minimap.

It should correspond approximately to the landscape/world map format and
reflect the non-rectangular/fractal overall world silhouette.

Current visual concept: circular compass/minimap presentation, but it
should still function as a tactical representation of the actual world.

### Below minimap

An expandable scroll containing the Quest Log.

Initially there is one Quest Card: the King's current bounty/story task.

The Quest Card is clickable and uses the same Card Viewer logic as other
cards.

### Bottom right

Fractal Almanac / card collection.

The Actor Card appears here immediately at game start.

Collected Scene Cards are added as they are won.

### Bottom edge

Action Card Slots.

------------------------------------------------------------------------

## 15. Action Cards

### DECIDED / WORKING MODEL

The player begins with three Action Card Slots.

The slots are arranged horizontally along the bottom edge, visually like
a hand/fan of landscape-format cards.

Action Cards represent RPG-style abilities and KFB-specific gimmicks.

Examples:

-   self-heal
-   AoE effects
-   special attacks
-   humorous/gimmick animations
-   temporary special effects such as a jumping mushroom hat

Each Action Card has a visible cooldown.

Additional slots can be purchased/unlocked through progression using
POP.

Action Cards are therefore a separate system from the persistent Story
Cards in the Almanac.

------------------------------------------------------------------------

## 16. POP / RPG Stats and KFB Mechanics

### DECIDED

POP is the experience-point equivalent.

POP can be spent to acquire/unlock Action Card Slots and related
abilities.

Existing KFB/card-game concepts are mapped to RPG-style stats and
abilities.

Established concepts include:

-   Fluff = Health / HP
-   POP = Experience / progression currency
-   K-Fabe = magic / ranged-attack equivalent
-   Bizarro = tank / melee equivalent

Additional mapped social/call concepts from the card system include:

-   Blödsinn
-   Käfer
-   Bizarro
-   Käfer Bingo
-   Käfer Boggle

These function as the corresponding stats/ability vocabulary of the
world.

------------------------------------------------------------------------

## 17. Victory Card Acquisition

### DECIDED / WORKING MODEL

When a Card Zone/Boss is defeated:

-   combat effects gradually settle;
-   arena dust settles/clears;
-   the underlying card becomes visible;
-   a victory animation presents the newly acquired Scene Card.

The card can use the already-developed paper-animation effect, appearing
to ripple/wave lightly in the air.

It then flies into the player's Fractal Almanac/card stack.

The card is immediately available as persistent Story material.

------------------------------------------------------------------------

## 18. King / Story Replay Presentation

### WORKING MODEL

When the player later tells the story at the central settlement, the
world can present a replay/re-enactment based on the JSON data written
to the Journey Diary.

Possible presentation:

-   marketplace/throne-area audience
-   replay of a Mob encounter or Boss Fight from a cleared zone
-   crowd reaction
-   applause or boos
-   exaggerated wrestling-style social calls

This is intended to make the story presentation feel like a piece of
Kayfabe performance rather than a conventional dialogue screen.

------------------------------------------------------------------------

## 19. Deck Progression

### WORKING MODEL

The player starts with the 56-card Anti-Rules starter deck.

As cards are collected, the player can eventually unlock another
deck/world.

A rough current idea is that approximately 10--12 collected cards might
be enough to unlock the next deck, but this threshold is explicitly
**OPEN**.

The intended progression is:

**collect cards → tell stories → progress → unlock another deck/world**

However, the system should not force a strictly linear campaign.

The player should ultimately be able to use Pull to select another
available deck directly from the Library rather than being forced
through a rigid sequence.

The selected deck is then used to generate/instantiate the next world
according to the established six-biome / six-card / KFB world-generation
rules.

Waypoints can later provide navigation between multiple deck/world
instances.

------------------------------------------------------------------------

## 20. Global World Effects

### DECIDED / WORKING MODEL

Simple global presentation layers are sufficient:

-   rain
-   snow particles
-   fog / fog of war
-   circular player visibility area
-   day/night cycle

These should use inexpensive rendering approaches rather than complex
simulations.

------------------------------------------------------------------------

## 21. Core Conceptual Model

### DECIDED

The KFB system intentionally merges:

**RPG Overworld** + **Card Game** + **Comic / PDF** + **Procedural World
Instantiation** + **Wrestling Kayfabe** + **Microstories** + **Combat
Simulation**

The central recursive relationship is:

**Deck** → generates **Cards** → cards influence **World** → world
generates **Encounters** → encounters produce **Scene Cards** → cards
accumulate in the **Almanac** → cards are recombined into a **Story** →
Story produces **Push / Progression** → progression unlocks another
**Deck / World**

The key design principle is:

> **The comic is not merely displayed inside the game. The comic becomes
> the world, the world acts out the comic, and the player's experience
> of the world becomes material for telling the comic back.**

------------------------------------------------------------------------

## 22. Explicitly Avoid

### REJECTED

-   Replacing the KFB Texture Lab with a new procedural terrain
    generator.
-   Iterating endlessly on AI-generated organic blob terrain.
-   Adding parameter-heavy terrain morphology systems when existing
    textures already solve the visual foundation.
-   Turning every visual problem into another
    prompt/briefing/measurement layer.
-   Treating the Overworld as a generic RPG map with cards pasted onto
    it.

The desired direction is **simple systems composed into a sophisticated
experience**, not technical complexity for its own sake.

------------------------------------------------------------------------

# 23. World as Toybox / Environmental Discovery

### DECIDED / WORKING MODEL --- Riffing

The Overworld should feel like a **toy world** in which the player can
fundamentally interact with the things around them.

The world is not merely a static background behind the player character.

Basic interaction should be possible with essentially any suitable world
element, with the **strength and type of reaction depending on the
object and situation**.

Examples:

-   Character walks into a tower → tower reacts/wobbles slightly.
-   A Goblin detonates a dynamite barrel near the tower → substantially
    stronger reaction.
-   Fire can affect suitable objects.
-   Units can use or interact with world objects.
-   Resources can be interacted with and altered.
-   Terrain/material layers can react to player abilities.
-   Objects can have small physical/cartoon reactions even when they
    have no deeper gameplay function.

The goal is **immersive responsiveness**, not full physical simulation.

### Riff principle

> **Everything can react; only selected things need to be meaningfully
> manipulable.**

This keeps the toy-world feeling without requiring a complex simulation
for every object.

------------------------------------------------------------------------

## 24. Hidden Cards / Treasure-Hunt Discovery

### DECIDED / WORKING MODEL --- Riffing

Cards can be physically hidden in the Overworld instead of always
appearing as obvious Card Zones.

Examples:

### Buried Card

A card is hidden underneath a layer of dirt/ground.

The player can discover it through:

-   subtle visual hints
-   audio cues
-   environmental signals
-   glowing/animated breadcrumbs
-   a small trail leading toward the hidden card

The player follows the clue and eventually clears the covering layer to
reveal the card.

### Liquid-/Ink-Covered Card

A card can be hidden beneath a pool of ink, oil or another liquid-like
terrain layer.

The player requires an appropriate ability, e.g. **Liquid Absorb**, to
remove the covering.

The removal should itself be animated and diegetic:

**ability → liquid recedes/is absorbed → card emerges → acquisition
animation → Almanac**

The hidden card therefore becomes another form of environmental
exploration rather than merely another menu reward.

------------------------------------------------------------------------

## 25. Breadcrumb Discovery Language

### WORKING MODEL --- Riffing

Hidden-card clues should preferably be **diegetic rather than
conventional quest arrows**.

Possible signals:

-   tiny glowing points
-   short animated lines
-   drifting particles
-   faint sound cues
-   occasional glints
-   small pulses of light
-   an intermittently visible trail
-   environmental anomalies

The player should feel:

> **"Something is going on over there."**

rather than:

> **"Follow the yellow arrow."**

The breadcrumb can therefore act as an invitation to explore without
becoming a rigid navigation system.

------------------------------------------------------------------------

## 26. Action Cards as World Manipulation

### DECIDED / WORKING MODEL --- Riffing

Action Cards should not be restricted to combat.

They can also provide **environmental manipulation abilities**.

Examples:

``` text
Action Card
    ↓
Liquid Absorb
    ↓
Ink/Oil Pool disappears
    ↓
Hidden Card revealed
    ↓
Scene Card acquired
    ↓
Fractal Almanac
```

Other future examples may include abilities that:

-   clear debris
-   move an obstruction
-   reveal something hidden
-   alter a terrain layer
-   trigger a world object
-   interact with a specific faction resource
-   create a temporary traversal opportunity

The important principle is:

> **A skill should sometimes change the world, not merely change a
> combat number.**

This gives Action Cards a second role:

**Combat Ability + World Interaction Tool**

------------------------------------------------------------------------

## 27. Interaction vs. Manipulation

### CONCEPTUAL DISTINCTION --- Riffing

Two levels of environmental response are useful:

**Interaction** → the world reacts to the player.

**Manipulation** → the player deliberately changes the world to achieve
something.

Examples:

-   Tower wobbles when touched → **Interaction**
-   Tower is damaged by a nearby explosion → **Interaction with stronger
    consequence**
-   Player absorbs an ink pool to reveal a card → **Manipulation**

This distinction allows the world to feel responsive everywhere while
reserving deeper gameplay logic for selected objects and abilities.

------------------------------------------------------------------------

## 28. Card Discovery as a Second Acquisition Path

### WORKING MODEL --- Riffing

Cards do not have to be acquired exclusively through the main Card-Zone
combat loop.

Potential acquisition paths include:

1.  **Zone Cards**
    -   clear a Card Zone
    -   defeat its encounters/Boss
    -   receive the Scene Card
2.  **Hidden Cards**
    -   discover environmental clues
    -   find concealed card
    -   reveal it through exploration/manipulation

This creates a distinction between:

**"I conquered this card."**

and

**"I discovered this card."**

Both ultimately feed the same persistent Fractal Almanac.

------------------------------------------------------------------------

# ASSISTANT COMMENTARY --- NOT ADDITIONAL DECISIONS

The World-as-Toybox idea is a strong extension of the existing model
because it makes the **physical world itself another interface to the
card system**.

The most useful rule to preserve is:

> **React everywhere, require gameplay logic selectively.**

That gives you the feeling of a living cartoon world without turning
every Tiny Swords asset into a simulation problem.

The hidden-card idea also fits the KFB logic particularly well because
it makes **discovery itself a form of collecting narrative material**.

A useful mental model for later riffing is therefore:

**Cards can be:**

-   given by the King,
-   found in the world,
-   won in combat,
-   revealed by abilities,
-   generated/recontextualized by encounters,
-   stored permanently in the Almanac.

No need to formalize those acquisition types further yet; they can
remain a riffing vocabulary while the rest of the system develops.

------------------------------------------------------------------------

# 29. Fractal Sprite → Hidden Card Zone

### DECIDED / WORKING MODEL --- Riffing

A further layer of the fractal world model is that **essentially every
meaningful world sprite can conceal a small card back underneath it**.

This applies not only to major buildings but potentially to very small
world elements:

-   buildings
-   towers
-   mushrooms
-   characters/creatures such as a Strommann
-   path/road elements
-   other distinctive environmental sprites

The conceptual pattern is:

**Sprite → hidden card back beneath/near it → discovery → interaction →
Card Zone**

The card back can be partially obscured by terrain material, dirt or
arena dust.

The player can discover these hidden locations through exploration,
observation and experimentation --- potentially with a light
**Monkey-Island-style "try interacting and see what happens"** quality.

------------------------------------------------------------------------

## 30. Card Zone Activation

### WORKING MODEL --- Riffing

When the player clears away the covering material and discovers the
hidden card:

**E / Enter interaction**

activates the card.

The ground then opens/transitions into a **Card Zone**.

The Card Zone is bounded by the existing **rubber-band Ink Outline**.

This creates a physical transition:

``` text
ordinary Overworld
        ↓
hidden card back
        ↓
discover / uncover
        ↓
E / Enter
        ↓
ground opens
        ↓
Card Zone
        ↓
Ink-bounded playable card
```

The card is therefore not merely picked up from the ground. It can
become a **portal-like playable micro-environment**.

------------------------------------------------------------------------

## 31. Low-Level Card-Zone Encounters

### DECIDED / WORKING MODEL --- Riffing

Not every Card Zone needs to be a three-wave Boss encounter.

There can be **small, low-level Card Zones** containing a single
encounter.

Examples:

### Farm Card Zone

A farm card becomes a small rectangular arena.

A pig is the primary opponent.

The pig is stronger than the freely roaming Goblins in the Overworld and
therefore represents an early meaningful challenge.

### Graveyard Card Zone

The Graveyard becomes a card-shaped encounter area.

A Skeleton roams the card.

The player defeats the encounter and can then inspect/read the card.

### Rules / Tutorial Card Zone

A discovered card can represent a rules/tutorial page rather than a
combat encounter.

This allows the same underlying Card Zone technology to support:

-   combat
-   exploration
-   tutorial content
-   card reading
-   discovery

------------------------------------------------------------------------

## 32. Encounter Scale Hierarchy

### WORKING MODEL --- Riffing

Card Zones can exist at different scales.

### Micro Encounter

**One card → one encounter**

Examples:

-   farm + pig
-   graveyard + skeleton
-   small resource location + local creature

### Standard Card Zone

**One card → multiple encounters / waves**

This is the more substantial zone used for normal progression.

### Dungeon

**One full comic page → 2×2 card grid → multiple rooms**

Each card becomes a room/encounter area.

The player progresses from room to room.

### Raid / Larger Encounter

**Multiple comic pages → multiple 2×2 grids**

The same spatial grammar can scale upward into a larger raid-like
structure.

This is the intended fractal property:

> **The same 2×2 card grammar can represent a room, a dungeon, a page,
> or a larger raid structure depending on scale.**

------------------------------------------------------------------------

## 33. Dungeon as a 2×2 Card Grid

### WORKING MODEL --- Riffing

A complete comic page can become a mini-dungeon consisting of four cards
in a 2×2 arrangement.

Conceptually:

``` text
┌───────────┬───────────┐
│  CARD 1   │  CARD 2   │
│           │           │
├───────────┼───────────┤
│  CARD 3   │  CARD 4   │
│           │           │
└───────────┴───────────┘
```

Each card can be a room or encounter.

The player progresses through the grid and clears rooms sequentially.

Each room can contain its own microstory / combat sequence.

A room can therefore use the same internal grammar as a larger Card
Zone.

------------------------------------------------------------------------

## 34. Story Beats Inside Card Rooms

### WORKING MODEL --- Riffing

A card room can itself contain a small sequence of approximately three
story/combat beats.

For example:

**Room → Wave 1 → Wave 2 → Wave 3 / local Boss**

This creates another fractal layer:

``` text
Story
  ↓
Dungeon
  ↓
Page
  ↓
4 Cards / Rooms
  ↓
Encounter
  ↓
Story Beats
```

The exact number of waves per room remains a gameplay tuning question
rather than a fixed architectural requirement.

------------------------------------------------------------------------

## 35. Ink as Dungeon Boundary / Progression Gate

### DECIDED / WORKING MODEL

The rubber-band Ink Outline can also serve as a **physical progression
boundary**.

The player should not be able to simply walk from an early room into a
later Boss room or treasure chamber.

Ink boundaries can:

-   block passage
-   bounce the player back
-   define the current playable card
-   visually communicate the active room
-   open/change after the previous room has been cleared

Example:

``` text
CARD 1
  ↓
clear
  ↓
Ink boundary opens
  ↓
CARD 2
  ↓
clear
  ↓
CARD 3
  ↓
clear
  ↓
Boss / Treasure CARD 4
```

This reuses an already-proven KFB mechanic rather than requiring
conventional invisible collision walls.

------------------------------------------------------------------------

# ASSISTANT COMMENTARY --- NOT ADDITIONAL DECISIONS

I think this is one of the more important extensions of the fractal
model so far.

The key idea is **not merely "put hidden cards everywhere."** It is that
the same object can exist simultaneously at several semantic levels:

**world object → clue → card → playable space → story fragment**

That is very KFB-specific.

The especially strong part is the possibility that a tiny object such as
a mushroom can carry the same underlying logic as a Castle or a full
comic page. The *content scale* changes, but the interaction grammar
remains recognizable.

I would also keep the distinction between **ambient hidden cards** and
**intentional Card Zones**:

-   Some hidden cards can simply be discoveries/readable content.
-   Some activate a tiny encounter.
-   Some activate a substantial combat zone.
-   Some open a whole 2×2 dungeon structure.

That gives you a natural difficulty/content hierarchy without needing a
completely different system for each case.

The 2×2 structure is particularly elegant because the **existing
comic-page grammar becomes spatial grammar**. A page is already four
cards; in the game those four cards can become four rooms.

And the Ink boundary then becomes more than an art style:

> **Ink is the physical grammar that separates one piece of the
> comic-world from another.**

That makes the existing rubber-band/bounce prototype considerably more
valuable than just a cute interaction effect.

------------------------------------------------------------------------

# 36. Masterplan Reference

### REFERENCE --- DO NOT MODIFY MASTERPLAN

The uploaded **KFB Overworld --- Masterplan** is treated as an external
reference document, not as a document to be rewritten or silently
reconciled here.

The Masterplan reader states that it reads
`docs/MASTERPLAN_overworld.md` at runtime and that the underlying
Markdown file remains the source of truth; the reader is only the
presentation layer. fileciteturn2file0L94-L101

For this Living Document:

-   the Masterplan remains unchanged;
-   relevant Masterplan sections should be referenced rather than
    duplicated unnecessarily;
-   newly discussed ideas are recorded here as additive session
    material;
-   if the Masterplan contains an ambiguity, conceptual contradiction,
    or technically questionable direction, record a **Masterplan
    Comment** here and discuss it in chat;
-   do not silently alter the Masterplan's terminology or decisions.

**Current source limitation:** the uploaded HTML is the Masterplan
reader, but the referenced runtime file `docs/MASTERPLAN_overworld.md`
itself was not included in the upload. Therefore its four current open
questions cannot be safely reconstructed from the HTML alone. The reader
confirms that the Masterplan is sectioned by §-headings and preserves
its original order, including duplicate/out-of-order section numbers.
fileciteturn2file0L115-L130

------------------------------------------------------------------------

# 37. Gimmick Zones / Fourth-Wall Events

### RIFFING

Optional Gimmick Zones can exist alongside normal Card Zones.

Example:

**Radwand-/Brett-Navigation → remote treasure island → unexpected media
gag**

A discovered/accessible special zone could lead the player to a small
treasure island where, instead of a conventional reward, a YouTube video
such as Rick Astley is played.

These zones are deliberately optional and can function as:

-   absurd surprise events
-   fourth-wall breaks
-   Easter eggs
-   media interventions
-   pure KFB flavor

They are not part of the core Card-Zone progression system.

### ASSISTANT COMMENTARY

This fits the existing World-as-Toybox idea particularly well because it
allows the world to occasionally violate its own established grammar
without making that violation the main mechanic.

Keep this as a **Gimmick Zone category**, not a new generalized
media/event architecture yet.

------------------------------------------------------------------------

# 38. Fluff as Derived Level-HP

### DECIDED --- Riffing / clarified

**Fluff is HP / Soul / Energy**, but it is not independently skilled.

Fluff is a **derived aggregate of the six fraktal combat stats**:

1.  Bizarro
2.  Kayfabe
3.  KayfaBingo
4.  KayfaBongo
5.  KayfaBoggle
6.  BLÖDSINN!

When the player increases any of the six stats using POP, the resulting
total Fluff can increase according to a rough aggregate function.

The exact weighting/formula is deliberately not fixed yet.

### Design intention

The player's preferred stat path should not create a fundamentally
different total HP trajectory.

If one player spends POP on BLÖDSINN! while another invests in
Bongo/Boggle/etc., both should experience approximately comparable
growth in total Fluff.

The important feedback loop is:

**POP → stat increase → aggregate Fluff growth → visible celebratory HP
feedback**

The increase can be small enough that it feels like a secondary reward.

Example:

> Player spends POP across several sessions to increase BLÖDSINN! by 3
> points → after the relevant aggregate threshold is crossed, the Fluff
> bar animates upward by approximately +1.

The exact ratio is not yet specified.

### ASSISTANT COMMENTARY

This separates **specialization** from **survivability progression**.

The six stats answer:

> "What kind of hero am I becoming?"

Fluff answers:

> "How much of a hero have I become overall?"

------------------------------------------------------------------------

# 39. King Storytelling --- Current Development Model

### WORKING MODEL --- LLM-assisted internal development

For the current development/prototyping phase, assume **LLM calls are
available** for the King/Kayfabulating sequence.

The player assembles the story manually before the LLM is invoked.

### Story Assembly UI

The player:

1.  selects three Scene Cards from the Fractal Almanac;
2.  places them into three empty slots;
3.  chooses the desired order;
4.  sees the three PDF-card crops side by side;
5.  sees the player's Actor Card centered underneath;
6.  sees the current Quest Card at the top of the composition;
7.  sees King Kayfabian alongside the Quest Card.

The overall composition is visually based on a **"+" / cross-like
arrangement**.

King Kayfabian has a large Quest Die / Quest Cube representation,
originally conceived as a 3D cube model.

The Quest Die visually communicates the current quest/progress state.

------------------------------------------------------------------------

## 40. Kayfabulation Assembly Layer

### WORKING MODEL --- Riffing

Before activating the story, the player fills connective narrative gaps
using small visual text elements.

Possible interaction pieces:

-   scroll fragments
-   rectangles/tapes
-   **THEREFORE**
-   **BUT**
-   FrizzleBob Kayfabulation tips/hacks
-   absurd semantic bridges
-   closure-oriented connectors

The underlying idea is based on **McCloud-style closure**:

The player is not writing a complete story.

The player is **constructing the connective logic that tells the system
how the five cards are supposed to relate**.

------------------------------------------------------------------------

## 41. Kayfabulate Button

### WORKING MODEL

Once the player has completed the connective assembly, the
**KAYFABULATE** button becomes active.

The player unit physically stands on/near the button.

A speech bubble appears:

> **"Enter...?"**

Space/Enter activates the sequence.

The unit jumps onto the button and triggers the Kayfabulation.

This keeps the UI interaction diegetic and consistent with the existing
principle that the player character can operate the world/UI.

------------------------------------------------------------------------

## 42. King Performance / Story Replay

### WORKING MODEL --- LLM + Journey JSON

After activation, all five cards are presented sequentially in the
throne-room / red-carpet terrain.

Possible presentation language:

-   theatre curtain
-   slide
-   flip
-   dissolve
-   paper/card transitions

The player unit performs the generated story in speech bubbles.

The LLM generates the actual story beats from:

-   the five cards
-   their selected order
-   the connective elements supplied by the player
-   relevant Journey JSON / player history
-   current quest state
-   high-level encounter information

The story is therefore **performed in the world**, rather than shown as
a conventional generated text block.

------------------------------------------------------------------------

## 43. Golden Sample Combat Replays

### WORKING MODEL --- Riffing

During relevant story beats, the system can automatically stage a short
**"golden sample" combat / choreography** representing the player's
alleged heroic achievement.

Potential participants:

-   Boss / owner associated with the relevant card
-   Mob from the player's trophy collection
-   relevant faction/unit
-   other high-level encounter representatives

The matchup and ownership/context are derived from the player's Journey
JSON and collected/trophy data.

Presentation can use:

-   pseudo-cutscenes
-   replay framing
-   bullet-time moments
-   exaggerated combat choreography
-   afterglow / lingering highlight effects

This is a **stylized Kayfabe reconstruction**, not a literal simulation
replay.

------------------------------------------------------------------------

## 44. Replay Persistence

### WORKING MODEL

The generated story performance and its golden-sample combat moments can
later be stored/replayed from the Almanac.

Potential uses:

-   replay the story
-   revisit the associated combat vignette
-   show the sequence to friends
-   preserve particularly good Kayfabulations

This creates another persistent layer in the Almanac:

**cards → stories → performances/replays**

------------------------------------------------------------------------

## 45. Quest Die / King Resolution

### WORKING MODEL

After the Kayfabulated performance, King Kayfabian resolves the quest by
advancing the Quest Die.

Possible result:

**+2 / +1 / 0 / −1 / other bounded step**

The current idea is that the Quest Die progresses toward **6**.

At **6 = Finale**, the player receives the Quest Card as a permanent
Almanac entry.

The Quest Card therefore transitions from:

**King's requested objective**

to:

**player's completed narrative achievement / collected story artifact**

A later extension can turn completed quests into **Hero Ballads**
performed at the Tavern.

------------------------------------------------------------------------

# ASSISTANT COMMENTARY --- NOT ADDITIONAL DECISIONS

The useful separation here is:

**Player provides structure.\
LLM provides performance.\
Game state provides evidence.\
King provides outcome.**

That keeps the LLM bounded rather than making it responsible for game
logic.

The five-card arrangement also gives the sequence a clear visual
grammar:

**Actor + three earned Scenes + Quest / demanded closure**

while the connective fragments provide the "how do these things
supposedly make sense?" layer.

The golden combat replay is especially useful as explicit **Kayfabe
reconstruction** rather than literal replay. It can exaggerate and remix
the player's heroic version of events.

The Fluff mechanism creates a small but persistent reward loop: the
player specializes through POP, while the game periodically confirms
overall growth through a visible Fluff increase.

### OPEN --- unfinished riff

The last sentence of the current riff ended with:

> "Idee: aus Quest ..."

No interpretation is added until that thought is completed.

---

# 46. Initial Character / Stat Setup

### WORKING MODEL — Riffing

At game start:

1. Player selects an avatar/unit sprite.
2. Initial avatar choice is the Knight, with four color variants.
3. Player receives 6 free starting POP-equivalent points.
4. The six points can be freely distributed across the six primary stats.
5. Player draws/receives one Actor Card from the starter deck.
6. Actor Card becomes the first entry in the Fractal Almanac.

### Initial stat cap

Current interpretation:

- six stat dimensions;
- each stat initially capped at approximately 6 points;
- caps can expand later;
- very large later stat counts primarily communicate long-term play / Fame rather than unlimited practical combat power.

---

# 47. Six Enemy Levels

### WORKING MODEL — Riffing

The enemy scale has six formal levels:

| Level | Role |
|---|---|
| 1 | low-level roaming mobs / training opponents |
| 2 | stronger ordinary enemies |
| 3 | meaningful zone enemies |
| 4 | elite / advanced encounters |
| 5 | major / pre-boss encounters |
| 6 | Boss |

This six-level structure mirrors the broader KFB six-fold/fractal organization.

---

# 48. Encounter Scaling / Gauss-Curve Difficulty

### WORKING MODEL — Riffing

Enemy strength should scale with the player's current effective progression.

The goal is not exact level matching.

Instead, encounters should be distributed around the player's effective level in a Gauss-like difficulty curve:

- many encounters near current capability;
- some weaker encounters;
- some stronger/challenging encounters;
- rare exceptional encounters.

Possible inputs:

- player stat progression
- collected cards
- reputation / Fame
- completed zones
- current deck/world progression

The intended feeling is:

> the world grows with the hero without becoming a perfectly level-scaled treadmill.

Low-level roaming mobs can remain useful as training/ambient content even when the player becomes stronger.

---

# 49. POP Acquisition Cadence

### WORKING MODEL — Riffing

Target early progression cadence:

> approximately three ordinary mobs defeated OR one Card cleared → enough POP for roughly one stat-point increase.

This is a target feeling, not yet a fixed formula.

The desired loop is:

**fight → POP → available point → stat increase → Fluff feedback**

Combat rewards remain numerically damped and readable.

---

# 50. Stat Respec / Redistribution

### WORKING MODEL — Riffing

Stats can later be redistributed for a POP cost.

Intended model:

- early game: six stats, each initially capped around 6;
- later progression: caps can rise;
- very high total stat counts can reach hundreds/thousands;
- high numerical totals primarily communicate Fame / accumulated play / power-user status rather than unlimited combat dominance.

Exact respec cost and scaling remain OPEN.

---

# 51. Skills / Action Acquisition

### DECIDED / WORKING MODEL

Skills are fundamentally found, looted or conquered rather than simply purchased from a skill tree.

Primary sources:

- defeated mobs
- Boss trophies
- Card Zone clears
- Dungeons
- Chests
- hidden terrain discoveries
- cards/objects concealed under sprites or environmental layers
- Breadcrumb-led secrets

A defeated unit can teach/acquire its characteristic ability.

Example:

**defeat first ranged enemy → acquire Kayfabe/ranged capability**

The Action Card system makes acquired abilities equipable/useable through Action Card Slots.

---

# 52. Skill Training / Activation Cost

### OPEN / Riffing

A possible additional layer is a one-time POP training/activation cost before a newly acquired skill can be used.

Example:

**defeat ranged unit → obtain ranged skill/trophy → spend small POP training cost → Kayfabe/ranged action becomes usable**

This would make POP serve two complementary progression roles:

- increase one of the six stats;
- train/activate newly acquired skills or unlock Action Card Slots.

### ASSISTANT COMMENTARY

If used, keep the cost small and preferably one-time.

The useful psychological sequence is:

**I defeated it → I earned its trick → I trained it → now I can do that trick.**

A recurring POP tax per use would work against the KISS direction.

---

# 53. Combat Progression Principle

### WORKING MODEL

The intended economy is:

**Combat → POP + possible skill/trophy → stat/skill progression → increased effective capability → appropriately scaled encounters**

Visual rewards remain important:

- hit reactions
- knockback
- particles
- Bloodlust
- card/arena reveal
- trophy acquisition
- POP feedback
- Fluff increase

---

# 54. Early-Game Fractal Loop

### WORKING MODEL — Riffing

Candidate early loop:

**Choose Knight variant**
→ **6 starting points**
→ **receive Actor Card**
→ **explore Overworld**
→ **fight low-level mobs**
→ **earn POP**
→ **raise stats**
→ **Fluff gradually increases**
→ **discover first skill/trophy**
→ **activate/train skill if required**
→ **clear first Card Zone**
→ **earn Scene Card**
→ **continue toward first King story**

This is a candidate onboarding loop, not yet a locked tutorial sequence.

---

# ASSISTANT COMMENTARY — NOT ADDITIONAL DECISIONS

This is now the point where numbers/game mechanics genuinely deserve their own design layer, but they do not need to be balanced simultaneously.

A clean initial numerical grammar is:

**six stats × initial cap 6 × six free starting points × six enemy levels.**

The important distinction is between **raw stat count** and **effective combat level**. If veterans later have hundreds/thousands of stat points, raw numbers should not simply mean proportional damage/HP inflation.

The next useful balancing question is therefore:

> **What exactly determines the player's effective level?**

Candidate inputs are:

- six stats
- collected cards
- Fame/reputation
- cleared zones
- current deck/world progression

Once that is defined, the six enemy levels and Gauss-like encounter distribution can be balanced around it without turning the game into a conventional level treadmill.

---

# 55. Effective Level / Combat Power — Draft Suggestion

### DRAFT / SUGGESTION — NOT DECIDED

To keep the visible six-stat system open-ended while keeping combat encounters on a compact six-level scale, introduce an internal **Effective Level / Effective Power** value.

The key distinction is:

**Raw Stats = persistent player progression / specialization / Fame**

**Effective Power = compressed combat-matching signal**

The Effective Power should **not** simply equal the sum of the six stats.

### Suggested model

The internal combat signal is compressed into approximately **six effective bands**, corresponding to the six enemy levels:

| Effective Band | Encounter Reference |
|---|---|
| 1 | low-level / training |
| 2 | ordinary |
| 3 | meaningful |
| 4 | elite |
| 5 | major |
| 6 | boss |

The player can have raw stat totals far beyond this range later in the game without automatically becoming an infinitely scaling combat entity.

### Inputs

Candidate inputs for the Effective Power calculation:

- six primary stats
- Fluff / aggregate survivability
- collected Scene Cards
- cleared Card Zones
- Fame / reputation
- current Deck / World progression
- possibly acquired combat skills

Not all inputs need equal weight.

### Proposed principle

**Stats determine specialization.  
Fluff reflects aggregate development.  
Cards/Zones/Fame establish progression context.  
Effective Power compresses these signals into a small combat-relevant range.**

This allows the world to scale approximately with the player without producing exact level mirroring.

---

## 56. Gauss-Like Encounter Matching — Draft Suggestion

### DRAFT / SUGGESTION — NOT DECIDED

Once Effective Power is established, encounter generation should prefer a **weighted distribution around the player's current Effective Band** rather than exact matching.

Conceptually:

- high probability: current band
- moderate probability: ±1 band
- low probability: ±2 bands
- exceptional/rare: farther away

Example for Effective Band 3:

```text
Level 1   rare
Level 2   moderate
Level 3   common
Level 4   moderate
Level 5   rare
Level 6   exceptional
```

This should be adjusted by world context.

A Goblin road may naturally contain mostly levels 1–2 even for a stronger player, while a Boss Card Zone may deliberately center around 5–6.

The Gauss-like distribution is therefore a **baseline weighting**, not a global rule that overrides authored content.

### Intended player feeling

> “Most things I meet are roughly within my world, but the world still contains weak, dangerous and surprising things.”

This preserves exploration and avoids a completely level-scaled treadmill.

---

## 57. Effective Power vs. Fame

### DRAFT / SUGGESTION — NOT DECIDED

High long-term stat counts should increasingly function as **Fame / veteran signal** rather than direct raw combat multiplication.

Possible distinction:

**Combat power**
→ compressed into Effective Power

**Visible progression**
→ raw six-stat values

**Long-term status**
→ Fame / accumulated achievements / collected cards / completed worlds

This permits a veteran to display impressive values such as very high Bizarro or BLÖDSINN! without requiring every enemy, damage number and HP value to scale proportionally.

### ASSISTANT COMMENTARY

I would strongly favor this separation.

It protects the six-level enemy grammar while allowing the character sheet to keep growing indefinitely.

It also makes the large numbers meaningful as a **history of the player**, not merely as inflation.

---

## 58. Open Balancing Questions

### OPEN

The following should remain unresolved until the Effective Power concept has been tested:

- exact formula
- exact weighting of six stats
- whether Fluff contributes directly or indirectly
- how strongly Fame contributes
- how many collected cards influence Effective Power
- whether Deck/World progression provides a floor
- whether Bosses use fixed authored levels rather than scaling
- exact probabilities for the Gauss-like encounter distribution

No numerical formula should be locked yet.

---

# 59. RSS Plauder-Seed per Zone / Faction

### RIFFING / EARLY FEATURE CANDIDATE

Each zone/faction can have a **default RSS feed** functioning as a daily/current **Plauder-Seed**.

The feed provides fresh, emergent source material for ambient NPC conversations.

**Faction / Zone → default RSS feed → current topics → Source Seed → faction/unit personality + mood + local context → short emergent NPC dialogue**

The purpose is not to make NPCs into news presenters. The RSS material is **raw conversational fuel**.

Example:

- Turtle Guard and Skeleton at the cemetery fence casually discuss the newest Dschungelcamp episode.
- Goblins elsewhere argue about the latest conspiracy theories associated with Alex Jones.

Different zones/factions can therefore have different conversational ecosystems because they draw from different default feeds.

### Intended effect

The Overworld becomes **temporally alive** without requiring new authored dialogue every day.

The world can contain:

- recurring local personalities
- faction-specific conversational styles
- current topics
- absurd mismatches between serious source material and mundane NPC life
- cross-faction differences in what counts as interesting

The RSS feed is therefore a **daily ambient Seed**, alongside permanent Card/URL/Content Seeds.

---

# 60. Source Seed Hierarchy — Conceptual

### WORKING MODEL / RIFFING

The emerging conceptual Source Seed vocabulary is:

**Persistent Seeds**
- Card JSON / Card Seed
- authored content
- deck/world material

**External Seeds**
- URL
- article
- essay
- social-media post
- video transcript

**Ambient Current Seeds**
- RSS feed / daily headlines
- current topical material

The Seed supplies semantic material.

The surrounding game context supplies:

- faction
- unit personality
- mood
- location
- relationship
- current activity
- player/world state

The LLM supplies the **in-world expression**, not the underlying game rules.

---

# ASSISTANT COMMENTARY — NOT ADDITIONAL DECISIONS

This is a good early proof-of-concept for the broader Source-Seed idea:

**one faction + one RSS feed + a few NPC personalities + short dialogue**

If that works, the same mechanism can later consume Card Seeds, URLs, transcripts, and other sources.

The useful friction is:

**current real-world topic × tiny fictional creature × faction worldview × local situation**

The RSS source should therefore be treated as **fuel, not canon**. NPCs need not accurately summarize the source; they use it as conversational material filtered through their own worldview.

This keeps the feature lightweight while making the world feel current without turning it into a news application.

---

# 61. Combat Flow — Active + Chill Combat

### DRAFT / SUGGESTION — CURRENT COMBAT MODEL

Combat remains part of the continuous Overworld movement flow.

There is **no separate Combat Mode**.

### Movement

- WASD / directional movement
- facing follows movement direction
- terrain and Ink Outlines remain physically relevant during combat

### Active Basic Attack

**Space = active Basic Attack**

The attack is directional and uses the player's current facing/movement direction.

No precision timing or combo system is required.

However, positioning matters:

- approaching an enemy from the correct direction improves the result;
- attacking while facing away can miss or be substantially less effective;
- movement, turning and spacing therefore influence combat naturally.

The active Space attack has **meaningfully greater impact/damage** than passive Auto-Attack.

---

# 62. Chill / Passive Auto-Attack

### DRAFT / SUGGESTION

Auto-Attack remains available for players who want a relaxed/chill play style.

It provides a **lower baseline combat output** without requiring constant Space input.

Therefore:

- a player can theoretically remain in the world and eventually be killed while AFK;
- active Space attacks are substantially more effective;
- the game rewards active play without forcing constant button-mashing.

The intended feeling is closer to:

**“I can chill and let the character fight a little.”**

rather than:

**“I must continuously click tiny sprites to deal damage.”**

---

# 63. Dynamic Combat / Flight State

### DRAFT / SUGGESTION

Combat pressure dynamically influences movement speed rather than switching into a hard-coded slow “combat mode”.

Possible state progression:

**Safe traversal**
→ normal / slightly building base movement speed

**Encounter / aggro**
→ movement under combat pressure

**Active pursuit**
→ escape movement is reduced relative to safe traversal

**Disengagement**
→ movement speed gradually returns toward normal

**Long safe traversal**
→ base movement speed can become slightly but noticeably faster

The effect should remain subtle and continuous.

### Bongo interaction

**KayfaBongo / Bongo** becomes particularly important for:

- movement speed
- attack/recovery tempo
- escape
- maintaining distance
- disengagement

---

# 64. Pursuit and Escape

### DRAFT / SUGGESTION

Powerful enemies should be difficult, but not impossible, to escape.

A strong Troll, for example, can maintain pursuit pressure against the default Knight.

Escape depends on:

- Bongo
- terrain
- positioning
- enemy movement profile
- player knowledge
- disengagement time

The goal is not a binary:

**combat = cannot escape**

but:

**the longer a dangerous enemy remains engaged, the harder escape becomes; successful disengagement gradually restores normal traversal.**

---

# 65. Enemy Encounter Profiles

### DRAFT / SUGGESTION

Enemy level and enemy behavior remain separate concepts.

**Enemy Level 1–6** represents approximate overall combat power.

The **Encounter Profile** determines how that power is expressed.

### Level 1 Goblin Archer

- low Fluff
- low damage
- higher movement speed
- ranged attack
- attempts to maintain preferred shooting distance

It can therefore be **annoying and tactically dangerous without being numerically strong**.

### Troll

- high Fluff
- high impact
- strong pursuit
- harder to escape
- potentially slower base movement

---

# 66. Goblin Archer — Reference Encounter

### DRAFT / SUGGESTION

Use the small Goblin Archer as a benchmark encounter for the combat prototype.

Starting Knight:

- default movement speed
- melee only
- no ranged/Kayfabe skill

Goblin Archer:

- slightly faster than default Knight
- ranged attack
- attempts to maintain ideal shooting distance
- low overall combat level

The player can solve the encounter through:

- Bongo / movement investment
- terrain manipulation
- cornering the Archer
- careful positioning
- closing distance manually
- later acquisition of Kayfabe/ranged capability
- environmental/other-unit interaction

The encounter should feel **annoying rather than unfair**.

---

# 67. Combat Principle — Level ≠ Threat Profile

### DRAFT / SUGGESTION

Enemy Level represents approximate overall power.

It does **not** directly determine moment-to-moment difficulty.

A lower-level enemy can be situationally dangerous because of its encounter profile:

**low Fluff + low damage + high mobility + ranged spacing**

A higher-level enemy may instead be dangerous through:

**high Fluff + high impact + pursuit + knockback**

---

# 68. Combat MVP Slice

### DRAFT / SUGGESTION

The smallest meaningful combat prototype should contain:

1. Player Knight
2. three Goblins
3. one Ink-Outline arena/boundary
4. WASD movement
5. directional Space attack
6. low-impact Auto-Attack
7. enemy pursuit
8. enemy attacks
9. knockback
10. Fluff bars
11. death
12. Graveyard respawn

No Action Cards are required for the first combat-feel test.

The test question is:

> **Does movement → encounter → positioning → Space attack → knockback → repositioning feel good for several minutes?**

If yes, add the six stats and then Action Cards incrementally.

---

# ASSISTANT COMMENTARY — NOT ADDITIONAL DECISIONS

The key distinction is now:

**Auto-Attack = baseline / chill**

**Space = active play**

**Movement = both navigation and combat**

**Encounter Profile = how an enemy fights**

**Enemy Level = approximate total power**

The Goblin Archer is a particularly useful benchmark because it tests movement, pursuit, ranged spacing, Bongo, terrain, positioning and later Kayfabe acquisition simultaneously.

