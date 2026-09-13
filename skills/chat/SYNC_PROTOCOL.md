# KFB Chat Production · Sync Protocol

Status: CURRENT SYNC CONTRACT
Updated: 2026-09-13

## Purpose

Keep ChatGPT Web, Astra Work, Claude Design and project-specific chats aligned without copying large prompt bundles between them.

GitHub is the shared synchronization bus.

## Important limitation

A chat link is a pointer for the user, not a guaranteed machine-to-machine channel. One chat must not assume it can read, message or mutate another chat directly.

## Source hierarchy

1. project implementation SSOT for code/runtime facts;
2. `skills/chat/` for shared production routing/SOP/cross-project plan;
3. project-local chat/start files for consumer-specific instructions;
4. chat prose as transient working context.

## Session-start sync

Every active production chat should:

1. resolve the current `skills/chat/` router revision;
2. compare it with its locally recorded `lastSeenRouterCommit`, if present;
3. read `CHANGELOG.md` entries or Git diff newer than that revision;
4. load only changed/shared rules relevant to the current task;
5. then read its own project SSOT/current Return.

Do not re-copy canonical skill bodies into consumer repositories.

## Session-end sync

A chat should write back to GitHub only what it owns:

- project implementation/tests/Return → project SSOT;
- shared cross-project SOP/routing decision → `skills/chat/` via reviewable PR;
- tool authoring result → current tool source/SSOT;
- consumer sync metadata → consumer-local sync state.

## Consumer sync state

A consumer may store a small JSON file such as:

```json
{
  "schema": "kfb.chat-sync/0.1",
  "routerRepository": "georg-doc/kayfabizarro",
  "routerPath": "skills/chat/START_HERE.md",
  "routerRef": "main",
  "lastSeenRouterCommit": "<sha>",
  "projectRepository": "georg-doc/<project>",
  "updated": "YYYY-MM-DD"
}
```

This is a cursor, not a copy of the router.

## Update rule

Shared changes are additive. If a central rule is superseded, the central changelog names the successor. Consumer chats apply the delta; they do not rewrite their project history to pretend the old rule never existed.

## Conflict rule

- Shared SOP may constrain how work is done.
- It may not silently override a project-specific owner/contract.
- Project implementation state may reveal a conflict with the shared plan; report that conflict and stop at the owner boundary.

## Practical command to a chat

“Sync KFB production context, then continue this project.” means:

1. read central router/change delta;
2. read project current state;
3. report only meaningful conflicts;
4. continue without asking Georg for a full context dump.

## Future automation

A GitHub Action or indexer may later compare consumer `lastSeenRouterCommit` values against current router HEAD and flag stale consumers. Until that exists and is tested, the authoritative process is read-on-session-start plus local sync cursor.
