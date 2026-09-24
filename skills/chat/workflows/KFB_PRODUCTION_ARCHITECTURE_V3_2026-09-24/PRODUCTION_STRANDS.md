# KFB Production Architecture v3 · Complete Production Strands

Status: **CURRENT CANDIDATE · SELF-SERVICE ROADMAP**  
Date: 2026-09-24  
Owner: Georg / KFB  
Architecture steward: KFB Web Architecture lane

This document turns the current KFB building blocks into **complete production strands**. The purpose is that Georg can choose a strand or the next READY milestone from the Hub and start a fresh Web / Claude / Blender chat **without another architecture review round**.

These are product-capability milestones, not micro-slices. Internal commits/tests may be smaller.

---

# STRAND T · ToolBox Authoring Platform

## Target product

One Stage-First ToolBox in which Georg can author and reuse:

- actors and FrankenStein grafts;
- EyeRig/face profiles;
- vehicles as expressive hosts;
- static poses and bone corrections;
- character and vehicle animation;
- Resident Atlas scenes;
- props and configured scene modules;
- hierarchical/fractal editing;
- Save/Reload/export;
- live resource search from existing registries.

The ToolBox is a **composition surface over existing owners**, not a new global runtime.

## Existing sources that must survive

- current FrankenStein Studio tool node / v16 modules;
- accepted Stage-First working baseline;
- EyeRig v6 + FaceHost;
- EyeRig Batch PR #104;
- Resident Atlas S6;
- shared in-scene editor / `kfb.scene-patch.v1`;
- KayKit Motion Lab v1 / PR #127;
- Motion Library / PR #197;
- existing vehicle/mech rig and vehicle-deformer sources;
- Asset Librarian / Asset Registry.

## T1 · ToolBox shell + real source roster · READY

**Outcome:** the accepted Stage-First surface becomes the real ToolBox host, with actual current actors, FrizzleBob, saved pets and Resident presets.

Human review is one coherent ToolBox artifact, not one gate per source.

This is the existing `TOOLBOX-COHERENT-INTEGRATION-01` job.

---

## T2 · EyeRig Production Studio · READY

### T2A · Batch character EyeRig

Current state already exists:
- Rig_Medium batch/default;
- reviewed Rig_Large profiles;
- Legacy profile work;
- canonical EyeRig v6 remains the only eye implementation.

Finish the remaining practical authoring path:
- actor search/selection;
- source eyes cleanup where required;
- auto-mount approved profile on load;
- compare Source / EyeRig;
- edit and save reviewed profile;
- batch navigation across actor families.

Legacy must show full characters, not head-only fragments, before being treated as useful production UI.

### T2B · Vehicle EyeRig

Use the existing Vehicle FaceHost direction from the EyeRig batch brief.

Architecture:
```
verified front anchors / source lamps
→ Vehicle FaceHost adapter
→ canonical EyeRig v6
→ vehicle-eye profile
→ optional telemetry-driven gaze/lids
```

Rules:
- no biped Head-bone detector for vehicles;
- no invented headlight nodes;
- original lighting semantics remain separate from visual eyes;
- EyeRig consumes vehicle telemetry but never writes vehicle physics.

First proof should use one current vehicle with verified front orientation, then become a batch-capable ToolBox surface.

### T2C · Fractal per-eye authoring

Georg needs hierarchical editing down to:
```
scene
→ resident/vehicle
→ actor/host
→ face
→ EyeRig
→ left eye / right eye
```

Current EyeRig profiles primarily expose shared spacing/anchor facts. **Independent left/right editing is therefore a real missing capability**, not something to pretend is already finished.

Implement as an additive authoring adapter around EyeRig v6:
- inspect public EyeRig eye nodes/anchors first;
- allow local left/right offset and, where safe, scale/tilt;
- persist through the existing EyeRig profile owner or a versioned additive profile field;
- never fork EyeRig v6;
- source eye semantics remain reversible.

**Done when:** one biped and one vehicle can be selected hierarchically and each eye adjusted independently, saved and reloaded without breaking gaze/blink/lids.

---

## T3 · Fractal Scene + Pose Studio · READY

This is **not a greenfield posing tool**.

Resident Atlas S6 already proves:
- object Move / Rotate / Scale;
- Bone selection;
- Bone rotation ring;
- clip pause during manual adjustment;
- per-Resident persistent corrections;
- export as `<resident>.studio-patch.json`.

The shared scene editor already proves:
- select;
- Move;
- Rotate;
- free Scale;
- Drop;
- World/Local;
- `kfb.scene-patch.v1` Save/Reload.

### Productization

Build one ToolBox **Fractal / Pose mode** that adapts both existing systems.

Selection tree:
```
scene
→ group / Resident preset / vehicle rig
→ actor / prop / host
→ sub-part
→ bone or owner-specific editable node
```

Capabilities are owner-driven:
- scene objects: Move / Rotate / Scale / Drop;
- bones: pose rotation using Resident Studio behavior;
- EyeRig nodes: EyeRig authoring adapter;
- vehicle rig groups: existing vehicle/mech rig setters;
- actor-specific pose presets: existing `pose-rig.v1.js`.

Do not flatten everything into arbitrary TransformControls. A bone, EyeRig eye and world prop have different valid operations.

### Drummer use case

The Orc drummer becomes a first practical proof:
- load the real Orc/wardrum scene;
- choose a useful base clip or neutral pose;
- pose required arm/bone corrections directly in ToolBox;
- position drum/sticks with normal object transforms;
- preview the result;
- export a Resident/Studio patch;
- only use Blender if authored time-based motion is actually needed.

This is exactly the class of work that should no longer require Blender just to adjust a static pose.

---

## T4 · Animation Studio inside ToolBox · READY

The old Animation Lab node is still `UNVERIFIED`; do not promote an unknown old standalone as truth.

Build the practical **ToolBox Animation Studio** by consolidating the sources that are already proven:

- KayKit Motion Lab v1 / PR #127;
- KFB Motion Library / PR #197;
- KayKit creator/KCL research / PR #107;
- Resident Atlas motion audition;
- existing vehicle animation/deformer modules;
- Blender-authored Resident actions.

### Core surfaces

**Clip Library**
- actor/rig compatibility;
- semantic group;
- duration/loop;
- root/travel behavior;
- contacts and later action markers;
- visual preview.

**Actor Preview**
- actual actor;
- approved EyeRig on by default;
- attachments/props when the scene requires them;
- no second mixer owner.

**Locomotion Studio**
- speed slider, not just Shift;
- Idle / Walk variants / Run variants;
- measured playback-rate window;
- phase-aware Walk→Run transitions;
- hysteresis around speed bands;
- actual world-translation preview;
- contact/foot-slip readout as secondary evidence.

**Semantic State preview**
Use richer motion facts already identified by the creator research:
```
locomotionMode
+ speedBand
+ direction
+ stance/equipment
+ grounded
+ action override
```

Examples:
- forward walk/run;
- backwards;
- strafe;
- rifle/bow locomotion;
- jump Start/Air/Land;
- sit entry/loop/exit;
- tool entry/loop/impact/exit.

The receiving game still decides which states are legal.

### Continuous speed rule

Do not map keyboard Shift directly to a hard animation switch.

Consumer movement speed remains authoritative:
```
movement facts
→ semantic state
→ compatible clip
→ phase alignment
→ crossfade
→ timeScale inside calibrated range
→ handoff to next gait when range is exceeded
```

This is the reusable motion layer the user expected from the KayKit creator research.

---

## T5 · Vehicle Motion Studio · READY AFTER T4 BASE

Consume, do not rebuild:
- current Vehicle Lab / cartoon-deformer modules;
- vehicle manoeuvre/tumble/two-wheel/fishtail sources;
- Mech & Vehicle Rig;
- Race/Travel telemetry only as inputs.

ToolBox owns:
- visual vehicle rig/deformation profile;
- preview of acceleration/brake/steer/jump/drift presentation;
- driver/cockpit authoring relation;
- vehicle EyeRig presentation;
- animation preset export.

Race/Travel keep:
- contact;
- physics;
- movement;
- gameplay.

