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
