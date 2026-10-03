# Brief · KFB repository, SSOT and production-process audit

Executor: **Claude Code · Opus 5.5 · High reasoning**  
Mode: **read-only**  
Owner: Georg / KFB  
Return language: German, plain language first

## Start message

> Perform an independent read-only audit of the current KFB GitHub repositories and production process. Start at `skills/chat/workflows/KFB_PRODUCTION_CRISIS_RECON_2026-10-03/START_HERE.md` on the supplied branch, read `SOURCE_SCOPE.md` and use `COMMON_RETURN_SCHEMA.md`. Do not merge, edit, close, delete or deploy anything. Inventory open work, trace stacked branches, identify SSOT conflicts and design a reliable GitHub-based check-in and handoff process for ChatGPT, Claude Code/Cowork, Claude Design and Blender MCP. Do not assume the other audit's conclusions.

## Production question

Why can useful work exist in the project while neither Georg nor a fresh agent can reliably tell what is current, safe to merge or ready to integrate?

## Audit scope

### Repository health

- current default-branch state and protected owners;
- all relevant open pull requests and their ancestry;
- stacked or duplicate branches;
- conflicts, failing checks and stale candidates;
- large session cuts, copied libraries and repeated binary payloads;
- Returns/Recovery files that claim completion without a receiving owner;
- branch-local canon that should be extracted or routed, not silently treated as main.

### SSOT health

- documents that claim to be current but are stale;
- multiple files claiming ownership of the same system;
- missing stable entry points for accepted animation, clay/style, world, mobility, combat, NPC, audio, VFX, billboard/card and deployment knowledge;
- contradictions between router, registry, masterplan, project Returns and runtime consumers;
- whether a fresh Claude Design or Blender chat can reach every required source through direct GitHub links.

### Production flow

- why timeouts create repeated or uncertain work;
- why GitHub/Cloudflare operations are attempted inside jobs that do not require them;
- how Site checkpoints, GitHub code and large authoring assets should divide responsibilities;
- how to stop manual 50 MB ZIP handoffs and repeated unzipping into old inboxes;
- what should live in Git, Dropbox, Production Control and the public Stage;
- which automated checks would prevent stale-source briefs, second owners and unverified MVP claims.

## Required disposition table

For every relevant open candidate, assign exactly one proposed action:

- **KEEP** — valid current work that can remain as-is;
- **EXTRACT** — useful files must move to a clean branch based on current main;
- **REPAIR** — the candidate has a bounded fix before it can be considered;
- **ARCHIVE** — preserve evidence but stop development;
- **BLOCKED** — external decision/source is truly required;
- **UNKNOWN** — evidence is unavailable.

Do not recommend merging a large working branch wholesale merely because it contains some correct files.

## Required future workflow

Propose one lightweight process that all executors can follow:

1. direct GitHub read-first entry for every job;
2. one named owner and one clean branch per bounded outcome;
3. small checkpoints with verified readback;
4. no Cloudflare deployment unless a human browser surface is required;
5. timeout means unknown, followed by inspection rather than duplicate writes;
6. authoring tools return small manifests, evidence and source pointers; large reusable assets are stored once;
7. an accepted result is extracted into its stable owner before the next integration depends on it;
8. the Hub shows status, next executor, Georg action and visible next result in plain language.

Include a proposed directory map and a simple transfer contract for:

- small code and documentation;
- reusable binary assets;
- temporary authoring files;
- screenshots/evidence;
- session recovery;
- final runtime delivery.

## Required return

Follow `COMMON_RETURN_SCHEMA.md` and add:

- a repository-health summary;
- pull-request/branch disposition table;
- SSOT conflict table;
- proposed canonical directory and routing map;
- merge/extraction order with dependencies;
- a no-timeout/no-duplicate-write procedure;
- a no-large-ZIP authoring handoff procedure;
- the minimum automated safeguards;
- a short operating guide for Georg showing where to look and how to approve or stop work.

## Done when

A fresh ChatGPT, Claude, Blender or Design session can be given one GitHub start link and can identify the current owner, source, task, protected boundaries, expected return and stop condition without asking Georg to find files.

