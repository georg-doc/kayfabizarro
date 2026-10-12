# TEST REPORT — MASTERSELECTS_SOURCE_ISOLATED_AGENT_BRIDGE_PROOF_01

Date: 2026-10-12 · Executor: Claude Code (local macOS) · Mode: RESEARCH, source-isolated
Upstream pin: `Sportinger/MasterSelects` @ `db912a05028eada21d37ec76d5317a36de865af2` (v3.1.8, AGPL-3.0-only)
KFB research head: `georg-doc/kayfabizarro` / `planning/hybrid-baked-clay-texture-architecture-2026-10-07` @ `1128054cbcb7eac7e861a8d14ffd20533df0ac13`

## Commands actually run

```
git clone --filter=blob:none --no-checkout --branch planning/hybrid-baked-clay-texture-architecture-2026-10-07 --single-branch --depth 1 https://github.com/georg-doc/kayfabizarro
git clone --filter=blob:none https://github.com/Sportinger/MasterSelects && git checkout db912a05028eada21d37ec76d5317a36de865af2
npm install --no-audit --no-fund      # 536 packages, exit 0
npm run dev                            # Vite 7.3.6 on http://localhost:5173
npm run mcp:smoke
npm run test:security
npm run test:kernel-boundary
```

Browser driven with Playwright 1.63.0 (`channel: chrome`, headed, remote debugging 9222).
Project bootstrap used the upstream's OWN e2e technique from
`tests/playwright/fixtures/editorPage.ts` — `Reflect.deleteProperty(window, 'showDirectoryPicker'/'showSaveFilePicker')` —
which selects the documented OPFS storage backend. No upstream source file was modified (0 tracked changes).

## Automated test results

| Suite | Files | Tests | Result |
|---|---|---|---|
| `npm run mcp:smoke` | — | 12 control tools | PASS ("MasterSelects MCP smoke passed (12 tools)") |
| `npm run test:security` | 5 | 118 | 118 passed, 0 failed (16.94s) |
| `npm run test:kernel-boundary` | 4 | 42 | 42 passed, 0 failed (36.14s) |

Total automated: **160 tests passed, 0 failed**, plus the MCP smoke.

## Bridge / agent-control observations

- Live tool registry: **241 tools** on `devBridge`, **128** on `chat`.
- Policy split on devBridge: 78 read-only, 163 mutating, 16 requiring confirmation.
- Dry run (`moveClip`, `dryRun: true`): returned schema + policy, `requiresConfirmation: true`, and **did not mutate** the timeline (verified by re-reading `getTimelineState` immediately after).
- Confirmation gate is enforced even for `readOnly: true` tools that carry `sensitiveDataAccess: true` (`getStats`, `getRuntimeDiagnostics` both refused without `confirm: true`).
- Audited reversible edit: `setTransform` on `clip-mesh-1791799923142-1-ijvrb`
  - callId `bridge-mv53v0ot-d057bdec-6ef`, state revision **74 → 77**
  - before `pos(0,0,0) rot(0,0,0)` → after `pos(1.5,0,0) rot(0,45,0)` → `undo` → `pos(0,0,0) rot(0,0,0)`
  - `redo` restored the edited state, confirming a real two-way history branch.
- Durable audit record per call: args, `idempotencyKey`, `sessionId`, `source`, `startedAt`/`finishedAt`, `status`, `durationMs`, result with `stateRevisionBefore/After` and an entity diff (`created`/`updated`/`deleted`).
- Merged history endpoint returned **30 bridge calls + 30 browser audit entries** for the session.
- Explicit `sessionId` targeting worked; two tabs were connected and never confused.

## Persistence

- `saveProject` → `{"saved": true, "project": "donor-proof-01"}`.
- Full page reload (`page.reload()`), editor shell re-booted, **no Choose-project dialog** — the OPFS repository reopened the project automatically.
- Exact values survived the reload: `pos(2.25, -0.75, 0)`, `yaw 33`, `scaleAll 1.75`, identical `clipId` and `compositionId`, all 3 clips.
- This separates durable save from in-memory UI state: the values were read back after a fresh document load, not from the pre-reload session.

## Blocker — frozen seam

**3D raster readback is blank in this environment.**

- Composition preview canvas measured programmatically: 1920×1080, min = max = avg luma **0**, 0% non-black over 21 378 samples.
- Reproduced by the upstream's OWN verification tool `runWorkerFirstUniversal3dGoldenFixture`:
  `nonBlankRatio 0`, `meanLuma 0`, `avgRgb {0,0,0}`, identical fingerprint hash `1f116dc5` at t = 0 s, 1 s, 2 s; `failures: []`
  (the tool records observation data only and does not assert non-blank).
