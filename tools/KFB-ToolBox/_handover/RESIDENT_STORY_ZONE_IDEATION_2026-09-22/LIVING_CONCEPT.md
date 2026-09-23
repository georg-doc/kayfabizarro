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


---

# 21 · Lore Keeper first Story Zone fixture

## USER DIRECTION · 2026-09-22

Georg selects the **Lore Keeper** as the first concrete Story Zone authoring fixture, replacing the previously proposed Park Bench fixture as the first proof.

The Park Bench remains a useful later minimal fixture, but it is no longer first.

The Lore Keeper already has a stronger narrative/activity identity:

- wise / archival Resident;
- writing lectern / study desk;
- backpack;
- books / RPG props;
- possible bookshelf;
- possible KFB Cards as discoverable Points of Interest;
- potential carrying / placing activity;
- potential roaming around a small open-air study area.

The intended first scene is an **open-air study / archive nook** that reads clearly as the Lore Keeper's place but remains portable enough to mount into different later environments.

## PROPOSAL · Open-Air Study Story Zone

Working structure:

```
lorekeeper-zone
├─ scenery.study-spot
│  ├─ local ground / subtle area marker
│  ├─ optional tree / shade
│  ├─ optional lamp / lantern
│  └─ restrained decorative archive props
├─ station.desk
│  ├─ lectern / writing desk
│  ├─ stand anchor
│  ├─ look/read target
│  └─ stack / place anchors
├─ station.shelf
│  ├─ bookshelf
│  ├─ approach anchor
│  └─ inspect/place anchors
├─ poi.cluster
│  ├─ poi.book.*
│  └─ poi.card.*
└─ resident.lorekeeper
   ├─ actor/profile refs
   ├─ backpack
   └─ activity bindings
```

The environment should be suggestive rather than architecturally locked.

Do not begin with a full enclosed library.
Do not make the first proof dependent on one exact building.

## Proposed activity progression

### LK-L1 · Study loop

Smallest readable proof:

- stand at lectern;
- read / inspect / think;
- notice player;
- one contextual ChatterBox response;
- resume study.

No carrying, path network or inventory mutation required.

### LK-L2 · Desk ↔ Shelf loop

Add exactly one short authored path:

- leave desk;
- walk to shelf;
- inspect / place / retrieve;
- return to desk;
- resume.

This is the first useful two-station Story Zone proof.

### LK-L3 · POI discovery loop

Only after L1/L2 are stable:

- books or KFB Cards appear / are authored as local POIs;
- Lore Keeper notices a valid nearby POI;
- walks to it through host navigation/path logic;
- inspects / collects it;
- returns to desk, shelf or stack;
- performs a placement / archive beat;
- may comment through ChatterBox.

The first version may use authored deterministic POI choices rather than a general search AI.

## Book / pencil detail level

A pencil-in-hand writing loop is attractive but may be too fine-grained for the first gate.

Preferred order:

1. strong readable lectern pose;
2. simple read/inspect/think activity;
3. book interaction;
4. only then pencil/precise hand interaction if the real source, attachment and motion evidence supports it.

Do not burn the first Story Zone gate on tiny prop alignment.

## KFB Cards as POIs

KFB Cards are especially suitable because they connect:

- visual world object;
- Card/deck identity;
- ChatterBox context;
- Lore Keeper interpretation;
- Lean Memory / observed event;
- future player collection or archive logic.

The Zone must distinguish:

- card visibly present;
- card noticed by Lore Keeper;
- card discussed;
- card moved/archived;
- card owned by player.

These are not the same state.

## Why Lore Keeper is a strong first fixture

It proves more of the intended system than a passive bench scene while remaining bounded:

- one named Resident;
- one strong Activity Station;
- optional second Station;
- one short path;
- props with semantic meaning;
- Points of Interest;
- situated ChatterBox;
- local state;
- Lean Memory hooks;
- portable local-coordinate composition.

It therefore becomes the current first Story Zone proof candidate.

---

# 22 · Kayfabe Social Conflict Loop

## USER DIRECTION · 2026-09-22

KFB Residents are fundamentally **chill & fun / best-buddy characters**.

That does not mean they avoid intense disagreement.

Within the wrestling/Kayfabe spirit they may:

- tease;
- roast;
- insult each other affectionately;
- provoke;
- argue intensely;
- challenge one another;
- escalate into cartoon fights / melee;
- knock each other down;
- then immediately restore the social bond:
  - help the other up;
  - laugh about the fight;
  - share a drink / go somewhere together;
  - or simply resume their ordinary day.

The conflict is part of the relationship, not proof that the relationship has collapsed.

This aligns with the current Town rule:

> Chill & fun is the social baseline; friendship allows substantial differences of opinion.

The new direction extends that rule into embodied NPC action.

## Satirical purpose

The social loop can carry a recurring satirical idea:

**opinion, current conflict and personal identity are not the same thing.**

The Town can deliberately exaggerate the modern mistake of treating disagreement as total personal enmity, then undercut it through cartoon Kayfabe behaviour.

Two Residents may argue as if civilization depends on the issue, stage a ridiculous brawl, then help each other up and continue as friends.

The joke should come from:

- concrete personalities;
- actual disagreement;
- remembered history;
- status/play/rivalry;
- physical escalation;
- fast relational repair;

not from generic "AI NPC says random insult" banter.

## PROPOSAL · keep social dimensions orthogonal

Do not collapse NPC relationships into one `friend ↔ enemy` scalar.

Keep at least these concepts distinguishable:

### Bond / familiarity

Relatively stable social relationship.

Examples:

- close buddy;
- familiar neighbour;
- playful rival;
- newer acquaintance.

### Kayfabe Heat

Short-lived current escalation.

Heat may rise because of:

- provocation;
- disagreement;
- Card interpretation;
- competition;
- performance;
- embarrassment;
- remembered prior encounter.

High Heat does **not** automatically reduce Bond.

### Topic stance / interpretation

Issue-specific position or interpretation.

A Resident can strongly disagree with another while still liking them.

Do not convert a collection of issue stances into a hidden totalizing ideology/personality label.

### Current activity / scene context

A fight in the Boxel Ring, a market argument and an Archive debate are not the same social event even if the same two Residents participate.

## PROPOSAL · social encounter grammar

A reusable encounter can follow:

```
MEET
  → ACKNOWLEDGE
  → BANTER
  → TEASE / COUNTER
  → optional PROVOKE
  → optional CHALLENGE
  → optional KAYFABE FIGHT
  → KNOCKDOWN / BREAK
  → REPAIR
  → SHARED LAUGH / HELP-UP / DRINK / WALK-OFF
  → RESUME OWN ACTIVITIES
```

Every step is optional.

Most encounters should not automatically become fights.

Silence, a one-line jab, a laugh, a shrug, or simply walking away remain valid outcomes.

## PROPOSAL · escalation is a host-approved activity

ChatterBox may produce semantic social cues such as:

- `TEASE`
- `COUNTER`
- `CHALLENGE`
- `BACK_OFF`
- `LAUGH`
- `MAKE_UP`
- `HELP_UP`
- `INVITE_SHARED_ACTIVITY`

It does not directly start Combat or write damage.

If an encounter reaches a fight beat:

- Combat/Melee owner supplies actual combat mechanics;
- the Story/Social layer supplies context and requested Kayfabe encounter mode;
- the receiving host decides whether combat is permitted here;
- post-fight repair remains a separate social beat.

This prevents ChatterBox from becoming a combat owner.

## PROPOSAL · Kayfabe fight contract

A future non-lethal NPC-vs-NPC social fight should be distinguishable from hostile combat.

Possible semantic mode:

`KAYFABE_SCRAP`

Intended properties:

- cartoon / performative;
- bounded;
- no permanent hostility implied;
- clear stop/knockdown condition;
- recovery beat;
- no automatic loot/reward;
- no irreversible social damage;
- reusable with current Melee owner when that seam exists.

This is a concept, not a current Combat API.

## PROPOSAL · repair beat is mandatory after social-combat completion

For a Kayfabe social fight, "fight ended" is not the final beat.

The authored encounter should explicitly resolve into one of:

- help-up;
- mutual laugh;
- shoulder slap;
- shared drink / tavern walk;
- boast + friendly counter-boast;
- return to work;
- separate amicably.

The point is visible restoration of the social frame.

## PROPOSAL · destructive events use the same worldview

The same "conflict without permanent social collapse" logic can extend to world destruction.

For suitable residents:

- Stunt Race destroys scenery;
- Residents react theatrically;
- rebuilding becomes an activity opportunity;
- some characters may even be disappointed when nothing dramatic happened;
- damage creates visible work / play rather than only punishment.

Do not make universal destruction enthusiasm mandatory for every character.

Treat it as personality/role-dependent situated response.

## Buddy Banter through ChatterBox

ChatterBox should receive enough context to avoid generic insult generation.

Useful inputs:

- both Resident identities;
- relationship/familiarity;
- current Heat;
- current activity;
- current Card / claim / object of disagreement;
- remembered previous encounters;
- who won / lost a prior scrap;
- recent help / gift / embarrassment;
- location;
- audience presence.

Possible result:

- jab;
- counter-jab;
- callback;
- challenge;
- de-escalation;
- reconciliation line.

The system should prefer callbacks grounded in actual remembered events over generic insult templates.

## Lean Memory extension

Lean Memory should store compact event receipts, not full transcripts.

Possible social-memory event:

```json
{
  "event": "kayfabe-social-encounter",
  "participants": ["resident.a", "resident.b"],
  "zone": "archive-courtyard",
  "topicRef": "card-or-local-topic-id",
  "beats": ["banter", "challenge", "scrap", "help-up"],
  "outcome": "reconciled",
  "witnesses": ["resident.c"],
  "notableCallback": "optional-small-reference"
}
```

Future ChatterBox calls may use this to produce:

- "last time you flattened me over that card...";
- recurring rivalry;
- callback jokes;
- increasing familiarity;
- knowledge of what the other Resident has actually said, shown or done.

Do not store every ambient line.

Do not infer omniscient shared knowledge.

A Resident knows an event only if they:

- participated;
- witnessed it;
- were later told about it through an explicit information path;
- or received it from another already-defined knowledge source.

## Cards as social knowledge

Over time Residents may learn:

- which Cards another Resident likes;
- which interpretations they repeat;
- which Cards caused previous arguments;
- which Cards they exchanged or discussed;
- which topics reliably generate playful Heat.

This can feed signature decks and ChatterBox without turning Cards into personality scores.

## PROPOSAL · social state example

Two Residents can therefore simultaneously have:

- **Bond:** close friends;
- **Heat:** very high;
- **Topic stance:** strongly opposed;
- **Current activity:** arguing;
- **Next possible beat:** fight;
- **Long-term relationship:** unchanged or even enriched by the remembered shared event.

That separation is the core of the intended satire.

## Narrative rule

The Town should not preach the thesis in explanatory dialogue.

Show it through behaviour:

- vicious-sounding argument;
- ridiculous escalation;
- slapstick combat;
- immediate help-up;
- affectionate callback later.

The system earns the satirical point by letting the player observe the contradiction.


---

# 23 · Social Attention and Gift Drive

## USER DIRECTION · 2026-09-22

NPC-to-NPC interaction should be able to start from **proximity / attention range** in a way analogous to how creatures in MMORPGs acquire aggro at a certain distance.

For KFB this is not automatically hostile aggro.

Another Resident entering range can become a **Social Point of Interest**.

One of the most common positive motives should be:

> **I have something I would like to give you.**

Each Resident may carry or have access to one or more suitable gift items:

- signature prop;
- food;
- useful object;
- funny object;
- Card-related object;
- small personal token;
- other real placeable/transferable prop supported by source truth.

The gift exchange may occur while the Residents simultaneously:

- tease one another;
- exchange insults;
- mock each other;
- provoke;
- argue;
- recall prior scraps;
- or otherwise behave with rough buddy-banter.

