# KayKit Creator Lessons · Living Research for KFB

**Status:** CURRENT RESEARCH · ADDITIVE · v0.1  
**Date:** 2026-09-19  
**Owner:** KFB Game Dev Studio  
**Source-of-truth boundary:** canonical asset identity/provenance stays with Asset Registry / Asset Librarian; rig/look authoring stays with ToolBox / FrankenStein / Animation owners; runtime state, physics and gameplay stay with the named consumer.  
**Primary consumer references:** Asset Librarian, KFB Modular Mini-Game/Baukasten workflow, ToolBox/FrankenStein, Animation, Race/Travel/Combat consumers.  
**Working branch:** `chatgpt-web/kaykit-creator-learning-2026-09-19`  
**Named public owner route:** https://kayfabizarro.pages.dev/kfb-hub/free-roam/game-dev-studio/  
**Public-state note:** this v0.1 is a GitHub research/documentation slice. The existing Game Dev Studio route is named for ownership/recovery only; no new public deployment is claimed by this document.

---

## 0 · Why this document exists

This is the accumulating KFB interpretation of creator-authored KayKit videos, demos and official pack documentation.

It is **not**:
- a second Asset Registry;
- a second animation system;
- a Godot migration plan;
- permission to rebuild working KFB owners;
- proof that a source asset works in a named KFB runtime.

It answers a narrower question:

> What does Kay Lousberg's own workflow reveal about the intended structure, compatibility, variation, rigging, animation, modularity and production grammar of KayKit — and which of those principles can KFB use immediately, even before Godot is involved?

### Evidence labels

- **CREATOR-OBSERVED** — directly visible/described in a Kay Lousberg video or official KayKit page.
- **KFB-INFERENCE** — reasoned consequence for KFB; not claimed as a KayKit specification.
- **KFB-PROPOSAL** — useful next implementation, not yet accepted/implemented.
- **KFB-DECISION** — already established KFB owner/workflow rule.
- **OPEN** — needs source inspection, runtime proof or Georg review.

---

# 1 · Source pass 01 — Using KayKit Characters In Godot (Detailed version)

**Primary video:**  
https://www.youtube.com/watch?v=4p7QaOd8SHE

**Creator title:** `Using KayKit Characters In Godot (Detailed version)`  
**Published:** 2025-10-27  
**Duration:** ~46:20

**Official current companion page:**  
https://kaylousberg.itch.io/kaykit-character-animations

The official Character Animations page links both the short and detailed tutorials and states that the current animation pack is organized by animation set/category and rig type, with `Rig_Medium` and `Rig_Large` as distinct families.

## 1.1 · What the video's structure tells us before any engine details

The chapters move through a coherent production stack:

1. import and orientation/material cleanup;
2. animation import and reusable animation library;
3. adding more character/rig families;
4. weapons and accessories through bone attachments;
5. local placement/calibration of attachments;
6. additional animation sets;
7. alternate textures and material extraction;
8. pick-and-choose / character combination;
9. material behavior such as culling;
10. state machines and transition timing;
11. external animation retargeting;
12. a mannequin/neutral validation character.

That order is more valuable to KFB than the Godot button clicks. It reveals that KayKit is designed as **composable data with compatibility contracts**, not as a collection of indivisible finished characters.

---

## 1.2 · Core lesson A — a KayKit character is not one thing

### CREATOR-OBSERVED

The detailed video explicitly distinguishes:
- character models;
- rig families;
- animation libraries;
- accessories/weapons;
- materials/textures;
- state-machine use;
- retargeted external animation.

The current official animation pack likewise separates animation sets by category and by `Rig_Medium` / `Rig_Large`.

### KFB-INFERENCE

Our useful atomic unit is therefore not:

`character.glb`

but something closer to:

```text
CharacterSource
+ RigProfile
+ MaterialStyle
+ AttachmentProfile[]
+ AnimationLibraryRef[]
+ optional RetargetProfile
+ ConsumerStateMap
```

The last item belongs to the consumer. The package should supply facts; it must not become a second locomotion/combat controller.

### Direct KFB application

**Asset Librarian**
- expose `rigFamily` as a first-class fact;
- distinguish model identity from texture/material variants;
- group animation sets by compatible rig family;
- mark current vs legacy character standard.

**Game Dev Studio**
- package and preview the composition;
- show the original character in isolation before composed/grafted previews;
- show accessory/weapon donors in isolation before attachment;
- report source-derived socket/rig facts separately from consumer behavior.

