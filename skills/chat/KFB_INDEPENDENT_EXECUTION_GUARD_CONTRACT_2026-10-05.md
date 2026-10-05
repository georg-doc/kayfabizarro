# KFB Independent Execution Guard Contract · 2026-10-05

Status: **CURRENT BINDING ORCHESTRATION RULE v1.2**
Owner: Georg / KFB
Applies to: substantial Integration / Work / WSA / One-Shot / productive recovery / promotion candidates.

## 1 · First principle

This is a **separation of authority**, not a requirement to create extra Work jobs.

Default inside one substantial run:
`Builder → Tester evidence → short independent Critic check → short Guard route → Builder continues`

Do not create a separate PR, Site, user-facing job or long critique cycle merely because Critic/Guard roles exist.

Use a separate external/model session only when the current environment cannot provide independent context, a high-risk destructive/promotion action needs stronger separation, or Georg explicitly asks.


### Explicit Georg independence mode · binding

When Georg explicitly asks for an **independent / unwitting / external critic**, the lightweight same-run role split is **not sufficient**.

Required:
- separate fresh context/process/agent invocation;
- no Builder transcript, hidden reasoning, self-score or repair list;
- no production-write permission;
- critic prompt + agent/session identity persisted;
- critic opens the candidate itself where the environment supports product access;
- critic captures its own visual/runtime evidence rather than merely accepting Builder screenshots;
- if real product access or fresh-context separation is unavailable, report `CRITIC_NOT_RUN`; do not substitute Builder self-review and do not route the candidate to Georg as QA-complete.

A common orchestrator may spawn the critic, but the critic's working context must be isolated from the Builder context.

## 2 · Prime rule

**STOP requires demonstrated blockage of the named product outcome. A failed test is not proof of product blockage.**

For a One-Shot the default is:

**CONTINUE.**

## 3 · Roles

### Builder / Integrator
Only production writer.

May build, repair, run local smoke tests and persist checkpoints.

May not:
- accept its own material change;
- classify its own failed test as a global blocker;
- promote its own candidate to human-ready/live;
- stop the parent One-Shot because one local gate failed.

### Integration Tester
Prefer deterministic/browser/native checks.

Produces facts:
- boot/runtime result;
- errors;
- state transitions;
- save/reload/import;
- source/runtime identity;
- screenshots/metrics/fixture results.

Tester does not decide product impact.

### Independent Critic
Short read-only evaluation proportional to the outcome.

Receives exact candidate + evidence + accepted source/reference.
Returns observed mismatch, product impact and one repair recommendation.

Critic writes no production code.

### Production Guard
Short read-only routing decision.

Only Guard may classify:
- `CONTINUE`
- `REPAIR`
- `QUARANTINE`
- `HUMAN_DECISION`
- `STOP`

Guard must act on the **smallest failing seam**.

## 4 · Two-repair scope

After two non-improving repairs on the same seam:

- non-outcome-critical → preserve evidence, `QUARANTINE/DEFER`, **CONTINUE** parent outcome;
- genuinely outcome-critical → stop only that blocked outcome path and create recovery evidence.

Two failures alone never authorize global Product/One-Shot STOP.

## 5 · Self-review prohibition

No agent may both:
1. materially change production code/design; and
2. issue final acceptance/classification for that same change.

If Critic or Guard writes production code, a fresh independent reviewer is required for that change.

## 6 · Heavy critic firewall

The specialized WB2 whole-game critic is **not** the generic Critic:
`skills/chat/workflows/KFB_PLAYABLE_MVP_CONSOLIDATION_V1_2026-09-21/ONE_SHOT_EXTERNAL_CRITIC_LOOP_2026-10-04.md`

Its scoring/gauntlet applies only to WB2 PR #348 unless another current brief explicitly opts in.

For ordinary Site/tool/integration work, use only the short proportional Critic/Guard check above.

## 7 · Mandatory briefing block

Substantial briefs include only:

```
INDEPENDENT EXECUTION
Outcome:
Builder:
Tester:
Critic:
Guard:
Only writer: Builder
STOP authority: Guard only
Human gate:
```

Reference this contract. Do not paste the full policy into the brief.

## 8 · Human authority

Georg remains final product/visual/play/audio authority.
Guard does not override an explicit Georg PASS / TUNE / FAIL or destructive-action decision.

## Shorthand

**Builder builds. Tester measures. Critic checks. Guard routes. Georg decides product questions.**

**Freeze the smallest failing thing, not the whole project.**
