# KFB Chat Production · Recovery Path

Status: CURRENT RECOVERY CONTRACT
Updated: 2026-09-17

Use this when a ChatGPT/Astra/Claude production chat ends, loses context, becomes blocked, or must be replaced.

**Human bookmark / navigator:** `https://kayfabizarro.pages.dev/kfb-hub/` — convenient entry page only. It links to the sources below and never replaces their authority.

## Recovery rule

Do not ask Georg to reconstruct project history from memory when GitHub contains the state.

## Fresh-chat recovery sequence

1. Read `skills/chat/START_HERE.md`.
2. Read `skills/chat/REGISTRY.json`.
3. If recovering the current cross-project lead conversation, read `skills/chat/recovery/CURRENT_LEAD_CHECKPOINT_2026-09-17.md`.
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

- Bookmark: `skills/chat/recovery/CURRENT_LEAD_CHECKPOINT_2026-09-17.md`.
- It points to active project/tool lanes without replacing any project SSOT.
- Always verify current repo HEAD after opening it; the dated checkpoint is a cursor, not a frozen implementation truth.

## Stunt Car Race / Track Lab quick recovery

- Project SSOT: `georg-doc/KFB-Stunt-Car-Race`
- Project recovery: `RECOVERY.md`
- Current experimental lane: `ChatGPT_web/track-lab/`
- Living sprint plan: `ChatGPT_web/track-lab/LIVING_MASTERPLAN.md`
- Machine-readable state: `ChatGPT_web/track-lab/WIP_STATUS.json`
- v0.5 durable reconstruction snapshot: `ChatGPT_web/track-lab/V05_SOURCE_SNAPSHOT.md`
- The exact v0.5 playable standalone remains a ChatGPT artifact at the 2026-09-17 checkpoint; the similarly named repo HTML is a recovery landing page, not test evidence.
- Georg accepted the **direction** after manual browser freeplay. This does not yet promote Track Lab over the production `race/` runtime or its movement/camera/progress owners.
- Next gate: productionize Flow Loop/core + forgiving controls/contact, then arbitrary-3D transported route frames, then one true vertical loop with safe bypass and `free → capture → commit → release → recover`.

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

Before authoring a substantial redesign/rework/game-slice brief for another model, read both incident reports:

- `skills/chat/recovery/POSTMORTEM_BRIEFING_DRIFT_TOOLBOX_UI_2026-09-15.md`
- `skills/chat/recovery/POSTMORTEM_BIRTHDAY_BRIEFING_FAILURE_2026-09-15.md`

The incidents established reusable rules:

**Coverage before compression. Identity before convenience. Sequence before feature lists. External red-team before expensive implementation where practical.**

In particular, do not let:

- a recent prototype become the product model by accident;
- a QA fixture become the UX model;
- a journey map replace the feature inventory;
- a favourite subset replace a full collection/roster;
- responsive/split-screen requirements become late QA only;
- omitted features become silent de-scope;
- identity-bearing world/interaction/audio elements be pushed to P1 solely to make P0 smaller;
- technical owner constraints overshadow the visible/interactive product outcome;
- named quality ideas such as `Living UI` or `micro-interactions` remain unbound to actual states/timing/evidence;
- automated PASS or a large green PR be treated as Georg acceptance.

For visual/game slices, a complete brief must explicitly answer four separate questions:

1. **WORLD** — what must visibly exist together?
2. **SEQUENCE** — what happens from cold load through the primary loop?
3. **LIFE** — what moves/lives even without input?
4. **FEEDBACK** — what does every important input immediately do, including loading/failure/retry?

Before expensive implementation, ask independent critics where supported:

- **Literal Executor Simulator:** what would a cold competent executor actually build from this brief, and what could it omit?
- **Intent/Coverage Auditor:** which explicit decisions are absent, weakened or accidentally deferred?
- **Experience Director:** is the end-to-end sequence complete?
- **Production Designer/Set Auditor:** is the full required world/prop inventory protected?
- **Interaction/Failure Auditor:** are hover/press/loading/success/failure/touch states operationalized?
- **Technical Contract Auditor:** are owners/sources correct without displacing the product goal?

Then use a separate Synthesizer to return ranked defects, exact repairs, a revised brief and — when requested — an improved reusable template. The Builder must not be its own only critic.

Mandatory preflight question:

> Given only this brief, what identity-bearing part of Georg's intended product could a competent literal executor legally omit and still claim success?

If the answer is non-empty, the brief is not ready.

If the functional source, visual source, complete feature/population/set inventory, experience sequence, interaction states or owner boundaries are not clear, issue an inventory/critique/red-team task first rather than an implementation brief.

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