**ToolBox / FrankenStein / Animation**
- consume shared rig/socket/animation facts rather than rediscovering them per character.

---

## 1.3 · Core lesson B — animation library and actor identity are deliberately separate

### CREATOR-OBSERVED

The tutorial creates/imports a reusable animation library, expands it with additional sets and later demonstrates those animations on additional compatible characters.

The official pack currently lists categories such as:
- General;
- Movement;
- Melee combat;
- Ranged combat;
- Simulation/emotes;
- Special;
- Tool animations.

It is explicitly designed so consumers can pick only the animation sets they need.

### KFB-INFERENCE

This maps cleanly to KFB's existing principle that one runtime owner should choose behavior while packages expose reusable capabilities.

A KFB package should not say only:

`animations: true`

It should be able to say:

```text
rigFamily: Rig_Medium
animationSets:
  movement/basic
  general/interact
  ranged/two_hand
  tool/hammer
consumerMapping:
  not owned here
```

### Direct KFB application

1. **Catalog by capability**, not just clip filename.
2. **Load/ship only needed sets** for a mini-game or resident.
3. Give Animation/ToolBox a reusable `AnimationMap` that is actor-independent where rig compatibility allows it.
4. Let Combat/Race/Travel translate their own state to the package's animation tags.
5. Never infer a gameplay state from the existence of a clip.

---

## 1.4 · Core lesson C — Rig_Medium vs Rig_Large is a real compatibility boundary

### CREATOR-OBSERVED

The tutorial has a specific `Rig_Large` section. The official current animation pack publishes separate animation variants for `Rig_Medium` and `Rig_Large`.

The current Mystery Series 6 changelog even records a rig-name correction from `Rig` to `Rig_Large` for one character, which shows that rig naming is operational metadata, not decorative labeling.

### KFB-INFERENCE

KFB should stop treating “KayKit humanoid” as one undifferentiated compatibility class.

### Direct KFB application

Add/derive these facts when source evidence permits:

```json
{
  "compatibilityEra": "current-series4-plus",
  "rigFamily": "Rig_Medium | Rig_Large | other | unknown",
  "skeletonSignature": "source-derived-id-or-hash",
  "animationCompatibility": ["..."],
  "evidence": "source path / inspection"
}
```

**OPEN:** decide whether `skeletonSignature` should be a bone-name/order digest, a more semantic mapping, or both. Do not invent it from filenames.

---

## 1.5 · Core lesson D — weapon/accessory attachment is socket data, not mesh surgery

### CREATOR-OBSERVED

The tutorial adds weapons/accessories through a bone-attachment workflow, including separate positioning/calibration and a distinct ranged-weapon section.

### KFB-INFERENCE

This strongly supports the architecture already used by KFB's ToolBox/FrankenStein/attachment work:

```text
source accessory
→ named skeleton/bone target
→ local transform calibration
→ optional stance/animation compatibility
→ consumer test
```

An attachment is therefore not proven by “it loads on the character”.

### Direct KFB application

For every reusable weapon/prop attachment, record:

- exact donor source;
- compatible `rigFamily`;
- target semantic socket/bone;
- local translation / rotation / scale;
- handedness;
- visibility/culling caveats;
- compatible animation/stance family;
- isolated donor proof;
- composed preview proof;
- named consumer proof separately.

This is directly applicable to:
- Fantasy Weapons Bits;
- RPG Tools Bits;
- Platformer held props where relevant;
- resident props;
- Combat visual adapters;
- vehicle/actor expressive attachments where an owner explicitly accepts them.

---

## 1.6 · Core lesson E — accessory calibration is part of the asset contract

### CREATOR-OBSERVED

The tutorial includes a separate step for positioning accessories after the bone attachment exists.

### KFB-INFERENCE

A socket name alone is insufficient. Two assets can bind to the same hand bone and still be visibly wrong.

### Direct KFB application

Promote `AttachmentProfile` from an ad-hoc transform to named data:

```text
AttachmentProfile
  donorRef
  rigFamily
  targetSocket
  localPosition
  localRotation
  localScale
  handedness
  stanceTags[]
  evidenceStatus
```

This should remain additive to existing ToolBox/FrankenStein contracts, not replace them.

---

## 1.7 · Core lesson F — materials/textures are a variation system, not a reason to duplicate geometry

