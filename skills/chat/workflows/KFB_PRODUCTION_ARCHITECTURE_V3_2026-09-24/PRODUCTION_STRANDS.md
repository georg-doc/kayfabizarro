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
