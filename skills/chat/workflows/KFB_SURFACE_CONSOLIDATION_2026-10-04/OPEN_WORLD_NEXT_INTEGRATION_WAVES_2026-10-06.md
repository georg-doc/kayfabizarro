# KFB Open World · Next Integration Waves · 2026-10-06

Status: **CURRENT PREPARATION PLAN · DO NOT INTERRUPT RUNNING COWORKER**
Owner: **KFB Production Control / Surface Consolidation**
Receiving product: **KFB Open World / WB2 · Issue #360 · Draft PR #348**
Current executor: **Claude Coworker**
Next executor after exact Coworker return: **ChatGPT Work/WSA Anschluss-Integrator**

This file is a routing/integration plan, not a runtime owner.
Actual World implementation stays in the current World/WB2 receiving owner.
GitHub state overrides this plan.

## 0 · Current rule

Do not add new scope to the running Coworker job.

First:
1. let Coworker finish the current Open World core;
2. capture its exact local/GitHub return, files, source identity and evidence;
3. classify the returned product against the binding Open World integration matrix;
4. then integrate only the missing owner seams.

No parallel rebuild.

## 1 · Current likely core from the running Coworker job

Based on the latest Georg-visible pause report, currently evidenced:
- Open World foundation / seeded world;
- terrain / roads / collision repair;
- player / native motion / jump anticipation;
- camera / real-input traversal;
- current QA/critic loop;
- performance check still pending;
- final critic round + blind source comparison still pending.

Do not mark any other KFB module as integrated until the final Coworker RETURN proves it.

## 2 · Required existing KFB systems still to reconcile

Binding source:
`tools/KFB-ToolBox/worldbuilder/procedural-test-world-01/OPEN_WORLD_EXISTING_SYSTEM_INTEGRATION_MATRIX_2026-10-05.md`

Treat as `PRESENT / PARTIAL / ABSENT / BROKEN` after Coworker return:

- Joyride-designed Track Core / Road / Stunt authoring;
- Sky / Skydome / Environment;
- Asset Librarian + authoring + persistence;
- Clay Billboard / HyperNormalisation media;
- Resident + ChatterBox + clay speech/thought bubble presentation;
- Card + Almanac provenance;
- Audio / adaptive musical world;
- Vehicle / Drive;
- Signature / Landmark modules;
- Theatre Curtain / transition compatibility.

## 3 · New registered donor · Seed World Mech Destruction POC 01

Source:
`main@97c891c006a65a2d8ebba17bfbe7baaa4384edf0`

Root:
`tools/KFB-ToolBox/_inbox/KFB Seed World Mech Destruction POC 01/KFB_SEED_WORLD_MECH_POC_01_2026-10-06/`

Canonical reads:
- `seedworld/docs/START_HERE.md`
- `seedworld/docs/HANDOVER_2026-10-06_r2.md`
- `seedworld/docs/INTEGRATION_OPEN_WORLD.md`
- `seedworld/docs/MODULE_CONTRACTS.json`
- `seedworld/docs/ARCHITECTURE.md`
- `seedworld/docs/TEST_REPORT.md`

Classification:
**PRODUCT = RESEARCH PLAYGROUND**
**DONOR = HIGH-VALUE**

Do not create a second World runtime from the POC.

### 3A · ADOPT / DONATE into Open World

**Seeded settlement provider**
- `sw-gen.js` + selected `sw-mesh.js` logic;
- deterministic stable parcel/building IDs;
- road-facing buildings;
- external `heightAt` injection;
- authored `suppress/replace` overrides;
- best fit: optional authored/generated settlement zone, far-field provider or raid-instance source.

**Streaming pattern**
- ring streaming;
- worker → blob-worker → main-thread fallback;
- stale-result drop;
- fixed slot recycling;
- bounded integration queue / frame budget.

DONATE pattern into the existing World streaming owner; do not create a second streamer if Coworker already solved this better.

**Damage persistence**
- 2-bit cell state keyed by stable BuildingRecipe IDs;
- recipe + bits reconstruct state;
- strong fit for World Recipe persistence.

**Combat Mech actor profile**
- source-proven Combat Mech + Minigun mounts;
- becomes an actor/profile under the existing player owner;
- not a second controller.