A complete vehicle authoring scene may contain:
```
vehicle root
→ presentation/deformer root
→ Vehicle EyeRig host
→ cockpit
→ FrizzleBob/driver rig
→ props/instruments
```

Every level should be selectable through the Fractal editor where its owner allows editing.

---

## T6 · Resident Scene Studio · READY AFTER T3/T4

Resident Atlas remains scene/recipe truth.

ToolBox presents a Resident scene as a reusable authored prefab:
- actors;
- props;
- scene relationships;
- pose patches;
- animation/action assignment;
- EyeRig/profile references;
- local scene transforms.

Workflow:
```
load Resident preset
→ pose
→ assign/test motion
→ adjust props
→ edit EyeRig if needed
→ save patch
→ export/update Resident scene module
```

Do not silently write manual experiments back into canonical `data/cast.js`; promotion remains deliberate.

---

## T7 · Context-aware Resource Picker · READY

This design already exists in the Stage-First Asset Librarian integration.

One drawer/search surface consumes existing truths instead of creating a second catalog.

Search domains:
- raw Asset Registry models/props;
- actors / ToolBox roster;
- Resident Atlas presets/modules;
- configured scene modules;
- billboard/media modules;
- vehicle fixtures;
- later Race/World modules.

Context filters examples:
- `Face → compatible face modifiers / EyeRig profiles`;
- `Pose → current actor / rig / props`;
- `Stage → Resident scenes / environments`;
- `Place → props / buildings / billboards`;
- `Motion → compatible clips/actions`.

**Done when:** Georg can search from ToolBox, choose a real source item, place/load it, then edit it through the same authoring context.

---

## T8 · ToolBox Production Milestone

One coherent review artifact must support:

```
search
→ load actor or Resident scene
→ FrankenStein / Actor Platform
→ Face / EyeRig
→ Mouth / Viseme / Talk
→ Voice request / Bubble presentation
→ Material Zones / Color / Texture Surface
→ hierarchical/fractal edit
→ pose bones
→ assign/test animation + idle/performance
→ place/scale props
→ inspect Card/PDF content where relevant
→ Save
→ Reload
→ continue editing
→ export reusable scene/actor configuration
```

Required capability seams:
- Actor-family dispatch rather than a CubePet-only embed assumption;
- Speech + Thought Bubble access through the current bubble owner;
- one mouth/viseme owner, with future phoneme/TTS timing feeding the same seam;
- current material-zone Color Picker / Hex / Copy / Reset behavior;
- Texture/Surface selection through the existing Asset Librarian / material owner, not fixed swatch-only UI;
- current Card/PDF Viewer as a reusable content viewer where card content is involved.

This is the real ToolBox milestone. Individual internal proofs are not separate mandatory Georg gates.

---

# STRAND A · Animation + Resident Production

This strand feeds ToolBox and games. It may run in parallel with ToolBox integration.

## A1 · Motion Library intake · CURRENT SOURCE

PR #197 currently provides 33 actions for Rig_Medium and Rig_Large plus catalog/contact sheets.

Treat that as current input, not as a reason to rerun retargeting from scratch.

## A2 · Resident Performance Batch · READY

Use Blender MCP for genuinely time-based authored performance:
- dances;
- band performance;
- prop/tool performance;
- choreography;
- special interaction clips.

Batch workflow:
```
Resident source
→ audition current library
→ reuse/tune donor if possible
→ author only missing motion
→ check contacts
→ Action/NLA
→ GLB
→ short preview
→ next queue item
```

Do not interrupt the authoring session for GitHub governance.

## A3 · Pose-before-Blender rule · READY

Before sending a problem to Blender:
1. can existing clip layering solve it?
2. can Resident Studio bone posing solve it?
3. can the Fractal editor position props/actor?
4. only if motion over time is required, use Blender.

This prevents static arm/prop corrections such as a drummer pose from becoming expensive animation jobs.

## A4 · Motion Profiles · READY

Promote the useful PR #107/#127 findings into reusable motion metadata:
- contacts;
- planted intervals;
- reference speed;
- approved rate range;
- gait family;
- state semantics;
- action markers where measured.

No filename-only semantics.

## A5 · Consumer Preview Pack

ToolBox Animation Studio and WorldBuilder consume the same approved profiles/catalogue.

A clip/profile is authored once, not rediscovered per game.

---

## A7 · Character / Resident production boundary · CURRENT WORKFLOW

Current detailed workflow:
`CHARACTER_RESIDENT_PRODUCTION_WORKFLOW_2026-09-24.md`.

Default authoring boundary:

- Resident Atlas / ToolBox owns static pose, prop fit, scene composition and reusable Resident-module authoring.
- Animation Studio owns clip audition, speed, loop, crossfade, beat/song phase and choreography from existing actions.
- Blender MCP owns new time-based motion, retarget, clip repair across frames, skeleton/weights/topology, head/body graft derivatives and bake/export.

A browser pose/Studio Patch may be promoted into a Blender key-pose reference. This lets Georg visually author the pose in Resident Atlas while Blender handles only the missing time-based interpolation/bake.

### KayfaBizarros Resident Performance Module

Preferred next ORB product form is a **baseplate-free Resident scene module**, not one monolithic stage GLB.

It references:
- Orc B bandleader;
- Orc Raider guitarist;
- Orc Brute drummer;
- Wardrum/sticks;
- optional local props;
- songRef;
- BPM/phase;
- accepted actions;
- pose patches;
- local transforms.

The host world supplies the floor/support.

For the drummer:
- make the desired strike/contact pose in Resident Atlas first;
- if one constant correction works through the clip, keep the Studio patch;
- if correction must change over time, Blender consumes the accepted pose as reference and authors only the time-varying correction;
- never restart automatic arm-to-drum target solving.

### Custom actor-family derivatives

Do not generically rerig Legacy; it already owns Rig_Legacy and native clips.

Blender is appropriate for a concrete custom family derivative such as the requested Frizzle-Orc identity across Medium / Large / Legacy, but only after exact sources are pinned.

Preserve destination rig families whenever possible:
- Medium remains Rig_Medium;
- Large remains Rig_Large;
- Legacy remains Rig_Legacy.

Prefer head/identity grafts onto existing destination rigs over whole-skeleton warps.

EyeRig/face remains a ToolBox/runtime owner.

### Missing source locks

Current exact sources are still required for:
- Frizzle-Orc 3 Rig-Warp;
- the named Musknacker actor;
- blank Legacy/template head and requested accessories.

Do not reconstruct these from prose.

### Prepared jobs

- `RESIDENT-BAND-MODULE-01` · READY
- `POSE-TO-BLENDER-01` · READY
- `BLENDER-ACTOR-FAMILY-01` · HOLD on exact sources
- `BLENDER-MOTION-02` · HOLD until one named missing motion is identified
- `LEGACY-CUSTOM-ACTOR-01` · HOLD on chosen custom actor/source

# STRAND W · WorldBuilder / God Mode

## Target product

A KFB authoring world where Georg can:

```
Globe
→ choose/enter region
→ WALK
→ sculpt terrain
→ live-search assets/scenes
→ place
→ fractal edit
→ pose/animate Residents
→ test locomotion
→ compose OSM cartoon district
→ insert landmarks / billboard / Race route
→ save/reload
→ pull back to God view
```

WorldBuilder composes modules. It does not become the runtime owner for every module.

## W0 · Measured foundation · HUMAN GATE OPEN

Current WB-W0 / PR #203:
- scale;
- traversability;
- Globe→Region;
- WALK;
- current direct public review exists.

This remains the foundation decision.

## W1 · Authorable Place · PREPARED

Already defined:
- WB-W0 place;
- WB2 Raise/Lower sculpt;
- shared object editor;
- real props;
- Save/Reload;
- WALK preserved.

No new architecture review after W0 decision.

## W2 · Live Place/Search + Scene Prefabs

Add the ToolBox context Resource Picker as a WorldBuilder consumer.

Place/search categories:
- props;
- buildings;
- characters;
- Resident scenes;
- configured scene modules;
- billboards/media;
- vehicles;
- later Race modules.

The picker returns source refs/recipes. WorldBuilder stores references and transforms, not copied asset bytes.

