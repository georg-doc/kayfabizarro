# KFB Visual Critic Evidence Matrix · Additive Changelog

## 2026-11-22 · R1 · Proposal & schema intake
- Georg requested frame- and event-precise replay context (game flags, cascaded material/shader/VFX state, controls, input triggers, timing, video, actual tested device) and incremental quality progression.
- Recovered current KFB coordination plus Race photo/Playwright and profiler donors; avoided a parallel screenshot/renderer owner.
- Added `CONTRACT.md` with full provenance/capture contract, scorer, quality tiers and high-impact/low-effort priority rules.
- Added `review.schema.json` and `EXAMPLE_NOT_A_TEST.json`; 8/8 limited structural schema checks PASS.
- No runtime code, no images, no model output, no real performance measured, no Stage/Live. Further updates must append, not replace this record.

**One next gate:** `KFB_VISUAL_REPLAY_CAPTURE_01`.

## 2026-11-22 · R1a · Interactive Webchat Review Session check-in (proposal)
- Georg requested Webchat-native progressive-disclosure visual findings, target variants, Game Art/Animation/Audio critique, explicit approval, additive GitHub versioning and Claude Code-only game implementation handoff.
- Reused the existing KFB Game Improvement Lab expert perspectives and the existing Visual Studio #479, source record `kfb.visual-replay/0.1` / Draft PR #480; no new Game runtime or parallel QA model.
- Added `REVIEW_SESSION_UI_R1.md` + `review-session.schema.json` + synthetic example; 9/9 limited schema smoke PASS.
- Distinguishes **client selection**, **Webchat design output**, **Georg approval**, **GitHub evidence commit**, **Claude Code implementation**, **independent retest** and **Georg product acceptance**. No silent auto-commit, pseudo-Golden, or Site version rollback.
- No actual app/plugin image passing, generated picture, UI browser test or live Stage performed. All UX/layout examples are proposal only.
- **Next single gate:** `KFB_WEBCHAT_SESSION_CHECKIN_POC_01`: source-backed in-chat MCP App selection + verified model-context transfer; only then image-bytes and approval→GitHub roundtrip.

## 2026-11-22 · R1b · One-turn Webchat job intake + push routing (proposal)
- Georg requested reporting incomplete or fragmented loops/effects, actionably versioning selected fixes/paintovers with minimal chat messages, and pushing them to WS0 Lead and existing Claude Code implementers **without model-based periodic polling**.
- Added `ASYNC_JOB_INTAKE_PUSH_R1.md`, `job-intake.schema.json`, `JOB_EXAMPLE_NOT_A_TEST.json` (sample is fake and **unsubmitted**).
- Three honest dispatch levels: GitHub queued issue + human/agent resume; deterministic GitHub Actions/webhook; optional subscribed MCP Events to Work/Dot (not ordinary dormant Webchat); no unverified push into arbitrary open Claude chats.
- 11/11 limited schema checks PASS, no actual automated event subscriptions/deliveries. Existing 8/8 + 9/9 structural results retained.
- Repo/Runtime owners unchanged, no merge or publish. Current single next gate: `KFB_WEBCHAT_JOB_PUSH_POC_01`, a 1-job readback plus WS0 routing proof.

## 2026-11-22 · R1c · Cross-chat priority decisions → single WS0 queue (proposal)
- Georg authorized sending the proposed future Visual Studio working method to WS0 and requested additive P0/P1/P2/P3 prioritization inside progressive-disclosure Webchat review.
- Added `PRIORITY_QUEUE_R1.md`, `priority-update.schema.json` and a clearly synthetic example; preserve every priority revision as an additive event, never replace Georg's explicit requested tier with a hidden AI ranking.
- Separate `priority`, `readiness`, `work status`, `technical severity`, and `design approval`. A P0 can be blocked on a source; P3 can still be a quick win without turning green into "done".
- GitHub Issue/PR remains the shared SSOT across chats; WS0 receives an explicit issue and then must still acknowledge/triage it before a runtime builder is considered started. No duplicate runtime owner or new standing model poller.
- **11/11 limited structural checks PASS** (cumulative 39/39 across four proposals); zero operational queue/UI/Stage tests. Single technical gate `KFB_WEBCHAT_PRIORITY_ROUNDTRIP_01` incorporates the earlier job push check.