**Flight / Walk / Air mode grammar**
- exactly one locomotion writer per mode;
- walk → air → flight transitions;
- double-Space / take-off behavior is donor logic only;
- reconcile to current Motion SSOT and accepted Ground↔Flight transition contract.

**Camera + input guards**
- occlusion shortens boom; does not lift camera;
- focus-loss / Meta / pointer guards;
- donate as rules to current player/input owner.

**QA patterns**
- deterministic T1–T4;
- pool/cap checks;
- streaming-budget checks;
- reusable as module tests.

### 3B · HOLD for Combat owner, not World Core

**Destructible buildings runtime**
- `sw-destruct.js`;
- destructible cells;
- support cascades;
- promotion/demotion;
- rubble/debris pools.

**Weapons / FX**
- Minigun / rockets;
- projectile/damage behavior;
- `sw-fx.js`.

Ownership:
**Combat Arena owns weapons, damage, enemies, health and destructive combat rules.**

Open World should expose:
- destructible-capable building identity/state;
- activity/raid entry context;
- safe return;
- world consequences/results.

Preferred integration:
`Open World portal/activity → Combat/Destruction instance → result record → World persistence`

This avoids contaminating ordinary exploration with a second combat runtime.

### 3C · Flight integration decision

Default recommendation:
**YES: carry the Combat Mech into Open World as one optional playable actor/profile with Walk + Flight.**

Reason:
- flight is traversal, not inherently Combat;
- current POC already separates locomotion modes from weapons;
- it gives Open World a useful high-altitude inspection/authoring/travel mode;
- weapons can remain unavailable outside explicit Combat/Destruction activities.

Architectural split:
`World Player Owner → Actor Profile → Locomotion Mode (Ground/Flight)`
versus
`Combat Owner → Weapon/Destruction Capability`

Do not make “flying mech” automatically mean “armed combat everywhere”.

## 4 · Recommended integration waves

### Wave A · Close Coworker core
Executor: **Claude Coworker**
- finish current repairs;
- performance;
- final allowed whole-product critic;
- blind source jury;
- RETURN.

No new modules during this wave.

### Wave B · Physical traversal + environment closure
Executor: **ChatGPT Work/WSA Anschluss-Integrator**
Design input where needed: **Claude Design**

Integrate/reconcile:
1. Joyride Track Core J14/T4/K2 visible presentation;
2. Sky / Skydome / Environment;
3. Vehicle / Drive;
4. Combat Mech actor profile + Flight mode;
5. only the Seed World streaming/generator patterns that improve the returned Coworker architecture.

Rules:
- one World owner;
- one Track owner;
- one Sky owner;
- one player-transform writer per locomotion mode;
- no POC ribbon-road presentation;
- no second procedural world owner.

### Wave C · Audio bed / world context
Executor: **ChatGPT Work/WSA**
Audio owner: **KFB Audio PR #365**

Integrate one World → Audio context adapter:
- biome / zone;
- movement / staying / airborne / drive;
- dayPhase / weather;
- POI proximity / discovery;
- dialogue / narration focus.

Keep one AudioContext / mixer / MusicClock.
Validate M/N/O independently before activation.

### Wave D · Living world
Runtime integrator: **ChatGPT Work/WSA**
Presentation/design: **Claude Design**
Data/content: **ChatGPT Web Chat**
3D/rig gaps only: **Blender MCP**

Integrate:
- one real Resident;
- native current Motion;
- current ChatterBox/Triplet semantic owner;
- clay speech + thought bubble presentation;
- EyeRig / mouth only from existing owners;
- dialogue → Audio Speech Focus.

### Wave E · Media + knowledge
Runtime integrator: **ChatGPT Work/WSA**
Content/data: **ChatGPT Web Chat**
Visual presentation: **Claude Design**

Integrate:
- Clay Billboard as placeable/persistent World module;
- one HyperNormalisation quote/read-along loop;
- canonical Card;
- Almanac provenance;
- Billboard/Resident → Card/Deck/Source chain.

### Wave F · Destruction activity
Owner: **Combat Arena**
World adapter: **ChatGPT Work/WSA**
Optional gameplay/design tuning: **Claude Coworker / Claude Design** only inside the bounded owner.

Use Seed World POC destruction as donor:
- cells + support cascade;
- compact damage persistence;
- Minigun/rocket FX patterns;
- seeded destruction/raid instance.

