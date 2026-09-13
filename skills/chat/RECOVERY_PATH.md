# KFB Chat Production · Recovery Path

Status: CURRENT RECOVERY CONTRACT
Updated: 2026-09-13

Use this when a ChatGPT/Astra/Claude production chat ends, loses context, becomes blocked, or must be replaced.

## Recovery rule

Do not ask Georg to reconstruct project history from memory when GitHub contains the state.

## Fresh-chat recovery sequence

1. Read `skills/chat/START_HERE.md`.
2. Read `skills/chat/REGISTRY.json`.
3. Read `skills/chat/LIVING_MASTERPLAN.md` only for cross-project sequencing and current lead decisions.
4. Open the named project/tool node.
5. Open the actual implementation SSOT and verify current default-branch HEAD, current open PRs and branches relevant to the task.
6. Read the project's current start/re-entry docs and current Return before heavy history. Typical order: `WSA_START.md` → project `MASTERPLAN.md`/contract → current `qa/.../RETURN.md` or `_handover/.../START_HERE.md`.
7. If the current node/handover names a shared intake job, read only that folder from the private `georg-doc/KFB-Production-Inbox/_inbox/<job-or-project>/`. If the private repo is still `PROVISIONING`, use the explicitly named legacy staging source instead.
8. Compare chat briefing claims against GitHub. GitHub wins on implementation state; unresolved product intent is reported rather than guessed.

## Evidence discipline during recovery

Separate:

- last known chat statement;
- repository implementation state;
- inbox/input state;
- tested result;
- public deployment state;
- Georg acceptance.

Do not promote one to another. Inbox packages are never implementation truth merely because they are present.

## What to do if documents disagree

1. Name both documents and their revisions.
2. Prefer the actual current code/branch for implementation facts.
3. Prefer the newest explicit DECISION for product/owner intent when it is clearly scoped.
4. Keep the contradiction `UNRESOLVED` when neither source legitimately supersedes the other.
5. Do not silently reconcile by inventing a third interpretation.

## Travel quick recovery

- Router: `skills/chat/START_HERE.md`
- Lead plan: `skills/chat/LIVING_MASTERPLAN.md`
- Project SSOT: `georg-doc/KFB-Travel-Globe`
- Read `WSA_START.md`, `MASTERPLAN.md`, `travel/CONTRACT.md`, current `qa/.../RETURN.md`, current PR.
- B0 acceptance and later MVP status must be re-read from current repo, not assumed from this file.

## Combat quick recovery

- Router: `skills/chat/START_HERE.md`
- Project SSOT: `georg-doc/KFB-Combat-Arena`
- Read `WSA_START.md`, `ChatGPT_web/START_HERE.md`, the relevant `_handover/` and current Return/Inbox result.
- Local Combat instructions supplement the central SOP; they do not replace it.

## Inbox quick recovery

- Target shared mailbox: `georg-doc/KFB-Production-Inbox`.
- Active work: `_inbox/<job-or-project>/`.
- Processed history: `_inbox/archiv/<job-or-project>/`.
- Read only the job folder named by Georg/current routing docs.
- The receiving project/tool SSOT remains authoritative after handoff.

## Minimum handoff a dying chat should leave

If possible before stopping, persist:

- exact repo/branch/PR/head SHA;
- what was implemented;
- what was actually tested;
- visible FAIL/UNRESOLVED items;
- next accepted slice/gate;
- any required user approval still outstanding.

Place this in the project's Return/Handover, not only in chat prose. For intake-only jobs, leave the coordination Return inside that job folder and point to the receiving SSOT/PR when available.

## Recovery success criterion

A fresh authorized chat should be able to continue correctly from GitHub without receiving a transcript dump from Georg.