The social meaning is intentionally paradoxical:

**the behaviour can sound hostile while the underlying action is generous.**

This is a first-class expression of the KFB chill & fun / best-buddy baseline.

## Existing Town alignment

This extends already documented Town directions rather than inventing a separate economy:

- Market activity already includes **giving and trading**.
- Gift provenance is already considered meaningful enough to travel with session/import state.
- Social POP and buddy relationships already exist as separate concepts.

This concept does not create a new currency or general inventory owner.

## PROPOSAL · Social Attention Radius

Use the useful shape of MMO aggro without importing hostile semantics.

Working concept:

`SOCIAL_ATTENTION_RADIUS`

When another Resident enters the relevant range, the actor may:

1. perceive the other Resident;
2. decide whether they are currently interruptible;
3. evaluate possible social motives;
4. optionally orient / approach;
5. begin a social encounter.

A Resident entering range is therefore a candidate, not an automatic trigger.

Possible modifiers:

- line of sight;
- current activity interruptibility;
- relationship / familiarity;
- current Kayfabe Heat;
- pending gift intent;
- remembered unresolved social beat;
- role / Zone context;
- current Card/topic relevance;
- recent interaction cooldown;
- other higher-priority local POIs.

Do not start with a complex utility-AI score.

The first implementation can use a small ordered rule set.

## PROPOSAL · perception bands

A simple staged model may be clearer than one magic radius:

### FAR / IGNORE

Resident is present in world but irrelevant to this actor's current loop.

### NOTICE

Resident becomes a candidate social POI.

Possible behaviour:

- glance;
- head turn;
- short ambient recognition;
- continue current task.

### ENGAGE

Actor may leave an interruptible activity and approach.

Possible motives:

- greet;
- gift;
- banter;
- ask/respond;
- show Card/object;
- invite to shared activity.

### PERSONAL

Close enough for handoff / detailed interaction / challenge / help-up.

The exact distances belong to the host/world scale and should not be frozen globally in this concept.

## PROPOSAL · Gift Drive

Each Resident may expose a lightweight set of **Gift Intents**.

Candidate shape:

```json
{
  "resident": "resident.lorekeeper",
  "giftIntents": [
    {
      "giftRef": "canonical-asset-or-card-ref",
      "kind": "prop | food | card | token",
      "preferredRecipientTags": ["optional"],
      "reasonTag": "signature | useful | joke | callback | gratitude",
      "repeat": "once | cooldown | renewable"
    }
  ]
}
```

This is conceptual only.

The actual source object remains Asset Registry / Librarian owned.

The social layer owns the **intent to offer**, not the canonical item identity.

## Gift source modes

A gift may be:

### Carried signature gift

Already visually carried / attached / represented by the Resident.

Example:
a Resident visibly carries a suitable prop and decides to give that prop or a gift-token equivalent to another Resident.

### Local-world gift

A nearby world prop / food / Card becomes the offered object.

### Activity-produced gift

The Resident creates or obtains an item through a visible activity.

Example:

- baker → food;
- blacksmith → crafted prop;
- Lore Keeper → Card / book / archive token;
- gardener → flower;
- musician → perhaps a music-related token/prop.

Do not fabricate production systems before the visible activity exists.

## PROPOSAL · Gift Encounter grammar

A gift can be one motive inside the social encounter:

```
NOTICE_OTHER
  → HAS_GIFT_INTENT?
       yes → APPROACH
             → ACKNOWLEDGE
             → BANTER / INSULT / TEASE
             → OFFER_GIFT
             → ACCEPT / REACT
             → optional COUNTER-GIFT
             → optional continued BANTER
             → optional CHALLENGE / SCRAP
             → REPAIR / LAUGH
             → RESUME
       no  → other social motive / continue activity
```

Important:

**Gift and insult are not mutually exclusive branches.**

A Resident may say something cutting while physically handing over something generous.

This tension is desirable KFB tone.

## PROPOSAL · recipient as Point of Interest

Another Resident can therefore become a POI for reasons such as:

- "I want to give them this";
- "I owe them something";
- "I want to show them this Card";
- "I have a callback from our previous encounter";
- "I want to tease them";
- "I want to challenge them";
- "we have a shared activity available nearby".

This gives NPC roaming a readable motive.

Instead of wandering randomly, a Resident may visibly cross the scene because a social target became relevant.

## PROPOSAL · target selection without fake complexity

First version should use simple priority rules such as:

1. finish non-interruptible beat;
2. urgent local interaction;
3. pending gift to a visible eligible Resident;
4. respond to direct social approach;
5. remembered callback opportunity;
6. interesting local Card/prop POI;
7. ordinary activity loop.

This is only a starter ordering, not a global AI canon.

Different Residents can later weight these motives differently.

## PROPOSAL · Gift Handoff Station / semantic sockets

A social handoff should use the same Activity Station grammar as physical world activities.

Possible social sockets:

- `approach.from`
- `face.partner`
- `handoff.giver`
- `handoff.receiver`
- `show.item`
- `accept.item`
- `reject/playful`
- `helpUp`
- `walkTogether.exit`

The actor/motion owner resolves the actual animations.

The social layer requests a semantic handoff.

## PROPOSAL · Gift state and provenance

A gift event should distinguish at least:

- offered;
- accepted;
- rejected / deferred;
- transferred;
- displayed / placed later.

A transfer should record compact provenance:

- giver;
- recipient;
- gift source ref;
- encounter / Zone;
- optional reason;
- date/session/event id as defined by the existing save owner.

This matches the existing Town direction that **gift provenance matters**.

Do not clone a canonical asset merely because ownership changes.

Runtime representation may be a reference/state transition rather than binary duplication.

## Lean Memory

Gift events are strong candidates for Lean Memory because they are socially meaningful and useful for callbacks.

Example:

```json
{
  "event": "gift-transfer",
  "giver": "resident.a",
  "recipient": "resident.b",
  "giftRef": "canonical-gift-ref",
  "zone": "market",
  "context": "buddy-banter",
  "outcome": "accepted",
  "witnesses": ["resident.c"]
}
```

Later ChatterBox may reference:

- who gave whom what;
- whether it was appreciated;
- whether the gift followed an insult or fight;
- whether the recipient later carries/displays it;
- whether another Resident witnessed it.

Again: no omniscience.

## PROPOSAL · gifts can deepen, not quantify, relationships

Do not make "gift = +10 friendship".

The meaningful result is qualitative memory and new interaction material.

Possible effects:

- unlock callback;
- make a prop visible in the recipient's place;
- create a future return-gift motive;
- create teasing material;
- create gratitude or mock-gratitude;
- create a shared Card/lore reference;
- create a new local activity.

Bond can remain stable while the shared history becomes richer.

## PROPOSAL · asymmetry and failed handoffs are useful

Not every gift needs a clean sentimental success.

Examples:

- recipient mocks the gift but keeps it;
- recipient immediately offers something worse in return;
- recipient says the object is hideous and proudly displays it later;
- two Residents argue about who is doing whom the favour;
- a gift triggers a Kayfabe challenge;
- recipient is busy and the giver waits / follows / tries later.

The action remains generous even when the language is abrasive.

## PROPOSAL · avoid gift spam

Because every Resident may have something they want to give, guard against constant exchange loops.

Possible simple controls:

- one pending gift intent at a time;
- recipient cooldown;
- per-pair gift history;
- only interrupt selected activities;
- no immediate reciprocal infinite loop;
- rare / meaningful signature gifts stay one-time or long-cooldown;
- ambient social encounters may remain only banter.

The goal is **motivated social motion**, not a perpetual item conveyor belt.

## Relationship to Lore Keeper first fixture

The Lore Keeper can become the first bounded proof of this later without making LK-L1 depend on it.

Possible later Lore Keeper gift:

- Card;
- book;
- archive token;
- found prop.

Example future sequence:

```
Lore Keeper finds Card POI
→ archives / interprets it
→ later notices another Resident
→ approaches because of pending Gift Intent
→ insults their taste
→ hands them the Card anyway
→ recipient reacts
→ Lean Memory stores the exchange
```

This would connect Story Zone activity, POI discovery, social attention, ChatterBox and memory in one readable loop.

Do not require this full sequence for the first Lore Keeper visual/activity gate.


---

# 24 · Food Gifts, absurd promises and reaction library

## USER DIRECTION · 2026-09-22

Food props should become a major practical basis for the Gift Drive.

Use real source-backed props from the existing KFB asset corpus, especially:

- KayKit food / restaurant props;
- Tiny Treats Baked Goods;
- Tiny Treats Bakery Interior;
- Tiny Treats Charming Kitchen;
- Tiny Treats Pleasant Picnic;
- later other verified restaurant / diner / food packs already discoverable through Asset Librarian.

Current repo source evidence already includes concrete examples such as:

- `media/3D_Assets/KayKit_Restaurant_Bits_1.0_FREE/Assets/gltf/food_burger.gltf`;
- `food_stew.gltf`;
- `food_dinner.gltf`;
- ingredient props such as bun, ham, onion, steak, cheese, potato and carrot;
- Tiny Treats Baked Goods / Bakery / Kitchen / Picnic pack trees.

This is source-location evidence, not yet a curated Gift Catalog.

Asset Registry / Librarian remains the owner of exact identity and discoverability.

## Comedic direction

The Gift Drive should support **absurd framing, bizarre taste claims and exaggerated promised effects**.

The gift is physically real and source-backed.
The claimed effect is social/performance content.

These are deliberately different layers.

Example concept directions, not fixed verbatim lines:

- an Orc gives the bald Lore Keeper an ominously branded donut and confidently claims it is a completely reliable hair-loss remedy;
- a Skeleton gives Goth Girl a wrapped present promising to improve her gloomy attitude; the present produces a cartoon blast / jack-in-the-box style gag, briefly blackening her face with soot and setting tiny harmless flames flickering on her hair;
- after a short beat of mutual stunned silence, both Residents collapse into shared laughter, potentially escalating into exaggerated floor-rolling laugh animation with tear emanata.

The comedy comes from the contrast:

**abrasive social tone + genuine gift impulse + absurd promise + visible cartoon consequence + immediate shared enjoyment.**

## PROPOSAL · separate four gift layers

### Physical gift

Real object identity.

Examples:

- donut / pastry;
- bread;
- cake;
- burger;
- stew / meal;
- fruit / ingredient;
- wrapped present;
- Card;
- small prop / token.

### Claimed effect

ChatterBox / authored framing.

Possible claim families:

- beauty;
- mood;
- wisdom;
- courage;
- health;
- luck;
- social prestige;
- philosophical enlightenment;
- anti-gloom;
- deliberately bizarre pseudo-remedy.

These claims are comic world-performance, not hidden gameplay-stat truth.

### Local gag outcome

What actually happens visibly.

Examples:

- nothing;
- delighted reaction;
- disgust;
- tiny sparkle;
- soot face;
- tiny hair flames;
- singe smoke;
- comic recoil;
- coughing / sputtering;
- crying;
- laugh fit;
- mock offense;
- delayed bafflement.

### Social aftermath

What happens between Residents:

- insult;
- counter-insult;
- gratitude;
- mock gratitude;
- counter-gift;
- shared laughter;
- challenge;
- repair beat;
- later callback.

This separation lets one physical prop support many social stories.

## PROPOSAL · reusable Gift Gag grammar

```
NOTICE
→ APPROACH
→ BANTER
→ CLAIM / HYPE
→ OFFER_GIFT
→ ACCEPT / OPEN / CONSUME
→ GAG_OUTCOME
→ SHOCK_BEAT
→ REACTION_PAIR
→ LAUGH / REPAIR / CALLBACK
→ RESUME
```

The short **SHOCK_BEAT** is important.

For cartoon gift gags, a brief freeze / mutual stare before laughter can carry much of the timing.

## PROPOSAL · triggerable Reaction Library

The social system needs a reusable semantic Reaction Library.

The library should be triggerable by meaning, while the Animation/Motion owner resolves the exact clip.

