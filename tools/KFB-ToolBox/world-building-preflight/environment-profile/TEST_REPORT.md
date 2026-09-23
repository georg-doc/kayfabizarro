# WB1-P1 · Environment Profile · Test Report

Status: **CANDIDATE · STATIC TESTS PASS · BROWSER / VISIBLE PROOF BLOCKED**
Date: 2026-09-23
Repository: `georg-doc/kayfabizarro`
Branch: `chatgpt-web/world-builder-p1-environment-profile-2026-09-23`
Implementation checkpoint: `bbf9a8ead0750dcb69be68d4d1a2a7136bd25ceb`

## Scope

This report covers WB1-P1 only: the isolated WhackMan-derived Environment Profile candidate under
`tools/KFB-ToolBox/world-building-preflight/environment-profile/`.

It does **not** start WB1-P2, does not create a WorldBuilder UI and does not publish Cloudflare Stage.

## Repository-native tests actually run

Command:

```bash
node test/profile-core.test.mjs
node --check profile-core.mjs
node --check material-profile.mjs
node --check environment-rig.mjs
node --check demo.mjs
```

Result: **8/8 PASS**, plus **4/4 syntax checks PASS**.

| # | Check | Result |
|---|---|---|
| 1 | schema is `kfb.environment-profile/1` | PASS |
| 2 | Environment Profile does not own MaterialProfileRef | PASS |
| 3 | nearest-light pool never exceeds configured maximum 6 | PASS |
| 4 | torch flicker differs across independent pool phases | PASS |
| 5 | local visibility changes independently of global dusk/background/fog | PASS |
| 6 | `WHACKMAN_MATTE_CANDIDATE` restores exactly to SOURCE material state | PASS |
| 7 | runtime source contains no WhackMan movement / MazeGraph dependency markers | PASS |
| 8 | source-truth P1 calibration retained: exposure 1.0, fog .019, decay 2, range 18, local 46 / decay 1.6 | PASS |

## Source-object-first contract

The demo is coded to begin in **SOURCE TORCH** mode using the real
`torch_mounted.gltf` donor. It imports the existing owner functions `collectTris()` and
`measureFlame()`, measures the flame point from the loaded source geometry, and keeps the
ENVIRONMENT button disabled until the source object has rendered for multiple animation frames.

This is an implementation contract only at this stage. The required visible proof was **not observed**
because the browser transport was blocked before page load.

## Browser / visual gate

Two bounded browser attempts were made with system Chromium:

1. Local HTTP: `http://127.0.0.1:4176/`
2. Same local files through an intercepted test origin: `https://wb1p1.test/index.html`

Both stopped **before application code or HTML loaded** with:

`net::ERR_BLOCKED_BY_ADMINISTRATOR`

Per the KFB two-repair-pass rule, no third attempt was made.

Actual browser evidence:
- successful page loads: **0**
- application console assertions executed: **0**
- verified console-error count: **UNKNOWN**
- source-object visible proof: **NOT OBSERVED**
- screenshot count: **0**
- interactive control tests: **0**
- Cloudflare publication: **0 / prohibited by this slice**

The browser failure is therefore a test-transport blocker, not evidence of a runtime failure and not evidence of runtime success.

## Optional Game Development Studio

`game-dev` was unavailable in the execution environment. Sealed Game Development Studio evidence is
not required by WB1-P1, so the slice used repository-native tests as the documented fallback.

## Gate result

WB1-P1 is **not complete** because the required source-object visual proof, zero-console-error browser
assertion and screenshot could not be observed.

Exactly one next gate:

**WB1-P1 Browser Verify · run the persisted Portable Preview outside the restricted browser container,
verify SOURCE TORCH first, then ENVIRONMENT; capture visible proof + console result.**

WB1-P2 remains HOLD.
