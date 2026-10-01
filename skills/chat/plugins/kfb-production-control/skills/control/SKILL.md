---
name: control
description: Load the standing KFB production protocol for Claude Code/Cowork, Blender MCP or Claude Design work. Use when starting or resuming KFB production, when the user says check in/secure/persist the work, or when a KFB slice needs crash-safe checkpoints and handoff.
---

# KFB Production Control

Use the KFB Production Control MCP tools supplied by this plugin as the durable cross-agent working ledger and artifact inbox.

## Source order

Before implementation work:

1. Read the current GitHub version of `skills/chat/START_HERE.md`.
2. Read `skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`.
3. Read `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`.
4. Resolve the named project SSOT, current Recovery/Return and slice briefing.
5. Read the matching Production Control workflow with `kfb_web_read`.

GitHub/project SSOT overrides chat/session memory for implementation facts. Production Control records are durable working state and intake, not a replacement runtime SSOT.

## One bounded slice

Keep exactly one:

- owner;
- repo/branch or other explicit source state;
- bounded outcome;
- protected owner boundary;
- one next gate.

Do not create a second movement, camera, physics, actor, terrain, dialogue, persistence or deployment owner.

## Donor rule

Reuse verified donors/modules first. A URL that loads is not proof that the donor design was actually used. For visual/design integration, inspect/show the source object in isolation before integrating it.

## Crash-safe checkpoint cadence

When the current slice is already authorized for Production Control persistence, checkpoint after each meaningful state change:

1. implementation result;
2. tests/evidence;
3. final Return / changed next gate.

A checkpoint records at least: owner, source repo/ref/branch/head when applicable, last proven result, unresolved/deferred items, and exactly one next action.

A timeout is `UNKNOWN`, never success. Inspect the workflow/artifact state before retrying.

## GitHub writes

When GitHub writes are authorized, follow the current KFB workflow: small checkpoints, then fetch the exact branch head and intended files after every write. Do not auto-merge or promote Live.

Human public test links, when genuinely required, use direct `https://kayfabizarro.pages.dev/...` routes linked from KFB Hub. Technical/plugin slices do not manufacture a Stage gate.

## Tool contract

Use the connected MCP operations by semantic suffix even when the host namespaces them:

- read: `kfb_web_read`
- checkpoint: `kfb_web_checkpoint`
- small artifact: `kfb_web_artifact_save`
- public HTTPS import: `kfb_web_artifact_import`
- private large upload: `kfb_web_upload_begin/chunk/finish/abort`
- verification: `kfb_web_artifact_read` and/or `kfb_web_artifact_link`

Never put secrets or long-lived private capability URLs into GitHub, handoff docs or public Stage.

## Repair stop

After two failed repair passes on the same explicit gate, freeze the candidate, preserve evidence and export failure recovery. Do not spend a third pass on the same foundation.

## Session end

Return the exact source state, actual tests, artifact/checkpoint IDs where relevant, unresolved items and exactly one next gate. Separate `TESTED RESULT`, deployment and human acceptance.
