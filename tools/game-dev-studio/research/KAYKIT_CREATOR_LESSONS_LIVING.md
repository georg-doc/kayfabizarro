# KayKit Creator Lessons · Living Research for KFB

**Status:** CURRENT RESEARCH · ADDITIVE · v0.2  
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


---

# 16 · Source pass 04 — KayKit - Animations - Overview Set 1

**Creator video:**  
https://www.youtube.com/watch?v=T1KNCtAqJ7A

**Identified title:** `KayKit - Animations - Overview Set 1`  
**Published:** 2024-11-30  
**Duration:** ~6:05  
**Role in this research:** visual animation-catalog evidence, not a state-machine implementation tutorial.

## 16.1 · Why this video matters to KFB

This video and the detailed Godot tutorial answer two different questions:

```text
Overview Set 1
→ what motions exist / how the authored motion vocabulary reads

Detailed Godot tutorial
→ how animation libraries, state machines, transitions and playback timing can be wired
```

For KFB the combination is more useful than either source alone.

The animation overview gives us a **motion vocabulary to classify and measure**. The detailed tutorial gives us the idea that runtime locomotion should not merely hard-switch clips: state transitions, timing and playback speed can be shaped to improve the resulting motion.

This maps directly onto the existing KFB cartoon-animation rule:

```text
start
→ travel
→ stop
→ turn
→ recovery
```

and onto the existing ownership rule:

```text
consumer physics/state
→ semantic motion state
→ Animation owner selects/calibrates clips
→ one host mixer plays/blends them
```

The animation layer must never become a second movement/physics writer.

---

## 16.2 · Current KFB motion inventory is already large enough for a real system

The 2024 overview is an older visual preview. For current implementation facts KFB must use the current source/Registry rather than the old video count.

**CURRENT MAIN SNAPSHOT reviewed:** `3d9ac78bfabcec0c43fc453c124133764221139c`  
**Motion registry:** `registry/resources/v1/motions.jsonl`  
**Registry blob:** `1f266ab2e9e57db63f5596ba83f616872b502909`

Current registered **Rig_Medium KayKit motions: 139 across 8 sets**:

| Set | Count | KFB relevance |
|---|---:|---|
| `MovementBasic` | 11 | Walk / Run / Jump foundation |
| `MovementAdvanced` | 13 | dodge, strafe, crouch, sneak, crawl, backwards, equipped running |
| `General` | 15 | idle, hit, death, spawn, interact, pickup, throw, use |
| `CombatMelee` | 22 | stance, attacks, block, hit, unarmed |
| `CombatRanged` | 20 | aim, shoot, reload, bow, magic |
| `Simulation` | 14 | sit, lie, wave, cheer, exercise |
| `Special` | 15 | skeleton / special-state family |
| `Tools` | 29 | chop, dig, fish, hammer, hold, lockpick, pickaxe, saw, work |

This is already enough to stop treating animation as a flat dropdown of clips.

It should become a **measured semantic motion graph**.

---

## 16.3 · Critical correction — KFB currently has no explicit source Sprint clip

The current Rig_Medium registry contains:

```text
Walking_A
Walking_B
Walking_C
Running_A
Running_B
```

but no clip named `Sprint`.

Therefore:

```text
Walk → Run → Sprint
```

is a useful **KFB locomotion state graph**, but `Sprint` is not currently a proven KayKit source-animation identity.

A future sprint may be:

1. a newly sourced real KayKit clip;
2. a deliberately derived KFB locomotion profile from a measured Running clip;
3. a consumer-specific faster state with another approved donor.

Until proved, do not write `KayKit Sprint`.

Likewise, the letters A/B/C do not prove a speed hierarchy. `Walking_A`, `Walking_B`, `Walking_C`, `Running_A`, `Running_B` must be visually and kinetically measured before assigning them slow/normal/fast roles.

---

## 16.4 · The key locomotion insight — synchronize **phase**, not only state

A naive state machine does this:

```text
speed crosses threshold
→ stop Walk
→ start Run at frame 0
→ crossfade
```

That can still produce:
- foot sliding;
- double steps;
- apparent foot teleportation;
- hip pops;
- left/right cadence flips;
- a visually soft but mechanically wrong crossfade.

The better target is:

