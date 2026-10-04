# GPT / Agent Workflow Strategy · KFB Production · 2026-09-15

**Status:** CURRENT OPERATING STRATEGY INPUT, not a product-plan entitlement document.  
**Important:** exact model names, plan allowances, quotas and UI availability are volatile. Future chats should verify current product facts before relying on them. The durable part of this file is the **routing strategy**, not subscription marketing details.

## 1 · Core routing principle

> **Do not spend autonomous/high-cost execution budget to discover what the product is supposed to be.**

Separate:

`thinking / specification / previsualization / human acceptance / implementation / QA`

A high-cost builder should multiply an accepted direction, not multiply ambiguity.

## 2 · Practical routing

| Work type | Preferred mode/tool | Why |
|---|---|---|
| Ideas, planning, brief drafting, fast source review | normal ChatGPT chat | cheap iteration, direct human steering |
| Difficult concept/architecture/brief consolidation | GPT-5.6 Sol Medium/High; Extra High only when justified | stronger reasoning without autonomous production overhead |
| Extremely difficult one-off analysis | highest available reasoning/pro model, sparingly | only when the task genuinely benefits |
| Fast current facts | normal web search in chat | do not invoke research agents unnecessarily |
| 20–100 source systematic research | Deep Research | appropriate for source-heavy synthesis |
| Visual lookdev / composition / previsualization | Claude Design / Fable-style visual builder | solve taste/composition before production integration |
| Repository understanding + implementation + tests | Codex or equivalent repo coding environment | code-focused execution |
| Larger autonomous multi-step production | Astra / Work only after gates pass | powerful but budget-expensive and dangerous under ambiguity |
| Connected Drive/Gmail/Calendar/app context | Plugins / connected apps where useful | avoid manual copy/paste |
| Recurring checks/alerts | Tasks / Automations | scheduled/conditional work |

## 3 · Three gates before Astra/Work

Before an expensive autonomous run, all three must be true:

### Coverage
Is it explicit what must exist, what may be simplified, and what may **not** be omitted?

### Reference
For taste-sensitive work, is there an accepted visual/prototype/donor/reference target rather than only prose?

### Acceptance
Can the builder objectively know when to stop, and is the human approval gate placed before expensive continuation?

If any answer is `NO`, do **not** start the expensive autonomous run.

## 4 · Preferred visual/game slice sequence

For taste-sensitive KFB work:

`Chat planning → briefing red-team → Fable/Claude Design lookdev/previs → Georg visual gate → Astra/Codex integration → browser QA → Georg freeplay → merge`

### Fable / Claude Design role

Treat as:

- Art Department
- Production Design
- LookDev
- Previsualization
- interaction concept when useful

Not implementation SSOT.

For living scenes, useful human tests include:

- **Wallpaper test:** Would I want this frame as a wallpaper?
- **Screensaver test:** If no input happens for 30–60 seconds, would I willingly leave this scene running full-screen?
- **Interaction test:** Does the scene make me want to touch/click something?

If Frame fails, do not pay for animation/polish.  
If Frame passes but Screensaver fails, Living World is weak.  
If both pass but Interaction fails, Living UI/affordance is weak.

### Astra / Work role

Treat as:

- production integrator
- autonomous multi-step executor
- browser/process runner
- large bounded implementation worker

Do not ask Astra to simultaneously discover product taste, invent the target and integrate it into the production stack.

## 5 · First-meaningful-frame cost gate

For expensive visual implementation:

> **Georg sees the first meaningful user-facing frame/flow before the model is allowed to spend another large implementation chunk.**

A bad first frame should terminate the direction cheaply.

Do not continue because:

- tests are green;
- code is clean;
- critics passed narrow technical checks;
- architecture is elegant.

## 6 · Briefing red-team cost gate

Before a substantial autonomous build, use small, narrow critics rather than a huge full-context agent swarm.

Recommended preflight roles:

1. Literal Executor Simulator
2. Intent/Coverage Auditor
3. Experience/Sequence Auditor
4. Production Design/Set Auditor where visual/world work is involved
5. Interaction/Failure-State Auditor
6. Technical Contract Auditor

A Synthesizer then repairs the brief.

The critics should receive **small evidence packets**, not the entire repo/chat unless required.

## 7 · Cost discipline

The 2026-09-15 Birthday incident demonstrated that a technically successful autonomous run can still be product-wrong and consume a material fraction of weekly usage.

Future rules:

- no expensive autonomous run on an unreviewed brief;
- no broad continuation after a failed human-facing frame;
- no agent swarm merely because agents are available;
- no repeated full-context reload for micro-decisions;
- use one Builder, narrow critics, one Synthesizer;
- hard-cap repair loops unless Georg explicitly chooses otherwise;
- preserve reusable evidence/decisions in GitHub so new sessions do not spend budget reconstructing state.

## 8 · Current KFB application

### Actor authoring

Current preferred route:

- use **old Studio v17** as functional/calibration workshop;
- prove GothGirl through real Actor/Face/Pose/Motion/Voice workflows;
- build the clean new ToolBox shell only after those workflows are proven.

### Birthday / Town visual scene

Preferred recovery route:

- visual/previs builder first;
- Georg accepts complete world/composition;
- production integrator then reproduces the accepted experience inside Travel without breaking owner contracts.

## 9 · What future templates should encode

A future KFB execution template should explicitly include:

- estimated execution-cost class;
- required human gate before next expensive phase;
- first meaningful evidence artifact;
- maximum autonomous scope before human review;
- whether taste/discovery remains unresolved;
- whether a visual/reference SSOT exists;
- which model/tool is appropriate for each phase;
- fallback if the high-cost environment fails or quota becomes constrained.

## 10 · Strategy shorthand

> **Cheap thinking before expensive acting.**  
> **Visual target before production integration.**  
> **Human gate before autonomous continuation.**  
> **Use high-end models where intelligence changes the outcome, not where cheaper bounded work is sufficient.**