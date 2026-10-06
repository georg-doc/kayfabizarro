# KFB Open World · Ground Controls Canon · 2026-10-07

Status: **BINDING INPUT SEMANTICS · DO NOT RE-DESIGN**
Owner: **KFB Ground movement**
Receiving product: **Open World #360 / PR #348**

Purpose:
remove ambiguity between historical control/audit documents.

## Canonical sources

### Receiving contract
`tools/KFB-ToolBox/worldbuilder/procedural-test-world-01/KFB_LOCO_WB2_PLAYER_01_BRIEF.md`
on PR #348 owner branch.

It explicitly says:
- one Ground movement writer;
- one active camera owner;
- reuse existing KFB Ground-controller behavior/input semantics.

### Ground owner / donor
`travel/wip/travel_globe_wsa/world-builder/ground-controller.js`

Its human-tested browser semantics are:

```
W / S       forward / back
A / D       visible left / right turn
Q / E       strafe left / right
Shift       run
Space       Ground jump
RMB drag    free camera orbit/look
wheel       smooth zoom
```

Important:
- Q = strafe left;
- E = strafe right;
- exactly one Ground movement writer;
- exactly one active camera writer;
- camera does not own player movement.

### Travel Mode Bridge confirmation
`tools/KFB-ToolBox/_handover/TRAVEL_MODE_BRIDGE_V1_2026-09-23/START_HERE.md`

Confirms Ground owner semantics:
- W/S;
- A/D;
- Q/E strafe;
- Shift run;
- Space jump;
- Ground camera;
- support/terrain reading.

## Current Open World application

For the present Coworker closure pass:

### Must preserve
- W/S forward/back;
- A/D turning;
- Shift run;
- existing camera/orbit behavior;
- Space jump if already integrated;
- Q/E strafe if already present/compatible.

### Do not introduce now
- Ctrl/C duck;
- diagnostic rescue keys;
- new camera-relative WASD preset;
- Drive/Flight control remaps;
- new global keyboard owner.

Those belong to separate modes/features and are not part of the current closure repair.

## Jump note

Space is the canonical Ground jump input.

The old PR #348 *first checkpoint* deliberately deferred Jump, but that was a checkpoint-scope limitation, not a different canonical key.

If the current Coworker core already implements Jump:
- keep Space;
- repair presentation/timing only;
- do not invent a new jump key or new input owner.

## Camera note

Canonical donor:
- RMB drag = free camera orbit/look;
- wheel = zoom.

A separate `F = recenter` appears in a Free Roam POC suggested preset, but is **not required canonical Ground input** for this Open World closure.

Do not add F merely to satisfy an older POC document.

## Historical/local docs

If local Coworker files such as:
- `004_Motion_Controller_v0.1.md`
- `AUDIT_controls_S92.md`
- `SLICE-5A-1-PROPS-CONTROLS.md`

conflict with this file or the current PR #348 Ground-owner contract, they are not binding unless they can prove a newer explicit Georg decision.

## Architecture Freeze rule

Later mode transitions must preserve ownership:

```
GROUND owner
  → transition seam
  → DRIVE owner / FLIGHT owner
```

Never let two movement/camera owners listen and write simultaneously.

## Short handoff to Coworker

**Use the existing controls; do not re-design them.**

```
W/S forward/back
A/D turn
Q/E strafe
Shift run
Space jump
RMB drag camera
wheel zoom
```

Preserve current working behavior. The present closure work is defect repair, not a controls redesign.
