# Brief · reconcile the two crisis audits

Executor: **Codex/Work · GPT-6.1 Sol · High reasoning**  
Start only after both independent audit returns exist.  
Mode: read-only planning; no fixes or merges.

## Start message

> Reconcile the completed Sol technical audit and Claude Code repository/process audit. Read both full returns and their evidence, then compare disagreements rather than averaging conclusions. Produce one plain-language KFB recovery baseline and decision packet for Georg. Do not merge, close, edit runtime code or deploy. Use the current GitHub state again before finalizing.

## Required outputs

1. `CURRENT_PRODUCT_REALITY.md`  
   What is playable, what is a tool/test/donor and what is missing.

2. `ACTIVE_OWNER_MAP.json`  
   One current owner per mutable concern, with direct source and receiving consumer.

3. `PR_DISPOSITION_PLAN.md`  
   Ordered `KEEP / EXTRACT / REPAIR / ARCHIVE / BLOCKED / UNKNOWN` plan. No bulk merge shortcut.

4. `SSOT_REPAIR_PLAN.md`  
   Which existing documents must be corrected, retired or routed. Do not invent another permanent master document unless no valid owner exists.

5. `MVP_RECOVERY_PLAN.md`  
   Four bounded, playable production packets in this order unless evidence requires a different dependency:
   - Ground and Drive;
   - Combat;
   - Environment;
   - Living Town.

6. `GEORG_DECISIONS.md`  
   Maximum seven product decisions with context, recommended defaults and visual evidence where applicable.

7. `HUB_RECOVERY_PAYLOAD.json`  
   Plain-language cards for current reality, running jobs, next executor, Georg action and expected visible result.

## Reconciliation rules

- Re-check current GitHub state before accepting either audit's factual claim.
- Prefer the existing receiving owner over a cleaner-looking replacement.
- Prefer extraction to wholesale merge when a branch contains mixed-quality or unrelated work.
- Prefer a small playable loop to another broad platform pass.
- A lower-cost or simpler route is preferred only when it preserves accepted behaviour and regression coverage.
- Keep technical evidence, but do not make Georg operate through it.
- If both audits disagree on a high-impact architecture decision and evidence does not settle it, isolate only that question for an Astra review. Do not send the whole repository to a third general audit.

## Georg gate

Present the reconciled plan before any cleanup or integration work begins. Georg approves:

- the owner map;
- the extraction/archive order;
- the first playable MVP brief;
- any genuinely product-level open choices.

After approval, execute one remediation or MVP branch at a time. Do not combine repository cleanup and gameplay changes in the same pull request.

