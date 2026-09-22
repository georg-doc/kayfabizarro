# KFB Resident Story Zones · Living Concept

**Status:** LIVING CONCEPT · IDEATION / AUTHORING ARCHITECTURE · NO RUNTIME PROMOTION  
**Date opened:** 2026-09-22  
**Owner:** KFB ToolBox / shared scene authoring  
**Consumers:** Resident Atlas, KFB Town, future World Builder / Travel-hosted world, Dungeon, Babel / Hex, other KFB runtimes  
**Branch:** `chatgpt-web/resident-story-zone-concept-2026-09-22`  
**Prepared from main:** `d68e5b55a9c9c08fe2483d46f3d0ea7dc190b8cb`  
**Reserved future Stage route:** `https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/resident-story-zones/`  
**Public status:** NOT BUILT · NOT DEPLOYED · NOT PUBLIC_VERIFIED

This document is the additive recovery home for Georg's ideation around Residents/NPCs, ChatterBox, modular scenes, Hex/world authoring and a reusable in-scene 3D editor. It is deliberately a concept/contract document before implementation.

GitHub state overrides chat recollection. New brainstorming should be appended here as dated entries or explicit corrections instead of silently rewriting prior decisions.

---

## 0 · Source state read before opening this concept

Current sources reviewed on 2026-09-22:

- `skills/chat/START_HERE.md`
- `skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`
- `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`
- `tools/KFB-ToolBox/START_HERE.md`
- `tools/KFB-ToolBox/_handover/WORLD_BUILDING_PREFLIGHT_WEBCHAT_2026-09-22/START_HERE.md`
- `tools/KFB-ToolBox/_handover/RESIDENT_SCENE_MODULES_WSA_2026-09-19/START_HERE.md`
- `tools/resident_atlas_s6/docs/RECOVERY.md`
- `tools/resident_atlas_s6/docs/ATLAS_RETURN.md`
- `skills/chat/workflows/KFB_INSCENE_EDITOR_MODULE_V1_2026-09-20/START_HERE.md`
- `skills/chat/workflows/KFB_MVP_INTEGRATION_BOARD_V1_2026-09-20/START_HERE.md`
- `skills/chat/masterplan/CHATTERBOX_TOURBUS_REUSE_2026-09-14.md`
- relevant current sections of `skills/chat/town/LIVING_KFB_TOWN.md`

Important existing truths:

1. Resident Atlas already owns resident composition, rig/pose/prop/activity evidence.
2. The shared in-scene editor brief already defines a non-destructive `kfb.scene-patch.v1` seam; do not replace it with a new generic Three.js editor.
3. Asset Registry / Asset Librarian owns asset identity and discoverability; the authoring tool should consume it rather than create a second library.
4. ChatterBox already has reusable phrase/register/bubble/scheduler donors and must not become a second movement, animation, reward or world owner.
5. Receiving game/world hosts retain scene/runtime, navigation, collision, camera, persistence and gameplay truth.
6. Current World Building preflight is separately proving Environment Profile + Surface Adapter concepts. Story Zones must consume those results later rather than pre-empt or duplicate them.
7. Town already establishes individual NPC decks, Triplets/Kayfabulation, outdoor ensembles, lean memory and resident activities as current concept direction.

---

# 1 · Georg's core idea captured

## USER DIRECTION · 2026-09-22

Build an authoring system in which Georg can create reusable scenes and world modules directly in 3D:

- a very small vignette such as one Resident sitting on a park bench with a tree, flower and lamp;
- a medium scene with several Residents, props and a local activity;
- a complex diorama / Story Zone in which characters walk authored paths, perform actions and interact;
- examples include a blacksmith hammering at an anvil and another Resident walking to a mine, collecting ore and returning;
- scenes should be placeable as reusable modules in a larger Hex/world-builder context;
- authoring should use the existing in-scene 3D transform workflow and live asset search rather than requiring external DCC work for ordinary layout;
- Characters, props, weapons, scenery and world parts should be searchable and placeable from existing source truth;
- ChatterBox should provide dialogue/reaction/storytelling around those activities;
- editing should scale hierarchically: eye rig → face → head/body graft → whole Resident → scene groups → larger spatial groups / dungeon or world modules;
- the same group/subgroup logic should allow local editing at the right level without destructively flattening the hierarchy.

