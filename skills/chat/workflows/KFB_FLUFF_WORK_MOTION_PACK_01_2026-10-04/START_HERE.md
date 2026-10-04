# KFB Fluff Work Motion Pack 01 · Blender MCP

Status: **READY FOR BLENDER MCP · REUSE-FIRST · BOUNDED SLICE**  
Date: 2026-10-04  
Owner: **KFB Resident Atlas / Animation Lab**  
Receiving owner: **KFB WorldBuilder / God Mode**  
Branch: `planning/fluff-blender-slice-01-2026-10-04`

## Outcome

Produce a **source-clean reusable Fluff work-motion package** for KFB Residents.

Do **not** author 14 × 2 fresh clips up front.

The first mandatory pass is:

**SOURCE AUDITION → ROLE/CLIP MATRIX → TWO-RIG PREVIEW → GAP LIST**

Only motions that remain real gaps after that pass may be newly authored.

## Read first

1. `skills/chat/START_HERE.md`
2. `skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`
3. `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`
4. this file
5. `REUSE_MATRIX.md`
6. `media/3D_Assets/Animations/KFB_Motion_Library/RETURN.md`
7. `media/3D_Assets/Animations/KFB_Motion_Library/KFB_Motion_Library.catalog.json`
8. current Resident Atlas package:
   `tools/KFB-ToolBox/_inbox/KFB_RESIDENT_ATLAS_SESSION_CUT_2026-10-04_r1/`

GitHub state wins over chat memory.

---

# 1 · Canon

**Fluff** is the colorful clay-like world matter of KFB.

It is simultaneously:

- primordial world matter;
- harvestable resource;
- trade / gift material;
- building and repair matter;
- destruction/recycling debris;
- physical basis of biome-specific props;
- soft score / standing language.

### Vibrational polarity

**High-vibrational Fluff**
- coherence;
- bonding;
- assembly;
- growth;
- repair;
- stabilization.

**Low-vibrational Fluff**
- loosening;
- dismantling;
- decay;
- erosion;
- recycling;
- destabilization.

**High ≠ morally good. Low ≠ morally evil.**

They are material behaviours first.

---

# 2 · Owner boundaries

### Blender / Resident Atlas / Animation Lab owns

- motion audition;
- rig validation;
- reusable work actions;
- contact / loop evidence;
- isolated Fluff prop look references;
- optional prop-only bounce reference.

### WorldBuilder / God Mode owns

- world translation;
- terrain;
- island growth/subtraction;
- physics;
- pickup trigger;
- collision/support;
- Fluff inventory;
- Lifetime Fluff / standing;
- construction / destruction state;
- persistence.

### Dungeon Generator S13.2 owns

- dungeon topology;
- rooms / corridors / levels;
- recipe graph.

### Existing Audio owner owns

- pickup `POP`;
- music transport.

**Do not create a second locomotion, physics, world, persistence, audio or dungeon owner.**

---

# 3 · Source lock · rigs and first actors

## Canonical Motion Library

`media/3D_Assets/Animations/KFB_Motion_Library/`

- `KFB_Motion_Library_Rig_Medium.glb`
- `KFB_Motion_Library_Rig_Large.glb`
- `KFB_Motion_Library.catalog.json`

Accepted facts:

- one 23-bone armature per library;
- 33 accepted animations per rig;
- Rig_Medium reference = Orc Raider;
- Rig_Large reference = Orc Brute;
- both load in three.js;
- all tracks resolve;
- Medium ≈ 1.9 m;
- Large ≈ 3.9 m.

## First consumer actors

### Robot One

`media/3D_Assets/KayKit_Mystery_Series6/12 - June 2024 - Robot/characters/Robot_One.glb`

Current Resident Atlas evidence:

- **Rig_Medium**
- 23 joints

### Robot Two

`media/3D_Assets/KayKit_Mystery_Series6/12 - June 2024 - Robot/characters/Robot_Two.glb`

Current Resident Atlas evidence:

- **Rig_Medium**
- 23 joints

### Skeleton Minion · use THIS one for the Fluff crew

`media/3D_Assets/KayKit_Skeletons/Skeleton_Minion.glb`

Current source evidence:

- **Rig_Medium**
- shared KayKit Skeleton Rig_Medium animation family

### Do NOT substitute the legacy Disco Minion

The older Disco scene also contains:

`KayKit Legacy/.../character_skeleton_minion.gltf`

That actor is **Rig_Legacy**, not this slice's Skeleton worker source.

For this Fluff slice, use the current `KayKit_Skeletons/Skeleton_Minion.glb` Rig_Medium actor unless a later explicit decision changes it.

---

# 4 · Fluff visual source · no invented look

Use the existing KFB K1/K2 clay toolchain as the visual reference.

Primary K1 reference:

