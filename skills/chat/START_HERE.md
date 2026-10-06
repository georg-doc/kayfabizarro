# KFB Chat Production Router

Status: **CURRENT ROUTER v1.0**
Date: 2026-10-05
Owner: Georg / KFB

This file is intentionally short. It is a router, not project history.
Historical decisions and superseded states belong in `skills/chat/CHANGELOG.md`, project Returns/Recovery files and Git history.


## CURRENT PRODUCTION OVERRIDE · 2026-10-05 23:20 CEST

A direct Georg product review supersedes the earlier "Surface Recovery closed / two P0 freeplay gates" state.

Current routing:
- **#360 Open World = RUNNING NOW in Claude Coworker.** Georg started a long integration run and reports it currently looks stronger than the previous attempts. Do not start a parallel Work/Astra rebuild.
- **PR #348 = receiving integration contract, not current executor.** After Coworker returns, ChatGPT Work/Astra becomes the Anschluss-Integrator: ingest the exact Coworker result, preserve what works, close missing KFB seams and run fresh-context critic/whole-product gates.
- **#364 Production Hub = PUBLISH_ONLY.** Source is repaired to the accepted Paper/Dark v2 donor and now carries the 2026-10-06 current board; existing Hub Site is still stale until republished.
- **#361 Combat = HISTORY / HOLD.** Failed candidate is evidence only, not a current Today/Next lane.
- **#362 Triplet / ChatterBox = HOLD / NOT TODAY.** Resume only after the Open World integration result shows what dialogue seam remains.
- **Audio PR #365 = separate current listening gate.** It does not mutate the Open World.
- **Resident 3D Performance prep = Blender MCP · PREP ONLY.** Main briefing: `skills/chat/BLENDER_MCP_RESIDENT_PERFORMANCE_CHOREOGRAPHY_PREP_2026-10-06.md`. It may audit/reuse rigs/motions and prepare emotion/reaction + encounter/Fluff choreography, but it must not write the Open World runtime.
- **Resident Performance Event Contract = Web Chat architecture prep.** Main contract: `skills/chat/RESIDENT_PERFORMANCE_EVENT_CONTRACT_PREP_2026-10-06.md`. It adds Pose/Proximity/Micro-motion and Emanata as read-only presentation channels; optional Work review brief exists but no runtime writes are allowed before Coworker return.
- **Resident Life semantic data prep = READY ON MAIN.** Candidate model: `skills/chat/RESIDENT_LIFE_SEMANTIC_MODEL_PREP_2026-10-06.md`; Affect/Emanata map: `skills/chat/RESIDENT_AFFECT_EMANATA_MAP_PREP_2026-10-06.json`; 3-Resident fixture: `skills/chat/RESIDENT_LIFE_VERTICAL_SLICE_FIXTURE_01_2026-10-06.json`. These are proposal data for Architecture Freeze, not runtime truth.

Primary World recovery brief:
`tools/KFB-ToolBox/worldbuilder/procedural-test-world-01/OPEN_WORLD_ONE_SHOT_PRODUCTION_RESET_2026-10-05.md`
with binding integration roster:
`tools/KFB-ToolBox/worldbuilder/procedural-test-world-01/OPEN_WORLD_EXISTING_SYSTEM_INTEGRATION_MATRIX_2026-10-05.md`
on Draft PR #348.

GitHub Issues remain the active job list.

## 1 · Authority order

Use this precedence:

1. explicit current Georg decision;
2. named project/tool SSOT + current Return/Recovery;
3. exact current owner branch/PR/head;
4. current GitHub Issues for active job state;
5. this router and the Active Work Map;
6. historical briefs, changelogs, old Sites and archived candidates.

If two sources conflict, follow the higher authority. Do not invent a synthesis.

GitHub state overrides chat memory.

## 2 · Current operating model

- **GitHub Issues = active job list.**
- **Production Hub = orientation/front door**, not the job database.
- **Production Control = durable decisions/Returns/history.**
- **ToolBox = one specialist-tool router.**
- World Studio, Combat and specialist Sites are products/tools, not dashboards.
- Routine TODO/status changes do **not** require Hub/Cloudflare republishing.

### Executor names are explicit

Never use bare **"ChatGPT"** as the executor in a KFB job, Issue, Hub card, Return or briefing.

Use one of:
- **ChatGPT Web Chat** — cheap/default research, intake, GitHub/admin, data curation, bounded non-Work production;
- **ChatGPT Work/WSA** — substantial implementation, multi-system integration, hard runtime/debugging, Work cloud-computer/Sites operations when actually required;
- **Claude Design** — visual/interaction authoring from pinned sources;
- **Blender MCP** — 3D/rig/animation authoring;
- **PUBLISH_ONLY / Sites-capable executor** — deterministic host publication without reopening engineering.

Executor label = actual execution surface, not model family.

Current portfolio reference:
`skills/chat/KFB_ACTIVE_WORK_MAP_2026-10-04.md`

