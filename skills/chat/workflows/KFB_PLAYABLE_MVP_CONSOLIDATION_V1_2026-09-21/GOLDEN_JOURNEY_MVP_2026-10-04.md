# KFB Playable MVP · Golden Journey v0.1 · 2026-10-04

Status: **CURRENT PRODUCT DIRECTION · PLANNING / ACCEPTANCE FIXTURE · NO RUNTIME / STAGE / LIVE PROMOTION**
Owner: **KFB playable MVP integration**
Receiving world owner: **KFB WorldBuilder / WB2**
Purpose: turn Georg's proposed first-play journey into one concrete, reusable product/acceptance fixture without turning the open world into a forced linear campaign.

Read with:
- `skills/chat/START_HERE.md`
- `ONE_SHOT_PRECHECK_2026-10-04.md`
- `DECK_WORLD_SEED_CARD_PIPELINE_2026-10-04.md`
- `SITE_GODMODE_LEAN_MEMORY_ARCHITECTURE_2026-10-04.md`
- `WSA_RESIDENT_ATLAS_MVP_INTAKE_2026-10-04.md`
- current WB2 and Motion owner Return/Recovery

## 1 · Product decision

Georg's 14-point sketch is adopted as the **Golden Journey** for the MVP.

It is:
- the authored first-run/reference journey;
- the main integrated acceptance fixture;
- the route used to prove world, movement, Drive, Residents, Cards, Audio, Lean Memory and HUD together.

It is **not**:
- a hard lock on the open world;
- a requirement that the player visit islands only in this order;
- a moral-choice score;
- a new quest/dialogue/runtime owner.

Players may explore freely. The Golden Journey supplies strong invitations, visible routes and courier tasks.

Current physical world graph remains compatible with the four-island hub model:
Town is the hub; Dystopia, Utopia and Protopia remain physically reachable through Track Core. The Golden narrative route may send the player Town → Dystopia → Utopia → Protopia even when the physical shortest path returns through Town.

## 2 · Canonical first Cards

Georg's “first card” wording is resolved literally against the current deck JSONs:

1. Dystopia / `ignore_dystopia:1`
   - **The Doomsday Clock**
   - source: `Deck_B_DYSTOPIA_-_ANATOMY_OF_A_TRAP_web_H.pdf.json`

2. Utopia / `forget_utopia:1`
   - **The Glossy Horizon**
   - source: `Deck_A_UTOPIA_-_Forget_Utopia_web_H.pdf.json`

3. Protopia / `embrace_protopia:1`
   - **The Open Notebook**
   - source: `Deck_C_PROTOPIA_-_Protopia_Sketchbook_(1)_web_H.pdf.json`

4. Anti-Rules / `anti_rules_toolkit:1`
   - **The Rules Lawyer**
   - source: `Anti-Rules_Toolkit_-_ADD_web.pdf.json`

All four remain one canonical Card identity each.
Courier transfer, Billboard display, ChatterBox reference and Almanac collection add provenance; they do not create duplicate cards.

## 3 · Beat 0 · curtain load / title ritual

### Experience
The current physical Theatre Curtain donor covers the world while the critical first-run bundle loads.

In front of the curtain:
1. a claymation **BLÖDSINN!** plaque drops in;
2. it lands/bounces and then hovers/settles in front of the curtain;
3. its animation is the loading indicator;
4. when the critical bundle is ready, a matching claymation **Enter** plaque falls in;
5. click/tap Enter opens the curtain;
6. the actual KFB Town start scene is revealed behind it.

### Optional Character Select

Before the Enter plaque becomes actionable, the start screen may expose the current Player Actor as a real 3D object in front of the Curtain.

Current contract:
`CURTAIN_CHARACTER_SELECT_MVP_2026-10-04.md`.

Product behavior:
- FrizzleBob is desired/preselected;
- player may switch to a source-proven alternative;
- selection is optional, never a forced creator gate;
- first QA roster is FrizzleBob v5b candidate, Mannequin_Medium / Rig_Medium and Black Knight / Rig_Large; GothGirl is optional Stage QA and ActionFigure is compatibility-smoke only;
- Enter appears only when the currently selected Actor and its minimum required motion set are ready;
- world loading and Actor loading remain explicit, real loader facts.