### CREATOR-OBSERVED

The tutorial covers:
- external materials;
- material consolidation;
- alternate textures;
- material extraction;
- texture swapping;
- material settings and cull modes.

### KFB-INFERENCE

For KFB, visual variation should usually be expressed as a recipe/reference:

```text
same geometry
+ material family
+ approved texture/palette variant
```

rather than multiple unrelated “new” assets.

### Direct KFB application

**Asset Librarian**
- group recolors/texture alternatives under a semantic family;
- record `materialFamily` / `atlasFamily`;
- distinguish geometry variants from pure appearance variants.

**Game Dev Studio**
- add a material/texture variant switch to a package preview when the source supports it;
- never imply that a recolor is a separate canonical geometry donor.

**KFB visual direction**
- KFB anthracite/rust treatment should be a controlled style/material layer where appropriate, not destructive recoloring of every KayKit source.
- source identity must stay inspectable.

---

## 1.8 · Core lesson G — “pick and choose” + “combining characters” argues for recipes

### CREATOR-OBSERVED

The video explicitly demonstrates selecting/combining character pieces and swapping textures.

### KFB-INFERENCE

This is the strongest creator-side validation yet for the general FrankenStein approach, but with an important constraint:

> Frankensteining should be **proven component composition**, not arbitrary visual mashup.

### Direct KFB application

A KFB `CharacterRecipe` can remain non-destructive:

```text
baseCharacterRef
rigProfileRef
componentRefs[]
materialVariantRefs[]
attachmentProfileRefs[]
animationLibraryRefs[]
```

Every source object remains traceable and previewable independently.

This directly reinforces the anti-slop rule:
**loaded URL is not donor proof; show the source object in isolation first.**

---

## 1.9 · Core lesson H — material culling is a small setting with large visual consequences

### CREATOR-OBSERVED

The tutorial calls out material settings and cull modes rather than assuming import defaults are correct.

### KFB-INFERENCE

Thin planes, capes, paper/card props, signs, foliage and some accessories can fail visually even when geometry and transforms are “correct”.

### Direct KFB application

Add a small visual QA field where relevant:

```text
surfacePolicy:
  cull: source-default | double-sided-required | tested-one-sided
  transparency: ...
  notes: ...
```

Do not globally force double-sided materials as a blanket repair.

---

## 1.10 · Core lesson I — animation state is consumer logic; animation data is package logic

### CREATOR-OBSERVED

The video has distinct sections for state machines, animation transitions, in-game use and animation timing.

### KFB-INFERENCE

This separation is crucial for current KFB ownership:

- animation package supplies clips/tags/timing facts;
- Animation tooling previews/calibrates;
- Combat/Travel/Race/other consumer owns the runtime state machine;
- physics/contact remains with that consumer;
- Game Dev Studio does not become another actor controller.

### Direct KFB application

A package can expose a **recommended semantic map** without owning state:

```text
idle      -> movement/idle
locomote  -> movement/run
air       -> movement/jump
interact  -> general/interact
attack    -> melee/... or ranged/...
```

The receiving runtime chooses whether/when those states occur.

---

## 1.11 · Core lesson J — transition timing and event timing need to be data

### CREATOR-OBSERVED

The video explicitly revisits animation timing after state-machine/in-game setup.

### KFB-INFERENCE

Clip name and duration are not enough for:
- foot contact;
- attack release;
- muzzle/arrow release;
- tool impact;
- interaction handoff;
- transition windows.

### Direct KFB application

Where the source or measured playback proves it, add optional semantic markers:

```text
AnimationClipFact
  clipRef
  duration
  loop
  locomotionClass
  eventMarkers[]
  transitionHints[]
  evidence
```

No marker should be guessed from an animation name.

---

## 1.12 · Core lesson K — retargeting is a staged compatibility pipeline

### CREATOR-OBSERVED

The detailed tutorial sequence is:
1. add external animations;
2. retarget the rig;
3. retarget the animations;
4. create/use a new animation library;
5. test KayKit animations on the retargeted rig;
6. inspect a mannequin/neutral character.

The official pack also warns that non-KayKit retargeting can work but may not look good automatically because the animations were authored for KayKit bodies.

### KFB-INFERENCE

KFB should make retargeting evidence explicit instead of labeling something merely `compatible`.

### Direct KFB application

Use a staged `RetargetProfile`:

