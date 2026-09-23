# KFB Claude Coworker WS0 · START HERE · 2026-09-23

Status: **WS0 ONBOARDING · REVIEW / INTEGRATION-PLANNING / BOUNDED IMPLEMENTATION**
Owner: `skills/chat/workflows/KFB_CLAUDE_COWORKER_WS0_2026-09-23/`
Production authority: **existing project owners + Web Lead**
Cloudflare: **OUT OF LOOP by default**

## Purpose

Claude Coworker is a parallel technical production lane for KFB.

Use it to:
- review current code / PRs;
- prepare integration proposals together with the Web Lead;
- turn accepted proposals into small WSA/Work slice briefs;
- implement a bounded GitHub slice when an explicit Slice Card grants that scope;
- generate zero-install Review HTML for Georg without Cloudflare.

Claude Coworker is **not** a new universal runtime owner, project lead, deployment owner or automatic merger.

## Minimal boot order

Read only:

1. `skills/chat/START_HERE.md`
2. this file;
3. `OPERATING_CONTRACT.md`
4. `CURRENT_SPRINTS.md`
5. exactly one task-specific workflow from `WORKFLOWS.md`.

Then read only the named project SSOT / Return / PR head required for that task.

Do **not** sweep repository history, giant housekeeping files or unrelated open PRs.

## Three modes

### 1 · REVIEW
Default.

Read exact PR/head, inspect changed code/contracts/tests and return a concise review.
No runtime changes unless Georg/Web explicitly switches mode.

### 2 · INTEGRATION PROPOSAL
Prepare a source-pinned proposal for Web Lead review.

Output:
- owners;
- exact source heads;
- seam;
- order of operations;
- risks;
- proposed WSA/Work slice;
- acceptance gate;
- forbidden changes.

Status stays `PROPOSAL` until Web Lead aligns it.

### 3 · BOUNDED IMPLEMENTATION
Allowed only from an explicit `SLICE_CARD.md` with:
- owner repo;
- base/head;
- branch;
- one outcome;
- closed file roster;
- tests;
- Review HTML gate;
- stop condition.

No opportunistic cleanup.

## Core execution loop

`READ CURRENT HEAD → DO ONE MODE → SMALL CHECKPOINT → VERIFY HEAD/FILES → REVIEW HTML IF VISUAL → RETURN → STOP`

Never assume a timed-out write succeeded.

## Human review

For visual/browser/3D work:
- use existing Review HTML donors first;
- no Cloudflare for normal iteration;
- no localhost/CLI requirement for Georg;
- visible revision marker;
- exact source pins;
- review failure must not silently replace missing source objects.

Read `REVIEW_HTML_SOP.md`.

## WSA / Work relation

Coworker may **propose** a WSA/Work slice.
Web Lead must align the proposal before it is treated as ready.

Work/WSA remains capability escalation, not the place for open-ended debugging.

## Merge / promotion

Do not:
- merge PRs;
- promote Live;
- publish Cloudflare;
- retarget another owner's default branch;
- overwrite project SSOTs.

Those need the named human/owner gate.

## Current examples

See `CURRENT_SPRINTS.md` for the current Racer, Travel, ToolBox and WorldBuilder branches used to test this workflow.

## One WS0 success condition

WS0 is complete when Claude Coworker can take one current PR and:
1. review it cheaply;
2. emit one Web-aligned integration proposal;
3. optionally execute one explicitly authorized mini-slice;
4. return a reusable zero-install Review HTML when visual;
5. leave exact GitHub evidence without Cloudflare.