## W3 · Fractal Scene Authoring

Mounted objects and scene modules use the same editor grammar:
- root scene transform;
- nested groups where the source owner exposes them;
- Resident Pose Studio for bones;
- EyeRig editor for face;
- vehicle/cockpit nested editing.

Do not create a second generic editor.

## W4 · Live Animation + Locomotion Playground

WorldBuilder becomes a consumer of ToolBox Animation Studio.

For a selected character:
- EyeRig profile on by default;
- choose approved motion profile;
- speed control continuously drives world velocity preview;
- gait state changes with hysteresis;
- phase-preserving transitions;
- playback rate only inside measured range;
- richer stance/direction states available where supported;
- clip/state debug is optional, not permanent UI.

Georg must be able to walk the character and **see the same animation logic intended for the game**, not a hard Shift Walk/Run demo.

## W5 · OSM Cartoon Zone + Landmarks

OSM remains geographic/semantic truth.

WorldBuilder consumes:
- one current cartoon form-language grammar;
- continuous road/building geometry;
- current landmark modules;
- shared look/palette grammar.

No detached overlay world.

One district becomes an editable local authoring zone.

## W6 · Racer World Module

Consume Race as:
- route reference;
- bank/elevation truth;
- accepted visual track module;
- optional start/finish/service anchors.

WorldBuilder may position/dress the route and edit surrounding world content.

WorldBuilder never owns Race physics/contact.

## W7 · God Mode

Use current Globe→Local foundation as navigation owner:
- globe overview;
- region selection;
- local authoring;
- world-layer toggles;
- pull back to globe;
- persistent authored regions.

Atmosphere/day-night/weather comes after the authoring loop is useful.

---

# STRAND R · Racer → World Integration

## Current source truth

Private Race repo:
- PR #33;
- branch `chat/racer-tarch0-sp13ktra-2026-09-23`;
- current head `71e7051b2eea1ad731912b634f44ce5ba0218736`;
- R3d human result = TUNE;
- next foundation = Racer Anatomy Foundation;
- vehicle grounding/contact remains HOLD until anatomy is clean.

## R1 · Racer Anatomy Foundation · READY

Goal:
one reproducible 3D structural grammar for:
- track body;
- barrier/cap;
- underside;
- supports/frames;
- clean transitions.

Use current procedural route/banking truth.
Blender may author/compare a representative visual cross-section or structure donor, but must not own route/physics.

No patchwork overlays or multiple overlapping body owners.

## R2 · Route-driven visual track module

Once one anatomy section is accepted:
- sweep/instantiate the accepted visual grammar along the existing computed route;
- banking/elevation come from Race;
- visual density may be higher than physics sampling;
- preserve one semantic topology.

Output a reusable **Race Visual Module** with explicit source/route refs.

## R3 · Vehicle contact/grounding

Only after visual anatomy is trustworthy:
- vehicle/contact owner fixes actual road support;
- visual shell/cockpit reads the same route/contact state;
- no visual-only lift hacks.

## R4 · OSM / WorldBuilder bridge

Export a scene-consumer recipe such as:
```
race-route ref
+ visual-track ref
+ region/geographic placement
+ landmark/service anchors
+ surrounding-world exclusion corridor
```

WorldBuilder consumes this as a placed world module.

## R5 · Cartoon-world composition

Combine:
- accepted Race track visual;
- OSM cartoon zone;
- landmarks;
- billboards;
- Resident scenes;
- shared KFB look grammar.

This is the construction-site view Georg wants for God Mode.

---

# STRAND C · Combat, Duel Choreography and World Encounters

## Target product

Combat is not only a player mini-game. KFB needs a reusable **combat performance and encounter layer** that can stage:

- NPC-vs-NPC melee duels;
- ranged duels;
- mixed rig families;
- autonomous wrestling-like match loops;
- short Hero Shot combat performances;
- the existing player Arena;
- later world/dungeon/tower encounters.

Combat Arena remains the owner of combat truth: target, hit, damage, defeat, rewards and encounter lifecycle. ToolBox Animation Studio may audition/choreograph actions but does not become the damage engine.

## Existing donors that must survive

- private Combat PR #5 current actor/runtime seam;
- Combat PR #7 current real Skeleton Blade + `Melee_1H_Attack_Chop` + swept-contact/AttackLedger work;
- Combat PR #10 Legacy readiness;
- PR #6 Melee Choreography brief;
- MotionProfiles / Motion Library;
- Resident Atlas attachment and pose work;
- shared Spindle/Skydome donor;
- existing Combat VFX/SFX event grammar;
- Card body/A2 sources.

## C1 · Combat Actor Family Matrix · READY

Maintain explicit actor families/capabilities, not one assumed skeleton:

```
Rig_Medium
Rig_Large
Rig_Legacy
CubePet / node-animated
procedural / zero-bone
later three2p5d / Block actor adapters
```

Shared contract is semantic capability, e.g.:
`idle · move · guard/aim · attack · hit · defeat · recover · block · taunt`.

Missing capability = HOLD/null, never silent fallback.

The first matrix must preserve:
- Driver Graft;
- Goth Girl;
- Skeleton Warrior;
- Black Knight / Large candidate;
- Legacy Knight/Rogue;
- CubePet Bunny or another exact CubePet as procedural/node-animated proof.

## C2 · Duel Choreography Studio · READY AFTER TB-ANIM BASE

Add a **two-fighter Stage** to ToolBox Animation Studio.

Purpose:
- audition attacks and reactions;
- adjust distance/facing;
- inspect weapon grip/path/contact;
- chain semantic actions;
- create deterministic looping duel scripts;
- preview Melee / Ranged / Block / Hit / Recover;
- save choreography recipes.

The stage should feel like a small wrestling/versus set:
- side-on or readable 3/4 camera;
- two actual source actors;
- actual props/weapons;
- optional Spindle environment;
- no generic fighting-game HUD.

A choreography recipe drives presentation:
```
fighter A action
→ marker/contact window
→ fighter B reaction
→ spacing/facing beat
→ recovery / counter
→ loop or finish
```

For Hero Shots it may run autonomously.

**Important:** preview contact may use the current measured weapon/contact profile. HP/reward/gameplay stays Combat-owned.

## C3 · Melee + Ranged Contact Library · READY

Use the existing PR #7 contract:
- weapon hilt/root + tip;
- active window;
- swept segment/capsule;
- one AttackLedger consumption;
- confirmed contact event.

One event drives:
```
damage decision (Arena)
+ reaction marker
+ impact VFX
+ impact SFX
```

A miss must remain a miss.

Extend family by family:
1. proven Rig_Medium 1H;
2. Legacy 1H + Crossbow after visual profile gates;
3. Rig_Large / 2H;
4. body-contact / procedural attacks for CubePets/props where appropriate.

Do not force Medium clips onto Legacy/Large/CubePets.

## C4 · Autonomous Match Director

Build a small deterministic encounter/choreography scheduler on top of semantic actions.

Modes:
- exhibition / endless sparring;
- fixed 10–30 second Hero Shot;
- best-of-N Arena match;
- ambient NPC scuffle;
- scripted encounter beat.

It chooses already-admitted actions; it does not synthesize skeleton poses from nothing.

Useful output:
- reproducible seed/recipe;
- camera beat hints;
- event markers for FX/SFX;
- clean loop point.

## C5 · Combat Arena Product Expansion

Apply admitted actor/contact profiles to the existing Arena:
- preserve three-enemy/current reward/card-clear lifecycle;
- add real melee and ranged actor capabilities;
- keep player mode available;
- add spectator/demo/autonomous match mode;
- allow actor-vs-actor roster selection.

Spindle and Curtain are consumed presentation modules, not rebuilt inside Arena.

## C6 · Combat Card Tower / Encounter Module

A card surface can become an **encounter platform module**.

Candidate progression:
```
enter card platform
→ encounter
→ clear
→ reveal / unlock next card platform
→ ascend
```

This generalizes the existing card-level concept without making Combat own world topology.

Chill mode:
- no fatal fall;
- forgiving recovery to last cleared platform;
- player can watch autonomous fights or participate.

