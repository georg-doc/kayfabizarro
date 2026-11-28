# KFB Visual Studio · One-message Game Loop Job Intake + Push R1
Date 2026-11-22 · Status: **DESIGN / SOURCE-REVIEW ONLY**; not a deployed event subscription, webhook, GitHub Action, plugin or free background agent.

## User direction
Georg wants to describe a **not-yet-recorded, fragmentary or cascaded** gameplay/effect idea or fix in normal ChatGPT Webchat with very few turns, optionally supply an original screenshot/clip or generate proposed target art, approve the version, and **push one durable GitHub job** to WS0 Lead as the existing orchestrator. WS0 dispatches to the **existing owner / Claude Code executor** or handles only work already in WS0's allowed scope. No repeated costly model polling, no forced human prompts for every internal fix, no silent runtime changes.

## Scope and existing donors
- Visual Studio intake [#479](https://github.com/georg-doc/kayfabizarro/issues/479), scene/deeplink owner [#478](https://github.com/georg-doc/kayfabizarro/issues/478), bounded Diorama [Race #152](https://github.com/georg-doc/KFB-Stunt-Car-Race/issues/152), Draft [PR #480](https://github.com/georg-doc/kayfabizarro/pull/480), source `CONTRACT.md` + `REVIEW_SESSION_UI_R1.md` + `review-session.schema.json`.
- Existing installed KFB Game Improvement Lab skill `skills://plugins/kfb-game-improvement-lab/improve-kfb-game/skill.md`: reuse its scoped Scout/Art Director/Animation Director/Game Designer/3D Dev perspectives; not a second runtime or newly claimed independent critic.
- GitHub Issues are existing KFB active job queue, `skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md` states owner truth and after-write branch/file readback. Existing game owner remains `georg-doc/KFB-Stunt-Car-Race` / `game/integration-r2` for current Race tasks, but other products retain their own branches and owners. Unknown Aquarium runtime/path must stay `OWNER_UNRESOLVED`.
- WS0 coordination/decision authority already exists. GitHub Issue creation **alone** is not proof that a named active WS0 Work/Claude chat received a running assignment.

## 1. "Describe once → submit job" from normal Webchat
Fast path (all but the description optional):
1. `@KFB Game Art Director job: <natural-language one-liner>`. Optional `project`, `focus`, screenshot/clip, Game scene review ID, desired visual target; accept partial fields instead of a long form. If the project/owner is genuinely unknown, stage a correctly labelled **intake/routing job**, not a guessed implementation assignment.
2. Plugin fetches only relevant source/head/flags/recent review context, checks existing job/Golden duplicates. It generates a concise read-only **job card** with expected player experience, current observed vs unverified state, references and one proposed minimal scope; use `NOT_YET_CAPTURED` for new ideas.
3. ChatGPT may suggest an optional original Paintover/FX sequence or sound cue, but the native image/audio generator is **not** assumed invocable by the plugin. `SUGGESTION` is separate from `GENERATED_ASSET_BYTE_VERIFIED`; no asset dependency for simply submitting the text job.
4. Present **one "Submit to WS0" confirmation** (or existing user instruction as unambiguous authorization), including `KEEP/REGENERATE/APPROVE/DEFER` target selection. Never interpret a displayed card or model-generated wording as Georg's approval.
5. One authenticated GitHub Issues write with `job_id`/idempotency key, exact source/owner if proven, next action, evidence refs, priority rationale, status `QUEUED_WS0`. Validate issue readback, return exact link. Original screenshot/video/paid media stay in approved *private* storage; public issue gets sanitized references only.
6. When WS0 accepts, it creates or links a narrow existing owner implementation task/branch/PR and reports only after receiving-owner readback. New chat sessions are never claimed pushed/running merely because GitHub was written. To reduce chat turns the Webchat may end after verified queued job.

## 2. Jobs accepted before there is a playable capture
| Job type | Input minimum | What "done" means for intake |
| --- | --- | --- |
| `LOOP_COMPOSITION` | intended sequence and player-visible outcome | source-backed brief and expected beat/test; no false "played" claim |
| `CASCADE_CONNECTOR` | two real effect/interaction module refs or known unknowns | order/trigger ownership proposal and missing interface check |
| `VFX_REPAIR` | problem description + optional frame/event | fix hypothesis with source confidence; technical capture only if available |
| `SOUND_DESIGN` | context, emotion, timing/trigger; optional reference | original SFX/style target and audio-owner handoff; no simulated waveform |
| `ART_DIRECTION` | visual issue/desire + current screenshot if available | initial visual proposal and locked eventual Golden pathway |
| `GAMEPLAY_REPAIR` | interaction or reward/obstacle defect | reproducibility plan, gameplay owner and expected outcome |
| `VISUAL_REVIEW` | existing real Review ID/capture | bounded critic findings, optional paintover and decision packet |
A missing game build, capture or ideal-path recording is a **readiness field**, not a reason to reject creative intake. Differentiate `IDEA_ONLY`, `SOURCE_BACKED_FRAGMENT`, `PLAYABLE_UNCAPTURED`, `CAPTURED`, `VERIFIED`, `OWNER_UNRESOLVED`.

## 3. Exact state machine / GitHub authority
`DRAFT_IN_CHAT → USER_APPROVED_FOR_QUEUE → QUEUED_GITHUB_VERIFIED → WS0_TRIAGED → OWNER_ASSIGNED → IMPLEMENTING → EVIDENCE_READY → INDEPENDENT_CRITIC → [GEORG_DESIGN_PASS | REPAIR | DEFER | CLOSED]`.
- The handoff "commit" represents **GitHub job metadata/evidence**, not code implementation; `QUEUED_GITHUB_VERIFIED` is not `CLAUDE_CHAT_STARTED`.
- `job_id` immutable; transitions appended as GitHub comments/record revisions and linked PRs. Never overwrite a Golden or lose a prior review. Guard transitions against duplicate user clicks, webhook redelivery, branch drift and conflicting writer.
- Submission is distinct from design/Golden approval. Default route may be `PROPOSAL_ONLY` or `APPROVED_FOR_BUILD` only when Georg has explicitly accepted the actual design/source. No automatic merge or Live.
- If multiple active chats cannot be addressed directly, **GitHub Issue is the owner-addressable inbox**. A WS0 chat reads next queued work on wake-up or resumes through supported event subscription. Do not misrepresent arbitrary chat-to-chat direct messaging.

## 4. Push without expensive polling: three progressively stronger routes
**A. Available now / no scheduler:** Webchat writes an Issue or adds an authorized `KFB_JOB_READY` state in existing owner queue; GitHub event/notification is immediate. WS0 Lead/Claude sessions fetch pending work **when opened or resumed**, not every minute. Low token spend between sessions; however does *not* guarantee autonomous execution.

**B. GitHub-native event receiver:** `issues: [opened,labeled]` or `issue_comment: [created]` GitHub Actions / GitHub App webhook, filtered by exact repo, verified actor/label and `job_id`. Purely deterministic label/router/dispatch with GitHub Action/worker, no LLM required. Avoid issue-comment prompt injection as instructions, validate event schema; only authorized user/WS0 can mark `APPROVED_FOR_BUILD`. GitHub workflow on `issues`/`issue_comment` must be installed on repository's **default branch** before it fires. Review secret scopes, retries, idempotency and dead-letter recovery. This is a technical path to alert a running external queue, not proof a paused chat is listening.

**C. OpenAI native MCP Events (current docs 2026-11-22):** MCP Events supports subscribed **Work chats on web, Work chats desktop Cloud, and dots** through MCP event subscriptions/webhook delivery. User/workspace enables the subscription and chooses actions. If available/authorized, have KFB plugin surface `job.created` / `job.approved` events to a subscribed **WS0 Work/Dot** rather than polling. A regular dormant Webchat does not automatically receive event-triggered background turns, and we must not promise self-starting Claude Code chats without their own subscribed executor/CI dispatch. Docs: https://developers.openai.com/plugins/build/mcp-events ; GitHub triggers: https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows .
**Preferred rollout:** A now; add B deterministic on verified job. C only when actual subscribed Work/Dot permissions and delivery evidence exist. No always-on model polling, no speculative tokens on inactive jobs.

## 5. Cheap routing / costs / safety
- **No model loop on each GitHub event:** parse typed JSON, ACL, dedup and route with deterministic code; ask WS0 model to act only for genuine `READY_FOR_TRIAGE` events in approved scope. Summarize multiple comments into one digest on *user-opened* session when no event subscription available.
- Deduplicate `repo, branch/head, scene_or_module, normalized intent, media_hash` within a bounded window. Do not collapse two distinct design variants merely because they share a scene.
- Idempotency `job_id + source_event_delivery_id + target_action`; persist queue state with retry count and `UNKNOWN` after unconfirmed write. Verify GitHub issue/commit before retry.
- Never send a paid KFB asset or privileged screenshot from private game/Inbox to public repo. Honor permissions for each private media URI; model-generated alternatives are *design candidates* not source game images.
- Owner and implementation assignments must remain explicit. WS0 only dispatches/works within its named authority; independent Critic not same as Builder; after two non-improving repair passes, smallest seam recovery.
- Resource limits: event actions/network/hosting may have charges; "zero recurring token costs" only for **idle** processing and no scheduled model polls, not for actual ChatGPT/Claude responses.
- No push to arbitrary ChatGPT conversations by copying URLs, and no promise a new task automatically appears in an unspecified Claude Code local session.

## 6. Proposed tool verbs / low-friction card
`draft_game_job(text, project?, scene_ref?, media_refs?, desired_variant?)` → pending card;
`preview_game_job(job_id)` → deterministic human summary + permitted original assets;
`submit_game_job(job_id, expected_revision, idempotency_key)` → permissioned GitHub issue/write, verified response;
`get_job_status(job_id)` → current links/owner/dispatch status;
`subscribe_job_events(filters)` → only via actually supported MCP Events runtime/permissions.
UI first viewport: **one sentence**, max 3 critical findings, priority/owner/readiness, selected candidate, and **Submit Job**. Technical detailed controls, source SHA, frame-by-frame cascade and budgets reveal only on demand.

## 7. One productive integration gate
`KFB_WEBCHAT_JOB_PUSH_POC_01`: submit **one real user-authored fragmentary KFB loop idea** from regular ChatGPT Webchat via the existing GitHub connection, verify Issue URL/parsed fields/idempotency; independently prove that WS0 sees and routes the same issue (on resumed session or real MCP Event subscription). Only then claim active push. Integrate with `KFB_WEBCHAT_SESSION_CHECKIN_POC_01` UI as the same owner/surface, not a second workbench. Test an intentional duplicate submission and an unavailable WS0 listener case. No game-runtime code or Site promotion in this research intake.
