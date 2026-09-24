# RETURN · KFB Production Architecture v3 · complete world/gameplay production map · 2026-09-24

Status: **ARCHITECTURE CANDIDATE READY · 11 STRANDS / 45 JOBS · UNMERGED · NO LIVE PROMOTION**

## Exact state

- Repo: `georg-doc/kayfabizarro`
- Branch: `chatgpt-web/production-architecture-v3-2026-09-24`
- Draft PR: **#204**
- Base: `main@9431dcb8da0158a75d0988d52fc1e7a49aac21f1`
- Validated architecture/source checkpoint before this Return: `a21b2c4a4e99eadbe285426f218e840a857c6c25`
- Public Stage created by this architecture slice: **no**
- Cloudflare Live promotion: **not authorized**
- Existing public Hub remains: `https://kayfabizarro.pages.dev/kfb-hub/`

## Primary production strands

### 1 · ToolBox Authoring Platform
Stage-First → EyeRig → Fractal/Pose → Animation → Vehicle/Driver → Resident Scene + Live Search → coherent production ToolBox.

### 2 · Animation & Residents
Motion Library/Profiles → Pose-before-Blender → productive Blender performance batches → shared ToolBox/WorldBuilder consumers.

### 3 · WorldBuilder / God Mode
WB-W0 → Authorable Place → Live Search/Fractal Edit → real locomotion → OSM district → Race module → God Mode.

### 4 · Racer → World
Current Race PR #33 R3d TUNE → Anatomy Foundation → route-driven visual module → real vehicle contact → WorldBuilder bridge.

### 5 · Quick 3D Review
Real-source visual questions directly in Chat HTML; measurement only as support.

### 6 · Combat / Duel Choreography
Actor capability matrix → real melee/ranged contact → ToolBox Duel Studio → autonomous NPC Match Director → Arena expansion → Card Tower encounters → Open-World Combat adapter.

Key ownership:
- Animation Studio choreographs/visualizes;
- Combat Arena owns targeting, hit, damage, defeat, rewards and encounter lifecycle.

### 7 · Cube Pets / Actor Identity
All 24 canonical CubePets remain first-class actors across ToolBox, Residents, Combat and World/Town.

Locked FrizzleBob identities:
- `cube-frizzlebob` = canonical CubePet bunny / `animal-bunny.glb`;
- `legacy-arena-frizzlebob` = Combat Arena Yellow/Gun lineage;
- `frizzlebob-driver-graft` = current Rig_Medium ToolBox/modern actor line.

No bare “FrizzleBob” is a valid technical actor id.

### 8 · Travel Modes / World Surfaces
World topology and movement mode are independent.

First surfaces:
`FLAT · SPHERE · TORUS`

First modes:
`GROUND · FLIGHT · DRIVE · WATER/BOAT · later PLANE/FREEFALL/PARACHUTE`

Exactly one movement writer is active.

TinySkies remains a donor:
- Carpet;
- Boat + BoatMesh with geometric foam waterline;
- Plane/Biplane;
- atmosphere/world presentation.

Boat/Plane are source-proven upstream features, **not yet claimed as KFB-ported modes**.

### 9 · Vertical Worlds · Babel / Hex / Card Towers
Recover failed-source mechanics → measured Hex/Voxel grammar → Babel recipe → assisted/chill platforming → extendable vertical construction → Combat bands → fall/flight return.

The remembered old auto-jump-line implementation is **SOURCE_REQUIRED** until its exact code is found. No reconstruction from memory.

### 10 · Town / ChatterBox / Living NPCs
Living Resident scenes use:
- encounter beats;
- ChatterBox/NIE/bubble presentation;
- existing Journey/card-event memory as filtered NPC memory;
- typed gifts/cards/collectible retorts;
- optional Combat encounter capability.

Town becomes a curated composition of the same living modules rather than a separate NPC engine.

### 11 · Shared Stage / Transitions / FX
- reusable Spindle/Skydome environment;
- Theatre Curtain Core v2;
- shared Stage/Instance recipes;
- semantic VFX/SFX maps.

These remain presentation modules; hosts keep gameplay/rendering ownership.

## Adjacent open lanes integrated as modules

Not promoted to new universal owners:

- **2D / 2.5D Animation Studio** → Actor capability adapters / Residents / World / later Combat.
- **Storytelling Maps / Responsive CardRig / Billboards** → placeable media/stage modules.
- **Dungeon / Environment Atlas** → instance/layout owner; Combat/Resident/Curtain adapters compose around it.
- **Card Zone / Project Islands** → Card systems feed Vertical/World/Combat support.
- **VFX/SFX consolidation** → Shared Stage semantic event maps.
- **Tourbus / WaterBowser** → later Living Vehicle Scene using Drive + Residents + ChatterBox + billboard/cards/gifts.
- **Graveyard / Boxel / other mini-games** → instance owners with World/Town entrances and shared transition/return.

