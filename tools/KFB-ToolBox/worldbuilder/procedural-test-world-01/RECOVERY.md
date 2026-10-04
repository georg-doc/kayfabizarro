# RECOVERY · WB2 convergence + Golden corridor

Status: **WORLD-CONVERGENCE-BASE-01 · BROWSER PASS · SOURCE REPAIR 1**

Owner: KFB WorldBuilder / WB2
Branch: `chatgpt-web/wb2-convergence-golden-corridor-01-2026-10-04`
Base main: `9a1f43b628126bb633ed95c99310288f0a5f1a7c`
Current implementation checkpoint: `74fae51ac6736f630f7f0e5ce0cc1f84540c66f8`

## Product reality

The proven WB2/R2D single-island owner is now re-homed on current main and has booted successfully in the real Chromium/WebGL proof.
No Player, Drive, Residents or Travel host are active.

## Current evidence

At `74fae51ac6736f630f7f0e5ce0cc1f84540c66f8`:
- Procedural Test World R2D Browser · run `37165723175` · job `111328087611` · **PASS**.
- KFB Production Resource Registry R0.1 · run `37165723168` · **PASS**.
- Procedural Test World 01 source · run `37165723177` · job `111328087463` · **FAIL**.

The source test has one deterministic contract mismatch visible from the committed files:
the test expects `SOURCE_PROVEN_P1_P2_GROUPING_MOUNTED_AND_BROWSER_VERIFIED`, while the rehome profile still said donor-proof/rehome-pending.
The browser run has now supplied that current-branch proof, so Repair Pass 1 updates only profile/evidence metadata and re-runs both gates.

Do not broaden this repair into world geometry.

## Proven donor evidence

PR #332 remains historical source provenance only.
Do not merge it or copy its stale Hub/router/Motion state.

## Next

Re-run source + browser after Repair Pass 1.
If both pass: mark WORLD-CONVERGENCE-BASE-01 PASS and begin WORLD-MULTI-ISLAND-CORRIDOR-01.
