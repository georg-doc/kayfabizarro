# KFB Container Turbo-01 · Checkpoint A Test Report

Source head: `435b242564f92fdc3a3ec6b40af91398f7c11168`

## Static/source evidence
- 34/34 checks PASS.
- 20 protected upstream runtime files retain the exact Turbo Kart Rally donor blob SHA.
- Only `src/main.js` is modified for the additive EXPLORE path.
- Modified bootstrap parses after ESM import stripping.
- EXPLORE source invariants present: one player kart, items off, race update bypass, chase camera path, pause/visibility handling, direct `?explore=1` route, race-finish guard.
- Race mode remains the regression control.

## Browser evidence
PENDING at publication time. The branch-scoped Actions workflow did not start, so no browser PASS is inferred from it.

## Human question
Does EXPLORE retain the original Turbo Kart driving/camera feel when used as free roam?
