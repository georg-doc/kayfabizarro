# KFB Game-Ready Pilot 01 · Lorekeeper + Sedan

**Status:** PACKAGE METADATA IMPLEMENTED · SOURCE REVIEW PASS · BINARY DERIVATIVE BLOCKED IN CURRENT WEBCHAT ENVIRONMENT · CONSUMER TEST OPEN  
**Date:** 2026-09-18

This is the first bounded capability proof for the Game Development Studio packaging lane.

Pilot lock:

1. S6 Lorekeeper + Tome/lectern + Staff;
2. BOX1 broad-regression `car-sedan`;
3. minimal shared event handoff for movement, boost, drift/re-grip and jump/landing/impact.

Canonical source assets are **referenced, not copied**.

Architecture/contracts:

- `skills/chat/workflows/OSM_CITY_SLICE_2026-09-18/GAME_DEV_STUDIO_ASSET_PACKAGING.md`
- `skills/chat/workflows/OSM_CITY_SLICE_2026-09-18/GAME_DEV_STUDIO_ASSET_PACKAGING_LIVING.md`
- `skills/chat/workflows/ASTRA_INTEGRATION_01_2026-09-18/WALK_DRIVE_COMBAT_PREFLIGHT.md`

## Current result

Created package metadata includes source/dependency provenance, Lorekeeper rig/socket and animation mapping, exact Sedan wheel nodes/positions, a source-derived wheel-free chassis AABB proxy specification, physics/deformer handoff, event/VFX/SFX maps and QA plan.

The required binary collider/normalized package has **not** been fabricated here: the Game Development Studio local `game-dev` CLI is not exposed in this webchat execution environment. `vehicle/car-sedan/COLLIDER_PROXY_SPEC.json` therefore records the exact source-derived proxy input and leaves binary generation/validation as an explicit next gate.

No new Registry, movement engine, physics engine, animation owner or audio engine is introduced.