### Micro reactions

- glance;
- head turn;
- double-take;
- nod;
- shrug;
- eye-roll;
- head tilt;
- small recoil;
- suspicious inspect;
- smug pause.

### Social reactions

- laugh small;
- laugh big;
- point-and-laugh;
- mock offense;
- embarrassed laugh;
- sarcastic bow;
- gratitude gesture;
- playful refusal;
- gift accept;
- show object;
- boast.

### Emotional reactions

- cry / weep;
- cartoon sob;
- laugh-cry;
- baffled freeze;
- shocked freeze;
- gloomy slump;
- proud pose;
- relieved settle.

### Gag / impact reactions

- soot-face reaction;
- singe / tiny-flame panic;
- pat-out-hair;
- cough / sputter;
- startle jump;
- stumble;
- light knockdown;
- dazed spin;
- belly-laugh fold;
- roll-on-floor laughter.

### Repair reactions

- help-up;
- shoulder slap;
- rough side-hug;
- shared toast;
- mutual laugh settle;
- walk off together;
- return to activity.

### Object reactions

- inspect gift;
- unwrap;
- sniff;
- nibble / eat;
- place down;
- pocket / stash;
- display proudly;
- hide awkwardly.

## PROPOSAL · semantic reaction triggers

Candidate event vocabulary:

- `gift.offered`
- `gift.accepted`
- `gift.opened`
- `gift.consumed`
- `gift.gag.soot`
- `gift.gag.flame`
- `gift.gag.recoil`
- `social.shock`
- `social.sharedLaugh`
- `social.mockOffense`
- `social.helpUp`
- `emotion.cry`
- `emotion.laughCry`

ChatterBox may request / bias a semantic reaction.

It does not directly author skeletal motion.

## PROPOSAL · reaction duration classes

Avoid one giant reaction state machine.

Start with:

- `INSTANT` — glance, blink, tiny recoil;
- `SHORT` — shrug, laugh burst, inspect, cough;
- `BIT` — unwrap → gag → shock → laughter;
- `RECOVERABLE_LOOP` — crying, laughing, singed idle, embarrassed idle.

A higher-priority non-interruptible Bit can temporarily suspend ordinary activity and then return control.

## PROPOSAL · Emanata / comic VFX

Lightweight presentation cues may include:

- laugh tears;
- tiny flames;
- soot;
- smoke curl;
- sweat drops;
- confusion glyph;
- aroma/stink lines;
- sparkle;
- cartoon burst.

These are social/comic presentation cues, not Combat VFX ownership.

## Lean Memory

Gift gags are strong Lean Memory candidates because they produce durable shared history.

Useful compact facts:

- giver;
- recipient;
- source-backed gift identity;
- absurd claim family / small callback tag;
- visible gag outcome;
- witnesses;
- whether the gift was kept / displayed;
- whether both laughed / argued / fought afterward.

Do not store the full generated transcript.

## Build-order guardrail

Do not make the full explosive-present gag a dependency for Lore Keeper LK-L1.

Recommended progression:

1. Lore Keeper basic activity;
2. simple source-backed food handoff;
3. one absurd claim;
4. one receiver reaction;
5. one shared laugh;
6. later one full multi-step cartoon gift gag;
7. later still crying / floor-roll / multi-clip reaction chains.

## Open source / animation questions

Before implementation:

- curate the exact first food Gift Catalog from Asset Librarian;
- prove exact carry/handoff compatibility for the selected actors;
- inventory existing laugh / cry / surprise / inspect / gift-accept clips;
- decide which missing reactions require additive authored clips;
- decide whether soot/singe is a temporary material/decal/VFX state or another existing presentation seam.

No missing clip is to be invented as already present.


---

# 25 · Minimal Resident Decision Loop v0

## GOAL

Define the smallest understandable NPC decision loop that can later drive:

- ordinary resident activity;
- Social Attention;
- Gift Drive;
- buddy banter;
- Card / prop POIs;
- reaction clips;
- optional Kayfabe escalation;
- Lean Memory callbacks.

This is deliberately **not** a general utility-AI / behaviour-tree / GOAP framework.

The first implementation should be inspectable in a debugger and explain why a Resident chose an action.

## Core idea

Residents do not continuously "think about everything".

They mostly execute their current Activity.

They reconsider only when:

- an Activity reaches an interruptible beat;
- a meaningful perception event occurs;
- another Resident directly engages them;
- a current interaction completes / aborts;
- a high-priority host event requires it.

Conceptual loop:

```
CURRENT_ACTIVITY
   ↓
PERCEIVE
   ↓
NOTICE candidates
   ↓
CAN_INTERRUPT?
   ├─ no  → remember candidate briefly → CURRENT_ACTIVITY
   └─ yes
        ↓
GENERATE small motive set
        ↓
SELECT one motive + target
        ↓
CLAIM / RESERVE social interaction
        ↓
APPROACH or ORIENT
        ↓
ENCOUNTER BIT
        ↓
REACTION / CONSEQUENCE
        ↓
LEAN MEMORY receipt if meaningful
        ↓
COOLDOWN / RELEASE
        ↓
RESUME prior activity or choose next local activity
```

## 25.1 · Activity reports interruptibility

Every running Activity should expose only the minimum needed social seam.

Conceptually:

```js
activityState = {
  id: "study-at-lectern",
  phase: "reading",
  interruptible: true,
  resumeToken: "lectern.reading",
  priorityClass: "ordinary"
}
```

Examples:

### Interruptible

- idle;
- reading pause;
- wandering;
- shelf inspection finished;
- standing at market stall;
- ordinary social idle.

### Temporarily non-interruptible

- mid-handoff;
- opening present;
- current gag Bit;
- help-up;
- knockdown/recovery;
- important path transition;
- host-owned combat exchange;
- critical animation/contact phase.

This prevents a Resident from abandoning a gift halfway between two hands because somebody else entered NOTICE range.

## 25.2 · Perception produces candidates, not commands

Perception should produce a compact list.

Possible candidate kinds:

- `RESIDENT`
- `GIFT_TARGET`
- `CARD_POI`
- `PROP_POI`
- `ACTIVITY_STATION`
- `DIRECT_SOCIAL_REQUEST`
- `HOST_EVENT`

A perception record may contain:

```js
{
  targetId,
  kind,
  band: "NOTICE | ENGAGE | PERSONAL",
  visible,
  reachableHint,
  reasonTags
}
```

Perception does not decide the action.

## 25.3 · Small motive set

For the first version, generate only a few semantic motives.

Suggested starter motives:

- `RESPOND` — another Resident explicitly approached / addressed me;
- `GIFT` — I have a pending Gift Intent compatible with this Resident;
- `CALLBACK` — Lean Memory offers one relevant shared-history callback;
- `SHOW` — I want to show a Card / object;
- `BANTER` — lightweight buddy interaction;
- `SHARED_ACTIVITY` — a nearby Station can take both;
- `CHALLENGE` — Kayfabe escalation is contextually allowed;
- `INSPECT_POI` — Card / prop / local object;
- `CONTINUE` — do nothing socially.

Do not start with dozens of motives.

## 25.4 · Simple selection before utility AI

First implementation should use an explicit priority ladder plus small character biases, not an opaque floating-point score soup.

Starter ordering:

1. host-required / direct response;
2. finish / repair an already-open social encounter;
3. pending Gift Intent with an eligible visible target;
4. relevant remembered callback;
5. show / discuss current Card or object;
6. shared Activity opportunity;
7. ordinary banter;
8. optional challenge;
9. local non-social POI;
10. continue current Activity.

This is not final canon.

Individual Residents may later alter the ordering or add a small bias.

Example:

- Lore Keeper may prefer Card / archive POIs;
- Orc may prefer gift + banter;
- Clown may prefer performance / provocation;
- Goth Girl may have a higher threshold for interruption.

But the system should still be able to print:

> selected GIFT because pending gift exists, target eligible, actor interruptible, target free.

## 25.5 · Seeded tie-break, not chaotic randomness

If two candidates are otherwise equivalent:

- use a small seeded tie-break;
- preserve replay/debug value;
- avoid choosing a completely different social life every frame.

Randomness should create variation, not erase causality.

## 25.6 · Pair Lock / Social Reservation

Before walking toward another Resident, attempt a lightweight social reservation.

Conceptual state:

```js
socialPair = {
  initiator: "resident.orc",
  partner: "resident.lorekeeper",
  motive: "GIFT",
  state: "RESERVED | APPROACHING | ENGAGED | RELEASING"
}
```

Purpose:

- prevent five Residents simultaneously trying to hand the same target a sandwich;
- prevent both actors starting incompatible interactions;
- provide one shared encounter context;
- make abort/release deterministic.

A target may refuse / defer if currently non-interruptible.

No permanent ownership is implied.

## 25.7 · Approach is host-owned navigation

Social logic requests:

`APPROACH(targetId, desiredBand = PERSONAL)`

The world/navigation owner determines the actual path.

The social system must handle:

- path unavailable;
- target moved away;
- target became busy;
- timeout;
- actor became non-interruptible through host event.

On failure:

`RELEASE → optional short cooldown → RESUME`

Do not teleport actors to complete social logic.

## 25.8 · Encounter Bit

Once both Residents are in valid range and available, run one bounded Encounter Bit.

A Bit has:

- motive;
- initiator;
- partner;
- optional object/Card;
- a short beat list;
- semantic reaction requests;
- abort/release condition.

### Minimal Gift Bit

```
ACKNOWLEDGE
→ optional BANTER
→ OFFER
→ ACCEPT / DEFER
→ REACT
→ RELEASE
```

### Gift Gag Bit

```
ACKNOWLEDGE
→ BANTER
→ CLAIM / HYPE
→ OFFER
→ OPEN / CONSUME
→ GAG_OUTCOME
→ SHOCK_BEAT
→ SHARED_REACTION
→ RELEASE
```

### Banter Bit

```
ACKNOWLEDGE
→ JAB
→ COUNTER
→ LAUGH / SHRUG / WALK_OFF
→ RELEASE
```

### Kayfabe challenge Bit

```
ACKNOWLEDGE
→ JAB
→ COUNTER
→ CHALLENGE
→ host decides whether social melee can start
```

If host rejects combat:

`mock disappointment / laugh / release`

If host accepts:

Combat owner takes the physical exchange and returns a completion result to the social encounter.

## 25.9 · ChatterBox position in the loop

ChatterBox receives a bounded Encounter Context.

Suggested fields:

```js
{
  initiator,
  partner,
  motive,
  currentBeat,
  giftRef,
  cardRef,
  zoneId,
  bond,
  heat,
  topicRef,
  relevantMemoryRefs,
  reactionState
}
```

ChatterBox may provide:

- utterance;
- register / bubble presentation;
- jab/counter intent;
- absurd gift claim;
- semantic reaction suggestion.

It does not decide:

- navigation coordinates;
- skeletal animation;
- inventory mutation;
- combat damage;
- persistent reward;
- relationship truth.

A deterministic authored fallback should remain available if generated dialogue is late or unavailable.

## 25.10 · Reaction resolution

Encounter code emits semantic reactions.

Example:

`REACTION("social.sharedLaugh", intensity="BIG")`

The Reaction/Motion adapter resolves:

1. exact approved clip if available;
2. smaller compatible clip;
3. safe fallback gesture;
4. no physical reaction, if unsupported.

Missing `ROLL_ON_FLOOR_LAUGH` must not invent a fake clip.

The semantic event can still exist while animation evidence remains pending.

## 25.11 · Gift transfer is an explicit commit point

Do not mutate gift ownership when the approach starts.

Transfer only at a clear beat:

`gift.accepted → TRANSFER_COMMIT`

Before that:

- giver still owns / represents the gift;
- abort returns to giver state.

After commit:

- provenance receipt is written;
- recipient may carry / display / place according to receiving owner;
- giver's Gift Intent resolves / cools down.