This is the controlling ideation input for this document.

---

# 2 · Core proposal: one hierarchical authoring grammar

## PROPOSAL · "same grammar at every scale"

The strongest unifying idea is not a separate Scene Editor, Character Editor and World Editor.

It is one **hierarchical authoring grammar** with different owners at different levels:

```
Source asset
  ↓
Rig sub-part / EyeRig
  ↓
Face / Head / graft group
  ↓
Resident actor profile
  ↓
Activity / motion setup
  ↓
Scene object group
  ↓
Micro-scene
  ↓
Story Zone / diorama
  ↓
World placement / island / district
```

Every level can expose:

- stable ID;
- parent ID;
- local transform;
- optional parameters;
- source/profile reference;
- lock / visibility state for authoring;
- child groups;
- annotations / semantic role;
- non-destructive patch operations.

The editor changes the **selected scope**, not the ownership of the underlying system.

Example:

- EyeRig parameters remain EyeRig-owned.
- A FrizzleBob face patch remains face/profile-owned.
- The FrizzleBob head graft remains actor/graft-owned.
- Resident transform within a bench scene is scene-owned.
- Bench scene transform on a Hex island is world-placement-owned.

The user can move up and down this hierarchy in one visual editor without collapsing all layers into one file or one runtime owner.

---

# 3 · Authoring stack

## 3.1 Source layer

Owned by Asset Registry / Librarian.

Provides:

- canonical asset ID;
- source path/ref;
- pack identity;
- useful semantic tags;
- searchable human name;
- optional preview/thumbnail;
- known rig/scale/pivot facts where already measured.

The Story Zone tool must not copy or rename assets into a private second catalog.

**Live search** means querying the existing Librarian/Registry surface and inserting a source reference into the current recipe.

## 3.2 Profile layer

Owned by existing specialist tools.

Examples:

- EyeRig profile;
- Face profile;
- graft/head profile;
- Motion profile;
- attachment profile;
- Environment Profile when current World preflight proves it.

A Story Zone references these profiles. It does not rewrite their source assets.

## 3.3 Actor layer

Resident Atlas / actor owner.

Represents one instantiated Resident with:

- identity;
- actor source/profile;
- current visual variant;
- approved motion/activity references;
- attachment references;
- optional dialogue/personality/deck references;
- local scene transform.

## 3.4 Activity layer

A lightweight authored behaviour recipe, not a new universal AI.

Examples:

- sit on bench;
- idle + look around;
- hammer at anvil;
- walk authored path;
- carry ore;
- hand over item;
- play guitar;
- juggle;
- dance;
- react to player;
- speak / listen / resume task.

Activities point to existing animation/motion capabilities and host navigation/path seams.

## 3.5 Scene layer

A bounded composition:

- actors;
- props;
- scenery;
- anchors;
- authored paths;
- activity assignments;
- interaction triggers;
- local ChatterBox context;
- entry/exit anchors;
- optional Environment Profile;
- optional surface/address placement data.

## 3.6 Story Zone layer

A reusable scene/module with enough authored behaviour to read as a small living place.

A Story Zone can be:

- **micro** — one Resident + 1–4 props;
- **small** — 2–4 Residents + local paths/activities;
- **medium** — a market corner, forge, mine entrance, bandstand, graveyard vignette;
- **large** — a composed diorama / district chunk made from smaller Zones.

Large Zones should preferably compose smaller recipes instead of flattening them.

## 3.7 World placement layer

Owned by the receiving World/Travel/Hex/Dungeon host.

It decides:

- surface geometry;
- support/collision;
- world coordinates;
- navigation graph;
- streaming/chunking;
- persistence;
- player movement;
- camera;
- global events.

The Story Zone authoring layer exports enough placement/anchor metadata to mount cleanly into that host.

---