- Not caused by window occlusion: `document.visibilityState = visible`, `hasFocus = true`, window brought to front, playback started and stopped — luma stayed 0.
- Engine reported `engineReady: true`, non-zero `renderPass`/`build` timings, `layerCount: 1`, `drops.count 22406`.
- Scene state itself is correct and readable throughout (camera/light/model clips, scene-unit transforms, revision deltas).

Per the repair-budget rule this seam was frozen after the diagnostic passes rather than being retried further.

## Known upstream limitation recorded (not a defect found here)

`docs/Features/3D-Layers.md`: the shadow toggle is stored and shadow strength is keyframeable, but **shadow-map rendering is unavailable**.

## Security observation (local dev bridge)

The dev server prints and writes a bearer token to `.ai-bridge-token` and grants local file roots that include the user's
`Desktop`, `Documents`, `Downloads` and `Videos` directories, in addition to the project directory and the temp dir.
The token was not published and the server was run only on `localhost`. Treat this as a reason to keep the bridge off any
shared or exposed host.

---

# GATE 02 ADDENDUM — 2026-10-12

The "frozen seam" above was resolved. Full detail in `GATE_02_RESULT.md`; raw JSON in `raw_gate02/`.

## Correction to the Proof-01 blocker section

Proof 01 called the blank 3D readback an "environment/runtime condition" and left it UNKNOWN because no positive
control existed. Gate 02 supplied that control. The corrected statement is:

- The capture path **works** — `runWorkerFirstSolidTextImageGoldenFixture` renders at `nonBlankRatio 1`,
  `meanLuma 58.19`, hash `7a5c08a9`, repeatably on a freshly reloaded renderer.
- 3D content **never rendered**, in either browser launch mode, at any sample time past t=0.
- `GRAPH_SCENE` is therefore **FAIL**, not UNKNOWN.

Two candidate explanations raised in Proof 01 are now eliminated:
- *Software rasterizer / Playwright flags*: Playwright does pass `--enable-unsafe-swiftshader`, but the adapter
  resolved to `apple`/`metal-3` with ANGLE Metal Renderer Apple M4 in **both** arms. Hardware in both.
- *Occlusion / window focus*: already ruled out in Proof 01, and Arm B is an ordinary foreground Chrome window.

## Additional commands run

```
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --remote-debugging-port=9333 --user-data-dir=<temp> --no-first-run --no-default-browser-check \
  http://localhost:5173/
```

Fixture tools invoked through the bridge, unmodified:
`runWorkerFirstUniversal3dGoldenFixture` (3 runs), `runWorkerFirstSolidTextImageGoldenFixture` (4 runs).

## Measurement table

| Run | Browser | Fixture | t=0 | t=0.5 | t=1 | t=2 |
|---|---|---|---|---|---|---|
| A1 | Playwright Chrome | universal 3D | blank | — | blank | blank |
| B1 | normal Chrome | universal 3D | blank | — | blank | blank |
| B2 | normal Chrome | 2D | blank | luma 58.19 | luma 58.19 | — |
| B3 | normal Chrome | universal 3D | blank | — | blank | blank |
| B4 | normal Chrome | 2D | blank | blank | blank | — |
| C1 | normal Chrome, fresh reload | 2D | blank | luma 58.19 | luma 58.19 | — |
| C2 | normal Chrome, same session | universal 3D | blank | — | blank | blank |
| C3 | normal Chrome, same session | 2D | blank | luma 58.19 | blank | — |

Blank fingerprint hash `1f116dc5`; rendered 2D fingerprint hash `7a5c08a9`.

## Secondary findings

- The universal 3D fixture contains solid, image and text clips alongside the mesh. Those element types render
  on their own (B2/C1) but produce nothing once the 3D content is present — the 3D pass suppresses the whole frame.
- After a 3D run the 2D path degrades (B4 fully blank, C3 partially blank), indicating the renderer is left in a
  bad state rather than merely drawing nothing.
- `t=0` is unreliable for every fixture, 2D included; conclusions rest on t≥0.5.
- Both golden-fixture tools return `failures: []` even when every captured frame is blank. They record observation
  data only. **A green run from these tools is not evidence that anything rendered** — read the fingerprints.

## Environment limit encountered

`screencapture` is unavailable to this process ("could not create image from display" — Screen Recording permission
not granted), so no browser-independent OS screenshot could be taken. The in-browser positive control compensates.