This prevents half-completed social interactions from corrupting state.

## 25.12 · Meaningful Memory receipt

Only after the Bit completes should it decide whether an event is memorable.

Examples worth storing:

- actual gift transfer;
- first meeting;
- funny gag outcome;
- fight + help-up;
- major Card disagreement;
- promise;
- unusual shared activity.

Ordinary greeting or repeated ambient banter need not become durable memory.

Minimal receipt:

```json
{
  "event": "gift-transfer",
  "participants": ["giver", "recipient"],
  "objectRef": "gift-ref",
  "zone": "zone-id",
  "outcome": "accepted",
  "callbackTags": ["absurd-claim", "shared-laugh"]
}
```

Witnesses are added only through actual perception / host evidence.

## 25.13 · Cooldowns and anti-loop rules

After an encounter:

- per-pair social cooldown;
- Gift Intent cooldown / completion;
- short target reacquisition block;
- no immediate reciprocal gift unless explicitly authored;
- do not re-trigger the same memory callback continuously;
- Resident returns to prior `resumeToken` where possible.

This prevents two NPCs from oscillating forever between:

`gift → gift → gift → gift`

## 25.14 · Minimal state machine

Candidate implementation state vocabulary:

```
ACTIVITY
NOTICE
EVALUATE
RESERVE
APPROACH
ENGAGE
REACT
COMMIT
RELEASE
RESUME
```

Optional later states should not be added until one real Resident pair proves a need.

## 25.15 · First deterministic proof

Do not test the whole Town.

Use exactly two Residents and one gift.

Recommended conceptual fixture:

- giver: one Resident with one real food Gift Intent;
- recipient: Lore Keeper or another already-proven Resident;
- both start in ordinary Activities;
- recipient enters NOTICE / ENGAGE range;
- giver becomes interruptible;
- motive selector chooses GIFT;
- Pair Lock succeeds;
- host path reaches PERSONAL range;
- short Banter;
- handoff commit;
- one receiver Reaction;
- one shared laugh or settle beat;
- Memory receipt;
- both resume prior Activities.

Acceptance questions:

- Can the system explain why GIFT won?
- Does the giver wait for an interruptible beat?
- Can approach abort safely?
- Does transfer happen only once?
- Do both Residents resume?
- Does the same seed reproduce the same tie-break?
- Is only one compact memory receipt written?

If these pass, add absurd claim / gag outcome next.

Do not add Combat, crowds or complex utility scoring to the first proof.

## 25.16 · Debug visibility

For authoring/testing, expose a compact optional debug readout per Resident:

```
Activity: study-at-lectern / interruptible
Noticed: Orc @ ENGAGE
Motives: GIFT, BANTER, CONTINUE
Selected: GIFT
Pair: reserved with Orc
Beat: APPROACH
Memory: none yet
```

This should be a ToolBox/debug affordance, not permanent player-facing HUD.

The goal is to make emergent-looking behaviour **explainable and authorable**.


---

# 26 · Player Gift Conversations and Backpack Inventory

## USER DIRECTION · 2026-09-22

Gift Drive extends from NPC↔NPC to **NPC↔player**.

Residents may actively want to give the player something.

The gift should usually be connected to a short in-world conversation rather than appearing as a detached reward popup.

Preferred interaction:

- Monkey-Island-like selectable replies;
- ChatterBox / Triplet conversation;
- speech bubbles remain in-world where possible;
- one or two short conversational turns are enough;
- once the exchange meaningfully resolves, the Resident may offer the gift;
- the player receives an early visible Backpack;
- the Backpack carries a deliberately limited Gift Inventory;
- objects received from Residents may later be given to other Residents through the same social conversation grammar.

The result is a circulation of **social objects with provenance**, not one-way loot.

## Existing call terminology

Current KFB source defines the canonical player-facing labels:

- **KayfaBINGO**
- **KayfaBONGO**
- **KayfaBOGGLE**
- **BLÖDSINN!**

Internal IDs remain:

- `bingo`
- `bongo`
- `boggle`

Georg's shorthand "Bingo / Boggle / Bongo" refers to this existing call family.

Do not silently restore obsolete player-facing spellings.

## PROPOSAL · player Bubble Calls

The player answers inside the scene through a compact bubble choice rather than a detached dialogue screen.

Minimal first call set:

- `KayfaBINGO`
- `KayfaBOGGLE`
- `KayfaBONGO`
- `BLÖDSINN!`

These are **conversation moves**, not four quiz answers.

### KayfaBINGO

The current idea/beat landed enough to continue.

### KayfaBOGGLE

The player signals confusion / asks for clarification.

The Resident may answer one short question or reframe.

### KayfaBONGO

The player challenges an overly mechanical / abstract framing and pushes it toward a concrete story beat.

### BLÖDSINN!

The player rejects the premise / calls nonsense / breaks the frame.

That may produce:

- mock offense;
- counter-banter;
- a reframe;
- laughter;
- a different gift framing;
- an early conversation end.

No call should automatically be the hidden "correct" choice.

## PROPOSAL · one- or two-turn microconversation

```
NPC notices PLAYER
→ NPC opens with Triplet / gift-related premise
→ PLAYER_CALL_1
→ NPC response
→ optional PLAYER_CALL_2
→ NPC resolution
→ GIFT_OFFER
→ player ACCEPT / DEFER / DECLINE
→ TRANSFER_COMMIT if accepted
→ Backpack update
→ Lean Memory receipt
→ reaction / release / resume
```

Ordinary gift conversation should stay short.

Support:

- one-call quick exchange;
- two-call richer exchange;
- early `BLÖDSINN!`;
- defer / walk away;
- later callback.

Do not turn every social gift into a quest dialogue tree.

## PROPOSAL · gift rewards engagement, not correctness

The gift is normally a reward for **participating in / resolving the social beat**, not for choosing a single correct button.

Possible outcomes:

- all reasonable branches still give the gift;
- one branch delays it;
- one branch changes the gift or the gag framing;
- `BLÖDSINN!` may delight a particular Resident;
- prior Lean Memory may change what gets offered.

This keeps Monkey-Island-style interaction playful rather than test-like.

## Player as social target

Extend Decision Loop v0:

```
Resident notices PLAYER
→ candidate social motive
→ GIFT / BANTER / SHOW / CALLBACK / INVITE
→ approach / call out
→ Bubble Conversation
```

The player lives in the same social world.

Do not create a second "quest NPC" dialogue runtime.

## PROPOSAL · Player Encounter Bit

Candidate player-facing state flow:

```
OPEN
→ PLAYER_CHOICE
→ NPC_REPLY
→ optional PLAYER_CHOICE
→ RESOLVE
→ GIFT_OFFER
→ TRANSFER_COMMIT
→ REACTION
→ MEMORY
→ RELEASE
```

Bounded context example:

```js
{
  speaker: "resident.orc",
  listener: "player",
  motive: "GIFT",
  beat: "PLAYER_CHOICE",
  tripletRef: "optional",
  playerCall: "boggle",
  giftRef: "canonical-gift-ref",
  relevantMemoryRefs: []
}
```

ChatterBox may select/generate the response inside this bounded context.

## In-world presentation

Preferred presentation:

- NPC bubble anchored to speaker;
- compact player-choice bubble / strip / fan nearby;
- scene remains visible;
- no full-screen dialogue takeover for ordinary encounters;
- ChatterBox / bubble owner remains presentation owner.

Exact controls for mouse/touch/controller remain a later UI gate.

## PROPOSAL · Backpack as visible inventory metaphor

The player's Backpack has two roles:

1. **visible avatar presentation / backpack profile**
2. **entry point / metaphor for a bounded Gift Inventory**

Do not encode inventory truth inside a mesh.

The 3D Backpack is presentation.
Gift Inventory is state.

## Source-backed Backpack donors

Current source evidence supports several useful backpack forms.

### Orc Backpack

Canonical Resident Atlas asset:

`media/3D_Assets/KayKit_Mystery_Series6/1 - July 2023 - Orc Raider/assets/gltf/Orc_Backpack.gltf.glb`

### Hoarder Backpack

Current repo source:

`media/3D_Assets/KayKit_Mystery_Series6/8 - February 2026 - Hoarder/gltf/Hoarder_Backpack.gltf`

The Hoarder character also carries the same backpack family as a sibling mesh.

### Hiker Backpack

Current S38 donor evidence:

`Hiker_Backpack` exists as a modular sibling mesh on the Hiker character.

It is not a separate normal pack asset file.

### Protagonist A + Protagonist B backpacks

Current S38 donor evidence confirms:

- `Protagonist_A.glb`
- `Protagonist_B.glb`
- both are Rig_Medium;
- both visibly carry backpack sibling meshes;
- the two backpack meshes are almost identical in measured vertex count;
- the free-standing backpacks seen in the promo are Blender-separated copies, not separate source files.

These are therefore **valid visual Backpack donors**, but extraction into reusable standalone player-backpack assets is a separate authoring/provenance task.

## USER CORRECTION · Goth Girl + Elisa setting

Georg clarified the intended setting reference as:

**Goth Girl + Elisa**

The two Protagonist backpack designs are useful visual candidates for the Elisa-oriented setting with Goth Girl.

Do not misname this as "Crossgirl".

Do not infer that Elisa is herself a KayKit source character.

Goth Girl remains the source-backed KFB Resident.

The Elisa setting is a receiving scene/context; its exact player/avatar source remains owned by that lane.

## PROPOSAL · Backpack Profile / Skin layer

Use a profile concept rather than baking inventory state into one donor:

```json
{
  "profile": "player-backpack-profile",
  "visualDonor": "protagonist-a-backpack",
  "attachmentProfile": "rig-medium-back",
  "inventoryRef": "player-gift-backpack"
}
```

Possible future visual donors:

- Protagonist A backpack;
- Protagonist B backpack;
- Hoarder Backpack;
- Hiker Backpack;
- Orc Backpack;
- other source-proven variants.

Each donor needs its own visible/source gate before becoming selectable.

## PROPOSAL · Bounded Gift Inventory

Working concept:

`PLAYER_GIFT_BACKPACK`

The player carries a deliberately small number of social objects.

Exact slot count remains open until UX/play proof.

Candidate record:

```json
{
  "instanceId": "gift-instance-id",
  "assetRef": "canonical-source-ref",
  "kind": "food | prop | card | token",
  "provenance": {
    "from": "resident.orc",
    "eventRef": "social-event-id",
    "zone": "archive",
    "reasonTag": "gift"
  },
  "state": "carried | displayed | offered | transferred"
}
```

Backpack stores references/state, never duplicate model binaries.

## Inventory vs Lean Memory

Keep them linked but distinct.

### Inventory asks

**What transferable social objects does the player currently carry?**

### Lean Memory asks

**What meaningful event happened around this object?**

Example:

Inventory:
- one food gift.

Lean Memory:
- who gave it;
- what absurd promise came with it;
- which Call the player used;
- who witnessed the exchange;
- whether it later changed hands.

An item may leave Inventory while its memory remains.

## PROPOSAL · player re-gifting

A Backpack item can become a player-originated Gift Intent.

```
player approaches Resident
→ social Bubble interaction
→ player Call / gift branch
→ choose eligible Backpack item
→ NPC banter / reaction
→ TRANSFER_COMMIT
→ item leaves player inventory
→ recipient provenance updates
→ Lean Memory receipt
```

The recipient may later:

- carry it;
- display it;
- re-gift it;
- mock it;
- remember it;
- use it in ChatterBox callbacks.

This creates a circulating social ecology.

## Triplets + gifting

Gift interaction should not collapse into:

> "Hello, here is item X."

The Triplet / call exchange provides the social framing.

A simple gift may therefore become:

```
NPC premise / Triplet
→ player Call
→ NPC counter / clarification
→ gift reveal
→ accept / defer
→ handoff
→ reaction
```

The same physical gift can acquire different remembered meaning from the conversation around it.

## PROPOSAL · Backpack capacity creates curation, not grind

