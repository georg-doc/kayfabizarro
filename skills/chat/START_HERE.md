# KFB Chat Production Router

Status: CURRENT ROUTER v0.1
Date: 2026-09-14
Owner: Georg / KFB

This folder is the current LLM production routing layer for ChatGPT/Astra and Claude Design.
It does not replace project SSOTs, current tools, or canonical skills. It tells an agent what is current, what to read, and what not to trust without review.

## Start order

1. Read `REGISTRY.json`.
2. Read `LIVING_MASTERPLAN.md` only when cross-project sequencing or current lead intent matters.
3. Identify the current project or tool node.
4. Read the referenced project SSOT / START / RETURN files.
5. If the task points to a shared intake package, apply `INBOX_PROTOCOL.md` before treating anything there as current truth.
6. Load only the current skills required for the task.
7. Apply the provider adapter only after the provider-neutral SOP.
8. Record decisions and results additively.

For meta-narrative/cross-module ideation, especially KFB Town, use the registry entries for `kfb-meta-compendium-v1` and `kfb-town`. The Meta Compendium is an index, not a canon/implementation SSOT; Town has its own living document under `town/`.

If this is a replacement/fresh chat after context loss, use `RECOVERY_PATH.md` rather than asking Georg for a transcript reconstruction.

## Hard rules

- GitHub state beats chat recollection when they conflict.
- Reuse before rebuild. Read the donor before adapting it.
- Reuse-before-rebuild applies to concepts too: do not invent a second hub/dialogue/presenter/card-navigation/memory grammar before checking its named home.
- Never silently replace an owner, contract, or SSOT.
- A donor PASS is not an integration PASS.
- A numerical PASS is not a browser PASS.
- A browser PASS is not Georg's visual/freeplay acceptance.
- Legacy files remain useful evidence but are not current merely because they exist.
- Meta indexes may contain stale version/status/count snapshots; verify operational claims in the current project/tool SSOT.
- Inbox files are inputs, not SSOTs, until a receiving owner accepts/pins them.
- The planned shared inbox is the private `georg-doc/KFB-Production-Inbox`; the old public Travel-mirror inbox is historical staging only.
- One inbox folder per job/project; processed packages move to `_inbox/archiv/` with return/destination evidence preserved.
- Do not read giant housekeeping/history files front to back at startup. Search them only for a concrete question.
- Do not copy canonical skills into this folder. Reference them from the registry.
- Chats synchronize through GitHub state; do not assume direct chat-to-chat messaging or shared hidden context.

## Status vocabulary

`CURRENT_CANON` · `CURRENT_TOOL` · `CURRENT_REFERENCE` · `CURRENT_PROJECT_SSOT` · `LEGACY_REFERENCE` · `SUPERSEDED` · `ARCHIVED_HISTORY` · `UNVERIFIED` · `EXPERIMENTAL`

## Core docs

- `LIVING_MASTERPLAN.md` — durable cross-project lead plan and sequence
- `masterplan/` — scoped masterplan addenda, referenced from `REGISTRY.json`
- `meta/KFB_META_COMPENDIUM_v1.md` — cross-module meta index; routing/reference only
- `town/START_HERE.md` + `town/LIVING_KFB_TOWN.md` — current KFB Town ideation home
- `RECOVERY_PATH.md` — deterministic recovery after chat/context failure
- `SYNC_PROTOCOL.md` — shared GitHub-based chat/agent synchronization
- `INBOX_PROTOCOL.md` — shared cross-project intake/staging rules
- `INBOX_REPO_BOOTSTRAP.md` — one-time structure for the private production inbox
- `PRODUCTION_SOP.md` — provider-neutral production method
- `EVIDENCE_AND_STATUS.md` — claim / proof vocabulary
- `CHANGELOG.md` — additive history of this router
- `adapters/chatgpt-astra.md` — ChatGPT/Astra operating layer
- `adapters/claude-design.md` — Claude Design operating layer
- `workflows/` — reusable task workflows
- `tool-nodes/` — current tool/project entry cards
- `consumers/` — project/chat-specific sync adapters without copied skill bodies

## Current first-class nodes

- Asset Librarian
- FrankenStein Studio v16
- Travel Globe
- Combat Arena
- KFB Town — current living concept/reference, not a runtime project
- Wissens-Pilli / DocCheck Interactive Microlearning — `UNVERIFIED` intake until implementation SSOT/runtime is explicitly pinned
- Animation Lab — `UNVERIFIED` until current implementation SSOT/site is pinned

When a task says only “start KFB production”, begin here. When a task names a project or tool, this file routes you to its actual SSOT rather than becoming one itself.