Motion intent is semantic and rig-specific.
Rig_Large must not inherit the full Medium locomotion ladder blindly.

### Rules
- BLÖDSINN! spelling is canonical.
- The plaque is a new authored Playmation/clay presentation asset, not a generic progress bar.
- It should take visual reference from canonical KFB/Anti-Rules language but must not pretend an existing 3D plaque source already exists.
- loading progress must reflect real loader/task progress, not a fake percentage.
- Enter appears only when the minimum playable bundle is ready.
- Theatre Curtain owns curtain presentation only; it does not become world/loading-state/game owner.
- no generic browser loading spinner unless used as inaccessible/technical fallback.

Current Theatre Curtain v1 remains a WIP donor until its final visual/physics gate is closed.

## 4 · Beat 1 · first FOV Resident = juggling Clown

### Scene
Town spawn is composed so the first readable Resident in the player's FOV is the current **Clown** Resident performing the source-proven juggling activity.

Before interaction:
- occasional short flat joke / heckle;
- visible speech bubble;
- browser TTS where supported;
- text reveals progressively rather than appearing as a wall.

On `I`:
- ChatterBox opens;
- short absurd onboarding exchange;
- four compact player responses use the canonical KFB social-call labels:
  - **KayfaBINGO**
  - **KayfaBONGO**
  - **KayfaBOGGLE**
  - **BLÖDSINN!**

Golden branch:
**KayfaBINGO** accepts the courier offer.

### Dialogue implementation rule
Reuse existing ChatterBox / Bubble lineage.
Preferred presentation donor is the later bubble layout/reveal path, not a new chat UI.

Browser TTS:
- text is authoritative;
- SpeechSynthesis is presentation;
- target-browser TTS should work, but text-only fallback must keep the game playable;
- generated/network text must have deterministic local fallback;
- no full transcript becomes NPC memory by default.

The four buttons are local conversation choices and must not silently redefine the global tabletop Social Call canon.

## 5 · Beat 2 · first Card / first courier task

On the Golden `KayfaBINGO` branch, Clown hands the player:

**ignore_dystopia:1 · The Doomsday Clock**

Task:
deliver the Card to the Orc Band, currently performing at the fictional Demon Lord birthday party in Dystopia.

Memory/provenance records:
- received from Clown;
- Town onboarding encounter;
- destination Dystopia / Orc Band;
- courier thread opened.

The Card may be “in custody” for the courier task while already visible in the Almanac as acquired provenance. Do not create an inventory duplicate.

## 6 · Beat 3 · routes are walkable, vehicle is optional

All required Track-Core routes must be traversable on foot.

The Town→Dystopia leg is deliberately useful as a locomotion/distance test:
- walk/run/sprint must remain viable;
- taxi is optional, not a hard gate;
- Track stunt/ramp sections may expose **Foot Assist Zones**.

Foot Assist Zone rule:
- Track Core may own the zone/semantic trigger;
- the central Ground movement owner applies the actual pull/boost/impulse;
- no Track-local player transform writer;
- a failed optional stunt aid must not make the route impossible on foot.

Exact distances are DERIVED after the native KayKit movement baseline is accepted. Do not bake arbitrary metre targets before real movement speed is known.

## 7 · Beat 4 · Driver + taxi key + minimal 20-slot bag

### Scene
At the KFB Town roundabout / Track edge:
- current **Driver** Resident stands casually beside the source-pinned KayKit taxi;
- taxi source:
  `media/3D_Assets/KayKit_City_Builder_Bits_1.0_FREE/Assets/gltf/car_taxi.gltf`
  at commit `64cbf1031392029f25110dd613247b32148aae42`
  blob `266c1113a22f85ee6851b5dab6a89fc51726f4f8`.

`I` on Driver:
- short ChatterBox exchange;
- Golden `KayfaBINGO` branch grants `item.taxi-key.01`.

### Bag
MVP introduces a deliberately shallow player bag:
- 20 visible slots;
- only the Taxi Key must be functionally required for this journey;
- no generalized loot/economy requirement;
- Cards remain Almanac objects, not bag duplicates.

Visual button:
- use one source-proven KayKit 3D backpack prop rendered in the Playmation/clay look;
- current valid donor candidates include Orc_Backpack and Hoarder_Backpack;
- exact selected backpack remains **SOURCE_REQUIRED** until isolated visual review.