The same encounter module can later mount into:
- a Card Tower;
- Babel/Hex vertical structures;
- Dungeon rooms;
- open world encounter zones.

## C7 · Open-World Combat Adapter

WorldBuilder supplies:
- terrain/support frame;
- spawn/return anchors;
- encounter volume;
- world persistence reference.

Combat supplies:
- combatants;
- targeting;
- attacks;
- damage/defeat/reward;
- combat event stream.

No duplicate open-world combat engine.

---

# STRAND P · Cube Pets and Actor Identity

## Why this is a separate strand

The 24 Cube Pets are a canonical actor family, not decorative leftovers. They already have:
- a canonical `kfb.pets/1` stack;
- 24 exact IDs;
- EyeRig data;
- PetMouth data for supported pets;
- node/procedural motion vocabulary;
- existing Travel consumer use.

They must remain available in ToolBox, Resident scenes, Town, Travel, WorldBuilder and compatible Combat contexts.

## P0 · FrizzleBob identity lock · READY

Never use the word “FrizzleBob” as a technical identifier by itself.

Current distinct identities:

1. **`cube-frizzlebob`**
   - CubePet `bunny`;
   - `animal-bunny.glb`;
   - 24-Pet contract;
   - CubePet EyeRig / PetMouth / PetMotion.

2. **`legacy-arena-frizzlebob`**
   - Combat historical/current Legacy option;
   - `frizzlebob.v1.js` + `FrizzleBob_Yellow_Gun.gltf`;
   - separate Arena lineage.

3. **`frizzlebob-driver-graft`**
   - current modern Rig_Medium host/graft;
   - `kfb-pet-graft-driver.v4.json`;
   - ToolBox / modern consumer line.

The `FrizzleBob_Yellow.gltf` donor used by the graft is a donor asset, not a fourth interchangeable gameplay identity.

Every roster/scene/brief must use one explicit ID.

## P1 · 24-Pet ToolBox roster · READY

Bring all 24 canonical CubePets into the real ToolBox roster using `kfb-pets.js` / `kfb-pets.json`.

Preserve:
- per-pet colors/skins;
- EyeRig settings;
- mouths where configured;
- node/procedural clip vocabulary;
- material/surface settings.

Do not convert them into Rig_Medium actors just for uniformity.

## P2 · CubePet Face + Motion Studio

ToolBox Face/Animation surfaces consume the CubePet owner:
- EyeRig;
- PetMouth/visemes;
- idle/walk/run/eat/dance/gesture family where real;
- procedural bundles/states where real.

Animation Studio shows semantic compatibility even though the motion mechanism differs from skeletal KayKit.

## P3 · CubePet Resident Module

Any CubePet can be wrapped as a Resident Scene actor:
- root transform;
- pet config ref;
- face state;
- motion state;
- props/relationships where admitted.

This makes CubePets first-class WorldBuilder/Town residents.

## P4 · CubePet Combat adapter

Do not attach humanoid CombatMelee clips.

Use semantic combat states translated to CubePet motion:
- hop/lunge;
- squash/lean;
- hit recoil;
- spin/tip;
- EyeRig reaction.

Admit only capabilities that look intentional.

---

# STRAND V · Travel Modes and World Surfaces

## Architectural correction

**World topology and travel mode are orthogonal.**

A WorldBuilder scene is not intrinsically a globe.
A travel mode is not intrinsically tied to TinySkies sphere code.

First supported surface archetypes:
- FLAT;
- SPHERE;
- TORUS.

Later topologies can be added through the same adapter if real product use demands them.

First travel modes:
- GROUND;
- FLIGHT;
- DRIVE;
- WATER/BOAT;
- later PLANE / FREEFALL / PARACHUTE.

Exactly one movement writer is active at a time.

## V1 · Surface Adapter · READY

Reuse the existing preflight direction:
same tiny semantic world recipe on FLAT / SPHERE / TORUS.

The adapter provides only what consumers need:
- world↔surface mapping;
- local tangent/right/up frame;
- support/height query;
- normal;
- optional wrap/topology semantics;
- region/navigation mapping.

Race, Combat, OSM, Hex and WorldBuilder keep their owners.

A flat-world edge may wrap, portal or expose a designed transition; that behavior is topology data, not hardcoded into movement logic.

## V2 · Travel Mode Router · READY

Build one explicit mode contract over current Travel/WB0 lessons.

Candidate facts:
```
mode id
movement owner adapter
camera preset/adapter
support type
vehicle/actor presentation
allowed FX
enter/exit contract
persistence payload
```

The router switches writers atomically.

Current proven input:
- Ground↔Flight bridge;
- Ground→Flight double-Space 400 ms accepted on Travel PR #38.

Do not drag all old Travel presentation into every mode.

## V3 · Free Drive in World

Reuse Racer/vehicle movement knowledge without turning WorldBuilder into Race.

Goal:
- ordinary vehicle movement on world support surface;
- no track required;
- vehicle/cockpit presentation from ToolBox;
- terrain/world contact owned by the active Drive adapter.

Race Track mode remains a specialized route/contact context.

## V4 · Boat / Water mode · SOURCE RECOVERY READY

TinySkies source inventory proves:
- `Boat.ts`;
- `BoatMesh.ts`;
- geometric foam waterline;
- vehicle feature-table architecture.

First job is source recovery/audit against upstream `2659a5cc987d`, not recreation from prose.

Then build KFB WATER mode:
- water support truth;
- boat motion adapter;
- wake/foam presentation;
- transition Ground/Drive ↔ Boat where appropriate.

Do not claim the TinySkies Boat movement model is already ported.

## V5 · Plane / Air mode

Same pattern:
- recover exact Plane/Biplane donor behavior;
- define KFB capability profile;
- keep flight presentation/movement owner separate from carpet mode where necessary.

## V6 · Freefall / Parachute / Skydiving

This is a later explicit mode, useful for:
- leaving vertical towers;
- falling from Cheese Moon/Babel;
- aerial world transitions.

Needs:
- fall/landing truth;
- actor animation states;
- parachute/glider source if used;
- recover/ground transition.

Do not fake it as camera-only falling.

---

# STRAND B · Vertical Worlds, Babel, Hex/Voxel and Card Towers

## Goal

Vertical construction becomes a first-class **world-content grammar**, not a separate world runtime.

Structures may be built on FLAT, SPHERE or TORUS surfaces and can rise far beyond the local terrain.

## B0 · Failed-source recovery · READY

Recover exact source for:
- useful failed Platformer movement/camera/contact work;
- any auto-jump-line logic Georg remembers;
- full S2b Babel export.

Until pinned:
`AUTO_JUMP_SOURCE_REQUIRED`.

Do not reconstruct missing code from screenshots or prose.

## B1 · Measured Hex/Voxel platform grammar

Reuse:
- KayKit Medieval Hexagon;
- Medieval Builder;
- current `hex-grid.js / TILE_EDGES`;
- Card Zone v2 semantics where relevant;
- BlockBits/Voxel only as a deliberate local building grammar.

Measure:
- support surfaces;
- connector edges;
- step height;
- jump classes;
- footprints;
- legal adjacency.

## B2 · Babel Recipe Generator

Use the existing brief but move it into the new production model:
- small reachable authored/seeded vertical path;
- no giant random island;
- debug only as secondary evidence.

The initial 8–14-band recipe is a product seed, not the final height limit.

## B3 · Assisted Platformer traversal

After exact donor recovery:
- normal grounded movement;
- explicit auto-jump / assisted jump corridors only where intended;
- no-fall Chill mode;
- recovery to last valid support;
- free/manual mode remains possible where supported.

The assist is a traversal mode, not geometry ownership.

## B4 · Infinite/extended vertical construction

WorldBuilder may append bands/modules as needed:
- Hex;
- Voxel;
- Card platforms;
- structural/scenery modules.

Streaming/LOD only after the finite tower is useful.

The Cheese Moon can be a narrative/world target without becoming an engine assumption.

## B5 · Combat bands

Mount Combat Encounter Modules on selected levels:
- clear encounter;
- unlock/reveal next band;
- autonomous exhibition or player combat.

Combat owns fight state; Tower owns level/order/support.

