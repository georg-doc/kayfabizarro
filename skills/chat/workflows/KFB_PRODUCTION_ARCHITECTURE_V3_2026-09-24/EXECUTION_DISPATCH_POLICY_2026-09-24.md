# KFB Production Architecture v3 · Execution / Model / Reasoning Dispatch · 2026-09-24

Status: **CURRENT DISPATCH POLICY · BUDGET-FIRST · CAPABILITY ESCALATION ONLY**
Owner: KFB Web Architecture lane

## Purpose

Every self-service briefing must state:
- primary executor/surface;
- recommended current model;
- normalized reasoning effort;
- budget band;
- escalation path;
- what must **not** be used by default.

The stable contract is the **profile id**.
Concrete model names are date-stamped recommendations and may change without rewriting every product briefing.

## Current model snapshot · 2026-09-24

### OpenAI / ChatGPT
Current preferred KFB Web model:
- GPT-5.6 Sol.

Project reasoning labels map to:
- `instant` = quick/mechanical work;
- `medium` = normal implementation/repo work;
- `high` = difficult debugging/architecture/algorithm work.

Do not use Work merely because a task is long.
Use Work only when the job actually needs capabilities such as cloud browser/computer-use or coordinated multi-app execution that normal Web+connectors cannot provide.

### Anthropic / Claude
Current default economical agent/coding recommendation:
- Claude Sonnet 5.

Current deep escalation:
- Claude Opus 5.5.

Use Opus only for a named hard problem or after one focused Sonnet repair attempt fails.
Do not choose Opus simply because the task touches many files.

### Claude Design
Use current Sonnet-class model at normal/medium effort for bounded visual/layout implementation.
Visual Design is not the architecture owner and does not rebuild runtime systems.

### Blender MCP / Claude Code
Use Sonnet 5 at medium effort for deterministic geometry, animation, Blender scripting and normal retarget/bake jobs.
Use Sonnet 5 high for difficult rig/IK/weight diagnosis.
Escalate to Opus 5.5 high only after a focused failure or where the brief explicitly marks `DEEP_RIG`.

## Stable execution profiles

### WEB_FAST

- executor: ChatGPT Web
- model: GPT-5.6 Sol
- reasoning: instant
- budget: LOW
- use for:
  - source lookup;
  - metadata reconciliation;
  - simple registry/brief updates;
  - bounded census;
  - deterministic small transforms with clear owner.
- escalation: WEB_STANDARD
- Work: forbidden by default
- Cowork: forbidden by default

### WEB_STANDARD

- executor: ChatGPT Web
- model: GPT-5.6 Sol
- reasoning: medium
- budget: STANDARD
- use for:
  - most KFB implementation;
  - GitHub-connected multi-file slices;
  - direct HTML/Three.js review artifacts;
  - normal integration against pinned owners;
  - tests + Return.
- escalation: WEB_DEEP
- Work: only capability gap
- Cowork: only if a persistent local/file workspace materially helps

### WEB_DEEP

- executor: ChatGPT Web
- model: GPT-5.6 Sol
- reasoning: high
- budget: HIGH
- use for:
  - solver/physics/debugging;
  - architecture seams;
  - cross-owner migrations;
  - hard root-cause analysis;
  - compact but technically difficult integration.
- escalation:
  - COWORK_STANDARD if persistent workspace/subagents are the actual missing capability;
  - WORK_ESCALATION if computer-use/multi-app/browser automation is the actual missing capability.
- no automatic Pro/Extra-High escalation.

### CLAUDE_DESIGN_STANDARD

- executor: Claude Design
- model: Claude Sonnet 5 if selectable; otherwise current Sonnet-class Design default
- reasoning: medium
- budget: STANDARD
- use for:
  - bounded visual/layout refinement;
  - UI presentation on an accepted functional foundation;
  - source-backed visual composition.
- must not:
  - create a second runtime owner;
  - replace donor geometry/branding;
  - solve architecture before Web has pinned the owner.
- escalation: Web architecture, not Opus-first.

### COWORK_STANDARD