# 4 · Proposed Story Zone recipe

## PROPOSAL · candidate only

Do not freeze this schema before a real two-host proof.

Working name:

`kfb.story-zone.v0`

Conceptual shape:

```json
{
  "schema": "kfb.story-zone.v0",
  "id": "park-bench-gothgirl-v0",
  "title": "Park Bench · GothGirl",
  "sourceRef": "exact git/source revision",
  "root": {
    "groupId": "zone.root",
    "transform": {
      "position": [0, 0, 0],
      "rotation": [0, 0, 0],
      "scale": [1, 1, 1]
    }
  },
  "environmentProfileRef": "optional-owner-profile-id",
  "surface": {
    "mode": "host-owned",
    "anchor": "zone.origin"
  },
  "objects": [
    {
      "id": "resident.gothgirl",
      "kind": "resident",
      "source": {"assetId": "canonical-id"},
      "profileRefs": {
        "actor": "resident-profile-id",
        "motion": "motion-profile-id"
      },
      "parent": "zone.root",
      "transform": {"position": [0,0,0], "rotation": [0,0,0], "scale": [1,1,1]}
    },
    {
      "id": "prop.bench",
      "kind": "prop",
      "source": {"assetId": "canonical-bench-id"},
      "parent": "zone.root",
      "transform": {"position": [0,0,0], "rotation": [0,0,0], "scale": [1,1,1]}
    }
  ],
  "paths": [],
  "activities": [],
  "beats": [],
  "chatter": {},
  "anchors": [],
  "metadata": {}
}
```

This should probably sit **above** `kfb.scene-patch.v1`.

- The Story Zone recipe is the authored composition.
- `kfb.scene-patch.v1` remains the low-level portable transform/edit patch.
- Runtime save/progression remains host-owned.

---

# 5 · Hierarchical editing and scope

## PROPOSAL

The in-scene editor should expose a **scope ladder**, not a giant object tree by default.

Example for FrizzleBob:

```
Zone
└─ Bench Scene
   ├─ FrizzleBob
   │  ├─ Body / K-Kit actor
   │  ├─ Head graft
   │  │  ├─ Face
   │  │  │  └─ EyeRig
   │  │  └─ optional facial props
   │  └─ attachments
   ├─ Bench
   ├─ Tree
   ├─ Flower
   └─ Lamp
```

The editor can enter/exit scope.

### When Zone is selected

Move/rotate/scale the whole vignette as one module.

### When Bench Scene is selected

Edit local composition without changing the world placement.

### When FrizzleBob is selected

Adjust actor placement/rotation and actor-level parameters.

### When Face is selected

Expose face-owner parameters and transform scope, not world props.

### When EyeRig is selected

Expose only EyeRig-authoring controls.

This is analogous to editing nested symbols/components rather than exploding everything into independent world objects.

## Important persistence rule

Nested editing should create a patch at the **lowest owner capable of expressing the change**.

Do not bake a local eye correction into the Story Zone transform.
Do not bake a Zone placement into the actor profile.
Do not mutate a source GLB when a profile/patch is sufficient.

---

# 6 · Group logic

## PROPOSAL

Each group can have:

- `groupId`;
- `parent`;
- local transform;
- semantic role;
- authoring lock;
- visibility;
- children;
- optional pivot/anchor;
- optional exposed parameters.

Useful semantic roles:

- `RESIDENT`
- `PROP_FIXED`
- `PROP_MOVABLE`
- `SCENERY`
- `ACTIVITY_STATION`
- `PATH`
- `ENTRY`
- `EXIT`
- `INTERACTION_ANCHOR`
- `LANDMARK`
- `ZONE_GROUP`

These roles should help authoring and validation without becoming a new ECS.

A blacksmith scene might group:

```
forge-zone
├─ station.forge
│  ├─ anvil
│  ├─ hammer-source / attachment ref
│  ├─ fire
│  └─ work-anchor
├─ resident.blacksmith
├─ path.blacksmith-local
└─ chatter.context.forge
```

The whole forge can then be moved as one unit while internal placement remains local.

