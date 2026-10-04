# KFB Masterplan Addendum · Stunt Race Track Lab

**Date:** 2026-09-17  
**Status:** CURRENT REACTIVATION / ROUTING ADDENDUM  
**Project implementation SSOT:** `georg-doc/KFB-Stunt-Car-Race`

This addendum records a new explicit user-directed Stunt Race slice. It does not replace the project repository's own Recovery, Living Track Lab plan, movement/contact contracts or production runtime.

## DECISION

Georg manually tested the independent true-WebGL Track Lab through v0.5 and wants that direction pursued further. He reports that the raw proof is already cleaner and more immediately fun than the previous Stunt Race approach.

This re-activates Stunt Race as an explicit development lane.

What is promoted:

- route-first track construction;
- true world-space road geometry;
- forgiving chill/fun normal driving;
- volumetric rubber rails + elastic flow-preserving contact;
- KayKit City Builder cars as Track Lab fixtures;
- explicit authored stunt modules layered onto a stable track;
- existing zonal Guided Stunt Driving grammar for difficult modules.

What is **not** promoted:

- the standalone Track Lab as a replacement production runtime;
- a new movement/contact/camera/progress owner;
- KayKit fixtures as an automatic Rover 01 replacement;
- `DEMO AUTO` as production stunt assist;
- copied/derived SP13KTRA source code.

## Recovery

Project recovery:

`georg-doc/KFB-Stunt-Car-Race/RECOVERY.md`

Living sprint plan:

`georg-doc/KFB-Stunt-Car-Race/ChatGPT_web/track-lab/LIVING_MASTERPLAN.md`

Machine-readable status:

`georg-doc/KFB-Stunt-Car-Race/ChatGPT_web/track-lab/WIP_STATUS.json`

Durable v0.5 reconstruction snapshot:

`georg-doc/KFB-Stunt-Car-Race/ChatGPT_web/track-lab/V05_SOURCE_SNAPSHOT.md`

## Current sequencing

1. **T1 Production Track Core** — preserve the accepted Flow Loop as deterministic route/world geometry inside a repo-owned harness.
2. **T2 Chill Flow / Controls / Rubber Contact** — make the good normal-driving feel explicit and test shallow/hard/repeat rail contacts.
3. **T3 Arbitrary-3D Route Frames** — parallel/minimum-twist transport + closed-loop twist correction + authored roll so vertical/inverted geometry is real.
4. **T4 One Loop Vertical Slice** — exactly one real vertical loop + safe bypass + `free → capture → commit → release → recover`.
5. Expand stunt vocabulary only after that gate.
6. Integrate through the existing Stunt Race production owners rather than creating a second game.

## Cross-project note

The existing W7/world-seed direction remains compatible: seed/world-envelope variation may dress scenery/palette/population, but core track geometry, ports, physics, recovery and owner contracts stay deterministic unless explicitly changed later.

## Additive history

The previous central Living Masterplan classified Stunt as parked until an explicit slice. This addendum supplies that explicit 2026-09-17 reactivation. Older text remains historical context rather than being silently rewritten.