```text
actual player speed / acceleration
→ choose locomotion state
→ identify source gait phase
→ enter target clip at compatible gait phase
→ short crossfade
→ optional temporary playback warp
→ settle target clip at reference cadence
```

### KFB-INFERENCE · locomotion phase

For cyclical locomotion, normalized clip time alone is useful but not sufficient.

The stronger semantic phase model is:

```text
LEFT_CONTACT
LEFT_SUPPORT
PASSING
RIGHT_CONTACT
RIGHT_SUPPORT
PASSING
```

At minimum, measure:
- left foot contact;
- right foot contact;
- approximate planted interval;
- cycle duration.

Then a transition can prefer:

```text
Walk left-contact
→ Run left-contact
```

rather than:

```text
Walk 63%
→ Run 0%
```

This is the KFB route toward genuinely smooth Walk → Run changes without hiding mistakes in a long blend.

---

## 16.5 · TimeScale should follow speed — within a measured visual range

The first detailed tutorial's state-machine/timing work points to an important runtime control: animation playback rate does not have to be fixed.

KFB already has an existing browser-side donor pattern in Town code that maps movement speed to `AnimationAction.timeScale`. That proves the mechanism is not Godot-specific.

Three.js itself supports per-action:
- `timeScale`;
- `setEffectiveTimeScale()`;
- `crossFadeTo()` / `crossFadeFrom()`;
- optional fade warping;
- `syncWith()`;
- `warp()`;
- `halt()`.

### KFB-PROPOSAL

For a measured locomotion clip:

```text
referenceSpeed = world speed at which feet look planted at playbackRate 1.0

targetPlaybackRate ≈ actualSpeed / referenceSpeed
```

then clamp to a **human-approved range**.

Example concept only:

```text
Walking_A
referenceSpeed = measured, not guessed
approvedRateRange = measured, not guessed

actualSpeed 1.1 × referenceSpeed
→ playbackRate about 1.1
```

Do not stretch one clip across the full walking/running range.

At some point a different gait must take over.

### Why an upper clamp matters

Excessive playback speed:
- destroys weight;
- makes arms/legs buzz;
- compresses anticipation/recovery;
- can make a heavy character read as weightless;
- does not solve stride-length mismatch.

So TimeScale is a **local cadence correction**, not a replacement for a good locomotion set.

---

## 16.6 · Walk → Run should use hysteresis, not one threshold

A single threshold can flap:

```text
3.99 → Walk
4.01 → Run
3.98 → Walk
4.02 → Run
```

That is especially visible when analog input, slopes or physics cause small speed fluctuations.

### KFB-PROPOSAL

Use separate enter/exit thresholds:

```text
WALK → RUN only above runEnter
RUN → WALK only below runExit
runExit < runEnter
```

This **hysteresis** creates a stable band.

The animation state still consumes consumer-owned speed. It does not set player velocity.

---

## 16.7 · Transition duration should depend on the kind of transition

One global crossfade time is not enough.

Examples:

```text
Walk ↔ Run
short phase-preserving locomotion blend

Run → Dodge
fast intent/read transition

Idle → PickUp
allow anticipation to read

Attack → Hit reaction
consumer decides interruptibility

Death
usually no casual blend back to locomotion
```

The KFB motion system therefore needs more than:

`from + to + fadeSeconds`.

Candidate data:

```yaml
MotionTransitionProfile:
  from:
  to:
  condition:
  phaseSync: foot-contact | normalized | none
  crossfadeDuration:
  warpDuringCrossfade:
  interruptPolicy:
  hysteresis:
  evidence:
```

This remains a proposal, not a Registry migration.

---

## 16.8 · Jump is a particularly good fit for consumer physics + animation phases

Current `MovementBasic` includes:

```text
Jump_Start
Jump_Idle
Jump_Land
Jump_Full_Short
Jump_Full_Long
```

For physically controlled KFB movement, the strongest default architecture is:

```text
grounded + jump requested
→ Jump_Start

consumer physics launches actor
→ airborne
→ Jump_Idle

consumer physics reports real ground contact
→ Jump_Land
→ recovery / locomotion
```

The full short/long clips are still useful, but should not silently dictate world trajectory when the consumer already owns jump physics.

### Important TimeScale rule

Do not speed up or slow down a complete jump clip merely to force it to match physics if that destroys:
- launch anticipation;
- apex read;
- landing preparation;
- contact timing.