---

# 7 · Activity model: authored beats before "autonomous AI"

## PROPOSAL

The first useful system should be a small deterministic **Activity / Beat Graph**.

Do not begin with general autonomous agents.

Example:

```
WORK_AT_ANVIL
  → PAUSE
  → NOTICE_PLAYER? 
       yes → TURN / CHATTER / optional gesture
       no  → RESUME
  → WORK_AT_ANVIL
```

Miner example:

```
IDLE_AT_CAMP
  → WALK_PATH_TO_MINE
  → ENTER_MINE_ANCHOR
  → WAIT / MINE
  → RECEIVE_ORE_STATE
  → WALK_PATH_TO_FORGE
  → DROP_OFF
  → optional CHATTER
  → RETURN
```

This yields readable mini-stories from:

- real clips;
- authored paths;
- authored anchors;
- small state transitions;
- ChatterBox at meaningful beats.

Later systems can add more autonomy without replacing this authorable base.

---

# 8 · ChatterBox integration

## Current boundary

ChatterBox is a text/presentation donor and semantic response layer.

It must not directly own:

- navigation;
- world movement;
- animation bones;
- combat;
- collision;
- rewards;
- persistence.

## PROPOSAL · Zone Context Packet

A Story Zone can supply a compact context packet when dialogue is requested.

Example fields:

```
speaker
listener / player
zoneId
activity
activityBeat
nearbyActors
visibleProps
relevantCard
localEvent
relationship
knownObservedEvents
deck/signature-cluster
tone/register
interactionKind
```

Priority should remain compatible with existing ChatterBox direction:

**Card → immediate situation → faction/identity → relationship → local history → broader context**

Town-specific decks/Triplets remain separate authoring inputs rather than being collapsed into world geometry.

## Dialogue result

ChatterBox may return something like:

- chosen utterance;
- register / bubble style;
- optional Card/Triplet reference;
- intended addressee;
- optional semantic acting cue such as `LOOK_AT_PLAYER`, `POINT_AT_PROP`, `SHRUG`, `RESUME_WORK`.

The acting cue must resolve through an approved activity/motion adapter.

ChatterBox does **not** output arbitrary bone rotations or movement coordinates.

## Ambient vs interactive speech

Retain the existing useful distinction:

- ambient chatter is bounded and can expire;
- one interactive conversation can persist for player choice;
- late async output should not resurrect a Resident who has already left the situation.

## Lean memory

A Zone may emit a small event fact to the existing lean-memory direction:

- who was present;
- what was observed/heard;
- which response was chosen;
- what promise or object changed state.

Replay/import should not duplicate memory or rewards.

---

# 9 · First scene examples

## A · Park Bench micro-scene

Georg's simplest example should probably become the first authoring fixture.

Contents:

- one real Resident;
- one real bench;
- one real tree;
- one flower;
- one lamp;
- one sitting/idle activity;
- one player-proximity interaction;
- one ChatterBox utterance;
- one exported Story Zone recipe;
- save → reload → identical placement.

Why useful:

- proves live asset search;
- nested grouping;
- actor + scenery composition;
- transform patch;
- one activity;
- one dialogue seam;
- one reusable module;
- no pathfinding or multi-actor complexity yet.

## B · Forge micro-story

Second fixture after the bench.

Contents:

- blacksmith Resident;
- anvil/workstation;
- hammer attachment;
- looping work activity;
- second Resident/miner;
- short authored path;
- ore handoff/drop;
- one local reaction;
- ChatterBox tied to current beat.

This proves that a Zone can tell a small story rather than only display a static diorama.

## C · Market / party / archive cluster

Later composition test:

- compose several already-proven micro-zones;
- preserve their internal groups;
- move the cluster as a parent group;
- local event can reference another child Zone without flattening either.

---

# 10 · Relationship to Hex / World Builder

## Current rule

The current World Building preflight is separately proving one logical recipe on FLAT / SPHERE / TORUS through a Surface Adapter.

Story Zones should wait for that seam rather than invent universal `Y = up`.

## PROPOSAL

