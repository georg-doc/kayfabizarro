# KFB Game-Ready Packages

This directory contains **derived package metadata and explicit game-ready derivatives**, never a replacement warehouse for canonical KFB/KayKit/Kenney source assets.

## Current pilot

### Pilot 01 · Lorekeeper + Sedan

[Open package](pilot-01-lorekeeper-sedan/README.md)

Status:

- SOURCE REVIEW: PASS
- PACKAGE METADATA: IMPLEMENTED
- STATIC / STRUCTURAL QA: PARTIAL PASS
- BINARY CHASSIS PROXY: BLOCKED in the current webchat environment because the Game Development Studio `game-dev` CLI is not exposed
- CONSUMER TEST: NOT RUN
- HUMAN ACCEPTANCE: PENDING

Implementation commit: `d7fd4c8ed062cfbc304f9c70fc1c3be30f26c6bf`

## Governing documents

- `skills/chat/workflows/OSM_CITY_SLICE_2026-09-18/GAME_DEV_STUDIO_ASSET_PACKAGING.md`
- `skills/chat/workflows/OSM_CITY_SLICE_2026-09-18/GAME_DEV_STUDIO_ASSET_PACKAGING_LIVING.md`
- `skills/chat/workflows/ASTRA_INTEGRATION_01_2026-09-18/WALK_DRIVE_COMBAT_PREFLIGHT.md`

## Rule

```text
Canonical GitHub Asset
→ Game-Ready Package
→ Registry/Librarian reference
→ ToolBox/Animation QA
→ named real consumer
→ human acceptance
```

Do not interpret the presence of a package directory as consumer or human acceptance.


## KFB Game Dev Studio preview

Permanent human-facing package lane:

https://kayfabizarro.pages.dev/kfb-hub/free-roam/game-dev-studio/

Catalog/recovery owner:

`tools/game-dev-studio/`

The site reads package/source state; it does not redefine game-ready acceptance.
