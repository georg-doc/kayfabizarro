# RETURN · C0 Baukasten Catalog

**Status:** `IMPLEMENTATION · browser QA pending`  
**Repository:** `georg-doc/kayfabizarro`  
**Base main:** `5650b6c54d8789b20ea80abe857688173d506d3b`  
**Branch:** `chatgpt-web/baukasten-c0-2026-09-19`  
**Fixed Stage target:** `https://kayfabizarro.pages.dev/kfb-hub/stage/minigames/baukasten-c0/`

## GOAL

Build only C0: a small visual Baukasten catalog for the named carrier, Tiny Treats, Resident and FrizzleBob families, using the central registry and existing module contracts rather than copying assets or creating another Asset Library.

## EXISTING OWNER

- Asset identity/provenance: central Asset Registry / Asset Librarian.
- Resident presentation/activity: Resident Atlas S6 + Resident Scene Module adapter.
- FrizzleBob construction/face/rig: current Driver Graft contract + reader.
- Receiving game runtime keeps movement, physics, collision, camera, progression and persistence.

## IMPLEMENTATION

- Stage source: `kfb-hub/stage/minigames/baukasten-c0/`
- Registry-backed pack inventory: Kenney Platformer, KayKit Dungeon, KayKit Medieval Hexagon, KayKit Medieval Builder, six Tiny Treats packs, KayKit Mystery Series 6.
- Measured proof lanes: `carries`, `tells` (modular + loose witness), `inhabits`, `acts`.
- The page exposes exact source path/revision/blob where the central registry provides it; measurements are calculated from the loaded browser scene.
- Tiny Treats modular interior/ground components are explicitly separated from loose scenery.
- Exports are references/measurements only: Scene Recipe + Module Manifest.

## PROTECTED BOUNDARIES

No asset copy, no new Asset Library, no second Resident runtime, no second Graft/animation owner, no collision takeover, no auto-merge.

## STATUS SPLIT

- `IMPLEMENTATION`: present on branch.
- `TESTED RESULT`: pending dedicated browser workflow at the time of this initial Return.
- `PUBLIC DEPLOYMENT`: pending merge + external Cloudflare propagation; no public-pass claim before that.
- `GEORG ACCEPTANCE`: OPEN.

## HUMAN REVIEW

Exactly one open gate will be kept here after browser QA is complete.
