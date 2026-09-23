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


## 2026-09-23 · Hub hygiene + human-readable communication

### USER DIRECTION
Georg wants technical agent language translated back into short, clear language he can act on. The Hub also contains too many old/current-looking briefings and can misroute future chats.

### COMMUNICATION
Added global `skills/chat/HUMAN_READABLE_STATUS.md`.
Coworker and Web-facing handoffs now lead with a short plain-language explanation; technical labels/SHAs are secondary.

### HUB CLEANUP
Hub TODOs reduced from 36 to 8 active items.
Default current Briefings reduced to an explicit 6-item allowlist.
Older briefing cards are retained as reference but show `REFERENCE · VERIFY CURRENT`; copied stale prompts carry an execution warning.
Dated 18 Sep quick links were replaced by current WorldBuilder #186, Travel #37, Racer #33, ToolBox #185 and Production Router links.

### EVIDENCE
Hub JavaScript syntax compile check: PASS.
Cloudflare publication: not run.


## 2026-09-23 · Long-chat recovery + WSA workshop setup

### USER DIRECTION
Keep this long Web Lead chat recoverable and prepare the next useful WSA/Work workshop so the new Web/Coworker/Design split survives into Work.

### RECOVERY
Added `RECOVERY.md` with:
- current coordination owner;
- current project PRs/gates;
- Coworker review/integration lessons;
- existing `kfb.scene-patch.v1` correction;
- Hub hygiene state;
- capacity-aware routing;
- one next coordination gate.

### WSA SETUP
Added `WSA_INTEGRATION_WORKSHOP_SETUP.md`.

New rule:
WSA receives only a prepared integration slice with exact heads, owners, closed scope, already-run tests, human review where applicable, one WSA-only capability, one smoke gate and one stop condition.

Ordinary review/debug/adapter work stays Web/Coworker.

### CAPACITY STRATEGY
Georg reports a refreshed Claude usage window. Treat this as an opportunity to use Coworker/Design more heavily where they fit, but do not hard-code quota dates or make capacity the owner decision.

### CURRENT TRAVEL UPDATE
Travel PR #37 is now `HUMAN_ACCEPTED · TMB-1E CLOSED`.
Accepted head:
`603f2a9e8fb2c8efd1008ed67607cf7a712de0bd`.

Next Travel gate:
`TMB-2 · Ground → Flight Double-Space ownership handoff`.

Hub working source and Coworker sprint matrix were refreshed accordingly.

### PUBLICATION
No Cloudflare.
No merge.


## 2026-09-23 · Direct clickable human review links

### USER DIRECTION
Georg should never have to search a PR, Hub or ToolBox preview catalogue to find the HTML he is being asked to review.

### RULE
Every visual/browser human gate must provide the direct clickable review artifact in the same chat reply.

GitHub/Hub links are secondary evidence/navigation only.

Persisted in:
- `skills/chat/HUMAN_READABLE_STATUS.md`;
- `REVIEW_HTML_SOP.md`;
- `HUB_HYGIENE.md`;
- WS0 Return.

### CURRENT EXAMPLE
WorldBuilder PR #186 R2 review is being delivered directly in chat from the exact pinned review source at head:
`37b7498181dc4c83b9e7a40962922c003bd20cfd`.

No Cloudflare required.