Better:
- physics owns trajectory;
- animation state consumes grounded / vertical velocity / landing facts;
- segment timing is calibrated separately.

This aligns directly with `kfb-cartoon-animation_v2`:
**squash → launch → stretch → arc → landing preparation → impact → recovery**.

---

## 16.9 · Combat becomes a motion graph, not “play attack animation”

The current source inventory already supports meaningful micro-state graphs.

### Melee example

```text
Melee_1H / 2H / dual-wield / unarmed stance
→ attack anticipation
→ strike/contact phase
→ follow-through
→ recovery
→ stance/locomotion
```

There are explicit:
- block;
- blocking;
- block-hit;
- block-attack;
- multiple attack directions/styles.

### Ranged example

Current source contains explicit:
- `Ranged_1H_Aiming`;
- `Ranged_1H_Shoot`;
- `Ranged_1H_Shooting`;
- `Ranged_1H_Reload`;
- equivalent 2H states;
- bow aim/draw/release;
- magic raise/shoot/spellcasting/summon.

This matters because older KFB notes that scanned an earlier/partial 119-clip view and found no blaster shooting clips are **not current global animation truth**. The current Registry has explicit ranged-combat families.

### KFB consequence

Combat should own:
- attack permission;
- hit/damage;
- ammo;
- reload state;
- target;
- interrupt rules;
- actual release/contact event.

Animation supplies:
- pose;
- cadence;
- semantic phases;
- contact/release marker candidate.

When playback rate changes, contact/release events must stay tied to **animation phase**, not an unadjusted wall-clock timeout.

---

## 16.10 · Equipped locomotion is already part of the KayKit grammar

`MovementAdvanced` includes:
- `Running_HoldingBow`;
- `Running_HoldingRifle`;
- `Running_Strafe_Left`;
- `Running_Strafe_Right`;
- `Walking_Backwards`;
- dodge directions;
- crouch;
- sneak;
- crawl.

Therefore locomotion state cannot be modeled only as:

```text
idle / walk / run
```

A better semantic key is closer to:

```text
locomotionMode
+ speedBand
+ direction
+ stance/equipment
+ grounded
+ action override
```

Example:

```text
LOCOMOTION
speedBand = RUN
stance = RIFLE
direction = FORWARD
→ Running_HoldingRifle

LOCOMOTION
speedBand = RUN
stance = COMBAT
direction = LEFT
→ Running_Strafe_Left
```

The receiving game still decides whether those modes are legal.

---

## 16.11 · Interactions and tools naturally form entry / loop / exit graphs

The current library has especially useful sequences.

### Sitting / lying

```text
Sit_Chair_Down
→ Sit_Chair_Idle
→ Sit_Chair_StandUp
```

```text
Lie_Down
→ Lie_Idle
→ Lie_StandUp
```

### Tools

Pairs/families include:

```text
Hammer / Hammering
Dig / Digging
Saw / Sawing
Pickaxe / Pickaxing
Lockpick / Lockpicking
Work_* / Working_*
Fishing_Cast / Idle / Bite / Reeling / Struggling / Tug / Catch
```

Names alone are not enough to declare loop semantics, but they give us excellent candidates for a measured interaction state graph.

### KFB application

An interaction owner may say:

```text
interaction accepted
→ entry clip
→ loop while progress is active
→ impact marker drives SFX/VFX/progress
→ completion/cancel
→ exit/recovery
```

Again:
- consumer owns task/progress;
- Animation owns motion calibration;
- Audio/VFX consume event markers;
- one actor mixer remains authoritative.

---

## 16.12 · KFB needs **motion markers**, not only clip names

For smooth locomotion and meaningful combat/interactions, the most valuable future metadata is not another tag cloud.

It is measured temporal structure.

Candidate:

```yaml
MotionClipProfile:
  clipRef:
  rigFamily:
  motionFamily:
  direction:
  stanceTags:
  loopCandidate:
  duration:
  cyclePhase:
  footContacts:
    left: []
    right: []
  plantedIntervals: []
  strideReference:
  referenceSpeed:
  approvedPlaybackRateRange:
  actionMarkers:
    - anticipation
    - contact
    - release
    - impact
    - recoveryStart
  evidence:
```

Unknown markers remain unknown.

Do not derive `contact` from an English filename.

---

