# Game Development Studio · KFB Game-Ready Asset Packaging Contract

**Date:** 2026-09-18  
**Status:** PROPOSAL / PLUGIN CAPABILITY TEST CONTRACT  
**Purpose:** use Game Development Studio as a bounded producer/packager for real KFB game assets without replacing canonical sources or consumer owners.

## 1 · Role

Game Development Studio may help create or package **game-ready derivatives and metadata**.

It does not become:

- Asset Registry / Librarian;
- ToolBox / Rigging / Animation owner;
- Race vehicle-physics owner;
- Travel World/Movement owner;
- Combat owner;
- canonical owner of KayKit/Kenney source files.

For an existing KayKit/Kenney/KFB asset, the original GitHub source remains canonical. A game-ready package references that source and adds explicit derived data.

## 2 · What “real game-ready asset” means for KFB

A package is not accepted merely because it contains a GLB or attractive render.

It should be loadable by a named consumer and describe enough of the following where relevant:

### Resident package

- exact GitHub `sourceRef` / revision;
- model / rig family;
- scale, forward/up, local origin;
- attachment sockets / hands / props;
- collision or interaction proxy;
- animation source sets;
- verified clip map / loop / one-shot semantics;
- root-motion policy;
- material/texture dependencies;
- optional LOD/performance notes;
- optional VFX/SFX anchors;
- receiving-consumer compatibility evidence.

### Vehicle package

- exact GitHub source model/revision;
- visual forward/up/origin;
- dimensions;
- wheel nodes / wheel centres / steering candidates where source supports them;
- driver/seat anchor if real;
- collision/chassis proxy proposal;
- physics adapter target — without inventing a new physics owner;
- deformation/profile metadata;
- boost/drift/landing/impact VFX anchors;
- engine/skid/boost/landing/impact SFX event map;
- material/texture dependencies;
- LOD/instancing/performance notes;
- consumer test result.

### Environment / City package

- procedural/source geometry identity;
- material slots;
- collider/walk/drive surface roles;
- instancing/LOD rules;
- landmark/prop/resident sockets;
- provenance and source IDs;
- named consumer export recipe.

### VFX package

- event trigger;
- anchor/socket;
- lifetime;
- scale/intensity parameters;
- pooling/performance guidance;
- no physics/reward ownership.

### SFX package

- source/provenance;
- event name;
- loop vs one-shot;
- spatialization;
- gain/pitch parameter range;
- concurrency/lifecycle;
- no duplicate audio engine.

## 3 · Do not regenerate existing sources by default

For existing KayKit residents, vehicle pool and animation libraries:

- **do not redraw/re-model/re-rig them just to call them game-ready**;
- inspect and package exact existing source assets;
- derive sockets, pivots, proxies, clip maps, LOD candidates and consumer adapters;
- preserve original files.

Only create a new derived mesh/texture/animation when the package brief explicitly requires it and the derivative has a clear owner/path/version.

## 4 · First capability pilot

Do not start with all residents + all 43 vehicles.

Test one representative bundle:

### Resident
Existing S6 Lorekeeper or another named resident with:
- actor;
- one habitat/landmark prop;
- one hand prop;
- one movement/idle source.

### Vehicle
One BOX1 vehicle already used in broad regression, preferably the Sedan candidate:
- original model source;
- forward/scale;
- wheel/pivot analysis;
- simple collision/chassis proxy proposal;
- deformation profile reference;
- VFX/SFX event anchors.

### Shared event bundle
Only:
- idle / movement;
- boost;
- drift/re-grip;
- jump/landing or impact where relevant.

The point is to prove package quality and handoff, not to batch-process the entire library before we know the plugin's real capabilities.

## 5 · Expected output

Ask Game Development Studio to return:

- package directory proposal;
- actual generated files;
- `GAME_ASSET_PACKAGE.json`;
- source manifest;
- dependency manifest;
- rig/socket report;
- animation map;
- collider/physics-proxy description;
- VFX event map;
- SFX event map;
- test/QA plan;
- exact distinction between CREATED and PROPOSED outputs.

Any binary/visual derivative must be handed back as an explicit file, not only described in prose.

## 6 · Acceptance ladder

### SOURCE REVIEW
Canonical GitHub source paths/revisions are correct.

### PACKAGE IMPLEMENTATION
Actual package files exist.

### STATIC / STRUCTURAL QA
References resolve; required dependencies/anchors/clip names are valid.

### CONSUMER TEST
Named Travel/Race/Atlas/ToolBox consumer loads and uses the package.

### HUMAN ACCEPTANCE
Georg reviews visible/audible behaviour where relevant.

No stage silently implies the next.

## 7 · OSM / City role

For Ehrenfeld/Hürth, Game Development Studio can package:

- reusable low-poly building/roof/material families;
- road/curb/sidewalk geometry families;
- parking/road furniture/stunt prop sets;
- collider/LOD/material conventions;
- landmark override packages.

It should **not** fetch/own OSM truth, invent the city graph, or own Walk/Drive physics.

OSM City Lab owns normalized city data/geometry/export. Game Development Studio may produce reusable asset families consumed by that geometry.