Clicking the bag icon opens the 20-slot inventory.

## 8 · Beat 5 · Ground → Drive → Ground

With `item.taxi-key.01`:
- `I` at the taxi interaction anchor enters the taxi;
- Race/vehicle owner retains steering/drift/contact/Drive physics;
- WB2 retains world/support truth;
- exit returns to Ground through the central mode handoff.

Golden automated acceptance takes the taxi at least once to prove Ground→Drive→Ground.
Human players remain free to walk the entire route.

## 9 · Beat 6 · Dystopia birthday party

### Scene
Dystopia's first hero encounter combines existing donors:
- Resident Disco;
- Orc Band;
- dancing Skeletons;
- Demon Lord;
- Demon Lord summoning-circle/pentagram anchor;
- current Disco Ball / light hooks where source-clean;
- one canonical audio transport.

Golden signature song:
`demon-afro-strut` · **Demon Lord Afro-Strut 01**
source:
`media/3D_Assets/Sounds/KFB RoadTrip JukeBox v2/Demon Lord Afro-Strut 01.mp3`

Current playlist evidence gives Demon Lord dance pairings:
- `kfb_dance_hip_hop_a`
- `kfb_dance_step_hip_hop_a`
- `kfb_dance_locking_hip_hop_a`

Golden collectible move candidate:
`kfb_dance_hip_hop_a`

The party is a fictional Demon Lord birthday event; it is unrelated to archived personal Birthday production data.

## 10 · Beat 7 · listen reward = song + move

When the Demon Lord song is heard to completion:
- unlock/discover song `demon-afro-strut`;
- unlock dance move `kfb_dance_hip_hop_a`;
- write MomentReceipt / provenance;
- Almanac/Journey entry may link the song and performance.

A visible **KayfaBINGO** applause action at/after the ending is a good optional feedback beat.

MVP requirement:
the unlock state persists.
A generalized dance collection/editor is not required.
If the current animation owner supports a simple emote playback, the collected move may be previewed/played later; otherwise receipt + unlocked reference is sufficient for MVP.

## 11 · Beat 8 · Orc singer sends player to Utopia

`I` on the source-backed Legacy Orc singer/bandleader after the performance:
- ChatterBox uses Dystopia/Card/deck semantic bias;
- absurd handoff along the line “too dark here?” / Ignore Dystopia;
- Orc receives/acknowledges the Doomsday Clock courier Card;
- player receives:

**forget_utopia:1 · The Glossy Horizon**

Task:
bring it to the CEO of **Utopia Inc.**

Golden target:
Monstrosity as the Tech-Bro CEO / “king” of Utopia.

No new Orc dialogue runtime; use the same ChatterBox/Triplet seam.

## 12 · Beat 9 · Utopia ambient life

Utopia should read as active before dialogue.

Required scene grammar:
- Robot A + Robot B;
- both available color variants where current source supports them;
- robots visibly building/repairing;
- Combat Mech patrol with Gatling presentation;
- Monstrosity CEO seated on a stepped pyramid/throne;
- CEO visually oversees the work of the transhumanist/cyborg population.

Ownership:
- these are Resident/activity scenelets;
- ambient Combat Mech patrol is not the player Flight owner;
- no Combat owner is created merely because a Gatling gun is visible.

Performance fallback:
optional duplicate color variants or one ambient patrol actor may be quarantined if they break the core journey, but Utopia must still read as a busy engineered world.

## 13 · Beat 10 · Monstrosity CEO / Terms & Conditions

`I` on Monstrosity:
- ChatterBox uses Utopia / Forget Utopia knowledge bias;
- CEO pressures the player to accept Utopia Inc. Terms & Conditions;
- Faust-like bargain framing is allowed as public-domain cultural reference;
- four short social-call choices remain available.

Golden branch:
**KayfaBONGO** = refuse/decline in this local conversation branch.

Important:
this local branch does not redefine KayfaBONGO's global tabletop meaning.

On Golden refusal:
- CEO becomes annoyed;
- gives the player:

**embrace_protopia:1 · The Open Notebook**

- orders the player to leave Utopia and inspect the supposedly miserable, inconvenient Farmer life on Protopia;
- leaves open the comic possibility of returning later to “accept the terms after all.”

