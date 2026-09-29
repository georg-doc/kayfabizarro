# KFB Chat Production Router


Status: CURRENT ROUTER v0.4
Date: 2026-09-29
Owner: Georg / KFB


This folder is the current LLM production routing layer for ChatGPT/Codex, Claude Design and Claude Coworker.
It does not replace project SSOTs, current tools, or canonical skills. It tells an agent what is current, what to read, and what not to trust without review.




## 2026-09-29 · SITE-FIRST + EXECUTION-CARD OVERRIDE

Before all older routing, read `workflows/KFB_SITE_FIRST_PERSISTENCE_2026-09-29/START_HERE.md`. The KFB Production Control GPT Site is Georg's primary cockpit and intake; GitHub is the bounded canonical source/archive. Every executable briefing must name owner/tool, model, reasoning effort, fallback, persistence route and stop rule. New chats must not make Georg shuttle files or decisions between agents.


## Start order


1. Read `workflows/KFB_SITE_FIRST_PERSISTENCE_2026-09-29/START_HERE.md`.
2. Open the current KFB Production Control Site card named by the task.
3. Read `REGISTRY.json`.
4. Read `LIVING_MASTERPLAN.md` only when cross-project sequencing or current lead intent matters.
5. Identify the current project or tool node.
6. Read the referenced project SSOT / START / RETURN files.
7. If the task points to a shared intake package, apply `INBOX_PROTOCOL.md` before treating anything there as current truth.
8. Load only the current skills required for the task.
9. Apply the provider adapter only after the provider-neutral SOP.
10. For a bounded fresh-chat/module/POC slice, also apply `FRESH_CHAT_SLICE_PROTOCOL.md`.
11. For every Web/Claude/Codex delivery, apply `CHAT_GITHUB_KFB_STAGE_WORKFLOW.md` before writing or publishing.
12. Record decisions and results additively.


For meta-narrative/cross-module ideation, especially KFB Town, use the registry entries for `kfb-meta-compendium-v1` and `kfb-town`. The Meta Compendium is an index, not a canon/implementation SSOT; Town has its own living document under `town/`.


If this is a replacement/fresh chat after context loss, use `RECOVERY_PATH.md` rather than asking Georg for a transcript reconstruction.




## 2026-09-27 · CURRENT WORKFLOW OVERRIDE · productive integration / no pseudo-human gates


Binding policy:
`skills/chat/PRODUCTIVE_REVIEW_GATE_POLICY.md`


KFB Web/WSA/Claude work must optimize for usable integrated capability, not the number of review artifacts. Technical tables, owner/writer matrices, state-machine selectors and measurement dashboards are internal evidence unless a concrete human product decision depends on them. Prefer the real WorldBuilder, ToolBox, Racer, Travel consumer, Resident scene or Combat surface for review.


A clear Georg continuation instruction is a **PROCEED PASS**: continue without reopening the same intermediate gate; unresolved details remain documented and are not silently accepted.


Current applications:
- **TRAVEL-MODES-01 = PROCEED PASS**. Do not ask Georg to approve the contract-only Travel router Stage again. Continue mobility work in the real WorldBuilder/Travel consumer with source-proven adapters.