Limited capacity is useful if it creates choices:

- keep a funny/significant object;
- display it elsewhere;
- give it onward;
- decline another gift;
- replace a low-meaning item.

Do not turn this into weight management or survival inventory.

The Backpack is a **social-memory inventory** first.

## PROPOSAL · first player-facing proof

After the two-NPC Decision Loop proof, use one Resident + player.

Exactly:

1. Resident notices player;
2. Resident has one real source-backed food Gift Intent;
3. Bubble opens;
4. player chooses one canonical Call;
5. Resident responds once;
6. Resident offers gift;
7. player accepts;
8. one `TRANSFER_COMMIT`;
9. Backpack shows one item reference + provenance;
10. one Lean Memory receipt;
11. conversation closes;
12. world control resumes.

Second proof:

- player gives the same object to a different Resident;
- original provenance remains readable;
- inventory loses the object;
- new recipient gets a social callback opportunity.

No full quest system required.

## Open gates

Before implementation:

- exact player/avatar owner for the receiving world;
- exact first Backpack visual donor;
- attachment compatibility per rig/player avatar;
- first slot count;
- Bubble choice presentation on desktop/mobile;
- exact Triplet/ChatterBox player-call adapter;
- save owner for Gift Inventory;
- whether displayed gifts leave Backpack or remain referenced;
- Backpack donor extraction for sibling-mesh-only sources such as Protagonists/Hiker.


---

# 27 · Shared Social / Gift Data Contract v0

## STATUS

**PROPOSAL ONLY · DATA CONTRACT SHAPED · NO RUNTIME IMPLEMENTATION**

Machine-readable contract:

`SOCIAL_GIFT_DATA_CONTRACT_v0.json`

Deterministic documentation fixtures:

`SOCIAL_GIFT_FIXTURES_v0.json`

The contract is intentionally small enough to serve the first three proofs:

1. `RR-GIFT-01` — Resident → Resident;
2. `RP-GIFT-01` — Resident → Player + Bubble Call + Backpack;
3. `PR-GIFT-01` — Player → Resident re-gift with preserved provenance.

## Source alignment

The contract reuses existing ideas rather than creating parallel owners.

### Scene authoring

`kfb.scene-patch.v1` remains the transform/edit patch seam.

The social contract does not serialize scene transforms or become a second scene graph.

### ChatterBox / semantic generation

The existing NIE adapter hook already establishes:

- bounded request context;
- fallback;
- deadline;
- response text;
- semantic `tell`;
- bubble/emote/timing hints.

The social contract therefore carries only references/context needed to ask ChatterBox.

It does not duplicate a second prompt/response protocol.

### Lean Memory

The existing MomentReceipt direction already establishes:

> store compact reconstructible facts and refs rather than whole runtime dumps.

`MemoryReceipt` in this contract follows the same principle.

No full conversation transcript is required for durable memory.

## The eight v0 record types

### 1 · ActivityState

Answers:

**What is the actor doing, and may social logic interrupt now?**

Minimum:

- actor;
- activity;
- phase;
- interruptible;
- priority class;
- optional resume token;
- optional Activity Station ref.

This keeps Activity owner truth visible.

### 2 · PerceptionCandidate

Answers:

**What did this actor notice?**

It does not command behaviour.

A candidate can be:

- Resident;
- player;
- Card/prop POI;
- Station;
- direct request;
- host event.

It carries attention band and visibility/reachability hints.

### 3 · Motive

Answers:

**Why would the actor act on that candidate?**

v0 motives remain deliberately small:

- RESPOND;
- GIFT;
- CALLBACK;
- SHOW;
- BANTER;
- SHARED_ACTIVITY;
- CHALLENGE;
- INSPECT_POI;
- CONTINUE.

Selection uses explicit priority/reason tags before any opaque utility score.

### 4 · SocialPair

Answers:

**Who has reserved whom for this one encounter?**

This is a short-lived reservation, not relationship ownership.

It prevents social pile-ups and gives approach/abort one shared context.

### 5 · EncounterBit

Answers:

**What bounded social thing are these participants currently doing?**

Examples:

- GIFT;
- GIFT_GAG;
- BANTER;
- SHOW;
- CALLBACK;
- PLAYER_GIFT_CONVERSATION;
- KAYFABE_CHALLENGE.

The Bit owns semantic beats only.

Navigation, animation, inventory save and combat remain external owners.

### 6 · PlayerCall

Answers:

**Which in-world social move did the player choose?**

Current canonical choices:

| ID | Player-facing label |
|---|---|
| `bingo` | KayfaBINGO |
| `bongo` | KayfaBONGO |
| `boggle` | KayfaBOGGLE |
| `bloedsinn` | BLÖDSINN! |

The `bloedsinn` ID was rechecked against the canonical glossary / runner source before this contract was retained.

### 7 · GiftInventoryItem

Answers:

**Which transferable social object does the player currently carry, and where did it come from?**

Carries:

- unique instance ID;
- canonical source ref;
- object kind;
- current state;
- optional visual/carry profile;
- provenance.

No model binary is copied into the inventory.

### 8 · MemoryReceipt

Answers:

**What socially meaningful event is worth remembering later?**

Carries only compact semantic facts:

- participants;
- time/tick;
- Zone;
- encounter;
- object;
- player Call where relevant;
- outcome;
- callback tags;
- actual witnesses;
- source refs.

Not every line of Banter becomes Memory.

## Hard commit points

The most important contract feature is that transitions are explicit.

### SOCIAL RESERVATION

`SocialPair = RESERVED`

No approach before the target is reserved/available.

### PLAYER CHOICE

Create `PlayerCall`.

The call is an event; it is not hidden in a transcript string.

### GIFT ACCEPTED

`transferState = ACCEPTED`

Still no ownership mutation yet.

### TRANSFER_COMMIT

Only here does the receiving Save/Inventory owner mutate object ownership.

This must happen once.

Before commit:
the giver still owns the gift.

After commit:
rollback requires a new explicit event.

### MEMORY COMMIT

Write a compact `MemoryReceipt` only after a meaningful completion/commit.

### RELEASE

Release the pair and resume/reselect Activity.

## Abort semantics

A good social system must fail cleanly.

Abort conditions include:

- target becomes busy;
- target walks away;
- player walks away;
- path unavailable;
- reservation timeout;
- host event interrupts;
- interaction deliberately declined.

Before `TRANSFER_COMMIT`:
no gift changes owner.

An aborted encounter normally writes no durable memory unless the abort itself becomes a meaningful authored event.

Late generated ChatterBox output may not resurrect a released encounter.

## Fixture chain

### RR-GIFT-01

Two Residents.

Demonstrates:

- ordinary Activities;
- perception;
- GIFT motive;
- Pair Lock;
- bounded Gift Encounter;
- one transfer commit;
- one Memory receipt;
- resume.

### RP-GIFT-01

Resident and player.

Demonstrates:

- player as social target;
- one Bubble Call;
- one NPC response context;
- one Gift transfer;
- one Backpack item;
- provenance;
- one Memory receipt.

The current fixture uses real source evidence:

`KayKit_Restaurant_Bits_1.0_FREE/.../food_burger.gltf`

as documentation input.

That does not yet prove handoff animation/scale suitability.

### PR-GIFT-01

Player gives the same gift onward to Goth Girl.

Demonstrates the crucial social-object invariant:

**ownership may change; origin history does not disappear.**

The original asset reference remains the same.

The provenance chain grows:

`Orc → Player → Goth Girl`

and can later feed ChatterBox callbacks.

## Why v0 stops here

Do not add yet:

- general AI framework;
- arbitrary utility scoring;
- crowd scheduler;
- quest logic;
- weight/equipment stats;
- full inventory UI;
- combat implementation;
- reaction animation authoring;
- world pathfinder;
- transcript memory;
- automatic personality/ideology model.

The contract earns expansion only when one of the three fixtures genuinely cannot be represented.

## Next implementation-facing question

Before code, verify only:

1. which existing Save/Persistence owner should hold `GiftInventoryItem`;
2. which host actor/player IDs are canonical in the first receiving world;
3. which current ChatterBox caller can consume the bounded Encounter context;
4. which one source-backed food gift is easiest to carry/handoff visibly.

Everything else can remain v0.


---

# 28 · Persistence decision and first pink-donut gift

## USER DECISION · persistence home

Gift Inventory persistence should live with the existing **Session / Journey / Fractal Almanac** direction.

This means the same broad journey-memory layer is the conceptual home for:

- the player's current transferable Gift Inventory;
- gift provenance;
- Lean Memory receipts;
- remembered social encounters;
- later Journey / Almanac reconstruction.

Existing source direction already describes the Fractal Almanac as:

- collection;
- Journey Memory;
- Story / Replay layer;
- Save metaphor.

Therefore do **not** create a separate "gift save system".

The exact runtime storage adapter remains an implementation detail to resolve against the current Session/Journey save owner.

## USER DECISION · first visible gift

Replace the temporary burger fixture with:

**Tiny Treats · pink donut**

Exact source:

`media/3D_Assets/Tiny_Treats_Baked_Goods_1.0_FREE/Assets/gltf/donut_pink.gltf`

The asset is already present in Registry/source evidence and has also been used by an existing KFB donor as `donut_pink`.

This becomes the first preferred visible gift candidate for:

- Resident → Resident;
- Resident → Player;
- Player → Resident re-gift.

The three v0 documentation fixtures now reference this source.

## Why the pink donut is a good first gift

It is:

- visually readable;
- small enough for a simple carry/handoff test;
- already source-backed;
- compatible with the absurd gift-claim direction;
- especially suitable for the earlier Orc → Lore Keeper miracle-donut concept.

The first proof does **not** need the full "hair-loss miracle" gag.

A minimal first handoff can simply prove:

`offer → accept → transfer → Backpack → provenance → re-gift`

The bizarre claim / reaction layer can be added after the object transfer itself works.

## CORRECTION · technical questions removed from Georg's gate

Two previously listed open questions are **not** product decisions Georg needs to answer:

- exact canonical player/actor IDs in the selected host;
- exact current ChatterBox caller/adapter function.

These are implementation integration details.

The implementation owner must recover them from the chosen current host and ChatterBox code.

Do not return these as abstract technical questions to Georg unless a concrete conflict requires a product choice.

## Human-readable next question

The next useful product-level question is no longer:

> Which internal actor ID / caller seam should we use?

It is simply:

> **Which first social gift encounter do we want to see working?**

Current suggested proof remains:

**Orc → player / Lore Keeper with pink donut**, using one short Bubble exchange and one successful gift handoff.


---

# 29 · First Player Proof · Orc → Player → Pink Donut

## DECISION · 2026-09-22

The first player-facing social gift proof is:

**Orc → Player with the Tiny Treats pink donut**

Exact gift source:

`media/3D_Assets/Tiny_Treats_Baked_Goods_1.0_FREE/Assets/gltf/donut_pink.gltf`

The Lore Keeper remains the first Story Zone / Activity proof.

This Player Proof is separate and intentionally small.

## Proof goal

Prove one complete player-facing social-object loop without requiring Combat, crowd AI or general quest logic:

```
Orc notices player
→ short in-world Bubble exchange
→ player chooses one canonical Call
→ Orc replies
→ pink donut becomes visible offer
→ player accepts
→ TRANSFER_COMMIT
→ donut enters bounded Backpack inventory
→ Session / Journey / Fractal Almanac records provenance + Lean Memory
→ interaction releases
→ world control resumes
```

Canonical player Calls remain:

- KayfaBINGO
- KayfaBONGO
- KayfaBOGGLE
- BLÖDSINN!

The gift is not a reward for one hidden correct answer.

## Minimal acceptance

The first proof should visibly answer:

- Did the Orc notice and address the player?
- Was the interaction shown in-world rather than a detached quest window?
- Could the player make one real Bubble Call?
- Did exactly one donut transfer occur?
- Does the Backpack contain one source-backed item instance afterward?
- Is the giver/source/provenance visible in the Session/Journey/Fractal Almanac state?
- Can the encounter close and restore world control cleanly?

