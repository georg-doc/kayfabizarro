# KFB Chat Production Router

Status: CURRENT ROUTER v0.1
Date: 2026-09-13
Owner: Georg / KFB

This folder is the current LLM production routing layer for ChatGPT/Astra and Claude Design.
It does not replace project SSOTs, current tools, or canonical skills. It tells an agent what is current, what to read, and what not to trust without review.

## Start order

1. Read `REGISTRY.json`.
2. Identify the current project or tool node.
3. Read the referenced project SSOT / START / RETURN files.
4. Load only the current skills required for the task.
5. Apply the provider adapter only after the provider-neutral SOP.
6. Record decisions and results additively.

## Hard rules

- GitHub state beats chat recollection when they conflict.
- Reuse before rebuild. Read the donor before adapting it.
- Never silently replace an owner, contract, or SSOT.
- A donor PASS is not an integration PASS.
- A numerical PASS is not a browser PASS.
- A browser PASS is not Georg's visual/freeplay acceptance.
- Legacy files remain useful evidence but are not current merely because they exist.
- Do not read giant housekeeping/history files front to back at startup. Search them only for a concrete question.
- Do not copy canonical skills into this folder. Reference them from the registry.

## Status vocabulary

`CURRENT_CANON` · `CURRENT_TOOL` · `CURRENT_REFERENCE` · `CURRENT_PROJECT_SSOT` · `LEGACY_REFERENCE` · `SUPERSEDED` · `ARCHIVED_HISTORY` · `UNVERIFIED` · `EXPERIMENTAL`

## Core docs

- `PRODUCTION_SOP.md` — provider-neutral production method
- `EVIDENCE_AND_STATUS.md` — claim / proof vocabulary
- `CHANGELOG.md` — additive history of this router
- `adapters/chatgpt-astra.md` — ChatGPT/Astra operating layer
- `adapters/claude-design.md` — Claude Design operating layer
- `workflows/` — reusable task workflows
- `tool-nodes/` — current tool/project entry cards

## Current first-class nodes

- Asset Librarian
- FrankenStein Studio v16
- Travel Globe
- Animation Lab node is present but remains `UNVERIFIED` until its current implementation SSOT/site is pinned.

When a task says only “start KFB production”, begin here. When a task names a project or tool, this file routes you to its actual SSOT rather than becoming one itself.
