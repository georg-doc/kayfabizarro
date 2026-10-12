# KFB Game Improvement Lab 01 · Five-Role Webchat Pilot

Date: 2026-10-12
Status: **PLANNING / MANUAL WEBCHAT PILOT PROPOSED · NO IMPLEMENTATION · NO LIVE CLAIM**
Existing coordination owner: **KFB Production Hub / HUB-CTRL**; receiving game/runtime owner remains whichever exact KFB product/slice is inspected. The Lab is a workflow, not a second game, asset, scene, testing runtime or product SSOT.
Repo/branch: `georg-doc/kayfabizarro` / `planning/kfb-game-improvement-lab-01-2026-10-12`.
Donor: `isas1/daily-team@4c85f97bd5b470ab369c48422443d2e96868159a` (MIT, pattern research only; not integrated).

## Product purpose

Manually request one **high-impact, low-effort improvement** for the current, source-proven KFB game/slice. Optional user theme (visual direction, character animation, game feel, exploration/gameplay, technical performance, or free text). Work on actual capabilities/claims, not randomly selected assets, imaginary features or generic wishlists.

All rounds recover fresh GitHub owner, branch, head, project SSOT, current Recovery/Return, explicit scope and acceptance gates first. Read `skills/chat/START_HERE.md`, `skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`, `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`, `skills/chat/KFB_GAME_BIGGER_PICTURE_REFERENCE_2026-10-04.md` and `skills/chat/KFB_INDEPENDENT_EXECUTION_GUARD_CONTRACT_2026-10-05.md`. Product-specific current contracts take priority.

## Five roles and sequencing

1. **Playtester / Player Advocate / Problem Scout**: read or play the exact candidate; identify up to three observed weaknesses. Evidence first, no invented feature requirements. Return to test the result after implementation only through the applicable independent QA route.
2. **Art Director**: silhouette, staging, KFB Claybound/cartoon cohesion, palette, lived-in composition.
3. **Animation Director**: movement meaning, timing, character acting, rig/source identity, user feedback.
4. **Game Designer**: curiosity, play, reward/interaction loops, clarity, player freedom and meta-narrative.
5. **3D Game Developer**: existing modules, smallest technical delta, risk, cost, deterministic repro and testability.

Then: `Playtester findings → four independent discipline pitches → actual clash / objections → one justified decision or NO ACTION → concise owner-aware handoff`.

These are *creative perspectives in a coordinated Webchat run* unless independent external agents/processes are actually invoked and logged. Do not label one model simulating five roles as five independent agents. Any mandatory independent tester/critic remains separate from the creative roleplay.

## Scope & Claim Firewall · mandatory before every playtest

For each relevant feature identify source repo, branch, head, owner, acceptance target and supporting claims (Return, implementation, CI, screenshots, browser proof). Classify:

- `TEST_NOW`: implemented and currently required in this slice;
- `VERIFY_CLAIM`: asserted complete but evidence insufficient;
- `NOT_IN_SCOPE`: legitimately absent/deferred;
- `UNVERIFIED`: no accessible source or real test surface.

