# KFB Visual Studio · Webchat Priority Decision & WS0 Execution Queue R1
Date: 2026-11-22 · Status: **USER-AUTHORIZED ADDITIVE WORKFLOW PROPOSAL; NOT DEPLOYED** · Current coordinator: Visual Studio #479; active Draft PR #480. Do not claim installed app or autonomous WS0 session.

## 0. User decision / product goal
Georg wants an easy, **progressively disclosed and additive priority selector in every KFB Webchat Review/Job session**, so multiple accepted requests form one understandable **WS0 execution order**. Simple visual urgency first, implementation status and dependencies separate; WS0 Lead or its authorized delegated Claude Code/Claude Design owner must receive an exact linked job. Georg's priority is an explicit decision, not merely an AI score and not a claim of runtime/technical acceptance.

Reuse `ASYNC_JOB_INTAKE_PUSH_R1.md`, `REVIEW_SESSION_UI_R1.md`, `job-intake.schema.json`, `review-session.schema.json`, `CONTRACT.md`, existing `skills/chat/workflows/visual-qa.md`, installed KFB Game Improvement Lab perspectives. Existing GitHub Issue #479 is coordination inbox; Game `georg-doc/KFB-Stunt-Car-Race` (current `game/integration-r2`) only a receiving owner for source-backed Race tasks; current WS0 branch/head must be refreshed. No new game owner, hidden ChatGPT background listener, new Site deployment or Live.

## 1. Simple priorities — not traffic-light completion
Four **clear labels** are canonical. UI may use color **and text/icon**, never color alone. Do **not** paint P2/P3 green ("healthy/done") when work remains undone.

| Priority | Label in review | Meaning | Dispatch rule |
| --- | --- | --- | --- |
| `P0` | **KRITISCH · Jetzt** (red) | Crash/unplayable, severe real regression, approved Golden destroyed, blocking core scene; evidence/uncertainty must be shown | interrupts the regular backlog for WS0 triage; not permission to hotfix/merge/ship automatically |
| `P1` | **HOCH · Nächster Slot** (amber) | strong player-visible degradation, critical design beat / VFX or sound timing, important integration defect | schedule into nearest relevant owner slot once dependencies/authority are valid |
| `P2` | **GEPLANT · Danach** (blue/neutral) | local, bounded fix with meaningful quality effect; can follow current urgent work | prefer matching existing owner milestone/repair wave and quick wins |
| `P3` | **SPÄTER · Backlog** (gray) | optional polish, speculative variant, tiny low-frequency issue | keep preserved and discoverable; do not block releases |
| `UNTRIAGED` | **Noch nicht eingeordnet** (neutral) | evidence insufficient/owner unresolved/not yet user-classified | queue for source/priority triage without fake urgency |

The visually used color is a hint, not a permanent design/style authority. **Status**, **readiness**, **human approval**, **severity**, **user requested priority**, **WS0 effective priority** are separate fields. Example: a P0 bug can be `BLOCKED_ON_SOURCE`, and a P3 item can be implemented quickly as a nonblocking quick win. Never downgrade P0 through score arithmetic.

## 2. Minimal Webchat UI / progressive disclosure
**First view**: max three top items (one-line summary, real frame thumbnail when available or `NO_CAPTURE`, priority selector P0/P1/P2/P3, status e.g. `QUEUED_GITHUB_VERIFIED`, expected effect, `Save priority`). Show counters by priority and **one current next productive task**. No required long forms.
**Expanded view**: original/target/current media, timecode, exact device/flags/source, priority rationale, ROI/impact/effort/confidence, dependency blocks, existing Golden, ownership, independent Critic status, source links, change/priority history and queue position.
**Decision controls**: `Set P0/P1/P2/P3`, `Keep priority`, `Defer`, `Discuss`, `Generate variant`, `Approve design`, `Submit to WS0`. Each action affects only its documented state. **Priority selection does not automatically approve a generated design nor authorize runtime change.**
**Cross-chat**: ordinary Webchat can fetch the **current GitHub-backed priority projection** by project or `job_id`, not rely on thread memory. Same job retains ID and additive priority events across chats. A GitHub issue comment with `job_id`, expected revision and actor authority is the durable event; latest projection is recomputed. Presentation can be cached but head/revision must be checked at submission.
**Single-message shortcut**: "KFB Game Art Director: priority P1 for job KFB-..., fix [intent], attach [scene/ref]" should be parsed into a compact proposed decision, only one confirmation or the user's unambiguous existing authorization, then write+readback. Allow no capture and `OWNER_UNRESOLVED` on idea-only jobs.

