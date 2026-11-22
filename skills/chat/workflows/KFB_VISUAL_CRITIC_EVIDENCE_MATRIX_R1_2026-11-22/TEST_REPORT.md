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
