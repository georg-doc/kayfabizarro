# KFB Chat Production · Living Masterplan

Status: CURRENT LEAD PLAN
Updated: 2026-09-13
Owner: Georg / KFB

This document is the durable lead-level plan for the KFB ChatGPT/Astra + Claude Design production line. It is not an implementation SSOT. Project repositories remain authoritative for their code, current branches, tests and returns.

## Why this exists

Chats can end, lose context or move between execution environments. No chat may therefore be the only place where a product decision, owner boundary, next slice or recovery path exists.

The durable stack is:

1. `skills/chat/START_HERE.md` — router.
2. `skills/chat/REGISTRY.json` — what is current, legacy, superseded or unverified.
3. this Living Masterplan — cross-project priorities and sequencing.
4. tool/project nodes — where to go next.
5. the named project implementation SSOT — actual code truth.
6. current `WSA_START`, `MASTERPLAN`, `RETURN`, PR/branch and test evidence in that project.

GitHub state beats chat recollection when they conflict.

## Current production topology

### Lead / planning

ChatGPT Web with Georg owns product decisions, slice scope, owner contracts, donor selection, acceptance gates and cross-project sequencing.

### Execution

Astra Work owns implementation, tests, browser QA, PR/merge/deployment work only within the current project contract.

### Authoring / measurement

Claude Design and dedicated KFB tool sites may author, measure, preview and export configuration. They do not silently replace project implementation SSOTs.

### Shared memory

GitHub is the shared state and handoff bus. Chats do not depend on direct chat-to-chat communication.

### Shared intake

Cross-project briefing/source packages may temporarily enter through the shared inbox documented in `INBOX_PROTOCOL.md`.

Current intake path:

`travel/wip/travel_globe_wsa/_inbox/`

Despite the path, this inbox does not belong to Travel semantically and does not confer ownership. It is staging only. Because `georg-doc/kayfabizarro` is public, no confidential/restricted material belongs there.

## Current priorities

### P1 · Travel MVP1 Bath Flight

Implementation SSOT: `georg-doc/KFB-Travel-Globe`.

Goal: FrizzleBob visibly flies the existing Travel Globe in the Bath while Travel remains the sole movement/camera/world owner.

Current acceptance work:

- final v16 FrizzleBob look must come from the Studio/profile contract, not guessed runtime tinting;
- black leather jacket and non-human-skin face presentation;
- Bath + Driver local lighting must avoid overexposure without changing accepted global Travel lighting blindly;
- Bath speedline/contrail anchors must sit on real vehicle-local rim/edge anchors;
- existing Card/Carpet trail anchors are also a known visual parity item, but broader world/VFX parity must not bloat MVP1;
- browser regression and Georg freeplay remain required before merge.

`F / interact` remains a known deferred baseline gap unless the Travel SSOT says otherwise.

### P2 · FrizzleBob Driver Profile v1

FrankenStein Studio v16 is the current actor/look/static-pose authoring owner.

Georg will visually author/approve the actual Driver look in v16. That accepted state should be persisted as a machine-readable actor profile instead of re-created from literals in each consumer.

Separate concerns:

- Actor Look profile: graft/head/face/eyes/material zones/finishes/wordmark/donor-eye state.
- Pose profiles: Bath Driver, Card Surf, Cockpit etc.
- Vehicle Fit profiles: seat/scale/contact/grip/trail-anchor measurements per vehicle.

Consumers read exported profiles; they do not become second look/pose owners.

### P3 · Tooling MVP T1 · FrankenStein Production Site

Publish the existing v16 implementation as the tool, not a greenfield rebuild.

Add a discreet Docs / LLM layer:

- START_HERE / SSOT / contracts / modules;
- current known issues;
- SOP and best-practice references;
- additive changelog;
- `llm-manifest.json` / `llms.txt` style machine-readable entry points;
- Actor Profile import/export;
- links to Asset Librarian, Animation Lab and consuming projects.

The site wraps and exposes current v16. It does not fork the actor system.