`tools/KFB-ToolBox/_inbox/KFB Knet-Katalog K1 + Hirnwelt Claymation Reference/KFB_K1_H0_CODEBASE_2026-09-29/lab-clay/`

Relevant files:

- `clay-catalog.v5.js`
- `clay-material.v8.js`
- `clay-profiles.v2.js`
- `clay-soften.v1.js`
- `clay-relief.v2.js`

K2 tool evolution may be inspected where useful:

`tools/KFB-ToolBox/_inbox/KFB Knet-Strecke T3 v2/KFB_CLAYMATION_K2_KNET_WERKZEUGE_2026-09-28/lab-clay/`

### Fluff look rule

A base sphere is allowed as geometry, but the final reference must read as **KFB Fluff**, not a generic smooth primitive:

- K1/K2 clay material language;
- fingerprints / relief;
- softened / imperfect silhouette;
- slight lumpiness;
- island/biome palette;
- clear High / Low variants.

### High / Low look direction

Do not invent unrelated styles.

Use one shared Fluff family:

**High**
- more cohesive;
- cleaner retained volume;
- elastic but stable;
- bonded surface.

**Low**
- looser;
- wobblier;
- slight sag / separation tendency;
- still clearly the same Fluff substance.

Before actor integration, show in isolation:

1. Rig_Medium source;
2. Rig_Large source;
3. High-Fluff ball;
4. Low-Fluff ball.

Record scale, radius, pivot, axis and source.

---

# 5 · Mandatory Part 1 · reuse-first audition

Before building any new animation, create the matrix in `REUSE_MATRIX.md`.

For every target role:

1. audition existing KayKit clips on Rig_Medium;
2. audition applicable current KFB Motion Library clips;
3. test on Rig_Large where a Large equivalent exists;
4. test on Robot One, Robot Two and current Skeleton Minion where relevant;
5. classify:

- **KEEP**
- **KEEP + FIT**
- **DERIVE / EDIT**
- **NEW CLIP REQUIRED**
- **NOT NEEDED**

Produce one compact preview/contact video or equivalent frame evidence.

The purpose is to avoid creating motions that already exist.

---

# 6 · Known reuse donors to audition first

The current Registry proves these existing Rig_Medium donors.

## General

Source:

`media/3D_Assets/KayKit_Character_Animations_1.1/Animations/gltf/Rig_Medium/Rig_Medium_General.glb`

Relevant clips:

- `Interact`
- `PickUp`
- `Throw`

**Important:** `PickUp` must NOT automatically become the Life-Tree pickup action. If it bends the head toward the ground, reject it for that use.

## Tools

Source:

`media/3D_Assets/KayKit_Character_Animations_1.1/Animations/gltf/Rig_Medium/Rig_Medium_Tools.glb`

Relevant clips include:

- `Chop`
- `Chopping`
- `Dig`
- `Digging`
- `Hammer`
- `Hammering`
- `Holding_A`
- `Holding_B`
- `Holding_C`
- `Pickaxe`
- `Pickaxing`
- `Saw`
- `Sawing`
- `Work_A`
- `Work_B`
- `Work_C`
- `Working_A`
- `Working_B`
- `Working_C`

Use these as first candidates for:

- knead / press;
- pack / flatten;
- patch / repair;
- pull / dismantle;
- tool work;
- handoff / holding;
- work-to-dance setup.

## Simulation

`Rig_Medium_Simulation.glb`

Candidate:

- `Cheering`

for short completion/celebration reuse.

## Current KFB Motion Library

Audition current dance clips for work/dance transitions and completion accents.

Do not create a new dance family unless transition-specific motion is genuinely missing.

---

# 7 · Critical Large-rig fact

**`Rig_Large_Tools.glb` does not exist.**

This is already a known Resident Atlas source fact.

Therefore:

- do not attempt to load it;
- do not claim KayKit provides Large Tool clips;
- use the current KFB Motion Library Large rig where appropriate;
- if a required work action exists only on Rig_Medium, Part 1 must determine whether it can be retargeted/derived cleanly before a fresh Large action is authored.

This is one reason the reuse-first mapping gate is mandatory.

---

# 8 · Target semantic roles

These are **roles**, not automatically 14 new actions.

Map each to existing donors first.

| Role | Desired result |
|---|---|
| roll_push | two-hand forward Fluff rolling |
| roll_push_heavy | Sisyphus / oversized Fluff effort |
| steer_left | short correction |
| steer_right | short correction |
| place_small | place / press manageable Fluff chunk |
| knead_press | shape Fluff on safe-height surface |
| pack_flatten | bond / compress / flatten |
| pass_receive | handoff |
| pull_chunk | controlled dismantling |
| collect_debris | gather/nudge debris without head-to-ground crouch |
| patch_press | re-bind / repair |
| work_to_dance | short transition |
| dance_to_work | short transition |
| celebrate_short | completion reaction |