```text
sourceRig
targetRig
boneMap
orientation/scale normalization
clipSet
mechanical validation
visual validation
known failures
consumer acceptance
```

Status ladder:

```text
SOURCE_MAPPED
→ RETARGETED
→ PREVIEW_PASS
→ CHARACTER_VISUAL_PASS
→ CONSUMER_PASS
→ GEORG_ACCEPTED
```

A successful mapping does not equal good motion.

---

## 1.13 · Core lesson L — the mannequin is an excellent neutral test donor

### CREATOR-OBSERVED

The final tutorial section uses a mannequin character in the retargeting/animation context.

### KFB-INFERENCE

KFB can use a neutral validation actor to answer:
- Does the skeleton/clip technically work?
- Is the failure in the clip/retarget map or in this character's proportions/mesh?
- Does the socket basis behave consistently?

### KFB-PROPOSAL

Create an **engine-neutral KayKit Rig Bench** in the existing Game Dev Studio / ToolBox preview lane:
- Rig_Medium mannequin/reference;
- Rig_Large mannequin/reference;
- clip selector by category;
- skeleton/socket overlay;
- accessory attachment preview;
- exact source refs;
- no locomotion/gameplay ownership.

This can be built in browser/Three.js before any Godot integration.

---

# 2 · What we can implement before Godot

The detailed tutorial gives enough structure to improve KFB now.

## 2.1 · Asset Librarian metadata

**KFB-PROPOSAL · no schema migration performed in this slice**

Candidate fields:

```text
compatibilityEra
semanticFamily
variantOf
variantType: geometry | color | texture | separate-part
rigFamily
skeletonSignature
materialFamily
atlasFamily
sourceTier: runtime | extra | source
legacyStatus
animationSetCategories[]
attachmentCandidates[]
```

Important:
- derive only where source evidence exists;
- preserve `unknown`;
- do not infer compatibility from matching names.

## 2.2 · Game Dev Studio package facts

Additive package-facing concepts:

```text
RigProfile
MaterialStyle
AttachmentProfile
AnimationLibraryRef
RetargetProfile
```

These describe/preview assets. They do not take over runtime control.

## 2.3 · ToolBox / FrankenStein

Immediate useful normalization:
- semantic sockets;
- per-accessory local transforms;
- handedness;
- rig-family compatibility;
- isolated donor preview;
- composed preview;
- visual QA status.

## 2.4 · Animation tooling

Immediate useful normalization:
- category-based animation inventory;
- clip timing;
- loop/non-loop;
- rig-family compatibility;
- retarget mapping;
- mannequin validation;
- semantic event markers only when measured/proven.

## 2.5 · Baukasten / Mini-game catalog

Collapse raw file variants into meaningful families.

Example:

```text
button
  geometry family
  blue/red/green/yellow appearance variants
  measured dimensions/pivot/contact
  visual state possibilities
  KFB interaction behavior: NOT OWNED BY ASSET
```

That prevents a recolor-heavy pack from looking like hundreds of unrelated design decisions.

---

# 3 · Direct relevance to the KayKit Platformer HUD / switches / levers work

Official current Platformer Pack:
https://kaylousberg.itch.io/kaykit-platformer

The official pack describes:
- 120 unique assets / 370 models including recolors in the free set;
- floors, walls, ramps, barriers, platforms and pipes;
- gameplay-oriented hoops, goals, buttons and switches;
- four-color variants on many pieces;
- additional traps/conveyors/bumpers/chests/cannon/etc. in the EXTRA tier;
- one shared gradient atlas.

## KFB consequence

For the current KFB HUD / machinery direction, the right reuse model is:

```text
exact KayKit source mesh
→ isolated source preview
→ measured pivot/axis/contact
→ KFB material/style layer if requested
→ KFB interaction rig/animation module
→ composed control panel / HUD object
```

Not:

```text
look at screenshot
→ remodel a vaguely similar switch/button
```

### Interaction ownership

A KayKit button/switch/lever provides the **visual/mechanical donor**.

KFB may add:
- pressed travel;
- toggle angle;
- slider axis;
- spring return;
- indicator state;
- sound/event hooks.

But those behaviors are KFB modules and must not be falsely attributed to the original model unless the source actually contains such animation/rig data.

### Family model

Color variants should normally become:

`same semantic control + appearance variant`

rather than four separate control definitions.

---

# 4 · Current-character compatibility era: Series 4+ matters