### P4 · Animation Lab

First pin the actual current implementation SSOT/site and promote the router node from `UNVERIFIED` only with evidence.

FrankenStein Studio decides/measures actor, look, rig and base/static pose. Animation Lab consumes that state for clip playback, audit and dynamic motion authoring.

Load `skills/kfb-cartoon-animation_v2.md` for animation/motion work unless the registry supersedes it.

Card Surf base pose should be made geometrically sound in Studio first, then animated in Animation Lab.

### P5 · TinySkies Visual Parity + KFB World Mood

This is a later dedicated visual/world slice, not part of Bath MVP1.

Benchmark `dannylimanseta/tinyskies` against current Travel for:

- vehicle contrails and screen-space speed lines;
- coastline contours, foam and sparkle;
- sky gradients, fog and lighting rig;
- atmosphere, rim, stars, aurora, god rays, lens flare and related VFX;
- intentional KFB deviations versus accidental drift.

Planned KFB extension: deck/JSON-seeded coherent world moods for the 56 cards + cover. Global deck mood should drive a harmonized palette/family, while local biome fields drive spatial variation, props and later NPC/enemy preferences. Mood and biome remain separate axes.

## Booted / parked consumers

### DocCheck Wissens-Pilli / Interactive Microlearning

Status: `UNVERIFIED` project intake. Not an active Travel slice.

Current intended destination:

`georg-doc/kayfabizarro/micro-learning/wissens-pilli/`

Current intake:

`travel/wip/travel_globe_wsa/_inbox/DC MicroLearning WS1/`

The source package establishes a reusable DocCheck medical microlearning direction and a Studio-preparation slice for CapsuleCarl. FrankenStein Studio prepares/exports the actor; the learner runtime owns cards/scene/interaction; Animation Lab is a later motion consumer. No FrizzleBob measurements may be copied into CapsuleCarl merely because the actor vocabulary is shared.

Before implementation starts, promote the project only after its actual runtime/SSOT/start/return contract is created and pinned. See `skills/chat/tool-nodes/wissens-pilli.md`.

### Combat / Stunt

Combat Arena and Stunt Race remain independent implementation SSOTs and consumers of the shared router/skills. They are not merged into Travel. Re-activate only with an explicit slice.

## Cross-project hard decisions

- Prefer coherent vertical playable slices over micro-slices and generic architecture.
- Never silently replace an owner or contract.
- Reuse measured donors before rebuilding.
- Tool sites and project repos reference canonical skills; do not duplicate skill bodies.
- Visible look/feel/timing requires Georg acceptance when the project/slice contract requires that human gate.
- Changelogs and living history are additive; corrections supersede rather than erase.
- Legacy under `skills/` is evidence/history unless the registry marks it current.
- Inbox packages are input/staging; they never become implementation truth by location alone.

## Recovery

If the active lead or execution chat dies, do not reconstruct the conversation from memory. Follow `RECOVERY_PATH.md`.

## Sync

All active chats/agents should follow `SYNC_PROTOCOL.md`. A chat link is not a synchronization mechanism; the central router + project SSOTs are.

## Additive planning history

### 2026-09-13 · DECISION
`skills/chat/` becomes the shared current LLM production router for ChatGPT/Astra and Claude Design.

### 2026-09-13 · DECISION
A durable Living Masterplan and explicit Recovery Path are required so loss of a chat does not lose current sequencing or owner decisions.

### 2026-09-13 · DECISION
Combat Web and other consumer chats synchronize through GitHub state, not copied prompt bundles or direct chat-to-chat assumptions.

### 2026-09-13 · DECISION
A shared intake/staging inbox is supported for cross-project coordination packages. Inbox location never implies project ownership or SSOT status.

### 2026-09-13 · CLASSIFICATION
DocCheck Wissens-Pilli / Interactive Microlearning enters the boot as an `UNVERIFIED` project intake. Its target path and source package are known; implementation/runtime promotion remains pending.