## B6 · Vertical Travel

Combine with STRAND V:
- climb/jump;
- fall;
- free flight;
- parachute/glider;
- vehicle/portal transitions.

---

# STRAND N · Town, ChatterBox and Living NPC Worlds

## Target

WorldBuilder should create **inhabited places**, not static dioramas.

A Resident can carry:
- visual scene recipe;
- idle/activity animation;
- encounter-beat behavior;
- ChatterBox voice/text source;
- memory view;
- gift/card offer;
- optional combat capability.

## N1 · Encounter Beat Bus · READY

Reuse the Town grammar:

```
approach
→ greet
→ offer
→ react
→ decline/accept
→ leave
```

The encounter system emits semantic beats.

Animation chooses performance.
ChatterBox chooses text.
Gift/card system chooses offer.
None writes the other's internal state.

## N2 · ChatterBox adapter · READY

Reuse existing ChatterBox/NIE/bubble donors rather than building dialogue trees.

Preferred architecture:
```
host encounter/context
→ ChatterBox content selection
→ bubble/voice presentation
→ optional actor performance beat
```

The host owns:
- relationship;
- nearby situation;
- whether an NPC is currently speaking;
- interaction/combat legality.

ChatterBox owns neither movement nor combat.

## N3 · NPC memory

Reuse existing Journey/event+context+card records as the memory source.

NPC memory is a filtered view:
- seen player before;
- cards encountered/played/discovered;
- prior gift/incident;
- missing/interesting card hint.

Do not create a second global memory database.

## N4 · Gift / collectible encounter

Residents may offer:
- card;
- skin;
- scene/item;
- satirical upgrade;
- collectible line/retort.

This preserves Georg's “attraction with legs” direction.

A gift is a typed reward/event, not an arbitrary dialog side effect.

## N5 · Living Resident Scene Module

Package:
- scene/actors/props;
- default activity loop;
- encounter beats;
- ChatterBox profile;
- memory adapter;
- gift hooks;
- optional combat capability.

WorldBuilder can search/place this module exactly like a static Resident Scene.

## N6 · Town / Open World Life

Town becomes a curated WorldBuilder composition using the same Living Resident modules.

Friendly default does not mean incapable of combat:
- social context can remain calm;
- a Combat Encounter adapter may temporarily own fight state when provoked or staged.

---

# STRAND S · Shared Stage, Transitions and Presentation Modules

These modules are reusable presentation layers. They never become game owners.

## S1 · Spindle Sky · READY

Reuse Combat planning donor:
- `himmel.v4.js`;
- `spindel.v4.js`;
- `skydome-shader.v4.js`;
- Travel skydome/world-context donor where appropriate.

Candidate shared API:
`mount / setPreset / setPalette / update / probe / dispose`.

Uses:
- Combat versus stage;
- Card Tower;
- Babel/vertical worlds;
- Story/instance scenes;
- selected WorldBuilder environments.

## S2 · Theatre Curtain Core v2 · READY

Preserve the v1 cloth runtime.

Complete Georg-requested refinement:
- lower-third tieback/swag;
- physical cord/tieback if feasible;
- remove unnatural crease artifacts;
- retain exact source-backed fabric foundation.

Then host adapters:
- Combat raid/match intro;
- Race reveal/countdown;
- Travel/portal;
- Dungeon/minigame;
- staged Hero Shots.

## S3 · Encounter/Instance Stage Recipe

A stage recipe references, rather than copies:
- support/surface module;
- environment/Spindle preset;
- Resident/combatants;
- choreography/encounter recipe;
- Curtain transition;
- VFX/SFX semantic maps;
- camera preset;
- return anchor.

This is the common seam between Arena, WorldBuilder and staged Hero Shots.

## S4 · Shared semantic FX/SFX

Reuse current Combat/Travel/Pinball/VFX donor work.

Games emit semantic events.
FX/SFX maps choose presentation.
No game should create another global FX/audio engine solely to use a cue.

---

# Cross-strand additions

The full KFB architecture now treats these as first-class relationships:

```
CubePet / KayKit / Legacy / procedural actor families
        │
        ├→ ToolBox Face / Pose / Animation
        ├→ Resident Scene / Living NPC
        ├→ Duel Choreography
        └→ Combat Arena / World encounters

Motion Profiles ──→ Animation Studio ──→ Duel Studio
                                   └──→ WorldBuilder locomotion

Surface Adapter (FLAT/SPHERE/TORUS/…)
        │
        ├→ Ground
        ├→ Drive
        ├→ Flight
        ├→ Boat
        └→ Vertical traversal

Hex/Voxel/Card vertical structures
        ├→ Platformer traversal
        ├→ Combat encounter bands
        └→ flight/freefall return

Spindle + Curtain + semantic FX/SFX
        └→ shared Stage/Instance presentation

ChatterBox + Memory + Gift hooks
        └→ Living Resident Module
              └→ Town / any WorldBuilder world
```

# Race / World production simplification · 2026-09-24

These decisions refine existing STRAND R, STRAND W, STRAND A and STRAND S. They do not create new owners.

## R6 · Authored Track Recipes + Bake

Do **not** build a general spline editor for the first playable result.

Use a few authored route recipes:

- `TRACK_A_STUNT_8` — figure-eight / over-under, one base jump, one Hero step-down, one bridge/tunnel/flap feature;
- `TRACK_B_OVAL_EXIT` — broad oval/zero-like loop with one branch/exit;
- `TRACK_C_FLOW_LOOP` — handling/freeplay course preserving the human-positive v0.8 mental model.

Compiler flow:

```
Route Recipe
→ deterministic route samples/frames
→ RKIT rounded profile sweep
→ authored stunt modules
→ Track Module Bake
```

Track Module package:
- compact recipe;
- deterministic route;
- stunt zones;
- baked visual GLB;
- contact/collision metadata owned by Race;
- anchors;
- role-named materials;
- provenance/source.

Runtime should not rebuild heavy visual geometry every load when the recipe/profile sources have not changed.

### Physics for the kit

Stunt geometry is dimensioned against **Rapier**:
- 15 m/s² downward gravity magnitude;
- 27 m/s speed basis;
- proven physical ramp.

The accepted v0.8 Track-Lab steering/drift/grip feel is retained as a handling donor/target, not as a second airborne/contact truth.

Jump family:
- `JUMP_BASE` ≈ 12 m forgiving/base;
- `JUMP_HERO_30` ≈ 30 m step-down headline stunt.

Canonical width ladder remains:
`10.8 / 14.4 / 18.0 / 21.6 m`.
28.8 m, if retained, is a named special module/profile only.

## W8 · Baked OSM World Zones

The existing `dom-zentrum-v0` pipeline already proves the correct basic idea:
source OSM → normalized metre frame → reusable scene data.

Formal World Zone compile:

```
source query/extract
→ normalized semantic metre-frame data
→ deterministic world/city compiler
→ baked visual/support package
→ WorldBuilder placement
```

A runtime/editor World Zone does not fetch Overpass again.

Each package keeps:
- source spec/query;
- source timestamp/hash;
- normalized semantic data;
- roads/buildings/anchors;
- baked visual mesh;
- support/collision representation;
- provenance;
- compiler/look profile revision.

First production proof uses Cologne because the source/cache/anchors/landmarks already exist.
Barcelona is the **second-city portability proof**.

OSM remains geographic truth inside its source zone.
WorldBuilder may freely compose fictional worlds by placing external landmarks or modules on top.
A Cologne Cathedral placed in Barcelona is an **authored landmark instance**, not Barcelona OSM truth.

## W9 · Landmark / Elastic Torsion proof

Current Hürth R2 remains frozen. No patch pass.

The next isolated form-language architecture proof adds an explicit height-dependent **TORSION / TWIST** channel using existing GROTESQUE / BuildingElastic / LandmarkElastic donors.

Existing City GROTESQUE reference proves:
- multi-step vertical segmentation;
- bend;
- lean;
- taper;
- twist around 11° as an existing strong donor setting.

New Elastic direction:
- ordinary buildings: low twist range;
- tall / hero landmarks: stronger cumulative twist;
- base stays anchored;
- bend + lean + twist share a coherent height field;
- roof/body union follows the same final silhouette;
- camera skew may amplify the effect but cannot fake it alone.

