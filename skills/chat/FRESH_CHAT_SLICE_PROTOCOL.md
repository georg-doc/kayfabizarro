# KFB Fresh Chat Slice Protocol

Status: CURRENT REFERENCE v1.0
Date: 2026-09-19
Owner: Georg / KFB
Purpose: cold starts, parallel web chats, bounded modules and POCs

Use this after `START_HERE.md`, `PRODUCTION_SOP.md` and `CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`. It helps a chat finish one useful slice independently and hand it back for a compact Work review. It does not create a new owner, SSOT, runtime, architecture or merge right.

## 0. Identify the executor before writing the brief

- **GitHub-capable Web / Work / Codex:** include exact repo/branch/head, allowed files, direct `KFB-Web-Push`, verification and owner/Hub update duties.
- **Claude Design / artifact author without reliable GitHub writes:** do not include commit/push/PR/hidden-repository duties. Provide a closed `KFB-Web-Read` input packet and require a complete downloadable return package.
- **Blender MCP / local authoring:** use the same package return contract; keep restricted raw sources local and return approved derivatives plus metadata.
- **Site-backed intake:** use only a named, tested upload endpoint. A proposed future endpoint is not a delivery mechanism.

The receiving GitHub-capable chat owns ingestion and the durable production write. Never make Georg manually reconstruct the missing provider bridge from chat prose.

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

A module/POC stays a candidate until its receiving owner explicitly accepts it. Do not turn “while here” ideas into hidden extra scope; record them as `DEFERRED` or `PROPOSAL`.

## 2A. Gate proportionality before repair

Before spending a second turn/pass on any discovered defect, apply `GATE_PROPORTIONALITY_TOKEN_BUDGET_PROTOCOL.md`.

Classify it:

- `CORE_BLOCKER`
- `ACCEPTANCE_BLOCKER`
- `MINOR / QUARANTINABLE`
- `COSMETIC / DEFERRED`

A minor actor/asset/axis/attachment/shader issue must not become an MVP blocker unless that exact item is the named acceptance target.

If Georg can resolve the ambiguity faster than another diagnostic pass, ask him.

For `MINOR / QUARANTINABLE`: one diagnostic pass maximum, then quarantine/defer and continue the core slice.

## 2B. Do not manufacture a Georg gate

Apply `PRODUCTIVE_REVIEW_GATE_POLICY.md`.

A fresh chat should normally finish by making the capability usable in its real receiving owner, not by creating a separate review artifact. Technical checks, contract tables, measurement pages and ownership diagnostics are evidence for agents/WSA unless a concrete human product decision depends on them.

Before naming a human gate, state the exact decision Georg can make. If no meaningful decision exists, keep testing automated/internal and continue to the next productive integration.

A clear Georg instruction to proceed closes the current intermediate gate as a **PROCEED PASS**; retain unresolved details without forcing another accept/reject cycle.

## 3. Work additively

- Use a reviewable branch/PR when that project's contract calls for one.
- Save implementation, evidence and handoff in small checkpoints; after each GitHub write verify the exact branch head.
- Treat timeouts as `UNKNOWN`, inspect before retrying, and never duplicate a commit on assumption.
- When human Stage testing is genuinely required, use only a direct `kayfabizarro.pages.dev` route linked from the KFB Hub. Do not create Stage merely because the slice ended.
- Preserve existing working paths; make experiments reversible.
- Reuse pinned donors before rebuilding.
- Keep one writer for movement, camera, actor, audio state, asset truth and deployment.
- Append to changelog/Return. Do not rewrite old outcomes to make the history look cleaner.
- Separate `PROPOSAL`, `DECISION`, `IMPLEMENTATION`, `TESTED RESULT`, public deployment and `HUMAN FREEPLAY / GEORG PASS`.

## 3A. Persist closure before chat prose

For any slice already authorized to write GitHub state, closure is not complete until the durable owner state is written and verified.

In particular, after Georg gives PASS / TUNE / FAIL or asks to “check this in”, “secure this” or continue:
1. update the owner Return / review record / next gate first;
2. verify the exact branch head and intended file;
3. add any required WSA / Work planning note;
4. only then send the compact chat summary.

Do not spend a separate user turn producing paste-ready GitHub text when this chat already has the GitHub connector and permission to persist it.

If the persistence step is still `UNKNOWN`, say only that and inspect the ref; do not create a long handoff that may become the only surviving copy.

## 3B. Continuous crash-safe continuation

Do not wait for slice closure to persist useful state. For an authorized Web/GitHub production slice, every **meaningful durable checkpoint** is GitHub-first:

1. persist a completed implementation step before starting the next substantial step;
2. persist test/evidence results as soon as they change what is known about the candidate;
3. persist Georg decisions, changed next gates and recovery findings immediately;
4. after each write, read back the exact branch head and intended file before continuing;
5. only then send non-trivial chat prose about that checkpoint.

Use the owner's existing `Return`, `Recovery`, `WIP_STATUS`, changelog or PR body. Do not create a second status owner merely for chat continuity.

**Fresh-chat invariant:** after any completed checkpoint, a replacement chat must be able to continue from GitHub alone without reconstructing the preceding conversation. The durable state must identify at least the existing owner, branch/PR, exact verified head, last proven result, unresolved blocker/deferred items and exactly one current next action/gate.

If the chat disappears before the final handoff, the last verified GitHub checkpoint is authoritative and the fresh chat resumes there.

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
- exactly one recommended next productive step or, only when genuinely necessary, one human gate.

A chat link is optional convenience, not the evidence store.

## 6. Stop conditions

Stop at the current owner boundary when:

- product intent conflicts with current code/contract;
- a different project must change first;
- a genuinely decision-relevant visual/medical/play choice needs Georg; technical diagnostics alone do not;
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
