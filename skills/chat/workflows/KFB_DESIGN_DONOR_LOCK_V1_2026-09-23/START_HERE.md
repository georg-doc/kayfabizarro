# KFB Design Donor Lock v1 · Use What Works Preflight

**Status:** GLOBAL DESIGN / IMPLEMENTATION PRECHECK  
**Date:** 2026-09-23  
**Owner:** KFB production routing · applies to Claude Design, Web, WSA/Work consumers

## Purpose

Prevent recurring KFB failure mode:

> a working source/donor exists, but the next design/build slice silently reconstructs it in a different medium/runtime/geometry and then spends tokens repairing the reconstruction.

This workflow operationalizes:

`skills/session-entry-use-what-works_v1.md`

It does not replace that skill. It turns it into a mandatory design/build packet.

## Global rule

**If a working donor exists, the first build output must visibly reproduce that donor before any redesign or extension is permitted.**

No donor proof = no design/build work.

## Applies to

- Claude Design visual authoring;
- Web/Three.js implementation;
- WSA/Work integration;
- ToolBox/Resident/World modules;
- asset/rig/pose/attachment calibration;
- visual effects and transitions;
- scene modules;
- HUD/presentation systems when an accepted donor already exists.

## Forbidden substitutions without explicit product decision

When donor and requested output are of the same product feature, do not silently replace:

- 3D runtime → SVG;
- 3D runtime → Canvas 2D;
- physical/cloth simulation → CSS animation;
- skinned/rigged actor → flat sprite mock;
- existing measured attachment → guessed coordinates;
- existing procedural runtime → screenshot recreation;
- existing renderer/module → lookalike implementation;
- existing tested measurements → fresh eyeballed measurements.

Changing medium/runtime class requires an explicit Georg decision.

## Required gates

### D0 · Donor Restore

Before any modification:

1. load/copy/fork the exact donor;
2. show it unchanged;
3. show the exact source ref/head/blob;
4. reproduce one visible behaviour/output that proves it is the donor.

Examples:
- runtime snapshot;
- donor log line;
- exact visible motion;
- exact measured dimensions;
- source screenshot from the running build.

If the donor cannot be reproduced, STOP and report source failure.

### D1 · Measurement Replay

If measurements already exist, **read them; do not remeasure by eye**.

Prepare `MEASUREMENT_EVIDENCE.md/json` containing only source-supported data such as:

- bounding box / extents;
- scale ratios;
- pivot/origin;
- axis/orientation;
- contact points;
- bone/joint names;
- grip/attachment frames;
- surface targets;
- anchor coordinates;
- camera fit;
- texture/material source paths;
- timing/BPM/phase;
- donor-specific offsets;
- source outputs/log lines that prove these values were actually used.

Every value must identify:
- source file;
- revision/blob;
- whether it was **observed in the working build**, **measured**, **declared only**, or **unproven**.

If code contains a value/path but the feature was disabled/not visible in the donor, mark it **UNPROVEN**.

### D2 · Fork / Naht

Write before editing:

```
[FORK] exact donor file/ref:
[COPY] exact block/module copied:
[NAHT] here the donor ends:
[DELTA] here the new work begins:
[UNCHANGED] donor systems that must remain byte-/behaviour-equivalent:
```

A reimplementation from memory is not a fork.

### D3 · One Delta Zone

First pass changes exactly one visible/functional delta family.

Examples:
- cartoon hardware only;
- brow width anchoring only;
- prop grip only;
- lighting profile only;
- scene composition only.

Do not simultaneously replace source, runtime, geometry, UI and animation.

### D4 · Side-by-side Proof

Return:
- donor unchanged;
- candidate;
- same/similar camera/state where possible;
- one sentence: **what is visibly different**.

No “fixed” or “improved” without a falsifiable visible statement.

### D5 · Human Gate

Georg decides the requested visible/product delta.

Automated PASS does not replace this gate.

## Mandatory measurement table template

Use when geometry/rig/pose/material/timing is involved:

| Item | Value / state | Source file | Revision/blob | Evidence class | Visible in donor? | Consumer may change? |
|---|---|---|---|---|---|---|
| example: actor height | 1.82 units | `...` | `abc...` | MEASURED | yes | profile only |
| example: hand grip | local XYZ/quat | `...` | `abc...` | OBSERVED BUILD | yes | adapter seam |
| example: disabled code | 0.35 | `...` | `abc...` | DECLARED / UNPROVEN | no | do not treat as donor truth |

Allowed evidence classes:
- `OBSERVED_BUILD`
- `MEASURED`
- `SOURCE_FACT`
- `DECLARED_ONLY`
- `UNPROVEN`
- `HUMAN_DECISION`

## Claude Design input template

Every Claude Design slice with a prior donor must receive:

```
USE WHAT WORKS — DONOR LOCK

DO NOT DESIGN YET.

1. Read:
   skills/session-entry-use-what-works_v1.md
   <this workflow>
   <project Return/SSOT>

2. Exact donor:
   repo/branch/head:
   file/module:
   visible proof:
   measurement/evidence packet:

3. Gate D0:
   show the exact donor unchanged.
   No substitutes. No restyling. No simplification.

4. Forbidden until Georg confirms donor:
   <explicit list: SVG/CSS/new renderer/rebuilt geometry/etc>

5. After donor confirmation:
   modify only:
   <one delta zone>

6. Preserve:
   <owner/runtime/measurements/features>

STOP after each human gate.
```

## WSA / Web input template

WSA/Web receives accepted design candidate plus donor lineage:

```
DONOR:
DESIGN CANDIDATE:
ACCEPTED HUMAN DELTA:
MEASUREMENT PACKET:
COPY/FORK POINT:
ADAPTER SEAM:
SYSTEMS FORBIDDEN TO REBUILD:
ONE SUCCESS CHECK:
STOP CONDITION:
```

WSA must not “productionize” by replacing the accepted donor/candidate with a cleaner parallel implementation.

## Failure rule

If a pass violates donor lock:

1. mark candidate `ARCHIVED_FAILED_CANDIDATE`;
2. do not patch it into correctness;
3. return to D0 and donor;
4. preserve failure evidence.

After **two failed repair/recovery passes on the same gate**:
- stop;
- preserve candidate;
- create full failure-recovery export;
- hand back to lead/human gate.

## Token-budget rule

Before spending Claude/Work/WSA tokens, ask:

> Can this outcome be obtained by copying the existing donor plus one named seam?

If yes, repository/source recovery is done in Web first and Claude/WSA receives the closed packet.

Do not spend design context rediscovering:
- source files;
- axes;
- measurements;
- attachment offsets;
- owner boundaries;
- previously accepted UI/runtime behaviour.

## Recovery rule

A dying or fresh chat reads:

1. current project Return;
2. this Design Donor Lock;
3. donor source;
4. measurement packet;
5. latest human acceptance/rejection.

Chat memory never overrides donor GitHub truth.

## Current motivating incident · Theatre Curtain · 2026-09-23

Working donor:
`game-ready/theatre-curtain-v1/runtime/kfb-theatre-curtain.mjs`

Rejected candidate:
Claude Design recreated a flat 2D/SVG-style curtain with custom `openPercent`/“invisible cord” logic despite the donor having proven physical Three.js/Verlet cloth.

Recovery:
discard reconstruction, restore donor unchanged, then make one donor-compatible visual delta.

This incident is an example, not a Curtain-only exception.
