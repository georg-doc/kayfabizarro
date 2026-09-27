# S5 Building / Façade Clay Adapter · START HERE

Status: **PREPARED FOLLOW-ON SLICE · NOT STARTED**  
Date: 2026-09-27  
Receiving owner: existing **WorldBuilder / OSM City** world-look lane  
Track owner: existing **KFB Blender-MCP Racer / Track Core** stays read-only

## Read order

1. `skills/chat/START_HERE.md`
2. `skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`
3. `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`
4. parent Track-Core `START_HERE.md` for the current road/world seam
5. `BRIEF_CLAUDE_DESIGN_BUILDING_FACADE_CLAY_ADAPTER_S5.md`
6. H0 Knetwelt HOWTO + HANDOVER named in the brief
7. current WorldBuilder / OSM City Return/Recovery before implementation

## Goal

Prove one reusable clay/cartoon building façade adapter across:
- real OSM buildings;
- verified KayKit building donors;
- verified Kenney city/commercial/industrial building donors.

Preserve source identity, OSM footprint/height/anchors and native kit connectors. Reuse H0 clay modules and Elastic Grotesque Clay V2 before creating anything new.

## Protected boundary

This slice does **not** own or rebuild:
- road/track geometry;
- Track Core sockets;
- OSM geography;
- Race physics/contact;
- WorldBuilder transform/persistence owner;
- Asset Registry.

## Current state

Prepared only. No runtime change, no tests, no Stage, no human gate.

## Start condition

Do not execute as part of S4/TRACK-CORE-2. Start it as its own bounded WorldBuilder/OSM slice when the receiving owner opens the building-look gate.

## Exactly one first gate when started

Show one real OSM building group, one KayKit building and one Kenney building **unchanged in isolation**, then prove the shared H0/Elastic clay adapter on the same three sources without moving their source geometry/anchors.
