# RETURN · KFB Handmade Joyride Style-01

**Date:** 2026-09-29
**Status:** SOURCE RECOVERY · FREEFORM DESIGN RESULT REJECTED · PLAYCANVAS × T4 RECEIVER LOCK READY · NO RUNTIME CHANGE · NO STAGE

## Owner
- repo: `georg-doc/kayfabizarro`
- branch: `chatgpt-web/kfb-handmade-joyride-style-01-2026-09-29`
- PR: none
- owner path: `game-container/turbo-kfb/design/`
- last verified source/evidence head before this Return update: `9af96f2818a91dac5f1190ae8f5c42644b066bc9`

## Outcome

The Handmade Joyride direction remains valid, but the current freeform Design result is **not an integration candidate** because it did not carry the real T4 track source through.

The recovery now source-locks two separate donors instead of asking Design to reinterpret them:

1. **PlayCanvas Vehicle Physics donor** for the driving/physics comparison.
2. **T4 / TD03 source** for the actual road/track geometry.

The minimum viable KFB “Open World” is deliberately reduced: a few islands/platforms connected by one real source-derived T4 segment is enough for the next proof. A city is not required.

## PlayCanvas donor recovered

User-owned PlayCanvas project:
- `KFB Joyride 01`
- project id `1609943`
- fork of official Vehicle Physics project `643289`
- inspected Dropbox export: `/CLAUDE/KFB Joyride 01_2026_9_29-15_8_46/`

Observed export:
- project/scenes/assets metadata present;
- 205 descendants in the exported `files/` tree;
- original Buggy + Desert donor;
- Ammo `btRaycastVehicle`;
- `vehicle.mjs`;
- `vehicle-graphics.mjs`;
- `follow-camera.mjs`;
- `action-physics-reset.mjs`;
- keyboard/mobile/VR support assets.

No T4 track, KFB World-Core geometry or KFB world assets are present in that export. This is useful: it is a clean driving donor and must not be confused with a failed KFB integration.

Initial physics values are pinned in:
`PLAYCANVAS_T4_RECEIVER_LOCK_2026-09-29.md`

Do not retune them before donor parity.

## T4 source recovered

Current T4 intake exists independently:
- `/CLAUDE/KFB_TRACK_T4_M2_CLAUDE_DESIGN_SESSION_CUT_2026-09-28_r1.zip`

Inspected World-Core T4 files:
- `lab-track/data/td03.stream.json` — **3,784,081 bytes**
- `transition-atlas.v1.js`
- `road-markings.m1.js`
- `road-markings.m2.js`
- `road-markings.m2.json`

### Source discrepancy

World-Core R0A `DONORS.md` names `lab-track/track-look.v5.js`, but the inspected R0A `lab-track/` contains only six entries and does **not** contain that file.

A copy was located at:
`/CLAUDE/KFB Knet-Strecke T3 v3/KFB_KNET_STRASSE_S1_FAIL_2026-09-28/src/lab-track/track-look.v5.js`

Its accompanying postmortem explicitly marks the S1 v1–v3 street design and T3-v3 marking principle as failed. Therefore:
- TD03 stream identity: **retain**;
- stream-frame / `(s,u)` geometry construction technique: **retain**;
- failed city-road / kerb / floating-marking look: **do not promote**.

## Design failure / R1 islands

User result: the current Design attempt is rejected as an integration candidate because it did not reuse the real T4 track.

The later Dropbox concept `WORLD_CORE_R1_ISLANDS_CONCEPT.md` independently records the same R0C root failure:
- custom sweep / stand-in tube instead of Track Core;
- roads cut off at island edges;
- repeated tile/palette logic instead of authored island stories.

R1's useful correction is retained as **concept input only**:
- four-island ring;
- real TD03-format stream;
- T4 strand builds the connection;
- bridges / real tunnel continuity;
- Looping as a deliberate connection.

R1 is not built, tested or accepted.

## Core visual direction retained

- Characters / hero props = **clay-first**.
- World = **mixed handmade materials**, not pure clay.
- Geometry may stay deliberately simple/procedural if material identity makes the construction intentional.
- Race is secondary; Joyride/travel remains the core.
- Existing tracks are Stunt / Scenic / Destruction routes, not discarded race-only content.
- BoardGameBits / Storytelling Map remain later cheap-world options.

## Durable recovery file

Current source lock:
- `PLAYCANVAS_T4_RECEIVER_LOCK_2026-09-29.md`

It supersedes the previous “start another parallel freeform Design exploration” next-gate instruction.

## Protected boundaries

Do not:
- replace T4 with an invented spline/tube/road;
- treat a loaded asset URL as proof that the real donor was used;
- retune PlayCanvas donor physics before parity;
- modify Turbo/Kart runtime, Race v0.8 or Free-Roam physics in this source-recovery slice;
- ask Design to solve movement, camera or physics;
- start Residents, Cards, Lean Memory, Walk↔Drive or a full city before the source receiver proof works.

## Evidence actually checked

Read-only source inspection on 2026-09-29:
- PlayCanvas export metadata and asset/file tree: **PASS**
- PlayCanvas key scripts read directly: **PASS**
- R0A `lab-track/` inventory: **6 entries, complete listing**
- exact TD03 stream present: **PASS · 3,784,081 bytes**
- claimed `track-look.v5.js` absent from R0A package: **CONFIRMED**
- separate T3-v3 copy located and postmortem classification read: **PASS**
- no runtime build, PlayCanvas import, browser driving test or Stage publication performed by this recovery slice.

## Stage / Hub

Planned future route:
`https://kayfabizarro.pages.dev/kfb-hub/stage/playcanvas-t4-pc01/`

**NOT DEPLOYED.**

No KFB Hub card is created for this internal source lock. The next meaningful public surface should be the integrated receiver proof, not another technical diagnostic.

## Deferred

- KFB vehicle graphics swap;
- clay/handmade styling;
- full R1 islands;
- Storytelling Board World / Hybrid Atlas;
- BoardGameBits;
- Residents / Signature Deck / Lean Memory;
- Walk↔Drive;
- Race mode;
- audio/music.

## Exactly one current next gate

**PC-T4-01 · DONOR PARITY + ONE REAL T4 SEGMENT**

Required order:
1. untouched PlayCanvas Vehicle Physics donor runs;
2. one bounded TD03/T4 segment is rendered alone with source range/frame evidence;
3. only then place that one real segment between simple islands/platforms and attempt traversal.

No replacement track. No visual world redesign before this source-lock gate.
