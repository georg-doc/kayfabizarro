# KFB World · POC / Design Lab

**Status:** CURRENT WORKING NAVIGATOR + AUTHORING UX POC · NOT RUNTIME SSOT  
**Implementation SSOT:** `georg-doc/KFB-Travel-Globe`  
**Public route after mirror/deploy:** `https://kayfabizarro.pages.dev/travel/wip/travel_globe_wsa/world/`  
**Object Composer:** `https://kayfabizarro.pages.dev/travel/wip/travel_globe_wsa/world/composer.html`  
**Route Lab:** `https://kayfabizarro.pages.dev/travel/wip/travel_globe_wsa/world/route-lab.html`  
**Resident Prefab Lab:** `https://kayfabizarro.pages.dev/travel/wip/travel_globe_wsa/world/prefab-lab.html`  
**Seed Lab:** `https://kayfabizarro.pages.dev/travel/wip/travel_globe_wsa/world/seed-lab.html`  
**Live WB0 runtime:** `https://kayfabizarro.pages.dev/travel/wip/travel_globe_wsa/world-builder/`

## Purpose

This folder exists so fresh planning/production chats do **not** need pasted mega-briefings and so authoring UX can be tested quickly without turning the POC into a second world/runtime owner.

The hard flow is:

`/world/ POC → Candidate World Recipe → Travel validation → optional promotion`

If anything conflicts, current Travel GitHub/project SSOT wins.

## Files

- `index.html` — human-facing navigator / design-lab dashboard.
- `WORLD_STATE.json` — structured planning state; not a runtime contract.
- `composer.html` + `composer.js` — direct-manipulation object-authoring POC.
- `route-lab.html` + `route-lab.js` — candidate ROAD control-point UX POC.
- `prefab-lab.html` + `prefab-lab.js` — Resident Atlas grouped-prefab placement/ungroup UX POC.
- `seed-lab.html` + `seed-lab.js` — deterministic Generate-6 / pin-one scatter-seed UX POC.
- `CHANGELOG.md` — additive history.
- `SP13KTRA_CLEAN_ROOM_DONOR.md` — observation-only donor note with copyright boundary.

## Current POC chain

### Object Composer

- Librarian-style candidate JSON / direct GLB/GLTF input;
- real asset placement on neutral pad;
- Move / Rotate / Scale;
- local ground snap;
- duplicate / delete / frame;
- measured bounds;
- local roundtrip;
- candidate recipe export.

### Route Lab

- start/finish/cancel candidate ROAD;
- click-place/edit control points;
- centerline preview;
- undo/delete/frame/top;
- local roundtrip;
- candidate spline JSON only.

### Resident Prefab Lab

- consume `kfb-resident-scene.v1` from Resident Atlas;
- load the current Caveman ensemble directly from its declarative scene recipe;
- resolve exact child assets from the scene's pinned source commit;
- place the ensemble as one grouped prefab;
- Move / Rotate / Scale the group;
- ungroup → edit individual children → regroup;
- reuse Atlas Hero/Top camera hints;
- local roundtrip;
- export source-scene provenance + root/child transforms as candidate `residentPrefabs` data.

**2026-09-17 bugfix:** initial empty-state serialization previously dereferenced a null prefab root and could show `Cannot read properties of null (reading 'position')`. `prefab-lab.js` now guards null roots in vector serialization / restore paths. Browser retest is still required.

### Seed Lab

- one bounded **zone-scatter** use case only;
- generate six deterministic candidate layouts from one base seed;
- compare six previews at once;
- tune count, cluster strength, field scale and edge falloff;
- select one candidate and explicitly **Pin** it;
- local save/reload;
- copy/download candidate recipe;
- persist only `seed + parameters + preview hash/stats`, not the baked point list.

The Seed Lab uses an independently written KFB scatter generator. SP13KTRA remains observation-only; no upstream code, constants, seed tables or procedural implementations are copied.

## Deliberate limitation

All current `/world/` authoring surfaces use explicit `poc-local` coordinates or abstract candidate parameters. They are **not** Travel terrain and do not claim spherical/world anchoring.

The POC does not own:

- movement;
- terrain or water;
- Registry facts;
- Resident Atlas source truth;
- animation compatibility;
- productive Save/Reload semantics;
- productive road geometry;
- productive scatter placement or biome generation.

Travel/WB0 decides whether and how candidate recipes map to spherical anchors and runtime state.

## Runtime relationship

The actual productive WB0 implementation lives under:

`site/world-builder/`

WB0 owns the runtime proof path for PLAY/BUILD/GOD, GROUND/FLIGHT switching, placement/editing, Surface Snap, productive World Recipe persistence, candidate JSON import, one ROAD spline, BlockBits and ramp placement.

Latest productive WB0 static evidence before these POC-only changes is 28/28 tests plus build/verify PASS at `d1e2488b`; Georg's human browser acceptance remains pending. The `/world/` POCs have separate browser acceptance and do not inherit that PASS.

`/world/` may move faster on UX experiments, but only proven outputs are promoted into Travel.

## Recovery rule

After a chat break:

1. open `/world/`;
2. read **Hard boundary**, **Current truth**, **POC experiment queue** and **WB0 human browser gate**;
3. open only linked source docs needed for the task;
4. verify current `main` before any write;
5. append `CHANGELOG.md` rather than rewriting history.

## Ownership

- Travel owns macro world, renderer, terrain, atmosphere, world lighting/audio, movement and productive persistence.
- Asset Registry/Librarian owns read-only asset facts/discovery.
- Resident Atlas owns declarative resident-scene composition candidates.
- `/world/` owns only authoring UX experiments and candidate recipe output.
- Builder owns productive placement/calibration/recipe state only after Travel validation.
- ToolBox/Animation Lab owns actor/rig/motion/attachment compatibility.

## Public mirror

`georg-doc/kayfabizarro/travel/wip/travel_globe_wsa/world/` is the authorized public mirror only. Source changes happen here in Travel first; mirror provenance must point back to the Travel commit.