Other response buttons may provide short flavor and return to the choice.
They must not dead-end the open world.

## 14 · Beat 11 · Protopia Farmers / third-way explanation

At the Protopia farm/social core:
- male + female Farmer are both present;
- the interaction can behave as a two-speaker Resident set / Duo rather than two independent tutorial walls.

`I`:
- short ChatterBox conversation;
- uses Protopia / Embrace Protopia knowledge bias;
- explains through concrete local activity rather than a lecture:
  repair, farming, visible seams, local skills, iterative improvement.

Golden `KayfaBINGO` branch:
player receives:

**anti_rules_toolkit:1 · The Rules Lawyer**

Task:
bring it to the Lorekeeper.

This reuses an existing KFB direction: Anti-Rules is already intended as onboarding/tutorial material.
No new deck is invented.

## 15 · Beat 12 · Lorekeeper / optional deep onboarding

Lorekeeper lives on the separate Protopia plateau/lectern anchor.

On delivery of `anti_rules_toolkit:1`:
- courier thread resolves;
- Lorekeeper gives the next layer of onboarding;
- player can leave after a short exchange.

If the player selects **KayfaBOGGLE**:
Lorekeeper may explain, in short optional branches:
- the different worlds/decks;
- why Cards recur as evidence/encounter seeds;
- the **Infinite Canvas of the Tenth Art**;
- the Fractal Almanac;
- why collecting/recombining Cards matters.

Do not front-load all of this before BOGGLE.
Optional explanation is the reward for asking.

### Explicitly later / not MVP-blocking
The Lorekeeper may foreshadow but does not require implementation of:
- Actor Card;
- three collected Scene Cards;
- King's Quest Card;
- Kayfabulation mini-game;
- dice progress;
- OPO score;
- broader reputation/progression/level system.

Existing KFB progression canon must be reconciled before a visible “level” mechanic is locked.

## 16 · Beat 13 · four large world Billboards

Each world has one large signature MediaSurface/Billboard.

Initial shape:
- common `iphone-landscape` aspect profile;
- exact numeric aspect is DERIVED by the Media/Billboard owner rather than copied ad hoc.

### Town
Starts with the canonical KFB standard Card backside / wordmark surface, then becomes a seeded HyperNormalisation loop.

### Dystopia
Starts with the Dystopia deck cover, then seeded HyperNormalisation loop.

### Utopia
Starts with the Utopia deck cover, then seeded HyperNormalisation loop.

### Protopia
Starts with the Protopia deck cover, then seeded HyperNormalisation loop.

Loop grammar may consume:
- deck/world seed;
- world palette;
- Card motifs;
- biome colors;
- current world/event context.

Reuse:
- accepted Billboard/MediaSurface owner;
- prepared B2b A+ CanvasTexture / mixed-hypernormalisation direction where compatible;
- Playmation/Clay shell through the current look owner.

No separate media DB and no private Billboard world runtime.

## 17 · Beat 14 · ChatterBox rule for every interaction

All Golden Journey dialogue uses one ChatterBox lineage.

Every encounter combines:
1. immediate visible/local situation;
2. current canonical Card(s);
3. Resident signature Cards;
4. primary deck/world knowledge;
5. Resident personality/role;
6. relationship / Lean Memory;
7. local history.

Triplet roles remain:
**SHOW IT → SPIN IT → SELL IT**
or
**Subject → Connector → Reframe**.

The same framework drives:
- Clown onboarding;
- Driver key exchange;
- Orc singer handoff;
- Monstrosity Terms conversation;
- Farmer Duo;
- Lorekeeper deep onboarding.

No bespoke dialog tree engine per Resident.

## 18 · Pacing rule

This journey contains several conversations but should not feel like a tutorial tunnel.

Default dialogue budget:
- Clown: short onboarding;
- Driver: very short optional vehicle unlock;
- Orc singer: short handoff;
- Monstrosity: one comic negotiation;
- Farmers: one short explanatory Duo;
- Lorekeeper: short by default, deeper only on BOGGLE.

Speech/TTS is interruptible/skippable.
World movement remains available between beats.

## 19 · Open-world rule

The Golden Journey is **suggested, not enforced**.