Current Mystery Series 6:
https://kaylousberg.itch.io/kaykit-series-6

### CREATOR-OBSERVED

Kay states that:
- Series 1–3 are legacy format;
- Series 4 onward use the new standard and are compatible with current KayKit packs;
- Series 6 characters are technically identical to the free Adventurer character standard;
- Series 6 includes the Lorekeeper;
- characters have alternative textures and .blend sources;
- the pack is rigged/animated and uses the current Character Animations.

### KFB consequence

The Lorekeeper should not be maintained as an isolated one-off technical species.

It should be a **proven instance of the current KayKit character standard**.

That suggests a high-value later test:

```text
prove one Rig_Medium current-standard profile
→ validate Lorekeeper
→ validate one second Series 6 / Adventurer donor
→ only then generalize
```

Do not batch-declare all characters compatible from documentation alone.

---

# 5 · Current-vs-legacy is a first-class Librarian fact

Kay's catalog explicitly separates legacy content and recommends updated/remade packs instead.

The older Dungeon Pack page itself points users to the remastered/current pack and says the old one will no longer be updated.

Current Dungeon Pack:
https://kaylousberg.itch.io/kaykit-dungeon-pack

### KFB consequence

Asset presence is not enough.

The Librarian should be able to expose:

```text
generation: current | legacy
successorRef
updateStatus
compatibilityEra
```

This is especially important when old and new KayKit packs coexist in Git history.

---

# 6 · Modular pack grammar from current Dungeon + Hex packs

## Dungeon

The current Dungeon Pack describes:
- walls / floors / stairs / doors;
- props/furniture/traps;
- modular design explicitly intended for level building;
- a shared gradient atlas;
- alternative textures in higher tiers.

## Medieval Hexagon

Official page:
https://kaylousberg.itch.io/kaykit-medieval-hexagon

It describes:
- hex road/river/ocean/coast tiles;
- buildings;
- nature props;
- units;
- four-color building variants;
- alternative textures for different biomes/seasons;
- shared gradient atlas.

### KFB consequence

Two separate axes must stay separate in the catalog:

1. **topological role**
   - floor / wall / stair / door / road / coast / building / prop / unit

2. **visual variant**
   - faction color / texture / biome / season / KFB-approved material layer

A generator should reason about topology first, appearance second.

This reinforces the existing C0/Baukasten rule:
**first prove a single measured connection, then generate.**

---

# 7 · Source pass 02 — Quick version

Officially linked tutorial:
https://www.youtube.com/watch?v=sp_1WnJUDXM

**Role for KFB:** not a second conceptual source. Treat it as the creator's short **golden path**.

### KFB-PROPOSAL

When we eventually build a KayKit Rig Bench or import helper, use the quick-version workflow as a compact regression target:

```text
source character
→ current material
→ compatible animation set
→ one attachment
→ visible playback
```

The detailed tutorial remains the source for edge cases/retargeting/composition.

---

# 8 · Source pass 03 — KayKit Live Show / Mixed Bag 1

Official creator recap:
https://www.patreon.com/posts/updates-recap-169539427

Official resulting pack:
https://kaylousberg.itch.io/mixed-bag-1

Kay reports that Live Show Episodes 0–4 filled a shelf of **24 viewer requests**, which became Mixed Bag 1.

Two currently indexed VODs:
- Episode 2 — https://www.youtube.com/watch?v=JYtajxGwC4M
- Episode 3 — https://www.youtube.com/watch?v=vA9TR7MU0jM

The channel currently exposes the five Live Show VODs; exact URLs for Episodes 0/1/4 should be pinned in a later source pass rather than guessed.

## 8.1 · Lesson — request count is not model count

### CREATOR-OBSERVED

Mixed Bag 1 began with 24 requests. Some requests needed accessories/minor variations, resulting in 50+ models; the EXTRA tier reports 59 models.

### KFB-INFERENCE

This is strong evidence for a catalog hierarchy:

```text
Request / semantic asset
→ family
→ core geometry
→ variants
→ accessories / separate parts
```

Raw GLTF/GLB count is a storage fact, not a design-language fact.

## 8.2 · Lesson — style cohesion comes from shared grammar, not thematic sameness

The request list is intentionally eclectic: circus tent, fire hydrant, skateboard, idols, plush toy, taco, stove, machine, bicycle, tool cart, comic boxes and more.

Yet the released pack remains a coherent KayKit pack.