This is the route toward the desired wonky 90s-cartoon perspective for towers/landmarks.

## A6 · Music Performance layer

Songs are reusable media; performances are choreography recipes.

Performance metadata:
- `songRef`;
- BPM;
- bar/beat offset;
- performer ids;
- action/choreography refs per performer;
- loop/start/finish markers;
- stage/camera recipe refs.

Animation Studio should expose a beat/bar ruler when music is present.

Use this for Warband, Animatronic, dance scenes and later Town gigs/Hero Shots.

## S5 · Sound Audition Library

Georg should select sounds by **meaning and hearing**, not filenames.

Build one audition surface over existing semantic manifests and sound banks.

Human categories:
- vehicle;
- combat;
- UI/card;
- world/ambience;
- transition;
- performance/crowd.

Each sound candidate shows:
- human label;
- play/A-B;
- semantic event;
- one-shot/loop;
- duration/intensity;
- source/license;
- current consumers;
- accept/hold/reject.

Games emit semantic events such as `vehicle.jump`, `vehicle.land`, `melee.hit`, never opaque file ids.

Existing donors:
- Pinball semantic audio manifest;
- Combat SFX maps;
- Race telemetry SFX proof;
- RoadTrip/Jukebox music/audio sources.

## S6 · VFX Audition Library

Start from proven source packs/modules, not hand-authored effect micro-slices.

Current donor bank already contains:
- Combat Ink Atlas / recipes / trails / flame / sprites;
- Kenney smoke particle sources;
- Brackeys VFX bundle sources indexed in the existing VFX review;
- Race/vehicle presentation effects.

Audition categories:
- burst;
- loop;
- trail;
- impact;
- muzzle;
- smoke/fire;
- reveal;
- transition;
- environment.

Each accepted effect becomes a small semantic recipe:
- source donor;
- event id;
- anchor;
- emission/lifetime;
- scale/intensity;
- cleanup;
- optional variant.

Adapt existing donors before authoring new effects.
Example: a continuous-fire donor can become a single-shot muzzle/burst recipe by changing emission/lifetime if the donor supports that presentation.

## Production rule for Sound/VFX

```
source packs/manifests
→ automatic inventory
→ human-readable audition board
→ Georg selects visual/sonic direction
→ small semantic recipe batch
→ shared Review Scene
→ promote selected recipes
→ consumers use semantic ids
```

Do not make Georg inspect opaque filenames or approve one low-level effect file at a time.

# STRAND Z · Card Zones and Card Objects

## Target product

Card Zones become a reusable KFB world/content module family rather than an old Voxel-only scene.

A complete Card Zone may combine:

- local zone/platform geometry;
- animated moat / ponds / river;
- card-seeded palette/story/fluid/material parameters;
- 3D card deck/stack;
- card unfold/reveal;
- projection/beam;
- Card Cube with six content surfaces;
- Face Focus / real card/PDF/detail view;
- local props / Residents / encounter hooks.

WorldBuilder places the Card Zone. Card Zone owns its local card-zone presentation grammar; it does not become the global terrain owner.

## Source hierarchy · binding

### Authority 1 · original Card Zone Lab v2

Exact current source:
`tools/KFB-ToolBox/_inbox/KFB Card Zone Lab v2/card-zone-lab-v2-full_2026-09-22/KFB Card Zone Lab v2.dc.html`

This source contains the behaviors that matter:
- `buildFluidSurface`;
- `buildProjection / updateProjection`;
- `buildCardCube / refreshArtFace / snapQuat / tickCube / faceToCamera`;
- `buildStack / prepReveal / poseCard / tickReveal / tickCard / setCardSide`;
- card-seeded zone logic.

When a later module and this source disagree, inspect the exact source first.

### Authority 2 · exact source-locked fluid donor

StoryMap recovered the real shader as:
`kfb-fluid-v2/card-zone-v2-fluid-source.js`.

This is the preferred reusable **fluid shader source** because it was copied source-locked from Card Zone v2 after the previous approximate extraction failed.

Important distinction:
- source identity / shader code = recovered correctly;
- StoryMap's visible water integration remained human-unverified/open at its last handoff.

Therefore:
**source-correct is not consumer-accepted.**

### Historical extraction evidence only

The older `kfb-fluid-v1` / `kfb-beam-v1` / `kfb-cardstack-v1` module map is useful to locate seams and methods.

It is **not automatically authority**:
- the full Card Zone export explicitly stopped the extraction path after repeated failures;
- StoryMap later deleted its `kfb-fluid-v1` as a diminished form.

Reuse its module boundaries only after parity with the actual source is proven.

## Z1 · Fluid Surface + Card-Zone Hydrology · READY

Split the reusable concern into two layers without rewriting the shader:

### Fluid Surface
Owns:
- exact shader uniforms/material/tick behavior;
- `waterdudv.jpg`;
- `water.jpg`;
- flow attribute contract;
- visible animated surface.

### Card-Zone Hydrology
Owns the Card Zone local geometry/field:
- moat;
- irregular shore;
- ponds;
- channels;
- river;
- water level / flow field;
- bubbles where enabled.

A WorldBuilder lake/pond may consume **Fluid Surface** without becoming a Card Zone.
A placed Card Zone consumes both layers.

Human proof:
one page shows:
1. exact Card Zone v2 source water;
2. reusable Fluid Surface wrapper under the same textures/uniform/timing;
3. one WorldBuilder-hosted pond/moat consumer.

No simplified procedural replacement is acceptable.

## Z2 · Card Stack + Reveal + Beam · READY

Recover/adapt the exact source behaviors as one Card Presentation family:

- physical 3D stack/deck;
- variable deck height where current source supports it;
- flat card on deck;
- unfold/reveal animation;
- front/back side control;
- Beam / projection effect;
- source-backed real KFB card rendering.

Do not create a new card renderer.
Card art comes from the existing card owner/painter.

The stack/reveal and Beam may be independently enabled, but one review should show the complete beat:

```
stack
→ card prepares
→ beam/reveal
→ card unfolds
→ readable front
→ optional detail / cube handoff
```

## Z3 · Card Cube + Face Focus · READY

The Card Cube was never safely promoted by the old module extraction and must be recovered from the actual v2 source.

Preserve the source mental model:
six content faces, including the established categories around:
- Art;
- Title;
- Power;
- Lore;
- Related;
- contextual detail/chat face where the current product still admits it.

Interaction:
- free rotate;
- snap a selected face to camera;
- refresh real card art;
- Face Focus opens the actual detailed content surface / PDF-card view rather than a fake texture.

This is a reusable Viewer module for:
- Card Zones;
- Almanac;
- ToolBox/Card authoring;
- selected Story/World scenes.

It does not own card collection/progression.

## Z4 · Card Zone Recipe · HOLD until Z1–Z3

Define one compact authored recipe:

```
card/deck ref
zone-local support recipe
fluid profile
story/card seed
palette/profile refs
stack/reveal settings
cube/viewer settings
beam settings
Resident/prop refs
encounter/reward hooks
```

The historical v2 seed behavior remains a donor:
story mode / palette / filling / wear / texture / moat width.

Recipe stores refs + parameters, not copied source assets.

## Z5 · WorldBuilder Card Zone Module · HOLD

WorldBuilder Resource Picker can search/place a configured Card Zone like any other world module.

Workflow:
```
search Card Zone
→ place on current world surface
→ transform root
→ enter local zone / interact
→ collect/reveal/view card
→ Save World refs/transforms
```

Boundaries:
- WorldBuilder owns world placement/support;
- Card Zone owns local card/water/zone presentation;
- Player Journey owns collection/reward facts;
- Combat may mount an encounter through its existing adapter;
- Fluid Surface may also be used elsewhere in the world independently.

## Z6 · Card Zone Production Milestone

One direct review:
```
walk/drive to placed Card Zone
→ animated moat/river visible
→ cross/enter zone
→ real 3D stack
→ Beam + unfold reveal
→ inspect via Card Cube / Face Focus
→ collect
→ card appears in Player Journey / Almanac
```

