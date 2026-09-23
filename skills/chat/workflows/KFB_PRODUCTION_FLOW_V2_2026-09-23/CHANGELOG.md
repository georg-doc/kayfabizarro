# KFB Production Flow v2 · Changelog

## 2026-09-23 · Consolidation

### USER DIRECTION
Move away from fragmented micro-approval production.

Desired:
- durable donor/source truth;
- measurements as project assets;
- productive Claude/Coworker sessions;
- coherent artifacts;
- direct clickable reviews;
- WSA only for genuine capability gaps.

### DONOR LOCK
Copied byte-identically from Curtain recovery PR #189:
- `KFB_DESIGN_DONOR_LOCK_V1_2026-09-23/START_HERE.md`
- `MEASUREMENT_EVIDENCE_TEMPLATE.md`

The rejected Claude SVG/2D Curtain remains a failed candidate. Exact Theatre Curtain v1 is the donor.

### PRODUCTION FLOW
Created:
- `START_HERE.md`
- `PRODUCTION_PACKET_TEMPLATE.md`
- `CLAUDE_COWORKER_ALIGNMENT.md`
- `CURRENT_LANES.md`
- `WSA_HANDOFF.md`
- `COWORKER_ALIGNMENT_PROMPT.md`
- `RECOVERY.md`

### HUMAN COMMUNICATION
Carried forward:
`skills/chat/HUMAN_READABLE_STATUS.md`

Human review requests must:
- explain the decision in plain language;
- contain the direct clickable review artifact in the same chat.

### MICRO-GATE POLICY
D0–D4 donor/source/measurement checks are internal unless donor identity is disputed.

Default human gate:
one coherent milestone artifact.

### CURRENT LANE REFRESH
WorldBuilder:
- R2 shared editor human PASS;
- WB2 terrain sculpting current next functional gate.

Travel:
- PR #38;
- 119 PASS;
- 240/320/400 ms double-Space timing human choice open.

Racer:
- PR #33;
- R3c current;
- 17/17 PASS;
- closed track body + rounded frames human review open.

ToolBox:
- source/Resident consolidation before broad Claude Design.

Curtain:
- D0 exact v1 donor restore only.

### HUB
Default Hub routing changed to an explicit current allowlist.
Old cards remain searchable/reference history.
Hub JS syntax compile check: PASS.

### WSA
WSA receives a closed Production Packet and one named missing capability.
No missing capability = no WSA.

### TEST / PUBLICATION
Product runtime tests run by this process slice: 0.
Hub JS syntax: PASS.
Cloudflare: 0.
Live promotion: 0.


## 2026-09-23 · Coworker alignment review

### RESULT
Coworker agrees with the coherent-artifact production model and identifies one important requirement:
a Production Packet must have an explicit CLOSED definition so the recipient does not need to guess/search.

### ADOPTED
Added:
- `CLOSED_PACKET_CRITERIA.md`;
- packet status vocabulary;
- zero-required-guessing handoff rule.

### SCALE CORRECTION
Coworker described Scale as an additive contract gap.

GitHub verification clarifies:
- `kfb.scene-patch.v1` already contains `scale:[1,1,1]`;
- old S21 `EDITOR_LAYER.md` lacks Scale only in its visible interaction grammar;
- WorldBuilder R2 free Scale is already human accepted;
- R3 uniform smaller/larger is optional convenience.

Added:
`EDITOR_SCALE_CONTRACT_NOTE.md`

No new persistence schema is needed.

### FIRST PRODUCTIVE CANDIDATE
ToolBox remains the preferred first coherent Production Packet after source/Resident consolidation.
No implementation started by this alignment.


## 2026-09-23 · First CLOSED ToolBox production packet

### RESULT
Created:
`packets/TOOLBOX_SOURCE_SAFE_INTEGRATION_01.md`

Status:
`CLOSED_WITH_HUMAN_GATE`

The packet pins:
- exact Stage-First visual donor by Dropbox file id/revision/content hash;
- exact Studio v18 roster source by Dropbox file id/revision/content hash;
- later saved `kfb.pets/1.2.9` state by Dropbox file id/revision/content hash;
- current FrizzleBob Driver Graft blobs;
- EyeRig / Medium-Large / Legacy profile owners;
- accepted WorldBuilder R2 shared editor commit/blob;
- existing `kfb.scene-patch.v1`;
- exact Resident Atlas source commit/blobs/pins;
- Goth Girl, Orc Warband and Animatronic recipe facts.

### EXECUTOR
Preferred first executor:
**Claude Coworker**

Added paste-ready start:
`packets/TOOLBOX_SOURCE_SAFE_INTEGRATION_01_COWORKER_START.md`

### HUMAN POLICY
No micro-gates during source/adaptor work.
Coworker returns one coherent clickable ToolBox review artifact.

### WSA
No WSA-only capability identified.


## 2026-09-23 · Blender MCP hybrid authoring onboarding

### VERIFIED POC
PR #192 proves a productive Blender MCP animation lane:
- Clown JUG-P1;
- reproducible Blender Python;
- GLB export;
- viewport GIF;
- deformed-mesh clearance checks;
- Georg visual PASS ~80 %.

### DECISION
Blender MCP is now a candidate production authoring lane, not only a fallback.

Use it for:
- pose/animation;
- prop/instrument rigging;
- batch authoring after one source-backed fixture passes;
- precision volumetric mesh work.

It does not own gameplay/runtime/physics.

### CURRENT CONTINUATION
Orc Warband is actively being authored in Blender.

Added:
- `BLENDER_MCP_PRODUCTION_ONBOARDING.md`
- `BLENDER_MCP_WARBAND_CONTINUE_PROMPT.md`

Do not restart the running session.

### DELIVERABLE CONTRACT
Productive Blender slices return:
- editable .blend;
- reproducible script where practical;
- GLB/GLTF;
- preview GIF/MP4;
- source/measurement record;
- Return.

### CURRENT LANE REFRESH
WorldBuilder WB2 now lives on PR #190.
Racer PR #33 has advanced beyond R3c into R3d architecture-cleanup code; current PR body/Return may lag and must be refreshed before human review.