### KFB-INFERENCE

This is directly relevant to KFB's surreal “Frankensteining”:

A mixed object vocabulary can still look coherent if we preserve:
- shape-language constraints;
- low-poly density;
- material/atlas family;
- proportion grammar;
- readable silhouettes;
- disciplined variant system.

Therefore “KFB style” should not mean indiscriminate recoloring or extra chrome.

## 8.3 · Lesson — one gradient atlas is a production strategy

Mixed Bag 1 and several current KayKit packs explicitly use a single gradient atlas, with downsampling options.

### KFB consequence

Add `atlasFamily` / `materialFamily` to catalog reasoning.

Potential benefits:
- predictable visual cohesion;
- easier batched material substitution;
- fewer accidental material duplicates;
- clearer KFB material override policy;
- easier preview comparison.

Actual draw-call/performance claims must be measured in the consumer; do not infer them solely from “one atlas”.

## 8.4 · Lesson — source tier and runtime tier are different artifacts

Kay distributes runtime formats (.GLTF/.FBX/.OBJ depending on pack) and separately provides .blend source in SOURCE tiers.

### KFB consequence

The Librarian/Game Dev Studio should distinguish:
- canonical runtime source;
- authoring source;
- explicit derived runtime artifact;
- KFB recipe/metadata.

Do not require Blender just to use a pack whose runtime artifact is already adequate.

---

# 9 · Creator workflow lesson — pack boundaries are functional

In the September 2026 creator update, Kay describes the planned Medieval Village theme as three packs:

1. Exteriors;
2. Interiors;
3. Villager characters.

The exterior scenes also reuse existing Forest Nature trees/rocks.

### KFB-INFERENCE

This is highly relevant to our “equivalent to Dungeon Generator with all KayKit/Tiny Treat sets” direction.

A useful KFB pack taxonomy is not “everything that can appear in the same screenshot”.

It is closer to:
- structural exterior kit;
- structural interior kit;
- props/scenery kit;
- character/resident kit;
- animation/capability kit;
- interaction module;
- consumer/runtime.

They can compose into one scene while preserving different ownership and rules.

---

# 10 · WATCHLIST — creator environment/lighting tutorial

As of 2026-09-19, Kay's current Patreon update says a Godot environment tutorial is being prepared, covering:
- World Environment / lighting setup;
- daytime scene;
- transforming the same scene to nighttime;
- indoor/dungeon lighting principles.

The creator says it may release this week or the next; it is therefore **not treated as published/analyzed yet**.

### Why KFB should watch it

It is likely directly useful to:
- Race/Travel day/night coherence;
- OSM/Grotesque scene lighting;
- Dungeon interiors;
- shared KayKit material response;
- Tiny Skies / environment integration.

**OPEN:** analyze and append once the actual video is published and source-pinned.

---

# 11 · Recommended KFB data model — proposal only

Do not implement as a second registry. These are candidate fields/extensions for existing owners.

## 11.1 · Asset family

```yaml
semanticFamily:
variantOf:
variantType: geometry | color | texture | separate-part
materialFamily:
atlasFamily:
generation: current | legacy
successorRef:
```

## 11.2 · Rig profile

```yaml
rigFamily:
skeletonSignature:
orientation:
scale:
socketMap:
animationSetCompatibility:
evidence:
```

## 11.3 · Attachment profile

```yaml
donorRef:
rigFamily:
targetSocket:
localPosition:
localRotation:
localScale:
handedness:
stanceTags:
evidenceStatus:
```

## 11.4 · Animation fact

```yaml
clipRef:
category:
rigFamily:
duration:
loop:
eventMarkers:
transitionHints:
retargetStatus:
evidence:
```

## 11.5 · Retarget profile

```yaml
sourceRig:
targetRig:
boneMap:
normalization:
clipSet:
mechanicalStatus:
visualStatus:
knownFailures:
consumerStatus:
```

---

# 12 · Owner routing — where each lesson belongs

| Finding | Existing owner | What that owner may do | What it must not do |
|---|---|---|---|
| current/legacy, family, variant, source facts | Asset Registry / Librarian | discover/group/display source truth | become runtime |
| package recipe + source/derived/QA preview | Game Dev Studio | present package evidence | replace Librarian/rig/runtime |
| sockets, grafts, local attachment calibration | ToolBox / FrankenStein | author/measure composition | own consumer physics |
| clip inventory/retarget/timing preview | Animation owner | calibrate/play/validate motion | own game state |
| state machine / locomotion / attack conditions | named consumer | map runtime facts to clips | rewrite source asset truth |
| Dungeon/Hex/Platformer composition | Baukasten/level owner | place measured modules | create second asset library |
| button/lever/switch behavior | KFB interaction module / consumer | animate semantic control | pretend behavior came from static donor |