No separate human gate for every shader uniform/module seam.

---

# STRAND M · Player Meta, Fractal Almanac and Adaptive Interface

## Target product

One cross-mode **Player Journey / Meta state** connects what happens in:

- Walk / WorldBuilder-play mode;
- Race / Drive;
- Travel / Flight / Boat;
- Combat;
- Town / NPC encounters;
- Card Zones;
- minigames / instances.

The UI adapts to the current mode, while the durable player facts remain one truth.

This strand is **not** a universal gameplay runtime.
It owns cross-mode player meta/progression data and the shell that presents it.

## Existing donors

### Journey state
`overworld/overworld/journey.js` already proves:
- versioned save schema;
- JSON export/import;
- migrations;
- cards;
- diary;
- reputation;
- quests;
- hero/unlocks;
- zones;
- semantic journey facts.

This is the primary data-model donor, not an instruction to resurrect the old Overworld runtime.

### Fractal Almanac
Current concept direction already defines the Almanac as more than Card Inventory:
- collection;
- diary;
- story editor;
- quest memory;
- replay library;
- progress map;
- Journey archive;
- personal Infinite Canvas.

The old walked-chamber briefing remains an experiential donor for the **immersive Almanac mode**, not a rule that every gameplay HUD must behave like that chamber.

### Card Fan / Pop
Travel `collect-hud.js` proves:
- real-card fan;
- card count/detail affordance;
- local Pop score;
- collection intake animation.

But its `popScore` is local runtime state.
It is **not** the future account owner.

### Race HUD v3
Useful visual/product donor:
- Tacho retained;
- Radio = three large controls + volume;
- real landscape-card Almanac motif;
- minimap = actual route only.

Its current Stage state is not a global HUD acceptance.

## M1 · Player Journey Contract · READY

Consolidate a versioned cross-mode data contract from the existing Journey donor.

Candidate durable domains:

```
version / migrations
session/run refs
cards / decks collected
diary / semantic events
quests / closures / discoveries
reputation / NPC encounter facts
POP balance / award facts
inventory
songs / media unlocks
vehicles / travel unlocks
gift/reward facts
replay / choreography / cutscene refs
settings / audio preferences where appropriate
```

Hard rule:
**authored WorldBuilder world state is separate from player Journey state.**

WorldBuilder saves the authored world.
Player Journey saves what the player experienced/earned inside worlds.

Consumers emit typed semantic events instead of directly owning global progression.

Examples:
- `card.collect`;
- `pop.award`;
- `inventory.add`;
- `song.unlock`;
- `gift.receive`;
- `npc.encounter`;
- `race.stunt.complete`;
- `combat.encounter.win`.

The Journey owner applies/migrates durable state.

## M2 · Fractal Almanac · READY after M1 schema

Two related surfaces:

### Quick Almanac affordance
Georg direction:
**persistent upper-right card fan in ordinary gameplay modes.**

Use real KFB landscape Card motifs.
It opens the lightweight collection/Journey overlay.

### Full Almanac
A deeper view over:
- cards/decks;
- Diary;
- Journey path;
- quests/memory;
- replay/cutscene refs;
- discoveries;
- NPC/gift history;
- later story-editing / Infinite Canvas.

Optional immersive walked-chamber mode may open from here.

When the immersive Almanac chamber is active, the ordinary gameplay HUD is suppressed except for minimal exit/return affordance. This preserves the old Almanac chamber's intentional non-dashboard experience.

Import/export:
the versioned Journey JSON is the portable Diary/session object.

## M3 · Backpack Inventory · HOLD after M1

Georg current product direction:
**one backpack overlay with 20 visible slots.**

Historical implementation/source for this exact 20-slot sketch is currently not pinned.
Status:
`USER_DIRECTION · HISTORICAL_SOURCE_REQUIRED`.

That does not block the new product direction; it blocks claims that an old implementation is being reused.

Initial inventory contract:
- exactly 20 visible carry slots;
- typed item refs;
- quantity/stack only where item type allows;
- gifts/props/consumables/keys/modules may live here;
- cards normally belong to the Almanac/collection, not one slot per card;
- accepted inventory mutations go through Player Journey.

HUD exposes a backpack affordance; overlay owns the 20-slot presentation.

## M4 · Universal POP Account · HOLD after M1

POP becomes one durable cross-mode balance.

Canon protection:
POP remains the progression/reaction currency with its existing KFB meaning.
It is not a plausibility/truth score.

Consumers do not maintain authoritative private POP totals.

Instead:
```
Race / Combat / Travel / Card Zone / Town
→ pop.award event
→ Player Journey reducer
→ durable balance
→ HUD display / feedback animation
```

Existing Travel `addPop()` becomes a presentation/event adapter, not the ledger.

The HUD may show POP compactly across ordinary gameplay modes.

## M5 · Collected Music / Radio · HOLD after M1 + Audio Audition

One shared music/radio state:
- collected/unlocked tracks;
- active track;
- playback state;
- volume/preferences;
- optional playlist/favorites later.

The current Race three-control Radio is a presentation donor.

The Radio shell may stay compact across modes while the same music can continue through Walk/Drive/Travel when the host allows it.

SFX event audio remains with game/presentation owners; Radio is music/media, not a replacement global SFX engine.

## M6 · Navigation / Minimap Provider · HOLD after mode adapters

Do not build one fake universal minimap.

HUD asks the active context for a navigation provider.

Examples:
- Race → actual route;
- World/OSM → current zone/world map;
- local Card Zone / Dungeon → local map only if a real provider exists;
- Flight/Boat → mode-specific navigation provider when implemented;
- Almanac immersive chamber → intentionally **no minimap/compass** unless that product decision is changed.

No provider = no minimap.

## M7 · Adaptive HUD Shell · READY

Define semantic HUD slots rather than one fixed Race layout.

Persistent/meta candidates:
- upper-right Almanac fan;
- compact POP;
- Backpack affordance;
- Radio/media affordance.

Context providers may add:
- Navigation/Minimap;
- mode instrument;
- Combat state;
- interaction prompt;
- transient reward/collection feedback.

Example profiles:

### WALK / WORLD
Almanac + POP + Backpack + compact Radio + optional world navigation.

### DRIVE / RACE
same meta truth plus:
- Tacho / mode instrument;
- actual route minimap;
- driving Radio controls.

### FLIGHT / BOAT
same meta truth plus the current mode's real instrument/navigation providers once they exist.

### COMBAT
same meta truth in reduced form plus Combat-owned encounter status.

### ALMANAC IMMERSIVE
ordinary gameplay HUD hidden.

The shell stores no game physics/combat/navigation truth itself.

## M8 · Skin / Interface Grammar

The HUD must be visually coherent and skinable without every mode rebuilding its controls.

Share:
- spacing scale;
- typography roles;
- surface/ink/shadow language;
- icon semantic registry;
- selected/pressed/disabled states;
- motion timing families;
- accessible contrast/legibility rules.

A world/theme can override approved skin tokens.
It must not move gameplay ownership or rename canonical actions.

Player HUD and ToolBox authoring UI share the grammar, **not the same layout**.

## M9 · Authoring UI Legibility · READY

Current shared editor functionality is good; the inline toolbar presentation is not.

Measured current Resident/Editor donor:
- buttons: **28×28 CSS px**;
- glyphs: **13 px**;
- symbols: `✥ ⟳ ⤢ ⬓ ⊹ ✕`.

Georg finding:
the controls are learned by position rather than icon recognition.

Next authoring-UI pass:
- preserve the accepted shared `edit-layer.js` behavior;
- redesign only presentation/interaction affordance;
- normal authoring hit target around **40–44 px** rather than 28 px;
- visibly legible icon artwork/glyph around **20–24 px**;
- recognizable semantic icon family for Move / Rotate / Scale / Drop / Axis-Space / Close;
- strong active-mode state;
- tooltip with action + shortcut;
- optional text label in expanded/learning mode;
- compact mode may exist later, but not as the default if recognizability is lost.

Do not replace inline editing with a giant permanent toolbar high in the field of view.
The tool remains context-local to the selected object.

The same icon semantics should be used in ToolBox and WorldBuilder authoring.