A Story Zone is authored in local coordinates around its root.

The world host supplies the mount pose:

```
poseAt(address, heightOffset)
→ position + normal + tangentU + tangentV + handedness + surfaceId
```

Then the Zone root is transformed into that local frame.

This allows the **same Park Bench Zone** eventually to sit on:

- a flat Hex island;
- a spherical Travel world;
- a toroidal experimental surface;
- a Dungeon room floor;
- a hand-authored platform.

The Zone does not need to know which global geometry owns the world.

## Hex relation

Hex cells can be one authoring substrate for Zone placement, but Story Zones should not require Hex.

Possible later workflows:

1. paint/build 7–24 connected Hex cells;
2. select a subset/group;
3. place a Story Zone root on that group;
4. edit local objects/paths;
5. save world recipe + zone references separately.

This keeps a Hex World from becoming the only world model.

---

# 11 · 3D authoring UI direction

## PROPOSAL · scene first, controls secondary

Reuse the current in-scene editor language.

Core visible actions:

- select;
- transform;
- enter group;
- exit group;
- lock/unlock;
- duplicate as reference/instance where allowed;
- add from live Asset Librarian search;
- add Resident;
- assign Activity;
- draw/edit path;
- add anchor/trigger;
- preview Story;
- save patch / save recipe;
- reload/import.

Avoid:

- giant generic property inspector;
- permanent dashboard chrome;
- a new Asset Browser database;
- a second scene graph implementation;
- a second animation editor inside the Scene tool.

### Search

A compact command/search surface could query:

- "bench"
- "lamp"
- "flower"
- "black knight"
- "anvil"
- "sword"
- "tree"
- "KayKit forest"

Results retain canonical Asset Librarian identity.

### Contextual inspector

The inspector changes by selected scope.

- Prop → transform, source identity, semantic role.
- Resident → actor/profile refs, activity assignment, transform.
- Activity → motion ref, anchors, beat timing/conditions.
- Path → waypoints/spline and owning actor.
- Zone root → title, environment, mount anchor, child composition.

---

# 12 · Save / export model

## PROPOSAL · base + patches

Prefer:

```
canonical sources
+ profile refs
+ Story Zone recipe
+ kfb.scene-patch.v1 edits
+ host runtime save
```

rather than one flattened giant scene dump.

### Benefits

- source identity remains inspectable;
- editor changes are reversible;
- fixes in an actor profile can propagate without rebuilding every Zone;
- world placement can change without mutating local scene composition;
- a Resident activity can be updated independently;
- reusable modules stay genuinely reusable.

### Version pinning

Each recipe should be able to pin the exact source/profile revision used when authored.

A later rebase/update can be deliberate and diffable.

---

# 13 · Mini-story authoring

## PROPOSAL

A Story Zone can be thought of as:

**Place + Cast + Props + Paths + Activities + Beats + Chatter Context + Local State**

That is enough to produce small narrative loops without requiring full quest scripting.

Example local state:

- ore available / carried / delivered;
- blacksmith busy / idle;
- player greeted / not greeted;
- Card currently discussed;
- music playing / stopped;
- prop broken / restored.

A Zone may expose events to the host:

- `zone.enter`
- `zone.leave`
- `activity.complete`
- `interaction.accepted`
- `item.local_state_changed`
- `dialogue.choice`

The host decides whether any event has global consequences.

---

# 14 · Ownership matrix

| Concern | Owner |
|---|---|
| Asset identity / source / discoverability | Asset Registry / Librarian |
| EyeRig / face authoring | existing EyeRig / face owner |
| Actor graft / Resident composition | Resident Atlas / actor owner |
| Motion / animation profiles | Motion/Animation owner |
| Dialogue content selection / bubbles | ChatterBox / its adapter |
| Scene selection/transforms/patches | shared in-scene editor |
| Story Zone composition | ToolBox authoring recipe |
| Surface/world placement | receiving World/Travel/Hex/Dungeon host |
| Navigation / collision | receiving host |
| Combat | Combat owner |
| Rewards / POP / progression | receiving gameplay owner |
| Persistence | receiving host / established save owner |
| Global NPC memory | existing Town/lean-memory direction; no new database in this slice |

