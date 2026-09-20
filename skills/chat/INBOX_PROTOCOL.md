# KFB Chat Production · Inbox Protocol

Status: CURRENT INTAKE CONTRACT
Updated: 2026-09-13
Owner: Georg / KFB

## Purpose

Use one shared cross-project inbox for coordination packages before their final owner, SSOT or production destination is fully established.

## Target shared inbox

Private repository:

`georg-doc/KFB-Production-Inbox`

Status until Georg creates it: `PROVISIONING`.

Bootstrap specification:

`skills/chat/INBOX_REPO_BOOTSTRAP.md`

The previous public staging location

`georg-doc/kayfabizarro/travel/wip/travel_globe_wsa/_inbox/`

is retained only as historical/provenance staging for packages already there. It is **not** the long-term shared inbox and must not imply Travel ownership.

## Hard rule

**INBOX != SSOT.**

A file in the inbox is an input, proposal, handover candidate, benchmark or historical evidence until the receiving project/tool explicitly accepts and pins it.

Never infer ownership from the folder path.

## Folder contract

```text
_inbox/
  <job-or-project>/
    START_HERE.md
    docs/
    sources/
    manifests/
    returns/
  archiv/
    <job-or-project>/
```

Each job/project gets one self-contained folder with all relevant briefing/docs/source manifests/returns for that job. Optional subfolders may be omitted when unused.

## Intake lifecycle

1. **DROP** — Georg or an authorized tool/chat places a package in `_inbox/<job-or-project>/`.
2. **CLASSIFY** — determine project input, tool input, donor/reference, proposal or archive/history.
3. **VERIFY TARGET** — identify the receiving project/tool and its actual implementation SSOT/owner.
4. **REGISTER** — add/update `skills/chat/REGISTRY.json` or the relevant tool/project node if the package introduces a durable production participant.
5. **HANDOFF** — the receiving owner imports/references only what it accepts, with source revision/pins.
6. **RETURN** — implementation/test/acceptance evidence belongs in the receiving project/tool SSOT; the inbox package may keep a return pointer/copy for coordination.
7. **ARCHIVE** — once processed and pinned, move the entire package to `_inbox/archiv/<job-or-project>/` with its final status and destination pointers. Preserve Git history; do not silently delete it.

Archive means `ARCHIVED HISTORY`, not current implementation truth.

## Recommended package minimum

A durable job folder should contain a small `START_HERE.md` stating:

- purpose / requested outcome;
- source / source revision;
- intended target project/tool;
- owner of requested work;
- next consumer;
- current status;
- explicit `not owner of` boundaries;
- read-first files;
- open questions / promotion gate.

Large living documents are allowed, but the small start file must route an LLM efficiently.

## LLM startup behavior

Do **not** scan the whole inbox at every session start.

Read an inbox package only when Georg points to it, the current node references it, the registry marks it relevant, or a current handover names it.

This keeps the inbox a mailbox, not a second bootstrap.

## Promotion rule

A package becomes current production truth only when its receiving project/tool records the accepted contract in its own SSOT or the central router explicitly promotes it.

## Current migration item

`DC MicroLearning WS1` currently lives in the older public staging path. After `georg-doc/KFB-Production-Inbox` exists, migrate it to:

`_inbox/DC MicroLearning WS1/`

and retain the old public location as provenance/history until the migration is verified.

## Privacy boundary

The private inbox is intended for non-public coordination material. It is still not a credentials/secrets store; use only material appropriate for the repository's actual access/policy.
