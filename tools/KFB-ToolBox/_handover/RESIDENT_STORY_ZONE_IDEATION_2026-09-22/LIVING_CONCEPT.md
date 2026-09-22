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