---

# 15 · What this concept explicitly does NOT create

- no universal NPC AI;
- no second Asset Librarian;
- no second Three.js scene graph;
- no second Travel renderer;
- no second movement/navigation owner;
- no generic quest engine;
- no automatic full-world procedural generator;
- no source-GLB destructive editor;
- no replacement for Resident Atlas;
- no replacement for ChatterBox;
- no replacement for Motion Lab / animation owners;
- no requirement that every world is Hex;
- no assumption that global Y is always up;
- no automatic LLM control of bones, movement, rewards or persistent truth.

---

# 16 · Suggested build sequence

This is a proposal, not a production order until Georg confirms.

## Gate SZ-0 · contract alignment only

Reconcile:

- Resident Atlas editor capabilities;
- `kfb.scene-patch.v1`;
- Asset Librarian query/identity seam;
- current World Surface Adapter result;
- Resident Scene Module mount/update/dispose seam;
- ChatterBox invocation seam.

Output: capability matrix + smallest Story Zone recipe draft.

## Gate SZ-1 · Park Bench fixture

One Resident + bench + tree + flower + lamp.

Must prove:

- live source insertion;
- nested group editing;
- save/reload;
- one activity;
- one ChatterBox interaction;
- portable recipe;
- no source mutation.

## Gate SZ-2 · Forge micro-story

Two Residents, one workstation, one short path, one carried/local item state, one interaction beat.

## Gate SZ-3 · World placement

Place the exact SZ-1 recipe on the currently proven world/surface host without changing its local recipe.

## Gate SZ-4 · Scene composition

Compose two or three existing Story Zones into a larger local cluster while retaining nested edit scopes.

Only after those pass should a more general World Builder UI be expanded.

---

# 17 · Open design questions

These are intentionally unresolved.

1. Name: **Story Zone**, **Scene Module**, **Story Scene**, **Resident Zone**, or another term?
2. Should paths live inside Story Zone recipe or remain separate host resources referenced by ID?
3. Which Activity semantics are already covered by current Resident/animation source and which need a tiny new adapter?
4. How does Asset Librarian search expose "placeable" vs "attachment" vs "environment" results?
5. How should nested instances behave when the source Zone later changes: pinned revision, live linked instance, or explicit update action?
6. Which selected actor/face/eye parameters are safe to expose inside the shared editor without duplicating specialist tools?
7. Does the first World Builder authoring surface start from Hex cells, or should it support a neutral empty local plane plus Hex as one substrate?
8. Which ChatterBox output contract is actually current in the intended 3D host?
9. How are authored paths represented across Flat/Sphere/Torus without prematurely freezing a universal path API?
10. Which local events should enter lean memory and which remain ephemeral scene state?

---

# 18 · Ideation principles

1. **Readable activity beats beat fake autonomy.** A miner who visibly goes to the mine, returns with ore and triggers one useful exchange is more valuable than an opaque "smart NPC".
2. **Modules should tell small stories before they simulate whole societies.**
3. **Nested ownership is a feature.** The editor should make existing owners easier to reach, not dissolve them.
4. **Every placed object keeps source identity.**
5. **Local coordinates first.** A Zone is authored around its own root and mounted by the host.
6. **Authoring and runtime state are different.**
7. **Dialogue reacts to actual situation.** Avoid chatter divorced from current activity and nearby objects.
8. **Animation cues are semantic.** Dialogue may request "look", "gesture" or "resume"; motion owners resolve the actual clip/bones.
9. **Start with authored paths.** Add autonomy only when it creates visible value.
10. **Micro → meso → macro should compose, not fork.**

---

# 19 · Current concept checkpoint

**2026-09-22 · INITIAL CAPTURE**

Captured Georg's proposal for:

- scalable Scene/Zone authoring;
- nested group editing from EyeRig through world modules;
- 3D in-scene layout;
- live asset/Resident/prop search;
- reusable micro-scenes and dioramas;
- authored paths and activities;
- ChatterBox-driven situated dialogue;
- Hex/world placement;
- mini-story composition.