---

# 13 · Highest-value KFB follow-up slices

These are **proposals**, not work started by this research slice.

### KCL-A1 · Librarian family/variant proof

Pick one current Platformer family with four recolors plus one Mixed Bag request family with separate pieces.

Prove:
`semantic family → variants → isolated previews → exact files`.

No broad migration.

### KCL-A2 · KayKit Rig Bench

Browser-first neutral proof:
- one Rig_Medium current character;
- one Rig_Large current character;
- neutral/mannequin if source exists;
- one movement set;
- one attachment;
- exact source refs;
- no gameplay controller.

### KCL-A3 · Platformer interactive-donor bench

For the controls relevant to KFB HUD/machinery:
- source button;
- source switch;
- source lever/slider-like candidate if actually present;
- exact pivot/dimensions;
- isolated donor view;
- proposed KFB travel/rotation axis;
- one reversible interaction recipe each.

No homemade replacement mesh where an exact donor exists.

### KCL-A4 · Retarget proof

One external humanoid rig only:
- source rig map;
- one KayKit animation;
- neutral preview;
- character preview;
- failure notes.

No batch claims.

### KCL-A5 · Live Show modeling extraction

Deep-watch Episodes 0–4 and append:
- modeling primitives;
- bevel/edge language;
- origin/pivot habits;
- topology density;
- palette/material method;
- reusable proportional heuristics;
- when one request becomes multiple pieces/variants.

This is the most important next research pass for reproducing **KayKit-compatible new KFB props without learning Blender as an end-user workflow**.

---

# 14 · What this changes in our mental model

Before:

`pack → lots of GLBs → pick one → place it`

Better:

```text
Pack
→ compatibility era
→ semantic families
→ geometry vs appearance variants
→ rig/material/atlas families
→ attachment/animation capabilities
→ isolated source proof
→ measured recipe
→ named consumer
→ runtime/human evidence
```

That model works whether the receiving runtime is Three.js, Godot, another engine, or a future KFB tool.

---

# 15 · Additive changelog

## 2026-09-19 · KCL-001 · Living document established

### USER DIRECTION
Analyze Kay Lousberg's creator videos/how-tos, beginning with `Using KayKit Characters In Godot (Detailed version)`, extract engine-independent lessons for KFB, then maintain the analysis as a GitHub living document.

### SOURCES REVIEWED
- detailed Godot character tutorial;
- official current Character Animations page;
- quick tutorial source;
- current Mystery Series 6 page;
- current Platformer Pack page;
- current Dungeon Pack and legacy predecessor;
- Medieval Hexagon Pack;
- Mixed Bag 1;
- September 2026 creator update / Live Show recap;
- currently indexed Live Show Episode 2 and Episode 3 VODs.

### DECISIONS / ROUTING
- KFB Game Dev Studio owns this research document and package-facing interpretation.
- Asset Librarian remains canonical discovery/source owner.
- ToolBox/FrankenStein/Animation retain rig/attachment/motion ownership.
- named game consumers retain state/physics/gameplay.
- no Godot dependency is introduced.
- no second Registry/runtime is created.

### PRIMARY NEW LESSONS
- rig family is a first-class compatibility fact;
- animation libraries are reusable capability sets, not actor identity;
- sockets require calibrated attachment profiles;
- material/texture variation should not duplicate geometry identity;
- raw file count must be collapsed into semantic family + variants;
- retargeting needs staged evidence;
- a neutral mannequin/rig bench is a valuable validation donor;
- current vs legacy KayKit generation must be visible;
- mixed thematic props can remain coherent through shared geometry/material grammar;
- topological role and appearance variant must stay separate in generators.

### IMPLEMENTATION STATUS
Documentation/research only in v0.1. Proposed schema/tool/runtime changes remain OPEN until separately assigned.

### NEXT RESEARCH GATE
Deep-watch KayKit Live Show Episodes 0–4 and append creator modeling grammar, especially pivots/origins, shape construction, bevels, palette/atlas usage, part splitting and variation decisions.
