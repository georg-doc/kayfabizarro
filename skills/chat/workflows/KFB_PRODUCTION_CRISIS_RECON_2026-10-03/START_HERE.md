# KFB Production Crisis Recon

Status: **ACTIVE · READ-ONLY CRISIS REVIEW**  
Date: 2026-10-03  
Product owner: Georg  
Purpose: establish one trustworthy production baseline before any further integration, merge or deployment.

## What this does

Two independent reviewers inspect the same current GitHub state:

1. **Sol 6.1 High** checks the game architecture, existing owners, actual playability and the shortest safe route to four playable vertical slices.
2. **Claude Code / Opus 5.5 High** checks repository health, open pull requests, SSOT conflicts, file-transfer practices and the merge/check-in process.
3. A separate reconciliation pass compares both returns and produces one recovery plan for Georg to approve.

The reviewers do not implement fixes. They first establish what is actually true.

## Why this exists

KFB currently has useful work spread across main, many draft pull requests, session cuts, inbox exports and local authoring tools. Several documents describe older states as current. This has caused:

- duplicated or bypassed runtime owners;
- briefs based on stale or incomplete sources;
- technical test pages presented as playable MVPs;
- repeated timeouts and uncertain writes;
- large ZIP handoffs that should have been manifests or stable source packages;
- user decisions hidden behind hashes, pull-request numbers and measurement tables.

This review stops that cycle before more runtime work is commissioned.

## Binding freeze during the review

Until Georg approves the reconciled recovery plan:

- do not merge or close pull requests;
- do not delete branches or inbox material;
- do not deploy or promote Stage/Live;
- do not change runtime behaviour;
- do not create a replacement SSOT, engine, controller or owner;
- do not start another broad integration slice;
- do not call a technical harness, catalog or test page an MVP.

Already-running bounded design, Blender or research jobs may finish and return evidence. They must not integrate or promote themselves during this review.

## Read first

1. `skills/chat/PLAIN_LANGUAGE_HANDOFF_STANDARD.md`
2. `skills/chat/KFB_PRODUCTION_CONTROL_CONTRACT.md`
3. `skills/chat/recovery/POSTMORTEM_WSA_LEAD_BRIEFING_CONTROL_FAILURE_2026-10-03.md`
4. `skills/chat/START_HERE.md`
5. `skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`
6. `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`
7. `SOURCE_SCOPE.md`
8. the relevant audit brief below

## The three jobs

### Job A · technical integration audit

File: `BRIEF_SOL61_TECHNICAL_INTEGRATION_AUDIT.md`  
Executor: Codex/Work, `gpt-6.1-sol`, reasoning `high`  
Result: a plain-language map of what works, what owns what, what is blocked and the minimum safe path to playable Travel, Combat, Environment and Town slices.

### Job B · repository and process audit

File: `BRIEF_CLAUDE_CODE_REPOSITORY_PROCESS_AUDIT.md`  
Executor: Claude Code, Opus 5.5, reasoning `high`  
Result: a plain-language disposition of open work, SSOT conflicts, branch/merge hygiene and a reliable handoff/check-in system for ChatGPT, Claude, Blender and Claude Design.

### Job C · reconciliation

File: `BRIEF_RECONCILIATION_AND_RECOVERY_PLAN.md`  
Executor: Codex/Work, `gpt-6.1-sol`, reasoning `high`, only after A and B are complete  
Result: one proposed recovery baseline, one merge/extraction order, one SSOT repair plan and four bounded playable production briefs. Georg approves this before implementation starts.

## Georg's action now

Send Job A to Sol 6.1 High and Job B to Claude Code / Opus 5.5 High. No technical choices or file collection are required from Georg during the audits. Questions must be saved for the final reconciliation and limited to decisions that genuinely change the product.

## Expected visible result

The next visible result is not another test world. It is one short control document that says, in ordinary language:

- what is genuinely playable now;
- which work is safe to keep;
- which work must be extracted, archived or repaired;
- who does the next task;
- what Georg will be able to play after each of the next four production slices.