New architectural proposal added:

**Story Zone = a non-destructive composition layer above existing asset/profile/activity owners and below the receiving world/runtime owner.**

Recommended first tangible fixture:

**Park Bench micro-scene** before the Forge micro-story.

No implementation, public route or runtime promotion has happened in this checkpoint.


---

# 20 · Activity Stations, role slots and semantic sockets

## PROPOSAL · object-side affordances instead of actor-specific scripting

A useful next abstraction is an **Activity Station**.

The scene object or place exposes the affordance; the Resident binds into it.

Examples:

### Bench station

- seat anchor;
- facing direction;
- optional hand/rest anchors;
- compatible sit/idle activity tag;
- conversation radius;
- look-at target;
- stand-up / leave anchor.

### Anvil station

- worker stand anchor;
- anvil impact target;
- hammer attachment role;
- approved work-loop activity tag;
- optional left/right-hand requirement;
- SFX hook;
- spark/VFX anchor;
- pause/look/talk/resume beats.

### Mine entrance station

- approach anchor;
- entry/exit anchor;
- local path endpoint;
- cargo/ore role;
- wait/work beat;
- optional host transition hook if the mine is an instanced interior.

This means the Story Zone does not need to hard-code "Blacksmith Bob plays clip 17 at x/y/z".

Instead:

```
Resident capability / role
      ↕
Activity adapter
      ↕
Activity Station / semantic sockets
```

The station describes what the place offers.
The actor profile describes what the Resident can do.
The adapter resolves the compatible motion/attachment details.

This should stay lightweight and source-driven. It is not a general gameplay ability system.

## PROPOSAL · concrete cast vs role slots

A Story Zone can support two authoring forms.

### Concrete cast

The Park Bench fixture can explicitly place GothGirl.

This is simplest and best for the first proof.

### Role slot

A reusable Forge template could declare:

- `role.blacksmith`
- `role.miner`

with capability constraints rather than fixed character names.

Possible constraints:

- supported rig family;
- required activity tag;
- required attachment compatibility;
- optional preferred Resident IDs;
- optional dialogue/deck role.

At placement time Georg may bind a specific Resident to the role.

This allows one authored micro-story to be reused without turning every Resident into a generic interchangeable NPC. Identity, personality, deck and memory remain actor-owned.

## PROPOSAL · semantic sockets

The same nested hierarchy can expose named sockets/anchors such as:

- `seat`
- `stand`
- `lookAt`
- `handTarget.left`
- `handTarget.right`
- `workTarget`
- `pickup`
- `dropoff`
- `entry`
- `exit`
- `conversation`
- `fx`
- `sound`

These are authoring anchors, not universal physics or AI rules.

They make drag-and-drop authoring much more practical because the editor can snap meaningful things to meaningful places.

## Why this matters for Georg's editor

It creates a scalable workflow:

1. place an anvil from Asset Librarian;
2. add/inspect an Anvil Station profile;
3. drag a Resident into the worker role;
4. choose/validate an approved work activity;
5. place or adjust the semantic anchors directly with gizmos;
6. preview the beat loop;
7. add a ChatterBox reaction at a pause/notice beat;
8. save the whole group as a reusable Story Zone.

The same authoring language can later work for:

- benches;
- market stalls;
- musical instruments;
- workbenches;
- mining nodes;
- doors/portals;
- campfires;
- chess tables;
- jukeboxes;
- vehicles;
- combat-free performance spaces.

This is a stronger reuse seam than writing character-specific scripts for every vignette.

## PROPOSAL · editor scopes as breadcrumb navigation

The nested group model should likely be presented as a short breadcrumb / scope path rather than a permanently expanded full scene tree.

Example:

`World / Market Zone / Forge / Blacksmith / Face / EyeRig`

Georg can move upward or downward in scope while keeping the 3D scene dominant.

This matches the existing anti-dashboard direction and makes the same tool usable from tiny rig edits to large scene placement.
