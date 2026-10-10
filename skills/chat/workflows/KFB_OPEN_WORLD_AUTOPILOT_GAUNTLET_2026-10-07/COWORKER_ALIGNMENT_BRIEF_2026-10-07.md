# Coworker Alignment Brief · KFB Open World Autopilot / Gauntlet 01 · 2026-10-07

Status: **READ-ONLY ALIGNMENT ONLY**
Owner: **KFB WorldBuilder / WB2 · Issue #360**
Planning source:
`skills/chat/workflows/KFB_OPEN_WORLD_AUTOPILOT_GAUNTLET_2026-10-07/START_HERE.md`

## Executor

**Claude Coworker**

## Outcome

Compare the actual local Coworker Open World core against the prepared **KFB Open World Autopilot / Gauntlet 01** contract and return a factual fit/gap map.

Do **not** implement the Gauntlet now.
Do **not** open a new feature wave.
Do **not** alter the current closure candidate merely to fit this planning document.

The purpose is to let the later Anschluss-Integrator consume the real as-built architecture instead of guessing.

## Read first

From GitHub main:
1. `skills/chat/START_HERE.md`
2. Issue #360
3. `skills/chat/KFB_OPEN_WORLD_GROUND_CONTROLS_CANON_2026-10-07.md`
4. `skills/chat/KFB_OPEN_WORLD_CLAY_SURFACE_CANON_2026-10-07.md`
5. `skills/chat/workflows/KFB_OPEN_WORLD_AUTOPILOT_GAUNTLET_2026-10-07/START_HERE.md`
6. `skills/chat/workflows/KFB_OPEN_WORLD_AUTOPILOT_GAUNTLET_2026-10-07/KFB_OPEN_WORLD_GAUNTLET_01_CONTRACT.json`

Read your own current local:
- exact HEAD;
- `RETURN.md`;
- `ARCHITECTURE_AS_BUILT.md` or equivalent;
- current status/freeze-gap notes;
- QA harness / critic evidence;
- current world/player/camera/streaming/service/event-bus source.

## Protected boundary

This pass is inspection only.

Do not:
- rewrite world generation;
- change camera;
- add Authoring/Persistence;
- integrate Track/Sky/Drive/Audio/Resident/Card/Billboard;
- add a QA dashboard;
- add a second runtime/input/camera/player owner;
- create a new Site;
- push a synthetic reconstruction of the local core.

If the local closure pass is still active, finish only its already-authorized closure work.

## Questions to answer from the actual code

### 1 · Real candidate boot / ready seam

Identify:
- real app entry;
- existing ready/boot-complete marker, if any;
- current console/network/error capture seam;
- whether QA can launch the real product without a parallel test app.

Return exact files/functions/events.

### 2 · Normal input path

Identify:
- current single input owner;
- current Ground movement writer;
- current camera owner;
- where normal keyboard/mouse events enter;
- whether an external test driver can feed those same paths without adding another owner.

Confirm current semantics against the binding canon:
`W/S · A/D · Q/E · Shift · Space · RMB drag · wheel`.

If current local behavior differs, report it. Do not redesign it in this pass.

### 3 · Camera occlusion testability

Identify the exact current:
- camera rig function/module;
- occlusion query;
- boom distance/framing logic;
- building/prop collision inputs;
- best factual seam for a deterministic dense-occluder regression.

Report whether the current QA harness can repeatedly drive the known failure case where the camera collapses toward the knight's head.

No camera repair in this alignment pass.

### 4 · Seed / deterministic world recipe

Identify:
- current seed type/API;
- generator version marker, if any;
- how a fixed seed is selected;
- whether the same seed reproduces roads, settlements, props and chunk layout;
- where a future Gauntlet seed should be pinned after intake.

Do not invent a new seed API.

### 5 · Streaming / chunk integration

Identify:
- chunk/ring owner;
- compile/build queue;
- per-frame integration budget;
- stale-result handling;
- current metrics/logs;
- easiest deterministic route for repeated chunk-boundary crossing.

Note any useful Seed World donor overlap, but do not introduce a second streamer.

### 6 · Stable World Object Identity

Issue #360 now treats this as P0 Architecture Freeze work.

From the actual local core, report:
- which buildings/props/trees are merged/batched;
- what semantic recipe/source IDs exist before merging;
- which IDs survive at runtime;
- where an addressable `WorldObjectId` can be introduced without defeating batching;
- current dependencies that would need it:
  - Authoring;
  - Persistence;
  - damage/rebuild;
  - UFO transfer/return;
  - Resident POIs/home bases;
  - interactables.

Do not implement the ID model here.

### 7 · Source isolation + KFB Clay

Report:
- current source-family provenance hooks;
- how the real donor/source object can be shown in isolation;
- current material owner actually used by the local core;
- whether `clay_floor_001` is still being used and where;
- any current K2/Golden module consumption.

Do not equate default KayKit materials with final KFB presentation.

### 8 · Authoring / Persistence insertion points

These are reported absent.

Identify only:
- current world data/recipe representation;
- current transform/terrain mutation seams;
- current service/event-bus hooks;
- where existing Asset Librarian / editor / persistence owners could attach after Architecture Freeze.

No implementation.

### 9 · Existing module insertion points

For each, return only the current factual consumer seam or `NONE`:
- Track Core / Joyride;
- Sky / Environment;
- Vehicle / Drive;
- Audio;
- Resident / ChatterBox;
- Billboard;
- Card / Almanac;
- signature/event modules.

No module integration in this alignment pass.

### 10 · QA evidence storage / critic separation

Identify:
- current QA/evidence folders;
- screenshot/video/log production path;
- current critic isolation mechanism;
- whether a future builder-autopilot loop can write its own repair evidence without contaminating the independent critic packet.

## Required return format

Return exactly:

### A · Identity
- exact local repo/worktree path;
- exact local branch/ref if any;
- exact local HEAD;
- whether anything changed during this alignment pass: expected **NO**.

### B · Fit / gap table

For each:
- READY TO CONSUME
- DONOR/PATTERN ONLY
- ARCHITECTURE FREEZE REQUIRED
- ABSENT
- CONFLICT

Rows:
1. real-app boot/ready
2. normal-input injection
3. camera occlusion scenario
4. deterministic seed
5. chunk/stream integration
6. WorldObjectId
7. source isolation
8. Clay owner
9. Authoring
10. Persistence
11. Track/Joyride
12. Sky
13. Drive
14. Audio
15. Resident/ChatterBox
16. Billboard
17. Card/Almanac
18. evidence capture
19. independent critic separation

### C · Exact insertion map

For every READY/DONOR item:
- file;
- function/class/event;
- current owner;
- what the future Gauntlet may call/read;
- what it must not own.

### D · New facts that should change the planning contract

List only facts proven by the actual local code.

If none:
`NO CONTRACT CHANGE REQUIRED`.

### E · One next gate

Expected:
**Exact Coworker GitHub intake / preservation of the real local core.**

## Stop rule

If the planning contract conflicts with actual local architecture, do not repair the architecture in this pass.

Return the conflict and exact evidence.

No merge. No Site publication. No Live promotion.
