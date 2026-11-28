# Review Evidence Matrix R1 · Test Report · 2026-11-22

## Actual checks
- GitHub readback after each implementation write: `CONTRACT.md` at commit `642b14d3b08be74a30fe8271dc66202fab9c6b27`; `review.schema.json` at `1e4913ec5134e6a54efd6538d9eac9d68127f567`; `EXAMPLE_NOT_A_TEST.json` at `64209de15c4504e6610802adefef9aae338743b8`. Three file readbacks matched requested paths and HEAD at the respective checkpoints.
- **8/8 PASS** on a *purpose-built JavaScript subset schema smoke validator*, not an industrial full JSON Schema 2020-12 compliance test. Checks: schema parses, 14/14 required top-level fields, sample validates, invalid status rejected, missing required device rejected, invalid SHA-256 rejected, invalid dimension rejected, all `$defs` references resolve.
- **0** real game-run or playthrough tests, **0** real videos/screenshots or devices, **0** shader-uniform replay validations, **0** full JSON Schema validator runs, **0** human visual acceptances, **0** Site/Cloudflare deployments.
- Synthetic example is explicitly labeled `EXAMPLE_NOT_A_TEST`; all unknown measured quantities remain null. This report asserts **contract/schema structure**, not game quality or replayability.

## Actual source evidence inspected
Race: `src/flags.js`, `src/siteHash.js`, `test/criticShots.mjs`, `scripts/ir2/profil-fahrt.mjs`, `test/_kfb-raw-mitschnitt.mjs`, current WS1→WS0 Return. The existing capture script is a real camera/Playwright image producer, the profiler emits per-frame timing/resource data; neither proves a full cross-referenced replay record today. Coordinator: `skills/chat/workflows/visual-qa.md`, `skills/chat/workflows/game-production.md`, KFB current router/production protocol and Issues #478/#479.

## Unresolved
- Existing Aquarium ideal-path code/plan and runnable receiving branch/site not identified; no fabricated media source or Stage URL.
- Capture performance overhead, GPU driver/runtime fields, precise shader-uniform probe and exact render-time synchronization require product implementation and real device evidence.
- Native Webchat image→plugin→GitHub binary path remains unverified.
- Benchmark tiers, `>=80` visual fidelity target and score weights are PROPOSED and not calibrated by Georg.
- `SOURCE.json` pins source observations for this planning slice only; current game HEAD must be re-fetched when executed.

**Next single gate:** `KFB_VISUAL_REPLAY_CAPTURE_01` – a real 10–30-second, source-backed beat with one full metadata snapshot and one independent deviation/critic record.

## 2026-11-22 · Interactive Webchat Session R1 additive schema smoke
- New files: `REVIEW_SESSION_UI_R1.md`, `review-session.schema.json`, `SESSION_EXAMPLE_NOT_A_TEST.json`.
- **9/9 PASS** custom JavaScript limited subset validation against exact GitHub-readback JSON schema/example: parse, 10/10 required fields, positive fixture, rejection of fake auto-approval, negative revision, missing handoff, bad SHA, invalid finding status, invalid privacy.
- Not a full JSON Schema 2020-12 engine; **0** actual HTML/MCP App implementations and Webchat UI/browser tests, **0** image or audio generation integration runs, **0** authenticated GitHub commit-from-App tests, **0** live deployed Site/UI observations.
- Important platform check: MCP Apps can render embedded HTML and update structured context; OpenAI Extensions report **Web image blocks in `ui/update-model-context` unsupported**, so generated image/GitHub bytes require a separate real end-to-end test. See https://github.com/openai/mcp-extensions/blob/main/docs/spec.md and `REVIEW_SESSION_UI_R1.md`.
- The example is synthetic and explicitly `EXAMPLE_NOT_A_TEST`; it is not an Aquarium assessment and has no real media or approval.

## 2026-11-22 · Webchat job intake / event-driven routing R1
- Added `ASYNC_JOB_INTAKE_PUSH_R1.md`, `job-intake.schema.json` and `JOB_EXAMPLE_NOT_A_TEST.json` as documentation + machine-readable envelope, **not** installed push infrastructure.
- **11/11 PASS** custom limited JSON/schema structural tests against exact GitHub-readback bytes: parse; 12 required fields; valid synthetic fixture; rejected invalid type, false job status, spoofed WS0 owner, invalid head SHA, inferred approval, missing dispatch, fabricated Claude start and unsafe privacy.
- Earlier actual structural tests remain **8/8** (replay) and **9/9** (session). Combined custom structural checks: **28/28** across three schemas, **not** full JSON Schema 2020-12 implementation validation.
- **0** real GitHub webhook/Actions pushes, **0** MCP Events subscriptions/deliveries, **0** installed KFB plugin, **0** dormant chat executions, **0** Claude dispatch tests, **0** actual multimedia generated or captured by this research slice.
- Verified current provider architecture references (2026-11-22): https://developers.openai.com/plugins/build/mcp-events (Work chats on web, desktop Cloud Work chats and dots; subscription needed); https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows (issues and issue_comment events on default-branch workflow). Free Webchat itself is not a guaranteed event-triggered autonomous listener.

## 2026-11-22 · R1c Webchat Priority / WS0 queue matrix
- Added `PRIORITY_QUEUE_R1.md`, `priority-update.schema.json`, `PRIORITY_EXAMPLE_NOT_A_TEST.json`.
- **11/11 PASS** on limited custom JS schema subset validation using exact GitHub-readback JSON: parse, 10 required root keys, positive synthetic example, reject misleading GREEN status, invalid owner, invalid effective priority, negative queue revision, missing requested priority, missing GitHub readback, invalid commit hash, invalid impact.
- Earlier 8/8 replay, 9/9 review session, 11/11 job intake remain recorded; across the four limited suites **39/39 PASS**. This is not full JSON Schema compliance or an operational plugin test.
- **0** actual Webchat buttons/plugin UI tests, **0** cross-chat priority readback tests, **0** live WS0 queue dispatch/automation, **0** real scene review/visual scores and **0** public deployments. The JSON example is not an actual user approval.
- UX decision: P0 critical red, P1 high amber, P2 scheduled blue/neutral, P3 later gray, UNTRIAGED neutral; workflow state is orthogonal. Queue sort records human user priority vs WS0 effective schedule with rationale.


## 2026-11-28 · R1d Work pilot evidence status
Planning only. C1 capture, C2 actual subagents, C3 native image edit, C4 binary export/readback, C5 independent critic, C6 WS0 receipt/ack, C7 later real after/regression: **7 NOT_RUN**. 0 runtime/browser/image/subagent tests; no new schema tests. Prior 39/39 limited structural checks not rerun. Planning file exact readback is verified separately after branch commit; not operational proof.