Report any weakness as `IMPLEMENTATION_DEFECT`, `CLAIM_MISMATCH`, `EXPERIENCE_GAP` (only when experience is this slice's named goal), or `FUTURE_SCOPE`. No present-slice FAIL merely because a future game feature has not been built.

KFB game context is always read, but is not an automatic hard gate on an isolated technical POC. Consider the relevant levels of quality:
- current gameplay intent and whether the real interaction is worthwhile;
- world biography, existing Residents, Cards, Golden Journey and meta-narrative relationships;
- source-backed claymation/cartoon appearance, material/lighting/contact/animation quality.

Differentiate documentary evidence review (`EVIDENCE_SCOUT`) from genuine browser/controller play (`HANDS_ON_PLAYTEST`). Never claim to have played unless the exact build was genuinely operated and observed. `NO BUILD / NO PLAYTEST` is valid.

## Modes

### A. Evidence Scout · initial/manual default
Use repo, code, test reports, screenshots, accepted design and known failure records; produce maximum three actionable, bounded findings. No pretend runtime access.

### B. Experience Playtest · when playable slice actually available
Exercise currently required controls and experience goals in an accessible exact build; capture version, input path, screenshot/clip/console where applicable. Do not apply full-MVP Game Feel criteria to an isolated POC.

### C. **Breaker Mode · DEFERRED / OPT-IN ONLY**
Human-facing name: **Try to Break the Game**.
A deliberate adversarial *player-behavior* test of currently implemented and claimed seams. Not part of ordinary daily runs and not required for the first pilot. Must be explicitly enabled for one isolated, disposable target and named scope.

Breaker probes, **only where those capabilities actually exist**:
- move/jump/fly/drive mode-spam; high-frequency valid control sequences; clipping, out-of-bounds and softlocks;
- portal/door/quest/progression order bypasses; state mismatch and reward/inventory duplication;
- rapid NPC/Card/dialogue interruption and repeated use; invalid-but-reachable interaction sequences;
- save/reload/import/undo/redo during active transitions, with disposable test data and rollback;
- camera extremes, renderer black output, hidden collisions, significant memory/resource regressions under bounded scenarios.

Avoid unsandboxed destructive tests, real account/data modification, uncontrolled load/stress, public service attack, privileged access or testing third-party services without permission. Security penetration testing is a separate explicitly authorized task, not automatically included in Breaker Mode.

For each probe, preserve **exact build/head, prerequisite state, action sequence, seed where relevant, expected outcome, observed outcome, captured evidence, minimal reproduction, severity, affected owner**. Use `PASS / FAIL / UNKNOWN`, never a simulated success.

Classify unexpected behavior as:
- `BREAKING_BUG`: crash, save corruption, softlock, wrong trust/state boundary;
- `ACCEPTED_LIMIT`: legitimate scoped limitation;
- `FUN_EXPLOIT_CANDIDATE`: unexpected emergent interaction that might be worth preserving as play;
- `UNVERIFIED`: cannot reproduce or observe.

A `FUN_EXPLOIT_CANDIDATE` is a proposal for the Game Designer / Georg, not automatic adoption. The Game Lab does not reopen accepted STOP conditions, does not mutate other runtimes, and never promotes a candidate to Live.

### D. Optional bounded implementation · separately authorized
A user-selected recommendation may become one existing-owner implementation slice, with one production writer and separate tester/critic/Guard. Repository code writes/CI and real render/browser checks are different proof levels; a GitHub commit is not visual/runtime acceptance. No automatic merge or Site/public publish.

## KFB Hub launch design (future, not built)

Keep existing `kfb-production-hub.frizzlebob.chatgpt.site` as sole human front door. First version can use an existing Hub live-data **briefing card** with a copyable Webchat start prompt and an optional theme in the message. This is not a claim of one-click agent invocation.

Only after the manual proof, assess adding a compact existing-Site input + real launch action in place. New Hub shell/behavior would require one bounded Site publication; routine source/briefing/Return changes should remain GitHub-live. No separate Hub, ToolBox, agent runtime, Stage or Cloudflare route.

## Daily output minimum

1. Exact scoped target: repo / branch / head / product status and what was really inspected.
2. Up to three observable findings, each with evidence and correct classification.
3. Four expert proposals, real objections and one winner **or NO ACTION**.
4. Benefit hypothesis, low-effort technical change, reuse/source refs, owning project, test conditions.
5. If code was separately authorized: changed files, real test counts, independent result and one next gate.
6. Durable decision / Return at a coherent milestone; no routine Hub/Cloudflare status churn.

## Current protection / no-go

WorldBuilder/Island PR #348 is currently **STOPPED · F-R39 FAIL · NO MVP**; Four-Island Story Vision A/B design gate remains binding. This planning document does not authorize R5, repair, geometry or game runtime changes. Do not test a failed/stale Site as the current playable build. No donor design, assets, branding or runtime substituted automatically.

## One next gate

**KFB_GIL_01_MANUAL_SCOPE_CLAIM_PILOT**: one read-only Webchat run on the documented R4 failure candidate (evidence-only), with independent discrimination of actual failure/false claims versus legitimate missing future scope, followed by one credible high-impact/low-effort *design-only* improvement. Breaker Mode stays DEFERRED; no code or Hub shell work in this gate.
