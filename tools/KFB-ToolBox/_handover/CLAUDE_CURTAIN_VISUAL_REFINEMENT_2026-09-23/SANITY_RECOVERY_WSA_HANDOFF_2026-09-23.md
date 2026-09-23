# SANITY / RECOVERY / WSA HANDOFF · Theatre Curtain + Global Design Donor Lock

**Date:** 2026-09-23  
**Repo:** `georg-doc/kayfabizarro`  
**Branch:** `chatgpt-web/claude-curtain-visual-refinement-2026-09-23`  
**Draft PR:** #189  
**Status:** RECOVERY ONLY · REJECTED CLAUDE CANDIDATE · GLOBAL PROCESS GUARD PREPARED

## 1 · Why the previous chat appeared to abort

Repository sanity shows **no lost or unknown GitHub write** at the interruption point.

Before the interruption, the following files had already been committed successfully:

- `DONOR_LOCK_USE_WHAT_WORKS.md`
- `REJECTED_OUTPUT_RECOVERY_2026-09-23.md`

Subsequent branch history also contains:

- `CLAUDE_RECOVERY_PROMPT.md`
- `CLAUDE_FAILURE_RECOVERY_EXPORT_REQUEST.md`
- updated `START_HERE.md`
- updated `RETURN.md`
- updated `CHANGELOG.md`
- central Router/Hub recovery status.

Branch head and PR head matched during sanity check.

Therefore the interruption was **not a GitHub timeout / unknown-write case**. The chat/tool flow stopped after successful repository writes and before the global WSA/process handoff had been completed.

No retry of an uncertain write was needed.

## 2 · Human verdict

Current Claude Design curtain candidate:

**REJECTED · HARD FAIL · ARCHIVED_FAILED_CANDIDATE**

Visible issue:
a new flat 2D/SVG-style curtain system was created instead of using the proven Theatre Curtain v1 donor.

Do not patch this candidate.

## 3 · Exact working donor

Donor branch:

`chat/gds-theatre-curtain-v1-2026-09-20`

Donor runtime:

`game-ready/theatre-curtain-v1/runtime/kfb-theatre-curtain.mjs`

Donor Stage adapter:

`kfb-hub/stage/game-dev-studio/theatre-curtain-v1/lab.mjs`

Donor Stage shell:

`kfb-hub/stage/game-dev-studio/theatre-curtain-v1/index.html`

Proven donor features:
- two real Three.js cloth panels;
- CPU Verlet/WebGL cloth;
- structural/shear/bend constraints;
- weighted hem;
- real physical folds/gathering;
- rail/rings;
- real KFB PBR fabric maps;
- open/close/impact/reset;
- runtime snapshot/API evidence.

## 4 · Exactly one Curtain next gate

**D0 DONOR RESTORE ONLY**

Claude/any design tool must first show the exact v1 donor unchanged.

No:
- visual refinement;
- cartoon rod redesign;
- tieback;
- swag;
- new opening logic;
- SVG/CSS/Canvas curtain;
- new cloth runtime.

Stop after the unchanged donor is visibly back and wait for Georg.

## 5 · Global process rule created from this incident

New cross-project workflow:

`skills/chat/workflows/KFB_DESIGN_DONOR_LOCK_V1_2026-09-23/START_HERE.md`

Measurement packet:

`skills/chat/workflows/KFB_DESIGN_DONOR_LOCK_V1_2026-09-23/MEASUREMENT_EVIDENCE_TEMPLATE.md`

Required order:

`D0 donor unchanged → D1 measurements/source outputs → D2 fork/seam → D3 one delta → D4 side-by-side proof → D5 human gate`

This is mandatory when an existing working donor is part of the request.

## 6 · Measurement rule

Measurements are durable project assets.

Do not rederive from screenshots when any of the following already exist:

- axes/orientation;
- scale;
- bounding boxes;
- pivots;
- attachment offsets;
- hand grips;
- surface/contact points;
- rig/joint mappings;
- timing/BPM/phase;
- material/texture paths;
- camera framing;
- tested profile values.

Each persisted value must name:
- source file;
- revision/blob;
- evidence class;
- whether it was visibly active in the working donor.

Existing code that was disabled/unseen is **UNPROVEN**, not accepted donor truth.

## 7 · WSA Lead handoff

Read:

`skills/chat/masterplan/WSA_LEAD_HANDOFF_DESIGN_DONOR_LOCK_2026-09-23.md`

WSA intake now requires:
1. exact donor identity;
2. D0 donor proof;
3. measurement evidence;
4. fork/seam declaration;
5. human-accepted delta;
6. forbidden rebuild list;
7. one success check / stop condition.

If incomplete:

`DESIGN_DONOR_PACKET_INCOMPLETE`

Do not silently fill gaps or reconstruct from screenshots.

## 8 · Global routing updated

The Design Donor Lock is routed from:
- `skills/chat/START_HERE.md`;
- `KFB_WEB_FIRST_EXECUTION_V1_2026-09-22/START_HERE.md`;
- `skills/chat/RECOVERY_PATH.md`.

It applies to Claude Design, Web and WSA/Work.

## 9 · Failure escalation

First donor-lock violation:
- archive failed candidate;
- return to donor.

Second failed recovery pass on same gate:
- STOP;
- preserve candidate;
- create full failure-recovery export;
- return to Lead/Georg.

No third improvised rebuild.

## 10 · WSA Lead next action

Adopt the Design Donor Lock as a cross-project intake guard.

For Curtain specifically:
do **not** consume the rejected Claude project.
Wait for / demand unchanged donor restoration first.

For future design handoffs:
ask first:

> **Where is the D0 donor proof and the measurement packet?**
