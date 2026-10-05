# KFB Independent Execution Guard Contract · 2026-10-05

Status: **CURRENT BINDING CROSS-PROJECT ORCHESTRATION RULE v1.0**
Owner: Georg / KFB
Applies to: substantial integration, Work/WSA, One-Shot, cross-repo runtime, productive recovery and promotion candidates.

## Purpose

Do not let one LLM both create a change and certify, classify or globally stop its own work.

The production loop separates four responsibilities:

1. **Builder / Integrator** — the only production writer.
2. **Integration Tester** — produces factual runtime evidence.
3. **Independent Critic** — evaluates the candidate independently and writes no production code.
4. **Production Guard** — classifies failures and alone authorizes CONTINUE / REPAIR / QUARANTINE / HUMAN_DECISION / STOP.

A single agent may run local smoke tests while building. It may not accept its own modification or promote its own local failure into a global stop.

## Prime rule

**STOP requires demonstrated blockage of the named product outcome. A failed test is not proof of product blockage.**

Default for a One-Shot is:

**CONTINUE.**

## Role boundaries

### Builder / Integrator

May:
- modify the receiving branch;
- run local/static smoke tests;
- repair issues authorized by the Guard;
- persist checkpoints and evidence.

May not:
- certify its own change as accepted;
- classify its own failed test as a CORE_BLOCKER;
- promote its own candidate to human-ready/live;
- decide the whole One-Shot must stop because one local test failed.

### Integration Tester

Prefer deterministic/browser-native tests where possible.

Produces facts such as:
- boot/load result;
- console/network errors;
- end-to-end state transitions;
- save/reload/import;
- exact source/runtime owners;
- screenshots/video/metrics;
- named fixture results.

The Tester does not decide product impact.

### Independent Critic

Receives:
- exact candidate head;
- named product outcome;
- accepted source/reference stack;
- Tester evidence and actual runtime captures.

Returns:
- observed failures;
- severity evidence;
- product-impact ranking;
- likely shared cause;
- repair recommendation.

The Critic writes no production code and may not accept a repair it authored.

### Production Guard

Receives the product outcome + Tester evidence + Critic result.

The Guard alone classifies each failure as:
- **CONTINUE**
- **REPAIR**
- **QUARANTINE**
- **HUMAN_DECISION**
- **STOP**

The Guard must freeze the **smallest failing seam**.

A local failure becomes STOP only when the Guard can show that the named outcome cannot meaningfully proceed or be evaluated without that seam.

## Two-repair rule · scoped correctly

After two non-improving repair passes:

- if the smallest failing seam is not outcome-critical → **QUARANTINE it and CONTINUE**;
- if it is genuinely outcome-critical → **STOP that outcome path and produce recovery evidence**.

Never interpret “two failures” by itself as permission to stop the whole One-Shot.

## Self-review prohibition

No agent may both:
1. materially change production code/design; and
2. issue the final acceptance/classification for that same change.

If a Critic or Guard is ever forced to write production code, its previous review authority for that change expires and a fresh independent reviewer is required.

## Mandatory briefing block

Every substantial Integration / Work / WSA / One-Shot brief must include this compact block:

```
INDEPENDENT EXECUTION
Outcome:
Builder:
Integration Tester:
Independent Critic:
Production Guard:
Only production writer:
STOP authority: Production Guard only
Two-repair scope: smallest failing seam
Human gate:
```

Do not duplicate the full contract inside each brief. Reference this file.

## When this is mandatory

Mandatory for:
- Work/WSA substantial implementation;
- One-Shot integration;
- cross-repo integration;
- World/Combat/runtime convergence;
- productive Site recovery that can overwrite an existing Site;
- merge/promotion candidate preparation.

Optional for:
- read-only research;
- trivial documentation edits;
- tiny isolated low-risk Web slices.

## Human authority

Georg remains final product/visual authority.

The Guard prevents unnecessary interruption; it does not override an explicit Georg PASS / TUNE / FAIL or destructive-action decision.

## Core shorthand

**Builder builds. Tester measures. Critic judges. Guard routes. Georg accepts.**

**Product outcome > local gate. Freeze the smallest failing thing. Continue unless the outcome itself is blocked.**


## Cost / execution shape · critic and guard are not extra Work jobs

The role split is a **separation of authority**, not a requirement to spawn separate expensive Work sessions.

Default implementation inside one substantial Work/WSA run:
- Builder works normally.
- Tester runs deterministic/browser/native evidence as part of the same run.
- Critic is a short independent read-only review pass over the exact candidate/evidence.
- Guard is a short independent read-only routing decision over the Critic/Test result.
- Then the Builder continues or publishes as routed.

Do **not** create a separate user-facing job, briefing, Site, PR, or human gate merely to run the Critic or Guard.

Do **not** delay publication of an already-correct candidate for a large standalone critique cycle.

For low-risk or tightly bounded publish/recovery tasks, the Critic/Guard check should be proportional:
- source identity check;
- required feature/freshness check;
- obvious regression check;
- route `CONTINUE/PUBLISH` or one bounded repair.

If the exact donor is already pinned and the required change is only to apply that donor plus current data, the Critic does **not** redesign, rescore the whole product, or reopen settled architecture.

Use a separate external/model session only when:
- the current environment cannot provide an independent context;
- a high-risk promotion/destructive action requires stronger separation;
- Georg explicitly requests it.

The goal is to **reduce** Work cost and self-review risk, not multiply agents or ceremonies.
