# WSA Lead Handoff · Design Donor Lock / Use What Works · 2026-09-23

**Status:** CROSS-PROJECT PROCESS INPUT · ADDITIVE · NO RUNTIME OWNER CHANGE  
**Recipient:** WSA Lead / Engine-Build-Hosting integration lane  
**Source workflow:** `skills/chat/workflows/KFB_DESIGN_DONOR_LOCK_V1_2026-09-23/START_HERE.md`

## Decision

WSA must not accept a visual/design candidate for implementation merely because:

- Claude produced an editable project;
- screenshots look plausible;
- an export contains many files;
- the candidate has a clean internal architecture.

Before WSA implementation/integration, a donor-based candidate must carry **source lineage + donor proof + measurement evidence + accepted human delta**.

## Why

Recurring KFB waste pattern:

1. a working donor already exists;
2. the next visual/design pass reconstructs it instead of forking it;
3. measurements/behaviour from the donor disappear;
4. WSA/Web then spends time repairing a new parallel system.

The current Theatre Curtain incident is the concrete 2026-09-23 example:

- working donor: real Three.js/Verlet Theatre Curtain v1;
- rejected Claude result: 2D/SVG-style reconstruction with unrelated opening logic;
- correct recovery: discard reconstruction, restore donor, then alter one visible seam.

This must become a global production guard, not a Curtain-only lesson.

## New WSA intake requirement

Before WSA touches a donor-based design, require this packet:

### 1 · Exact donor identity

```
repo:
branch/ref:
head/blob:
file/module:
tested/public evidence:
```

### 2 · D0 donor proof

Evidence that the unchanged donor was visibly/functionally reproduced before redesign.

Acceptable:
- running donor screenshot/video;
- exact runtime snapshot/log;
- source-isolation HTML;
- measurable donor output.

Not acceptable:
- source URL only;
- static screenshot used as reconstruction reference;
- prose claiming "based on v1".

### 3 · Measurement evidence

Use:

`skills/chat/workflows/KFB_DESIGN_DONOR_LOCK_V1_2026-09-23/MEASUREMENT_EVIDENCE_TEMPLATE.md`

For relevant geometry/rig/material/motion values require:
- source;
- revision;
- evidence class;
- visible/active status in donor;
- measurement/output method;
- consumer seam.

Do not let implementation teams rederive known axes, scales, grips, anchors, pivots or timings from screenshots.

### 4 · Fork / seam declaration

```
[FORK] donor file/profile
[COPY] reused block/data
[NAHT] first new line/object/state
[UNCHANGED] donor-owned systems
```

If no seam can be named, treat the candidate as a rebuild until proven otherwise.

### 5 · Human-accepted delta

WSA receives:

- what Georg accepted;
- exact candidate/export;
- one visible difference from donor;
- what remains donor-identical.

Do not infer acceptance from CI or Claude completion.

### 6 · Forbidden rebuild list

Every intake states what WSA must not replace.

Examples:
- renderer;
- cloth solver;
- EyeRig;
- Resident owner;
- Asset Registry;
- movement owner;
- PDF renderer;
- scene graph;
- measured attachment profile.

### 7 · One success check / stop condition

WSA job stays bounded.

If source donor behaviour disappears:
**STOP.**

Do not repair by building a parallel clean implementation.

## WSA behaviour when packet is incomplete

Return:

`DESIGN_DONOR_PACKET_INCOMPLETE`

Name only the missing fields.

Do not:
- fill measurements from memory;
- choose a substitute source;
- simplify the medium/runtime;
- reinterpret screenshots as geometry truth;
- start integration anyway.

## Relationship to current production order

Current Meta order remains:

- WS0 / Claude Design = visual authoring;
- Web = source recovery / code / zero-install review;
- WSA/Work = scarce integration/build/hosting when needed.

The new Donor Lock sits **before all three execution lanes** when an existing donor is part of the request.

It does not move implementation ownership.

## Use-What-Works trigger

If Georg says any equivalent of:

- "use the existing one";
- "one-to-one as template";
- "use what works";
- "don't rebuild it";
- "copy the working version";

then `KFB_DESIGN_DONOR_LOCK_V1` becomes mandatory automatically.

No extra confirmation needed.

## Measurement persistence rule

Measurements are project assets.

Once a measured donor profile is accepted:
- store it in repo/handoff/profile data;
- cite source revision;
- reuse it;
- do not make every new chat remeasure it.

A new measurement supersedes an old one only with:
- reason;
- source;
- method;
- visible/functional proof.

## Failure escalation

First donor-lock violation:
- archive failed candidate;
- return to donor D0.

Second failed repair/recovery pass on same gate:
- STOP;
- preserve candidate;
- create full failure-recovery export;
- return to WSA Lead / Georg.

No third improvised rebuild.

## Current Curtain handoff for WSA

Do not consume the rejected Claude curtain.

Current recovery source:

`tools/KFB-ToolBox/_handover/CLAUDE_CURTAIN_VISUAL_REFINEMENT_2026-09-23/`

Read:

1. `DONOR_LOCK_USE_WHAT_WORKS.md`
2. `REJECTED_OUTPUT_RECOVERY_2026-09-23.md`
3. `CLAUDE_RECOVERY_PROMPT.md`
4. current Return.

Exact curtain donor:

`chat/gds-theatre-curtain-v1-2026-09-20`

runtime:

`game-ready/theatre-curtain-v1/runtime/kfb-theatre-curtain.mjs`

No Curtain design/integration may resume until Georg confirms the unchanged donor is visibly restored.

## WSA Lead next action

Adopt this packet as a cross-project intake guard.

When a future Claude/Web design handoff arrives, first ask:

> **Where is D0 donor proof and the measurement packet?**

If absent, stop before implementation.