Surface Recovery was reopened by concrete Georg-visible defects on 2026-10-05.
Current Hub recovery owner: Issue #364.
Current product recovery owner: Issue #360 / WB2 PR #348.
Do not treat the previously published Hub/World/Combat candidates as accepted.

## 3 · Resolve execution mode first

Every task is exactly one of:

- **ONE_SHOT** — one continuous product outcome; internal checkpoints continue automatically.
- **BOUNDED_SLICE** — one named module/repair/POC.
- **RECOVERY** — salvage/restore a failed candidate or route.
- **RESEARCH** — read-only/source/options work.
- **PUBLISH_ONLY** — frozen source; host publication only.

The named execution mode outranks generic slice defaults.

For ONE_SHOT:
- default = **CONTINUE**;
- local failures stay local;
- optional defects quarantine/defer;
- no internal checkpoint becomes a Georg gate by default.

## 4 · Core execution rules

### Outcome first
The named product outcome outranks local tests, diagnostics and proxy artifacts.

### One production writer
One Builder/Integrator owns production writes for the receiving owner.
Parallel research/testing/critic work may be read-only.

### Independent execution for substantial jobs
Read:
`skills/chat/KFB_INDEPENDENT_EXECUTION_GUARD_CONTRACT_2026-10-05.md`

Use:
- Builder / Integrator = only production writer;
- Integration Tester = factual evidence;
- Independent Critic = short read-only evaluation;
- Production Guard = routing authority.

These are roles inside the same run by default, **not separate expensive Work jobs**.

No agent may materially change a candidate and then certify that same change as accepted.

### Stop authority
A failed test is not proof of product blockage.

After two non-improving repair passes:
1. identify the **smallest failing seam**;
2. preserve its evidence;
3. Production Guard decides:
   - `QUARANTINE/DEFER + CONTINUE`, or
   - stop only the blocked outcome path.

Global One-Shot/Product STOP requires demonstrated blockage of the named outcome.

### Reuse before rebuild
Use verified donors and existing owners before creating anything new.
A loaded URL is not source/design proof; show the actual donor/source in isolation when identity matters.

### Crash-safe persistence
Default GitHub checkpoints:
1. coherent implementation milestone;
2. material evidence/test milestone;
3. Return/handoff milestone.

Do not checkpoint every internal test iteration.
After every actual GitHub write, fetch the exact branch head and intended file.

Timeout = `UNKNOWN`. Inspect actual state before retrying.

## 5 · Human gates

Read:
`skills/chat/PRODUCTIVE_REVIEW_GATE_POLICY.md`

Do not manufacture human gates from:
- counters;
- ownership tables;
- technical diagnostics;
- isolated harnesses;
- CI/deployment success.

Use Georg only for a real visual/play/audio/product decision, an irreversible action, or a decision he explicitly requested.

## 6 · Budget / repair proportionality

Read:
`skills/chat/GATE_PROPORTIONALITY_TOKEN_BUDGET_PROTOCOL.md`

Classification:
- `CORE_BLOCKER`
- `ACCEPTANCE_BLOCKER`
- `MINOR / QUARANTINABLE`
- `COSMETIC / DEFERRED`

A local defect does not become a project blocker merely because it is measurable.

## 7 · Site publication

Read:
- `skills/chat/KFB_SITES_FIRST_DELIVERY_POLICY_2026-10-04.md`
- `skills/chat/SITES_PUBLISH_ONLY_CONTRACT_2026-10-04.md`

For Site-capable products:
`GitHub source → product QA → existing GPT Site update → exact Site verification`

Cloudflare is only a downstream mirror/public acceptance surface when actually required.

If engineering is complete and only hosting remains:
`PUBLISH_ONLY`

Use the lowest-cost Sites-capable executor.
Do not redesign in the publish lane.

## 8 · Briefing contract

Keep briefs compact. State only:

- **Executor**
- **Outcome**
- **Owner**
- **Read first / exact source**
- **Protected boundary**
- **Done when**
- **INDEPENDENT EXECUTION** block for substantial Work/WSA/One-Shot jobs

Reference global contracts; do not paste them into every brief.

## 9 · Read order for a production task

1. this router;
2. current GitHub Issue if one owns the job;
3. named project/tool SSOT;
4. current Return/Recovery;
5. exact active branch/PR/head;
6. only the global contract(s) relevant to this task;
7. only the specialist skill(s) actually needed.

Do **not** load unrelated historical workflows merely because they are in the repository.

For bounded slices:
`skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`

For GitHub/publication work:
`skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`

Production control:
`skills/chat/KFB_PRODUCTION_CONTROL_CONTRACT.md`

## 10 · History / recovery

Historical router state:
`skills/chat/CHANGELOG.md`

Registry:
`skills/chat/REGISTRY.json`

If context is lost:
`skills/chat/RECOVERY_PATH.md`

Do not ask Georg to reconstruct an old chat when GitHub can recover the state.

## Core shorthand

**Outcome first. One writer. Tester measures. Critic checks. Guard routes. Georg decides product questions.**

**Freeze the smallest failing thing, not the whole project.**
