# KFB Production Inbox · private repo bootstrap

Status: DECISION / PROVISIONING
Updated: 2026-09-13
Owner: Georg / KFB

Target repository: `georg-doc/KFB-Production-Inbox`
Visibility: private

This repository is the shared cross-project intake/mailbox for authorized KFB production chats and tools. It is coordination infrastructure only, never an implementation SSOT.

## Required layout

```text
README.md
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

Folders may omit unused subfolders, but each active job/project gets exactly one self-contained folder under `_inbox/`.

## Package minimum

`START_HERE.md` should state purpose, source/revision, intended target, work owner, next consumer, owner boundaries, current status, read-first files and open promotion gates.

Supporting material lives beside it in `docs/`, `sources/`, `manifests/` and `returns/` as useful. Do not scatter one job across several top-level folders.

## Archive rule

When a package has been processed and its accepted result is pinned in the receiving project/tool SSOT:

1. add/update a final status/return inside the package;
2. record receiving repo/path/commit or PR;
3. move the whole folder to `_inbox/archiv/<job-or-project>/`;
4. preserve Git history rather than deleting processed packages.

Archive means `ARCHIVED HISTORY`, not authoritative implementation state.

## LLM rule

Agents read only the named/relevant job folder. They do not scan the complete inbox by default.

The central routing contract remains `georg-doc/kayfabizarro/skills/chat/`; implementation truth remains in each project/tool SSOT.

## Initial migration after repo creation

Copy the current coordination package:

`georg-doc/kayfabizarro/travel/wip/travel_globe_wsa/_inbox/DC MicroLearning WS1/`

into:

`georg-doc/KFB-Production-Inbox/_inbox/DC MicroLearning WS1/`

Preserve the original public path as historical provenance until migration is verified.

## Provisioning handoff

The connected GitHub production tool cannot create repositories. Georg creates the empty private repository once. After that, authorized ChatGPT/Astra workflows can create this structure, migrate packages, update/archive folders and maintain returns through normal Git operations.