## Current self-service catalog

Machine-readable Hub catalog:
`HUB_BRIEFING_CATALOG.json` schema v3.

Metrics:
- **11 strands**
- **45 copy-ready jobs**
- **20 READY**
- **25 HOLD with explicit dependency**
- Hub default = strand-first
- individual job cards collapsed by default
- Today view should show only current READY/REVIEW work, not the full wall

New copy-ready job groups include:

Combat:
`COMBAT-ID-01 · COMBAT-MELEE-01 · COMBAT-DUEL-01 · COMBAT-MATCH-01 · COMBAT-TOWER-01 · COMBAT-WORLD-01`

CubePets:
`PET-ID-01 · PET-TOOLBOX-01 · PET-RESIDENT-01 · PET-COMBAT-01`

Travel/surfaces:
`SURFACE-01 · TRAVEL-MODES-01 · TRAVEL-DRIVE-01 · TRAVEL-BOAT-01 · TRAVEL-AIR-01`

Vertical:
`VERT-SOURCE-01 · BABEL-01 · VERT-WORLD-01`

NPC life:
`NPC-LIFE-01 · NPC-MEMORY-01 · NPC-GIFT-01 · NPC-WORLD-01`

Shared Stage:
`SPINDLE-01 · CURTAIN-02 · STAGE-INSTANCE-01 · FX-SEMANTIC-01`

All existing ToolBox / Animation / WorldBuilder / Racer briefs remain in the same catalog.

## Validated current source state

**52/52 architecture/source checks PASS.**

Relevant current heads:
- EyeRig #104: `e277c3456651d314a01adea046e0105d2a12cdd1`
- Creator/KCL #107: `fc49a336af57adb6317b74211b3318d004d96de5`
- Curtain #114: `cd9c04cbf009b1211b9b6b008162b9d322d6e152`
- Motion Lab #127: `7c8cc218ec46dabb20409c9e0b5368afcf5845c6`
- Card Zone #156: `ee0f9bb6d738c538e042f799e5fb6f9b20893a01`
- ToolBox #185: `2833674b36be707fa4d14c8b532faee78ef3ba28`
- Shared Editor #186: `7267185cdbdc60e576b946ee589f0b2e932c8c8b`
- WB2 #190: `5a98e674184ea4694a5ad7d696d8cc84c1618bdf`
- Blender proof #192: `b49fb6e1adde070d658e1cc21dadb3294164cb29`
- Warband #195: `9dda7957a33e69926265c1e3a69028a4b35b26f0`
- Motion Library #197: `bf0eace2332a48f0b220318ad7567c68cc6dfbad`
- WB-W0 #203: `40fe2c10959a2022694a2342482e04dd34cbe7be`
- Combat main: `f6a59ad15b9ffcf3164b0ab013f223962b63f61f`
- Combat #5: `d6cf532e64d45fd3117775ec61cfc87b9e948ac0`
- Combat #6: `735b5449bf09fb1a069d4a81db44608a58166677`
- Combat #7: `f773dbeb0cfa09fa7e1bd72a4323130b2c0eff06`
- Combat #10: `663f0610eb960f322d67b078f1302d0c6178d1c2`
- Travel main: `8614282aab2ced43bb5dda9fcf7abadf9768100a`
- Travel #38: `08147fb4a6726f4c0248ff79ade67eec24afdbca`
- Racer #33: `71e7051b2eea1ad731912b634f44ce5ba0218736`

## Important current human/product gates

- **WB-W0** still waits for Georg `PASS / TUNE / REJECT` on scale/traversability before `WB-AUTHOR-01`.
- **Racer** current product foundation remains R3d TUNE → `RACE-ANATOMY-01`.
- **Combat PR #7** product work can resume through direct Chat review; the historical child-route Cloudflare failure is not a reason to spend the edit loop debugging publication.
- **Legacy Combat** still needs accepted visual EyeRig/profile state before full runtime rollout.
- **Curtain** foundation stays; tieback/swag + crease cleanup remains the visual refinement.
- **TinySkies Boat/Plane** require exact upstream source recovery before KFB adaptation.
- **old Platformer auto-jump** requires exact source recovery.

## Public Hub boundary

The expanded 11-strand catalog is **prepared but not yet mounted** into the current public Hub owner.

Current public Hub owner remains:
- HUB-CTRL PR #202;
- `cloudflare-live`.

This branch intentionally does not create a second Hub implementation and does not claim the public Hub already displays these 45 jobs.

## One next architecture gate

**HUB-V3-MOUNT**

The existing HUB-CTRL owner consumes `HUB_BRIEFING_CATALOG.json` and renders:

- strand cards on the default view;
- current READY/REVIEW work in Today;
- full 45-job dependency roadmap only on expansion;
- copy-ready prompts from `STRAND_BRIEFINGS.md`.

After that, ordinary product work starts directly from READY cards. Architecture is not revisited merely to obtain the next prompt.
