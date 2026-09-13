# KFB Chat Production · Inbox Protocol

Status: CURRENT INTAKE CONTRACT
Updated: 2026-09-13
Owner: Georg / KFB

## Purpose

A shared inbox may be used to drop cross-project coordination packages before their final owner, SSOT or production destination is fully established.

Current shared intake location:

`travel/wip/travel_globe_wsa/_inbox/`

This location is a convenience/staging area only. Its path under the Travel public mirror does **not** make its contents part of Travel, and it does **not** make the inbox an implementation SSOT.

## Hard rule

**INBOX != SSOT.**

A file in the inbox is an input, proposal, handover candidate, benchmark or historical evidence until the receiving project/tool explicitly accepts and pins it.

Never infer ownership from the folder path.

## Public-repository rule

`georg-doc/kayfabizarro` is public. Therefore this inbox may contain only material that is safe to publish publicly.

Do not place confidential DocCheck information, credentials, private customer material, patient/person-identifiable information, non-public medical records, or other restricted/internal data here.

If a package requires private material, use the appropriate private project repository or another explicitly private channel and put only a safe pointer/manifest in this inbox.

## Intake lifecycle

1. **DROP** — Georg or a tool/chat places a package in a named inbox folder.
2. **CLASSIFY** — determine whether it is project input, tool input, donor/reference, proposal, or archive/history.
3. **VERIFY TARGET** — identify the intended receiving project/tool and its actual implementation SSOT/owner.
4. **REGISTER** — add/update the `skills/chat/REGISTRY.json` entry or tool/project node if the package introduces a durable production participant.
5. **HANDOFF** — the receiving owner copies/imports/references only what it actually accepts, with source revision/pins.
6. **RETURN** — test/acceptance evidence is written back to the receiving project/tool SSOT, not to the inbox as a substitute.
7. **ARCHIVE/RETAIN** — inbox history remains additive unless Georg explicitly approves cleanup. Never silently move/delete an input package.

## Recommended package minimum

A durable inbox package should, where practical, contain or state:

- `purpose`
- `source / source revision`
- `target project or tool`
- `owner of requested work`
- `next consumer`
- `status`: PROPOSAL / DECISION / IMPLEMENTATION / TESTED RESULT / UNRESOLVED / DEFERRED / ARCHIVED HISTORY
- explicit `not owner of` boundaries
- open questions / promotion gate

Large living documents are allowed, but a small START/BRIEFING file should tell an LLM which parts to read first.

## LLM startup behavior

Do **not** scan the whole inbox at every session start.

Read an inbox package only when:

- Georg points to it;
- the current project/tool node references it;
- `REGISTRY.json` marks a pending intake relevant to the task;
- a current handover explicitly names it.

This keeps the inbox a mailbox, not a second bootstrap.

## Promotion rule

A package becomes current production truth only when its receiving project/tool records the accepted contract in its own SSOT or the central router explicitly promotes it.

Example:

`_inbox/DC MicroLearning WS1/` may introduce Wissens-Pilli and its Studio preparation briefing. It does not by itself prove that `micro-learning/wissens-pilli/` is already a complete implementation SSOT or that the Studio work has been executed.

## Future location

The current inbox path may later be replaced by a more neutral top-level coordination inbox. If that happens, record it as `SUPERSEDES` in `CHANGELOG.md`; do not silently relocate history.