World owns:
- discovery/entry/return;
- seed/context;
- persistent result.

Combat owns:
- weapons;
- damage;
- destruction simulation;
- enemies/health/rewards.

Do not activate this wave until the ordinary Open World is stable.

### Wave G · Signature modules / transitions / polish
- Life Trees;
- Band / Disco / Resident performances;
- landmarks / authored scenelets;
- Theatre Curtain only where a real transition is needed;
- final integrated whole-product QA.

## 5 · Executor routing

**ChatGPT Web Chat**
- source audits;
- mappings/data;
- quote/deck curation;
- Resident/dialogue content;
- integration briefs;
- GitHub/admin.

**Claude Design**
- Joyride visible presentation;
- clay ChatterBox bubbles;
- Billboard/Card/media presentation;
- visual destruction readability if a bounded design pass is needed.

**Blender MCP**
- missing rigs/animation/prop/character assets only.

**Claude Coworker**
- coherent large builder/repair passes when a bounded owner needs autonomous work;
- never parallel against the current World writer.

**ChatGPT Work/WSA**
- multi-owner runtime integration;
- persistence/adapters;
- difficult browser/runtime debugging;
- whole-product reconciliation.

**PUBLISH_ONLY / Sites-capable**
- deterministic existing-Site update only after QA.

## 6 · Architectural target

```
OPEN WORLD CORE
  world model / terrain / roads / chunks
  authoring / persistence
  world context + events
        |
        +--> Track Adapter ------> Track Core + Joyride
        +--> Environment --------> Skydome
        +--> Player Profile -----> Knight / Combat Mech / future actors
        |      +--> Ground mode
        |      +--> Flight mode
        +--> Vehicle Adapter ----> Drive
        +--> Media Adapter ------> Billboard
        +--> Resident Adapter ---> Resident + ChatterBox
        +--> Card Adapter -------> Card + Almanac
        +--> Audio Context ------> KFB Audio
        +--> Signature Adapter --> Life Tree / scenelets
        +--> Activity Portal ----> Combat / Destruction / future minigames
```

Destruction is therefore an **activity capability + persistent world consequence**, not a new Open World owner.

## 7 · Current product recommendation

The Seed World POC should be kept and consumed.

High-value pieces:
- deterministic generator/stable IDs;
- compact damage persistence;
- destruction cells/support cascade;
- streaming budget pattern;
- Mech actor profile;
- Ground↔Flight mode grammar;
- camera/input rules;
- QA checks.

Do not promote as Open World truth:
- its standalone terrain/world renderer;
- its road ribbon presentation;
- its stand-in clay material;
- its independent player controller;
- its independent weapons ownership.

## 8 · Resident Performance Layer · REQUIRED LIVING-WORLD ARCHITECTURE

Current assessment:
**base facial/character donors are substantially more mature than the current World integration.**
The missing piece is a shared orchestration layer.

Existing owner/donor facts:
- EyeRig v6 is current reusable eye owner and already supports:
  - public `eyeFrame()` anchor for brows/nose;
  - asymmetric lids;
  - gaze / point-to;
  - blink;
  - continuous life/wander/tremor;
  - kinetics input for acceleration/curve/drop;
  - explicit emotes.
- PetMouth already provides:
  - male / female / red mouth sets;
  - rest-expression mapping;
  - five named viseme states;
  - surface-fit/wrap behavior;
  - talk/rest/expression channels.
- ChatterBox PR #357 remains a TUNE donor:
  - real 3D Resident requirement;
  - EyeRig v6 + PetMouth required;
  - Triplet semantic kernel/pool/review/export are reusable;
  - no PNG/cutout substitute.

### Required architectural split

Do not let ChatterBox, TTS or dialogue code directly own bones/eyes/mouth.

Use:

```
Resident / Actor
  |
  +--> Body Motion Owner
  |      locomotion
  |      gesture / upper-body
  |      action / prop interaction
  |
  +--> Resident Performance Composer
         |
         +--> Look / Head Target
         +--> EyeRig v6
         +--> Brow Adapter via eyeFrame()
         +--> PetMouth / Viseme Adapter
         +--> Reaction / Emote State
         +--> Gesture / Body Cue
         +--> Speech / TTS timing
         +--> Bubble Presentation
```

### Performance Cue contract

