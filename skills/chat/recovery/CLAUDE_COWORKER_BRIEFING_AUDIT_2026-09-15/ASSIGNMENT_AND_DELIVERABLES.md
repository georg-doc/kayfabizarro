# Assignment & Deliverables · Claude Coworker Briefing Audit

**Status:** CURRENT ANALYSIS TASK  
**Mode:** audit first; no runtime implementation

## Mission

Perform a hostile review of the two 2026-09-15 briefing failures and design a better briefing system for future KFB work.

The goal is not merely to repair the two specific projects. The goal is to prevent the same class of failure when ChatGPT/Claude/Fable/Astra/Codex hand work to one another.

## Required method

### Pass 1 · Literal Executor Simulation

Read each original brief without rescue docs.

Write down exactly what a competent literal executor would believe is:

- mandatory;
- optional;
- deferred;
- unspecified;
- safe to omit;
- safe to reinterpret;
- evidence needed for PASS.

Then compare that prediction with what actually happened.

### Pass 2 · Source/Coverage Audit

Build a matrix:

`source decision / source fact → original brief wording → preserved? weakened? missing? contradicted? → downstream consequence`

Do not stop at named features. Include:

- visual identity;
- interaction sequence;
- world/set inventory;
- actor presentation owner;
- responsive behavior;
- failure/loading states;
- audio ritual;
- human approval timing;
- cost/continuation rules.

### Pass 3 · Evidence-Gate Audit

For every PASS in the incidents, ask:

> What exactly did this test prove, and what did it leave completely unproven?

Especially inspect the Birthday discrepancy where automated/critic PASS coexisted with Georg rejection.

### Pass 4 · Cost-Amplification Audit

Identify which briefing/process defects caused expensive work to continue too long.

For each, propose a cheaper falsification point.

Examples to evaluate:

- first meaningful frame;
- world-standing inventory frame;
- cold-load interaction capture;
- literal-executor simulation before build;
- accepted visual reference before integration;
- maximum autonomous work chunk before human review.

### Pass 5 · Template Synthesis

Create a general template that is concise enough to use but complete enough that compression does not erase intent.

The template should not become bureaucratic meta-clutter. It must help the builder build the right thing, not merely generate more documentation.

## Mandatory questions

Answer these explicitly:

1. What were the **top five** briefing mistakes in the ToolBox incident?
2. What were the **top five** briefing mistakes in the Birthday incident?
3. Which failure patterns were common to both?
4. Which ChatGPT Lead rules were actually good but applied incorrectly?
5. Which rules should be deleted because they encourage over-briefing or false confidence?
6. What is the minimum brief that still protects product identity?
7. What belongs in the execution brief vs a separate source/coverage matrix?
8. What belongs in the product UI vs only in QA/docs?
9. When should a visual builder/Fable/Claude Design be used before Astra/Codex?
10. What should trigger an immediate STOP rather than another repair loop?
11. How should model/tool routing account for weekly limits and expensive autonomous runs?
12. How should external critic roles be bounded so red-team review does not itself become a token sink?
13. How do we preserve current owner/contracts without making architecture cautions louder than the user-visible goal?
14. How should `P0` be defined so a vertical slice may simplify implementation depth without deleting product identity?
15. What evidence must exist before a merge-ready claim is allowed on experiential work?

## Required deliverables

### 1 · AUTOPSY_BIRTHDAY.md

Include:

- original brief defects;
- predicted literal build;
- observed PR #8 result;
- false/insufficient gates;
- missing identity-bearing requirements;
- cost-amplifying decisions;
- exact replacement rules.

### 2 · AUTOPSY_TOOLBOX.md

Include:

- wrong source hierarchy;
- Pilot/Carl promotion;
- roster/feature coverage failure;
- visual-source failure;
- why rescue then produced meta/clutter overload;
- how to distinguish functional coverage from simultaneous UI visibility.

### 3 · CROSS_FAILURE_PATTERNS.md

Rank patterns by downstream damage and frequency risk.

### 4 · LITERAL_EXECUTOR_TEST.md

A reusable preflight method. It should take less time/tokens than discovering ambiguity through implementation.

### 5 · RED_TEAM_PROTOCOL_vNEXT.md

Define:

- critic roles;
- evidence packet size;
- what each critic may/may not review;
- Synthesizer contract;
- max loops;
- STOP criteria;
- when the protocol is unnecessary.

### 6 · KFB_EXECUTION_BRIEF_TEMPLATE_vNEXT.md

Generic implementation brief template.

It should cover at minimum:

- product promise;
- source hierarchy;
- decision/coverage matrix reference;
- identity-bearing P0;
- exact required inventory;
- experience sequence;
- character/actor life where relevant;
- interaction state machine;
- loading/failure/retry;
- responsive targets;
- audio/SFX where relevant;
- owners/source pins;
- allowed simplifications;
- forbidden omissions;
- evidence per requirement;
- human/freeplay gate;
- model/tool routing;
- cost/stop gate;
- merge rule.

### 7 · KFB_VISUAL_GAME_SLICE_TEMPLATE_vNEXT.md

A specialized concise template for visual/game scenes.

It must include optional but explicit human tests where relevant:

- `Wallpaper test`
- `Screensaver test`
- `Interaction test`

And hard gates:

- `WORLD STANDING`
- `FIRST CLICK / COLD LOAD`
- `CHARACTER LIFE`
- `AUDIO / SFX`
- `RESPONSIVE`
- `GEORG FREEPLAY`

### 8 · MODEL_ROUTING_AND_COST_GATES_vNEXT.md

Use `GPT_WORKFLOW_STRATEGY.md` as input, but improve it.

Separate durable routing logic from volatile product/model availability.

### 9 · RECOMMENDATIONS.md

A short management summary with:

- what to change immediately;
- what not to change;
- what to test on the next GothGirl/Studio slice;
- what to postpone.

## External-agent / role principle

If the environment allows multiple agents/roles, use them as **independent critics**, not parallel implementers.

Suggested roles:

- Literal Executor Simulator
- Intent/Coverage Auditor
- Experience Director
- Production Designer / Set Auditor
- Interaction/Failure-State Auditor
- Technical Contract Auditor
- Cost/Process Auditor

Then one Synthesizer.

Do not give every critic the entire repo by default. Build compact evidence packets.

## Hard-stop test for your proposed template

Before you finish, run your own template through this adversarial question:

> Could a competent literal executor still omit or radically reinterpret something that carries the product's identity, interaction promise, actor integrity or primary user experience and still honestly claim PASS?

If yes, revise the template.

Then run the opposite test:

> Does this template force so much documentation/meta that it recreates the ToolBox clutter problem at the process level?

If yes, simplify it.

The target is **complete coverage with low cognitive and token overhead**.