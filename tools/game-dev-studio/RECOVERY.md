# KFB Game Dev Studio · Recovery

**Date:** 2026-09-18  
**Public target:** https://kayfabizarro.pages.dev/kfb-hub/free-roam/game-dev-studio/  
**Tool home:** `tools/game-dev-studio/`

## CURRENT

Pilot 01 is the active package:

`game-ready/pilot-01-lorekeeper-sedan/`

Current package state:

```text
SOURCE REVIEW      PASS
PACKAGE METADATA   IMPLEMENTED
STRUCTURAL QA      PARTIAL PASS
BINARY DERIVATIVE  BLOCKED_TOOL_UNAVAILABLE
CONSUMER TEST      NOT RUN
HUMAN ACCEPTANCE   PENDING
```

The package contains Lorekeeper + Tome/lectern + Staff, exact BOX1 `car-sedan`, wheel/socket evidence, source-derived collider proxy spec, physics/deformer handoff, shared gameplay/VFX/SFX event maps and consumer test plan.

## PUBLIC / PREVIEW LANE

Public target:

`https://kayfabizarro.pages.dev/kfb-hub/free-roam/game-dev-studio/`

Public proof workflow:

`.github/workflows/game-dev-studio-public.yml`

Latest evidence:
- run `35368827693`, attempt 1: **FAIL before browser boot** because `/tools/game-dev-studio/catalog.json` was not deployed on the real `kayfabizarro.pages.dev` host during the five-minute polling window;
- therefore no WebGL/preview failure is established by attempt 1;
- attempt 2 was explicitly rerun against the same fixed public URL after the repo wiring completed;
- GitHub Pages success is not treated as Cloudflare proof;
- no Cloudflare deployment credential/workflow is present in repository source, and no Cloudflare deployment connector is available in this chat.

The new public Game Dev Studio site is data-driven from:

`tools/game-dev-studio/catalog.json`

Initial preview set:

- Lorekeeper;
- Lorekeeper Tome / lectern;
- Lorekeeper Staff;
- BOX1 Sedan.

The Sedan preview may additionally show the persisted proposed chassis AABB and wheel-node markers. This is visualization of package evidence, **not** a generated/validated binary collider.

## OWNER BOUNDARIES

- canonical asset identity/provenance → Asset Registry / Librarian / exact GitHub source;
- resident rig / motion compatibility → ToolBox / Animation receiving owner;
- vehicle physical pose/contact → selected Race / Free-Roam receiver;
- Travel → world / mode / persistence;
- Game Dev Studio → package metadata, explicit derived assets when actually produced, preview/recovery surface.

## NEXT

1. verify fixed Cloudflare page after deployment;
2. produce + inspect + validate `car-sedan-chassis-proxy.glb` when the Game Development Studio CLI is available;
3. execute Lorekeeper consumer gate;
4. execute Sedan Slice-04-derived DRIVE gate;
5. bind exact existing SFX source refs;
6. only then decide batch expansion.

## BACKLOG

After Pilot 01 gates:

- CameraRecipe / HeroShotRecipe;
- TransitionRecipe;
- MomentReceipt / JourneyEntry;
- Rule-of-Three SceneKit;
- dungeon/instance transition proof.

See `GAME_DEV_STUDIO_ASSET_PACKAGING_LIVING.md`.