Only items classified **NEW CLIP REQUIRED** after audition become Blender authoring tasks.

---

# 9 · Life Tree pickup rule

Each island's signature Life Tree grows colored Fluff balls.

They can:

- ripen;
- detach;
- fall;
- cartoon-bounce;
- settle;
- be collected by player or NPC;
- be processed / gifted / traded / built with.

### Pickup is NOT a bend-down animation

The actual runtime pickup is:

**walk-over / proximity → object disappears → POP → Fluff counter changes**

Do not make a crouch, kneel or hand-to-floor pickup action.

Reason:

- large KFB heads can intersect terrain;
- the pickup object may already be gone at trigger time;
- runtime owns collection, not the actor clip.

### Optional reaction

If useful, author or derive:

`kfb_fluff_pickup_react_short`

Allowed:

- hand flick;
- upper-body pop;
- tiny hop;
- head/eye reaction;
- short dance accent.

It must work with no object remaining in the scene.

---

# 10 · Fluff ball bounce reference

Blender may create a **PROP-ONLY reference**, not runtime physics:

`kfb_fluff_ball_bounce_reference`

Reference:

- drop;
- contact squash;
- rebound stretch;
- 1–3 decreasing bounces;
- tiny roll / settle.

Return:

- radius;
- fps;
- contact frames;
- bounce peak heights;
- squash/stretch ratios;
- High vs Low response notes.

WorldBuilder may later reproduce the timing procedurally.

Blender does not own runtime gravity/collision.

---

# 11 · Worker crew consumers

The shared base pack must work for:

- Skeleton Minion;
- Robot One;
- Robot Two.

Do not fork three full libraries.

Optional presentation notes/overlays only:

### Skeleton Minion
- eager;
- crooked;
- wobble;
- cheerful undead work rhythm.

### Robot One / Robot A role
- precise;
- align/check;
- measured press;
- micro-bop.

### Robot Two / Robot B role
- salvage;
- nudge;
- patch;
- improvised maintenance energy.

---

# 12 · Utopia Robot prop source correction

A real source-backed charging station already exists:

`media/3D_Assets/KayKit_Mystery_Series6/12 - June 2024 - Robot/assets/gltf/Robot_ChargingStation.gltf`

Use this exact donor for any Robot habitat charging-station reference.

Do not invent a substitute from the old Platformer pack.

---

# 13 · Buildings / props / habitats / dungeon seam

These motions will later be consumed by:

- Fluff building assembly;
- Fluff prop creation;
- biome-specific gifts;
- open-air habitats;
- Farmer resource work;
- Skeleton crypt construction;
- Robot Utopia technical habitats;
- Dungeon Generator S13.2 recipes.

Blender does **not** build those systems in this slice.

Keep actions generic enough for:

- wall/chunk pressing;
- furniture shaping;
- prop shaping;
- repair;
- dismantling;
- gift handoff.

Do not bake a specific building into the actor action.

---

# 14 · Export contract

After the reuse audit, return:

1. `REUSE_MATRIX.md` completed with evidence;
2. source audition video/contact evidence;
3. only the newly required / derived actions;
4. Rig_Medium output;
5. Rig_Large output where required and validated;
6. optional High/Low Fluff prop source;
7. optional bounce reference;
8. catalogue delta compatible with current KFB Motion Library;
9. `SOURCE.md`;
10. `TEST_REPORT.md`;
11. `RETURN.md`.

For each new/derived action record:

- id;
- source donor if derived;
- rig;
- fps;
- duration;
- loop;
- rootMotion;
- contact assumptions;
- ball radius / work-surface assumptions;
- hand contact notes;
- test result.

---

# 15 · QA

For every retained or new candidate prove:

- actual source;
- correct rig;
- successful binding;
- no head/terrain penetration;
- no avoidable foot slide;
- readable hand/Fluff relationship;
- clean loop if looped;
- root ownership recorded.

For the first actors:

- Robot One = Rig_Medium;
- Robot Two = Rig_Medium;
- Skeleton Minion current source = Rig_Medium.

Also validate at least one Rig_Large receiving actor using the canonical Large Motion Library so the shared pack remains two-rig capable.

---

# 16 · Stop / done condition

### Part 1 is done when

- reuse matrix is complete;
- all candidate donors have been auditioned;
- Medium/Large evidence exists;
- Robot One / Robot Two / current Skeleton Minion rig assumptions are proven;
- High/Low Fluff look samples exist;
- only genuine motion gaps remain.

### Part 2 is done when

Only those genuine gaps have been authored/derived and returned as a compatible motion-library delta.

Exactly one downstream gate:

`FLUFF_BUILDING_ASSEMBLY_KIT_01_RUNTIME_CONSUMER_PROOF`

No world/runtime implementation in Blender.
