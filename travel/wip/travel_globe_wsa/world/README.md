# KFB World · POC / Design Lab

**Status:** CURRENT WORKING NAVIGATOR + AUTHORING UX POC · NOT RUNTIME SSOT  
**Implementation SSOT:** `georg-doc/KFB-Travel-Globe`  
**Public route after mirror/deploy:** `https://kayfabizarro.pages.dev/travel/wip/travel_globe_wsa/world/`  
**Composer POC:** `https://kayfabizarro.pages.dev/travel/wip/travel_globe_wsa/world/composer.html`  
**Live WB0 runtime:** `https://kayfabizarro.pages.dev/travel/wip/travel_globe_wsa/world-builder/`

## Purpose

This folder exists so fresh planning/production chats do **not** need pasted mega-briefings and so authoring UX can be tested quickly without turning the POC into a second world/runtime owner.

The hard flow is:

`/world/ POC → Candidate World Recipe → Travel validation → optional promotion`

If anything conflicts, current Travel GitHub/project SSOT wins.

## Files

- `index.html` — human-facing navigator / design-lab dashboard.
- `WORLD_STATE.json` — structured planning state; not a runtime contract.
- `composer.html` + `composer.js` — direct-manipulation authoring POC.
- `CHANGELOG.md` — additive history.
- `SP13KTRA_CLEAN_ROOM_DONOR.md` — observation-only donor note with copyright boundary.

## Current Composer POC

The POC can currently:

- paste/import Librarian-style candidate JSON;
- accept direct GLB/GLTF URLs;
- load real repository assets;
- place them on a neutral authoring pad;
- Move / Rotate / Scale with Three.js TransformControls;
- local ground snap;
- duplicate / delete / frame selection;
- show measured object bounds;
- save/reload POC composition through local browser storage;
- copy/download `kfb.world-recipe.v0-poc` candidate JSON.

### Deliberate limitation

The neutral authoring pad uses explicit `poc-local` coordinates. It is **not** Travel terrain and does not claim spherical/world anchoring. The POC does not own movement, terrain, Registry facts, animation compatibility or productive Save/Reload semantics.

Travel/WB0 decides whether and how a candidate recipe maps to productive spherical anchors and runtime state.

## Runtime relationship

The actual productive WB0 implementation lives under:

`site/world-builder/`

WB0 already contains the runtime proof path for PLAY/BUILD/GOD, GROUND/FLIGHT switching, placement/editing, Surface Snap, World Recipe persistence, candidate JSON import, one ROAD spline, BlockBits and ramp placement.

Static tests passed; Georg's human browser acceptance is still pending.

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
- `/world/` owns only authoring UX experiments and candidate recipe output.
- Builder consumes candidate bundles and owns productive placement/calibration/recipe state only after Travel validation.
- ToolBox/Animation Lab owns actor/rig/motion/attachment compatibility.

## Public mirror

`georg-doc/kayfabizarro/travel/wip/travel_globe_wsa/world/` is the authorized public mirror only. Source changes happen in Travel first; mirror provenance must point back to the Travel commit.
