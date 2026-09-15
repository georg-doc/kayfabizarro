# KFB Chat Production · Recovery Path

Status: CURRENT RECOVERY CONTRACT
Updated: 2026-09-15

Use this when a ChatGPT/Astra/Claude production chat ends, loses context, becomes blocked, or must be replaced.

**Human bookmark / navigator:** `https://kayfabizarro.pages.dev/kfb-hub/` — convenient entry page only. It links to the sources below and never replaces their authority.

## Recovery rule

Do not ask Georg to reconstruct project history from memory when GitHub contains the state.

## Fresh-chat recovery sequence

1. Read `skills/chat/START_HERE.md`.
2. Read `skills/chat/REGISTRY.json`.
3. If recovering the current cross-project lead conversation, read `skills/chat/recovery/CURRENT_LEAD_CHECKPOINT_2026-09-15.md`.
4. Read `skills/chat/LIVING_MASTERPLAN.md` only for cross-project sequencing and current lead decisions.
5. Open the named project or tool node.
6. Open the actual implementation SSOT and verify current default-branch HEAD, current open PRs and branches relevant to the task.
7. Read the project's current start/re-entry docs and current Return before heavy history. Typical order: `WSA_START.md` → project `MASTERPLAN.md`/contract → current `qa/.../RETURN.md` or `_handover/.../START_HERE.md`.
8. If the current node/handover names a shared intake job, read only that folder from the private `georg-doc/KFB-Production-Inbox/_inbox/<job-or-project>/`. If the private repo is still `PROVISIONING`, use the explicitly named legacy staging source instead.
9. Compare chat briefing claims against GitHub. GitHub wins on implementation state; unresolved product intent is reported rather than guessed.

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

## Current lead quick recovery

- Bookmark: `skills/chat/recovery/CURRENT_LEAD_CHECKPOINT_2026-09-15.md`.
- It points to Town, Asset Librarian, ToolBox and Travel without replacing any project SSOT.
- Always verify current repo HEAD after opening it; the dated checkpoint is a cursor, not a frozen implementation truth.

## Asset Librarian quick recovery

- Permanent product URL: `https://kayfabizarro.pages.dev/asset-librarian/`
- Tool source: `tools/asset_registry/librarian/`
- Current chat-break review: `tools/asset_registry/librarian/POSTMORTEM_CHAT_BREAK_2026-09-15.md`
- Do not infer current version from README/RETURN alone; verify `main`, current code version and browser workflow evidence.
- Asset types / Town categories are browsing and workbench heuristics, not automatic Registry semantics.

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

## Briefing-quality guard

Before authoring a substantial redesign/rework brief for another model, read:

`skills/chat/recovery/POSTMORTEM_BRIEFING_DRIFT_TOOLBOX_UI_2026-09-15.md`

The incident established a reusable rule: **source hierarchy + full inventory + negative clamps before implementation prompt**.

In particular, do not let:

- a recent prototype become the product model by accident;
- a QA fixture become the UX model;
- a journey map replace the feature inventory;
- a favourite subset replace a full collection/roster;
- responsive/split-screen requirements become late QA only;
- omitted features become silent de-scope.

If the functional source, visual source, complete feature/population inventory or owner boundaries are not clear, issue an inventory/critique task first rather than an implementation brief.

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