## 3. Priority decision fields
The priority sidecar schema is `priority-update.schema.json`; append an event to job history, **do not rewrite** original report or another review version. Required payload:
- immutable `job_id`, `priority_event_id`, original `review_id`/scene/source head when known, actor/authorization (auth must be verified server side), UTC;
- `old_priority`, `requested_priority` (Georg), `effective_priority` (WS0), rationale with explicit `USER_REQUEST` vs `WS0_TRIAGE` vs `CRITIC_SUGGESTION`;
- `impact`, `frequency`, `effort`, `confidence`, `regression_risk` = optional evidence-backed rank signals; `severity` = product failure class, not same as queue priority;
- `readiness` and `workflow_status`, `blockers`, `dependencies`, receiving owner, target milestone, `queue_revision`, previous event (append-only), GitHub write/readback and dispatch status.
- **Georg's set priority is preserved**; WS0 can temporarily change *effective schedule* due to blocked source/critical dependency, recording why. A critical user-set P0 cannot be silently downgraded or marked closed by a different chat. Conflicting values are shown as `GEORG_P0 / WS0_BLOCKED_ON_SOURCE`, not overwritten.

## 4. One consolidated WS0 queue across Webchats, no daily LLM polling
**SSOT:** GitHub Issues per receiving project plus coordination #479. Projections/cache are views, not new canonical backlogs. Every job has exactly one `job_id`, canonical issue URL, source owner + receiving branch if proven, and a set of linked review/implementation PRs. Cross-project queue is built from typed indexed issue metadata / approved events, not hallucinated inferred state. Items with unknown owner are **WS0 routing items**, not assigned to Race by convenience.
**Order**:
1. Preserve any explicit Georg human override `NOW` / `DEFER`; active P0/production blockers first, but **verify source and owner before edits**.
2. Within the tier: unblock dependency chains, then executable/readiness, then impact/frequency vs effort/risk (smallest fix / high impact first), then age and owner capacity. Do not bury a blocked P0 simply because a P2 quick win scores better; display it as blocked with named missing fact.
3. Preserve per-owner serial writer and critical path; no two chats writing same runtime branch simultaneously. Claude Design receives visual/target-spec job; Claude Code receives source-/API-/test-backed implementation job; any executor starts only when its own supported dispatch path and permissions are proven.
4. Every click/command creates one small additive `priority.changed` event; avoid rewriting the Hub or expensive Site on each change. A GitHub Action/webhook can recompute small JSON projection on **default branch** when actually installed, deterministic/no LLM; otherwise WS0 refreshes view on opening.
5. Do not claim automatic push to a *dormant* WS0/Claude conversation. GitHub issue/event notification is a queue receipt; to wake Work/Dot use a **real subscribed MCP Event** and verify delivery; local Claude requires its own supported workflow/runner, not just an Issue.

## 5. Suggested low-cost priority calculation (internal recommendation only)
For triage `quick_win = impact(1..5) * visible_frequency(1..5) * confidence(0..1) / max(1, effort(1..5) * regression_risk(1..5))`. Show as "**low-effort/high-impact candidate**" when inputs are actual or explicitly estimated; do not let it override user P0/P1 or turn a mere thought into a critical bug. Display unknown scores as `NOT_MEASURED`. Any existing critical P0 or human Golden constraint remains a hard guard.

## 6. Completion / safety / audit
- `SET_PRIORITY` / `COMMIT_PRIORITY_EVENT` is **not** design approval; design and GitHub packet acceptance remain independently gated.
- Logged `priority.changed` events are append-only, include requested vs effective value, actor and UTC, expected queue revision, idempotency key, and a verified GitHub issue URL/comment readback. On concurrent update, re-read instead of overwriting another Webchat. No permissionless auto-updates to private Issues.
- One **final implementation acceptance** still requires real code/tests, independent Critic proof, and Georg product gate where relevant; a green build alone is not design PASS.
- Private screenshot/media sources stay in permissioned storage; public priority dashboard exposes only sanitized metadata.
- No new central UI/Site/Stage needed until the plugin read/write model is proven in Webchat. Hosted app/web interaction must be tested at actual supported host sizes/accessibility before calling it operational.

## 7. WS0 receiving instruction
- **One receiving proposal**, not new run-state: WS0 Lead should intake this as a light UX/routing improvement to its current GitHub Issues job queue. Only when WS0 actually reads/verifies the issue and schedules the slice is it `WS0_TRIAGED`. Do not pretend WS0 already running it.
- The first mini proof uses **one existing queued issue**, changes priority in the normal ChatGPT Webchat, writes an authorized additive event and visibly reorders the **same WS0 view** with proper readback and no duplicate ticket. At least one second chat should re-read the updated priority from GitHub to establish cross-chat consistency.

**Exactly one next gate:** `KFB_WEBCHAT_PRIORITY_ROUNDTRIP_01`: real input → priority selection → permissioned GitHub event/readback → WS0 queue projection/receipt → second-chat readback. Keep original `KFB_WEBCHAT_JOB_PUSH_POC_01` as an upstream part of the same proof, not an extra Georg gate. No automatic merge or Live.
