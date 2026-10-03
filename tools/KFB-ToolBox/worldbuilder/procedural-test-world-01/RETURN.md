# RETURN · Procedural Test World 01

Status: **CURRENT WORLD CANDIDATE · R2D BODY/WATER/NATURE/BUILDINGS BROWSER PASS · NO PLAYER · NOT STAGE**

## Human result

The old Travel Globe is no longer the routine movement/combat test environment.

PR #332 is the clean WorldBuilder candidate from current main. It now has:
- continuous R2D island surface;
- visible floating underside;
- Track Core road;
- pond;
- creek;
- waterfall;
- source-proven procedural nature groups from P1/P2;
- the existing WorldBuilder building/facade owner on generated R2D building pads;
- no Travel/card startup;
- no legacy `wi1-play`;
- no local locomotion state machine.

This is the world that the central Motion owner can later attach to after its neutral ActionFigure prototype receives Georg visual PASS.

## Current implementation proof

Tested runtime/browser head:
`a18846cf8128e3e1facb0b51be0e6aff873d1244`

### Real Chromium / WB2
- **PASS**
- workflow `37092514335`
- job `111115656852`
- artifact `11263101899`
- digest `sha256:74ab7902535bb67aa64fcb5b3f728424c9ce4ba9a87d0ea63cb18176f4d4661b`

Browser facts:
- one WB2 renderer/canvas;
- R2D body depth 25.4;
- 14,400 body vertices;
- underside present;
- pond / creek / waterfall present;
- source-proven procedural nature present;
- Track Core road present;
- existing `kfb-facade-rule-v1` owner active;
- deterministic seed-3 pad count produced **1 placed source-proven building**;
- building facade output: **14 windows / 1 door**;
- remaining B1 donors stay explicitly unplaced rather than forced into invented pads;
- legacy player absent;
- Travel Globe absent;
- card-start absent;
- **0 console errors**;
- **0 page errors**;
- **0 QA problems**.

### Resource Registry
Exact runtime/browser head:
- workflow `37092514368`
- result **PASS**.

### Source suite
Exact runtime/browser head:
- workflow `37092514330`
- job `111115656754`
- result **PASS**.

## Building integration repair history

Repair pass 1:
- existing `wd1-city.js` requires `zone.conflicts` as a Set;
- R2D has no conflicts, but the adapter had omitted the empty Set;
- fixed by supplying `conflicts:new Set()`;
- no building owner or grammar changed.

Repair pass 2:
- browser proved one valid generated building pad for seed 3;
- QA incorrectly required exactly two buildings;
- corrected QA to require at least one placed source-proven building and exact parity between placed pads and generated building count;
- island generation was not changed to satisfy the test.

## Why Travel kept regressing

The card module itself was not repeatedly rewritten. The regression amplifier was the old host:

1. Travel `main` stayed on an old product snapshot while later capabilities accumulated on stacked branches.
2. Mobility work kept extending recovery heads rather than a current consolidated product head.
3. Card PDF artwork was historically pumped from a Flight/Sky lifecycle path.
4. Ground/mode changes therefore affected visible card presentation even when the card module stayed byte-identical.
5. Card tests proved owner/source calls, not the full visible integrated presentation after every host lifecycle change.
6. New document roots also exposed relative-path assumptions in the legacy host.

Rule now:
**do not use Travel or another stale multi-purpose prototype as the default neutral integration world.**

Travel remains a later consumer/donor for Flight/cards.

## GitHub cleanup

Closed as donor/history, branches preserved:
- Motion donors #127, #294, #331;
- World stack #307, #311, #313, #316, #319, #322, #323, #327 and design brief #328;
- Resident chat donors #305, #306, #308, #310;
- Hex handoff/bench/ramp donors #317, #318, #320;
- Travel legacy/recovery Mobility PRs #39, #41, #43, #44, #45 in KFB-Travel-Globe.

Current clean entry points:
- Motion: PR #333.
- World: PR #332.
- Residents: #330 / #315 + Coworker narrative recon.

## Future consumer dock

WorldBuilder remains world/support/collision owner.

The future proven player/Drive/Combat consumers attach to existing world facts:
- spawn;
- `baseHeightAt(x,z)`;
- `groundAt(x,z,terrainHeight)`;
- `solidAt(x,z)`;
- `buildingAt(x,z)`;
- Track Core route / support facts.

They do not replace the WB2 renderer/world owner.

## Exactly one next world action

Extend this same current world from one proven island to a **small multi-island corridor** using the existing R2D plan + Track Core:
- keep the current island intact;
- add connected neighbouring islands / bridge route as world data;
- no Player / Drive / Combat yet;
- no Travel host;
- no second world owner.

No Stage/Live promotion yet.
