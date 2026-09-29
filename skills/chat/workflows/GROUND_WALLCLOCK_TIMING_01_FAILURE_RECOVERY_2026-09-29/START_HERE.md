# GROUND-WALLCLOCK-TIMING-01 · Failure Recovery

Status: **ARCHIVED_FAILED_CANDIDATE · 2/2 REPAIRS USED · NO REPAIR 3 · NOT PUBLISHED**

## Source
- repo: `georg-doc/kayfabizarro`
- owner branch: `chatgpt-web/kfb-container-walk-pace-tune-01-2026-09-29`
- Draft PR: #289
- accepted/public source handoff before timing work: `542eedb91f96b6f718df9e619fb3d3f746b79854`
- accepted/public runtime: `4475271b61e65fae95e5044925b83f2e39c18e6e`
- frozen failed candidate: `9431a89c8b28c21579f61ae8cdb5e3be197706d5`
- public route remains the pre-timing-fix Two-Gear build: https://kayfabizarro.pages.dev/kfb-hub/stage/game-container/ground-walk-pace-tune-01/?ground=1&groundFeel=velocity&walkPace=travel

## Goal
Fix Georg's observed slow/ruckly world traversal without changing the now-correct state mapping:
- W = `Running_A`
- Shift = `Running_B`

## Proven root finding
The live Turbo loop used:
`rawDt = clock.getDelta(); dt = Math.min(rawDt, 1/30); simulate(w, dt)`.

Elapsed wall-clock time above 33.3 ms was discarded. At ~15 FPS this can advance only ~0.033 s of simulation per ~0.067 s of real time, producing slow-motion world traversal. Deterministic QA had masked this because `advanceBy(seconds)` already consumed the full requested interval in small steps.

## Frozen candidate design
- `simulateElapsed()` catches up elapsed time in 1/60 s slices;
- catch-up is capped at 0.25 s per RAF;
- camera/HUD/audio/render stay once per RAF using bounded visual dt;
- no speed constants changed;
- no movement owner changed;
- W=Running_A / Shift=Running_B unchanged.

Changed vs accepted handoff: 8 files:
- `.github/workflows/kfb-container-walk-pace-tune-01.yml`
- `game-container/turbo-kfb/CHANGELOG.md`
- `game-container/turbo-kfb/RETURN.md`
- `game-container/turbo-kfb/app/src/main.js`
- `game-container/turbo-kfb/qa/checkpoint-a.mjs`
- `game-container/turbo-kfb/qa/ground-orbit-integration01.mjs`
- `game-container/turbo-kfb/qa/ground-wallclock-timing01-static.mjs`
- `game-container/turbo-kfb/qa/ground-wallclock-timing01.mjs`

## Attempts
| pass | head / run | result |
|---|---|---|
| implementation | `0a03b0ea...` / `36591956187` | static 8/8 + 10/10 + 7/7 PASS; Explore/Race/Ground Walk/Run/Stop PASS; Jump_Start transient failed |
| Repair 1 | `0ab3b06d...` / `36592599717` | static 8/8 + 10/10 + 9/9 PASS; same broad baseline PASS; same Jump_Start transient failed |
| Repair 2 FINAL | `9431a89c...` / `36593362023` | static 8/8 + 10/10 + 9/9 PASS; Explore/Race/Ground Walk/Run/Stop PASS; Jump_Start PASS; Jump_Idle PASS; landing FAIL, observed Jump_Idle |

## Final failure evidence
Run `36593362023` failed before Ground+Orbit / Two-Gear / explicit 15-FPS browser proof could execute. Final artifact:
- `11044688869`
- `sha256:629aff621427e1a365866e6977fbe5d13a402c2cafad8678e25ae50af1cfb852`

Prior artifacts:
- run `36591956187` → `11044247238` · `sha256:eaf90c15aeb3853e2cb48868bfd1edb45f0d8af6c510f1ac948cfe3af484ca2d`
- run `36592599717` → `11043959677` · `sha256:112b23abeea1673b8f0ab8c66d16be047f434d4a9016c9a5b6c60b2e801fc6a1`

## Proven vs unknown
**PROVEN**
- old 1/30 live clamp discards wall-clock time below 30 FPS;
- deterministic QA did not exercise that live clock;
- broad Explore/Race/Ground Walk/Run/Stop remained green on all timing attempts;
- full required gate is still red after two repairs, so this candidate is not publishable.

**UNKNOWN**
- why legacy no-query Ground remains `Jump_Idle` at the final landing snapshot under the global catch-up candidate.
- legacy bounce/airtime, baseline Jump contract, and global timing ownership are hypotheses only.

## Salvage
- public Two-Gear runtime `4475271b...`: **REUSE_CANDIDATE / current public baseline**
- root-cause finding: **REUSE_CANDIDATE**
- bounded catch-up idea: **NEEDS_ISOLATED_TEST**
- global catch-up across Race/Explore/all Ground: **REJECTED_FOUNDATION for next attempt**
- atomic transient Jump QA: **REUSE_CANDIDATE**
- frozen `9431a89c...`: **ARCHIVED_FAILED**

## Exactly one next gate
**GROUND-WALLCLOCK-TRAVEL-ONLY-01**

Start a fresh branch from `542eedb91f96b6f718df9e619fb3d3f746b79854`, not from this frozen candidate.

Apply bounded wall-clock catch-up only to the explicit Travel profile `?ground=1&groundFeel=velocity&walkPace=travel`. Keep Race, Explore, measured/no-query Ground and existing Ground+Orbit baseline timing unchanged. Keep all speed constants unchanged. Prove 15-FPS wall-clock parity plus unchanged baseline regressions before republishing the same Stage.

No speed retune until that timing-only gate gets a human freeplay result.