The full miracle-hair-loss gag is optional after the transfer path works.

---

# 30 · Access Props / Keys

## USER DIRECTION · 2026-09-22

KFB should support **physical keys / access props** for entry into:

- mini-games;
- Card decks / deck content;
- worlds;
- dungeons;
- portals;
- events / scenes;
- other bounded content modules.

The inspiration is the readable physical access-token idea familiar from Mythic/keystone-style dungeon access.

Do **not** copy the exact WoW economy, difficulty system or progression structure.

The KFB value is:

> access should be represented by a thing the player can actually possess, inspect and remember.

## Source-backed current candidates

Verified current source geometry:

### KayKit Dungeon key

`media/3D_Assets/KayKit_Dungeon_Pack_1.1_FREE 2/Assets/gltf/key.gltf`

### KayKit keyring

`media/3D_Assets/KayKit_Dungeon_Pack_1.1_FREE 2/Assets/gltf/keyring.gltf`

### KayKit hanging keyring

`media/3D_Assets/KayKit_Dungeon_Pack_1.1_FREE 2/Assets/gltf/keyring_hanging.gltf`

### Sci-Fi keycard

`media/3D_Assets/SciFI_Ultimate Space Kit_Quaternius/Items/GLTF/Pickup_KeyCard.gltf`

The linked VFX+KEYS+ASSETS handoff contains these source-backed candidates.

## Gold / Silver direction

Georg explicitly wants:

- **silver key**
- **gold key**
- **keyrings**

The current inspected source/handoff proves the key geometry and keyrings.

It does **not yet prove separate gold-key and silver-key source files**.

Therefore:

- gold/silver are accepted **presentation/access-tier directions**;
- exact material/palette/source implementation remains a donor proof;
- do not silently invent separate KayKit files.

A later visual proof may show that one source key can legitimately support gold/silver material profiles, or may find separate real donors.

## PROPOSAL · AccessPropItem

Access Props should be additive to the existing Backpack / Almanac model.

Conceptually:

```json
{
  "instanceId": "access-prop-instance",
  "assetRef": "canonical-key-source",
  "accessRefs": ["dungeon.foo", "deck.bar"],
  "presentationProfileRef": "optional-gold-or-silver-profile",
  "provenanceRef": "almanac-receipt",
  "state": "carried",
  "transferPolicy": "bearer | bound | consumable | undecided",
  "usePolicy": "reusable | consume-on-use | charge-based | undecided"
}
```

The physical prop is visible.

The receiving game/world/deck owner still owns actual access truth.

## Bearer-token possibility

One attractive KFB interpretation is physical bearer access:

- whoever carries the key can enter;
- giving the key away may also give away access;
- the Almanac remembers who found / gave / used it.

This remains a proposal, not a universal rule.

Some keys may later be:

- reusable;
- consumed;
- bound to player;
- temporary;
- linked to one generated dungeon/world seed.

Do not decide all of these globally before one key proof exists.

## Keyrings

Keyrings should be treated primarily as:

- collection/display props;
- grouped access presentation;
- possible world pickup / wall prop.

They must not duplicate access grants simply because multiple visible keys exist on one ring.

## Machine-readable candidate file

See:

`ACCESS_PROP_CANDIDATES_v0.json`

## Important scope guard

Keys are **not** a dependency of the first Orc → Player pink-donut proof.

They are the next inventory/access lane after the gift loop proves physical-object persistence.

---

# 31 · Combat + World VFX candidate lane

## USER DIRECTION · 2026-09-22

Georg wants to explore selected VFX for later Combat and World use, especially:

- muzzle flash / Mündungsfeuer;
- electric / lightning-like effects;
- slice / sweep / slash effects;
- blood impact FX;
- hit impacts;
- explosions;
- smoke / fire;
- world / portal / unlock effects.

This should not require Georg to become a 2D/3D VFX specialist.

The ToolBox should expose reusable, semantic effect recipes rather than asking the user to hand-build particle systems.

## Strong existing donor discovered

Do **not** build a second VFX runtime first.

Current repo already contains:

`tools/KFB-ToolBox/_inbox/cloud-design-worldbuilding-2026-09-18/donor-bank/modules/kfb-vfx.js`

with design notes:

`tools/KFB-ToolBox/_inbox/cloud-design-worldbuilding-2026-09-18/donor-bank/docs/VFX_DESIGN_v10.md`

This donor already implements a useful architecture:

- one pooled quad renderer;
- Brackeys masks;
- camera / ground / surface / velocity orientations;
- flipbooks;
- decals;
- surface × energy impact recipes;
- semantic host events.

Most importantly:

**the donor renders VFX but does not decide what was hit.**

Physics, damage, camera, sound and target movement remain host responsibilities.

This is the correct ownership direction.

## Linked handoff evidence

Source:

`tools/KFB-ToolBox/_inbox/KFB Style References/VFX + KEYS + ASSETS - kfb-asset-handoff-animation-lab (9).json`

Current inspected handoff:

- 132 total candidate assets;
- 91 `FX_Visual` assets;
- selection status = candidate-only.

The PNG FX are marked `consumerKindAllowed=false` for that **Animation Lab** consumer because it expects 3D model kinds.

That does **not** mean the FX are unusable.

It means:

> send the PNGs to the existing/dedicated VFX consumer, not through Animation Lab.

## Source-backed candidate families

### Muzzle

Available:

- `muzzle_01..05`
- alpha and opaque variants.

Existing donor already uses narrow/wide muzzle roles.

### Melee slash / sweep

Available:

- `slash_01..04`
- alpha and opaque variants.

Candidate presentation:

- weapon-local arc;
- short camera/surface-aligned sweep.

Melee owner still decides swing/contact.

### Impact

Available:

- `big_hit_6x5`
- `impact_white_6x4`
- scratch/scorch textures.

Existing donor already uses hit/white/scorch roles.

### Electric / Blitz

Available candidate material includes:

- `electric_ring_6x5`
- magic masks;
- light streaks;
- light/glow particles.

The selected handoff did not expose a file literally named "lightning bolt".

However the existing `kfb-vfx.js` donor already has a semantic **bolt** role based on Brackeys masks / procedural fallback.

Therefore "Blitz" should first reuse/prove that donor path rather than invent another lightning system.

### Fire / smoke / world

Available:

- fire;
- flame;
- smoke;
- dirt;
- circles;
- magic;
- light;
- charge;
- fire ring / fire point;
- dithered fire.

These can later serve:

- fires;
- destruction aftermath;
- portals;
- magic;
- environmental activity;
- access-key unlock cues.

### Explosion

`explosion_6x5` exists as source.

Historical donor v10 deliberately did not use it because of its baked color / presentation policy.

Keep it as a later visual-test option, not an automatic default.

## CORRECTION / new direction · Blood FX

Historical `VFX_DESIGN_v10.md` explicitly rejected:

`blood_impact_6x5`

with the old rationale:

> no blood in KFB.

Georg now explicitly reopens **blood FX** as a Combat candidate.

This is an additive current direction change.

Do **not** rewrite the historical donor document as if it always allowed blood.

Instead:

- preserve the old decision as historical evidence;
- add stylized blood impact as a new optional candidate;
- require visual/human review before promoting it to Combat canon.

Candidate source:

`media/3D_Assets/FX_Visual/brackeys_vfx_bundle/predrawn/blood_impact_6x5.png`

## PROPOSAL · semantic VFX triggers

Consumers should ask for meaning, not filenames:

- `combat.weapon.muzzle`
- `combat.melee.slash`
- `combat.hit.impact`
- `combat.hit.blood`
- `combat.hit.electric`
- `world.explosion`
- `world.fire`
- `world.smoke`
- `world.dirt`
- `world.scorch`
- `access.unlock`
- `access.portal`

The VFX adapter/recipe resolves the actual texture/flipbook.

## First later VFX proofs

Keep them isolated and cheap:

1. one real weapon muzzle socket → muzzle flash;
2. one real sword swing → one slash/sweep;
3. one host-supplied hit point → one impact;
4. same hit → optional blood toggle/human gate;
5. one static world fire/smoke emitter;
6. one key/access unlock → ring/glow cue.

No full Combat rewrite.

## Machine-readable candidate file

See:

`VFX_CANDIDATE_LANE_v0.json`

## Scope guard

VFX are **not** a dependency of the first Orc → Player pink-donut proof.

---

# 32 · Curated KFB asset pool for later reuse

## USER DIRECTION · 2026-09-22

Treat:

`media/3D_Assets/KFB/`

as a user-curated pool of selected future props/assets.

At the inspected current `main` snapshot, the directory enumerated **140 entries**.

Examples include:

- Book;
- popcorn;
- bread;
- burger / cheeseburger;
- donut;
- cupcake / ice cream / candy;
- flowers / mushrooms / crops;
- vehicles;
- robots / mechs;
- aliens / ghosts / skeletons;
- signs / boards;
- game / carnival props;
- assorted characters and scenery.

This folder is useful as a **future donor shortlist**.

It is not automatically:

- the canonical Asset Registry;
- proof of rig compatibility;
- proof of scale;
- proof of license/provenance suitability for every downstream use;
- proof that every object belongs in KFB Town.

Before using an item in a production slice:

1. find it through Registry/Librarian or exact source path;
2. inspect the source object in isolation;
3. check scale / pivot / materials / animation where relevant;
4. only then integrate it.

This keeps the user-curated selection valuable without creating a second asset database.


---

# 33 · Orc Band · World-Life Scene

## USER DIRECTION · 2026-09-23

Create a recurring **Orc Band** as a comic-relief World-Life / Resident Scene.

The band should feel like a cartoon street/mariachi-style apparition translated into KFB:

- appears in scenes as if the world has its own life;
- plays a funky / jazz-impro / war-drum jam;
- reads as free-spirited musicians rather than generic combat mobs;
- remains fully Orcish and always capable of sliding into a friendly Kayfabe brawl;
- can later reappear in different places/world contexts.

Preferred trio:

1. one **Legacy Orc**;
2. one **Rig_Medium Orc Raider**;
3. one **Rig_Large Orc Brute**.

This deliberately shows three generations / rigs of the same Orc culture in one coherent scene.

## Current role assignment

### Large Orc Brute

Role:

**War Drum anchor**

Use real:

- Orc Wardrum;
- Orc WardrumStick.

Current Atlas proves those props and the Large scale profile.

There is **no Rig_Large drum clip**.

First implementation therefore uses either:

- a measured procedural percussion adapter; or
- a believable ready/groove fallback before full strike authoring.

### Medium Orc Raider

Role:

**Lead electric guitar**

Use:

- Mixed Bag `guitar_A`;
- or `guitar_B`.

Reuse the current Animatronic guitar architecture:

- measured instrument placement;
- two-hand reach/CCD;
- procedural strum.

Do not claim a finished electric-guitar profile until the actual guitar is isolated/measured on Orc Raider.

### Legacy Orc

Role:

**front / hype / optional vocal or auxiliary instrument**

Default first proof:

- groove;
- gesture;
- hype;
- no mouth-instrument dependency.

Later candidate props:

- Goth Girl microphone;
- Toy Soldier trumpet.

Trumpet source is real.
Trumpet-playing pose is not yet proven.

## Band scene grammar

Working state loop:

```
SETUP_IDLE
→ JAM
→ optional BANTER
→ JAM
→ optional INTERRUPTION
→ optional KAYFABE_SCRAP_REQUEST
→ POST_SCRAP
→ RESUME_JAM
→ JAM
```

This is a Scene/Activity state loop, not autonomous universal AI.

## Multi-rig rule

Each actor keeps its own rig/motion owner.

Do not retarget Medium motion to Large/Legacy merely for visual uniformity.

The scene synchronizes **semantic musical phase**, not skeleton clips.

Possible shared clock:

- BPM;
- beat;
- bar.

