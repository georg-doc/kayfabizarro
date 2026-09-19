# KFB Fresh Chat Slice Protocol

Status: CURRENT REFERENCE v1.0
Date: 2026-09-19
Owner: Georg / KFB
Purpose: cold starts, parallel web chats, bounded modules and POCs

Use this after `START_HERE.md`, `PRODUCTION_SOP.md`, `CHAT_GITHUB_KFB_STAGE_WORKFLOW.md` and `BOUNDED_PRODUCTION_SLICE_CONTRACT.md`. It helps a chat finish one useful slice independently and hand it back for a compact Work review. It does not create a new owner, SSOT, runtime, architecture or merge right.

## 1. Recover before changing anything

1. Read `START_HERE.md`, `REGISTRY.json` and the relevant router changelog delta.
2. Open the named project/tool SSOT, current Return/Recovery and current branch/PR state.
3. Check the exact default-branch head again immediately before writing.
4. Treat chat memory, links and inbox exports as pointers or inputs; current GitHub state wins for implementation facts.

## 2. Name one bounded slice

Write down five lines before implementation:

- **Goal:** one visible or otherwise verifiable outcome.
- **Owner:** the existing project/tool that owns the result.
- **Source:** exact repository/ref plus named donors.
- **Protected boundary:** what this slice must not replace or retune.
- **Done when:** the smallest real check that proves the slice works.
- **Human review question:** the one visible/human decision this slice is meant to enable.
- **Branch / Stage:** the review branch and fixed Cloudflare Stage target.

If the brief still permits materially different reasonable interpretations after reading the current sources, do not choose one silently. Resolve the ambiguity from owner documents or stop at `INTENT AMBIGUOUS · HUMAN GATE REQUIRED` before implementation.

A module/POC stays a candidate until its receiving owner explicitly accepts it. Do not turn “while here” ideas into hidden extra scope; record them as `DEFERRED` or `PROPOSAL`.

## 3. Work additively

- Use a reviewable branch/PR when that project's contract calls for one.
- Save implementation, evidence and handoff in small checkpoints; after each GitHub write verify the exact branch head.
- Treat timeouts as `UNKNOWN`, inspect before retrying, and never duplicate a commit on assumption.
- Use only a direct `kayfabizarro.pages.dev` route linked from the KFB Hub for human Stage testing.
- Preserve existing working paths; make experiments reversible.
- Reuse pinned donors before rebuilding.
- Keep one writer for movement, camera, actor, audio state, asset truth and deployment.
- Append to changelog/Return. Do not rewrite old outcomes to make the history look cleaner.
- Separate `PROPOSAL`, `DECISION`, `IMPLEMENTATION`, `TESTED RESULT`, public deployment and `HUMAN FREEPLAY / GEORG PASS`.

## 4. Test the thing that changed

Run the narrow static/integration checks first. If the slice changes a visible browser/game experience, also test the actual browser result at the intended size. Save a screenshot or live URL when useful.

Never convert an automated PASS into Georg acceptance. Leave failures and untested paths visible.

## 5. Leave a compact review packet

The repository/PR must let tomorrow's Work session review without replaying the chat:

- repository, branch/PR and exact head;
- one-sentence goal and actual result;
- changed files;
- owners/contracts kept unchanged;
- checks actually run, with counts and environment;
- screenshot/live URL for visual work;
- additive changelog/Return location;
- `UNRESOLVED` / `DEFERRED` items;
- exactly one recommended next gate.

A chat link is optional convenience, not the evidence store.

## 6. Stop conditions

Stop at the current owner boundary when:

- product intent conflicts with current code/contract;
- a different project must change first;
- a visual/medical/play decision needs Georg;
- a destructive migration, promotion or public replacement was not authorized;
- the slice cannot be proven without inventing missing source or evidence.

Return the concrete blocker and the smallest decision needed. Do not fill the gap with a new architecture.

## 7. Recover a failed or repeating slice

If two consecutive repair passes do not improve the same explicit gate, stop implementation before consuming the remaining session on another variation.

- Freeze the current candidate; do not delete or cosmetically rewrite the failed code.
- Apply `templates/CLAUDE_DESIGN_FAILURE_RECOVERY_EXPORT.md` for Claude Design or an equivalent visual authoring environment.
- Export the full editable codebase, data, state, dependency/asset manifest and actual evidence.
- Separate observed failure, proven cause and hypothesis.
- Record a salvage map and exactly one smaller next gate.
- Classify the frozen result as `ARCHIVED_FAILED_CANDIDATE`; it remains an intake/reference, not an owner or SSOT.

A successful export is a recovery result, not proof that the failed visual/game result works.

## Paste-ready cold-start request

> Sync from `skills/chat/START_HERE.md`, `skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md` and `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`, then recover this project's current GitHub state. Complete only the named slice additively. Keep the existing owners and SSOTs. Update the project Return/changelog and leave the standard compact review packet with exact PR/head, actual tests, visible proof, open items and one next gate.
