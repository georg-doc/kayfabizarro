# KFB Hybrid Production Handoff · 2026-09-23

Status: **CURRENT HANDOFF CANDIDATE · COWORKER-LED OPERATIONS · NO MERGE/LIVE**

## Für Georg

Ab hier soll der Produktionsalltag einfacher werden:

- **Coworker** verwaltet die laufenden Web-/Integrations-Slices;
- **Blender MCP** baut/animiert präzise 3D-Artefakte;
- **Claude Design** bekommt später geschlossene Donor-Pakete für Look/Composition/UX;
- **Web Lead** kommt nur noch periodisch zum Review/Reconciliation zurück;
- **WSA/Work** bekommt erst einen vorbereiteten Integrations-Workshop, wenn wirklich lokale/mehrere-Repos-Fähigkeiten nötig sind.

Keine Chat-Historie rekonstruieren.
GitHub + aktuelle PRs sind die Wahrheit.

## Start order

1. this file;
2. `CURRENT_STATE.md`;
3. `COWORKER_CONTROL_TOWER.md`;
4. one current project PR/Return only;
5. `RECOVERY.md` after any context loss.

Visual/design work with a working donor also follows:
`skills/chat/workflows/KFB_DESIGN_DONOR_LOCK_V1_2026-09-23/START_HERE.md`
when available on the referenced process branch PR #191.

## Production roles

### Coworker · default operational lead

Use for:
- source verification;
- bounded implementation;
- adapters/integration;
- tests;
- Review HTML;
- check-ins across active Web slices;
- preparing the next CLOSED Production Packet.

Small implementation checkpoints are welcome.

**Small checkpoints do not mean small Georg approvals.**

Coworker may internally build:
`source → vertical slice → expand → test`

but should normally return **one coherent human milestone**.

### Blender MCP · 3D authoring

Use for:
- posing / animation;
- prop/instrument rigging;
- batch authoring after one fixture proves the method;
- volumetric mesh anatomy;
- bevel/thickness/normals/material cleanup.

Expected bundle:
- editable `.blend`;
- reproducible script where practical;
- GLB/GLTF;
- GIF/MP4;
- source/measurement facts;
- short Return.

Blender does not own gameplay, route, physics, camera or runtime persistence.

### Claude Design · design/integration phase

Use after source/donor closure for:
- coherent look;
- composition;
- environment/art direction;
- presentation/UX;
- bounded visual integration.

No donor reconstruction.
No SVG/CSS replacement of proven 3D donors.

### Web Lead

Use periodically for:
- cross-lane sanity;
- owner conflicts;
- source reconciliation;
- Hub/current-state cleanup;
- WSA preparation.

Do not keep one giant lead chat alive forever.

### WSA / Work

Only when a prepared packet names a concrete missing capability:
- local/private multi-repo assembly;
- binary movement/packaging;
- OS/browser automation;
- final cross-repo smoke/release assembly.

No open archaeology in WSA.

## Human review delivery

When Georg must inspect something:

- direct clickable artifact in the same chat;
- 1–3 plain-language questions;
- no hunting through Hub/PR trees.

The actual acceptance artifact must also be durably recoverable in GitHub or a retained CI artifact.

## Current production principle

**Technical work may stay incremental. Human review should stay coherent.**

This explicitly preserves the effective Racer-style small commits while avoiding a return to dozens of Georg micro-gates.

## Exactly one next coordination gate

Coworker finishes the current ToolBox Source-Safe Integration as an internal multi-step build and returns the **full coherent ToolBox milestone**, not a Goth-Girl-only human gate.

After that Coworker performs a current-lane check-in and proposes exactly one next MVP.


## Opus 5.5 Coworker migration

Recommended for the current load-bearing Coworker chat:

`COWORKER_OPUS55_MODEL_SWITCH.md`

Keep the same chat.
Checkpoint current local/worktree state first.
Then switch model and recover from GitHub + local workspace rather than re-deriving from chat memory.

## Performance animation pilot

For authored instrument/prop mechanics read:

`PERFORMANCE_ANIMATION_PILOT.md`

This is a candidate addendum on top of:
- `skills/cartoon-motion_v1.md`;
- `skills/kfb-cartoon-animation_v2.md`.

First validation:
Warband drummer / Rig_Large.

## Coworker ↔ WSA sync

Prepared bridge:
`COWORKER_WSA_SYNC_BRIDGE.md`

GitHub is the synchronization bus.
There is no assumed hidden chat-to-chat shared state.

Do not start WSA yet unless Coworker returns a CLOSED packet with a named WSA-only capability.


## Current operations surfaces

### KFB Hub
Long-lived navigator/history.

### KFB Production Desk
Current operational mirror:
`PRODUCTION_DESK_V0_BRIEF.md`

Coworker refreshes its snapshot from GitHub.

### Shared 3D review scene
`REVIEW_SCENE_BASE_V1.md`

Use this to keep Webchat review conditions repeatable.

### VFX/SFX lane
`VFX_SFX_CONSOLIDATION_01.md`

VFX first.
SFX follows after donor-family review.