Actors may remain intentionally offset/asymmetric.

---

# 34 · Spatial band audio

## USER DIRECTION

Approaching the Orc Band should be audible before the whole scene is visible.

War drums can act as a navigational hint.

Nearer the band, guitar and full musical detail become readable.

Final music may be generated by Georg through Suno and stored as MP3/WAV assets.

## PROPOSAL · semantic stems

- `band.drums`
- `band.guitar`
- `band.hype`
- optional `band.argument`
- optional `band.resume`

Working perceptual bands:

- FAR → mainly drums;
- MID → drums + guitar;
- NEAR → full jam + chatter/hype.

Exact distances belong to receiving-world scale.

## Existing technical donors

KFB already contains a WebAudio panner donor with:

- listener transform;
- HRTF;
- inverse distance;
- ref/max distance;
- rolloff.

Its existing music path is not positional.

Therefore Band audio should reuse the spatial source/panner seam inside the **receiving audio owner**, not create another AudioContext.

## Existing technical audio assets

Before final Suno files exist, technical panning can use current source-backed stems:

`media/3D_Assets/Sounds/Van_Metronome_2026-07-17T163547 Stems/0 Drums.mp3`

`media/3D_Assets/Sounds/KFB Roller coaster Van_Metronome 02 (cover) Stems/3 Guitar.mp3`

These are test donors only.

They are not the accepted Orc Band score.

---

# 35 · Offica Doppeldenk · Toy Soldier Patrol Resident

## USER DIRECTION

**Offica Doppeldenk** uses the Toy Soldier / Nutcracker donor.

He should occasionally appear from a present, patrol the world and behave as a bureaucratic spoilsport.

His comic role:

- searches for wrongdoing;
- suspects subversion;
- over-interprets tiny authority;
- interrupts fun;
- demands absurd permits;
- issues warnings/citations;
- is not taken seriously enough for his own taste.

This aligns with the existing Town archetype:

**bureaucratic Threshold Guardian**.

## Spawn

Reuse the current Resident Atlas **4.8 s gift-box reveal**.

Do not substitute a generic spawn effect.

First PoC:

- forced deterministic spawn.

Later:

- seeded random chance;
- cooldown;
- max one active Offica.

## Patrol pattern

```
SPAWN_REVEAL
→ PATROL
→ NOTICE
→ APPROACH
→ INSPECT
→ ENFORCE
→ CITATION / WARNING
→ RESOLVE
→ GRUMBLE / RESUME / EXIT
```

Host owns navigation/path execution.

The semantic pattern can later generalize to mobs/guards/inspectors without turning Offica into a universal AI owner.

## Current motion evidence

Toy Soldier is Rig_Medium.

Current motion sources already prove candidate clips for:

- Walking;
- Idle;
- Waving;
- Interact;
- Hit;
- unarmed melee.

The reveal itself is authored scene motion, not a source clip.

## Bureaucratic band interruption

Example situation family:

- no performance permit;
- no location permit;
- too loud;
- unauthorized gathering;
- suspicious/subversive performance;
- wrong paperwork.

Offica may pressure the band to:

- play quieter;
- move;
- stop;
- present impossible paperwork.

The three Orcs respond with Buddy Banter and ridicule.

## Citation as interaction

First implementation does not need a physical ticket.

A citation may be a semantic encounter / Bubble receipt.

Player-facing citation responses can reuse:

- KayfaBINGO;
- KayfaBONGO;
- KayfaBOGGLE;
- BLÖDSINN!

Meaningful citation events may be stored in Almanac / Lean Memory.

## Kayfabe fight outcome

Offica may escalate into a host-approved social fight.

Desired story:

- the three Orcs collectively rough him up;
- no permanent enmity is created;
- the band laughs and resumes;
- Offica leaves grumbling because his authority was not respected.

Repair here is **scene/social continuity**, not necessarily warm emotional agreement from Offica.

Combat remains Combat-owned.

WorldBuilder only requests the encounter and consumes completion.

---

# 36 · WorldBuilder / Claude Design preparation status

## Prepared now

The following are now available:

- `ORC_BAND_DONOR_CHECK.md`
- `ORC_BAND_WORLD_LIFE_RECIPE_v0.json`
- `ORC_BAND_WORLD_BUILDER_POC_BRIEF.md`

These already define:

- exact cast;
- exact current props;
- source limitations;
- performance adapters;
- audio approach;
- Offica spawn/patrol;
- interruption/resume;
- optional Combat handoff;
- acceptance ladder;
- explicit non-goals.

## Important WorldBuilder prerequisite

Current WorldBuilder SSOT still requires:

- WB1-P0;
- WB1-P1;
- WB1-P2;

before Claude Design input is created.

Therefore the Orc Band packet is:

**PREPARED FUTURE FIXTURE · NOT YET A CLAUDE BUILD ORDER**

Do not spend Claude Design tokens rediscovering this material.

When WorldBuilder P0–P2 are green, feed this packet into WB1-P3.

## Performance Suite correction

Historical Performance Suite documentation said the War Drum source was unresolved.

Current source truth has moved on.

Real source is now proven through Resident Atlas / current handoff:

- Orc Wardrum;
- Orc WardrumStick.

Do not modify the historical document retroactively.

Treat the new source proof as an additive correction.

## Preferred World-Life PoC order

1. donor objects in isolation;
2. static trio;
3. drum/guitar/hype performance read;
4. spatial audio;
5. forced Offica reveal + patrol;
6. warning/citation + resume;
7. random spawn;
8. optional Combat handoff.

Fishing remains separate and will receive its own fixture later.


---

# 37 · Music Collectibles / Demo Tapes / Global Jukebox

## USER DIRECTION · 2026-09-23

Music discovered in KFB should become part of the player's journey history and remain playable later.

Orc Band tracks are a first concrete use case.

A song may be acquired by:

- hearing the band in the world;
- showing appreciation / dancing;
- receiving a demo tape as a gift from the Legacy frontman;
- finding a tape in a chest / lootbox / dungeon;
- later trading for a tape;
- other future music-discovery encounters.

The collection should work across:

- walking;
- dungeons;
- free-roam landscape;
- flight;
- vehicles;
- Stunt Race.

The player should therefore build a personal **RoadTrip / Journey music collection** over time.

## Existing audio owner

Do not create a second universal music engine.

Current KFB already has:

- canonical `media/3D_Assets/Sounds/jukebox.json`;
- a reusable Jukebox / Music Bus implementation in `travel-audio.js`;
- track switching;
- common audio lifecycle;
- BPM;
- `beat`;
- `level`;
- `pulse`;
- ducking;
- clean source replacement;
- existing compact Radio direction in Race.

This becomes the audio foundation.

The new concept adds:

- unlock state;
- provenance;
- collection UI;
- physical tape metaphor;
- world-performance integration.

## New Orc Band candidate pool

Current source-backed candidate files in:

`media/3D_Assets/Sounds/KFB RoadTrip JukeBox v2/`

include six plausible Orc Band versions:

- `Lazy Pocket Groove.mp3`
- `War Busker Groove.mp3`
- `Rubbish Groove 2min A extend 01.mp3`
- `The_Street_Orcs_Groove_2026-09-23T020844.mp3`
- `Orcish_Municipal_Hustle_2026-09-23T021219.mp3`
- `Orcish_Street_Corner_Jam_2026-09-23T021322.mp3`

These are **candidate tracks**, not yet canonical Jukebox entries.

The current connector can prove file identity/size but cannot audition the binary MP3s in-chat.

Human listening remains the selection authority.

## Physical tape donors

Current KFB source pool includes real tape/radio props:

- Car Radio with tape player;
- multiple Cassette / Tape models.

One Michael-Fuchs tape exists twice under two filenames with the exact same blob SHA.

Treat those two files as one donor identity.

## PROPOSAL · Track Unlock vs physical cassette

Do not make every unlocked song consume a Backpack slot.

Separate:

### Track Unlock

Persistent music-library state.

Stored in:

**Session / Journey / Fractal Almanac**

Carries:

- track ID;
- source;
- discovery method;
- event/provenance ref;
- favourite;
- rotation weight;
- discovery date/session.

### Cassette Artifact

Optional physical/world representation.

Can be:

- handed to player;
- found in chest;
- shown during a gift interaction;
- placed/displayed later in a personal cassette collection.

It does not have to remain in Backpack after the music has been registered.

This prevents music collection from filling the player's limited physical inventory.

## First social music unlock

Preferred first sequence:

```
player approaches Orc Band
→ hears live spatial performance
→ remains / reacts / dances
→ performance-appreciation threshold reached
→ Legacy frontman approaches
→ one short Bubble exchange
→ demo tape offered
→ player accepts
→ TRACK_UNLOCK_COMMIT
→ Almanac / Journey music receipt
→ same track becomes available in global Radio
```

The physical cassette may appear during the gift.

It need not remain a permanent Backpack item.

## Alternative acquisition

### Loot

```
open chest / lootbox
→ find cassette
→ inspect / collect
→ TRACK_UNLOCK_COMMIT
```

### Trade

Possible later branch:

```
Band / vendor offers tape
→ player offers currency or item
→ trade resolves
→ TRACK_UNLOCK_COMMIT
```

Georg mentions **Pop / Popcorn / Westing** as currency language.

Current repository search did not prove a canonical currency owner/name in this check.

Do not freeze the currency contract here.

---

# 38 · Backpack HUD · 20 physical slots

## USER DIRECTION

The player's Backpack should be a small readable physical inventory rather than an unlimited collection database.

Working first cap:

**20 slots**

Recommended presentation:

- one compact Backpack icon in normal HUD;
- click/tap opens inventory overlay;
- **4 × 5 grid**;
- selected item gets a small contextual action area.

Typical actions:

- Inspect;
- Use where supported;
- Give;
- Drop where allowed.

Do not put music-track unlocks into these 20 slots.

Do not make currency consume slots.

## Visual Backpack profile

The icon / avatar presentation should follow the currently equipped Backpack skin/profile.

Candidate visual donors already documented include:

- Protagonist A/B backpacks;
- Hoarder;
- Hiker;
- Orc Backpack.

Inventory truth remains separate from Backpack mesh.

## UI discipline

Closed state:

- small Backpack access only;
- no permanent inventory wall.

Open state:

- 20 slots;
- item image/thumbnail;
- compact details;
- no developer/provenance paragraphs in default view.

Detailed origin can live behind Info / Almanac link.

---

# 39 · Always-available Radio / Music Collection

## USER DIRECTION

Unlocked songs should remain playable anywhere.

Contexts include:

- on foot;
- dungeon;
- open landscape;
- flight;
- car;
- Stunt Race.

## One music core

Do not implement one radio per game.

Use the existing Jukebox / Music Bus owner.

Different hosts provide only presentation adapters.

Possible presentations:

### On foot

Compact Radio / Now Playing HUD.

### Vehicle / Race

Existing compact kinetic car-radio presentation.

### Home / personal place

Physical tape player / cassette shelf.

All point to the same unlocked-track state.

## Library modes

Useful first user choices:

- All unlocked;
- Favorites;
- Heavy Rotation;
- Manual track.

Track state may include:

- `favorite: true/false`;
- `rotationWeight`;
- optional user-curated Heavy Rotation subset.

## Live music vs Radio

Live Orc Band performance and personal radio are not the same source mode.

### Live band

- world-local;
- spatial/diegetic;
- falls off with distance.

### Radio

- global/non-diegetic music presentation.

First rule:

**do not play both at full volume simultaneously.**

Recommended v0:

- approaching a live music zone ducks/fades the global radio;
- leaving the zone restores it.

Later, if useful:

- same-track synchronized crossfade from global radio to spatial live source.

Do not require this for the first Band proof.

---

# 40 · Orc Band Music Visualizer / Performance Sync

## USER DIRECTION

The band should visibly respond to the currently playing track.

Desired read:

