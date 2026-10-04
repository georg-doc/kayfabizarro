# Claude Coworker Onboarding · KFB Briefing Audit · 2026-09-15

**Status:** CURRENT ANALYSIS-ONLY ONBOARDING  
**Owner:** Georg / KFB Lead process  
**Do not implement runtime from this package.** Your first task is to audit the briefing failures that already caused expensive downstream waste.

## 1 · Why this package exists

Two large briefing failures happened on 2026-09-15:

1. **KFB ToolBox UI/UX drift** — an upstream brief promoted the wrong prototype/test fixture into the product model. Downstream Design rationally produced the wrong UI direction, then a corrective pass still became cluttered and unusable.
2. **Birthday Startscreen / Astra drift** — a rich, identity-bearing KFB Birthday world was compressed into a reduced technical P0. Automated checks and critic passes went green while Georg still saw a sparse, incomplete, visually wrong and interaction-poor result.

The Birthday attempt alone consumed roughly **12% of Georg's weekly high-end model budget** before the direction was rejected.

Your job is **not to defend prior briefs**. Treat them as failed production artifacts and perform a hostile, evidence-based autopsy.

## 2 · Primary assignment

Read the original briefs **before** the rescue documents and postmortems, so you can experience the ambiguity like a literal downstream executor.

Then answer:

> Given only each original brief, what important part of Georg's intended product could a competent literal executor omit, reinterpret, demote, or overbuild while still claiming success?

For every defect, identify:

`brief wording → plausible literal interpretation → observed downstream consequence → exact wording/process repair`

Do not produce generic advice such as `be more specific`, `align stakeholders`, or `add acceptance criteria` without showing exactly what failed and how the replacement rule would have prevented it.

## 3 · Required outputs

Create durable Markdown deliverables:

1. `AUTOPSY_BIRTHDAY.md`
2. `AUTOPSY_TOOLBOX.md`
3. `CROSS_FAILURE_PATTERNS.md`
4. `LITERAL_EXECUTOR_TEST.md`
5. `RED_TEAM_PROTOCOL_vNEXT.md`
6. `KFB_EXECUTION_BRIEF_TEMPLATE_vNEXT.md`
7. `KFB_VISUAL_GAME_SLICE_TEMPLATE_vNEXT.md`
8. `MODEL_ROUTING_AND_COST_GATES_vNEXT.md`
9. `RECOMMENDATIONS.md`

The templates remain **PROPOSAL** until Georg/Lead explicitly accepts them.

## 4 · Non-negotiable review stance

Be adversarial about the briefs, not about people.

- No score inflation.
- No assumption that `tests pass` means the product passed.
- No assumption that a recent prototype is the product model.
- No assumption that a QA fixture represents the primary user journey.
- No assumption that `P1` means `non-essential`.
- No silent reconciliation of contradictory source docs.
- No implementation until the audit is complete.

## 5 · Status vocabulary

Keep these distinct:

- `PROPOSAL`
- `DECISION`
- `IMPLEMENTATION`
- `TESTED RESULT`
- `GEORG FREEPLAY`
- `DEFERRED`
- `UNRESOLVED`
- `ARCHIVED HISTORY`

Automated or critic PASS is never Georg acceptance.

## 6 · Core future principle to test, not merely repeat

The current Lead postmortem proposes:

> **Coverage before compression. Identity before convenience. Sequence before feature lists. External red-team before expensive implementation.**

Your task is to decide whether this is sufficient, incomplete, or wrong — and replace it with a better system if necessary.

## 7 · Read next

1. [`SOURCE_INDEX.md`](SOURCE_INDEX.md)
2. [`FAILURE_TIMELINE.md`](FAILURE_TIMELINE.md)
3. [`GPT_WORKFLOW_STRATEGY.md`](GPT_WORKFLOW_STRATEGY.md)
4. [`ASSIGNMENT_AND_DELIVERABLES.md`](ASSIGNMENT_AND_DELIVERABLES.md)

## 8 · Copy prompt

> Read `skills/chat/recovery/CLAUDE_COWORKER_BRIEFING_AUDIT_2026-09-15/START_HERE.md` and its read order. Do not implement Birthday, ToolBox or runtime code. First perform a brutally critical briefing audit of the ToolBox UI incident and Birthday/Astra incident. Read original briefs before rescue corrections/postmortems. Simulate a competent literal executor, identify every omission, ambiguity, accidental de-scope, false evidence gate, wrong source hierarchy and cost-amplifying process choice, and connect each defect to the observed downstream failure. Then create improved red-team protocol, KFB execution templates and model-routing/cost gates. Challenge the existing ChatGPT postmortems rather than accepting them as truth. GitHub current state overrides chat recollection; distinguish implementation/tested result/Georg acceptance at all times.