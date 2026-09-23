# KFB Claude Coworker WS0 · Changelog

## 2026-09-23 · WS0 onboarding prepared

### USER DIRECTION
Bring Claude Coworker into the KFB production loop for:
- code reviews;
- Web-aligned integration planning for later WSA/Work slices;
- optionally productive bounded GitHub slices;
- token-light Review HTML / chat-preview / human-acceptance workflow without Cloudflare.

### DECISION
Web remains production lead and current project owners remain authoritative.

Claude Coworker gets three explicit modes:
- REVIEW;
- INTEGRATION PROPOSAL;
- BOUNDED IMPLEMENTATION.

No automatic merge, Live promotion or Cloudflare publication.

### REVIEW INFRASTRUCTURE
WS0 consumes the existing shared Review HTML infrastructure:
- `threejs-focus-review-v1`;
- Review Template Pool;
- Local Preview First SOP;
- human-verified ChatGPT 3D texture-host adapter from WorldBuilder PR #186.

No second review framework is created.

### CURRENT SPRINT INPUTS
Onboarding matrix pins current examples:
- Racer PR #33 / R3b human recheck pending;
- Travel PR #37 / Repair Pass 2 human re-review pending;
- ToolBox PR #185 / Resident-set portability;
- WorldBuilder PR #186 / shared inline editor R2 human review.

All heads must be refreshed before action.

### STRUCTURE
Added:
- START_HERE;
- operating contract;
- workspace structure;
- workflows;
- Review HTML SOP;
- current sprint matrix;
- compact review/integration/slice/return templates;
- materialized output folders for reviews/integration/returns.

### TEST / EVIDENCE
Documentation-only slice.
Runtime tests: **0**.
Cloudflare: **0**.
Work/WSA runs: **0**.

Every GitHub write was followed by branch-head and file readback.

### NEXT
Use WS0 first in REVIEW mode on one current PR; then prepare one Web-aligned integration proposal before authorizing a productive Coworker slice.