## 16.13 · Proposed ToolBox / Animation Lab proof — Locomotion Sync Bench

This is the highest-value direct application of the first + current video pair.

### KCL-M1 · measurement-only proof

Use exactly one verified current `Rig_Medium` actor and only:

```text
Walking_A
Walking_B
Walking_C
Running_A
Running_B
```

No consumer physics changes yet.

### Required views

- source actor alone;
- ground/contact grid;
- side view;
- front;
- 3/4;
- optional foot trajectories.

### Controls

- clip;
- playback rate;
- normalized phase;
- actual/reference speed preview;
- left/right contact markers;
- naive transition;
- phase-synced transition;
- crossfade duration;
- warp on/off.

### Measurements

For every candidate clip:
- duration;
- apparent gait character;
- exact left/right foot contact frames/times;
- planted intervals;
- hip/root motion behavior;
- measured foot sliding under a reference translation;
- visually acceptable playback-rate range.

### A/B proof

```text
A · naive
Walk → Run
target starts at t=0

B · phase matched
Walk → Run
same supporting/contact foot + short crossfade + optional temporary warp
```

Record:
- maximum planted-foot slip;
- discontinuity at switch;
- cadence convergence;
- visual Front / Side / 3/4;
- Georg preference.

### Owner boundary

The bench may simulate world translation for measurement.

It must not become:
- the Race movement controller;
- Travel movement;
- Combat player controller;
- global actor state machine.

It exports measured motion profiles for those owners to consume.

---

## 16.14 · Mixed Bag on GitHub is now a real creator-workflow microscope

Georg correctly noted that Mixed Bag 1 is now present in GitHub, so the Live Show research can compare **what Kay did on screen** against the actual released geometry.

Current main evidence:

```text
Pack:
media/3D_Assets/KayKit_Mixed_Bag_1_FREE/

Registry shard:
registry/assets/v1/packs/kaykit-mixed-bag-1-free.json

Registry shard facts:
47 total assets
41 GLTF model-3d
6 PNG image-2d

Pinned source commit:
378b209355b13304e3cff656ec0806ca5b89df28
```

This is substantially more useful than analyzing screenshots alone.

### Already-proven variant example

Current Resident Atlas analysis measured `guitar_A` and `guitar_B` as:
- same vertex count: 1385;
- same bounding box;
- same buffer size;
- same geometry;
- different visual result through UV placement on the shared palette.

That is a source-level proof of:

```text
one semantic geometry family
+ appearance/UV variant
```

rather than two unrelated objects.

### Live Show research method from now on

For each modeled request:

```text
creator video decision
→ released GLTF
→ hierarchy / mesh count
→ dimensions / pivot / orientation
→ geometry/topology
→ UV/material usage
→ variant relationship
→ reusable KFB construction rule
```

This gives us a path to reverse-engineer **KayKit-compatible construction grammar** without requiring Georg to operate Blender.

---

## 16.15 · What should move into KFB canon eventually

Not yet implemented; candidate lessons:

### Animation Lab / ToolBox
- MotionClipProfile;
- foot-contact/phase annotation;
- playback-rate calibration;
- phase-synced crossfade A/B;
- equipment/stance tags;
- interaction/combat event-marker preview.

### Consumers
- speed/acceleration/grounded facts drive animation state;
- hysteresis between speed bands;
- phase-preserving transitions;
- physics remains authoritative;
- combat markers stay phase-relative under timeScale changes.

### Asset Librarian / Registry
- current motion inventory stays canonical source truth;
- future measured motion sidecars enrich rather than replace asset identity.

### Game Dev Studio
- package-level preview of tested motion profiles and consumer handoffs;
- no second mixer/state owner.

---

## 16.16 · Research conclusion

The important shift is:

```text
OLD
speed threshold → play animation

BETTER
consumer motion facts
→ semantic state
→ measured compatible clip
→ phase alignment
→ short blend
→ local cadence/timeScale correction
→ contact/release events
→ recovery
```

For KFB this is not polish after the game works.

It is the layer that makes a technically correct character feel physically coherent, especially when we combine:
- KayKit rigs;
- FrizzleBob grafting;
- EyeRig kinetics;
- weapons/tools;
- Combat;
- platforming;
- interactions;
- procedural cartoon secondary motion.

