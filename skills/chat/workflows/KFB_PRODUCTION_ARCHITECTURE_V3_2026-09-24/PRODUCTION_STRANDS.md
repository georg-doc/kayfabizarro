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
→ FrankenStein/Face
→ EyeRig
→ hierarchical/fractal edit
→ pose bones
→ assign/test animation
→ place/scale props
→ Save
→ Reload
→ continue editing
→ export reusable scene/actor configuration
```

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

# Adjacent open lanes · integrate as modules, not new mega-strands

These remain relevant but should feed the eleven primary strands rather than create another control plane.

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
