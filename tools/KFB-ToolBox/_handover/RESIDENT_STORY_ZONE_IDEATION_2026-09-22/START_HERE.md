# Resident Story Zones · START HERE

Status: **CURRENT IDEATION / RECOVERY ENTRY · NO RUNTIME BUILD**

Repository: `georg-doc/kayfabizarro`  
Branch: `chatgpt-web/resident-story-zone-concept-2026-09-22`  
Owner: **KFB ToolBox / shared scene authoring**  
Reserved future Stage route: `https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/resident-story-zones/`  
Current public state: **NOT BUILT / NOT DEPLOYED / NOT PUBLIC_VERIFIED**

## Recover in this order

1. Read current `skills/chat/START_HERE.md`.
2. Read current `skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`.
3. Read current `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`.
4. Read this folder's `LIVING_CONCEPT.md`.
5. Read this folder's `RETURN.md`.
6. For implementation questions, re-open the exact current owner docs named in `LIVING_CONCEPT.md` rather than relying on remembered snapshots.

GitHub current state overrides this handoff.

## Purpose

This is the recovery home for Georg's ongoing brainstorming about:

- Resident/NPC scene authoring;
- ChatterBox integration;
- nested editing from EyeRig / face / actor to scene / Story Zone / world;
- live Asset Librarian search;
- reusable micro-scenes and dioramas;
- authored paths, activities and mini-stories;
- Hex/world placement through existing world/surface owners.

## Important boundary

This folder is **not** a new runtime owner.

It routes to existing owners:

- Resident Atlas / actor composition;
- EyeRig / face / graft authoring;
- Motion/Animation owners;
- ChatterBox;
- Asset Registry / Librarian;
- shared in-scene editor and `kfb.scene-patch.v1`;
- current World Building / Surface Adapter lane;
- receiving world/game hosts for navigation, collision, camera, persistence and gameplay.

## Current concept checkpoint

The working proposal is:

> **Story Zone = a reusable, nested, non-destructive composition layer above existing asset/profile/activity owners and below the receiving world/runtime owner.**

The strongest shared authoring grammar is:

`EyeRig → Face → Head/Graft → Resident → Activity → Scene → Story Zone → World placement`

Each level remains independently editable through local transforms/profile parameters and owner-specific patches.

## Current recommended first proof

Do **not** build the general World Editor first.

First concrete fixture, when implementation is explicitly started:

**Lore Keeper · Open-Air Study Story Zone**

- real Lore Keeper Resident;
- writing lectern / study station;
- books / RPG archive props;
- optional bookshelf;
- backpack retained;
- compact open-air scenery that stays portable;
- LK-L1 study/read/think + one contextual ChatterBox interaction;
- then LK-L2 Desk ↔ Shelf path;
- only later LK-L3 book/Card POI discovery and collect/archive loop;
- save/reload;
- nested group edit;
- portable Story Zone recipe.

The earlier Park Bench fixture remains useful as a later minimal regression fixture, but is no longer first.

Parallel concept lane now also includes the **Kayfabe Social Conflict Loop**: buddy banter → optional provocation/challenge → optional host-approved social melee → explicit help-up/laugh/reconciliation → resume activity. Bond, temporary Kayfabe Heat and topic stance remain distinct; ChatterBox never becomes Combat owner.

## How to continue ideation

Append dated sections to `LIVING_CONCEPT.md`.

Use status labels:

- `USER DIRECTION`
- `PROPOSAL`
- `DECISION`
- `CORRECTION`
- `DEFERRED`
- `REJECTED`

Do not rewrite old entries to make the history cleaner.

## One next gate

Continue the ideation session and sharpen **Lore Keeper Story Zone authoring semantics + Kayfabe social interaction semantics**, without implementing a runtime until Georg explicitly switches from brainstorming to build.