The first concrete implementation should therefore be **measurement-first**, not another gameplay rewrite.

---

## 2026-09-19 · KCL-002 · Animation overview + locomotion/state-machine synthesis

### USER DIRECTION
Continue the creator analysis with `KayKit - Animations - Overview Set 1`, especially for ToolBox, Animation Lab, locomotion, combat, interactions, timeScale and smooth Walk → Run → faster-motion transitions.

### CURRENT SOURCE FACTS
- the 2024 video is an animation overview rather than a state-machine tutorial;
- current official Character Animations documentation supersedes its inventory count;
- current KFB main has 139 registered Rig_Medium KayKit motions across 8 sets;
- current KFB Rig_Medium inventory has Walking_A/B/C and Running_A/B, but no explicit Sprint clip;
- Three.js already supports per-action timeScale, blending, sync and warp, so the lessons are directly usable in browser runtimes without Godot;
- Mixed Bag 1 is now structurally registered in current main with 41 GLTF models plus 6 PNG assets.

### KFB SYNTHESIS
- phase-sync locomotion transitions instead of clip-reset transitions;
- speed-to-playback-rate matching only inside a measured range;
- hysteresis for speed bands;
- consumer physics remains authoritative;
- jump uses Start / Air / Land phases against actual physics;
- combat release/contact markers remain phase-relative under playback scaling;
- interaction/tool families become measured entry/loop/exit graphs;
- Mixed Bag release geometry becomes ground truth for Live Show modeling analysis.

### CURRENT NEXT GATE
**KCL-M1 · Locomotion Sync Bench measurement pass** on one current Rig_Medium actor using Walking_A/B/C + Running_A/B only. Measure foot contacts, planted intervals, acceptable playback ranges and naive-vs-phase-synced transitions. No consumer movement changes in that gate.

### BRANCH NOTE
At this source pass, GitHub main had advanced to `3d9ac78bfabcec0c43fc453c124133764221139c` while PR #107's research branch remained intentionally unmerged. Current-main source facts were read/pinned; no parallel EyeRig/Hub changes are overwritten by this research update.


---

# 17 · KCL-M1 measured locomotion proof

**Status:** LOCAL BROWSER TECHNICAL PASS · HUMAN / PUBLIC STAGE OPEN  
**Bench:** `tools/game-dev-studio/research/kcl-m1-locomotion-sync/`

The proposal from section 16 is no longer purely conceptual. A neutral current `Rig_Medium` ActionFigure was loaded against the exact current `MovementBasic` source and the five scoped clips were measured in a real Three.js browser runtime.

## 17.1 · Technical proof

GitHub Actions local-browser run:

- workflow `35468444150`;
- job `105964939873`;
- **39/39 checks PASS**;
- artifact `10591764219`;
- artifact digest `sha256:55b8cc47723a64fc9c633ad46e2008a446d666ba724d02fed6242c17354de75e`;
- WebGL canvas: PASS;
- exact five source clips: PASS;
- real left/right foot nodes: PASS;
- five automatic MotionProfiles: PASS;
- A/B transition execution: PASS;
- consumer movement ownership: PASS;
- failed HTTP/resources: 0;
- page/console errors: 0.

The first local run already loaded/measured the five clips, then failed only because the proof harness read source metadata from the wrong object. Repair Pass 1 changed the proof scripts only; motion code remained unchanged. The second run passed completely.

## 17.2 · First actual kinetic measurements

Automatic candidate values:

| Clip | Duration | Reference-speed candidate | Compensated slip / actor height |
|---|---:|---:|---:|
| Walking_C | 1.600 s | 0.447 | 1.73% |
| Walking_A | 1.067 s | 0.611 | 1.38% |
| Walking_B | 1.067 s | 0.751 | 3.09% |
| Running_A | 0.800 s | 2.480 | 6.63% |
| Running_B | 0.800 s | 0.284 | 10.94% |

The useful lesson is **not** “therefore these are the final KFB speeds”.

The useful lesson is:

> The clips contain enough real foot motion to derive distinct cadence/contact profiles, but automatic metrics can also identify a clip that should *not* be assigned a speed role yet.

### Walking family

The auto-reference-speed candidates produce:

`Walking_C < Walking_A < Walking_B`

This is plausible as a useful candidate ordering, but remains visually unapproved. A/B/C naming still does not constitute semantic proof.

