# KFB Production Flow v2 · Recovery · 2026-09-23

Status: CURRENT RECOVERY FOR PRODUCTION-FLOW CONSOLIDATION

## Für Georg

Wenn dieser Chat abbricht, soll niemand wieder die ganze Geschichte zusammensuchen.

Aktuell gilt:
- der globale Donor-Lock ist konsolidiert;
- Coworker soll produktive Integrationen übernehmen können;
- Claude Design soll geschlossene Produktionspakete bekommen statt lose Micro-Briefings;
- WSA bleibt nur für echte Fähigkeitslücken;
- Travel und Racer laufen separat auf ihren aktuellen Human-Gates weiter.

## Start after context loss

Read:
1. `skills/chat/START_HERE.md`
2. `skills/chat/HUMAN_READABLE_STATUS.md`
3. `skills/chat/workflows/KFB_PRODUCTION_FLOW_V2_2026-09-23/START_HERE.md`
4. `CURRENT_LANES.md`
5. the current PR/Return of exactly one lane.

GitHub state wins.

## Consolidation owner

Repo:
`georg-doc/kayfabizarro`

Branch:
`chatgpt-web/production-flow-v2-consolidation-2026-09-23`

Base at creation:
`main@10f661a542e2553b4d3433bfc5b45dfc1401e660`

## Global process assets on this branch

- `KFB_PRODUCTION_FLOW_V2_2026-09-23/START_HERE.md`
- `PRODUCTION_PACKET_TEMPLATE.md`
- `CLAUDE_COWORKER_ALIGNMENT.md`
- `CURRENT_LANES.md`
- `WSA_HANDOFF.md`
- this Recovery
- `skills/chat/HUMAN_READABLE_STATUS.md`
- `KFB_DESIGN_DONOR_LOCK_V1_2026-09-23/START_HERE.md`
- `KFB_DESIGN_DONOR_LOCK_V1_2026-09-23/MEASUREMENT_EVIDENCE_TEMPLATE.md`

## Source recoveries consolidated

### Claude Coworker
Prior WS0:
PR #187.

Useful lessons retained:
- token-light diff-first review;
- bounded productive integration via Slice/Production Packet;
- direct clickable review artifact;
- plain-language handoff.

Do not use stale #187 current-gate text as production truth.

### Theatre Curtain / Donor Lock
Source recovery:
PR #189.

Rejected candidate:
flat 2D/SVG-style replacement.

Status:
`ARCHIVED_FAILED_CANDIDATE`

Current gate:
restore exact Theatre Curtain v1 donor unchanged.

Global Donor Lock copied byte-identically from PR #189 onto this clean consolidation branch.

## Current lanes at latest check

### WorldBuilder
PR #186
Head:
`7267185cdbdc60e576b946ee589f0b2e932c8c8b`

R2 shared editor:
**HUMAN PASS**

R3 uniform-size convenience:
optional/non-blocking.

Current next functional gate:
**WB2 terrain sculpting**.

### ToolBox
PR #185
Head:
`2833674b36be707fa4d14c8b532faee78ef3ba28`

Current issue:
source/Resident-set consolidation before another broad Claude Design session.

### Travel
PR #38

Accepted runtime default:
`bf0f94362ec8724cc80a4695830622837242ced9`

Accepted review/test head:
`73f6cad995278dd71d961ac8542c1f812c37cfbc`

Human result:
**TMB-2 ACCEPTED · 400 ms**

Post-decision CI:
- `35893561660 / 107291754820`;
- **119/119 PASS**;
- build PASS;
- verify PASS.

Behavior:
- single Space = immediate Ground jump;
- second fresh Space within 400 ms = Flight request;
- no same-event Flight action leak.

No active Travel human gate.

TMB-3 intentional landing:
**HOLD until Georg explicitly opens it.**

### Racer
PR #33
Head:
`f8f29f7b742e0b18fd9887398cd6bb4b7c320a32`

Runtime/test:
`b48ba46bb23e656cad968cb347bde7aa4bd445c4`

Technical:
**17/17 PASS**

Current human gate:
R3c closed track body + rounded frames.

### Curtain
PR #189
Head:
`dfd39255811e6f5b7cdde4092beb753d2b40713b`

Current gate:
D0 exact v1 donor restore.

## Production direction

Do not launch another broad Claude Design run from loose prose.

First create a Production Packet.

Preferred next productive consolidation:
- Coworker/Web closes functional/source seams;
- Claude Design receives one coherent artifact brief;
- Georg reviews the coherent result once;
- WSA only if a real capability gap remains.

## Exactly one next control-plane gate

Finish central routing:
- Production Router;
- Web-first workflow;
- Recovery Path;
- Hub current entry.

Then open one Draft PR for this consolidation and stop.

No runtime merge/promotion in this control-plane slice.


## Blender MCP production lane

Current proof:
PR #192
`claude/blender-mcp-animation-poc-2026-09-23@b49fb6e1adde070d658e1cc21dadb3294164cb29`

Clown JUG-P1:
- reproducible Blender Python;
- GLB;
- GIF;
- deformed-mesh clearance checks;
- Georg visual PASS ~80 %;
- browser playback still open.

Current live authoring:
Orc Warband performance in Blender MCP.

Onboarding:
`BLENDER_MCP_PRODUCTION_ONBOARDING.md`

Continuation prompt:
`BLENDER_MCP_WARBAND_CONTINUE_PROMPT.md`

Do not restart the active Warband session because of recovery.
At the next meaningful checkpoint require:
- editable .blend;
- reproducible script where practical;
- GLB/GLTF;
- preview;
- source/measurement record;
- Return.

Blender remains authoring, not gameplay/runtime ownership.


## Racer recovery override · R3d

Current Racer truth:

- PR #33
- branch `chat/racer-tarch0-sp13ktra-2026-09-23`
- docs/recovery head `05b3cf357b022d75ff4f7433f5ee51ed474f9b49`
- runtime/test head `dad35bdf0f3e19fdc2c5902e154140353db590f9`
- **24/24 PASS**
- Cloudflare deferred

Current gate:
**R3d visual review only.**

If Georg accepts R3d:
next slice is **Vehicle Grounding / Contact**.

Do not restart track/barrier architecture unless R3d visual review finds a concrete remaining architecture defect.

Recovery caveat:
the R3d review HTML is referenced by filename/hash in GitHub but is not itself persisted in the tree or CI artifact. Regenerate from the pinned runtime head if the old chat attachment is unavailable.
