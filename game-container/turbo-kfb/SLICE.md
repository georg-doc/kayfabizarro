# KFB CONTAINER TURBO-01 · Free Roam + KFB Locomotion Spike

Status: EXPERIMENTAL CANDIDATE · NOT SSOT · NOT LIVE
Date: 2026-09-29
Owner lane: georg-doc/kayfabizarro/game-container/turbo-kfb/
Branch: chatgpt-web/kfb-container-turbo-01-2026-09-29

## Goal
Turn the already-fun MIT-licensed Turbo Kart Rally into a KFB game-container candidate without rebuilding its driving feel.

First playable loop:
WALK → ENTER KART → DRIVE / DRIFT / JUMP → EXIT → WALK

Only after this loop works:
CARD PICKUP → RESIDENT → CARD DELIVERY → REACTION / MEMORY

World replacement, WFC, Voxel, Clay and Flight are later consumers, not prerequisites.

## Exact source lock

### Host donor
bridge-mind/turbo-kart-rally@c52aca3f10c7995884c316810cac6514daa40e9c

License: MIT.
Retain copyright/license notice.

Protected host systems:
- src/kart.js driving feel
- src/camera.js chase feel
- src/input.js input path
- src/events.js event bus
- src/config.js shared tuning
- current Race mode remains runnable as regression reference

### KFB locomotion donors
KayKit Motion Lab v1
- tested implementation head: 3ab2a439b013b816e843ea303e7015a26ee2aff8
- existing results: clip binding, foot-contact measurement, phase-sync, speed→timeScale, hysteresis

KCL-M1 Locomotion Sync
- source head: d5c112af24df803462f0a326a85925f34170a5ed
- exact scoped clips: Walking_A / Walking_B / Walking_C / Running_A / Running_B
- no new motion taxonomy or re-measurement unless a concrete consumer mismatch is observed

Initial actor:
ActionFigure · Rig_Medium

## Hard rules
1. Do not rewrite Turbo Kart driving in this slice.
2. Do not create another locomotion lab.
3. Do not invent new walk/run cadence values before consuming the existing measured donors.
4. Exactly one world-position writer is active at a time.
5. AnimationMixer owns presentation only; no root-motion world translation.
6. Race mode stays intact as a control/regression path.
7. No WFC, Voxel, Clay, Residents, Cards or Flight before the walk↔kart loop works.
8. No Stage publication for diagnostics. Human review happens in the actual playable candidate.
9. Two failed repair passes on the same core gate → freeze candidate and export recovery.

## Checkpoint A · Clean donor + EXPLORE mode
Minimum:
- source-exact Turbo Kart donor copied into this candidate lane;
- Race mode unchanged;
- new EXPLORE mode boots directly into the same real world;
- no countdown / laps / results requirement;
- one player kart, AI optional/off;
- free driving and camera still feel like the donor.

Done when:
Race still runs and EXPLORE allows unrestricted driving in the same world.

## Checkpoint B · KFB Ground Consumer
Add one ActionFigure / Rig_Medium using the existing KFB locomotion results.

Required states:
IDLE
WALK
RUN
JUMP_START
AIR
LAND

Required sequence:
idle → walk → run → walk → stop → turn → jump → air → land → keep walking

No new stationary test page.

Done when:
the character can be controlled in the actual EXPLORE world with no obvious foot-slide/double-step/animation-freeze regression.

## Checkpoint C · Enter / Exit Kart
One shared player intent:
ON_FOOT ⇄ KART

Enter:
- nearby kart interaction
- Ground controller stops owning position
- Kart becomes sole movement writer
- actor mounts/hides or uses a minimal seat presentation

Exit:
- safe position beside kart
- Kart input neutral
- Ground controller resumes
- locomotion returns to IDLE/WALK correctly

Done when:
WALK → ENTER → DRIVE → DRIFT → JUMP → STOP → EXIT → WALK works continuously without reload.

This is the first meaningful Georg gameplay gate.

## Checkpoint D · KFB Content Proof
Only after C passes:
- one real KFB card
- one Card pickup
- two KayKit Residents
- one delivery:
  Resident A → player/card → Resident B
- one reaction
- one compact Lean Memory receipt

No generalized quest engine.

## Deferred until D
- Voxel World / procedural world replacement
- Clay look
- Flight
- Autopilot
- WFC districts
- ChatterBox expansion
- Resident routines
- larger deck inventory
- WorldGraph / Infinite Canvas
- Race content expansion

## World strategy after the core loop
The host consumes a WorldSurface-style contract rather than binding gameplay to the original circuit forever.

Candidate future providers:
- original Turbo Kart circuit
- open free-roam island
- KFB Voxel world
- simple procedural/clay island
- later WFC-authored regions

Kart/Walk must not care which provider generated the surface.

## Current next action
Checkpoint A only:
import the exact Turbo Kart donor at c52aca3f... into this branch, preserve MIT provenance, add EXPLORE without changing driving feel, and verify Race regression + Explore free-drive.
