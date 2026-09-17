# KFB World Builder · durable workbench

**Status:** CURRENT WORKING NAVIGATOR / documentation surface  
**Implementation SSOT:** `georg-doc/KFB-Travel-Globe`  
**Public route after mirror/deploy:** `https://kayfabizarro.pages.dev/travel/wip/travel_globe_wsa/world/`  
**Live WB0 runtime:** `https://kayfabizarro.pages.dev/travel/wip/travel_globe_wsa/world-builder/`

## Purpose

This folder exists so a fresh planning/production chat does **not** need another pasted mega-briefing.

Start from `index.html` / the public `/world/` URL. It summarizes the current WB0 state and links to the authoritative Travel source documents. If anything conflicts, current Travel GitHub state wins.

This is **not** a second World Builder runtime and not a new project SSOT.

## Files

- `index.html` — human-facing navigator/workbench.
- `WORLD_STATE.json` — structured planning state used by the page; not a runtime contract.
- `CHANGELOG.md` — additive history for this workbench.
- `SP13KTRA_CLEAN_ROOM_DONOR.md` — observation-only donor note with copyright boundary.

## Current runtime relationship

The actual WB0 implementation already lives under:

`site/world-builder/`

Current implemented proof includes PLAY/BUILD/GOD, GROUND/FLIGHT switching, placement/editing, Surface Snap, World Recipe persistence, candidate JSON import, one ROAD spline, BlockBits and ramp placement. Static tests passed; Georg's human browser acceptance is still pending.

The `/world/` page tracks and explains that state. It does not duplicate its code.

## Recovery rule

After a chat break:

1. open the public `/world/` page;
2. read its **Current truth** and **WB0 human browser gate**;
3. open only the linked source docs needed for the task;
4. verify current `main` before any write;
5. append this folder's `CHANGELOG.md` when the workbench itself changes.

## Ownership

- Travel owns macro world, renderer, terrain, atmosphere, world lighting/audio and runtime integration.
- Asset Registry/Librarian owns read-only asset facts/discovery.
- Builder consumes candidate bundles and owns authored placement/calibration/recipe state.
- ToolBox/Animation Lab owns actor/rig/motion/attachment compatibility.
- This folder owns only the durable planning/navigator surface.

## Public mirror

`georg-doc/kayfabizarro/travel/wip/travel_globe_wsa/world/` is the authorized public mirror only. Source changes happen here in Travel first; mirror provenance must point back to the Travel commit.
