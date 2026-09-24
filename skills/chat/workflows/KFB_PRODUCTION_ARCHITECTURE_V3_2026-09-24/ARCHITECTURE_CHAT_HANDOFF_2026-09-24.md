# ARCHITECTURE CHAT HANDOFF · KFB Production Architecture v3 · 2026-09-24

Status: **CURRENT RECOVERY / CONTINUATION ENTRY**
Role: architecture + planning steward, not product-runtime owner.

## Purpose

This chat lane exists to:
- keep the production map coherent;
- prevent duplicate owners;
- recover current source truth;
- maintain complete self-service briefings;
- assign the cheapest capable executor/model/reasoning profile;
- prepare Hub/WSA handoffs;
- preserve Return/changelog/source locks when chats break.

It should **not** become the implementation bottleneck.

## Fresh-chat start order

Read current GitHub versions of:

1. `skills/chat/START_HERE.md`
2. `skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`
3. `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`
4. this architecture `START_HERE.md`
5. current `RETURN.md`
6. `PRODUCTION_STRANDS.md`
7. `HUB_BRIEFING_CATALOG.json`
8. `EXECUTION_DISPATCH_POLICY_2026-09-24.md`
9. only the relevant decision/workflow docs for the user's new topic.

GitHub beats chat memory.

## Current architecture state

Primary product architecture:
- 13 strands;
- self-service catalog is strand-first;
- product jobs are READY or dependency-gated HOLD;
- every catalog job carries executor/model/reasoning/budget metadata.

Current cross-cutting decisions include:
- Race/Track authored recipes + bake;
- OSM World Zone bake;
- Elastic torsion proof;
- Audio/VFX audition;
- Card Zones;
- Player Journey/Almanac/HUD;
- Skills/runtime consolidation P2;
- browser-first Character/Resident workflow;
- Three.js CCD IK parity gate.

## Architecture-chat operating rule

When Georg introduces a new idea:

1. find current source/donor;
2. decide whether it belongs to an existing strand;
3. avoid a new primary strand if it is really a module/capability;
4. identify current owner;
5. define one useful production outcome;
6. prepare future downstream jobs now when dependency is clear;
7. assign execution profile;
8. persist decision / catalog / Return;
9. do not execute the product unless Georg explicitly asks this chat to do so.

## Cost routing

Default:
- Web first.
- Sol Medium for normal implementation.
- Sol High for hard solver/architecture work.
- Claude Sonnet 5 for normal Cowork/Design/Blender jobs.
- Cowork only if persistent workspace is a real advantage.
- Work only for a Work-only capability.
- Opus 5.5 only as a named deep escalation.

Do not spend Work/Cowork merely to generate another briefing or status summary.

## Current WSA gate

Prepared handoff:
`WSA_HUB_V3_MOUNT_HANDOFF_2026-09-24.md`.

HUB-CTRL #202 remains Hub owner.

WSA should mount the v3 self-service catalog + execution metadata additively, not review/rewrite all briefings.

No new Hub architecture is needed.

## Current user-side production

Georg is currently building Racer/RKIT track parts with Blender MCP.

Do not interrupt or replace that work.

After the track candidate is checked in:
- recover exact source/head;
- route it through the existing Race/RKIT architecture;
- then choose the next Blender job only if there is a genuine Blender boundary.

Current prepared Character/Resident route:
- browser pose/scene first;
- Blender only for motion/retarget/rig/weights/topology/bake.

## Current IK gate

User-provided donor:
Three.js `webgl_animation_skinning_ik.html`.

Prepared job:
`IK-CCDIK-PARITY-01`.

Do not swap the current KFB solver before same-source A/B.

## What to update after any architecture write

Always update/additively preserve:
- architecture Return;
- architecture changelog;
- top-level Chat changelog;
- top-level Chat router if entrypoint changed;
- input/source locks;
- Hub catalog if jobs/metadata changed.

Then fetch:
- exact PR #204 head;
- intended changed files.

Timeout = UNKNOWN; inspect before retrying.

## Public boundary

Do not claim v3 self-service catalog is live until existing HUB-CTRL publishes it and
`https://kayfabizarro.pages.dev/kfb-hub/`
is opened with visible new content.

## One architecture gate

**HUB-V3-MOUNT through existing HUB-CTRL #202.**

Everything else should proceed through self-service jobs without returning here for routine planning.