- executor: Claude Cowork
- model: Claude Sonnet 5
- reasoning: medium
- budget: HIGH
- use only when:
  - persistent local workspace matters;
  - many local/heavy files must be coordinated;
  - long multi-file implementation genuinely benefits from Cowork.
- not for:
  - status review;
  - briefing generation;
  - Hub metadata update;
  - ordinary GitHub-only integration.
- escalation: COWORK_DEEP.

### COWORK_DEEP

- executor: Claude Cowork
- model: Claude Sonnet 5 high first
- escalation model: Claude Opus 5.5 high only after one focused failure or explicit deep-agent need
- budget: VERY_HIGH
- use only for:
  - large hard codebase migration;
  - long-running agentic repair where Web cannot practically hold the working set.
- requires explicit named reason in the briefing.

### BLENDER_STANDARD

- executor: Blender MCP / Claude Code
- model: Claude Sonnet 5
- reasoning: medium
- budget: STANDARD
- use for:
  - deterministic geometry;
  - normal animation transfer/bake;
  - measured prop/rig operations;
  - repeatable Blender scripts;
  - export/preview.
- escalation: BLENDER_DEEP.

### BLENDER_DEEP

- executor: Blender MCP / Claude Code
- model: Claude Sonnet 5
- reasoning: high
- budget: HIGH
- use for:
  - custom actor-family grafts;
  - difficult skinning/weights;
  - rig diagnosis;
  - non-trivial IK/retarget repair.
- escalation model: Opus 5.5 high only after one focused failed repair pass.
- maximum repair policy remains two passes on the same gate.

### WORK_ESCALATION

- executor: ChatGPT Work
- model: GPT-5.6 Sol
- reasoning: high
- budget: VERY_HIGH
- assignment: **never default**
- use only when the job needs:
  - cloud computer / graphical browser operation;
  - multi-app workflow unavailable through normal connectors;
  - long autonomous execution where Web cannot perform the required action.
- do not use for:
  - GitHub read/write;
  - architecture review;
  - briefing generation;
  - simple Cloudflare status/publish checks that an existing owner/script can do;
  - direct Three.js coding.

### GITHUB_BRIDGE

- executor: ChatGPT Web / GitHub Bridge
- model: GPT-5.6 Sol
- reasoning: medium
- budget: LOW-STANDARD
- use for:
  - candidate intake;
  - diff;
  - repository-native tests;
  - commit;
  - source/head readback;
  - Return/changelog metadata.
- no visual re-authoring.

## Dispatch rules

1. Start at the **lowest profile that can actually perform the job**.
2. Model strength is not a substitute for the correct tool surface.
3. Work and Opus require a named capability/reasoning escalation, not “task is big”.
4. A failed visual attempt does not automatically justify a stronger model; first ask whether the wrong donor/owner/tool was used.
5. One focused repair pass may raise reasoning within the same executor.
6. Second failure on the same gate triggers stop/recovery, not automatic unlimited escalation.
7. The Hub should display:
   `Executor · Model · Reasoning · Budget`
   on every briefing card/drawer.
8. Copy-ready prompt should include the profile id so a fresh chat can reproduce the intended budget lane.

## Default mapping principles

- GitHub/source census: WEB_FAST.
- Normal Web product slice: WEB_STANDARD.
- IK/physics/architecture seam: WEB_DEEP.
- Visual/UI refinement on accepted runtime: CLAUDE_DESIGN_STANDARD.
- Blender geometry/animation: BLENDER_STANDARD.
- Blender custom rig/weights/family derivative: BLENDER_DEEP.
- GitHub candidate check-in: GITHUB_BRIDGE.
- Cowork: only if persistent workspace is a proven advantage.
- Work: only if a missing capability requires it.

## WSA / architecture

WSA should not run Work to:
- review the catalog;
- regenerate briefings;
- update Hub metadata;
- mount the v3 catalog.

Those are GitHub/Web tasks.

WSA escalates to Work only when the next product gate itself requires a Work-only capability.

## Freshness rule

Model strings are recommendations as of 2026-09-24.
If a named model is unavailable:
- keep the same profile;
- choose the current same-provider equivalent at the same cost/capability tier;
- do not silently jump from STANDARD to DEEP/VERY_HIGH.