If a player reaches an island “early”:
- the island remains explorable;
- Residents can use ambient/deck-biased ChatterBox;
- courier-specific reward/handoff waits for the relevant quest/Card state;
- no invisible wall or arbitrary teleport is added to force order.

Vehicle ownership is also optional:
- taxi accelerates travel and proves Drive;
- walking remains a valid route.

## 20 · Lean Memory / save requirements created by this journey

At minimum persist:
- curtain intro complete;
- Clown met;
- `ignore_dystopia:1` provenance;
- taxi key owned;
- Driver met;
- taxi Drive state when needed for resume safety;
- Dystopia party visited;
- Demon Lord song heard-complete;
- song unlocked;
- dance move unlocked;
- Orc singer encounter / Dystopia Card delivered;
- `forget_utopia:1` provenance;
- Monstrosity encounter / Golden response branch;
- `embrace_protopia:1` provenance;
- Farmer encounter;
- `anti_rules_toolkit:1` provenance;
- Lorekeeper encounter / BOGGLE detail state where relevant;
- current world + safe return anchor;
- Almanac collection/provenance;
- Resident social/encounter refs.

Fresh import must reconstruct these without ChatGPT conversation memory.

## 21 · What this Golden Journey proves

One coherent run can prove:
- real loading/entry presentation;
- real Town spawn and FOV composition;
- Clown Resident activity;
- Bubble + browser TTS + ChatterBox;
- canonical Social Call UI;
- canonical Card transfer/provenance;
- Fractal Almanac;
- Ground locomotion;
- Track distance/traversability;
- optional foot-assist zones;
- Driver Resident;
- minimal player bag/key state;
- Ground→Drive→Ground;
- taxi source integration;
- world/biome transitions;
- Orc Band;
- Resident Disco;
- Demon Lord + summoning-circle scene;
- Jukebox/song completion;
- dance unlock;
- Dystopia/Utopia/Protopia Resident world-knowledge bias;
- robot/mech ambient activity;
- Farmer Duo;
- Lorekeeper optional deeper onboarding;
- Billboards/HyperNormalisation;
- Lean Memory export/import.

That makes it a strong MVP acceptance journey because most systems are exercised through one readable story instead of separate debug pages.

## 22 · Required vs quarantinable

### REQUIRED_CORE
- Curtain entry seam;
- Town spawn;
- Clown + first Card;
- Ground locomotion;
- walkable Track route;
- Driver + Taxi Key;
- Taxi Drive;
- Dystopia party destination;
- Orc handoff;
- Utopia CEO handoff;
- Protopia Farmers;
- Lorekeeper;
- four canonical Card identities;
- save/export/import;
- Almanac provenance.

### REQUIRED_PRESENTATION
- Clown juggling;
- speech bubble progressive text;
- browser TTS on target browser with text fallback;
- Dystopia music/performance;
- four signature billboards;
- distinct biome/light/audio contexts.

### OPTIONAL_QUARANTINABLE
- individual extra Robot color instance if performance/source fails;
- Combat Mech patrol if its ambient loop is not source-clean;
- fancy foot stunt assist beyond basic traversability;
- dance-move playback UI beyond persisted unlock;
- non-essential party FX;
- advanced HyperNormalisation layers.

### DEFERRED
- general inventory economy;
- full combat;
- full flight;
- King's Quest / Kayfabulation game;
- OPO/reputation/level system;
- full open-ended NPC society;
- generalized dance collection editor.

## 23 · One-Shot acceptance fixture direction

The machine-readable companion file:
`GOLDEN_JOURNEY_MVP_2026-10-04.json`

must become the future browser/integration fixture.

Important:
the test consumes the product journey.
The test must not create a parallel debug-only flow.

## 24 · Current source gaps / follow-up locks

Before final One-Shot integration:
- Theatre Curtain final visual/physics state still needs closure;
- exact clay BLÖDSINN!/Enter plaque needs authoring/source proof;
- exact 3D backpack donor must be selected from source-proven candidates;
- canonical Jukebox must absorb current Demon Lord / Disco inventory;
- current Player native locomotion is still PREPARED FOR BLENDER / NOT RUN;
- Resident-set seam is still unproven in WB2;
- multi-island corridor is still unproven on the clean convergence base;
- Site Stage/persistence backend remains architecture, not implementation.

These are already represented by the current pre-One-Shot gates. Do not create parallel substitutes.
