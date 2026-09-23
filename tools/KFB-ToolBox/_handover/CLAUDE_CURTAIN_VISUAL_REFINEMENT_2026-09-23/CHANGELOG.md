# CHANGELOG · Claude Theatre Curtain Visual Refinement

## 2026-09-23 · Prepared Claude Design slice

### USER DIRECTION
- keep the accepted Theatre Curtain v1/Core v2 technical foundation;
- make rod/rail and attachment hardware more cartoon/KFB;
- build a readable side-pull opening;
- add lower-third tieback/swag;
- clean strong-gather crease/line artifacts.

### REUSE
- existing cloth panels;
- existing Verlet/WebGL simulation;
- existing constraints / weighted hem / idle wind;
- existing KFB fabric sets;
- current transition ownership/API.

### DESIGN GATE
Claude returns:
- closed;
- mid-pull;
- fully side-gathered/tied;
- hardware close-up;
- old-vs-refined silhouette.

### STATUS
Docs/design brief only. No runtime, consumer adapter or public Stage update.


## 2026-09-23 · Claude 2D/SVG reconstruction rejected

### HUMAN VERDICT
- current Claude curtain output is **REJECTED · HARD FAIL**;
- it is not donor-identical Theatre Curtain v1;
- visible result uses a flat/2D striped curtain language and an "invisible cord" mock instead of the real physical cloth donor.

### RULE
Loaded:
`skills/session-entry-use-what-works_v1.md`

Relevant rule:
**If a working template exists, copy it. Do not rebuild it.**

### RECOVERY
Added:
- `DONOR_LOCK_USE_WHAT_WORKS.md`
- `REJECTED_OUTPUT_RECOVERY_2026-09-23.md`
- `CLAUDE_RECOVERY_PROMPT.md`
- `CLAUDE_FAILURE_RECOVERY_EXPORT_REQUEST.md`

### NEXT GATE
Exactly one gate:
**show the exact Theatre Curtain v1 donor unchanged.**

No visual refinement, SVG, CSS, Canvas-2D or alternate curtain implementation before Georg confirms the donor.

### STATUS
Current Claude output classified as `ARCHIVED_FAILED_CANDIDATE`.
