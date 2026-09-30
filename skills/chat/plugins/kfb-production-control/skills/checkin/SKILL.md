---
name: checkin
description: Persist a deliberate KFB Production Control checkpoint, test result, decision, Return or failure recovery for the current named workflow. Use when the user explicitly asks to check in, persist, secure, save or hand off current work.
disable-model-invocation: true
---

# Check in KFB work

Workflow argument: `$ARGUMENTS`

Use the current bounded slice already established by the conversation or recovered durable state. Do not invent a workflow id. If no exact workflow can be resolved, stop with `WORKFLOW_REQUIRED`.

Before writing:

1. Recover/verify the current owner and source state.
2. If GitHub changed, verify the exact branch head and intended files first.
3. Classify the record as one of:
   - `WIP_CHECKPOINT`
   - `TEST_RESULT`
   - `READY_FOR_INTEGRATION`
   - `RETURN`
   - `DECISION`
   - `FAILURE_RECOVERY`

Write with `kfb_web_checkpoint`.

The body must include:

- owner and protected boundary;
- repo/branch/PR/head when applicable;
- actual result (not intention);
- tests actually run and real counts;
- artifact IDs/SHA-256 where relevant;
- unresolved/deferred items;
- exactly one next gate.

After writing, call `kfb_web_read` for that workflow and verify the new record exists. A timeout remains `UNKNOWN` until this read proves whether the write landed.

Do not deploy, merge or promote Live as a side effect of a check-in.