Create one semantic cue layer instead of feature-specific animation calls.

Example conceptual record:

```
{
  speaker,
  listener,
  intent,
  emotion,
  intensity,
  gazeTarget,
  speechState,
  visemeStream,
  browState,
  eyeState,
  headCue,
  gestureCue,
  reactionCue,
  bubbleMode,
  timing
}
```

The exact schema is frozen only after the post-Coworker architecture review.

### Priority / arbitration

Performance channels must compose rather than fight.

Recommended authority order:
1. physical safety / locomotion;
2. explicit action / gameplay animation;
3. dialogue gesture;
4. reaction/emote;
5. idle life.

Face channels may layer independently where safe:
- gaze;
- blink/lids;
- brows;
- mouth/viseme;
- head orientation.

### Reaction vocabulary

Do not hard-code one bespoke animation per dialogue line.

Start with a small reusable semantic vocabulary:
- neutral/listening;
- attentive;
- thinking;
- agreement;
- doubt;
- surprise;
- joy/amusement;
- worry;
- annoyance/anger;
- sadness;
- embarrassment;
- suspicion;
- interruption / turn-taking.

Each reaction maps to:
- EyeRig parameters;
- brow pose;
- mouth rest/viseme behavior;
- head/torso cue;
- optional gesture clip;
- bubble timing.

### Dialogue / choreography

ChatterBox owns semantic dialogue/triplets.
Resident Performance Composer owns presentation/choreography.

Required world behaviors:
- turn toward current speaker;
- speaker gaze → listener / object / Card;
- listener remains alive with subtle reactions;
- turn-taking and interruption cues;
- short pre-speech anticipation;
- gesture accents during clauses;
- reaction hold after line;
- return to idle without pose pop;
- multi-Resident blocking remains spatially readable.

### Mouth / TTS integration

Do not create a second mouth system.

PetMouth is the baseline mouth owner.
For V1:
- use its named viseme layer when timing information is available;
- otherwise use its existing speaking behavior as fallback;
- keep expression/rest state underneath speech;
- Speech Focus/ducking remains KFB Audio-owned.

Future phoneme-quality improvement can refine the adapter without changing ChatterBox or the Resident owner.

### Brows / face attachments

Use EyeRig v6 `eyeFrame()` as the public face anchor.
Eyebrows, nose or later face overlays must not read private EyeRig internals.

If an existing brow donor exists, adapt it to `eyeFrame()`; do not create per-character brow hardcodes.

### Blender MCP role

Blender MCP should fill only real motion gaps:
- dialogue gesture set;
- listening/reaction poses;
- point / shrug / nod / recoil / laugh / think etc.;
- transition-safe upper-body variants where necessary;
- special character-specific performance only after generic reusable gaps are proven.

Do not bake eye/mouth/brow logic into Blender clips when the runtime face owners already control those channels.

### Claude Design role

Claude Design owns visible presentation decisions:
- expression family / brow language;
- clay speech/thought bubble behavior;
- bubble tail / thought pellets;
- Resident spacing / staging;
- reaction readability;
- visual relationship between face, gesture and dialogue UI.

### ChatGPT Web Chat role

Cheap/default:
- reaction ontology;
- choreography grammar;
- character-specific mapping;
- dialogue/performance metadata;
- source audits and brief preparation.

### ChatGPT Work/WSA role

Integrate:
- Resident Performance Composer;
- adapters to Motion / EyeRig / brows / PetMouth / ChatterBox / Audio / bubble layer;
- persistence where Resident performance state actually needs it;
- runtime arbitration and whole-product QA.

### Acceptance target

One real 3D Resident conversation in the actual Open World must demonstrate:
1. locomotion → conversation transition;
2. turn/look to speaker/listener;
3. live eyes + blink + gaze;
4. brows;
5. speaking mouth / viseme behavior;
6. at least two readable reactions;
7. one reusable gesture;
8. clay speech/thought bubble;
9. dialogue audio Speech Focus;
10. clean return to world idle;
11. no competing face/body writers.

This becomes part of **Wave D · Living World** and should be reviewed during the architecture-freeze pass before implementation.

## 8 · Exactly one next gate

**Wait for the exact Coworker Open World RETURN, then run one Work/WSA reconciliation against this wave plan and the binding PR #348 matrix.**

No merge. No Live promotion.