- Orc Brute drums in time;
- Medium Orc guitar rhythm tracks the groove;
- Legacy frontman moves/dances/hypes while holding the microphone;
- small variation and humorous beats prevent a robotic repeated loop.

## Existing audio signals

Current `travel-audio.js` already exposes:

- `beat`;
- `level`;
- `pulse`;
- `bpm`;
- current track metadata.

That is enough for a first visualizer proof.

## No stems required for v0

Do **not** spend limited Suno stem-download credits on all candidate tracks.

First use full-mix analysis/signals.

### Large Orc · drums

Drive procedural percussion from the beat grid.

Candidate rule:

- quarter-note beat;
- alternating left/right hands;
- `pulse` may accent strike depth, body recoil or occasional double-hit.

This extends the already identified procedural Rig_Large War Drum adapter.

### Medium Orc · guitar

Use:

- measured Animatronic guitar-hold donor;
- procedural strum.

Candidate rule:

- eighth-note/subdivision strum;
- `pulse` controls stronger accents;
- `level` controls body groove amplitude.

### Legacy frontman

Microphone can simply remain held in one hand.

No singing animation is required for instrumental tracks.

Use:

- body bounce;
- sway;
- head gesture;
- occasional seeded hype gesture every N bars.

## Avoid robotic synchronization

Actors share one musical clock but should not mirror perfectly.

Use:

- small phase offsets;
- actor-specific motion amplitude;
- seeded variation per bar;
- rare special gesture beats.

The scene should read as three musicians listening to each other, not three synchronized machines.

## Stem escalation rule

Download stems only for a selected final/signature track if full-mix sync is not convincing.

Useful stems:

- drums;
- guitar;
- optional rest/hype.

Stem credits should be spent **after** one track has earned promotion.

## Loop authoring

Current two-minute candidates may not have clean loop boundaries.

Do not reject them for that alone.

Add per-track authoring metadata:

- BPM;
- beat offset;
- beats per bar;
- loop start;
- loop end;
- fade in;
- fade out;
- crossfade duration.

First goal:

**musically acceptable repeating background performance**, not perfect sample-loop purity.

A selected candidate can later receive a trimmed/remastered loop.

## First music-performance proof

Exactly one selected Orc track:

```
full mix
→ known BPM / loop metadata
→ live spatial playback
→ beat / pulse / level
→ Brute drum adapter
→ Medium guitar strum
→ Legacy groove
→ player dances/listens
→ demo tape gift
→ track unlock
→ global Jukebox availability
```

Do not pull all six candidate tracks into the animation proof.


---

# 41 · Permitless Funk signature + Legacy bounce choreography

## USER DECISION · 2026-09-23

Current best Orc Band signature-style candidate:

**Permitless Funk**

Source file:

`media/3D_Assets/Sounds/KFB RoadTrip JukeBox v2/Rubbish Groove 2min A extend 01.mp3`

Georg reports this version best matches the intended warm, slightly dirty, relaxed 70s electro-funk signature style.

Status:

**HUMAN_SELECTED_SIGNATURE_CANDIDATE**

It is not yet promoted to the canonical Jukebox catalog.

Promotion still needs:

- BPM;
- downbeat/beat offset;
- loop start/end;
- fade/crossfade metadata;
- first visualizer proof.

## Scene composition refinement

The Orc Band should initially read as an open-landscape **street-corner jam without a literal street**.

Working focal composition:

- three Orcs arranged around a surreal stone formation / campfire-like centre;
- Crazy-Cat / open-field world staging;
- no building dependency;
- portable Story Zone / World-Life fixture;
- easy later relocation into market, roadside, dungeon courtyard or festival.

The central object is a scenic/focal prop, not a gameplay owner.

## Legacy frontman · user-selected visual direction

Use the small Legacy Orc with the **black ponytail / dark topknot**.

Georg has now source-pinned the exact black-ponytail / dark-topknot bandleader as:

`media/3D_Assets/KayKit Legacy/Orc Warband - legacy/characters/gltf/character_orcB.gltf`

Pinned source commit:

`e0037d79af9f0546c73cee02e361f78f7d662df2`

Blob SHA:

`2dfd0bf6661bb207516053758a26baf5cb6407f1`

Status:

**USER-CONFIRMED SOURCE · no longer an A/B ambiguity.**

## PROPOSAL · Legacy Bounce / Squash performance

The Legacy frontman becomes the most mobile member of the trio.

He may hold the microphone continuously.

He does **not** need:

- lip-sync;
- microphone-to-mouth precision;
- detailed leg animation;
- a conventional humanoid dance clip.

Instead use a cheap, readable cartoon performance:

```
BEAT
→ squash
→ launch
→ airborne stretch
→ peak
→ fall
→ landing squash
→ recover
```

The Legacy proportions make this especially suitable because leg articulation is visually less important than whole-body timing.

## Timing mapping

Do not map raw musical pitch directly to jump height in v0.

A full mixed track contains overlapping bass, guitar, percussion and synth material; raw pitch would create unstable/jittery jumping.

Preferred mapping:

### Beat / BPM

Controls:

- jump frequency;
- launch/landing timing;
- regular bounce cadence.

### Pulse / onset strength

Controls:

- jump height;
- extra squash;
- stronger landing;
- rare double-hop;
- stronger head bob.

### Overall level / energy

Controls:

- body groove amplitude;
- squash/stretch amount within safe limits;
- lateral wandering radius / enthusiasm.

### Phrase / bar position

Seed small variations:

- sideways hop;
- quarter turn;
- high hop;
- tiny fast double bounce;
- microphone flourish;
- head shake;
- freeze / smug beat;
- rejoin groove.

This prevents mechanical repetition across the two-minute track.

## Root motion vs skeleton motion

For v0, most of the Legacy dance can be implemented at the **performance root/group**:

- vertical translation;
- subtle lateral hop;
- Y rotation;
- non-uniform squash/stretch.

This is cheaper and more robust than forcing a complex Legacy leg/foot dance.

If a usable Legacy clip improves upper-body life, it may layer additively.

Do not make one necessary for the first proof.

## Squash / stretch guardrails

Keep character identity readable.

Suggested conceptual limits, to tune visually rather than freeze globally:

- landing squash: slightly wider + shorter;
- airborne stretch: slightly narrower + taller;
- head/hair should remain attached coherently;
- microphone prop remains stable enough to read;
- no jelly deformation that destroys Orc silhouette.

The effect should read as **cartoon bounce**, not elastic-body simulation.

## Large Orc Brute · groove refinement

Large Brute remains the War Drum anchor.

Preferred first musical mapping:

- alternating L/R strikes on the beat grid;
- not every detected transient becomes a strike;
- use a stable quarter-note or half/eighth hybrid pattern derived from known BPM;
- `pulse` may add accented hit amplitude / shoulder recoil;
- rare bar-level flourish may trigger a double hit.

Head/upper-body movement may lag slightly behind hand strikes for weight.

## Medium Orc · funky guitar refinement

Medium Orc remains the electric-guitar performer.

Even if the source prop visually reads as guitar rather than bass, his movement may carry a **funk-bass-like pocket**:

- small knee/body groove;
- shoulder rocking;
- procedural strum on subdivisions;
- accented downbeats;
- occasional held/rest beat instead of constant sawing.

Reuse the measured Animatronic guitar-hold / procedural-strum architecture.

Do not invent a source `Funk Guitar` animation clip.

## Trio anti-robot rule

All three share one musical clock.

They should not share identical animation phase.

Example:

- Brute = slightly behind beat / heavy;
- Medium = tight subdivision / groove;
- Legacy = slightly ahead / energetic bounce.

The visual read should be:

**same music, three personalities.**

## First Permitless Funk visualizer proof

```
Rubbish Groove / Permitless Funk
→ BPM + beat-offset metadata
→ one shared music clock
→ Large Brute drum beat
→ Medium Orc guitar strum/body groove
→ Legacy black-ponytail Orc bounce/squash
→ seeded bar-level variation
→ player can watch/dance
→ demo-tape reward later
```

No stems required for this first pass.

## Road-trip sibling track direction

A second Orc Band track may deliberately keep the **Permitless Funk** identity while adding more:

- open-road forward motion;
- dusty/warm road-trip atmosphere;
- horizon / travel feeling;
- cruising rather than race urgency;
- more spacious arrangement;
- still danceable;
- still suitable as a repeating exploration track.

This sibling should work both:

- as an Orc Band live performance;
- and as a free-roam RoadTrip Radio track.

It should **not** sound like Racer final-lap music.


---

# 42 · The KayfaBizarros · band identity + tourbus

## USER DECISION · 2026-09-23

The Orc trio now has a working band name:

# **The KayfaBizarros**

This name applies to the recurring World-Life / street-jam / RoadTrip band fixture.

## Bandleader · exact donor resolved

The bouncing Legacy frontman with black ponytail / dark topknot is:

`media/3D_Assets/KayKit Legacy/Orc Warband - legacy/characters/gltf/character_orcB.gltf`

Pinned source:

`e0037d79af9f0546c73cee02e361f78f7d662df2`

Blob:

`2dfd0bf6661bb207516053758a26baf5cb6407f1`

This supersedes the earlier open A/B identification gate.

Role remains:

- bandleader / hype Orc;
- microphone held in one hand;
- beat-synced bounce;
- squash/stretch;
- seeded lateral/high-hop variations;
- optional future player-facing demo-tape gift.

## Signature track · exact source pinned

Current signature candidate:

**Permitless Funk**

Exact repository source:

`media/3D_Assets/Sounds/KFB RoadTrip JukeBox v2/Rubbish Groove 2min A extend 01.mp3`

Current source blob:

`368eb5ae8fafcfba1cce3ba3f80488378fe056b0`

Current size:

`3,034,265 bytes`

Status:

**SOURCE PRESENT + HUMAN SELECTED SIGNATURE CANDIDATE**

Still needs:

- BPM/downbeat authoring;
- loop window;
- first performance sync proof;
- later canonical Jukebox promotion if accepted.

## The KayfaBizarros Tourbus

Exact donor:

`media/3D_Assets/Frankensteining/Truck Armored by Quaternius - VvX8nmoCN5.glb`

User-pinned source commit:

`e0037d79af9f0546c73cee02e361f78f7d662df2`

Blob:

`1e25be955339b6e6c46b51ae337a51da2f1f62c5`

Registry facts:

- model-3d;
- GLB;
- embedded dependencies;
- 754,248 bytes;
- exact repo identity.

## Existing vehicle donor reuse

This exact Truck Armored already exists in the current KFB Vehicle / Cartoon Vehicle Deformer donor lane as:

`truck-armored`

Therefore:

> do not create a special one-off Tourbus renderer or deformation stack.

First use:

- scenic parked tourbus;
- recurring recognizable band landmark;
- arrival/departure story cue later;
- optional RoadTrip scene anchor.

Later, if desired, the existing vehicle owner may provide:

- cartoon squash/deformation;
- skew/taper;
- presentation tuning;
- eventual vehicle rig/motion integration.

## Tourbus visual direction · proposal

Possible later band-specific presentation, non-destructive:

- The KayfaBizarros signage;
- cassette / demo-tape motifs;
- roof luggage / amps / cases;
- small awning or portable stage kit;
- stickers / tour marks;
- weird RoadTrip clutter.

These remain presentation candidates.

Do not bake them into the source GLB.

## First Tourbus scope guard

The first Orc Band World-Life proof does **not** require a driveable bus.

For v0:

**parked donor + band scene is enough.**

Vehicle physics, wheels, suspension, driving and deformation remain later Vehicle-owner gates.

## Scene combination

The first recognizable KayfaBizarros roadside/world-life tableau can now be:

```
parked armored Tourbus
+ surreal stone/campfire focal point
+ Large Brute War Drum
+ Medium Orc electric guitar
+ character_orcB bouncing bandleader + microphone
+ Permitless Funk
+ optional Offica patrol interruption
```

This is a portable World-Life fixture, not a fixed Town-only scene.