## M10 · Cross-Mode Meta/HUD Milestone

One Journey import is used across several real contexts:

```
import Journey
→ WALK: Almanac/POP/Backpack visible
→ collect Card Zone card
→ Almanac updates
→ enter vehicle
→ DRIVE profile adds Tacho + real minimap
→ earn POP
→ switch to Combat
→ Combat profile appears, same POP/Journey persists
→ receive NPC gift
→ inventory or collection updates by typed reward
→ Radio track unlock persists
→ export Journey JSON
→ reload/import
→ same meta state restored
```

The acceptance question is whether this feels like **one game identity across modes**, not whether each widget has its own test dashboard.

---

# New cross-strand relationships

```
Card Zone v2 source
  ├→ exact Fluid Surface ───────────────→ WorldBuilder water consumers
  ├→ Card Stack / Reveal / Beam
  ├→ Card Cube / Face Focus
  └→ Card Zone Recipe ─────────────────→ WorldBuilder placeable module
                                            │
                                            └→ card.collect / pop.award
                                                   │
Race / Travel / Combat / Town / Minigames ────────┤
                                                   ↓
                                           Player Journey / Meta
                                            ├→ Fractal Almanac
                                            ├→ POP account
                                            ├→ 20-slot Backpack
                                            ├→ collected Music/Radio
                                            └→ Adaptive HUD profiles

Shared Interface Grammar
  ├→ Player HUD shell
  └→ ToolBox / WorldBuilder authoring controls
```

# P2 lane · Skills / Runtime Contracts Consolidation

This is repository/runtime hygiene, not a new game runtime and not a P0 blocker.

Current problem:
`skills/` mixes live contracts, stale registries, historical PetStudio/PatchStudio packages, superseded embed bundles and even binary assets.

The current census/decision document is:
`SKILLS_RUNTIME_CONSOLIDATION_2026-09-24.md`.

## K1 · Skills census · READY / P2

Repository-native scan only.

For every top-level skill/doc/bundle:
- classify current/legacy/historical/misplaced;
- identify current runtime owner;
- scan imports/links/consumers;
- record supersession;
- decide whether the path must remain for old consumers.

Outputs:
- `SKILLS_RUNTIME_CENSUS.json`;
- `SKILLS_MIGRATION_MAP.md`;
- `SKILLS_CONSUMER_IMPORT_SCAN.json`.

No files are moved/deleted in K1.

## K2 · Current runtime skill shelf · HOLD after K1

Create/update a small set of canonical current entrypoints:

1. Actor Embed / Actor Platform with family dispatch;
2. PDF/Card Corpus + Viewer;
3. CardBuilder;
4. Ink Canon + 3D adapter contract;
5. Talk / Viseme / Speech+Thought Bubble;
6. Material Surface / zone Color+Texture;
7. current Motion/Animation;
8. current production/session skills.

Update the stale `SOT_REGISTRY.md` into a current versioned registry or superseding registry.

Legacy files that still have consumers stay at their paths with explicit compatibility/supersession headers.

## K3 · Compatibility-safe archive · HOLD after K1/K2

Only after consumer/import proof:
- move/archive zero-consumer history where useful;
- reconcile misplaced binaries against Asset Librarian/media paths;
- retain compatibility shims/redirects where old apps need the path;
- delete only under a separate explicit cleanup gate.

Hard rule:
**archive must never be the act that discovers a hidden consumer.**

## K4 · Ink 3D adapter family · HOLD after current Ink skill lock

Do not create another Ink canon.

Derive reusable world-space adapters from current `kfb-ink-canon.js` semantics:
- surface ribbon/decal for shoreline/map/road/track boundaries;
- tube/rope extrusion for physical 3D lines such as wrestling-ring ropes;
- card/mesh outer-silhouette adapter that never outlines every triangle or creates doubled front/back grids.

The existing implementation term `family:'band'` means the continuous closed ink ring/ribbon. Author-facing terminology may say “ring/ribbon”, but implementation compatibility stays stable.

## K5 · PDF/Card Viewer consumer unification · HOLD after K1

Use:
- `kfb-card-builder.js` for canonical KFB card rendering;
- Deck Viewer v4 / `kfb-corpus.js` for performant PDF/page/cache/presentation donors.

Consumers include:
Card Zones · CardRig/Storytelling · Billboards · Fractal Almanac · Afterglow/reward · ToolBox.

Do not make every consumer implement pdf.js, crop math, card ink or its own page cache.

# Adjacent open lanes · integrate as modules, not new mega-strands

These remain relevant but should feed the thirteen primary strands rather than create another control plane.

## 2D / 2.5D Animation Studio

Current owner remains `tools/2D Animation Studio/`.

Integration:
- expose accepted `three2p5d` actors through the same Actor Capability Matrix;
- allow Resident Scene modules and WorldBuilder placement;
- Combat support only through an explicit 2D/2.5D semantic adapter;
- do not convert 2D rigs into KayKit skeletons.

## Storytelling Maps / Responsive CardRig / Billboards

Integration:
- Resource Picker can place accepted CardRig/Billboard/media modules;
- Shared Stage Recipe can use them as scene/media surfaces;
- WorldBuilder can mount them as authored world content;
- no second card renderer inside WorldBuilder.

## Dungeon / Environment Atlas

Integration:
- Dungeon keeps room/layout generation ownership;
- WorldBuilder places a Dungeon/room instance or entrance;
- Shared Stage/Curtain handles entry/return;
- Combat Encounter adapter supplies raid/combat when requested;
- Resident Scene modules populate rooms.

## Card Zone / Project Islands

The working Card Zone v2 semantics remain the donor.

Integration:
- Vertical/Babel strand may use Card platforms/islands;
- WorldBuilder may place Card Zones as content;
- Combat Tower may use a card as encounter support;
- card rendering/reveal/collection ownership remains with Card systems.

## VFX / SFX Consolidation

Fold into STRAND S rather than creating a universal FX mega-engine.
Semantic events map to current source-backed Combat/Travel/Race/Pinball/VFX recipes.

## Tourbus / WaterBowser

Treat later as a composite Living Vehicle Scene:
- vehicle/Drive owner;
- Resident passengers;
- ChatterBox/NPC encounter hooks;
- billboard/card display;
- gifts/collection;
- parking/hub state.

Do not invent a Tourbus-specific movement, dialogue or card engine.

## Graveyard / Boxel / other mini-games

Each remains an instance/minigame owner.
WorldBuilder/Town may place an entrance/instance anchor; Curtain/Stage recipe can cover transition/return.
No requirement to merge every mini-game runtime into the open world.

# Cross-strand dependency map

```
EyeRig batch ───────────────┐
Vehicle EyeRig ─────────────┤
Resident Pose Studio ───────┤
Motion Library/Profiles ────┼→ ToolBox Production Milestone
Blender Performance Batch ──┘            │
                                         ├→ WorldBuilder W2/W3/W4
Asset Librarian / Picker ────────────────┘

WB-W0 → W1 Authorable Place → W2 Search/Place → W3 Fractal Edit → W4 Animation
                                                        │
OSM/Form Language ──────────────────────────────────────┼→ W5
Race Anatomy → Race Visual Module ──────────────────────┼→ W6
                                                        └→ W7 God Mode
```

Parallel work is encouraged where dependencies are already satisfied.

---

# Hub behavior

The Hub should show **strands**, not an undifferentiated wall of PRs.

Each strand card exposes:
- target product;
- progress `x / y capabilities`;
- current READY milestone;
- downstream prepared milestones;
- one copy-ready start prompt;
- relevant human reviews only.

Recommended sections:
- **ToolBox**
- **Animation & Residents**
- **WorldBuilder**
- **Racer / World**
- **Quick 3D Review**

Opening a strand shows the whole route so Georg knows what comes next without asking an architecture chat.

---

# Production rule

When a milestone completes, the executing chat updates its result/status. The architecture lane should not be needed merely to author the next briefing because the next milestones are already specified here.

Architecture returns only when:
- a source owner changes;
- two prepared strands conflict;
- a new reusable cross-project capability appears;
- a product decision changes the dependency graph.