### Running_A

`Running_A` produces a much larger forward reference-speed candidate (~2.48) and clean alternating primary contact candidates around:
- left ~9.6%;
- right ~59.6%.

That makes it a strong first Run donor for the phase-sync experiment.

### Running_B · HOLD

`Running_B` produces:
- fragmented multiple low-foot intervals;
- reference-speed candidate ~0.284;
- the largest compensated-slip candidate (~10.94% of actor height).

Therefore:

`Running_B = AUTO_METRIC_AMBIGUOUS_HOLD`

Do **not** interpret it as “slow run”. It may represent a different body mechanic, or the simple low-foot plant heuristic may not fit it. Visual/manual inspection must decide.

This is exactly why the system needs measured profiles instead of filename logic.

## 17.3 · Phase-sync A/B works mechanically

Default successful bench execution:

```text
source: Walking_A
target: Running_A
sync foot: LEFT
fade: 0.12 s
warp: ON
desired speed: 1.5
```

Measured entry:

```text
Walking_A source left-contact candidate ≈ 30%
A · NAIVE target Running_A = 0%
B · PHASE SYNC target Running_A ≈ 9.6%
```

So the two lanes genuinely differ in target gait phase while all other configured variables are shared.

Whether B **looks better** is deliberately still a human gate.

## 17.4 · The first speed→timeScale test also found a useful limit

At desired speed 1.5:

```text
Walking_A reference ≈ 0.611
→ candidate rate hits temporary 1.80× clamp

Running_A reference ≈ 2.480
→ candidate rate ≈ 0.60×
```

This means the current default desired speed is intentionally a poor common operating point for those two clips. It proves the mechanism, but also shows why an approved locomotion system should not stretch a gait arbitrarily.

Next visual calibration should find:
- useful speed window per gait;
- acceptable rate range per clip;
- the speed region where a gait handoff is preferable to further timeScale.

## 17.5 · Public Stage remains infrastructure-blocked

The exact pages.dev target was published in source, but KCL public proof never reached the bench: `SOURCE.json` returned the generic KFB HTML fallback for the complete marker window.

This is independently shown to be repo-wide / publication-layer:
- a TE-01 public proof immediately preceding KCL failed the same Cloudflare deployment-marker gate;
- subsequent Cloudflare Pages builds also failed.

Therefore:

`LOCAL_BROWSER_TECHNICAL_PASS = YES`  
`PUBLIC_VERIFIED = NO`  
`GEORG_MOTION_ACCEPTED = NO`

No KCL motion repair is justified by the current Cloudflare failure.

## 17.6 · Consequence for the broader KFB animation programme

We now have evidence that the path is viable:

```text
KayKit clip library
→ exact rig/source
→ strip movement-owner root translation
→ measure real feet
→ derive contact/cadence profile
→ phase-aware transition
→ timeScale inside calibrated range
→ consumer-owned movement facts
```

The same method can later expand to:
- backwards/strafe locomotion;
- equipped bow/rifle locomotion;
- dodge;
- Jump_Start / Jump_Idle / Jump_Land;
- melee anticipation/contact/recovery;
- ranged aim/release/reload;
- tool entry/loop/impact/exit;
- sit/lie state families.

But expansion should follow the same rule:

**measure one family, prove its transitions, then expose a reusable profile.**

---

## 2026-09-19 · KCL-003 · first measured locomotion proof

### IMPLEMENTATION
Built KCL-M1 Locomotion Sync Bench using the exact current ActionFigure / Rig_Medium and five MovementBasic clips. Reused Travel foot-sampling/root-cleaning concepts and KFB one-mixer-per-host ownership without importing any consumer movement controller.

### TESTED RESULT
- source/static sanity: 20/20 PASS;
- runtime local browser proof after one harness-only repair: **39/39 PASS**;
- five real clips loaded/measured;
- machine-readable `MEASURED_PROFILE_CANDIDATE.json` persisted;
- Running_B held out as automatic-metric ambiguous rather than forced into a speed role.

### PUBLIC
Cloudflare/pages.dev remains blocked by a repo-wide deployment problem. No public or human PASS claimed.

### CURRENT NEXT GATE
Restore successful current Cloudflare publication, rerun the unchanged public KCL proof and let Georg judge NAIVE vs PHASE SYNC visually before consumer integration.
