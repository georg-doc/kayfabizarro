# KFB Long-Job / Timeout-Safe Web Chat Protocol · candidate · 2026-09-26

Status: **CANDIDATE FOR WSA APPROVAL · ADDITIVE TO FRESH_CHAT_SLICE_PROTOCOL**

Problem: long research, multi-repo recon, browser QA and workflow waits can terminate the chat before a final Return. A technically successful slice can then become invisible because only chat memory knew what to do next.

Goal: **a useful GitHub recovery point must exist before the expensive part starts.**

## 0 · Trigger

Use this protocol when any one applies:

- research is expected to span more than one bounded source batch;
- multiple repos / PRs / Dropbox sources must be reconciled;
- a browser/workflow/deployment wait is part of the gate;
- implementation + tests + publication cannot reasonably fit in one tiny checkpoint;
- the user explicitly warns about timeouts / `Stream cache expired`;
- the slice has already failed once because the final chat answer disappeared.

Normal tiny edits stay on the regular Fresh Chat Slice Protocol.

## 1 · C0 checkpoint before expensive work

Before broad research, browser runs or large implementation:

1. identify one owner, one branch, one outcome, one next gate;
2. create/reuse the correct branch/PR;
3. write a **small recovery stub**:
   - `JOB_STATE.json`
   - `RECOVERY.md`
   - optional `NEXT_CHAT.md`;
4. fetch the exact branch head + the stub back;
5. only then start the expensive job.

Minimum `JOB_STATE.json`:

```json
{
  "schema": "kfb.long-job-state/1",
  "id": "SLICE-ID",
  "owner": "repo/path owner",
  "repo": "owner/repo",
  "branch": "branch",
  "pr": null,
  "state": "ACTIVE",
  "phase": "C0_PREFLIGHT",
  "goal": "one sentence",
  "sourceRefs": [],
  "completed": [],
  "open": [],
  "nextAction": "one concrete action",
  "lastVerifiedHead": null,
  "tests": {},
  "stage": {
    "route": null,
    "status": "NOT_STARTED"
  }
}
```

If the chat dies immediately afterward, the next chat can recover from GitHub without a transcript.

## 2 · Bounded checkpoint phases

Use these phase names consistently:

- **C0_PREFLIGHT** — owner/branch/goal/stub exists.
- **C1_SOURCE** — source census / research batch persisted.
- **C2_IMPLEMENTATION** — implementation checkpoint persisted.
- **C3_EVIDENCE** — tests/browser evidence persisted.
- **C4_PUBLICATION** — Stage wrapper/Hub metadata only, if required.
- **C5_RETURN** — final Return/Recovery/Changelog synchronized.
- **FROZEN_FAILURE** — stop condition reached; candidate preserved.
- **ORPHANED_CLOSURE** — implementation/evidence exists but C5 was not completed.

Every checkpoint:
1. update `JOB_STATE.json`;
2. commit the bounded result;
3. fetch exact branch head + intended files;
4. continue only from that verified state.

## 3 · Research batching

For long web research:

- one batch = one product question or roughly **5–12 useful source reads**, not an endless crawl;
- persist source URLs, classification and receiver immediately after each batch;
- do not wait until the final prose report to save evidence;
- update counts in `JOB_STATE.json`: checked / useful / rejected / failed / timeout;
- broad research stops once current product questions are answered.

A later chat may add another batch. It must not re-run already persisted research unless the source has materially changed.

## 4 · Implementation batching

Prefer:
1. source/donor isolation;
2. implementation;
3. tests/evidence;
4. Return/Hub metadata

as separate checkpoints.

For large file rosters use one closed Git tree/commit where supported; do not create hundreds of one-file commits merely for checkpointing.

## 5 · Browser / workflow waits

Before launching a long browser/CI/publication job:
- implementation head must already be durable;
- `JOB_STATE.json.phase = C3_EVIDENCE`;
- expected workflow/route and success criteria are recorded.

After the call:
- if result returns, persist run/job/artifact facts;
- if the tool/chat times out, state is **UNKNOWN**;
- inspect exact branch/ref/workflow before retrying;
- retry only if the intended run/write is demonstrably absent.

`Stream cache expired` is treated exactly like timeout: **UNKNOWN, inspect first**.

## 6 · Closure sweeper

A receiving lead/WSA recon should flag a slice as `ORPHANED_CLOSURE` when all are true:

- substantial implementation or research exists;
- evidence/workflow is green or otherwise conclusive;
- but one or more are missing:
  - Return;
  - Recovery;
  - Test Report;
  - additive Changelog;
  - Hub/status metadata;
  - named human gate.

Do not rebuild. Run a **closure-only recovery slice**.

Current example:
**Billboard B2b-P1 PR #212**.

## 7 · Recon orphan

Flag `RECON_NOT_FORMALIZED` when:
- source inventory/research exists;
- the user asked for an application/decision analysis;
- but no product-facing memo/brief/receiver classification was persisted.

Do not redo source discovery. Complete only the missing application memo.

Current example:
**KayKit City Builder Bits city-liveliness recon**.

## 8 · NEXT_CHAT must be executable without memory

For any long job still ACTIVE, `NEXT_CHAT.md` should contain:

- exact repo/branch/PR;
- files to read first;
- current phase;
- last verified head;
- exact evidence already complete;
- exact next action;
- forbidden restarts/owner changes;
- one next gate.

No phrases like “continue what we discussed”.

## 9 · Hub / Production Desk behavior

Long-running work should expose state through existing HUB-CTRL/Production Desk when useful:

- ACTIVE / WAITING / LOOK_AT;
- current phase;
- exact PR/head;
- recovery entry;
- human action only when actually needed.

Do not hand-edit generated Hub HTML.

A timeout in a chat must not make a lane disappear from the Hub merely because C5 was never written.

## 10 · Chat-start recovery sweep

For a lead/planning chat that coordinates several parallel slices:

1. inspect current Hub/Production Desk lanes;
2. inspect open PRs updated since the last lead checkpoint;
3. flag:
   - green implementation with no Return;
   - failure-recovery package with no named continuation;
   - research file with no receiver;
   - branch-only brief accidentally presented as main/current;
4. update `ABORTED_WEBCHAT_RECOVERY.json` additively.

This is a lightweight recon, not a full audit of all historical PRs.

## 11 · Stop rules unchanged

- two failed repair passes on the same gate → freeze/export;
- no owner/source invention;
- no automatic merge or Live promotion;
- no public claim without exact `kayfabizarro.pages.dev` verification;
- optional helper CLI absence is recorded once and does not consume the job.

## 12 · Proposed canonical adoption

After WSA review:

1. link this protocol from `skills/chat/START_HERE.md`;
2. add one paragraph to `FRESH_CHAT_SLICE_PROTOCOL.md`: long jobs must perform C0 before expensive work;
3. add `JOB_STATE.json` template under `skills/chat/templates/`;
4. let HUB-CTRL optionally expose ACTIVE/ORPHANED checkpoint state from named lanes.

Do not create a second control plane.

## Exactly one next protocol gate

**WSA approve / tune this protocol, then use it immediately for A1 B2b-P1 closure and A9 City Builder Bits recon.**