## 8 · Plugin test prompt

> Plan and, where your tool supports it, create a **real game-ready KFB asset package** from the exact GitHub sources in this brief.
>
> Do not regenerate existing KayKit/Kenney assets merely to package them. Preserve their GitHub identity and create only explicit derived metadata/assets.
>
> Pilot package:
> 1. one existing Resident Atlas resident with one signature hand prop and one habitat/landmark prop;
> 2. one existing BOX1 vehicle used in current regression;
> 3. a minimal VFX/SFX event package for movement/boost/drift/landing or impact.
>
> For the resident include source revision, rig family, scale/orientation, attachment sockets, collider/interact proxy, exact animation sources/clip map and root-motion policy.
>
> For the vehicle include source revision, dimensions/orientation, real wheel/pivot candidates where present, chassis/collision proxy proposal, receiving physics adapter target, deformer metadata, VFX anchors and SFX events.
>
> Return actual generated files separately from proposals. Produce a source manifest and `GAME_ASSET_PACKAGE.json`.
>
> Do not create a new Registry, vehicle physics engine, animation owner, audio engine or duplicate source-asset warehouse.
>
> End with:
> `SOURCE | CREATED FILES | PROPOSAL | PACKAGE MANIFEST | RIG/SOCKET REPORT | ANIMATION MAP | PHYSICS/COLLIDER HANDOFF | VFX | SFX | TESTED RESULT | OPEN`.

## 9 · Batch expansion only after pilot

If the pilot is structurally useful and consumer-tested, then batch packaging may expand across:

- Resident Atlas cast;
- Legacy residents;
- BOX1 vehicle pool;
- KFB original vehicles/props;
- landmark candidates;
- accepted 2D/2.5D modules.

Batch output must not erase asset-specific exceptions such as special hand calibration, unusual rigs, missing wheel nodes or nonstandard forward axes.


## 10 · Reconstructible experience packages · backlog architecture

The packaging lane may later also produce **reconstructible experience recipes** for camera moves, hero shots, transitions, loading presentation and journey-memory reconstruction.

Canonical guidance lives in:

[**GAME_DEV_STUDIO_ASSET_PACKAGING_LIVING.md**](GAME_DEV_STUDIO_ASSET_PACKAGING_LIVING.md)

Backlog package types include:

- `CameraRecipe` / `HeroShotRecipe` for CCTV-style captures, fly-bys, victory/podium shots and authored camera moves;
- `TransitionRecipe` for portals, warp/hyperspace, black-hole/floor-drop transitions, dungeon/instance entry and map-room handoffs;
- `MomentReceipt` as a lean machine-readable milestone record containing pinned refs, minimal dynamic state, seeds, card-acquisition context and consumer/build refs;
- `JourneyEntry` as the human-facing personal travel diary pointing to authoritative save/checkpoint state;
- hierarchical `SceneKit` / PackageTree composition, including a proposed Rule-of-Three convention for planets, landmarks, environment props, residents, vehicles and card-bearing scene objects.

Default policy:

> Store deterministic recipes and exact refs rather than heavy prerecorded videos. Optional still/video previews are derived caches, not canonical experience assets.

These packages remain presentation/reconstruction consumers of real gameplay state. They do not become movement, save-game, card-progression, physics, animation, VFX or audio owners.

### Exact replay boundary

Do not promise frame-identical historical replay from metadata alone.

`EXACT_REPLAY` requires enough pinned evidence to recover the historical consumer/build, data/assets, deterministic seeds and minimum dynamic state.

A reconstruction in a newer runtime should be reported as `SEMANTIC_REBUILD` unless equivalence is actually demonstrated.

## 11 · Pilot-scope guardrail

The architecture in §10 **does not expand the first capability pilot**.

Pilot 01 remains:

1. Lorekeeper + Tome/lectern + Staff;
2. one broad-regression BOX1 Sedan source;
3. minimal movement/boost/drift/re-grip/jump/landing/impact event handoff;
4. at least one real derived asset where the plugin supports it;
5. consumer test before batch expansion.

Camera/transition/journey/package-tree work starts only as a later backlog proof after Pilot 01 is structurally useful.


## 12 · Current Pilot 01 implementation

The first concrete package now lives at:

[**game-ready/pilot-01-lorekeeper-sedan/**](../../../../game-ready/pilot-01-lorekeeper-sedan/README.md)

Implementation commit:

`d7fd4c8ed062cfbc304f9c70fc1c3be30f26c6bf`

Current status:

- SOURCE REVIEW — PASS;
- PACKAGE METADATA — IMPLEMENTED;
- STATIC / STRUCTURAL QA — PARTIAL PASS;
- BINARY CHASSIS PROXY — BLOCKED in the current webchat environment because the local Game Development Studio `game-dev` CLI is not exposed;
- CONSUMER TEST — NOT RUN;
- HUMAN ACCEPTANCE — PENDING.

The persisted `COLLIDER_PROXY_SPEC.json` derives the wheel-free chassis candidate from the source `car_sedan` body accessor and keeps binary generation/validation as an explicit later producer gate.
